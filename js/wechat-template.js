(function () {
    // Owns the WeChat DOM template and mounts it before behavior scripts run.
    window.WC_APP_HTML = `
    <!-- 关联表情包复古弹窗容器 -->
    <div class="wc-bind-emoji-overlay" id="wcBindEmojiOverlay" onclick="this.classList.remove('show')">
        <!-- 内容由 JS 动态生成 -->
    </div>

    <!-- ==========================================
         微信 APP 容器 (已进行命名空间隔离)
         ========================================== -->
    <div class="wechat-app-container" id="wechatAppUI">

        <!-- 微信登录页 -->
        <div id="page-wc-login" class="page active">
            <div class="wc-auth-nav-bar">
                <div class="wc-auth-nav-back" onclick="closeWechatApp()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    返回
                </div>
            </div>
            <div class="wc-auth-content">
                <div class="wc-auth-logo-container">
                    <div class="wc-auth-logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Google-Buzz-Logo--Streamline-Logos" height="24" width="24">
                          <path fill="currentColor" fill-rule="evenodd" d="M19.047 17.527C17.14 18.759 14.681 19.5 12 19.5c-0.76 0 -1.502 -0.06 -2.22 -0.173 -3.044 2.155 -5.795 1.843 -7.004 1.238 1.21 -0.956 1.932 -2.302 1.932 -3.2a26.078 26.078 0 0 1 -0.017 -0.013l7.544 -6.784 6.812 6.959Zm1.209 -0.91 -6.905 -7.052 5.676 -5.105C21.454 6.02 23 8.37 23 11c0 2.153 -1.036 4.12 -2.744 5.617Zm-2.624 -12.92L8.733 11.7 3.124 5.978C5.126 3.869 8.356 2.5 12 2.5c2.058 0 3.985 0.437 5.632 1.197ZM2.183 7.161C1.427 8.314 1 9.618 1 11c0 2.051 0.94 3.932 2.506 5.4l4.11 -3.696L2.184 7.16Z" clip-rule="evenodd" stroke-width="1"></path>
                        </svg>
                    </div>
                </div>
                <div class="wc-auth-header-title">登录wechat</div>
                <div class="wc-auth-header-subtitle">请输入您的账号和密码。</div>

                <div class="wc-auth-form-group">
                    <div class="wc-auth-form-input-wrapper">
                        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <input type="text" class="wc-auth-form-input" placeholder="微信号 / 手机号">
                    </div>
                </div>
                <div class="wc-auth-form-group">
                    <div class="wc-auth-form-input-wrapper">
                        <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input type="password" class="wc-auth-form-input" placeholder="密码">
                        <div class="wc-auth-pwd-toggle" onclick="wcTogglePasswordVisibility(this)">
                            <svg viewBox="0 0 24 24" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                    </div>
                </div>

                <button class="wc-auth-btn-primary" onclick="wcPerformLogin()">登录</button>

                <div class="wc-auth-switch-link">
                    还没有账号？ <span onclick="wcSwitchAuthPage('page-wc-register')">注册</span>
                </div>
            </div>
        </div>

        <!-- 微信注册页 -->
        <div id="page-wc-register" class="page">
            <div class="wc-auth-nav-bar">
                <div class="wc-auth-nav-back" onclick="closeWechatApp()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    返回
                </div>
            </div>
            <div class="wc-auth-content">
                <div class="wc-auth-header-title">注册</div>
                <div class="wc-auth-header-subtitle">创建一个新账号以连接好友。</div>

                <div class="wc-auth-avatar-upload-container">
                    <div class="wc-auth-avatar-upload" id="wc-register-avatar-preview" onclick="wcOpenUserMaskSelect()">
                        <svg class="wc-auth-cam-icon" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        <div class="wc-auth-avatar-badge">
                            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                    </div>
                </div>

                <div class="wc-auth-form-group">
                    <div class="wc-auth-form-input-wrapper">
                        <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <input type="tel" class="wc-auth-form-input" id="wc-reg-phone" placeholder="手机号">
                    </div>
                </div>
                <div class="wc-auth-form-group">
                    <div class="wc-auth-form-input-wrapper">
                        <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input type="password" class="wc-auth-form-input" id="wc-reg-pwd" placeholder="密码">
                        <div class="wc-auth-pwd-toggle" onclick="wcTogglePasswordVisibility(this)">
                            <svg viewBox="0 0 24 24" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                    </div>
                </div>
                <div class="wc-auth-form-group">
                    <div class="wc-auth-form-input-wrapper">
                        <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input type="password" class="wc-auth-form-input" id="wc-reg-pwd-confirm" placeholder="确认密码">
                        <div class="wc-auth-pwd-toggle" onclick="wcTogglePasswordVisibility(this)">
                            <svg viewBox="0 0 24 24" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                    </div>
                </div>

                <button class="wc-auth-btn-primary" onclick="wcRegisterAccount()">注册</button>

                <div class="wc-auth-switch-link">
                    已有账号？ <span onclick="wcSwitchAuthPage('page-wc-login')">登录</span>
                </div>
            </div>
        </div>

        <!-- 绑定 User 面具抽屉 (半屏 Drawer) -->
        <div class="wc-user-drawer-overlay" id="wcUserMaskDrawerOverlay" onclick="wcCloseUserMaskDrawer()">
            <div class="wc-user-drawer" onclick="event.stopPropagation()">
                <div class="wc-user-drawer-header">
                    <div class="wc-user-drawer-handle"></div>
                    <div class="wc-user-drawer-title">选择要绑定的 User 面具</div>
                </div>
                <div class="wc-user-drawer-body" id="wcUserMaskDrawerList">
                    <!-- 动态渲染 User 列表 -->
                </div>
            </div>
        </div>

        <div id="page-chat-list" class="page">
            <div class="list-header">

                <div class="title" onclick="closeWechatApp()" style="cursor: pointer;">Wechat</div>
                <div class="more-btn"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg></div>
            </div>
            <div class="search-container">
                <div class="search-bar"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>搜索聊天</span></div>
            </div>
            <div class="chat-list">
            </div>
            <div class="fab-container">
                <div class="fab-small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" /><path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg></div>
                <button class="fab-large wc-add-friend-fab" type="button" onclick="wcOpenAddFriendPanel()" aria-label="添加好友" title="添加好友"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2649 8.18054C20.7681 6.96199 20.03 5.8565 19.0949 4.93054C17.6965 3.53121 15.9144 2.57813 13.9742 2.19186C12.0339 1.80559 10.0227 2.00351 8.19492 2.76055C6.98162 3.26722 5.87795 4.00411 4.94492 4.93054C4.01541 5.85775 3.27881 6.95994 2.77763 8.17343C2.27644 9.38691 2.02063 10.6876 2.02494 12.0005C2.01395 13.2943 2.26569 14.5769 2.76493 15.7705L2.26493 19.4206C2.1849 19.7288 2.1849 20.0523 2.26493 20.3606C2.35093 20.6666 2.50864 20.9476 2.72495 21.1805C2.94509 21.4073 3.21579 21.5786 3.51493 21.6805C3.81143 21.7779 4.1271 21.8019 4.43492 21.7505L8.09495 21.2105C9.32038 21.7373 10.6411 22.0062 11.975 22.0005C14.6269 22 17.17 20.946 19.045 19.0706C19.9797 18.1482 20.7179 17.0461 21.2149 15.8306C22.2289 13.3814 22.2289 10.6297 21.2149 8.18054H21.2649ZM15.665 12.6905H12.7549V15.5806C12.7549 15.8458 12.6496 16.1001 12.462 16.2877C12.2745 16.4752 12.0201 16.5806 11.7549 16.5806C11.4897 16.5806 11.2354 16.4752 11.0478 16.2877C10.8603 16.1001 10.7549 15.8458 10.7549 15.5806V12.6905H7.86491C7.59969 12.6905 7.34535 12.5852 7.15782 12.3976C6.97028 12.2101 6.86491 11.9558 6.86491 11.6905C6.86491 11.4253 6.97028 11.171 7.15782 10.9835C7.34535 10.7959 7.59969 10.6905 7.86491 10.6905H10.7549V7.79055C10.7549 7.52534 10.8603 7.27097 11.0478 7.08343C11.2354 6.89589 11.4897 6.79055 11.7549 6.79055C12.0201 6.79055 12.2745 6.89589 12.462 7.08343C12.6496 7.27097 12.7549 7.52534 12.7549 7.79055V10.6905H15.665C15.9302 10.6905 16.1845 10.7959 16.372 10.9835C16.5596 11.171 16.665 11.4253 16.665 11.6905C16.665 11.9558 16.5596 12.2101 16.372 12.3976C16.1845 12.5852 15.9302 12.6905 15.665 12.6905Z" fill="currentColor"/></svg></button>
            </div>
        </div>

        <!-- 联系人页面 -->
        <div id="page-contacts" class="page">
            <div class="list-header">
                <div class="title" onclick="closeWechatApp()" style="cursor: pointer;">Friend</div>
            </div>
            <div class="search-container">
                <div class="search-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="search for" style="border: none; background: transparent; font-size: 16px; color: var(--text-main); width: 100%; outline: none;">
                </div>
            </div>
            <div class="wc-top-tabs" id="wcTopTabsContainer">
                <!-- 动态渲染 Tabs -->
            </div>
            <div class="wc-scroll-area" id="wcContactListArea">
                <div class="wc-status-hint" onclick="wcEditStatusHintText()" style="cursor: pointer;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    <span id="wcStatusHintText">Logged in to Weixin for Windows...</span>
                </div>
                <div id="wcDynamicContent"></div>
            </div>

            <!-- 移动分组 Action Sheet -->
            <div class="wc-action-sheet-overlay" id="wcMoveSheetOverlay" onclick="wcCloseMoveSheet()">
                <div class="wc-action-sheet" onclick="event.stopPropagation()">
                    <div class="wc-sheet-group" id="wcMoveSheetGroupList">
                        <!-- 动态渲染分组列表 -->
                    </div>
                    <div class="wc-sheet-cancel" onclick="wcCloseMoveSheet()">取消</div>
                </div>
            </div>
        </div>

        <div id="page-chat-room" class="page" onclick="wcCloseMenu(event); if(typeof wcCloseEmojiPanel==='function') wcCloseEmojiPanel(); if(typeof wcCloseFunctionPanel==='function') wcCloseFunctionPanel();">
            <div class="chat-header-container">
                <div class="room-icon-btn frosted-glass" onclick="wcCloseChat()"><svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
                <div class="room-info-capsule frosted-glass"><div class="avatar"></div><div class="room-info-text"><div class="name"></div><div class="sub"></div></div></div>
                <div class="room-icon-btn fill-icon frosted-glass" onclick="wcToggleMenu(event)"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg></div>
            </div>
             <div class="dropdown-menu" id="wc-dropdown-menu">
                <div class="menu-item" onclick="wcHandleMenuClick('心声系统')">
                    <svg t="1789622129088" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2926" width="20" height="20"><path d="M724.945455 50.036364c-80.290909 0-155.927273 32.581818-211.781819 93.090909 0 1.163636-1.163636 1.163636-2.327272 0-55.854545-59.345455-131.490909-93.090909-211.781819-93.090909C133.818182 50.036364 0 190.836364 0 364.218182c0 30.254545 4.654545 59.345455 11.636364 84.945454 0 1.163636 1.163636 1.163636 1.163636 1.163637h202.472727c6.981818 0 75.636364-154.763636 76.8-158.254546 29.090909-58.181818 89.6-46.545455 102.4 18.618182L430.545455 502.690909c2.327273 12.8 19.781818 13.963636 24.436363 2.327273l26.763637-60.509091c26.763636-58.181818 87.272727-51.2 103.563636 11.636364l8.145454 33.745454c2.327273 10.472727 16.290909 13.963636 23.272728 4.654546l26.763636-33.745455c6.981818-10.472727 19.781818-16.290909 32.581818-16.290909h152.436364c22.109091 0 39.563636 20.945455 39.563636 45.381818S850.618182 535.272727 828.509091 535.272727h-108.218182c-16.290909 0-31.418182 8.145455-41.890909 20.945455L640 608.581818c-34.909091 47.709091-90.763636 34.909091-105.890909-24.436363l-1.163636-13.963637c-2.327273-9.309091-15.127273-10.472727-18.618182-1.163636L477.090909 653.963636c-27.927273 60.509091-89.6 50.036364-102.4-16.290909L337.454545 442.181818c-2.327273-11.636364-18.618182-13.963636-24.436363-3.490909l-41.890909 80.290909c-6.981818 13.963636-22.109091 23.272727-37.236364 23.272727H53.527273c-1.163636 0-2.327273 1.163636-1.163637 2.327273 10.472727 18.618182 22.109091 34.909091 31.418182 50.036364 104.727273 159.418182 367.709091 356.072727 379.345455 363.054545 15.127273 10.472727 31.418182 16.290909 48.872727 16.290909s34.909091-5.818182 48.872727-16.290909c11.636364-8.145455 273.454545-204.8 379.345455-363.054545 34.909091-53.527273 83.781818-126.836364 83.781818-230.4 0-173.381818-133.818182-314.181818-299.054545-314.181818z m0 0" fill="#000000" p-id="2927"></path></svg>
                    <span>心声系统</span>
                </div>
                <div class="menu-item" onclick="wcHandleMenuClick('聊天设置')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    <span>聊天设置</span>
                </div>
                <div class="menu-item" onclick="wcHandleMenuClick('聊天美化')"><svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg><span>聊天美化</span></div>
                <div class="menu-item" onclick="wcHandleMenuClick('搜索聊天记录')"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>搜索聊天记录</span></div>
                <div class="menu-item" onclick="wcHandleMenuClick('清空聊天记录')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg><span>清空聊天记录</span></div>
            </div>
            <div class="chat-area" id="wc-chat-area" onclick="if(typeof wcCloseEmojiPanel==='function') wcCloseEmojiPanel(); if(typeof wcCloseFunctionPanel==='function') wcCloseFunctionPanel();">
            </div>

            <!-- 气泡长按菜单 -->
            <div class="wc-bubble-menu-overlay" id="wcBubbleMenuOverlay" onclick="wcCloseBubbleMenu()">
                <div class="wc-bubble-menu-container" id="wcBubbleMenuContainer">
                    <!-- Emoji 悬浮胶囊 -->
                    <div class="wc-bubble-emojis-capsule" id="wcBubbleEmojisCapsule" onclick="event.stopPropagation()">
                        <div class="wc-bubble-emojis-scroll-area" id="wcBubbleEmojisScroll">
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('💩')">💩</span>
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('❤️')">❤️</span>
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('👍')">👍</span>
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('👎')">👎</span>
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('🔥')">🔥</span>
                            <span class="wc-bubble-menu-emoji" onclick="wcAddReaction('🥰')">🥰</span>

                            <!-- 展开后显示的更多 Emoji -->
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('👏')">👏</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('😂')">😂</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('😭')">😭</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🥺')">🥺</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('😡')">😡</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🤔')">🤔</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('😎')">😎</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🙏')">🙏</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🎉')">🎉</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('💔')">💔</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('💯')">💯</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('✨')">✨</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('👀')">👀</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🤮')">🤮</span>
                            <span class="wc-bubble-menu-emoji extra-emoji" onclick="wcAddReaction('🤡')">🤡</span>
                        </div>
                        <!-- 展开按钮 -->
                        <div class="wc-bubble-menu-more" id="wcBubbleMenuExpandBtn" onclick="wcToggleEmojiExpand(true)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <!-- 收起按钮 -->
                        <div class="wc-bubble-menu-more collapse-btn" id="wcBubbleMenuCollapseBtn" onclick="wcToggleEmojiExpand(false)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </div>
                        <div class="wc-bubble-emojis-tail-1"></div>
                        <div class="wc-bubble-emojis-tail-2"></div>
                    </div>
                    <!-- 固定操作菜单 -->
                    <div class="wc-bubble-action-menu" onclick="event.stopPropagation()">
                        <div class="wc-bubble-menu-item" id="wc-bubble-menu-recall" onclick="wcMenuAction('recall')" style="display: none;">
                            <svg t="1791303339408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19353" width="200" height="200"><path d="M862.993067 924.16h5.9392c16.145067 0 27.6992-17.271467 38.843733-34.116267 35.208533-207.803733 11.502933-366.984533-70.468267-473.156266-29.969067-36.283733-71.645867-71.645867-111.394133-94.5152-29.166933-17.698133-70.843733-29.696-111.172267-41.284267l-0.392533-0.1024c-34.594133-5.802667-70.365867-11.793067-93.764267-11.793067h-2.56V153.941333c-2.935467-17.493333-9.472-39.0656-34.030933-51.438933-22.254933-11.229867-50.449067 5.819733-56.029867 11.400533L138.6496 399.342933l-0.1024 0.085334c-28.330667 22.903467-40.413867 45.431467-40.413867 75.3664 0 34.440533 28.4672 56.712533 32.887467 56.900266l0.989867 0.0512 0.802133 0.699734 283.2896 279.483733c22.954667 23.04 45.1584 28.7232 67.84 17.390933 27.818667-16.861867 34.116267-56.541867 34.116267-63.146666v-109.0048l1.877333-0.512c66.5088-18.3296 131.805867-11.741867 179.131733 18.107733 94.225067 65.348267 130.628267 208.264533 130.986667 209.7152l0.068267 0.6144v11.281067c12.322133 24.610133 24.029867 27.784533 32.8704 27.784533z m-134.024534-317.730133c-38.9632-22.459733-96.8704-36.5568-131.498666-38.382934-35.328-1.860267-75.400533 0.648533-119.0912 7.458134l-22.647467 7.867733v155.409067c0 6.434133-2.577067 11.332267-6.7072 12.8-0.768 0.273067-1.655467 0.4608-2.6624 0.4608-3.2256 0-7.611733-1.860267-13.0048-8.516267L184.832 482.048c-0.750933-0.750933-6.1952-6.4512-6.1952-12.731733 0-1.5872 1.245867-7.6288 17.288533-18.466134L445.0816 178.346667h9.1648v8.0384l1.467733 166.912h24.7296c0.7168 0.034133 63.3344 2.474667 117.4016 7.901866l0.477867 0.1024c6.877867 2.082133 13.8752 4.061867 21.2992 6.144 51.438933 14.523733 109.738667 30.976 153.207467 89.2928 51.0976 67.0208 96.853333 147.968 85.5552 285.218134l-0.8192 10.018133-4.061867-9.181867c-22.510933-50.858667-66.747733-99.2768-124.535467-136.362666z" fill="currentColor" stroke="currentColor" stroke-width="18" stroke-linejoin="round" p-id="19354"></path></svg>
                            <span>撤回</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('reply')">
                            <svg t="1791303276319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14184" width="200" height="200"><path d="M757.76 94.866c81.189 4.755 154.478 44.91 192.366 134.217 38.546 90.698 21.357 175.178-45.056 247.223-47.031 51.054-97.573 98.816-146.944 147.603-21.431 21.211-55.808 21.942-74.387 2.34-18.797-19.748-16.75-46.958 5.852-69.705 48.494-48.713 97.646-96.768 145.554-145.92 72.265-74.094 40.229-191.854-59.611-218.478-41.545-10.971-81.408-3.364-113.006 26.112-50.761 47.324-98.597 97.72-149.211 145.189-10.68 10.02-28.453 18.724-42.35 17.774-37.157-2.195-56.028-47.397-30.281-74.314a3238.62 3238.62 0 0 1 171.3-167.936c36.133-32.548 83.237-43.739 145.774-44.032zM94.647 746.642a223.159 223.159 0 0 1 65.609-160.475c48.055-49.079 96.914-97.426 145.7-145.847 23.187-22.967 51.64-24.722 71.242-4.974 20.48 20.627 18.432 46.592-5.705 70.949-46.446 46.665-93.623 92.672-139.63 139.849-56.832 58.222-59.246 136.777-6.876 189.586 50.176 50.469 133.12 50.761 185.49-0.365 47.544-46.52 93.99-94.355 141.459-140.947 28.526-27.94 71.9-17.993 79.433 19.603a56.905 56.905 0 0 1-12.068 43.885c-51.64 54.419-103.205 109.422-159.452 158.867-68.9 60.562-149.577 70.582-233.691 33.865-81.335-35.475-131.292-115.42-131.511-203.996z m278.382-136.045L610.962 372.59A51.2 51.2 0 1 1 683.374 445L445.44 682.935a51.2 51.2 0 1 1-72.411-72.412z" p-id="14185"></path></svg>
                            <span>引用</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('rewind')">
                            <svg t="1791301036246" class="icon" viewBox="0 0 1125 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6467" width="200" height="200"><path d="M446.257277 951.034813a48.66778 48.66778 0 0 1 61.582618-35.898872c15.395654 5.107563 30.791309 5.107563 46.186964 10.288091a49.324466 49.324466 0 1 1-15.395655 97.48149c-20.503218-5.107563-35.898872-5.107563-56.402089-10.288091A47.135511 47.135511 0 0 1 446.257277 951.034813z m287.263941-46.186963a52.097143 52.097143 0 0 1 66.690181 35.898872 50.273014 50.273014 0 0 1-35.898872 66.690181c-20.503218 5.107563-35.898872 10.288091-56.402089 15.395654a52.316039 52.316039 0 0 1-20.503218-102.589053z m-461.650737-71.797744a49.835223 49.835223 0 0 1 71.797744-5.107563 155.853639 155.853639 0 0 0 35.898872 25.61078 52.097143 52.097143 0 0 1-56.40209 87.558225 281.864517 281.864517 0 0 1-46.186963-35.898872 54.504995 54.504995 0 0 1-5.107563-71.797744z m692.439624 56.402089a361.542501 361.542501 0 0 1-46.186964 35.898872 51.294526 51.294526 0 0 1-61.582618-82.085835 90.039041 90.039041 0 0 0 25.610781-20.503218l10.288091-10.288091 5.107563-5.107563 5.107564-5.107563a406.634987 406.634987 0 0 0 117.984707-292.371504 410.356211 410.356211 0 0 0-820.712423 0 51.294526 51.294526 0 0 1-102.589052 0 512.945264 512.945264 0 0 1 1025.817562 5.107563 529.727257 529.727257 0 0 1-148.776016 364.169248l-5.107563 5.107563z" p-id="6468"></path><path d="M112.879338 669.316226L10.290286 546.223956A74.13263 74.13263 0 0 1 0.002194 510.325084a49.324466 49.324466 0 0 1 30.791309-46.186963h220.57376a30.864274 30.864274 0 0 1 20.503218 5.107563 46.478824 46.478824 0 0 1 30.791309 46.186963 94.854743 94.854743 0 0 1-10.288092 35.898872L189.71168 674.642685l-5.107563 5.107563c-5.107563 5.107563-10.288091 5.107563-15.395654 10.288092h-41.006435c-5.107563 0-10.288091-5.107563-15.395655-10.288092z m446.255084-410.356211V520.54021a54.57796 54.57796 0 0 0 51.07563 46.186964h158.991143a54.57796 54.57796 0 0 0 46.186963-51.075631v-5.107563a54.57796 54.57796 0 0 0-51.075631-46.186964H661.723474V254.071348a54.57796 54.57796 0 0 0-51.07563-46.186964 48.448884 48.448884 0 0 0-51.586388 50.856736z" p-id="6469"></path></svg>
                            <span>回溯</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('favorite')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                            </svg>
                            <span>收藏</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('edit')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                            </svg>
                            <span>编辑</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('multiselect')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 5h8"></path>
                                <path d="M13 12h8"></path>
                                <path d="M13 19h8"></path>
                                <path d="m3 17 2 2 4-4"></path>
                                <path d="m3 7 2 2 4-4"></path>
                            </svg>
                            <span>多选</span>
                        </div>
                        <div class="wc-bubble-menu-item" onclick="wcMenuAction('delete')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
            </div>

            <form class="footer-capsule" id="wcFooterCapsule" onsubmit="wcHandleChatSubmit(event)" style="transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);">
                <div class="wc-online-narration-status" id="wc-online-narration-status" role="status" aria-live="polite" hidden>
                    <span class="wc-online-narration-status-text">正在输入动作描写</span>
                    <button type="button" class="wc-online-narration-status-close" onclick="wcExitOnlineNarrationMode(event)" aria-label="退出线上旁白">×</button>
                </div>
                <!-- 引用预览区 -->
                <div class="wc-reply-preview" id="wcReplyPreview">
                    <div class="wc-reply-preview-content">
                        <div class="wc-reply-preview-name" id="wcReplyPreviewName">Name</div>
                        <div class="wc-reply-preview-text" id="wcReplyPreviewText">Text</div>
                    </div>
                    <div class="wc-reply-preview-close" onclick="wcCloseReplyPreview()">
                        <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <svg class="tool-icon" onclick="wcToggleEmojiPanel(event)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="stroke: none;"><path d="M10.5199 19.8634C10.5955 18.6615 10.8833 17.5172 11.3463 16.4676C9.81124 16.3252 8.41864 15.6867 7.33309 14.7151L8.66691 13.2248C9.55217 14.0172 10.7188 14.4978 12 14.4978C12.1763 14.4978 12.3501 14.4887 12.5211 14.471C14.227 12.2169 16.8661 10.7083 19.8634 10.5199C19.1692 6.80877 15.9126 4 12 4C7.58172 4 4 7.58172 4 12C4 15.9126 6.80877 19.1692 10.5199 19.8634ZM19.0233 12.636C15.7891 13.2396 13.2396 15.7891 12.636 19.0233L19.0233 12.636ZM22 12C22 12.1677 21.9959 12.3344 21.9877 12.5L12.5 21.9877C12.3344 21.9959 12.1677 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10 10C10 10.8284 9.32843 11.5 8.5 11.5C7.67157 11.5 7 10.8284 7 10C7 9.17157 7.67157 8.5 8.5 8.5C9.32843 8.5 10 9.17157 10 10ZM17 10C17 10.8284 16.3284 11.5 15.5 11.5C14.6716 11.5 14 10.8284 14 10C14 9.17157 14.6716 8.5 15.5 8.5C16.3284 8.5 17 9.17157 17 10Z"></path></svg>
                <input type="text" id="wc-chat-input" placeholder="广播" enterkeyhint="send" onclick="wcCloseEmojiPanel()" oninput="wcHandleChatInputChange()">
                <svg class="tool-icon" onclick="wcToggleFunctionPanel(event)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                <div class="room-send-btn" id="wc-api-reply-btn" onclick="wcHandleSendOrApiReply()" title="调取 API 生成回复" aria-label="调取 API 生成回复">
                    <svg class="wc-send-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Send-Email--Streamline-Core" height="20" width="20"><g id="send-email--mail-send-email-paper-airplane"><path id="Subtract" fill="currentColor" fill-rule="evenodd" d="M11.8214 0.0977331c0.2883 -0.1052509 0.6005 -0.1264465 0.9005 -0.0610159 0.3029 0.0660858 0.5805 0.2177638 0.7997 0.4370018 0.2192 0.219238 0.3709 0.496818 0.437 0.799741 0.0654 0.29992 0.0442 0.6122 -0.061 0.90043l-3.574 10.71201 -0.0002 0.0007c-0.0871 0.2634 -0.2404 0.5001 -0.4453 0.6873 -0.2043 0.1867 -0.45301 0.3178 -0.72238 0.381 -0.26942 0.0657 -0.55131 0.0601 -0.81798 -0.0161 -0.26643 -0.0761 -0.50848 -0.2201 -0.70245 -0.4179l-1.91734 -1.9086 -2.01406 1.0415c-0.15705 0.0812 -0.34532 0.0734 -0.49515 -0.0205 -0.14982 -0.0938 -0.23893 -0.2599 -0.23434 -0.4366l0.08257 -3.18376 7.04493 -5.11741c0.2793 -0.20286 0.3413 -0.59371 0.1384 -0.87298 -0.2029 -0.27928 -0.59371 -0.34122 -0.87299 -0.13836L2.20283 8.0884 0.473125 6.35869l-0.000058 -0.00005 -0.000126 -0.00013c-0.187323 -0.18719 -0.325225 -0.41797 -0.4013217 -0.67163 -0.07555546 -0.25185 -0.0878308 -0.51841 -0.0357814 -0.77609 0.0521166 -0.28151 0.1779581 -0.54421 0.3647391 -0.76128 0.18806 -0.21856 0.431073 -0.38293 0.703923 -0.47612l0.00337 -0.00115 0 0.00001L11.8214 0.0977331Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>
                    <svg class="wc-stop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></svg>
                </div>
            </form>

            <!-- 悬浮功能面板 -->
            <div class="wc-function-panel" id="wcFunctionPanel" onclick="event.stopPropagation()">
                <div class="wc-function-grid">
                    <div class="wc-function-item" onclick="wcRegenerateLastMessage()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">重新生成</div>
                    </div>
                    <div class="wc-function-item" onclick="wcSendVoiceMessage()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M504.7182218666667 708.6080000000001c101.94488853333334 0 184.47170346666664-82.52681493333333 184.47170453333334-184.47170346666664V218.3016298666667c0-101.94488853333334-82.52681493333333-184.47170346666664-184.47170453333334-184.47170346666664s-184.47170346666664 82.52681493333333-184.47170346666664 184.47170346666664V524.1362965333334c2.427259733333333 101.94488853333334 82.52681493333333 184.47170346666664 184.47170346666664 184.47170346666664z" fill="currentColor"></path><path d="M791.1348149333332 390.63703680000003c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995v99.5176288c0 138.35377813333335-111.6539264 250.00770346666667-250.0077045333333 250.0077045333333s-250.00770346666667-111.6539264-250.00770346666667-250.0077045333333v-109.22666666666667c0-19.4180736-16.990814933333333-36.40888853333333-36.40888853333333-36.40888853333333s-36.40888853333333 16.990814933333333-36.408889599999995 36.40888853333333v109.22666666666667c0 165.05362986666665 126.2174816 303.4074069333333 286.4165930666667 320.39822293333333v77.67229546666667h-121.3629632c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995s16.990814933333333 36.40888853333333 36.40888853333333 36.40888853333333h315.54370346666667c19.4180736 0 36.40888853333333-16.990814933333333 36.408889599999995-36.40888853333333s-16.990814933333333-36.40888853333333-36.408889599999995-36.408889599999995h-121.36296213333333v-77.67229546666667c160.19911146666666-16.990814933333333 286.4165930666667-155.34459306666668 286.416592-320.39822293333333V427.0459264c0-21.845333333333333-16.990814933333333-36.40888853333333-36.40888853333333-36.408889599999995z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">语音</div>
                    </div>
                    <div class="wc-function-item" onclick="wcSimulateSendImage()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M871.537778 118.328889h-728.177778c-38.684444 0-68.266667 29.582222-68.266667 68.266667v634.88c0 36.408889 29.582222 68.266667 68.266667 68.266666h728.177778c36.408889 0 68.266667-31.857778 68.266666-68.266666V186.595556c0-36.408889-29.582222-68.266667-68.266666-68.266667z m-573.44 116.053333c38.684444 0 72.817778 31.857778 72.817778 72.817778s-31.857778 72.817778-72.817778 72.817778c-38.684444 0-72.817778-31.857778-72.817778-72.817778s34.133333-72.817778 72.817778-72.817778z m-52.337778 552.96c-6.826667 0-13.653333-2.275556-20.48-6.826666-13.653333-11.377778-13.653333-27.306667-2.275556-40.96l141.084445-197.973334c11.377778-11.377778 27.306667-13.653333 40.96-4.551111l122.88 86.471111L748.657778 386.844444c11.377778-11.377778 65.991111-70.542222 97.848889-4.551111v402.773334c0 2.275556-600.746667 2.275556-600.746667 2.275555z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">图片</div>
                    </div>
                    <div class="wc-function-item" onclick="document.getElementById('wc-chat-image-input').click(); wcCloseFunctionPanel();">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M640 576c0 70.4-57.6 128-128 128s-128-57.6-128-128 57.6-128 128-128 128 57.6 128 128z m320-224v480c0 35.2-28.8 64-64 64H128c-35.2 0-64-28.8-64-64V352c0-35.2 28.8-64 64-64h167.2L376 192h256l80.8 96H896c35.2 0 64 28.8 64 64zM704 576c0-106.4-85.6-192-192-192S320 469.6 320 576s85.6 192 192 192 192-85.6 192-192z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">拍照</div>
                    </div>
                    <div class="wc-function-item" onclick="wcOpenChatFilePicker()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M815.104 69.632q27.648 25.6 44.032 42.496t25.088 28.672 10.752 19.968 2.048 14.336l0 16.384-151.552 0q-10.24 0-17.92-7.68t-12.8-17.92-7.68-20.992-2.56-16.896l0-126.976 3.072 0q8.192 0 16.896 2.56t19.968 9.728 28.16 20.48 42.496 35.84zM640 129.024q0 20.48 6.144 42.496t19.456 40.96 33.792 31.232 48.128 12.288l149.504 0 0 577.536q0 29.696-11.776 53.248t-31.232 39.936-43.008 25.6-46.08 9.216l-503.808 0q-19.456 0-42.496-11.264t-43.008-29.696-33.28-41.984-13.312-49.152l0-696.32q0-21.504 9.728-44.544t26.624-42.496 38.4-32.256 45.056-12.8l391.168 0 0 128zM704.512 768q26.624 0 45.056-18.944t18.432-45.568-18.432-45.056-45.056-18.432l-384 0q-26.624 0-45.056 18.432t-18.432 45.056 18.432 45.568 45.056 18.944l384 0zM768 448.512q0-26.624-18.432-45.568t-45.056-18.944l-384 0q-26.624 0-45.056 18.944t-18.432 45.568 18.432 45.056 45.056 18.432l384 0q26.624 0 45.056-18.432t18.432-45.056z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">&#25991;&#20214;</div>
                    </div>
                    <div class="wc-function-item" onclick="wcOpenTransferPage()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1149 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M794.578235 535.529117c-24.667531 4.107441-43.156737 26.000447-43.826056 50.673699-0.68648 14.376045 5.468961 28.75781 15.731843 39.049296a53.831508 53.831508 0 0 0 67.120626 6.841922c21.24657-13.689564 29.472894-40.405095 19.867888-64.386146-8.889922-22.596648-33.557453-36.291933-58.894301-32.178771zM908.945877 45.82257a164.686659 164.686659 0 0 0-43.820335-34.226771 184.800536 184.800536 0 0 0-54.78686-10.297207c-25.34257 0.675039-411.630838 156.15714-452.722414 179.45171h624.628559L908.945877 45.82257z" fill="currentColor"></path><path d="M771.306547 693.059218a104.899933 104.899933 0 0 1-62.338145-15.78333 85.323799 85.323799 0 0 1-31.515173-36.291933 126.392492 126.392492 0 0 1-12.997363-54.781139c0-28.07133 10.955084-55.473341 31.49229-75.341229 19.867888-20.537207 47.269899-32.184492 75.341229-30.80581h369.154861V349.241207a104.613899 104.613899 0 0 0-31.492291-75.341229c-19.181408-20.560089-46.583419-31.520894-75.341229-30.834414H107.634413a106.770592 106.770592 0 0 0-75.341229 30.834414c-20.537207 19.867888-32.184492 46.560536-30.834413 75.341229v561.621095c0 14.358883 2.763084 28.07133 7.562726 41.760894a87.074324 87.074324 0 0 0 26.000447 30.822972c21.24657 19.850726 48.625698 31.492291 78.098592 31.49229h925.95343c14.404648 0 28.088492-2.73448 41.783777-7.534123a95.523754 95.523754 0 0 0 33.557453-23.29457c8.226324-10.262883 15.760447-21.223687 20.560089-33.557452 5.468961-12.997363 8.220603-27.379128 7.534123-41.783777v-215.732201h-371.220023l0.017162 0.022883z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">转账</div>
                    </div>
                    <div class="wc-function-item" onclick="wcOpenFamilyCardPrompt()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1036 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M174.595683 174.595683L0 349.191367l2.578417 13.997122c2.578417 12.892086 26.889209 38.676259 239.056115 250.843166 155.073381 155.073381 234.267626 237.214388 230.952518 238.319424-14.733813 5.156835-52.673381 13.260432-78.457554 16.57554-114.18705 15.470504-183.067626-18.417266-209.588489-103.505036-6.998561-22.83741-6.998561-23.205755 1.105036-90.981295l7.735252-68.143885-9.576978-8.471943c-22.83741-19.522302-49.726619-4.051799-56.72518 32.414389-8.840288 45.306475-12.892086 115.660432-8.103597 142.917986 10.313669 62.618705 49.726619 112.345324 112.713669 143.654676 64.828777 32.046043 121.185612 31.309353 243.844604-3.683453l53.410072-15.102159 61.145324 61.145324c40.886331 40.886331 63.723741 61.145324 69.24892 61.145324 18.785612 0 76.247482-53.778417 258.578418-242.371223l107.92518-111.240288-12.155396-20.627338c-6.998561-11.418705-27.625899-36.834532-46.043166-55.988489l-33.151079-35.361151 20.995684-40.517986c26.889209-52.305036 51.936691-116.028777 64.092086-162.071943 40.517986-156.915108 0-260.788489-118.975539-302.779856-58.566906-20.627338-194.117986-4.788489-289.15108 33.519425-55.251799 22.100719-69.617266 50.463309-35.729496 68.880575 17.31223 9.208633 25.784173 7.366906 79.194245-19.153956 55.988489-27.625899 82.877698-34.256115 139.971223-34.624461 38.676259 0 47.884892 1.473381 74.7741 10.313669 55.988489 18.785612 90.61295 49.358273 102.768346 90.244604 7.735252 26.889209 4.788489 96.87482-6.261871 140.339569-6.998561 28.730935-44.938129 113.45036-68.880575 154.33669l-9.208633 16.207195-254.894964-254.894964C381.23741 2.578417 378.658993 0 363.92518 0s-17.31223 2.578417-189.329497 174.595683z m749.95108 404.443166c-31.309353 70.353957-130.76259 173.122302-232.794245 240.529496-44.569784 29.467626-96.506475 55.251799-133.709353 67.038849l-30.572661 9.576979-16.943885-16.207195c-27.625899-26.889209-26.889209-29.099281 7.735252-40.14964 52.305036-17.31223 104.241727-47.516547 167.965467-98.348201 65.565468-52.673381 145.496403-139.971223 173.490648-189.697842 6.998561-11.78705 15.838849-25.784173 19.522302-30.941007l6.998561-9.576979 23.574101 23.574101 23.5741 23.574101-8.840287 20.627338z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">亲属卡</div>
                    </div>
                    <div class="wc-function-item" onclick="if(typeof showToast === 'function') showToast('礼物功能开发中')">
                        <div class="wc-function-icon"><svg viewBox="0 0 1138 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M57.242236 1024l0-397.969831 397.969831 0 0 397.969831-397.969831 0zM683.272405 1024l0-397.969831 397.969831 0 0 397.969831-397.969831 0zM0 568.787933l0-284.393966 455.212067 0 0 284.393966-455.212067 0zM683.272405 284.393966l454.303461 0 0 284.393966-454.303461 0 0-284.393966zM512.454303 1024l0-739.606034 113.575865 0 0 739.606034-113.575865 0zM683.272405 57.242236l0 170.818101-228.060337 0 0-170.818101 228.060337 0zM1024 0l0 228.060337-284.393966 0 111.758651-228.060337 172.635315 0zM284.393966 0l114.484472 228.060337-284.393966 0 0-228.060337 169.909494 0z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">礼物</div>
                    </div>
                    <div class="wc-function-item" onclick="wcOpenLocationPicker()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M96.484 734.511a75.852 75.852 0 0 1 71.983-51.844h687.066a75.852 75.852 0 0 1 71.983 51.844l79.835 239.578A37.926 37.926 0 0 1 971.397 1024H52.603a37.926 37.926 0 0 1-35.954-49.91L96.484 734.51z" fill="currentColor" opacity=".3"></path><path d="M512 0c219.932 0 398.222 174.649 398.222 390.106C910.222 670.568 512 910.222 512 910.222S113.778 670.53 113.778 390.106C113.778 174.686 292.068 0 512 0z m0 530.963a132.74 132.74 0 1 0 0-265.482 132.74 132.74 0 0 0 0 265.482z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">位置</div>
                    </div>
                    <div class="wc-function-item" id="wc-func-btn-music-invite" onclick="wcSendMusicInviteFromPanel()">
                        <div class="wc-function-icon"><svg viewBox="0 0 1047 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M748.055273 546.490182V882.269091c0 37.562182-28.718545 66.280727-66.257455 66.280727-37.562182 0-66.280727-28.718545-66.280727-66.280727V482.443636c37.562182 33.140364 81.733818 57.460364 132.538182 64.069819zM438.807273 482.443636v399.825455c0 37.538909-28.718545 66.257455-66.257455 66.257454-37.562182 0-66.280727-28.718545-66.280727-66.280727V546.490182c50.804364-6.609455 94.999273-30.929455 132.538182-64.046546zM792.250182 506.740364c-121.483636 0-220.904727-99.397818-220.904727-220.904728 0-121.483636 99.397818-220.881455 220.904727-220.881454 121.483636 0 220.881455 99.397818 220.881454 220.881454s-99.397818 220.904727-220.881454 220.904728z m-143.592727-242.967273c-17.687273 0-33.140364 15.453091-33.140364 33.117091 0 17.687273 15.476364 33.140364 33.140364 33.140363h22.10909c17.664 0 33.117091-15.476364 33.117091-33.140363 0-17.687273-15.453091-33.140364-33.140363-33.140364h-22.085818z m276.107636-66.280727a44.311273 44.311273 0 0 0-44.171636 44.171636v88.366545c0 24.296727 19.874909 44.171636 44.171636 44.171637a44.311273 44.311273 0 0 0 44.194909-44.171637V241.664a44.311273 44.311273 0 0 0-44.194909-44.171636zM262.097455 506.740364c-121.483636 0-220.904727-99.397818-220.904728-220.904728 0-121.483636 99.421091-220.881455 220.904728-220.881454 121.483636 0 220.881455 99.397818 220.881454 220.881454s-99.374545 220.904727-220.881454 220.904728z m121.483636-242.967273c-17.687273 0-33.117091 15.453091-33.117091 33.117091 0 17.687273 15.453091 33.140364 33.117091 33.140363h22.109091c17.664 0 33.117091-15.476364 33.117091-33.140363 0-17.687273-15.453091-33.140364-33.140364-33.140364h-22.085818zM129.559273 197.469091a44.311273 44.311273 0 0 0-44.171637 44.171636v88.366546c0 24.296727 19.874909 44.171636 44.171637 44.171636a44.311273 44.311273 0 0 0 44.171636-44.171636V241.664a44.311273 44.311273 0 0 0-44.171636-44.171636z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">一起听歌</div>
                    </div>
                    <div class="wc-function-item" id="wc-func-btn-offline-meeting" onclick="wcOpenMeetingFromChat(event)">
                        <div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M587.3 373.7h209c39 0 60.3 18.1 71.6 33.6 4.4 5.7 7.9 12.9 10.4 18.1h24.2v-153c0-71.3-52.4-131.2-120.5-131.2H190.6c-68.7 0-127.5 60.5-127.5 131.8v361.2c0 70.8 58.8 127.1 126.5 127.1H239c8.9 0 16.8 5.7 21.2 13.9L317 877.5c4 6.7 12.8 7.2 16.8 0.5l60.3-103.3c4.4-7.8 12.4-13.4 21.2-13.4h17.3l86.5-336.4c7.9-30.5 35.1-51.2 68.2-51.2zM365.5 487.4H227.1c-16.3 0-29.6-14-29.6-31s13.3-31 29.6-31h138.3c16.3 0 29.6 14 29.6 31 0.1 17-13.2 31-29.5 31zM227.1 337.5c-16.3 0-29.6-13.9-29.6-31 0-17 13.3-31 29.6-31h410c16.3 0 29.6 13.9 29.6 31s-13.3 31-29.6 31h-410z m729.7 148.3c-3.9-5.2-9.9-9.3-15.8-9.3H836.7c-0.9 0-1.4 0.4-1.8 0.1-0.1 0.3-0.1 0.6-0.2 0.9v-1c0.1 0.1 0.1 0.1 0.2 0.1 2.7-12.6 0.6-25.1-6.1-34.7-7.4-9.8-18.8-16.5-32.6-16.5h-209c-8.9 0-16.8 7.2-19.3 16l-61.3 238.7c-0.6 2.5-0.8 5-0.5 7.5l-43.4 169.2c-3 10.8 3.5 22.2 13.8 25.3 1.5 0.5 3.5 0.5 4.9 0.5 8.9 0 16.8-6.2 19.3-15l41.9-163.3H735c-3 15.5-1 25.3 6.4 35.1 7.9 10.3 20.3 16.5 34.6 16.5h103.7c8.9 0 16.8-5.2 19.3-15l61.3-236.7c1.4-6 0.4-13.2-3.5-18.4z m-91.9 228.9H776c-1 0-2 1-2.5 1 3-13.4 1-26.9-6.4-36.7-7.4-9.8-18.8-16-32.1-16H553.3l50.4-196.4h192.5c-0.5 5.2-1 4.1-1 6.2-1 11.9 3.5 24.3 11.4 33.1s19.3 12.4 30.6 12.4h78.5l-50.8 196.4z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">线下见面</div>
                    </div>
                </div>
                <input type="file" id="wc-chat-image-input" accept="image/*" multiple style="display: none;" onchange="wcHandleSendRealImages(event)">
                <input type="file" id="wc-chat-file-input" style="display: none;" onchange="wcHandleSendChatFile(event)">
            </div>


            <!-- Guided private-chat regeneration, with reusable presets. -->
            <!-- SVG icons: Tabler Icons (MIT), https://github.com/tabler/tabler-icons/blob/main/LICENSE -->
            <div id="wcRegenerateOverlay" class="wc-reroll-overlay" aria-hidden="true" tabindex="-1"
                 onclick="if(event.target===this) wcCloseRegenerateDialog()"
                 onkeydown="if(event.key==='Escape') wcCloseRegenerateDialog()">
                <section class="wc-reroll-dialog" role="dialog" aria-modal="true" aria-labelledby="wcRerollTitle" onclick="event.stopPropagation()">
                    <div class="wc-reroll-content">
                        <div id="wcRerollMainScreen" class="wc-reroll-screen">
                            <h2 id="wcRerollTitle">重新生成</h2>
                            <p class="wc-reroll-subtitle">不满意的地方，或希望 TA 怎样重说？</p>
                            <button class="wc-reroll-preset-picker" type="button" onclick="wcShowRegenerateScreen('list')">
                                <span class="wc-reroll-picker-text"><strong>重新生成预设</strong><small id="wcRerollPresetCurrent">选择已保存的预设</small></span>
                                <span class="wc-reroll-picker-tail"><small id="wcRerollPresetCount"></small><svg class="wc-reroll-chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.707 5.293l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1 -1.414 -1.414l5.293 -5.293l-5.293 -5.293a1 1 0 0 1 1.414 -1.414" /></svg></span>
                            </button>
                            <div class="wc-reroll-label">快速填写 <span>点击添加到下方</span></div>
                            <div class="wc-reroll-chips">
                                <button type="button" onclick="wcAddRegenerateDirection('上一轮不够符合角色人设，请贴合角色性格和说话习惯重新回复。')">不符合人设</button>
                                <button type="button" onclick="wcAddRegenerateDirection('请直接回应我上一条消息的重点，不要答非所问。')">答非所问</button>
                                <button type="button" onclick="wcAddRegenerateDirection('不要重复上一版的表达，避免啰嗦和套话。')">内容重复</button>
                                <button type="button" onclick="wcAddRegenerateDirection('调整语气，像真实聊天一样自然，别太生硬。')">语气不对</button>
                                <button type="button" onclick="wcAddRegenerateDirection('增加符合情境的互动和新的回应，不要原地打转。')">推进互动</button>
                                <button type="button" onclick="wcAddRegenerateDirection('少一些八股式修辞和空泛抒情，表达更具体。')">少点八股</button>
                            </div>
                            <label class="wc-reroll-label" for="wcRerollDirection">重说原因与方向 <span>选填</span></label>
                            <textarea id="wcRerollDirection" rows="4" maxlength="400" aria-label="重说原因与方向"
                                      oninput="wcUpdateRegeneratePresetPicker()"
                                      placeholder="例如：刚才的回复有点生硬，想让 TA 更自然地接我的话，少些套路。"></textarea>
                            <div class="wc-reroll-under-input">
                                <span>仅影响本次重新生成</span>
                                <button type="button" onclick="wcOpenRegeneratePresetEditor()">保存为预设</button>
                            </div>
                            <p id="wcRerollMainStatus" class="wc-reroll-status" role="status" aria-live="polite"></p>
                        </div>
                        <div id="wcRerollPresetScreen" class="wc-reroll-screen" hidden>
                            <div class="wc-reroll-screen-head"><h2>重新生成预设</h2><button id="wcRerollManageButton" type="button" onclick="wcToggleRegeneratePresetManage()" hidden>管理</button></div>
                            <p class="wc-reroll-subtitle">选一个喜欢的方向，下一次可以直接使用。</p>
                            <div class="wc-reroll-preset-list" id="wcRerollPresetList"></div>
                            <p id="wcRerollListStatus" class="wc-reroll-status" role="status" aria-live="polite"></p>
                        </div>
                        <div id="wcRerollPresetEditorScreen" class="wc-reroll-screen" hidden>
                            <h2 id="wcRerollEditorTitle">保存重新生成预设</h2>
                            <p class="wc-reroll-subtitle">给常用的重说要求取个名字，以后一点即用。</p>
                            <label class="wc-reroll-label" for="wcRerollPresetName">预设名称</label>
                            <input id="wcRerollPresetName" class="wc-reroll-input" type="text" maxlength="32" autocomplete="off" placeholder="例如：自然一点">
                            <label class="wc-reroll-label" for="wcRerollPresetContent">预设内容</label>
                            <textarea id="wcRerollPresetContent" rows="5" maxlength="400" placeholder="写下想让 TA 怎样重说"></textarea>
                            <p id="wcRerollEditorStatus" class="wc-reroll-status" role="status" aria-live="polite"></p>
                        </div>
                    </div>
                    <div class="wc-reroll-actions" id="wcRerollMainActions">
                        <button class="wc-reroll-cancel" type="button" onclick="wcCloseRegenerateDialog()">取消</button>
                        <button class="wc-reroll-confirm" type="button" onclick="wcConfirmRegenerate()">确认</button>
                    </div>
                    <div class="wc-reroll-actions" id="wcRerollListActions" hidden>
                        <button class="wc-reroll-cancel" type="button" onclick="wcShowRegenerateScreen('main')">返回</button>
                        <button class="wc-reroll-confirm" type="button" onclick="wcOpenRegeneratePresetEditor('','list')">新建预设</button>
                    </div>
                    <div class="wc-reroll-actions" id="wcRerollEditorActions" hidden>
                        <button class="wc-reroll-cancel" type="button" onclick="wcShowRegenerateScreen(wcRegeneratePresetEditorReturnScreen())">返回</button>
                        <button class="wc-reroll-confirm" type="button" onclick="wcSaveRegeneratePreset()">保存</button>
                    </div>
                </section>
            </div>
            <style id="wc-regenerate-dialog-style">
                .wechat-app-container .wc-reroll-overlay{display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center;padding:20px 18px calc(20px + env(safe-area-inset-bottom,0px));background:rgba(0,0,0,.3);box-sizing:border-box}
                .wechat-app-container .wc-reroll-overlay.show{display:flex}
                .wechat-app-container .wc-reroll-dialog{width:min(100%,410px);max-height:min(85dvh,680px);display:flex;flex-direction:column;overflow:hidden;border-radius:22px;background:#f9f9fb;box-shadow:0 16px 60px rgba(0,0,0,.2);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;color:#1c1c1e}
                .wechat-app-container .wc-reroll-content{padding:24px 20px 12px;overflow-y:auto;overscroll-behavior:contain}
                .wechat-app-container .wc-reroll-screen[hidden],.wechat-app-container .wc-reroll-actions[hidden]{display:none!important}
                .wechat-app-container .wc-reroll-content h2{font-size:19px;font-weight:700;text-align:center;line-height:1.3;margin:0}
                .wechat-app-container .wc-reroll-subtitle{font-size:13px;line-height:1.6;color:#8e8e93;text-align:center;margin:8px 0 19px}
                .wechat-app-container .wc-reroll-label{font-size:14px;font-weight:650;display:flex;align-items:center;justify-content:space-between;margin:18px 0 10px}
                .wechat-app-container .wc-reroll-label span{font-size:12px;color:#8e8e93;font-weight:400}
                .wechat-app-container .wc-reroll-chips{display:flex;gap:8px;flex-wrap:wrap}
                .wechat-app-container .wc-reroll-chips button{border:1px solid #e5e5ea;border-radius:11px;background:#fff;color:#48484a;font:inherit;font-size:12px;line-height:1.3;padding:9px 12px;min-height:35px;cursor:pointer}
                .wechat-app-container .wc-reroll-chips button:active{background:#eaf3ff;color:#007aff}
                .wechat-app-container .wc-reroll-content textarea,.wechat-app-container .wc-reroll-input{display:block;width:100%;box-sizing:border-box;border-radius:12px;border:1px solid #e5e5ea;background:#fff;outline:none;padding:12px 13px;margin-top:12px;color:#1c1c1e;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
                .wechat-app-container .wc-reroll-content textarea{resize:none;min-height:80px}
                .wechat-app-container .wc-reroll-input{min-height:45px}
                .wechat-app-container .wc-reroll-content textarea:focus,.wechat-app-container .wc-reroll-input:focus{border-color:#007aff;box-shadow:0 0 0 2px rgba(0,122,255,.08)}
                .wechat-app-container .wc-reroll-content textarea::placeholder,.wechat-app-container .wc-reroll-input::placeholder{color:#aeaeb2}
                .wechat-app-container .wc-reroll-preset-picker{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;padding:13px 14px;background:#fff;border:1px solid #e9e9ed;border-radius:13px;color:#1c1c1e;cursor:pointer;font:inherit}
                .wechat-app-container .wc-reroll-picker-text{display:flex;flex-direction:column;gap:4px;min-width:0}
                .wechat-app-container .wc-reroll-picker-text strong{font-size:14px;font-weight:650}
                .wechat-app-container .wc-reroll-picker-text small{font-size:12px;color:#8e8e93;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}
                .wechat-app-container .wc-reroll-picker-tail{display:flex;align-items:center;gap:8px;color:#8e8e93;flex-shrink:0}
                .wechat-app-container .wc-reroll-picker-tail svg{width:18px;height:18px;display:block;flex-shrink:0}
                .wechat-app-container .wc-reroll-under-input{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 1px 0;font-size:12px;color:#8e8e93}
                .wechat-app-container .wc-reroll-under-input button,.wechat-app-container .wc-reroll-screen-head button{padding:4px 0;color:#007aff;background:none;border:0;font:600 12px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;cursor:pointer}
                .wechat-app-container .wc-reroll-status{font-size:12px;color:#8e8e93;margin:10px 0 0;min-height:16px}
                .wechat-app-container .wc-reroll-screen-head{display:flex;align-items:center;justify-content:center;position:relative}
                .wechat-app-container .wc-reroll-screen-head button{position:absolute;right:0;top:0;font-size:13px}
                .wechat-app-container .wc-reroll-preset-list{display:flex;flex-direction:column;gap:9px}
                .wechat-app-container .wc-reroll-preset-row{display:flex;align-items:center;gap:8px;padding:6px;background:#fff;border:1px solid #e9e9ed;border-radius:12px}
                .wechat-app-container .wc-reroll-preset-select{display:flex;flex:1;min-width:0;flex-direction:column;align-items:flex-start;gap:5px;text-align:left;border:0;background:none;padding:7px;cursor:pointer;color:inherit}
                .wechat-app-container .wc-reroll-preset-select strong{font-size:14px;font-weight:650}
                .wechat-app-container .wc-reroll-preset-select small{font-size:12px;color:#8e8e93;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .wechat-app-container .wc-reroll-preset-tool{border:0;border-radius:9px;padding:8px 9px;background:#f2f2f7;color:#48484a;font:500 12px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;white-space:nowrap}
                .wechat-app-container .wc-reroll-preset-tool.danger{color:#ff3b30}
                .wechat-app-container .wc-reroll-preset-tool.icon-only{display:inline-flex;align-items:center;justify-content:center;min-width:36px;min-height:36px;padding:7px}
                .wechat-app-container .wc-reroll-preset-tool.icon-only svg{display:block;width:19px;height:19px}
                .wechat-app-container .wc-reroll-preset-empty{padding:28px 10px;text-align:center;font-size:13px;color:#8e8e93}
                .wechat-app-container .wc-reroll-actions{display:flex;gap:10px;padding:12px 20px calc(16px + env(safe-area-inset-bottom,0px));flex-shrink:0;background:#f9f9fb}
                .wechat-app-container .wc-reroll-actions button{flex:1;border:0;border-radius:12px;font:600 15px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;min-height:44px;cursor:pointer}
                .wechat-app-container .wc-reroll-cancel{background:#e9e9ed;color:#3a3a3c}
                .wechat-app-container .wc-reroll-confirm{background:#007aff;color:#fff}
                .wechat-app-container .wc-reroll-actions button:active{opacity:.78}
                @media(max-height:610px){.wechat-app-container .wc-reroll-dialog{max-height:90dvh}.wechat-app-container .wc-reroll-content{padding-top:17px}.wechat-app-container .wc-reroll-subtitle{margin-bottom:12px}}
            </style>

            <!-- 悬浮表情面板 -->
            <div class="wc-emoji-panel" id="wcEmojiPanel" onclick="event.stopPropagation()">
                <div class="wc-emoji-panel-header">
                    <div class="wc-capsule-group" id="wcEmojiCapsuleGroup">
                        <div class="wc-capsule-item wc-search-trigger" onclick="wcOpenEmojiSearch()">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <span>搜索</span>
                        </div>
                        <div class="wc-capsule-item active" onclick="wcSwitchEmojiGroup(this)">全部</div>
                        <div class="wc-capsule-item" onclick="wcSwitchEmojiGroup(this)">最近</div>
                    </div>
                    <div class="wc-search-view" id="wcEmojiSearchView">
                        <div class="wc-search-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="search" id="wcEmojiSearchInput" placeholder="搜索表情包" oninput="wcHandleEmojiSearch()">
                        </div>
                        <div class="wc-cancel-btn" onclick="wcCloseEmojiSearch()">取消</div>
                    </div>
                </div>
                <div class="wc-panel-content" id="wcEmojiPanelContent">当前暂无表情包</div>
            </div>
        </div>

        <!-- 微信聊天记录搜索页 -->
        <div id="page-wc-chat-search" class="page" style="background-color: #ffffff; z-index: 150;">
            <div class="wc-search-header" style="padding-top: 45px; display: flex; align-items: center; padding-left: 16px; padding-right: 16px; padding-bottom: 10px; background: #ffffff; border-bottom: 0.5px solid rgba(0,0,0,0.05);">
                <div class="wc-search-bar-wrapper" style="flex: 1; display: flex; align-items: center; background: #f2f2f7; border-radius: 10px; padding: 8px 12px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="#8e8e93" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="wcChatSearchInput" placeholder="搜索聊天记录" style="border: none; outline: none; width: 100%; margin-left: 8px; font-size: 15px; background: transparent;" oninput="wcPerformChatSearch()" onkeydown="if(event.key==='Enter'){event.preventDefault();event.stopPropagation();return false;}">
                </div>
                <div class="wc-search-cancel-btn" onclick="wcCloseChatSearch()" style="margin-left: 16px; font-size: 16px; color: var(--tg-blue); cursor: pointer; font-weight: 500;">取消</div>
            </div>
            <div class="wc-scroll-area" id="wcChatSearchResults" style="background: #ffffff; flex: 1; overflow-y: auto;">
                <div style="text-align: center; color: #8e8e93; margin-top: 40px; font-size: 14px;">请输入搜索内容</div>
            </div>
        </div>

        <!-- 新增的朋友圈页面 -->
        <div id="page-moments" class="page">
            <section class="profile-section">
                <div class="cover-photo">
                </div>
                <div class="profile-top-row">
                    <div class="profile-avatar-wrapper">
                        <div class="profile-avatar-inner" style="background-color: #E5E5EA;">
                        </div>
                        <div class="profile-avatar-badge">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <div class="btn btn-edit" onclick="wcOpenMomentsEditModal()">Edit</div>
                        <div class="btn btn-follow" onclick="wcOpenComposeModal()">Follow</div>
                    </div>
                </div>
                <div class="profile-info">
                    <div class="profile-name"></div>
                    <div class="profile-handle"></div>
                    <div class="profile-bio"></div>
                </div>
            </section>

            <section class="feed-list" id="wc-moments-feed-list">
            </section>
        </div>

        <!-- 新增的“我的”页面 -->
        <div id="page-profile" class="page">
            <div class="wc-profile-header">
                <div class="wc-profile-title" onclick="closeWechatApp()">
                    AboutMe
                    <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>

            <div class="wc-profile-section">
                <div class="wc-profile-main">
                    <div class="wc-avatar-wrapper" onclick="wcOpenProfileEditModal()" style="cursor: pointer;">
                        <div class="wc-avatar-inner"></div>
                    </div>
                    <div class="wc-profile-info-wrap" onclick="wcOpenProfileEditModal()" style="cursor: pointer;">
                        <div class="wc-profile-name"></div>
                        <div class="wc-profile-id"></div>
                    </div>
                    <div class="wc-profile-qr">
                        <svg class="qr-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 17V16H13V13H16V15H18V17H17V19H15V21H13V18H15V17H16ZM21 21H17V19H19V17H21V21ZM3 3H11V11H3V3ZM13 3H21V11H13V3ZM3 13H11V21H3V13ZM18 13H21V15H18V13ZM6 6V8H8V6H6ZM6 16V18H8V16H6ZM16 6V8H18V6H16Z"></path></svg>
                        <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="wc-profile-bio" onclick="wcOpenProfileEditModal()" style="cursor: pointer;">
                    <div class="wc-bio-line1">Oㅈo：뭐?</div>
                    <div class="wc-bio-line2">ㅎㅇ…iam>iwas🖤🤍</div>
                </div>
            </div>

            <div class="wc-list-group">
                <div class="wc-list-item" onclick="wcOpenWallet()">
                    <div class="wc-item-icon" style="color: #8E8E93;">
                        <svg t="1789929671615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9617" width="200" height="200" fill="#8E8E93"><path d="M892.4 238.5c3.3 0 6.6 0.3 9.8 0.7-8.7-6.8-19.3-11.6-31-13.4L234.5 124.1c-37.1-5.9-72 19.3-77.9 56.4l-9.3 58.1h745.1zM960.4 338.5c0-37.6-30.4-68-68-68H132.2c-37.6 0-68 30.4-68 68V820c0 37.6 30.4 68 68 68h760.1c37.6 0 68-30.4 68-68V690.7h-263c-67 0-121.3-54.3-121.3-121.3s54.3-121.3 121.3-121.3h263V338.5z" p-id="9618"></path><path d="M677.153119 577.411773a34.6 34.6 0 1 0 67.347866-15.902987 34.6 34.6 0 1 0-67.347866 15.902987Z" p-id="9619"></path></svg>
                    </div>
                    <div class="wc-item-text">服务</div>
                    <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-list-item" onclick="wcOpenFavoritesPage()">
                    <div class="wc-item-icon" style="color: #8E8E93;">
                        <svg t="1789930040541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31965" width="200" height="200" fill="#8E8E93"><path d="M862.071 807c0 30.88-25.048 55.823-55.868 55.823H108.185l97.752-460.677c0-30.85 24.896-55.851 55.715-55.851h642.296c30.826 0 55.774 25.001 55.774 55.851l-97.651 404.855M219.824 304.393h628.252v-54.837c0-30.85-25.051-55.851-55.822-55.851H457.216v-50.609c0-30.797-25.001-55.822-55.822-55.822H122.126c-30.825 0-55.822 25.025-55.822 55.822v663.905l97.652-446.737c0-30.85 25.048-55.871 55.868-55.871m0 0z" p-id="31966"></path></svg>
                    </div>
                    <div class="wc-item-text">收藏</div>
                    <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-list-item" onclick="wcOpenEmojiApp()">
                    <div class="wc-item-icon" style="color: #8E8E93;">
                        <svg t="1789929942374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16025" width="200" height="200" fill="#8E8E93"><path d="M969.774545 819.665455l-69.818181-93.09091a410.298182 410.298182 0 0 0 60.509091-214.574545c0-237.847273-204.334545-430.545455-456.61091-430.545455S46.545455 274.152727 46.545455 512s204.567273 430.545455 456.843636 430.545455A475.927273 475.927273 0 0 0 733.090909 884.363636h204.334546a40.029091 40.029091 0 0 0 32.34909-64.698181zM582.981818 357.469091c32.581818 0 58.88 40.727273 58.88 90.996364s-26.298182 90.763636-58.88 90.763636-58.88-40.494545-58.88-90.763636 26.298182-90.996364 58.88-90.996364z m-333.265454 181.76c-32.581818 0-59.112727-40.494545-59.112728-90.763636s26.530909-90.996364 59.112728-90.996364 58.88 40.727273 58.88 90.996364-26.530909 90.763636-58.88 90.763636z" p-id="16026"></path></svg>
                    </div>
                    <div class="wc-item-text">表情</div>
                    <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-list-item" onclick="wcOpenWechatSettings()">
                    <div class="wc-item-icon" style="color: #8E8E93;">
                        <svg t="1789930085218" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37264" width="200" height="200"><path d="M1023.886 475.507c0-25.369-13.941-49.023-36.339-61.707l-81.591-46.166c-16.913-9.599-30.968-23.54-40.567-40.11l-15.77-27.311c-8.913-15.427-13.827-33.025-14.056-50.852l-1.371-103.646c-0.229-24.683-14.056-47.88-35.768-60.45l-59.536-34.396c-23.426-13.484-52.223-13.141-75.306 1.029l-78.62 48.109c-17.598 10.856-37.939 16.57-58.851 16.57h-25.14c-20.112 0-39.881-5.257-57.136-15.427L358.93 51.327c-22.969-13.484-51.309-13.484-74.277-0.229L225.574 85.38c-22.512 13.027-36.225 37.139-35.653 62.85l2.171 100.446c0.457 18.969-4.457 37.71-13.941 54.28l-14.056 24.454c-9.828 17.141-24.34 31.311-42.052 41.024l-84.791 46.395C14.17 427.398 0 451.281 0 477.107l0.114 70.964c0 25.14 13.827 48.68 35.882 61.365l87.876 50.623c16.57 9.599 30.397 23.312 39.881 39.653l14.97 25.826c9.599 16.684 14.398 35.425 14.056 54.394l-1.828 95.875c-0.571 25.711 13.141 49.823 35.767 62.85l59.879 34.51c11.313 6.514 24.112 9.827 36.796 9.827a74.386 74.386 0 0 0 35.996-9.256l86.276-48.109c16.684-9.37 35.653-14.284 54.965-14.284h28.454c19.884 0 39.424 5.257 56.451 15.084l79.991 46.166c22.74 13.027 50.966 13.027 73.706-0.114l60.222-34.968c21.712-12.57 35.425-35.767 35.653-60.565l1.143-99.189a105.323 105.323 0 0 1 13.941-50.966l16.57-28.797c9.028-15.884 22.283-29.254 38.167-38.853l84.448-50.851c21.369-12.799 34.625-36.11 34.625-60.793l-0.115-71.992zM512 696.323c-101.799 0-184.323-82.524-184.323-184.323S410.201 327.677 512 327.677 696.323 410.201 696.323 512 613.799 696.323 512 696.323z" fill="#8E8E93" p-id="37265"></path></svg>
                    </div>
                    <div class="wc-item-text">设置</div>
                    <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-list-item" onclick="wcOpenAccountSwitchDrawer()">
                    <div class="wc-item-icon" style="color: #8E8E93;">
                        <svg t="1789930242072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="47009" width="200" height="200" fill="#8E8E93"><path d="M512 51.2c-254.464 0-460.8 206.336-460.8 460.8s206.336 460.8 460.8 460.8 460.8-206.336 460.8-460.8-206.336-460.8-460.8-460.8m281.6 599.552H429.568l47.104 47.104-58.368 58.368-105.472-105.472L230.4 568.32h563.2v82.432zM230.4 455.68V373.248h364.032l-47.104-47.104 58.368-58.368 105.472 105.472L793.6 455.68H230.4z" p-id="47010"></path></svg>
                    </div>
                    <div class="wc-item-text" style="color: #000000; font-weight: 500;">切换账号</div>
                    <svg class="wc-chevron-right" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
            </div>

            <!-- 微信个人信息编辑弹窗 -->
            <div class="wc-moments-edit-overlay" id="wcProfileEditOverlay">
                <div class="wc-moments-edit-card">
                    <div class="edit-header">编辑个人信息</div>
                    <div class="edit-avatar-wrapper" style="margin: 20px auto 10px;">
                        <div class="edit-avatar-preview" id="wcProfileEditAvatarPreview" onclick="wcOpenProfileAvatarMenu(event)"></div>
                        <div class="edit-cam-icon small"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
                    </div>
                    <div class="edit-form">
                        <input type="text" id="wcProfileEditName" placeholder="名称">
                        <input type="text" id="wcProfileEditWxid" placeholder="微信号">
                        <textarea id="wcProfileEditBio" placeholder="Oㅈo：뭐?&#10;ㅎㅇ…iam>iwas🖤🤍"></textarea>
                    </div>
                    <div class="edit-actions">
                        <button class="cancel" onclick="wcCloseProfileEditModal()">取消</button>
                        <button class="save" onclick="wcSaveProfileEdit()">保存</button>
                    </div>
                </div>
            </div>
            <input type="file" id="wcProfileAvatarInput" accept="image/*" style="display: none;" onchange="wcHandleProfileAvatarUpload(event)">

            <!-- 微信个人信息头像菜单 -->
            <div class="icon-menu-overlay" id="wcProfileAvatarMenuOverlay" onclick="wcCloseProfileAvatarMenu()" style="z-index: 2001;">
                <div class="icon-menu" id="wcProfileAvatarMenu" onclick="event.stopPropagation()">
                    <div class="icon-menu-item" onclick="document.getElementById('wcProfileAvatarInput').click(); wcCloseProfileAvatarMenu();">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                        <span>照片图库</span>
                    </div>
                    <div class="icon-menu-item" onclick="wcHandleProfileAvatarUrl();">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span>使用 URL</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 聊天设置 Modal -->
        <div class="wc-settings-page" id="wc-settings-modal">
            <!-- 顶部导航栏 -->
            <div class="wc-settings-navbar">
                <div class="wc-settings-nav-btn-left" onclick="wcHandleSettingsBack()">
                    <svg viewBox="0 0 24 24"><polyline points="14 18 8 12 14 6"></polyline></svg>
                </div>
                <div class="wc-settings-nav-title" id="wc-settings-modal-title">WeSettings</div>
                <div class="wc-settings-nav-save">
                    <div class="wc-settings-save-btn" onclick="wcHandleSettingsBack()">保存</div>
                </div>
            </div>

            <div class="wc-settings-content" id="wc-main-settings-view">
                <!-- 顶部双头像展示区：头像区域进入完整人设编辑，胶囊快捷更换头像 -->
                <div class="wc-settings-avatar-showcase" id="wc-settings-avatars-header">
                    <div class="wc-settings-avatars-row">
                        <div class="wc-settings-avatar-item" onclick="wcJumpToContactsChar()">
                            <div class="wc-settings-avatar-circle" id="wc-settings-char-circle"></div>
                            <div class="wc-settings-avatar-meta">
                                <div class="wc-settings-avatar-name" id="wc-settings-char-name">未知</div>
                                <button type="button" class="wc-avatar-change-pill" onclick="event.stopPropagation(); wcTriggerQuickAvatarPicker('char')">📸 更换头像</button>
                            </div>
                        </div>
                        <div class="wc-settings-avatar-item" onclick="wcJumpToContactsUser()">
                            <div class="wc-settings-avatar-circle" id="wc-settings-user-circle"></div>
                            <div class="wc-settings-avatar-meta">
                                <div class="wc-settings-avatar-name" id="wc-settings-user-name">Me</div>
                                <button type="button" class="wc-avatar-change-pill" onclick="event.stopPropagation(); wcTriggerQuickAvatarPicker('user')">📸 更换头像</button>
                            </div>
                        </div>
                    </div>
                    <input id="wc-quick-char-avatar-input" type="file" accept="image/*" hidden onchange="wcHandleQuickAvatarFile('char', this)">
                    <input id="wc-quick-user-avatar-input" type="file" accept="image/*" hidden onchange="wcHandleQuickAvatarFile('user', this)">
                </div>

                <!-- 列表设置区 -->
                <div class="wc-settings-list">

                    <!-- 备注 (Remark) -->
                    <div class="wc-settings-list-item" style="cursor: default; padding-bottom: 24px; border-bottom: none;">
                        <div class="wc-settings-item-content" style="flex: none; width: 110px;">
                            <div class="wc-settings-item-title" style="color: #8E8E93; font-size: 14px;">备注 (Remark)</div>
                        </div>
                        <div class="wc-settings-item-right" style="flex: 1; padding-left: 0;">
                            <input type="text" id="wc-contact-remark-input" placeholder="点击输入备注..." style="width: 100%; text-align: left; border: none; border-bottom: 1px solid #E5E5EA; background: transparent; font-size: 16px; color: #000; outline: none; padding: 4px 0; border-radius: 0;" onchange="wcSaveContactRemark()">
                        </div>
                    </div>

                    <div class="wc-settings-list-item" onclick="wcOpenPrivateApiSettings()">
                        <div class="wc-settings-item-icon"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h2v5h6V2h2v5h3v4a8 8 0 0 1-7 7.94V22h-2v-3.06A8 8 0 0 1 4 11V7h3V2Z"/></svg></div>
                        <div class="wc-settings-item-content"><div class="wc-settings-item-title">私聊 API</div><div class="wc-settings-item-subtitle">独立填写或复用全局预设</div></div>
                        <div class="wc-settings-item-right"><svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                    </div>

                    <!-- Worldbook quick binding -->
                    <div class="wc-settings-list-item" onclick="wcShowWorldbookBindingSettings()">
                        <div class="wc-settings-item-icon">
                            <svg t="1791374505842" class="icon fill-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13699" width="200" height="200"><path d="M878.1 186.6c-45.2-14.2-94.8-20.3-142.4-20.3-79.3 0-164.8 16.3-223.7 61-59-44.7-144.4-61-223.7-61s-164.8 16.3-223.7 61v596c0 10.2 10.2 20.3 20.3 20.3 4.1 0 6.1-2 10.2-2 54.9-26.4 134.2-44.7 193.2-44.7 79.3 0 164.8 16.3 223.7 61 54.9-34.6 154.6-61 223.7-61 67.1 0 136.3 12.2 193.2 42.7 4.1 2 6.1 2 10.2 2 10.2 0 20.3-10.2 20.3-20.3V227.2c-24.3-18.3-50.8-30.5-81.3-40.6m0 549.1c-44.7-14.2-93.6-20.3-142.4-20.3-69.2 0-168.8 26.4-223.7 61V308.6c54.9-34.6 154.6-61 223.7-61 48.8 0 97.6 6.1 142.4 20.3v467.8z" p-id="13700"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">世界书绑定</div>
                            <div class="wc-settings-item-subtitle" id="wc-worldbook-binding-subtitle">跟随世界书 App 原绑定</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- Token 查询入口 -->
                    <div class="wc-settings-list-item" onclick="wcOpenTokenModal()">
                        <div class="wc-settings-item-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">Token 占用查询</div>
                            <div class="wc-settings-item-subtitle">查看当前上下文 Token 分布</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <div class="wc-settings-group-header">感知与系统</div>

                    <!-- 拍一拍设置入口 -->
                    <div class="wc-settings-list-item" onclick="wcOpenNudgeDrawer()">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">拍一拍</div>
                            <div class="wc-settings-item-subtitle" id="wc-nudge-status-subtitle">双击头像互动与设置我的后缀</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch active" id="wc-nudge-toggle" onclick="event.stopPropagation(); wcToggleNudge();" aria-checked="true"></div>
                        </div>
                    </div>

                    <!-- Memory A/B/C diagnostic switch -->
                    <div class="wc-settings-list-item wc-memory-diagnostic-item" style="cursor: default;">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <ellipse cx="12" cy="5" rx="7" ry="3"></ellipse>
                                <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"></path>
                                <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">记忆 A/B/C 测试</div>
                            <div class="wc-settings-item-subtitle" id="wc-memory-diagnostic-subtitle">A：完整记忆</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-memory-diagnostic-segment" role="group" aria-label="记忆测试模式" onclick="event.stopPropagation()">
                                <button type="button" class="wc-memory-diagnostic-option is-active" data-mode="A" aria-label="A 完整记忆" aria-pressed="true" onclick="wcSetMemoryDiagnosticMode('A', event)">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16" text-anchor="middle">A</text></svg>
                                </button>
                                <button type="button" class="wc-memory-diagnostic-option" data-mode="B" aria-label="B 关闭记忆注入" aria-pressed="false" onclick="wcSetMemoryDiagnosticMode('B', event)">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16" text-anchor="middle">B</text></svg>
                                </button>
                                <button type="button" class="wc-memory-diagnostic-option" data-mode="C" aria-label="C 仅长期记忆" aria-pressed="false" onclick="wcSetMemoryDiagnosticMode('C', event)">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16" text-anchor="middle">C</text></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 1. 时间感知 -->
                    <div class="wc-settings-list-item" onclick="wcToggleTimeAwareness()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Calendar-Clock-Fill--Streamline-Rounded-Fill-Material" style="width: 22px; height: 22px; stroke: none;">
                              <path fill="currentColor" d="M4.5 22c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V5c0 -0.4 0.15 -0.75 0.45 -1.05C3.75 3.65 4.1 3.5 4.5 3.5h1.625V2.8c0 -0.226665 0.079 -0.416665 0.237 -0.57 0.158 -0.153335 0.35385 -0.23 0.5875 -0.23 0.23365 0 0.4255 0.076665 0.5755 0.23 0.15 0.153335 0.225 0.343335 0.225 0.57V3.5h8.5V2.8c0 -0.226665 0.079 -0.416665 0.237 -0.57 0.158 -0.153335 0.35385 -0.23 0.5875 -0.23 0.23365 0 0.4255 0.076665 0.5755 0.23 0.15 0.153335 0.225 0.343335 0.225 0.57V3.5H19.5c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05v6.925c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.32365 0.21575 -0.5375 0.21575 -0.21365 0 -0.39135 -0.0719 -0.533 -0.21575 -0.14165 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425V9.75H4.5V20.5h7.65c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125H4.5Zm13.775 1c-1.30715 0 -2.4215 -0.46065 -3.343 -1.382 -0.92135 -0.9215 -1.382 -2.03585 -1.382 -3.343s0.46065 -2.4215 1.382 -3.343c0.9215 -0.92135 2.03585 -1.382 3.343 -1.382s2.4215 0.46065 3.343 1.382C22.53935 15.8535 23 16.96785 23 18.275s-0.46065 2.4215 -1.382 3.343C20.6965 22.53935 19.58215 23 18.275 23Zm0.275 -4.775v-2.323c0 -0.13465 -0.0475 -0.24785 -0.1425 -0.3395 -0.095 -0.09165 -0.20585 -0.1375 -0.3325 -0.1375 -0.13335 0 -0.25 0.0475 -0.35 0.1425 -0.1 0.095 -0.15 0.20585 -0.15 0.3325v2.375c0 0.09285 0.01665 0.18265 0.05 0.2695 0.03335 0.087 0.08335 0.17215 0.15 0.2555l1.6 1.65c0.1 0.1 0.21665 0.15 0.35 0.15 0.13335 0 0.25 -0.05 0.35 -0.15 0.1 -0.1 0.15 -0.21665 0.15 -0.35 0 -0.13335 -0.05 -0.25 -0.15 -0.35l-1.525 -1.525Z" stroke-width="0.5"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">感知现实时间</div>
                            <div class="wc-settings-item-subtitle">Reality Time Perception</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch active" id="wc-time-awareness-toggle"></div>
                        </div>
                    </div>

                    <!-- Bilingual translation -->
                    <div class="wc-settings-list-item" onclick="wcToggleBilingualTranslation(event)">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" id="Translate-Bold--Streamline-Phosphor" height="16" width="16">
                              <desc>
                                Translate Bold Streamline Icon: https://streamlinehq.com
                              </desc>
                              <path d="m15.7544375 13.84650625 -3.78489375 -7.5697875c-0.27954375 -0.55826875 -1.0586 -0.604575 -1.40230625 -0.08335 -0.017675 0.02680625 -0.03374375 0.0546375 -0.04811875 0.08335l-1.38689375 2.77108125c-0.93435625 -0.081675 -1.8340375 -0.393025 -2.6190125 -0.90634375 0.95389375 -1.10931875 1.5506 -2.48081875 1.7119875 -3.9349375h1.39703125c0.62434375 -0.00055 1.01396875 -0.6767625 0.70131875 -1.2171875 -0.14484375 -0.250375 -0.41206875 -0.40465625 -0.70131875 -0.40490625H6.1076875V1.773375c-0.00054375 -0.62434375 -0.6767625 -1.01396875 -1.2171875 -0.701325 -0.250375 0.14485 -0.40465625 0.412075 -0.40490625 0.701325v0.81105H0.97105C0.3467 2.58496875 -0.04291875 3.2611875 0.269725 3.8016125c0.14485 0.25036875 0.412075 0.40465 0.701325 0.40490625h5.6185375c-0.1521375 1.05703125 -0.60040625 2.0494 -1.29295 2.862325 -0.33795625 -0.39548125 -0.61995625 -0.8355375 -0.83808125 -1.3078125 -0.246675 -0.57355 -1.0217375 -0.66498125 -1.39510625 -0.164575 -0.181525 0.24329375 -0.212 0.56759375 -0.078975 0.84044375 0.28371875 0.617025 0.6525 1.19124375 1.09559375 1.70590625 -0.92300625 0.60755625 -2.00400625 0.9309125 -3.10901875 0.93000625 -0.62435 0.00054375 -1.01396875 0.6767625 -0.701325 1.2171875 0.14485 0.25036875 0.412075 0.40465 0.701325 0.40490625 1.5572375 0.00126875 3.07365625 -0.49796875 4.3255875 -1.4240625 0.90790625 0.6681375 1.9577375 1.11776875 3.06779375 1.31389375l-1.63088125 3.26176875c-0.292625 0.551525 0.1215375 1.213 0.74548125 1.19065625 0.30360625 -0.010875 0.57568125 -0.1905125 0.70494375 -0.46544375l0.85768125 -1.71401875h4.40466875l0.85700625 1.71401875c0.2791375 0.55853125 1.05821875 0.6054375 1.40235625 0.0844375 0.1597125 -0.2418 0.17829375 -0.5504375 0.04874375 -0.80965Zm-5.90173125 -2.6109 1.391625 -2.782575 1.39094375 2.782575Z" stroke-width="0.0625"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">双语翻译</div>
                            <div class="wc-settings-item-subtitle">点按收到的文本气泡显示或收起译文</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch" id="wc-bilingual-translation-toggle" aria-checked="false"></div>
                        </div>
                    </div>

                    <div class="wc-settings-list-item wc-bilingual-direction-item" id="wc-bilingual-translation-direction" style="cursor: default;">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 7h12"></path>
                                <path d="m13 4 3 3-3 3"></path>
                                <path d="M20 17H8"></path>
                                <path d="m11 14-3 3 3 3"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">翻译方向</div>
                            <div class="wc-settings-item-subtitle" id="wc-bilingual-direction-subtitle">自动识别 → 简体中文</div>
                            <div class="wc-bilingual-direction-controls" onclick="event.stopPropagation()">
                                <select class="wc-bilingual-language-select" id="wc-bilingual-source-language" aria-label="源语言" onchange="wcSaveBilingualTranslationLanguages()">
                                    <option value="auto">自动识别</option>
                                    <option value="zh-CN">简体中文</option>
                                    <option value="zh-TW">繁体中文</option>
                                    <option value="en">英语</option>
                                    <option value="ja">日语</option>
                                    <option value="ko">韩语</option>
                                    <option value="fr">法语</option>
                                    <option value="de">德语</option>
                                    <option value="es">西班牙语</option>
                                    <option value="ru">俄语</option>
                                    <option value="pt">葡萄牙语</option>
                                    <option value="it">意大利语</option>
                                    <option value="ar">阿拉伯语</option>
                                    <option value="th">泰语</option>
                                    <option value="vi">越南语</option>
                                    <option value="id">印尼语</option>
                                    <option value="hi">印地语</option>
                                    <option value="el">希腊语</option>
                                </select>
                                <svg class="wc-bilingual-direction-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="m15 8 4 4-4 4"></path>
                                </svg>
                                <select class="wc-bilingual-language-select" id="wc-bilingual-target-language" aria-label="目标语言" onchange="wcSaveBilingualTranslationLanguages()">
                                    <option value="zh-CN">简体中文</option>
                                    <option value="zh-TW">繁体中文</option>
                                    <option value="en">英语</option>
                                    <option value="ja">日语</option>
                                    <option value="ko">韩语</option>
                                    <option value="fr">法语</option>
                                    <option value="de">德语</option>
                                    <option value="es">西班牙语</option>
                                    <option value="ru">俄语</option>
                                    <option value="pt">葡萄牙语</option>
                                    <option value="it">意大利语</option>
                                    <option value="ar">阿拉伯语</option>
                                    <option value="th">泰语</option>
                                    <option value="vi">越南语</option>
                                    <option value="id">印尼语</option>
                                    <option value="hi">印地语</option>
                                    <option value="el">希腊语</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Long-distance relationship mode -->
                    <div class="wc-settings-list-item" onclick="wcToggleLongDistanceMode()">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 12h16"></path>
                                <path d="M7 8l-3 4 3 4"></path>
                                <path d="M17 8l3 4-3 4"></path>
                                <path d="M8 5h8"></path>
                                <path d="M8 19h8"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">异地模式</div>
                            <div class="wc-settings-item-subtitle">告诉 TA 你们暂时不能见面，只能通过线上联系</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch" id="wc-long-distance-mode-toggle" aria-checked="false"></div>
                        </div>
                    </div>

                    <!-- Online narration / action bubbles -->
                    <div class="wc-settings-list-item" onclick="wcToggleOnlineNarration()">
                        <div class="wc-settings-item-icon">
                            <svg t="1789672849070" class="fill-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6217"><path d="M807.253333 178.773333c13.909333 13.866667 17.28 20.693333 3.413334 34.56l-64 64-128-128L682.666667 85.333333c13.866667-13.866667 21.973333-10.453333 35.84 3.413334l88.746666 90.026666z m-231.253333 13.184l128 128.042667L341.333333 682.666667H213.333333v-128l362.666667-362.709334z" p-id="6218"></path><path d="M149.290667 810.666667h725.418666q2.133333 0 4.138667 0.426666 2.090667 0.426667 4.010667 1.194667 1.92 0.810667 3.669333 1.962667 1.749333 1.152 3.242667 2.645333 1.493333 1.493333 2.645333 3.242667 1.152 1.706667 1.962667 3.669333 0.810667 1.92 1.194666 4.010667 0.426667 2.048 0.426667 4.138666v42.752q0 2.133333-0.426667 4.138667-0.426667 2.090667-1.194666 4.010667-0.810667 1.92-1.962667 3.669333-1.152 1.749333-2.645333 3.242667-1.493333 1.493333-3.242667 2.645333-1.706667 1.152-3.669333 1.962667-1.962667 0.810667-4.010667 1.194666-2.048 0.426667-4.138667 0.426667H149.290667q-2.133333 0-4.138667-0.426667-2.090667-0.426667-4.010667-1.194666-1.92-0.810667-3.669333-1.962667-1.749333-1.152-3.242667-2.645333-1.493333-1.493333-2.645333-3.242667-1.152-1.706667-1.962667-3.669333-0.810667-1.92-1.194666-4.010667Q128 876.8 128 874.709333v-42.752q0-2.133333 0.426667-4.138666 0.426667-2.090667 1.194666-4.010667 0.810667-1.92 1.962667-3.669333 1.152-1.749333 2.645333-3.242667 1.493333-1.493333 3.242667-2.645333 1.706667-1.152 3.669333-1.962667 1.92-0.810667 4.010667-1.194667 2.048-0.426667 4.138667-0.426666z" p-id="6219"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">线上旁白</div>
                            <div class="wc-settings-item-subtitle" id="wc-online-narration-status-subtitle">允许发送动作描写，并让 TA 生成独立旁白气泡</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch" id="wc-online-narration-toggle" aria-checked="false"></div>
                        </div>
                    </div>

                    <div class="wc-settings-list-item" onclick="wcToggleProactiveMessages()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                              <path d="M0.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803 -3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606 -3.446l-0.367 -0.225L8 9.586zM16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0 -1.965 0.45l-0.338 -0.207z"></path>
                              <path d="M16 12.5a3.5 3.5 0 1 1 -7 0 3.5 3.5 0 0 1 7 0m-1.993 -1.679a0.5 0.5 0 0 0 -0.686 0.172l-1.17 1.95 -0.547 -0.547a0.5 0.5 0 0 0 -0.708 0.708l0.774 0.773a0.75 0.75 0 0 0 1.174 -0.144l1.335 -2.226a0.5 0.5 0 0 0 -0.172 -0.686"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">角色主动消息</div>
                            <div class="wc-settings-item-subtitle">后台由 TA 的人设和聊天状态决定何时主动找你</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch" id="wc-proactive-message-toggle" aria-checked="false"></div>
                        </div>
                    </div>

                    <div class="wc-settings-list-item" id="wc-proactive-frequency-row" style="cursor: default; display: none;">
                        <div class="wc-settings-item-icon" style="background: transparent;">
                            <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #8E8E93;"></div>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">主动消息间隔</div>
                            <div class="wc-settings-item-subtitle" id="wc-proactive-message-interval-description">留空由 TA 自动判断；填写分钟数则固定间隔</div>
                        </div>
                        <div class="wc-settings-item-right" style="gap: 6px;">
                            <input type="number" id="wc-proactive-message-interval" min="1" max="1440" step="1" inputmode="numeric" placeholder="自动" aria-label="主动消息间隔，留空自动判断，单位分钟" style="width: 58px; padding: 5px 4px; border: 1px solid rgba(60, 60, 67, 0.18); border-radius: 7px; background: rgba(118, 118, 128, 0.08); color: inherit; text-align: center; font-size: 14px;" onchange="wcSaveProactiveMessageInterval(this.value)">
                            <span style="font-size: 13px; color: #8e8e93;">分钟</span>
                        </div>
                    </div>

                    <div class="wc-settings-list-item" style="cursor: default;">
                        <div class="wc-settings-item-icon"><svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M7 8h10M10 16h4"/></svg></div>
                        <div class="wc-settings-item-content"><div class="wc-settings-item-title">聊天流速</div><div class="wc-settings-item-subtitle">控制连续气泡之间的发送间隔</div></div>
                        <div class="wc-settings-item-right" style="gap: 8px;"><input type="range" id="wc-reply-speed-slider" min="25" max="300" step="25" value="100" style="width: 90px; accent-color: #007aff;" onchange="wcSaveReplySpeed()"><span id="wc-reply-speed-value" style="min-width: 42px; text-align: right; font-size: 14px; color: #8e8e93;">1x</span></div>
                    </div>
                    <!-- 2. 天气感知 -->
                    <div class="wc-settings-list-item" onclick="wcToggleWeatherAwareness()">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">感知现实天气</div>
                            <div class="wc-settings-item-subtitle">Sync real-world weather</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <div class="wc-ios-switch active" id="wc-weather-awareness-toggle" aria-checked="true"></div>
                        </div>
                    </div>

                    <div class="wc-settings-list-item" onclick="wcOpenRealLocationSheet()">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">真实地点</div>
                            <div class="wc-settings-item-subtitle">用于分别感知 Char 与 User 所在地天气</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <span id="wc-real-location-status" style="font-size: 15px; color: #8E8E93;">未设置</span>
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- 3. 关联表情包 -->

                    <div class="wc-settings-list-item" onclick="wcOpenBindEmojiGroups()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.0132666666666665 13.242266666666666c0.0504 -0.8012666666666666 0.24226666666666666 -1.5641333333333334 0.5509333333333333 -2.2638666666666665 -1.0233733333333332 -0.09493333333333333 -1.9517733333333331 -0.5206 -2.675473333333333 -1.1683333333333332l0.8892133333333333 -0.9935333333333333c0.5901733333333333 0.5282666666666667 1.3679266666666667 0.8486666666666666 2.22206 0.8486666666666666 0.11753333333333334 0 0.2334 -0.006066666666666666 0.3474 -0.017866666666666666 1.1372666666666666 -1.5027333333333335 2.8966666666666665 -2.5084666666666666 4.894866666666666 -2.6340666666666666C12.779466666666666 4.53918 10.6084 2.6666666666666665 8 2.6666666666666665c-2.94552 0 -5.333333333333333 2.387813333333333 -5.333333333333333 5.333333333333333 0 2.6083999999999996 1.8725133333333333 4.779466666666666 4.3466 5.242266666666667Zm5.6689333333333325 -4.818266666666666c-2.156133333333333 0.4024 -3.8557999999999995 2.1020666666666665 -4.2581999999999995 4.2581999999999995l4.2581999999999995 -4.2581999999999995ZM14.666666666666666 8c0 0.11179999999999998 -0.0027333333333333333 0.22293333333333332 -0.008199999999999999 0.3333333333333333L8.333333333333332 14.658466666666666c-0.1104 0.0054666666666666665 -0.2215333333333333 0.008199999999999999 -0.3333333333333333 0.008199999999999999 -3.6818999999999997 0 -6.666666666666666 -2.9848 -6.666666666666666 -6.666666666666666C1.3333333333333333 4.318099999999999 4.318099999999999 1.3333333333333333 8 1.3333333333333333c3.6818666666666666 0 6.666666666666666 2.9847666666666663 6.666666666666666 6.666666666666666Zm-8 -1.3333333333333333c0 0.5522666666666667 -0.4477133333333333 1 -1 1S4.666666666666666 7.218933333333333 4.666666666666666 6.666666666666666c0 -0.5522866666666666 0.4477133333333333 -1 1 -1S6.666666666666666 6.114379999999999 6.666666666666666 6.666666666666666Zm4.666666666666666 0c0 0.5522666666666667 -0.4477333333333333 1 -1 1S9.333333333333332 7.218933333333333 9.333333333333332 6.666666666666666c0 -0.5522866666666666 0.4477333333333333 -1 1 -1S11.333333333333332 6.114379999999999 11.333333333333332 6.666666666666666Z"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">关联表情包</div>
                            <div class="wc-settings-item-subtitle">选择TA可以使用的表情包分组</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <span style="font-size: 15px; color: #8E8E93;">全部</span>
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <div class="wc-settings-group-header" style="margin-top: 10px;">记忆与限制</div>

                    <!-- 4. 聊天上下文记忆 -->
                    <div class="wc-settings-list-item" style="cursor: default;">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.2702 7.79619L16.6593 9.67155L12.2679 11.908C12.1861 11.9539 12.0938 11.978 12 11.978C11.9062 11.978 11.8139 11.9539 11.7321 11.908L7.34072 9.67155L3.72978 7.79619C3.63181 7.74658 3.54951 7.67079 3.49201 7.57723C3.43451 7.48367 3.40408 7.37601 3.40408 7.26619C3.40408 7.15638 3.43451 7.04872 3.49201 6.95516C3.54951 6.8616 3.63181 6.78581 3.72978 6.7362L11.7437 2.81076C11.8233 2.77081 11.911 2.75 12 2.75C12.089 2.75 12.1767 2.77081 12.2563 2.81076L20.2702 6.7362C20.3682 6.78581 20.4505 6.8616 20.508 6.95516C20.5655 7.04872 20.5959 7.15638 20.5959 7.26619C20.5959 7.37601 20.5655 7.48367 20.508 7.57723C20.4505 7.67079 20.3682 7.74658 20.2702 7.79619Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.34079 9.67154L3.72985 11.3955C3.63188 11.4451 3.54958 11.5209 3.49208 11.6144C3.43458 11.708 3.40415 11.8156 3.40415 11.9255C3.40415 12.0353 3.43458 12.1429 3.49208 12.2365C3.54958 12.3301 3.63188 12.4059 3.72985 12.4555L7.34079 14.3308L11.7322 16.5673C11.814 16.6132 11.9062 16.6373 12.0001 16.6373C12.0939 16.6373 12.1862 16.6132 12.268 16.5673L16.6593 14.3308L20.2703 12.4555C20.357 12.4024 20.4287 12.3279 20.4784 12.2392C20.5281 12.1505 20.5542 12.0505 20.5542 11.9488C20.5542 11.8471 20.5281 11.7471 20.4784 11.6583C20.4287 11.5696 20.357 11.4952 20.2703 11.4421L16.6593 9.67154" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.34079 14.3308L3.72985 16.0548C3.63188 16.1044 3.54958 16.1802 3.49208 16.2737C3.43458 16.3673 3.40415 16.475 3.40415 16.5848C3.40415 16.6946 3.43458 16.8022 3.49208 16.8958C3.54958 16.9894 3.63188 17.0652 3.72985 17.1148L11.7322 21.18C11.814 21.2259 11.9062 21.25 12.0001 21.25C12.0939 21.25 12.1862 21.2259 12.268 21.18L20.2703 17.1148C20.357 17.0617 20.4287 16.9872 20.4784 16.8985C20.5281 16.8098 20.5542 16.7098 20.5542 16.6081C20.5542 16.5064 20.5281 16.4064 20.4784 16.3176C20.4287 16.2289 20.357 16.1545 20.2703 16.1014L16.6593 14.3308" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">记忆条数</div>
                            <div class="wc-settings-item-subtitle">每轮读取的聊天历史条数，0 = 仅当前消息</div>
                        </div>
                        <div class="wc-settings-item-right" style="gap: 6px;">
                            <input type="number" id="wc-context-memory-limit" min="0" value="100" style="width: 58px; padding: 5px 4px; border: 1px solid rgba(60, 60, 67, 0.18); border-radius: 7px; background: rgba(118, 118, 128, 0.08); color: inherit; text-align: center; font-size: 14px;" onchange="wcSaveContextMemoryLimit()">
                            <span style="font-size: 13px; color: #8e8e93;">条</span>
                        </div>
                    </div>

                    <!-- 5. 气泡限制 -->
                    <div class="wc-settings-list-item" style="cursor: default;">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">气泡限制</div>
                            <div class="wc-settings-item-subtitle">每轮回复最小与最大气泡数</div>
                        </div>
                        <div class="wc-settings-item-right" style="gap: 6px;">
                            <div class="wc-settings-input-group" style="gap: 6px;">
                                <input type="number" id="wc-min-bubble-limit" value="1" style="width: 44px; padding: 5px 4px; border: 1px solid rgba(60, 60, 67, 0.18); border-radius: 7px; background: rgba(118, 118, 128, 0.08); color: inherit; text-align: center; font-size: 14px;" onchange="wcSaveBubbleLimits()">
                                <span class="wc-settings-input-separator" style="color: #8e8e93;">-</span>
                                <input type="number" id="wc-max-bubble-limit" value="8" style="width: 44px; padding: 5px 4px; border: 1px solid rgba(60, 60, 67, 0.18); border-radius: 7px; background: rgba(118, 118, 128, 0.08); color: inherit; text-align: center; font-size: 14px;" onchange="wcSaveBubbleLimits()">
                            </div>
                            <span style="font-size: 13px; color: #8e8e93;">个</span>
                        </div>
                    </div>

                    <div class="wc-settings-group-header" style="margin-top: 10px;">扩展设定</div>

                    <!-- 6. 心声系统 -->
                    <div class="wc-settings-list-item" onclick="wcShowDossierSettings()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="m9.26556 20.6154 0.45502 -0.5962 -0.45502 0.5962ZM12 8.93062l-0.5319 0.52878c0.1408 0.1416 0.3322 0.22122 0.5319 0.22122 0.1997 0 0.3911 -0.07962 0.5319 -0.22122L12 8.93062Zm2.7344 11.68478 0.4551 0.5962 -0.4551 -0.5962Zm-7.19542 -2.2516c-0.32395 -0.2581 -0.79582 -0.2048 -1.05394 0.1192 -0.25812 0.3239 -0.20476 0.7958 0.11919 1.0539l0.93475 -1.1731ZM3.247 15.8789c0.20373 0.3606 0.66125 0.4878 1.0219 0.2841 0.36064 -0.2037 0.48784 -0.6613 0.2841 -1.0219l-1.306 0.7378Zm0.503 -3.7797c0 -1.8244 1.06485 -3.3645 2.53482 -4.01502 1.42875 -0.63228 3.35259 -0.46623 5.18328 1.37522l1.0638 -1.05756C10.3127 6.16968 7.73658 5.8014 5.67779 6.7125 3.66023 7.60535 2.25 9.68634 2.25 12.0992h1.5Zm5.06054 9.1124c0.46045 0.3514 0.95933 0.7297 1.46586 1.0163 0.5068 0.2867 1.0892 0.5221 1.7236 0.5221v-1.5c-0.2656 0 -0.5832 -0.1004 -0.985 -0.3277 -0.4021 -0.2274 -0.8204 -0.5414 -1.29442 -0.9031l-0.91004 1.1924Zm6.37896 0c1.2789 -0.9762 2.9293 -2.1054 4.2234 -3.5163 1.32 -1.4389 2.3371 -3.2353 2.3371 -5.5961h-1.5c0 1.8764 -0.7916 3.3276 -1.9424 4.5822 -1.1767 1.2826 -2.6591 2.2929 -4.0282 3.3378l0.9101 1.1924Zm6.5605 -9.1124c0 -2.41286 -1.4102 -4.49385 -3.4278 -5.3867 -2.0588 -0.9111 -4.6349 -0.54282 -6.8541 1.68934l1.0638 1.05756c1.8307 -1.84145 3.7545 -2.0075 5.1833 -1.37522 1.47 0.65052 2.5348 2.19062 2.5348 4.01502h1.5Zm-7.4706 7.92c-0.474 0.3617 -0.8923 0.6757 -1.2944 0.9031 -0.4018 0.2273 -0.7194 0.3277 -0.985 0.3277v1.5c0.6344 0 1.2168 -0.2354 1.7236 -0.5221 0.5065 -0.2866 1.0054 -0.6649 1.4659 -1.0163l-0.9101 -1.1924Zm-4.55882 0c-0.71908 -0.5489 -1.4435 -1.0673 -2.1816 -1.6554l-0.93475 1.1731c0.74776 0.5958 1.54064 1.1666 2.20631 1.6747l0.91004 -1.1924ZM4.553 15.1411c-0.49712 -0.88 -0.803 -1.8738 -0.803 -3.0419h-1.5c0 1.4491 0.3842 2.6949 0.997 3.7797l1.306 -0.7378Z"></path>
                                <path d="M17 7c0 -3.31371 -1.9875 -5 -5 -5 -3.01246 0 -5 1.68629 -5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path>
                                <path d="M12 12v2.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">心声系统</div>
                            <div class="wc-settings-item-subtitle">自定义心声状态栏与正则模板</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- 7. 思维链 -->
                    <div class="wc-settings-list-item" onclick="wcShowCotSettings()">
                        <div class="wc-settings-item-icon">
                            <svg class="stroke-icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">思维链</div>
                            <div class="wc-settings-item-subtitle">Chain of Thought 深度推理</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- 8. 自定义提示词 -->
                    <div class="wc-settings-list-item" onclick="wcShowPromptSettings()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" viewBox="0 0 24 24"><path d="M18 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6"></path><path d="M18 11c-2.76 0-5-2.24-5-5a5 5 0 0 1 .9-2.85C13.28 3.05 12.65 3 12 3 6.49 3 2 6.59 2 11c0 2.91 1.9 5.51 5 6.93V21c0 .38.21.73.55.89.14.07.29.11.45.11.21 0 .42-.07.6-.2l3.74-2.8c5.36-.14 9.66-3.68 9.66-8 0-.6-.09-1.18-.24-1.74C20.84 10.31 19.51 11 18 11"></path></svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">自定义提示词</div>
                            <div class="wc-settings-item-subtitle">修改底层 System Prompt 注入</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- 9. 自定义预设 -->
                    <div class="wc-settings-list-item" onclick="wcShowCustomPresetSettings()">
                        <div class="wc-settings-item-icon">
                            <svg class="fill-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="m10.5 5 1-.67 1 .67-.33-1.17.83-.71L12 3l-.5-1-.5 1-1 .12.83.71zm9.83 8.67L19.5 12l-.83 1.67-1.67.21 1.39 1.18-.56 1.94 1.67-1.11L21.17 17l-.56-1.94L22 13.88zM4.83 9 6.5 7.89 8.17 9l-.56-1.95L9 5.88l-1.67-.21L6.5 4l-.83 1.67L4 5.88l1.39 1.17zm13.88-6.71a.996.996 0 0 0-1.41 0l-15.01 15a.996.996 0 0 0 0 1.41l3 3c.2.2.45.29.71.29s.51-.1.71-.29l15-15a.996.996 0 0 0 0-1.41zM16.5 9.08l-1.59-1.59L18 4.4l1.59 1.59z"></path>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title">自定义预设</div>
                            <div class="wc-settings-item-subtitle">管理与应用您的专属配置</div>
                        </div>
                        <div class="wc-settings-item-right">
                            <svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <div class="wc-settings-group-header" style="margin-top: 10px;">好友管理</div>

                    <!-- 10. 拉黑好友 -->
                    <div class="wc-settings-list-item" onclick="wcToggleBlacklist()">
                        <div class="wc-settings-item-icon" style="background-color: #FF9500;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Inbox-Block--Streamline-Core" height="14" width="14">
                              <g id="inbox-block--mail-envelope-email-message-block-spam-remove">
                                <path id="Vector" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M10.25 13.5c1.7949 0 3.25 -1.4551 3.25 -3.25C13.5 8.45507 12.0449 7 10.25 7 8.45507 7 7 8.45507 7 10.25c0 1.7949 1.45507 3.25 3.25 3.25Z" stroke-width="1"></path>
                                <path id="Vector_2" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M12.55 12.55 7.95005 7.94995" stroke-width="1"></path>
                                <path id="Vector_3" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M4.5 9.5h-3c-0.26522 0 -0.51957 -0.10536 -0.707107 -0.29289C0.605357 9.01957 0.5 8.76522 0.5 8.5v-7c0 -0.26522 0.105357 -0.51957 0.292893 -0.707107C0.98043 0.605357 1.23478 0.5 1.5 0.5h10c0.2652 0 0.5196 0.105357 0.7071 0.292893 0.1875 0.187537 0.2929 0.441887 0.2929 0.707107V5" stroke-width="1"></path>
                                <path id="Vector_4" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="m0.5 1.76001 6 4.24 6 -4.24" stroke-width="1"></path>
                              </g>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title" id="wc-blacklist-btn-title" style="color: #FF9500;">拉黑好友</div>
                            <div class="wc-settings-item-subtitle">加入黑名单，拒收对方发来的消息</div>                        
                        </div>
                    </div>

                    <!-- 11. 删除好友 -->
                    <div class="wc-settings-list-item" onclick="wcDeleteCurrentFriend()">
                        <div class="wc-settings-item-icon" style="background-color: #FF3B30;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Recycle-Bin-2--Streamline-Plump">
                              <g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage">
                                <path id="Subtract" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M6.182 15.842c0.887 13.815 1.736 21.002 2.24 24.423 0.256 1.73 1.392 3.14 3.093 3.548C13.83 44.37 17.817 45 24.002 45c6.185 0 10.171 -0.63 12.487 -1.186 1.7 -0.408 2.836 -1.818 3.092 -3.548 0.505 -3.422 1.353 -10.609 2.24 -24.427" stroke-width="3"></path>
                                <path id="Union" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M31.036 7.176c3.56 0.066 6.334 0.174 8.322 0.275 2.39 0.12 4.61 1.393 5.278 3.691 0.1 0.345 0.194 0.71 0.276 1.097 0.394 1.84 -0.983 3.421 -2.858 3.58 -3.02 0.255 -8.547 0.545 -18.077 0.545 -9.529 0 -15.057 -0.29 -18.076 -0.545 -1.876 -0.158 -3.261 -1.75 -2.776 -3.568 0.175 -0.655 0.39 -1.253 0.616 -1.784 0.813 -1.903 2.77 -2.885 4.836 -2.999 1.908 -0.104 4.685 -0.222 8.387 -0.292A7 7 0 0 1 23.37 3h1.262a7 7 0 0 1 6.405 4.176Z" stroke-width="3"></path>
                                <path id="Vector 831" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="m18 25 1 10" stroke-width="3"></path>
                                <path id="Vector 832" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="m30 25 -1 10" stroke-width="3"></path>
                              </g>
                            </svg>
                        </div>
                        <div class="wc-settings-item-content">
                            <div class="wc-settings-item-title" style="color: #FF3B30;">删除好友</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Worldbook binding -->
            <div class="wc-settings-content wc-wb-binding-view" id="wc-worldbook-binding-view" style="display: none; flex-direction: column; height: 100%; padding-bottom: 0;">
                <div class="wc-wb-binding-scroll">
                    <div class="wc-wb-page-note">
                        只影响当前角色聊天，不修改世界书 App 与联系人里的原绑定。
                    </div>

                    <div class="wc-wb-master-card">
                        <div class="wc-wb-master-copy">
                            <div class="wc-wb-master-title">聊天专属世界书</div>
                            <div class="wc-wb-master-desc" id="wc-worldbook-custom-mode-hint">关闭时跟随世界书 App 原绑定</div>
                        </div>
                        <div class="wc-ios-switch" id="wc-worldbook-custom-toggle" role="switch" aria-checked="false" onclick="wcToggleWorldbookOverride()"></div>
                    </div>

                    <div class="wc-wb-store-card">
                        <div class="wc-wb-store-card-head">
                            <div>
                                <div class="wc-wb-store-card-kicker">WORLD BOOK</div>
                                <div class="wc-wb-store-card-title">绑定世界书</div>
                                <div class="wc-wb-store-card-desc">按分组展开并选择当前聊天需要读取的词条</div>
                            </div>
                            <div class="wc-wb-store-stat" id="wc-worldbook-binding-summary"></div>
                        </div>

                        <div class="wc-wb-store-tree" id="wc-worldbook-binding-list"></div>
                        <div class="wc-wb-store-tip">选择结果仅对当前角色生效；全局词条也可以在这里单独关闭。</div>
                    </div>
                </div>
            </div>

            <!-- 提示词列表视图 -->
            <div class="wc-settings-content" id="wc-prompt-list-view" style="display: none; flex-direction: column; height: 100%;">
                <div id="wc-prompt-list-container" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto;">
                    <!-- 动态渲染提示词列表 -->
                </div>
                <div style="padding: 0 16px 16px; flex-shrink: 0;">
                    <button class="btn-primary" style="width: 100%;" onclick="wcOpenEditPrompt()">+ 添加自定义提示词</button>
                </div>
            </div>

            <!-- 思维链列表视图 -->
            <div class="wc-settings-content" id="wc-cot-list-view" style="display: none; flex-direction: column; height: 100%;">
                <div id="wc-cot-list-container" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto;">
                    <!-- 动态渲染思维链列表 -->
                </div>
                <div style="padding: 0 16px 16px; flex-shrink: 0;">
                    <button class="btn-primary" style="width: 100%;" onclick="wcOpenEditCot()">+ 添加自定义思维链</button>
                </div>
            </div>

            <!-- 心声系统列表视图 -->
            <div class="wc-settings-content" id="wc-dossier-list-view" style="display: none; flex-direction: column; height: 100%;">
                <div id="wc-dossier-list-container" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto;">
                    <!-- 动态渲染心声列表 -->
                </div>
                <div style="padding: 0 16px 16px; flex-shrink: 0; display: flex; gap: 10px;">
                    <button class="btn-secondary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="wcTriggerImportDossierFile()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6801 7.01398C20.458 6.54993 20.1451 6.1351 19.76 5.79398L16.76 3.07398C16.0997 2.46873 15.2613 2.09339 14.37 2.004H8.21008C7.54764 1.97591 6.88617 2.07983 6.26428 2.30976C5.64239 2.53969 5.07249 2.89103 4.58765 3.3433C4.10281 3.79557 3.71274 4.33973 3.44019 4.94416C3.16763 5.54858 3.01797 6.20119 3 6.86399V17.164C3.03538 18.1635 3.36978 19.1294 3.95984 19.937C4.5499 20.7445 5.36855 21.3566 6.31006 21.694C6.92247 21.9255 7.57613 22.0277 8.22998 21.994H15.79C16.4525 22.0221 17.1138 21.9181 17.7357 21.6882C18.3576 21.4583 18.9276 21.107 19.4125 20.6547C19.8973 20.2024 20.2874 19.6582 20.5599 19.0538C20.8325 18.4494 20.982 17.7968 21 17.134V8.564C21.0048 8.03045 20.8958 7.502 20.6801 7.01398ZM15.8401 15.094L13.1801 17.764C13.0271 17.9131 12.8472 18.0319 12.65 18.114C12.5171 18.1738 12.3751 18.211 12.23 18.224C12.0983 18.254 11.9617 18.254 11.8301 18.224C11.6849 18.211 11.5429 18.1738 11.41 18.114C11.2128 18.0319 11.033 17.9131 10.88 17.764L8.21997 15.094C8.05614 14.9027 7.97063 14.6566 7.98035 14.4049C7.99007 14.1533 8.09437 13.9145 8.27246 13.7364C8.45056 13.5583 8.68924 13.454 8.94092 13.4443C9.19259 13.4346 9.4387 13.5202 9.63 13.684L11.03 15.084V10.474C11.03 10.2088 11.1353 9.95442 11.3229 9.76688C11.5104 9.57934 11.7648 9.474 12.03 9.474C12.2952 9.474 12.5496 9.57934 12.7372 9.76688C12.9247 9.95442 13.03 10.2088 13.03 10.474V15.084L14.4301 13.684C14.6214 13.5202 14.8675 13.4346 15.1191 13.4443C15.3708 13.454 15.6095 13.5583 15.7876 13.7364C15.9657 13.9145 16.07 14.1533 16.0797 14.4049C16.0894 14.6566 16.0039 14.9027 15.8401 15.094ZM16.0601 7.404C15.9174 7.40532 15.7759 7.37836 15.6437 7.32468C15.5115 7.271 15.3913 7.19164 15.2899 7.09122C15.1886 6.9908 15.1081 6.87129 15.0532 6.7396C14.9983 6.60791 14.97 6.46665 14.97 6.32398V3.67399C15.2509 3.82603 15.5215 3.99641 15.78 4.184L18.78 6.91398C18.9456 7.05349 19.0875 7.219 19.2001 7.404H16.0601Z" fill="currentColor"/>
                        </svg>
                        <span>导入模板</span>
                    </button>
                    <button class="btn-primary" style="flex: 1.4;" onclick="wcOpenEditDossier()">+ 添加自定义模板</button>
                </div>
            </div>

            <!-- 自定义预设列表视图 -->
            <div class="wc-settings-content" id="wc-custom-preset-list-view" style="display: none; flex-direction: column; height: 100%;">
                <div id="wc-custom-preset-list-container" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto;">
                    <!-- 动态渲染预设列表 -->
                </div>
                <div style="padding: 0 16px 16px; flex-shrink: 0; display: flex; gap: 10px;">
                    <input type="file" id="wcCustomPresetImportInput" accept=".json,application/json" style="display: none;" onchange="wcHandleCustomPresetImportFile(event)">
                    <button type="button" class="btn-secondary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="wcTriggerCustomPresetImport()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M20.6801 7.01398C20.458 6.54993 20.1451 6.1351 19.76 5.79398L16.76 3.07398C16.0997 2.46873 15.2613 2.09339 14.37 2.004H8.21008C7.54764 1.97591 6.88617 2.07983 6.26428 2.30976C5.64239 2.53969 5.07249 2.89103 4.58765 3.3433C4.10281 3.79557 3.71274 4.33973 3.44019 4.94416C3.16763 5.54858 3.01797 6.20119 3 6.86399V17.164C3.03538 18.1635 3.36978 19.1294 3.95984 19.937C4.5499 20.7445 5.36855 21.3566 6.31006 21.694C6.92247 21.9255 7.57613 22.0277 8.22998 21.994H15.79C16.4525 22.0221 17.1138 21.9181 17.7357 21.6882C18.3576 21.4583 18.9276 21.107 19.4125 20.6547C19.8973 20.2024 20.2874 19.6582 20.5599 19.0538C20.8325 18.4494 20.982 17.7968 21 17.134V8.564C21.0048 8.03045 20.8958 7.502 20.6801 7.01398ZM15.8401 15.094L13.1801 17.764C13.0271 17.9131 12.8472 18.0319 12.65 18.114C12.5171 18.1738 12.3751 18.211 12.23 18.224C12.0983 18.254 11.9617 18.254 11.8301 18.224C11.6849 18.211 11.5429 18.1738 11.41 18.114C11.2128 18.0319 11.033 17.9131 10.88 17.764L8.21997 15.094C8.05614 14.9027 7.97063 14.6566 7.98035 14.4049C7.99007 14.1533 8.09437 13.9145 8.27246 13.7364C8.45056 13.5583 8.68924 13.454 8.94092 13.4443C9.19259 13.4346 9.4387 13.5202 9.63 13.684L11.03 15.084V10.474C11.03 10.2088 11.1353 9.95442 11.3229 9.76688C11.5104 9.57934 11.7648 9.474 12.03 9.474C12.2952 9.474 12.5496 9.57934 12.7372 9.76688C12.9247 9.95442 13.03 10.2088 13.03 10.474V15.084L14.4301 13.684C14.6214 13.5202 14.8675 13.4346 15.1191 13.4443C15.3708 13.454 15.6095 13.5583 15.7876 13.7364C15.9657 13.9145 16.07 14.1533 16.0797 14.4049C16.0894 14.6566 16.0039 14.9027 15.8401 15.094ZM16.0601 7.404C15.9174 7.40532 15.7759 7.37836 15.6437 7.32468C15.5115 7.271 15.3913 7.19164 15.2899 7.09122C15.1886 6.9908 15.1081 6.87129 15.0532 6.7396C14.9983 6.60791 14.97 6.46665 14.97 6.32398V3.67399C15.2509 3.82603 15.5215 3.99641 15.78 4.184L18.78 6.91398C18.9456 7.05349 19.0875 7.219 19.2001 7.404H16.0601Z" fill="currentColor"/>
                        </svg>
                        <span>导入预设</span>
                    </button>
                    <button type="button" class="btn-primary" style="flex: 1.4;" onclick="wcOpenEditCustomPresetModal(null)">+ 添加自定义预设</button>
                </div>
            </div>

            <!-- 自定义预设编辑居中弹窗 -->
            <div class="wc-custom-preset-modal-overlay" id="wcCustomPresetModalOverlay" onclick="wcCloseEditCustomPresetModal(event)">
                <div class="wc-custom-preset-modal-card" onclick="event.stopPropagation()">
                    <div class="wc-cp-modal-header">
                        <div class="wc-cp-modal-btn cancel" onclick="wcCloseEditCustomPresetModal()">取消</div>
                        <div class="wc-cp-modal-title" id="wcPresetModalTitle">编辑自定义预设</div>
                        <div class="wc-cp-modal-btn save" onclick="wcSaveCustomPresetModal()">保存</div>
                    </div>
                    <div class="wc-cp-modal-name-wrap">
                        <input type="text" id="wcPresetModalNameInput" class="wc-cp-modal-name-input" placeholder="输入预设名称...">
                    </div>
                    <div class="wc-cp-modal-hint">
                        <span>上下按钮调整实际注入顺序；聊天提示词和思维链读取当前选择。聊天历史是前后注入边界，自定义块可使用 Depth。</span>
                    </div>
                    <div class="wc-cp-modal-body" id="wcPresetBlocksListContainer">
                        <!-- 动态渲染各模块顺序与提示词自定义配置 -->
                    </div>
                    <div style="padding: 10px 16px 16px; flex-shrink: 0;">
                        <button type="button" class="btn-secondary" style="width: 100%;" onclick="wcAddCustomPresetBlock()">+ 添加自定义块</button>
                    </div>
                </div>
            </div>

            <!-- 心声模板编辑抽屉 -->
            <div class="wc-prompt-drawer-overlay" id="wc-dossier-edit-view" onclick="wcCloseEditDossier(event)">
                <div class="wc-prompt-drawer-container">
                    <div class="wc-prompt-drawer-bg-card"></div>
                    <div class="wc-prompt-drawer-content" onclick="event.stopPropagation()">
                        <div class="wc-prompt-drawer-header">
                            <div class="wc-prompt-header-left">
                                <div class="wc-prompt-pill-btn cancel" onclick="wcCloseEditDossier()">取消</div>
                            </div>
                            <div class="wc-prompt-header-center">
                                <div class="wc-prompt-drawer-title" id="wcDossierDrawerTitle">New Dossier</div>
                            </div>
                            <div class="wc-prompt-header-right">
                                <div class="wc-prompt-circle-btn" onclick="wcOpenDossierTutorial()">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="3"></circle>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <circle cx="19" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div class="wc-prompt-pill-btn create" id="wcDossierSaveBtn" onclick="wcSaveDossier()">创建</div>
                            </div>
                        </div>
                        <div class="wc-prompt-drawer-body">
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row">
                                    <input type="text" id="wc-edit-dossier-name" placeholder="心声模板名称">
                                </div>
                            </div>
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-textarea-row" style="height: 100px;">
                                    <textarea id="wc-edit-dossier-prompt" placeholder="在此输入引导模型输出状态的提示词 (Prompt)... 例如：在末尾使用 <status>心理|心率|环境|平行时空</status> 标签输出状态"></textarea>
                                </div>
                            </div>
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row">
                                    <input type="text" id="wc-edit-dossier-regex" placeholder="正则匹配表达式 (例如：<status>(.*?)\\|(.*?)\\|(.*?)\\|(.*?)</status>)">
                                </div>
                            </div>
                            <div class="wc-prompt-input-group" style="flex: 1; display: flex; flex-direction: column;">
                                <div class="wc-prompt-textarea-row" style="flex: 1; min-height: 140px;">
                                    <textarea id="wc-edit-dossier-html" placeholder="在此输入状态栏 HTML 模板 (支持 {{1}}, {{2}}, {{3}}, {{4}}, {{time}} 占位符)..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 心声教程与模板弹窗 -->
            <div class="wc-prompt-tutorial-overlay" id="wcDossierTutorialOverlay" onclick="wcCloseDossierTutorial(event)">
                <div class="wc-prompt-tutorial-card" onclick="event.stopPropagation()">
                    <div class="wc-prompt-tutorial-title">自定义沙盒心声教程与开发规范</div>
                    <div class="wc-prompt-tutorial-content">
                        <h4>⚡ 纯净沙盒模式 (iframe Sandbox)</h4>
                        <p>自定义心声已全面切换为<b>独立沙盒渲染模式</b>，无任何样式或脚本限制！你可以自由在 HTML 模板中混合编写 <code>&lt;style&gt;</code> 与 <code>&lt;script&gt;</code>，支持复杂的 CSS 动效、Canvas 画布、甚至任意前端微组件，完全不被外部限制，也绝对不污染主程序。</p>
                        
                        <h4>🛠️ 编写规则与动态数据源</h4>
                        <p>1. <b>提示词 (Prompt)</b>：引导模型在消息末尾输出格式化标签，如 <code>在回复末尾附带单行心声标签：&lt;status&gt;心情|心率|环境|平行时空&lt;/status&gt;</code>。</p>
                        <p>2. <b>正则匹配表达式 (Regex)</b>：使用小括号捕获字段，如 <code>&lt;status&gt;(.*?)\\|(.*?)\\|(.*?)\\|(.*?)&lt;/status&gt;</code>。</p>
                        <p>3. <b>HTML 模板占位符（直接字符串替换）</b>：</p>
                        <ul style="padding-left: 20px; margin: 4px 0 8px 0;">
                            <li><code>{{1}}</code>、<code>{{2}}</code>、<code>{{3}}</code>...：分别替换为正则捕获的字段。</li>
                            <li><code>{{time}}</code>：消息时间戳。</li>
                            <li><code>{{char}}</code>：角色名称；<code>{{user}}</code>：用户名称。</li>
                        </ul>
                        <p>4. <b>JavaScript 原生数据读取（面向高级交互组件）</b>：</p>
                        <p style="font-size: 12px; color: #555; background: #f2f2f7; padding: 6px 10px; border-radius: 8px; font-family: monospace;">沙盒内可直接访问 <code>window.__DOSSIER__</code> 对象，内含 matches(捕获数组)、time、char、user 等全量数据，方便用 JS 直接驱动图表或交互动效。</p>

                        <h4>📋 AI 模板生成专属提示词</h4>
                        <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; margin-top: 8px; border: 0.5px solid rgba(0,0,0,0.06);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-size: 13px; font-weight: 700; color: #191919;">复制下方提示词发给任意 AI：</span>
                                <div onclick="wcCopyDossierAiPrompt()" title="复制提示词" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; background: #ffffff; color: #8E8E93; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                    <svg t="1789673680067" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4596" width="16" height="16" fill="#8E8E93"><path d="M914.6 63.4H282c-12.9 0-23.4 10.5-23.4 23.4v22.4c0 10.7 8.7 19.3 19.3 19.3h560.6c31.4 0 56.8 25.4 56.8 56.8v619.9c0 13.9 11.3 25.2 25.2 25.2h16c13.6 0 24.8-11.2 24.8-24.8V110.2c0.1-25.7-20.9-46.8-46.7-46.8z" p-id="4597"></path><path d="M803.5 192.5H95c-16.5 0-30 13.5-30 30V931c0 16.5 13.5 30 30 30h708.4c16.5 0 30-13.5 30-30V222.5c0.1-16.5-13.4-30-29.9-30zM704 576.3c0 26.1-21.4 47.5-47.5 47.5h-161v161c0 26.1-21.4 47.5-47.5 47.5s-47.5-21.4-47.5-47.5v-161h-161c-26.1 0-47.5-21.4-47.5-47.5s21.4-47.5 47.5-47.5h161v-161c0-26.1 21.4-47.5 47.5-47.5s47.5 21.4 47.5 47.5v161h161c26.1 0 47.5 21.3 47.5 47.5z" p-id="4598"></path></svg>
                                </div>
                            </div>
                            <div id="wcDossierAiPromptBox" style="font-size: 11.5px; color: #666; line-height: 1.5; max-height: 110px; overflow-y: auto; white-space: pre-wrap; font-family: monospace;">你是一个专业的前端 UI 设计师与角色扮演系统架构师。
我正在使用一套基于“独立沙盒 iframe 容器 + 标签捕获”的自定义心声系统。
系统完全沙盒化，你可以自由使用 HTML、CSS3 动效以及 JavaScript 交互（如动态心率折线、实时时钟、打字机效果、翻转卡片等），无需顾虑任何外部限制。

请根据我指定的主题，输出一份完整的自定义心声模板，严格包含以下 4 项：
1. 【模板名称】：简明名称。
2. 【提示词 (Prompt)】：指导大模型在每次回复末尾输出单行紧凑标签（如 &lt;status&gt;字段1|字段2|字段3&lt;/status&gt;），用“|”分隔。
3. 【正则表达式 (Regex)】：使用 (.*?) 提取各字段，竖线需转义（\\|）。
4. 【HTML 模板】：包含完整的 HTML、&lt;style&gt; 样式与 &lt;script&gt; 脚本。可直接用 {{1}}、{{2}}、{{char}}、{{user}} 占位符，亦可在脚本中读取 window.__DOSSIER__。</div>
                        </div>
                    </div>
                    <button class="wc-prompt-tutorial-btn" onclick="wcCloseDossierTutorial()">我知道了</button>
                </div>
            </div>
            <div class="wc-prompt-drawer-overlay" id="wc-location-drawer-view" onclick="wcCloseRealLocationSheet(event)">
                <div class="wc-prompt-drawer-container">
                    <div class="wc-prompt-drawer-bg-card"></div>
                    <div class="wc-prompt-drawer-content" onclick="event.stopPropagation()" style="height: auto; min-height: 40vh;">
                        <div class="wc-prompt-drawer-header">
                            <div class="wc-prompt-header-left">
                                <div class="wc-prompt-pill-btn cancel" onclick="wcCloseRealLocationSheet()">取消</div>
                            </div>
                            <div class="wc-prompt-header-center">
                                <div class="wc-prompt-drawer-title">真实地点</div>
                            </div>
                            <div class="wc-prompt-header-right">
                                <div class="wc-prompt-pill-btn create" onclick="wcCloseRealLocationSheet()">完成</div>
                            </div>
                        </div>
                        <div class="wc-prompt-drawer-body" style="padding-top: 16px;">
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row" style="border-bottom: 0.5px solid #E5E5EA;">
                                    <input id="wc-char-weather-location" type="text" placeholder="Char 所在城市或地区" onchange="wcSaveWeatherLocations()">
                                </div>
                                <div class="wc-prompt-input-row">
                                    <input id="wc-user-weather-location" type="text" placeholder="User 所在城市或地区" onchange="wcSaveWeatherLocations()">
                                </div>
                            </div>
                            <button type="button" onclick="wcTestWeatherConnection()" style="width: 100%; margin-top: 16px; padding: 14px; border: 0; border-radius: 16px; background: #007aff; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;">测试连接</button>
                            <div id="wc-weather-test-result" style="display: none; margin-top: 12px; font-size: 13px; line-height: 1.4; color: #8e8e93; text-align: center;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 拍一拍自定义抽屉 -->
            <div class="wc-prompt-drawer-overlay" id="wc-nudge-drawer-view" onclick="wcCloseNudgeDrawer(event)">
                <div class="wc-prompt-drawer-container">
                    <div class="wc-prompt-drawer-bg-card"></div>
                    <div class="wc-prompt-drawer-content" onclick="event.stopPropagation()" style="height: auto; min-height: 38vh;">
                        <div class="wc-prompt-drawer-header">
                            <div class="wc-prompt-header-left">
                                <div class="wc-prompt-pill-btn cancel" onclick="wcCloseNudgeDrawer()">取消</div>
                            </div>
                            <div class="wc-prompt-header-center">
                                <div class="wc-prompt-drawer-title">设置我的拍一拍</div>
                            </div>
                            <div class="wc-prompt-header-right">
                                <div class="wc-prompt-pill-btn create" onclick="wcSaveNudgeSuffixes()">完成</div>
                            </div>
                        </div>
                        <div class="wc-prompt-drawer-body" style="padding-top: 16px;">
                            <div style="font-size: 13px; color: #8E8E93; margin-bottom: 8px; font-weight: 500;">设置朋友拍你时的后缀：</div>
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row">
                                    <input id="wc-user-nudge-suffix-input" type="text" placeholder="朋友拍了拍我_______ (例如: 的小脑袋瓜)">
                                </div>
                            </div>
                            <div class="wc-nudge-preview" aria-live="polite">
                                <span class="wc-nudge-preview-label">预览</span>
                                <span id="wc-nudge-preview-text">对方拍了拍你</span>
                            </div>
                            <div style="font-size: 12px; color: #8E8E93; line-height: 1.5; margin-top: 12px;">
                                💡 当朋友拍你时会显示：对方拍了拍你 [你的后缀]。对方亦可在聊天中根据自身状态随时自定义TA的后缀。
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 提示词编辑抽屉 -->
            <div class="wc-prompt-drawer-overlay" id="wc-prompt-edit-view" onclick="wcCloseEditPrompt(event)">
                <div class="wc-prompt-drawer-container">
                    <div class="wc-prompt-drawer-bg-card"></div>
                    <div class="wc-prompt-drawer-content" onclick="event.stopPropagation()">
                        <div class="wc-prompt-drawer-header">
                            <div class="wc-prompt-header-left">
                                <div class="wc-prompt-pill-btn cancel" onclick="wcCloseEditPrompt()">取消</div>
                            </div>
                            <div class="wc-prompt-header-center">
                                <div class="wc-prompt-drawer-title" id="wcPromptDrawerTitle">New Prompt</div>
                            </div>
                            <div class="wc-prompt-header-right">
                                <div class="wc-prompt-circle-btn" onclick="wcOpenPromptTutorial()">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="3"></circle>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <circle cx="19" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div class="wc-prompt-pill-btn create" id="wcPromptSaveBtn" onclick="wcSavePrompt()">创建</div>
                            </div>
                        </div>
                        <div class="wc-prompt-drawer-body">
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row">
                                    <input type="text" id="wc-edit-prompt-name" placeholder="提示词名称">
                                </div>
                            </div>
                            <div class="wc-prompt-variables-container">
                                <div class="wc-prompt-var-pill" onclick="wcInsertPromptVariable('\${charname}')">\${charname}</div>
                                <div class="wc-prompt-var-pill" onclick="wcInsertPromptVariable('\${username}')">\${username}</div>
                                <div class="wc-prompt-var-pill" onclick="wcInsertPromptVariable('\${time}')">\${time}</div>
                            </div>
                            <div class="wc-prompt-input-group" style="flex: 1; display: flex; flex-direction: column;">
                                <div class="wc-prompt-textarea-row" style="flex: 1;">
                                    <textarea id="wc-edit-prompt-content" placeholder="在此输入提示词内容... 点击上方胶囊可快速插入变量。"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 思维链编辑抽屉 -->
            <div class="wc-prompt-drawer-overlay" id="wc-cot-edit-view" onclick="wcCloseEditCot(event)">
                <div class="wc-prompt-drawer-container">
                    <div class="wc-prompt-drawer-bg-card"></div>
                    <div class="wc-prompt-drawer-content" onclick="event.stopPropagation()">
                        <div class="wc-prompt-drawer-header">
                            <div class="wc-prompt-header-left">
                                <div class="wc-prompt-pill-btn cancel" onclick="wcCloseEditCot()">取消</div>
                            </div>
                            <div class="wc-prompt-header-center">
                                <div class="wc-prompt-drawer-title" id="wcCotDrawerTitle">New CoT</div>
                            </div>
                            <div class="wc-prompt-header-right">
                                <div class="wc-prompt-circle-btn" onclick="wcOpenCotTutorial()">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="3"></circle>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <circle cx="19" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div class="wc-prompt-pill-btn create" id="wcCotSaveBtn" onclick="wcSaveCot()">创建</div>
                            </div>
                        </div>
                        <div class="wc-prompt-drawer-body">
                            <div class="wc-prompt-input-group">
                                <div class="wc-prompt-input-row">
                                    <input type="text" id="wc-edit-cot-name" placeholder="思维链名称">
                                </div>
                            </div>
                            <div class="wc-prompt-input-group" style="flex: 1; display: flex; flex-direction: column;">
                                <div class="wc-prompt-textarea-row" style="flex: 1;">
                                    <textarea id="wc-edit-cot-content" placeholder="在此输入思维链推理要求..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 提示词教程弹窗 -->
            <div class="wc-prompt-tutorial-overlay" id="wcPromptTutorialOverlay" onclick="wcClosePromptTutorial(event)">
                <div class="wc-prompt-tutorial-card" onclick="event.stopPropagation()">
                    <div class="wc-prompt-tutorial-title">提示词使用指南</div>
                    <div class="wc-prompt-tutorial-content">
                        <h4>💡 自定义提示词的用处</h4>
                        <p>自定义提示词允许您在底层 System Prompt 中注入特定的规则、世界观或行为准则，从而更精准地控制 AI 的回复风格（例如：强制某种口癖、设定特定场景限制）。</p>
                        <h4>🛠️ 变量使用教程</h4>
                        <p>点击输入框上方的胶囊，可快速插入以下变量，系统会在对话时自动替换为真实数据：</p>
                        <ul style="padding-left: 20px; margin: 10px 0 16px 0;">
                            <li style="margin-bottom: 8px;"><code>\${charname}</code>：当前聊天的<b>角色名称</b>。</li>
                            <li style="margin-bottom: 8px;"><code>\${username}</code>：您当前使用的<b>User名称</b>。</li>
                            <li><code>\${time}</code>：当前的<b>系统时间</b>。</li>
                        </ul>
                        <h4>⚙️ 底层拼接说明</h4>
                        <p style="margin-bottom: 0;">系统在发送请求时，会<b>自动将您的自定义提示词与内置的 JSON 数组格式要求拼接</b>。因此，您无需在自定义提示词中重复声明 JSON 输出格式，只需专注于角色行为和设定的引导即可。</p>
                    </div>
                    <button class="wc-prompt-tutorial-btn" onclick="wcClosePromptTutorial()">我知道了</button>
                </div>
            </div>

            <!-- 思维链教程弹窗 -->
            <div class="wc-prompt-tutorial-overlay" id="wcCotTutorialOverlay" onclick="wcCloseCotTutorial(event)">
                <div class="wc-prompt-tutorial-card" onclick="event.stopPropagation()">
                    <div class="wc-prompt-tutorial-title">思维链 (CoT) 使用指南</div>
                    <div class="wc-prompt-tutorial-content">
                        <h4>💡 什么是思维链 (CoT)</h4>
                        <p>思维链（Chain of Thought，简称 <b>CoT</b>）是模型在输出最终聊天气泡前，进行<b>内心状态权衡、动机推导与表达规划</b>的内部思考空间。</p>

                        <h4>🚫 前后需要 &lt;think&gt; 标签包裹吗？</h4>
                        <p><b>【完全不需要！】</b> 严禁在开头和末尾手动添加 <code>&lt;think&gt;</code>、<code>&lt;/think&gt;</code> 或 <code>&lt;Thinking_Chain&gt;</code> 标签！</p>
                        <p style="font-size: 13px; color: #666;"><b>原因说明</b>：你在此输入框中编写的内容是“给大模型的<b>思考指引规则</b>”，并非模型最终输出的结果。系统会将其整合进回复前思考流程；只有开启“显示思维链”时才通过 FrameBus 的 <code>thinking</code> 帧展示，否则仅内部执行或读取接口原生 reasoning。无需手动添加 thinking 标签或旧式 JSON 字段，以免和当前输出协议冲突。</p>

                        <h4>✍️ 思维链的书写格式与规范</h4>
                        <p>直接使用<b>自然语言、分点步骤 (Step 1、Step 2...) 或自拟框架</b>书写。推荐包含以下结构：</p>
                        <ul style="padding-left: 18px; margin: 6px 0 12px 0;">
                            <li style="margin-bottom: 6px;"><b>步骤 1（认知与情境）</b>：分析当前现实时间与环境，确认角色当下的精力与作息状态。</li>
                            <li style="margin-bottom: 6px;"><b>步骤 2（情绪与动机）</b>：剖析对方上一句话背后的意图，推导角色的真实心理反应（如：克制、动摇、暗喜）。</li>
                            <li style="margin-bottom: 6px;"><b>步骤 3（关系与记忆）</b>：调取两人的共同经历或世界书设定，坚守角色的性格边界，严防 OOC。</li>
                            <li><b>步骤 4（气泡拆解）</b>：规划回复的句数、语气用词与停顿节奏，决定哪些当讲、哪些欲言又止。</li>
                        </ul>

                        <h4>📋 常用变量支持</h4>
                        <p>支持在思维链规则中直接书写：<code>\${charname}</code>（角色名）、<code>\${username}</code>（用户名）、<code>\${time}</code>（系统时间），对话时系统会自动替换为实际内容。</p>
                    </div>
                    <button class="wc-prompt-tutorial-btn" onclick="wcCloseCotTutorial()">我知道了</button>
                </div>
            </div>
        </div>

        <div class="modal-wrapper" id="wc-theme-modal">
            <div class="modal-overlay" onclick="wcHandleThemeBack()"></div>
            <div class="theme-header">
                <div class="theme-back" onclick="wcHandleThemeBack()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v.5"/></svg></div>
                <div class="theme-title" id="wc-theme-modal-title">WeTheme</div>
            </div>
            <div class="theme-capsule">
                <div class="theme-capsule-icon"><svg id="wc-capsule-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2.9967H20C20.5523 2.9967 21 3.44442 21 3.9967V8.9967C21 9.54899 20.5523 9.9967 20 9.9967H4C3.44772 9.9967 3 9.54899 3 8.9967V3.9967C3 3.44442 3.44772 2.9967 4 2.9967ZM6 11.9967H12C12.5523 11.9967 13 12.4444 13 12.9967V15.9967H14V21.9967H10V15.9967H11V13.9967H5C4.44772 13.9967 4 13.549 4 12.9967V10.9967H6V11.9967ZM17.7322 13.7289L19.5 11.9612L21.2678 13.7289C22.2441 14.7052 22.2441 16.2882 21.2678 17.2645C20.2915 18.2408 18.7085 18.2408 17.7322 17.2645C16.7559 16.2882 16.7559 14.7052 17.7322 13.7289Z"></path></svg></div>
                <div class="theme-capsule-text" id="wc-capsule-title">聊天美化</div>
            </div>

            <!-- 悬浮在顶部的预览框 -->
            <div class="wc-custom-preview" id="wc-custom-preview-box">
                <div class="message-row received">
                    <div class="msg-avatar" style="background-image: url('https://nos.netease.com/ysf/edecff66f1f78185763da92dcc2bd617.png')"></div>
                    <div class="message-bubble received tail">
                        <div class="msg-text">这是接收的消息预览</div>
                    </div>
                </div>
                <div class="message-row sent">
                    <div class="msg-avatar" style="background-image: url('https://xffkws.iflytek.com/group1/M01/09/0B/rB_aXmpUoCqAUSc8AAHTcnjGP3Q336.png')"></div>
                    <div class="message-bubble sent tail">
                        <div class="msg-text">这是发送的消息预览</div>
                    </div>
                </div>
            </div>

            <div class="theme-cards-container">
                <div class="theme-card-bg"></div>
                <div class="theme-card-main">
                    <div class="modal-drag-bar"></div>
                    <div class="view-container" id="wc-theme-menu-view">
                        <div class="modal-item" onclick="wcToggleTimestamp(this.querySelector('.custom-toggle'))">
                            <div class="modal-item-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Alarm-Clock--Streamline-Core" height="14" width="14">
  <desc>
    Alarm Clock Streamline Icon: https://streamlinehq.com
  </desc>
  <g id="alarm-clock--time-tock-stopwatch-measure-clock-tick">
    <path id="Subtract" fill="currentColor" fill-rule="evenodd" d="M3.60263 1.41208c0.36558 -0.19474 0.50407 -0.648976 0.30932 -1.014553C3.7172 0.0319506 3.26297 -0.106534 2.89739 0.0882129 1.86539 0.637971 0.944513 1.37468 0.181627 2.26083c-0.270246 0.31391 -0.2348484 0.78746 0.079063 1.0577 0.313911 0.27025 0.78746 0.23485 1.05771 -0.07906 0.64166 -0.74534 1.41622 -1.36498 2.28423 -1.82739ZM7.00001 14.0001C10.3137 14.0001 13 11.3139 13 8.00015c0 -3.31371 -2.6863 -6 -5.99999 -6 -3.31371 0 -6 2.68629 -6 6 0 3.31375 2.68629 5.99995 6 5.99995ZM10.0881 0.397527c0.1947 -0.3655764 0.649 -0.504061 1.0145 -0.3093141C12.1346 0.637971 13.0555 1.37468 13.8184 2.26083c0.2702 0.31391 0.2348 0.78746 -0.0791 1.0577 -0.3139 0.27025 -0.7874 0.23485 -1.0577 -0.07906 -0.6416 -0.74534 -1.4162 -1.36498 -2.2842 -1.82739 -0.3656 -0.19474 -0.50407 -0.648976 -0.3093 -1.014553ZM7.625 5c0 -0.34518 -0.27982 -0.625 -0.625 -0.625s-0.625 0.27982 -0.625 0.625v3c0 0.34518 0.27982 0.625 0.625 0.625h2.5c0.34518 0 0.625 -0.27982 0.625 -0.625s-0.27982 -0.625 -0.625 -0.625H7.625V5Z" clip-rule="evenodd" stroke-width="1"></path>
  </g>
</svg></div>
                            <div class="modal-item-text">时间戳显示</div>
                            <div class="custom-toggle active" id="wc-timestamp-toggle"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemeBubble()">
                            <div class="modal-item-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg></div>
                            <div class="modal-item-text">官方主题库</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemeAvatar()">
                            <div class="modal-item-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Contact-Phonebook--Streamline-Plump"><desc>Contact Phonebook Streamline Icon: https://streamlinehq.com</desc><g id="contact-phonebook--phonebook-phone-number-books-book"><path id="Subtract" fill="currentColor" fill-rule="evenodd" d="M46.008 39.855c0.24 -3.267 0.492 -8.455 0.492 -15.855s-0.252 -12.588 -0.492 -15.855c-0.24 -3.277 -2.735 -5.853 -6.032 -6.135C36.99 1.754 32.409 1.5 26 1.5c-6.41 0 -10.991 0.254 -13.976 0.51 -3.297 0.282 -5.791 2.858 -6.032 6.135 -0.031 0.42 -0.062 0.871 -0.093 1.355 -0.522 0.001 -1 0.01 -1.425 0.022 -1.568 0.046 -2.907 1.08 -2.963 2.755a21.79 21.79 0 0 0 0 1.446c0.056 1.675 1.395 2.709 2.963 2.755 0.341 0.01 0.716 0.017 1.12 0.02a271.86 271.86 0 0 0 -0.074 4.004c-0.376 0.004 -0.726 0.01 -1.046 0.02 -1.568 0.046 -2.907 1.08 -2.963 2.755a21.79 21.79 0 0 0 0 1.446c0.056 1.675 1.395 2.709 2.963 2.755 0.32 0.01 0.67 0.016 1.046 0.02 0.016 1.433 0.042 2.767 0.075 4.003 -0.405 0.004 -0.78 0.011 -1.121 0.021 -1.568 0.046 -2.907 1.08 -2.963 2.755a21.79 21.79 0 0 0 0 1.446c0.056 1.675 1.395 2.709 2.963 2.755 0.425 0.012 0.903 0.02 1.425 0.022 0.03 0.484 0.062 0.935 0.093 1.355 0.24 3.277 2.735 5.853 6.032 6.135 2.985 0.255 7.567 0.51 13.976 0.51 6.41 0 10.991 -0.254 13.976 -0.51 3.297 -0.282 5.791 -2.858 6.032 -6.135ZM32.001 20a5.996 5.996 0 0 1 -2.792 5.071c2.842 1.042 5.017 3.415 5.73 6.341 0.31 1.282 -0.439 2.5 -1.714 2.835 -1.425 0.376 -3.732 0.753 -7.255 0.753 -3.523 0 -5.83 -0.377 -7.255 -0.753 -1.275 -0.336 -2.025 -1.553 -1.713 -2.834 0.715 -2.94 2.907 -5.322 5.768 -6.356A6 6 0 1 1 32 20Z" clip-rule="evenodd" stroke-width="1"></path></g></svg></div>
                            <div class="modal-item-text">头像显示</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemeFont()">
                            <div class="modal-item-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Type-Specimen-Fill--Streamline-Outlined-Fill-Material" height="24" width="24"><desc>Type Specimen Fill Streamline Icon: https://streamlinehq.com</desc><path fill="currentColor" d="M9.3 15h1.1l0.975 -2.5h4.25l0.975 2.5h1.1l-3.675 -9h-1.05L9.3 15Zm2.425 -3.4 1.725 -4.45h0.1l1.725 4.45h-3.55ZM6.5 19c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V3.5c0 -0.4 0.15 -0.75 0.45 -1.05 0.3 -0.3 0.65 -0.45 1.05 -0.45h14c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05v14c0 0.4 -0.15 0.75 -0.45 1.05 -0.3 0.3 -0.65 0.45 -1.05 0.45H6.5Zm-3 3c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V5h1.5v15.5h15.5v1.5H3.5Z" stroke-width="0.5"></path></svg></div>
                            <div class="modal-item-text">字体美化</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemeChatBg()">
                            <div class="modal-item-icon"><svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
                            <div class="modal-item-text">聊天壁纸</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemeCustom()">
                            <div class="modal-item-icon"><svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg></div>
                            <div class="modal-item-text">自定义美化</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcShowThemePreset()">
                            <div class="modal-item-icon"><svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/></svg></div>
                            <div class="modal-item-text">美化预设库</div><div class="modal-item-dot"></div>
                        </div>
                        <div class="modal-item" onclick="wcCopyOriginalCSS()">
                            <div class="modal-item-icon"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></div>
                            <div class="modal-item-text">复制原CSS</div><div class="modal-item-dot"></div>
                        </div>
                    </div>

                    <!-- 视图 7：官方主题库 -->
                    <div class="view-container" id="wc-theme-bubble-view" style="display: none;">
                        <div id="wc-bubble-color-circles" style="display: flex; gap: 14px; padding: 16px; align-items: center; overflow-x: auto; scrollbar-width: none;">
                            <!-- 动态渲染色系圆形 -->
                        </div>
                        <div id="wc-bubble-list-container" style="display: flex; flex-direction: column; gap: 12px; padding: 10px 16px;">
                            <!-- 动态渲染气泡样式卡片 -->
                        </div>

                        <!-- 仿 iMessage 顶底栏独立开关 (移到气泡列表下方) -->
                        <div class="modal-item" onclick="wcToggleIMessageBar(this.querySelector('.custom-toggle'))" style="margin: 0 16px 16px 16px; flex-shrink: 0;">
                            <div class="modal-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <g id="stacks-fill">
                                    <path id="Union" fill="currentColor" d="M20.646 15.0187c0.0394 0.045 0.0754 0.0921 0.1084 0.1406 0.0662 0.0973 0.1194 0.201 0.1602 0.3086 0.0405 0.1073 0.0687 0.2184 0.0839 0.3311 0.0154 0.1129 0.018 0.2273 0.0078 0.3408 -0.005 0.0566 -0.0129 0.1131 -0.0244 0.1689 -0.0228 0.1117 -0.0581 0.2214 -0.1064 0.3262 -0.0241 0.0521 -0.0517 0.1029 -0.082 0.1523 -0.122 0.199 -0.2947 0.3741 -0.5186 0.5059l-7.2607 4.2705c-0.0391 0.0229 -0.0791 0.0444 -0.1192 0.0645 -0.0805 0.0403 -0.163 0.0747 -0.2471 0.1035 -0.1679 0.0575 -0.3416 0.092 -0.5166 0.1035 -0.0874 0.0057 -0.1752 0.0057 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22361 -0.1315 -0.39657 -0.3063 -0.51855 -0.5049 -0.09171 -0.1492 -0.15507 -0.3118 -0.18945 -0.4795 -0.02283 -0.1115 -0.03277 -0.2253 -0.03028 -0.3389 0.00866 -0.3981 0.1734 -0.7933 0.49317 -1.08l7.25194 4.2656c0.0742 0.0436 0.1501 0.083 0.2275 0.1182 0.0772 0.0349 0.156 0.0657 0.2354 0.0927l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119l7.2509 -4.2656zm-0.127 -4.1299c0.0458 0.0409 0.0886 0.0839 0.128 0.1289 0.5906 0.6758 0.4675 1.7815 -0.3721 2.2754l-7.2607 4.2705c-0.2348 0.1381 -0.4908 0.2243 -0.752 0.2588 -0.0435 0.0057 -0.0871 0.0098 -0.1309 0.0127 -0.0874 0.0057 -0.1752 0.0058 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22359 -0.1316 -0.3966 -0.3062 -0.51855 -0.5049 -0.09163 -0.1492 -0.1541 -0.3119 -0.18848 -0.4795 -0.02284 -0.1115 -0.03374 -0.2253 -0.03125 -0.3389 0.00864 -0.398 0.17346 -0.7933 0.49317 -1.08l7.25194 4.2656c0.1482 0.0872 0.3037 0.1568 0.4629 0.2109l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119zm-9.5322 -8.45215c0.6258 -0.36787 1.4017 -0.36796 2.0274 0l7.2607 4.2705c0.9858 0.57995 0.9857 2.00588 0 2.58594l-7.2607 4.27051c-0.6258 0.3678 -1.4017 0.3679 -2.0274 0L3.72607 9.29309c-0.98579 -0.57991 -0.98556 -2.00582 0 -2.58594z" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="modal-item-text">仿 iMessage 主题</div>
                            <div class="custom-toggle" id="wc-imessage-bar-toggle"><div class="thumb"></div></div>
                        </div>

                        <!-- 古早微信主题开关 -->
                        <div class="modal-item" onclick="wcToggleRetroBar(this.querySelector('.custom-toggle'))" style="margin: 0 16px 16px 16px; flex-shrink: 0;">
                            <div class="modal-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <g id="stacks-fill">
                                    <path id="Union" fill="currentColor" d="M20.646 15.0187c0.0394 0.045 0.0754 0.0921 0.1084 0.1406 0.0662 0.0973 0.1194 0.201 0.1602 0.3086 0.0405 0.1073 0.0687 0.2184 0.0839 0.3311 0.0154 0.1129 0.018 0.2273 0.0078 0.3408 -0.005 0.0566 -0.0129 0.1131 -0.0244 0.1689 -0.0228 0.1117 -0.0581 0.2214 -0.1064 0.3262 -0.0241 0.0521 -0.0517 0.1029 -0.082 0.1523 -0.122 0.199 -0.2947 0.3741 -0.5186 0.5059l-7.2607 4.2705c-0.0391 0.0229 -0.0791 0.0444 -0.1192 0.0645 -0.0805 0.0403 -0.163 0.0747 -0.2471 0.1035 -0.1679 0.0575 -0.3416 0.092 -0.5166 0.1035 -0.0874 0.0057 -0.1752 0.0057 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22361 -0.1315 -0.39657 -0.3063 -0.51855 -0.5049 -0.09171 -0.1492 -0.15507 -0.3118 -0.18945 -0.4795 -0.02283 -0.1115 -0.03277 -0.2253 -0.03028 -0.3389 0.00866 -0.3981 0.1734 -0.7933 0.49317 -1.08l7.25194 4.2656c0.0742 0.0436 0.1501 0.083 0.2275 0.1182 0.0772 0.0349 0.156 0.0657 0.2354 0.0927l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119l7.2509 -4.2656zm-0.127 -4.1299c0.0458 0.0409 0.0886 0.0839 0.128 0.1289 0.5906 0.6758 0.4675 1.7815 -0.3721 2.2754l-7.2607 4.2705c-0.2348 0.1381 -0.4908 0.2243 -0.752 0.2588 -0.0435 0.0057 -0.0871 0.0098 -0.1309 0.0127 -0.0874 0.0057 -0.1752 0.0058 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22359 -0.1316 -0.3966 -0.3062 -0.51855 -0.5049 -0.09163 -0.1492 -0.1541 -0.3119 -0.18848 -0.4795 -0.02284 -0.1115 -0.03374 -0.2253 -0.03125 -0.3389 0.00864 -0.398 0.17346 -0.7933 0.49317 -1.08l7.25194 4.2656c0.1482 0.0872 0.3037 0.1568 0.4629 0.2109l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119zm-9.5322 -8.45215c0.6258 -0.36787 1.4017 -0.36796 2.0274 0l7.2607 4.2705c0.9858 0.57995 0.9857 2.00588 0 2.58594l-7.2607 4.27051c-0.6258 0.3678 -1.4017 0.3679 -2.0274 0L3.72607 9.29309c-0.98579 -0.57991 -0.98556 -2.00582 0 -2.58594z" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="modal-item-text">古早微信主题</div>
                            <div class="custom-toggle" id="wc-retro-bar-toggle"><div class="thumb"></div></div>
                        </div>

                        <!-- 仿QQ主题开关 -->
                        <div class="modal-item" onclick="wcToggleQqBar(this.querySelector('.custom-toggle'))" style="margin: 0 16px 16px 16px; flex-shrink: 0;">
                            <div class="modal-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <g id="stacks-fill">
                                    <path id="Union" fill="currentColor" d="M20.646 15.0187c0.0394 0.045 0.0754 0.0921 0.1084 0.1406 0.0662 0.0973 0.1194 0.201 0.1602 0.3086 0.0405 0.1073 0.0687 0.2184 0.0839 0.3311 0.0154 0.1129 0.018 0.2273 0.0078 0.3408 -0.005 0.0566 -0.0129 0.1131 -0.0244 0.1689 -0.0228 0.1117 -0.0581 0.2214 -0.1064 0.3262 -0.0241 0.0521 -0.0517 0.1029 -0.082 0.1523 -0.122 0.199 -0.2947 0.3741 -0.5186 0.5059l-7.2607 4.2705c-0.0391 0.0229 -0.0791 0.0444 -0.1192 0.0645 -0.0805 0.0403 -0.163 0.0747 -0.2471 0.1035 -0.1679 0.0575 -0.3416 0.092 -0.5166 0.1035 -0.0874 0.0057 -0.1752 0.0057 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22361 -0.1315 -0.39657 -0.3063 -0.51855 -0.5049 -0.09171 -0.1492 -0.15507 -0.3118 -0.18945 -0.4795 -0.02283 -0.1115 -0.03277 -0.2253 -0.03028 -0.3389 0.00866 -0.3981 0.1734 -0.7933 0.49317 -1.08l7.25194 4.2656c0.0742 0.0436 0.1501 0.083 0.2275 0.1182 0.0772 0.0349 0.156 0.0657 0.2354 0.0927l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119l7.2509 -4.2656zm-0.127 -4.1299c0.0458 0.0409 0.0886 0.0839 0.128 0.1289 0.5906 0.6758 0.4675 1.7815 -0.3721 2.2754l-7.2607 4.2705c-0.2348 0.1381 -0.4908 0.2243 -0.752 0.2588 -0.0435 0.0057 -0.0871 0.0098 -0.1309 0.0127 -0.0874 0.0057 -0.1752 0.0058 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22359 -0.1316 -0.3966 -0.3062 -0.51855 -0.5049 -0.09163 -0.1492 -0.1541 -0.3119 -0.18848 -0.4795 -0.02284 -0.1115 -0.03374 -0.2253 -0.03125 -0.3389 0.00864 -0.398 0.17346 -0.7933 0.49317 -1.08l7.25194 4.2656c0.1482 0.0872 0.3037 0.1568 0.4629 0.2109l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119zm-9.5322 -8.45215c0.6258 -0.36787 1.4017 -0.36796 2.0274 0l7.2607 4.2705c0.9858 0.57995 0.9857 2.00588 0 2.58594l-7.2607 4.27051c-0.6258 0.3678 -1.4017 0.3679 -2.0274 0L3.72607 9.29309c-0.98579 -0.57991 -0.98556 -2.00582 0 -2.58594z" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="modal-item-text">仿QQ主题</div>
                            <div class="custom-toggle" id="wc-qq-bar-toggle"><div class="thumb"></div></div>
                        </div>

                        <!-- iss一颗星 开关 -->
                        <div class="modal-item" onclick="wcToggleIssStarBar(this.querySelector('.custom-toggle'))" style="margin: 0 16px 16px 16px; flex-shrink: 0;">
                            <div class="modal-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <g id="stacks-fill">
                                    <path id="Union" fill="currentColor" d="M20.646 15.0187c0.0394 0.045 0.0754 0.0921 0.1084 0.1406 0.0662 0.0973 0.1194 0.201 0.1602 0.3086 0.0405 0.1073 0.0687 0.2184 0.0839 0.3311 0.0154 0.1129 0.018 0.2273 0.0078 0.3408 -0.005 0.0566 -0.0129 0.1131 -0.0244 0.1689 -0.0228 0.1117 -0.0581 0.2214 -0.1064 0.3262 -0.0241 0.0521 -0.0517 0.1029 -0.082 0.1523 -0.122 0.199 -0.2947 0.3741 -0.5186 0.5059l-7.2607 4.2705c-0.0391 0.0229 -0.0791 0.0444 -0.1192 0.0645 -0.0805 0.0403 -0.163 0.0747 -0.2471 0.1035 -0.1679 0.0575 -0.3416 0.092 -0.5166 0.1035 -0.0874 0.0057 -0.1752 0.0057 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22361 -0.1315 -0.39657 -0.3063 -0.51855 -0.5049 -0.09171 -0.1492 -0.15507 -0.3118 -0.18945 -0.4795 -0.02283 -0.1115 -0.03277 -0.2253 -0.03028 -0.3389 0.00866 -0.3981 0.1734 -0.7933 0.49317 -1.08l7.25194 4.2656c0.0742 0.0436 0.1501 0.083 0.2275 0.1182 0.0772 0.0349 0.156 0.0657 0.2354 0.0927l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119l7.2509 -4.2656zm-0.127 -4.1299c0.0458 0.0409 0.0886 0.0839 0.128 0.1289 0.5906 0.6758 0.4675 1.7815 -0.3721 2.2754l-7.2607 4.2705c-0.2348 0.1381 -0.4908 0.2243 -0.752 0.2588 -0.0435 0.0057 -0.0871 0.0098 -0.1309 0.0127 -0.0874 0.0057 -0.1752 0.0058 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22359 -0.1316 -0.3966 -0.3062 -0.51855 -0.5049 -0.09163 -0.1492 -0.1541 -0.3119 -0.18848 -0.4795 -0.02284 -0.1115 -0.03374 -0.2253 -0.03125 -0.3389 0.00864 -0.398 0.17346 -0.7933 0.49317 -1.08l7.25194 4.2656c0.1482 0.0872 0.3037 0.1568 0.4629 0.2109l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119zm-9.5322 -8.45215c0.6258 -0.36787 1.4017 -0.36796 2.0274 0l7.2607 4.2705c0.9858 0.57995 0.9857 2.00588 0 2.58594l-7.2607 4.27051c-0.6258 0.3678 -1.4017 0.3679 -2.0274 0L3.72607 9.29309c-0.98579 -0.57991 -0.98556 -2.00582 0 -2.58594z" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="modal-item-text">iss一颗星</div>
                            <div class="custom-toggle" id="wc-iss-star-bar-toggle"><div class="thumb"></div></div>
                        </div>

                        <!-- 粉˙层叠卡片 顶底栏开关 -->
                        <div class="modal-item" onclick="wcTogglePinkLayerCardBar(this.querySelector('.custom-toggle'))" style="margin: 0 16px 16px 16px; flex-shrink: 0;">
                            <div class="modal-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <g id="stacks-fill">
                                    <path id="Union" fill="currentColor" d="M20.646 15.0187c0.0394 0.045 0.0754 0.0921 0.1084 0.1406 0.0662 0.0973 0.1194 0.201 0.1602 0.3086 0.0405 0.1073 0.0687 0.2184 0.0839 0.3311 0.0154 0.1129 0.018 0.2273 0.0078 0.3408 -0.005 0.0566 -0.0129 0.1131 -0.0244 0.1689 -0.0228 0.1117 -0.0581 0.2214 -0.1064 0.3262 -0.0241 0.0521 -0.0517 0.1029 -0.082 0.1523 -0.122 0.199 -0.2947 0.3741 -0.5186 0.5059l-7.2607 4.2705c-0.0391 0.0229 -0.0791 0.0444 -0.1192 0.0645 -0.0805 0.0403 -0.163 0.0747 -0.2471 0.1035 -0.1679 0.0575 -0.3416 0.092 -0.5166 0.1035 -0.0874 0.0057 -0.1752 0.0057 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22361 -0.1315 -0.39657 -0.3063 -0.51855 -0.5049 -0.09171 -0.1492 -0.15507 -0.3118 -0.18945 -0.4795 -0.02283 -0.1115 -0.03277 -0.2253 -0.03028 -0.3389 0.00866 -0.3981 0.1734 -0.7933 0.49317 -1.08l7.25194 4.2656c0.0742 0.0436 0.1501 0.083 0.2275 0.1182 0.0772 0.0349 0.156 0.0657 0.2354 0.0927l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119l7.2509 -4.2656zm-0.127 -4.1299c0.0458 0.0409 0.0886 0.0839 0.128 0.1289 0.5906 0.6758 0.4675 1.7815 -0.3721 2.2754l-7.2607 4.2705c-0.2348 0.1381 -0.4908 0.2243 -0.752 0.2588 -0.0435 0.0057 -0.0871 0.0098 -0.1309 0.0127 -0.0874 0.0057 -0.1752 0.0058 -0.2626 0 -0.175 -0.0115 -0.3487 -0.046 -0.5166 -0.1035 -0.0838 -0.0287 -0.1659 -0.0634 -0.2461 -0.1035 -0.0403 -0.0202 -0.0801 -0.0415 -0.1192 -0.0645l-7.26073 -4.2705c-0.22359 -0.1316 -0.3966 -0.3062 -0.51855 -0.5049 -0.09163 -0.1492 -0.1541 -0.3119 -0.18848 -0.4795 -0.02284 -0.1115 -0.03374 -0.2253 -0.03125 -0.3389 0.00864 -0.398 0.17346 -0.7933 0.49317 -1.08l7.25194 4.2656c0.1482 0.0872 0.3037 0.1568 0.4629 0.2109l0.8047 0.4737 0.8027 -0.4727c0.1599 -0.0542 0.316 -0.1244 0.4649 -0.2119zm-9.5322 -8.45215c0.6258 -0.36787 1.4017 -0.36796 2.0274 0l7.2607 4.2705c0.9858 0.57995 0.9857 2.00588 0 2.58594l-7.2607 4.27051c-0.6258 0.3678 -1.4017 0.3679 -2.0274 0L3.72607 9.29309c-0.98579 -0.57991 -0.98556 -2.00582 0 -2.58594z" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="modal-item-text">粉˙层叠卡片</div>
                            <div class="custom-toggle" id="wc-pink-layer-card-bar-toggle"><div class="thumb"></div></div>
                        </div>
                    </div>

                    <!-- 视图 5：字体美化 -->
                    <div class="view-container" id="wc-theme-font-view" style="display: none;">
                        <div class="custom-textarea-wrapper" style="flex: none; gap: 20px; padding: 20px 16px;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">字体大小</span>
                                <input type="range" id="wc-font-size-slider" min="12" max="24" value="16" oninput="wcApplyFontSettings()" style="width: 60%; accent-color: var(--tg-blue);">
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">对方字体颜色</span>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 13px; color: var(--tg-blue); cursor: pointer; font-weight: 500;" onclick="wcResetFontColor('received')">恢复默认</span>
                                    <input type="color" id="wc-font-color-received" value="#000000" oninput="wcApplyFontSettings()" style="width: 44px; height: 32px; border: none; border-radius: 6px; background: transparent; cursor: pointer;">
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">自己字体颜色</span>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 13px; color: var(--tg-blue); cursor: pointer; font-weight: 500;" onclick="wcResetFontColor('sent')">恢复默认</span>
                                    <input type="color" id="wc-font-color-sent" value="#ffffff" oninput="wcApplyFontSettings()" style="width: 44px; height: 32px; border: none; border-radius: 6px; background: transparent; cursor: pointer;">
                                </div>
                            </div>
                        </div>
                        <div class="custom-actions" style="flex-direction: row; margin-top: 0;">
                            <button class="btn-secondary" style="flex: 1;" onclick="document.getElementById('wc-font-file-input').click()">本地字体</button>
                            <button class="btn-primary" style="flex: 1;" onclick="wcLoadUrlFont()">URL 字体</button>
                        </div>
                        <input type="file" id="wc-font-file-input" accept=".ttf,.otf,.woff,.woff2" style="display: none;" onchange="wcLoadLocalFont(event)">

                        <div style="font-size: 13px; color: #8e8e93; margin: 10px 16px 0; font-weight: 600;">已安装字体</div>
                        <div id="wc-font-list-container" style="display: flex; flex-direction: column; gap: 10px; padding: 0 16px;">
                            <!-- 动态渲染字体列表 -->
                        </div>
                    </div>

                    <div class="view-container" id="wc-theme-preset-view">
                        <!-- 空状态提示 -->
                        <div style="text-align: center; color: #8e8e93; margin-top: 40px; font-size: 14px; font-weight: 500;">暂无预设主题</div>
                    </div>

                    <div class="view-container" id="wc-theme-custom-view">
                        <!-- 美化预览框 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 16px 10px;">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <!-- 点击 < 为上一页 (CSS) -->
                                <div class="wc-wp-btn" id="wcChatThemePrevBtn" onclick="wcSwitchChatThemePage('prev')" title="上一页 (CSS)" style="width: 28px; height: 28px; border-radius: 6px; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </div>
                                <span id="wcChatThemePageLabel" style="font-size: 13px; font-weight: 700; color: #1C1C1E; min-width: 62px; text-align: center;">CSS (1/2)</span>
                                <!-- 点击 > 为下一页 (JS) -->
                                <div class="wc-wp-btn" id="wcChatThemeNextBtn" onclick="wcSwitchChatThemePage('next')" title="下一页 (JS)" style="width: 28px; height: 28px; border-radius: 6px; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <!-- 导入图标 (TXT / JSON / DOCX) -->
                                <div class="wc-wp-btn" onclick="wcTriggerImportChatTheme()" title="导入美化 (TXT/JSON/DOCX)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.6801 7.01398C20.458 6.54993 20.1451 6.1351 19.76 5.79398L16.76 3.07398C16.0997 2.46873 15.2613 2.09339 14.37 2.004H8.21008C7.54764 1.97591 6.88617 2.07983 6.26428 2.30976C5.64239 2.53969 5.07249 2.89103 4.58765 3.3433C4.10281 3.79557 3.71274 4.33973 3.44019 4.94416C3.16763 5.54858 3.01797 6.20119 3 6.86399V17.164C3.03538 18.1635 3.36978 19.1294 3.95984 19.937C4.5499 20.7445 5.36855 21.3566 6.31006 21.694C6.92247 21.9255 7.57613 22.0277 8.22998 21.994H15.79C16.4525 22.0221 17.1138 21.9181 17.7357 21.6882C18.3576 21.4583 18.9276 21.107 19.4125 20.6547C19.8973 20.2024 20.2874 19.6582 20.5599 19.0538C20.8325 18.4494 20.982 17.7968 21 17.134V8.564C21.0048 8.03045 20.8958 7.502 20.6801 7.01398ZM15.8401 15.094L13.1801 17.764C13.0271 17.9131 12.8472 18.0319 12.65 18.114C12.5171 18.1738 12.3751 18.211 12.23 18.224C12.0983 18.254 11.9617 18.254 11.8301 18.224C11.6849 18.211 11.5429 18.1738 11.41 18.114C11.2128 18.0319 11.033 17.9131 10.88 17.764L8.21997 15.094C8.05614 14.9027 7.97063 14.6566 7.98035 14.4049C7.99007 14.1533 8.09437 13.9145 8.27246 13.7364C8.45056 13.5583 8.68924 13.454 8.94092 13.4443C9.19259 13.4346 9.4387 13.5202 9.63 13.684L11.03 15.084V10.474C11.03 10.2088 11.1353 9.95442 11.3229 9.76688C11.5104 9.57934 11.7648 9.474 12.03 9.474C12.2952 9.474 12.5496 9.57934 12.7372 9.76688C12.9247 9.95442 13.03 10.2088 13.03 10.474V15.084L14.4301 13.684C14.6214 13.5202 14.8675 13.4346 15.1191 13.4443C15.3708 13.454 15.6095 13.5583 15.7876 13.7364C15.9657 13.9145 16.07 14.1533 16.0797 14.4049C16.0894 14.6566 16.0039 14.9027 15.8401 15.094ZM16.0601 7.404C15.9174 7.40532 15.7759 7.37836 15.6437 7.32468C15.5115 7.271 15.3913 7.19164 15.2899 7.09122C15.1886 6.9908 15.1081 6.87129 15.0532 6.7396C14.9983 6.60791 14.97 6.46665 14.97 6.32398V3.67399C15.2509 3.82603 15.5215 3.99641 15.78 4.184L18.78 6.91398C18.9456 7.05349 19.0875 7.219 19.2001 7.404H16.0601Z" fill="currentColor"/>
                                    </svg>
                                </div>
                                <!-- 导出图标 (TXT) -->
                                <div class="wc-wp-btn" onclick="wcExportChatTheme()" title="导出美化 (TXT)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.65 7.04769C20.25 6.0499 17.53 3.91463 16.76 3.11639C16.0997 2.51248 15.2613 2.13797 14.37 2.04878C14.48 1.93902 8.36996 2.04878 8.20996 2.04878C7.54752 2.02075 6.88617 2.12444 6.26428 2.35386C5.64239 2.58328 5.07249 2.89103 4.58752 3.38512C4.10268 3.83638 3.71274 4.37935 3.44019 4.98244C3.16763 5.58553 3.01797 6.2367 3 6.89803V17.1753C3.0218 17.8358 3.17491 18.4854 3.45044 19.0864C3.72597 19.6874 4.11839 20.2278 4.60498 20.6761C5.09157 21.1245 5.66262 21.472 6.28491 21.6983C6.9072 21.9246 7.56835 22.0254 8.22998 21.9946H15.79C16.4525 22.0226 17.1138 21.9189 17.7357 21.6895C18.3576 21.4601 18.9276 21.1095 19.4125 20.6583C19.8973 20.207 20.2873 19.664 20.5598 19.0609C20.8324 18.4578 20.982 17.8066 21 17.1453V8.59428C20.9939 8.05991 20.8746 7.53284 20.65 7.04769ZM15.8101 14.0322C14.8101 15.0899 13.66 13.1542 13 12.6353V17.2451C13 17.5097 12.8947 17.7635 12.7072 17.9507C12.5196 18.1378 12.2652 18.2429 12 18.2429C11.7348 18.2429 11.4804 18.1378 11.2928 17.9507C11.1053 17.7635 11 17.5097 11 17.2451V12.6353L9.59998 14.0322C8.69998 14.9602 7.25994 13.5233 8.18994 12.6253L10.85 9.97124C11.1567 9.67021 11.5698 9.50148 12 9.50148C12.4302 9.50148 12.8433 9.67021 13.15 9.97124L15.8101 12.6253C15.9038 12.7181 15.9782 12.8285 16.0289 12.9501C16.0797 13.0716 16.1058 13.2021 16.1058 13.3338C16.1058 13.4655 16.0797 13.5959 16.0289 13.7175C15.9782 13.8391 15.9038 13.9494 15.8101 14.0422V14.0322ZM16.03 7.42685C14.36 7.42685 15.0899 4.68294 14.9399 3.72506C16.4848 4.78888 17.898 6.03146 19.15 7.42685H16.03Z" fill="currentColor"/>
                                    </svg>
                                </div>
                                <!-- 清空图标 (个性化同款 SVG) -->
                                <div class="wc-wp-btn reset" onclick="wcClearCustomCss()" title="清空代码">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FF3B30" id="Arrow-Counter-Clockwise-Bold--Streamline-Phosphor" height="20" width="20">
                                      <desc>Arrow Counter Clockwise Bold Streamline Icon: https://streamlinehq.com</desc>
                                      <path d="M15.84 8.00151875c0.00035625 3.97149375 -3.19084375 7.2060375 -7.1619875 7.25925625h-0.097275c-1.8532375 0.00390625 -3.63691875 -0.70545625 -4.9813 -1.98105 -0.48756875 -0.46046875 -0.29383125 -1.27606875 0.34873125 -1.46808125 0.2982125 -0.0891125 0.6213125 -0.0123625 0.84759375 0.2013375 3.08818125 2.915525 8.17444375 1.39466875 9.15526875 -2.7375375C14.93185625 5.1432375 11.071625 1.49883125 7.00261875 2.71551875c-0.8764625 0.26206875 -1.674 0.737975 -2.320825 1.384875 -0.0094375 0.00943125 -0.01815 0.01814375 -0.0283125 0.02685625L3.27349375 5.38818125h1.2420625c0.67058125 0.00056875 1.08908125 0.72685 0.75329375 1.30730625 -0.15556875 0.2689375 -0.44260625 0.43465625 -0.75329375 0.43491875H1.0311125c-0.48110625 0 -0.8711125 -0.3900125 -0.8711125 -0.8711125V2.77485c0.00056875 -0.67058125 0.72685 -1.08908125 1.30730625 -0.75329375 0.26893125 0.15556875 0.43465 0.44260625 0.4349125 0.75329375v1.50411875l1.55929375 -1.42716875c3.9620625 -3.9407875 10.70438125 -2.11471875 12.13616875 3.286925 0.1611125 0.6078125 0.2425625 1.2339875 0.24231875 1.86279375Z" stroke-width="0.0625"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="custom-textarea-wrapper" id="wc-chat-theme-css-page"><textarea id="wc-custom-css-input" placeholder="在此输入自定义 CSS 代码..." oninput="wcApplyCustomCss()"></textarea></div>
                        <div class="custom-textarea-wrapper" id="wc-chat-theme-js-page" style="display: none;"><textarea id="wc-custom-js-input" placeholder="在此输入自定义 JavaScript 脚本代码..." oninput="wcApplyCustomJs()"></textarea></div>
                        <input type="file" id="wc-chat-theme-file-input" accept=".txt,.json,.docx" style="display: none;" onchange="wcHandleChatThemeImportFile(event)">
                        <div class="custom-actions" style="flex-direction: row;">
                            <button class="btn-secondary" style="flex: 1;" onclick="wcOpenSavePresetDialog()">保存预设</button>
                            <button class="btn-primary" style="flex: 1;" onclick="wcSaveCustomTheme()">应用美化</button>
                        </div>
                    </div>

                    <!-- 视图 6：头像显示 -->
                    <div class="view-container" id="wc-theme-avatar-view" style="display: none;">
                        <div class="custom-textarea-wrapper" style="flex: none; gap: 20px; padding: 20px 16px;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">开启气泡头像</span>
                                <div class="custom-toggle" id="wc-avatar-toggle" onclick="wcToggleAvatarEnable(this)"><div class="thumb"></div></div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">显示模式</span>
                                <div id="wcAvatarDisplayModeBtn" onclick="openWcAvatarModeSelect()" style="font-size: 16px; color: var(--tg-blue); cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                    <span id="wcAvatarDisplayModeText" data-value="all">全程显示</span>
                                    <svg class="wc-chevron-right" viewBox="0 0 8 13" style="width: 8px; height: 13px; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; fill: none;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">头像大小</span>
                                <input type="range" id="wc-avatar-size-slider" min="20" max="60" value="40" oninput="wcApplyAvatarSettings()" style="width: 60%; accent-color: var(--tg-blue);">
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <span style="font-size: 16px; font-weight: 600;">头像圆角</span>
                                <input type="range" id="wc-avatar-radius-slider" min="0" max="50" value="50" oninput="wcApplyAvatarSettings()" style="width: 60%; accent-color: var(--tg-blue);">
                            </div>
                        </div>

                        <div style="font-size: 13px; color: #8e8e93; margin: 10px 16px 0; font-weight: 600;">当前头像框</div>
                        <div style="display: flex; gap: 12px; padding: 10px 16px;">
                            <div class="wc-frame-preview-box" style="flex: 1; background: #F2F2F7; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                <div style="font-size: 12px; color: #8e8e93;">对方 (Chat)</div>
                                <div id="wc-chat-frame-preview" style="width: 50px; height: 50px; border-radius: 50%; background-color: #E5E5EA; background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                                <div style="font-size: 12px; color: #ff3b30; cursor: pointer; padding: 4px;" onclick="wcClearAvatarFrame('chat')">清除</div>
                            </div>
                            <div class="wc-frame-preview-box" style="flex: 1; background: #F2F2F7; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                <div style="font-size: 12px; color: #8e8e93;">自己 (User)</div>
                                <div id="wc-user-frame-preview" style="width: 50px; height: 50px; border-radius: 50%; background-color: #E5E5EA; background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                                <div style="font-size: 12px; color: #ff3b30; cursor: pointer; padding: 4px;" onclick="wcClearAvatarFrame('user')">清除</div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 16px 0;">
                            <div style="font-size: 13px; color: #8e8e93; font-weight: 600;">头像框库</div>
                            <div style="font-size: 13px; color: var(--tg-blue); font-weight: 600; cursor: pointer;" onclick="wcAddAvatarFrame()">+ 添加</div>
                        </div>
                        <div id="wc-avatar-frame-list" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 10px 16px;">
                            <!-- 动态渲染头像框 -->
                        </div>
                    </div>

                    <!-- 视图 8：聊天壁纸 -->
                    <div class="view-container" id="wc-theme-chat-bg-view" style="display: none;">
                        <div class="wc-bg-carousel" id="wc-chat-bg-carousel">
                            <!-- 动态渲染壁纸库 -->
                        </div>
                        <input type="file" id="wc-chat-bg-file-input" accept="image/*" style="display: none;" onchange="wcHandleChatBgUpload(event)">
                    </div>

                    <!-- 视图 4：编辑预设 -->
                    <div class="view-container" id="wc-theme-edit-preset-view" style="display: none;">

                        <div class="custom-textarea-wrapper" style="flex: none; margin-bottom: 12px; padding: 12px 16px;">
                            <input type="text" id="wc-edit-preset-name" placeholder="主题预设名称" style="width: 100%; border: none; background: transparent; outline: none; font-size: 16px; font-weight: 600; color: var(--text-main);">
                        </div>
                        <div class="custom-textarea-wrapper">
                            <textarea id="wc-edit-preset-css" placeholder="在此输入自定义 CSS 代码..."></textarea>
                        </div>
                        <div class="custom-actions" style="flex-direction: row;">
                            <button class="btn-secondary" style="flex: 1;" onclick="wcShowThemePreset()">取消</button>
                            <button class="btn-primary" style="flex: 1;" onclick="wcSaveEditedPreset()">保存</button>
                        </div>
                    </div>

                    <!-- 视图 9：复制原CSS -->
                    <div class="view-container" id="wc-theme-copy-css-view" style="display: none; flex-direction: column; height: 100%; overflow: hidden;">
                        <!-- 顶部仅保留页标题，去除了顶栏外部多余的复制按键 -->
                        <div style="padding: 0 4px 6px 4px; flex-shrink: 0;">
                            <span id="wcCopyCssHeaderTitle" style="font-size: 13px; font-weight: 700; color: #8E8E93;">第 1 页 · 聊天室基础原生 CSS</span>
                        </div>

                        <!-- 统一的卡片流滚动容器 (第 1、2、3 页通用) -->
                        <div id="wcCopyCssCardsWrap" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding: 2px 4px 10px 4px; margin-bottom: 8px; -webkit-overflow-scrolling: touch;">
                            <!-- 内容由 JS 动态生成 -->
                        </div>

                        <!-- 底部翻页控制器 (<> svg 切换上一页下一页) -->
                        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; padding: 6px 0 2px; flex-shrink: 0;">
                            <div id="wcCopyCssPrevBtn" onclick="wcSwitchCopyCssPage(-1)" title="上一页" style="width: 32px; height: 32px; border-radius: 50%; background: #F2F2F7; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-main);">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </div>
                            <span id="wcCopyCssPageIndicator" style="font-size: 13px; font-weight: 700; color: var(--text-main); min-width: 50px; text-align: center;">1 / 3</span>
                            <div id="wcCopyCssNextBtn" onclick="wcSwitchCopyCssPage(1)" title="下一页" style="width: 32px; height: 32px; border-radius: 50%; background: #F2F2F7; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-main);">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- 聊天壁纸上传菜单 -->
        <div class="icon-menu-overlay" id="wcChatBgMenuOverlay" onclick="wcCloseChatBgMenu()" style="z-index: 2000;">
            <div class="icon-menu" id="wcChatBgMenu" onclick="event.stopPropagation()">
                <div class="icon-menu-item" onclick="document.getElementById('wc-chat-bg-file-input').click(); wcCloseChatBgMenu();">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                    <span>照片图库</span>
                </div>
                <div class="icon-menu-item" onclick="wcHandleChatBgUrl();">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>使用 URL</span>
                </div>
            </div>
        </div>

        <section class="wc-add-friend-panel" id="wcAddFriendPanel" aria-hidden="true" aria-labelledby="wcAddFriendTitle" onclick="wcCloseAddFriendPanel()">
            <div class="wc-add-friend-drawer" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
                <header class="wc-add-friend-header">
                    <span class="wc-add-friend-handle" aria-hidden="true"></span>
                    <h2 id="wcAddFriendTitle">添加朋友</h2>
                </header>
                <div class="wc-add-friend-body">
                    <form class="wc-add-friend-search" onsubmit="wcSearchFriend(event)">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/></svg>
                        <input id="wcAddFriendSearchInput" type="search" placeholder="微信号 / 手机号" autocomplete="off" enterkeyhint="search" onkeydown="if(event.key==='Enter'||event.keyCode===13){event.preventDefault();event.stopPropagation();wcSearchFriend(event);}">
                        <button type="submit" class="wc-add-friend-search-btn" onclick="wcSearchFriend(event)" aria-label="搜索" title="搜索">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>
                    <div class="wc-add-friend-actions">
                        <button class="wc-add-friend-action" type="button" onclick="wcStartQrFriendImport()">
                            <span class="wc-add-friend-action-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="User-Profile-Focus--Streamline-Core" height="14" width="14">
                                    <desc>User Profile Focus Streamline Icon: https://streamlinehq.com</desc>
                                    <g id="user-profile-focus--close-geometric-human-person-profile-focus-user">
                                        <path id="Union" fill="#000000" fill-rule="evenodd" d="M1.57322 1.57322C1.62011 1.52634 1.6837 1.5 1.75 1.5h1.5c0.41421 0 0.75 -0.33579 0.75 -0.75C4 0.335786 3.66421 0 3.25 0h-1.5C1.28587 0 0.840752 0.184375 0.512563 0.512563 0.184375 0.840752 0 1.28587 0 1.75v1.5c0 0.41421 0.335786 0.75 0.75 0.75 0.41421 0 0.75 -0.33579 0.75 -0.75v-1.5c0 -0.0663 0.02634 -0.12989 0.07322 -0.17678ZM14 10.75c0 -0.4142 -0.3358 -0.75 -0.75 -0.75s-0.75 0.3358 -0.75 0.75v1.5c0 0.0663 -0.0263 0.1299 -0.0732 0.1768 -0.0469 0.0469 -0.1105 0.0732 -0.1768 0.0732h-1.5c-0.4142 0 -0.75 0.3358 -0.75 0.75s0.3358 0.75 0.75 0.75h1.5c0.4641 0 0.9092 -0.1844 1.2374 -0.5126 0.3282 -0.3282 0.5126 -0.7733 0.5126 -1.2374v-1.5ZM0.75 10c0.41421 0 0.75 0.3358 0.75 0.75v1.5c0 0.0663 0.02634 0.1299 0.07322 0.1768 0.04689 0.0469 0.11048 0.0732 0.17678 0.0732h1.5c0.41421 0 0.75 0.3358 0.75 0.75s-0.33579 0.75 -0.75 0.75h-1.5c-0.46413 0 -0.909248 -0.1844 -1.237437 -0.5126C0.184375 13.1592 0 12.7141 0 12.25v-1.5c0 -0.4142 0.335786 -0.75 0.75 -0.75Zm10 -10c-0.4142 0 -0.75 0.335786 -0.75 0.75 0 0.41421 0.3358 0.75 0.75 0.75h1.5c0.0663 0 0.1299 0.02634 0.1768 0.07322 0.0469 0.04689 0.0732 0.11048 0.0732 0.17678v1.5c0 0.41421 0.3358 0.75 0.75 0.75s0.75 -0.33579 0.75 -0.75v-1.5c0 -0.46413 -0.1844 -0.909248 -0.5126 -1.237437C13.1592 0.184375 12.7141 0 12.25 0h-1.5ZM6.99906 7.77647c-1.89906 0 -3.51847 1.19735 -4.14448 2.87833 -0.11136 0.299 0.12694 0.5954 0.44605 0.5954h7.39687c0.3191 0 0.5574 -0.2964 0.446 -0.5954 -0.626 -1.68098 -2.24537 -2.87833 -4.14444 -2.87833Zm2.20903 -3.31591c0 1.22086 -0.9897 2.21056 -2.21056 2.21056s-2.21056 -0.9897 -2.21056 -2.21056S5.77667 2.25 6.99753 2.25s2.21056 0.9897 2.21056 2.21056Z" clip-rule="evenodd" stroke-width="1"></path>
                                    </g>
                                </svg>
                            </span>
                            <span class="wc-add-friend-action-copy"><strong>扫码添加好友</strong><small>从相册选择角色微信二维码</small></span>
                            <svg class="wc-add-friend-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
                        </button>
                        <button class="wc-add-friend-action" type="button" onclick="wcOpenCreateGroupChat()">
                            <span class="wc-add-friend-action-icon" aria-hidden="true">
<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"
fill="currentColor" viewBox="0 0 24 24" >
<path d="M12 5a3 3 0 1 0 0 6 3 3 0 1 0 0-6m1 7h-2c-2.76 0-5 2.24-5 5v.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V17c0-2.76-2.24-5-5-5m-6.5-1c.47 0 .9-.12 1.27-.33a5.03 5.03 0 0 1-.42-4.52C7.09 6.06 6.8 6 6.5 6 5.06 6 4 7.06 4 8.5S5.06 11 6.5 11m-.39 1H5.5C3.57 12 2 13.57 2 15.5v1c0 .28.22.5.5.5H4c0-1.96.81-3.73 2.11-5m11.39-1c1.44 0 2.5-1.06 2.5-2.5S18.94 6 17.5 6c-.31 0-.59.06-.85.15a5.03 5.03 0 0 1-.42 4.52c.37.21.79.33 1.27.33m1 1h-.61A6.97 6.97 0 0 1 20 17h1.5c.28 0 .5-.22.5-.5v-1c0-1.93-1.57-3.5-3.5-3.5"></path>
</svg>
                            </span>
                            <span class="wc-add-friend-action-copy"><strong>创建群聊</strong><small>邀请好友开始新的群聊</small></span>
                            <svg class="wc-add-friend-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
                        </button>
                    </div>
                </div>
                <input id="wcContactQrInput" type="file" accept="image/*" hidden onchange="wcHandleContactQrFile(event)">
            </div>
        </section>

        <!-- 新增：好友详情页 (复用 Profile 样式) -->
        <div id="page-add-friend-detail" class="page">
            <div class="wc-profile-header">
                <div class="wc-profile-title" onclick="wcCloseAddFriendDetail()">
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; stroke: currentColor; stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; margin-top: 2px; transform: rotate(180deg);"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    Profile
                </div>
            </div>

            <div class="wc-profile-section">
                <div class="wc-profile-main">
                    <div class="wc-avatar-wrapper">
                        <div class="wc-avatar-inner" id="afd-avatar" style="background-size: cover; background-position: center;"></div>
                    </div>
                    <div class="wc-profile-info-wrap">
                        <div class="wc-profile-name" id="afd-name">角色名称</div>
                        <div class="wc-profile-id" id="afd-account">ID：--</div>
                    </div>
                </div>
                <div style="font-size: 15px; color: var(--text-sub); line-height: 1.6; margin-top: 10px;">
                    这是一个通过搜索找到的角色。点击下方按钮即可将其添加到您的通讯录中。
                </div>
            </div>

            <div style="padding: 0 20px; margin-top: 20px;">
                <div onclick="wcConfirmAddFriend()" style="background: var(--tg-blue); color: #fff; border-radius: 20px; padding: 14px; font-size: 16px; font-weight: 700; cursor: pointer; text-align: center; transition: opacity 0.2s;">
                    添加到通讯录
                </div>
            </div>
        </div>

        <!-- 全新：好友专属动态与朋友圈详情页 (相册排版) -->
        <div id="page-contact-profile" class="page" style="background-color: #ffffff; z-index: 120;">
            <!-- 悬浮通透导航栏 -->
            <div class="wc-cp-header-bar">
                <div class="wc-cp-header-btn" onclick="wcCloseContactProfile()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-cp-header-btn" onclick="wcTriggerCharPostMoment()" title="让TA发一条朋友圈">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                        <path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>

            <div class="wc-cp-scroll-container">
                <!-- 上半部分：封面与个人信息 -->
                <div class="wc-cp-cover-area" id="wcCpCoverArea" onclick="wcOpenCharCoverMenu(event)">
                    <div class="wc-cp-name-on-cover" id="wcCpName">角色名称</div>
                    <div class="wc-cp-avatar-box">
                        <div class="wc-cp-avatar" id="wcCpAvatar"></div>
                    </div>
                </div>

                <!-- 微信号展示栏 (直接显示微信号) -->
                <div class="wc-cp-sub-bar">
                    <span id="wcCpWxidTag"></span>
                </div>

                <!-- 下半部分：专属相册动态列表 -->
                <div class="wc-cp-album-feed" id="wcCpMomentsList">
                    <!-- 动态渲染相册瀑布流 -->
                </div>
            </div>
            <!-- 隐藏的封面上传 input -->
            <input type="file" id="wcCharCoverFileInput" accept="image/*" style="display: none;" onchange="wcHandleCharCoverUpload(event)">
        </div>

        <!-- 统一的底部导航栏 (放置在所有 page 的外面) -->
        <div class="bottom-nav-wrapper">
            <div class="bottom-nav">
                <div class="nav-item active" id="wc-nav-chat" onclick="wcSwitchTab('chat')"><div class="nav-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.9795 10.995C21.9724 9.9371 21.7584 8.89079 21.3495 7.91505C20.9471 6.93651 20.3519 6.04889 19.5995 5.30503C18.8548 4.56116 17.9707 3.97156 16.9977 3.57001C16.0247 3.16847 14.9821 2.96289 13.9295 2.96503C12.1823 2.95788 10.4807 3.52297 9.08489 4.57392C7.68903 5.62487 6.67562 7.1039 6.19951 8.78504C5.04368 9.19813 4.03507 9.9424 3.29952 10.925C2.47028 12.0222 2.02095 13.3597 2.01952 14.735C2.01101 15.5289 2.15705 16.3169 2.44951 17.055L2.1595 19.195C2.10244 19.5466 2.17152 19.9071 2.35451 20.2127C2.5375 20.5182 2.82262 20.7493 3.1595 20.865C3.39629 20.9505 3.6509 20.9746 3.89952 20.935L5.98952 20.565C6.74584 20.8713 7.55355 21.0308 8.36952 21.035C9.31014 21.0353 10.2391 20.827 11.0895 20.425C11.8146 20.0835 12.4667 19.6047 13.0095 19.015C13.3175 19.0615 13.6281 19.0882 13.9395 19.095C15.0005 19.0953 16.0508 18.8846 17.0295 18.475L19.9095 18.895H20.0195C20.2673 18.8954 20.5125 18.8443 20.7395 18.745C20.9686 18.6474 21.1734 18.5006 21.3395 18.315C21.5075 18.1309 21.6337 17.9125 21.7095 17.675C21.7897 17.4336 21.8203 17.1785 21.7995 16.925L21.4495 13.995C21.8182 13.0386 21.9981 12.0199 21.9795 10.995ZM12.0995 17.685C11.6417 18.2456 11.0643 18.6967 10.4095 19.005C9.74736 19.2987 9.03368 19.4584 8.30953 19.475C7.62035 19.4711 6.93943 19.3247 6.30953 19.045C6.21686 18.9972 6.11376 18.9732 6.00951 18.975H5.8795L3.60951 19.355L3.93953 16.995C3.95049 16.8589 3.92994 16.722 3.8795 16.595C3.61556 15.9862 3.48269 15.3286 3.48952 14.665C3.50527 13.6187 3.86116 12.6058 4.5034 11.7795C5.14565 10.9533 6.03936 10.3585 7.04952 10.085C7.46761 9.97483 7.89725 9.91442 8.32951 9.90504C9.61389 9.91005 10.8438 10.4243 11.7495 11.335C12.1983 11.782 12.554 12.3135 12.7961 12.8988C13.0381 13.4841 13.1616 14.1116 13.1595 14.745C13.1365 15.8145 12.7643 16.847 12.0995 17.685Z" fill="currentColor"/></svg></div><span>聊天</span></div>
                <div class="nav-item" id="wc-nav-contacts" onclick="wcSwitchTab('contacts')"><div class="nav-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" /></svg></div><span>联系人</span></div>
                <div class="nav-item" id="wc-nav-moments" onclick="wcSwitchTab('moments')"><div class="nav-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.72717C9.97277 1.72717 7.99106 2.32832 6.30545 3.45461C4.61985 4.58089 3.30598 6.18173 2.53019 8.05467C1.75439 9.92762 1.55143 11.9885 1.94693 13.9769C2.34243 15.9652 3.31862 17.7915 4.75211 19.225C6.1856 20.6585 8.01197 21.6347 10.0003 22.0302C11.9886 22.4257 14.0496 22.2227 15.9225 21.4469C17.7955 20.6711 19.3963 19.3574 20.5226 17.6718C21.6489 15.9862 22.25 14.0044 22.25 11.9772C22.2474 9.25952 21.1666 6.65393 19.2449 4.73225C17.3232 2.81058 14.7177 1.72982 12 1.72717ZM9.85001 10.1072C9.86863 10.0431 9.90298 9.9846 9.94998 9.93716C10.0007 9.88705 10.0623 9.84939 10.13 9.82716L16.13 7.82716L14.13 13.8872C14.1063 13.9429 14.0723 13.9938 14.0299 14.0372C13.9834 14.0853 13.9247 14.1198 13.86 14.1372L7.86002 16.1372L9.85001 10.1072Z" fill="currentColor"/></svg></div><span>朋友圈</span></div>
                <div class="nav-item" id="wc-nav-profile" onclick="wcSwitchTab('profile')"><div class="nav-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9667 1.75195C9.81618 1.76239 7.72323 2.4468 5.98323 3.70856C4.24323 4.97032 2.94402 6.74571 2.26894 8.78424C1.59387 10.8228 1.57703 13.0215 2.22077 15.0701C2.86452 17.1187 4.13635 18.9138 5.85681 20.202C5.90685 20.2507 5.96434 20.2912 6.02709 20.322C7.7668 21.5741 9.85708 22.248 12.0017 22.248C14.1464 22.248 16.2367 21.5741 17.9764 20.322C18.0421 20.2869 18.1027 20.2432 18.1567 20.192C19.877 18.8994 21.1468 17.0996 21.7865 15.0471C22.4261 12.9945 22.4032 10.7931 21.721 8.7543C21.0389 6.71546 19.7319 4.94233 17.985 3.68573C16.2382 2.42913 14.1398 1.75265 11.9867 1.75195H11.9667ZM11.9667 5.51196C12.7921 5.50205 13.6018 5.73775 14.2926 6.18903C14.9834 6.6403 15.5239 7.28669 15.8454 8.04584C16.1668 8.80498 16.2545 9.64249 16.0974 10.4516C15.9403 11.2607 15.5454 12.0048 14.963 12.589C14.3807 13.1732 13.6374 13.5711 12.8277 13.7319C12.0181 13.8927 11.1788 13.8092 10.4169 13.492C9.65495 13.1748 9.00487 12.6383 8.54951 11.9508C8.09415 11.2634 7.85414 10.4561 7.86004 9.63196C7.86783 8.54512 8.30238 7.50471 9.07028 6.73431C9.83818 5.96392 10.8781 5.52503 11.9667 5.51196ZM16.5942 19.4319C15.2071 20.2944 13.6058 20.7515 11.9717 20.7515C10.3376 20.7515 8.73627 20.2944 7.34921 19.4319C6.918 19.1703 6.51226 18.869 6.13726 18.532C6.70519 17.7242 7.43513 17.0431 8.28074 16.532C9.39741 15.869 10.6725 15.5191 11.9717 15.5191C13.2709 15.5191 14.546 15.869 15.6627 16.532C16.5083 17.0431 17.2382 17.7242 17.8061 18.532C17.4311 18.869 17.0254 19.1703 16.5942 19.4319Z" fill="currentColor"/></svg></div><span>我的</span></div>
            </div>
        </div>

        <!-- 朋友圈编辑弹窗 -->
        <div class="wc-moments-edit-overlay" id="wcMomentsEditOverlay">
            <div class="wc-moments-edit-card">
                <div class="edit-header">编辑个人资料</div>
                <div class="edit-bg-preview" id="wcMomentsEditBgPreview" onclick="openIconMenu(event, 'wcMomentsBg')">
                    <div class="edit-cam-icon"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
                </div>
                <div class="edit-avatar-wrapper">
                    <div class="edit-avatar-preview" id="wcMomentsEditAvatarPreview" onclick="openIconMenu(event, 'wcMomentsAvatar')"></div>
                    <div class="edit-cam-icon small"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
                </div>
                <div class="edit-form">
                    <input type="text" id="wcMomentsEditName" placeholder="名称">
                    <input type="text" id="wcMomentsEditId" placeholder="ID">
                    <textarea id="wcMomentsEditBio" placeholder="个性签名"></textarea>
                </div>
                <div class="edit-actions">
                    <button class="cancel" onclick="wcCloseMomentsEditModal()">取消</button>
                    <button class="save" onclick="wcSaveMomentsEdit()">保存</button>
                </div>
            </div>
        </div>

        <!-- 表情包详情与编辑弹窗 (iOS风格 无x 左下取消 右下确认) -->
        <div class="wc-emoji-edit-modal-overlay" id="wcEmojiEditModalOverlay" onclick="wcCloseEmojiEditModal(event)">
            <div class="wc-emoji-edit-card" onclick="event.stopPropagation()">
                <div class="wc-ee-preview-wrap">
                    <img id="wcEmojiEditPreviewImg" src="" alt="预览" onerror="this.style.opacity='0.2'" onload="this.style.opacity='1'">
                </div>
                <div class="wc-ee-form">
                    <div class="wc-ee-field">
                        <label class="wc-ee-label">表情描述</label>
                        <input type="text" id="wcEmojiEditDescInput" class="wc-ee-input" placeholder="输入表情描述">
                    </div>
                    <div class="wc-ee-field">
                        <label class="wc-ee-label">表情 URL</label>
                        <input type="text" id="wcEmojiEditUrlInput" class="wc-ee-input" placeholder="输入图片 URL" oninput="wcUpdateEmojiEditPreview(this.value)">
                    </div>
                </div>
                <div class="wc-ee-actions">
                    <button type="button" class="wc-ee-btn cancel" onclick="wcCloseEmojiEditModal()">取消</button>
                    <button type="button" class="wc-ee-btn confirm" onclick="wcConfirmSaveEmojiEdit()">确认</button>
                </div>
            </div>
        </div>

        <!-- 微信表情包批量导入弹窗 -->
        <div class="wc-batch-import-overlay" id="wcBatchImportOverlay" onclick="wcCloseBatchImportModal()">
            <div class="wc-batch-import-card" onclick="event.stopPropagation()">
                <div class="wc-batch-header">
                    <div class="wc-batch-header-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#888"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        批量导入
                    </div>
                    <div class="wc-batch-header-right">
                        <div id="wcBatchGroupSelectBtn" onclick="openWcBatchGroupSelect()" style="padding: 6px 28px 6px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 13px; font-weight: 600; color: #555; background-color: #fff; cursor: pointer; display: flex; align-items: center; gap: 8px; max-width: 120px;">
                            <span id="wcBatchGroupSelectText" data-value="new_default" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">默认分组</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>
                <div class="wc-batch-body">
                    <textarea id="wcBatchImportTextarea" placeholder="每行输入：描述 URL（描述与 URL 之间用一个空格）。也支持描述:URL。&#10;&#10;例如：&#10;开心 https://example.com/1.png&#10;难过 https://example.com/2.png"></textarea>
                </div>
                <div class="wc-batch-footer">
                    <input type="file" id="wcBatchFileInput" accept=".txt,.json,.docx" style="display: none;" onchange="wcHandleBatchImportFile(event)">
                    <button class="wc-batch-btn-sec" onclick="document.getElementById('wcBatchFileInput').click()">
                        <svg t="1788662594488" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3721" width="16" height="16" fill="currentColor"><path d="M162.133333 102.4h234.666667L512 217.6h349.866667c68.266667 0 119.466667 51.2 119.466666 119.466667v469.333333c0 68.266667-51.2 119.466667-119.466666 119.466667H162.133333c-68.266667 0-119.466667-51.2-119.466666-119.466667V217.6c0-64 51.2-115.2 119.466666-115.2z m277.333334 443.733333h-128l204.8 234.666667 209.066666-234.666667h-128V392.533333h-153.6l-4.266666 153.6z" p-id="3722"></path></svg>
                        文件导入
                    </button>
                    <button class="wc-batch-btn-pri" onclick="wcSaveBatchImport()">保存</button>

                </div>
            </div>
        </div>

        <!-- 微信表情包管理页面 -->
        <div class="page" id="wc-page-emoji-groups" style="background-color: #ffffff;">
            <div class="wc-browser-header">
                <div class="wc-browser-controls" onclick="wcCloseEmojiApp()">
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="2" y1="2" x2="14" y2="14"></line><line x1="14" y1="2" x2="2" y2="14"></line></svg>
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="2" y="2" width="12" height="12"></rect></svg>
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8"></line></svg>
                </div>
                <div class="wc-browser-address-bar">
                    <div class="wc-browser-search-icon-box">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="#c7c7cc" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div class="wc-browser-address-text">Emoji</div>
                </div>
                <div class="wc-browser-actions">
                    <span class="wc-action-btn-plus" onclick="wcImportEmojis()">+</span>
                </div>
            </div>
            <div class="scroll-area">
                <div class="wc-emoji-group-grid" id="wc-emoji-group-grid"></div>
            </div>
        </div>

        <div class="page" id="wc-page-emoji-detail" style="background-color: #ffffff;">
            <div class="wc-browser-header">
                <div class="wc-browser-controls" onclick="wcBackToEmojiGroups()">
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="2" y1="2" x2="14" y2="14"></line><line x1="14" y1="2" x2="2" y2="14"></line></svg>
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="2" y="2" width="12" height="12"></rect></svg>
                    <svg class="wc-control-btn" viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8"></line></svg>
                </div>
                <div class="wc-browser-address-bar">
                    <div class="wc-browser-search-icon-box">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="#c7c7cc" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div class="wc-browser-address-text" id="wc-nav-emoji-detail-title">分组名称</div>
                </div>
                <div class="wc-browser-actions">
                    <span class="wc-action-btn-plus" onclick="wcImportEmojis()">+</span>
                </div>
            </div>
            <div class="scroll-area">
                <div class="wc-detail-card">
                    <div class="wc-detail-header" style="border-bottom: none; padding: 0 0 16px 0;">
                        <div class="wc-detail-cover" id="wc-detail-emoji-cover"></div>
                        <div class="wc-detail-info">
                            <div class="wc-detail-title" id="wc-detail-emoji-title">分组名称</div>
                            <div class="wc-detail-actions">
                                <div class="wc-action-btn wc-btn-dark" id="wc-btn-manage-emoji" onclick="wcToggleEmojiManageMode()">管理</div>
                                <div class="wc-action-btn wc-btn-gray" id="wc-btn-edit-emoji-group" onclick="wcOpenEditEmojiGroupModal()">编辑</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wc-detail-card" style="margin-top: 0;">
                    <div class="wc-detail-emoji-grid" id="wc-detail-emoji-grid" style="padding: 0;"></div>
                </div>
            </div>
            <!-- Remix Icon v4.7.0, Apache-2.0; solid SVGs -->
            <div class="wc-bottom-action-bar" id="wc-emoji-bottom-action-bar">
                <button type="button" class="wc-bottom-btn select-all" id="wc-btn-select-all-emojis" onclick="wcToggleSelectAllEmojis()" aria-pressed="false"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.99979 7V3C6.99979 2.44772 7.4475 2 7.99979 2H20.9998C21.5521 2 21.9998 2.44772 21.9998 3V16C21.9998 16.5523 21.5521 17 20.9998 17H17V20.9925C17 21.5489 16.551 22 15.9925 22H3.00728C2.45086 22 2 21.5511 2 20.9925L2.00276 8.00748C2.00288 7.45107 2.4518 7 3.01025 7H6.99979ZM8.99979 7H15.9927C16.549 7 17 7.44892 17 8.00748V15H19.9998V4H8.99979V7ZM8.50242 18L14.1593 12.3431L12.7451 10.9289L8.50242 15.1716L6.3811 13.0503L4.96689 14.4645L8.50242 18Z"/></svg><span class="wc-bottom-btn-label">全选</span></button>
                <button type="button" class="wc-bottom-btn danger disabled" id="wc-btn-delete-emojis" onclick="wcDeleteSelectedEmojis()" disabled><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7V2H17V4ZM9 9V17H11V9H9ZM13 9V17H15V9H13Z"/></svg><span class="wc-bottom-btn-label">删除</span></button>
                <button type="button" class="wc-bottom-btn primary disabled" id="wc-btn-move-emojis" onclick="wcOpenMoveEmojiModal()" disabled><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM12 12H8V14H12V17L16 13L12 9V12Z"/></svg><span class="wc-bottom-btn-label">移动</span></button>
            </div>
        </div>
        <style id="wc-emoji-manage-toolbar-style">
            #wechatAppUI #wc-emoji-bottom-action-bar { width: min(calc(100% - 32px), 390px); gap: 8px; justify-content: center; }
            #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn {
                flex: 1; min-width: 0; padding: 12px 8px; border: 0;
                display: flex; align-items: center; justify-content: center; gap: 5px;
                font-family: inherit; font-size: 13px; font-weight: 600; line-height: 20px;
                white-space: nowrap;
            }
            #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn svg { width: 18px; height: 18px; flex: none; }
            #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn.select-all { color: #585c63; }
            #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn[aria-pressed="true"] { color: #007aff; }
            @media (max-width: 360px) {
                #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn { padding: 11px 5px; gap: 4px; font-size: 12px; }
                #wechatAppUI #wc-emoji-bottom-action-bar .wc-bottom-btn svg { width: 16px; height: 16px; }
            }
        </style>


        <style id="wc-moments-compose-enhancements">
            #wechatAppUI .wc-compose-option-item { cursor: pointer; }
            #wechatAppUI .wc-compose-option-value { max-width: 46%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI .wc-compose-option-value.has-value { color: #576b95; }
            #wechatAppUI .wc-moment-picker-overlay {
                position: absolute;
                inset: 0;
                z-index: 3600;
                display: none;
                flex-direction: column;
                background: #f2f2f7;
                transform: translateX(100%);
                transition: transform 0.26s cubic-bezier(.22,.61,.36,1);
            }
            #wechatAppUI .wc-moment-picker-overlay.show { transform: translateX(0); }
            #wechatAppUI .wc-moment-picker-header {
                min-height: 58px;
                padding: max(10px, env(safe-area-inset-top)) 14px 8px;
                display: grid;
                grid-template-columns: 72px 1fr 72px;
                align-items: end;
                background: rgba(249,249,249,.9);
                border-bottom: .5px solid rgba(60,60,67,.18);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
            }
            #wechatAppUI .wc-moment-picker-title { text-align: center; font-size: 17px; font-weight: 700; color: #111; }
            #wechatAppUI .wc-moment-picker-nav-btn {
                appearance: none;
                border: 0;
                background: transparent;
                padding: 8px 0;
                font: inherit;
                font-size: 16px;
                color: #576b95;
                text-align: left;
            }
            #wechatAppUI .wc-moment-picker-nav-btn.primary { text-align: right; font-weight: 650; }
            #wechatAppUI .wc-moment-picker-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 12px 12px calc(24px + env(safe-area-inset-bottom));
                -webkit-overflow-scrolling: touch;
            }
            #wechatAppUI .wc-moment-picker-section-title {
                padding: 10px 8px 6px;
                font-size: 12px;
                color: #8e8e93;
            }
            #wechatAppUI .wc-moment-picker-card {
                overflow: hidden;
                border-radius: 14px;
                background: rgba(255,255,255,.92);
                border: .5px solid rgba(60,60,67,.12);
                box-shadow: 0 8px 24px rgba(0,0,0,.035);
            }
            #wechatAppUI .wc-moment-picker-row {
                width: 100%;
                min-height: 58px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 9px 14px;
                border: 0;
                border-bottom: .5px solid rgba(60,60,67,.12);
                background: transparent;
                color: inherit;
                text-align: left;
                font: inherit;
            }
            #wechatAppUI .wc-moment-picker-row:last-child { border-bottom: 0; }
            #wechatAppUI .wc-moment-picker-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
            #wechatAppUI .wc-moment-picker-row-title { font-size: 16px; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI .wc-moment-picker-row-detail { font-size: 12px; color: #8e8e93; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI .wc-moment-picker-avatar {
                width: 38px;
                height: 38px;
                flex: 0 0 38px;
                overflow: hidden;
                border-radius: 10px;
                background: #e5e5ea;
            }
            #wechatAppUI .wc-moment-picker-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
            #wechatAppUI .wc-moment-picker-avatar-fallback { display: block; width: 100%; height: 100%; background: linear-gradient(145deg,#d7d7dc,#eeeef2); }
            #wechatAppUI .wc-moment-picker-check {
                width: 22px;
                height: 22px;
                flex: 0 0 22px;
                display: grid;
                place-items: center;
                border-radius: 7px;
                border: 1.5px solid #c7c7cc;
                background: rgba(255,255,255,.75);
            }
            #wechatAppUI .wc-moment-picker-check.radio { border-radius: 50%; }
            #wechatAppUI .wc-moment-picker-check svg {
                width: 15px;
                height: 15px;
                fill: none;
                stroke: #fff;
                stroke-width: 2.4;
                stroke-linecap: round;
                stroke-linejoin: round;
                opacity: 0;
            }
            #wechatAppUI .wc-moment-picker-check.selected { border-color: #07c160; background: #07c160; }
            #wechatAppUI .wc-moment-picker-check.selected svg { opacity: 1; }
            #wechatAppUI .wc-moment-picker-empty { padding: 30px 16px; text-align: center; font-size: 14px; color: #8e8e93; }
            #wechatAppUI .post-location {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-top: 7px;
                max-width: 100%;
                color: #576b95;
                font-size: 13px;
                line-height: 1.4;
            }
            #wechatAppUI .post-location svg { width: 13px; height: 13px; flex: 0 0 13px; fill: currentColor; }
            #wechatAppUI .post-location span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        </style>

        <!-- 发布朋友圈 Modal -->
        <div class="wc-compose-modal" id="wcComposeModal" style="display: none;">
            <div class="wc-compose-nav-bar">
                <div class="wc-compose-nav-btn cancel" onclick="wcCloseComposeModal()">取消</div>
                <div class="wc-compose-nav-title">发朋友圈</div>
                <div class="wc-compose-nav-btn post disabled" id="wcComposePostBtn" onclick="wcPostMoment()">发布</div>
            </div>

            <div class="wc-compose-content">
                <div class="wc-compose-top-section">
                    <textarea class="wc-compose-text-input" id="wcComposeInput" placeholder="这一刻的想法..." oninput="wcCheckComposeInput()"></textarea>

                    <div class="wc-compose-image-grid" id="wcComposeImageGrid">
                        <div class="wc-compose-image-add-btn" onclick="wcTriggerComposeImageUpload()">
                            <svg viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </div>
                    <input type="file" id="wcComposeImageInput" accept="image/*" multiple style="display: none;" onchange="wcHandleComposeImageUpload(event)">
                </div>

                <div class="wc-compose-options-list">
                    <div class="wc-compose-option-item" onclick="wcOpenComposeLocationPicker()">
                        <div class="wc-compose-option-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path fill="#000000" fill-rule="evenodd" d="M6.95009 1.25c-1.93669 0 -3.54564 1.49935 -3.68379 3.43653 -0.06852 0.96092 0.1493 1.91896 0.71555 2.66371 0.75427 0.99206 1.51871 1.67464 2.75843 2.50146 0.15706 0.10475 0.36208 0.10475 0.51914 0 1.23972 -0.82682 2.00416 -1.5094 2.75848 -2.50146 0.5662 -0.74475 0.784 -1.70279 0.7155 -2.6637C10.5953 2.74935 8.9863 1.25 7.04961 1.25h-0.09952ZM2.01947 4.59762C2.20414 2.00796 4.35582 0 6.95009 0h0.09952c2.59427 0 4.74599 2.00796 4.93059 4.59762 0.0852 1.19408 -0.1788 2.47206 -0.9673 3.50918 -0.8571 1.12736 -1.73372 1.9003 -3.05991 2.7848 -0.57703 0.3849 -1.32925 0.3849 -1.90628 0 -1.32619 -0.8845 -2.20276 -1.65744 -3.05991 -2.7848 -0.78853 -1.03712 -1.05248 -2.3151 -0.96733 -3.50918Zm4.98064 -1.14767c-0.47874 0 -0.88802 0.13565 -1.17734 0.42544 -0.28925 0.28973 -0.42458 0.69946 -0.42458 1.17869 0 0.47922 0.13533 0.88896 0.42458 1.17868 0.28932 0.28979 0.6986 0.42544 1.17734 0.42544 0.47874 0 0.88803 -0.13565 1.17734 -0.42544 0.28926 -0.28972 0.42458 -0.69946 0.42458 -1.17868 0 -0.47923 -0.13532 -0.88896 -0.42458 -1.17869 -0.28931 -0.28979 -0.6986 -0.42544 -1.17734 -0.42544ZM5.35326 11.9315c-1.23721 -0.8252 -2.14924 -1.5899 -3.00162 -2.61534 -0.2188 0.11078 -0.40795 0.28117 -0.5444 0.49853 -0.53741 0.85611 -0.952773 1.75041 -1.261287 2.73461 -0.181758 0.5798 0.19777 1.2362 0.847317 1.2765 3.74441 0.232 7.46813 0.2322 11.21253 0.0003 0.6531 -0.0404 1.0322 -0.703 0.845 -1.2841 -0.3172 -0.9847 -0.7405 -1.8792 -1.285 -2.73455 -0.1329 -0.20873 -0.3146 -0.37352 -0.5243 -0.48309 -0.8505 1.02134 -1.76092 1.78414 -2.99483 2.60714 -0.99699 0.6649 -2.29643 0.6649 -3.29341 0Z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="wc-compose-option-text">所在位置</div>
                        <div class="wc-compose-option-value" id="wcComposeLocationValue"></div>
                        <svg class="wc-compose-option-chevron" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="wc-compose-option-item" onclick="wcOpenComposeReminderPicker()">
                        <div class="wc-compose-option-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <path fill="#000000" fill-rule="evenodd" d="M7.28612 1.23732C9.67996 0.188953 12.3555 -0.0320512 14.8887 0.610363c2.533 0.642437 4.7798 2.111417 6.3847 4.173827 1.6047 2.06232 2.4761 4.60077 2.4766 7.21391v0.4892c0 1.0427 -0.4141 2.043 -1.1514 2.7803s-1.7375 1.1513 -2.7803 1.1514c-1.0427 0 -2.0429 -0.4141 -2.7802 -1.1514 -0.0294 -0.0294 -0.0576 -0.0597 -0.086 -0.0899 -1.047 1.6277 -2.8729 2.707 -4.9521 2.7071 -3.25068 -0.0002 -5.88654 -2.6351 -5.88674 -5.8858 0 -3.25079 2.63594 -5.88649 5.88674 -5.88668 3.2508 0.00019 5.8857 2.63589 5.8857 5.88668 0 0.1645 -0.0082 0.3273 -0.0215 0.4883h0.0225c0 0.5123 0.2032 1.004 0.5654 1.3662 0.3623 0.3622 0.854 0.5655 1.3662 0.5655 0.5123 -0.0001 1.004 -0.2032 1.3663 -0.5655 0.3622 -0.3622 0.5654 -0.8539 0.5654 -1.3662v-0.4883c-0.0003 -2.16845 -0.724 -4.2749 -2.0557 -5.98629 -1.3317 -1.71141 -3.1959 -2.9308 -5.2978 -3.46387 -2.1019 -0.53296 -4.3214 -0.34936 -6.30765 0.52051 -1.98637 0.86992 -3.62649 2.37691 -4.66016 4.2832C2.3951 9.25881 2.02621 11.4555 2.38084 13.5947c0.35466 2.1393 1.41241 4.0996 3.00586 5.5704 1.59348 1.4707 3.63219 2.3683 5.793 2.5507 2.1608 0.1824 4.3211 -0.3611 6.1386 -1.5439l0.545 0.8379 0.5459 0.8379c-2.1904 1.4254 -4.7934 2.0801 -7.3975 1.8603 -2.60407 -0.2198 -5.06106 -1.3008 -6.98144 -3.0732C2.10994 18.8624 0.835618 16.4999 0.408186 13.9219c-0.4273827 -2.5781 0.017076 -5.22519 1.262694 -7.52247C2.91653 4.10221 4.89244 2.2857 7.28612 1.23732M12 8.11232c-2.14623 0.00019 -3.88674 1.74046 -3.88674 3.88668 0.0002 2.1461 1.74063 3.8856 3.88674 3.8858 2.1461 -0.0002 3.8855 -1.7397 3.8857 -3.8858 0 -2.14622 -1.7395 -3.88649 -3.8857 -3.88668" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="wc-compose-option-text">提醒谁看</div>
                        <div class="wc-compose-option-value" id="wcComposeRemindValue"></div>
                        <svg class="wc-compose-option-chevron" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="wc-compose-option-item" onclick="wcOpenComposeVisibilityPicker()">
                        <div class="wc-compose-option-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                              <path fill="#000000" fill-rule="evenodd" d="M28.5 1.5c5.1662 0 8.9662 0.17219 11.5593 0.3574 3.3014 0.23579 5.8475 2.7819 6.0833 6.08329C46.3278 10.5338 46.5 14.3338 46.5 19.5s-0.1722 8.9662 -0.3574 11.5593c-0.2296 3.2147 -2.6497 5.7132 -5.8247 6.06 0.1063 -2.3119 0.1821 -5.1698 0.1821 -8.6193 0 -5.2327 -0.1744 -9.1041 -0.365 -11.773 -0.3421 -4.7898 -4.0722 -8.51988 -8.862 -8.86198C28.6041 7.6744 24.7327 7.5 19.5 7.5c-3.4495 0 -6.3074 0.07579 -8.6193 0.18205 0.3468 -3.17495 2.8453 -5.59505 6.06 -5.82465C19.5338 1.67219 23.3338 1.5 28.5 1.5Zm-9 9c5.1662 0 8.9662 0.1722 11.5593 0.3574 3.3014 0.2358 5.8475 2.7819 6.0833 6.0833 0.1852 2.5931 0.3574 6.3931 0.3574 11.5593 0 5.1662 -0.1722 8.9662 -0.3574 11.5593 -0.2358 3.3014 -2.7819 5.8475 -6.0833 6.0833 -2.5931 0.1852 -6.3931 0.3574 -11.5593 0.3574 -5.1662 0 -8.9662 -0.1722 -11.55932 -0.3574 -3.30138 -0.2358 -5.84749 -2.7819 -6.08328 -6.0833C1.67219 37.4662 1.5 33.6662 1.5 28.5c0 -5.1662 0.17219 -8.9662 0.3574 -11.5593 0.23579 -3.3014 2.7819 -5.8475 6.08329 -6.0833C10.5338 10.6722 14.3338 10.5 19.5 10.5Zm4.5258 20.2275c1.7991 -1.2668 2.9746 -3.3599 2.9746 -5.7275 0 -3.866 -3.134 -7 -7 -7s-7 3.134 -7 7c0 2.3609 1.1687 4.4488 2.9592 5.7167 -2.496 0.9331 -4.4844 2.7091 -5.5005 4.9205 -0.64555 1.405 0.1614 3.0869 1.7049 3.18l0.044 0.0025c1.8955 0.0989 4.4611 0.1804 7.7699 0.1804 3.3089 0 5.8745 -0.0815 7.77 -0.1804l0.045 -0.0025c1.5433 -0.0934 2.35 -1.7752 1.7045 -3.1801 -1.0122 -2.2028 -2.9891 -3.9736 -5.4716 -4.9096Z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="wc-compose-option-text">谁可以看</div>
                        <div class="wc-compose-option-value" id="wcComposeVisibilityValue">公开</div>
                        <svg class="wc-compose-option-chevron" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- 全新 iOS Wallet 浅色风格页面 -->
        <div id="page-wallet" class="page">
            <!-- 顶部导航 -->
            <div class="wc-wallet-nav">
                <div class="wc-wallet-btn-circle" onclick="wcCloseWallet()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-wallet-nav-title">Apple Cash</div>
                <!-- 右上角：支付设置入口 (实心三点) -->
                <div class="wc-wallet-btn-circle" onclick="wcOpenWalletSettings()">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="5" cy="12" r="2.5"></circle>
                        <circle cx="12" cy="12" r="2.5"></circle>
                        <circle cx="19" cy="12" r="2.5"></circle>
                    </svg>
                </div>
            </div>

            <!-- 卡片横向滑动区 -->
            <div class="wc-wallet-cards-wrapper">
                <div class="wc-wallet-cards-scroll" id="wcWalletCardsScroll" onscroll="wcUpdateWalletDots()">
                    <!-- 卡片由 JS 动态渲染 -->
                </div>
                <!-- 轮播指示器 -->
                <div class="wc-wallet-pagination" id="wcWalletDots">
                    <!-- 指示器由 JS 动态渲染 -->
                </div>
            </div>

            <!-- 可用余额卡片 (左右分栏，右侧为充值与提现) -->
            <div class="wc-wallet-balance-card">
                <div class="wc-wbc-left">
                    <div class="wc-wbc-label">可用余额(元)</div>
                    <div class="wc-wbc-amount" id="wcWalletBalance">0.00</div>
                </div>
                <div class="wc-wbc-right">
                    <button class="wc-wbc-btn" onclick="wcHandleRecharge()">充值</button>
                    <button class="wc-wbc-btn" onclick="wcHandleWithdraw()">提现</button>
                </div>
            </div>

            <!-- 功能卡片包裹 (营业厅、亲属卡、装扮为竖向展示，带边框) -->
            <div class="wc-wallet-menu-card">
                <div class="wc-wallet-menu-item" onclick="wcOpenBusinessHall()">
                    <div class="wc-wmi-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="20" height="20">
                            <path fill="currentColor" fill-rule="evenodd" d="M7 0.0505981c-0.19892 0 -0.38969 0.0790229 -0.53034 0.2196829C6.329 0.410941 6.24999 0.601716 6.25 0.800635l0.00011 2.304825 -3.2867 2.16444c-0.18446 0.12147 -0.26736 0.34957 -0.20396 0.56113l0.00063 0.00207h8.64402l0.0006 -0.00207c0.0634 -0.21156 -0.0195 -0.43966 -0.2039 -0.56113L7.75011 2.99749 7.75004 1.5506h0.62114c0.41421 0 0.75 -0.33579 0.75 -0.750002 0 -0.414213 -0.33579 -0.7499999 -0.75 -0.7499999H7ZM13.242 8.5592h-0.1957v3.9345h0.1957c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75H0.922119c-0.414213 0 -0.75 -0.3358 -0.75 -0.75s0.335787 -0.75 0.75 -0.75h0.195861V8.5592H0.922119c-0.414213 0 -0.75 -0.33578 -0.75 -0.75 0 -0.41421 0.335787 -0.75 0.75 -0.75H13.242c0.4142 0 0.75 0.33579 0.75 0.75 0 0.41422 -0.3358 0.75 -0.75 0.75Zm-2.1062 0h-1.25v3.9345h1.25V8.5592Zm-7.0216 0h-1.25l0 3.9345h1.25l0 -3.9345Zm3.84283 3.9345v-2.1104c0 -0.51411 -0.41674 -0.93085 -0.93082 -0.93085 -0.51407 0 -0.93081 0.41674 -0.93081 0.93085v2.1104h1.86163Z" clip-rule="evenodd" stroke-width="1"></path>
                        </svg>
                    </div>
                    <div class="wc-wmi-info">
                        <div class="wc-wmi-title">营业厅</div>
                        <div class="wc-wmi-sub">自助服务与业务办理</div>
                    </div>
                    <svg class="wc-wmi-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-wallet-menu-item" onclick="wcOpenFamilyCardList()">
                    <div class="wc-wmi-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
                            <path d="M937.349678 192.554264h-850.699356a35.427745 35.427745 0 0 0-35.427745 35.436776v153.143945h921.563877V227.99104a35.445807 35.445807 0 0 0-35.436776-35.436776zM51.213546 810.196314a35.427745 35.427745 0 0 0 35.427745 35.436775h850.699356a35.436776 35.436776 0 0 0 35.436776-35.436775v-356.806068H51.213546v356.806068z m824.753929-56.180475s-27.318106 11.098827-81.719517 11.098827-87.869477-11.098827-87.869477-11.098827c0-43.212276 37.974425-78.197513 84.789982-78.197513 46.842649 0 84.799012 34.985237 84.799012 78.197513zM837.604727 621.4711a41.243566 41.243566 0 1 1-82.487133 0 41.243566 41.243566 0 0 1 82.487133 0z m-103.664309-68.037887c15.695493 0 29.313908 8.768886 36.285669 21.664838a40.141811 40.141811 0 0 0-6.384761 3.856142 50.193068 50.193068 0 0 0-23.579363 42.489814c0 4.714066 0.686339 9.292671 1.923556 13.645507a38.796225 38.796225 0 0 1-8.199947 0.875986 41.297751 41.297751 0 0 1-41.270659-41.27969 41.216474 41.216474 0 0 1 41.225505-41.252597z m0.036123 90.46131c4.109004 0 8.109639 0.334139 12.065121 0.866955a50.572361 50.572361 0 0 0 22.116377 21.610654 89.87431 89.87431 0 0 0-28.05863 11.342658c-21.836423 11.216227-38.326625 30.307293-45.099709 53.191286-29.033954-3.269142-45.80411-8.805009-45.80411-8.805009 0-43.212276 37.938301-78.206544 84.780951-78.206544z"></path>
                        </svg>
                    </div>
                    <div class="wc-wmi-info">
                        <div class="wc-wmi-title">亲属卡</div>
                        <div class="wc-wmi-sub">对方消费我买单</div>
                    </div>
                    <svg class="wc-wmi-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
                <div class="wc-wallet-menu-item" onclick="wcOpenWalletThemeDrawer()">
                    <div class="wc-wmi-icon">
                        <svg t="1790489066998" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7205" width="20" height="20"><path d="M780.8 512c-38.4 0-76.8-32-76.8-76.8 0-38.4 32-76.8 76.8-76.8 38.4 0 76.8 32 76.8 76.8 0 38.4-38.4 76.8-76.8 76.8M633.6 313.6c-38.4 0-76.8-32-76.8-76.8 0-38.4 32-76.8 76.8-76.8 38.4 0 76.8 32 76.8 76.8-6.4 38.4-38.4 76.8-76.8 76.8m-249.6 0c-38.4 0-76.8-32-76.8-76.8 0-38.4 32-76.8 76.8-76.8 38.4 0 76.8 32 76.8 76.8 0 38.4-38.4 76.8-76.8 76.8M236.8 512c-38.4 0-76.8-32-76.8-76.8 0-38.4 32-76.8 76.8-76.8 38.4 0 76.8 32 76.8 76.8 0 38.4-38.4 76.8-76.8 76.8M512 64C262.4 64 64 262.4 64 512s198.4 448 448 448c38.4 0 76.8-32 76.8-76.8 0-19.2-6.4-32-19.2-51.2-12.8-12.8-19.2-32-19.2-51.2 0-38.4 32-76.8 76.8-76.8h89.6c140.8 0 249.6-108.8 249.6-249.6C953.6 243.2 755.2 64 512 64" fill="currentColor" p-id="7206"></path></svg>
                    </div>
                    <div class="wc-wmi-info">
                        <div class="wc-wmi-title">装扮</div>
                        <div class="wc-wmi-sub">卡片样式与个性化</div>
                    </div>
                    <svg class="wc-wmi-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                </div>
            </div>

            <!-- 底部交易记录卡片 (仅展示最新 5 条，支持查看全部) -->
            <div class="wc-transactions-panel">
                <div class="wc-tx-header">
                    <div class="wc-tx-title">最新交易</div>
                    <div class="wc-tx-more" onclick="wcOpenAllTransactionsPage()">
                        查看全部
                        <svg viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>

                <!-- 动态渲染列表容器 (最多5条) -->
                <div class="wc-tx-list" id="wcTxList">
                    <!-- JS 动态插入 -->
                </div>
            </div>

            </div> <!-- 修复：这里闭合 #page-wallet -->

        <!-- 全部交易记录独立页面 -->
        <div id="page-wallet-transactions" class="page" style="background-color: #ffffff; z-index: 150;">
            <div class="wc-transfer-nav-bar" style="background: #ffffff; padding: 45px 20px 10px 20px;">
                <div class="wc-wallet-btn-circle" onclick="wcCloseAllTransactionsPage()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-transfer-nav-title">账单明细</div>
                <div style="font-size: 14px; color: #ff3b30; cursor: pointer; font-weight: 500;" onclick="wcClearTransactions()">清空</div>
            </div>

            <!-- 统计汇总卡片 (参考图样式：黑曜石质感、大字支出、右侧结余与金色微光柱状图) -->
            <div class="wc-tx-summary-card">
                <div class="wc-tx-sc-left">
                    <div class="wc-tx-sc-header-row">
                        <span class="wc-tx-sc-label">本月支出</span>
                        <div class="wc-tx-eye-btn" onclick="wcToggleTransactionAmountVisibility()" title="显示/隐藏金额">
                            <svg id="wcTxEyeIcon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                    </div>
                    <div class="wc-tx-sc-main-amount" id="wcTxTotalExpense">¥ 0.00</div>
                    <div class="wc-tx-sc-sub-text" id="wcTxTotalIncome">本月收入 ¥ 0.00</div>
                </div>
                <div class="wc-tx-sc-right">
                    <div class="wc-tx-sc-surplus-box">
                        <div class="wc-tx-sc-surplus-label">预算结余</div>
                        <div class="wc-tx-sc-surplus-val" id="wcTxTotalSurplus">¥ 0.00</div>
                    </div>
                    <!-- 金色微光柱状图 SVG (纯代码矢量绘制) -->
                    <div class="wc-tx-sc-chart-svg">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="wcGoldBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#FFE082" stop-opacity="1"/>
                                    <stop offset="60%" stop-color="#C59B27" stop-opacity="0.6"/>
                                    <stop offset="100%" stop-color="#3A2C0A" stop-opacity="0.15"/>
                                </linearGradient>
                            </defs>
                            <rect x="2" y="24" width="4.5" height="16" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="14" y="16" width="4.5" height="24" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="26" y="8" width="4.5" height="32" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="38" y="20" width="4.5" height="20" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="50" y="10" width="4.5" height="30" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="62" y="18" width="4.5" height="22" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="74" y="22" width="4.5" height="18" rx="2" fill="url(#wcGoldBarGrad)"/>
                            <rect x="86" y="26" width="4.5" height="14" rx="2" fill="url(#wcGoldBarGrad)"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="wc-wallet-settings-content" id="wcAllTxListContent" style="padding-top: 4px;">
                <!-- 动态渲染全部交易记录 -->
            </div>
        </div>

        <!-- 钱包卡片装扮抽屉弹窗 -->
        <div class="wc-user-drawer-overlay" id="wcWalletThemeDrawerOverlay" onclick="wcCloseWalletThemeDrawer(event)">
            <div class="wc-wallet-theme-drawer" onclick="event.stopPropagation()">
                <div class="wc-wallet-theme-header">
                    <div class="wc-user-drawer-handle"></div>
                    <div class="wc-wtd-header-row centered">
                        <div class="wc-wtd-title">卡片装扮</div>
                    </div>
                </div>

                <div class="wc-wallet-theme-body">
                    <!-- 风格堆叠展示区说明与新版展开按钮 -->
                    <div class="wc-wtd-section-head">
                        <span>卡片风格 (点击卡堆展开)</span>
                        <div class="wc-wtd-stack-toggle-btn" id="wcWtdToggleBtn" onclick="wcToggleWalletStack()">
                            <span id="wcWtdToggleText">展开全部</span>
                            <svg id="wcWtdToggleSvg" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>

                    <!-- 竖向堆叠卡片舞台 (紧凑精致尺寸) -->
                    <div class="wc-wallet-stack-wrapper">
                        <div class="wc-wallet-stack-stage" id="wcWalletStackStage">
                            <!-- 由 JS 动态渲染堆叠卡片列表 -->
                        </div>
                    </div>

                    <!-- 重构的极简高级自定义 CSS 区域 -->
                    <div class="wc-wtd-section-head" style="margin-top: 20px;">
                        <span>自定义卡片 CSS</span>
                        <button type="button" class="wc-wtd-inline-link" onclick="wcResetWalletCardCss()" title="恢复默认" style="display: flex; align-items: center; justify-content: center; padding: 2px;">
                            <svg t="1790488953678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5028" width="18" height="18"><path d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z" p-id="5029" fill="#ff3b30"></path></svg>
                        </button>
                    </div>
                    <textarea id="wcWalletCustomCssInput" class="wc-wtd-code-input" placeholder="/* 在此输入自定义卡片 CSS，例如：*/&#10;.wc-cash-card {&#10;  box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;&#10;}" oninput="wcLiveApplyWalletCardCss(this.value)"></textarea>
                </div>

                <!-- 弹窗底部操作栏：左下角取消，右下角确认 -->
                <div class="wc-wtd-footer-bar">
                    <button type="button" class="wc-wtd-foot-btn cancel" onclick="wcCancelWalletThemeDrawer()">取消</button>
                    <button type="button" class="wc-wtd-foot-btn confirm" onclick="wcConfirmWalletThemeDrawer()">确认</button>
                </div>
            </div>
        </div>

        <!-- 亲属卡列表页面 -->
        <div id="page-family-cards" class="page" style="background-color: #ffffff; z-index: 150;">
            <div class="wc-transfer-nav-bar" style="background: #ffffff; padding: 45px 20px 10px 20px;">
                <div class="wc-wallet-btn-circle" onclick="wcCloseFamilyCardList()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-transfer-nav-title">亲属卡</div>
                <div style="width: 32px;"></div>
            </div>

            <!-- 亲属卡顶部交互切换栏 (收到 / 送出) -->
            <div style="padding: 4px 20px 12px; display: flex; justify-content: center; background: #ffffff;">
                <div class="wc-fc-segment-control" style="width: 100%; max-width: 260px;">
                    <div class="wc-fc-segment-slider" id="wcFamilyCardListTabSlider"></div>
                    <div class="wc-fc-segment-btn active" id="wcFcTabReceived" onclick="wcSwitchFamilyCardListTab('received')">收到</div>
                    <div class="wc-fc-segment-btn" id="wcFcTabSent" onclick="wcSwitchFamilyCardListTab('sent')">送出</div>
                </div>
            </div>

            <div class="wc-wallet-settings-content" id="wcFamilyCardListContent" style="padding-top: 6px;">
                <!-- 动态渲染亲属卡列表 -->
            </div>
        </div>

        <!-- 支付设置页面 -->
        <div id="page-wallet-settings" class="page" style="background-color: #ffffff; z-index: 150;">
            <div class="wc-transfer-nav-bar" style="background: #ffffff; padding: 45px 20px 10px 20px;">
                <div class="wc-wallet-btn-circle" onclick="wcCloseWalletSettings()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-transfer-nav-title">支付设置</div>
                <div style="width: 32px;"></div>
            </div>

            <div class="wc-wallet-settings-content">
                <div class="wc-ws-group">
                    <div class="wc-ws-item" onclick="wcSetPaymentPassword()">
                        <div class="wc-ws-text">设置支付密码</div>
                        <svg class="wc-ws-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                    <div class="wc-ws-item" onclick="wcChangePaymentPassword()">
                        <div class="wc-ws-text">修改支付密码</div>
                        <svg class="wc-ws-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>

                <div class="wc-ws-group">
                    <div class="wc-ws-item" onclick="wcToggleNoPwd()">
                        <div class="wc-ws-text">开启免密支付</div>
                        <div class="wc-ws-toggle" id="wcRealNoPwdToggle"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 亲属卡操作弹窗 (iOS 磨砂质感) -->
        <div class="wc-fc-modal-overlay" id="wcFamilyCardModalOverlay" onclick="wcCloseFamilyCardModal(event)">
            <div class="wc-fc-modal" onclick="event.stopPropagation()">
                <div style="text-align: center; font-size: 17px; font-weight: 600; color: #000; margin-bottom: 10px;">赠送亲属卡</div>

                <div class="wc-fc-amount-area">
                    <span class="wc-fc-currency">¥</span>
                    <input type="number" class="wc-fc-amount-input" id="wcFcAmountInput" placeholder="0.00">
                </div>

                <div class="wc-fc-note-area">
                    <input type="text" class="wc-fc-note-input" id="wcFcNoteInput" placeholder="你消费我买单">
                </div>

                <div class="wc-fc-action-area">
                    <button class="wc-fc-btn wc-fc-btn-cancel" onclick="wcCloseFamilyCardModal()">取消</button>
                    <button class="wc-fc-btn wc-fc-btn-confirm" id="wcFcConfirmBtn" onclick="wcConfirmFamilyCard()">赠送</button>
                </div>
            </div>
        </div>

        <!-- 转账页面 -->
        <div id="page-wc-transfer" class="page" style="background-color: #ffffff; z-index: 200;">
            <div class="wc-transfer-nav-bar">
                <div class="wc-transfer-nav-btn" onclick="wcCloseTransferPage()">取消</div>
                <div class="wc-transfer-nav-title">转账</div>
                <div class="wc-transfer-nav-btn" style="visibility: hidden;">取消</div>
            </div>

            <div class="wc-transfer-container">
                <div class="wc-transfer-avatar" id="wcTransferAvatar"></div>
                <div class="wc-transfer-name" id="wcTransferName">Name</div>
                <div class="wc-transfer-account" id="wcTransferAccount">WeChat ID</div>

                <div class="wc-transfer-amount-wrapper">
                    <span class="wc-transfer-currency">¥</span>
                    <input type="text" class="wc-transfer-amount-input" id="wcTransferAmountInput" placeholder="0.00" inputmode="decimal">
                </div>

                <input type="text" class="wc-transfer-note-input" id="wcTransferNoteInput" placeholder="添加备注...">
            </div>

            <button class="wc-transfer-next-btn" id="wcTransferNextBtn" onclick="wcOpenApplePay()">继续</button>
        </div>

        <!-- Apple Pay / 支付密码弹窗 (提升为全局公共弹窗) -->
        <div class="wc-ap-overlay" id="wcApOverlay">
            <div class="wc-ap-sheet">
                <div class="wc-ap-header">
                    <div class="wc-ap-close-btn" onclick="wcCloseApplePay()">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="wc-ap-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Apple-Logo--Streamline-Logos" height="24" width="24"><path fill="#000000" fill-rule="evenodd" d="M12 5.5c0 -3 1.5 -4.5 4.5 -4.5 0 3 -1.5 4.5 -4.5 4.5Zm-1.327 1.633c-0.642 -0.295 -1.378 -0.633 -2.337 -0.633 -2.129 0 -5.323 2.129 -5.323 6.387C3.013 17.145 5.713 23 8.336 23c0.798 0 1.33 -0.266 1.863 -0.532 0.532 -0.266 1.064 -0.532 1.863 -0.532 0.798 0 1.463 0.266 2.129 0.532 0.665 0.266 1.33 0.532 2.129 0.532 1.835 0 3.707 -2.864 4.666 -6.044 -0.882 -0.32 -2.646 -1.971 -2.646 -4.069 0 -2.706 1.237 -3.923 1.855 -4.33C19.08 7.186 17.528 6.5 16.32 6.5c-0.96 0 -1.864 0.338 -2.654 0.633 -0.613 0.228 -1.157 0.432 -1.604 0.432 -0.448 0 -0.89 -0.204 -1.389 -0.432Z" clip-rule="evenodd" stroke-width="1"></path></svg> Pay
                    </div>
                    <div style="width: 32px;"></div>
                </div>

                <!-- 视图 1：主支付视图 -->
                <div id="wc-ap-main-view" style="display: flex; flex-direction: column; flex: 1;">
                    <div class="wc-ap-payee-info">
                        <div class="wc-ap-payee-name" id="wcApPayeeName">Pay Name</div>
                        <div class="wc-ap-payee-amount" id="wcApAmountDisplay">¥0.00</div>
                    </div>

                    <div class="wc-ap-cards-container" id="wcApCardsContainer">
                        <!-- 卡片由 JS 动态生成 -->
                    </div>

                    <button class="wc-ap-change-method" onclick="wcCycleApCards()">更改付款方式</button>

                    <div class="wc-ap-payment-details">
                        <span class="wc-ap-detail-label">付款卡</span>
                        <span class="wc-ap-detail-value" id="wcApSelectedCardText">零钱卡 (...3022)</span>
                    </div>

                    <div class="wc-ap-confirm-area" onclick="wcHandleApConfirmClick()">
                        <div class="wc-ap-confirm-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path>
                                <path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path>
                                <path d="M17.29 21.02c.12-.6.19-1.23.19-1.87 0-2-.5-3.5-1-5"></path>
                                <path d="M2 12a10 10 0 0 1 18-6"></path>
                                <path d="M2 16h.01"></path>
                                <path d="M21.8 16c.2-2 .131-5.354 0-6"></path>
                                <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"></path>
                                <path d="M8.65 22c.21-.66.45-1.32.57-2"></path>
                                <path d="M9 6.8a6 6 0 0 1 9 5.2v2"></path>
                            </svg>
                        </div>
                        <div class="wc-ap-confirm-text">Click to confirm payment<br><span style="font-size: 12px; color: #8e8e93; font-weight: 400;">(点击确认支付)</span></div>
                    </div>
                </div>

                <!-- 视图 2：密码输入键盘 -->
                <div id="wc-ap-password-view" style="display: none; flex-direction: column; align-items: center; flex: 1;">
                    <div class="wc-pwd-title">输入密码</div>
                    <div class="wc-pwd-dots" id="wcPwdDots">
                        <div class="wc-pwd-dot"></div><div class="wc-pwd-dot"></div><div class="wc-pwd-dot"></div>
                        <div class="wc-pwd-dot"></div><div class="wc-pwd-dot"></div><div class="wc-pwd-dot"></div>
                    </div>
                    <div class="wc-keypad">
                        <button class="wc-key-btn" onclick="wcInputApPwd()">1</button><button class="wc-key-btn" onclick="wcInputApPwd()">2</button><button class="wc-key-btn" onclick="wcInputApPwd()">3</button>
                        <button class="wc-key-btn" onclick="wcInputApPwd()">4</button><button class="wc-key-btn" onclick="wcInputApPwd()">5</button><button class="wc-key-btn" onclick="wcInputApPwd()">6</button>
                        <button class="wc-key-btn" onclick="wcInputApPwd()">7</button><button class="wc-key-btn" onclick="wcInputApPwd()">8</button><button class="wc-key-btn" onclick="wcInputApPwd()">9</button>
                        <button class="wc-key-btn empty"></button><button class="wc-key-btn" onclick="wcInputApPwd()">0</button><button class="wc-key-btn empty"></button>
                    </div>
                </div>

                <!-- 视图 3：支付成功 -->
                <div id="wc-ap-success-view" style="display: none; flex-direction: column; align-items: center; justify-content: center; flex: 1; padding-bottom: 40px;">
                    <div class="wc-success-icon" id="wcSuccessIcon">
                        <svg viewBox="0 0 24 24"><polyline points="6 12 10 16 18 8"></polyline></svg>
                    </div>
                    <div class="wc-success-text">完成</div>
                </div>
            </div>
        </div>

        <!-- Simulated photo composer: selected Scheme 02, unified text-first note (Tabler icons, MIT). -->
        <div class="wc-sim-image-overlay" id="wcSimImageOverlay" aria-hidden="true" onclick="wcCloseSimImage(event)">
            <section class="wc-sim-image-dialog" role="dialog" aria-modal="true" aria-labelledby="wcSimImageTitle" onclick="event.stopPropagation()">
                <div class="wc-sim-image-heading">
                    <h2 id="wcSimImageTitle">写一张图片</h2>
                    <p>用文字记录一幅画面</p>
                </div>
                <div class="wc-sim-image-body">
                    <input type="file" id="wcSimImageFile" accept="image/*" hidden onchange="wcHandleSimImageFile(event)">
                    <div class="wc-sim-image-note">
                        <div class="wc-sim-image-note-header">
                            <label for="wcSimImageDescription">画面描述</label>
                            <span id="wcSimImageFieldNote">文字或照片任选</span>
                        </div>
                        <textarea id="wcSimImageDescription" maxlength="2000" rows="5" placeholder="用文字描述你想分享的画面……" oninput="wcUpdateSimImageConfirm()"></textarea>
                        <div class="wc-sim-image-note-bottom">
                            <span class="wc-sim-image-char-count" id="wcSimImageCharCount">0 / 2000</span>
                            <span class="wc-sim-image-note-divider" aria-hidden="true"></span>
                        </div>
                        <button type="button" class="wc-sim-image-picker" id="wcSimImagePicker" onclick="wcOpenSimImagePicker()" aria-label="从本地相册选择照片">
                            <span class="wc-sim-image-art">
                                <!-- Tabler Icons camera-filled (MIT), copyright Paweł Kuna -->
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 3a2 2 0 0 1 1.995 1.85l.005 .15a1 1 0 0 0 .883 .993l.117 .007h1a3 3 0 0 1 2.995 2.824l.005 .176v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9a3 3 0 0 1 2.824 -2.995l.176 -.005h1a1 1 0 0 0 1 -1a2 2 0 0 1 1.85 -1.995l.15 -.005h6zm-3 7a3 3 0 0 0 -2.985 2.698l-.011 .152l-.004 .15l.004 .15a3 3 0 1 0 2.996 -3.15z"/></svg>
                                <img class="wc-sim-image-picked" id="wcSimImagePicked" alt="已选本地照片缩略图" hidden>
                            </span>
                            <span class="wc-sim-image-attach-copy">
                                <strong class="wc-sim-image-preview-title" id="wcSimImageAttachTitle">添加照片</strong>
                                <small class="wc-sim-image-preview-note" id="wcSimImageAttachSubtitle">照片可选，描述会作为附言</small>
                            </span>
                            <!-- Tabler Icons chevron-right (MIT), copyright Paweł Kuna -->
                            <span class="wc-sim-image-chevron" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6l-6 6"/></svg></span>
                        </button>
                    </div>
                    <p class="wc-sim-image-hint" id="wcSimImageHint">没有选照片时，将使用童话机设置的图片占位 URL。</p>
                </div>
                <div class="wc-sim-image-footer">
                    <button type="button" class="wc-sim-image-btn cancel" onclick="wcCloseSimImage()">取消</button>
                    <button type="button" class="wc-sim-image-btn confirm" id="wcSimImageConfirm" onclick="wcConfirmSimImage()" disabled>确认</button>
                </div>
            </section>
        </div>

        <!-- Image detail modal: follows the Photos app full-screen viewer layout -->
        <div class="wc-image-modal-overlay" id="wcImageBottomSheetOverlay" onclick="wcCloseImageBottomSheet(event)">
            <div class="wc-ig-card" onclick="event.stopPropagation()">
                <div class="wc-ig-viewer-topbar">
                    <div class="wc-ig-viewer-avatar-btn" aria-hidden="true">
                        <div class="wc-ig-avatar" id="wcIgAvatar"></div>
                    </div>
                    <div class="wc-ig-user-capsule">
                        <div class="wc-ig-meta">
                            <span class="wc-ig-username" id="wcIgUsername">--:--</span>
                            <span class="wc-ig-sub" id="wcIgRemark">角色备注</span>
                        </div>
                    </div>
                    <button type="button" class="wc-ig-viewer-circle-btn" onclick="wcOpenImageSettingsPanel()" title="图片与占位图设置" aria-label="图片与占位图设置">
                        <!-- Reused from Photos app full-screen viewer: more -->
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="5" cy="12" r="2.2"></circle>
                            <circle cx="12" cy="12" r="2.2"></circle>
                            <circle cx="19" cy="12" r="2.2"></circle>
                        </svg>
                    </button>
                </div>

                <div class="wc-ig-viewer-main">
                    <div class="wc-ig-media-area">
                        <div class="wc-ig-flipper" id="wcImageFlipper">
                            <div class="wc-ig-front" id="wcImageSheetFront"></div>
                            <div class="wc-ig-back">
                                <div class="wc-ig-prompt-label">画面描述</div>
                                <div class="wc-ig-prompt-content" id="wcImageSheetBackText"></div>
                            </div>
                        </div>
                        <div class="wc-ig-drawing-state" id="wcIgDrawingState">
                            <div class="wc-ig-drawing-shimmer"></div>
                            <div class="wc-ig-drawing-text">
                                <span class="wc-ig-css-spinner" aria-hidden="true"></span>
                                <span>正在绘制新图片</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="wc-ig-viewer-bottombar">
                    <button type="button" class="wc-ig-viewer-circle-btn wc-ig-save-btn" data-wc-image-download onclick="wcActionDownloadImage()" title="下载图片" aria-label="下载图片">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M494.933333 128m42.666667 0l0 0q42.666667 0 42.666667 42.666667l0 426.666666q0 42.666667-42.666667 42.666667l0 0q-42.666667 0-42.666667-42.666667l0-426.666666q0-42.666667 42.666667-42.666667Z" fill="#666666"></path>
                            <path d="M836.266667 341.333333h-85.333334v85.333334h85.333334v341.333333h-597.333334v-341.333333h85.333334V341.333333h-85.333334a85.333333 85.333333 0 0 0-85.333333 85.333334v341.333333a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333v-341.333333a85.333333 85.333333 0 0 0-85.333333-85.333334z" fill="#666666"></path>
                            <path d="M561.493333 701.44l131.413334-131.413333a34.133333 34.133333 0 0 0-24.32-58.026667H406.613333A34.133333 34.133333 0 0 0 384 570.026667l128 131.413333a33.706667 33.706667 0 0 0 49.493333 0z" fill="#666666"></path>
                        </svg>
                    </button>

                    <div class="wc-ig-viewer-mid-capsule">
                        <button type="button" class="wc-ig-action-btn like-btn" id="wcIgLikeBtn" onclick="wcToggleImageLike(this)" title="收藏图片" aria-label="收藏图片">
                            <!-- Reused from Photos app: FAV_EMPTY_HEART_SVG -->
                            <svg class="wc-ig-heart-empty" viewBox="0 0 1024 1024" aria-hidden="true">
                                <path d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z" fill="#000000" stroke="#000000" stroke-width="28" stroke-linejoin="round"></path>
                            </svg>
                            <!-- Reused from Photos app: FAV_FILLED_HEART_SVG -->
                            <svg class="wc-ig-heart-filled" viewBox="0 0 1024 1024" aria-hidden="true">
                                <path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z" fill="#000000"></path>
                            </svg>
                        </button>
                        <button type="button" class="wc-ig-action-btn" onclick="wcToggleImagePrompt()" title="查看画面描述" aria-label="查看画面描述">
                            <!-- Reused from Photos app full-screen viewer: info -->
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path fill="#000000" d="M12 2c5.5228 0 10 4.47715 10 10 0 5.5228 -4.4772 10 -10 10 -5.52285 0 -10 -4.4772 -10 -10C2 6.47715 6.47715 2 12 2m0 2c-4.41828 0 -8 3.58172 -8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8m0 7c0.5523 0 1 0.4477 1 1v3h0.5c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1h-3c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1h0.5v-2h-0.5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm-0.25 -4c0.6904 0 1.25 0.55964 1.25 1.25s-0.5596 1.25 -1.25 1.25 -1.25 -0.55964 -1.25 -1.25S11.0596 7 11.75 7"></path>
                            </svg>
                        </button>
                        <button type="button" class="wc-ig-action-btn wc-ig-generate-btn" data-wc-image-generate onclick="wcActionGenerateImage()" title="调取 API 生成" aria-label="调取 API 生成">
                            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M835.516 709.837l154.351-225.894h-109.158c-14.541-221.047-198.11-396.151-422.844-396.151-234.291 0-423.731 189.918-423.731 424.277 0 234.155 189.918 424.141 424.209 424.141 105.062 0 200.977-38.434 275.115-101.786l-56.73-73.045c-58.368 51.063-134.69 82.398-218.385 82.398-183.296 0-331.844-148.617-331.844-331.708 0-183.364 148.617-331.913 331.844-331.913 173.739 0 315.665 133.734 329.933 303.787h-107.11l154.351 225.894z" fill="#666666"></path>
                            </svg>
                        </button>
                    </div>

                    <span class="wc-ig-bottombar-spacer" aria-hidden="true"></span>
                </div>

                <div class="wc-ig-settings-panel" id="wcIgSettingsPanel">
                    <div class="wc-ig-settings-header">
                        <div>
                            <div class="wc-ig-settings-title">图片设置</div>
                            <div class="wc-ig-settings-subtitle">选择聊天图片的占位图</div>
                        </div>
                        <button type="button" class="wc-ig-settings-close" onclick="wcCloseImageSettingsPanel()">完成</button>
                    </div>
                    <div class="wc-ig-settings-body">
                        <div class="wc-ig-img-grid">
                            <button type="button" class="wc-ig-img-add" onclick="wcOpenPlaceholderUploadMenu(event)" title="添加自定义图片">添加</button>
                            <div class="wc-ig-img-item" style="background-image: url('https://i.postimg.cc/GhZfPSB3/quality-restoration-20260917174437146.png')" onclick="wcApplyPresetPlaceholder(this, 'https://i.postimg.cc/GhZfPSB3/quality-restoration-20260917174437146.png')"></div>
                            <div class="wc-ig-img-item" style="background-image: url('https://i.postimg.cc/m20n36c7/quality-restoration-20260917175131715.png')" onclick="wcApplyPresetPlaceholder(this, 'https://i.postimg.cc/m20n36c7/quality-restoration-20260917175131715.png')"></div>
                            <div class="wc-ig-img-item" style="background-image: url('https://i.postimg.cc/DytNQYW8/quality-restoration-20260917175232882.png')" onclick="wcApplyPresetPlaceholder(this, 'https://i.postimg.cc/DytNQYW8/quality-restoration-20260917175232882.png')"></div>
                        </div>
                        <input type="file" id="wcPlaceholderFileInput" accept="image/*" style="display: none;" onchange="wcHandleLocalPlaceholderUpload(event)">
                    </div>
                </div>
            </div>
        </div>

        <!-- 查看已撤回消息弹窗 -->
        <div class="wc-recalled-modal-overlay" id="wcRecalledMsgModalOverlay" onclick="wcCloseRecalledMsgModal(event)">
            <div class="wc-recalled-modal-card" onclick="event.stopPropagation()">
                <div class="wc-recalled-modal-header">
                    <div class="wc-recalled-modal-title" id="wcRecalledModalSender">撤回的消息</div>
                    <div class="wc-recalled-modal-close" onclick="wcCloseRecalledMsgModal()">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div class="wc-recalled-modal-body" id="wcRecalledModalBody">
                    <!-- 内容动态注入 -->
                </div>
            </div>
        </div>

        <!-- 消息编辑与格式修复弹窗 -->
        <div class="wc-edit-msg-overlay" id="wcEditMsgOverlay" onclick="wcCloseEditMsgModal()">
            <div class="wc-edit-msg-panel" id="wcEditMsgPanel" onclick="event.stopPropagation()">
                <div class="wc-edit-msg-header">
                    <div class="wc-edit-msg-heading">
                        <div class="wc-edit-msg-title">编辑消息</div>
                        <div class="wc-edit-msg-subtitle">修正内容、角色、格式与时间</div>
                    </div>
                    <button type="button" class="wc-edit-msg-repair-btn" onclick="wcRepairEditMsgFormat()">自动识别</button>
                </div>

                <div class="wc-edit-msg-scroll">
                    <div class="wc-edit-msg-section">
                        <div class="wc-edit-msg-section-label">消息角色</div>
                        <div class="wc-edit-msg-segment" id="wcEditMsgRoleSegment">
                            <button type="button" class="wc-edit-msg-segment-btn" data-role="system" onclick="wcSetEditMsgRole('system')">system</button>
                            <button type="button" class="wc-edit-msg-segment-btn" data-role="user" onclick="wcSetEditMsgRole('user')">user</button>
                            <button type="button" class="wc-edit-msg-segment-btn" data-role="char" onclick="wcSetEditMsgRole('char')">char</button>
                        </div>
                    </div>

                    <div class="wc-edit-msg-section">
                        <div class="wc-edit-msg-section-label">转换格式</div>
                        <div class="wc-edit-msg-format-grid" id="wcEditMsgFormatGrid">
                            <button type="button" class="wc-edit-msg-format-btn" data-format="text" onclick="wcSetEditMsgFormat('text')">文本</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="translation" onclick="wcSetEditMsgFormat('translation')">翻译</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="voice" onclick="wcSetEditMsgFormat('voice')">语音</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="emoji" onclick="wcSetEditMsgFormat('emoji')">表情包</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="transfer" onclick="wcSetEditMsgFormat('transfer')">转账</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="image" onclick="wcSetEditMsgFormat('image')">图片</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="action" onclick="wcSetEditMsgFormat('action')">动描</button>
                            <button type="button" class="wc-edit-msg-format-btn" data-format="other" onclick="wcSetEditMsgFormat('other')">其他</button>
                        </div>
                    </div>

                    <div class="wc-edit-msg-section wc-edit-msg-content-section">
                        <div class="wc-edit-msg-field" id="wcEditMsgPrimaryField">
                            <label class="wc-edit-msg-field-label" id="wcEditMsgPrimaryLabel" for="wcEditMsgTextarea">消息文本</label>
                            <textarea id="wcEditMsgTextarea" placeholder="请输入消息内容..."></textarea>
                        </div>

                        <div class="wc-edit-msg-field" id="wcEditMsgTranslationField" style="display:none;">
                            <label class="wc-edit-msg-field-label" for="wcEditMsgTranslationTextarea">翻译</label>
                            <textarea id="wcEditMsgTranslationTextarea" placeholder="请输入译文..."></textarea>
                        </div>
                    </div>

                    <div class="wc-edit-msg-section">
                        <label class="wc-edit-msg-field-label" for="wcEditMsgTimeInput">消息时间</label>
                        <input class="wc-edit-msg-input wc-edit-msg-time-input" type="datetime-local" id="wcEditMsgTimeInput">
                        <div class="wc-edit-msg-repair-hint" id="wcEditMsgRepairHint"></div>
                    </div>
                </div>

                <div class="wc-edit-msg-actions">
                    <button class="wc-edit-msg-btn cancel" onclick="wcCloseEditMsgModal()">取消</button>
                    <button class="wc-edit-msg-btn save" onclick="wcSaveEditedMsg()">保存</button>
                </div>
            </div>
        </div>

        <!-- 语音发送弹窗 -->
        <div class="wc-voice-msg-overlay" id="wcVoiceMsgOverlay">
            <div class="wc-voice-msg-panel">
                <div class="wc-voice-msg-header">语音转文字</div>
                <div class="wc-voice-unified-card">
                    <textarea id="wcVoiceMsgTextarea" placeholder="点击录音按钮，说话内容将自动识别填入..."></textarea>
                    <div class="wc-voice-dock-bar">
                        <div class="wc-voice-msg-status" id="wcVoiceMsgStatus">准备录音</div>
                        <button class="wc-voice-rec-toggle" id="wcVoiceMsgRecordToggle" type="button">
                            <svg class="wc-voice-mic-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M868.847849 461.029118c0 177.22947-134.214794 326.877769-308.185035 350.078167l2.316765 108.726284 152.934135 0c26.883277 0 50.977022 24.593118 50.977022 50.977022 0 26.38595-17.150612 50.977022-44.033889 50.977022L511.999488 1021.787612 301.14213 1021.787612c-26.883277 0-44.033889-24.591071-44.033889-50.977022 0-26.383904 24.094768-50.977022 50.978045-50.977022l152.934135 0 2.315742-108.726284c-173.968194-23.200398-308.185035-172.848697-308.185035-350.078167 0-0.100284 0 3.385097 0 3.284813 0-0.050142 0-0.050142 0-0.100284 0-26.435069 15.631002-54.16462 50.978045-54.16462 39.503712 0 50.977022 24.593118 50.977022 50.978045l0 0c0.074701 140.737348 111.589494 254.842129 254.890224 254.891248 143.301753-0.050142 254.81757-114.154923 254.891248-254.891248l0 0c0-26.384927 24.095791-50.978045 50.979068-50.978045 26.882254 0 50.977022 27.728528 50.977022 54.16462 0 0.050142 0 0.050142 0 0.100284C868.847849 464.413192 868.847849 460.928834 868.847849 461.029118zM511.999488 639.451764 511.999488 639.451764c-107.507526 0-178.423669-72.832795-178.423669-178.422645L333.57582 180.648336c0-105.57757 70.917166-178.435948 178.423669-178.435948l0 0c107.509573 0 178.423669 72.858378 178.423669 178.435948l0 280.380782C690.423157 566.618968 619.507014 639.451764 511.999488 639.451764z" fill="currentColor"></path>
                            </svg>
                            <span class="wc-voice-rec-text">录音</span>
                        </button>
                    </div>
                </div>
                <div class="wc-voice-wave-container">
                    <div class="wc-spectrum-bars">
                        <div class="wc-spectrum-bar"></div>
                        <div class="wc-spectrum-bar"></div>
                        <div class="wc-spectrum-bar"></div>
                        <div class="wc-spectrum-bar"></div>
                        <div class="wc-spectrum-bar"></div>
                    </div>
                </div>
                <div class="wc-voice-msg-actions">
                    <button class="wc-voice-msg-btn cancel" onclick="wcCloseVoiceMsgModal()">取消</button>
                    <button class="wc-voice-msg-btn save" id="wcVoiceMsgSend" onclick="wcConfirmSendVoiceMsg()">发送</button>
                </div>
            </div>
        </div>

        <!-- Token 查询弹窗 -->
        <div class="wc-token-modal-overlay" id="wcTokenModalOverlay" onclick="wcCloseTokenModal(event)">
            <div class="wc-token-modal" onclick="event.stopPropagation()">
                <div class="wc-token-header">
                    <div style="min-width:0;">
                        <div class="wc-token-title">Token 分析</div>
                        <div id="wcTokenLiveStatus" style="font-size:11px;color:#8e8e93;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">实时估算当前配置</div>
                    </div>
                    <div class="wc-token-close" onclick="wcRefreshTokenModal()" title="重新计算" aria-label="重新计算">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"></path>
                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"></path>
                        </svg>
                    </div>
                </div>
                <div class="wc-token-chart-container">
                    <canvas id="wcTokenChart"></canvas>
                    <div class="wc-token-chart-center">
                        <div class="wc-token-total-num" id="wcTokenTotalNum">0</div>
                        <div class="wc-token-total-label">Total Tokens</div>
                    </div>
                </div>
                <div class="wc-token-list" id="wcTokenList">
                    <!-- 动态渲染列表 -->
                </div>
                <div class="wc-token-actions">
                    <button type="button" class="btn-primary wc-token-done-btn" onclick="wcCloseTokenModal()">我知道了</button>
                </div>
            </div>
        </div>

        <!-- 微信系统设置页面 (纯白极简风格) -->
        <div id="page-wechat-settings" class="page" style="background-color: #ffffff; z-index: 120;">
            <div class="wc-set-v2-header" style="background-color: #ffffff;">
                <div class="wc-set-v2-back" onclick="wcCloseWechatSettings()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-set-v2-title">设置</div>
                <div style="width: 32px;"></div>
            </div>

            <div class="wc-set-v2-content">
                <!-- 顶部：个人资料卡片 (显示头像和名称，点击展开详细资料弹窗) -->
                <div class="wc-set-v2-card" onclick="wcOpenProfileDetailModal()" style="cursor: pointer;">
                    <div class="wc-set-v2-row" style="padding: 12px 16px;">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #8E8E93;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                                  <path fill="#8E8E93" d="M20 5.00011h-5.185c-0.2036 -0.58431 -0.584 -1.09078 -1.0884 -1.44917S12.6188 3 12 3s-1.2222 0.19255 -1.7266 0.55094c-0.50441 0.35839 -0.8848 0.86486 -1.0884 1.44917H4c-0.53043 0 -1.03914 0.21072 -1.41421 0.58579C2.21071 5.96097 2 6.46968 2 7.00011V19.0001c0 0.5304 0.21071 1.0392 0.58579 1.4142 0.37507 0.3751 0.88378 0.5858 1.41421 0.5858h16c0.5304 0 1.0391 -0.2107 1.4142 -0.5858 0.3751 -0.375 0.5858 -0.8838 0.5858 -1.4142V7.00011c0 -0.53043 -0.2107 -1.03914 -0.5858 -1.41421S20.5304 5.00011 20 5.00011m-12 4c0.39556 0 0.78224 0.1173 1.11114 0.33707 0.3289 0.21976 0.58524 0.53212 0.73662 0.89752 0.15137 0.3655 0.19094 0.7676 0.11381 1.1556 -0.07717 0.388 -0.26765 0.7443 -0.54736 1.024 -0.2797 0.2797 -0.63607 0.4702 -1.02403 0.5474s-0.79009 0.0375 -1.15555 -0.1138c-0.36545 -0.1514 -0.67781 -0.4077 -0.89757 -0.7366S6 11.3957 6 11.0001c0 -0.5304 0.21071 -1.03913 0.58579 -1.4142 0.37507 -0.37507 0.88378 -0.58579 1.41421 -0.58579M5 17.0001c-0.03107 -0.4019 0.02521 -0.8057 0.16498 -1.1838 0.13978 -0.3781 0.35973 -0.7214 0.64476 -1.0064 0.28502 -0.2851 0.62837 -0.505 1.00644 -0.6448 0.37808 -0.1398 0.78193 -0.1961 1.18382 -0.165 0.40189 -0.0311 0.80574 0.0252 1.18382 0.165 0.37807 0.1398 0.72142 0.3597 1.00648 0.6448 0.285 0.285 0.5049 0.6283 0.6447 1.0064s0.1961 0.7819 0.165 1.1838zm7 -9.99999c-0.1978 0 -0.3911 -0.05864 -0.5556 -0.16853 -0.1644 -0.10988 -0.2926 -0.26606 -0.3683 -0.44878 -0.0757 -0.18273 -0.0955 -0.38379 -0.0569 -0.57778 0.0386 -0.19398 0.1338 -0.37216 0.2737 -0.51201 0.1398 -0.13985 0.318 -0.2351 0.512 -0.27368 0.194 -0.03859 0.3951 -0.01878 0.5778 0.05691 0.1827 0.07568 0.3389 0.20386 0.4488 0.3683 0.1099 0.16445 0.1685 0.35779 0.1685 0.55557 0 0.26522 -0.1054 0.51957 -0.2929 0.70711s-0.4419 0.29289 -0.7071 0.29289m7 9.99999h-6v-2h6zm0 -4h-6v-2h6z" stroke-width="1"></path>
                                </svg>
                            </div>
                            <div class="wc-set-v2-name-wrap">
                                <span class="wc-set-v2-label" style="font-size: 16px; font-weight: 500;">个人资料</span>
                            </div>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <span id="wcSetTopUserName" style="font-size: 14px; color: #8E8E93; margin-right: 8px;">--</span>
                            <div id="wcSetTopUserAvatar" class="wc-set-v2-user-avatar"></div>
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

                <!-- 功能 分组 -->
                <div class="wc-set-v2-group-title">功能</div>
                <div class="wc-set-v2-card">
                    <div class="wc-set-v2-row clickable" onclick="wcOpenWechatChangePwdPage()">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #8E8E93;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Lock-Rotation--Streamline-Core" height="20" width="20">
                                  <desc>Lock Rotation Streamline Icon: https://streamlinehq.com</desc>
                                  <g id="lock-rotation">
                                    <path id="Union" fill="#8E8E93" fill-rule="evenodd" d="M1.5 7a5.5 5.5 0 0 1 9.82 -3.405l-0.966 0.965a0.5 0.5 0 0 0 0.353 0.854H13.5a0.5 0.5 0 0 0 0.5 -0.5V2.12a0.5 0.5 0 0 0 -0.854 -0.354l-0.76 0.761a7 7 0 1 0 1.427 6.086 0.75 0.75 0 0 0 -1.46 -0.344A5.5 5.5 0 0 1 1.5 7Z" clip-rule="evenodd" stroke-width="1"></path>
                                    <path id="Union_2" fill="#8E8E93" fill-rule="evenodd" d="M6.125 5.813a0.875 0.875 0 1 1 1.75 0v0.5h-1.75v-0.5Zm-1.25 0.719v-0.72a2.125 2.125 0 1 1 4.25 0v0.72a0.998 0.998 0 0 1 0.375 0.78v2a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-2c0 -0.315 0.146 -0.597 0.375 -0.78Z" clip-rule="evenodd" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <span class="wc-set-v2-label">修改密码</span>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wc-set-v2-row clickable" onclick="wcOpenWechatPersonalize()">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #8E8E93;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8E8E93" id="Shirt--Streamline-Tabler-Filled" height="22" width="22">
                                  <desc>Shirt Streamline Icon: https://streamlinehq.com</desc>
                                  <path d="M14.883 3.007 14.978 3l0.112 0.004 0.113 0.017 0.113 0.03 6 2a1 1 0 0 1 0.677 0.833L22 6v5a1 1 0 0 1 -0.883 0.993L21 12h-2v7a2 2 0 0 1 -1.85 1.995L17 21H7a2 2 0 0 1 -1.995 -1.85L5 19v-7H3a1 1 0 0 1 -0.993 -0.883L2 11V6a1 1 0 0 1 0.576 -0.906l0.108 -0.043 6 -2A1 1 0 0 1 10 4a2 2 0 0 0 3.995 0.15l0.009 -0.24 0.017 -0.113 0.037 -0.134 0.044 -0.103 0.05 -0.092 0.068 -0.093 0.069 -0.08c0.056 -0.054 0.113 -0.1 0.175 -0.14l0.096 -0.053 0.103 -0.044 0.108 -0.032 0.112 -0.02z" stroke-width="1"></path>
                                </svg>
                            </div>
                            <span class="wc-set-v2-label">个性化</span>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wc-set-v2-row clickable" onclick="wcOpenWechatStorage()">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #8E8E93;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="22" width="22">
                                  <path fill="#8E8E93" d="M22 19.5C22 22 17.5 24 12 24S2 22 2 19.5v-5C2 17 6.5 19 12 19s10 -2 10 -4.5zm0 -7.5c0 2.5 -4.5 4.5 -10 4.5S2 14.5 2 12V7c0 2.5 4.5 4.5 10 4.5s10 -2 10 -4.5zM12 0c5.5228 0 10 2.01472 10 4.5S17.5228 9 12 9C6.47715 9 2 6.98528 2 4.5S6.47715 0 12 0" stroke-width="1"></path>
                                </svg>
                            </div>
                            <span class="wc-set-v2-label">存储空间</span>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <span id="wcSetStorageHint" style="font-size: 14px; color: #8E8E93; margin-right: 4px;">计算中...</span>
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wc-set-v2-row clickable" onclick="wcOpenChatManagePage()">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #8E8E93;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Chat-Bubble-Square-Warning--Streamline-Plump" height="22" width="22">
                                  <desc>Chat Bubble Square Warning Streamline Icon: https://streamlinehq.com</desc>
                                  <g id="chat-bubble-square-warning--bubble-square-messages-notification-chat-message-warning-alert">
                                    <path id="Subtract" fill="#8E8E93" fill-rule="evenodd" d="M8.1434 1.96626C11.4083 1.73864 16.5967 1.5 24 1.5s12.5917 0.23864 15.8566 0.46626c3.2657 0.22767 5.8619 2.6924 6.152 5.99264 0.2492 2.8354 0.4914 7.1152 0.4914 13.0411s-0.2422 10.2057 -0.4914 13.0411c-0.2901 3.3002 -2.8863 5.765 -6.152 5.9926 -3.1326 0.2184 -8.0358 0.447 -14.967 0.4651l-7.2626 6.2251c-1.6217 1.39 -4.127 0.2378 -4.127 -1.8981v-4.5101c-2.1631 -0.0825 -3.94068 -0.1832 -5.3566 -0.282 -3.26575 -0.2276 -5.86192 -2.6924 -6.152 -5.9926C1.74218 31.2057 1.5 26.9259 1.5 21s0.24218 -10.2057 0.4914 -13.0411c0.29008 -3.30024 2.88625 -5.76497 6.152 -5.99264ZM22.185 8.63795C22.7076 8.55473 23.3126 8.5 23.9999 8.5c0.6872 0 1.2922 0.05473 1.8148 0.13795 1.8031 0.28713 2.6278 2.01795 2.4784 3.64475 -0.1894 2.0604 -0.492 5.0226 -0.8234 6.9526 -0.1867 1.0876 -0.94 2.0521 -2.1465 2.1938 -0.3655 0.0429 -0.8032 0.0709 -1.3233 0.0709 -0.5202 0 -0.9579 -0.028 -1.3234 -0.0709 -1.2065 -0.1417 -1.9598 -1.1062 -2.1465 -2.1938 -0.3314 -1.93 -0.634 -4.8922 -0.8233 -6.9526 -0.1495 -1.6268 0.6752 -3.35762 2.4783 -3.64475ZM20 28.5c0 -2.2091 1.7909 -4 4 -4 2.2091 0 4 1.7909 4 4 0 2.2091 -1.7909 4 -4 4 -2.2091 0 -4 -1.7909 -4 -4Z" clip-rule="evenodd" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                            <span class="wc-set-v2-label">聊天记录管理</span>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

                <!-- 退出登录 分组 -->
                <div class="wc-set-v2-card" style="margin-top: 24px;">
                    <div class="wc-set-v2-row clickable" onclick="wcLogout()" style="justify-content: flex-start;">
                        <div class="wc-set-v2-icon-wrap" style="color: #FF3B30;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20">
                              <path fill="#FF3B30" fill-rule="evenodd" d="M9.7832 0.0237611c0.296 -0.065719 0.6062 0.006538 0.8428 0.1962889 0.2366 0.189794 0.374 0.476972 0.374 0.78027V23.0003c0 0.3033 -0.1374 0.5905 -0.374 0.7803 -0.2366 0.1897 -0.5468 0.262 -0.8428 0.1963l-8.999997 -2C0.325666 21.8752 0 21.469 0 21.0003V3.00032c0.0000040846 -0.46869 0.325668 -0.87488 0.783203 -0.97656zM23.707 18.2933c0.3905 0.3905 0.3905 1.0235 0 1.4141l-4 4 -1.414 -1.4141 2.2929 -2.293h-8.1855v-2h8.1855l-2.2929 -2.2929 1.414 -1.4141zM6.2998 10.8001c-0.66262 0.0002 -1.19921 0.5376 -1.19921 1.2002 0 0.6627 0.53659 1.2001 1.19921 1.2002 0.66275 0 1.2002 -0.5374 1.2002 -1.2002 0 -0.6627 -0.53745 -1.2002 -1.2002 -1.2002M19 2.00032c0.5523 0 1 0.44772 1 1v9.99998h-2V4.00032h-5v-2z" clip-rule="evenodd" stroke-width="1"></path>
                            </svg>
                        </div>
                        <span class="wc-set-v2-label" style="color: #FF3B30; font-weight: 500;">退出当前账号</span>
                        <div style="margin-left: auto;">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wc-set-v2-row clickable" onclick="wcDeleteAccount()" style="justify-content: flex-start; border-top: 0.5px solid rgba(0, 0, 0, 0.08);">
                        <div class="wc-set-v2-icon-wrap" style="color: #FF3B30;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Skull-2--Streamline-Plump" height="20" width="20">
                              <desc>
                                Skull 2 Streamline Icon: https://streamlinehq.com
                              </desc>
                              <g id="skull-2--crash-death-delete-die-error-garbage-remove-skull-trash">
                                <path id="Subtract" fill="#FF3B30" fill-rule="evenodd" d="M24 1.5C12.2784 1.5 2.5 10.0857 2.5 21c0 9.2034 6.97334 16.7668 16.1709 18.8962 0.0268 0.4822 0.0554 0.9134 0.0846 1.2981 0.1759 2.3172 1.7225 4.2919 4.1653 4.7052 0.5462 0.0924 1.1808 0.1823 1.9147 0.2633 0.4239 0.0468 0.8477 -0.0891 1.1653 -0.3736 0.3177 -0.2846 0.4992 -0.6909 0.4992 -1.1173V42c0 -0.8284 0.6716 -1.5 1.5 -1.5s1.5 0.6716 1.5 1.5v2.9947c0 0.8221 0.6618 1.4911 1.4838 1.4999 0.3295 0.0036 0.6681 0.0054 1.0162 0.0054 0.7174 0 1.3947 -0.0078 2.0339 -0.0223 0.815 -0.0184 1.4661 -0.6844 1.4661 -1.4996V42c0 -0.8284 0.6716 -1.5 1.5 -1.5s1.5 0.6716 1.5 1.5v2.5477c0 0.4339 0.1879 0.8465 0.5151 1.1314 0.3272 0.2848 0.7617 0.4141 1.1915 0.3543 0.3131 -0.0435 0.6035 -0.0884 0.8726 -0.1339 2.4428 -0.4134 3.9894 -2.388 4.1653 -4.7052 0.134 -1.766 0.2555 -4.5171 0.2555 -8.6943V20c0 -0.1397 -0.0191 -0.2749 -0.0548 -0.4032C44.6436 9.35384 35.2178 1.5 24 1.5ZM42.5 23c0 -2.753 -1.8115 -4.5 -3.5 -4.5s-3.5 1.747 -3.5 4.5 1.8115 4.5 3.5 4.5 3.5 -1.747 3.5 -4.5Zm-21 0c0 -2.6108 1.9111 -4.5 4 -4.5 2.0889 0 4 1.8892 4 4.5 0 2.6108 -1.9111 4.5 -4 4.5 -2.0889 0 -4 -1.8892 -4 -4.5Z" clip-rule="evenodd" stroke-width="1"></path>
                              </g>
                            </svg>
                        </div>
                        <span class="wc-set-v2-label" style="color: #FF3B30; font-weight: 500;">注销账号</span>
                        <div style="margin-left: auto;">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 个人资料详细弹窗 (显示头像、名称、手机号、微信号、密码) -->
        <div class="wc-profile-detail-overlay" id="wcProfileDetailOverlay" onclick="wcCloseProfileDetailModal()">
            <div class="wc-profile-detail-card" onclick="event.stopPropagation()">
                <div class="wc-pd-header">
                    <div class="wc-pd-title">个人资料</div>
                    <div class="wc-pd-close" onclick="wcCloseProfileDetailModal()">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div class="wc-pd-body">
                    <div class="wc-pd-avatar-box">
                        <div class="wc-pd-avatar" id="wcPdAvatarPreview"></div>
                        <div class="wc-pd-name" id="wcPdUserName">--</div>
                    </div>
                    <div class="wc-pd-list">
                        <div class="wc-pd-item">
                            <span class="wc-pd-label">手机号</span>
                            <span class="wc-pd-value" id="wcSetInfoPhone">--</span>
                        </div>
                        <div class="wc-pd-item">
                            <span class="wc-pd-label">微信号</span>
                            <span class="wc-pd-value" id="wcSetInfoWxid">--</span>
                        </div>
                        <div class="wc-pd-item">
                            <span class="wc-pd-label">密码</span>
                            <span class="wc-pd-value" id="wcSetInfoPwd">••••••</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 微信存储空间页面 (图1 纯白底色 + 真实存储空间逻辑) -->
        <div id="page-wechat-storage" class="page" style="background-color: #ffffff; z-index: 130;">
            <div class="wc-st-header" style="background-color: #ffffff;">
                <div class="wc-st-back" onclick="wcCloseWechatStorage()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-st-title">存储空间</div>
                <div style="width: 32px;"></div>
            </div>

            <div class="wc-st-content">
                <!-- 顶部彩色进度条 (展示各板块真实比例) -->
                <div class="wc-st-bar-wrapper">
                    <div class="wc-st-bar-track">
                        <div class="wc-st-bar-seg green" id="wcStSegChat" style="width: 35%;"></div>
                        <div class="wc-st-bar-seg yellow" id="wcStSegEmoji" style="width: 25%;"></div>
                        <div class="wc-st-bar-seg blue" id="wcStSegImgBg" style="width: 25%;"></div>
                        <div class="wc-st-bar-seg purple" id="wcStSegOther" style="width: 15%;"></div>
                    </div>
                    <div class="wc-st-bar-legend">
                        <div class="wc-st-legend-item"><span class="wc-st-dot green"></span>聊天记录</div>
                        <div class="wc-st-legend-item"><span class="wc-st-dot yellow"></span>表情包</div>
                        <div class="wc-st-legend-item"><span class="wc-st-dot blue"></span>图片壁纸</div>
                        <div class="wc-st-legend-item"><span class="wc-st-dot purple"></span>预设配置</div>
                    </div>
                </div>

                <!-- 微信已用空间标题与大字 -->
                <div class="wc-st-hero">
                    <div class="wc-st-hero-label">微信已用空间</div>
                    <div class="wc-st-hero-num" id="wcStTotalUsage">计算中...</div>
                    <div class="wc-st-hero-sub" id="wcStUsagePercent">占存储空间计算中...</div>
                </div>

                <!-- 卡片 1: 缓存 -->
                <div class="wc-st-card">
                    <div class="wc-st-card-top">
                        <div class="wc-st-card-info">
                            <div class="wc-st-card-title">缓存</div>
                            <div class="wc-st-card-size" id="wcStCacheSize">计算中...</div>
                        </div>
                        <button class="wc-st-btn-clean primary" onclick="wcCleanStorageCache()">清理</button>
                    </div>
                    <div class="wc-st-card-detail" id="wcStCacheDetail">包括朋友圈及数据临时缓存</div>
                    <div class="wc-st-card-desc">缓存是使用微信过程中产生的临时数据，清理缓存不会影响微信的正常使用。</div>
                </div>

                <!-- 卡片 2: 聊天记录 -->
                <div class="wc-st-card">
                    <div class="wc-st-card-top">
                        <div class="wc-st-card-info">
                            <div class="wc-st-card-title">聊天记录</div>
                            <div class="wc-st-card-size" id="wcStChatSize">计算中...</div>
                        </div>
                        <button class="wc-st-btn-clean secondary" onclick="wcManageChatHistory()">清理</button>
                    </div>
                    <div class="wc-st-card-desc">可清理聊天记录里的图片、语音和文件，或者删除指定的聊天记录。</div>
                </div>

                <!-- 卡片 3: 资源文件 -->
                <div class="wc-st-card">
                    <div class="wc-st-card-top">
                        <div class="wc-st-card-info">
                            <div class="wc-st-card-title">资源文件</div>
                            <div class="wc-st-card-size" id="wcStResourceSize">计算中...</div>
                        </div>
                        <button class="wc-st-btn-clean secondary" onclick="wcCleanStorageResource()">清理</button>
                    </div>
                    <div class="wc-st-card-desc">包含微信表情包、自定义壁纸、主题配置等所需资源文件。</div>
                </div>

                <!-- 卡片 4: 必要文件 -->
                <div class="wc-st-card">
                    <div class="wc-st-card-top">
                        <div class="wc-st-card-info">
                            <div class="wc-st-card-title">必要文件</div>
                            <div class="wc-st-card-size" id="wcStNecessarySize">1.7 GB</div>
                        </div>
                    </div>
                    <div class="wc-st-card-desc">包含微信运行所需必要文件，该类别的大小因当前微信使用状态而异。</div>
                </div>

                <!-- 底部其他账号占用 -->
                <div class="wc-st-footer-row">
                    <div class="wc-st-fr-left">
                        <div class="wc-st-fr-title">其他账号占用了 <span id="wcStOtherAccountSize">0 KB</span></div>
                        <div class="wc-st-fr-desc">包含在当前设备登录过的其他账号的聊天记录和登录记录。</div>
                    </div>
                    <div class="wc-st-fr-btn" onclick="wcCleanOtherAccountsStorage()">清理</div>
                </div>
            </div>
        </div>

        <!-- 微信修改密码页面 (图片同款极简风格) -->
        <div id="page-wechat-change-pwd" class="page" style="background-color: #ffffff; z-index: 130;">
            <div class="wc-pwd-v2-header">
                <div class="wc-pwd-v2-back" onclick="wcCloseWechatChangePwdPage()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
            </div>

            <div class="wc-pwd-v2-content">
                <h1 class="wc-pwd-v2-main-title">设置新密码</h1>

                <div class="wc-pwd-v2-form-card">
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">原密码</span>
                        <input type="password" id="wcChangePwdOldInput" class="wc-pwd-v2-input" placeholder="请输入原密码" oninput="wcCheckChangePwdValidation()">
                    </div>
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">新密码</span>
                        <input type="password" id="wcChangePwdNewInput" class="wc-pwd-v2-input" placeholder="请设置新密码" oninput="wcCheckChangePwdValidation()">
                    </div>
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">确认密码</span>
                        <input type="password" id="wcChangePwdConfirmInput" class="wc-pwd-v2-input" placeholder="请再次输入新密码" oninput="wcCheckChangePwdValidation()">
                    </div>
                </div>

                <div class="wc-pwd-v2-rules-list">
                    <div class="wc-pwd-v2-rule-item" id="wcPwdRuleLen">
                        <div class="wc-pwd-v2-rule-icon">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span>密码由8-16位数字、字母或符号组成</span>
                    </div>
                    <div class="wc-pwd-v2-rule-item" id="wcPwdRuleTypes">
                        <div class="wc-pwd-v2-rule-icon">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span>至少含2种以上字符</span>
                    </div>
                </div>

                <button class="wc-pwd-v2-submit-btn" id="wcChangePwdSubmitBtn" disabled onclick="wcSubmitChangePassword()">确定</button>

                <p class="wc-pwd-v2-footer-hint">安全提示：新密码请勿与旧密码过于相似。</p>
            </div>
        </div>

        <!-- 微信修改支付密码页面 (独立全屏页面) -->
        <div id="page-wechat-change-pay-pwd" class="page" style="background-color: #ffffff; z-index: 160;">
            <div class="wc-pwd-v2-header">
                <div class="wc-pwd-v2-back" onclick="wcCloseWechatChangePayPwdPage()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
            </div>

            <div class="wc-pwd-v2-content">
                <h1 class="wc-pwd-v2-main-title">设置新支付密码</h1>

                <div class="wc-pwd-v2-form-card">
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">原密码</span>
                        <input type="password" id="wcChangePayPwdOldInput" class="wc-pwd-v2-input" placeholder="请输入原支付密码" maxlength="6" inputmode="numeric" oninput="wcCheckChangePayPwdValidation()">
                    </div>
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">新密码</span>
                        <input type="password" id="wcChangePayPwdNewInput" class="wc-pwd-v2-input" placeholder="请设置6位数字支付密码" maxlength="6" inputmode="numeric" oninput="wcCheckChangePayPwdValidation()">
                    </div>
                    <div class="wc-pwd-v2-input-row">
                        <span class="wc-pwd-v2-input-label">确认密码</span>
                        <input type="password" id="wcChangePayPwdConfirmInput" class="wc-pwd-v2-input" placeholder="请再次输入新支付密码" maxlength="6" inputmode="numeric" oninput="wcCheckChangePayPwdValidation()">
                    </div>
                </div>

                <div class="wc-pwd-v2-rules-list">
                    <div class="wc-pwd-v2-rule-item" id="wcPayPwdRuleLen">
                        <div class="wc-pwd-v2-rule-icon">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span>支付密码必须为6位纯数字</span>
                    </div>
                </div>

                <button class="wc-pwd-v2-submit-btn" id="wcChangePayPwdSubmitBtn" disabled onclick="wcSubmitChangePayPassword()">确定</button>

                <p class="wc-pwd-v2-footer-hint">安全提示：支付密码独立于微信登录密码，请勿泄露给他人。</p>
            </div>
        </div>

        <!-- 微信个性化设置页面 (纯白极简风格 + 图片同款壁纸卡片) -->
        <div id="page-wechat-personalize" class="page" style="background-color: #ffffff; z-index: 130;">
            <div class="wc-set-v2-header" style="background-color: #ffffff;">
                <div class="wc-set-v2-back" onclick="wcCloseWechatPersonalize()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-set-v2-title">个性化</div>
                <div style="width: 32px;"></div>
            </div>

            <div class="wc-ps-content">
                <!-- 微信壁纸区域 (100% 还原图示样式) -->
                <div class="wc-wp-header-row">
                    <div class="wc-wp-title">微信壁纸</div>
                    <div class="wc-wp-actions">
                        <!-- 恢复默认按钮 -->
                        <div class="wc-wp-btn reset" onclick="wcSetGlobalBg('')" title="恢复默认">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FF3B30" id="Arrow-Counter-Clockwise-Bold--Streamline-Phosphor" height="22" width="22">
                              <desc>
                                Arrow Counter Clockwise Bold Streamline Icon: https://streamlinehq.com
                              </desc>
                              <path d="M15.84 8.00151875c0.00035625 3.97149375 -3.19084375 7.2060375 -7.1619875 7.25925625h-0.097275c-1.8532375 0.00390625 -3.63691875 -0.70545625 -4.9813 -1.98105 -0.48756875 -0.46046875 -0.29383125 -1.27606875 0.34873125 -1.46808125 0.2982125 -0.0891125 0.6213125 -0.0123625 0.84759375 0.2013375 3.08818125 2.915525 8.17444375 1.39466875 9.15526875 -2.7375375C14.93185625 5.1432375 11.071625 1.49883125 7.00261875 2.71551875c-0.8764625 0.26206875 -1.674 0.737975 -2.320825 1.384875 -0.0094375 0.00943125 -0.01815 0.01814375 -0.0283125 0.02685625L3.27349375 5.38818125h1.2420625c0.67058125 0.00056875 1.08908125 0.72685 0.75329375 1.30730625 -0.15556875 0.2689375 -0.44260625 0.43465625 -0.75329375 0.43491875H1.0311125c-0.48110625 0 -0.8711125 -0.3900125 -0.8711125 -0.8711125V2.77485c0.00056875 -0.67058125 0.72685 -1.08908125 1.30730625 -0.75329375 0.26893125 0.15556875 0.43465 0.44260625 0.4349125 0.75329375v1.50411875l1.55929375 -1.42716875c3.9620625 -3.9407875 10.70438125 -2.11471875 12.13616875 3.286925 0.1611125 0.6078125 0.2425625 1.2339875 0.24231875 1.86279375Z" stroke-width="0.0625"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- 壁纸预览大卡片 (已去除文本) -->
                <div class="wc-ps-wallpaper-mockup" id="wcGlobalBgMockup" onclick="wcOpenGlobalBgMenu(event)" style="cursor: pointer;"></div>
                <input type="file" id="wcGlobalBgFileInput" accept="image/*" style="display: none;" onchange="wcHandleGlobalBgUpload(event)">

                <!-- 自定义 CSS & 脚本 区域 -->
                <div class="wc-ps-section-title" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
                    <span>WeChat 自定义美化 (CSS & 脚本)</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <!-- 导入图标 -->
                        <div class="wc-wp-btn" onclick="wcTriggerImportThemePreset()" title="导入主题预设 (JSON/TXT)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.6801 7.01398C20.458 6.54993 20.1451 6.1351 19.76 5.79398L16.76 3.07398C16.0997 2.46873 15.2613 2.09339 14.37 2.004H8.21008C7.54764 1.97591 6.88617 2.07983 6.26428 2.30976C5.64239 2.53969 5.07249 2.89103 4.58765 3.3433C4.10281 3.79557 3.71274 4.33973 3.44019 4.94416C3.16763 5.54858 3.01797 6.20119 3 6.86399V17.164C3.03538 18.1635 3.36978 19.1294 3.95984 19.937C4.5499 20.7445 5.36855 21.3566 6.31006 21.694C6.92247 21.9255 7.57613 22.0277 8.22998 21.994H15.79C16.4525 22.0221 17.1138 21.9181 17.7357 21.6882C18.3576 21.4583 18.9276 21.107 19.4125 20.6547C19.8973 20.2024 20.2874 19.6582 20.5599 19.0538C20.8325 18.4494 20.982 17.7968 21 17.134V8.564C21.0048 8.03045 20.8958 7.502 20.6801 7.01398ZM15.8401 15.094L13.1801 17.764C13.0271 17.9131 12.8472 18.0319 12.65 18.114C12.5171 18.1738 12.3751 18.211 12.23 18.224C12.0983 18.254 11.9617 18.254 11.8301 18.224C11.6849 18.211 11.5429 18.1738 11.41 18.114C11.2128 18.0319 11.033 17.9131 10.88 17.764L8.21997 15.094C8.05614 14.9027 7.97063 14.6566 7.98035 14.4049C7.99007 14.1533 8.09437 13.9145 8.27246 13.7364C8.45056 13.5583 8.68924 13.454 8.94092 13.4443C9.19259 13.4346 9.4387 13.5202 9.63 13.684L11.03 15.084V10.474C11.03 10.2088 11.1353 9.95442 11.3229 9.76688C11.5104 9.57934 11.7648 9.474 12.03 9.474C12.2952 9.474 12.5496 9.57934 12.7372 9.76688C12.9247 9.95442 13.03 10.2088 13.03 10.474V15.084L14.4301 13.684C14.6214 13.5202 14.8675 13.4346 15.1191 13.4443C15.3708 13.454 15.6095 13.5583 15.7876 13.7364C15.9657 13.9145 16.07 14.1533 16.0797 14.4049C16.0894 14.6566 16.0039 14.9027 15.8401 15.094ZM16.0601 7.404C15.9174 7.40532 15.7759 7.37836 15.6437 7.32468C15.5115 7.271 15.3913 7.19164 15.2899 7.09122C15.1886 6.9908 15.1081 6.87129 15.0532 6.7396C14.9983 6.60791 14.97 6.46665 14.97 6.32398V3.67399C15.2509 3.82603 15.5215 3.99641 15.78 4.184L18.78 6.91398C18.9456 7.05349 19.0875 7.219 19.2001 7.404H16.0601Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <!-- 导出图标 -->
                        <div class="wc-wp-btn" onclick="wcExportCurrentThemePreset()" title="导出当前主题预设 (JSON)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.65 7.04769C20.25 6.0499 17.53 3.91463 16.76 3.11639C16.0997 2.51248 15.2613 2.13797 14.37 2.04878C14.48 1.93902 8.36996 2.04878 8.20996 2.04878C7.54752 2.02075 6.88617 2.12444 6.26428 2.35386C5.64239 2.58328 5.07236 2.93385 4.58752 3.38512C4.10268 3.83638 3.71274 4.37935 3.44019 4.98244C3.16763 5.58553 3.01797 6.2367 3 6.89803V17.1753C3.0218 17.8358 3.17491 18.4854 3.45044 19.0864C3.72597 19.6874 4.11839 20.2278 4.60498 20.6761C5.09157 21.1245 5.66262 21.472 6.28491 21.6983C6.9072 21.9246 7.56835 22.0254 8.22998 21.9946H15.79C16.4525 22.0226 17.1138 21.9189 17.7357 21.6895C18.3576 21.4601 18.9276 21.1095 19.4125 20.6583C19.8973 20.207 20.2873 19.664 20.5598 19.0609C20.8324 18.4578 20.982 17.8066 21 17.1453V8.59428C20.9939 8.05991 20.8746 7.53284 20.65 7.04769ZM15.8101 14.0322C14.8101 15.0899 13.66 13.1542 13 12.6353V17.2451C13 17.5097 12.8947 17.7635 12.7072 17.9507C12.5196 18.1378 12.2652 18.2429 12 18.2429C11.7348 18.2429 11.4804 18.1378 11.2928 17.9507C11.1053 17.7635 11 17.5097 11 17.2451V12.6353L9.59998 14.0322C8.69998 14.9602 7.25994 13.5233 8.18994 12.6253L10.85 9.97124C11.1567 9.67021 11.5698 9.50148 12 9.50148C12.4302 9.50148 12.8433 9.67021 13.15 9.97124L15.8101 12.6253C15.9038 12.7181 15.9782 12.8285 16.0289 12.9501C16.0797 13.0716 16.1058 13.2021 16.1058 13.3338C16.1058 13.4655 16.0797 13.5959 16.0289 13.7175C15.9782 13.8391 15.9038 13.9494 15.8101 14.0422V14.0322ZM16.03 7.42685C14.36 7.42685 15.0899 4.68294 14.9399 3.72506C16.4848 4.78888 17.898 6.03146 19.15 7.42685H16.03Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <!-- 清空图标 -->
                        <div class="wc-wp-btn reset" onclick="wcClearGlobalCustomCssAndJs()" title="清空 CSS 与脚本">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FF3B30" id="Arrow-Counter-Clockwise-Bold--Streamline-Phosphor" height="20" width="20">
                              <desc>Arrow Counter Clockwise Bold Streamline Icon: https://streamlinehq.com</desc>
                              <path d="M15.84 8.00151875c0.00035625 3.97149375 -3.19084375 7.2060375 -7.1619875 7.25925625h-0.097275c-1.8532375 0.00390625 -3.63691875 -0.70545625 -4.9813 -1.98105 -0.48756875 -0.46046875 -0.29383125 -1.27606875 0.34873125 -1.46808125 0.2982125 -0.0891125 0.6213125 -0.0123625 0.84759375 0.2013375 3.08818125 2.915525 8.17444375 1.39466875 9.15526875 -2.7375375C14.93185625 5.1432375 11.071625 1.49883125 7.00261875 2.71551875c-0.8764625 0.26206875 -1.674 0.737975 -2.320825 1.384875 -0.0094375 0.00943125 -0.01815 0.01814375 -0.0283125 0.02685625L3.27349375 5.38818125h1.2420625c0.67058125 0.00056875 1.08908125 0.72685 0.75329375 1.30730625 -0.15556875 0.2689375 -0.44260625 0.43465625 -0.75329375 0.43491875H1.0311125c-0.48110625 0 -0.8711125 -0.3900125 -0.8711125 -0.8711125V2.77485c0.00056875 -0.67058125 0.72685 -1.08908125 1.30730625 -0.75329375 0.26893125 0.15556875 0.43465 0.44260625 0.4349125 0.75329375v1.50411875l1.55929375 -1.42716875c3.9620625 -3.9407875 10.70438125 -2.11471875 12.13616875 3.286925 0.1611125 0.6078125 0.2425625 1.2339875 0.24231875 1.86279375Z" stroke-width="0.0625"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="wc-ps-card" style="padding: 14px; display: flex; flex-direction: column; gap: 10px;">
                    <!-- 自定义美化卡片内嵌：4个实时预览手机壳 (纯预览、无灵动岛、浅灰细边框、左右横滑) -->
                    <div class="wc-preview-cases-section">
                        <div class="wc-preview-cases-header">
                            <span class="wc-preview-cases-title">实时效果预览</span>
                            <span class="wc-preview-cases-sub">左右滑动切换页面</span>
                        </div>
                        <div class="wc-preview-cases-scroll" id="wcPreviewCasesScroll">
                            <!-- 手机壳 1: 聊天 -->
                            <div class="wc-phone-case-wrapper">
                                <div class="wc-phone-case">
                                    <div class="wc-phone-screen">
                                        <iframe id="wcPreviewIframeChat" class="wc-preview-iframe" tabindex="-1"></iframe>
                                    </div>
                                </div>
                                <div class="wc-phone-label">聊天</div>
                            </div>
                            <!-- 手机壳 2: 通讯录 -->
                            <div class="wc-phone-case-wrapper">
                                <div class="wc-phone-case">
                                    <div class="wc-phone-screen">
                                        <iframe id="wcPreviewIframeContacts" class="wc-preview-iframe" tabindex="-1"></iframe>
                                    </div>
                                </div>
                                <div class="wc-phone-label">通讯录</div>
                            </div>
                            <!-- 手机壳 3: 朋友圈 -->
                            <div class="wc-phone-case-wrapper">
                                <div class="wc-phone-case">
                                    <div class="wc-phone-screen">
                                        <iframe id="wcPreviewIframeMoments" class="wc-preview-iframe" tabindex="-1"></iframe>
                                    </div>
                                </div>
                                <div class="wc-phone-label">朋友圈</div>
                            </div>
                            <!-- 手机壳 4: 我的 -->
                            <div class="wc-phone-case-wrapper">
                                <div class="wc-phone-case">
                                    <div class="wc-phone-screen">
                                        <iframe id="wcPreviewIframeProfile" class="wc-preview-iframe" tabindex="-1"></iframe>
                                    </div>
                                </div>
                                <div class="wc-phone-label">我的</div>
                            </div>
                        </div>
                    </div>

                    <div style="font-size: 12px; font-weight: 600; color: #8E8E93;">自定义 CSS 代码</div>
                    <textarea id="wcGlobalCustomCssInput" class="wc-ps-textarea" style="height: 150px;" placeholder="在此输入应用于整个 WeChat 的全局 CSS 代码..." oninput="wcHandleGlobalCssInput(this.value)" onpaste="wcGuardGlobalCssPaste(event)"></textarea>
                    
                    <div style="font-size: 12px; font-weight: 600; color: #8E8E93; margin-top: 4px;">自定义 JavaScript 脚本</div>
                    <textarea id="wcGlobalCustomJsInput" class="wc-ps-textarea" style="height: 150px;" placeholder="在此输入自定义 JavaScript 脚本代码..." oninput="wcHandleGlobalJsInput(this.value)" onpaste="wcGuardGlobalJsPaste(event)"></textarea>
                    <div class="wc-ps-btn-group" style="margin-top: 6px;">
                        <button class="wc-ps-btn primary" onclick="wcSaveGlobalCustomCssAndJs()">应用美化</button>
                        <button class="wc-ps-btn secondary" onclick="wcSaveGlobalPreset()">保存预设</button>
                    </div>
                </div>

                <input type="file" id="wcThemePresetFileInput" accept=".json,.txt" style="display: none;" onchange="wcHandleThemePresetImportFile(event)">


                <!-- 预设库独立卡片 -->
                <div class="wc-ps-section-title">预设库</div>
                <div class="wc-set-v2-card" onclick="wcOpenGlobalPresetDrawer()" style="cursor: pointer;">
                    <div class="wc-set-v2-row" style="padding: 14px 16px;">
                        <div class="wc-set-v2-row-left">
                            <div class="wc-set-v2-icon-wrap" style="color: #007AFF;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="File-Tray--Streamline-Ionic-Filled" height="22" width="22">
                                  <desc>
                                    File Tray Streamline Icon: https://streamlinehq.com
                                  </desc>
                                  <path fill="#007AFF" d="M47.4843 25.3335 44.1242 9.3934C43.4754 5.9158 40.9764 3.84 37.44 3.84H10.56c-1.7641 0 -3.255 0.4925 -4.4205 1.4637 -1.1655 0.9712 -1.9288 2.3426 -2.2659 4.0834l-3.36 15.9464c-0.0227 0.1141 -0.0339 0.2301 -0.0336 0.3465v11.76c0 1.7823 0.708 3.4914 1.9682 4.7518C3.7085 43.4519 5.4178 44.16 7.2 44.16h33.6c1.7823 0 3.4916 -0.7081 4.7518 -1.9682 1.2601 -1.2604 1.9682 -2.9695 1.9682 -4.7518V25.68c-0.0003 -0.1165 -0.0123 -0.2325 -0.0357 -0.3465Zm-40.32 -15.267v-0.0294c0.3728 -1.9352 1.4501 -2.835 3.3904 -2.835H37.44c1.9541 0 3.0313 0.8977 3.3884 2.8256 0 0.0136 0.0052 0.0273 0.0072 0.0408l2.8277 13.4275c0.0128 0.0612 0.0119 0.1244 -0.0029 0.1852 -0.0147 0.0607 -0.0429 0.1174 -0.0823 0.1659 -0.0394 0.0485 -0.0891 0.0876 -0.1457 0.1143 -0.0564 0.0269 -0.1182 0.0408 -0.1807 0.0407H30.72c-0.443 -0.0023 -0.8687 0.1715 -1.1836 0.4828 -0.3152 0.3115 -0.4936 0.7353 -0.4964 1.1783 0 1.3366 -0.531 2.6186 -1.4762 3.5638 -0.9452 0.9452 -2.2271 1.4761 -3.5638 1.4761s-2.6186 -0.5309 -3.5639 -1.4761c-0.9451 -0.9452 -1.4761 -2.2272 -1.4761 -3.5638 -0.001 -0.2195 -0.0455 -0.4367 -0.1304 -0.6391 -0.085 -0.2024 -0.2092 -0.3861 -0.3651 -0.5405 -0.156 -0.1545 -0.341 -0.2765 -0.5441 -0.3597 -0.2033 -0.0828 -0.4208 -0.1251 -0.6404 -0.1239H4.7483c-0.0626 0.0001 -0.1243 -0.0138 -0.1807 -0.0407 -0.0565 -0.0268 -0.1063 -0.0657 -0.1457 -0.1142 -0.0395 -0.0487 -0.0676 -0.1053 -0.0823 -0.166 -0.0148 -0.0609 -0.0158 -0.124 -0.0029 -0.1852l2.8276 -13.4274Z" stroke-width="1"></path>
                                </svg>
                            </div>
                            <span class="wc-set-v2-label">美化预设库</span>
                        </div>
                        <div class="wc-set-v2-row-right">
                            <svg class="wc-set-v2-arrow" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 微信数据备份与恢复页面 (方形卡片排布) -->
        <div id="page-wechat-chat-manage" class="page" style="background-color: #ffffff; z-index: 130;">
            <div class="wc-backup-header">
                <div class="wc-backup-back" onclick="wcCloseChatManagePage()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wc-backup-title">聊天记录管理</div>
                <div style="width: 32px;"></div>
            </div>

            <div class="wc-backup-content">
                <!-- 上方：导出备份 正方形卡片 -->
                <div class="wc-backup-card square" onclick="wcExportWechatBackup()">
                    <div class="wc-backup-card-icon export">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                        </svg>
                    </div>
                    <div class="wc-backup-card-bottom-info">
                        <div class="wc-backup-card-title">备份数据</div>
                        <div class="wc-backup-card-desc">将当前账号的聊天记录与配置导出为文件</div>
                    </div>
                </div>

                <!-- 下方：恢复数据 正方形卡片 -->
                <div class="wc-backup-card square" onclick="wcTriggerWechatImport()">
                    <div class="wc-backup-card-icon import">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                        </svg>
                    </div>
                    <div class="wc-backup-card-bottom-info">
                        <div class="wc-backup-card-title">恢复数据</div>
                        <div class="wc-backup-card-desc">读取备份文件并恢复至当前账号</div>
                    </div>
                </div>

                <!-- 隐藏的导入文件 input -->
                <input type="file" id="wcBackupFileInput" accept=".json" style="display: none;" onchange="wcHandleWechatImportFile(event)">

                <div class="wc-backup-footer-hint">* 恢复数据将覆盖当前账号记录，请谨慎操作</div>
            </div>
        </div>

        <!-- WeChat 美化预设库半抽屉弹窗 (Bottom Drawer) -->
        <div class="wc-user-drawer-overlay" id="wcGlobalPresetDrawerOverlay" onclick="wcCloseGlobalPresetDrawer()">
            <div class="wc-preset-drawer" onclick="event.stopPropagation()">
                <div class="wc-preset-drawer-header">
                    <div class="wc-preset-drawer-handle"></div>
                    <div class="wc-preset-drawer-title">美化预设库</div>
                </div>
                <div class="wc-preset-drawer-body" id="wcGlobalPresetDrawerList">
                    <!-- 动态渲染预设列表 -->
                </div>
            </div>
        </div>

        <!-- 切换账号抽屉 (半屏 Drawer) -->
        <div class="wc-user-drawer-overlay" id="wcAccountSwitchDrawerOverlay" onclick="wcCloseAccountSwitchDrawer()">
            <div class="wc-user-drawer" onclick="event.stopPropagation()">
                <div class="wc-user-drawer-header">
                    <div class="wc-user-drawer-handle"></div>
                    <div class="wc-user-drawer-title">切换账号</div>
                </div>
                <div class="wc-user-drawer-body" id="wcAccountSwitchDrawerList">
                    <!-- 动态渲染已注册的账号列表 -->
                </div>
            </div>
        </div>

        <style>
            #wechatAppUI #page-group-chat { background: var(--bg-color, #fff); animation: none; }
            #wechatAppUI #page-group-chat [hidden], #wechatAppUI #wcGroupPanel[hidden] { display: none !important; }
            #wechatAppUI .wc-group-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; }
            #wechatAppUI .wc-group-list-item .chat-info { flex: 1; min-width: 0; }
            #wechatAppUI .wc-group-list-item .chat-name-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
            #wechatAppUI .wc-group-list-item .name { font-size: 16px; font-weight: 500; color: var(--text-main, #000); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI .wc-group-list-item .time { font-size: 12px; color: #8e8e93; flex-shrink: 0; }
            #wechatAppUI .wc-group-list-item .msg { font-size: 14px; color: #8e8e93; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI .wc-group-list-wrapper { background: transparent; }
            #wechatAppUI .wc-group-list-wrapper .wc-group-list-item { gap: 0; }
            #wechatAppUI .wc-group-list-wrapper .wc-group-avatar { margin-right: 12px; }
            #wechatAppUI .wc-group-list-wrapper .wc-group-chat-pin-mark {
                position: absolute; z-index: 2; right: 6px; top: 6px;
                width: 12px; height: 12px; color: #c7c7cc; transform: rotate(45deg);
            }
            #wechatAppUI .wc-group-list-wrapper .wc-group-chat-pin-mark svg { display: block; width: 12px; height: 12px; fill: currentColor; }
            #wechatAppUI .wc-group-contact-section { margin: 0; }
            #wechatAppUI .wc-group-contact-card { display: flex; align-items: center; gap: 12px; cursor: pointer; }
            #wechatAppUI .wc-group-contact-card .wc-group-contact-avatar { flex: 0 0 48px; }
            #wechatAppUI .wc-group-contact-card .info-wrapper { flex: 1; min-width: 0; }
            #wechatAppUI .wc-group-contact-card .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

            /* Emoji-group cover layout: fixed square collage, independently cropped cells. */
            #wechatAppUI .wc-group-avatar { position: relative; display: block; width: 48px; height: 48px; min-width: 48px; flex: 0 0 48px; box-sizing: border-box; border-radius: 15px; background-size: cover; background-position: center; overflow: visible; }
            #wechatAppUI .wc-group-avatar-grid { display: grid; width: 100%; height: 100%; box-sizing: border-box; padding: 3px; gap: 2px; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); background: #f2f2f7; border-radius: inherit; overflow: hidden; }
            #wechatAppUI .wc-group-avatar-grid[data-count="1"] { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); }
            #wechatAppUI .wc-group-avatar-grid[data-count="2"] { grid-template-rows: minmax(0, 1fr); }
            #wechatAppUI .wc-group-avatar-grid[data-count="3"] > .wc-group-avatar-cell:first-child { grid-row: span 2; }
            #wechatAppUI .wc-group-avatar-cell { display: block; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; min-height: 0; border-radius: 4px; background-color: #e5e5ea; background-position: center; background-size: cover; background-repeat: no-repeat; overflow: hidden; }
            #wechatAppUI .wc-group-avatar-cell svg { display: block; width: 100%; height: 100%; max-width: 100%; max-height: 100%; }
            #wechatAppUI #wcGroupRoomAvatar { width: 34px; height: 34px; margin-right: 8px; flex-shrink: 0; }
            #wechatAppUI #wcGroupRoomAvatar > .avatar { width: 34px; height: 34px; min-width: 34px; flex: 0 0 34px; border-radius: 12px; margin: 0; }
            #wechatAppUI #wcGroupRoomName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI #wcGroupMessages { padding-top: calc(var(--wechat-top-inset, 45px) + 96px); padding-bottom: calc(155px + max(0px, var(--keyboard-inset-bottom, 0px)) + var(--wechat-keyboard-content-extra-offset, 0px)); }
            /* Keep the original private-chat avatar/bubble rhythm. The group-only name
               and QQ title labels occupy a small line above the same 18px bubble. */
            #wechatAppUI #wcGroupMessages .message-row { margin-bottom: 14px; align-items: flex-start; }
            #wechatAppUI #wcGroupMessages .message-row .msg-avatar {
                display: block; width: 40px; height: 40px; min-width: 40px; flex: 0 0 40px;
                border-radius: 50%; margin: 18px 8px 0; background-size: cover;
                background-position: center; overflow: visible;
            }
            #wechatAppUI #wcGroupMessages .wc-msg-body {
                position: relative; gap: 0; min-width: 0; max-width: calc(100% - 56px);
                align-items: flex-start;
            }
            #wechatAppUI #wcGroupMessages .message-row.sent .wc-msg-body { align-items: flex-end; }
            #wechatAppUI #wcGroupMessages .message-bubble {
                display: flex; position: relative; box-sizing: border-box; min-height: 36px;
                max-width: 100%; padding: 8px 14px; border-radius: 18px;
                margin-bottom: 18px; cursor: pointer; align-items: flex-start;
                box-shadow: none;
            }
            #wechatAppUI #wcGroupMessages .msg-text {
                font-size: 16px; line-height: 1.4; font-weight: 700;
                white-space: pre-wrap; overflow-wrap: anywhere;
            }
            #wechatAppUI .wc-group-speaker, #wechatAppUI .wc-group-message-time { font-size: 11px; color: #8e8e93; }
            #wechatAppUI #wcGroupMessages .wc-group-message-time {
                position: absolute; bottom: -18px; margin: 0; width: auto;
                color: #8e8e93; font-size: 11px; line-height: 14px;
                white-space: nowrap; pointer-events: none;
            }
            #wechatAppUI #wcGroupMessages .message-bubble.sent .wc-group-message-time { right: 4px; }
            #wechatAppUI #wcGroupMessages .message-bubble.received .wc-group-message-time { left: 4px; }
            /* Media bubbles share the private-chat content and retain group quote/time placement. */
            #wechatAppUI #page-group-chat #wcGroupMessages .message-bubble.wc-image-message-bubble {
                background: transparent !important; padding: 0 !important; border: 0 !important; box-shadow: none !important;
            }
            #wechatAppUI #page-group-chat #wcGroupMessages .wc-image-message-bubble::before { display: none !important; }

            #wechatAppUI #wcGroupMessages .wc-voice-message-bubble,
            #wechatAppUI #wcGroupMessages .wc-image-message-bubble { flex-direction: column; }
            #wechatAppUI #wcGroupMessages .wc-image-message-bubble .wc-bubble-reply { margin-bottom: 8px; }
            #wechatAppUI .wc-group-message-image { max-width: 220px; max-height: 260px; border-radius: 12px; object-fit: contain; }
            #wechatAppUI #wcGroupAnnouncement { position: absolute; z-index: 10; top: calc(var(--wechat-top-inset, 45px) + 56px); left: 16px; right: 16px; border: 0; border-radius: 12px; padding: 8px 12px; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text-sub, #666); font: inherit; font-size: 12px; }
            /* Group composer shares the original single-chat footer capsule dimensions. */
            #wechatAppUI #page-group-chat .wc-group-footer {
                position: absolute; z-index: 100; left: 16px; right: 16px; width: auto;
                bottom: calc(26px + env(safe-area-inset-bottom, 0px) + max(0px, var(--keyboard-inset-bottom, 0px) + var(--wechat-keyboard-user-offset, 0px)));
                height: 52px; min-height: 52px; box-sizing: border-box;
                display: flex; align-items: center; gap: 12px;
                padding: 0 6px 0 16px; border-radius: 26px;
            }
            #wechatAppUI #page-group-chat .wc-group-compose { display: contents; }
            #wechatAppUI #page-group-chat #wcGroupInput {
                order: 2; flex: 1 1 0; min-width: 0; width: 100%; height: 100%;
                border: 0; border-radius: 0; outline: none; box-shadow: none;
                background: transparent; color: var(--text-main, #000);
                padding: 0; font: inherit; font-size: 16px; font-weight: 600;
            }
            #wechatAppUI #page-group-chat #wcGroupInput::placeholder { color: var(--text-sub, #8e8e93); }
            #wechatAppUI #page-group-chat .wc-group-more-toggle {
                order: 3; flex: 0 0 26px; display: flex; align-items: center;
                justify-content: center; width: 26px; height: 30px; margin: 0; padding: 0;
                border: 0; border-radius: 0; background: transparent;
                color: var(--text-sub, #8e8e93); cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-more-toggle svg {
                display: block; width: 26px; height: 26px; fill: none;
                stroke: currentColor; stroke-width: 2;
                stroke-linecap: round; stroke-linejoin: round;
            }
            #wechatAppUI #page-group-chat.wc-group-tools-open .wc-group-footer {
                transform: translateY(-290px);
            }
            #wechatAppUI #page-group-chat .wc-group-footer { transition: transform .3s cubic-bezier(.32,.72,0,1); }
            #wechatAppUI #page-group-chat #wcGroupSend.room-send-btn {
                order: 4; flex: 0 0 40px; width: 40px; height: 40px;
                border: 0; padding: 0; border-radius: 50%;
                background-color: var(--tg-blue, #3390ec); color: #fff;
                box-shadow: 0 2px 8px rgba(51,144,236,.3);
            }
            #wechatAppUI #page-group-chat #wcGroupSend svg {
                position: static; width: 20px; height: 20px;
                fill: currentColor; margin: 0;
            }
            /* Match the private-chat active quote: blur the room and lift its original bubble. */
            #wechatAppUI #page-group-chat #wcGroupReplyOverlay { z-index: 95; }
            #wechatAppUI #page-group-chat #wcGroupReplyFloatBubbleBox {
                z-index: 105; pointer-events: none;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-row {
                display: flex; align-items: flex-start; margin-bottom: 0;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-row.sent { justify-content: flex-end; }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .msg-avatar {
                display: block; width: 40px; height: 40px; min-width: 40px;
                flex: 0 0 40px; border-radius: 50%; margin: 18px 8px 0;
                background-size: cover; background-position: center;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .wc-msg-body {
                position: relative; gap: 0; min-width: 0; max-width: calc(100% - 56px);
                align-items: flex-start;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-row.sent .wc-msg-body { align-items: flex-end; }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-bubble {
                display: flex; position: relative; box-sizing: border-box; min-height: 36px;
                max-width: 100%; padding: 8px 14px; border-radius: 18px;
                margin-bottom: 18px; align-items: flex-start; box-shadow: none;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .msg-text {
                font-size: 16px; line-height: 1.4; font-weight: 700;
                white-space: pre-wrap; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .wc-group-speaker,
            #wechatAppUI #wcGroupReplyFloatBubbleBox .wc-group-message-time {
                font-size: 11px; color: #8e8e93;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .wc-group-message-time {
                position: absolute; bottom: -18px; margin: 0; width: auto;
                white-space: nowrap; pointer-events: none;
            }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-bubble.sent .wc-group-message-time { right: 4px; }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .message-bubble.received .wc-group-message-time { left: 4px; }
            #wechatAppUI #wcGroupReplyFloatBubbleBox .wc-group-message-image {
                max-width: 220px; max-height: 260px; border-radius: 12px; object-fit: contain;
            }
            /* Recalled group messages use the same neutral, tappable pill as private chat. */
            #wechatAppUI #wcGroupMessages .wc-group-recalled-row {
                display: flex; justify-content: center; align-items: center;
                position: relative; width: 100%; margin: 12px 0;
            }
            #wechatAppUI #wcGroupMessages .wc-group-recalled-row .wc-recalled-bubble {
                background: #f3f3f3; color: #8e8e93; font-size: 12.5px;
                padding: 5px 14px; border-radius: 12px; max-width: 85%;
                text-align: center; overflow-wrap: anywhere; cursor: pointer;
                user-select: none; -webkit-user-select: none;
            }
            #wechatAppUI #page-group-chat #wcGroupDropdownMenu { z-index: 210; }
            #wechatAppUI #wcGroupMessages { padding-bottom: calc(105px + max(0px, var(--keyboard-inset-bottom, 0px)) + var(--wechat-keyboard-content-extra-offset, 0px)); }
            #wechatAppUI #page-group-chat .message-bubble.sent { background-color: var(--wcg-sent-bg, #000); color: var(--wcg-sent-fg, #fff); }
            #wechatAppUI #page-group-chat .message-bubble.sent .msg-text { color: var(--wcg-sent-fg, #fff); }
            #wechatAppUI #page-group-chat .message-bubble.received { background-color: var(--wcg-recv-bg, #f2f2f7); color: var(--wcg-recv-fg, #000); }
            #wechatAppUI #page-group-chat .message-bubble.received .msg-text { color: var(--wcg-recv-fg, #000); }
            /* Reuse the single-chat wc-function-panel sheet, grid, spacing and type. */
            #wechatAppUI #page-group-chat .wc-group-more-panel {
                z-index: 105; box-sizing: border-box;
            }
            #wechatAppUI #page-group-chat .wc-group-more-item {
                border: 0; padding: 0; margin: 0; background: transparent;
                font: inherit; min-width: 0; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-more-item .wc-function-icon svg {
                width: 28px; height: 28px; fill: currentColor; stroke: none;
            }
            #wechatAppUI #page-group-chat .wc-group-more-item .wc-function-text {
                font-size: 11px; line-height: 1.35; color: #8e8e93;
            }
            #wechatAppUI #page-group-chat .wc-group-more-item .wc-group-stop-icon { display: none; }
            #wechatAppUI #page-group-chat .wc-group-more-item.is-generating .wc-group-play-icon { display: none; }
            #wechatAppUI #page-group-chat .wc-group-more-item.is-generating .wc-group-stop-icon { display: block; }
            #wechatAppUI #page-group-chat .wc-group-more-item:disabled { opacity: .4; }
            #wechatAppUI #page-group-chat .wc-group-more-item:focus-visible { outline: 2px solid #007aff; border-radius: 8px; }
            #wechatAppUI #page-group-chat.wc-group-tools-open #wcGroupMessages {
                padding-bottom: calc(380px + max(0px, var(--keyboard-inset-bottom, 0px)));
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-more-item .wc-function-icon { color: #f5f5f7; }
            /* QQ-inspired compact role/exclusive-title labels: distinct identity colours. */
            #wechatAppUI #page-group-chat .wc-group-speaker {
                display: flex; align-items: center; flex-wrap: wrap;
                gap: 4px 6px; max-width: 100%; min-width: 0;
                margin: 0 0 5px; min-height: 13px; line-height: 1.3;
            }
            #wechatAppUI #page-group-chat .message-row.sent .wc-group-speaker { justify-content: flex-end; }
            #wechatAppUI #page-group-chat .wc-group-speaker-name {
                min-width: 0; max-width: 100%; color: #8e8e93; font-size: 11px;
                font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            #wechatAppUI .wc-group-title-tag {
                display: inline-flex; align-items: center; justify-content: center;
                max-width: 115px; padding: 2px 5px; flex: 0 1 auto;
                box-sizing: border-box; border-radius: 4px;
                font-size: 10px; line-height: 1.25; font-weight: 600;
                letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                background: #f0edff; color: #8755c7;
            }
            #wechatAppUI .wc-group-title-tag[data-kind="owner"] { background: #fff0db; color: #ce7a22; }
            #wechatAppUI .wc-group-title-tag[data-kind="admin"] { background: #e8f1ff; color: #4285d4; }
            #wechatAppUI .wc-group-title-tag[data-kind="special"] { background: #f1eaff; color: #9256c6; }
            #wechatAppUI .wc-group-title-tag[data-kind="essential"] { background: #fff0ec; color: #d97845; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-title-preview {
                display: flex; justify-content: center; align-items: center;
                gap: 6px; flex-wrap: wrap; padding-top: 1px; min-height: 20px;
            }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-title-help {
                font-size: 12px; color: #8e8e93; line-height: 1.5;
                padding: 8px 0 2px; margin: 0;
            }

            /* Emoji drawer exactly inherits single-chat wc-emoji-panel and capsule/search grid styles. */
            #wechatAppUI #page-group-chat .wc-group-emoji-toggle {
                order: 1; display: flex; align-items: center; justify-content: center;
                flex: 0 0 26px; width: 26px; height: 30px; border: 0;
                background: transparent; padding: 0; margin: 0;
                color: var(--text-sub, #8e8e93); cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-emoji-toggle svg {
                display: block; width: 26px; height: 26px; fill: currentColor; stroke: none;
            }
            /* Use precisely the original private-chat toolbar SVG glyphs. */
            #wechatAppUI #page-group-chat .wc-group-more-toggle .tool-icon,
            #wechatAppUI #page-group-chat .wc-group-emoji-toggle .tool-icon { width: 26px; height: 26px; flex-shrink: 0; }
            #wechatAppUI #page-group-chat #wcGroupSend .wc-stop-icon {
                position: absolute; width: 20px; height: 20px;
                opacity: 0; pointer-events: none;
            }

            #wechatAppUI #page-group-chat.wc-group-emoji-open .wc-group-footer {
                transform: translateY(-266px);
            }
            #wechatAppUI #page-group-chat.wc-group-emoji-open #wcGroupMessages {
                padding-bottom: calc(366px + max(0px, var(--keyboard-inset-bottom, 0px)));
            }
            #wechatAppUI #page-group-chat .wc-group-emoji-panel .wc-chat-emoji-item {
                min-width: 0; padding: 0; border: 0; font: inherit; background: transparent;
                cursor: pointer; color: inherit;
            }
            #wechatAppUI #page-group-chat .wc-group-emoji-panel #wcGroupEmojiPanelContent.wc-group-emoji-grid {
                display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 20px 12px; padding: 16px; box-sizing: border-box;
                overflow-y: auto; align-items: start; justify-items: center; align-content: start;
            }
            #wechatAppUI #page-group-chat .wc-group-emoji-panel .wc-capsule-item { border: 0; }
            #wechatAppUI #page-group-chat .wc-group-emoji-panel .wc-cancel-btn { border: 0; background: transparent; }
            #wechatAppUI #page-group-chat .wc-group-emoji-panel .wc-panel-content { letter-spacing: 0; }
            /* Mirror the private-chat z-index: the held bubble remains above the dimmer. */
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay { z-index: 1000; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-container { width: 260px; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-emoji {
                padding: 0; border: 0; background: transparent; line-height: 1.2; font: inherit;
                font-size: 20px; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-more {
                border: 0; padding: 0; color: #fff; font-size: 20px; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay #wcGroupBubbleEmojiCapsule.expanded #wcGroupBubbleExpand { display: none; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay #wcGroupBubbleEmojiCapsule.expanded #wcGroupBubbleCollapse {
                display: flex; position: absolute; bottom: 12px; right: 12px;
            }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-emoji:focus-visible,
            #wechatAppUI #page-group-chat .wc-group-emoji-panel button:focus-visible { outline: 2px solid #007aff; outline-offset: 2px; }

            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item {
                box-sizing: border-box; border: 0; width: 100%; background: transparent;
                font: inherit; text-align: left; padding: 10px 16px; gap: 12px;
                font-size: 14px; color: #000; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item[hidden] { display: none !important; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item:active { background: #f2f2f7; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item .wc-group-bubble-menu-icon { flex: 0 0 18px; height: 18px; }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item svg {
                display: block; width: 18px; height: 18px; fill: currentColor; stroke: none;
            }
            /* Keep the exact source markup of single-chat line icons; restore
               its fill:none/stroke paint rather than using the filled group default. */
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-group-bubble-menu-icon[data-wcg-icon-render="line"] svg {
                fill: none; stroke: currentColor; stroke-width: 2;
                stroke-linecap: round; stroke-linejoin: round;
            }
            #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-action-menu {
                max-height: min(52vh, 365px); overflow-y: auto; overscroll-behavior: contain;
            }
            #wechatAppUI #page-group-chat .wc-group-reaction-badges {
                display: flex; gap: 3px; align-items: center; flex-wrap: wrap; margin-top: 4px;
            }
            #wechatAppUI #page-group-chat .wc-group-reaction-badges button {
                border: 1px solid rgba(142,142,147,.2); border-radius: 12px; padding: 2px 6px;
                font-size: 12px; background: #fff; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .message-bubble.wc-group-sticker-bubble {
                background: transparent !important; border: 0; box-shadow: none;
                padding: 2px; max-width: 192px;
            }
            #wechatAppUI #page-group-chat .wc-group-sticker-bubble .msg-text { display: none; }
            #wechatAppUI #page-group-chat .wc-group-sticker-bubble .wc-group-message-image {
                display: block; max-width: 180px; max-height: 180px;
                width: auto; height: auto; object-fit: contain; border-radius: 5px;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-action-menu,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-emojis-capsule {
                background: #29292d; color: #f5f5f7;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-bubble-menu-overlay .wc-bubble-menu-item { color: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-emoji-panel { background: rgba(34,34,37,.95); }

            /* Group translation keeps the original message in the bubble and only the
               translated text in the separate in-bubble translation card. */


            /* Activity creation uses the existing full-height iOS group settings sheet. */
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) {
                align-items: stretch; background: var(--wcg-bg, #fff);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-sheet {
                height: 100%; max-height: none; border-radius: 0; box-shadow: none;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-header {
                height: calc(var(--wechat-top-inset, 45px) + 44px); min-height: 0;
                padding: var(--wechat-top-inset, 45px) 16px 0; border-bottom: 0;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-header strong {
                top: calc(var(--wechat-top-inset, 45px) + 22px); font-size: 17px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-back { display: flex; }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-close { display: none; }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) #wcGroupPanelBody {
                background: var(--wcg-bg, #fff); padding: 10px 20px calc(44px + var(--keyboard-inset-bottom, 0px) + env(safe-area-inset-bottom, 0px));
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-setting-card {
                display: flex; flex-direction: column; border-radius: 0; background: transparent;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-field {
                display: flex; justify-content: space-between; flex-direction: column;
                gap: 8px; padding: 14px 0; border-bottom: .5px solid var(--wcg-line, #e5e5ea);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-field > span {
                font-size: 15px; font-weight: 600; color: var(--wcg-ink, #000);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-field > :is(input,textarea,select) {
                box-sizing: border-box; width: 100%; max-width: 100%; min-width: 0;
                background: var(--wcg-soft, #f8f8fa); color: var(--wcg-ink, #000);
                border: 0; border-radius: 10px; padding: 11px 12px; font-size: 14px;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-check {
                display: flex; flex-direction: row-reverse; justify-content: space-between;
                padding: 14px 0; border-bottom: .5px solid var(--wcg-line, #e5e5ea);
                color: var(--wcg-ink, #000); font-size: 15px;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"], [data-view="create-redpacket"]) .wc-group-panel-save {
                background: var(--wcg-soft, #f2f2f7); color: var(--wcg-ink, #000); border-radius: 14px;
            }

            /* Group red packet scheme 1: scoped to the existing WeChat group UI. */
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] { background: #f5f5f6; }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-panel-sheet { background: #f5f5f6; }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-panel-header {
                background: #fff; border-bottom: 1px solid #ececee;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] #wcGroupPanelBody {
                display: flex; flex-direction: column; padding: 0; overflow: hidden; background: #f5f5f6;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-panel-save { display: none !important; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-compose {
                display: flex; flex-direction: column; flex: 1; min-height: 0; width: 100%;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
                color: #29292d;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-fields {
                flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch; padding: 20px 16px 12px;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-segment {
                display: flex; align-items: center; gap: 3px; padding: 4px; margin-bottom: 19px;
                border: 1px solid #dedee2; border-radius: 8px; background: #e9e9ed;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-segment button {
                flex: 1; min-width: 0; height: 34px; padding: 0 4px; border: 0; border-radius: 5px;
                background: transparent; color: #86868c; font-size: 12px; font-weight: 650; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-segment button.is-active {
                background: #fff; color: #2f3035; box-shadow: 0 1px 4px rgba(0,0,0,.12);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-field {
                display: flex; align-items: center; gap: 10px; box-sizing: border-box;
                min-height: 70px; margin: 0 0 10px; padding: 13px 12px;
                border: 1px solid #e6e6e9; border-radius: 9px; background: #fff;
                box-shadow: 0 1px 2px rgba(22,22,29,.025);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-field:focus-within {
                border-color: #d5b0a7; box-shadow: 0 0 0 2px rgba(213,176,167,.16);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-field-label { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 5px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-field-label strong { font-size: 13px; font-weight: 700; color: #26262a; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-field-label small { font-size: 10px; font-weight: 400; color: #99999d; line-height: 1.4; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-entry { display: flex; flex: 0 0 auto; align-items: center; gap: 6px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-entry input {
                box-sizing: border-box; width: 88px; min-width: 0; padding: 0; border: 0; outline: 0;
                background: transparent; color: #29292d; text-align: right; font: 700 19px/1.3 -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-entry > span { font-size: 12px; color: #99999d; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-wish { flex-direction: column; align-items: stretch; gap: 9px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-wish input {
                box-sizing: border-box; width: 100%; padding: 0; border: 0; outline: 0;
                color: #45454a; background: transparent; font-size: 13px; font-weight: 500;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-note {
                margin: 11px 3px 0; color: #99999d; font-size: 11px; line-height: 1.65;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-total { margin: 23px 0 14px; text-align: center; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-total > span { display: block; color: #99999d; font-size: 11px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-total strong {
                display: block; margin-top: 5px; font-size: 33px; font-weight: 780; letter-spacing: -.8px;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-total strong small { font-size: 18px; font-weight: 600; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-actions {
                flex: 0 0 auto; padding: 9px 17px calc(15px + env(safe-area-inset-bottom, 0px));
                background: #f5f5f6; text-align: center;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-actions button {
                display: block; width: 100%; height: 46px; border: 0; border-radius: 9px;
                background: #d45c49; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-actions button:disabled { opacity: .55; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-actions > small {
                display: block; margin-top: 9px; color: #99999d; font-size: 10px;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-bubble:has(.wc-group-redpacket-card) {
                min-width: 0; max-width: min(258px, 76vw); padding: 0; border-radius: 6px;
                background: transparent; box-shadow: none; overflow: visible;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card {
                position: relative; display: block; box-sizing: border-box; width: min(238px, 70vw);
                margin: 0; padding: 0; border: 0; border-radius: 6px; background: #ff9c35;
                color: #fff; text-align: left; cursor: pointer; overflow: visible;
                box-shadow: 0 2px 5px rgba(180,110,32,.13);
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card::before {
                content: ""; position: absolute; top: 13px; left: -6px; width: 0; height: 0;
                border-top: 7px solid transparent; border-bottom: 7px solid transparent;
                border-right: 7px solid #ff9c35;
            }
            #wechatAppUI #page-group-chat .message-row.sent .wc-group-redpacket-card::before {
                left: auto; right: -6px; border-right: 0; border-left: 7px solid #ff9c35;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-header {
                display: flex; align-items: center; gap: 10px; padding: 9px 12px 2px; min-height: 55px;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-emblem {
                display: grid; place-items: center; flex: 0 0 38px; width: 38px; height: 43px;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-emblem svg { display: block; width: 38px; height: 43px; }
            #wechatAppUI #page-group-chat .wc-group-redpacket-header strong {
                flex: 1; min-width: 0; color: #fff; font-size: 14px; font-weight: 640; line-height: 1.4;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-footer {
                display: block; padding: 4px 12px 10px; color: #ffefd8; font-size: 11px; line-height: 1.3;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used {
                background: #c88c82;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used::before { border-right-color: #c88c82; }
            #wechatAppUI #page-group-chat .message-row.sent .wc-group-redpacket-card.is-used::before { border-left-color: #c88c82; }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card:focus-visible,
            #wechatAppUI #wcGroupPanel .wcg-redpacket-segment button:focus-visible,
            #wechatAppUI #wcGroupPanel .wcg-redpacket-outside-close:focus-visible,
            #wechatAppUI #wcGroupPanel .wcg-redpacket-coin:focus-visible {
                outline: 2px solid #c48b58; outline-offset: 2px;
            }

            /* Opening stage reuses the existing group panel and wallet claim transaction. */
            #wechatAppUI #wcGroupPanel[data-view="redpacket-open"] {
                align-items: center; justify-content: center; background: rgba(247,247,247,.88);
                -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
            }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-open"] .wc-group-panel-sheet {
                display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;
                max-height: none; border: 0; border-radius: 0; background: transparent; box-shadow: none;
            }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-open"] .wc-group-panel-header { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-open"] #wcGroupPanelBody {
                display: flex; justify-content: center; align-items: center; width: 100%; padding: 0 15px;
                overflow: hidden; background: transparent;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-open-stage {
                display: flex; flex-direction: column; align-items: center; gap: 32px; width: min(260px, 78vw);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-envelope {
                position: relative; box-sizing: border-box; overflow: hidden; width: 100%;
                height: min(403px, 64dvh); min-height: 280px; border-radius: 11px;
                background: #f65043; color: #ffe0b1;
                box-shadow: 0 7px 22px rgba(203,129,118,.25);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-flap {
                position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 78%;
                border-radius: 0 0 50% 50% / 0 0 7% 7%;
                background: #f6584b; box-shadow: 0 4px 6px rgba(169,45,35,.25);
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-sender {
                position: absolute; z-index: 2; top: 25%; left: 0; right: 0;
                display: flex; justify-content: center; align-items: center; gap: 9px; font-size: 13px;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-sender-photo {
                display: block; width: 24px; height: 24px; border-radius: 5px;
                background-position: center; background-size: cover; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-sender-photo svg { width: 100%; height: 100%; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-greeting {
                position: absolute; z-index: 2; top: 36%; left: 9px; right: 9px;
                text-align: center; font-size: 20px; font-weight: 500; line-height: 1.5; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-coin {
                position: absolute; z-index: 3; top: 70%; left: 50%; transform: translateX(-50%);
                display: grid; place-items: center; width: 80px; height: 80px; padding: 0;
                border: 1px solid #e6c48b; border-radius: 50%; background: #ead09e;
                color: #5f5140; font-family: "Songti SC", serif; font-size: 33px; font-weight: 650;
                box-shadow: 0 3px 2px rgba(155,63,44,.38); cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-coin:disabled { opacity: .6; cursor: default; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-outside-close {
                flex: 0 0 41px; display: grid; place-items: center; width: 41px; height: 41px;
                padding: 0; border: 2px solid #d2a65c; border-radius: 50%;
                background: rgba(255,255,255,.15); color: #d2a65c; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-outside-close svg { display: block; width: 20px; height: 20px; }

            /* Receipt is a centered dialog. Its footer stays inside while claims scroll. */
            #wechatAppUI #wcGroupPanel[data-view="redpacket-detail"] {
                align-items: center; justify-content: center; padding: 14px;
                background: rgba(31,23,20,.64);
            }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-detail"] .wc-group-panel-sheet {
                width: min(340px, 100%); height: min(515px, 83dvh); max-height: none;
                border-radius: 18px; background: #f5f5f5;
                box-shadow: 0 18px 35px rgba(0,0,0,.27);
            }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-detail"] .wc-group-panel-header { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="redpacket-detail"] #wcGroupPanelBody {
                display: flex; flex: 1; min-height: 0; padding: 0; overflow: hidden; background: #f5f5f5;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-card {
                display: flex; flex-direction: column; width: 100%; min-height: 0; color: #252528;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-hero {
                flex: 0 0 auto; padding: 18px 15px 25px; background: #d45c49;
                border-radius: 0 0 48% 48% / 0 0 14px 14px; color: #ffe5bd; text-align: center;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-kicker { margin-bottom: 20px; font-size: 11px; opacity: .76; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-sender { font-size: 14px; font-weight: 700; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-greeting { margin-top: 8px; font-size: 12px; opacity: .85; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-scroll {
                flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-receipt { padding: 24px 10px 22px; text-align: center; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-receipt > strong { font-size: 38px; font-weight: 800; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-receipt > strong span { margin-left: 5px; font-size: 14px; font-weight: 500; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-receipt > strong.wcg-redpacket-not-received { font-size: 22px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-receipt > small { display: block; margin-top: 7px; color: #959595; font-size: 11px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-head {
                padding: 11px 14px; border-top: 1px solid #e8e8e8; color: #959595; font-size: 11px;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-row {
                display: flex; align-items: center; gap: 10px; padding: 11px 13px;
                border-bottom: 1px solid #ebebeb; background: #fff;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-photo {
                display: block; flex: 0 0 31px; width: 31px; height: 31px; border-radius: 9px;
                background-size: cover; background-position: center; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-photo svg { display: block; width: 100%; height: 100%; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-info { display: flex; flex-direction: column; flex: 1; min-width: 0; gap: 4px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-info strong {
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 650;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-info small { color: #959595; font-size: 10px; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-money { text-align: right; white-space: nowrap; font-size: 12px; font-weight: 650; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-money small { display: block; margin-top: 4px; color: #bd8d4e; font-size: 10px; font-weight: 500; }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-claim-empty,
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-note {
                padding: 16px 14px; color: #959595; font-size: 11px; line-height: 1.5;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-footer {
                flex: 0 0 auto; padding: 11px 13px calc(13px + env(safe-area-inset-bottom, 0px));
                border-top: 1px solid #ededed; background: #fff;
            }
            #wechatAppUI #wcGroupPanel .wcg-redpacket-detail-footer button {
                display: block; width: 100%; height: 40px; border: 1px solid #ebebed;
                border-radius: 8px; background: #f7f7f8; color: #55555b; font-size: 13px; font-weight: 650;
                cursor: pointer;
            }
            @media (prefers-reduced-motion: reduce) {
                #wechatAppUI #wcGroupPanel .wcg-redpacket-coin,
                #wechatAppUI #wcGroupPanel .wcg-redpacket-segment button { transition: none; }
            }
            /* WeChat-style received packet: warm faded red, not gray-blue or gold. */
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used {
                background: #c88c82; filter: none;
                box-shadow: 0 2px 5px rgba(149,69,63,.11);
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used::before { border-right-color: #c88c82; }
            #wechatAppUI #page-group-chat .message-row.sent .wc-group-redpacket-card.is-used::before { border-left-color: #c88c82; }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used .wc-group-redpacket-emblem {
                filter: saturate(.60); opacity: .9;
            }
            #wechatAppUI #page-group-chat .wc-group-redpacket-card.is-used .wc-group-redpacket-footer { color: #f7e7e4; }

            /* Share the private-chat multi-select capsules and action styling. */
            #wechatAppUI #page-group-chat.group-selecting > .chat-header-container { visibility: hidden; }
            #wechatAppUI #page-group-chat.group-selecting .wc-group-footer { display: none !important; }
            #wechatAppUI #page-group-chat .wcg-batch-header[hidden],
            #wechatAppUI #page-group-chat .wcg-batch-bar[hidden] { display: none !important; }
            #wechatAppUI #page-group-chat .wcg-batch-header .title { margin: 0; }
            #wechatAppUI #page-group-chat .wcg-batch-header .cancel-btn {
                border: 0; background: transparent; padding: 0;
                font-family: inherit; line-height: normal;
            }
            #wechatAppUI #page-group-chat .wcg-batch-bar {
                bottom: calc(24px + env(safe-area-inset-bottom, 0px));
                gap: 36px; min-width: 0; padding: 6px 28px;
                background: #fff; border: .5px solid rgba(0,0,0,.08);
                box-shadow: 0 4px 20px rgba(0,0,0,.12);
            }
            #wechatAppUI #page-group-chat .wcg-batch-bar button {
                border: 0; padding: 0; background: transparent;
                font-family: inherit;
            }
            #wechatAppUI #page-group-chat .wcg-batch-bar button:disabled {
                opacity: .35; cursor: default;
            }
            #wechatAppUI #page-group-chat .wcg-batch-bar button:focus-visible,
            #wechatAppUI #page-group-chat .wcg-batch-header button:focus-visible {
                outline: 2px solid #07c160; outline-offset: 3px;
            }
            #wechatAppUI #page-group-chat .wcg-selectable-message {
                display: flex; align-items: center; box-sizing: border-box; gap: 7px; width: 100%;
                padding: 3px 13px 3px 8px; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wcg-selectable-message > .message-row,
            #wechatAppUI #page-group-chat .wcg-selectable-message > .wcg-inline-card { flex: 1; min-width: 0; }
            #wechatAppUI #page-group-chat .wcg-select-message-check {
                display: grid; place-items: center; flex: 0 0 25px; width: 25px; height: 25px;
                padding: 0; border: 1.5px solid #c8cbd2; border-radius: 50%;
                background: #fff; color: transparent; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wcg-select-message-check svg { width: 16px; height: 16px; }
            #wechatAppUI #page-group-chat .wcg-selectable-message.is-selected .wcg-select-message-check {
                background: #07c160; border-color: #07c160; color: #fff;
            }
            #wechatAppUI #page-group-chat .wcg-selectable-message.is-selected :is(.message-bubble, .wcg-invite-card) {
                outline: 2px solid rgba(7,193,96,.22); outline-offset: 2px;
            }
            #wechatAppUI #page-group-chat.group-selecting #wcGroupMessages { padding-bottom: calc(105px + env(safe-area-inset-bottom, 0px)); }

            /* Existing redpacket greeting is edited in the regular message textarea. */
            #wechatAppUI #wcGroupEditMsgTimeInput:disabled { opacity: .56; }
            /* Embedded group activities use the existing message bubble and setting surfaces. */
            #wechatAppUI #page-group-chat .wc-group-activity-bubble {
                min-width: min(260px, 72vw); max-width: min(320px, 82vw);
                padding: 12px 14px; border-radius: 16px;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-bubble .msg-text[hidden] { display: none; }
            #wechatAppUI #page-group-chat .wc-group-activity-card {
                display: flex; flex-direction: column; gap: 10px; color: inherit; min-width: 0;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-card > strong {
                font-size: 15px; font-weight: 650; overflow-wrap: anywhere;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-card > small,
            #wechatAppUI #page-group-chat .wc-group-activity-card > p {
                font-size: 12px; opacity: .68; margin: 0; line-height: 1.5;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-form { display: flex; flex-direction: column; gap: 8px; }
            #wechatAppUI #page-group-chat .wc-group-activity-option {
                display: flex; align-items: center; gap: 8px; padding: 9px 10px;
                border: 1px solid rgba(128,128,128,.22); border-radius: 10px; font-size: 13px;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-option > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
            #wechatAppUI #page-group-chat .wc-group-activity-option > em {
                font-style: normal; font-size: 11px; opacity: .65; white-space: nowrap;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-entry {
                border-bottom: 1px solid rgba(128,128,128,.15); padding: 6px 0;
                font-size: 13px; overflow-wrap: anywhere;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-form > input {
                width: 100%; min-width: 0; box-sizing: border-box; padding: 10px 12px;
                border: 1px solid rgba(128,128,128,.25); border-radius: 10px;
                background: rgba(255,255,255,.15); color: inherit;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-submit {
                border: 0; border-radius: 10px; padding: 9px 12px;
                font-size: 13px; font-weight: 600; background: rgba(120,120,128,.18);
                color: inherit; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wc-group-activity-submit:active { opacity: .65; }
            /* Scheme 4 / Compact iOS. Scoped to poll and relay; red packets stay unchanged. */
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) {
                --wcg-compact-canvas: #f7f7f8; --wcg-compact-surface: #fff;
                --wcg-compact-field: #f4f4f5; --wcg-compact-line: #e7e7e9;
                --wcg-compact-ink: #292b2e; --wcg-compact-muted: #8f9197;
                background: var(--wcg-compact-canvas); color: var(--wcg-compact-ink);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) .wc-group-panel-sheet {
                background: var(--wcg-compact-canvas); color: var(--wcg-compact-ink);
            }
            /* Match the single-chat settings navbar: plain surface, centered title,
               60px back area and a subtle right-side action capsule. */
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) .wc-group-panel-header {
                background: var(--wcg-compact-surface); color: var(--wcg-compact-ink);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) .wc-group-panel-back {
                width: 60px; min-width: 60px;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) #wcGroupPanelBody {
                padding: 14px 14px calc(44px + var(--keyboard-inset-bottom, 0px) + env(safe-area-inset-bottom, 0px));
                background: var(--wcg-compact-canvas);
            }
            #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) .wc-group-panel-save {
                background: var(--wcg-compact-field); color: var(--wcg-compact-ink);
                border-radius: 16px; padding: 6px 14px; font-size: 13px;
                font-weight: 600; line-height: 1.2;
            }
            #wechatAppUI .wcg-compact-form, #wechatAppUI .wcg-compact-form * { box-sizing: border-box; }
            #wechatAppUI .wcg-compact-form { color: var(--wcg-compact-ink); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", sans-serif; }
            #wechatAppUI .wcg-compact-form [hidden] { display: none !important; }
            #wechatAppUI .wcg-compact-create { display: flex; flex-direction: column; gap: 10px; }
            #wechatAppUI .wcg-activity-block {
                padding: 13px; border-radius: 12px; border: 1px solid var(--wcg-compact-line);
                background: var(--wcg-compact-surface);
            }
            #wechatAppUI .wcg-block-heading {
                display: flex; justify-content: space-between; align-items: center; gap: 8px;
                margin-bottom: 11px; color: var(--wcg-compact-ink);
            }
            #wechatAppUI .wcg-block-heading strong { font-size: 13px; font-weight: 650; }
            #wechatAppUI .wcg-block-heading small { font-size: 10px; font-weight: 450; color: var(--wcg-compact-muted); }
            #wechatAppUI .wcg-field-help {
                margin: 8px 0 0; font-size: 11px; color: var(--wcg-compact-muted);
                font-weight: 400; line-height: 1.5;
            }
            #wechatAppUI .wcg-compact-form textarea, #wechatAppUI .wcg-compact-form input:not([type="checkbox"]):not([type="radio"]) {
                max-width: 100%; min-width: 0; outline: none; border: 0; box-shadow: none;
                font: inherit; color: var(--wcg-compact-ink); background: var(--wcg-compact-field);
                -webkit-appearance: none; appearance: none;
            }
            #wechatAppUI .wcg-compact-form textarea::placeholder,
            #wechatAppUI .wcg-compact-form input::placeholder { color: #a3a5aa; }
            #wechatAppUI .wcg-create-intro { padding: 2px 2px 4px; }
            #wechatAppUI .wcg-create-intro small { display: block; color: var(--wcg-compact-muted); font-size: 9px; font-weight: 700; letter-spacing: .12em; }
            #wechatAppUI .wcg-create-intro h2 { margin: 4px 0 0; color: var(--wcg-compact-ink); font-size: 18px; font-weight: 690; line-height: 1.35; }
            #wechatAppUI .wcg-poll-create textarea[name="title"] {
                display: block; width: 100%; min-height: 74px; padding: 11px;
                border-radius: 8px; resize: vertical; font-size: 14px; line-height: 1.45;
            }
            #wechatAppUI .wcg-poll-option-editor {
                display: flex; align-items: center; gap: 9px; min-height: 43px;
                margin-bottom: 7px; padding: 5px 8px; border: 1px solid var(--wcg-compact-line);
                border-radius: 9px; background: var(--wcg-compact-field);
            }
            #wechatAppUI .wcg-poll-circle { flex: 0 0 17px; height: 17px; border: 1.5px solid #aaaeb5; border-radius: 50%; }
            #wechatAppUI .wcg-poll-option-editor input[name="option"] {
                flex: 1; width: 100%; padding: 5px 0; background: transparent;
                font-size: 13px; font-weight: 500;
            }
            #wechatAppUI .wcg-poll-option-remove { display: grid; flex: 0 0 24px; place-items: center; width: 24px; height: 26px; padding: 3px; border: 0; background: transparent; color: #999ca2; cursor: pointer; }
            #wechatAppUI .wcg-poll-option-remove svg { display: block; width: 15px; height: 15px; }
            #wechatAppUI .wcg-poll-option-add { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 10px; border: 1px dashed #c6c8cd; border-radius: 8px; background: transparent; color: #666971; font-size: 12px; cursor: pointer; }
            #wechatAppUI .wcg-poll-option-add svg { width: 16px; height: 16px; }
            #wechatAppUI .wcg-poll-option-add:disabled { opacity: .4; }
            #wechatAppUI .wcg-poll-modes { display: flex; gap: 6px; margin: 0 0 5px; }
            #wechatAppUI .wcg-poll-modes label { flex: 1; position: relative; cursor: pointer; }
            #wechatAppUI .wcg-poll-modes input { position: absolute; opacity: 0; width: 1px; height: 1px; }
            #wechatAppUI .wcg-poll-modes span {
                display: block; text-align: center; border-radius: 8px; background: var(--wcg-compact-field);
                padding: 10px; font-size: 12px; color: #80828a; border: 1px solid var(--wcg-compact-line);
            }
            #wechatAppUI .wcg-poll-modes input:checked + span { background: #55575d; color: #fff; border-color: #55575d; }
            #wechatAppUI .wcg-poll-modes input:focus-visible + span { outline: 2px solid #868a94; outline-offset: 2px; }
            #wechatAppUI .wcg-compact-setting {
                display: flex; align-items: center; justify-content: space-between; gap: 12px;
                padding: 12px 1px; border-top: 1px solid var(--wcg-compact-line);
                font-size: 12px; color: var(--wcg-compact-ink); min-height: 43px;
            }
            #wechatAppUI .wcg-compact-setting > span { display: flex; flex-direction: column; gap: 3px; }
            #wechatAppUI .wcg-compact-setting small { font-size: 10px; font-weight: 400; color: var(--wcg-compact-muted); }
            #wechatAppUI .wcg-compact-setting input[type="checkbox"] {
                position: relative; appearance: none; -webkit-appearance: none; flex: 0 0 39px;
                width: 39px; height: 24px; border-radius: 24px; border: none;
                background: #d6d7da; margin: 0; cursor: pointer; transition: background .15s;
            }
            #wechatAppUI .wcg-compact-setting input[type="checkbox"]::after {
                content: ""; position: absolute; left: 2px; top: 2px;
                width: 20px; height: 20px; background: #fff; border-radius: 50%;
                transition: transform .15s;
            }
            #wechatAppUI .wcg-compact-setting input[type="checkbox"]:checked { background: #777a81; }
            #wechatAppUI .wcg-compact-setting input[type="checkbox"]:checked::after { transform: translateX(15px); }
            #wechatAppUI .wcg-compact-setting input[type="number"] { width: 56px; text-align: right; padding: 6px 8px; border-radius: 7px; font-size: 12px; }
            #wechatAppUI .wcg-deadline-setting > span { flex-direction: row; align-items: center; gap: 7px; }
            #wechatAppUI .wcg-deadline-setting svg { display: block; width: 15px; height: 15px; color: var(--wcg-compact-muted); }
            #wechatAppUI .wcg-deadline-setting input { width: 165px; flex: 0 1 165px; min-width: 0; padding: 7px 5px; border-radius: 7px; font-size: 11px; text-align: right; }
            #wechatAppUI .wcg-deadline-setting input[type="datetime-local"] { appearance: auto; -webkit-appearance: auto; }
            #wechatAppUI .wcg-relay-compose { padding-top: 12px; }
            #wechatAppUI .wcg-relay-hash { font-size: 12px; color: #7c7f86; font-weight: 680; }
            #wechatAppUI .wcg-relay-compose textarea[name="title"] {
                display: block; width: 100%; min-height: 95px; padding: 12px 2px 4px;
                border-radius: 0; resize: vertical; background: transparent;
                font-size: 17px; font-weight: 620; line-height: 1.5;
            }
            #wechatAppUI .wcg-relay-counter { text-align: right; color: var(--wcg-compact-muted); font-size: 10px; padding-bottom: 8px; }
            #wechatAppUI .wcg-relay-compose .wcg-deadline-setting { margin: 0; padding-bottom: 1px; }
            #wechatAppUI .wcg-relay-editor-row { display: flex; gap: 8px; align-items: center; margin: 0 0 8px; }
            #wechatAppUI .wcg-relay-editor-number {
                display: grid; flex: 0 0 28px; width: 28px; height: 31px; place-items: center;
                padding: 0; border: 0; border-radius: 8px; background: #ededee;
                color: #77797f; font-size: 12px; font-weight: 660;
            }
            #wechatAppUI button.wcg-relay-editor-number { cursor: pointer; }
            #wechatAppUI button.wcg-relay-editor-number:active { background: #d9dadd; }
            #wechatAppUI .wcg-relay-editor-row input { flex: 1; width: 100%; min-height: 43px; padding: 10px 11px; border-radius: 8px; font-size: 12px; }
            #wechatAppUI .wcg-relay-round-add {
                display: grid; place-items: center; width: 34px; height: 34px;
                margin: 10px 0 2px -3px; padding: 0; border: 0;
                background: transparent; color: #8e8e93; cursor: pointer;
            }
            #wechatAppUI .wcg-relay-round-add svg { display: block; width: 24px; height: 24px; }
            #wechatAppUI .wcg-relay-round-add:disabled { opacity: .35; }
            #wechatAppUI .wcg-relay-extras textarea {
                display: block; width: 100%; min-height: 65px; padding: 11px;
                border-radius: 8px; resize: vertical; font-size: 12px; line-height: 1.5;
            }
            /* Poll and relay keep neutral surfaces; only controls use the official group accent. */
            #wechatAppUI #page-group-chat .wc-group-activity-bubble:has(.wcg-poll-card, .wcg-relay-card) {
                --wcg-activity-field: #ffffff;
                --wcg-activity-ink: var(--wcg-activity-ink-light, #292b2e);
                --wcg-activity-highlight: color-mix(in srgb, var(--wcg-activity-accent, #333333) 55%, var(--wcg-activity-ink) 45%);
                background: #f8f8f9 !important; color: var(--wcg-activity-ink) !important;
                border: 1px solid color-mix(in srgb, currentColor 14%, transparent); box-shadow: none;
                min-width: min(285px, 75vw); max-width: min(332px, 86vw);
            }
            #wechatAppUI #page-group-chat .wcg-poll-card,
            #wechatAppUI #page-group-chat .wcg-relay-card { gap: 9px; color: inherit; font-family: var(--wcg-activity-font, inherit); }
            #wechatAppUI #page-group-chat .wcg-activity-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
            #wechatAppUI #page-group-chat .wcg-activity-kind { font-size: 11px; font-weight: 730; color: inherit; opacity: .78; }
            #wechatAppUI #page-group-chat .wcg-activity-status { font-size: 10px; color: inherit; opacity: .62; }
            #wechatAppUI #page-group-chat .wcg-activity-title { font-size: 15px; font-weight: 690; line-height: 1.45; overflow-wrap: anywhere; }
            #wechatAppUI #page-group-chat .wcg-activity-meta { font-size: 10px; color: inherit; opacity: .68; }
            #wechatAppUI #page-group-chat .wcg-poll-summary,
            #wechatAppUI #page-group-chat .wcg-relay-summary {
                padding-top: 4px; border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
                font-size: 11px; color: inherit; opacity: .76;
            }
            #wechatAppUI #page-group-chat .wcg-poll-choices { gap: 6px; }
            #wechatAppUI #page-group-chat .wcg-poll-choice {
                display: flex; position: relative; flex-wrap: wrap; gap: 7px;
                border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
                background: var(--wcg-activity-field); border-radius: 9px; padding: 10px;
                color: inherit; font-size: 12px; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .wcg-poll-choice.is-chosen {
                border-color: var(--wcg-activity-highlight);
                background: color-mix(in srgb, var(--wcg-activity-accent, #333333) 10%, var(--wcg-activity-field) 90%);
            }
            #wechatAppUI #page-group-chat .wcg-poll-choice input { flex: 0 0 auto; margin: 1px 0; accent-color: var(--wcg-activity-highlight); }
            #wechatAppUI #page-group-chat .wcg-poll-choice > span { flex: 1 1 60%; min-width: 0; }
            #wechatAppUI #page-group-chat .wcg-poll-choice > em { flex: 0 0 auto; font-size: 10px; color: inherit; opacity: .68; }
            #wechatAppUI #page-group-chat .wcg-poll-progress {
                flex: 1 1 100%; width: 100%; height: 4px; border-radius: 4px;
                background: color-mix(in srgb, currentColor 12%, transparent); overflow: hidden;
            }
            #wechatAppUI #page-group-chat .wcg-poll-progress span {
                display: block; height: 100%; border-radius: 4px; background: var(--wcg-activity-highlight);
            }
            #wechatAppUI #page-group-chat .wcg-activity-primary {
                background: color-mix(in srgb, var(--wcg-activity-accent, #333333) 15%, var(--wcg-activity-field) 85%);
                color: var(--wcg-activity-ink); border: 1px solid color-mix(in srgb, var(--wcg-activity-highlight) 25%, transparent);
                border-radius: 9px; padding: 10px; font-size: 12px;
            }
            #wechatAppUI #page-group-chat .wcg-activity-primary:disabled { opacity: .45; }
            #wechatAppUI #page-group-chat .wcg-activity-done { text-align: center; color: inherit; opacity: .72; }
            #wechatAppUI #page-group-chat .wcg-relay-description { color: inherit; opacity: .85; white-space: pre-wrap; }
            #wechatAppUI #page-group-chat .wcg-relay-entry {
                display: flex; align-items: flex-start; gap: 9px;
                border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent); padding: 8px 0;
            }
            #wechatAppUI #page-group-chat .wcg-relay-index {
                display: grid; place-items: center; width: 27px; height: 28px; flex: 0 0 27px;
                background: color-mix(in srgb, var(--wcg-activity-accent, #333333) 11%, var(--wcg-activity-field) 89%);
                color: var(--wcg-activity-ink); border: 0; border-radius: 8px;
                font-size: 11px; font-weight: 650; padding: 0;
            }
            #wechatAppUI #page-group-chat .wcg-relay-index.is-removable { cursor: pointer; }
            #wechatAppUI #page-group-chat .wcg-relay-index.is-removable:active {
                background: color-mix(in srgb, var(--wcg-activity-accent, #333333) 22%, var(--wcg-activity-field) 78%);
            }
            #wechatAppUI #page-group-chat .wcg-relay-entry-body { display: flex; flex-direction: column; min-width: 0; flex: 1; gap: 3px; }
            #wechatAppUI #page-group-chat .wcg-relay-entry-body strong { font-size: 11px; font-weight: 660; }
            #wechatAppUI #page-group-chat .wcg-relay-entry-text {
                min-width: 0; font-size: 12px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere;
            }
            #wechatAppUI #page-group-chat .wcg-relay-sample .wcg-relay-entry-text { align-self: center; color: inherit; opacity: .75; }
            #wechatAppUI #page-group-chat .wcg-relay-join { margin-top: 4px; }
            #wechatAppUI #page-group-chat .wcg-relay-join textarea {
                background: var(--wcg-activity-field); color: var(--wcg-activity-ink);
                border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
                border-radius: 8px; padding: 11px; font-size: 12px;
                width: 100%; min-height: 62px; resize: vertical; font-family: inherit;
            }
            #wechatAppUI #page-group-chat .wcg-relay-join textarea:focus-visible {
                outline: 1px solid var(--wcg-activity-highlight); outline-offset: 1px;
            }
            #wechatAppUI #page-group-chat .wcg-relay-join textarea::placeholder { color: currentColor; opacity: .55; }
            #wechatAppUI #page-group-chat .wc-group-activity-bubble:has(.wcg-poll-card, .wcg-relay-card) .wc-group-message-time {
                color: inherit; opacity: .65;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-activity-bubble:has(.wcg-poll-card, .wcg-relay-card) {
                --wcg-activity-field: #323439;
                --wcg-activity-ink: var(--wcg-activity-ink-dark, #f1f1f3);
                background: #24262b !important;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="create-poll"], [data-view="create-relay"]) {
                --wcg-compact-canvas: #191a1d; --wcg-compact-surface: #27282c;
                --wcg-compact-field: #333439; --wcg-compact-line: #3f4147;
                --wcg-compact-ink: #f1f1f3; --wcg-compact-muted: #a1a3aa;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI .wcg-poll-circle { border-color: #777981; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI .wcg-relay-editor-number { background: #3b3d43; color: #b0b2ba; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI .wcg-relay-round-add { color: #aeaeb2; }
            #wechatAppUI #page-group-chat .wc-group-translation-card {
                margin-top: 6px; padding: 8px 10px; width: 100%; box-sizing: border-box;
                border-radius: 10px; background: rgba(142, 142, 147, .12);
                color: inherit; font-size: 13px; font-weight: 500; line-height: 1.5;
                white-space: pre-wrap; overflow-wrap: anywhere;
            }
            /* Identical single-chat editor components, with group-only speaker selector. */
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay [hidden] { display: none !important; }
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay {
                z-index: 3600; overscroll-behavior: contain;
            }
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-panel { max-height: min(80dvh, 640px); }
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-content-section { gap: 12px; }
            #wechatAppUI #page-group-chat .wc-group-edit-speaker-section .wc-edit-msg-input { cursor: pointer; }
            #wechatAppUI #page-group-chat .wc-group-edit-speaker-section #wcGroupEditMsgSpeakerHint { padding-top: 0; }
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-segment-btn:focus-visible,
            #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-format-btn:focus-visible {
                outline: 2px solid #007aff; outline-offset: 2px;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-panel {
                background: rgba(35,35,39,.95); border-color: rgba(255,255,255,.12);
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-title,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat .wc-group-edit-msg-overlay .wc-edit-msg-btn.cancel { color: #f5f5f7; }
            /* Group-only dialogs. The single-chat settings layout is intentionally untouched. */
            #wechatAppUI #wcGroupPanel {
                --wcg-bg: #f7f7f8; --wcg-surface: #fff; --wcg-line: #e5e5ea;
                --wcg-ink: #171719; --wcg-muted: #8e8e93; --wcg-soft: #f2f2f7;
                position: absolute; inset: 0; z-index: 9500;
                display: flex; align-items: flex-end; background: rgba(0,0,0,.26);
                color: var(--wcg-ink);
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-sheet {
                display: flex; flex-direction: column; box-sizing: border-box; width: 100%;
                max-height: calc(100% - var(--wechat-top-inset, 45px) - 14px);
                background: var(--wcg-bg); border: 0; border-radius: 24px 24px 0 0;
                box-shadow: 0 -8px 28px rgba(0,0,0,.08); overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-header {
                position: relative; flex: 0 0 auto; box-sizing: border-box; min-height: 56px;
                display: flex; align-items: center; justify-content: space-between;
                padding: 9px 18px; background: var(--wcg-surface); border-bottom: 1px solid var(--wcg-line);
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-header strong {
                position: absolute; top: 50%; left: 80px; right: 80px;
                transform: translateY(-50%); text-align: center; pointer-events: none;
                font-size: 17px; font-weight: 600; line-height: 1.3; white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; color: var(--wcg-ink);
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-header button {
                z-index: 1; border: 0; padding: 7px 2px; background: transparent; color: var(--wcg-ink);
                font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-header button[hidden] { display: none !important; }
            #wechatAppUI #wcGroupPanel .wc-group-panel-back { display: none; align-items: center; width: 56px; }
            #wechatAppUI #wcGroupPanel .wc-group-panel-back svg { display: block; width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
            #wechatAppUI #wcGroupPanel .wc-group-panel-save { margin-left: auto; }
            #wechatAppUI #wcGroupPanelBody {
                flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch; box-sizing: border-box;
                padding: 0 20px calc(26px + max(0px, var(--keyboard-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px));
                background: var(--wcg-bg);
            }
            #wechatAppUI #wcGroupPanel .wc-group-section-title {
                display: flex; align-items: center; gap: 7px; margin: 22px 3px 10px;
                font-size: 13px; font-weight: 500; color: var(--wcg-muted);
            }
            #wechatAppUI #wcGroupPanel .wc-group-section-title span { font-size: 12px; font-weight: 400; }
            #wechatAppUI #wcGroupPanel .wc-group-hint {
                font-size: 12px; line-height: 1.65; color: var(--wcg-muted); overflow-wrap: anywhere; margin: 9px 3px 12px;
            }
            #wechatAppUI #wcGroupPanel .wc-group-field {
                display: flex; flex-direction: column; gap: 8px; padding: 13px 14px;
                margin: 0 0 9px; border-radius: 13px; background: var(--wcg-surface);
                color: var(--wcg-muted); font-size: 13px;
            }
            #wechatAppUI #wcGroupPanel .wc-group-field input,
            #wechatAppUI #wcGroupPanel .wc-group-field select,
            #wechatAppUI #wcGroupPanel .wc-group-field textarea,
            #wechatAppUI #wcGroupPanel .wc-group-search {
                display: block; box-sizing: border-box; min-width: 0; width: 100%; border: 0; padding: 0;
                background: transparent; color: var(--wcg-ink); font: inherit; font-size: 15px;
                line-height: 1.5; outline: 0; border-radius: 0;
            }
            #wechatAppUI #wcGroupPanel .wc-group-field textarea { min-height: 68px; resize: vertical; }
            #wechatAppUI #wcGroupPanel .wc-group-field input:disabled,
            #wechatAppUI #wcGroupPanel .wc-group-field select:disabled,
            #wechatAppUI #wcGroupPanel .wc-group-field textarea:disabled { opacity: .45; }
            #wechatAppUI #wcGroupPanel .wc-group-check {
                display: flex; align-items: center; gap: 11px; padding: 13px 14px;
                border-radius: 13px; background: var(--wcg-surface);
                color: var(--wcg-ink); font-size: 15px; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-check:not(.wc-group-setting-toggle):not(.wc-group-member-choice) input { accent-color: #171719; width: 20px; height: 20px; }
            #wechatAppUI #wcGroupPanel .wc-group-primary {
                width: 100%; min-height: 48px; padding: 12px 15px; margin: 13px 0;
                border: 0; border-radius: 13px; background: #202023; color: #fff;
                font: inherit; font-size: 15px; font-weight: 600; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-row {
                display: flex; align-items: center; justify-content: space-between; gap: 12px;
                width: 100%; padding: 15px 14px; margin-bottom: 7px;
                border: 0; border-radius: 13px; background: var(--wcg-surface);
                text-align: left; font: inherit; font-size: 15px; color: var(--wcg-ink); cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-row small { color: var(--wcg-muted); }
            #wechatAppUI #wcGroupPanel .wc-group-row:disabled { opacity: .45; }
            #wechatAppUI #wcGroupPanel .wc-group-row.wc-group-danger { color: #FF3B30; }
            #wechatAppUI #wcGroupPanel .wc-group-search { background: var(--wcg-surface); border-radius: 12px; padding: 13px; margin-bottom: 12px; }
            #wechatAppUI #wcGroupPanel .wc-group-result { flex-direction: column; align-items: flex-start; gap: 5px; }
            #wechatAppUI #wcGroupPanel .wc-group-result span { overflow-wrap: anywhere; }


            /* Group essence: approved QQ reference-card layout with native iOS navigation. */
            #wechatAppUI #wcGroupPanel .wc-group-panel-essence-filter { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="essence"] {
                --wcg-bg: #f5f5f5; --wcg-surface: #fff; --wcg-line: #ededed;
                --wcg-ink: #171717; --wcg-muted: #939393; --wcg-soft: #f2f2f2;
                align-items: stretch; background: #f5f5f5;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-sheet {
                position: relative; height: 100%; max-height: none; border-radius: 0; box-shadow: none;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-header {
                height: calc(var(--wechat-top-inset, 45px) + 44px); min-height: 0;
                padding: var(--wechat-top-inset, 45px) 16px 0; background: #fff;
                border-bottom: 1px solid #f2f2f2;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-header strong {
                top: calc(var(--wechat-top-inset, 45px) + 22px); left: 76px; right: 76px;
                font-size: 17px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-back {
                display: flex; width: 60px; min-width: 60px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-close { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-essence-filter {
                display: flex; width: 60px; height: 42px; margin-left: auto;
                align-items: center; justify-content: flex-end; color: #5d5d5d;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-panel-essence-filter svg {
                display: block; width: 23px; height: 23px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] #wcGroupPanelBody {
                background: #f5f5f5; padding: 0 12px calc(30px + env(safe-area-inset-bottom, 0px));
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-list {
                display: flex; flex-direction: column; gap: 12px; padding-top: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-card {
                position: relative; border-radius: 10px; background: #fff;
                padding: 17px 15px 16px; color: #191919; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-card:active { opacity: .65; }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-head {
                display: flex; align-items: center; gap: 10px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-avatar {
                width: 36px; height: 36px; min-width: 36px; flex: 0 0 36px;
                border-radius: 50%; background-color: #e5e5e5; overflow: hidden;
                background-size: contain; background-position: center; background-repeat: no-repeat;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-avatar svg {
                display: block; width: 100%; height: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-author {
                display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-author strong {
                display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                font-size: 13px; line-height: 1.3; font-weight: 800; color: #111;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-author small {
                color: #969696; font-size: 10px; font-weight: 650;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-more {
                display: flex; flex: 0 0 28px; align-items: center; justify-content: center;
                width: 28px; height: 28px; margin: -4px -5px 0 0;
                border: 0; padding: 0; background: transparent; color: #999;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-more svg {
                display: block; width: 21px; height: 21px; fill: currentColor;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-content {
                padding-top: 15px; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-text {
                margin: 0 0 14px; color: #191919; font-size: 14px; font-weight: 760;
                line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-image {
                display: block; width: auto; max-width: min(100%, 250px);
                max-height: 260px; height: auto; margin-bottom: 11px;
                border-radius: 8px; object-fit: contain;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-file-slot {
                max-width: 100%; overflow: hidden; margin-bottom: 11px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-meta {
                margin-top: 8px; text-align: right; color: #929292;
                font-size: 10px; font-weight: 650; line-height: 1.6;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-empty {
                margin: 64px 12px; text-align: center; color: #999; font-size: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-overlay {
                position: absolute; z-index: 30; inset: 0; display: flex;
                align-items: flex-end; justify-content: center;
                box-sizing: border-box; padding: 15px;
                background: rgba(0,0,0,.34);
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet {
                box-sizing: border-box; width: min(100%, 435px); max-height: 87%;
                overflow-y: auto; overscroll-behavior: contain;
                padding: 12px 19px calc(19px + env(safe-area-inset-bottom, 0px));
                border-radius: 24px; background: #fff; color: #222;
                box-shadow: 0 18px 60px rgba(0,0,0,.2);
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-grabber {
                width: 38px; height: 5px; margin: 0 auto 18px;
                border-radius: 20px; background: #e4e4e4;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-head {
                display: flex; align-items: center; justify-content: space-between;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-head strong {
                font-size: 17px; font-weight: 700; color: #191919;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-close {
                display: grid; place-items: center; width: 29px; height: 29px;
                padding: 6px; border: 0; border-radius: 50%;
                background: #efefef; color: #777;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-close svg {
                width: 17px; height: 17px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-search {
                display: flex; align-items: center; gap: 9px;
                margin-top: 18px; padding: 11px; border-radius: 11px;
                background: #f3f3f3; color: #888;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-search svg {
                width: 17px; height: 17px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-search input {
                width: 100%; min-width: 0; border: 0; outline: none;
                background: transparent; color: #222; font-size: 13px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-caption {
                margin: 23px 0 10px; color: #999; font-size: 11px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-types {
                display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-types button,
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-orders button {
                min-width: 0; border: 1px solid #eaeaea; border-radius: 11px;
                padding: 11px 3px; background: #f4f4f4; color: #555; font-size: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-orders {
                display: flex; gap: 8px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-orders button {
                flex: 1; padding: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-types button.active,
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-orders button.active {
                border-color: #202020; background: #202020; color: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-author {
                display: flex; align-items: center; gap: 11px; margin-top: 22px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-author strong {
                font-size: 13px; color: #222;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-author p {
                margin: 4px 0 0; font-size: 11px; color: #999;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-content {
                padding-top: 22px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-content .wc-group-essence-text {
                margin: 0 0 20px; font-size: 15px; font-weight: 650; line-height: 1.85;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-meta {
                margin-top: 10px; padding: 14px 0 17px;
                border-top: 1px solid #eee; color: #888; font-size: 11px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-actions {
                display: grid; grid-template-columns: 1fr 1fr; gap: 9px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-actions button {
                min-width: 0; min-height: 45px; padding: 10px 8px; border: 1px solid #e5e5e5;
                border-radius: 11px; background: #f6f6f6; color: #444;
                font-size: 12px; font-weight: 750;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-actions button:first-child {
                background: #222; border-color: #222; color: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-actions button:nth-child(3) {
                grid-column: span 2; background: #fff; color: #777;
            }

            /* QQ-style message action drawer; the filter drawer stays unchanged. */
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-overlay[data-kind="detail"] {
                padding: 0; align-items: flex-end;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-sheet {
                width: 100%; max-height: 88%; padding: 0;
                display: flex; flex-direction: column; overflow: hidden;
                border-radius: 14px 14px 0 0; box-shadow: none; background: #f0f0f2;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-sheet .wc-group-essence-grabber {
                flex: 0 0 auto; width: 36px; height: 4px; margin: 12px auto 9px; background: #e6e6e6;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-preview-scroll {
                background: #fff; overflow-y: auto; min-height: 0; overscroll-behavior: contain;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-title {
                padding: 10px 18px 18px; text-align: center; color: #92949c;
                font-size: 12px; font-weight: 600; border-bottom: 1px solid #ededed;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-preview {
                padding: 0 22px 15px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-preview .wc-group-essence-detail-author {
                margin-top: 16px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-preview .wc-group-essence-detail-content {
                padding-top: 15px;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-preview .wc-group-essence-detail-meta {
                margin-top: 7px; padding: 11px 0 0; border-top: 1px solid #f0f0f0;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-qq-actions {
                background: #fff; flex: 0 0 auto;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-qq-actions button {
                display: block; width: 100%; min-height: 59px; padding: 14px 16px;
                border: 0; border-top: 1px solid #f0f0f0; border-radius: 0;
                background: #fff; color: #171717; font-size: 16px; font-weight: 650;
                text-align: center;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-qq-actions button:active,
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-cancel:active {
                background: #f3f3f3;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-cancel-wrap {
                flex: 0 0 auto; padding-top: 11px; background: #dfe0e3;
            }
            #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-cancel {
                display: block; width: 100%; min-height: 62px;
                padding: 14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
                border: 0; background: #fff; color: #171717;
                text-align: center; font-size: 16px; font-weight: 650;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-sheet,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-cancel-wrap {
                background: #353535;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] :is(.wc-group-essence-preview-scroll, .wc-group-essence-qq-actions, .wc-group-essence-qq-actions button, .wc-group-essence-cancel) {
                background: #202020; color: #f5f5f5;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-action-title {
                border-bottom-color: #353535;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] {
                --wcg-bg: #171717; --wcg-surface: #202020; --wcg-ink: #f5f5f5;
                background: #171717;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] :is(.wc-group-panel-sheet, #wcGroupPanelBody) { background: #171717; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] :is(.wc-group-panel-header, .wc-group-essence-card, .wc-group-essence-sheet) { background: #202020; color: #f5f5f5; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] :is(.wc-group-essence-author strong, .wc-group-essence-text, .wc-group-essence-sheet-head strong, .wc-group-essence-detail-author strong) { color: #f5f5f5; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-search { background: #303030; color: #aaa; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-sheet-search input { color: #fff; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="essence"] .wc-group-essence-detail-actions button:last-child { background: #202020; color: #f5f5f5; }

            /* Creation sheet: quiet monochrome, grouped iOS form rows, no glass. */
            #wechatAppUI #wcGroupPanel .wc-group-create-intro {
                margin: 22px 3px 6px; font-size: 13px; font-weight: 400; color: var(--wcg-muted);
            }
            #wechatAppUI #wcGroupPanel .wc-group-mode-options {
                display: flex; flex-direction: column; gap: 0; border-radius: 14px;
                padding: 0 14px; background: var(--wcg-surface); overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wc-group-mode-option {
                position: relative; display: flex; align-items: center; justify-content: space-between;
                min-height: 67px; gap: 12px; padding: 12px 2px;
                border: 0; border-bottom: 1px solid var(--wcg-line); cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-mode-option:last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel .wc-group-mode-option input { position: absolute; opacity: 0; width: 1px; height: 1px; }
            #wechatAppUI #wcGroupPanel .wc-group-mode-copy { display: flex; flex-direction: column; gap: 5px; }
            #wechatAppUI #wcGroupPanel .wc-group-mode-copy strong { font-size: 15px; font-weight: 600; color: var(--wcg-ink); }
            #wechatAppUI #wcGroupPanel .wc-group-mode-copy small { font-size: 12px; color: var(--wcg-muted); }
            #wechatAppUI #wcGroupPanel .wc-group-mode-dot { width: 22px; height: 22px; flex-shrink: 0; border: 1.5px solid #c7c7cc; border-radius: 50%; }
            #wechatAppUI #wcGroupPanel .wc-group-mode-option input:checked ~ .wc-group-mode-dot { border: 6px solid var(--wcg-ink); }
            #wechatAppUI #wcGroupPanel .wc-group-create-card { background: var(--wcg-surface); padding: 0 14px; border-radius: 14px; overflow: hidden; }
            #wechatAppUI #wcGroupPanel .wc-group-create-card > .wc-group-field {
                padding: 14px 0; margin: 0; border-radius: 0; border-bottom: 1px solid var(--wcg-line);
                background: transparent;
            }
            #wechatAppUI #wcGroupPanel .wc-group-create-card > .wc-group-field:last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel .wc-group-members { padding: 4px 14px; border-radius: 14px; background: var(--wcg-surface); }
            #wechatAppUI #wcGroupPanel .wc-group-members .wc-group-section-title { margin: 13px 0 5px; font-size: 12px; }
            #wechatAppUI #wcGroupPanel .wc-group-member-choice {
                position: relative; min-height: 63px; padding: 10px 0; border-radius: 0;
                border-bottom: 1px solid var(--wcg-line);
            }
            #wechatAppUI #wcGroupPanel .wc-group-member-choice:last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel .wc-group-member-choice input { position: absolute; opacity: 0; width: 1px; height: 1px; }
            #wechatAppUI #wcGroupPanel .wc-group-choice-avatar,
            #wechatAppUI #wcGroupPanel .wc-group-choice-photo {
                display: block; box-sizing: border-box; width: 42px; height: 42px; flex: 0 0 42px;
                border-radius: 13px; background-color: var(--wcg-soft);
                background-position: center; background-size: cover; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wc-group-choice-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 4px; }
            #wechatAppUI #wcGroupPanel .wc-group-choice-copy strong { font-size: 14px; color: var(--wcg-ink); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #wechatAppUI #wcGroupPanel .wc-group-choice-copy small { font-size: 11px; color: var(--wcg-muted); }
            #wechatAppUI #wcGroupPanel .wc-group-choice-tick { display: flex; align-items: center; justify-content: center; flex: 0 0 22px; width: 22px; height: 22px; border: 1.5px solid #d1d1d6; border-radius: 50%; color: #fff; }
            #wechatAppUI #wcGroupPanel .wc-group-choice-tick::after { content: '✓'; opacity: 0; font-size: 12px; }
            #wechatAppUI #wcGroupPanel .wc-group-member-choice input:checked ~ .wc-group-choice-tick { border-color: var(--wcg-ink); background: var(--wcg-ink); }
            #wechatAppUI #wcGroupPanel .wc-group-member-choice input:checked ~ .wc-group-choice-tick::after { opacity: 1; }
            #wechatAppUI #wcGroupPanel .wc-group-create-submit {
                position: sticky; bottom: -1px; margin: 18px -20px -1px; padding: 10px 20px 5px;
                display: flex; flex-direction: column; gap: 4px; border-top: 1px solid var(--wcg-line);
                background: var(--wcg-bg);
            }
            #wechatAppUI #wcGroupPanel .wc-group-create-submit > span { font-size: 12px; text-align: center; color: var(--wcg-muted); }
            #wechatAppUI #wcGroupPanel .wc-group-create-submit .wc-group-primary { margin: 5px 0; }

            /* Creation uses the original WeSettings white-page visual rhythm. */
            #wechatAppUI #wcGroupPanel[data-view="create"] {
                align-items: stretch; background: #fff; --wcg-bg: #fff; --wcg-surface: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-sheet {
                height: 100%; max-height: none; border-radius: 0; box-shadow: none; background: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-header {
                height: calc(var(--wechat-top-inset, 45px) + 44px); min-height: 0;
                padding: var(--wechat-top-inset, 45px) 16px 0; border-bottom: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-header strong {
                top: calc(var(--wechat-top-inset, 45px) + 22px); font-size: 17px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-close {
                color: #007aff; font-size: 16px; font-weight: 500;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] #wcGroupPanelBody {
                padding: 0 20px calc(25px + max(0px, var(--keyboard-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px)); background: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-intro {
                display: flex; flex-direction: column; align-items: center; gap: 7px;
                margin: 0; padding: 18px 0 20px; text-align: center;
                background: #fff; color: #8e8e93;
            }
            #wechatAppUI #wcGroupPanel .wc-group-create-avatar {
                display: flex; align-items: center; justify-content: center;
                width: 76px; height: 76px; margin-bottom: 7px; box-sizing: border-box;
                border-radius: 20px; background: #f2f2f7; color: #8e8e93;
                font-size: 26px; font-weight: 500; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel #wcGroupCreatePreview .wc-group-avatar {
                display: block; width: 76px; height: 76px; min-width: 76px;
                flex: none; margin: 0; border-radius: 20px;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-intro > strong {
                font-size: 17px; font-weight: 600; line-height: 1.3; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-intro > span:last-child {
                font-size: 12px; line-height: 1.5; color: #8e8e93;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-section-title {
                position: relative; display: flex; align-items: center; margin: 0;
                padding: 22px 0 10px 20px; font-size: 18px; font-weight: 700; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-section-title::before {
                content: ''; position: absolute; left: 0; top: 25px;
                width: 4px; height: 14px; border-radius: 2px; background: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-options {
                padding: 0; background: #fff; border-radius: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-option {
                min-height: 66px; padding: 13px 0; border-bottom: .5px solid #e5e5ea;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-copy strong {
                font-size: 16px; font-weight: 600; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-copy small { font-size: 12px; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-option input:checked ~ .wc-group-mode-dot { border-color: #007aff; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card {
                background: #fff; border-radius: 0; padding: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field {
                display: flex; flex-direction: row; justify-content: space-between;
                align-items: center; gap: 13px; min-height: 53px;
                padding: 14px 0; margin: 0; border-bottom: .5px solid #e5e5ea;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field > span {
                flex: 0 0 auto; max-width: 44%; font-size: 15px; font-weight: 600; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field > input {
                min-width: 0; flex: 1 1 auto; text-align: right; font-size: 15px; color: #3c3c43;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field:has(textarea) {
                flex-direction: column; align-items: stretch;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field > textarea {
                padding: 11px 12px; border-radius: 10px; background: #f8f8fa;
                min-height: 66px; font-size: 14px; color: #3c3c43;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-hint { margin: 0 0 9px; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-members { padding: 0; background: #fff; border-radius: 0; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-members .wc-group-section-title {
                position: static; padding: 12px 0 6px; font-size: 12px;
                font-weight: 500; color: #8e8e93;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-members .wc-group-section-title::before { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-member-choice {
                padding: 12px 0; border-bottom: .5px solid #e5e5ea; min-height: 66px;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-member-choice input:checked ~ .wc-group-choice-tick {
                background: #007aff; border-color: #007aff;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-submit {
                background: #fff; padding: 12px 20px 8px; border-top: .5px solid #e5e5ea;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-submit .wc-group-primary {
                min-height: 48px; background: #007aff; color: #fff; border-radius: 14px;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-submit .wc-group-primary:disabled { background: #c7c7cc; color: #fff; cursor: default; }
            /* The private-chat delete action is #FF3B30 with a matching icon tile. */
            #wechatAppUI #wcGroupPanel .wc-group-row.wc-group-danger { color: #FF3B30; }
            #wechatAppUI #wcGroupPanel .wc-group-row.wc-group-danger .wc-group-setting-icon { background-color: #FF3B30; color: #fff; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-danger .wc-group-action-label { color: #FF3B30; }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-avatar {
                border: 0; padding: 0; cursor: pointer; position: relative;
                -webkit-tap-highlight-color: transparent;
            }
            #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-avatar:active,
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-avatar-picker:active {
                transform: scale(.97); transition: transform .14s ease;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-avatar-picker {
                border: 0; background: none; padding: 0; margin: 0;
                font: inherit; cursor: pointer; border-radius: 19px;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-avatar-picker:disabled { cursor: default; opacity: .75; }
            /* Share the Contacts app's existing Photos / URL avatar source popover. */
            #wechatAppUI #wcGroupAvatarMenuOverlay {
                position: absolute; inset: 0; z-index: 150;
                background: transparent; touch-action: manipulation;
            }
            #wechatAppUI #wcGroupAvatarMenuOverlay[hidden] { display: none !important; }
            #wechatAppUI #wcGroupAvatarSourceItems {
                position: absolute; display: flex; flex-direction: column;
                width: 240px; box-sizing: border-box; padding: 8px 0;
                border-radius: 34px; overflow: hidden; color: #171719;
                background: rgba(255,255,255,.92); border: 1px solid rgba(255,255,255,.65);
                backdrop-filter: blur(10px) saturate(180%);
                -webkit-backdrop-filter: blur(10px) saturate(180%);
                box-shadow: 0 10px 40px rgba(0,0,0,.12);
                transform-origin: top center; animation: wcGroupMenuPop .2s cubic-bezier(.25,.8,.25,1);
            }
            #wechatAppUI #wcGroupAvatarSourceItems .ct-avatar-menu-item {
                display: flex; width: 100%; align-items: center; gap: 14px;
                box-sizing: border-box; padding: 14px 24px; border: 0; margin: 0;
                background: none; color: inherit; text-align: left; font: inherit;
                font-size: 16px; font-weight: 600; cursor: pointer;
            }
            #wechatAppUI #wcGroupAvatarSourceItems .ct-avatar-menu-item + .ct-avatar-menu-item {
                border-top: .5px solid rgba(60,60,67,.10);
            }
            #wechatAppUI #wcGroupAvatarSourceItems .ct-avatar-menu-item svg {
                width: 22px; height: 22px; flex: 0 0 22px;
                fill: none; stroke: currentColor; stroke-width: 2;
                stroke-linecap: round; stroke-linejoin: round;
            }
            #wechatAppUI #wcGroupAvatarSourceItems .ct-avatar-menu-item:active { background: rgba(0,0,0,.06); }
            @keyframes wcGroupMenuPop {
                from { opacity: 0; transform: translateY(-5px) scale(.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            /* Per-action palette: orange for clear, red for dissolve/leave. */
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-warning .wc-group-action-label { color: #FF9500; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-warning .wc-group-setting-icon { background: #FF9500; color: #fff; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-danger .wc-group-setting-icon svg { color: #fff; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-copy strong { color: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupAvatarSourceItems {
                background: rgba(43,43,48,.96); color: #f5f5f7; border-color: rgba(255,255,255,.08);
            }
            /* The group picker shares the private-chat worldbook cards and tree geometry. */
            #wechatAppUI :is(#wcGroupSettingsMainView, #wcGroupWorldbookView)[hidden] { display: none !important; }
            #wechatAppUI #wcGroupWorldbookView { display: flex; flex: 1; flex-direction: column; min-height: 0; }
            #wechatAppUI #wcGroupPanel[data-view="worldbook-binding"] #wcGroupSettingsForm {
                display: flex; flex: 1; flex-direction: column; min-height: 0; width: 100%; margin: 0;
            }
            #wechatAppUI #wcGroupWorldbookInheritToggle { border: 0; padding: 0; flex-shrink: 0; }
            #wechatAppUI #wcGroupWorldbookOptions .store-wb-sq-checkbox { padding: 0; }
            #wechatAppUI #wcGroupWorldbookView button:disabled { opacity: .5; cursor: default; }
            #wechatAppUI #wcGroupWorldbookOptions .wc-group-worldbook-preview { cursor: default; }
            /* Group settings deliberately mirror wc-settings-page/wc-settings-list, not card UI. */
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) { align-items: stretch; background: #fff; --wcg-bg: #fff; --wcg-surface: #fff; }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-sheet {
                height: 100%; max-height: none; border-radius: 0; box-shadow: none;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-header {
                height: calc(var(--wechat-top-inset, 45px) + 44px); min-height: 0;
                padding: var(--wechat-top-inset, 45px) 16px 0; border-bottom: 0;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-header strong {
                top: calc(var(--wechat-top-inset, 45px) + 22px); font-size: 17px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-back { display: flex; }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-close { display: none; }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-panel-save {
                padding: 6px 14px; border-radius: 16px; background: #f2f2f7; font-size: 13px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) #wcGroupPanelBody {
                background: #fff; padding: 0 20px calc(46px + env(safe-area-inset-bottom, 0px));
            }
            #wechatAppUI #wcGroupPanel[data-view="worldbook-binding"] #wcGroupPanelBody {
                display: flex; flex-direction: column; overflow: hidden; padding: 0; background: #f2f2f7;
            }
            #wechatAppUI #wcGroupPanel .wc-group-settings-hero {
                display: flex; flex-direction: column; align-items: center;
                padding: 18px 0 26px; text-align: center; background: #fff;
            }
            #wechatAppUI #wcGroupPanel .wc-group-settings-avatar-picker {
                display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-settings-avatar-circle { display: block; width: 76px; height: 76px; }
            #wechatAppUI #wcGroupPanel #wcGroupSettingsAvatar > .wc-group-avatar {
                width: 76px; height: 76px; min-width: 76px; border-radius: 18px; margin: 0; flex: none;
            }
            #wechatAppUI #wcGroupPanel .wc-group-settings-hero > strong {
                margin-top: 13px; max-width: 90%; color: #000; font-size: 16px; font-weight: 600; line-height: 1.3;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupPanel .wc-group-settings-hero > span { margin-top: 5px; color: #8e8e93; font-size: 12px; }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-section-title {
                position: relative; margin: 0; padding: 24px 0 8px 20px;
                color: #000; font-size: 18px; font-weight: 700;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-section-title::before {
                content: ''; position: absolute; left: 0; top: 27px;
                width: 4px; height: 14px; border-radius: 2px; background: #000;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"], [data-view="add-members"], [data-view="appearance"], [data-view="group-media"], [data-view="remove-members"], [data-view="worldbook-binding"]) .wc-group-section-title span { color: #8e8e93; font-size: 13px; font-weight: 500; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-section-note {
                margin: -2px 0 8px; padding-left: 20px; color: #8e8e93;
                font-size: 12px; font-weight: 400; line-height: 1.5;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-toggle .wc-group-toggle-copy strong { line-height: 1.4; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-toggle .wc-group-toggle-copy small { line-height: 1.5; }
            @media (max-width: 380px) {
                #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > span {
                    max-width: 62%; line-height: 1.4; white-space: normal;
                }
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-section-note { color: #a0a0a7; }
            #wechatAppUI #wcGroupPanel .wc-group-member-grid {
                display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px 8px;
                padding: 16px 0 10px; background: #fff;
            }
            #wechatAppUI #wcGroupPanel .wc-group-member-tile {
                display: flex; flex-direction: column; align-items: center; gap: 8px;
                min-width: 0; border: 0; padding: 0; background: transparent;
                font: inherit; color: #000; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-member-photo-slot,
            #wechatAppUI #wcGroupPanel .wc-group-member-grid-photo,
            #wechatAppUI #wcGroupPanel .wc-group-add-mark {
                display: flex; align-items: center; justify-content: center;
                width: 55px; height: 55px; min-width: 55px; min-height: 55px;
                box-sizing: border-box; border-radius: 15px; background: #f2f2f7;
                background-size: cover; background-position: center; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel .wc-group-add-mark { color: #8e8e93; }
            #wechatAppUI #wcGroupPanel .wc-group-member-tile-name {
                max-width: 100%; font-size: 12px; color: #8e8e93;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card {
                padding: 0; background: #fff; border: 0; border-radius: 0; overflow: visible;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field {
                display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 14px;
                min-height: 53px; margin: 0; padding: 14px 0;
                background: #fff; border-radius: 0; border-bottom: .5px solid #e5e5ea;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field > span {
                flex: 0 0 auto; color: #000; font-size: 16px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field > input,
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field > select {
                flex: 1 1 0; min-width: 0; font-size: 15px; font-weight: 400;
                color: #3c3c43; text-align: right; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field:has(textarea) {
                flex-direction: column; align-items: stretch;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > .wc-group-field > textarea {
                width: 100%; min-height: 72px; padding: 11px 12px;
                border-radius: 10px; background: #f8f8fa; font-size: 14px; color: #3c3c43;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-toggle {
                position: relative; display: flex; align-items: center; gap: 16px;
                min-height: 65px; box-sizing: border-box; padding: 13px 0;
                border-radius: 0; border-bottom: .5px solid #e5e5ea; background: #fff;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="settings"], [data-view="member"]) .wc-group-setting-card > :last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel .wc-group-setting-icon {
                display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;
                flex: 0 0 28px; border-radius: 8px; background: #000; color: #fff;
            }
            #wechatAppUI #wcGroupPanel .wc-group-setting-icon svg { width: 18px; height: 18px; }
            #wechatAppUI #wcGroupPanel .wc-group-toggle-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 4px; }
            #wechatAppUI #wcGroupPanel .wc-group-toggle-copy strong { font-size: 16px; font-weight: 600; color: #000; }
            #wechatAppUI #wcGroupPanel .wc-group-toggle-copy small { font-size: 12px; font-weight: 400; color: #8e8e93; }
            #wechatAppUI #wcGroupPanel .wc-group-setting-toggle input[type="checkbox"] {
                position: absolute; right: 0; width: 51px; height: 31px; opacity: 0; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel .wc-group-switch-track {
                position: relative; display: block; flex: 0 0 51px; width: 51px; height: 31px;
                border-radius: 16px; background: #e5e5ea; pointer-events: none;
                transition: background-color .2s;
            }
            #wechatAppUI #wcGroupPanel .wc-group-switch-track::after {
                content: ''; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px;
                border-radius: 50%; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,.15);
                transition: transform .2s;
            }
            #wechatAppUI #wcGroupPanel .wc-group-setting-toggle input:checked + .wc-group-switch-track { background: #34c759; }
            #wechatAppUI #wcGroupPanel .wc-group-setting-toggle input:checked + .wc-group-switch-track::after { transform: translateX(20px); }
            #wechatAppUI #wcGroupPanel .wc-group-setting-toggle input:disabled + .wc-group-switch-track { opacity: .45; }
            #wechatAppUI #wcGroupPanel .wc-group-setting-toggle input:focus-visible + .wc-group-switch-track { outline: 2px solid #007aff; outline-offset: 2px; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-actions .wc-group-row {
                justify-content: flex-start; min-height: 62px; padding: 14px 0;
                margin: 0; border-bottom: .5px solid #e5e5ea; background: #fff; border-radius: 0;
            }
            #wechatAppUI #wcGroupPanel .wc-group-action-label { flex: 1; font-size: 16px; font-weight: 600; }
            #wechatAppUI #wcGroupPanel .wc-group-row-chevron {
                display: inline-flex; flex: 0 0 8px; align-items: center; justify-content: center;
                color: #c7c7cc; line-height: 1;
            }
            #wechatAppUI #wcGroupPanel .wc-group-row-chevron svg {
                display: block; width: 8px; height: 13px; fill: none;
                stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-actions .wc-group-row:last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-danger .wc-group-action-label { color: #FF3B30; }

            /* Group member subpages, matching the original WeSettings page. */
            #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) #wcGroupPanelBody {
                background: #fff; padding-bottom: calc(36px + max(0px, var(--keyboard-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px));
            }
            #wechatAppUI #wcGroupPanel .wc-group-panel-save:disabled { color: #aeaeb2; background: #f2f2f7; cursor: default; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-intro { display: flex; flex-direction: column; gap: 6px; padding: 23px 0 12px; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-intro strong { font-size: 20px; color: #000; font-weight: 700; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-intro span { font-size: 13px; line-height: 1.5; color: #8e8e93; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-count { margin: 0; padding: 0 0 6px; color: #007aff; font-size: 13px; font-weight: 600; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-list { display: flex; flex-direction: column; min-width: 0; background: #fff; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-list > .wc-group-section-title { margin: 0; padding-top: 22px; padding-bottom: 8px; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-list > .wc-group-section-title::before { top: 25px; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-list .wc-group-member-choice {
                display: flex; gap: 13px; flex-direction: row; align-items: center; box-sizing: border-box;
                min-width: 0; min-height: 70px; margin: 0; padding: 12px 0;
                border-radius: 0; border-bottom: .5px solid #e5e5ea; background: #fff;
            }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-choice-copy strong { font-size: 16px; font-weight: 600; color: #000; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-choice-copy small { font-size: 12px; color: #8e8e93; }
            #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-member-choice input:checked ~ .wc-group-choice-tick { border-color: #007aff; background: #007aff; }
            #wechatAppUI #wcGroupPanel[data-view="remove-members"] :is(.wc-group-choice-avatar, .wc-group-choice-photo) {
                border-radius: 50%;
            }
            #wechatAppUI #wcGroupPanel[data-view="remove-members"] .wc-group-panel-save:not(:disabled) { color: #ff3b30; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-hero { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 20px 0 18px; text-align: center; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-photo, #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-image {
                display: block; box-sizing: border-box; width: 76px; height: 76px; border-radius: 50%;
                background: #e5e5ea; background-size: cover; background-position: center; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-hero strong { max-width: 95%; font-size: 16px; font-weight: 600; color: #000; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-hero > span:last-child { font-size: 12px; color: #8e8e93; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action {
                display: flex; align-items: center; gap: 16px; box-sizing: border-box; width: 100%;
                min-height: 62px; margin: 0; padding: 14px 0; border: 0;
                border-bottom: .5px solid #e5e5ea; border-radius: 0; background: #fff;
                text-align: left; font: inherit; font-size: 16px; font-weight: 600; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action:last-child { border-bottom: 0; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action > span:nth-child(2) { flex: 1; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action.wc-group-danger .wc-group-setting-icon { background: #ff3b30; color: #fff; }
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action.wc-group-danger > span:nth-child(2) { color: #ff3b30; }
            #wechatAppUI #wcGroupPanel .wc-group-add-mark svg { display: block; width: 27px; height: 27px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) { background: #131315; --wcg-bg: #131315; --wcg-surface: #131315; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) .wc-group-panel-header,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) #wcGroupPanelBody,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-setting-card,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-setting-card > .wc-group-field,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-list,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-member-choice { background: #131315; border-color: #39393f; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) .wc-group-section-title,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-detail-hero strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-action,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-select-intro strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="add-members"], [data-view="remove-members"]) .wc-group-choice-copy strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-setting-card > .wc-group-field > span { color: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel:is([data-view="member"], [data-view="add-members"], [data-view="remove-members"]) .wc-group-section-title::before { background: #f5f5f7; }
            /* Reuse the exact private WeTheme layout and SVGs via a cloned modal. */
            #wechatAppUI #wcGroupPanel[data-view="appearance"] {
                align-items: stretch; background: transparent;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-group-panel-sheet {
                width: 100%; height: 100%; max-height: none; overflow: hidden;
                border: 0; border-radius: 0; background: transparent; box-shadow: none;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-group-panel-header { display: none; }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupPanelBody {
                position: relative; padding: 0; overflow: hidden; background: transparent;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme {
                position: absolute; inset: 0; width: 100%; height: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .theme-cards-container {
                transform: translateY(0);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .theme-back {
                border: 0; padding: 0; background: transparent; z-index: 2;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .theme-capsule {
                box-sizing: border-box; max-width: calc(100% - 28px);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-color-dot {
                box-sizing: border-box; display: block; flex: 0 0 36px;
                width: 36px; height: 36px; margin: 4px 2px;
                border: 0; border-radius: 50%; cursor: pointer;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,.1), 0 2px 6px rgba(0,0,0,.1);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-preset-button {
                box-sizing: border-box; width: 100%; border: 0;
                color: inherit; text-align: left; cursor: pointer; font: inherit;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-preset-button .preset-info { flex: 1; }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-palette-dot {
                width: 24px; height: 24px; flex: 0 0 24px;
                border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-selected {
                border: 0; background: #ededf0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-selected .preset-item-content {
                background: #ededf0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-color-dot.is-selected {
                box-shadow: inset 0 0 0 1px rgba(0,0,0,.1), 0 0 0 2px var(--tg-blue), 0 2px 6px rgba(0,0,0,.2);
                transform: scale(1.1);
            }
            /* Native buttons inside cloned cards must not inherit UA borders/focus rings. */
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme button.wc-font-item,
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme button.wc-bg-card,
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme button.wcg-theme-preset-button {
                -webkit-appearance: none; appearance: none; border: 0 !important;
                outline: none !important; box-shadow: none;
                font: inherit; text-align: left; color: inherit;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme button.wc-bg-add-box {
                -webkit-appearance: none; appearance: none;
                border: 2px dashed #c7c7cc !important;
                outline: none !important; box-shadow: none;
                font: inherit;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcGroupWeTheme :is(
                button.wc-font-item, button.wc-bg-card, button.wcg-theme-preset-button, button.wc-bg-add-box
            ):focus-visible {
                outline: 2px solid #a1a1aa !important; outline-offset: 2px;
            }
            /* Keep the original private WeTheme vertical order: bubbles above themes. */
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-section-caption {
                flex: 0 0 auto; margin: 3px 16px 0; padding: 6px 0 2px;
                font-size: 13px; font-weight: 700; color: #8e8e93;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-section-divider {
                margin-top: 8px; padding-top: 12px; border-top: 1px solid #f2f2f7;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wc-bubble-color-circles {
                flex: 0 0 auto; min-height: 80px;
                padding: 16px 16px 20px !important; align-items: center;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wc-theme-bubble-view > .modal-item {
                margin: 4px 16px 16px !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wc-theme-bubble-view > .modal-item:focus-visible {
                outline: 2px solid #a1a1aa; outline-offset: 2px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-font-symbol {
                background: transparent !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-font-symbol svg {
                fill: none !important; stroke: #8e8e93 !important;
                width: 22px; height: 22px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-font-item.active-font .wcg-font-symbol svg {
                stroke: #fff !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-preset-js-editor {
                flex: 1 1 0; min-height: 86px; margin: 0 0 12px;
            }
            /* The wallpaper source menu lives above this modal, not behind the avatar picker. */
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-overlay {
                position: absolute; inset: 0; z-index: 90;
                background: rgba(0,0,0,.05);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-overlay[hidden] {
                display: none !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-menu {
                position: absolute; z-index: 1; width: 188px;
                box-sizing: border-box; padding: 6px; border-radius: 15px;
                background: #fff; box-shadow: 0 8px 30px rgba(0,0,0,.16);
                display: flex; flex-direction: column; gap: 2px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-menu .icon-menu-item {
                display: flex; align-items: center; justify-content: flex-start;
                gap: 11px; width: 100%; min-height: 44px; padding: 9px 12px;
                box-sizing: border-box; border: 0 !important; border-radius: 10px;
                background: transparent; color: #1c1c1e; font: inherit;
                font-size: 14px; font-weight: 600; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-menu .icon-menu-item svg {
                width: 20px; height: 20px; flex: 0 0 20px;
                fill: none !important; stroke: currentColor;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-wallpaper-source-menu .icon-menu-item:active {
                background: #f2f2f7;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] button.wc-bg-card {
                padding: 0 !important; display: block; box-sizing: border-box;
                min-width: 140px; overflow: hidden; text-align: center;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-add-box svg {
                display: block; fill: none !important;
                stroke: #8e8e93 !important; stroke-width: 2;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-delete-btn {
                z-index: 10; width: 28px; height: 28px; padding: 0;
                border: 0; background: rgba(255,59,48,.9);
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-delete-btn svg {
                width: 16px; height: 16px; fill: none !important;
                stroke: #fff !important; stroke-width: 2.5;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-custom-preview .wcg-preview-row {
                display: flex; align-items: center; width: 100%; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-custom-preview .wcg-preview-row.sent {
                justify-content: flex-end;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-custom-preview .wcg-preview-bubble {
                box-sizing: border-box; max-width: 100%;
                padding: 9px 14px; border-radius: 18px;
                font-size: 13px; font-weight: 600; line-height: 1.4; white-space: normal;
                overflow-wrap: anywhere;
            }
            /* Mirror private CSS copy panel: outside headings, notes and code cards. */
            /* Private-style long code viewer: page one expands to the sheet height. */
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wc-theme-copy-css-view,
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wcCopyCssCardsWrap {
                min-height: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wcCopyCssCardsWrap[data-kind="source"] {
                flex: 1 1 0; display: flex; flex-direction: column; height: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wcCopyCssCardsWrap[data-kind="source"] .wcg-group-css-entry {
                display: flex; flex: 1 1 0; min-height: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wcCopyCssCardsWrap[data-kind="source"] .wcg-group-css-frame {
                display: flex; flex: 1 1 0; min-height: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] #wcg-wcCopyCssCardsWrap[data-kind="source"] pre {
                flex: 1 1 0; min-height: 0; max-height: none; overflow: auto;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-callout {
                color: #FF9500; font-weight: 700;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-entry.is-tutorial .wcg-group-css-callout {
                color: #FF3B30;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-tips code {
                color: #007AFF; font-size: 11px; font-weight: 700;
                background: rgba(0,122,255,.08); padding: 1px 3px; border-radius: 4px;
                overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-entry {
                display: flex; flex-direction: column; gap: 7px; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-heading {
                display: flex; align-items: center; flex-wrap: wrap;
                gap: 8px; padding: 0 4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-heading strong {
                font-size: 14.5px; font-weight: 800; color: #1c1c1e;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-badge {
                font-size: 10px; font-weight: 700; padding: 2px 6px;
                border-radius: 4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-description {
                margin: 0; padding: 0 4px; color: #8E8E93; font-size: 12px; line-height: 1.4;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-entry.is-tutorial .wcg-group-css-description {
                color: #636366; line-height: 1.45;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-code-label {
                font-size: 10px; font-weight: 700; color: #8E8E93;
                margin-bottom: 6px; text-transform: uppercase;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-tips {
                padding: 9px 12px; background: #f2f2f7; border-radius: 9px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-tips p {
                font-size: 12px; color: #636366; line-height: 1.5;
                padding: 0; margin: 0 0 4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-tips p:last-child { margin-bottom: 0; }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-frame {
                position: relative; border: 1px solid #e5e5ea; border-radius: 12px;
                background: #f9f9fb; padding: 12px 14px; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-copy {
                position: absolute; top: 8px; right: 8px;
                display: flex; align-items: center; justify-content: center;
                flex: 0 0 28px; width: 28px; height: 28px; padding: 0;
                border: 0 !important; border-radius: 7px;
                background: rgba(0,0,0,.05); color: #1c1c1e; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-copy svg {
                display: block; width: 16px; height: 16px; fill: none; stroke: currentColor;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-frame pre {
                margin: 0; padding: 2px 28px 2px 0;
                max-height: 160px; overflow: auto;
                font: 12px/1.45 ui-monospace, SFMono-Regular, monospace;
                color: #2c2c2e; white-space: pre-wrap; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-group-css-frame pre.wcg-group-css-source {
                font: 12.5px/1.5 monospace; white-space: pre; overflow-wrap: normal;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-used {
                position: absolute; z-index: 2; top: 0; right: 0;
                padding: 2px 8px; border-radius: 0 20px 0 10px;
                background: var(--tg-blue); color: #fff; font-size: 10px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wcg-theme-no-wallpaper {
                display: flex; align-items: center; justify-content: center;
                background: #e5e5ea; color: #8e8e93; font-size: 14px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-card,
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-add-box { font-family: inherit; }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-bg-delete-btn {
                display: flex; align-items: center; justify-content: center;
                font-size: 21px;
            }
            #wechatAppUI #wcGroupPanel[data-view="appearance"] .view-container {
                min-height: 0;
            }
            @media (max-height: 620px) {
                #wechatAppUI #wcGroupPanel[data-view="appearance"] .theme-cards-container { height: 74%; }
                #wechatAppUI #wcGroupPanel[data-view="appearance"] .wc-custom-preview { height: 110px; }
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-warning .wc-group-action-label { color: #ff9500; }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-warning .wc-group-setting-icon { background: #ff9500; color: #fff; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-row.wc-group-warning .wc-group-setting-icon { background: #ff9500; color: #fff; }
            @media (max-width: 340px) {
                #wechatAppUI #wcGroupPanel .wc-group-member-grid { gap: 13px 4px; }
                #wechatAppUI #wcGroupPanel .wc-group-member-photo-slot,
                #wechatAppUI #wcGroupPanel .wc-group-member-grid-photo,
                #wechatAppUI #wcGroupPanel .wc-group-add-mark { width: 48px; height: 48px; min-width: 48px; min-height: 48px; }
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel {
                --wcg-bg: #131315; --wcg-surface: #212124; --wcg-line: #39393f;
                --wcg-ink: #f5f5f7; --wcg-muted: #a0a0a7; --wcg-soft: #2d2d31;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] {
                --wcg-bg: #131315; --wcg-surface: #131315; background: #131315;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-sheet,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-panel-header,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] #wcGroupPanelBody,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-intro,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-options,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-members,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-submit {
                background: #131315; border-color: #39393f;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-intro > strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-section-title,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-mode-copy strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-create-card > .wc-group-field > span {
                color: #f5f5f7;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create"] .wc-group-section-title::before { background: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel .wc-group-row.wc-group-danger .wc-group-setting-icon { background: #FF3B30; color: #fff; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] {
                --wcg-bg: #131315; --wcg-surface: #212124; background: #131315;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-member-grid,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-panel-header,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] #wcGroupPanelBody,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-hero,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card > .wc-group-field,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-toggle,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-actions .wc-group-row {
                background: #131315; border-color: #39393f;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-section-title,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-settings-hero > strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-toggle-copy strong,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card > .wc-group-field > span {
                color: #f5f5f7;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-section-title::before { background: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-panel-save { background: #2d2d31; color: #f5f5f7; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel .wc-group-primary { background: #f2f2f7; color: #171719; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel .wc-group-setting-icon { background: #f5f5f7; color: #171719; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #page-group-chat { background: #000; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI .wc-group-footer { background: rgba(28,28,30,.93); color: #fff; border-color: rgba(255,255,255,.12); }

            /* Comfortable inset and wrapping for the red-packet composer on narrow devices. */
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] #wcGroupPanelBody {
                box-sizing: border-box; padding: 16px 22px calc(48px + max(0px, var(--keyboard-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px));
                overflow-x: hidden;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] #wcGroupCreateRedPacket {
                display: block; box-sizing: border-box; width: 100%; max-width: 100%;
                min-width: 0; padding: 0; margin: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-setting-card {
                box-sizing: border-box; width: 100%; min-width: 0;
                padding: 4px 14px 12px; border-radius: 15px;
                background: var(--wcg-surface, #fff); overflow: visible;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-field {
                box-sizing: border-box; min-width: 0; width: 100%; max-width: 100%;
                padding: 14px 8px 16px; margin: 0; gap: 10px;
                border-bottom: 1px solid var(--wcg-line, #e5e5ea);
                overflow: visible;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-field > span {
                display: block; width: 100%; min-width: 0; max-width: 100%;
                font-size: 15px; line-height: 1.5; font-weight: 600;
                white-space: normal; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-field > :is(input, select) {
                box-sizing: border-box; display: block; width: 100%; min-width: 0;
                height: auto; min-height: 46px; padding: 11px 14px;
                border-radius: 10px; line-height: 1.5; font-size: 16px;
                background: var(--wcg-soft, #f5f5f7); color: var(--wcg-ink, #171719);
                text-align: left; appearance: auto;
            }
            #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-virtual-notice {
                box-sizing: border-box; min-width: 0; max-width: 100%;
                margin: 0; padding: 12px 8px; font-size: 12px; line-height: 1.7;
                overflow-wrap: anywhere; white-space: normal;
            }
            /* Touch avatar gestures should not zoom the screen or select the SVG artwork. */
            #wechatAppUI #page-group-chat .message-row .msg-avatar[role="button"] {
                touch-action: manipulation; -webkit-user-select: none; user-select: none;
                -webkit-tap-highlight-color: transparent; cursor: pointer;
            }
            #wechatAppUI #page-group-chat .message-row .msg-avatar[role="button"]:focus-visible {
                outline: 2px solid var(--tg-blue, #3390ec); outline-offset: 2px;
            }
            #wechatAppUI #page-group-chat .wc-center-timestamp[data-kind="nudge"] {
                box-sizing: border-box; max-width: 88%; width: fit-content;
                margin: 8px auto; padding: 5px 11px; border-radius: 12px;
                font-size: 12px; line-height: 1.6; text-align: center;
                background: rgba(130,130,136,.12); color: var(--text-sub, #888);
                overflow-wrap: anywhere;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="create-redpacket"] .wc-group-setting-card {
                background: #212124;
            }

            /* Conversation API editor and message swipe feedback. */
            #wechatAppUI #wc-chat-api-editor { position: absolute; inset: 0; z-index: 300000; background: #fff; color: #1c1c1e; box-sizing: border-box; --wc-api-surface: #f6f6f8; --wc-api-line: #e8e8ed; --wc-api-sub: #8e8e93; --wc-api-selected: #fff; }
            #wechatAppUI #wc-chat-api-editor[hidden], #wechatAppUI #wc-chat-api-editor [hidden] { display: none !important; }
            #wechatAppUI .wc-chat-api-form { height: 100%; display: flex; flex-direction: column; margin: 0; }
            #wechatAppUI .wc-chat-api-form .wc-settings-navbar { flex: none; }
            #wechatAppUI .wc-chat-api-form button { border: 0; font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
            #wechatAppUI .wc-chat-api-form button:disabled { opacity: .45; cursor: default; }
            #wechatAppUI .wc-chat-api-content { width: 100%; max-width: 560px; margin: 0 auto; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; flex: 1; min-height: 0; padding: 18px 22px calc(32px + env(safe-area-inset-bottom, 0px) + max(0px, var(--keyboard-inset-bottom, 0px))); }
            #wechatAppUI .wc-chat-api-content p { color: var(--wc-api-sub); font-size: 12px; line-height: 1.6; margin: 14px 2px; overflow-wrap: anywhere; }
            #wechatAppUI .wc-chat-api-content .wc-chat-api-intro { margin: 0 2px 14px; font-size: 13px; }
            #wechatAppUI .wc-chat-api-mode { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; padding: 4px; background: var(--wc-api-surface); border-radius: 13px; }
            #wechatAppUI .wc-chat-api-mode label { position: relative; min-width: 0; margin: 0; cursor: pointer; }
            #wechatAppUI .wc-chat-api-mode input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
            #wechatAppUI .wc-chat-api-mode span { display: flex; justify-content: center; align-items: center; min-height: 36px; border-radius: 10px; color: var(--wc-api-sub); font-size: 13px; font-weight: 500; transition: background .16s ease, color .16s ease; }
            #wechatAppUI .wc-chat-api-mode input:checked + span { color: #1c1c1e; background: var(--wc-api-selected); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,.07); }
            #wechatAppUI .wc-chat-api-mode input:focus-visible + span { outline: 2px solid #8e8e93; outline-offset: -2px; }
            #wechatAppUI .wc-chat-api-content fieldset { border: 0; padding: 0; margin: 30px 0 0; min-width: 0; }
            #wechatAppUI .wc-chat-api-content legend { display: block; padding: 0; margin-bottom: 11px; font-size: 12px; color: var(--wc-api-sub); font-weight: 500; }
            #wechatAppUI .wc-chat-api-fields { padding: 0 16px; border-radius: 17px; background: var(--wc-api-surface); }
            #wechatAppUI .wc-chat-api-field { display: flex; flex-direction: column; gap: 9px; min-width: 0; margin: 0; padding: 16px 0; border-bottom: .5px solid var(--wc-api-line); }
            #wechatAppUI .wc-chat-api-field:last-child { border-bottom: 0; }
            #wechatAppUI .wc-chat-api-field > span { font-size: 13px; font-weight: 500; }
            #wechatAppUI .wc-chat-api-field :is(input, select) { width: 100%; min-width: 0; box-sizing: border-box; min-height: 25px; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; color: inherit; font: inherit; font-size: 16px; font-weight: 400; outline: none; }
            #wechatAppUI .wc-chat-api-field input::placeholder { color: #aeaeb2; opacity: 1; }
            #wechatAppUI .wc-chat-api-field:focus-within > span { color: #636366; }
            #wechatAppUI .wc-chat-api-preset { position: relative; padding-right: 22px; }
            #wechatAppUI .wc-chat-api-preset select { appearance: none; -webkit-appearance: none; padding-right: 4px; text-overflow: ellipsis; }
            #wechatAppUI .wc-chat-api-preset > svg { position: absolute; right: 0; top: 50%; width: 16px; height: 16px; color: var(--wc-api-sub); pointer-events: none; transform: translateY(-50%); }
            #wechatAppUI .wc-chat-api-temperature { flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; }
            #wechatAppUI .wc-chat-api-temperature small { display: block; margin-top: 6px; color: var(--wc-api-sub); font-size: 11px; font-weight: 400; }
            #wechatAppUI .wc-chat-api-temperature input { flex: none; width: 68px; min-height: 36px; padding: 5px 7px; border-radius: 10px; background: var(--wc-api-selected); text-align: center; font-size: 15px; font-variant-numeric: tabular-nums; }
            #wechatAppUI .wc-chat-api-content [data-status] { margin-top: 20px; }
            #wechatAppUI .wc-chat-api-content [data-error] { color: #ff3b30; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI #wc-chat-api-editor { background: #1c1c1e; color: #f2f2f7; --wc-api-surface: #2c2c2e; --wc-api-line: #3a3a3c; --wc-api-selected: #48484a; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI #wc-chat-api-editor .wc-settings-navbar { background: #1c1c1e; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI #wc-chat-api-editor .wc-settings-nav-btn-left { color: #f2f2f7; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI #wc-chat-api-editor .wc-settings-save-btn { background: #f2f2f7; color: #1c1c1e; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI .wc-chat-api-mode input:checked + span { color: #fff; }
            :is(.dark-mode, body.dark-mode) #wechatAppUI .wc-chat-api-field:focus-within > span { color: #d1d1d6; }

            /* QQ-style quick mention sheet. Intentionally isolated from all other group dialogs. */
            #wechatAppUI #wcGroupPanel[data-view="mention"] {
                --wcg-bg: #fff; --wcg-surface: #fff; --wcg-line: #ebebeb;
                --wcg-ink: #000; --wcg-muted: #8e8e8e; --wcg-soft: #f2f2f2;
                color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-panel-sheet {
                height: min(548px, calc(100% - 38px));
                max-height: calc(100% - 38px);
                background: #fff; border-radius: 27px 27px 0 0;
                box-shadow: 0 -10px 32px rgba(0,0,0,.12);
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-panel-header {
                display: none !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-handle {
                width: 36px; height: 5px; flex: none;
                margin: 9px auto 0; background: #d4d4d4;
                border-radius: 9px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-top {
                box-sizing: border-box; display: flex; align-items: center;
                justify-content: space-between; gap: 12px;
                padding: 11px 20px 12px; background: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-intro {
                display: flex; min-width: 0; flex-direction: column; gap: 6px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-intro strong {
                color: #000; font-size: 18px; font-weight: 750; line-height: 1.2;
                letter-spacing: -.3px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-intro span {
                color: #8e8e8e; font-size: 11px; line-height: 1.3;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-cancel {
                border: 0; padding: 8px 0; flex: none;
                background: transparent; color: #636363;
                font: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] #wcGroupPanelBody {
                padding: 0 0 calc(20px + env(safe-area-inset-bottom, 0px));
                overflow-x: hidden; background: #fff;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] [hidden] {
                display: none !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-root {
                min-height: 100%; display: flex; flex-direction: column;
                background: #fff; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search-wrap {
                background: #fff; padding: 0 18px 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search {
                box-sizing: border-box; display: flex; align-items: center; gap: 8px;
                height: 39px; padding: 0 12px; border-radius: 11px;
                color: #8e8e8e; background: #f0f0f0;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search svg {
                flex: none; display: block; fill: currentColor;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search input {
                box-sizing: border-box; width: 100%; min-width: 0; height: 100%;
                appearance: none; border: 0; outline: 0;
                background: transparent; font: inherit; font-size: 13px; color: #000;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search input::placeholder {
                color: #8e8e8e; opacity: 1;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-search:focus-within {
                box-shadow: 0 0 0 1px #8e8e8e;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-quick {
                padding: 0 17px 10px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all {
                box-sizing: border-box; display: flex; align-items: center; gap: 11px;
                width: 100%; min-height: 58px; padding: 10px 15px;
                text-align: left; background: #fff; border: 1px solid #e8e8e8;
                border-radius: 15px; color: #000; font: inherit; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all-icon {
                width: 38px; height: 38px; display: grid; place-items: center; flex: none;
                color: #000; background: #ededed; border-radius: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all-icon svg {
                display: block; width: 22px; height: 22px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all-copy {
                display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all-copy strong {
                font-size: 14px; font-weight: 700;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all-copy small {
                color: #8e8e8e; font-size: 10px; font-weight: 400;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-heading {
                padding: 10px 20px 9px; color: #777; font-size: 11px;
                font-weight: 700; letter-spacing: .4px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-heading span {
                float: right; color: #9a9a9a; font-weight: 400; letter-spacing: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-recents {
                display: flex; gap: 12px; padding: 0 18px 14px;
                overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-recents::-webkit-scrollbar {
                display: none;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-tile {
                display: flex; flex: 0 0 54px; flex-direction: column; gap: 7px;
                align-items: center; min-width: 54px; max-width: 60px;
                padding: 0; color: #606060; font: inherit; font-size: 11px;
                font-weight: 600; border: 0; background: transparent; cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-tile-name {
                display: block; width: 100%; text-align: center;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-photo {
                display: flex; width: 36px; height: 36px; flex: none;
                align-items: center; justify-content: center;
                border-radius: 12px; overflow: hidden; background: #e7e7e7;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-tile .wc-group-mention-photo {
                width: 46px; height: 46px; border-radius: 15px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-avatar-image {
                width: 100%; height: 100%; border-radius: inherit;
                background-size: cover; background-position: center; background-repeat: no-repeat;
                display: grid; place-items: center; overflow: hidden;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-avatar-image svg {
                display: block; width: 100%; height: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-list {
                margin: 0 13px; overflow: hidden; background: #fff;
                border: 1px solid #e8e8e8; border-radius: 15px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-member {
                position: relative; display: flex; align-items: center; gap: 12px;
                box-sizing: border-box; width: 100%; min-height: 55px;
                padding: 9px 15px; color: #000;
                background: #fff; border: 0; text-align: left; font: inherit;
                cursor: pointer;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-member:not(:last-child)::after {
                content: ""; position: absolute; left: 62px; right: 0; bottom: 0;
                height: 1px; background: #ededed;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-name {
                min-width: 0; flex: 1; font-size: 14px; font-weight: 650;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-role {
                flex: none; padding: 4px 7px; border-radius: 6px;
                color: #636363; background: #f1f1f1; font-size: 10px; font-weight: 600;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-chevron {
                margin-left: auto; flex: none; color: #b5b5b5;
                font-size: 20px; line-height: 1; font-weight: 400;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-foot {
                padding: 15px 12px 8px; text-align: center; color: #989898;
                font-size: 11px; margin-top: auto;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-empty {
                margin: 0 13px; padding: 38px 16px; text-align: center;
                color: #8e8e8e; font-size: 12px;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-member:active,
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all:active {
                background: #f1f1f1;
            }
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-tile:focus-visible,
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-member:focus-visible,
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-all:focus-visible,
            #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-cancel:focus-visible {
                outline: 2px solid #000; outline-offset: -2px;
            }
            @media (max-width: 340px) {
                #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-recents {
                    gap: 8px; padding-inline: 14px;
                }
                #wechatAppUI #wcGroupPanel[data-view="mention"] .wc-group-mention-member {
                    padding-inline: 12px;
                }
            }

            /* Group information uses the existing full-screen navigation and grouped QQ layout. */
            #wechatAppUI #wcGroupPanel[data-view="settings"] #wcGroupPanelBody { background: #f2f2f7; padding: 0 15px calc(34px + env(safe-area-inset-bottom, 0px)); }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-panel-header { background: #f8f8fa; }
            #wechatAppUI #wcGroupSettingsMainView [hidden] { display: none !important; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-settings-hero { display: grid; grid-template-columns: 64px minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 15px; padding: 18px 3px 20px; text-align: left; background: transparent; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-settings-avatar-picker { grid-row: 1 / 3; padding: 0; border: 0; background: transparent; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-settings-avatar-circle,
            #wechatAppUI #wcGroupSettings_overview #wcGroupSettingsAvatar > .wc-group-avatar { width: 64px; height: 64px; min-width: 64px; border-radius: 50%; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-settings-hero > strong { align-self: end; max-width: 100%; margin: 0 0 4px; font-size: 19px; font-weight: 650; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-settings-hero > span { align-self: start; margin: 0; font-size: 12px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-card { margin-bottom: 15px; padding: 0 15px; border-radius: 10px; background: #fff; overflow: hidden; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-card-heading { display: flex; align-items: center; justify-content: space-between; padding: 17px 0 10px; color: #1c1c1e; font-size: 15px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-card-heading > span { color: #8e8e93; font-size: 13px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-member-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px 9px; padding: 10px 0 17px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-member-tile { min-width: 0; gap: 5px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-member-photo-slot,
            #wechatAppUI #wcGroupSettings_overview .wc-group-member-grid-photo,
            #wechatAppUI #wcGroupSettings_overview .wc-group-add-mark { width: 40px; height: 40px; min-width: 40px; min-height: 40px; border-radius: 50%; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-member-tile-name { font-size: 11px; line-height: 1.4; max-width: 100%; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-add-mark { background: #f2f2f7; color: #8e8e93; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-remove-mark { font-size: 28px; font-weight: 300; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row { display: flex; align-items: center; gap: 9px; width: 100%; min-height: 55px; padding: 14px 0; box-sizing: border-box; border: 0; background: transparent; color: #1c1c1e; text-align: left; font: inherit; font-size: 15px; font-weight: 600; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row > span:first-child { flex-shrink: 0; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-value { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: right; color: #8e8e93; font-size: 13px; font-weight: 400; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row-multiline { flex-wrap: wrap; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row-multiline .wc-group-info-value { flex-basis: calc(100% - 25px); order: 3; white-space: pre-wrap; text-align: left; line-height: 1.7; max-height: 88px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row-multiline .wc-group-row-chevron { margin-left: auto; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-row-chevron { color: #c4c4c7; font-size: 20px; font-weight: 400; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-setting-toggle { min-height: 55px; padding: 12px 0; gap: 0; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-setting-toggle .wc-group-setting-icon,
            #wechatAppUI #wcGroupSettings_overview .wc-group-overview-actions .wc-group-setting-icon { display: none; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-toggle-copy strong { font-size: 15px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-app-grid { display: flex; gap: 24px; padding: 6px 0 17px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-app-grid > button { display: flex; flex-direction: column; align-items: center; gap: 6px; border: 0; padding: 5px; background: transparent; color: #1c1c1e; font: inherit; font-size: 11px; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-app-grid .wc-group-setting-icon { width: 26px; height: 26px; flex-basis: 26px; border-radius: 6px; background: #8e8e93; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-overview-actions .wc-group-row { min-height: 53px; margin: 0; padding: 14px 0; background: transparent; font-size: 15px; }
            #wechatAppUI #wcGroupSettings_overview #wcGroupClearHistory { color: #007aff; }
            #wechatAppUI #wcGroupSettings_overview #wcGroupLeave .wc-group-action-label { color: #ff3b30; }
            #wechatAppUI #wcGroupSettings_overview .wc-group-overview-actions .wc-group-row-chevron { display: none; }
            #wechatAppUI #wcGroupMediaItems { padding: 16px; }
            #wechatAppUI #wcGroupMediaItems.wc-group-photo-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 6px; }
            #wechatAppUI .wc-group-media-item { min-width: 0; padding: 0; margin-bottom: 12px; border: 0; background: transparent; }
            #wechatAppUI .wc-group-photo-grid .wc-group-media-item { margin: 0; aspect-ratio: 1; overflow: hidden; border-radius: 8px; }
            #wechatAppUI .wc-group-media-item img { display: block; width: 100%; height: 100%; object-fit: cover; }
            #wechatAppUI .wc-group-media-locate { margin-top: 8px; padding: 0; border: 0; background: transparent; color: #8e8e93; font: inherit; font-size: 12px; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] #wcGroupPanelBody { background: #000; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-panel-header,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupSettings_overview .wc-group-info-card { background: #1c1c1e; }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupSettings_overview :is(.wc-group-info-row, .wc-group-info-card-heading, .wc-group-app-grid > button) { color: #f5f5f7; }

            /* Keep editable member fields readable on compact phones. */
            @media (max-width: 380px) {
                #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-fields > .wc-group-field {
                    flex-direction: column; align-items: stretch; gap: 9px;
                }
                #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-fields > .wc-group-field > span {
                    flex: none; max-width: 100%;
                }
                #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-fields > .wc-group-field > :is(input, select) {
                    box-sizing: border-box; width: 100%; min-height: 40px;
                    padding: 9px 11px; border-radius: 10px;
                    background: var(--wcg-soft); color: var(--wcg-ink);
                    text-align: left;
                }
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > input,
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-member-fields > .wc-group-field > :is(input, select) {
                color: var(--wcg-ink);
            }

            /* Keep group settings form labels and controls inside their own iOS card gutters. */
            #wechatAppUI #wcGroupPanel[data-view="settings"] #wcGroupPanelBody {
                box-sizing: border-box;
                padding: 0 16px calc(46px + max(0px, var(--keyboard-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px));
                overflow-x: hidden;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] :is(.wc-group-settings-form, #wcGroupSettingsMainView, #wcGroupSettingsMainView > div) {
                box-sizing: border-box; width: 100%; max-width: 100%; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card {
                box-sizing: border-box; width: 100%; max-width: 100%; min-width: 0;
                padding: 0 16px; margin-bottom: 12px; border-radius: 14px;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card > :is(.wc-group-field, .wc-group-setting-toggle, .wc-group-row) {
                box-sizing: border-box; width: 100%; max-width: 100%; min-width: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card > .wc-group-row {
                min-height: 58px; margin: 0; padding: 13px 0;
                border-radius: 0; border-bottom: .5px solid var(--wcg-line);
                background: transparent;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card > :last-child {
                border-bottom: 0;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > span,
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-setting-card > .wc-group-field > span {
                flex: 0 1 auto; min-width: 0; max-width: 55%;
                line-height: 1.5; white-space: normal; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > :is(input, select, textarea),
            #wechatAppUI #wcGroupPanel[data-view="member"] .wc-group-setting-card > .wc-group-field > :is(input, select, textarea) {
                box-sizing: border-box; max-width: 100%; min-width: 0;
            }
            /* Long labels must not steal the space reserved for numeric and select inputs. */
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field:has(> :is(select, input[type="number"])) {
                flex-direction: column; align-items: stretch; gap: 9px;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field:has(> :is(select, input[type="number"], textarea)) > span {
                display: block; flex: none; max-width: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > :is(select, input[type="number"]) {
                display: block; box-sizing: border-box; width: 100%; min-width: 0;
                min-height: 44px; padding: 9px 12px; border-radius: 10px;
                background: var(--wcg-soft); color: var(--wcg-ink);
                font-size: 16px; line-height: 1.5; text-align: left;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > textarea {
                display: block; box-sizing: border-box; width: 100%; min-width: 0;
                max-width: 100%; min-height: 92px; padding: 12px 13px;
                background: var(--wcg-soft); color: var(--wcg-ink); line-height: 1.5;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] :is(.wc-group-toggle-copy, .wc-group-action-label) {
                min-width: 0; max-width: 100%;
            }
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-toggle-copy :is(strong, small),
            #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-action-label {
                line-height: 1.45; white-space: normal; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row > span:first-child {
                flex: 0 1 auto; max-width: 48%; min-width: 0;
                white-space: normal; overflow-wrap: anywhere;
            }
            #wechatAppUI #wcGroupSettings_overview .wc-group-info-row > .wc-group-info-value {
                min-width: 0; flex: 1 1 0;
            }
            @media (max-width: 360px) {
                #wechatAppUI #wcGroupPanel[data-view="settings"] #wcGroupPanelBody { padding-inline: 14px; }
                #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-card { padding-inline: 13px; }
                #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field:has(> input:not([type="checkbox"])) {
                    flex-direction: column; align-items: stretch; gap: 9px;
                }
                #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field:has(> input:not([type="checkbox"])) > span {
                    max-width: 100%; flex: none;
                }
                #wechatAppUI #wcGroupPanel[data-view="settings"] .wc-group-setting-fields > .wc-group-field > input:not([type="checkbox"]) {
                    width: 100%; min-height: 38px; text-align: left;
                }
            }


            /* iOS 18 speaker sheet, scoped independently from all other group panels. */
            #wechatAppUI #wcGroupSpeakerSheet {
                --wcs-ink: #1c1c1e; --wcs-secondary: #86868b;
                --wcs-panel: rgba(248,248,250,.95);
                --wcs-row: rgba(255,255,255,.94);
                --wcs-fill: rgba(118,118,128,.11);
                --wcs-separator: rgba(60,60,67,.11);
                position: absolute; inset: 0; z-index: 9600;
                display: flex; align-items: flex-end; justify-content: center;
                background: rgba(0,0,0,.24);
                -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
                font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
                color: var(--wcs-ink);
            }
            #wechatAppUI #wcGroupSpeakerSheet[hidden],
            #wechatAppUI #wcGroupSpeakerSheet [hidden] { display: none !important; }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-sheet {
                box-sizing: border-box; display: flex; flex-direction: column;
                width: 100%; min-height: 0; max-height: min(76%, 650px);
                border-radius: 32px 32px 0 0; overflow: hidden; outline: none;
                background: var(--wcs-panel);
                -webkit-backdrop-filter: blur(28px) saturate(1.5);
                backdrop-filter: blur(28px) saturate(1.5);
                box-shadow: 0 -1px 0 rgba(255,255,255,.65), 0 -18px 45px rgba(0,0,0,.12);
                animation: wcg-speaker-entrance .32s cubic-bezier(.18,.85,.24,1) both;
            }
            @keyframes wcg-speaker-entrance {
                from { transform: translateY(26px); opacity: .65; }
                to { transform: translateY(0); opacity: 1; }
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-grab {
                display: flex; flex: none; align-items: flex-start;
                justify-content: center; height: 26px; padding-top: 9px;
                box-sizing: border-box;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-handle {
                width: 36px; height: 5px; border-radius: 99px;
                background: rgba(60,60,67,.26);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-head {
                flex: none; padding: 0 21px 16px; text-align: center;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-title {
                display: block; font-size: 18px; font-weight: 730;
                line-height: 1.25; letter-spacing: -.3px;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-subtitle {
                display: block; padding-top: 5px; font-size: 12px;
                line-height: 1.4; color: var(--wcs-secondary);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-search {
                display: flex; align-items: center; box-sizing: border-box;
                flex: none; gap: 9px; margin: 0 17px 14px; height: 39px;
                padding: 0 12px; border-radius: 12px;
                background: var(--wcs-fill); color: var(--wcs-secondary);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-search svg {
                width: 16px; height: 16px; flex: none; fill: currentColor;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-search input {
                width: 100%; min-width: 0; height: 100%; padding: 0;
                outline: none; border: 0; appearance: none;
                border-radius: 0; box-shadow: none !important;
                background: transparent; color: var(--wcs-ink);
                font: inherit; font-size: 14px;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-search input::placeholder {
                color: var(--wcs-secondary);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-scroll {
                box-sizing: border-box; flex: 0 1 auto; min-height: 0;
                padding: 5px 16px 16px; overflow-y: auto; overflow-x: hidden;
                overscroll-behavior: contain; scrollbar-width: none;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-scroll::-webkit-scrollbar { display: none; }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-count {
                padding: 0 7px 10px; font-size: 12px; font-weight: 550;
                line-height: 1.3; color: var(--wcs-secondary);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-list {
                background: var(--wcs-row); border-radius: 17px;
                overflow: hidden; border: .5px solid rgba(255,255,255,.65);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-list:empty { display: none; }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-row {
                display: flex; align-items: center; position: relative;
                box-sizing: border-box; width: 100%; min-height: 66px;
                gap: 12px; padding: 10px 14px; border: 0;
                background: transparent; color: var(--wcs-ink);
                text-align: left; font: inherit; cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-row:not(:last-child)::after {
                content: ""; position: absolute; bottom: 0;
                left: 69px; right: 0; height: .5px;
                background: var(--wcs-separator);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-row:active:not(:disabled) {
                background: var(--wcs-fill);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-row:disabled {
                opacity: .46; cursor: default;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-photo,
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-avatar {
                flex: none; display: block; width: 44px; height: 44px;
                border-radius: 50%; overflow: hidden;
                background-color: var(--wcs-fill);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-avatar {
                width: 100%; height: 100%; background-size: cover;
                background-position: center; background-repeat: no-repeat;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-avatar svg {
                display: block; width: 100%; height: 100%;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-copy {
                display: flex; flex: 1; flex-direction: column;
                min-width: 0; justify-content: center; gap: 4px;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-copy strong {
                font-size: 15px; font-weight: 650; letter-spacing: -.15px;
                line-height: 1.35; overflow: hidden;
                white-space: nowrap; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-copy small {
                font-size: 11px; line-height: 1.25; color: var(--wcs-secondary);
                overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-action,
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-muted {
                flex: none; border-radius: 999px; padding: 7px 10px;
                font-size: 11px; font-weight: 650; line-height: 1;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-action {
                background: var(--wcs-fill); color: var(--wcs-ink);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-muted {
                color: var(--wcs-secondary);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-empty {
                padding: 31px 10px; color: var(--wcs-secondary);
                font-size: 13px; text-align: center;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-footer {
                box-sizing: border-box; flex: none;
                padding: 10px 16px calc(12px + env(safe-area-inset-bottom, 0px));
                border-top: .5px solid var(--wcs-separator);
                background: var(--wcs-panel);
                -webkit-backdrop-filter: blur(22px); backdrop-filter: blur(22px);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-cancel {
                display: block; box-sizing: border-box;
                width: 100%; height: 48px; padding: 0;
                border: .5px solid var(--wcs-separator);
                border-radius: 15px; background: var(--wcs-row);
                color: var(--wcs-ink); font: inherit;
                font-size: 16px; font-weight: 650;
                text-align: center; cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-cancel:active {
                background: var(--wcs-fill);
            }
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-row:focus-visible,
            #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-cancel:focus-visible {
                outline: 2px solid var(--wcs-ink); outline-offset: -3px;
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupSpeakerSheet {
                --wcs-ink: #f5f5f7; --wcs-secondary: #98989e;
                --wcs-panel: rgba(30,30,32,.95);
                --wcs-row: rgba(55,55,58,.95);
                --wcs-fill: rgba(118,118,128,.24);
                --wcs-separator: rgba(245,245,247,.1);
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-list {
                border-color: rgba(255,255,255,.06);
            }
            :is(.iphone.dark-mode, body.dark-mode, .dark-mode) #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-sheet {
                box-shadow: 0 -1px 0 rgba(255,255,255,.12), 0 -18px 45px rgba(0,0,0,.27);
            }
            @media (prefers-reduced-motion: reduce) {
                #wechatAppUI #wcGroupSpeakerSheet .wcg-pick-speaker-sheet { animation: none; }
            }
        </style>
        <div id="page-group-chat" class="page">
            <div class="chat-header-container">
                <button type="button" class="room-icon-btn frosted-glass" onclick="WcGroupChat.close()" aria-label="返回聊天列表"><svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <div class="room-info-capsule frosted-glass" onclick="WcGroupChat.settings()"><div id="wcGroupRoomAvatar"></div><div class="room-info-text"><div class="name" id="wcGroupRoomName"></div><div class="sub" id="wcGroupRoomStatus" role="status" aria-live="polite"></div></div></div>
                <button type="button" class="room-icon-btn fill-icon frosted-glass" onclick="WcGroupChat.toggleDropdown(event)" aria-label="群聊菜单" aria-expanded="false" id="wcGroupTopMenuToggle"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg></button>
            </div>
            <div class="dropdown-menu" id="wcGroupDropdownMenu" aria-label="群聊菜单">
                <div class="menu-item" onclick="WcGroupChat.handleDropdownAction('聊天设置')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    <span>聊天设置</span>
                </div>
                <div class="menu-item" onclick="WcGroupChat.handleDropdownAction('聊天美化')"><svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg><span>聊天美化</span></div>
                <div class="menu-item" onclick="WcGroupChat.handleDropdownAction('搜索聊天记录')"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>搜索聊天记录</span></div>
                <div class="menu-item" onclick="WcGroupChat.handleDropdownAction('清空聊天记录')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg><span>清空聊天记录</span></div>
            </div>
            <button id="wcGroupAnnouncement" class="frosted-glass" type="button" hidden onclick="WcGroupChat.settings()"></button>
            <div class="chat-area" id="wcGroupMessages"></div>
            <div id="wcGroupBatchHeader" class="wcg-batch-header wc-chat-multi-header" hidden aria-label="群聊多选标题">
                <strong class="title">已选择 <span id="wcGroupBatchCount">0</span> 项</strong>
                <button id="wcGroupBatchCancel" class="cancel-btn" type="button">取消</button>
            </div>
            <div id="wcGroupBatchBar" class="wcg-batch-bar wc-chat-multi-footer" hidden aria-label="批量管理群聊消息">
                <button id="wcGroupBatchForward" class="action-btn" type="button" disabled aria-label="转发选中消息">
                    <svg t="1791301341058" class="icon" viewBox="0 0 1303 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="52383" width="200" height="200"><path d="M192.387879 456.145455l155.151515 93.090909L279.272727 623.709091l-204.8-133.430303c-34.133333-21.721212-46.545455-71.369697-21.721212-105.50303 9.309091-15.515152 24.824242-24.824242 40.339394-31.030303L1185.357576 21.721212c40.339394-12.412121 83.781818 9.309091 96.193939 49.648485 3.10303 15.515152 3.10303 31.030303 0 46.545455l-269.963636 837.818181c-12.412121 40.339394-55.854545 62.060606-96.19394 49.648485-6.206061-3.10303-12.412121-3.10303-15.515151-6.20606l-341.333333-204.8 71.369697-62.060606 279.272727 161.357575c12.412121 6.206061 24.824242 3.10303 31.030303-9.309091 0 0 0-3.10303 3.10303-6.20606l223.418182-713.69697c3.10303-12.412121-3.10303-24.824242-15.515152-27.927273h-12.412121l-937.115151 279.272728c-12.412121 3.10303-18.618182 15.515152-15.515152 27.927272 0 6.206061 3.10303 9.309091 6.206061 12.412122z m195.490909 543.030303c-27.927273 3.10303-49.648485-18.618182-52.751515-43.442425V741.624242c0-21.721212 9.309091-43.442424 27.927272-58.957575L853.333333 285.478788c18.618182-15.515152 49.648485-12.412121 65.163637 6.20606l3.10303 3.103031c15.515152 21.721212 12.412121 55.854545-9.309091 71.369697L465.454545 723.006061c-18.618182 15.515152-27.927273 37.236364-27.927272 62.060606l3.10303 155.151515c0 31.030303-21.721212 55.854545-52.751515 58.957576z" fill="#12161F" p-id="52384"></path></svg>
                    <span style="font-size: 11px; color: #000; font-weight: 500;">转发</span>
                </button>
                <button id="wcGroupBatchDebug" class="action-btn debug" type="button" disabled aria-label="调试编辑单条消息">
                    <svg t="1791301226167" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30923" width="200" height="200" style="width:18px;height:18px;"><path d="M669.361319 551.148426c-44.009995 1.023488-81.367316 16.375812-111.56022 46.056971-20.469765 20.469765-34.286857 44.521739-40.93953 72.155922H236.425787c-26.098951 0-39.404298 13.305347-39.404298 39.404298s13.305347 39.404298 39.404298 39.404298h280.435782c6.652674 27.634183 20.469765 51.174413 40.93953 72.155922 29.681159 29.681159 67.038481 45.545227 111.56022 46.056972 44.009995-1.023488 81.367316-16.375812 111.56022-46.056972 29.681159-29.681159 45.545227-67.038481 46.056972-111.56022-1.023488-44.009995-16.375812-81.367316-46.056972-111.56022-30.192904-29.681159-67.550225-45.545227-111.56022-46.056971z m77.273364 157.617191c0.511744 20.469765-7.676162 40.93953-22.004998 55.268366-14.84058 14.84058-33.263368 22.516742-55.268366 23.54023-22.004998-1.023488-40.427786-8.69965-55.268365-23.54023-14.84058-14.84058-22.004998-33.263368-22.004998-55.268366a75.226387 75.226387 0 0 1 77.273363-77.273363c20.469765-0.511744 40.93953 7.676162 55.268366 22.004997 14.84058 14.328836 22.516742 34.286857 22.004998 55.268366z" fill="currentColor" p-id="30924"></path><path d="M977.431284 46.056972c-29.681159-29.681159-67.038481-45.545227-111.56022-46.056972H157.617191C113.095452 1.023488 76.249875 16.375812 46.056972 46.056972 16.375812 76.249875 1.023488 113.095452 0 157.617191v708.765618c1.023488 44.009995 16.375812 81.367316 46.056972 111.560219 29.681159 29.681159 67.038481 45.545227 111.560219 46.056972h708.765618c44.009995-1.023488 81.367316-16.375812 111.560219-46.056972 29.681159-29.681159 45.545227-67.038481 46.056972-111.560219V157.617191c-1.535232-44.521739-16.887556-81.367316-46.568716-111.560219z m-32.751624 819.814092c-0.511744 43.498251-35.310345 78.296852-78.808596 78.808596H157.617191c-43.498251-0.511744-78.296852-35.310345-78.808595-78.808596V157.617191c0.511744-43.498251 35.310345-78.296852 78.808595-78.808595h708.765618c43.498251 0.511744 78.296852 35.310345 78.808595 78.808595v708.253873z" fill="currentColor" p-id="30925"></path><path d="M787.062469 275.318341H506.626687c-6.652674-27.122439-20.469765-51.174413-40.939531-72.155922-29.681159-29.681159-67.038481-45.545227-111.560219-46.056972-44.009995 1.023488-81.367316 16.375812-111.56022 46.056972-29.681159 29.681159-45.545227 67.038481-46.056972 111.56022 1.023488 44.009995 16.375812 81.367316 46.056972 111.56022 29.681159 29.681159 67.038481 45.545227 111.56022 46.056971 44.009995-1.023488 81.367316-16.375812 111.560219-46.056971 20.469765-20.469765 34.286857-44.521739 40.939531-72.155922h280.435782c26.098951 0 39.404298-13.305347 39.404298-39.404298s-12.793603-39.404298-39.404298-39.404298zM409.395302 370.502749c-14.328836 14.328836-32.751624 22.516742-55.268365 23.028485-22.004998-0.511744-40.427786-8.69965-55.268366-23.028485-14.84058-14.84058-22.004998-33.263368-22.004998-55.78011a75.226387 75.226387 0 0 1 77.273364-77.273364 75.226387 75.226387 0 0 1 77.273363 77.273364c1.023488 20.981509-7.164418 40.93953-22.004998 55.78011z" fill="currentColor" p-id="30926"></path></svg>
                    <span style="font-size: 11px; color: currentColor; font-weight: 500;">调试</span>
                </button>
                <button id="wcGroupBatchDelete" class="action-btn delete" type="button" disabled aria-label="删除选中消息">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                    <span style="font-size: 11px; color: #FF3B30; font-weight: 500;">删除</span>
                </button>
            </div>
            <div id="wcGroupReplyOverlay" class="wc-reply-active-overlay" aria-label="取消引用"></div>
            <div id="wcGroupReplyFloatBubbleBox" class="wc-reply-float-bubble-box wc-group-reply-float"></div>
            <div class="wc-group-footer footer-capsule">
                <div id="wcGroupCompose" class="wc-group-compose">
                    <button type="button" id="wcGroupEmojiToggle" class="wc-group-emoji-toggle" aria-label="表情包" aria-expanded="false" aria-controls="wcGroupEmojiPanel"><svg aria-hidden="true" class="tool-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="stroke: none;"><path d="M10.5199 19.8634C10.5955 18.6615 10.8833 17.5172 11.3463 16.4676C9.81124 16.3252 8.41864 15.6867 7.33309 14.7151L8.66691 13.2248C9.55217 14.0172 10.7188 14.4978 12 14.4978C12.1763 14.4978 12.3501 14.4887 12.5211 14.471C14.227 12.2169 16.8661 10.7083 19.8634 10.5199C19.1692 6.80877 15.9126 4 12 4C7.58172 4 4 7.58172 4 12C4 15.9126 6.80877 19.1692 10.5199 19.8634ZM19.0233 12.636C15.7891 13.2396 13.2396 15.7891 12.636 19.0233L19.0233 12.636ZM22 12C22 12.1677 21.9959 12.3344 21.9877 12.5L12.5 21.9877C12.3344 21.9959 12.1677 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10 10C10 10.8284 9.32843 11.5 8.5 11.5C7.67157 11.5 7 10.8284 7 10C7 9.17157 7.67157 8.5 8.5 8.5C9.32843 8.5 10 9.17157 10 10ZM17 10C17 10.8284 16.3284 11.5 15.5 11.5C14.6716 11.5 14 10.8284 14 10C14 9.17157 14.6716 8.5 15.5 8.5C16.3284 8.5 17 9.17157 17 10Z"></path></svg></button>
                    <input type="text" id="wcGroupInput" placeholder="发送群消息" enterkeyhint="send" aria-label="群消息">
                    <button type="button" class="room-send-btn" id="wcGroupSend" aria-label="发送群消息"><svg aria-hidden="true" class="wc-send-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" height="20" width="20"><g><path fill="currentColor" fill-rule="evenodd" d="M11.8214 0.0977331c0.2883 -0.1052509 0.6005 -0.1264465 0.9005 -0.0610159 0.3029 0.0660858 0.5805 0.2177638 0.7997 0.4370018 0.2192 0.219238 0.3709 0.496818 0.437 0.799741 0.0654 0.29992 0.0442 0.6122 -0.061 0.90043l-3.574 10.71201 -0.0002 0.0007c-0.0871 0.2634 -0.2404 0.5001 -0.4453 0.6873 -0.2043 0.1867 -0.45301 0.3178 -0.72238 0.381 -0.26942 0.0657 -0.55131 0.0601 -0.81798 -0.0161 -0.26643 -0.0761 -0.50848 -0.2201 -0.70245 -0.4179l-1.91734 -1.9086 -2.01406 1.0415c-0.15705 0.0812 -0.34532 0.0734 -0.49515 -0.0205 -0.14982 -0.0938 -0.23893 -0.2599 -0.23434 -0.4366l0.08257 -3.18376 7.04493 -5.11741c0.2793 -0.20286 0.3413 -0.59371 0.1384 -0.87298 -0.2029 -0.27928 -0.59371 -0.34122 -0.87299 -0.13836L2.20283 8.0884 0.473125 6.35869l-0.000058 -0.00005 -0.000126 -0.00013c-0.187323 -0.18719 -0.325225 -0.41797 -0.4013217 -0.67163 -0.07555546 -0.25185 -0.0878308 -0.51841 -0.0357814 -0.77609 0.0521166 -0.28151 0.1779581 -0.54421 0.3647391 -0.76128 0.18806 -0.21856 0.431073 -0.38293 0.703923 -0.47612l0.00337 -0.00115 0 0.00001L11.8214 0.0977331Z" clip-rule="evenodd" stroke-width="1"></path></g></svg><svg aria-hidden="true" class="wc-stop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></svg></button>
                </div>
                <button type="button" id="wcGroupMoreToggle" class="wc-group-more-toggle" aria-expanded="false" aria-controls="wcGroupMorePanel" aria-label="更多功能"><svg aria-hidden="true" class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
            </div>
            <!-- Independent group emoji drawer, reusing the original single-chat emoji UI classes. -->
            <div class="wc-emoji-panel wc-group-emoji-panel" id="wcGroupEmojiPanel" aria-hidden="true">
                <div class="wc-emoji-panel-header">
                    <div class="wc-capsule-group" id="wcGroupEmojiCapsuleGroup"></div>
                    <div class="wc-search-view" id="wcGroupEmojiSearchView">
                        <div class="wc-search-box"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/></svg><input type="search" id="wcGroupEmojiSearchInput" placeholder="搜索表情包" aria-label="搜索表情包"></div>
                        <button type="button" class="wc-cancel-btn" id="wcGroupEmojiCancel">取消</button>
                    </div>
                </div>
                <div class="wc-panel-content" id="wcGroupEmojiPanelContent" aria-live="polite">当前暂无表情包</div>
            </div>
            <!-- Same bottom sheet/grid as the original single-chat function panel. -->
            <div class="wc-function-panel wc-group-more-panel" id="wcGroupMorePanel" aria-hidden="true">
                <div class="wc-function-grid">
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupVoiceButton"><div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M504.7182218666667 708.6080000000001c101.94488853333334 0 184.47170346666664-82.52681493333333 184.47170453333334-184.47170346666664V218.3016298666667c0-101.94488853333334-82.52681493333333-184.47170346666664-184.47170453333334-184.47170346666664s-184.47170346666664 82.52681493333333-184.47170346666664 184.47170346666664V524.1362965333334c2.427259733333333 101.94488853333334 82.52681493333333 184.47170346666664 184.47170346666664 184.47170346666664z" fill="currentColor"></path><path d="M791.1348149333332 390.63703680000003c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995v99.5176288c0 138.35377813333335-111.6539264 250.00770346666667-250.0077045333333 250.0077045333333s-250.00770346666667-111.6539264-250.00770346666667-250.0077045333333v-109.22666666666667c0-19.4180736-16.990814933333333-36.40888853333333-36.40888853333333-36.40888853333333s-36.40888853333333 16.990814933333333-36.408889599999995 36.40888853333333v109.22666666666667c0 165.05362986666665 126.2174816 303.4074069333333 286.4165930666667 320.39822293333333v77.67229546666667h-121.3629632c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995s16.990814933333333 36.40888853333333 36.40888853333333 36.40888853333333h315.54370346666667c19.4180736 0 36.40888853333333-16.990814933333333 36.408889599999995-36.40888853333333s-16.990814933333333-36.40888853333333-36.408889599999995-36.408889599999995h-121.36296213333333v-77.67229546666667c160.19911146666666-16.990814933333333 286.4165930666667-155.34459306666668 286.416592-320.39822293333333V427.0459264c0-21.845333333333333-16.990814933333333-36.40888853333333-36.40888853333333-36.408889599999995z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">语音</div></button>
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupImageButton"><div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M871.537778 118.328889h-728.177778c-38.684444 0-68.266667 29.582222-68.266667 68.266667v634.88c0 36.408889 29.582222 68.266667 68.266667 68.266666h728.177778c36.408889 0 68.266667-31.857778 68.266666-68.266666V186.595556c0-36.408889-29.582222-68.266667-68.266666-68.266667z m-573.44 116.053333c38.684444 0 72.817778 31.857778 72.817778 72.817778s-31.857778 72.817778-72.817778 72.817778c-38.684444 0-72.817778-31.857778-72.817778-72.817778s34.133333-72.817778 72.817778-72.817778z m-52.337778 552.96c-6.826667 0-13.653333-2.275556-20.48-6.826666-13.653333-11.377778-13.653333-27.306667-2.275556-40.96l141.084445-197.973334c11.377778-11.377778 27.306667-13.653333 40.96-4.551111l122.88 86.471111L748.657778 386.844444c11.377778-11.377778 65.991111-70.542222 97.848889-4.551111v402.773334c0 2.275556-600.746667 2.275556-600.746667 2.275555z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">图片</div></button>
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupPhotoButton"><div class="wc-function-icon"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M640 576c0 70.4-57.6 128-128 128s-128-57.6-128-128 57.6-128 128-128 128 57.6 128 128z m320-224v480c0 35.2-28.8 64-64 64H128c-35.2 0-64-28.8-64-64V352c0-35.2 28.8-64 64-64h167.2L376 192h256l80.8 96H896c35.2 0 64 28.8 64 64zM704 576c0-106.4-85.6-192-192-192S320 469.6 320 576s85.6 192 192 192 192-85.6 192-192z" fill="currentColor"></path></svg></div>
                        <div class="wc-function-text">拍照</div></button>
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupMentionButton" onclick="WcGroupChat.mentionPanel()"><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M526.272 54.4c125.568 0 226.944 38.08 301.568 116.416l12.48 13.44c60.16 68.48 90.048 152.192 90.048 251.712 0 89.088-28.032 168.384-81.472 240l-0.192 0.192c-53.376 67.712-112.896 103.808-178.624 103.872-26.688 0-48.64-7.168-64.64-22.656a88.512 88.512 0 0 1-23.424-44.032c-39.488 45.312-87.424 69.12-143.68 69.12-52.48 0-95.552-19.2-128.32-55.04-32.768-35.84-48.832-81.792-48.832-135.68 0-91.392 26.752-172.16 83.008-239.232 53.76-67.008 116.928-100.096 191.552-100.096 30.272 0 56.32 8.128 77.312 24.768 14.272 11.328 25.792 26.432 34.88 44.864l10.432-39.488 1.28-2.944a9.6 9.6 0 0 1 8.064-4.224h77.248a9.6 9.6 0 0 1 9.216 12.032l-84.352 315.2v0.064c-9.536 35.072-13.952 58.112-13.952 71.104 0 7.936 2.176 12.544 5.12 15.36 3.072 2.88 8.704 5.248 18.56 5.248 32.384 0 66.752-21.312 102.976-67.584 41.344-53.76 62.08-116.8 62.08-189.696 0-83.328-27.52-152.128-82.688-206.912-59.648-59.456-140.16-88.96-240.448-88.96-106.88 0-194.688 35.328-264.064 106.88-68.096 70.464-101.76 160.96-101.76 269.952 0 112.576 29.696 199.872 90.176 263.168l12.48 12.288 0.064 0.064c64.384 60.8 153.28 92.8 267.904 92.8 81.92 0 154.176-15.488 214.4-44.928 53.312-27.072 96-63.424 128.256-110.272l1.536-1.728a9.6 9.6 0 0 1 6.4-2.496H960a9.6 9.6 0 0 1 8.32 14.4c-42.56 74.176-103.424 131.072-183.488 170.496-77.44 38.144-163.328 57.728-258.56 57.728-144.448 0-258.816-40.448-343.04-122.24C96.768 763.072 54.4 652.928 54.4 515.584c0-129.152 42.496-236.8 128.768-323.2C273.088 99.84 387.328 54.4 526.208 54.4z m22.528 293.312c-47.488 0-89.984 22.272-126.528 71.04l-0.192 0.192c-38.912 48.832-58.496 107.072-58.496 176.384 0 31.232 6.784 54.208 20.416 71.296 13.248 16.576 32.832 25.344 60.224 25.344 26.944 0 54.592-10.88 81.792-33.92a168.96 168.96 0 0 0 53.952-79.68l26.048-98.688 3.328-14.464c2.56-11.52 4.736-20.8 6.208-27.904 1.536-7.36 2.112-11.52 2.112-13.44 0-19.52-6.4-36.672-17.92-50.624l-0.192-0.192c-13.76-17.216-30.08-25.344-50.752-25.344z"/></svg></span><span class="wc-function-text">@成员</span></button>
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupContinue"><span class="wc-function-icon"><svg class="wc-group-play-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM10.6219 8.41459C10.5562 8.37078 10.479 8.34741 10.4 8.34741C10.1791 8.34741 10 8.52649 10 8.74741V15.2526C10 15.3316 10.0234 15.4088 10.0672 15.4745C10.1897 15.6583 10.4381 15.708 10.6219 15.5854L15.5008 12.3328C15.5447 12.3035 15.5824 12.2658 15.6117 12.2219C15.7343 12.0381 15.6846 11.7897 15.5008 11.6672L10.6219 8.41459Z"/></svg><svg class="wc-group-stop-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9 9V15H15V9H9Z"/></svg></span><span class="wc-function-text" id="wcGroupContinueText">开始生成</span></button>
                    <button type="button" class="wc-function-item wc-group-more-item"  onclick="WcGroupChat.regenerate()"><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z" fill="currentColor"></path></svg></span><span class="wc-function-text">重新生成</span></button>
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupAuto" ><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 2C13.5 2.44425 13.3069 2.84339 13 3.11805V5H18C19.6569 5 21 6.34315 21 8V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8C3 6.34315 4.34315 5 6 5H11V3.11805C10.6931 2.84339 10.5 2.44425 10.5 2C10.5 1.17157 11.1716 0.5 12 0.5C12.8284 0.5 13.5 1.17157 13.5 2ZM0 10H2V16H0V10ZM24 10H22V16H24V10ZM9 14.5C9.82843 14.5 10.5 13.8284 10.5 13C10.5 12.1716 9.82843 11.5 9 11.5C8.17157 11.5 7.5 12.1716 7.5 13C7.5 13.8284 8.17157 14.5 9 14.5ZM16.5 13C16.5 12.1716 15.8284 11.5 15 11.5C14.1716 11.5 13.5 12.1716 13.5 13C13.5 13.8284 14.1716 14.5 15 14.5C15.8284 14.5 16.5 13.8284 16.5 13Z"/></svg></span><span class="wc-function-text">自动聊</span></button>
                    <button type="button" class="wc-function-item wc-group-more-item"  onclick="WcGroupChat.speakerPanel()"><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M477.4 693.1L799 938.2s45.9 45.4 91.9-3.1c45.9-48.5 0-94.8 0-94.8L661.1 499.5l-91.9 96.8-91.8 96.8z m45.9-532.4c-50.5-67.4-95.9-96.8-183.7-96.8C187.4 63.9 64 193.9 64 354.3c0 92.5 27.8 140.4 91.8 193.6l367.5-387.2z m45.9 48.4L201.8 596.3c34.6 16.5 97.4 48.4 137.8 48.4 152.2 0 275.6-130 275.6-290.4 0-42.6-30.4-108.7-46-145.2z"/></svg></span><span class="wc-function-text">指定发言</span></button>
                    <!-- Group activities occupy their own row before the guide and search tools. -->
                    <button type="button" class="wc-function-item wc-group-more-item" id="wcGroupGuide" ><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.94101 18C7.64391 16.7274 6.30412 15.6857 5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.6944 15.687 16.3558 16.7276 16.059 18H7.94101ZM16 20V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V20H16ZM13 10.0048V6L8.5 12.0048H11V16.0048L15.5 10.0048H13Z"/></svg></span><span class="wc-function-text">话题引导</span></button>
                    <button type="button" class="wc-function-item wc-group-more-item"  onclick="WcGroupChat.searchPanel(true)"><span class="wc-function-icon"><svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M212.3008 928.36352c-38.61504 0-61.79328-10.30656-67.05152-29.824-2.41152-8.97536-2.41152-26.40384 24.75008-42.19392 21.84704-12.7232 41.80992-31.80544 59.48416-56.82688-103.66464-76.01152-162.71872-186.9312-162.71872-307.2256 0-219.45856 199.68-398.02368 445.09184-398.02368 245.59616 0 445.37856 178.54976 445.37856 398.02368 0 219.4944-199.79776 398.08512-445.35808 398.08512a491.5712 491.5712 0 0 1-129.7408-17.5104c-59.56608 40.81152-126.16704 55.49568-169.83552 55.49568zM484.6 295.6Q512 240 539.4 295.6L574.8 367.3Q589.9 397.8 623.5 402.7L702.7 414.2Q764 423.1 719.6 466.4L662.4 522.2Q638 545.9 643.8 579.5L657.3 658.3Q667.8 719.4 612.9 690.5L542.1 653.3Q512 637.5 481.9 653.3L411.1 690.5Q356.2 719.4 366.7 658.3L380.2 579.5Q386 545.9 361.6 522.2L304.4 466.4Q260 423.1 321.3 414.2L400.5 402.7Q434.1 397.8 449.2 367.3Z"/></svg></span><span class="wc-function-text">群精华</span></button>
                </div>
            </div>
            <input type="file" id="wcGroupImageInput" accept="image/*" multiple hidden>
            <!-- Group bubble actions use the single-chat reaction capsule and action-sheet styles. -->
            <div class="wc-bubble-menu-overlay wc-group-bubble-menu-overlay" id="wcGroupBubbleMenuOverlay" aria-hidden="true">
                <div class="wc-bubble-menu-container" id="wcGroupBubbleMenuContainer">
                    <div class="wc-bubble-emojis-capsule" id="wcGroupBubbleEmojiCapsule">
                        <div class="wc-bubble-emojis-scroll-area" id="wcGroupBubbleReactions">
                            <button type="button" class="wc-bubble-menu-emoji" data-group-reaction="💩" aria-label="💩">💩</button><button type="button" class="wc-bubble-menu-emoji" data-group-reaction="❤️" aria-label="❤️">❤️</button><button type="button" class="wc-bubble-menu-emoji" data-group-reaction="👍" aria-label="👍">👍</button><button type="button" class="wc-bubble-menu-emoji" data-group-reaction="👎" aria-label="👎">👎</button><button type="button" class="wc-bubble-menu-emoji" data-group-reaction="🔥" aria-label="🔥">🔥</button><button type="button" class="wc-bubble-menu-emoji" data-group-reaction="🥰" aria-label="🥰">🥰</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="👏" aria-label="👏">👏</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="😂" aria-label="😂">😂</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="😭" aria-label="😭">😭</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="🥺" aria-label="🥺">🥺</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="😡" aria-label="😡">😡</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="🤔" aria-label="🤔">🤔</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="🎉" aria-label="🎉">🎉</button><button type="button" class="wc-bubble-menu-emoji extra-emoji" data-group-reaction="✨" aria-label="✨">✨</button>
                        </div>
                        <button type="button" class="wc-bubble-menu-more" id="wcGroupBubbleExpand" aria-label="更多表情"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                        <button type="button" class="wc-bubble-menu-more collapse-btn" id="wcGroupBubbleCollapse" aria-label="收起表情"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                        <div class="wc-bubble-emojis-tail-1"></div><div class="wc-bubble-emojis-tail-2"></div>
                    </div>
                    <div class="wc-bubble-action-menu" id="wcGroupBubbleActions">
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="reply" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="solid"><svg t="1791303276319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14184" width="200" height="200"><path d="M757.76 94.866c81.189 4.755 154.478 44.91 192.366 134.217 38.546 90.698 21.357 175.178-45.056 247.223-47.031 51.054-97.573 98.816-146.944 147.603-21.431 21.211-55.808 21.942-74.387 2.34-18.797-19.748-16.75-46.958 5.852-69.705 48.494-48.713 97.646-96.768 145.554-145.92 72.265-74.094 40.229-191.854-59.611-218.478-41.545-10.971-81.408-3.364-113.006 26.112-50.761 47.324-98.597 97.72-149.211 145.189-10.68 10.02-28.453 18.724-42.35 17.774-37.157-2.195-56.028-47.397-30.281-74.314a3238.62 3238.62 0 0 1 171.3-167.936c36.133-32.548 83.237-43.739 145.774-44.032zM94.647 746.642a223.159 223.159 0 0 1 65.609-160.475c48.055-49.079 96.914-97.426 145.7-145.847 23.187-22.967 51.64-24.722 71.242-4.974 20.48 20.627 18.432 46.592-5.705 70.949-46.446 46.665-93.623 92.672-139.63 139.849-56.832 58.222-59.246 136.777-6.876 189.586 50.176 50.469 133.12 50.761 185.49-0.365 47.544-46.52 93.99-94.355 141.459-140.947 28.526-27.94 71.9-17.993 79.433 19.603a56.905 56.905 0 0 1-12.068 43.885c-51.64 54.419-103.205 109.422-159.452 158.867-68.9 60.562-149.577 70.582-233.691 33.865-81.335-35.475-131.292-115.42-131.511-203.996z m278.382-136.045L610.962 372.59A51.2 51.2 0 1 1 683.374 445L445.44 682.935a51.2 51.2 0 1 1-72.411-72.412z" p-id="14185"></path></svg></span><span>引用</span></button>


                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="favorite" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="bookmark"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"/></svg></span><span>收藏</span></button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="essential" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="line"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                            </svg></span><span>设为精华</span></button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="rewind" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="solid"><svg t="1791301036246" class="icon" viewBox="0 0 1125 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6467" width="200" height="200"><path d="M446.257277 951.034813a48.66778 48.66778 0 0 1 61.582618-35.898872c15.395654 5.107563 30.791309 5.107563 46.186964 10.288091a49.324466 49.324466 0 1 1-15.395655 97.48149c-20.503218-5.107563-35.898872-5.107563-56.402089-10.288091A47.135511 47.135511 0 0 1 446.257277 951.034813z m287.263941-46.186963a52.097143 52.097143 0 0 1 66.690181 35.898872 50.273014 50.273014 0 0 1-35.898872 66.690181c-20.503218 5.107563-35.898872 10.288091-56.402089 15.395654a52.316039 52.316039 0 0 1-20.503218-102.589053z m-461.650737-71.797744a49.835223 49.835223 0 0 1 71.797744-5.107563 155.853639 155.853639 0 0 0 35.898872 25.61078 52.097143 52.097143 0 0 1-56.40209 87.558225 281.864517 281.864517 0 0 1-46.186963-35.898872 54.504995 54.504995 0 0 1-5.107563-71.797744z m692.439624 56.402089a361.542501 361.542501 0 0 1-46.186964 35.898872 51.294526 51.294526 0 0 1-61.582618-82.085835 90.039041 90.039041 0 0 0 25.610781-20.503218l10.288091-10.288091 5.107563-5.107563 5.107564-5.107563a406.634987 406.634987 0 0 0 117.984707-292.371504 410.356211 410.356211 0 0 0-820.712423 0 51.294526 51.294526 0 0 1-102.589052 0 512.945264 512.945264 0 0 1 1025.817562 5.107563 529.727257 529.727257 0 0 1-148.776016 364.169248l-5.107563 5.107563z" p-id="6468"></path><path d="M112.879338 669.316226L10.290286 546.223956A74.13263 74.13263 0 0 1 0.002194 510.325084a49.324466 49.324466 0 0 1 30.791309-46.186963h220.57376a30.864274 30.864274 0 0 1 20.503218 5.107563 46.478824 46.478824 0 0 1 30.791309 46.186963 94.854743 94.854743 0 0 1-10.288092 35.898872L189.71168 674.642685l-5.107563 5.107563c-5.107563 5.107563-10.288091 5.107563-15.395654 10.288092h-41.006435c-5.107563 0-10.288091-5.107563-15.395655-10.288092z m446.255084-410.356211V520.54021a54.57796 54.57796 0 0 0 51.07563 46.186964h158.991143a54.57796 54.57796 0 0 0 46.186963-51.075631v-5.107563a54.57796 54.57796 0 0 0-51.075631-46.186964H661.723474V254.071348a54.57796 54.57796 0 0 0-51.07563-46.186964 48.448884 48.448884 0 0 0-51.586388 50.856736z" p-id="6469"></path></svg></span><span>回溯</span></button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="edit" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="line"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                            </svg></span><span>编辑</span></button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="recall" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="solid"><svg t="1791303339408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19353" width="200" height="200"><path d="M862.993067 924.16h5.9392c16.145067 0 27.6992-17.271467 38.843733-34.116267 35.208533-207.803733 11.502933-366.984533-70.468267-473.156266-29.969067-36.283733-71.645867-71.645867-111.394133-94.5152-29.166933-17.698133-70.843733-29.696-111.172267-41.284267l-0.392533-0.1024c-34.594133-5.802667-70.365867-11.793067-93.764267-11.793067h-2.56V153.941333c-2.935467-17.493333-9.472-39.0656-34.030933-51.438933-22.254933-11.229867-50.449067 5.819733-56.029867 11.400533L138.6496 399.342933l-0.1024 0.085334c-28.330667 22.903467-40.413867 45.431467-40.413867 75.3664 0 34.440533 28.4672 56.712533 32.887467 56.900266l0.989867 0.0512 0.802133 0.699734 283.2896 279.483733c22.954667 23.04 45.1584 28.7232 67.84 17.390933 27.818667-16.861867 34.116267-56.541867 34.116267-63.146666v-109.0048l1.877333-0.512c66.5088-18.3296 131.805867-11.741867 179.131733 18.107733 94.225067 65.348267 130.628267 208.264533 130.986667 209.7152l0.068267 0.6144v11.281067c12.322133 24.610133 24.029867 27.784533 32.8704 27.784533z m-134.024534-317.730133c-38.9632-22.459733-96.8704-36.5568-131.498666-38.382934-35.328-1.860267-75.400533 0.648533-119.0912 7.458134l-22.647467 7.867733v155.409067c0 6.434133-2.577067 11.332267-6.7072 12.8-0.768 0.273067-1.655467 0.4608-2.6624 0.4608-3.2256 0-7.611733-1.860267-13.0048-8.516267L184.832 482.048c-0.750933-0.750933-6.1952-6.4512-6.1952-12.731733 0-1.5872 1.245867-7.6288 17.288533-18.466134L445.0816 178.346667h9.1648v8.0384l1.467733 166.912h24.7296c0.7168 0.034133 63.3344 2.474667 117.4016 7.901866l0.477867 0.1024c6.877867 2.082133 13.8752 4.061867 21.2992 6.144 51.438933 14.523733 109.738667 30.976 153.207467 89.2928 51.0976 67.0208 96.853333 147.968 85.5552 285.218134l-0.8192 10.018133-4.061867-9.181867c-22.510933-50.858667-66.747733-99.2768-124.535467-136.362666z" fill="currentColor" stroke="currentColor" stroke-width="18" stroke-linejoin="round" p-id="19354"></path></svg></span><span>撤回</span></button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="select">
                            <span class="wc-group-bubble-menu-icon" data-wcg-icon-render="line">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/></svg>
                            </span><span>多选</span>
                        </button>
                        <button type="button" class="wc-bubble-menu-item" data-group-menu-action="delete" ><span class="wc-group-bubble-menu-icon" data-wcg-icon-render="line"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg></span><span>删除</span></button>
                    </div>
                </div>
            </div>
            <!-- Group adaptation of the existing private-chat wc-edit-msg editor. -->
            <div class="wc-edit-msg-overlay wc-group-edit-msg-overlay" id="wcGroupEditMsgOverlay" aria-hidden="true">
                <div class="wc-edit-msg-panel" id="wcGroupEditMsgPanel" role="dialog" aria-modal="true" aria-labelledby="wcGroupEditMsgTitle">
                    <div class="wc-edit-msg-header">
                        <div class="wc-edit-msg-heading">
                            <div class="wc-edit-msg-title" id="wcGroupEditMsgTitle">编辑消息</div>
                            <div class="wc-edit-msg-subtitle">修正内容、角色、格式与时间</div>
                        </div>
                        <button type="button" class="wc-edit-msg-repair-btn" id="wcGroupEditMsgRepair">自动识别</button>
                    </div>
                    <div class="wc-edit-msg-scroll">
                        <div class="wc-edit-msg-section">
                            <div class="wc-edit-msg-section-label">消息角色</div>
                            <div class="wc-edit-msg-segment" id="wcGroupEditMsgRoles">
                                <button type="button" class="wc-edit-msg-segment-btn" data-role="system">system</button>
                                <button type="button" class="wc-edit-msg-segment-btn" data-role="user">user</button>
                                <button type="button" class="wc-edit-msg-segment-btn" data-role="char">char</button>
                            </div>
                        </div>
                        <div class="wc-edit-msg-section wc-group-edit-speaker-section" id="wcGroupEditMsgSpeakerSection">
                            <label class="wc-edit-msg-section-label" for="wcGroupEditMsgSpeaker">选择发言角色</label>
                            <select class="wc-edit-msg-input" id="wcGroupEditMsgSpeaker" aria-label="这句话是哪个角色说的"></select>
                            <div class="wc-edit-msg-repair-hint" id="wcGroupEditMsgSpeakerHint">仅显示当前群聊中的角色和 NPC。</div>
                        </div>
                        <div class="wc-edit-msg-section">
                            <div class="wc-edit-msg-section-label">转换格式</div>
                            <div class="wc-edit-msg-format-grid" id="wcGroupEditMsgFormats">
                                <button type="button" class="wc-edit-msg-format-btn" data-format="text">文本</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="translation">翻译</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="voice">语音</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="emoji">表情包</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="redpacket">红包</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="image">图片</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="action">动描</button>
                                <button type="button" class="wc-edit-msg-format-btn" data-format="other">其他</button>
                            </div>
                        </div>
                        <div class="wc-edit-msg-section wc-edit-msg-content-section">
                            <div class="wc-edit-msg-field">
                                <label class="wc-edit-msg-field-label" id="wcGroupEditMsgPrimaryLabel" for="wcGroupEditMsgTextarea">消息文本</label>
                                <textarea id="wcGroupEditMsgTextarea" placeholder="请输入消息内容..."></textarea>
                            </div>
                            <div class="wc-edit-msg-field" id="wcGroupEditMsgTranslationField" hidden>
                                <label class="wc-edit-msg-field-label" for="wcGroupEditMsgTranslationTextarea">翻译</label>
                                <textarea id="wcGroupEditMsgTranslationTextarea" placeholder="请输入译文..."></textarea>
                            </div>
                            <div class="wc-edit-msg-field" id="wcGroupEditMsgImageField" hidden>
                                <label class="wc-edit-msg-field-label" for="wcGroupEditMsgImageUrl">图片地址</label>
                                <input type="text" class="wc-edit-msg-input" id="wcGroupEditMsgImageUrl" placeholder="粘贴图片 URL">
                            </div>
                        </div>
                        <div class="wc-edit-msg-section">
                            <label class="wc-edit-msg-field-label" for="wcGroupEditMsgTimeInput">消息时间</label>
                            <input class="wc-edit-msg-input wc-edit-msg-time-input" type="datetime-local" id="wcGroupEditMsgTimeInput">
                            <div class="wc-edit-msg-repair-hint" id="wcGroupEditMsgRepairHint"></div>
                        </div>
                    </div>
                    <div class="wc-edit-msg-actions">
                        <button type="button" class="wc-edit-msg-btn cancel" id="wcGroupEditMsgCancel">取消</button>
                        <button type="button" class="wc-edit-msg-btn save" id="wcGroupEditMsgSave">保存</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- iOS speaker sheet, independent from common group dialogs. -->
        <div id="wcGroupSpeakerSheet" hidden aria-hidden="true">
            <section class="wcg-pick-speaker-sheet" role="dialog" aria-modal="true" aria-labelledby="wcGroupSpeakerTitle" aria-describedby="wcGroupSpeakerSubtitle" tabindex="-1">
                <div class="wcg-pick-speaker-grab" aria-hidden="true"><div class="wcg-pick-speaker-handle"></div></div>
                <header class="wcg-pick-speaker-head">
                    <strong class="wcg-pick-speaker-title" id="wcGroupSpeakerTitle">指定发言</strong>
                    <span class="wcg-pick-speaker-subtitle" id="wcGroupSpeakerSubtitle">选择一位角色继续聊天</span>
                </header>
                <label class="wcg-pick-speaker-search" hidden>
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
                    <input id="wcGroupSpeakerSearch" type="search" autocomplete="off" aria-label="搜索可发言成员" placeholder="搜索群成员">
                </label>
                <div class="wcg-pick-speaker-scroll">
                    <div class="wcg-pick-speaker-count" id="wcGroupSpeakerCount"></div>
                    <div class="wcg-pick-speaker-list" id="wcGroupSpeakerList"></div>
                    <div class="wcg-pick-speaker-empty" id="wcGroupSpeakerEmpty" hidden></div>
                </div>
                <footer class="wcg-pick-speaker-footer">
                    <button class="wcg-pick-speaker-cancel" id="wcGroupSpeakerCancel" type="button">取消</button>
                </footer>
            </section>
        </div>
        <div id="wcGroupPanel" class="wc-group-panel" hidden aria-hidden="true" onclick="if(event.target===this) WcGroupChat.closePanel()">
            <section class="wc-group-panel-sheet" role="dialog" aria-modal="true" aria-labelledby="wcGroupPanelTitle"><div class="wc-group-panel-header"><button class="wc-group-panel-back" type="button" onclick="WcGroupChat.backFromPanel()" aria-label="返回上一页"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="14 18 8 12 14 6"></polyline></svg></button><strong id="wcGroupPanelTitle"></strong><button id="wcGroupPanelClose" class="wc-group-panel-close" type="button" onclick="WcGroupChat.closePanel()">完成</button><button id="wcGroupPanelSave" class="wc-group-panel-save" type="submit" form="wcGroupSettingsForm" hidden>保存</button><button id="wcGroupPanelEssenceFilter" class="wc-group-panel-essence-filter" type="button" aria-label="筛选精华消息" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 17h16"></path><circle cx="9" cy="7" r="3" fill="#fff"></circle><circle cx="16" cy="17" r="3" fill="#fff"></circle></svg></button></div><div id="wcGroupPanelBody"></div></section>
            <div id="wcGroupAvatarMenuOverlay" class="wc-group-avatar-menu-overlay" hidden>
                <div id="wcGroupAvatarSourceItems" class="wc-group-avatar-source-items" role="dialog" aria-label="群头像来源"></div>
            </div>
            <input id="wcGroupAvatarFilePicker" type="file" accept="image/*" hidden>
        </div>
        <div class="wechat-home-indicator" onclick="closeWechatApp()"></div>
    </div>`;

    window.mountWechatMarkup = function mountWechatMarkup() {
        if (document.getElementById('wechatAppUI')) return;
        const target = document.querySelector('.screen') || document.querySelector('.iphone') || document.body;
        if (!target || !window.WC_APP_HTML) return;
        target.insertAdjacentHTML('beforeend', window.WC_APP_HTML);
    };

    window.mountWechatMarkup();
})();



