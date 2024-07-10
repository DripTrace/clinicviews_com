// config/faviconConfig.ts

interface FaviconConfig {
    [key: string]: {
        icon: string;
        apple: string;
        shortcut: string;
    };
}

export const faviconConfig: FaviconConfig = {
    fsclinicals: {
        icon: "/manifest-icons/fsc-logo-favicon.ico",
        apple: "/manifest-icons/fsc-logo-x512",
        shortcut: "/manifest-icons/fsc-logo-x512.png/",
    },
    llpmg: {
        icon: "/manifest-icons/llpmg-logo-favicon.ico",
        apple: "/manifest-icons/llpmg_apple-touch-icon.png",
        shortcut: "/manifest-icons/llpmg-logo_x512.png/",
    },
    // driptrace: {
    //     icon: "/favicon.ico",
    //     apple: "/fsclinicals/llpmg_apple-touch-icon.png",
    //     shortcut: "/fsclinicals/llpmg_-logo_512.png/",
    // },
};
