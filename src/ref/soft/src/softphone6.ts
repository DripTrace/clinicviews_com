// // hangups are now working
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;

// // attempt 2
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public saveAudioAsOgg(callId: string) {
// //         const rawAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         const oggAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .ogg format`);
// //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// //             ffmpeg.on("close", (code) => {
// //                 if (code === 0) {
// //                     console.log(
// //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                     );
// //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Failed to convert audio log to .ogg format`
// //                     );
// //                 }
// //             });
// //         } else {
// //             console.error(
// //                 `[Softphone] No raw audio log found for CallID: ${callId}`
// //             );
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// //-------------------

// // -------------- latest claude
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";
// // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "/src/data/llpmg/calls"
// //     );
// //     private audioStream: fs.WriteStream | null = null;
// //     private audioPackets: Buffer[] = [];

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         this.startRecording(inboundCallSession.callId);
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             this.startRecording(outboundCallSession.callId);
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Ending call and initiating audio conversion");
// //             await this.currentCallSession.endCall();
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public startRecording(callId: string) {
// //         const rawAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         console.log(
// //             `[Softphone] Creating raw audio log file at ${rawAudioPath}`
// //         );
// //         this.audioStream = fs.createWriteStream(rawAudioPath);
// //     }

// //     private finalizeRecording(callId: string) {
// //         if (this.audioStream) {
// //             this.audioStream.end(() => {
// //                 console.log(
// //                     `[Softphone] Finished recording audio for call ID: ${callId}`
// //                 );
// //                 const rawAudioPath = path.join(
// //                     this.audioLogFolder,
// //                     `audio_log_${callId}.raw`
// //                 );
// //                 this.convertToOgg(rawAudioPath, callId);
// //             });
// //         } else {
// //             console.warn(
// //                 `[Softphone] No active audio stream to finalize for call ID: ${callId}`
// //             );
// //         }
// //     }

// //     public async convertToOgg(rawAudioPath: string, callId: string) {
// //         console.log(`[Softphone] Starting conversion for call ID: ${callId}`);
// //         console.log(`[Softphone] Raw audio path: ${rawAudioPath}`);

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Raw audio file exists`);
// //             const stats = fs.statSync(rawAudioPath);
// //             console.log(`[Softphone] Raw audio file size: ${stats.size} bytes`);

// //             const date =
// //                 new Date().toISOString().replace(/:/g, "-").split(".")[0] + "Z";
// //             const oggAudioPath = path.join(
// //                 this.audioLogFolder,
// //                 `audio_log_${callId}_${date}.ogg`
// //             );
// //             console.log(`[Softphone] Target Ogg audio path: ${oggAudioPath}`);

// //             const rawAudioData = fs.readFileSync(rawAudioPath);
// //             console.log(
// //                 `[Softphone] Raw audio data size: ${rawAudioData.length} bytes`
// //             );

// //             const encoder = new OggVorbisEncoder(rawAudioData, 48000, 2);

// //             try {
// //                 console.log(`[Softphone] Starting Ogg conversion`);
// //                 await encoder.saveToFile(oggAudioPath);
// //                 console.log(`[Softphone] Ogg conversion completed`);

// //                 if (fs.existsSync(oggAudioPath)) {
// //                     const oggStats = fs.statSync(oggAudioPath);
// //                     console.log(
// //                         `[Softphone] Ogg file created successfully. Size: ${oggStats.size} bytes`
// //                     );
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Ogg file was not created at ${oggAudioPath}`
// //                     );
// //                 }

// //                 console.log(`[Softphone] Removing raw audio file`);
// //                 fs.unlinkSync(rawAudioPath);
// //                 console.log(`[Softphone] Raw audio file removed`);
// //             } catch (error) {
// //                 console.error(`[Softphone] Error converting audio log:`, error);
// //                 if (error instanceof Error) {
// //                     console.error(`[Softphone] Error name: ${error.name}`);
// //                     console.error(
// //                         `[Softphone] Error message: ${error.message}`
// //                     );
// //                     console.error(`[Softphone] Error stack: ${error.stack}`);
// //                 }
// //             }
// //         } else {
// //             console.error(
// //                 `[Softphone] No raw audio log found for conversion: ${rawAudioPath}`
// //             );
// //         }

// //         console.log(
// //             `[Softphone] Conversion process completed for call ID: ${callId}`
// //         );
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         // const audioLogPath = path.join(
// //         //     this.audioLogFolder,
// //         //     `audio_log_${callId}.ogg`
// //         // );
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording(callId); // Pass the callId here
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         } else {
// //             console.log("No active call to hang up remotely");
// //         }
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             if (this.audioStream) {
// //                 this.audioStream.write(audioData);
// //             }
// //             await this.currentCallSession.sendAudio(audioData);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public saveAudioAsOgg(rawAudioPath: string) {
// //         console.log("saveAudioAsOgg() method invoked");

// //         if (rawAudioPath) {
// //             console.log("Raw audio path is valid");

// //             const date = new Date().toISOString().replace(/[:.]/g, "-");
// //             const callId = path.basename(rawAudioPath, ".raw");
// //             const oggAudioPath = path.join(
// //                 path.dirname(rawAudioPath),
// //                 `audio_log_${callId}_${date}.ogg`
// //             );

// //             console.log(`Raw audio path: ${rawAudioPath}`);
// //             console.log(`Ogg audio path: ${oggAudioPath}`);

// //             if (fs.existsSync(rawAudioPath)) {
// //                 console.log(
// //                     "Raw audio file exists, proceeding with conversion"
// //                 );

// //                 const rawAudioData = fs.readFileSync(rawAudioPath);

// //                 const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);
// //                 encoder.saveToFile(oggAudioPath);

// //                 console.log(
// //                     `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                 );
// //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //             } else {
// //                 console.error(
// //                     `[Softphone] No raw audio log found for conversion`
// //                 );
// //             }
// //         } else {
// //             console.error("Raw audio path is null. Cannot convert audio log.");
// //         }
// //     }

// //     public endCall() {
// //         if (this.audioStream) {
// //             console.log("Ending call and finishing audio stream");
// //             this.audioStream.end();
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// // -------------------------------- latest claude

// // looking for audio logging
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// // looking for audio logging

// // looking for audio logging 0 (recording and capturing from browser)
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public saveAudioAsOgg(callId: string) {
// //         const rawAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         const oggAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .ogg format`);
// //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// //             ffmpeg.on("close", (code) => {
// //                 if (code === 0) {
// //                     console.log(
// //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                     );
// //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Failed to convert audio log to .ogg format`
// //                     );
// //                 }
// //             });
// //         } else {
// //             console.error(
// //                 `[Softphone] No raw audio log found for CallID: ${callId}`
// //             );
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// // looking for audio logging 0 (recording and capturing from browser)

// // saving audio (logs exist but error)
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );
// //     private audioStream!: fs.WriteStream;

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         this.startRecording(inboundCallSession.callId);
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             this.startRecording(outboundCallSession.callId);
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     private startRecording(callId: string) {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         this.audioStream = fs.createWriteStream(audioLogPath);
// //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// //     }

// //     private finalizeRecording() {
// //         if (this.audioStream) {
// //             this.audioStream.end(() => {
// //                 console.log(`[Softphone] Finished recording audio`);
// //                 this.saveAudioAsOgg();
// //             });
// //         } else {
// //             console.warn(`[Softphone] No active audio stream to finalize`);
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //             this.audioStream.write(buffer);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public saveAudioAsOgg() {
// //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .ogg format`);
// //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// //             ffmpeg.on("close", (code) => {
// //                 if (code === 0) {
// //                     console.log(
// //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                     );
// //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Failed to convert audio log to .ogg format`
// //                     );
// //                 }
// //             });
// //         } else {
// //             console.error(`[Softphone] No raw audio log found for conversion`);
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// // saving audio (logs exist but error)

// // cleaning logs
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";
// // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "../../../../src/data/llpmg/calls"
// //     );
// //     private audioStream: fs.WriteStream | null = null;
// //     private getRootPath(): string {
// //         return process.cwd(); // This will point to the directory where package.json is located
// //     }

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(`
// //                 REGISTER sip:${this.sipInfo.domain} SIP/2.0,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: <sip:${this.fakeEmail};transport=tcp>;expires=600,
// //                     From: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()},
// //                     To: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>,
// //                     Via: SIP/2.0/TCP ${this.fakeDomain};branch=${branch()},
// //                 }`);
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n + message.toString()`)
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n + message`);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         this.startRecording(inboundCallSession.callId);
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv`.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `
// //             INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: <sip:${this.fakeEmail};transport=tcp>;expires=600,
// //                 From: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()},
// //                 To: <sip:${callee}@${this.sipInfo.domain}>,
// //                 Via: SIP/2.0/TCP ${this.fakeDomain};branch=${branch()},
// //                 "Content-Type": "application/sdp",
// //             }`,
// //             offerSDP
// //         );
// //         console.log(`
// //             [Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`);

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] = `
// //                 sip:${callerId}@${this.sipInfo.domain};`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `
// //                 [Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `
// //                         [Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `
// //                             [Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `
// //                             [Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             this.startRecording(outboundCallSession.callId);
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(`
// //                         Unexpected response: ${inboundMessage.subject}`);
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording(callId); // Pass the callId here
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         // const audioLogPath = path.join(
// //         //     this.audioLogFolder,
// //         //     audio_log_${callId}.ogg
// //         // );
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `
// //             audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(`
// //                 [Softphone] Retrieved audio log for CallID: ${callId}`);
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(`
// //                 [Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`);
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording(callId); // Pass the callId here
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         } else {
// //             console.log("No active call to hang up remotely");
// //         }
// //     }

// //     public saveAudioAsOgg(rawAudioPath: string) {
// //         console.log("saveAudioAsOgg() method invoked");

// //         if (rawAudioPath) {
// //             console.log("Raw audio path is valid");

// //             const date = new Date().toISOString().replace(/[:.]/g, "-");
// //             const callId = path.basename(rawAudioPath, ".raw");
// //             const oggAudioPath = path.join(
// //                 path.dirname(rawAudioPath),
// //                 `
// //                 audio_log_${callId}_${date}.ogg`
// //             );

// //             console.log(`Raw audio path: ${rawAudioPath}`);
// //             console.log(`Ogg audio path: ${oggAudioPath}`);

// //             if (fs.existsSync(rawAudioPath)) {
// //                 console.log(
// //                     "Raw audio file exists, proceeding with conversion"
// //                 );

// //                 const rawAudioData = fs.readFileSync(rawAudioPath);

// //                 const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);
// //                 encoder.saveToFile(oggAudioPath);

// //                 console.log(`
// //                     [Softphone] Audio log successfully converted to ${oggAudioPath}`);
// //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //             } else {
// //                 console.error(`
// //                     [Softphone] No raw audio log found for conversion`);
// //             }
// //         } else {
// //             console.error("Raw audio path is null. Cannot convert audio log.");
// //         }
// //     }

// //     public endCall() {
// //         if (this.audioStream) {
// //             console.log("Ending call and finishing audio stream");
// //             this.audioStream.end();
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }

// //     public startRecording(callId: string) {
// //         const rawAudioPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         console.log(
// //             `[Softphone] Creating raw audio log file at ${rawAudioPath}`
// //         );
// //         this.audioStream = fs.createWriteStream(rawAudioPath);
// //     }

// //     private finalizeRecording(callId: string) {
// //         if (this.audioStream) {
// //             this.audioStream.end(() => {
// //                 console.log(
// //                     `[Softphone] Finished recording audio for call ID: ${callId}`
// //                 );
// //                 const rawAudioPath = path.join(
// //                     this.audioLogFolder,
// //                     `audio_log_${callId}.raw`
// //                 );
// //                 this.convertToOgg(rawAudioPath, callId);
// //             });
// //         } else {
// //             console.warn(
// //                 `[Softphone] No active audio stream to finalize for call ID: ${callId}`
// //             );
// //         }
// //     }

// //     private async convertToOgg(rawAudioPath: string, callId: string) {
// //         if (fs.existsSync(rawAudioPath)) {
// //             const date =
// //                 new Date().toISOString().replace(/:/g, "-").split(".")[0] + "Z";
// //             const oggAudioPath = path.join(
// //                 this.audioLogFolder,
// //                 `audio_log_${callId}_${date}.ogg`
// //             );
// //             console.log(
// //                 `[Softphone] Converting audio log to .ogg format: ${oggAudioPath}`
// //             );

// //             const rawAudioData = fs.readFileSync(rawAudioPath);
// //             const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);

// //             try {
// //                 await encoder.saveToFile(oggAudioPath);
// //                 console.log(
// //                     `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                 );
// //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //             } catch (error) {
// //                 console.error(
// //                     `[Softphone] Error converting audio log: ${error}`
// //                 );
// //             }
// //         } else {
// //             console.error(
// //                 `[Softphone] No raw audio log found for conversion: ${rawAudioPath}`
// //             );
// //         }
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             if (this.audioStream) {
// //                 this.audioStream.write(audioData);
// //             }
// //             await this.currentCallSession.sendAudio(audioData);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }
// // }

// // export default Softphone;
// // cleaning logs

// // sonnet-3.5 1st attempt
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { OutboundMessage } from "./sip-message";
// // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // import InboundCallSession from "./call-session/inbound";
// // import OutboundCallSession from "./call-session/outbound";
// // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // import type { Server as HttpServer } from "http";
// // import path from "path";
// // import { spawn } from "child_process";

// // class Softphone extends EventEmitter {
// //     private webSocketServer: WebSocket.Server | null = null;
// //     public sipInfo: SipInfoResponse;
// //     public client: net.Socket;
// //     public fakeDomain: string;
// //     public fakeEmail: string;
// //     public lastInviteMessage?: InboundMessage;
// //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// //     public socket!: dgram.Socket;
// //     public packetsReceived: number = 0;
// //     public bytesReceived: number = 0;
// //     private intervalHandle: NodeJS.Timeout | null = null;
// //     private connected = false;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "src/data/llpmg/calls"
// //     );
// //     private audioStream!: fs.WriteStream;

// //     constructor(sipInfo: SipInfoResponse) {
// //         super();
// //         this.sipInfo = sipInfo;
// //         this.fakeDomain = uuid() + ".invalid";
// //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// //         if (!this.sipInfo.domain) {
// //             this.sipInfo.domain = "sip.ringcentral.com";
// //         }
// //         if (!this.sipInfo.outboundProxy) {
// //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// //         }

// //         this.client = new net.Socket();
// //         const tokens = this.sipInfo.outboundProxy.split(":");
// //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// //             this.connected = true;
// //             console.log("SIP client connected");
// //         });

// //         let cache = "";
// //         this.client.on("data", (data) => {
// //             cache += data.toString("utf-8");
// //             if (!cache.endsWith("\r\n")) {
// //                 return;
// //             }

// //             const tempMessages = cache
// //                 .split("\r\nContent-Length: 0\r\n\r\n")
// //                 .filter((message) => message.trim() !== "");
// //             cache = "";
// //             for (let i = 0; i < tempMessages.length; i++) {
// //                 if (!tempMessages[i].includes("Content-Length: ")) {
// //                     tempMessages[i] += "\r\nContent-Length: 0";
// //                 }
// //             }
// //             for (const message of tempMessages) {
// //                 const inboundMsg = InboundMessage.fromString(message);
// //                 if (inboundMsg) {
// //                     console.log("Received SIP message:", inboundMsg.subject);
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("WebSocket client connected");

// //             ws.on("message", (message: WebSocket.RawData) => {
// //                 const data = JSON.parse(message.toString());
// //                 if (
// //                     data.type === "join" &&
// //                     data.callId &&
// //                     this.currentCallSession
// //                 ) {
// //                     if (this.currentCallSession.callId === data.callId) {
// //                         this.currentCallSession.setWebSocket(ws);
// //                     }
// //                 }
// //             });

// //             ws.on("close", () => {
// //                 console.log("WebSocket client disconnected");
// //             });
// //         });
// //     }

// //     public async register() {
// //         if (!this.connected) {
// //             await waitFor({ interval: 100, condition: () => this.connected });
// //         }
// //         const sipRegister = async () => {
// //             const requestMessage = new RequestMessage(
// //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// //                 {
// //                     "Call-Id": uuid(),
// //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 }
// //             );
// //             const inboundMessage = await this.send(requestMessage, true);
// //             if (
// //                 inboundMessage &&
// //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// //             ) {
// //                 console.log("SIP registration successful");
// //                 return;
// //             }
// //             const wwwAuth =
// //                 inboundMessage?.headers["Www-Authenticate"] ||
// //                 inboundMessage?.headers["WWW-Authenticate"];
// //             if (wwwAuth) {
// //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// //                 if (nonce) {
// //                     const newMessage = requestMessage.fork();
// //                     newMessage.headers.Authorization = generateAuthorization(
// //                         this.sipInfo,
// //                         nonce,
// //                         "REGISTER"
// //                     );
// //                     await this.send(newMessage);
// //                     console.log(
// //                         "SIP registration with authentication successful"
// //                     );
// //                 }
// //             }
// //         };
// //         await sipRegister();
// //         this.intervalHandle = setInterval(
// //             () => {
// //                 sipRegister();
// //             },
// //             3 * 60 * 1000
// //         );
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`Sending...(${new Date()})\n` + message);
// //             return tcpWrite(message);
// //         };
// //     }

// //     public revoke() {
// //         if (this.intervalHandle) {
// //             clearInterval(this.intervalHandle);
// //         }
// //         this.removeAllListeners();
// //         this.client.removeAllListeners();
// //         this.client.destroy();
// //         console.log("SIP client revoked");
// //     }

// //     public send(message: OutboundMessage, waitForReply = false) {
// //         this.client.write(message.toString());
// //         if (!waitForReply) {
// //             return Promise.resolve(undefined);
// //         }
// //         return new Promise<InboundMessage>((resolve, reject) => {
// //             const messageListener = (inboundMessage: InboundMessage) => {
// //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// //                     return;
// //                 }
// //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// //                     return;
// //                 }
// //                 this.off("message", messageListener);
// //                 resolve(inboundMessage);
// //             };
// //             this.on("message", messageListener);
// //             setTimeout(
// //                 () => reject(new Error("No response received in time")),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         this.startRecording(inboundCallSession.callId);
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("Declining incoming call");
// //         const newMessage = new ResponseMessage(inviteMessage, 603);
// //         await this.send(newMessage);
// //     }

// //     public async call(callee: number, callerId?: number) {
// //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// //         const offerSDP = `
// // v=0
// // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // s=rc-softphone-ts
// // c=IN IP4 127.0.0.1
// // t=0 0
// // m=audio ${randomInt()} RTP/AVP 0 101
// // a=rtpmap:0 PCMU/8000
// // a=rtpmap:101 telephone-event/8000
// // a=fmtp:101 0-15
// // a=sendrecv
// //   `.trim();
// //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// //         const inviteMessage = new RequestMessage(
// //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": uuid(),
// //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// //                 "Content-Type": "application/sdp",
// //             },
// //             offerSDP
// //         );
// //         console.log(
// //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// //         );

// //         if (callerId) {
// //             inviteMessage.headers["P-Asserted-Identity"] =
// //                 `sip:${callerId}@${this.sipInfo.domain}`;
// //         }

// //         try {
// //             console.log(`[Softphone] Sending initial INVITE message`);
// //             const inboundMessage = await this.send(inviteMessage, true);
// //             console.log(
// //                 `[Softphone] Received response to INVITE:`,
// //                 inboundMessage
// //             );

// //             if (inboundMessage) {
// //                 const proxyAuthenticate =
// //                     inboundMessage.headers["Proxy-Authenticate"] ||
// //                     inboundMessage.headers["proxy-authenticate"];
// //                 if (proxyAuthenticate) {
// //                     console.log(`[Softphone] Proxy authentication required`);
// //                     console.log(
// //                         `[Softphone] Proxy-Authenticate header:`,
// //                         proxyAuthenticate
// //                     );

// //                     const nonceMatch =
// //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// //                     if (nonce) {
// //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// //                         const newMessage = inviteMessage.fork();
// //                         newMessage.headers["Proxy-Authorization"] =
// //                             generateAuthorization(
// //                                 this.sipInfo,
// //                                 nonce,
// //                                 "INVITE"
// //                             );
// //                         console.log(
// //                             `[Softphone] Sending authenticated INVITE:`,
// //                             newMessage
// //                         );
// //                         const progressMessage = await this.send(
// //                             newMessage,
// //                             true
// //                         );
// //                         console.log(
// //                             `[Softphone] Received response to authenticated INVITE:`,
// //                             progressMessage
// //                         );

// //                         if (progressMessage) {
// //                             const outboundCallSession = new OutboundCallSession(
// //                                 this,
// //                                 progressMessage
// //                             );
// //                             this.currentCallSession = outboundCallSession;
// //                             this.startRecording(outboundCallSession.callId);
// //                             return outboundCallSession;
// //                         } else {
// //                             throw new Error(
// //                                 "No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// //                 } else {
// //                     throw new Error(
// //                         `Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error("No response received for initial INVITE");
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log("Call ended, emitted callEnded event");
// //         } else {
// //             console.log("No active call to hang up");
// //         }
// //     }

// //     private startRecording(callId: string) {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.raw`
// //         );
// //         this.audioStream = fs.createWriteStream(audioLogPath);
// //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// //     }

// //     private finalizeRecording() {
// //         if (this.audioStream) {
// //             this.audioStream.end(() => {
// //                 console.log(`[Softphone] Finished recording audio`);
// //                 this.saveAudioAsOgg();
// //             });
// //         } else {
// //             console.warn(`[Softphone] No active audio stream to finalize`);
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.ogg`
// //         );
// //         if (fs.existsSync(audioLogPath)) {
// //             console.log(
// //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// //             );
// //             return fs.readFileSync(audioLogPath);
// //         }
// //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// //         return null;
// //     }

// //     public playAudioLog(callId: string): void {
// //         const audioData = this.getAudioLog(callId);
// //         if (audioData) {
// //             console.log(
// //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// //             );
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession) {
// //             console.log("Remote hangup detected");
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log("Emitting callEnded event after remote hangup");
// //         }
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// //             );
// //             await this.currentCallSession.sendAudio(audioData);
// //             this.audioStream.write(audioData);
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(
// //             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// //         );
// //         this.emit("audioData", packet.payload);
// //         this.audioStream.write(packet.payload);
// //     }

// //     public saveAudioAsOgg() {
// //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .ogg format`);
// //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// //             ffmpeg.on("close", (code) => {
// //                 if (code === 0) {
// //                     console.log(
// //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                     );
// //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Failed to convert audio log to .ogg format`
// //                     );
// //                 }
// //             });
// //         } else {
// //             console.error(`[Softphone] No raw audio log found for conversion`);
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId
// //         ) {
// //             return {
// //                 duration: Date.now() - this.currentCallSession.startTime,
// //                 bytesReceived: this.currentCallSession.bytesReceived,
// //                 bytesSent: this.currentCallSession.bytesSent,
// //                 packetsReceived: this.currentCallSession.packetsReceived,
// //                 packetsSent: this.currentCallSession.packetsSent,
// //             };
// //         }
// //         return null;
// //     }
// // }

