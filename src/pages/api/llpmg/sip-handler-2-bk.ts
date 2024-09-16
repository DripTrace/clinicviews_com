// latest working
// import { NextApiRequest} from "next";
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
// ------------------ latest claude
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
// ------------- latest claude

// looking for audio log (logs exist but error)
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
// looking for audio log (logs exist but error)

// cleaning up log
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
// cleaning log

// gpt-4o 1st attempt (don't use breaks audio logs)
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
// gpt-4o 1st attempt (don't use breaks audio logs)

// sonnet-3.5 1st attempt
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
// sonnet-3.5 1st attempt

// gpt-4o 2nd attempt after alternate implementation suggestion
// import { NextApiRequest, NextApiResponse } from "next";
// import Softphone from "@/ref/soft/src/softphone";
// import { Server as SocketIOServer } from "socket.io";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";
// import fs from "fs";
// import path from "path";

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
//             console.log(
//                 `[SIP-Handler] Received audio data: ${audioData.byteLength} bytes`
//             );

//             // Log the audio data size and other relevant details
//             fs.appendFileSync(
//                 path.join(process.cwd(), "logs/audio_logs.txt"),
//                 `Audio packet received: ${audioData.byteLength} bytes at ${new Date().toISOString()}\n`
//             );

//             await softphone.currentCallSession.sendAudio(audioData);
//             res.status(200).json({ success: true });
//         } catch (error) {
//             console.error(
//                 `[SIP-Handler] Failed to process audio data: ${(error as Error).message}`
//             );
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
//         console.log(
//             `[SIP-Handler] Forwarding audio data: ${audioData.byteLength} bytes`
//         );
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
//                     console.log(
//                         `[SIP-HANDLER] Audio data received from client: ${audioData.byteLength} bytes`
//                     );
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
// gpt-4o 2nd attempt after alternate implementation suggestion

// // // // // // // // sonnet-3.5 2nd attempt
// // // // // // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // // // // // import Softphone from "@/ref/soft/src/softphone";
// // // // // // // // import { Server as SocketIOServer } from "socket.io";
// // // // // // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // // // // // // let softphone: Softphone | null = null;
// // // // // // // // let io: SocketIOServer | null = null;

// // // // // // // // export const config = {
// // // // // // // //     api: {
// // // // // // // //         bodyParser: false,
// // // // // // // //     },
// // // // // // // // };

// // // // // // // // export default async function handler(
// // // // // // // //     req: NextApiRequest,
// // // // // // // //     res: NextApiResponseServerIO
// // // // // // // // ) {
// // // // // // // //     if (!softphone || !io) {
// // // // // // // //         await initializeSoftphoneAndSocketIO(res);
// // // // // // // //     }

// // // // // // // //     if (req.method === "POST") {
// // // // // // // //         let body;
// // // // // // // //         try {
// // // // // // // //             body = await parseBody(req);
// // // // // // // //         } catch (error) {
// // // // // // // //             return res.status(400).json({ error: "Invalid request body" });
// // // // // // // //         }

// // // // // // // //         const { action } = body;

// // // // // // // //         switch (action) {
// // // // // // // //             case "call":
// // // // // // // //                 if (!softphone) {
// // // // // // // //                     return res
// // // // // // // //                         .status(500)
// // // // // // // //                         .json({ error: "Softphone not initialized" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log(
// // // // // // // //                         `[SIP-HANDLER] Initiating call to ${body.callee}`
// // // // // // // //                     );
// // // // // // // //                     const callSession = await softphone.call(body.callee);
// // // // // // // //                     io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to initiate call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "hangup":
// // // // // // // //                 if (!softphone) {
// // // // // // // //                     return res
// // // // // // // //                         .status(500)
// // // // // // // //                         .json({ error: "Softphone not initialized" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Hanging up call");
// // // // // // // //                     await softphone.hangup();
// // // // // // // //                     io?.emit("callEnded");
// // // // // // // //                     res.status(200).json({ success: true });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to hang up call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "answer":
// // // // // // // //                 if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //                     return res
// // // // // // // //                         .status(400)
// // // // // // // //                         .json({ error: "No incoming call to answer" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // // // // // // //                     const callSession = await softphone.answer(
// // // // // // // //                         softphone.lastInviteMessage
// // // // // // // //                     );
// // // // // // // //                     io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to answer call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to answer call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "decline":
// // // // // // // //                 if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //                     return res
// // // // // // // //                         .status(400)
// // // // // // // //                         .json({ error: "No incoming call to decline" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // // // // // // //                     await softphone.decline(softphone.lastInviteMessage);
// // // // // // // //                     io?.emit("callEnded");
// // // // // // // //                     res.status(200).json({ success: true });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to decline call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to decline call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             default:
// // // // // // // //                 res.status(400).json({ error: "Invalid action" });
// // // // // // // //         }
// // // // // // // //     } else if (
// // // // // // // //         req.method === "PUT" &&
// // // // // // // //         req.headers["content-type"] === "application/octet-stream"
// // // // // // // //     ) {
// // // // // // // //         if (!softphone || !softphone.currentCallSession) {
// // // // // // // //             return res.status(400).json({ error: "No active call session" });
// // // // // // // //         }

// // // // // // // //         try {
// // // // // // // //             console.log("[SIP-HANDLER] Received audio data from client");
// // // // // // // //             const audioData = await getRawBody(req);
// // // // // // // //             await softphone.sendAudio(audioData);
// // // // // // // //             res.status(200).json({ success: true });
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //             res.status(500).json({ error: "Failed to process audio data" });
// // // // // // // //         }
// // // // // // // //     } else {
// // // // // // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // // // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // async function initializeSoftphoneAndSocketIO(res: NextApiResponseServerIO) {
// // // // // // // //     const sipInfo = {
// // // // // // // //         username: process.env.SIP_INFO_USERNAME!,
// // // // // // // //         password: process.env.SIP_INFO_PASSWORD!,
// // // // // // // //         authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // // // //         domain: process.env.SIP_INFO_DOMAIN!,
// // // // // // // //     };

// // // // // // // //     console.log("[SIP-HANDLER] Initializing Softphone");
// // // // // // // //     softphone = new Softphone(sipInfo);
// // // // // // // //     await softphone.register();
// // // // // // // //     console.log("[SIP-HANDLER] Softphone registered successfully");

// // // // // // // //     softphone.on("invite", (inviteMessage) => {
// // // // // // // //         const callerNumber =
// // // // // // // //             inviteMessage.headers.From.match(/<sip:(.+?)@/)?.[1] || "Unknown";
// // // // // // // //         console.log(`[SIP-HANDLER] Incoming call from ${callerNumber}`);
// // // // // // // //         io?.emit("incomingCall", { callerNumber });
// // // // // // // //     });

// // // // // // // //     softphone.on("callEnded", () => {
// // // // // // // //         console.log("[SIP-HANDLER] Call ended");
// // // // // // // //         io?.emit("callEnded");
// // // // // // // //     });

// // // // // // // //     softphone.on("audioData", (audioData: Buffer) => {
// // // // // // // //         console.log(
// // // // // // // //             `[SIP-HANDLER] Received audio data from Softphone, size: ${audioData.length} bytes`
// // // // // // // //         );
// // // // // // // //         io?.emit("audioData", audioData);
// // // // // // // //     });

// // // // // // // //     if (!io) {
// // // // // // // //         if (!res.socket.server.io) {
// // // // // // // //             console.log("[SIP-HANDLER] Initializing Socket.IO server");
// // // // // // // //             io = new SocketIOServer(res.socket.server as any, {
// // // // // // // //                 path: "/api/llpmg/sip-ws",
// // // // // // // //                 addTrailingSlash: false,
// // // // // // // //             });
// // // // // // // //             res.socket.server.io = io;
// // // // // // // //         } else {
// // // // // // // //             console.log("[SIP-HANDLER] Socket.IO server already initialized");
// // // // // // // //             io = res.socket.server.io;
// // // // // // // //         }

// // // // // // // //         io.on("connection", (socket) => {
// // // // // // // //             console.log("[SIP-HANDLER] New WebSocket connection established");

// // // // // // // //             socket.on("audioData", (audioData: ArrayBuffer) => {
// // // // // // // //                 if (softphone && softphone.currentCallSession) {
// // // // // // // //                     softphone.sendAudio(Buffer.from(audioData));
// // // // // // // //                 }
// // // // // // // //             });

// // // // // // // //             socket.on("disconnect", () => {
// // // // // // // //                 console.log("[SIP-HANDLER] WebSocket connection closed");
// // // // // // // //             });
// // // // // // // //         });
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // async function parseBody(req: NextApiRequest): Promise<any> {
// // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // //         let body = "";
// // // // // // // //         req.on("data", (chunk) => {
// // // // // // // //             body += chunk.toString();
// // // // // // // //         });
// // // // // // // //         req.on("end", () => {
// // // // // // // //             try {
// // // // // // // //                 resolve(JSON.parse(body));
// // // // // // // //             } catch (error) {
// // // // // // // //                 reject(error);
// // // // // // // //             }
// // // // // // // //         });
// // // // // // // //     });
// // // // // // // // }

// // // // // // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // //         const chunks: Buffer[] = [];
// // // // // // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // // // // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // // // // // //         req.on("error", reject);
// // // // // // // //     });
// // // // // // // // }
// // // // // // // // sonnet-3.5 2nd attempt

// sonnet-3.5 2.5th attempt
import { NextApiRequest, NextApiResponse } from "next";
import Softphone from "@/ref/soft/src/softphone";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";
import fs from "fs";
import path from "path";

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

// // // // // // // // removed for sonnet-3.5 14th attempt
// // // // // // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // // // // // // removed for sonnet-3.5 13th attempt
// // // // // // // // import Softphone from "@/ref/soft/src/softphone";
// // // // // // // // // removed for sonnet-3.5 13th attempt

// // // // // // // // // added for sonnet-3.5 13th attempt
// // // // // // // // // import {softphone as Softphone}from "@/lib/llpmg/sip/SoftphoneInit";
// // // // // // // // // added for sonnet-3.5 13th attempt
// // // // // // // // import { Server as SocketIOServer } from "socket.io";
// // // // // // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";
// // // // // // // // import { Server as HttpServer } from "http";
// // // // // // // // // added for sonnet-3.5 8th attempt
// // // // // // // // import getRawBodyImport from "raw-body";
// // // // // // // // // added for sonnet-3.5 8th attempt

// // // // // // // // // removed for sonnet-3.5 13th attempt
// // // // // // // // let softphone: Softphone | null = null;
// // // // // // // // // removed for sonnet-3.5 13th attempt
// // // // // // // // // added for sonnet-3.5 13th attempt
// // // // // // // // // let softphone: typeof Softphone | null = null;
// // // // // // // // // added for sonnet-3.5 13th attempt
// // // // // // // // let io: SocketIOServer | null = null;

// // // // // // // // export const config = {
// // // // // // // //     api: {
// // // // // // // //         bodyParser: false,
// // // // // // // //     },
// // // // // // // // };

// // // // // // // // export default async function handler(
// // // // // // // //     req: NextApiRequest,
// // // // // // // //     res: NextApiResponseServerIO
// // // // // // // // ) {
// // // // // // // //     // added for sonnet-3.5 13th attempt
// // // // // // // //     console.log("Received request:", req.method, req.url);
// // // // // // // //     console.log("Request body:", req.body);
// // // // // // // //     // added for sonnet-3.5 13th attempt

