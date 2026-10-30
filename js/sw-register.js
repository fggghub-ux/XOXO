// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    // Do not reload an active conversation when a new service worker takes control.

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
            if (registration) await registration.update().catch(() => {});
            console.log('ServiceWorker registration successful with scope: ', registration ? registration.scope : '');
        } catch (err) {
            console.log('ServiceWorker registration skipped/failed: ', err);
        }
    }

    // runtime-loader injects this script after the document is ready, so waiting for
    // window.load only delays PWA shell repair behind the rest of the application.
    void registerServiceWorker();
}