// // export default Softphone;
// // sonnet-3.5 1st attempt

// // sonnet-3.5 2nd attempt
// import EventEmitter from "events";
// import net from "net";
// import waitFor from "wait-for-async";
// import * as fs from "fs";
// import WebSocket from "ws";
// import dgram from "dgram";
// import { RtpHeader, RtpPacket } from "werift-rtp";
// import type { OutboundMessage } from "./sip-message";
// import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// import InboundCallSession from "./call-session/inbound";
// import OutboundCallSession from "./call-session/outbound";
// import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// import type { Server as HttpServer } from "http";
// import path from "path";
// import { spawn } from "child_process";

// class Softphone extends EventEmitter {
//     private webSocketServer: WebSocket.Server | null = null;
//     public sipInfo: SipInfoResponse;
//     public client: net.Socket;
//     public fakeDomain: string;
//     public fakeEmail: string;
//     public lastInviteMessage?: InboundMessage;
//     public currentCallSession?: InboundCallSession | OutboundCallSession;
//     public socket!: dgram.Socket;
//     public packetsReceived: number = 0;
//     public bytesReceived: number = 0;
//     private intervalHandle: NodeJS.Timeout | null = null;
//     private connected = false;
//     private audioLogFolder: string = path.join(
//         process.cwd(),
//         "src/data/llpmg/calls"
//     );
//     private audioStream!: fs.WriteStream;

