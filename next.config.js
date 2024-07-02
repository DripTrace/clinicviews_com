// /** @type {import('next').NextConfig} */

// import withSerwistInit from "@serwist/next";

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

// const withSerwist = withSerwistInit({
// 	swSrc: "src/app/sw.ts",
// 	swDest: "public/sw.js",
// 	disable: process.env.NODE_ENV === "development",
// });

// export default withSerwist({ nextConfig });

const withSerwistInit = require("@serwist/next");

/** @type {import('next').NextConfig} */
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
	// The following options will be automatically set by GitHub Pages action
	// output: 'export',
	// basePath: process.env.GITHUB_PAGES ? '/clinicviews-com' : '',
	// assetPrefix: process.env.GITHUB_PAGES ? '/clinicviews-com/' : '',
};

const withSerwist = withSerwistInit({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	disable: process.env.NODE_ENV === "development",
});

// Use a function to allow for dynamic configuration
module.exports = (phase, { defaultConfig }) => {
	const config = withSerwist(nextConfig);

	// Allow GitHub Pages action to modify the configuration
	if (process.env.GITHUB_PAGES) {
		config.output = "export";
		config.basePath = "/clinicviews_com";
		config.assetPrefix = "/clinicviews_com/";
	}

	return config;
};
