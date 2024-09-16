// sonnet-3.5 2.5th attempt (audio logs don't end after hangup)
import { NextApiRequest } from "next";
import Softphone from "@/ref/soft/src/softphone";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

let softphone: Softphone | null = null;
let io: SocketIOServer | null = null;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
) {
    if (!softphone || !io) {
        await initializeSoftphoneAndSocketIO(res);
    }

    if (req.method === "POST") {
        let body;
        try {
            body = await parseBody(req);
        } catch (error) {
            return res
                .status(400)
                .json({ error: "[SIP-HANDLER] Invalid request body" });
        }

        const { action } = body;

        switch (action) {
            case "initializeSocket":
                res.status(200).json({
                    socketUrl: process.env.WEBSOCKET_URL || "",
                });
                break;

            case "call":
                if (!softphone) {
                    return res.status(500).json({
                        error: "[SIP-HANDLER] Softphone not initialized",
                    });
                }
                try {
                    const callSession = await softphone.call(body.callee);
                    io?.emit("callStarted", { callId: callSession.callId });
                    res.status(200).json({ callId: callSession.callId });
                } catch (error) {
                    res.status(500).json({
                        error: "[SIP-HANDLER] Failed to initiate call",
                    });
                }
                break;

            case "hangup":
                if (!softphone) {
                    return res.status(500).json({
                        error: "[SIP-HANDLER] Softphone not initialized",
                    });
                }
                try {
                    await softphone.hangup();
                    io?.emit("callEnded");
                    res.status(200).json({ success: true });
                } catch (error) {
                    res.status(500).json({
                        error: "[SIP-HANDLER] Failed to hang up call",
                    });
                }
                break;

            case "answer":
                if (!softphone || !softphone.lastInviteMessage) {
                    return res.status(400).json({
                        error: "[SIP-HANDLER] No incoming call to answer",
                    });
                }
                try {
                    const callSession = await softphone.answer(
                        softphone.lastInviteMessage
                    );
                    io?.emit("callStarted", { callId: callSession.callId });
                    res.status(200).json({ callId: callSession.callId });
                } catch (error) {
                    res.status(500).json({
                        error: "[SIP-HANDLER] Failed to answer call",
                    });
                }
                break;

            case "decline":
                if (!softphone || !softphone.lastInviteMessage) {
                    return res.status(400).json({
                        error: "[SIP-HANDLER] No incoming call to decline",
                    });
                }
                try {
                    await softphone.decline(softphone.lastInviteMessage);
                    io?.emit("callEnded");
                    res.status(200).json({ success: true });
                } catch (error) {
                    res.status(500).json({
                        error: "[SIP-HANDLER] Failed to decline call",
                    });
                }
                break;

            default:
                res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
        }
    } else if (
        req.method === "PUT" &&
        req.headers["content-type"] === "application/octet-stream"
    ) {
        if (!softphone || !softphone.currentCallSession) {
            console.error(
                "[SIP-HANDLER] No active call session to process audio data"
            );
            return res
                .status(400)
                .json({ error: "[SIP-HANDLER] No active call session" });
        }

        try {
            const audioData = await getRawBody(req);

            // Log the received audio data details
            console.log(
                `[SIP-HANDLER] Received audio data: ${audioData.byteLength} bytes`
            );
            console.log(
                `[SIP-HANDLER] Audio data content: ${audioData.toString("hex").slice(0, 100)}...`
            ); // Logging the first 100 characters in hex

            await softphone.currentCallSession.sendAudio(audioData);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(
                `[SIP-HANDLER] Failed to process audio data: ${(error as Error).message}`
            );
            res.status(500).json({
                error: "[SIP-HANDLER] Failed to process audio data",
            });
        }
    } else {
        res.setHeader("Allow", ["POST", "PUT"]);
        res.status(405).end(`[SIP-HANDLER] Method ${req.method} Not Allowed`);
    }
}