// // // // // // // //     // added for sonnet-3.5 13th attempt
// // // // // // // //     if (req.method === "POST") {
// // // // // // // //         // removed for sonnet-3.5 12th attempt
// // // // // // // //         // added for sonnet-3.5 11th attempt
// // // // // // // //         // let body;
// // // // // // // //         // try {
// // // // // // // //         //     body =
// // // // // // // //         //         typeof req.body === "string"
// // // // // // // //         //             ? JSON.parse(req.body)
// // // // // // // //         //             : req.body;
// // // // // // // //         // } catch (error) {
// // // // // // // //         //     console.error("Failed to parse request body:", error);
// // // // // // // //         //     return res.status(400).json({ error: "Invalid request body" });
// // // // // // // //         // }
// // // // // // // //         // added for sonnet-3.5 11th attempt
// // // // // // // //         // removed for sonnet-3.5 12th attempt

// // // // // // // //         // removed for sonnet-3.5 10th attempt
// // // // // // // //         // let body;
// // // // // // // //         // try {
// // // // // // // //         //     body = await parseBody(req);
// // // // // // // //         // } catch (error) {
// // // // // // // //         //     return res.status(400).json({ error: "Invalid request body" });
// // // // // // // //         // }

// // // // // // // //         // const { action } = body;
// // // // // // // //         // removed for sonnet-3.5 10th attempt

// // // // // // // //         // added/removed for sonnet-3.5 10th/12th attempt
// // // // // // // //         const { action, callee } = req.body;
// // // // // // // //         // added/removed for sonnet-3.5 10th/12th attempt

// // // // // // // //         // added/removed for sonnet-3.5 11th /12thattempt
// // // // // // // //         // const { action, callee } = body;
// // // // // // // //         // added/removed for sonnet-3.5 11th/12th attempt

// // // // // // // //         // added for sonnet-3.5 12th attempt
// // // // // // // //         console.log("Received POST request:", req.body);
// // // // // // // //         console.log("Action:", action, "Callee:", callee);
// // // // // // // //         // added for sonnet-3.5 12th attempt

// // // // // // // //         // added for sonnet-3.5 11th attempt
// // // // // // // //         if (!action) {
// // // // // // // //             // added for sonnet-3.5 13th attempt
// // // // // // // //             console.error("Missing action in request body");
// // // // // // // //             // added for sonnet-3.5 13th attempt
// // // // // // // //             return res
// // // // // // // //                 .status(400)
// // // // // // // //                 .json({ error: "Missing action in request body" });
// // // // // // // //         }

// // // // // // // //         if (!softphone) {
// // // // // // // //             // removed for sonnet-3.5 13th attempt
// // // // // // // //             // added for sonnet-3.5 12th attempt
// // // // // // // //             // console.log("Initializing Softphone...");
// // // // // // // //             // added for sonnet-3.5 12th attempt
// // // // // // // //             // removed for sonnet-3.5 13th attempt

// // // // // // // //             // added for sonnet-3.5 13th attempt
// // // // // // // //             console.error("Softphone not initialized");
// // // // // // // //             // added for sonnet-3.5 13th attempt

// // // // // // // //             return res.status(500).json({ error: "Softphone not initialized" });
// // // // // // // //         }
// // // // // // // //         // added for sonnet-3.5 11th attempt

// // // // // // // //         // removed for sonnet-3.5 11th attempt
// // // // // // // //         // switch (action) {
// // // // // // // //         //     // removed for sonnet-3.5 11th attempt
// // // // // // // //         //     case "initializeSocket":
// // // // // // // //         //         res.status(200).json({
// // // // // // // //         //             socketUrl: process.env.WEBSOCKET_URL || "",
// // // // // // // //         //         });
// // // // // // // //         //         break;
// // // // // // // //         //     // removed for sonnet-3.5 11th attempt

// // // // // // // //         //     case "call":
// // // // // // // //         //         if (!softphone) {
// // // // // // // //         //             return res
// // // // // // // //         //                 .status(500)
// // // // // // // //         //                 .json({ error: "Softphone not initialized" });
// // // // // // // //         //         }
// // // // // // // //         //         try {
// // // // // // // //         //             // added for sonnet-3.5 6th attempt
// // // // // // // //         //             console.log(
// // // // // // // //         //                 // removed for sonnet-3.5 10th attempt
// // // // // // // //         //                 // `[SIP-HANDLER] Initiating call to ${body.callee}`
// // // // // // // //         //                 // removed for sonnet-3.5 10th attempt
// // // // // // // //         //                 `[SIP-HANDLER] Initiating call to ${callee}`
// // // // // // // //         //             );
// // // // // // // //         //             // added for sonnet-3.5 6th attempt
// // // // // // // //         //             // removed for sonnet-3.5 10th attempt
// // // // // // // //         //             // const callSession = await softphone.call(body.callee);
// // // // // // // //         //             // removed for sonnet-3.5 10th attempt
// // // // // // // //         //             // added for sonnet-3.5 10th attempt
// // // // // // // //         //             const callSession = await softphone.call(callee);
// // // // // // // //         //             // added for sonnet-3.5 10th attempt
// // // // // // // //         //             // removed for sonnet-3.5 7th  attempt
// // // // // // // //         //             // io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //         //             // removed for sonnet-3.5 7th  attempt
// // // // // // // //         //             io?.emit("callInitiated", {
// // // // // // // //         //                 callId: callSession.callId,
// // // // // // // //         //             });

// // // // // // // //         //             res.status(200).json({ callId: callSession.callId });

// // // // // // // //         //             // added for sonnet-3.5 10th attempt
// // // // // // // //         //             // Listen for call state changes
// // // // // // // //         //             callSession.on("ringing", () => {
// // // // // // // //         //                 io?.emit("callRinging");
// // // // // // // //         //             });
// // // // // // // //         //             callSession.on("accepted", () => {
// // // // // // // //         //                 io?.emit("callStarted", {
// // // // // // // //         //                     callId: callSession.callId,
// // // // // // // //         //                 });
// // // // // // // //         //             });
// // // // // // // //         //             callSession.on("ended", () => {
// // // // // // // //         //                 io?.emit("callEnded");
// // // // // // // //         //             });
// // // // // // // //         //             // added for sonnet-3.5 10th attempt
// // // // // // // //         //         } catch (error) {
// // // // // // // //         //             // removed for sonnet-3.5 4th attempt
// // // // // // // //         //             // res.status(500).json({ error: "Failed to initiate call" });
// // // // // // // //         //             // added for sonnet-3.5 4th attempt
// // // // // // // //         //             console.error(
// // // // // // // //         //                 "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //         //                 error
// // // // // // // //         //             );
// // // // // // // //         //             res.status(500).json({
// // // // // // // //         //                 error: "Failed to initiate call",
// // // // // // // //         //                 details: (error as Error).message,
// // // // // // // //         //             });
// // // // // // // //         //             // sonnet-3.5 4th attempt final no lint
// // // // // // // //         //         }
// // // // // // // //         //         // added/removed for sonnet-3.5 7th attempt
// // // // // // // //         //         // io?.emit("callInitiated", { callId: callSession.callId });
// // // // // // // //         //         // added/removed for sonnet-3.5 7th attempt

// // // // // // // //         //         break;

// // // // // // // //         //     case "hangup":
// // // // // // // //         //         if (!softphone) {
// // // // // // // //         //             return res
// // // // // // // //         //                 .status(500)
// // // // // // // //         //                 .json({ error: "Softphone not initialized" });
// // // // // // // //         //         }
// // // // // // // //         //         try {
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //             console.log("[SIP-HANDLER] Hanging up call");
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //             await softphone.hangup();
// // // // // // // //         //             io?.emit("callEnded");
// // // // // // // //         //             res.status(200).json({ success: true });
// // // // // // // //         //         } catch (error) {
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //             console.error(
// // // // // // // //         //                 "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //         //                 error
// // // // // // // //         //             );
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //             // removed for sonnet-3.5 7th attempt
// // // // // // // //         //             // res.status(500).json({ error: "Failed to hang up call" });
// // // // // // // //         //             // removed for sonnet-3.5 7th attempt
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //             res.status(500).json({
// // // // // // // //         //                 error: "Failed to hang up call",
// // // // // // // //         //                 details: (error as Error).message,
// // // // // // // //         //             });
// // // // // // // //         //             // added for sonnet-3.5 7th attempt
// // // // // // // //         //         }
// // // // // // // //         //         break;

// // // // // // // //         //     case "answer":
// // // // // // // //         //         if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //         //             return res
// // // // // // // //         //                 .status(400)
// // // // // // // //         //                 .json({ error: "No incoming call to answer" });
// // // // // // // //         //         }
// // // // // // // //         //         try {
// // // // // // // //         //             const callSession = await softphone.answer(
// // // // // // // //         //                 softphone.lastInviteMessage
// // // // // // // //         //             );
// // // // // // // //         //             io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //         //             res.status(200).json({ callId: callSession.callId });
// // // // // // // //         //         } catch (error) {
// // // // // // // //         //             res.status(500).json({
// // // // // // // //         //                 error: "Failed to answer call",
// // // // // // // //         //             });
// // // // // // // //         //         }
// // // // // // // //         //         break;

// // // // // // // //         //     case "decline":
// // // // // // // //         //         if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //         //             return res
// // // // // // // //         //                 .status(400)
// // // // // // // //         //                 .json({ error: "No incoming call to decline" });
// // // // // // // //         //         }
// // // // // // // //         //         try {
// // // // // // // //         //             await softphone.decline(softphone.lastInviteMessage);
// // // // // // // //         //             io?.emit("callEnded");
// // // // // // // //         //             res.status(200).json({ success: true });
// // // // // // // //         //         } catch (error) {
// // // // // // // //         //             res.status(500).json({
// // // // // // // //         //                 error: "Failed to decline call",
// // // // // // // //         //             });
// // // // // // // //         //         }
// // // // // // // //         //         break;

// // // // // // // //         //     default:
// // // // // // // //         //         res.status(400).json({ error: "Invalid action" });

// // // // // // // //         //     }
// // // // // // // //         // }
// // // // // // // //         // removed for sonnet-3.5 11th attempt
// // // // // // // //         //tempt edit
// // // // // // // //         // added for sonnet-3.5 11th attempt
// // // // // // // //         switch (action) {
// // // // // // // //             case "call":
// // // // // // // //                 if (!callee) {
// // // // // // // //                     // added for sonnet-3.5 12th attempt
// // // // // // // //                     console.error("Missing callee number");
// // // // // // // //                     // added for sonnet-3.5 12th attempt
// // // // // // // //                     return res
// // // // // // // //                         .status(400)
// // // // // // // //                         .json({ error: "Missing callee number" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // // // // // // //                     const callSession = await softphone.call(callee);
// // // // // // // //                     // added for sonnet-3.5 12th attempt
// // // // // // // //                     console.log("Call session created:", callSession);
// // // // // // // //                     // added for sonnet-3.5 12th attempt
// // // // // // // //                     io?.emit("callInitiated", {
// // // // // // // //                         callId: callSession.callId,
// // // // // // // //                     });
// // // // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({
// // // // // // // //                         error: "Failed to initiate call",
// // // // // // // //                         details: (error as Error).message,
// // // // // // // //                     });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "hangup":
// // // // // // // //                 try {
// // // // // // // //                     await softphone.hangup();
// // // // // // // //                     io?.emit("callEnded");
// // // // // // // //                     res.status(200).json({ success: true });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({
// // // // // // // //                         error: "Failed to hang up call",
// // // // // // // //                     });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             default:
// // // // // // // //                 res.status(400).json({ error: "Invalid action" });
// // // // // // // //         }
// // // // // // // //     } else {
// // // // // // // //         res.setHeader("Allow", ["POST"]);
// // // // // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // // // //     }
// // // // // // // //     // added for sonnet-3.5 13th attempt

