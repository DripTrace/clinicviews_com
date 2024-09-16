// // latest working
// // import { Server as NetServer } from "http";
// // import { NextApiRequest } from "next";
// // import { Server as ServerIO, Socket } from "socket.io";
// // import Softphone from "@/ref/soft/src/softphone";
// // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // export const config = {
// //     api: {
// //         bodyParser: false,
// //     },
// // };

// // let softphone: Softphone | null = null;
// // let io: ServerIO | null = null;

// // const SocketHandler = async (
// //     req: NextApiRequest,
// //     res: NextApiResponseServerIO
// // ) => {
// //     if (!res.socket.server.io) {
// //         console.log("[SIP-WS] Initializing Socket.io server...");
// //         const httpServer: NetServer = res.socket.server as any;
// //         io = new ServerIO(httpServer, {
// //             path: "/api/llpmg/sip-ws",
// //             addTrailingSlash: false,
// //         });
// //         res.socket.server.io = io;

// //         io.on("connection", (socket: Socket) => {
// //             console.log("[SIP-WS] New client connected");

// //             if (!softphone) {
// //                 const sipInfo = {
// //                     username: process.env.SIP_INFO_USERNAME!,
// //                     password: process.env.SIP_INFO_PASSWORD!,
// //                     authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// //                     domain: process.env.SIP_INFO_DOMAIN!,
// //                 };

// //                 console.log(
// //                     "[SIP-WS] Initializing Softphone with info:",
// //                     JSON.stringify(sipInfo, null, 2)
// //                 );
// //                 softphone = new Softphone(sipInfo);
// //                 softphone.enableDebugMode();
// //                 softphone
// //                     .register()
// //                     .then(() => {
// //                         console.log(
// //                             "[SIP-WS] Softphone registered successfully"
// //                         );

// //                         softphone!.on("invite", (inviteMessage: any) => {
// //                             const callerNumber =
// //                                 inviteMessage.headers.From.match(
// //                                     /<sip:(.+?)@/
// //                                 )?.[1];
// //                             console.log(
// //                                 `[SIP-WS] Incoming call detected from ${callerNumber}`
// //                             );
// //                             socket.emit("incomingCall", { callerNumber });
// //                         });

// //                         softphone!.on("callEnded", () => {
// //                             console.log(
// //                                 "[SIP-WS] Call ended, emitting event to client"
// //                             );
// //                             socket.emit("callEnded");
// //                         });

// //                         softphone!.on("audioData", (audioData: Buffer) => {
// //                             if (softphone!.currentCallSession) {
// //                                 console.log(
// //                                     `[SIP-WS] Received audio data from Softphone, size: ${audioData.length} bytes`
// //                                 );
// //                                 socket.emit("audioData", audioData);
// //                             }
// //                         });
// //                     })
// //                     .catch((error) => {
// //                         console.error(
// //                             "[SIP-WS] Failed to register softphone:",
// //                             error
// //                         );
// //                     });
// //             }

// //             socket.on("startCall", async (data: { number: string }) => {
// //                 try {
// //                     if (softphone) {
// //                         console.log(
// //                             `[SIP-WS] Initiating call to ${data.number}`
// //                         );
// //                         const callSession = await softphone.call(
// //                             parseInt(data.number, 10)
// //                         );
// //                         console.log(
// //                             `[SIP-WS] Call initiated with ID: ${callSession.callId}`
// //                         );
// //                         socket.emit("callStarted", {
// //                             callId: callSession.callId,
// //                         });
// //                     } else {
// //                         console.error("[SIP-WS] Softphone not initialized");
// //                         socket.emit("error", {
// //                             message: "Softphone not initialized",
// //                         });
// //                     }
// //                 } catch (error) {
// //                     console.error("[SIP-WS] Error starting call:", error);
// //                     socket.emit("error", {
// //                         message:
// //                             "Failed to start call: " + (error as Error).message,
// //                     });
// //                 }
// //             });

