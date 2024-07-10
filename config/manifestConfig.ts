// // config/manifestConfig.ts

// import { MetadataRoute } from "next";

// interface ManifestConfig {
//     [key: string]: {
//         name: string;
//         shortName: string;
//         description: string;
//         themeColor: string;
//         backgroundColor: string;
//         iconPrefix: string;
//     };
// }

// export const manifestConfig: ManifestConfig = {
//     llpmg: {
//         name: "LomaLindaPsychMedGroup",
//         shortName: "LLPMG",
//         description: "Loma Linda Psychiatric Medical Group",
//         themeColor: "#255378",
//         backgroundColor: "#6497B0",
//         iconPrefix: "llpmg-logo",
//     },
//     fsclinicals: {
//         name: "FourSquareClinicals",
//         shortName: "FSClinicals",
//         description: "Four Square Clinicals",
//         themeColor: "#1FABC7", // Adjust these colors as needed
//         backgroundColor: "#D1E0EB",
//         iconPrefix: "fsc-logo",
//     },
// };

// export function getManifestIcons(
//     prefix: string
// ): MetadataRoute.Manifest["icons"] {
//     return [
//         {
//             src: "/favicon.ico",
//             sizes: "any",
//             type: "image/x-icon",
//         },
//         {
//             src: `manifest-icons/${prefix}-16.png`,
//             sizes: "16x16",
//             type: "image/png",
//             purpose: "maskable",
//         },
//         {
//             src: `manifest-icons/${prefix}-48.png`,
//             sizes: "48x48",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-72.png`,
//             sizes: "72x72",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-96.png`,
//             sizes: "96x96",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-128.png`,
//             sizes: "128x128",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-144.png`,
//             sizes: "144x144",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-152.png`,
//             sizes: "152x152",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-192.png`,
//             sizes: "192x192",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-256.png`,
//             sizes: "256x256",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-384.png`,
//             sizes: "384x384",
//             type: "image/png",
//         },
//         {
//             src: `manifest-icons/${prefix}-512.png`,
//             sizes: "512x512",
//             type: "image/png",
//         },
//         {
//             src: `${prefix}-maskable_icon_x512.png`,
//             sizes: "512x512",
//             type: "image/x-icon",
//             purpose: "maskable",
//         },
//     ];
// }

// config/manifestConfig.ts

import { MetadataRoute } from "next";

interface ManifestConfigItem {
    name: string;
    shortName: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
    iconPrefix: string;
}

type ManifestConfig = {
    [key: string]: ManifestConfigItem;
};

export const manifestConfig: ManifestConfig = {
    llpmg: {
        name: "LomaLindaPsychMedGroup",
        shortName: "LLPMG",
        description: "Loma Linda Psychiatric Medical Group",
        themeColor: "#255378",
        backgroundColor: "#6497B0",
        iconPrefix: "llpmg-logo",
    },
    fsclinicals: {
        name: "FourSquareClinicals",
        shortName: "FSClinicals",
        description: "Four Square Clinicals",
        themeColor: "#1FABC7",
        backgroundColor: "#D1E0EB",
        iconPrefix: "fsc-logo",
    },
    driptrace: {
        name: "DripTrace Medical",
        shortName: "DripTrace",
        description: "DripTrace Medical Services",
        themeColor: "#0C3C60",
        backgroundColor: "#99AAC0",
        iconPrefix: "driptrace-logo",
    },
};

export function getManifestIcons(
    prefix: string
): MetadataRoute.Manifest["icons"] {
    return [
        {
            src: "/favicon.ico",
            sizes: "any",
            type: "image/x-icon",
        },
        {
            src: `manifest-icons/${prefix}-16.png`,
            sizes: "16x16",
            type: "image/png",
            purpose: "maskable",
        },
        {
            src: `manifest-icons/${prefix}-48.png`,
            sizes: "48x48",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-72.png`,
            sizes: "72x72",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-96.png`,
            sizes: "96x96",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-128.png`,
            sizes: "128x128",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-144.png`,
            sizes: "144x144",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-152.png`,
            sizes: "152x152",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-192.png`,
            sizes: "192x192",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-256.png`,
            sizes: "256x256",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-384.png`,
            sizes: "384x384",
            type: "image/png",
        },
        {
            src: `manifest-icons/${prefix}-512.png`,
            sizes: "512x512",
            type: "image/png",
        },
        {
            src: `${prefix}-maskable_icon_x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
        },
    ];
}
