/** @type {import('next').NextConfig} */

// import withSerwistInit from "@serwist/next";
const withSerwistInit = require("@serwist/next");

const nextConfig = {
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

// export default withSerwist({ nextConfig });
module.exports = withSerwist(nextConfig);

// const withSerwistInit = require("@serwist/next");

// console.log("Loading next.config.js");

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	reactStrictMode: true,
// 	transpilePackages: ["framer-motion"],
// 	webpack: (config, { isServer }) => {
// 		if (!isServer) {
// 			config.resolve.fallback = {
// 				...config.resolve.fallback,
// 				fs: false,
// 			};
// 		}
// 		return config;
// 	},
// };

// console.log("Base nextConfig:", JSON.stringify(nextConfig, null, 2));

// const withSerwist = withSerwistInit({
// 	swSrc: "src/app/sw.ts",
// 	swDest: "public/sw.js",
// 	disable: process.env.NODE_ENV === "development",
// });

// console.log("Environment variables:", JSON.stringify(process.env, null, 2));

// // Use a function to allow for dynamic configuration
// module.exports = (phase, { defaultConfig }) => {
// 	console.log("Configuring Next.js");
// 	let config = withSerwist(nextConfig);

// 	if (process.env.GITHUB_PAGES) {
// 		console.log("Configuring for GitHub Pages");
// 		config = {
// 			...config,
// 			output: "export",
// 			basePath: "/clinicviews-com",
// 			assetPrefix: "/clinicviews-com/",
// 		};
// 	}

// 	console.log("Final config:", JSON.stringify(config, null, 2));
// 	return config;
// };