// //             socket.on("answerCall", async () => {
// //                 try {
// //                     if (softphone && softphone.lastInviteMessage) {
// //                         console.log("[SIP-WS] Answering incoming call");
// //                         const callSession = await softphone.answer(
// //                             softphone.lastInviteMessage
// //                         );
// //                         console.log(
// //                             `[SIP-WS] Call answered with ID: ${callSession.callId}`
// //                         );
// //                         socket.emit("callAnswered", {
// //                             callId: callSession.callId,
// //                         });
// //                     } else {
// //                         socket.emit("error", {
// //                             message: "No incoming call to answer",
// //                         });
// //                     }
// //                 } catch (error) {
// //                     console.error("[SIP-WS] Error answering call:", error);
// //                     socket.emit("error", { message: "Failed to answer call" });
// //                 }
// //             });

// //             socket.on("hangupCall", async () => {
// //                 try {
// //                     if (softphone && softphone.currentCallSession) {
// //                         console.log("[SIP-WS] Hanging up call");
// //                         await softphone.hangup();
// //                         socket.emit("callEnded");
// //                     } else {
// //                         socket.emit("error", {
// //                             message: "No active call to hang up",
// //                         });
// //                     }
// //                 } catch (error) {
// //                     console.error("[SIP-WS] Error hanging up call:", error);
// //                     socket.emit("error", { message: "Failed to hang up call" });
// //                 }
// //             });

// //             socket.on("disconnect", () => {
// //                 console.log("[SIP-WS] Client disconnected");
// //             });
// //         });
// //     }

// //     if (req.method === "GET") {
// //         res.end();
// //     }
// // };

// // export default SocketHandler;

// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO, Socket } from "socket.io";
// import Softphone from "@/ref/soft/src/softphone";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// let softphone: Softphone | null = null;
// let io: ServerIO | null = null;

// const SocketHandler = async (
//     req: NextApiRequest,
//     res: NextApiResponseServerIO
// ) => {
//     if (!res.socket.server.io) {
//         console.log("[SIP-WS] Initializing Socket.io server...");
//         const httpServer: NetServer = res.socket.server as any;
//         io = new ServerIO(httpServer, {
//             path: "/api/llpmg/sip-ws",
//             addTrailingSlash: false,
//         });
//         res.socket.server.io = io;

//         io.on("connection", (socket: Socket) => {
//             console.log("[SIP-WS] New client connected");

//             if (!softphone) {
//                 const sipInfo = {
//                     username: process.env.SIP_INFO_USERNAME!,
//                     password: process.env.SIP_INFO_PASSWORD!,
//                     authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
//                     domain: process.env.SIP_INFO_DOMAIN!,
//                 };

//                 console.log(
//                     "[SIP-WS] Initializing Softphone with info:",
//                     JSON.stringify(sipInfo, null, 2)
//                 );
//                 softphone = new Softphone(sipInfo);
//                 softphone.enableDebugMode();
//                 softphone
//                     .register()
//                     .then(() => {
//                         console.log(
//                             "[SIP-WS] Softphone registered successfully"
//                         );

//                         softphone!.on("invite", (inviteMessage: any) => {
//                             const callerNumber =
//                                 inviteMessage.headers.From.match(
//                                     /<sip:(.+?)@/
//                                 )?.[1];
//                             console.log(
//                                 `[SIP-WS] Incoming call detected from ${callerNumber}`
//                             );
//                             socket.emit("incomingCall", { callerNumber });
//                         });

//                         softphone!.on("callEnded", () => {
//                             console.log(
//                                 "[SIP-WS] Call ended, emitting event to client"
//                             );
//                             socket.emit("callEnded");
//                         });

//                         softphone!.on("audioData", (audioData: Buffer) => {
//                             if (softphone!.currentCallSession) {
//                                 console.log(
//                                     `[SIP-WS] Received audio data from Softphone, size: ${audioData.length} bytes`
//                                 );
//                                 socket.emit("audioData", audioData);
//                             }
//                         });
//                     })
//                     .catch((error) => {
//                         console.error(
//                             "[SIP-WS] Failed to register softphone:",
//                             error
//                         );
//                     });
//             }