//     constructor(sipInfo: SipInfoResponse) {
//         super();
//         this.sipInfo = sipInfo;
//         this.fakeDomain = uuid() + ".invalid";
//         this.fakeEmail = uuid() + "@" + this.fakeDomain;

//         if (!this.sipInfo.domain) {
//             this.sipInfo.domain = "sip.ringcentral.com";
//         }
//         if (!this.sipInfo.outboundProxy) {
//             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
//         }

//         this.client = new net.Socket();
//         const tokens = this.sipInfo.outboundProxy.split(":");
//         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
//             this.connected = true;
//             console.log("SIP client connected");
//         });

//         let cache = "";
//         this.client.on("data", (data) => {
//             cache += data.toString("utf-8");
//             if (!cache.endsWith("\r\n")) {
//                 return;
//             }

//             const tempMessages = cache
//                 .split("\r\nContent-Length: 0\r\n\r\n")
//                 .filter((message) => message.trim() !== "");
//             cache = "";
//             for (let i = 0; i < tempMessages.length; i++) {
//                 if (!tempMessages[i].includes("Content-Length: ")) {
//                     tempMessages[i] += "\r\nContent-Length: 0";
//                 }
//             }
//             for (const message of tempMessages) {
//                 const inboundMsg = InboundMessage.fromString(message);
//                 if (inboundMsg) {
//                     console.log("Received SIP message:", inboundMsg.subject);
//                     this.emit("message", inboundMsg);
//                 }
//             }
//         });
//     }

