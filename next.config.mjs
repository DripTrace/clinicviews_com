// /** @type {import('next').NextConfig} */
// import withSerwistInit from "@serwist/next";
// import { execSync } from "child_process";

// const nextConfig = {
//     reactStrictMode: true,
//     onError: (error, errorInfo) => {
//         console.error("Global error occurred:", error, errorInfo);
//     },
//     async rewrites() {
//         return [
//             {
//                 source: "/:path*",
//                 destination: "/:path*",
//             },
//             {
//                 source: "/manifest.webmanifest",
//                 destination: "/api/manifest",
//             },
//             {
//                 source: "/favicon.ico",
//                 destination: "/api/favicon",
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
//                     {
//                         key: "Content-Type",
//                         value: "application/manifest+json",
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
//     // basePath: "/clinicviews_com",
//     // assetPrefix: "/clinicviews_com/",
//     basePath: "",
//     assetPrefix: "/",
//     images: {
//         unoptimized: true,
//     },
//     transpilePackages: ["framer-motion"],
//     webpack: (config, { isServer }) => {
//         // config.module.rules.push({
//         //     test: /\.(ogg|mp3|wav|mpe?g|flac)$/i,
//         //     exclude: config.exclude,
//         //     use: [
//         //         {
//         //             loader: "url-loader",
//         //             options: {
//         //                 limit: config.inlineImageLimit,
//         //                 fallback: "file-loader",
//         //                 publicPath: `${config.assetPrefix}/_next/static/media/`,
//         //                 outputPath: `${isServer ? "../" : ""}static/media/`,
//         //                 name: "[name]-[hash].[ext]",
//         //                 esModule: config.esModule || false,
//         //             },
//         //         },
//         //     ],
//         // });
//         if (!isServer) {
//             execSync("node scripts/runGenerateManifest.js");
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
//     // disable: process.env.NODE_ENV === "development",
// });

// export default withSerwist({ nextConfig });

/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";
import withPlugins from "next-compose-plugins";
import withVideos from "next-videos";
import withImages from "next-images";
import { execSync } from "child_process";

const nextConfig = {
    // typescript: {
    //     // !! WARN !!
    //     // Dangerously allow production builds to successfully complete even if
    //     // your project has type errors.
    //     // !! WARN !!
    //     ignoreBuildErrors: true,
    // },
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
            {
                source: "/api/:path*",
                destination: "/api/:path*",
            },
            {
                source: "/api/llpmg/sip-handler",
                destination: "/api/llpmg/sip-handler",
            },
            {
                source: "/api/llpmg/sip-ws",
                destination: "/api/llpmg/sip-handler",
            },
            {
                source: "/llpmg/audio/:path*",
                destination: "/public/llpmg/audio/:path*",
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
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "uploadthing.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "utfs.io",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "subdomain",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "files.stripe.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "nexusconjure.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "files.cdn.printful.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "**",
            },
        ],
        disableStaticImages: true,
    },
    basePath: "",
    assetPrefix: "/",
    transpilePackages: ["framer-motion"],
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.(mp3|ogg|wav|flac|mpe?g)$/,
            use: [
                {
                    loader: "url-loader",
                    options: {
                        limit: config.inlineImageLimit,
                        fallback: "file-loader",
                        publicPath: `${config.assetPrefix}/_next/static/media/`,
                        outputPath: `${isServer ? "../" : ""}static/media/`,
                        name: "[name].[hash].[ext]",
                        esModule: config.esModule || false,
                    },
                },
            ],
        });

        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        typescript: true,
                        ext: "tsx",
                    },
                },
            ],
        });

        config.module.rules.push({
            // test: /\.tsx?$/,
            // use: [
            //     {
            //         loader: "ts-loader",
            //         options: {
            //             transpileOnly: true,
            //             ignoreDiagnostics: [2307], // Ignore cannot find module errors
            //         },
            //     },
            // ],
            // exclude: /node_modules/,

            test: /\.tsx?$/,
            use: [
                {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        ignoreDiagnostics: [2307], // Ignore cannot find module errors
                    },
                },
            ],
            exclude: /node_modules/,
        });

        if (!isServer) {
            execSync("node scripts/runGenerateManifest.js");
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                events: "events",
            };
        }

        return config;
    },
    compiler: {
        styledComponents: true,
    },
    // env: {
    //     stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    //     printful_client_id: process.env.PRINTFUL_CLIENT_ID,
    //     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    //     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // },
    reactStrictMode: false,
    // i18n: {
    //     locales: ["en", "ja"],
    //     defaultLocale: "en",
    //     localeDetection: false,
    // },
};

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    // disable: process.env.NODE_ENV === "development",
});

export default withPlugins(
    [[withVideos], [withImages], withSerwist],
    nextConfig
);
