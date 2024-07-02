// /** @type {import('next').NextConfig} */
// // const withPWA = require("next-pwa");
// // import withPWA from "next-pwa";

// const nextConfig = {
// 	images: {
// 		domains: [
// 			"russpalms.github.io",
// 			"files.oaiusercontent.com",
// 			"cdn.discordapp.com",
// 		],
// 	},
// };

// // module.exports = withPWA({
// // 	//...before
// // 	pwa: {
// // 		dest: "public",
// // 		register: true,
// // 		skipWaiting: true,
// // 	},
// // 	//...after
// // });

// // const nextConfig = withPWA({
// // 	//...before
// // 	images: {
// // 		domains: [
// // 			"russpalms.github.io",
// // 			"files.oaiusercontent.com",
// // 			"cdn.discordapp.com",
// // 		],
// // 	},
// // 	pwa: {
// // 		dest: "public",
// // 		register: true,
// // 		skipWaiting: true,
// // 	},
// // 	//...after
// // });

// export default nextConfig;

// import withSerwistInit from "@serwist/next";

// const withSerwist = withSerwistInit({
// 	swSrc: "app/sw.ts", // where the service worker src is
// 	swDest: "public/sw.js", // where the service worker code will end up
// });

// export default withSerwist({
// 	images: {
// 		domains: [
// 			"russpalms.github.io",
// 			"files.oaiusercontent.com",
// 			"cdn.discordapp.com",
// 		],
// 	},
// });

// next.config.mjs

// import withPWA from "next-pwa";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	reactStrictMode: true, // Enable React strict mode for improved error handling
// 	swcMinify: true, // Enable SWC minification for improved performance
// 	compiler: {
// 		removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
// 	},
// 	images: {
// 		domains: [
// 			"russpalms.github.io",
// 			"files.oaiusercontent.com",
// 			"cdn.discordapp.com",
// 		],
// 	},
// };

// export default withPWA({
// 	dest: "public", // destination directory for the PWA files
// 	//disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
// 	register: true, // register the PWA service worker
// 	skipWaiting: true, // skip waiting for service worker activation
// })(nextConfig);

// sw is redundant
// import withPwa from "@ducanh2912/next-pwa";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	// ... other options you like
// };

// // const withPWA = require("@ducanh2912/next-pwa").default({
// export default withPwa({
// 	cacheOnFrontEndNav: true,
// 	aggressiveFrontEndNavCaching: true,
// 	reloadOnOnline: true,
// 	swcMinify: true,
// 	dest: "public",
// 	fallbacks: {
// 		//image: "/static/images/fallback.png",
// 		document: "/offline", // if you want to fallback to a custom page rather than /_offline
// 		// font: '/static/font/fallback.woff2',
// 		// audio: ...,
// 		// video: ...,
// 	},
// 	workboxOptions: {
// 		disableDevLogs: true,
// 	},
// 	// ... other options you like
// });

// // module.exports = withPWA(nextConfig);

// import withSerwistInit from "@serwist/next";

// const withSerwist = withSerwistInit({
// 	swSrc: "src/app/sw.ts",
// 	swDest: "public/sw.js",
// });

// export default withSerwist({});

/** @type {import('next').NextConfig} */

import withSerwistInit from "@serwist/next";

const nextConfig = {
	// output: 'export',
	// images: { unoptimized: true },
	//       basePath: process.env.GITHUB_PAGES ? '/clinicviews-com' : '',
	//   assetPrefix: process.env.GITHUB_PAGES ? '/clinicviews-com/' : '',
	reactStrictMode: true,
	transpilePackages: ["framer-motion"],
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}
		return config;
	},
};

const withSerwist = withSerwistInit({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	disable: process.env.NODE_ENV === "development",
});

export default withSerwist({ nextConfig });

// import withSerwistInit from "@serwist/next";

// const withSerwist = withSerwistInit({
// 	swSrc: "app/sw.ts", // where the service worker src is
// 	swDest: "public/sw.js", // where the service worker code will end up
// 	disable: process.env.NODE_ENV === "development",
// });

// export default withSerwist({
// 	images: {
// 		domains: [
// 			"russpalms.github.io",
// 			"files.oaiusercontent.com",
// 			"cdn.discordapp.com",
// 		],
// 	},
// });
