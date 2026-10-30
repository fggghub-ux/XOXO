(function () {
    'use strict';
    if (window.tonghuajiRescue) return;

    var host, surface, title, description, status, exportButton, clearButton, closeButton, download;
    var busy = false, confirming = false, prompted = false, previousFocus;
    var tapCount = 0, lastTap = 0, pointerStart = null, ignoreClickUntil = 0;
    var started = false, ready = false, startupTimer, checkTimer, failure = '';
    var artifactUrl = '', artifactName = '';
    var skippedIds = ['githubBackupSettings', 'memoryExternalCredentialsV1', 'deviceLocalSettings', 'localDriveSettings'];

    function element(tag, text, parent) {
        var node = document.createElement(tag);
        if (text) node.textContent = text;
        if (parent) parent.appendChild(node);
        return node;
    }

    function mount() {
        if (!document.body) return false;
        if (host && host.isConnected) return true;
        host = element('div');
        host.id = 'tonghuajiEmergencyHost';
        host.hidden = true;
        // Isolate recovery controls from user CSS and the application's dialog stack.
        host.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;display:none!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;transform:none!important;';
        surface = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
        var style = element('style', '', surface);
        style.textContent = '.rescue-mask{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(0,0,0,.36);font:15px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;color:#000;touch-action:manipulation}.rescue-panel{box-sizing:border-box;width:100%;max-width:360px;max-height:85vh;overflow:auto;padding:24px;border-radius:22px;background:#fff;box-shadow:0 16px 60px rgba(0,0,0,.18)}.rescue-panel h2{font-size:20px;line-height:1.4;margin:0 0 12px}.rescue-panel p{margin:0 0 16px;color:#666;white-space:pre-wrap;overflow-wrap:anywhere}.rescue-panel button,.rescue-panel a{box-sizing:border-box;display:block;width:100%;min-height:46px;margin:10px 0 0;border:0;border-radius:12px;padding:11px 12px;background:#f2f2f2;color:#000;text-align:center;font:600 15px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;text-decoration:none;cursor:pointer}.rescue-panel .primary{background:#000;color:#fff}.rescue-panel .danger{color:#ff3b30}.rescue-panel button:disabled{opacity:.45;cursor:default}.rescue-panel [hidden]{display:none!important}.rescue-panel :focus-visible{outline:2px solid #000;outline-offset:3px}';
        var mask = element('div', '', surface);
        mask.className = 'rescue-mask';
        var panel = element('section', '', mask);
        panel.className = 'rescue-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'rescueTitle');
        title = element('h2', '应急操作', panel);
        title.id = 'rescueTitle';
        description = element('p', '', panel);
        status = element('p', '', panel);
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        exportButton = element('button', '导出本地数据', panel);
        exportButton.className = 'primary';
        exportButton.onclick = exportData;
        download = element('a', '保存备份文件', panel);
        download.className = 'primary';
        download.hidden = !artifactUrl;
        if (artifactUrl) { download.href = artifactUrl; download.download = artifactName; }
        download.onclick = function () { status.textContent = '已请求下载，请确认文件已保存到手机。未下载时可再次点击保存。'; };
        clearButton = element('button', '清空 CSS / JS 美化', panel);
        clearButton.className = 'danger';
        clearButton.onclick = clearCss;
        closeButton = element('button', '取消', panel);
        closeButton.onclick = close;
        surface.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') { event.preventDefault(); close(); }
            if (event.key !== 'Tab') return;
            var controls = [exportButton, download, clearButton, closeButton].filter(function (node) { return !node.hidden && !node.disabled; });
            var current = surface.activeElement || document.activeElement;
            var index = controls.indexOf(current);
            event.preventDefault();
            controls[(index + (event.shiftKey ? controls.length - 1 : 1)) % controls.length].focus();
        });
        document.body.appendChild(host);
        return true;
    }

    function open(reason) {
        if (!mount()) return;
        if (busy) { host.hidden = false; host.style.setProperty('display', 'block', 'important'); setBusy(true); return; }
        if (host.hidden) previousFocus = document.activeElement;
        confirming = false;
        host.hidden = false;
        host.style.setProperty('display', 'block', 'important');
        title.textContent = '应急操作';
        description.textContent = reason || '页面无法正常使用时，可以先导出已保存的本地数据。导出不会清除数据或美化。';
        status.textContent = artifactUrl ? '上次生成的备份仍可保存。' : '';
        exportButton.hidden = false;
        download.hidden = !artifactUrl;
        clearButton.textContent = '清空 CSS / JS 美化';
        clearButton.disabled = typeof wcOpenChatCssResetConfirm !== 'function';
        if (clearButton.disabled) status.textContent = '微信美化模块尚未就绪，仍可尝试导出本地数据。';
        closeButton.textContent = '取消';
        exportButton.focus();
    }

    function close() {
        if (busy) return;
        if (confirming) { open(); return; }
        host.hidden = true;
        host.style.setProperty('display', 'none', 'important');
        if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    }

    function setBusy(value) {
        busy = value;
        exportButton.disabled = value;
        clearButton.disabled = value || typeof wcOpenChatCssResetConfirm !== 'function';
        closeButton.disabled = value;
    }

    function clearCss() {
        if (busy || typeof wcOpenChatCssResetConfirm !== 'function') return;
        if (!confirming) {
            confirming = true;
            title.textContent = '确认清空美化？';
            description.textContent = '将按原有范围清空微信个性化全局及聊天室的自定义 CSS / JS，并恢复默认。聊天数据不会清空。';
            exportButton.hidden = true;
            download.hidden = true;
            status.textContent = '';
            clearButton.textContent = '确认清空';
            closeButton.textContent = '返回';
            return;
        }
        setBusy(true);
        Promise.resolve().then(function () { return wcOpenChatCssResetConfirm(true); }).then(function () {
            setBusy(false);
            open();
            download.hidden = !artifactUrl;
            status.textContent = '已执行原有微信美化清空操作。';
        }).catch(function (error) {
            setBusy(false);
            status.textContent = '清空未完成：' + (error.message || String(error));
        });
    }

    function readSavedRecords(onProgress) {
        return new Promise(function (resolve, reject) {
            var connection, transaction, timer, settled = false, records = [], count = 0, issues = [], settings = {};
            function finish(error) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                if (error && transaction) { try { transaction.abort(); } catch (_) {} }
                if (connection) connection.close();
                if (error && !count) { reject(error); return; }
                if (error) issues.push(error.message);
                resolve({ records: records, parts: [], count: count, issues: issues, settings: settings });
            }
            function heartbeat() {
                clearTimeout(timer);
                timer = setTimeout(function () { finish(new Error('读取超时，部分数据可能未读取完成。')); }, 20000);
            }
            heartbeat();
            var request;
            try { request = indexedDB.open('iOSDesktopDB'); }
            catch (error) { finish(error); return; }
            // Recovery must never create or upgrade a missing store.
            request.onupgradeneeded = function () { request.transaction.abort(); finish(new Error('此浏览器中没有找到已有数据，请确认使用原浏览器和原网址。')); };
            request.onerror = function () { finish(request.error || new Error('浏览器无法读取本地数据。')); };
            request.onblocked = function () { finish(new Error('本地存储被占用，请关闭此网站的其他标签页后重试。')); };
            request.onsuccess = function () {
                connection = request.result;
                if (settled) { connection.close(); return; }
                connection.onversionchange = function () { finish(new Error('数据存储正在更新，本次仅保留已读取的数据。')); };
                try {
                    if (!connection.objectStoreNames.contains('layoutStore')) throw new Error('未找到原有数据表，未修改任何数据。');
                    transaction = connection.transaction(['layoutStore'], 'readonly');
                    var cursorRequest = transaction.objectStore('layoutStore').openCursor();
                    transaction.oncomplete = function () { finish(); };
                    transaction.onabort = transaction.onerror = function () { finish(transaction.error || new Error('数据读取中断。')); };
                    cursorRequest.onerror = function () { finish(cursorRequest.error || new Error('数据读取失败。')); };
                    cursorRequest.onsuccess = function () {
                        if (settled) return;
                        heartbeat();
                        var cursor = cursorRequest.result;
                        if (!cursor) return;
                        var record = cursor.value;
                        if (record && record.id && skippedIds.indexOf(record.id) === -1) {
                            records.push(record);
                            count += 1;
                            if (record.id === 'appSettings') settings = record.data || {};
                        }
                        if (count % 25 === 0) onProgress(count);
                        cursor.continue();
                    };
                } catch (error) { finish(error); }
            };
        });
    }

    async function encodeSavedRecords(result, onProgress) {
        if (!window.tonghuajiBackupCodec) throw new Error('备份转换组件未加载，请刷新后重试');
        // Blob reads are asynchronous: encode only after the read-only transaction closes.
        result.count = 0;
        for (var i = 0; i < result.records.length; i += 1) {
            var record = result.records[i];
            try {
                var portable = await window.tonghuajiBackupCodec.encode(record);
                result.parts.push(JSON.stringify(String(record.id)) + ':' + JSON.stringify(portable));
                result.count += 1;
            } catch (error) { result.issues.push(String(record.id) + '：' + error.message); }
            result.records[i] = null;
            if (i % 25 === 0) {
                onProgress(i + 1, result.records.length);
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
            }
        }
        return result;
    }

    function appendPortableStorage(result) {
        var entries = {}, accountId = result.settings.wc_current_user_id || '';
        var storeKey = 'store_user_data_' + (accountId ? 'mask_' + accountId : 'mask_default_guest');
        try {
            for (var i = 0; i < localStorage.length; i += 1) {
                var key = localStorage.key(i);
                if (key && (key.indexOf('meeting_') === 0 || key === storeKey)) entries[key] = localStorage.getItem(key);
            }
        } catch (error) { result.issues.push('见面或商城的旧版本地数据未能完整读取：' + error.message); }
        if (Object.keys(entries).length) {
            result.parts.push('"localStorageBackupV1":' + JSON.stringify({ id: 'localStorageBackupV1', version: 1, entries: entries }));
            result.count += 1;
        }
    }

    function exportData() {
        if (busy) return;
        setBusy(true);
        download.hidden = true;
        status.textContent = '正在读取已保存的数据…未保存到本地的内容不在本次备份中。';
        readSavedRecords(function (count) { status.textContent = '正在读取数据…已读取 ' + count + ' 条存储记录'; }).then(function (result) {
            return encodeSavedRecords(result, function (count, total) { status.textContent = '正在打包字体、记忆和附件…' + count + '/' + total; });
        }).then(function (result) {
            appendPortableStorage(result);
            if (!result.count) throw new Error('没有读取到可导出的数据，未生成空备份。');
            status.textContent = '正在生成备份文件…';
            // The metadata has no id, so the existing importer never writes it as an application record.
            result.parts.push('"__emergencyExport":' + JSON.stringify({ version: 1, createdAt: new Date().toISOString(), partial: result.issues.length > 0, issues: result.issues }));
            var chunks = ['{'];
            result.parts.forEach(function (part, index) { if (index) chunks.push(','); chunks.push(part); });
            chunks.push('}');
            var file = new Blob(chunks, { type: 'application/json;charset=utf-8' });
            var nextUrl = URL.createObjectURL(file);
            if (artifactUrl) URL.revokeObjectURL(artifactUrl);
            artifactUrl = nextUrl;
            artifactName = '童话机_' + (result.issues.length ? '部分救援_' : '应急备份_') + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
            download.href = artifactUrl;
            download.download = artifactName;
            download.textContent = result.issues.length ? '保存已读取的数据（不完整）' : '保存备份文件';
            download.hidden = false;
            status.textContent = result.issues.length
                ? '已读取 ' + result.count + ' 条记录，备份不完整：\n' + result.issues.join('\n') + '\n可先保存，缺失项也已写入文件。'
                : '备份已生成，共 ' + result.count + ' 条存储记录。请点击保存，并确认文件已下载；之后可通过原有 JSON 导入恢复。';
        }).catch(function (error) {
            status.textContent = '导出未完成：' + (error.message || String(error)) + '\n原有数据未被清空或重置。';
            if (artifactUrl) { download.hidden = false; download.textContent = '保存上一次生成的备份'; }
        }).then(function () { setBusy(false); });
    }

    function resetTaps() { tapCount = 0; lastTap = 0; }
    function targetIsEligible(target) {
        if (!target || !target.closest || target === host) return false;
        if (target.closest('button,a,input,textarea,select,option,label,summary,[role="button"],[contenteditable="true"],[onclick],.app-item,.edit-ui,.edit-touch-target')) return false;
        var wechat = document.getElementById('wechatAppUI');
        if (wechat && wechat.classList.contains('show') && wechat.style.display !== 'none' && wechat.contains(target)) return true;
        return !!target.closest('#desktopGrid,#dock,#statusBar') || target.matches('.iphone');
    }
    document.addEventListener('pointerdown', function (event) {
        pointerStart = { x: event.clientX, y: event.clientY, time: Date.now(), id: event.pointerId };
        if (event.isPrimary === false) { ignoreClickUntil = Date.now() + 1500; resetTaps(); }
    }, true);
    document.addEventListener('pointermove', function (event) {
        if (pointerStart && (Math.abs(event.clientX - pointerStart.x) > 12 || Math.abs(event.clientY - pointerStart.y) > 12)) { ignoreClickUntil = Date.now() + 1500; resetTaps(); }
    }, true);
    document.addEventListener('pointercancel', function () { ignoreClickUntil = Date.now() + 1500; resetTaps(); }, true);
    document.addEventListener('click', function (event) {
        if ((host && !host.hidden) || (typeof appSettings !== 'undefined' && appSettings.wc_tap_clear_css_enabled === false)) { resetTaps(); return; }
        if (Date.now() < ignoreClickUntil || (pointerStart && Date.now() - pointerStart.time > 600) || !targetIsEligible(event.target)) { resetTaps(); return; }
        var now = Date.now();
        tapCount = now - lastTap <= 1200 ? tapCount + 1 : 1;
        lastTap = now;
        if (tapCount >= 5) { resetTaps(); open(); }
    }, true);

    function reportFailure(message) {
        failure = message;
        if (prompted && host && host.isConnected) return;
        prompted = true;
        if (document.body) open(message);
        else document.addEventListener('DOMContentLoaded', function () { open(message); }, { once: true });
    }
    function desktopProblem() {
        if (typeof isEditMode !== 'undefined' && isEditMode) return '';
        if (typeof layoutStoreLoaded === 'undefined' || !layoutStoreLoaded) return '桌面数据尚未正常读取，可先尝试导出已保存的数据。';
        if (typeof desktopPages === 'undefined' || typeof renderLayout !== 'function') return '桌面模块未能正常启动。';
        if (document.documentElement.classList.contains('app-access-pending')) return '';
        var grid = document.getElementById('desktopGrid');
        if (!grid) return '桌面入口未能正常显示。';
        for (var i = 0; i < desktopPages.length; i += 1) {
            var page = grid.querySelector('.desktop-page[data-page-index="' + i + '"]');
            var expected = desktopPages[i].length;
            if (expected && (!page || page.querySelectorAll('.desktop-slot > .app-item').length < expected)) return '部分桌面入口未能正常显示。';
        }
        var currentPage = typeof currentDesktopPage !== 'undefined' ? currentDesktopPage : 0;
        var visiblePage = grid.querySelector('.desktop-page[data-page-index="' + currentPage + '"]');
        var gridStyle = window.getComputedStyle(grid);
        var icons = visiblePage && gridStyle.display !== 'none' && gridStyle.visibility !== 'hidden' ? visiblePage.querySelectorAll('.desktop-slot > .app-item:not(.is-widget)') : [];
        for (var j = 0; j < icons.length; j += 1) {
            var icon = icons[j].querySelector('.app-icon');
            var appStyle = window.getComputedStyle(icons[j]);
            var iconStyle = icon && window.getComputedStyle(icon);
            if (!icon || appStyle.display === 'none' || appStyle.visibility === 'hidden' || iconStyle.display === 'none' || iconStyle.visibility === 'hidden') return '部分桌面图标被隐藏或未正常显示。';
        }
        return '';
    }
    function scheduleCheck() {
        clearTimeout(checkTimer);
        checkTimer = setTimeout(function () {
            if (document.visibilityState === 'hidden') return;
            var problem = failure || desktopProblem();
            if (problem) reportFailure(problem + ' 如果功能无法使用，建议先导出本地数据。');
        }, 8000);
    }
    function startupStarted() {
        if (started) return;
        started = true;
        startupTimer = setTimeout(function () {
            if (!ready && document.visibilityState !== 'hidden') reportFailure('启动等待时间较长，页面可能尚未加载完成。若功能无法使用，可先导出本地数据。');
        }, 45000);
    }
    window.addEventListener('tonghuaji:runtime-ready', function () { ready = true; clearTimeout(startupTimer); scheduleCheck(); });
    window.addEventListener('error', function (event) {
        if (!started || ready) return;
        if (/\/(?:desktop|db|utils|wechat-chat|settings-app-admin-v2)\.js(?:[?#]|$)/.test(event.filename || '')) failure = '关键功能启动时发生错误。';
    }, true);
    document.addEventListener('visibilitychange', function () { if (ready && document.visibilityState !== 'hidden' && !prompted) scheduleCheck(); });
    window.tonghuajiRescue = { open: open, startupStarted: startupStarted, reportFailure: reportFailure };
}());
