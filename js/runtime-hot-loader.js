/* Hot-load small runtime modules without reloading the whole app. */
(function () {
  'use strict';

  const MANIFEST_URL = 'runtime-modules.json';
  const CHECK_INTERVAL_MS = 5 * 60 * 1000;
  let pendingVersion = '';
  let lastCheckedAt = 0;

  function currentTrackerVersion() {
    return String(window.__tonghuajiUsageTracker && window.__tonghuajiUsageTracker.version || '');
  }

  function loadTrackerModule(moduleConfig) {
    const version = String(moduleConfig && moduleConfig.version || '').trim();
    const source = String(moduleConfig && moduleConfig.src || '').trim();
    if (!version || !source || version === currentTrackerVersion() || pendingVersion === version) return;

    // A legacy tracker cannot be stopped safely. Avoid double counting in a stale
    // tab and wait for the user's next normal reload to migrate it.
    if (window.__tonghuajiUsageTrackerStarted && !window.__tonghuajiUsageTracker) return;

    pendingVersion = version;
    const script = document.createElement('script');
    script.src = source + (source.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(version) + '&hot=1';
    script.async = true;
    script.dataset.hotModule = 'beta-usage-tracker';
    script.addEventListener('load', () => {
      pendingVersion = '';
    }, { once: true });
    script.addEventListener('error', () => {
      pendingVersion = '';
    }, { once: true });
    (document.head || document.documentElement).append(script);
  }

  async function checkForRuntimeUpdates(force) {
    const now = Date.now();
    if (!force && now - lastCheckedAt < 15000) return;
    lastCheckedAt = now;

    try {
      const response = await fetch(MANIFEST_URL + '?t=' + now, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin'
      });
      if (!response.ok) return;
      const manifest = await response.json();
      loadTrackerModule(manifest && manifest.betaUsageTracker);
    } catch (error) {}
  }

  function handleVisible() {
    if (document.visibilityState === 'visible') void checkForRuntimeUpdates(true);
  }

  document.addEventListener('visibilitychange', handleVisible);
  window.addEventListener('pageshow', () => void checkForRuntimeUpdates(true));
  window.addEventListener('focus', () => void checkForRuntimeUpdates(false));
  window.setInterval(() => {
    if (document.visibilityState === 'visible') void checkForRuntimeUpdates(false);
  }, CHECK_INTERVAL_MS);

  void checkForRuntimeUpdates(true);
}());
