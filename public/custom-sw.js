self.addEventListener("message", async (event) => {
    if (event.data.action === "cache-on-demand") {
        const cache = await caches.open("static-image-assets");
        const isCached = await cache.match("images/llpmg_logo.png");
        if (!isCached) {
            const res = await fetch("images/llpmg_logo.png");
            await cache.put("images/llpmg_logo.png", res);
        }
    }
    event.ports[0].postMessage(true);
});

// Add any custom service worker logic here
// self.addEventListener('install', (event) => {
//     console.log('Custom service worker installed');
//   });

//   self.addEventListener('activate', (event) => {
//     console.log('Custom service worker activated');
//   });
