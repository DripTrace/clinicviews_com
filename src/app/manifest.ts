// import { MetadataRoute } from "next";

// export default function manifest(): MetadataRoute.Manifest {
// 	return {
// 		theme_color: "#255378",
// 		background_color: "#6497B0",
// 		display: "standalone",
// 		scope: "/",
// 		start_url: "/",
// 		name: "LomaLindaPsychMedGroup",
// 		short_name: "LLPMG",
// 		description: "Loma Linda Psychiatric Medical Group",
// 		orientation: "portrait",
// 		icons: [
// 			{
// 				src: "llpmg-icons/llpmg-icon-192x192.png",
// 				sizes: "192x192",
// 				type: "image/png",
// 			},
// 			{
// 				src: "llpmg-icons/llpmg-icon-256x256.png",
// 				sizes: "256x256",
// 				type: "image/png",
// 			},
// 			{
// 				src: "llpmg-icons/llpmg-icon-384x384.png",
// 				sizes: "384x384",
// 				type: "image/png",
// 			},
// 			{
// 				src: "llpmg-icons/llpmg-icon-512x512.png",
// 				sizes: "512x512",
// 				type: "image/png",
// 			},
// 			{
// 				src: "llpmg-masks/llpmg-maskable_icon_x512.png",
// 				sizes: "512x512",
// 				type: "image/x-icon",
// 				purpose: "maskable",
// 			},
// 		],
// 	};
// }

// import { MetadataRoute } from "next";

// export default function manifest(): MetadataRoute.Manifest {
// 	return {
// 		theme_color: "#255378",
// 		background_color: "#6497B0",
// 		display: "standalone",
// 		// scope: "/",
// 		start_url: "/",
// 		name: "LomaLindaPsychMedGroup",
// 		short_name: "LLPMG",
// 		description: "Loma Linda Psychiatric Medical Group",
// 		orientation: "portrait",
// 		icons: [
// 			{
// 				src: "/favicon.ico",
// 				sizes: "any",
// 				type: "image/x-icon",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-16.png",
// 				sizes: "16x16",
// 				type: "image/png",
// 				purpose: "maskable",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-48.png",
// 				sizes: "48x48",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-72.png",
// 				sizes: "72x72",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-96.png",
// 				sizes: "96x96",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-128.png",
// 				sizes: "128x128",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-144.png",
// 				sizes: "144x144",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-152.png",
// 				sizes: "152x152",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-192.png",
// 				sizes: "192x192",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-256.png",
// 				sizes: "256x256",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-384.png",
// 				sizes: "384x384",
// 				type: "image/png",
// 			},
// 			{
// 				src: "manifest-icons/llpmg-logo-512.png",
// 				sizes: "512x512",
// 				type: "image/png",
// 			},
// 			{
// 				src: "llpmg-maskable_icon_x512.png",
// 				sizes: "512x512",
// 				type: "image/x-icon",
// 				purpose: "maskable",
// 			},
// 		],
// 		// splash_pages: null,
// 	};
// }

// app/manifest.ts

// import { MetadataRoute } from "next";
// import { cookies } from "next/headers";
// import { getManifestIcons, manifestConfig } from "../../config/manifestConfig";
// // import { manifestConfig, getManifestIcons } from '../config/manifestConfig';

// export default function manifest(): MetadataRoute.Manifest {
//     const cookieStore = cookies();
//     const domainContext = cookieStore.get("domainContext")?.value || "llpmg";

//     const config = manifestConfig[domainContext];

//     return {
//         theme_color: config.themeColor,
//         background_color: config.backgroundColor,
//         display: "standalone",
//         start_url: "/",
//         name: config.name,
//         short_name: config.shortName,
//         description: config.description,
//         orientation: "portrait",
//         icons: getManifestIcons(config.iconPrefix),
//     };
// }

// app/manifest.ts

