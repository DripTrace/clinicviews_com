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

// next.config.mjs

// import withSerwistInit from "@serwist/next";

// /** @type {import('next').NextConfig} */
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
//                         key: "Content-Type",
//                         value: "application/manifest+json",
//                     },
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
//     // exportPathMap: async function (
//     //     defaultPathMap,
//     //     { dev, dir, outDir, distDir, buildId }
//     // ) {
//     //     // Remove the [...not_found] route from static export
//     //     delete defaultPathMap["/[...not_found]"];
//     //     return defaultPathMap;
//     // },
//     images: {
//         unoptimized: true, // Required for static export
//     },
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

// export default withSerwist(nextConfig);