// // // // // // // //     // removed for sonnet-3.5 13th attempt
// // // // // // // //     // added for sonnet-3.5 11th attempt
// // // // // // // //     // if (!softphone) {
// // // // // // // //     //     const sipInfo = {
// // // // // // // //     //         username: process.env.SIP_USERNAME!,
// // // // // // // //     //         password: process.env.SIP_PASSWORD!,
// // // // // // // //     //         authorizationId: process.env.SIP_AUTH_ID!,
// // // // // // // //     //         domain: process.env.SIP_DOMAIN!,
// // // // // // // //     //     };
// // // // // // // //     //     softphone = new Softphone(sipInfo);
// // // // // // // //     //     await softphone.register();
// // // // // // // //     // }
// // // // // // // //     // added for sonnet-3.5 11th attempt
// // // // // // // //     // removed for sonnet-3.5 13th attempt

// // // // // // // //     // tempt edit
// // // // // // // //     // added for sonnet-3.5 8th attempt
// // // // // // // //     if (req.method === "PUT") {
// // // // // // // //         // added for sonnet-3.5 8th attempt
// // // // // // // //         if (!softphone || !softphone.currentCallSession) {
// // // // // // // //             return res.status(400).json({ error: "No active call session" });
// // // // // // // //         }

// // // // // // // //         try {
// // // // // // // //             const audioData = await getRawBodyImport(req);
// // // // // // // //             await softphone.sendAudio(audioData);
// // // // // // // //             res.status(200).json({ success: true });
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //             res.status(500).json({ error: "Failed to process audio data" });
// // // // // // // //         }
// // // // // // // //     } else {
// // // // // // // //         if (!res.socket.server.io) {
// // // // // // // //             const httpServer: HttpServer = res.socket.server as any;
// // // // // // // //             io = new SocketIOServer(httpServer, {
// // // // // // // //                 path: "/api/llpmg/sip-ws",
// // // // // // // //                 addTrailingSlash: false,
// // // // // // // //             });
// // // // // // // //             res.socket.server.io = io;
// // // // // // // //         } else {
// // // // // // // //             io = res.socket.server.io;
// // // // // // // //         }

// // // // // // // //         if (!softphone || !io) {
// // // // // // // //             await initializeSoftphoneAndSocketIO(res);
// // // // // // // //         }

// // // // // // // //         if (req.method === "POST") {
// // // // // // // //             // removed for sonnet-3.5 12th attempt
// // // // // // // //             // added for sonnet-3.5 11th attempt
// // // // // // // //             // let body;
// // // // // // // //             // try {
// // // // // // // //             //     body =
// // // // // // // //             //         typeof req.body === "string"
// // // // // // // //             //             ? JSON.parse(req.body)
// // // // // // // //             //             : req.body;
// // // // // // // //             // } catch (error) {
// // // // // // // //             //     console.error("Failed to parse request body:", error);
// // // // // // // //             //     return res.status(400).json({ error: "Invalid request body" });
// // // // // // // //             // }
// // // // // // // //             // added for sonnet-3.5 11th attempt
// // // // // // // //             // removed for sonnet-3.5 12th attempt

// // // // // // // //             // removed for sonnet-3.5 10th attempt
// // // // // // // //             // let body;
// // // // // // // //             // try {
// // // // // // // //             //     body = await parseBody(req);
// // // // // // // //             // } catch (error) {
// // // // // // // //             //     return res.status(400).json({ error: "Invalid request body" });
// // // // // // // //             // }

// // // // // // // //             // const { action } = body;
// // // // // // // //             // removed for sonnet-3.5 10th attempt

// // // // // // // //             // added/removed for sonnet-3.5 10th/12th attempt
// // // // // // // //             const { action, callee } = req.body;
// // // // // // // //             // added/removed for sonnet-3.5 10th/12th attempt

// // // // // // // //             // added/removed for sonnet-3.5 11th /12thattempt
// // // // // // // //             // const { action, callee } = body;
// // // // // // // //             // added/removed for sonnet-3.5 11th/12th attempt

// // // // // // // //             // added for sonnet-3.5 12th attempt
// // // // // // // //             console.log("Received POST request:", req.body);
// // // // // // // //             console.log("Action:", action, "Callee:", callee);
// // // // // // // //             // added for sonnet-3.5 12th attempt

// // // // // // // //             // added for sonnet-3.5 11th attempt
// // // // // // // //             if (!action) {
// // // // // // // //                 // added for sonnet-3.5 13th attempt
// // // // // // // //                 console.error("Missing action in request body");
// // // // // // // //                 // added for sonnet-3.5 13th attempt
// // // // // // // //                 return res
// // // // // // // //                     .status(400)
// // // // // // // //                     .json({ error: "Missing action in request body" });
// // // // // // // //             }

// // // // // // // //             if (!softphone) {
// // // // // // // //                 // removed for sonnet-3.5 13th attempt
// // // // // // // //                 // added for sonnet-3.5 12th attempt
// // // // // // // //                 // console.log("Initializing Softphone...");
// // // // // // // //                 // added for sonnet-3.5 12th attempt
// // // // // // // //                 // removed for sonnet-3.5 13th attempt

// // // // // // // //                 // added for sonnet-3.5 13th attempt
// // // // // // // //                 console.error("Softphone not initialized");
// // // // // // // //                 // added for sonnet-3.5 13th attempt

// // // // // // // //                 return res
// // // // // // // //                     .status(500)
// // // // // // // //                     .json({ error: "Softphone not initialized" });
// // // // // // // //             }
// // // // // // // //             // added for sonnet-3.5 11th attempt

// // // // // // // //             // removed for sonnet-3.5 11th attempt
// // // // // // // //             // switch (action) {
// // // // // // // //             //     // removed for sonnet-3.5 11th attempt
// // // // // // // //             //     case "initializeSocket":
// // // // // // // //             //         res.status(200).json({
// // // // // // // //             //             socketUrl: process.env.WEBSOCKET_URL || "",
// // // // // // // //             //         });
// // // // // // // //             //         break;
// // // // // // // //             //     // removed for sonnet-3.5 11th attempt

// // // // // // // //             //     case "call":
// // // // // // // //             //         if (!softphone) {
// // // // // // // //             //             return res
// // // // // // // //             //                 .status(500)
// // // // // // // //             //                 .json({ error: "Softphone not initialized" });
// // // // // // // //             //         }
// // // // // // // //             //         try {
// // // // // // // //             //             // added for sonnet-3.5 6th attempt
// // // // // // // //             //             console.log(
// // // // // // // //             //                 // removed for sonnet-3.5 10th attempt
// // // // // // // //             //                 // `[SIP-HANDLER] Initiating call to ${body.callee}`
// // // // // // // //             //                 // removed for sonnet-3.5 10th attempt
// // // // // // // //             //                 `[SIP-HANDLER] Initiating call to ${callee}`
// // // // // // // //             //             );
// // // // // // // //             //             // added for sonnet-3.5 6th attempt
// // // // // // // //             //             // removed for sonnet-3.5 10th attempt
// // // // // // // //             //             // const callSession = await softphone.call(body.callee);
// // // // // // // //             //             // removed for sonnet-3.5 10th attempt
// // // // // // // //             //             // added for sonnet-3.5 10th attempt
// // // // // // // //             //             const callSession = await softphone.call(callee);
// // // // // // // //             //             // added for sonnet-3.5 10th attempt
// // // // // // // //             //             // removed for sonnet-3.5 7th  attempt
// // // // // // // //             //             // io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //             //             // removed for sonnet-3.5 7th  attempt
// // // // // // // //             //             io?.emit("callInitiated", {
// // // // // // // //             //                 callId: callSession.callId,
// // // // // // // //             //             });

// // // // // // // //             //             res.status(200).json({ callId: callSession.callId });

// // // // // // // //             //             // added for sonnet-3.5 10th attempt
// // // // // // // //             //             // Listen for call state changes
// // // // // // // //             //             callSession.on("ringing", () => {
// // // // // // // //             //                 io?.emit("callRinging");
// // // // // // // //             //             });
// // // // // // // //             //             callSession.on("accepted", () => {
// // // // // // // //             //                 io?.emit("callStarted", {
// // // // // // // //             //                     callId: callSession.callId,
// // // // // // // //             //                 });
// // // // // // // //             //             });
// // // // // // // //             //             callSession.on("ended", () => {
// // // // // // // //             //                 io?.emit("callEnded");
// // // // // // // //             //             });
// // // // // // // //             //             // added for sonnet-3.5 10th attempt
// // // // // // // //             //         } catch (error) {
// // // // // // // //             //             // removed for sonnet-3.5 4th attempt
// // // // // // // //             //             // res.status(500).json({ error: "Failed to initiate call" });
// // // // // // // //             //             // added for sonnet-3.5 4th attempt
// // // // // // // //             //             console.error(
// // // // // // // //             //                 "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //             //                 error
// // // // // // // //             //             );
// // // // // // // //             //             res.status(500).json({
// // // // // // // //             //                 error: "Failed to initiate call",
// // // // // // // //             //                 details: (error as Error).message,
// // // // // // // //             //             });
// // // // // // // //             //             // sonnet-3.5 4th attempt final no lint
// // // // // // // //             //         }
// // // // // // // //             //         // added/removed for sonnet-3.5 7th attempt
// // // // // // // //             //         // io?.emit("callInitiated", { callId: callSession.callId });
// // // // // // // //             //         // added/removed for sonnet-3.5 7th attempt

// // // // // // // //             //         break;

// // // // // // // //             //     case "hangup":
// // // // // // // //             //         if (!softphone) {
// // // // // // // //             //             return res
// // // // // // // //             //                 .status(500)
// // // // // // // //             //                 .json({ error: "Softphone not initialized" });
// // // // // // // //             //         }
// // // // // // // //             //         try {
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //             console.log("[SIP-HANDLER] Hanging up call");
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //             await softphone.hangup();
// // // // // // // //             //             io?.emit("callEnded");
// // // // // // // //             //             res.status(200).json({ success: true });
// // // // // // // //             //         } catch (error) {
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //             console.error(
// // // // // // // //             //                 "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //             //                 error
// // // // // // // //             //             );
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //             // removed for sonnet-3.5 7th attempt
// // // // // // // //             //             // res.status(500).json({ error: "Failed to hang up call" });
// // // // // // // //             //             // removed for sonnet-3.5 7th attempt
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //             res.status(500).json({
// // // // // // // //             //                 error: "Failed to hang up call",
// // // // // // // //             //                 details: (error as Error).message,
// // // // // // // //             //             });
// // // // // // // //             //             // added for sonnet-3.5 7th attempt
// // // // // // // //             //         }
// // // // // // // //             //         break;

// // // // // // // //             //     case "answer":
// // // // // // // //             //         if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //             //             return res
// // // // // // // //             //                 .status(400)
// // // // // // // //             //                 .json({ error: "No incoming call to answer" });
// // // // // // // //             //         }
// // // // // // // //             //         try {
// // // // // // // //             //             const callSession = await softphone.answer(
// // // // // // // //             //                 softphone.lastInviteMessage
// // // // // // // //             //             );
// // // // // // // //             //             io?.emit("callStarted", { callId: callSession.callId });
// // // // // // // //             //             res.status(200).json({ callId: callSession.callId });
// // // // // // // //             //         } catch (error) {
// // // // // // // //             //             res.status(500).json({
// // // // // // // //             //                 error: "Failed to answer call",
// // // // // // // //             //             });
// // // // // // // //             //         }
// // // // // // // //             //         break;