//     public initializeWebSocket(server: HttpServer) {
//         this.webSocketServer = new WebSocket.Server({ server });

//         this.webSocketServer.on("connection", (ws: WebSocket) => {
//             console.log("WebSocket client connected");

//             ws.on("message", (message: WebSocket.RawData) => {
//                 const data = JSON.parse(message.toString());
//                 if (
//                     data.type === "join" &&
//                     data.callId &&
//                     this.currentCallSession
//                 ) {
//                     if (this.currentCallSession.callId === data.callId) {
//                         this.currentCallSession.setWebSocket(ws);
//                     }
//                 }
//             });

//             ws.on("close", () => {
//                 console.log("WebSocket client disconnected");
//             });
//         });
//     }

//     public async register() {
//         if (!this.connected) {
//             await waitFor({ interval: 100, condition: () => this.connected });
//         }
//         const sipRegister = async () => {
//             const requestMessage = new RequestMessage(
//                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
//                 {
//                     "Call-Id": uuid(),
//                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
//                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
//                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
//                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
//                 }
//             );
//             const inboundMessage = await this.send(requestMessage, true);
//             if (
//                 inboundMessage &&
//                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
//             ) {
//                 console.log("SIP registration successful");
//                 return;
//             }
//             const wwwAuth =
//                 inboundMessage?.headers["Www-Authenticate"] ||
//                 inboundMessage?.headers["WWW-Authenticate"];
//             if (wwwAuth) {
//                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
//                 if (nonce) {
//                     const newMessage = requestMessage.fork();
//                     newMessage.headers.Authorization = generateAuthorization(
//                         this.sipInfo,
//                         nonce,
//                         "REGISTER"
//                     );
//                     await this.send(newMessage);
//                     console.log(
//                         "SIP registration with authentication successful"
//                     );
//                 }
//             }
//         };
//         await sipRegister();
//         this.intervalHandle = setInterval(
//             () => {
//                 sipRegister();
//             },
//             3 * 60 * 1000
//         );
//         this.on("message", (inboundMessage: InboundMessage) => {
//             if (inboundMessage.subject.startsWith("INVITE sip:")) {
//                 console.log("Incoming call detected");
//                 this.lastInviteMessage = inboundMessage;
//                 this.emit("invite", inboundMessage);
//             } else if (inboundMessage.subject.startsWith("BYE")) {
//                 console.log("Received BYE message, ending call");
//                 this.handleRemoteHangup();
//             }
//         });
//     }

