// // import { installSerwist } from "@serwist/sw";

// // declare const self: ServiceWorkerGlobalScopeEventMap & {
// // 	__SW_MANIFEST: (string | { url: string; revision: string })[] | undefined;
// // };

// // self.__SW_MANIFEST = [];

// // installSerwist({
// // 	precacheEntries: self.__SW_MANIFEST,
// // 	skipWaiting: true,
// // 	clientsClaim: true,
// // 	navigationPreload: true,
// // });

// // import { defaultCache } from '@serwist/next/browser';
// // import type { PrecacheEntry } from '@serwist/precaching';
// // import { installSerwist } from '@serwist/sw';

// // declare const self: ServiceWorkerGlobalScope & {
// //   __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// // };

// // installSerwist({
// //   precacheEntries: self.__SW_MANIFEST,
// //   skipWaiting: true,
// //   clientsClaim: true,
// //   navigationPreload: true,
// //   runtimeCaching: defaultCache,
// // });

// // Import necessary modules
// // service-worker.js

// import { defaultCache } from "@serwist/next/browser";
// // import defaultCache from "@serwist/next";
// import type { PrecacheEntry } from "@serwist/precaching";
// import { installSerwist } from "@serwist/sw";

// // Ensure the ServiceWorkerGlobalScope type is included

// declare const self: ServiceWorkerGlobalScope & {
// 	__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// };

// // Install the Serwist service worker with the correct configuration
// installSerwist({
// 	precacheEntries: self.__SW_MANIFEST,
// 	skipWaiting: true,
// 	clientsClaim: true,
// 	navigationPreload: true,
// 	runtimeCaching: defaultCache,
// });

// // import { defaultCache } from "@serwist/next/browser";
// // import type { PrecacheEntry } from "@serwist/precaching";
// // import { injectManifest } from "workbox-build";

// // // Ensure the ServiceWorkerGlobalScope type is included

// // declare const self: ServiceWorkerGlobalScope & {
// // 	__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// // };

// // // Install the Serwist service worker with the correct configuration
// // injectManifest({
// // 	swSrc: "/path/to/service-worker.js",
// // 	swDest: "/path/to/generated-service-worker.js",
// // 	globDirectory: "/path/to/static-assets",
// // 	globPatterns: ["**/*.{html,js,css,png,jpg}"],
// // });

// import { defaultCache } from '@serwist/next/browser';
// import type { PrecacheEntry } from '@serwist/precaching';
// import { installSerwist } from '@serwist/sw';

// declare const self: ServiceWorkerGlobalScope & {
//   // Change this attribute's name to your `injectionPoint`.
//   // `injectionPoint` is an InjectManifest option.
//   // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
//   __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// };

// const revision = crypto.randomUUID();

// installSerwist({
//   precacheEntries: self.__SW_MANIFEST,
//   skipWaiting: true,
//   clientsClaim: true,
//   navigationPreload: true,
//   runtimeCaching: defaultCache,
//   fallbacks: {
//     entries: [
//       {
//         url: '/offline',
//         revision,
//         matcher({ request }) {
//           return request.destination === 'document';
//         },
//       },
//     ],
//   },
//   importScripts: ['custom-sw.js'],
// });

// Where you import this depends on your stack.
// import { defaultCache } from "@serwist/next/worker";
// import { type PrecacheEntry, Serwist } from "serwist";

// declare global {
// 	interface WorkerGlobalScope {
// 		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
// 	}
// }

// declare const self: ServiceWorkerGlobalScope;

// const serwist = new Serwist({
// 	precacheEntries: self.__SW_MANIFEST,
// 	runtimeCaching: defaultCache,
// });

// serwist.addEventListeners();

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
	// Change this attribute's name to your `injectionPoint`.
	// `injectionPoint` is an InjectManifest option.
	// See https://serwist.pages.dev/docs/build/inject-manifest/configuring
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
	importScripts: ["custom-sw.js"],
});
