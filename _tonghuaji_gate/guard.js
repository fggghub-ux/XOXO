(function () {
'use strict';
const gateRoot = "/_tonghuaji_gate";
const sessionKey = "tonghuajiAccessSessionV2";
const deviceKey = "tonghuajiAccessDeviceV1";
const noticeKey = "tonghuajiAccessLoginNoticeV1";
let locked = false;
let loginRequired = false;
let renewal = null;
let retryTimer = null;
let failureCount = 0;
const retryDelays = [2000, 5000, 10000, 15000];
function readSession() {
  try { return JSON.parse(localStorage.getItem(sessionKey) || "null"); } catch (error) { return null; }
}
function readDeviceId() {
  try { return localStorage.getItem(deviceKey) || ""; } catch (error) { return ""; }
}
function persistSession(nextSession) {
  if (!nextSession || !nextSession.access_token) return;
  try {
    const previous = readSession() || {};
    const merged = Object.assign({}, previous, nextSession);
    delete merged.refresh_token;
    localStorage.setItem(sessionKey, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("tonghuaji:resource-session-refreshed", { detail: merged }));
  } catch (error) {}
}
function showLock(message) {
  if (document.getElementById("tonghuajiOnlineGateLock")) return;
  const root = document.createElement("div");
  root.id = "tonghuajiOnlineGateLock";
  root.setAttribute("role", "alert");
  root.setAttribute("aria-live", "assertive");
  Object.assign(root.style, { position: "fixed", inset: "0", zIndex: "2147483647", display: "grid", placeItems: "center", padding: "24px", boxSizing: "border-box", background: "rgba(237,243,248,.98)", color: "#171717", fontFamily: "-apple-system,BlinkMacSystemFont,PingFang SC,Microsoft YaHei,sans-serif" });
  const card = document.createElement("section");
  Object.assign(card.style, { width: "min(100%,382px)", padding: "28px 22px", boxSizing: "border-box", border: "1px solid rgba(255,255,255,.76)", borderRadius: "28px", background: "rgba(255,255,255,.72)", boxShadow: "0 20px 55px rgba(68,93,127,.18)", textAlign: "center" });
  const title = document.createElement("h1");
  title.textContent = "已锁定";
  Object.assign(title.style, { margin: "0 0 12px", fontSize: "24px", fontWeight: "700" });
  const text = document.createElement("p");
  text.textContent = message;
  Object.assign(text.style, { margin: "0", lineHeight: "1.65", color: "#5b6470" });
  card.append(title, text);
  root.append(card);
  (document.body || document.documentElement).append(root);
}
function preventInteraction(event) {
  if (!locked) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}
["pointerdown","click","keydown","touchstart"].forEach(function (type) { document.addEventListener(type, preventInteraction, true); });
function clearNetworkFailures() {
  window.clearTimeout(retryTimer);
  retryTimer = null;
  failureCount = 0;
}
function scheduleRetry(delay) {
  window.clearTimeout(retryTimer);
  retryTimer = window.setTimeout(function () { retryTimer = null; void renew(); }, delay);
}
function retryForNetwork() {
  if (loginRequired) return false;
  if (navigator.onLine === false) return false;
  // Connectivity failures never invalidate an authenticated page.
  failureCount++;
  scheduleRetry(retryDelays[Math.min(failureCount - 1, retryDelays.length - 1)]);
  return false;
}
function goToLogin(message) {
  if (loginRequired) return;
  loginRequired = true;
  clearNetworkFailures();
  locked = true;
  showLock(message || "登录状态已失效，请重新登录。");
  try { sessionStorage.setItem(noticeKey, message || "登录状态已失效，请重新登录。"); } catch (error) {}
  const returnPath = location.pathname + location.search + location.hash;
  window.setTimeout(function () { location.replace("/login?return=" + encodeURIComponent(returnPath)); }, 0);
}
async function renewOnce() {
  const controller = new AbortController();
  // The backend may refresh credentials and then verify access sequentially.
  const timeout = window.setTimeout(function () { controller.abort(); }, 25000);
  try {
    const response = await fetch(gateRoot + "/renew", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: "{}"
    });
    const payload = await response.json().catch(function () { return null; });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        goToLogin(payload && payload.message || "登录状态已失效，请重新登录。");
      } else {
        return retryForNetwork();
      }
      return false;
    }
    if (!payload || payload.ok !== true || !payload.session || !payload.session.access_token) {
      return retryForNetwork();
    }
    persistSession(payload.session);
    clearNetworkFailures();
    return true;
  } catch (error) {
    return retryForNetwork();
  } finally {
    window.clearTimeout(timeout);
  }
}
function renew() {
  if (loginRequired) return Promise.resolve(false);
  if (navigator.onLine === false) return Promise.resolve(false);
  if (!renewal) {
    window.clearTimeout(retryTimer);
    retryTimer = null;
    renewal = renewOnce().finally(function () { renewal = null; });
  }
  return renewal;
}
window.addEventListener("offline", clearNetworkFailures);
window.addEventListener("online", function () { void renew(); });
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState !== "visible") return;
  void renew();
});
window.setInterval(function () { if (retryTimer === null) void renew(); }, 15000);
void renew();
}());