//     public enableDebugMode() {
//         this.on("message", (message: InboundMessage) =>
//             console.log(`Receiving...(${new Date()})\n` + message.toString())
//         );
//         const tcpWrite = this.client.write.bind(this.client);
//         this.client.write = (message: string | Uint8Array) => {
//             console.log(`Sending...(${new Date()})\n` + message);
//             return tcpWrite(message);
//         };
//     }

//     public revoke() {
//         if (this.intervalHandle) {
//             clearInterval(this.intervalHandle);
//         }
//         this.removeAllListeners();
//         this.client.removeAllListeners();
//         this.client.destroy();
//         console.log("SIP client revoked");
//     }

//     public send(message: OutboundMessage, waitForReply = false) {
//         this.client.write(message.toString());
//         if (!waitForReply) {
//             return Promise.resolve(undefined);
//         }
//         return new Promise<InboundMessage>((resolve, reject) => {
//             const messageListener = (inboundMessage: InboundMessage) => {
//                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
//                     return;
//                 }
//                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
//                     return;
//                 }
//                 this.off("message", messageListener);
//                 resolve(inboundMessage);
//             };
//             this.on("message", messageListener);
//             setTimeout(
//                 () => reject(new Error("No response received in time")),
//                 5000
//             );
//         });
//     }

