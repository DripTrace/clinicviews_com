/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";
import { execSync } from "child_process";

const nextConfig = {
    reactStrictMode: true,
    onError: (error, errorInfo) => {
        console.error("Global error occurred:", error, errorInfo);
    },
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "/:path*",
            },
            {
                source: "/manifest.webmanifest",
                destination: "/api/manifest",
            },
            {
                source: "/favicon.ico",
                destination: "/api/favicon",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/manifest.webmanifest",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, max-age=0",
                    },
                    {
                        key: "Content-Type",
                        value: "application/manifest+json",
                    },
                ],
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
    // basePath: "/clinicviews_com",
    // assetPrefix: "/clinicviews_com/",
    basePath: "",
    assetPrefix: "/",
    images: {
        unoptimized: true,
    },
    transpilePackages: ["framer-motion"],
    webpack: (config, { isServer }) => {
        if (!isServer) {
            execSync("node scripts/runGenerateManifest.js");
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
    // disable: process.env.NODE_ENV === "development",
});

export default withSerwist({ nextConfig });
