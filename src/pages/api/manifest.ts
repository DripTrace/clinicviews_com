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
    let domain = "default";

    if (host && host.includes("lomalindapsych.com")) {
        domain = "llpmg";
    } else if (host && host.includes("fsclinicals.com")) {
        domain = "fsclinicals";
    } else if (host && host.includes("medical.driptrace.com")) {
        domain = "driptrace";
    }

    const domainSpecificContent = manifestContent.dynamicDomains[domain] || {};

    const dynamicManifest = {
        ...manifestContent,
        ...domainSpecificContent,
        icons: domainSpecificContent.icons || manifestContent.icons,
    };

    delete dynamicManifest.dynamicDomains;

    console.log(`Serving manifest for domain: ${domain}`);
    console.log("Dynamic Manifest:", JSON.stringify(dynamicManifest, null, 2));

    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(dynamicManifest);
}
