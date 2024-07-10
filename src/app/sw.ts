// import { defaultCache } from "@serwist/next/worker";
// import type { PrecacheEntry } from "@serwist/precaching";
// import { installSerwist } from "@serwist/sw";

// declare const self: ServiceWorkerGlobalScope & {
//     // Change this attribute's name to your `injectionPoint`.
//     // `injectionPoint` is an InjectManifest option.
//     // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
//     __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// };

// const revision = crypto.randomUUID();

// installSerwist({
//     precacheEntries: self.__SW_MANIFEST,
//     skipWaiting: true,
//     clientsClaim: true,
//     navigationPreload: true,
//     runtimeCaching: defaultCache,
//     fallbacks: {
//         entries: [
//             {
//                 url: "/offline",
//                 revision,
//                 matcher({ request }) {
//                     return request.destination === "document";
//                 },
//             },
//         ],
//     },
//     importScripts: ["custom-sw.js"],
// });

// // self.addEventListener("install", (event) => {
// //     console.log("Service Worker installed");
// // });

// // self.addEventListener("activate", (event) => {
// //     console.log("Service Worker activated");
// // });

// // self.addEventListener("fetch", (event) => {
// //     console.log("Fetch intercepted for:", event.request.url);
// //     event.respondWith(fetch(event.request));
// // });

// src/app/sw.ts

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const revision = crypto.randomUUID();

installSerwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
        entries: [
            {
                url: "/offline",
                revision,
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

// Custom service worker logic for all domains
self.addEventListener("message", async (event) => {
    if (event.data.action === "cache-on-demand") {
        const domainLogos = {
            llpmg: "images/llpmg_logo.png",
            fsclinicals: "images/fsclinicals_logo.png",
            driptrace: "images/driptrace_logo.png",
        };

        const domain = event.data.domain || "driptrace"; // Fallback to llpmg if no domain specified
        const imagePath =
            domainLogos[domain as keyof typeof domainLogos] ||
            domainLogos.llpmg;

        const cache = await caches.open("static-image-assets");
        const isCached = await cache.match(imagePath);
        if (!isCached) {
            const res = await fetch(imagePath);
            if (res.ok) {
                await cache.put(imagePath, res);
                console.log(`Cached logo for ${domain}: ${imagePath}`);
            } else {
                console.error(
                    `Failed to cache logo for ${domain}: ${imagePath}`
                );
            }
        } else {
            console.log(`Logo for ${domain} already cached: ${imagePath}`);
        }
    }
    event.ports[0].postMessage(true);
});
