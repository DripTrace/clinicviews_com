// /** @type {import('next').NextConfig} */
// import withSerwistInit from "@serwist/next";

// const nextConfig = {
//     reactStrictMode: true,
//     async rewrites() {
//         return [
//             {
//                 source: "/:path*",
//                 destination: "/:path*",
//             },
//         ];
//     },
//     async headers() {
//         return [
//             {
//                 source: "/manifest.webmanifest",
//                 headers: [
//                     {
//                         key: "Cache-Control",
//                         value: "no-store, max-age=0",
//                     },
//                 ],
//             },
//         ];
//     },
//     swcMinify: true,
//     api: {
//         bodyParser: {
//             sizeLimit: "4.5mb",
//         },
//     },
//     distDir: "out",
//     images: {
//         domains: ["driptrace.github.io"],
//     },
//     output: "export",
//     basePath: "/clinicviews_com",
//     assetPrefix: "/clinicviews_com/",
//     reactStrictMode: true,
//     transpilePackages: ["framer-motion"],
//     webpack: (config, { isServer }) => {
//         if (!isServer) {
//             config.resolve.fallback = {
//                 ...config.resolve.fallback,
//                 fs: false,
//             };
//         }
//         return config;
//     },
// };

// const withSerwist = withSerwistInit({
//     swSrc: "src/app/sw.ts",
//     swDest: "public/sw.js",
//     disable: process.env.NODE_ENV === "development",
// });

// export default withSerwist({ nextConfig });

// next.config.mjs

import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
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
    async headers() {
        return [
            {
                source: "/manifest.webmanifest",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/manifest+json",
                    },
                    {
                        key: "Cache-Control",
                        value: "no-store, max-age=0",
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
    basePath: "/clinicviews_com",
    assetPrefix: "/clinicviews_com/",
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

export default withSerwist(nextConfig);
