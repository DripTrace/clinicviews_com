// pages/api/manifest.ts

import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Manifest request received");
    console.log("Request headers:", req.headers);

    const manifestPath = path.join(
        process.cwd(),
        "public",
        "manifest.webmanifest"
    );

    if (!fs.existsSync(manifestPath)) {
        console.error("Manifest file not found at:", manifestPath);
        res.status(404).json({ error: "Manifest file not found" });
        return;
    }

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    console.log(
        "Full manifest content:",
        JSON.stringify(manifestContent, null, 2)
    );

    const host = req.headers.host || "";
    console.log("Request host:", host);

    let domain = "driptrace"; // Default to driptrace

    if (host.includes("lomalindapsych.com")) {
        domain = "llpmg";
    } else if (host.includes("fsclinicals.com")) {
        domain = "fsclinicals";
    }

    console.log("Selected domain:", domain);

    const domainSpecificContent = manifestContent.dynamicDomains[domain];

    if (!domainSpecificContent) {
        console.error(`No manifest configuration found for domain: ${domain}`);
        res.status(404).json({ error: "Manifest not found for this domain" });
        return;
    }

    // Ensure all required fields are present
    const finalManifest = {
        ...domainSpecificContent,
        start_url: domainSpecificContent.start_url || "/",
        id: domainSpecificContent.id || "/",
        scope: domainSpecificContent.scope || "/",
        display: domainSpecificContent.display || "standalone",
    };

    console.log("Serving manifest:", JSON.stringify(finalManifest, null, 2));

    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(finalManifest);
}