//     public async answer(inviteMessage: InboundMessage) {
//         console.log("Answering incoming call");
//         const inboundCallSession = new InboundCallSession(this, inviteMessage);
//         await inboundCallSession.answer();
//         this.currentCallSession = inboundCallSession;
//         this.startRecording(inboundCallSession.callId);
//         return inboundCallSession;
//     }

//     public async decline(inviteMessage: InboundMessage) {
//         console.log("Declining incoming call");
//         const newMessage = new ResponseMessage(inviteMessage, 603);
//         await this.send(newMessage);
//     }

//     public async call(callee: number, callerId?: number) {
//         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
//         const offerSDP = `
// v=0
// o=- ${randomInt()} 0 IN IP4 127.0.0.1
// s=rc-softphone-ts
// c=IN IP4 127.0.0.1
// t=0 0
// m=audio ${randomInt()} RTP/AVP 0 101
// a=rtpmap:0 PCMU/8000
// a=rtpmap:101 telephone-event/8000
// a=fmtp:101 0-15
// a=sendrecv
//   `.trim();
//         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

//         const inviteMessage = new RequestMessage(
//             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
//             {
//                 "Call-Id": uuid(),
//                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
//                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
//                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
//                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
//                 "Content-Type": "application/sdp",
//             },
//             offerSDP
//         );
//         console.log(
//             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
//         );

