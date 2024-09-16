import Softphone from "@/ref/soft/src/softphone";
import type { NextApiRequest, NextApiResponse } from "next";
// import Softphone from "@/ref/softphone"; // Adjust the import path as needed

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { action, callee } = req.body;

    const sipInfo = {
        username: process.env.SIP_INFO_USERNAME,
        password: process.env.SIP_INFO_PASSWORD,
        authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID,
        domain: process.env.SIP_INFO_DOMAIN,
    };

    try {
        const softphone = new Softphone(sipInfo);
        softphone.enableDebugMode();
        await softphone.register();

        if (action === "call") {
            const callSession = await softphone.call(parseInt(callee, 10));
            // Handle call session events here
        }

        res.status(200).json({ message: "SIP action completed successfully" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}
