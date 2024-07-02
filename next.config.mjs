// const withSerwistInit = require("@serwist/next");
import { withSerwistInit } from "@serwist/next";

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
	output: "export",
	images: { unoptimized: true },
	basePath: process.env.GITHUB_PAGES ? "/clinicviews-com" : "",
	assetPrefix: process.env.GITHUB_PAGES ? "/clinicviews-com/" : "",
};

const withSerwist = withSerwistInit({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	disable: process.env.NODE_ENV === "development",
});

module.exports = withSerwist(nextConfig);