//             socket.on("startCall", async (data: { number: string }) => {
//                 try {
//                     if (softphone) {
//                         console.log(
//                             `[SIP-WS] Initiating call to ${data.number}`
//                         );
//                         const callSession = await softphone.call(
//                             parseInt(data.number, 10)
//                         );
//                         console.log(
//                             `[SIP-WS] Call initiated with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callStarted", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         console.error("[SIP-WS] Softphone not initialized");
//                         socket.emit("error", {
//                             message: "Softphone not initialized",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error starting call:", error);
//                     socket.emit("error", {
//                         message:
//                             "Failed to start call: " + (error as Error).message,
//                     });
//                 }
//             });

//             socket.on("answerCall", async () => {
//                 try {
//                     if (softphone && softphone.lastInviteMessage) {
//                         console.log("[SIP-WS] Answering incoming call");
//                         const callSession = await softphone.answer(
//                             softphone.lastInviteMessage
//                         );
//                         console.log(
//                             `[SIP-WS] Call answered with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callAnswered", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         socket.emit("error", {
//                             message: "No incoming call to answer",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error answering call:", error);
//                     socket.emit("error", { message: "Failed to answer call" });
//                 }
//             });

//             socket.on("hangupCall", async () => {
//                 try {
//                     if (softphone && softphone.currentCallSession) {
//                         console.log("[SIP-WS] Hanging up call");
//                         await softphone.hangup();
//                         socket.emit("callEnded");
//                     } else {
//                         socket.emit("error", {
//                             message: "No active call to hang up",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error hanging up call:", error);
//                     socket.emit("error", { message: "Failed to hang up call" });
//                 }
//             });

//             socket.on("disconnect", () => {
//                 console.log("[SIP-WS] Client disconnected");
//             });
//         });
//     }

//     if (req.method === "GET") {
//         res.end();
//     }
// };

// export default SocketHandler;

// ----------- latest claude
// import { NextApiRequest, NextApiResponse } from "next";
// import Softphone from "@/ref/soft/src/softphone";
// import { Server as SocketIOServer } from "socket.io";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// let softphone: Softphone | null = null;
// let io: SocketIOServer | null = null;

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponseServerIO
// ) {
//     if (!softphone || !io) {
//         await initializeSoftphoneAndSocketIO(res);
//     }

//     if (req.method === "POST") {
//         let body;
//         try {
//             body = await parseBody(req);
//         } catch (error) {
//             return res.status(400).json({ error: "Invalid request body" });
//         }

//         const { action } = body;

//         switch (action) {
//             case "initializeSocket":
//                 res.status(200).json({
//                     socketUrl: process.env.WEBSOCKET_URL || "",
//                 });
//                 break;

//             case "call":
//                 if (!softphone) {
//                     return res
//                         .status(500)
//                         .json({ error: "Softphone not initialized" });
//                 }
//                 try {
//                     const callSession = await softphone.call(body.callee);
//                     io?.emit("callStarted", { callId: callSession.callId });
//                     res.status(200).json({ callId: callSession.callId });
//                 } catch (error) {
//                     res.status(500).json({ error: "Failed to initiate call" });
//                 }
//                 break;

//             case "hangup":
//                 if (!softphone) {
//                     return res
//                         .status(500)
//                         .json({ error: "Softphone not initialized" });
//                 }
//                 try {
//                     await softphone.hangup();
//                     io?.emit("callEnded");
//                     res.status(200).json({ success: true });
//                 } catch (error) {
//                     res.status(500).json({ error: "Failed to hang up call" });
//                 }
//                 break;

//             case "answer":
//                 if (!softphone || !softphone.lastInviteMessage) {
//                     return res
//                         .status(400)
//                         .json({ error: "No incoming call to answer" });
//                 }
//                 try {
//                     const callSession = await softphone.answer(
//                         softphone.lastInviteMessage
//                     );
//                     io?.emit("callStarted", { callId: callSession.callId });
//                     res.status(200).json({ callId: callSession.callId });
//                 } catch (error) {
//                     res.status(500).json({ error: "Failed to answer call" });
//                 }
//                 break;