// // // // // // // //             //     case "decline":
// // // // // // // //             //         if (!softphone || !softphone.lastInviteMessage) {
// // // // // // // //             //             return res
// // // // // // // //             //                 .status(400)
// // // // // // // //             //                 .json({ error: "No incoming call to decline" });
// // // // // // // //             //         }
// // // // // // // //             //         try {
// // // // // // // //             //             await softphone.decline(softphone.lastInviteMessage);
// // // // // // // //             //             io?.emit("callEnded");
// // // // // // // //             //             res.status(200).json({ success: true });
// // // // // // // //             //         } catch (error) {
// // // // // // // //             //             res.status(500).json({
// // // // // // // //             //                 error: "Failed to decline call",
// // // // // // // //             //             });
// // // // // // // //             //         }
// // // // // // // //             //         break;

// // // // // // // //             //     default:
// // // // // // // //             //         res.status(400).json({ error: "Invalid action" });

// // // // // // // //             //     }
// // // // // // // //             // }
// // // // // // // //             // removed for sonnet-3.5 11th attempt
// // // // // // // //             //tempt edit
// // // // // // // //             // added for sonnet-3.5 11th attempt
// // // // // // // //             switch (action) {
// // // // // // // //                 case "call":
// // // // // // // //                     if (!callee) {
// // // // // // // //                         // added for sonnet-3.5 12th attempt
// // // // // // // //                         console.error("Missing callee number");
// // // // // // // //                         // added for sonnet-3.5 12th attempt
// // // // // // // //                         return res
// // // // // // // //                             .status(400)
// // // // // // // //                             .json({ error: "Missing callee number" });
// // // // // // // //                     }
// // // // // // // //                     try {
// // // // // // // //                         console.log(
// // // // // // // //                             `[SIP-HANDLER] Initiating call to ${callee}`
// // // // // // // //                         );
// // // // // // // //                         const callSession = await softphone.call(callee);
// // // // // // // //                         // added for sonnet-3.5 12th attempt
// // // // // // // //                         console.log("Call session created:", callSession);
// // // // // // // //                         // added for sonnet-3.5 12th attempt
// // // // // // // //                         io?.emit("callInitiated", {
// // // // // // // //                             callId: callSession.callId,
// // // // // // // //                         });
// // // // // // // //                         res.status(200).json({ callId: callSession.callId });
// // // // // // // //                     } catch (error) {
// // // // // // // //                         console.error(
// // // // // // // //                             "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //                             error
// // // // // // // //                         );
// // // // // // // //                         res.status(500).json({
// // // // // // // //                             error: "Failed to initiate call",
// // // // // // // //                             details: (error as Error).message,
// // // // // // // //                         });
// // // // // // // //                     }
// // // // // // // //                     break;

// // // // // // // //                 case "hangup":
// // // // // // // //                     try {
// // // // // // // //                         await softphone.hangup();
// // // // // // // //                         io?.emit("callEnded");
// // // // // // // //                         res.status(200).json({ success: true });
// // // // // // // //                     } catch (error) {
// // // // // // // //                         console.error(
// // // // // // // //                             "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //                             error
// // // // // // // //                         );
// // // // // // // //                         res.status(500).json({
// // // // // // // //                             error: "Failed to hang up call",
// // // // // // // //                         });
// // // // // // // //                     }
// // // // // // // //                     break;

// // // // // // // //                 default:
// // // // // // // //                     res.status(400).json({ error: "Invalid action" });
// // // // // // // //             }
// // // // // // // //         } else {
// // // // // // // //             res.setHeader("Allow", ["POST"]);
// // // // // // // //             res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // // // //         }
// // // // // // // //         // added for sonnet-3.5 11th attempt
// // // // // // // //     }

// // // // // // // //     // removed for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // //     // if (req.method === "PUT" && req.headers["content-type"] === "application/octet-stream") {
// // // // // // // //     //     if (!softphone || !softphone.currentCallSession) {
// // // // // // // //     //         return res.status(400).json({ error: "No active call session" });
// // // // // // // //     //     }

// // // // // // // //     //     try {
// // // // // // // //     //         console.log("[SIP-HANDLER] Received audio data from client");
// // // // // // // //     //         const audioData = await getRawBody(req);
// // // // // // // //     //         await softphone.sendAudio(audioData);
// // // // // // // //     //         res.status(200).json({ success: true });
// // // // // // // //     //     } catch (error) {
// // // // // // // //     //         console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //     //         res.status(500).json({ error: "Failed to process audio data", details:(error as Error).message });
// // // // // // // //     //     }
// // // // // // // //     // }
// // // // // // // //     // added for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // //     if (
// // // // // // // //         req.method === "PUT" &&
// // // // // // // //         req.headers["content-type"] === "application/octet-stream"
// // // // // // // //     ) {
// // // // // // // //         if (!softphone || !softphone.currentCallSession) {
// // // // // // // //             return res.status(400).json({ error: "No active call session" });
// // // // // // // //         }

// // // // // // // //         // temp edit
// // // // // // // //         try {
// // // // // // // //             console.log("[SIP-HANDLER] Received audio data from client");
// // // // // // // //             const audioData = await getRawBody(req);
// // // // // // // //             await softphone.sendAudio(audioData);
// // // // // // // //             res.status(200).json({ success: true });
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //             res.status(500).json({
// // // // // // // //                 error: "Failed to process audio data",
// // // // // // // //                 details: (error as Error).message,
// // // // // // // //             });
// // // // // // // //         }
// // // // // // // //         // temp edit
// // // // // // // //         // temp add
// // // // // // // //         // try {
// // // // // // // //         //     const audioData = await getRawBodyImport(req);
// // // // // // // //         //     await softphone.sendAudio(audioData);
// // // // // // // //         //     res.status(200).json({ success: true });
// // // // // // // //         // } catch (error) {
// // // // // // // //         //     console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //         //     res.status(500).json({ error: "Failed to process audio data" });
// // // // // // // //         // }
// // // // // // // //         // temp add
// // // // // // // //     }
// // // // // // // //     // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)
// // // // // // // //     else {
// // // // // // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // // // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // async function initializeSoftphoneAndSocketIO(res: NextApiResponseServerIO) {
// // // // // // // //     const sipInfo = {
// // // // // // // //         username: process.env.SIP_INFO_USERNAME!,
// // // // // // // //         password: process.env.SIP_INFO_PASSWORD!,
// // // // // // // //         authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // // // //         domain: process.env.SIP_INFO_DOMAIN!,
// // // // // // // //     };

// // // // // // // //     softphone = new Softphone(sipInfo);
// // // // // // // //     await softphone.register();
// // // // // // // //     console.log("Softphone registered successfully");

// // // // // // // //     softphone.on("invite", (inviteMessage) => {
// // // // // // // //         const callerNumber =
// // // // // // // //             inviteMessage.headers.From.match(/<sip:(.+?)@/)?.[1] || "Unknown";
// // // // // // // //         io?.emit("incomingCall", { callerNumber });
// // // // // // // //     });

// // // // // // // //     softphone.on("callEnded", () => {
// // // // // // // //         io?.emit("callEnded");
// // // // // // // //     });

// // // // // // // //     softphone.on("audioData", (audioData: Buffer) => {
// // // // // // // //         console.log(
// // // // // // // //             `[SIP-HANDLER] Forwarding audio data: ${audioData.byteLength} bytes`
// // // // // // // //         );
// // // // // // // //         io?.emit("audioData", audioData);
// // // // // // // //     });

// // // // // // // //     if (!io) {
// // // // // // // //         if (!res.socket.server.io) {
// // // // // // // //             console.log("Initializing Socket.IO server");
// // // // // // // //             io = new SocketIOServer(res.socket.server as any, {
// // // // // // // //                 path: "/api/llpmg/sip-ws",
// // // // // // // //                 addTrailingSlash: false,
// // // // // // // //             });
// // // // // // // //             res.socket.server.io = io;
// // // // // // // //         } else {
// // // // // // // //             console.log("Socket.IO server already initialized");
// // // // // // // //             io = res.socket.server.io;
// // // // // // // //         }

// // // // // // // //         io.on("connection", (socket) => {
// // // // // // // //             console.log("New WebSocket connection established");

// // // // // // // //             socket.on("audioData", (audioData: ArrayBuffer) => {
// // // // // // // //                 if (softphone && softphone.currentCallSession) {
// // // // // // // //                     console.log(
// // // // // // // //                         `[SIP-HANDLER] Audio data received from client: ${audioData.byteLength} bytes`
// // // // // // // //                     );
// // // // // // // //                     softphone.currentCallSession.sendAudio(
// // // // // // // //                         Buffer.from(audioData)
// // // // // // // //                     );
// // // // // // // //                 } else {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] No active call session to send audio data"
// // // // // // // //                     );
// // // // // // // //                 }
// // // // // // // //             });

// // // // // // // //             socket.on("disconnect", () => {
// // // // // // // //                 console.log("WebSocket connection closed");
// // // // // // // //             });
// // // // // // // //         });
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // async function parseBody(req: NextApiRequest): Promise<any> {
// // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // //         let body = "";
// // // // // // // //         req.on("data", (chunk) => {
// // // // // // // //             body += chunk.toString();
// // // // // // // //         });
// // // // // // // //         req.on("end", () => {
// // // // // // // //             try {
// // // // // // // //                 resolve(JSON.parse(body));
// // // // // // // //             } catch (error) {
// // // // // // // //                 reject(error);
// // // // // // // //             }
// // // // // // // //         });
// // // // // // // //     });
// // // // // // // // }

// // // // // // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // //         const chunks: Buffer[] = [];
// // // // // // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // // // // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // // // // // //         req.on("error", reject);
// // // // // // // //     });
// // // // // // // // }
// // // // // // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // removed for sonnet-3.5 14th attempt

// // // // // // // // reverting to sonnet-3.5 2nd attempt
// // // // // // // // doesn't work
// // // // // // // // added for sonnet-3.5 14th attempt
// // // // // // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // // // // // import Softphone from "@/ref/soft/src/softphone";
// // // // // // // // import { Server as SocketIOServer } from "socket.io";
// // // // // // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // // // // // // let softphone: Softphone | null = null;
// // // // // // // // let io: SocketIOServer | null = null;

// // // // // // // // export default async function handler(
// // // // // // // //     req: NextApiRequest,
// // // // // // // //     res: NextApiResponseServerIO
// // // // // // // // ) {
// // // // // // // //     console.log("Received request:", req.method, req.url);
// // // // // // // //     console.log("Request body:", req.body);

// // // // // // // //     if (!softphone) {
// // // // // // // //         console.log("Initializing Softphone...");
// // // // // // // //         const sipInfo = {
// // // // // // // //             username: process.env.SIP_INFO_USERNAME!,
// // // // // // // //             password: process.env.SIP__INFO_PASSWORD!,
// // // // // // // //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // // // //             domain: process.env.SIP_INFO_DOMAIN!,
// // // // // // // //         };
// // // // // // // //         softphone = new Softphone(sipInfo);
// // // // // // // //         await softphone.register();
// // // // // // // //         console.log("Softphone registered successfully");
// // // // // // // //     }

// // // // // // // //     if (!io) {
// // // // // // // //         console.log("Initializing Socket.IO...");
// // // // // // // //         io = new SocketIOServer(res.socket.server as any, {
// // // // // // // //             path: "/api/llpmg/sip-ws",
// // // // // // // //             addTrailingSlash: false,
// // // // // // // //         });
// // // // // // // //         res.socket.server.io = io;
// // // // // // // //     }

