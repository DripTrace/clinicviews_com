// pages/api/manifest.js

import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const manifestPath = path.join(
        process.cwd(),
        "public",
        "manifest.webmanifest"
    );
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    const host = req.headers.host;
    let domain = "driptrace"; // Default to driptrace

    if (host && host.includes("lomalindapsych.com")) {
        domain = "llpmg";
    } else if (host && host.includes("fsclinicals.com")) {
        domain = "fsclinicals";
    }

    const domainSpecificContent = manifestContent.dynamicDomains[domain];

    if (!domainSpecificContent) {
        console.error(`No manifest configuration found for domain: ${domain}`);
        res.status(404).json({ error: "Manifest not found for this domain" });
        return;
    }

    const dynamicManifest = {
        ...domainSpecificContent,
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        id: "/",
    };

    console.log(`Serving manifest for domain: ${domain}`);
    console.log("Dynamic Manifest:", JSON.stringify(dynamicManifest, null, 2));

    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(dynamicManifest);
}
