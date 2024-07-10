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

    const dynamicManifest = {
        ...manifestContent,
        ...manifestContent.dynamicDomains[domain],
    };

    delete dynamicManifest.dynamicDomains;

    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(dynamicManifest);
}
