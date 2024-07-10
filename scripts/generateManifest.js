// scripts/generateManifest.js

// const fs = require("fs");
// const path = require("path");

// async function generateManifest() {
//     try {
//         const { manifestConfig, getManifestIcons } = await import(
//             "../config/manifestConfig.ts"
//         );

//         const domains = Object.keys(manifestConfig);

//         domains.forEach((domain) => {
//             const config = manifestConfig[domain];
//             const manifestData = {
//                 name: config.name,
//                 short_name: config.shortName,
//                 description: config.description,
//                 start_url: "/",
//                 scope: "/",
//                 display: "standalone",
//                 background_color: config.backgroundColor,
//                 theme_color: config.themeColor,
//                 icons: getManifestIcons(config.iconPrefix),
//                 orientation: "portrait",
//                 id: "/",
//             };

//             const manifestJson = JSON.stringify(manifestData, null, 2);
//             const outputPath = path.join(
//                 __dirname,
//                 "..",
//                 "public",
//                 `manifest_${domain}.webmanifest`
//             );

//             fs.writeFileSync(outputPath, manifestJson);
//             console.log(`Generated manifest for ${domain} at ${outputPath}`);
//         });
//     } catch (error) {
//         console.error("Error generating manifest:", error);
//         process.exit(1);
//     }
// }

// generateManifest();

// scripts/generateManifest.js

// const fs = require("fs");
// const path = require("path");

// async function generateManifest() {
//     try {
//         const { manifestConfig, getManifestIcons } = await import(
//             "../config/manifestConfig.ts"
//         );

//         const universalManifest = {
//             name: "Dynamic Web App",
//             short_name: "DWA",
//             description: "A multi-domain web application",
//             start_url: "/",
//             scope: "/",
//             display: "standalone",
//             background_color: "#ffffff",
//             theme_color: "#000000",
//             icons: getManifestIcons("default"),
//             orientation: "portrait",
//             id: "/",
//             dynamicDomains: {},
//         };

//         Object.entries(manifestConfig).forEach(([domain, config]) => {
//             universalManifest.dynamicDomains[domain] = {
//                 name: config.name,
//                 short_name: config.shortName,
//                 description: config.description,
//                 background_color: config.backgroundColor,
//                 theme_color: config.themeColor,
//                 icons: getManifestIcons(config.iconPrefix),
//             };
//         });

//         const manifestJson = JSON.stringify(universalManifest, null, 2);
//         const outputPath = path.join(
//             __dirname,
//             "..",
//             "public",
//             "manifest.webmanifest"
//         );

//         fs.writeFileSync(outputPath, manifestJson);
//         console.log(`Generated universal manifest at ${outputPath}`);
//     } catch (error) {
//         console.error("Error generating manifest:", error);
//         process.exit(1);
//     }
// }

// generateManifest();

// scripts/generateManifest.js

// scripts/generateManifest.js
// scripts/generateManifest.js

// const fs = require("fs");
// const path = require("path");

// async function generateManifest() {
//     try {
//         const { manifestConfig, getManifestIcons } = await import(
//             "../config/manifestConfig.ts"
//         );

//         const universalManifest = {
//             dynamicDomains: {},
//         };

//         Object.entries(manifestConfig).forEach(([domain, config]) => {
//             universalManifest.dynamicDomains[domain] = {
//                 name: config.name,
//                 short_name: config.shortName,
//                 description: config.description,
//                 background_color: config.backgroundColor,
//                 theme_color: config.themeColor,
//                 icons: getManifestIcons(config.iconPrefix).map((icon) => ({
//                     ...icon,
//                     src: `/manifest-icons/${icon.src}`,
//                 })),
//                 start_url: "{{START_URL_PLACEHOLDER}}",
//                 id: "{{ID_PLACEHOLDER}}",
//                 scope: "/",
//                 display: "standalone",
//                 orientation: "portrait",
//             };
//         });

//         const manifestJson = JSON.stringify(universalManifest, null, 2);
//         const outputPath = path.join(
//             __dirname,
//             "..",
//             "public",
//             "manifest.webmanifest"
//         );

//         fs.writeFileSync(outputPath, manifestJson);
//         console.log(`Generated universal manifest at ${outputPath}`);
//         console.log("Manifest content:", manifestJson);
//     } catch (error) {
//         console.error("Error generating manifest:", error);
//         process.exit(1);
//     }
// }

// generateManifest();

// scripts/generateManifest.js

// scripts/generateManifest.js

const fs = require("fs");
const path = require("path");

async function generateManifest() {
    try {
        const { manifestConfig, getManifestIcons } = await import(
            "../config/manifestConfig.ts"
        );

        Object.entries(manifestConfig).forEach(([domain, config]) => {
            const manifest = {
                name: config.name,
                short_name: config.shortName,
                description: config.description,
                start_url: domain === "driptrace" ? "/" : `/${domain}/landing`,
                scope: "/",
                display: "standalone",
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                orientation: "portrait",
                icons: getManifestIcons(config.iconPrefix).map((icon) => ({
                    ...icon,
                    src: `/manifest-icons/${icon.src}`,
                })),
            };

            const manifestJson = JSON.stringify(manifest, null, 2);
            const outputPath = path.join(
                __dirname,
                "..",
                "public",
                `manifest_${domain}.webmanifest`
            );

            fs.writeFileSync(outputPath, manifestJson);
            console.log(`Generated manifest for ${domain} at ${outputPath}`);
        });
    } catch (error) {
        console.error("Error generating manifests:", error);
        process.exit(1);
    }
}

generateManifest();
