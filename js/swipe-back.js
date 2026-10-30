/**
 * 全局右滑返回与多层级页面退出控制器
 */
(() => {
    const BACK_HISTORY_STATE_KEY = '__tonghuajiBackGuard';
    const EDGE_SWIPE_START_MAX_PX = 30;
    const EDGE_SWIPE_AXIS_LOCK_PX = 8;
    const EDGE_SWIPE_COMPLETE_PROGRESS = 0.34;
    const EDGE_SWIPE_MIN_FLING_DISTANCE_PX = 28;
    const EDGE_SWIPE_FLING_VELOCITY_PX_MS = 0.45;
    const EDGE_SWIPE_FINISH_MS = 145;
    const EDGE_SWIPE_CANCEL_MS = 170;
    const BACK_DEDUPE_WINDOW_MS = 260;
    const IS_ANDROID = /Android/i.test(navigator.userAgent || '');
    const WECHAT_ROOT_SWIPE_PAGE_IDS = new Set([
        'page-chat-list',
        'page-contacts',
        'page-moments',
        'page-profile',
        'page-wc-login',
        'page-wc-register'
    ]);

    const SWIPE_SUBPAGE_SELECTOR = [
        '.page.active',
        '.page.show',
        '.ct-page.is-active',
        '.applemusic-view-container.applemusic-active',
        '.calling-page.calling-active',
        '.msg-conversation-page.active',
        '.msg-conversation-page.show',
        '.contacts-detail-page.active',
        '.contacts-detail-page.show',
        '.cd-page.active',
        '.cd-page.show',
        '#wbEditorPage.active',
        '#wbGroupPage.active',
        '#accessAssistivePage.active',
        '#accessPageAdaptPage.active',
        '#genAboutPage.active',
        '#genUpdatePage.active',
        '#genPwaIconPage.active',
        '#api-page-add.active',
        '#voice-page-add.active',
        '#imggen-page-add.active',
        '[data-page].is-active',
        '[id^="page-"].active',
        '[id^="wc-page-"].active',
        '.slide-left'
    ].join(',');

    const SWIPE_APP_ROOT_SELECTOR = [
        '#todayAppUI',
        '#musicAppUI',
        '#callingAppUI',
        '#memoryAppUI',
        '#messageAppUI',
        '#msgAppUI',
        '#wechatAppUI',
        '#wechatUI',
        '#worldbookAppUI',
        '#contactsAppUI',
        '#contactsUI',
        '#mcpAppHost',
        '#mcpAppUI',
        '#readenAppUI',
        '#readingAppUI',
        '#photosAppUI',
        '#meetingAppUI',
        '#icityNewAppUI',
        '#icityAppUI',
        '#themeAppUI',
        '#accessibilitySettingsUI',
        '#generalSettingsUI',
        '#icloudAppUI',
        '#apiAppUI',
        '#voiceAppUI',
        '#imageGenAppUI',
        '#appleIdUI',
        '#loginSecurityUI',
        '#displaySettingsUI',
        '#messageNotificationSettingsUI',
        '#soundHapticsSettingsUI',
        '#standbyDiagnosticsUI',
        '#proactiveMessagesAppUI',
        '#weixinHotspotSettingsUI',
        '#screenTimeSettingsUI',
        '#settingsAppUI',
        '#twitterAppUI',
        '#character-phone-modal',
        '#fanfictionAppUI',
        '.throlephone',
        '.message-app-container',
        '.twitter-app-container',
        '.wechat-app-container',
        '.contacts-app-container',
        '.mcp-app-container',
        '.readen-app-container',
        '.photos-app-container',
        '.meeting-app-container',
        '.icity-new-app-wrapper',
        '.icity-app-container',
        '.theme-app-container'
    ].join(',');

    const SWIPE_PREVIOUS_SURFACE_IDS = Object.freeze({
        'page-chat-room': 'page-chat-list',
        'page-group-chat': 'page-chat-list',
        'wc-page-emoji-detail': 'wc-page-emoji-groups',
        'applemusic-view-playlist-detail': 'applemusic-view-library',
        'applemusic-view-playlists': 'applemusic-view-library',
        'applemusic-view-all-songs': 'applemusic-view-library',
        'applemusic-view-local-songs': 'applemusic-view-library',
        'applemusic-view-favorite-artists': 'applemusic-view-library',
        'applemusic-view-api-settings': 'applemusic-view-settings',
        'applemusic-view-floating-lyrics-settings': 'applemusic-view-settings',
        'applemusic-view-settings': 'applemusic-view-home'
    });

    const SWIPE_STYLE_PROPERTIES = [
        'display',
        'visibility',
        'opacity',
        'transform',
        'transition',
        'will-change',
        'z-index',
        'pointer-events',
        'box-shadow'
    ];

    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeStartTime = 0;
    let swipeLastX = 0;
    let swipeLastSampleTime = 0;
    let swipeVelocityX = 0;
    let swipeEligible = false;
    let swipeDragging = false;
    let swipeSurface = null;
    let swipePreviousSurface = null;
    let swipeSurfaceWidth = 0;
    let swipeSurfaceBaseTransform = 'none';
    let swipePreviousBaseTransform = 'none';
    let swipeSurfaceInlineStyle = null;
    let swipePreviousInlineStyle = null;
    let swipeFinishTimer = 0;
    let swipeRenderFrame = 0;
    let swipePendingDistance = 0;
    let suppressSystemBackUntil = 0;
    let suppressPostSwipeClickUntil = 0;
    let systemBackEnabled = false;
    let backHistoryGuardArmed = false;
    let lastBackHandledAt = 0;

    function getBackSettings() {
        return typeof appSettings !== 'undefined' && appSettings ? appSettings : null;
    }

    function isUnifiedBackEnabled() {
        const settings = getBackSettings();
        // Android browser/PWA defaults to enabled so system Back is intercepted even
        // for users whose saved settings predate the unified navigation switch.
        if (!settings) return IS_ANDROID;

        if (typeof settings.navigation_back_enabled === 'boolean') {
            return settings.navigation_back_enabled;
        }
        if (typeof settings.system_back_enabled === 'boolean' || typeof settings.swipe_back_enabled === 'boolean') {
            return settings.system_back_enabled === true || settings.swipe_back_enabled === true;
        }
        return IS_ANDROID;
    }

    function isEditableGestureTarget(target) {
        const element = target && target.nodeType === 1 ? target : target?.parentElement;
        if (!element || typeof element.closest !== 'function') return false;
        if (element.closest('input, textarea, select, [role="textbox"]')) return true;
        const editable = element.closest('[contenteditable]');
        return Boolean(editable && editable.getAttribute('contenteditable') !== 'false');
    }

    function requestGlobalBack() {
        const now = Date.now();
        if (now - lastBackHandledAt < BACK_DEDUPE_WINDOW_MS) return false;
        lastBackHandledAt = now;
        executeGlobalBack();
        return true;
    }

    function armBackHistoryGuard() {
        if (!systemBackEnabled || backHistoryGuardArmed) return;
        const rawState = window.history.state;
        const state = rawState && typeof rawState === 'object' ? rawState : {};
        // Always create a fresh consumable entry after a system Back. Reusing an
        // older guard state makes Android PWA Back work only once, then exit.
        window.history.pushState({
            ...state,
            [BACK_HISTORY_STATE_KEY]: true,
            __tonghuajiBackGuardNonce: Date.now()
        }, '', window.location.href);
        backHistoryGuardArmed = true;
    }

    function handleSystemBackEvent() {
        if (!systemBackEnabled) return;
        backHistoryGuardArmed = false;
        // Keep the PWA in the current document while Android/browser back is consumed.
        armBackHistoryGuard();

        // A custom interactive swipe owns this gesture once horizontal dragging starts.
        // Ignore the browser/system popstate generated by the same physical swipe so the
        // page cannot navigate twice or snap back after the custom transition commits.
        if (swipeDragging || Date.now() < suppressSystemBackUntil) return;

        if (swipeEligible) {
            restoreSwipePresentation();
            clearSwipeTracking();
        }
        requestGlobalBack();
    }

    function setUnifiedBackState(enabled) {
        systemBackEnabled = Boolean(enabled);
        window.removeEventListener('popstate', handleSystemBackEvent, false);
        if (!systemBackEnabled) {
            restoreSwipePresentation();
            clearSwipeTracking();
            return;
        }
        window.addEventListener('popstate', handleSystemBackEvent, false);
        armBackHistoryGuard();
    }

    // Keep the old public hook working while both legacy switches share one behavior.
    window.updateBackNavigationState = setUnifiedBackState;
    window.updateSystemBackState = setUnifiedBackState;

    function initializeUnifiedBackState() {
        setUnifiedBackState(isUnifiedBackEnabled());
    }

    if (document.readyState === 'complete') {
        setTimeout(initializeUnifiedBackState, 0);
    } else {
        window.addEventListener('load', () => setTimeout(initializeUnifiedBackState, 500), { once: true });
    }

    function captureInlineStyle(element, properties = SWIPE_STYLE_PROPERTIES) {
        if (!element) return null;
        const snapshot = {};
        properties.forEach(property => {
            snapshot[property] = {
                value: element.style.getPropertyValue(property),
                priority: element.style.getPropertyPriority(property)
            };
        });
        return snapshot;
    }

    function restoreInlineStyle(element, snapshot) {
        if (!element || !snapshot) return;
        Object.entries(snapshot).forEach(([property, state]) => {
            if (state.value) {
                element.style.setProperty(property, state.value, state.priority || '');
            } else {
                element.style.removeProperty(property);
            }
        });
    }

    function normalizeGestureElement(target) {
        let element = target && target.nodeType === 1 ? target : target?.parentElement;
        if (!element) return null;

        const ownerDocument = element.ownerDocument;
        if (ownerDocument && ownerDocument !== document) {
            try {
                const frame = ownerDocument.defaultView?.frameElement;
                if (frame) element = frame;
            } catch (_) {}
        }
        return element;
    }

    function getTopLevelTouchPoint(event, touch) {
        if (!touch) return null;

        let x = Number(touch.clientX) || 0;
        let y = Number(touch.clientY) || 0;
        let ownerDocument = touch.target?.ownerDocument || event?.target?.ownerDocument || document;

        // Touch.clientX/clientY are relative to the viewport of the document that
        // received the event. When the gesture originates inside an iframe, moving
        // the outer app also moves that iframe's local origin. Convert the point back
        // into the top-level viewport so dx stays stable while the outer app moves.
        while (ownerDocument && ownerDocument !== document) {
            try {
                const frame = ownerDocument.defaultView?.frameElement;
                if (!frame) break;
                const rect = frame.getBoundingClientRect();
                x += rect.left;
                y += rect.top;
                ownerDocument = frame.ownerDocument;
            } catch (_) {
                break;
            }
        }

        return { x, y };
    }

    function isSwipeBlockedByContext() {
        const readenReader = document.getElementById('readen-reader-container');
        return Boolean(
            readenReader &&
            (readenReader.classList.contains('active') || isElementActiveAndVisible(readenReader))
        );
    }

    function findInteractiveSwipeSurface(target) {
        const element = normalizeGestureElement(target);
        if (!element || typeof element.closest !== 'function') return null;

        // The fanfiction Shadow DOM owns its horizontal back gestures, preventing
        // the shared edge-swipe handler from completing the same gesture twice.
        if (element.closest('#fanfictionAppUI')) return null;

        const wechatRoot = element.closest('#wechatAppUI, #wechatUI, .wechat-app-container');
        if (wechatRoot && isElementActiveAndVisible(wechatRoot)) {
            const activeWechatPage = element.closest('.page.active, .page.show');
            if (
                activeWechatPage &&
                activeWechatPage.closest('#wechatAppUI, #wechatUI, .wechat-app-container') === wechatRoot &&
                WECHAT_ROOT_SWIPE_PAGE_IDS.has(activeWechatPage.id)
            ) {
                return wechatRoot;
            }
        }

        const subpage = element.closest(SWIPE_SUBPAGE_SELECTOR);
        if (subpage && isElementActiveAndVisible(subpage)) return subpage;

        const appRoot = element.closest(SWIPE_APP_ROOT_SELECTOR);
        if (appRoot && isElementActiveAndVisible(appRoot)) return appRoot;

        return null;
    }

    function resolvePreviousSwipeSurface(surface) {
        if (!surface) return null;
        const doc = surface.ownerDocument || document;

        if (surface.id === 'applemusic-view-artist') {
            const artistBackView = window.applemusicArtistBackView || 'search';
            return doc.getElementById('applemusic-view-' + artistBackView);
        }

        const previousId = SWIPE_PREVIOUS_SURFACE_IDS[surface.id];
        if (previousId) {
            const previous = doc.getElementById(previousId);
            if (previous && previous !== surface) return previous;
        }

        if (surface.matches?.('.ct-page.is-active')) {
            const currentPage = surface.dataset?.page || '';
            if (currentPage === 'npc-editor' || currentPage === 'contact-editor' || currentPage === 'user-editor') {
                return surface.parentElement?.querySelector?.('.ct-page[data-page="main"]') || null;
            }
        }

        return null;
    }

    function getTemporaryDisplayValue(element) {
        if (!element) return 'block';
        if (element.matches?.('.page, .ct-page')) return 'flex';
        return 'block';
    }

    function prepareSwipePresentation() {
        if (!swipeSurface || swipeDragging) return;

        const surfaceRect = swipeSurface.getBoundingClientRect();
        swipeSurfaceWidth = Math.max(surfaceRect.width || 0, window.innerWidth || 0, 1);
        swipeSurfaceBaseTransform = window.getComputedStyle(swipeSurface).transform || 'none';
        swipeSurfaceInlineStyle = captureInlineStyle(swipeSurface);
        swipePreviousSurface = resolvePreviousSwipeSurface(swipeSurface);

        swipeSurface.style.setProperty('transition', 'none', 'important');
        swipeSurface.style.setProperty('will-change', 'transform', 'important');
        swipeSurface.style.setProperty('z-index', '2147483001', 'important');

        if (swipePreviousSurface) {
            swipePreviousBaseTransform = window.getComputedStyle(swipePreviousSurface).transform || 'none';
            swipePreviousInlineStyle = captureInlineStyle(swipePreviousSurface);

            if (window.getComputedStyle(swipePreviousSurface).display === 'none') {
                swipePreviousSurface.style.setProperty('display', getTemporaryDisplayValue(swipePreviousSurface), 'important');
            }
            swipePreviousSurface.style.setProperty('visibility', 'visible', 'important');
            swipePreviousSurface.style.setProperty('opacity', '1', 'important');
            swipePreviousSurface.style.setProperty('transition', 'none', 'important');
            swipePreviousSurface.style.setProperty('will-change', 'transform', 'important');
            swipePreviousSurface.style.setProperty('z-index', '2147483000', 'important');
            swipePreviousSurface.style.setProperty('pointer-events', 'none', 'important');
        }

        swipeDragging = true;
        applyInteractiveSwipe(0, true);
    }

    function composeSwipeTransform(offset, baseTransform) {
        const base = baseTransform && baseTransform !== 'none' ? ' ' + baseTransform : '';
        return 'translate3d(' + offset + ', 0, 0)' + base;
    }

    function renderInteractiveSwipe(distancePx) {
        if (!swipeSurface) return;

        const clampedDistance = Math.max(0, Math.min(distancePx, swipeSurfaceWidth));
        const progress = Math.max(0, Math.min(1, clampedDistance / swipeSurfaceWidth));
        swipeSurface.style.setProperty(
            'transform',
            composeSwipeTransform(clampedDistance.toFixed(3) + 'px', swipeSurfaceBaseTransform),
            'important'
        );

        if (swipePreviousSurface) {
            const previousOffset = ((progress - 1) * 6).toFixed(3) + '%';
            swipePreviousSurface.style.setProperty(
                'transform',
                composeSwipeTransform(previousOffset, swipePreviousBaseTransform),
                'important'
            );
        }
    }

    function applyInteractiveSwipe(distancePx, immediate = false) {
        swipePendingDistance = distancePx;

        if (immediate) {
            if (swipeRenderFrame) {
                cancelAnimationFrame(swipeRenderFrame);
                swipeRenderFrame = 0;
            }
            renderInteractiveSwipe(swipePendingDistance);
            return;
        }

        if (swipeRenderFrame) return;
        swipeRenderFrame = requestAnimationFrame(() => {
            swipeRenderFrame = 0;
            renderInteractiveSwipe(swipePendingDistance);
        });
    }

    function restoreSwipePresentation() {
        if (swipeFinishTimer) {
            clearTimeout(swipeFinishTimer);
            swipeFinishTimer = 0;
        }
        if (swipeRenderFrame) {
            cancelAnimationFrame(swipeRenderFrame);
            swipeRenderFrame = 0;
        }
        swipePendingDistance = 0;

        restoreInlineStyle(swipeSurface, swipeSurfaceInlineStyle);
        restoreInlineStyle(swipePreviousSurface, swipePreviousInlineStyle);

        swipeSurface = null;
        swipePreviousSurface = null;
        swipeSurfaceWidth = 0;
        swipeSurfaceBaseTransform = 'none';
        swipePreviousBaseTransform = 'none';
        swipeSurfaceInlineStyle = null;
        swipePreviousInlineStyle = null;
        swipeDragging = false;
    }

    function releaseCompletedSwipePresentation(surfaceGestureStyle, previousGestureStyle) {
        if (swipeRenderFrame) {
            cancelAnimationFrame(swipeRenderFrame);
            swipeRenderFrame = 0;
        }
        swipePendingDistance = 0;

        const restoreIfGestureStillOwnsProperty = (element, originalSnapshot, gestureSnapshot, property) => {
            if (!element || !originalSnapshot || !gestureSnapshot) return;
            const currentValue = element.style.getPropertyValue(property);
            const currentPriority = element.style.getPropertyPriority(property);
            const gestureState = gestureSnapshot[property];
            const originalState = originalSnapshot[property];
            if (!gestureState || !originalState) return;

            // If the real back handler already changed this inline property, keep it.
            if (currentValue !== gestureState.value || currentPriority !== gestureState.priority) return;

            if (originalState.value) {
                element.style.setProperty(property, originalState.value, originalState.priority || '');
            } else {
                element.style.removeProperty(property);
            }
        };

        if (swipeSurface) {
            ['transform', 'transition', 'will-change', 'z-index', 'pointer-events', 'box-shadow']
                .forEach(property => restoreIfGestureStillOwnsProperty(
                    swipeSurface,
                    swipeSurfaceInlineStyle,
                    surfaceGestureStyle,
                    property
                ));
        }
        if (swipePreviousSurface) {
            ['display', 'visibility', 'opacity', 'transform', 'transition', 'will-change', 'z-index', 'pointer-events']
                .forEach(property => restoreIfGestureStillOwnsProperty(
                    swipePreviousSurface,
                    swipePreviousInlineStyle,
                    previousGestureStyle,
                    property
                ));
        }

        swipeSurface = null;
        swipePreviousSurface = null;
        swipeSurfaceWidth = 0;
        swipeSurfaceBaseTransform = 'none';
        swipePreviousBaseTransform = 'none';
        swipeSurfaceInlineStyle = null;
        swipePreviousInlineStyle = null;
        swipeDragging = false;
    }

    function clearSwipeTracking() {
        swipeEligible = false;
        swipeStartX = 0;
        swipeStartY = 0;
        swipeStartTime = 0;
        swipeLastX = 0;
        swipeLastSampleTime = 0;
        swipeVelocityX = 0;
    }

    function finishInteractiveSwipe(complete) {
        if (!swipeSurface) {
            restoreSwipePresentation();
            clearSwipeTracking();
            if (complete) requestGlobalBack();
            return;
        }

        swipeEligible = false;
        swipeDragging = false;

        const surface = swipeSurface;
        const previous = swipePreviousSurface;
        const surfaceBaseTransform = swipeSurfaceBaseTransform;
        const previousBaseTransform = swipePreviousBaseTransform;
        const targetDistance = Math.max(swipeSurfaceWidth, window.innerWidth || 0) + 12;
        const duration = complete ? EDGE_SWIPE_FINISH_MS : EDGE_SWIPE_CANCEL_MS;
        const easing = complete
            ? 'cubic-bezier(0.22, 0.61, 0.36, 1)'
            : 'cubic-bezier(0.22, 0.8, 0.3, 1)';

        surface.style.setProperty('transition', 'transform ' + duration + 'ms ' + easing, 'important');
        surface.style.setProperty(
            'transform',
            composeSwipeTransform((complete ? targetDistance : 0).toFixed(2) + 'px', surfaceBaseTransform),
            'important'
        );

        if (previous) {
            previous.style.setProperty('transition', 'transform ' + duration + 'ms ' + easing, 'important');
            previous.style.setProperty(
                'transform',
                composeSwipeTransform(complete ? '0%' : '-12%', previousBaseTransform),
                'important'
            );
        }

        if (complete) {
            suppressSystemBackUntil = Date.now() + duration + 700;
            suppressPostSwipeClickUntil = Date.now() + duration + 360;
        } else {
            suppressSystemBackUntil = Date.now() + duration + 220;
        }

        swipeFinishTimer = window.setTimeout(() => {
            swipeFinishTimer = 0;

            if (complete) {
                // Snapshot the gesture-owned inline values before the real back handler
                // runs. Cleanup must happen even when an app-specific back handler throws,
                // otherwise the next touch can restore an already-dismissed surface.
                const surfaceGestureStyle = captureInlineStyle(swipeSurface);
                const previousGestureStyle = captureInlineStyle(swipePreviousSurface);
                try {
                    requestGlobalBack();
                } catch (error) {
                    console.error('全局返回处理失败:', error);
                } finally {
                    releaseCompletedSwipePresentation(surfaceGestureStyle, previousGestureStyle);
                    clearSwipeTracking();
                }
                return;
            }

            restoreSwipePresentation();
            clearSwipeTracking();
        }, duration);
    }

    function handleGlobalTouchStart(e) {
        if (swipeFinishTimer) return;

        restoreSwipePresentation();
        clearSwipeTracking();

        if (!(systemBackEnabled || isUnifiedBackEnabled())) return;
        if (!e.touches || e.touches.length !== 1) return;
        if (isEditableGestureTarget(e.target)) return;
        // Music sliders own horizontal drags, including gestures starting at the left edge.
        if (e.target?.closest?.('#applemusic-progress-bar, #applemusic-popup-progress-bar, #applemusic-volume-bar')) return;
        if (isSwipeBlockedByContext()) return;

        const touch = e.touches[0];
        const point = getTopLevelTouchPoint(e, touch);
        if (!point || point.x > EDGE_SWIPE_START_MAX_PX) return;

        const surface = findInteractiveSwipeSurface(e.target);
        if (!surface) return;

        swipeStartX = point.x;
        swipeStartY = point.y;
        swipeStartTime = performance.now();
        swipeLastX = point.x;
        swipeLastSampleTime = swipeStartTime;
        swipeSurface = surface;
        swipeEligible = true;
    }

    function handleGlobalTouchMove(e) {
        if (!swipeEligible || !swipeSurface || !e.touches || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const point = getTopLevelTouchPoint(e, touch);
        if (!point) return;

        const dx = point.x - swipeStartX;
        const dy = point.y - swipeStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (!swipeDragging) {
            if (absY >= EDGE_SWIPE_AXIS_LOCK_PX && absY > absX * 1.15) {
                restoreSwipePresentation();
                clearSwipeTracking();
                return;
            }
            if (dx < -EDGE_SWIPE_AXIS_LOCK_PX) {
                restoreSwipePresentation();
                clearSwipeTracking();
                return;
            }
            if (dx < EDGE_SWIPE_AXIS_LOCK_PX || absX <= absY * 1.05) return;
            prepareSwipePresentation();
            // Prevent Android/browser native back from committing a second navigation
            // for the same physical edge swipe while our interactive gesture is active.
            suppressSystemBackUntil = Date.now() + 1600;
        }

        if (!swipeDragging) return;
        if (e.cancelable) e.preventDefault();

        const now = performance.now();
        const sampleDt = Math.max(now - swipeLastSampleTime, 1);
        const sampleVelocity = (point.x - swipeLastX) / sampleDt;
        swipeVelocityX = swipeVelocityX * 0.65 + sampleVelocity * 0.35;
        swipeLastX = point.x;
        swipeLastSampleTime = now;

        applyInteractiveSwipe(dx);
    }

    function handleGlobalTouchEnd(e) {
        if (!swipeEligible && !swipeDragging) return;

        const changedTouch = e.changedTouches && e.changedTouches[0];
        const endPoint = changedTouch ? getTopLevelTouchPoint(e, changedTouch) : null;
        const endX = endPoint ? endPoint.x : swipeLastX;
        const endY = endPoint ? endPoint.y : swipeStartY;
        const dx = Math.max(0, endX - swipeStartX);
        const dy = endY - swipeStartY;

        if (!swipeDragging) {
            const shouldFallbackBack =
                dx >= 52 &&
                Math.abs(dx) > Math.abs(dy) * 1.25;

            restoreSwipePresentation();
            clearSwipeTracking();
            if (shouldFallbackBack) requestGlobalBack();
            return;
        }

        applyInteractiveSwipe(dx, true);
        const progress = Math.max(0, Math.min(1, dx / Math.max(swipeSurfaceWidth, 1)));
        const shouldComplete =
            progress >= EDGE_SWIPE_COMPLETE_PROGRESS ||
            (dx >= EDGE_SWIPE_MIN_FLING_DISTANCE_PX && swipeVelocityX >= EDGE_SWIPE_FLING_VELOCITY_PX_MS);

        finishInteractiveSwipe(shouldComplete);
    }

    function handleGlobalTouchCancel() {
        if (swipeDragging) {
            const dx = Math.max(0, swipeLastX - swipeStartX);
            const progress = Math.max(0, Math.min(1, dx / Math.max(swipeSurfaceWidth, 1)));
            const shouldComplete =
                progress >= EDGE_SWIPE_COMPLETE_PROGRESS ||
                (dx >= EDGE_SWIPE_MIN_FLING_DISTANCE_PX && swipeVelocityX >= EDGE_SWIPE_FLING_VELOCITY_PX_MS);
            finishInteractiveSwipe(shouldComplete);
            return;
        }
        suppressSystemBackUntil = Date.now() + 220;
        restoreSwipePresentation();
        clearSwipeTracking();
    }

    function handleGlobalPointerUpCapture(e) {
        if (!swipeDragging) return;
        if (e.cancelable) e.preventDefault();
        e.stopImmediatePropagation();
    }

    function handleGlobalClickCapture(e) {
        if (Date.now() >= suppressPostSwipeClickUntil) return;
        if (e.cancelable) e.preventDefault();
        e.stopImmediatePropagation();
    }

    document.addEventListener('pointerup', handleGlobalPointerUpCapture, { capture: true, passive: false });
    document.addEventListener('click', handleGlobalClickCapture, true);
    document.addEventListener('touchstart', handleGlobalTouchStart, { capture: true, passive: true });
    document.addEventListener('touchmove', handleGlobalTouchMove, { capture: true, passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd, { capture: true, passive: true });
    document.addEventListener('touchcancel', handleGlobalTouchCancel, { capture: true, passive: true });

    // Bind swipe-back only when iframe documents are created or reloaded.
    function bindIframeSwipeListener(frame) {
        if (!frame) return;
        try {
            const doc = frame.contentDocument;
            if (doc && !doc._swipeBackBound) {
                doc._swipeBackBound = true;
                doc.addEventListener('touchstart', handleGlobalTouchStart, { capture: true, passive: true });
                doc.addEventListener('touchmove', handleGlobalTouchMove, { capture: true, passive: false });
                doc.addEventListener('touchend', handleGlobalTouchEnd, { capture: true, passive: true });
                doc.addEventListener('touchcancel', handleGlobalTouchCancel, { capture: true, passive: true });
            }
        } catch (_) {}

        if (!frame._swipeBackLoadBound) {
            frame._swipeBackLoadBound = true;
            frame.addEventListener('load', () => bindIframeSwipeListener(frame));
        }
    }

    function setupIframeSwipeListener(root = document) {
        if (root?.matches?.('iframe')) bindIframeSwipeListener(root);
        root?.querySelectorAll?.('iframe').forEach(bindIframeSwipeListener);
    }

    setupIframeSwipeListener();
    if (typeof MutationObserver === 'function') {
        const iframeSwipeObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node?.nodeType === 1) setupIframeSwipeListener(node);
                });
            });
        });
        iframeSwipeObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    function isElementActiveAndVisible(el) {
        if (!el) return false;
        if (el.classList.contains('show') || el.classList.contains('is-open')) return true;
        if (el.classList.contains('active') && !el.classList.contains('page') && !el.classList.contains('calling-page')) return true;
        const comp = window.getComputedStyle(el);
        if (comp.display !== 'none' && comp.visibility !== 'hidden' && parseFloat(comp.opacity) > 0) {
            return true;
        }
        return false;
    }

    function executeGlobalBack() {
        // 沉浸式阅读器优先保护：在阅读器激活状态下禁止手势退出 APP
        const readenReader = document.getElementById('readen-reader-container');
        if (readenReader && (readenReader.classList.contains('active') || isElementActiveAndVisible(readenReader))) {
            const chapterDrawer = document.getElementById('readen-reader-chapter-drawer');
            if (chapterDrawer) {
                const backdrop = chapterDrawer.querySelector('.readen-reader-chapter-backdrop');
                if (backdrop) backdrop.click();
                return;
            }
            const activeToolPanel = document.querySelector('.reader-tool-panel.active');
            if (activeToolPanel) {
                activeToolPanel.classList.remove('active');
                return;
            }
            const fontMenu = document.getElementById('readen-reader-font-menu');
            if (fontMenu && fontMenu.classList.contains('show')) {
                fontMenu.classList.remove('show');
                return;
            }
            // 处于正文阅读状态，完全禁止滑动返回退出页面
            return;
        }

        // -------------------------------------------------------------
        // 层级 1：各类弹窗、抽屉、菜单（最高优先级，优先关闭遮罩弹窗）
        // -------------------------------------------------------------

        const modalOverlays = [
            '#quickApiPresetCenterModalOverlay',
            '#apiHelpModalOverlay.show',
            '#soundPickerDrawerOverlay.show',
            '#appleIdProfileSheetOverlay.show',
            '#lsSheetOverlay.show',
            '#backupReminderSheetOverlay.show',
            '#genInstallSheetOverlay.show',
            '#genResetSheetOverlay.show',
            '#accessSlotPickerOverlay.show',
            '#apiDrawerOverlay.show',
            '#voiceDrawerOverlay.show',
            '#imggenDrawerOverlay.show',
            '#wbGroupSelectSheetOverlay.show',
            '#wbFilterMenuOverlay.show',
            '#wbContextMenuOverlay.show',
            '#iconMenuOverlay.show',
            '#wallpaperMenuOverlay.show',
            '#univSelOverlay.show',
            '#searchDrawerOverlay.show',
            '#widgetPickerOverlay.show',
            '#wcBubbleMenuOverlay.show',
            '#wcUserMaskDrawerOverlay.show',
            '#wcMoveSheetOverlay.show',
            '#wcMomentsEditOverlay.show',
            '#wcProfileEditOverlay.show',
            '#wcProfileDetailOverlay.show',
            '#wcBatchImportOverlay.show',
            '#wcImageBottomSheetOverlay.show',
            '#wcEditMsgOverlay.show',
            '#wcVoiceMsgOverlay.show',
            '#wcTokenModalOverlay.show',
            '#wcFamilyCardModalOverlay.show',
            '#wcApOverlay.show',
            '#wcGlobalPresetDrawerOverlay.show',
            '#wcAccountSwitchDrawerOverlay.show',
            '#wcChatBgMenuOverlay.show',
            '#wcProfileAvatarMenuOverlay.show',
            '#wcAddFriendPanel.show',
            '#customDialogOverlay.show',
            '.ls-sheet-overlay.show',
            '.api-drawer-overlay.show',
            '.icon-menu-overlay.show'
        ];

        for (const selector of modalOverlays) {
            const el = document.querySelector(selector);
            if (el && isElementActiveAndVisible(el)) {
                el.click();
                return;
            }
        }

        const wbSearch = document.getElementById('wbSearchOverlay');
        if (wbSearch && wbSearch.classList.contains('show') && typeof wbCloseSearch === 'function') {
            wbCloseSearch();
            return;
        }

        const folderOverlay = document.getElementById('folderOverlay');
        if (folderOverlay && folderOverlay.classList.contains('active') && typeof closeFolder === 'function') {
            closeFolder();
            return;
        }

        // -------------------------------------------------------------
        // 层级 2：音乐 APP（全屏播放器 ➔ 各类弹窗 ➔ 各二级视图 ➔ 音乐主页）
        // -------------------------------------------------------------
        const musicUI = document.querySelector('#musicAppUI');
        if (musicUI && (musicUI.style.display !== 'none' || musicUI.classList.contains('show'))) {
            // 2.1 全屏播放器内部子视图（待播播放列表 / 歌词页 ➔ 优先切回播放器主界面）
            const fullPlayer = document.getElementById('applemusic-full-player');
            if (fullPlayer && fullPlayer.classList.contains('applemusic-active')) {
                const playerListView = document.getElementById('applemusic-player-list-view');
                if (playerListView && (playerListView.style.display === 'flex' || playerListView.style.display === 'block')) {
                    if (typeof applemusicTogglePlayerListView === 'function') {
                        applemusicTogglePlayerListView();
                        return;
                    }
                }
                const playerLyricsView = document.getElementById('applemusic-player-lyrics-view');
                if (playerLyricsView && (playerLyricsView.style.display === 'flex' || playerLyricsView.style.display === 'block')) {
                    if (typeof applemusicToggleLyricsView === 'function') {
                        applemusicToggleLyricsView();
                        return;
                    }
                }
                if (typeof applemusicClosePlayer === 'function') {
                    applemusicClosePlayer();
                    return;
                }
            }

            // 2.2 灵动岛弹窗内部列表视图
            const popupOverlay = document.getElementById('applemusic-island-popup-overlay');
            if (popupOverlay && popupOverlay.classList.contains('active')) {
                const popupListView = document.getElementById('applemusic-popup-list-view');
                if (popupListView && (popupListView.style.display === 'flex' || popupListView.style.display === 'block')) {
                    if (typeof applemusicTogglePopupListView === 'function') {
                        applemusicTogglePopupListView();
                        return;
                    }
                }
                if (typeof applemusicCloseIslandPopup === 'function') {
                    applemusicCloseIslandPopup();
                    return;
                }
            }

            // 2.3 音乐各操作弹窗
            const musicModals = [
                { id: 'applemusic-modal-edit-playlist', close: () => typeof applemusicCloseEditPlaylistModal === 'function' && applemusicCloseEditPlaylistModal() },
                { id: 'applemusic-modal-global-edit-playlist', close: () => typeof applemusicCloseGlobalEditPlaylistModal === 'function' && applemusicCloseGlobalEditPlaylistModal() },
                { id: 'applemusic-modal-import-playlist', close: () => typeof applemusicCloseImportPlaylistModal === 'function' && applemusicCloseImportPlaylistModal() },
                { id: 'applemusic-modal-local-music', close: () => typeof applemusicCloseLocalMusicModal === 'function' && applemusicCloseLocalMusicModal() },
                { id: 'applemusic-modal-create-playlist', close: () => typeof applemusicCloseCreatePlaylistModal === 'function' && applemusicCloseCreatePlaylistModal() },
                { id: 'applemusic-modal-invite-listen', close: () => typeof applemusicCloseInviteModal === 'function' && applemusicCloseInviteModal() },
                { id: 'applemusic-qr-modal', close: () => typeof applemusicCloseQrModal === 'function' && applemusicCloseQrModal() },
                { id: 'applemusic-share-char-modal', close: () => typeof applemusicCloseShareCharModal === 'function' && applemusicCloseShareCharModal() }
            ];
            for (const m of musicModals) {
                const mel = document.getElementById(m.id);
                if (mel && (mel.classList.contains('applemusic-active') || mel.style.display === 'flex' || mel.style.display === 'block')) {
                    m.close();
                    return;
                }
            }

            // 2.4 歌单详情页（返回资料库，绝不退出 APP）
            const plDetail = document.getElementById('applemusic-view-playlist-detail');
            if (plDetail && plDetail.classList.contains('applemusic-active')) {
                if (typeof applemusicSwitchView === 'function') {
                    applemusicSwitchView('library');
                    return;
                }
            }

            // 2.5 歌手详情页（返回上一来源视图）
            const artistView = document.getElementById('applemusic-view-artist');
            if (artistView && artistView.classList.contains('applemusic-active')) {
                if (typeof applemusicSwitchView === 'function') {
                    applemusicSwitchView(window.applemusicArtistBackView || 'search');
                    return;
                }
            }

            // 2.6 歌单列表、全部歌曲、已导入、收藏艺人等二级页面返回资料库
            const subViewsToLibrary = [
                'applemusic-view-playlists',
                'applemusic-view-all-songs',
                'applemusic-view-local-songs',
                'applemusic-view-favorite-artists'
            ];
            for (const vid of subViewsToLibrary) {
                const vel = document.getElementById(vid);
                if (vel && vel.classList.contains('applemusic-active')) {
                    if (typeof applemusicSwitchView === 'function') {
                        applemusicSwitchView('library');
                        return;
                    }
                }
            }

            // 2.7 API设置、悬浮歌词设置返回设置主页
            const apiSetView = document.getElementById('applemusic-view-api-settings');
            const floatLyricSetView = document.getElementById('applemusic-view-floating-lyrics-settings');
            if (apiSetView && apiSetView.classList.contains('applemusic-active')) {
                if (typeof applemusicSwitchView === 'function') {
                    applemusicSwitchView('settings');
                    return;
                }
            }
            if (floatLyricSetView && floatLyricSetView.classList.contains('applemusic-active')) {
                if (typeof applemusicSwitchView === 'function') {
                    applemusicSwitchView('settings');
                    return;
                }
            }

            // 2.8 设置页返回首页
            const setView = document.getElementById('applemusic-view-settings');
            if (setView && setView.classList.contains('applemusic-active')) {
                if (typeof applemusicSwitchView === 'function') {
                    applemusicSwitchView('home');
                    return;
                }
            }

            // 2.9 搜索页搜索结果返回搜索首页
            const searchResultsSection = document.getElementById('applemusic-search-results-section');
            const recentSearchSection = document.getElementById('applemusic-recent-search-section');
            const searchView = document.getElementById('applemusic-view-search');
            if (searchView && searchView.classList.contains('applemusic-active')) {
                if (searchResultsSection && searchResultsSection.style.display !== 'none' && searchResultsSection.style.display !== '') {
                    searchResultsSection.style.display = 'none';
                    if (recentSearchSection) recentSearchSection.style.display = 'block';
                    const searchInput = document.getElementById('applemusic-search-input');
                    if (searchInput) searchInput.value = '';
                    return;
                }
            }

            // 2.10 确实处于音乐主界面时，退出音乐 APP
            if (typeof closeAppleMusicApp === 'function') {
                closeAppleMusicApp();
                return;
            } else if (typeof closeMusicApp === 'function') {
                closeMusicApp();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 3：电话 APP（#callingAppUI）
        // -------------------------------------------------------------
        const callingUI = document.getElementById('callingAppUI');
        if (callingUI && (callingUI.style.display === 'flex' || callingUI.getAttribute('aria-hidden') === 'false')) {
            // 3.1 通话中全屏界面
            const callingScreen = document.getElementById('calling-screen-overlay');
            if (callingScreen && callingScreen.classList.contains('calling-screen-active')) {
                if (window.CallApp && typeof window.CallApp.endCall === 'function') {
                    window.CallApp.endCall();
                    return;
                }
            }

            // 3.2 联系人卡片详情页
            const contactDetailPage = document.getElementById('calling-page-contact-detail');
            if (contactDetailPage && contactDetailPage.classList.contains('calling-active')) {
                const backBtn = document.getElementById('calling-detail-btn-back');
                if (backBtn) {
                    backBtn.click();
                    return;
                }
            }

            // 3.3 最近通话编辑模式
            if (window.CallApp && window.CallApp.isEditingRecents) {
                window.CallApp.toggleRecentsEditMode(false);
                return;
            }

            // 3.4 退出电话 APP 返回桌面
            if (window.CallApp && typeof window.CallApp.close === 'function') {
                window.CallApp.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 4：记忆库 APP（#memoryAppUI）
        // -------------------------------------------------------------
        const memoryUI = document.getElementById('memoryAppUI');
        if (memoryUI && (memoryUI.classList.contains('is-open') || memoryUI.getAttribute('aria-hidden') === 'false')) {
            // 4.1 记忆库各子弹窗
            if (memoryUI.classList.contains('is-configuring-summary')) {
                const cancelBtn = memoryUI.querySelector('[data-memory-action="close-summary-settings"]');
                if (cancelBtn) { cancelBtn.click(); return; }
            }
            if (memoryUI.classList.contains('is-viewing-summary')) {
                const closeBtn = memoryUI.querySelector('[data-memory-action="close-summary-panel"]');
                if (closeBtn) { closeBtn.click(); return; }
            }
            if (memoryUI.classList.contains('is-composing')) {
                const cancelBtn = memoryUI.querySelector('[data-memory-action="close-composer"]');
                if (cancelBtn) { cancelBtn.click(); return; }
            }

            // 4.2 iframe 内部各浮层
            const memFrame = memoryUI.querySelector('iframe');
            if (memFrame && memFrame.contentDocument) {
                const doc = memFrame.contentDocument;
                const activeOverlay = doc.querySelector('.switcher-overlay.is-visible, #switcherOverlay.is-visible, #userSwitcherOverlay.is-visible');
                if (activeOverlay) {
                    activeOverlay.classList.remove('is-visible');
                    return;
                }
            }

            // 4.3 记忆库主界面退出返回桌面
            if (window.MemoryApp && typeof window.MemoryApp.close === 'function') {
                window.MemoryApp.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 5：信息 APP（#messageAppUI）
        // -------------------------------------------------------------
        const msgUI = document.querySelector('#messageAppUI, #msgAppUI, .message-app-container');
        if (msgUI && isElementActiveAndVisible(msgUI)) {
            const convPage = msgUI.querySelector('.msg-conversation-page.active, .msg-conversation-page.show, #msgConversationPage.active, #msgConversationPage.show, .slide-left');
            if (convPage) {
                const backBtn = msgUI.querySelector('.active [class*="back"], .msg-back-btn, [class*="msg-back"]');
                if (backBtn && backBtn.offsetParent !== null) {
                    backBtn.click();
                    return;
                }
                if (typeof closeMsgConversation === 'function') {
                    closeMsgConversation();
                    return;
                }
            }

            if (typeof closeMessageApp === 'function') {
                closeMessageApp();
                return;
            } else if (window.MessageApp && typeof window.MessageApp.close === 'function') {
                window.MessageApp.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 6：微信 APP（聊天设置 ➔ 聊天室 ➔ 朋友圈 ➔ 收藏 ➔ 微信主页）
        // -------------------------------------------------------------
        const wechatUI = document.querySelector('#wechatAppUI, #wechatUI, .wechat-app-container');
        if (wechatUI && isElementActiveAndVisible(wechatUI)) {
            if (window.WcGroupChat && document.getElementById('wcGroupPanel') && !document.getElementById('wcGroupPanel').hidden) {
                window.WcGroupChat.closePanel();
                return;
            }
            if (window.WcGroupChat && document.getElementById('page-group-chat')?.classList.contains('active')) {
                window.WcGroupChat.close();
                return;
            }
            // 6.1 悬浮面板与下拉菜单
            const funcPanel = document.getElementById('wcFunctionPanel');
            if (funcPanel && funcPanel.classList.contains('show') && typeof wcCloseFunctionPanel === 'function') {
                wcCloseFunctionPanel();
                return;
            }
            const emojiPanel = document.getElementById('wcEmojiPanel');
            if (emojiPanel && emojiPanel.classList.contains('show') && typeof wcCloseEmojiPanel === 'function') {
                wcCloseEmojiPanel();
                return;
            }
            const dropdownMenu = document.getElementById('wc-dropdown-menu');
            if (dropdownMenu && dropdownMenu.classList.contains('show') && typeof wcCloseMenu === 'function') {
                wcCloseMenu();
                return;
            }

            // 6.2 微信收藏页面
            const favModal = document.querySelector('#page-favorites, #page-wc-favorites, #page-favorite, .wc-favorites-page, #wcFavoritesPage, #wcFavoritesModal, #wc-favorites-modal');
            if (favModal && (favModal.classList.contains('active') || favModal.classList.contains('show') || (favModal.style.display && favModal.style.display !== 'none'))) {
                const favBack = favModal.querySelector('[class*="back"], .wc-nav-back, .back-btn, .room-icon-btn');
                if (favBack && favBack.offsetParent !== null) {
                    favBack.click();
                    return;
                }
                if (typeof wcCloseFavoritesPage === 'function') { wcCloseFavoritesPage(); return; }
                if (typeof wcCloseFavorites === 'function') { wcCloseFavorites(); return; }
                favModal.classList.remove('active', 'show');
                favModal.style.display = 'none';
                return;
            }

            // 6.3 微信具体二级模态框/页面
            const wcSubpageList = [
                { id: 'wc-settings-modal', close: () => typeof wcHandleSettingsBack === 'function' ? wcHandleSettingsBack() : null },
                { id: 'wc-theme-modal', close: () => typeof wcHandleThemeBack === 'function' ? wcHandleThemeBack() : null },
                { id: 'wcComposeModal', close: () => typeof wcCloseComposeModal === 'function' ? wcCloseComposeModal() : null },
                { id: 'page-wc-transfer', close: () => typeof wcCloseTransferPage === 'function' ? wcCloseTransferPage() : null },
                { id: 'page-wechat-change-pay-pwd', close: () => typeof wcCloseWechatChangePayPwdPage === 'function' ? wcCloseWechatChangePayPwdPage() : null },
                { id: 'page-wallet-settings', close: () => typeof wcCloseWalletSettings === 'function' ? wcCloseWalletSettings() : null },
                { id: 'page-family-cards', close: () => typeof wcCloseFamilyCardList === 'function' ? wcCloseFamilyCardList() : null },
                { id: 'page-wallet', close: () => typeof wcCloseWallet === 'function' ? wcCloseWallet() : null },
                { id: 'page-wechat-change-pwd', close: () => typeof wcCloseWechatChangePwdPage === 'function' ? wcCloseWechatChangePwdPage() : null },
                { id: 'page-wechat-storage', close: () => typeof wcCloseWechatStorage === 'function' ? wcCloseWechatStorage() : null },
                { id: 'page-wechat-personalize', close: () => typeof wcCloseWechatPersonalize === 'function' ? wcCloseWechatPersonalize() : null },
                { id: 'page-wechat-chat-manage', close: () => typeof wcCloseChatManagePage === 'function' ? wcCloseChatManagePage() : null },
                { id: 'page-wechat-settings', close: () => typeof wcCloseWechatSettings === 'function' ? wcCloseWechatSettings() : null },
                { id: 'page-wc-chat-search', close: () => typeof wcCloseChatSearch === 'function' ? wcCloseChatSearch() : null },
                { id: 'page-add-friend-detail', close: () => typeof wcCloseAddFriendDetail === 'function' ? wcCloseAddFriendDetail() : null },
                { id: 'page-contact-profile', close: () => typeof wcCloseContactProfile === 'function' ? wcCloseContactProfile() : null },
                { id: 'wc-page-emoji-detail', close: () => typeof wcBackToEmojiGroups === 'function' ? wcBackToEmojiGroups() : null },
                { id: 'wc-page-emoji-groups', close: () => typeof wcCloseEmojiApp === 'function' ? wcCloseEmojiApp() : null }
            ];

            for (const item of wcSubpageList) {
                const el = document.getElementById(item.id);
                if (el && (el.classList.contains('active') || el.classList.contains('show'))) {
                    item.close();
                    return;
                }
            }

            // 6.4 微信聊天室页面
            const chatRoom = document.getElementById('page-chat-room');
            if (chatRoom && (chatRoom.classList.contains('active') || chatRoom.classList.contains('show'))) {
                if (typeof wcCloseChat === 'function') { wcCloseChat(); return; }
            }

            // 6.5 微信朋友圈页面
            const momentsPage = document.getElementById('page-moments');
            if (momentsPage && (momentsPage.classList.contains('active') || momentsPage.classList.contains('show'))) {
                const momentsBack = momentsPage.querySelector('[class*="back"], .wc-nav-back');
                if (momentsBack && momentsBack.offsetParent !== null) {
                    momentsBack.click();
                    return;
                }
            }

            // 6.6 微信根主页面（直接退出微信 APP 返回桌面）
            // A completed root swipe has already animated the whole app off-screen.
            // Hide immediately before gesture styles are restored so the current page
            // cannot be painted back for a frame during cleanup.
            const isWechatRootSwipeExit = swipeSurface === wechatUI;
            const wechatCloseOptions = isWechatRootSwipeExit ? { immediate: true, fromSwipe: true } : undefined;
            if (typeof window.closeWechatApp === 'function') {
                window.closeWechatApp(wechatCloseOptions);
                return;
            } else if (typeof closeWechatApp === 'function') {
                closeWechatApp(wechatCloseOptions);
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 7：Twitter / X（内部浮层 ➔ 根页面退出）
        // -------------------------------------------------------------
        const twitterUI = document.getElementById('twitterAppUI');
        if (twitterUI && isElementActiveAndVisible(twitterUI)) {
            const twitterApp = window.TwitterApp || window.XApp;
            const twitterBackLayers = [
                { id: 'xReplyFullscreenLayer', method: 'closeReplyFullscreen' },
                { id: 'xDetailActionSheetLayer', method: 'closeDetailActionSheet' },
                { id: 'xTrendActionSheetLayer', method: 'closeTrendActionSheet' },
                { id: 'xSearchPageLayer', method: 'closeSearchPage' },
                { id: 'xAccountSheetLayer', method: 'closeAccountSheet' },
                { id: 'xSettingsLayer', method: 'closeSettings' },
                { id: 'xProfileEditLayer', method: 'closeProfileEditor' },
                { id: 'xDetailLayer', method: 'closeDetail' },
                { id: 'xProfileLayer', method: 'closeProfile' },
                { id: 'xComposeLayer', method: 'closeCompose' },
                { id: 'xDrawerPageLayer', method: 'closeDrawerPage' },
                { id: 'xDrawerLayer', method: 'closeDrawer' },
                { id: 'xMessageThread', method: 'closeMessageThread' }
            ];

            for (const item of twitterBackLayers) {
                const layer = document.getElementById(item.id);
                if (!layer || !layer.classList.contains('is-open')) continue;
                if (twitterApp && typeof twitterApp[item.method] === 'function') {
                    twitterApp[item.method]();
                } else {
                    layer.classList.remove('is-open');
                }
                return;
            }

            if (twitterApp && typeof twitterApp.close === 'function') {
                twitterApp.close();
                return;
            }
            if (typeof window.closeTwitterApp === 'function') {
                window.closeTwitterApp();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 8：世界书 APP（#worldbookAppUI）
        // -------------------------------------------------------------
        const wbUI = document.getElementById('worldbookAppUI');
        if (wbUI && isElementActiveAndVisible(wbUI)) {
            const editorPage = document.getElementById('wbEditorPage');
            if (editorPage && editorPage.classList.contains('active')) {
                if (typeof wbCloseEditor === 'function') wbCloseEditor();
                return;
            }
            const groupPage = document.getElementById('wbGroupPage');
            if (groupPage && groupPage.classList.contains('active')) {
                if (typeof wbCloseGroup === 'function') wbCloseGroup();
                return;
            }
            const isWorldbookRootSwipeExit = swipeSurface === wbUI;
            if (typeof closeWorldbookApp === 'function') {
                closeWorldbookApp(isWorldbookRootSwipeExit ? { immediate: true, fromSwipe: true } : undefined);
            }
            return;
        }

        // -------------------------------------------------------------
        // 层级 9：通讯录 APP（#contactsAppUI）
        // -------------------------------------------------------------
        const contactsUI = document.querySelector('#contactsAppUI, #contactsUI, .contacts-app-container');
        if (contactsUI && isElementActiveAndVisible(contactsUI)) {
            const qrModal = contactsUI.querySelector('#ctQrModal.is-open');
            if (qrModal) {
                const closeQr = qrModal.querySelector('.ct-qr-modal-close');
                if (closeQr) { closeQr.click(); return; }
            }

            const contactDialog = contactsUI.querySelector('#ctDialogOverlay.is-active');
            if (contactDialog) {
                const cancelDialog = contactDialog.querySelector('[data-action="cancel-dialog"]');
                if (cancelDialog) { cancelDialog.click(); return; }
            }

            const pickerOverlay = contactsUI.querySelector('#ctPickerOverlay.is-active');
            if (pickerOverlay) {
                const closePicker = pickerOverlay.querySelector('[data-action="close-picker"]');
                if (closePicker) { closePicker.click(); return; }
            }

            const avatarMenu = contactsUI.querySelector('#ctContactAvatarMenuOverlay.is-active');
            if (avatarMenu) {
                avatarMenu.click();
                return;
            }

            const activeContactsPage = contactsUI.querySelector('.ct-page.is-active');
            const activeContactsPageName = activeContactsPage?.dataset?.page || '';
            const currentPageBackAction = {
                voice: 'back-contact',
                appearance: 'back-contact',
                'npc-editor': 'cancel-npc',
                'contact-editor': 'back-main',
                'user-editor': 'back-main'
            }[activeContactsPageName];

            if (currentPageBackAction) {
                const pageBackButton = activeContactsPage.querySelector('[data-action="' + currentPageBackAction + '"]');
                if (pageBackButton) {
                    pageBackButton.click();
                    return;
                }
            }

            const legacyDetail = contactsUI.querySelector('.contacts-detail-page.active, .contacts-detail-page.show, #contactDetailPage.active, #contactDetailPage.show, #contactsDetailPage.active, #contactsDetailPage.show, .cd-page.active, .cd-page.show, .slide-left');
            if (legacyDetail || (window.ContactsApp && window.ContactsApp.isDetailOpen && window.ContactsApp.isDetailOpen())) {
                const backBtn = contactsUI.querySelector('.active [class*="back"], .contacts-back-btn, .cd-back-btn, [class*="contacts-back"]');
                if (backBtn && backBtn.offsetParent !== null) {
                    backBtn.click();
                    return;
                }
                if (typeof closeContactDetail === 'function') { closeContactDetail(); return; }
                if (typeof closeContactsDetail === 'function') { closeContactsDetail(); return; }
            }

            if (typeof window.closeContactsApp === 'function') {
                window.closeContactsApp();
                return;
            } else if (typeof closeContactsApp === 'function') {
                closeContactsApp();
                return;
            } else if (window.ContactsApp && typeof window.ContactsApp.close === 'function') {
                window.ContactsApp.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 10：MCP APP（#mcpAppHost / #mcpAppUI）
        // -------------------------------------------------------------
        const mcpHost = document.getElementById('mcpAppHost');
        const mcpUI = document.querySelector('#mcpAppUI, .mcp-app-container');
        if ((mcpHost && mcpHost.style.display !== 'none' && isElementActiveAndVisible(mcpHost)) || (mcpUI && isElementActiveAndVisible(mcpUI))) {
            const mcpScope = mcpHost || mcpUI;
            // 9.1 编辑配置子页面时返回配置列表
            const editorBackBtn = mcpScope.querySelector('[data-action="back"], .circle-back-btn');
            if (editorBackBtn && editorBackBtn.offsetParent !== null) {
                editorBackBtn.click();
                return;
            }
            // 9.2 多选编辑模式时取消编辑
            const editCancelBtn = mcpScope.querySelector('[data-action="cancel-edit"]');
            if (editCancelBtn && editCancelBtn.offsetParent !== null) {
                editCancelBtn.click();
                return;
            }
            // 9.3 处于 MCP 根主页时，退出 MCP APP 返回桌面
            if (window.McpApp && typeof window.McpApp.close === 'function') {
                window.McpApp.close();
                return;
            } else if (typeof closeMcpApp === 'function') {
                closeMcpApp();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 11：阅读、相册、见面、城市、主题等其他独立应用
        // -------------------------------------------------------------
        const otherAppList = [
            {
                selector: '#todayAppUI',
                close: () => window.TodayApp?.back()
            },
            {
                selector: '#readenAppUI, #readingAppUI, .readen-app-container',
                close: () => (window.ReadenApp?.close ? window.ReadenApp.close() : (typeof closeReadenApp === 'function' ? closeReadenApp() : null))
            },
            {
                selector: '#photosAppUI, .photos-app-container',
                close: (options) => (typeof window.closePhotosApp === 'function' ? window.closePhotosApp(options) : null),
                immediateOnRootSwipe: true
            },
            {
                selector: '#meetingAppUI, .meeting-app-container',
                close: () => (typeof closeMeetingApp === 'function' ? closeMeetingApp() : null)
            },
            {
                selector: '#icityNewAppUI, .icity-new-app-wrapper, #icityAppUI, .icity-app-container',
                close: () => (typeof window.closeICityApp === 'function' ? window.closeICityApp() : null)
            },
            {
                selector: '#themeAppUI, .theme-app-container',
                close: (options) => (typeof window.closeThemeApp === 'function'
                    ? window.closeThemeApp(options)
                    : (typeof closeThemeApp === 'function' ? closeThemeApp(options) : null)),
                immediateOnRootSwipe: true
            }
        ];

        for (const item of otherAppList) {
            const appEl = document.querySelector(item.selector);
            if (appEl && isElementActiveAndVisible(appEl)) {
                const isCommittedRootSwipe = item.immediateOnRootSwipe && swipeSurface === appEl;
                if (isCommittedRootSwipe) {
                    item.close({ immediate: true, fromSwipe: true });
                    return;
                }

                const subBack = appEl.querySelector('.active [class*="back"], .slide-left [class*="back"], [class*="back-btn"]');
                if (subBack && subBack.offsetParent !== null) {
                    subBack.click();
                    return;
                }

                item.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 12：设置内的各独立二级设置页面（二级子页 ➔ 各自设置主页 ➔ 设置根页面）
        // -------------------------------------------------------------
        const accessUI = document.getElementById('accessibilitySettingsUI');
        if (accessUI && isElementActiveAndVisible(accessUI)) {
            const assistivePage = document.getElementById('accessAssistivePage');
            if (assistivePage && assistivePage.classList.contains('active')) {
                if (typeof closeAccessSubPage === 'function') closeAccessSubPage('accessAssistivePage');
                return;
            }
            const pageAdaptPage = document.getElementById('accessPageAdaptPage');
            if (pageAdaptPage && pageAdaptPage.classList.contains('active')) {
                if (typeof closeAccessSubPage === 'function') closeAccessSubPage('accessPageAdaptPage');
                return;
            }
            if (typeof closeAccessibilitySettingsApp === 'function') closeAccessibilitySettingsApp();
            return;
        }

        const genUI = document.getElementById('generalSettingsUI');
        if (genUI && isElementActiveAndVisible(genUI)) {
            const aboutPage = document.getElementById('genAboutPage');
            if (aboutPage && aboutPage.classList.contains('active')) {
                if (typeof closeGenSubPage === 'function') closeGenSubPage('genAboutPage');
                return;
            }
            const updatePage = document.getElementById('genUpdatePage');
            if (updatePage && updatePage.classList.contains('active')) {
                if (typeof closeGenSubPage === 'function') closeGenSubPage('genUpdatePage');
                return;
            }
            const pwaPage = document.getElementById('genPwaIconPage');
            if (pwaPage && pwaPage.classList.contains('active')) {
                if (typeof closeGenSubPage === 'function') closeGenSubPage('genPwaIconPage');
                return;
            }
            if (typeof closeGeneralSettingsApp === 'function') closeGeneralSettingsApp();
            return;
        }

        const icloudUI = document.getElementById('icloudAppUI');
        if (icloudUI && isElementActiveAndVisible(icloudUI)) {
            const storagePage = document.getElementById('ic-storage-page');
            if (storagePage && storagePage.classList.contains('active')) {
                if (typeof closeIcStoragePage === 'function') closeIcStoragePage();
                return;
            }
            const localDrivePage = document.getElementById('ic-local-drive-page');
            if (localDrivePage && localDrivePage.classList.contains('active')) {
                if (typeof closeLocalDrivePage === 'function') closeLocalDrivePage();
                return;
            }
            const cloudBackupPage = document.getElementById('ic-cloud-backup-page');
            if (cloudBackupPage && cloudBackupPage.classList.contains('active')) {
                if (typeof closeCloudBackupPage === 'function') closeCloudBackupPage();
                return;
            }
            if (typeof closeIcloudApp === 'function') closeIcloudApp();
            return;
        }

        const apiUI = document.getElementById('apiAppUI');
        if (apiUI && isElementActiveAndVisible(apiUI)) {
            const apiAddPage = document.getElementById('api-page-add');
            if (apiAddPage && apiAddPage.classList.contains('active')) {
                if (typeof closeApiAddPage === 'function') closeApiAddPage();
                return;
            }
            if (typeof closeApiApp === 'function') closeApiApp();
            return;
        }

        const voiceUI = document.getElementById('voiceAppUI');
        if (voiceUI && isElementActiveAndVisible(voiceUI)) {
            const voiceAddPage = document.getElementById('voice-page-add');
            if (voiceAddPage && voiceAddPage.classList.contains('active')) {
                if (typeof closeVoiceAddPage === 'function') closeVoiceAddPage();
                return;
            }
            if (typeof closeVoiceApp === 'function') closeVoiceApp();
            return;
        }

        const imggenUI = document.getElementById('imageGenAppUI');
        if (imggenUI && isElementActiveAndVisible(imggenUI)) {
            const imggenAddPage = document.getElementById('imggen-page-add');
            if (imggenAddPage && imggenAddPage.classList.contains('active')) {
                if (typeof closeImageGenAddPage === 'function') closeImageGenAddPage();
                return;
            }
            if (typeof closeImageGenApp === 'function') closeImageGenApp();
            return;
        }

        const otherSettingSinglePages = [
            { id: 'appleIdUI', close: () => typeof closeAppleIdApp === 'function' && closeAppleIdApp() },
            { id: 'loginSecurityUI', close: () => typeof closeLoginSecurityApp === 'function' && closeLoginSecurityApp() },
            { id: 'displaySettingsUI', close: () => typeof closeDisplaySettingsApp === 'function' && closeDisplaySettingsApp() },
            { id: 'messageNotificationSettingsUI', close: () => typeof closeMessageNotificationSettingsApp === 'function' && closeMessageNotificationSettingsApp() },
            { id: 'soundHapticsSettingsUI', close: () => typeof closeSoundHapticsSettingsApp === 'function' && closeSoundHapticsSettingsApp() },
            { id: 'standbyDiagnosticsUI', close: () => typeof closeStandbyDiagnosticsApp === 'function' && closeStandbyDiagnosticsApp() },
            { id: 'proactiveMessagesAppUI', close: () => typeof closeProactiveMessagesApp === 'function' && closeProactiveMessagesApp() },
            { id: 'weixinHotspotSettingsUI', close: () => typeof window.closeWeixinCloudSettings === 'function' && window.closeWeixinCloudSettings() },
            { id: 'screenTimeSettingsUI', close: () => typeof closeScreenTimeSettingsApp === 'function' && closeScreenTimeSettingsApp() }
        ];

        for (const item of otherSettingSinglePages) {
            const el = document.getElementById(item.id);
            if (el && el.classList.contains('show')) {
                item.close();
                return;
            }
        }

        // -------------------------------------------------------------
        // 层级 13：设置 App 根主页面 / 查手机 App（最后关闭）
        // -------------------------------------------------------------
        const fanfictionUI = document.getElementById('fanfictionAppUI');
        if (fanfictionUI && fanfictionUI.style.display !== 'none' && fanfictionUI.getAttribute('aria-hidden') === 'false') {
            if (typeof window.handleFanfictionBack === 'function') window.handleFanfictionBack();
            else window.closeFanfictionApp?.();
            return;
        }
        const charPhoneModal = document.getElementById('character-phone-modal');
        if (charPhoneModal && charPhoneModal.classList.contains('show')) {
            if (typeof charPhoneModal.__handleInternalBack === 'function' && charPhoneModal.__handleInternalBack()) {
                return;
            }
            if (typeof window.closeCharacterPhoneApp === 'function') {
                window.closeCharacterPhoneApp();
            } else {
                charPhoneModal.classList.remove('show');
            }
            return;
        }

        const settingsUI = document.getElementById('settingsAppUI');
        if (settingsUI && isElementActiveAndVisible(settingsUI)) {
            const committedSwipeCloseOptions = { force: true, immediate: true };
            if (typeof window.closeSettingsApp === 'function') {
                window.closeSettingsApp(committedSwipeCloseOptions);
            } else if (typeof closeSettingsApp === 'function') {
                closeSettingsApp(committedSwipeCloseOptions);
            }
            return;
        }
    }

    window.executeGlobalBack = executeGlobalBack;
})();

