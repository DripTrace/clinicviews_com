// // // // import type { NextApiRequest, NextApiResponse } from "next";

// // // // interface TokenResponse {
// // // //     access_token: string;
// // // //     token_type: string;
// // // //     expires_in: number;
// // // //     scope: string;
// // // // }

// // // // export default async function handler(
// // // //     req: NextApiRequest,
// // // //     res: NextApiResponse
// // // // ) {
// // // //     try {
// // // //         const tokenResponse = await fetch(
// // // //             `${process.env.NEXT_PUBLIC_RC_WP_SERVER}/restapi/oauth/token`,
// // // //             {
// // // //                 method: "POST",
// // // //                 headers: {
// // // //                     "Content-Type": "application/x-www-form-urlencoded",
// // // //                 },
// // // //                 body: new URLSearchParams({
// // // //                     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
// // // //                     client_id: process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID!,
// // // //                     client_secret: process.env.NEXT_PUBLIC_RC_WP_CLIENT_SECRET!,
// // // //                     assertion: process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN!, // Use the JWT token from env variables
// // // //                 }),
// // // //             }
// // // //         );

// // // //         if (!tokenResponse.ok) {
// // // //             throw new Error(
// // // //                 `Failed to authenticate: ${tokenResponse.statusText}`
// // // //             );
// // // //         }

// // // //         const tokenData: TokenResponse = await tokenResponse.json();

// // // //         res.status(200).json({ token: tokenData.access_token });
// // // //     } catch (error) {
// // // //         const errorMessage =
// // // //             error instanceof Error ? error.message : "Unknown error occurred";
// // // //         console.error("Failed to authenticate:", errorMessage);
// // // //         res.status(500).json({
// // // //             message: "Failed to authenticate",
// // // //             error: errorMessage,
// // // //         });
// // // //     }
// // // // }

// // // import type { NextApiRequest, NextApiResponse } from "next";

// // // interface TokenResponse {
// // //     access_token: string;
// // //     token_type: string;
// // //     expires_in: number;
// // //     scope: string;
// // // }

// // // export default async function handler(
// // //     req: NextApiRequest,
// // //     res: NextApiResponse
// // // ) {
// // //     try {
// // //         const tokenResponse = await fetch(
// // //             `${process.env.SIP_INFO_DOMAIN}/restapi/oauth/token`,
// // //             {
// // //                 method: "POST",
// // //                 headers: {
// // //                     "Content-Type": "application/x-www-form-urlencoded",
// // //                 },
// // //                 body: new URLSearchParams({
// // //                     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
// // //                     client_id: process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID!,
// // //                     client_secret: process.env.NEXT_PUBLIC_RC_WP_CLIENT_SECRET!,
// // //                     assertion: process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN!, // Use the JWT token from env variables
// // //                 }),
// // //             }
// // //         );

// // //         if (!tokenResponse.ok) {
// // //             throw new Error(
// // //                 `Failed to authenticate: ${tokenResponse.statusText}`
// // //             );
// // //         }

// // //         const tokenData: TokenResponse = await tokenResponse.json();

// // //         res.status(200).json({ token: tokenData.access_token });
// // //     } catch (error) {
// // //         const errorMessage =
// // //             error instanceof Error ? error.message : "Unknown error occurred";
// // //         console.error("Failed to authenticate:", errorMessage);
// // //         res.status(500).json({
// // //             message: "Failed to authenticate",
// // //             error: errorMessage,
// // //         });
// // //     }
// // // }

// // import type { NextApiRequest, NextApiResponse } from "next";

// // interface TokenResponse {
// //     access_token: string;
// //     token_type: string;
// //     expires_in: number;
// //     scope: string;
// // }

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse
// // ) {
// //     try {
// //         const tokenResponse = await fetch(
// //             `${process.env.NEXT_PUBLIC_RC_WP_SERVER}/restapi/oauth/token`,
// //             {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/x-www-form-urlencoded",
// //                 },
// //                 body: new URLSearchParams({
// //                     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
// //                     client_id: process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID!,
// //                     client_secret: process.env.NEXT_PUBLIC_RC_WP_CLIENT_SECRET!,
// //                     assertion: process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN!, // Use the JWT token from env variables
// //                 }),
// //             }
// //         );

// //         if (!tokenResponse.ok) {
// //             throw new Error(
// //                 `Failed to authenticate: ${tokenResponse.statusText}`
// //             );
// //         }

// //         const tokenData: TokenResponse = await tokenResponse.json();

// //         res.status(200).json({ token: tokenData.access_token });
// //     } catch (error) {
// //         const errorMessage =
// //             error instanceof Error ? error.message : "Unknown error occurred";
// //         console.error("Failed to authenticate:", errorMessage);
// //         res.status(500).json({
// //             message: "Failed to authenticate",
// //             error: errorMessage,
// //         });
// //     }
// // }