async function initializeSoftphoneAndSocketIO(res: NextApiResponseServerIO) {
    const sipInfo = {
        username: process.env.SIP_INFO_USERNAME!,
        password: process.env.SIP_INFO_PASSWORD!,
        authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
        domain: process.env.SIP_INFO_DOMAIN!,
    };

    softphone = new Softphone(sipInfo);
    await softphone.register();
    console.log("[SIP-HANDLER] Softphone registered successfully");

    softphone.on("invite", (inviteMessage) => {
        const callerNumber =
            inviteMessage.headers.From.match(/<sip:(.+?)@/)?.[1] || "Unknown";
        io?.emit("incomingCall", { callerNumber });
    });

    softphone.on("callEnded", () => {
        io?.emit("callEnded");
    });

    softphone.on("audioData", (audioData: Buffer) => {
        console.log(
            `[SIP-HANDLER] Forwarding audio data: ${audioData.byteLength} bytes`
        );
        io?.emit("audioData", audioData);
    });

    if (!io) {
        if (!res.socket.server.io) {
            console.log("[SIP-HANDLER] Initializing Socket.IO server");
            io = new SocketIOServer(res.socket.server as any, {
                path: "/api/llpmg/sip-ws",
                addTrailingSlash: false,
            });
            res.socket.server.io = io;
        } else {
            console.log("[SIP-HANDLER] Socket.IO server already initialized");
            io = res.socket.server.io;
        }

        io.on("connection", (socket) => {
            console.log("[SIP-HANDLER] New WebSocket connection established");

            socket.on("audioData", (audioData: ArrayBuffer) => {
                if (softphone && softphone.currentCallSession) {
                    console.log(
                        `[SIP-HANDLER] Audio data received from client: ${audioData.byteLength} bytes`
                    );
                    softphone.currentCallSession.sendAudio(
                        Buffer.from(audioData)
                    );
                } else {
                    console.error(
                        "[SIP-HANDLER] No active call session to send audio data"
                    );
                }
            });

            socket.on("disconnect", () => {
                console.log("[SIP-HANDLER] WebSocket connection closed");
            });
        });
    }
}

async function parseBody(req: NextApiRequest): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });
}
// sonnet-3.5 2.5th attempt

// number 0
// import { NextApiRequest, NextApiResponse } from "next";
// import Softphone from "@/ref/soft/src/softphone";
// import { Server as SocketIOServer } from "socket.io";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// let softphone: Softphone | null = null;
// let io: SocketIOServer | null = null;

// export const config = {
//     api: {
//         bodyParser: true,
//     },
// };

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponseServerIO
// ) {
//     console.log(`[SIP-HANDLER] Received ${req.method} request:`, req.body);

//     if (!softphone || !io) {
//         console.log("[SIP-HANDLER] Initializing Softphone and SocketIO");
//         await initializeSoftphoneAndSocketIO(res);
//     }

//     if (req.method === "POST") {
//         const { action, callee } = req.body;

//         switch (action) {
//             case "call":
//                 if (!softphone) {
//                     console.error("[SIP-HANDLER] Softphone not initialized");
//                     return res.status(500).json({
//                         error: "[SIP-HANDLER] Softphone not initialized",
//                     });
//                 }
//                 try {
//                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
//                     const callSession = await softphone.call(callee);
//                     console.log(
//                         `[SIP-HANDLER] Call initiated successfully, CallID: ${callSession.callId}`
//                     );
//                     io?.emit("callStarted", { callId: callSession.callId });
//                     res.status(200).json({ callId: callSession.callId });
//                 } catch (error) {
//                     console.error(
//                         "[SIP-HANDLER] Failed to initiate call:",
//                         error
//                     );
//                     res.status(500).json({
//                         error: `[SIP-HANDLER] Failed to initiate call: ${(error as Error).message}`,
//                     });
//                 }
//                 break;

//             case "hangup":
//                 if (!softphone) {
//                     return res.status(500).json({
//                         error: "[SIP-HANDLER] Softphone not initialized",
//                     });
//                 }
//                 try {
//                     await softphone.hangup();
//                     io?.emit("callEnded");
//                     res.status(200).json({ success: true });
//                 } catch (error) {
//                     console.error(
//                         "[SIP-HANDLER] Failed to hang up call:",
//                         error
//                     );
//                     res.status(500).json({
//                         error: "[SIP-HANDLER] Failed to hang up call",
//                     });
//                 }
//                 break;

