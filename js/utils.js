    // Let button state paint before preparing large AI contexts; hidden tabs must also resume.
    window.tonghuajiYieldToUi = function () {
        return new Promise(resolve => {
            let frame = 0;
            const finish = () => {
                clearTimeout(fallback);
                if (frame) cancelAnimationFrame(frame);
                resolve();
            };
            const fallback = setTimeout(finish, 50);
            if (typeof requestAnimationFrame === 'function' && document.visibilityState !== 'hidden') {
                frame = requestAnimationFrame(() => setTimeout(finish, 0));
            }
        });
    };

    (function initTongtongDiagnostics() {
        const maxLogs = 50;
        const longTaskThreshold = 200;
        const slowInputThreshold = 120;
        const slowLoadThreshold = 5000;
        const eventLoopThreshold = 1000;
        const memoryLogs = [];
        let lastLongTaskTime = 0;
        let lastSlowInputTime = 0;

        function canUseAppSettings() {
            try {
                return typeof appSettings !== 'undefined' && appSettings;
            } catch (error) {
                return false;
            }
        }

        function readStoredLogs() {
            if (!canUseAppSettings() || !Array.isArray(appSettings.diagnostic_error_logs)) return [];
            return appSettings.diagnostic_error_logs;
        }

        function writeStoredLogs(logs) {
            if (!canUseAppSettings()) return false;
            appSettings.diagnostic_error_logs = logs.slice(0, maxLogs);
            if (typeof saveAppSettings === 'function') saveAppSettings();
            return true;
        }

        function normalizeValue(value) {
            if (value instanceof Error) return value.stack || value.message || String(value);
            if (typeof value === 'string') return value;
            try {
                return JSON.stringify(value);
            } catch (error) {
                return String(value);
            }
        }

        function getEnvironmentSnapshot() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const memory = performance.memory;
            return {
                page: location.href,
                visibility: document.visibilityState,
                online: navigator.onLine,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                screen: `${screen.width}x${screen.height}`,
                devicePixelRatio: window.devicePixelRatio || 1,
                connection: connection ? {
                    effectiveType: connection.effectiveType || '',
                    downlink: connection.downlink || null,
                    rtt: connection.rtt || null,
                    saveData: Boolean(connection.saveData)
                } : null,
                memory: memory ? {
                    usedJSHeapSize: memory.usedJSHeapSize,
                    totalJSHeapSize: memory.totalJSHeapSize,
                    jsHeapSizeLimit: memory.jsHeapSizeLimit
                } : null,
                wasDiscarded: Boolean(document.wasDiscarded)
            };
        }

        function uniqLogs(logs) {
            const seen = new Set();
            return logs.filter(log => {
                const key = [log.time, log.type, log.message, log.source, log.line, log.column].join('|');
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            }).slice(0, maxLogs);
        }

        function getLogs() {
            return uniqLogs(memoryLogs.concat(readStoredLogs()));
        }

        function setLogs(logs) {
            const nextLogs = uniqLogs(logs);
            memoryLogs.length = 0;
            memoryLogs.push(...nextLogs);
            writeStoredLogs(nextLogs);
            return nextLogs;
        }

        function record(detail) {
            const entry = {
                time: new Date().toISOString(),
                type: detail.type || 'error',
                message: detail.message || 'Unknown error',
                source: detail.source || location.href,
                line: detail.line || null,
                column: detail.column || null,
                stack: detail.stack || '',
                severity: detail.severity || 'error',
                meta: detail.meta || null,
                userAgent: navigator.userAgent,
                environment: getEnvironmentSnapshot()
            };
            setLogs([entry].concat(getLogs()));
            window.dispatchEvent(new Event('tonghuaji-diagnostic-update'));
        }

        function toText() {
            return JSON.stringify({
                generatedAt: new Date().toISOString(),
                userAgent: navigator.userAgent,
                environment: getEnvironmentSnapshot(),
                logs: getLogs()
            }, null, 2);
        }

        function flush() {
            return setLogs(getLogs());
        }

        window.tongtongDiagnostics = {
            getLogs,
            toText,
            record,
            flush,
            clear() {
                setLogs([]);
            }
        };

        window.addEventListener('error', event => {
            const target = event.target;
            if (target && target !== window) {
                record({
                    type: 'resource.error',
                    message: `资源加载失败: ${target.tagName || 'unknown'}`,
                    source: target.currentSrc || target.src || target.href || location.href,
                    severity: 'warning'
                });
                return;
            }
            record({
                type: 'window.error',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error && event.error.stack ? event.error.stack : ''
            });
        }, true);

        window.addEventListener('unhandledrejection', event => {
            const reason = event.reason;
            record({
                type: 'unhandledrejection',
                message: normalizeValue(reason),
                stack: reason && reason.stack ? reason.stack : ''
            });
        });

        window.addEventListener('securitypolicyviolation', event => {
            record({
                type: 'security.csp',
                message: `内容安全策略拦截: ${event.violatedDirective || 'unknown'}`,
                source: event.blockedURI || location.href,
                severity: 'warning',
                meta: {
                    effectiveDirective: event.effectiveDirective || '',
                    originalPolicy: event.originalPolicy || ''
                }
            });
        });

        window.addEventListener('offline', () => {
            record({
                type: 'network.offline',
                message: '网络连接已断开',
                severity: 'warning'
            });
        });

        window.addEventListener('freeze', () => {
            record({
                type: 'lifecycle.freeze',
                message: '页面进入冻结状态',
                severity: 'info'
            });
        });

        if (document.wasDiscarded) {
            record({
                type: 'lifecycle.discarded',
                message: '页面曾被系统回收后重新加载，可能与闪退或内存压力有关',
                severity: 'warning'
            });
        }

        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver(list => {
                    list.getEntries().forEach(entry => {
                        const now = Date.now();
                        if (entry.duration < longTaskThreshold || now - lastLongTaskTime < 10000) return;
                        lastLongTaskTime = now;
                        record({
                            type: 'performance.long_task',
                            message: `检测到页面卡顿: 主线程阻塞 ${Math.round(entry.duration)}ms`,
                            severity: 'warning',
                            meta: { durationMs: Math.round(entry.duration) }
                        });
                    });
                });
                longTaskObserver.observe({ type: 'longtask', buffered: true });
            } catch (error) {
            }

            try {
                const inputObserver = new PerformanceObserver(list => {
                    list.getEntries().forEach(entry => {
                        const now = Date.now();
                        if (entry.duration < slowInputThreshold || now - lastSlowInputTime < 5000) return;
                        lastSlowInputTime = now;
                        record({
                            type: 'performance.slow_input',
                            message: `检测到操作响应偏慢: ${entry.name} ${Math.round(entry.duration)}ms`,
                            severity: 'warning',
                            meta: { eventName: entry.name, durationMs: Math.round(entry.duration) }
                        });
                    });
                });
                inputObserver.observe({ type: 'event', buffered: true, durationThreshold: slowInputThreshold });
            } catch (error) {
            }
        }

        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (!navigation || navigation.duration < slowLoadThreshold) return;
            record({
                type: 'performance.slow_load',
                message: `页面加载偏慢: ${Math.round(navigation.duration)}ms`,
                severity: 'warning',
                meta: {
                    durationMs: Math.round(navigation.duration),
                    domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
                    responseStartMs: Math.round(navigation.responseStart)
                }
            });
        });

        let expectedEventLoopTime = performance.now() + 5000;
        window.setInterval(() => {
            const now = performance.now();
            const delay = now - expectedEventLoopTime;
            expectedEventLoopTime = now + 5000;
            if (document.visibilityState !== 'visible' || delay < eventLoopThreshold) return;
            record({
                type: 'performance.event_loop_delay',
                message: `检测到页面卡顿: 事件循环延迟 ${Math.round(delay)}ms`,
                severity: 'warning',
                meta: { delayMs: Math.round(delay) }
            });
        }, 5000);

        const originalConsoleError = console.error.bind(console);
        console.error = function captureConsoleError(...args) {
            record({
                type: 'console.error',
                message: args.map(normalizeValue).join(' '),
                stack: (new Error().stack || '').split('\n').slice(2).join('\n')
            });
            return originalConsoleError(...args);
        };
    })();


    (function installTonghuaApiMonitor() {
    'use strict';
    if (window.tongApiMonitor) return;
    const STORE_ID = 'tonghuaApiActivityV2';
    const LIMIT = 200;
    let logs = [];
    // Records loaded from a previous browser session must not appear as fresh calls.
    const currentSessionIds = new Set();
    let daily = {};
    let loaded = false;
    let loadingPromise = null;
    let saveTimer = 0;
    const listeners = new Set();
    const quotaCache = new Map();
    const pricingCache = new Map();
    function quotaIdentity(site, key) {
        // Use a short in-memory fingerprint instead of persisting or displaying API keys.
        let hash = 2166136261;
        const value = String(key || '');
        for (let index = 0; index < value.length; index++) {
            hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
        }
        return site + '|' + (hash >>> 0).toString(16) + ':' + value.length;
    }
    const safeText = value => String(value == null ? '' : value)
        .replace(/Bearer\s+[^\s"',]+/gi, 'Bearer [hidden]')
        .replace(/sk-[a-z0-9_-]{6,}/gi, '[hidden]')
        .replace(/(api[_-]?key|access[_-]?token|secret|authorization)(\s*[:=]\s*)[^\s,}"']+/gi, '$1$2[hidden]')
        .slice(0, 500);
    function safeUrl(value) {
        try {
            const url = new URL(String(value), location.href);
            return url.origin + url.pathname.replace(/\/(sk-[^/]+|Bearer[^/]+)(?=\/|$)/gi, '/[hidden]');
        } catch (_) {
            return '[unknown endpoint]';
        }
    }
    function getDb() {
        const handle = window.db;
        return handle && handle.objectStoreNames && handle.objectStoreNames.contains('layoutStore') ? handle : null;
    }
    function notify() {
        listeners.forEach(callback => {
            try { callback(); } catch (_) {}
        });
    }
    function saveNow() {
        if (!loaded) {
            void load().then(ready => { if (ready) scheduleSave(); });
            return;
        }
        const handle = getDb();
        if (!handle) return;
        try {
            const tx = handle.transaction(['layoutStore'], 'readwrite');
            tx.objectStore('layoutStore').put({ id: STORE_ID, logs, daily });
        } catch (_) {}
    }
    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveNow, 700);
    }
    function load() {
        if (loaded) return Promise.resolve(true);
        if (loadingPromise) return loadingPromise;
        const handle = getDb();
        if (!handle) return Promise.resolve(false);
        loadingPromise = new Promise(resolve => {
            try {
                const tx = handle.transaction(['layoutStore'], 'readonly');
                const req = tx.objectStore('layoutStore').get(STORE_ID);
                req.onsuccess = () => {
                    const saved = req.result || {};
                    const old = Array.isArray(saved.logs) ? saved.logs : [];
                    const combined = new Map();
                    old.concat(logs).forEach(log => { if (log && log.id) combined.set(log.id, log); });
                    logs = [...combined.values()].sort((a, b) => b.startedAt - a.startedAt).slice(0, LIMIT);
                    const mergedDaily = { ...(saved.daily || {}) };
                    Object.entries(daily).forEach(([key, current]) => {
                        const previous = mergedDaily[key];
                        mergedDaily[key] = previous ? {
                            calls: (previous.calls || 0) + (current.calls || 0),
                            knownTokens: (previous.knownTokens || 0) + (current.knownTokens || 0),
                            tokenReports: (previous.tokenReports || 0) + (current.tokenReports || 0),
                            reportedSpend: (previous.reportedSpend || 0) + (current.reportedSpend || 0),
                            spendReports: (previous.spendReports || 0) + (current.spendReports || 0)
                        } : current;
                    });
                    daily = mergedDaily;
                    loaded = true;
                    if (combined.size !== old.length) scheduleSave();
                    notify();
                    resolve(true);
                };
                req.onerror = () => resolve(false);
            } catch (_) { resolve(false); }
        }).finally(() => { loadingPromise = null; });
        return loadingPromise;
    }
    const dayKey = timestamp => {
        const date = new Date(timestamp);
        return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    };
    function updateDaily(log) {
        const key = dayKey(log.startedAt) + '|' + log.site;
        const info = daily[key] || { calls: 0, knownTokens: 0, tokenReports: 0, reportedSpend: 0, spendReports: 0 };
        info.calls++;
        if (Number.isFinite(log.totalTokens)) {
            info.knownTokens += log.totalTokens;
            info.tokenReports++;
        }
        if (Number.isFinite(log.cost)) {
            info.reportedSpend += log.cost;
            info.spendReports++;
        }
        daily[key] = info;
        const keepDays = new Set(Array.from({ length: 7 }, (_, offset) => dayKey(Date.now() - offset * 86400000)));
        Object.keys(daily).forEach(item => { if (!keepDays.has(item.split('|')[0])) delete daily[item]; });
    }
    function cacheTokenNumber(value) {
        if (value == null || typeof value === 'boolean' || String(value).trim() === '') return null;
        const number = Number(value);
        return Number.isFinite(number) && number >= 0 ? number : null;
    }
    function readApiUsage(data) {
        const usage = data?.usage || data?.response?.usage || data?.message?.usage || data?.usageMetadata;
        if (!usage || typeof usage !== 'object') return {};
        const read = cacheTokenNumber(usage.prompt_cache_hit_tokens ?? usage.prompt_tokens_details?.cached_tokens
            ?? usage.input_tokens_details?.cached_tokens ?? usage.cache_read_input_tokens ?? usage.cachedContentTokenCount);
        const write = cacheTokenNumber(usage.cache_creation_input_tokens);
        let input = cacheTokenNumber(usage.prompt_tokens ?? usage.input_tokens ?? usage.promptTokenCount);
        // Claude reports uncached input separately from cache reads and writes.
        if (usage.prompt_tokens == null && usage.input_tokens != null && (read !== null || write !== null)
            && ('cache_read_input_tokens' in usage || 'cache_creation_input_tokens' in usage)) {
            input = input === null ? null : input + (read || 0) + (write || 0);
        }
        let miss = cacheTokenNumber(usage.prompt_cache_miss_tokens);
        if (input === null && read !== null && miss !== null) input = read + miss;
        if (miss === null && input !== null && read !== null && input >= read) miss = input - read;
        const output = cacheTokenNumber(usage.completion_tokens ?? usage.output_tokens ?? usage.candidatesTokenCount);
        const total = cacheTokenNumber(usage.total_tokens ?? usage.totalTokenCount);
        return Object.fromEntries(Object.entries({ promptTokens: input, completionTokens: output,
            totalTokens: total, cacheReadTokens: read, cacheMissTokens: miss, cacheWriteTokens: write })
            .filter(([, value]) => value !== null));
    }
    async function collectStreamUsage(response, log) {
        const reader = response.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        let pending = '';
        let eventData = [];
        let eventSize = 0;
        const applyEvent = () => {
            const text = eventData.join('\n');
            eventData = [];
            eventSize = 0;
            if (!text || text === '[DONE]') return;
            try {
                const values = readApiUsage(JSON.parse(text));
                if (!Object.keys(values).length || !logs.includes(log)) return;
                const previousTotal = log.totalTokens;
                Object.assign(log, values);
                const info = daily[dayKey(log.startedAt) + '|' + log.site];
                if (info && Number.isFinite(log.totalTokens)) {
                    info.knownTokens += log.totalTokens - (Number.isFinite(previousTotal) ? previousTotal : 0);
                    if (!Number.isFinite(previousTotal)) info.tokenReports++;
                }
                scheduleSave();
                notify();
            } catch (_) {}
        };
        const consumeLine = line => {
            line = line.replace(/\r$/, '');
            if (!line) { applyEvent(); return; }
            if (!line.startsWith('data:')) return;
            eventSize += line.length;
            // Bound diagnostic buffering; never retain response text in the log.
            if (eventSize <= 262144) eventData.push(line.slice(5).replace(/^ /, ''));
        };
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                pending += decoder.decode(value, { stream: true });
                const lines = pending.split('\n');
                pending = lines.pop() || '';
                lines.forEach(consumeLine);
                if (pending.length > 262144) pending = '';
            }
            pending += decoder.decode();
            if (pending) consumeLine(pending);
            applyEvent();
        } catch (_) {
            // Logging must never interrupt or retry the original model response.
        } finally {
            reader.releaseLock();
        }
    }
    function record(entry) {
        if (!entry || typeof entry !== 'object') return;
        const log = {
            id: entry.id || (Date.now() + '-' + Math.random().toString(36).slice(2, 9)),
            startedAt: Number(entry.startedAt) || Date.now(),
            site: String(entry.site || 'unknown'),
            endpoint: safeUrl(entry.endpoint || ''),
            feature: String(entry.feature || 'AI 生成'),
            streaming: Boolean(entry.streaming),
            callsite: safeText(entry.callsite || ''),
            model: String(entry.model || '未返回模型'),
            status: String(entry.status || 'unknown'),
            httpStatus: Number(entry.httpStatus) || 0,
            latencyMs: Number.isFinite(Number(entry.latencyMs)) ? Math.round(Number(entry.latencyMs)) : null,
            promptTokens: Number.isFinite(Number(entry.promptTokens)) && entry.promptTokens != null ? Number(entry.promptTokens) : null,
            completionTokens: Number.isFinite(Number(entry.completionTokens)) && entry.completionTokens != null ? Number(entry.completionTokens) : null,
            totalTokens: Number.isFinite(Number(entry.totalTokens)) && entry.totalTokens != null ? Number(entry.totalTokens) : null,
            cacheReadTokens: cacheTokenNumber(entry.cacheReadTokens),
            cacheMissTokens: cacheTokenNumber(entry.cacheMissTokens),
            cacheWriteTokens: cacheTokenNumber(entry.cacheWriteTokens),
            cost: Number.isFinite(Number(entry.cost)) && entry.cost != null ? Number(entry.cost) : null,
            costUnit: String(entry.costUnit || ''),
            error: safeText(entry.error || '')
        };
        logs.unshift(log);
        currentSessionIds.add(log.id);
        logs.length = Math.min(logs.length, LIMIT);
        updateDaily(log);
        scheduleSave();
        notify();
        return log;
    }
    function featureFrom(stack, path) {
        if (/\/images\/|image.*generat|\/edits\b|\/ai\/generate-image|\/submit\/imagine/.test(path)) return '图片生成';
        if (/\/audio\/|\/tts\b|speech|\/t2a_v2|text-to-speech/.test(path)) return '语音生成';
        if (/embedding/.test(path)) return '向量记忆';
        const modules = [
            [/\/icity\.js\b/, '日记 / icity'],
            [/\/meeting-app\.js\b/, '见面聊天'],
            [/\/readen-app\.js\b/, '阅读 / 共读'],
            [/\/wechat\.js\b/, '微信聊天'],
            [/\/message-app\.js\b/, '短信聊天'],
            [/\/call\.js\b/, '电话'],
            [/\/voice-imggen\.js\b/, '图片 / 语音'],
            [/\/memory|semantic-memory/, '记忆生成'],
            [/\/contacts\.js\b/, '联系人'],
            [/\/settings-app-admin-v2\.js\b/, 'API 连接测试']
        ];
        return modules.find(([regex]) => regex.test(stack))?.[1] || 'AI 生成';
    }
    function inspectRequest(input, init) {
        const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
        if (method !== 'POST') return null;
        const rawUrl = typeof input === 'string' || input instanceof URL ? String(input) : input?.url;
        if (!rawUrl) return null;
        let url;
        try { url = new URL(rawUrl, location.href); } catch (_) { return null; }
        const path = url.pathname.toLowerCase();
        const body = typeof init?.body === 'string' ? init.body : '';
        const sample = body.slice(0, 3500);
        const knownPath = /\/(chat\/completions|completions|responses|messages|embeddings|images\/(generations|edits)|audio\/(speech|transcriptions|translations)|tts|t2a_v2|text-to-speech|ai\/generate-image|(?:mj\/)?submit\/imagine|generate|generatecontent)(?:\/|$|:)/i.test(path) || /:generatecontent$/i.test(path);
        const looksLikeModel = /"(?:model|model_name)"\s*:\s*"[^"]+"/.test(sample);
        const looksLikePrompt = /"(?:messages|prompt|contents|input)"\s*:/.test(sample);
        if (!knownPath && !(looksLikeModel && looksLikePrompt)) return null;
        const stack = new Error().stack || '';
        const caller = stack.split('\n').find(line => /(?:\/js\/|\/functions\/).*:\d+(?::\d+)?/.test(line) && !line.includes('utils.js')) || '';
        const match = sample.match(/"(?:model|model_name)"\s*:\s*"([^"]{1,160})"/);
        return {
            endpoint: safeUrl(url.toString()),
            site: url.origin,
            feature: featureFrom(stack, path),
            callsite: safeText(caller.trim()),
            model: match ? match[1] : '未传入模型',
            streaming: /"stream"\s*:\s*true\b/.test(sample)
        };
    }
    function headerNumber(headers, names) {
        for (const name of names) {
            const value = headers.get(name);
            if (value != null && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
        }
        return null;
    }
    const previousFetch = window.fetch;
    const recentNetworkIssues = new Map();
    function reportNetworkIssue(type, message, endpoint, callsite, stack, httpStatus = 0) {
        const target = safeUrl(endpoint);
        const fingerprint = [type, httpStatus, target, message].join('|');
        const now = Date.now();
        if (now - (recentNetworkIssues.get(fingerprint) || 0) < 5000) return;
        recentNetworkIssues.set(fingerprint, now);
        if (recentNetworkIssues.size > 80) recentNetworkIssues.clear();
        window.tongtongDiagnostics?.record({
            type,
            message: safeText(message),
            source: callsite || target,
            stack: safeText(stack),
            meta: { endpoint: target, httpStatus }
        });
    }
    window.fetch = async function (...args) {
        // Start the actual request before stack inspection and diagnostic bookkeeping.
        const startedAt = Date.now();
        const pendingResponse = previousFetch.apply(this, args);
        const meta = inspectRequest(args[0], args[1]);
        if (!meta) {
            const input = args[0];
            const rawUrl = typeof input === 'string' || input instanceof URL ? String(input) : (input?.url || '');
            try {
                const response = await pendingResponse;
                if (response.status >= 400 && !/\/api\/usage\/token(?:\?|$)/.test(rawUrl)) {
                    const callStack = new Error().stack || '';
                    const callsite = callStack.split('\n').find(line => /(?:\/js\/|\/functions\/).*:\d+(?::\d+)?/.test(line) && !line.includes('utils.js'))?.trim() || '';
                    reportNetworkIssue('fetch.http_error', `HTTP ${response.status} ${response.statusText || '请求失败'}`, rawUrl, callsite, callStack, response.status);
                }
                return response;
            } catch (error) {
                if (error?.name !== 'AbortError' && !/\/api\/usage\/token(?:\?|$)/.test(rawUrl)) {
                    reportNetworkIssue('fetch.network_error', error?.message || '网络连接失败', rawUrl, '', error?.stack || '');
                }
                throw error;
            }
        }
        try {
            const response = await pendingResponse;
            const usage = {
                promptTokens: headerNumber(response.headers, ['x-usage-input-tokens', 'x-prompt-tokens']),
                completionTokens: headerNumber(response.headers, ['x-usage-output-tokens', 'x-completion-tokens']),
                totalTokens: headerNumber(response.headers, ['x-usage-total-tokens', 'x-total-tokens']),
                cost: headerNumber(response.headers, ['x-request-cost', 'x-usage-cost']),
                costUnit: response.headers.get('x-cost-currency') || ''
            };
            const result = {
                ...meta, ...usage, startedAt, latencyMs: Date.now() - startedAt,
                status: response.ok ? 'success' : 'error',
                httpStatus: response.status
            };
            const contentType = response.headers.get('content-type') || '';
            const length = Number(response.headers.get('content-length')) || 0;
            // Collect usage asynchronously so the AI response is never delayed.
            const finalize = async () => {
                if (/text\/event-stream/i.test(contentType)) {
                    const streamCopy = response.clone();
                    const log = record(result);
                    void collectStreamUsage(streamCopy, log);
                    return;
                }
                if (!/图片生成|语音生成/.test(meta.feature) && /json/i.test(contentType) && length < 1024 * 1024) {
                    try {
                        const data = await response.clone().json();
                        Object.assign(result, readApiUsage(data));
                        if (!response.ok) result.error = data?.error?.message || data?.message || `HTTP ${response.status}`;
                    } catch (_) {}
                }
                if (!response.ok && !result.error) result.error = `HTTP ${response.status} ${response.statusText || ''}`.trim();
                record(result);
                if (!response.ok) window.tongtongDiagnostics?.record({
                    type: 'api.http_error', message: result.error,
                    source: result.callsite || result.endpoint, meta: { feature: meta.feature, endpoint: result.endpoint, httpStatus: response.status }
                });
            };
            void finalize().catch(() => {});
            return response;
        } catch (error) {
            const isAbort = error?.name === 'AbortError';
            record({ ...meta, startedAt, latencyMs: Date.now() - startedAt, status: isAbort ? 'cancelled' : 'error', error: error?.message || String(error) });
            if (!isAbort) window.tongtongDiagnostics?.record({
                type: 'api.network_error', message: error?.message || '网络请求失败',
                source: meta.callsite || meta.endpoint, stack: error?.stack || ''
            });
            throw error;
        }
    };
    // New API compatible gateways expose token-specific usage at a documented same-origin endpoint.
    // Never send an API key to an unrelated domain or guess account-level billing access.
    const quotaFailures = new Map();
    const activeQuotaQueries = new Map();
    function getQuotaTarget(api) {
        if (!api?.url || !api?.key) throw new Error('当前 API 未配置地址或密钥');
        const source = new URL(api.url);
        if (source.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(source.hostname)) {
            throw new Error('当前 API 站点不是 HTTPS，不能安全查询余额');
        }
        const hostname = source.hostname.toLowerCase();
        const origin = source.origin;
        if (hostname === 'openrouter.ai' || hostname === 'api.openrouter.ai') {
            return { identity: quotaIdentity(origin, api.key), origin,
                urls: [origin + '/api/v1/key'], provider: 'openrouter' };
        }
        if (hostname === 'api.siliconflow.cn') {
            return { identity: quotaIdentity(origin, api.key), origin,
                urls: [origin + '/v1/user/info'], provider: 'siliconflow' };
        }
        if (hostname === 'api.deepseek.com') {
            return { identity: quotaIdentity(origin, api.key), origin,
                urls: [origin + '/user/balance'], provider: 'deepseek' };
        }
        const officialHosts = /(^|\.)(openai\.com|anthropic\.com|googleapis\.com|deepseek\.com|siliconflow\.cn|siliconflow\.com|x\.ai|moonshot\.cn|volces\.com)$/i;
        if (officialHosts.test(hostname)) {
            throw new Error('当前官方模型站点不支持用普通模型 Key 查询账户余额');
        }
        // Both canonical variants are documented by New API. Never probe off-origin.
        return { identity: quotaIdentity(origin, api.key), origin,
            urls: [origin + '/api/usage/token', origin + '/api/usage/token/'], provider: 'newapi' };
    }
    const quotaNumber = value => value !== '' && value != null && Number.isFinite(Number(value)) ? Number(value) : null;
    const activePricingQueries = new Map();
    const pricingErrors = new Map();
    async function queryPricing(api, options = {}) {
        const target = getQuotaTarget(api);
        const identity = target.origin;
        const cached = pricingCache.get(identity);
        if (!options.force && cached && Date.now() - cached.at < 600000) return cached;
        if (activePricingQueries.has(identity)) return activePricingQueries.get(identity);
        const operation = (async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 6000);
            try {
                // The New API public pricing endpoint never receives user credentials.
                if (target.provider !== 'newapi') throw new Error('此平台暂无通用站点价格接口');
                const response = await previousFetch(target.origin + '/api/pricing', {
                    method: 'GET', headers: { Accept: 'application/json' },
                    signal: controller.signal, redirect: 'error', cache: 'no-store',
                    credentials: 'omit'
                });
                if (!response.ok) throw new Error(response.status === 404
                    ? '当前站点未公开价格列表' : '站点价格接口 HTTP ' + response.status);
                const payload = await response.json();
                if (payload?.success === false) throw new Error('站点没有开放价格查询');
                const values = Array.isArray(payload?.data) ? payload.data
                    : Array.isArray(payload?.data?.models) ? payload.data.models : null;
                if (!values) throw new Error('价格接口未返回可识别的模型列表');
                const models = new Map();
                values.slice(0, 2000).forEach(row => {
                    const name = String(row?.model_name || row?.name || '').trim();
                    if (!name || name.length > 150) return;
                    const fixed = quotaNumber(row.model_price);
                    const inputRatio = quotaNumber(row.model_ratio);
                    const outputRatio = quotaNumber(row.completion_ratio);
                    if (fixed === null && inputRatio === null) return;
                    models.set(name, {
                        quotaType: Number(row.quota_type) === 1 ? 'fixed' : 'ratio',
                        price: fixed, modelRatio: inputRatio, completionRatio: outputRatio,
                        groupRequired: Boolean(row.enable_groups?.length)
                    });
                });
                if (!models.size) throw new Error('站点未提供可识别的价格项');
                const result = { models, at: Date.now(), source: '站点公开价格表' };
                pricingCache.set(identity, result);
                pricingErrors.delete(identity);
                notify();
                return result;
            } catch (error) {
                const message = error?.name === 'AbortError' ? '价格查询超时'
                    : error instanceof TypeError ? '浏览器跨域限制或站点价格接口不可访问'
                    : safeText(error?.message || '价格查询失败');
                pricingErrors.set(identity, message);
                notify();
                throw new Error(message);
            } finally { clearTimeout(timer); }
        })();
        activePricingQueries.set(identity, operation);
        try { return await operation; } finally { activePricingQueries.delete(identity); }
    }

    // Both billing variants and token usage are probed on the configured API origin.
    // A token marked unlimited does not imply an unlimited account wallet.
    async function readCompatQuotaJson(url, key, timeout = 5000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await previousFetch(url, {
                method: 'GET', redirect: 'error', cache: 'no-store', credentials: 'omit',
                headers: { Authorization: 'Bearer ' + String(key).trim(), Accept: 'application/json' },
                signal: controller.signal
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            if (!data || typeof data !== 'object' || data.success === false || data.code === false || data.error) {
                throw new Error('站点拒绝额度查询或没有返回有效数据');
            }
            return data;
        } catch (error) {
            if (error?.name === 'AbortError') throw new Error('额度查询超时');
            if (error instanceof TypeError) throw new Error('站点禁止跨域读取或网络不可用');
            throw error;
        } finally { clearTimeout(timer); }
    }
    async function queryGenericQuota(api, target, options = {}) {
        const { origin, identity } = target;
        const previous = quotaCache.get(identity);
        if (!options.force && previous && Date.now() - previous.at < 120000) return previous;
        const failure = quotaFailures.get(identity);
        if (!options.force && failure && Date.now() - failure.at < 30000) throw new Error(failure.message);
        if (activeQuotaQueries.has(identity)) return activeQuotaQueries.get(identity);
        const operation = (async () => {
            const errors = [];
            const keyTask = (async () => {
                for (const path of ['/api/usage/token', '/api/usage/token/']) {
                    try {
                        const payload = await readCompatQuotaJson(origin + path, api.key);
                        const data = payload.data;
                        if (!data || typeof data !== 'object' ||
                            (data.object !== 'token_usage' && !('total_available' in data) &&
                             !('user_usd_available' in data) && !('unlimited_quota' in data))) {
                            throw new Error('令牌接口未返回额度结构');
                        }
                        const unlimited = data.unlimited_quota === true;
                        const availableUsd = quotaNumber(data.total_usd_available ?? data.total_available_usd);
                        const available = quotaNumber(data.total_available);
                        const usedUsd = quotaNumber(data.total_usd_used ?? data.total_used_usd);
                        const grantedUsd = quotaNumber(data.total_usd_granted ?? data.total_granted_usd);
                        const accountUsd = quotaNumber(data.user_usd_available);
                        const accountCny = quotaNumber(data.user_cny_available);
                        const account = accountUsd !== null ? accountUsd : accountCny;
                        if (!unlimited && availableUsd === null && available === null && account === null) {
                            throw new Error('令牌接口没有剩余额度字段');
                        }
                        return {
                            remaining: account !== null ? account : unlimited ? null : availableUsd !== null ? availableUsd : available,
                            remainingKind: account !== null ? 'account' : unlimited ? 'unknown_account' : 'key',
                            remainingIsRaw: account === null && availableUsd === null && !unlimited,
                            currency: account !== null ? (accountUsd !== null ? 'USD' : 'CNY') : availableUsd !== null ? 'USD' : null,
                            keyRemaining: unlimited ? null : availableUsd !== null ? availableUsd : available,
                            keyRemainingIsRaw: availableUsd === null && !unlimited,
                            keyCurrency: availableUsd !== null ? 'USD' : null,
                            totalUsed: usedUsd !== null ? usedUsd : quotaNumber(data.total_used),
                            totalUsedIsRaw: usedUsd === null,
                            totalUsedCurrency: usedUsd !== null ? 'USD' : null,
                            granted: grantedUsd !== null ? grantedUsd : quotaNumber(data.total_granted),
                            grantedIsRaw: grantedUsd === null,
                            grantedCurrency: grantedUsd !== null ? 'USD' : null,
                            todayUsed: null, unlimited,
                            scope: account !== null ? '账户' : '当前密钥',
                            source: 'New API 当前密钥接口', at: Date.now()
                        };
                    } catch (error) {
                        errors.push('令牌接口：' + safeText(error.message));
                        if (!/HTTP (404|405|501)/.test(String(error.message))) break;
                    }
                }
                return null;
            })();
            const billingTask = (async () => {
                const now = new Date();
                const pad = number => String(number).padStart(2, '0');
                const startDate = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-01';
                const endDate = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
                // The reference app queries the current-month billing window. Query usage even if subscription fails.
                let partial = null;
                for (const prefix of ['/v1/dashboard/billing/', '/dashboard/billing/']) {
                    const [subscription, usage] = await Promise.allSettled([
                        readCompatQuotaJson(origin + prefix + 'subscription', api.key),
                        readCompatQuotaJson(origin + prefix + 'usage?start_date=' + startDate + '&end_date=' + endDate, api.key)
                    ]);
                    if (subscription.status === 'rejected') errors.push('订阅 ' + prefix + safeText(subscription.reason?.message));
                    if (usage.status === 'rejected') errors.push('用量 ' + prefix + safeText(usage.reason?.message));
                    const subResult = subscription.status === 'fulfilled' ? subscription.value : null;
                    const usedResult = usage.status === 'fulfilled' ? usage.value : null;
                    const sub = subResult?.data && typeof subResult.data === 'object' ? subResult.data : subResult;
                    const used = usedResult?.data && typeof usedResult.data === 'object' ? usedResult.data : usedResult;
                    const cents = quotaNumber(used?.total_usage ?? sub?.total_usage);
                    const spent = cents !== null && cents >= 0 ? cents / 100 : null;
                    const limit = quotaNumber(sub?.hard_limit_usd);
                    const finiteLimit = limit !== null && limit >= 0 && limit < 9000000;
                    let result = null;
                    for (const field of ['balance', 'remaining_balance', 'remain_quota', 'remaining_quota',
                                         'total_remaining', 'total_available', 'total_usd_available', 'quota']) {
                        const value = quotaNumber(sub?.[field]);
                        if (value === null) continue;
                        const raw = ['remain_quota', 'remaining_quota', 'total_available', 'quota'].includes(field);
                        result = {
                            remaining: value, remainingKind: 'billing', remainingIsRaw: raw,
                            currency: field === 'total_usd_available' ? 'USD' : null,
                            remainingUnit: raw ? '额度点' : '站点计费单位',
                            scope: '站点返回余额', source: '计费订阅字段 ' + field, at: Date.now()
                        };
                        break;
                    }
                    if (!result && !finiteLimit && spent === null) continue;
                    result ||= {
                        remaining: null, remainingKind: 'unknown_account', remainingUnit: '站点计费单位',
                        scope: '站点已用额度', source: '计费接口可用信息', at: Date.now()
                    };
                    if (finiteLimit) {
                        result.granted = limit;
                        result.grantedLabel = '站点计费总限额';
                        result.grantedIsRaw = false;
                    }
                    if (spent !== null) {
                        result.billingUsed = spent;
                        result.billingUsedUnit = '站点计费单位';
                        result.billingPeriod = startDate + ' 至 ' + endDate;
                        result.billingUsedSource = '站点用量接口 total_usage';
                        result.totalUsed = spent;
                        result.totalUsedKind = 'billing';
                        result.totalUsedIsRaw = false;
                    }
                    // Subscription hard_limit_usd is a limit, not an amount remaining.
                    // The query can be date-scoped, so subtraction is an estimate only.
                    if (!Number.isFinite(result.remaining) && finiteLimit && spent !== null) {
                        result.remainingEstimate = Math.max(0, limit - spent);
                        result.remainingEstimateUnit = '站点计费单位';
                    }
                    if (!partial) {
                        partial = result;
                    } else if (partial.remaining == null && result.remaining != null) {
                        // Prefer an explicit balance; preserve usage found on the other compatible path.
                        if (result.billingUsed == null && partial.billingUsed != null) {
                            result.billingUsed = partial.billingUsed;
                            result.billingPeriod = partial.billingPeriod;
                            result.billingUsedSource = partial.billingUsedSource;
                            result.billingUsedUnit = partial.billingUsedUnit;
                            result.totalUsed = partial.totalUsed;
                            result.totalUsedKind = partial.totalUsedKind;
                            result.totalUsedIsRaw = partial.totalUsedIsRaw;
                        }
                        partial = result;
                    } else {
                        if (partial.billingUsed == null && result.billingUsed != null) {
                            partial.billingUsed = result.billingUsed;
                            partial.billingPeriod = result.billingPeriod;
                            partial.billingUsedSource = result.billingUsedSource;
                            partial.billingUsedUnit = result.billingUsedUnit;
                            partial.totalUsed = result.totalUsed;
                            partial.totalUsedKind = result.totalUsedKind;
                            partial.totalUsedIsRaw = result.totalUsedIsRaw;
                        }
                        if (partial.granted == null && result.granted != null) {
                            partial.granted = result.granted;
                            partial.grantedLabel = result.grantedLabel;
                        }
                    }
                    if (partial.remaining != null && partial.billingUsed != null) return partial;
                }
                return partial;
            })();
            try {
                const [key, billing] = await Promise.all([keyTask, billingTask]);
                if (!key && !billing) throw new Error(errors.slice(0, 3).join('；') || '当前站点没有开放额度查询接口');
                const selected = key?.remainingKind === 'account' && key.remaining != null ? key
                    : billing?.remaining != null ? billing
                    : key?.remaining != null ? key
                    : billing || key;
                const info = { ...selected };
                if (key) {
                    info.keyRemaining = key.keyRemaining;
                    info.keyRemainingIsRaw = key.keyRemainingIsRaw;
                    info.keyCurrency = key.keyCurrency;
                    info.keyUsed = key.totalUsed;
                    info.keyUsedIsRaw = key.totalUsedIsRaw;
                    info.keyUsedCurrency = key.totalUsedCurrency;
                    info.unlimited = key.unlimited;
                    if (selected === key) {
                        info.totalUsed = key.totalUsed;
                        info.totalUsedIsRaw = key.totalUsedIsRaw;
                        info.totalUsedCurrency = key.totalUsedCurrency;
                        info.granted = key.granted;
                        info.grantedIsRaw = key.grantedIsRaw;
                        info.grantedCurrency = key.grantedCurrency;
                    }
                }
                if (billing) {
                    info.billingUsed = billing.billingUsed ?? null;
                    info.billingUsedUnit = billing.billingUsedUnit;
                    info.billingPeriod = billing.billingPeriod;
                    info.billingUsedSource = billing.billingUsedSource;
                    info.billingGranted = billing.granted ?? null;
                    info.remainingEstimate = billing.remainingEstimate ?? null;
                    info.remainingEstimateUnit = billing.remainingEstimateUnit;
                    if (selected === billing) {
                        info.totalUsed = billing.totalUsed ?? null;
                        info.totalUsedKind = billing.totalUsedKind;
                        info.totalUsedIsRaw = billing.totalUsedIsRaw;
                        info.granted = billing.granted ?? null;
                        info.grantedLabel = billing.grantedLabel;
                        info.grantedIsRaw = billing.grantedIsRaw;
                    }
                }
                info.probeErrors = errors.slice(0, 5);
                if (info.remainingKind === 'unknown_account') info.remaining = null;
                if (info.remainingIsRaw || info.keyRemainingIsRaw || info.keyUsedIsRaw || info.totalUsedIsRaw || info.grantedIsRaw || info.billingUsed != null) {
                    const controller = new AbortController();
                    const timer = setTimeout(() => controller.abort(), 1800);
                    try {
                        const response = await previousFetch(origin + '/api/status', {
                            method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error',
                            headers: { Accept: 'application/json' }, signal: controller.signal
                        });
                        if (response.ok) {
                            const metadata = await response.json();
                            const details = metadata.data || metadata;
                            const conversion = quotaNumber(details.quota_per_unit);
                            const currency = String(details.quota_display_type || '').toUpperCase();
                            const exchange = quotaNumber(details.usd_exchange_rate ?? details.usd_to_cny_rate);
                            if (['USD', 'CNY'].includes(currency)) {
                                if (info.billingUsed != null) info.billingUsedCurrency = currency;
                                if (info.billingGranted != null) info.billingGrantedCurrency = currency;
                                if (info.remainingKind === 'billing' && !info.remainingIsRaw) info.currency = currency;
                            }
                            if (currency === 'TOKENS') {
                                if (info.billingUsed != null) info.billingUsedUnit = 'Token';
                                if (info.billingGranted != null) info.billingGrantedUnit = 'Token';
                            }
                            if (conversion > 0 && (currency === 'USD' || (currency === 'CNY' && exchange > 0))) {
                                info.quotaPerUnit = conversion;
                                info.quotaCurrency = currency;
                                info.quotaExchangeRate = currency === 'CNY' ? exchange : 1;
                            }
                        }
                    } catch (_) {} finally { clearTimeout(timer); }
                }
                info.at = Date.now();
                quotaCache.set(identity, info);
                quotaFailures.delete(identity);
                notify();
                return info;
            } catch (error) {
                const message = safeText(error?.message || '当前站点额度查询失败');
                quotaCache.delete(identity);
                quotaFailures.set(identity, { message, at: Date.now() });
                notify();
                throw new Error(message);
            }
        })();
        activeQuotaQueries.set(identity, operation);
        try { return await operation; } finally { activeQuotaQueries.delete(identity); }
    }
    async function queryQuota(api, options = {}) {
        const { origin, urls, identity, provider } = getQuotaTarget(api);
        if (provider === 'newapi') return queryGenericQuota(api, { origin, identity }, options);
        const previous = quotaCache.get(identity);
        if (!options.force && previous && Date.now() - previous.at < 120000) return previous;
        const failure = quotaFailures.get(identity);
        if (!options.force && failure && Date.now() - failure.at < 30000) throw new Error(failure.message);
        if (activeQuotaQueries.has(identity)) return activeQuotaQueries.get(identity);
        const promise = (async () => {
            let response = null;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8500);
            try {
                for (let index = 0; index < urls.length; index++) {
                    try {
                        response = await previousFetch(urls[index], {
                            method: 'GET',
                            redirect: 'error',
                            headers: { Authorization: 'Bearer ' + String(api.key).trim(), Accept: 'application/json' },
                            signal: controller.signal,
                            cache: 'no-store'
                        });
                    } catch (error) {
                        if (index < urls.length - 1 && error?.name !== 'AbortError') continue;
                        throw error;
                    }
                    if (index < urls.length - 1 && [404, 405].includes(response.status)) continue;
                    break;
                }
                if (!response) throw new Error('站点没有响应额度查询');
                if (!response.ok) {
                    if ([404, 405, 501].includes(response.status)) throw new Error('当前站点未提供可用的密钥额度查询接口');
                    if ([401, 403].includes(response.status)) throw new Error('API Key 无法访问额度接口，请检查密钥或站点权限');
                    if (response.status === 429) throw new Error('额度查询请求过于频繁，请稍后重试');
                    throw new Error('额度查询接口返回 HTTP ' + response.status);
                }
                const payload = await response.json();
                if (payload?.success === false || payload?.code === false) {
                    throw new Error('站点拒绝了额度查询（可用密钥不一定有查询权限）');
                }
                const data = payload?.data;
                let info;
                if (provider === 'openrouter') {
                    if (!data || typeof data !== 'object' || data.usage === undefined) {
                        throw new Error('OpenRouter 未返回可识别的当前密钥用量');
                    }
                    // /api/v1/key reports spending limits, never a wallet balance.
                    const limit = quotaNumber(data.limit);
                    const remaining = quotaNumber(data.limit_remaining);
                    info = {
                        remaining: remaining != null ? remaining : '未设置限额',
                        remainingUnit: 'USD', todayUsed: quotaNumber(data.usage_daily),
                        totalUsed: quotaNumber(data.usage), granted: limit,
                        grantedLabel: '当前密钥消费限额',
                        source: 'OpenRouter 当前密钥接口', scope: '当前密钥限额',
                        currency: 'USD', at: Date.now()
                    };
                } else if (provider === 'siliconflow') {
                    if (!data || payload?.status !== true || quotaNumber(data.totalBalance) === null) {
                        throw new Error('硅基流动未返回有效余额数据');
                    }
                    info = {
                        remaining: quotaNumber(data.totalBalance), remainingUnit: 'CNY',
                        todayUsed: null, totalUsed: null,
                        granted: quotaNumber(data.chargeBalance),
                        grantedLabel: '剩余充值余额',
                        currency: 'CNY', scope: '账户',
                        source: 'SiliconFlow 官方余额接口', at: Date.now()
                    };
                } else if (provider === 'deepseek') {
                    const balances = payload?.balance_infos;
                    const balance = Array.isArray(balances) && (balances.find(item => item.currency === 'CNY')
                        || balances.find(item => item.currency === 'USD'));
                    if (!balance || quotaNumber(balance.total_balance) === null) {
                        throw new Error('DeepSeek 未返回有效余额数据');
                    }
                    info = {
                        remaining: quotaNumber(balance.total_balance), remainingUnit: balance.currency,
                        todayUsed: null, totalUsed: null,
                        granted: quotaNumber(balance.granted_balance),
                        grantedLabel: '剩余赠送余额',
                        currency: balance.currency, scope: '账户',
                        source: 'DeepSeek 官方余额接口', at: Date.now()
                    };
                } else {
                    throw new Error('当前服务商不支持此查询类型');                }
                // Token usage and account wallet are independently verified and cached.
                quotaCache.set(identity, info);
                quotaFailures.delete(identity);
                notify();
                return info;
            } catch (error) {
                const message = error?.name === 'AbortError'
                    ? '额度查询超时，站点可能未开放该接口'
                    : error instanceof TypeError
                        ? '站点限制了浏览器跨域请求，或额度接口不可访问'
                        : safeText(error?.message || '额度查询失败');
                // Failure of token usage must not affect an authenticated account wallet.
                quotaCache.delete(identity);
                quotaFailures.set(identity, { at: Date.now(), message });
                notify();
                throw new Error(message);
            } finally {
                clearTimeout(timer);
            }
        })();
        activeQuotaQueries.set(identity, promise);
        try { return await promise; } finally { activeQuotaQueries.delete(identity); }
    }
    function getQuotaError(site, key) {
        return quotaFailures.get(quotaIdentity(site, key))?.message || '';
    }
    window.tongApiMonitor = {
        getLogs: () => logs.slice(),
        getSessionLogs: () => logs.filter(item => currentSessionIds.has(item.id)),
        getDaily: (site, date = dayKey(Date.now())) => ({ ...(daily[date + '|' + site] || {}) }),
        getQuota: (site, key) => quotaCache.get(quotaIdentity(site, key)) || null,
        getPricing: api => { try { return pricingCache.get(getQuotaTarget(api).origin) || null; } catch (_) { return null; } },
        getPricingError: api => { try { return pricingErrors.get(getQuotaTarget(api).origin) || ''; } catch (_) { return ''; } },
        record, load, queryQuota, queryPricing, getQuotaError,
        subscribe(callback) { listeners.add(callback); return () => listeners.delete(callback); },
        clear() { logs = []; currentSessionIds.clear(); daily = {}; quotaCache.clear(); pricingCache.clear(); pricingErrors.clear(); saveNow(); notify(); }
    };
    let attempts = 0;
    const poll = setInterval(() => {
        attempts++;
        if (getDb()) { clearInterval(poll); void load(); }
        else if (attempts >= 40) clearInterval(poll);
    }, 500);
})();

            // show three-dots button; click to expand vertical capsule menu
    function ensureDialogOverlayHost(id) {
        const iphone = document.querySelector('.iphone') || document.body;
        let overlay = document.getElementById(id);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = id;
            overlay.className = 'custom-dialog-overlay';
            overlay.innerHTML = '<div class="custom-dialog" id="customDialog"></div>';
            iphone.appendChild(overlay);
        } else if (overlay.parentElement !== iphone || overlay !== iphone.lastElementChild) {
            iphone.appendChild(overlay);
        }
        return overlay;
    }

    function showCustomAlert(title, message) {
        return new Promise(resolve => {
            const overlay = ensureDialogOverlayHost('customDialogOverlay');
            let dialog = document.getElementById('customDialog');
            if (!dialog) {
                dialog = document.createElement('div');
                dialog.id = 'customDialog';
                dialog.className = 'custom-dialog';
                overlay.appendChild(dialog);
            }
            
            dialog.replaceChildren();
            const text = document.createElement('div');
            text.className = 'custom-dialog-text';
            const titleElement = document.createElement('div');
            titleElement.className = 'custom-dialog-title';
            titleElement.textContent = title;
            const messageElement = document.createElement('div');
            messageElement.className = 'custom-dialog-message';
            messageElement.textContent = message;
            text.append(titleElement, messageElement);
            const buttons = document.createElement('div');
            buttons.className = 'custom-dialog-btns';
            const alertButton = document.createElement('button');
            alertButton.className = 'custom-dialog-btn bold';
            alertButton.id = 'customAlertBtn';
            alertButton.textContent = '好';
            buttons.appendChild(alertButton);
            dialog.append(text, buttons);

            alertButton.onclick = () => {
                overlay.classList.remove('show');
                setTimeout(() => resolve(), 300);
            };
            
            overlay.classList.add('show');
        });
    }

    function showCustomConfirm(title, message, confirmText = '确定', isDanger = false) {
        return new Promise(resolve => {
            const overlay = ensureDialogOverlayHost('customDialogOverlay');
            let dialog = document.getElementById('customDialog');
            if (!dialog) {
                dialog = document.createElement('div');
                dialog.id = 'customDialog';
                dialog.className = 'custom-dialog';
                overlay.appendChild(dialog);
            }
            
            dialog.replaceChildren();
            const text = document.createElement('div');
            text.className = 'custom-dialog-text';
            const titleElement = document.createElement('div');
            titleElement.className = 'custom-dialog-title';
            titleElement.textContent = title;
            const messageElement = document.createElement('div');
            messageElement.className = 'custom-dialog-message';
            messageElement.textContent = message;
            text.append(titleElement, messageElement);
            const buttons = document.createElement('div');
            buttons.className = 'custom-dialog-btns';
            const cancelButton = document.createElement('button');
            cancelButton.className = 'custom-dialog-btn';
            cancelButton.id = 'customConfirmCancel';
            cancelButton.textContent = '取消';
            const confirmButton = document.createElement('button');
            confirmButton.className = `custom-dialog-btn ${isDanger ? 'danger bold' : 'bold'}`;
            confirmButton.id = 'customConfirmOk';
            confirmButton.textContent = confirmText;
            buttons.append(cancelButton, confirmButton);
            dialog.append(text, buttons);

            cancelButton.onclick = () => {
                overlay.classList.remove('show');
                setTimeout(() => resolve(false), 300);
            };
            
            confirmButton.onclick = () => {
                overlay.classList.remove('show');
                setTimeout(() => resolve(true), 300);
            };
            
            overlay.classList.add('show');
        });
    }

            // show three-dots button; click to expand vertical capsule menu
    function showCustomPrompt(title, inputs, confirmText = '确定') {
        return new Promise(resolve => {
            const iphone = document.querySelector('.iphone') || document.body;
            let overlay = document.getElementById('customPromptOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'preset-modal-overlay';
                overlay.id = 'customPromptOverlay';
                iphone.appendChild(overlay);
            } else if (overlay.parentElement !== iphone || overlay !== iphone.lastElementChild) {
                iphone.appendChild(overlay);
            }
            
            let inputConfigs = [];
            if (typeof inputs === 'string') {
                inputConfigs = [{ placeholder: inputs, value: '' }];
            } else if (Array.isArray(inputs)) {
                inputConfigs = inputs;
            } else if (typeof inputs === 'object') {
                inputConfigs = [inputs];
            }

            let inputsHtml = inputConfigs.map((cfg, idx) => `
                <input type="${cfg.type || 'text'}" class="preset-m1-input" id="customPromptInput_${idx}" placeholder="${cfg.placeholder || ''}" value="${cfg.value || ''}" style="margin-bottom: ${idx < inputConfigs.length - 1 ? '12px' : '0'};">
            `).join('');

            overlay.innerHTML = `
                <div class="preset-modal-style-1">
                    <div class="preset-m-header">
                        <div class="preset-m-header-text">${title}</div>
                    </div>
                    <div class="preset-m1-body">
                        ${inputsHtml}
                    </div>
                    <div class="preset-m1-footer">
                        <button class="preset-m1-btn preset-m1-btn-cancel" id="customPromptCancel">取消</button>
                        <button class="preset-m1-btn preset-m1-btn-save" id="customPromptOk">${confirmText}</button>
                    </div>
                </div>
            `;

            const btnCancel = overlay.querySelector('#customPromptCancel');
            const btnOk = overlay.querySelector('#customPromptOk');

            btnCancel.onclick = () => {
                overlay.classList.remove('show');
                setTimeout(() => resolve(null), 300);
            };

            btnOk.onclick = () => {
                const results = inputConfigs.map((_, idx) => overlay.querySelector(`#customPromptInput_${idx}`).value);
                overlay.classList.remove('show');
                setTimeout(() => resolve(results.length === 1 ? results[0] : results), 300);
            };

            overlay.classList.add('show');
            setTimeout(() => {
                const firstInput = overlay.querySelector('#customPromptInput_0');
                if (firstInput) {
                    firstInput.focus();
                    if (firstInput.value) {
                        firstInput.selectionStart = firstInput.selectionEnd = firstInput.value.length;
                    }
                }
            }, 100);
        });
    }

            // show three-dots button; click to expand vertical capsule menu
    function showToast(message) {
        const iphone = document.querySelector('.iphone') || document.body;
        let toast = document.getElementById('iosToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'iosToast';
            toast.className = 'ios-toast-capsule';
            iphone.appendChild(toast);
        } else if (toast.parentElement !== iphone || toast !== iphone.lastElementChild) {
            iphone.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        
        if (toast.hideTimer) clearTimeout(toast.hideTimer);
        
        toast.hideTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

            // show three-dots button; click to expand vertical capsule menu
    window.alert = function(message) {
        return showCustomAlert('提示', message);
    };

    window.confirm = function(message) {
            // show three-dots button; click to expand vertical capsule menu
        return showCustomConfirm('请确认', message);
    };

            // show three-dots button; click to expand vertical capsule menu
    const clockElement = document.getElementById('clock');
    let clockUpdateTimer = 0;

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (clockElement) clockElement.textContent = `${hours}:${minutes}`;
    }

    function scheduleClockUpdate() {
        if (clockUpdateTimer) window.clearTimeout(clockUpdateTimer);
        updateTime();
        const now = Date.now();
        const delay = 60000 - (now % 60000) + 50;
        clockUpdateTimer = window.setTimeout(scheduleClockUpdate, delay);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') scheduleClockUpdate();
    });
    scheduleClockUpdate();

    function updateBattery(level) {
        const percentage = Math.round(level * 100);
        document.getElementById('batteryLevel').style.width = percentage + '%';
        const batteryText = document.getElementById('batteryText');
        if (batteryText) batteryText.textContent = percentage;
    }

    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            updateBattery(battery.level);
            battery.addEventListener('levelchange', function() {
                updateBattery(battery.level);
            });
        });
    } else {
        updateBattery(0.85);
    }

            // show three-dots button; click to expand vertical capsule menu


    // ===== 小组件渲染隔离辅助 (iframe srcdoc) =====
    // 将组件 HTML 内容放入独立 iframe，避免其 <style>/<script> 污染全局 DOM
    function escapeWidgetSrcdoc(content) {
        return String(content == null ? '' : content)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeWidgetCssString(value) {
        return String(value == null ? '' : value)
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r?\n/g, ' ');
    }

    function getWidgetFontProxyUrl(value) {
        const raw = String(value || '').trim();
        if (!raw || !window.location || !/^https?:$/.test(window.location.protocol)) return '';
        try {
            const parsed = new URL(raw, window.location.href);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
            return window.location.origin + '/api/tools/font-proxy?url=' + encodeURIComponent(parsed.href);
        } catch (error) {
            return '';
        }
    }

    function getSelectedWidgetFontData() {
        const family = typeof currentSelectedFont !== 'undefined' ? currentSelectedFont : 'default';
        const fonts = typeof customFonts !== 'undefined' && Array.isArray(customFonts) ? customFonts : [];
        const selected = family === 'default' ? null : fonts.find(font => font && font.id === family);
        return {
            family,
            type: selected ? selected.type : 'default',
            url: selected && selected.type === 'url' ? selected.url || '' : '',
            proxyUrl: selected && selected.type === 'url' ? getWidgetFontProxyUrl(selected.url) : '',
            data: selected && selected.type === 'local' ? selected.data || null : null
        };
    }

    function buildWidgetGlobalFontTools() {
        const font = getSelectedWidgetFontData();
        const family = font.family === 'default' ? 'Geomini' : font.family;
        const safeFamily = escapeWidgetCssString(family);
        const fallback = `"${safeFamily}", "Geomini", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`;
        let fontFaces = '@font-face{font-family:"Geomini";src:url("https://nos.netease.com/ysf/260de1ccc0fffea1b1af12b7f5b50c3c.ttf") format("truetype");font-weight:normal;font-style:normal;font-display:swap;}';
        if (font.type === 'url' && font.url) {
            fontFaces += `@font-face{font-family:"${safeFamily}";src:url("${escapeWidgetCssString(font.url)}");font-weight:normal;font-style:normal;font-display:swap;}`;
        }
        const style = `<style id="widget-global-font-style">${fontFaces}html,body,body *,body *::before,body *::after,input,button,textarea,select{font-family:${fallback}!important;}</style>`;
        const script = `<script>(function(){var base='@font-face{font-family:"Geomini";src:url("https://nos.netease.com/ysf/260de1ccc0fffea1b1af12b7f5b50c3c.ttf") format("truetype");font-weight:normal;font-style:normal;}';window.addEventListener('message',async function(event){var data=event.data;if(!data||data.type!=='widget-global-font')return;var family=data.family==='default'?'Geomini':data.family;var style=document.getElementById('widget-global-font-style');if(style){var safe=String(family).replace(/\\\\/g,'\\\\\\\\').replace(/"/g,'\\\\"');style.textContent=base+'html,body,body *,body *::before,body *::after,input,button,textarea,select{font-family:"'+safe+'","Geomini",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif!important;}';}try{if(data.sourceType==='local'&&data.fontData){var localUrl='';try{var localSource=data.fontData;if(typeof Blob!=='undefined'&&localSource instanceof Blob){localUrl=URL.createObjectURL(localSource);localSource='url("'+String(localUrl).replace(/"/g,'\\"')+'")';}var loaded=await new FontFace(family,localSource).load();document.fonts.add(loaded);}finally{if(localUrl)URL.revokeObjectURL(localUrl);}}else if(data.sourceType==='url'&&data.url){var fontUrls=[data.proxyUrl,data.url].filter(Boolean),lastError=null;for(var i=0;i<fontUrls.length;i++){try{var remote=await new FontFace(family,'url("'+String(fontUrls[i]).replace(/"/g,'\\"')+'")').load();document.fonts.add(remote);lastError=null;break;}catch(err){lastError=err;}}if(lastError)throw lastError;}}catch(error){console.error('Widget font sync failed:',error);}});})();<` + `/script>`;
        return style + script;
    }

    function buildWidgetFrameSrcdoc(content) {
        const source = String(content == null ? '' : content);
        const tools = '<style>html,body{margin:0;padding:0;width:100%;height:100%;box-sizing:border-box;}</style>' + buildWidgetGlobalFontTools();
        const closingBody = /<\/body\s*>/i;
        const closingHtml = /<\/html\s*>/i;
        if (closingBody.test(source)) return source.replace(closingBody, tools + '</body>');
        return closingHtml.test(source) ? source.replace(closingHtml, tools + '</html>') : source + tools;
    }

    function syncGlobalFontToWidgetFrame(frame) {
        if (!frame || !frame.contentWindow) return;
        const font = getSelectedWidgetFontData();
        frame.contentWindow.postMessage({
            type: 'widget-global-font',
            family: font.family,
            sourceType: font.type,
            url: font.url,
            proxyUrl: font.proxyUrl,
            fontData: font.data
        }, '*');
    }

    let widgetFontSyncHandle = 0;
    let widgetFontSyncHandleType = '';
    let widgetFontSyncGeneration = 0;

    function cancelWidgetFontSync() {
        if (!widgetFontSyncHandle) return;
        if (widgetFontSyncHandleType === 'raf' && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(widgetFontSyncHandle);
        } else {
            window.clearTimeout(widgetFontSyncHandle);
        }
        widgetFontSyncHandle = 0;
        widgetFontSyncHandleType = '';
    }

    function scheduleWidgetFontSync(callback) {
        if (typeof window.requestAnimationFrame === 'function') {
            widgetFontSyncHandleType = 'raf';
            widgetFontSyncHandle = window.requestAnimationFrame(callback);
        } else {
            widgetFontSyncHandleType = 'timeout';
            widgetFontSyncHandle = window.setTimeout(callback, 16);
        }
    }

    function syncAllWidgetFonts() {
        const generation = ++widgetFontSyncGeneration;
        cancelWidgetFontSync();
        const frames = Array.from(document.querySelectorAll('.widget-render-frame, .widget-code-preview-frame, .widget-list-preview-frame'));
        let index = 0;

        const syncNext = () => {
            widgetFontSyncHandle = 0;
            widgetFontSyncHandleType = '';
            if (generation !== widgetFontSyncGeneration) return;

            const frame = frames[index++];
            if (frame) syncGlobalFontToWidgetFrame(frame);
            if (index < frames.length) scheduleWidgetFontSync(syncNext);
        };

        if (frames.length) scheduleWidgetFontSync(syncNext);
    }

    function makeWidgetFrameHTML(content, interactive) {
        const encoded = escapeWidgetSrcdoc(buildWidgetFrameSrcdoc(content));
        const pe = interactive ? 'auto' : 'none';
        const style = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:transparent;pointer-events:' + pe + ';';
        return '<iframe class="widget-render-frame" srcdoc="' + encoded + '" sandbox="allow-scripts allow-forms" style="' + style + '" title="组件" onload="syncGlobalFontToWidgetFrame(this)"></iframe>';
    }
    window.escapeWidgetSrcdoc = escapeWidgetSrcdoc;
    window.buildWidgetFrameSrcdoc = buildWidgetFrameSrcdoc;
    window.syncGlobalFontToWidgetFrame = syncGlobalFontToWidgetFrame;
    window.syncAllWidgetFonts = syncAllWidgetFonts;
    window.makeWidgetFrameHTML = makeWidgetFrameHTML;