//             case "decline":
//                 if (!softphone || !softphone.lastInviteMessage) {
//                     return res
//                         .status(400)
//                         .json({ error: "No incoming call to decline" });
//                 }
//                 try {
//                     await softphone.decline(softphone.lastInviteMessage);
//                     io?.emit("callEnded");
//                     res.status(200).json({ success: true });
//                 } catch (error) {
//                     res.status(500).json({ error: "Failed to decline call" });
//                 }
//                 break;

//             default:
//                 res.status(400).json({ error: "Invalid action" });
//         }
//     } else if (
//         req.method === "PUT" &&
//         req.headers["content-type"] === "application/octet-stream"
//     ) {
//         if (!softphone || !softphone.currentCallSession) {
//             return res.status(400).json({ error: "No active call session" });
//         }

//         try {
//             const audioData = await getRawBody(req);
//             await softphone.currentCallSession.sendAudio(audioData);
//             res.status(200).json({ success: true });
//         } catch (error) {
//             res.status(500).json({ error: "Failed to process audio data" });
//         }
//     } else {
//         res.setHeader("Allow", ["POST", "PUT"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
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
//     console.log("Softphone registered successfully");

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
//             console.log("Initializing Socket.IO server");
//             io = new SocketIOServer(res.socket.server as any, {
//                 path: "/api/llpmg/sip-ws",
//                 addTrailingSlash: false,
//             });
//             res.socket.server.io = io;
//         } else {
//             console.log("Socket.IO server already initialized");
//             io = res.socket.server.io;
//         }

//         io.on("connection", (socket) => {
//             console.log("New WebSocket connection established");

//             socket.on("audioData", (audioData: ArrayBuffer) => {
//                 if (softphone && softphone.currentCallSession) {
//                     softphone.currentCallSession.sendAudio(
//                         Buffer.from(audioData)
//                     );
//                 }
//             });

//             socket.on("disconnect", () => {
//                 console.log("WebSocket connection closed");
//             });
//         });
//     }
// }

// async function parseBody(req: NextApiRequest): Promise<any> {
//     return new Promise((resolve, reject) => {
//         let body = "";
//         req.on("data", (chunk) => {
//             body += chunk.toString();
//         });
//         req.on("end", () => {
//             try {
//                 resolve(JSON.parse(body));
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     });
// }

// async function getRawBody(req: NextApiRequest): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//         const chunks: Buffer[] = [];
//         req.on("data", (chunk: Buffer) => chunks.push(chunk));
//         req.on("end", () => resolve(Buffer.concat(chunks)));
//         req.on("error", reject);
//     });
// }
// -------------- latest claude

// looking for audio log (log exists but error)
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, Socket } from "socket.io";
import Softphone from "@/ref/soft/src/softphone";
import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

export const config = {
    api: {
        bodyParser: false,
    },
};

let softphone: Softphone | null = null;
let io: ServerIO | null = null;