// // import type { NextApiRequest, NextApiResponse } from "next";

// // interface TokenResponse {
// //     access_token: string;
// //     token_type: string;
// //     expires_in: number;
// //     scope: string;
// // }

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse
// // ) {
// //     try {
// //         const tokenResponse = await fetch(
// //             `${process.env.NEXT_PUBLIC_RC_WP_SERVER}/restapi/oauth/token`,
// //             {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/x-www-form-urlencoded",
// //                 },
// //                 body: new URLSearchParams({
// //                     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
// //                     client_id: process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID!,
// //                     client_secret: process.env.NEXT_PUBLIC_RC_WP_CLIENT_SECRET!,
// //                     assertion: process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN!, // Use the JWT token from env variables
// //                 }),
// //             }
// //         );

// //         if (!tokenResponse.ok) {
// //             throw new Error(
// //                 `Failed to authenticate: ${tokenResponse.statusText}`
// //             );
// //         }

// //         const tokenData: TokenResponse = await tokenResponse.json();

// //         res.status(200).json({ token: tokenData.access_token });
// //     } catch (error) {
// //         const errorMessage =
// //             error instanceof Error ? error.message : "Unknown error occurred";
// //         console.error("Failed to authenticate:", errorMessage);
// //         res.status(500).json({
// //             message: "Failed to authenticate",
// //             error: errorMessage,
// //         });
// //     }
// // }

// import type { NextApiRequest, NextApiResponse } from "next";

// interface TokenResponse {
//     access_token: string;
//     token_type: string;
//     expires_in: number;
//     scope: string;
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     try {
//         // Log environment variables (excluding sensitive data)
//         console.log(
//             "RingCentral API Server:",
//             process.env.NEXT_PUBLIC_RC_WP_SERVER
//         );
//         console.log(
//             "RingCentral Client ID:",
//             process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID
//         );
//         console.log(
//             "Using JWT Token:",
//             process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN ? "Yes" : "No"
//         );

//         const tokenResponse = await fetch(
//             `${process.env.NEXT_PUBLIC_RC_WP_SERVER}/restapi/oauth/token`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 body: new URLSearchParams({
//                     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//                     client_id: process.env.NEXT_PUBLIC_RC_WP_CLIENT_ID!,
//                     client_secret: process.env.NEXT_PUBLIC_RC_WP_CLIENT_SECRET!,
//                     assertion: process.env.NEXT_PUBLIC_RC_WP_JWT_TOKEN!, // Use the JWT token from env variables
//                 }),
//             }
//         );

//         // Check for a successful response
//         if (!tokenResponse.ok) {
//             const errorText = await tokenResponse.text(); // Get the full error message from the response
//             throw new Error(
//                 `Failed to authenticate: ${tokenResponse.statusText} - ${errorText}`
//             );
//         }

//         const tokenData: TokenResponse = await tokenResponse.json();

//         res.status(200).json({ token: tokenData.access_token });
//     } catch (error) {
//         const errorMessage =
//             error instanceof Error ? error.message : "Unknown error occurred";
//         console.error("Failed to authenticate:", errorMessage);
//         res.status(500).json({
//             message: "Failed to authenticate",
//             error: errorMessage,
//         });
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Check for the correct environment variables
        const {
            NEXT_PUBLIC_RC_WP_CLIENT_ID,
            NEXT_PUBLIC_RC_WP_CLIENT_SECRET,
            NEXT_PUBLIC_RC_WP_CALLER_JWT_TOKEN,
        } = process.env;

        if (
            !NEXT_PUBLIC_RC_WP_CLIENT_ID ||
            !NEXT_PUBLIC_RC_WP_CLIENT_SECRET ||
            !NEXT_PUBLIC_RC_WP_CALLER_JWT_TOKEN
        ) {
            throw new Error(
                "Missing environment variables for RingCentral API authentication"
            );
        }

        // Make the request to RingCentral for the JWT token exchange
        const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_RC_WP_SERVER}/restapi/oauth/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${NEXT_PUBLIC_RC_WP_CLIENT_ID}:${NEXT_PUBLIC_RC_WP_CLIENT_SECRET}`).toString("base64")}`,
                },
                body: new URLSearchParams({
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: NEXT_PUBLIC_RC_WP_CALLER_JWT_TOKEN,
                }),
            }
        );

        console.log("token response: >>>> \n", tokenResponse);

        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.json();
            throw new Error(
                `Failed to authenticate: ${tokenResponse.statusText} - ${JSON.stringify(errorDetails)}`
            );
        }

        const tokenData: TokenResponse = await tokenResponse.json();

        // Return the token to the client
        res.status(200).json({ token: tokenData.access_token });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to authenticate:", errorMessage);
        res.status(500).json({
            message: "Failed to authenticate",
            error: errorMessage,
        });
    }
}
