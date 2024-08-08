// app/api/llpmg-text-session/route.ts

// import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { SDK } from "@ringcentral/sdk";

const rcsdk = new SDK({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_CLIENT_ID,
    clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

export async function POST(res: NextApiResponse, request: NextApiRequest) {
    try {
        const { providerPhone, patientPhone, initialMessage } = await (
            request as any
        ).json();

        await platform.login({ jwt: process.env.RC_JWT });

        const resp = await platform.post(
            "/restapi/v1.0/account/~/extension/~/sms",
            {
                from: { phoneNumber: process.env.RC_PHONE_NUMBER },
                to: [
                    { phoneNumber: providerPhone },
                    { phoneNumber: patientPhone },
                ],
                text: initialMessage,
            }
        );

        const result = await resp.json();

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in API route:", error);
        res.status(500).json({
            error: "An unknown error occurred",
            details: (error as Error).message,
        });
    }
}
//         return NextResponse.json({ success: true, messageId: result.id });
//     } catch (error) {
//         console.error("Error initiating text session:", error);
//         return NextResponse.json(
//             { error: "Failed to initiate text session" },
//             { status: 500 }
//         );
//     }
// }
