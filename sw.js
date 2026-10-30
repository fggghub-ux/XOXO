self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Let the browser handle media and byte-range requests without a service worker proxy.
  // Reconstructing these requests can disrupt partial-content playback and seeking.
  if (request.destination === 'audio' || request.destination === 'video' ||
      request.headers.has('range')) return;

  event.respondWith(fetch(new Request(request, { cache: 'no-store' })));
});

// æŽ¥æ”¶æŽ¨é€æ¶ˆæ¯
self.addEventListener('push', event => {
  let data = {};
  try {
    if (event.data) data = event.data.json() || {};
  } catch (error) { console.error('Invalid push payload:', error); }
  // Show the system notification directly, even with no window client or usable payload.
  event.waitUntil((async () => {
    const options = {
      body: data.body || 'ç‚¹å‡»æŸ¥çœ‹',
      icon: data.icon || 'https://nos.netease.com/ysf/39cad7c5aef80d006becb9c7b22b43cf.png',
      badge: data.badge || '/badge-icon.png',
      tag: data.tag || 'proactive-message',
      data: data.data || {},
      requireInteraction: false,
      vibrate: [200, 100, 200],
      renotify: data.renotify !== false
    };

    try { await self.registration.showNotification(data.title || 'ç«¥è¯é›†æ–°æ¶ˆæ¯', options); }
    catch (error) {
      console.error('Push notification error:', error);
      await self.registration.showNotification('ç«¥è¯é›†æ–°æ¶ˆæ¯', { body: 'æ‰“å¼€æŸ¥çœ‹æ¶ˆæ¯', data: data.data || {}, tag: options.tag });
    }
  })());
});

// ç‚¹å‡»é€šçŸ¥
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const contactId = event.notification.data && event.notification.data.contactId;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const client = clients[0];
      if (!client) {
        const query = new URLSearchParams();
        if (contactId) query.set('proactiveContact', contactId);
        if (event.notification.data && event.notification.data.messageText) query.set('proactiveMessage', event.notification.data.messageText);
        if (event.notification.data?.messageId) query.set('proactiveMessageId', event.notification.data.messageId);
        if (event.notification.data?.timestamp) query.set('proactiveTimestamp', String(event.notification.data.timestamp));
        return self.clients.openWindow(new URL('./?' + query.toString(), self.registration.scope).href);
      }
      client.postMessage({ type: 'wc-proactive-message', contactId, messageText: event.notification.data && event.notification.data.messageText, messageId: event.notification.data?.messageId, timestamp: event.notification.data?.timestamp });
      return client.focus();
    })
  );
});