// // // // // // // //     if (req.method === "POST") {
// // // // // // // //         const { action, callee } = req.body;
// // // // // // // //         console.log("Parsed action:", action, "callee:", callee);

// // // // // // // //         if (!action) {
// // // // // // // //             console.error("Missing action in request body");
// // // // // // // //             return res
// // // // // // // //                 .status(400)
// // // // // // // //                 .json({ error: "Missing action in request body" });
// // // // // // // //         }

// // // // // // // //         switch (action) {
// // // // // // // //             case "call":
// // // // // // // //                 if (!callee) {
// // // // // // // //                     console.error("Missing callee number");
// // // // // // // //                     return res
// // // // // // // //                         .status(400)
// // // // // // // //                         .json({ error: "Missing callee number" });
// // // // // // // //                 }
// // // // // // // //                 try {
// // // // // // // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // // // // // // //                     const callSession = await softphone.call(callee);
// // // // // // // //                     console.log("Call session created:", callSession);
// // // // // // // //                     io.emit("callInitiated", { callId: callSession.callId });
// // // // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({
// // // // // // // //                         error: "Failed to initiate call",
// // // // // // // //                         details: (error as Error).message,
// // // // // // // //                     });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "hangup":
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Hanging up call");
// // // // // // // //                     await softphone.hangup();
// // // // // // // //                     io.emit("callEnded");
// // // // // // // //                     res.status(200).json({ success: true });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to hang up call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "answer":
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // // // // // // //                     if (!softphone.lastInviteMessage) {
// // // // // // // //                         throw new Error("No incoming call to answer");
// // // // // // // //                     }
// // // // // // // //                     const callSession = await softphone.answer(
// // // // // // // //                         softphone.lastInviteMessage
// // // // // // // //                     );
// // // // // // // //                     io.emit("callStarted", { callId: callSession.callId });
// // // // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to answer call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to answer call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             case "decline":
// // // // // // // //                 try {
// // // // // // // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // // // // // // //                     if (!softphone.lastInviteMessage) {
// // // // // // // //                         throw new Error("No incoming call to decline");
// // // // // // // //                     }
// // // // // // // //                     await softphone.decline(softphone.lastInviteMessage);
// // // // // // // //                     io.emit("callEnded");
// // // // // // // //                     res.status(200).json({ success: true });
// // // // // // // //                 } catch (error) {
// // // // // // // //                     console.error(
// // // // // // // //                         "[SIP-HANDLER] Failed to decline call:",
// // // // // // // //                         error
// // // // // // // //                     );
// // // // // // // //                     res.status(500).json({ error: "Failed to decline call" });
// // // // // // // //                 }
// // // // // // // //                 break;

// // // // // // // //             default:
// // // // // // // //                 console.error("Invalid action:", action);
// // // // // // // //                 res.status(400).json({ error: "Invalid action" });
// // // // // // // //         }
// // // // // // // //     } else if (req.method === "PUT") {
// // // // // // // //         try {
// // // // // // // //             const audioData = await getRawBody(req);
// // // // // // // //             await softphone.sendAudio(audioData);
// // // // // // // //             res.status(200).json({ success: true });
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // // // //             res.status(500).json({ error: "Failed to process audio data" });
// // // // // // // //         }
// // // // // // // //     } else {
// // // // // // // //         console.error("Method not allowed:", req.method);
// // // // // // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // // // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // //         const chunks: Buffer[] = [];
// // // // // // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // // // // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // // // // // //         req.on("error", reject);
// // // // // // // //     });
// // // // // // // // }
// // // // // // // // added for sonnet-3.5 14th attempt
// // // // // // // // doesn't work
// // // // // // // // reverting to sonnet-3.5 2nd attempt
// // // // // // // ------------------- number 15
// // // // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // // // import Softphone from "@/ref/soft/src/softphone";
// // // // // // import { Server as SocketIOServer } from "socket.io";
// // // // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // // // // let softphone: Softphone | null = null;
// // // // // // let io: SocketIOServer | null = null;

// // // // // // export default async function handler(
// // // // // //     req: NextApiRequest,
// // // // // //     res: NextApiResponseServerIO
// // // // // // ) {
// // // // // //     console.log("Received request:", req.method, req.url);
// // // // // //     console.log("Request body:", req.body);

// // // // // //     // 15
// // // // // //     // if (!softphone) {
// // // // // //     //     console.log("Initializing Softphone...");
// // // // // //     //     const sipInfo = {
// // // // // //     //         username: process.env.SIP_INFO_USERNAME!,
// // // // // //     //         password: process.env.SIP_INFO_PASSWORD!,
// // // // // //     //         authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // //     //         domain: process.env.SIP_INFO_DOMAIN!,
// // // // // //     //     };
// // // // // //     //     softphone = new Softphone(sipInfo);
// // // // // //     //     await softphone.register();
// // // // // //     //     console.log("Softphone registered successfully");
// // // // // //     // }
// // // // // //     // 16
// // // // // //     // if (!softphone) {
// // // // // //     //     console.log("Initializing Softphone...");
// // // // // //     //     const sipInfo = {
// // // // // //     //         username: process.env.SIP_INFO_USERNAME!,
// // // // // //     //         password: process.env.SIP_INFO_PASSWORD!,
// // // // // //     //         authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // //     //         domain: process.env.SIP_INFO_DOMAIN!,
// // // // // //     //     };
// // // // // //     //     softphone = new Softphone(sipInfo);
// // // // // //     //     await softphone.register();
// // // // // //     //     console.log("Softphone registered successfully");

// // // // // //     //     softphone.on("callEnded", () => {
// // // // // //     //         console.log("[SIP-HANDLER] Call ended, emitting event to client");
// // // // // //     //         io?.emit("callEnded");
// // // // // //     //     });
// // // // // //     // }
// // // // // //     // 17
// // // // // //     if (!softphone) {
// // // // // //         console.log("Initializing Softphone...");
// // // // // //         const sipInfo = {
// // // // // //             username: process.env.SIP_INFO_USERNAME!,
// // // // // //             password: process.env.SIP_INFO_PASSWORD!,
// // // // // //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // // //             domain: process.env.SIP_INFO_DOMAIN!,
// // // // // //         };
// // // // // //         softphone = new Softphone(sipInfo);
// // // // // //         await softphone.register();
// // // // // //         console.log("Softphone registered successfully");

// // // // // //         softphone.on("callEnded", () => {
// // // // // //             console.log("[SIP-HANDLER] Call ended, emitting event to client");
// // // // // //             io?.emit("callEnded");
// // // // // //         });
// // // // // //     }

// // // // // //     if (!io) {
// // // // // //         console.log("Initializing Socket.IO...");
// // // // // //         io = new SocketIOServer(res.socket.server as any, {
// // // // // //             path: "/api/llpmg/sip-ws",
// // // // // //             addTrailingSlash: false,
// // // // // //         });
// // // // // //         res.socket.server.io = io;
// // // // // //     }

// // // // // //     if (req.method === "POST") {
// // // // // //         const { action, callee } = req.body;
// // // // // //         console.log("Parsed action:", action, "callee:", callee);

// // // // // //         if (!action) {
// // // // // //             console.error("Missing action in request body");
// // // // // //             return res
// // // // // //                 .status(400)
// // // // // //                 .json({ error: "Missing action in request body" });
// // // // // //         }

// // // // // //         switch (action) {
// // // // // //             case "call":
// // // // // //                 if (!callee) {
// // // // // //                     console.error("Missing callee number");
// // // // // //                     return res
// // // // // //                         .status(400)
// // // // // //                         .json({ error: "Missing callee number" });
// // // // // //                 }
// // // // // //                 try {
// // // // // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // // // // //                     const callSession = await softphone.call(callee);
// // // // // //                     console.log("Call session created:", callSession);
// // // // // //                     io.emit("callInitiated", { callId: callSession.callId });
// // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // //                 } catch (error) {
// // // // // //                     console.error(
// // // // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // // // //                         error
// // // // // //                     );
// // // // // //                     res.status(500).json({
// // // // // //                         error: "Failed to initiate call",
// // // // // //                         details: (error as Error).message,
// // // // // //                     });
// // // // // //                 }
// // // // // //                 break;

// // // // // //             case "hangup":
// // // // // //                 try {
// // // // // //                     console.log("[SIP-HANDLER] Hanging up call");
// // // // // //                     await softphone.hangup();
// // // // // //                     io.emit("callEnded");
// // // // // //                     res.status(200).json({ success: true });
// // // // // //                 } catch (error) {
// // // // // //                     console.error(
// // // // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // // // //                         error
// // // // // //                     );
// // // // // //                     res.status(500).json({ error: "Failed to hang up call" });
// // // // // //                 }
// // // // // //                 break;

// // // // // //             case "answer":
// // // // // //                 try {
// // // // // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // // // // //                     if (!softphone.lastInviteMessage) {
// // // // // //                         throw new Error("No incoming call to answer");
// // // // // //                     }
// // // // // //                     const callSession = await softphone.answer(
// // // // // //                         softphone.lastInviteMessage
// // // // // //                     );
// // // // // //                     io.emit("callStarted", { callId: callSession.callId });
// // // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // // //                 } catch (error) {
// // // // // //                     console.error(
// // // // // //                         "[SIP-HANDLER] Failed to answer call:",
// // // // // //                         error
// // // // // //                     );
// // // // // //                     res.status(500).json({ error: "Failed to answer call" });
// // // // // //                 }
// // // // // //                 break;

// // // // // //             case "decline":
// // // // // //                 try {
// // // // // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // // // // //                     if (!softphone.lastInviteMessage) {
// // // // // //                         throw new Error("No incoming call to decline");
// // // // // //                     }
// // // // // //                     await softphone.decline(softphone.lastInviteMessage);
// // // // // //                     io.emit("callEnded");
// // // // // //                     res.status(200).json({ success: true });
// // // // // //                 } catch (error) {
// // // // // //                     console.error(
// // // // // //                         "[SIP-HANDLER] Failed to decline call:",
// // // // // //                         error
// // // // // //                     );
// // // // // //                     res.status(500).json({ error: "Failed to decline call" });
// // // // // //                 }
// // // // // //                 break;

// // // // // //             default:
// // // // // //                 console.error("Invalid action:", action);
// // // // // //                 res.status(400).json({ error: "Invalid action" });
// // // // // //         }
// // // // // //     } else if (req.method === "PUT") {
// // // // // //         try {
// // // // // //             const audioData = await getRawBody(req);
// // // // // //             await softphone.sendAudio(audioData);
// // // // // //             res.status(200).json({ success: true });
// // // // // //         } catch (error) {
// // // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // // //             res.status(500).json({ error: "Failed to process audio data" });
// // // // // //         }
// // // // // //     } else {
// // // // // //         console.error("Method not allowed:", req.method);
// // // // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // // //     }
// // // // // // }

// // // // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // // // //     return new Promise((resolve, reject) => {
// // // // // //         const chunks: Buffer[] = [];
// // // // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // // // //         req.on("error", reject);
// // // // // //     });
// // // // // // }

// // // // // // 20
// // // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // // import Softphone from "@/ref/soft/src/softphone";
// // // // // import { Server as SocketIOServer } from "socket.io";
// // // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // // // let softphone: Softphone | null = null;
// // // // // let io: SocketIOServer | null = null;

// // // // // export default async function handler(
// // // // //     req: NextApiRequest,
// // // // //     res: NextApiResponseServerIO
// // // // // ) {
// // // // //     console.log(`[SIP-HANDLER] Received ${req.method} request to ${req.url}`);
// // // // //     console.log("[SIP-HANDLER] Request body:", req.body);

