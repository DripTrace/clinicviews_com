/** @type {import('next').NextConfig} */

import withSerwistInit from "@serwist/next";

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

export default withSerwist({ nextConfig });
