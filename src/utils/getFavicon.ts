// utils/getFavicon.ts

import { faviconConfig } from "../../config/faviconConfig";

export function getFavicon(domain: string) {
    return faviconConfig[domain] || faviconConfig.driptrace; // Fallback to Driptrace favicon
}