//             case "answer":
//                 if (!softphone || !softphone.lastInviteMessage) {
//                     return res.status(400).json({
//                         error: "[SIP-HANDLER] No incoming call to answer",
//                     });
//                 }
//                 try {
//                     const callSession = await softphone.answer(
//                         softphone.lastInviteMessage
//                     );
//                     io?.emit("callAnswered", { callId: callSession.callId });
//                     res.status(200).json({ callId: callSession.callId });
//                 } catch (error) {
//                     console.error(
//                         "[SIP-HANDLER] Failed to answer call:",
//                         error
//                     );
//                     res.status(500).json({
//                         error: "[SIP-HANDLER] Failed to answer call",
//                     });
//                 }
//                 break;

//             default:
//                 console.error(`[SIP-HANDLER] Invalid action: ${action}`);
//                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
//         }
//     } else if (
//         req.method === "PUT" &&
//         req.headers["content-type"] === "application/octet-stream"
//     ) {
//         if (!softphone || !softphone.currentCallSession) {
//             console.error(
//                 "[SIP-HANDLER] No active call session to process audio data"
//             );
//             return res
//                 .status(400)
//                 .json({ error: "[SIP-HANDLER] No active call session" });
//         }

//         try {
//             const audioData = await getRawBody(req);
//             await softphone.sendAudio(audioData);
//             res.status(200).json({ success: true });
//         } catch (error) {
//             console.error(
//                 `[SIP-HANDLER] Failed to process audio data: ${(error as Error).message}`
//             );
//             res.status(500).json({
//                 error: "[SIP-HANDLER] Failed to process audio data",
//             });
//         }
//     } else {
//         console.error(`[SIP-HANDLER] Method ${req.method} not allowed`);
//         res.setHeader("Allow", ["POST", "PUT"]);
//         res.status(405).end(`[SIP-HANDLER] Method ${req.method} Not Allowed`);
//     }
// }

// async function initializeSoftphoneAndSocketIO(res: NextApiResponseServerIO) {
//     const sipInfo = {
//         username: process.env.SIP_INFO_USERNAME!,
//         password: process.env.SIP_INFO_PASSWORD!,
//         authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
//         domain: process.env.SIP_INFO_DOMAIN!,
//     };

//     softphone = new Softphone(sipInfo);
//     await softphone.register();
//     console.log("[SIP-HANDLER] Softphone registered successfully");

//     softphone.on("invite", (inviteMessage) => {
//         const callerNumber =
//             inviteMessage.headers.From.match(/<sip:(.+?)@/)?.[1] || "Unknown";
//         io?.emit("incomingCall", { callerNumber });
//     });

//     softphone.on("callEnded", () => {
//         io?.emit("callEnded");
//     });

//     softphone.on("audioData", (audioData: Buffer) => {
//         io?.emit("audioData", audioData);
//     });

//     if (!io) {
//         if (!res.socket.server.io) {
//             console.log("[SIP-HANDLER] Initializing Socket.IO server");
//             io = new SocketIOServer(res.socket.server as any, {
//                 path: "/api/llpmg/sip-ws",
//                 addTrailingSlash: false,
//             });
//             res.socket.server.io = io;
//         } else {
//             console.log("[SIP-HANDLER] Socket.IO server already initialized");
//             io = res.socket.server.io;
//         }

//         io.on("connection", (socket) => {
//             console.log("[SIP-HANDLER] New WebSocket connection established");

//             socket.on("audioData", (audioData: ArrayBuffer) => {
//                 if (softphone && softphone.currentCallSession) {
//                     softphone.sendAudio(audioData);
//                 } else {
//                     console.error(
//                         "[SIP-HANDLER] No active call session to send audio data"
//                     );
//                 }
//             });

//             socket.on("disconnect", () => {
//                 console.log("[SIP-HANDLER] WebSocket connection closed");
//             });
//         });
//     }
// }

// async function getRawBody(req: NextApiRequest): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//         const chunks: Buffer[] = [];
//         req.on("data", (chunk: Buffer) => chunks.push(chunk));
//         req.on("end", () => resolve(Buffer.concat(chunks)));
//         req.on("error", reject);
//     });
// }
// number 0
