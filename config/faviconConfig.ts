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
        icon: "/fsclinicals/fsclinicals_-.ico",
        apple: "/fsclinicals/fsclinicals-_512",
        shortcut: "/fsclinicals/fsclinicals-_512.png",
    },
    llpmg: {
        icon: "/favicon.ico",
        apple: "/fsclinicals/llpmg_apple-touch-icon.png",
        shortcut: "/fsclinicals/llpmg_-logo_512.png/",
    },
    driptrace: {
        icon: "/favicon.ico",
        apple: "/fsclinicals/llpmg_apple-touch-icon.png",
        shortcut: "/fsclinicals/llpmg_-logo_512.png/",
    },
};