const SocketHandler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIO
) => {
    if (!res.socket.server.io) {
        console.log("[SIP-WS] Initializing Socket.io server...");
        const httpServer: NetServer = res.socket.server as any;
        io = new ServerIO(httpServer, {
            path: "/api/llpmg/sip-ws",
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on("connection", (socket: Socket) => {
            console.log("[SIP-WS] New client connected");

            if (!softphone) {
                const sipInfo = {
                    username: process.env.SIP_INFO_USERNAME!,
                    password: process.env.SIP_INFO_PASSWORD!,
                    authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
                    domain: process.env.SIP_INFO_DOMAIN!,
                };

                console.log(
                    "[SIP-WS] Initializing Softphone with info:",
                    JSON.stringify(sipInfo, null, 2)
                );
                softphone = new Softphone(sipInfo);
                softphone.enableDebugMode();
                softphone
                    .register()
                    .then(() => {
                        console.log(
                            "[SIP-WS] Softphone registered successfully"
                        );

                        softphone!.on("invite", (inviteMessage: any) => {
                            const callerNumber =
                                inviteMessage.headers.From.match(
                                    /<sip:(.+?)@/
                                )?.[1];
                            console.log(
                                `[SIP-WS] Incoming call detected from ${callerNumber}`
                            );
                            socket.emit("incomingCall", { callerNumber });
                        });

                        softphone!.on("callEnded", () => {
                            console.log(
                                "[SIP-WS] Call ended, emitting event to client"
                            );
                            socket.emit("callEnded");
                        });

                        softphone!.on("audioData", (audioData: Buffer) => {
                            if (softphone!.currentCallSession) {
                                console.log(
                                    `[SIP-WS] Received audio data from Softphone, size: ${audioData.length} bytes`
                                );
                                socket.emit("audioData", audioData);
                            }
                        });
                    })
                    .catch((error) => {
                        console.error(
                            "[SIP-WS] Failed to register softphone:",
                            error
                        );
                    });
            }

            socket.on("startCall", async (data: { number: string }) => {
                try {
                    if (softphone) {
                        console.log(
                            `[SIP-WS] Initiating call to ${data.number}`
                        );
                        const callSession = await softphone.call(
                            parseInt(data.number, 10)
                        );
                        console.log(
                            `[SIP-WS] Call initiated with ID: ${callSession.callId}`
                        );
                        socket.emit("callStarted", {
                            callId: callSession.callId,
                        });
                    } else {
                        console.error("[SIP-WS] Softphone not initialized");
                        socket.emit("error", {
                            message: "Softphone not initialized",
                        });
                    }
                } catch (error) {
                    console.error("[SIP-WS] Error starting call:", error);
                    socket.emit("error", {
                        message:
                            "Failed to start call: " + (error as Error).message,
                    });
                }
            });

            socket.on("answerCall", async () => {
                try {
                    if (softphone && softphone.lastInviteMessage) {
                        console.log("[SIP-WS] Answering incoming call");
                        const callSession = await softphone.answer(
                            softphone.lastInviteMessage
                        );
                        console.log(
                            `[SIP-WS] Call answered with ID: ${callSession.callId}`
                        );
                        socket.emit("callAnswered", {
                            callId: callSession.callId,
                        });
                    } else {
                        socket.emit("error", {
                            message: "No incoming call to answer",
                        });
                    }
                } catch (error) {
                    console.error("[SIP-WS] Error answering call:", error);
                    socket.emit("error", { message: "Failed to answer call" });
                }
            });

            socket.on("hangupCall", async () => {
                try {
                    if (softphone && softphone.currentCallSession) {
                        console.log("[SIP-WS] Hanging up call");
                        await softphone.hangup();
                        socket.emit("callEnded");
                    } else {
                        socket.emit("error", {
                            message: "No active call to hang up",
                        });
                    }
                } catch (error) {
                    console.error("[SIP-WS] Error hanging up call:", error);
                    socket.emit("error", { message: "Failed to hang up call" });
                }
            });

            socket.on("disconnect", () => {
                console.log("[SIP-WS] Client disconnected");
            });
        });
    }

    if (req.method === "GET") {
        res.end();
    }
};

export default SocketHandler;
// looking for audio log (audio exist but error)

// cleaning log
// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO, Socket } from "socket.io";
// import Softphone from "@/ref/soft/src/softphone";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// let softphone: Softphone | null = null;
// let io: ServerIO | null = null;

// const SocketHandler = async (
//     req: NextApiRequest,
//     res: NextApiResponseServerIO
// ) => {
//     if (!res.socket.server.io) {
//         console.log("[SIP-WS] Initializing Socket.io server...");
//         const httpServer: NetServer = res.socket.server as any;
//         io = new ServerIO(httpServer, {
//             path: "/api/llpmg/sip-ws",
//             addTrailingSlash: false,
//         });
//         res.socket.server.io = io;

//         io.on("connection", (socket: Socket) => {
//             console.log("[SIP-WS] New client connected");

//             if (!softphone) {
//                 const sipInfo = {
//                     username: process.env.SIP_INFO_USERNAME!,
//                     password: process.env.SIP_INFO_PASSWORD!,
//                     authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
//                     domain: process.env.SIP_INFO_DOMAIN!,
//                 };

//                 console.log(
//                     "[SIP-WS] Initializing Softphone with info:",
//                     JSON.stringify(sipInfo, null, 2)
//                 );
//                 softphone = new Softphone(sipInfo);
//                 softphone.enableDebugMode();
//                 softphone
//                     .register()
//                     .then(() => {
//                         console.log(
//                             "[SIP-WS] Softphone registered successfully"
//                         );

//                         softphone!.on("invite", (inviteMessage: any) => {
//                             const callerNumber =
//                                 inviteMessage.headers.From.match(
//                                     /<sip:(.+?)@/
//                                 )?.[1];
//                             console.log(
//                                 `[SIP-WS] Incoming call detected from ${callerNumber}`
//                             );
//                             socket.emit("incomingCall", { callerNumber });
//                         });

//                         softphone!.on("callEnded", () => {
//                             console.log(
//                                 "[SIP-WS] Call ended, emitting event to client"
//                             );
//                             socket.emit("callEnded");
//                         });

//                         softphone!.on("audioData", (audioData: Buffer) => {
//                             if (softphone!.currentCallSession) {
//                                 console.log(
//                                     `[SIP-WS] Received audio data from Softphone, size: ${audioData.length} bytes`
//                                 );
//                                 socket.emit("audioData", audioData);
//                             }
//                         });
//                     })
//                     .catch((error) => {
//                         console.error(
//                             "[SIP-WS] Failed to register softphone:",
//                             error
//                         );
//                     });
//             }

//             socket.on("startCall", async (data: { number: string }) => {
//                 try {
//                     if (softphone) {
//                         console.log(
//                             `[SIP-WS] Initiating call to ${data.number}`
//                         );
//                         const callSession = await softphone.call(
//                             parseInt(data.number, 10)
//                         );
//                         console.log(
//                             `[SIP-WS] Call initiated with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callStarted", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         console.error("[SIP-WS] Softphone not initialized");
//                         socket.emit("error", {
//                             message: "Softphone not initialized",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error starting call:", error);
//                     socket.emit("error", {
//                         message:
//                             "Failed to start call: " + (error as Error).message,
//                     });
//                 }
//             });

//             socket.on("answerCall", async () => {
//                 try {
//                     if (softphone && softphone.lastInviteMessage) {
//                         console.log("[SIP-WS] Answering incoming call");
//                         const callSession = await softphone.answer(
//                             softphone.lastInviteMessage
//                         );
//                         console.log(
//                             `[SIP-WS] Call answered with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callAnswered", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         socket.emit("error", {
//                             message: "No incoming call to answer",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error answering call:", error);
//                     socket.emit("error", { message: "Failed to answer call" });
//                 }
//             });

//             socket.on("hangupCall", async () => {
//                 try {
//                     if (softphone && softphone.currentCallSession) {
//                         console.log("[SIP-WS] Hanging up call");
//                         await softphone.hangup();
//                         socket.emit("callEnded");
//                     } else {
//                         socket.emit("error", {
//                             message: "No active call to hang up",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error hanging up call:", error);
//                     socket.emit("error", { message: "Failed to hang up call" });
//                 }
//             });

//             socket.on("disconnect", () => {
//                 console.log("[SIP-WS] Client disconnected");
//             });
//         });
//     }

//     if (req.method === "GET") {
//         res.end();
//     }
// };

// export default SocketHandler;
// cleaning log

// sonnet-3.5 1st attempt
// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO, Socket } from "socket.io";
// import Softphone from "@/ref/soft/src/softphone";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// let softphone: Softphone | null = null;
// let io: ServerIO | null = null;

// const SocketHandler = async (
//     req: NextApiRequest,
//     res: NextApiResponseServerIO
// ) => {
//     if (!res.socket.server.io) {
//         console.log("[SIP-WS] Initializing Socket.io server...");
//         const httpServer: NetServer = res.socket.server as any;
//         io = new ServerIO(httpServer, {
//             path: "/api/llpmg/sip-ws",
//             addTrailingSlash: false,
//         });
//         res.socket.server.io = io;

//         io.on("connection", (socket: Socket) => {
//             console.log("[SIP-WS] New client connected");

//             if (!softphone) {
//                 const sipInfo = {
//                     username: process.env.SIP_INFO_USERNAME!,
//                     password: process.env.SIP_INFO_PASSWORD!,
//                     authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
//                     domain: process.env.SIP_INFO_DOMAIN!,
//                 };

//                 console.log(
//                     "[SIP-WS] Initializing Softphone with info:",
//                     JSON.stringify(sipInfo, null, 2)
//                 );
//                 softphone = new Softphone(sipInfo);
//                 softphone.enableDebugMode();
//                 softphone
//                     .register()
//                     .then(() => {
//                         console.log(
//                             "[SIP-WS] Softphone registered successfully"
//                         );

//                         softphone!.on("invite", (inviteMessage: any) => {
//                             const callerNumber =
//                                 inviteMessage.headers.From.match(
//                                     /<sip:(.+?)@/
//                                 )?.[1];
//                             console.log(
//                                 `[SIP-WS] Incoming call detected from ${callerNumber}`
//                             );
//                             socket.emit("incomingCall", { callerNumber });
//                         });

//                         softphone!.on("callEnded", () => {
//                             console.log(
//                                 "[SIP-WS] Call ended, emitting event to client"
//                             );
//                             socket.emit("callEnded");
//                         });

//                         softphone!.on("audioData", (audioData: Buffer) => {
//                             if (softphone!.currentCallSession) {
//                                 console.log(
//                                     `[SIP-WS] Received audio data from Softphone, size: ${audioData.length} bytes`
//                                 );
//                                 socket.emit("audioData", audioData);
//                             }
//                         });
//                     })
//                     .catch((error) => {
//                         console.error(
//                             "[SIP-WS] Failed to register softphone:",
//                             error
//                         );
//                     });
//                 softphone.on("audioData", (audioData: Buffer) => {
//                     socket.emit("audioData", audioData);
//                 });
//             }

//             socket.on("startCall", async (data: { number: string }) => {
//                 try {
//                     if (softphone) {
//                         console.log(
//                             `[SIP-WS] Initiating call to ${data.number}`
//                         );
//                         const callSession = await softphone.call(
//                             parseInt(data.number, 10)
//                         );
//                         console.log(
//                             `[SIP-WS] Call initiated with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callStarted", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         console.error("[SIP-WS] Softphone not initialized");
//                         socket.emit("error", {
//                             message: "Softphone not initialized",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error starting call:", error);
//                     socket.emit("error", {
//                         message:
//                             "Failed to start call: " + (error as Error).message,
//                     });
//                 }
//             });

//             socket.on("answerCall", async () => {
//                 try {
//                     if (softphone && softphone.lastInviteMessage) {
//                         console.log("[SIP-WS] Answering incoming call");
//                         const callSession = await softphone.answer(
//                             softphone.lastInviteMessage
//                         );
//                         console.log(
//                             `[SIP-WS] Call answered with ID: ${callSession.callId}`
//                         );
//                         socket.emit("callAnswered", {
//                             callId: callSession.callId,
//                         });
//                     } else {
//                         socket.emit("error", {
//                             message: "No incoming call to answer",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error answering call:", error);
//                     socket.emit("error", { message: "Failed to answer call" });
//                 }
//             });

//             socket.on("hangupCall", async () => {
//                 try {
//                     if (softphone && softphone.currentCallSession) {
//                         console.log("[SIP-WS] Hanging up call");
//                         await softphone.hangup();
//                         socket.emit("callEnded");
//                     } else {
//                         socket.emit("error", {
//                             message: "No active call to hang up",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("[SIP-WS] Error hanging up call:", error);
//                     socket.emit("error", { message: "Failed to hang up call" });
//                 }
//             });

//             socket.on("disconnect", () => {
//                 console.log("[SIP-WS] Client disconnected");
//             });
//         });
//     }

//     if (req.method === "GET") {
//         res.end();
//     }
// };

// export default SocketHandler;
// sonnet-3.5 1st attempt