// // // // //     if (!softphone) {
// // // // //         console.log("[SIP-HANDLER] Initializing Softphone...");
// // // // //         const sipInfo = {
// // // // //             username: process.env.SIP_INFO_USERNAME!,
// // // // //             password: process.env.SIP_INFO_PASSWORD!,
// // // // //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // // //             domain: process.env.SIP_INFO_DOMAIN!,
// // // // //         };
// // // // //         softphone = new Softphone(sipInfo);
// // // // //         await softphone.register();
// // // // //         console.log("[SIP-HANDLER] Softphone registered successfully");

// // // // //         softphone.on("callStarted", (callId) => {
// // // // //             console.log(`[SIP-HANDLER] Call answered with ID: ${callId}`);
// // // // //             io?.emit("callStarted", { callId });
// // // // //         });

// // // // //         softphone.on("callEnded", (callId) => {
// // // // //             console.log(`[SIP-HANDLER] Call ended with ID: ${callId}`);
// // // // //             io?.emit("callEnded", { callId });
// // // // //         });

// // // // //         softphone.on("audioData", (audioData: Buffer) => {
// // // // //             console.log(
// // // // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // // // //             );
// // // // //             io?.emit("audioData", audioData);
// // // // //         });
// // // // //     }

// // // // //     if (!io) {
// // // // //         console.log("[SIP-HANDLER] Initializing Socket.IO...");
// // // // //         io = new SocketIOServer(res.socket.server as any, {
// // // // //             path: "/api/llpmg/sip-ws",
// // // // //             addTrailingSlash: false,
// // // // //         });
// // // // //         res.socket.server.io = io;
// // // // //     }

// // // // //     if (req.method === "POST") {
// // // // //         const { action, callee } = req.body;
// // // // //         console.log(
// // // // //             `[SIP-HANDLER] Received action: ${action}, callee: ${callee}`
// // // // //         );

// // // // //         if (!action) {
// // // // //             console.error("[SIP-HANDLER] Missing action in request body");
// // // // //             return res
// // // // //                 .status(400)
// // // // //                 .json({
// // // // //                     error: "[SIP-HANDLER] Missing action in request body",
// // // // //                 });
// // // // //         }

// // // // //         switch (action) {
// // // // //             case "call":
// // // // //                 if (!callee) {
// // // // //                     console.error("[SIP-HANDLER] Missing callee number");
// // // // //                     return res
// // // // //                         .status(400)
// // // // //                         .json({ error: "[SIP-HANDLER] Missing callee number" });
// // // // //                 }
// // // // //                 try {
// // // // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // // // //                     const callSession = await softphone.call(callee);
// // // // //                     console.log(
// // // // //                         `[SIP-HANDLER] Call initiated with ID: ${callSession.callId}`
// // // // //                     );
// // // // //                     io?.emit("callInitiated", { callId: callSession.callId });
// // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // //                 } catch (error) {
// // // // //                     console.error(
// // // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // // //                         error
// // // // //                     );
// // // // //                     res.status(500).json({
// // // // //                         error: "[SIP-HANDLER] Failed to initiate call",
// // // // //                         details: (error as Error).message,
// // // // //                     });
// // // // //                 }
// // // // //                 break;

// // // // //             case "hangup":
// // // // //                 try {
// // // // //                     console.log("[SIP-HANDLER] Hanging up call");
// // // // //                     await softphone.hangup();
// // // // //                     console.log("[SIP-HANDLER] Call hung up successfully");
// // // // //                     io?.emit("callEnded");
// // // // //                     res.status(200).json({ success: true });
// // // // //                 } catch (error) {
// // // // //                     console.error(
// // // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // // //                         error
// // // // //                     );
// // // // //                     res.status(500).json({
// // // // //                         error: "[SIP-HANDLER] Failed to hang up call",
// // // // //                     });
// // // // //                 }
// // // // //                 break;

// // // // //             case "answer":
// // // // //                 try {
// // // // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // // // //                     if (!softphone.lastInviteMessage) {
// // // // //                         throw new Error(
// // // // //                             "[SIP-HANDLER] No incoming call to answer"
// // // // //                         );
// // // // //                     }
// // // // //                     const callSession = await softphone.answer(
// // // // //                         softphone.lastInviteMessage
// // // // //                     );
// // // // //                     console.log(
// // // // //                         `[SIP-HANDLER] Call answered with ID: ${callSession.callId}`
// // // // //                     );
// // // // //                     io?.emit("callStarted", { callId: callSession.callId });
// // // // //                     res.status(200).json({ callId: callSession.callId });
// // // // //                 } catch (error) {
// // // // //                     console.error(
// // // // //                         "[SIP-HANDLER] Failed to answer call:",
// // // // //                         error
// // // // //                     );
// // // // //                     res.status(500).json({
// // // // //                         error: "[SIP-HANDLER] Failed to answer call",
// // // // //                     });
// // // // //                 }
// // // // //                 break;

// // // // //             case "decline":
// // // // //                 try {
// // // // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // // // //                     if (!softphone.lastInviteMessage) {
// // // // //                         throw new Error(
// // // // //                             "[SIP-HANDLER] No incoming call to decline"
// // // // //                         );
// // // // //                     }
// // // // //                     await softphone.decline(softphone.lastInviteMessage);
// // // // //                     console.log("[SIP-HANDLER] Call declined successfully");
// // // // //                     io?.emit("callEnded");
// // // // //                     res.status(200).json({ success: true });
// // // // //                 } catch (error) {
// // // // //                     console.error(
// // // // //                         "[SIP-HANDLER] Failed to decline call:",
// // // // //                         error
// // // // //                     );
// // // // //                     res.status(500).json({
// // // // //                         error: "[SIP-HANDLER] Failed to decline call",
// // // // //                     });
// // // // //                 }
// // // // //                 break;

// // // // //             default:
// // // // //                 console.error("[SIP-HANDLER] Invalid action:", action);
// // // // //                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
// // // // //         }
// // // // //     } else if (req.method === "PUT") {
// // // // //         try {
// // // // //             const audioData = await getRawBody(req);
// // // // //             console.log(
// // // // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // // // //             );
// // // // //             await softphone.sendAudio(audioData);
// // // // //             res.status(200).json({ success: true });
// // // // //         } catch (error) {
// // // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // // //             res.status(500).json({
// // // // //                 error: "[SIP-HANDLER] Failed to process audio data",
// // // // //             });
// // // // //         }
// // // // //     } else {
// // // // //         console.error("[SIP-HANDLER] Method not allowed:", req.method);
// // // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // // //     }
// // // // // }

// // // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // // //     return new Promise((resolve, reject) => {
// // // // //         const chunks: Buffer[] = [];
// // // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // // //         req.on("error", reject);
// // // // //     });
// // // // // }

// // // // // 21 wav wav
// // // // import { NextApiRequest, NextApiResponse } from "next";
// // // // import Softphone from "@/ref/soft/src/softphone";
// // // // import { Server as SocketIOServer } from "socket.io";
// // // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // // let softphone: Softphone | null = null;
// // // // let io: SocketIOServer | null = null;

// // // // export default async function handler(
// // // //     req: NextApiRequest,
// // // //     res: NextApiResponseServerIO
// // // // ) {
// // // //     console.log(`[SIP-HANDLER] Received ${req.method} request to ${req.url}`);
// // // //     console.log("[SIP-HANDLER] Request body:", req.body);

// // // //     if (!softphone) {
// // // //         console.log("[SIP-HANDLER] Initializing Softphone...");
// // // //         const sipInfo = {
// // // //             username: process.env.SIP_INFO_USERNAME!,
// // // //             password: process.env.SIP_INFO_PASSWORD!,
// // // //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // // //             domain: process.env.SIP_INFO_DOMAIN!,
// // // //         };
// // // //         softphone = new Softphone(sipInfo);
// // // //         await softphone.register();
// // // //         console.log("[SIP-HANDLER] Softphone registered successfully");

// // // //         softphone.on("callStarted", (callId) => {
// // // //             console.log(`[SIP-HANDLER] Call answered with ID: ${callId}`);
// // // //             io?.emit("callStarted", { callId });
// // // //         });

// // // //         softphone.on("callEnded", (callId) => {
// // // //             console.log(`[SIP-HANDLER] Call ended with ID: ${callId}`);
// // // //             io?.emit("callEnded", { callId });
// // // //         });

// // // //         softphone.on("audioData", (audioData: Buffer) => {
// // // //             console.log(
// // // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // // //             );
// // // //             io?.emit("audioData", audioData);
// // // //         });
// // // //     }

// // // //     if (!io) {
// // // //         console.log("[SIP-HANDLER] Initializing Socket.IO...");
// // // //         io = new SocketIOServer(res.socket.server as any, {
// // // //             path: "/api/llpmg/sip-ws",
// // // //             addTrailingSlash: false,
// // // //         });
// // // //         res.socket.server.io = io;
// // // //     }

// // // //     if (req.method === "POST") {
// // // //         const { action, callee } = req.body;
// // // //         console.log(
// // // //             `[SIP-HANDLER] Received action: ${action}, callee: ${callee}`
// // // //         );

// // // //         if (!action) {
// // // //             console.error("[SIP-HANDLER] Missing action in request body");
// // // //             return res.status(400).json({
// // // //                 error: "[SIP-HANDLER] Missing action in request body",
// // // //             });
// // // //         }

// // // //         switch (action) {
// // // //             case "call":
// // // //                 if (!callee) {
// // // //                     console.error("[SIP-HANDLER] Missing callee number");
// // // //                     return res
// // // //                         .status(400)
// // // //                         .json({ error: "[SIP-HANDLER] Missing callee number" });
// // // //                 }
// // // //                 try {
// // // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // // //                     const callSession = await softphone.call(callee);
// // // //                     console.log(
// // // //                         `[SIP-HANDLER] Call initiated with ID: ${callSession.callId}`
// // // //                     );
// // // //                     io?.emit("callInitiated", { callId: callSession.callId });
// // // //                     res.status(200).json({ callId: callSession.callId });
// // // //                 } catch (error) {
// // // //                     console.error(
// // // //                         "[SIP-HANDLER] Failed to initiate call:",
// // // //                         error
// // // //                     );
// // // //                     res.status(500).json({
// // // //                         error: "[SIP-HANDLER] Failed to initiate call",
// // // //                         details: (error as Error).message,
// // // //                     });
// // // //                 }
// // // //                 break;

// // // //             case "hangup":
// // // //                 try {
// // // //                     console.log("[SIP-HANDLER] Hanging up call");
// // // //                     await softphone.hangup();
// // // //                     console.log("[SIP-HANDLER] Call hung up successfully");
// // // //                     io?.emit("callEnded");
// // // //                     res.status(200).json({ success: true });
// // // //                 } catch (error) {
// // // //                     console.error(
// // // //                         "[SIP-HANDLER] Failed to hang up call:",
// // // //                         error
// // // //                     );
// // // //                     res.status(500).json({
// // // //                         error: "[SIP-HANDLER] Failed to hang up call",
// // // //                     });
// // // //                 }
// // // //                 break;