//         if (callerId) {
//             inviteMessage.headers["P-Asserted-Identity"] =
//                 `sip:${callerId}@${this.sipInfo.domain}`;
//         }

//         try {
//             console.log(`[Softphone] Sending initial INVITE message`);
//             const inboundMessage = await this.send(inviteMessage, true);
//             console.log(
//                 `[Softphone] Received response to INVITE:`,
//                 inboundMessage
//             );

//             if (inboundMessage) {
//                 const proxyAuthenticate =
//                     inboundMessage.headers["Proxy-Authenticate"] ||
//                     inboundMessage.headers["proxy-authenticate"];
//                 if (proxyAuthenticate) {
//                     console.log(`[Softphone] Proxy authentication required`);
//                     console.log(
//                         `[Softphone] Proxy-Authenticate header:`,
//                         proxyAuthenticate
//                     );

//                     const nonceMatch =
//                         proxyAuthenticate.match(/nonce="([^"]+)"/);
//                     const nonce = nonceMatch ? nonceMatch[1] : null;

//                     if (nonce) {
//                         console.log(`[Softphone] Extracted nonce:`, nonce);
//                         const newMessage = inviteMessage.fork();
//                         newMessage.headers["Proxy-Authorization"] =
//                             generateAuthorization(
//                                 this.sipInfo,
//                                 nonce,
//                                 "INVITE"
//                             );
//                         console.log(
//                             `[Softphone] Sending authenticated INVITE:`,
//                             newMessage
//                         );
//                         const progressMessage = await this.send(
//                             newMessage,
//                             true
//                         );
//                         console.log(
//                             `[Softphone] Received response to authenticated INVITE:`,
//                             progressMessage
//                         );

