        const DESKTOP_COLUMNS = 4;
        const DESKTOP_MIN_ROWS = 6;
        const DESKTOP_MAX_ROWS = 7;
        let DESKTOP_ROWS = DESKTOP_MIN_ROWS;
        let DESKTOP_SLOT_COUNT = DESKTOP_COLUMNS * DESKTOP_ROWS;
        function normalizeDesktopRowCount(value, pages) {
            const rows = Number(value);
            if (rows === DESKTOP_MIN_ROWS || rows === DESKTOP_MAX_ROWS) return rows;
            const hasSeventhRow = Array.isArray(pages) && pages.some(page =>
                Array.isArray(page) && page.some(app => Number(app && app.index) >= DESKTOP_COLUMNS * DESKTOP_MIN_ROWS)
            );
            return hasSeventhRow ? DESKTOP_MAX_ROWS : DESKTOP_MIN_ROWS;
        }

        function isIOSDevice() {
            const userAgent = navigator.userAgent || '';
            return /iPad|iPhone|iPod/i.test(userAgent)
                || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        }

        function isAndroidMobileHost() {
            return /Android/i.test(navigator.userAgent || '');
        }

        const useAndroidViewportCompat = isAndroidMobileHost();
        const useEdgeViewportCompat = /\bEdg(?:A|iOS)?\//i.test(navigator.userAgent || '')
            && (useAndroidViewportCompat || isIOSDevice() || navigator.maxTouchPoints > 0);

        function calculateDesktopRowCount(fallbackRows = DESKTOP_ROWS) {
            const savedRows = typeof appSettings !== 'undefined' ? Number(appSettings.access_desktop_rows) : 0;
            // Older layouts retain their saved row count until a manual choice is made.
            return normalizeDesktopRowCount(
                savedRows === DESKTOP_MIN_ROWS || savedRows === DESKTOP_MAX_ROWS ? savedRows : fallbackRows
            );
        }

        function applyDesktopRowCount(rows) {
            const normalizedRows = normalizeDesktopRowCount(rows);
            DESKTOP_ROWS = normalizedRows;
            DESKTOP_SLOT_COUNT = DESKTOP_COLUMNS * DESKTOP_ROWS;
            document.documentElement.style.setProperty('--desktop-rows', String(DESKTOP_ROWS));
        }

                function getWidgetDimensions(widgetData) {
            const LEGACY_SLOT_SIZE = 140;
            const page = useEdgeViewportCompat ? document.querySelector('#desktopGrid > .desktop-page') : null;
            const pageStyle = page ? getComputedStyle(page) : null;
            const COLUMN_GAP = pageStyle ? parseFloat(pageStyle.columnGap) || 10 : 10;
            const ROW_HEIGHT = 80;
            const ROW_GAP = pageStyle ? parseFloat(pageStyle.rowGap) || 0 : 15;
            
            // 修复刷新时 DOM 未完全渲染导致获取宽度失败的问题
            let containerWidth = 375; // 默认手机外壳宽度
            const iphoneEl = document.querySelector('.iphone');
            if (iphoneEl && iphoneEl.clientWidth > 0) {
                containerWidth = iphoneEl.clientWidth;
            } else if (window.innerWidth > 0) {
                containerWidth = Math.min(window.innerWidth, 375);
            }

            const horizontalPadding = pageStyle
                ? (parseFloat(pageStyle.paddingLeft) || 0) + (parseFloat(pageStyle.paddingRight) || 0)
                : 40;
            if (page?.clientWidth > 0) containerWidth = page.clientWidth;
            const gridWidth = containerWidth - horizontalPadding;
            
            const columnWidth = gridWidth > 0
                ? (gridWidth - COLUMN_GAP * (DESKTOP_COLUMNS - 1)) / DESKTOP_COLUMNS
                : 76.25;

            let columns = 1;
            let rows = 1;
            const legacyWidth = parseInt(widgetData.width, 10);
            const legacyHeight = parseInt(widgetData.height, 10);
            if (legacyWidth > 0 && legacyHeight > 0) {
                columns = Math.max(1, Math.round(legacyWidth / LEGACY_SLOT_SIZE));
                rows = Math.max(1, Math.round(legacyHeight / LEGACY_SLOT_SIZE));
            } else if (widgetData.presetSize) {
                const parts = widgetData.presetSize.split('x').map(Number);
                if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
                    columns = parts[0];
                    rows = parts[1];
                }
            }

            columns = Math.min(DESKTOP_COLUMNS, columns);
            rows = Math.min(DESKTOP_ROWS, rows);
            return {
                width: columns * columnWidth + (columns - 1) * COLUMN_GAP,
                height: rows * ROW_HEIGHT + (rows - 1) * ROW_GAP
            };
        }
        window.getWidgetDimensions = getWidgetDimensions;
        function normalizeStoredWidgetContent(content) {
            const original = String(content == null ? '' : content);
            let decoded = original;

            for (let attempt = 0; attempt < 20 && !/<[^>]+>/.test(decoded); attempt++) {
                try {
                    const next = decodeURIComponent(decoded);
                    if (next === decoded) break;
                    decoded = next;
                } catch (error) {
                    return original;
                }
            }

            return /<[^>]+>/.test(decoded) ? decoded : original;
        }
        window.normalizeStoredWidgetContent = normalizeStoredWidgetContent;

        function buildDesktopWidgetFrameContent(content) {
            const normalizedContent = normalizeStoredWidgetContent(content);
            return typeof window.buildWidgetDesktopContent === 'function'
                ? window.buildWidgetDesktopContent(normalizedContent)
                : normalizedContent;
        }

        function makeDesktopWidgetFrameHTML(content) {
            try {
                return makeWidgetFrameHTML(buildDesktopWidgetFrameContent(content), true);
            } catch (error) {
                // Keep the original widget content on its app element for editing and retry.
                console.error('Desktop widget rendering failed:', error);
                return '<div style="padding:16px;color:inherit;font-size:12px;">组件暂时无法显示，可长按编辑后重试</div>';
            }
        }

        function buildDesktopWidgetSrcdoc(content) {
            const frameContent = buildDesktopWidgetFrameContent(content);
            return typeof window.buildWidgetFrameSrcdoc === 'function'
                ? window.buildWidgetFrameSrcdoc(frameContent)
                : '<style>html,body{margin:0;padding:0;width:100%;height:100%;box-sizing:border-box;}</style>' + frameContent;
        }

        function createWidgetPickerPreview(widgetData) {
            const previewSize = 60;
            const preview = document.createElement('div');
            preview.style.cssText = "width: 60px; height: 60px; border-radius: 12px; background: rgba(255,255,255,0.55); flex-shrink: 0; overflow: hidden; position: relative; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45);";

            const widgetContent = normalizeStoredWidgetContent(widgetData && widgetData.content ? widgetData.content : '');
            if (!widgetContent) {
                preview.style.background = (widgetData && widgetData.preview) || 'rgba(255,255,255,0.55)';
                return preview;
            }

            const previewDims = getWidgetDimensions(widgetData || {});
            const previewScale = Math.min(previewSize / previewDims.width, previewSize / previewDims.height);
            const frame = document.createElement('iframe');
            frame.className = 'widget-render-frame';
            frame.setAttribute('sandbox', 'allow-scripts');
            frame.setAttribute('title', ((widgetData && widgetData.name) || '组件') + '预览');
            frame.style.cssText = "position: absolute; border: 0; background: transparent; transform-origin: top left; pointer-events: none;";
            frame.style.width = previewDims.width + 'px';
            frame.style.height = previewDims.height + 'px';
            frame.style.left = (previewSize - previewDims.width * previewScale) / 2 + 'px';
            frame.style.top = (previewSize - previewDims.height * previewScale) / 2 + 'px';
            frame.style.transform = 'scale(' + previewScale + ')';
            frame.addEventListener('load', function () {
                if (typeof window.syncGlobalFontToWidgetFrame === 'function') {
                    window.syncGlobalFontToWidgetFrame(frame);
                }
            });
            frame.srcdoc = buildDesktopWidgetSrcdoc(widgetContent);
            preview.appendChild(frame);
            return preview;
        }

        function refreshDesktopWidgetFrames() {
            document.querySelectorAll('#desktopGrid .app-item.is-widget').forEach(app => {
                const frame = app.querySelector('.widget-render-frame');
                if (!frame) return;
                const content = app.getAttribute('data-widget-content') || '';
                frame.srcdoc = buildDesktopWidgetSrcdoc(content);
            });
        }
        window.refreshDesktopWidgetFrames = refreshDesktopWidgetFrames;

        let desktopPages = [[]];
        let currentDesktopPage = 0;
        let desktopLayoutReady = false;

        function isDesktopLayoutReady() {
            return desktopLayoutReady && Boolean(document.getElementById('dock'))
                && getCurrentDesktopSlots().length === DESKTOP_SLOT_COUNT;
        }
        window.isDesktopLayoutReady = isDesktopLayoutReady;

    // Built-in filled SVG assets: see licenses/Desktop-SVG-Sources-20261008.md for provenance and licensing.
    const BUILTIN_DESKTOP_ICON_LIBRARY = Object.freeze({
    "fanfiction": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(94 94) scale(.816)\"><path fill=\"currentColor\" d=\"M512 1024c282.624 0 512-229.376 512-512S794.624 0 512 0 0 229.376 0 512s229.376 512 512 512zM329.728 182.272c0-24.576 11.264-34.816 35.84-35.84 29.696 0 52.224 13.312 70.656 34.816 19.456 23.552 28.672 51.2 28.672 80.896v369.664c0 6.144-5.12 12.288-7.168 18.432-5.12-4.096-14.336-7.168-16.384-12.288-4.096-9.216-5.12-20.48-5.12-30.72 0-111.616 0-224.256-1.024-335.872 0-20.48-6.144-41.984-14.336-61.44-10.24-22.528-31.744-34.816-60.416-33.792 0 9.216-1.024 16.384-1.024 24.576V601.088c3.072 59.392 32.768 92.16 91.136 95.232 56.32 3.072 113.664 1.024 169.984 3.072 23.552 1.024 48.128 5.12 69.632 14.336 31.744 13.312 53.248 39.936 60.416 74.752 6.144 27.648-8.192 45.056-36.864 46.08h-163.84c-43.008 0-87.04-30.72-98.304-66.56 14.336-7.168 25.6-3.072 35.84 7.168 21.504 23.552 47.104 31.744 78.848 30.72 45.056-1.024 89.088 0 134.144 0h21.504c0-39.936-34.816-73.728-79.872-75.776-50.176-2.048-100.352 0-149.504-1.024-21.504 0-43.008-1.024-63.488-6.144-59.392-12.288-95.232-52.224-97.28-112.64-2.048-100.352-1.024-201.728-2.048-302.08-1.024-44.032-1.024-84.992 0-125.952z\"/></g></svg>",
        "background": "linear-gradient(155deg, #ffffff 0%, #f2f5f9 100%)",
        "foreground": "#111216"
    },
    "character-phone": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z\"/></svg>",
        "background": "#ffffff",
        "foreground": "#000000"
    },
    "settings": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"currentColor\" d=\"M940 596l-76-57.6c0.8-8 1.6-16.8 1.6-26.4s-0.8-18.4-1.6-26.4l76-57.6c20.8-16 26.4-44 12.8-68L868 216.8c-9.6-16.8-28-27.2-47.2-27.2-6.4 0-12 0.8-18.4 3.2L712 228c-15.2-10.4-31.2-19.2-47.2-26.4l-13.6-92c-4-26.4-26.4-45.6-53.6-45.6H426.4c-27.2 0-49.6 19.2-53.6 44.8L360 201.6c-16 7.2-31.2 16-47.2 26.4l-90.4-35.2c-6.4-2.4-12.8-3.2-19.2-3.2-19.2 0-37.6 9.6-46.4 26.4L71.2 360c-13.6 22.4-8 52 12.8 68l76 57.6c-0.8 9.6-1.6 18.4-1.6 26.4s0 16.8 1.6 26.4L84 596c-20.8 16-26.4 44-12.8 68L156 807.2c9.6 16.8 28 27.2 47.2 27.2 6.4 0 12-0.8 18.4-3.2L312 796c15.2 10.4 31.2 19.2 47.2 26.4l13.6 92C376 940 399.2 960 426.4 960h171.2c27.2 0 49.6-19.2 53.6-44.8l13.6-92.8c16-7.2 31.2-16 47.2-26.4l90.4 35.2c6.4 2.4 12.8 3.2 19.2 3.2 19.2 0 37.6-9.6 46.4-26.4l85.6-144.8C966.4 640 960.8 612 940 596z m-236-84c0 105.6-86.4 192-192 192s-192-86.4-192-192 86.4-192 192-192 192 86.4 192 192z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "1000040040"
    },
    "wechat": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "wei-xin-i-OS"
    },
    "contacts": {
        "svg": "<svg class=\"builtin-icon-svg contacts-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"th-contacts-icon-surface\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\"><stop class=\"contacts-surface-start\" offset=\"0%\" stop-color=\"#FFFFFF\"/><stop class=\"contacts-surface-end\" offset=\"100%\" stop-color=\"#F4F6F9\"/></linearGradient><linearGradient id=\"th-contacts-icon-tab-shadow\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" stop-color=\"#000000\" stop-opacity=\"0.15\"/><stop offset=\"100%\" stop-color=\"#000000\" stop-opacity=\"0\"/></linearGradient><clipPath id=\"th-contacts-icon-circle\"><circle cx=\"92\" cy=\"100\" r=\"65\"/></clipPath></defs><rect width=\"200\" height=\"200\" fill=\"url(#th-contacts-icon-surface)\"/><g><rect class=\"contacts-tab-top\" x=\"160\" y=\"0\" width=\"40\" height=\"66.7\" fill=\"#111216\"/><rect class=\"contacts-tab-middle\" x=\"160\" y=\"66.7\" width=\"40\" height=\"66.6\" fill=\"#111216\"/><rect class=\"contacts-tab-bottom\" x=\"160\" y=\"133.3\" width=\"40\" height=\"66.7\" fill=\"#111216\"/><rect x=\"160\" y=\"0\" width=\"6\" height=\"200\" fill=\"url(#th-contacts-icon-tab-shadow)\"/><rect x=\"159\" y=\"0\" width=\"1\" height=\"200\" fill=\"#FFFFFF\" opacity=\"0.4\"/></g><circle cx=\"92\" cy=\"101.5\" r=\"65\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" opacity=\"0.8\"/><circle class=\"contacts-avatar-rim\" cx=\"92\" cy=\"98.5\" r=\"65\" fill=\"none\" stroke=\"#B9BEC6\" stroke-width=\"2\" opacity=\"0.5\"/><circle class=\"contacts-avatar-recess\" cx=\"92\" cy=\"100\" r=\"65\" fill=\"#D9DDE3\"/><g clip-path=\"url(#th-contacts-icon-circle)\"><circle cx=\"92\" cy=\"102\" r=\"65\" fill=\"none\" stroke=\"#000000\" stroke-width=\"4\" opacity=\"0.15\"/><circle cx=\"92\" cy=\"98\" r=\"65\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"4\" opacity=\"0.3\"/><circle class=\"contacts-avatar-person\" cx=\"92\" cy=\"76\" r=\"29\" fill=\"#111216\"/><ellipse class=\"contacts-avatar-person\" cx=\"92\" cy=\"175\" rx=\"60\" ry=\"45\" fill=\"#111216\"/></g></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "tong-xun-lu-i-OS"
    },
    "worldbook": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 256 256\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm10,47.38-3.35-15.9,46.82-10.06,3.34,15.9Zm70,100.41-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm48,160H56V192h48v16Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "bei-wang-lu-i-OS"
    },
    "call": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z\" fill-rule=\"evenodd\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "dian-hua-i-OS"
    },
    "message": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "1000043922"
    },
    "theme": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 256 256\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89ZM84,168a12,12,0,1,1,12-12A12,12,0,0,1,84,168Zm0-56a12,12,0,1,1,12-12A12,12,0,0,1,84,112Zm44-24a12,12,0,1,1,12-12A12,12,0,0,1,128,88Zm44,24a12,12,0,1,1,12-12A12,12,0,0,1,172,112Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "i-Tunes-Store"
    },
    "meeting": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 256 256\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Pomocat-"
    },
    "placeholder-music": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 256 256\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M212.92,17.71a7.89,7.89,0,0,0-6.86-1.46l-128,32A8,8,0,0,0,72,56V166.1A36,36,0,1,0,88,196V102.25l112-28V134.1A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.71Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Apple-Music"
    },
    "memory": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 256 256\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "shi-guang-shou-zhang"
    },
    "phone": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z\" fill-rule=\"evenodd\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "dian-hua-i-OS"
    },
