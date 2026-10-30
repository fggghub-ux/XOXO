/* ========================================================================
 * Readen bundled runtime
 * The extension modules below preserve the previous index.html execution order.
 * ======================================================================== */

/* ========================================================================
 * Bundled module: readen-reader-enhancements.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-reader-enhancements-style';
    const nativeSetTimeout = window.setTimeout.bind(window);
    let titleStyleProbe = false;
    let readerWasActive = false;
    let legacyReaderBackground = null;
    let pendingReaderSync = 0;
    let readerMetaCache = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.readen-app-container #readen-reader-content,
.readen-app-container #readen-reader-content .readen-reader-paragraph,
.readen-app-container #readen-reader-content .readen-reader-paragraph *,
.readen-app-container #readen-reader-content .readen-enhanced-chapter-heading,
.readen-app-container #readen-reader-content .readen-enhanced-chapter-heading * {
    font-family: var(--readen-reader-font-family, var(--app-global-font-family)) !important;
}
.readen-app-container .reader-content {
    padding-top: calc(44px + var(--safe-top)) !important;
}
.readen-app-container .readen-enhanced-chapter-heading {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    margin: 0 0 1.35em;
    padding: 12px 4px 16px;
    box-sizing: border-box;
    color: inherit;
    line-height: 1.35;
    text-align: center;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    user-select: none;
    -webkit-user-select: none;
}
.readen-app-container .readen-enhanced-chapter-heading .readen-heading-order {
    font-size: .72em;
    opacity: .58;
    letter-spacing: .08em;
}
.readen-app-container .readen-enhanced-chapter-heading .readen-heading-title {
    font-size: 1.28em;
    font-weight: 800;
    letter-spacing: .02em;
}
.readen-app-container #readen-reader-container[data-readen-title-style="quiet-space"] .readen-enhanced-chapter-heading { border-bottom: 1px solid rgba(120,120,128,.2); }
.readen-app-container #readen-reader-container[data-readen-title-style="ink-double"] .readen-enhanced-chapter-heading { border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 14px 6px; opacity: .9; }
.readen-app-container #readen-reader-container[data-readen-title-style="left-mark"] .readen-enhanced-chapter-heading { align-items: flex-start; text-align: left; border-left: 4px solid #7a8fa5; padding: 8px 0 8px 14px; }
.readen-app-container #readen-reader-container[data-readen-title-style="dark-card"] .readen-enhanced-chapter-heading { background: #26272a; color: #fff; border-radius: 14px; padding: 16px; }
.readen-app-container #readen-reader-container[data-readen-title-style="crimson-order"] .readen-heading-order { color: #5b3b70; opacity: 1; font-weight: 800; }
.readen-app-container #readen-reader-container[data-readen-title-style="crimson-order"] .readen-heading-title { color: #9c2f3e; }
.readen-app-container #readen-reader-container[data-readen-title-style="sea-label"] .readen-enhanced-chapter-heading { align-items: flex-start; text-align: left; }
.readen-app-container #readen-reader-container[data-readen-title-style="sea-label"] .readen-heading-order { background: #527c8d; color: #fff; opacity: 1; border-radius: 5px; padding: 4px 8px; }
.readen-app-container #readen-reader-container[data-readen-title-style="center-badge"] .readen-heading-order { align-self: center; background: rgba(107,130,153,.15); opacity: 1; border-radius: 999px; padding: 4px 12px; }
.readen-app-container #readen-reader-container[data-readen-title-style="border-index"] .readen-enhanced-chapter-heading { border: 1px solid rgba(107,130,153,.55); border-left-width: 5px; border-radius: 8px; text-align: left; align-items: flex-start; padding: 14px; }
.readen-app-container #readen-reader-container[data-readen-title-style="giant-order"] .readen-heading-order { font-size: 2.35em; line-height: 1; opacity: .12; font-weight: 900; }
.readen-app-container #readen-reader-container[data-readen-title-style="mist-card"] .readen-enhanced-chapter-heading { background: rgba(245,245,242,.84); box-shadow: 0 8px 26px rgba(0,0,0,.06); border-radius: 13px; padding: 17px 14px; }
.readen-app-container #readen-reader-container[data-readen-title-style="reverse-title"] .readen-enhanced-chapter-heading { text-align: right; align-items: flex-end; }
.readen-app-container #readen-reader-container[data-readen-title-style="reverse-title"] .readen-heading-title { order: -1; }
.readen-app-container #readen-reader-container[data-readen-title-style="seal-drop"] .readen-heading-order { align-self: center; width: 3.7em; min-height: 3.7em; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #a54444; color: #a54444; opacity: 1; border-radius: 7px; padding: 4px; }
.readen-app-container #readen-reader-container[data-readen-title-style="ticket-page"] .readen-enhanced-chapter-heading { background: #f4ead7; border: 1px dashed #b8a88f; border-radius: 12px; padding: 16px 14px; color: #574d42; }
.readen-app-container #readen-reader-container[data-readen-title-style="half-marker"] .readen-enhanced-chapter-heading { align-items: flex-start; text-align: left; border-bottom: 1px solid rgba(107,130,153,.35); }
.readen-app-container #readen-reader-container[data-readen-title-style="half-marker"] .readen-heading-order { background: linear-gradient(transparent 48%, rgba(107,130,153,.28) 48%); opacity: 1; }
.readen-app-container #readen-reader-container[data-readen-title-style="paper-rite"] .readen-enhanced-chapter-heading { background: rgba(241,236,224,.72); border-radius: 4px; padding: 18px 16px; text-align: left; align-items: flex-start; box-shadow: inset -4px 0 0 rgba(120,95,75,.18); }
.readen-app-container .readen-enhanced-bookmarks-pane { overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 18px; }
.readen-app-container .readen-enhanced-bookmarks-pane .readen-annotation-list { padding: 4px 0 20px; }
.readen-app-container .readen-enhanced-bookmarks-loading { padding: 42px 20px; text-align: center; color: #8a8a8e; font-size: 14px; }
`;
        document.head.appendChild(style);
    }

    function getReader() {
        return document.getElementById('readen-reader-container');
    }

    function getReaderContent() {
        return document.getElementById('readen-reader-content');
    }

    function getReaderWrapper() {
        return document.getElementById('readen-reader-scroll-wrapper');
    }

    function escapeText(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));
    }

    function normalizeBookTitle(value) {
        return String(value || '').replace(/^.*?《/, '').replace(/》.*$/, '').trim();
    }

    function parseDrawerMeta(drawer) {
        if (!drawer) return null;
        const rawTitle = drawer.querySelector('.drawer-book-title')?.textContent || '';
        const rawMeta = drawer.querySelector('.drawer-book-meta')?.textContent || '';
        const titleMatch = rawTitle.match(/《(.+?)》/);
        const progressMatch = rawMeta.match(/([\d.]+)%/);
        const meta = {
            title: titleMatch ? titleMatch[1].trim() : normalizeBookTitle(rawTitle),
            chapterTitle: rawMeta.split(' · ')[0]?.trim() || '正文',
            progress: progressMatch ? progressMatch[1] : ''
        };
        readerMetaCache = meta;
        return meta;
    }

    function probeReaderMeta(force) {
        if (!force && readerMetaCache) return readerMetaCache;
        const existingDrawer = document.getElementById('readen-reader-chapter-drawer');
        if (existingDrawer) return parseDrawerMeta(existingDrawer);
        const chapterButton = document.getElementById('readen-reader-chapter-btn');
        if (!chapterButton || !getReader()?.classList.contains('active')) return null;
        chapterButton.click();
        const drawer = document.getElementById('readen-reader-chapter-drawer');
        const meta = parseDrawerMeta(drawer);
        if (drawer) drawer.remove();
        return meta;
    }

    function splitChapterTitle(value) {
        const text = String(value || '').trim() || '正文';
        const match = text.match(/^((?:第\s*[\d零一二三四五六七八九十百千万两]+\s*[章节回卷篇话集]|chapter\s+\d+))\s*[:：·\-—]?\s*(.*)$/i);
        if (!match) return { order: '', title: text };
        return { order: match[1], title: match[2] || match[1] };
    }

    function ensureChapterHeading() {
        const reader = getReader();
        const content = getReaderContent();
        if (!reader?.classList.contains('active') || !content) return;
        if (content.querySelector('.readen-reader-epub-image') && !content.querySelector('.readen-reader-paragraph')) return;
        const meta = probeReaderMeta();
        if (!meta?.chapterTitle) return;
        const parts = splitChapterTitle(meta.chapterTitle);
        let heading = content.querySelector(':scope > .readen-enhanced-chapter-heading');
        const firstEpubHeading = content.querySelector(':scope > .readen-reader-epub-heading');
        if (!heading && firstEpubHeading && firstEpubHeading.textContent.trim() === meta.chapterTitle.trim()) {
            heading = firstEpubHeading;
            heading.classList.add('readen-enhanced-chapter-heading');
            heading.innerHTML = `<span class="readen-heading-order">${escapeText(parts.order)}</span><span class="readen-heading-title">${escapeText(parts.title)}</span>`;
        }
        if (!heading) {
            heading = document.createElement('div');
            heading.className = 'readen-enhanced-chapter-heading';
            content.insertBefore(heading, content.firstChild);
        }
        if (heading.dataset.chapterTitle !== meta.chapterTitle || !heading.children.length) {
            heading.dataset.chapterTitle = meta.chapterTitle;
            heading.innerHTML = `<span class="readen-heading-order">${escapeText(parts.order)}</span><span class="readen-heading-title">${escapeText(parts.title)}</span>`;
        }
        const order = heading.querySelector('.readen-heading-order');
        if (order) order.style.display = parts.order ? '' : 'none';
    }

    function applyTitleStyle(styleId) {
        const reader = getReader();
        if (!reader || !styleId) return;
        reader.dataset.readenTitleStyle = styleId;
        ensureChapterHeading();
    }

    function restoreTitleStyleFromCore() {
        if (titleStyleProbe) return;
        const reader = getReader();
        const button = document.getElementById('readen-reader-title-style-btn');
        const panel = document.getElementById('readen-reader-title-style-panel');
        if (!reader?.classList.contains('active') || !button || !panel) return;
        titleStyleProbe = true;
        try {
            button.click();
            const active = document.querySelector('#readen-reader-title-style-list [data-title-style].active');
            applyTitleStyle(active?.dataset.titleStyle || 'quiet-space');
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        } finally {
            titleStyleProbe = false;
        }
    }

    function syncReaderFont() {
        const content = getReaderContent();
        if (!content) return;
        const family = content.style.fontFamily || 'var(--app-global-font-family)';
        if (content.style.getPropertyValue('--readen-reader-font-family') !== family) {
            content.style.setProperty('--readen-reader-font-family', family);
        }
        document.querySelectorAll('#readen-reader-font-list [data-reader-font-id]').forEach(item => {
            const familyValue = item.style.fontFamily;
            if (!familyValue) return;
            item.style.setProperty('font-family', familyValue, 'important');
            item.querySelectorAll('*').forEach(child => child.style.setProperty('font-family', familyValue, 'important'));
        });
    }

    function syncReaderBackground(forceLegacy) {
        const reader = getReader();
        const wrapper = getReaderWrapper();
        const content = getReaderContent();
        if (!reader || !wrapper || !content) return;
        let image = reader.style.backgroundImage || '';
        let color = reader.style.backgroundColor || '';
        if (forceLegacy && legacyReaderBackground?.image) {
            image = legacyReaderBackground.image;
            color = legacyReaderBackground.color || 'transparent';
            reader.style.backgroundImage = image;
            reader.style.backgroundColor = color;
            reader.style.backgroundSize = 'cover';
            reader.style.backgroundPosition = 'center center';
            reader.style.backgroundRepeat = 'no-repeat';
        }
        wrapper.style.backgroundImage = image && image !== 'none' ? image : 'none';
        wrapper.style.backgroundColor = color || 'transparent';
        wrapper.style.backgroundSize = image && image !== 'none' ? 'cover' : '';
        wrapper.style.backgroundPosition = image && image !== 'none' ? 'center center' : '';
        wrapper.style.backgroundRepeat = image && image !== 'none' ? 'no-repeat' : '';
        if (image && image !== 'none') content.style.setProperty('background-color', 'transparent', 'important');
        else content.style.removeProperty('background-color');
    }

    function rememberLegacyBackground() {
        const app = document.getElementById('readenAppUI');
        if (!app) return;
        const image = app.style.backgroundImage;
        if (image && image !== 'none') {
            legacyReaderBackground = { image, color: app.style.getPropertyValue('--bg-color') || 'transparent' };
        }
    }

    function getWechatContacts() {
        try {
            if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) return wcContactsList;
        } catch (error) {
            console.debug('[Readen] WeChat contact scope unavailable', error);
        }
        return Array.isArray(window.wcContactsList) ? window.wcContactsList : [];
    }

    function closeReaderToolPanels() {
        document.querySelectorAll('#readen-reader-container .reader-tool-panel.active').forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
    }

    function shareCurrentBookToWechat() {
        const contacts = getWechatContacts();
        if (!contacts.length) {
            window.showToast?.('微信联系人列表为空');
            return;
        }
        if (typeof window.wcAppendChatMessage !== 'function') {
            window.showToast?.('微信聊天功能尚未加载，请先打开一次微信');
            return;
        }
        const meta = probeReaderMeta(true) || { title: '当前书籍', chapterTitle: '正文', progress: '' };
        closeReaderToolPanels();
        const items = contacts.map(contact => ({
            label: contact.remark || contact.name || '未命名角色',
            value: contact.id
        })).filter(item => item.value != null);
        if (typeof window.openUniversalSelect !== 'function') {
            window.showToast?.('角色选择器尚未加载');
            return;
        }
        window.openUniversalSelect({
            title: '分享书籍给角色',
            items,
            currentValue: '',
            searchable: true,
            onSelect: contactId => {
                const contact = contacts.find(item => String(item.id) === String(contactId));
                const text = `【分享书籍】\n《${meta.title}》\n${meta.chapterTitle}${meta.progress ? ` · ${meta.progress}%` : ''}`;
                window.wcAppendChatMessage(text, 'sent', contactId);
                window.showToast?.(`已分享给 ${contact?.remark || contact?.name || '角色'}`);
            }
        });
    }

    function normalizeDetailTitle() {
        return normalizeBookTitle(document.getElementById('readen-bd-title')?.textContent || '');
    }

    function findBookCardByTitle(title) {
        return Array.from(document.querySelectorAll('#readenAppUI .book-card')).find(card => {
            return Array.from(card.querySelectorAll('*')).some(node => node.children.length === 0 && node.textContent.trim() === title);
        }) || null;
    }

    function wait(ms) {
        return new Promise(resolve => nativeSetTimeout(resolve, ms));
    }

    async function ensureDetailsForBook(title) {
        if (!title) return false;
        if (normalizeDetailTitle() === title) return true;
        const card = findBookCardByTitle(title);
        if (card) {
            card.click();
            await wait(0);
            if (normalizeDetailTitle() === title) return true;
        }
        const searchTab = document.querySelector('.readen-search-tab[data-search-mode="bookshelf"]');
        const input = document.getElementById('readen-search-input');
        if (!searchTab || !input) return false;
        searchTab.click();
        input.value = title;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait(340);
        const result = Array.from(document.querySelectorAll('#readen-search-results [data-book-id]')).find(item => {
            return item.querySelector('.readen-search-result-title')?.textContent.trim() === title;
        });
        if (!result) return false;
        result.click();
        await wait(0);
        return normalizeDetailTitle() === title;
    }

    async function renderDrawerBookmarks(drawer) {
        const pane = drawer.querySelector('#drawer-pane-bookmarks-enhanced');
        if (!pane) return;
        const meta = parseDrawerMeta(drawer);
        pane.innerHTML = '<div class="readen-enhanced-bookmarks-loading">正在读取本书书签…</div>';
        const ready = await ensureDetailsForBook(meta?.title || '');
        if (!drawer.isConnected || !pane.isConnected) return;
        if (!ready) {
            pane.innerHTML = '<div class="readen-enhanced-bookmarks-loading">暂时无法读取这本书的书签</div>';
            return;
        }
        const bookmarkTab = document.querySelector('.bd-tab[data-target="bookmarks"]');
        if (!bookmarkTab) {
            pane.innerHTML = '<div class="readen-enhanced-bookmarks-loading">暂无书签</div>';
            return;
        }
        bookmarkTab.click();
        await wait(0);
        const source = document.getElementById('readen-bd-chapter-list');
        pane.innerHTML = source?.innerHTML || '<div class="readen-enhanced-bookmarks-loading">暂无书签</div>';
        pane.querySelectorAll('[data-book-detail-bookmark-id]').forEach(proxy => {
            proxy.addEventListener('click', () => {
                const id = proxy.dataset.bookDetailBookmarkId;
                const sourceItem = document.querySelector(`#readen-bd-chapter-list [data-book-detail-bookmark-id="${CSS.escape(id)}"]`);
                if (!sourceItem) return;
                sourceItem.click();
                drawer.remove();
            });
        });
    }

    function enhanceDrawer(drawer) {
        if (!drawer || drawer.dataset.readenEnhanced === '1') return;
        drawer.dataset.readenEnhanced = '1';
        const tabs = drawer.querySelector('.drawer-tabs');
        const contentArea = drawer.querySelector('.drawer-content-area');
        if (!tabs || !contentArea) return;
        const tab = document.createElement('div');
        tab.className = 'drawer-tab';
        tab.dataset.target = 'bookmarks-enhanced';
        tab.textContent = '书签';
        tabs.insertBefore(tab, tabs.querySelector('[data-target="stats"]') || null);
        const pane = document.createElement('div');
        pane.className = 'drawer-pane readen-enhanced-bookmarks-pane';
        pane.id = 'drawer-pane-bookmarks-enhanced';
        contentArea.appendChild(pane);
        tab.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            drawer.querySelectorAll('.drawer-tab').forEach(item => item.classList.toggle('active', item === tab));
            drawer.querySelectorAll('.drawer-pane').forEach(item => item.classList.toggle('active', item === pane));
            renderDrawerBookmarks(drawer);
        });
    }

    function syncReaderState() {
        pendingReaderSync = 0;
        injectStyles();
        const reader = getReader();
        if (!reader) return;
        const active = reader.classList.contains('active');
        syncReaderFont();
        syncReaderBackground(false);
        if (active && !readerWasActive) {
            readerMetaCache = null;
            restoreTitleStyleFromCore();
            ensureChapterHeading();
        } else if (active) {
            ensureChapterHeading();
        }
        if (!active) readerMetaCache = null;
        readerWasActive = active;
    }

    function scheduleReaderSync() {
        if (pendingReaderSync) return;
        pendingReaderSync = nativeSetTimeout(syncReaderState, 0);
    }

    function handleClickCapture(event) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target || !target.closest('#readenAppUI')) return;
        const shareButton = target.closest('#readen-reader-share-btn');
        if (shareButton) {
            event.preventDefault();
            event.stopImmediatePropagation();
            shareCurrentBookToWechat();
            return;
        }
        const styleCard = target.closest('#readen-reader-title-style-list [data-title-style]');
        if (styleCard) {
            applyTitleStyle(styleCard.dataset.titleStyle);
            return;
        }
        if (target.closest('#readen-reader-title-style-btn') && !titleStyleProbe) {
            nativeSetTimeout(() => {
                const active = document.querySelector('#readen-reader-title-style-list [data-title-style].active');
                if (active) applyTitleStyle(active.dataset.titleStyle);
            }, 0);
        }
        if (target.closest('#readen-reader-font-list [data-reader-font-id]')) {
            nativeSetTimeout(syncReaderFont, 0);
        }
        if (target.closest('#readen-reader-theme-strip [data-reader-theme-id], #readen-reader-bg-local-btn, #readen-reader-bg-url-btn')) {
            nativeSetTimeout(() => syncReaderBackground(false), 0);
        }
        if (target.closest('#readen-bg-list-container .my-list-item')) {
            nativeSetTimeout(() => {
                rememberLegacyBackground();
                syncReaderBackground(true);
            }, 0);
        }
    }

    function observeDom() {
        const observer = new MutationObserver(records => {
            for (const record of records) {
                if (record.type === 'childList') {
                    record.addedNodes.forEach(node => {
                        if (!(node instanceof Element)) return;
                        if (node.id === 'readen-reader-chapter-drawer') { parseDrawerMeta(node); enhanceDrawer(node); }
                        node.querySelectorAll?.('#readen-reader-chapter-drawer').forEach(drawer => { parseDrawerMeta(drawer); enhanceDrawer(drawer); });
                    });
                }
                if (record.target?.id === 'readen-reader-content' || record.target?.id === 'readen-reader-container') {
                    if (record.target?.id === 'readen-reader-content' && record.type === 'childList') readerMetaCache = null;
                    scheduleReaderSync();
                }
            }
        });
        const root = document.getElementById('readenAppUI') || document.documentElement;
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }

    injectStyles();
    document.addEventListener('click', handleClickCapture, true);
    observeDom();
    nativeSetTimeout(() => {
        rememberLegacyBackground();
        document.querySelectorAll('#readen-reader-chapter-drawer').forEach(enhanceDrawer);
        syncReaderState();
    }, 0);
})();

/* ========================================================================
 * Bundled module: readen-title-style-custom.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const UI_STYLE_ID = 'readen-custom-title-ui-style';
    const LIVE_STYLE_ID = 'readen-custom-title-live-style';
    const PREVIEW_STYLE_ID = 'readen-custom-title-preview-style';
    const DB_NAME = 'ReadenCustomTitleStyleDB';
    const DB_STORE = 'settings';
    const DB_KEY = 'custom-title-css';
    const MAX_CSS_LENGTH = 12000;
    const LIVE_SCOPE = '#readen-reader-container[data-readen-title-style="custom-css"]';
    const PREVIEW_SCOPE = '.readen-custom-title-preview-scope';
    const DEFAULT_CUSTOM_CSS = `${LIVE_SCOPE} .readen-enhanced-chapter-heading {
    align-items: flex-start;
    text-align: left;
    gap: 8px;
    padding: 14px 16px;
    border-left: 4px solid #7188a0;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.62);
    box-shadow: 0 8px 24px rgba(36, 48, 64, 0.08);
}

${LIVE_SCOPE} .readen-heading-order {
    font-size: 0.72em;
    font-weight: 700;
    letter-spacing: 0.12em;
    opacity: 0.56;
}

${LIVE_SCOPE} .readen-heading-title {
    font-size: 1.32em;
    font-weight: 800;
    letter-spacing: 0.02em;
}`;

    let cachedCss = '';
    let cssLoaded = false;
    let editorExpanded = false;
    let renderQueued = false;

    function showToast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
    }

    function injectUiStyle() {
        if (document.getElementById(UI_STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = UI_STYLE_ID;
        style.textContent = `
.readen-app-container .reader-title-custom-card {
    grid-column: 1 / -1;
    margin-top: 4px;
    border-radius: 22px;
    border: 1px solid rgba(118, 126, 140, .14);
    background: rgba(255, 255, 255, .72);
    box-shadow: 0 8px 26px rgba(36, 48, 64, .07);
    overflow: hidden;
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
}
.readen-app-container .reader-title-custom-card.is-active {
    border-color: rgba(93, 119, 146, .48);
    box-shadow: 0 9px 28px rgba(73, 99, 126, .12);
}
.readen-app-container .reader-title-custom-toggle {
    width: 100%;
    min-height: 62px;
    padding: 11px 14px;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 11px;
    color: #25282d;
    text-align: left;
    cursor: pointer;
}
.readen-app-container .reader-title-custom-pill {
    min-width: 42px;
    height: 28px;
    padding: 0 11px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(105, 128, 151, .12);
    color: #5e7690;
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
}
.readen-app-container .reader-title-custom-copy {
    min-width: 0;
    flex: 1;
}
.readen-app-container .reader-title-custom-copy strong {
    display: block;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 800;
}
.readen-app-container .reader-title-custom-copy span {
    display: block;
    margin-top: 3px;
    color: #8a8d93;
    font-size: 11px;
    line-height: 1.35;
    font-weight: 500;
}
.readen-app-container .reader-title-custom-chevron {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: transform .2s ease;
}
.readen-app-container .reader-title-custom-card.expanded .reader-title-custom-chevron {
    transform: rotate(90deg);
}
.readen-app-container .reader-title-custom-editor {
    display: none;
    padding: 0 12px 14px;
}
.readen-app-container .reader-title-custom-card.expanded .reader-title-custom-editor {
    display: block;
}
.readen-app-container .reader-title-custom-preview-scope {
    margin: 0 2px 11px;
    padding: 12px;
    border-radius: 16px;
    background: rgba(244, 246, 248, .82);
    overflow: hidden;
}
.readen-app-container .reader-title-custom-preview-scope .readen-enhanced-chapter-heading {
    margin: 0;
}
.readen-app-container .reader-title-custom-field {
    padding: 12px;
    border-radius: 16px;
    background: rgba(244, 246, 248, .88);
}
.readen-app-container .reader-title-custom-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
}
.readen-app-container .reader-title-custom-field-head strong {
    font-size: 13px;
    font-weight: 800;
}
.readen-app-container .reader-title-custom-count {
    color: #92959a;
    font-size: 10px;
    font-weight: 600;
}
.readen-app-container .reader-title-custom-css {
    width: 100%;
    min-height: 196px;
    max-height: 310px;
    resize: vertical;
    border: 1px solid rgba(118, 126, 140, .14);
    border-radius: 13px;
    padding: 11px 12px;
    outline: none;
    background: rgba(255, 255, 255, .92);
    color: #2c3036;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.55;
    -webkit-user-select: text;
    user-select: text;
}
.readen-app-container .reader-title-custom-css:focus {
    border-color: rgba(78, 111, 145, .46);
    box-shadow: 0 0 0 3px rgba(78, 111, 145, .08);
}
.readen-app-container .reader-title-custom-hint {
    margin: 8px 2px 0;
    color: #888c93;
    font-size: 10px;
    line-height: 1.5;
    font-weight: 500;
}
.readen-app-container .reader-title-custom-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 11px;
}
.readen-app-container .reader-title-custom-action {
    min-height: 34px;
    padding: 0 13px;
    border: 1px solid rgba(92, 109, 126, .15);
    border-radius: 999px;
    background: rgba(255, 255, 255, .9);
    color: #53677d;
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
}
.readen-app-container .reader-title-custom-action.primary {
    margin-left: auto;
    border-color: transparent;
    background: #657f9a;
    color: #fff;
    padding-inline: 17px;
}
.readen-app-container.readen-night-mode .reader-title-custom-card,
.readen-app-container.readen-night-mode .reader-title-custom-toggle,
.readen-app-container.readen-night-mode .reader-title-custom-css,
.readen-app-container.readen-night-mode .reader-title-custom-action {
    background: rgba(37, 38, 41, .9);
    color: #d4d4d7;
}
.readen-app-container.readen-night-mode .reader-title-custom-field,
.readen-app-container.readen-night-mode .reader-title-custom-preview-scope {
    background: rgba(47, 48, 51, .86);
}
`;
        document.head.appendChild(style);
    }

    function getOrCreateStyle(id) {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            document.head.appendChild(style);
        }
        return style;
    }

    function applyCss(css) {
        const value = String(css || '').slice(0, MAX_CSS_LENGTH);
        getOrCreateStyle(LIVE_STYLE_ID).textContent = value;
        getOrCreateStyle(PREVIEW_STYLE_ID).textContent = value.split(LIVE_SCOPE).join(PREVIEW_SCOPE);
    }

    function openDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
            };
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = () => reject(request.error || new Error('无法打开阅读标题样式存储'));
        });
    }

    async function readStoredCss() {
        if (cssLoaded) return cachedCss || DEFAULT_CUSTOM_CSS;
        try {
            const db = await openDb();
            const value = await new Promise((resolve, reject) => {
                const transaction = db.transaction(DB_STORE, 'readonly');
                const request = transaction.objectStore(DB_STORE).get(DB_KEY);
                request.onsuccess = () => resolve(request.result || '');
                request.onerror = () => reject(request.error);
            });
            db.close();
            cachedCss = String(value || '').slice(0, MAX_CSS_LENGTH) || DEFAULT_CUSTOM_CSS;
        } catch (error) {
            console.warn('[Readen] custom title CSS read failed', error);
            cachedCss = DEFAULT_CUSTOM_CSS;
        }
        cssLoaded = true;
        applyCss(cachedCss);
        return cachedCss;
    }

    async function writeStoredCss(css) {
        const value = String(css || '').slice(0, MAX_CSS_LENGTH) || DEFAULT_CUSTOM_CSS;
        const db = await openDb();
        await new Promise((resolve, reject) => {
            const transaction = db.transaction(DB_STORE, 'readwrite');
            const request = transaction.objectStore(DB_STORE).put(value, DB_KEY);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        db.close();
        cachedCss = value;
        cssLoaded = true;
        applyCss(value);
        return value;
    }

    function isCustomStyleActive(list) {
        const reader = document.getElementById('readen-reader-container');
        const builtInActive = list?.querySelector('.reader-title-style-card.active[data-title-style]');
        return !builtInActive && reader?.dataset.readenTitleStyle === 'custom-css';
    }

    function activateLiveCustomStyle() {
        const reader = document.getElementById('readen-reader-container');
        if (reader) reader.dataset.readenTitleStyle = 'custom-css';
        applyCss(cachedCss || DEFAULT_CUSTOM_CSS);
    }

    function activateCustomStyleThroughCore(list) {
        const bridge = list?.querySelector('.reader-title-style-card[data-title-style]');
        if (!bridge) {
            activateLiveCustomStyle();
            return false;
        }
        const originalStyleId = bridge.dataset.titleStyle;
        bridge.dataset.titleStyle = 'custom-css';
        bridge.click();
        bridge.dataset.titleStyle = originalStyleId;
        activateLiveCustomStyle();
        return true;
    }

    function updateCounter(card) {
        const textarea = card?.querySelector('.reader-title-custom-css');
        const counter = card?.querySelector('.reader-title-custom-count');
        if (textarea && counter) counter.textContent = `${textarea.value.length} / ${MAX_CSS_LENGTH}`;
    }

    function setExpanded(card, expanded) {
        editorExpanded = Boolean(expanded);
        card?.classList.toggle('expanded', editorExpanded);
        card?.querySelector('.reader-title-custom-toggle')?.setAttribute('aria-expanded', String(editorExpanded));
    }

    async function copyCss(textarea) {
        const text = textarea?.value || cachedCss || DEFAULT_CUSTOM_CSS;
        try {
            await navigator.clipboard.writeText(text);
            showToast('CSS 已复制');
        } catch (error) {
            if (!textarea) return;
            textarea.focus();
            textarea.select();
            const copied = document.execCommand?.('copy');
            if (copied) showToast('CSS 已复制');
            else showToast('复制失败，请手动复制');
        }
    }

    async function ensureCustomCard(list) {
        if (!list || list.querySelector('.reader-title-custom-card')) return;
        injectUiStyle();
        const css = await readStoredCss();
        if (!list.isConnected || list.querySelector('.reader-title-custom-card')) return;

        const builtInActive = list.querySelector('.reader-title-style-card.active[data-title-style]');
        if (!builtInActive && document.getElementById('readen-reader-container')?.classList.contains('active')) {
            activateLiveCustomStyle();
        }

        const card = document.createElement('div');
        card.className = `reader-title-custom-card${editorExpanded ? ' expanded' : ''}${isCustomStyleActive(list) ? ' is-active' : ''}`;
        card.innerHTML = `
            <button type="button" class="reader-title-custom-toggle" aria-expanded="${editorExpanded ? 'true' : 'false'}">
                <span class="reader-title-custom-pill">CSS</span>
                <span class="reader-title-custom-copy">
                    <strong>自定义标题样式</strong>
                    <span>展开后可编辑 CSS，效果只用于阅读章节标题</span>
                </span>
                <svg class="reader-title-custom-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <div class="reader-title-custom-editor">
                <div class="reader-title-custom-preview-scope">
                    <div class="readen-enhanced-chapter-heading">
                        <span class="readen-heading-order">第十二章</span>
                        <span class="readen-heading-title">灯塔来信</span>
                    </div>
                </div>
                <div class="reader-title-custom-field">
                    <div class="reader-title-custom-field-head">
                        <strong>自定义 CSS</strong>
                        <span class="reader-title-custom-count">0 / ${MAX_CSS_LENGTH}</span>
                    </div>
                    <textarea class="reader-title-custom-css" spellcheck="false" maxlength="${MAX_CSS_LENGTH}" aria-label="自定义标题 CSS"></textarea>
                    <div class="reader-title-custom-hint">请保留 <b>${escapeHtml(LIVE_SCOPE)}</b> 这个前缀。可分别修改标题容器、章节序号和章名；不需要写 HTML 或 JavaScript。</div>
                    <div class="reader-title-custom-actions">
                        <button type="button" class="reader-title-custom-action" data-custom-title-action="copy">复制 CSS</button>
                        <button type="button" class="reader-title-custom-action" data-custom-title-action="reset">恢复模板</button>
                        <button type="button" class="reader-title-custom-action primary" data-custom-title-action="apply">应用样式</button>
                    </div>
                </div>
            </div>`;
        const textarea = card.querySelector('.reader-title-custom-css');
        textarea.value = css;
        list.appendChild(card);
        updateCounter(card);

        card.querySelector('.reader-title-custom-toggle').addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            setExpanded(card, !card.classList.contains('expanded'));
            if (card.classList.contains('expanded')) applyCss(textarea.value);
        });

        textarea.addEventListener('input', () => {
            updateCounter(card);
            applyCss(textarea.value);
        });

        card.querySelector('[data-custom-title-action="copy"]').addEventListener('click', () => copyCss(textarea));
        card.querySelector('[data-custom-title-action="reset"]').addEventListener('click', () => {
            textarea.value = DEFAULT_CUSTOM_CSS;
            updateCounter(card);
            applyCss(textarea.value);
            showToast('已恢复模板，点击“应用样式”后保存');
        });
        card.querySelector('[data-custom-title-action="apply"]').addEventListener('click', async () => {
            const value = textarea.value.trim() || DEFAULT_CUSTOM_CSS;
            if (value.length > MAX_CSS_LENGTH) {
                showToast(`CSS 不能超过 ${MAX_CSS_LENGTH} 字符`);
                return;
            }
            if (!value.includes(LIVE_SCOPE)) {
                showToast('请保留自定义标题的选择器前缀');
                return;
            }
            try {
                await writeStoredCss(value);
                editorExpanded = true;
                activateCustomStyleThroughCore(list);
                showToast('自定义标题样式已应用');
            } catch (error) {
                console.error('[Readen] custom title CSS save failed', error);
                showToast('保存失败，请重试');
            }
        });
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));
    }

    function scheduleEnsure() {
        if (renderQueued) return;
        renderQueued = true;
        queueMicrotask(() => {
            renderQueued = false;
            const list = document.getElementById('readen-reader-title-style-list');
            if (list) ensureCustomCard(list);
        });
    }

    function handleBuiltInStyleClick(event) {
        const target = event.target instanceof Element ? event.target : null;
        const builtIn = target?.closest('#readen-reader-title-style-list .reader-title-style-card[data-title-style]');
        if (!builtIn || builtIn.dataset.titleStyle === 'custom-css') return;
        const reader = document.getElementById('readen-reader-container');
        if (reader) reader.dataset.readenTitleStyle = builtIn.dataset.titleStyle;
    }

    function observeReaden() {
        const app = document.getElementById('readenAppUI');
        if (!app) return;
        const observer = new MutationObserver(records => {
            for (const record of records) {
                if (record.target?.id === 'readen-reader-title-style-list') {
                    scheduleEnsure();
                    continue;
                }
                for (const node of record.addedNodes) {
                    if (!(node instanceof Element)) continue;
                    if (node.id === 'readen-reader-title-style-list' || node.querySelector?.('#readen-reader-title-style-list')) {
                        scheduleEnsure();
                        break;
                    }
                }
            }
        });
        observer.observe(app, { childList: true, subtree: true });
    }

    injectUiStyle();
    readStoredCss();
    document.addEventListener('click', handleBuiltInStyleClick, true);
    observeReaden();
    scheduleEnsure();
})();

/* ========================================================================
 * Bundled module: readen-reader-stability-fixes.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-reader-stability-fixes-style';
    const SWIPE_REVEAL = 78;
    const SWIPE_START_THRESHOLD = 10;
    const PATCH_FLAG = '__readenChapterReflectionPatched';
    let openSwipeRow = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.readen-app-container .readen-bookmark-swipe-row {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 14px;
}
.readen-app-container .readen-bookmark-swipe-row + .readen-bookmark-swipe-row {
    margin-top: 1px;
}
.readen-app-container .readen-bookmark-swipe-row > [data-book-detail-bookmark-id] {
    position: relative;
    z-index: 2;
    width: 100%;
    margin: 0;
    background: #fff;
    will-change: transform;
    touch-action: pan-y;
    -webkit-user-select: none;
    user-select: none;
}
.readen-app-container .readen-bookmark-swipe-delete {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    width: ${SWIPE_REVEAL}px;
    border: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff3b30;
    color: #fff;
    cursor: pointer;
}
.readen-app-container .readen-bookmark-swipe-delete svg {
    width: 21px;
    height: 21px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
}
.readen-app-container .readen-bookmark-swipe-row.is-deleting {
    transition: height .22s ease, margin .22s ease, opacity .18s ease;
    opacity: 0;
}
.readen-app-container.readen-night-mode .readen-bookmark-swipe-row > [data-book-detail-bookmark-id] {
    background: #1c1c1e;
}
`;
        document.head.appendChild(style);
    }

    function getBookmarkData() {
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) return readenBooksData;
        } catch (error) {
            console.warn('[Readen] bookmark data unavailable', error);
        }
        return null;
    }

    function persistReadenData() {
        try {
            if (typeof saveReadenAppData === 'function') saveReadenAppData();
        } catch (error) {
            console.warn('[Readen] bookmark save failed', error);
        }
    }

    function deleteBookmarkById(bookmarkId) {
        const books = getBookmarkData();
        if (!books || !bookmarkId) return false;
        for (const book of books) {
            if (!Array.isArray(book?.bookmarks)) continue;
            const index = book.bookmarks.findIndex(item => String(item?.id) === String(bookmarkId));
            if (index < 0) continue;
            book.bookmarks.splice(index, 1);
            persistReadenData();
            return true;
        }
        return false;
    }

    function setItemTranslate(item, value, animate) {
        if (!item) return;
        item.style.transition = animate ? 'transform .22s cubic-bezier(.22,.7,.22,1)' : 'none';
        item.style.transform = `translate3d(${value}px,0,0)`;
    }

    function closeSwipeRow(row, animate = true) {
        if (!row) return;
        const item = row.querySelector('[data-book-detail-bookmark-id]');
        setItemTranslate(item, 0, animate);
        row.classList.remove('is-open');
        if (openSwipeRow === row) openSwipeRow = null;
    }

    function removeBookmarkRow(row, bookmarkId, direction) {
        if (!row || row.dataset.deleting === 'true') return;
        row.dataset.deleting = 'true';
        const item = row.querySelector('[data-book-detail-bookmark-id]');
        const width = Math.max(row.getBoundingClientRect().width, 260);
        setItemTranslate(item, direction === 'swipe' ? -width : -SWIPE_REVEAL, true);

        const removed = deleteBookmarkById(bookmarkId);
        if (!removed) {
            row.dataset.deleting = 'false';
            closeSwipeRow(row);
            if (typeof window.showToast === 'function') window.showToast('书签删除失败，请重试');
            return;
        }

        document.querySelectorAll('#readen-bd-chapter-list [data-book-detail-bookmark-id]').forEach(sourceItem => {
            if (String(sourceItem.dataset.bookDetailBookmarkId) === String(bookmarkId)) sourceItem.remove();
        });

        window.setTimeout(() => {
            const height = row.getBoundingClientRect().height;
            row.style.height = `${height}px`;
            row.classList.add('is-deleting');
            requestAnimationFrame(() => {
                row.style.height = '0px';
                row.style.marginTop = '0px';
            });
            window.setTimeout(() => {
                const pane = row.closest('#drawer-pane-bookmarks-enhanced');
                row.remove();
                if (pane && !pane.querySelector('[data-book-detail-bookmark-id]')) {
                    pane.innerHTML = '<div class="readen-enhanced-bookmarks-loading">暂无书签</div>';
                }
            }, 230);
        }, direction === 'swipe' ? 90 : 40);

        if (typeof window.showToast === 'function') window.showToast('书签已删除');
    }

    function enhanceBookmarkItem(item) {
        if (!item || item.dataset.readenSwipeReady === 'true') return;
        item.dataset.readenSwipeReady = 'true';
        const bookmarkId = item.dataset.bookDetailBookmarkId;
        if (!bookmarkId) return;

        const row = document.createElement('div');
        row.className = 'readen-bookmark-swipe-row';
        item.parentNode.insertBefore(row, item);
        row.appendChild(item);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'readen-bookmark-swipe-delete';
        deleteButton.setAttribute('aria-label', '删除书签');
        deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M9 6V4h6v2"></path><line x1="10" y1="10" x2="10" y2="17"></line><line x1="14" y1="10" x2="14" y2="17"></line></svg>';
        row.insertBefore(deleteButton, item);

        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let dragging = false;
        let horizontal = false;
        let suppressClickUntil = 0;

        item.addEventListener('touchstart', event => {
            const touch = event.touches?.[0];
            if (!touch || row.dataset.deleting === 'true') return;
            if (openSwipeRow && openSwipeRow !== row) closeSwipeRow(openSwipeRow);
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = row.classList.contains('is-open') ? -SWIPE_REVEAL : 0;
            dragging = true;
            horizontal = false;
            setItemTranslate(item, currentX, false);
        }, { passive: true });

        item.addEventListener('touchmove', event => {
            if (!dragging) return;
            const touch = event.touches?.[0];
            if (!touch) return;
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (!horizontal) {
                if (Math.abs(dx) < SWIPE_START_THRESHOLD && Math.abs(dy) < SWIPE_START_THRESHOLD) return;
                if (Math.abs(dy) >= Math.abs(dx)) {
                    dragging = false;
                    return;
                }
                horizontal = true;
            }
            if (event.cancelable) event.preventDefault();
            const width = Math.max(row.getBoundingClientRect().width, SWIPE_REVEAL);
            currentX = Math.max(-width, Math.min(0, (row.classList.contains('is-open') ? -SWIPE_REVEAL : 0) + dx));
            setItemTranslate(item, currentX, false);
        }, { passive: false });

        item.addEventListener('touchend', () => {
            if (!dragging || !horizontal) {
                dragging = false;
                horizontal = false;
                return;
            }
            dragging = false;
            horizontal = false;
            suppressClickUntil = Date.now() + 320;
            const width = Math.max(row.getBoundingClientRect().width, 1);
            const deleteThreshold = Math.max(132, width * 0.52);
            if (Math.abs(currentX) >= deleteThreshold) {
                removeBookmarkRow(row, bookmarkId, 'swipe');
                return;
            }
            if (Math.abs(currentX) >= 34) {
                setItemTranslate(item, -SWIPE_REVEAL, true);
                row.classList.add('is-open');
                openSwipeRow = row;
                return;
            }
            closeSwipeRow(row);
        }, { passive: true });

        item.addEventListener('touchcancel', () => {
            dragging = false;
            horizontal = false;
            closeSwipeRow(row);
        }, { passive: true });

        item.addEventListener('click', event => {
            if (Date.now() < suppressClickUntil) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return;
            }
            if (row.classList.contains('is-open')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                closeSwipeRow(row);
            }
        }, true);

        deleteButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            removeBookmarkRow(row, bookmarkId, 'button');
        });
    }

    function enhanceBookmarkPane(root) {
        const pane = root?.matches?.('#drawer-pane-bookmarks-enhanced')
            ? root
            : root?.querySelector?.('#drawer-pane-bookmarks-enhanced');
        if (!pane) return;
        pane.querySelectorAll('[data-book-detail-bookmark-id]').forEach(enhanceBookmarkItem);
    }

    function startBookmarkObserver() {
        injectStyles();
        const target = document.getElementById('readenAppUI') || document.body;
        if (!target) return;
        enhanceBookmarkPane(target);
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;
                    enhanceBookmarkPane(node);
                }
                if (mutation.target instanceof Element) enhanceBookmarkPane(mutation.target);
            }
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    function getReadingBookFromPayload(payload) {
        const bookId = String(payload?.book?.id || '');
        if (!bookId) return null;
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) {
                return readenBooksData.find(book => String(book?.id || '') === bookId) || null;
            }
        } catch (_) {}
        return null;
    }

    async function resolveReadingWechatContactId(payload) {
        const requestedId = String(payload?.contactId || '').trim();
        if (!requestedId) return requestedId;

        try {
            if (typeof wcReloadContactsFromStorage === 'function') {
                await wcReloadContactsFromStorage();
            }
        } catch (error) {
            console.debug('[Readen] unable to refresh WeChat contacts before reflection', error);
        }

        let contacts = [];
        try {
            if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) contacts = wcContactsList;
        } catch (_) {}
        if (!contacts.length) return requestedId;

        const direct = contacts.find(contact => String(contact?.id || '') === requestedId);
        if (direct?.id) return String(direct.id);

        const linked = contacts.find(contact => String(contact?.linkedContactId || '') === requestedId);
        if (linked?.id) return String(linked.id);

        const book = getReadingBookFromPayload(payload);
        const binding = book?.coReading && typeof book.coReading === 'object' ? book.coReading : null;
        const linkedId = String(binding?.linkedContactId || '').trim();
        if (linkedId) {
            const linkedMatch = contacts.find(contact => String(contact?.linkedContactId || '') === linkedId || String(contact?.id || '') === linkedId);
            if (linkedMatch?.id) return String(linkedMatch.id);
        }

        const bindingName = String(binding?.name || '').trim();
        if (bindingName) {
            const nameMatches = contacts.filter(contact => {
                const name = String(contact?.remark || contact?.name || '').trim();
                return name && name === bindingName;
            });
            if (nameMatches.length === 1 && nameMatches[0]?.id) return String(nameMatches[0].id);
        }

        return requestedId;
    }

    function migrateReadingBinding(payload, resolvedContactId) {
        const requestedId = String(payload?.contactId || '').trim();
        const resolvedId = String(resolvedContactId || '').trim();
        if (!requestedId || !resolvedId || requestedId === resolvedId) return;
        const book = getReadingBookFromPayload(payload);
        if (!book?.coReading || typeof book.coReading !== 'object') return;
        if (!book.coReading.linkedContactId) book.coReading.linkedContactId = requestedId;
        book.coReading.contactId = resolvedId;
        book.coReading.enabled = true;
        book.coReading.updatedAt = Date.now();
        try {
            if (typeof saveReadenAppData === 'function') saveReadenAppData();
        } catch (error) {
            console.debug('[Readen] unable to persist migrated co-reader id', error);
        }
    }

    // Old bindings may store the contacts-app id (e.g. "c1"); resolve it to the WeChat contact id
    // (e.g. "char_c1") before every co-reading request. Parsing of the model reply lives in wechat.js,
    // so no global function is swapped while a request is running.
    function wrapReadingSceneRequest(service, methodName, options = {}) {
        const originalRequest = service?.[methodName];
        if (typeof originalRequest !== 'function') return false;
        if (originalRequest[PATCH_FLAG]) return true;
        const patchedRequest = async function (payload) {
            const nextPayload = { ...(payload || {}) };
            if (options.fillChapterText && !String(nextPayload.chapterText || '').trim()) {
                const fallbackText = document.getElementById('readen-reader-content')?.innerText
                    || document.getElementById('readen-reader-content')?.textContent
                    || '';
                nextPayload.chapterText = String(fallbackText).trim();
            }
            const resolvedContactId = await resolveReadingWechatContactId(nextPayload);
            if (resolvedContactId) {
                migrateReadingBinding(nextPayload, resolvedContactId);
                nextPayload.contactId = resolvedContactId;
            }
            return originalRequest.call(service, nextPayload);
        };
        patchedRequest[PATCH_FLAG] = true;
        service[methodName] = patchedRequest;
        return true;
    }

    function patchChapterReflectionService() {
        const service = window.CharacterSceneService;
        if (!service) return false;
        const reflectionPatched = wrapReadingSceneRequest(service, 'requestChapterReflection', { fillChapterText: true });
        const annotationPatched = wrapReadingSceneRequest(service, 'requestAnnotation');
        return reflectionPatched && annotationPatched;
    }

    function startReflectionPatchWatcher() {
        if (patchChapterReflectionService()) return;
        let checks = 0;
        const timer = window.setInterval(() => {
            checks += 1;
            if (patchChapterReflectionService() || checks >= 900) window.clearInterval(timer);
        }, 1000);
    }

    function init() {
        startBookmarkObserver();
        startReflectionPatchWatcher();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Bundled module: readen-chapter-reflection-ui.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-chapter-reflection-ui-style';
    const INLINE_SECTION_CLASS = 'readen-chapter-reflection-section';
    const DRAWER_TAB_TARGET = 'reflections';

    let renderTimer = 0;
    let lastRenderedSignature = '';
    let successToastAt = 0;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.readen-app-container .${INLINE_SECTION_CLASS} {
    width: 100%;
    box-sizing: border-box;
    margin: 30px 0 36px;
    color: inherit;
    text-indent: 0;
    /* The reader text keeps line breaks (pre-wrap); the block's own markup must not. */
    white-space: normal;
    user-select: none;
    -webkit-user-select: none;
}
.readen-app-container .readen-reflection-inline-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .14em;
    line-height: 1.4;
    color: rgba(110, 110, 118, .62);
    break-after: avoid;
    -webkit-column-break-after: avoid;
}
.readen-app-container .readen-reflection-inline-head::before,
.readen-app-container .readen-reflection-inline-head::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(120, 120, 128, .18);
}
.readen-app-container .readen-reflection-inline-card {
    position: relative;
    padding: 13px 14px 14px 15px;
    border-radius: 16px;
    background: rgba(120, 120, 128, .07);
    border: 1px solid rgba(120, 120, 128, .10);
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
}
.readen-app-container .readen-reflection-inline-card + .readen-reflection-inline-card {
    margin-top: 10px;
}
.readen-app-container .readen-reflection-inline-card-head {
    display: flex;
    align-items: center;
    gap: 9px;
    padding-right: 30px;
}
.readen-app-container .readen-reflection-inline-card .readen-reflection-inline-avatar {
    width: 28px;
    height: 28px;
}
.readen-app-container .readen-reflection-inline-card-name {
    min-width: 0;
    flex: 1;
}
.readen-app-container .readen-reflection-inline-card-name strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    line-height: 1.35;
    font-weight: 700;
}
.readen-app-container .readen-reflection-inline-card-name small {
    display: block;
    margin-top: 1px;
    color: rgba(120, 121, 126, .68);
    font-size: 10px;
    line-height: 1.3;
}
.readen-app-container .readen-reflection-inline-delete {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    color: rgba(120, 121, 126, .62);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
.readen-app-container .readen-reflection-inline-delete:active {
    background: rgba(120, 120, 128, .14);
}
.readen-app-container .readen-reflection-inline-delete svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.readen-app-container .readen-reflection-inline-card-text {
    margin-top: 10px;
    font-size: .9em;
    line-height: 1.8;
    letter-spacing: .01em;
    white-space: pre-wrap;
    word-break: break-word;
    opacity: .86;
}
.readen-app-container .readen-reflection-chapter-toggle,
.readen-app-container .readen-reflection-role-toggle {
    width: 100%;
    border: 0;
    padding: 0;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}
.readen-app-container .readen-reflection-chapter-chevron,
.readen-app-container .readen-reflection-role-chevron {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform .2s ease;
}
.readen-app-container .readen-reflection-chapter-chevron svg,
.readen-app-container .readen-reflection-role-chevron svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.readen-app-container .readen-reflection-chapter-group.is-open .readen-reflection-chapter-chevron,
.readen-app-container .readen-reflection-role-card.is-open .readen-reflection-role-chevron {
    transform: rotate(90deg);
}
.readen-app-container .readen-reflection-inline-avatar,
.readen-app-container .readen-reflection-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(120, 120, 128, .10);
    color: #74767b;
    font-size: 11px;
    font-weight: 700;
}
.readen-app-container .readen-reflection-inline-avatar img,
.readen-app-container .readen-reflection-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
}
.readen-app-container .readen-coreader-avatar,
.readen-app-container .readen-profile-avatar-preview {
    background-size: contain !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
}
.readen-app-container img.readen-coreader-avatar {
    object-fit: contain;
    object-position: center;
}
.readen-app-container .readen-reflection-drawer-pane {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px 14px 28px;
}
.readen-app-container .readen-reflection-drawer-empty {
    padding: 44px 16px;
    text-align: center;
    color: #92959a;
    font-size: 13px;
}
.readen-app-container .readen-reflection-chapter-group + .readen-reflection-chapter-group {
    margin-top: 10px;
}
.readen-app-container .readen-reflection-chapter-toggle {
    min-height: 50px;
    padding: 8px 11px 8px 14px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: rgba(244, 245, 247, .94);
    border: 1px solid rgba(118, 126, 140, .10);
}
.readen-app-container .readen-reflection-chapter-copy {
    min-width: 0;
    flex: 1;
}
.readen-app-container .readen-reflection-chapter-copy strong,
.readen-app-container .readen-reflection-chapter-copy small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.readen-app-container .readen-reflection-chapter-copy strong {
    font-size: 13px;
    font-weight: 800;
}
.readen-app-container .readen-reflection-chapter-copy small {
    margin-top: 2px;
    color: #92959a;
    font-size: 10px;
}
.readen-app-container .readen-reflection-chapter-count {
    min-width: 32px;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.9);
    color: #747a82;
    font-size: 10px;
    font-weight: 800;
}
.readen-app-container .readen-reflection-chapter-body {
    display: none;
    padding: 8px 2px 2px;
}
.readen-app-container .readen-reflection-chapter-group.is-open .readen-reflection-chapter-body {
    display: block;
}
.readen-app-container .readen-reflection-role-card {
    width: 100%;
    box-sizing: border-box;
}
.readen-app-container .readen-reflection-role-card + .readen-reflection-role-card {
    margin-top: 8px;
}
.readen-app-container .readen-reflection-role-toggle {
    min-height: 52px;
    padding: 7px 10px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: rgba(255, 255, 255, .72);
    border: 1px solid rgba(118, 126, 140, .12);
    box-shadow: 0 6px 20px rgba(44, 55, 70, .05);
}
.readen-app-container .readen-reflection-role-copy {
    min-width: 0;
    flex: 1;
}
.readen-app-container .readen-reflection-role-copy strong,
.readen-app-container .readen-reflection-role-copy small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.readen-app-container .readen-reflection-role-copy strong {
    font-size: 13px;
    font-weight: 800;
}
.readen-app-container .readen-reflection-role-copy small {
    margin-top: 2px;
    color: #909399;
    font-size: 10px;
}
.readen-app-container .readen-reflection-role-body {
    display: none;
    padding: 10px 0 4px;
}
.readen-app-container .readen-reflection-role-card.is-open .readen-reflection-role-body {
    display: block;
}
.readen-app-container .readen-reflection-receipt-wrap {
    position: relative;
    padding: 20px 10px 12px;
}
.readen-app-container .readen-reflection-receipt-rail {
    position: absolute;
    top: 4px;
    left: 5%;
    right: 5%;
    height: 34px;
    border-radius: 9px;
    background-color: #5c5d60;
    background-image: radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.2px);
    background-size: 8px 8px;
    box-shadow: 0 5px 12px rgba(0, 0, 0, .16);
}
.readen-app-container .readen-reflection-receipt {
    --receipt-paper: rgba(255,255,255,.97);
    position: relative;
    z-index: 1;
    margin: 0 12px;
    padding: 22px 20px 30px;
    background: var(--receipt-paper);
    color: #62666c;
    box-shadow: 0 12px 30px rgba(38, 42, 48, .10);
    text-align: left;
}
.readen-app-container .readen-reflection-receipt::before {
    content: '';
    position: absolute;
    top: 0;
    left: 22px;
    right: 22px;
    height: 5px;
    border-radius: 0 0 999px 999px;
    background: rgba(150, 154, 160, .22);
}
.readen-app-container .readen-reflection-receipt::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -9px;
    height: 10px;
    background:
        linear-gradient(135deg, var(--receipt-paper) 50%, transparent 50%) 0 0 / 18px 18px repeat-x,
        linear-gradient(45deg, transparent 50%, var(--receipt-paper) 50%) 9px 0 / 18px 18px repeat-x;
}
.readen-app-container .readen-reflection-receipt-kicker {
    font-size: 9px;
    letter-spacing: .17em;
    color: #9ca0a5;
}
.readen-app-container .readen-reflection-receipt-head {
    margin-top: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}
.readen-app-container .readen-reflection-receipt-head strong {
    color: #555a60;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.3;
}
.readen-app-container .readen-reflection-receipt-head span {
    color: #9b9fa4;
    font-size: 9px;
    white-space: nowrap;
}
.readen-app-container .readen-reflection-receipt-rule {
    margin: 13px 0 15px;
    border-top: 1px dashed rgba(120, 124, 130, .38);
}
.readen-app-container .readen-reflection-receipt-content {
    font-size: 13px;
    line-height: 1.85;
    letter-spacing: .01em;
    white-space: pre-wrap;
    word-break: break-word;
}
.readen-app-container .readen-reflection-receipt-sign {
    margin-top: 20px;
    text-align: center;
    color: #74787e;
    font-size: 12px;
    font-style: italic;
}
.readen-app-container.readen-night-mode .readen-reflection-inline-head,
.readen-app-container.readen-night-mode .readen-reflection-inline-card-name small,
.readen-app-container.readen-night-mode .readen-reflection-inline-delete {
    color: rgba(220, 220, 224, .56);
}
.readen-app-container.readen-night-mode .readen-reflection-inline-head::before,
.readen-app-container.readen-night-mode .readen-reflection-inline-head::after {
    background: rgba(255, 255, 255, .10);
}
.readen-app-container.readen-night-mode .readen-reflection-inline-card {
    background: rgba(255, 255, 255, .05);
    border-color: rgba(255, 255, 255, .07);
}
.readen-app-container.readen-night-mode .readen-reflection-chapter-toggle,
.readen-app-container.readen-night-mode .readen-reflection-role-toggle {
    background: rgba(44, 45, 48, .9);
    border-color: rgba(255,255,255,.07);
    color: #d6d7da;
}
.readen-app-container.readen-night-mode .readen-reflection-avatar,
.readen-app-container.readen-night-mode .readen-reflection-inline-avatar,
.readen-app-container.readen-night-mode .readen-reflection-chapter-count {
    background: rgba(255,255,255,.08);
    color: #c8c9cc;
}
.readen-app-container.readen-night-mode .readen-reflection-receipt {
    --receipt-paper: #27282b;
    color: #d2d3d6;
}
.readen-app-container.readen-night-mode .readen-reflection-receipt-head strong,
.readen-app-container.readen-night-mode .readen-reflection-receipt-sign {
    color: #e1e2e4;
}
`;
        document.head.appendChild(style);
    }

    function getBooks() {
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) return readenBooksData;
        } catch (error) {
            console.debug('[Readen] reflection book data is not ready', error);
        }
        return [];
    }

    function getActiveBook() {
        const reader = document.getElementById('readen-reader-container');
        if (!reader?.classList.contains('active')) return null;
        const books = getBooks();
        if (!books.length) return null;
        return [...books].sort((a, b) => (Number(b?.lastReadTime) || 0) - (Number(a?.lastReadTime) || 0))[0] || null;
    }

    function getChapterIndex(book) {
        const chapters = Array.isArray(book?.chapters) ? book.chapters : [];
        const raw = Number(book?.currentChapterIndex);
        if (Number.isFinite(raw)) return Math.max(0, Math.min(Math.max(0, chapters.length - 1), raw));
        return 0;
    }

    function getChapterTitle(book, chapterIndex) {
        const chapter = Array.isArray(book?.chapters) ? book.chapters[chapterIndex] : null;
        return String(chapter?.title || `第${chapterIndex + 1}章`);
    }

    function reflectionChapterIndex(annotation) {
        const value = Number(annotation?.chapter?.indexAtCreation ?? annotation?.chapter?.index);
        return Number.isFinite(value) ? Math.max(0, value) : null;
    }

    function reflectionMatchesChapter(annotation, chapterIndex, chapterTitle) {
        if (!annotation || annotation.kind !== 'chapter_reflection' || annotation.status === 'deleted') return false;
        const index = reflectionChapterIndex(annotation);
        if (index !== null) return index === chapterIndex;
        return String(annotation?.chapter?.title || '').trim() === String(chapterTitle || '').trim();
    }

    function getChapterReflections(book, chapterIndex) {
        const chapterTitle = getChapterTitle(book, chapterIndex);
        return (Array.isArray(book?.annotations) ? book.annotations : [])
            .filter(annotation => reflectionMatchesChapter(annotation, chapterIndex, chapterTitle))
            .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
    }

    function getAllReflections(book) {
        return (Array.isArray(book?.annotations) ? book.annotations : [])
            .filter(annotation => annotation?.kind === 'chapter_reflection' && annotation.status !== 'deleted')
            .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function formatTime(value) {
        const date = new Date(Number(value) || Date.now());
        if (Number.isNaN(date.getTime())) return '';
        const pad = number => String(number).padStart(2, '0');
        return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function getRoleName(annotation) {
        return String(annotation?.characterName || '角色').trim() || '角色';
    }

    function getRoleKey(annotation) {
        return String(annotation?.contactId || annotation?.linkedContactId || getRoleName(annotation));
    }

    function avatarMarkup(annotation, inline = false) {
        const name = getRoleName(annotation);
        const avatar = String(annotation?.characterAvatar || '').trim();
        const className = inline ? 'readen-reflection-inline-avatar' : 'readen-reflection-avatar';
        return avatar
            ? `<span class="${className}"><img src="${escapeAttr(avatar)}" alt="${escapeAttr(name)}"></span>`
            : `<span class="${className}">${escapeHtml(name.slice(0, 1) || '角')}</span>`;
    }

    function receiptMarkup(annotation, chapterTitle) {
        const name = getRoleName(annotation);
        const content = String(annotation?.content || '').trim() || '这一章还没有留下文字。';
        return `
            <div class="readen-reflection-receipt-wrap">
                <div class="readen-reflection-receipt-rail" aria-hidden="true"></div>
                <div class="readen-reflection-receipt">
                    <div class="readen-reflection-receipt-kicker">CHARACTER NOTE · 角色有话说</div>
                    <div class="readen-reflection-receipt-head">
                        <strong>${escapeHtml(chapterTitle || annotation?.chapter?.title || '本章')}</strong>
                        <span>${escapeHtml(formatTime(annotation?.createdAt))}</span>
                    </div>
                    <div class="readen-reflection-receipt-rule"></div>
                    <div class="readen-reflection-receipt-content">${escapeHtml(content)}</div>
                    <div class="readen-reflection-receipt-sign">“ ${escapeHtml(name)} ”</div>
                </div>
            </div>
        `;
    }

    function drawerRoleCardMarkup(annotation, chapterTitle) {
        const name = getRoleName(annotation);
        return `
            <article class="readen-reflection-role-card" data-readen-reflection-id="${escapeAttr(annotation?.id || '')}">
                <button type="button" class="readen-reflection-role-toggle" aria-expanded="false">
                    ${avatarMarkup(annotation, false)}
                    <span class="readen-reflection-role-copy">
                        <strong>${escapeHtml(name)}</strong>
                        <small>章末感想 · ${escapeHtml(formatTime(annotation?.createdAt))}</small>
                    </span>
                    <span class="readen-reflection-role-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                </button>
                <div class="readen-reflection-role-body">${receiptMarkup(annotation, chapterTitle)}</div>
            </article>
        `;
    }

    const INLINE_DELETE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M10 11v6M14 11v6"></path><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"></path><path d="M9 7V4h6v3"></path></svg>';

    // One reflection at the chapter end, shown like an author's note: always open, with a delete button.
    function inlineCardMarkup(annotation) {
        const name = getRoleName(annotation);
        const content = String(annotation?.content || '').trim() || '这一章还没有留下文字。';
        return `
            <article class="readen-reflection-inline-card" data-readen-reflection-id="${escapeAttr(annotation?.id || '')}">
                <div class="readen-reflection-inline-card-head">
                    ${avatarMarkup(annotation, true)}
                    <span class="readen-reflection-inline-card-name">
                        <strong>${escapeHtml(name)}</strong>
                        <small>${escapeHtml(formatTime(annotation?.createdAt))}</small>
                    </span>
                </div>
                <button type="button" class="readen-reflection-inline-delete" aria-label="删除这条感想">${INLINE_DELETE_ICON}</button>
                <div class="readen-reflection-inline-card-text">${escapeHtml(content)}</div>
            </article>
        `;
    }

    function bindDrawerRoleCards(root) {
        root?.querySelectorAll?.('.readen-reflection-role-card').forEach(card => {
            const button = card.querySelector('.readen-reflection-role-toggle');
            if (!button || button.dataset.readenBound === '1') return;
            button.dataset.readenBound = '1';
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const next = !card.classList.contains('is-open');
                card.classList.toggle('is-open', next);
                button.setAttribute('aria-expanded', String(next));
            });
        });
    }

    function uniqueRoleCount(reflections) {
        return new Set(reflections.map(getRoleKey)).size;
    }

    function buildInlineSection(book, chapterIndex, reflections) {
        const section = document.createElement('section');
        section.className = INLINE_SECTION_CLASS;
        section.dataset.readenReflectionChapter = String(chapterIndex);
        section.innerHTML = `<div class="readen-reflection-inline-head">角色有话说</div>${reflections.map(inlineCardMarkup).join('')}`;
        section.querySelectorAll('.readen-reflection-inline-delete').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const id = button.closest('.readen-reflection-inline-card')?.dataset.readenReflectionId || '';
                if (id) window.ReadenApp?.deleteChapterReflection?.(id);
            });
        });
        return section;
    }

    // Puts the chapter's reflections after the chapter text (or removes them). The reader is told to
    // count its pages again whenever the block changes, so every page stays reachable.
    function renderInlineReflectionsNow(options = {}) {
        const content = document.getElementById('readen-reader-content');
        const reader = document.getElementById('readen-reader-container');
        if (!content || !reader?.classList.contains('active')) return;
        if (content.classList.contains('readen-manga-content')) return;

        const book = options.book || getActiveBook();
        if (!book) return;
        const chapterIndex = Number.isFinite(options.chapterIndex) ? options.chapterIndex : getChapterIndex(book);
        const reflections = getChapterReflections(book, chapterIndex);
        const ids = reflections.map(item => String(item?.id || '')).filter(Boolean);
        const signature = `${book.id}:${chapterIndex}:${ids.join(',')}`;
        const existing = content.querySelector(`:scope > .${INLINE_SECTION_CLASS}`);

        let changed = false;
        if (!reflections.length) {
            if (existing) {
                existing.remove();
                changed = true;
            }
        } else if (signature !== lastRenderedSignature || !existing) {
            const nextSection = buildInlineSection(book, chapterIndex, reflections);
            if (existing) existing.replaceWith(nextSection);
            else content.appendChild(nextSection);
            changed = true;
        }
        lastRenderedSignature = signature;
        if (changed && !options.skipPagination) window.ReadenApp?.refreshReaderPagination?.();
    }

    function renderInlineReflections(options = {}) {
        window.clearTimeout(renderTimer);
        renderTimer = window.setTimeout(() => renderInlineReflectionsNow(options), 24);
    }

    // The reader renders the block together with the chapter text, so the page count is right
    // before the first page is shown.
    window.ReadenChapterReflectionInline = { render: renderInlineReflectionsNow };

    function groupReflectionsByChapter(book) {
        const groups = new Map();
        getAllReflections(book).forEach(annotation => {
            const index = reflectionChapterIndex(annotation);
            const title = String(annotation?.chapter?.title || (index !== null ? getChapterTitle(book, index) : '未命名章节'));
            const key = index !== null ? `index:${index}` : `key:${annotation?.chapter?.key || annotation?.chapter?.token || title}`;
            if (!groups.has(key)) groups.set(key, { key, index, title, items: [] });
            groups.get(key).items.push(annotation);
        });
        return [...groups.values()].sort((a, b) => {
            const ai = a.index === null ? -1 : a.index;
            const bi = b.index === null ? -1 : b.index;
            if (ai !== bi) return bi - ai;
            return (Number(b.items[0]?.createdAt) || 0) - (Number(a.items[0]?.createdAt) || 0);
        });
    }

    function findBookForDrawer(drawer) {
        const raw = drawer?.querySelector('.drawer-book-title')?.textContent || '';
        const match = raw.match(/《(.+?)》/);
        const title = String(match?.[1] || '').trim();
        if (!title) return null;
        return getBooks().find(book => String(book?.title || '').trim() === title) || null;
    }

    function renderDrawerPane(drawer, pane, book) {
        const groups = groupReflectionsByChapter(book);
        if (!groups.length) {
            pane.innerHTML = '<div class="readen-reflection-drawer-empty">还没有章末感想。读完一章后，可以让共读角色留下自己的话。</div>';
            return;
        }
        pane.innerHTML = groups.map(group => {
            const roleCount = uniqueRoleCount(group.items);
            return `
                <section class="readen-reflection-chapter-group" data-readen-reflection-chapter-key="${escapeAttr(group.key)}">
                    <button type="button" class="readen-reflection-chapter-toggle" aria-expanded="false">
                        <span class="readen-reflection-chapter-copy">
                            <strong>${escapeHtml(group.title)}</strong>
                            <small>${roleCount} 位角色 · ${group.items.length} 条感想</small>
                        </span>
                        <span class="readen-reflection-chapter-count">${group.items.length}</span>
                        <span class="readen-reflection-chapter-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                    </button>
                    <div class="readen-reflection-chapter-body">
                        ${group.items.map(annotation => drawerRoleCardMarkup(annotation, group.title)).join('')}
                    </div>
                </section>
            `;
        }).join('');

        pane.querySelectorAll('.readen-reflection-chapter-group').forEach(group => {
            const toggle = group.querySelector('.readen-reflection-chapter-toggle');
            toggle?.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const next = !group.classList.contains('is-open');
                group.classList.toggle('is-open', next);
                toggle.setAttribute('aria-expanded', String(next));
            });
        });
        bindDrawerRoleCards(pane);
    }

    function enhanceReflectionDrawer(drawer) {
        if (!drawer || drawer.dataset.readenReflectionEnhanced === '1') return;
        const tabs = drawer.querySelector('.drawer-tabs');
        const contentArea = drawer.querySelector('.drawer-content-area');
        if (!tabs || !contentArea) return;
        const book = findBookForDrawer(drawer);
        if (!book) return;

        drawer.dataset.readenReflectionEnhanced = '1';
        let tab = drawer.querySelector(`.drawer-tab[data-target="${DRAWER_TAB_TARGET}"]`);
        if (!tab) {
            tab = document.createElement('div');
            tab.className = 'drawer-tab';
            tab.dataset.target = DRAWER_TAB_TARGET;
            tab.textContent = '章末感想';
            tabs.insertBefore(tab, tabs.querySelector('[data-target="stats"]') || null);
        }

        let pane = drawer.querySelector(`#drawer-pane-${DRAWER_TAB_TARGET}`);
        if (!pane) {
            pane = document.createElement('div');
            pane.className = 'drawer-pane readen-reflection-drawer-pane';
            pane.id = `drawer-pane-${DRAWER_TAB_TARGET}`;
            contentArea.appendChild(pane);
        }
        renderDrawerPane(drawer, pane, book);

        tab.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            drawer.querySelectorAll('.drawer-tab').forEach(item => item.classList.toggle('active', item === tab));
            drawer.querySelectorAll('.drawer-pane').forEach(item => item.classList.toggle('active', item === pane));
            drawer.querySelectorAll('.drawer-bottom-actions .rb-action-item').forEach(item => item.classList.remove('active'));
            renderDrawerPane(drawer, pane, book);
        });
    }

    function refreshOpenReflectionDrawer() {
        const drawer = document.getElementById('readen-reader-chapter-drawer');
        if (!drawer) return;
        const pane = drawer.querySelector(`#drawer-pane-${DRAWER_TAB_TARGET}`);
        const book = findBookForDrawer(drawer);
        if (pane && book) renderDrawerPane(drawer, pane, book);
    }

    function handleReflectionSuccessDialog() {
        const overlay = document.getElementById('readen-dialog-overlay');
        if (!overlay) return;
        const content = overlay.querySelector('.readen-chapter-reflection-content');
        if (!content) {
            delete overlay.dataset.readenReflectionHandled;
            return;
        }
        const marker = String(content.textContent || '').trim().slice(0, 220);
        if (!marker || overlay.dataset.readenReflectionHandled === marker) return;
        overlay.dataset.readenReflectionHandled = marker;
        overlay.classList.remove('active');
        renderInlineReflections();
        refreshOpenReflectionDrawer();
        if (Date.now() - successToastAt > 1000) {
            successToastAt = Date.now();
            window.showToast?.('章末感想已放到本章末尾');
        }
    }

    function inspectAddedNode(node) {
        if (!(node instanceof Element)) return;
        if (node.id === 'readen-reader-chapter-drawer') enhanceReflectionDrawer(node);
        else node.querySelectorAll?.('#readen-reader-chapter-drawer').forEach(enhanceReflectionDrawer);
        if (node.id === 'readen-dialog-overlay' || node.closest?.('#readen-dialog-overlay') || node.querySelector?.('#readen-dialog-overlay')) {
            handleReflectionSuccessDialog();
        }
        if (node.id === 'readen-reader-content' || node.closest?.('#readen-reader-content') || node.querySelector?.('#readen-reader-content')) {
            renderInlineReflections();
        }
    }

    function startObservers() {
        injectStyles();
        const root = document.getElementById('readenAppUI');
        if (!root) return;
        const existingDrawer = document.getElementById('readen-reader-chapter-drawer');
        if (existingDrawer) enhanceReflectionDrawer(existingDrawer);
        renderInlineReflections();
        handleReflectionSuccessDialog();

        const observer = new MutationObserver(mutations => {
            let readerChanged = false;
            let dialogChanged = false;
            for (const mutation of mutations) {
                const target = mutation.target instanceof Element ? mutation.target : mutation.target?.parentElement;
                if (target?.closest?.('#readen-reader-content')) readerChanged = true;
                if (target?.closest?.('#readen-dialog-overlay')) dialogChanged = true;
                for (const node of mutation.addedNodes) inspectAddedNode(node);
            }
            if (readerChanged) renderInlineReflections();
            if (dialogChanged) handleReflectionSuccessDialog();
        });
        observer.observe(root, { childList: true, subtree: true });
    }

    function init() {
        if (document.getElementById('readenAppUI')) startObservers();
        else document.addEventListener('DOMContentLoaded', startObservers, { once: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Bundled module: readen-txt-encoding-fix.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const INPUT_ID = 'readen-local-import-input';
    const NORMALIZED_FLAG = 'readenTxtEncodingNormalized';
    const NOTICE_FLAG = 'readenTxtEncodingNoticeShown';

    function decodeText(buffer, encoding, fatal = false) {
        return new TextDecoder(encoding, { fatal }).decode(buffer);
    }

    function decodeUtf16WithoutBom(bytes, buffer) {
        if (bytes.length < 8) return '';
        const sampleLength = Math.min(bytes.length, 4096);
        let evenZero = 0;
        let oddZero = 0;
        let evenTotal = 0;
        let oddTotal = 0;
        for (let index = 0; index < sampleLength; index += 1) {
            if (index % 2 === 0) {
                evenTotal += 1;
                if (bytes[index] === 0) evenZero += 1;
            } else {
                oddTotal += 1;
                if (bytes[index] === 0) oddZero += 1;
            }
        }
        const evenRatio = evenTotal ? evenZero / evenTotal : 0;
        const oddRatio = oddTotal ? oddZero / oddTotal : 0;
        if (oddRatio > 0.28 && evenRatio < 0.08) return decodeText(buffer, 'utf-16le');
        if (evenRatio > 0.28 && oddRatio < 0.08) return decodeText(buffer, 'utf-16be');
        return '';
    }

    function scoreLegacyText(text) {
        const value = String(text || '');
        if (!value) return -Infinity;
        const replacement = (value.match(/\uFFFD/g) || []).length;
        const controls = (value.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
        const cjk = (value.match(/[\u3400-\u9FFF]/g) || []).length;
        const punctuation = (value.match(/[，。！？；：“”‘’《》（）【】、…—]/g) || []).length;
        return cjk + punctuation * 0.5 - replacement * 80 - controls * 12;
    }

    function decodeLegacyChinese(buffer) {
        const candidates = [];
        ['gb18030', 'big5'].forEach(encoding => {
            try {
                const text = decodeText(buffer, encoding, true);
                candidates.push({ text, score: scoreLegacyText(text) });
            } catch (error) {
                try {
                    const text = decodeText(buffer, encoding, false);
                    candidates.push({ text, score: scoreLegacyText(text) });
                } catch (fallbackError) {
                    console.debug(`[Readen] ${encoding} decode unavailable`, fallbackError);
                }
            }
        });
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0]?.text || decodeText(buffer, 'utf-8');
    }

    function decodeTxtBuffer(buffer) {
        const bytes = new Uint8Array(buffer || []);
        if (!bytes.length) return '';
        if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) return decodeText(buffer, 'utf-8');
        if (bytes[0] === 0xFF && bytes[1] === 0xFE) return decodeText(buffer, 'utf-16le');
        if (bytes[0] === 0xFE && bytes[1] === 0xFF) return decodeText(buffer, 'utf-16be');

        const utf16 = decodeUtf16WithoutBom(bytes, buffer);
        if (utf16) return utf16;

        try {
            return decodeText(buffer, 'utf-8', true);
        } catch (error) {
            return decodeLegacyChinese(buffer);
        }
    }

    function makeUtf8File(file, text) {
        if (typeof File !== 'function') return null;
        return new File(['\uFEFF', String(text || '')], file.name, {
            type: 'text/plain;charset=utf-8',
            lastModified: Number(file.lastModified) || Date.now()
        });
    }

    function forwardOriginalImport(input, file) {
        input.dataset[NORMALIZED_FLAG] = '1';
        if (typeof DataTransfer !== 'function') {
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return false;
        }
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    async function interceptTxtImport(event) {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.id !== INPUT_ID) return;
        if (input.dataset[NORMALIZED_FLAG] === '1') {
            delete input.dataset[NORMALIZED_FLAG];
            return;
        }
        const file = input.files?.[0];
        if (!file || !/\.txt$/i.test(file.name || '')) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        try {
            const buffer = await file.arrayBuffer();
            const text = decodeTxtBuffer(buffer);
            const normalizedFile = makeUtf8File(file, text);
            if (!normalizedFile) throw new Error('当前浏览器无法创建标准 UTF-8 文件');
            const normalized = forwardOriginalImport(input, normalizedFile);
            if (!normalized && typeof window.showToast === 'function') {
                window.showToast('当前浏览器无法预处理 TXT 编码，将按原方式导入');
            }
        } catch (error) {
            console.warn('[Readen] TXT encoding normalization failed', error);
            input.dataset[NORMALIZED_FLAG] = '1';
            input.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof window.showToast === 'function') window.showToast('TXT 编码识别失败，已按原方式读取');
        }
    }

    function looksPersistentlyCorrupted(text) {
        const value = String(text || '');
        if (!value) return false;
        const replacementCount = (value.match(/\uFFFD/g) || []).length;
        return replacementCount >= 3 || /锟斤拷|锟斤|烫烫烫/.test(value);
    }

    function warnForStoredCorruption() {
        try {
            if (sessionStorage.getItem(NOTICE_FLAG) === '1') return;
            const content = document.getElementById('readen-reader-content');
            const reader = document.getElementById('readen-reader-container');
            if (!content || !reader?.classList.contains('active')) return;
            if (!looksPersistentlyCorrupted(content.textContent)) return;
            sessionStorage.setItem(NOTICE_FLAG, '1');
            if (typeof window.showToast === 'function') {
                window.showToast('检测到旧 TXT 正文可能已按错误编码保存；请用原 TXT 重新导入一次以恢复原文');
            }
        } catch (error) {
            console.debug('[Readen] stored TXT corruption check skipped', error);
        }
    }

    function init() {
        document.addEventListener('change', interceptTxtImport, true);
        const root = document.getElementById('readenAppUI');
        if (!root || typeof MutationObserver !== 'function') return;
        const observer = new MutationObserver(() => warnForStoredCorruption());
        observer.observe(root, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Bundled module: readen-reader-ui-hotfix.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-reader-ui-hotfix-style';
    const DRAWER_ID = 'readen-reader-chapter-drawer';
    const TAB_TARGET = 'reflections';
    function injectLayoutFix() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.readen-app-container .reader-content {
    padding-top: calc(72px + var(--safe-top, 0px)) !important;
    padding-bottom: calc(52px + var(--safe-bottom, 0px)) !important;
}
.readen-app-container #readen-reader-container.ra-layout-active .reader-content {
    padding-top: calc(var(--ra-body-top, 56) * 1px + var(--safe-top, 0px)) !important;
    padding-bottom: calc(var(--ra-body-bottom, 26) * 1px + var(--safe-bottom, 0px)) !important;
}
.readen-app-container #readen-reader-container.ra-layout-active .ra-page-header {
    top: calc(var(--safe-top, 0px) + var(--ra-header-top, 10) * 1px) !important;
}
.readen-app-container #readen-reader-container.ra-layout-active .ra-page-footer {
    bottom: calc(var(--safe-bottom, 0px) + var(--ra-footer-bottom, 8) * 1px) !important;
}
.readen-app-container .readen-chapter-switch-instant,
.readen-app-container .readen-chapter-switch-instant.paged-mode {
    transition: none !important;
    animation: none !important;
}
.readen-app-container #ra-open-book-layout.readen-hidden-layout-entry {
    display: none !important;
}
.readen-app-container .readen-reflection-never-check {
    width: auto !important;
    min-height: 34px;
    margin: 8px auto 2px;
    padding: 5px 8px !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0 !important;
    background: transparent !important;
    color: #55585e !important;
    font-size: 13px !important;
    font-weight: 650 !important;
    line-height: 1.35;
}
.readen-app-container .readen-reflection-never-box {
    width: 18px;
    height: 18px;
    border: 1.6px solid #9a9da3;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    box-sizing: border-box;
    transition: .16s ease;
}
.readen-app-container .readen-reflection-never-box svg {
    width: 13px;
    height: 13px;
    fill: none;
    stroke: #fff;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    transform: scale(.75);
    transition: .16s ease;
}
.readen-app-container .readen-reflection-never-check.is-checked .readen-reflection-never-box {
    border-color: var(--theme-blue, #6b8299);
    background: var(--theme-blue, #6b8299);
}
.readen-app-container .readen-reflection-never-check.is-checked .readen-reflection-never-box svg {
    opacity: 1;
    transform: scale(1);
}
.readen-app-container .drawer-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}
.readen-app-container .drawer-tabs::-webkit-scrollbar { display: none; }
.readen-app-container .drawer-tab[data-target="${TAB_TARGET}"] {
    flex: 0 0 auto;
    white-space: nowrap;
}
.readen-app-container .readen-reflection-pane-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 20px 6px;
}
.readen-app-container .readen-reflection-pane-actions .reader-tool-btn {
    flex: none;
    width: 100%;
}
.readen-app-container .readen-reflection-pane-actions .reader-tool-btn:disabled {
    opacity: .45;
}
.readen-app-container .readen-reflection-pane-actions small {
    color: #8e8e93;
    font-size: 12px;
    text-align: center;
}
`;
        document.head.appendChild(style);
    }

    function getBooks() {
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) return readenBooksData;
        } catch (error) {
            console.debug('[Readen] reflection hotfix: book data unavailable', error);
        }
        return [];
    }

    function normalize(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function findBookForDrawer(drawer) {
        const books = getBooks();
        if (!books.length) return null;
        const rawTitle = normalize(drawer?.querySelector('.drawer-book-title')?.textContent);
        if (rawTitle) {
            const matches = books
                .filter(book => {
                    const title = normalize(book?.title);
                    return title && (rawTitle.includes(title) || title.includes(rawTitle.replace(/^阅读中[:：]?\s*/, '')));
                })
                .sort((a, b) => normalize(b?.title).length - normalize(a?.title).length);
            if (matches.length) return matches[0];
        }
        const reader = document.getElementById('readen-reader-container');
        if (!reader?.classList.contains('active')) return null;
        return [...books].sort((a, b) => (Number(b?.lastReadTime) || 0) - (Number(a?.lastReadTime) || 0))[0] || null;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function formatTime(value) {
        const date = new Date(Number(value) || Date.now());
        if (Number.isNaN(date.getTime())) return '';
        const pad = number => String(number).padStart(2, '0');
        return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function getRoleName(annotation) {
        return normalize(annotation?.characterName) || '角色';
    }

    function getRoleKey(annotation) {
        return String(annotation?.contactId || annotation?.linkedContactId || getRoleName(annotation));
    }

    function getReflections(book) {
        return (Array.isArray(book?.annotations) ? book.annotations : [])
            .filter(item => item?.kind === 'chapter_reflection' && item.status !== 'deleted')
            .sort((a, b) => (Number(b?.createdAt) || 0) - (Number(a?.createdAt) || 0));
    }

    function getChapterIndex(annotation) {
        const value = Number(annotation?.chapter?.indexAtCreation ?? annotation?.chapter?.index);
        return Number.isFinite(value) ? Math.max(0, value) : null;
    }

    function getChapterTitle(book, annotation) {
        const stored = normalize(annotation?.chapter?.title);
        if (stored) return stored;
        const index = getChapterIndex(annotation);
        const chapter = index !== null && Array.isArray(book?.chapters) ? book.chapters[index] : null;
        return normalize(chapter?.title) || (index !== null ? `第${index + 1}章` : '未命名章节');
    }

    function groupReflections(book) {
        const groups = new Map();
        getReflections(book).forEach(annotation => {
            const index = getChapterIndex(annotation);
            const title = getChapterTitle(book, annotation);
            const key = index !== null ? `index:${index}` : `title:${title}`;
            if (!groups.has(key)) groups.set(key, { key, index, title, items: [] });
            groups.get(key).items.push(annotation);
        });
        return [...groups.values()].sort((a, b) => {
            const ai = a.index === null ? -1 : a.index;
            const bi = b.index === null ? -1 : b.index;
            if (ai !== bi) return bi - ai;
            return (Number(b.items[0]?.createdAt) || 0) - (Number(a.items[0]?.createdAt) || 0);
        });
    }

    function avatarMarkup(annotation) {
        const name = getRoleName(annotation);
        const avatar = normalize(annotation?.characterAvatar);
        return avatar
            ? `<span class="readen-reflection-avatar"><img src="${escapeAttr(avatar)}" alt="${escapeAttr(name)}"></span>`
            : `<span class="readen-reflection-avatar">${escapeHtml(name.slice(0, 1) || '角')}</span>`;
    }

    function receiptMarkup(annotation, chapterTitle) {
        const name = getRoleName(annotation);
        const content = normalize(annotation?.content) || '这一章还没有留下文字。';
        return `
            <div class="readen-reflection-receipt-wrap">
                <div class="readen-reflection-receipt-rail" aria-hidden="true"></div>
                <div class="readen-reflection-receipt">
                    <div class="readen-reflection-receipt-kicker">CHARACTER NOTE · 角色有话说</div>
                    <div class="readen-reflection-receipt-head">
                        <strong>${escapeHtml(chapterTitle)}</strong>
                        <span>${escapeHtml(formatTime(annotation?.createdAt))}</span>
                    </div>
                    <div class="readen-reflection-receipt-rule"></div>
                    <div class="readen-reflection-receipt-content">${escapeHtml(content)}</div>
                    <div class="readen-reflection-receipt-sign">“ ${escapeHtml(name)} ”</div>
                </div>
            </div>
        `;
    }

    function roleCardMarkup(annotation, chapterTitle) {
        const name = getRoleName(annotation);
        return `
            <article class="readen-reflection-role-card" data-readen-reflection-id="${escapeAttr(annotation?.id || '')}">
                <button type="button" class="readen-reflection-role-toggle" aria-expanded="false">
                    ${avatarMarkup(annotation)}
                    <span class="readen-reflection-role-copy">
                        <strong>${escapeHtml(name)}</strong>
                        <small>章末感想 · ${escapeHtml(formatTime(annotation?.createdAt))}</small>
                    </span>
                    <span class="readen-reflection-role-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                </button>
                <div class="readen-reflection-role-body">${receiptMarkup(annotation, chapterTitle)}</div>
            </article>
        `;
    }

    function bindPane(pane) {
        pane.querySelectorAll('.readen-reflection-chapter-group').forEach(group => {
            const button = group.querySelector('.readen-reflection-chapter-toggle');
            button?.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const next = !group.classList.contains('is-open');
                group.classList.toggle('is-open', next);
                button.setAttribute('aria-expanded', String(next));
            });
        });
        pane.querySelectorAll('.readen-reflection-role-card').forEach(card => {
            const button = card.querySelector('.readen-reflection-role-toggle');
            button?.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const next = !card.classList.contains('is-open');
                card.classList.toggle('is-open', next);
                button.setAttribute('aria-expanded', String(next));
            });
        });
    }

    function reflectionActionsMarkup() {
        const state = window.ReadenApp?.getChapterReflectionState?.();
        if (!state) return '';
        let label = '生成本章感想';
        let hint = `请 ${state.name} 说说读完这一章的感受`;
        let action = 'generate';
        let disabled = false;
        if (!state.bound) {
            label = '选择共读角色';
            hint = '绑定角色后，可以请 TA 写章末感想';
        } else if (state.hasReflection) {
            label = '重新生成本章感想';
            hint = `会替换 ${state.name} 这一章原来的感想`;
            action = 'replace';
        } else if (!state.chapterFinished) {
            hint = '读完本章后才能生成，避免剧透';
            disabled = true;
        }
        return `<div class="readen-reflection-pane-actions">
            <button type="button" class="reader-tool-btn primary" data-readen-reflection-action="${action}"${disabled ? ' disabled' : ''}>${escapeHtml(label)}</button>
            <small>${escapeHtml(hint)}</small>
        </div>`;
    }

    function bindReflectionActions(pane) {
        pane.querySelector('[data-readen-reflection-action]')?.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const replace = event.currentTarget.dataset.readenReflectionAction === 'replace';
            window.ReadenApp?.requestCurrentChapterReflection?.({ replace });
        });
    }

    function renderPane(drawer, pane) {
        const book = findBookForDrawer(drawer);
        if (!book) {
            pane.innerHTML = '<div class="readen-reflection-drawer-empty">暂时无法读取这本书的角色感想。</div>';
            return;
        }
        const groups = groupReflections(book);
        const actions = reflectionActionsMarkup();
        if (!groups.length) {
            pane.innerHTML = actions + '<div class="readen-reflection-drawer-empty">还没有角色感想。读完一章后，角色留下的感想会收在这里。</div>';
            bindReflectionActions(pane);
            return;
        }
        pane.innerHTML = actions + groups.map(group => {
            const roleCount = new Set(group.items.map(getRoleKey)).size;
            return `
                <section class="readen-reflection-chapter-group" data-readen-reflection-chapter-key="${escapeAttr(group.key)}">
                    <button type="button" class="readen-reflection-chapter-toggle" aria-expanded="false">
                        <span class="readen-reflection-chapter-copy">
                            <strong>${escapeHtml(group.title)}</strong>
                            <small>${roleCount} 位角色 · ${group.items.length} 条感想</small>
                        </span>
                        <span class="readen-reflection-chapter-count">${group.items.length}</span>
                        <span class="readen-reflection-chapter-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                    </button>
                    <div class="readen-reflection-chapter-body">
                        ${group.items.map(item => roleCardMarkup(item, group.title)).join('')}
                    </div>
                </section>
            `;
        }).join('');
        bindPane(pane);
        bindReflectionActions(pane);
    }

    function ensureReflectionTab(drawer) {
        if (!drawer) return;
        const tabs = drawer.querySelector('.drawer-tabs');
        const contentArea = drawer.querySelector('.drawer-content-area');
        if (!tabs || !contentArea) return;

        let tab = drawer.querySelector(`.drawer-tab[data-target="${TAB_TARGET}"]`);
        if (!tab) {
            tab = document.createElement('div');
            tab.className = 'drawer-tab';
            tab.dataset.target = TAB_TARGET;
            tab.textContent = '角色感想';
            const statsTab = tabs.querySelector('[data-target="stats"]');
            tabs.insertBefore(tab, statsTab || null);
        } else if (tab.textContent.trim() !== '角色感想') {
            tab.textContent = '角色感想';
        }

        let pane = drawer.querySelector(`#drawer-pane-${TAB_TARGET}`);
        if (!pane) {
            pane = document.createElement('div');
            pane.className = 'drawer-pane readen-reflection-drawer-pane';
            pane.id = `drawer-pane-${TAB_TARGET}`;
            contentArea.appendChild(pane);
        }

        if (tab.dataset.readenHotfixBound === '1') return;
        tab.dataset.readenHotfixBound = '1';
        tab.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            drawer.querySelectorAll('.drawer-tab').forEach(item => item.classList.toggle('active', item === tab));
            drawer.querySelectorAll('.drawer-pane').forEach(item => item.classList.toggle('active', item === pane));
            drawer.querySelectorAll('.drawer-bottom-actions .rb-action-item').forEach(item => item.classList.remove('active'));
            renderPane(drawer, pane);
        });
    }

    function suppressChapterResetAnimation(content) {
        if (!content || content.dataset.readenChapterResetLock === '1') return;
        content.dataset.readenChapterResetLock = '1';
        content.classList.add('readen-chapter-switch-instant');
        requestAnimationFrame(() => requestAnimationFrame(() => {
            content.classList.remove('readen-chapter-switch-instant');
            content.dataset.readenChapterResetLock = '0';
        }));
    }

    function enhanceReflectionPrompt(scope) {
        const button = scope?.id === 'readen-chapter-reflection-never-btn'
            ? scope
            : scope?.querySelector?.('#readen-chapter-reflection-never-btn');
        if (!button || button.dataset.readenCheckboxReady === '1') return;
        button.dataset.readenCheckboxReady = '1';
        button.classList.add('readen-reflection-never-check');
        button.setAttribute('role', 'checkbox');
        button.setAttribute('aria-checked', 'false');
        button.innerHTML = '<span class="readen-reflection-never-box" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 7"></polyline></svg></span><span>本章不再提示</span>';
        button.addEventListener('click', event => {
            if (button.dataset.readenCommit === '1') {
                button.dataset.readenCommit = '0';
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            const checked = button.getAttribute('aria-checked') !== 'true';
            button.setAttribute('aria-checked', String(checked));
            button.classList.toggle('is-checked', checked);
        }, true);

        const overlay = button.closest('#readen-dialog-overlay');
        ['readen-dialog-cancel', 'readen-dialog-confirm'].forEach(id => {
            const action = overlay?.querySelector(`#${id}`);
            if (!action || action.dataset.readenNeverCommitBound === '1') return;
            action.dataset.readenNeverCommitBound = '1';
            action.addEventListener('click', () => {
                const checkbox = overlay.querySelector('#readen-chapter-reflection-never-btn');
                if (!checkbox || checkbox.getAttribute('aria-checked') !== 'true') return;
                checkbox.dataset.readenCommit = '1';
                checkbox.click();
            }, true);
        });
    }

    function migrateAdvancedLayoutEntry(scope) {
        const panel = scope?.id === 'readen-reader-font-panel'
            ? scope
            : document.getElementById('readen-reader-font-panel');
        if (!panel) return;
        const standalone = panel.querySelector('#ra-open-book-layout');
        if (standalone) {
            // Only write when needed; repeated identical writes still fire mutation records.
            if (!standalone.classList.contains('readen-hidden-layout-entry')) standalone.classList.add('readen-hidden-layout-entry');
            if (standalone.getAttribute('aria-hidden') !== 'true') standalone.setAttribute('aria-hidden', 'true');
            if (standalone.tabIndex !== -1) standalone.tabIndex = -1;
        }
        panel.querySelectorAll('.rf-big-btn').forEach(button => {
            if (!normalize(button.textContent).includes('更多设置') || button.dataset.readenAdvancedMoved === '1') return;
            button.dataset.readenAdvancedMoved = '1';
            button.addEventListener('click', event => {
                const entry = document.getElementById('ra-open-book-layout');
                if (!entry) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                entry.click();
            }, true);
        });
    }

    function inspectNode(node) {
        if (!(node instanceof Element)) return;
        if (node.id === DRAWER_ID) ensureReflectionTab(node);
        node.querySelectorAll?.(`#${DRAWER_ID}`).forEach(ensureReflectionTab);
        enhanceReflectionPrompt(node);
        migrateAdvancedLayoutEntry(node);
        if (node.id === 'readen-reader-content' || node.closest?.('#readen-reader-content')) {
            suppressChapterResetAnimation(document.getElementById('readen-reader-content'));
        }
    }

    function init() {
        injectLayoutFix();
        const root = document.getElementById('readenAppUI');
        if (!root) return;
        ensureReflectionTab(document.getElementById(DRAWER_ID));
        enhanceReflectionPrompt(root);
        migrateAdvancedLayoutEntry(root);
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.target?.id === 'readen-reader-content'
                    && (!mutation.target.style.transform || mutation.target.style.transform === 'none')) {
                    suppressChapterResetAnimation(mutation.target);
                }
                for (const node of mutation.addedNodes) inspectNode(node);
                if (mutation.target instanceof Element) {
                    migrateAdvancedLayoutEntry(mutation.target);
                }
            }
        });
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Bundled module: readen-advanced-settings.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-user-global-css';
    const DEFAULT_LAYOUT = Object.freeze({
        letterSpacing: 0,
        lineHeight: 1.75,
        paragraphSpacing: 16,
        textIndent: 2,
        bodyTop: 56,
        bodyBottom: 26,
        bodyLeft: 20,
        bodyRight: 20,
        titleVisible: true,
        titleAlign: 'left',
        titleSize: 28,
        titleTop: 8,
        titleBottom: 22,
        headerVisible: true,
        headerSeparated: false,
        headerTop: 10,
        headerBottom: 4,
        headerLeft: 16,
        headerRight: 16,
        headerLeftText: 'chapter',
        headerCenterText: 'none',
        headerRightText: 'time',
        footerVisible: true,
        footerSeparated: false,
        footerTop: 4,
        footerBottom: 8,
        footerLeft: 16,
        footerRight: 16,
        footerLeftText: 'book',
        footerCenterText: 'none',
        footerRightText: 'progress',
        chromeColor: '#333333',
        separatorColor: '#d2d2d7'
    });

    const DEFAULT_SPEECH = Object.freeze({
        mode: 'system',
        tone: 'natural',
        voiceURI: '',
        pitch: 1,
        rate: 1,
        autoNext: false
    });

    const TONE_PRESETS = {
        natural: { name: '自然', pitch: 1, rate: 1 },
        soft: { name: '柔和', pitch: 1.08, rate: 0.92 },
        clear: { name: '清晰', pitch: 1.02, rate: 1.04 },
        low: { name: '低沉', pitch: 0.84, rate: 0.92 },
        bright: { name: '轻快', pitch: 1.16, rate: 1.08 }
    };

    let root = null;
    let observer = null;
    let clockTimer = null;
    let speechPatched = false;
    let originalSpeak = null;
    let liveLayoutBackup = null;
    let openOverlay = null;
    let scheduleQueued = false;

    function settings() {
        try {
            if (typeof readenSettings !== 'undefined' && readenSettings) return readenSettings;
        } catch (_) {}
        return null;
    }

    function books() {
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) return readenBooksData;
        } catch (_) {}
        return [];
    }

    function save() {
        try {
            if (typeof saveReadenAppData === 'function') saveReadenAppData();
            else if (typeof window.saveReadenAppData === 'function') window.saveReadenAppData();
        } catch (error) {
            console.warn('[Readen advanced] save failed', error);
        }
    }

    function toast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
        else console.info('[Readen advanced]', message);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeLayout(value) {
        return Object.assign({}, DEFAULT_LAYOUT, value && typeof value === 'object' ? value : {});
    }

    function normalizeSpeech(value) {
        const next = Object.assign({}, DEFAULT_SPEECH, value && typeof value === 'object' ? value : {});
        const tone = TONE_PRESETS[next.tone] || TONE_PRESETS.natural;
        if (!Number.isFinite(Number(next.pitch))) next.pitch = tone.pitch;
        if (!Number.isFinite(Number(next.rate))) next.rate = tone.rate;
        return next;
    }

    function ensureState() {
        const s = settings();
        if (!s) return null;
        if (!s.readerLayout || typeof s.readerLayout !== 'object') s.readerLayout = clone(DEFAULT_LAYOUT);
        else s.readerLayout = normalizeLayout(s.readerLayout);
        if (!s.readerSpeech || typeof s.readerSpeech !== 'object') s.readerSpeech = clone(DEFAULT_SPEECH);
        else s.readerSpeech = normalizeSpeech(s.readerSpeech);
        if (typeof s.readerCustomCss !== 'string') s.readerCustomCss = '';
        if (!Array.isArray(s.readerAppearancePresets)) s.readerAppearancePresets = [];
        s.readerAppearancePresets = s.readerAppearancePresets
            .filter(item => item && typeof item === 'object')
            .map(item => ({
                id: String(item.id || `appearance-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`),
                name: String(item.name || '未命名预设').trim() || '未命名预设',
                css: typeof item.css === 'string' ? item.css : '',
                createdAt: Number(item.createdAt) || Date.now()
            }));

        if (s.readerCustomCss && s.readerAppearancePresets.length === 0) {
            const legacyPreset = {
                id: 'readen-appearance-legacy',
                name: '原自定义',
                css: s.readerCustomCss,
                createdAt: Date.now()
            };
            s.readerAppearancePresets.push(legacyPreset);
            s.readerAppearancePresetId = legacyPreset.id;
        }

        if (typeof s.readerAppearancePresetId !== 'string') {
            s.readerAppearancePresetId = s.readerCustomCss ? (s.readerAppearancePresets[0]?.id || '') : '';
        }
        const activePreset = s.readerAppearancePresets.find(item => item.id === s.readerAppearancePresetId);
        if (s.readerAppearancePresetId && !activePreset) s.readerAppearancePresetId = '';
        return s;
    }

    function currentBook() {
        const list = books();
        if (!list.length) return null;
        const reader = document.getElementById('readen-reader-container');
        if (!reader || !reader.classList.contains('active')) return null;

        const visibleTitle = String(
            document.querySelector('#readen-reader-chapter-drawer .drawer-book-title')?.textContent ||
            document.querySelector('.reader-book-title')?.textContent || ''
        ).replace(/^阅读中[:：]?\s*/, '').trim();
        if (visibleTitle) {
            const match = list.find(item => String(item?.title || '').trim() === visibleTitle) ||
                list.find(item => visibleTitle.includes(String(item?.title || '').trim()));
            if (match) return match;
        }
        return [...list].sort((a, b) => (Number(b?.lastReadTime) || 0) - (Number(a?.lastReadTime) || 0))[0] || null;
    }

    function effectiveLayout(book = currentBook()) {
        const s = ensureState();
        const globalLayout = normalizeLayout(s?.readerLayout);
        if (book?.readerLayoutOverride?.enabled) return normalizeLayout(book.readerLayoutOverride.values);
        return globalLayout;
    }

    function effectiveSpeech(book = currentBook()) {
        const s = ensureState();
        const globalSpeech = normalizeSpeech(s?.readerSpeech);
        if (book?.readerSpeechOverride?.enabled) return normalizeSpeech(book.readerSpeechOverride.values);
        return globalSpeech;
    }

    function setCssVar(element, key, value) {
        if (!element) return;
        const next = String(value);
        // Skip identical writes: every write is a DOM mutation that wakes the observers again.
        if (element.style.getPropertyValue(key) === next) return;
        element.style.setProperty(key, next);
    }

    function setTextIfChanged(element, text) {
        if (!element) return;
        const next = String(text ?? '');
        if (element.textContent !== next) element.textContent = next;
    }

    function setClassIfChanged(element, className, enabled) {
        if (!element) return;
        if (element.classList.contains(className) !== Boolean(enabled)) element.classList.toggle(className, Boolean(enabled));
    }

    function formatProgress() {
        const slider = document.querySelector('#readen-reader-bottom-menu .rb-slider');
        const raw = Number(slider?.value);
        return Number.isFinite(raw) ? `${Math.round(raw)}%` : '';
    }

    function currentChapterTitle() {
        const heading = document.querySelector('#readen-reader-content .readen-enhanced-chapter-heading h1');
        if (heading?.textContent?.trim()) return heading.textContent.trim();
        const title = document.querySelector('#readen-reader-content > h1, #readen-reader-content .chapter-title');
        return title?.textContent?.trim() || '正文';
    }

    function tokenText(token, book) {
        switch (token) {
            case 'book': return String(book?.title || '');
            case 'chapter': return currentChapterTitle();
            case 'time': {
                const now = new Date();
                return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            }
            case 'progress': return formatProgress();
            case 'chapterNo': {
                const text = currentChapterTitle();
                const match = text.match(/第\s*[0-9一二三四五六七八九十百千万零〇两]+\s*[章节卷回]/);
                return match ? match[0] : '';
            }
            default: return '';
        }
    }

    function ensureReaderChrome(reader) {
        let header = reader.querySelector('.ra-page-header');
        let footer = reader.querySelector('.ra-page-footer');
        if (!header) {
            header = document.createElement('div');
            header.className = 'ra-page-header';
            header.innerHTML = '<span></span><span></span><span></span>';
            reader.appendChild(header);
        }
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'ra-page-footer';
            footer.innerHTML = '<span></span><span></span><span></span>';
            reader.appendChild(footer);
        }
        return { header, footer };
    }

    function applyLayout(layout, book = currentBook()) {
        const reader = document.getElementById('readen-reader-container');
        if (!reader || !reader.classList.contains('active')) return;
        const p = normalizeLayout(layout);
        setClassIfChanged(reader, 'ra-layout-active', true);
        setClassIfChanged(reader, 'ra-hide-title', !p.titleVisible);
        [
            ['--ra-letter-spacing', p.letterSpacing], ['--ra-line-height', p.lineHeight],
            ['--ra-paragraph-spacing', p.paragraphSpacing], ['--ra-text-indent', p.textIndent],
            ['--ra-body-top', p.bodyTop], ['--ra-body-bottom', p.bodyBottom],
            ['--ra-body-left', p.bodyLeft], ['--ra-body-right', p.bodyRight],
            ['--ra-title-size', p.titleSize], ['--ra-title-top', p.titleTop],
            ['--ra-title-bottom', p.titleBottom], ['--ra-title-align', p.titleAlign],
            ['--ra-header-top', p.headerTop], ['--ra-header-bottom', p.headerBottom],
            ['--ra-header-left', p.headerLeft], ['--ra-header-right', p.headerRight],
            ['--ra-footer-top', p.footerTop], ['--ra-footer-bottom', p.footerBottom],
            ['--ra-footer-left', p.footerLeft], ['--ra-footer-right', p.footerRight],
            ['--ra-chrome-color', p.chromeColor], ['--ra-separator-color', p.separatorColor]
        ].forEach(([key, value]) => setCssVar(reader, key, value));

        const { header, footer } = ensureReaderChrome(reader);
        if (header.hidden !== !p.headerVisible) header.hidden = !p.headerVisible;
        if (footer.hidden !== !p.footerVisible) footer.hidden = !p.footerVisible;
        setClassIfChanged(header, 'is-separated', Boolean(p.headerSeparated));
        setClassIfChanged(footer, 'is-separated', Boolean(p.footerSeparated));
        [p.headerLeftText, p.headerCenterText, p.headerRightText].forEach((token, index) => {
            setTextIfChanged(header.children[index], tokenText(token, book));
        });
        [p.footerLeftText, p.footerCenterText, p.footerRightText].forEach((token, index) => {
            setTextIfChanged(footer.children[index], tokenText(token, book));
        });
    }

    function applyCurrentLayout() {
        const book = currentBook();
        if (!book) return;
        applyLayout(effectiveLayout(book), book);
    }

    function applyCustomCss() {
        const s = ensureState();
        if (!s) return;
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }
        const css = s.readerCustomCss || '';
        if (style.textContent !== css) style.textContent = css;
    }

    function makeOverlay(id, title) {
        document.getElementById(id)?.remove();
        const overlay = document.createElement('div');
        overlay.className = 'ra-overlay';
        overlay.id = id;
        overlay.innerHTML = `
            <section class="ra-sheet" role="dialog" aria-modal="true" aria-label="${title}">
                <div class="ra-sheet-head">
                    <button type="button" class="ra-head-btn" data-ra-cancel>取消</button>
                    <strong>${title}</strong>
                    <button type="button" class="ra-head-btn" data-ra-save>保存</button>
                </div>
                <div class="ra-sheet-body"></div>
            </section>`;
        root.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('is-open'));
        openOverlay = overlay;
        return overlay;
    }

    function closeOverlay(overlay) {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        setTimeout(() => overlay.remove(), 180);
        if (openOverlay === overlay) openOverlay = null;
    }

    function rangeRow(key, label, min, max, step, value, unit) {
        return `<div class="ra-row">
            <span>${label}</span>
            <div class="ra-range-wrap"><input type="range" data-ra-key="${key}" min="${min}" max="${max}" step="${step}" value="${value}"></div>
            <span class="ra-value" data-ra-value="${key}">${value}${unit || ''}</span>
        </div>`;
    }

    function selectOptions(active) {
        const items = [
            ['none', '无'], ['book', '书名'], ['chapter', '标题'], ['chapterNo', '章节号'], ['time', '时间'], ['progress', '进度']
        ];
        return items.map(([value, label]) => `<option value="${value}"${value === active ? ' selected' : ''}>${label}</option>`).join('');
    }

    function sectionToggleMarkup(key, label, on) {
        return `<div class="ra-row"><span>${label}</span><span></span><button type="button" class="ra-switch${on ? ' is-on' : ''}" data-ra-toggle="${key}" aria-pressed="${on ? 'true' : 'false'}"></button></div>`;
    }

    function renderLayoutEditor(body, working, scopeLabel, allowFollowGlobal, followGlobal) {
        body.innerHTML = `
            <div class="ra-section">
                <div class="ra-section-title">${scopeLabel}</div>
                ${allowFollowGlobal ? `<div class="ra-row"><span>本书单独设置</span><span class="ra-section-note" style="margin:0;">关闭后跟随“我的 → 阅读设置”</span><button type="button" class="ra-switch${followGlobal ? '' : ' is-on'}" data-ra-toggle="bookOverride" aria-pressed="${followGlobal ? 'false' : 'true'}"></button></div>` : '<div class="ra-section-note">这里是所有书籍的默认排版；单本书可以在阅读页覆盖。</div>'}
            </div>
            <div class="ra-section">
                <div class="ra-section-title">正文</div>
                ${rangeRow('letterSpacing', '字距', -2, 6, .25, working.letterSpacing, 'px')}
                ${rangeRow('lineHeight', '行距', 1.1, 2.8, .05, working.lineHeight, '')}
                ${rangeRow('paragraphSpacing', '段距', 0, 48, 1, working.paragraphSpacing, 'px')}
                ${rangeRow('textIndent', '缩进', 0, 4, .25, working.textIndent, 'em')}
                ${rangeRow('bodyTop', '上边距', 20, 120, 1, working.bodyTop, 'px')}
                ${rangeRow('bodyBottom', '下边距', 12, 100, 1, working.bodyBottom, 'px')}
                ${rangeRow('bodyLeft', '左边距', 8, 60, 1, working.bodyLeft, 'px')}
                ${rangeRow('bodyRight', '右边距', 8, 60, 1, working.bodyRight, 'px')}
            </div>
            <div class="ra-section">
                <div class="ra-section-title">正文标题</div>
                ${sectionToggleMarkup('titleVisible', '显示/隐藏', working.titleVisible)}
                <div class="ra-row"><span>对齐</span><div class="ra-segment" data-ra-segment="titleAlign">
                    <button type="button" data-value="left" class="${working.titleAlign === 'left' ? 'is-active' : ''}">靠左</button>
                    <button type="button" data-value="center" class="${working.titleAlign === 'center' ? 'is-active' : ''}">居中</button>
                    <button type="button" data-value="right" class="${working.titleAlign === 'right' ? 'is-active' : ''}">靠右</button>
                </div><span></span></div>
                ${rangeRow('titleSize', '字号', 18, 48, 1, working.titleSize, 'px')}
                ${rangeRow('titleTop', '上边距', 0, 64, 1, working.titleTop, 'px')}
                ${rangeRow('titleBottom', '下边距', 0, 64, 1, working.titleBottom, 'px')}
            </div>
            ${renderChromeSection('页眉', 'header', working)}
            ${renderChromeSection('页脚', 'footer', working)}
            <div class="ra-section">
                <div class="ra-section-title">页眉 & 页脚</div>
                <div class="ra-row"><span>文字颜色</span><span></span><input class="ra-color-input" type="color" data-ra-key="chromeColor" value="${working.chromeColor}"></div>
                <div class="ra-row"><span>分隔线颜色</span><span></span><input class="ra-color-input" type="color" data-ra-key="separatorColor" value="${working.separatorColor}"></div>
            </div>`;
    }

    function renderChromeSection(title, prefix, working) {
        return `<div class="ra-section">
            <div class="ra-section-title">${title}</div>
            ${sectionToggleMarkup(`${prefix}Visible`, '显示/隐藏', working[`${prefix}Visible`])}
            ${sectionToggleMarkup(`${prefix}Separated`, '显示分隔线', working[`${prefix}Separated`])}
            ${rangeRow(`${prefix}Top`, '上边距', 0, 48, 1, working[`${prefix}Top`], 'px')}
            ${rangeRow(`${prefix}Bottom`, '下边距', 0, 48, 1, working[`${prefix}Bottom`], 'px')}
            ${rangeRow(`${prefix}Left`, '左边距', 0, 48, 1, working[`${prefix}Left`], 'px')}
            ${rangeRow(`${prefix}Right`, '右边距', 0, 48, 1, working[`${prefix}Right`], 'px')}
            <div class="ra-row"><span>左</span><select data-ra-key="${prefix}LeftText">${selectOptions(working[`${prefix}LeftText`])}</select><span></span></div>
            <div class="ra-row"><span>中</span><select data-ra-key="${prefix}CenterText">${selectOptions(working[`${prefix}CenterText`])}</select><span></span></div>
            <div class="ra-row"><span>右</span><select data-ra-key="${prefix}RightText">${selectOptions(working[`${prefix}RightText`])}</select><span></span></div>
        </div>`;
    }

    function bindLayoutEditor(overlay, working, onSave, onCancel, options = {}) {
        const body = overlay.querySelector('.ra-sheet-body');
        const isBookEditor = Object.prototype.hasOwnProperty.call(options, 'overrideEnabled');
        const syncBookOverrideToggle = () => {
            const toggle = body.querySelector('[data-ra-toggle="bookOverride"]');
            if (!toggle) return;
            toggle.classList.toggle('is-on', Boolean(options.overrideEnabled));
            toggle.setAttribute('aria-pressed', String(Boolean(options.overrideEnabled)));
        };
        const markBookEdited = () => {
            if (!isBookEditor || options.overrideEnabled) return;
            options.overrideEnabled = true;
            syncBookOverrideToggle();
        };
        const refresh = () => {
            if (isBookEditor && !options.overrideEnabled) {
                const globalLayout = settings()?.readerLayout;
                applyLayout(globalLayout ? normalizeLayout(globalLayout) : working);
                return;
            }
            applyLayout(working);
        };

        body.addEventListener('input', event => {
            const key = event.target.dataset.raKey;
            if (!key) return;
            markBookEdited();
            let value = event.target.value;
            if (event.target.type === 'range') value = Number(value);
            working[key] = value;
            const valueEl = body.querySelector(`[data-ra-value="${key}"]`);
            if (valueEl) {
                const suffix = ['letterSpacing','paragraphSpacing','bodyTop','bodyBottom','bodyLeft','bodyRight','titleSize','titleTop','titleBottom','headerTop','headerBottom','headerLeft','headerRight','footerTop','footerBottom','footerLeft','footerRight'].includes(key) ? 'px' : (key === 'textIndent' ? 'em' : '');
                valueEl.textContent = `${value}${suffix}`;
            }
            refresh();
        });
        body.addEventListener('change', event => {
            const key = event.target.dataset.raKey;
            if (!key) return;
            markBookEdited();
            working[key] = event.target.type === 'range' ? Number(event.target.value) : event.target.value;
            refresh();
        });
        body.addEventListener('click', event => {
            const toggle = event.target.closest('[data-ra-toggle]');
            if (toggle) {
                const key = toggle.dataset.raToggle;
                if (key === 'bookOverride') {
                    options.overrideEnabled = !options.overrideEnabled;
                    syncBookOverrideToggle();
                    refresh();
                } else {
                    markBookEdited();
                    working[key] = !Boolean(working[key]);
                    toggle.classList.toggle('is-on', Boolean(working[key]));
                    toggle.setAttribute('aria-pressed', String(Boolean(working[key])));
                    refresh();
                }
                return;
            }
            const segmentButton = event.target.closest('[data-ra-segment] button');
            if (segmentButton) {
                const segment = segmentButton.parentElement;
                const key = segment.dataset.raSegment;
                markBookEdited();
                working[key] = segmentButton.dataset.value;
                segment.querySelectorAll('button').forEach(btn => btn.classList.toggle('is-active', btn === segmentButton));
                refresh();
            }
        });
        overlay.querySelector('[data-ra-cancel]').addEventListener('click', () => {
            onCancel?.();
            closeOverlay(overlay);
        });
        overlay.querySelector('[data-ra-save]').addEventListener('click', () => {
            onSave?.(options);
            closeOverlay(overlay);
        });
        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                onCancel?.();
                closeOverlay(overlay);
            }
        });
    }

    function openGlobalLayoutEditor() {
        const s = ensureState();
        if (!s) return;
        const saved = normalizeLayout(s.readerLayout);
        const working = clone(saved);
        liveLayoutBackup = effectiveLayout();
        const overlay = makeOverlay('readen-global-layout-overlay', '阅读设置');
        renderLayoutEditor(overlay.querySelector('.ra-sheet-body'), working, '全局阅读默认', false, false);
        bindLayoutEditor(overlay, working, () => {
            s.readerLayout = normalizeLayout(working);
            save();
            applyCurrentLayout();
            toast('全局阅读设置已保存');
        }, () => applyLayout(liveLayoutBackup));
    }

    function openBookLayoutEditor() {
        const book = currentBook();
        const s = ensureState();
        if (!book || !s) return;
        const hasOverride = Boolean(book.readerLayoutOverride?.enabled);
        const saved = hasOverride ? normalizeLayout(book.readerLayoutOverride.values) : normalizeLayout(s.readerLayout);
        const working = clone(saved);
        liveLayoutBackup = effectiveLayout(book);
        const options = { overrideEnabled: hasOverride };
        const overlay = makeOverlay('readen-book-layout-overlay', '本书阅读设置');
        renderLayoutEditor(overlay.querySelector('.ra-sheet-body'), working, '本书排版', true, !hasOverride);
        bindLayoutEditor(overlay, working, opts => {
            if (opts.overrideEnabled) book.readerLayoutOverride = { enabled: true, values: normalizeLayout(working) };
            else book.readerLayoutOverride = { enabled: false, values: null };
            save();
            applyCurrentLayout();
            toast(opts.overrideEnabled ? '本书排版已保存' : '本书已改为跟随全局排版');
        }, () => applyLayout(liveLayoutBackup, book), options);
    }

    function availableVoices() {
        if (!('speechSynthesis' in window)) return [];
        return window.speechSynthesis.getVoices().slice().sort((a, b) => {
            const azh = /^zh/i.test(a.lang) ? 0 : 1;
            const bzh = /^zh/i.test(b.lang) ? 0 : 1;
            return azh - bzh || a.name.localeCompare(b.name);
        });
    }

    function voiceOptions(active) {
        const list = availableVoices();
        const options = ['<option value="">自动选择设备声音</option>'];
        list.forEach(voice => {
            options.push(`<option value="${escapeAttr(voice.voiceURI)}"${voice.voiceURI === active ? ' selected' : ''}>${escapeHtml(voice.name)} · ${escapeHtml(voice.lang)}</option>`);
        });
        return options.join('');
    }

    function speechSummary(pref) {
        if (pref.mode === 'character') return '角色语音 · 使用这本书绑定的共读角色';
        const tone = TONE_PRESETS[pref.tone]?.name || '自然';
        const voice = availableVoices().find(item => item.voiceURI === pref.voiceURI);
        return `系统 TTS · ${tone}${voice ? ` · ${voice.name}` : ''}`;
    }

    function renderSpeechEditor(body, working, scopeLabel, allowFollowGlobal, followGlobal) {
        body.innerHTML = `
            <div class="ra-section">
                <div class="ra-section-title">${scopeLabel}</div>
                ${allowFollowGlobal ? `<div class="ra-row"><span>本书单独设置</span><span class="ra-section-note" style="margin:0;">关闭后使用全局朗读设置</span><button type="button" class="ra-switch${followGlobal ? '' : ' is-on'}" data-ra-toggle="bookOverride"></button></div>` : '<div class="ra-section-note">这里是所有书籍默认朗读声音；单本书可以单独覆盖。</div>'}
            </div>
            <div class="ra-section">
                <div class="ra-section-title">朗读方式</div>
                <div class="ra-segment" data-ra-segment="mode">
                    <button type="button" data-value="system" class="${working.mode === 'system' ? 'is-active' : ''}">系统 TTS</button>
                    <button type="button" data-value="character" class="${working.mode === 'character' ? 'is-active' : ''}">角色语音</button>
                </div>
                <div class="ra-section-note" style="margin-top:10px;">角色语音沿用阅读器现有“共读角色”绑定；每本书可以绑定不同角色。</div>
            </div>
            <div class="ra-section" data-ra-system-speech${working.mode === 'system' ? '' : ' hidden'}>
                <div class="ra-section-title">TTS 音色</div>
                <div class="ra-row"><span>音色风格</span><select data-ra-key="tone">${Object.entries(TONE_PRESETS).map(([id, item]) => `<option value="${id}"${id === working.tone ? ' selected' : ''}>${item.name}</option>`).join('')}</select><span></span></div>
                <div class="ra-row"><span>设备声音</span><select data-ra-key="voiceURI">${voiceOptions(working.voiceURI)}</select><span></span></div>
                ${rangeRow('pitch', '音高', .6, 1.6, .02, working.pitch, '')}
                ${rangeRow('rate', '语速', .5, 2, .05, working.rate, 'x')}
                ${sectionToggleMarkup('autoNext', '自动读下一章', working.autoNext)}
                <div class="ra-actions"><button type="button" class="ra-action-btn secondary" data-ra-test-voice>试听这段音色</button></div>
            </div>`;
    }

    function speakPreview(pref) {
        if (pref.mode !== 'system' || !('speechSynthesis' in window)) {
            toast('角色语音请在具体书籍中试听');
            return;
        }
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('风从书页间轻轻吹过，这是一段语音朗读试听。');
        utter.lang = 'zh-CN';
        utter.pitch = Number(pref.pitch) || 1;
        utter.rate = Number(pref.rate) || 1;
        const voice = availableVoices().find(item => item.voiceURI === pref.voiceURI);
        if (voice) utter.voice = voice;
        if (originalSpeak) originalSpeak(utter); else window.speechSynthesis.speak(utter);
    }

    function bindSpeechEditor(overlay, working, onSave, options = {}) {
        const body = overlay.querySelector('.ra-sheet-body');
        const systemSection = () => body.querySelector('[data-ra-system-speech]');
        const isBookEditor = Object.prototype.hasOwnProperty.call(options, 'overrideEnabled');
        const syncBookOverrideToggle = () => {
            const toggle = body.querySelector('[data-ra-toggle="bookOverride"]');
            if (!toggle) return;
            toggle.classList.toggle('is-on', Boolean(options.overrideEnabled));
            toggle.setAttribute('aria-pressed', String(Boolean(options.overrideEnabled)));
        };
        const markBookEdited = () => {
            if (!isBookEditor || options.overrideEnabled) return;
            options.overrideEnabled = true;
            syncBookOverrideToggle();
        };

        body.addEventListener('input', event => {
            const key = event.target.dataset.raKey;
            if (!key) return;
            markBookEdited();
            let value = event.target.value;
            if (event.target.type === 'range') value = Number(value);
            working[key] = value;
            const valueEl = body.querySelector(`[data-ra-value="${key}"]`);
            if (valueEl) valueEl.textContent = `${value}${key === 'rate' ? 'x' : ''}`;
        });
        body.addEventListener('change', event => {
            const key = event.target.dataset.raKey;
            if (!key) return;
            markBookEdited();
            working[key] = event.target.type === 'range' ? Number(event.target.value) : event.target.value;
            if (key === 'tone') {
                const preset = TONE_PRESETS[working.tone] || TONE_PRESETS.natural;
                working.pitch = preset.pitch;
                working.rate = preset.rate;
                const pitch = body.querySelector('[data-ra-key="pitch"]');
                const rate = body.querySelector('[data-ra-key="rate"]');
                if (pitch) pitch.value = working.pitch;
                if (rate) rate.value = working.rate;
                const pitchValue = body.querySelector('[data-ra-value="pitch"]');
                const rateValue = body.querySelector('[data-ra-value="rate"]');
                if (pitchValue) pitchValue.textContent = working.pitch;
                if (rateValue) rateValue.textContent = `${working.rate}x`;
            }
        });
        body.addEventListener('click', event => {
            const toggle = event.target.closest('[data-ra-toggle]');
            if (toggle) {
                const key = toggle.dataset.raToggle;
                if (key === 'bookOverride') {
                    options.overrideEnabled = !options.overrideEnabled;
                    syncBookOverrideToggle();
                } else {
                    markBookEdited();
                    working[key] = !Boolean(working[key]);
                    toggle.classList.toggle('is-on', Boolean(working[key]));
                    toggle.setAttribute('aria-pressed', String(Boolean(working[key])));
                }
                return;
            }
            const segmentButton = event.target.closest('[data-ra-segment] button');
            if (segmentButton) {
                const segment = segmentButton.parentElement;
                const key = segment.dataset.raSegment;
                markBookEdited();
                working[key] = segmentButton.dataset.value;
                segment.querySelectorAll('button').forEach(btn => btn.classList.toggle('is-active', btn === segmentButton));
                if (key === 'mode') systemSection().hidden = working.mode !== 'system';
                return;
            }
            if (event.target.closest('[data-ra-test-voice]')) speakPreview(working);
        });
        overlay.querySelector('[data-ra-cancel]').addEventListener('click', () => closeOverlay(overlay));
        overlay.querySelector('[data-ra-save]').addEventListener('click', () => {
            onSave(options);
            closeOverlay(overlay);
        });
        overlay.addEventListener('click', event => { if (event.target === overlay) closeOverlay(overlay); });
    }

    function openGlobalSpeechEditor() {
        const s = ensureState();
        if (!s) return;
        const working = normalizeSpeech(s.readerSpeech);
        const overlay = makeOverlay('readen-global-speech-overlay', '语音朗读');
        renderSpeechEditor(overlay.querySelector('.ra-sheet-body'), working, '全局朗读默认', false, false);
        bindSpeechEditor(overlay, working, () => {
            s.readerSpeech = normalizeSpeech(working);
            s.speechVoiceMode = working.mode;
            save();
            syncSpeechPanel();
            toast('全局朗读设置已保存');
        });
    }

    function openBookSpeechEditor() {
        const book = currentBook();
        const s = ensureState();
        if (!book || !s) return;
        const hasOverride = Boolean(book.readerSpeechOverride?.enabled);
        const working = hasOverride ? normalizeSpeech(book.readerSpeechOverride.values) : normalizeSpeech(s.readerSpeech);
        const options = { overrideEnabled: hasOverride };
        const overlay = makeOverlay('readen-book-speech-overlay', '本书朗读设置');
        renderSpeechEditor(overlay.querySelector('.ra-sheet-body'), working, '本书声音', true, !hasOverride);
        bindSpeechEditor(overlay, working, opts => {
            if (opts.overrideEnabled) book.readerSpeechOverride = { enabled: true, values: normalizeSpeech(working) };
            else book.readerSpeechOverride = { enabled: false, values: null };
            save();
            syncSpeechPanel();
            toast(opts.overrideEnabled ? '本书朗读设置已保存' : '本书已改为跟随全局朗读');
        }, options);
    }

    function patchSpeechSynthesis() {
        if (speechPatched || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;
        originalSpeak = synth.speak.bind(synth);
        try {
            synth.speak = function (utterance) {
                const reader = document.getElementById('readen-reader-container');
                if (reader?.classList.contains('active') && utterance instanceof SpeechSynthesisUtterance) {
                    const pref = effectiveSpeech();
                    if (pref.mode === 'system') {
                        const voice = availableVoices().find(item => item.voiceURI === pref.voiceURI);
                        if (voice) utterance.voice = voice;
                        utterance.pitch = Math.max(.6, Math.min(1.6, Number(pref.pitch) || 1));
                        utterance.rate = Math.max(.5, Math.min(2, Number(pref.rate) || 1));
                    }
                }
                return originalSpeak(utterance);
            };
            speechPatched = true;
        } catch (error) {
            console.debug('[Readen advanced] speech patch unavailable', error);
        }
    }

    function syncSpeechPanel() {
        const panel = document.getElementById('readen-reader-speech-panel');
        if (!panel) return;
        const pref = effectiveSpeech();
        const modeSelect = panel.querySelector('#readen-speech-voice-mode');
        const autoNext = panel.querySelector('#readen-speech-auto-next');
        if (modeSelect && modeSelect.value !== pref.mode) modeSelect.value = pref.mode;
        if (autoNext) autoNext.checked = Boolean(pref.autoNext);
        let summary = panel.querySelector('.ra-speech-summary');
        if (!summary) {
            summary = document.createElement('div');
            summary.className = 'ra-speech-summary';
            const status = panel.querySelector('.readen-speech-status');
            status?.insertAdjacentElement('afterend', summary);
        }
        if (summary) setTextIfChanged(summary, speechSummary(pref));
    }

    function findMyRow(name) {
        if (!root) return null;
        return [...root.querySelectorAll('.my-list-item')].find(row => row.querySelector('.my-item-name')?.textContent?.trim() === name) || null;
    }

    function bindRow(row, key, handler) {
        if (!row || row.dataset[key] === '1') return;
        row.dataset[key] = '1';
        row.addEventListener('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            handler();
        }, true);
    }

    function ensureMyBindings() {
        bindRow(findMyRow('语音朗读'), 'raSpeechBound', openGlobalSpeechEditor);
        bindRow(findMyRow('阅读设置'), 'raLayoutBound', openGlobalLayoutEditor);
        bindRow(findMyRow('应用外观'), 'raAppearanceBound', openAppearanceEditor);
    }

    function ensureReaderEntries() {
        const fontPanel = document.getElementById('readen-reader-font-panel');
        if (fontPanel && !fontPanel.querySelector('#ra-open-book-layout')) {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = 'ra-open-book-layout';
            button.className = 'ra-entry-button';
            button.innerHTML = '<span>高级排版 · 本书设置</span><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';
            button.addEventListener('click', event => { event.stopPropagation(); openBookLayoutEditor(); });
            const sheet = fontPanel.querySelector('.reader-font-sheet');
            sheet?.appendChild(button);
        }

        const speechPanel = document.getElementById('readen-reader-speech-panel');
        if (speechPanel && !speechPanel.querySelector('#ra-open-book-speech')) {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = 'ra-open-book-speech';
            button.className = 'ra-entry-button';
            button.innerHTML = '<span>本书声音 · 单独设置</span><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';
            button.addEventListener('click', event => { event.stopPropagation(); openBookSpeechEditor(); });
            const toggle = speechPanel.querySelector('#readen-speech-toggle-btn');
            if (toggle && toggle.dataset.raSpeechStartBound !== '1') {
                toggle.dataset.raSpeechStartBound = '1';
                toggle.addEventListener('click', () => {
                    const pref = effectiveSpeech();
                    const s = ensureState();
                    if (s) s.speechVoiceMode = pref.mode;
                    const selector = speechPanel.querySelector('#readen-speech-voice-mode');
                    if (selector) selector.value = pref.mode;
                    const autoNext = speechPanel.querySelector('#readen-speech-auto-next');
                    if (autoNext) autoNext.checked = Boolean(pref.autoNext);
                }, true);
            }
            const actions = speechPanel.querySelector('.reader-tool-actions');
            actions?.insertAdjacentElement('beforebegin', button);
        }
        syncSpeechPanel();
    }

    async function copyText(text, success) {
        try {
            await navigator.clipboard.writeText(text);
            toast(success);
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = text;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
            toast(success);
        }
    }

    async function fetchDefaultReadenCss() {
        try {
            const response = await fetch('css/readen-app.css', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn('[Readen advanced] default css fetch failed', error);
            return '/* 默认阅读 App CSS 读取失败，请刷新后重试。 */';
        }
    }

    function getAppearancePresets() {
        const s = ensureState();
        return s?.readerAppearancePresets || [];
    }

    function getActiveAppearancePreset() {
        const s = ensureState();
        if (!s?.readerAppearancePresetId) return null;
        return getAppearancePresets().find(item => item.id === s.readerAppearancePresetId) || null;
    }

    function applyAppearancePreset(presetId) {
        const s = ensureState();
        if (!s) return;
        if (!presetId) {
            s.readerAppearancePresetId = '';
            s.readerCustomCss = '';
            save();
            applyCustomCss();
            renderAppearancePresets();
            toast('已切换为默认外观');
            return;
        }

        const preset = getAppearancePresets().find(item => item.id === presetId);
        if (!preset) return;
        s.readerAppearancePresetId = preset.id;
        s.readerCustomCss = preset.css;
        save();
        applyCustomCss();
        renderAppearancePresets();
        toast(`已应用「${preset.name}」`);
    }

    let appearanceEditingId = '';

    function ensureAppearancePage() {
        let page = document.getElementById('readen-page-appearance');
        if (page) return page;

        page = document.createElement('div');
        page.className = 'sub-page ra-appearance-page';
        page.id = 'readen-page-appearance';
        page.innerHTML = `
            <div class="sub-header ra-appearance-header">
                <button type="button" class="sub-header-back ra-appearance-back" id="readen-appearance-back-btn" aria-label="返回">
                    <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div class="sub-header-title">应用外观</div>
                <div class="ra-appearance-header-spacer" aria-hidden="true"></div>
            </div>
            <div class="ra-appearance-content">
                <div class="ra-appearance-intro">
                    <div class="ra-appearance-intro-title">CSS 美化预设</div>
                    <div class="ra-appearance-intro-text">保存多套阅读 App 外观，需要时直接切换。自定义 CSS 只作用于阅读 App 时，建议使用 <code>.readen-app-container</code> 作为作用域。</div>
                </div>
                <div class="ra-appearance-list" id="readen-appearance-list"></div>
            </div>
            <div class="ra-appearance-bottom-bar">
                <button type="button" class="ra-appearance-add-btn" id="readen-appearance-add-btn">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>
                    <span>添加 CSS 美化预设</span>
                </button>
            </div>
            <div class="ra-appearance-drawer" id="readen-appearance-drawer" aria-hidden="true">
                <div class="ra-appearance-drawer-backdrop" data-appearance-drawer-close></div>
                <section class="ra-appearance-drawer-sheet" role="dialog" aria-modal="true" aria-label="添加 CSS 美化预设">
                    <div class="ra-appearance-drawer-handle"></div>
                    <div class="ra-appearance-drawer-head">
                        <button type="button" class="ra-appearance-drawer-action muted" data-appearance-drawer-close>取消</button>
                        <strong>添加美化预设</strong>
                        <button type="button" class="ra-appearance-drawer-action" id="readen-appearance-save-btn">保存</button>
                    </div>
                    <div class="ra-appearance-drawer-body">
                        <label class="ra-appearance-field">
                            <span>预设名称</span>
                            <input type="text" id="readen-appearance-name-input" maxlength="32" autocomplete="off" placeholder="先给这个预设起一个名字">
                        </label>
                        <label class="ra-appearance-field">
                            <span>自定义 CSS</span>
                            <textarea class="ra-css-editor ra-appearance-css-editor" id="readen-appearance-css-input" spellcheck="false" aria-label="阅读 App 自定义 CSS" placeholder=".readen-app-container {&#10;  /* 在这里输入 CSS */&#10;}"></textarea>
                        </label>
                        <div class="ra-appearance-tools">
                            <button type="button" data-appearance-copy-default>复制默认 CSS</button>
                            <button type="button" data-appearance-copy-current>复制当前 CSS</button>
                            <button type="button" data-appearance-load-default>载入默认 CSS</button>
                            <button type="button" data-appearance-clear>清空编辑器</button>
                        </div>
                    </div>
                </section>
            </div>
        `;
        root.appendChild(page);

        page.querySelector('#readen-appearance-back-btn')?.addEventListener('click', closeAppearanceEditor);
        page.querySelector('#readen-appearance-add-btn')?.addEventListener('click', openAppearancePresetDrawer);
        page.querySelector('#readen-appearance-save-btn')?.addEventListener('click', saveAppearancePreset);
        page.querySelectorAll('[data-appearance-drawer-close]').forEach(element => {
            element.addEventListener('click', closeAppearancePresetDrawer);
        });
        page.querySelector('[data-appearance-copy-default]')?.addEventListener('click', async () => {
            await copyText(await fetchDefaultReadenCss(), '默认 CSS 已复制');
        });
        page.querySelector('[data-appearance-copy-current]')?.addEventListener('click', () => {
            const editor = page.querySelector('#readen-appearance-css-input');
            copyText(editor?.value || '', '当前 CSS 已复制');
        });
        page.querySelector('[data-appearance-load-default]')?.addEventListener('click', async () => {
            const editor = page.querySelector('#readen-appearance-css-input');
            if (!editor) return;
            editor.value = await fetchDefaultReadenCss();
            toast('默认 CSS 已载入编辑器');
        });
        page.querySelector('[data-appearance-clear]')?.addEventListener('click', () => {
            const editor = page.querySelector('#readen-appearance-css-input');
            if (editor) editor.value = '';
        });
        let appearanceSuppressClickUntil = 0;
        const appearanceList = page.querySelector('#readen-appearance-list');
        appearanceList?.addEventListener('click', event => {
            const action = event.target.closest('[data-appearance-action]');
            if (!action && Date.now() < appearanceSuppressClickUntil) { event.preventDefault(); return; }
            if (action) {
                event.preventDefault();
                event.stopPropagation();
                const id = action.dataset.appearanceId || '';
                if (action.dataset.appearanceAction === 'edit') openAppearancePresetDrawer(id);
                if (action.dataset.appearanceAction === 'delete') deleteAppearancePreset(id);
                return;
            }
            const presetCard = event.target.closest('[data-appearance-preset-id]');
            if (!presetCard) return;
            const swipe = presetCard.closest('.ra-appearance-swipe');
            if (swipe?.classList.contains('is-open')) {
                swipe.classList.remove('is-open');
                return;
            }
            applyAppearancePreset(presetCard.dataset.appearancePresetId || '');
        });
        let swipeStart = null;
        appearanceList?.addEventListener('pointerdown', event => {
            const row = event.target.closest('.ra-appearance-swipe');
            swipeStart = row && !event.target.closest('[data-appearance-action]')
                ? { row, x: event.clientX, y: event.clientY } : null;
        }, { passive: true });
        appearanceList?.addEventListener('pointerup', event => {
            if (!swipeStart) return;
            const { row, x, y } = swipeStart;
            swipeStart = null;
            const dx = event.clientX - x;
            const dy = event.clientY - y;
            if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            appearanceList.querySelectorAll('.ra-appearance-swipe.is-open').forEach(other => {
                if (other !== row) other.classList.remove('is-open');
            });
            appearanceSuppressClickUntil = Date.now() + 160;
            row.classList.toggle('is-open', dx < 0);
        }, { passive: true });
        appearanceList?.addEventListener('pointercancel', () => { swipeStart = null; }, { passive: true });
        return page;
    }

    function renderAppearancePresets() {
    const page = document.getElementById('readen-page-appearance');
    const list = page?.querySelector('#readen-appearance-list');
    if (!list) return;
    const s = ensureState();
    const activeId = s?.readerAppearancePresetId || '';
    const defaultCard = `
        <button type="button" class="ra-appearance-card ${!activeId ? 'is-active' : ''}" data-appearance-preset-id="">
            <div class="ra-appearance-card-main">
                <div class="ra-appearance-card-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5c0-.6-.5-1.1-1.1-1.1h-2.1a2 2 0 0 1-2-2V6.6c0-1.7-1.4-3.1-3.1-3.1H12Z"></path><circle cx="7.5" cy="11" r=".8"></circle><circle cx="10" cy="7.5" r=".8"></circle><circle cx="8.7" cy="15" r=".8"></circle></svg>
                </div>
                <div class="ra-appearance-card-copy">
                    <div class="ra-appearance-card-title">默认外观</div>
                    <div class="ra-appearance-card-sub">不启用额外的自定义 CSS</div>
                </div>
            </div>
            <div class="ra-appearance-card-check">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        </button>`;
    const cards = getAppearancePresets().map(preset => {
        const lines = preset.css ? String(preset.css).split(/\r?\n/).length : 0;
        return `<div class="ra-appearance-swipe" data-appearance-swipe-id="${escapeAttr(preset.id)}">
            <div class="ra-appearance-swipe-actions">
                <button type="button" class="ra-appearance-swipe-action edit" data-appearance-action="edit" data-appearance-id="${escapeAttr(preset.id)}" aria-label="编辑${escapeAttr(preset.name)}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" > <path d="M12.085 6.5l5.415 5.415l-8.793 8.792a1 1 0 0 1 -.707 .293h-4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 .293 -.707zm5.406 -2.698a3.828 3.828 0 0 1 1.716 6.405l-.292 .293l-5.415 -5.415l.293 -.292a3.83 3.83 0 0 1 3.698 -.991" /> </svg><span>编辑</span>
                </button>
                <button type="button" class="ra-appearance-swipe-action delete" data-appearance-action="delete" data-appearance-id="${escapeAttr(preset.id)}" aria-label="删除${escapeAttr(preset.name)}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" > <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1" /> <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z" /> </svg><span>删除</span>
                </button>
            </div>
            <button type="button" class="ra-appearance-card ${preset.id === activeId ? 'is-active' : ''}" data-appearance-preset-id="${escapeAttr(preset.id)}">
                <div class="ra-appearance-card-main">
                    <div class="ra-appearance-card-icon code">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="8 9 5 12 8 15"></polyline><polyline points="16 9 19 12 16 15"></polyline><line x1="14" y1="6" x2="10" y2="18"></line></svg>
                    </div>
                    <div class="ra-appearance-card-copy">
                        <div class="ra-appearance-card-title">${escapeHtml(preset.name)}</div>
                        <div class="ra-appearance-card-sub">${lines} 行 CSS · 左滑可编辑或删除</div>
                    </div>
                </div>
                <div class="ra-appearance-card-check">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            </button>
        </div>`;
    }).join('');
    list.innerHTML = defaultCard + cards;
}

    function openAppearancePresetDrawer(presetId = '') {
    const page = ensureAppearancePage();
    const drawer = page.querySelector('#readen-appearance-drawer');
    const nameInput = page.querySelector('#readen-appearance-name-input');
    const cssInput = page.querySelector('#readen-appearance-css-input');
    if (!drawer || !nameInput || !cssInput) return;
    const state = ensureState();
    const preset = typeof presetId === 'string'
        ? state?.readerAppearancePresets.find(item => item.id === presetId)
        : null;
    appearanceEditingId = preset?.id || '';
    nameInput.value = preset?.name || '';
    const css = preset ? preset.css : ((state?.readerAppearancePresets.find(item => item.id === state.readerAppearancePresetId)?.css) || state?.readerCustomCss || '');
    drawer.querySelector('.ra-appearance-drawer-head strong').textContent = preset ? '编辑美化预设' : '添加美化预设';
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
        if (!drawer.classList.contains('is-open')) return;
        cssInput.value = css;
        nameInput.focus({ preventScroll: true });
    });
}

    function closeAppearancePresetDrawer() {
        const drawer = document.getElementById('readen-appearance-drawer');
        if (!drawer) return;
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
    }

    function saveAppearancePreset() {
    const page = ensureAppearancePage();
    const nameInput = page.querySelector('#readen-appearance-name-input');
    const cssInput = page.querySelector('#readen-appearance-css-input');
    const name = String(nameInput?.value || '').trim();
    if (!name) { toast('请先填写预设名称'); nameInput?.focus(); return; }
    const s = ensureState();
    if (!s) return;
    if (s.readerAppearancePresets.some(item => item.id !== appearanceEditingId && item.name.trim().toLowerCase() === name.toLowerCase())) {
        toast('已经有同名预设了，请换一个名称');
        nameInput?.focus(); return;
    }
    const css = String(cssInput?.value || '');
    const existing = s.readerAppearancePresets.find(item => item.id === appearanceEditingId);
    if (existing) {
        existing.name = name;
        existing.css = css;
        if (s.readerAppearancePresetId === existing.id) {
            s.readerCustomCss = css;
            applyCustomCss();
        }
    } else {
        const preset = { id: `appearance-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name, css, createdAt: Date.now() };
        s.readerAppearancePresets.push(preset);
        s.readerAppearancePresetId = preset.id;
        s.readerCustomCss = css;
        applyCustomCss();
    }
    save();
    closeAppearancePresetDrawer();
    appearanceEditingId = '';
    renderAppearancePresets();
    toast(existing ? `已修改「${name}」` : `已保存并应用「${name}」`);
}

    function deleteAppearancePreset(id) {
    const preset = ensureState()?.readerAppearancePresets.find(item => item.id === id);
    if (!preset) return;
    showReadenDialog({
        type: 'confirm',
        title: '删除美化预设',
        msg: `确定删除「${escapeHtml(preset.name)}」？此操作不可恢复。`,
        confirmText: '删除',
        onConfirm: () => {
            const state = ensureState();
            if (!state?.readerAppearancePresets.some(item => item.id === id)) return;
            state.readerAppearancePresets = state.readerAppearancePresets.filter(item => item.id !== id);
            if (state.readerAppearancePresetId === id) {
                state.readerAppearancePresetId = '';
                state.readerCustomCss = '';
                applyCustomCss();
            }
            save();
            renderAppearancePresets();
            toast('预设已删除');
        }
    });
}

    function openAppearanceEditor() {
        const page = ensureAppearancePage();
        ensureState();
        renderAppearancePresets();
        page.classList.add('active');
    }

    function closeAppearanceEditor() {
        closeAppearancePresetDrawer();
        document.getElementById('readen-page-appearance')?.classList.remove('active');
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function scheduleSync() {
        if (scheduleQueued) return;
        scheduleQueued = true;
        requestAnimationFrame(() => {
            scheduleQueued = false;
            ensureState();
            ensureMyBindings();
            ensureReaderEntries();
            applyCurrentLayout();
            applyCustomCss();
        });
    }

    function init() {
        root = document.getElementById('readenAppUI');
        if (!root || root.dataset.raAdvancedInit === '1') return;
        root.dataset.raAdvancedInit = '1';
        patchSpeechSynthesis();
        applyCustomCss();
        scheduleSync();
        observer = new MutationObserver(scheduleSync);
        observer.observe(root, { childList: true, subtree: true });
        const visibilityObserver = new MutationObserver(scheduleSync);
        visibilityObserver.observe(root, { attributes: true, attributeFilter: ['style', 'aria-hidden'] });
        root.addEventListener('click', scheduleSync, true);
        clockTimer = window.setInterval(() => {
            const reader = document.getElementById('readen-reader-container');
            if (reader?.classList.contains('active')) applyCurrentLayout();
        }, 30000);
        if ('speechSynthesis' in window) window.speechSynthesis.addEventListener?.('voiceschanged', scheduleSync);
        window.addEventListener('readenappdataready', scheduleSync);
        window.addEventListener('pageshow', scheduleSync);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) scheduleSync();
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Bundled module: readen-reader-interaction-fixes.js
 * Source merged into readen-app.js; keep module scope unchanged.
 * ======================================================================== */
(function () {
    'use strict';

    const STYLE_ID = 'readen-reader-interaction-fixes-style';
    const SELECTION_COLOR = 'rgba(107, 130, 153, .30)';
    let resizeObserver = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.readen-app-container .reader-content.paged-mode {
    column-width: calc(var(--readen-page-viewport, 100vw) - 40px) !important;
    column-gap: 40px !important;
}
.readen-app-container .reader-content .readen-reader-paragraph::selection,
.readen-app-container .reader-content .readen-reader-paragraph *::selection {
    background: ${SELECTION_COLOR} !important;
    color: inherit !important;
}
.readen-app-container .reader-content .readen-reader-paragraph::-moz-selection,
.readen-app-container .reader-content .readen-reader-paragraph *::-moz-selection {
    background: ${SELECTION_COLOR} !important;
    color: inherit !important;
}
.readen-app-container .readen-selection-highlight-layer {
    position: absolute;
    inset: 0;
    z-index: 1002;
    pointer-events: none;
}
.readen-app-container .readen-selection-highlight-rect {
    position: absolute;
    background: ${SELECTION_COLOR};
    border-radius: 3px;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-highlight {
    background: transparent !important;
    box-shadow: inset 0 -0.62em 0 var(--annotation-color, #facc15) !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-underline {
    background: transparent !important;
    border-bottom: 2px solid var(--annotation-color, #facc15) !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-wavy {
    background: transparent !important;
    text-decoration-line: underline !important;
    text-decoration-style: wavy !important;
    text-decoration-color: var(--annotation-color, #facc15) !important;
    text-decoration-thickness: 1.5px !important;
    text-underline-offset: .18em !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-dashed {
    background: transparent !important;
    border-bottom: 2px dashed var(--annotation-color, #facc15) !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-double-line {
    background: transparent !important;
    border-bottom: 3px double var(--annotation-color, #facc15) !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-dotted {
    background: transparent !important;
    border-bottom: 2px dotted var(--annotation-color, #facc15) !important;
}
.readen-app-container .reader-content .readen-annotation-mark.user.style-strikethrough {
    background: transparent !important;
    text-decoration: line-through !important;
    text-decoration-color: var(--annotation-color, #facc15) !important;
    text-decoration-thickness: 2px !important;
}
`;
        document.head.appendChild(style);
    }

    function getReaderParts() {
        const reader = document.getElementById('readen-reader-container');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        const content = document.getElementById('readen-reader-content');
        if (!reader?.classList.contains('active') || !wrapper || !content) return null;
        return { reader, wrapper, content };
    }

    function syncPaginationGeometry() {
        const parts = getReaderParts();
        if (!parts) return;
        const width = Math.max(1, Math.round(parts.wrapper.clientWidth));
        parts.content.style.setProperty('--readen-page-viewport', `${width}px`);
    }

    function onTouchStartCapture(event) {
        const parts = getReaderParts();
        if (!parts || !parts.wrapper.contains(event.target)) return;
        syncPaginationGeometry();
    }

    function onAnnotationStyleClick(event) {
        const target = event.target instanceof Element ? event.target : null;
        const styleButton = target?.closest('#readen-user-annotation-panel [data-readen-annotation-style]');
        if (!styleButton) return;
        window.setTimeout(() => {
            const panel = document.getElementById('readen-user-annotation-panel');
            const saveButton = document.getElementById('readen-user-annotation-save');
            if (!panel?.classList.contains('active') || !saveButton || saveButton.disabled) return;
            saveButton.click();
        }, 0);
    }

    function observeReaderGeometry() {
        const root = document.getElementById('readenAppUI');
        if (!root) return;
        const connectResizeObserver = () => {
            const wrapper = document.getElementById('readen-reader-scroll-wrapper');
            if (!wrapper || typeof ResizeObserver !== 'function') return;
            resizeObserver?.disconnect();
            resizeObserver = new ResizeObserver(syncPaginationGeometry);
            resizeObserver.observe(wrapper);
            syncPaginationGeometry();
        };
        connectResizeObserver();
        const observer = new MutationObserver(mutations => {
            let shouldSync = false;
            for (const mutation of mutations) {
                if (mutation.target?.id === 'readen-reader-container' || mutation.target?.id === 'readen-reader-content') {
                    shouldSync = true;
                    break;
                }
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;
                    if (node.id === 'readen-reader-scroll-wrapper' || node.querySelector?.('#readen-reader-scroll-wrapper')) {
                        connectResizeObserver();
                        shouldSync = true;
                        break;
                    }
                }
            }
            if (shouldSync) requestAnimationFrame(syncPaginationGeometry);
        });
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    function init() {
        injectStyles();
        document.addEventListener('touchstart', onTouchStartCapture, true);
        document.addEventListener('click', onAnnotationStyleClick, false);
        window.addEventListener('resize', syncPaginationGeometry, { passive: true });
        observeReaderGeometry();
        syncPaginationGeometry();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

/* ========================================================================
 * Readen core: original readen-app.js
 * ======================================================================== */
// =========================================================================
// 阅读 APP 核心逻辑 (js/readen-app.js) - 第 1 部分 (1/4)
// =========================================================================

window.ReadenApp = (function() {
    let container = null;
    let isInitialized = false;

    const readenEpubObjectUrlCache = new Map();

    // --- 完整的 HTML 结构 (已添加 readen- 前缀防止冲突) ---
    const htmlTemplate = `
    <!-- ================= 首页 (Home) ================= -->
    <div id="readen-page-home" class="page">
        <header>
            <div class="header-title">首页</div>
            <div class="header-right"></div>
        </header>
        <div class="home-container">
            <!-- 正在阅读主书卷 (带悬垂丝带书签) -->
            <div class="s1-hero-card" id="readen-home-hero-card">
                <div class="s1-ribbon"></div>
                <div class="s1-eyebrow-row">
                    <span class="s1-eyebrow">CURRENT VOLUME · 正在翻阅</span>
                    <span class="s1-pct-tag" id="readen-home-hero-pct">0.0%</span>
                </div>
                <div class="s1-book-body">
                    <div class="s1-book-cover" id="readen-home-hero-cover">
                        <div class="s1-cover-title" id="readen-home-hero-cover-title">暂无书籍</div>
                    </div>
                    <div class="s1-book-info">
                        <div>
                            <div class="s1-title" id="readen-home-hero-title">书架空空如也</div>
                            <div class="s1-author" id="readen-home-hero-author">导入一本喜欢的小说开始阅读</div>
                            <div class="s1-reading-chap" id="readen-home-hero-chap">尚未开始阅读</div>
                        </div>
                        <div>
                            <div class="s1-line-progress">
                                <div class="s1-line-progress-fill" id="readen-home-hero-bar" style="width: 0%;"></div>
                            </div>
                            <div class="s1-footer-row">
                                <button type="button" class="s1-btn-resume" id="readen-btn-start-reading">
                                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    继续阅读
                                </button>
                                <span class="s1-time-hint" id="readen-home-hero-time">尚未翻开</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 继续阅读模块 (最多显示两本) -->
            <div class="home-section-title">继续阅读</div>
            <div class="home-resume-scroll" id="readen-home-resume-scroll">
                <!-- 动态注入继续阅读卡片 -->
            </div>

            <!-- 阅读目标标题区 -->
            <div class="home-target-header">
                <div class="home-target-title-row">
                    <span class="home-target-main-title">阅读目标</span>
                    <button type="button" class="home-target-config-btn" id="readen-home-target-setting-icon" aria-label="目标设置">
                        <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                            <path d="M214.938614 65.90099c-5.576238 2.027723-16.728713 11.152475-23.825743 20.277228L177.425743 102.4v835.928713l12.673267 12.166337c16.221782 16.728713 36.49901 16.221782 61.338614-0.506931 10.645545-7.60396 58.29703-44.609901 105.948515-82.629703C492.229703 758.875248 490.20198 760.39604 512 760.39604c16.728713 0 26.867327 6.083168 74.011881 44.10297 30.415842 24.332673 88.205941 69.956436 128.253466 101.386139 81.108911 63.366337 93.782178 67.928713 119.128712 44.609901l13.180198-12.166337-1.013861-420.752475-1.520792-421.259406-16.728713-16.221782-16.221782-16.728713-293.005941-1.013862c-160.69703-0.506931-297.061386 1.013861-303.144554 3.548515z"></path>
                        </svg>
                    </button>
                </div>
                <div class="home-target-desc">找到你喜欢的书，设定阅读目标，开始阅读吧！</div>
            </div>

            <!-- 今日目标卡片 -->
            <div class="s1-target-card" id="readen-home-target-card">
                <div class="s1-tc-head">
                    <span class="s1-tc-title">今日目标</span>
                    <button type="button" class="s1-tc-icon-btn" id="readen-home-target-menu-btn" aria-label="目标设置">
                        <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                            <path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path>
                        </svg>
                    </button>
                </div>
                <div class="s1-tc-gauge-wrap">
                    <svg class="s1-tc-gauge-svg" viewBox="0 0 240 130">
                        <path class="s1-tc-gauge-bg" d="M 25 120 A 95 95 0 0 1 215 120" fill="none" stroke="#e8ebed" stroke-width="12" stroke-linecap="round"/>
                        <path class="s1-tc-gauge-progress" id="readen-home-gauge-progress" d="M 25 120 A 95 95 0 0 1 215 120" fill="none" stroke="#6b8299" stroke-width="12" stroke-linecap="round" stroke-dasharray="298.45" stroke-dashoffset="298.45"/>
                    </svg>
                    <div class="s1-tc-gauge-info">
                        <span class="s1-tc-gauge-subtitle">今日阅读进度</span>
                        <div class="s1-tc-gauge-time" id="readen-home-target-current-time">0:00</div>
                        <button type="button" class="s1-tc-target-btn" id="readen-home-target-edit-btn">
                            <span id="readen-home-target-label">（目标 60 分钟）</span>
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>
                <button type="button" class="s1-tc-start-btn" id="readen-home-target-start-btn">
                    开始阅读
                </button>
            </div>
        </div>
    </div>

    <!-- ================= 书架 (Bookshelf) ================= -->
    <div id="readen-page-bookshelf" class="page">
        <header>
            <div class="header-title">书架<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg></div>
            <div class="header-right">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Book-Search--Streamline-Ultimate" height="24" width="24">
                  <desc>Definition Search Book Streamline Icon: https://streamlinehq.com</desc>
                  <g id="definition-search-book">
                    <path id="Vector 2712" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13.4863 5.99268V1.68054c0 -0.43043 -0.2742 -0.818201 -0.6934 -0.91577C10.8099 0.30325 8.44827 0.526718 7 1.49226v4.50042" stroke-width="1"></path>
                    <path id="Vector 2713" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 1.49226C5.55173 0.526718 3.19014 0.30325 1.2071 0.76477c-0.419223 0.097569 -0.693428 0.48534 -0.693428 0.91577v8.23397c0 0.34129 0.335096 0.58329 0.667238 0.50479 1.26479 -0.2987 2.68642 -0.3179 3.928 -0.0427" stroke-width="1"></path>
                    <path id="Vector" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m13.399 13.4088 -1.1871 -1.1871" stroke-width="1"></path>
                    <path id="Vector_2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.1494 12.9089c1.76 0 2.75 -0.99 2.75 -2.75 0 -1.75996 -0.99 -2.74996 -2.75 -2.74996 -1.75999 0 -2.74999 0.99 -2.74999 2.74996 0 1.76 0.99 2.75 2.74999 2.75Z" stroke-width="1"></path>
                  </g>
                </svg>
                <svg viewBox="0 0 24 24" id="readen-btn-toggle-menu"><circle cx="12" cy="12" r="1" stroke-width="2"></circle><circle cx="19" cy="12" r="1" stroke-width="2"></circle><circle cx="5" cy="12" r="1" stroke-width="2"></circle></svg>
            </div>
        </header>
        
        <!-- 下拉菜单遮罩层 -->
        <div class="dropdown-overlay" id="readen-bs-dropdown-overlay"></div>
        
        <!-- 书籍操作菜单遮罩层 -->
        <div class="book-highlight-overlay" id="readen-book-action-overlay"></div>
        <!-- 书籍操作菜单 -->
        <div class="book-action-menu" id="readen-book-action-menu">
            <div class="bam-item" id="readen-bam-multi"><div class="bam-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg></div><div class="bam-text">多选</div></div>
            <div class="bam-item" id="readen-bam-rename"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
  <g id="Edit-Square">
    <path id="Union" fill="#000000" d="M11.5 6.00001H4V20h14v-7.5h2V21c-0.0001 0.5522 -0.4478 1 -1 1H3c-0.55221 0 -0.99987 -0.4478 -1 -1V5.00001l0.00488 -0.10254c0.05133 -0.50413 0.47744 -0.89746 0.99512 -0.89746h8.5zm5.8691 -3.77539c0.3928 -0.32035 0.9718 -0.29776 1.3379 0.06836l3 3 0.0684 0.07617c0.2988 0.36658 0.2989 0.89522 0 1.26172l-0.0684 0.07617L13.4141 15H9v-4.4141l8.293 -8.29292zM11 11.4141V13h1.5859l4.2071 -4.20702 -1.586 -1.58594z" stroke-width="1"></path>
  </g>
</svg></div><div class="bam-text">重命名</div></div>
            <div class="bam-item" id="readen-bam-cover"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
  <g id="image">
    <path id="Union" fill="#000000" d="M19 3c1.1046 0 2 0.89543 2 2v14c0 1.1046 -0.8954 2 -2 2H5c-1.10457 0 -2 -0.8954 -2 -2V5c0 -1.10457 0.89543 -2 2 -2zM5 19h14V5H5zm8.8496 -6.4668c0.2 -0.2667 0.6008 -0.2667 0.8008 0l2.75 3.667c0.2468 0.3296 0.0115 0.7998 -0.4004 0.7998H7c-0.41189 0 -0.64722 -0.4702 -0.40039 -0.7998l2 -2.667c0.2 -0.2667 0.60078 -0.2667 0.80078 0L11.25 16z" stroke-width="1"></path>
  </g>
</svg></div><div class="bam-text">自定义封面</div></div>
            <div class="bam-item" id="readen-bam-move"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
  <g id="triangle-arrow-move-vertical-alt-fill">
    <path id="Union" fill="#000000" d="M16 15c0.3938 0 0.7508 0.2316 0.9121 0.5908 0.1611 0.3592 0.0965 0.779 -0.165 1.0733l-4 4.5c-0.1898 0.2135 -0.4615 0.3359 -0.7471 0.3359s-0.5573 -0.1224 -0.7471 -0.3359l-3.99997 -4.5c-0.26154 -0.2943 -0.32616 -0.7141 -0.16504 -1.0733C7.24921 15.2316 7.60621 15 8 15zm4 -4c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1H4c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm-8 -8.5c0.2856 0 0.5573 0.12245 0.7471 0.33594l4 4.5c0.2615 0.29423 0.3261 0.71408 0.165 1.07324C16.7508 8.76841 16.3938 9 16 9H8c-0.39379 0 -0.75079 -0.23159 -0.91211 -0.59082 -0.16112 -0.35916 -0.0965 -0.77901 0.16504 -1.07324l3.99997 -4.5 0.0742 -0.07617C11.5103 2.59331 11.75 2.5 12 2.5" stroke-width="1"></path>
  </g>
</svg></div><div class="bam-text">移动</div></div>
            <div class="bam-item" id="readen-bam-edit"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Menu-Book--Streamline-Outlined-Material" height="24" width="24">
  <desc>
    Menu Book Streamline Icon: https://streamlinehq.com
  </desc>
  <path fill="#000000" d="M14 9.65v-1.2c0.55 -0.23335 1.1125 -0.40835 1.6875 -0.525 0.575 -0.11665 1.17915 -0.175 1.8125 -0.175 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375 -0.40835 -0.075 -0.8375 -0.1125 -1.2875 -0.1125 -0.63335 0 -1.24165 0.07915 -1.825 0.2375s-1.14165 0.37915 -1.675 0.6625Zm0 5.5v-1.225c0.55 -0.225 1.1125 -0.39375 1.6875 -0.50625 0.575 -0.1125 1.17915 -0.16875 1.8125 -0.16875 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375 -0.40835 -0.075 -0.8375 -0.1125 -1.2875 -0.1125 -0.63335 0 -1.24165 0.075 -1.825 0.225 -0.58335 0.15 -1.14165 0.375 -1.675 0.675Zm0 -2.75v-1.2c0.55 -0.23335 1.1125 -0.40835 1.6875 -0.525 0.575 -0.11665 1.17915 -0.175 1.8125 -0.175 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375C18.37915 11.5375 17.95 11.5 17.5 11.5c-0.63335 0 -1.24165 0.07915 -1.825 0.2375s-1.14165 0.37915 -1.675 0.6625ZM6.2 16.5c0.89285 0 1.76185 0.10415 2.607 0.3125 0.84535 0.20835 1.67635 0.52085 2.493 0.9375V7.075c-0.75 -0.5 -1.5635 -0.8875 -2.4405 -1.1625 -0.877 -0.275 -1.7635 -0.4125 -2.6595 -0.4125 -0.63335 0 -1.254165 0.07915 -1.8625 0.2375 -0.608335 0.15835 -1.220835 0.35415 -1.8375 0.5875v10.85c0.516665 -0.23335 1.104165 -0.40415 1.7625 -0.5125C4.920835 16.55415 5.56665 16.5 6.2 16.5Zm6.6 1.25c0.83335 -0.41665 1.65 -0.72915 2.45 -0.9375 0.8 -0.20835 1.65 -0.3125 2.55 -0.3125 0.63335 0 1.2875 0.05 1.9625 0.15 0.675 0.1 1.25415 0.23335 1.7375 0.4V6.325c-0.56665 -0.28335 -1.16515 -0.49165 -1.7955 -0.625 -0.63035 -0.13335 -1.26515 -0.2 -1.9045 -0.2 -0.9 0 -1.77085 0.1375 -2.6125 0.4125 -0.84165 0.275 -1.6375 0.6625 -2.3875 1.1625V17.75ZM12.05 20c-0.85 -0.63335 -1.775 -1.12085 -2.775 -1.4625S7.25 18.025 6.2 18.025c-0.609 0 -1.207085 0.075 -1.79425 0.225 -0.587165 0.15 -1.172415 0.33335 -1.75575 0.55 -0.385 0.18335 -0.75625 0.15835 -1.11375 -0.075C1.17875 18.49165 1 18.15835 1 17.725V6.15c0 -0.25 0.058335 -0.47915 0.175 -0.6875 0.116665 -0.20835 0.291665 -0.37085 0.525 -0.4875 0.7 -0.333335 1.42825 -0.579165 2.18475 -0.7375C4.641415 4.079165 5.41315 4 6.2 4c1.05 0 2.07085 0.141665 3.0625 0.425 0.99165 0.283335 1.92085 0.71665 2.7875 1.3 0.85 -0.58335 1.7625 -1.016665 2.7375 -1.3C15.7625 4.141665 16.76665 4 17.8 4c0.78115 0 1.54725 0.079165 2.29825 0.2375 0.75115 0.158335 1.47675 0.404165 2.17675 0.7375 0.23335 0.11665 0.4125 0.27915 0.5375 0.4875 0.125 0.20835 0.1875 0.4375 0.1875 0.6875v11.575c0 0.46485 -0.1875 0.8186 -0.5625 1.06125 -0.375 0.2425 -0.74585 0.2471 -1.1125 0.01375 -0.56665 -0.23335 -1.1436 -0.42085 -1.73075 -0.5625 -0.58715 -0.14165 -1.18525 -0.2125 -1.79425 -0.2125 -1.05 0 -2.05835 0.175 -3.025 0.525 -0.96665 0.35 -1.875 0.83335 -2.725 1.45Z" stroke-width="0.5"></path>
</svg></div><div class="bam-text">内容编辑</div></div>

            <div class="bam-item" id="readen-bam-pin"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Pin-1--Streamline-Flex-Remix" height="14" width="14" style="width: 14px; height: 14px;">
  <desc>
    Pin 1 Streamline Icon: https://streamlinehq.com
  </desc>
  <g id="pin-1--pin-push-thumbtack">
    <path id="Union" fill="#000000" fill-rule="evenodd" d="M7.29958 1.72457c0.45931 -0.45931 1.06936 -0.57642 1.79269 -0.39317 0.74015 0.18751 1.54123 0.68402 2.21653 1.35935 0.6754 0.67533 1.1719 1.4764 1.3594 2.21656 0.1832 0.72333 0.0661 1.33337 -0.3932 1.79269 -0.4614 0.46143 -1.2075 0.76373 -2.0212 0.96055 -0.6228 0.15062 -1.20963 0.22414 -1.65955 0.28051 -0.13286 0.01664 -0.25379 0.03179 -0.36017 0.04699 -0.292 0.04172 -0.51509 0.2819 -0.53517 0.57618l-0.12988 1.90367c-0.00896 0.1313 -0.07545 0.2315 -0.15411 0.2855 -0.07254 0.0498 -0.15208 0.0611 -0.23853 0.0243 -1.77818 -0.7583 -3.20268 -2.17992 -3.95747 -3.95612 -0.03655 -0.086 -0.02521 -0.16502 0.02444 -0.2372 0.05388 -0.07834 0.15393 -0.14467 0.28508 -0.15361l1.90691 -0.13011c0.29428 -0.02007 0.53446 -0.24316 0.57618 -0.53516 0.0152 -0.10638 0.03034 -0.22731 0.04699 -0.36017 0.05637 -0.44992 0.12989 -1.03676 0.28051 -1.65951 0.19682 -0.81371 0.49912 -1.55982 0.96055 -2.02125Zm5.85932 5.85931c0.8497 -0.84966 0.9819 -1.95377 0.721 -2.98355 -0.2566 -1.01296 -0.8977 -2.00396 -1.6872 -2.79346 -0.7895 -0.7895 -1.7805 -1.430567 -2.79345 -1.687189 -1.02978 -0.260882 -2.13389 -0.12866074 -2.98356 0.721007 -0.71043 0.710432 -1.07951 1.734322 -1.29162 2.611262 -0.1458 0.6028 -0.22973 1.19672 -0.28594 1.63655l-1.39478 0.09517c-0.99712 0.06803 -1.82428 1.06921 -1.37486 2.12679 0.3252 0.76529 0.75651 1.47376 1.27543 2.1076L0.255305 12.5067c-0.3417088 0.3417 -0.3417087 0.8957 0 1.2374 0.341709 0.3417 0.895725 0.3417 1.237435 0l3.08944 -3.0894c0.63329 0.5172 1.34071 0.9473 2.10387 1.2728 1.0578 0.4511 2.06191 -0.3754 2.13008 -1.3745l0.09494 -1.39155c0.43984 -0.05621 1.03376 -0.14014 1.63653 -0.28594 0.877 -0.21211 1.9009 -0.58119 2.6113 -1.29163Z" clip-rule="evenodd" stroke-width="1"></path>
  </g>
</svg></div><div class="bam-text">置顶</div></div>
            <div class="bam-item" id="readen-bam-delete"><div class="bam-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" id="Trash--Streamline-Tabler" height="24" width="24">
  <desc>
    Trash Streamline Icon: https://streamlinehq.com
  </desc>
  <path d="m4 7 16 0" stroke-width="2"></path>
  <path d="m10 11 0 6" stroke-width="2"></path>
  <path d="m14 11 0 6" stroke-width="2"></path>
  <path d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" stroke-width="2"></path>
  <path d="M9 7V4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" stroke-width="2"></path>
</svg></div><div class="bam-text">删除</div></div>
        </div>

        <!-- 自定义封面弹窗 -->
        <div class="cover-modal-overlay" id="readen-cover-modal-overlay">
            <div class="cover-modal">
                <div class="cover-modal-title">自定义封面</div>
                <div class="cover-preview-box" id="readen-cover-preview-box">
                    <span class="cover-preview-text" id="readen-cover-preview-text">点击选择图片</span>
                    <img id="readen-cover-preview-img" src="" alt="封面预览">
                </div>
                <div class="cover-reset-btn" id="readen-cover-reset-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16">
                      <g id="arrow-reload-fill">
                        <path id="Union" fill="#000000" d="M12 3c4.9704 0.0002 9 4.02956 9 9 0 4.9704 -4.0296 8.9998 -9 9 -4.59006 -0.0002 -8.37681 -3.4356 -8.93066 -7.876 -0.06829 -0.5478 0.32048 -1.0475 0.86816 -1.1162 0.54793 -0.0683 1.04771 0.3203 1.11621 0.8682C5.48415 16.3279 8.43125 18.9998 12 19c3.8658 -0.0002 7 -3.1341 7 -7 0 -3.86587 -3.1342 -6.9998 -7 -7 -2.37747 0.00012 -4.47963 1.18577 -5.74512 3H8.5c0.55228 0 1 0.44772 1 1s-0.44772 1 -1 1H4c-0.55228 0 -1 -0.44772 -1 -1V4.5c0 -0.55228 0.44772 -1 1 -1s1 0.44772 1 1v1.8418C6.64954 4.30386 9.17219 3.00011 12 3" stroke-width="1"></path>
                      </g>
                    </svg>
                    恢复默认
                </div>
                <div class="cover-modal-footer">
                    <div class="cover-btn cancel" id="readen-cover-cancel-btn">取消</div>
                    <div class="cover-btn confirm" id="readen-cover-confirm-btn">确认</div>
                </div>
                <input type="file" id="readen-cover-upload-input" accept="image/*" style="display: none;">
            </div>
        </div>

        <!-- 下拉菜单主体 -->
        <div class="bookshelf-dropdown" id="readen-bs-dropdown-menu">
            <!-- 视图模式 -->
            <div class="bd-item" id="readen-menu-view-grid">
                <div class="bd-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Layers-1--Streamline-Core" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <desc>Layers 1 Streamline Icon: https://streamlinehq.com</desc>
                      <g id="layers-1--design-layer-layers-pile-stack-align">
                        <path id="Union" fill="currentColor" fill-rule="evenodd" d="M6.99999 0.00231934c-0.23022 0 -0.45798 0.04731736 -0.66915 0.13901466L0.61855 2.80687l-0.013727 0.00666c-0.1752 0.08837 -0.322433 0.22363 -0.425303 0.39073 -0.102869 0.1671 -0.1573365 0.35948 -0.1573365 0.5557 0 0.19623 0.0544675 0.3886 0.1573365 0.5557 0.102869 0.1671 0.250102 0.30236 0.425303 0.39073l0.015035 0.00727L6.3198 7.35379l0.01104 0.0048c0.21117 0.09169 0.43893 0.13901 0.66915 0.13901 0.23022 0 0.45806 -0.04715 0.66923 -0.13885l5.71218 -2.6657 0.0138 -0.00666c0.1752 -0.08837 0.3224 -0.22363 0.4253 -0.39073 0.1028 -0.1671 0.1573 -0.35947 0.1573 -0.5557 0 -0.19622 -0.0545 -0.3886 -0.1573 -0.5557 -0.1029 -0.1671 -0.2501 -0.30236 -0.4253 -0.39073l-0.0151 -0.00727L7.68019 0.14613 7.66915 0.141334C7.45798 0.0496367 7.23021 0.00231934 6.99999 0.00231934ZM13.9312 6.89616c0.1733 0.37622 0.0088 0.82169 -0.3674 0.995L7.69841 10.5931l-0.00255 0.0012c-0.22298 0.1017 -0.4652 0.1543 -0.71029 0.1543 -0.24508 0 -0.4873 -0.0526 -0.71028 -0.1544l-0.00383 -0.0017L0.434922 7.89057c-0.3758899 -0.17401 -0.539544 -0.6198 -0.3655329 -0.99568 0.1740119 -0.37589 0.6197939 -0.53955 0.9956809 -0.36554l5.83395 2.70073c0.02722 0.0122 0.05671 0.01851 0.08655 0.01851 0.02999 0 0.05964 -0.00637 0.08697 -0.0187l0.00082 -0.00037 5.86284 -2.70076c0.3762 -0.1733 0.8217 -0.00881 0.995 0.3674Zm-0.3674 4.24504c0.3762 -0.1733 0.5407 -0.6188 0.3674 -0.995 -0.1733 -0.37625 -0.6188 -0.54074 -0.995 -0.36744L7.07336 12.4795l-0.00082 0.0004c-0.02733 0.0123 -0.05698 0.0187 -0.08697 0.0187 -0.02984 0 -0.05933 -0.0063 -0.08655 -0.0185L1.06507 9.77935C0.689183 9.60534 0.2434 9.769 0.0693891 10.1449c-0.1740111 0.3759 -0.0103569 0.8217 0.3655329 0.9957l5.836538 2.7019 0.00383 0.0017c0.22298 0.1018 0.4652 0.1544 0.71028 0.1544 0.24509 0 0.48731 -0.0526 0.71029 -0.1543l0.00255 -0.0012 5.86539 -2.7019Z" clip-rule="evenodd" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div class="bd-text">网格</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item active" id="readen-menu-view-list">
                <div class="bd-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="List-Ul--Streamline-Font-Awesome" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <desc>List Ul Streamline Icon: https://streamlinehq.com</desc>
                      <path d="M1.67741875 4.45935625c1.168109375 0 1.898178125 -1.26451875 1.314125 -2.27613125 -0.27105 -0.46946875 -0.772028125 -0.758684375 -1.314125 -0.758709375 -1.168109375 -0.000053125 -1.898165625 1.26443125 -1.31415625 2.276071875 0.27105 0.469521875 0.7720125 0.75876875 1.31415625 0.75876875Zm4.046453125 -2.529034375c-0.55955 0 -1.0116125 0.452065625 -1.0116125 1.0116125s0.4520625 1.0116125 1.0116125 1.0116125h9.104515625c0.559546875 0 1.0116125 -0.4520625 1.0116125 -1.0116125s-0.452065625 -1.0116125 -1.0116125 -1.0116125H5.723871875Zm0 5.058065625c-0.55955 0 -1.0116125 0.4520625 -1.0116125 1.0116125s0.4520625 1.0116125 1.0116125 1.0116125h9.104515625c0.559546875 0 1.0116125 -0.452065625 1.0116125 -1.0116125s-0.452065625 -1.0116125 -1.0116125 -1.0116125H5.723871875Zm0 5.0580625c-0.55955 0 -1.0116125 0.452065625 -1.0116125 1.011615625s0.4520625 1.0116125 1.0116125 1.0116125h9.104515625c0.559546875 0 1.0116125 -0.452065625 1.0116125 -1.0116125s-0.452065625 -1.011615625 -1.0116125 -1.011615625H5.723871875ZM1.67741875 14.575484375c1.168109375 0 1.898178125 -1.264515625 1.314125 -2.276128125 -0.271075 -0.4695125 -0.771978125 -0.758734375 -1.314125 -0.7587125 -1.168109375 -0.00005 -1.898165625 1.26443125 -1.31415625 2.276071875 0.27105 0.469525 0.7720125 0.75876875 1.31415625 0.75876875ZM3.1948375 8c0 -1.168109375 -1.264515625 -1.898178125 -2.276128125 -1.314125C0.44921875 6.9569375 0.16 7.457878125 0.16 8c0 1.168109375 1.264515625 1.898178125 2.276128125 1.314125 0.46949375 -0.2710625 0.758709375 -0.772003125 0.758709375 -1.314125Z" fill="currentColor" stroke-width="0.0313"></path>
                    </svg>
                </div>
                <div class="bd-text">列表</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-divider"></div>
            
            <!-- 展示设置 -->
            <div class="bd-item" id="readen-menu-cover-gallery">
                <div class="bd-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Image--Streamline-Font-Awesome" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <desc>Image Streamline Icon: https://streamlinehq.com</desc>
                      <path d="M14 2.5c0.275 0 0.5 0.225 0.5 0.5v9.99375l-0.15625 -0.203125 -4.25 -5.5c-0.140625 -0.184375 -0.3625 -0.290625 -0.59375 -0.290625s-0.45 0.10625 -0.59375 0.290625l-2.59375 3.35625 -0.953125 -1.334375c-0.140625 -0.196875 -0.365625 -0.3125 -0.609375 -0.3125s-0.46875 0.115625 -0.609375 0.315625l-2.5 3.5 -0.140625 0.19375 0 -0.009375V3c0 -0.275 0.225 -0.5 0.5 -0.5h12zM2 1C0.896875 1 0 1.896875 0 3v10c0 1.103125 0.896875 2 2 2h12c1.103125 0 2 -0.896875 2 -2V3c0 -1.103125 -0.896875 -2 -2 -2H2zm2.5 6a1.5 1.5 0 1 0 0 -3 1.5 1.5 0 1 0 0 3z" fill="currentColor" stroke-width="0.0313"></path>
                    </svg>
                </div>
                <div class="bd-text">封面图集</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item active" id="readen-menu-view-showcase">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M216.8 212.2H44c-23.8 0-43.2 20.6-43.2 46v689.4c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V258c0-25.4-19.4-45.8-43.2-45.8z m-43.2 126.4H87.2c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23 0 12.6-9.8 23-21.6 23z m618.6-135.4l-163.8 44.6c-22.6 6.2-35.6 31-29.2 55.6l176.2 665.8c6.4 24.6 30 39.4 52.8 33.2L992 957.8c22.6-6.2 35.6-31 29.2-55.6L845 236.4c-6.6-24.6-30.2-39.4-52.8-33.2z m-8.6 133.2l-82 22.2c-11.4 3-23.2-4.4-26.4-16.6-3.2-12.2 3.2-24.6 14.6-27.8l82-22.2c11.4-3 23.2 4.4 26.4 16.6 3.2 12.2-3.4 24.8-14.6 27.8z m-261-308.2H349.8c-23.8 0-43.2 20.6-43.2 46v873.2c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V74.2c0-25.4-19.2-46-43.2-46z m-43.2 126.4H393c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23s-9.6 23-21.6 23z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">书架顶部展示</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-divider"></div>
            
            <!-- 排序方式 -->
            <div class="bd-item active" id="readen-sort-lastRead">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M426.64889 981.292446a42.664889 42.664889 0 0 1-42.664889 42.664889H42.664889a42.664889 42.664889 0 0 1 0-85.329778h341.319112a42.664889 42.664889 0 0 1 42.664889 42.664889zM42.664889 853.297779h255.989334a42.664889 42.664889 0 1 0 0-85.329778H42.664889a42.664889 42.664889 0 0 0 0 85.329778zM42.664889 682.638223h170.659556a42.664889 42.664889 0 1 0 0-85.329778H42.664889a42.664889 42.664889 0 0 0 0 85.329778z" fill="currentColor"></path>
                      <path d="M511.978668 0A511.978668 511.978668 0 0 0 0 511.978668c0 2.602558 0.341319 5.119787 0.383984 7.722344 13.567435-4.949127 27.860172-7.59435 42.280905-7.722344h170.659556a127.568018 127.568018 0 0 1 118.608391 175.608683 126.88538 126.88538 0 0 1 85.329778 170.659555 125.818758 125.818758 0 0 1 86.993709 165.326445c2.602558 0 5.119787 0.383984 7.722345 0.383984a511.978668 511.978668 0 0 0 0-1023.957335z m158.158743 670.137411a42.664889 42.664889 0 0 1-60.328153 0l-127.994667-127.994667A42.664889 42.664889 0 0 1 469.313779 511.978668V298.654223a42.664889 42.664889 0 0 1 85.329778 0v195.661181l115.493854 115.493854a42.664889 42.664889 0 0 1 0 60.328153z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">最后阅读时间</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item" id="readen-sort-addTime">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M635.904 776.704c0-93.184 75.264-168.448 168.448-168.448s168.448 75.264 168.448 168.448-75.264 168.448-168.448 168.448-168.448-75.264-168.448-168.448z m141.824-105.984v105.984c0 14.848 11.776 26.624 26.624 26.624h78.848c14.848 0 26.624-11.776 26.624-26.624 0-14.848-11.776-26.624-26.624-26.624h-52.224V670.72c0-14.848-11.776-26.624-26.624-26.624-14.848-0.512-26.624 11.776-26.624 26.624zM146.944 935.936c-52.736 0-95.744-43.008-95.744-95.744V413.696h905.728v194.048c-41.984-37.888-96.256-58.88-152.576-58.88-125.952 0-227.84 101.888-227.84 227.84 0 59.392 23.04 116.736 65.024 159.232H146.944z m31.232-201.728c-0.512 14.336 10.752 26.112 25.088 26.624h223.232c14.336-0.512 25.6-12.288 25.088-26.624 0.512-14.336-10.752-26.112-25.088-26.624H203.264c-14.336 0.512-25.6 12.288-25.088 26.624z m0-173.568c-0.512 14.336 10.752 26.112 25.088 26.624h223.232c14.336-0.512 25.6-12.288 25.088-26.624 0.512-14.336-10.752-26.112-25.088-26.624H203.264c-14.336 0.512-25.6 12.288-25.088 26.624zM51.2 360.448V259.072c0-52.736 43.008-95.744 95.744-95.744h59.904v58.88c0 52.736 43.008 95.744 95.744 95.744s95.744-43.008 95.744-95.744V163.328H624.64v58.88c0 52.736 43.008 95.744 95.744 95.744s95.744-43.008 95.744-95.744V163.328h45.056c52.736 0 95.744 43.008 95.744 95.744v101.376H51.2z m669.184-106.496c-17.408 0-31.744-14.336-31.744-31.744V110.592c0-17.408 14.336-31.744 31.744-31.744s31.744 14.336 31.744 31.744v111.616c0 17.92-14.336 31.744-31.744 31.744z m-449.536-31.744V110.592c0-17.408 14.336-31.744 31.744-31.744 17.408 0 31.744 14.336 31.744 31.744v111.616c0 17.408-14.336 31.744-31.744 31.744-17.408 0.512-31.744-13.824-31.744-31.744z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">添加时间</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item" id="readen-sort-size">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" style="width: 21px; height: 21px; color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M473.4 230.8l-1.5-1.1c-40.2-26.6-87.3-40.8-135.3-40.8l-203.4 12.4c-17.3 0-31.1 14.4-31.1 31.9v590.1c0 17.7 14 31.9 31.1 31.9l203.4-12.4c48 0 94.9 14.2 135.3 40.8l1.5 1.1V230.8z m432.5-29.5l-203.4-12.4c-48 0-94.9 14.2-135.3 40.8l-1.5 1.1v653.9l1.3-1.1c40.4-26.6 87.5-40.8 135.5-40.8l203.4 12.4c17.3 0 31.1-14.4 31.1-31.9V233.2c0.3-17.5-13.8-31.9-31.1-31.9z m0 0" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">文件大小</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item" id="readen-sort-name">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M812.242784 31.258819H211.757216C173.078988 31.258819 141.698539 62.639268 141.698539 101.317496v821.365008c0 38.678228 31.380449 70.058677 70.058677 70.058677h600.485568c19.339114 0 36.853783-7.905927 49.503267-20.555411 12.649483-12.649483 20.55541-30.164153 20.55541-49.503266V101.317496c0-38.678228-31.380449-70.058677-70.058677-70.058677zM500.749258 77.964604h228.420477v303.709229L626.757572 279.26167c-2.675852-2.310963-6.324742-3.770519-10.095261-3.770519h-0.486518c-0.729778-0.12163-1.581185-0.12163-2.310963-0.12163-3.892149 0-7.419408 1.459556-10.095261 3.770519l-102.898682 102.898682v-304.074118z m79.667419 729.169735H285.829671c-8.635705 0-15.568595-6.93289-15.568595-15.568595 0-8.635705 6.93289-15.568595 15.568595-15.568595h294.587006c8.635705 0 15.568595 6.93289 15.568594 15.568595 0 8.635705-6.93289 15.568595-15.568594 15.568595zM735.494477 649.502316H282.78893c-8.635705 0-15.568595-6.93289-15.568595-15.568595s6.93289-15.568595 15.568595-15.568595h452.097399c8.635705 0 15.568595 6.93289 15.568594 15.568595 0 8.392446-6.689631 15.203706-14.960446 15.568595z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">文件名称</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-divider"></div>
            
            <!-- 操作 -->
            <div class="bd-item" id="readen-menu-create-group">
                <div class="bd-icon">
                    <svg viewBox="480 140 900 830" style="width: 17px; height: 17px; color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M486.39747061 482.36410227v-251.0334892c0-52.64730195 28.93858301-81.93454234 81.93454234-81.93454234 74.9613896 0 149.92277729-0.34865734 224.8841669 0.34865925 9.06509875 0 20.22214163 4.88120672 27.19529435 11.15704285 18.8275122 16.38690885 35.21441916 35.21441916 54.0419314 51.94998538 6.27583803 5.57852142 16.0382515 9.76241345 24.05737628 9.76241345 106.34057598 0.69731469 212.68115006 0.34865734 319.02172606 0.34865925 57.52850868 0 85.76977509 27.89260906 86.11843247 85.07245853v205.70799922c0 29.63589773-8.71644142 35.56307841-35.91173578 24.0573763-173.2828389-71.12615491-356.32809121 67.63957951-333.66534434 252.77677596 2.44060336 19.52482692-3.48657542 25.80066496-26.49797966 25.80066495-100.4133953 0.34865734-200.82679059 0-301.58884516 0-14.99227754 0-30.33321244 0.34865734-45.32548995-0.34865735-43.93086055-2.09194603-73.56675828-32.07650109-73.56676022-76.35602093-1.04597204-85.42111776-0.69731469-171.19089287-0.69731469-257.30932532z" fill="currentColor"></path>
                      <path d="M1172.90433077 965.25491113c-111.57044006 0.34865734-202.22142192-89.95366714-202.57007926-202.22142191-0.34865734-112.96506947 89.95366714-204.66202525 202.22142192-205.01068263 111.91909744-0.34865734 204.31336793 90.99963921 205.01068262 202.91873662 1.04597204 112.61641212-90.65098186 203.96471056-204.66202528 204.31336792z m20.57080087-184.09122634c17.43288091 0 32.42515845-0.34865734 47.41743599 0 13.59764815 0.34865734 24.75469101-2.7892607 26.14932231-18.82751032 1.04597204-12.90033153-8.36778213-19.87348423-26.49797968-20.22214349-15.34093488-0.34865734-30.68187169 0-47.06877862 0 0-19.52482692 0.34865734-35.56307841 0-51.94998535-0.34865734-12.55167415-6.27583803-21.61677293-19.87348426-21.61677294-13.59764815 0-18.8275122 9.06509875-18.82751222 21.96543029V742.11403098h-50.55535595c-13.24898887 0-23.36006159 4.88120672-23.3600597 19.52482692 0 14.64362017 10.11107079 19.52482692 23.70871706 19.17616955 16.38690885-0.34865734 33.12247506 0 50.55535592 0v51.25267066c0 12.90033153 4.53254939 22.31408764 18.47885489 22.31408765 14.64362017 0.34865734 20.22214163-9.41375612 20.22214161-22.66274498-0.34865734-15.68959225-0.34865734-32.07650109-0.34865735-50.55535599z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">创建分组</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="bd-item" id="readen-menu-import">
                <div class="bd-icon">
                    <svg viewBox="0 0 1024 1024" height="18" width="18" style="color: var(--text-sub); fill: currentColor; stroke: none;">
                      <path d="M600.76158 68.191078 245.714238 68.191078c-49.040926 0-88.317465 39.720653-88.317465 88.76158l-0.444115 710.09366c0 49.040926 39.277562 88.76158 88.317465 88.76158l533.014616 0c49.040926 0 88.76158-39.720653 88.76158-88.76158L867.046319 334.476841 600.76158 68.191078zM689.523159 778.284739 334.475817 778.284739l0-88.76158 355.047342 0L689.523159 778.284739zM689.523159 600.76158 334.475817 600.76158l0-88.76158 355.047342 0L689.523159 600.76158zM556.38079 378.857631 556.38079 134.762263 800.475134 378.857631 556.38079 378.857631z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="bd-text">导入小说</div>
                <div class="bd-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
        </div>

        <div class="category-tabs" id="readen-category-tabs">
            <div class="tab active">全部</div>
        </div>
        <div class="search-bar">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            搜索书籍
        </div>
        <div class="readen-search-panel" id="readen-search-panel" aria-hidden="true">
            <div class="readen-search-panel-head">
                <div class="readen-search-tabs" role="tablist">
                    <button type="button" class="readen-search-tab active" data-search-mode="online">搜书</button>
                    <button type="button" class="readen-search-tab" data-search-mode="bookshelf">书架</button>
                </div>
                <button type="button" class="readen-search-close" id="readen-search-close" aria-label="关闭搜索">×</button>
            </div>
            <label class="readen-search-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>
                <input id="readen-search-input" type="search" autocomplete="off" placeholder="输入书名">
            </label>
            <div class="readen-search-status" id="readen-search-status"></div>
            <div class="readen-search-results" id="readen-search-results"></div>
        </div>
        <div class="showcase" id="readen-bookshelf-showcase">
            <div class="shelf-base"></div>
        </div>
        
        <!-- 空状态背景层 -->
        <div class="empty-bookshelf">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Menu-Book-Fill--Streamline-Outlined-Fill-Material">
                <path fill="currentColor" d="M14 9.65v-1.2c0.55 -0.23335 1.1125 -0.40835 1.6875 -0.525 0.575 -0.11665 1.17915 -0.175 1.8125 -0.175 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375 -0.40835 -0.075 -0.8375 -0.1125 -1.2875 -0.1125 -0.63335 0 -1.24165 0.07915 -1.825 0.2375s-1.14165 0.37915 -1.675 0.6625Zm0 5.5v-1.225c0.55 -0.225 1.1125 -0.39375 1.6875 -0.50625 0.575 -0.1125 1.17915 -0.16875 1.8125 -0.16875 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375 -0.40835 -0.075 -0.8375 -0.1125 -1.2875 -0.1125 -0.63335 0 -1.24165 0.075 -1.825 0.225 -0.58335 0.15 -1.14165 0.375 -1.675 0.675Zm0 -2.75v-1.2c0.55 -0.23335 1.1125 -0.40835 1.6875 -0.525 0.575 -0.11665 1.17915 -0.175 1.8125 -0.175 0.43335 0 0.85835 0.03335 1.275 0.1 0.41665 0.06665 0.825 0.15 1.225 0.25v1.1c-0.4 -0.15 -0.80415 -0.2625 -1.2125 -0.3375C18.37915 11.5375 17.95 11.5 17.5 11.5c-0.63335 0 -1.24165 0.07915 -1.825 0.2375s-1.14165 0.37915 -1.675 0.6625Zm-1.2 5.35c0.83335 -0.41665 1.65 -0.72915 2.45 -0.9375 0.8 -0.20835 1.65 -0.3125 2.55 -0.3125 0.63335 0 1.2875 0.05 1.9625 0.15 0.675 0.1 1.25415 0.23335 1.7375 0.4V6.325c-0.56665 -0.28335 -1.16515 -0.49165 -1.7955 -0.625 -0.63035 -0.13335 -1.26515 -0.2 -1.9045 -0.2 -0.9 0 -1.77085 0.1375 -2.6125 0.4125 -0.84165 0.275 -1.6375 0.6625 -2.3875 1.1625V17.75ZM12.05 20c-0.85 -0.63335 -1.775 -1.12085 -2.775 -1.4625S7.25 18.025 6.2 18.025c-0.609 0 -1.207085 0.075 -1.79425 0.225 -0.587165 0.15 -1.172415 0.33335 -1.75575 0.55 -0.385 0.18335 -0.75625 0.15835 -1.11375 -0.075C1.17875 18.49165 1 18.15835 1 17.725V6.15c0 -0.25 0.058335 -0.47915 0.175 -0.6875 0.116665 -0.20835 0.291665 -0.37085 0.525 -0.4875 0.7 -0.333335 1.429165 -0.579165 2.1875 -0.7375S5.41665 4 6.2 4c1.05 0 2.07085 0.141665 3.0625 0.425 0.99165 0.283335 1.92085 0.71665 2.7875 1.3 0.85 -0.58335 1.7625 -1.016665 2.7375 -1.3C15.7625 4.141665 16.76665 4 17.8 4c0.78635 0 1.55375 0.079165 2.30225 0.2375 0.7485 0.158335 1.47275 0.404165 2.17275 0.7375 0.23335 0.11665 0.4125 0.27915 0.5375 0.4875 0.125 0.20835 0.1875 0.4375 0.1875 0.6875v11.575c0 0.46485 -0.1875 0.8186 -0.5625 1.06125 -0.375 0.2425 -0.74585 0.2471 -1.1125 0.01375 -0.56665 -0.23335 -1.1436 -0.42085 -1.73075 -0.5625 -0.58715 -0.14165 -1.18525 -0.2125 -1.79425 -0.2125 -1.05 0 -2.05835 0.175 -3.025 0.525 -0.96665 0.35 -1.875 0.83335 -2.725 1.45Z"></path>
            </svg>
            <h2>开启你的阅读旅程</h2>
            <p>The shelves are waiting for your next great discovery.</p>
            
            <div class="empty-import-btns">
                <div class="empty-import-btn" id="readen-empty-import-local">
                    <div class="empty-import-btn-left">
                        <div class="empty-import-icon">
                            <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="Folder-3-Line--Streamline-Remix" height="16" width="16">
                                <path d="M8.276133333333332 3.333333333333333H14c0.36819999999999997 0 0.6666666666666666 0.29847999999999997 0.6666666666666666 0.6666666666666666v9.333333333333332c0 0.36819999999999997 -0.29846666666666666 0.6666666666666666 -0.6666666666666666 0.6666666666666666H2c-0.36818666666666666 0 -0.6666666666666666 -0.29846666666666666 -0.6666666666666666 -0.6666666666666666V2.6666666666666665c0 -0.36818666666666666 0.29847999999999997 -0.6666666666666666 0.6666666666666666 -0.6666666666666666h4.9428l1.3333333333333333 1.3333333333333333ZM2.6666666666666665 4.666666666666666v8h10.666666666666666V4.666666666666666H2.6666666666666665Z" stroke-width="0.6667"></path>
                            </svg>
                        </div>
                        <div class="empty-import-text">本地导入</div>
                    </div>
                    <div class="empty-import-arrow">
                        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
                <div class="empty-import-btn" id="readen-empty-import-wifi" style="display: none;">
                    <div class="empty-import-btn-left">
                        <div class="empty-import-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Wifi-Horizontal--Streamline-Core-Remix" height="14" width="14">
                                <g id="Free Remix/Computer Devices/wifi-horizontal--wireless-wifi-internet-server-network-horizontal-connection">
                                    <path id="Union" fill="currentColor" fill-rule="evenodd" d="M9.81232 1.16634c-0.18426 0.29188 -0.09703 0.67788 0.19488 0.86214C11.6567 3.06986 12.75 4.90676 12.75 6.99842c0 2.09356 -1.0953 3.93188 -2.7473 4.97278 -0.29206 0.184 -0.37965 0.5699 -0.19565 0.862 0.18401 0.292 0.56995 0.3796 0.86195 0.1956 2 -1.2601 3.331 -3.48956 3.331 -6.03038 0 -2.53851 -1.3286 -4.76626 -3.3255 -6.026925 -0.2919 -0.184267 -0.67791 -0.09703 -0.86218 0.194845ZM7 5.74999c0.69036 0 1.25 0.55964 1.25 1.25s-0.55964 1.25 -1.25 1.25 -1.25 -0.55964 -1.25 -1.25 0.55964 -1.25 1.25 -1.25Zm1.17051 -1.40673c-0.31013 -0.15155 -0.43867 -0.52582 -0.28712 -0.83595 0.15156 -0.31012 0.52582 -0.43867 0.83595 -0.28712 1.39666 0.68251 2.36076 2.118 2.36076 3.77986 0 1.6603 -0.9623 3.09465 -2.35681 3.77795 -0.30997 0.1519 -0.68438 0.0237 -0.83625 -0.2863 -0.15188 -0.3099 -0.02373 -0.68434 0.28624 -0.83622 0.98249 -0.4814 1.6568 -1.49026 1.6568 -2.65543 0 -1.16627 -0.67558 -2.17593 -1.65957 -2.65679ZM4.18768 1.16634c0.18426 0.29188 0.09703 0.67788 -0.19485 0.86214C2.34329 3.06986 1.25 4.90676 1.25 6.99842c0 2.09356 1.09528 3.93188 2.74732 4.97278 0.29204 0.184 0.37963 0.5699 0.19563 0.862 -0.18401 0.292 -0.56992 0.3796 -0.86197 0.1956C1.33105 11.7687 0 9.53924 0 6.99842 0 4.45991 1.32864 2.23216 3.32554 0.971495c0.29188 -0.184267 0.67787 -0.09703 0.86214 0.194845Zm1.64181 3.17692c0.31013 -0.15155 0.43867 -0.52582 0.28712 -0.83595 -0.15156 -0.31012 -0.52582 -0.43867 -0.83595 -0.28712 -1.39661 0.68251 -2.36074 2.118 -2.36074 3.77986 0 1.6603 0.96232 3.09465 2.35679 3.77795 0.30997 0.1519 0.68438 0.0237 0.83625 -0.2863 0.15188 -0.3099 0.02373 -0.68434 -0.28624 -0.83622 -0.98249 -0.4814 -1.6568 -1.49026 -1.6568 -2.65543 0 -1.16627 0.67558 -2.17593 1.65957 -2.65679Z" clip-rule="evenodd" stroke-width="1"></path>
                                </g>
                            </svg>
                        </div>
                        <div class="empty-import-text">Wi-Fi导入</div>
                    </div>
                    <div class="empty-import-arrow">
                        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </div>
            
            <input type="file" id="readen-local-import-input" accept=".txt,.epub" style="display: none;">
        </div>

        <div class="book-list" id="readen-book-list-container" style="position: relative; z-index: 1;">
            <!-- 书籍列表为空 -->
        </div>
    </div>

    <!-- ================= 统计 (Stats) ================= -->
    <div id="readen-page-stats" class="page">
        <header>
            <div class="header-title">统计</div>
            <div class="header-right">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            </div>
        </header>
        
        <div class="stats-tabs">
            <div class="s-tab" data-target="readen-tab-total">总</div>
            <div class="s-tab active" data-target="readen-tab-day">日</div>
            <div class="s-tab" data-target="readen-tab-week">周</div>
            <div class="s-tab" data-target="readen-tab-month">月</div>
            <div class="s-tab" data-target="readen-tab-year">年</div>
        </div>

        <div class="stats-container">
            <!-- 总统计 (隐藏) -->
            <div id="readen-tab-total" class="tab-content">
                <div class="s-card s-card-day">我们相识的第 <span class="big-num">1</span> 天</div>

                <div class="s-grid-2x2">
                    <div class="s-card"><div class="s-card-title">总阅读时长</div><div class="s-card-val">0<span class="unit">分</span> 0<span class="unit">秒</span></div></div>
                    <div class="s-card"><div class="s-card-title">阅读文档数</div><div class="s-card-val">0<span class="unit">文件</span></div></div>
                    <div class="s-card"><div class="s-card-title">翻页次数</div><div class="s-card-val">0<span class="unit">页</span></div></div>
                    <div class="s-card"><div class="s-card-title">阅读字数</div><div class="s-card-val">0.0<span class="unit">万字</span></div></div>
                </div>

                <div class="s-card">
                    <div class="s-card-header">
                        <div><div class="s-card-title-main">最近9天</div><div class="s-card-sub">每日阅读时间(分钟)</div></div>
                        <svg viewBox="0 0 24 24"><rect x="4" y="14" width="4" height="6" rx="1"></rect><rect x="10" y="10" width="4" height="10" rx="1"></rect><rect x="16" y="4" width="4" height="16" rx="1"></rect></svg>
                    </div>
                    <div class="chart-lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
                    <div class="chart-x-axis"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span><span>周一</span><span>周二</span></div>
                </div>

                <div class="s-card">
                    <div class="s-card-header" style="margin-bottom: 0;">
                        <div><div class="s-card-title-main">阅读心跳</div><div class="s-card-sub">单次阅读时长(分钟)</div></div>
                    </div>
                    <div style="height: 160px;"></div>
                </div>

                <div class="s-card">
                    <div class="s-card-header" style="margin-bottom: 0;">
                        <div><div class="s-card-title-main">最近30天</div><div class="s-card-sub">每日阅读时间(分钟)</div></div>
                    </div>
                    <div class="heatmap-grid">
                        <div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div>
                        <div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div>
                        <div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div><div class="heatmap-cell"></div>
                    </div>
                </div>

                <div class="s-card s-list-item">
                    <span>阅读时间最长的文件</span>
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>

            <!-- 日统计 (默认显示) -->
            <div id="readen-tab-day" class="tab-content active">
                <!-- 日期选择器 -->
                <div class="s-date-selector">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span>2026-08-11</span>
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <!-- 当日阅读总览 -->
                <div class="s-card s-center-card">
                    <div class="s-card-title-main" style="text-align: left; margin-bottom: 24px;">当日阅读总览</div>
                    <div class="s-huge-text">没！看！书！</div>
                    <div class="s-card-sub">总阅读时长</div>
                    
                    <div class="s-3col-grid">
                        <div>
                            <div class="s-3col-val">0</div>
                            <div class="s-3col-label">文件数</div>
                        </div>
                        <div>
                            <div class="s-3col-val">0</div>
                            <div class="s-3col-label">翻页次数</div>
                        </div>
                        <div>
                            <div class="s-3col-val">0</div>
                            <div class="s-3col-label">打断次数</div>
                        </div>
                    </div>
                </div>

                <!-- 效率指标 -->
                <div class="s-card">
                    <div class="s-card-title-main">效率指标</div>
                    <div class="s-card-sub">关键阅读效率分析</div>
                    
                    <div class="s-gray-grid">
                        <div class="s-gray-card">
                            <div class="s-gray-title">平均阅读</div>
                            <div class="s-gray-sub">每本书</div>
                            <div class="s-gray-val">0.0<span>分钟</span></div>
                        </div>
                        <div class="s-gray-card">
                            <div class="s-gray-title">翻页速度</div>
                            <div class="s-gray-sub">平均时间</div>
                            <div class="s-gray-val">0.0<span>秒/页</span></div>
                        </div>
                        <div class="s-gray-card">
                            <div class="s-gray-title">阅读效率</div>
                            <div class="s-gray-sub">翻页率</div>
                            <div class="s-gray-val">0.0</div>
                        </div>
                        <div class="s-gray-card">
                            <div class="s-gray-title">使用频次</div>
                            <div class="s-gray-sub">平均打开</div>
                            <div class="s-gray-val">0.0</div>
                        </div>
                    </div>
                </div>

                <!-- 阅读习惯分析 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读习惯分析</div>
                    <div class="s-card-sub">了解你的阅读偏好</div>
                    
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div>
                                <div class="s-list-title">专注度最高</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val">N/A</div>
                    </div>
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div>
                                <div class="s-list-title">最佳阅读时段</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val">N/A</div>
                    </div>
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div>
                                <div class="s-list-title">阅读活跃度</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val">N/A</div>
                    </div>
                </div>

                <!-- 当日之最 -->
                <div class="s-card">
                    <div class="s-card-title-main">当日之最</div>
                    <div class="s-card-sub">当日阅读记录亮点</div>
                    
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                            <div>
                                <div class="s-list-title">阅读最久</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val" style="color: var(--text-sub); font-weight: normal;">N/A</div>
                    </div>
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
                            <div>
                                <div class="s-list-title">翻页最多</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val" style="color: var(--text-sub); font-weight: normal;">N/A</div>
                    </div>
                    <div class="s-list-box">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                            <div>
                                <div class="s-list-title">打开最多</div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                        <div class="s-list-val" style="color: var(--text-sub); font-weight: normal;">N/A</div>
                    </div>
                </div>

                <!-- 时间分布 -->
                <div class="s-card">
                    <div class="s-card-title-main">时间分布</div>
                    <div class="s-card-sub">不同时段阅读占比</div>
                    
                    <div class="s-list-box clear-bg">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></div>
                            <div>
                                <div class="s-list-title">凌晨(0:00~6:00) <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">0%</span></div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                    </div>
                    <div class="s-list-box clear-bg">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></div>
                            <div>
                                <div class="s-list-title">上午(6:00~12:00) <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">0%</span></div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                    </div>
                    <div class="s-list-box clear-bg">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
                            <div>
                                <div class="s-list-title">下午(12:00~18:00) <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">0%</span></div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                    </div>
                    <div class="s-list-box clear-bg">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg></div>
                            <div>
                                <div class="s-list-title">晚上(18:00~24:00) <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">0%</span></div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 时段阅读详情 -->
                <div class="s-card">
                    <div class="s-card-title-main">时段阅读详情</div>
                    <div class="s-card-sub">每小时的阅读活动</div>
                    
                    <div class="s-list-box clear-bg" style="border: none;">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                            <div>
                                <div class="s-list-title">没！看！书！ <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">0%</span></div>
                                <div class="s-list-sub">N/A</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 阅读排行 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读排行</div>
                    <div class="s-card-sub">当日阅读的所有书籍(MAX=99)</div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
            
            <!-- 周统计 -->
            <div id="readen-tab-week" class="tab-content">
                <!-- 日期选择器 -->
                <div class="s-date-selector">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span>8月9日-8月15日</span>
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <!-- 周度总览 -->
                <div class="s-card">
                    <div class="s-card-title-main">周度总览</div>
                    <div class="s-card-sub">核心数据一览</div>
                    <div class="s-grid-3x2">
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m191.2 604L488.8 544H480V256h64v246.4l191.2 110.4-32 55.2z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">总阅读时间</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M216.8 212.2H44c-23.8 0-43.2 20.6-43.2 46v689.4c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V258c0-25.4-19.4-45.8-43.2-45.8z m-43.2 126.4H87.2c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23 0 12.6-9.8 23-21.6 23z m618.6-135.4l-163.8 44.6c-22.6 6.2-35.6 31-29.2 55.6l176.2 665.8c6.4 24.6 30 39.4 52.8 33.2L992 957.8c22.6-6.2 35.6-31 29.2-55.6L845 236.4c-6.6-24.6-30.2-39.4-52.8-33.2z m-8.6 133.2l-82 22.2c-11.4 3-23.2-4.4-26.4-16.6-3.2-12.2 3.2-24.6 14.6-27.8l82-22.2c11.4-3 23.2 4.4 26.4 16.6 3.2 12.2-3.4 24.8-14.6 27.8z m-261-308.2H349.8c-23.8 0-43.2 20.6-43.2 46v873.2c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V74.2c0-25.4-19.2-46-43.2-46z m-43.2 126.4H393c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23s-9.6 23-21.6 23z" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总书籍数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M733.184 0H289.792C131.072 0 0 131.072 0 289.792v443.392C0 892.928 130.048 1024 289.792 1024h443.392c159.744 0 290.816-131.072 289.792-289.792V289.792C1022.976 131.072 892.928 0 733.184 0zM471.04 684.032c0 23.552-19.456 43.008-43.008 43.008s-43.008-19.456-43.008-43.008V381.952h-99.328c-23.552 0-43.008-19.456-43.008-43.008 0-24.576 18.432-43.008 44.032-43.008h283.648c23.552 0 43.008 19.456 43.008 43.008 0 23.552-19.456 43.008-43.008 43.008H471.04v302.08z m269.312-158.72h-43.008v157.696c0 23.552-19.456 43.008-43.008 43.008-23.552 0-43.008-19.456-43.008-43.008V525.312h-43.008c-23.552 0-43.008-19.456-43.008-43.008s19.456-43.008 43.008-43.008h169.984c23.552 0 43.008 19.456 45.056 43.008 0 24.576-19.456 43.008-43.008 43.008z" fill="currentColor"></path></svg>
                            <div class="val">0.0<span>万字</span></div>
                            <div class="label">总字数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M861.9 843.5c0 31.1-25.2 56.2-56.2 56.2H103.5l98.3-454.2c0-31 25-56.2 56.1-56.2h646.2c31 0 56.1 25.2 56.1 56.2l-98.3 398zM215.8 347.1h632v-55.2c0-31-25.2-56.2-56.2-56.2h-337v-50.9c0-31-25.2-56.2-56.2-56.2H117.6c-31 0-56.2 25.2-56.2 56.2v658.6l98.2-440.2c0-30.9 25.2-56.1 56.2-56.1z m0 0" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总打开次数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 24 24" style="color: #888888; fill: currentColor; stroke: none;"><path d="M22.5 17.0996c0 0.8 -0.7 1.5 -1.5 1.5h-2.5c-1.8 0 -3.6 0.6003 -5 1.7002l-0.5996 0.5c-0.3 0.2 -0.6004 0.2998 -0.9004 0.2998s-0.6004 -0.0998 -0.9004 -0.2998l-0.5996 -0.5c-1.39999 -1.0999 -3.20004 -1.7002 -5 -1.7002H3c-0.8 0 -1.5 -0.7 -1.5 -1.5V4.7002H1c-0.552284 0 -1 0.44771 -1 1v14c0.000106812 0.5522 0.447783 1 1 1h3c2.39075 0 4.67557 0.7339 6.5938 2.1953l0.0058 0.0049 0.8008 0.5996c0.3554 0.2664 0.8438 0.2664 1.1992 0l0.8066 -0.6045c1.9182 -1.4614 4.2031 -2.1953 6.5938 -2.1953h3c0.5522 0 0.9999 -0.4478 1 -1v-14c0 -0.55229 -0.4477 -1 -1 -1h-0.5zM18.5 1.5c-2.1 0 -4.2004 0.7 -5.9004 2L12 4l-0.5996 -0.5C9.70039 2.2 7.6 1.5 5.5 1.5H4c-0.6 0 -1 0.4 -1 1v14.5996h2.5c2.1 0 4.20039 0.7 5.9004 2l0.5996 0.5 0.5996 -0.5c1.7 -1.3 3.8004 -2 5.9004 -2H21V2.5c0 -0.6 -0.4 -1 -1 -1z" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总翻页数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M364.8 550.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4h128v-192c0-19.2 19.2-38.4 38.4-38.4s38.4 19.2 38.4 38.4V512c0 19.2-19.2 38.4-38.4 38.4h-166.4z" fill="currentColor"></path><path d="M972.8 608c-12.8 0-19.2-6.4-32-12.8-6.4-6.4-12.8-19.2-6.4-32 0-19.2 6.4-38.4 0-51.2-6.4-57.6-19.2-115.2-38.4-160-19.2-51.2-51.2-102.4-89.6-134.4-76.8-83.2-179.2-128-294.4-128S294.4 134.4 217.6 211.2c-19.2 19.2-38.4 44.8-51.2 64L236.8 256h12.8c19.2 0 32 12.8 38.4 25.6 6.4 19.2-6.4 38.4-25.6 44.8L96 377.6c-6.4 6.4-12.8 6.4-12.8 6.4-6.4 0-12.8-6.4-19.2-6.4-12.8-6.4-19.2-19.2-19.2-25.6l-32-172.8c-6.4-19.2 6.4-38.4 32-44.8h6.4c19.2 0 32 12.8 38.4 32l12.8 64C121.6 204.8 140.8 179.2 160 160c44.8-44.8 102.4-83.2 160-108.8 64-25.6 128-38.4 192-38.4 70.4 0 134.4 12.8 192 38.4s115.2 64 160 108.8c51.2 44.8 83.2 96 108.8 160s38.4 128 38.4 192c0 19.2 0 38.4-6.4 57.6 0 19.2-12.8 38.4-32 38.4zM480 1011.2s-6.4 0 0 0c-57.6-6.4-108.8-19.2-160-38.4-57.6-25.6-115.2-64-160-108.8s-83.2-96-108.8-160c-12.8-25.6-19.2-44.8-25.6-70.4 0-12.8 0-25.6 6.4-32 12.8-6.4 19.2-12.8 32-12.8 19.2 0 32 12.8 38.4 32 19.2 70.4 57.6 140.8 108.8 192 38.4 38.4 76.8 64 121.6 83.2s96 32 140.8 38.4c19.2 0 38.4 19.2 38.4 38.4 0 12.8-6.4 19.2-12.8 25.6 0 6.4-12.8 12.8-19.2 12.8z m121.6-281.6c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 140.8c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 134.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">日均时长</div>
                        </div>
                    </div>
                </div>

                <!-- 时间分析 -->
                <div class="s-card">
                    <div class="s-card-title-main">时间分析</div>
                    <div class="s-card-sub">阅读时间分布与趋势</div>
                    <div class="s-split-2">
                        <div>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">日均时长</div>
                        </div>
                        <div class="divider"></div>
                        <div>
                            <div class="val">0.0</div>
                            <div class="label">日均阅读书籍</div>
                        </div>
                    </div>
                    <div class="s-time-grid">
                        <div class="s-time-card">
                            <div class="title">凌晨(0:00~6:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">上午(6:00~12:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">下午(12:00~18:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">晚上(18:00~24:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                    </div>
                </div>

                <!-- 本周最爱 -->
                <div class="s-card">
                    <div class="s-card-title-main">本周最爱</div>
                    <div class="s-card-sub">按天展示本周阅读时间最长的书籍</div>
                    <div class="s-week-fav-grid">
                        <div class="day-col"><div class="day-name">日</div><div class="day-date">8/9</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">一</div><div class="day-date">8/10</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">二</div><div class="day-date">8/11</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">三</div><div class="day-date">8/12</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">四</div><div class="day-date">8/13</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">五</div><div class="day-date">8/14</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                        <div class="day-col"><div class="day-name">六</div><div class="day-date">8/15</div><div class="book-placeholder"></div><div class="dash">-</div></div>
                    </div>
                </div>

                <!-- 阅读时间分布 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读时间分布</div>
                    <div class="s-card-sub">24小时阅读习惯一览</div>
                    <div style="height: 120px;"></div>
                    <div class="chart-x-axis">
                        <span>0</span><span>3</span><span>6</span><span>9</span><span>12</span><span>15</span><span>18</span><span>21</span>
                    </div>
                </div>

                <!-- 行为分析 -->
                <div class="s-card">
                    <div class="s-card-title-main">行为分析</div>
                    <div class="s-card-sub">阅读习惯深度分析</div>
                    <div class="s-list-box-simple">
                        <div><div class="title">翻页之王</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">精力最集中</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">长期陪伴</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                </div>

                <!-- 书籍偏好 -->
                <div class="s-card">
                    <div class="s-card-title-main">书籍偏好</div>
                    <div class="s-card-sub">你的阅读倾向</div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue); fill: var(--theme-blue);"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                        <div><div class="title">最爱阅读</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue); fill: var(--theme-blue);"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div>
                        <div><div class="title">最常打开</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue);"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline><line x1="4" y1="22" x2="20" y2="22"></line></svg></div>
                        <div><div class="title">阅读最早的一天</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline><line x1="4" y1="2" x2="20" y2="2"></line></svg></div>
                        <div><div class="title">阅读最晚的一天</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                </div>

                <!-- 毅力成就 -->
                <div class="s-card">
                    <div class="s-card-title-main">毅力成就</div>
                    <div class="s-card-sub">坚持就是胜利</div>
                    <div class="s-list-box-simple">
                        <div><div class="title">最长连续阅读</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">单日最佳记录</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                </div>

                <!-- 阅读排行 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读排行</div>
                    <div class="s-card-sub">当周阅读的所有书籍(MAX=99)</div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
            
            <!-- 月统计 -->
            <div id="readen-tab-month" class="tab-content">
                <!-- 日期选择器 -->
                <div class="s-date-selector">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span>2026-08</span>
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <!-- 月度总览 -->
                <div class="s-card">
                    <div class="s-card-title-main">月度总览</div>
                    <div class="s-card-sub">核心数据一览</div>
                    <div class="s-grid-3x2">
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m191.2 604L488.8 544H480V256h64v246.4l191.2 110.4-32 55.2z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">总阅读时间</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M216.8 212.2H44c-23.8 0-43.2 20.6-43.2 46v689.4c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V258c0-25.4-19.4-45.8-43.2-45.8z m-43.2 126.4H87.2c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23 0 12.6-9.8 23-21.6 23z m618.6-135.4l-163.8 44.6c-22.6 6.2-35.6 31-29.2 55.6l176.2 665.8c6.4 24.6 30 39.4 52.8 33.2L992 957.8c22.6-6.2 35.6-31 29.2-55.6L845 236.4c-6.6-24.6-30.2-39.4-52.8-33.2z m-8.6 133.2l-82 22.2c-11.4 3-23.2-4.4-26.4-16.6-3.2-12.2 3.2-24.6 14.6-27.8l82-22.2c11.4-3 23.2 4.4 26.4 16.6 3.2 12.2-3.4 24.8-14.6 27.8z m-261-308.2H349.8c-23.8 0-43.2 20.6-43.2 46v873.2c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V74.2c0-25.4-19.2-46-43.2-46z m-43.2 126.4H393c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23s-9.6 23-21.6 23z" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总书籍数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M733.184 0H289.792C131.072 0 0 131.072 0 289.792v443.392C0 892.928 130.048 1024 289.792 1024h443.392c159.744 0 290.816-131.072 289.792-289.792V289.792C1022.976 131.072 892.928 0 733.184 0zM471.04 684.032c0 23.552-19.456 43.008-43.008 43.008s-43.008-19.456-43.008-43.008V381.952h-99.328c-23.552 0-43.008-19.456-43.008-43.008 0-24.576 18.432-43.008 44.032-43.008h283.648c23.552 0 43.008 19.456 43.008 43.008 0 23.552-19.456 43.008-43.008 43.008H471.04v302.08z m269.312-158.72h-43.008v157.696c0 23.552-19.456 43.008-43.008 43.008-23.552 0-43.008-19.456-43.008-43.008V525.312h-43.008c-23.552 0-43.008-19.456-43.008-43.008s19.456-43.008 43.008-43.008h169.984c23.552 0 43.008 19.456 45.056 43.008 0 24.576-19.456 43.008-43.008 43.008z" fill="currentColor"></path></svg>
                            <div class="val">0.0<span>万字</span></div>
                            <div class="label">总字数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M861.9 843.5c0 31.1-25.2 56.2-56.2 56.2H103.5l98.3-454.2c0-31 25-56.2 56.1-56.2h646.2c31 0 56.1 25.2 56.1 56.2l-98.3 398zM215.8 347.1h632v-55.2c0-31-25.2-56.2-56.2-56.2h-337v-50.9c0-31-25.2-56.2-56.2-56.2H117.6c-31 0-56.2 25.2-56.2 56.2v658.6l98.2-440.2c0-30.9 25.2-56.1 56.2-56.1z m0 0" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总打开次数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M814.62 63.87H336.11c-44.67 0-80.87 36.21-80.87 80.87v4.51h474.02c44.66 0 80.87 36.21 80.87 80.87v602.05h4.49c44.66 0 80.87-36.21 80.87-80.87V144.74c0-44.66-36.21-80.87-80.87-80.87z" fill="currentColor"></path><path d="M686.56 191.91H208.05c-44.67 0-80.87 36.21-80.87 80.87v606.56c0 44.67 36.21 80.87 80.87 80.87h478.51c44.67 0 80.87-36.21 80.87-80.87V272.79c0-44.67-36.2-80.88-80.87-80.88zM633.87 611L411.46 833.4c-11.84 11.84-31.05 11.84-42.89 0L267.48 732.31c-11.84-11.84-11.84-31.04 0-42.89s31.05-11.84 42.89 0l79.65 79.65 200.96-200.96c11.84-11.84 31.04-11.84 42.89 0 11.84 11.84 11.84 31.04 0 42.89z m-21.45-193.3h-323.5c-16.75 0-30.33-13.58-30.33-30.33s13.58-30.33 30.33-30.33h323.5c16.75 0 30.33 13.58 30.33 30.33s-13.58 30.33-30.33 30.33z" fill="currentColor"></path></svg>
                            <div class="val">0<span>本</span></div>
                            <div class="label">已读完</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M364.8 550.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4h128v-192c0-19.2 19.2-38.4 38.4-38.4s38.4 19.2 38.4 38.4V512c0 19.2-19.2 38.4-38.4 38.4h-166.4z" fill="currentColor"></path><path d="M972.8 608c-12.8 0-19.2-6.4-32-12.8-6.4-6.4-12.8-19.2-6.4-32 0-19.2 6.4-38.4 0-51.2-6.4-57.6-19.2-115.2-38.4-160-19.2-51.2-51.2-102.4-89.6-134.4-76.8-83.2-179.2-128-294.4-128S294.4 134.4 217.6 211.2c-19.2 19.2-38.4 44.8-51.2 64L236.8 256h12.8c19.2 0 32 12.8 38.4 25.6 6.4 19.2-6.4 38.4-25.6 44.8L96 377.6c-6.4 6.4-12.8 6.4-12.8 6.4-6.4 0-12.8-6.4-19.2-6.4-12.8-6.4-19.2-19.2-19.2-25.6l-32-172.8c-6.4-19.2 6.4-38.4 32-44.8h6.4c19.2 0 32 12.8 38.4 32l12.8 64C121.6 204.8 140.8 179.2 160 160c44.8-44.8 102.4-83.2 160-108.8 64-25.6 128-38.4 192-38.4 70.4 0 134.4 12.8 192 38.4s115.2 64 160 108.8c51.2 44.8 83.2 96 108.8 160s38.4 128 38.4 192c0 19.2 0 38.4-6.4 57.6 0 19.2-12.8 38.4-32 38.4zM480 1011.2s-6.4 0 0 0c-57.6-6.4-108.8-19.2-160-38.4-57.6-25.6-115.2-64-160-108.8s-83.2-96-108.8-160c-12.8-25.6-19.2-44.8-25.6-70.4 0-12.8 0-25.6 6.4-32 12.8-6.4 19.2-12.8 32-12.8 19.2 0 32 12.8 38.4 32 19.2 70.4 57.6 140.8 108.8 192 38.4 38.4 76.8 64 121.6 83.2s96 32 140.8 38.4c19.2 0 38.4 19.2 38.4 38.4 0 12.8-6.4 19.2-12.8 25.6 0 6.4-12.8 12.8-19.2 12.8z m121.6-281.6c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 140.8c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 134.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">日均时长</div>
                        </div>
                    </div>
                </div>

                <!-- 日历视图 -->
                <div class="s-card">
                    <div class="s-cal-header-row">
                        <div>周日</div><div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div>
                    </div>
                    <div class="s-calendar-grid">
                        <!-- 第一周 -->
                        <div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div>
                        <div class="s-cal-cell"><div class="s-cal-date">1</div><div class="s-cal-val">0.0h</div></div>
                        <!-- 第二周 -->
                        <div class="s-cal-cell"><div class="s-cal-date">2</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">3</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">4</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">5</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">6</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">7</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">8</div><div class="s-cal-val">0.0h</div></div>
                        <!-- 第三周 -->
                        <div class="s-cal-cell"><div class="s-cal-date">9</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">10</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">11</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">12</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">13</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">14</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">15</div><div class="s-cal-val">0.0h</div></div>
                        <!-- 第四周 -->
                        <div class="s-cal-cell"><div class="s-cal-date">16</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">17</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">18</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">19</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">20</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">21</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">22</div><div class="s-cal-val">0.0h</div></div>
                        <!-- 第五周 -->
                        <div class="s-cal-cell"><div class="s-cal-date">23</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">24</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">25</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">26</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">27</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">28</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">29</div><div class="s-cal-val">0.0h</div></div>
                        <!-- 第六周 -->
                        <div class="s-cal-cell"><div class="s-cal-date">30</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell"><div class="s-cal-date">31</div><div class="s-cal-val">0.0h</div></div>
                        <div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div><div class="s-cal-cell empty"></div>
                    </div>
                </div>

                <!-- 时间分析 -->
                <div class="s-card">
                    <div class="s-card-title-main">时间分析</div>
                    <div class="s-card-sub">阅读时间分布与趋势</div>
                    <div class="s-split-2">
                        <div>
                            <div class="val" style="color: var(--theme-blue);">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">日均时长</div>
                        </div>
                        <div class="divider"></div>
                        <div>
                            <div class="val" style="color: var(--theme-blue);">0.0</div>
                            <div class="label">日均阅读书籍</div>
                        </div>
                    </div>
                    <div class="s-time-grid">
                        <div class="s-time-card">
                            <div class="title">凌晨(0:00~6:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">上午(6:00~12:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">下午(12:00~18:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                        <div class="s-time-card">
                            <div class="title">晚上(18:00~24:00)</div>
                            <div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> N/A</div>
                            <div class="row"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0 本</div>
                            <div class="sub-title">阅读最久</div>
                            <div class="desc">N/A<br>N/A</div>
                        </div>
                    </div>
                </div>

                <!-- 活跃热力图 -->
                <div class="s-card">
                    <div class="s-card-title-main">活跃热力图</div>
                    <div class="s-card-sub">每日阅读时长分布</div>
                    
                    <div class="s-month-heatmap">
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">1</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">2</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">3</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">4</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">5</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">6</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">7</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">8</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">9</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">10</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">11</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">12</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">13</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">14</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">15</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">16</div></div>
                    </div>
                    <div class="s-month-heatmap">
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">17</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">18</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">19</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">20</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">21</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">22</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">23</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">24</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">25</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">26</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">27</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">28</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">29</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">30</div></div>
                        <div class="s-mh-col"><div class="s-mh-box"></div><div class="s-mh-label">31</div></div>
                        <div class="s-mh-col"></div>
                    </div>
                    
                    <div class="s-mh-legend">
                        <div class="s-mh-leg-item">未读</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.5;">&lt;30m</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.7;">30-60m</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.85;">1-3h</div>
                        <div class="s-mh-leg-item active">3-6h</div>
                        <div class="s-mh-leg-item active" style="background: #4a627a;">&gt;6h</div>
                    </div>
                </div>

                <!-- 行为分析 -->
                <div class="s-card">
                    <div class="s-card-title-main">行为分析</div>
                    <div class="s-card-sub">阅读习惯深度分析</div>
                    <div class="s-list-box-simple">
                        <div><div class="title">翻页之王</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">精力最集中</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">长期陪伴</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                </div>

                <!-- 书籍偏好 -->
                <div class="s-card">
                    <div class="s-card-title-main">书籍偏好</div>
                    <div class="s-card-sub">你的阅读倾向</div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue); fill: var(--theme-blue);"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                        <div><div class="title">最爱阅读</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue); fill: var(--theme-blue);"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div>
                        <div><div class="title">最常打开</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue);"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline><line x1="4" y1="22" x2="20" y2="22"></line></svg></div>
                        <div><div class="title">阅读最早的一天</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                    <div class="s-list-box-icon">
                        <div class="icon"><svg viewBox="0 0 24 24" style="stroke: var(--theme-blue);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline><line x1="4" y1="2" x2="20" y2="2"></line></svg></div>
                        <div><div class="title">阅读最晚的一天</div><div class="sub">N/A<br>N/A</div></div>
                    </div>
                </div>

                <!-- 毅力成就 -->
                <div class="s-card">
                    <div class="s-card-title-main">毅力成就</div>
                    <div class="s-card-sub">坚持就是胜利</div>
                    <div class="s-list-box-simple">
                        <div><div class="title">最长连续阅读</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                    <div class="s-list-box-simple">
                        <div><div class="title">单日最佳记录</div><div class="sub">N/A</div></div>
                        <div class="val">N/A</div>
                    </div>
                </div>

                <!-- 阅读排行 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读排行</div>
                    <div class="s-card-sub">当月阅读的所有书籍(MAX=99)</div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
            
            <!-- 年统计 -->
            <div id="readen-tab-year" class="tab-content">
                <!-- 日期选择器 -->
                <div class="s-date-selector">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span>2026年</span>
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <!-- 年度总览 -->
                <div class="s-card">
                    <div class="s-card-title-main">年度总览</div>
                    <div class="s-card-sub">核心数据一览</div>
                    <div class="s-grid-3x2">
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m191.2 604L488.8 544H480V256h64v246.4l191.2 110.4-32 55.2z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">总阅读时间</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M216.8 212.2H44c-23.8 0-43.2 20.6-43.2 46v689.4c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V258c0-25.4-19.4-45.8-43.2-45.8z m-43.2 126.4H87.2c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23 0 12.6-9.8 23-21.6 23z m618.6-135.4l-163.8 44.6c-22.6 6.2-35.6 31-29.2 55.6l176.2 665.8c6.4 24.6 30 39.4 52.8 33.2L992 957.8c22.6-6.2 35.6-31 29.2-55.6L845 236.4c-6.6-24.6-30.2-39.4-52.8-33.2z m-8.6 133.2l-82 22.2c-11.4 3-23.2-4.4-26.4-16.6-3.2-12.2 3.2-24.6 14.6-27.8l82-22.2c11.4-3 23.2 4.4 26.4 16.6 3.2 12.2-3.4 24.8-14.6 27.8z m-261-308.2H349.8c-23.8 0-43.2 20.6-43.2 46v873.2c0 25.4 19.4 46 43.2 46h172.8c23.8 0 43.2-20.6 43.2-46V74.2c0-25.4-19.2-46-43.2-46z m-43.2 126.4H393c-12 0-21.6-10.2-21.6-23 0-12.6 9.6-23 21.6-23h86.4c12 0 21.6 10.2 21.6 23s-9.6 23-21.6 23z" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总书籍数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M733.184 0H289.792C131.072 0 0 131.072 0 289.792v443.392C0 892.928 130.048 1024 289.792 1024h443.392c159.744 0 290.816-131.072 289.792-289.792V289.792C1022.976 131.072 892.928 0 733.184 0zM471.04 684.032c0 23.552-19.456 43.008-43.008 43.008s-43.008-19.456-43.008-43.008V381.952h-99.328c-23.552 0-43.008-19.456-43.008-43.008 0-24.576 18.432-43.008 44.032-43.008h283.648c23.552 0 43.008 19.456 43.008 43.008 0 23.552-19.456 43.008-43.008 43.008H471.04v302.08z m269.312-158.72h-43.008v157.696c0 23.552-19.456 43.008-43.008 43.008-23.552 0-43.008-19.456-43.008-43.008V525.312h-43.008c-23.552 0-43.008-19.456-43.008-43.008s19.456-43.008 43.008-43.008h169.984c23.552 0 43.008 19.456 45.056 43.008 0 24.576-19.456 43.008-43.008 43.008z" fill="currentColor"></path></svg>
                            <div class="val">0.0<span>万字</span></div>
                            <div class="label">总字数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M861.9 843.5c0 31.1-25.2 56.2-56.2 56.2H103.5l98.3-454.2c0-31 25-56.2 56.1-56.2h646.2c31 0 56.1 25.2 56.1 56.2l-98.3 398zM215.8 347.1h632v-55.2c0-31-25.2-56.2-56.2-56.2h-337v-50.9c0-31-25.2-56.2-56.2-56.2H117.6c-31 0-56.2 25.2-56.2 56.2v658.6l98.2-440.2c0-30.9 25.2-56.1 56.2-56.1z m0 0" fill="currentColor"></path></svg>
                            <div class="val">0</div>
                            <div class="label">总打开次数</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M814.62 63.87H336.11c-44.67 0-80.87 36.21-80.87 80.87v4.51h474.02c44.66 0 80.87 36.21 80.87 80.87v602.05h4.49c44.66 0 80.87-36.21 80.87-80.87V144.74c0-44.66-36.21-80.87-80.87-80.87z" fill="currentColor"></path><path d="M686.56 191.91H208.05c-44.67 0-80.87 36.21-80.87 80.87v606.56c0 44.67 36.21 80.87 80.87 80.87h478.51c44.67 0 80.87-36.21 80.87-80.87V272.79c0-44.67-36.2-80.88-80.87-80.88zM633.87 611L411.46 833.4c-11.84 11.84-31.05 11.84-42.89 0L267.48 732.31c-11.84-11.84-11.84-31.04 0-42.89s31.05-11.84 42.89 0l79.65 79.65 200.96-200.96c11.84-11.84 31.04-11.84 42.89 0 11.84 11.84 11.84 31.04 0 42.89z m-21.45-193.3h-323.5c-16.75 0-30.33-13.58-30.33-30.33s13.58-30.33 30.33-30.33h323.5c16.75 0 30.33 13.58 30.33 30.33s-13.58 30.33-30.33 30.33z" fill="currentColor"></path></svg>
                            <div class="val">0<span>本</span></div>
                            <div class="label">已读完</div>
                        </div>
                        <div class="s-grid-item">
                            <svg viewBox="0 0 1024 1024" style="color: #888888; fill: currentColor; stroke: none;"><path d="M364.8 550.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4h128v-192c0-19.2 19.2-38.4 38.4-38.4s38.4 19.2 38.4 38.4V512c0 19.2-19.2 38.4-38.4 38.4h-166.4z" fill="currentColor"></path><path d="M972.8 608c-12.8 0-19.2-6.4-32-12.8-6.4-6.4-12.8-19.2-6.4-32 0-19.2 6.4-38.4 0-51.2-6.4-57.6-19.2-115.2-38.4-160-19.2-51.2-51.2-102.4-89.6-134.4-76.8-83.2-179.2-128-294.4-128S294.4 134.4 217.6 211.2c-19.2 19.2-38.4 44.8-51.2 64L236.8 256h12.8c19.2 0 32 12.8 38.4 25.6 6.4 19.2-6.4 38.4-25.6 44.8L96 377.6c-6.4 6.4-12.8 6.4-12.8 6.4-6.4 0-12.8-6.4-19.2-6.4-12.8-6.4-19.2-19.2-19.2-25.6l-32-172.8c-6.4-19.2 6.4-38.4 32-44.8h6.4c19.2 0 32 12.8 38.4 32l12.8 64C121.6 204.8 140.8 179.2 160 160c44.8-44.8 102.4-83.2 160-108.8 64-25.6 128-38.4 192-38.4 70.4 0 134.4 12.8 192 38.4s115.2 64 160 108.8c51.2 44.8 83.2 96 108.8 160s38.4 128 38.4 192c0 19.2 0 38.4-6.4 57.6 0 19.2-12.8 38.4-32 38.4zM480 1011.2s-6.4 0 0 0c-57.6-6.4-108.8-19.2-160-38.4-57.6-25.6-115.2-64-160-108.8s-83.2-96-108.8-160c-12.8-25.6-19.2-44.8-25.6-70.4 0-12.8 0-25.6 6.4-32 12.8-6.4 19.2-12.8 32-12.8 19.2 0 32 12.8 38.4 32 19.2 70.4 57.6 140.8 108.8 192 38.4 38.4 76.8 64 121.6 83.2s96 32 140.8 38.4c19.2 0 38.4 19.2 38.4 38.4 0 12.8-6.4 19.2-12.8 25.6 0 6.4-12.8 12.8-19.2 12.8z m121.6-281.6c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 140.8c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z m0 134.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4H960c19.2 0 38.4 19.2 38.4 38.4s-19.2 38.4-38.4 38.4H601.6z" fill="currentColor"></path></svg>
                            <div class="val">0<span>分</span> 0<span>秒</span></div>
                            <div class="label">日均时长</div>
                        </div>
                    </div>
                </div>

                <!-- 年度热力图 -->
                <div class="s-card">
                    <div class="s-card-title-main">年度热力图</div>
                    <div class="s-card-sub">每日阅读时长分布</div>
                    <div class="s-year-heatmap-wrap">
                        <div class="s-year-months">
                            <div class="s-year-month-label">1</div><div class="s-year-month-label">2</div><div class="s-year-month-label">3</div><div class="s-year-month-label">4</div>
                            <div class="s-year-month-label">5</div><div class="s-year-month-label">6</div><div class="s-year-month-label">7</div><div class="s-year-month-label">8</div>
                            <div class="s-year-month-label">9</div><div class="s-year-month-label">10</div><div class="s-year-month-label">11</div><div class="s-year-month-label">12</div>
                        </div>
                        <div class="s-year-grid">
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                            <div class="s-year-row"><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div><div class="s-year-cell"></div></div>
                        </div>
                    </div>
                    <div class="s-mh-legend">
                        <div class="s-mh-leg-item">未读</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.5;">&lt;30m</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.7;">30-60m</div>
                        <div class="s-mh-leg-item active" style="opacity: 0.85;">1-3h</div>
                        <div class="s-mh-leg-item active">3-6h</div>
                        <div class="s-mh-leg-item active" style="background: #1a1a1a;">&gt;6h</div>
                    </div>
                </div>

                <!-- 阅读习惯 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读习惯</div>
                    <div class="s-card-sub">深入了解你的阅读模式</div>
                    <div class="s-habit-grid">
                        <div class="s-habit-item">
                            <div class="s-habit-icon"><svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></div>
                            <div class="s-habit-val">0 天</div>
                            <div class="s-habit-label">沉浸式阅读</div>
                        </div>
                        <div class="s-habit-item">
                            <div class="s-habit-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
                            <div class="s-habit-val">0 天</div>
                            <div class="s-habit-label">碎片化阅读</div>
                        </div>
                        <div class="s-habit-item">
                            <div class="s-habit-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                            <div class="s-habit-val">周一</div>
                            <div class="s-habit-label">最活跃日</div>
                        </div>
                        <div class="s-habit-item">
                            <div class="s-habit-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                            <div class="s-habit-val">0 天</div>
                            <div class="s-habit-label">最长连续阅读</div>
                        </div>
                    </div>
                </div>

                <!-- 月度最爱 -->
                <div class="s-card">
                    <div class="s-card-title-main">月度最爱</div>
                    <div class="s-card-sub">每个月阅读时间最长的书籍</div>
                    <div class="s-month-fav-grid">
                        <div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div>
                        <div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div><div class="s-month-fav-item"></div>
                    </div>
                </div>

                <!-- 阅读时间分布 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读时间分布</div>
                    <div class="s-card-sub">24小时阅读习惯一览</div>
                    <div style="height: 120px;"></div>
                    <div class="chart-x-axis">
                        <span>0</span><span>3</span><span>6</span><span>9</span><span>12</span><span>15</span><span>18</span><span>21</span>
                    </div>
                </div>

                <!-- 年度记录 -->
                <div class="s-card">
                    <div class="s-card-title-main">年度记录</div>
                    <div class="s-card-sub">值得纪念的阅读瞬间</div>
                    <div class="s-record-card">
                        <div class="s-record-info">
                            <div class="title">最能读的一天</div>
                            <div class="sub">null</div>
                        </div>
                        <div class="s-record-val">0 分 0 秒</div>
                    </div>
                    <div class="s-record-card">
                        <div class="s-record-info">
                            <div class="title">最善变的一天</div>
                            <div class="sub">null</div>
                        </div>
                        <div class="s-record-val">0 文件</div>
                    </div>
                </div>

                <!-- 阅读排行 -->
                <div class="s-card">
                    <div class="s-card-title-main">阅读排行</div>
                    <div class="s-card-sub">当年阅读的所有书籍(MAX=999)</div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
        </div>
    </div>
`;
// =========================================================================
// 阅读 APP 核心逻辑 (js/readen-app.js) - 第 2 部分 (2/4)
// =========================================================================

    const htmlTemplatePart2 = `
    <!-- ================= 我的 (Profile) 全新重构 ================= -->
    <div id="readen-page-profile" class="page active">
        <header>
            <div class="header-title">我的</div>
            <div class="header-right" id="readen-profile-edit-shortcut" role="button" tabindex="0" aria-label="编辑个人资料">
                <!-- 带圆圈的三个点图标 -->
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
                    <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/>
                    <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/>
                </svg>
            </div>
        </header>

        <!-- 用户信息区 -->
        <div class="my-user-info" id="readen-profile-entry">
            <div class="my-avatar-wrap">
                <div class="my-avatar"></div>
            </div>
            <div>
                <div class="my-name-row">
                    <span class="my-name">小岛梨花</span>
                </div>
                <div class="my-sign">遇你如春水映梨花</div>
            </div>
        </div>

        <!-- 同步/笔记 双卡片 -->
        <div class="my-action-cards">
            <div class="my-action-card" id="readen-profile-sync-card">
                <div class="my-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Cloud-Data-Transfer--Streamline-Core" height="14" width="14">
                      <desc>Cloud Data Transfer Streamline Icon: https://streamlinehq.com</desc>
                      <g id="cloud-data-transfer--cloud-data-transfer-internet-server-network">
                        <path id="Vector" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M3.98352 8.84752 5.95185 7.1084v5.2174" stroke-width="1"></path>
                        <path id="Vector_2" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m10.0165 10.5866 -1.96828 1.7392V7.1084" stroke-width="1"></path>
                        <path id="Vector_3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M3.91966 10.8422c-0.84483 0.0567 -1.67758 -0.2245 -2.31508 -0.7817C0.967092 9.5032 0.577086 8.71551 0.520362 7.87068 0.463638 7.02585 0.744843 6.1931 1.30212 5.5556c0.27593 -0.31565 0.61133 -0.57386 0.98706 -0.7599 0.37572 -0.18603 0.78441 -0.29623 1.20272 -0.32432 0.04342 0.00095 0.08619 -0.01054 0.12329 -0.03312 0.03709 -0.02258 0.06695 -0.0553 0.08604 -0.0943 0.28857 -0.83636 0.85515 -1.54852 1.60524 -2.01771 0.7501 -0.46919 1.63837 -0.66705 2.51669 -0.56059s1.69359 0.51082 2.30984 1.14563c0.6163 0.63481 0.9963 1.46171 1.0767 2.34279 0.0067 0.0464 0.0266 0.0899 0.0572 0.12538 0.0307 0.03547 0.0708 0.06145 0.1157 0.07485 0.6504 0.15322 1.222 0.53959 1.6066 1.08595 0.3846 0.54636 0.5555 1.21479 0.4804 1.8787 -0.0752 0.66392 -0.3912 1.27723 -0.8881 1.72384 -0.2093 0.188 -0.4446 0.341 -0.6967 0.4555" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div>
                    <div class="my-action-title">系统备份</div>
                    <div class="my-action-sub">使用系统备份管理</div>
                </div>
            </div>
            <div class="my-action-card" id="readen-profile-notes-card">
                <div class="my-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Notes-Tasks--Streamline-Ultimate" height="24" width="24">
                      <desc>Notes Tasks Streamline Icon: https://streamlinehq.com</desc>
                      <g id="Notes-Tasks--Streamline-Ultimate.svg">
                        <path d="M6.47 11a0.75 0.75 0 0 0 0 1.06 0.75 0.75 0 0 0 1.06 0l1 -1a0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0 0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0l1 -1A0.75 0.75 0 0 0 16.47 9l-1 1a0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0 0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M11.47 15a0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0l-1 1a0.75 0.75 0 0 0 0 1.06 0.75 0.75 0 0 0 1.06 0l1 -1a0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0 0.64 0.64 0 0 1 0.47 -0.19 0.75 0.75 0 0 0 0 -1.5 2.14 2.14 0 0 0 -1.53 0.63Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M10 6.5h4a1 1 0 0 0 1 -1V3A3 3 0 0 0 13.82 0.62 3 3 0 0 0 9 3.09V5.5a1 1 0 0 0 1 1Zm1.25 -3.75a0.75 0.75 0 1 1 0.75 0.75 0.76 0.76 0 0 1 -0.75 -0.75Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M19.5 3h-2.75a0.25 0.25 0 0 0 -0.25 0.25v1.5a0.25 0.25 0 0 0 0.25 0.25H19a0.5 0.5 0 0 1 0.5 0.5v12.84a0.47 0.47 0 0 1 -0.15 0.35l-3.16 3.16a0.47 0.47 0 0 1 -0.35 0.15H5a0.5 0.5 0 0 1 -0.5 -0.5v-16A0.5 0.5 0 0 1 5 5h2.25a0.25 0.25 0 0 0 0.25 -0.25v-1.5A0.25 0.25 0 0 0 7.25 3H4.5a2 2 0 0 0 -2 2v17a2 2 0 0 0 2 2h15a2 2 0 0 0 2 -2V5a2 2 0 0 0 -2 -2Z" fill="currentColor" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div>
                    <div class="my-action-title">笔记</div>
                    <div class="my-action-sub">1 条</div>
                </div>
            </div>
        </div>

        <!-- 数据管理分组 -->
        <div class="my-group-title">数据管理</div>
        <div class="my-list-group">
            <div class="my-list-item" id="readen-profile-data-notes">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Notes-Tasks--Streamline-Ultimate" height="24" width="24">
                      <desc>Notes Tasks Streamline Icon: https://streamlinehq.com</desc>
                      <g id="Notes-Tasks--Streamline-Ultimate.svg">
                        <path d="M6.47 11a0.75 0.75 0 0 0 0 1.06 0.75 0.75 0 0 0 1.06 0l1 -1a0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0 0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0l1 -1A0.75 0.75 0 0 0 16.47 9l-1 1a0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0 0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M11.47 15a0.68 0.68 0 0 1 -0.94 0 2.21 2.21 0 0 0 -3.06 0l-1 1a0.75 0.75 0 0 0 0 1.06 0.75 0.75 0 0 0 1.06 0l1 -1a0.68 0.68 0 0 1 0.94 0 2.21 2.21 0 0 0 3.06 0 0.64 0.64 0 0 1 0.47 -0.19 0.75 0.75 0 0 0 0 -1.5 2.14 2.14 0 0 0 -1.53 0.63Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M10 6.5h4a1 1 0 0 0 1 -1V3A3 3 0 0 0 13.82 0.62 3 3 0 0 0 9 3.09V5.5a1 1 0 0 0 1 1Zm1.25 -3.75a0.75 0.75 0 1 1 0.75 0.75 0.76 0.76 0 0 1 -0.75 -0.75Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M19.5 3h-2.75a0.25 0.25 0 0 0 -0.25 0.25v1.5a0.25 0.25 0 0 0 0.25 0.25H19a0.5 0.5 0 0 1 0.5 0.5v12.84a0.47 0.47 0 0 1 -0.15 0.35l-3.16 3.16a0.47 0.47 0 0 1 -0.35 0.15H5a0.5 0.5 0 0 1 -0.5 -0.5v-16A0.5 0.5 0 0 1 5 5h2.25a0.25 0.25 0 0 0 0.25 -0.25v-1.5A0.25 0.25 0 0 0 7.25 3H4.5a2 2 0 0 0 -2 2v17a2 2 0 0 0 2 2h15a2 2 0 0 0 2 -2V5a2 2 0 0 0 -2 -2Z" fill="currentColor" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div class="my-item-name">笔记</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item" id="readen-profile-data-roles">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Content-Paper-Edit--Streamline-Ultimate" height="24" width="24">
                      <desc>Content Paper Edit Streamline Icon: https://streamlinehq.com</desc>
                      <g id="Content-Paper-Edit--Streamline-Ultimate.svg">
                        <path d="M12.75 5h-6a0.75 0.75 0 0 0 0 1.5h6a0.75 0.75 0 0 0 0 -1.5Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M13.5 9.25a0.76 0.76 0 0 0 -0.75 -0.75h-8a0.75 0.75 0 0 0 0 1.5h8a0.76 0.76 0 0 0 0.75 -0.75Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M4.75 12a0.75 0.75 0 0 0 0 1.5h5.5a0.75 0.75 0 0 0 0 -1.5Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M11.3 17.65a0.25 0.25 0 0 0 -0.23 -0.15H2.5A0.5 0.5 0 0 1 2 17V2.5a0.5 0.5 0 0 1 0.5 -0.5h13a0.5 0.5 0 0 1 0.5 0.5v10.07a0.25 0.25 0 0 0 0.15 0.23 0.26 0.26 0 0 0 0.28 -0.05l1.28 -1.28a1.05 1.05 0 0 0 0.29 -0.71V2a2 2 0 0 0 -2 -2H2a2 2 0 0 0 -2 2v15.5a2 2 0 0 0 2 2h7.87a0.5 0.5 0 0 0 0.48 -0.35 1.86 1.86 0 0 1 0.5 -0.82l0.4 -0.4a0.26 0.26 0 0 0 0.05 -0.28Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M12.06 20.13a0.25 0.25 0 0 0 -0.42 0.13L11 23.4a0.51 0.51 0 0 0 0.14 0.45 0.47 0.47 0 0 0 0.35 0.15h0.1l3.14 -0.63a0.24 0.24 0 0 0 0.19 -0.17 0.23 0.23 0 0 0 -0.06 -0.25Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M23.23 11.77a2.61 2.61 0 0 0 -3.7 0L13 18.27a0.48 0.48 0 0 0 0 0.7l3 3a0.48 0.48 0 0 0 0.7 0l6.51 -6.5a2.61 2.61 0 0 0 0.02 -3.7Z" fill="currentColor" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div class="my-item-name">角色批注</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item" id="readen-profile-data-groups">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000000" id="Bookmarks--Streamline-Phosphor" height="16" width="16">
  <desc>
    Bookmarks Streamline Icon: https://streamlinehq.com
  </desc>
  <path d="M12.8246125 0.16H5.58769375c-0.6661375 0 -1.20615 0.5400125 -1.20615 1.20615v1.20615625H3.1753875c-0.6661375 0 -1.20615 0.5400125 -1.20615 1.20615v11.45845c-0.0000125 0.46425 0.50254375 0.75441875 0.9046 0.5223 0.0168375 -0.00971875 0.03319375 -0.02024375 0.0490125 -0.03155l3.871 -2.7651 3.87174375 2.7651c0.3781875 0.26926875 0.9060375 0.0281625 0.9501375 -0.4339875 0.0018 -0.01886875 0.0027125 -0.0378125 0.002725 -0.0567625v-2.96336875l1.45869375 1.04181875c0.37776875 0.26984375 0.9059875 0.02954375 0.9508 -0.43253125 0.001875 -0.01935625 0.0028125 -0.03878125 0.0028125 -0.058225V1.36615c0 -0.6661375 -0.5400125 -1.20615 -1.20615 -1.20615Zm-2.41230625 13.90543125 -3.268675 -2.33691875c-0.20969375 -0.1497875 -0.4913875 -0.1497875 -0.701075 0l-3.26716875 2.3361625V3.77845625h7.23691875Zm2.41230625 -2.41230625 -1.20615625 -0.86390625V3.77845625c0 -0.6661375 -0.5400125 -1.20615 -1.20615 -1.20615H5.58769375V1.36615h7.23691875Z" stroke-width="0.0625"></path>
</svg>
                </div>
                <div class="my-item-name">分类管理</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item" id="readen-menu-cover-gallery-2">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Image--Streamline-Font-Awesome" height="16" width="16">
                      <desc>Image Streamline Icon: https://streamlinehq.com</desc>
                      <path d="M14 2.5c0.275 0 0.5 0.225 0.5 0.5v9.99375l-0.15625 -0.203125 -4.25 -5.5c-0.140625 -0.184375 -0.3625 -0.290625 -0.59375 -0.290625s-0.45 0.10625 -0.59375 0.290625l-2.59375 3.35625 -0.953125 -1.334375c-0.140625 -0.196875 -0.365625 -0.3125 -0.609375 -0.3125s-0.46875 0.115625 -0.609375 0.315625l-2.5 3.5 -0.140625 0.19375 0 -0.009375V3c0 -0.275 0.225 -0.5 0.5 -0.5h12zM2 1C0.896875 1 0 1.896875 0 3v10c0 1.103125 0.896875 2 2 2h12c1.103125 0 2 -0.896875 2 -2V3c0 -1.103125 -0.896875 -2 -2 -2H2zm2.5 6a1.5 1.5 0 1 0 0 -3 1.5 1.5 0 1 0 0 3z" fill="currentColor" stroke-width="0.0313"></path>
                    </svg>
                </div>
                <div class="my-item-name">封面图集</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
        </div>

        <!-- 阅读与外观分组 -->
        <div class="my-group-title">阅读与外观</div>
        <div class="my-list-group">
            <div class="my-list-item">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Headphones-Round-Sound--Streamline-Solar" height="24" width="24">
                      <desc>Headphones Round Sound Streamline Icon: https://streamlinehq.com</desc>
                      <g id="Bold Duotone/Electronic Devices/Headphones Round Sound">
                        <path id="Vector" fill="#000000" d="M2 12.124C2 6.53269 6.47713 2 11.9999 2c5.5229 0 10 4.53269 10 10.124v5.2435c0.0003 0.8169 0.0005 1.3771 -0.1431 1.8689 -0.2808 0.9618 -0.9522 1.7573 -1.8468 2.1881 -0.4575 0.2204 -1.0041 0.3075 -1.8012 0.4346l-0.1299 0.0208c-0.2835 0.0453 -0.5257 0.084 -0.7267 0.104 -0.2091 0.0208 -0.4223 0.0272 -0.6404 -0.0163 -0.7176 -0.1431 -1.3094 -0.655 -1.561 -1.3504 -0.0764 -0.2113 -0.1034 -0.4256 -0.1158 -0.6379 -0.0118 -0.204 -0.0118 -0.4523 -0.0118 -0.7428l-0.0001 -4.1724c-0.0005 -0.4255 -0.0009 -0.7916 0.0964 -1.1051 0.2227 -0.7174 0.8043 -1.2615 1.5282 -1.4298 0.3164 -0.0736 0.6769 -0.0443 1.0958 -0.0103l0.0932 0.0075 0.1098 0.0088c0.7837 0.0623 1.3199 0.105 1.7751 0.2754 0.3199 0.1198 0.6165 0.2847 0.883 0.487V12.124c0 -4.81112 -3.8525 -8.71134 -8.6047 -8.71134 -4.75214 0 -8.60456 3.90022 -8.60456 8.71134v1.1736c0.26642 -0.2023 0.56309 -0.3672 0.88295 -0.487 0.45516 -0.1704 0.99136 -0.2131 1.77506 -0.2754l0.10983 -0.0088 0.09323 -0.0075c0.41893 -0.034 0.7794 -0.0633 1.09583 0.0103 0.72388 0.1683 1.30542 0.7124 1.52815 1.4298 0.09735 0.3135 0.09691 0.6796 0.09639 1.1051l-0.00007 4.1724c0 0.2905 0.00001 0.5388 -0.01184 0.7428 -0.01233 0.2123 -0.03937 0.4266 -0.11581 0.6379 -0.25152 0.6954 -0.84332 1.2073 -1.56094 1.3504 -0.21811 0.0435 -0.43137 0.0371 -0.64044 0.0163 -0.20097 -0.02 -0.44319 -0.0587 -0.72666 -0.104l-0.12996 -0.0208c-0.79707 -0.1271 -1.34369 -0.2142 -1.80115 -0.4346 -0.89457 -0.4308 -1.56603 -1.2263 -1.84683 -2.1881 -0.11841 -0.4055 -0.13904 -0.8576 -0.14248 -1.4617L2 17.5803V12.124Z" stroke-width="1"></path>
                        <g id="Group">
                          <path id="Vector_2" fill="#737374" fill-rule="evenodd" d="M12 5.75c0.4142 0 0.75 0.33579 0.75 0.75v5c0 0.4142 -0.3358 0.75 -0.75 0.75s-0.75 -0.3358 -0.75 -0.75v-5c0 -0.41421 0.3358 -0.75 0.75 -0.75Z" clip-rule="evenodd" stroke-width="1"></path>
                          <path id="Vector_3" fill="#737374" fill-rule="evenodd" d="M15 7.25c0.4142 0 0.75 0.33579 0.75 0.75v2c0 0.4142 -0.3358 0.75 -0.75 0.75s-0.75 -0.3358 -0.75 -0.75V8c0 -0.41421 0.3358 -0.75 0.75 -0.75Z" clip-rule="evenodd" stroke-width="1"></path>
                          <path id="Vector_4" fill="#737374" fill-rule="evenodd" d="M9 7.25c0.41421 0 0.75 0.33579 0.75 0.75v2c0 0.4142 -0.33579 0.75 -0.75 0.75s-0.75 -0.3358 -0.75 -0.75V8c0 -0.41421 0.33579 -0.75 0.75 -0.75Z" clip-rule="evenodd" stroke-width="1"></path>
                        </g>
                      </g>
                    </svg>
                </div>
                <div class="my-item-name">语音朗读</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Manual-Book--Streamline-Core" height="14" width="14">
                      <desc>Manual Book Streamline Icon: https://streamlinehq.com</desc>
                      <g id="manual-book">
                        <path id="vector" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M5.5 4.05371c0 -0.29667 0.08797 -0.58668 0.2528 -0.83335 0.16482 -0.24668 0.39909 -0.43894 0.67317 -0.55247 0.27409 -0.11353 0.57569 -0.14323 0.86667 -0.08536 0.29097 0.05788 0.55824 0.20074 0.76802 0.41052 0.20978 0.20978 0.35264 0.47705 0.41052 0.76803 0.05788 0.29097 0.02817 0.59257 -0.08536 0.86666 -0.11353 0.27409 -0.30579 0.50835 -0.55246 0.67318 -0.24668 0.16482 -0.53669 0.25279 -0.83336 0.25279v0.5" stroke-width="1"></path>
                        <g id="Group 14">
                          <path id="vector_2" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M7 8.11621c-0.13807 0 -0.25 -0.11193 -0.25 -0.25s0.11193 -0.25 0.25 -0.25" stroke-width="1"></path>
                          <path id="vector_3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M7 8.11621c0.13807 0 0.25 -0.11193 0.25 -0.25s-0.11193 -0.25 -0.25 -0.25" stroke-width="1"></path>
                        </g>
                        <path id="vector_4" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M12.5 13.5H3c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C1.65804 12.7794 1.5 12.3978 1.5 12c0 -0.3978 0.15804 -0.7794 0.43934 -1.0607S2.60218 10.5 3 10.5h8.5c0.2652 0 0.5196 -0.1054 0.7071 -0.2929S12.5 9.76522 12.5 9.5v-8c0 -0.26522 -0.1054 -0.51957 -0.2929 -0.707107C12.0196 0.605357 11.7652 0.5 11.5 0.5H3c-0.39099 -0.000139 -0.76658 0.152394 -1.04676 0.425105C1.67305 1.19782 1.51043 1.56915 1.5 1.96v10" stroke-width="1"></path>
                        <path id="vector_5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M11.5 10.5v3" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
                <div class="my-item-name">阅读设置</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item" id="readen-menu-font-manager">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                      <path fill="#000000" d="M15 2c0.2652 0 0.5195 0.10543 0.707 0.29297 0.1876 0.18754 0.293 0.44181 0.293 0.70703v3h-2V4H9v16h3v2H4v-2h3V4H2v2H0V3c0 -0.26522 0.105432 -0.51949 0.292969 -0.70703C0.480505 2.10543 0.734784 2 1 2zm8 6c0.2652 0 0.5195 0.10543 0.707 0.29297 0.1876 0.18753 0.293 0.44181 0.293 0.70703v3h-2v-2h-2v10h2v2h-6v-2h2V10h-2v2h-2V9c0 -0.26522 0.1054 -0.5195 0.293 -0.70703C14.4805 8.10543 14.7348 8 15 8z" stroke-width="1"></path>
                    </svg>
                </div>
                <div class="my-item-name">字体与背景</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            <div class="my-list-item">
                <div class="my-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                      <path fill="#000000" fill-rule="evenodd" d="M10.9496 0.0520099c2.9016 -0.2703839 5.8029 0.5197471 8.167 2.2236301 2.3643 1.70409 4.0314 4.20746 4.6924 7.0459 0.1023 0.4401 0.1041 0.89806 0.0049 1.33886 -0.0993 0.4407 -0.2972 0.8534 -0.5782 1.207 -0.281 0.3537 -0.638 0.6397 -1.0449 0.836 -0.4068 0.1962 -0.853 0.298 -1.3047 0.2978h-3.0937c-0.6668 -0.0132 -1.3141 0.2266 -1.8106 0.6719 -0.4937 0.443 -0.8019 1.0565 -0.8632 1.7168 -0.0205 0.458 0.0857 0.9133 0.3066 1.3154 0.2245 0.4085 0.5586 0.746 0.9648 0.9746 0.0129 0.0073 0.0256 0.0157 0.0381 0.0235 0.5348 0.3327 0.961 0.8142 1.2256 1.3857 0.2645 0.5715 0.356 1.2081 0.2637 1.8311 -0.0924 0.6229 -0.3643 1.2056 -0.7832 1.6758 -0.419 0.4702 -0.9669 0.8073 -1.5752 0.9707l-0.0059 0.0019c-1.1239 0.2941 -2.2816 0.4396 -3.4433 0.4326h-0.002v-0.0009c-1.6142 -0.0077 -3.21081 -0.3391 -4.69432 -0.9756 -1.48387 -0.6368 -2.82439 -1.5654 -3.94238 -2.7305 -1.11801 -1.1651 -1.99045 -2.5429 -2.56543 -4.0518 -0.574984 -1.509 -0.8414359 -3.1186 -0.782227 -4.7324l0.000977 -0.0117C0.266258 8.61495 1.4339 5.87701 3.41641 3.77857 5.39883 1.68025 8.06547 0.359329 10.9359 0.053963zM17.9477 3.89869c-1.969 -1.4192 -4.3851 -2.07903 -6.8018 -1.85645 -2.39571 0.25524 -4.62178 1.35805 -6.27636 3.10938 -1.65181 1.74843 -2.62661 4.02872 -2.74805 6.43068l0.00098 0.001c-0.04938 1.3459 0.17182 2.6887 0.65136 3.9472 0.47949 1.2583 1.20738 2.4073 2.13965 3.3789 0.93249 0.9718 2.05138 1.7463 3.28906 2.2774 1.23764 0.531 2.56926 0.8083 3.91606 0.8144h0.0019c0.9851 0.006 1.9667 -0.1174 2.9199 -0.3662 0.2318 -0.0622 0.441 -0.1909 0.6006 -0.3701 0.1594 -0.179 0.2627 -0.4007 0.2979 -0.6377 0.0351 -0.2374 0.0002 -0.4805 -0.1006 -0.6982s-0.2631 -0.4017 -0.4668 -0.5284v-0.0009c-0.7141 -0.4112 -1.3032 -1.0088 -1.7002 -1.7315 -0.4042 -0.7359 -0.5941 -1.5707 -0.5488 -2.4092 0.0006 -0.0114 0.0019 -0.0228 0.0029 -0.0341 0.1035 -1.1694 0.6468 -2.2561 1.5205 -3.0401 0.8688 -0.7794 1.9995 -1.2017 3.166 -1.1836h3.0742c0.1507 0.0001 0.2999 -0.0341 0.4356 -0.0996 0.1356 -0.0654 0.255 -0.1604 0.3486 -0.2783 0.0936 -0.1178 0.1593 -0.2555 0.1924 -0.4023 0.0248 -0.1104 0.0306 -0.22418 0.0176 -0.33598l-0.0196 -0.11035c-0.5513 -2.3673 -1.9413 -4.45466 -3.913 -5.87598M7.61368 13.0012c1.38071 0 2.50002 1.1193 2.50002 2.5 -0.0002 1.3806 -1.11939 2.5 -2.50002 2.5 -1.38046 -0.0002 -2.49987 -1.1195 -2.5 -2.5 0 -1.3806 1.11946 -2.4998 2.5 -2.5m0.5 -6.99997c1.10457 0 2.00002 0.89543 2.00002 2 -0.0002 1.10446 -0.89553 1.99997 -2.00002 1.99997 -1.10431 -0.0002 -1.99987 -0.89564 -2 -1.99997 0 -1.10444 0.8956 -1.99979 2 -2m5.50002 -2c0.8284 0 1.5 0.67157 1.5 1.5 -0.0002 0.82831 -0.6717 1.5 -1.5 1.5 -0.8282 -0.00021 -1.4999 -0.67181 -1.5 -1.5 0 -0.8283 0.6717 -1.49979 1.5 -1.5" clip-rule="evenodd" stroke-width="1"></path>
                    </svg>
                </div>
                <div class="my-item-name">应用外观</div>
                <div class="my-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
        </div>
    </div>

    <!-- 字体管理页面 (从右侧滑出) -->
    <div class="sub-page" id="readen-page-font-manager" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-font-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title" id="readen-fb-header-title">字体管理 (0)</div>
            <button type="button" class="readen-fb-manage-trigger" id="readen-fb-manage-trigger">管理</button>
        </div>
        
        <div class="fb-tabs">
            <div class="fb-tab active" id="readen-tab-btn-font">字体管理</div>
            <div class="fb-tab" id="readen-tab-btn-bg">背景管理</div>
        </div>

        <div class="cg-content" style="padding: 0 16px; padding-bottom: 80px;">
            <!-- 字体面板 -->
            <div id="readen-fb-panel-font" style="display: block;">
                <div class="my-list-group" style="margin: 0; border: none; background: transparent;" id="readen-font-list-container">
                    <!-- 动态渲染字体列表 -->
                </div>
                <div id="readen-font-empty-state" class="fb-empty" style="display: none;">
                    <div class="fb-empty-text">暂时没有字体</div>
                    <div class="fb-empty-btn" id="readen-font-local-btn">本地导入</div>
                    <div class="fb-empty-btn-outline" id="readen-font-url-btn">URL导入</div>
                </div>
                <input type="file" id="readen-custom-font-input" accept=".ttf,.otf,.woff,.woff2" style="display: none;">
            </div>

            <!-- 背景面板 -->
            <div id="readen-fb-panel-bg" style="display: none;">
                <div class="my-list-group" style="margin: 0; border: none; background: transparent;" id="readen-bg-list-container">
                    <!-- 动态渲染背景列表 -->
                </div>
                <div id="readen-bg-empty-state" class="fb-empty" style="display: none;">
                    <div class="fb-empty-text">暂时没有背景</div>
                    <div class="fb-empty-btn" id="readen-bg-local-btn">本地导入</div>
                </div>
                <input type="file" id="readen-custom-bg-input" accept="image/*" style="display: none;">
            </div>
        </div>
        
        <!-- 底部操作栏 (当列表不为空时显示) -->
        <div class="fb-bottom-bar" id="readen-fb-bottom-bar" style="display: none;">
            <!-- 动态渲染底部按钮 -->
        </div>
    </div>

    <!-- 个人资料编辑页面 -->
    <div class="sub-page" id="readen-page-profile-editor" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-profile-editor-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title">个人资料</div>
            <button type="button" class="sub-header-action" id="readen-profile-editor-save-btn" aria-label="保存个人资料">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
        </div>
        <div class="cg-content">
            <div class="readen-profile-editor">
                <button type="button" class="readen-profile-avatar-picker" id="readen-profile-avatar-picker">
                    <div class="readen-profile-avatar-preview" id="readen-profile-avatar-preview"></div>
                    <div class="readen-profile-avatar-tip">点击更换头像</div>
                </button>
                <div class="readen-profile-field">
                    <div class="readen-profile-field-label">名称</div>
                    <input type="text" id="readen-profile-name-input" maxlength="24" autocomplete="off" placeholder="输入名称">
                </div>
                <div class="readen-profile-field">
                    <div class="readen-profile-field-label">签名</div>
                    <input type="text" id="readen-profile-sign-input" maxlength="80" autocomplete="off" placeholder="输入简介">
                </div>
            </div>
            <input type="file" id="readen-profile-avatar-input" accept="image/*" style="display:none;">
        </div>
    </div>

    <!-- 全部笔记页面 -->
    <div class="sub-page" id="readen-page-profile-notes" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-profile-notes-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title" id="readen-profile-notes-title">笔记</div>
            <div></div>
        </div>
        <div class="cg-content">
            <div id="readen-profile-notes-list"></div>
        </div>
    </div>

    <!-- 角色批注页面 -->
    <div class="sub-page" id="readen-page-profile-roles" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-profile-roles-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title" id="readen-profile-roles-title">角色批注</div>
            <div></div>
        </div>
        <div class="cg-content">
            <div id="readen-profile-roles-list"></div>
        </div>
    </div>

    <!-- 分类管理页面 -->
    <div class="sub-page" id="readen-page-profile-groups" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-profile-groups-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title" id="readen-profile-groups-title">分类管理</div>
            <button type="button" class="sub-header-action" id="readen-profile-group-add-btn" aria-label="新建分组">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
        <div class="cg-content">
            <div id="readen-profile-groups-list"></div>
        </div>
    </div>

    <!-- 书籍详情页面 (从右侧滑出) -->
    <div class="sub-page" id="readen-page-book-details" style="background: #f7f8fa;">
        <div class="sub-header" style="background: transparent; box-shadow: none;">
            <div class="sub-header-back" id="readen-bd-back-btn">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div class="sub-header-title">书籍详情</div>
            <div style="cursor: pointer; display: flex; align-items: center; justify-content: center; margin-right: 16px;" id="readen-bd-edit-btn">
                <svg viewBox="0 0 16 16" fill="var(--text-main)" xmlns="http://www.w3.org/2000/svg" id="Pencil-Line--Streamline-Remix" height="20" width="20">
                  <path d="m10.485266666666666 6.384179999999999 -0.9427999999999999 -0.9428066666666666L3.333333333333333 11.650533333333332V12.593333333333334h0.9428066666666666l6.209126666666666 -6.209153333333333Zm0.9427999999999999 -0.9428066666666666 0.9427999999999999 -0.9428066666666666 -0.9427999999999999 -0.9428133333333333 -0.9427999999999999 0.9428133333333333 0.9427999999999999 0.9428066666666666ZM4.828426666666666 13.926666666666666H2v-2.8284666666666665L10.956666666666665 2.14154c0.26039999999999996 -0.2603466666666666 0.6824666666666667 -0.2603466666666666 0.9427999999999999 0l1.8856666666666666 1.8856199999999999c0.2603333333333333 0.2603466666666666 0.2603333333333333 0.68246 0 0.9428066666666666L4.828426666666666 13.926666666666666Z" stroke-width="0.6667"></path>
                </svg>
            </div>
        </div>
        
        <div class="bd-info-section">
            <div class="bd-cover" id="readen-bd-cover-container"></div>
            <div class="bd-text-info">
                <div>
                    <div class="bd-title" id="readen-bd-title">《书名》</div>
                    <div class="bd-meta" id="readen-bd-meta">0K / 0字 / 0 分 0 秒</div>
                </div>
                <div class="bd-read-btn" id="readen-bd-read-btn">开始阅读</div>
            </div>
        </div>

        <div class="bd-tabs-container">
            <div class="bd-tabs">
                <div class="bd-tab active" data-target="intro">简介</div>
                <div class="bd-tab" data-target="chapters">章节</div>
                
                <div class="bd-tab" data-target="notes">笔记</div>
                <div class="bd-tab" data-target="bookmarks">书签</div>
                <div class="bd-tab" data-target="history">阅迹</div>
            </div>
        </div>

        <div class="bd-content" id="readen-bd-content-area">
            <div class="bd-empty-wrap" id="readen-bd-empty-wrap">
                <div class="bd-empty-text" id="readen-bd-empty-text">暂无简介</div>
            </div>
            <div class="chapter-list" id="readen-bd-chapter-list" style="display: none;"></div>
        </div>

        <div class="bd-bottom-bar">
            <div class="bd-action-btn" id="readen-bd-action-btn">编辑简介</div>
        </div>
    </div>

    <!-- 书籍信息编辑弹窗 (全局顶层) -->
    <div class="cover-modal-overlay" id="readen-book-edit-modal-overlay" style="z-index: 500;">
        <div class="cover-modal" style="width: 320px; padding: 20px 20px 16px;">
            <div class="cover-modal-title" style="margin-top: 0; margin-bottom: 16px;">编辑书籍信息</div>
            <div style="display: flex; gap: 14px; width: 100%; margin-bottom: 14px;">
                <div class="cover-preview-box" id="readen-edit-cover-preview-box" style="width: 72px; height: 96px; margin: 0; flex-shrink: 0;">
                    <span class="cover-preview-text" id="readen-edit-cover-preview-text" style="font-size: 11px;">更换封面</span>
                    <img id="readen-edit-cover-preview-img" src="" alt="封面预览">
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
                    <input type="text" id="readen-edit-book-title" placeholder="小说名称" style="width: 100%; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--divider); background: #f5f6f8; font-size: 14px; outline: none; color: var(--text-main);">
                    <input type="text" id="readen-edit-book-author" placeholder="小说作者" style="width: 100%; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--divider); background: #f5f6f8; font-size: 14px; outline: none; color: var(--text-main);">
                </div>
            </div>
            <div style="width: 100%; margin-bottom: 14px;">
                <textarea id="readen-edit-book-intro" placeholder="输入小说简介..." style="width: 100%; height: 80px; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--divider); background: #f5f6f8; font-size: 13px; outline: none; color: var(--text-main); resize: none;"></textarea>
            </div>
            <div class="cover-modal-footer" style="padding: 0;">
                <div class="cover-btn cancel" id="readen-edit-book-cancel-btn">取消</div>
                <div class="cover-btn confirm" id="readen-edit-book-confirm-btn">保存</div>
            </div>
            <input type="file" id="readen-edit-cover-file-input" accept="image/*" style="display: none;">
        </div>
    </div>


    <!-- 沉浸式阅读器 -->
    <div id="readen-reader-container">
        <div id="readen-reader-brightness-overlay"></div>
        <div id="readen-reader-scroll-wrapper">
            <div class="reader-content paged-mode anim-shift" id="readen-reader-content">
                <!-- 文本内容将动态注入 -->
            </div>
        </div>
        <div class="reader-page-mode-switch" id="readen-reader-page-mode-switch" aria-hidden="true">
            <button type="button" id="readen-reader-page-mode-btn">平滑 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
        </div>
        <div class="readen-selection-toolbar" id="readen-selection-toolbar" aria-hidden="true">
            <button type="button" id="readen-selection-copy-btn"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>复制</span></button>
            <button type="button" id="readen-selection-define-btn"><svg viewBox="0 0 24 24"><path d="M4 5h16"></path><path d="M8 3v2"></path><path d="M7 5c.5 3.2 2.1 5.9 5 8"></path><path d="M12 13c1.9-2.1 3.1-4.4 3.7-8"></path><path d="M5 19h14"></path><path d="M8 19l4-8 4 8"></path><path d="M9.5 16h5"></path></svg><span>释义</span></button>
            <button type="button" id="readen-selection-underline-btn"><svg viewBox="0 0 24 24"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><line x1="4" y1="20" x2="20" y2="20"></line></svg><span>划线</span></button>
            <button type="button" id="readen-selection-note-btn"><svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg><span>笔记</span></button>
            <button type="button" id="readen-selection-ai-btn"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21.25 7.50616V14.1133C21.25 14.6339 21.1475 15.1494 20.9482 15.6304C20.749 16.1113 20.457 16.5484 20.0889 16.9165C19.7208 17.2846 19.2837 17.5766 18.8028 17.7758C18.3218 17.975 17.8063 18.0776 17.2857 18.0776H14.6429L12.4625 20.2579C12.4032 20.3211 12.3315 20.3715 12.252 20.406C12.1724 20.4404 12.0867 20.4582 12 20.4582C11.9133 20.4582 11.8276 20.4404 11.748 20.406C11.6685 20.3715 11.5968 20.3211 11.5375 20.2579L9.35714 18.0776H6.71429C5.66289 18.0776 4.65456 17.6599 3.91111 16.9165C3.16766 16.173 2.75 15.1647 2.75 14.1133V7.50616C2.75 6.45476 3.16766 5.44643 3.91111 4.70298C4.65456 3.95953 5.66289 3.54187 6.71429 3.54187H17.2857C18.3371 3.54187 19.3454 3.95953 20.0889 4.70298C20.8323 5.44643 21.25 6.45476 21.25 7.50616Z"/><path d="M12 11.3383C12.3649 11.3383 12.6607 11.0425 12.6607 10.6776C12.6607 10.3127 12.3649 10.0168 12 10.0168C11.6351 10.0168 11.3393 10.3127 11.3393 10.6776C11.3393 11.0425 11.6351 11.3383 12 11.3383Z"/><path d="M16.625 11.3383C16.9899 11.3383 17.2857 11.0425 17.2857 10.6776C17.2857 10.3127 16.9899 10.0168 16.625 10.0168C16.2601 10.0168 15.9643 10.3127 15.9643 10.6776C15.9643 11.0425 16.2601 11.3383 16.625 11.3383Z"/><path d="M7.375 11.3383C7.73991 11.3383 8.03572 11.0425 8.03572 10.6776C8.03572 10.3127 7.73991 10.0168 7.375 10.0168C7.0101 10.0168 6.71429 10.3127 6.71429 10.6776C6.71429 11.0425 7.0101 11.3383 7.375 11.3383Z"/></svg><span>问 AI</span></button>
            <button type="button" id="readen-selection-listen-btn"><svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg><span>从此听</span></button>
            <button type="button" id="readen-selection-translate-btn"><svg viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg><span>翻译</span></button>
            <button type="button" id="readen-selection-mark-btn"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 -6 6v3h9l3 -3"></path><path d="m22 12 -4.6 4.6a2 2 0 0 1 -2.8 0l-5.2 -5.2a2 2 0 0 1 0 -2.8L14 4"></path></svg><span>高亮</span></button>
            <button type="button" id="readen-selection-search-btn"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>搜索</span></button>
        </div>
        <div class="readen-selection-handles" id="readen-selection-handles" aria-hidden="true">
            <span class="readen-selection-handle start"></span>
            <span class="readen-selection-handle end"></span>
        </div>
        <div class="readen-user-annotation-panel" id="readen-user-annotation-panel" aria-hidden="true">
            <div class="readen-user-annotation-backdrop" id="readen-user-annotation-close"></div>
            <section class="readen-user-annotation-sheet">
                <!-- 颜色选择区 -->
                <div class="readen-user-annotation-colors" id="readen-user-annotation-colors">
                    <button type="button" class="active" data-readen-annotation-color="#ef4444" style="--mark-color:#ef4444"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#22c55e" style="--mark-color:#22c55e"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#3b82f6" style="--mark-color:#3b82f6"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#a855f7" style="--mark-color:#a855f7"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#f97316" style="--mark-color:#f97316"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#ec4899" style="--mark-color:#ec4899"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#14b8a6" style="--mark-color:#14b8a6"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#8b4513" style="--mark-color:#8b4513"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#111111" style="--mark-color:#111111"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button type="button" data-readen-annotation-color="#ffffff" style="--mark-color:#ffffff; border: 1px solid #e5e5e5;"><svg viewBox="0 0 24 24" stroke="#111"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                </div>
                <!-- 工具网格区 -->
                <div class="readen-user-annotation-tools" id="readen-user-annotation-tools">
                    <button type="button" data-readen-annotation-style="underline">
                        <svg viewBox="0 0 24 24"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><line x1="4" y1="20" x2="20" y2="20"></line></svg>
                        <span>单实线</span>
                    </button>
                    <button type="button" data-readen-annotation-style="wavy">
                        <svg viewBox="0 0 24 24"><path d="M7 4l5 10 5-10"></path><path d="M5 14h14"></path><path d="M4 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"></path></svg>
                        <span>波浪线</span>
                    </button>
                    <button type="button" data-readen-annotation-style="dashed">
                        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke-dasharray="4 4"></rect></svg>
                        <span>虚线</span>
                    </button>
                    <button type="button" data-readen-annotation-style="bg-color">
                        <svg viewBox="0 0 24 24"><path d="M19.2 8.8L15.2 4.8 4.8 15.2l4 4 10.4-10.4z"></path><path d="M2 22h20"></path></svg>
                        <span>背景色</span>
                    </button>
                    <button type="button" data-readen-annotation-style="text-color">
                        <svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        <span>字体色</span>
                    </button>
                    <button type="button" data-readen-annotation-style="double-line">
                        <svg viewBox="0 0 24 24"><line x1="4" y1="10" x2="20" y2="10"></line><line x1="4" y1="14" x2="20" y2="14"></line></svg>
                        <span>双实线</span>
                    </button>
                    <button type="button" data-readen-annotation-style="dotted">
                        <svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"></circle><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"></circle></svg>
                        <span>点线</span>
                    </button>
                    <button type="button" class="active" data-readen-annotation-style="highlight">
                        <svg viewBox="0 0 24 24"><path d="m9 11 -6 6v3h9l3 -3"></path><path d="m22 12 -4.6 4.6a2 2 0 0 1 -2.8 0l-5.2 -5.2a2 2 0 0 1 0 -2.8L14 4"></path></svg>
                        <span>荧光</span>
                    </button>
                    <button type="button" data-readen-annotation-style="strikethrough">
                        <svg viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="M10 6a4 4 0 0 1 4 4"></path><path d="M14 18a4 4 0 0 1-4-4"></path></svg>
                        <span>删除线</span>
                    </button>
                    <button type="button" id="readen-user-annotation-erase-btn">
                        <svg viewBox="0 0 24 24"><path d="M18 2l4 4-10 10H8v-4L18 2z"></path><line x1="2" y1="22" x2="22" y2="22"></line></svg>
                        <span>擦除</span>
                    </button>
                </div>
                <!-- 笔记输入区 -->
                <div class="readen-user-annotation-note-wrap">
                    <textarea id="readen-user-annotation-note" placeholder="写点笔记吧~"></textarea>
                    <div class="readen-user-annotation-preview" id="readen-user-annotation-preview" aria-hidden="true"></div>
                    <div class="readen-user-annotation-footer">
                        <div class="rua-footer-left">
                            <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                            <span>标签</span>
                        </div>
                        <div class="rua-footer-right">
                            <button type="button" id="readen-user-annotation-image-btn"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                            <button type="button" id="readen-user-annotation-save"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                        </div>
                    </div>
                </div>
                <input type="file" id="readen-user-annotation-image-input" accept="image/*" style="display: none;">
            </section>
        </div>

        <!-- 笔记详情悬浮窗 -->
        <div class="readen-annotation-detail-backdrop" id="readen-annotation-detail-backdrop" style="display: none;"></div>
        <div class="readen-annotation-detail-popover" id="readen-annotation-detail-popover" aria-hidden="true">
            <div class="radp-content" id="radp-content"></div>
            <div class="radp-footer">
                <span class="radp-time" id="radp-time"></span>
                <button class="radp-edit-btn" id="radp-edit-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            </div>
        </div>

        <!-- 顶部菜单 -->
        <div class="reader-menu reader-top-menu" id="readen-reader-top-menu">
            <div id="readen-reader-close-btn" style="cursor: pointer;"><svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
            <div class="rt-right">
                <button type="button" class="rt-icon-btn" id="readen-reader-bookmark-btn" aria-label="书签"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
                <button type="button" class="rt-icon-btn" id="readen-reader-search-btn" aria-label="搜索本书"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
                <button type="button" class="rt-icon-btn" id="readen-reader-more-btn" aria-label="更多"><svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
            </div>
        </div>
        
        <!-- 底部菜单 -->
        <div class="reader-menu reader-bottom-menu" id="readen-reader-bottom-menu">
            <div class="rb-stats-row">
                <div class="rb-stat-item">
                    <div class="rb-stat-val rb-reading-time">0 分钟</div>
                    <div class="rb-stat-label">阅读时长</div>
                </div>
                <div class="rb-stat-item">
                    <div class="rb-stat-val rb-percent">0.00%</div>
                    <div class="rb-stat-label rb-remaining-time">剩余 --</div>
                </div>
                <div class="rb-stat-item">
                    <div class="rb-stat-val rb-reading-speed">0 字/分钟</div>
                    <div class="rb-stat-label">阅读速度</div>
                </div>
                <div class="rb-stat-item">
                    <div class="rb-stat-val rb-note-count">0 条</div>
                    <div class="rb-stat-label">笔记</div>
                </div>
            </div>
            <div class="rb-progress-row">
                <input type="range" class="rb-slider" min="0" max="100" value="0">
                <div class="rb-next-btn" id="readen-reader-next-chapter">›</div>
            </div>
            <div class="rb-action-row">
                <div class="rb-action-item" id="readen-reader-chapter-btn">
                    <div class="rb-icon-btn"><svg viewBox="0 0 24 24" style="stroke-width: 2.2;"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
                    <div class="rb-action-label">目录</div>
                </div>
                <div class="rb-action-item" id="readen-reader-notes-btn">
                    <div class="rb-icon-btn"><svg viewBox="0 0 24 24" style="stroke-width: 2.2;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
                    <div class="rb-action-label">笔记</div>
                </div>
                <div class="rb-action-item" id="readen-reader-night-btn">
                    <div class="rb-icon-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: currentColor; stroke: none;"><path d="M12.2 22c4.53 0 8.45-2.91 9.76-7.24a1.002 1.002 0 0 0-1.25-1.25c-.78.23-1.58.35-2.38.35-4.52 0-8.2-3.68-8.2-8.2 0-.8.12-1.6.35-2.38.11-.35.01-.74-.25-1s-.64-.36-1-.25A10.17 10.17 0 0 0 2 11.8C2 17.42 6.57 22 12.2 22M8.18 4.65c-.03.34-.05.68-.05 1.02 0 5.62 4.57 10.2 10.2 10.2.34 0 .68-.02 1.02-.05C17.93 18.38 15.23 20 12.2 20 7.68 20 4 16.32 4 11.8a8.15 8.15 0 0 1 4.18-7.15"></path></svg></div>
                    <div class="rb-action-label">夜间</div>
                </div>
                <div class="rb-action-item" id="readen-reader-font-btn">
                    <div class="rb-icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5672 14.54V9.46002C20.5665 8.72983 20.3737 8.01267 20.0083 7.38049C19.6429 6.74831 19.1176 6.22334 18.4853 5.85825L14.0819 3.30786C13.449 2.9424 12.7309 2.75 12 2.75C11.2691 2.75 10.551 2.9424 9.91805 3.30786L5.51472 5.85825C4.88235 6.22334 4.35711 6.74831 3.99169 7.38049C3.62627 8.01267 3.43352 8.72983 3.43277 9.46002V14.54C3.43352 15.2702 3.62627 15.9873 3.99169 16.6195C4.35711 17.2517 4.88235 17.7767 5.51472 18.1418L9.91805 20.6921C10.551 21.0576 11.2691 21.25 12 21.25C12.7309 21.25 13.449 21.0576 14.0819 20.6921L18.4853 18.1418C19.1176 17.7767 19.6429 17.2517 20.0083 16.6195C20.3737 15.9873 20.5665 15.2702 20.5672 14.54Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9057 8.34621H11.0944C10.7275 8.34475 10.3668 8.44026 10.0487 8.62306C9.73061 8.80586 9.46649 9.06947 9.28306 9.38718L8.37741 10.9591C8.19468 11.2756 8.09848 11.6346 8.09848 12C8.09848 12.3655 8.19468 12.7245 8.37741 13.041L9.28306 14.6129C9.46649 14.9306 9.73061 15.1942 10.0487 15.377C10.3668 15.5598 10.7275 15.6553 11.0944 15.6539H12.9057C13.2725 15.6553 13.6332 15.5598 13.9513 15.377C14.2694 15.1942 14.5335 14.9306 14.7169 14.6129L15.6226 13.041C15.8053 12.7245 15.9015 12.3655 15.9015 12C15.9015 11.6346 15.8053 11.2756 15.6226 10.9591L14.7169 9.38718C14.5335 9.06947 14.2694 8.80586 13.9513 8.62306C13.6332 8.44026 13.2725 8.34475 12.9057 8.34621Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <div class="rb-action-label">设置</div>
                </div>
            </div>
            <!-- 隐藏原有绑定的按钮以防报错 -->
            <div style="display: none;">
                <span id="readen-reader-prev-chapter"></span>
                <span id="readen-reader-resume-btn"></span>
            </div>
        </div>

        <!-- 字体设置菜单 -->
        <div class="reader-tool-panel" id="readen-reader-bookmark-panel" aria-hidden="true">
            <div class="reader-tool-backdrop" data-reader-tool-close></div>
            <section class="reader-tool-sheet reader-bookmark-sheet" role="dialog" aria-label="书签备注">
                <div class="reader-tool-handle"></div>
                <div class="reader-tool-title">书签备注</div>
                <textarea id="readen-reader-bookmark-note" placeholder="写下这一页想记住的内容"></textarea>
                <div class="reader-tool-actions">
                    <button type="button" class="reader-tool-btn muted" data-reader-tool-close>取消</button>
                    <button type="button" class="reader-tool-btn primary" id="readen-reader-bookmark-save">保存</button>
                </div>
            </section>
        </div>

        <div class="reader-tool-panel" id="readen-reader-search-panel" aria-hidden="true">
            <div class="reader-tool-backdrop" data-reader-tool-close></div>
            <section class="reader-tool-sheet reader-search-sheet" role="dialog" aria-label="搜索本书">
                <div class="reader-tool-handle"></div>
                <label class="reader-search-box">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input id="readen-reader-search-input" type="search" placeholder="搜索本书文字" autocomplete="off">
                </label>
                <div class="reader-search-status" id="readen-reader-search-status">输入关键词搜索当前正文</div>
                <div class="reader-search-results" id="readen-reader-search-results"></div>
            </section>
        </div>

        <div class="reader-tool-panel" id="readen-reader-selection-result-panel" aria-hidden="true">
            <div class="reader-tool-backdrop" data-reader-tool-close></div>
            <section class="reader-tool-sheet reader-selection-result-sheet" role="dialog" aria-label="选段工具">
                <div class="reader-tool-handle"></div>
                <div class="reader-tool-title" id="readen-selection-result-title">选段工具</div>
                <div class="readen-selection-result-source" id="readen-selection-result-source"></div>
                <div class="reader-search-status" id="readen-selection-result-status">正在准备…</div>
                <div class="readen-selection-result-body" id="readen-selection-result-body"></div>
                <div class="reader-tool-actions">
                    <button type="button" class="reader-tool-btn muted" data-reader-tool-close>关闭</button>
                    <button type="button" class="reader-tool-btn primary" id="readen-selection-result-retry">重试</button>
                </div>
            </section>
        </div>

        <div class="reader-tool-panel" id="readen-reader-speech-panel" aria-hidden="true">
            <div class="reader-tool-backdrop" data-reader-tool-close></div>
            <section class="reader-tool-sheet reader-speech-sheet" role="dialog" aria-label="听书">
                <div class="reader-tool-handle"></div>
                <div class="reader-tool-title">听书</div>
                <div class="readen-speech-status" id="readen-speech-status">尚未开始</div>
                <label class="readen-speech-setting">
                    <span>朗读方式</span>
                    <select id="readen-speech-voice-mode">
                        <option value="system">系统 TTS（文字转语音）</option>
                        <option value="character">角色语音</option>
                    </select>
                </label>
                <label class="readen-speech-setting">
                    <span>语速</span>
                    <select id="readen-speech-rate">
                        <option value="0.75">0.75x</option>
                        <option value="1" selected>1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="1.75">1.75x</option>
                        <option value="2">2.0x</option>
                    </select>
                </label>
                <label class="readen-speech-setting">
                    <span>读完本章自动读下一章</span>
                    <input type="checkbox" id="readen-speech-auto-next">
                </label>
                <div class="reader-tool-actions">
                    <button type="button" class="reader-tool-btn muted" id="readen-speech-toggle-btn">播放</button>
                    <button type="button" class="reader-tool-btn primary" id="readen-speech-stop-btn">停止</button>
                </div>
            </section>
        </div>

        <div class="reader-tool-panel reader-menu-popover-panel" id="readen-reader-more-panel" aria-hidden="true">
            <div class="reader-tool-backdrop reader-popover-backdrop" data-reader-tool-close></div>
            <section class="reader-more-popover" role="menu" aria-label="更多功能">
                <button type="button" class="reader-popover-item" id="readen-reader-translate-btn" style="display: none;"><span><svg viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg></span><b>全文翻译</b></button>
                <button type="button" class="reader-popover-item" id="readen-reader-auto-btn" style="display: none;"><span><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></span><b>自动阅读</b></button>
                <button type="button" class="reader-popover-item" id="readen-reader-share-btn"><span><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></span><b>分享书籍</b></button>
                <button type="button" class="reader-popover-item" id="readen-reader-ai-btn" style="display: none;"><span><svg viewBox="0 0 24 24"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg></span><b>AI 问书</b></button>
                <button type="button" class="reader-popover-item" id="readen-reader-speech-btn"><span><svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg></span><b>听书</b></button>
                <div class="reader-popover-divider"></div>
                <button type="button" class="reader-popover-item" id="readen-reader-title-style-btn"><span><svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></span><b>标题样式</b></button>
                <button type="button" class="reader-popover-item" id="readen-reader-edit-content-btn" style="display: none;"><span><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span><b>编辑内容</b></button>
            </section>
        </div>

        <div class="reader-tool-panel" id="readen-reader-title-style-panel" aria-hidden="true">
            <div class="reader-tool-backdrop" data-reader-tool-close></div>
            <section class="reader-tool-sheet reader-title-style-sheet" role="dialog" aria-label="标题样式">
                <div class="reader-tool-handle"></div>
                <div class="reader-tool-title">标题样式</div>
                <div class="reader-title-style-list" id="readen-reader-title-style-list"></div>
            </section>
        </div>

        <div class="reader-font-menu" id="readen-reader-font-menu">
            <!-- 隐藏原有按钮防报错，保留JS事件绑定 -->
            <div style="display: none;">
                <div id="readen-rf-size-minus"></div><div id="readen-rf-size-plus"></div>
                <div id="readen-rf-bright-minus"></div><div id="readen-rf-bright-plus"></div>
            </div>
            
            <!-- 亮度 -->
            <div class="rf-new-row">
                <div class="rf-slider-wrap">
                    <span class="rf-slider-label">暗</span>
                    <div class="rf-slider-track-container">
                        <input type="range" class="rf-new-slider" id="readen-rf-bright-slider" min="20" max="100" value="100">
                        <div class="rf-thumb-text" id="readen-rf-bright-text" style="left: calc(18px + 1 * (100% - 36px));">100</div>
                    </div>
                    <span class="rf-slider-label" style="opacity: 0;">明</span>
                </div>
            </div>
            
            <!-- 字体 -->
            <div class="rf-new-row">
                <div class="rf-slider-wrap">
                    <span class="rf-slider-label">小</span>
                    <div class="rf-slider-track-container">
                        <input type="range" class="rf-new-slider" id="readen-rf-size-slider" min="12" max="36" value="26">
                        <div class="rf-thumb-text" id="readen-rf-size-text" style="left: calc(18px + 0.583 * (100% - 36px));">26.0</div>
                    </div>
                    <span class="rf-slider-label">大</span>
                </div>
                <div class="rf-nav-btn">字体 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            
            <!-- 排版 -->
            <div class="rf-new-row">
                <div class="rf-slider-wrap">
                    <span class="rf-slider-label">紧</span>
                    <div class="rf-slider-track-container">
                        <input type="range" class="rf-new-slider" id="readen-rf-spacing-slider" min="1" max="3" value="2">
                        <div class="rf-thumb-text" id="readen-rf-spacing-text" style="left: calc(18px + 0.5 * (100% - 36px));">间距</div>
                    </div>
                    <span class="rf-slider-label">松</span>
                </div>
                <div class="rf-nav-btn">排版 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            
            <!-- 主题标题 -->
            <div class="rf-theme-header">
                <div class="rf-theme-title">
                    阅读主题 <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><br>
                    <span class="rf-theme-sub">当前为白昼模式</span>
                </div>
                <div class="rf-nav-btn">本书主题 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            
            <!-- 主题色块 -->
            <div class="rf-theme-colors">
                <div class="rf-color-box" style="background: #dcedd9; color: #555;">淡绿</div>
                <div class="rf-color-box" style="background: #f5e1c8; color: #555;">淡黄</div>
                <div class="rf-color-box active" style="background: #ffffff; border: 1px solid #eee; color: #333;">纯白<div class="rf-color-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div></div>
                <div class="rf-color-box" style="background: #f0f0f0; color: #555;">纸白</div>
                <div class="rf-color-box" style="background: #fce4e4; color: #555;">淡粉</div>
                <div class="rf-color-more"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
            
            <!-- 底部按钮 -->
            <div class="rf-bottom-btns">
                <div class="rf-big-btn" id="readen-rf-anim-val">翻页动画 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="rf-big-btn">更多设置 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
        </div>
        
        <!-- 翻页动画选择弹窗 -->
        <div class="anim-modal-overlay" id="readen-anim-modal-overlay">
            <div class="anim-modal">
                <div class="anim-item" data-mode="shift">平滑</div>
                <div class="anim-item" data-mode="curl">仿真</div>
                <div class="anim-item" data-mode="scroll">滚动</div>
            </div>
        </div>
    </div>

        <!-- 封面图集页面 (从右侧滑出) -->
        <div class="sub-page" id="readen-page-cover-gallery">
            <div class="sub-header">
                <div class="sub-header-back" id="readen-cg-back-btn">
                    <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </div>
                <div class="sub-header-title">封面图集</div>
                <div style="cursor: pointer; display: flex; align-items: center; justify-content: center;" id="readen-cg-add-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                      <g id="pending">
                        <path id="Union" fill="#000000" d="M12 2c5.5228 0 10 4.47715 10 10 0 5.5228 -4.4772 10 -10 10 -5.52285 0 -10 -4.4772 -10 -10C2 6.47715 6.47715 2 12 2m0 2c-4.41828 0 -8 3.58172 -8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8m-4.5 6.5c0.82843 0 1.5 0.6716 1.5 1.5s-0.67157 1.5 -1.5 1.5S6 12.8284 6 12s0.67157 -1.5 1.5 -1.5m4.5 0c0.8284 0 1.5 0.6716 1.5 1.5s-0.6716 1.5 -1.5 1.5 -1.5 -0.6716 -1.5 -1.5 0.6716 -1.5 1.5 -1.5m4.5 0c0.8284 0 1.5 0.6716 1.5 1.5s-0.6716 1.5 -1.5 1.5S15 12.8284 15 12s0.6716 -1.5 1.5 -1.5" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
            </div>
            
            <!-- 新增的胶囊搜索框 -->
            <div style="padding: 0 16px 12px;">
                <div style="background-color: var(--card-bg); border-radius: 20px; height: 36px; display: flex; align-items: center; padding: 0 16px;">
                    <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: var(--text-light); margin-right: 8px;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" placeholder="搜索封面图集" style="border: none; background: transparent; outline: none; width: 100%; color: var(--text-main); font-size: 14px;">
                </div>
            </div>

            <div class="cg-content" id="readen-cg-theme-list">
                <!-- JS 动态渲染主题卡片 -->
            </div>
        </div>

        <!-- 新增封面套图弹窗 (全局顶层) -->
        <div class="cover-modal-overlay" id="readen-add-theme-modal-overlay" style="z-index: 500;">
            <div class="cover-modal" style="width: 320px; padding: 24px 20px 20px;">
                <div class="cover-modal-title" style="margin-top: 0; margin-bottom: 20px;">新增封面套图</div>
                
                <input type="text" id="readen-new-theme-name" placeholder="输入套图名称" style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--divider); background: #f5f6f8; margin-bottom: 16px; font-size: 15px; outline: none; color: var(--text-main);">

                <div id="readen-theme-image-preview-list" style="width: 100%; display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; min-height: 90px; scrollbar-width: none;">
                    <!-- 动态渲染预览图，支持拖拽 -->
                </div>

                <div class="cover-modal-footer" style="padding: 16px 0 0 0;">
                    <div class="cover-btn cancel" id="readen-theme-cancel-btn">取消</div>
                    <div class="cover-btn confirm" id="readen-theme-confirm-btn">确认</div>
                </div>
            </div>
        </div>

        <!-- 多选模式底部操作栏 (全局固定底栏) -->
        <div class="multi-select-bar" id="readen-multi-select-bar" style="position: absolute; bottom: 0; left: 0; right: 0; z-index: 120; display: none;">
            <div class="ms-btn" id="readen-ms-move">
                <svg viewBox="0 0 24 24"><path d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5"></path></svg>
                移动
            </div>
            <div class="ms-btn danger" id="readen-ms-delete">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                删除
            </div>
            <div class="ms-btn" id="readen-ms-cancel">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                取消
            </div>
        </div>

        <!-- 阅读APP专属通用弹窗 -->
        <div class="readen-dialog-overlay" id="readen-dialog-overlay">
            <div class="readen-dialog-modal">
                <div class="readen-dialog-title" id="readen-dialog-title">提示</div>
                <div class="readen-dialog-msg" id="readen-dialog-msg"></div>
                <input type="text" class="readen-dialog-input" id="readen-dialog-input">
                <div class="readen-dialog-footer">
                    <div class="readen-dialog-btn cancel" id="readen-dialog-cancel">取消</div>
                    <div class="readen-dialog-btn confirm" id="readen-dialog-confirm">确定</div>
                </div>
            </div>
        </div>

        <!-- ================= 底部导航栏 ================= -->

    <div class="bottom-nav" id="readen-bottom-nav">
        <div class="nav-item" data-target="home">
            <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" id="Books-Fill--Streamline-Phosphor-Fill">
                <path d="M15.49935625 13.531025 12.89715 1.15898125C12.7555625 0.47833125 12.08743125 0.0426375 11.4074875 0.1875625l-3.6700625 0.7887375c-0.6756625 0.14794375 -1.10596875 0.81264375 -0.96435625 1.4896625l2.60220625 12.37204375c0.11953125 0.58180625 0.63070625 1.0000375 1.22465625 1.00199375 0.08908125 -0.00011875 0.1779 -0.00958125 0.26500625 -0.028225l3.67005625 -0.7887375c0.67651875 -0.14829375 1.106975 -0.814275 0.9643625 -1.4920125ZM8.00008125 2.2095875v-0.00705625l3.669275 -0.7840375 0.26108125 1.2442625 -3.669275 0.78951875Zm0.78403125 3.71474375 -0.26265 -1.2466125 3.67084375 -0.7887375 0.2618625 1.2466125Zm5.48823125 7.87248125 -3.669275 0.78403125 -0.26108125 -1.2442625 3.669275 -0.78951875 0.26108125 1.24269375v0.00705625ZM5.491175 0.7865625H1.7278125c-0.6928125 0 -1.25445 0.5616375 -1.25445 1.25445625v12.54453125c0 0.6928125 0.5616375 1.25445 1.25445 1.25445h3.7633625c0.6928125 0 1.25445 -0.5616375 1.25445 -1.25445V2.04101875c0 -0.69281875 -0.5616375 -1.25445625 -1.25445 -1.25445625ZM1.7278125 2.04101875h3.7633625v1.25445H1.7278125Zm3.7633625 12.54453125H1.7278125v-1.25445625h3.7633625v1.25445625Z" stroke-width="0.0625"></path>
            </svg>
            <span class="nav-label">首页</span>
        </div>
        
        <div class="nav-item" data-target="bookshelf">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Book-2-Fill--Streamline-Outlined-Fill-Material">
                <path fill="currentColor" d="M7.25 22c-0.9 0 -1.66665 -0.31665 -2.3 -0.95C4.316665 20.41665 4 19.65 4 18.75v-13.5c0 -0.9 0.316665 -1.666665 0.95 -2.3C5.58335 2.316665 6.35 2 7.25 2H20v15c-0.43335 0 -0.79165 0.175 -1.075 0.525 -0.28335 0.35 -0.425 0.75835 -0.425 1.225 0 0.46665 0.14165 0.875 0.425 1.225 0.28335 0.35 0.64165 0.525 1.075 0.525v1.5H7.25ZM8 15.5h1.5V3.5h-1.5v12Zm-0.75 5h10.225c-0.15 -0.25 -0.26665 -0.525 -0.35 -0.825 -0.08335 -0.3 -0.125 -0.60835 -0.125 -0.925 0 -0.33335 0.04165 -0.64585 0.125 -0.9375 0.08335 -0.29165 0.20835 -0.5625 0.375 -0.8125H7.25c-0.48335 0 -0.89585 0.17085 -1.2375 0.5125C5.67085 17.85415 5.5 18.26665 5.5 18.75c0 0.48335 0.17085 0.89585 0.5125 1.2375 0.34165 0.34165 0.75415 0.5125 1.2375 0.5125Z" stroke-width="0.5"></path>
            </svg>
            <span class="nav-label">书架</span>
        </div>
        
        <div class="nav-item" data-target="stats">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="Graph-New--Streamline-Solar">
                <path d="M22 5c0 1.65685 -1.3431 3 -3 3s-3 -1.34315 -3 -3 1.3431 -3 3 -3 3 1.34315 3 3Z" fill="currentColor" stroke-width="1"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.612 2.03826C14.59 2 13.3988 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447 2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355C4.92893 22 7.28595 22 12 22c4.714 0 7.0711 0 8.5355 -1.4645C22 19.0711 22 16.714 22 12c0 -1.3988 0 -2.59 -0.0383 -3.61198C21.1703 9.08042 20.1342 9.5 19 9.5c-2.4853 0 -4.5 -2.01472 -4.5 -4.5 0 -1.13416 0.4196 -2.17033 1.112 -2.96174Zm1.8681 7.38557c0.3182 0.26518 0.3612 0.73807 0.0961 1.05627l-1.8289 2.1947c-0.3284 0.3942 -0.6245 0.7496 -0.9011 0.9994 -0.301 0.2717 -0.68 0.5138 -1.1795 0.5138 -0.4995 0 -0.8786 -0.2421 -1.1795 -0.5138 -0.2766 -0.2498 -0.5727 -0.6052 -0.9012 -0.9994l-0.2924 -0.3509c-0.3708 -0.445 -0.5985 -0.7154 -0.7861 -0.8848 -0.087 -0.0785 -0.1386 -0.1099 -0.1633 -0.1218 -0.005 -0.0025 -0.0086 -0.0039 -0.0109 -0.0048l-0.0041 0.0017 -0.0067 0.0031c-0.0248 0.0119 -0.0764 0.0433 -0.1634 0.1218 -0.18755 0.1694 -0.41525 0.4398 -0.78604 0.8848l-1.79689 2.1562c-0.26518 0.3182 -0.7381 0.3612 -1.05631 0.0961 -0.31821 -0.2652 -0.3612 -0.7381 -0.09603 -1.0563l1.82884 -2.1946c0.32846 -0.3943 0.62458 -0.7497 0.90117 -0.9995 0.30094 -0.2717 0.68 -0.51375 1.17946 -0.51375 0.4995 0 0.8786 0.24205 1.1795 0.51375 0.2766 0.2498 0.5727 0.6052 0.9012 0.9994l0.2924 0.3509c0.3708 0.445 0.5985 0.7154 0.7861 0.8848 0.087 0.0785 0.1386 0.1099 0.1633 0.1218l0.0032 0.0015c0.0034 0.0016 0.0077 0.0033 0.0077 0.0033 0.0022 -0.0009 0.0058 -0.0023 0.0108 -0.0048 0.0248 -0.0119 0.0764 -0.0433 0.1634 -0.1218 0.1875 -0.1694 0.4153 -0.4398 0.786 -0.8848l1.7969 -2.15624c0.2652 -0.31821 0.7381 -0.3612 1.0563 -0.09603Z" fill="currentColor" stroke-width="1"></path>
            </svg>
            <span class="nav-label">统计</span>
        </div>
        
        <div class="nav-item active" data-target="profile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.0986 8.55859C20.2142 8.53959 21 9.50189 21 10.5v7c0 1.1287 -0.9028 1.9421 -1.8936 2.0469 -2.2584 0.239 -4.1754 1.372 -6.5332 3.0224 -0.3442 0.2409 -0.8022 0.2409 -1.1464 0 -2.35778 -1.6504 -4.27478 -2.7834 -6.53325 -3.0224C3.90285 19.4421 3 18.6287 3 17.5v-7c0 -0.99811 0.78581 -1.96041 1.90137 -1.94141l0.22754 0.01758 0.27246 0.04102C7.91563 9.02945 10.2196 10.4671 12 11.7578c1.8445 -1.3372 4.2511 -2.83259 6.8711 -3.18163zM12 1.5c2.2091 0 4 1.79086 4 4s-1.7909 4 -4 4c-2.20914 0 -4 -1.79086 -4 -4s1.79086 -4 4 -4" stroke-width="1"></path>
            </svg>
            <span class="nav-label">我的</span>
        </div>
    </div>
    `;

    // --- 默认封面套图数据 ---
    const defaultCoverThemes = [
        {
            name: '对你而言我是一颗星吗',
            count: 5,
            svg: `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><filter id="f-blur"><feGaussianBlur stdDeviation="0.6"/></filter><linearGradient id="f-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#111"/><stop offset="100%" stop-color="#aaa"/></linearGradient><linearGradient id="m-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="40%" stop-color="white"/><stop offset="90%" stop-color="black"/></linearGradient><mask id="f-mask"><rect x="0" y="0" width="100" height="140" fill="url(#m-grad)"/></mask><g id="star"><polygon points="50,5 61,35 95,35 67,55 78,85 50,65 22,85 33,55 5,35 39,35"/></g></defs><use href="#star" x="-30" y="-20" transform="scale(0.5)" fill="#e0e0e0" opacity="0.8"/><use href="#star" x="110" y="60" transform="scale(0.7)" fill="#f0f0f0" opacity="0.9"/><use href="#star" x="20" y="160" transform="scale(0.4)" fill="#d5d5d5" opacity="0.6"/><use href="#star" x="180" y="-10" transform="scale(0.25)" fill="#cccccc" opacity="0.7"/><text x="50" y="20" font-family="Georgia, serif" font-size="4" fill="#ccc" text-anchor="middle" letter-spacing="2">S T A R L I G H T</text><line x1="15" y1="118" x2="85" y2="118" stroke="#ddd" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="85" cy="118" r="1" fill="#ddd"/><text x="50" y="128" font-family="Georgia, serif" font-style="italic" font-size="5.5" fill="#bbb" text-anchor="middle" letter-spacing="0.5">Am I a star to you?</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="12" y="45" font-size="18" fill="#333">於</text><text x="30" y="38" font-size="14" fill="none" stroke="#666" stroke-width="0.5">你</text><text x="46" y="48" font-size="16" fill="#555" filter="url(#f-blur)">而</text><text x="70" y="40" font-size="12" fill="#999">言</text><text x="8" y="75" font-size="22" fill="url(#f-grad)">我</text><text x="32" y="70" font-size="14" fill="#444">是</text><text x="48" y="78" font-size="15" fill="none" stroke="#888" stroke-width="0.5">一</text><text x="66" y="72" font-size="20" fill="#222" mask="url(#f-mask)">顆</text><text x="25" y="105" font-size="26" fill="#1a1a1a">星</text><text x="56" y="100" font-size="15" fill="#666" transform="rotate(-5, 56, 100)">嗎</text></g></svg>`
        },
        {
            name: '卡哇伊手账',
            count: 5,
            svg: `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><pattern id="stripes" width="14" height="140" patternUnits="userSpaceOnUse"><rect width="7" height="140" fill="#FFD1DC"/><rect x="7" width="7" height="140" fill="#FFF5E1"/></pattern><filter id="drop-shadow"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.15"/></filter></defs><rect width="100" height="140" fill="url(#stripes)"/><rect width="12" height="140" fill="#AEC6CF"/><line x1="12" y1="0" x2="12" y2="140" stroke="rgba(0,0,0,0.05)" stroke-width="1"/><line x1="6" y1="10" x2="6" y2="130" stroke="#fff" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/><polygon points="85,15 88,22 95,22 89,27 91,34 85,30 79,34 81,27 75,22 82,22" fill="#FFF" filter="url(#drop-shadow)"/><rect x="25" y="95" width="60" height="25" rx="4" fill="#FFF" filter="url(#drop-shadow)"/><rect x="27" y="97" width="56" height="21" rx="2" fill="none" stroke="#FFD1DC" stroke-width="1" stroke-dasharray="2 2"/><text x="55" y="45" font-family="cursive, sans-serif" font-size="12" fill="#FF9AA2" font-weight="bold" font-style="italic">Diary</text><text x="55" y="58" font-family="sans-serif" font-size="6" fill="#AEC6CF" font-weight="bold" letter-spacing="1">NOTEBOOK</text></svg>`,
            svgList: [
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><pattern id="stripes" width="14" height="140" patternUnits="userSpaceOnUse"><rect width="7" height="140" fill="#FFD1DC"/><rect x="7" width="7" height="140" fill="#FFF5E1"/></pattern><filter id="drop-shadow"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.15"/></filter></defs><rect width="100" height="140" fill="url(#stripes)"/><rect width="12" height="140" fill="#AEC6CF"/><line x1="12" y1="0" x2="12" y2="140" stroke="rgba(0,0,0,0.05)" stroke-width="1"/><line x1="6" y1="10" x2="6" y2="130" stroke="#fff" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/><polygon points="85,15 88,22 95,22 89,27 91,34 85,30 79,34 81,27 75,22 82,22" fill="#FFF" filter="url(#drop-shadow)"/><rect x="25" y="95" width="60" height="25" rx="4" fill="#FFF" filter="url(#drop-shadow)"/><rect x="27" y="97" width="56" height="21" rx="2" fill="none" stroke="#FFD1DC" stroke-width="1" stroke-dasharray="2 2"/><text x="55" y="45" font-family="cursive, sans-serif" font-size="12" fill="#FF9AA2" font-weight="bold" font-style="italic">Diary</text><text x="55" y="58" font-family="sans-serif" font-size="6" fill="#AEC6CF" font-weight="bold" letter-spacing="1">NOTEBOOK</text></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#C1E1C1"/><circle cx="6" cy="6" r="1.5" fill="#FFF" opacity="0.7"/></pattern><filter id="drop-shadow2"><feDropShadow dx="0" dy="2" stdDeviation="1" flood-opacity="0.15"/></filter></defs><rect width="100" height="140" fill="url(#dots)"/><rect width="14" height="140" fill="#C4A484"/><rect width="2" height="140" fill="rgba(0,0,0,0.05)"/><g transform="translate(55, 25)" filter="url(#drop-shadow2)"><path d="M-10,-5 L0,0 L-10,5 Z" fill="#FFB7B2"/><path d="M10,-5 L0,0 L10,5 Z" fill="#FFB7B2"/><circle cx="0" cy="0" r="2.5" fill="#FF9AA2"/></g><ellipse cx="55" cy="70" rx="32" ry="16" fill="#FFF" filter="url(#drop-shadow2)"/><ellipse cx="55" cy="70" rx="29" ry="13" fill="none" stroke="#C1E1C1" stroke-width="1"/><circle cx="85" cy="125" r="2" fill="#FFD1DC"/><circle cx="85" cy="121" r="2" fill="#FFD1DC"/><circle cx="81" cy="125" r="2" fill="#FFD1DC"/><circle cx="89" cy="125" r="2" fill="#FFD1DC"/><circle cx="85" cy="129" r="2" fill="#FFD1DC"/><circle cx="85" cy="125" r="1" fill="#FFF5E1"/></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><pattern id="plaid" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#F4E1E6"/><rect width="16" height="4" fill="#E6C8D3" opacity="0.6"/><rect width="4" height="16" fill="#E6C8D3" opacity="0.6"/></pattern><filter id="drop-shadow3"><feDropShadow dx="1" dy="1" stdDeviation="1" flood-opacity="0.2"/></filter></defs><rect width="100" height="140" fill="url(#plaid)"/><rect width="15" height="140" fill="#D988A1"/><path d="M15,0 Q18,5 15,10 Q18,15 15,20 Q18,25 15,30 Q18,35 15,40 Q18,45 15,50 Q18,55 15,60 Q18,65 15,70 Q18,75 15,80 Q18,85 15,90 Q18,95 15,100 Q18,105 15,110 Q18,115 15,120 Q18,125 15,130 Q18,135 15,140 L15,140" fill="none" stroke="#D988A1" stroke-width="2"/><path d="M75,25 A 5,5 0 0,0 65,25 A 5,5 0 0,0 55,25 Q 55,32 65,40 Q 75,32 75,25 Z" fill="#FFF" filter="url(#drop-shadow3)"/><path d="M25,100 L75,100 L85,110 L85,125 L25,125 Z" fill="#FFF" filter="url(#drop-shadow3)"/><polygon points="75,100 75,110 85,110" fill="#E6C8D3"/><text x="55" y="65" font-family="sans-serif" font-size="10" fill="#D988A1" font-weight="900" letter-spacing="1">L O V E</text></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#B5D8EB"/><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFF" stroke-width="0.5"/></pattern><filter id="drop-shadow4"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-opacity="0.1"/></filter></defs><rect width="100" height="140" fill="url(#grid)"/><rect width="16" height="140" fill="#FFF"/><circle cx="8" cy="20" r="1.5" fill="#FFD1DC"/><circle cx="8" cy="50" r="1.5" fill="#FFD1DC"/><circle cx="8" cy="80" r="1.5" fill="#FFD1DC"/><circle cx="8" cy="110" r="1.5" fill="#FFD1DC"/><line x1="16" y1="0" x2="16" y2="140" stroke="#AEC6CF" stroke-width="1"/><path d="M 40 45 Q 35 45 35 50 Q 30 50 30 55 Q 30 62 38 62 L 72 62 Q 80 62 80 55 Q 80 48 75 48 Q 75 42 65 42 Q 58 42 55 46 Q 52 40 45 40 Q 40 40 40 45 Z" fill="#FFF" filter="url(#drop-shadow4)"/><rect x="35" y="105" width="40" height="15" rx="2" fill="#FFF" filter="url(#drop-shadow4)"/><rect x="70" y="110" width="10" height="5" fill="#FFD1DC"/><text x="55" y="55" font-family="sans-serif" font-size="7" fill="#88B0C7" font-weight="bold">Dream</text></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><filter id="drop-shadow5"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.15"/></filter></defs><rect width="100" height="90" fill="#F4C2C2"/><rect y="90" width="100" height="50" fill="#FDFD96"/><line x1="0" y1="90" x2="100" y2="90" stroke="#FFF" stroke-width="2" stroke-dasharray="4 4"/><rect width="12" height="140" fill="#D2B48C"/><rect width="3" height="140" fill="rgba(255,255,255,0.2)"/><g transform="translate(55, 35)" filter="url(#drop-shadow5)"><path d="M0,0 Q5,-10 10,-5" fill="none" stroke="#7CB342" stroke-width="1.5"/><path d="M0,0 Q-5,-10 -10,-5" fill="none" stroke="#7CB342" stroke-width="1.5"/><circle cx="-10" cy="-3" r="4" fill="#E53935"/><circle cx="10" cy="-3" r="4" fill="#E53935"/><circle cx="-11" cy="-4" r="1" fill="#FFF"/><circle cx="9" cy="-4" r="1" fill="#FFF"/></g><rect x="25" y="60" width="60" height="20" rx="10" fill="#FFF" filter="url(#drop-shadow5)"/><text x="55" y="73" font-family="sans-serif" font-size="8" fill="#D2B48C" font-weight="bold">Sweet Day</text><polygon points="85,115 86,118 89,118 87,120 88,123 85,121 82,123 83,120 81,118 84,118" fill="#FFF"/></svg>`
            ]
        },
        {
            name: '以你为名的天使主义',
            count: 5,
            svg: `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/></linearGradient><linearGradient id="fade1" x1="0" y1="0" x2="0" y2="1"><stop offset="20%" stop-color="white" /><stop offset="100%" stop-color="black" /></linearGradient><mask id="mask1"><rect width="100" height="140" fill="url(#fade1)"/></mask><filter id="blur1"><feGaussianBlur stdDeviation="0.4"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><use href="#pixel-skull" x="0" y="0" transform="translate(10, 45) scale(2.5)" fill="#ffffff" opacity="0.08"/><text x="50" y="35" font-family="cursive, serif" font-size="5" fill="#fff" opacity="0.3">Angel</text><line x1="45" y1="38" x2="85" y2="25" stroke="#fff" stroke-width="0.2" opacity="0.4"/><g font-family="SimSun, STSong, serif"><text x="48" y="28" font-size="12" fill="#fff" filter="url(#blur1)">我</text><text x="58" y="22" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">保</text><text x="70" y="30" font-size="10" fill="url(#grad1)">證</text><text x="80" y="24" font-size="14" fill="#fff">你</text><text x="55" y="42" font-size="9" fill="#fff" mask="url(#mask1)">是</text><text x="65" y="46" font-size="16" fill="none" stroke="#fff" stroke-width="0.4">天</text><text x="82" y="40" font-size="11" fill="url(#grad1)">使</text></g></svg>`,
            svgList: [
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/></linearGradient><linearGradient id="fade1" x1="0" y1="0" x2="0" y2="1"><stop offset="20%" stop-color="white" /><stop offset="100%" stop-color="black" /></linearGradient><mask id="mask1"><rect width="100" height="140" fill="url(#fade1)"/></mask><filter id="blur1"><feGaussianBlur stdDeviation="0.4"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><use href="#pixel-skull" x="0" y="0" transform="translate(10, 45) scale(2.5)" fill="#ffffff" opacity="0.08"/><text x="50" y="35" font-family="cursive, serif" font-size="5" fill="#fff" opacity="0.3">Angel</text><line x1="45" y1="38" x2="85" y2="25" stroke="#fff" stroke-width="0.2" opacity="0.4"/><g font-family="SimSun, STSong, serif"><text x="48" y="28" font-size="12" fill="#fff" filter="url(#blur1)">我</text><text x="58" y="22" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">保</text><text x="70" y="30" font-size="10" fill="url(#grad1)">證</text><text x="80" y="24" font-size="14" fill="#fff">你</text><text x="55" y="42" font-size="9" fill="#fff" mask="url(#mask1)">是</text><text x="65" y="46" font-size="16" fill="none" stroke="#fff" stroke-width="0.4">天</text><text x="82" y="40" font-size="11" fill="url(#grad1)">使</text></g></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.3"/></linearGradient><linearGradient id="fade2" x1="0" y1="0" x2="0" y2="1"><stop offset="40%" stop-color="white" /><stop offset="100%" stop-color="black" /></linearGradient><mask id="mask2"><rect width="100" height="140" fill="url(#fade2)"/></mask><filter id="blur2"><feGaussianBlur stdDeviation="0.35"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><rect x="8" y="8" width="84" height="124" fill="none" stroke="#fff" stroke-width="0.2" opacity="0.3"/><path d="M 6 10 L 10 10 M 8 8 L 8 12" stroke="#fff" stroke-width="0.4" opacity="0.6"/><path d="M 90 130 L 94 130 M 92 128 L 92 132" stroke="#fff" stroke-width="0.4" opacity="0.6"/><use href="#pixel-skull" x="0" y="0" transform="translate(42, 110) scale(0.5)" fill="#ffffff" opacity="0.7"/><text x="85" y="20" font-family="cursive, serif" font-size="4" fill="#fff" opacity="0.3" text-anchor="end">Promise</text><polyline points="88,15 90,15 90,45" fill="none" stroke="#fff" stroke-width="0.2" opacity="0.4"/><g font-family="SimSun, STSong, serif"><text x="45" y="20" font-size="14" fill="none" stroke="#fff" stroke-width="0.4">我</text><text x="56" y="28" font-size="10" fill="url(#grad2)">保</text><text x="65" y="22" font-size="13" fill="#fff" filter="url(#blur2)">證</text><text x="76" y="32" font-size="11" fill="#fff" mask="url(#mask2)">你</text><text x="50" y="40" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">是</text><text x="64" y="45" font-size="10" fill="#fff">天</text><text x="75" y="48" font-size="12" fill="url(#grad2)">使</text></g></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.1"/></linearGradient><linearGradient id="fade3" x1="0" y1="0" x2="0" y2="1"><stop offset="10%" stop-color="white" /><stop offset="90%" stop-color="black" /></linearGradient><mask id="mask3"><rect width="100" height="140" fill="url(#fade3)"/></mask><filter id="blur3"><feGaussianBlur stdDeviation="0.5"/></filter><filter id="heavy-blur"><feGaussianBlur stdDeviation="4"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><circle cx="25" cy="25" r="15" fill="#ffffff" filter="url(#heavy-blur)" opacity="0.15"/><use href="#pixel-skull" x="0" y="0" transform="translate(15, 15) scale(0.7)" fill="#ffffff" opacity="0.6"/><text x="65" y="45" font-family="cursive, serif" font-size="6" fill="#fff" opacity="0.2" text-anchor="middle">Always</text><path d="M 45 50 A 20 20 0 0 0 85 50" fill="none" stroke="#fff" stroke-width="0.2" opacity="0.3"/><g font-family="SimSun, STSong, serif"><text x="46" y="35" font-size="10" fill="#fff" filter="url(#blur3)">我</text><text x="54" y="25" font-size="12" fill="#fff" mask="url(#mask3)">保</text><text x="65" y="20" font-size="16" fill="none" stroke="#fff" stroke-width="0.4">證</text><text x="78" y="28" font-size="14" fill="url(#grad3)">你</text><text x="52" y="45" font-size="11" fill="#fff">是</text><text x="66" y="40" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">天</text><text x="80" y="42" font-size="9" fill="#fff" filter="url(#blur3)">使</text></g></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/></linearGradient><linearGradient id="fade4" x1="0" y1="0" x2="0" y2="1"><stop offset="30%" stop-color="white" /><stop offset="100%" stop-color="black" /></linearGradient><mask id="mask4"><rect width="100" height="140" fill="url(#fade4)"/></mask><filter id="blur4"><feGaussianBlur stdDeviation="0.3"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><use href="#pixel-skull" x="0" y="0" transform="translate(60, 95) scale(1.2)" fill="#ffffff" opacity="0.15"/><path d="M 15 20 L 15 120 M 18 20 L 18 120 M 20 20 L 20 120" stroke="#fff" stroke-width="0.2" opacity="0.2"/><text x="-100" y="25" font-family="sans-serif" font-size="4" fill="#fff" opacity="0.4" transform="rotate(-90)">PROMISE . ANGEL</text><text x="88" y="50" font-family="cursive, serif" font-size="4" fill="#fff" opacity="0.3" text-anchor="end">Guardian</text><line x1="85" y1="15" x2="85" y2="45" stroke="#fff" stroke-width="0.5" stroke-dasharray="1 2" opacity="0.4"/><g font-family="SimSun, STSong, serif"><text x="48" y="22" font-size="13" fill="url(#grad4)">我</text><text x="60" y="18" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">保</text><text x="74" y="25" font-size="10" fill="#fff" filter="url(#blur4)">證</text><text x="45" y="38" font-size="11" fill="#fff" mask="url(#mask4)">你</text><text x="56" y="42" font-size="14" fill="#fff">是</text><text x="68" y="35" font-size="16" fill="none" stroke="#fff" stroke-width="0.4">天</text><text x="80" y="44" font-size="12" fill="url(#grad4)">使</text></g></svg>`,
                `<svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block;"><defs><g id="pixel-skull"><path d="M30.48 16.765H32v3.04h-1.52Z"/><path d="M30.48 12.185H32v3.05h-1.52Z"/><path d="M30.48 7.615H32v3.05h-1.52Z"/><path d="M28.96 19.805h1.52v1.53h-1.52Z"/><path d="M28.96 15.235h1.52v1.53h-1.52Z"/><path d="M28.96 10.665h1.52v1.52h-1.52Z"/><path d="M27.43 6.095h3.05v1.52h-3.05Z"/><path d="M27.43 12.185h1.53v1.53h-1.53Z"/><path d="M25.91 19.805h1.52v-6.09h-1.52v-1.53h-1.52v-3.04h-1.53v1.52h-4.57v1.52h-1.52v1.53h-1.53v-1.53h-1.52v-1.52H9.15v-1.52H7.62v3.04H6.1v1.53H4.58v6.09H6.1v1.53H3.05v1.52h4.57v1.52h1.53v1.53h1.52v1.52h1.53v1.53h1.52v1.52h4.57v-1.52h1.52v-1.53h1.53v-1.52h1.52v-1.53h1.53v-1.52h4.57v-1.52h-3.05Zm-4.57 3.05h-3.05v3.05h-4.57v-3.05h-3.05v-4.57h3.05v-3.05h4.57v3.05h3.05Z"/><path d="M24.39 7.615h3.04v1.53h-3.04Z"/><path d="M22.86 3.045h1.53v3.05h-1.53Z"/><path d="M9.15 6.095h13.71v1.52H9.15Z"/><path d="M9.15 1.525h13.71v1.52H9.15Z"/><path d="M7.62 3.045h1.53v3.05H7.62Z"/><path d="M4.58 7.615h3.04v1.53H4.58Z"/><path d="M3.05 12.185h1.53v1.53H3.05Z"/><path d="M1.53 6.095h3.05v1.52H1.53Z"/><path d="M1.53 19.805h1.52v1.53H1.53Z"/><path d="M1.53 15.235h1.52v1.53H1.53Z"/><path d="M1.53 10.665h1.52v1.52H1.53Z"/><path d="M0 16.765h1.53v3.04H0Z"/><path d="M0 12.185h1.53v3.05H0Z"/><path d="M0 7.615h1.53v3.05H0Z"/></g><linearGradient id="grad5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.1"/></linearGradient><linearGradient id="fade5" x1="0" y1="0" x2="0" y2="1"><stop offset="25%" stop-color="white" /><stop offset="100%" stop-color="black" /></linearGradient><mask id="mask5"><rect width="100" height="140" fill="url(#fade5)"/></mask><filter id="blur5"><feGaussianBlur stdDeviation="0.45"/></filter></defs><rect width="100" height="140" fill="#0a0a0a"/><line x1="0" y1="140" x2="100" y2="40" stroke="#fff" stroke-width="0.3" opacity="0.3"/><polygon points="0,140 100,40 0,40" fill="#ffffff" opacity="0.02"/><use href="#pixel-skull" x="0" y="0" transform="translate(15, 90) scale(0.8)" fill="#ffffff" opacity="0.5"/><text x="15" y="125" font-family="monospace" font-size="3" fill="#fff" opacity="0.4">LAT: 45.09 / LON: -12.33</text><text x="65" y="25" font-family="cursive, serif" font-size="5" fill="#fff" opacity="0.25" transform="rotate(15 65 25)">Forever</text><rect x="45" y="15" width="40" height="35" fill="none" stroke="#fff" stroke-width="0.2" opacity="0.2" transform="rotate(5 65 32)"/><g font-family="SimSun, STSong, serif"><text x="48" y="20" font-size="15" fill="none" stroke="#fff" stroke-width="0.4">我</text><text x="62" y="26" font-size="11" fill="#fff" filter="url(#blur5)">保</text><text x="74" y="22" font-size="14" fill="url(#grad5)">證</text><text x="52" y="38" font-size="10" fill="#fff" mask="url(#mask5)">你</text><text x="64" y="42" font-size="13" fill="none" stroke="#fff" stroke-width="0.4">是</text><text x="76" y="36" font-size="12" fill="#fff">天</text><text x="86" y="46" font-size="16" fill="url(#grad5)">使</text></g></svg>`
            ]
        },
        {
            name: '哥特暗黑·罪恶荆棘',
            count: 5,
            svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="blood-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff1a1a" /><stop offset="100%" stop-color="#8b0000" /></linearGradient><mask id="fade-mask-1"><linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="40%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><rect width="100" height="140" fill="url(#fade-mask-1)"/></mask><filter id="blur-1"><feGaussianBlur stdDeviation="0.5"/></filter></defs><rect width="100" height="140" fill="#080808" /><rect x="4" y="4" width="92" height="132" fill="none" stroke="#333" stroke-width="0.5" /><path d="M 0 20 Q 20 30 10 50 T 30 80 T 10 120" fill="none" stroke="#222" stroke-width="1" /><path d="M 100 30 Q 80 40 90 60 T 70 90 T 90 130" fill="none" stroke="#222" stroke-width="1" /><polygon points="12,35 18,38 14,42" fill="#333"/><polygon points="88,45 82,48 86,52" fill="#333"/><text x="50" y="15" font-family="serif" font-size="4.5" fill="#666" text-anchor="middle">𓏴 ₊˚𝒫𝓇𝒶𝓎𝓮𝓇 𝒾𝓈 𝓁𝒾𝓀𝓮 𝓉𝒽𝓸𝓇𝓃𝓈</text><text x="50" y="22" font-family="serif" font-size="4.5" fill="#666" text-anchor="middle">𝒷𝓮𝓉𝓌𝓮𝓮𝓃 𝓉𝒽𝓮 𝓁𝒾𝓅𝓈 𝒶𝓃𝒹 𝓉𝓮𝓮𝓉𝒽₊˚.𓏴</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="15" y="50" font-size="24" fill="url(#blood-grad)">祷</text><text x="35" y="55" font-size="20" fill="none" stroke="#ff1a1a" stroke-width="0.5">告</text><text x="55" y="45" font-size="16" fill="#8b0000" filter="url(#blur-1)">词</text><text x="75" y="60" font-size="12" fill="#555">是</text><text x="15" y="85" font-size="18" fill="#444">唇</text><text x="30" y="95" font-size="22" fill="none" stroke="#666" stroke-width="0.5">齿</text><text x="52" y="80" font-size="14" fill="#555" filter="url(#blur-1)">间</text><text x="65" y="85" font-size="10" fill="#333">的</text><text x="25" y="125" font-size="32" fill="url(#blood-grad)" mask="url(#fade-mask-1)">荆</text><text x="55" y="115" font-size="28" fill="#8b0000" mask="url(#fade-mask-1)">棘</text></g></svg>`,
            svgList: [
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="blood-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff1a1a" /><stop offset="100%" stop-color="#8b0000" /></linearGradient><mask id="fade-mask-1"><linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="40%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><rect width="100" height="140" fill="url(#fade-mask-1)"/></mask><filter id="blur-1"><feGaussianBlur stdDeviation="0.5"/></filter></defs><rect width="100" height="140" fill="#080808" /><rect x="4" y="4" width="92" height="132" fill="none" stroke="#333" stroke-width="0.5" /><path d="M 0 20 Q 20 30 10 50 T 30 80 T 10 120" fill="none" stroke="#222" stroke-width="1" /><path d="M 100 30 Q 80 40 90 60 T 70 90 T 90 130" fill="none" stroke="#222" stroke-width="1" /><polygon points="12,35 18,38 14,42" fill="#333"/><polygon points="88,45 82,48 86,52" fill="#333"/><text x="50" y="15" font-family="serif" font-size="4.5" fill="#666" text-anchor="middle">𓏴 ₊˚𝒫𝓇𝒶𝓎𝓮𝓇 𝒾𝓈 𝓁𝒾𝓀𝓮 𝓉𝒽𝓸𝓇𝓃𝓈</text><text x="50" y="22" font-family="serif" font-size="4.5" fill="#666" text-anchor="middle">𝒷𝓮𝓉𝓌𝓮𝓮𝓃 𝓉𝒽𝓮 𝓁𝒾𝓅𝓈 𝒶𝓃𝒹 𝓉𝓮𝓮𝓉𝒽₊˚.𓏴</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="15" y="50" font-size="24" fill="url(#blood-grad)">祷</text><text x="35" y="55" font-size="20" fill="none" stroke="#ff1a1a" stroke-width="0.5">告</text><text x="55" y="45" font-size="16" fill="#8b0000" filter="url(#blur-1)">词</text><text x="75" y="60" font-size="12" fill="#555">是</text><text x="15" y="85" font-size="18" fill="#444">唇</text><text x="30" y="95" font-size="22" fill="none" stroke="#666" stroke-width="0.5">齿</text><text x="52" y="80" font-size="14" fill="#555" filter="url(#blur-1)">间</text><text x="65" y="85" font-size="10" fill="#333">的</text><text x="25" y="125" font-size="32" fill="url(#blood-grad)" mask="url(#fade-mask-1)">荆</text><text x="55" y="115" font-size="28" fill="#8b0000" mask="url(#fade-mask-1)">棘</text></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="silver-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" /><stop offset="50%" stop-color="#a0a0a0" /><stop offset="100%" stop-color="#555555" /></linearGradient><filter id="blur-2"><feGaussianBlur stdDeviation="0.6"/></filter></defs><rect width="100" height="140" fill="#0a0a0a" /><path d="M 48 20 L 52 20 L 52 45 L 75 45 L 75 49 L 52 49 L 52 110 L 48 110 L 48 49 L 25 49 L 25 45 L 48 45 Z" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/><circle cx="50" cy="47" r="15" fill="none" stroke="#222" stroke-width="0.5" /><text x="50" y="125" font-family="serif" font-size="4.5" fill="#888" text-anchor="middle">‧⁺˚⋆*。ᵗʰᵉ ᶜʳᵒˢˢ ᵗᵃᵏᵉˢ ʳᵒᵒᵗ</text><text x="50" y="132" font-family="serif" font-size="4.5" fill="#888" text-anchor="middle">ᶦⁿ ᵗʰᵉ ʰᵉᵃʳᵗ‧₊˚⟡</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="20" y="40" font-size="22" fill="url(#silver-grad)">十</text><text x="40" y="55" font-size="26" fill="none" stroke="#ccc" stroke-width="0.8">字</text><text x="65" y="45" font-size="20" fill="url(#silver-grad)">架</text><text x="25" y="75" font-size="12" fill="#666">于</text><text x="35" y="85" font-size="18" fill="#999" filter="url(#blur-2)">心</text><text x="52" y="80" font-size="16" fill="#777">脏</text><text x="68" y="88" font-size="14" fill="none" stroke="#888" stroke-width="0.5">中</text><text x="30" y="110" font-size="24" fill="url(#silver-grad)">生</text><text x="55" y="105" font-size="22" fill="#fff" opacity="0.8">根</text></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><mask id="fade-mask-3"><linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="20%" stop-color="white"/><stop offset="90%" stop-color="black"/></linearGradient><rect width="100" height="140" fill="url(#fade-mask-3)"/></mask><filter id="blur-3"><feGaussianBlur stdDeviation="0.4"/></filter></defs><rect width="100" height="140" fill="#f4f4f4" /><g stroke="#e0e0e0" stroke-width="0.5" fill="none"><circle cx="50" cy="70" r="40" /><circle cx="50" cy="70" r="35" /><path d="M 10 70 L 90 70 M 50 30 L 50 110 M 22 42 L 78 98 M 22 98 L 78 42" /><circle cx="50" cy="70" r="10" /></g><circle cx="50" cy="115" r="1.5" fill="#8a0303" /><path d="M 50 115 Q 50 110 50 110 Q 50 115 50 115" stroke="#8a0303" stroke-width="1"/><text x="50" y="20" font-family="serif" font-size="4.5" fill="#555" text-anchor="middle">♱˚₊𝑜𝑠𝑒 𝑤𝑖𝑛𝑑𝑜𝑤 𝑤𝑜𝑣𝑒𝑛</text><text x="50" y="26" font-family="serif" font-size="4.5" fill="#555" text-anchor="middle">𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 ℎ𝑒𝑎𝑟𝑡ﾟ✧*｡</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="20" y="50" font-size="14" fill="#333">用</text><text x="35" y="65" font-size="32" fill="#8a0303">心</text><text x="65" y="55" font-size="28" fill="none" stroke="#8a0303" stroke-width="0.8">脏</text><text x="25" y="80" font-size="12" fill="#666" filter="url(#blur-3)">织</text><text x="38" y="85" font-size="14" fill="#444">成</text><text x="52" y="78" font-size="10" fill="#888">的</text><text x="20" y="105" font-size="22" fill="#8a0303" mask="url(#fade-mask-3)">玫</text><text x="42" y="110" font-size="20" fill="none" stroke="#8a0303" stroke-width="0.5">瑰</text><text x="62" y="100" font-size="24" fill="#5c0000" mask="url(#fade-mask-3)">窗</text></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dark-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0000" /><stop offset="100%" stop-color="#000000" /></linearGradient><mask id="fade-mask-4"><linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="50%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><rect width="100" height="140" fill="url(#fade-mask-4)"/></mask><filter id="blur-4"><feGaussianBlur stdDeviation="0.7"/></filter></defs><rect width="100" height="140" fill="url(#dark-red)" /><rect x="6" y="6" width="88" height="128" fill="none" stroke="#4a0000" stroke-width="1" /><rect x="8" y="8" width="84" height="124" fill="none" stroke="#222" stroke-width="0.5" /><path d="M 0 100 L 30 90 L 40 110 L 100 80" fill="none" stroke="#111" stroke-width="2" /><text x="50" y="120" font-family="serif" font-size="4" fill="#777" text-anchor="middle">✧･ﾟ𝓢𝓲𝓷 𝓶𝓪𝓷𝓲𝓯𝓮𝓼𝓽𝓼 𝓲𝓽𝓼𝓮𝓵𝓯</text><text x="50" y="126" font-family="serif" font-size="4" fill="#777" text-anchor="middle">𝓲𝓷 𝓽𝓱𝓮 𝓮𝓶𝓪𝓬𝓲𝓪𝓽𝓮𝓭 𝓬𝓻𝓸𝓼𝓼 ₊ഒﾟ*</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="12" y="40" font-size="34" fill="#ff1a1a">罪</text><text x="45" y="50" font-size="30" fill="none" stroke="#ff1a1a" stroke-width="1">恶</text><text x="75" y="35" font-size="12" fill="#666">在</text><text x="15" y="70" font-size="18" fill="#888" filter="url(#blur-4)">蚀</text><text x="35" y="65" font-size="20" fill="none" stroke="#aaa" stroke-width="0.5">骨</text><text x="55" y="75" font-size="14" fill="#555">的</text><text x="20" y="100" font-size="22" fill="#ccc" mask="url(#fade-mask-4)">十</text><text x="42" y="95" font-size="18" fill="#999">字</text><text x="60" y="105" font-size="24" fill="#fff" mask="url(#fade-mask-4)">架</text><text x="75" y="85" font-size="10" fill="#444">中</text><text x="82" y="95" font-size="12" fill="#666" filter="url(#blur-4)">显</text><text x="85" y="108" font-size="14" fill="#888">现</text></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="silver-grad-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" /><stop offset="100%" stop-color="#777777" /></linearGradient><mask id="fade-mask-5"><linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="30%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><rect width="100" height="140" fill="url(#fade-mask-5)"/></mask><filter id="blur-5"><feGaussianBlur stdDeviation="0.5"/></filter></defs><rect width="100" height="140" fill="#030303" /><path d="M 50 20 C 20 20 10 50 10 70 C 10 50 30 40 50 40 C 70 40 90 50 90 70 C 90 50 80 20 50 20 Z" fill="none" stroke="#222" stroke-width="1" /><path d="M 50 25 C 25 25 15 50 15 65 C 15 50 35 45 50 45 C 65 45 85 50 85 65 C 85 50 75 25 50 25 Z" fill="none" stroke="#333" stroke-width="0.5" /><text x="50" y="15" font-family="serif" font-size="4.5" fill="#888" text-anchor="middle">ଘ *°𝓜𝓎 𝓅𝒾𝓮𝓉𝓎 𝒽𝒶𝓈</text><text x="50" y="21" font-family="serif" font-size="4.5" fill="#888" text-anchor="middle">𝒷𝓇𝓸𝓊𝓰𝒽𝓉 𝓈𝒾𝓃 ⑅。* ଓ</text><g font-family="SimSun, STSong, serif" font-weight="bold"><text x="25" y="45" font-size="14" fill="#666">我</text><text x="40" y="40" font-size="12" fill="#444">的</text><text x="15" y="75" font-size="28" fill="url(#silver-grad-2)">虔</text><text x="45" y="65" font-size="24" fill="none" stroke="#ccc" stroke-width="0.8">诚</text><text x="70" y="80" font-size="16" fill="#888" filter="url(#blur-5)">带</text><text x="82" y="90" font-size="14" fill="#666">来</text><text x="75" y="100" font-size="12" fill="#444">了</text><text x="20" y="115" font-size="32" fill="#ff1a1a" mask="url(#fade-mask-5)">罪</text><text x="50" y="125" font-size="36" fill="#8b0000" mask="url(#fade-mask-5)">恶</text></g></svg>`
            ]
        },
        {
            name: 'iOS 极简蓝色文件夹',
            count: 5,
            transparentBg: true,
            svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`,
            svgList: [
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`,
                `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="back-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb5e3" /><stop offset="100%" stop-color="#6aa6d6" /></linearGradient><linearGradient id="front-blue-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(163, 209, 245, 0.95)" /><stop offset="100%" stop-color="rgba(132, 187, 240, 0.95)" /></linearGradient><filter id="shadow-5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.08"/></filter><filter id="doc-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/></filter></defs><g transform="translate(0, 10)"><path d="M 12 46 C 12 43 14 41 17 41 L 37 41 C 39 41 41 42.5 42 44.5 L 45 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#back-blue-5)" /><rect x="22" y="45" width="35" height="40" rx="2" fill="#ffffff" filter="url(#doc-shadow)" transform="rotate(-5, 22, 45)" /><rect x="35" y="48" width="35" height="40" rx="2" fill="#f8f8f8" filter="url(#doc-shadow)" /><line x1="40" y1="55" x2="60" y2="55" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="60" x2="65" y2="60" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><line x1="40" y1="65" x2="55" y2="65" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round" /><path d="M 12 56 C 12 53 14 51 17 51 L 83 51 C 86 51 88 53 88 56 L 88 103 C 88 106 86 108 83 108 L 17 108 C 14 108 12 106 12 103 Z" fill="url(#front-blue-5)" filter="url(#shadow-5)" /><path d="M 14 52 L 86 52" stroke="rgba(255,255,255,0.6)" stroke-width="0.5" fill="none" /></g></svg>`
            ]
        }
    ];
// =========================================================================
// 阅读 APP 核心逻辑 (js/readen-app.js) - 第 3 部分 (3/4)
// =========================================================================

    // --- 内部状态变量 ---
    let currentGroup = '全部';
    let currentActionBookId = null; 
    let isMultiSelectMode = false;  
    let selectedBookIds = new Set(); 
    let tempBase64Image = null; 
    let currentSortMethod = 'lastRead';
    // Catalog order in the chapter drawer for this session (false = first chapter on top).
    let readenCatalogReversed = false; 
    let currentFbTab = 'font'; 
    let currentBookDetailsId = null;
    let currentReaderBookId = null;
    let currentReaderChapterIndex = 0;
    let readerProgressSaveTimer = null;
    const READEN_READER_PROGRESS_SAVE_DELAY = 1600;
    let readerPreferenceSaveTimer = null;
    const READEN_READER_PREFERENCE_SAVE_DELAY = 220;
    let readerStatsTimer = null;
    let readerSessionStartedAt = 0;
    let readerSessionTurnCount = 0;
    // Reading time already added to stats.totalMs during the current session.
    let readerSessionCommittedMs = 0;
    // Wall-clock start of the current session; used as the session record id.
    let readerSessionBeganAt = 0;
    // True while the page is hidden; hidden time is not counted as reading.
    let readerSessionPaused = false;
    let readerStatsPanelOffsets = { day: 0, week: 0, month: 0, year: 0 };
    let readerStatsRenderTimer = null;
    let readerCurrentPage = 0;
    let readerTotalPages = 1;
    let readerAnimMode = 'shift';
    let readerPageTurnLocked = false;
    // Running page-turn animation ({ finish }), so a new tap can end it at once.
    let readerPageTurnAnimation = null;
    let readerPageTransformRaf = 0;
    let readerFontSize = 18;
    let readerBrightness = 100;
    let tempThemeImages = [];
    let draggedItemIndex = null;
    let readerLastTouchTapAt = 0;
    let readenSearchMode = 'online';
    let readenSearchTimer = null;
    let readenSearchRequestToken = 0;
    let readenLastOnlineSearchResults = [];
    let readenSearchContentResults = [];
    let readenSpeechUtterance = null;
    let readenSpeechAudio = null;
    let readenSpeechAudioUrl = '';
    let readenSpeechState = null;
    let readenSpeechToken = 0;
    let readenSelectionResult = null;
    let readenPendingUserAnnotation = null;
    let readenCustomSelection = null;
    let readenSelectionGesture = null;
    let readenSelectionHandleDrag = null;
    let readenProfileDraft = null;
    const READEN_COREADING_SCHEMA_VERSION = 1;
    const READEN_ANNOTATION_CONTEXT_LIMIT = 64;
    // How long a finger must rest on the text before the word under it is selected.
    const READEN_LONG_PRESS_MS = 520;
    const readenTitleStyles = [
        { id: 'quiet-space', name: '静页余白', desc: '极简居中标题，以细线收束留白' },
        { id: 'ink-double', name: '墨痕双界', desc: '上下细线分隔，适合正文密集的作品' },
        { id: 'left-mark', name: '左锋题签', desc: '左对齐标题，以主题色竖线强调' },
        { id: 'dark-card', name: '暗幕章牌', desc: '深色标题卡片，适合悬疑或暗色题材' },
        { id: 'crimson-order', name: '绛紫章序', desc: '暗紫章节序号搭配朱红章名，形成上下分色' },
        { id: 'sea-label', name: '海青编号', desc: '青蓝底色编号块搭配左对齐章名' },
        { id: 'center-badge', name: '中央章徽', desc: '胶囊式章节序号居中悬于章名上方' },
        { id: 'border-index', name: '边框索引', desc: '完整细框搭配主题色粗边，结构清晰醒目' },
        { id: 'giant-order', name: '巨幅序标', desc: '放大章节序号，以字号层级区分章名' },
        { id: 'mist-card', name: '雾纸卡笺', desc: '浅色纸笺背景与轻阴影，形成独立章卡' },
        { id: 'reverse-title', name: '逆序刊题', desc: '章名在上，章节序号在下的右对齐倒装排版' },
        { id: 'seal-drop', name: '方印落款', desc: '章名在上，印章式章节序号居中落款' },
        { id: 'ticket-page', name: '旧票章页', desc: '暖纸色虚线章卡搭配胶囊式章节序号' },
        { id: 'half-marker', name: '半染标线', desc: '半高色带标记序号，以底线收束左对齐章名' },
        { id: 'paper-rite', name: '纸纹礼记', desc: '纸纹卡片衬托右侧序号与左侧章名' }
    ];

    const readerPresetThemes = [
        { id: 'reader-preset-green', name: '淡绿', value: '#dcedd9', textColor: '#555555', type: 'color' },
        { id: 'reader-preset-yellow', name: '淡黄', value: '#f5e1c8', textColor: '#555555', type: 'color' },
        { id: 'reader-preset-white', name: '纯白', value: '#ffffff', textColor: '#333333', type: 'color', bordered: true },
        { id: 'reader-preset-paper', name: '纸白', value: '#f0f0f0', textColor: '#555555', type: 'color' },
        { id: 'reader-preset-pink', name: '淡粉', value: '#fce4e4', textColor: '#555555', type: 'color' }
    ];

    const readerBuiltinFonts = [
        { id: 'reader-font-default', name: '默认字体', css: 'inherit', preview: 'Aa 4g 中文' },
        { id: 'reader-font-song', name: '宋体', css: 'SimSun, STSong, serif', preview: 'Aa 4g 中文' },
        { id: 'reader-font-yahei', name: '微软雅黑', css: '"Microsoft YaHei", sans-serif', preview: 'Aa 4g 中文' },
        { id: 'reader-font-serif', name: '衬线', css: 'Georgia, "Times New Roman", serif', preview: 'Aa 4g 中文' }
    ];

    function ensureReaderPreferenceState() {
        if (!readenSettings.readerFontId) readenSettings.readerFontId = 'reader-font-default';
        if (!readenSettings.readerThemeId) readenSettings.readerThemeId = 'reader-preset-white';
        if (!readenSettings.readerThemeType) readenSettings.readerThemeType = 'color';
        if (!readenSettings.readerThemeValue) readenSettings.readerThemeValue = '#ffffff';
        if (!Array.isArray(readenSettings.readerFonts)) readenSettings.readerFonts = [];
        if (!Array.isArray(readenSettings.readerCustomBackgrounds)) readenSettings.readerCustomBackgrounds = [];
        if (!['system', 'character'].includes(readenSettings.speechVoiceMode)) readenSettings.speechVoiceMode = 'system';

        const storedFontSize = Number(readenSettings.readerFontSize);
        readenSettings.readerFontSize = Number.isFinite(storedFontSize)
            ? Math.max(12, Math.min(36, storedFontSize))
            : 18;

        const storedBrightness = Number(readenSettings.readerBrightness);
        readenSettings.readerBrightness = Number.isFinite(storedBrightness)
            ? Math.max(20, Math.min(100, storedBrightness))
            : 100;

        const storedSpacing = Number(readenSettings.readerSpacing);
        readenSettings.readerSpacing = [1, 2, 3].includes(storedSpacing) ? storedSpacing : 2;
        if (!['shift', 'curl', 'scroll'].includes(readenSettings.readerAnimMode)) {
            readenSettings.readerAnimMode = 'shift';
        }
        readenSettings.readerNightMode = Boolean(readenSettings.readerNightMode);
    }

    function scheduleReaderPreferenceSave() {
        if (readerPreferenceSaveTimer) clearTimeout(readerPreferenceSaveTimer);
        readerPreferenceSaveTimer = setTimeout(() => {
            readerPreferenceSaveTimer = null;
            saveReadenAppData();
        }, READEN_READER_PREFERENCE_SAVE_DELAY);
    }

    function flushReaderPreferenceSave() {
        if (!readerPreferenceSaveTimer) return Promise.resolve(true);
        clearTimeout(readerPreferenceSaveTimer);
        readerPreferenceSaveTimer = null;
        return saveReadenAppData();
    }

    function restoreReaderRuntimePreferences() {
        ensureReaderPreferenceState();
        readerFontSize = readenSettings.readerFontSize;
        readerBrightness = readenSettings.readerBrightness;
        readerAnimMode = readenSettings.readerAnimMode;
        isNightMode = Boolean(readenSettings.readerNightMode);

        changeReaderFontSize(readerFontSize, true, false);
        changeReaderBrightness(readerBrightness, true, false);
        changeReaderSpacing(readenSettings.readerSpacing, false);
        selectAnimMode(readerAnimMode, false);
        applyReaderNightMode(isNightMode, false);
    }

    function ensureReadenProfileState() {
        if (typeof readenSettings.profileName !== 'string' || !readenSettings.profileName.trim()) {
            readenSettings.profileName = '小岛梨花';
        }
        if (typeof readenSettings.profileAvatar !== 'string') readenSettings.profileAvatar = '';
        if (typeof readenSettings.profileSign !== 'string' || !readenSettings.profileSign.trim()) {
            readenSettings.profileSign = '遇你如春水映梨花';
        }
    }

    function getReadenProfileDisplayName() {
        ensureReadenProfileState();
        return readenSettings.profileName || '小岛梨花';
    }

    function getReadenProfileAvatar() {
        ensureReadenProfileState();
        return readenSettings.profileAvatar || '';
    }

    function getReadenProfileSign() {
        ensureReadenProfileState();
        return readenSettings.profileSign || '遇你如春水映梨花';
    }

    function getReaderFontOptions() {
        ensureReaderPreferenceState();
        return [...readerBuiltinFonts, ...readenSettings.readerFonts];
    }

    function getReaderThemeOptions() {
        ensureReaderPreferenceState();
        return [...readerPresetThemes, ...readenSettings.readerCustomBackgrounds];
    }

    function readerFontFamilyValue(font) {
        return font?.css || font?.family || 'inherit';
    }

    function registerReaderFontFace(font) {
        if (!font || font.type !== 'custom' || !font.family || !font.source) return;
        const styleId = `readen-reader-font-face-${font.id}`;
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `@font-face { font-family: '${font.family}'; src: url('${font.source}'); font-display: swap; }`;
        document.head.appendChild(style);
    }

    function applyReaderFontById(fontId, shouldSave = true) {
        ensureReaderPreferenceState();
        const font = getReaderFontOptions().find(item => item.id === fontId) || readerBuiltinFonts[0];
        readenSettings.readerFontId = font.id;
        readenSettings.readerFontName = font.name;
        readenSettings.readerFontValue = readerFontFamilyValue(font);
        if (font.type === 'custom') registerReaderFontFace(font);
        const readerContent = document.getElementById('readen-reader-content');
        if (readerContent) readerContent.style.fontFamily = readerFontFamilyValue(font);
        if (shouldSave) saveReadenAppData();
        renderReaderFontPanel();
    }

    function readerThemeStyles(theme) {
        if (!theme) return { background: '#ffffff', image: '' };
        return {
            background: theme.type === 'image' ? 'transparent' : theme.value,
            image: theme.type === 'image' ? theme.value : ''
        };
    }

    function applyReaderThemeById(themeId, shouldSave = true) {
        ensureReaderPreferenceState();
        const theme = getReaderThemeOptions().find(item => item.id === themeId) || readerPresetThemes[2];
        const readerContainer = document.getElementById('readen-reader-container');
        const readerContent = document.getElementById('readen-reader-content');
        const styles = readerThemeStyles(theme);

        readenSettings.readerThemeId = theme.id;
        readenSettings.readerThemeName = theme.name;
        readenSettings.readerThemeType = theme.type;
        readenSettings.readerThemeValue = theme.value;

        if (readerContainer) {
            readerContainer.style.backgroundColor = styles.background;
            readerContainer.style.backgroundImage = styles.image ? `url(${styles.image})` : 'none';
            readerContainer.style.backgroundSize = styles.image ? 'cover' : '';
            readerContainer.style.backgroundPosition = styles.image ? 'center center' : '';
            readerContainer.style.backgroundRepeat = styles.image ? 'no-repeat' : '';
        }
        if (readerContent) {
            readerContent.style.backgroundColor = styles.background === 'transparent' ? 'transparent' : styles.background;
            readerContent.style.backgroundImage = 'none';
        }
        const label = document.getElementById('readen-reader-theme-label');
        if (label) label.textContent = `当前为${theme.name}`;
        if (shouldSave) saveReadenAppData();
        renderReaderThemeStrip();
    }

    function addReaderCustomFont(source, nameHint) {
        ensureReaderPreferenceState();
        const fontId = `reader-font-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const family = `ReadenFont_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
        const font = {
            id: fontId,
            name: nameHint || '自定义字体',
            family,
            css: `'${family}'`,
            source,
            type: 'custom'
        };
        registerReaderFontFace(font);
        readenSettings.readerFonts.push(font);
        saveReadenAppData();
        applyReaderFontById(font.id, false);
        renderReaderFontPanel();
    }

    function addReaderCustomBackground(source, nameHint) {
        ensureReaderPreferenceState();
        const bg = {
            id: `reader-bg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            name: nameHint || '自定义背景',
            value: source,
            type: 'image'
        };
        readenSettings.readerCustomBackgrounds.push(bg);
        saveReadenAppData();
        applyReaderThemeById(bg.id, false);
        renderReaderThemeStrip();
    }

    function renderReaderFontPanel() {
        const list = document.getElementById('readen-reader-font-list');
        if (!list) return;
        const options = getReaderFontOptions();
        list.innerHTML = options.map(font => {
            const isActive = readenSettings.readerFontId === font.id;
            const fontCss = escapeReadenAttribute(readerFontFamilyValue(font));
            const preview = escapeReadenHtml(font.preview || 'Aa 123 中文');
            return `
                <button type="button" class="rf-font-item ${isActive ? 'active' : ''}" data-reader-font-id="${escapeReadenAttribute(font.id)}" style="font-family: ${fontCss};">
                    <div class="rf-font-item-text">
                        <div class="rf-font-name">${escapeReadenHtml(font.name)}</div>
                        <div class="rf-font-sample">${preview}</div>
                    </div>
                    ${isActive ? '<div class="rf-font-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
                </button>
            `;
        }).join('');
        list.querySelectorAll('[data-reader-font-id]').forEach(item => {
            item.addEventListener('click', () => applyReaderFontById(item.dataset.readerFontId));
        });
    }

    function renderReaderThemeStrip() {
        const strip = document.getElementById('readen-reader-theme-strip');
        if (!strip) return;
        const options = getReaderThemeOptions();
        strip.innerHTML = options.map(theme => {
            const isActive = readenSettings.readerThemeId === theme.id;
            const previewStyle = theme.type === 'image'
                ? `background-image: url(${escapeReadenAttribute(theme.value)}); background-size: cover; background-position: center; color: #ffffff;`
                : `background: ${theme.value}; color: ${theme.textColor || '#555'};${theme.bordered ? ' border: 1px solid #eee;' : ''}`;
            return `
                <button type="button" class="rf-color-box ${isActive ? 'active' : ''}" data-reader-theme-id="${escapeReadenAttribute(theme.id)}" style="${previewStyle}">
                    ${escapeReadenHtml(theme.name)}
                    ${isActive ? '<div class="rf-color-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
                </button>
            `;
        }).join('') + `
            <button type="button" class="rf-color-more" id="readen-reader-custom-bg-btn">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span>自定义</span>
            </button>
        `;
        strip.querySelectorAll('[data-reader-theme-id]').forEach(item => {
            item.addEventListener('click', () => applyReaderThemeById(item.dataset.readerThemeId));
        });
        document.getElementById('readen-reader-custom-bg-btn')?.addEventListener('click', openReaderCustomBackgroundPanel);
    }

    function showReaderFontMainView() {
        document.getElementById('readen-reader-font-main-view')?.style.setProperty('display', 'flex');
        document.getElementById('readen-reader-font-list-view')?.style.setProperty('display', 'none');
    }

    function showReaderFontListView() {
        document.getElementById('readen-reader-font-main-view')?.style.setProperty('display', 'none');
        document.getElementById('readen-reader-font-list-view')?.style.setProperty('display', 'flex');
        renderReaderFontPanel();
    }

    function openReaderCustomBackgroundPanel() {
        openReaderToolPanel('readen-reader-bg-panel');
    }

    function safeDecodeReadenName(value) {
        try {
            return decodeURIComponent(value);
        } catch (error) {
            return value;
        }
    }

    function handleReaderFontUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = loadEvent => {
            addReaderCustomFont(loadEvent.target.result, file.name);
            event.target.value = '';
        };
        reader.onerror = () => {
            showReadenDialog({ type: 'confirm', title: '字体上传失败', msg: '请换一个字体文件再试。' });
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    }

    function addReaderFontByUrl() {
        const doAdd = url => {
            const fontUrl = String(url || '').trim();
            if (!fontUrl) return;
            if (!/^https?:\/\//i.test(fontUrl)) {
                showReadenDialog({ type: 'confirm', title: 'URL无效', msg: '请输入以 http:// 或 https:// 开头的字体文件地址。' });
                return;
            }
            const filename = fontUrl.split('/').pop().split('?')[0] || 'URL字体';
            addReaderCustomFont(fontUrl, safeDecodeReadenName(filename));
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('URL导入字体', { placeholder: '请输入字体文件URL', value: '' }, '确定').then(doAdd);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: 'URL导入字体',
                placeholder: '请输入字体文件URL',
                onConfirm: doAdd
            });
        }
    }

    function handleReaderBackgroundUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = loadEvent => {
            closeReaderToolPanels();
            addReaderCustomBackground(loadEvent.target.result, file.name || '自定义背景');
            event.target.value = '';
        };
        reader.onerror = () => {
            showReadenDialog({ type: 'confirm', title: '背景上传失败', msg: '请换一张图片再试。' });
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    }

    function addReaderBackgroundByUrl() {
        closeReaderToolPanels();
        const doAdd = url => {
            const imageUrl = String(url || '').trim();
            if (!imageUrl) return;
            if (!/^https?:\/\//i.test(imageUrl)) {
                showReadenDialog({ type: 'confirm', title: 'URL无效', msg: '请输入以 http:// 或 https:// 开头的图片地址。' });
                return;
            }
            const filename = imageUrl.split('/').pop().split('?')[0] || 'URL背景';
            addReaderCustomBackground(imageUrl, safeDecodeReadenName(filename));
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('URL导入背景', { placeholder: '请输入图片URL', value: '' }, '确定').then(doAdd);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: 'URL导入背景',
                placeholder: '请输入图片URL',
                onConfirm: doAdd
            });
        }
    }

    function injectReaderPreferencePanels() {
        const readerContainer = document.getElementById('readen-reader-container');
        if (!readerContainer || document.getElementById('readen-reader-font-panel')) return;
        const legacyFontMenu = document.getElementById('readen-reader-font-menu');
        if (legacyFontMenu) legacyFontMenu.style.display = 'none';
        readerContainer.insertAdjacentHTML('beforeend', `
            <div class="reader-tool-panel reader-font-panel" id="readen-reader-font-panel" aria-hidden="true">
                <div class="reader-tool-backdrop" data-reader-tool-close></div>
                <section class="reader-tool-sheet reader-font-sheet" role="dialog" aria-label="阅读设置">
                    <div class="reader-tool-handle"></div>
                    <div class="rf-view rf-main-view" id="readen-reader-font-main-view">
                        <div class="rf-new-row">
                            <div class="rf-slider-wrap">
                                <span class="rf-slider-label">暗</span>
                                <div class="rf-slider-track-container">
                                    <input type="range" class="rf-new-slider" id="readen-rf-bright-slider-live" min="20" max="100" value="100">
                                    <div class="rf-thumb-text" id="readen-rf-bright-text-live">100</div>
                                </div>
                                <span class="rf-slider-label" style="opacity: 0;">明</span>
                            </div>
                        </div>
                        <div class="rf-new-row">
                            <div class="rf-slider-wrap">
                                <span class="rf-slider-label">小</span>
                                <div class="rf-slider-track-container">
                                    <input type="range" class="rf-new-slider" id="readen-rf-size-slider-live" min="12" max="36" value="26">
                                    <div class="rf-thumb-text" id="readen-rf-size-text-live">26.0</div>
                                </div>
                                <span class="rf-slider-label">大</span>
                            </div>
                            <button type="button" class="rf-nav-btn" id="readen-reader-font-list-btn">字体 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                        <div class="rf-new-row">
                            <div class="rf-slider-wrap">
                                <span class="rf-slider-label">紧</span>
                                <div class="rf-slider-track-container">
                                    <input type="range" class="rf-new-slider" id="readen-rf-spacing-slider-live" min="1" max="3" value="2">
                                    <div class="rf-thumb-text" id="readen-rf-spacing-text-live">中</div>
                                </div>
                                <span class="rf-slider-label">松</span>
                            </div>
                            <button type="button" class="rf-nav-btn">排版 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                        <div class="rf-theme-header">
                            <div class="rf-theme-title">
                                阅读主题 <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><br>
                                <span class="rf-theme-sub" id="readen-reader-theme-label">当前为纯白</span>
                            </div>
                            <button type="button" class="rf-nav-btn" id="readen-reader-theme-sheet-btn">本书主题 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                        <div class="rf-theme-colors" id="readen-reader-theme-strip"></div>
                        <div class="rf-bottom-btns">
                            <button type="button" class="rf-big-btn" id="readen-rf-anim-val-live">翻页动画 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                            <button type="button" class="rf-big-btn">更多设置 <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                        </div>
                    </div>
                    <div class="rf-view rf-font-view" id="readen-reader-font-list-view" style="display: none;">
                        <div class="rf-font-view-header">
                            <button type="button" class="rf-font-back-btn" id="readen-reader-font-back-btn" aria-label="返回">
                                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <div class="rf-font-view-title">字体</div>
                            <div class="rf-font-view-actions">
                                <button type="button" class="rf-font-upload-btn" id="readen-reader-font-local-btn">本地</button>
                                <button type="button" class="rf-font-upload-btn outline" id="readen-reader-font-url-btn">URL</button>
                            </div>
                        </div>
                        <div class="rf-font-list" id="readen-reader-font-list"></div>
                        <input type="file" id="readen-reader-font-input" accept=".ttf,.otf,.woff,.woff2" style="display: none;">
                    </div>
                </section>
            </div>
            <div class="reader-tool-panel" id="readen-reader-bg-panel" aria-hidden="true">
                <div class="reader-tool-backdrop" data-reader-tool-close></div>
                <section class="reader-tool-sheet reader-bg-sheet" role="dialog" aria-label="自定义背景">
                    <div class="reader-tool-handle"></div>
                    <div class="reader-tool-title">自定义背景</div>
                    <div class="reader-bg-actions">
                        <button type="button" class="reader-tool-btn primary" id="readen-reader-bg-local-btn">本地上传</button>
                        <button type="button" class="reader-tool-btn muted" id="readen-reader-bg-url-btn">URL上传</button>
                    </div>
                    <input type="file" id="readen-reader-bg-input" accept="image/*" style="display: none;">
                </section>
            </div>
        `);
    }

    function getReadenOnlineSearchUrl(keyword) {
        const query = `q=${encodeURIComponent(keyword)}&type=all&limit=36`;
        return `/api/readen/search?${query}`;
    }

    // --- DOM 元素引用 (在 init 中赋值) ---
    function bindReadenOptional(id, eventName, handler, options) {
        const element = document.getElementById(id);
        if (!element) return null;
        element.addEventListener(eventName, handler, options);
        return element;
    }

    function closeReaderToolPanels() {
        document.querySelectorAll('.reader-tool-panel.active').forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
    }

    function closeReaderChromeMenus() {
        document.getElementById('readen-reader-top-menu')?.classList.remove('show');
        document.getElementById('readen-reader-bottom-menu')?.classList.remove('show');
        document.getElementById('readen-reader-page-mode-switch')?.classList.remove('show');
        document.getElementById('readen-reader-font-menu')?.classList.remove('show');
        closeReaderToolPanels();
    }

    function openReaderToolPanel(id) {
        pauseReadenSpeech();
        closeReaderChromeMenus();
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
    }

    function getReaderActiveText() {
        const book = getCurrentReaderBook();
        if (!book) return '';
        const chapter = getReaderChapters(book)[currentReaderChapterIndex];
        return String(chapter?.content || book.fullText || document.getElementById('readen-reader-content')?.textContent || '');
    }

    function getReaderChapterTitle(book) {
        const chapter = getReaderChapters(book)[currentReaderChapterIndex];
        return chapter?.title || `第${currentReaderChapterIndex + 1}章`;
    }

    function getReadenBookmarkPosition(bookmark) {
        const source = bookmark?.position && typeof bookmark.position === 'object'
            ? bookmark.position
            : (bookmark || {});
        const chapterIndex = Number(source.chapterIndex ?? bookmark?.chapterIndex);
        const paragraphIndex = Number(source.paragraphIndex);
        const charOffset = Number(source.charOffset);
        const progress = Number(source.progress ?? bookmark?.progress);
        return {
            chapterKey: String(source.chapterKey || ''),
            chapterIndex: Number.isFinite(chapterIndex) ? Math.max(0, Math.floor(chapterIndex)) : 0,
            paragraphIndex: Number.isFinite(paragraphIndex) ? Math.max(0, Math.floor(paragraphIndex)) : 0,
            charOffset: Number.isFinite(charOffset) ? Math.max(0, Math.floor(charOffset)) : 0,
            quote: String(source.quote || '').trim(),
            progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0,
            updatedAt: Math.max(0, Number(source.updatedAt) || 0)
        };
    }

    function getCurrentReadenBookmarkPosition(book) {
        const progress = Math.round(getReaderProgressPercent());
        updateReadenReaderPosition(book, progress);
        const current = ensureReadenReaderPosition(book) || {};
        return {
            chapterKey: String(current.chapterKey || ''),
            chapterIndex: Number.isFinite(Number(current.chapterIndex)) ? Math.max(0, Number(current.chapterIndex)) : currentReaderChapterIndex,
            paragraphIndex: Math.max(0, Number(current.paragraphIndex) || 0),
            charOffset: Math.max(0, Number(current.charOffset) || 0),
            quote: String(current.quote || '').trim(),
            progress,
            updatedAt: Date.now()
        };
    }

    function isReadenBookmarkAtPosition(bookmark, position) {
        const saved = getReadenBookmarkPosition(bookmark);
        if (!saved || !position) return false;
        if (saved.chapterKey && position.chapterKey) {
            return saved.chapterKey === position.chapterKey
                && saved.paragraphIndex === position.paragraphIndex
                && Math.abs(saved.charOffset - position.charOffset) <= 8;
        }
        return saved.chapterIndex === position.chapterIndex
            && Math.abs(saved.progress - position.progress) <= 2;
    }
    function openReaderBookmarkPanel() {
        const book = getCurrentReaderBook();
        if (!book) return;
        const noteInput = document.getElementById('readen-reader-bookmark-note');
        const currentPosition = getCurrentReadenBookmarkPosition(book);
        const oldBookmark = Array.isArray(book.bookmarks)
            ? book.bookmarks.find(item => isReadenBookmarkAtPosition(item, currentPosition))
            : null;
        if (noteInput) {
            noteInput.value = oldBookmark?.note || '';
            setTimeout(() => noteInput.focus(), 80);
        }
        openReaderToolPanel('readen-reader-bookmark-panel');
    }

    function saveReaderBookmark() {
        const book = getCurrentReaderBook();
        if (!book) return;
        const note = document.getElementById('readen-reader-bookmark-note')?.value.trim() || '';
        const position = getCurrentReadenBookmarkPosition(book);
        if (!Array.isArray(book.bookmarks)) book.bookmarks = [];
        const existing = book.bookmarks.find(item => isReadenBookmarkAtPosition(item, position));
        const now = Date.now();
        const nextBookmark = {
            id: existing?.id || `bm_${now}`,
            chapterIndex: position.chapterIndex,
            chapterTitle: getReaderChapterTitle(book),
            progress: position.progress,
            page: readerCurrentPage,
            note,
            position: { ...position, updatedAt: now },
            createdAt: existing?.createdAt || now,
            updatedAt: now
        };
        if (existing) Object.assign(existing, nextBookmark);
        else book.bookmarks.push(nextBookmark);
        saveReadenAppData();
        closeReaderToolPanels();
        alert(existing ? '书签已更新' : '书签已保存');
    }

    function openReaderTextSearchPanel() {
        const input = document.getElementById('readen-reader-search-input');
        if (input) input.value = '';
        renderReaderTextSearchResults();
        openReaderToolPanel('readen-reader-search-panel');
        setTimeout(() => input?.focus(), 80);
    }

    function renderReaderTextSearchResults() {
        const input = document.getElementById('readen-reader-search-input');
        const status = document.getElementById('readen-reader-search-status');
        const results = document.getElementById('readen-reader-search-results');
        const book = getCurrentReaderBook();
        if (!input || !status || !results || !book) return;
        const keyword = input.value.trim();
        const chapters = getReadenSearchableChapters(book);
        if (!chapters.length) {
            status.textContent = '当前书籍暂时不能搜索';
            results.innerHTML = '<div class="reader-search-empty">请等待正文加载完成，漫画章节暂无文字搜索。</div>';
            return;
        }
        if (!keyword) {
            status.textContent = '输入关键词搜索本书已缓存正文';
            results.innerHTML = '<div class="reader-search-empty">搜索结果会显示章节和上下文片段。</div>';
            return;
        }
        const matches = collectReadenBookSearchMatches(book, keyword, 30);
        status.textContent = matches.length
            ? matches.length + ' 处匹配 · 已缓存 ' + chapters.length + ' 章'
            : '没有找到匹配文字';
        results.innerHTML = matches.length ? matches.map((match, order) => {
            const chapterLabel = match.chapterTitle || ('第' + (match.chapterIndex + 1) + '章');
            return '<button type="button" class="reader-search-result" data-reader-search-content-index="' + order + '">'
                + '<span>' + (order + 1) + '</span>'
                + '<p><strong>' + escapeReadenHtml(chapterLabel) + '</strong><br>' + match.snippet + '</p>'
                + '</button>';
        }).join('') : '<div class="reader-search-empty">换个关键词再试试。</div>';
        results.querySelectorAll('[data-reader-search-content-index]').forEach(button => {
            button.addEventListener('click', () => {
                const match = matches[Number(button.dataset.readerSearchContentIndex)];
                if (!match) return;
                closeReaderToolPanels();
                openReader(book.id, match.chapterIndex, {
                    initialPosition: {
                        chapterIndex: match.chapterIndex,
                        paragraphIndex: match.paragraphIndex,
                        charOffset: match.charOffset,
                        quote: match.quote,
                        progress: match.progress,
                        updatedAt: Date.now()
                    }
                });
            });
        });
    }
    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function openReaderMorePanel() {
        openReaderToolPanel('readen-reader-more-panel');
    }

    function openReaderTitleStylePanel() {
        renderReaderTitleStyleList();
        openReaderToolPanel('readen-reader-title-style-panel');
    }


    function renderReaderTitleStyleList() {
        const list = document.getElementById('readen-reader-title-style-list');
        const book = getCurrentReaderBook();
        if (!list || !book) return;
        const activeId = book.readerTitleStyle || 'quiet-space';
        list.innerHTML = readenTitleStyles.map(style => `
            <button type="button" class="reader-title-style-card ${style.id === activeId ? 'active' : ''}" data-title-style="${style.id}">
                <span class="reader-style-add">+</span>
                <strong>${style.name}</strong>
                <em>${style.desc}</em>
                <div class="reader-style-preview reader-title-${style.id}">
                    <span class="reader-chapter-order">第十二章</span>
                    <h1>灯塔来信</h1>
                </div>
            </button>
        `).join('');
        list.querySelectorAll('[data-title-style]').forEach(button => {
            button.addEventListener('click', () => {
                book.readerTitleStyle = button.dataset.titleStyle;
                saveReadenAppData();
                renderReaderTitleStyleList();
            });
        });
    }


    async function shareCurrentReaderBook() {
        const book = getCurrentReaderBook();
        if (!book) return;
        const text = `${book.title || '未命名书籍'} · ${getReaderProgressPercent().toFixed(0)}%`;
        if (navigator.share) {
            try {
                await navigator.share({ title: book.title || '童话集阅读', text });
                return;
            } catch (error) {
                if (error?.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard?.writeText(text);
            alert('分享内容已复制');
        } catch (error) {
            alert(text);
        }
    }

    function getReadenSelectionActionInfo() {
        const info = getReadenSelectionInfo();
        if (!info || info.error || !info.quote) {
            if (info?.error && typeof window.showToast === 'function') window.showToast(info.error);
            return null;
        }
        return info;
    }

    function renderReadenSelectionResult() {
        const title = document.getElementById('readen-selection-result-title');
        const source = document.getElementById('readen-selection-result-source');
        const status = document.getElementById('readen-selection-result-status');
        const body = document.getElementById('readen-selection-result-body');
        const retry = document.getElementById('readen-selection-result-retry');
        if (!title || !source || !status || !body || !retry) return;
        const result = readenSelectionResult;
        if (!result) {
            title.textContent = '选段工具';
            source.textContent = '';
            status.textContent = '';
            body.replaceChildren();
            retry.style.display = 'none';
            return;
        }
        title.textContent = result.kind === 'translation' ? '选段翻译' : '词语释义';
        source.textContent = result.source;
        retry.style.display = result.status === 'error' ? 'block' : 'none';
        if (result.status === 'loading') {
            status.textContent = result.kind === 'translation' ? '正在翻译选中内容…' : '正在查询词语释义…';
            body.innerHTML = '<div class="readen-selection-result-loading">请稍候…</div>';
            return;
        }
        if (result.status === 'unsupported') {
            status.textContent = '暂不支持该选段的词典释义';
            body.innerHTML = '<div class="readen-selection-result-empty">词语释义目前支持单个英文单词；中文词语或完整句子请使用“翻译”或“问 TA”。</div>';
            return;
        }
        if (result.status === 'error') {
            status.textContent = result.error || '请求失败';
            body.innerHTML = '<div class="readen-selection-result-empty">原文选择仍然保留，可以重试。</div>';
            return;
        }
        status.textContent = result.kind === 'translation' ? '译文' : '词典释义';
        if (result.kind === 'translation') {
            body.innerHTML = '<div class="readen-selection-result-translation">' + escapeReadenHtml(result.translation || '') + '</div>';
            return;
        }
        const phonetic = result.phonetic ? '<div class="readen-selection-result-phonetic">' + escapeReadenHtml(result.phonetic) + '</div>' : '';
        const meanings = (result.meanings || []).map(item => {
            const definitions = (item.definitions || []).slice(0, 3).map(definition => {
                const example = definition.example ? '<div class="readen-selection-result-example">' + escapeReadenHtml(definition.example) + '</div>' : '';
                return '<li>' + escapeReadenHtml(definition.definition || '') + example + '</li>';
            }).join('');
            return '<div class="readen-selection-result-meaning"><strong>' + escapeReadenHtml(item.partOfSpeech || '释义') + '</strong><ol>' + definitions + '</ol></div>';
        }).join('');
        body.innerHTML = phonetic + (meanings || '<div class="readen-selection-result-empty">没有找到可显示的释义。</div>');
    }

    async function requestReadenSelectionTranslation() {
        const result = readenSelectionResult;
        if (!result || result.kind !== 'translation') return;
        result.status = 'loading';
        result.error = '';
        renderReadenSelectionResult();
        try {
            const translator = window.wcRequestBilingualTranslation;
            if (typeof translator !== 'function') throw new Error('翻译服务暂不可用');
            const translation = String(await translator(result.source) || '').trim();
            if (!translation) throw new Error('翻译结果为空');
            if (readenSelectionResult !== result) return;
            result.translation = translation;
            result.status = 'ready';
        } catch (error) {
            if (readenSelectionResult !== result) return;
            result.status = 'error';
            result.error = error?.message || '翻译失败，请稍后重试';
        }
        renderReadenSelectionResult();
    }

    async function requestReadenWordDefinition() {
        const result = readenSelectionResult;
        if (!result || result.kind !== 'definition') return;
        result.status = 'loading';
        result.error = '';
        renderReadenSelectionResult();
        const word = result.source.trim();
        if (!/^[A-Za-z][A-Za-z'-]{1,64}$/.test(word)) {
            result.status = 'unsupported';
            renderReadenSelectionResult();
            return;
        }
        try {
            const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word), {
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error('词典暂时没有返回结果');
            const payload = await response.json();
            const entry = Array.isArray(payload) ? payload[0] : null;
            const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];
            if (!meanings.length) throw new Error('没有找到可显示的释义');
            if (readenSelectionResult !== result) return;
            result.phonetic = entry.phonetic || entry.phonetics?.find(item => item.text)?.text || '';
            result.meanings = meanings;
            result.status = 'ready';
        } catch (error) {
            if (readenSelectionResult !== result) return;
            result.status = 'error';
            result.error = error?.message || '词语释义查询失败，请稍后重试';
        }
        renderReadenSelectionResult();
    }

    function openReadenSelectionResult(kind) {
        const info = getReadenSelectionActionInfo();
        if (!info) return;
        readenSelectionResult = {
            kind,
            source: info.quote,
            selectionInfo: info,
            status: 'loading',
            error: ''
        };
        openReaderToolPanel('readen-reader-selection-result-panel');
        renderReadenSelectionResult();
        if (kind === 'translation') requestReadenSelectionTranslation();
        else requestReadenWordDefinition();
    }

    function retryReadenSelectionResult() {
        if (!readenSelectionResult) return;
        if (readenSelectionResult.kind === 'translation') requestReadenSelectionTranslation();
        else requestReadenWordDefinition();
    }

    function splitReadenSpeechSentences(paragraph) {
        const value = String(paragraph || '');
        const items = [];
        const pattern = /[^。！？!?；;：:\n]+(?:[。！？!?；;：:]|$)/g;
        let match;
        while ((match = pattern.exec(value))) {
            const raw = match[0];
            const leading = raw.search(/\S/);
            if (leading < 0) continue;
            const text = raw.trim();
            const startOffset = match.index + leading;
            if (text) {
                items.push({
                    text,
                    startOffset,
                    endOffset: startOffset + text.length
                });
            }
        }
        if (!items.length && value.trim()) {
            const text = value.trim();
            const startOffset = Math.max(0, value.indexOf(text));
            items.push({ text, startOffset, endOffset: startOffset + text.length });
        }
        return items;
    }

    function getReadenSpeechChapterText(book, chapterIndex) {
        const chapters = getReaderChapters(book);
        if (chapters.length) return String(chapters[chapterIndex]?.content || '');
        return chapterIndex === 0 ? String(book?.fullText || '') : '';
    }

    function buildReadenSpeechQueue(book, chapterIndex, startPosition = {}) {
        const text = getReadenSpeechChapterText(book, chapterIndex);
        if (!text) return [];
        const paragraphs = getReaderParagraphs(text);
        const items = [];
        paragraphs.forEach((paragraph, paragraphIndex) => {
            splitReadenSpeechSentences(paragraph).forEach(sentence => {
                items.push({ ...sentence, paragraphIndex });
            });
        });
        const startParagraph = Math.max(0, Number(startPosition.paragraphIndex) || 0);
        const startOffset = Math.max(0, Number(startPosition.charOffset) || 0);
        const rawFirstIndex = items.findIndex(item => (
            item.paragraphIndex > startParagraph
            || (item.paragraphIndex === startParagraph && item.endOffset > startOffset)
        ));
        if (!items.length || rawFirstIndex < 0) return [];
        const firstIndex = rawFirstIndex;
        const queue = items.slice(firstIndex);
        if (queue.length && queue[0].paragraphIndex === startParagraph && startOffset > queue[0].startOffset) {
            const clippedStart = Math.min(queue[0].endOffset - 1, startOffset);
            queue[0] = {
                ...queue[0],
                text: queue[0].text.slice(clippedStart - queue[0].startOffset),
                startOffset: clippedStart
            };
        }
        return queue.filter(item => item.text);
    }

    function clearReadenSpeechHighlight() {
        document.querySelectorAll('.readen-speech-highlight').forEach(element => {
            const parent = element.parentNode;
            if (!parent) return;
            while (element.firstChild) parent.insertBefore(element.firstChild, element);
            element.remove();
            parent.normalize();
        });
    }

    function renderReadenSpeechHighlight() {
        clearReadenSpeechHighlight();
        const state = readenSpeechState;
        const item = state?.items?.[state.itemIndex];
        if (!state || !item) return;
        if (state.chapterIndex !== currentReaderChapterIndex) return;
        const paragraph = document.querySelector('.readen-reader-paragraph[data-paragraph-index="' + state.items[state.itemIndex].paragraphIndex + '"]');
        if (!paragraph) return;
        const range = createReadenParagraphRange(paragraph, item.startOffset, item.endOffset);
        if (!range) return;
        const marker = document.createElement('span');
        marker.className = 'readen-speech-highlight';
        marker.setAttribute('aria-live', 'polite');
        marker.appendChild(range.extractContents());
        range.insertNode(marker);
    }

    function getReadenSpeechVoiceMode() {
        ensureReaderPreferenceState();
        return readenSettings.speechVoiceMode === 'character' ? 'character' : 'system';
    }

    function setReadenSpeechVoiceMode(value, shouldSave = true) {
        ensureReaderPreferenceState();
        const mode = value === 'character' ? 'character' : 'system';
        readenSettings.speechVoiceMode = mode;
        const selector = document.getElementById('readen-speech-voice-mode');
        if (selector) selector.value = mode;
        if (shouldSave) saveReadenAppData();
        return mode;
    }

    function getReadenSpeechCharacterInfo(book = getCurrentReaderBook()) {
        const binding = getReadenBoundCoReader(book);
        if (!binding?.contactId || typeof window.synthesizeConnectedVoice !== 'function') return null;
        return {
            binding,
            display: getReadenCoReaderDisplay(book)
        };
    }

    function disposeReadenSpeechAudio() {
        const audio = readenSpeechAudio;
        if (audio) {
            audio.onplay = null;
            audio.onended = null;
            audio.onerror = null;
            audio.pause();
            audio.removeAttribute('src');
            audio.load?.();
        }
        readenSpeechAudio = null;
        if (readenSpeechAudioUrl) URL.revokeObjectURL(readenSpeechAudioUrl);
        readenSpeechAudioUrl = '';
    }

    function updateReadenSpeechControls() {
        const status = document.getElementById('readen-speech-status');
        const toggle = document.getElementById('readen-speech-toggle-btn');
        const rate = document.getElementById('readen-speech-rate');
        const autoNext = document.getElementById('readen-speech-auto-next');
        const voiceMode = document.getElementById('readen-speech-voice-mode');
        const book = getCurrentReaderBook();
        const binding = getReadenBoundCoReader(book);
        const state = readenSpeechState;
        if (!status || !toggle || !rate || !autoNext || !voiceMode) return;

        const characterOption = voiceMode.querySelector('option[value="character"]');
        if (characterOption) characterOption.textContent = binding?.name
            ? `${binding.name} 的角色语音`
            : '角色语音（请先绑定角色）';

        const selectedMode = state?.voiceMode || getReadenSpeechVoiceMode();
        voiceMode.value = selectedMode;
        if (!state) {
            status.textContent = selectedMode === 'character' && !binding
                ? '请先为这本书绑定共读角色'
                : '尚未开始';
            toggle.textContent = selectedMode === 'character' && binding ? '接通角色语音' : '播放';
            rate.value = '1';
            autoNext.checked = false;
            return;
        }

        const total = state.items.length || 0;
        const voiceLabel = state.voiceMode === 'character'
            ? `角色语音 · ${getReadenCoReaderDisplay(book).name}`
            : '系统 TTS';
        status.textContent = state.status === 'loading'
            ? '正在加载下一章…'
            : (state.status === 'connecting'
                ? `正在接通 ${getReadenCoReaderDisplay(book).name} 的语音…`
                : (state.status === 'paused'
                    ? `${voiceLabel} · 已暂停`
                    : `${voiceLabel} · 第 ${Math.min(state.itemIndex + 1, total)} / ${total} 句`));
        toggle.textContent = state.status === 'playing' ? '暂停' : (state.status === 'connecting' ? '取消连接' : '继续');
        rate.value = String(state.rate || 1);
        autoNext.checked = Boolean(state.autoNext);
    }

    function getReadenSpeechRate() {
        const value = Number(document.getElementById('readen-speech-rate')?.value);
        return Number.isFinite(value) ? Math.max(0.5, Math.min(2, value)) : 1;
    }

    function getReadenSpeechAutoNext() {
        return Boolean(document.getElementById('readen-speech-auto-next')?.checked);
    }

    function advanceReadenSpeechItem(state, token) {
        if (token !== readenSpeechToken || readenSpeechState !== state) return;
        state.itemIndex += 1;
        if (state.itemIndex < state.items.length) {
            speakReadenSpeechItem();
            return;
        }
        continueReadenSpeechNextChapter();
    }

    function fallbackReadenSpeechToSystem(state, token, message) {
        if (token !== readenSpeechToken || readenSpeechState !== state) return;
        state.voiceMode = 'system';
        setReadenSpeechVoiceMode('system');
        if (typeof window.showToast === 'function') window.showToast(message);
        speakReadenSpeechItem();
    }

    function speakReadenSystemSpeechItem(state, item, token) {
        if (!('speechSynthesis' in window)) {
            state.status = 'paused';
            updateReadenSpeechControls();
            if (typeof window.showToast === 'function') window.showToast('当前浏览器不支持系统 TTS');
            return;
        }
        state.status = 'playing';
        readenSpeechUtterance = new SpeechSynthesisUtterance(item.text);
        readenSpeechUtterance.lang = /[\u4e00-\u9fff]/.test(item.text) ? 'zh-CN' : 'en-US';
        readenSpeechUtterance.rate = state.rate;
        readenSpeechUtterance.onstart = () => {
            if (token !== readenSpeechToken || readenSpeechState !== state) return;
            renderReadenSpeechHighlight();
            updateReadenSpeechControls();
        };
        readenSpeechUtterance.onend = () => {
            if (token !== readenSpeechToken || readenSpeechState !== state) return;
            readenSpeechUtterance = null;
            advanceReadenSpeechItem(state, token);
        };
        readenSpeechUtterance.onerror = event => {
            if (token !== readenSpeechToken || event?.error === 'canceled') return;
            state.status = 'paused';
            updateReadenSpeechControls();
            if (typeof window.showToast === 'function') window.showToast('朗读出现问题，已暂停');
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(readenSpeechUtterance);
        renderReadenSpeechHighlight();
        updateReadenSpeechControls();
    }

    async function speakReadenCharacterSpeechItem(state, item, token) {
        const info = getReadenSpeechCharacterInfo(getCurrentReaderBook());
        if (!info) {
            fallbackReadenSpeechToSystem(state, token, '角色语音未就绪，已切换为系统 TTS');
            return;
        }

        state.status = 'connecting';
        renderReadenSpeechHighlight();
        updateReadenSpeechControls();

        try {
            const audioBlob = await window.synthesizeConnectedVoice(item.text, info.binding.contactId);
            if (token !== readenSpeechToken || readenSpeechState !== state || state.status === 'paused') return;
            if (!(audioBlob instanceof Blob) || !audioBlob.size) {
                fallbackReadenSpeechToSystem(state, token, '角色声音不可用，已切换为系统 TTS');
                return;
            }

            disposeReadenSpeechAudio();
            readenSpeechAudioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(readenSpeechAudioUrl);
            readenSpeechAudio = audio;
            audio.playbackRate = state.rate;
            audio.onplay = () => {
                if (token !== readenSpeechToken || readenSpeechState !== state) return;
                state.status = 'playing';
                renderReadenSpeechHighlight();
                updateReadenSpeechControls();
            };
            audio.onended = () => {
                if (token !== readenSpeechToken || readenSpeechState !== state) return;
                disposeReadenSpeechAudio();
                advanceReadenSpeechItem(state, token);
            };
            audio.onerror = () => {
                if (token !== readenSpeechToken || readenSpeechState !== state) return;
                disposeReadenSpeechAudio();
                state.status = 'paused';
                updateReadenSpeechControls();
                if (typeof window.showToast === 'function') window.showToast('角色语音播放失败，已暂停');
            };
            await audio.play();
        } catch (error) {
            if (token !== readenSpeechToken || readenSpeechState !== state) return;
            fallbackReadenSpeechToSystem(state, token, '角色语音连接失败，已切换为系统 TTS');
        }
    }

    function speakReadenSpeechItem() {
        const state = readenSpeechState;
        const item = state?.items?.[state.itemIndex];
        if (!state || !item) return;
        const token = ++readenSpeechToken;
        if (state.voiceMode === 'character') {
            speakReadenCharacterSpeechItem(state, item, token);
            return;
        }
        disposeReadenSpeechAudio();
        speakReadenSystemSpeechItem(state, item, token);
    }

    function continueReadenSpeechNextChapter() {
        const state = readenSpeechState;
        const book = getCurrentReaderBook();
        const chapters = getReaderChapters(book);
        if (!state || !book || !state.autoNext || state.chapterIndex !== currentReaderChapterIndex || state.chapterIndex >= chapters.length - 1) {
            stopReadenSpeech(true);
            return;
        }
        const nextChapterIndex = state.chapterIndex + 1;
        const rate = state.rate;
        const autoNext = state.autoNext;
        const voiceMode = state.voiceMode;
        state.status = 'loading';
        state.chapterIndex = nextChapterIndex;
        state.items = [];
        state.itemIndex = 0;
        readenSpeechToken += 1;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        disposeReadenSpeechAudio();
        openReader(book.id, nextChapterIndex, { initialProgress: 0, preserveReadenSpeech: true });
        let attempts = 0;
        const waitForChapter = () => {
            if (readenSpeechState !== state) return;
            const queue = buildReadenSpeechQueue(book, nextChapterIndex, {});
            if (currentReaderChapterIndex === nextChapterIndex && queue.length) {
                state.items = queue;
                state.rate = rate;
                state.autoNext = autoNext;
                state.voiceMode = voiceMode;
                openReaderToolPanel('readen-reader-speech-panel');
                speakReadenSpeechItem();
                return;
            }
            attempts += 1;
            if (attempts > 30) {
                stopReadenSpeech(true);
                if (typeof window.showToast === 'function') window.showToast('下一章正文尚未加载完成');
                return;
            }
            setTimeout(waitForChapter, 180);
        };
        setTimeout(waitForChapter, 180);
    }

    function startReadenSpeech(options = {}) {
        const requestedMode = options.voiceMode || getReadenSpeechVoiceMode();
        const book = getCurrentReaderBook();
        if (!book) return;

        let voiceMode = requestedMode === 'character' ? 'character' : 'system';
        if (voiceMode === 'character' && !getReadenBoundCoReader(book)) {
            voiceMode = 'system';
            setReadenSpeechVoiceMode('system');
            if (typeof window.showToast === 'function') window.showToast('请先为这本书绑定共读角色，已使用系统 TTS');
        }
        if (voiceMode === 'character' && typeof window.synthesizeConnectedVoice !== 'function') {
            voiceMode = 'system';
            setReadenSpeechVoiceMode('system');
            if (typeof window.showToast === 'function') window.showToast('角色语音未就绪，已使用系统 TTS');
        }
        if (voiceMode === 'system' && !('speechSynthesis' in window)) {
            alert('当前浏览器不支持系统 TTS');
            return;
        }

        const selectionInfo = options.selectionInfo || null;
        const chapterIndex = Number.isFinite(Number(options.chapterIndex))
            ? Number(options.chapterIndex)
            : currentReaderChapterIndex;
        const savedPosition = ensureReadenReaderPosition(book) || {};
        const startPosition = selectionInfo
            ? { paragraphIndex: selectionInfo.paragraphIndex, charOffset: selectionInfo.startOffset }
            : (options.startPosition || (Number(savedPosition.chapterIndex) === chapterIndex ? savedPosition : {}));
        const queue = buildReadenSpeechQueue(book, chapterIndex, startPosition);
        if (!queue.length) {
            alert('当前章节没有可朗读的文字');
            return;
        }
        const rate = Number.isFinite(Number(options.rate)) ? Number(options.rate) : (readenSpeechState?.rate || getReadenSpeechRate());
        const autoNext = options.autoNext === undefined ? (readenSpeechState?.autoNext ?? getReadenSpeechAutoNext()) : Boolean(options.autoNext);
        stopReadenSpeech(true);
        readenSpeechState = {
            bookId: book.id,
            chapterIndex,
            items: queue,
            itemIndex: 0,
            rate: Math.max(0.5, Math.min(2, rate)),
            autoNext,
            voiceMode,
            status: 'loading'
        };
        if (readenCustomSelection) clearReadenCustomSelection(true);
        clearReadenNativeSelection();
        hideReadenSelectionToolbar();
        if (options.openPanel !== false) openReaderToolPanel('readen-reader-speech-panel');
        updateReadenSpeechControls();
        speakReadenSpeechItem();
    }

    function openReadenSelectionSpeech() {
        const info = getReadenSelectionActionInfo();
        if (info) {
            startReadenSpeech({ selectionInfo: info });
            return;
        }
        openReadenSpeechPanel();
    }

    function pauseReadenSpeech() {
        const state = readenSpeechState;
        if (!state) return;
        if (state.status === 'connecting') {
            readenSpeechToken += 1;
            state.status = 'paused';
            updateReadenSpeechControls();
            return;
        }
        if (state.voiceMode === 'character' && readenSpeechAudio && !readenSpeechAudio.paused) {
            readenSpeechAudio.pause();
            state.status = 'paused';
            updateReadenSpeechControls();
            return;
        }
        if (state.status === 'playing' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            state.status = 'paused';
            updateReadenSpeechControls();
        }
    }

    function resumeReadenSpeech() {
        const state = readenSpeechState;
        if (!state || state.status !== 'paused') return;
        if (state.voiceMode === 'character' && readenSpeechAudio) {
            readenSpeechAudio.play().then(() => {
                if (readenSpeechState === state) {
                    state.status = 'playing';
                    updateReadenSpeechControls();
                }
            }).catch(() => {
                if (readenSpeechState === state) {
                    state.status = 'paused';
                    updateReadenSpeechControls();
                    if (typeof window.showToast === 'function') window.showToast('角色语音无法续播');
                }
            });
            return;
        }
        if (state.voiceMode === 'system' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            state.status = 'playing';
            updateReadenSpeechControls();
            return;
        }
        speakReadenSpeechItem();
    }

    function stopReadenSpeech(silent = false) {
        readenSpeechToken += 1;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        disposeReadenSpeechAudio();
        readenSpeechUtterance = null;
        readenSpeechState = null;
        clearReadenSpeechHighlight();
        updateReadenSpeechControls();
        if (!silent && typeof window.showToast === 'function') window.showToast('已停止听书');
    }

    function changeReadenSpeechRate(value) {
        const rate = Math.max(0.5, Math.min(2, Number(value) || 1));
        const state = readenSpeechState;
        if (!state) {
            updateReadenSpeechControls();
            return;
        }
        state.rate = rate;
        if (state.voiceMode === 'character' && readenSpeechAudio) {
            readenSpeechAudio.playbackRate = rate;
            updateReadenSpeechControls();
            return;
        }
        if (state.status === 'playing') {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            speakReadenSpeechItem();
        } else {
            updateReadenSpeechControls();
        }
    }

    function changeReadenSpeechVoiceMode(value) {
        const book = getCurrentReaderBook();
        let mode = value === 'character' ? 'character' : 'system';
        if (mode === 'character' && !getReadenBoundCoReader(book)) {
            mode = 'system';
            if (typeof window.showToast === 'function') window.showToast('请先为这本书绑定共读角色');
        }
        if (mode === 'character' && typeof window.synthesizeConnectedVoice !== 'function') {
            mode = 'system';
            if (typeof window.showToast === 'function') window.showToast('角色语音未就绪');
        }
        setReadenSpeechVoiceMode(mode);
        const state = readenSpeechState;
        if (!state || state.voiceMode === mode) {
            updateReadenSpeechControls();
            return;
        }
        state.voiceMode = mode;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        disposeReadenSpeechAudio();
        speakReadenSpeechItem();
    }

    function toggleReaderSpeech() {
        if (!readenSpeechState) {
            startReadenSpeech();
            return;
        }
        if (readenSpeechState.status === 'playing' || readenSpeechState.status === 'connecting') pauseReadenSpeech();
        else resumeReadenSpeech();
    }

    function openReadenSpeechPanel() {
        openReaderToolPanel('readen-reader-speech-panel');
        updateReadenSpeechControls();
    }

    let els = {};

    function bindEvents() {
            // 点击左上角标题退出应用
        container.querySelectorAll('header .header-title').forEach(title => {
            title.addEventListener('click', () => {
                window.ReadenApp.close();
            });
        });

        // 底部导航切换
        els.navItems.forEach(nav => {
            nav.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                switchTab(target, this);
            });
        });

        // 统计页面内部 Tab 切换
        els.statsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                els.statsTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                els.statsContents.forEach(content => content.classList.remove('active'));
                const targetId = this.getAttribute('data-target');
                if(targetId && document.getElementById(targetId)) {
                    document.getElementById(targetId).classList.add('active');
                }
                renderReadenStatisticsPanels();
            });
        });
        bindReadenStatsDateSelectors();

        // 书架菜单控制
        els.btnToggleMenu.addEventListener('click', toggleBookshelfMenu);
        els.bsDropdownOverlay.addEventListener('click', toggleBookshelfMenu);
        document.getElementById('Book-Search--Streamline-Ultimate').addEventListener('click', openReadenSearch);
        document.querySelector('#readen-page-bookshelf .search-bar').addEventListener('click', openReadenSearch);
        document.getElementById('readen-search-close').addEventListener('click', closeReadenSearch);
        document.getElementById('readen-search-input').addEventListener('input', scheduleReadenSearch);
        document.getElementById('readen-search-input').addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                renderReadenSearchResults();
            }
        });
        document.querySelectorAll('.readen-search-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                readenSearchMode = tab.dataset.searchMode || 'online';
                document.querySelectorAll('.readen-search-tab').forEach(item => item.classList.toggle('active', item === tab));
                const input = document.getElementById('readen-search-input');
                input.placeholder = readenSearchMode === 'bookshelf' ? '搜索书架' : '输入书名';
                renderReadenSearchResults();
            });
        });
        
        // 书架视图切换
        document.getElementById('readen-menu-view-grid').addEventListener('click', () => setBookshelfView('grid'));
        document.getElementById('readen-menu-view-list').addEventListener('click', () => setBookshelfView('list'));
        document.getElementById('readen-menu-view-showcase').addEventListener('click', toggleShowcase);
        
        // 书架排序
        document.getElementById('readen-sort-lastRead').addEventListener('click', () => setSortMethod('lastRead'));
        document.getElementById('readen-sort-addTime').addEventListener('click', () => setSortMethod('addTime'));
        document.getElementById('readen-sort-size').addEventListener('click', () => setSortMethod('size'));
        document.getElementById('readen-sort-name').addEventListener('click', () => setSortMethod('name'));
        
        // 书架操作
        document.getElementById('readen-menu-create-group').addEventListener('click', createGroup);
        document.getElementById('readen-menu-import').addEventListener('click', () => {
            document.getElementById('readen-local-import-input').click();
            toggleBookshelfMenu();
        });
        document.getElementById('readen-empty-import-local').addEventListener('click', () => {
            document.getElementById('readen-local-import-input').click();
        });

        // 书籍操作菜单
        els.bookActionOverlay.addEventListener('click', closeBookActionMenu);
        document.getElementById('readen-bam-multi').addEventListener('click', enterMultiSelect);
        document.getElementById('readen-bam-rename').addEventListener('click', actionRenameBook);
        document.getElementById('readen-bam-cover').addEventListener('click', actionCustomCover);
        document.getElementById('readen-bam-move').addEventListener('click', actionMoveBook);
        document.getElementById('readen-bam-edit').addEventListener('click', actionEditBook);
        document.getElementById('readen-bam-pin').addEventListener('click', actionPinBook);
        document.getElementById('readen-bam-delete').addEventListener('click', actionDeleteBook);

        // 自定义封面弹窗
        document.getElementById('readen-cover-preview-box').addEventListener('click', () => {
            const input = document.getElementById('readen-cover-upload-input');
            if (!input) return;
            input.value = '';
            input.click();
        });
        document.getElementById('readen-cover-reset-btn').addEventListener('click', resetCustomCover);
        document.getElementById('readen-cover-cancel-btn').addEventListener('click', closeCoverModal);
        document.getElementById('readen-cover-confirm-btn').addEventListener('click', confirmCustomCover);
        document.getElementById('readen-cover-upload-input').addEventListener('change', handleCoverUpload);

        // 封面图集
        document.getElementById('readen-menu-cover-gallery').addEventListener('click', openCoverGallery);
        document.getElementById('readen-menu-cover-gallery-2').addEventListener('click', openCoverGallery);
        document.getElementById('readen-cg-back-btn').addEventListener('click', closeCoverGallery);
        document.getElementById('readen-cg-add-btn').addEventListener('click', openAddThemeModal);
        
        // 新增封面套图
        document.getElementById('readen-theme-cancel-btn').addEventListener('click', closeAddThemeModal);
        document.getElementById('readen-theme-confirm-btn').addEventListener('click', confirmAddTheme);

        // 多选模式
        document.getElementById('readen-ms-move').addEventListener('click', msMoveBooks);
        document.getElementById('readen-ms-delete').addEventListener('click', msDeleteBooks);
        document.getElementById('readen-ms-cancel').addEventListener('click', exitMultiSelect);

        // 字体与背景管理
        document.getElementById('readen-menu-font-manager').addEventListener('click', openFontManager);
        document.getElementById('readen-font-back-btn').addEventListener('click', closeFontManager);
        document.getElementById('readen-fb-manage-trigger').addEventListener('click', openReadenFbBatchManager);
        document.getElementById('readen-tab-btn-font').addEventListener('click', () => switchFbTab('font'));
        document.getElementById('readen-tab-btn-bg').addEventListener('click', () => switchFbTab('bg'));
        document.getElementById('readen-font-local-btn').addEventListener('click', () => document.getElementById('readen-custom-font-input').click());
        document.getElementById('readen-font-url-btn').addEventListener('click', addFontByUrl);
        document.getElementById('readen-bg-local-btn').addEventListener('click', () => {
            document.getElementById('readen-custom-bg-input')?.click();
        });
        document.getElementById('readen-custom-font-input').addEventListener('change', handleFontUpload);
        document.getElementById('readen-custom-bg-input').addEventListener('change', handleBgUpload);

        // 书籍详情
        document.getElementById('readen-bd-back-btn').addEventListener('click', closeBookDetails);
        document.getElementById('readen-bd-read-btn').addEventListener('click', () => openReader(currentBookDetailsId));
        document.getElementById('readen-bd-edit-btn').addEventListener('click', openBookEditModal);
        document.getElementById('readen-bd-action-btn').addEventListener('click', () => {
            const activeTab = document.querySelector('.bd-tab.active')?.getAttribute('data-target');
            if (activeTab === 'intro') {
                openBookEditModal();
            }
        });
        document.getElementById('readen-edit-cover-preview-box').addEventListener('click', () => {
            const input = document.getElementById('readen-edit-cover-file-input');
            if (!input) return;
            input.value = '';
            input.click();
        });
        document.getElementById('readen-edit-cover-file-input').addEventListener('change', handleBookEditCoverUpload);
        document.getElementById('readen-edit-book-cancel-btn').addEventListener('click', closeBookEditModal);
        document.getElementById('readen-edit-book-confirm-btn').addEventListener('click', confirmBookEdit);
        document.querySelectorAll('.bd-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                switchBdTab(this.getAttribute('data-target'), this);
            });
        });

        // 阅读目标事件监听
        bindReadenOptional('readen-home-target-edit-btn', 'click', promptSetReadingTarget);
        bindReadenOptional('readen-home-target-menu-btn', 'click', promptSetReadingTarget);
        bindReadenOptional('readen-home-target-setting-icon', 'click', promptSetReadingTarget);
        bindReadenOptional('readen-home-target-start-btn', 'click', () => {
            if (readenBooksData.length > 0) {
                const lastReadBook = [...readenBooksData].sort((a, b) => (b.lastReadTime || 0) - (a.lastReadTime || 0))[0];
                openReader(lastReadBook ? lastReadBook.id : readenBooksData[0].id);
            } else {
                alert('请先导入书籍');
            }
        });

        // 沉浸式阅读器
        bindReadenOptional('readen-btn-start-reading', 'click', () => {
            if (readenBooksData.length > 0) openReader(readenBooksData[0].id);
            else alert('请先导入书籍');
        });
        document.getElementById('readen-reader-close-btn').addEventListener('click', closeReader);
        bindReadenOptional('readen-selection-copy-btn', 'click', () => {
            const info = getReadenSelectionInfo();
            if (info && info.quote) {
                navigator.clipboard?.writeText(info.quote).then(() => {
                    if (typeof window.showToast === 'function') window.showToast('已复制');
                    clearReadenCustomSelection(true);
                });
            }
        });
        bindReadenOptional('readen-selection-underline-btn', 'click', openReadenUserAnnotationPanel);
        bindReadenOptional('readen-selection-note-btn', 'click', openReadenUserAnnotationPanel);
        bindReadenOptional('readen-selection-ai-btn', 'click', requestReadenCoReaderAnnotation);
        bindReadenOptional('readen-selection-listen-btn', 'click', openReadenSelectionSpeech);
        bindReadenOptional('readen-selection-define-btn', 'click', () => openReadenSelectionResult('definition'));
        bindReadenOptional('readen-selection-translate-btn', 'click', () => openReadenSelectionResult('translation'));
        bindReadenOptional('readen-selection-mark-btn', 'click', openReadenUserAnnotationPanel);
        bindReadenOptional('readen-selection-search-btn', 'click', openReaderTextSearchPanel);
        bindReadenOptional('readen-user-annotation-close', 'click', closeReadenUserAnnotationPanel);
        bindReadenOptional('readen-user-annotation-cancel', 'click', closeReadenUserAnnotationPanel);
        bindReadenOptional('readen-user-annotation-erase-btn', 'click', () => {
            if (!readenPendingUserAnnotation) return;
            const book = getCurrentReaderBook();
            if (!book || !book.annotations) return;

            const selection = readenPendingUserAnnotation.selectionInfo;
            const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());

            // 过滤掉与当前选区重叠的笔记（执行擦除）
            const initialLength = book.annotations.length;
            book.annotations = book.annotations.filter(ann => {
                // 只擦除当前章节的用户笔记
                if (ann.kind !== 'user_annotation') return true;
                if (ann.chapter?.key !== chapterMeta.key && ann.chapter?.token !== chapterMeta.token) return true;

                const anchor = ann.anchor;
                if (!anchor) return true;

                // 判断是否在同一段落，且选区有重叠
                const isSameParagraph = Number(anchor.paragraphIndex) === Number(selection.paragraphIndex);
                const isOverlapping = Number(anchor.startOffset) < Number(selection.endOffset) && Number(anchor.endOffset) > Number(selection.startOffset);

                // 如果重叠，则剔除该笔记（即删除）
                if (isSameParagraph && isOverlapping) {
                    return false; 
                }
                return true;
            });

            // 如果有笔记被删除，则保存并刷新视图
            if (book.annotations.length !== initialLength) {
                saveReadenAppData();
                refreshReaderAnnotations(book);
                scheduleReadenStatisticsRender();
                if (typeof window.showToast === 'function') window.showToast('已擦除划线/笔记');
            } else {
                if (typeof window.showToast === 'function') window.showToast('选区内没有可擦除的划线');
            }

            closeReadenUserAnnotationPanel();
            clearReadenCustomSelection(false);
        });

        bindReadenOptional('readen-annotation-detail-backdrop', 'click', () => {
            const popover = document.getElementById('readen-annotation-detail-popover');
            if (popover) {
                popover.classList.remove('show');
                popover.style.display = 'none'; // 强制清除内联的 flex 样式
            }
            document.getElementById('readen-annotation-detail-backdrop').style.display = 'none';
        });
        bindReadenOptional('radp-edit-btn', 'click', () => {
            const popover = document.getElementById('readen-annotation-detail-popover');
            const annotationId = popover?.dataset.annotationId || '';
            if (popover) {
                popover.classList.remove('show');
                popover.style.display = 'none'; // 强制清除内联的 flex 样式
            }
            document.getElementById('readen-annotation-detail-backdrop').style.display = 'none';
            openReadenUserAnnotationPanelForEdit(annotationId);
        });

        bindReadenOptional('readen-user-annotation-save', 'click', saveReadenUserAnnotation);
        bindReadenOptional('readen-user-annotation-image-btn', 'click', (e) => {
            if (typeof openIconMenu === 'function') openIconMenu(e, 'readenAnnotationImage');
            else document.getElementById('readen-user-annotation-image-input')?.click();
        });
        bindReadenOptional('readen-user-annotation-image-input', 'change', handleReadenUserAnnotationImage);
        document.querySelectorAll('[data-readen-annotation-color]').forEach(button => {
            button.addEventListener('click', () => selectReadenUserAnnotationColor(button.dataset.readenAnnotationColor));
        });
        document.querySelectorAll('[data-readen-annotation-style]').forEach(button => {
            button.addEventListener('click', () => selectReadenUserAnnotationStyle(button.dataset.readenAnnotationStyle));
        });
        bindReadenSelectionHandleDrag();
        bindReadenOptional('readen-reader-bookmark-btn', 'click', openReaderBookmarkPanel);
        bindReadenOptional('readen-reader-search-btn', 'click', openReaderTextSearchPanel);
        bindReadenOptional('readen-reader-more-btn', 'click', openReaderMorePanel);
        bindReadenOptional('readen-reader-bookmark-save', 'click', saveReaderBookmark);
        bindReadenOptional('readen-reader-search-input', 'input', renderReaderTextSearchResults);
        bindReadenOptional('readen-reader-title-style-btn', 'click', openReaderTitleStylePanel);
        bindReadenOptional('readen-reader-share-btn', 'click', shareCurrentReaderBook);
        bindReadenOptional('readen-reader-speech-btn', 'click', openReadenSpeechPanel);
        bindReadenOptional('readen-speech-toggle-btn', 'click', toggleReaderSpeech);
        bindReadenOptional('readen-speech-stop-btn', 'click', () => stopReadenSpeech());
        bindReadenOptional('readen-speech-rate', 'change', event => changeReadenSpeechRate(event.target.value));
        bindReadenOptional('readen-speech-voice-mode', 'change', event => changeReadenSpeechVoiceMode(event.target.value));
        bindReadenOptional('readen-speech-auto-next', 'change', event => {
            if (readenSpeechState) readenSpeechState.autoNext = event.target.checked;
            updateReadenSpeechControls();
        });
        bindReadenOptional('readen-selection-result-retry', 'click', retryReadenSelectionResult);
        document.querySelectorAll('[data-reader-tool-close]').forEach(element => element.addEventListener('click', closeReaderToolPanels));
        document.getElementById('readen-reader-font-btn').addEventListener('click', openReaderFontMenu);
        document.getElementById('readen-reader-chapter-btn').addEventListener('click', () => openReaderChapterDrawer('catalog'));
        document.getElementById('readen-reader-notes-btn').addEventListener('click', () => openReaderChapterDrawer('notes'));
        document.getElementById('readen-reader-prev-chapter').addEventListener('click', () => changeReaderChapter(-1));
        document.getElementById('readen-reader-next-chapter').addEventListener('click', () => changeReaderChapter(1));
        document.getElementById('readen-reader-resume-btn').addEventListener('click', () => {
            const book = readenBooksData.find(item => item.id === currentReaderBookId);
            if (book) restoreReaderProgress(book, currentReaderChapterIndex);
        });
        document.querySelector('#readen-reader-bottom-menu .rb-slider').addEventListener('change', event => seekReaderProgress(Number(event.target.value), { trackTurn: true }));
        document.getElementById('readen-rf-size-minus').addEventListener('click', () => changeReaderFontSize(-1));
        document.getElementById('readen-rf-size-plus').addEventListener('click', () => changeReaderFontSize(1));
        document.getElementById('readen-rf-size-slider').addEventListener('input', (e) => changeReaderFontSize(e.target.value, true));
        document.getElementById('readen-rf-bright-minus').addEventListener('click', () => changeReaderBrightness(-5));
        document.getElementById('readen-rf-bright-plus').addEventListener('click', () => changeReaderBrightness(5));
        document.getElementById('readen-rf-bright-slider').addEventListener('input', (e) => changeReaderBrightness(e.target.value, true));
        document.getElementById('readen-rf-spacing-slider').addEventListener('input', (e) => {
            changeReaderSpacing(e.target.value);
        });
        document.getElementById('readen-reader-night-btn').addEventListener('click', toggleNightMode);
        document.getElementById('readen-rf-anim-val').addEventListener('click', openAnimModal);
        bindReadenOptional('readen-reader-page-mode-btn', 'click', openAnimModal);
        bindReadenOptional('readen-rf-size-slider-live', 'input', (e) => changeReaderFontSize(e.target.value, true));
        bindReadenOptional('readen-rf-bright-slider-live', 'input', (e) => changeReaderBrightness(e.target.value, true));
        bindReadenOptional('readen-rf-spacing-slider-live', 'input', (e) => changeReaderSpacing(e.target.value));
        bindReadenOptional('readen-rf-anim-val-live', 'click', openAnimModal);
        bindReadenOptional('readen-reader-font-list-btn', 'click', showReaderFontListView);
        bindReadenOptional('readen-reader-font-back-btn', 'click', showReaderFontMainView);
        bindReadenOptional('readen-reader-font-local-btn', 'click', () => document.getElementById('readen-reader-font-input')?.click());
        bindReadenOptional('readen-reader-font-url-btn', 'click', addReaderFontByUrl);
        bindReadenOptional('readen-reader-font-input', 'change', handleReaderFontUpload);
        bindReadenOptional('readen-reader-bg-local-btn', 'click', () => {
            document.getElementById('readen-reader-bg-input')?.click();
        });
        bindReadenOptional('readen-reader-bg-url-btn', 'click', addReaderBackgroundByUrl);
        bindReadenOptional('readen-reader-bg-input', 'change', handleReaderBackgroundUpload);
        document.getElementById('readen-anim-modal-overlay').addEventListener('click', closeAnimModal);
        document.querySelectorAll('.anim-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                selectAnimMode(this.getAttribute('data-mode'));
            });
        });

        // 导入小说
        document.getElementById('readen-local-import-input').addEventListener('change', handleLocalImport);

        // 阅读器滑动事件
        const readerWrapper = document.getElementById('readen-reader-scroll-wrapper');
        readerWrapper.addEventListener('scroll', updateReaderProgress, { passive: true });
        document.addEventListener('selectionchange', scheduleReadenSelectionToolbar);
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartAt = 0;
        let readerSwipeDragging = false;

        readerWrapper.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            touchStartAt = Date.now();
            readerSwipeDragging = false;
            beginReadenCustomSelectionGesture(e);
        }, { passive: true });

        readerWrapper.addEventListener('touchmove', e => {
            if (updateReadenCustomSelectionGesture(e)) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (readerAnimMode !== 'shift' || readerPageTurnLocked || readerWrapper.classList.contains('scroll-mode')) return;

            const touch = e.changedTouches?.[0];
            const content = document.getElementById('readen-reader-content');
            if (!touch || !content) return;
            const deltaX = touch.screenX - touchStartX;
            const deltaY = touch.screenY - touchStartY;

            if (!readerSwipeDragging) {
                // While a long press may still turn into a selection, finger drift up to its 10 px
                // cancel distance must not move the page (that moved the text and snapped it back).
                const dragStartDistance = readenSelectionGesture ? 12 : 8;
                if (Math.abs(deltaX) < dragStartDistance || Math.abs(deltaX) <= Math.abs(deltaY)) return;
                readerSwipeDragging = true;
                content.classList.add('readen-page-dragging');
            }

            e.preventDefault();
            const pageWidth = Math.max(1, readerWrapper.clientWidth);
            let visualDelta = deltaX;
            if ((readerCurrentPage <= 0 && deltaX > 0) ||
                (readerCurrentPage >= readerTotalPages - 1 && deltaX < 0)) {
                visualDelta *= 0.28;
            }
            const x = -(readerCurrentPage * pageWidth) + visualDelta;
            content.style.transform = `translate3d(${x}px, 0, 0)`;
        }, { passive: false });

        readerWrapper.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const wasDragging = readerSwipeDragging;
            readerSwipeDragging = false;
            document.getElementById('readen-reader-content')?.classList.remove('readen-page-dragging');

            const isLongPress = Date.now() - touchStartAt > READEN_LONG_PRESS_MS;
            if (finishReadenCustomSelectionGesture(e)) {
                syncReaderPageTransform();
                return;
            }
            if (isLongPress || readenCustomSelection || window.getSelection()?.toString().trim()) {
                syncReaderPageTransform();
                return;
            }

            const interactiveTarget = e.target instanceof Element
                ? e.target.closest('button, a, input, textarea, select, label, [role="button"], [contenteditable="true"]')
                : null;
            if (interactiveTarget) {
                syncReaderPageTransform();
                return;
            }

            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) readerPrevPage();
                else readerNextPage();
            } else if (wasDragging) {
                syncReaderPageTransform();
            } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                readerLastTouchTapAt = Date.now();
                handleReaderPageTap(touchEndX);
            }
        });
        const settleSelectionGestureAfterTouch = () => {
            const gesture = readenSelectionGesture;
            if (!gesture) return;
            // Runs after the wrapper's own handler; only acts when that handler never saw this touch,
            // so a pending long press cannot select a word after the finger has already lifted.
            setTimeout(() => {
                if (readenSelectionGesture !== gesture) return;
                if (gesture.active) finishReadenCustomSelectionGesture({ preventDefault() {}, stopPropagation() {} });
                else cancelReadenCustomSelectionGesture();
            }, 0);
        };
        document.addEventListener('touchend', settleSelectionGestureAfterTouch, true);
        document.addEventListener('touchcancel', settleSelectionGestureAfterTouch, true);
        readerWrapper.addEventListener('touchcancel', e => {
            readerSwipeDragging = false;
            document.getElementById('readen-reader-content')?.classList.remove('readen-page-dragging');
            cancelReadenCustomSelectionGesture(e);
            syncReaderPageTransform();
        });

        readerWrapper.addEventListener('click', event => {
            if (Date.now() - readerLastTouchTapAt < 450) return;
            if (event.target.closest('.reader-menu, .reader-tool-panel, .reader-font-menu, .readen-reader-chapter-drawer, .readen-selection-toolbar')) return;
            if (readenCustomSelection) {
                clearReadenCustomSelection(true);
                return;
            }
            if (window.getSelection()?.toString().trim()) return;
            hideReadenSelectionToolbar();
            handleReaderPageTap(event.clientX);
        });
        document.addEventListener('contextmenu', event => {
            const readerContainer = document.getElementById('readen-reader-container');
            if (!readerContainer?.classList.contains('active')) return;
            if (!event.target.closest('#readen-reader-content, #readen-selection-toolbar, #readen-selection-handles, #readen-user-annotation-panel')) return;
            event.preventDefault();
        }, { capture: true });
    }

    // --- 核心业务函数 ---

    function showReadenDialog(options) {
        const overlay = document.getElementById('readen-dialog-overlay');
        const titleEl = document.getElementById('readen-dialog-title');
        const msgEl = document.getElementById('readen-dialog-msg');
        const inputEl = document.getElementById('readen-dialog-input');
        const cancelBtn = document.getElementById('readen-dialog-cancel');
        const confirmBtn = document.getElementById('readen-dialog-confirm');
        const footerEl = cancelBtn?.parentElement;

        titleEl.textContent = options.title || '提示';
        
        if (options.msg) {
            msgEl.style.display = 'block';
            msgEl.innerHTML = options.msg;
        } else {
            msgEl.style.display = 'none';
        }

        if (options.type === 'prompt') {
            inputEl.style.display = 'block';
            inputEl.value = options.defaultVal || '';
            inputEl.placeholder = options.placeholder || '';
        } else {
            inputEl.style.display = 'none';
        }
        if (footerEl) footerEl.style.display = options.type === 'loading' ? 'none' : 'flex';
        cancelBtn.textContent = options.cancelText || '取消';
        confirmBtn.textContent = options.confirmText || '确认';

        overlay.classList.add('active');

        cancelBtn.onclick = () => {
            overlay.classList.remove('active');
            if (options.onCancel) options.onCancel();
        };

        confirmBtn.onclick = () => {
            overlay.classList.remove('active');
            if (options.type === 'prompt') {
                if (options.onConfirm) options.onConfirm(inputEl.value);
            } else {
                if (options.onConfirm) options.onConfirm();
            }
        };
    }

    function switchTab(pageId, element) {
        els.navItems.forEach(nav => nav.classList.remove('active'));
        element.classList.add('active');
        els.pages.forEach(page => page.classList.remove('active'));
        document.getElementById('readen-page-' + pageId).classList.add('active');
        container.scrollTo(0, 0);
        if ((pageId === 'home' || pageId === 'stats') && readenStatisticsDirty) renderReadenStatisticsPanels();
    }

    function toggleBookshelfMenu() {
        const menu = document.getElementById('readen-bs-dropdown-menu');
        const overlay = document.getElementById('readen-bs-dropdown-overlay');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        } else {
            menu.classList.add('active');
            overlay.classList.add('active');
        }
    }

    function applyBookshelfView(viewType) {
        const listContainer = document.getElementById('readen-book-list-container');
        const gridMenu = document.getElementById('readen-menu-view-grid');
        const listMenu = document.getElementById('readen-menu-view-list');
        if (!listContainer || !gridMenu || !listMenu) return;
        const isGrid = viewType === 'grid';
        listContainer.classList.toggle('grid-view', isGrid);
        gridMenu.classList.toggle('active', isGrid);
        listMenu.classList.toggle('active', !isGrid);
    }

    function applyBookshelfShowcase(visible) {
        const showcase = document.getElementById('readen-bookshelf-showcase');
        const menuBtn = document.getElementById('readen-menu-view-showcase');
        if (!showcase || !menuBtn) return;
        menuBtn.classList.toggle('active', visible);
        showcase.style.display = visible ? 'flex' : 'none';
    }

    // Bookshelf view, sort and showcase choices are kept in readenSettings (IndexedDB).
    function restoreBookshelfPreferences() {
        applyBookshelfView(readenSettings.bookshelfView === 'grid' ? 'grid' : 'list');
        applyBookshelfShowcase(readenSettings.bookshelfShowcase !== false);
        const savedSort = ['lastRead', 'addTime', 'size', 'name'].includes(readenSettings.bookshelfSort) ? readenSettings.bookshelfSort : 'lastRead';
        currentSortMethod = savedSort;
        ['lastRead', 'addTime', 'size', 'name'].forEach(method => {
            document.getElementById('readen-sort-' + method)?.classList.toggle('active', method === savedSort);
        });
    }

    function setBookshelfView(viewType) {
        applyBookshelfView(viewType);
        readenSettings.bookshelfView = viewType === 'grid' ? 'grid' : 'list';
        saveReadenAppData();
        toggleBookshelfMenu();
    }

    function toggleShowcase() {
        const menuBtn = document.getElementById('readen-menu-view-showcase');
        const visible = !menuBtn.classList.contains('active');
        applyBookshelfShowcase(visible);
        readenSettings.bookshelfShowcase = visible;
        saveReadenAppData();
        toggleBookshelfMenu();
    }

    function updateShowcase() {
        const showcase = document.getElementById('readen-bookshelf-showcase');
        const shelfBase = showcase.querySelector('.shelf-base');
        
        showcase.innerHTML = ''; 
        showcase.appendChild(shelfBase); 

        const bookCards = document.querySelectorAll('#readen-book-list-container .book-card');
        const positions = ['book-center', 'book-left-1', 'book-right-1', 'book-left-2', 'book-right-2'];
        
        const allThemes = getAllCoverThemes();
        const theme = allThemes[readenGlobalThemeIndex] || allThemes[0];
        const isTransparentTheme = theme.transparentBg;

        for (let i = 0; i < Math.min(bookCards.length, 5); i++) {
            const showcaseBook = document.createElement('div');
            showcaseBook.className = `showcase-book ${positions[i]}`;
            showcaseBook.style.padding = '0';
            
            const originalCover = bookCards[i].querySelector('.book-cover');
            const hasCustomCover = originalCover.querySelector('img') !== null;
            
            if (isTransparentTheme || hasCustomCover) {
                showcaseBook.style.backgroundColor = 'transparent';
                showcaseBook.style.border = 'none';
                showcaseBook.style.boxShadow = 'none';
            } else {
                showcaseBook.style.backgroundColor = '#fff';
                showcaseBook.style.border = '1px solid #eee';
                showcaseBook.style.boxShadow = '';
            }
            
            const coverHTML = originalCover.innerHTML;
            showcaseBook.innerHTML = coverHTML;
            
            const moreBtn = showcaseBook.querySelector('.grid-meta-more');
            if (moreBtn) moreBtn.remove();
            
            showcase.appendChild(showcaseBook);
        }
    }

    function renderGroupTabs() {
        const tabsContainer = document.getElementById('readen-category-tabs');
        tabsContainer.innerHTML = '';
        readenGroups.forEach(group => {
            const tab = document.createElement('div');
            tab.className = `tab ${group === currentGroup ? 'active' : ''}`;
            tab.textContent = group;
            tab.onclick = () => {
                currentGroup = group;
                renderGroupTabs();
                renderBookList();
            };
            tabsContainer.appendChild(tab);
        });
    }

    function createGroup() {
        toggleBookshelfMenu();
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('创建分组', { placeholder: '请输入新分组名称', value: '' }, '确定').then((groupName) => {
                if (groupName && groupName.trim() !== "" && !readenGroups.includes(groupName.trim())) {
                    readenGroups.push(groupName.trim());
                    saveReadenAppData();
                    renderGroupTabs();
                }
            });
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '创建分组',
                placeholder: '请输入新分组名称',
                onConfirm: (groupName) => {
                    if (groupName && groupName.trim() !== "" && !readenGroups.includes(groupName.trim())) {
                        readenGroups.push(groupName.trim());
                        saveReadenAppData();
                        renderGroupTabs();
                    }
                }
            });
        }
    }

    function setSortMethod(method) {
        currentSortMethod = method;
        readenSettings.bookshelfSort = method;
        saveReadenAppData();
        ['lastRead', 'addTime', 'size', 'name'].forEach(m => {
            const el = document.getElementById('readen-sort-' + m);
            if (el) {
                if (m === method) el.classList.add('active');
                else el.classList.remove('active');
            }
        });
        toggleBookshelfMenu();
        renderBookList();
    }

    function renderBookList() {
        const bookListContainer = document.getElementById('readen-book-list-container');
        bookListContainer.innerHTML = ''; 

        let filteredBooks = currentGroup === '全部' 
            ? [...readenBooksData] 
            : readenBooksData.filter(book => book.group === currentGroup);

        filteredBooks.sort((a, b) => {
            if (currentSortMethod === 'lastRead') {
                const timeA = a.lastReadTime || a.id;
                const timeB = b.lastReadTime || b.id;
                return timeB - timeA; 
            } else if (currentSortMethod === 'addTime') {
                return b.id - a.id; 
            } else if (currentSortMethod === 'size') {
                const parseSize = (sizeStr) => {
                    if (!sizeStr) return 0;
                    const val = parseFloat(sizeStr);
                    if (sizeStr.includes('GB')) return val * 1024 * 1024;
                    if (sizeStr.includes('MB')) return val * 1024;
                    if (sizeStr.includes('KB')) return val;
                    return val;
                };
                return parseSize(b.size) - parseSize(a.size); 
            } else if (currentSortMethod === 'name') {
                return a.title.localeCompare(b.title, 'zh-CN'); 
            }
            return 0;
        });

        filteredBooks.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
        });

        filteredBooks.forEach(book => {
            const newBookCard = document.createElement('div');
            newBookCard.className = `book-card ${selectedBookIds.has(book.id) ? 'selected' : ''}`;
            newBookCard.onclick = () => {
                if (isMultiSelectMode) {
                    if (selectedBookIds.has(book.id)) {
                        selectedBookIds.delete(book.id);
                        newBookCard.classList.remove('selected');
                    } else {
                        selectedBookIds.add(book.id);
                        newBookCard.classList.add('selected');
                    }
                } else {
                    openBookDetails(book.id);
                }
            };
            
            let coverContent = '';
            let coverBg = '#ffffff'; 
            let coverBorder = '1px solid #eee'; 
            let coverShadow = '';
            
            const coverSource = getReadenBookCoverSource(book);
            if (coverSource) {
                coverContent = `<img src="${escapeReadenAttribute(coverSource)}" style="width: 100%; height: 100%; object-fit: contain; display: block;">`;
                coverBg = 'transparent'; 
                coverBorder = 'none';    
                coverShadow = 'none';
            } else {
                const allThemes = getAllCoverThemes();
                const theme = allThemes[readenGlobalThemeIndex] || allThemes[0];
                if (theme.transparentBg) {
                    coverBg = 'transparent';
                    coverBorder = 'none';
                    coverShadow = 'none';
                }
                if (theme.svgList && theme.svgList.length > 0) {
                    const coverIndex = book.id % theme.svgList.length;
                    coverContent = theme.svgList[coverIndex];
                } else {
                    coverContent = theme.svg;
                }
            }

            let pinBadge = book.isPinned ? `<div class="pin-badge">置顶</div>` : '';
            
            newBookCard.innerHTML = `
                ${pinBadge}
                <div class="book-checkbox"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                <div class="book-cover" style="padding: 0; overflow: hidden; background: ${coverBg}; border: ${coverBorder}; box-shadow: ${coverShadow}; position: relative;">
                    ${coverContent}
                    <div class="grid-meta-more" onclick="window.ReadenApp.openBookActionMenu(event, this, ${book.id})">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                    </div>
                </div>
                <div class="book-info">
                    <div>
                        <div class="book-title">${escapeReadenHtml(book.title)}</div>
                        <div class="book-author">本地导入</div>
                        <div class="tags-row">
                            <span class="tag tag-solid">${escapeReadenHtml(book.group)}</span>
                        </div>
                        <div class="book-desc">大小: ${escapeReadenHtml(book.size)}</div>
                    </div>
                    <div class="book-meta">
                        <span>${escapeReadenHtml(getReadenBookTimeLabel(book))}</span>
                        <div class="meta-more" onclick="window.ReadenApp.openBookActionMenu(event, this, ${book.id})"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg></div>
                    </div>
                </div>
            `;
            bookListContainer.appendChild(newBookCard);
        });

        updateShowcase();
        scheduleReadenStatisticsRender();

        const emptyState = document.querySelector('#readen-page-bookshelf .empty-bookshelf');
        if (emptyState) {
            emptyState.style.display = filteredBooks.length > 0 ? 'none' : 'flex';
        }
    }

    function openReadenSearch() {
        const panel = document.getElementById('readen-search-panel');
        if (!panel) return;
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        const input = document.getElementById('readen-search-input');
        input.value = '';
        renderReadenSearchResults();
        requestAnimationFrame(() => input.focus());
    }

    function closeReadenSearch() {
        const panel = document.getElementById('readen-search-panel');
        if (!panel) return;
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
    }

    function loadReadenSourceCatalog() {
        if (readenSourceCatalog) return Promise.resolve(readenSourceCatalog);
        if (readenSourceCatalogPromise) return readenSourceCatalogPromise;
        readenSourceCatalogPromise = fetch('filtered_sources/top-500-novel-manga.json')
            .then(response => {
                if (!response.ok) throw new Error(`source catalog ${response.status}`);
                return response.json();
            })
            .then(payload => {
                const seen = new Set();
                readenSourceCatalog = (payload.items || []).filter(source => {
                    const key = `${source.bookSourceName}|${source.bookSourceUrl}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
                return readenSourceCatalog;
            })
            .catch(error => {
                readenSourceCatalogPromise = null;
                throw error;
            });
        return readenSourceCatalogPromise;
    }

    function getReadenSourceKind(source) {
        return Number(source.bookSourceType) === 2 ? '漫画' : '小说';
    }

    function getReadenSourceSearchUrl(source, keyword) {
        const raw = String(source.searchUrl || '').trim();
        if (!raw || !keyword) return '';
        const searchPart = raw.split(',')[0].trim();
        if (!searchPart.includes('{{key}}')) return '';
        const base = String(source.bookSourceUrl || '').split('#')[0];
        try {
            return new URL(
                searchPart.replaceAll('{{key}}', encodeURIComponent(keyword)).replaceAll('{{page}}', '1'),
                base
            ).href;
        } catch (error) {
            return '';
        }
    }

    function renderReadenSearchResults() {
        const input = document.getElementById('readen-search-input');
        const status = document.getElementById('readen-search-status');
        const results = document.getElementById('readen-search-results');
        if (!input || !status || !results) return;
        const keyword = input.value.trim().toLocaleLowerCase();

        if (readenSearchMode === 'sources') {
            status.textContent = '正在加载小说与漫画书源…';
            loadReadenSourceCatalog().then(sources => {
                const matched = sources.filter(source => {
                    const text = `${source.bookSourceName} ${source.bookSourceUrl} ${getReadenSourceKind(source)}`.toLocaleLowerCase();
                    return !keyword || text.includes(keyword);
                });
                status.textContent = `${matched.length} 个书源`;
                results.innerHTML = matched.map(source => {
                    const name = escapeReadenHtml(source.bookSourceName || '未命名书源');
                    const url = escapeReadenHtml(source.bookSourceUrl || '');
                    const searchUrl = getReadenSourceSearchUrl(source, input.value.trim());
                    const actionUrl = searchUrl || source.bookSourceUrl || '#';
                    const actionText = searchUrl ? '搜索' : '打开';
                    return `
                        <div class="readen-search-result source-result">
                            <div class="readen-search-result-main">
                                <div class="readen-search-result-title">${name}</div>
                                <div class="readen-search-result-meta">${getReadenSourceKind(source)} · ${escapeReadenHtml(source.bookSourceGroup || '已筛选')}</div>
                                <div class="readen-search-result-url">${url}</div>
                            </div>
                            <a class="readen-search-result-action" href="${escapeReadenAttribute(actionUrl)}" target="_blank" rel="noopener">${actionText}</a>
                        </div>
                    `;
                }).join('') || '<div class="readen-search-empty">没有匹配的书源</div>';
            }).catch(error => {
                console.warn('[Readen] source catalog unavailable', error);
                status.textContent = '书源目录加载失败';
                results.innerHTML = '<div class="readen-search-empty">请检查书源文件是否存在</div>';
            });
            return;
        }

        const matched = readenBooksData.filter(book => {
            const text = `${book.title} ${book.group}`.toLocaleLowerCase();
            return !keyword || text.includes(keyword);
        });
        status.textContent = `${matched.length} 本本地书籍`;
        results.innerHTML = matched.map(book => `
            <button type="button" class="readen-search-result book-result" data-book-id="${book.id}">
                <div class="readen-search-result-title">${escapeReadenHtml(book.title)}</div>
                <div class="readen-search-result-meta">${escapeReadenHtml(book.group || '未分组')} · ${escapeReadenHtml(getReadenBookTimeLabel(book) || '未阅读')}</div>
            </button>
        `).join('') || '<div class="readen-search-empty">没有匹配的本地书籍</div>';
        results.querySelectorAll('[data-book-id]').forEach(item => item.addEventListener('click', () => {
            closeReadenSearch();
            openBookDetails(Number(item.dataset.bookId));
        }));
    }

    function escapeReadenHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function escapeReadenAttribute(value) {
        return escapeReadenHtml(value).replace(/`/g, '&#96;');
    }

    function scheduleReadenSearch() {
        clearTimeout(readenSearchTimer);
        readenSearchTimer = setTimeout(renderReadenSearchResults, 280);
    }

    function renderReadenSearchResults() {
        if (readenSearchMode === 'bookshelf') {
            renderReadenBookshelfSearchResults();
            return;
        }
        renderReadenOnlineSearchResults();
    }

    function renderReadenOnlineSearchResults() {
        const input = document.getElementById('readen-search-input');
        const status = document.getElementById('readen-search-status');
        const results = document.getElementById('readen-search-results');
        if (!input || !status || !results) return;

        const keyword = input.value.trim();
        const token = ++readenSearchRequestToken;
        readenLastOnlineSearchResults = [];

        if (!keyword) {
            status.textContent = '输入书名开始搜索。';
            results.innerHTML = '<div class="readen-search-empty">找到想看的书后，点击结果即可导入书架。</div>';
            return;
        }

        status.textContent = '正在搜书…';
        results.innerHTML = '<div class="readen-search-empty">稍等一下，正在找书。</div>';

        fetch(getReadenOnlineSearchUrl(keyword))
            .then(response => {
                if (!response.ok) throw new Error(`search ${response.status}`);
                return response.json();
            })
            .then(payload => {
                if (token !== readenSearchRequestToken) return;
                const items = Array.isArray(payload.items) ? payload.items : [];
                readenLastOnlineSearchResults = items;
                status.textContent = items.length
                    ? `找到 ${items.length} 个结果，点击即可导入书架。`
                    : '暂时没搜到，换个书名试试。';

                results.innerHTML = items.map((item, index) => {
                    const typeLabel = item.sourceKind === 'manga' ? '漫画' : '小说';
                    const author = item.author ? ` · ${escapeReadenHtml(item.author)}` : '';
                    const snippet = item.snippet
                        ? `<div class="readen-search-result-snippet">${escapeReadenHtml(item.snippet)}</div>`
                        : '';
                    return `
                        <button type="button" class="readen-search-result online-result" data-online-result-index="${index}">
                            <div class="readen-search-result-main">
                                <div class="readen-search-result-title">${escapeReadenHtml(item.title || '未命名书籍')}</div>
                                <div class="readen-search-result-meta">${typeLabel}${author}</div>
                                ${snippet}
                            </div>
                            <span class="readen-search-result-action">导入</span>
                        </button>
                    `;
                }).join('') || '<div class="readen-search-empty">没有匹配的书籍。</div>';

                results.querySelectorAll('[data-online-result-index]').forEach(item => {
                    item.addEventListener('click', () => importReadenOnlineSearchResult(Number(item.dataset.onlineResultIndex)));
                });
            })
            .catch(error => {
                if (token !== readenSearchRequestToken) return;
                console.warn('[Readen] online search unavailable', error);
                status.textContent = '暂时无法搜书。';
                results.innerHTML = '<div class="readen-search-empty">请稍后重试，或换个书名再搜。</div>';
            });
    }

    function getReadenSearchableChapters(book) {
        const chapters = Array.isArray(book?.chapters) ? getReaderChapters(book) : [];
        if (chapters.length) {
            return chapters.map((chapter, index) => ({
                index,
                title: typeof chapter === 'string' ? `第${index + 1}章` : (chapter?.title || `第${index + 1}章`),
                text: typeof chapter === 'string' ? chapter : String(chapter?.content || '')
            }));
        }
        const fullText = String(book?.fullText || '');
        return fullText ? [{ index: 0, title: '正文', text: fullText }] : [];
    }

    function collectReadenBookSearchMatches(book, keyword, limit = 100) {
        const lowerKeyword = String(keyword || '').toLocaleLowerCase();
        if (!book || !lowerKeyword) return [];
        const matches = [];
        getReadenSearchableChapters(book).some(chapter => {
            if (!chapter.text) return false;
            const paragraphs = getReaderParagraphs(chapter.text);
            const totalChars = Math.max(1, paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0));
            let charsBefore = 0;
            for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex += 1) {
                const paragraph = paragraphs[paragraphIndex];
                const lowerParagraph = paragraph.toLocaleLowerCase();
                let charOffset = lowerParagraph.indexOf(lowerKeyword);
                while (charOffset >= 0) {
                    const quote = paragraph.slice(charOffset, charOffset + String(keyword).length);
                    matches.push({
                        bookId: book.id,
                        bookTitle: book.title || '未命名书籍',
                        chapterIndex: chapter.index,
                        chapterTitle: chapter.title,
                        paragraphIndex,
                        charOffset,
                        quote,
                        progress: Math.max(0, Math.min(100, ((charsBefore + charOffset) / totalChars) * 100)),
                        snippet: buildReadenSearchSnippet(paragraph, charOffset, String(keyword).length)
                    });
                    if (matches.length >= limit) return true;
                    charOffset = lowerParagraph.indexOf(lowerKeyword, charOffset + Math.max(1, lowerKeyword.length));
                }
                charsBefore += paragraph.length;
            }
            return matches.length >= limit;
        });
        return matches;
    }

    function buildReadenSearchSnippet(text, position, matchLength) {
        const value = String(text || '');
        const start = Math.max(0, Number(position) - 42);
        const end = Math.min(value.length, Number(position) + Math.max(1, Number(matchLength)) + 58);
        const before = value.slice(start, position);
        const match = value.slice(position, position + Math.max(1, Number(matchLength)));
        const after = value.slice(position + match.length, end);
        return (start > 0 ? '…' : '') + escapeReadenHtml(before)
            + '<mark>' + escapeReadenHtml(match) + '</mark>'
            + escapeReadenHtml(after) + (end < value.length ? '…' : '');
    }

    function renderReadenBookshelfSearchResults() {
        const input = document.getElementById('readen-search-input');
        const status = document.getElementById('readen-search-status');
        const results = document.getElementById('readen-search-results');
        if (!input || !status || !results) return;

        const keyword = input.value.trim().toLocaleLowerCase();
        const metadataMatches = readenBooksData.filter(book => {
            const meta = book.sourceMeta || {};
            const text = `${book.title || ''} ${book.group || ''} ${meta.author || ''}`.toLocaleLowerCase();
            return !keyword || text.includes(keyword);
        });
        readenSearchContentResults = [];
        if (keyword) {
            readenBooksData.some(book => {
                const remaining = 100 - readenSearchContentResults.length;
                if (remaining <= 0) return true;
                readenSearchContentResults.push(...collectReadenBookSearchMatches(book, keyword, remaining));
                return readenSearchContentResults.length >= 100;
            });
        }

        const metadataMarkup = metadataMatches.map(book => `
            <button type="button" class="readen-search-result book-result" data-book-id="${book.id}">
                <div class="readen-search-result-main">
                    <div class="readen-search-result-title">${escapeReadenHtml(book.title)}</div>
                    <div class="readen-search-result-meta">${escapeReadenHtml(book.group || '未分组')} · ${escapeReadenHtml(getReadenBookTimeLabel(book) || '未读过')}</div>
                </div>
                <span class="readen-search-result-action">打开</span>
            </button>
        `).join('');
        const contentMarkup = readenSearchContentResults.map((match, index) => `
            <button type="button" class="readen-search-result book-result" data-search-content-index="${index}">
                <div class="readen-search-result-main">
                    <div class="readen-search-result-title">${escapeReadenHtml(match.bookTitle)}</div>
                    <div class="readen-search-result-meta">正文 · ${escapeReadenHtml(match.chapterTitle)} · 第${match.paragraphIndex + 1}段</div>
                    <div class="readen-search-result-snippet">${match.snippet}</div>
                </div>
                <span class="readen-search-result-action">定位</span>
            </button>
        `).join('');

        if (!keyword) status.textContent = `${metadataMatches.length} 本书架书籍`;
        else status.textContent = `${metadataMatches.length} 本书籍 · ${readenSearchContentResults.length} 处已缓存正文匹配${readenSearchContentResults.length >= 100 ? '（最多显示100条）' : ''}`;
        results.innerHTML = (metadataMarkup + contentMarkup) || '<div class="readen-search-empty">书架里没有匹配内容。</div>';
        results.querySelectorAll('[data-book-id]').forEach(item => item.addEventListener('click', () => {
            closeReadenSearch();
            openBookDetails(Number(item.dataset.bookId));
        }));
        results.querySelectorAll('[data-search-content-index]').forEach(item => item.addEventListener('click', () => {
            const match = readenSearchContentResults[Number(item.dataset.searchContentIndex)];
            const book = readenBooksData.find(candidate => String(candidate.id) === String(match?.bookId));
            if (!match || !book) return;
            closeReadenSearch();
            openReader(book.id, match.chapterIndex, {
                initialPosition: {
                    chapterIndex: match.chapterIndex,
                    paragraphIndex: match.paragraphIndex,
                    charOffset: match.charOffset,
                    quote: match.quote,
                    progress: match.progress,
                    updatedAt: Date.now()
                }
            });
        }));
    }
    function importReadenOnlineSearchResult(index) {
        const item = readenLastOnlineSearchResults[index];
        if (!item || !item.title) return;

        const resultKey = String(item.resultKey || '');
        const sourceKind = item.sourceKind === 'manga' ? 'manga' : 'novel';
        const existedBook = readenBooksData.find(book => {
            const meta = book.sourceMeta || {};
            if (resultKey && meta.resultKey === resultKey) return true;
            return book.title === item.title && (meta.kind || sourceKind) === sourceKind;
        });

        if (existedBook) {
            currentGroup = existedBook.group || currentGroup;
            closeReadenSearch();
            renderGroupTabs();
            renderBookList();
            openBookDetails(existedBook.id);
            if (typeof window.showToast === 'function') window.showToast('书架里已经有这本书了');
            return;
        }

        const targetGroup = sourceKind === 'manga' ? '漫画' : '小说';
        const now = Date.now();

        if (!readenGroups.includes(targetGroup)) {
            readenGroups.push(targetGroup);
        }

        const newBook = {
            id: now,
            title: item.title.trim(),
            size: '在线',
            time: '刚刚添加',
            group: targetGroup,
            isPinned: false,
            customCover: item.cover || null,
            lastReadTime: now,
            chapters: [],
            fullText: '',
            coReading: {
                enabled: false,
                contactId: '',
                linkedContactId: '',
                name: '',
                avatar: '',
                mode: 'follow_user',
                knowledge: null,
                chapterReflectionPrompted: [],
                createdAt: 0,
                updatedAt: 0
            },
            annotations: [],
            sourceMeta: {
                kind: sourceKind,
                author: item.author || '',
                cover: item.cover || '',
                resultKey,
                readToken: item.readToken || '',
                importedAt: now
            }
        };

        readenBooksData.unshift(newBook);
        saveReadenAppData();
        currentGroup = targetGroup;
        closeReadenSearch();
        renderGroupTabs();
        renderBookList();
        openBookDetails(newBook.id);
        if (typeof window.showToast === 'function') window.showToast('已导入书架');
    }
// =========================================================================
// 阅读 APP 核心逻辑 (js/readen-app.js) - 第 4 部分 (4/4)
// =========================================================================


    function ensureReadenEpubStyles() {
        if (document.getElementById('readen-epub-inline-styles')) return;
        const style = document.createElement('style');
        style.id = 'readen-epub-inline-styles';
        style.textContent = [
            '#readen-reader-content .readen-reader-epub-image { display: block; width: 100%; max-width: 100%; height: auto; margin: 18px auto; border-radius: 12px; object-fit: contain; }',
            '#readen-reader-content .readen-reader-epub-heading { margin: 1.4em 0 .7em; font-size: 1.18em; line-height: 1.5; font-weight: 700; }',
            '#readen-reader-content .readen-reader-epub-image-missing { margin: 18px 0; padding: 16px; border: 1px dashed rgba(120, 120, 128, .35); border-radius: 12px; color: #8a8a8e; text-align: center; font-size: 13px; }',
            '.readen-app-container.readen-night-mode #readen-reader-content .readen-reader-epub-image-missing { border-color: rgba(255, 255, 255, .25); color: #aaa; }'
        ].join('\n');
        document.head.appendChild(style);
    }

    function normalizeReadenEpubPath(path) {
        const value = String(path || '').replace(/\\/g, '/').split('#')[0];
        const parts = [];
        value.split('/').forEach(part => {
            if (!part || part === '.') return;
            if (part === '..') {
                parts.pop();
                return;
            }
            parts.push(part);
        });
        return parts.join('/');
    }

    function resolveReadenEpubPath(basePath, href) {
        let value = String(href || '').trim().replace(/\\/g, '/').split('#')[0];
        if (!value) return '';
        try { value = decodeURIComponent(value); } catch (error) { console.debug('EPUB path decode failed:', error); }
        if (value.startsWith('/')) return normalizeReadenEpubPath(value);
        const baseParts = normalizeReadenEpubPath(basePath).split('/');
        baseParts.pop();
        return normalizeReadenEpubPath(baseParts.concat(value.split('/')).join('/'));
    }

    function readReadenZipUint32(view, offset) { return view.getUint32(offset, true); }
    function readReadenZipUint16(view, offset) { return view.getUint16(offset, true); }

    function decodeReadenZipFilename(bytes, flags) {
        try { return new TextDecoder((flags & 0x800) ? 'utf-8' : 'utf-8').decode(bytes); }
        catch (error) { return new TextDecoder('utf-8').decode(bytes); }
    }

    async function inflateReadenZipEntry(bytes) {
        if (typeof DecompressionStream !== 'function') {
            throw new Error('当前浏览器不支持 EPUB 压缩内容解析，请更新浏览器后重试。');
        }
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    }

    async function createReadenZipArchive(file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const eocdSignature = 0x06054b50;
        const centralSignature = 0x02014b50;
        const localSignature = 0x04034b50;
        let eocdOffset = -1;
        const scanStart = Math.max(0, bytes.length - 65557);
        for (let offset = bytes.length - 22; offset >= scanStart; offset -= 1) {
            if (readReadenZipUint32(view, offset) === eocdSignature) {
                eocdOffset = offset;
                break;
            }
        }
        if (eocdOffset < 0) throw new Error('不是有效的 EPUB 压缩包。');

        const entryCount = readReadenZipUint16(view, eocdOffset + 10);
        const centralOffset = readReadenZipUint32(view, eocdOffset + 16);
        if (entryCount === 0xffff || centralOffset === 0xffffffff) {
            throw new Error('暂不支持 ZIP64 EPUB，请使用普通无加密 EPUB 文件。');
        }

        const entries = new Map();
        let cursor = centralOffset;
        for (let index = 0; index < entryCount; index += 1) {
            if (cursor + 46 > bytes.length || readReadenZipUint32(view, cursor) !== centralSignature) {
                throw new Error('EPUB 目录损坏，无法读取章节文件。');
            }
            const flags = readReadenZipUint16(view, cursor + 8);
            const compression = readReadenZipUint16(view, cursor + 10);
            const compressedSize = readReadenZipUint32(view, cursor + 20);
            const uncompressedSize = readReadenZipUint32(view, cursor + 24);
            const nameLength = readReadenZipUint16(view, cursor + 28);
            const extraLength = readReadenZipUint16(view, cursor + 30);
            const commentLength = readReadenZipUint16(view, cursor + 32);
            const localOffset = readReadenZipUint32(view, cursor + 42);
            const name = normalizeReadenEpubPath(decodeReadenZipFilename(bytes.slice(cursor + 46, cursor + 46 + nameLength), flags));
            if (name && (flags & 1)) throw new Error('EPUB 含有加密内容，暂不支持 DRM 或加密 EPUB。');
            if (name) entries.set(name, {compression, compressedSize, uncompressedSize, localOffset});
            cursor += 46 + nameLength + extraLength + commentLength;
        }

        const totalUncompressed = Array.from(entries.values()).reduce((sum, entry) => sum + entry.uncompressedSize, 0);
        if (totalUncompressed > 256 * 1024 * 1024) {
            throw new Error('EPUB 解压后超过 256 MB，为避免页面卡顿已停止导入。');
        }

        async function readEntry(path) {
            const normalizedPath = normalizeReadenEpubPath(path);
            const entry = entries.get(normalizedPath);
            if (!entry) throw new Error('EPUB 缺少文件：' + normalizedPath);
            const localOffset = entry.localOffset;
            if (localOffset + 30 > bytes.length || readReadenZipUint32(view, localOffset) !== localSignature) {
                throw new Error('EPUB 文件头损坏：' + normalizedPath);
            }
            const nameLength = readReadenZipUint16(view, localOffset + 26);
            const extraLength = readReadenZipUint16(view, localOffset + 28);
            const dataStart = localOffset + 30 + nameLength + extraLength;
            const dataEnd = dataStart + entry.compressedSize;
            if (dataEnd > bytes.length) throw new Error('EPUB 文件内容不完整：' + normalizedPath);
            const compressed = bytes.slice(dataStart, dataEnd);
            if (entry.compression === 0) return compressed;
            if (entry.compression === 8) return inflateReadenZipEntry(compressed);
            throw new Error('EPUB 使用了暂不支持的压缩方式：' + entry.compression);
        }

        return {
            has(path) { return entries.has(normalizeReadenEpubPath(path)); },
            async readText(path) { return new TextDecoder('utf-8').decode(await readEntry(path)); },
            async readBlob(path, mimeType) { return new Blob([await readEntry(path)], {type:mimeType || 'application/octet-stream'}); }
        };
    }

    function getReadenXmlElements(document, localName) {
        if (!document) return [];
        const expected = String(localName || '').toLowerCase();
        return Array.from(document.getElementsByTagName('*')).filter(element => {
            return String(element.localName || element.nodeName || '').split(':').pop().toLowerCase() === expected;
        });
    }

    function getReadenXmlAttribute(element, name) {
        if (!element) return '';
        const direct = element.getAttribute(name);
        if (direct !== null) return String(direct);
        const matched = Array.from(element.attributes || []).find(attribute => {
            return String(attribute.localName || attribute.name).toLowerCase() === String(name).toLowerCase();
        });
        return matched ? String(matched.value || '') : '';
    }

    function parseReadenEpubXml(text) {
        const document = new DOMParser().parseFromString(String(text || ''), 'application/xml');
        if (getReadenXmlElements(document, 'parsererror').length) throw new Error('EPUB XML 文件格式错误。');
        return document;
    }

    function parseReadenEpubXhtml(text) {
        let document = new DOMParser().parseFromString(String(text || ''), 'application/xhtml+xml');
        if (getReadenXmlElements(document, 'parsererror').length) document = new DOMParser().parseFromString(String(text || ''), 'text/html');
        return document;
    }

    function getReadenEpubText(element) {
        return String(element?.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function getReadenEpubMetadata(document) {
        const title = getReadenXmlElements(document, 'title').map(getReadenEpubText).find(Boolean) || '';
        const author = getReadenXmlElements(document, 'creator').map(getReadenEpubText).find(Boolean) || '';
        const description = getReadenXmlElements(document, 'description').map(getReadenEpubText).find(Boolean) || '';
        const coverMeta = getReadenXmlElements(document, 'meta').find(element => {
            return String(getReadenXmlAttribute(element, 'name')).toLowerCase() === 'cover';
        });
        return {title, author, description, coverId:getReadenXmlAttribute(coverMeta, 'content')};
    }

    function getReadenEpubMimeType(path) {
        const extension = String(path || '').split('.').pop().toLowerCase();
        const types = {avif:'image/avif', gif:'image/gif', jpeg:'image/jpeg', jpg:'image/jpeg', png:'image/png', svg:'image/svg+xml', webp:'image/webp'};
        return types[extension] || '';
    }

    async function readReadenEpubToc(zip, manifest, spine) {
        const titles = {};
        const tocItemId = getReadenXmlAttribute(spine, 'toc');
        const tocItem = (tocItemId && manifest.get(tocItemId)) || Array.from(manifest.values()).find(item => item.mediaType === 'application/x-dtbncx+xml');
        if (tocItem && zip.has(tocItem.href)) {
            const document = parseReadenEpubXml(await zip.readText(tocItem.href));
            getReadenXmlElements(document, 'navPoint').forEach(navPoint => {
                const content = getReadenXmlElements(navPoint, 'content')[0];
                const label = getReadenXmlElements(navPoint, 'navLabel')[0];
                const href = getReadenXmlAttribute(content, 'src');
                const title = getReadenEpubText(label);
                if (href && title) titles[resolveReadenEpubPath(tocItem.href, href)] = title;
            });
        }
        const navItem = Array.from(manifest.values()).find(item => String(item.properties || '').split(/\s+/).includes('nav'));
        if (navItem && zip.has(navItem.href)) {
            const document = parseReadenEpubXhtml(await zip.readText(navItem.href));
            getReadenXmlElements(document, 'a').forEach(link => {
                const href = getReadenXmlAttribute(link, 'href');
                const title = getReadenEpubText(link);
                if (href && title) titles[resolveReadenEpubPath(navItem.href, href)] = title;
            });
        }
        return titles;
    }

    function getReadenEpubDocumentTitle(document) {
        for (const tag of ['h1', 'h2', 'h3', 'title']) {
            const title = getReadenXmlElements(document, tag).map(getReadenEpubText).find(Boolean);
            if (title) return title;
        }
        return '';
    }

    async function extractReadenEpubBlocks(document, basePath, zip, assets) {
        const blockTags = new Set(['address','article','blockquote','div','h1','h2','h3','h4','h5','h6','li','p','pre','section','td','th','tr']);
        const skippedTags = new Set(['audio','canvas','head','script','style','svg','video']);
        const blocks = [];
        let textParts = [];
        let blockType = 'paragraph';

        const flushText = () => {
            const text = textParts.join('').replace(/\s+/g, ' ').trim();
            if (text) blocks.push({type:blockType, text});
            textParts = [];
            blockType = 'paragraph';
        };
        const walk = async node => {
            if (node.nodeType === 3) { textParts.push(node.nodeValue || ''); return; }
            if (node.nodeType !== 1) return;
            const element = node;
            const tag = String(element.localName || element.nodeName || '').toLowerCase();
            if (skippedTags.has(tag)) return;
            if (tag === 'br') { textParts.push('\n'); return; }
            if (tag === 'img') {
                flushText();
                const assetPath = resolveReadenEpubPath(basePath, getReadenXmlAttribute(element, 'src'));
                if (assetPath && zip.has(assetPath)) {
                    const assetId = 'epub-asset-' + assetPath;
                    if (!assets[assetId]) {
                        const type = getReadenXmlAttribute(element, 'type') || getReadenEpubMimeType(assetPath);
                        assets[assetId] = await zip.readBlob(assetPath, type || undefined);
                    }
                    blocks.push({type:'image', assetId, alt:getReadenXmlAttribute(element, 'alt') || ''});
                }
                return;
            }
            const isBlock = blockTags.has(tag);
            if (isBlock && textParts.length) flushText();
            if (isBlock && /^h[1-6]$/.test(tag)) blockType = 'heading';
            for (const child of Array.from(element.childNodes || [])) await walk(child);
            if (isBlock) flushText();
        };

        const root = document.body || document.documentElement;
        for (const child of Array.from(root?.childNodes || [])) await walk(child);
        flushText();
        return {
            blocks,
            text: blocks.filter(block => block.type !== 'image').map(block => block.text).join('\n\n')
        };
    }

    async function parseReadenEpubFile(file) {
        const zip = await createReadenZipArchive(file);
        if (!zip.has('META-INF/container.xml')) throw new Error('EPUB 缺少 META-INF/container.xml。');
        const containerDocument = parseReadenEpubXml(await zip.readText('META-INF/container.xml'));
        const rootfile = getReadenXmlElements(containerDocument, 'rootfile')[0];
        const opfPath = normalizeReadenEpubPath(getReadenXmlAttribute(rootfile, 'full-path'));
        if (!opfPath || !zip.has(opfPath)) throw new Error('EPUB 缺少有效的 OPF 书籍目录。');

        const opfDocument = parseReadenEpubXml(await zip.readText(opfPath));
        const metadata = getReadenEpubMetadata(opfDocument);
        const manifest = new Map();
        getReadenXmlElements(opfDocument, 'item').forEach(item => {
            const id = getReadenXmlAttribute(item, 'id');
            const href = resolveReadenEpubPath(opfPath, getReadenXmlAttribute(item, 'href'));
            if (id && href) manifest.set(id, {
                id,
                href,
                mediaType:getReadenXmlAttribute(item, 'media-type'),
                properties:getReadenXmlAttribute(item, 'properties')
            });
        });
        const spine = getReadenXmlElements(opfDocument, 'spine')[0];
        if (!spine) throw new Error('EPUB 缺少阅读顺序。');
        const tocTitles = await readReadenEpubToc(zip, manifest, spine);
        const chapters = [];
        const assets = {};
        const spineItems = getReadenXmlElements(spine, 'itemref');

        for (const itemRef of spineItems) {
            if (String(getReadenXmlAttribute(itemRef, 'linear')).toLowerCase() === 'no') continue;
            const item = manifest.get(getReadenXmlAttribute(itemRef, 'idref'));
            if (!item || !/xhtml|html/i.test(item.mediaType || '') || !zip.has(item.href)) continue;
            const document = parseReadenEpubXhtml(await zip.readText(item.href));
            const extracted = await extractReadenEpubBlocks(document, item.href, zip, assets);
            if (!extracted.text && !extracted.blocks.some(block => block.type === 'image')) continue;
            chapters.push({
                key:'epub-' + String(chapters.length + 1),
                title:tocTitles[item.href] || getReadenEpubDocumentTitle(document) || ('第' + (chapters.length + 1) + '章'),
                content:extracted.text,
                epubBlocks:extracted.blocks,
                progress:0
            });
        }
        if (!chapters.length) throw new Error('EPUB 中没有可读取的正文章节。');

        let cover = null;
        let coverItem = metadata.coverId ? manifest.get(metadata.coverId) : null;
        if (!coverItem) coverItem = Array.from(manifest.values()).find(item => String(item.properties || '').split(/\s+/).includes('cover-image'));
        if (coverItem && zip.has(coverItem.href)) cover = await zip.readBlob(coverItem.href, coverItem.mediaType || getReadenEpubMimeType(coverItem.href));

        return {
            title:metadata.title || String(file.name || '').replace(/\.[^/.]+$/, '') || '未命名 EPUB',
            author:metadata.author || '',
            description:metadata.description || '',
            cover,
            assets,
            chapters
        };
    }

    function getReadenEpubObjectUrl(book, assetId, blob) {
        if (!blob || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return '';
        const key = String(book?.id || '') + '::' + String(assetId || '');
        const existing = readenEpubObjectUrlCache.get(key);
        if (existing && existing.blob === blob) return existing.url;
        if (existing?.url && typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(existing.url);
        const url = URL.createObjectURL(blob);
        readenEpubObjectUrlCache.set(key, {bookId:book?.id, blob, url});
        return url;
    }

    function getReadenEpubAssetSource(book, assetId) {
        const asset = book?.epubAssets?.[assetId];
        if (typeof asset === 'string') return asset;
        if (typeof Blob !== 'undefined' && asset instanceof Blob) return getReadenEpubObjectUrl(book, assetId, asset);
        return '';
    }

    function getReadenBookCoverSource(book) {
        if (typeof book?.customCover === 'string' && book.customCover) return book.customCover;
        if (typeof Blob !== 'undefined' && book?.epubCover instanceof Blob) return getReadenEpubObjectUrl(book, '__cover__', book.epubCover);
        return '';
    }

    function releaseReadenEpubBookAssets(book) {
        if (!book || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') return;
        Array.from(readenEpubObjectUrlCache.entries()).forEach(([key, entry]) => {
            if (entry?.bookId !== book.id) return;
            URL.revokeObjectURL(entry.url);
            readenEpubObjectUrlCache.delete(key);
        });
    }

    function handleLocalImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        const isEpub = /\.epub$/i.test(file.name || '');
        const isTxt = /\.txt$/i.test(file.name || '');
        if (!isTxt && !isEpub) {
            if (typeof window.showToast === 'function') window.showToast('当前只支持导入 TXT 或无加密 EPUB 文件');
            event.target.value = '';
            return;
        }

        const fileName = file.name.replace(/\.[^/.]+$/, '');
        const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        const doImportToGroup = async targetGroup => {
            targetGroup = (targetGroup || '').trim() || '全部';
            if (!isEpub && !readenGroups.includes(targetGroup)) {
                readenGroups.push(targetGroup);
                renderGroupTabs();
            }
            if (isEpub) {
                await importReadenEpubFile(file, targetGroup);
                event.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const text = decodeReadenLocalText(e.target.result);
                // Chapter titles may be indented (full-width spaces are common in Chinese TXT files),
                // and some books use standalone headings such as 楔子 / 序章 / 番外 / 尾声.
                const chapterRegex = /^[ \t\u3000\u00a0]*((?:第[零〇一二两三四五六七八九十百千万0-9０-９]+[章卷节回集部篇][^\n]{0,50}|(?:楔子|序章|序言|序|引子|引言|尾声|后记|终章|番外)(?:[ \t\u3000:：·\-—][^\n]{0,40}|[一二三四五六七八九十0-9０-９]+[^\n]{0,40})?))[ \t\u3000\u00a0]*$/gm;
                let chapters = [];
                const parts = text.split(chapterRegex);
                if (parts[0].trim() !== '') chapters.push({title:'前言', content:parts[0].trim()});
                for (let i = 1; i < parts.length; i += 2) {
                    chapters.push({title:parts[i].trim(), content:parts[i + 1] ? parts[i + 1].trim() : ''});
                }
                if (!chapters.length) chapters.push({title:'正文', content:text.trim()});
                chapters = normalizeReadenLargeChapters(chapters);

                readenBooksData.unshift({
                    id:Date.now(),
                    title:fileName,
                    size:fileSize,
                    time:'刚刚添加',
                    group:targetGroup,
                    isPinned:false,
                    customCover:null,
                    lastReadTime:Date.now(),
                    chapters,
                    fullText:'',
                    coReading:{
                        enabled:false,
                        contactId:'',
                        linkedContactId:'',
                        mode:'follow_user',
                        knowledge:null,
                        chapterReflectionPrompted:[],
                        createdAt:0,
                        updatedAt:0
                    },
                    annotations:[]
                });
                saveReadenAppData();
                currentGroup = targetGroup;
                renderGroupTabs();
                renderBookList();
            };
            reader.onerror = () => {
                if (typeof window.showToast === 'function') window.showToast('TXT 文件读取失败');
            };
            reader.readAsArrayBuffer(file);
            event.target.value = '';
        };

        const openGroupPicker = () => {
            if (typeof openUniversalSelect === 'function') {
                openUniversalSelect({
                    title:'选择导入分组',
                    items:readenGroups.map(g => ({label:g, value:g})),
                    currentValue:currentGroup || '全部',
                    searchable:true,
                    onSelect:targetGroup => { void doImportToGroup(targetGroup); }
                });
            } else {
                showReadenDialog({
                    type:'prompt',
                    title:'导入书籍',
                    msg:'请输入要导入的分组名称<br>(当前已有: ' + escapeReadenHtml(readenGroups.join(', ')) + ')',
                    defaultVal:currentGroup,
                    onConfirm:targetGroup => { void doImportToGroup(targetGroup); }
                });
            }
        };
        openGroupPicker();
    }

    async function importReadenEpubFile(file, targetGroup) {
        showReadenDialog({type:'loading', title:'正在导入 EPUB', msg:'正在解析书名、目录和正文，请稍候。'});
        try {
            const parsed = await parseReadenEpubFile(file);
            const now = Date.now();
            if (!readenGroups.includes(targetGroup)) readenGroups.push(targetGroup);
            readenBooksData.unshift({
                id:now,
                title:parsed.title,
                author:parsed.author,
                intro:parsed.description,
                format:'epub',
                size:(file.size / 1024 / 1024).toFixed(2) + ' MB',
                time:'刚刚添加',
                group:targetGroup,
                isPinned:false,
                customCover:null,
                epubCover:parsed.cover,
                epubAssets:parsed.assets,
                lastReadTime:now,
                chapters:parsed.chapters,
                fullText:'',
                coReading:{
                    enabled:false,
                    contactId:'',
                    linkedContactId:'',
                    mode:'follow_user',
                    knowledge:null,
                    chapterReflectionPrompted:[],
                    createdAt:0,
                    updatedAt:0
                },
                annotations:[],
                sourceMeta:{kind:'epub', author:parsed.author || '', cover:'', importedAt:now}
            });
            saveReadenAppData();
            currentGroup = targetGroup;
            renderGroupTabs();
            renderBookList();
            closeReadenDialogOverlay();
            if (typeof window.showToast === 'function') window.showToast('EPUB 已导入书架');
        } catch (error) {
            console.error('[Readen] EPUB import failed:', error);
            closeReadenDialogOverlay();
            showReadenDialog({
                type:'confirm',
                title:'EPUB 导入失败',
                msg:escapeReadenHtml(error?.message || '文件格式不受支持或内容损坏，未保存任何书籍。')
            });
        }
    }

    function countReadenReplacementChars(text) {
        return (String(text || '').match(/\uFFFD/g) || []).length;
    }

    function decodeReadenTextBuffer(buffer, encoding) {
        try {
            return new TextDecoder(encoding).decode(buffer);
        } catch {
            return new TextDecoder('utf-8').decode(buffer);
        }
    }

    function decodeReadenLocalText(buffer) {
        const bytes = new Uint8Array(buffer || []);
        if (bytes[0] === 0xFF && bytes[1] === 0xFE) return decodeReadenTextBuffer(buffer, 'utf-16le');
        if (bytes[0] === 0xFE && bytes[1] === 0xFF) return decodeReadenTextBuffer(buffer, 'utf-16be');
        if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) return decodeReadenTextBuffer(buffer, 'utf-8');

        const utf8Text = decodeReadenTextBuffer(buffer, 'utf-8');
        const utf8ReplacementCount = countReadenReplacementChars(utf8Text);
        if (utf8ReplacementCount >= 3) {
            const legacyText = decodeReadenTextBuffer(buffer, 'gb18030');
            if (countReadenReplacementChars(legacyText) < utf8ReplacementCount) return legacyText;
        }
        return utf8Text;
    }

    function openBookActionMenu(event, element, bookId) {
        event.stopPropagation();
        currentActionBookId = bookId;
        const menu = document.getElementById('readen-book-action-menu');
        const overlay = document.getElementById('readen-book-action-overlay');
        if (!menu || !overlay) return;
        
        menu.classList.add('active');
        overlay.classList.add('active');
        
        const card = element.closest('.book-card');
        if (card) card.classList.add('highlight');
    }

    function closeBookActionMenu() {
        const menu = document.getElementById('readen-book-action-menu');
        const overlay = document.getElementById('readen-book-action-overlay');
        if (menu) {
            menu.classList.remove('active');
            menu.style.top = '';
            menu.style.right = '';
            menu.style.left = '';
        }
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.book-card.highlight').forEach(card => card.classList.remove('highlight'));
    }

    function actionRenameBook() {
        closeBookActionMenu();
        const book = readenBooksData.find(b => b.id === currentActionBookId);
        if (!book) return;
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('重命名小说', { placeholder: '请输入新的小说名称', value: book.title || '' }, '确定').then((newName) => {
                if (newName && newName.trim() !== "") {
                    book.title = newName.trim();
                    saveReadenAppData();
                    renderBookList();
                }
            });
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '重命名',
                placeholder: '请输入新的小说名称',
                defaultVal: book.title,
                onConfirm: (newName) => {
                    if (newName && newName.trim() !== "") {
                        book.title = newName.trim();
                        saveReadenAppData();
                        renderBookList();
                    }
                }
            });
        }
    }

    function actionMoveBook() {
        closeBookActionMenu();
        const book = readenBooksData.find(b => b.id === currentActionBookId);
        if (!book) return;
        if (typeof openUniversalSelect === 'function') {
            const items = readenGroups.map(g => ({ label: g, value: g }));
            openUniversalSelect({
                title: '移动至分组',
                items: items,
                currentValue: book.group || '全部',
                searchable: true,
                onSelect: (targetGroup) => {
                    if (targetGroup && targetGroup.trim() !== "") {
                        const gName = targetGroup.trim();
                        if (!readenGroups.includes(gName)) {
                            readenGroups.push(gName);
                            renderGroupTabs();
                        }
                        book.group = gName;
                        saveReadenAppData();
                        renderBookList();
                    }
                }
            });
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '移动分组',
                msg: `请输入目标分组名称<br>(当前已有: ${escapeReadenHtml(readenGroups.join(', '))})`,
                defaultVal: book.group,
                onConfirm: (targetGroup) => {
                    if (targetGroup && targetGroup.trim() !== "") {
                        const gName = targetGroup.trim();
                        if (!readenGroups.includes(gName)) {
                            readenGroups.push(gName);
                            renderGroupTabs();
                        }
                        book.group = gName;
                        saveReadenAppData();
                        renderBookList();
                    }
                }
            });
        }
    }

    function actionDeleteBook() {
        closeBookActionMenu();
        showReadenDialog({
            type: 'confirm',
            title: '删除小说',
            msg: '确定要删除这本小说吗？此操作不可恢复。',
            onConfirm: () => {
                const deletedBook = readenBooksData.find(book => book.id === currentActionBookId);
                releaseReadenEpubBookAssets(deletedBook);
                readenBooksData = readenBooksData.filter(b => b.id !== currentActionBookId);
                saveReadenAppData();
                renderBookList();
            }
        });
    }

    function actionPinBook() {
        closeBookActionMenu();
        const book = readenBooksData.find(b => b.id === currentActionBookId);
        if (!book) return;
        book.isPinned = !book.isPinned; 
        saveReadenAppData();
        renderBookList();
    }

    function actionEditBook() {
        closeBookActionMenu();
        currentBookDetailsId = currentActionBookId;
        openBookEditModal();
    }

    function actionCustomCover() {
        closeBookActionMenu();
        const book = readenBooksData.find(b => b.id === currentActionBookId);
        if (!book) return;
        
        tempBase64Image = book.customCover || null;
        
        const modal = document.getElementById('readen-cover-modal-overlay');
        const previewImg = document.getElementById('readen-cover-preview-img');
        const previewText = document.getElementById('readen-cover-preview-text');
        
        if (tempBase64Image) {
            previewImg.src = tempBase64Image;
            previewImg.style.display = 'block';
            previewText.style.display = 'none';
        } else {
            previewImg.src = '';
            previewImg.style.display = 'none';
            previewText.style.display = 'block';
        }
        
        modal.classList.add('active');
    }

    function confirmCustomCover() {
        const book = readenBooksData.find(b => b.id === currentActionBookId);
        if (book && tempBase64Image !== undefined) {
            book.customCover = tempBase64Image;
            saveReadenAppData();
            renderBookList();
        }
        closeCoverModal();
    }

    function resetCustomCover() {
        tempBase64Image = null; 
        confirmCustomCover();   
    }

    function closeCoverModal() {
        document.getElementById('readen-cover-modal-overlay').classList.remove('active');
        tempBase64Image = null;
    }

    function handleCoverUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            tempBase64Image = event.target.result;
            document.getElementById('readen-cover-preview-img').src = tempBase64Image;
            document.getElementById('readen-cover-preview-img').style.display = 'block';
            document.getElementById('readen-cover-preview-text').style.display = 'none';
        };
        reader.readAsDataURL(file);
        e.target.value = ''; 
    }

    function enterMultiSelect() {
        closeBookActionMenu();
        isMultiSelectMode = true;
        selectedBookIds.clear();
        document.getElementById('readen-page-bookshelf').classList.add('multi-select-mode');
        const msBar = document.getElementById('readen-multi-select-bar');
        const bottomNav = document.getElementById('readen-bottom-nav');
        if (msBar) msBar.style.display = 'flex';
        if (bottomNav) bottomNav.style.display = 'none';
        renderBookList(); 
    }

    function exitMultiSelect() {
        isMultiSelectMode = false;
        selectedBookIds.clear();
        document.getElementById('readen-page-bookshelf').classList.remove('multi-select-mode');
        const msBar = document.getElementById('readen-multi-select-bar');
        const bottomNav = document.getElementById('readen-bottom-nav');
        if (msBar) msBar.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'flex';
        renderBookList(); 
    }

    function msMoveBooks() {
        if (selectedBookIds.size === 0) {
            showReadenDialog({ type: 'confirm', title: '提示', msg: '请先选择小说' });
            return;
        }
        if (typeof openUniversalSelect === 'function') {
            const items = readenGroups.map(g => ({ label: g, value: g }));
            openUniversalSelect({
                title: `批量移动 (${selectedBookIds.size}本)`,
                items: items,
                currentValue: currentGroup || '全部',
                searchable: true,
                onSelect: (targetGroup) => {
                    if (targetGroup && targetGroup.trim() !== "") {
                        const gName = targetGroup.trim();
                        if (!readenGroups.includes(gName)) {
                            readenGroups.push(gName);
                            renderGroupTabs();
                        }
                        readenBooksData.forEach(book => {
                            if (selectedBookIds.has(book.id)) book.group = gName;
                        });
                        saveReadenAppData();
                        exitMultiSelect();
                    }
                }
            });
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '批量移动',
                msg: `将选中的 ${selectedBookIds.size} 本小说移动到：<br>(当前已有: ${escapeReadenHtml(readenGroups.join(', '))})`,
                onConfirm: (targetGroup) => {
                    if (targetGroup && targetGroup.trim() !== "") {
                        const gName = targetGroup.trim();
                        if (!readenGroups.includes(gName)) {
                            readenGroups.push(gName);
                            renderGroupTabs();
                        }
                        readenBooksData.forEach(book => {
                            if (selectedBookIds.has(book.id)) book.group = gName;
                        });
                        saveReadenAppData();
                        exitMultiSelect();
                    }
                }
            });
        }
    }

    function msDeleteBooks() {
        if (selectedBookIds.size === 0) {
            showReadenDialog({ type: 'confirm', title: '提示', msg: '请先选择小说' });
            return;
        }
        showReadenDialog({
            type: 'confirm',
            title: '批量删除',
            msg: `确定要删除选中的 ${selectedBookIds.size} 本小说吗？`,
            onConfirm: () => {
                readenBooksData = readenBooksData.filter(book => !selectedBookIds.has(book.id));
                saveReadenAppData();
                exitMultiSelect();
            }
        });
    }

    let readenFbBatchTab = 'font';
    const readenFbBatchSelected = new Set();

    function getReadenFbBatchItems() {
        return readenFbBatchTab === 'font'
            ? (readenSettings.fonts || [])
            : (readenSettings.backgrounds || []);
    }

    function ensureReadenFbBatchPage() {
        let page = document.getElementById('readen-page-fb-batch');
        if (page) return page;
        page = document.createElement('div');
        page.className = 'sub-page readen-fb-batch-page';
        page.id = 'readen-page-fb-batch';
        page.innerHTML = [
            '<div class="sub-header">',
                '<button type="button" class="sub-header-back" id="readen-fb-batch-back" aria-label="返回字体与背景">',
                    '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
                '</button>',
                '<div class="sub-header-title" id="readen-fb-batch-title">管理字体</div>',
                '<div class="readen-fb-batch-header-spacer"></div>',
            '</div>',

            '<div class="readen-fb-batch-top">',
                '<div class="readen-fb-batch-tabs" role="tablist" aria-label="管理资源类别">',
                    '<button type="button" data-fb-batch-tab="font" role="tab" aria-selected="true">字体</button>',
                    '<button type="button" data-fb-batch-tab="bg" role="tab" aria-selected="false">背景</button>',
                '</div>',
                '<div class="readen-fb-batch-summary-card">',
                    '<span class="readen-fb-batch-eyebrow">本地资源整理</span>',
                    '<div class="readen-fb-batch-summary-number"><strong id="readen-fb-batch-total">0</strong><span id="readen-fb-batch-unit">项自定义字体</span></div>',
                    '<p id="readen-fb-batch-description">系统内置字体会保留，删除前需要确认。</p>',
                '</div>',
            '</div>',
            '<div class="readen-fb-batch-toolbar">',
                '<span id="readen-fb-batch-hint">选择要删除的字体</span>',
                '<button type="button" id="readen-fb-batch-select-all">全选</button>',
            '</div>',
            '<div class="readen-fb-batch-list" id="readen-fb-batch-list"></div>',
            '<div class="readen-fb-batch-footer">',
                '<span id="readen-fb-batch-count">已选 0 项</span>',
                '<button type="button" id="readen-fb-batch-delete" disabled><svg width="18" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"/></svg><span>删除所选</span></button>',
            '</div>'
        ].join('');
        container.appendChild(page);
        page.querySelector('#readen-fb-batch-back').addEventListener('click', closeReadenFbBatchManager);
        page.querySelectorAll('[data-fb-batch-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextTab = button.dataset.fbBatchTab;
                if (nextTab === readenFbBatchTab) return;
                readenFbBatchTab = nextTab;
                readenFbBatchSelected.clear();
                switchFbTab(nextTab);
                renderReadenFbBatchList();
                page.querySelector('#readen-fb-batch-list').scrollTop = 0;
            });
        });
        page.querySelector('#readen-fb-batch-select-all').addEventListener('click', () => {
            const entries = getReadenFbBatchItems();
            const deletableIndices = entries.flatMap((item, index) => !item || item.type === 'builtin' ? [] : [index]);
            const allSelected = deletableIndices.length > 0 && deletableIndices.every(index => readenFbBatchSelected.has(index));
            readenFbBatchSelected.clear();
            if (!allSelected) deletableIndices.forEach(index => readenFbBatchSelected.add(index));
            renderReadenFbBatchList();
        });
        page.querySelector('#readen-fb-batch-list').addEventListener('change', event => {
            const check = event.target.closest('input[data-fb-batch-index]');
            if (!check) return;
            const index = Number(check.dataset.fbBatchIndex);
            const entry = getReadenFbBatchItems()[index];
            if (!entry || entry.type === 'builtin') return;
            if (check.checked) readenFbBatchSelected.add(index);
            else readenFbBatchSelected.delete(index);
            check.closest('.readen-fb-batch-item')?.classList.toggle('is-selected', check.checked);
            updateReadenFbBatchControls();
        });
        page.querySelector('#readen-fb-batch-delete').addEventListener('click', confirmReadenFbBatchDelete);
        return page;
    }

    function updateReadenFbBatchControls() {
        const page = document.getElementById('readen-page-fb-batch');
        if (!page) return;
        const entries = getReadenFbBatchItems();
        const deletableIndices = entries.flatMap((item, index) => !item || item.type === 'builtin' ? [] : [index]);
        const count = deletableIndices.filter(index => readenFbBatchSelected.has(index)).length;
        page.querySelector('#readen-fb-batch-count').textContent = '已选 ' + count + ' 项';
        page.querySelector('#readen-fb-batch-delete').disabled = count === 0;
        page.querySelector('#readen-fb-batch-delete span').textContent = count ? '删除所选 (' + count + ')' : '删除所选';
        const selectAll = page.querySelector('#readen-fb-batch-select-all');
        selectAll.disabled = deletableIndices.length === 0;
        selectAll.textContent = count === deletableIndices.length && count > 0 ? '取消全选' : '全选';
    }

    function renderReadenFbBatchList() {
        const page = ensureReadenFbBatchPage();
        const entries = getReadenFbBatchItems();
        const typeName = readenFbBatchTab === 'font' ? '字体' : '背景';
        page.querySelector('#readen-fb-batch-title').textContent = '管理' + typeName;
        const customCount = entries.filter(entry => entry && entry.type !== 'builtin').length;
        const builtinCount = entries.length - customCount;
        page.querySelectorAll('[data-fb-batch-tab]').forEach(button => {
            const active = button.dataset.fbBatchTab === readenFbBatchTab;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-selected', String(active));
        });
        page.querySelector('#readen-fb-batch-total').textContent = String(customCount);
        page.querySelector('#readen-fb-batch-unit').textContent = '项自定义' + typeName;
        page.querySelector('#readen-fb-batch-description').textContent = builtinCount
            ? '另外有 ' + builtinCount + ' 项系统内置资源，将始终保留。'
            : '仅整理自己导入或添加的' + typeName + '，删除前需要确认。';
        page.querySelector('#readen-fb-batch-hint').textContent = '可选择 ' + customCount + ' 项 · 点击勾选';
        const list = page.querySelector('#readen-fb-batch-list');
        const fragment = document.createDocumentFragment();
        entries.forEach((entry, index) => {
            const builtin = entry?.type === 'builtin';
            const row = document.createElement('label');
            row.className = 'readen-fb-batch-item' + (builtin ? ' is-builtin' : '') +
                (readenFbBatchSelected.has(index) && !builtin ? ' is-selected' : '');
            if (readenFbBatchTab === 'font') {
                const fontTile = document.createElement('span');
                fontTile.className = 'readen-fb-batch-font-tile';
                fontTile.textContent = 'Aa';
                fontTile.style.fontFamily = entry?.value || 'inherit';
                row.appendChild(fontTile);
            }
            if (readenFbBatchTab === 'bg') {
                const swatch = document.createElement('span');
                swatch.className = 'readen-fb-batch-swatch';
                if (entry?.type === 'color') swatch.style.backgroundColor = entry.value;
                else if (entry?.value) swatch.style.backgroundImage = 'url(' + JSON.stringify(entry.value) + ')';
                row.appendChild(swatch);
            }
            const copy = document.createElement('span');
            copy.className = 'readen-fb-batch-copy';
            const name = document.createElement('strong');
            name.textContent = entry?.name || ('未命名' + typeName);
            // 字体效果只展示在预览方块里，名称保持统一字重，便于辨认。
            const detail = document.createElement('small');
            const applied = readenFbBatchTab === 'font' ? readenSettings.font === entry?.value : readenSettings.bg === entry?.value;
            detail.textContent = builtin ? '系统内置 · 不可删除' : '自定义' + typeName + (applied ? ' · 使用中' : '');
            copy.append(name, detail);
            row.appendChild(copy);
            if (!builtin) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.fbBatchIndex = String(index);
                checkbox.checked = readenFbBatchSelected.has(index);
                checkbox.setAttribute('aria-label', '选择' + (entry.name || typeName));
                row.appendChild(checkbox);
            }
            fragment.appendChild(row);
        });
        if (!entries.length || entries.every(entry => entry?.type === 'builtin')) {
            const note = document.createElement('div');
            note.className = 'readen-fb-batch-empty';
            note.textContent = '暂无可删除的自定义' + typeName;
            fragment.appendChild(note);
        }
        list.replaceChildren(fragment);
        updateReadenFbBatchControls();
    }

    function openReadenFbBatchManager() {
        readenFbBatchTab = currentFbTab;
        readenFbBatchSelected.clear();
        const page = ensureReadenFbBatchPage();
        renderReadenFbBatchList();
        page.classList.add('active');
    }

    function closeReadenFbBatchManager() {
        document.getElementById('readen-page-fb-batch')?.classList.remove('active');
        readenFbBatchSelected.clear();
    }

    function confirmReadenFbBatchDelete() {
        const category = readenFbBatchTab;
        const entries = getReadenFbBatchItems();
        const indices = [...readenFbBatchSelected].filter(index => entries[index] && entries[index].type !== 'builtin');
        if (!indices.length) return;
        const typeName = category === 'font' ? '字体' : '背景';
        showReadenDialog({
            type: 'confirm',
            title: '删除自定义' + typeName,
            msg: '确定删除选中的 ' + indices.length + ' 项' + typeName + '？此操作不可恢复。',
            confirmText: '删除',
            onConfirm: () => {
                const key = category === 'font' ? 'fonts' : 'backgrounds';
                const latest = readenSettings[key] || [];
                const targets = new Set(indices.filter(index => latest[index] && latest[index].type !== 'builtin'));
                if (!targets.size) return;
                const selectedValues = new Set([...targets].map(index => latest[index].value));
                readenSettings[key] = latest.filter((item, index) => !targets.has(index));
                if (category === 'font' && selectedValues.has(readenSettings.font)) {
                    readenSettings.font = 'inherit';
                    container.style.fontFamily = 'inherit';
                }
                if (category === 'bg' && selectedValues.has(readenSettings.bg)) {
                    readenSettings.bg = '';
                    container.style.removeProperty('--bg-color');
                    container.style.backgroundImage = '';
                    container.style.backgroundSize = '';
                    container.style.backgroundAttachment = '';
                }
                saveReadenAppData();
                readenFbBatchSelected.clear();
                renderFontAndBgList();
                renderReadenFbBatchList();
                if (typeof window.showToast === 'function') window.showToast('已删除 ' + targets.size + ' 项' + typeName);
            }
        });
    }

    function openFontManager() {
        document.getElementById('readen-page-font-manager').classList.add('active');
        switchFbTab('font');
    }

    function closeFontManager() {
        closeReadenFbBatchManager();
        document.getElementById('readen-page-font-manager').classList.remove('active');
    }

    function closeReadenProfileSubPages() {
        [
            'readen-page-profile-editor',
            'readen-page-profile-notes',
            'readen-page-profile-roles',
            'readen-page-profile-groups'
        ].forEach(pageId => document.getElementById(pageId)?.classList.remove('active'));
    }

    function getReadenAllUserAnnotations() {
        return readenBooksData.flatMap(book => (book.annotations || [])
            .filter(annotation => annotation.kind === 'user_annotation')
            .map(annotation => ({ book, annotation })))
            .sort((a, b) => (Number(b.annotation.createdAt) || 0) - (Number(a.annotation.createdAt) || 0));
    }

    function getReadenAllCharacterAnnotations() {
        return readenBooksData.flatMap(book => (book.annotations || [])
            .filter(annotation => ['character_annotation', 'chapter_reflection'].includes(annotation.kind))
            .map(annotation => ({ book, annotation })))
            .sort((a, b) => (Number(b.annotation.createdAt) || 0) - (Number(a.annotation.createdAt) || 0));
    }

    function getReadenManagedGroups() {
        return readenGroups.filter(group => group !== '全部');
    }

    function getReadenGroupBookCount(groupName) {
        return readenBooksData.filter(book => (book.group || '全部') === groupName).length;
    }

    function openReadenProfileEditor() {
        closeReadenProfileSubPages();
        ensureReadenProfileState();
        readenProfileDraft = {
            name: getReadenProfileDisplayName(),
            avatar: getReadenProfileAvatar(),
            sign: getReadenProfileSign()
        };
        const nameInput = document.getElementById('readen-profile-name-input');
        if (nameInput) nameInput.value = readenProfileDraft.name;
        const signInput = document.getElementById('readen-profile-sign-input');
        if (signInput) signInput.value = readenProfileDraft.sign;
        renderReadenProfileEditorPreview();
        document.getElementById('readen-page-profile-editor')?.classList.add('active');
    }

    function closeReadenProfileEditor() {
        document.getElementById('readen-page-profile-editor')?.classList.remove('active');
        readenProfileDraft = null;
    }

    function openReadenProfileNotesPage() {
        closeReadenProfileSubPages();
        renderReadenProfileNotesPage();
        document.getElementById('readen-page-profile-notes')?.classList.add('active');
    }

    function openReadenProfileRolesPage() {
        closeReadenProfileSubPages();
        renderReadenProfileRolesPage();
        document.getElementById('readen-page-profile-roles')?.classList.add('active');
    }

    function openReadenProfileGroupsPage() {
        closeReadenProfileSubPages();
        renderReadenProfileGroupsPage();
        document.getElementById('readen-page-profile-groups')?.classList.add('active');
    }

    function switchFbTab(tab) {
        currentFbTab = tab;
        document.getElementById('readen-tab-btn-font').classList.toggle('active', tab === 'font');
        document.getElementById('readen-tab-btn-bg').classList.toggle('active', tab === 'bg');
        document.getElementById('readen-fb-panel-font').style.display = tab === 'font' ? 'block' : 'none';
        document.getElementById('readen-fb-panel-bg').style.display = tab === 'bg' ? 'block' : 'none';
        renderFontAndBgList();
    }

    function renderFontAndBgList() {
        if (!readenSettings.fonts) {
            readenSettings.fonts = [
                { name: '默认字体', value: 'inherit', type: 'builtin' },
                { name: '宋体', value: 'SimSun, STSong, serif', type: 'builtin' },
                { name: '微软黑体', value: '"Microsoft YaHei", sans-serif', type: 'builtin' }
            ];
        }
        if (!readenSettings.backgrounds) readenSettings.backgrounds = [];

        const fontContainer = document.getElementById('readen-font-list-container');
        const fontEmpty = document.getElementById('readen-font-empty-state');
        const bgContainer = document.getElementById('readen-bg-list-container');
        const bgEmpty = document.getElementById('readen-bg-empty-state');
        const bottomBar = document.getElementById('readen-fb-bottom-bar');
        const headerTitle = document.getElementById('readen-fb-header-title');

        if (currentFbTab === 'font') {
            headerTitle.textContent = `字体管理 (${readenSettings.fonts.length})`;
            if (readenSettings.fonts.length === 0) {
                fontContainer.style.display = 'none';
                fontEmpty.style.display = 'flex';
                bottomBar.style.display = 'none';
            } else {
                fontContainer.style.display = 'block';
                fontEmpty.style.display = 'none';
                bottomBar.style.display = 'flex';
                bottomBar.innerHTML = `
                    <div class="cover-btn confirm" style="flex: 1; padding: 12px; font-size: 15px; border-radius: 24px;" onclick="document.getElementById('readen-custom-font-input').click()">本地导入</div>
                    <div class="cover-btn confirm" style="flex: 1; padding: 12px; font-size: 15px; border-radius: 24px; background: #f0f0f0; color: var(--theme-blue);" onclick="window.ReadenApp.addFontByUrl()">URL导入</div>
                `;
                
                fontContainer.innerHTML = '';
                readenSettings.fonts.forEach((font) => {
                    const item = document.createElement('div');
                    item.className = 'my-list-item';
                    item.style.cursor = 'pointer';
                    item.style.background = '#fff';
                    item.style.borderRadius = '12px';
                    item.style.marginBottom = '8px';
                    item.style.border = 'none';
                    item.onclick = () => applyFont(font.value);
                    item.innerHTML = `
                        <div class="my-item-name" style="font-family: ${escapeReadenAttribute(font.value)}">${escapeReadenHtml(font.name)}</div>
                        ${readenSettings.font === font.value ? '<div style="color: var(--theme-blue); font-weight: bold;">✓</div>' : ''}
                    `;
                    fontContainer.appendChild(item);
                });
            }
        } else {
            headerTitle.textContent = `背景管理 (${readenSettings.backgrounds.length})`;
            if (readenSettings.backgrounds.length === 0) {
                bgContainer.style.display = 'none';
                bgEmpty.style.display = 'flex';
                bottomBar.style.display = 'none';
            } else {
                bgContainer.style.display = 'block';
                bgEmpty.style.display = 'none';
                bottomBar.style.display = 'flex';
                bottomBar.innerHTML = `
                    <div class="cover-btn confirm" style="flex: 1; padding: 12px; font-size: 15px; border-radius: 24px;" onclick="document.getElementById('readen-custom-bg-input').click()">本地导入</div>
                `;
                
                bgContainer.innerHTML = '';
                readenSettings.backgrounds.forEach((bg) => {
                    const item = document.createElement('div');
                    item.className = 'my-list-item';
                    item.style.cursor = 'pointer';
                    item.style.background = '#fff';
                    item.style.borderRadius = '12px';
                    item.style.marginBottom = '8px';
                    item.style.border = 'none';
                    item.onclick = () => applyBg(bg.value, bg.type);
                    
                    let previewStyle = bg.type === 'color' ? `background: ${bg.value};` : `background: url(${bg.value}) center/cover;`;
                    item.innerHTML = `
                        <div style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #eee; margin-right: 12px; ${previewStyle}"></div>
                        <div class="my-item-name">${escapeReadenHtml(bg.name)}</div>
                        ${readenSettings.bg === bg.value ? '<div style="color: var(--theme-blue); font-weight: bold;">✓</div>' : ''}
                    `;
                    bgContainer.appendChild(item);
                });
            }
        }
    }

    function applyFont(fontValue) {
        readenSettings.font = fontValue;
        saveReadenAppData();
        container.style.fontFamily = fontValue;
        renderFontAndBgList();
    }

    function applyBg(bgValue, type) {
        readenSettings.bg = bgValue;
        saveReadenAppData();
        if (type === 'color') {
            container.style.setProperty('--bg-color', bgValue);
            container.style.backgroundImage = 'none';
        } else {
            container.style.setProperty('--bg-color', 'transparent');
            container.style.backgroundImage = `url(${bgValue})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundAttachment = 'fixed';
        }
        renderFontAndBgList();
    }

    // Custom app fonts keep their file (Blob) or URL in readenSettings.fonts so they can be re-registered after a restart.
    const readenAppFontObjectUrls = new Map();

    function escapeReadenCssString(value) {
        return String(value || '').replace(/[\\"]/g, '\\$&').replace(/[\r\n]/g, '');
    }

    function registerReadenAppFontFace(font) {
        if (!font || font.type !== 'custom' || !font.family) return false;
        let sourceUrl = '';
        if (typeof Blob !== 'undefined' && font.blob instanceof Blob) {
            sourceUrl = readenAppFontObjectUrls.get(font.family) || '';
            if (!sourceUrl && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
                sourceUrl = URL.createObjectURL(font.blob);
                readenAppFontObjectUrls.set(font.family, sourceUrl);
            }
        } else if (typeof font.url === 'string') {
            sourceUrl = font.url.trim();
        }
        if (!sourceUrl) return false;
        const styleId = `readen-app-font-${font.family}`;
        if (document.getElementById(styleId)) return true;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `@font-face { font-family: "${escapeReadenCssString(font.family)}"; src: url("${escapeReadenCssString(sourceUrl)}"); font-display: swap; }`;
        document.head.appendChild(style);
        return true;
    }

    function restoreReadenAppCustomFonts() {
        (Array.isArray(readenSettings.fonts) ? readenSettings.fonts : []).forEach(registerReadenAppFontFace);
    }

    function addReadenAppCustomFont(fontEntry) {
        if (!Array.isArray(readenSettings.fonts)) renderFontAndBgList();
        registerReadenAppFontFace(fontEntry);
        readenSettings.fonts.push(fontEntry);
        saveReadenAppData();
        renderFontAndBgList();
    }

    function handleFontUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const fontName = 'CustomFont_' + Date.now();
        addReadenAppCustomFont({ name: file.name, value: `'${fontName}'`, family: fontName, blob: file, type: 'custom' });
        e.target.value = '';
    }

    function addFontByUrl() {
        const doAdd = (url) => {
            if (!url || url.trim() === "") return;
            const fontName = 'CustomFont_' + Date.now();
            addReadenAppCustomFont({ name: 'URL字体', value: `'${fontName}'`, family: fontName, url: url.trim(), type: 'custom' });
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('URL导入字体', { placeholder: '请输入字体文件URL (.ttf, .woff 等)', value: '' }, '确定').then(doAdd);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: 'URL导入字体',
                placeholder: '请输入字体文件URL (.ttf, .woff 等)',
                onConfirm: doAdd
            });
        }
    }

    function handleBgUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            readenSettings.backgrounds.push({ name: '自定义背景_' + Date.now().toString().slice(-4), value: event.target.result, type: 'image' });
            saveReadenAppData();
            renderFontAndBgList();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    let tempEditBookCover = null;

    function openBookEditModal() {
        const book = readenBooksData.find(b => b.id === currentBookDetailsId);
        if (!book) return;

        tempEditBookCover = book.customCover || null;
        document.getElementById('readen-edit-book-title').value = book.title || '';
        document.getElementById('readen-edit-book-author').value = book.author || (book.sourceMeta?.author) || '';
        document.getElementById('readen-edit-book-intro').value = book.intro || '';

        const previewImg = document.getElementById('readen-edit-cover-preview-img');
        const previewText = document.getElementById('readen-edit-cover-preview-text');

        if (tempEditBookCover) {
            previewImg.src = tempEditBookCover;
            previewImg.style.display = 'block';
            previewText.style.display = 'none';
        } else {
            previewImg.src = '';
            previewImg.style.display = 'none';
            previewText.style.display = 'block';
        }

        document.getElementById('readen-book-edit-modal-overlay').classList.add('active');
    }

    function closeBookEditModal() {
        document.getElementById('readen-book-edit-modal-overlay').classList.remove('active');
        tempEditBookCover = null;
    }

    function handleBookEditCoverUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            tempEditBookCover = event.target.result;
            const previewImg = document.getElementById('readen-edit-cover-preview-img');
            const previewText = document.getElementById('readen-edit-cover-preview-text');
            previewImg.src = tempEditBookCover;
            previewImg.style.display = 'block';
            previewText.style.display = 'none';
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function editBookCoverByUrl() {
        const doEdit = (url) => {
            const imgUrl = String(url || '').trim();
            if (!imgUrl) return;
            if (!/^https?:\/\//i.test(imgUrl)) {
                showReadenDialog({ type: 'confirm', title: 'URL无效', msg: '请输入以 http:// 或 https:// 开头的图片地址。' });
                return;
            }
            tempEditBookCover = imgUrl;
            const previewImg = document.getElementById('readen-edit-cover-preview-img');
            const previewText = document.getElementById('readen-edit-cover-preview-text');
            if (previewImg) {
                previewImg.src = tempEditBookCover;
                previewImg.style.display = 'block';
            }
            if (previewText) previewText.style.display = 'none';
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('URL导入封面', { placeholder: '请输入图片URL地址', value: '' }, '确定').then(doEdit);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: 'URL导入封面',
                placeholder: '请输入图片URL地址',
                onConfirm: doEdit
            });
        }
    }

    function confirmBookEdit() {
        const book = readenBooksData.find(b => b.id === currentBookDetailsId);
        if (!book) return;

        const newTitle = document.getElementById('readen-edit-book-title').value.trim();
        const newAuthor = document.getElementById('readen-edit-book-author').value.trim();
        const newIntro = document.getElementById('readen-edit-book-intro').value.trim();

        if (newTitle) book.title = newTitle;
        book.author = newAuthor;
        book.intro = newIntro;
        if (tempEditBookCover !== undefined) book.customCover = tempEditBookCover;

        saveReadenAppData();
        renderBookList();
        if (document.getElementById('readen-page-book-details')?.classList.contains('active')) {
            openBookDetails(book.id);
        }
        closeBookEditModal();
        if (typeof window.showToast === 'function') window.showToast('书籍信息已更新');
    }

    function openBookDetails(bookId) {
        currentBookDetailsId = bookId;
        const book = readenBooksData.find(b => b.id === bookId);
        if (!book) return;

        document.getElementById('readen-bd-title').textContent = `《${book.title}》`;
        const authorText = book.author || (book.sourceMeta?.author) || '本地导入';
        document.getElementById('readen-bd-meta').textContent = `${book.size} / ${authorText}`;
        
        const coverContainer = document.getElementById('readen-bd-cover-container');
        const coverSource = getReadenBookCoverSource(book);
        if (coverSource) {
            coverContainer.innerHTML = `<img src="${escapeReadenAttribute(coverSource)}" style="width: 100%; height: 100%; object-fit: contain; display: block;">`;
            coverContainer.style.background = 'transparent';
            coverContainer.style.border = 'none';
            coverContainer.style.boxShadow = 'none';
        } else {
            const allThemes = getAllCoverThemes();
            const theme = allThemes[readenGlobalThemeIndex] || allThemes[0];
            if (theme.svgList && theme.svgList.length > 0) {
                coverContainer.innerHTML = theme.svgList[book.id % theme.svgList.length];
            } else {
                coverContainer.innerHTML = theme.svg;
            }
            if (theme.transparentBg) {
                coverContainer.style.background = 'transparent';
                coverContainer.style.border = 'none';
                coverContainer.style.boxShadow = 'none';
            } else {
                coverContainer.style.background = '#fff';
                coverContainer.style.border = '1px solid var(--divider)';
                coverContainer.style.boxShadow = '';
            }
        }

        document.getElementById('readen-page-book-details').classList.add('active');
        switchBdTab('intro', document.querySelector('.bd-tab'));
    }

    function closeBookDetails() {
        document.getElementById('readen-page-book-details').classList.remove('active');
    }


    function getReadenBookProgress(book) {
        if (!book) return 0;
        const statsProgress = Number(book.readerStats?.fullProgress);
        if (Number.isFinite(statsProgress) && statsProgress > 0) {
            return Math.max(0, Math.min(100, statsProgress));
        }
        const chapters = Array.isArray(book.chapters) ? book.chapters : [];
        if (!chapters.length) return 0;
        const chapterIndex = Math.max(0, Math.min(chapters.length - 1, Number(book.currentChapterIndex) || 0));
        const chapterLengths = chapters.map(chapter => String(chapter?.content || '').replace(/\s+/g, '').length);
        const totalChars = chapterLengths.reduce((sum, length) => sum + length, 0);
        if (totalChars > 0) {
            const beforeChars = chapterLengths.slice(0, chapterIndex).reduce((sum, length) => sum + length, 0);
            const currentLength = chapterLengths[chapterIndex] || 0;
            const currentProgress = Math.max(0, Math.min(100, Number(chapters[chapterIndex]?.progress) || 0));
            return Math.max(0, Math.min(100, ((beforeChars + currentLength * currentProgress / 100) / totalChars) * 100));
        }
        const currentProgress = Math.max(0, Math.min(100, Number(chapters[chapterIndex]?.progress) || 0));
        return Math.max(0, Math.min(100, ((chapterIndex + currentProgress / 100) / chapters.length) * 100));
    }

    function getReadenBookStatus(book) {
        const progress = getReadenBookProgress(book);
        if (progress >= 99 || Number(book?.readerStats?.completedAt) > 0) return '已读完';
        return progress > 0 ? '阅读中' : '未读过';
    }

    function formatReadenRelativeTime(timestamp) {
        const time = Number(timestamp) || 0;
        if (!time) return '';
        const diffMs = Math.max(0, Date.now() - time);
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diffMs < minute) return '刚刚';
        if (diffMs < hour) return `${Math.floor(diffMs / minute)} 分钟前`;
        if (diffMs < day) return `${Math.floor(diffMs / hour)} 小时前`;
        if (diffMs < 2 * day) return '昨天';
        if (diffMs < 30 * day) return `${Math.floor(diffMs / day)} 天前`;
        const date = new Date(time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // book.time is a fixed string written at import ("刚刚添加"); derive the label from real timestamps instead.
    function getReadenBookTimeLabel(book) {
        const stats = book?.readerStats;
        const hasOpened = Number(stats?.openCount) > 0 || Number(stats?.lastOpenedAt) > 0;
        if (hasOpened) {
            const readLabel = formatReadenRelativeTime(book.lastReadTime || stats?.lastOpenedAt);
            if (readLabel) return `${readLabel}阅读`;
        }
        const addedLabel = formatReadenRelativeTime(book?.sourceMeta?.importedAt || book?.importDate || book?.id);
        if (addedLabel) return `${addedLabel}添加`;
        return book?.time || '';
    }

    function getReadenBookSourceLabel(book) {
        const kind = book?.sourceMeta?.kind;
        if (kind === 'manga') return '在线漫画';
        if (kind === 'novel') return '在线小说';
        if (kind === 'epub') return 'EPUB';
        return 'TXT';
    }

    function getReadenBookSize(book) {
        if (book?.size) return String(book.size);
        const characters = String(book?.fullText || '').length;
        return characters ? (Math.max(1, Math.ceil(characters / 1024)) + ' KB') : '未知大小';
    }

    function getReadenAnnotationProgress(book, annotation) {
        const chapterIndex = Math.max(0, Number(annotation?.chapter?.indexAtCreation ?? annotation?.chapter?.index) || 0);
        const chapter = Array.isArray(book?.chapters) ? book.chapters[chapterIndex] : null;
        if (annotation?.kind === 'chapter_reflection') return 100;
        const quoteOffset = Number(annotation?.anchor?.startOffset);
        const textLength = String(chapter?.content || '').length;
        if (textLength > 0 && Number.isFinite(quoteOffset) && quoteOffset > 0) {
            return Math.max(0, Math.min(100, (quoteOffset / textLength) * 100));
        }
        const chapterProgress = Number(chapter?.progress);
        return Number.isFinite(chapterProgress) ? Math.max(0, Math.min(100, chapterProgress)) : 0;
    }

    function getReadenAnnotationChapterText(book, annotation) {
        const chapterIndex = Math.max(0, Number(annotation?.chapter?.indexAtCreation ?? annotation?.chapter?.index) || 0);
        const chapters = getReaderChapters(book);
        const chapter = chapters[chapterIndex];
        return String(chapter?.content || book?.fullText || '');
    }

    function getReadenAnnotationAnchorStatus(book, annotation) {
        if (annotation?.status === 'anchor_missing') return 'anchor_missing';
        const quote = String(annotation?.anchor?.quote || '').trim();
        const text = getReadenAnnotationChapterText(book, annotation);
        if (!quote || !text) return '';
        return resolveReaderAnnotationAnchor(annotation, getReaderParagraphs(text)) ? '' : 'anchor_missing';
    }

    function getReadenAnnotationPosition(book, annotation) {
        const anchor = annotation?.anchor || {};
        const chapterIndex = Math.max(0, Number(annotation?.chapter?.indexAtCreation ?? annotation?.chapter?.index) || 0);
        return {
            chapterKey: String(annotation?.chapter?.key || ''),
            chapterIndex,
            paragraphIndex: Math.max(0, Number(anchor.paragraphIndex) || 0),
            charOffset: Math.max(0, Number(anchor.startOffset) || 0),
            quote: String(anchor.quote || '').trim(),
            progress: getReadenAnnotationProgress(book, annotation),
            updatedAt: Date.now()
        };
    }

    function openReadenBookLocation(book, position, fallbackProgress = null, afterOpen = null) {
        if (!book) return;
        const source = position && typeof position === 'object' ? position : {};
        const chapterIndex = Math.max(0, Number(source.chapterIndex) || 0);
        const quote = String(source.quote || '').trim();
        const hasAnchor = Boolean(quote || Number(source.paragraphIndex) > 0 || Number(source.charOffset) > 0);
        const options = {};
        if (hasAnchor) {
            options.initialPosition = {
                chapterKey: String(source.chapterKey || ''),
                chapterIndex,
                paragraphIndex: Math.max(0, Number(source.paragraphIndex) || 0),
                charOffset: Math.max(0, Number(source.charOffset) || 0),
                quote,
                progress: Math.max(0, Math.min(100, Number(source.progress) || 0)),
                updatedAt: Date.now()
            };
        } else if (Number.isFinite(Number(fallbackProgress ?? source.progress))) {
            options.initialProgress = Math.max(0, Math.min(100, Number(fallbackProgress ?? source.progress) || 0));
        }
        openReader(book.id, chapterIndex, options);
        if (typeof afterOpen === 'function') setTimeout(afterOpen, 260);
    }
    function renderReadenBookDetailNotes(book) {
        ensureReadenBookCoReadingState(book);
        const entries = (book.annotations || [])
            .filter(annotation => ['user_annotation', 'character_annotation', 'chapter_reflection'].includes(annotation.kind))
            .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
        if (!entries.length) return '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无笔记</div>';
        return `
            <div class="readen-annotation-list">
                ${entries.map(annotation => {
                    const isUser = annotation.kind === 'user_annotation';
                    const chapterIndex = Math.max(0, Number(annotation.chapter?.indexAtCreation ?? annotation.chapter?.index) || 0);
                    const chapterTitle = annotation.chapter?.title || `第${chapterIndex + 1}章`;
                    const label = isUser ? '我的笔记' : getReadenCoReaderDisplay(book, annotation).label;
                    const content = isUser ? (annotation.note || '只做了标注') : (annotation.content || '批注内容为空');
                    const quote = annotation.anchor?.quote || (annotation.kind === 'chapter_reflection' ? '本章读完后的感想' : '原文位置已变化');
                    const anchorMissing = getReadenAnnotationAnchorStatus(book, annotation) === 'anchor_missing';
                    return `
                        <button type="button" class="readen-annotation-list-item" data-book-detail-annotation-id="${escapeReadenAttribute(annotation.id)}">
                            <span class="readen-annotation-list-kind">${escapeReadenHtml(label)}${annotation.images?.length ? ' · 有图片' : ''}</span>
                            <span class="readen-annotation-list-quote">${escapeReadenHtml(chapterTitle)} · ${escapeReadenHtml(quote)}</span>
                            <span class="readen-annotation-list-content">${escapeReadenHtml(content)}</span>
                            <span class="readen-annotation-list-meta">${anchorMissing ? '原文位置已变化 · ' : ''}${escapeReadenHtml(formatReaderAnnotationTime(annotation.createdAt))}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }
    function renderReadenBookDetailBookmarks(book) {
        const entries = Array.isArray(book?.bookmarks)
            ? [...book.bookmarks].sort((a, b) => (Number(b.updatedAt || b.createdAt) || 0) - (Number(a.updatedAt || a.createdAt) || 0))
            : [];
        if (!entries.length) return '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无书签</div>';
        return `
            <div class="readen-annotation-list">
                ${entries.map(bookmark => {
                    const position = getReadenBookmarkPosition(bookmark);
                    const chapterIndex = position.chapterIndex;
                    const progress = position.progress;
                    const chapterTitle = bookmark.chapterTitle || `第${chapterIndex + 1}章`;
                    const content = bookmark.note || '已保存阅读位置';
                    return `
                        <button type="button" class="readen-annotation-list-item" data-book-detail-bookmark-id="${escapeReadenAttribute(bookmark.id)}">
                            <span class="readen-annotation-list-kind">书签 · ${escapeReadenHtml(chapterTitle)}</span>
                            <span class="readen-annotation-list-content">${escapeReadenHtml(content)}</span>
                            <span class="readen-annotation-list-meta">${progress.toFixed(1)}% · ${escapeReadenHtml(formatReaderAnnotationTime(bookmark.updatedAt || bookmark.createdAt))}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }
    function renderReadenBookDetailHistory(book) {
        const entries = getReadenBookSessions(book)
            .slice()
            .sort((a, b) => (Number(b.endedAt) || 0) - (Number(a.endedAt) || 0));
        if (!entries.length) return '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无阅迹</div>';
        return `
            <div class="readen-annotation-list">
                ${entries.map(session => {
                    const chapterIndex = Math.max(0, Number(session.chapterIndex) || 0);
                    const chapterTitle = session.chapterTitle || `第${chapterIndex + 1}章`;
                    const progress = Math.max(0, Math.min(100, Number(session.progress) || 0));
                    return `
                        <button type="button" class="readen-annotation-list-item" data-book-detail-history-chapter-index="${chapterIndex}" data-book-detail-history-progress="${progress}">
                            <span class="readen-annotation-list-kind">${escapeReadenHtml(chapterTitle)}</span>
                            <span class="readen-annotation-list-content">阅读 ${escapeReadenHtml(formatReaderDuration(session.durationMs))} · ${Number(session.readChars) || 0} 字</span>
                            <span class="readen-annotation-list-meta">${escapeReadenHtml(formatReaderAnnotationTime(session.startedAt))} - ${escapeReadenHtml(formatReaderAnnotationTime(session.endedAt))} · ${progress.toFixed(1)}%</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }
    function switchBdTab(tabName, element) {
        const book = readenBooksData.find(b => b.id === currentBookDetailsId);
        if (!book) return;

        const emptyWrap = document.getElementById('readen-bd-empty-wrap');
        const emptyText = document.getElementById('readen-bd-empty-text');
        const chapterList = document.getElementById('readen-bd-chapter-list');
        const actionBtn = document.getElementById('readen-bd-action-btn');
        const tabMap = {
            intro: { empty: '暂无简介', btn: '编辑简介' },
            chapters: { empty: '暂无章节', btn: '' },
            notes: { empty: '暂无笔记', btn: '' },
            bookmarks: { empty: '暂无书签', btn: '' },
            history: { empty: '暂无阅迹', btn: '' }
        };

        if (!tabMap[tabName]) tabName = 'intro';
        document.querySelectorAll('.bd-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.target === tabName));
        actionBtn.textContent = tabMap[tabName].btn;
        actionBtn.style.display = tabName === 'intro' ? 'flex' : 'none';

        emptyWrap.style.textAlign = 'center';
        emptyText.style.color = 'var(--text-light)';
        emptyText.style.lineHeight = '';
        chapterList.style.display = 'none';

        if (tabName === 'intro') {
            if (book.intro && book.intro.trim() !== '') {
                emptyWrap.style.display = 'block';
                emptyWrap.style.textAlign = 'left';
                emptyText.textContent = book.intro;
                emptyText.style.color = 'var(--text-main)';
                emptyText.style.lineHeight = '1.6';
            } else {
                emptyWrap.style.display = 'flex';
                emptyText.textContent = tabMap[tabName].empty;
            }
            return;
        }

        emptyWrap.style.display = 'none';
        chapterList.style.display = 'flex';

        if (tabName === 'chapters') {
            const chapters = Array.isArray(book.chapters)
                ? (shouldSortReadenChapters(book) ? sortReadenChapters(book.chapters) : book.chapters)
                : [];
            if (!chapters.length) {
                emptyWrap.style.display = 'flex';
                chapterList.style.display = 'none';
                emptyText.textContent = tabMap[tabName].empty;
                return;
            }
            chapterList.innerHTML = chapters.map((chapter, index) => `
                <button type="button" class="chapter-item" data-readen-chapter-index="${index}">
                    ${escapeReadenHtml(chapter.title || chapter)}
                </button>
            `).join('');
            chapterList.querySelectorAll('[data-readen-chapter-index]').forEach(item => {
                item.addEventListener('click', () => {
                    const chapterIndex = Number(item.dataset.readenChapterIndex);
                    if (book.sourceMeta?.readToken || book.chapters[chapterIndex]?.content) {
                        openReader(book.id, chapterIndex);
                    }
                });
            });
            return;
        }

        if (tabName === 'notes') chapterList.innerHTML = renderReadenBookDetailNotes(book);
        if (tabName === 'bookmarks') chapterList.innerHTML = renderReadenBookDetailBookmarks(book);
        if (tabName === 'history') chapterList.innerHTML = renderReadenBookDetailHistory(book);

        chapterList.querySelectorAll('[data-book-detail-annotation-id]').forEach(item => {
            item.addEventListener('click', () => {
                const annotation = (book.annotations || []).find(entry => String(entry.id) === String(item.dataset.bookDetailAnnotationId));
                if (!annotation) return;
                openReadenBookLocation(book, getReadenAnnotationPosition(book, annotation), null, () => openReaderAnnotationDetail(annotation.id));
            });
        });
        chapterList.querySelectorAll('[data-book-detail-bookmark-id]').forEach(item => {
            item.addEventListener('click', () => {
                const bookmark = (book.bookmarks || []).find(entry => String(entry.id) === String(item.dataset.bookDetailBookmarkId));
                if (!bookmark) return;
                const position = getReadenBookmarkPosition(bookmark);
                openReadenBookLocation(book, position, position.progress);
            });
        });
        chapterList.querySelectorAll('[data-book-detail-history-chapter-index]').forEach(item => {
            item.addEventListener('click', () => {
                const chapterIndex = Math.max(0, Number(item.dataset.bookDetailHistoryChapterIndex) || 0);
                const progress = Number(item.dataset.bookDetailHistoryProgress);
                openReadenBookLocation(book, { chapterIndex }, Number.isFinite(progress) ? progress : null);
            });
        });
    }

    function readenChineseChapterNumber(value) {
        const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
        const text = String(value || '');
        if (/^\d+$/.test(text)) return Number(text);
        let section = 0;
        let number = 0;
        for (const char of text) {
            if (digits[char] != null) number = digits[char];
            else if ('十百千万'.includes(char)) {
                section += (number || 1) * ({ 十: 10, 百: 100, 千: 1000, 万: 10000 })[char];
                number = 0;
            }
        }
        return section + number;
    }

    function readenChapterNumbers(title) {
        return [...String(title || '').matchAll(/(?:第\s*)?(\d+|[零一二三四五六七八九十百千万两]+)\s*(?:章|节|回|话|卷|集|話)?/gi)]
            .map(match => readenChineseChapterNumber(match[1]))
            .filter(number => Number.isFinite(number));
    }

    // Only online sources can return chapters out of order. Local TXT / EPUB files keep the file order,
    // otherwise headings without numbers (楔子 / 番外 / 尾声) would jump to the front.
    function shouldSortReadenChapters(book) {
        return Boolean(book?.sourceMeta?.readToken);
    }

    function sortReadenChapters(chapters) {
        return [...(Array.isArray(chapters) ? chapters : [])]
            .map((chapter, index) => ({
                chapter,
                index,
                numbers: readenChapterNumbers(chapter?.title || chapter)
            }))
            .sort((left, right) => {
                if (!left.numbers.length && !right.numbers.length) return left.index - right.index;
                if (!left.numbers.length) return -1;
                if (!right.numbers.length) return 1;
                const length = Math.max(left.numbers.length, right.numbers.length);
                for (let index = 0; index < length; index += 1) {
                    const difference = (left.numbers[index] ?? -1) - (right.numbers[index] ?? -1);
                    if (difference) return difference;
                }
                return left.index - right.index;
            })
            .map(item => item.chapter);
    }

    const READEN_LARGE_CHAPTER_CHAR_LIMIT = 70000;
    const READEN_LARGE_CHAPTER_TARGET_CHARS = 52000;

    function splitReadenLargeChapter(chapter) {
        const content = String(chapter?.content || '');
        if (content.length <= READEN_LARGE_CHAPTER_CHAR_LIMIT) return [chapter];
        const title = String(chapter?.title || '正文').trim() || '正文';
        const chunks = [];
        let cursor = 0;
        while (cursor < content.length) {
            let end = Math.min(content.length, cursor + READEN_LARGE_CHAPTER_TARGET_CHARS);
            if (end < content.length) {
                const searchStart = Math.max(cursor + Math.floor(READEN_LARGE_CHAPTER_TARGET_CHARS * 0.55), cursor);
                const paragraphBreak = content.lastIndexOf('\n\n', end);
                const lineBreak = content.lastIndexOf('\n', end);
                const sentenceBreak = Math.max(
                    content.lastIndexOf('。', end),
                    content.lastIndexOf('！', end),
                    content.lastIndexOf('？', end)
                );
                const boundary = [paragraphBreak, lineBreak, sentenceBreak + 1]
                    .filter(position => position > searchStart && position > cursor)
                    .sort((left, right) => right - left)[0];
                if (boundary) end = boundary;
            }
            const chunk = content.slice(cursor, end).trim();
            if (chunk) {
                chunks.push({
                    ...chapter,
                    title: chunks.length ? `${title} ${chunks.length + 1}` : title,
                    content: chunk,
                    progress: 0
                });
            }
            cursor = Math.max(end, cursor + 1);
        }
        return chunks.length ? chunks : [chapter];
    }

    function normalizeReadenLargeChapters(chapters) {
        if (!Array.isArray(chapters)) return [];
        return chapters.flatMap(splitReadenLargeChapter);
    }

    function openReader(bookId) {
        const book = readenBooksData.find(b => b.id === bookId);
        if (!book) return;
        
        const readerContainer = document.getElementById('readen-reader-container');
        const readerContent = document.getElementById('readen-reader-content');
        
        if (book.fullText) {
            readerContent.textContent = book.fullText;
        } else if (book.sourceMeta) {
            readerContent.textContent = "这本书是在线搜索导入的，正文解析还在接入中，暂时只能先保存在书架。";
        } else {
            readerContent.textContent = "暂无正文内容，请重新导入TXT文件。";
        }
        
        document.getElementById('readen-reader-top-menu').classList.remove('show');
        document.getElementById('readen-reader-bottom-menu').classList.remove('show');
        document.getElementById('readen-reader-font-menu').classList.remove('show');
        readerContainer.classList.add('active');
        
        const bottomNav = document.getElementById('readen-bottom-nav');
        if (bottomNav) bottomNav.style.display = 'none';
        
        book.lastReadTime = Date.now();
        saveReadenAppData();
        renderBookList();

        setTimeout(updateReaderPagination, 100);
    }

    function getReadenReadApiUrl(action, token) {
        return `/api/readen/read?action=${encodeURIComponent(action)}&token=${encodeURIComponent(token)}`;
    }

    function showReadenReaderShell() {
        const readerContainer = document.getElementById('readen-reader-container');
        closeReaderChromeMenus();
        readerContainer.classList.add('active');
        const bottomNav = document.getElementById('readen-bottom-nav');
        if (bottomNav) bottomNav.style.display = 'none';
    }

    function normalizeReaderText(text) {
        return String(text || '')
            .replace(/\r\n?/g, '\n')
            .replace(/\u00a0/g, ' ')
            .replace(/\t/g, '    ');
    }

    function getReaderParagraphs(text) {
        const normalized = normalizeReaderText(text);
        const lines = normalized.split('\n');
        const paragraphs = [];
        let buffer = [];
        lines.forEach(line => {
            const value = line.trim();
            if (!value) {
                if (buffer.length) {
                    paragraphs.push(buffer.join('\n'));
                    buffer = [];
                }
                return;
            }
            buffer.push(line.trimEnd());
        });
        if (buffer.length) paragraphs.push(buffer.join('\n'));
        return paragraphs.length ? paragraphs : [normalized || '暂时没有解析到正文内容。'];
    }

    function hashReaderText(text) {
        const value = normalizeReaderText(text).replace(/\s+/g, ' ').trim();
        let hash = 2166136261;
        for (let index = 0; index < value.length; index++) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16);
    }

    function normalizeReaderSlug(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
            .slice(0, 80);
    }

    function getReaderChapterKey(book, chapter, chapterIndex, chapterText) {
        const source = book?.sourceMeta || {};
        const token = chapter?.token || source.readToken || '';
        if (token) {
            return `online:${source.resultKey || source.readToken || book?.id || 'book'}:${token}`;
        }
        const title = normalizeReaderSlug(chapter?.title || `chapter-${chapterIndex + 1}`);
        return `local:${book?.id || 'book'}:${title}:${hashReaderText(chapterText)}`;
    }

    function ensureReadenReaderPosition(book) {
        if (!book || typeof book !== 'object') return null;
        const current = book.readerPosition && typeof book.readerPosition === 'object'
            ? book.readerPosition
            : {};
        const chapterIndex = Number(current.chapterIndex);
        const paragraphIndex = Number(current.paragraphIndex);
        const charOffset = Number(current.charOffset);
        const progress = Number(current.progress);
        const updatedAt = Number(current.updatedAt);
        book.readerPosition = {
            chapterKey: String(current.chapterKey || ''),
            chapterIndex: Number.isFinite(chapterIndex) ? Math.max(0, Math.floor(chapterIndex)) : Math.max(0, Number(book.currentChapterIndex) || 0),
            paragraphIndex: Number.isFinite(paragraphIndex) ? Math.max(0, Math.floor(paragraphIndex)) : 0,
            charOffset: Number.isFinite(charOffset) ? Math.max(0, Math.floor(charOffset)) : 0,
            quote: String(current.quote || '').trim().slice(0, 120),
            progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0,
            updatedAt: Number.isFinite(updatedAt) ? Math.max(0, Math.floor(updatedAt)) : 0
        };
        return book.readerPosition;
    }

    function getReadenReaderPositionSnapshot(book) {
        const raw = book?.readerPosition;
        if (!raw || typeof raw !== 'object' || !(Number(raw.updatedAt) > 0)) return null;
        return { ...ensureReadenReaderPosition(book) };
    }

    function getReadenReaderChapterText(book, chapterIndex = currentReaderChapterIndex) {
        const chapters = getReaderChapters(book);
        const chapter = chapters[chapterIndex];
        return String(chapter?.content || book?.fullText || '');
    }

    function getReadenReaderChapterKey(book, chapterIndex = currentReaderChapterIndex) {
        const chapters = getReaderChapters(book);
        const chapter = chapters[chapterIndex] || null;
        return getReaderChapterKey(book, chapter, chapterIndex, getReadenReaderChapterText(book, chapterIndex));
    }

    function resolveReadenReaderChapterIndex(book, requestedChapterIndex = null) {
        const chapters = getReaderChapters(book);
        const maxIndex = Math.max(0, chapters.length - 1);
        if (requestedChapterIndex !== null && requestedChapterIndex !== undefined && Number.isFinite(Number(requestedChapterIndex))) {
            return Math.max(0, Math.min(maxIndex, Math.floor(Number(requestedChapterIndex))));
        }
        const position = ensureReadenReaderPosition(book);
        if (position?.chapterKey && chapters.length) {
            const matchingIndex = chapters.findIndex((chapter, index) => {
                const text = String(chapter?.content || book?.fullText || '');
                return getReaderChapterKey(book, chapter, index, text) === position.chapterKey;
            });
            if (matchingIndex >= 0) return matchingIndex;
        }
        if (position && Number.isFinite(Number(position.chapterIndex))) {
            return Math.max(0, Math.min(maxIndex, Math.floor(Number(position.chapterIndex))));
        }
        return Math.max(0, Math.min(maxIndex, Number(book?.currentChapterIndex) || 0));
    }

    // Current horizontal shift of the paged content, read from the rendered transform.
    function getReadenContentTranslateX(content) {
        const transform = content ? getComputedStyle(content).transform : '';
        if (!transform || transform === 'none') return 0;
        const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
        if (matrix3d) return Number(matrix3d[1].split(',')[12]) || 0;
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) return Number(matrix[1].split(',')[4]) || 0;
        return 0;
    }

    // Returns a function that maps a client rect to its page index in paged mode,
    // independent of whether the page-turn transform has finished animating.
    function createReadenPagedPageLocator(wrapper, content) {
        const pageWidth = Math.max(1, wrapper.clientWidth);
        const originLeft = wrapper.getBoundingClientRect().left + getReadenContentTranslateX(content);
        return rect => Math.floor((rect.left - originLeft + 1) / pageWidth);
    }

    function getReadenParagraphCharRect(paragraph, charIndex) {
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        let remaining = Math.max(0, Number(charIndex) || 0);
        let node = walker.nextNode();
        while (node) {
            const length = node.nodeValue.length;
            if (remaining < length) {
                const range = document.createRange();
                range.setStart(node, remaining);
                range.setEnd(node, remaining + 1);
                for (const rect of range.getClientRects()) {
                    if (rect.width > 0 || rect.height > 0) return rect;
                }
                return null;
            }
            remaining -= length;
            node = walker.nextNode();
        }
        return null;
    }

    // Page of a character; line breaks have no box, so look at the next few characters.
    function getReadenParagraphCharPage(paragraph, charIndex, pageOf) {
        const textLength = String(paragraph.textContent || '').length;
        for (let index = charIndex; index < Math.min(textLength, charIndex + 12); index += 1) {
            const rect = getReadenParagraphCharRect(paragraph, index);
            if (rect) return pageOf(rect);
        }
        return null;
    }

    // In paged mode one paragraph can span many pages (TXT files without blank lines become
    // one paragraph per chapter), so the anchor also records the first character on the page.
    function getReadenPagedVisibleAnchor(wrapper, content, paragraphs) {
        const pageOf = createReadenPagedPageLocator(wrapper, content);
        const targetPage = Math.max(0, Number(readerCurrentPage) || 0);
        for (const element of paragraphs) {
            const rects = Array.from(element.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
            if (!rects.length) continue;
            let firstPage = Infinity;
            let lastPage = -Infinity;
            rects.forEach(rect => {
                const page = pageOf(rect);
                if (page < firstPage) firstPage = page;
                if (page > lastPage) lastPage = page;
            });
            if (lastPage < targetPage) continue;
            const text = String(element.textContent || '');
            let charOffset = 0;
            if (firstPage < targetPage && text.length > 1) {
                let low = 0;
                let high = text.length - 1;
                while (low < high) {
                    const middle = (low + high) >> 1;
                    const page = getReadenParagraphCharPage(element, middle, pageOf);
                    if (page === null || page < targetPage) low = middle + 1;
                    else high = middle;
                }
                charOffset = low;
            }
            return {
                element,
                paragraphIndex: Math.max(0, Number(element.dataset.paragraphIndex) || 0),
                charOffset,
                quote: text.slice(charOffset, charOffset + 96).trim() || text.slice(0, 96).trim()
            };
        }
        return null;
    }

    function getReadenVisibleReaderParagraph() {
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        const content = document.getElementById('readen-reader-content');
        if (!wrapper || !content) return null;
        const paragraphs = Array.from(content.querySelectorAll('.readen-reader-paragraph'));
        if (!paragraphs.length) return null;
        const wrapperRect = wrapper.getBoundingClientRect();
        const isScrollMode = readerAnimMode === 'scroll';
        if (!isScrollMode) {
            const pagedAnchor = getReadenPagedVisibleAnchor(wrapper, content, paragraphs);
            if (pagedAnchor) return pagedAnchor;
        }
        const targetEdge = isScrollMode
            ? wrapperRect.top + Math.min(48, Math.max(16, wrapper.clientHeight * 0.12))
            : wrapperRect.left + Math.min(48, Math.max(16, wrapper.clientWidth * 0.12));
        let selected = null;
        let selectedDistance = Infinity;
        const pointX = isScrollMode ? wrapperRect.left + Math.min(32, Math.max(12, wrapper.clientWidth * 0.12)) : targetEdge;
        const pointY = isScrollMode ? targetEdge : wrapperRect.top + Math.min(48, Math.max(16, wrapper.clientHeight * 0.12));
        const pointedElement = document.elementFromPoint(pointX, pointY)?.closest('.readen-reader-paragraph');
        if (pointedElement && content.contains(pointedElement)) {
            selected = { element: pointedElement, rect: pointedElement.getBoundingClientRect() };
        } else {
            paragraphs.forEach(element => {
                const rect = element.getBoundingClientRect();
                const visible = isScrollMode
                    ? rect.bottom >= wrapperRect.top + 4 && rect.top <= wrapperRect.bottom - 4
                    : rect.right >= wrapperRect.left + 4 && rect.left <= wrapperRect.right - 4 && rect.bottom >= wrapperRect.top + 4 && rect.top <= wrapperRect.bottom - 4;
                if (!visible) return;
                const distance = Math.abs((isScrollMode ? rect.top : rect.left) - targetEdge);
                if (distance < selectedDistance) {
                    selected = { element, rect };
                    selectedDistance = distance;
                }
            });
        }
        if (!selected) return null;
        const element = selected.element;
        const rect = selected.rect;
        const paragraphText = String(element.textContent || '');
        let charOffset = 0;
        if (isScrollMode && paragraphText) {
            const ratio = Math.max(0, Math.min(1, (targetEdge - rect.top) / Math.max(1, rect.height)));
            charOffset = Math.min(paragraphText.length, Math.max(0, Math.round(paragraphText.length * ratio)));
        }
        const paragraphIndex = Math.max(0, Number(element.dataset.paragraphIndex) || 0);
        const quote = paragraphText.slice(charOffset, charOffset + 96).trim() || paragraphText.slice(0, 96).trim();
        return { element, paragraphIndex, charOffset, quote };
    }

    function updateReadenReaderPosition(book, progress) {
        const position = ensureReadenReaderPosition(book);
        if (!position) return;
        const chapterIndex = Math.max(0, Number(currentReaderChapterIndex) || 0);
        if (position.chapterIndex !== chapterIndex || !position.chapterKey) {
            position.chapterIndex = chapterIndex;
            position.chapterKey = getReadenReaderChapterKey(book, chapterIndex);
        }
        const anchor = getReadenVisibleReaderParagraph();
        if (anchor) {
            position.paragraphIndex = anchor.paragraphIndex;
            position.charOffset = anchor.charOffset;
            position.quote = anchor.quote;
        }
        position.progress = Math.max(0, Math.min(100, Number(progress) || 0));
        position.updatedAt = Date.now();
    }

    function applyReadenReaderPosition(position) {
        if (!position) return false;
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        const content = document.getElementById('readen-reader-content');
        if (!wrapper || !content) return false;
        const paragraphs = Array.from(content.querySelectorAll('.readen-reader-paragraph'));
        if (!paragraphs.length) return false;
        let target = paragraphs.find(element => Number(element.dataset.paragraphIndex) === Number(position.paragraphIndex));
        let charOffset = Math.max(0, Number(position.charOffset) || 0);
        const quote = String(position.quote || '').trim();
        if (target && quote && !String(target.textContent || '').includes(quote)) target = null;
        if (!target && quote) {
            target = paragraphs.find(element => String(element.textContent || '').includes(quote));
            if (target) charOffset = Math.max(0, String(target.textContent || '').indexOf(quote));
        }
        if (!target) return false;
        if (readerAnimMode === 'scroll') {
            const wrapperRect = wrapper.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const textLength = Math.max(1, String(target.textContent || '').length);
            const textRatio = Math.max(0, Math.min(1, charOffset / textLength));
            const top = wrapper.scrollTop + targetRect.top - wrapperRect.top + targetRect.height * textRatio - wrapper.clientHeight * 0.12;
            const maxTop = Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
            wrapper.scrollTop = Math.max(0, Math.min(maxTop, top));
        } else {
            // Jump to the page that holds the saved character, not just the start of its paragraph.
            const pageOf = createReadenPagedPageLocator(wrapper, content);
            const textLength = String(target.textContent || '').length;
            let page = charOffset > 0 && charOffset < textLength
                ? getReadenParagraphCharPage(target, charOffset, pageOf)
                : null;
            if (page === null) {
                const firstRect = Array.from(target.getClientRects()).find(rect => rect.width > 0 || rect.height > 0)
                    || target.getBoundingClientRect();
                page = pageOf(firstRect);
            }
            readerCurrentPage = Math.max(0, Math.min(Math.max(0, readerTotalPages - 1), page));
            updateReaderPagination();
        }
        updateReaderProgressUI(getReaderProgressPercent());
        return true;
    }

    function ensureReadenBookCoReadingState(book) {
        if (!book || typeof book !== 'object') return null;
        if (!book.coReading || typeof book.coReading !== 'object') {
            book.coReading = {
                enabled: false,
                contactId: '',
                linkedContactId: '',
                mode: 'follow_user',
                knowledge: null,
                chapterReflectionPrompted: [],
                createdAt: 0,
                updatedAt: 0
            };
        } else {
            book.coReading.enabled = Boolean(book.coReading.enabled);
            book.coReading.contactId = String(book.coReading.contactId || '');
            book.coReading.linkedContactId = String(book.coReading.linkedContactId || '');
            book.coReading.name = String(book.coReading.name || '');
            book.coReading.avatar = String(book.coReading.avatar || '');
            book.coReading.mode = book.coReading.mode || 'follow_user';
            if (!Array.isArray(book.coReading.chapterReflectionPrompted)) {
                book.coReading.chapterReflectionPrompted = [];
            }
        }
        if (!Array.isArray(book.annotations)) book.annotations = [];
        book.annotations = book.annotations
            .filter(annotation => annotation && typeof annotation === 'object')
            .map(annotation => ({
                id: annotation.id || `annotation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                version: annotation.version || READEN_COREADING_SCHEMA_VERSION,
                bookId: annotation.bookId || book.id,
                kind: annotation.kind || 'character_annotation',
                authorType: annotation.authorType || 'character',
                contactId: String(annotation.contactId || ''),
                linkedContactId: String(annotation.linkedContactId || ''),
                // WeChat account the co-reading note was written under (used by the cross-app bridge).
                ...(typeof annotation.accountId === 'string' ? { accountId: annotation.accountId } : {}),
                characterName: String(annotation.characterName || annotation.authorName || ''),
                characterAvatar: String(annotation.characterAvatar || ''),
                chapter: annotation.chapter && typeof annotation.chapter === 'object' ? annotation.chapter : {},
                anchor: annotation.anchor && typeof annotation.anchor === 'object' ? annotation.anchor : {},
                content: String(annotation.content || ''),
                note: String(annotation.note || ''),
                style: annotation.style || 'highlight',
                color: annotation.color || '#facc15',
                images: Array.isArray(annotation.images) ? annotation.images.filter(Boolean).slice(0, 1) : [],
                tone: annotation.tone || 'thoughtful',
                status: annotation.status || 'ready',
                modelMeta: annotation.modelMeta && typeof annotation.modelMeta === 'object' ? annotation.modelMeta : {},
                createdAt: Number(annotation.createdAt) || Date.now(),
                updatedAt: Number(annotation.updatedAt) || Number(annotation.createdAt) || Date.now()
            }));
        return book;
    }

    function getReaderChapterPayloadMeta(book, text) {
        const chapters = getReaderChapters(book);
        const chapter = chapters[currentReaderChapterIndex] || null;
        const chapterText = String(text || chapter?.content || book?.fullText || '');
        return {
            chapter,
            key: getReaderChapterKey(book, chapter, currentReaderChapterIndex, chapterText),
            token: chapter?.token || '',
            title: chapter?.title || `第${currentReaderChapterIndex + 1}章`,
            textHash: hashReaderText(chapterText)
        };
    }

    function getReaderReadyAnnotationsForChapter(book, chapterMeta) {
        ensureReadenBookCoReadingState(book);
        return (book?.annotations || []).filter(annotation => {
            if (annotation.status !== 'ready' || !['character_annotation', 'user_annotation'].includes(annotation.kind)) return false;
            const chapter = annotation.chapter || {};
            if (chapter.key && chapter.key === chapterMeta.key) return true;
            return chapter.token && chapter.token === chapterMeta.token;
        });
    }

    function resolveReaderAnnotationAnchor(annotation, paragraphs) {
        const anchor = annotation.anchor || {};
        const quote = String(anchor.quote || '');
        if (!quote) return null;
        const preferredIndex = Number(anchor.paragraphIndex);
        const startOffset = Number(anchor.startOffset);
        const endOffset = Number(anchor.endOffset);
        if (Number.isInteger(preferredIndex) && paragraphs[preferredIndex]) {
            const paragraph = paragraphs[preferredIndex];
            if (Number.isInteger(startOffset) && Number.isInteger(endOffset) && paragraph.slice(startOffset, endOffset) === quote) {
                return { paragraphIndex: preferredIndex, startOffset, endOffset, annotation };
            }
            const localIndex = paragraph.indexOf(quote);
            if (localIndex >= 0 && paragraph.indexOf(quote, localIndex + quote.length) < 0) {
                return { paragraphIndex: preferredIndex, startOffset: localIndex, endOffset: localIndex + quote.length, annotation };
            }
        }
        const needle = `${anchor.prefix || ''}${quote}${anchor.suffix || ''}`;
        if (needle.length > quote.length) {
            for (let index = 0; index < paragraphs.length; index++) {
                const position = paragraphs[index].indexOf(needle);
                if (position >= 0) {
                    const start = position + String(anchor.prefix || '').length;
                    return { paragraphIndex: index, startOffset: start, endOffset: start + quote.length, annotation };
                }
            }
        }
        const matches = [];
        paragraphs.forEach((paragraph, paragraphIndex) => {
            let position = paragraph.indexOf(quote);
            while (position >= 0) {
                matches.push({ paragraphIndex, startOffset: position, endOffset: position + quote.length, annotation });
                position = paragraph.indexOf(quote, position + quote.length);
            }
        });
        return matches.length === 1 ? matches[0] : null;
    }

    function readReadenLayoutRecord(recordId) {
        return new Promise(resolve => {
            const request = indexedDB.open('iOSDesktopDB');
            request.onerror = () => resolve(null);
            request.onsuccess = event => {
                const connection = event.target.result;
                if (!connection.objectStoreNames.contains('layoutStore')) {
                    connection.close();
                    resolve(null);
                    return;
                }
                const transaction = connection.transaction(['layoutStore'], 'readonly');
                const store = transaction.objectStore('layoutStore');
                const recordRequest = store.get(recordId);
                recordRequest.onsuccess = () => {
                    connection.close();
                    resolve(recordRequest.result || null);
                };
                recordRequest.onerror = () => {
                    connection.close();
                    resolve(null);
                };
            };
        });
    }

    function getReadenWechatAccountId() {
        try {
            if (typeof wcGetCurrentAccountId === 'function') return String(wcGetCurrentAccountId() || 'default');
        } catch (_) {}
        return (typeof appSettings !== 'undefined' && appSettings?.wc_current_user_id) ? String(appSettings.wc_current_user_id) : 'default';
    }

    async function getReadenCoReadingCandidates() {
        // WeChat contacts are stored per account; the old global record is only a fallback.
        const accountId = getReadenWechatAccountId();
        const [accountWechatRecord, contactsRecord] = await Promise.all([
            readReadenLayoutRecord(`wechatContactsData_${accountId}`),
            readReadenLayoutRecord('contactsAppData')
        ]);
        const wechatRecord = accountWechatRecord || await readReadenLayoutRecord('wechatContactsData');
        const wechatContacts = Array.isArray(wechatRecord?.contacts) ? wechatRecord.contacts : [];
        const sourceContacts = Array.isArray(contactsRecord?.data?.contacts) ? contactsRecord.data.contacts : [];
        const sourceById = new Map(sourceContacts.map(contact => [String(contact.id), contact]));
        const candidates = wechatContacts
            .filter(contact => contact && (contact.linkedContactId || String(contact.id || '').startsWith('char_')))
            .map(contact => {
                const source = sourceById.get(String(contact.linkedContactId || '').trim());
                const desc = contact.desc || source?.persona || source?.appearance || '微信角色联系人';
                return {
                    contactId: String(contact.id || ''),
                    linkedContactId: String(contact.linkedContactId || ''),
                    name: contact.remark || contact.name || source?.name || '未命名角色',
                    avatar: contact.avatar || source?.avatar || '',
                    desc: String(desc || '').replace(/\s+/g, ' ').slice(0, 80)
                };
            });
        // Only characters that exist in WeChat can co-read: the reading prompts are built from the WeChat contact.
        return candidates.filter(candidate => candidate.contactId);
    }

    function getReadenBoundCoReader(book) {
        ensureReadenBookCoReadingState(book);
        return book?.coReading?.enabled && book.coReading.contactId ? book.coReading : null;
    }

    function clearReadenNativeSelection() {
        const activeTag = document.activeElement?.tagName;
        if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;
        window.getSelection?.()?.removeAllRanges();
    }

    function getReadenCaretRangeFromPoint(clientX, clientY) {
        if (document.caretRangeFromPoint) return document.caretRangeFromPoint(clientX, clientY);
        const position = document.caretPositionFromPoint?.(clientX, clientY);
        if (!position) return null;
        const range = document.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
        return range;
    }

    function getReadenParagraphTextOffset(paragraph, node, offset) {
        if (!paragraph || !node || !paragraph.contains(node)) return null;
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        try {
            range.setEnd(node, offset);
        } catch (error) {
            return null;
        }
        return range.toString().length;
    }

    function getReadenTextPositionFromPoint(clientX, clientY) {
        const range = getReadenCaretRangeFromPoint(clientX, clientY);
        const element = range?.startContainer?.nodeType === Node.TEXT_NODE
            ? range.startContainer.parentElement
            : document.elementFromPoint(clientX, clientY);
        const paragraph = element?.closest?.('.readen-reader-paragraph');
        if (!paragraph) return null;
        const paragraphText = paragraph.textContent || '';
        const measuredOffset = range ? getReadenParagraphTextOffset(paragraph, range.startContainer, range.startOffset) : null;
        const offset = Math.max(0, Math.min(paragraphText.length, Number.isFinite(measuredOffset) ? measuredOffset : 0));
        return {
            paragraph,
            paragraphIndex: Number(paragraph.dataset.paragraphIndex) || 0,
            offset
        };
    }

    function normalizeReadenCustomSelectionRange(text, startOffset, endOffset) {
        const length = String(text || '').length;
        if (!length) return null;
        let start = Math.max(0, Math.min(length, Number(startOffset) || 0));
        let end = Math.max(0, Math.min(length, Number(endOffset) || 0));
        if (start > end) [start, end] = [end, start];
        if (start === end) {
            if (start >= length) start = Math.max(0, length - 1);
            end = Math.min(length, start + 1);
        }
        while (end - start < 2 && (start > 0 || end < length)) {
            if (end < length) end += 1;
            else start -= 1;
        }
        return start < end ? { startOffset: start, endOffset: end } : null;
    }

    let readenWordSegmenter;

    function getReadenWordSegmenter() {
        if (readenWordSegmenter !== undefined) return readenWordSegmenter;
        try {
            readenWordSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
                ? new Intl.Segmenter('zh-CN', { granularity: 'word' })
                : null;
        } catch (_) {
            readenWordSegmenter = null;
        }
        return readenWordSegmenter;
    }

    // The word (词组) under the finger: Intl.Segmenter splits Chinese into words; a one-character
    // Chinese word is joined with its neighbour so a long press selects a meaningful phrase.
    function getReadenInitialSelectionRange(position) {
        const text = position?.paragraph?.textContent || '';
        if (!text) return null;
        const isWordChar = char => /[\p{L}\p{N}_]/u.test(char || '');
        let index = Math.max(0, Math.min(text.length - 1, position.offset));
        if (!isWordChar(text[index])) {
            if (isWordChar(text[index - 1])) index -= 1;
            else if (isWordChar(text[index + 1])) index += 1;
        }
        let start = index;
        let end = index + 1;
        const segmenter = getReadenWordSegmenter();
        if (segmenter && isWordChar(text[index])) {
            // Segment only the sentence around the finger; whole chapters can be one paragraph.
            const windowStart = Math.max(0, index - 40);
            const windowEnd = Math.min(text.length, index + 40);
            const segments = Array.from(segmenter.segment(text.slice(windowStart, windowEnd)))
                .map(item => ({ start: windowStart + item.index, end: windowStart + item.index + item.segment.length, isWordLike: item.isWordLike }));
            const current = segments.findIndex(item => index >= item.start && index < item.end);
            if (current >= 0) {
                start = segments[current].start;
                end = segments[current].end;
                const isCjk = /[\u3400-\u9fff\uf900-\ufaff]/.test(text[index]);
                if (isCjk && end - start === 1) {
                    const next = segments[current + 1];
                    const previous = segments[current - 1];
                    if (next?.isWordLike && next.end - next.start <= 3) end = next.end;
                    else if (previous?.isWordLike && previous.end - previous.start <= 3) start = previous.start;
                }
            }
        } else if (/[A-Za-z0-9_]/.test(text[index])) {
            while (start > 0 && /[A-Za-z0-9_]/.test(text[start - 1])) start -= 1;
            while (end < text.length && /[A-Za-z0-9_]/.test(text[end])) end += 1;
        }
        return normalizeReadenCustomSelectionRange(text, start, end);
    }

    function createReadenParagraphRange(paragraph, startOffset, endOffset) {
        const range = document.createRange();
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        let consumed = 0;
        let didStart = false;
        let lastTextNode = null;
        while (node) {
            const length = node.nodeValue.length;
            const next = consumed + length;
            lastTextNode = node;
            if (!didStart && startOffset <= next) {
                range.setStart(node, Math.max(0, startOffset - consumed));
                didStart = true;
            }
            if (didStart && endOffset <= next) {
                range.setEnd(node, Math.max(0, endOffset - consumed));
                return range;
            }
            consumed = next;
            node = walker.nextNode();
        }
        if (lastTextNode) {
            if (!didStart) range.setStart(lastTextNode, lastTextNode.nodeValue.length);
            range.setEnd(lastTextNode, lastTextNode.nodeValue.length);
            return range;
        }
        return null;
    }

    function buildReadenSelectionInfoFromCustomSelection() {
        if (!readenCustomSelection) return null;
        const paragraph = document.querySelector(`.readen-reader-paragraph[data-paragraph-index="${readenCustomSelection.paragraphIndex}"]`);
        if (!paragraph) return null;
        const text = paragraph.textContent || '';
        const rangeInfo = normalizeReadenCustomSelectionRange(text, readenCustomSelection.startOffset, readenCustomSelection.endOffset);
        if (!rangeInfo) return null;
        const quote = text.slice(rangeInfo.startOffset, rangeInfo.endOffset).replace(/\s+/g, ' ').trim();
        if (quote.length < 2) return { error: '请至少选择 2 个字。' };
        if (quote.length > 600) return { error: '这段太长了，请缩小到 600 字以内。' };
        const range = createReadenParagraphRange(paragraph, rangeInfo.startOffset, rangeInfo.endOffset);
        const rects = range ? Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0) : [];
        const rect = rects.length ? range.getBoundingClientRect() : paragraph.getBoundingClientRect();
        const startRect = rects[0] || rect;
        const endRect = rects[rects.length - 1] || rect;
        return {
            paragraphIndex: readenCustomSelection.paragraphIndex,
            startOffset: rangeInfo.startOffset,
            endOffset: rangeInfo.endOffset,
            quote,
            prefix: text.slice(Math.max(0, rangeInfo.startOffset - READEN_ANNOTATION_CONTEXT_LIMIT), rangeInfo.startOffset),
            suffix: text.slice(rangeInfo.endOffset, rangeInfo.endOffset + READEN_ANNOTATION_CONTEXT_LIMIT),
            rect,
            startRect,
            endRect
        };
    }

    // The selection highlight is drawn as an overlay above the text. Rewriting the paragraph's text
    // on every change re-laid out (and re-rasterised) whole chapters, which made the highlight and
    // the handles flash on phones.
    function getReadenSelectionHighlightLayer() {
        const readerContainer = document.getElementById('readen-reader-container');
        if (!readerContainer) return null;
        let layer = document.getElementById('readen-selection-highlight-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.id = 'readen-selection-highlight-layer';
            layer.className = 'readen-selection-highlight-layer';
            layer.setAttribute('aria-hidden', 'true');
            readerContainer.appendChild(layer);
        }
        return layer;
    }

    function clearReadenSelectionHighlight() {
        const layer = document.getElementById('readen-selection-highlight-layer');
        if (!layer) return;
        layer.replaceChildren();
        delete layer.dataset.selectionText;
    }

    function drawReadenSelectionHighlight(paragraph, startOffset, endOffset) {
        const layer = getReadenSelectionHighlightLayer();
        if (!layer || !paragraph) return;
        const containerRect = layer.parentElement.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(paragraph).fontSize) || 16;
        // Same look as before: a band over the lower 0.72em of each line.
        const band = fontSize * 0.72;
        const fragment = document.createDocumentFragment();
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        let consumed = 0;
        while (node) {
            const length = node.nodeValue.length;
            const from = Math.max(startOffset, consumed);
            const to = Math.min(endOffset, consumed + length);
            if (from < to) {
                // Text-node ranges only, so nested marks are not painted twice.
                const range = document.createRange();
                range.setStart(node, from - consumed);
                range.setEnd(node, to - consumed);
                for (const rect of range.getClientRects()) {
                    if (rect.width < 1 || rect.height < 1) continue;
                    const height = Math.min(rect.height, band);
                    const item = document.createElement('div');
                    item.className = 'readen-selection-highlight-rect';
                    item.style.left = `${rect.left - containerRect.left}px`;
                    item.style.top = `${rect.bottom - containerRect.top - height}px`;
                    item.style.width = `${rect.width}px`;
                    item.style.height = `${height}px`;
                    fragment.appendChild(item);
                }
            }
            consumed += length;
            if (consumed >= endOffset) break;
            node = walker.nextNode();
        }
        layer.replaceChildren(fragment);
        layer.dataset.selectionText = String(paragraph.textContent || '').slice(startOffset, endOffset);
    }

    function renderReadenCustomSelectionVisual() {
        if (!readenCustomSelection) return;
        const paragraph = document.querySelector(`.readen-reader-paragraph[data-paragraph-index="${readenCustomSelection.paragraphIndex}"]`);
        if (!paragraph) return;
        drawReadenSelectionHighlight(paragraph, readenCustomSelection.startOffset, readenCustomSelection.endOffset);
        const info = buildReadenSelectionInfoFromCustomSelection();
        if (info && !info.error) showReadenSelectionToolbar(info);
        clearReadenNativeSelection();
    }

    // The text itself is never changed by a selection, so clearing only removes the overlay;
    // shouldRender is kept for existing callers.
    function clearReadenCustomSelection(shouldRender = false) {
        readenCustomSelection = null;
        clearReadenSelectionHighlight();
        hideReadenSelectionToolbar();
        clearReadenNativeSelection();
    }

    function setReadenCustomSelection(position, startOffset, endOffset) {
        const text = position?.paragraph?.textContent || '';
        const rangeInfo = normalizeReadenCustomSelectionRange(text, startOffset, endOffset);
        if (!rangeInfo) return false;
        readenCustomSelection = {
            paragraphIndex: position.paragraphIndex,
            startOffset: rangeInfo.startOffset,
            endOffset: rangeInfo.endOffset
        };
        renderReadenCustomSelectionVisual();
        return true;
    }

    function shouldSkipReadenCustomSelectionTarget(target) {
        return Boolean(target?.closest?.('.reader-menu, .reader-tool-panel, .reader-font-menu, .readen-reader-chapter-drawer, .readen-selection-toolbar, .readen-selection-handles, .readen-user-annotation-panel, .readen-annotation-mark'));
    }

    function beginReadenCustomSelectionGesture(event) {
        const touch = event.changedTouches?.[0];
        if (!touch || shouldSkipReadenCustomSelectionTarget(event.target)) return;
        clearReadenCustomSelection(true);
        const position = getReadenTextPositionFromPoint(touch.clientX, touch.clientY);
        if (!position) return;
        readenSelectionGesture = {
            startX: touch.clientX,
            startY: touch.clientY,
            active: false,
            armed: false,
            moved: false,
            origin: position,
            // A long press without moving selects the word under the finger right away;
            // dragging afterwards extends the selection from that word.
            timer: setTimeout(() => {
                const gesture = readenSelectionGesture;
                if (!gesture) return;
                gesture.armed = true;
                readerLastTouchTapAt = Date.now();
                const range = getReadenInitialSelectionRange(gesture.origin);
                if (!range) return;
                gesture.active = true;
                gesture.wordStart = range.startOffset;
                gesture.wordEnd = range.endOffset;
                setReadenCustomSelection(gesture.origin, range.startOffset, range.endOffset);
            }, READEN_LONG_PRESS_MS)
        };
    }

    function updateReadenCustomSelectionGesture(event) {
        if (!readenSelectionGesture) return false;
        const touch = event.changedTouches?.[0];
        if (!touch) return false;
        const deltaX = touch.clientX - readenSelectionGesture.startX;
        const deltaY = touch.clientY - readenSelectionGesture.startY;
        const distance = Math.hypot(deltaX, deltaY);
        if (!readenSelectionGesture.active && !readenSelectionGesture.armed && distance > 10) {
            clearTimeout(readenSelectionGesture.timer);
            readenSelectionGesture = null;
            return false;
        }
        if (!readenSelectionGesture.active && readenSelectionGesture.armed) {
            if (distance < 14) return false;
            const initialRange = getReadenInitialSelectionRange(readenSelectionGesture.origin);
            if (!initialRange) {
                cancelReadenCustomSelectionGesture();
                return false;
            }
            readenSelectionGesture.active = true;
            setReadenCustomSelection(readenSelectionGesture.origin, initialRange.startOffset, initialRange.endOffset);
        }
        if (!readenSelectionGesture.active) return false;
        // Small finger jitter after the long press keeps the selected word.
        if (!readenSelectionGesture.moved && distance < 14) return true;
        readenSelectionGesture.moved = true;
        const position = getReadenTextPositionFromPoint(touch.clientX, touch.clientY);
        if (!position || position.paragraphIndex !== readenSelectionGesture.origin.paragraphIndex) return true;
        const anchorStart = Number.isFinite(readenSelectionGesture.wordStart) ? readenSelectionGesture.wordStart : readenSelectionGesture.origin.offset;
        const anchorEnd = Number.isFinite(readenSelectionGesture.wordEnd) ? readenSelectionGesture.wordEnd : readenSelectionGesture.origin.offset;
        if (position.offset >= anchorStart) setReadenCustomSelection(position, anchorStart, Math.max(anchorEnd, position.offset));
        else setReadenCustomSelection(position, position.offset, anchorEnd);
        return true;
    }

    function finishReadenCustomSelectionGesture(event) {
        if (!readenSelectionGesture) return false;
        clearTimeout(readenSelectionGesture.timer);
        const wasActive = readenSelectionGesture.active;
        readenSelectionGesture = null;
        if (!wasActive) return false;
        event.preventDefault();
        event.stopPropagation();
        readerLastTouchTapAt = Date.now();
        const info = buildReadenSelectionInfoFromCustomSelection();
        if (info && !info.error) showReadenSelectionToolbar(info);
        return true;
    }

    function cancelReadenCustomSelectionGesture() {
        if (!readenSelectionGesture) return;
        clearTimeout(readenSelectionGesture.timer);
        readenSelectionGesture = null;
    }

    function bindReadenSelectionHandleDrag() {
        document.querySelectorAll('.readen-selection-handle').forEach(handle => {
            handle.addEventListener('touchstart', event => {
                if (!readenCustomSelection) return;
                const touch = event.changedTouches?.[0];
                if (!touch) return;
                cancelReadenCustomSelectionGesture();
                readenSelectionHandleDrag = {
                    edge: handle.classList.contains('start') ? 'start' : 'end',
                    paragraphIndex: readenCustomSelection.paragraphIndex
                };
                event.preventDefault();
                event.stopPropagation();
            }, { passive: false });
            handle.addEventListener('touchmove', event => {
                if (!updateReadenSelectionHandleDrag(event)) return;
                event.preventDefault();
                event.stopPropagation();
            }, { passive: false });
            handle.addEventListener('touchend', finishReadenSelectionHandleDrag, { passive: false });
            handle.addEventListener('touchcancel', finishReadenSelectionHandleDrag, { passive: false });
        });
    }

    function updateReadenSelectionHandleDrag(event) {
        if (!readenSelectionHandleDrag || !readenCustomSelection) return false;
        const touch = event.changedTouches?.[0];
        if (!touch) return false;
        const position = getReadenTextPositionFromPoint(touch.clientX, touch.clientY);
        if (!position || position.paragraphIndex !== readenSelectionHandleDrag.paragraphIndex) return true;
        const text = position.paragraph?.textContent || '';
        const startOffset = readenSelectionHandleDrag.edge === 'start' ? position.offset : readenCustomSelection.startOffset;
        const endOffset = readenSelectionHandleDrag.edge === 'end' ? position.offset : readenCustomSelection.endOffset;
        const rangeInfo = normalizeReadenCustomSelectionRange(text, startOffset, endOffset);
        if (!rangeInfo) return true;
        readenCustomSelection = {
            paragraphIndex: readenSelectionHandleDrag.paragraphIndex,
            startOffset: rangeInfo.startOffset,
            endOffset: rangeInfo.endOffset
        };
        renderReadenCustomSelectionVisual();
        return true;
    }

    function finishReadenSelectionHandleDrag(event) {
        if (!readenSelectionHandleDrag) return;
        readenSelectionHandleDrag = null;
        readerLastTouchTapAt = Date.now();
        event.preventDefault();
        event.stopPropagation();
        const info = buildReadenSelectionInfoFromCustomSelection();
        if (info && !info.error) showReadenSelectionToolbar(info);
    }

    function getReadenSelectionInfo() {
        const customInfo = buildReadenSelectionInfoFromCustomSelection();
        if (customInfo) return customInfo;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
        const range = selection.getRangeAt(0);
        const startParagraph = range.startContainer?.parentElement?.closest?.('.readen-reader-paragraph');
        const endParagraph = range.endContainer?.parentElement?.closest?.('.readen-reader-paragraph');
        if (!startParagraph || !endParagraph || startParagraph !== endParagraph) {
            return { error: '第一阶段只支持选择同一段文字，请缩小选择范围。' };
        }
        const quote = selection.toString().replace(/\s+/g, ' ').trim();
        if (quote.length < 2) return { error: '请至少选择 2 个字。' };
        if (quote.length > 600) return { error: '这段太长了，请缩小到 600 字以内。' };
        const paragraph = startParagraph.textContent || '';
        const startOffset = paragraph.indexOf(quote);
        if (startOffset < 0 || paragraph.indexOf(quote, startOffset + quote.length) >= 0) {
            return { error: '这段文字暂时无法稳定定位，请换一小段更独特的原文。' };
        }
        const selectionRects = Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
        const startRect = selectionRects[0] || range.getBoundingClientRect();
        const endRect = selectionRects[selectionRects.length - 1] || startRect;
        return {
            paragraphIndex: Number(startParagraph.dataset.paragraphIndex) || 0,
            startOffset,
            endOffset: startOffset + quote.length,
            quote,
            prefix: paragraph.slice(Math.max(0, startOffset - READEN_ANNOTATION_CONTEXT_LIMIT), startOffset),
            suffix: paragraph.slice(startOffset + quote.length, startOffset + quote.length + READEN_ANNOTATION_CONTEXT_LIMIT),
            rect: range.getBoundingClientRect(),
            startRect,
            endRect
        };
    }

    function hideReadenSelectionToolbar() {
        const toolbar = document.getElementById('readen-selection-toolbar');
        const handles = document.getElementById('readen-selection-handles');
        if (!toolbar) return;
        toolbar.classList.remove('show');
        toolbar.setAttribute('aria-hidden', 'true');
        if (handles) {
            handles.classList.remove('show');
            handles.setAttribute('aria-hidden', 'true');
        }
    }

    function updateReadenSelectionRoleButtonLabel() {
        const label = document.querySelector('#readen-selection-ai-btn span');
        if (!label) return;
        const book = getCurrentReaderBook();
        const display = book ? getReadenCoReaderDisplay(book) : null;
        const name = display?.name && display.name !== '角色' ? display.name : 'TA';
        label.textContent = '分享给' + name;
    }

    function showReadenSelectionToolbar(selectionInfo) {
        const toolbar = document.getElementById('readen-selection-toolbar');
        const handles = document.getElementById('readen-selection-handles');
        const readerContainer = document.getElementById('readen-reader-container');
        if (!toolbar || !readerContainer || !selectionInfo?.rect) return;
        updateReadenSelectionRoleButtonLabel();
        // The dictionary only knows English words, so the button is shown only for an English word.
        const defineButton = document.getElementById('readen-selection-define-btn');
        if (defineButton) {
            defineButton.style.display = /^[A-Za-z][A-Za-z'-]{1,64}$/.test(String(selectionInfo.quote || '').trim()) ? '' : 'none';
        }
        const containerRect = readerContainer.getBoundingClientRect();
        
        // 动态获取菜单宽度，默认给 300px
        const toolbarWidth = toolbar.offsetWidth || 300;
        const toolbarHeight = toolbar.offsetHeight || 140; // 预估高度
        
        const left = Math.max(14, Math.min(containerRect.width - toolbarWidth - 14, selectionInfo.rect.left - containerRect.left + selectionInfo.rect.width / 2 - toolbarWidth / 2));
        
        // 智能判断上下位置，防止遮挡文字
        let top = selectionInfo.rect.bottom - containerRect.top + 12;
        let isAbove = false;
        
        // 如果下方空间不足，则显示在文字上方
        if (top + toolbarHeight > containerRect.height - 40) {
            top = selectionInfo.rect.top - containerRect.top - toolbarHeight - 12;
            isAbove = true;
        }
        
        // 计算小三角的位置
        const arrowPos = Math.max(16, Math.min(toolbarWidth - 16, selectionInfo.startRect.left - containerRect.left - left + selectionInfo.startRect.width / 2));
        
        toolbar.style.left = `${left}px`;
        toolbar.style.top = `${top}px`;
        toolbar.style.setProperty('--arrow-pos', `${arrowPos}px`);
        
        toolbar.classList.remove('arrow-top', 'arrow-bottom');
        toolbar.classList.add(isAbove ? 'arrow-bottom' : 'arrow-top');
        toolbar.classList.add('show');
        toolbar.setAttribute('aria-hidden', 'false');
        if (handles && selectionInfo.startRect && selectionInfo.endRect) {
            const startHandle = handles.querySelector('.readen-selection-handle.start');
            const endHandle = handles.querySelector('.readen-selection-handle.end');
            if (startHandle && endHandle) {
                startHandle.style.left = `${selectionInfo.startRect.left - containerRect.left}px`;
                startHandle.style.top = `${selectionInfo.startRect.bottom - containerRect.top - 1}px`;
                endHandle.style.left = `${selectionInfo.endRect.right - containerRect.left}px`;
                endHandle.style.top = `${selectionInfo.endRect.bottom - containerRect.top - 1}px`;
                handles.classList.add('show');
                handles.setAttribute('aria-hidden', 'false');
            }
        }
    }

    function scheduleReadenSelectionToolbar() {
        setTimeout(() => {
            const readerContainer = document.getElementById('readen-reader-container');
            if (!readerContainer?.classList.contains('active')) {
                hideReadenSelectionToolbar();
                return;
            }
            if (readenCustomSelection) {
                const info = buildReadenSelectionInfoFromCustomSelection();
                if (info && !info.error) showReadenSelectionToolbar(info);
                return;
            }
            const selection = window.getSelection();
            const anchorElement = selection?.anchorNode?.nodeType === Node.TEXT_NODE
                ? selection.anchorNode.parentElement
                : selection?.anchorNode;
            if (!anchorElement?.closest?.('#readen-reader-content')) {
                hideReadenSelectionToolbar();
                return;
            }
            const info = getReadenSelectionInfo();
            if (info && !info.error) showReadenSelectionToolbar(info);
            else hideReadenSelectionToolbar();
        }, 80);
    }

    async function bindReadenCoReader(book, candidate) {
        ensureReadenBookCoReadingState(book);
        const now = Date.now();
        book.coReading = {
            enabled: true,
            contactId: candidate.contactId,
            linkedContactId: candidate.linkedContactId || '',
            name: candidate.name || '',
            avatar: candidate.avatar || '',
            mode: 'follow_user',
            knowledge: book.coReading.knowledge || null,
            chapterReflectionPrompted: Array.isArray(book.coReading.chapterReflectionPrompted) ? book.coReading.chapterReflectionPrompted : [],
            createdAt: book.coReading.createdAt || now,
            updatedAt: now
        };
        saveReadenAppData();
        if (typeof window.showToast === 'function') window.showToast(`已绑定 ${candidate.name}`);
        closeReaderChapterDrawer();
    }

    function getReadenCoReaderDisplay(book, annotation = null) {
        const binding = getReadenBoundCoReader(book);
        const name = String(annotation?.characterName || binding?.name || '角色');
        const avatar = String(annotation?.characterAvatar || binding?.avatar || '');
        return {
            name,
            avatar,
            label: `${name} 的批注`,
            shortName: name.slice(0, 2) || '角'
        };
    }

    function closeReadenDialogOverlay() {
        document.getElementById('readen-dialog-overlay')?.classList.remove('active');
    }

    function getReaderRecentChapterAnnotations(book, chapterKey) {
        ensureReadenBookCoReadingState(book);
        return (book.annotations || [])
            .filter(annotation => annotation.kind === 'character_annotation' && annotation.status === 'ready' && annotation.chapter?.key === chapterKey)
            .slice(-5)
            .map(annotation => `${annotation.anchor?.quote || ''}：${annotation.content || ''}`)
            .filter(Boolean);
    }

    // The character's reflections on earlier chapters (never later ones), so new comments stay consistent.
    function getReaderPreviousChapterReflections(book, chapterKey, limit = 3) {
        return (book?.annotations || [])
            .filter(annotation => annotation?.kind === 'chapter_reflection' && annotation.status !== 'deleted' && annotation.content
                && String(annotation.chapter?.key || '') !== String(chapterKey || '')
                && Number(annotation.chapter?.indexAtCreation) <= currentReaderChapterIndex)
            .slice(-limit)
            .map(annotation => `${annotation.chapter?.title || `第${Number(annotation.chapter?.indexAtCreation) + 1}章`}：${String(annotation.content).slice(0, 200)}`);
    }

    // Text right before the selection (up to 300 characters). Text after it is left out to avoid spoilers.
    function getReaderSelectionContextBefore(selectionInfo, limit = 300) {
        const paragraphs = Array.from(document.querySelectorAll('#readen-reader-content .readen-reader-paragraph'));
        const index = paragraphs.findIndex(paragraph => Number(paragraph.dataset.paragraphIndex) === Number(selectionInfo?.paragraphIndex));
        if (index < 0) return String(selectionInfo?.prefix || '');
        const parts = [String(paragraphs[index].textContent || '').slice(0, Math.max(0, Number(selectionInfo.startOffset) || 0))];
        let length = parts[0].length;
        for (let cursor = index - 1; cursor >= 0 && length < limit; cursor -= 1) {
            const text = String(paragraphs[cursor].textContent || '');
            parts.unshift(text);
            length += text.length + 1;
        }
        const text = parts.join('\n');
        return text.slice(Math.max(0, text.length - limit));
    }

    // Same account id the cross-app bridge uses, so co-reading notes only reach that account's WeChat.
    function getReadenBridgeAccountId() {
        try {
            if (typeof window.CrossAppBridge?.getAccountId === 'function') return String(window.CrossAppBridge.getAccountId() || '');
        } catch (_) {}
        return (typeof appSettings !== 'undefined' && appSettings?.wc_current_user_id) ? String(appSettings.wc_current_user_id) : '';
    }

    function isReadenAnnotationByBinding(annotation, binding) {
        if (!annotation || !binding) return false;
        const ids = new Set([binding.contactId, binding.linkedContactId].filter(Boolean).map(String));
        return ids.has(String(annotation.contactId || '')) || Boolean(annotation.linkedContactId && ids.has(String(annotation.linkedContactId)));
    }

    function makeReadenAnnotationId() {
        if (window.crypto?.randomUUID) return window.crypto.randomUUID();
        return `annotation_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    function openReaderAnnotationDetail(annotationId, targetElement = null) {
        const book = getCurrentReaderBook();
        ensureReadenBookCoReadingState(book);
        const annotation = (book?.annotations || []).find(item => item.id === annotationId);
        if (!annotation) return;

        if (!targetElement) {
            targetElement = document.querySelector(`.readen-annotation-mark[data-annotation-id="${annotationId}"]`);
        }

        if (targetElement) {
            showAnnotationPopover(annotation, targetElement);
        } else {
            if (typeof window.showToast === 'function') window.showToast('原文位置已变化，笔记内容仍然保留');
        }
    }

    function showAnnotationPopover(annotation, targetElement) {
        const popover = document.getElementById('readen-annotation-detail-popover');
        const backdrop = document.getElementById('readen-annotation-detail-backdrop');
        const contentEl = document.getElementById('radp-content');
        const timeEl = document.getElementById('radp-time');
        const readerContainer = document.getElementById('readen-reader-container');
        
        if (!popover || !backdrop || !contentEl || !readerContainer) return;

        hideReadenSelectionToolbar();
        closeReadenUserAnnotationPanel();

        popover.dataset.annotationId = annotation.id || '';
        backdrop.style.display = 'block';

        const textContent = escapeReadenHtml(annotation.kind === 'user_annotation' ? (annotation.note || '只做了标注') : (annotation.content || '批注内容为空'));
        if (annotation.images && annotation.images.length > 0) {
            contentEl.innerHTML = `
                <div class="radp-layout-horizontal">
                    <img src="${escapeReadenAttribute(annotation.images[0].src)}" alt="笔记图片" class="radp-image-left">
                    <div class="radp-text-right">${textContent}</div>
                </div>
            `;
        } else {
            contentEl.innerHTML = `<div class="radp-text">${textContent}</div>`;
        }

        timeEl.textContent = formatReaderAnnotationTime(annotation.createdAt);

        popover.style.display = 'flex'; 
        const containerRect = readerContainer.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        const popoverWidth = popover.offsetWidth || 280;
        const popoverHeight = popover.offsetHeight;
        
        const left = Math.max(14, Math.min(containerRect.width - popoverWidth - 14, targetRect.left - containerRect.left + targetRect.width / 2 - popoverWidth / 2));
        
        let top = targetRect.bottom - containerRect.top + 12;
        let isAbove = false;
        
        if (top + popoverHeight > containerRect.height - 40) {
            top = targetRect.top - containerRect.top - popoverHeight - 12;
            isAbove = true;
        }
        
        const arrowPos = Math.max(16, Math.min(popoverWidth - 16, targetRect.left - containerRect.left - left + targetRect.width / 2));
        
        popover.style.left = `${left}px`;
        popover.style.top = `${top}px`;
        popover.style.setProperty('--arrow-pos', `${arrowPos}px`);
        
        popover.classList.remove('arrow-top', 'arrow-bottom');
        popover.classList.add(isAbove ? 'arrow-bottom' : 'arrow-top');
        popover.classList.add('show');
    }

    function openReaderAnnotationImageCard(annotationId) {
        const book = getCurrentReaderBook();
        const annotation = (book?.annotations || []).find(item => item.id === annotationId);
        const image = annotation?.images?.[0];
        if (!image?.src) return;
        showReadenDialog({
            type: 'confirm',
            title: '',
            msg: `
                <div class="readen-annotation-image-card">
                    <img src="${escapeReadenAttribute(image.src)}" alt="添加的图片">
                    <div class="readen-annotation-image-card-meta">${escapeReadenHtml(formatReaderAnnotationTime(annotation.createdAt))}</div>
                </div>
            `
        });
    }

    function buildReaderUserAnnotation(book, selectionInfo, options) {
        ensureReadenBookCoReadingState(book);
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const now = Date.now();
        return {
            id: makeReadenAnnotationId(),
            version: READEN_COREADING_SCHEMA_VERSION,
            bookId: book.id,
            kind: 'user_annotation',
            authorType: 'user',
            contactId: '',
            linkedContactId: '',
            chapter: {
                key: chapterMeta.key,
                token: chapterMeta.token || '',
                indexAtCreation: currentReaderChapterIndex,
                title: chapterMeta.title,
                textHash: chapterMeta.textHash
            },
            anchor: {
                paragraphIndex: selectionInfo.paragraphIndex,
                startOffset: selectionInfo.startOffset,
                endOffset: selectionInfo.endOffset,
                quote: selectionInfo.quote,
                prefix: selectionInfo.prefix,
                suffix: selectionInfo.suffix
            },
            content: '',
            note: options.note,
            style: options.style,
            color: options.color,
            images: options.images,
            tone: 'thoughtful',
            status: 'ready',
            modelMeta: {},
            createdAt: now,
            updatedAt: now
        };
    }

    function refreshReaderAnnotations(book) {
        const progress = getReaderProgressPercent();
        renderReadenActiveChapterPayload(book);
        setTimeout(() => {
            updateReaderPagination();
            seekReaderProgress(progress);
        }, 60);
    }

    function closeReadenUserAnnotationPanel() {
        const panel = document.getElementById('readen-user-annotation-panel');
        panel?.classList.remove('active');
        panel?.setAttribute('aria-hidden', 'true');
        readenPendingUserAnnotation = null;
        clearReadenCustomSelection(true);
    }

    function setReadenAnnotationPanelPosition(selectionInfo) {
        const panel = document.getElementById('readen-user-annotation-panel');
        const sheet = panel?.querySelector('.readen-user-annotation-sheet');
        const readerContainer = document.getElementById('readen-reader-container');
        if (!panel || !sheet || !readerContainer || !selectionInfo?.rect) return;
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');

        const containerRect = readerContainer.getBoundingClientRect();
        const sheetWidth = 320;
        const sheetHeight = sheet.offsetHeight || 340;
        const left = Math.max(14, Math.min(containerRect.width - sheetWidth - 14, selectionInfo.rect.left - containerRect.left + selectionInfo.rect.width / 2 - sheetWidth / 2));
        let top = selectionInfo.rect.bottom - containerRect.top + 12;
        let isAbove = false;

        if (top + sheetHeight > containerRect.height - 40) {
            top = selectionInfo.rect.top - containerRect.top - sheetHeight - 12;
            isAbove = true;
        }

        const arrowPos = Math.max(16, Math.min(sheetWidth - 16, selectionInfo.startRect.left - containerRect.left - left + selectionInfo.startRect.width / 2));
        sheet.style.left = `${left}px`;
        sheet.style.top = `${top}px`;
        sheet.style.setProperty('--arrow-pos', `${arrowPos}px`);
        sheet.classList.remove('arrow-top', 'arrow-bottom');
        sheet.classList.add(isAbove ? 'arrow-bottom' : 'arrow-top');
    }

    function selectReadenUserAnnotationColor(color) {
        if (!readenPendingUserAnnotation) return;
        readenPendingUserAnnotation.color = color || '#facc15';
        document.querySelectorAll('[data-readen-annotation-color]').forEach(button => {
            button.classList.toggle('active', button.dataset.readenAnnotationColor === readenPendingUserAnnotation.color);
        });
    }

    function selectReadenUserAnnotationStyle(style) {
        if (!readenPendingUserAnnotation) return;
        const validStyles = ['underline', 'wavy', 'highlight', 'dashed', 'bg-color', 'text-color', 'double-line', 'dotted', 'strikethrough'];
        readenPendingUserAnnotation.style = validStyles.includes(style) ? style : 'highlight';
        document.querySelectorAll('[data-readen-annotation-style]').forEach(button => {
            button.classList.toggle('active', button.dataset.readenAnnotationStyle === readenPendingUserAnnotation.style);
        });
    }

    function renderReadenUserAnnotationPreview() {
        const preview = document.getElementById('readen-user-annotation-preview');
        if (!preview || !readenPendingUserAnnotation?.images?.length) {
            if (preview) {
                preview.innerHTML = '';
                preview.setAttribute('aria-hidden', 'true');
            }
            return;
        }
        const image = readenPendingUserAnnotation.images[0];
        preview.innerHTML = `<img src="${escapeReadenAttribute(image.src)}" alt="${escapeReadenAttribute(image.name || '添加的图片')}"><button type="button" id="readen-user-annotation-image-remove">移除图片</button>`;
        preview.setAttribute('aria-hidden', 'false');
        document.getElementById('readen-user-annotation-image-remove')?.addEventListener('click', () => {
            readenPendingUserAnnotation.images = [];
            renderReadenUserAnnotationPreview();
        });
    }

    function openReadenUserAnnotationPanel() {
        const book = getCurrentReaderBook();
        if (!book) return;
        const selectionInfo = getReadenSelectionInfo();
        hideReadenSelectionToolbar();
        if (!selectionInfo || selectionInfo.error) {
            showReadenDialog({ type: 'confirm', title: '无法标注', msg: selectionInfo?.error || '请先选择一段原文。' });
            return;
        }
        readenPendingUserAnnotation = {
            bookId: book.id,
            selectionInfo,
            style: 'highlight',
            color: '#ef4444', // 默认选中第一个红色
            images: []
        };
        const noteInput = document.getElementById('readen-user-annotation-note');
        if (noteInput) noteInput.value = '';
        selectReadenUserAnnotationColor(readenPendingUserAnnotation.color);
        selectReadenUserAnnotationStyle(readenPendingUserAnnotation.style);
        renderReadenUserAnnotationPreview();
        setReadenAnnotationPanelPosition(selectionInfo);
    }

    function buildReadenSelectionInfoFromAnnotation(annotation) {
        const anchor = annotation?.anchor;
        if (!anchor) return null;
        const paragraph = document.querySelector(`.readen-reader-paragraph[data-paragraph-index="${Number(anchor.paragraphIndex) || 0}"]`);
        const target = document.querySelector(`.readen-annotation-mark[data-annotation-id="${annotation.id}"]`);
        if (!paragraph && !target) return null;
        const text = paragraph?.textContent || anchor.quote || '';
        const rangeInfo = normalizeReadenCustomSelectionRange(text, anchor.startOffset, anchor.endOffset);
        if (!rangeInfo) return null;
        const range = paragraph ? createReadenParagraphRange(paragraph, rangeInfo.startOffset, rangeInfo.endOffset) : null;
        const rects = range ? Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0) : [];
        const rect = rects.length ? range.getBoundingClientRect() : (target || paragraph).getBoundingClientRect();
        const startRect = rects[0] || rect;
        const endRect = rects[rects.length - 1] || rect;
        return {
            paragraphIndex: Number(anchor.paragraphIndex) || 0,
            startOffset: rangeInfo.startOffset,
            endOffset: rangeInfo.endOffset,
            quote: anchor.quote || text.slice(rangeInfo.startOffset, rangeInfo.endOffset).replace(/\s+/g, ' ').trim(),
            prefix: anchor.prefix || text.slice(Math.max(0, rangeInfo.startOffset - READEN_ANNOTATION_CONTEXT_LIMIT), rangeInfo.startOffset),
            suffix: anchor.suffix || text.slice(rangeInfo.endOffset, rangeInfo.endOffset + READEN_ANNOTATION_CONTEXT_LIMIT),
            rect,
            startRect,
            endRect
        };
    }

    function openReadenUserAnnotationPanelForEdit(annotationId) {
        const book = getCurrentReaderBook();
        ensureReadenBookCoReadingState(book);
        const annotation = (book?.annotations || []).find(item => item.id === annotationId);
        if (!book || !annotation) return;
        if (annotation.kind !== 'user_annotation') {
            if (typeof window.showToast === 'function') window.showToast('只能编辑自己添加的批注');
            return;
        }
        const selectionInfo = buildReadenSelectionInfoFromAnnotation(annotation);
        if (!selectionInfo) {
            if (typeof window.showToast === 'function') window.showToast('请翻到对应页面再编辑');
            return;
        }
        readenPendingUserAnnotation = {
            mode: 'edit',
            annotationId: annotation.id,
            bookId: book.id,
            selectionInfo,
            style: annotation.style || 'highlight',
            color: annotation.color || '#ef4444',
            images: Array.isArray(annotation.images) ? annotation.images.slice() : []
        };
        const noteInput = document.getElementById('readen-user-annotation-note');
        if (noteInput) noteInput.value = annotation.note || '';
        selectReadenUserAnnotationColor(readenPendingUserAnnotation.color);
        selectReadenUserAnnotationStyle(readenPendingUserAnnotation.style);
        renderReadenUserAnnotationPreview();
        setReadenAnnotationPanelPosition(selectionInfo);
    }

    function handleReadenUserAnnotationImage(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !readenPendingUserAnnotation) return;
        if (!file.type.startsWith('image/')) {
            showReadenDialog({ type: 'confirm', title: '图片无效', msg: '请选择图片文件。' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showReadenDialog({ type: 'confirm', title: '图片太大', msg: '请上传 5MB 以内的图片。' });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            readenPendingUserAnnotation.images = [{ src: reader.result, name: file.name, type: file.type, size: file.size }];
            renderReadenUserAnnotationPreview();
        };
        reader.onerror = () => showReadenDialog({ type: 'confirm', title: '图片读取失败', msg: '请换一张图片再试。' });
        reader.readAsDataURL(file);
    }

    function saveReadenUserAnnotation() {
        if (!readenPendingUserAnnotation) return;
        const book = readenBooksData.find(item => item.id === readenPendingUserAnnotation.bookId);
        if (!book) return;
        const note = String(document.getElementById('readen-user-annotation-note')?.value || '').trim();
        if (readenPendingUserAnnotation.mode === 'edit') {
            const annotation = (book.annotations || []).find(item => item.id === readenPendingUserAnnotation.annotationId);
            if (!annotation) return;
            annotation.note = note;
            annotation.style = readenPendingUserAnnotation.style;
            annotation.color = readenPendingUserAnnotation.color;
            annotation.images = readenPendingUserAnnotation.images;
            annotation.updatedAt = Date.now();
            saveReadenAppData();
            closeReadenUserAnnotationPanel();
            refreshReaderAnnotations(book);
            scheduleReadenStatisticsRender();
            openReaderAnnotationDetail(annotation.id);
            return;
        }
        const annotation = buildReaderUserAnnotation(book, readenPendingUserAnnotation.selectionInfo, {
            note,
            style: readenPendingUserAnnotation.style,
            color: readenPendingUserAnnotation.color,
            images: readenPendingUserAnnotation.images
        });
        book.annotations.push(annotation);
        saveReadenAppData();
        window.getSelection()?.removeAllRanges();
        closeReadenUserAnnotationPanel();
        clearReadenCustomSelection(false);
        refreshReaderAnnotations(book);
        scheduleReadenStatisticsRender();
        openReaderAnnotationDetail(annotation.id);
    }

    function saveReaderCharacterAnnotation(book, selectionInfo, sceneResult) {
        ensureReadenBookCoReadingState(book);
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const now = Date.now();
        const binding = getReadenBoundCoReader(book);
        const annotation = {
            id: makeReadenAnnotationId(),
            version: READEN_COREADING_SCHEMA_VERSION,
            bookId: book.id,
            kind: 'character_annotation',
            authorType: 'character',
            accountId: getReadenBridgeAccountId(),
            contactId: binding.contactId,
            linkedContactId: binding.linkedContactId || '',
            characterName: binding.name || '',
            characterAvatar: binding.avatar || '',
            chapter: {
                key: chapterMeta.key,
                token: chapterMeta.token || '',
                indexAtCreation: currentReaderChapterIndex,
                title: chapterMeta.title,
                textHash: chapterMeta.textHash
            },
            anchor: {
                paragraphIndex: selectionInfo.paragraphIndex,
                startOffset: selectionInfo.startOffset,
                endOffset: selectionInfo.endOffset,
                quote: selectionInfo.quote,
                prefix: selectionInfo.prefix,
                suffix: selectionInfo.suffix
            },
            content: sceneResult.annotation,
            tone: sceneResult.tone || 'thoughtful',
            status: 'ready',
            modelMeta: {
                generatedAt: now
            },
            createdAt: now,
            updatedAt: now
        };
        book.annotations.push(annotation);
        const progress = getReaderProgressPercent();
        clearReadenCustomSelection(false);
        book.coReading.knowledge = {
            chapterKey: chapterMeta.key,
            chapterIndex: currentReaderChapterIndex,
            paragraphIndex: selectionInfo.paragraphIndex,
            charOffset: selectionInfo.endOffset,
            updatedAt: now
        };
        book.coReading.updatedAt = now;
        saveReadenAppData();
        scheduleReadenStatisticsRender();
        renderReadenActiveChapterPayload(book);
        setTimeout(() => {
            updateReaderPagination();
            seekReaderProgress(progress);
        }, 60);
        return annotation;
    }

    async function requestReadenCoReaderAnnotation() {
        const book = getCurrentReaderBook();
        if (!book) return;
        ensureReadenBookCoReadingState(book);
        const selectionInfo = getReadenSelectionInfo();
        hideReadenSelectionToolbar();
        if (!selectionInfo || selectionInfo.error) {
            showReadenDialog({ type: 'confirm', title: '无法批注', msg: selectionInfo?.error || '请先选择一段原文。' });
            return;
        }
        if (!getReadenBoundCoReader(book)) {
            showReadenDialog({
                type: 'confirm',
                title: '先选择共读角色',
                msg: '请先从现有微信角色里选择一个 TA。绑定后，再长按原文选择“请 TA 批注”。',
                onConfirm: () => openReaderChapterDrawer('roles')
            });
            return;
        }
        const binding = getReadenBoundCoReader(book);
        if (!window.CharacterSceneService?.requestAnnotation) {
            showReadenDialog({ type: 'confirm', title: '角色能力未就绪', msg: '微信角色能力还没有加载完成，请稍后重试。' });
            return;
        }
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const requestPayload = {
            scene: 'reading_annotation',
            contactId: binding.contactId,
            book: {
                id: book.id,
                title: book.title || '未命名书籍',
                author: book.author || book.sourceMeta?.author || '作者未知'
            },
            chapter: {
                key: chapterMeta.key,
                index: currentReaderChapterIndex,
                title: chapterMeta.title
            },
            selection: {
                quote: selectionInfo.quote,
                prefix: selectionInfo.prefix,
                suffix: selectionInfo.suffix,
                contextBefore: getReaderSelectionContextBefore(selectionInfo)
            },
            knowledgeBoundary: {
                maxChapterIndex: currentReaderChapterIndex,
                maxParagraphIndex: selectionInfo.paragraphIndex
            },
            previousAnnotations: getReaderRecentChapterAnnotations(book, chapterMeta.key),
            previousReflections: getReaderPreviousChapterReflections(book, chapterMeta.key)
        };
        const coReader = getReadenCoReaderDisplay(book);
        showReadenDialog({
            type: 'loading',
            title: `${coReader.name} 正在读这一段…`,
            msg: '正在生成批注，请稍等。'
        });
        try {
            const result = await window.CharacterSceneService.requestAnnotation(requestPayload);
            const annotation = saveReaderCharacterAnnotation(book, selectionInfo, result);
            window.getSelection()?.removeAllRanges();
            closeReadenDialogOverlay();
            openReaderAnnotationDetail(annotation.id);
        } catch (error) {
            closeReadenDialogOverlay();
            showReadenDialog({
                type: 'confirm',
                title: '批注失败',
                msg: escapeReadenHtml(error?.message || '生成失败，请检查网络和 API 配置后重试。'),
                onConfirm: () => {
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    requestReadenCoReaderAnnotationFromSnapshot(book.id, { ...selectionInfo, contextBefore: requestPayload.selection.contextBefore });
                }
            });
        }
    }

    async function requestReadenCoReaderAnnotationFromSnapshot(bookId, selectionInfo) {
        const book = readenBooksData.find(item => item.id === bookId);
        if (!book || !selectionInfo) return;
        const binding = getReadenBoundCoReader(book);
        if (!binding || !window.CharacterSceneService?.requestAnnotation) return;
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const coReader = getReadenCoReaderDisplay(book);
        showReadenDialog({ type: 'loading', title: `${coReader.name} 正在重读这一段…`, msg: '正在重新生成批注。' });
        try {
            const result = await window.CharacterSceneService.requestAnnotation({
                scene: 'reading_annotation',
                contactId: binding.contactId,
                book: { id: book.id, title: book.title || '未命名书籍', author: book.author || book.sourceMeta?.author || '作者未知' },
                chapter: { key: chapterMeta.key, index: currentReaderChapterIndex, title: chapterMeta.title },
                selection: { quote: selectionInfo.quote, prefix: selectionInfo.prefix, suffix: selectionInfo.suffix, contextBefore: selectionInfo.contextBefore || selectionInfo.prefix || '' },
                knowledgeBoundary: { maxChapterIndex: currentReaderChapterIndex, maxParagraphIndex: selectionInfo.paragraphIndex },
                previousAnnotations: getReaderRecentChapterAnnotations(book, chapterMeta.key),
                previousReflections: getReaderPreviousChapterReflections(book, chapterMeta.key)
            });
            const annotation = saveReaderCharacterAnnotation(book, selectionInfo, result);
            closeReadenDialogOverlay();
            openReaderAnnotationDetail(annotation.id);
        } catch (error) {
            closeReadenDialogOverlay();
            showReadenDialog({ type: 'confirm', title: '批注失败', msg: escapeReadenHtml(error?.message || '生成失败，请稍后再试。') });
        }
    }


    let readenChapterReflectionRequestPending = false;
    let readenChapterReflectionPromptOpen = false;
    const readenChapterReflectionPromptedThisSession = new Set();

    function getReadenChapterReflectionKey(chapterMeta) {
        return String(chapterMeta?.key || chapterMeta?.token || chapterMeta?.index || '');
    }

    function findReadenChapterReflectionByBinding(book, chapterKey, binding) {
        return (book?.annotations || []).find(annotation => annotation?.kind === 'chapter_reflection' && annotation.status !== 'deleted'
            && String(annotation?.chapter?.key || annotation?.chapter?.token || '') === String(chapterKey || '')
            && isReadenAnnotationByBinding(annotation, binding)) || null;
    }

    function findReadenChapterReflection(book, chapterKey) {
        return (book?.annotations || []).find(annotation => annotation?.kind === 'chapter_reflection'
            && String(annotation?.chapter?.key || annotation?.chapter?.token || '') === String(chapterKey || '')) || null;
    }

    function hasReadenChapterReflectionPromptState(book, chapterKey) {
        return (book?.coReading?.chapterReflectionPrompted || []).some(entry => typeof entry === 'string'
            ? entry === chapterKey : String(entry?.chapterKey || entry?.key || '') === String(chapterKey || ''));
    }

    function dismissReadenChapterReflectionPrompt(book, chapterKey) {
        ensureReadenBookCoReadingState(book);
        if (hasReadenChapterReflectionPromptState(book, chapterKey)) return;
        book.coReading.chapterReflectionPrompted.push({ chapterKey, status: 'dismissed', updatedAt: Date.now() });
        book.coReading.updatedAt = Date.now();
        saveReadenAppData();
    }

    function saveReadenChapterReflection(book, chapterMeta, sceneResult) {
        ensureReadenBookCoReadingState(book);
        const binding = getReadenBoundCoReader(book);
        if (!binding) throw new Error('共读角色已解绑，请重新选择后再试。');
        const now = Date.now();
        const annotation = {
            id: makeReadenAnnotationId(), version: READEN_COREADING_SCHEMA_VERSION, bookId: book.id,
            kind: 'chapter_reflection', authorType: 'character', accountId: getReadenBridgeAccountId(), contactId: binding.contactId,
            linkedContactId: binding.linkedContactId || '', characterName: binding.name || '', characterAvatar: binding.avatar || '',
            chapter: { key: chapterMeta.key, token: chapterMeta.token || '', indexAtCreation: currentReaderChapterIndex, title: chapterMeta.title, textHash: chapterMeta.textHash },
            anchor: {}, content: sceneResult.reflection, tone: sceneResult.tone || 'thoughtful', status: 'ready',
            modelMeta: { generatedAt: now, scene: 'chapter_reflection' }, createdAt: now, updatedAt: now
        };
        book.annotations.push(annotation);
        book.coReading.knowledge = {
            chapterKey: chapterMeta.key, chapterIndex: currentReaderChapterIndex,
            paragraphIndex: Math.max(0, getReaderParagraphs(getReaderActiveText()).length - 1),
            charOffset: String(getReaderActiveText() || '').length, updatedAt: now
        };
        book.coReading.updatedAt = now;
        saveReadenAppData();
        scheduleReadenStatisticsRender();
        return annotation;
    }

    async function requestReadenChapterReflection(bookId, chapterMeta, options = {}) {
        const book = readenBooksData.find(item => String(item.id) === String(bookId));
        const binding = getReadenBoundCoReader(book);
        if (!book || !binding || !window.CharacterSceneService?.requestChapterReflection) return;
        if (readenChapterReflectionRequestPending) return;
        const chapterKey = getReadenChapterReflectionKey(chapterMeta);
        // One reflection per role and chapter; "replace" swaps the old one after the new one arrives.
        if (!options.replace && findReadenChapterReflectionByBinding(book, chapterKey, binding)) return;
        readenChapterReflectionRequestPending = true;
        const display = getReadenCoReaderDisplay(book);
        showReadenDialog({ type: 'loading', title: `${display.name} 正在想这一章…`, msg: '正在生成章末感想，请稍等。' });
        try {
            const text = getReaderActiveText();
            const result = await window.CharacterSceneService.requestChapterReflection({
                scene: 'reading_chapter_reflection', contactId: binding.contactId,
                book: { id: book.id, title: book.title || '未命名书籍', author: book.author || book.sourceMeta?.author || '作者未知' },
                chapter: { key: chapterMeta.key, index: currentReaderChapterIndex, title: chapterMeta.title }, chapterText: text,
                knowledgeBoundary: { maxChapterIndex: currentReaderChapterIndex, maxParagraphIndex: Math.max(0, getReaderParagraphs(text).length - 1) },
                previousAnnotations: getReaderRecentChapterAnnotations(book, chapterMeta.key),
                previousReflections: getReaderPreviousChapterReflections(book, chapterMeta.key)
            });
            if (options.replace) {
                const currentBinding = getReadenBoundCoReader(book);
                book.annotations = (book.annotations || []).filter(item => !(item?.kind === 'chapter_reflection'
                    && String(item?.chapter?.key || item?.chapter?.token || '') === String(chapterKey)
                    && isReadenAnnotationByBinding(item, currentBinding)));
            }
            const annotation = saveReadenChapterReflection(book, chapterMeta, result);
            closeReadenDialogOverlay();
            showReadenDialog({ type: 'confirm', title: `${display.name} 的章末感想`, msg: `<div class="readen-chapter-reflection-content">${escapeReadenHtml(annotation.content)}</div>` });
        } catch (error) {
            closeReadenDialogOverlay();
            showReadenDialog({ type: 'confirm', title: '感想生成失败', msg: escapeReadenHtml(error?.message || '生成失败，请检查网络和 API 配置后重试。'), onConfirm: () => requestReadenChapterReflection(book.id, chapterMeta, options), confirmText: '重试', cancelText: '关闭' });
        } finally {
            readenChapterReflectionRequestPending = false;
            readenChapterReflectionPromptOpen = false;
        }
    }

    // Deletes one chapter-end reflection (after asking). It is the same record the reflection list
    // in the catalog shows, so it disappears there too.
    function deleteReadenChapterReflection(annotationId) {
        const book = getCurrentReaderBook();
        const target = (book?.annotations || []).find(item => item?.kind === 'chapter_reflection' && String(item.id) === String(annotationId));
        if (!book || !target) return;
        const name = String(target.characterName || '角色').trim() || '角色';
        showReadenDialog({
            type: 'confirm',
            title: '删除这条感想？',
            msg: `${escapeReadenHtml(name)} 在这一章末尾留下的感想会被删除，目录里的章末感想也会一起删除。`,
            confirmText: '删除',
            cancelText: '取消',
            onConfirm: () => {
                book.annotations = (book.annotations || []).filter(item => item !== target);
                saveReadenAppData();
                scheduleReadenStatisticsRender();
                window.ReadenChapterReflectionInline?.render({ book, chapterIndex: currentReaderChapterIndex });
                window.showToast?.('已删除这条感想');
            }
        });
    }

    // Counts the pages again after something was added to or removed from the chapter (the
    // reflection block), keeping the reader on the page it is on.
    function refreshReaderPaginationKeepingPage() {
        if (!document.getElementById('readen-reader-container')?.classList.contains('active')) return;
        // Never re-layout under a running page turn; try again once it is over.
        if (readerPageTurnAnimation) {
            setTimeout(refreshReaderPaginationKeepingPage, READEN_PAGE_CURL_MS);
            return;
        }
        updateReaderPagination();
    }

    function getReadenCurrentChapterReflectionState() {
        const book = getCurrentReaderBook();
        if (!book) return null;
        const binding = getReadenBoundCoReader(book);
        const chapter = getReaderChapters(book)[currentReaderChapterIndex];
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const progress = Math.max(Number(chapter?.progress) || 0, getReaderProgressPercent());
        return {
            bound: Boolean(binding),
            name: binding?.name || '',
            chapterTitle: chapterMeta.title || '',
            hasReflection: Boolean(binding && findReadenChapterReflectionByBinding(book, getReadenChapterReflectionKey(chapterMeta), binding)),
            // Generating before the chapter end could reveal the rest of the chapter.
            chapterFinished: progress >= 95
        };
    }

    function requestReadenCurrentChapterReflection(options = {}) {
        const book = getCurrentReaderBook();
        if (!book) return;
        if (!getReadenBoundCoReader(book)) {
            showReadenDialog({
                type: 'confirm',
                title: '先选择共读角色',
                msg: '请先在「角色」里选择一个微信角色，再生成章末感想。',
                onConfirm: () => openReaderChapterDrawer('roles')
            });
            return;
        }
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        closeReaderChapterDrawer();
        requestReadenChapterReflection(book.id, chapterMeta, { replace: Boolean(options.replace) });
    }

    function maybePromptReadenChapterReflection(book, progress) {
        if (!book || Number(progress) < 99.5 || readenChapterReflectionRequestPending || readenChapterReflectionPromptOpen) return;
        const binding = getReadenBoundCoReader(book);
        if (!binding || !window.CharacterSceneService?.requestChapterReflection) return;
        const chapterMeta = getReaderChapterPayloadMeta(book, getReaderActiveText());
        const chapterKey = getReadenChapterReflectionKey(chapterMeta);
        if (!chapterKey || findReadenChapterReflection(book, chapterKey) || hasReadenChapterReflectionPromptState(book, chapterKey)) return;
        const sessionKey = String(book.id) + ':' + chapterKey;
        if (readenChapterReflectionPromptedThisSession.has(sessionKey)) return;
        readenChapterReflectionPromptedThisSession.add(sessionKey);
        readenChapterReflectionPromptOpen = true;
        const display = getReadenCoReaderDisplay(book);
        showReadenDialog({
            type: 'confirm', title: '这一章读完了',
            msg: `<p>要不要看看 ${escapeReadenHtml(display.name)} 读完这一章想说什么？</p><button type="button" class="reader-tool-btn muted" id="readen-chapter-reflection-never-btn">本章不再提示</button>`,
            onConfirm: () => requestReadenChapterReflection(book.id, chapterMeta),
            onCancel: () => { readenChapterReflectionPromptOpen = false; },
            confirmText: '生成感想', cancelText: '稍后再说'
        });
        setTimeout(() => {
            document.getElementById('readen-chapter-reflection-never-btn')?.addEventListener('click', () => {
                dismissReadenChapterReflectionPrompt(book, chapterKey);
                readenChapterReflectionPromptOpen = false;
                closeReadenDialogOverlay();
                if (typeof window.showToast === 'function') window.showToast('本章将不再提示');
            }, { once: true });
        }, 0);
    }

    function renderReaderParagraphWithMarks(paragraph, marks) {
        const fragment = document.createDocumentFragment();
        let cursor = 0;
        marks.forEach(mark => {
            if (mark.startOffset < cursor || mark.endOffset > paragraph.length) return;
            if (mark.startOffset > cursor) fragment.appendChild(document.createTextNode(paragraph.slice(cursor, mark.startOffset)));
            const marker = document.createElement('mark');
            const validStyles = ['underline', 'wavy', 'highlight', 'dashed', 'bg-color', 'text-color', 'double-line', 'dotted', 'strikethrough'];
            const style = validStyles.includes(mark.annotation.style) ? mark.annotation.style : 'highlight';
            marker.className = `readen-annotation-mark ${mark.annotation.kind === 'user_annotation' ? 'user' : 'character'} style-${style}`;
            marker.dataset.annotationId = mark.annotation.id;
            marker.style.setProperty('--annotation-color', mark.annotation.color || '#facc15');
            marker.appendChild(document.createTextNode(paragraph.slice(mark.startOffset, mark.endOffset)));
            marker.addEventListener('click', event => {
                event.stopPropagation();
                openReaderAnnotationDetail(mark.annotation.id, marker);
            });
            fragment.appendChild(marker);
            cursor = mark.endOffset;
        });
        if (cursor < paragraph.length) fragment.appendChild(document.createTextNode(paragraph.slice(cursor)));
        return fragment;
    }


    function renderReadenEpubPayload(book, payload) {
        const readerContent = document.getElementById('readen-reader-content');
        ensureReadenEpubStyles();
        const text = payload.text || '';
        const paragraphs = getReaderParagraphs(text);
        const chapterMeta = getReaderChapterPayloadMeta(book, text);
        const marksByParagraph = new Map();
        getReaderReadyAnnotationsForChapter(book, chapterMeta).forEach(annotation => {
            const resolved = resolveReaderAnnotationAnchor(annotation, paragraphs);
            if (!resolved) return;
            if (!marksByParagraph.has(resolved.paragraphIndex)) marksByParagraph.set(resolved.paragraphIndex, []);
            marksByParagraph.get(resolved.paragraphIndex).push(resolved);
        });
        let paragraphIndex = 0;
        (payload.blocks || []).forEach(block => {
            if (block.type === 'image') {
                const source = getReadenEpubAssetSource(book, block.assetId);
                if (source) {
                    const image = document.createElement('img');
                    image.className = 'readen-reader-epub-image';
                    image.src = source;
                    image.alt = block.alt || book.title || 'EPUB 图片';
                    image.loading = 'lazy';
                    readerContent.appendChild(image);
                } else {
                    const missing = document.createElement('div');
                    missing.className = 'readen-reader-epub-image-missing';
                    missing.textContent = 'EPUB 图片暂时无法读取';
                    readerContent.appendChild(missing);
                }
                return;
            }
            const paragraph = String(block.text || '').trim();
            if (!paragraph) return;
            const element = document.createElement(block.type === 'heading' ? 'h3' : 'p');
            element.className = 'readen-reader-paragraph' + (block.type === 'heading' ? ' readen-reader-epub-heading' : '');
            element.dataset.paragraphIndex = String(paragraphIndex);
            const marks = (marksByParagraph.get(paragraphIndex) || [])
                .sort((a, b) => a.startOffset - b.startOffset || a.endOffset - b.endOffset);
            element.appendChild(renderReaderParagraphWithMarks(paragraph, marks));
            readerContent.appendChild(element);
            paragraphIndex += 1;
        });
        if (!readerContent.childNodes.length) readerContent.textContent = '暂时没有解析到正文内容。';
        if (readenSpeechState) setTimeout(renderReadenSpeechHighlight, 0);
    }

    // Re-render the open chapter in its own format, so EPUB images and manga pages survive
    // a refresh after annotating or clearing a selection.
    function renderReadenActiveChapterPayload(book) {
        const chapter = getReaderChapters(book)[currentReaderChapterIndex];
        if (Array.isArray(chapter?.images) && chapter.images.length) {
            renderReadenReaderPayload(book, { kind: 'manga', images: chapter.images });
            return;
        }
        if (Array.isArray(chapter?.epubBlocks) && chapter.epubBlocks.length) {
            renderReadenReaderPayload(book, { kind: 'epub', text: chapter.content || '', blocks: chapter.epubBlocks });
            return;
        }
        renderReadenReaderPayload(book, { kind: 'novel', text: getReaderActiveText() });
    }

    function renderReadenReaderPayload(book, payload) {
        const readerContent = document.getElementById('readen-reader-content');
        readerContent.classList.remove('readen-manga-content');
        readerContent.replaceChildren();
        if (payload.kind === 'manga' && Array.isArray(payload.images) && payload.images.length > 0) {
            readerContent.classList.add('readen-manga-content');
            readerContent.innerHTML = payload.images.map(image => {
                return '<img src="' + escapeReadenAttribute(image) + '" alt="' + escapeReadenAttribute(book.title) + '" loading="lazy">';
            }).join('');
            return;
        }
        if (payload.kind === 'epub' && Array.isArray(payload.blocks)) {
            renderReadenEpubPayload(book, payload);
            if (readenCustomSelection) requestAnimationFrame(renderReadenCustomSelectionVisual);
            else clearReadenSelectionHighlight();
            return;
        }
        ensureReadenBookCoReadingState(book);
        const text = payload.text || '暂时没有解析到正文内容。';
        const paragraphs = getReaderParagraphs(text);
        const chapterMeta = getReaderChapterPayloadMeta(book, text);
        const marksByParagraph = new Map();
        getReaderReadyAnnotationsForChapter(book, chapterMeta).forEach(annotation => {
            const resolved = resolveReaderAnnotationAnchor(annotation, paragraphs);
            if (!resolved) return;
            if (!marksByParagraph.has(resolved.paragraphIndex)) marksByParagraph.set(resolved.paragraphIndex, []);
            marksByParagraph.get(resolved.paragraphIndex).push(resolved);
        });
        paragraphs.forEach((paragraph, index) => {
            const element = document.createElement('p');
            element.className = 'readen-reader-paragraph';
            element.dataset.paragraphIndex = String(index);
            const marks = (marksByParagraph.get(index) || [])
                .sort((a, b) => a.startOffset - b.startOffset || a.endOffset - b.endOffset);
            element.appendChild(renderReaderParagraphWithMarks(paragraph, marks));
            readerContent.appendChild(element);
        });
        if (readenSpeechState) setTimeout(renderReadenSpeechHighlight, 0);
        // The overlay follows the newly laid out text, or goes away with the old chapter.
        if (readenCustomSelection) requestAnimationFrame(renderReadenCustomSelectionVisual);
        else clearReadenSelectionHighlight();
    }

    async function loadReadenOnlineChapter(book, chapterIndex = 0, options = {}) {
        const token = book.sourceMeta?.readToken;
        if (!token) return;
        ensureReadenBookCoReadingState(book);

        const readerContent = document.getElementById('readen-reader-content');
        readerContent.classList.remove('readen-manga-content');
        readerContent.textContent = '正在加载正文…';

        try {
            const chapter = Array.isArray(book.chapters) ? book.chapters[chapterIndex] : null;
            const chapterToken = chapter?.token || token;
            const response = await fetch(getReadenReadApiUrl('content', chapterToken));
            if (!response.ok) throw new Error(`content ${response.status}`);
            const payload = await response.json();

            if (chapter) {
                if (payload.kind === 'manga') chapter.images = payload.images || [];
                if (payload.kind !== 'manga') chapter.content = payload.text || '';
                book.currentChapterIndex = chapterIndex;
            }
            currentReaderChapterIndex = chapterIndex;
            updateReaderChapterNav();
            if (payload.kind !== 'manga') book.fullText = payload.text || '';
            book.lastReadTime = Date.now();
            saveReadenAppData();
            renderReadenReaderPayload(book, payload);
            setTimeout(() => {
                updateReaderPagination();
                if (Number.isFinite(options.initialProgress)) {
                    seekReaderProgress(options.initialProgress);
                } else {
                    restoreReaderProgress(book, chapterIndex, options.restorePosition || null);
                }
            }, 100);
        } catch (error) {
            console.warn('[Readen] online chapter unavailable', error);
            readerContent.textContent = '这本书暂时无法加载正文，请稍后再试。';
        }
    }

    async function loadReadenOnlineBook(book, chapterIndex = 0, options = {}) {
        const token = book.sourceMeta?.readToken;
        if (!token) return;

        try {
            const response = await fetch(getReadenReadApiUrl('detail', token));
            if (!response.ok) throw new Error(`detail ${response.status}`);
            const payload = await response.json();
            if (Array.isArray(payload.chapters) && payload.chapters.length > 0) {
                book.chapters = sortReadenChapters(payload.chapters);
                saveReadenAppData();
                const chapterTab = document.querySelector('.bd-tab[data-target="chapters"]');
                if (chapterTab) switchBdTab('chapters', chapterTab);
            }
            await loadReadenOnlineChapter(book, chapterIndex, options);
        } catch (error) {
            console.warn('[Readen] online book unavailable', error);
            document.getElementById('readen-reader-content').textContent = '这本书暂时无法加载，请稍后再试。';
        }
    }

    function getCurrentReaderBook() {
        return readenBooksData.find(book => book.id === currentReaderBookId) || null;
    }

    function getReaderChapters(book) {
        if (!book || !Array.isArray(book.chapters)) return [];
        const canSplitLargeChapters = !(Array.isArray(book.annotations) && book.annotations.length);
        if (canSplitLargeChapters && book.chapters.some(chapter => String(chapter?.content || '').length > READEN_LARGE_CHAPTER_CHAR_LIMIT)) {
            book.chapters = normalizeReadenLargeChapters(book.chapters);
            saveReadenAppData();
        }
        if (shouldSortReadenChapters(book)) book.chapters = sortReadenChapters(book.chapters);
        return book.chapters;
    }

    function updateReaderChapterNav() {
        const book = getCurrentReaderBook();
        const chapters = getReaderChapters(book);
        const previous = document.getElementById('readen-reader-prev-chapter');
        const next = document.getElementById('readen-reader-next-chapter');
        if (!previous || !next) return;
        previous.classList.toggle('disabled', currentReaderChapterIndex <= 0 || !chapters.length);
        next.classList.toggle('disabled', currentReaderChapterIndex >= chapters.length - 1 || !chapters.length);
    }

    function changeReaderChapter(offset) {
        const book = getCurrentReaderBook();
        const chapters = getReaderChapters(book);
        if (!book || !chapters.length) return;
        const targetIndex = currentReaderChapterIndex + offset;
        if (targetIndex < 0 || targetIndex >= chapters.length) return;
        recordReaderPageTurn();
        finishReaderPageTurnAnimation();
        const turn = prepareReaderChapterTurn(offset > 0 ? 1 : -1);
        const positioned = openReader(book.id, targetIndex, { initialProgress: offset > 0 ? 0 : 100, chapterTurn: Boolean(turn) });
        turn?.start(positioned === true);
    }

    function hasReaderChapter(offset) {
        const book = getCurrentReaderBook();
        const chapters = getReaderChapters(book);
        if (!book || !chapters.length) return false;
        const targetIndex = currentReaderChapterIndex + offset;
        return targetIndex >= 0 && targetIndex < chapters.length;
    }

    function closeReaderChapterDrawer() {
        document.getElementById('readen-reader-chapter-drawer')?.remove();
    }

    function formatReaderAnnotationTime(timestamp) {
        const value = Number(timestamp) || 0;
        if (!value) return '时间未知';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '时间未知';
        return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    function renderReaderAnnotationList(book) {
        ensureReadenBookCoReadingState(book);
        const annotations = (book?.annotations || [])
            .filter(annotation => ['character_annotation', 'user_annotation', 'chapter_reflection'].includes(annotation.kind))
            .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
        if (!annotations.length) {
            return '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无批注笔记</div>';
        }
        return `
            <div class="readen-annotation-list">
                ${annotations.map(annotation => {
                    const kindLabel = annotation.kind === 'user_annotation' ? '我的笔记' : getReadenCoReaderDisplay(book, annotation).label;
                    return `
                        <button type="button" class="readen-annotation-list-item" data-annotation-id="${escapeReadenAttribute(annotation.id)}">
                            <span class="readen-annotation-list-kind">${escapeReadenHtml(kindLabel)}${annotation.images?.length ? ' · 有图片' : ''}</span>
                            <span class="readen-annotation-list-quote">${escapeReadenHtml(annotation.anchor?.quote || '原文位置已变化')}</span>
                            <span class="readen-annotation-list-content">${escapeReadenHtml(annotation.kind === 'user_annotation' ? (annotation.note || '只做了标注') : (annotation.content || '批注内容为空'))}</span>
                            <span class="readen-annotation-list-meta">${annotation.status === 'anchor_missing' ? '原文位置已变化 · ' : ''}${escapeReadenHtml(formatReaderAnnotationTime(annotation.createdAt))}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderReadenCoReaderPaneLoading(book) {
        const binding = getReadenBoundCoReader(book);
        if (binding) {
            const coReader = getReadenCoReaderDisplay(book);
            const avatarHtml = coReader.avatar
                ? `<img src="${escapeReadenAttribute(coReader.avatar)}" alt="${escapeReadenAttribute(coReader.name)}" class="readen-coreader-avatar">`
                : `<div class="readen-coreader-avatar readen-coreader-avatar-empty">${escapeReadenHtml(coReader.shortName)}</div>`;
            return `
                <div class="readen-coreader-pane">
                    <div class="readen-coreader-bound">
                        ${avatarHtml}
                        <div>
                            <div class="readen-coreader-title">已绑定共读角色</div>
                            <div class="readen-coreader-sub">${escapeReadenHtml(coReader.name)} 已陪你读到第 ${currentReaderChapterIndex + 1} 章</div>
                        </div>
                    </div>
                    <div class="readen-coreader-actions">
                        <button type="button" class="readen-coreader-action" data-readen-coreader-action="annotations">查看 ${escapeReadenHtml(coReader.name)} 的批注</button>
                        <button type="button" class="readen-coreader-action muted" data-readen-coreader-action="unbind">解除绑定</button>
                    </div>
                </div>
            `;
        }
        return `
            <div class="readen-coreader-pane">
                <div class="readen-coreader-empty">
                    <div class="readen-coreader-title">选择一个现有微信角色共读</div>
                    <div class="readen-coreader-sub">角色只会看到你已经读到的位置，不会提前读取后续章节。</div>
                </div>
                <div class="readen-coreader-loading">正在读取角色…</div>
            </div>
        `;
    }

    async function hydrateReadenCoReaderPane(drawer, book) {
        const pane = drawer.querySelector('#drawer-pane-roles');
        if (!pane || getReadenBoundCoReader(book)) {
            bindReadenCoReaderPaneActions(drawer, book);
            return;
        }
        const candidates = await getReadenCoReadingCandidates();
        if (!document.body.contains(drawer)) return;
        if (!candidates.length) {
            pane.innerHTML = `
                <div class="readen-coreader-pane">
                    <div class="readen-coreader-empty">
                        <div class="readen-coreader-title">还没有可绑定的微信角色</div>
                        <div class="readen-coreader-sub">请先在角色库生成微信角色联系人，再回到阅读器绑定。</div>
                    </div>
                </div>
            `;
            return;
        }
        pane.innerHTML = `
            <div class="readen-coreader-pane">
                <div class="readen-coreader-empty">
                    <div class="readen-coreader-title">选择一个现有微信角色共读</div>
                    <div class="readen-coreader-sub">绑定后，长按原文即可看到“请 TA 批注”。</div>
                </div>
                <div class="readen-coreader-list">
                    ${candidates.map(candidate => `
                        <button type="button" class="readen-coreader-item" data-readen-coreader-id="${escapeReadenAttribute(candidate.contactId)}">
                            <span class="readen-coreader-avatar"${candidate.avatar ? ` style="background-image:url('${escapeReadenAttribute(candidate.avatar)}')"` : ''}>${candidate.avatar ? '' : escapeReadenHtml(candidate.name.slice(0, 1) || 'TA')}</span>
                            <span class="readen-coreader-info">
                                <span class="readen-coreader-name">${escapeReadenHtml(candidate.name)}</span>
                                <span class="readen-coreader-desc">${escapeReadenHtml(candidate.desc)}</span>
                            </span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        pane.querySelectorAll('[data-readen-coreader-id]').forEach(button => {
            button.addEventListener('click', () => {
                const candidate = candidates.find(item => item.contactId === button.dataset.readenCoreaderId);
                if (!candidate) return;
                showReadenDialog({
                    type: 'confirm',
                    title: '绑定共读角色',
                    msg: `确认让「${escapeReadenHtml(candidate.name)}」陪你读《${escapeReadenHtml(book.title || '这本书')}》吗？`,
                    onConfirm: () => bindReadenCoReader(book, candidate)
                });
            });
        });
    }

    function bindReadenCoReaderPaneActions(drawer, book) {
        drawer.querySelector('[data-readen-coreader-action="annotations"]')?.addEventListener('click', () => {
            const notesTab = drawer.querySelector('.drawer-tab[data-target="notes"]');
            if (notesTab) notesTab.click();
        });
        drawer.querySelector('[data-readen-coreader-action="unbind"]')?.addEventListener('click', () => {
            showReadenDialog({
                type: 'confirm',
                title: '解除共读绑定',
                msg: '只解除这本书的共读角色，不会删除历史批注。',
                onConfirm: () => {
                    ensureReadenBookCoReadingState(book);
                    book.coReading.enabled = false;
                    book.coReading.contactId = '';
                    book.coReading.linkedContactId = '';
                    book.coReading.updatedAt = Date.now();
                    saveReadenAppData();
                    closeReaderChapterDrawer();
                    openReaderChapterDrawer('roles');
                }
            });
        });
    }


    function renderReadenReaderDataPane(rows) {
        return `
            <div style="overflow-y: auto; padding: 18px 20px 28px;">
                ${rows.map(row => `
                    <div style="display:flex; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid #f0f0f0;">
                        <span style="color:#8a8a8f; font-size:13px;">${escapeReadenHtml(row[0])}</span>
                        <strong style="color:#222; font-size:14px; text-align:right; font-weight:600;">${escapeReadenHtml(row[1])}</strong>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderReadenReaderInfoPane(book) {
        const chapters = Array.isArray(book?.chapters) ? book.chapters : [];
        const chapterIndex = Math.max(0, Math.min(Math.max(0, chapters.length - 1), Number(book?.currentChapterIndex ?? currentReaderChapterIndex) || 0));
        const chapterTitle = chapters[chapterIndex]?.title || getReaderChapterTitle(book);
        return renderReadenReaderDataPane([
            ['阅读状态', getReadenBookStatus(book)],
            ['书籍来源', getReadenBookSourceLabel(book)],
            ['作者', book?.author || book?.sourceMeta?.author || '未知'],
            ['当前章节', chapterTitle],
            ['全书进度', `${getReadenBookProgress(book).toFixed(1)}%`],
            ['章节数量', `${chapters.length || 0} 章`],
            ['文件大小', getReadenBookSize(book)]
        ]);
    }

    function renderReadenReaderStatsPane(book) {
        const stats = getReaderStats(book);
        const sessions = getReadenBookSessions(book);
        return renderReadenReaderDataPane([
            ['累计阅读', formatReaderDuration(stats.totalMs)],
            ['已读字数', `${stats.readChars || 0} 字`],
            ['阅读速度', `${stats.speedWpm || 0} 字/分钟`],
            ['打开次数', `${stats.openCount || 0} 次`],
            ['翻页次数', `${stats.pageTurnCount || 0} 次`],
            ['阅读会话', `${sessions.length} 次`],
            ['最近阅读', stats.lastOpenedAt ? formatReaderAnnotationTime(stats.lastOpenedAt) : '暂无记录']
        ]);
    }

    function openReaderChapterDrawer(defaultTab = 'catalog') {
        pauseReadenSpeech();
        const book = getCurrentReaderBook();
        const chapters = getReaderChapters(book);
        if (!book) return;
        ensureReadenBookCoReadingState(book);
        closeReaderChromeMenus();
        closeReaderChapterDrawer();
        
        // 获取封面
        let coverContent = '';
        const coverSource = getReadenBookCoverSource(book);
        if (coverSource) {
            coverContent = `<img src="${escapeReadenAttribute(coverSource)}" style="width: 100%; height: 100%; object-fit: contain; display: block;">`;
        } else {
            const allThemes = getAllCoverThemes();
            const theme = allThemes[readenGlobalThemeIndex] || allThemes[0];
            if (theme.svgList && theme.svgList.length > 0) {
                coverContent = theme.svgList[book.id % theme.svgList.length];
            } else {
                coverContent = theme.svg;
            }
        }

        const drawer = document.createElement('div');
        drawer.id = 'readen-reader-chapter-drawer';
        drawer.className = 'readen-reader-chapter-drawer';
        drawer.innerHTML = `
            <div class="readen-reader-chapter-backdrop"></div>
            <section class="readen-reader-chapter-panel" role="dialog" aria-label="目录">
                <div class="drawer-header-area">
                    <div class="drawer-drag-handle"></div>
                    <div class="drawer-book-info">
                        <div class="drawer-book-cover">${coverContent}</div>
                        <div class="drawer-book-text">
                            <div class="drawer-book-title">${getReadenBookStatus(book)} · 《${escapeReadenHtml(book.title || '未命名书籍')}》</div>
                         <div class="drawer-book-meta">${escapeReadenHtml(getReaderChapterTitle(book))} · ${escapeReadenHtml(getReadenBookSourceLabel(book))} · ${getReadenBookProgress(book).toFixed(1)}% · ${escapeReadenHtml(getReadenBookSize(book))}</div>
                        </div>
                    </div>
                    <div class="drawer-tabs">
                        <div class="drawer-tab ${defaultTab === 'info' ? 'active' : ''}" data-target="info">信息</div>
                        <div class="drawer-tab ${defaultTab === 'catalog' ? 'active' : ''}" data-target="catalog">目录</div>
                        <div class="drawer-tab ${defaultTab === 'notes' ? 'active' : ''}" data-target="notes">笔记</div>
                        <div class="drawer-tab ${defaultTab === 'stats' ? 'active' : ''}" data-target="stats">统计</div>
                        <div class="drawer-tab ${defaultTab === 'roles' ? 'active' : ''}" data-target="roles">角色</div>
                    </div>
                </div>
                <div class="drawer-content-area">
                    <!-- 目录面板 -->
                    <div class="drawer-pane ${defaultTab === 'catalog' ? 'active' : ''}" id="drawer-pane-catalog">
                        <div class="catalog-tools">
                            <span>${escapeReadenHtml(getReaderChapterTitle(book))} · 第 ${currentReaderChapterIndex + 1} / ${chapters.length || 1} 章 · 已读 ${getReadenBookProgress(book).toFixed(1)}%</span>
                            <div class="catalog-icons">
                                <svg viewBox="0 0 24 24" role="button" aria-label="搜索本书" data-readen-catalog-action="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <svg viewBox="0 0 24 24" role="button" aria-label="正序 / 倒序" aria-pressed="${readenCatalogReversed ? 'true' : 'false'}" data-readen-catalog-action="sort"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="8" y2="18"></line></svg>
                            </div>
                        </div>
                        <div class="readen-reader-chapter-list">
                            ${chapters.length ? chapters.map((chapter, index) => `
                                <button type="button" class="readen-reader-chapter-item${index === currentReaderChapterIndex ? ' active' : ''}" data-readen-reader-chapter-index="${index}">
                                    <span>${escapeReadenHtml(chapter.title || `第${index + 1}章`)}</span>
                                </button>
                            `).join('') : '<div class="readen-reader-chapter-empty">暂无章节目录</div>'}
                        </div>
                    </div>
                    <!-- 笔记面板 -->
                    <div class="drawer-pane ${defaultTab === 'notes' ? 'active' : ''}" id="drawer-pane-notes">
                        ${renderReaderAnnotationList(book)}
                    </div>
                    <!-- 其他占位面板 -->
                     <div class="drawer-pane ${defaultTab === 'info' ? 'active' : ''}" id="drawer-pane-info">${renderReadenReaderInfoPane(book)}</div>
                     <div class="drawer-pane ${defaultTab === 'stats' ? 'active' : ''}" id="drawer-pane-stats">${renderReadenReaderStatsPane(book)}</div>
                    <div class="drawer-pane ${defaultTab === 'roles' ? 'active' : ''}" id="drawer-pane-roles">${renderReadenCoReaderPaneLoading(book)}</div>
                </div>
                <!-- 抽屉底部的操作栏 -->
                <div class="drawer-bottom-actions">
                    <div class="rb-action-item ${defaultTab === 'catalog' ? 'active' : ''}" id="drawer-btn-catalog">
                        <div class="rb-icon-btn"><svg viewBox="0 0 24 24" style="stroke-width: 2.2;"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
                        <div class="rb-action-label">目录</div>
                    </div>
                    <div class="rb-action-item ${defaultTab === 'notes' ? 'active' : ''}" id="drawer-btn-notes">
                        <div class="rb-icon-btn"><svg viewBox="0 0 24 24" style="stroke-width: 2.2;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
                        <div class="rb-action-label">笔记</div>
                    </div>
                    <div class="rb-action-item" id="drawer-btn-night">
                        <div class="rb-icon-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: currentColor; stroke: none;"><path d="M12.2 22c4.53 0 8.45-2.91 9.76-7.24a1.002 1.002 0 0 0-1.25-1.25c-.78.23-1.58.35-2.38.35-4.52 0-8.2-3.68-8.2-8.2 0-.8.12-1.6.35-2.38.11-.35.01-.74-.25-1s-.64-.36-1-.25A10.17 10.17 0 0 0 2 11.8C2 17.42 6.57 22 12.2 22M8.18 4.65c-.03.34-.05.68-.05 1.02 0 5.62 4.57 10.2 10.2 10.2.34 0 .68-.02 1.02-.05C17.93 18.38 15.23 20 12.2 20 7.68 20 4 16.32 4 11.8a8.15 8.15 0 0 1 4.18-7.15"></path></svg></div>
                        <div class="rb-action-label">夜间</div>
                    </div>
                    <div class="rb-action-item" id="drawer-btn-settings">
                        <div class="rb-icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5672 14.54V9.46002C20.5665 8.72983 20.3737 8.01267 20.0083 7.38049C19.6429 6.74831 19.1176 6.22334 18.4853 5.85825L14.0819 3.30786C13.449 2.9424 12.7309 2.75 12 2.75C11.2691 2.75 10.551 2.9424 9.91805 3.30786L5.51472 5.85825C4.88235 6.22334 4.35711 6.74831 3.99169 7.38049C3.62627 8.01267 3.43352 8.72983 3.43277 9.46002V14.54C3.43352 15.2702 3.62627 15.9873 3.99169 16.6195C4.35711 17.2517 4.88235 17.7767 5.51472 18.1418L9.91805 20.6921C10.551 21.0576 11.2691 21.25 12 21.25C12.7309 21.25 13.449 21.0576 14.0819 20.6921L18.4853 18.1418C19.1176 17.7767 19.6429 17.2517 20.0083 16.6195C20.3737 15.9873 20.5665 15.2702 20.5672 14.54Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9057 8.34621H11.0944C10.7275 8.34475 10.3668 8.44026 10.0487 8.62306C9.73061 8.80586 9.46649 9.06947 9.28306 9.38718L8.37741 10.9591C8.19468 11.2756 8.09848 11.6346 8.09848 12C8.09848 12.3655 8.19468 12.7245 8.37741 13.041L9.28306 14.6129C9.46649 14.9306 9.73061 15.1942 10.0487 15.377C10.3668 15.5598 10.7275 15.6553 11.0944 15.6539H12.9057C13.2725 15.6553 13.6332 15.5598 13.9513 15.377C14.2694 15.1942 14.5335 14.9306 14.7169 14.6129L15.6226 13.041C15.8053 12.7245 15.9015 12.3655 15.9015 12C15.9015 11.6346 15.8053 11.2756 15.6226 10.9591L14.7169 9.38718C14.5335 9.06947 14.2694 8.80586 13.9513 8.62306C13.6332 8.44026 13.2725 8.34475 12.9057 8.34621Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div class="rb-action-label">设置</div>
                    </div>
                </div>
            </section>
        `;
        document.getElementById('readen-reader-container').appendChild(drawer);
        applyReaderNightMode(isNightMode, false);
        
        // 绑定事件
        drawer.querySelector('.readen-reader-chapter-backdrop').addEventListener('click', closeReaderChapterDrawer);
        const catalogList = drawer.querySelector('.readen-reader-chapter-list');
        const reverseCatalogList = () => {
            if (!catalogList) return;
            Array.from(catalogList.children).reverse().forEach(item => catalogList.appendChild(item));
        };
        if (readenCatalogReversed) reverseCatalogList();
        drawer.querySelector('[data-readen-catalog-action="search"]')?.addEventListener('click', event => {
            event.stopPropagation();
            closeReaderChapterDrawer();
            openReaderTextSearchPanel();
        });
        drawer.querySelector('[data-readen-catalog-action="sort"]')?.addEventListener('click', event => {
            event.stopPropagation();
            readenCatalogReversed = !readenCatalogReversed;
            event.currentTarget.setAttribute('aria-pressed', readenCatalogReversed ? 'true' : 'false');
            reverseCatalogList();
        });
        
        // Tab 切换逻辑
        const tabs = drawer.querySelectorAll('.drawer-tab');
        const panes = drawer.querySelectorAll('.drawer-pane');
        
        // 底部按钮联动逻辑
        const btnCatalog = drawer.querySelector('#drawer-btn-catalog');
        const btnNotes = drawer.querySelector('#drawer-btn-notes');
        const btnSettings = drawer.querySelector('#drawer-btn-settings');
        
        function switchDrawerTab(target) {
            drawer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
            drawer.querySelectorAll('.drawer-pane').forEach(p => p.classList.remove('active'));
            btnCatalog.classList.remove('active');
            btnNotes.classList.remove('active');
            
            const targetTab = drawer.querySelector(`.drawer-tab[data-target="${target}"]`);
            const targetPane = drawer.querySelector(`#drawer-pane-${target}`);
            
            if (targetTab) targetTab.classList.add('active');
            if (targetPane) targetPane.classList.add('active');
            if (target === 'catalog') btnCatalog.classList.add('active');
            if (target === 'notes') btnNotes.classList.add('active');
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => switchDrawerTab(tab.getAttribute('data-target')));
        });
        
        btnCatalog.addEventListener('click', () => switchDrawerTab('catalog'));
        btnNotes.addEventListener('click', () => switchDrawerTab('notes'));
        const btnNight = drawer.querySelector('#drawer-btn-night');
        if (btnNight) {
            btnNight.addEventListener('click', toggleNightMode);
        }
        btnSettings.addEventListener('click', () => {
            closeReaderChapterDrawer();
            openReaderFontMenu();
        });
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                drawer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
                drawer.querySelectorAll('.drawer-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const targetId = 'drawer-pane-' + tab.getAttribute('data-target');
                const targetPane = drawer.querySelector('#' + targetId);
                if (targetPane) targetPane.classList.add('active');
            });
        });

        // 章节点击逻辑
        drawer.querySelectorAll('[data-readen-reader-chapter-index]').forEach(item => {
            item.addEventListener('click', () => {
                const index = Number(item.dataset.readenReaderChapterIndex);
                closeReaderChapterDrawer();
                openReader(book.id, index);
            });
        });
        drawer.querySelectorAll('[data-annotation-id]').forEach(item => {
            item.addEventListener('click', () => {
                const annotation = (book.annotations || []).find(entry => String(entry.id) === String(item.dataset.annotationId));
                if (!annotation) return;
                openReadenBookLocation(book, getReadenAnnotationPosition(book, annotation), null, () => openReaderAnnotationDetail(annotation.id));
            });
        });
        hydrateReadenCoReaderPane(drawer, book);
    }

    function getReaderProgressPercent() {
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!wrapper) return 0;
        if (readerAnimMode === 'scroll') {
            const total = wrapper.scrollHeight - wrapper.clientHeight;
            return total > 0 ? (wrapper.scrollTop / total) * 100 : 0;
        }
        return readerTotalPages > 1 ? (readerCurrentPage / (readerTotalPages - 1)) * 100 : 0;
    }

    function getReaderStats(book) {
        if (!book.readerStats || typeof book.readerStats !== 'object') {
            book.readerStats = {};
        }
        const stats = book.readerStats;
        stats.totalMs = Math.max(0, Number(stats.totalMs) || 0);
        stats.readChars = Math.max(0, Number(stats.readChars) || 0);
        stats.totalChars = Math.max(0, Number(stats.totalChars) || 0);
        stats.fullProgress = Math.max(0, Math.min(100, Number(stats.fullProgress) || 0));
        stats.speedWpm = Math.max(0, Number(stats.speedWpm) || 0);
        stats.openCount = Math.max(0, Number(stats.openCount) || 0);
        stats.pageTurnCount = Math.max(0, Number(stats.pageTurnCount) || 0);
        stats.interruptionCount = Math.max(0, Number(stats.interruptionCount) || 0);
        stats.lastOpenedAt = Math.max(0, Number(stats.lastOpenedAt) || 0);
        stats.completedAt = Math.max(0, Number(stats.completedAt) || 0);
        stats.sessions = Array.isArray(stats.sessions)
            ? stats.sessions
                .filter(session => session && typeof session === 'object')
                .map(session => ({
                    startedAt: Number(session.startedAt) || Number(session.endedAt) || 0,
                    endedAt: Number(session.endedAt) || Number(session.startedAt) || 0,
                    durationMs: Math.max(0, Number(session.durationMs) || 0),
                    turns: Math.max(0, Number(session.turns) || 0),
                    readChars: Math.max(0, Number(session.readChars) || 0),
                    progress: Math.max(0, Math.min(100, Number(session.progress) || 0)),
                    chapterIndex: Math.max(0, Number(session.chapterIndex) || 0),
                    chapterTitle: String(session.chapterTitle || ''),
                    interrupted: Boolean(session.interrupted)
                }))
                .filter(session => session.endedAt && session.durationMs)
                .slice(-400)
            : [];
        return book.readerStats;
    }

    function countReaderTextChars(text) {
        return String(text || '').replace(/\s+/g, '').length;
    }

    function getReaderChapterCharCount(chapter) {
        if (!chapter) return 0;
        if (chapter.content) return countReaderTextChars(chapter.content);
        if (typeof chapter === 'string') return countReaderTextChars(chapter);
        return 0;
    }

    function getReaderBookCharPlan(book) {
        const chapters = getReaderChapters(book);
        const chapterCounts = chapters.map(getReaderChapterCharCount);
        const chapterTotal = chapterCounts.reduce((sum, count) => sum + count, 0);
        if (chapterTotal > 0) return { total: chapterTotal, chapterCounts };
        const fullTotal = countReaderTextChars(book?.fullText || '');
        return { total: fullTotal, chapterCounts: [] };
    }

    function getReaderWholeProgress(book, chapterPercent = getReaderProgressPercent()) {
        if (!book) return { percent: 0, readChars: 0, totalChars: 0 };
        const safeChapterPercent = Math.max(0, Math.min(100, Number(chapterPercent) || 0));
        const plan = getReaderBookCharPlan(book);
        if (!plan.total) return { percent: safeChapterPercent, readChars: 0, totalChars: 0 };
        if (!plan.chapterCounts.length) {
            const readChars = Math.round(plan.total * safeChapterPercent / 100);
            return { percent: safeChapterPercent, readChars, totalChars: plan.total };
        }
        const beforeChars = plan.chapterCounts
            .slice(0, currentReaderChapterIndex)
            .reduce((sum, count) => sum + count, 0);
        const currentChars = plan.chapterCounts[currentReaderChapterIndex] || 0;
        const readChars = Math.min(plan.total, Math.round(beforeChars + currentChars * safeChapterPercent / 100));
        return { percent: (readChars / plan.total) * 100, readChars, totalChars: plan.total };
    }

    function getLiveReaderElapsedMs(book) {
        if (!book) return 0;
        const stats = getReaderStats(book);
        const baseMs = Math.max(0, Number(stats.totalMs) || 0);
        if (!readerSessionStartedAt || readerSessionPaused) return baseMs;
        return baseMs + Math.max(0, Date.now() - readerSessionStartedAt);
    }

    // Write (or update) the record of the running session, so a killed app still keeps its reading time.
    function upsertReaderSessionRecord(book, endedAt, interrupted = false) {
        const stats = getReaderStats(book);
        const progress = Math.max(0, Math.min(100, Number(stats.fullProgress) || getReaderWholeProgress(book).percent || 0));
        const record = {
            startedAt: readerSessionBeganAt,
            endedAt,
            durationMs: readerSessionCommittedMs,
            turns: readerSessionTurnCount,
            readChars: Math.max(0, Number(stats.readChars) || 0),
            progress,
            chapterIndex: currentReaderChapterIndex,
            chapterTitle: getReaderChapterTitle(book, currentReaderChapterIndex),
            interrupted
        };
        const existingIndex = stats.sessions.findIndex(item => item && item.startedAt === readerSessionBeganAt);
        if (existingIndex >= 0) stats.sessions[existingIndex] = record;
        else stats.sessions.push(record);
        stats.sessions = stats.sessions.slice(-400);
        return progress;
    }

    // Move the elapsed time of the running session into stats without ending the session.
    function commitReaderElapsedTime() {
        const book = getCurrentReaderBook();
        if (!book || !readerSessionStartedAt || readerSessionPaused) return;
        const now = Date.now();
        const segmentMs = Math.max(0, now - readerSessionStartedAt);
        getReaderStats(book).totalMs += segmentMs;
        readerSessionCommittedMs += segmentMs;
        readerSessionStartedAt = now;
        if (readerSessionCommittedMs > 0) upsertReaderSessionRecord(book, now, false);
    }

    function pauseReaderSessionForBackground() {
        if (!readerSessionStartedAt || readerSessionPaused) return;
        commitReaderElapsedTime();
        readerSessionPaused = true;
    }

    function resumeReaderSessionFromBackground() {
        if (!readerSessionStartedAt || !readerSessionPaused) return;
        readerSessionPaused = false;
        readerSessionStartedAt = Date.now();
    }

    function startReaderStatsTimer() {
        clearInterval(readerStatsTimer);
        const book = getCurrentReaderBook();
        if (book) {
            const stats = getReaderStats(book);
            stats.openCount += 1;
            stats.lastOpenedAt = Date.now();
        }
        readerSessionStartedAt = Date.now();
        readerSessionBeganAt = readerSessionStartedAt;
        readerSessionCommittedMs = 0;
        readerSessionPaused = typeof document !== 'undefined' && document.hidden === true;
        readerSessionTurnCount = 0;
        // The ticker only refreshes the on-screen numbers; it must not postpone the progress save.
        readerStatsTimer = setInterval(() => updateReaderProgressUI(undefined, { fromTicker: true }), 1000);
    }

    function stopReaderStatsTimer(reason = 'close') {
        const book = getCurrentReaderBook();
        if (book && readerSessionStartedAt) {
            commitReaderElapsedTime();
            const endedAt = Date.now();
            const stats = getReaderStats(book);
            const progress = Math.max(0, Math.min(100, Number(stats.fullProgress) || getReaderWholeProgress(book).percent || 0));
            const interrupted = reason !== 'completed' && progress < 99 && readerSessionCommittedMs >= 6000;
            if (interrupted) stats.interruptionCount += 1;
            if (progress >= 99 && !stats.completedAt) stats.completedAt = endedAt;
            if (readerSessionCommittedMs > 0 || readerSessionTurnCount > 0) {
                upsertReaderSessionRecord(book, endedAt, interrupted);
            }
        }
        clearInterval(readerStatsTimer);
        readerStatsTimer = null;
        readerSessionStartedAt = 0;
        readerSessionBeganAt = 0;
        readerSessionCommittedMs = 0;
        readerSessionPaused = false;
        readerSessionTurnCount = 0;
    }

    function formatReaderDuration(ms) {
        const totalSeconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
        if (totalSeconds < 60) return `${totalSeconds} 秒`;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (!hours) return `${minutes} 分钟`;
        if (!minutes) return `${hours} 小时`;
        return `${hours} 小时 ${minutes} 分钟`;
    }

    function formatReadenCompactDuration(ms) {
        const seconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
        const minutes = Math.floor(seconds / 60);
        const remainSeconds = seconds % 60;
        if (minutes < 60) return `${minutes}<span class="unit">分</span> ${remainSeconds}<span class="unit">秒</span>`;
        const hours = Math.floor(minutes / 60);
        const remainMinutes = minutes % 60;
        return `${hours}<span class="unit">时</span> ${remainMinutes}<span class="unit">分</span>`;
    }

    function formatReadenClockDuration(ms) {
        const minutes = Math.floor(Math.max(0, Number(ms) || 0) / 60000);
        return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
    }

    function getReadenDayStart(value) {
        const date = value instanceof Date ? new Date(value.getTime()) : new Date(value || Date.now());
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function getReadenDateKey(value) {
        const date = getReadenDayStart(value);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function addReadenDays(date, amount) {
        const next = new Date(date.getTime());
        next.setDate(next.getDate() + amount);
        return next;
    }

    function getReadenStatsRange(mode) {
        const now = getReadenDayStart(Date.now());
        if (mode === 'day') {
            const start = addReadenDays(now, readerStatsPanelOffsets.day || 0);
            return { start, end: addReadenDays(start, 1), days: 1 };
        }
        if (mode === 'week') {
            const start = addReadenDays(now, -((now.getDay() + 6) % 7) + (readerStatsPanelOffsets.week || 0) * 7);
            return { start, end: addReadenDays(start, 7), days: 7 };
        }
        if (mode === 'month') {
            const start = new Date(now.getFullYear(), now.getMonth() + (readerStatsPanelOffsets.month || 0), 1);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            return { start, end, days: Math.round((end - start) / 86400000) };
        }
        if (mode === 'year') {
            const start = new Date(now.getFullYear() + (readerStatsPanelOffsets.year || 0), 0, 1);
            const end = new Date(start.getFullYear() + 1, 0, 1);
            return { start, end, days: Math.round((end - start) / 86400000) };
        }
        return { start: new Date(0), end: new Date(8640000000000000), days: 1 };
    }

    function formatReadenStatsRangeLabel(mode, range) {
        if (mode === 'day') return getReadenDateKey(range.start);
        if (mode === 'week') {
            const last = addReadenDays(range.end, -1);
            return `${range.start.getMonth() + 1}月${range.start.getDate()}日-${last.getMonth() + 1}月${last.getDate()}日`;
        }
        if (mode === 'month') return `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, '0')}`;
        if (mode === 'year') return `${range.start.getFullYear()}年`;
        return '全部';
    }

    function getReadenBookSessions(book) {
        const stats = getReaderStats(book);
        if (stats.sessions.length) return stats.sessions;
        const endedAt = Number(book.lastReadTime || stats.lastOpenedAt || book.importDate || book.id) || 0;
        if (!endedAt || !stats.totalMs) return [];
        return [{
            startedAt: Math.max(0, endedAt - stats.totalMs),
            endedAt,
            durationMs: stats.totalMs,
            turns: stats.pageTurnCount,
            readChars: stats.readChars,
            progress: stats.fullProgress,
            chapterIndex: Number(book.currentChapterIndex) || 0,
            chapterTitle: getReaderChapterTitle(book, Number(book.currentChapterIndex) || 0),
            interrupted: false
        }];
    }

    function getReadenActivityEntries() {
        return readenBooksData.flatMap(book => {
            const stats = getReaderStats(book);
            return getReadenBookSessions(book).map(session => ({
                ...session,
                book,
                bookId: book.id,
                bookTitle: book.title || '未命名书籍',
                durationMs: Math.max(0, Number(session.durationMs) || 0),
                turns: Math.max(0, Number(session.turns) || 0),
                readChars: Math.max(0, Number(session.readChars) || 0),
                totalBookMs: Math.max(1, Number(stats.totalMs) || 1),
                totalBookChars: Math.max(0, Number(stats.readChars) || 0)
            }));
        }).filter(entry => entry.endedAt && entry.durationMs);
    }

    function summarizeReadenEntries(entries, range) {
        const filtered = entries.filter(entry => entry.endedAt >= range.start.getTime() && entry.endedAt < range.end.getTime());
        const byBook = new Map();
        const byDay = new Map();
        const byHour = new Map();
        let totalMs = 0;
        let turns = 0;
        let interruptions = 0;
        let readChars = 0;
        filtered.forEach(entry => {
            totalMs += entry.durationMs;
            turns += entry.turns;
            interruptions += entry.interrupted ? 1 : 0;
            const proportionalChars = entry.totalBookChars ? Math.round(entry.totalBookChars * (entry.durationMs / entry.totalBookMs)) : entry.readChars;
            readChars += Math.max(0, proportionalChars);
            const dayKey = getReadenDateKey(entry.endedAt);
            byDay.set(dayKey, (byDay.get(dayKey) || 0) + entry.durationMs);
            const hour = new Date(entry.endedAt).getHours();
            byHour.set(hour, (byHour.get(hour) || 0) + entry.durationMs);
            const old = byBook.get(entry.bookId) || { book: entry.book, durationMs: 0, turns: 0, opens: 0 };
            old.durationMs += entry.durationMs;
            old.turns += entry.turns;
            old.opens += 1;
            byBook.set(entry.bookId, old);
        });
        const books = [...byBook.values()].sort((a, b) => b.durationMs - a.durationMs);
        return { entries: filtered, totalMs, turns, interruptions, readChars, byDay, byHour, books, bookCount: byBook.size, openCount: filtered.length };
    }

    function setReadenHtml(selector, value, root = document) {
        const node = root.querySelector(selector);
        if (node) node.innerHTML = value;
    }

    function setReadenText(selector, value, root = document) {
        const node = root.querySelector(selector);
        if (node) node.textContent = value;
    }

    function getReadenTopBook(summary, field = 'durationMs') {
        return [...summary.books].sort((a, b) => (b[field] || 0) - (a[field] || 0))[0] || null;
    }

    function getReadenPeakHour(summary) {
        let best = null;
        summary.byHour.forEach((value, hour) => {
            if (!best || value > best.value) best = { hour, value };
        });
        return best;
    }

    function promptSetReadingTarget() {
        const currentTarget = readenSettings.dailyTargetMinutes || 60;
        const onConfirm = (val) => {
            const minutes = parseInt(val, 10);
            if (!isNaN(minutes) && minutes > 0) {
                readenSettings.dailyTargetMinutes = minutes;
                saveReadenAppData();
                renderReadenStatisticsPanels();
                if (typeof window.showToast === 'function') window.showToast(`阅读目标已设置为 ${minutes} 分钟`);
            }
        };

        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('设定今日阅读目标', { placeholder: '输入目标时长(分钟)', value: String(currentTarget) }, '确定').then(onConfirm);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '设定今日阅读目标',
                placeholder: '输入目标时长(分钟)',
                defaultVal: String(currentTarget),
                onConfirm
            });
        }
    }

    function renderReadenHomeStats(allStats) {
        const todayRange = getReadenStatsRange('day');
        const today = summarizeReadenEntries(getReadenActivityEntries(), todayRange);

        // 1. 计算今日目标与实际完成进度
        const targetMinutes = Math.max(1, Number(readenSettings.dailyTargetMinutes) || 60);
        const todayTotalSeconds = Math.max(0, Math.floor(today.totalMs / 1000));
        const todayMinutes = Math.floor(todayTotalSeconds / 60);
        const todaySeconds = todayTotalSeconds % 60;
        const timeDisplay = `${todayMinutes}:${String(todaySeconds).padStart(2, '0')}`;

        setReadenText('#readen-home-target-current-time', timeDisplay);
        setReadenText('#readen-home-target-label', `（目标 ${targetMinutes} 分钟）`);

        // 半圆周长: 径长 95，半圆弧长 π * r ≈ 298.45
        const fullArcLength = 298.45;
        const progressRatio = Math.max(0, Math.min(1, (today.totalMs / (targetMinutes * 60000))));
        const offset = fullArcLength * (1 - progressRatio);
        const gaugeEl = document.getElementById('readen-home-gauge-progress');
        if (gaugeEl) {
            gaugeEl.style.strokeDashoffset = String(offset);
        }

        // 2. 独立沙箱 Data-URI 封装 SVG，阻断首页与书架的 SVG ID 碰撞
        const getHomeBookCoverData = (book) => {
            if (!book) return { html: '', bg: 'transparent', border: 'none', shadow: 'none' };
            const coverSource = getReadenBookCoverSource(book);
            if (coverSource) {
                return {
                    html: `<img src="${escapeReadenAttribute(coverSource)}" style="width: 100%; height: 100%; object-fit: contain; display: block;">`,
                    bg: 'transparent',
                    border: 'none',
                    shadow: 'none'
                };
            }
            const allThemes = getAllCoverThemes();
            const theme = allThemes[readenGlobalThemeIndex] || allThemes[0];
            let coverBg = '#ffffff';
            let coverBorder = '1px solid var(--divider)';
            let coverShadow = '0 2px 6px rgba(0,0,0,0.04)';
            if (theme.transparentBg) {
                coverBg = 'transparent';
                coverBorder = 'none';
                coverShadow = 'none';
            }
            let rawSvg = '';
            if (theme.svgList && theme.svgList.length > 0) {
                rawSvg = theme.svgList[book.id % theme.svgList.length];
            } else {
                rawSvg = theme.svg || '';
            }
            const safeDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawSvg)}`;
            const isolatedHtml = `<img src="${safeDataUri}" style="width: 100%; height: 100%; object-fit: contain; display: block;" alt="cover">`;
            return { html: isolatedHtml, bg: coverBg, border: coverBorder, shadow: coverShadow };
        };

        // 3. 渲染正在翻阅主卡片
        const recentBooks = [...readenBooksData]
            .filter(book => Number(book.lastReadTime) || getReaderStats(book).fullProgress)
            .sort((a, b) => (Number(b.lastReadTime) || 0) - (Number(a.lastReadTime) || 0));

        const heroBook = recentBooks[0] || readenBooksData[0] || null;
        const heroCard = document.getElementById('readen-home-hero-card');

        if (heroBook) {
            const stats = getReaderStats(heroBook);
            const chapters = getReaderChapters(heroBook);
            const chapterIndex = Number(heroBook.currentChapterIndex) || 0;
            const chapter = chapters[chapterIndex];
            const progress = Math.max(0, Math.min(100, Number(stats.fullProgress) || Number(chapter?.progress) || 0));

            setReadenText('#readen-home-hero-pct', `${progress.toFixed(1)}%`);
            setReadenText('#readen-home-hero-title', heroBook.title || '未命名书籍');
            setReadenText('#readen-home-hero-author', heroBook.author || heroBook.sourceMeta?.author || '本地导入');
            setReadenText('#readen-home-hero-chap', chapter?.title ? `读至 ${chapter.title}` : `读至第 ${chapterIndex + 1} 章`);
            setReadenText('#readen-home-hero-time', heroBook.lastReadTime ? formatReaderAnnotationTime(heroBook.lastReadTime) : '刚刚阅读');

            const barEl = document.getElementById('readen-home-hero-bar');
            if (barEl) barEl.style.width = `${progress}%`;

            const coverEl = document.getElementById('readen-home-hero-cover');
            if (coverEl) {
                const coverData = getHomeBookCoverData(heroBook);
                coverEl.innerHTML = coverData.html;
                coverEl.style.backgroundColor = coverData.bg;
                coverEl.style.border = coverData.border;
                coverEl.style.boxShadow = coverData.shadow;
            }

            if (heroCard) {
                heroCard.style.cursor = 'pointer';
                heroCard.onclick = (e) => {
                    if (e.target.closest('#readen-btn-start-reading')) return;
                    openReader(heroBook.id);
                };
            }
        } else {
            setReadenText('#readen-home-hero-pct', '0.0%');
            setReadenText('#readen-home-hero-title', '开启阅读旅程');
            setReadenText('#readen-home-hero-author', '书架暂无书籍，去导入一本吧');
            setReadenText('#readen-home-hero-chap', '去书架探索');
            const coverEl = document.getElementById('readen-home-hero-cover');
            if (coverEl) coverEl.innerHTML = '<div style="font-size:10px;color:var(--text-light);text-align:center;padding-top:36px;">暂无封面</div>';
        }

        // 4. 渲染“继续阅读”横向滚动卡片列表 (最多显示两本)
        const resumeContainer = document.getElementById('readen-home-resume-scroll');
        if (resumeContainer) {
            const allAvailableBooks = recentBooks.length ? recentBooks : readenBooksData;
            const displayBooks = allAvailableBooks.slice(0, 2);

            if (displayBooks.length > 0) {
                resumeContainer.innerHTML = displayBooks.map(book => {
                    const stats = getReaderStats(book);
                    const progress = Math.max(0, Math.min(100, Number(stats.fullProgress) || 0));
                    const coverData = getHomeBookCoverData(book);
                    const authorText = book.author || (book.sourceMeta?.author) || '作者未知';
                    const durationStr = formatReaderDuration(stats.totalMs || 0);

                    return `
                        <div class="home-resume-card" data-resume-book-id="${escapeReadenAttribute(book.id)}">
                            <div class="home-resume-cover" style="background-color: ${coverData.bg}; border: ${coverData.border}; box-shadow: ${coverData.shadow};">
                                ${coverData.html}
                            </div>
                            <div class="home-resume-body">
                                <div class="home-resume-title">${escapeReadenHtml(book.title || '未命名书籍')}</div>
                                <div class="home-resume-author">${escapeReadenHtml(authorText)}</div>
                                <div class="home-resume-progress">${progress.toFixed(1)}% · ${durationStr}</div>
                            </div>
                            <div class="home-resume-arrow">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </div>
                    `;
                }).join('');

                resumeContainer.querySelectorAll('[data-resume-book-id]').forEach(card => {
                    card.addEventListener('click', () => {
                        const bookId = Number(card.dataset.resumeBookId) || card.dataset.resumeBookId;
                        const book = readenBooksData.find(b => b.id == bookId);
                        if (book) openReader(book.id);
                    });
                });
            } else {
                resumeContainer.innerHTML = `
                    <div class="home-resume-card empty">
                        <div class="home-resume-cover empty-cover">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </div>
                        <div class="home-resume-body">
                            <div class="home-resume-title">书架空空如也</div>
                            <div class="home-resume-author">去书架导入一本喜欢的小说</div>
                            <div class="home-resume-progress">尚未开始阅读</div>
                        </div>
                    </div>
                `;
            }
        }
    }

    function renderReadenTotalStats(allStats) {
        const tab = document.getElementById('readen-tab-total');
        if (!tab) return;
        const firstTime = Math.min(...allStats.entries.map(entry => entry.endedAt).filter(Boolean));
        const knownDays = Number.isFinite(firstTime) ? Math.max(1, Math.floor((Date.now() - firstTime) / 86400000) + 1) : 0;
        setReadenText('.s-card-day .big-num', String(knownDays || 0), tab);
        const values = tab.querySelectorAll('.s-grid-2x2 .s-card-val');
        if (values[0]) values[0].innerHTML = formatReadenCompactDuration(allStats.totalMs);
        if (values[1]) values[1].innerHTML = `${readenBooksData.length}<span class="unit">文件</span>`;
        if (values[2]) values[2].innerHTML = `${allStats.turns}<span class="unit">页</span>`;
        if (values[3]) values[3].innerHTML = `${(allStats.readChars / 10000).toFixed(1)}<span class="unit">万字</span>`;
        const topBook = getReadenTopBook(allStats, 'durationMs');
        setReadenText('.s-list-item span', topBook ? `阅读时间最长的文件：${topBook.book.title || '未命名书籍'}` : '阅读时间最长的文件：暂无', tab);
        const cells = tab.querySelectorAll('.heatmap-cell');
        const entries = getReadenActivityEntries();
        const maxMs = Math.max(1, ...entries.map(entry => entry.durationMs));
        cells.forEach((cell, index) => {
            const day = addReadenDays(getReadenDayStart(Date.now()), index - cells.length + 1);
            const summary = summarizeReadenEntries(entries, { start: day, end: addReadenDays(day, 1) });
            cell.style.opacity = summary.totalMs ? String(0.25 + Math.min(0.75, summary.totalMs / maxMs)) : '0.18';
            cell.title = `${getReadenDateKey(day)} ${formatReaderDuration(summary.totalMs)}`;
        });
    }

    function renderReadenDayStats(entries) {
        const tab = document.getElementById('readen-tab-day');
        if (!tab) return;
        const range = getReadenStatsRange('day');
        const summary = summarizeReadenEntries(entries, range);
        setReadenText('.s-date-selector span', formatReadenStatsRangeLabel('day', range), tab);
        setReadenText('.s-huge-text', summary.totalMs ? formatReaderDuration(summary.totalMs) : '没！看！书！', tab);
        const colValues = tab.querySelectorAll('.s-3col-val');
        if (colValues[0]) colValues[0].textContent = summary.bookCount;
        if (colValues[1]) colValues[1].textContent = summary.turns;
        if (colValues[2]) colValues[2].textContent = summary.interruptions;
        const grayValues = tab.querySelectorAll('.s-gray-val');
        if (grayValues[0]) grayValues[0].innerHTML = `${(summary.bookCount ? summary.totalMs / summary.bookCount / 60000 : 0).toFixed(1)}<span>分钟</span>`;
        if (grayValues[1]) grayValues[1].innerHTML = `${(summary.turns ? summary.totalMs / summary.turns / 1000 : 0).toFixed(1)}<span>秒/页</span>`;
        if (grayValues[2]) grayValues[2].textContent = `${summary.totalMs ? Math.round(summary.readChars / Math.max(1, summary.totalMs / 60000)) : 0} 字/分`;
        if (grayValues[3]) grayValues[3].textContent = summary.openCount.toFixed(1);
        const listRows = tab.querySelectorAll('.s-list-box');
        const topDuration = getReadenTopBook(summary, 'durationMs');
        const topTurns = getReadenTopBook(summary, 'turns');
        const topOpens = getReadenTopBook(summary, 'opens');
        const peak = getReadenPeakHour(summary);
        const rowValues = [
            [topDuration?.book?.title || 'N/A', topDuration ? formatReaderDuration(topDuration.durationMs) : 'N/A'],
            [peak ? `${peak.hour}:00-${peak.hour + 1}:00` : 'N/A', peak ? formatReaderDuration(peak.value) : 'N/A'],
            [summary.openCount ? '有阅读记录' : 'N/A', `${summary.openCount} 次打开`],
            [topDuration?.book?.title || 'N/A', topDuration ? formatReaderDuration(topDuration.durationMs) : 'N/A'],
            [topTurns?.book?.title || 'N/A', topTurns ? `${topTurns.turns} 页` : 'N/A'],
            [topOpens?.book?.title || 'N/A', topOpens ? `${topOpens.opens} 次` : 'N/A']
        ];
        rowValues.forEach((item, index) => {
            const row = listRows[index];
            if (!row) return;
            setReadenText('.s-list-sub', item[0], row);
            setReadenText('.s-list-val', item[1], row);
        });
        const periods = [
            { label: '凌晨(0:00~6:00)', start: 0, end: 6 },
            { label: '上午(6:00~12:00)', start: 6, end: 12 },
            { label: '下午(12:00~18:00)', start: 12, end: 18 },
            { label: '晚上(18:00~24:00)', start: 18, end: 24 }
        ];
        periods.forEach((period, index) => {
            const row = listRows[6 + index];
            if (!row) return;
            let periodMs = 0;
            summary.byHour.forEach((value, hour) => {
                if (hour >= period.start && hour < period.end) periodMs += value;
            });
            const percent = summary.totalMs ? Math.round(periodMs / summary.totalMs * 100) : 0;
            setReadenHtml('.s-list-title', `${period.label} <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">${percent}%</span>`, row);
            setReadenText('.s-list-sub', periodMs ? formatReaderDuration(periodMs) : 'N/A', row);
        });
        const hourRow = listRows[10];
        if (hourRow) {
            setReadenHtml('.s-list-title', `${peak ? `${peak.hour}:00-${peak.hour + 1}:00` : '没！看！书！'} <span style="font-weight:normal; color:var(--text-main); margin-left:4px;">${summary.totalMs && peak ? Math.round(peak.value / summary.totalMs * 100) : 0}%</span>`, hourRow);
            setReadenText('.s-list-sub', peak ? formatReaderDuration(peak.value) : 'N/A', hourRow);
        }
        const cards = tab.querySelectorAll('.s-card');
        const rankingCard = cards[cards.length - 1];
        const rankingBody = rankingCard?.querySelector('div[style*="height: 20px"]');
        if (rankingBody) {
            rankingBody.style.height = 'auto';
            rankingBody.innerHTML = summary.books.length
                ? summary.books.slice(0, 99).map((item, index) => `
                    <div class="s-list-box clear-bg" style="border:none;padding:10px 0;">
                        <div class="s-list-box-left">
                            <div class="s-icon-circle">${index + 1}</div>
                            <div>
                                <div class="s-list-title">${escapeReadenHtml(item.book.title || '未命名书籍')}</div>
                                <div class="s-list-sub">${escapeReadenHtml(formatReaderDuration(item.durationMs))} · ${item.turns} 页</div>
                            </div>
                        </div>
                        <div class="s-list-val">${item.opens} 次</div>
                    </div>
                `).join('')
                : '<div class="readen-reader-chapter-empty">暂无阅读记录</div>';
        }
    }

    function renderReadenPeriodStats(mode, entries) {
        const tab = document.getElementById(`readen-tab-${mode}`);
        if (!tab) return;
        const range = getReadenStatsRange(mode);
        const summary = summarizeReadenEntries(entries, range);
        setReadenText('.s-date-selector span', formatReadenStatsRangeLabel(mode, range), tab);
        const values = tab.querySelectorAll('.s-grid-3x2 .val');
        if (values[0]) values[0].innerHTML = formatReadenCompactDuration(summary.totalMs);
        if (values[1]) values[1].textContent = summary.bookCount;
        if (values[2]) values[2].innerHTML = `${(summary.readChars / 10000).toFixed(1)}<span>万字</span>`;
        if (values[3]) values[3].textContent = summary.openCount;
        if (values[4]) values[4].innerHTML = mode === 'week' ? String(summary.turns) : `${summary.books.filter(item => getReaderStats(item.book).fullProgress >= 99).length}<span>本</span>`;
        if (values[5]) values[5].innerHTML = formatReadenCompactDuration(summary.totalMs / Math.max(1, range.days));
        const splitValues = tab.querySelectorAll('.s-split-2 .val');
        if (splitValues[0]) splitValues[0].innerHTML = formatReadenCompactDuration(summary.totalMs / Math.max(1, range.days));
        if (splitValues[1]) splitValues[1].innerHTML = formatReadenCompactDuration(summary.openCount ? summary.totalMs / summary.openCount : 0);
        if (mode === 'month') renderReadenMonthHeatmap(tab, summary, range);
        if (mode === 'year') renderReadenYearHeatmap(tab, summary, range);
    }

    function renderReadenMonthHeatmap(tab, summary, range) {
        const cells = tab.querySelectorAll('.s-calendar-grid .s-cal-cell');
        const firstWeekday = range.start.getDay();
        const days = range.days;
        cells.forEach((cell, index) => {
            const dayNumber = index - firstWeekday + 1;
            cell.classList.toggle('empty', dayNumber < 1 || dayNumber > days);
            if (dayNumber < 1 || dayNumber > days) {
                cell.innerHTML = '';
                return;
            }
            const date = new Date(range.start.getFullYear(), range.start.getMonth(), dayNumber);
            const ms = summary.byDay.get(getReadenDateKey(date)) || 0;
            cell.innerHTML = `<div class="s-cal-date">${dayNumber}</div><div class="s-cal-val">${(ms / 3600000).toFixed(1)}h</div>`;
            cell.style.opacity = ms ? String(0.45 + Math.min(0.55, ms / 3600000)) : '1';
        });
        tab.querySelectorAll('.s-mh-box').forEach((box, index) => {
            const date = new Date(range.start.getFullYear(), range.start.getMonth(), index + 1);
            const ms = index < days ? summary.byDay.get(getReadenDateKey(date)) || 0 : 0;
            box.style.opacity = ms ? String(0.25 + Math.min(0.75, ms / 3600000)) : '0.16';
        });
    }

    function renderReadenYearHeatmap(tab, summary, range) {
        const cells = tab.querySelectorAll('.s-year-cell');
        cells.forEach((cell, index) => {
            const date = addReadenDays(range.start, index);
            const active = date < range.end;
            const ms = active ? summary.byDay.get(getReadenDateKey(date)) || 0 : 0;
            cell.style.opacity = active ? (ms ? String(0.25 + Math.min(0.75, ms / 3600000)) : '0.14') : '0';
            cell.title = active ? `${getReadenDateKey(date)} ${formatReaderDuration(ms)}` : '';
        });
    }

    // Statistics are only drawn while the home or statistics page is on screen; otherwise they are
    // marked dirty and drawn when one of those pages is opened (saves work on app open and while reading).
    let readenStatisticsDirty = true;

    function isReadenStatisticsVisible() {
        const ui = document.getElementById('readenAppUI');
        if (!ui || ui.style.display === 'none') return false;
        if (document.getElementById('readen-reader-container')?.classList.contains('active')) return false;
        return Boolean(document.querySelector('#readen-page-home.active, #readen-page-stats.active'));
    }

    function renderReadenStatisticsPanels() {
        if (!document.getElementById('readenAppUI')) return;
        if (!isReadenStatisticsVisible()) {
            readenStatisticsDirty = true;
            return;
        }
        readenStatisticsDirty = false;
        const entries = getReadenActivityEntries();
        const allStats = summarizeReadenEntries(entries, { start: new Date(0), end: new Date(8640000000000000), days: 1 });
        renderReadenHomeStats(allStats);
        renderReadenTotalStats(allStats);
        renderReadenDayStats(entries);
        renderReadenPeriodStats('week', entries);
        renderReadenPeriodStats('month', entries);
        renderReadenPeriodStats('year', entries);
    }

    function scheduleReadenStatisticsRender() {
        clearTimeout(readerStatsRenderTimer);
        readerStatsRenderTimer = setTimeout(() => {
            readerStatsRenderTimer = null;
            renderReadenStatisticsPanels();
        }, 120);
    }

    function bindReadenStatsDateSelectors() {
        ['day', 'week', 'month', 'year'].forEach(mode => {
            const selector = document.querySelector(`#readen-tab-${mode} .s-date-selector`);
            if (!selector || selector.dataset.readenBound === '1') return;
            selector.dataset.readenBound = '1';
            const buttons = selector.querySelectorAll('svg');
            buttons[0]?.addEventListener('click', () => {
                readerStatsPanelOffsets[mode] -= 1;
                renderReadenStatisticsPanels();
            });
            buttons[1]?.addEventListener('click', () => {
                readerStatsPanelOffsets[mode] += 1;
                renderReadenStatisticsPanels();
            });
        });
    }

    function getReaderNoteCount(book) {
        const notes = Array.isArray(book?.notes) ? book.notes.length : 0;
        const bookmarks = Array.isArray(book?.bookmarks) ? book.bookmarks.length : 0;
        return notes + bookmarks;
    }

    function updateReaderProgressUI(percent = getReaderProgressPercent(), options = {}) {
        const fromTicker = Boolean(options && options.fromTicker);
        const slider = document.querySelector('#readen-reader-bottom-menu .rb-slider');
        const label = document.querySelector('#readen-reader-bottom-menu .rb-percent');
        const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
        const book = getCurrentReaderBook();
        const wholeProgress = getReaderWholeProgress(book, safePercent);
        const displayPercent = Math.max(0, Math.min(100, Number(wholeProgress.percent) || 0));
        if (slider) slider.value = displayPercent;
        if (label) label.textContent = `${displayPercent.toFixed(2)}%`;
        if (book) {
            const stats = getReaderStats(book);
            const elapsedMs = getLiveReaderElapsedMs(book);
            const readChars = Math.max(Number(stats.readChars) || 0, wholeProgress.readChars || 0);
            const totalChars = wholeProgress.totalChars || stats.totalChars || 0;
            const elapsedMinutes = elapsedMs / 60000;
            const speedWpm = elapsedMinutes > 0.1 ? Math.round(readChars / elapsedMinutes) : 0;
            const remainingChars = totalChars ? Math.max(0, totalChars - readChars) : 0;
            const remainingMs = speedWpm > 0 ? (remainingChars / speedWpm) * 60000 : 0;
            stats.readChars = readChars;
            stats.totalChars = totalChars;
            stats.fullProgress = displayPercent;
            stats.speedWpm = speedWpm;
            document.querySelector('#readen-reader-bottom-menu .rb-reading-time')?.replaceChildren(document.createTextNode(formatReaderDuration(elapsedMs)));
            document.querySelector('#readen-reader-bottom-menu .rb-reading-speed')?.replaceChildren(document.createTextNode(`${speedWpm} 字/分钟`));
            document.querySelector('#readen-reader-bottom-menu .rb-remaining-time')?.replaceChildren(document.createTextNode(speedWpm > 0 && remainingChars > 0 ? `剩余 ${formatReaderDuration(remainingMs)}` : '剩余 --'));
            document.querySelector('#readen-reader-bottom-menu .rb-note-count')?.replaceChildren(document.createTextNode(`${getReaderNoteCount(book)} 条`));
            // The statistics pages are not visible while reading; the ticker skips re-rendering them.
            if (!fromTicker) scheduleReadenStatisticsRender();
        }
        const chapter = getReaderChapters(book)[currentReaderChapterIndex];
        if (chapter) chapter.progress = safePercent;
        if (book) {
            book.currentChapterIndex = currentReaderChapterIndex;
            const previousPosition = book.readerPosition
                ? `${book.readerPosition.chapterKey}|${book.readerPosition.paragraphIndex}|${book.readerPosition.charOffset}|${Number(book.readerPosition.progress).toFixed(2)}`
                : '';
            updateReadenReaderPosition(book, safePercent);
            const currentPosition = book.readerPosition
                ? `${book.readerPosition.chapterKey}|${book.readerPosition.paragraphIndex}|${book.readerPosition.charOffset}|${Number(book.readerPosition.progress).toFixed(2)}`
                : '';
            // A ticker refresh only schedules a save when the reading position really moved.
            if (fromTicker && previousPosition === currentPosition) return;
            book.lastReadTime = Date.now();
            if (safePercent >= 99.5) maybePromptReadenChapterReflection(book, safePercent);
            clearTimeout(readerProgressSaveTimer);
            readerProgressSaveTimer = setTimeout(() => {
                readerProgressSaveTimer = null;
                saveReadenAppData();
            }, READEN_READER_PROGRESS_SAVE_DELAY);
        }
    }

    function flushReaderProgressSave() {
        clearTimeout(readerProgressSaveTimer);
        readerProgressSaveTimer = null;
    }

    // Called by db.js right before it saves everything when the page goes to the background.
    window.flushReadenReaderProgressSave = function() {
        if (typeof document !== 'undefined' && document.hidden) pauseReaderSessionForBackground();
        else commitReaderElapsedTime();
        flushReaderProgressSave();
    };
    function updateReaderProgress() {
        updateReaderProgressUI();
    }

    function recordReaderPageTurn() {
        const book = getCurrentReaderBook();
        if (!book || !readerSessionStartedAt) return;
        const stats = getReaderStats(book);
        stats.pageTurnCount += 1;
        readerSessionTurnCount += 1;
        scheduleReadenStatisticsRender();
    }

    function seekReaderProgress(percent, options = {}) {
        const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!wrapper) return;
        if (options.trackTurn) recordReaderPageTurn();
        if (readerAnimMode === 'scroll') {
            wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) * (safePercent / 100);
        } else {
            readerCurrentPage = readerTotalPages > 1
                ? Math.round((readerTotalPages - 1) * safePercent / 100)
                : 0;
            updateReaderPagination();
        }
        updateReaderProgressUI(safePercent);
    }

    function restoreReaderProgress(book, chapterIndex, positionOverride = undefined) {
        const chapter = getReaderChapters(book)[chapterIndex];
        const position = positionOverride === undefined ? getReadenReaderPositionSnapshot(book) : positionOverride;
        const chapterKey = getReadenReaderChapterKey(book, chapterIndex);
        const positionMatchesChapter = !position || !position.chapterKey || position.chapterKey === chapterKey
            || Number(position.chapterIndex) === Number(chapterIndex);
        const legacyProgress = Math.max(0, Math.min(100, Number(chapter?.progress) || 0));
        const saved = position && positionMatchesChapter
            ? Math.max(0, Math.min(100, Number(position.progress) || 0))
            : legacyProgress;
        setTimeout(() => {
            if (position && positionMatchesChapter && applyReadenReaderPosition(position)) return;
            seekReaderProgress(saved);
        }, 80);
    }

    function openReader(bookId, chapterIndex = null, options = {}) {
        if (!options.preserveReadenSpeech) stopReadenSpeech(true);
        const book = readenBooksData.find(b => b.id === bookId);
        if (!book) return;
        ensureReadenBookCoReadingState(book);
        ensureReadenReaderPosition(book);
        const openingPosition = getReadenReaderPositionSnapshot(book);
        const requestedPosition = options.initialPosition && typeof options.initialPosition === 'object'
            ? options.initialPosition
            : null;
        const requestedChapterIndex = chapterIndex === null || chapterIndex === undefined
            ? null
            : Number(chapterIndex);

        flushReaderProgressSave();
        if (!options.chapterTurn) finishReaderPageTurnAnimation();
        cancelAnimationFrame(readerPageTransformRaf);
        // Moving to another chapter of the same open book continues the current reading session,
        // so it is not counted as a new open or as an interruption.
        const continuesSession = Boolean(readerSessionStartedAt && readerStatsTimer && currentReaderBookId === bookId
            && document.getElementById('readen-reader-container')?.classList.contains('active'));
        if (readerSessionStartedAt && !continuesSession) stopReaderStatsTimer('switch');
        clearReadenCustomSelection(false);
        currentReaderBookId = bookId;
        currentReaderChapterIndex = resolveReadenReaderChapterIndex(book, requestedChapterIndex);
        readerCurrentPage = 0;
        if (continuesSession) commitReaderElapsedTime();
        else startReaderStatsTimer();
        closeReaderToolPanels();
        closeReaderChapterDrawer();
        const readerContent = document.getElementById('readen-reader-content');
        const readerWrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (readerContent) readerContent.style.transform = 'none';
        if (readerWrapper) readerWrapper.scrollTop = 0;
        showReadenReaderShell();
        ensureReaderPreferenceState();
        readenSettings.readerFonts.forEach(registerReaderFontFace);
        applyReaderFontById(readenSettings.readerFontId, false);
        applyReaderThemeById(readenSettings.readerThemeId, false);
        restoreReaderRuntimePreferences();

        const activeChapter = book.chapters?.[currentReaderChapterIndex];
        const waitingForOnlineContent = Boolean(book.sourceMeta?.readToken
            && !book.fullText
            && !activeChapter?.content
            && !activeChapter?.images?.length);
        const restorePosition = requestedPosition || openingPosition;
        const readerOptions = restorePosition
            ? { ...options, restorePosition }
            : options;

        if (waitingForOnlineContent) {
            readerContent.textContent = '正在准备阅读内容…';
            loadReadenOnlineBook(book, currentReaderChapterIndex, readerOptions);
        } else if (activeChapter?.images?.length) {
            renderReadenReaderPayload(book, { kind: 'manga', images: activeChapter.images });
        } else if (activeChapter?.epubBlocks?.length) {
            renderReadenReaderPayload(book, { kind:'epub', text:activeChapter.content || '', blocks:activeChapter.epubBlocks });
        } else if (activeChapter?.content) {
            renderReadenReaderPayload(book, { kind: 'novel', text: activeChapter.content });
        } else if (book.fullText) {
            renderReadenReaderPayload(book, { kind: 'novel', text: book.fullText });
        } else if (book.sourceMeta) {
            readerContent.textContent = '这本书暂时没有可显示的在线正文。';
        } else {
            readerContent.textContent = '暂无正文内容，请重新导入TXT文件。';
        }

        if (!waitingForOnlineContent) {
            window.ReadenChapterReflectionInline?.render({ book, chapterIndex: currentReaderChapterIndex, skipPagination: true });
        }
        // Turning into the next/previous chapter: put the new chapter on its first/last page now,
        // while the old page still covers the reader.
        const placedForChapterTurn = Boolean(options.chapterTurn && !waitingForOnlineContent && readerAnimMode !== 'scroll');
        if (placedForChapterTurn) {
            updateReaderPagination();
            readerCurrentPage = Number(options.initialProgress) >= 100 ? readerTotalPages - 1 : 0;
            setReaderPageTransformNow();
            updateReaderProgressUI();
        }

        updateReaderChapterNav();
        book.lastReadTime = Date.now();
        saveReadenAppData();
        renderBookList();
        setTimeout(() => {
            updateReaderPagination();
            if (placedForChapterTurn) return;
            if (Number.isFinite(options.initialProgress)) {
                seekReaderProgress(options.initialProgress);
            } else if (!waitingForOnlineContent) {
                restoreReaderProgress(book, currentReaderChapterIndex, requestedPosition || openingPosition);
            }
        }, 100);
        return placedForChapterTurn;
    }
    function closeReader() {
        finishReaderPageTurnAnimation();
        flushReaderProgressSave();
        stopReaderStatsTimer();
        saveReadenAppData();
        scheduleReadenStatisticsRender();
        clearReadenCustomSelection(false);
        closeReaderChromeMenus();
        stopReadenSpeech(true);
        document.getElementById('readen-reader-container').classList.remove('active');
        const bottomNav = document.getElementById('readen-bottom-nav');
        if (bottomNav) bottomNav.style.display = 'flex';
    }

    function toggleReaderMenu() {
        const topMenu = document.getElementById('readen-reader-top-menu');
        const bottomMenu = document.getElementById('readen-reader-bottom-menu');
        const pageModeSwitch = document.getElementById('readen-reader-page-mode-switch');
        const fontMenu = document.getElementById('readen-reader-font-menu');

        if (
            document.querySelector('.reader-tool-panel.active') ||
            fontMenu?.classList.contains('show') ||
            topMenu?.classList.contains('show') ||
            bottomMenu?.classList.contains('show') ||
            pageModeSwitch?.classList.contains('show')
        ) {
            closeReaderChromeMenus();
            return;
        }

        topMenu?.classList.add('show');
        bottomMenu?.classList.add('show');
        pageModeSwitch?.classList.add('show');
        updateReaderProgressUI();
    }

    function openReaderFontMenu() {
        ensureReaderPreferenceState();
        readenSettings.readerFonts.forEach(registerReaderFontFace);
        showReaderFontMainView();
        renderReaderFontPanel();
        renderReaderThemeStrip();
        applyReaderFontById(readenSettings.readerFontId, false);
        applyReaderThemeById(readenSettings.readerThemeId, false);
        changeReaderFontSize(readerFontSize, true, false);
        changeReaderBrightness(readerBrightness, true, false);
        changeReaderSpacing(readenSettings.readerSpacing, false);
        openReaderToolPanel('readen-reader-font-panel');
    }

    function handleReaderPageTap(clientX) {
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!wrapper) return;
        const topMenu = document.getElementById('readen-reader-top-menu');
        const bottomMenu = document.getElementById('readen-reader-bottom-menu');
        const pageModeSwitch = document.getElementById('readen-reader-page-mode-switch');
        if (
            topMenu?.classList.contains('show') ||
            bottomMenu?.classList.contains('show') ||
            pageModeSwitch?.classList.contains('show')
        ) {
            closeReaderChromeMenus();
            return;
        }
        const rect = wrapper.getBoundingClientRect();
        const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
        if (ratio < 0.32) {
            readerPrevPage();
        } else if (ratio > 0.68) {
            readerNextPage();
        } else {
            toggleReaderMenu();
        }
    }

    // Ends a running page-turn animation at once (its final page stays), e.g. when the next tap
    // comes in before it is over.
    function finishReaderPageTurnAnimation() {
        const animation = readerPageTurnAnimation;
        if (animation) animation.finish();
        readerPageTurnAnimation = null;
        readerPageTurnLocked = false;
        document.getElementById('readen-page-turn-layer')?.remove();
    }

    function applyReaderPageModeClasses() {
        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!content || !wrapper) return;
        content.classList.remove('paged-mode', 'scroll-mode', 'anim-shift', 'anim-curl', 'readen-page-dragging');
        wrapper.classList.remove('scroll-mode');
        if (readerAnimMode === 'scroll') {
            finishReaderPageTurnAnimation();
            content.classList.add('scroll-mode');
            wrapper.classList.add('scroll-mode');
            content.style.transform = 'none';
            return;
        }
        content.classList.add('paged-mode', `anim-${readerAnimMode}`);
    }

    function syncReaderPageTransform({ immediate = false } = {}) {
        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!content || !wrapper || readerAnimMode === 'scroll') return;
        const wrapperWidth = Math.max(1, wrapper.clientWidth);
        const x = -(readerCurrentPage * wrapperWidth);

        cancelAnimationFrame(readerPageTransformRaf);
        if (immediate) content.classList.add('readen-page-transform-instant');
        readerPageTransformRaf = requestAnimationFrame(() => {
            content.style.transform = `translate3d(${x}px, 0, 0)`;
            if (immediate) {
                requestAnimationFrame(() => content.classList.remove('readen-page-transform-instant'));
            }
        });
    }

    // Moves the text to readerCurrentPage in this frame, without the CSS slide.
    function setReaderPageTransformNow() {
        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!content || !wrapper || readerAnimMode === 'scroll') return;
        cancelAnimationFrame(readerPageTransformRaf);
        const x = -(readerCurrentPage * Math.max(1, wrapper.clientWidth));
        content.classList.add('readen-page-transform-instant');
        content.style.transform = `translate3d(${x}px, 0, 0)`;
        void content.offsetWidth; // apply the new position before the transition comes back
        content.classList.remove('readen-page-transform-instant');
    }

    function getReaderPageBackground(wrapper) {
        let element = wrapper;
        while (element && element !== document.body) {
            const style = getComputedStyle(element);
            const color = style.backgroundColor;
            const hasColor = color && color !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(color);
            if (hasColor || (style.backgroundImage && style.backgroundImage !== 'none')) {
                return { color: hasColor ? color : '#ffffff', image: style.backgroundImage, size: style.backgroundSize, position: style.backgroundPosition, repeat: style.backgroundRepeat };
            }
            element = element.parentElement;
        }
        return { color: '#ffffff', image: 'none', size: 'auto', position: '0% 0%', repeat: 'repeat' };
    }

    function applyReaderPageBackground(element, background) {
        element.style.backgroundColor = background.color;
        if (background.image && background.image !== 'none') {
            element.style.backgroundImage = background.image;
            element.style.backgroundSize = background.size;
            element.style.backgroundPosition = background.position;
            element.style.backgroundRepeat = background.repeat;
        }
    }

    // DOM range over [startOffset, endOffset) of an element's text.
    function createReadenTextRange(element, startOffset, endOffset) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        let consumed = 0;
        let startSet = false;
        let lastNode = null;
        let node = walker.nextNode();
        while (node) {
            const length = node.nodeValue.length;
            if (!startSet && startOffset <= consumed + length) {
                range.setStart(node, startOffset - consumed);
                startSet = true;
            }
            if (startSet && endOffset <= consumed + length) {
                range.setEnd(node, endOffset - consumed);
                return range;
            }
            consumed += length;
            lastNode = node;
            node = walker.nextNode();
        }
        if (!startSet || !lastNode) return null;
        range.setEnd(lastNode, lastNode.nodeValue.length);
        return range;
    }

    // First character of a paragraph that sits on targetPage or later.
    function findReadenParagraphFirstCharOnPage(element, targetPage, pageOf) {
        let low = 0;
        let high = String(element.textContent || '').length;
        while (low < high) {
            const middle = (low + high) >> 1;
            const page = getReadenParagraphCharPage(element, middle, pageOf);
            if (page === null || page < targetPage) low = middle + 1;
            else high = middle;
        }
        return low;
    }

    const READEN_SNAPSHOT_TEXT_PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'color', 'textAlign', 'textIndent', 'whiteSpace', 'wordBreak', 'overflowWrap'];

    // A still copy of one page of the current chapter, used by the page-turn animations.
    // Only what is on that page is copied (a TXT chapter is often a single huge paragraph), so it
    // stays cheap even for long chapters.
    function buildReaderPageSnapshot(pageIndex) {
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        const content = document.getElementById('readen-reader-content');
        if (!wrapper || !content) return null;
        const width = Math.max(1, wrapper.clientWidth);
        const height = Math.max(1, wrapper.clientHeight);
        const wrapperRect = wrapper.getBoundingClientRect();
        const pageOf = createReadenPagedPageLocator(wrapper, content);
        const pageLeft = wrapperRect.left + getReadenContentTranslateX(content) + pageIndex * width;

        const snapshot = document.createElement('div');
        snapshot.className = 'readen-page-snapshot';
        snapshot.style.width = `${width}px`;
        snapshot.style.height = `${height}px`;
        applyReaderPageBackground(snapshot, getReaderPageBackground(wrapper));
        // Shallow copy keeps the reader's font settings and class-based text styles.
        const sheet = content.cloneNode(false);
        sheet.removeAttribute('id');
        sheet.className = 'reader-content readen-page-snapshot-text';
        sheet.style.transform = 'none';
        snapshot.appendChild(sheet);

        for (const child of content.children) {
            const box = child.getBoundingClientRect();
            if (box.width < 1 && box.height < 1) continue;
            const firstPage = pageOf(box);
            if (firstPage > pageIndex) break;
            const lastPage = pageOf({ left: box.right - 1 });
            if (lastPage < pageIndex) continue;
            const rects = Array.from(child.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
            const heightBefore = rects.filter(rect => pageOf(rect) < pageIndex).reduce((sum, rect) => sum + rect.height, 0);
            const computed = getComputedStyle(child);
            rects.filter(rect => pageOf(rect) === pageIndex).forEach(rect => {
                const clip = document.createElement('div');
                clip.className = 'readen-page-snapshot-clip';
                clip.style.left = `${rect.left - pageLeft}px`;
                clip.style.top = `${rect.top - wrapperRect.top}px`;
                clip.style.width = `${rect.width}px`;
                clip.style.height = `${rect.height}px`;
                let copy;
                let startsMidway = false;
                if (child.classList.contains('readen-reader-paragraph') && (firstPage < pageIndex || lastPage > pageIndex)) {
                    // Copy only this page's lines: from the first character on the page to a little
                    // past the page end (so the last line is still justified like the original).
                    const text = String(child.textContent || '');
                    let start = firstPage < pageIndex ? findReadenParagraphFirstCharOnPage(child, pageIndex, pageOf) : 0;
                    while (start > 0 && start < text.length && text[start] === '\n') start += 1;
                    const end = lastPage > pageIndex
                        ? Math.min(text.length, findReadenParagraphFirstCharOnPage(child, pageIndex + 1, pageOf) + 80)
                        : text.length;
                    copy = child.cloneNode(false);
                    const range = createReadenTextRange(child, start, Math.max(start, end));
                    if (range) copy.appendChild(range.cloneContents());
                    startsMidway = start > 0;
                } else {
                    copy = child.cloneNode(true);
                }
                copy.removeAttribute('id');
                copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
                READEN_SNAPSHOT_TEXT_PROPS.forEach(prop => { copy.style[prop] = computed[prop]; });
                copy.style.margin = '0';
                copy.style.width = `${rect.width}px`;
                copy.style.maxWidth = 'none';
                copy.style.boxSizing = 'border-box';
                if (startsMidway) {
                    copy.style.textIndent = '0';
                    copy.style.paddingTop = '0';
                    copy.style.borderTopWidth = '0';
                } else if (heightBefore) {
                    // A block that started on an earlier page: shift it up by the part already shown.
                    copy.style.marginTop = `${-heightBefore}px`;
                }
                clip.appendChild(copy);
                sheet.appendChild(clip);
            });
        }
        return snapshot;
    }

    function ensureReaderPageTurnLayer() {
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!wrapper) return null;
        document.getElementById('readen-page-turn-layer')?.remove();
        const layer = document.createElement('div');
        layer.id = 'readen-page-turn-layer';
        layer.className = 'readen-page-turn-layer';
        layer.setAttribute('aria-hidden', 'true');
        wrapper.appendChild(layer);
        return layer;
    }

    // Part of the page rectangle on one side of the fold line (side 1: the side the normal points to).
    function clipReadenPageByLine(width, height, mx, my, nx, ny, side) {
        const corners = [[0, 0], [width, 0], [width, height], [0, height]];
        const points = [];
        for (let index = 0; index < 4; index += 1) {
            const a = corners[index];
            const b = corners[(index + 1) % 4];
            const da = side * ((a[0] - mx) * nx + (a[1] - my) * ny);
            const db = side * ((b[0] - mx) * nx + (b[1] - my) * ny);
            if (da >= 0) points.push(a);
            if ((da >= 0) !== (db >= 0)) {
                const t = da / (da - db);
                points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
            }
        }
        return points;
    }

    function readenPolygonCss(points) {
        if (points.length < 3) return 'polygon(0px 0px, 0px 0px, 0px 0px)';
        return `polygon(${points.map(point => `${point[0].toFixed(1)}px ${point[1].toFixed(1)}px`).join(', ')})`;
    }

    // Simulated page curl. sheet = the page that is lifted away (or laid back down), lower = what
    // shows under it (null means the live text). progress 0: sheet lies flat; 1: fully turned over.
    function createReaderCurlScene(layer, sheet, lower) {
        const width = Math.max(1, layer.clientWidth);
        const height = Math.max(1, layer.clientHeight);
        const night = Boolean(document.getElementById('readenAppUI')?.classList.contains('readen-night-mode'));
        if (lower) layer.appendChild(lower);
        const lowerShadow = document.createElement('div');
        lowerShadow.className = 'readen-page-curl-part';
        const back = sheet.cloneNode(true);
        back.classList.add('readen-page-curl-back');
        const paper = document.createElement('div');
        paper.className = 'readen-page-curl-paper';
        paper.style.backgroundColor = sheet.style.backgroundColor;
        const shade = document.createElement('div');
        shade.className = 'readen-page-curl-shade';
        back.append(paper, shade);
        sheet.classList.add('readen-page-curl-front');
        layer.append(lowerShadow, sheet, back);

        // Gradient stop position (px) of the fold line for a page-sized box and a CSS angle.
        const gradientOffset = (angle, mx, my) => {
            const dx = Math.sin(angle);
            const dy = -Math.cos(angle);
            const length = Math.abs(width * dx) + Math.abs(height * dy);
            return (mx - width / 2) * dx + (my - height / 2) * dy + length / 2;
        };

        return {
            render(progress) {
                const p = Math.max(0, Math.min(1, progress));
                if (p <= 0.001) {
                    sheet.style.clipPath = 'none';
                    back.style.visibility = 'hidden';
                    lowerShadow.style.visibility = 'hidden';
                    return;
                }
                // The bottom-right corner travels to the far left along a low arc; the fold is the
                // perpendicular bisector between where the corner was and where it is now.
                const cornerX = width - 2 * width * p;
                const cornerY = height - height * 0.24 * Math.sin(Math.PI * p);
                const mx = (width + cornerX) / 2;
                const my = (height + cornerY) / 2;
                let nx = width - cornerX;
                let ny = height - cornerY;
                const norm = Math.hypot(nx, ny) || 1;
                nx /= norm;
                ny /= norm;

                const lifted = clipReadenPageByLine(width, height, mx, my, nx, ny, 1);
                const kept = clipReadenPageByLine(width, height, mx, my, nx, ny, -1);
                const liftedCss = readenPolygonCss(lifted);
                const span = Math.max(1, ...lifted.map(point => (point[0] - mx) * nx + (point[1] - my) * ny));
                const angle = Math.atan2(nx, -ny);
                const angleDeg = angle * 180 / Math.PI;
                const offset = gradientOffset(angle, mx, my);
                const strength = Math.sin(Math.PI * Math.min(1, p * 1.15));

                sheet.style.clipPath = readenPolygonCss(kept);

                // Back of the lifted part, mirrored across the fold.
                const normalAngle = Math.atan2(ny, nx);
                back.style.visibility = 'visible';
                back.style.clipPath = liftedCss;
                back.style.transform = `translate(${mx}px, ${my}px) rotate(${normalAngle}rad) scaleX(-1) rotate(${-normalAngle}rad) translate(${-mx}px, ${-my}px)`;
                const light = night ? 0.06 : 0.24;
                shade.style.backgroundImage = `linear-gradient(${angleDeg}deg, rgba(0,0,0,0) ${offset}px, rgba(0,0,0,${night ? 0.26 : 0.16}) ${offset}px, rgba(255,255,255,${light}) ${offset + span * 0.32}px, rgba(0,0,0,${night ? 0.18 : 0.08}) ${offset + span}px)`;

                // Shadow the curled page throws on the page underneath, along the fold.
                const spread = 18 + 46 * strength;
                lowerShadow.style.visibility = 'visible';
                lowerShadow.style.clipPath = liftedCss;
                lowerShadow.style.backgroundImage = `linear-gradient(${angleDeg}deg, rgba(0,0,0,0) ${offset}px, rgba(0,0,0,${((night ? 0.5 : 0.3) * strength).toFixed(3)}) ${offset}px, rgba(0,0,0,0) ${offset + spread}px)`;
            }
        };
    }

    const READEN_PAGE_CURL_MS = 460;
    const READEN_CHAPTER_SLIDE_MS = 260;

    function easeReaderPageTurn(t) {
        return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 2.4);
    }

    // Runs a curl from `from` to `to` progress, then calls onEnd (which puts the text on its final page).
    function runReaderCurl(scene, from, to, onEnd) {
        const startedAt = performance.now();
        let frame = 0;
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            cancelAnimationFrame(frame);
            onEnd();
            document.getElementById('readen-page-turn-layer')?.remove();
            readerPageTurnAnimation = null;
            readerPageTurnLocked = false;
        };
        const step = now => {
            const t = (now - startedAt) / READEN_PAGE_CURL_MS;
            if (t >= 1) {
                finish();
                return;
            }
            scene.render(from + (to - from) * easeReaderPageTurn(t));
            frame = requestAnimationFrame(step);
        };
        scene.render(from);
        readerPageTurnLocked = true;
        readerPageTurnAnimation = { finish };
        frame = requestAnimationFrame(step);
    }

    function animateReaderCurl(direction, targetPage) {
        finishReaderPageTurnAnimation();
        const layer = ensureReaderPageTurnLayer();
        const sheet = layer ? buildReaderPageSnapshot(direction > 0 ? readerCurrentPage : targetPage) : null;
        if (!layer || !sheet) {
            layer?.remove();
            readerCurrentPage = targetPage;
            syncReaderPageTransform();
            updateReaderProgressUI();
            return;
        }
        const scene = createReaderCurlScene(layer, sheet, null);
        if (direction > 0) {
            // The copy of this page peels away and the real next page is already underneath.
            readerCurrentPage = targetPage;
            setReaderPageTransformNow();
            updateReaderProgressUI();
            runReaderCurl(scene, 0, 1, () => {});
        } else {
            // The previous page is laid back down over this one, then becomes the real text.
            runReaderCurl(scene, 1, 0, () => {
                readerCurrentPage = targetPage;
                setReaderPageTransformNow();
                updateReaderProgressUI();
            });
        }
    }

    // Before switching chapters: cover the reader with a copy of the current page, so the new
    // chapter can be laid out and put on its first (or last) page out of sight.
    function prepareReaderChapterTurn(direction) {
        if (readerAnimMode === 'scroll') return null;
        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!content || !wrapper) return null;
        const width = Math.max(1, wrapper.clientWidth);
        // Where the old page is right now (a drag may have moved it a little).
        const dragOffset = getReadenContentTranslateX(content) + readerCurrentPage * width;
        const oldPage = buildReaderPageSnapshot(readerCurrentPage);
        if (!oldPage) return null;
        const layer = ensureReaderPageTurnLayer();
        if (!layer) return null;
        if (readerAnimMode === 'shift' && Math.abs(dragOffset) > 0.5) oldPage.style.transform = `translate3d(${dragOffset}px, 0, 0)`;
        layer.appendChild(oldPage);
        readerPageTurnLocked = true;
        return {
            start(positioned) {
                readerPageTurnLocked = false;
                if (!positioned || !layer.isConnected) {
                    layer.remove();
                    return;
                }
                if (readerAnimMode === 'curl') {
                    if (direction > 0) {
                        runReaderCurl(createReaderCurlScene(layer, oldPage, null), 0, 1, () => {});
                    } else {
                        // New chapter's last page comes down over the old page.
                        oldPage.remove();
                        const newPage = buildReaderPageSnapshot(readerCurrentPage);
                        if (!newPage) {
                            layer.remove();
                            return;
                        }
                        runReaderCurl(createReaderCurlScene(layer, newPage, oldPage), 1, 0, () => {});
                    }
                    return;
                }
                // Slide: the old page leaves while the new chapter comes in from the other side.
                const x = -(readerCurrentPage * width);
                const options = { duration: READEN_CHAPTER_SLIDE_MS, easing: 'cubic-bezier(.22, .78, .2, 1)' };
                let done = false;
                const pageOut = oldPage.animate([
                    { transform: `translate3d(${dragOffset}px, 0, 0)` },
                    { transform: `translate3d(${-direction * width}px, 0, 0)` }
                ], options);
                const textIn = content.animate([
                    { transform: `translate3d(${x + direction * width + dragOffset}px, 0, 0)` },
                    { transform: `translate3d(${x}px, 0, 0)` }
                ], options);
                const finish = () => {
                    if (done) return;
                    done = true;
                    pageOut.cancel();
                    textIn.cancel();
                    layer.remove();
                    readerPageTurnAnimation = null;
                    readerPageTurnLocked = false;
                };
                readerPageTurnLocked = true;
                readerPageTurnAnimation = { finish };
                textIn.onfinish = finish;
            }
        };
    }

    function turnReaderPaged(direction) {
        if (readerPageTurnLocked) return false;
        const targetPage = readerCurrentPage + direction;
        if (targetPage < 0 || targetPage >= readerTotalPages) return false;

        recordReaderPageTurn();
        if (readerAnimMode === 'curl') {
            animateReaderCurl(direction, targetPage);
        } else {
            readerCurrentPage = targetPage;
            syncReaderPageTransform();
            updateReaderProgressUI();
        }
        return true;
    }

    function updateReaderPagination() {
        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (!content || !wrapper) return;
        applyReaderPageModeClasses();
        if (readerAnimMode === 'scroll') {
            content.style.transform = 'none';
            readerTotalPages = 1;
            updateReaderProgressUI();
            return;
        }

        const wrapperWidth = Math.max(1, wrapper.clientWidth);
        wrapper.scrollTop = 0;
        readerTotalPages = Math.max(1, Math.ceil(content.scrollWidth / wrapperWidth));
        if (readerCurrentPage >= readerTotalPages) readerCurrentPage = readerTotalPages - 1;
        if (readerCurrentPage < 0) readerCurrentPage = 0;

        syncReaderPageTransform({ immediate: true });
        updateReaderProgressUI();
    }

    function readerPrevPage() {
        finishReaderPageTurnAnimation();
        if (readerAnimMode === 'scroll') {
            const wrapper = document.getElementById('readen-reader-scroll-wrapper');
            if (!wrapper) return;
            if (wrapper.scrollTop <= 4 && hasReaderChapter(-1)) {
                changeReaderChapter(-1);
                return;
            }
            wrapper.scrollBy({ top: -Math.max(120, wrapper.clientHeight * 0.92), behavior: 'smooth' });
            recordReaderPageTurn();
            setTimeout(updateReaderProgressUI, 220);
            return;
        }
        if (turnReaderPaged(-1)) return;
        if (readerCurrentPage <= 0 && hasReaderChapter(-1)) changeReaderChapter(-1);
        else syncReaderPageTransform();
    }

    function readerNextPage() {
        finishReaderPageTurnAnimation();
        if (readerAnimMode === 'scroll') {
            const wrapper = document.getElementById('readen-reader-scroll-wrapper');
            if (!wrapper) return;
            const scrollableDistance = wrapper.scrollHeight - wrapper.clientHeight;
            const remainingScroll = scrollableDistance - wrapper.scrollTop;
            if (remainingScroll <= 4 && hasReaderChapter(1)) {
                changeReaderChapter(1);
                return;
            }
            if (scrollableDistance <= 4 && hasReaderChapter(1)) {
                changeReaderChapter(1);
                return;
            }
            wrapper.scrollBy({ top: Math.max(120, wrapper.clientHeight * 0.92), behavior: 'smooth' });
            recordReaderPageTurn();
            setTimeout(updateReaderProgressUI, 220);
            return;
        }
        if (turnReaderPaged(1)) return;
        if (readerCurrentPage >= readerTotalPages - 1 && hasReaderChapter(1)) changeReaderChapter(1);
        else syncReaderPageTransform();
    }

    // 动态计算滑块圆圈位置，让文字跟随圆圈移动
    function updateSliderThumbText(slider, textEl, valText) {
        if (!slider || !textEl) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const percent = (val - min) / (max - min);
        // 圆圈宽度为 36px，计算圆心位置
        textEl.style.left = `calc(18px + ${percent} * (100% - 36px))`;
        textEl.textContent = valText;
    }

    function changeReaderFontSize(val, isAbsolute = false, shouldSave = true) {
        const numericValue = parseInt(val);
        if (!Number.isFinite(numericValue)) return;
        readerFontSize = isAbsolute ? numericValue : readerFontSize + numericValue;
        readerFontSize = Math.max(12, Math.min(36, readerFontSize));

        const slider = document.getElementById('readen-rf-size-slider');
        if (slider) {
            slider.value = readerFontSize;
            updateSliderThumbText(slider, document.getElementById('readen-rf-size-text'), readerFontSize.toFixed(1));
        }
        const liveSlider = document.getElementById('readen-rf-size-slider-live');
        if (liveSlider) {
            liveSlider.value = readerFontSize;
            updateSliderThumbText(liveSlider, document.getElementById('readen-rf-size-text-live'), readerFontSize.toFixed(1));
        }
        const readerContent = document.getElementById('readen-reader-content');
        if (readerContent) readerContent.style.fontSize = readerFontSize + 'px';

        ensureReaderPreferenceState();
        readenSettings.readerFontSize = readerFontSize;
        if (shouldSave) scheduleReaderPreferenceSave();
        setTimeout(updateReaderPagination, 100);
    }

    function changeReaderBrightness(val, isAbsolute = false, shouldSave = true) {
        const numericValue = parseInt(val);
        if (!Number.isFinite(numericValue)) return;
        readerBrightness = isAbsolute ? numericValue : readerBrightness + numericValue;
        readerBrightness = Math.max(20, Math.min(100, readerBrightness));

        const slider = document.getElementById('readen-rf-bright-slider');
        if (slider) {
            slider.value = readerBrightness;
            updateSliderThumbText(slider, document.getElementById('readen-rf-bright-text'), readerBrightness);
        }
        const liveSlider = document.getElementById('readen-rf-bright-slider-live');
        if (liveSlider) {
            liveSlider.value = readerBrightness;
            updateSliderThumbText(liveSlider, document.getElementById('readen-rf-bright-text-live'), readerBrightness);
        }
        const overlay = document.getElementById('readen-reader-brightness-overlay');
        if (overlay) {
            const opacity = (100 - readerBrightness) / 100;
            overlay.style.background = `rgba(0,0,0,${opacity})`;
        }

        ensureReaderPreferenceState();
        readenSettings.readerBrightness = readerBrightness;
        if (shouldSave) scheduleReaderPreferenceSave();
    }

    // 真实间距排版逻辑
    function changeReaderSpacing(val, shouldSave = true) {
        const content = document.getElementById('readen-reader-content');
        const slider = document.getElementById('readen-rf-spacing-slider');
        const textEl = document.getElementById('readen-rf-spacing-text');
        const spacingValue = Math.max(1, Math.min(3, Number(val) || 2));

        let lineH = 1.8;
        let letterS = 1;
        let text = '中';
        if (spacingValue === 1) { lineH = 1.5; letterS = 0; text = '紧'; }
        else if (spacingValue === 3) { lineH = 2.2; letterS = 2; text = '松'; }

        if (content) {
            content.style.lineHeight = lineH;
            content.style.letterSpacing = letterS + 'px';
        }
        if (slider) {
            slider.value = spacingValue;
            updateSliderThumbText(slider, textEl, text);
        }
        const liveSlider = document.getElementById('readen-rf-spacing-slider-live');
        if (liveSlider) {
            liveSlider.value = spacingValue;
            updateSliderThumbText(liveSlider, document.getElementById('readen-rf-spacing-text-live'), text);
        }

        ensureReaderPreferenceState();
        readenSettings.readerSpacing = spacingValue;
        if (shouldSave) scheduleReaderPreferenceSave();
        setTimeout(updateReaderPagination, 100);
    }

    // 真实夜间模式逻辑
    let isNightMode = false;

    function applyReaderNightMode(enabled, shouldSave = true) {
        isNightMode = Boolean(enabled);
        const container = document.getElementById('readenAppUI');
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: currentColor; stroke: none;"><path d="M12.2 22c4.53 0 8.45-2.91 9.76-7.24a1.002 1.002 0 0 0-1.25-1.25c-.78.23-1.58.35-2.38.35-4.52 0-8.2-3.68-8.2-8.2 0-.8.12-1.6.35-2.38.11-.35.01-.74-.25-1s-.64-.36-1-.25A10.17 10.17 0 0 0 2 11.8C2 17.42 6.57 22 12.2 22M8.18 4.65c-.03.34-.05.68-.05 1.02 0 5.62 4.57 10.2 10.2 10.2.34 0 .68-.02 1.02-.05C17.93 18.38 15.23 20 12.2 20 7.68 20 4 16.32 4 11.8a8.15 8.15 0 0 1 4.18-7.15"></path></svg>`;

        container?.classList.toggle('readen-night-mode', isNightMode);
        const updateNightBtn = (btnEl) => {
            if (!btnEl) return;
            const label = btnEl.querySelector('.rb-action-label');
            const iconContainer = btnEl.querySelector('.rb-icon-btn');
            if (label) label.textContent = isNightMode ? '日间' : '夜间';
            if (iconContainer) iconContainer.innerHTML = isNightMode ? sunIcon : moonIcon;
        };
        updateNightBtn(document.getElementById('readen-reader-night-btn'));
        updateNightBtn(document.getElementById('drawer-btn-night'));

        ensureReaderPreferenceState();
        readenSettings.readerNightMode = isNightMode;
        if (shouldSave) scheduleReaderPreferenceSave();
    }

    function toggleNightMode() {
        applyReaderNightMode(!isNightMode);
    }

    function openAnimModal() {
        closeReaderChromeMenus();
        document.getElementById('readen-anim-modal-overlay').classList.add('active');
    }

    function closeAnimModal() {
        document.getElementById('readen-anim-modal-overlay').classList.remove('active');
    }

    function selectAnimMode(mode, shouldSave = true) {
        const nextMode = ['shift', 'curl', 'scroll'].includes(mode) ? mode : 'shift';
        const previousMode = readerAnimMode;
        readerAnimMode = nextMode;
        const modeNames = { 'shift': '平滑', 'curl': '仿真', 'scroll': '滚动' };
        const labelHtml = `${modeNames[nextMode]} <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

        const animValue = document.getElementById('readen-rf-anim-val');
        if (animValue) animValue.innerHTML = labelHtml;
        const liveAnimBtn = document.getElementById('readen-rf-anim-val-live');
        if (liveAnimBtn) liveAnimBtn.innerHTML = labelHtml;
        const pageModeBtn = document.getElementById('readen-reader-page-mode-btn');
        if (pageModeBtn) pageModeBtn.innerHTML = labelHtml;

        ensureReaderPreferenceState();
        readenSettings.readerAnimMode = nextMode;
        if (shouldSave) scheduleReaderPreferenceSave();

        const content = document.getElementById('readen-reader-content');
        const wrapper = document.getElementById('readen-reader-scroll-wrapper');
        if (content && wrapper) {
            wrapper.scrollTop = 0;
            // Opening a chapter re-applies the same mode; only a real mode change stops a page turn.
            if (previousMode !== nextMode) finishReaderPageTurnAnimation();
            applyReaderPageModeClasses();
            if (readerAnimMode === 'scroll') {
                updateReaderProgressUI();
            } else {
                requestAnimationFrame(updateReaderPagination);
            }
        }
        closeAnimModal();
    }

    function getAllCoverThemes() {
        return [...defaultCoverThemes, ...readenCoverThemes];
    }

    function renderReadenProfileAvatar(element, avatarUrl) {
        if (!element) return;
        element.style.backgroundColor = '#d5d5d5';
        element.style.backgroundImage = avatarUrl ? `url(${JSON.stringify(avatarUrl)})` : 'none';
        element.style.setProperty('background-size', 'contain', 'important');
        element.style.setProperty('background-position', 'center center', 'important');
        element.style.setProperty('background-repeat', 'no-repeat', 'important');
    }

    function renderReadenProfileEditorPreview() {
        ensureReadenProfileState();
        const preview = document.getElementById('readen-profile-avatar-preview');
        const nameInput = document.getElementById('readen-profile-name-input');
        const signPreview = document.getElementById('readen-profile-sign-preview');
        const draft = readenProfileDraft || {
            name: getReadenProfileDisplayName(),
            avatar: getReadenProfileAvatar(),
            sign: getReadenProfileSign()
        };
        renderReadenProfileAvatar(preview, draft.avatar);
        if (nameInput && document.activeElement !== nameInput) nameInput.value = draft.name || '';
        if (signPreview) signPreview.textContent = draft.sign || getReadenProfileSign();
    }

    function renderReadenProfileSummary() {
        if (!document.getElementById('readenAppUI')) return;
        ensureReadenProfileState();
        const name = getReadenProfileDisplayName();
        const avatarUrl = getReadenProfileAvatar();
        const sign = getReadenProfileSign();
        const noteCount = getReadenAllUserAnnotations().length;
        const roleCount = getReadenAllCharacterAnnotations().length;
        const groupCount = getReadenManagedGroups().length;
        renderReadenProfileAvatar(document.querySelector('#readenAppUI .my-user-info .my-avatar'), avatarUrl);
        document.querySelectorAll('#readenAppUI .my-user-info .my-name').forEach(el => { el.textContent = name; });
        document.querySelectorAll('#readenAppUI .my-user-info .my-sign').forEach(el => { el.textContent = sign; });
        const noteCardSub = document.getElementById('readen-profile-notes-card')?.querySelector('.my-action-sub');
        if (noteCardSub) noteCardSub.textContent = `${noteCount} 条`;
        const notesTitle = document.getElementById('readen-profile-notes-title');
        if (notesTitle) notesTitle.textContent = `笔记 (${noteCount})`;
        const rolesTitle = document.getElementById('readen-profile-roles-title');
        if (rolesTitle) rolesTitle.textContent = `角色批注 (${roleCount})`;
        const groupsTitle = document.getElementById('readen-profile-groups-title');
        if (groupsTitle) groupsTitle.textContent = `分类管理 (${groupCount})`;
        if (document.getElementById('readen-page-profile-editor')?.classList.contains('active')) {
            renderReadenProfileEditorPreview();
        }
        if (document.getElementById('readen-page-profile-notes')?.classList.contains('active')) {
            renderReadenProfileNotesPage();
        }
        if (document.getElementById('readen-page-profile-roles')?.classList.contains('active')) {
            renderReadenProfileRolesPage();
        }
        if (document.getElementById('readen-page-profile-groups')?.classList.contains('active')) {
            renderReadenProfileGroupsPage();
        }
    }

    function renderReadenProfileNotesPage() {
        const list = document.getElementById('readen-profile-notes-list');
        if (!list) return;
        const entries = getReadenAllUserAnnotations();
        if (!entries.length) {
            list.innerHTML = '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无笔记</div>';
            return;
        }
        list.innerHTML = `<div class="readen-annotation-list">${entries.map(({ book, annotation }) => {
            const chapterTitle = annotation.chapter?.title || '未命名章节';
            const chapterIndex = Number(annotation.chapter?.indexAtCreation ?? annotation.chapter?.index ?? 0) || 0;
            return `
                <button type="button" class="readen-annotation-list-item" data-profile-book-id="${escapeReadenAttribute(book.id)}" data-profile-chapter-index="${chapterIndex}" data-profile-annotation-id="${escapeReadenAttribute(annotation.id)}">
                    <span class="readen-annotation-list-kind">我的笔记${annotation.images?.length ? ' · 有图片' : ''}</span>
                    <span class="readen-annotation-list-quote">${escapeReadenHtml(book.title || '未命名书籍')} · ${escapeReadenHtml(chapterTitle)}</span>
                    <span class="readen-annotation-list-content">${escapeReadenHtml(annotation.note || '只做了标注')}</span>
                    <span class="readen-annotation-list-meta">${annotation.status === 'anchor_missing' ? '原文位置已变化 · ' : ''}${escapeReadenHtml(annotation.anchor?.quote || '原文位置已变化')}</span>
                </button>
            `;
        }).join('')}</div>`;
    }

    function renderReadenProfileRolesPage() {
        const list = document.getElementById('readen-profile-roles-list');
        if (!list) return;
        const entries = getReadenAllCharacterAnnotations();
        if (!entries.length) {
            list.innerHTML = '<div class="readen-reader-chapter-empty" style="margin-top: 40px;">暂无角色批注</div>';
            return;
        }
        list.innerHTML = `<div class="readen-annotation-list">${entries.map(({ book, annotation }) => {
            const display = getReadenCoReaderDisplay(book, annotation);
            const chapterTitle = annotation.chapter?.title || '未命名章节';
            const chapterIndex = Number(annotation.chapter?.indexAtCreation ?? annotation.chapter?.index ?? 0) || 0;
            return `
                <button type="button" class="readen-annotation-list-item" data-profile-book-id="${escapeReadenAttribute(book.id)}" data-profile-chapter-index="${chapterIndex}" data-profile-annotation-id="${escapeReadenAttribute(annotation.id)}">
                    <span class="readen-annotation-list-kind">${escapeReadenHtml(display.label)}</span>
                    <span class="readen-annotation-list-quote">${escapeReadenHtml(book.title || '未命名书籍')} · ${escapeReadenHtml(chapterTitle)}</span>
                    <span class="readen-annotation-list-content">${escapeReadenHtml(annotation.content || annotation.note || '批注内容为空')}</span>
                    <span class="readen-annotation-list-meta">${annotation.status === 'anchor_missing' ? '原文位置已变化 · ' : ''}${escapeReadenHtml(annotation.anchor?.quote || '原文位置已变化')}</span>
                </button>
            `;
        }).join('')}</div>`;
    }

    function renderReadenProfileGroupsPage() {
        const list = document.getElementById('readen-profile-groups-list');
        if (!list) return;
        const customGroups = getReadenManagedGroups();
        const groupItems = ['全部', ...customGroups];
        list.innerHTML = `
            <div class="readen-profile-groups-toolbar">
                <div class="readen-profile-groups-summary">全部 ${readenBooksData.length} 本 · 分类 ${customGroups.length} 个</div>
            </div>
            <div class="my-list-group">
                ${groupItems.map(groupName => {
                    const bookCount = getReadenGroupBookCount(groupName);
                    const canManage = groupName !== '全部';
                    return `
                        <div class="my-list-item readen-profile-group-item" data-group-name="${escapeReadenAttribute(groupName)}">
                            <div class="my-item-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" id="Bookmark-Tag--Streamline-Micro" height="10" width="10">
  <desc>
    Bookmark Tag Streamline Icon: https://streamlinehq.com
  </desc>
  <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.5 1A0.5 0.5 0 0 1 1 0.5h4l4.207 4.207a1 1 0 0 1 0 1.414L6.121 9.207a1 1 0 0 1 -1.414 0L0.5 5z" stroke-width="1"></path>
  <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M2.75 3a0.25 0.25 0 0 1 0 -0.5" stroke-width="1"></path>
  <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M2.75 3a0.25 0.25 0 0 0 0 -0.5" stroke-width="1"></path>
</svg></div>
                            <div class="my-item-name">${escapeReadenHtml(groupName)}</div>
                            <div class="readen-profile-group-meta">${bookCount} 本</div>
                            ${canManage ? `
                                <div class="readen-profile-group-actions">
                                    <button type="button" class="readen-profile-icon-btn" data-group-action="rename" data-group-name="${escapeReadenAttribute(groupName)}" aria-label="重命名">
                                        <svg width="18" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64l24-24L216,84.68Z"/></svg>
                                    </button>
                                    <button type="button" class="readen-profile-icon-btn" data-group-action="delete" data-group-name="${escapeReadenAttribute(groupName)}" aria-label="删除">
                                        <svg width="18" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"/></svg>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function handleReadenProfileAvatarUpload(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !file.type.startsWith('image/')) {
            showReadenDialog({ type: 'confirm', title: '头像无效', msg: '请选择图片文件。' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showReadenDialog({ type: 'confirm', title: '头像太大', msg: '请选择 5MB 以内的图片。' });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            readenProfileDraft = readenProfileDraft || {};
            readenProfileDraft.avatar = String(reader.result || '');
            renderReadenProfileEditorPreview();
        };
        reader.onerror = () => showReadenDialog({ type: 'confirm', title: '头像读取失败', msg: '请换一张图片再试。' });
        reader.readAsDataURL(file);
    }

    function clearReadenProfileAvatar() {
        readenProfileDraft = readenProfileDraft || {};
        readenProfileDraft.avatar = '';
        renderReadenProfileEditorPreview();
    }

    function saveReadenProfileEditor() {
        ensureReadenProfileState();
        const nameInput = document.getElementById('readen-profile-name-input');
        const nextName = String(nameInput?.value || '').trim() || '小岛梨花';
        const nextAvatar = readenProfileDraft?.avatar || '';
        const nextSign = String(document.getElementById('readen-profile-sign-input')?.value || readenProfileDraft?.sign || getReadenProfileSign()).trim();
        readenSettings.profileName = nextName;
        readenSettings.profileAvatar = nextAvatar;
        readenSettings.profileSign = nextSign;
        saveReadenAppData();
        closeReadenProfileEditor();
        renderReadenProfileSummary();
        if (typeof window.showToast === 'function') window.showToast('资料已保存');
    }

    function openReadenProfileAnnotationBook(bookId, chapterIndex, annotationId) {
        const book = readenBooksData.find(item => String(item.id) === String(bookId));
        if (!book) return;
        const annotation = (book.annotations || []).find(item => String(item.id) === String(annotationId));
        if (annotation) {
            openReadenBookLocation(book, getReadenAnnotationPosition(book, annotation), null, () => openReaderAnnotationDetail(annotation.id));
            return;
        }
        openReader(book.id, Number(chapterIndex) || 0);
    }
    function createReadenGroupByPrompt(defaultValue = '') {
        const doCreate = groupName => {
            const nextGroup = String(groupName || '').trim();
            if (!nextGroup) return;
            if (!readenGroups.includes(nextGroup)) readenGroups.push(nextGroup);
            saveReadenAppData();
            renderGroupTabs();
            renderBookList();
            renderReadenProfileGroupsPage();
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('新建分类', { placeholder: '请输入分组名称', value: defaultValue }, '确定').then(doCreate);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '新建分类',
                placeholder: '请输入分组名称',
                defaultVal: defaultValue,
                onConfirm: doCreate
            });
        }
    }

    function renameReadenGroup(groupName) {
        if (!groupName || groupName === '全部') return;
        const doRename = nextValue => {
            const nextGroup = String(nextValue || '').trim();
            if (!nextGroup || nextGroup === groupName) return;
            if (!readenGroups.includes(nextGroup)) readenGroups.push(nextGroup);
            readenGroups = readenGroups.filter(group => group !== groupName);
            readenBooksData.forEach(book => {
                if ((book.group || '全部') === groupName) book.group = nextGroup;
            });
            if (currentGroup === groupName) currentGroup = nextGroup;
            saveReadenAppData();
            renderGroupTabs();
            renderBookList();
            renderReadenProfileGroupsPage();
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('重命名分类', { placeholder: '请输入新的分组名称', value: groupName }, '确定').then(doRename);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: '重命名分类',
                placeholder: '请输入新的分组名称',
                defaultVal: groupName,
                onConfirm: doRename
            });
        }
    }

    function deleteReadenGroup(groupName) {
        if (!groupName || groupName === '全部') return;
        showReadenDialog({
            type: 'confirm',
            title: '删除分类',
            msg: `删除「${escapeReadenHtml(groupName)}」后，该分组下的小说会回到“全部”。`,
            onConfirm: () => {
                readenBooksData.forEach(book => {
                    if ((book.group || '全部') === groupName) book.group = '全部';
                });
                readenGroups = readenGroups.filter(group => group !== groupName);
                if (currentGroup === groupName) currentGroup = '全部';
                saveReadenAppData();
                renderGroupTabs();
                renderBookList();
                renderReadenProfileGroupsPage();
            }
        });
    }

    function readenStoredSize(value) {
    if (value === null || value === undefined) return 0;
    if (typeof Blob !== 'undefined' && value instanceof Blob) return value.size;
    if (typeof value === 'string') return new TextEncoder().encode(value).byteLength + 2;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value).length;
    if (Array.isArray(value)) return 2 + value.reduce((sum, item) => sum + readenStoredSize(item) + 1, 0);
    if (typeof value === 'object') return 2 + Object.entries(value).reduce(
        (sum, entry) => sum + readenStoredSize(entry[0]) + readenStoredSize(entry[1]) + 2, 0
    );
    return 0;
}

    function getReadenStorageUsage() {
    const amount = { books: 0, images: 0, cache: 0, notes: 0, settings: 0 };
    for (const book of readenBooksData) {
        if (!book || typeof book !== 'object') continue;
        const rest = { ...book };
        for (const key of ['customCover', 'epubCover', 'epubAssets']) {
            amount.images += readenStoredSize(rest[key]);
            delete rest[key];
        }
        for (const key of ['annotations', 'notes', 'bookmarks', 'coReading']) {
            amount.notes += readenStoredSize(rest[key]);
            delete rest[key];
        }
        amount.books += readenStoredSize(rest.title) + readenStoredSize(rest.author);
        delete rest.title;
        delete rest.author;
        amount.cache += book.sourceMeta?.readToken ? readenStoredSize(rest.fullText) : 0;
        if (book.sourceMeta?.readToken) delete rest.fullText;
        if (Array.isArray(rest.chapters)) {
            for (const chapter of rest.chapters) {
                if (!chapter || typeof chapter !== 'object') continue;
                const metadata = { ...chapter };
                if (book.sourceMeta?.readToken) {
                    amount.cache += readenStoredSize(metadata.content) + readenStoredSize(metadata.images);
                    delete metadata.content;
                    delete metadata.images;
                } else {
                    amount.images += readenStoredSize(metadata.images);
                    delete metadata.images;
                }
                amount.books += readenStoredSize(metadata);
            }
            delete rest.chapters;
        }
        amount.books += readenStoredSize(rest);
    }
    amount.images += readenStoredSize(readenCoverThemes);
    const settings = { ...readenSettings };
    for (const key of ['readerCustomBackgrounds', 'profileAvatar', 'bg']) {
        amount.images += readenStoredSize(settings[key]);
        delete settings[key];
    }
    amount.settings += readenStoredSize(settings) + readenStoredSize(readenGroups) + readenStoredSize(readenGlobalThemeIndex);
    const total = Object.values(amount).reduce((sum, count) => sum + count, 0);
    return { amount, total };
}

    function formatReadenStorageBytes(bytes) {
    if (!bytes) return '0 KB';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

    /*
     * Tabler Icons (https://github.com/tabler/tabler-icons) - MIT License
     * Copyright (c) 2020-2026 Paweł Kuna
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    /*
     * Phosphor Icons (https://github.com/phosphor-icons/core) — MIT License
     * Copyright (c) 2023 Phosphor Icons
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    function readenStorageIcon(name) {
    const icons = {
        storage: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" > <path d=\"M3 15.731c1.968 1.507 5.234 2.269 9 2.269c3.76 0 7.025 -.76 9 -2.252v2.252c0 2.425 -3.895 3.936 -8.693 3.998l-.307 .002c-4.938 0 -9 -1.523 -9 -4z\" /> <path d=\"M3 9.731c1.968 1.507 5.234 2.269 9 2.269c3.76 0 7.025 -.76 9 -2.252v2.252c0 2.477 -4.062 4 -9 4c-4.798 0 -8.77 -1.438 -8.979 -3.795l-.016 -.101l-.005 -.104z\" /> <path d=\"M12 2c1.041 0 2.044 .068 2.977 .198l.469 .071q .84 .14 1.586 .348l.44 .131l.075 .024a11 11 0 0 1 .805 .3l.199 .086q .535 .242 .967 .53q .165 .11 .313 .225a3.8 3.8 0 0 1 .669 .668l.091 .128q .07 .105 .129 .211l.07 .139q .163 .35 .2 .73l.01 .211c0 2.477 -4.062 4 -9 4c-4.798 0 -8.77 -1.438 -8.979 -3.795a1 1 0 0 1 -.021 -.205l.005 -.104l.016 -.1c.205 -2.306 4.01 -3.733 8.667 -3.794z\" /> </svg>", images: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" > <path d=\"M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z\" /> </svg>",
        cache: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" > <path d=\"M2 5a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z\" /> <path d=\"M19 9c.513 0 .936 .463 .993 1.06l.007 .14v7.2c0 1.917 -1.249 3.484 -2.824 3.594l-.176 .006h-10c-1.598 0 -2.904 -1.499 -2.995 -3.388l-.005 -.212v-7.2c0 -.663 .448 -1.2 1 -1.2h14zm-5 2h-4l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h4l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z\" /> </svg>", export: "<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Zm-56,83.32-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35a8,8,0,0,1,11.32,11.32ZM152,88V44l44,44Z\"/></svg>",
        import: "<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Zm-56,67.32a8,8,0,0,1-11.32,0L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0l24,24A8,8,0,0,1,157.66,149.66ZM152,88V44l44,44Z\"/></svg>", clear: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" > <path d=\"M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1\" /> <path d=\"M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z\" /> </svg>",
        eraser: "<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M225,80.4,183.6,39a24,24,0,0,0-33.94,0L31,157.66a24,24,0,0,0,0,33.94l30.06,30.06A8,8,0,0,0,66.74,224H216a8,8,0,0,0,0-16h-84.7L225,114.34A24,24,0,0,0,225,80.4ZM213.67,103,160,156.69,107.31,104,161,50.34a8,8,0,0,1,11.32,0l41.38,41.38a8,8,0,0,1,0,11.31Z\"/></svg>",
        chart: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" > <path d=\"M9.883 2.207a1.9 1.9 0 0 1 2.087 1.522l.025 .167l.005 .104v7a1 1 0 0 0 .883 .993l.117 .007h6.8a2 2 0 0 1 2 2a1 1 0 0 1 -.026 .226a10 10 0 1 1 -12.27 -11.933l.27 -.067l.11 -.02z\" /> <path d=\"M14 3.5v5.5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 .943 -1.332a10 10 0 0 0 -6.11 -6.111a1 1 0 0 0 -1.333 .943z\" /> </svg>"
    };
    return icons[name] || icons.storage;
}

    function ensureReadenStoragePage() {
    let page = document.getElementById('readen-page-storage');
    if (page) return page;
    page = document.createElement('div');
    page.id = 'readen-page-storage';
    page.className = 'sub-page readen-storage-page';
    page.setAttribute('aria-hidden', 'true');
    page.innerHTML = `
        <div class="sub-header readen-storage-header">
            <button class="sub-header-back readen-storage-back" type="button" aria-label="返回" data-readen-storage-action="back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18 9 12l6-6"/></svg>
            </button>
            <div class="sub-header-title">阅读数据管理</div>
        </div>
        <div class="readen-storage-scroll">
            <div class="readen-storage-overview">
                <div class="readen-storage-caption">${readenStorageIcon('chart')} 阅读资料占用（估算）</div>
                <div class="readen-storage-total" id="readen-storage-total">正在统计…</div>
                <div class="readen-storage-bar" id="readen-storage-bar"></div>
                <div class="readen-storage-legend" id="readen-storage-legend"></div>
                <div class="readen-storage-description" id="readen-storage-description">统计本地阅读数据，不包括其他应用。</div>
            </div>
            <div class="readen-storage-group-title">空间整理</div>
            <div class="readen-storage-group">
                <button type="button" class="readen-storage-row" data-readen-storage-action="cache">${readenStorageIcon('cache')}<span><strong>清理阅读缓存</strong><small>移除可重新加载的在线章节</small></span><i>›</i></button>
                <button type="button" class="readen-storage-row" data-readen-storage-action="compress">${readenStorageIcon('images')}<span><strong>压缩图片资源</strong><small>只保存真正变小的图片</small></span><i>›</i></button>
            </div>
            <div class="readen-storage-group-title">分类清空</div>
            <div class="readen-storage-group">
                <button type="button" class="readen-storage-row" data-readen-storage-action="notes">${readenStorageIcon('eraser')}<span><strong>清空笔记、书签与批注</strong><small>保留书籍和阅读进度</small></span><i>›</i></button>
                <button type="button" class="readen-storage-row" data-readen-storage-action="images">${readenStorageIcon('eraser')}<span><strong>清空自定义封面与背景</strong><small>不删除 EPUB 原有插图</small></span><i>›</i></button>
                <button type="button" class="readen-storage-row" data-readen-storage-action="appearance">${readenStorageIcon('eraser')}<span><strong>清空自定义外观数据</strong><small>删除自定义 CSS、字体和阅读背景</small></span><i>›</i></button>
                <button type="button" class="readen-storage-row destructive" data-readen-storage-action="books">${readenStorageIcon('clear')}<span><strong>清空整个书架</strong><small>删除所有书籍、正文与相关笔记</small></span><i>›</i></button>
            </div>
            <div class="readen-storage-group-title">备份与恢复</div>
            <div class="readen-storage-backup-buttons">
                <button type="button" data-readen-storage-action="export">${readenStorageIcon('export')}<span>导出阅读备份</span></button>
                <button type="button" data-readen-storage-action="import">${readenStorageIcon('import')}<span>恢复阅读备份</span></button>
            </div>
            <button type="button" class="readen-storage-system-link" data-readen-storage-action="system">打开童话集完整系统备份 ›</button>
            <input type="file" id="readen-storage-file-input" accept=".json,.gz,application/json,application/gzip" hidden>
            <div class="readen-storage-status" id="readen-storage-status" role="status" aria-live="polite"></div>
        </div>`;
    container.appendChild(page);
    page.addEventListener('click', event => {
        const control = event.target.closest('[data-readen-storage-action]');
        if (control) void handleReadenStorageAction(control.dataset.readenStorageAction);
    });
    page.querySelector('#readen-storage-file-input').addEventListener('change', event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (file) void importReadenStorageBackup(file);
    });
    return page;
}

    async function renderReadenStorageUsage() {
    const page = document.getElementById('readen-page-storage');
    if (!page?.classList.contains('active')) return;
    const { amount, total } = getReadenStorageUsage();
    page.querySelector('#readen-storage-total').textContent = formatReadenStorageBytes(total);
    const types = [
        ['books', '书籍与正文', '#7894af'], ['images', '图片资源', '#a8c2b6'],
        ['cache', '在线阅读缓存', '#d4b498'], ['notes', '笔记与共读', '#baa7c5'],
        ['settings', '设置与其他', '#c9cbd1']
    ];
    const bar = page.querySelector('#readen-storage-bar');
    bar.innerHTML = '';
    const legend = page.querySelector('#readen-storage-legend');
    legend.innerHTML = '';
    for (const [type, label, color] of types) {
        const pct = total ? amount[type] / total * 100 : 0;
        const part = document.createElement('span');
        part.style.backgroundColor = color;
        part.style.width = `${pct}%`;
        part.title = `${label} ${formatReadenStorageBytes(amount[type])}`;
        bar.appendChild(part);
        const item = document.createElement('div');
        item.className = 'readen-storage-legend-row';
        const dot = document.createElement('span');
        dot.className = 'readen-storage-dot';
        dot.style.backgroundColor = color;
        const name = document.createElement('span');
        name.textContent = label;
        const detail = document.createElement('strong');
        detail.textContent = `${formatReadenStorageBytes(amount[type])} · ${pct.toFixed(1)}%`;
        item.append(dot, name, detail);
        legend.appendChild(item);
    }
    const desc = page.querySelector('#readen-storage-description');
    desc.textContent = `书架 ${readenBooksData.length} 本 · 本机阅读数据字段大小估算，不等同于设备系统显示的实际磁盘占用`;
}

    async function openReadenStorageManager() {
    await (window.readenAppDataReady || Promise.resolve());
    const page = ensureReadenStoragePage();
    page.classList.add('active');
    page.setAttribute('aria-hidden', 'false');
    page.querySelector('.readen-storage-scroll').scrollTop = 0;
    await renderReadenStorageUsage();
}

    function closeReadenStorageManager() {
    const page = document.getElementById('readen-page-storage');
    if (!page) return;
    page.classList.remove('active');
    page.setAttribute('aria-hidden', 'true');
}

    function setReadenStorageStatus(message) {
    const label = document.getElementById('readen-storage-status');
    if (label) label.textContent = String(message || '');
}

    function makeReadenStorageDraft() {
    return {
        books: readenBooksData.map(book => ({ ...book })),
        groups: readenGroups.slice(),
        coverThemes: readenCoverThemes.map(theme => ({ ...theme })),
        globalThemeIndex: readenGlobalThemeIndex,
        settings: { ...readenSettings }
    };
}

    async function saveReadenStorageDraft(draft) {
    const previous = {
        books: readenBooksData, groups: readenGroups, coverThemes: readenCoverThemes,
        globalThemeIndex: readenGlobalThemeIndex, settings: readenSettings
    };
    readenBooksData = draft.books;
    readenGroups = draft.groups;
    readenCoverThemes = draft.coverThemes;
    readenGlobalThemeIndex = draft.globalThemeIndex;
    readenSettings = draft.settings;
    let success = false;
    try {
        success = await saveReadenAppData();
        if (!success) throw new Error('IndexedDB 保存未完成，请检查存储空间');
    } catch (error) {
        readenBooksData = previous.books;
        readenGroups = previous.groups;
        readenCoverThemes = previous.coverThemes;
        readenGlobalThemeIndex = previous.globalThemeIndex;
        readenSettings = previous.settings;
        throw error;
    }
    try {
        renderGroupTabs();
        renderBookList();
        renderReadenHomeStats();
        renderReadenProfilePage();
        renderCoverGallery();
    } catch (renderError) {
        console.warn('[Readen storage] UI refresh deferred', renderError);
    }
    const style = document.getElementById('readen-user-global-css');
    if (style) style.textContent = readenSettings.readerCustomCss || '';
    window.dispatchEvent(new Event('readenstoragedatachanged'));
}

    function prepareReadenStorageClear(draft, action) {
    if (action === 'cache') {
        for (const book of draft.books) {
            if (!book?.sourceMeta?.readToken) continue;
            book.fullText = '';
            book.chapters = (book.chapters || []).map(chapter => {
                if (!chapter || typeof chapter !== 'object') return chapter;
                const next = { ...chapter };
                delete next.content;
                delete next.images;
                return next;
            });
        }
    } else if (action === 'notes') {
        draft.books = draft.books.map(book => {
            const next = { ...book, annotations: [], notes: [], bookmarks: [] };
            if (book.coReading) next.coReading = { ...book.coReading, chapterReflectionPrompted: [] };
            return next;
        });
    } else if (action === 'images') {
        draft.books = draft.books.map(book => ({ ...book, customCover: null }));
        draft.coverThemes = [];
        draft.globalThemeIndex = 0;
        draft.settings.readerCustomBackgrounds = [];
        draft.settings.profileAvatar = '';
        draft.settings.bg = null;
    } else if (action === 'appearance') {
        draft.settings.readerFonts = [];
        draft.settings.readerCustomBackgrounds = [];
        draft.settings.readerAppearancePresets = [];
        draft.settings.readerAppearancePresetId = '';
        draft.settings.readerCustomCss = '';
        draft.settings.readerLayout = null;
        draft.settings.readerSpeech = null;
        draft.settings.readerThemeId = 'reader-preset-white';
        draft.settings.readerThemeType = 'color';
        draft.settings.readerThemeValue = '#ffffff';
        draft.settings.readerFontId = 'reader-font-default';
    } else if (action === 'books') {
        draft.books = [];
        draft.groups = ['全部'];
    }
}

    async function performReadenStorageTask(label, task) {
    if (readenStorageBusy) return;
    readenStorageBusy = true;
    const page = document.getElementById('readen-page-storage');
    page?.querySelectorAll('[data-readen-storage-action]').forEach(element => { element.disabled = true; });
    setReadenStorageStatus(`${label}，请稍候…`);
    try {
        const message = await task();
        setReadenStorageStatus(message || `${label}完成`);
        await renderReadenStorageUsage();
        if (typeof window.showToast === 'function') window.showToast(message || `${label}完成`);
    } catch (error) {
        console.error('[Readen storage]', label, error);
        setReadenStorageStatus(`${label}失败：${error?.message || '未知错误'}。请检查提示并保留原备份文件。`);
    } finally {
        readenStorageBusy = false;
        page?.querySelectorAll('[data-readen-storage-action]').forEach(element => { element.disabled = false; });
    }
}

    async function handleReadenStorageAction(action) {
    if (action === 'back') { closeReadenStorageManager(); return; }
    if (action === 'system') {
        if (typeof window.openIcloudApp === 'function') window.openIcloudApp();
        else setReadenStorageStatus('完整系统备份暂不可用，请稍后再试。');
        return;
    }
    if (action === 'export') { await exportReadenStorageBackup(); return; }
    if (action === 'import') { document.getElementById('readen-storage-file-input')?.click(); return; }
    if (readenStorageBusy) return;
    if (action === 'cache' && getReadenStorageUsage().amount.cache === 0) {
        setReadenStorageStatus('没有需要清理的在线章节缓存');
        return;
    }
    const labels = {
        cache: ['清理阅读缓存', '只移除可重新下载的在线章节正文与漫画缓存，不会删除本地书籍、进度及批注。'],
        compress: ['压缩阅读图片', '将可压缩的图片转为较小文件。GIF 动画和 SVG 保持原样，可能需要一些时间。'],
        notes: ['清空笔记与批注', '将永久删除所有阅读书签、个人笔记与角色批注；书籍和阅读进度会保留。'],
        images: ['清空自定义图片', '将永久删除自定义封面、封面图集、阅读背景和阅读头像；EPUB 原有插图保留。'],
        appearance: ['清空自定义外观', '将永久删除自定义 CSS、导入字体和阅读背景，并恢复默认阅读外观。'],
        books: ['清空整个书架', '所有本地 TXT、EPUB、在线书籍、正文、书签与批注都将永久删除。建议先导出备份。']
    };
    const entry = labels[action];
    if (!entry) return;
    showReadenDialog({
        type: 'confirm', title: entry[0], msg: entry[1],
        onConfirm: () => {
            if (action === 'compress') { void compressReadenStorageImages(); return; }
            void performReadenStorageTask(entry[0], async () => {
                const oldBooks = action === 'books' ? readenBooksData : [];
                const draft = makeReadenStorageDraft();
                prepareReadenStorageClear(draft, action);
                await saveReadenStorageDraft(draft);
                if (action === 'books') oldBooks.forEach(book => releaseReadenEpubBookAssets(book));
                return `${entry[0]}完成`;
            });
        }
    });
}

    function canCompressReadenResource(value) {
    const type = typeof Blob !== 'undefined' && value instanceof Blob ? value.type : '';
    if (type) return /^image\/(?:png|jpe?g|webp)$/i.test(type);
    return typeof value === 'string' && /^data:image\/(?:png|jpe?g|webp);/i.test(value);
}

    async function shrinkReadenImage(value, maxEdge = 2200) {
    if (!canCompressReadenResource(value)) return value;
    const isBlob = typeof Blob !== 'undefined' && value instanceof Blob;
    const temporaryUrl = isBlob ? URL.createObjectURL(value) : '';
    try {
        const image = new Image();
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () => reject(new Error('图片解码失败'));
            image.src = temporaryUrl || value;
        });
        if (!image.naturalWidth || !image.naturalHeight) return value;
        const ratio = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return value;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (isBlob) {
            const output = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .84));
            return output && output.size < value.size ? output : value;
        }
        const output = canvas.toDataURL('image/webp', .84);
        return output.startsWith('data:image/webp;') && output.length < value.length ? output : value;
    } catch (error) {
        console.warn('[Readen storage] skipping image', error);
        return value;
    } finally {
        if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
    }
}

    async function compressReadenStorageImages() {
    await performReadenStorageTask('压缩图片资源', async () => {
        const draft = makeReadenStorageDraft();
        let reduced = 0;
        let saved = 0;
        const shrink = async (value, maxEdge = 2200) => {
            if (!canCompressReadenResource(value)) return value;
            const result = await shrinkReadenImage(value, maxEdge);
            if (result !== value) {
                reduced++;
                saved += readenStoredSize(value) - readenStoredSize(result);
            }
            return result;
        };
        for (let bookIndex = 0; bookIndex < draft.books.length; bookIndex++) {
            const book = draft.books[bookIndex];
            book.customCover = await shrink(book.customCover, 1200);
            book.epubCover = await shrink(book.epubCover, 1200);
            if (book.epubAssets && typeof book.epubAssets === 'object') {
                book.epubAssets = { ...book.epubAssets };
                for (const key of Object.keys(book.epubAssets)) {
                    book.epubAssets[key] = await shrink(book.epubAssets[key]);
                }
            }
            if (Array.isArray(book.annotations)) {
                book.annotations = [];
                for (const annotation of (readenBooksData[bookIndex]?.annotations || [])) {
                    const next = { ...annotation };
                    if (Array.isArray(next.images)) {
                        next.images = [];
                        for (const entry of annotation.images) {
                            next.images.push(entry && typeof entry === 'object'
                                ? { ...entry, src: await shrink(entry.src) } : entry);
                        }
                    }
                    book.annotations.push(next);
                }
            }
        }
        draft.settings.profileAvatar = await shrink(draft.settings.profileAvatar, 1000);
        if (Array.isArray(draft.settings.readerCustomBackgrounds)) {
            draft.settings.readerCustomBackgrounds = [];
            for (const entry of (readenSettings.readerCustomBackgrounds || [])) {
                draft.settings.readerCustomBackgrounds.push({ ...entry, value: await shrink(entry?.value) });
            }
        }
        for (const theme of draft.coverThemes) {
            if (!Array.isArray(theme.svgList)) continue;
            const original = theme.svgList.slice();
            theme.svgList = [];
            for (const markup of original) {
                const found = typeof markup === 'string' ? markup.match(/src="(data:image\/[^"]+)"/i) : null;
                const compressed = found ? await shrink(found[1], 1400) : null;
                theme.svgList.push(compressed && compressed !== found[1] ? markup.replace(found[1], compressed) : markup);
            }
            if (theme.svgList.length) theme.svg = theme.svgList[0];
        }
        if (!reduced) return '未发现能够进一步压缩的本地图片，原图已保留';
        await saveReadenStorageDraft(draft);
        return `已压缩 ${reduced} 张图片，节省约 ${formatReadenStorageBytes(saved)}`;
    });
}

    async function encodeReadenBackupValue(value) {
    if (typeof Blob !== 'undefined' && value instanceof Blob) {
        return { __readenBinaryV1: true, mediaType: value.type || '', bytes: Array.from(new Uint8Array(await value.arrayBuffer())) };
    }
    if (Array.isArray(value)) return Promise.all(value.map(item => encodeReadenBackupValue(item)));
    if (value && typeof value === 'object') {
        const next = {};
        for (const [key, item] of Object.entries(value)) {
            if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('数据包含不支持的字段');
            next[key] = await encodeReadenBackupValue(item);
        }
        return next;
    }
    return value;
}

    function decodeReadenBackupValue(value) {
    if (Array.isArray(value)) return value.map(decodeReadenBackupValue);
    if (value && typeof value === 'object') {
        if (value.__readenBinaryV1 === true) {
            if (!Array.isArray(value.bytes) || value.bytes.some(byte => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
                throw new Error('备份图片数据损坏');
            }
            return new Blob([Uint8Array.from(value.bytes)], { type: String(value.mediaType || '') });
        }
        const next = {};
        for (const [key, item] of Object.entries(value)) {
            if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('备份包含不安全的字段');
            next[key] = decodeReadenBackupValue(item);
        }
        return next;
    }
    return value;
}

    async function openReadenTitleCssDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ReadenCustomTitleStyleDB', 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains('settings')) request.result.createObjectStore('settings');
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('标题样式数据库无法打开'));
    });
}

    async function readReadenStoredTitleCss() {
    const connection = await openReadenTitleCssDatabase();
    try {
        return await new Promise((resolve, reject) => {
            const tx = connection.transaction('settings', 'readonly');
            const request = tx.objectStore('settings').get('custom-title-css');
            request.onsuccess = () => resolve(typeof request.result === 'string' ? request.result : null);
            request.onerror = () => reject(request.error);
        });
    } finally { connection.close(); }
}

    async function writeReadenStoredTitleCss(css) {
    if (typeof css !== 'string') return;
    const connection = await openReadenTitleCssDatabase();
    try {
        await new Promise((resolve, reject) => {
            const tx = connection.transaction('settings', 'readwrite');
            tx.objectStore('settings').put(css, 'custom-title-css');
            tx.oncomplete = resolve;
            tx.onabort = () => reject(tx.error || new Error('标题样式存储失败'));
            tx.onerror = () => reject(tx.error || new Error('标题样式存储失败'));
        });
    } finally { connection.close(); }
}

    async function exportReadenStorageBackup() {
    await performReadenStorageTask('导出阅读备份', async () => {
        await (window.readenAppDataReady || Promise.resolve());
        const snapshot = {
            books: readenBooksData, groups: readenGroups, coverThemes: readenCoverThemes,
            globalThemeIndex: readenGlobalThemeIndex, settings: readenSettings
        };
        const titleCss = await readReadenStoredTitleCss();
        const payload = {
            app: 'tonghuaji-readen', version: 1, exportedAt: new Date().toISOString(),
            titleCss, data: await encodeReadenBackupValue(snapshot)
        };
        const json = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        let output = json;
        let extension = '.json';
        if (typeof CompressionStream === 'function') {
            output = await new Response(json.stream().pipeThrough(new CompressionStream('gzip'))).blob();
            extension = '.json.gz';
        }
        const url = URL.createObjectURL(output);
        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = `童话集_阅读备份_${new Date().toISOString().slice(0, 10)}${extension}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } finally { setTimeout(() => URL.revokeObjectURL(url), 60000); }
        return `备份文件已交给浏览器下载（${formatReadenStorageBytes(output.size)}），请检查下载目录`;
    });
}

    async function readReadenStorageImportFile(file) {
    if (file.size > 1024 * 1024 * 1024) throw new Error('单个备份超过 1 GB，请先检查文件');
    const gz = /\.gz$/i.test(file.name) || file.type === 'application/gzip';
    if (gz && typeof DecompressionStream !== 'function') throw new Error('当前浏览器不支持解压此备份，请用支持 gzip 的浏览器恢复');
    const decoded = gz ? new Response(file.stream().pipeThrough(new DecompressionStream('gzip'))) : file;
    const payload = JSON.parse(await decoded.text());
    if (payload?.app !== 'tonghuaji-readen' || payload.version !== 1) throw new Error('请选择阅读 App 导出的有效备份文件');
    const snapshot = decodeReadenBackupValue(payload.data);
    if (!snapshot || !Array.isArray(snapshot.books) || !Array.isArray(snapshot.groups)
        || !Array.isArray(snapshot.coverThemes) || !snapshot.settings || typeof snapshot.settings !== 'object'
        || Array.isArray(snapshot.settings)) {
        throw new Error('备份缺少完整的书架、图片或阅读设置');
    }
    if (!snapshot.books.every(book => book && typeof book === 'object' && book.id != null && typeof book.title === 'string')) {
        throw new Error('备份书籍结构异常');
    }
    return { snapshot, titleCss: typeof payload.titleCss === 'string' ? payload.titleCss : null };
}

    async function importReadenStorageBackup(file) {
    if (readenStorageBusy) return;
    let parsed;
    await performReadenStorageTask('检查恢复文件', async () => {
        parsed = await readReadenStorageImportFile(file);
        return `已识别备份：${parsed.snapshot.books.length} 本书，等待确认`;
    });
    if (!parsed) return;
    showReadenDialog({
        type: 'confirm', title: '恢复阅读备份',
        msg: `备份中有 ${parsed.snapshot.books.length} 本书。确认后将替换此设备上的阅读书架、批注、图片和阅读设置，其他 App 数据不会改变。建议先导出现有数据。`,
        onConfirm: () => {
            void performReadenStorageTask('恢复阅读备份', async () => {
                const oldSnapshot = makeReadenStorageDraft();
                const oldTitleCss = parsed.titleCss !== null ? await readReadenStoredTitleCss() : null;
                try {
                    if (parsed.titleCss !== null) await writeReadenStoredTitleCss(parsed.titleCss);
                    await saveReadenStorageDraft(parsed.snapshot);
                } catch (error) {
                    if (parsed.titleCss !== null && oldTitleCss !== null) {
                        try { await writeReadenStoredTitleCss(oldTitleCss); } catch (revertError) {
                            console.error('[Readen storage] title CSS rollback failed', revertError);
                        }
                    }
                    if (readenBooksData === parsed.snapshot.books) {
                        try { await saveReadenStorageDraft(oldSnapshot); } catch (_) {}
                    }
                    throw error;
                }
                return `已成功恢复 ${readenBooksData.length} 本书。建议关闭并重新打开阅读 App 以刷新所有样式。`;
            });
        }
    });
}

    let readenStorageBusy = false;

    function bindReadenProfileOptional(id, eventName, handler, options) {
        const element = document.getElementById(id);
        if (!element) return;
        const boundKey = `readenProfileBound${eventName}`;
        if (element.dataset[boundKey] === '1') return;
        element.dataset[boundKey] = '1';
        element.addEventListener(eventName, handler, options);
    }

    function bindReadenProfilePageInteractions() {
        bindReadenProfileOptional('readen-profile-entry', 'click', openReadenProfileEditor);
        bindReadenProfileOptional('readen-profile-edit-shortcut', 'click', openReadenProfileEditor);
        bindReadenProfileOptional('readen-profile-edit-shortcut', 'keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openReadenProfileEditor();
            }
        });
        bindReadenProfileOptional('readen-profile-sync-card', 'click', () => {
            void openReadenStorageManager().catch(error => {
                console.error('[Readen storage] open failed', error);
                if (typeof window.showToast === 'function') window.showToast('阅读数据管理打开失败，请稍后重试');
            });
        });
        bindReadenProfileOptional('readen-profile-notes-card', 'click', openReadenProfileNotesPage);
        bindReadenProfileOptional('readen-profile-data-notes', 'click', openReadenProfileNotesPage);
        bindReadenProfileOptional('readen-profile-data-roles', 'click', openReadenProfileRolesPage);
        bindReadenProfileOptional('readen-profile-data-groups', 'click', openReadenProfileGroupsPage);
        bindReadenProfileOptional('readen-profile-editor-back-btn', 'click', closeReadenProfileEditor);
        bindReadenProfileOptional('readen-profile-editor-save-btn', 'click', saveReadenProfileEditor);
        bindReadenProfileOptional('readen-profile-avatar-picker', 'click', () => {
            document.getElementById('readen-profile-avatar-input')?.click();
        });
        bindReadenProfileOptional('readen-profile-avatar-input', 'change', handleReadenProfileAvatarUpload);
        bindReadenProfileOptional('readen-profile-notes-back-btn', 'click', closeReadenProfileSubPages);
        bindReadenProfileOptional('readen-profile-roles-back-btn', 'click', closeReadenProfileSubPages);
        bindReadenProfileOptional('readen-profile-groups-back-btn', 'click', closeReadenProfileSubPages);
        bindReadenProfileOptional('readen-profile-group-add-btn', 'click', () => createReadenGroupByPrompt());

        const notesList = document.getElementById('readen-profile-notes-list');
        if (notesList && notesList.dataset.readenBound !== '1') {
            notesList.dataset.readenBound = '1';
            notesList.addEventListener('click', event => {
                const item = event.target.closest('[data-profile-book-id]');
                if (!item) return;
                openReadenProfileAnnotationBook(item.dataset.profileBookId, item.dataset.profileChapterIndex, item.dataset.profileAnnotationId);
            });
        }

        const rolesList = document.getElementById('readen-profile-roles-list');
        if (rolesList && rolesList.dataset.readenBound !== '1') {
            rolesList.dataset.readenBound = '1';
            rolesList.addEventListener('click', event => {
                const item = event.target.closest('[data-profile-book-id]');
                if (!item) return;
                openReadenProfileAnnotationBook(item.dataset.profileBookId, item.dataset.profileChapterIndex, item.dataset.profileAnnotationId);
            });
        }

        const groupsList = document.getElementById('readen-profile-groups-list');
        if (groupsList && groupsList.dataset.readenBound !== '1') {
            groupsList.dataset.readenBound = '1';
            groupsList.addEventListener('click', event => {
                const action = event.target.closest('[data-group-action]');
                if (action) {
                    event.stopPropagation();
                    const groupName = action.dataset.groupName;
                    if (action.dataset.groupAction === 'rename') renameReadenGroup(groupName);
                    if (action.dataset.groupAction === 'delete') deleteReadenGroup(groupName);
                    return;
                }
                const row = event.target.closest('[data-group-name]');
                if (!row) return;
                currentGroup = row.dataset.groupName || '全部';
                renderGroupTabs();
                renderBookList();
                closeReadenProfileSubPages();
            });
        }
    }

    function renderReadenProfilePage() {
        renderReadenProfileSummary();
        bindReadenProfilePageInteractions();
    }

    function openCoverGallery() {
        toggleBookshelfMenu();
        document.getElementById('readen-page-cover-gallery').classList.add('active');
        renderCoverGallery();
    }

    function closeCoverGallery() {
        document.getElementById('readen-page-cover-gallery').classList.remove('active');
    }

    function renderCoverGallery() {
        const listContainer = document.getElementById('readen-cg-theme-list');
        listContainer.innerHTML = '';
        
        const allThemes = getAllCoverThemes();
        allThemes.forEach((theme, index) => {
            const isActive = readenGlobalThemeIndex === index;
            const card = document.createElement('div');
            card.className = `cg-theme-card ${isActive ? 'active' : ''}`;
            card.onclick = () => setGlobalCoverTheme(index);
            
            let previewsHTML = '';
            const svgs = theme.svgList || [theme.svg, theme.svg, theme.svg, theme.svg, theme.svg];
            for(let i = 0; i < 5; i++) {
                previewsHTML += `<div class="cg-preview-item">${svgs[i % svgs.length]}</div>`;
            }
            
            card.innerHTML = `
                <div class="cg-theme-header">
                    <div class="cg-theme-radio"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    <div class="cg-theme-title">${theme.name} <span class="cg-theme-count">(${theme.count})</span></div>
                </div>
                <div class="cg-theme-preview">
                    ${previewsHTML}
                </div>
            `;
            listContainer.appendChild(card);
        });
    }

    function setGlobalCoverTheme(index) {
        readenGlobalThemeIndex = index;
        saveReadenAppData();
        renderCoverGallery();
        renderBookList();
    }

    function openAddThemeModal() {
        tempThemeImages = [];
        document.getElementById('readen-new-theme-name').value = '';
        renderThemeImagePreviews();
        document.getElementById('readen-add-theme-modal-overlay').classList.add('active');
    }

    function closeAddThemeModal() {
        document.getElementById('readen-add-theme-modal-overlay').classList.remove('active');
    }

    function handleThemeLocalUpload(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(base64List => {
            tempThemeImages = tempThemeImages.concat(base64List);
            renderThemeImagePreviews();
            e.target.value = '';
        });
    }

    function addThemeImageByUrl() {
        const doAdd = (url) => {
            if (url && url.trim() !== "") {
                tempThemeImages.push(url.trim());
                renderThemeImagePreviews();
            }
        };
        if (typeof showCustomPrompt === 'function') {
            showCustomPrompt('URL导入图片', { placeholder: '请输入图片URL', value: '' }, '确定').then(doAdd);
        } else {
            showReadenDialog({
                type: 'prompt',
                title: 'URL导入图片',
                placeholder: '请输入图片URL',
                onConfirm: doAdd
            });
        }
    }

    function renderThemeImagePreviews() {
        const container = document.getElementById('readen-theme-image-preview-list');
        if (!container) return;
        container.innerHTML = '';

        // 创建书本大小虚线框包裹 + 号的添加卡片
        const addCard = document.createElement('div');
        addCard.id = 'readen-theme-add-card';
        addCard.style.cssText = 'width: 64px; height: 90px; flex-shrink: 0; border: 1.5px dashed var(--divider, #ccc); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-sub, #888); background: #fafafa; box-sizing: border-box;';
        addCard.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        addCard.onclick = (e) => {
            if (typeof openIconMenu === 'function') {
                openIconMenu(e, 'readenThemeImage');
            }
        };
        container.appendChild(addCard);

        tempThemeImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'theme-preview-item';
            img.draggable = true;
            img.dataset.index = index;
            
            img.addEventListener('dragstart', handleDragStart);
            img.addEventListener('dragover', handleDragOver);
            img.addEventListener('drop', handleDrop);
            img.addEventListener('dragend', handleDragEnd);
            
            container.appendChild(img);
        });
    }

    function handleDragStart(e) {
        draggedItemIndex = parseInt(e.target.dataset.index);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetIndex = parseInt(e.target.dataset.index);
        if (draggedItemIndex !== null && !isNaN(targetIndex) && draggedItemIndex !== targetIndex) {
            const item = tempThemeImages.splice(draggedItemIndex, 1)[0];
            tempThemeImages.splice(targetIndex, 0, item);
            renderThemeImagePreviews();
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedItemIndex = null;
    }

    function confirmAddTheme() {
        const name = document.getElementById('readen-new-theme-name').value.trim() || '未命名套图';
        if (tempThemeImages.length === 0) {
            alert("请至少添加一张图片");
            return;
        }
        
        const svgList = tempThemeImages.map(src => `<img src="${src}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`);
        
        const newTheme = {
            name: name,
            count: svgList.length,
            svg: svgList[0],
            svgList: svgList
        };
        
        readenCoverThemes.push(newTheme);
        saveReadenAppData();
        renderCoverGallery();
        closeAddThemeModal();
    }

    function handleReadenImageResult(target, dataUrl) {
        if (!dataUrl) return;
        if (target === 'readenProfileAvatar') {
            readenProfileDraft = readenProfileDraft || {};
            readenProfileDraft.avatar = dataUrl;
            renderReadenProfileEditorPreview();
            if (typeof showToast === 'function') showToast('已选择新头像');
        } else if (target === 'readenBookCover') {
            tempBase64Image = dataUrl;
            const previewImg = document.getElementById('readen-cover-preview-img');
            const previewText = document.getElementById('readen-cover-preview-text');
            if (previewImg) {
                previewImg.src = tempBase64Image;
                previewImg.style.display = 'block';
            }
            if (previewText) previewText.style.display = 'none';
        } else if (target === 'readenEditBookCover') {
            tempEditBookCover = dataUrl;
            const previewImg = document.getElementById('readen-edit-cover-preview-img');
            const previewText = document.getElementById('readen-edit-cover-preview-text');
            if (previewImg) {
                previewImg.src = tempEditBookCover;
                previewImg.style.display = 'block';
            }
            if (previewText) previewText.style.display = 'none';
        } else if (target === 'readenThemeImage') {
            tempThemeImages.push(dataUrl);
            renderThemeImagePreviews();
        } else if (target === 'readenReaderBg') {
            closeReaderToolPanels();
            addReaderCustomBackground(dataUrl, '自定义背景_' + Date.now().toString().slice(-4));
        } else if (target === 'readenAnnotationImage') {
            if (readenPendingUserAnnotation) {
                readenPendingUserAnnotation.images = [{ src: dataUrl, name: '笔记图片', type: 'image/png', size: 0 }];
                renderReadenUserAnnotationPreview();
            }
        }
    }

    function initReadenImageMenuHooks() {
        const prevSetCustomAvatarUrl = window.setCustomAvatarUrlForTarget;
        window.setCustomAvatarUrlForTarget = function(target, url) {
            if (String(target).startsWith('readen')) {
                handleReadenImageResult(target, url);
                return;
            }
            if (typeof prevSetCustomAvatarUrl === 'function') {
                prevSetCustomAvatarUrl.apply(this, arguments);
            }
        };

        const prevHandleIconLocalUpload = window.handleIconLocalUpload;
        window.handleIconLocalUpload = function(event) {
            const target = window.currentEditingIcon || window.currentIconTarget || window._currentIconMenuTarget;
            if (String(target).startsWith('readen')) {
                const file = event.target?.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        handleReadenImageResult(target, e.target.result);
                        if (typeof closeIconMenu === 'function') closeIconMenu();
                    };
                    reader.readAsDataURL(file);
                    event.target.value = '';
                    return;
                }
            }
            if (typeof prevHandleIconLocalUpload === 'function') {
                return prevHandleIconLocalUpload.apply(this, arguments);
            }
        };

        const prevSaveIconUrl = window.saveIconUrl;
        window.saveIconUrl = function(urlInput) {
            const target = window.currentEditingIcon || window.currentIconTarget || window._currentIconMenuTarget;
            if (String(target).startsWith('readen')) {
                const val = (typeof urlInput === 'string' ? urlInput : document.getElementById('iconUrlInput')?.value || '').trim();
                if (val) {
                    handleReadenImageResult(target, val);
                }
                if (typeof closeIconUrlModal === 'function') closeIconUrlModal();
                if (typeof closeIconMenu === 'function') closeIconMenu();
                return;
            }
            if (typeof prevSaveIconUrl === 'function') {
                return prevSaveIconUrl.apply(this, arguments);
            }
        };
    }

    // --- 暴露给全局的接口 ---
    window.renderReadenProfilePage = renderReadenProfilePage;
    return {
        init: async function() {
            if (isInitialized) return;
            if (window.readenAppDataReady && typeof window.readenAppDataReady.then === 'function') {
                await window.readenAppDataReady;
            }
            
            container = document.getElementById('readenAppUI');
            if (!container) return Promise.reject(new Error('未找到 readenAppUI 容器'));

            // 注入 HTML
            container.innerHTML = htmlTemplate + htmlTemplatePart2;
            ensureReadenEpubStyles();
            injectReaderPreferencePanels();
            initReadenImageMenuHooks();

            // 缓存 DOM 元素
            els = {
                navItems: container.querySelectorAll('.nav-item'),
                pages: container.querySelectorAll('.page'),
                statsTabs: container.querySelectorAll('.s-tab'),
                statsContents: container.querySelectorAll('.tab-content'),
                btnToggleMenu: document.getElementById('readen-btn-toggle-menu'),
                bsDropdownOverlay: document.getElementById('readen-bs-dropdown-overlay'),
                bookActionOverlay: document.getElementById('readen-book-action-overlay')
            };

            bindEvents();
            window.addEventListener('pagehide', flushReaderPreferenceSave);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    flushReaderPreferenceSave();
                    // Hidden or locked time must not count as reading time.
                    if (readerSessionStartedAt && !readerSessionPaused) {
                        pauseReaderSessionForBackground();
                        saveReadenAppData();
                    }
                } else {
                    resumeReaderSessionFromBackground();
                }
            });
            restoreReaderRuntimePreferences();
            restoreReadenAppCustomFonts();

            // 恢复设置
            if (readenSettings.font && readenSettings.font !== 'inherit') {
                container.style.fontFamily = readenSettings.font;
            }
            if (readenSettings.bg) {
                applyBg(readenSettings.bg, readenSettings.bg.startsWith('#') ? 'color' : 'image');
            }

            restoreBookshelfPreferences();
            renderGroupTabs();
            renderBookList();
            renderReadenProfilePage();

            isInitialized = true;
            return Promise.resolve();
        },
        open: function() {
            if (!isInitialized) return;
            container.style.display = 'block';
            container.removeAttribute('aria-hidden');
            // 默认显示书架
            switchTab('bookshelf', document.querySelector('.nav-item[data-target="bookshelf"]'));
        },
        close: function() {
            if (!isInitialized) return;
            flushReaderPreferenceSave();
            container.style.display = 'none';
            container.setAttribute('aria-hidden', 'true');
        },
        // 暴露给内联 onclick 使用
        openBookActionMenu: openBookActionMenu,
        // Used by the reflection pane to generate or regenerate the current chapter's reflection.
        getChapterReflectionState: getReadenCurrentChapterReflectionState,
        requestCurrentChapterReflection: requestReadenCurrentChapterReflection,
        // Used by the chapter-end reflection block in the text.
        deleteChapterReflection: deleteReadenChapterReflection,
        refreshReaderPagination: refreshReaderPaginationKeepingPage,
        addFontByUrl: addFontByUrl
    };

})();
