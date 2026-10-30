/*!
 * Bootstrap Icons camera-fill, https://github.com/twbs/icons
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019-2024 The Bootstrap Authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
{
    const contactsHTML = `    <div class="contacts-app-container" id="contactsAppUI" aria-hidden="true">
        <div class="ct-page is-active" data-page="main">
            <header class="ct-header">
                <button class="ct-nav-circle-btn" type="button" data-action="close-app" aria-label="返回桌面">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="ct-header-menu-wrap">
                    <button class="ct-nav-capsule-btn" type="button" data-action="toggle-edit" id="ctEditMenuItem">
                        <span id="ctEditMenuLabel">编辑</span>
                    </button>
                </div>
            </header>

            <main class="ct-scroll ct-main-scroll">
                <h1 class="ct-large-title" id="ctMainLargeTitle">Character</h1>
                <div class="ct-search-bar-container">
                    <div class="ct-search-bar">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="搜索">
                    </div>
                </div>

                <section class="ct-view is-active" data-view="char">
                    <div class="ct-list-card">
                        <div class="ct-list-item" data-action="add-group">
                            <div class="ct-icon-wrapper" style="color: var(--ct-blue);">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                </svg>
                            </div>
                            <div class="ct-item-text">创建分组</div>
                            <div class="ct-item-right">
                                <svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                            </div>
                        </div>
                        <div class="ct-list-item" data-action="add-current">
                            <div class="ct-icon-wrapper" style="color: #34c759;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <g id="person-pin-fill">
                                    <path id="Union" fill="currentColor" d="M20 2c1.1046 0 2 0.89543 2 2v13c0 1.1046 -0.8954 2 -2 2h-5.0859l-2.2071 2.207c-0.3905 0.3906 -1.0235 0.3906 -1.414 0L9.08594 19H4c-1.10457 0 -2 -0.8954 -2 -2V4c0 -1.10457 0.89543 -2 2 -2zm-8 11.5c-2.63595 0 -4.48919 0.6126 -5.55078 1.1055C5.44938 15.0698 5 16.0728 5 17h14c0 -0.9272 -0.4494 -1.9302 -1.4492 -2.3945C16.4892 14.1126 14.636 13.5 12 13.5m0 -8c-1.933 0 -3.5 1.567 -3.5 3.5s1.567 3.5 3.5 3.5 3.5 -1.567 3.5 -3.5 -1.567 -3.5 -3.5 -3.5"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="ct-item-text">创建角色</div>
                            <div class="ct-item-right">
                                <svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                            </div>
                        </div>
                        <div id="ctGroupsList"></div>
                    </div>
                </section>

                <section class="ct-view" data-view="user">
                    <div class="ct-list-card">
                        <div class="ct-list-item" data-action="add-current">
                            <div class="ct-icon-wrapper" style="color: #34c759;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <g id="person-pin-fill">
                                    <path id="Union" fill="currentColor" d="M20 2c1.1046 0 2 0.89543 2 2v13c0 1.1046 -0.8954 2 -2 2h-5.0859l-2.2071 2.207c-0.3905 0.3906 -1.0235 0.3906 -1.414 0L9.08594 19H4c-1.10457 0 -2 -0.8954 -2 -2V4c0 -1.10457 0.89543 -2 2 -2zm-8 11.5c-2.63595 0 -4.48919 0.6126 -5.55078 1.1055C5.44938 15.0698 5 16.0728 5 17h14c0 -0.9272 -0.4494 -1.9302 -1.4492 -2.3945C16.4892 14.1126 14.636 13.5 12 13.5m0 -8c-1.933 0 -3.5 1.567 -3.5 3.5s1.567 3.5 3.5 3.5 3.5 -1.567 3.5 -3.5 -1.567 -3.5 -3.5 -3.5"></path>
                                  </g>
                                </svg>
                            </div>
                            <div class="ct-item-text">创建面具</div>
                            <div class="ct-item-right">
                                <svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                            </div>
                        </div>
                        <div id="ctUsersList"></div>
                    </div>
                </section>
            </main>

            <nav class="ct-floating-tabs" aria-label="联系人类型">
                <button class="ct-tab is-active" type="button" data-action="switch-tab" data-tab="char" aria-label="Char">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20.1025 8.50488c0.5042 0.05133 0.8975 0.47744 0.8975 0.99512v9c0 0.5523 -0.4477 1 -1 1 -2.6627 0 -4.7702 1.2097 -7.4268 3.0693 -0.3442 0.2409 -0.8022 0.2409 -1.1464 0C8.77019 20.7097 6.6627 19.5 4 19.5c-0.55228 0 -1 -0.4477 -1 -1v-9l0.00488 -0.10254C3.05621 8.89333 3.48232 8.5 4 8.5c3.06714 0 5.90711 1.7418 8 3.2598C14.0929 10.2418 16.9329 8.5 20 8.5zM12 1.5c2.2091 0 4 1.79086 4 4s-1.7909 4 -4 4c-2.20914 0 -4 -1.79086 -4 -4s1.79086 -4 4 -4"></path>
                    </svg>
                    <span class="ct-tab-text">角色</span>
                </button>
                <button class="ct-tab" type="button" data-action="switch-tab" data-tab="user" aria-label="User">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H2a2 2 0 0 1 -2 -2zm9 1.5a0.5 0.5 0 0 0 0.5 0.5h4a0.5 0.5 0 0 0 0 -1h-4a0.5 0.5 0 0 0 -0.5 0.5M9 8a0.5 0.5 0 0 0 0.5 0.5h4a0.5 0.5 0 0 0 0 -1h-4A0.5 0.5 0 0 0 9 8m1 2.5a0.5 0.5 0 0 0 0.5 0.5h3a0.5 0.5 0 0 0 0 -1h-3a0.5 0.5 0 0 0 -0.5 0.5m-1 2C9 10.567 7.21 9 5 9c-2.086 0 -3.8 1.398 -3.984 3.181A1 1 0 0 0 2 13h6.96q0.04 -0.245 0.04 -0.5M7 6a2 2 0 1 0 -4 0 2 2 0 0 0 4 0"></path>
                    </svg>
                    <span class="ct-tab-text">用户</span>
                </button>
            </nav>
            <button class="ct-home-indicator" type="button" data-action="close-app" aria-label="关闭联系人"></button>
        </div>

        <div class="ct-page" data-page="contact-editor">
            <div class="ct-drawer-backdrop" data-action="back-main"></div>
            <div class="ct-drawer-wrapper">
                <div class="ct-drawer-bg-card"></div>
                <div class="ct-drawer-main">
                    <header class="ct-header" style="justify-content: space-between; align-items: center;">
                        <button class="ct-nav-circle-btn" type="button" data-action="back-main" aria-label="返回">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="ct-title" id="ctContactEditorTitle" style="display: none;">新建角色</div>
                        <button class="ct-nav-capsule-btn" type="button" data-action="save-contact">完成</button>
                    </header>
                    <main class="ct-scroll ct-editor-scroll">
                        <div class="ct-profile-editor">
                            <button class="ct-avatar ct-avatar-large" type="button" data-action="pick-contact-avatar" aria-label="选择头像">
                                <span id="ctContactAvatarPreview"></span>
                                <div class="ct-avatar-speech-bubble">Oㅈo：뭐?</div>
                            </button>
                            <div class="ct-name-subtitle"><span class="ct-highlight-text">CHARACTER · 角色</span></div>
                            <input class="ct-name-input" id="ctContactName" type="text" maxlength="40" placeholder="输入角色名称">
                        </div>

                        <div class="ct-action-tabs" role="tablist">
                    <button class="ct-action-tab is-active" type="button" data-action="switch-section" data-section="persona">
                        <span class="ct-action-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="m4.16 21.633 -0.002 0.002 -0.79 0.741 1.076 0.12a7.785 7.785 0 0 0 2.691 -0.199c0.891 -0.234 1.828 -0.688 2.422 -1.532 0.786 0.154 1.604 0.235 2.443 0.235 6 0 11 -4.184 11 -9.5S18 2 12 2 1 6.184 1 11.5c0 3.236 1.866 6.065 4.668 7.77 -0.086 0.471 -0.377 0.994 -0.723 1.462a7.726 7.726 0 0 1 -0.773 0.89l-0.012 0.011Z"></path></svg></span><span>人设基础</span>
                    </button>
                    <button class="ct-action-tab" type="button" data-action="switch-section" data-section="advanced">
                        <span class="ct-action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5092 14.5901L20.2592 13.2701C20.4192 12.3081 20.3989 11.3247 20.1992 10.3701L21.4191 9.05011C21.5138 8.9446 21.5771 8.81468 21.6019 8.67508C21.6266 8.53547 21.6118 8.39173 21.5591 8.2601C21.0532 7.00967 20.3056 5.87128 19.3591 4.9101C19.2666 4.81762 19.1513 4.75133 19.0248 4.71796C18.8983 4.68458 18.7652 4.6853 18.6391 4.72009L16.7991 5.19009C16.2326 4.78274 15.6179 4.44687 14.9691 4.19009L14.5191 2.47009C14.4857 2.33059 14.4119 2.20405 14.307 2.10623C14.2021 2.00842 14.0706 1.94367 13.9291 1.92011C13.306 1.80317 12.6731 1.74623 12.0391 1.75009C11.2458 1.75342 10.4562 1.85759 9.68915 2.06009C9.56114 2.09227 9.44422 2.15856 9.35089 2.25189C9.25756 2.34522 9.19129 2.46212 9.15912 2.59012L8.67914 4.36011C8.14253 4.59838 7.63294 4.8934 7.15912 5.24011L5.33911 4.7901C5.21132 4.7567 5.07686 4.75858 4.95007 4.79556C4.82328 4.83255 4.70893 4.90323 4.61914 5.00009C3.62491 6.03296 2.86435 7.26755 2.3891 8.62012C2.34301 8.75085 2.33361 8.89168 2.36181 9.02741C2.39002 9.16313 2.45477 9.28856 2.54913 9.39011L3.80914 10.7001C3.74605 11.1206 3.7126 11.5449 3.7091 11.9701C3.7091 12.2701 3.70915 12.5701 3.75915 12.8701L2.44915 14.3301C2.361 14.4272 2.2998 14.5457 2.27173 14.6738C2.24365 14.8019 2.24965 14.935 2.28912 15.0601C2.70006 16.3823 3.38111 17.6048 4.28912 18.6501C4.38044 18.7575 4.50016 18.8369 4.63458 18.8794C4.769 18.9218 4.9127 18.9256 5.04913 18.8901L6.7691 18.4501C7.37095 18.9572 8.04503 19.3718 8.7691 19.6801L9.2691 21.4701C9.30762 21.5999 9.37971 21.7172 9.47802 21.8102C9.57634 21.9033 9.69741 21.9688 9.8291 22.0001C10.5511 22.1632 11.2889 22.2471 12.0291 22.2501C12.6195 22.2435 13.2084 22.1867 13.7891 22.0801C13.9272 22.0557 14.0556 21.9932 14.1599 21.8995C14.2642 21.8058 14.3402 21.6848 14.3791 21.5501L14.8491 19.8601C15.7125 19.5512 16.5173 19.0981 17.2291 18.5201L18.9891 18.9201C19.1211 18.9508 19.259 18.9446 19.3877 18.9023C19.5164 18.86 19.6311 18.7831 19.7191 18.6801C20.5957 17.7067 21.2749 16.5724 21.7191 15.3401C21.755 15.2078 21.7545 15.0682 21.7175 14.9362C21.6806 14.8041 21.6086 14.6846 21.5092 14.5901ZM12.1191 15.8601C11.3647 15.8621 10.6267 15.6401 9.99865 15.2222C9.37057 14.8043 8.88067 14.2094 8.59106 13.5128C8.30145 12.8162 8.22519 12.0493 8.37188 11.3093C8.51858 10.5693 8.8816 9.88949 9.41504 9.35605C9.94848 8.82261 10.6283 8.45953 11.3683 8.31284C12.1083 8.16615 12.8752 8.24244 13.5718 8.53204C14.2684 8.82165 14.8633 9.31156 15.2812 9.93964C15.6991 10.5677 15.9211 11.3057 15.9191 12.0601C15.9165 13.0671 15.5153 14.0321 14.8032 14.7442C14.0912 15.4563 13.1261 15.8575 12.1191 15.8601Z" fill="currentColor"/></svg></span><span>高级设置</span>
                    </button>
                    <button class="ct-action-tab" type="button" data-action="switch-section" data-section="security">
                        <span class="ct-action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.38 9.10028V7.51028C17.4113 6.78492 17.2955 6.06072 17.0394 5.38132C16.7834 4.70192 16.3926 4.08137 15.8904 3.55704C15.3882 3.03271 14.785 2.61544 14.1173 2.33038C13.4496 2.04533 12.731 1.89838 12.005 1.89838C11.279 1.89838 10.5605 2.04533 9.89272 2.33038C9.22498 2.61544 8.62184 3.03271 8.11964 3.55704C7.61745 4.08137 7.22657 4.70192 6.97057 5.38132C6.71456 6.06072 6.59871 6.78492 6.63 7.51028V9.10028C5.8651 9.15881 5.14858 9.49707 4.61731 10.0505C4.08604 10.6039 3.77727 11.3336 3.75 12.1003V19.0403C3.77613 19.8767 4.133 20.6686 4.74228 21.2423C5.35156 21.816 6.1635 22.1245 7 22.1003H17C17.8365 22.1245 18.6485 21.816 19.2577 21.2423C19.867 20.6686 20.2239 19.8767 20.25 19.0403V12.1003C20.223 11.3352 19.9156 10.6068 19.3864 10.0536C18.8572 9.50045 18.1431 9.16115 17.38 9.10028ZM8.13 7.51028C8.12744 7.00148 8.22601 6.49723 8.42 6.02686C8.61399 5.55648 8.89952 5.12937 9.26001 4.77029C9.98804 4.04498 10.9723 3.63543 12 3.63028C13.0282 3.63292 14.0136 4.04255 14.7407 4.76962C15.4677 5.49669 15.8774 6.48206 15.88 7.51028V9.07028H8.13V7.51028ZM15.47 18.9103H8.57001C8.30479 18.9103 8.05044 18.8049 7.8629 18.6174C7.67536 18.4299 7.57001 18.1755 7.57001 17.9103C7.57001 17.6451 7.67536 17.3907 7.8629 17.2032C8.05044 17.0156 8.30479 16.9103 8.57001 16.9103H15.51C15.7752 16.9103 16.0296 17.0156 16.2171 17.2032C16.4047 17.3907 16.51 17.6451 16.51 17.9103C16.51 18.1755 16.4047 18.4299 16.2171 18.6174C16.0296 18.8049 15.7752 18.9103 15.51 18.9103H15.47Z" fill="currentColor"/></svg></span><span>账号密码</span>
                    </button>
                    <button class="ct-action-tab" type="button" data-action="switch-section" data-section="npc">
                        <span class="ct-action-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" /></svg></span><span>NPC库</span>
                    </button>
                    <button class="ct-action-tab" type="button" data-action="choose-group">
                        <span class="ct-action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.99 7.325V5.17501C20.9918 4.6761 20.8307 4.19023 20.531 3.79131C20.2314 3.3924 19.8097 3.10227 19.33 2.96502C19.0044 2.87544 18.663 2.85836 18.33 2.915L11.82 3.915C11.5156 3.558 11.1456 3.26267 10.73 3.04501C10.1743 2.74349 9.55223 2.5854 8.92002 2.58501H5.84002C5.335 2.58236 4.83448 2.67987 4.36739 2.87191C3.90031 3.06395 3.47593 3.34671 3.11883 3.70382C2.76172 4.06092 2.47896 4.48527 2.28692 4.95235C2.09488 5.41944 1.99737 5.91999 2.00002 6.42501V17.585C1.9987 18.0892 2.09719 18.5886 2.28982 19.0546C2.48245 19.5205 2.76541 19.9437 3.12238 20.2997C3.47936 20.6558 3.90328 20.9376 4.36971 21.1291C4.83614 21.3205 5.33585 21.4176 5.84002 21.415H18.17C18.6732 21.416 19.1717 21.3176 19.6368 21.1254C20.1018 20.9332 20.5243 20.651 20.88 20.295C21.5935 19.573 21.9956 18.6001 22 17.585V9.885C22.002 8.93412 21.6407 8.0184 20.99 7.325ZM16.65 17.085H7.40002C7.1348 17.085 6.88044 16.9796 6.69291 16.7921C6.50537 16.6046 6.40002 16.3502 6.40002 16.085C6.40002 15.8198 6.50537 15.5654 6.69291 15.3779C6.88044 15.1904 7.1348 15.085 7.40002 15.085H16.65C16.9152 15.085 17.1696 15.1904 17.3571 15.3779C17.5447 15.5654 17.65 15.8198 17.65 16.085C17.65 16.3502 17.5447 16.6046 17.3571 16.7921C17.1696 16.9796 16.9152 17.085 16.65 17.085ZM19.53 6.37499C19.1135 6.22266 18.6735 6.14483 18.23 6.14501H13.83C13.6659 6.14419 13.5045 6.10298 13.36 6.02502C13.2194 5.94796 13.0993 5.8382 13.01 5.70501L12.78 5.36501L18.58 4.43499C18.6919 4.40965 18.8081 4.40965 18.92 4.43499C19.0312 4.46397 19.134 4.51879 19.22 4.59499C19.311 4.66411 19.3804 4.7578 19.42 4.86501C19.4692 4.96792 19.4932 5.08101 19.49 5.195L19.53 6.37499Z" fill="currentColor"/></svg></span><span>所属分组</span>
                    </button>
                </div>

                <section class="ct-editor-section is-active" data-section-panel="persona">
                    <div class="ct-settings-card">
                        <button class="ct-settings-row ct-import-row" type="button" data-action="import-persona">
                            <div class="ct-import-main">
                                <span class="ct-import-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.6801 7.01398C20.458 6.54993 20.1451 6.1351 19.76 5.79398L16.76 3.07398C16.0997 2.46873 15.2613 2.09339 14.37 2.004H8.21008C7.54764 1.97591 6.88617 2.07983 6.26428 2.30976C5.64239 2.53969 5.07249 2.89103 4.58765 3.3433C4.10281 3.79557 3.71274 4.33973 3.44019 4.94416C3.16763 5.54858 3.01797 6.20119 3 6.86399V17.164C3.03538 18.1635 3.36978 19.1294 3.95984 19.937C4.5499 20.7445 5.36855 21.3566 6.31006 21.694C6.92247 21.9255 7.57613 22.0277 8.22998 21.994H15.79C16.4525 22.0221 17.1138 21.9181 17.7357 21.6882C18.3576 21.4583 18.9276 21.107 19.4125 20.6547C19.8973 20.2024 20.2874 19.6582 20.5599 19.0538C20.8325 18.4494 20.982 17.7968 21 17.134V8.564C21.0048 8.03045 20.8958 7.502 20.6801 7.01398ZM15.8401 15.094L13.1801 17.764C13.0271 17.9131 12.8472 18.0319 12.65 18.114C12.5171 18.1738 12.3751 18.211 12.23 18.224C12.0983 18.254 11.9617 18.254 11.8301 18.224C11.6849 18.211 11.5429 18.1738 11.41 18.114C11.2128 18.0319 11.033 17.9131 10.88 17.764L8.21997 15.094C8.05614 14.9027 7.97063 14.6566 7.98035 14.4049C7.99007 14.1533 8.09437 13.9145 8.27246 13.7364C8.45056 13.5583 8.68924 13.454 8.94092 13.4443C9.19259 13.4346 9.4387 13.5202 9.63 13.684L11.03 15.084V10.474C11.03 10.2088 11.1353 9.95442 11.3229 9.76688C11.5104 9.57934 11.7648 9.474 12.03 9.474C12.2952 9.474 12.5496 9.57934 12.7372 9.76688C12.9247 9.95442 13.03 10.2088 13.03 10.474V15.084L14.4301 13.684C14.6214 13.5202 14.8675 13.4346 15.1191 13.4443C15.3708 13.454 15.6095 13.5583 15.7876 13.7364C15.9657 13.9145 16.07 14.1533 16.0797 14.4049C16.0894 14.6566 16.0039 14.9027 15.8401 15.094ZM16.0601 7.404C15.9174 7.40532 15.7759 7.37836 15.6437 7.32468C15.5115 7.271 15.3913 7.19164 15.2899 7.09122C15.1886 6.9908 15.1081 6.87129 15.0532 6.7396C14.9983 6.60791 14.97 6.46665 14.97 6.32398V3.67399C15.2509 3.82603 15.5215 3.99641 15.78 4.184L18.78 6.91398C18.9456 7.05349 19.0875 7.219 19.2001 7.404H16.0601Z" fill="currentColor"/></svg></span>
                                <div class="ct-row-content">
                                    <div class="ct-row-title">导入人设文档</div>
                                    <div class="ct-row-value">支持 TXT、DOCX、JSON</div>
                                </div>
                            </div>
                            <div class="ct-item-right"><svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                        </button>
                    </div>
                    <div class="ct-settings-card ct-textarea-card ct-persona-textarea">
                        <div class="ct-section-label" style="margin: 12px 16px 8px; font-size: 14px; color: var(--ct-text); font-weight: 400;"><span class="ct-highlight-text">About Me</span></div>
                        <textarea id="ctContactPersona" placeholder="点击此处输入角色人设、背景故事或性格设定..." style="padding-top: 0;"></textarea>
                    </div>
                </section>

                <section class="ct-editor-section" data-section-panel="advanced">
                    <div class="ct-settings-card">
                        <button class="ct-settings-row" type="button" data-action="open-voice">
                            <div class="ct-row-content"><div class="ct-row-title">语音设定</div></div>
                            <div class="ct-item-right"><svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                        </button>
                        <button class="ct-settings-row" type="button" data-action="open-appearance">
                            <div class="ct-row-content"><div class="ct-row-title">生图外貌</div></div>
                            <div class="ct-item-right"><svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                        </button>
                        <button class="ct-settings-row" type="button" data-action="choose-worldbooks">
                            <div class="ct-row-content">
                                <div class="ct-row-title">世界书选择</div>
                                <div class="ct-row-value" id="ctWorldbookStatus">未选择</div>
                            </div>
                            <div class="ct-item-right"><svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                        </button>
                        <button class="ct-settings-row" type="button" data-action="open-persona-export">
                            <div class="ct-row-content">
                                <div class="ct-row-title">导出人设</div>
                                <div class="ct-row-value">TXT / JSON · 含绑定世界书</div>
                            </div>
                            <div class="ct-item-right"><svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                        </button>
                    </div>
                </section>

                <section class="ct-editor-section" data-section-panel="security">
                    <div class="ct-settings-card ct-form-card">
                        <label><span>账号</span><input id="ctSecurityAccount" type="text" autocomplete="off" placeholder="输入账号"></label>
                        <label><span>手机号</span><input id="ctSecurityPhone" type="tel" inputmode="tel" autocomplete="off" placeholder="输入手机号"></label>
                        <label><span>密码</span><input id="ctSecurityPassword" type="password" autocomplete="new-password" placeholder="输入密码"><button class="ct-password-toggle" type="button" data-action="toggle-password" data-target="ctSecurityPassword" aria-label="显示密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/><path class="ct-password-slash" d="m4 4 16 16"/></svg></button></label>
                        <label><span>支付密码</span><input id="ctSecurityPayment" type="password" inputmode="numeric" autocomplete="off" placeholder="输入支付密码"><button class="ct-password-toggle" type="button" data-action="toggle-password" data-target="ctSecurityPayment" aria-label="显示支付密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/><path class="ct-password-slash" d="m4 4 16 16"/></svg></button></label>
                        <label><span>锁屏密码</span><input id="ctSecurityLock" type="password" inputmode="numeric" autocomplete="off" placeholder="输入锁屏密码"><button class="ct-password-toggle" type="button" data-action="toggle-password" data-target="ctSecurityLock" aria-label="显示锁屏密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/><path class="ct-password-slash" d="m4 4 16 16"/></svg></button></label>
                    </div>
                    <div class="ct-section-label">专属二维码</div>
                    <div class="ct-settings-card ct-qr-display">
                        <button id="ctQrPreview" type="button" data-action="open-qr-preview" aria-label="放大专属二维码"></button><span>由 API 生成</span>
                    </div>
                </section>

                <section class="ct-editor-section" data-section-panel="npc">
                    <div class="ct-settings-card">
                        <div id="ctNpcList"></div>
                        <button class="ct-settings-row ct-centered ct-primary" type="button" data-action="add-npc" style="color: var(--ct-text); font-weight: 500;">+ 添加 NPC</button>
                    </div>
                </section>

                <button class="ct-danger-card" id="ctDeleteContactButton" type="button" data-action="delete-contact">删除联系人</button>
            </main>
                </div>
            </div>
        </div>

        <div class="ct-page ct-role-settings" data-page="voice">
            <header class="ct-header">
                <button class="ct-nav-circle-btn" type="button" data-action="back-contact" aria-label="返回联系人资料"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <div class="ct-title">语音设定</div><span class="ct-header-spacer"></span>
            </header>
            <main class="ct-scroll ct-subpage-scroll">
                <div class="ct-section-label">语音供应商</div>
                <div class="ct-voice-providers" id="ctVoiceProviders" role="group" aria-label="语音供应商">
                    <button class="is-active" type="button" data-action="voice-provider" data-provider="minimax">MiniMax</button>
                    <button type="button" data-action="voice-provider" data-provider="elevenlabs">ElevenLabs</button>
                    <button type="button" data-action="voice-provider" data-provider="mossland">Mossland</button>
                    <button type="button" data-action="voice-provider" data-provider="sovits">SoVITS</button>
                </div>
                <div class="ct-provider is-active" data-provider-panel="minimax">
                    <div class="ct-section-label">全局音色配置</div>
                    <div class="ct-settings-card ct-single-input"><input id="ctVoiceMinimax" type="text" placeholder="请输入全局音色标识符..."></div>
                    <p class="ct-provider-tip">填写 MiniMax 控制台中的音色 ID，留空时使用全局默认音色。</p>
                </div>
                <div class="ct-provider" data-provider-panel="elevenlabs">
                    <div class="ct-section-label">ElevenLabs 专属配置</div>
                    <div class="ct-settings-card ct-single-input"><input id="ctVoiceElevenlabs" type="text" placeholder="请输入 Voice ID..."></div>
                    <p class="ct-provider-tip">填写 ElevenLabs Voice Library 或自定义声音中的 Voice ID。</p>
                </div>
                <div class="ct-provider" data-provider-panel="mossland">
                    <div class="ct-section-label">Mossland 专属配置</div>
                    <div class="ct-settings-card ct-single-input"><input id="ctVoiceMossland" type="text" placeholder="请输入 Voice ID..."></div>
                    <p class="ct-provider-tip">填写 Mossland 音色库或账号音色列表中的 Voice ID；留空时使用全局 Mossland 预设音色。</p>
                </div>
                <div class="ct-provider" data-provider-panel="sovits">
                    <div class="ct-section-label">GPT-SoVITS 专属配置</div>
                    <div class="ct-settings-card ct-form-card ct-voice-form">
                        <label><span>参考音频</span><input id="ctVoiceSovits" type="text" placeholder="输入音频路径或 URL"></label>
                        <label><span>参考文本</span><input id="ctVoiceSovitsPromptText" type="text" placeholder="输入参考音频对应文本"></label>
                        <label><span>参考语言</span><select id="ctVoiceSovitsPromptLanguage">
                            <option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option><option value="yue">粤语</option><option value="ko">韩文</option>
                        </select></label>
                        <label><span>合成语言</span><select id="ctVoiceSovitsTextLanguage">
                            <option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option><option value="yue">粤语</option><option value="ko">韩文</option><option value="auto">自动识别</option>
                        </select></label>
                    </div>
                    <p class="ct-provider-tip">参考文本需与音频内容一致；语言选择应与参考音频和待合成文本匹配。</p>
                </div>
            </main>
        </div>

        <div class="ct-page ct-role-settings" data-page="appearance">
            <header class="ct-header">
                <button class="ct-nav-circle-btn" type="button" data-action="back-contact" aria-label="返回联系人资料">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="ct-title">生图外貌</div><span class="ct-header-spacer ct-appearance-header-spacer"></span>
            </header>
            <main class="ct-scroll ct-subpage-scroll">
                <div class="ct-section-label">外貌特征描述</div>
                <div class="ct-settings-card ct-textarea-card ct-tall-textarea">
                    <textarea id="ctContactAppearance" maxlength="10000" aria-label="外貌特征描述" placeholder="描述角色的五官、发型、体型与服装…"></textarea>
                </div>
                <div class="ct-section-label">锁脸参考图</div>
                <div class="ct-settings-card ct-reference-card">
                    <button class="ct-reference-picker" id="ctReferencePicker" type="button" data-action="pick-reference-image" aria-label="上传锁脸参考图">
                        <div class="ct-reference-preview" id="ctReferencePreview" aria-hidden="true"></div>
                        <span class="ct-reference-empty" id="ctReferenceEmpty" aria-hidden="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-fill" aria-hidden="true" viewBox="0 0 16 16">
                              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                            </svg>
                            <strong id="ctReferenceActionText">上传参考图</strong>
                            <em>正脸或全身角色图效果更稳定</em>
                        </span>
                    </button>
                    <div class="ct-reference-actions">
                        <button class="ct-reference-remove" id="ctReferenceRemove" type="button" data-action="remove-reference-image" aria-label="移除锁脸参考图">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M10 11v6M14 11v6"></path><path d="M6.5 7l1 13h9l1-13"></path><path d="M9 7V4h6v3"></path></svg>
                        </button>
                    </div>
                </div>
                <p class="ct-provider-tip">参考图仅用于当前角色；支持 gpt-image-1 与 NovelAI V4.5 的角色参考。</p>
            </main>
        </div>

        <div class="ct-page" data-page="npc-editor">
            <div class="ct-drawer-backdrop" data-action="cancel-npc"></div>
            <div class="ct-drawer-wrapper">
                <div class="ct-drawer-bg-card"></div>
                <div class="ct-drawer-main">
                    <header class="ct-header" style="justify-content: space-between; align-items: center;">
                        <button class="ct-nav-circle-btn" type="button" data-action="cancel-npc" aria-label="返回">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="ct-title" id="ctNpcEditorTitle" style="display: none;">新建 NPC</div>
                        <button class="ct-nav-capsule-btn" type="button" data-action="save-npc">完成</button>
                    </header>
                    <main class="ct-scroll ct-editor-scroll">
                        <div class="ct-profile-editor">
                            <div class="ct-avatar ct-avatar-large">
                                <span class="ct-avatar-placeholder"></span>
                                <div class="ct-avatar-speech-bubble">Oㅈo：뭐?</div>
                            </div>
                            <div class="ct-name-subtitle"><span class="ct-highlight-text">FRIEND · NPC</span></div>
                            <input class="ct-name-input" id="ctNpcName" type="text" maxlength="40" placeholder="输入 NPC 名称">
                        </div>
                        <div class="ct-settings-card ct-form-card">
                            <label><span>身份/关系</span><input id="ctNpcRole" type="text" maxlength="80" placeholder="例如：店员、朋友、敌人..."></label>
                        </div>
                        <div class="ct-settings-card ct-textarea-card ct-tall-textarea">
                            <div class="ct-section-label" style="margin: 12px 16px 8px; font-size: 14px; color: var(--ct-text); font-weight: 400;"><span class="ct-highlight-text">About Me</span></div>
                            <textarea id="ctNpcPersona" placeholder="输入该 NPC 的性格、背景、行为逻辑等..." style="padding-top: 0;"></textarea>
                        </div>
                <button class="ct-danger-card" id="ctDeleteNpcButton" type="button" data-action="delete-npc" style="width: calc(100% - 32px);">删除 NPC</button>
            </main>
                </div>
            </div>
        </div>

        <div class="ct-page" data-page="user-editor">
            <div class="ct-drawer-backdrop" data-action="back-main"></div>
            <div class="ct-drawer-wrapper">
                <div class="ct-drawer-bg-card"></div>
                <div class="ct-drawer-main">
                    <header class="ct-header" style="justify-content: space-between; align-items: center;">
                        <button class="ct-nav-circle-btn" type="button" data-action="back-main" aria-label="返回">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="ct-title" id="ctUserEditorTitle" style="display: none;">新建 User</div>
                        <button class="ct-nav-capsule-btn" type="button" data-action="save-user">完成</button>
                    </header>
                    <main class="ct-scroll ct-editor-scroll">
                        <div class="ct-profile-editor">
                            <button class="ct-avatar ct-avatar-large" type="button" data-action="pick-user-avatar" aria-label="选择头像">
                                <span id="ctUserAvatarPreview"></span>
                                <div class="ct-avatar-speech-bubble">Oㅈo：뭐?</div>
                            </button>
                            <div class="ct-name-subtitle"><span class="ct-highlight-text">MASK · 面具</span></div>
                            <input class="ct-name-input" id="ctUserName" type="text" maxlength="40" placeholder="输入 User 名称">
                        </div>
                        <div class="ct-settings-card ct-form-card">
                            <label><span>手机号</span><input id="ctUserPhone" type="tel" inputmode="tel" autocomplete="off" placeholder="输入手机号"></label>
                            <label><span>性别</span><select id="ctUserGender" aria-label="面具性别"><option value="">未设置</option><option value="male">男性</option><option value="female">女性</option><option value="other">其他 / 非二元</option></select></label>
                        </div>
                        <div class="ct-settings-card ct-textarea-card">
                            <div class="ct-section-label" style="margin: 12px 16px 8px; font-size: 14px; color: var(--ct-text);">User 生图外貌</div>
                            <textarea id="ctUserAppearance" placeholder="填写该面具的外貌特征，例如发色、瞳色、体型与标志性特征；用于生成场景图片。" style="padding-top: 0; min-height: 110px;"></textarea>
                        </div>
                        <div class="ct-settings-card ct-textarea-card ct-tall-textarea">
                            <div class="ct-section-label" style="margin: 12px 16px 8px; font-size: 14px; color: var(--ct-text); font-weight: 400;"><span class="ct-highlight-text">About Me</span></div>
                            <textarea id="ctUserPersona" placeholder="输入该身份的背景、性格与表达习惯..." style="padding-top: 0;"></textarea>
                        </div>

                <button class="ct-danger-card" id="ctDeleteUserButton" type="button" data-action="delete-user" style="width: calc(100% - 32px);">删除 User</button>
            </main>
                </div>
            </div>
        </div>

        <div class="ct-picker-overlay" id="ctPickerOverlay" aria-hidden="true">
            <div class="ct-picker-sheet">
                <div class="ct-picker-handle"></div>
                <div class="ct-picker-header">
                    <button type="button" data-action="close-picker">取消</button>
                    <strong id="ctPickerTitle">选择</strong>
                    <button type="button" data-action="confirm-picker">完成</button>
                </div>
                <div class="ct-picker-search-container" id="ctPickerSearchContainer">
                    <div class="ct-picker-search-bar">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input id="ctPickerSearchInput" type="text" placeholder="搜索世界书条目...">
                    </div>
                </div>
                <div class="ct-picker-list" id="ctPickerList"></div>
            </div>
        </div>

        <div class="ct-dialog-overlay" id="ctDialogOverlay" aria-hidden="true">
            <div class="ct-dialog">
                <strong id="ctDialogTitle">提示</strong><p id="ctDialogMessage"></p>
                <input id="ctDialogInput" type="text" maxlength="40">
                <div class="ct-dialog-actions"><button type="button" data-action="cancel-dialog">取消</button><button class="ct-primary" type="button" data-action="confirm-dialog">确定</button></div>
            </div>
        </div>

        <div class="ct-dialog-overlay" id="ctPersonaExportOverlay" aria-hidden="true">
            <div class="ct-dialog" role="dialog" aria-modal="true" aria-labelledby="ctPersonaExportTitle">
                <strong id="ctPersonaExportTitle">导出人设</strong>
                <p>选择导出格式</p>
                <div class="ct-dialog-actions">
                    <button type="button" data-action="export-persona" data-format="txt">TXT</button>
                    <button class="ct-primary" type="button" data-action="export-persona" data-format="json">JSON</button>
                </div>
            </div>
        </div>

        <div class="ct-avatar-menu-overlay" id="ctContactAvatarMenuOverlay" aria-hidden="true">
            <div class="ct-avatar-menu" id="ctContactAvatarMenu" role="dialog" aria-label="avatar settings">
                <button class="ct-avatar-menu-item" type="button" data-action="pick-contact-avatar-file">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                    <span>照片图库</span>
                </button>
                <button class="ct-avatar-menu-item" type="button" data-action="pick-contact-avatar-url">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>使用 URL</span>
                </button>
            </div>
        </div>
        <div class="ct-toast" id="ctToast" role="status"></div>
        <input id="ctContactAvatarInput" type="file" accept="image/*" hidden>
        <input id="ctUserAvatarInput" type="file" accept="image/*" hidden>
        <input id="ctReferenceImageInput" type="file" accept="image/jpeg,image/png,image/webp" hidden>
        <input id="ctPersonaImportInput" type="file" accept=".txt,.docx,.json,text/plain,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden>
    </div>
</div>

<!-- ================= 新版 iCity 容器开始 (第 1 部分) ================= -->
<!-- ================= 新版 iCity 容器结束 ================= -->

<!-- 补回丢失的登录验证脚本 -->
<template id="meetingAppDocumentTemplate" hidden>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;zh-CN&quot;&gt;
&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover&quot;&gt;
    &lt;title&gt;iOS 悬浮胶囊 UI - 多窗口抽屉&lt;/title&gt;
    &lt;style&gt;
        /* 基础重置与 iOS 字体 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, &quot;SF Pro Text&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;
            background-color: #F2F2F7;
            color: #1C1C1E;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* 顶部导航栏 */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: calc(10px + env(safe-area-inset-top)) 16px 10px;
            z-index: 10;
            flex-shrink: 0;
            /* 移除原有的背景和边框，让底层透明 */
        }

        .header-left-capsule {
            display: flex;
            align-items: center;`;
    const contactsHost = document.getElementById('themeAppUI') || document.getElementById('meetingAppUI');
    if (contactsHost) {
        contactsHost.insertAdjacentHTML('afterend', contactsHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', contactsHTML);
    }
(function () {
    'use strict';

    const STORAGE_KEY = 'tonghuajiContactsAppData';
    const PERSONA_JSON_FORMAT = 'tonghuaji.persona';
    const PERSONA_JSON_VERSION = 1;
    const DEFAULT_DATA = {
        version: 1,
        groups: [],
        contacts: [],
        users: [],
        selectedTab: 'char',
        expandedGroupIds: ['all']
    };

    let root = null;
    let data = null;
    let currentPage = 'main';
    let previousPage = null;
    let editingContactId = null;
    let editingUserId = null;
    let editingNpcId = null;
    let contactDraft = null;
    let userDraft = null;
    let userSavePending = false;
    let npcDraft = null;
    let isEditMode = false;
    let pickerMode = null;
    let pickerSelection = [];
    let dialogConfirm = null;
    let toastTimer = null;
    let mainMenuOpen = false;
    let contactAvatarMenuOpen = false;
    let persistQueue = Promise.resolve();
    let migratedFromLocalStorage = false;
    let contactDeletePending = false;
    let characterReconcilePromise = null;
    let characterPurgeReady = false;
    let externalReturnCallback = null;
    let legacyIdSequence = 0;

    function makeId(prefix) {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return prefix + '_' + window.crypto.randomUUID();
        }
        legacyIdSequence += 1;
        return prefix + '_' + Date.now() + '_' + legacyIdSequence;
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeData(value) {
        const parsed = value && typeof value === 'object' ? value : {};
        return {
            version: 1,
            groups: Array.isArray(parsed.groups) ? parsed.groups.filter(Boolean) : [],
            contacts: Array.isArray(parsed.contacts) ? parsed.contacts.filter(Boolean) : [],
            users: Array.isArray(parsed.users) ? parsed.users.filter(Boolean) : [],
            selectedTab: parsed.selectedTab === 'user' ? 'user' : 'char',
            expandedGroupIds: Array.isArray(parsed.expandedGroupIds) ? parsed.expandedGroupIds : ['all']
        };
    }

    function openContactsDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('iOSDesktopDB');
            request.onerror = () => reject(request.error || new Error('联系人数据库打开失败'));
            request.onupgradeneeded = event => {
                const connection = event.target.result;
                if (!connection.objectStoreNames.contains('layoutStore')) connection.createObjectStore('layoutStore', { keyPath: 'id' });
            };
            request.onsuccess = () => {
                const connection = request.result;
                if (connection.objectStoreNames.contains('layoutStore')) {
                    resolve(connection);
                    return;
                }
                const version = connection.version;
                connection.close();
                const upgrade = indexedDB.open('iOSDesktopDB', version + 1);
                upgrade.onerror = () => reject(upgrade.error || new Error('联系人数据库升级失败'));
                upgrade.onupgradeneeded = event => event.target.result.createObjectStore('layoutStore', { keyPath: 'id' });
                upgrade.onsuccess = () => resolve(upgrade.result);
            };
        });
    }

    async function readContactsRecord() {
        const connection = await openContactsDb();
        return new Promise((resolve, reject) => {
            const transaction = connection.transaction(['layoutStore'], 'readonly');
            const request = transaction.objectStore('layoutStore').get('contactsAppData');
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error || new Error('联系人数据读取失败'));
            transaction.oncomplete = () => connection.close();
            transaction.onerror = () => reject(transaction.error || new Error('联系人数据读取失败'));
        });
    }

    function writeContactsRecord(snapshot = null, deletedContactIds = []) {
        return openContactsDb().then(connection => new Promise((resolve, reject) => {
            const cleanup = window.CharacterRecordCleanup;
            if (!cleanup) { connection.close(); reject(new Error('角色记录清理模块未就绪，请刷新后重试')); return; }
            const transaction = connection.transaction(['layoutStore'], 'readwrite');
            const store = transaction.objectStore('layoutStore');
            let result = null;
            let failure = null;
            const reconcile = sourceContacts => {
                const records = [];
                const request = store.openCursor();
                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) { records.push(cursor.value); cursor.continue(); return; }
                    try {
                        result = cleanup.plan(records, sourceContacts, deletedContactIds);
                        for (const record of result.writes) store.put(record);
                        for (const id of result.deletes) store.delete(id);
                        const prior = records.find(record => record.id === cleanup.key);
                        if (JSON.stringify(prior) !== JSON.stringify(result.deletion)) store.put(result.deletion);
                    } catch (error) { failure = error; transaction.abort(); }
                };
            };
            if (snapshot) {
                store.put({ id: 'contactsAppData', data: snapshot });
                if (deletedContactIds.length || !characterPurgeReady) reconcile(snapshot.contacts);
            } else {
                const sourceRequest = store.get('contactsAppData');
                sourceRequest.onsuccess = () => {
                    const sourceContacts = sourceRequest.result?.data?.contacts;
                    if (Array.isArray(sourceContacts)) reconcile(sourceContacts);
                };
            }
            transaction.oncomplete = () => {
                connection.close();
                if (result) { cleanup.adopt(result.deletion); characterPurgeReady = true; }
                if (snapshot && migratedFromLocalStorage) { localStorage.removeItem(STORAGE_KEY); migratedFromLocalStorage = false; }
                const changed = result && (result.writes.length || result.deletes.length || deletedContactIds.length);
                if ((snapshot || changed) && typeof window.triggerAutoLocalBackup === 'function') window.triggerAutoLocalBackup();
                if (changed) window.dispatchEvent(new CustomEvent('contacts:characters-deleted', {
                    detail: { contactIds: result.deletion.sourceIds, wechatContactIds: result.deletion.wechatIds, recordsPurged: true }
                }));
                resolve(true);
            };
            transaction.onabort = transaction.onerror = () => {
                connection.close(); reject(failure || transaction.error || new Error('角色与关联记录删除失败'));
            };
        }));
    }

    function reconcileCharacters() {
        if (characterPurgeReady) return Promise.resolve(true);
        if (characterReconcilePromise) return characterReconcilePromise;
        characterReconcilePromise = persistQueue.then(() => writeContactsRecord()).finally(() => {
            characterReconcilePromise = null;
        });
        persistQueue = characterReconcilePromise.catch(() => false);
        return characterReconcilePromise;
    }

    async function loadData() {
        try {
            const stored = await readContactsRecord();
            if (stored?.data) {
                data = normalizeData(stored.data);
                // Repair character copies left by older contact deletions.
                if (Array.isArray(stored.data.contacts)) await persist();
                return;
            }
            const legacy = localStorage.getItem(STORAGE_KEY);
            if (legacy) {
                data = normalizeData(JSON.parse(legacy));
                migratedFromLocalStorage = true;
                await persist();
                return;
            }
            data = clone(DEFAULT_DATA);
        } catch (error) {
            console.warn('Contacts data could not be read:', error);
            data = clone(DEFAULT_DATA);
        }
    }

    function persist(deletedContactIds = []) {
        const snapshot = clone(data || DEFAULT_DATA);
        persistQueue = persistQueue.then(() => writeContactsRecord(snapshot, deletedContactIds)).catch(error => {
            console.error('Contacts data could not be saved:', error);
            showToast('联系人数据保存失败，请稍后重试');
            return false;
        });
        return persistQueue;
    }

    function emptyContact() {
        return {
            id: makeId('contact'),
            groupId: null,
            name: '',
            avatar: '',
            persona: '',
            appearance: '',
            referenceImage: '',
            worldbookIds: [],
            security: { account: '', phone: '', password: '', paymentPassword: '', lockPassword: '', qrCode: '' },
            voice: {
                provider: 'minimax',
                minimaxVoiceId: '',
                elevenlabsVoiceId: '',
                mosslandVoiceId: '',
                sovitsPath: '',
                sovitsPromptText: '',
                sovitsPromptLanguage: 'zh',
                sovitsTextLanguage: 'zh'
            },
            npcs: []
        };
    }

    function normalizedContact(contact) {
        const base = emptyContact();
        const source = contact || {};
        return {
            ...base,
            ...clone(source),
            security: { ...base.security, ...(source.security || {}) },
            voice: { ...base.voice, ...(source.voice || {}) },
            worldbookIds: Array.isArray(source.worldbookIds) ? source.worldbookIds.slice() : [],
            npcs: Array.isArray(source.npcs) ? clone(source.npcs) : []
        };
    }

    function emptyUser() {
        return { id: makeId('user'), name: '', phone: '', persona: '', avatar: '', gender: '', appearance: '' };
    }

    function el(selector) {
        return root ? root.querySelector(selector) : null;
    }

    function all(selector) {
        return root ? Array.from(root.querySelectorAll(selector)) : [];
    }

    function setText(selector, text) {
        const target = el(selector);
        if (target) target.textContent = text;
    }

    function setValue(selector, value) {
        const target = el(selector);
        if (target) target.value = value || '';
    }

    function getValue(selector) {
        const target = el(selector);
        return target ? target.value : '';
    }

    function getSafeAvatarUrl(value) {
        const rawUrl = String(value || '').trim();
        if (!rawUrl) return '';

        try {
            const url = new URL(rawUrl, window.location.href);
            const allowedProtocols = ['http:', 'https:', 'blob:', 'data:'];
            if (!allowedProtocols.includes(url.protocol)) return '';
            if (url.protocol === 'data:' && !/^data:image\//i.test(rawUrl)) return '';
            return url.href;
        } catch (error) {
            return '';
        }
    }

    function avatarContent(image, fallback) {
        const safeImageUrl = getSafeAvatarUrl(image);
        if (safeImageUrl) {
            const img = document.createElement('img');
            img.src = safeImageUrl;
            img.alt = '';
            return img;
        }
        const placeholder = document.createElement('span');
        placeholder.className = 'ct-avatar-placeholder';
        placeholder.textContent = '';
        return placeholder;
    }

    function fillAvatar(container, image, fallback) {
        if (!container) return;
        container.replaceChildren(avatarContent(image, fallback));
    }

    function createAvatar(image, fallback) {
        const avatar = document.createElement('span');
        avatar.className = 'ct-avatar';
        avatar.appendChild(avatarContent(image, fallback));
        return avatar;
    }

    function showToast(message) {
        const toast = el('#ctToast');
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add('is-active');
        toastTimer = setTimeout(() => toast.classList.remove('is-active'), 1800);
    }

    function showPage(pageName, direction) {
        const next = el('[data-page="' + pageName + '"]');
        const active = el('.ct-page.is-active');
        if (!next || active === next) return;

        setMainMenu(false);
        all('.ct-page').forEach(page => page.classList.remove('is-active', 'is-behind'));
        if (direction === 'forward' && active) active.classList.add('is-behind');
        next.classList.add('is-active');
        next.querySelector('.ct-scroll')?.scrollTo(0, 0);
        previousPage = currentPage;
        currentPage = pageName;
    }

    function goMain() {
        if (externalReturnCallback) {
            const cb = externalReturnCallback;
            externalReturnCallback = null;
            
            // 隐藏 ContactsApp
            setMainMenu(false);
            root.classList.remove('show');
            root.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                if (!root.classList.contains('show')) root.style.display = 'none';
            }, 160);
            
            // 悄悄重置回 main 页面，以便下次正常打开
            editingContactId = null;
            editingUserId = null;
            editingNpcId = null;
            contactDraft = null;
            userDraft = null;
            npcDraft = null;
            all('.ct-page').forEach(page => page.classList.remove('is-active', 'is-behind'));
            const mainPage = el('[data-page="main"]');
            if (mainPage) mainPage.classList.add('is-active');
            currentPage = 'main';
            previousPage = null;
            
            cb();
            return;
        }

        editingContactId = null;
        editingUserId = null;
        editingNpcId = null;
        contactDraft = null;
        userDraft = null;
        npcDraft = null;
        showPage('main', 'back');
        renderMain();
    }

    function openContactExternal(contactId, callback) {
        externalReturnCallback = callback;
        openContact(contactId);
    }

    function openUserExternal(userId, callback) {
        externalReturnCallback = callback;
        openUser(userId);
    }

    function closeApp() {
        if (currentPage !== 'main') {
            goMain();
            return;
        }
        setMainMenu(false);
        root.classList.remove('show');
        root.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            if (!root.classList.contains('show')) root.style.display = 'none';
            if (typeof window.syncStatusBarAfterReturnHome === 'function') window.syncStatusBarAfterReturnHome();
        }, 160);
    }

    function groupName(groupId) {
        if (!groupId) return '所有联系人';
        return data.groups.find(group => group.id === groupId)?.name || '所有联系人';
    }

    function contactCount(groupId) {
        if (groupId === 'all') return data.contacts.length;
        return data.contacts.filter(contact => contact.groupId === groupId).length;
    }

    function createGroupCard(group) {
        const groupId = group ? group.id : 'all';
        const card = document.createElement('section');
        card.className = 'ct-group';
        card.dataset.groupId = groupId;
        if (data.expandedGroupIds.includes(groupId)) card.classList.add('is-expanded');

        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'ct-group-header';
        header.dataset.action = 'toggle-group';
        header.dataset.groupId = groupId;

        const title = document.createElement('span');
        title.className = 'ct-group-title';
        title.innerHTML = '<div class="ct-icon-wrapper" style="color: #8e8e93;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" /></svg></div>';
        const name = document.createElement('span');
        name.className = 'ct-item-text';
        name.textContent = group ? group.name : '所有角色';
        title.appendChild(name);

        const rightWrap = document.createElement('div');
        rightWrap.className = 'ct-item-right';

        const count = document.createElement('span');
        count.className = 'ct-item-count';
        count.textContent = String(contactCount(groupId));
        
        if (group) {
            const remove = document.createElement('span');
            remove.className = 'ct-group-delete';
            remove.dataset.action = 'delete-group';
            remove.dataset.groupId = groupId;
            remove.textContent = '−';
            rightWrap.appendChild(remove);
        }

        const chevron = document.createElement('svg');
        chevron.className = 'ct-chevron';
        chevron.setAttribute('viewBox', '0 0 8 13');
        chevron.innerHTML = '<path d="M1.5 1.5L6.5 6.5L1.5 11.5"/>';
        
        rightWrap.appendChild(count);
        rightWrap.appendChild(chevron);
        header.append(title, rightWrap);

        const body = document.createElement('div');
        body.className = 'ct-group-body';
        const contacts = groupId === 'all' ? data.contacts : data.contacts.filter(contact => contact.groupId === groupId);
        if (!contacts.length) {
            const empty = document.createElement('div');
            empty.className = 'ct-empty';
            empty.textContent = '暂无角色';
            body.appendChild(empty);
        } else {
            contacts.forEach(contact => body.appendChild(createContactRow(contact)));
        }

        card.append(header, body);
        return card;
    }

    function createContactRow(contact) {
        const row = document.createElement('div');
        row.className = 'ct-contact-row';
        row.dataset.action = 'open-contact';
        row.dataset.contactId = contact.id;

        const remove = document.createElement('span');
        remove.className = 'ct-delete-dot';
        remove.textContent = '−';
        row.append(remove, createAvatar(contact.avatar, '角色'));

        const name = document.createElement('span');
        name.className = 'ct-contact-name';
        name.textContent = contact.name || '未命名角色';
        const generate = document.createElement('button');
        generate.type = 'button';
        generate.className = 'ct-contact-generate';
        generate.dataset.action = 'generate-contact';
        generate.dataset.contactId = contact.id;
        generate.title = '生成角色资料和微信二维码';
        generate.setAttribute('aria-label', '生成角色资料和微信二维码');
        generate.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M18.36 5.64l-2.83 2.83M8.47 15.53l-2.83 2.83"/><path d="M12 8.5 13.1 11l2.4 1-2.4 1-1.1 2.5-1.1-2.5-2.4-1 2.4-1L12 8.5Z"/></svg>';
        row.append(name, generate);
        return row;
    }

    function renderGroups() {
        const list = el('#ctGroupsList');
        if (!list) return;
        list.replaceChildren(createGroupCard(null), ...data.groups.map(createGroupCard));
        list.classList.toggle('is-editing', isEditMode);
        el('.ct-main-scroll')?.classList.toggle('is-editing', isEditMode);
    }

    function createUserCard(user) {
        const row = document.createElement('div');
        row.className = 'ct-list-item';
        row.dataset.action = 'open-user';
        row.dataset.userId = user.id;

        // 新增：删除红点
        const remove = document.createElement('span');
        remove.className = 'ct-delete-dot';
        remove.textContent = '−';

        const avatarWrap = document.createElement('div');
        avatarWrap.className = 'ct-avatar';
        avatarWrap.style.marginRight = '12px';
        avatarWrap.appendChild(avatarContent(user.avatar, 'User'));

        const info = document.createElement('div');
        info.className = 'ct-contact-info';
        const name = document.createElement('div');
        name.className = 'ct-contact-name';
        name.textContent = user.name || '未命名 User';
        info.appendChild(name);

        const right = document.createElement('div');
        right.className = 'ct-item-right';
        const chevron = document.createElement('svg');
        chevron.className = 'ct-chevron';
        chevron.setAttribute('viewBox', '0 0 8 13');
        chevron.innerHTML = '<path d="M1.5 1.5L6.5 6.5L1.5 11.5"/>';
        right.appendChild(chevron);

        // 将 remove 添加到最前面
        row.append(remove, avatarWrap, info, right);
        return row;
    }

    function renderUsers() {
        const list = el('#ctUsersList');
        if (!list) return;
        if (!data.users.length) {
            const empty = document.createElement('div');
            empty.className = 'ct-empty';
            empty.style.padding = '20px 0';
            empty.style.textAlign = 'center';
            empty.textContent = '暂无 User 信息';
            list.replaceChildren(empty);
            return;
        }
        list.replaceChildren(...data.users.map(createUserCard));
    }

    function switchTab(tab) {
        data.selectedTab = tab === 'user' ? 'user' : 'char';
        isEditMode = false;
        persist();
        renderMain();
    }

    function renderMain() {
        all('[data-view]').forEach(view => view.classList.toggle('is-active', view.dataset.view === data.selectedTab));
        all('[data-action="switch-tab"]').forEach(button => button.classList.toggle('is-active', button.dataset.tab === data.selectedTab));
        setText('#ctAddMenuLabel', data.selectedTab === 'char' ? '添加联系人' : '添加 User');
        setText('#ctEditMenuLabel', isEditMode ? '完成' : '编辑');
        setText('#ctMainLargeTitle', data.selectedTab === 'char' ? 'Character' : 'Mask');
        // 删除了隐藏编辑按钮的逻辑，让它在 User 页面也显示
        renderGroups();
        renderUsers();
    }


    function setMainMenu(open) {
        mainMenuOpen = Boolean(open);
        const menu = el('#ctMainMenu');
        const trigger = el('[data-action="toggle-main-menu"]');
        menu?.classList.toggle('is-active', mainMenuOpen);
        menu?.setAttribute('aria-hidden', String(!mainMenuOpen));
        trigger?.setAttribute('aria-expanded', String(mainMenuOpen));
    }

    function toggleGroup(groupId) {
        const index = data.expandedGroupIds.indexOf(groupId);
        if (index >= 0) data.expandedGroupIds.splice(index, 1);
        else data.expandedGroupIds.push(groupId);
        persist();
        renderGroups();
    }

    function openContact(contactId) {
        const existing = contactId ? data.contacts.find(contact => contact.id === contactId) : null;
        editingContactId = existing ? existing.id : null;
        contactDraft = normalizedContact(existing || emptyContact());
        setText('#ctContactEditorTitle', existing ? '编辑角色' : '新建角色');
        setValue('#ctContactName', contactDraft.name);
        setValue('#ctContactPersona', contactDraft.persona);
        setValue('#ctContactAppearance', contactDraft.appearance);
        setValue('#ctSecurityAccount', contactDraft.security.account);
        setValue('#ctSecurityPhone', contactDraft.security.phone);
        setValue('#ctSecurityPassword', contactDraft.security.password);
        setValue('#ctSecurityPayment', contactDraft.security.paymentPassword);
        setValue('#ctSecurityLock', contactDraft.security.lockPassword);
        resetPasswordVisibility();
        setValue('#ctVoiceMinimax', contactDraft.voice.minimaxVoiceId);
        setValue('#ctVoiceElevenlabs', contactDraft.voice.elevenlabsVoiceId);
        setValue('#ctVoiceMossland', contactDraft.voice.mosslandVoiceId);
        setValue('#ctVoiceSovits', contactDraft.voice.sovitsPath);
        setValue('#ctVoiceSovitsPromptText', contactDraft.voice.sovitsPromptText);
        setValue('#ctVoiceSovitsPromptLanguage', contactDraft.voice.sovitsPromptLanguage || 'zh');
        setValue('#ctVoiceSovitsTextLanguage', contactDraft.voice.sovitsTextLanguage || 'zh');
        updateWorldbookStatus();
        fillAvatar(el('#ctContactAvatarPreview'), contactDraft.avatar, '角色');
        renderReferenceImage();
        renderQr();
        renderNpcs();
        el('#ctDeleteContactButton')?.classList.toggle('is-visible', Boolean(existing));
        switchEditorSection('persona');
        switchVoiceProvider(contactDraft.voice.provider || 'minimax');
        showPage('contact-editor', 'forward');
    }

    function syncContactDraft() {
        if (!contactDraft) return;
        contactDraft.name = getValue('#ctContactName').trim();
        contactDraft.persona = getValue('#ctContactPersona');
        contactDraft.appearance = getValue('#ctContactAppearance');
        contactDraft.security.account = getValue('#ctSecurityAccount');
        contactDraft.security.phone = getValue('#ctSecurityPhone');
        contactDraft.security.password = getValue('#ctSecurityPassword');
        contactDraft.security.paymentPassword = getValue('#ctSecurityPayment');
        contactDraft.security.lockPassword = getValue('#ctSecurityLock');
        contactDraft.voice.minimaxVoiceId = getValue('#ctVoiceMinimax');
        contactDraft.voice.elevenlabsVoiceId = getValue('#ctVoiceElevenlabs');
        contactDraft.voice.mosslandVoiceId = getValue('#ctVoiceMossland');
        contactDraft.voice.sovitsPath = getValue('#ctVoiceSovits');
        contactDraft.voice.sovitsPromptText = getValue('#ctVoiceSovitsPromptText');
        contactDraft.voice.sovitsPromptLanguage = getValue('#ctVoiceSovitsPromptLanguage') || 'zh';
        contactDraft.voice.sovitsTextLanguage = getValue('#ctVoiceSovitsTextLanguage') || 'zh';
    }

    function persistContactDraft() {
        if (!contactDraft) return;
        syncContactDraft();
        if (!contactDraft.name) return;

        const snapshot = clone(contactDraft);
        const index = data.contacts.findIndex(contact => contact.id === snapshot.id || contact.id === editingContactId);
        if (index >= 0) data.contacts[index] = snapshot;
        else data.contacts.push(snapshot);
        if (!data.expandedGroupIds.includes(snapshot.groupId || 'all')) data.expandedGroupIds.push(snapshot.groupId || 'all');
        if (!editingContactId) editingContactId = snapshot.id;
        persist();
    }

    function saveContact() {
        syncContactDraft();
        if (!contactDraft?.name) {
            showToast('请输入角色名称');
            el('#ctContactName')?.focus();
            return;
        }
        const index = data.contacts.findIndex(contact => contact.id === editingContactId);
        if (index >= 0) data.contacts[index] = clone(contactDraft);
        else data.contacts.push(clone(contactDraft));
        if (!data.expandedGroupIds.includes(contactDraft.groupId || 'all')) data.expandedGroupIds.push(contactDraft.groupId || 'all');
        persist();
        showToast('已保存联系人');
        goMain();
    }

    function readIndexedDbRecord(id) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('iOSDesktopDB');
            request.onerror = () => reject(request.error || new Error('数据库打开失败'));
            request.onsuccess = () => {
                const connection = request.result;
                if (!connection.objectStoreNames.contains('layoutStore')) {
                    connection.close();
                    resolve(null);
                    return;
                }
                const transaction = connection.transaction(['layoutStore'], 'readonly');
                const getRequest = transaction.objectStore('layoutStore').get(id);
                getRequest.onsuccess = () => resolve(getRequest.result || null);
                getRequest.onerror = () => reject(getRequest.error || new Error('数据库读取失败'));
                transaction.oncomplete = () => connection.close();
            };
        });
    }

    function parseGeneratedJson(value) {
        if (value && typeof value === 'object') return value;
        const text = String(value || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        try {
            return JSON.parse(text);
        } catch (error) {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
            throw new Error('API 返回的角色资料不是有效 JSON');
        }
    }

    function firstGenerated(source, keys) {
        for (const key of keys) {
            if (source && source[key] !== undefined && source[key] !== null && String(source[key]).trim()) return source[key];
        }
        return '';
    }

    function normalizeGeneratedNpc(npc) {
        if (!npc || typeof npc !== 'object') return null;
        const name = String(firstGenerated(npc, ['name', '名称', '姓名']) || '').trim();
        if (!name) return null;
        return {
            id: makeId('npc'),
            name,
            role: String(firstGenerated(npc, ['role', 'identity', '身份', '关系']) || '').trim(),
            persona: String(firstGenerated(npc, ['persona', 'description', '人设', '描述']) || '').trim()
        };
    }

    function mergeGeneratedContact(contact, generated, options = {}) {
        const source = generated?.character || generated?.contact || generated;
        const security = source?.security || source?.accountInfo || {};
        contact.security.account = contact.security.account || String(firstGenerated(security, ['account', 'username', '账号']) || firstGenerated(source, ['account', 'username', '账号'])).trim();
        contact.security.phone = contact.security.phone || String(firstGenerated(security, ['phone', 'mobile', '手机号', '手机']) || firstGenerated(source, ['phone', 'mobile', '手机号', '手机'])).trim();
        contact.security.password = contact.security.password || String(firstGenerated(security, ['password', '密码']) || firstGenerated(source, ['password', '密码'])).trim();
        contact.security.paymentPassword = contact.security.paymentPassword || String(firstGenerated(security, ['paymentPassword', 'payment_password', '支付密码']) || firstGenerated(source, ['paymentPassword', 'payment_password', '支付密码'])).trim();
        contact.security.lockPassword = contact.security.lockPassword || String(firstGenerated(security, ['lockPassword', 'lock_password', '锁屏密码']) || firstGenerated(source, ['lockPassword', 'lock_password', '锁屏密码'])).trim();
        if (!contact.persona) contact.persona = String(firstGenerated(source, ['persona', 'character', '人设', '人设基础']) || '').trim();
        if (options.allowAppearance !== false && !contact.appearance) contact.appearance = String(firstGenerated(source, ['appearance', '外貌']) || '').trim();
        const generatedNpcs = Array.isArray(source?.npcs) ? source.npcs : (Array.isArray(generated?.npcs) ? generated.npcs : []);
        const existingNames = new Set(contact.npcs.map(npc => String(npc.name || '').trim().toLowerCase()));
        generatedNpcs.map(normalizeGeneratedNpc).filter(Boolean).forEach(npc => {
            if (!existingNames.has(npc.name.toLowerCase())) {
                contact.npcs.push(npc);
                existingNames.add(npc.name.toLowerCase());
            }
        });
    }

    function isNameOnlyContact(contact) {
        const security = contact.security || {};
        return !String(contact.persona || '').trim()
            && !String(contact.appearance || '').trim()
            && !String(security.account || '').trim()
            && !String(security.phone || '').trim()
            && !String(security.password || '').trim()
            && !String(security.paymentPassword || '').trim()
            && !String(security.lockPassword || '').trim()
            && (!Array.isArray(contact.npcs) || contact.npcs.length === 0);
    }

    function getApiCompletionUrl(url) {
        const base = String(url || '').trim().replace(/\/+$/, '');
        return /\/chat\/completions$/i.test(base) ? base : base + '/chat/completions';
    }

    async function loadQrCodeLibrary() {
        if (window.QRCode) return window.QRCode;
        if (window.__contactsQrPromise) return window.__contactsQrPromise;
        window.__contactsQrPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/vendor/qrcode.min.js';
            script.onload = () => window.QRCode ? resolve(window.QRCode) : reject(new Error('二维码组件加载失败'));
            script.onerror = () => reject(new Error('二维码组件加载失败'));
            document.head.appendChild(script);
        });
        return window.__contactsQrPromise;
    }

    async function createContactQr(contact) {
        const payload = JSON.stringify({
            type: 'tonghuaji-wechat-contact',
            contactId: contact.id
        });
        const QRCode = await loadQrCodeLibrary();
        const holder = document.createElement('div');
        holder.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1024px;height:1024px;';
        document.body.appendChild(holder);
        try {
            new QRCode(holder, { text: payload, width: 1024, height: 1024, correctLevel: QRCode.CorrectLevel.M });
            const image = holder.querySelector('img');
            if (image?.src) return image.src;
            const canvas = holder.querySelector('canvas');
            if (canvas) return canvas.toDataURL('image/png');
            throw new Error('二维码生成失败');
        } finally {
            holder.remove();
        }
    }

    async function generateContact(contactId, trigger) {
        const contactIndex = data.contacts.findIndex(item => item.id === contactId);
        if (contactIndex < 0 || trigger?.classList.contains('is-loading')) return;
        const contact = normalizedContact(data.contacts[contactIndex]);
        trigger?.classList.add('is-loading');
        try {
            const apiRecord = await readIndexedDbRecord('apiData');
            const apiList = Array.isArray(apiRecord?.list) ? apiRecord.list : [];
            const api = apiList.find(item => item.id === apiRecord?.connectedId) || apiList[0];
            if (!api?.url || !api?.key || !api?.model) throw new Error('请先在 API 连接中配置并连接一个模型');
            showToast('正在生成角色资料…');
            const nameOnly = isNameOnlyContact(contact);
            const prompt = nameOnly ? [
                '请只根据下面成年虚构角色的名字生成与名字自然相关的角色资料，只返回一个合法 JSON 对象，不要 Markdown，不要解释。',
                '字段必须包含：account、phone、password、paymentPassword、lockPassword、persona、npcs。',
                '禁止生成 appearance、外貌、生图提示词或任何生图外貌字段。',
                'npcs 必须是数组，每项包含 name、role、persona；请生成 2 到 4 个与角色名字设定相关的 NPC。',
                '不要重复或改写角色姓名。',
                JSON.stringify({ name: contact.name })
            ].join('\n') : [
                '请为下面的成年虚构角色补全资料，只返回一个合法 JSON 对象，不要 Markdown，不要解释。',
                '字段必须包含：account、phone、password、paymentPassword、lockPassword、persona、appearance、npcs。',
                'npcs 必须是数组，每项包含 name、role、persona；请生成 2 到 4 个与角色有关的 NPC。',
                '已有字段可以参考，但不要重复或改写角色姓名。',
                JSON.stringify({ name: contact.name, persona: contact.persona, appearance: contact.appearance, npcs: contact.npcs })
            ].join('\n');
            const response = await fetch(getApiCompletionUrl(api.url), {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + api.key, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: api.model, temperature: 0.7, messages: [
                    { role: 'system', content: '你是角色资料生成器。只输出 JSON。' },
                    { role: 'user', content: prompt }
                ] })
            });
            if (!response.ok) throw new Error('API 请求失败：HTTP ' + response.status);
            const result = await response.json();
            const content = result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text ?? result?.output_text;
            mergeGeneratedContact(contact, parseGeneratedJson(content), { allowAppearance: !nameOnly });
            contact.security.qrCode = await createContactQr(contact);
            data.contacts[contactIndex] = clone(contact);
            await persist();
            renderGroups();
            showToast('资料和微信二维码已生成，请截图后到微信添加好友');
        } catch (error) {
            console.error('Contact generation failed:', error);
            showToast(error?.message || '角色资料生成失败');
        } finally {
            trigger?.classList.remove('is-loading');
        }
    }

    function switchEditorSection(section) {
        all('[data-action="switch-section"]').forEach(button => button.classList.toggle('is-active', button.dataset.section === section));
        all('[data-section-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.sectionPanel === section));
    }

    function switchVoiceProvider(provider) {
        if (contactDraft) contactDraft.voice.provider = provider;
        all('[data-action="voice-provider"]').forEach(button => {
            const active = button.dataset.provider === provider;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        all('[data-provider-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.providerPanel === provider));
    }

    function openUser(userId) {
        const existing = userId ? data.users.find(user => user.id === userId) : null;
        editingUserId = existing ? existing.id : null;
        userDraft = clone(existing || emptyUser());
        setText('#ctUserEditorTitle', existing ? '编辑 User' : '新建 User');
        setValue('#ctUserName', userDraft.name);
        setValue('#ctUserPhone', userDraft.phone);
        setValue('#ctUserPersona', userDraft.persona);
        setValue('#ctUserGender', userDraft.gender || '');
        setValue('#ctUserAppearance', userDraft.appearance || '');
        fillAvatar(el('#ctUserAvatarPreview'), userDraft.avatar, 'User');
        el('#ctDeleteUserButton')?.classList.toggle('is-visible', Boolean(existing));
        showPage('user-editor', 'forward');
    }

    async function saveUser() {
        if (!userDraft || userSavePending) return;
        userDraft.name = getValue('#ctUserName').trim();
        userDraft.phone = getValue('#ctUserPhone').trim();
        userDraft.persona = getValue('#ctUserPersona');
        userDraft.gender = getValue('#ctUserGender');
        userDraft.appearance = getValue('#ctUserAppearance').trim();
        if (!userDraft.name) {
            showToast('请输入 User 名称');
            el('#ctUserName')?.focus();
            return;
        }
        if (!userDraft.phone) {
            showToast('请输入手机号');
            el('#ctUserPhone')?.focus();
            return;
        }
        const savedUser = clone(userDraft);
        const index = data.users.findIndex(user => user.id === editingUserId);
        if (index >= 0) data.users[index] = savedUser;
        else data.users.push(savedUser);
        userSavePending = true;
        const saved = await persist();
        userSavePending = false;
        if (!saved) return;
        window.dispatchEvent(new CustomEvent('contacts:user-saved', { detail: clone(savedUser) }));
        showToast('已保存 User');
        if (userDraft?.id === savedUser.id) goMain();
    }

    function renderNpcs() {
        const list = el('#ctNpcList');
        if (!list || !contactDraft) return;
        const rows = contactDraft.npcs.map(npc => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'ct-npc-row';
            row.dataset.action = 'edit-npc';
            row.dataset.npcId = npc.id;
            const main = document.createElement('span');
            main.className = 'ct-npc-main';
            main.appendChild(createAvatar('', 'NPC'));
            const text = document.createElement('span');
            text.className = 'ct-npc-text';
            const name = document.createElement('span');
            name.className = 'ct-contact-name';
            name.textContent = npc.name || '未命名 NPC';
            const role = document.createElement('span');
            role.className = 'ct-npc-sub';
            role.textContent = npc.role || '未知身份';
            text.append(name, role);
            main.appendChild(text);
            const chevron = document.createElement('span');
            chevron.className = 'ct-item-right';
            chevron.innerHTML = '<svg class="ct-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>';
            row.append(main, chevron);
            return row;
        });
        list.replaceChildren(...rows);
    }

    function openNpc(npcId) {
        syncContactDraft();
        const existing = npcId ? contactDraft?.npcs.find(npc => npc.id === npcId) : null;
        editingNpcId = existing ? existing.id : null;
        npcDraft = clone(existing || { id: makeId('npc'), name: '', role: '', persona: '' });
        setText('#ctNpcEditorTitle', existing ? '编辑 NPC' : '新建 NPC');
        setValue('#ctNpcName', npcDraft.name);
        setValue('#ctNpcRole', npcDraft.role);
        setValue('#ctNpcPersona', npcDraft.persona);
        el('#ctDeleteNpcButton')?.classList.toggle('is-visible', Boolean(existing));
        showPage('npc-editor', 'forward');
    }

    function saveNpc() {
        if (!contactDraft || !npcDraft) return;
        npcDraft.name = getValue('#ctNpcName').trim();
        npcDraft.role = getValue('#ctNpcRole').trim();
        npcDraft.persona = getValue('#ctNpcPersona');
        if (!npcDraft.name) {
            showToast('请输入 NPC 名称');
            el('#ctNpcName')?.focus();
            return;
        }
        const index = contactDraft.npcs.findIndex(npc => npc.id === editingNpcId);
        if (index >= 0) contactDraft.npcs[index] = clone(npcDraft);
        else contactDraft.npcs.push(clone(npcDraft));
        renderNpcs();
        showPage('contact-editor', 'back');
        switchEditorSection('npc');
        showToast('已保存 NPC');
    }

    function availableWorldbooks() {
        if (typeof wbGroups === 'undefined' || typeof wbEntries === 'undefined') return [];
        return wbGroups.map(group => {
            return {
                id: group.id,
                name: group.name || '未命名分组',
                entries: wbEntries.filter(e => e.groupId === group.id && !e.isDeleted).map(e => ({
                    id: e.id,
                    name: e.title || '未命名条目'
                }))
            };
        }).filter(g => g.entries.length > 0);
    }

    function updateWorldbookStatus() {
        const count = contactDraft?.worldbookIds?.length || 0;
        setText('#ctWorldbookStatus', count ? '已选 ' + count + ' 项' : '未选择');
    }

    function openGroupSelect() {
        if (!contactDraft) return;
        if (typeof window.openUniversalSelect !== 'function') {
            showToast('通用选择弹窗暂不可用');
            return;
        }
        window.openUniversalSelect({
            title: '选择分组',
            items: [
                { label: '所有联系人', value: 'all' },
                ...data.groups.map(group => ({ label: group.name, value: group.id }))
            ],
            currentValue: contactDraft.groupId || 'all',
            searchable: data.groups.length > 6,
            onSelect: value => {
                contactDraft.groupId = value === 'all' ? null : value;
            }
        });
    }

    function openPicker(mode) {
        pickerMode = mode;
        const list = el('#ctPickerList');
        const overlay = el('#ctPickerOverlay');
        const searchContainer = el('#ctPickerSearchContainer');
        const searchInput = el('#ctPickerSearchInput');
        if (!list || !overlay || !contactDraft) return;
        list.replaceChildren();

        if (mode === 'group') {
            if (searchContainer) searchContainer.style.display = 'none';
            setText('#ctPickerTitle', '选择分组');
            pickerSelection = [contactDraft.groupId || 'all'];
            const choices = [{ id: 'all', name: '所有联系人' }, ...data.groups];
            
            if (!choices.length) {
                const empty = document.createElement('div');
                empty.className = 'ct-picker-empty';
                empty.textContent = '暂无可选择的分组';
                list.appendChild(empty);
            } else {
                const unifiedCard = document.createElement('div');
                unifiedCard.className = 'ct-unified-card';
                
                choices.forEach(choice => {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'ct-picker-item ct-picker-sub-item';
                    item.style.paddingLeft = '16px';
                    item.dataset.action = 'picker-item';
                    item.dataset.id = choice.id;
                    item.classList.toggle('is-selected', pickerSelection.includes(choice.id));
                    const name = document.createElement('span');
                    name.textContent = choice.name;
                    const check = document.createElement('span');
                    check.className = 'ct-picker-check';
                    check.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    item.append(name, check);
                    unifiedCard.appendChild(item);
                });
                list.appendChild(unifiedCard);
            }
        } else {
            if (searchContainer) searchContainer.style.display = 'block';
            if (searchInput) searchInput.value = '';
            pickerSelection = contactDraft.worldbookIds.slice();
            setText('#ctPickerTitle', pickerSelection.length > 0 ? '选择世界书 (' + pickerSelection.length + ')' : '选择世界书');
            const groups = availableWorldbooks();

            const renderWorldbookList = (filterKeyword = '') => {
                list.replaceChildren();
                const keyword = filterKeyword.trim().toLowerCase();

                if (!groups.length) {
                    const empty = document.createElement('div');
                    empty.className = 'ct-picker-empty';
                    empty.textContent = '暂无可选择的世界书条目';
                    list.appendChild(empty);
                    return;
                }

                const unifiedCard = document.createElement('div');
                unifiedCard.className = 'ct-unified-card';
                let hasMatchedEntries = false;

                groups.forEach(group => {
                    const filteredEntries = group.entries.filter(entry => 
                        !keyword || (entry.name && entry.name.toLowerCase().includes(keyword))
                    );

                    if (keyword && filteredEntries.length === 0) return;
                    hasMatchedEntries = true;

                    const groupWrapper = document.createElement('div');
                    groupWrapper.className = 'ct-picker-group-wrapper';
                    if (keyword) {
                        groupWrapper.classList.add('is-expanded');
                    }

                    const groupHeader = document.createElement('button');
                    groupHeader.type = 'button';
                    groupHeader.className = 'ct-picker-group-header';

                    const titleWrap = document.createElement('div');
                    titleWrap.style.display = 'flex';
                    titleWrap.style.alignItems = 'center';
                    titleWrap.style.gap = '8px';

                    const iconSpan = document.createElement('span');
                    iconSpan.style.display = 'flex';
                    iconSpan.style.alignItems = 'center';
                    iconSpan.style.justifyContent = 'center';
                    iconSpan.style.color = '#8e8e93';
                    iconSpan.style.flexShrink = '0';
                    iconSpan.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.375 16.0469H16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.25 9.88276V17.5808C21.25 18.3986 20.9252 19.1828 20.3469 19.7611C19.7687 20.3393 18.9844 20.6641 18.1667 20.6641H5.83333C5.01558 20.6641 4.23132 20.3393 3.65309 19.7611C3.07485 19.1828 2.75 18.3986 2.75 17.5808V6.41915C2.75 5.6014 3.07485 4.81714 3.65309 4.2389C4.23132 3.66067 5.01558 3.33582 5.83333 3.33582H8.91667C9.42532 3.33563 9.92612 3.46128 10.3744 3.70158C10.8228 3.94187 11.2047 4.28935 11.4861 4.71304L12.3597 6.03887C12.5197 6.27622 12.7355 6.47065 12.9882 6.60506C13.2408 6.73947 13.5227 6.80974 13.8089 6.8097H18.1667C18.9826 6.8097 19.7653 7.13314 20.3433 7.70916C20.9212 8.28517 21.2473 9.06679 21.25 9.88276Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5169 4.72332L18.4442 3.61332C18.6641 3.57743 18.8891 3.58995 19.1037 3.65001C19.3182 3.71007 19.5171 3.81621 19.6864 3.96105C19.8557 4.10588 19.9913 4.2859 20.0839 4.48857C20.1764 4.69123 20.2236 4.91165 20.2222 5.13444V7.59082" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    titleWrap.appendChild(iconSpan);

                    const nameSpan = document.createElement('span');
                    nameSpan.style.fontWeight = '600';
                    nameSpan.textContent = group.name;
                    titleWrap.appendChild(nameSpan);

                    const rightWrap = document.createElement('div');
                    rightWrap.style.display = 'flex';
                    rightWrap.style.alignItems = 'center';
                    rightWrap.style.gap = '6px';

                    const selectedInGroup = group.entries.filter(e => pickerSelection.includes(e.id)).length;
                    if (selectedInGroup > 0) {
                        const badge = document.createElement('span');
                        badge.className = 'ct-picker-badge';
                        badge.textContent = '已选 ' + selectedInGroup;
                        rightWrap.appendChild(badge);
                    }

                    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    chevron.setAttribute('class', 'ct-chevron');
                    chevron.setAttribute('viewBox', '0 0 8 13');
                    chevron.innerHTML = '<path d="M1.5 1.5L6.5 6.5L1.5 11.5"/>';
                    rightWrap.appendChild(chevron);

                    groupHeader.append(titleWrap, rightWrap);

                    const entriesContainer = document.createElement('div');
                    entriesContainer.className = 'ct-picker-group-entries';

                    const entriesInner = document.createElement('div');
                    entriesInner.className = 'ct-picker-group-entries-inner';

                    groupHeader.onclick = () => {
                        groupWrapper.classList.toggle('is-expanded');
                    };

                    filteredEntries.forEach(entry => {
                        const item = document.createElement('button');
                        item.type = 'button';
                        item.className = 'ct-picker-item ct-picker-sub-item';
                        item.dataset.action = 'picker-item';
                        item.dataset.id = entry.id;
                        item.classList.toggle('is-selected', pickerSelection.includes(entry.id));

                        const name = document.createElement('span');
                        name.textContent = entry.name;

                        const check = document.createElement('span');
                        check.className = 'ct-picker-check';
                        check.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';

                        item.append(name, check);
                        entriesInner.appendChild(item);
                    });

                    entriesContainer.appendChild(entriesInner);
                    groupWrapper.append(groupHeader, entriesContainer);
                    unifiedCard.appendChild(groupWrapper);
                });

                if (!hasMatchedEntries) {
                    const empty = document.createElement('div');
                    empty.className = 'ct-picker-empty';
                    empty.textContent = '无匹配的世界书条目';
                    list.appendChild(empty);
                } else {
                    list.appendChild(unifiedCard);
                }
            };

            renderWorldbookList('');

            if (searchInput) {
                searchInput.oninput = (e) => {
                    renderWorldbookList(e.target.value);
                };
            }
        }
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function togglePickerItem(id, button) {
        if (pickerMode === 'group') {
            pickerSelection = [id];
            all('.ct-picker-item').forEach(item => item.classList.toggle('is-selected', item.dataset.id === id));
            return;
        }
        const index = pickerSelection.indexOf(id);
        if (index >= 0) pickerSelection.splice(index, 1);
        else pickerSelection.push(id);
        button.classList.toggle('is-selected', pickerSelection.includes(id));

        const groupWrapper = button.closest('.ct-picker-group-wrapper');
        if (groupWrapper) {
            const selectedCount = groupWrapper.querySelectorAll('.ct-picker-item.is-selected').length;
            let badge = groupWrapper.querySelector('.ct-picker-badge');
            const rightWrap = groupWrapper.querySelector('.ct-picker-group-header > div:last-child');
            if (selectedCount > 0) {
                if (!badge && rightWrap) {
                    badge = document.createElement('span');
                    badge.className = 'ct-picker-badge';
                    const chevron = rightWrap.querySelector('.ct-chevron');
                    if (chevron) rightWrap.insertBefore(badge, chevron);
                    else rightWrap.appendChild(badge);
                }
                if (badge) badge.textContent = '已选 ' + selectedCount;
            } else if (badge) {
                badge.remove();
            }
        }

        const totalCount = pickerSelection.length;
        setText('#ctPickerTitle', totalCount > 0 ? '选择世界书 (' + totalCount + ')' : '选择世界书');
    }

    function closePicker() {
        const overlay = el('#ctPickerOverlay');
        overlay?.classList.remove('is-active');
        overlay?.setAttribute('aria-hidden', 'true');
    }

    function confirmPicker() {
        if (!contactDraft) return closePicker();
        if (pickerMode === 'group') {
            contactDraft.groupId = pickerSelection[0] === 'all' ? null : pickerSelection[0];
        } else {
            contactDraft.worldbookIds = pickerSelection.slice();
            updateWorldbookStatus();
        }
        closePicker();
    }

    function showDialog(options) {
        const overlay = el('#ctDialogOverlay');
        const dialog = overlay?.querySelector('.ct-dialog');
        if (!overlay || !dialog) return;
        setText('#ctDialogTitle', options.title || '提示');
        setText('#ctDialogMessage', options.message || '');
        const input = el('#ctDialogInput');
        dialog.classList.toggle('has-input', Boolean(options.input));
        if (input) {
            input.value = options.value || '';
            input.placeholder = options.placeholder || '';
        }
        dialogConfirm = options.onConfirm || null;
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
        if (options.input) setTimeout(() => input?.focus(), 80);
    }

    function closeDialog() {
        const overlay = el('#ctDialogOverlay');
        overlay?.classList.remove('is-active');
        overlay?.setAttribute('aria-hidden', 'true');
        dialogConfirm = null;
    }

    function openContactAvatarMenu(trigger) {
        if (!contactDraft) return;
        const overlay = el('#ctContactAvatarMenuOverlay');
        const menu = el('#ctContactAvatarMenu');
        if (!overlay || !menu || !trigger) return;
        const rootRect = root.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const menuWidth = 240;
        const menuHeight = 116;
        let top = triggerRect.bottom - rootRect.top + 10;
        let left = triggerRect.left - rootRect.left + (triggerRect.width - menuWidth) / 2;
        if (top + menuHeight > rootRect.height - 12) top = triggerRect.top - rootRect.top - menuHeight - 10;
        left = Math.max(12, Math.min(left, rootRect.width - menuWidth - 12));
        menu.style.top = Math.max(12, top) + 'px';
        menu.style.left = left + 'px';
        contactAvatarMenuOpen = true;
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeContactAvatarMenu() {
        const overlay = el('#ctContactAvatarMenuOverlay');
        contactAvatarMenuOpen = false;
        overlay?.classList.remove('is-active');
        overlay?.setAttribute('aria-hidden', 'true');
    }

    function setContactAvatarFromUrl(url) {
        const value = String(url || '').trim();
        if (!value || !contactDraft) return false;
        if (!/^(https?:\/\/|data:image\/|blob:)/i.test(value)) {
            showToast('请输入有效的图片 URL');
            return false;
        }
        contactDraft.avatar = value;
        fillAvatar(el('#ctContactAvatarPreview'), value, '角色');
        return true;
    }

    async function openContactAvatarUrlPrompt() {
        closeContactAvatarMenu();
        if (typeof window.showCustomPrompt !== 'function') {
            showToast('通用输入弹窗暂不可用');
            return;
        }
        const url = await window.showCustomPrompt('修改头像', {
            type: 'url',
            placeholder: '输入图片 URL',
            value: ''
        }, '确定');
        if (url && url.trim() && setContactAvatarFromUrl(url)) {
            showToast('头像已更新，保存联系人后生效');
        }
    }

    function confirmDialog() {
        const callback = dialogConfirm;
        const value = getValue('#ctDialogInput').trim();
        if (callback && callback(value) === false) return;
        closeDialog();
    }

    async function addGroup() {
        if (typeof window.showCustomPrompt !== 'function') {
            showToast('通用输入弹窗暂不可用');
            return;
        }
        const result = await window.showCustomPrompt('新建联系人分组', {
            type: 'text',
            placeholder: '输入分组名称',
            value: ''
        }, '创建');
        if (result === null) return;

        const name = String(result).trim();
        if (!name) { showToast('分组名称不能为空'); return; }
        if (data.groups.some(group => group.name === name)) { showToast('分组名称已存在'); return; }
        const group = { id: makeId('group'), name };
        data.groups.push(group);
        data.expandedGroupIds.push(group.id);
        persist();
        renderGroups();
        showToast('已创建分组');
    }

    function deleteGroup(groupId) {
        const group = data.groups.find(item => item.id === groupId);
        if (!group) return;
        showDialog({
            title: '删除分组',
            message: '删除“' + group.name + '”后，组内联系人将移到“所有联系人”。',
            onConfirm: () => {
                data.groups = data.groups.filter(item => item.id !== groupId);
                data.contacts.forEach(contact => { if (contact.groupId === groupId) contact.groupId = null; });
                data.expandedGroupIds = data.expandedGroupIds.filter(id => id !== groupId);
                persist();
                renderGroups();
                showToast('已删除分组');
            }
        });
    }

    function deleteContact() {
        if (!editingContactId || contactDeletePending) return;
        const contactId = editingContactId;
        showDialog({
            title: '删除联系人',
            message: '确定删除“' + (contactDraft?.name || '该联系人') + '”吗？同时删除该角色的聊天、见面、记忆等相关记录；群聊和共同作品保留其他角色的内容。',
            onConfirm: async () => {
                if (contactDeletePending) return;
                contactDeletePending = true;
                const index = data.contacts.findIndex(contact => contact.id === contactId);
                const contact = data.contacts[index];
                data.contacts = data.contacts.filter(item => item.id !== contactId);
                const saved = await persist([String(contactId)]);
                contactDeletePending = false;
                if (!saved) {
                    if (contact && !data.contacts.some(item => item.id === contactId)) data.contacts.splice(index, 0, contact);
                    renderMain();
                    return;
                }
                showToast('已删除联系人');
                goMain();
            }
        });
    }

    function deleteUser() {
        if (!editingUserId) return;
        showDialog({
            title: '删除 User',
            message: '确定删除“' + (userDraft?.name || '该 User') + '”吗？',
            onConfirm: () => {
                data.users = data.users.filter(user => user.id !== editingUserId);
                persist();
                showToast('已删除 User');
                goMain();
            }
        });
    }

    function deleteNpc() {
        if (!editingNpcId || !contactDraft) return;
        showDialog({
            title: '删除 NPC',
            message: '确定删除“' + (npcDraft?.name || '该 NPC') + '”吗？',
            onConfirm: () => {
                contactDraft.npcs = contactDraft.npcs.filter(npc => npc.id !== editingNpcId);
                renderNpcs();
                showPage('contact-editor', 'back');
                switchEditorSection('npc');
                showToast('已删除 NPC');
            }
        });
    }

    function renderQr() {
        const preview = el('#ctQrPreview');
        if (!preview || !contactDraft) return;
        preview.replaceChildren();
        if (contactDraft.security.qrCode) {
            const image = document.createElement('img');
            image.src = contactDraft.security.qrCode;
            image.alt = '专属二维码';
            preview.appendChild(image);
        } else {
            const symbol = document.createElement('span');
            symbol.textContent = '▦';
            symbol.style.fontSize = '42px';
            symbol.style.color = '#777b80';
            preview.appendChild(symbol);
        }
    }

    function closeQrPreview() {
        const modal = el('#ctQrModal');
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    function openQrPreview() {
        const qrCode = contactDraft?.security?.qrCode;
        if (!qrCode) {
            showToast('请先生成专属二维码');
            return;
        }
        let modal = el('#ctQrModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ctQrModal';
            modal.className = 'ct-qr-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', '专属二维码');
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = '<div class="ct-qr-modal-card"><button class="ct-qr-modal-close" type="button" aria-label="关闭二维码">×</button><img alt="专属二维码高清预览"><button class="ct-qr-download" type="button">保存二维码</button></div>';
            modal.addEventListener('click', event => {
                if (event.target === modal) closeQrPreview();
            });
            modal.querySelector('.ct-qr-modal-close').addEventListener('click', closeQrPreview);
            modal.querySelector('.ct-qr-download').addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = modal.querySelector('img').src;
                link.download = (contactDraft?.name || 'contact') + '-qr.png';
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
            root.appendChild(modal);
        }
        modal.querySelector('img').src = qrCode;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function resetPasswordVisibility() {
        all('.ct-password-toggle').forEach(button => {
            const input = el('#' + button.dataset.target);
            if (input) input.type = 'password';
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('aria-label', '显示' + (button.closest('label')?.querySelector('span')?.textContent || '密码'));
        });
    }

    function togglePassword(button) {
        const input = el('#' + button.dataset.target);
        if (!input) return;
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        button.setAttribute('aria-pressed', String(visible));
        button.setAttribute('aria-label', (visible ? '隐藏' : '显示') + (button.closest('label')?.querySelector('span')?.textContent || '密码'));
    }

    function renderReferenceImage() {
        const preview = el('#ctReferencePreview');
        const empty = el('#ctReferenceEmpty');
        const picker = el('#ctReferencePicker');
        const remove = el('#ctReferenceRemove');
        const hasImage = Boolean(contactDraft?.referenceImage);
        if (preview) {
            preview.replaceChildren();
            preview.classList.toggle('is-visible', hasImage);
            preview.setAttribute('aria-hidden', String(!hasImage));
            if (hasImage) {
                const image = document.createElement('img');
                image.src = contactDraft.referenceImage;
                image.alt = '角色生图参考图';
                preview.appendChild(image);
            }
        }
        empty?.classList.toggle('is-hidden', hasImage);
        empty?.setAttribute('aria-hidden', String(hasImage));
        picker?.setAttribute('aria-label', hasImage ? '替换锁脸参考图' : '上传锁脸参考图');
        remove?.classList.toggle('is-visible', hasImage);
        setText('#ctReferenceActionText', hasImage ? '替换参考图' : '上传参考图');
    }

    function fileToImage(file, maxSize) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) return reject(new Error('invalid image'));
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error || new Error('read failed'));
            reader.onload = () => {
                const image = new Image();
                image.onerror = () => reject(new Error('decode failed'));
                image.onload = () => {
                    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.max(1, Math.round(image.width * scale));
                    canvas.height = Math.max(1, Math.round(image.height * scale));
                    const context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.82));
                };
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function decodePlainText(buffer) {
        const bytes = new Uint8Array(buffer);
        if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes.subarray(2));
        if (bytes[0] === 0xfe && bytes[1] === 0xff) {
            const swapped = bytes.subarray(2).slice();
            for (let index = 0; index + 1 < swapped.length; index += 2) {
                const value = swapped[index];
                swapped[index] = swapped[index + 1];
                swapped[index + 1] = value;
            }
            return new TextDecoder('utf-16le').decode(swapped);
        }
        try {
            return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '');
        } catch (error) {
            try {
                return new TextDecoder('gb18030').decode(bytes);
            } catch (fallbackError) {
                throw new Error('TXT 编码不受支持，请另存为 UTF-8');
            }
        }
    }

    let pakoLoadPromise = null;

    function loadPakoInflater() {
        if (window.pako?.inflateRaw) return Promise.resolve(window.pako);
        if (pakoLoadPromise) return pakoLoadPromise;

        pakoLoadPromise = new Promise((resolve, reject) => {
            const existingScript = document.getElementById('contactsPakoInflater');
            const finish = () => window.pako?.inflateRaw
                ? resolve(window.pako)
                : reject(new Error('DOCX 解压组件加载失败'));

            if (existingScript) {
                existingScript.addEventListener('load', finish, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('DOCX 解压组件加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'contactsPakoInflater';
            script.src = 'js/vendor/pako_inflate.min.js';
            script.onload = finish;
            script.onerror = () => {
                script.remove();
                reject(new Error('DOCX 解压组件加载失败'));
            };
            document.head.appendChild(script);
        }).catch(error => {
            pakoLoadPromise = null;
            throw error;
        });

        return pakoLoadPromise;
    }

    async function inflateZipEntry(bytes, method) {
        if (method === 0) return bytes;
        if (method !== 8) throw new Error('DOCX 使用了不支持的压缩格式');

        if (typeof DecompressionStream === 'function') {
            try {
                const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                return new Uint8Array(await new Response(stream).arrayBuffer());
            } catch (error) {
                console.info('Native raw DEFLATE is unavailable; using the local DOCX inflater.', error);
            }
        }

        const inflater = await loadPakoInflater();
        try {
            return inflater.inflateRaw(bytes);
        } catch (error) {
            throw new Error('DOCX 正文解压失败');
        }
    }

    async function readDocxXmlWithoutLibrary(buffer) {
        const bytes = new Uint8Array(buffer);
        const view = new DataView(buffer);
        let endOffset = -1;
        for (let offset = Math.max(0, bytes.length - 65557); offset <= bytes.length - 22; offset += 1) {
            if (view.getUint32(offset, true) === 0x06054b50) endOffset = offset;
        }
        if (endOffset < 0) throw new Error('DOCX 文件结构无效');

        const entryCount = view.getUint16(endOffset + 10, true);
        let directoryOffset = view.getUint32(endOffset + 16, true);
        const decoder = new TextDecoder('utf-8');
        for (let index = 0; index < entryCount; index += 1) {
            if (view.getUint32(directoryOffset, true) !== 0x02014b50) break;
            const method = view.getUint16(directoryOffset + 10, true);
            const compressedSize = view.getUint32(directoryOffset + 20, true);
            const nameLength = view.getUint16(directoryOffset + 28, true);
            const extraLength = view.getUint16(directoryOffset + 30, true);
            const commentLength = view.getUint16(directoryOffset + 32, true);
            const localOffset = view.getUint32(directoryOffset + 42, true);
            const name = decoder.decode(bytes.subarray(directoryOffset + 46, directoryOffset + 46 + nameLength));
            if (name === 'word/document.xml') {
                if (view.getUint32(localOffset, true) !== 0x04034b50) throw new Error('DOCX 正文结构无效');
                const localNameLength = view.getUint16(localOffset + 26, true);
                const localExtraLength = view.getUint16(localOffset + 28, true);
                const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
                const content = await inflateZipEntry(bytes.slice(dataOffset, dataOffset + compressedSize), method);
                return decoder.decode(content);
            }
            directoryOffset += 46 + nameLength + extraLength + commentLength;
        }
        throw new Error('DOCX 中没有可读取的正文');
    }

    async function readDocxXml(buffer) {
        if (typeof window.JSZip !== 'undefined') {
            const zip = await window.JSZip.loadAsync(buffer);
            const documentFile = zip.file('word/document.xml');
            if (!documentFile) throw new Error('DOCX 中没有可读取的正文');
            return documentFile.async('string');
        }
        return readDocxXmlWithoutLibrary(buffer);
    }

    function docxXmlToText(xml) {
        const documentXml = new DOMParser().parseFromString(xml, 'application/xml');
        if (documentXml.querySelector('parsererror')) throw new Error('DOCX 正文解析失败');
        const paragraphs = Array.from(documentXml.getElementsByTagNameNS('*', 'p'));
        const lines = paragraphs.map(paragraph => {
            let line = '';
            paragraph.querySelectorAll('*').forEach(node => {
                if (node.localName === 't') line += node.textContent || '';
                else if (node.localName === 'tab') line += '\t';
                else if (node.localName === 'br' || node.localName === 'cr') line += '\n';
            });
            return line;
        });
        return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    function inferImportedName(text, fileName) {
        const labeledName = text.match(/^(?:角色名|角色名称|姓名|名字|名称)\s*[：:]\s*([^\r\n]{1,40})/m)?.[1]?.trim();
        if (labeledName) return labeledName.slice(0, 40);
        return fileName.replace(/\.(?:txt|docx)$/i, '').trim().slice(0, 40);
    }

    function safePersonaFileName(value) {
        return (String(value || '未命名角色').replace(/[\\/:*?"<>|\u0000-\u001F]/g, '_').trim() || '未命名角色').slice(0, 80);
    }

    function openPersonaExportDialog() {
        if (!contactDraft) return;
        syncContactDraft();
        const overlay = el('#ctPersonaExportOverlay');
        overlay?.classList.add('is-active');
        overlay?.setAttribute('aria-hidden', 'false');
    }

    function closePersonaExportDialog() {
        const overlay = el('#ctPersonaExportOverlay');
        overlay?.classList.remove('is-active');
        overlay?.setAttribute('aria-hidden', 'true');
    }

    function downloadPersonaFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function getWorldbookRuntime() {
        if (window.worldbookDataReady && typeof window.worldbookDataReady.then === 'function') {
            await window.worldbookDataReady;
        }
        if (typeof wbGroups === 'undefined' || typeof wbEntries === 'undefined' || !Array.isArray(wbGroups) || !Array.isArray(wbEntries)) {
            throw new Error('世界书数据暂不可用');
        }
        return { groups: wbGroups, entries: wbEntries };
    }

    function cleanWorldbookGroupForExport(group) {
        return {
            id: String(group?.id || ''),
            name: String(group?.name || '未分类')
        };
    }

    function cleanWorldbookEntryForExport(entry) {
        const position = ['top', 'before_persona', 'after_persona', 'depth', 'bottom'].includes(entry?.position)
            ? entry.position
            : 'after_persona';
        const exported = {
            id: String(entry?.id || ''),
            groupId: String(entry?.groupId || ''),
            title: String(entry?.title || '未命名条目'),
            key: String(entry?.key || ''),
            content: String(entry?.content || ''),
            isGlobal: Boolean(entry?.isGlobal),
            position,
            priority: Math.min(100, Math.max(-100, Math.floor(Number(entry?.priority) || 0))),
            scanDepth: Math.min(50, Math.max(1, Math.floor(Number(entry?.scanDepth) || 8)))
        };
        if (position === 'depth') {
            exported.depth = Math.min(100, Math.max(1, Math.floor(Number(entry?.depth ?? entry?.insertionDepth ?? entry?.insertion_depth) || 4)));
        }
        return exported;
    }

    async function collectBoundWorldbooks() {
        const boundIds = Array.isArray(contactDraft?.worldbookIds) ? contactDraft.worldbookIds.filter(Boolean) : [];
        if (!boundIds.length) return { groups: [], entries: [] };
        const runtime = await getWorldbookRuntime();
        const boundSet = new Set(boundIds);
        const entries = runtime.entries
            .filter(entry => entry && !entry.isDeleted && boundSet.has(entry.id))
            .map(cleanWorldbookEntryForExport);
        const groupIds = new Set(entries.map(entry => entry.groupId).filter(Boolean));
        const groups = runtime.groups
            .filter(group => group && groupIds.has(group.id))
            .map(cleanWorldbookGroupForExport);
        return { groups, entries };
    }

    function buildTonghuajiPersonaText(name, persona, worldbooks) {
        return [
            '# Tonghuaji Persona Export v1',
            'Name: ' + String(name || ''),
            '',
            '[PERSONA]',
            persona,
            '[/PERSONA]',
            '',
            '[WORLDBOOKS]',
            JSON.stringify(worldbooks, null, 2),
            '[/WORLDBOOKS]'
        ].join('\n');
    }

    function parseTonghuajiPersonaText(text) {
        const source = String(text || '');
        if (!source.startsWith('# Tonghuaji Persona Export v1\n')) return null;
        const personaMatch = source.match(/\n\[PERSONA\]\n([\s\S]*?)\n\[\/PERSONA\]\n/);
        const worldbookMatch = source.match(/\n\[WORLDBOOKS\]\n([\s\S]*?)\n\[\/WORLDBOOKS\]\s*$/);
        if (!personaMatch || !worldbookMatch) throw new Error('童话集 TXT 人设文件结构无效');
        let worldbooks;
        try {
            worldbooks = JSON.parse(worldbookMatch[1]);
        } catch (error) {
            throw new Error('童话集 TXT 中的世界书数据无效');
        }
        const name = source.match(/^Name:\s*(.*)$/m)?.[1]?.trim().slice(0, 40) || '';
        return {
            name,
            persona: personaMatch[1],
            worldbooks: normalizeImportedWorldbookPackage(worldbooks)
        };
    }

    async function exportPersona(format) {
        if (!contactDraft) return;
        syncContactDraft();
        const persona = String(contactDraft.persona || '');
        if (!persona.trim()) {
            closePersonaExportDialog();
            showToast('暂无可导出的人设内容');
            return;
        }

        const safeName = safePersonaFileName(contactDraft.name);
        try {
            const worldbooks = await collectBoundWorldbooks();
            if (format === 'txt') {
                downloadPersonaFile(
                    buildTonghuajiPersonaText(contactDraft.name, persona, worldbooks),
                    safeName + '-人设.txt',
                    'text/plain;charset=utf-8'
                );
            } else if (format === 'json') {
                const payload = {
                    format: PERSONA_JSON_FORMAT,
                    version: PERSONA_JSON_VERSION,
                    kind: 'persona',
                    app: '童话集',
                    exportedAt: new Date().toISOString(),
                    data: {
                        name: String(contactDraft.name || ''),
                        persona,
                        worldbooks
                    }
                };
                downloadPersonaFile(JSON.stringify(payload, null, 2), safeName + '-人设.json', 'application/json;charset=utf-8');
            } else {
                throw new Error('不支持的导出格式');
            }
            closePersonaExportDialog();
            showToast('已导出 ' + format.toUpperCase() + ' 人设与绑定世界书');
        } catch (error) {
            console.warn('Persona could not be exported:', error);
            closePersonaExportDialog();
            showToast(error?.message || '人设导出失败');
        }
    }

    function normalizeImportedWorldbookPackage(value) {
        if (value == null) return { groups: [], entries: [] };
        if (!value || typeof value !== 'object' || !Array.isArray(value.groups) || !Array.isArray(value.entries)) {
            throw new Error('世界书数据结构无效');
        }
        const groups = value.groups.map(group => ({
            id: String(group?.id || '').trim(),
            name: String(group?.name || '未分类').trim() || '未分类'
        }));
        const entries = value.entries.map(entry => {
            if (!entry || typeof entry !== 'object' || typeof entry.content !== 'string') {
                throw new Error('世界书条目结构无效');
            }
            const position = ['top', 'before_persona', 'after_persona', 'depth', 'bottom'].includes(entry.position)
                ? entry.position
                : 'after_persona';
            const normalized = {
                id: String(entry.id || '').trim(),
                groupId: String(entry.groupId || '').trim(),
                title: String(entry.title || '未命名条目'),
                key: String(entry.key || ''),
                content: entry.content,
                isGlobal: Boolean(entry.isGlobal),
                position,
                priority: Math.min(100, Math.max(-100, Math.floor(Number(entry.priority) || 0))),
                scanDepth: Math.min(50, Math.max(1, Math.floor(Number(entry.scanDepth) || 8)))
            };
            if (position === 'depth') {
                normalized.depth = Math.min(100, Math.max(1, Math.floor(Number(entry.depth ?? entry.insertionDepth ?? entry.insertion_depth) || 4)));
            }
            return normalized;
        });
        return { groups, entries };
    }

    function makeImportedWorldbookId(prefix, usedIds) {
        let id = '';
        do {
            id = makeId(prefix);
        } while (usedIds.has(id));
        usedIds.add(id);
        return id;
    }

    async function importBoundWorldbooks(worldbooks) {
        const normalized = normalizeImportedWorldbookPackage(worldbooks);
        if (!normalized.entries.length) return [];
        const runtime = await getWorldbookRuntime();
        if (typeof saveWorldbookData !== 'function') throw new Error('世界书保存功能暂不可用');

        const usedGroupIds = new Set(runtime.groups.map(group => String(group?.id || '')).filter(Boolean));
        const usedEntryIds = new Set(runtime.entries.map(entry => String(entry?.id || '')).filter(Boolean));
        const groupMap = new Map();

        const ensureUnclassifiedGroup = () => {
            let group = runtime.groups.find(item => item && item.name === '未分类');
            if (!group) {
                const id = usedGroupIds.has('default_unclassified')
                    ? makeImportedWorldbookId('wbg', usedGroupIds)
                    : 'default_unclassified';
                usedGroupIds.add(id);
                group = { id, name: '未分类', isPinned: false };
                runtime.groups.push(group);
            }
            return group.id;
        };

        normalized.groups.forEach(sourceGroup => {
            const sameId = sourceGroup.id ? runtime.groups.find(group => group?.id === sourceGroup.id) : null;
            const sameName = runtime.groups.find(group => group && String(group.name || '') === sourceGroup.name);
            if (sameId && String(sameId.name || '') === sourceGroup.name) {
                groupMap.set(sourceGroup.id, sameId.id);
                return;
            }
            if (sameName) {
                if (sourceGroup.id) groupMap.set(sourceGroup.id, sameName.id);
                return;
            }
            const targetId = sourceGroup.id && !usedGroupIds.has(sourceGroup.id)
                ? sourceGroup.id
                : makeImportedWorldbookId('wbg', usedGroupIds);
            usedGroupIds.add(targetId);
            runtime.groups.push({ id: targetId, name: sourceGroup.name, isPinned: false });
            if (sourceGroup.id) groupMap.set(sourceGroup.id, targetId);
        });

        const isSameWorldbookEntry = (entry, sourceEntry, targetGroupId) => {
            const entryPosition = ['top', 'before_persona', 'after_persona', 'depth', 'bottom'].includes(entry?.position)
                ? entry.position
                : 'after_persona';
            const entryPriority = Math.min(100, Math.max(-100, Math.floor(Number(entry?.priority) || 0)));
            const entryScanDepth = Math.min(50, Math.max(1, Math.floor(Number(entry?.scanDepth) || 8)));
            const entryDepth = entryPosition === 'depth'
                ? Math.min(100, Math.max(1, Math.floor(Number(entry?.depth ?? entry?.insertionDepth ?? entry?.insertion_depth) || 4)))
                : null;
            const sourceDepth = sourceEntry.position === 'depth' ? sourceEntry.depth : null;
            return String(entry?.groupId || '') === String(targetGroupId || '')
                && String(entry?.title || '未命名条目') === sourceEntry.title
                && String(entry?.key || '') === sourceEntry.key
                && String(entry?.content || '') === sourceEntry.content
                && Boolean(entry?.isGlobal) === sourceEntry.isGlobal
                && entryPosition === sourceEntry.position
                && entryPriority === sourceEntry.priority
                && entryScanDepth === sourceEntry.scanDepth
                && entryDepth === sourceDepth;
        };

        const boundIds = [];
        normalized.entries.forEach(sourceEntry => {
            const targetGroupId = groupMap.get(sourceEntry.groupId)
                || runtime.groups.find(group => group?.id === sourceEntry.groupId)?.id
                || ensureUnclassifiedGroup();
            const activeSameId = sourceEntry.id
                ? runtime.entries.find(entry => entry?.id === sourceEntry.id && !entry.isDeleted)
                : null;
            if (activeSameId && isSameWorldbookEntry(activeSameId, sourceEntry, targetGroupId)) {
                boundIds.push(activeSameId.id);
                return;
            }

            const equivalentEntry = runtime.entries.find(entry =>
                entry && !entry.isDeleted && isSameWorldbookEntry(entry, sourceEntry, targetGroupId)
            );
            if (equivalentEntry) {
                boundIds.push(equivalentEntry.id);
                return;
            }

            const targetId = sourceEntry.id && !usedEntryIds.has(sourceEntry.id)
                ? sourceEntry.id
                : makeImportedWorldbookId('wbe', usedEntryIds);
            usedEntryIds.add(targetId);
            const nextEntry = {
                id: targetId,
                groupId: targetGroupId,
                title: sourceEntry.title,
                key: sourceEntry.key,
                content: sourceEntry.content,
                isGlobal: sourceEntry.isGlobal,
                position: sourceEntry.position,
                priority: sourceEntry.priority,
                scanDepth: sourceEntry.scanDepth,
                isPinned: false,
                isDeleted: false,
                updateTime: Date.now()
            };
            if (sourceEntry.position === 'depth') nextEntry.depth = sourceEntry.depth;
            runtime.entries.push(nextEntry);
            boundIds.push(targetId);
        });

        saveWorldbookData();
        if (typeof wbRenderAll === 'function') wbRenderAll();
        return Array.from(new Set(boundIds));
    }

    function parseTonghuajiPersonaJson(text) {
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (error) {
            throw new Error('JSON 文件解析失败');
        }
        const valid = parsed
            && parsed.format === PERSONA_JSON_FORMAT
            && Number(parsed.version) === PERSONA_JSON_VERSION
            && parsed.kind === 'persona'
            && parsed.app === '童话集'
            && parsed.data
            && typeof parsed.data === 'object'
            && typeof parsed.data.persona === 'string';
        if (!valid) throw new Error('仅支持童话集导出的人设 JSON');
        if (!parsed.data.persona.trim()) throw new Error('JSON 中没有可导入的人设内容');
        return {
            name: typeof parsed.data.name === 'string' ? parsed.data.name.trim().slice(0, 40) : '',
            persona: parsed.data.persona,
            worldbooks: normalizeImportedWorldbookPackage(parsed.data.worldbooks)
        };
    }

    async function handlePersonaImport(input) {
        const file = input.files?.[0];
        input.value = '';
        if (!file || !contactDraft) return;
        if (file.size > 10 * 1024 * 1024) {
            showToast('文档不能超过 10MB');
            return;
        }

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'txt' && extension !== 'docx' && extension !== 'json') {
            showToast('请选择 TXT、DOCX 或童话集 JSON 文件');
            return;
        }

        try {
            showToast('正在解析人设…');
            const buffer = await file.arrayBuffer();
            let persona = '';
            let importedName = '';
            let importedWorldbooks = { groups: [], entries: [] };
            let isTonghuajiPackage = false;

            if (extension === 'json') {
                const imported = parseTonghuajiPersonaJson(decodePlainText(buffer).trim());
                persona = imported.persona;
                importedName = imported.name;
                importedWorldbooks = imported.worldbooks;
                isTonghuajiPackage = true;
            } else {
                const importedText = extension === 'docx' ? docxXmlToText(await readDocxXml(buffer)) : decodePlainText(buffer).trim();
                if (!importedText) throw new Error('文档中没有可导入的文字');
                const tonghuajiText = extension === 'txt' ? parseTonghuajiPersonaText(importedText) : null;
                if (tonghuajiText) {
                    persona = tonghuajiText.persona;
                    importedName = tonghuajiText.name;
                    importedWorldbooks = tonghuajiText.worldbooks;
                    isTonghuajiPackage = true;
                } else {
                    persona = importedText;
                    importedName = inferImportedName(importedText, file.name);
                }
            }

            const importedWorldbookIds = isTonghuajiPackage
                ? await importBoundWorldbooks(importedWorldbooks)
                : [];

            setValue('#ctContactPersona', persona);
            contactDraft.persona = persona;
            if (!getValue('#ctContactName').trim() && importedName) {
                setValue('#ctContactName', importedName);
                contactDraft.name = importedName;
            }
            if (importedWorldbookIds.length) {
                contactDraft.worldbookIds = Array.from(new Set([
                    ...(Array.isArray(contactDraft.worldbookIds) ? contactDraft.worldbookIds : []),
                    ...importedWorldbookIds
                ]));
                updateWorldbookStatus();
            }
            persistContactDraft();
            if (isTonghuajiPackage) {
                showToast(importedWorldbookIds.length
                    ? '已导入人设与 ' + importedWorldbookIds.length + ' 个绑定世界书'
                    : '已导入童话集人设');
            } else {
                showToast('已导入人设文档');
            }
        } catch (error) {
            console.warn('Persona document could not be imported:', error);
            showToast(error?.message || '文档解析失败');
        }
    }

    async function handleImageInput(input, target) {
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;
        try {
            const image = await fileToImage(file, target === 'reference' ? 1024 : 420);
            if (target === 'contact' && contactDraft) {
                contactDraft.avatar = image;
                fillAvatar(el('#ctContactAvatarPreview'), image, '角色');
                persistContactDraft();
            } else if (target === 'user' && userDraft) {
                userDraft.avatar = image;
                fillAvatar(el('#ctUserAvatarPreview'), image, 'User');
            } else if (target === 'reference' && contactDraft) {
                contactDraft.referenceImage = image;
                renderReferenceImage();
                persistContactDraft();
                showToast('已添加参考图');
            }
        } catch (error) {
            console.warn('Contacts image could not be loaded:', error);
            showToast('图片读取失败');
        }
    }

    function handleAction(actionElement, event) {
        const action = actionElement.dataset.action;
        switch (action) {
            case 'close-app': closeApp(); break;
            case 'switch-tab': 
                const targetTab = actionElement.dataset.tab;
                const nav = el('.ct-floating-tabs');
                if (data.selectedTab === targetTab) {
                    nav?.classList.toggle('is-expanded');
                } else {
                    nav?.classList.add('is-expanded');
                    switchTab(targetTab);
                }
                break;
            case 'toggle-main-menu': setMainMenu(!mainMenuOpen); break;
            case 'toggle-edit': setMainMenu(false); isEditMode = !isEditMode; renderMain(); break;
            case 'add-current': setMainMenu(false); data.selectedTab === 'char' ? openContact(null) : openUser(null); break;
            case 'add-group': addGroup(); break;
            case 'toggle-group': toggleGroup(actionElement.dataset.groupId); break;
            case 'delete-group': event.stopPropagation(); deleteGroup(actionElement.dataset.groupId); break;
            case 'generate-contact': event.stopPropagation(); event.preventDefault(); generateContact(actionElement.dataset.contactId, actionElement); break;
            case 'open-contact':
                if (isEditMode) {
                    editingContactId = actionElement.dataset.contactId;
                    contactDraft = normalizedContact(data.contacts.find(contact => contact.id === editingContactId));
                    deleteContact();
                } else openContact(actionElement.dataset.contactId);
                break;
            case 'open-user':
                if (isEditMode) {
                    editingUserId = actionElement.dataset.userId;
                    userDraft = clone(data.users.find(user => user.id === editingUserId));
                    deleteUser();
                } else {
                    openUser(actionElement.dataset.userId);
                }
                break;
            case 'back-main': goMain(); break;
            case 'save-contact': saveContact(); break;
            case 'switch-section': switchEditorSection(actionElement.dataset.section); break;
            case 'toggle-password': togglePassword(actionElement); break;
            case 'open-qr-preview': openQrPreview(); break;
            case 'choose-group': syncContactDraft(); openGroupSelect(); break;
            case 'choose-worldbooks': syncContactDraft(); openPicker('worldbook'); break;
            case 'open-voice': syncContactDraft(); showPage('voice', 'forward'); break;
            case 'open-appearance': syncContactDraft(); showPage('appearance', 'forward'); break;
            case 'open-persona-export': openPersonaExportDialog(); break;
            case 'export-persona': exportPersona(actionElement.dataset.format); break;
            case 'back-contact': syncContactDraft(); showPage('contact-editor', 'back'); break;
            case 'voice-provider': switchVoiceProvider(actionElement.dataset.provider); break;
            case 'add-npc': openNpc(null); break;
            case 'edit-npc': openNpc(actionElement.dataset.npcId); break;
            case 'cancel-npc': showPage('contact-editor', 'back'); switchEditorSection('npc'); break;
            case 'save-npc': saveNpc(); break;
            case 'save-user': saveUser(); break;
            case 'delete-contact': deleteContact(); break;
            case 'delete-user': deleteUser(); break;
            case 'delete-npc': deleteNpc(); break;
            case 'pick-contact-avatar': openContactAvatarMenu(actionElement); break;
            case 'pick-contact-avatar-file': closeContactAvatarMenu(); el('#ctContactAvatarInput')?.click(); break;
            case 'pick-contact-avatar-url': openContactAvatarUrlPrompt(); break;
            case 'pick-user-avatar': el('#ctUserAvatarInput')?.click(); break;
            case 'pick-reference-image': el('#ctReferenceImageInput')?.click(); break;
            case 'remove-reference-image':
                if (contactDraft) {
                    contactDraft.referenceImage = '';
                    renderReferenceImage();
                    showToast('已删除参考图');
                }
                break;
            case 'import-persona': el('#ctPersonaImportInput')?.click(); break;
            case 'picker-item': togglePickerItem(actionElement.dataset.id, actionElement); break;
            case 'close-picker': closePicker(); break;
            case 'confirm-picker': confirmPicker(); break;
            case 'cancel-dialog': closeDialog(); break;
            case 'confirm-dialog': confirmDialog(); break;
        }
    }

    function bindEvents() {
        root.addEventListener('click', event => {
            const actionElement = event.target.closest('[data-action]');
            const nav = el('.ct-floating-tabs');
            
            if (nav && !nav.contains(event.target) && (!actionElement || actionElement.dataset.action !== 'switch-tab')) {
                nav.classList.remove('is-expanded');
            }

            if (actionElement && root.contains(actionElement)) handleAction(actionElement, event);
            else if (event.target === el('#ctPersonaExportOverlay')) closePersonaExportDialog();
            else if (mainMenuOpen && !event.target.closest('.ct-header-menu-wrap')) setMainMenu(false);
            else if (contactAvatarMenuOpen && event.target === el('#ctContactAvatarMenuOverlay')) closeContactAvatarMenu();
        });
        el('#ctContactAvatarInput')?.addEventListener('change', event => handleImageInput(event.target, 'contact'));
        el('#ctUserAvatarInput')?.addEventListener('change', event => handleImageInput(event.target, 'user'));
        el('#ctReferenceImageInput')?.addEventListener('change', event => handleImageInput(event.target, 'reference'));
        el('#ctPersonaImportInput')?.addEventListener('change', event => handlePersonaImport(event.target));
        el('#ctDialogInput')?.addEventListener('keydown', event => {
            if (event.key === 'Enter') confirmDialog();
        });
        root.addEventListener('keydown', event => {
            if (event.key === 'Escape' && mainMenuOpen) setMainMenu(false);
            if (event.key === 'Escape' && contactAvatarMenuOpen) closeContactAvatarMenu();
            if (event.key === 'Escape' && el('#ctPersonaExportOverlay')?.classList.contains('is-active')) closePersonaExportDialog();
        });
        window.addEventListener('scroll', () => {
            if (root && root.classList.contains('show') && window.scrollX !== 0) {
                window.scrollTo(0, window.scrollY);
            }
        }, { passive: true });
    }

    async function init(container) {
        root = container || document.getElementById('contactsAppUI');
        if (!root || root.dataset.initialized === 'true') return;
        await loadData();
        bindEvents();
        renderMain();
        root.dataset.initialized = 'true';
    }

    async function open() {
        if (!root) await init(document.getElementById('contactsAppUI'));
        if (!root) return;
        if (!data) await loadData();
        renderMain();
        root.style.display = 'block';
        root.setAttribute('aria-hidden', 'false');

        // Use a short opacity-only entrance. No vertical travel on app open.
        requestAnimationFrame(() => root.classList.add('show'));
    }

    async function updateContactAvatarFromFile(contactId, file) {
        if (!data) await loadData();
        const contact = data?.contacts?.find(item => String(item?.id || '') === String(contactId || ''));
        if (!contact) throw new Error('未找到角色资料');
        const image = await fileToImage(file, 420);
        contact.avatar = image;
        await persist();
        return clone(contact);
    }

    async function updateUserAvatarFromFile(userId, file) {
        if (!data) await loadData();
        const user = data?.users?.find(item => String(item?.id || '') === String(userId || ''));
        if (!user) throw new Error('未找到 User 资料');
        const image = await fileToImage(file, 420);
        user.avatar = image;
        await persist();
        return clone(user);
    }

    window.ContactsApp = {
        init,
        reconcileCharacters,
        open,
        close: closeApp,
        openContact,
        openUser,
        openContactExternal,
        openUserExternal,
        updateContactAvatarFromFile,
        updateUserAvatarFromFile,
        getContacts: async () => {
            if (!data) await loadData();
            return data ? [...data.contacts] : [];
        },
        getUsers: async () => {
            if (!data) await loadData();
            return data ? [...data.users] : [];
        },
        getGroups: async () => {
            if (!data) await loadData();
            return data ? [...data.groups] : [];
        }
    };
    window.addEventListener('tonghuaji:runtime-ready', () => {
        void reconcileCharacters().catch(error => console.warn('Stored character reconciliation failed:', error));
    });
})();
}





