// import { NextApiRequest, NextApiResponse } from "next";
// import { SDK } from "@ringcentral/sdk";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const sdk = new SDK({
//         clientId: process.env.RC_CLIENT_ID,
//         clientSecret: process.env.RC_CLIENT_SECRET,
//         server: process.env.RC_SERVER_URL,
//     });

//     const platform = sdk.platform();

//     try {
//         const authResponse = await platform.login({
//             jwt: process.env.JWT_ASSERTION_TOKEN, // Use 'jwt' instead of 'grant_type'
//         });

//         res.status(200).json({ success: true, data: authResponse.json() });
//     } catch (error) {
//         console.error("Login failed:", error);
//         res.status(500).json({
//             success: false,
//             error: (error as Error).message,
//         });
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { ringCentralClient } from "@/lib/ringcentralClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            // Login using JWT
            await ringCentralClient.login({ jwt: process.env.RC_JWT });

            // Assuming that after login, we return the necessary SIP configuration
            const sipConfig = {
                username: process.env.SIP_INFO_USERNAME,
                password: process.env.SIP_INFO_PASSWORD,
                domain: process.env.SIP_INFO_DOMAIN,
            };

            res.status(200).json({ sipConfig });
        } catch (error) {
            console.error("Error authenticating with JWT:", error);
            res.status(500).json({
                error: "Failed to authenticate with JWT",
                details: (error as Error).message,
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
