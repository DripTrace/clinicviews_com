/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "/:path*",
            },
        ];
    },
    swcMinify: true,
    api: {
        bodyParser: {
            sizeLimit: "4.5mb",
        },
    },
    distDir: "out",
    images: {
        domains: ["driptrace.github.io"],
    },
    output: "export",
    basePath: "/clinicviews_com",
    assetPrefix: "/clinicviews_com/",
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
