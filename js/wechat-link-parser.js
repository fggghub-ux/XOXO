/**
 * Route supported social-media share links through Tonghuaji's server-side parser.
 * All other links keep using the existing public link parser unchanged.
 */
(function installWechatRichLinkParser() {
    'use strict';

    if (window.__wcRichLinkParserInstalled) return;
    if (typeof wcBuildPublicLinkParserUrl !== 'function') {
        console.warn('Wechat rich link parser skipped: base parser is not ready.');
        return;
    }

    const originalBuildPublicLinkParserUrl = wcBuildPublicLinkParserUrl;
    const supportedHostPatterns = [
        /(^|\.)douyin\.com$/i,
        /(^|\.)iesdouyin\.com$/i,
        /(^|\.)bilibili\.com$/i,
        /(^|\.)b23\.tv$/i,
        /(^|\.)kuaishou\.com$/i,
        /(^|\.)xiaohongshu\.com$/i,
        /(^|\.)xhslink\.com$/i
    ];

    function shouldUseRichParser(value) {
        const raw = String(value || '').trim();
        if (!raw) return false;
        try {
            const url = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw);
            return supportedHostPatterns.some(pattern => pattern.test(url.hostname));
        } catch (error) {
            return false;
        }
    }

    wcBuildPublicLinkParserUrl = function(link) {
        if (!shouldUseRichParser(link)) return originalBuildPublicLinkParserUrl(link);
        return '/api/tools/link-resolve?url=' + encodeURIComponent(String(link || '').trim());
    };

    window.wcBuildPublicLinkParserUrl = wcBuildPublicLinkParserUrl;
    window.__wcRichLinkParserInstalled = true;
})();