// // // //             case "answer":
// // // //                 try {
// // // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // // //                     if (!softphone.lastInviteMessage) {
// // // //                         throw new Error(
// // // //                             "[SIP-HANDLER] No incoming call to answer"
// // // //                         );
// // // //                     }
// // // //                     const callSession = await softphone.answer(
// // // //                         softphone.lastInviteMessage
// // // //                     );
// // // //                     console.log(
// // // //                         `[SIP-HANDLER] Call answered with ID: ${callSession.callId}`
// // // //                     );
// // // //                     io?.emit("callStarted", { callId: callSession.callId });
// // // //                     res.status(200).json({ callId: callSession.callId });
// // // //                 } catch (error) {
// // // //                     console.error(
// // // //                         "[SIP-HANDLER] Failed to answer call:",
// // // //                         error
// // // //                     );
// // // //                     res.status(500).json({
// // // //                         error: "[SIP-HANDLER] Failed to answer call",
// // // //                     });
// // // //                 }
// // // //                 break;

// // // //             case "decline":
// // // //                 try {
// // // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // // //                     if (!softphone.lastInviteMessage) {
// // // //                         throw new Error(
// // // //                             "[SIP-HANDLER] No incoming call to decline"
// // // //                         );
// // // //                     }
// // // //                     await softphone.decline(softphone.lastInviteMessage);
// // // //                     console.log("[SIP-HANDLER] Call declined successfully");
// // // //                     io?.emit("callEnded");
// // // //                     res.status(200).json({ success: true });
// // // //                 } catch (error) {
// // // //                     console.error(
// // // //                         "[SIP-HANDLER] Failed to decline call:",
// // // //                         error
// // // //                     );
// // // //                     res.status(500).json({
// // // //                         error: "[SIP-HANDLER] Failed to decline call",
// // // //                     });
// // // //                 }
// // // //                 break;

// // // //             default:
// // // //                 console.error("[SIP-HANDLER] Invalid action:", action);
// // // //                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
// // // //         }
// // // //     } else if (req.method === "PUT") {
// // // //         try {
// // // //             const audioData = await getRawBody(req);
// // // //             console.log(
// // // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // // //             );
// // // //             await softphone.sendAudio(audioData);
// // // //             res.status(200).json({ success: true });
// // // //         } catch (error) {
// // // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // // //             res.status(500).json({
// // // //                 error: "[SIP-HANDLER] Failed to process audio data",
// // // //             });
// // // //         }
// // // //     } else {
// // // //         console.error("[SIP-HANDLER] Method not allowed:", req.method);
// // // //         res.setHeader("Allow", ["POST", "PUT"]);
// // // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // // //     }
// // // // }

// // // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // // //     return new Promise((resolve, reject) => {
// // // //         const chunks: Buffer[] = [];
// // // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // // //         req.on("error", reject);
// // // //     });
// // // // }

// // // // 23 raw raw
// // // import { NextApiRequest, NextApiResponse } from "next";
// // // import Softphone from "@/ref/soft/src/softphone";
// // // import { Server as SocketIOServer } from "socket.io";
// // // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // // let softphone: Softphone | null = null;
// // // let io: SocketIOServer | null = null;

// // // export default async function handler(
// // //     req: NextApiRequest,
// // //     res: NextApiResponseServerIO
// // // ) {
// // //     console.log(`[SIP-HANDLER] Received ${req.method} request to ${req.url}`);
// // //     console.log("[SIP-HANDLER] Request body:", req.body);

// // //     if (!softphone) {
// // //         console.log("[SIP-HANDLER] Initializing Softphone...");
// // //         const sipInfo = {
// // //             username: process.env.SIP_INFO_USERNAME!,
// // //             password: process.env.SIP_INFO_PASSWORD!,
// // //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// // //             domain: process.env.SIP_INFO_DOMAIN!,
// // //         };
// // //         softphone = new Softphone(sipInfo);
// // //         await softphone.register();
// // //         console.log("[SIP-HANDLER] Softphone registered successfully");

// // //         softphone.on("callStarted", (callId) => {
// // //             console.log(`[SIP-HANDLER] Call answered with ID: ${callId}`);
// // //             io?.emit("callStarted", { callId });
// // //         });

// // //         softphone.on("callEnded", (callId) => {
// // //             console.log(`[SIP-HANDLER] Call ended with ID: ${callId}`);
// // //             io?.emit("callEnded", { callId });
// // //         });

// // //         softphone.on("audioData", (audioData: Buffer) => {
// // //             console.log(
// // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // //             );
// // //             io?.emit("audioData", audioData);
// // //         });
// // //     }

// // //     if (!io) {
// // //         console.log("[SIP-HANDLER] Initializing Socket.IO...");
// // //         io = new SocketIOServer(res.socket.server as any, {
// // //             path: "/api/llpmg/sip-ws",
// // //             addTrailingSlash: false,
// // //         });
// // //         res.socket.server.io = io;
// // //     }

// // //     if (req.method === "POST") {
// // //         const { action, callee } = req.body;
// // //         console.log(
// // //             `[SIP-HANDLER] Received action: ${action}, callee: ${callee}`
// // //         );

// // //         if (!action) {
// // //             console.error("[SIP-HANDLER] Missing action in request body");
// // //             return res.status(400).json({
// // //                 error: "[SIP-HANDLER] Missing action in request body",
// // //             });
// // //         }

// // //         switch (action) {
// // //             case "call":
// // //                 if (!callee) {
// // //                     console.error("[SIP-HANDLER] Missing callee number");
// // //                     return res
// // //                         .status(400)
// // //                         .json({ error: "[SIP-HANDLER] Missing callee number" });
// // //                 }
// // //                 try {
// // //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// // //                     const callSession = await softphone.call(callee);
// // //                     console.log(
// // //                         `[SIP-HANDLER] Call initiated with ID: ${callSession.callId}`
// // //                     );
// // //                     io?.emit("callInitiated", { callId: callSession.callId });
// // //                     res.status(200).json({ callId: callSession.callId });
// // //                 } catch (error) {
// // //                     console.error(
// // //                         "[SIP-HANDLER] Failed to initiate call:",
// // //                         error
// // //                     );
// // //                     res.status(500).json({
// // //                         error: "[SIP-HANDLER] Failed to initiate call",
// // //                         details: (error as Error).message,
// // //                     });
// // //                 }
// // //                 break;

// // //             case "hangup":
// // //                 try {
// // //                     console.log("[SIP-HANDLER] Hanging up call");
// // //                     await softphone.hangup();
// // //                     console.log("[SIP-HANDLER] Call hung up successfully");
// // //                     io?.emit("callEnded");
// // //                     res.status(200).json({ success: true });
// // //                 } catch (error) {
// // //                     console.error(
// // //                         "[SIP-HANDLER] Failed to hang up call:",
// // //                         error
// // //                     );
// // //                     res.status(500).json({
// // //                         error: "[SIP-HANDLER] Failed to hang up call",
// // //                     });
// // //                 }
// // //                 break;

// // //             case "answer":
// // //                 try {
// // //                     console.log("[SIP-HANDLER] Answering incoming call");
// // //                     if (!softphone.lastInviteMessage) {
// // //                         throw new Error(
// // //                             "[SIP-HANDLER] No incoming call to answer"
// // //                         );
// // //                     }
// // //                     const callSession = await softphone.answer(
// // //                         softphone.lastInviteMessage
// // //                     );
// // //                     console.log(
// // //                         `[SIP-HANDLER] Call answered with ID: ${callSession.callId}`
// // //                     );
// // //                     io?.emit("callStarted", { callId: callSession.callId });
// // //                     res.status(200).json({ callId: callSession.callId });
// // //                 } catch (error) {
// // //                     console.error(
// // //                         "[SIP-HANDLER] Failed to answer call:",
// // //                         error
// // //                     );
// // //                     res.status(500).json({
// // //                         error: "[SIP-HANDLER] Failed to answer call",
// // //                     });
// // //                 }
// // //                 break;

// // //             case "decline":
// // //                 try {
// // //                     console.log("[SIP-HANDLER] Declining incoming call");
// // //                     if (!softphone.lastInviteMessage) {
// // //                         throw new Error(
// // //                             "[SIP-HANDLER] No incoming call to decline"
// // //                         );
// // //                     }
// // //                     await softphone.decline(softphone.lastInviteMessage);
// // //                     console.log("[SIP-HANDLER] Call declined successfully");
// // //                     io?.emit("callEnded");
// // //                     res.status(200).json({ success: true });
// // //                 } catch (error) {
// // //                     console.error(
// // //                         "[SIP-HANDLER] Failed to decline call:",
// // //                         error
// // //                     );
// // //                     res.status(500).json({
// // //                         error: "[SIP-HANDLER] Failed to decline call",
// // //                     });
// // //                 }
// // //                 break;

// // //             default:
// // //                 console.error("[SIP-HANDLER] Invalid action:", action);
// // //                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
// // //         }
// // //     } else if (req.method === "PUT") {
// // //         try {
// // //             const audioData = await getRawBody(req);
// // //             console.log(
// // //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// // //             );
// // //             await softphone.sendAudio(audioData);
// // //             res.status(200).json({ success: true });
// // //         } catch (error) {
// // //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// // //             res.status(500).json({
// // //                 error: "[SIP-HANDLER] Failed to process audio data",
// // //             });
// // //         }
// // //     } else {
// // //         console.error("[SIP-HANDLER] Method not allowed:", req.method);
// // //         res.setHeader("Allow", ["POST", "PUT"]);
// // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // //     }
// // // }

// // // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// // //     return new Promise((resolve, reject) => {
// // //         const chunks: Buffer[] = [];
// // //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// // //         req.on("end", () => resolve(Buffer.concat(chunks)));
// // //         req.on("error", reject);
// // //     });
// // // }

// // // 24
// // import { NextApiRequest, NextApiResponse } from "next";
// // import Softphone from "@/ref/soft/src/softphone";
// // import { Server as SocketIOServer } from "socket.io";
// // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // let softphone: Softphone | null = null;
// // let io: SocketIOServer | null = null;

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponseServerIO
// // ) {
// //     console.log(`[SIP-HANDLER] Received ${req.method} request to ${req.url}`);
// //     console.log("[SIP-HANDLER] Request body:", req.body);

// //     if (!softphone) {
// //         console.log("[SIP-HANDLER] Initializing Softphone...");
// //         const sipInfo = {
// //             username: process.env.SIP_INFO_USERNAME!,
// //             password: process.env.SIP_INFO_PASSWORD!,
// //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// //             domain: process.env.SIP_INFO_DOMAIN!,
// //         };
// //         softphone = new Softphone(sipInfo);
// //         softphone.setMaxListeners(20); // Increase listener limit
// //         await softphone.register();
// //         console.log("[SIP-HANDLER] Softphone registered successfully");

// //         softphone.on("callStarted", (callId) => {
// //             console.log(`[SIP-HANDLER] Call answered with ID: ${callId}`);
// //             io?.emit("callStarted", { callId });
// //         });

// //         softphone.on("callEnded", (callId) => {
// //             console.log(`[SIP-HANDLER] Call ended with ID: ${callId}`);
// //             io?.emit("callEnded", { callId });
// //         });

// //         softphone.on("audioData", (audioData: Buffer) => {
// //             console.log(
// //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// //             );
// //             io?.emit("audioData", audioData);
// //         });
// //     }

// //     if (!io) {
// //         console.log("[SIP-HANDLER] Initializing Socket.IO...");
// //         io = new SocketIOServer(res.socket.server as any, {
// //             path: "/api/llpmg/sip-ws",
// //             addTrailingSlash: false,
// //         });
// //         res.socket.server.io = io;
// //     }

// //     if (req.method === "POST") {
// //         const { action, callee } = req.body;
// //         console.log(
// //             `[SIP-HANDLER] Received action: ${action}, callee: ${callee}`
// //         );