"placeholder-bilibili": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "bi-li-bi-li"
    },
    "placeholder-health": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M183.872 661.76a630.528 630.528 0 0 1-49.216-65.024l-0.32-0.576-7.808-11.968-3.712-5.76-2.56-4.096-2.112-3.392-1.536-2.56-1.472-2.368-1.408-2.368a392.32 392.32 0 0 1-35.584-73.984 302.208 302.208 0 0 1-17.28-100.736c0-160.96 123.52-292.992 276.48-292.992 63.808 0 125.184 23.36 174.336 65.216l0.128 0.064 1.728-1.536a265.6 265.6 0 0 1 170.368-63.744h2.368c153.216 0 276.352 131.84 276.352 292.992a304 304 0 0 1-25.536 122.368l-0.64 1.664-1.088 2.432-0.704 1.6-0.704 1.6-1.088 2.368-0.768 1.536-0.64 1.6-0.768 1.536-0.768 1.536-0.704 1.536a345.28 345.28 0 0 1-0.384 0.704l-0.768 1.536-0.768 1.536-0.768 1.536-0.768 1.472-0.768 1.536-0.768 1.536-0.832 1.472-0.832 1.536-0.832 1.536-0.832 1.536-0.832 1.536-1.28 2.368-0.896 1.536-0.896 1.6-0.96 1.6-0.896 1.6-0.96 1.6-1.472 2.496-1.024 1.664-0.96 1.664-1.6 2.56-1.088 1.792-1.6 2.624-1.152 1.792-1.728 2.752-1.152 1.92-2.432 3.84-1.92 2.944-3.2 5.12-2.816 4.288-2.368 3.648-1.088 1.536-0.896 1.408c-39.552 60.416-104.512 128.832-185.664 201.152l-2.496 2.24c-29.184 25.92-58.496 50.56-86.72 73.344l-3.456 2.816-3.456 2.752-3.328 2.688-3.328 2.624-4.288 3.392-3.136 2.496-4.032 3.2-3.84 2.944-5.76 4.48-4.672 3.52-1.152 0.896-0.896 0.704a97.6 97.6 0 0 1-58.624 20.16H512c-22.528 0-43.52-7.168-61.312-21.248l-0.256-0.256-13.888-10.88-6.016-4.672-2.88-2.304-2.944-2.304-4.48-3.584-4.48-3.648-4.672-3.648-4.608-3.84-3.2-2.56-4.736-3.84-4.8-3.968a2225.28 2225.28 0 0 1-116.608-102.4l-3.584-3.392-1.728-1.664-3.52-3.392a1684.224 1684.224 0 0 1-3.52-3.328l-3.456-3.392a1598.08 1598.08 0 0 1-5.12-4.992l-3.392-3.328A1380.736 1380.736 0 0 1 222.08 704l-3.072-3.264a1058.496 1058.496 0 0 1-32.768-36.288l-2.368-2.816zM480 347.968v112H368a32 32 0 1 0 0 64H480v112a32 32 0 0 0 64 0v-112h112a32 32 0 1 0 0-64H544v-112a32 32 0 0 0-64 0z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Apple-jian-kang"
    },
    "placeholder-game-center": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Steam-Mobile"
    },
    "placeholder-photos": {
        "svg": "<svg class=\"builtin-icon-svg photos-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(60 60) scale(1.18)\"><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(0)\" fill=\"currentColor\" opacity=\"0.94\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(45)\" fill=\"currentColor\" opacity=\"0.76\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(90)\" fill=\"currentColor\" opacity=\"0.62\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(135)\" fill=\"currentColor\" opacity=\"0.85\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(180)\" fill=\"currentColor\" opacity=\"0.53\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(225)\" fill=\"currentColor\" opacity=\"0.72\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(270)\" fill=\"currentColor\" opacity=\"0.6\"/><path d=\"M0,0 C-12,-10 -12,-45 0,-45 C12,-45 12,-10 0,0\" transform=\"rotate(315)\" fill=\"currentColor\" opacity=\"0.81\"/></g></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "zhao-pian-i-OS"
    },
    "placeholder-reading": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M878.1 186.6c-45.2-14.2-94.8-20.3-142.4-20.3-79.3 0-164.8 16.3-223.7 61-59-44.7-144.4-61-223.7-61s-164.8 16.3-223.7 61v596c0 10.2 10.2 20.3 20.3 20.3 4.1 0 6.1-2 10.2-2 54.9-26.4 134.2-44.7 193.2-44.7 79.3 0 164.8 16.3 223.7 61 54.9-34.6 154.6-61 223.7-61 67.1 0 136.3 12.2 193.2 42.7 4.1 2 6.1 2 10.2 2 10.2 0 20.3-10.2 20.3-20.3V227.2c-24.3-18.3-50.8-30.5-81.3-40.6m0 549.1c-44.7-14.2-93.6-20.3-142.4-20.3-69.2 0-168.8 26.4-223.7 61V308.6c54.9-34.6 154.6-61 223.7-61 48.8 0 97.6 6.1 142.4 20.3v467.8z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Apple-Books"
    },
    "placeholder-icity": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1217 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1176.72159 613.147613c-109.293924 88.014948-267.639658 224.03805-408.35921 243.635582-90.508125-4.348565-176.841628-47.312383-268.799275-39.948814-161.418719-1.33356-285.207859 207.281581-448.77187 133.87781 161.998528-265.958213 542.874809-62.909235 728.529528-382.673688 22.090708-44.123436-22.090708-44.123436-29.396297-44.123436 100.422853-34.034766 435.262329-279.003907 294.368836-331.128702 0 0 191.336844-125.1227 88.304852-176.609705-88.304852-51.487005-331.128702 36.817847-331.128702 36.817848-28.990431-125.238661-394.153898 104.249589-390.037257 117.75913 0 0 0-44.123436-29.454278-29.454278-419.549516 264.856577-257.66695 559.167431-257.666949 559.167431S543.744522 178.001246 904.327501 111.787102C530.640847 259.986184 13.393579 942.942755 13.393579 942.942755s-9.624823 12.871751-11.828096 16.292622-1.391541 11.42223-1.39154 11.42223 4.05866 15.422909 12.002038 21.047053c161.244777 104.713436 304.167601-75.317139 452.540626-115.03403 241.316347-19.53955 289.034596 120.774135 537.192685-64.242795 80.651379-50.733254 155.330729-110.801427 209.078987-190.351169 19.945416-29.512259-7.885397-32.469283-34.266689-8.987033z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "i-City"
    },
    "mcp": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M253.093394 17.300973a128.850649 128.850649 0 0 1 176.038999 176.038999l40.873815 70.73986L358.392533 328.505156 317.433387 257.722631A128.850649 128.850649 0 0 1 253.093394 17.300973z\"/><path d=\"M621.299056 139.538426a96.637987 96.637987 0 0 1 132.007917 35.36993l96.595321 167.377846-42.836441 24.746151a128.850649 128.850649 0 0 0-175.996334 176.039 128.850649 128.850649 0 0 0 240.50699-64.425325l42.793775-24.746151 96.637987 167.420512a96.637987 96.637987 0 0 1-35.327264 132.007917l-446.412033 257.701298a96.637987 96.637987 0 0 1-132.007917-35.412596l-96.680652-167.377846-42.836441 24.746151a128.850649 128.850649 0 0 1-240.464324 64.425324 128.850649 128.850649 0 0 1 176.038999-176.038999l42.793775-24.746151-96.637986-167.377846A96.637987 96.637987 0 0 1 168.785817 401.079644l6.101206-3.83992 446.412033-257.701298z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "MCP-Agent"
    },
    "twitter": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "Twitter-i-OS"
    },
    "applestore": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"currentColor\" d=\"M873.043528 298.665173a127.99936 127.99936 0 0 1 129.279354 127.99936c0.39822 5.68886 0.39822 11.377721 0 17.066582l-62.719687 469.330986a127.99936 127.99936 0 0 1-127.99936 110.932779H192.940262a127.99936 127.99936 0 0 1-127.99936-110.932779L2.221216 443.731115a127.99936 127.99936 0 0 1 24.746542-95.99952 125.439373 125.439373 0 0 1 85.332907-49.066422 109.226121 109.226121 0 0 1 16.639917 0h119.466069a282.878586 282.878586 0 0 1-3.413316-42.666453 255.99872 255.99872 0 0 1 511.99744 0 282.878586 282.878586 0 0 1-3.413316 42.666453h119.466069zM500.992055 85.332907a170.665813 170.665813 0 0 0-170.665813 170.665813 158.292542 158.292542 0 0 0 5.546639 42.666453h330.238348c3.783092-13.909264 5.660416-28.273636 5.546639-42.666453a170.665813 170.665813 0 0 0-170.665813-170.665813zM270.166543 537.170647a63.99968 63.99968 0 1 0 127.99936 0 63.99968 63.99968 0 0 0-127.99936 0z m355.411556 0a63.99968 63.99968 0 1 0 127.99936 0 63.99968 63.99968 0 0 0-127.99936 0z\"/></svg>",
        "background": "linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 249, 0.94))",
        "foreground": "#111216",
        "legacy": "1000071869"
    },
    "placeholder-today": {
        "svg": "<svg class=\"builtin-icon-svg\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 13H11V17H6V13Z\"/></svg>",
        "background": "linear-gradient(150deg, #ffffff 0%, #f2f5f9 100%)",
        "legacy": ""
    }
});

    function isLegacyBuiltinDesktopIcon(appId, icon) {
        const definition = BUILTIN_DESKTOP_ICON_LIBRARY[appId];
        return Boolean(definition && definition.legacy && typeof icon === 'string'
            && icon.includes('i.postimg.cc/') && icon.includes(definition.legacy));
    }

    function isBuiltinDesktopIcon(appId, icon) {
        return Boolean(BUILTIN_DESKTOP_ICON_LIBRARY[appId]
            && (!icon || icon === 'none' || isLegacyBuiltinDesktopIcon(appId, icon)));
    }

    function normalizeBuiltinDesktopIcon(appId, icon) {
        return isLegacyBuiltinDesktopIcon(appId, icon) ? null : icon;
    }

    function getBuiltinDesktopIconSvg(appId, icon) {
        // Today's calendar keeps its original dynamic-date design.
        return appId !== 'placeholder-today' && isBuiltinDesktopIcon(appId, icon)
            ? BUILTIN_DESKTOP_ICON_LIBRARY[appId].svg : '';
    }

    function getBuiltinDesktopIconBackground(appId) {
        return BUILTIN_DESKTOP_ICON_LIBRARY[appId]?.background || '';
    }

    function getBuiltinDesktopIconForeground(appId) {
        return BUILTIN_DESKTOP_ICON_LIBRARY[appId]?.foreground || '#111216';
    }

    function getTodayCalendarIconHtml(date = new Date()) {
        return `
            <span class="today-calendar-shine"></span>
            <span class="today-calendar-weekday">${TODAY_CALENDAR_WEEKDAYS[date.getDay()]}</span>
            <span class="today-calendar-day">${date.getDate()}</span>
        `;
    }

    function applyBuiltinDesktopIcon(iconEl, appId, icon) {
        if (!iconEl || !isBuiltinDesktopIcon(appId, icon)) return false;
        iconEl.style.backgroundImage = '';
        iconEl.style.backgroundColor = '';
        iconEl.classList.remove('has-custom-icon');
        if (appId === 'placeholder-today') {
            if (iconEl.classList.contains('theme-app-icon')) {
                iconEl.classList.remove('builtin-svg-icon');
                iconEl.classList.add('today-calendar-icon');
                iconEl.innerHTML = getTodayCalendarIconHtml();
            } else {
                renderTodayCalendarIcon(iconEl);
            }
            return true;
        }
        iconEl.classList.remove('today-calendar-icon');
        iconEl.classList.add('builtin-svg-icon');
        iconEl.style.setProperty('--builtin-icon-bg', getBuiltinDesktopIconBackground(appId));
        iconEl.style.setProperty('--builtin-icon-fg', getBuiltinDesktopIconForeground(appId));
        iconEl.innerHTML = getBuiltinDesktopIconSvg(appId, icon);
        return true;
    }

    function getDesktopMiniIconMarkup(app) {
        if (app.appId === 'placeholder-today' && isBuiltinDesktopIcon(app.appId, app.icon)) {
            return `<div class="folder-mini-icon today-calendar-mini-icon">${getTodayCalendarIconHtml()}</div>`;
        }
        const svg = getBuiltinDesktopIconSvg(app.appId, app.icon);
        if (svg) {
            return `<div class="folder-mini-icon builtin-svg-mini-icon" style="--builtin-icon-bg: ${getBuiltinDesktopIconBackground(app.appId)}; --builtin-icon-fg: ${getBuiltinDesktopIconForeground(app.appId)};">${svg}</div>`;
        }
        const style = app.icon && app.icon !== 'none'
            ? `background-image: ${app.icon};`
            : 'background-color: #fff;';
        return `<div class="folder-mini-icon" style="${style.replace(/"/g, '&quot;')}"></div>`;
    }

    window.isBuiltinDesktopIcon = isBuiltinDesktopIcon;
    window.normalizeBuiltinDesktopIcon = normalizeBuiltinDesktopIcon;
    window.getBuiltinDesktopIconSvg = getBuiltinDesktopIconSvg;
    window.getBuiltinDesktopIconBackground = getBuiltinDesktopIconBackground;
    window.getBuiltinDesktopIconForeground = getBuiltinDesktopIconForeground;
    window.getDesktopMiniIconMarkup = getDesktopMiniIconMarkup;
    window.getTodayCalendarIconHtml = getTodayCalendarIconHtml;
    window.applyBuiltinDesktopIcon = applyBuiltinDesktopIcon;


        const PLACEHOLDER_DESKTOP_APP_BATCHES = Object.freeze({
            v1: Object.freeze([
                { name: '见面', appId: 'meeting', icon: null },
                { name: '音乐', appId: 'placeholder-music', icon: null },
                { name: '今日', appId: 'placeholder-today', icon: null },
                { name: 'B站', appId: 'placeholder-bilibili', icon: null }
            ]),
            v2: Object.freeze([
                { name: '健康', appId: 'placeholder-health', icon: null },
                { name: '游戏中心', appId: 'placeholder-game-center', icon: null },
                { name: '相册', appId: 'placeholder-photos', icon: null }
            ]),
            v3: Object.freeze([
                { name: '阅读', appId: 'placeholder-reading', icon: null }
            ]),
            v4: Object.freeze([
                { name: 'Diary', appId: 'placeholder-icity', icon: null }
            ]),
            v5: Object.freeze([
                { name: 'MCP', appId: 'mcp', icon: null }
            ]),
            v6: Object.freeze([
                { name: 'Twitter', appId: 'twitter', icon: null }
            ]),
            v7: Object.freeze([
                { name: 'Apple store', appId: 'applestore', icon: null }
            ]),
            v8: Object.freeze([
                { name: '查手机', appId: 'character-phone', icon: null }
            ]),
            v9: Object.freeze([{ name: '同人', appId: 'fanfiction', icon: null }])
        });
        const PLACEHOLDER_DESKTOP_APPS = Object.freeze([
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v1,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v2,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v3,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v4,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v5,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v6,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v7,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v8,
            ...PLACEHOLDER_DESKTOP_APP_BATCHES.v9
        ]);
        const PLACEHOLDER_DESKTOP_APP_METADATA_UPDATE_IDS = new Set([
            'placeholder-game-center',
            'mcp'
        ]);
        const REMOVED_PLACEHOLDER_APP_IDS = new Set([
            'placeholder-x',
            'placeholder-find-phone',
            'placeholder-store',
            'placeholder-food',
            'placeholder-yinyang',
            'placeholder-home',
            'placeholder-mail'
        ]);

        function normalizeStoredDesktopApp(app) {
            if (!app || typeof app !== 'object' || Array.isArray(app)) return null;
            return {
                ...app,
                icon: normalizeBuiltinDesktopIcon(app.appId, typeof app.icon === 'string' ? app.icon : null),
                presetSize: typeof app.presetSize === 'string' ? app.presetSize : '',
                ...(app.isFolder || Array.isArray(app.apps)
                    ? { apps: Array.isArray(app.apps) ? app.apps.map(normalizeStoredDesktopApp).filter(Boolean) : [] }
                    : {})
            };
        }

        function cloneDesktopPage(page) {
            return Array.isArray(page) ? page.map(normalizeStoredDesktopApp).filter(Boolean) : [];
        }

        function getStoredDesktopPages(data) {
            return Array.isArray(data) && data.some(Array.isArray)
                ? Array.from(data, cloneDesktopPage)
                : [cloneDesktopPage(data)];
        }

        function normalizeDesktopPages(data, sourceRows = DESKTOP_ROWS) {
            const pages = getStoredDesktopPages(data);
            const normalizedSourceRows = normalizeDesktopRowCount(sourceRows, pages);
            const sourceSlotCount = DESKTOP_COLUMNS * normalizedSourceRows;
            const preservedPageCount = normalizedSourceRows === DESKTOP_ROWS ? Math.max(1, pages.length) : 1;
            const normalizedPages = Array.from({ length: preservedPageCount }, () => []);
            const occupiedSlots = Array.from({ length: preservedPageCount }, () => new Set());

            function getAppSpan(app) {
                return app && (app.isWidget || app.widgetContent)
                    ? getWidgetGridSpan(app)
                    : { columns: 1, rows: 1 };
            }

            function getAvailableIndexes(startIndex, span, occupied) {
                const indexes = getDesktopAreaIndexes(startIndex, span.columns, span.rows);
                return indexes.length === span.columns * span.rows && indexes.every(index => !occupied.has(index))
                    ? indexes
                    : [];
            }

            const positionedApps = [];
            pages.forEach((page, pageIndex) => {
                cloneDesktopPage(page).forEach((app, itemIndex) => {
                    const storedIndex = Number(app.index);
                    const sourceIndex = Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < sourceSlotCount
                        ? storedIndex
                        : itemIndex;
                    positionedApps.push({ app, globalIndex: pageIndex * sourceSlotCount + sourceIndex });
                });
            });
            positionedApps.sort((left, right) => left.globalIndex - right.globalIndex);

            positionedApps.forEach(({ app, globalIndex }) => {
                const span = getAppSpan(app);
                let targetPage = Math.floor(globalIndex / DESKTOP_SLOT_COUNT);
                let targetStartIndex = globalIndex % DESKTOP_SLOT_COUNT;
                let placed = false;

                while (!placed) {
                    if (!normalizedPages[targetPage]) {
                        normalizedPages[targetPage] = [];
                        occupiedSlots[targetPage] = new Set();
                    }

                    for (let startIndex = targetStartIndex; startIndex < DESKTOP_SLOT_COUNT; startIndex++) {
                        const indexes = getAvailableIndexes(startIndex, span, occupiedSlots[targetPage]);
                        if (indexes.length === 0) continue;
                        indexes.forEach(index => occupiedSlots[targetPage].add(index));
                        normalizedPages[targetPage].push({ ...app, index: startIndex });
                        placed = true;
                        break;
                    }

                    if (!placed) {
                        targetPage++;
                        targetStartIndex = 0;
                    }
                }
            });

            if (normalizedSourceRows !== DESKTOP_ROWS) {
                while (normalizedPages.length > 1 && normalizedPages[normalizedPages.length - 1].length === 0) {
                    normalizedPages.pop();
                }
            }
            return normalizedPages;
        }

        function serializeAppElement(app, index) {
            const isFolder = app.classList.contains('is-folder');
            if (isFolder) {
                const nameEl = app.querySelector('.app-name');
                const appsData = JSON.parse(decodeURIComponent(app.getAttribute('data-folder-apps') || '[]'));
                return {
                    index,
                    name: nameEl ? nameEl.innerText : '文件夹',
                    isFolder: true,
                    apps: appsData.map(normalizeStoredDesktopApp)
                };
            }
            const iconEl = app.querySelector('.app-icon');
            const nameEl = app.querySelector('.app-name');
            const iconBg = iconEl ? iconEl.style.backgroundImage : '';
            const isWidget = app.classList.contains('is-widget');
            const appData = {
                index,
                name: nameEl ? nameEl.innerText : '',
                icon: normalizeBuiltinDesktopIcon(app.getAttribute('data-app-id'), iconBg !== '' && iconBg !== 'none' ? iconBg : null),
                appId: app.getAttribute('data-app-id'),
                isWidget
            };
            if (isWidget) {
                appData.widgetContent = app.getAttribute('data-widget-content') || '';
                appData.width = app.getAttribute('data-widget-width') || '';
                appData.height = app.getAttribute('data-widget-height') || '';
                appData.presetSize = app.getAttribute('data-widget-preset-size') || '';
            }
            return appData;
        }

        function serializeDesktopGrid() {
            const apps = [];
            getCurrentDesktopSlots().forEach((slot, index) => {
                const app = slot.querySelector(':scope > .app-item');
                if (app) apps.push(serializeAppElement(app, index));
            });
            return apps;
        }

        function serializeDockApps() {
            return Array.from(document.querySelectorAll('#dock .app-item')).map((app, index) => serializeAppElement(app, index));
        }

        function commitCurrentDesktopPage() {
            // A missing or incomplete DOM must never erase the stored page model.
            if (!isDesktopLayoutReady()) return;
            if (!desktopPages.length) desktopPages = [[]];
            desktopPages[currentDesktopPage] = serializeDesktopGrid();
        }

        function getDesktopPagesSnapshot() {
            commitCurrentDesktopPage();
            return desktopPages.map(cloneDesktopPage);
        }

        function getCurrentDesktopPageIndex() {
            return currentDesktopPage;
        }

        function getDesktopRowCount() {
            return DESKTOP_ROWS;
        }

        function collectDesktopAppIds(app, appIds) {
            if (!app || typeof app !== 'object') return;
            if (app.appId) appIds.add(app.appId);
            if (Array.isArray(app.apps)) {
                app.apps.forEach(child => collectDesktopAppIds(child, appIds));
            }
        }

        function addMissingPlaceholderApps(pages, dockData = [], candidateApps = PLACEHOLDER_DESKTOP_APPS) {
            const normalizedPages = normalizeDesktopPages(pages, DESKTOP_ROWS);
            const existingAppIds = new Set();
            normalizedPages.forEach(page => page.forEach(app => collectDesktopAppIds(app, existingAppIds)));
            dockData.forEach(app => collectDesktopAppIds(app, existingAppIds));

            const missingApps = candidateApps.filter(app => !existingAppIds.has(app.appId));
            if (missingApps.length === 0) return { pages: normalizedPages, changed: false };

            const occupiedSlots = normalizedPages.map(page => {
                const occupied = new Set();
                page.forEach(app => {
                    const span = app && (app.isWidget || app.widgetContent)
                        ? getWidgetGridSpan(app)
                        : { columns: 1, rows: 1 };
                    getDesktopAreaIndexes(Number(app.index) || 0, span.columns, span.rows)
                        .forEach(index => occupied.add(index));
                });
                return occupied;
            });

            missingApps.forEach(app => {
                let placed = false;
                for (let pageIndex = 0; !placed; pageIndex++) {
                    if (!normalizedPages[pageIndex]) {
                        normalizedPages[pageIndex] = [];
                        occupiedSlots[pageIndex] = new Set();
                    }
                    for (let index = 0; index < DESKTOP_SLOT_COUNT; index++) {
                        if (occupiedSlots[pageIndex].has(index)) continue;
                        normalizedPages[pageIndex].push({ ...app, index });
                        occupiedSlots[pageIndex].add(index);
                        placed = true;
                        break;
                    }
                }
            });

            return { pages: normalizedPages, changed: true };
        }

        function ensurePlaceholderAppsOnDesktop(batchName) {
            const pages = getDesktopPagesSnapshot();
            const dockData = serializeDockApps();
            const candidateApps = batchName
                ? PLACEHOLDER_DESKTOP_APP_BATCHES[batchName] || []
                : PLACEHOLDER_DESKTOP_APPS;
            const result = addMissingPlaceholderApps(pages, dockData, candidateApps);
            if (!result.changed) return false;
            renderLayout(result.pages, dockData, currentDesktopPage, DESKTOP_ROWS);
            return true;
        }

        function recoverEmptyDesktopLayout(pages, dockData, recoveryLayout) {
            pages = getStoredDesktopPages(pages);
            dockData = cloneDesktopPage(dockData);
            // Recover the empty page-and-Dock signature without resetting other pages.
            if (pages[0].length || dockData.length) return { pages, dock: dockData, changed: false };
            const recoveryPages = getStoredDesktopPages(recoveryLayout?.pages || recoveryLayout?.desktop);
            const recoveryDock = cloneDesktopPage(recoveryLayout?.dock);
            if (pages.every(page => !page.length) && recoveryPages.some(page => page.length) && recoveryDock.length) {
                return { pages: recoveryPages, dock: recoveryDock, desktopRows: recoveryLayout.desktopRows, changed: true };
            }
            const dock = recoveryDock.length ? recoveryDock : [
                { name: '电话', appId: 'call', icon: null },
                { name: '信息', appId: 'message', icon: null },
                { name: '主题', appId: 'theme', icon: null }
            ];
            const existingIds = new Set();
            pages.forEach(page => page.forEach(app => collectDesktopAppIds(app, existingIds)));
            const missingOnly = app => {
                if (app.isFolder) {
                    const apps = app.apps.map(missingOnly).filter(Boolean);
                    return apps.length ? { ...app, apps } : null;
                }
                if (!app.appId || existingIds.has(app.appId)) return null;
                existingIds.add(app.appId);
                return app;
            };
            const restoredDock = dock.map(missingOnly).filter(Boolean);
            const candidates = recoveryPages[0].length ? recoveryPages[0] : [
                { name: 'wechat', appId: 'wechat', icon: null },
                { name: 'Contacts', appId: 'contacts', icon: null },
                { name: '世界书', appId: 'worldbook', icon: null },
                { name: '设置', appId: 'settings', icon: null },
                { name: '记忆', appId: 'memory', icon: null },
                ...PLACEHOLDER_DESKTOP_APPS
            ];
            const missingApps = candidates.map(missingOnly).filter(Boolean);
            pages[0] = missingApps.map((app, index) => ({ ...app, index: Number.isInteger(app.index) ? app.index : index }));
            return {
                pages,
                dock: restoredDock, changed: missingApps.length > 0 || restoredDock.length > 0
            };
        }
        window.recoverEmptyDesktopLayout = recoverEmptyDesktopLayout;

        const REMOVED_PLACEHOLDER_APP_NAMES = new Set(['厨神驾到', '厨神', '问爻', '家居', '邮件']);

        function isRemovedPlaceholderApp(app) {
            if (!app) return false;
            if (app.appId && REMOVED_PLACEHOLDER_APP_IDS.has(app.appId)) return true;
            if (app.name && REMOVED_PLACEHOLDER_APP_NAMES.has(app.name)) return true;
            return false;
        }

        function removeDeletedPlaceholderAppsFromList(apps) {
            const nextApps = [];
            let changed = false;

            (Array.isArray(apps) ? apps : []).forEach(app => {
                if (!app) return;
                if (isRemovedPlaceholderApp(app)) {
                    changed = true;
                    return;
                }

                if (app.isFolder) {
                    const nested = removeDeletedPlaceholderAppsFromList(app.apps);
                    const folderApps = nested.apps;
                    if (nested.changed) changed = true;
                    if (folderApps.length === 0) {
                        changed = true;
                        return;
                    }
                    if (folderApps.length === 1) {
                        nextApps.push({ ...folderApps[0], index: app.index });
                        changed = true;
                        return;
                    }
                    nextApps.push({ ...app, apps: folderApps });
                    return;
                }

                nextApps.push({ ...app });
            });

            return { apps: nextApps, changed };
        }

        function compactDesktopLayoutAfterRemoval(pages) {
            if (!Array.isArray(pages)) return pages;

            const compactedPages = pages.map(page => {
                if (!Array.isArray(page) || page.length === 0) return [];
                
                const occupiedByWidget = new Set();
                const widgets = [];
                const normalApps = [];

                page.forEach(app => {
                    if (app && (app.isWidget || app.widgetContent)) {
                        widgets.push(app);
                        const span = getWidgetGridSpan(app);
                        getDesktopAreaIndexes(Number(app.index) || 0, span.columns, span.rows)
                            .forEach(idx => occupiedByWidget.add(idx));
                    } else if (app) {
                        normalApps.push(app);
                    }
                });

                normalApps.sort((a, b) => (Number(a.index) || 0) - (Number(b.index) || 0));

                const originalSlots = normalApps.map(app => Number(app.index) || 0);
                const minSlot = originalSlots.length > 0 ? Math.min(...originalSlots) : 0;
                
                const availableSlots = [];
                for (let i = minSlot; i < DESKTOP_SLOT_COUNT; i++) {
                    if (!occupiedByWidget.has(i)) {
                        availableSlots.push(i);
                    }
                }

                const reindexedNormalApps = normalApps.map((app, i) => {
                    const targetSlot = i < availableSlots.length ? availableSlots[i] : Number(app.index);
                    return { ...app, index: targetSlot };
                });

                return [...widgets, ...reindexedNormalApps];
            });

            for (let p = 0; p < compactedPages.length - 1; p++) {
                const currentPage = compactedPages[p];
                const nextPage = compactedPages[p + 1];
                if (!nextPage || nextPage.length === 0) continue;

                const currentOccupied = new Set();
                currentPage.forEach(app => {
                    const span = app && (app.isWidget || app.widgetContent) ? getWidgetGridSpan(app) : { columns: 1, rows: 1 };
                    getDesktopAreaIndexes(Number(app.index) || 0, span.columns, span.rows).forEach(idx => currentOccupied.add(idx));
                });

                const freeSlots = [];
                for (let i = 0; i < DESKTOP_SLOT_COUNT; i++) {
                    if (!currentOccupied.has(i)) freeSlots.push(i);
                }

                const nextHasWidget = nextPage.some(app => app && (app.isWidget || app.widgetContent));
                if (!nextHasWidget && nextPage.length > 0 && nextPage.length <= freeSlots.length) {
                    nextPage.forEach((app, idx) => {
                        currentPage.push({ ...app, index: freeSlots[idx] });
                    });
                    nextPage.length = 0;
                }
            }

            while (compactedPages.length > 1 && compactedPages[compactedPages.length - 1].length === 0) {
                compactedPages.pop();
            }

            return compactedPages;
        }

        function removeDeletedPlaceholderApps() {
            const pages = getDesktopPagesSnapshot();
            const dockData = serializeDockApps();
            const cleanedPages = pages.map(page => removeDeletedPlaceholderAppsFromList(page));
            const cleanedDock = removeDeletedPlaceholderAppsFromList(dockData);
            const changed = cleanedPages.some(result => result.changed) || cleanedDock.changed;
            if (!changed) return false;

            const compactedPages = compactDesktopLayoutAfterRemoval(cleanedPages.map(result => result.apps));

            renderLayout(
                compactedPages,
                cleanedDock.apps,
                currentDesktopPage,
                DESKTOP_ROWS
            );
            return true;
        }

        function updatePlaceholderAppIcons() {
            const iconByAppId = new Map(
                PLACEHOLDER_DESKTOP_APPS
                    .filter(app => app.icon && app.icon.startsWith('url('))
                    .map(app => [app.appId, app.icon])
            );
            const metadataByAppId = new Map(
                PLACEHOLDER_DESKTOP_APPS
                    .filter(app => PLACEHOLDER_DESKTOP_APP_METADATA_UPDATE_IDS.has(app.appId))
                    .map(app => [app.appId, { name: app.name, icon: app.icon }])
            );
            const pages = getDesktopPagesSnapshot();
            const dockData = serializeDockApps();
            let changed = false;

            const updateApp = app => {
                const nextMetadata = app && metadataByAppId.get(app.appId);
                if (nextMetadata && app.name !== nextMetadata.name) {
                    app.name = nextMetadata.name;
                    changed = true;
                }
                const nextIcon = app && iconByAppId.get(app.appId);
                if (!nextIcon || app.icon === nextIcon) return;
                app.icon = nextIcon;
                changed = true;
            };
            pages.forEach(page => page.forEach(updateApp));
            dockData.forEach(updateApp);

            if (!changed) return false;
            renderLayout(pages, dockData, currentDesktopPage, DESKTOP_ROWS);
            return true;
        }

        function getDesktopPageElement(pageIndex = currentDesktopPage) {
            const desktopGrid = document.getElementById('desktopGrid');
            return desktopGrid
                ? desktopGrid.querySelector(`:scope > .desktop-page[data-page-index="${pageIndex}"]`)
                : null;
        }

        function getCurrentDesktopSlots() {
            const page = getDesktopPageElement();
            return page ? Array.from(page.querySelectorAll(':scope > .desktop-slot')) : [];
        }

        function createDesktopPageElement(pageIndex, pageData = [], container = document.getElementById('desktopGrid')) {
            const page = document.createElement('div');
            page.className = 'desktop-page';
            page.dataset.pageIndex = String(pageIndex);
            for (let i = 0; i < DESKTOP_SLOT_COUNT; i++) {
                const slot = document.createElement('div');
                slot.className = 'desktop-slot' + (isEditMode ? ' show-grid' : '');
                const appData = pageData.find(d => d.index === i);
                if (appData) {
                    const app = appData.isWidget || appData.widgetContent
                        ? createAppElement(appData.name, appData.icon, appData.appId, true, appData.widgetContent, appData.width, appData.height, appData.presetSize)
                        : createAppElement(appData.name, appData.icon, appData.appId, false, '', '', '', '', appData.isFolder, appData.apps);
                    if (isEditMode) app.classList.add('jiggling');
                    slot.appendChild(app);
                }
                page.appendChild(slot);
            }
            container.appendChild(page);
            rebuildDesktopWidgetOccupancy(page);
            return page;
        }

        function ensureDesktopPageElement(pageIndex, pageData = []) {
            return getDesktopPageElement(pageIndex) || createDesktopPageElement(pageIndex, pageData);
        }

        function activateDesktopPage(pageIndex) {
            const desktopGrid = document.getElementById('desktopGrid');
            const activePage = ensureDesktopPageElement(pageIndex, desktopPages[pageIndex]);
            desktopGrid.querySelectorAll(':scope > .desktop-page').forEach(page => {
                const isActive = page === activePage;
                page.classList.toggle('active', isActive);
            });
            desktopGrid.style.transform = `translate3d(-${pageIndex * 100}%, 0, 0)`;
            return activePage;
        }

        function removeDesktopPageElement(pageIndex) {
            const page = getDesktopPageElement(pageIndex);
            if (page) page.remove();
            document.querySelectorAll('#desktopGrid > .desktop-page').forEach(pageElement => {
                const storedIndex = Number(pageElement.dataset.pageIndex);
                if (storedIndex > pageIndex) {
                    pageElement.dataset.pageIndex = String(storedIndex - 1);
                }
            });
        }

        function ensureDesktopPageControls() {
            let controls = document.getElementById('desktopPageControls');
            if (controls) return controls;
            controls = document.createElement('div');
            controls.id = 'desktopPageControls';
            controls.className = 'desktop-page-controls';
            controls.innerHTML = `
                <button class="desktop-page-action desktop-page-delete" type="button" aria-label="删除当前空白页" title="删除当前空白页">−</button>
                <div class="desktop-page-dots" aria-label="桌面页面"></div>
                <button class="desktop-page-action desktop-page-add" type="button" aria-label="新增空白页" title="新增空白页">+</button>
            `;
            const iphone = document.querySelector('.iphone');
            if (iphone) iphone.appendChild(controls);
            controls.querySelector('.desktop-page-add').addEventListener('click', addBlankDesktopPage);
            controls.querySelector('.desktop-page-delete').addEventListener('click', deleteCurrentBlankDesktopPage);
            return controls;
        }

        let desktopPageCollisionFrame = 0;
        let desktopPageCollisionTimer = 0;

        function scheduleDesktopPageControlCollisionUpdate() {
            if (!useAndroidViewportCompat) {
                updateDesktopPageControlCollision();
                return;
            }
            if (desktopPageCollisionFrame) cancelAnimationFrame(desktopPageCollisionFrame);
            clearTimeout(desktopPageCollisionTimer);
            desktopPageCollisionFrame = requestAnimationFrame(() => {
                desktopPageCollisionFrame = requestAnimationFrame(() => {
                    desktopPageCollisionFrame = 0;
                    updateDesktopPageControlCollision();
                });
            });
            desktopPageCollisionTimer = setTimeout(updateDesktopPageControlCollision, 120);
        }

        function renderDesktopPageControls() {
            const controls = ensureDesktopPageControls();
            if (!controls) return;
            const dots = controls.querySelector('.desktop-page-dots');
            let dotElements = Array.from(dots.querySelectorAll('.desktop-page-dot'));

            if (dotElements.length !== desktopPages.length) {
                dots.replaceChildren();
                const fragment = document.createDocumentFragment();
                desktopPages.forEach((page, index) => {
                    const dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = 'desktop-page-dot';
                    dot.setAttribute('aria-label', `第 ${index + 1} 页`);
                    dot.addEventListener('click', () => switchDesktopPage(index));
                    fragment.appendChild(dot);
                });
                dots.appendChild(fragment);
                dotElements = Array.from(dots.querySelectorAll('.desktop-page-dot'));
            }

            dotElements.forEach((dot, index) => {
                const isActive = index === currentDesktopPage;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'page' : 'false');
            });

            controls.classList.toggle('is-editing', isEditMode);
            const deleteButton = controls.querySelector('.desktop-page-delete');
            const currentPageIsEmpty = isEditMode
                ? serializeDesktopGrid().length === 0
                : (desktopPages[currentDesktopPage]?.length || 0) === 0;
            deleteButton.disabled = desktopPages.length <= 1 || !currentPageIsEmpty;
        }

        function updateDesktopPageControlCollision() {
            const controls = document.getElementById('desktopPageControls');
            if (!controls) return;

            // Keep page dots anchored in the reserved desktop area on every page.
            // Content-aware relocation made the indicator jump vertically between pages.
            controls.classList.remove('has-content-collision');
            controls.style.removeProperty('top');
            controls.style.removeProperty('bottom');
        }

        function renderDesktopPage(pageData = [], direction = 0) {
            ensureDesktopPageElement(currentDesktopPage, pageData);
            activateDesktopPage(currentDesktopPage);
            renderDesktopPageControls();
        }

        function switchDesktopPage(pageIndex, options = {}) {
            const nextPage = Math.max(0, Math.min(Math.trunc(Number(pageIndex) || 0), desktopPages.length - 1));
            if (nextPage === currentDesktopPage) {
                renderDesktopPageControls();
                return false;
            }
            if (!options.skipCommit) commitCurrentDesktopPage();
            const direction = nextPage > currentDesktopPage ? 1 : -1;
            currentDesktopPage = nextPage;
            renderDesktopPage(desktopPages[currentDesktopPage], direction);
            if (!options.skipSave && typeof window.saveLayout === 'function') window.saveLayout();
            return true;
        }

        function addBlankDesktopPage() {
            commitCurrentDesktopPage();
            desktopPages.push([]);
            currentDesktopPage = desktopPages.length - 1;
            renderDesktopPage(desktopPages[currentDesktopPage], 1);
            if (typeof window.saveLayout === 'function') window.saveLayout();
        }

        function deleteCurrentBlankDesktopPage() {
            commitCurrentDesktopPage();
            if (desktopPages.length <= 1 || desktopPages[currentDesktopPage].length > 0) return false;
            const deletedPage = currentDesktopPage;
            desktopPages.splice(deletedPage, 1);
            removeDesktopPageElement(deletedPage);
            currentDesktopPage = Math.min(currentDesktopPage, desktopPages.length - 1);
            renderDesktopPage(desktopPages[currentDesktopPage], -1);
            if (typeof window.saveLayout === 'function') window.saveLayout();
            return true;
        }

        window.serializeDesktopGrid = serializeDesktopGrid;
        window.serializeDockApps = serializeDockApps;
        window.getDesktopPagesSnapshot = getDesktopPagesSnapshot;
        window.getCurrentDesktopPageIndex = getCurrentDesktopPageIndex;
        window.getDesktopRowCount = getDesktopRowCount;
        window.ensurePlaceholderAppsOnDesktop = ensurePlaceholderAppsOnDesktop;
        window.removeDeletedPlaceholderApps = removeDeletedPlaceholderApps;
        window.updatePlaceholderAppIcons = updatePlaceholderAppIcons;
        window.switchDesktopPage = switchDesktopPage;
        window.addBlankDesktopPage = addBlankDesktopPage;
        window.deleteCurrentBlankDesktopPage = deleteCurrentBlankDesktopPage;
        window.makeDesktopWidgetFrameHTML = makeDesktopWidgetFrameHTML;

        function getWidgetGridSpan(widgetData) {
            const legacyWidth = parseInt(widgetData.width, 10);
            const legacyHeight = parseInt(widgetData.height, 10);
            let columns = 1;
            let rows = 1;
            if (legacyWidth > 0 && legacyHeight > 0) {
                columns = Math.round(legacyWidth / 140) || 1;
                rows = Math.round(legacyHeight / 140) || 1;
            } else if (widgetData.presetSize) {
                const parts = widgetData.presetSize.split('x').map(Number);
                columns = parts[0] || 1;
                rows = parts[1] || 1;
            }
            return {
                columns: Math.min(DESKTOP_COLUMNS, Math.max(1, columns)),
                rows: Math.min(DESKTOP_ROWS, Math.max(1, rows))
            };
        }

        function getDesktopAreaIndexes(startIndex, columns, rows) {
            const startColumn = startIndex % DESKTOP_COLUMNS;
            const startRow = Math.floor(startIndex / DESKTOP_COLUMNS);
            if (startColumn + columns > DESKTOP_COLUMNS || startRow + rows > DESKTOP_ROWS) return [];
            const indexes = [];
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    indexes.push(startIndex + row * DESKTOP_COLUMNS + column);
                }
            }
            return indexes;
        }

        function rebuildDesktopWidgetOccupancy(page = getDesktopPageElement()) {
            const slots = page ? Array.from(page.querySelectorAll(':scope > .desktop-slot')) : [];
            slots.forEach(slot => slot.removeAttribute('data-widget-occupied-by'));
            slots.forEach((slot, startIndex) => {
                const widget = slot.querySelector(':scope > .app-item.is-widget');
                if (!widget) return;
                const columns = parseInt(widget.getAttribute('data-widget-columns'), 10) || 1;
                const rows = parseInt(widget.getAttribute('data-widget-rows'), 10) || 1;
                const widgetId = widget.getAttribute('data-app-id') || '';
                getDesktopAreaIndexes(startIndex, columns, rows).forEach(index => {
                    if (index !== startIndex && slots[index]) slots[index].setAttribute('data-widget-occupied-by', widgetId);
                });
            });
        }

        function isDesktopAreaAvailable(startIndex, columns, rows, ignoredWidget) {
            const slots = getCurrentDesktopSlots();
            const indexes = getDesktopAreaIndexes(startIndex, columns, rows);
            if (indexes.length !== columns * rows) return false;
            const ignoredId = ignoredWidget ? ignoredWidget.getAttribute('data-app-id') : '';
            return indexes.every(index => {
                const slot = slots[index];
                const app = slot ? slot.querySelector(':scope > .app-item') : null;
                const occupiedBy = slot ? slot.getAttribute('data-widget-occupied-by') : '';
                return slot && (!app || app === ignoredWidget) && (!occupiedBy || occupiedBy === ignoredId);
            });
        }

        function findAvailableWidgetSlot(columns, rows) {
            rebuildDesktopWidgetOccupancy();
            const slots = getCurrentDesktopSlots();
            for (let index = 0; index < slots.length; index++) {
                if (isDesktopAreaAvailable(index, columns, rows, null)) return slots[index];
            }
            return null;
        }

        function addDesktopWidget(widgetData, preloadedFrame) {
        if (window.charphoneWidgetTargetActive && typeof window.charphoneAddWidget === 'function') {
            return window.charphoneAddWidget(widgetData);
        }
        const span = getWidgetGridSpan(widgetData);
        const emptySlot = findAvailableWidgetSlot(span.columns, span.rows);

        if (emptySlot) {
            const widgetContent = normalizeStoredWidgetContent(widgetData.content);
            const app = document.createElement('div');
            app.className = 'app-item is-widget';
            app.setAttribute('data-app-id', 'widget-' + Date.now());
            app.setAttribute('data-widget-content', encodeURIComponent(widgetContent));
            app.setAttribute('data-widget-width', widgetData.width || '');
            app.setAttribute('data-widget-height', widgetData.height || '');
            app.setAttribute('data-widget-preset-size', widgetData.presetSize || '');
            app.setAttribute('data-widget-columns', span.columns);
            app.setAttribute('data-widget-rows', span.rows);

            const dims1 = getWidgetDimensions(widgetData);
            app.style.width = dims1.width + 'px';
            app.style.height = dims1.height + 'px';
            const frameHTML = preloadedFrame && preloadedFrame.classList.contains('widget-render-frame')
                ? ''
                : makeDesktopWidgetFrameHTML(widgetContent);
            app.innerHTML = `<div class="app-delete-btn" onpointerdown="deleteDesktopApp(this, event)">-</div><div class="widget-edit-hotzone" aria-label="长按进入编辑模式"></div><div class="app-icon" style="background: transparent; box-shadow: none; border-radius: 20px; overflow: hidden; width: ${dims1.width}px; height: ${dims1.height}px; position: absolute; left: 0; top: 0; z-index: 10;">${frameHTML}</div><div class="app-name" style="display:none;">${widgetData.name || "组件"}</div>`;

            if (preloadedFrame && preloadedFrame.classList.contains('widget-render-frame')) {
                const icon = app.querySelector('.app-icon');
                preloadedFrame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:transparent;pointer-events:auto;';
                preloadedFrame.setAttribute('title', '组件');
                icon.replaceChildren(preloadedFrame);
            }

            if (isEditMode) app.classList.add('jiggling');
            emptySlot.appendChild(app);
            rebuildDesktopWidgetOccupancy();
            saveLayout();
            return true;
        } else {
            alert('桌面没有足够的连续空间，请先清理或更换位置');
            return false;
        }
    }

    function applyWallpaperToDesktop(src) {
        currentWallpaperSrc = src;
        const iphoneEl = document.querySelector('.iphone');
        if (src) {
            iphoneEl.style.backgroundImage = `url('${src}')`;
            iphoneEl.style.backgroundSize = 'cover';
            iphoneEl.style.backgroundPosition = 'center';
        } else {
            iphoneEl.style.backgroundImage = ''; // 清空内联样式，让 CSS 类接管深浅色渐变
        }
    }
    window.applyWallpaperToDesktop = applyWallpaperToDesktop;

    function renderDefaultLayout() {
        const iconMap = {
            '设置': null,
            'wechat': null,
            'Contacts': null,
            '世界书': null,
            '电话': null,
            '信息': null,
            '主题': null,
            '见面': null,
            '音乐': null,
            '今日': null,
            '记忆': null,
            'B站': null,
            '健康': null,
            '游戏中心': null,
            '相册': null,
            '阅读': null,
            'icity': null,
            'MCP': null,
            'Twitter': null,
            'Apple store': null
        };

        const getOfficialWidgetByName = (name) => {
            const list = window.officialWidgets || [];
            const target = list.find(w => w && w.name === name);
            return target && target.content ? encodeURIComponent(target.content) : '';
        };

        const defaultPages = [
            [
                { index: 0, name: '时间胶囊', appId: 'widget-default-time', isWidget: true, presetSize: '4x2', widgetContent: getOfficialWidgetByName('时间胶囊') },
                { index: 8, name: '今日', appId: 'placeholder-today', icon: iconMap['今日'] },
                { index: 9, name: '相册', appId: 'placeholder-photos', icon: iconMap['相册'] },
                { index: 10, name: '可爱气泡对话', appId: 'widget-default-cute-bubble', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('可爱气泡对话') },
                { index: 12, name: 'wechat', appId: 'wechat', icon: iconMap['wechat'] },
                { index: 13, name: 'Contacts', appId: 'contacts', icon: iconMap['Contacts'] },
                { index: 16, name: '双层拍立得', appId: 'widget-default-polaroid', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('双层拍立得') },
                { index: 18, name: '世界书', appId: 'worldbook', icon: iconMap['世界书'] },
                { index: 19, name: '设置', appId: 'settings', icon: iconMap['设置'] },
                { index: 22, name: '音乐', appId: 'placeholder-music', icon: iconMap['音乐'] },
                { index: 23, name: 'Apple store', appId: 'applestore', icon: iconMap['Apple store'] }
            ],
            [
                { index: 0, name: '小猫日记', appId: 'widget-default-cat-space', isWidget: true, presetSize: '4x4', widgetContent: getOfficialWidgetByName('小猫日记') },
                { index: 16, name: 'B站', appId: 'placeholder-bilibili', icon: iconMap['B站'] },
                { index: 17, name: '游戏中心', appId: 'placeholder-game-center', icon: iconMap['游戏中心'] },
                { index: 18, name: 'ins头像对话', appId: 'widget-default-duo-dialog', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('ins头像对话') },
                { index: 20, name: '阅读', appId: 'placeholder-reading', icon: iconMap['阅读'] },
                { index: 21, name: '记忆', appId: 'memory', icon: iconMap['记忆'] }
            ],
            [
                { index: 1, name: '甜美头像圈', appId: 'widget-default-cute-ring', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('甜美头像圈') },
                { index: 8, name: '见面', appId: 'meeting', icon: iconMap['见面'] },
                { index: 9, name: 'Diary', appId: 'placeholder-icity', icon: iconMap['icity'] },
                { index: 10, name: '健康', appId: 'placeholder-health', icon: iconMap['健康'] },
                { index: 11, name: 'MCP', appId: 'mcp', icon: iconMap['MCP'] },
                { index: 12, name: 'Twitter', appId: 'twitter', icon: iconMap['Twitter'] },
                { index: 16, name: '音乐播放器', appId: 'widget-default-music', isWidget: true, presetSize: '4x2', widgetContent: getOfficialWidgetByName('音乐播放器') }
            ]
        ];

        const defaultDock = [
            { index: 0, name: '电话', appId: 'call', icon: iconMap['电话'] },
            { index: 1, name: '信息', appId: 'message', icon: iconMap['信息'] },
            { index: 2, name: '主题', appId: 'theme', icon: iconMap['主题'] }
        ];

        const layoutWithPlaceholders = addMissingPlaceholderApps(defaultPages, defaultDock);
        renderLayout(layoutWithPlaceholders.pages, defaultDock, 0, DESKTOP_ROWS);
        saveLayout();
    }

    const TODAY_CALENDAR_APP_ID = 'placeholder-today';
    const TODAY_CALENDAR_WEEKDAYS = Object.freeze(['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']);
    let todayCalendarRefreshTimer = null;

    function renderTodayCalendarIcon(iconEl, date = new Date()) {
        if (!iconEl) return;
        iconEl.className = 'app-icon today-calendar-icon';
        iconEl.style.backgroundImage = '';
        iconEl.style.backgroundColor = '';
        iconEl.dataset.calendarDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        iconEl.innerHTML = getTodayCalendarIconHtml(date);
    }

    function refreshTodayCalendarIcons() {
        const now = new Date();
        document.querySelectorAll(`[data-app-id="${TODAY_CALENDAR_APP_ID}"] .app-icon`).forEach(iconEl => {
            if (iconEl.classList.contains('has-custom-icon') || (iconEl.style.backgroundImage && iconEl.style.backgroundImage !== 'none')) {
                return;
            }
            renderTodayCalendarIcon(iconEl, now);
        });
        document.querySelectorAll('.folder-mini-icon.today-calendar-mini-icon').forEach(iconEl => {
            iconEl.innerHTML = getTodayCalendarIconHtml(now);
        });
    }

    function scheduleTodayCalendarRefresh() {
        clearTimeout(todayCalendarRefreshTimer);
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        todayCalendarRefreshTimer = setTimeout(() => {
            refreshTodayCalendarIcons();
            scheduleTodayCalendarRefresh();
        }, nextDay.getTime() - now.getTime() + 1000);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        refreshTodayCalendarIcons();
        scheduleTodayCalendarRefresh();
    });
    scheduleTodayCalendarRefresh();

        function createAppElement(name, icon, appId, isWidget=false, widgetContent='', width='', height='', presetSize='', isFolder=false, folderApps=[]) {
        const app = document.createElement('div');
        app.className = isWidget ? 'app-item is-widget' : (isFolder ? 'app-item is-folder' : 'app-item');
        if (appId) {
            app.setAttribute('data-app-id', appId);
        }
        
        if (isFolder) {
            app.setAttribute('data-folder-apps', encodeURIComponent(JSON.stringify(folderApps)));
            const iconEl = document.createElement('div');
            iconEl.className = 'app-icon folder-icon';
            iconEl.innerHTML = folderApps.slice(0, 9).map(getDesktopMiniIconMarkup).join('');
            const nameEl = document.createElement('div');
            nameEl.className = 'app-name';
            nameEl.textContent = name || '文件夹';
            app.innerHTML = `<div class="app-delete-btn" onpointerdown="deleteDesktopApp(this, event)">-</div>`;
            app.append(iconEl, nameEl);
        } else if (isWidget) {
            const normalizedWidgetContent = normalizeStoredWidgetContent(widgetContent);
            app.setAttribute('data-widget-content', encodeURIComponent(normalizedWidgetContent));
            app.setAttribute('data-widget-width', width || '');
            app.setAttribute('data-widget-height', height || '');
            app.setAttribute('data-widget-preset-size', presetSize || '');
            const widgetSpan = getWidgetGridSpan({ width, height, presetSize });
            app.setAttribute('data-widget-columns', widgetSpan.columns);
            app.setAttribute('data-widget-rows', widgetSpan.rows);
            const dims2 = getWidgetDimensions({ width, height, presetSize });
            app.style.width = dims2.width + 'px';
            app.style.height = dims2.height + 'px';
            app.innerHTML = `<div class="app-delete-btn" onpointerdown="deleteDesktopApp(this, event)">-</div><div class="widget-edit-hotzone" aria-label="长按进入编辑模式"></div><div class="app-icon" style="background: transparent; box-shadow: none; border-radius: 20px; overflow: hidden; width: ${dims2.width}px; height: ${dims2.height}px; position: absolute; left: 0; top: 0; z-index: 10;">${makeDesktopWidgetFrameHTML(normalizedWidgetContent)}</div><div class="app-name" style="display:none;">组件</div>`;
        } else {
            const iconEl = document.createElement('div');
            iconEl.className = 'app-icon';
            const nameEl = document.createElement('div');
            nameEl.className = 'app-name';
            nameEl.textContent = appId === 'placeholder-icity' && /^icity$/i.test(String(name || '').trim()) ? 'Diary' : (name || '');
            app.innerHTML = `<div class="app-delete-btn" onpointerdown="deleteDesktopApp(this, event)">-</div>`;
            app.append(iconEl, nameEl);
            if (!applyBuiltinDesktopIcon(iconEl, appId, icon) && icon && icon !== 'none') {
                iconEl.style.backgroundImage = icon;
                iconEl.style.backgroundColor = 'transparent';
                iconEl.classList.add('has-custom-icon');
            }
        }

        return app;
    }

    function removeRedundantCharacterPhoneIcons(pages) {
        const isInFolder = pages.some(page => page.some(app =>
            app && app.isFolder && Array.isArray(app.apps) &&
            app.apps.some(child => child && child.appId === 'character-phone')
        ));
        if (!isInFolder) return false;

        let removed = false;
        pages.forEach(page => {
            for (let i = page.length - 1; i >= 0; i--) {
                if (page[i] && page[i].appId === 'character-phone') {
                    page.splice(i, 1);
                    removed = true;
                }
            }
        });
        return removed;
    }

    function renderLayout(desktopData = [], dockData = [], pageIndex = 0, sourceRows) {
        const grid = document.getElementById('desktopGrid');
        const dock = document.getElementById('dock');
        if (!grid || !dock) throw new Error('Desktop containers are unavailable');
        const previous = {
            pages: desktopPages, page: currentDesktopPage, rows: DESKTOP_ROWS, ready: desktopLayoutReady,
            gridNodes: Array.from(grid.childNodes), dockNodes: Array.from(dock.childNodes)
        };
        desktopLayoutReady = false;
        let needsSave;
        try {
            needsSave = renderStoredDesktopLayout(desktopData, dockData, pageIndex, sourceRows);
            desktopLayoutReady = true;
        } catch (error) {
            desktopPages = previous.pages;
            currentDesktopPage = previous.page;
            applyDesktopRowCount(previous.rows);
            grid.replaceChildren(...previous.gridNodes);
            dock.replaceChildren(...previous.dockNodes);
            desktopLayoutReady = previous.ready;
            if (previous.ready) renderDesktopPage(desktopPages[currentDesktopPage]);
            throw error;
        }
        if (needsSave) saveLayout();
        return true;
    }

    function renderStoredDesktopLayout(desktopData = [], dockData = [], pageIndex = 0, sourceRows) {
        const dock = document.getElementById('dock');
        const sourcePages = getStoredDesktopPages(desktopData);
        dockData = cloneDesktopPage(dockData);
        let migratedMeetingApp = false;
        sourcePages.forEach(page => page.forEach(app => {
            if (app?.appId === 'placeholder-xiangfeng') {
                app.appId = 'meeting';
                migratedMeetingApp = true;
            }
        }));
        dockData.forEach(app => {
            if (app?.appId === 'placeholder-xiangfeng') {
                app.appId = 'meeting';
                migratedMeetingApp = true;
            }
        });
        const removedDuplicateCharacterPhone = removeRedundantCharacterPhoneIcons(sourcePages);
        const normalizedSourceRows = normalizeDesktopRowCount(sourceRows, sourcePages);
        const sourceSlotCount = DESKTOP_COLUMNS * normalizedSourceRows;
        applyDesktopRowCount(calculateDesktopRowCount(normalizedSourceRows));
        desktopPages = normalizeDesktopPages(sourcePages, normalizedSourceRows);
        // Ensure the new built-in app appears for existing saved desktops too.
        // This operates on the data model, not by injecting an overlay icon.
        const charphoneAdded = addMissingPlaceholderApps(desktopPages, dockData, PLACEHOLDER_DESKTOP_APP_BATCHES.v8);
        desktopPages = charphoneAdded.pages;
        const fanfictionAdded = addMissingPlaceholderApps(desktopPages, dockData, PLACEHOLDER_DESKTOP_APP_BATCHES.v9);
        desktopPages = fanfictionAdded.pages;
        const sourcePageIndex = Math.max(0, Number(pageIndex) || 0);
        const mappedPageIndex = Math.floor(sourcePageIndex * sourceSlotCount / DESKTOP_SLOT_COUNT);
        currentDesktopPage = Math.max(0, Math.min(mappedPageIndex, desktopPages.length - 1));

            // show three-dots button; click to expand vertical capsule menu
        let hasSettings = false;
        let hasTheme = false;
        let repairedMemoryAppId = false;

        const checkAndHeal = (app) => {
            if (app.appId === 'placeholder-bedtime-book' || (!app.appId && app.name === '记忆')) {
                app.appId = 'memory';
                repairedMemoryAppId = true;
            }
            if (app.appId === 'settings') hasSettings = true;
            if (app.appId === 'theme') hasTheme = true;
            // show three-dots button; click to expand vertical capsule menu
            if (!app.appId) {
                if (app.name === '设置' || (app.icon && app.icon.includes('5b0f2ceab564421096b8a761f125b9f8'))) {
                    app.appId = 'settings';
                    hasSettings = true;
                }
                if (app.name === '主题' || (app.icon && app.icon.includes('6a54a036dfcc02hklfme5i6442'))) {
                    app.appId = 'theme';
                    hasTheme = true;
                }
                if (app.name === '世界书' || (app.icon && app.icon.includes('1L7mKgmQ7qzXUq1S34ehFM_20260713082207'))) {
                    app.appId = 'worldbook';
                }
                if (app.name === 'wechat' || app.name === '微信' || (app.icon && app.icon.includes('e4b01d48b8ad4a5b82879231b5376827'))) {
                    app.appId = 'wechat';
                }
                if (app.name === 'Contacts' || (app.icon && app.icon.includes('1390642a446f8db21a89e22b6cc5dc97'))) {
                    app.appId = 'contacts';
                }
                if ((app.name === 'icity' || app.name === 'Diary') || (app.icon && app.icon.includes('1b49764d130e8005ea149180a1d764db'))) {
                    app.appId = 'placeholder-icity';
                }
                if (app.name === '音乐' || (app.icon && app.icon.includes('44b1b063945538f0ebf2e1670a156958'))) {
                    app.appId = 'placeholder-music';
                }
                if (app.name === '信息' || (app.icon && app.icon.includes('message.webp'))) {
                    app.appId = 'message';
                }
                if (app.name === '电话' || (app.icon && app.icon.includes('dian-hua-i-OS'))) {
                    app.appId = 'call';
                }
                if (app.name === 'Twitter' || app.name === '推特' || (app.icon && app.icon.includes('Twitter-i-OS'))) {
                    app.appId = 'twitter';
                }
                if (app.name === 'Apple store' || app.name === 'Apple Store' || (app.icon && app.icon.includes('1000071869'))) {
                    app.appId = 'applestore';
                }
            }
        };

        desktopPages.forEach(page => page.forEach(checkAndHeal));
        dockData.forEach(checkAndHeal);

            // show three-dots button; click to expand vertical capsule menu
        if (!hasSettings && desktopPages[0].length > 0) {
            desktopPages[0][0].appId = 'settings';
        }
            if (!hasTheme && dockData.length > 0) {
                dockData[dockData.length - 1].appId = 'theme';
            }
            // ----------------------------------

        // Build every page and the Dock before replacing any visible content.
        const pageFragment = document.createDocumentFragment();
        const dockFragment = document.createDocumentFragment();
        desktopPages.forEach((pageData, index) => {
            createDesktopPageElement(index, pageData, pageFragment);
        });
        dockData.forEach(appData => {
            dockFragment.appendChild(createAppElement(appData.name, appData.icon, appData.appId));
        });
        document.getElementById('desktopGrid').replaceChildren(pageFragment);
        dock.replaceChildren(dockFragment);
        clearDesktopSwipeState();
        if (desktopSwipeRafId) cancelAnimationFrame(desktopSwipeRafId);
        desktopSwipeRafId = null;
        clearTimeout(desktopSwipeSettleTimer);
        document.getElementById('desktopGrid').classList.remove('is-swiping', 'is-settling');
        renderDesktopPage(desktopPages[currentDesktopPage]);
        scheduleDesktopViewportReflow();
        return repairedMemoryAppId || migratedMeetingApp || charphoneAdded.changed || fanfictionAdded.changed || removedDuplicateCharacterPhone;
    }

    let desktopResizeTimer = null;

    function syncDesktopViewportLayout() {
        if (!useEdgeViewportCompat) return;
        const grid = document.getElementById('desktopGrid');
        const shell = document.querySelector('.iphone');
        if (!grid || !shell || !grid.firstElementChild) return;
        // A toolbar resize must release the old edit-mode Dock coordinate.
        const repinDock = Boolean(webViewDockInlineState && isEditMode);
        if (repinDock) restoreWebViewDockAfterEditing();
        const scale = getDesktopShellScale();
        const gridTop = grid.getBoundingClientRect().top;
        const bottomEdges = ['desktopPageControls', 'desktopSearchBar', 'dock'].map(id => {
            const element = document.getElementById(id);
            return element?.getClientRects().length && getComputedStyle(element).display !== 'none'
                ? element.getBoundingClientRect().top
                : Infinity;
        });
        const bottom = Math.min(shell.getBoundingClientRect().bottom, ...bottomEdges);
        const height = Math.max(80, Math.floor((bottom - gridTop) / scale) - 8);
        const padding = Math.max(0, Math.min(25, Math.floor((height - DESKTOP_ROWS * 80) / 2)));
        const gap = Math.max(0, Math.min(15, Math.floor((height - padding * 2 - DESKTOP_ROWS * 80) / (DESKTOP_ROWS - 1))));
        shell.style.setProperty('--desktop-grid-height', `${height}px`);
        shell.style.setProperty('--desktop-page-padding-y', `${padding}px`);
        shell.style.setProperty('--desktop-row-gap', `${gap}px`);

        // Resize live widgets in place, retaining iframe state and saved spans.
        grid.querySelectorAll('.app-item.is-widget').forEach(app => {
            const dimensions = getWidgetDimensions({
                width: app.getAttribute('data-widget-width'),
                height: app.getAttribute('data-widget-height'),
                presetSize: app.getAttribute('data-widget-preset-size')
            });
            [app, app.querySelector('.app-icon')].filter(Boolean).forEach(element => {
                element.style.width = `${dimensions.width}px`;
                element.style.height = `${dimensions.height}px`;
            });
        });
        if (repinDock) pinWebViewDockForEditing();
    }

    function reflowDesktopForViewport() {
        if (
            dragGhost ||
            draggedApp ||
            document.documentElement.classList.contains('keyboard-open') ||
            document.documentElement.classList.contains('external-keyboard-editing')
        ) return;
        syncDesktopViewportLayout();
        if (isEditMode) return;
        const nextRows = calculateDesktopRowCount();
        if (nextRows === DESKTOP_ROWS) return;

        const sourceRows = DESKTOP_ROWS;
        const pages = getDesktopPagesSnapshot();
        const dockApps = serializeDockApps();
        const sourcePage = currentDesktopPage;
        applyDesktopRowCount(nextRows);
        renderLayout(pages, dockApps, sourcePage, sourceRows);
        if (typeof window.saveLayout === 'function') window.saveLayout();
    }

    function scheduleDesktopViewportReflow() {
        clearTimeout(desktopResizeTimer);
        desktopResizeTimer = setTimeout(reflowDesktopForViewport, 180);
    }

    window.applyDesktopRowCountSetting = reflowDesktopForViewport;
    window.addEventListener('resize', scheduleDesktopViewportReflow, { passive: true });
    window.addEventListener('orientationchange', scheduleDesktopViewportReflow, { passive: true });
    window.addEventListener('tonghuaji-viewport-change', scheduleDesktopViewportReflow);
    window.addEventListener('tonghuaji-page-adapt-change', scheduleDesktopViewportReflow);
    window.addEventListener('tonghuaji-keyboard-viewport-change', scheduleDesktopViewportReflow);

            // show three-dots button; click to expand vertical capsule menu

            // show three-dots button; click to expand vertical capsule menu
    let isEditMode = false;
    const editPlus = document.getElementById('editPlus');
    const editDone = document.getElementById('editDone');
    const editPlusTouchTarget = document.getElementById('editPlusTouchTarget');
    const editDoneTouchTarget = document.getElementById('editDoneTouchTarget');
    const statusBar = document.getElementById('statusBar');
    const dockContainer = document.getElementById('dock');
    const desktopShell = document.querySelector('.iphone');
    if (useEdgeViewportCompat && typeof ResizeObserver === 'function' && desktopShell) {
        const desktopViewportObserver = new ResizeObserver(scheduleDesktopViewportReflow);
        [desktopShell, dockContainer, document.getElementById('desktopSearchBar')]
            .filter(Boolean).forEach(element => desktopViewportObserver.observe(element));
    }
    let webViewDockInlineState = null;
    let widgetKeyboardPageControlState = null;
    let widgetKeyboardRestoreTimer = 0;

    function getDesktopShellScale() {
        const width = desktopShell?.offsetWidth;
        return width ? desktopShell.getBoundingClientRect().width / width || 1 : 1;
    }

    function pinWebViewDockForEditing() {
        if (!useAndroidViewportCompat || !dockContainer || !desktopShell || webViewDockInlineState) return;
        const shellRect = desktopShell.getBoundingClientRect();
        const dockRect = dockContainer.getBoundingClientRect();
        webViewDockInlineState = {
            top: dockContainer.style.top,
            bottom: dockContainer.style.bottom
        };
        dockContainer.style.top = `${Math.round((dockRect.top - shellRect.top) / getDesktopShellScale())}px`;
        dockContainer.style.bottom = 'auto';
    }

    function restoreWebViewDockAfterEditing() {
        if (!webViewDockInlineState || !dockContainer) return;
        dockContainer.style.top = webViewDockInlineState.top;
        dockContainer.style.bottom = webViewDockInlineState.bottom;
        webViewDockInlineState = null;
    }

    function pinDesktopPageControlsForWidgetKeyboard() {
        if (!useAndroidViewportCompat || !desktopShell || widgetKeyboardPageControlState) return;
        const controls = document.getElementById('desktopPageControls');
        if (!controls) return;
        updateDesktopPageControlCollision();
        const shellRect = desktopShell.getBoundingClientRect();
        const controlsRect = controls.getBoundingClientRect();
        widgetKeyboardPageControlState = {
            top: controls.style.top,
            bottom: controls.style.bottom
        };
        controls.style.top = `${Math.round((controlsRect.top - shellRect.top) / getDesktopShellScale())}px`;
        controls.style.bottom = 'auto';
    }

    function restoreDesktopPageControlsAfterWidgetKeyboard() {
        if (!widgetKeyboardPageControlState) return;
        const controls = document.getElementById('desktopPageControls');
        if (controls) {
            controls.style.top = widgetKeyboardPageControlState.top;
            controls.style.bottom = widgetKeyboardPageControlState.bottom;
        }
        widgetKeyboardPageControlState = null;
        scheduleDesktopPageControlCollisionUpdate();
    }

    function beginDesktopWidgetTextEditing() {
        if (!useAndroidViewportCompat) return;
        clearTimeout(widgetKeyboardRestoreTimer);
        document.documentElement.classList.add('external-keyboard-editing');
        pinWebViewDockForEditing();
        pinDesktopPageControlsForWidgetKeyboard();
    }

    function endDesktopWidgetTextEditing() {
        if (!useAndroidViewportCompat) return;
        clearTimeout(widgetKeyboardRestoreTimer);
        widgetKeyboardRestoreTimer = setTimeout(() => {
            document.documentElement.classList.remove('external-keyboard-editing');
            restoreWebViewDockAfterEditing();
            restoreDesktopPageControlsAfterWidgetKeyboard();
        }, 420);
    }


    function isStatusBarVisible() {
        return appSettings.simulatedStatusBarVisible;
    }

    function syncSimulatedStatusBarMetrics(visibleOverride) {
        const bar = document.getElementById('statusBar');
        const root = document.documentElement;
        const visible = typeof visibleOverride === 'boolean'
            ? visibleOverride
            : Boolean(bar && isStatusBarVisible() && !isEditMode);
        const bottom = visible && bar
            ? Math.max(0, Math.round((bar.offsetTop || 0) + (bar.offsetHeight || 0)))
            : 0;
        const nextValue = `${bottom}px`;
        const previousValue = root.style.getPropertyValue('--simulated-status-bar-bottom');
        root.style.setProperty('--simulated-status-bar-bottom', nextValue);
        root.classList.toggle('simulated-status-bar-visible', visible);
        if (previousValue !== nextValue) {
            window.dispatchEvent(new CustomEvent('tonghuaji-status-bar-layout-change', {
                detail: { visible, bottom }
            }));
        }
    }

    function applyStatusBarVisibility() {
        const shouldShow = isStatusBarVisible();
        const toggle = document.getElementById('statusBarToggle');
        const isActuallyVisible = shouldShow && !isEditMode;
        const bar = document.getElementById('statusBar');

        if (bar) {
            bar.style.opacity = isActuallyVisible ? '1' : '0';
            bar.style.visibility = isActuallyVisible ? 'visible' : 'hidden';
        }
        if (toggle) {
            toggle.classList.toggle('on', shouldShow);
            toggle.setAttribute('aria-checked', String(shouldShow));
        }
        requestAnimationFrame(() => syncSimulatedStatusBarMetrics(isActuallyVisible));
    }
    window.applyStatusBarVisibility = applyStatusBarVisibility;
    window.syncSimulatedStatusBarMetrics = syncSimulatedStatusBarMetrics;

    window.addEventListener('tonghuaji-viewport-change', () => {
        requestAnimationFrame(() => syncSimulatedStatusBarMetrics());
    }, { passive: true });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(() => syncSimulatedStatusBarMetrics())).catch(() => {});
    }

    function syncStatusBarAfterReturnHome() {
        requestAnimationFrame(applyStatusBarVisibility);
    }
    window.syncStatusBarAfterReturnHome = syncStatusBarAfterReturnHome;

    window.addEventListener('pageshow', syncStatusBarAfterReturnHome);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) syncStatusBarAfterReturnHome();
    });

    function toggleStatusBarVisibility() {
        appSettings.simulatedStatusBarVisible = !isStatusBarVisible();
        saveAppSettings();
        applyStatusBarVisibility();
    }

    let pressTimer = null;
    let pendingDrag = null;
    let currentHoverApp = null;
    let startX = 0, startY = 0;
    let draggedApp = null;
    let dragGhost = null;
    let offsetX = 0, offsetY = 0;
    let dragOrigin = null;
    let dragEdgeTimer = null;
    let dragEdgeDirection = 0;
    let dragPointerX = null;
    let dragPointerY = null;
    let dragGhostFrame = null;
    let dragGhostX = 0;
    let dragGhostY = 0;
    let dragGhostScale = 1;
    let dragGridRect = null;
    let desktopSwipeState = null;
    let desktopSwipeRafId = null;
    let desktopSwipeSettleTimer = null;

    function captureDesktopSwipePointer(event) {
        const target = event && event.target;
        if (!target || typeof target.setPointerCapture !== 'function') return null;
        try {
            target.setPointerCapture(event.pointerId);
            return target;
        } catch (error) {
            return null;
        }
    }

    function releaseDesktopSwipePointerCapture(state) {
        const target = state && state.captureTarget;
        const pointerId = state && state.pointerId;
        if (!target || pointerId == null || typeof target.releasePointerCapture !== 'function') return;
        try {
            if (typeof target.hasPointerCapture !== 'function' || target.hasPointerCapture(pointerId)) {
                target.releasePointerCapture(pointerId);
            }
        } catch (error) {
            // The browser may already have released capture after pointercancel.
        }
    }

    function clearDesktopSwipeState(resetOffset = false) {
        const state = desktopSwipeState;
        if (resetOffset) resetDesktopSwipeOffset(state);
        desktopSwipeState = null;
        releaseDesktopSwipePointerCapture(state);
    }

    function getDesktopGridElement() {
        return document.getElementById('desktopGrid');
    }

    function canStartDesktopSwipeFromTarget(target) {
        if (!target || !target.closest('#desktopGrid')) return false;
        if (isEditMode && target.closest('.app-item')) return false;
        if (target.closest('.app-delete-btn') || target.closest('.widget-edit-hotzone')) return false;
        return true;
    }

    function getDesktopSwipeDamping(deltaX, containerWidth) {
        const isBlockedAtStart = currentDesktopPage <= 0 && deltaX > 0;
        const isBlockedAtEnd = currentDesktopPage >= desktopPages.length - 1 && deltaX < 0;
        if (!isBlockedAtStart && !isBlockedAtEnd) return deltaX;
        const width = containerWidth || 375;
        const absDelta = Math.abs(deltaX);
        const damped = (absDelta * 0.45) / (1 + (absDelta * 0.45) / (width * 0.65));
        return deltaX > 0 ? damped : -damped;
    }

    function renderDesktopSwipeTransform() {
        desktopSwipeRafId = null;
        const state = desktopSwipeState;
        if (!state || !state.isTracking) return;
        const desktopGrid = getDesktopGridElement();
        if (!desktopGrid) return;
        const delta = getDesktopSwipeDamping(state.currentDeltaX, state.gridWidth);
        desktopGrid.style.transform = `translate3d(${state.startOffsetPx + delta}px, 0, 0)`;
    }

    function scheduleDesktopSwipeTransform() {
        if (!desktopSwipeRafId) {
            desktopSwipeRafId = requestAnimationFrame(renderDesktopSwipeTransform);
        }
    }

    function updateDesktopSwipeGesture(clientX, clientY) {
        const state = desktopSwipeState;
        if (!state) return;
        const now = performance.now();
        const dt = now - state.lastTime;
        if (dt > 8) {
            state.velocityX = (clientX - state.lastX) / state.coordinateScale / dt;
            state.lastX = clientX;
            state.lastTime = now;
        }

        const deltaX = (clientX - state.startX) / state.coordinateScale;
        const deltaY = (clientY - state.startY) / state.coordinateScale;
        state.currentDeltaX = deltaX;
        state.currentDeltaY = deltaY;

        if (!state.isTracking) {
            if (Math.abs(deltaX) <= 6 || Math.abs(deltaX) <= Math.abs(deltaY) * 0.95) return;
            state.isTracking = true;
            const desktopGrid = getDesktopGridElement();
            if (desktopGrid) {
                // Freeze the current visual position when a second swipe interrupts settling.
                const visualTransform = getComputedStyle(desktopGrid).transform;
                let visualX = -currentDesktopPage * state.gridWidth;
                try {
                    const Matrix = window.DOMMatrixReadOnly || window.DOMMatrix || window.WebKitCSSMatrix;
                    if (Matrix && visualTransform !== 'none') {
                        const measuredX = new Matrix(visualTransform).m41;
                        if (Number.isFinite(measuredX)) visualX = measuredX;
                    }
                } catch (_) {}
                state.startOffsetPx = visualX;
                clearTimeout(desktopSwipeSettleTimer);
                desktopSwipeSettleTimer = null;
                desktopGrid.classList.add('is-swiping');
                desktopGrid.classList.remove('is-settling');
                desktopGrid.style.transform = `translate3d(${visualX}px, 0, 0)`;
            }
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        }
        scheduleDesktopSwipeTransform();
    }

    function settleDesktopSwipeToPage(pageIndex, state = desktopSwipeState) {
        if (desktopSwipeRafId) {
            cancelAnimationFrame(desktopSwipeRafId);
            desktopSwipeRafId = null;
        }
        const desktopGrid = getDesktopGridElement();
        if (!desktopGrid) return;
        if (state && state.isTracking) {
            // Flush the final finger position once before re-enabling the transition.
            const delta = getDesktopSwipeDamping(state.currentDeltaX, state.gridWidth);
            desktopGrid.classList.add('is-swiping');
            desktopGrid.style.transform = `translate3d(${state.startOffsetPx + delta}px, 0, 0)`;
            getComputedStyle(desktopGrid).transform;
        }
        desktopGrid.classList.remove('is-swiping');
        desktopGrid.classList.add('is-settling');
        desktopGrid.style.removeProperty('transition');
        desktopGrid.style.transform = `translate3d(-${pageIndex * 100}%, 0, 0)`;
        clearTimeout(desktopSwipeSettleTimer);
        desktopSwipeSettleTimer = setTimeout(() => {
            desktopSwipeSettleTimer = null;
            desktopGrid.classList.remove('is-settling');
        }, 360);
    }

    function resetDesktopSwipeOffset(state = desktopSwipeState) {
        settleDesktopSwipeToPage(currentDesktopPage, state);
    }

    function setDragGhostPosition(clientX, clientY) {
        dragGhostX = clientX - offsetX;
        dragGhostY = clientY - offsetY;
        if (dragGhostFrame) return;
        dragGhostFrame = requestAnimationFrame(() => {
            dragGhostFrame = null;
            if (!dragGhost) return;
            dragGhost.style.transform = getDragGhostTransform(dragGhostX, dragGhostY);
        });
    }

    function getDragGhostTransform(x, y) {
        // The ghost lives outside the scaled shell, so retain its visual size.
        const liftX = dragGhost.offsetWidth * dragGhostScale * 0.075;
        const liftY = dragGhost.offsetHeight * dragGhostScale * 0.075;
        return `translate3d(${x - liftX}px, ${y - liftY}px, 0) scale(${1.15 * dragGhostScale})`;
    }

    function cancelDragGhostFrame() {
        if (dragGhostFrame) cancelAnimationFrame(dragGhostFrame);
        dragGhostFrame = null;
    }

    function finishDesktopSwipe(deltaX, deltaY, velocityX = 0) {
        const desktopGrid = getDesktopGridElement();
        if (!desktopGrid) return false;

        const containerWidth = desktopSwipeState?.gridWidth || desktopGrid.clientWidth || 375;
        const swipeThreshold = Math.min(containerWidth * 0.22, 80);
        const isHorizontal = Math.abs(deltaX) > 8 && (Math.abs(deltaX) > Math.abs(deltaY) * 1.05 || Math.abs(velocityX) > 0.32);

        let targetPage = currentDesktopPage;
        if (isHorizontal) {
            if ((deltaX < -swipeThreshold || velocityX < -0.32) && currentDesktopPage < desktopPages.length - 1) {
                targetPage = currentDesktopPage + 1;
            } else if ((deltaX > swipeThreshold || velocityX > 0.32) && currentDesktopPage > 0) {
                targetPage = currentDesktopPage - 1;
            }
        }

        settleDesktopSwipeToPage(targetPage);

        const changed = targetPage !== currentDesktopPage;
        if (changed) {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
            currentDesktopPage = targetPage;
            ensureDesktopPageElement(currentDesktopPage, desktopPages[currentDesktopPage]);
            desktopGrid.querySelectorAll(':scope > .desktop-page').forEach(page => {
                const isActive = Number(page.dataset.pageIndex) === currentDesktopPage;
                page.classList.toggle('active', isActive);
            });
            renderDesktopPageControls();
            if (typeof window.saveDesktopViewState === 'function') window.saveDesktopViewState(currentDesktopPage);
        }

        // Consume only the gesture that actually became a horizontal swipe.
        // Never block the next independent tap with a global time window.
        return changed || (isHorizontal && Math.abs(deltaX) > 12);
    }

    function enterEditMode() {
        if (isEditMode) return;
        pinWebViewDockForEditing();
        isEditMode = true;
        if (desktopShell) desktopShell.classList.add('desktop-editing');
        statusBar.style.opacity = '0';
        statusBar.style.visibility = 'hidden';
        editPlus.style.display = 'flex';
        editDone.style.display = 'block';

            // show three-dots button; click to expand vertical capsule menu
        document.querySelectorAll('.desktop-slot').forEach(slot => slot.classList.add('show-grid'));
        document.querySelectorAll('#desktopGrid .app-item, #folderGrid .app-item').forEach(app => app.classList.add('jiggling'));
        syncDesktopWidgetEditState();
        renderDesktopPageControls();
    }

            window.deleteDesktopApp = function(btn, e) {
            e.stopPropagation();
            e.preventDefault();
            const appItem = btn.closest('.app-item');
            if (appItem && appItem.classList.contains('is-widget')) {
                appItem.remove();
                rebuildDesktopWidgetOccupancy();
                if (typeof window.saveLayout === 'function') {
                    window.saveLayout();
                }
                renderDesktopPageControls();
            }
        };

    function exitEditMode() {
        isEditMode = false;
        if (desktopShell) desktopShell.classList.remove('desktop-editing');
        restoreWebViewDockAfterEditing();
        applyStatusBarVisibility();
        editPlus.style.display = 'none';
        editDone.style.display = 'none';
        
            // show three-dots button; click to expand vertical capsule menu
        document.querySelectorAll('.desktop-slot').forEach(slot => slot.classList.remove('show-grid'));
        document.querySelectorAll('#desktopGrid .app-item, #folderGrid .app-item').forEach(app => app.classList.remove('jiggling'));
        syncDesktopWidgetEditState();
        renderDesktopPageControls();
        
            // show three-dots button; click to expand vertical capsule menu
        saveLayout();
        scheduleDesktopViewportReflow();
    }

    editDone.addEventListener('click', exitEditMode);
    
    let currentWidgetPickerTab = 'all';

    window.closeWidgetPicker = function() {
        document.getElementById('widgetPickerOverlay').classList.remove('show');
    };

    window.switchWidgetPickerTab = function(tab, element) {
        currentWidgetPickerTab = tab;
        document.querySelectorAll('.widget-picker-tab').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        renderWidgetPickerList();
    };

    function renderWidgetPickerList() {
        const list = document.getElementById('widgetPickerList');
        list.innerHTML = '';
        
        // 获取所有组件（官方 + 自定义）
        const allWidgets = [...(window.officialWidgets || []), ...(window.customWidgets || [])];
        
        // 根据 Tab 过滤
        const filteredWidgets = allWidgets.filter(widget => {
            const size = widget.presetSize || '';
            if (currentWidgetPickerTab === 'all') return true;
            if (currentWidgetPickerTab === 'large') return size === '4x4' || size === '4x3'; // 4x3 算作大尺寸
            if (currentWidgetPickerTab === 'medium') return size === '4x2';
            if (currentWidgetPickerTab === 'small') return size === '2x2';
            if (currentWidgetPickerTab === 'custom') return size !== '4x4' && size !== '4x3' && size !== '4x2' && size !== '2x2';
            return true;
        });

        if (filteredWidgets.length === 0) {
            list.innerHTML = '<div style="color: #8e8e93; text-align: center; margin-top: 40px; font-size: 14px;">该分类下暂无小组件</div>';
            return;
        }

        filteredWidgets.forEach(widget => {
            const card = document.createElement('div');
            card.className = 'widget-picker-card';
            
            // 预览区域
            const previewBox = document.createElement('div');
            previewBox.className = 'widget-picker-preview-box';
            
            // 生成 iframe 预览 (复用原有逻辑，但放大显示)
            const widgetContent = window.normalizeStoredWidgetContent ? window.normalizeStoredWidgetContent(widget.content || '') : (widget.content || '');
            const dims = window.getWidgetDimensions ? window.getWidgetDimensions(widget) : { width: 140, height: 140 };
            
            // 计算缩放比例，使其完美适应 180px 高度的预览框
            const scale = Math.min(260 / dims.width, 160 / dims.height);
            
            const frame = document.createElement('iframe');
            frame.className = 'widget-render-frame';
            frame.setAttribute('sandbox', 'allow-scripts');
            frame.style.cssText = `width: ${dims.width}px; height: ${dims.height}px; border: 0; background: transparent; transform-origin: center; pointer-events: none; transform: scale(${scale});`;
            frame.srcdoc = window.buildWidgetFrameSrcdoc ? window.buildWidgetFrameSrcdoc(widgetContent) : widgetContent;
            
            previewBox.appendChild(frame);
            
            // 信息区域
            const infoBox = document.createElement('div');
            infoBox.className = 'widget-picker-info';
            
            const textBox = document.createElement('div');
            textBox.className = 'widget-picker-text';
            textBox.innerHTML = `
                <h3>${widget.name || '未命名组件'}</h3>
                <div class="widget-picker-badge">${window.formatWidgetSizeLabel ? window.formatWidgetSizeLabel(widget) : '自定义'}</div>
            `;
            
            const addBtn = document.createElement('button');
            addBtn.className = 'widget-picker-add-btn';
            addBtn.innerText = '+ 添加';
            addBtn.onclick = () => {
                // Capture the destination before closing the shared picker.
                // Closing it may clear the active target before the delayed add.
                const targetCharphone = !!window.charphoneWidgetTargetActive && typeof window.charphoneAddWidget === 'function';
                const addToCharphone = targetCharphone ? window.charphoneAddWidget : null;
                closeWidgetPicker();
                setTimeout(() => {
                    if (addToCharphone) addToCharphone(widget);
                    else addDesktopWidget(widget);
                }, 300);
            };
            
            infoBox.appendChild(textBox);
            infoBox.appendChild(addBtn);
            
            card.appendChild(previewBox);
            card.appendChild(infoBox);
            list.appendChild(card);
        });
    }

    editPlus.addEventListener('click', () => {
        // 重置为全部 Tab
        currentWidgetPickerTab = 'all';
        document.querySelectorAll('.widget-picker-tab').forEach((el, index) => {
            el.classList.toggle('active', index === 0);
        });
        
        renderWidgetPickerList();
        document.getElementById('widgetPickerOverlay').classList.add('show');
    });

    function forwardEditTouchTarget(event, control) {
        event.preventDefault();
        event.stopPropagation();
        control.click();
    }

    let editPlusTouchHandledAt = 0;

    function handleEditPlusTouchTarget(event) {
        const now = Date.now();
        if (now - editPlusTouchHandledAt < 700) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        editPlusTouchHandledAt = now;
        forwardEditTouchTarget(event, editPlus);
    }

    editPlusTouchTarget.addEventListener('pointerup', handleEditPlusTouchTarget);
    editPlusTouchTarget.addEventListener('touchend', handleEditPlusTouchTarget, { passive: false });
    editPlusTouchTarget.addEventListener('click', handleEditPlusTouchTarget);
    editDoneTouchTarget.addEventListener('click', (event) => {
        forwardEditTouchTarget(event, editDone);
    });


    let contactsAppLoadPromise = null;

    function loadContactsAppScript() {
        if (window.ContactsApp) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('contactsAppScript');
            if (existingScript) {
                existingScript.addEventListener('load', resolve, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('联系人脚本加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'contactsAppScript';
            script.src = 'js/contacts.js?v=20260806-render-consistency-v1';
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('联系人脚本加载失败'));
            };
            document.body.appendChild(script);
        });
    }

    function loadContactsApp() {
        if (window.ContactsApp && document.getElementById('contactsAppUI')) {
            return Promise.resolve(window.ContactsApp);
        }
        if (contactsAppLoadPromise) return contactsAppLoadPromise;

        contactsAppLoadPromise = (async () => {
            const container = document.getElementById('contactsAppUI');
            if (!container) throw new Error('主页面中未找到联系人页面结构');

            await loadContactsAppScript();
            if (!window.ContactsApp) throw new Error('联系人模块未正确初始化');
            await window.ContactsApp.init(container);
            return window.ContactsApp;
        })().catch(error => {
            contactsAppLoadPromise = null;
            throw error;
        });

        return contactsAppLoadPromise;
    }
    window.loadContactsApp = loadContactsApp;

    function showContactsLaunchCover() {
        const shell = document.querySelector('.iphone') || document.body;
        const existing = document.getElementById('contactsAppLaunchCover');
        if (existing) return existing;
        const cover = document.createElement('div');
        cover.id = 'contactsAppLaunchCover';
        cover.setAttribute('aria-hidden', 'true');
        cover.style.cssText = 'position:absolute;inset:0;z-index:7199;background:#F2F2F7;pointer-events:auto;';
        shell.appendChild(cover);
        return cover;
    }

    function openContactsApp() {
        if (window.ContactsApp && typeof window.ContactsApp.open === 'function') {
            window.ContactsApp.open();
            return;
        }
        const launchCover = showContactsLaunchCover();
        loadContactsApp()
            .then(app => {
                app.open();
                requestAnimationFrame(() => launchCover.remove());
            })
            .catch(error => {
                launchCover.remove();
                console.error('Contacts app could not be opened:', error);
                if (typeof showCustomAlert === 'function') {
                    showCustomAlert('加载失败', '联系人页面暂时无法打开，请稍后重试。');
                } else {
                    alert('联系人页面暂时无法打开，请稍后重试。');
                }
            });
    }
    window.openContactsApp = openContactsApp;

    let memoryAppLoadPromise = null;

    function loadMemoryAppScript() {
        if (window.MemoryApp) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('memoryAppScript');
            if (existingScript) {
                existingScript.addEventListener('load', resolve, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('记忆加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'memoryAppScript';
            script.src = 'js/memory.js?v=20261004-memory-trace-ui-v10';
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('记忆加载失败'));
            };
            document.body.appendChild(script);
        });
    }

    function loadMemoryApp() {
        if (window.MemoryApp) return Promise.resolve(window.MemoryApp);
        if (memoryAppLoadPromise) return memoryAppLoadPromise;

        memoryAppLoadPromise = loadMemoryAppScript()
            .then(() => {
                if (!window.MemoryApp) throw new Error('记忆模块未正确初始化');
                return window.MemoryApp.init().then(() => {
                    window.dispatchEvent(new Event('tonghuaji:memory-app-ready'));
                    return window.MemoryApp;
                });
            })
            .catch(error => {
                memoryAppLoadPromise = null;
                throw error;
            });

        return memoryAppLoadPromise;
    }
    window.loadMemoryApp = loadMemoryApp;

    function showMemoryLaunchCover() {
        const shell = document.querySelector('.iphone') || document.body;
        const existing = document.getElementById('memoryAppLaunchCover');
        if (existing) return existing;
        const cover = document.createElement('div');
        cover.id = 'memoryAppLaunchCover';
        cover.setAttribute('aria-hidden', 'true');
        cover.style.cssText = 'position:absolute;inset:0;z-index:7199;background:#fff;pointer-events:auto;';
        shell.appendChild(cover);
        return cover;
    }

    function openMemoryApp() {
        if (window.MemoryApp && typeof window.MemoryApp.open === 'function') {
            window.MemoryApp.open();
            return;
        }
        const launchCover = showMemoryLaunchCover();
        loadMemoryApp()
            .then(app => {
                app.open();
                requestAnimationFrame(() => launchCover.remove());
            })
            .catch(error => {
                launchCover.remove();
                console.error('Memory app could not be opened:', error);
                if (typeof showCustomAlert === 'function') {
                    showCustomAlert('加载失败', '记忆页面暂时无法打开，请稍后重试。');
                } else {
                    alert('记忆页面暂时无法打开，请稍后重试。');
                }
            });
    }
    window.openMemoryApp = openMemoryApp;

    function openMcpApp() {
        if (window.McpApp && typeof window.McpApp.open === 'function') window.McpApp.open();
        else if (typeof showCustomAlert === 'function') showCustomAlert('加载失败', 'MCP 页面暂时无法打开，请稍后重试。');
    }
    window.openMcpApp = openMcpApp;

    let readenAppLoadPromise = null;
    function loadReadenAppScript() {
        if (window.ReadenApp) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('readenAppScript');
            if (existingScript) {
                existingScript.addEventListener('load', resolve, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('阅读加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'readenAppScript';
            script.src = 'js/readen-app.js?v=20261026-readen-page-turn-v1';
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('阅读加载失败'));
            };
            document.body.appendChild(script);
        });
    }

    // True only after ReadenApp.init() finished; the script can be evaluated while init is still running.
    let readenAppReady = false;

    function loadReadenApp() {
        if (readenAppReady && window.ReadenApp) return Promise.resolve(window.ReadenApp);
        if (readenAppLoadPromise) return readenAppLoadPromise;

        readenAppLoadPromise = loadReadenAppScript()
            .then(() => {
                if (!window.ReadenApp) throw new Error('阅读模块未正确初始化');
                return window.ReadenApp.init().then(() => {
                    readenAppReady = true;
                    return window.ReadenApp;
                });
            })
            .catch(error => {
                readenAppLoadPromise = null;
                throw error;
            });

        return readenAppLoadPromise;
    }
    window.loadReadenApp = loadReadenApp;

    function showReadenLaunchCover() {
        const shell = document.querySelector('.iphone') || document.body;
        const existing = document.getElementById('readenAppLaunchCover');
        if (existing) return existing;
        const cover = document.createElement('div');
        cover.id = 'readenAppLaunchCover';
        cover.setAttribute('aria-hidden', 'true');
        cover.style.cssText = 'position:absolute;inset:0;z-index:7199;background:#f4f5f7;pointer-events:auto;';
        shell.appendChild(cover);
        return cover;
    }

    function openReadenApp() {
        if (readenAppReady && window.ReadenApp && typeof window.ReadenApp.open === 'function') {
            window.ReadenApp.open();
            return;
        }
        const launchCover = showReadenLaunchCover();
        loadReadenApp()
            .then(app => {
                app.open();
                requestAnimationFrame(() => launchCover.remove());
            })
            .catch(error => {
                launchCover.remove();
                console.error('Readen app could not be opened:', error);
                const errorDetail = error?.message ? `错误信息：${error.message}` : '请刷新后重试。';
                if (typeof showCustomAlert === 'function') {
                    showCustomAlert('加载失败', `阅读页面暂时无法打开。${errorDetail}`);
                } else {
                    alert(`阅读页面暂时无法打开。${errorDetail}`);
                }
            });
    }
    window.openReadenApp = openReadenApp;

    // The reading app is a large script loaded on demand, and the service worker does not cache
    // scripts, so the first tap used to wait for the whole download. Prepare it in idle time after
    // start-up instead; a tap during the preload simply waits for the same promise.
    function scheduleReadenAppPreload() {
        if (navigator.connection && navigator.connection.saveData) return;
        const startPreload = () => {
            if (readenAppReady || readenAppLoadPromise) return;
            if (document.hidden) {
                document.addEventListener('visibilitychange', startPreload, { once: true });
                return;
            }
            loadReadenApp().catch(error => console.warn('Readen preload skipped:', error));
        };
        setTimeout(() => {
            if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(startPreload, { timeout: 5000 });
            else startPreload();
        }, 5000);
    }
    scheduleReadenAppPreload();

    let messageAppLoadPromise = null;

    function loadMessageAppScript() {
        if (window.MessageApp) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById('messageAppScript');
            if (existingScript) {
                existingScript.addEventListener('load', resolve, { once: true });
                existingScript.addEventListener('error', () => reject(new Error('信息加载失败')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'messageAppScript';
            script.src = 'js/message-app.js?v=20261004-cross-app-recall-v3';
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('信息加载失败'));
            };
            document.body.appendChild(script);
        });
    }

    function loadMessageApp() {
        if (window.MessageApp) {
            return window.MessageApp.init().then(() => window.MessageApp);
        }
        if (messageAppLoadPromise) return messageAppLoadPromise;

        messageAppLoadPromise = loadMessageAppScript()
            .then(() => {
                if (!window.MessageApp) throw new Error('信息模块未正确初始化');
                return window.MessageApp.init().then(() => window.MessageApp);
            })
            .catch(error => {
                messageAppLoadPromise = null;
                throw error;
            });

        return messageAppLoadPromise;
    }
    window.loadMessageApp = loadMessageApp;

    function showMessageLaunchCover() {
        const shell = document.querySelector('.iphone') || document.body;
        const existing = document.getElementById('messageAppLaunchCover');
        if (existing) return existing;
        const cover = document.createElement('div');
        cover.id = 'messageAppLaunchCover';
        cover.setAttribute('aria-hidden', 'true');
        cover.style.cssText = 'position:absolute;inset:0;z-index:7199;background:#ffffff;pointer-events:auto;';
        shell.appendChild(cover);
        return cover;
    }

    function openMessageApp() {
        const launchCover = showMessageLaunchCover();
        loadMessageApp()
            .then(app => {
                app.open();
                requestAnimationFrame(() => launchCover.remove());
            })
            .catch(error => {
                launchCover.remove();
                console.error('Message app could not be opened:', error);
                if (typeof showCustomAlert === 'function') {
                    showCustomAlert('加载失败', '信息页面暂时无法打开，请稍后重试。');
                } else {
                    alert('信息页面暂时无法打开，请稍后重试。');
                }
            });
    }
    window.openMessageApp = openMessageApp;

    function openCallApp() {
        if (window.CallApp && typeof window.CallApp.open === 'function') {
            window.CallApp.open();
        } else if (typeof showCustomAlert === 'function') {
            showCustomAlert('加载失败', '电话页面暂时无法打开，请稍后重试。');
        }
    }
    window.openCallApp = openCallApp;

    function openTwitterApp() {
        if (window.TwitterApp && typeof window.TwitterApp.open === 'function') {
            window.TwitterApp.open();
        } else if (typeof showCustomAlert === 'function') {
            showCustomAlert('加载失败', 'Twitter 页面暂时无法打开，请稍后重试。');
        }
    }
    window.openTwitterApp = openTwitterApp;

    const desktopWidgetFrameCache = new WeakMap();

    function findDesktopWidgetFrame(sourceWindow) {
        if (!sourceWindow) return null;
        const cachedFrame = desktopWidgetFrameCache.get(sourceWindow);
        if (cachedFrame && cachedFrame.isConnected && cachedFrame.contentWindow === sourceWindow) {
            return cachedFrame;
        }
        const frames = document.querySelectorAll('#desktopGrid .app-item.is-widget .widget-render-frame');
        for (const frame of frames) {
            if (frame.contentWindow === sourceWindow) {
                desktopWidgetFrameCache.set(sourceWindow, frame);
                return frame;
            }
        }
        return null;
    }

    function syncDesktopWidgetEditState() {
        document.querySelectorAll('#desktopGrid .app-item.is-widget .widget-render-frame').forEach(frame => {
            frame.contentWindow?.postMessage({ type: 'widget-desktop-edit-state', editing: isEditMode }, '*');
        });
    }

    function getDesktopWidgetPointerPosition(frame, message) {
        // Use screen coordinates to avoid reading a moving iframe on each gesture event.
        if (Number.isFinite(message.screenX) && Number.isFinite(message.screenY)) {
            return { x: message.screenX, y: message.screenY };
        }
        // Retain the existing coordinate mapping for legacy widget messages.
        const rect = frame.getBoundingClientRect();
        const scaleX = frame.clientWidth ? rect.width / frame.clientWidth : 1;
        const scaleY = frame.clientHeight ? rect.height / frame.clientHeight : 1;
        return {
            x: rect.left + Number(message.clientX || 0) * scaleX,
            y: rect.top + Number(message.clientY || 0) * scaleY
        };
    }

    let pressedWidgetFrame = null;
    let pressedWidgetApp = null;
    let pressedWidgetPointerId = null;

    function applyDesktopWidgetImage(frame, app, target, imageData) {
        if (!frame.isConnected || !app.isConnected || !app.contains(frame)) return false;
        if (!target || typeof imageData !== 'string' || !imageData || typeof window.replaceWidgetImageContent !== 'function') return false;
        const currentContent = normalizeStoredWidgetContent(app.getAttribute('data-widget-content') || '');
        const updatedContent = window.replaceWidgetImageContent(currentContent, target, imageData);
        if (updatedContent == null) {
            if (typeof window.showToast === 'function') window.showToast('未能定位这张图片');
            return false;
        }
        app.setAttribute('data-widget-content', encodeURIComponent(updatedContent));
        frame.contentWindow?.postMessage({ type: 'widget-image-update', target, imageUrl: imageData }, '*');
        saveLayout();
        if (typeof window.showToast === 'function') window.showToast('组件图片已替换');
        return true;
    }

    window.addEventListener('message', async event => {
        const message = event.data;
        if (!message || (message.type !== 'widget-desktop-pointer' && message.type !== 'widget-desktop-swipe' && message.type !== 'widget-desktop-image-pick' && message.type !== 'widget-desktop-image-file' && message.type !== 'widget-desktop-content' && message.type !== 'widget-desktop-edit-state-request')) return;

        const frame = findDesktopWidgetFrame(event.source);
        if (!frame) return;
        const app = frame.closest('.app-item.is-widget');
        if (!app) return;

        if (message.type === 'widget-desktop-edit-state-request') {
            frame.contentWindow?.postMessage({ type: 'widget-desktop-edit-state', editing: isEditMode }, '*');
            return;
        }

        if (message.type === 'widget-desktop-image-pick') {
            if (!message.target || !['img', 'image', 'uploadable', 'background'].includes(message.target.kind)) return;
            if (typeof window.openWidgetImageMenu !== 'function') return;
            const rect = frame.getBoundingClientRect();
            const x = Number(message.clientX);
            const y = Number(message.clientY);
            const hasPosition = message.clientX != null && message.clientY != null && Number.isFinite(x) && Number.isFinite(y);
            const anchor = hasPosition ? {
                getBoundingClientRect() {
                    const left = Math.max(rect.left, Math.min(rect.right, rect.left + x * rect.width / (frame.clientWidth || rect.width || 1)));
                    const top = Math.max(rect.top, Math.min(rect.bottom, rect.top + y * rect.height / (frame.clientHeight || rect.height || 1)));
                    return { left, right: left, top, bottom: top };
                }
            } : frame;
            window.openWidgetImageMenu(anchor, imageUrl => applyDesktopWidgetImage(frame, app, message.target, imageUrl));
            return;
        }

        if (message.type === 'widget-desktop-swipe') {
            handleDesktopWidgetSwipe(frame, message);
            return;
        }

        if (message.type === 'widget-desktop-pointer') {
            if (message.phase === 'down') {
                frame.contentWindow?.postMessage({ type: 'widget-desktop-edit-state', editing: isEditMode }, '*');
            }
            const position = getDesktopWidgetPointerPosition(frame, message);
            if (message.phase === 'down' && !isEditMode) {
                if (pressTimer) clearTimeout(pressTimer);
                if (desktopSwipeState) clearDesktopSwipeState(desktopSwipeState.isTracking === true);
                startX = position.x;
                startY = position.y;
                pressedWidgetFrame = frame;
                pressedWidgetApp = app;
                pressedWidgetPointerId = message.pointerId;
                const now = performance.now();
                desktopSwipeState = {
                    pointerId: message.pointerId,
                    startX: position.x,
                    startY: position.y,
                    lastX: position.x,
                    lastTime: now,
                    velocityX: 0,
                    currentDeltaX: 0,
                    currentDeltaY: 0,
                    isTracking: false,
                    gridWidth: getDesktopGridElement()?.clientWidth || 375,
                    coordinateScale: getDesktopShellScale(),
                    startOffsetPx: -currentDesktopPage * (getDesktopGridElement()?.clientWidth || 375)
                };
                pressTimer = setTimeout(() => {
                    pressTimer = null;
                    if (pressedWidgetFrame === frame && pressedWidgetApp === app) enterEditMode();
                }, 600);
            } else if (message.phase === 'move' && pressedWidgetFrame === frame) {
                if (desktopSwipeState && desktopSwipeState.pointerId === pressedWidgetPointerId) {
                    updateDesktopSwipeGesture(position.x, position.y);
                }
                if (pressTimer && (Math.abs(position.x - startX) > 10 || Math.abs(position.y - startY) > 10)) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            } else if ((message.phase === 'up' || message.phase === 'cancel') && pressedWidgetFrame === frame) {
                if (message.phase === 'up' && desktopSwipeState && desktopSwipeState.pointerId === pressedWidgetPointerId) {
                    updateDesktopSwipeGesture(position.x, position.y);
                    const state = desktopSwipeState;
                    const velocityX = performance.now() - state.lastTime < 100 ? state.velocityX : 0;
                    finishDesktopSwipe(state.currentDeltaX, state.currentDeltaY, velocityX);
                } else if (message.phase === 'cancel') {
                    resetDesktopSwipeOffset();
                }
                clearDesktopSwipeState(false);
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
                pressedWidgetFrame = null;
                pressedWidgetApp = null;
                pressedWidgetPointerId = null;
            }
            return;
        }

        if (message.type === 'widget-desktop-content') {
            if (typeof message.html !== 'string' || !message.target || typeof window.replaceWidgetEditableContent !== 'function') return;

            if (message.phase === 'focus') beginDesktopWidgetTextEditing();

            const currentContent = normalizeStoredWidgetContent(app.getAttribute('data-widget-content') || '');
            const updatedContent = window.replaceWidgetEditableContent(currentContent, message.target, message.html);
            if (updatedContent == null) return;

            app.setAttribute('data-widget-content', encodeURIComponent(updatedContent));
            if (message.phase === 'blur') {
                saveLayout();
                endDesktopWidgetTextEditing();
            }
            return;
        }

        const isImageFilePayload = typeof window.isWidgetImageFilePayload === 'function'
            ? window.isWidgetImageFilePayload(message.file)
            : Boolean(message.file && typeof message.file === 'object'
                && typeof message.file.type === 'string'
                && typeof message.file.size === 'number');
        if (!isImageFilePayload) return;
        if (typeof window.prepareWidgetImageData !== 'function' || typeof window.replaceWidgetImageContent !== 'function') return;

        try {
            const imageData = await window.prepareWidgetImageData(message.file);
            applyDesktopWidgetImage(frame, app, message.target, imageData);
        } catch (error) {
            console.error('Desktop widget image replacement failed:', error);
            if (typeof window.showToast === 'function') window.showToast('图片读取失败');
        }
    });

    function handleDesktopWidgetSwipe(frame, message) {
        if (isEditMode || !frame) return;
        const deltaX = Number(message.deltaX) || 0;
        const deltaY = Number(message.deltaY) || 0;
        const velocityX = Number(message.velocityX) || 0;
        if (!finishDesktopSwipe(deltaX, deltaY, velocityX)) return;
        pressedWidgetFrame = null;
        pressedWidgetApp = null;
    }

    document.addEventListener('pointerdown', (e) => {
        if (e.isPrimary === false || (desktopSwipeState && desktopSwipeState.pointerId !== e.pointerId)) return;
        const app = e.target.closest('.app-item');
        const desktopGrid = e.target.closest('#desktopGrid');

        if (desktopSwipeState) clearDesktopSwipeState(desktopSwipeState.isTracking === true);

        if (canStartDesktopSwipeFromTarget(e.target)) {
            const now = performance.now();
            const gridWidth = desktopGrid?.clientWidth || 375;
            desktopSwipeState = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                lastX: e.clientX,
                lastTime: now,
                velocityX: 0,
                currentDeltaX: 0,
                currentDeltaY: 0,
                isTracking: false,
                gridWidth,
                coordinateScale: getDesktopShellScale(),
                startOffsetPx: -currentDesktopPage * gridWidth,
                captureTarget: captureDesktopSwipePointer(e)
            };
        }

        if (!isEditMode) {
            if (!app) return;
            startX = e.clientX;
            startY = e.clientY;
            pressTimer = setTimeout(() => {
                enterEditMode();
            }, 600);
        } else {
            if (!app) return;
            e.preventDefault();
            pendingDrag = {
                app: app,
                startX: e.clientX,
                startY: e.clientY,
                pointerId: e.pointerId
            };
        }
    });

    function startDrag(app, e) {
        draggedApp = app;
        try { if (app.setPointerCapture) app.setPointerCapture(e.pointerId); } catch (error) {}
        const parent = app.parentNode;
        dragOrigin = {
            page: currentDesktopPage,
            inDock: parent && parent.id === 'dock',
            inFolder: parent && parent.id === 'folderGrid',
            index: parent && parent.classList.contains('desktop-slot')
                ? getCurrentDesktopSlots().indexOf(parent)
                : Array.from(parent.children).indexOf(app)
        };

        const rect = app.getBoundingClientRect();
        dragGhostScale = getDesktopShellScale();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        dragGhost = app.cloneNode(true);
        dragGhost.style.position = 'fixed';
        dragGhost.style.left = '0px';
        dragGhost.style.top = '0px';
        dragGhost.style.width = rect.width / dragGhostScale + 'px';
        dragGhost.style.height = rect.height / dragGhostScale + 'px';
        dragGhost.style.opacity = '0.8';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.zIndex = '1000';
        dragGhost.style.transformOrigin = 'top left';
        dragGhost.style.willChange = 'transform';
        dragGhost.style.transition = 'none';
        dragGhost.style.backfaceVisibility = 'hidden';
        dragGhost.style.contain = 'layout paint style';
        dragGhost.classList.remove('jiggling');
        dragGhost.classList.add('desktop-drag-ghost');
        dragGhost.querySelectorAll('iframe').forEach(frame => { frame.style.pointerEvents = 'none'; });
        document.body.appendChild(dragGhost);
        dragGhost.style.transform = getDragGhostTransform(rect.left, rect.top);
        dragGridRect = document.getElementById('desktopGrid') ? document.getElementById('desktopGrid').getBoundingClientRect() : null;
        dragPointerX = e.clientX;
        dragPointerY = e.clientY;

        app.style.opacity = '0';
        
        if (dragOrigin.inFolder) {
            const overlay = document.getElementById('folderOverlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }
    }

    document.addEventListener('pointermove', (e) => {
        if (desktopSwipeState && desktopSwipeState.pointerId === e.pointerId && !dragGhost) {
            updateDesktopSwipeGesture(e.clientX, e.clientY);
        }

        if (!isEditMode) {
            if (pressTimer && (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10)) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        } else {
            if (pendingDrag) {
                const dx = e.clientX - pendingDrag.startX;
                const dy = e.clientY - pendingDrag.startY;
                if (Math.sqrt(dx * dx + dy * dy) > 5) {
                    startDrag(pendingDrag.app, e);
                    pendingDrag = null;
                }
            }

            if (!dragGhost) return;
            e.preventDefault();
            setDragGhostPosition(e.clientX, e.clientY);
            dragPointerX = e.clientX;
            dragPointerY = e.clientY;
            scheduleDragEdgeNavigation(e.clientX, e.clientY);
            
            // 悬停动画逻辑
            if (currentHoverApp) {
                currentHoverApp.classList.remove('will-merge', 'will-swap');
                currentHoverApp = null;
            }
            const targetEl = document.elementFromPoint(e.clientX, e.clientY);
            
            if (targetEl) {
                const targetApp = targetEl.closest('.app-item');
                if (targetApp && targetApp !== draggedApp && !targetApp.classList.contains('is-widget')) {
                    const iconEl = targetApp.querySelector('.app-icon');
                    const iconRect = iconEl ? iconEl.getBoundingClientRect() : targetApp.getBoundingClientRect();
                    const isCenter = e.clientX > iconRect.left + iconRect.width * 0.2 && 
                                     e.clientX < iconRect.right - iconRect.width * 0.2 && 
                                     e.clientY > iconRect.top + iconRect.height * 0.2 && 
                                     e.clientY < iconRect.bottom - iconRect.height * 0.2;
                    
                    if (isCenter && !draggedApp.classList.contains('is-folder')) {
                        targetApp.classList.add('will-merge');
                    } else {
                        targetApp.classList.add('will-swap');
                    }
                    currentHoverApp = targetApp;
                }
            }
        }
    });

    function clearDragEdgeNavigation() {
        if (dragEdgeTimer) clearTimeout(dragEdgeTimer);
        dragEdgeTimer = null;
        dragEdgeDirection = 0;
    }

    function detachDraggedAppFromDesktopPage() {
        if (!draggedApp || !draggedApp.parentNode || !draggedApp.parentNode.classList.contains('desktop-slot')) return;
        draggedApp.remove();
        rebuildDesktopWidgetOccupancy();
        commitCurrentDesktopPage();
    }

    function scheduleDragEdgeNavigation(clientX, clientY) {
        const grid = document.getElementById('desktopGrid');
        if (!grid) return;
        
        const shell = document.querySelector('.iphone') || document.body;
        const shellRect = shell.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        const insideVerticalRange = clientY >= gridRect.top && clientY <= gridRect.bottom;
        const direction = insideVerticalRange && clientX <= shellRect.left + 34
            ? -1
            : insideVerticalRange && clientX >= shellRect.right - 34
                ? 1
                : 0;

        if (!direction) {
            clearDragEdgeNavigation();
            return;
        }
        if (dragEdgeTimer && dragEdgeDirection === direction) return;
        clearDragEdgeNavigation();
        dragEdgeDirection = direction;
        dragEdgeTimer = setTimeout(() => {
            dragEdgeTimer = null;
            if (!dragGhost || !draggedApp) return;
            detachDraggedAppFromDesktopPage();
            
            if (direction > 0 && currentDesktopPage === desktopPages.length - 1) {
                const currentPageEl = getDesktopPageElement(currentDesktopPage);
                const hasOtherApps = currentPageEl && Array.from(currentPageEl.querySelectorAll('.app-item')).some(app => app !== draggedApp);
                if (hasOtherApps) {
                    desktopPages.push([]);
                    ensureDesktopPageElement(desktopPages.length - 1, []);
                }
            }
            
            const targetPage = currentDesktopPage + direction;
            if (targetPage >= 0 && targetPage < desktopPages.length) {
                switchDesktopPage(targetPage, { skipCommit: true, skipSave: true });
                requestAnimationFrame(() => {
                    if (dragGhost && dragPointerX !== null && dragPointerY !== null) {
                        scheduleDragEdgeNavigation(dragPointerX, dragPointerY);
                    }
                });
            }
        }, 520);
    }

    function restoreDraggedAppToOrigin() {
        if (!draggedApp || !dragOrigin) return;
        if (dragOrigin.inDock) {
            const dockItems = Array.from(dockContainer.children);
            dockContainer.insertBefore(draggedApp, dockItems[dragOrigin.index] || null);
            return;
        }
        if (dragOrigin.inFolder) {
            const grid = document.getElementById('folderGrid');
            if (grid) {
                const items = Array.from(grid.children);
                grid.insertBefore(draggedApp, items[dragOrigin.index] || null);
            }
            return;
        }
        if (currentDesktopPage !== dragOrigin.page) {
            commitCurrentDesktopPage();
            switchDesktopPage(dragOrigin.page, { skipCommit: true, skipSave: true });
        }
        const slots = getCurrentDesktopSlots();
        const originSlot = slots[dragOrigin.index];
        const fallbackSlot = slots.find(slot => !slot.querySelector(':scope > .app-item') && !slot.getAttribute('data-widget-occupied-by'));
        (originSlot && !originSlot.querySelector(':scope > .app-item') ? originSlot : fallbackSlot)?.appendChild(draggedApp);
        rebuildDesktopWidgetOccupancy();
    }

    function invokeDesktopEntrypoint(name) {
        const invoke = () => {
            const entrypoint = window[name];
            if (typeof entrypoint !== 'function') return false;
            entrypoint();
            return true;
        };

        if (invoke()) return;
        let attempts = 0;
        const retry = () => {
            if (invoke()) return;
            attempts += 1;
            if (attempts < 20) window.setTimeout(retry, 50);
        };
        retry();
    }

    // Start the app from the current input task. Artificial frame/timer delays make taps
    // feel ignored and do not reduce the app's real initialization cost.
    function scheduleDesktopOpen(openApp) {
        if (typeof openApp !== 'function') return;
        const activeApp = window.__tonghuajiActiveAppOpening;
        if (activeApp) {
            activeApp.classList.add('is-opening');
            activeApp.setAttribute('aria-busy', 'true');
        }
        try {
            openApp();
        } finally {
            window.setTimeout(() => {
                if (!activeApp) return;
                activeApp.classList.remove('is-opening');
                activeApp.removeAttribute('aria-busy');
            }, 0);
        }
    }

    document.addEventListener('pointerup', (e) => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        
        if (isEditMode && pendingDrag) {
            pendingDrag = null;
        }

        let didSwipePage = false;
        if (desktopSwipeState && desktopSwipeState.pointerId === e.pointerId) {
            updateDesktopSwipeGesture(e.clientX, e.clientY);
            const state = desktopSwipeState;
            const velocityX = performance.now() - state.lastTime < 100 ? state.velocityX : 0;
            didSwipePage = finishDesktopSwipe(state.currentDeltaX, state.currentDeltaY, velocityX);
        }
        clearDesktopSwipeState(false);

        if (!dragGhost && !didSwipePage) {
            const app = e.target.closest('.app-item');
            if (app && !e.target.closest('.app-delete-btn')) {
                window.__tonghuajiActiveAppOpening = app;
                if (app.classList.contains('is-folder')) {
                    openFolder(app);
                    return;
                }
                
                if (!isEditMode) {
                    const appId = app.getAttribute('data-app-id');
                    const appNameEl = app.querySelector('.app-name');
                    const appName = appNameEl ? appNameEl.innerText : '';
                    
                    if (app.closest('#folderGrid')) {
                        closeFolder();
                    }

                    if (appId === 'theme' || appName === '主题') {
                        scheduleDesktopOpen(openThemeApp);
                    } else if (appId === 'settings' || appName === '设置') {
                    scheduleDesktopOpen(() => invokeDesktopEntrypoint('openSettingsApp'));
                } else if (appId === 'worldbook' || appName === '世界书') {
                    scheduleDesktopOpen(openWorldbookApp);
                } else if (appId === 'wechat' || appName === 'wechat' || appName === '微信') {
                    scheduleDesktopOpen(openWechatApp);
                } else if (appId === 'contacts' || appName === 'Contacts') {
                    scheduleDesktopOpen(openContactsApp);
                } else if (appId === 'memory' || appId === 'placeholder-bedtime-book' || appName === '记忆') {
                    scheduleDesktopOpen(openMemoryApp);
                } else if (appId === 'mcp' || appName === 'MCP') {
                    scheduleDesktopOpen(openMcpApp);
                } else if (appId === 'placeholder-game-center' || appName === '游戏中心') {
                    scheduleDesktopOpen(openGameCenterApp);
                } else if (appId === 'placeholder-today' || appName === '今日') {
                    scheduleDesktopOpen(() => invokeDesktopEntrypoint('openTodayApp'));
                } else if (appId === 'placeholder-icity' || appName === 'icity' || appName === 'Diary') {
                    scheduleDesktopOpen(openICityApp);
                } else if (appId === 'fanfiction' || appName === '同人') {
                    scheduleDesktopOpen(() => window.openFanfictionApp?.());
                } else if (appId === 'character-phone' || appName === '查手机') {
                    scheduleDesktopOpen(() => window.openCharacterPhoneApp?.());
                } else if (appId === 'meeting' || appName === '见面') {
                    scheduleDesktopOpen(openMeetingApp);
                } else if (appId === 'placeholder-music' || appId === 'music' || appId === 'music-app' || appId === 'applemusic' || appName === '音乐') {
                    scheduleDesktopOpen(() => invokeDesktopEntrypoint('openMusicApp'));
                    } else if (appId === 'placeholder-reading' || appName === '阅读') {
                        scheduleDesktopOpen(openReadenApp);
                    } else if (appId === 'placeholder-photos' || appName === '相册') {
                        scheduleDesktopOpen(openPhotosApp);
                    } else if (appId === 'message' || appName === '信息') {
                        scheduleDesktopOpen(openMessageApp);
                    } else if (appId === 'call' || appId === 'phone' || appName === '电话') {
                        scheduleDesktopOpen(openCallApp);
                    } else if (appId === 'twitter' || appName === 'Twitter' || appName === '推特') {
                        scheduleDesktopOpen(openTwitterApp);
                    } else if (appId === 'applestore' || appName === 'Apple store' || appName === 'Apple Store') {
                        scheduleDesktopOpen(openStoreApp);
                    }
                }
                window.__tonghuajiActiveAppOpening = null;
            }
        }

        if (isEditMode && dragGhost && draggedApp) {
            clearDragEdgeNavigation();
            dragPointerX = null;
            dragPointerY = null;
            dragGridRect = null;
            cancelDragGhostFrame();
            
            if (currentHoverApp) {
                currentHoverApp.classList.remove('will-merge', 'will-swap');
                currentHoverApp = null;
            }

            const ghostRect = dragGhost.getBoundingClientRect();
            dragGhost.remove();
            dragGhost = null;

            const originalDisplay = draggedApp.style.display;
            draggedApp.style.display = 'none';
            const targetEl = document.elementFromPoint(e.clientX, e.clientY);
            draggedApp.style.display = originalDisplay;
            let dropSucceeded = false;
            let targetAppForAnim = null;
            let targetOldRect = null;

            if (targetEl) {
                const targetApp = targetEl.closest('.app-item');
                const targetSlot = targetEl.closest('.desktop-slot');
                const targetDock = targetEl.closest('.dock');

                const parent1 = draggedApp.parentNode;
                const crossedPage = !dragOrigin.inDock && currentDesktopPage !== dragOrigin.page;

                const draggedIsWidget = draggedApp.classList.contains('is-widget');
                if (draggedIsWidget) {
                    if (targetSlot) {
                        const slots = getCurrentDesktopSlots();
                        const targetIndex = slots.indexOf(targetSlot);
                        const columns = parseInt(draggedApp.getAttribute('data-widget-columns'), 10) || 1;
                        const rows = parseInt(draggedApp.getAttribute('data-widget-rows'), 10) || 1;
                        if (targetIndex > -1 && isDesktopAreaAvailable(targetIndex, columns, rows, draggedApp)) {
                            targetSlot.appendChild(draggedApp);
                            dropSucceeded = true;
                        }
                    }
                } else if (targetApp && targetApp !== draggedApp && !targetApp.classList.contains('is-widget')) {
                    const parent2 = targetApp.parentNode;
                    const iconEl = targetApp.querySelector('.app-icon');
                    const iconRect = iconEl ? iconEl.getBoundingClientRect() : targetApp.getBoundingClientRect();
                    const dropX = e.clientX;
                    const dropY = e.clientY;
                    // 判断是否拖拽到了目标 APP 图标的中心区域 (内缩 20%)
                    const isCenter = dropX > iconRect.left + iconRect.width * 0.2 && 
                                     dropX < iconRect.right - iconRect.width * 0.2 && 
                                     dropY > iconRect.top + iconRect.height * 0.2 && 
                                     dropY < iconRect.bottom - iconRect.height * 0.2;
                    
                    if (isCenter && !dragOrigin.inDock && !parent2.closest('#dock') && !draggedApp.classList.contains('is-folder')) {
                        const draggedData = serializeAppElement(draggedApp, 0);
                        if (targetApp.classList.contains('is-folder')) {
                            const folderApps = JSON.parse(decodeURIComponent(targetApp.getAttribute('data-folder-apps') || '[]'));
                            folderApps.push(draggedData);
                            targetApp.setAttribute('data-folder-apps', encodeURIComponent(JSON.stringify(folderApps)));
                            targetApp.querySelector('.app-icon').innerHTML = folderApps.slice(0, 9).map(getDesktopMiniIconMarkup).join('');
                            
                            targetApp.style.transition = 'none';
                            targetApp.style.transform = 'scale(1.2)';
                            requestAnimationFrame(() => {
                                targetApp.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                                targetApp.style.transform = 'scale(1)';
                                setTimeout(() => {
                                    targetApp.style.transition = '';
                                    targetApp.style.transform = '';
                                }, 300);
                            });

                            draggedApp.remove();
                            dropSucceeded = true;
                        } else {
                            const targetData = serializeAppElement(targetApp, 0);
                            const folderApps = [targetData, draggedData];
                            const newFolder = createAppElement('文件夹', null, null, false, '', '', '', '', true, folderApps);
                            parent2.insertBefore(newFolder, targetApp);
                            
                            newFolder.style.transition = 'none';
                            newFolder.style.transform = 'scale(0.5)';
                            newFolder.style.opacity = '0';
                            requestAnimationFrame(() => {
                                newFolder.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
                                newFolder.style.transform = 'scale(1)';
                                newFolder.style.opacity = '1';
                                setTimeout(() => {
                                    newFolder.style.transition = '';
                                    newFolder.style.transform = '';
                                    if (isEditMode) newFolder.classList.add('jiggling');
                                }, 300);
                            });

                            targetApp.remove();
                            draggedApp.remove();
                            dropSucceeded = true;
                        }
                    } else if (!crossedPage && parent1 && parent2) {
                        // 恢复原本的交换 (Swap) 逻辑，实现让位
                        const targetOccupied = parent2.getAttribute ? parent2.getAttribute('data-widget-occupied-by') : null;
                        const sourceOccupied = parent1.getAttribute ? parent1.getAttribute('data-widget-occupied-by') : null;
                        if (!targetOccupied && !sourceOccupied) {
                            targetAppForAnim = targetApp;
                            targetOldRect = targetApp.getBoundingClientRect();
                            
                            const sibling1 = draggedApp.nextSibling === targetApp ? draggedApp : draggedApp.nextSibling;
                            const sibling2 = targetApp.nextSibling === draggedApp ? targetApp : targetApp.nextSibling;
                            parent2.insertBefore(draggedApp, sibling2);
                            parent1.insertBefore(targetApp, sibling1);
                            dropSucceeded = true;
                        }
                    }
                } else if (targetSlot && !targetSlot.querySelector('.app-item') && !targetSlot.getAttribute('data-widget-occupied-by')) {
                    targetSlot.appendChild(draggedApp);
                    dropSucceeded = true;
                } else if (targetDock && (!parent1 || !parent1.classList.contains('dock'))) {
                    if (dockContainer.querySelectorAll('.app-item').length < 4) {
                        dockContainer.appendChild(draggedApp);
                        dropSucceeded = true;
                    }
                }
                rebuildDesktopWidgetOccupancy();
            }
            
            // 处理从文件夹中拖出的逻辑
            if (dragOrigin && dragOrigin.inFolder && currentOpenFolderApp) {
                if (dropSucceeded) {
                    const folderApps = JSON.parse(decodeURIComponent(currentOpenFolderApp.getAttribute('data-folder-apps') || '[]'));
                    folderApps.splice(dragOrigin.index, 1);
                    
                    if (folderApps.length <= 1) {
                        // 如果只剩下一个 APP，解散文件夹
                        if (folderApps.length === 1) {
                            const lastApp = folderApps[0];
                            const newApp = createAppElement(lastApp.name, lastApp.icon, lastApp.appId);
                            if (isEditMode) newApp.classList.add('jiggling');
                            currentOpenFolderApp.parentNode.insertBefore(newApp, currentOpenFolderApp);
                        }
                        currentOpenFolderApp.remove();
                        closeFolder();
                    } else {
                        currentOpenFolderApp.setAttribute('data-folder-apps', encodeURIComponent(JSON.stringify(folderApps)));
                        currentOpenFolderApp.querySelector('.app-icon').innerHTML = folderApps.slice(0, 9).map(getDesktopMiniIconMarkup).join('');
                        
                        // 恢复 overlay 显示
                        const overlay = document.getElementById('folderOverlay');
                        if (overlay) {
                            overlay.style.opacity = '1';
                            overlay.style.pointerEvents = 'auto';
                        }
                    }
                } else {
                    // 拖拽失败，恢复显示 overlay
                    const overlay = document.getElementById('folderOverlay');
                    if (overlay) {
                        overlay.style.opacity = '1';
                        overlay.style.pointerEvents = 'auto';
                    }
                }
            }
            
            if (!dropSucceeded) restoreDraggedAppToOrigin();
            
            // FLIP 动画：让位动画
            if (targetAppForAnim && targetOldRect && document.body.contains(targetAppForAnim)) {
                targetAppForAnim.classList.remove('jiggling');
                const targetNewRect = targetAppForAnim.getBoundingClientRect();
                const tDx = (targetOldRect.left - targetNewRect.left) / getDesktopShellScale();
                const tDy = (targetOldRect.top - targetNewRect.top) / getDesktopShellScale();
                targetAppForAnim.style.transition = 'none';
                targetAppForAnim.style.transform = `translate(${tDx}px, ${tDy}px)`;
                requestAnimationFrame(() => {
                    targetAppForAnim.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
                    targetAppForAnim.style.transform = '';
                    setTimeout(() => {
                        if (targetAppForAnim) {
                            targetAppForAnim.style.transition = '';
                            targetAppForAnim.style.transform = '';
                            if (isEditMode) targetAppForAnim.classList.add('jiggling');
                        }
                    }, 300);
                });
            }

            // FLIP 动画：松手飞回动画
            const localDraggedApp = draggedApp;
            if (localDraggedApp && document.body.contains(localDraggedApp)) {
                localDraggedApp.classList.remove('jiggling');
                const finalRect = localDraggedApp.getBoundingClientRect();
                const dx = (ghostRect.left - finalRect.left) / getDesktopShellScale();
                const dy = (ghostRect.top - finalRect.top) / getDesktopShellScale();
                localDraggedApp.style.transition = 'none';
                localDraggedApp.style.transform = `translate(${dx}px, ${dy}px)`;
                localDraggedApp.style.opacity = '1';
                
                requestAnimationFrame(() => {
                    localDraggedApp.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
                    localDraggedApp.style.transform = '';
                    setTimeout(() => {
                        if (localDraggedApp) {
                            localDraggedApp.style.transition = '';
                            localDraggedApp.style.transform = '';
                            if (isEditMode) localDraggedApp.classList.add('jiggling');
                        }
                    }, 300);
                });
            }

            renderDesktopPageControls();
            if (typeof window.saveLayout === 'function') window.saveLayout();
            draggedApp = null;
            dragOrigin = null;
        }
    });

    document.addEventListener('pointercancel', (e) => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        pendingDrag = null;
        if (currentHoverApp) {
            currentHoverApp.classList.remove('will-merge', 'will-swap');
            currentHoverApp = null;
        }
        if (!desktopSwipeState || desktopSwipeState.pointerId === e.pointerId) {
            clearDesktopSwipeState(true);
        }
        clearDragEdgeNavigation();
        dragPointerX = null;
        dragPointerY = null;
        dragGridRect = null;
        if (dragGhost) {
            cancelDragGhostFrame();
            dragGhost.remove();
            dragGhost = null;
            if (draggedApp) {
                draggedApp.style.opacity = '1';
                restoreDraggedAppToOrigin();
            }
            draggedApp = null;
            dragOrigin = null;
        }
    });

    document.addEventListener('lostpointercapture', (e) => {
        if (!desktopSwipeState || desktopSwipeState.pointerId !== e.pointerId) return;
        clearDesktopSwipeState(desktopSwipeState.isTracking === true);
    }, { passive: true });

    window.addEventListener('blur', () => {
        if (desktopSwipeState) clearDesktopSwipeState(desktopSwipeState.isTracking === true);
    }, { passive: true });

    // 文件夹打开与关闭逻辑
    let currentOpenFolderApp = null;
    let folderCloseTimer = null;
    
    function openFolder(folderApp) {
        currentOpenFolderApp = folderApp;
        const overlay = document.getElementById('folderOverlay');
        const grid = document.getElementById('folderGrid');
        const nameInput = document.getElementById('folderNameInput');
        
        const name = folderApp.querySelector('.app-name').textContent;
        const apps = JSON.parse(decodeURIComponent(folderApp.getAttribute('data-folder-apps') || '[]'));
        
        nameInput.innerText = name;
        grid.innerHTML = '';
        
        apps.forEach((appData, index) => {
            const appEl = createAppElement(appData.name, appData.icon, appData.appId);
            appEl.dataset.folderIndex = index;
            if (isEditMode) appEl.classList.add('jiggling');
            grid.appendChild(appEl);
        });
        
        if (folderCloseTimer) clearTimeout(folderCloseTimer);
        // 核心修复：清除拖拽时残留的透明和拦截样式
        overlay.style.opacity = ''; 
        overlay.style.pointerEvents = '';
        
        overlay.style.display = 'flex';
        overlay.offsetHeight; // trigger reflow
        overlay.classList.add('active');
    }
    
    function closeFolder() {
        const overlay = document.getElementById('folderOverlay');
        if (!overlay) return;
        
        // 保存文件夹名称修改 (仅当文件夹未被解散时)
        if (currentOpenFolderApp && document.body.contains(currentOpenFolderApp)) {
            const nameInput = document.getElementById('folderNameInput');
            const nameEl = currentOpenFolderApp.querySelector('.app-name');
            if (nameEl) nameEl.textContent = nameInput.innerText;
            if (typeof window.saveLayout === 'function') window.saveLayout();
        }
        
        // 保持拦截，防止 click 事件穿透到下层
        overlay.style.pointerEvents = 'auto'; 
        overlay.classList.remove('active');
        
        if (folderCloseTimer) clearTimeout(folderCloseTimer);
        folderCloseTimer = setTimeout(() => { 
            overlay.style.display = 'none'; 
            overlay.style.pointerEvents = '';
            overlay.style.opacity = ''; // 彻底清理样式
            currentOpenFolderApp = null; 
        }, 300);
    }
    
    document.getElementById('folderOverlay')?.addEventListener('pointerdown', (e) => {
        if (e.target.id === 'folderOverlay') closeFolder();
    });

            // show three-dots button; click to expand vertical capsule menu