// import { MetadataRoute } from "next";
// import { cookies } from "next/headers";
// import { getManifestIcons, manifestConfig } from "../../config/manifestConfig";

// export default function manifest(): MetadataRoute.Manifest {
//     const cookieStore = cookies();
//     const domainContext =
//         cookieStore.get("domainContext")?.value || "driptrace";

//     console.log("Generating manifest for domain context:", domainContext);

//     const config = manifestConfig[domainContext];

//     if (!config) {
//         console.error(
//             `No manifest configuration found for domain context: ${domainContext}`
//         );
//         return manifestConfig.driptrace; // Fallback to driptrace config
//     }

//     const generatedManifest: MetadataRoute.Manifest = {
//         name: config.name,
//         short_name: config.shortName,
//         description: config.description,
//         start_url: "/",
//         display: "standalone",
//         background_color: config.backgroundColor,
//         theme_color: config.themeColor,
//         icons: getManifestIcons(config.iconPrefix),
//         id: "/",
//         scope: "/",
//     };

//     console.log(
//         "Generated manifest:",
//         JSON.stringify(generatedManifest, null, 2)
//     );

//     return generatedManifest;
// }

// app/manifest.ts

// import { MetadataRoute } from "next";
// import { cookies } from "next/headers";
// import { getManifestIcons, manifestConfig } from "../../config/manifestConfig";
// // import { manifestConfig, getManifestIcons, ManifestConfigItem } from '../config/manifestConfig';

// export default function manifest(): MetadataRoute.Manifest {
//     console.log("Manifest function called");

//     const cookieStore = cookies();
//     const domainContext =
//         cookieStore.get("domainContext")?.value || "driptrace";

//     console.log("Generating manifest for domain context:", domainContext);

//     const config = manifestConfig[domainContext as keyof typeof manifestConfig];

//     if (!config) {
//         console.error(
//             `No manifest configuration found for domain context: ${domainContext}`
//         );
//         return {} as MetadataRoute.Manifest;
//     }

//     // const basePath = "/clinicviews_com";
//     const basePath = "";

//     const generatedManifest: MetadataRoute.Manifest = {
//         name: config.name,
//         short_name: config.shortName,
//         description: config.description,
//         start_url: `${basePath}/`,
//         scope: basePath,
//         display: "standalone",
//         background_color: config.backgroundColor,
//         theme_color: config.themeColor,
//         icons: getManifestIcons(config.iconPrefix).map((icon) => ({
//             ...icon,
//             src: `${basePath}/${icon.src}`,
//         })),
//         orientation: "portrait",
//         id: "/",
//     };

//     console.log(
//         "Generated manifest:",
//         JSON.stringify(generatedManifest, null, 2)
//     );

//     return generatedManifest;
// }

import { MetadataRoute } from "next";
import { cookies } from "next/headers";
import { getManifestIcons, manifestConfig } from "../../config/manifestConfig";

export default function manifest(): MetadataRoute.Manifest {
    console.log("Manifest function called");
    const cookieStore = cookies();
    const domainContext =
        cookieStore.get("domainContext")?.value || "driptrace";
    console.log("Generating manifest for domain context:", domainContext);

    const config = manifestConfig[domainContext as keyof typeof manifestConfig];
    if (!config) {
        console.error(
            `No manifest configuration found for domain context: ${domainContext}`
        );
        return {} as MetadataRoute.Manifest;
    }

    const basePath = "";
    const generatedManifest: MetadataRoute.Manifest = {
        name: config.name,
        short_name: config.shortName,
        description: config.description,
        start_url: `${basePath}/`,
        scope: basePath,
        display: "standalone",
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        icons: getManifestIcons(config.iconPrefix).map((icon) => ({
            ...icon,
            src: `${basePath}/${icon.src}`,
        })),
        orientation: "portrait",
        id: "/",
    };

    console.log(
        "Generated manifest:",
        JSON.stringify(generatedManifest, null, 2)
    );
    return generatedManifest;
}
