// // config/faviconConfig.ts

// interface FaviconConfig {
//     [key: string]: {
//         icon: string;
//         apple: string;
//         shortcut: string;
//     };
// }

// export const faviconConfig: FaviconConfig = {
//     fsclinicals: {
//         icon: "/manifest-icons/fsc-logo-favicon.ico",
//         apple: "/manifest-icons/fsc-logo-x512.png",
//         shortcut: "/manifest-icons/fsc-logo-x512.png/",
//     },
//     llpmg: {
//         icon: "/manifest-icons/llpmg-logo-favicon.ico",
//         apple: "/manifest-icons/llpmg_apple-touch-icon.png",
//         shortcut: "/manifest-icons/llpmg-logo-x512.png/",
//     },
//     // driptrace: {
//     //     icon: "/favicon.ico",
//     //     apple: "/fsclinicals/llpmg_apple-touch-icon.png",
//     //     shortcut: "/fsclinicals/llpmg_-logo_512.png/",
//     // },
// };

// utils/getFavicon.ts

export interface FaviconConfig {
    icon: string;
    apple: string;
    shortcut: string;
}

export function getFavicon(domainContext: string): FaviconConfig {
    const basePath = "/manifest-icons";

    switch (domainContext) {
        case "llpmg":
            return {
                icon: `${basePath}/llpmg-logo-favicon.ico`,
                apple: `${basePath}/llpmg-logo-x192.png`,
                shortcut: `${basePath}/llpmg-logo-x192.png`,
            };
        case "fsclinicals":
            return {
                icon: `${basePath}/fsc-logo-favicon.ico`,
                apple: `${basePath}/fsc-logo-x192.png`,
                shortcut: `${basePath}/fsc-logo-x192.png`,
            };
        default:
            return {
                icon: `${basePath}/driptrace-logo-favicon.ico`,
                apple: `${basePath}/driptrace-logo-x192.png`,
                shortcut: `${basePath}/driptrace-logo-x192.png`,
            };
    }
}