//                         if (progressMessage) {
//                             const outboundCallSession = new OutboundCallSession(
//                                 this,
//                                 progressMessage
//                             );
//                             this.currentCallSession = outboundCallSession;
//                             this.startRecording(outboundCallSession.callId);
//                             return outboundCallSession;
//                         } else {
//                             throw new Error(
//                                 "No response received for authenticated INVITE"
//                             );
//                         }
//                     } else {
//                         throw new Error(
//                             "Failed to extract nonce from Proxy-Authenticate header"
//                         );
//                     }
//                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
//                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
//                 } else {
//                     throw new Error(
//                         `Unexpected response: ${inboundMessage.subject}`
//                     );
//                 }
//             } else {
//                 throw new Error("No response received for initial INVITE");
//             }
//         } catch (error) {
//             console.error(`[Softphone] Error during call setup:`, error);
//             throw error;
//         }
//     }

//     public async hangup(): Promise<void> {
//         if (this.currentCallSession) {
//             console.log("Sending BYE message to hang up call");
//             await this.currentCallSession.hangup();
//             this.currentCallSession = undefined;
//             this.finalizeRecording();
//             this.emit("callEnded");
//             console.log("Call ended, emitted callEnded event");
//         } else {
//             console.log("No active call to hang up");
//         }
//     }

//     private startRecording(callId: string) {
//         const audioLogPath = path.join(
//             this.audioLogFolder,
//             `audio_log_${callId}.raw`
//         );
//         this.audioStream = fs.createWriteStream(audioLogPath);
//         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
//     }

//     private finalizeRecording() {
//         if (this.audioStream) {
//             this.audioStream.end(() => {
//                 console.log(`[Softphone] Finished recording audio`);
//                 this.saveAudioAsOgg();
//             });
//         } else {
//             console.warn(`[Softphone] No active audio stream to finalize`);
//         }
//     }

//     public getAudioLog(callId: string): Buffer | null {
//         const audioLogPath = path.join(
//             this.audioLogFolder,
//             `audio_log_${callId}.ogg`
//         );
//         if (fs.existsSync(audioLogPath)) {
//             console.log(
//                 `[Softphone] Retrieved audio log for CallID: ${callId}`
//             );
//             return fs.readFileSync(audioLogPath);
//         }
//         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
//         return null;
//     }

//     public playAudioLog(callId: string): void {
//         const audioData = this.getAudioLog(callId);
//         if (audioData) {
//             console.log(
//                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
//             );
//         } else {
//             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
//         }
//     }

//     private handleRemoteHangup() {
//         if (this.currentCallSession) {
//             console.log("Remote hangup detected");
//             this.currentCallSession = undefined;
//             this.finalizeRecording();
//             this.emit("callEnded");
//             console.log("Emitting callEnded event after remote hangup");
//         }
//     }

//     public async sendAudio(audioData: Buffer) {
//         if (this.currentCallSession) {
//             console.log(
//                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
//             );
//             await this.currentCallSession.sendAudio(audioData);
//             this.audioStream.write(audioData);
//         } else {
//             console.warn(
//                 "[Softphone] Attempted to send audio without an active call session"
//             );
//         }
//     }

//     private handleAudioPacket(packet: RtpPacket) {
//         console.log(
//             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
//         );
//         this.emit("audioData", packet.payload);
//         this.audioStream.write(packet.payload);
//     }

//     public saveAudioAsOgg() {
//         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
//         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

//         if (fs.existsSync(rawAudioPath)) {
//             console.log(`[Softphone] Converting audio log to .ogg format`);
//             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

//             ffmpeg.on("close", (code) => {
//                 if (code === 0) {
//                     console.log(
//                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
//                     );
//                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
//                 } else {
//                     console.error(
//                         `[Softphone] Failed to convert audio log to .ogg format`
//                     );
//                 }
//             });
//         } else {
//             console.error(`[Softphone] No raw audio log found for conversion`);
//         }
//     }

//     public getCallStats(callId: string): any {
//         if (
//             this.currentCallSession &&
//             this.currentCallSession.callId === callId
//         ) {
//             return {
//                 duration: Date.now() - this.currentCallSession.startTime,
//                 bytesReceived: this.currentCallSession.bytesReceived,
//                 bytesSent: this.currentCallSession.bytesSent,
//                 packetsReceived: this.currentCallSession.packetsReceived,
//                 packetsSent: this.currentCallSession.packetsSent,
//             };
//         }
//         return null;
//     }
// }

// export default Softphone;
// // sonnet-3.5 2nd attempt

export default {};
