/* Beta usage tracking: counts foreground-visible time. */
(function () {
  'use strict';

  const TRACKER_VERSION = '20261018-beta-usage-v5';
  const SUPABASE_URL = 'https://api.ovevol.dpdns.org';
  const SUPABASE_KEY = 'sb_publishable__MWrzSC2jWYOOO4_5pScxA_FaK1tg3F';
  const SESSION_KEY = 'tonghuajiAccessSessionV2';
  const HEARTBEAT_MS = 30000;
  const INACTIVITY_MS = 2 * 60 * 1000;

  const previousTracker = window.__tonghuajiUsageTracker || null;
  if (previousTracker && previousTracker.version === TRACKER_VERSION) return;

  // Legacy tracker versions cannot be stopped safely. Avoid double counting if a
  // stale page somehow loads this script without a full refresh.
  if (!previousTracker && window.__tonghuajiUsageTrackerStarted) return;

  const previousState = previousTracker && typeof previousTracker.getState === 'function'
    ? previousTracker.getState()
    : null;

  if (previousTracker && typeof previousTracker.stop === 'function') {
    previousTracker.stop();
  }

  let stopped = false;
  let sequence = Number(previousState && previousState.sequence || 0);
  let lastTickAt = Date.now();
  let lastInteractionAt = lastTickAt;
  let pendingSeconds = Math.min(60, Math.max(0, Number(previousState && previousState.pendingSeconds || 0)));
  let sending = false;
  let timer = 0;
  let startRequested = false;
  let lastKnownVisible = document.visibilityState === 'visible';

  function createTrackerSessionId() {
    const previousId = String(previousState && previousState.sessionId || '');
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previousId)) {
      return previousId;
    }

    const cryptoApi = window.crypto;
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
      return cryptoApi.randomUUID();
    }

    const bytes = new Uint8Array(16);
    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
      cryptoApi.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
      }
    }

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0'));
    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join('')
    ].join('-');
  }

  const trackerSessionId = createTrackerSessionId();

  function readSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (!session || session.provider === 'cf-fallback' || !session.access_token) return null;
      return session;
    } catch (error) {
      return null;
    }
  }

  async function sendHeartbeat(activeSeconds, keepalive) {
    if (stopped || sending) return false;

    const session = readSession();
    if (!session || activeSeconds < 1) return false;

    sending = true;
    const nextSequence = sequence + 1;
    try {
      const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/record_usage_heartbeat', {
        method: 'POST',
        keepalive: Boolean(keepalive),
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_session_id: trackerSessionId,
          p_sequence: nextSequence,
          p_active_seconds: Math.min(60, Math.max(1, Math.round(activeSeconds)))
        })
      });

      if (!response.ok || stopped) return false;
      sequence = nextSequence;
      return true;
    } catch (error) {
      return false;
    } finally {
      sending = false;
    }
  }

  // Only count foreground time before the two-minute interaction deadline.
  function accumulateActiveTime(now) {
    const eligibleStart = Math.max(lastTickAt, now - 60000);
    const eligibleEnd = Math.min(now, lastInteractionAt + INACTIVITY_MS);
    if (lastKnownVisible && eligibleEnd > eligibleStart) {
      pendingSeconds = Math.min(60, pendingSeconds + (eligibleEnd - eligibleStart) / 1000);
    }
    lastTickAt = now;
  }

  async function flushPending(keepalive) {
    const seconds = Math.floor(pendingSeconds);
    if (seconds < 1) return;
    const accepted = await sendHeartbeat(seconds, keepalive);
    if (accepted) pendingSeconds = Math.max(0, pendingSeconds - seconds);
  }

  function handleUserActivity() {
    if (stopped || document.visibilityState !== 'visible') return;
    const now = Date.now();
    accumulateActiveTime(now);
    lastInteractionAt = now;
  }

  function tick() {
    if (stopped) return;
    const visible = document.visibilityState === 'visible';
    if (visible !== lastKnownVisible) {
      handleVisibilityChange();
      return;
    }
    accumulateActiveTime(Date.now());
    if (visible) void flushPending(false);
  }

  function handleVisibilityChange() {
    if (stopped) return;
    const now = Date.now();
    const visible = document.visibilityState === 'visible';
    accumulateActiveTime(now);
    lastKnownVisible = visible;
    if (visible) {
      lastInteractionAt = now;
    } else {
      void flushPending(true);
    }
  }

  function handlePageHide() {
    if (stopped) return;
    accumulateActiveTime(Date.now());
    if (lastKnownVisible) void flushPending(true);
  }

  function handleSessionRefresh() {
    window.setTimeout(start, 0);
  }

  function handleStorage(event) {
    if (event.key === SESSION_KEY) window.setTimeout(start, 0);
  }

  const activityEvents = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'input'];

  function attachListeners() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    activityEvents.forEach(type => document.addEventListener(type, handleUserActivity, { passive: true }));
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('tonghuaji:resource-session-refreshed', handleSessionRefresh);
    window.addEventListener('storage', handleStorage);
  }

  function detachListeners() {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    activityEvents.forEach(type => document.removeEventListener(type, handleUserActivity));
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('tonghuaji:resource-session-refreshed', handleSessionRefresh);
    window.removeEventListener('storage', handleStorage);
  }

  function start() {
    if (stopped || timer || startRequested) return;
    if (!readSession() || !document.documentElement.classList.contains('app-access-ready')) return;

    startRequested = true;
    lastTickAt = Date.now();
    lastInteractionAt = lastTickAt;
    lastKnownVisible = document.visibilityState === 'visible';
    attachListeners();
    timer = window.setInterval(tick, HEARTBEAT_MS);

    // Register immediately. The server credits the first heartbeat with zero
    // seconds and uses it only as a time anchor.
    void sendHeartbeat(1, false).catch(() => {});
  }

  function waitForAuthenticatedSession() {
    if (stopped) return;
    start();
    if (timer) return;
    window.setTimeout(waitForAuthenticatedSession, 750);
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    if (timer) {
      window.clearInterval(timer);
      timer = 0;
    }
    detachListeners();
    if (window.__tonghuajiUsageTracker === controller) {
      window.__tonghuajiUsageTrackerStarted = false;
    }
  }

  const controller = Object.freeze({
    version: TRACKER_VERSION,
    stop,
    getState() {
      return {
        sessionId: trackerSessionId,
        sequence,
        pendingSeconds
      };
    }
  });

  window.__tonghuajiUsageTracker = controller;
  window.__tonghuajiUsageTrackerStarted = true;
  waitForAuthenticatedSession();
}());
