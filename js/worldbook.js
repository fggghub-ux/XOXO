(() => {
    if (document.getElementById('worldbookAppUI')) return;
    const html = `
    <div class="wb-app-container" id="worldbookAppUI">
        <!-- 1. 主页面：世界书分组列表 -->
        <div class="wb-page active" id="wbMainPage">
            <div class="wb-scroll-area">
                <div class="wb-main-header">
                    <div class="wb-header-top">
                        <div class="wb-nav-btn-circle" onclick="closeWorldbookApp()">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </div>
                        <div class="wb-header-right">
                            <div class="wb-float-btn icon-only" onclick="wbOpenCreateGroupModal()">
                                <svg viewBox="0 0 800 800" width="38" height="38" style="overflow: visible;">
                                  <g transform="translate(39.042298,759.488185) scale(0.089797,-0.089797)" fill="#000000" stroke="#000000" stroke-width="200" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M2080 5879 c-77 -15 -182 -74 -244 -136 -63 -63 -97 -116 -129 -201 l-22 -57 -3 -1437 c-3 -1585 -5 -1515 60 -1648 61 -127 208 -240 346 -269 37 -8 604 -11 1939 -11 2079 0 1936 -4 2067 62 116 59 228 208 255 341 8 37 11 430 9 1322 -3 1227 -4 1272 -22 1320 -64 164 -169 267 -336 327 l-65 23 -1225 5 -1225 5 -56 27 c-30 15 -107 71 -170 123 -138 116 -195 155 -274 186 -59 24 -64 24 -460 26 -220 1 -420 -3 -445 -8z m805 -203 c80 -21 93 -30 295 -196 86 -70 181 -127 255 -151 32 -11 290 -15 1275 -19 l1235 -5 47 -28 c55 -33 108 -90 140 -149 l23 -43 3 -1252 c2 -1240 2 -1252 -18 -1306 -27 -73 -88 -139 -158 -174 l-57 -28 -1879 -3 c-1700 -2 -1885 -1 -1935 14 -96 28 -163 89 -208 189 -17 38 -18 119 -21 1465 -2 1291 -1 1430 14 1475 33 102 132 196 225 214 76 15 707 13 764 -3z"/>
                                    <path d="M2294 4876 c-58 -58 -43 -138 32 -166 28 -11 3320 -14 3373 -4 80 16 107 104 52 166 l-29 33 -1697 3 -1697 2 -34 -34z"/>
                                  </g>
                                  <circle cx="570" cy="565" r="110" fill="#000000" stroke="#ffffff" stroke-width="16"/>
                                  <path d="M 522 565 H 618 M 570 517 V 613" stroke="#ffffff" stroke-width="26" stroke-linecap="round" fill="none"/>
                                </svg>
                            </div>
                            <div class="wb-float-btn text-only" id="wbEditBtn" onclick="wbToggleEditMode()">编辑</div>
                        </div>
                    </div>
                    <div class="wb-header-bottom">
                        <div class="wb-header-title">世界书</div>
                        <div class="wb-header-subtitle" onclick="wbOpenFilterMenu(event)">
                            <span id="wbCurrentFilterText">全部世界书</span>
                            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <!-- 视图 1：全部分组 -->
                <div id="wb-view-all-groups" style="display: block;">
                    <div class="wb-list-card" id="wbGroupList">
                        <div class="wb-empty-state" id="wbGroupEmptyState">请先添加世界书</div>
                    </div>
                </div>

                <!-- 视图 2：全局世界书条目 -->
                <div id="wb-view-global-entries" style="display: none; padding: 0 16px;">
                    <div class="wb-doc-list-card" id="wbGlobalEntriesList"></div>
                </div>

                <!-- 视图 3：最近删除 -->
                <div id="wb-view-deleted-entries" style="display: none; padding: 0 16px;">
                    <div class="wb-doc-list-card" id="wbDeletedEntriesList"></div>
                </div>
            </div>
        </div>

        <!-- 2. 二级页面：分组详情页 -->
        <div class="wb-page slide-right" id="wbGroupPage">
            <div class="wb-nav-bar">
                <div class="wb-nav-back" onclick="wbCloseGroup()">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    世界书
                </div>
                <div class="wb-nav-title" id="wbGroupTitle">未命名分组</div>
                <div class="wb-nav-right">
                    <svg id="wbViewToggleBtn" onclick="wbToggleViewMode()" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                </div>
            </div>

            <div class="wb-scroll-area wb-notes-container">
                <div id="wbListView" class="wb-view-list">
                    <div class="wb-doc-list-card" id="wbGroupEntriesList">
                        <div class="wb-empty-state" id="wbEntryEmptyState">请先添加世界书</div>
                    </div>
                </div>
                <div id="wbGridView" class="wb-view-grid"></div>
            </div>
        </div>

        <!-- 3. 三级页面：世界书编辑页 -->
        <div class="wb-page slide-right wb-editor-page" id="wbEditorPage">
            <div class="wb-editor-nav">
                <div class="wb-nav-btn-circle" onclick="wbCloseEditor()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="wb-editor-nav-right">
                    <div class="wb-nav-capsule">
                        <label class="wb-entry-import-trigger" for="wbEntryImportInput" aria-label="导入 TXT 或 DOCX 文档" title="导入 TXT 或 DOCX 文档">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                              <path d="M17 9.00195c2.175 0.01211 3.3529 0.10856 4.1213 0.87695C22 10.7576 22 12.1718 22 15.0002v1c0 2.8284 0 4.2427 -0.8787 5.1213 -0.8787 0.8787 -2.2929 0.8787 -5.1213 0.8787H8c-2.82843 0 -4.24264 0 -5.12132 -0.8787C2 20.2429 2 18.8286 2 16.0002l0 -1c0 -2.8284 0 -4.2426 0.87868 -5.12131C3.64706 9.11051 4.82497 9.01406 7 9.00195" stroke="#000000" stroke-linecap="round" stroke-width="2.5"></path>
                              <path d="m12 15 0 -13m0 0 3 3.5M12 2 9 5.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                            </svg>
                        </label>
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle><circle cx="19" cy="12" r="1.5" fill="currentColor"></circle><circle cx="5" cy="12" r="1.5" fill="currentColor"></circle></svg>
                    </div>
                    <div class="wb-nav-btn-circle yellow" onclick="wbSaveEntry()">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
            </div>

            <div class="wb-scroll-area wb-editor-content-area">
                <input type="text" class="wb-editor-title-input" id="wbEntryTitle" placeholder="条目名称">
                <div class="wb-editor-key-container">
                    <svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
                    <input type="text" class="wb-editor-key-input" placeholder="添加触发词 (逗号分隔)...">
                </div>
                <textarea class="wb-editor-textarea" placeholder="在这里输入世界书内容..."></textarea>

                <div class="wb-settings-group-title">条目设置</div>
                <div class="wb-settings-card">
                    <div class="wb-settings-row clickable" onclick="wbOpenGroupSelectSheet()">
                        <div class="wb-settings-label">所属分组</div>
                        <div class="wb-settings-value-with-arrow">
                            <span id="wbSelectedGroupName">未分类</span>
                            <svg class="wb-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wb-settings-row">
                        <div class="wb-settings-label">全局激活 (Global)</div>
                        <div class="wb-ios-switch" onclick="this.classList.toggle('active')"></div>
                    </div>
                    <div class="wb-settings-row">
                        <div class="wb-settings-label">注入位置</div>
                        <div class="wb-settings-value-with-arrow" onclick="wbChangePosition()" style="cursor: pointer;">
                            <span id="wbPositionText" data-value="after_persona">人设后</span>
                            <svg class="wb-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="wb-settings-row" id="wbDepthRow" style="display: none;">
                        <div class="wb-settings-label">历史深度</div>
                        <input type="number" id="wbDepthInput" min="1" max="100" value="4" inputmode="numeric" style="width: 64px; border: 0; background: transparent; color: #8e8e93; text-align: right; font-size: 15px; outline: none;">
                    </div>
                    <div class="wb-settings-row">
                        <div class="wb-settings-label">世界书权重</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span id="wbPriorityTierText" style="font-size:12px;color:#8e8e93;">重要</span>
                            <input type="number" id="wbPriorityInput" min="-100" max="100" value="0" inputmode="numeric" oninput="wbUpdatePriorityTierDisplay(this.value)" style="width: 54px; border: 0; background: transparent; color: #8e8e93; text-align: right; font-size: 15px; outline: none;" title="34~100=核心，-33~33=重要，-100~-34=补充">
                        </div>
                    </div>
                    <div class="wb-settings-row">
                        <div class="wb-settings-label">触发扫描层数</div>
                        <input type="number" id="wbScanDepthInput" min="1" max="50" value="8" inputmode="numeric" style="width: 64px; border: 0; background: transparent; color: #8e8e93; text-align: right; font-size: 15px; outline: none;">
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部悬浮工具栏 -->
        <div class="wb-bottom-float-bar" id="wbBottomBar">
            <div class="wb-search-pill" onclick="wbOpenSearch()">
                <svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span class="placeholder">搜索世界书条目</span>
                <svg class="mic-icon" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            </div>
            <div class="wb-compose-btn" onclick="wbOpenEditor('')">
                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
        </div>

        <!-- 搜索覆盖层 -->
        <div class="wb-search-overlay" id="wbSearchOverlay" onclick="event.stopPropagation();">
            <div class="wb-search-header">
                <div class="wb-search-input-box">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="搜索世界书条目" id="wbSearchInput" oninput="wbHandleSearch()" onclick="event.stopPropagation();">
                </div>
                <div class="wb-search-cancel" onclick="wbCloseSearch()">取消</div>
            </div>
            <div class="wb-search-results">输入关键字以搜索条目内容、Key 或标题...</div>
        </div>

        <!-- 筛选菜单 -->
        <div class="icon-menu-overlay" id="wbFilterMenuOverlay" onclick="wbCloseFilterMenu()" style="z-index: 2000;">
            <div class="icon-menu" id="wbFilterMenu" onclick="event.stopPropagation()">
                <div class="icon-menu-item" onclick="wbSwitchMainView('all', '全部世界书')">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
                    <span>全部世界书</span>
                </div>
                <div class="icon-menu-item" onclick="wbSwitchMainView('global', '全局世界书条目')">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    <span>全局世界书条目</span>
                </div>
                <div class="icon-menu-item" onclick="wbSwitchMainView('deleted', '最近删除')">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    <span>最近删除</span>
                </div>
            </div>
        </div>

        <!-- 长按菜单 -->
        <div class="icon-menu-overlay" id="wbContextMenuOverlay" onclick="wbCloseContextMenu()" style="z-index: 2000;">
            <div class="icon-menu" id="wbContextMenu" onclick="event.stopPropagation()"></div>
        </div>

        <!-- 底部抽屉 (选择分组) -->
        <div class="wb-bottom-sheet-overlay" id="wbGroupSelectSheetOverlay" onclick="wbCloseGroupSelectSheet()">
            <div class="wb-bottom-sheet" id="wbGroupSelectSheet" onclick="event.stopPropagation()">
                <div class="wb-sheet-header">
                    <div class="wb-sheet-cancel" onclick="wbCloseGroupSelectSheet()">取消</div>
                    <div class="wb-sheet-title">世界书分组</div>
                    <div class="wb-sheet-confirm" onclick="wbConfirmGroupSelect()">确认</div>
                </div>
                <div class="wb-sheet-content">
                    <div class="wb-sheet-list-card" id="wbGroupSelectList"></div>
                </div>
            </div>
        </div>
        <input id="wbEntryImportInput" type="file" accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onchange="wbHandleEntryImport(this)">
    </div>
    `;
    const target = document.querySelector('.iphone') || document.body;
    if (target) {
        target.insertAdjacentHTML('beforeend', html);
    }
})();

    let worldbookVisibilityTimer = 0;

    function openWorldbookApp() {
        const worldbookUI = document.getElementById('worldbookAppUI');
        if (!worldbookUI) {
            showCustomAlert('提示', '世界书模块尚未加载');
            return;
        }

        if (worldbookVisibilityTimer) {
            clearTimeout(worldbookVisibilityTimer);
            worldbookVisibilityTimer = 0;
        }

        worldbookUI.style.display = 'flex';
        worldbookUI.classList.add('show');
    }

    function closeWorldbookApp(options = {}) {
        const worldbookUI = document.getElementById('worldbookAppUI');
        if (!worldbookUI) return;

        const immediateClose = options === true || Boolean(options && typeof options === 'object' && options.immediate);

        if (worldbookVisibilityTimer) {
            clearTimeout(worldbookVisibilityTimer);
            worldbookVisibilityTimer = 0;
        }

        worldbookUI.classList.remove('show');

        if (immediateClose) {
            worldbookUI.style.display = 'none';
            return;
        }

        worldbookVisibilityTimer = window.setTimeout(() => {
            worldbookVisibilityTimer = 0;
            if (!worldbookUI.classList.contains('show')) {
                worldbookUI.style.display = 'none';
            }
        }, 150);
    }

            // show three-dots button; click to expand vertical capsule menu
    // --- 世界书 APP 逻辑 (数据驱动版) ---


    let wbCurrentGroupId = null;
    let wbCurrentEntryId = null;
    let wbIsGridView = false;
    let wbIsEditMode = false;
    let wbPakoLoadPromise = null;

    function wbDecodePlainText(buffer) {
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

    function wbLoadPakoInflater() {
        if (window.pako?.inflateRaw) return Promise.resolve(window.pako);
        if (wbPakoLoadPromise) return wbPakoLoadPromise;

        wbPakoLoadPromise = new Promise((resolve, reject) => {
            const finish = () => window.pako?.inflateRaw
                ? resolve(window.pako)
                : reject(new Error('DOCX 解压组件加载失败'));
            const existingScript = document.getElementById('wbPakoInflater');

            if (existingScript) {
                existingScript.addEventListener('load', finish, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('DOCX 解压组件加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'wbPakoInflater';
            script.src = 'js/vendor/pako_inflate.min.js';
            script.onload = finish;
            script.onerror = () => {
                script.remove();
                reject(new Error('DOCX 解压组件加载失败'));
            };
            document.head.appendChild(script);
        }).catch(error => {
            wbPakoLoadPromise = null;
            throw error;
        });

        return wbPakoLoadPromise;
    }

    async function wbInflateZipEntry(bytes, method) {
        if (method === 0) return bytes;
        if (method !== 8) throw new Error('DOCX 使用了不受支持的压缩格式');

        if (typeof DecompressionStream === 'function') {
            try {
                const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                return new Uint8Array(await new Response(stream).arrayBuffer());
            } catch (error) {
                console.info('Native raw DEFLATE is unavailable; using the local DOCX inflater.', error);
            }
        }

        const inflater = await wbLoadPakoInflater();
        try {
            return inflater.inflateRaw(bytes);
        } catch (error) {
            throw new Error('DOCX 正文解压失败');
        }
    }

    async function wbReadDocxXmlWithoutLibrary(buffer) {
        const bytes = new Uint8Array(buffer);
        if (bytes.length < 22) throw new Error('DOCX 文件结构无效');

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
            if (directoryOffset + 46 > bytes.length || view.getUint32(directoryOffset, true) !== 0x02014b50) break;

            const method = view.getUint16(directoryOffset + 10, true);
            const compressedSize = view.getUint32(directoryOffset + 20, true);
            const nameLength = view.getUint16(directoryOffset + 28, true);
            const extraLength = view.getUint16(directoryOffset + 30, true);
            const commentLength = view.getUint16(directoryOffset + 32, true);
            const localOffset = view.getUint32(directoryOffset + 42, true);
            const nextDirectoryOffset = directoryOffset + 46 + nameLength + extraLength + commentLength;
            if (nextDirectoryOffset > bytes.length) throw new Error('DOCX 文件结构无效');

            const name = decoder.decode(bytes.subarray(directoryOffset + 46, directoryOffset + 46 + nameLength));
            if (name === 'word/document.xml') {
                if (localOffset + 30 > bytes.length || view.getUint32(localOffset, true) !== 0x04034b50) {
                    throw new Error('DOCX 正文结构无效');
                }
                const localNameLength = view.getUint16(localOffset + 26, true);
                const localExtraLength = view.getUint16(localOffset + 28, true);
                const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
                if (dataOffset + compressedSize > bytes.length) throw new Error('DOCX 正文结构无效');

                const content = await wbInflateZipEntry(bytes.slice(dataOffset, dataOffset + compressedSize), method);
                return decoder.decode(content);
            }
            directoryOffset = nextDirectoryOffset;
        }
        throw new Error('DOCX 中没有可读取的正文');
    }

    async function wbReadDocxXml(buffer) {
        if (typeof window.JSZip !== 'undefined') {
            const zip = await window.JSZip.loadAsync(buffer);
            const documentFile = zip.file('word/document.xml');
            if (!documentFile) throw new Error('DOCX 中没有可读取的正文');
            return documentFile.async('string');
        }
        return wbReadDocxXmlWithoutLibrary(buffer);
    }

    function wbDocxXmlToText(xml) {
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

    function wbInferImportedTitle(fileName) {
        return fileName.replace(/\.(?:txt|docx)$/i, '').trim() || '未命名条目';
    }

    async function wbHandleEntryImport(input) {
        const file = input?.files?.[0];
        if (input) input.value = '';
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            if (typeof showToast === 'function') showToast('文档不能超过 10MB');
            return;
        }

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'txt' && extension !== 'docx') {
            if (typeof showToast === 'function') showToast('请选择 TXT 或 DOCX 文件');
            return;
        }

        try {
            if (typeof showToast === 'function') showToast('正在解析文档…');
            const buffer = await file.arrayBuffer();
            const importedText = extension === 'docx'
                ? wbDocxXmlToText(await wbReadDocxXml(buffer))
                : wbDecodePlainText(buffer).trim();
            if (!importedText) throw new Error('文档中没有可导入的文字');

            const contentInput = document.querySelector('.wb-editor-textarea');
            const titleInput = document.getElementById('wbEntryTitle');
            if (!contentInput || !titleInput) throw new Error('世界书编辑器尚未打开');

            contentInput.value = importedText;
            if (!titleInput.value.trim()) titleInput.value = wbInferImportedTitle(file.name);
            if (typeof showToast === 'function') showToast('已导入世界书文档');
        } catch (error) {
            console.warn('Worldbook document could not be imported:', error);
            if (typeof showToast === 'function') showToast(error?.message || '文档解析失败');
        }
    }

    function wbCleanUpDeletedEntries() {
        const now = Date.now();
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
        let changed = false;
        wbEntries = wbEntries.filter(e => {
            if (e.isDeleted && e.deleteTime) {
                if (now - e.deleteTime > THREE_DAYS_MS) {
                    changed = true;
                    return false; // 超过3天，彻底删除
                }
            }
            return true;
        });
        if (changed) {
            saveWorldbookData();
        }
    }

    function openWorldbookApp() {
        wbCleanUpDeletedEntries(); // 打开时自动清理过期条目
        const worldbookUI = document.getElementById('worldbookAppUI');
        worldbookUI.style.display = 'flex';
        wbRenderAll();
        setTimeout(() => { worldbookUI.classList.add('show'); }, 10);
    }

    function closeWorldbookApp(options = {}) {
        const worldbookUI = document.getElementById('worldbookAppUI');
        if (!worldbookUI) return;

        const immediateClose = options === true || Boolean(options && typeof options === 'object' && options.immediate);

        if (worldbookVisibilityTimer) {
            clearTimeout(worldbookVisibilityTimer);
            worldbookVisibilityTimer = 0;
        }

        worldbookUI.classList.remove('show');

        if (immediateClose) {
            worldbookUI.style.display = 'none';
            return;
        }

        worldbookVisibilityTimer = window.setTimeout(() => {
            worldbookVisibilityTimer = 0;
            if (!worldbookUI.classList.contains('show')) {
                worldbookUI.style.display = 'none';
            }
        }, 150);
    }

    function wbRenderAll() {
        wbRenderGroups();
        if (wbCurrentGroupId) wbRenderEntries(wbCurrentGroupId);
        wbRenderGlobalEntries();
        wbRenderDeletedEntries();
        wbRenderGroupSelectSheet();
    }

    function wbRenderGroups() {
        const list = document.getElementById('wbGroupList');
        if (!list) return;
        
        // 保留 SVG defs (精确加粗：去除阻挡描边的 stroke="none"，描边宽度设为 180)
        const defs = `<svg style="display:none;"><defs><symbol id="wb-folder-icon" viewBox="0 0 800 800"><g transform="translate(39.042298,759.488185) scale(0.089797,-0.089797)" fill="#e4af0a" stroke="#e4af0a" stroke-width="180" stroke-linejoin="round" stroke-linecap="round"><path d="M2080 5879 c-77 -15 -182 -74 -244 -136 -63 -63 -97 -116 -129 -201 l-22 -57 -3 -1437 c-3 -1585 -5 -1515 60 -1648 61 -127 208 -240 346 -269 37 -8 604 -11 1939 -11 2079 0 1936 -4 2067 62 116 59 228 208 255 341 8 37 11 430 9 1322 -3 1227 -4 1272 -22 1320 -64 164 -169 267 -336 327 l-65 23 -1225 5 -1225 5 -56 27 c-30 15 -107 71 -170 123 -138 116 -195 155 -274 186 -59 24 -64 24 -460 26 -220 1 -420 -3 -445 -8z m805 -203 c80 -21 93 -30 295 -196 86 -70 181 -127 255 -151 32 -11 290 -15 1275 -19 l1235 -5 47 -28 c55 -33 108 -90 140 -149 l23 -43 3 -1252 c2 -1240 2 -1252 -18 -1306 -27 -73 -88 -139 -158 -174 l-57 -28 -1879 -3 c-1700 -2 -1885 -1 -1935 14 -96 28 -163 89 -208 189 -17 38 -18 119 -21 1465 -2 1291 -1 1430 14 1475 33 102 132 196 225 214 76 15 707 13 764 -3z"/><path d="M2294 4876 c-58 -58 -43 -138 32 -166 28 -11 3320 -14 3373 -4 80 16 107 104 52 166 l-29 33 -1697 3 -1697 2 -34 -34z"/></g></symbol><g id="wb-delete-icon"><circle cx="12" cy="12" r="10"/><rect x="7" y="11" width="10" height="2" fill="#fff"/></g></defs></svg>`;

        if (wbGroups.length === 0) {

            list.innerHTML = defs + `<div class="wb-empty-state" style="display:block;">请先添加世界书</div>`;
            list.style.background = 'transparent';
            list.style.boxShadow = 'none';
            return;
        }

        list.style.background = '';
        list.style.boxShadow = '';
        
        // 排序：置顶的在前
        const sortedGroups = [...wbGroups].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        
        let html = defs;
        sortedGroups.forEach(g => {
            const count = wbEntries.filter(e => e.groupId === g.id && !e.isDeleted).length;
            html += `
                <div class="wb-list-item" onpointerdown="wbHandlePointerDown(event, 'group', '${g.id}', this)" onpointermove="wbHandlePointerMove()" onpointerup="wbHandlePointerUp(event, 'group', '${g.id}', this)" onpointercancel="wbHandlePointerMove()">
                    <div class="wb-delete-btn" onclick="wbDeleteGroup(event, '${g.id}')"><svg><use href="#wb-delete-icon"/></svg></div>
                    <div class="wb-item-icon"><svg><use href="#wb-folder-icon"/></svg></div>
                    <div class="wb-item-content">
                        <div class="wb-item-title">${g.name} ${g.isPinned ? '📌' : ''}</div>
                        <div class="wb-item-right"><span class="wb-item-count">${count}</span><svg class="wb-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    }

    function wbRenderEntries(groupId) {
        const group = wbGroups.find(g => g.id === groupId);
        if (group) document.getElementById('wbGroupTitle').innerText = group.name;

        const listContainer = document.getElementById('wbGroupEntriesList');
        const gridContainer = document.getElementById('wbGridView');
        if (!listContainer || !gridContainer) return;

        const entries = wbEntries.filter(e => e.groupId === groupId && !e.isDeleted)
                                 .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updateTime - a.updateTime);

        if (entries.length === 0) {
            listContainer.innerHTML = `<div class="wb-empty-state" style="display:block;">此分组暂无条目</div>`;
            listContainer.style.background = 'transparent';
            listContainer.style.boxShadow = 'none';
            gridContainer.innerHTML = '';
            return;
        }

        listContainer.style.background = '';
        listContainer.style.boxShadow = '';

        let listHtml = '';
        let gridHtml = '';

        entries.forEach(e => {
            const sizeKB = (e.content.length / 1024).toFixed(1);
            const titleDisplay = e.title + (e.isPinned ? ' 📌' : '');
            
            // List View
            listHtml += `
                <div class="wb-doc-list-item" onpointerdown="wbHandlePointerDown(event, 'entry', '${e.id}', this)" onpointermove="wbHandlePointerMove()" onpointerup="wbHandlePointerUp(event, 'entry', '${e.id}', this)" onpointercancel="wbHandlePointerMove()">
                    <div class="wb-doc-thumbnail"><div class="wb-doc-line"></div><div class="wb-doc-line medium"></div><div class="wb-doc-line"></div><div class="wb-doc-line short"></div></div>
                    <div class="wb-doc-info">
                        <div class="wb-doc-title">${titleDisplay}</div>
                        <div class="wb-doc-sub">${sizeKB} KB · ${wbGetPriorityTierLabel(e)}</div>
                    </div>
                </div>
            `;
            
            // Grid View
            gridHtml += `
                <div class="wb-grid-item" onpointerdown="wbHandlePointerDown(event, 'entry', '${e.id}', this)" onpointermove="wbHandlePointerMove()" onpointerup="wbHandlePointerUp(event, 'entry', '${e.id}', this)" onpointercancel="wbHandlePointerMove()">
                    <div class="wb-grid-preview-box"><div class="wb-mock-text-line"></div><div class="wb-mock-text-line medium"></div><div class="wb-mock-text-line"></div><div class="wb-mock-text-line short"></div><div class="wb-mock-text-line"></div></div>
                    <div class="wb-grid-title">${titleDisplay}</div>
                </div>
            `;
        });

        listContainer.innerHTML = listHtml;
        gridContainer.innerHTML = gridHtml;
    }

    function wbRenderGlobalEntries() {
        const container = document.getElementById('wbGlobalEntriesList');
        if (!container) return;
        const globals = wbEntries.filter(e => e.isGlobal && !e.isDeleted);
        
        if (globals.length === 0) {
            container.innerHTML = `<div class="wb-empty-state" style="display:block;">暂无全局激活的条目</div>`;
            container.style.background = 'transparent';
            container.style.boxShadow = 'none';
            return;
        }
        
        container.style.background = '';
        container.style.boxShadow = '';
        let html = '';
        globals.forEach(e => {
            const sizeKB = (e.content.length / 1024).toFixed(1);
            html += `
                <div class="wb-doc-list-item" onpointerdown="wbHandlePointerDown(event, 'entry', '${e.id}', this)" onpointermove="wbHandlePointerMove()" onpointerup="wbHandlePointerUp(event, 'entry', '${e.id}', this)" onpointercancel="wbHandlePointerMove()">
                    <div class="wb-doc-thumbnail"><div class="wb-doc-line"></div><div class="wb-doc-line medium"></div><div class="wb-doc-line"></div><div class="wb-doc-line short"></div></div>
                    <div class="wb-doc-info">
                        <div class="wb-doc-title">${e.title}</div>
                        <div class="wb-doc-sub">${sizeKB} KB · ${wbGetPriorityTierLabel(e)}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function wbRenderDeletedEntries() {
        const container = document.getElementById('wbDeletedEntriesList');
        if (!container) return;
        const deleted = wbEntries.filter(e => e.isDeleted);
        
        if (deleted.length === 0) {
            container.innerHTML = `<div class="wb-empty-state" style="display:block;">暂无最近删除的条目</div>`;
            container.style.background = 'transparent';
            container.style.boxShadow = 'none';
            return;
        }
        
        container.style.background = '';
        container.style.boxShadow = '';
        let html = '';
        deleted.forEach(e => {
            const sizeKB = (e.content.length / 1024).toFixed(1);
            html += `
                <div class="wb-doc-list-item">
                    <div class="wb-doc-thumbnail"><div class="wb-doc-line"></div><div class="wb-doc-line short"></div><div class="wb-doc-line medium"></div><div class="wb-doc-line"></div></div>
                    <div class="wb-doc-info">
                        <div class="wb-doc-title" style="color: #8e8e93;">${e.title}</div>
                        <div class="wb-doc-sub">${sizeKB} KB</div>
                    </div>
                    <div class="wb-doc-action-text" onclick="wbRestoreEntry('${e.id}', event)">恢复</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    let tempSelectedGroupId = null;
    let entryToChangeGroup = null;

    function wbRenderGroupSelectSheet() {
        const sheetList = document.getElementById('wbGroupSelectList');
        if (!sheetList) return;
        let html = '';
        wbGroups.forEach(g => {
            const isSelected = g.id === tempSelectedGroupId ? 'selected' : '';
            html += `
                <div class="wb-sheet-list-item ${isSelected}" onclick="wbSelectGroup('${g.id}', this)">
                    <div class="wb-sheet-item-left">
                        <div class="wb-sheet-item-icon"><svg><use href="#wb-folder-icon"/></svg></div>
                        <span class="wb-sheet-item-text">${g.name}</span>
                    </div>
                    <svg class="wb-sheet-check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            `;
        });
        sheetList.innerHTML = html;
    }

    function wbOpenGroupSelectSheet() { 
        entryToChangeGroup = null;
        tempSelectedGroupId = document.getElementById('wbSelectedGroupName').getAttribute('data-id');
        
        // 动态注入方案3的头部 (左取消，中标题，右确认)
        const header = document.querySelector('.wb-sheet-header');
        if (header) {
            header.innerHTML = `
                <div class="wb-sheet-cancel" onclick="wbCloseGroupSelectSheet()">取消</div>
                <div class="wb-sheet-title">世界书分组</div>
                <div class="wb-sheet-confirm" onclick="wbConfirmGroupSelect()">确认</div>
            `;
        }
        
        wbRenderGroupSelectSheet();
        document.getElementById('wbGroupSelectSheetOverlay').classList.add('show'); 
    }
    
    function wbCloseGroupSelectSheet() { 
        document.getElementById('wbGroupSelectSheetOverlay').classList.remove('show'); 
        entryToChangeGroup = null;
    }
    
    function wbSelectGroup(id, element) {
        document.querySelectorAll('.wb-sheet-list-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        tempSelectedGroupId = id;
    }

    function wbConfirmGroupSelect() {
        if (tempSelectedGroupId) {
            if (entryToChangeGroup) {
                const entry = wbEntries.find(e => e.id === entryToChangeGroup);
                if (entry) {
                    entry.groupId = tempSelectedGroupId;
                    entry.updateTime = Date.now();
                    saveWorldbookData();
                    wbRenderAll();
                    if (typeof showToast === 'function') showToast('已更换分组');
                }
                entryToChangeGroup = null;
            } else {
                const group = wbGroups.find(g => g.id === tempSelectedGroupId);
                if (group) {
                    document.getElementById('wbSelectedGroupName').innerText = group.name;
                    document.getElementById('wbSelectedGroupName').setAttribute('data-id', group.id);
                }
            }
        }
        wbCloseGroupSelectSheet();
    }

    function wbChangeEntryGroup(id) {
        entryToChangeGroup = id;
        const entry = wbEntries.find(e => e.id === id);
        if (entry) {
            tempSelectedGroupId = entry.groupId;
            wbRenderGroupSelectSheet();
            document.getElementById('wbGroupSelectSheetOverlay').classList.add('show');
        }
    }

    function wbHandleSearch() {
        const query = document.getElementById('wbSearchInput').value.trim().toLowerCase();
        const resultsContainer = document.querySelector('.wb-search-results');
        
        if (!query) {
            resultsContainer.innerHTML = '输入关键字以搜索条目内容、Key 或标题...';
            return;
        }

        const results = wbEntries.filter(e => !e.isDeleted && (
            e.title.toLowerCase().includes(query) || 
            (e.key && e.key.toLowerCase().includes(query)) || 
            (e.content && e.content.toLowerCase().includes(query))
        ));

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div style="text-align:center; margin-top: 20px;">无匹配结果</div>';
            return;
        }

        let html = '<div class="wb-doc-list-card" style="text-align: left;">';
        results.forEach(e => {
            const sizeKB = (e.content.length / 1024).toFixed(1);
            html += `
                <div class="wb-doc-list-item" onclick="wbOpenEditor('${e.id}'); wbCloseSearch();">
                    <div class="wb-doc-thumbnail"><div class="wb-doc-line"></div><div class="wb-doc-line medium"></div><div class="wb-doc-line"></div><div class="wb-doc-line short"></div></div>
                    <div class="wb-doc-info">
                        <div class="wb-doc-title">${e.title}</div>
                        <div class="wb-doc-sub">${sizeKB} KB · ${wbGetPriorityTierLabel(e)}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    function wbHandleItemClick(element, id) {
        if (document.getElementById('wbGroupList').classList.contains('wb-edit-mode')) return;
        wbCurrentGroupId = id;
        wbRenderEntries(id);
        
        // 同步更新编辑页默认选中的分组
        const group = wbGroups.find(g => g.id === id);
        if (group) {
            document.getElementById('wbSelectedGroupName').innerText = group.name;
            document.getElementById('wbSelectedGroupName').setAttribute('data-id', group.id);
            document.querySelectorAll('.wb-sheet-list-item').forEach(el => el.classList.remove('selected'));
            document.querySelectorAll('.wb-sheet-list-item span').forEach(span => {
                if(span.innerText === group.name) span.parentElement.classList.add('selected');
            });
        }

        document.getElementById('wbMainPage').classList.remove('active');
        document.getElementById('wbMainPage').classList.add('slide-left');
        document.getElementById('wbGroupPage').classList.remove('slide-right');
        document.getElementById('wbGroupPage').classList.add('active');
    }

    function wbCloseGroup() {
        wbCurrentGroupId = null;
        wbRenderGroups(); // 刷新主页计数
        document.getElementById('wbGroupPage').classList.remove('active'); 
        document.getElementById('wbGroupPage').classList.add('slide-right');
        document.getElementById('wbMainPage').classList.remove('slide-left'); 
        document.getElementById('wbMainPage').classList.add('active');
    }

    function wbUpdateDepthVisibility(position) {
        const depthRow = document.getElementById('wbDepthRow');
        if (!depthRow) return;
        depthRow.style.display = position === 'depth' ? 'flex' : 'none';
    }
    window.wbUpdateDepthVisibility = wbUpdateDepthVisibility;

    function wbGetPriorityTier(value) {
        const source = value && typeof value === 'object' ? value : { priority: value };
        const explicit = String(source.priorityTier ?? source.priorityLevel ?? source.lorePriority ?? '').trim().toLowerCase();
        if (['core', 'high', 'critical', 'primary'].includes(explicit)) return 'core';
        if (['supplementary', 'low', 'detail', 'details', 'secondary'].includes(explicit)) return 'supplementary';
        if (['important', 'medium', 'normal'].includes(explicit)) return 'important';

        const numeric = Number(source.priority);
        const priority = Number.isFinite(numeric) ? Math.max(-100, Math.min(100, Math.floor(numeric))) : 0;
        if (priority >= 34) return 'core';
        if (priority <= -34) return 'supplementary';
        return 'important';
    }

    function wbGetPriorityTierLabel(value) {
        return ({ core: '核心', important: '重要', supplementary: '补充' })[wbGetPriorityTier(value)] || '重要';
    }

    function wbUpdatePriorityTierDisplay(value) {
        const label = document.getElementById('wbPriorityTierText');
        if (label) label.textContent = wbGetPriorityTierLabel(value);
    }
    window.wbGetPriorityTier = wbGetPriorityTier;
    window.wbGetPriorityTierLabel = wbGetPriorityTierLabel;
    window.wbUpdatePriorityTierDisplay = wbUpdatePriorityTierDisplay;


    function wbOpenEditor(entryId = null) {
        wbCurrentEntryId = entryId;
        const titleInput = document.getElementById('wbEntryTitle');
        const keyInput = document.querySelector('.wb-editor-key-input');
        const contentInput = document.querySelector('.wb-editor-textarea');
        const globalSwitch = document.querySelector('.wb-ios-switch');
        const posSelect = document.getElementById('wbPositionText');
        const depthInput = document.getElementById('wbDepthInput');
        const priorityInput = document.getElementById('wbPriorityInput');
        const scanDepthInput = document.getElementById('wbScanDepthInput');
        const groupNameSpan = document.getElementById('wbSelectedGroupName');

        if (entryId) {
            const entry = wbEntries.find(e => e.id === entryId);
            if (entry) {
                titleInput.value = entry.title;
                keyInput.value = entry.key || '';
                contentInput.value = entry.content || '';
                if (entry.isGlobal) globalSwitch.classList.add('active');
                else globalSwitch.classList.remove('active');
                let pos = entry.position || 'after_persona';
                const savedDepth = Number(entry.depth ?? entry.insertionDepth ?? entry.insertion_depth);
                if (pos.includes('前置') || pos.includes('Before')) pos = 'before_persona';
                if (pos.includes('后置') || pos.includes('After')) pos = 'after_persona';
                if (['depth', 'at_depth', 'history_depth'].includes(pos)) pos = 'depth';

                const posMap = { 'top': '最顶部', 'before_persona': '人设前', 'after_persona': '人设后', 'bottom': '最底部', 'depth': '聊天历史内' };
                posSelect.innerText = posMap[pos] || '人设后';
                posSelect.setAttribute('data-value', pos);
                if (depthInput) depthInput.value = String(Number.isFinite(savedDepth) && savedDepth > 0 ? Math.min(100, Math.max(1, Math.floor(savedDepth))) : 4);
                if (priorityInput) priorityInput.value = String(Number.isFinite(Number(entry.priority)) ? Math.min(100, Math.max(-100, Math.floor(Number(entry.priority)))) : 0);
                wbUpdatePriorityTierDisplay(entry);
                if (scanDepthInput) scanDepthInput.value = String(Math.min(50, Math.max(1, Math.floor(Number(entry.scanDepth ?? entry.scan_depth) || 8))));
                wbUpdateDepthVisibility(pos);
                
                const group = wbGroups.find(g => g.id === entry.groupId);
                if (group) {
                    groupNameSpan.innerText = group.name;
                    groupNameSpan.setAttribute('data-id', group.id);
                }
            }
        } else {
            // 新建清空
            titleInput.value = '';
            keyInput.value = '';
            contentInput.value = '';
            globalSwitch.classList.remove('active');
            posSelect.innerText = '人设后';
            posSelect.setAttribute('data-value', 'after_persona');
            if (depthInput) depthInput.value = '4';
            if (priorityInput) priorityInput.value = '0';
            wbUpdatePriorityTierDisplay(0);
            if (scanDepthInput) scanDepthInput.value = '8';
            wbUpdateDepthVisibility('after_persona');
            
            // 如果没有选中分组，默认选未分类
            if (!groupNameSpan.getAttribute('data-id')) {
                let unclass = wbGroups.find(g => g.name === '未分类');
                if (!unclass) {
                    unclass = { id: 'default_unclassified', name: '未分类', isPinned: false };
                    wbGroups.push(unclass);
                }
                groupNameSpan.innerText = unclass.name;
                groupNameSpan.setAttribute('data-id', unclass.id);
            }
        }

        document.getElementById('wbBottomBar').style.display = 'none';
        if (document.getElementById('wbGroupPage').classList.contains('active')) {
            document.getElementById('wbGroupPage').classList.remove('active'); 
            document.getElementById('wbGroupPage').classList.add('slide-left');
        } else {
            document.getElementById('wbMainPage').classList.remove('active'); 
            document.getElementById('wbMainPage').classList.add('slide-left');
        }
        document.getElementById('wbEditorPage').classList.remove('slide-right'); 
        document.getElementById('wbEditorPage').classList.add('active');
    }

    function wbSaveEntry() {
        const title = document.getElementById('wbEntryTitle').value.trim() || '未命名条目';
        const key = document.querySelector('.wb-editor-key-input').value.trim();
        const content = document.querySelector('.wb-editor-textarea').value;
        const isGlobal = document.querySelector('.wb-ios-switch').classList.contains('active');
        const position = document.getElementById('wbPositionText').getAttribute('data-value');
        const depthValue = Math.min(100, Math.max(1, Math.floor(Number(document.getElementById('wbDepthInput')?.value) || 4)));
        const priorityValue = Math.min(100, Math.max(-100, Math.floor(Number(document.getElementById('wbPriorityInput')?.value) || 0)));
        const scanDepthValue = Math.min(50, Math.max(1, Math.floor(Number(document.getElementById('wbScanDepthInput')?.value) || 8)));
        
        let groupId = document.getElementById('wbSelectedGroupName').getAttribute('data-id');
        
        // 确保分组存在
        if (!wbGroups.find(g => g.id === groupId)) {
            let unclass = wbGroups.find(g => g.name === '未分类');
            if (!unclass) {
                unclass = { id: 'default_unclassified', name: '未分类', isPinned: false };
                wbGroups.push(unclass);
            }
            groupId = unclass.id;
        }

        if (wbCurrentEntryId) {
            const entry = wbEntries.find(e => e.id === wbCurrentEntryId);
            if (entry) {
                entry.title = title;
                entry.key = key;
                entry.content = content;
                entry.isGlobal = isGlobal;
                entry.position = position;
                entry.priority = priorityValue;
                delete entry.priorityTier;
                delete entry.priorityLevel;
                delete entry.lorePriority;
                entry.scanDepth = scanDepthValue;
                delete entry.scan_depth;
                if (position === 'depth') {
                    entry.depth = depthValue;
                } else {
                    delete entry.depth;
                    delete entry.insertionDepth;
                    delete entry.insertion_depth;
                }
                entry.groupId = groupId;
                entry.updateTime = Date.now();
            }
        } else {
            const newEntry = {
                id: 'e_' + Date.now(),
                groupId: groupId,
                title: title,
                key: key,
                content: content,
                isGlobal: isGlobal,
                position: position,
                priority: priorityValue,
                scanDepth: scanDepthValue,
                isPinned: false,
                isDeleted: false,
                updateTime: Date.now()
            };
            if (position === 'depth') newEntry.depth = depthValue;
            wbEntries.push(newEntry);
        }

        saveWorldbookData();
        wbRenderAll();
        wbCloseEditor();
        if (typeof showToast === 'function') showToast('保存成功');
    }

    function wbChangePosition() {
        const items = [
            { label: '最顶部', value: 'top' },
            { label: '人设前', value: 'before_persona' },
            { label: '人设后', value: 'after_persona' },
            { label: '聊天历史内', value: 'depth' },
            { label: '最底部', value: 'bottom' }
        ];
        const posSelect = document.getElementById('wbPositionText');
        const currentValue = posSelect.getAttribute('data-value') || 'after_persona';

        if (typeof openUniversalSelect === 'function') {
            openUniversalSelect({
                title: '选择注入位置',
                items: items,
                currentValue: currentValue,
                searchable: false,
                onSelect: (val) => {
                    const posMap = { 'top': '最顶部', 'before_persona': '人设前', 'after_persona': '人设后', 'bottom': '最底部', 'depth': '聊天历史内' };
                    posSelect.innerText = posMap[val];
                    posSelect.setAttribute('data-value', val);
                    wbUpdateDepthVisibility(val);
                }
            });
        }
    }
    window.wbChangePosition = wbChangePosition;

    function wbCloseEditor() {
        document.getElementById('wbEditorPage').classList.remove('active'); 
        document.getElementById('wbEditorPage').classList.add('slide-right');
        document.getElementById('wbBottomBar').style.display = 'flex';
        if (document.getElementById('wbGroupPage').classList.contains('slide-left')) {
            document.getElementById('wbGroupPage').classList.remove('slide-left'); 
            document.getElementById('wbGroupPage').classList.add('active');
        } else {
            document.getElementById('wbMainPage').classList.remove('slide-left'); 
            document.getElementById('wbMainPage').classList.add('active');
        }
        wbCurrentEntryId = null;
    }
    function wbOpenFilterMenu(e) {
        const overlay = document.getElementById('wbFilterMenuOverlay');
        const menu = document.getElementById('wbFilterMenu');
        overlay.style.display = 'block';
        const rect = e.currentTarget.getBoundingClientRect();
        menu.style.top = (rect.bottom + 10) + 'px'; menu.style.left = rect.left + 'px';
        menu.style.animation = 'none'; menu.offsetHeight; menu.style.animation = null;
    }
    function wbCloseFilterMenu() {
        document.getElementById('wbFilterMenuOverlay').style.display = 'none';
    }
    function wbSwitchMainView(viewId, text) {
        document.getElementById('wbCurrentFilterText').innerText = text;
        document.getElementById('wb-view-all-groups').style.display = 'none';
        document.getElementById('wb-view-global-entries').style.display = 'none';
        document.getElementById('wb-view-deleted-entries').style.display = 'none';
        if (viewId === 'all') document.getElementById('wb-view-all-groups').style.display = 'block';
        if (viewId === 'global') document.getElementById('wb-view-global-entries').style.display = 'block';
        if (viewId === 'deleted') document.getElementById('wb-view-deleted-entries').style.display = 'block';
        wbCloseFilterMenu();
    }

    function wbRestoreEntry(entryId, event) {
        event.stopPropagation();
        const entry = wbEntries.find(e => e.id === entryId);
        if (entry) {
            entry.isDeleted = false;
            entry.deleteTime = null; // 清除删除时间
            
            // 如果恢复时原分组已被删除，则移至未分类
            if (!wbGroups.find(g => g.id === entry.groupId)) {
                let unclass = wbGroups.find(g => g.name === '未分类');
                if (!unclass) {
                    unclass = { id: 'default_unclassified', name: '未分类', isPinned: false };
                    wbGroups.push(unclass);
                }
                entry.groupId = unclass.id;
            }
            
            saveWorldbookData();
            wbRenderAll();
            if (typeof showToast === 'function') showToast('条目已恢复');
        }
    }

    function wbToggleViewMode() {
        wbIsGridView = !wbIsGridView;
        const listView = document.getElementById('wbListView');
        const gridView = document.getElementById('wbGridView');
        const viewToggleBtn = document.getElementById('wbViewToggleBtn');
        if (wbIsGridView) {
            listView.style.display = 'none'; gridView.style.display = 'grid';
            viewToggleBtn.innerHTML = `<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>`;
        } else {
            listView.style.display = 'block'; gridView.style.display = 'none';
            viewToggleBtn.innerHTML = `<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>`;
        }
    }

    let wbPressTimer; let wbIsDragging = false; let wbLongPressTriggered = false;
    function wbHandlePointerDown(e, type, id, element) {
        wbIsDragging = false; wbLongPressTriggered = false; element.classList.add('pressing');
        wbPressTimer = setTimeout(() => { wbLongPressTriggered = true; wbShowContextMenu(e, type, id, element); }, 500);
    }
    function wbHandlePointerMove() {
        wbIsDragging = true; clearTimeout(wbPressTimer);
        document.querySelectorAll('.pressing').forEach(el => el.classList.remove('pressing'));
    }
    function wbHandlePointerUp(e, type, id, element) {
        clearTimeout(wbPressTimer); element.classList.remove('pressing');
        if (!wbIsDragging && !wbLongPressTriggered && document.getElementById('wbContextMenuOverlay').style.display !== 'block') {
            if (type === 'group') wbHandleItemClick(element, id);
            else if (type === 'entry') wbOpenEditor(id);
        }
    }

    function wbShowContextMenu(e, type, id, el) {
        if (navigator.vibrate) navigator.vibrate(50);
        const overlay = document.getElementById('wbContextMenuOverlay');
        const menu = document.getElementById('wbContextMenu');
        
        if (type === 'group') {
            const group = wbGroups.find(g => g.id === id);
            if (!group) return;
            menu.innerHTML = `
                <div class="icon-menu-item" onclick="wbTogglePinGroup('${id}'); wbCloseContextMenu();">
                    <svg viewBox="0 0 24 24"><path d="M12 17v5"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                    <span>${group.isPinned ? '取消置顶' : '置顶分组'}</span>
                </div>
                <div class="icon-menu-item" onclick="wbEditGroupName('${id}'); wbCloseContextMenu();">
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>编辑名称</span>
                </div>
                <div class="icon-menu-item" style="color: #ff3b30;" onclick="wbDeleteGroup(event, '${id}'); wbCloseContextMenu();">
                    <svg style="stroke: #ff3b30;" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    <span>删除分组</span>
                </div>
            `;
        } else {
            const entry = wbEntries.find(e => e.id === id);
            if (!entry) return;
            menu.innerHTML = `
                <div class="icon-menu-item" onclick="wbTogglePinEntry('${id}'); wbCloseContextMenu();">
                    <svg viewBox="0 0 24 24"><path d="M12 17v5"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                    <span>${entry.isPinned ? '取消置顶' : '置顶条目'}</span>
                </div>
                <div class="icon-menu-item" onclick="wbChangeEntryGroup('${id}'); wbCloseContextMenu();">
                    <svg viewBox="0 0 24 24"><path d="M3 19V6a2 2 0 0 1 2-2h4.5c.4 0 .8.2 1 .5l1 1.5c.2.3.6.5 1 .5H21a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    <span>更换分组</span>
                </div>
                <div class="icon-menu-item" style="color: #ff3b30;" onclick="wbDeleteEntry('${id}'); wbCloseContextMenu();">
                    <svg style="stroke: #ff3b30;" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    <span>删除条目</span>
                </div>
            `;
        }
        overlay.style.display = 'block';
        const rect = el.getBoundingClientRect();
        let top = rect.top + 20; let left = e.clientX || rect.left + 20;
        if (top + 160 > window.innerHeight) top = window.innerHeight - 180;
        if (left + 240 > window.innerWidth) left = window.innerWidth - 250;
        menu.style.top = top + 'px'; menu.style.left = left + 'px';
        menu.style.animation = 'none'; menu.offsetHeight; menu.style.animation = null;
    }

    function wbCloseContextMenu() {
        document.getElementById('wbContextMenuOverlay').style.display = 'none';
    }

    function wbTogglePinGroup(id) {
        const group = wbGroups.find(g => g.id === id);
        if (group) {
            group.isPinned = !group.isPinned;
            saveWorldbookData();
            wbRenderAll();
        }
    }

    function wbEditGroupName(id) {
        const group = wbGroups.find(g => g.id === id);
        if (!group) return;
        showCustomPrompt('编辑分组名称', { placeholder: '输入新名称', value: group.name }, '保存').then(newName => {
            if (newName && newName.trim() !== '') {
                group.name = newName.trim();
                saveWorldbookData();
                wbRenderAll();
            }
        });
    }

    function wbTogglePinEntry(id) {
        const entry = wbEntries.find(e => e.id === id);
        if (entry) {
            entry.isPinned = !entry.isPinned;
            saveWorldbookData();
            wbRenderAll();
        }
    }

    function wbDeleteEntry(id) {
        const entry = wbEntries.find(e => e.id === id);
        if (entry) {
            entry.isDeleted = true;
            entry.deleteTime = Date.now(); // 记录删除时间
            saveWorldbookData();
            wbRenderAll();
            if (typeof showToast === 'function') showToast('已移至最近删除');
        }
    }

    function wbToggleEditMode() {
        wbIsEditMode = !wbIsEditMode;
        const editBtn = document.getElementById('wbEditBtn');
        const groupList = document.getElementById('wbGroupList');
        if (wbIsEditMode) {
            editBtn.innerText = '完成'; 
            editBtn.style.color = '#e4af0a'; 
            groupList.classList.add('wb-edit-mode');
        } else {
            editBtn.innerText = '编辑'; 
            editBtn.style.color = ''; 
            groupList.classList.remove('wb-edit-mode');
        }
    }

    function wbDeleteGroup(event, id) {
        if (event) event.stopPropagation(); 
        showCustomConfirm('删除分组', '确定要删除此分组及其包含的所有条目吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                const now = Date.now();
                wbEntries.forEach(e => {
                    if (e.groupId === id) {
                        e.isDeleted = true;
                        e.deleteTime = now; // 连带删除并记录时间
                    }
                });
                wbGroups = wbGroups.filter(g => g.id !== id);
                saveWorldbookData();
                wbRenderAll();
                if (typeof showToast === 'function') showToast('分组及条目已移至最近删除');
            }
        });
    }

    function wbOpenCreateGroupModal() {
        showCustomPrompt('新建文件夹', { placeholder: '请输入此世界书分组的名称。', value: '' }, '存储').then(groupName => {
            if (groupName === null) return;
            if (groupName.trim() !== '') {
                wbGroups.push({ id: 'g_' + Date.now(), name: groupName.trim(), isPinned: false });
                saveWorldbookData();
                wbRenderAll();
            } else {
                showCustomAlert("提示", "名称不能为空！");
            }
        });
    }

    function wbOpenSearch() {
        document.getElementById('wbSearchOverlay').classList.add('show');
        setTimeout(() => document.getElementById('wbSearchInput').focus(), 300);
    }
    function wbCloseSearch() {
        document.getElementById('wbSearchOverlay').classList.remove('show');
        document.getElementById('wbSearchInput').blur();
    }

            // show three-dots button; click to expand vertical capsule menu
