// scripts/generateManifest.js

const fs = require("fs");
const path = require("path");

async function generateManifest() {
    try {
        const { manifestConfig, getManifestIcons } = await import(
            "../config/manifestConfig.ts"
        );

        const domains = Object.keys(manifestConfig);

        domains.forEach((domain) => {
            const config = manifestConfig[domain];
            const manifestData = {
                name: config.name,
                short_name: config.shortName,
                description: config.description,
                start_url: "/",
                scope: "/",
                display: "standalone",
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                icons: getManifestIcons(config.iconPrefix),
                orientation: "portrait",
                id: "/",
            };

            const manifestJson = JSON.stringify(manifestData, null, 2);
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
        console.error("Error generating manifest:", error);
        process.exit(1);
    }
}

generateManifest();