
(() => {
    'use strict';

    if (document.getElementById('anonymousFeedbackAppUI')) return;

    const FEEDBACK_ENDPOINT = 'https://hxydriuultrkgrhnhusy.supabase.co/functions/v1/anonymous-feedback';
    const FEEDBACK_DB_NAME = 'iOSDesktopDB';
    const FEEDBACK_STORE_NAME = 'layoutStore';
    const FEEDBACK_IDENTITY_RECORD = 'anonymousFeedbackIdentityV1';
    const MAX_SCREENSHOTS = 3;
    const MAX_CONTENT_LENGTH = 4000;
    let feedbackScreenshots = [];
    let feedbackListCache = [];
    let currentFeedbackCode = '';

    const style = document.createElement('style');
    style.id = 'anonymousFeedbackStyles';
    style.textContent = `
        .anonymous-feedback-container {
            position: absolute;
            inset: 0;
            z-index: 185;
            display: none;
            flex-direction: column;
            overflow: hidden;
            background: #f2f2f7;
            transform: translateX(100%);
            transition: transform .3s cubic-bezier(.25,.8,.25,1);
            color: #1c1c1e;
        }
        .anonymous-feedback-container.show { transform: translateX(0); }
        .af-view {
            position: absolute;
            inset: 0;
            display: none;
            flex-direction: column;
            background: #f2f2f7;
        }
        .af-view.active { display: flex; }
        .af-nav {
            position: relative;
            flex: 0 0 auto;
            min-height: calc(45px + var(--settings-top-inset, 45px));
            padding: var(--settings-top-inset, 45px) 18px 10px;
            box-sizing: border-box;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            background: rgba(242, 242, 247, .92);
            backdrop-filter: blur(18px) saturate(150%);
            -webkit-backdrop-filter: blur(18px) saturate(150%);
            z-index: 2;
        }
        .af-nav-title {
            min-height: 30px;
            display: flex;
            align-items: center;
            font-size: 17px;
            font-weight: 650;
            letter-spacing: -.25px;
        }
        .af-back-btn {
            position: absolute;
            left: 16px;
            bottom: 10px;
            width: 32px;
            height: 32px;
            border: 0;
            border-radius: 50%;
            padding: 0;
            display: grid;
            place-items: center;
            color: #111;
            background: rgba(255,255,255,.84);
            box-shadow: 0 2px 9px rgba(0,0,0,.06);
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }
        .af-back-btn svg { width: 18px; height: 18px; }
        .af-scroll {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 12px 16px calc(34px + env(safe-area-inset-bottom, 0px));
            box-sizing: border-box;
            scrollbar-width: none;
        }
        .af-scroll::-webkit-scrollbar { display: none; }
        .af-intro-card,
        .af-editor-card,
        .af-list-card,
        .af-detail-card,
        .af-reply-card {
            border: 1px solid rgba(255,255,255,.9);
            background: rgba(255,255,255,.86);
            box-shadow: 0 12px 34px rgba(61, 69, 86, .07);
            backdrop-filter: blur(18px) saturate(140%);
            -webkit-backdrop-filter: blur(18px) saturate(140%);
        }
        .af-intro-card {
            padding: 18px 17px;
            border-radius: 20px;
            margin-bottom: 12px;
        }
        .af-intro-title {
            margin: 0 0 8px;
            font-size: 19px;
            font-weight: 720;
            letter-spacing: -.25px;
        }
        .af-intro-text {
            margin: 0;
            font-size: 14px;
            line-height: 1.65;
            color: #4f4f55;
        }
        .af-private-note {
            margin-top: 12px;
            display: flex;
            align-items: center;
            gap: 7px;
            color: #77777e;
            font-size: 12px;
            line-height: 1.4;
        }
        .af-private-note svg { width: 15px; height: 15px; flex: 0 0 auto; }
        .af-editor-card {
            border-radius: 20px;
            padding: 14px;
            margin-bottom: 12px;
        }
        .af-textarea {
            width: 100%;
            min-height: 150px;
            resize: none;
            border: 0;
            outline: 0;
            padding: 4px 3px 12px;
            box-sizing: border-box;
            background: transparent;
            color: #1c1c1e;
            font: inherit;
            font-size: 15px;
            line-height: 1.6;
        }
        .af-textarea::placeholder { color: #a2a2a8; }
        .af-editor-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-top: 10px;
            border-top: .5px solid rgba(60,60,67,.12);
        }
        .af-upload-btn,
        .af-primary-btn,
        .af-row-button {
            border: 0;
            font: inherit;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }
        .af-upload-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 10px;
            border-radius: 11px;
            background: #f1f2f6;
            color: #3c3c43;
            font-size: 13px;
            font-weight: 600;
        }
        .af-upload-btn svg { width: 17px; height: 17px; }
        .af-count { color: #9a9aa0; font-size: 12px; }
        .af-screenshot-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            margin-top: 12px;
        }
        .af-shot {
            position: relative;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            border-radius: 12px;
            background: #e9e9ee;
        }
        .af-shot img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .af-shot-remove {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 25px;
            height: 25px;
            border: 0;
            border-radius: 50%;
            padding: 0;
            display: grid;
            place-items: center;
            background: rgba(20,20,22,.72);
            color: #fff;
            cursor: pointer;
        }
        .af-shot-remove svg { width: 13px; height: 13px; }
        .af-primary-btn {
            width: 100%;
            min-height: 48px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #007aff;
            color: #fff;
            font-size: 16px;
            font-weight: 680;
            box-shadow: 0 8px 20px rgba(0,122,255,.18);
        }
        .af-primary-btn:disabled { opacity: .55; cursor: default; }
        .af-primary-btn svg { width: 18px; height: 18px; }
        .af-row-button {
            width: 100%;
            min-height: 52px;
            margin-top: 12px;
            padding: 0 15px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,.86);
            color: #1c1c1e;
            border: 1px solid rgba(255,255,255,.9);
            box-shadow: 0 8px 26px rgba(61,69,86,.05);
            font-size: 15px;
            font-weight: 600;
        }
        .af-row-button-left {
            display: flex;
            align-items: center;
            gap: 9px;
        }
        .af-row-button svg { width: 18px; height: 18px; }
        .af-chevron { color: #b6b6bc; }
        .af-section-title {
            padding: 4px 5px 8px;
            color: #8e8e93;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .2px;
        }
        .af-feedback-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .af-list-card {
            padding: 14px 15px;
            border-radius: 18px;
            cursor: pointer;
        }
        .af-list-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .af-code {
            font-size: 15px;
            font-weight: 720;
            letter-spacing: .2px;
        }
        .af-status {
            flex: 0 0 auto;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 680;
        }
        .af-status.submitted { color: #8a6210; background: #fff3d4; }
        .af-status.viewed { color: #1d5f9e; background: #e6f2ff; }
        .af-status.replied { color: #21833b; background: #e7f8eb; }
        .af-preview {
            margin-top: 8px;
            color: #4b4b50;
            font-size: 14px;
            line-height: 1.45;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .af-meta {
            margin-top: 8px;
            color: #99999f;
            font-size: 11px;
        }
        .af-empty,
        .af-loading {
            padding: 44px 18px;
            text-align: center;
            color: #8e8e93;
            font-size: 14px;
            line-height: 1.6;
        }
        .af-detail-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
        }
        .af-detail-card,
        .af-reply-card {
            border-radius: 19px;
            padding: 16px;
            margin-bottom: 12px;
        }
        .af-detail-label {
            margin-bottom: 8px;
            color: #8e8e93;
            font-size: 12px;
            font-weight: 650;
        }
        .af-detail-text {
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            color: #2c2c30;
            font-size: 14px;
            line-height: 1.65;
        }
        .af-detail-shots {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-top: 12px;
        }
        .af-detail-shots img {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 12px;
            object-fit: cover;
            background: #e9e9ee;
            cursor: zoom-in;
            -webkit-tap-highlight-color: transparent;
        }
        .af-image-preview {
            position: absolute;
            inset: 0;
            z-index: 40;
            display: none;
            align-items: center;
            justify-content: center;
            padding: max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
            box-sizing: border-box;
            background: rgba(0,0,0,.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        .af-image-preview.show { display: flex; }
        .af-image-preview img {
            display: block;
            max-width: 100%;
            max-height: 88%;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 18px 60px rgba(0,0,0,.4);
        }
        .af-image-preview-close {
            position: absolute;
            top: max(14px, env(safe-area-inset-top));
            right: 14px;
            width: 40px;
            height: 40px;
            border: 0;
            border-radius: 50%;
            padding: 0;
            display: grid;
            place-items: center;
            background: rgba(255,255,255,.16);
            color: #fff;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }
        .af-image-preview-close svg { width: 20px; height: 20px; }
        .af-reply-card {
            background: rgba(235,246,255,.86);
            border-color: rgba(226,241,255,.92);
        }
        .af-copy-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-top: 8px;
            border: 0;
            padding: 0;
            background: transparent;
            color: #007aff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }
        .af-copy-btn svg { width: 14px; height: 14px; }
        .iphone.dark-mode .anonymous-feedback-container,
        .iphone.dark-mode .af-view { background: #000; color: #fff; }
        .iphone.dark-mode .af-nav { background: rgba(0,0,0,.86); }
        .iphone.dark-mode .af-back-btn,
        .iphone.dark-mode .af-intro-card,
        .iphone.dark-mode .af-editor-card,
        .iphone.dark-mode .af-list-card,
        .iphone.dark-mode .af-detail-card,
        .iphone.dark-mode .af-row-button {
            background: rgba(28,28,30,.9);
            border-color: rgba(68,68,72,.65);
            color: #fff;
        }
        .iphone.dark-mode .af-reply-card {
            background: rgba(18,45,66,.92);
            border-color: rgba(38,72,96,.7);
        }
        .iphone.dark-mode .af-intro-text,
        .iphone.dark-mode .af-preview,
        .iphone.dark-mode .af-detail-text { color: #d1d1d6; }
        .iphone.dark-mode .af-private-note,
        .iphone.dark-mode .af-meta,
        .iphone.dark-mode .af-section-title,
        .iphone.dark-mode .af-detail-label { color: #98989d; }
        .iphone.dark-mode .af-textarea { color: #fff; }
        .iphone.dark-mode .af-upload-btn { background: #2c2c2e; color: #f2f2f7; }
        .iphone.dark-mode .af-editor-footer { border-top-color: rgba(255,255,255,.1); }
        .iphone.dark-mode .af-back-btn { color: #fff; }
    `;
    document.head.appendChild(style);

    const html = `
        <div class="anonymous-feedback-container" id="anonymousFeedbackAppUI" aria-hidden="true">
            <section class="af-view active" id="anonymousFeedbackMainView">
                <div class="af-nav">
                    <button class="af-back-btn" type="button" onclick="closeAnonymousFeedbackApp()" aria-label="返回设置">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                    </button>
                    <div class="af-nav-title">匿名建议箱</div>
                </div>
                <div class="af-scroll">
                    <div class="af-intro-card">
                        <div class="af-intro-title">匿名建议箱</div>
                        <p class="af-intro-text">对提示词或者其他地方有不满意的，如果不好意思直接说，可以写在这里。</p>
                        <div class="af-private-note">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path></svg>
                            <span>建议内容不会显示你的账户名称。</span>
                        </div>
                    </div>

                    <div class="af-editor-card">
                        <textarea class="af-textarea" id="anonymousFeedbackInput" maxlength="${MAX_CONTENT_LENGTH}" placeholder="写下你的建议或问题……" oninput="updateAnonymousFeedbackCount()"></textarea>
                        <div class="af-editor-footer">
                            <button class="af-upload-btn" type="button" onclick="document.getElementById('anonymousFeedbackFileInput').click()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="8.5" cy="10" r="1.5"></circle><path d="m21 15-5-5L5 19"></path></svg>
                                <span>上传截图（可选）</span>
                            </button>
                            <span class="af-count" id="anonymousFeedbackCount">0/${MAX_CONTENT_LENGTH}</span>
                        </div>
                        <input id="anonymousFeedbackFileInput" type="file" accept="image/*" multiple hidden onchange="handleAnonymousFeedbackFiles(event)">
                        <div class="af-screenshot-grid" id="anonymousFeedbackScreenshots"></div>
                    </div>

                    <button class="af-primary-btn" id="anonymousFeedbackSubmitButton" type="button" onclick="submitAnonymousFeedback()">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.542 60.542 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.542 60.542 0 0 0 3.478 2.405Z"></path></svg>
                        <span>提交</span>
                    </button>

                    <button class="af-row-button" type="button" onclick="openAnonymousFeedbackList()">
                        <span class="af-row-button-left">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>
                            <span>我的反馈</span>
                        </span>
                        <svg class="af-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    </button>
                </div>
            </section>

            <section class="af-view" id="anonymousFeedbackListView">
                <div class="af-nav">
                    <button class="af-back-btn" type="button" onclick="showAnonymousFeedbackView('main')" aria-label="返回">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                    </button>
                    <div class="af-nav-title">我的反馈</div>
                </div>
                <div class="af-scroll">
                    <div class="af-section-title">已提交的建议</div>
                    <div class="af-feedback-list" id="anonymousFeedbackList">
                        <div class="af-loading">正在读取反馈……</div>
                    </div>
                </div>
            </section>

            <section class="af-view" id="anonymousFeedbackDetailView">
                <div class="af-nav">
                    <button class="af-back-btn" type="button" onclick="showAnonymousFeedbackView('list')" aria-label="返回">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                    </button>
                    <div class="af-nav-title">反馈详情</div>
                </div>
                <div class="af-scroll" id="anonymousFeedbackDetailScroll"></div>
            </section>
            <div class="af-image-preview" id="anonymousFeedbackImagePreview" aria-hidden="true" onclick="if(event.target===this) closeAnonymousFeedbackImagePreview()">
                <button class="af-image-preview-close" type="button" onclick="closeAnonymousFeedbackImagePreview()" aria-label="关闭预览">
                    <!-- Lucide X -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6 6 18"></path>
                    </svg>
                </button>
                <img id="anonymousFeedbackImagePreviewImage" alt="反馈截图预览">
            </div>
        </div>
    `;

    const host = document.getElementById('settingsAppUI') || document.querySelector('.iphone') || document.body;
    host.insertAdjacentHTML('beforeend', html);

    function feedbackToast(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
            return;
        }
        console.info(message);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function createRandomToken() {
        const bytes = crypto.getRandomValues(new Uint8Array(32));
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function openFeedbackDatabase() {
        if (window.db && window.db.objectStoreNames?.contains(FEEDBACK_STORE_NAME)) {
            return Promise.resolve(window.db);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(FEEDBACK_DB_NAME);
            request.onupgradeneeded = event => {
                const database = event.target.result;
                if (!database.objectStoreNames.contains(FEEDBACK_STORE_NAME)) {
                    database.createObjectStore(FEEDBACK_STORE_NAME, { keyPath: 'id' });
                }
            };
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = () => reject(request.error || new Error('无法读取本地数据'));
        });
    }

    async function getFeedbackIdentity() {
        const database = await openFeedbackDatabase();
        const existing = await new Promise((resolve, reject) => {
            const transaction = database.transaction([FEEDBACK_STORE_NAME], 'readonly');
            const request = transaction.objectStore(FEEDBACK_STORE_NAME).get(FEEDBACK_IDENTITY_RECORD);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error || new Error('无法读取匿名凭证'));
        });

        if (existing?.token && /^[a-f0-9]{64}$/i.test(existing.token)) return existing.token;

        const token = createRandomToken();
        await new Promise((resolve, reject) => {
            const transaction = database.transaction([FEEDBACK_STORE_NAME], 'readwrite');
            transaction.objectStore(FEEDBACK_STORE_NAME).put({
                id: FEEDBACK_IDENTITY_RECORD,
                token,
                createdAt: new Date().toISOString()
            });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('无法保存匿名凭证'));
            transaction.onabort = () => reject(transaction.error || new Error('无法保存匿名凭证'));
        });
        return token;
    }

    async function feedbackRequest(action, body = {}) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 18000);
        try {
            const response = await fetch(FEEDBACK_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                signal: controller.signal,
                body: JSON.stringify({ action, ...body })
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.error || '请求失败，请稍后重试');
            return payload?.data;
        } catch (error) {
            if (error?.name === 'AbortError') throw new Error('网络请求超时，请稍后重试');
            throw error;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    function formatFeedbackTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }

    function statusInfo(status) {
        if (status === 'replied') return { label: '已回复', className: 'replied' };
        if (status === 'viewed') return { label: '已查看', className: 'viewed' };
        return { label: '已提交', className: 'submitted' };
    }

    function setFeedbackView(viewName) {
        const ids = {
            main: 'anonymousFeedbackMainView',
            list: 'anonymousFeedbackListView',
            detail: 'anonymousFeedbackDetailView'
        };
        Object.entries(ids).forEach(([name, id]) => {
            document.getElementById(id)?.classList.toggle('active', name === viewName);
        });
    }

    async function compressFeedbackImage(file) {
        if (!file?.type?.startsWith('image/')) throw new Error('请选择图片文件');

        const source = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('截图读取失败'));
            reader.readAsDataURL(file);
        });

        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('截图解析失败'));
            img.src = source;
        });

        const maxSide = 1280;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
        const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
        const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { alpha: false });
        context.drawImage(image, 0, 0, width, height);

        let quality = .78;
        let result = canvas.toDataURL('image/jpeg', quality);
        while (result.length > 820000 && quality > .46) {
            quality -= .08;
            result = canvas.toDataURL('image/jpeg', quality);
        }
        if (result.length > 880000) throw new Error('截图过大，请裁剪后再上传');
        return result;
    }

    function renderFeedbackScreenshots() {
        const container = document.getElementById('anonymousFeedbackScreenshots');
        if (!container) return;
        container.innerHTML = feedbackScreenshots.map((src, index) => `
            <div class="af-shot">
                <img src="${src}" alt="截图 ${index + 1}">
                <button class="af-shot-remove" type="button" onclick="removeAnonymousFeedbackScreenshot(${index})" aria-label="移除截图">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>
                </button>
            </div>
        `).join('');
    }

    async function loadFeedbackList() {
        const list = document.getElementById('anonymousFeedbackList');
        if (!list) return;
        list.innerHTML = '<div class="af-loading">正在读取反馈……</div>';
        try {
            const token = await getFeedbackIdentity();
            feedbackListCache = await feedbackRequest('list', { token }) || [];
            if (!feedbackListCache.length) {
                list.innerHTML = '<div class="af-empty">这里还没有提交过的建议。</div>';
                return;
            }

            list.innerHTML = feedbackListCache.map(item => {
                const status = statusInfo(item.status);
                return `
                    <article class="af-list-card" role="button" tabindex="0" onclick="openAnonymousFeedbackDetail('${escapeHtml(item.public_code)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openAnonymousFeedbackDetail('${escapeHtml(item.public_code)}');}">
                        <div class="af-list-top">
                            <span class="af-code">${escapeHtml(item.public_code)}</span>
                            <span class="af-status ${status.className}">${status.label}</span>
                        </div>
                        <div class="af-preview">${escapeHtml(item.content)}</div>
                        <div class="af-meta">${escapeHtml(formatFeedbackTime(item.created_at))}</div>
                    </article>
                `;
            }).join('');
        } catch (error) {
            list.innerHTML = `<div class="af-empty">${escapeHtml(error?.message || '读取失败，请稍后重试')}</div>`;
        }
    }

    async function loadFeedbackDetail(publicCode) {
        const scroll = document.getElementById('anonymousFeedbackDetailScroll');
        if (!scroll) return;
        scroll.innerHTML = '<div class="af-loading">正在读取反馈……</div>';
        try {
            const token = await getFeedbackIdentity();
            const item = await feedbackRequest('detail', { token, publicCode });
            currentFeedbackCode = item.public_code;
            const status = statusInfo(item.status);
            const screenshots = Array.isArray(item.screenshots) ? item.screenshots : [];
            const screenshotHtml = screenshots.length
                ? `<div class="af-detail-shots">${screenshots.map((src, index) => `<img src="${src}" alt="反馈截图 ${index + 1}" onclick="openAnonymousFeedbackImagePreview(this.src)">`).join('')}</div>`
                : '';
            const replyHtml = item.admin_reply
                ? `
                    <div class="af-reply-card">
                        <div class="af-detail-label">开发者回复</div>
                        <div class="af-detail-text">${escapeHtml(item.admin_reply)}</div>
                    </div>
                `
                : `
                    <div class="af-reply-card">
                        <div class="af-detail-label">开发者回复</div>
                        <div class="af-detail-text" style="color:#8e8e93;">暂未回复。</div>
                    </div>
                `;

            scroll.innerHTML = `
                <div class="af-detail-head">
                    <div>
                        <div class="af-code">${escapeHtml(item.public_code)}</div>
                        <button class="af-copy-btn" type="button" onclick="copyAnonymousFeedbackCode()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span>复制编号</span>
                        </button>
                    </div>
                    <span class="af-status ${status.className}">${status.label}</span>
                </div>
                <div class="af-detail-card">
                    <div class="af-detail-label">我提交的内容</div>
                    <div class="af-detail-text">${escapeHtml(item.content)}</div>
                    ${screenshotHtml}
                    <div class="af-meta">${escapeHtml(formatFeedbackTime(item.created_at))}</div>
                </div>
                ${replyHtml}
            `;
        } catch (error) {
            scroll.innerHTML = `<div class="af-empty">${escapeHtml(error?.message || '读取失败，请稍后重试')}</div>`;
        }
    }

    window.openAnonymousFeedbackApp = function () {
        const app = document.getElementById('anonymousFeedbackAppUI');
        if (!app) return;
        app.style.display = 'flex';
        app.setAttribute('aria-hidden', 'false');
        setFeedbackView('main');
        window.requestAnimationFrame(() => app.classList.add('show'));
    };

    window.closeAnonymousFeedbackApp = function () {
        const app = document.getElementById('anonymousFeedbackAppUI');
        if (!app) return;
        app.classList.remove('show');
        app.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => {
            app.style.display = 'none';
            setFeedbackView('main');
        }, 300);
    };

    window.showAnonymousFeedbackView = function (viewName) {
        setFeedbackView(viewName);
        if (viewName === 'list') loadFeedbackList();
    };

    window.openAnonymousFeedbackList = function () {
        setFeedbackView('list');
        loadFeedbackList();
    };

    window.openAnonymousFeedbackDetail = function (publicCode) {
        currentFeedbackCode = String(publicCode || '');
        setFeedbackView('detail');
        loadFeedbackDetail(currentFeedbackCode);
    };

    window.updateAnonymousFeedbackCount = function () {
        const input = document.getElementById('anonymousFeedbackInput');
        const count = document.getElementById('anonymousFeedbackCount');
        if (input && count) count.textContent = `${input.value.length}/${MAX_CONTENT_LENGTH}`;
    };

    window.handleAnonymousFeedbackFiles = async function (event) {
        const input = event?.target;
        const files = Array.from(input?.files || []);
        if (!files.length) return;

        const available = MAX_SCREENSHOTS - feedbackScreenshots.length;
        if (available <= 0) {
            feedbackToast('最多上传 3 张截图');
            if (input) input.value = '';
            return;
        }

        try {
            for (const file of files.slice(0, available)) {
                feedbackScreenshots.push(await compressFeedbackImage(file));
            }
            if (files.length > available) feedbackToast('最多上传 3 张截图');
            renderFeedbackScreenshots();
        } catch (error) {
            feedbackToast(error?.message || '截图处理失败');
        } finally {
            if (input) input.value = '';
        }
    };

    window.removeAnonymousFeedbackScreenshot = function (index) {
        feedbackScreenshots.splice(Number(index), 1);
        renderFeedbackScreenshots();
    };

    window.submitAnonymousFeedback = async function () {
        const input = document.getElementById('anonymousFeedbackInput');
        const button = document.getElementById('anonymousFeedbackSubmitButton');
        const content = String(input?.value || '').trim();
        if (!content) {
            feedbackToast('请先写下你的建议或问题');
            input?.focus();
            return;
        }

        if (button) {
            button.disabled = true;
            button.querySelector('span').textContent = '提交中…';
        }

        try {
            const token = await getFeedbackIdentity();
            const result = await feedbackRequest('submit', {
                token,
                content,
                screenshots: feedbackScreenshots
            });
            if (input) input.value = '';
            feedbackScreenshots = [];
            renderFeedbackScreenshots();
            window.updateAnonymousFeedbackCount();
            feedbackToast(`已提交，反馈编号 ${result.public_code}`);
            setFeedbackView('list');
            await loadFeedbackList();
        } catch (error) {
            feedbackToast(error?.message || '提交失败，请稍后重试');
        } finally {
            if (button) {
                button.disabled = false;
                button.querySelector('span').textContent = '提交';
            }
        }
    };

    window.openAnonymousFeedbackImagePreview = function (src) {
        const modal = document.getElementById('anonymousFeedbackImagePreview');
        const image = document.getElementById('anonymousFeedbackImagePreviewImage');
        if (!modal || !image || !src) return;
        image.src = src;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    };

    window.closeAnonymousFeedbackImagePreview = function () {
        const modal = document.getElementById('anonymousFeedbackImagePreview');
        const image = document.getElementById('anonymousFeedbackImagePreviewImage');
        if (!modal || !image) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        image.removeAttribute('src');
    };

    window.copyAnonymousFeedbackCode = async function () {
        if (!currentFeedbackCode) return;
        try {
            await navigator.clipboard.writeText(currentFeedbackCode);
            feedbackToast('反馈编号已复制');
        } catch (_) {
            feedbackToast(currentFeedbackCode);
        }
    };
})();