// //         if (!action) {
// //             console.error("[SIP-HANDLER] Missing action in request body");
// //             return res.status(400).json({
// //                 error: "[SIP-HANDLER] Missing action in request body",
// //             });
// //         }

// //         switch (action) {
// //             case "call":
// //                 if (!callee) {
// //                     console.error("[SIP-HANDLER] Missing callee number");
// //                     return res
// //                         .status(400)
// //                         .json({ error: "[SIP-HANDLER] Missing callee number" });
// //                 }
// //                 try {
// //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// //                     const callSession = await softphone.call(callee);
// //                     console.log(
// //                         `[SIP-HANDLER] Call initiated with ID: ${callSession.callId}`
// //                     );
// //                     io?.emit("callInitiated", { callId: callSession.callId });
// //                     res.status(200).json({ callId: callSession.callId });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to initiate call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to initiate call",
// //                         details: (error as Error).message,
// //                     });
// //                 }
// //                 break;

// //             case "hangup":
// //                 try {
// //                     console.log("[SIP-HANDLER] Hanging up call");
// //                     await softphone.hangup();
// //                     console.log("[SIP-HANDLER] Call hung up successfully");
// //                     io?.emit("callEnded");
// //                     res.status(200).json({ success: true });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to hang up call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to hang up call",
// //                     });
// //                 }
// //                 break;

// //             case "answer":
// //                 try {
// //                     console.log("[SIP-HANDLER] Answering incoming call");
// //                     if (!softphone.lastInviteMessage) {
// //                         throw new Error(
// //                             "[SIP-HANDLER] No incoming call to answer"
// //                         );
// //                     }
// //                     const callSession = await softphone.answer(
// //                         softphone.lastInviteMessage
// //                     );
// //                     console.log(
// //                         `[SIP-HANDLER] Call answered with ID: ${callSession.callId}`
// //                     );
// //                     io?.emit("callStarted", { callId: callSession.callId });
// //                     res.status(200).json({ callId: callSession.callId });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to answer call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to answer call",
// //                     });
// //                 }
// //                 break;

// //             case "decline":
// //                 try {
// //                     console.log("[SIP-HANDLER] Declining incoming call");
// //                     if (!softphone.lastInviteMessage) {
// //                         throw new Error(
// //                             "[SIP-HANDLER] No incoming call to decline"
// //                         );
// //                     }
// //                     await softphone.decline(softphone.lastInviteMessage);
// //                     console.log("[SIP-HANDLER] Call declined successfully");
// //                     io?.emit("callEnded");
// //                     res.status(200).json({ success: true });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to decline call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to decline call",
// //                     });
// //                 }
// //                 break;

// //             default:
// //                 console.error("[SIP-HANDLER] Invalid action:", action);
// //                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
// //         }
// //     } else if (req.method === "PUT") {
// //         try {
// //             const audioData = await getRawBody(req);
// //             console.log(
// //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// //             );
// //             await softphone.sendAudio(audioData);
// //             res.status(200).json({ success: true });
// //         } catch (error) {
// //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// //             res.status(500).json({
// //                 error: "[SIP-HANDLER] Failed to process audio data",
// //             });
// //         }
// //     } else {
// //         console.error("[SIP-HANDLER] Method not allowed:", req.method);
// //         res.setHeader("Allow", ["POST", "PUT"]);
// //         res.status(405).end(`Method ${req.method} Not Allowed`);
// //     }
// // }

// // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// //     return new Promise((resolve, reject) => {
// //         const chunks: Buffer[] = [];
// //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// //         req.on("end", () => resolve(Buffer.concat(chunks)));
// //         req.on("error", reject);
// //     });
// // }

// // 25 ----------------
// // import { NextApiRequest, NextApiResponse } from "next";
// // import Softphone from "@/ref/soft/src/softphone";
// // import { Server as SocketIOServer } from "socket.io";
// // import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";

// // let softphone: Softphone | null = null;
// // let io: SocketIOServer | null = null;

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponseServerIO
// // ) {
// //     console.log(`[SIP-HANDLER] Received ${req.method} request to ${req.url}`);
// //     console.log("[SIP-HANDLER] Request body:", req.body);

// //     if (!softphone) {
// //         console.log("[SIP-HANDLER] Initializing Softphone...");
// //         const sipInfo = {
// //             username: process.env.SIP_INFO_USERNAME!,
// //             password: process.env.SIP_INFO_PASSWORD!,
// //             authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
// //             domain: process.env.SIP_INFO_DOMAIN!,
// //         };
// //         softphone = new Softphone(sipInfo);
// //         await softphone.register();
// //         console.log("[SIP-HANDLER] Softphone registered successfully");

// //         softphone.on("callStarted", (callId) => {
// //             console.log(`[SIP-HANDLER] Call answered with ID: ${callId}`);
// //             io?.emit("callStarted", { callId });
// //         });

// //         softphone.on("callEnded", (callId) => {
// //             console.log(`[SIP-HANDLER] Call ended with ID: ${callId}`);
// //             io?.emit("callEnded", { callId });
// //         });

// //         softphone.on("audioData", (audioData: Buffer) => {
// //             console.log(
// //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// //             );
// //             io?.emit("audioData", audioData);
// //         });
// //     }

// //     if (!io) {
// //         console.log("[SIP-HANDLER] Initializing Socket.IO...");
// //         io = new SocketIOServer(res.socket.server as any, {
// //             path: "/api/llpmg/sip-ws",
// //             addTrailingSlash: false,
// //         });
// //         res.socket.server.io = io;
// //     }

// //     if (req.method === "POST") {
// //         const { action, callee } = req.body;
// //         console.log(
// //             `[SIP-HANDLER] Received action: ${action}, callee: ${callee}`
// //         );

// //         if (!action) {
// //             console.error("[SIP-HANDLER] Missing action in request body");
// //             return res.status(400).json({
// //                 error: "[SIP-HANDLER] Missing action in request body",
// //             });
// //         }

// //         switch (action) {
// //             case "call":
// //                 if (!callee) {
// //                     console.error("[SIP-HANDLER] Missing callee number");
// //                     return res
// //                         .status(400)
// //                         .json({ error: "[SIP-HANDLER] Missing callee number" });
// //                 }
// //                 try {
// //                     console.log(`[SIP-HANDLER] Initiating call to ${callee}`);
// //                     const callSession = await softphone.call(callee);
// //                     console.log(
// //                         `[SIP-HANDLER] Call initiated with ID: ${callSession.callId}`
// //                     );
// //                     io?.emit("callInitiated", { callId: callSession.callId });
// //                     res.status(200).json({ callId: callSession.callId });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to initiate call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to initiate call",
// //                         details: (error as Error).message,
// //                     });
// //                 }
// //                 break;

// //             case "hangup":
// //                 try {
// //                     console.log("[SIP-HANDLER] Hanging up call");
// //                     await softphone.hangup();
// //                     console.log("[SIP-HANDLER] Call hung up successfully");
// //                     io?.emit("callEnded");
// //                     res.status(200).json({ success: true });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to hang up call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to hang up call",
// //                     });
// //                 }
// //                 break;

// //             case "answer":
// //                 try {
// //                     console.log("[SIP-HANDLER] Answering incoming call");
// //                     if (!softphone.lastInviteMessage) {
// //                         throw new Error(
// //                             "[SIP-HANDLER] No incoming call to answer"
// //                         );
// //                     }
// //                     const callSession = await softphone.answer(
// //                         softphone.lastInviteMessage
// //                     );
// //                     console.log(
// //                         `[SIP-HANDLER] Call answered with ID: ${callSession.callId}`
// //                     );
// //                     io?.emit("callStarted", { callId: callSession.callId });
// //                     res.status(200).json({ callId: callSession.callId });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to answer call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to answer call",
// //                     });
// //                 }
// //                 break;

// //             case "decline":
// //                 try {
// //                     console.log("[SIP-HANDLER] Declining incoming call");
// //                     if (!softphone.lastInviteMessage) {
// //                         throw new Error(
// //                             "[SIP-HANDLER] No incoming call to decline"
// //                         );
// //                     }
// //                     await softphone.decline(softphone.lastInviteMessage);
// //                     console.log("[SIP-HANDLER] Call declined successfully");
// //                     io?.emit("callEnded");
// //                     res.status(200).json({ success: true });
// //                 } catch (error) {
// //                     console.error(
// //                         "[SIP-HANDLER] Failed to decline call:",
// //                         error
// //                     );
// //                     res.status(500).json({
// //                         error: "[SIP-HANDLER] Failed to decline call",
// //                     });
// //                 }
// //                 break;

// //             default:
// //                 console.error("[SIP-HANDLER] Invalid action:", action);
// //                 res.status(400).json({ error: "[SIP-HANDLER] Invalid action" });
// //         }
// //     } else if (req.method === "PUT") {
// //         try {
// //             const audioData = await getRawBody(req);
// //             console.log(
// //                 `[SIP-HANDLER] Received audio data, size: ${audioData.length} bytes`
// //             );
// //             await softphone.sendAudio(audioData);
// //             res.status(200).json({ success: true });
// //         } catch (error) {
// //             console.error("[SIP-HANDLER] Failed to process audio data:", error);
// //             res.status(500).json({
// //                 error: "[SIP-HANDLER] Failed to process audio data",
// //             });
// //         }
// //     } else {
// //         console.error("[SIP-HANDLER] Method not allowed:", req.method);
// //         res.setHeader("Allow", ["POST", "PUT"]);
// //         res.status(405).end(`Method ${req.method} Not Allowed`);
// //     }
// // }

// // async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// //     return new Promise((resolve, reject) => {
// //         const chunks: Buffer[] = [];
// //         req.on("data", (chunk: Buffer) => chunks.push(chunk));
// //         req.on("end", () => resolve(Buffer.concat(chunks)));
// //         req.on("error", reject);
// //     });
// // }
// // ---------------------

// 2.9
// Updated sip-handler.ts to stop processing after hangup

// import { NextApiRequest, NextApiResponse } from "next";
// import Softphone from "@/ref/soft/src/softphone";
// import { Server as SocketIOServer } from "socket.io";
// import { NextApiResponseServerIO } from "@/types/llpmg/nextsocket";
// import fs from "fs";
// import path from "path";

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
//             console.error(
//                 "[SIP-HANDLER] No active call session to process audio data"
//             );
//             return res.status(400).json({ error: "No active call session" });
//         }

//         try {
//             const audioData = await getRawBody(req);

//             // Log the received audio data details
//             console.log(
//                 `[SIP-HANDLER] Received audio data: ${audioData.byteLength} bytes`
//             );
//             console.log(
//                 `[SIP-HANDLER] Audio data content: ${audioData.toString("hex").slice(0, 100)}...`
//             ); // Logging the first 100 characters in hex

//             if (softphone.currentCallSession) {
//                 await softphone.currentCallSession.sendAudio(audioData);
//             } else {
//                 console.warn(
//                     "[SIP-HANDLER] No active call session, stopping audio handling"
//                 );
//             }

//             res.status(200).json({ success: true });
//         } catch (error) {
//             console.error(
//                 `[SIP-HANDLER] Failed to process audio data: ${(error as Error).message}`
//             );
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
//         console.log(
//             `[SIP-HANDLER] Forwarding audio data: ${audioData.byteLength} bytes`
//         );
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
//                     console.log(
//                         `[SIP-HANDLER] Audio data received from client: ${audioData.byteLength} bytes`
//                     );
//                     softphone.currentCallSession.sendAudio(
//                         Buffer.from(audioData)
//                     );
//                 } else {
//                     console.error(
//                         "[SIP-HANDLER] No active call session to send audio data"
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

// 2.9
