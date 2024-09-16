// // // // // // // // // // // // hangups are now working
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;

// // // // // // // // // // // // attempt 2
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg(callId: string) {
// // // // // // // // // // // //         const rawAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const oggAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // // // //                 if (code === 0) {
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(
// // // // // // // // // // // //                 `[Softphone] No raw audio log found for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // //-------------------

// // // // // // // // // // // // -------------- latest claude
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";
// // // // // // // // // // // // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "/src/data/llpmg/calls"
// // // // // // // // // // // //     );
// // // // // // // // // // // //     private audioStream: fs.WriteStream | null = null;
// // // // // // // // // // // //     private audioPackets: Buffer[] = [];

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Ending call and initiating audio conversion");
// // // // // // // // // // // //             await this.currentCallSession.endCall();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public startRecording(callId: string) {
// // // // // // // // // // // //         const rawAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Creating raw audio log file at ${rawAudioPath}`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.audioStream = fs.createWriteStream(rawAudioPath);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private finalizeRecording(callId: string) {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     `[Softphone] Finished recording audio for call ID: ${callId}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 const rawAudioPath = path.join(
// // // // // // // // // // // //                     this.audioLogFolder,
// // // // // // // // // // // //                     `audio_log_${callId}.raw`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 this.convertToOgg(rawAudioPath, callId);
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 `[Softphone] No active audio stream to finalize for call ID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async convertToOgg(rawAudioPath: string, callId: string) {
// // // // // // // // // // // //         console.log(`[Softphone] Starting conversion for call ID: ${callId}`);
// // // // // // // // // // // //         console.log(`[Softphone] Raw audio path: ${rawAudioPath}`);

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Raw audio file exists`);
// // // // // // // // // // // //             const stats = fs.statSync(rawAudioPath);
// // // // // // // // // // // //             console.log(`[Softphone] Raw audio file size: ${stats.size} bytes`);

// // // // // // // // // // // //             const date =
// // // // // // // // // // // //                 new Date().toISOString().replace(/:/g, "-").split(".")[0] + "Z";
// // // // // // // // // // // //             const oggAudioPath = path.join(
// // // // // // // // // // // //                 this.audioLogFolder,
// // // // // // // // // // // //                 `audio_log_${callId}_${date}.ogg`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             console.log(`[Softphone] Target Ogg audio path: ${oggAudioPath}`);

// // // // // // // // // // // //             const rawAudioData = fs.readFileSync(rawAudioPath);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Raw audio data size: ${rawAudioData.length} bytes`
// // // // // // // // // // // //             );

// // // // // // // // // // // //             const encoder = new OggVorbisEncoder(rawAudioData, 48000, 2);

// // // // // // // // // // // //             try {
// // // // // // // // // // // //                 console.log(`[Softphone] Starting Ogg conversion`);
// // // // // // // // // // // //                 await encoder.saveToFile(oggAudioPath);
// // // // // // // // // // // //                 console.log(`[Softphone] Ogg conversion completed`);

// // // // // // // // // // // //                 if (fs.existsSync(oggAudioPath)) {
// // // // // // // // // // // //                     const oggStats = fs.statSync(oggAudioPath);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Ogg file created successfully. Size: ${oggStats.size} bytes`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Ogg file was not created at ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }

// // // // // // // // // // // //                 console.log(`[Softphone] Removing raw audio file`);
// // // // // // // // // // // //                 fs.unlinkSync(rawAudioPath);
// // // // // // // // // // // //                 console.log(`[Softphone] Raw audio file removed`);
// // // // // // // // // // // //             } catch (error) {
// // // // // // // // // // // //                 console.error(`[Softphone] Error converting audio log:`, error);
// // // // // // // // // // // //                 if (error instanceof Error) {
// // // // // // // // // // // //                     console.error(`[Softphone] Error name: ${error.name}`);
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Error message: ${error.message}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     console.error(`[Softphone] Error stack: ${error.stack}`);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(
// // // // // // // // // // // //                 `[Softphone] No raw audio log found for conversion: ${rawAudioPath}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }

// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Conversion process completed for call ID: ${callId}`
// // // // // // // // // // // //         );
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         // const audioLogPath = path.join(
// // // // // // // // // // // //         //     this.audioLogFolder,
// // // // // // // // // // // //         //     `audio_log_${callId}.ogg`
// // // // // // // // // // // //         // );
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording(callId); // Pass the callId here
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up remotely");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: Buffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             if (this.audioStream) {
// // // // // // // // // // // //                 this.audioStream.write(audioData);
// // // // // // // // // // // //             }
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(audioData);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg(rawAudioPath: string) {
// // // // // // // // // // // //         console.log("saveAudioAsOgg() method invoked");

// // // // // // // // // // // //         if (rawAudioPath) {
// // // // // // // // // // // //             console.log("Raw audio path is valid");

// // // // // // // // // // // //             const date = new Date().toISOString().replace(/[:.]/g, "-");
// // // // // // // // // // // //             const callId = path.basename(rawAudioPath, ".raw");
// // // // // // // // // // // //             const oggAudioPath = path.join(
// // // // // // // // // // // //                 path.dirname(rawAudioPath),
// // // // // // // // // // // //                 `audio_log_${callId}_${date}.ogg`
// // // // // // // // // // // //             );

// // // // // // // // // // // //             console.log(`Raw audio path: ${rawAudioPath}`);
// // // // // // // // // // // //             console.log(`Ogg audio path: ${oggAudioPath}`);

// // // // // // // // // // // //             if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     "Raw audio file exists, proceeding with conversion"
// // // // // // // // // // // //                 );

// // // // // // // // // // // //                 const rawAudioData = fs.readFileSync(rawAudioPath);

// // // // // // // // // // // //                 const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);
// // // // // // // // // // // //                 encoder.saveToFile(oggAudioPath);

// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 console.error(
// // // // // // // // // // // //                     `[Softphone] No raw audio log found for conversion`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error("Raw audio path is null. Cannot convert audio log.");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public endCall() {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             console.log("Ending call and finishing audio stream");
// // // // // // // // // // // //             this.audioStream.end();
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // -------------------------------- latest claude

// // // // // // // // // // // // looking for audio logging
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // looking for audio logging

// // // // // // // // // // // // looking for audio logging 0 (recording and capturing from browser)
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg(callId: string) {
// // // // // // // // // // // //         const rawAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const oggAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // // // //                 if (code === 0) {
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(
// // // // // // // // // // // //                 `[Softphone] No raw audio log found for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // looking for audio logging 0 (recording and capturing from browser)

// // // // // // // // // // // // saving audio (logs exist but error)
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );
// // // // // // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private startRecording(callId: string) {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private finalizeRecording() {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // // // // // //                 this.saveAudioAsOgg();
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // // // //             this.audioStream.write(buffer);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg() {
// // // // // // // // // // // //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// // // // // // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // // // //                 if (code === 0) {
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // saving audio (logs exist but error)

// // // // // // // // // // // // cleaning logs
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";
// // // // // // // // // // // // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "../../../../src/data/llpmg/calls"
// // // // // // // // // // // //     );
// // // // // // // // // // // //     private audioStream: fs.WriteStream | null = null;
// // // // // // // // // // // //     private getRootPath(): string {
// // // // // // // // // // // //         return process.cwd(); // This will point to the directory where package.json is located
// // // // // // // // // // // //     }

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(`
// // // // // // // // // // // //                 REGISTER sip:${this.sipInfo.domain} SIP/2.0,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: <sip:${this.fakeEmail};transport=tcp>;expires=600,
// // // // // // // // // // // //                     From: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()},
// // // // // // // // // // // //                     To: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>,
// // // // // // // // // // // //                     Via: SIP/2.0/TCP ${this.fakeDomain};branch=${branch()},
// // // // // // // // // // // //                 }`);
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n + message.toString()`)
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n + message`);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv`.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `
// // // // // // // // // // // //             INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: <sip:${this.fakeEmail};transport=tcp>;expires=600,
// // // // // // // // // // // //                 From: <sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()},
// // // // // // // // // // // //                 To: <sip:${callee}@${this.sipInfo.domain}>,
// // // // // // // // // // // //                 Via: SIP/2.0/TCP ${this.fakeDomain};branch=${branch()},
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             }`,
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(`
// // // // // // // // // // // //             [Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`);

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] = `
// // // // // // // // // // // //                 sip:${callerId}@${this.sipInfo.domain};`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `
// // // // // // // // // // // //                 [Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `
// // // // // // // // // // // //                         [Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `
// // // // // // // // // // // //                             [Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `
// // // // // // // // // // // //                             [Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(`
// // // // // // // // // // // //                         Unexpected response: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording(callId); // Pass the callId here
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         // const audioLogPath = path.join(
// // // // // // // // // // // //         //     this.audioLogFolder,
// // // // // // // // // // // //         //     audio_log_${callId}.ogg
// // // // // // // // // // // //         // );
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `
// // // // // // // // // // // //             audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(`
// // // // // // // // // // // //                 [Softphone] Retrieved audio log for CallID: ${callId}`);
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(`
// // // // // // // // // // // //                 [Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             const callId = this.currentCallSession.callId; // Get the callId from the current session
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording(callId); // Pass the callId here
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up remotely");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg(rawAudioPath: string) {
// // // // // // // // // // // //         console.log("saveAudioAsOgg() method invoked");

// // // // // // // // // // // //         if (rawAudioPath) {
// // // // // // // // // // // //             console.log("Raw audio path is valid");

// // // // // // // // // // // //             const date = new Date().toISOString().replace(/[:.]/g, "-");
// // // // // // // // // // // //             const callId = path.basename(rawAudioPath, ".raw");
// // // // // // // // // // // //             const oggAudioPath = path.join(
// // // // // // // // // // // //                 path.dirname(rawAudioPath),
// // // // // // // // // // // //                 `
// // // // // // // // // // // //                 audio_log_${callId}_${date}.ogg`
// // // // // // // // // // // //             );

// // // // // // // // // // // //             console.log(`Raw audio path: ${rawAudioPath}`);
// // // // // // // // // // // //             console.log(`Ogg audio path: ${oggAudioPath}`);

// // // // // // // // // // // //             if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     "Raw audio file exists, proceeding with conversion"
// // // // // // // // // // // //                 );

// // // // // // // // // // // //                 const rawAudioData = fs.readFileSync(rawAudioPath);

// // // // // // // // // // // //                 const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);
// // // // // // // // // // // //                 encoder.saveToFile(oggAudioPath);

// // // // // // // // // // // //                 console.log(`
// // // // // // // // // // // //                     [Softphone] Audio log successfully converted to ${oggAudioPath}`);
// // // // // // // // // // // //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 console.error(`
// // // // // // // // // // // //                     [Softphone] No raw audio log found for conversion`);
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error("Raw audio path is null. Cannot convert audio log.");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public endCall() {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             console.log("Ending call and finishing audio stream");
// // // // // // // // // // // //             this.audioStream.end();
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public startRecording(callId: string) {
// // // // // // // // // // // //         const rawAudioPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Creating raw audio log file at ${rawAudioPath}`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.audioStream = fs.createWriteStream(rawAudioPath);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private finalizeRecording(callId: string) {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     `[Softphone] Finished recording audio for call ID: ${callId}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 const rawAudioPath = path.join(
// // // // // // // // // // // //                     this.audioLogFolder,
// // // // // // // // // // // //                     `audio_log_${callId}.raw`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 this.convertToOgg(rawAudioPath, callId);
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 `[Softphone] No active audio stream to finalize for call ID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private async convertToOgg(rawAudioPath: string, callId: string) {
// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             const date =
// // // // // // // // // // // //                 new Date().toISOString().replace(/:/g, "-").split(".")[0] + "Z";
// // // // // // // // // // // //             const oggAudioPath = path.join(
// // // // // // // // // // // //                 this.audioLogFolder,
// // // // // // // // // // // //                 `audio_log_${callId}_${date}.ogg`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Converting audio log to .ogg format: ${oggAudioPath}`
// // // // // // // // // // // //             );

// // // // // // // // // // // //             const rawAudioData = fs.readFileSync(rawAudioPath);
// // // // // // // // // // // //             const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);

// // // // // // // // // // // //             try {
// // // // // // // // // // // //                 await encoder.saveToFile(oggAudioPath);
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //             } catch (error) {
// // // // // // // // // // // //                 console.error(
// // // // // // // // // // // //                     `[Softphone] Error converting audio log: ${error}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(
// // // // // // // // // // // //                 `[Softphone] No raw audio log found for conversion: ${rawAudioPath}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: Buffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             if (this.audioStream) {
// // // // // // // // // // // //                 this.audioStream.write(audioData);
// // // // // // // // // // // //             }
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(audioData);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // cleaning logs

// // // // // // // // // // // // sonnet-3.5 1st attempt
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );
// // // // // // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //   `.trim();
// // // // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             {
// // // // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //             },
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //         );

// // // // // // // // // // // //         if (callerId) {
// // // // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //                 inboundMessage
// // // // // // // // // // // //             );

// // // // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // // // //                     );

// // // // // // // // // // // //                     const nonceMatch =
// // // // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //                     if (nonce) {
// // // // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //                             generateAuthorization(
// // // // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // // // //                                 nonce,
// // // // // // // // // // // //                                 "INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //                             newMessage
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // // // //                             newMessage,
// // // // // // // // // // // //                             true
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                         console.log(
// // // // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                             progressMessage
// // // // // // // // // // // //                         );

// // // // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                                 this,
// // // // // // // // // // // //                                 progressMessage
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // // // //                         } else {
// // // // // // // // // // // //                             throw new Error(
// // // // // // // // // // // //                                 "No response received for authenticated INVITE"
// // // // // // // // // // // //                             );
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                     } else {
// // // // // // // // // // // //                         throw new Error(
// // // // // // // // // // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                         );
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private startRecording(callId: string) {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private finalizeRecording() {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // // // // // //                 this.saveAudioAsOgg();
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: Buffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(audioData);
// // // // // // // // // // // //             this.audioStream.write(audioData);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleAudioPacket(packet: RtpPacket) {
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.emit("audioData", packet.payload);
// // // // // // // // // // // //         this.audioStream.write(packet.payload);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg() {
// // // // // // // // // // // //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// // // // // // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // // // //                 if (code === 0) {
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // sonnet-3.5 1st attempt

// // // // // sonnet-3.5 2nd attempt
// // // // import EventEmitter from "events";
// // // // import net from "net";
// // // // import waitFor from "wait-for-async";
// // // // import * as fs from "fs";
// // // // import WebSocket from "ws";
// // // // import dgram from "dgram";
// // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // import type { OutboundMessage } from "./sip-message";
// // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // import InboundCallSession from "./call-session/inbound";
// // // // import OutboundCallSession from "./call-session/outbound";
// // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // import type { Server as HttpServer } from "http";
// // // // import path from "path";
// // // // import { spawn } from "child_process";

// // // // class Softphone extends EventEmitter {
// // // //     private webSocketServer: WebSocket.Server | null = null;
// // // //     public sipInfo: SipInfoResponse;
// // // //     public client: net.Socket;
// // // //     public fakeDomain: string;
// // // //     public fakeEmail: string;
// // // //     public lastInviteMessage?: InboundMessage;
// // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // //     public socket!: dgram.Socket;
// // // //     public packetsReceived: number = 0;
// // // //     public bytesReceived: number = 0;
// // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // //     private connected = false;
// // // //     private audioLogFolder: string = path.join(
// // // //         process.cwd(),
// // // //         "src/data/llpmg/calls"
// // // //     );
// // // //     private audioStream!: fs.WriteStream;

// // // //     constructor(sipInfo: SipInfoResponse) {
// // // //         super();
// // // //         this.sipInfo = sipInfo;
// // // //         this.fakeDomain = uuid() + ".invalid";
// // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // //         if (!this.sipInfo.domain) {
// // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // //         }
// // // //         if (!this.sipInfo.outboundProxy) {
// // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // //         }

// // // //         this.client = new net.Socket();
// // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // //             this.connected = true;
// // // //             console.log("SIP client connected");
// // // //         });

// // // //         let cache = "";
// // // //         this.client.on("data", (data) => {
// // // //             cache += data.toString("utf-8");
// // // //             if (!cache.endsWith("\r\n")) {
// // // //                 return;
// // // //             }

// // // //             const tempMessages = cache
// // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // //                 .filter((message) => message.trim() !== "");
// // // //             cache = "";
// // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // //                 }
// // // //             }
// // // //             for (const message of tempMessages) {
// // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // //                 if (inboundMsg) {
// // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // //                     this.emit("message", inboundMsg);
// // // //                 }
// // // //             }
// // // //         });
// // // //     }

// // // //     public initializeWebSocket(server: HttpServer) {
// // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // //             console.log("WebSocket client connected");

// // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // //                 const data = JSON.parse(message.toString());
// // // //                 if (
// // // //                     data.type === "join" &&
// // // //                     data.callId &&
// // // //                     this.currentCallSession
// // // //                 ) {
// // // //                     if (this.currentCallSession.callId === data.callId) {
// // // //                         this.currentCallSession.setWebSocket(ws);
// // // //                     }
// // // //                 }
// // // //             });

// // // //             ws.on("close", () => {
// // // //                 console.log("WebSocket client disconnected");
// // // //             });
// // // //         });
// // // //     }

// // // //     public async register() {
// // // //         if (!this.connected) {
// // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // //         }
// // // //         const sipRegister = async () => {
// // // //             const requestMessage = new RequestMessage(
// // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // //                 {
// // // //                     "Call-Id": uuid(),
// // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // //                 }
// // // //             );
// // // //             const inboundMessage = await this.send(requestMessage, true);
// // // //             if (
// // // //                 inboundMessage &&
// // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // //             ) {
// // // //                 console.log("SIP registration successful");
// // // //                 return;
// // // //             }
// // // //             const wwwAuth =
// // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // //             if (wwwAuth) {
// // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // //                 if (nonce) {
// // // //                     const newMessage = requestMessage.fork();
// // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // //                         this.sipInfo,
// // // //                         nonce,
// // // //                         "REGISTER"
// // // //                     );
// // // //                     await this.send(newMessage);
// // // //                     console.log(
// // // //                         "SIP registration with authentication successful"
// // // //                     );
// // // //                 }
// // // //             }
// // // //         };
// // // //         await sipRegister();
// // // //         this.intervalHandle = setInterval(
// // // //             () => {
// // // //                 sipRegister();
// // // //             },
// // // //             3 * 60 * 1000
// // // //         );
// // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // //                 console.log("Incoming call detected");
// // // //                 this.lastInviteMessage = inboundMessage;
// // // //                 this.emit("invite", inboundMessage);
// // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // //                 console.log("Received BYE message, ending call");
// // // //                 this.handleRemoteHangup();
// // // //             }
// // // //         });
// // // //     }

// // // //     public enableDebugMode() {
// // // //         this.on("message", (message: InboundMessage) =>
// // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // //         );
// // // //         const tcpWrite = this.client.write.bind(this.client);
// // // //         this.client.write = (message: string | Uint8Array) => {
// // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // //             return tcpWrite(message);
// // // //         };
// // // //     }

// // // //     public revoke() {
// // // //         if (this.intervalHandle) {
// // // //             clearInterval(this.intervalHandle);
// // // //         }
// // // //         this.removeAllListeners();
// // // //         this.client.removeAllListeners();
// // // //         this.client.destroy();
// // // //         console.log("SIP client revoked");
// // // //     }

// // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // //         this.client.write(message.toString());
// // // //         if (!waitForReply) {
// // // //             return Promise.resolve(undefined);
// // // //         }
// // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // //                     return;
// // // //                 }
// // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // //                     return;
// // // //                 }
// // // //                 this.off("message", messageListener);
// // // //                 resolve(inboundMessage);
// // // //             };
// // // //             this.on("message", messageListener);
// // // //             setTimeout(
// // // //                 () => reject(new Error("No response received in time")),
// // // //                 5000
// // // //             );
// // // //         });
// // // //     }

// // // //     public async answer(inviteMessage: InboundMessage) {
// // // //         console.log("Answering incoming call");
// // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // //         await inboundCallSession.answer();
// // // //         this.currentCallSession = inboundCallSession;
// // // //         this.startRecording(inboundCallSession.callId);
// // // //         return inboundCallSession;
// // // //     }

// // // //     public async decline(inviteMessage: InboundMessage) {
// // // //         console.log("Declining incoming call");
// // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // //         await this.send(newMessage);
// // // //     }

// // // //     public async call(callee: number, callerId?: number) {
// // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // //         const offerSDP = `
// // // // v=0
// // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // s=rc-softphone-ts
// // // // c=IN IP4 127.0.0.1
// // // // t=0 0
// // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // a=rtpmap:0 PCMU/8000
// // // // a=rtpmap:101 telephone-event/8000
// // // // a=fmtp:101 0-15
// // // // a=sendrecv
// // // //   `.trim();
// // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // //         const inviteMessage = new RequestMessage(
// // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // //             {
// // // //                 "Call-Id": uuid(),
// // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // //                 "Content-Type": "application/sdp",
// // // //             },
// // // //             offerSDP
// // // //         );
// // // //         console.log(
// // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // //         );

// // // //         if (callerId) {
// // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // //         }

// // // //         try {
// // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // //             console.log(
// // // //                 `[Softphone] Received response to INVITE:`,
// // // //                 inboundMessage
// // // //             );

// // // //             if (inboundMessage) {
// // // //                 const proxyAuthenticate =
// // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // //                     inboundMessage.headers["proxy-authenticate"];
// // // //                 if (proxyAuthenticate) {
// // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // //                     console.log(
// // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // //                         proxyAuthenticate
// // // //                     );

// // // //                     const nonceMatch =
// // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // //                     if (nonce) {
// // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // //                         const newMessage = inviteMessage.fork();
// // // //                         newMessage.headers["Proxy-Authorization"] =
// // // //                             generateAuthorization(
// // // //                                 this.sipInfo,
// // // //                                 nonce,
// // // //                                 "INVITE"
// // // //                             );
// // // //                         console.log(
// // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // //                             newMessage
// // // //                         );
// // // //                         const progressMessage = await this.send(
// // // //                             newMessage,
// // // //                             true
// // // //                         );
// // // //                         console.log(
// // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // //                             progressMessage
// // // //                         );

// // // //                         if (progressMessage) {
// // // //                             const outboundCallSession = new OutboundCallSession(
// // // //                                 this,
// // // //                                 progressMessage
// // // //                             );
// // // //                             this.currentCallSession = outboundCallSession;
// // // //                             this.startRecording(outboundCallSession.callId);
// // // //                             return outboundCallSession;
// // // //                         } else {
// // // //                             throw new Error(
// // // //                                 "No response received for authenticated INVITE"
// // // //                             );
// // // //                         }
// // // //                     } else {
// // // //                         throw new Error(
// // // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // //                         );
// // // //                     }
// // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // //                 } else {
// // // //                     throw new Error(
// // // //                         `Unexpected response: ${inboundMessage.subject}`
// // // //                     );
// // // //                 }
// // // //             } else {
// // // //                 throw new Error("No response received for initial INVITE");
// // // //             }
// // // //         } catch (error) {
// // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // //             throw error;
// // // //         }
// // // //     }

// // // //     public async hangup(): Promise<void> {
// // // //         if (this.currentCallSession) {
// // // //             console.log("Sending BYE message to hang up call");
// // // //             await this.currentCallSession.hangup();
// // // //             this.currentCallSession = undefined;
// // // //             this.finalizeRecording();
// // // //             this.emit("callEnded");
// // // //             console.log("Call ended, emitted callEnded event");
// // // //         } else {
// // // //             console.log("No active call to hang up");
// // // //         }
// // // //     }

// // // //     private startRecording(callId: string) {
// // // //         const audioLogPath = path.join(
// // // //             this.audioLogFolder,
// // // //             `audio_log_${callId}.raw`
// // // //         );
// // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // //     }

// // // //     private finalizeRecording() {
// // // //         if (this.audioStream) {
// // // //             this.audioStream.end(() => {
// // // //                 console.log(`[Softphone] Finished recording audio`);
// // // //                 this.saveAudioAsOgg();
// // // //             });
// // // //         } else {
// // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // //         }
// // // //     }

// // // //     public getAudioLog(callId: string): Buffer | null {
// // // //         const audioLogPath = path.join(
// // // //             this.audioLogFolder,
// // // //             `audio_log_${callId}.ogg`
// // // //         );
// // // //         if (fs.existsSync(audioLogPath)) {
// // // //             console.log(
// // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // //             );
// // // //             return fs.readFileSync(audioLogPath);
// // // //         }
// // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // //         return null;
// // // //     }

// // // //     public playAudioLog(callId: string): void {
// // // //         const audioData = this.getAudioLog(callId);
// // // //         if (audioData) {
// // // //             console.log(
// // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // //             );
// // // //         } else {
// // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // //         }
// // // //     }

// // // //     private handleRemoteHangup() {
// // // //         if (this.currentCallSession) {
// // // //             console.log("Remote hangup detected");
// // // //             this.currentCallSession = undefined;
// // // //             this.finalizeRecording();
// // // //             this.emit("callEnded");
// // // //             console.log("Emitting callEnded event after remote hangup");
// // // //         }
// // // //     }

// // // //     public async sendAudio(audioData: Buffer) {
// // // //         if (this.currentCallSession) {
// // // //             console.log(
// // // //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// // // //             );
// // // //             await this.currentCallSession.sendAudio(audioData);
// // // //             this.audioStream.write(audioData);
// // // //         } else {
// // // //             console.warn(
// // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // //             );
// // // //         }
// // // //     }

// // // //     private handleAudioPacket(packet: RtpPacket) {
// // // //         console.log(
// // // //             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// // // //         );
// // // //         this.emit("audioData", packet.payload);
// // // //         this.audioStream.write(packet.payload);
// // // //     }

// // // //     public saveAudioAsOgg() {
// // // //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // //         if (fs.existsSync(rawAudioPath)) {
// // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // //             ffmpeg.on("close", (code) => {
// // // //                 if (code === 0) {
// // // //                     console.log(
// // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // //                     );
// // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // //                 } else {
// // // //                     console.error(
// // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // //                     );
// // // //                 }
// // // //             });
// // // //         } else {
// // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // //         }
// // // //     }

// // // //     public getCallStats(callId: string): any {
// // // //         if (
// // // //             this.currentCallSession &&
// // // //             this.currentCallSession.callId === callId
// // // //         ) {
// // // //             return {
// // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // //             };
// // // //         }
// // // //         return null;
// // // //     }
// // // // }

// // // // export default Softphone;
// // // // // sonnet-3.5 2nd attempt

// // // // // // // // // // // // sonnet-3.5 13th attempt
// // // // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // // // import net from "net";
// // // // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // // // import path from "path";
// // // // // // // // // // // // import { spawn } from "child_process";
// // // // // // // // // // // // import CallSession, {
// // // // // // // // // // // //     AnyWebSocket,
// // // // // // // // // // // //     CompatibleWebSocket,
// // // // // // // // // // // //     IWebSocket,
// // // // // // // // // // // // } from "./call-session";
// // // // // // // // // // // // import { WebSocketWrapper } from "@/lib/llpmg/sip/WebSocketWrapper";
// // // // // // // // // // // // import { ServerWebSocketWrapper } from "@/lib/llpmg/sip/ServerWebSocketWrapper";

// // // // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // // // //     public client: net.Socket;
// // // // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // // // //     private connected = false;
// // // // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // // // //         process.cwd(),
// // // // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // // // //     );
// // // // // // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // // // //         super();
// // // // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // // // //         }
// // // // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // // // //         }

// // // // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // // // //             this.connected = true;
// // // // // // // // // // // //             console.log("SIP client connected");
// // // // // // // // // // // //         });

// // // // // // // // // // // //         let cache = "";
// // // // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }

// // // // // // // // // // // //             const tempMessages = cache
// // // // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // // // //             cache = "";
// // // // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // // // //                     console.log("Received SIP message:", inboundMsg.subject);
// // // // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //         // added for sonnet-3.5 9th attempt
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("BYE ")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //         // added for sonnet-3.5 9th attempt
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }

// // // // // // // // // // // //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // // // // // // // // // //     // 1st
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws as IWebSocket);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 2nd
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws as CompatibleWebSocket);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 3rd
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         const wsWrapper = new WebSocketWrapper(ws);

// // // // // // // // // // // //     //         wsWrapper.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(wsWrapper);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         wsWrapper.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 4th, but still 3rd
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 5th, but still 3rd
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     // Use type assertion here
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws as AnyWebSocket);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 6th, but still 3rd
// // // // // // // // // // // //     // public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //     //     this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //     //     this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //     //         console.log("WebSocket client connected");

// // // // // // // // // // // //     //         ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //     //             const data = JSON.parse(message.toString());
// // // // // // // // // // // //     //             if (
// // // // // // // // // // // //     //                 data.type === "join" &&
// // // // // // // // // // // //     //                 data.callId &&
// // // // // // // // // // // //     //                 this.currentCallSession
// // // // // // // // // // // //     //             ) {
// // // // // // // // // // // //     //                 if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //     //                     // Use a more aggressive type assertion
// // // // // // // // // // // //     //                     this.currentCallSession.setWebSocket(ws as unknown as WebSocket);
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         });

// // // // // // // // // // // //     //         ws.on("close", () => {
// // // // // // // // // // // //     //             console.log("WebSocket client disconnected");
// // // // // // // // // // // //     //         });
// // // // // // // // // // // //     //     });
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // 7th, but still 3rd
// // // // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // // // //             console.log("WebSocket client connected");

// // // // // // // // // // // //             const serverWs = new ServerWebSocketWrapper(ws);

// // // // // // // // // // // //             serverWs.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // // // //                     data.callId &&
// // // // // // // // // // // //                     this.currentCallSession
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // // // //                         this.currentCallSession.setWebSocket(serverWs);
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });

// // // // // // // // // // // //             serverWs.on("close", () => {
// // // // // // // // // // // //                 console.log("WebSocket client disconnected");
// // // // // // // // // // // //             });
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }
// // // // // // // // // // // //     // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)

// // // // // // // // // // // //     // added for sonnet-3.5 5th attempt
// // // // // // // // // // // //     private generateOfferSDP(): string {
// // // // // // // // // // // //         return `
// // // // // // // // // // // // v=0
// // // // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // // // t=0 0
// // // // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // // // a=sendrecv
// // // // // // // // // // // //         `.trim();
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed for sonnet 3.5 6th attempt
// // // // // // // // // // // //     // private createInviteMessage(
// // // // // // // // // // // //     //     callee: number,
// // // // // // // // // // // //     //     offerSDP: string
// // // // // // // // // // // //     // ): RequestMessage {
// // // // // // // // // // // //     //     return new RequestMessage(
// // // // // // // // // // // //     //         `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //     //         {
// // // // // // // // // // // //     //             "Call-Id": randomInt().toString(),
// // // // // // // // // // // //     //             Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //     //             From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${randomInt()}`,
// // // // // // // // // // // //     //             To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //     //             Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //     //             "Content-Type": "application/sdp",
// // // // // // // // // // // //     //         },
// // // // // // // // // // // //     //         offerSDP
// // // // // // // // // // // //     //     );
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // added for sonnet-3.5 5th attempt
// // // // // // // // // // // //     // removed for sonnet-3.5 6th attempt

// // // // // // // // // // // //     // added for sonnet-3.5 6th attempt
// // // // // // // // // // // //     private createInviteMessage(
// // // // // // // // // // // //         callee: number,
// // // // // // // // // // // //         offerSDP: string,
// // // // // // // // // // // //         authorization?: string
// // // // // // // // // // // //     ): RequestMessage {
// // // // // // // // // // // //         const headers: Record<string, string> = {
// // // // // // // // // // // //             "Call-Id": randomInt().toString(),
// // // // // // // // // // // //             Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //             From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${randomInt()}`,
// // // // // // // // // // // //             To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //             Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //             "Content-Type": "application/sdp",
// // // // // // // // // // // //         };

// // // // // // // // // // // //         if (authorization) {
// // // // // // // // // // // //             headers["Proxy-Authorization"] = authorization;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         return new RequestMessage(
// // // // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //             headers,
// // // // // // // // // // // //             offerSDP
// // // // // // // // // // // //         );
// // // // // // // // // // // //     }
// // // // // // // // // // // //     // added for sonnet-3.5 6th attempt

// // // // // // // // // // // //     public async register() {
// // // // // // // // // // // //         if (!this.connected) {
// // // // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // // // //         }
// // // // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //                 {
// // // // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // // // //             if (
// // // // // // // // // // // //                 inboundMessage &&
// // // // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // // // //             ) {
// // // // // // // // // // // //                 console.log("SIP registration successful");
// // // // // // // // // // // //                 return;
// // // // // // // // // // // //             }
// // // // // // // // // // // //             const wwwAuth =
// // // // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // // // //                 if (nonce) {
// // // // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // // // //                         this.sipInfo,
// // // // // // // // // // // //                         nonce,
// // // // // // // // // // // //                         "REGISTER"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         "SIP registration with authentication successful"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             }
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await sipRegister();
// // // // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // // // //             () => {
// // // // // // // // // // // //                 sipRegister();
// // // // // // // // // // // //             },
// // // // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // // // //                 console.log("Incoming call detected");
// // // // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // // // //                 console.log("Received BYE message, ending call");
// // // // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // // // //             }
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // // // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // // // // // // // // // // //         );
// // // // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // // // //             console.log(`Sending...(${new Date()})\n` + message);
// // // // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // // // //         };
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public revoke() {
// // // // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // // // //         this.client.destroy();
// // // // // // // // // // // //         console.log("SIP client revoked");
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // // // //                     return;
// // // // // // // // // // // //                 }
// // // // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // // // //             setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("No response received in time")),
// // // // // // // // // // // //                 5000
// // // // // // // // // // // //             );
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // // // // //     // public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // // // //     //     console.log("Answering incoming call");
// // // // // // // // // // // //     //     const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //     //     await inboundCallSession.answer();
// // // // // // // // // // // //     //     this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //     //     this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //     //     return inboundCallSession;
// // // // // // // // // // // //     // }

// // // // // // // // // // // //     // added for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // // // // //     public async answer(
// // // // // // // // // // // //         inviteMessage: InboundMessage
// // // // // // // // // // // //     ): Promise<InboundCallSession> {
// // // // // // // // // // // //         console.log("Answering incoming call");
// // // // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // // // //         return inboundCallSession;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async sendAudio(audioData: Buffer) {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             await this.currentCallSession.sendAudio(audioData);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(
// // // // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // // // //             );
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // // // //         console.log("Declining incoming call");
// // // // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed for sonnet-3.5 5th attempt
// // // // // // // // // // // //     //     public async call(
// // // // // // // // // // // //     //         callee: number,
// // // // // // // // // // // //     //         callerId?: number
// // // // // // // // // // // //     //     ): Promise<OutboundCallSession> {
// // // // // // // // // // // //     //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //     //         const offerSDP = `
// // // // // // // // // // // //     // v=0
// // // // // // // // // // // //     // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // // //     // s=rc-softphone-ts
// // // // // // // // // // // //     // c=IN IP4 127.0.0.1
// // // // // // // // // // // //     // t=0 0
// // // // // // // // // // // //     // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // // //     // a=rtpmap:0 PCMU/8000
// // // // // // // // // // // //     // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // // //     // a=fmtp:101 0-15
// // // // // // // // // // // //     // a=sendrecv
// // // // // // // // // // // //     //   `.trim();
// // // // // // // // // // // //     //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // // // //     //         const inviteMessage = new RequestMessage(
// // // // // // // // // // // //     //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // // // //     //             {
// // // // // // // // // // // //     //                 "Call-Id": uuid(),
// // // // // // // // // // // //     //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // // // //     //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // // // //     //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // // // //     //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // // // //     //                 "Content-Type": "application/sdp",
// // // // // // // // // // // //     //             },
// // // // // // // // // // // //     //             offerSDP
// // // // // // // // // // // //     //         );
// // // // // // // // // // // //     //         console.log(
// // // // // // // // // // // //     //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // // // //     //         );

// // // // // // // // // // // //     //         if (callerId) {
// // // // // // // // // // // //     //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // // // //     //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // // // //     //         }

// // // // // // // // // // // //     //         try {
// // // // // // // // // // // //     //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // // // //     //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // // // //     //             console.log(
// // // // // // // // // // // //     //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // // // //     //                 inboundMessage
// // // // // // // // // // // //     //             );

// // // // // // // // // // // //     //             if (inboundMessage) {
// // // // // // // // // // // //     //                 const proxyAuthenticate =
// // // // // // // // // // // //     //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // // // //     //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // // // //     //                 if (proxyAuthenticate) {
// // // // // // // // // // // //     //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // // // //     //                     console.log(
// // // // // // // // // // // //     //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // // // //     //                         proxyAuthenticate
// // // // // // // // // // // //     //                     );

// // // // // // // // // // // //     //                     const nonceMatch =
// // // // // // // // // // // //     //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // // // //     //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // // // //     //                     if (nonce) {
// // // // // // // // // // // //     //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // // // //     //                         const newMessage = inviteMessage.fork();

// // // // // // // // // // // //     //                         // removed for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // // // // //     //                         // newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // // // //     //                         //     generateAuthorization(
// // // // // // // // // // // //     //                         //         this.sipInfo,
// // // // // // // // // // // //     //                         //         nonce,
// // // // // // // // // // // //     //                         //         "INVITE"
// // // // // // // // // // // //     //                         //     );
// // // // // // // // // // // //     //                         // console.log(
// // // // // // // // // // // //     //                         //     `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //     //                         //     newMessage
// // // // // // // // // // // //     //                         // );
// // // // // // // // // // // //     //                         // const progressMessage = await this.send(
// // // // // // // // // // // //     //                         //     newMessage,
// // // // // // // // // // // //     //                         //     true
// // // // // // // // // // // //     //                         // );
// // // // // // // // // // // //     //                         // console.log(
// // // // // // // // // // // //     //                         //     `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //     //                         //     progressMessage
// // // // // // // // // // // //     //                         // );

// // // // // // // // // // // //     //                         // if (progressMessage) {
// // // // // // // // // // // //     //                         //     const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //     //                         //         this,
// // // // // // // // // // // //     //                         //         progressMessage
// // // // // // // // // // // //     //                         //     );
// // // // // // // // // // // //     //                         //     this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //     //                         //     this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //     //                         //     return outboundCallSession;
// // // // // // // // // // // //     //                         // } else {
// // // // // // // // // // // //     //                         //     throw new Error(
// // // // // // // // // // // //     //                         //         "No response received for authenticated INVITE"
// // // // // // // // // // // //     //                         //     );
// // // // // // // // // // // //     //                         // }

// // // // // // // // // // // //     //                         // added for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // // // // //     //                         try {
// // // // // // // // // // // //     //                             console.log(
// // // // // // // // // // // //     //                                 `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // // // //     //                                 newMessage
// // // // // // // // // // // //     //                             );
// // // // // // // // // // // //     //                             const progressMessage = await this.send(
// // // // // // // // // // // //     //                                 newMessage,
// // // // // // // // // // // //     //                                 true
// // // // // // // // // // // //     //                             );
// // // // // // // // // // // //     //                             console.log(
// // // // // // // // // // // //     //                                 `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //     //                                 progressMessage
// // // // // // // // // // // //     //                             );

// // // // // // // // // // // //     //                             if (progressMessage) {
// // // // // // // // // // // //     //                                 const outboundCallSession =
// // // // // // // // // // // //     //                                     new OutboundCallSession(
// // // // // // // // // // // //     //                                         this,
// // // // // // // // // // // //     //                                         progressMessage
// // // // // // // // // // // //     //                                     );
// // // // // // // // // // // //     //                                 this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //     //                                 this.startRecording(outboundCallSession.callId);
// // // // // // // // // // // //     //                                 return outboundCallSession;
// // // // // // // // // // // //     //                             } else {
// // // // // // // // // // // //     //                                 throw new Error(
// // // // // // // // // // // //     //                                     "No response received for authenticated INVITE"
// // // // // // // // // // // //     //                                 );
// // // // // // // // // // // //     //                             }
// // // // // // // // // // // //     //                         } catch (error) {
// // // // // // // // // // // //     //                             console.error(
// // // // // // // // // // // //     //                                 `[Softphone] Error during call setup:`,
// // // // // // // // // // // //     //                                 error
// // // // // // // // // // // //     //                             );
// // // // // // // // // // // //     //                             throw error;
// // // // // // // // // // // //     //                         }
// // // // // // // // // // // //     //                     } else {
// // // // // // // // // // // //     //                         throw new Error(
// // // // // // // // // // // //     //                             "Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //     //                         );
// // // // // // // // // // // //     //                     }
// // // // // // // // // // // //     //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // // // //     //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // // // // // // // // // // //     //                 } else {
// // // // // // // // // // // //     //                     throw new Error(
// // // // // // // // // // // //     //                         `Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // // // //     //                     );
// // // // // // // // // // // //     //                 }
// // // // // // // // // // // //     //             } else {
// // // // // // // // // // // //     //                 throw new Error("No response received for initial INVITE");
// // // // // // // // // // // //     //             }
// // // // // // // // // // // //     //         } catch (error) {
// // // // // // // // // // // //     //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //     //             throw error;
// // // // // // // // // // // //     //         }
// // // // // // // // // // // //     //     }
// // // // // // // // // // // //     // removed for sonnet-3.5 5th attempt

// // // // // // // // // // // //     // removed for sonnet-3.5 6th attempt
// // // // // // // // // // // //     // public async call(callee: number): Promise<OutboundCallSession> {
// // // // // // // // // // // //     //     console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //     //     const offerSDP = this.generateOfferSDP();
// // // // // // // // // // // //     //     const inviteMessage = this.createInviteMessage(callee, offerSDP);

// // // // // // // // // // // //     //     try {
// // // // // // // // // // // //     //         const response = await this.send(inviteMessage, true);
// // // // // // // // // // // //     //         console.log(`[Softphone] Received response to INVITE:`, response);

// // // // // // // // // // // //     //         // removed for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //         // if (response.subject.startsWith('SIP/2.0 1')) {
// // // // // // // // // // // //     //         // added for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //         if (response && response.subject.startsWith("SIP/2.0 1")) {
// // // // // // // // // // // //     //             // Provisional response, wait for final response
// // // // // // // // // // // //     //             const finalResponse = await this.waitForFinalResponse(
// // // // // // // // // // // //     //                 inviteMessage.headers["Call-Id"]
// // // // // // // // // // // //     //             );
// // // // // // // // // // // //     //             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //     //                 this,
// // // // // // // // // // // //     //                 finalResponse
// // // // // // // // // // // //     //             );
// // // // // // // // // // // //     //             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //     //             await outboundCallSession.init();
// // // // // // // // // // // //     //             return outboundCallSession;
// // // // // // // // // // // //     //             // removed for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //             // } else if (response.subject.startsWith('SIP/2.0 2')) {
// // // // // // // // // // // //     //             // added for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //         } else if (response && response.subject.startsWith("SIP/2.0 2")) {
// // // // // // // // // // // //     //             // Success response
// // // // // // // // // // // //     //             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //     //                 this,
// // // // // // // // // // // //     //                 response
// // // // // // // // // // // //     //             );
// // // // // // // // // // // //     //             this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //     //             await outboundCallSession.init();
// // // // // // // // // // // //     //             return outboundCallSession;
// // // // // // // // // // // //     //         } else {
// // // // // // // // // // // //     //             // removed for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //             // throw new Error(`Call failed: ${response.subject}`);
// // // // // // // // // // // //     //             // added for sonnet-3.5 5th attempt modify
// // // // // // // // // // // //     //             throw new Error(
// // // // // // // // // // // //     //                 `Call failed: ${response ? response.subject : "No response"}`
// // // // // // // // // // // //     //             );
// // // // // // // // // // // //     //         }
// // // // // // // // // // // //     //     } catch (error) {
// // // // // // // // // // // //     //         console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //     //         throw error;
// // // // // // // // // // // //     //     }
// // // // // // // // // // // //     // }
// // // // // // // // // // // //     // removed for sonnet-3.5 6th attempt

// // // // // // // // // // // //     // added for sonnet-3.5 6th attempt
// // // // // // // // // // // //     public async call(callee: number): Promise<OutboundCallSession> {
// // // // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // // // //         const offerSDP = this.generateOfferSDP();
// // // // // // // // // // // //         let inviteMessage = this.createInviteMessage(callee, offerSDP);

// // // // // // // // // // // //         try {
// // // // // // // // // // // //             let response = await this.send(inviteMessage, true);
// // // // // // // // // // // //             console.log(`[Softphone] Received response to INVITE:`, response);

// // // // // // // // // // // //             if (response && response.subject.startsWith("SIP/2.0 407")) {
// // // // // // // // // // // //                 // Handle Proxy Authentication
// // // // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // // // //                     response.headers["Proxy-Authenticate"];
// // // // // // // // // // // //                 // removed for sonnet-3.5 6th attempt
// // // // // // // // // // // //                 // const nonce = proxyAuthenticate.match(/nonce="([^"]+)"/)[1];
// // // // // // // // // // // //                 // removed for sonnet-3.5 6th attempt
// // // // // // // // // // // //                 // added for sonnet-3.5 6th attempt
// // // // // // // // // // // //                 const nonceMatch = proxyAuthenticate.match(/nonce="([^"]+)"/);

// // // // // // // // // // // //                 if (!nonceMatch) {
// // // // // // // // // // // //                     throw new Error(
// // // // // // // // // // // //                         "Unable to extract nonce from Proxy-Authenticate header"
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }

// // // // // // // // // // // //                 const nonce = nonceMatch[1];
// // // // // // // // // // // //                 // added for sonnet-3.5 6th attempt

// // // // // // // // // // // //                 const authorization = generateAuthorization(
// // // // // // // // // // // //                     this.sipInfo,
// // // // // // // // // // // //                     nonce,
// // // // // // // // // // // //                     `INVITE`
// // // // // // // // // // // //                     // removed for sonnet-3.5 6th attempt
// // // // // // // // // // // //                     // `INVITE sip:${callee}@${this.sipInfo.domain}`
// // // // // // // // // // // //                     // removed for sonnet-3.5 6th attempt
// // // // // // // // // // // //                 );

// // // // // // // // // // // //                 inviteMessage = this.createInviteMessage(
// // // // // // // // // // // //                     callee,
// // // // // // // // // // // //                     offerSDP,
// // // // // // // // // // // //                     authorization
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 response = await this.send(inviteMessage, true);
// // // // // // // // // // // //                 console.log(
// // // // // // // // // // // //                     `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // // // //                     response
// // // // // // // // // // // //                 );
// // // // // // // // // // // //             }

// // // // // // // // // // // //             if (response && response.subject.startsWith("SIP/2.0 1")) {
// // // // // // // // // // // //                 // Provisional response, wait for final response
// // // // // // // // // // // //                 const finalResponse = await this.waitForFinalResponse(
// // // // // // // // // // // //                     inviteMessage.headers["Call-Id"]
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                     this,
// // // // // // // // // // // //                     finalResponse
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 this.currentCallSession = outboundCallSession;

// // // // // // // // // // // //                 // added for sonnet-3.5 10th attempt
// // // // // // // // // // // //                 outboundCallSession.on("ringing", () => this.emit("ringing"));
// // // // // // // // // // // //                 outboundCallSession.on("accepted", () => this.emit("accepted"));
// // // // // // // // // // // //                 outboundCallSession.on("ended", () => this.emit("ended"));
// // // // // // // // // // // //                 // added for sonnet-3.5 10th attempt

// // // // // // // // // // // //                 await outboundCallSession.init();
// // // // // // // // // // // //                 return outboundCallSession;
// // // // // // // // // // // //             } else if (response && response.subject.startsWith("SIP/2.0 2")) {
// // // // // // // // // // // //                 // Success response
// // // // // // // // // // // //                 const outboundCallSession = new OutboundCallSession(
// // // // // // // // // // // //                     this,
// // // // // // // // // // // //                     response
// // // // // // // // // // // //                 );
// // // // // // // // // // // //                 this.currentCallSession = outboundCallSession;
// // // // // // // // // // // //                 await outboundCallSession.init();
// // // // // // // // // // // //                 return outboundCallSession;
// // // // // // // // // // // //             } else {
// // // // // // // // // // // //                 throw new Error(
// // // // // // // // // // // //                     `Call failed: ${response ? response.subject : "No response"}`
// // // // // // // // // // // //                 );
// // // // // // // // // // // //             }
// // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // // // //             throw error;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }
// // // // // // // // // // // //     // added for sonnet-3.5 6th attempt

// // // // // // // // // // // //     private waitForFinalResponse(callId: string): Promise<InboundMessage> {
// // // // // // // // // // // //         return new Promise((resolve, reject) => {
// // // // // // // // // // // //             const timeout = setTimeout(
// // // // // // // // // // // //                 () => reject(new Error("Timeout waiting for final response")),
// // // // // // // // // // // //                 30000
// // // // // // // // // // // //             );
// // // // // // // // // // // //             const handler = (message: InboundMessage) => {
// // // // // // // // // // // //                 if (
// // // // // // // // // // // //                     message.headers["Call-Id"] === callId &&
// // // // // // // // // // // //                     !message.subject.startsWith("SIP/2.0 1")
// // // // // // // // // // // //                 ) {
// // // // // // // // // // // //                     clearTimeout(timeout);
// // // // // // // // // // // //                     this.removeListener("message", handler);
// // // // // // // // // // // //                     resolve(message);
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             };
// // // // // // // // // // // //             this.on("message", handler);
// // // // // // // // // // // //         });
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // // // // // // // // // //     // public async hangup(): Promise<void> {
// // // // // // // // // // // //     //     if (this.currentCallSession) {
// // // // // // // // // // // //     //         console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //     //         await this.currentCallSession.hangup();
// // // // // // // // // // // //     //         this.currentCallSession = undefined;
// // // // // // // // // // // //     //         this.finalizeRecording();
// // // // // // // // // // // //     //         this.emit("callEnded");
// // // // // // // // // // // //     //         console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //     //     } else {
// // // // // // // // // // // //     //         console.log("No active call to hang up");
// // // // // // // // // // // //     //     }
// // // // // // // // // // // //     // }

// // // // // // // // // // // //     // removed after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Sending BYE message to hang up call");
// // // // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // // // //             // removed for sonnet-3.5 10th attempt
// // // // // // // // // // // //             // added for sonnet-3.5 7th attempt
// // // // // // // // // // // //             // this.currentCallSession.dispose();
// // // // // // // // // // // //             // added for sonnet-3.5 7th attempt
// // // // // // // // // // // //             // removed for sonnet-3.5 10th attempt
// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // // // //             console.log("Call ended, emitted callEnded event");
// // // // // // // // // // // //             // added for sonnet-3.5 10th attempt
// // // // // // // // // // // //             this.emit("ended");
// // // // // // // // // // // //             // added for sonnet-3.5 10th attempt
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log("No active call to hang up");
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // // // //             console.log("Remote hangup detected");
// // // // // // // // // // // //             // added for sonnet-3.5 9th attempt
// // // // // // // // // // // //             this.currentCallSession.dispose();
// // // // // // // // // // // //             // added for sonnet-3.5 9th attempt

// // // // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // // // //             // removed for sonnet-3.5 10th attempt
// // // // // // // // // // // //             // this.emit("callEnded");
// // // // // // // // // // // //             // removed for sonnet-3.5 10th attempt
// // // // // // // // // // // //             console.log("Emitting callEnded event after remote hangup");
// // // // // // // // // // // //             // added for sonnet-3.5 10th attempt
// // // // // // // // // // // //             this.emit("ended");
// // // // // // // // // // // //             // added for sonnet-3.5 10th attempt
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private startRecording(callId: string) {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     private finalizeRecording() {
// // // // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // // // // // //                 this.saveAudioAsOgg();
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // // // //             );
// // // // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // // // //         }
// // // // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // // // //         if (audioData) {
// // // // // // // // // // // //             console.log(
// // // // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // // // //             );
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // removed for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // // // // // // // // //     // public async sendAudio(audioData: Buffer) {
// // // // // // // // // // // //     //     if (this.currentCallSession) {
// // // // // // // // // // // //     //         await this.currentCallSession.sendAudio(audioData);
// // // // // // // // // // // //     //     } else {
// // // // // // // // // // // //     //         console.error("[Softphone] Attempted to send audio without an active call session");
// // // // // // // // // // // //     //     }
// // // // // // // // // // // //     // }

// // // // // // // // // // // //     private handleAudioPacket(packet: RtpPacket) {
// // // // // // // // // // // //         console.log(
// // // // // // // // // // // //             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// // // // // // // // // // // //         );
// // // // // // // // // // // //         this.emit("audioData", packet.payload);
// // // // // // // // // // // //         this.audioStream.write(packet.payload);
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public saveAudioAsOgg() {
// // // // // // // // // // // //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// // // // // // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // // // //                 if (code === 0) {
// // // // // // // // // // // //                     console.log(
// // // // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // // // // // // // // // // //                 } else {
// // // // // // // // // // // //                     console.error(
// // // // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // // // //                     );
// // // // // // // // // // // //                 }
// // // // // // // // // // // //             });
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // // // //         if (
// // // // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // // // //         ) {
// // // // // // // // // // // //             return {
// // // // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // // // //             };
// // // // // // // // // // // //         }
// // // // // // // // // // // //         return null;
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // export default Softphone;
// // // // // // // // // // // // sonnet-3.5 13th attempt
// // // // // // // // // // // ------------ number 15
// // // // // // // // // // import EventEmitter from "events";
// // // // // // // // // // import net from "net";
// // // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // // import * as fs from "fs";
// // // // // // // // // // import * as wav from "wav";

// // // // // // // // // // import WebSocket from "ws";
// // // // // // // // // // import dgram from "dgram";
// // // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // // import path from "path";
// // // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // // //     public client: net.Socket;
// // // // // // // // // //     public fakeDomain: string;
// // // // // // // // // //     public fakeEmail: string;
// // // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // // //     private connected = false;
// // // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // // //         process.cwd(),
// // // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // // //     );
// // // // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // // //         super();
// // // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // // //         }
// // // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // // //         }

// // // // // // // // // //         this.client = new net.Socket();
// // // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // // //             this.connected = true;
// // // // // // // // // //             console.log("[Softphone] SIP client connected");
// // // // // // // // // //         });

// // // // // // // // // //         let cache = "";
// // // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // // //                 return;
// // // // // // // // // //             }

// // // // // // // // // //             const tempMessages = cache
// // // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // // //             cache = "";
// // // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // // //                 }
// // // // // // // // // //             }
// // // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // // //                 if (inboundMsg) {
// // // // // // // // // //                     console.log(
// // // // // // // // // //                         "[Softphone] Received SIP message:",
// // // // // // // // // //                         inboundMsg.subject
// // // // // // // // // //                     );
// // // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // // //                 }
// // // // // // // // // //             }
// // // // // // // // // //         });
// // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // //             }
// // // // // // // // // //         });
// // // // // // // // // //     }

// // // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // // //             console.log("[Softphone] WebSocket client connected");

// // // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // // //                 if (
// // // // // // // // // //                     data.type === "join" &&
// // // // // // // // // //                     data.callId &&
// // // // // // // // // //                     this.currentCallSession
// // // // // // // // // //                 ) {
// // // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // // //                     }
// // // // // // // // // //                 }
// // // // // // // // // //             });

// // // // // // // // // //             ws.on("close", () => {
// // // // // // // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // // // // // // //             });
// // // // // // // // // //         });
// // // // // // // // // //     }

// // // // // // // // // //     public async register() {
// // // // // // // // // //         if (!this.connected) {
// // // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // // //         }
// // // // // // // // // //         const sipRegister = async () => {
// // // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // //                 {
// // // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // //                 }
// // // // // // // // // //             );
// // // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // // //             if (
// // // // // // // // // //                 inboundMessage &&
// // // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // // //             ) {
// // // // // // // // // //                 console.log("[Softphone] Sip Registration successful");
// // // // // // // // // //                 return;
// // // // // // // // // //             }
// // // // // // // // // //             const wwwAuth =
// // // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // // //             if (wwwAuth) {
// // // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // // //                 if (nonce) {
// // // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // // //                         this.sipInfo,
// // // // // // // // // //                         nonce,
// // // // // // // // // //                         "REGISTER"
// // // // // // // // // //                     );
// // // // // // // // // //                     await this.send(newMessage);
// // // // // // // // // //                     console.log(
// // // // // // // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // // // // // // //                     );
// // // // // // // // // //                 }
// // // // // // // // // //             }
// // // // // // // // // //         };
// // // // // // // // // //         await sipRegister();
// // // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // // //             () => {
// // // // // // // // // //                 sipRegister();
// // // // // // // // // //             },
// // // // // // // // // //             3 * 60 * 1000
// // // // // // // // // //         );
// // // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // // //             }
// // // // // // // // // //         });
// // // // // // // // // //     }

// // // // // // // // // //     public enableDebugMode() {
// // // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // // //             console.log(
// // // // // // // // // //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// // // // // // // // // //             )
// // // // // // // // // //         );
// // // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // // //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
// // // // // // // // // //             return tcpWrite(message);
// // // // // // // // // //         };
// // // // // // // // // //     }

// // // // // // // // // //     public revoke() {
// // // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // // //         }
// // // // // // // // // //         this.removeAllListeners();
// // // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // // //         this.client.destroy();
// // // // // // // // // //         console.log("[Softphone] SIP client revoked");
// // // // // // // // // //     }

// // // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // // //         this.client.write(message.toString());
// // // // // // // // // //         if (!waitForReply) {
// // // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // // //         }
// // // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // // //                     return;
// // // // // // // // // //                 }
// // // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // // //                     return;
// // // // // // // // // //                 }
// // // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // // //             };
// // // // // // // // // //             this.on("message", messageListener);
// // // // // // // // // //             setTimeout(
// // // // // // // // // //                 () =>
// // // // // // // // // //                     reject(
// // // // // // // // // //                         new Error("[Softphone] No response received in time")
// // // // // // // // // //                     ),
// // // // // // // // // //                 5000
// // // // // // // // // //             );
// // // // // // // // // //         });
// // // // // // // // // //     }

// // // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // // //         console.log("A[Softphone] nswering incoming call");
// // // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // // //         return inboundCallSession;
// // // // // // // // // //     }

// // // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // // //         console.log("[Softphone] Declining incoming call");
// // // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // // //         await this.send(newMessage);
// // // // // // // // // //     }

// // // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // // //         const offerSDP = `
// // // // // // // // // // v=0
// // // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // // s=rc-softphone-ts
// // // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // // t=0 0
// // // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // // a=sendrecv
// // // // // // // // // //   `.trim();
// // // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // // //             {
// // // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // // //             },
// // // // // // // // // //             offerSDP
// // // // // // // // // //         );
// // // // // // // // // //         console.log(
// // // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // // //         );

// // // // // // // // // //         if (callerId) {
// // // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // // //         }

// // // // // // // // // //         try {
// // // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // // //             console.log(
// // // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // // //                 inboundMessage
// // // // // // // // // //             );

// // // // // // // // // //             if (inboundMessage) {
// // // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // // //                     console.log(
// // // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // // //                         proxyAuthenticate
// // // // // // // // // //                     );

// // // // // // // // // //                     const nonceMatch =
// // // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // // //                     if (nonce) {
// // // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // // //                             generateAuthorization(
// // // // // // // // // //                                 this.sipInfo,
// // // // // // // // // //                                 nonce,
// // // // // // // // // //                                 "INVITE"
// // // // // // // // // //                             );
// // // // // // // // // //                         console.log(
// // // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // // //                             newMessage
// // // // // // // // // //                         );
// // // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // // //                             newMessage,
// // // // // // // // // //                             true
// // // // // // // // // //                         );
// // // // // // // // // //                         console.log(
// // // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // // //                             progressMessage
// // // // // // // // // //                         );

// // // // // // // // // //                         if (progressMessage) {
// // // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // // //                                 this,
// // // // // // // // // //                                 progressMessage
// // // // // // // // // //                             );
// // // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // // //                             return outboundCallSession;
// // // // // // // // // //                         } else {
// // // // // // // // // //                             throw new Error(
// // // // // // // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // // // // // // //                             );
// // // // // // // // // //                         }
// // // // // // // // // //                     } else {
// // // // // // // // // //                         throw new Error(
// // // // // // // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // // //                         );
// // // // // // // // // //                     }
// // // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // // //                     throw new Error(
// // // // // // // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // // // // // // //                     );
// // // // // // // // // //                 } else {
// // // // // // // // // //                     throw new Error(
// // // // // // // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // // // // // // //                     );
// // // // // // // // // //                 }
// // // // // // // // // //             } else {
// // // // // // // // // //                 throw new Error(
// // // // // // // // // //                     "[Softphone] No response received for initial INVITE"
// // // // // // // // // //                 );
// // // // // // // // // //             }
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // // //             throw error;
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // // // // // // //         } else {
// // // // // // // // // //             console.log("[Softphone] No active call to hang up");
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     // 15
// // // // // // // // // //     // private startRecording(callId: string) {
// // // // // // // // // //     //     const audioLogPath = path.join(
// // // // // // // // // //     //         this.audioLogFolder,
// // // // // // // // // //     //         `audio_log_${callId}.raw`
// // // // // // // // // //     //     );
// // // // // // // // // //     //     this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // // //     //     console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // // //     // }

// // // // // // // // // //     // private finalizeRecording() {
// // // // // // // // // //     //     if (this.audioStream) {
// // // // // // // // // //     //         this.audioStream.end(() => {
// // // // // // // // // //     //             console.log(`[Softphone] Finished recording audio`);
// // // // // // // // // //     //             this.saveAudioAsOgg();
// // // // // // // // // //     //         });
// // // // // // // // // //     //     } else {
// // // // // // // // // //     //         console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // // //     //     }
// // // // // // // // // //     // }
// // // // // // // // // //     // 16
// // // // // // // // // //     private startRecording(callId: string) {
// // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // // //         );
// // // // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // // //     }

// // // // // // // // // //     private finalizeRecording() {
// // // // // // // // // //         if (this.audioStream) {
// // // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // // // //                 this.saveAudioAsOgg();
// // // // // // // // // //             });
// // // // // // // // // //         } else {
// // // // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // //             console.log(
// // // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // // //             );
// // // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // // //             if (this.audioStream) {
// // // // // // // // // //                 this.audioStream.write(buffer);
// // // // // // // // // //             } else {
// // // // // // // // // //                 console.warn(
// // // // // // // // // //                     "[Softphone] Audio stream not available for writing"
// // // // // // // // // //                 );
// // // // // // // // // //             }
// // // // // // // // // //         } else {
// // // // // // // // // //             console.warn(
// // // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // // //             );
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // // //             this.audioLogFolder,
// // // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // // //         );
// // // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // // //             console.log(
// // // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // // //             );
// // // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // // //         }
// // // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // //         return null;
// // // // // // // // // //     }

// // // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // // //         if (audioData) {
// // // // // // // // // //             console.log(
// // // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // // //             );
// // // // // // // // // //         } else {
// // // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // // //         }
// // // // // // // // // //     }
// // // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // // //             console.log("[Softphone] Remote hangup detected");
// // // // // // // // // //             // await this.currentCallSession.hangup();
// // // // // // // // // //             (this.currentCallSession as any).dispose(); // Using 'any' to bypass TypeScript protection
// // // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // // //             this.finalizeRecording();
// // // // // // // // // //             this.emit("callEnded");
// // // // // // // // // //             console.log(
// // // // // // // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // // // // // // //             );
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public saveAudioAsWav() {
// // // // // // // // // //         if (!this.audioStream) {
// // // // // // // // // //             console.error("[Softphone] No audio stream available");
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // // // //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // //             console.log(`[Softphone] Converting audio log to .wav format`);
// // // // // // // // // //             const reader = new wav.Reader();
// // // // // // // // // //             const writer = new wav.FileWriter(wavAudioPath, {
// // // // // // // // // //                 channels: 1,
// // // // // // // // // //                 sampleRate: 8000,
// // // // // // // // // //                 bitDepth: 16,
// // // // // // // // // //             });

// // // // // // // // // //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// // // // // // // // // //             writer.on("done", () => {
// // // // // // // // // //                 console.log(
// // // // // // // // // //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// // // // // // // // // //                 );
// // // // // // // // // //                 fs.unlinkSync(rawAudioPath);
// // // // // // // // // //             });
// // // // // // // // // //         } else {
// // // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public saveAudioAsOgg() {
// // // // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // // //                 if (code === 0) {
// // // // // // // // // //                     console.log(
// // // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // // //                     );
// // // // // // // // // //                     fs.unlinkSync(rawAudioPath);
// // // // // // // // // //                 } else {
// // // // // // // // // //                     console.error(
// // // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // // //                     );
// // // // // // // // // //                 }
// // // // // // // // // //             });
// // // // // // // // // //         } else {
// // // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // // //         if (
// // // // // // // // // //             this.currentCallSession &&
// // // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // // //         ) {
// // // // // // // // // //             return {
// // // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // // //             };
// // // // // // // // // //         }
// // // // // // // // // //         return null;
// // // // // // // // // //     }
// // // // // // // // // // }

// // // // // // // // // // export default Softphone;

// // // // // // // // // // 21
// // // // // // // // // import EventEmitter from "events";
// // // // // // // // // import net from "net";
// // // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // // import * as fs from "fs";
// // // // // // // // // import * as wav from "wav";

// // // // // // // // // import WebSocket from "ws";
// // // // // // // // // import dgram from "dgram";
// // // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // // import path from "path";
// // // // // // // // // import { spawn } from "child_process";

// // // // // // // // // class Softphone extends EventEmitter {
// // // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // // //     public client: net.Socket;
// // // // // // // // //     public fakeDomain: string;
// // // // // // // // //     public fakeEmail: string;
// // // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // // //     public socket!: dgram.Socket;
// // // // // // // // //     public packetsReceived: number = 0;
// // // // // // // // //     public bytesReceived: number = 0;
// // // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // // //     private connected = false;
// // // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // // //         process.cwd(),
// // // // // // // // //         "src/data/llpmg/calls"
// // // // // // // // //     );
// // // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // // //         super();
// // // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // // //         }
// // // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // // //         }

// // // // // // // // //         this.client = new net.Socket();
// // // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // // //             this.connected = true;
// // // // // // // // //             console.log("[Softphone] SIP client connected");
// // // // // // // // //         });

// // // // // // // // //         let cache = "";
// // // // // // // // //         this.client.on("data", (data) => {
// // // // // // // // //             cache += data.toString("utf-8");
// // // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // // //                 return;
// // // // // // // // //             }

// // // // // // // // //             const tempMessages = cache
// // // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // // //             cache = "";
// // // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // // //                 }
// // // // // // // // //             }
// // // // // // // // //             for (const message of tempMessages) {
// // // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // // //                 if (inboundMsg) {
// // // // // // // // //                     console.log(
// // // // // // // // //                         "[Softphone] Received SIP message:",
// // // // // // // // //                         inboundMsg.subject
// // // // // // // // //                     );
// // // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // // //                 }
// // // // // // // // //             }
// // // // // // // // //         });
// // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // //             }
// // // // // // // // //         });
// // // // // // // // //     }

// // // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // // //             console.log("[Softphone] WebSocket client connected");

// // // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // // //                 if (
// // // // // // // // //                     data.type === "join" &&
// // // // // // // // //                     data.callId &&
// // // // // // // // //                     this.currentCallSession
// // // // // // // // //                 ) {
// // // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // // //                     }
// // // // // // // // //                 }
// // // // // // // // //             });

// // // // // // // // //             ws.on("close", () => {
// // // // // // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // // // // // //             });
// // // // // // // // //         });
// // // // // // // // //     }

// // // // // // // // //     public async register() {
// // // // // // // // //         if (!this.connected) {
// // // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // // //         }
// // // // // // // // //         const sipRegister = async () => {
// // // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // //                 {
// // // // // // // // //                     "Call-Id": uuid(),
// // // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // //                 }
// // // // // // // // //             );
// // // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // // //             if (
// // // // // // // // //                 inboundMessage &&
// // // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // // //             ) {
// // // // // // // // //                 console.log("[Softphone] Sip Registration successful");
// // // // // // // // //                 return;
// // // // // // // // //             }
// // // // // // // // //             const wwwAuth =
// // // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // // //             if (wwwAuth) {
// // // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // // //                 if (nonce) {
// // // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // // //                         this.sipInfo,
// // // // // // // // //                         nonce,
// // // // // // // // //                         "REGISTER"
// // // // // // // // //                     );
// // // // // // // // //                     await this.send(newMessage);
// // // // // // // // //                     console.log(
// // // // // // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // // // // // //                     );
// // // // // // // // //                 }
// // // // // // // // //             }
// // // // // // // // //         };
// // // // // // // // //         await sipRegister();
// // // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // // //             () => {
// // // // // // // // //                 sipRegister();
// // // // // // // // //             },
// // // // // // // // //             3 * 60 * 1000
// // // // // // // // //         );
// // // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // // //                 this.handleRemoteHangup();
// // // // // // // // //             }
// // // // // // // // //         });
// // // // // // // // //     }

// // // // // // // // //     public enableDebugMode() {
// // // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // // //             console.log(
// // // // // // // // //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// // // // // // // // //             )
// // // // // // // // //         );
// // // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // // //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
// // // // // // // // //             return tcpWrite(message);
// // // // // // // // //         };
// // // // // // // // //     }

// // // // // // // // //     public revoke() {
// // // // // // // // //         if (this.intervalHandle) {
// // // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // // //         }
// // // // // // // // //         this.removeAllListeners();
// // // // // // // // //         this.client.removeAllListeners();
// // // // // // // // //         this.client.destroy();
// // // // // // // // //         console.log("[Softphone] SIP client revoked");
// // // // // // // // //     }

// // // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // // //         this.client.write(message.toString());
// // // // // // // // //         if (!waitForReply) {
// // // // // // // // //             return Promise.resolve(undefined);
// // // // // // // // //         }
// // // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // // //                     return;
// // // // // // // // //                 }
// // // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // // //                     return;
// // // // // // // // //                 }
// // // // // // // // //                 this.off("message", messageListener);
// // // // // // // // //                 resolve(inboundMessage);
// // // // // // // // //             };
// // // // // // // // //             this.on("message", messageListener);
// // // // // // // // //             setTimeout(
// // // // // // // // //                 () =>
// // // // // // // // //                     reject(
// // // // // // // // //                         new Error("[Softphone] No response received in time")
// // // // // // // // //                     ),
// // // // // // // // //                 5000
// // // // // // // // //             );
// // // // // // // // //         });
// // // // // // // // //     }

// // // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // // //         console.log("[Softphone] Answering incoming call");
// // // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // // //         await inboundCallSession.answer();
// // // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // // //         return inboundCallSession;
// // // // // // // // //     }

// // // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // // //         console.log("[Softphone] Declining incoming call");
// // // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // // //         await this.send(newMessage);
// // // // // // // // //     }

// // // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // // //         const offerSDP = `
// // // // // // // // // v=0
// // // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // // s=rc-softphone-ts
// // // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // // t=0 0
// // // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // // a=fmtp:101 0-15
// // // // // // // // // a=sendrecv
// // // // // // // // //   `.trim();
// // // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // // //             {
// // // // // // // // //                 "Call-Id": uuid(),
// // // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // // //             },
// // // // // // // // //             offerSDP
// // // // // // // // //         );
// // // // // // // // //         console.log(
// // // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // // //         );

// // // // // // // // //         if (callerId) {
// // // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // // //         }

// // // // // // // // //         try {
// // // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // // //             console.log(
// // // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // // //                 inboundMessage
// // // // // // // // //             );

// // // // // // // // //             if (inboundMessage) {
// // // // // // // // //                 const proxyAuthenticate =
// // // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // // //                     console.log(
// // // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // // //                         proxyAuthenticate
// // // // // // // // //                     );

// // // // // // // // //                     const nonceMatch =
// // // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // // //                     if (nonce) {
// // // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // // //                             generateAuthorization(
// // // // // // // // //                                 this.sipInfo,
// // // // // // // // //                                 nonce,
// // // // // // // // //                                 "INVITE"
// // // // // // // // //                             );
// // // // // // // // //                         console.log(
// // // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // // //                             newMessage
// // // // // // // // //                         );
// // // // // // // // //                         const progressMessage = await this.send(
// // // // // // // // //                             newMessage,
// // // // // // // // //                             true
// // // // // // // // //                         );
// // // // // // // // //                         console.log(
// // // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // // //                             progressMessage
// // // // // // // // //                         );

// // // // // // // // //                         if (progressMessage) {
// // // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // // //                                 this,
// // // // // // // // //                                 progressMessage
// // // // // // // // //                             );
// // // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // // //                             return outboundCallSession;
// // // // // // // // //                         } else {
// // // // // // // // //                             throw new Error(
// // // // // // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // // // // // //                             );
// // // // // // // // //                         }
// // // // // // // // //                     } else {
// // // // // // // // //                         throw new Error(
// // // // // // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // // //                         );
// // // // // // // // //                     }
// // // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // // //                     throw new Error(
// // // // // // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // // // // // //                     );
// // // // // // // // //                 } else {
// // // // // // // // //                     throw new Error(
// // // // // // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // // // // // //                     );
// // // // // // // // //                 }
// // // // // // // // //             } else {
// // // // // // // // //                 throw new Error(
// // // // // // // // //                     "[Softphone] No response received for initial INVITE"
// // // // // // // // //                 );
// // // // // // // // //             }
// // // // // // // // //         } catch (error) {
// // // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // // //             throw error;
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // //             this.finalizeRecording();
// // // // // // // // //             this.emit("callEnded");
// // // // // // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // // // // // //         } else {
// // // // // // // // //             console.log("[Softphone] No active call to hang up");
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     private startRecording(callId: string) {
// // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // //             this.audioLogFolder,
// // // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // // //         );
// // // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // // //     }

// // // // // // // // //     private finalizeRecording() {
// // // // // // // // //         if (this.audioStream) {
// // // // // // // // //             this.audioStream.end(() => {
// // // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // // //                 this.saveAudioAsOgg();
// // // // // // // // //             });
// // // // // // // // //         } else {
// // // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // //             console.log(
// // // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // // //             );
// // // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // // //             if (this.audioStream) {
// // // // // // // // //                 console.log(
// // // // // // // // //                     `[Softphone] Writing audio data to stream, size: ${buffer.length} bytes`
// // // // // // // // //                 );
// // // // // // // // //                 this.audioStream.write(buffer);
// // // // // // // // //             } else {
// // // // // // // // //                 console.warn(
// // // // // // // // //                     "[Softphone] Audio stream not available for writing"
// // // // // // // // //                 );
// // // // // // // // //             }
// // // // // // // // //         } else {
// // // // // // // // //             console.warn(
// // // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // // //             );
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // // //         const audioLogPath = path.join(
// // // // // // // // //             this.audioLogFolder,
// // // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // // //         );
// // // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // // //             console.log(
// // // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // // //             );
// // // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // // //         }
// // // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // //         return null;
// // // // // // // // //     }

// // // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // // //         if (audioData) {
// // // // // // // // //             console.log(
// // // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // // //             );
// // // // // // // // //         } else {
// // // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     private handleRemoteHangup() {
// // // // // // // // //         if (this.currentCallSession) {
// // // // // // // // //             console.log("[Softphone] Remote hangup detected");
// // // // // // // // //             this.currentCallSession.dispose();
// // // // // // // // //             this.currentCallSession = undefined;
// // // // // // // // //             this.finalizeRecording();
// // // // // // // // //             this.emit("callEnded");
// // // // // // // // //             console.log(
// // // // // // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // // // // // //             );
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public saveAudioAsWav() {
// // // // // // // // //         if (!this.audioStream) {
// // // // // // // // //             console.error("[Softphone] No audio stream available");
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // // //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // //             console.log(`[Softphone] Converting audio log to .wav format`);
// // // // // // // // //             const reader = new wav.Reader();
// // // // // // // // //             const writer = new wav.FileWriter(wavAudioPath, {
// // // // // // // // //                 channels: 1,
// // // // // // // // //                 sampleRate: 8000,
// // // // // // // // //                 bitDepth: 16,
// // // // // // // // //             });

// // // // // // // // //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// // // // // // // // //             writer.on("done", () => {
// // // // // // // // //                 console.log(
// // // // // // // // //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// // // // // // // // //                 );
// // // // // // // // //                 fs.unlinkSync(rawAudioPath);
// // // // // // // // //             });
// // // // // // // // //         } else {
// // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public saveAudioAsOgg() {
// // // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // // // // // // // //             ffmpeg.on("close", (code) => {
// // // // // // // // //                 if (code === 0) {
// // // // // // // // //                     console.log(
// // // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // // //                     );
// // // // // // // // //                     fs.unlinkSync(rawAudioPath);
// // // // // // // // //                 } else {
// // // // // // // // //                     console.error(
// // // // // // // // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // // // // // // // //                     );
// // // // // // // // //                 }
// // // // // // // // //             });
// // // // // // // // //         } else {
// // // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // // //         }
// // // // // // // // //     }

// // // // // // // // //     public getCallStats(callId: string): any {
// // // // // // // // //         if (
// // // // // // // // //             this.currentCallSession &&
// // // // // // // // //             this.currentCallSession.callId === callId
// // // // // // // // //         ) {
// // // // // // // // //             return {
// // // // // // // // //                 duration: Date.now() - this.currentCallSession.startTime,
// // // // // // // // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // // // // // // // //                 bytesSent: this.currentCallSession.bytesSent,
// // // // // // // // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // // // // // // // //                 packetsSent: this.currentCallSession.packetsSent,
// // // // // // // // //             };
// // // // // // // // //         }
// // // // // // // // //         return null;
// // // // // // // // //     }
// // // // // // // // // }

// // // // // // // // // export default Softphone;

// // // // // // // // // 22
// // // // // // // // import EventEmitter from "events";
// // // // // // // // import net from "net";
// // // // // // // // import waitFor from "wait-for-async";
// // // // // // // // import * as fs from "fs";
// // // // // // // // import * as wav from "wav";
// // // // // // // // import WebSocket from "ws";
// // // // // // // // import dgram from "dgram";
// // // // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // // // import type { Server as HttpServer } from "http";
// // // // // // // // import path from "path";
// // // // // // // // import { spawn } from "child_process";

// // // // // // // // class Softphone extends EventEmitter {
// // // // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // // // //     public sipInfo: SipInfoResponse;
// // // // // // // //     public client: net.Socket;
// // // // // // // //     public fakeDomain: string;
// // // // // // // //     public fakeEmail: string;
// // // // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // // // //     public socket!: dgram.Socket;
// // // // // // // //     public packetsReceived: number = 0;
// // // // // // // //     public bytesReceived: number = 0;
// // // // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // // // //     private connected = false;
// // // // // // // //     private audioLogFolder: string = path.join(
// // // // // // // //         process.cwd(),
// // // // // // // //         "src/data/llpmg/calls"
// // // // // // // //     );
// // // // // // // //     private audioStream!: fs.WriteStream;

// // // // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // // // //         super();
// // // // // // // //         this.sipInfo = sipInfo;
// // // // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // // // //         if (!this.sipInfo.domain) {
// // // // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // // // //         }
// // // // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // // // //         }

// // // // // // // //         this.client = new net.Socket();
// // // // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // // // //             this.connected = true;
// // // // // // // //             console.log("[Softphone] SIP client connected");
// // // // // // // //         });

// // // // // // // //         let cache = "";
// // // // // // // //         this.client.on("data", (data) => {
// // // // // // // //             cache += data.toString("utf-8");
// // // // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // // // //                 return;
// // // // // // // //             }

// // // // // // // //             const tempMessages = cache
// // // // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // // // //                 .filter((message) => message.trim() !== "");
// // // // // // // //             cache = "";
// // // // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // // // //                 }
// // // // // // // //             }
// // // // // // // //             for (const message of tempMessages) {
// // // // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // // // //                 if (inboundMsg) {
// // // // // // // //                     console.log(
// // // // // // // //                         "[Softphone] Received SIP message:",
// // // // // // // //                         inboundMsg.subject
// // // // // // // //                     );
// // // // // // // //                     this.emit("message", inboundMsg);
// // // // // // // //                 }
// // // // // // // //             }
// // // // // // // //         });
// // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // //                 this.handleRemoteHangup();
// // // // // // // //             }
// // // // // // // //         });
// // // // // // // //     }

// // // // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // // // //             console.log("[Softphone] WebSocket client connected");

// // // // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // // // //                 const data = JSON.parse(message.toString());
// // // // // // // //                 if (
// // // // // // // //                     data.type === "join" &&
// // // // // // // //                     data.callId &&
// // // // // // // //                     this.currentCallSession
// // // // // // // //                 ) {
// // // // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // // // //                     }
// // // // // // // //                 }
// // // // // // // //             });

// // // // // // // //             ws.on("close", () => {
// // // // // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // // // // //             });
// // // // // // // //         });
// // // // // // // //     }

// // // // // // // //     public async register() {
// // // // // // // //         if (!this.connected) {
// // // // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // // // //         }
// // // // // // // //         const sipRegister = async () => {
// // // // // // // //             const requestMessage = new RequestMessage(
// // // // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // // // //                 {
// // // // // // // //                     "Call-Id": uuid(),
// // // // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // //                 }
// // // // // // // //             );
// // // // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // // // //             if (
// // // // // // // //                 inboundMessage &&
// // // // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // // // //             ) {
// // // // // // // //                 console.log("[Softphone] Sip Registration successful");
// // // // // // // //                 return;
// // // // // // // //             }
// // // // // // // //             const wwwAuth =
// // // // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // // // //             if (wwwAuth) {
// // // // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // // // //                 if (nonce) {
// // // // // // // //                     const newMessage = requestMessage.fork();
// // // // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // // // //                         this.sipInfo,
// // // // // // // //                         nonce,
// // // // // // // //                         "REGISTER"
// // // // // // // //                     );
// // // // // // // //                     await this.send(newMessage);
// // // // // // // //                     console.log(
// // // // // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // // // // //                     );
// // // // // // // //                 }
// // // // // // // //             }
// // // // // // // //         };
// // // // // // // //         await sipRegister();
// // // // // // // //         this.intervalHandle = setInterval(
// // // // // // // //             () => {
// // // // // // // //                 sipRegister();
// // // // // // // //             },
// // // // // // // //             3 * 60 * 1000
// // // // // // // //         );
// // // // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // // // //                 this.emit("invite", inboundMessage);
// // // // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // // // //                 this.handleRemoteHangup();
// // // // // // // //             }
// // // // // // // //         });
// // // // // // // //     }

// // // // // // // //     public enableDebugMode() {
// // // // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // // // //             console.log(
// // // // // // // //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// // // // // // // //             )
// // // // // // // //         );
// // // // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // // // //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
// // // // // // // //             return tcpWrite(message);
// // // // // // // //         };
// // // // // // // //     }

// // // // // // // //     public revoke() {
// // // // // // // //         if (this.intervalHandle) {
// // // // // // // //             clearInterval(this.intervalHandle);
// // // // // // // //         }
// // // // // // // //         this.removeAllListeners();
// // // // // // // //         this.client.removeAllListeners();
// // // // // // // //         this.client.destroy();
// // // // // // // //         console.log("[Softphone] SIP client revoked");
// // // // // // // //     }

// // // // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // // // //         this.client.write(message.toString());
// // // // // // // //         if (!waitForReply) {
// // // // // // // //             return Promise.resolve(undefined);
// // // // // // // //         }
// // // // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // // // //                     return;
// // // // // // // //                 }
// // // // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // // // //                     return;
// // // // // // // //                 }
// // // // // // // //                 this.off("message", messageListener);
// // // // // // // //                 resolve(inboundMessage);
// // // // // // // //             };
// // // // // // // //             this.on("message", messageListener);
// // // // // // // //             setTimeout(
// // // // // // // //                 () =>
// // // // // // // //                     reject(
// // // // // // // //                         new Error("[Softphone] No response received in time")
// // // // // // // //                     ),
// // // // // // // //                 5000
// // // // // // // //             );
// // // // // // // //         });
// // // // // // // //     }

// // // // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // // // //         console.log("[Softphone] Answering incoming call");
// // // // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // // // //         await inboundCallSession.answer();
// // // // // // // //         this.currentCallSession = inboundCallSession;
// // // // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // // // //         return inboundCallSession;
// // // // // // // //     }

// // // // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // // // //         console.log("[Softphone] Declining incoming call");
// // // // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // // // //         await this.send(newMessage);
// // // // // // // //     }

// // // // // // // //     public async call(callee: number, callerId?: number) {
// // // // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // // // //         const offerSDP = `
// // // // // // // // v=0
// // // // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // // // s=rc-softphone-ts
// // // // // // // // c=IN IP4 127.0.0.1
// // // // // // // // t=0 0
// // // // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // // // a=rtpmap:0 PCMU/8000
// // // // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // // // a=fmtp:101 0-15
// // // // // // // // a=sendrecv
// // // // // // // //   `.trim();
// // // // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // // // //         const inviteMessage = new RequestMessage(
// // // // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // // // //             {
// // // // // // // //                 "Call-Id": uuid(),
// // // // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // // // //                 "Content-Type": "application/sdp",
// // // // // // // //             },
// // // // // // // //             offerSDP
// // // // // // // //         );
// // // // // // // //         console.log(
// // // // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // // // //         );

// // // // // // // //         if (callerId) {
// // // // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // // // //         }

// // // // // // // //         try {
// // // // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // // // //             console.log(
// // // // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // // // //                 inboundMessage
// // // // // // // //             );

// // // // // // // //             if (inboundMessage) {
// // // // // // // //                 const proxyAuthenticate =
// // // // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // // // //                 if (proxyAuthenticate) {
// // // // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // // // //                     console.log(
// // // // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // // // //                         proxyAuthenticate
// // // // // // // //                     );

// // // // // // // //                     const nonceMatch =
// // // // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // // // //                     if (nonce) {
// // // // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // // // //                         const newMessage = inviteMessage.fork();
// // // // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // // // //                             generateAuthorization(
// // // // // // // //                                 this.sipInfo,
// // // // // // // //                                 nonce,
// // // // // // // //                                 "INVITE"
// // // // // // // //                             );
// // // // // // // //                         console.log(
// // // // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // // // //                             newMessage
// // // // // // // //                         );
// // // // // // // //                         const progressMessage = await this.send(
// // // // // // // //                             newMessage,
// // // // // // // //                             true
// // // // // // // //                         );
// // // // // // // //                         console.log(
// // // // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // // // //                             progressMessage
// // // // // // // //                         );

// // // // // // // //                         if (progressMessage) {
// // // // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // // // //                                 this,
// // // // // // // //                                 progressMessage
// // // // // // // //                             );
// // // // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // // // //                             return outboundCallSession;
// // // // // // // //                         } else {
// // // // // // // //                             throw new Error(
// // // // // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // // // // //                             );
// // // // // // // //                         }
// // // // // // // //                     } else {
// // // // // // // //                         throw new Error(
// // // // // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // // // // //                         );
// // // // // // // //                     }
// // // // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // // // //                     throw new Error(
// // // // // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // // // // //                     );
// // // // // // // //                 } else {
// // // // // // // //                     throw new Error(
// // // // // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // // // // //                     );
// // // // // // // //                 }
// // // // // // // //             } else {
// // // // // // // //                 throw new Error(
// // // // // // // //                     "[Softphone] No response received for initial INVITE"
// // // // // // // //                 );
// // // // // // // //             }
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // // // //             throw error;
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     public async hangup(): Promise<void> {
// // // // // // // //         if (this.currentCallSession) {
// // // // // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // // // // //             await this.currentCallSession.hangup();
// // // // // // // //             this.currentCallSession = undefined;
// // // // // // // //             this.finalizeRecording();
// // // // // // // //             this.emit("callEnded");
// // // // // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // // // // //         } else {
// // // // // // // //             console.log("[Softphone] No active call to hang up");
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     private startRecording(callId: string) {
// // // // // // // //         const audioLogPath = path.join(
// // // // // // // //             this.audioLogFolder,
// // // // // // // //             `audio_log_${callId}.raw`
// // // // // // // //         );
// // // // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // // // //     }

// // // // // // // //     private finalizeRecording() {
// // // // // // // //         if (this.audioStream) {
// // // // // // // //             this.audioStream.end(() => {
// // // // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // // // //                 // this.saveAudioAsOgg();
// // // // // // // //                 this.saveAudioAsWav();
// // // // // // // //             });
// // // // // // // //         } else {
// // // // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // // // //         if (this.currentCallSession) {
// // // // // // // //             console.log(
// // // // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // // // //             );
// // // // // // // //             const buffer = Buffer.from(audioData);
// // // // // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // // // // //             if (this.audioStream) {
// // // // // // // //                 this.audioStream.write(buffer);
// // // // // // // //             } else {
// // // // // // // //                 console.warn(
// // // // // // // //                     "[Softphone] Audio stream not available for writing"
// // // // // // // //                 );
// // // // // // // //             }
// // // // // // // //         } else {
// // // // // // // //             console.warn(
// // // // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // // // //             );
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // // // // //         const audioLogPath = path.join(
// // // // // // // //             this.audioLogFolder,
// // // // // // // //             `audio_log_${callId}.ogg`
// // // // // // // //         );
// // // // // // // //         if (fs.existsSync(audioLogPath)) {
// // // // // // // //             console.log(
// // // // // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // // // // //             );
// // // // // // // //             return fs.readFileSync(audioLogPath);
// // // // // // // //         }
// // // // // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // //         return null;
// // // // // // // //     }

// // // // // // // //     public playAudioLog(callId: string): void {
// // // // // // // //         const audioData = this.getAudioLog(callId);
// // // // // // // //         if (audioData) {
// // // // // // // //             console.log(
// // // // // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // // // // //             );
// // // // // // // //         } else {
// // // // // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     private handleRemoteHangup() {
// // // // // // // //         if (this.currentCallSession) {
// // // // // // // //             console.log("[Softphone] Remote hangup detected");
// // // // // // // //             this.currentCallSession.dispose();
// // // // // // // //             this.currentCallSession = undefined;
// // // // // // // //             this.finalizeRecording();
// // // // // // // //             this.emit("callEnded");
// // // // // // // //             console.log(
// // // // // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // // // // //             );
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     public saveAudioAsWav() {
// // // // // // // //         if (!this.audioStream) {
// // // // // // // //             console.error("[Softphone] No audio stream available");
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // //             console.log(`[Softphone] Converting audio log to .wav format`);
// // // // // // // //             const reader = new wav.Reader();
// // // // // // // //             const writer = new wav.FileWriter(wavAudioPath, {
// // // // // // // //                 channels: 1,
// // // // // // // //                 sampleRate: 8000,
// // // // // // // //                 bitDepth: 16,
// // // // // // // //             });

// // // // // // // //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// // // // // // // //             writer.on("done", () => {
// // // // // // // //                 console.log(
// // // // // // // //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// // // // // // // //                 );
// // // // // // // //                 fs.unlinkSync(rawAudioPath);
// // // // // // // //             });
// // // // // // // //         } else {
// // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // //         }
// // // // // // // //     }

// // // // // // // //     private saveAudioAsOgg() {
// // // // // // // //         if (!this.audioStream) {
// // // // // // // //             console.error("[Softphone] No audio stream available");
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // // // // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // // // // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // // // // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // // // // // // //             const ffmpegProcess = spawn("ffmpeg", [
// // // // // // // //                 "-i",
// // // // // // // //                 rawAudioPath,
// // // // // // // //                 oggAudioPath,
// // // // // // // //             ]);

// // // // // // // //             ffmpegProcess.on("error", (error) => {
// // // // // // // //                 console.error(
// // // // // // // //                     "[Softphone] ffmpeg process encountered an error:",
// // // // // // // //                     error
// // // // // // // //                 );
// // // // // // // //             });

// // // // // // // //             ffmpegProcess.on("close", (code) => {
// // // // // // // //                 if (code === 0) {
// // // // // // // //                     console.log(
// // // // // // // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // // // // // // //                     );
// // // // // // // //                     fs.unlinkSync(rawAudioPath);
// // // // // // // //                 } else {
// // // // // // // //                     console.error(
// // // // // // // //                         `[Softphone] ffmpeg process exited with code ${code}`
// // // // // // // //                     );
// // // // // // // //                 }
// // // // // // // //             });
// // // // // // // //         } else {
// // // // // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // // // // //         }
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // export default Softphone;

// // // 23 wav wab
// // import EventEmitter from "events";
// // import net from "net";
// // import waitFor from "wait-for-async";
// // import * as fs from "fs";
// // import * as wav from "wav";
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
// //             console.log("[Softphone] SIP client connected");
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
// //                     console.log(
// //                         "[Softphone] Received SIP message:",
// //                         inboundMsg.subject
// //                     );
// //                     this.emit("message", inboundMsg);
// //                 }
// //             }
// //         });
// //         this.on("message", (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// //                 console.log("[Softphone] Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("[Softphone] Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public initializeWebSocket(server: HttpServer) {
// //         this.webSocketServer = new WebSocket.Server({ server });

// //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// //             console.log("[Softphone] WebSocket client connected");

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
// //                 console.log("[Softphone] WebSocket client disconnected");
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
// //                 console.log("[Softphone] Sip Registration successful");
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
// //                         "[Softphone] SIP registration with authentication successful"
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
// //                 console.log("[Softphone] Incoming call detected");
// //                 this.lastInviteMessage = inboundMessage;
// //                 this.emit("invite", inboundMessage);
// //             } else if (inboundMessage.subject.startsWith("BYE")) {
// //                 console.log("[Softphone] Received BYE message, ending call");
// //                 this.handleRemoteHangup();
// //             }
// //         });
// //     }

// //     public enableDebugMode() {
// //         this.on("message", (message: InboundMessage) =>
// //             console.log(
// //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// //             )
// //         );
// //         const tcpWrite = this.client.write.bind(this.client);
// //         this.client.write = (message: string | Uint8Array) => {
// //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
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
// //         console.log("[Softphone] SIP client revoked");
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
// //                 () =>
// //                     reject(
// //                         new Error("[Softphone] No response received in time")
// //                     ),
// //                 5000
// //             );
// //         });
// //     }

// //     public async answer(inviteMessage: InboundMessage) {
// //         console.log("[Softphone] Answering incoming call");
// //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// //         await inboundCallSession.answer();
// //         this.currentCallSession = inboundCallSession;
// //         this.startRecording(inboundCallSession.callId);
// //         return inboundCallSession;
// //     }

// //     public async decline(inviteMessage: InboundMessage) {
// //         console.log("[Softphone] Declining incoming call");
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
// //                                 "[Softphone] No response received for authenticated INVITE"
// //                             );
// //                         }
// //                     } else {
// //                         throw new Error(
// //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// //                         );
// //                     }
// //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// //                     throw new Error(
// //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// //                     );
// //                 } else {
// //                     throw new Error(
// //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// //                     );
// //                 }
// //             } else {
// //                 throw new Error(
// //                     "[Softphone] No response received for initial INVITE"
// //                 );
// //             }
// //         } catch (error) {
// //             console.error(`[Softphone] Error during call setup:`, error);
// //             throw error;
// //         }
// //     }

// //     public async hangup(): Promise<void> {
// //         if (this.currentCallSession) {
// //             console.log("[Softphone] Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log("[Softphone] Call ended, emitted callEnded event");
// //         } else {
// //             console.log("[Softphone] No active call to hang up");
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
// //                 this.saveAudioAsWav(); // Save as WAV instead of OGG
// //             });
// //         } else {
// //             console.warn(`[Softphone] No active audio stream to finalize`);
// //         }
// //     }

// //     public async sendAudio(audioData: ArrayBuffer) {
// //         if (this.currentCallSession) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// //             );
// //             const buffer = Buffer.from(audioData);
// //             await this.currentCallSession.sendAudio(buffer);
// //             if (this.audioStream) {
// //                 this.audioStream.write(buffer);
// //             } else {
// //                 console.warn(
// //                     "[Softphone] Audio stream not available for writing"
// //                 );
// //             }
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     public getAudioLog(callId: string): Buffer | null {
// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${callId}.wav` // Update to WAV format
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
// //             console.log("[Softphone] Remote hangup detected");
// //             this.currentCallSession.dispose();
// //             this.currentCallSession = undefined;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log(
// //                 "[Softphone] Emitting callEnded event after remote hangup"
// //             );
// //         }
// //     }

// //     public saveAudioAsWav() {
// //         if (!this.audioStream) {
// //             console.error("[Softphone] No audio stream available");
// //             return;
// //         }

// //         const rawAudioPath = this.audioStream.path.toString();
// //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .wav format`);
// //             const reader = new wav.Reader();
// //             const writer = new wav.FileWriter(wavAudioPath, {
// //                 channels: 1,
// //                 sampleRate: 8000,
// //                 bitDepth: 16,
// //             });

// //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// //             writer.on("done", () => {
// //                 console.log(
// //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// //                 );
// //                 fs.unlinkSync(rawAudioPath);
// //             });
// //         } else {
// //             console.error(`[Softphone] No raw audio log found for conversion`);
// //         }
// //     }
// // }

// // export default Softphone;

// // // // // // //23 raw raw
// // // // // // import EventEmitter from "events";
// // // // // // import net from "net";
// // // // // // import waitFor from "wait-for-async";
// // // // // // import * as fs from "fs";
// // // // // // import WebSocket from "ws";
// // // // // // import dgram from "dgram";
// // // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // // import type { OutboundMessage } from "./sip-message";
// // // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // // import InboundCallSession from "./call-session/inbound";
// // // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // // import type { Server as HttpServer } from "http";
// // // // // // import path from "path";

// // // // // // class Softphone extends EventEmitter {
// // // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // // //     public sipInfo: SipInfoResponse;
// // // // // //     public client: net.Socket;
// // // // // //     public fakeDomain: string;
// // // // // //     public fakeEmail: string;
// // // // // //     public lastInviteMessage?: InboundMessage;
// // // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // // //     public socket!: dgram.Socket;
// // // // // //     public packetsReceived: number = 0;
// // // // // //     public bytesReceived: number = 0;
// // // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // // //     private connected = false;
// // // // // //     private audioLogFolder: string = path.join(
// // // // // //         process.cwd(),
// // // // // //         "src/data/llpmg/calls"
// // // // // //     );
// // // // // //     private audioStream: fs.WriteStream | null = null;

// // // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // // //         super();
// // // // // //         this.sipInfo = sipInfo;
// // // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // // //         if (!this.sipInfo.domain) {
// // // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // // //         }
// // // // // //         if (!this.sipInfo.outboundProxy) {
// // // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // // //         }

// // // // // //         this.client = new net.Socket();
// // // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // // //             this.connected = true;
// // // // // //             console.log("[Softphone] SIP client connected");
// // // // // //         });

// // // // // //         let cache = "";
// // // // // //         this.client.on("data", (data) => {
// // // // // //             cache += data.toString("utf-8");
// // // // // //             if (!cache.endsWith("\r\n")) {
// // // // // //                 return;
// // // // // //             }

// // // // // //             const tempMessages = cache
// // // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // // //                 .filter((message) => message.trim() !== "");
// // // // // //             cache = "";
// // // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // // //                 }
// // // // // //             }
// // // // // //             for (const message of tempMessages) {
// // // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // // //                 if (inboundMsg) {
// // // // // //                     console.log(
// // // // // //                         "[Softphone] Received SIP message:",
// // // // // //                         inboundMsg.subject
// // // // // //                     );
// // // // // //                     this.emit("message", inboundMsg);
// // // // // //                 }
// // // // // //             }
// // // // // //         });

// // // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // // //                 console.log("[Softphone] Incoming call detected");
// // // // // //                 this.lastInviteMessage = inboundMessage;
// // // // // //                 this.emit("invite", inboundMessage);
// // // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // // //                 this.handleRemoteHangup();
// // // // // //             }
// // // // // //         });
// // // // // //     }

// // // // // //     public initializeWebSocket(server: HttpServer) {
// // // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // // //             console.log("[Softphone] WebSocket client connected");

// // // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // // //                 const data = JSON.parse(message.toString());
// // // // // //                 if (
// // // // // //                     data.type === "join" &&
// // // // // //                     data.callId &&
// // // // // //                     this.currentCallSession
// // // // // //                 ) {
// // // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // // //                     }
// // // // // //                 }
// // // // // //             });

// // // // // //             ws.on("close", () => {
// // // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // // //             });
// // // // // //         });
// // // // // //     }

// // // // // //     public async register() {
// // // // // //         if (!this.connected) {
// // // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // // //         }
// // // // // //         const sipRegister = async () => {
// // // // // //             const requestMessage = new RequestMessage(
// // // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // // //                 {
// // // // // //                     "Call-Id": uuid(),
// // // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // //                 }
// // // // // //             );
// // // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // // //             if (
// // // // // //                 inboundMessage &&
// // // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // // //             ) {
// // // // // //                 console.log("[Softphone] Sip Registration successful");
// // // // // //                 return;
// // // // // //             }
// // // // // //             const wwwAuth =
// // // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // // //             if (wwwAuth) {
// // // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // // //                 if (nonce) {
// // // // // //                     const newMessage = requestMessage.fork();
// // // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // // //                         this.sipInfo,
// // // // // //                         nonce,
// // // // // //                         "REGISTER"
// // // // // //                     );
// // // // // //                     await this.send(newMessage);
// // // // // //                     console.log(
// // // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // // //                     );
// // // // // //                 }
// // // // // //             }
// // // // // //         };
// // // // // //         await sipRegister();
// // // // // //         this.intervalHandle = setInterval(
// // // // // //             () => {
// // // // // //                 sipRegister();
// // // // // //             },
// // // // // //             3 * 60 * 1000
// // // // // //         );
// // // // // //     }

// // // // // //     public enableDebugMode() {
// // // // // //         this.on("message", (message: InboundMessage) =>
// // // // // //             console.log(
// // // // // //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// // // // // //             )
// // // // // //         );
// // // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // // //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
// // // // // //             return tcpWrite(message);
// // // // // //         };
// // // // // //     }

// // // // // //     public revoke() {
// // // // // //         if (this.intervalHandle) {
// // // // // //             clearInterval(this.intervalHandle);
// // // // // //         }
// // // // // //         this.removeAllListeners();
// // // // // //         this.client.removeAllListeners();
// // // // // //         this.client.destroy();
// // // // // //         console.log("[Softphone] SIP client revoked");
// // // // // //     }

// // // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // // //         this.client.write(message.toString());
// // // // // //         if (!waitForReply) {
// // // // // //             return Promise.resolve(undefined);
// // // // // //         }
// // // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // // //                     return;
// // // // // //                 }
// // // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // // //                     return;
// // // // // //                 }
// // // // // //                 this.off("message", messageListener);
// // // // // //                 resolve(inboundMessage);
// // // // // //             };
// // // // // //             this.on("message", messageListener);
// // // // // //             setTimeout(
// // // // // //                 () =>
// // // // // //                     reject(
// // // // // //                         new Error("[Softphone] No response received in time")
// // // // // //                     ),
// // // // // //                 5000
// // // // // //             );
// // // // // //         });
// // // // // //     }

// // // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // // //         console.log("[Softphone] Answering incoming call");
// // // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // // //         await inboundCallSession.answer();
// // // // // //         this.currentCallSession = inboundCallSession;
// // // // // //         this.startRecording(inboundCallSession.callId);
// // // // // //         return inboundCallSession;
// // // // // //     }

// // // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // // //         console.log("[Softphone] Declining incoming call");
// // // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // // //         await this.send(newMessage);
// // // // // //     }

// // // // // //     public async call(callee: number, callerId?: number) {
// // // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // // //         const offerSDP = `
// // // // // // v=0
// // // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // // s=rc-softphone-ts
// // // // // // c=IN IP4 127.0.0.1
// // // // // // t=0 0
// // // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // // a=rtpmap:0 PCMU/8000
// // // // // // a=rtpmap:101 telephone-event/8000
// // // // // // a=fmtp:101 0-15
// // // // // // a=sendrecv
// // // // // //   `.trim();
// // // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // // //         const inviteMessage = new RequestMessage(
// // // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // // //             {
// // // // // //                 "Call-Id": uuid(),
// // // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // // //                 "Content-Type": "application/sdp",
// // // // // //             },
// // // // // //             offerSDP
// // // // // //         );
// // // // // //         console.log(
// // // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // // //         );

// // // // // //         if (callerId) {
// // // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // // //         }

// // // // // //         try {
// // // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // // //             console.log(
// // // // // //                 `[Softphone] Received response to INVITE:`,
// // // // // //                 inboundMessage
// // // // // //             );

// // // // // //             if (inboundMessage) {
// // // // // //                 const proxyAuthenticate =
// // // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // // //                 if (proxyAuthenticate) {
// // // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // // //                     console.log(
// // // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // // //                         proxyAuthenticate
// // // // // //                     );

// // // // // //                     const nonceMatch =
// // // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // // //                     if (nonce) {
// // // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // // //                         const newMessage = inviteMessage.fork();
// // // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // // //                             generateAuthorization(
// // // // // //                                 this.sipInfo,
// // // // // //                                 nonce,
// // // // // //                                 "INVITE"
// // // // // //                             );
// // // // // //                         console.log(
// // // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // // //                             newMessage
// // // // // //                         );
// // // // // //                         const progressMessage = await this.send(
// // // // // //                             newMessage,
// // // // // //                             true
// // // // // //                         );
// // // // // //                         console.log(
// // // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // // //                             progressMessage
// // // // // //                         );

// // // // // //                         if (progressMessage) {
// // // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // // //                                 this,
// // // // // //                                 progressMessage
// // // // // //                             );
// // // // // //                             this.currentCallSession = outboundCallSession;
// // // // // //                             this.startRecording(outboundCallSession.callId);
// // // // // //                             return outboundCallSession;
// // // // // //                         } else {
// // // // // //                             throw new Error(
// // // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // // //                             );
// // // // // //                         }
// // // // // //                     } else {
// // // // // //                         throw new Error(
// // // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // // //                         );
// // // // // //                     }
// // // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // // //                     throw new Error(
// // // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // // //                     );
// // // // // //                 } else {
// // // // // //                     throw new Error(
// // // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // // //                     );
// // // // // //                 }
// // // // // //             } else {
// // // // // //                 throw new Error(
// // // // // //                     "[Softphone] No response received for initial INVITE"
// // // // // //                 );
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // // //             throw error;
// // // // // //         }
// // // // // //     }

// // // // // //     public async hangup(): Promise<void> {
// // // // // //         if (this.currentCallSession) {
// // // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // // //             await this.currentCallSession.hangup();
// // // // // //             this.currentCallSession = undefined;
// // // // // //             this.finalizeRecording();
// // // // // //             this.emit("callEnded");
// // // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // // //         } else {
// // // // // //             console.log("[Softphone] No active call to hang up");
// // // // // //         }
// // // // // //     }

// // // // // //     private startRecording(callId: string) {
// // // // // //         const audioLogPath = path.join(
// // // // // //             this.audioLogFolder,
// // // // // //             `audio_log_${callId}.raw`
// // // // // //         );
// // // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // // //     }

// // // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // // //         if (this.currentCallSession) {
// // // // // //             console.log(
// // // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // // //             );
// // // // // //             const buffer = Buffer.from(audioData);
// // // // // //             if (this.audioStream) {
// // // // // //                 this.audioStream.write(buffer, (err) => {
// // // // // //                     if (err) {
// // // // // //                         console.error(
// // // // // //                             "[Softphone] Error writing audio data to stream:",
// // // // // //                             err
// // // // // //                         );
// // // // // //                     } else {
// // // // // //                         console.log(
// // // // // //                             "[Softphone] Successfully wrote audio data to stream"
// // // // // //                         );
// // // // // //                     }
// // // // // //                 });
// // // // // //             } else {
// // // // // //                 console.warn(
// // // // // //                     "[Softphone] Audio stream not available for writing"
// // // // // //                 );
// // // // // //             }
// // // // // //         } else {
// // // // // //             console.warn(
// // // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // // //             );
// // // // // //         }
// // // // // //     }

// // // // // //     private finalizeRecording() {
// // // // // //         if (this.audioStream) {
// // // // // //             this.audioStream.end(() => {
// // // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // // //             });
// // // // // //         } else {
// // // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // // //         }
// // // // // //     }

// // // // // //     private handleRemoteHangup() {
// // // // // //         if (this.currentCallSession) {
// // // // // //             console.log("[Softphone] Remote hangup detected");
// // // // // //             this.currentCallSession.dispose();
// // // // // //             this.currentCallSession = undefined;
// // // // // //             this.finalizeRecording();
// // // // // //             this.emit("callEnded");
// // // // // //             console.log(
// // // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // // //             );
// // // // // //         }
// // // // // //     }
// // // // // // }

// // // // // // export default Softphone;

// // // // // // 24
// // // // // import EventEmitter from "events";
// // // // // import net from "net";
// // // // // import waitFor from "wait-for-async";
// // // // // import * as fs from "fs";
// // // // // import * as wav from "wav";
// // // // // import WebSocket from "ws";
// // // // // import dgram from "dgram";
// // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // import type { OutboundMessage } from "./sip-message";
// // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // import InboundCallSession from "./call-session/inbound";
// // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // import type { Server as HttpServer } from "http";
// // // // // import path from "path";
// // // // // import { spawn } from "child_process";

// // // // // class Softphone extends EventEmitter {
// // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // //     public sipInfo: SipInfoResponse;
// // // // //     public client: net.Socket;
// // // // //     public fakeDomain: string;
// // // // //     public fakeEmail: string;
// // // // //     public lastInviteMessage?: InboundMessage;
// // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // //     public socket!: dgram.Socket;
// // // // //     public packetsReceived: number = 0;
// // // // //     public bytesReceived: number = 0;
// // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // //     private connected = false;
// // // // //     private audioLogFolder: string = path.join(
// // // // //         process.cwd(),
// // // // //         "src/data/llpmg/calls"
// // // // //     );
// // // // //     private audioStream!: fs.WriteStream;

// // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // //         super();
// // // // //         this.sipInfo = sipInfo;
// // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // //         if (!this.sipInfo.domain) {
// // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // //         }
// // // // //         if (!this.sipInfo.outboundProxy) {
// // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // //         }

// // // // //         this.client = new net.Socket();
// // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // //             this.connected = true;
// // // // //             console.log("[Softphone] SIP client connected");
// // // // //         });

// // // // //         let cache = "";
// // // // //         this.client.on("data", (data) => {
// // // // //             cache += data.toString("utf-8");
// // // // //             if (!cache.endsWith("\r\n")) {
// // // // //                 return;
// // // // //             }

// // // // //             const tempMessages = cache
// // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // //                 .filter((message) => message.trim() !== "");
// // // // //             cache = "";
// // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // //                 }
// // // // //             }
// // // // //             for (const message of tempMessages) {
// // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // //                 if (inboundMsg) {
// // // // //                     console.log(
// // // // //                         "[Softphone] Received SIP message:",
// // // // //                         inboundMsg.subject
// // // // //                     );
// // // // //                     this.emit("message", inboundMsg);
// // // // //                 }
// // // // //             }
// // // // //         });

// // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // //                 console.log("[Softphone] Incoming call detected");
// // // // //                 this.lastInviteMessage = inboundMessage;
// // // // //                 this.emit("invite", inboundMessage);
// // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // //                 this.handleRemoteHangup();
// // // // //             }
// // // // //         });
// // // // //     }

// // // // //     public initializeWebSocket(server: HttpServer) {
// // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // //             console.log("[Softphone] WebSocket client connected");

// // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // //                 const data = JSON.parse(message.toString());
// // // // //                 if (
// // // // //                     data.type === "join" &&
// // // // //                     data.callId &&
// // // // //                     this.currentCallSession
// // // // //                 ) {
// // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // //                     }
// // // // //                 }
// // // // //             });

// // // // //             ws.on("close", () => {
// // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // //             });
// // // // //         });
// // // // //     }

// // // // //     public async register() {
// // // // //         if (!this.connected) {
// // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // //         }
// // // // //         const sipRegister = async () => {
// // // // //             const requestMessage = new RequestMessage(
// // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // //                 {
// // // // //                     "Call-Id": uuid(),
// // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // //                 }
// // // // //             );
// // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // //             if (
// // // // //                 inboundMessage &&
// // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // //             ) {
// // // // //                 console.log("[Softphone] Sip Registration successful");
// // // // //                 return;
// // // // //             }
// // // // //             const wwwAuth =
// // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // //             if (wwwAuth) {
// // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // //                 if (nonce) {
// // // // //                     const newMessage = requestMessage.fork();
// // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // //                         this.sipInfo,
// // // // //                         nonce,
// // // // //                         "REGISTER"
// // // // //                     );
// // // // //                     await this.send(newMessage);
// // // // //                     console.log(
// // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // //                     );
// // // // //                 }
// // // // //             }
// // // // //         };
// // // // //         await sipRegister();
// // // // //         this.intervalHandle = setInterval(
// // // // //             () => {
// // // // //                 sipRegister();
// // // // //             },
// // // // //             3 * 60 * 1000
// // // // //         );
// // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // //                 console.log("[Softphone] Incoming call detected");
// // // // //                 this.lastInviteMessage = inboundMessage;
// // // // //                 this.emit("invite", inboundMessage);
// // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // //                 this.handleRemoteHangup();
// // // // //             }
// // // // //         });
// // // // //     }

// // // // //     public enableDebugMode() {
// // // // //         this.on("message", (message: InboundMessage) =>
// // // // //             console.log(
// // // // //                 `[Softphone] Receiving...(${new Date()})\n` + message.toString()
// // // // //             )
// // // // //         );
// // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // //             console.log(`[Softphone] Sending...(${new Date()})\n` + message);
// // // // //             return tcpWrite(message);
// // // // //         };
// // // // //     }

// // // // //     public revoke() {
// // // // //         if (this.intervalHandle) {
// // // // //             clearInterval(this.intervalHandle);
// // // // //         }
// // // // //         this.removeAllListeners();
// // // // //         this.client.removeAllListeners();
// // // // //         this.client.destroy();
// // // // //         console.log("[Softphone] SIP client revoked");
// // // // //     }

// // // // //     public send(message: OutboundMessage, waitForReply = false) {
// // // // //         this.client.write(message.toString());
// // // // //         if (!waitForReply) {
// // // // //             return Promise.resolve(undefined);
// // // // //         }
// // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // //                     return;
// // // // //                 }
// // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // //                     return;
// // // // //                 }
// // // // //                 this.off("message", messageListener);
// // // // //                 resolve(inboundMessage);
// // // // //             };
// // // // //             this.on("message", messageListener);
// // // // //             setTimeout(
// // // // //                 () =>
// // // // //                     reject(
// // // // //                         new Error("[Softphone] No response received in time")
// // // // //                     ),
// // // // //                 5000
// // // // //             );
// // // // //         });
// // // // //     }

// // // // //     public async answer(inviteMessage: InboundMessage) {
// // // // //         console.log("[Softphone] Answering incoming call");
// // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // //         await inboundCallSession.answer();
// // // // //         this.currentCallSession = inboundCallSession;
// // // // //         this.startRecording(inboundCallSession.callId);
// // // // //         this.emit("callStarted", inboundCallSession.callId); // Emit event when call is answered
// // // // //         return inboundCallSession;
// // // // //     }

// // // // //     public async decline(inviteMessage: InboundMessage) {
// // // // //         console.log("[Softphone] Declining incoming call");
// // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // //         await this.send(newMessage);
// // // // //     }

// // // // //     public async call(callee: number, callerId?: number) {
// // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // //         const offerSDP = `
// // // // // v=0
// // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // s=rc-softphone-ts
// // // // // c=IN IP4 127.0.0.1
// // // // // t=0 0
// // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // a=rtpmap:0 PCMU/8000
// // // // // a=rtpmap:101 telephone-event/8000
// // // // // a=fmtp:101 0-15
// // // // // a=sendrecv
// // // // //   `.trim();
// // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // //         const inviteMessage = new RequestMessage(
// // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // //             {
// // // // //                 "Call-Id": uuid(),
// // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // //                 "Content-Type": "application/sdp",
// // // // //             },
// // // // //             offerSDP
// // // // //         );
// // // // //         console.log(
// // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // //         );

// // // // //         if (callerId) {
// // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // //         }

// // // // //         try {
// // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // //             console.log(
// // // // //                 `[Softphone] Received response to INVITE:`,
// // // // //                 inboundMessage
// // // // //             );

// // // // //             if (inboundMessage) {
// // // // //                 const proxyAuthenticate =
// // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // //                 if (proxyAuthenticate) {
// // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // //                     console.log(
// // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // //                         proxyAuthenticate
// // // // //                     );

// // // // //                     const nonceMatch =
// // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // //                     if (nonce) {
// // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // //                         const newMessage = inviteMessage.fork();
// // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // //                             generateAuthorization(
// // // // //                                 this.sipInfo,
// // // // //                                 nonce,
// // // // //                                 "INVITE"
// // // // //                             );
// // // // //                         console.log(
// // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // //                             newMessage
// // // // //                         );
// // // // //                         const progressMessage = await this.send(
// // // // //                             newMessage,
// // // // //                             true
// // // // //                         );
// // // // //                         console.log(
// // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // //                             progressMessage
// // // // //                         );

// // // // //                         if (progressMessage) {
// // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // //                                 this,
// // // // //                                 progressMessage
// // // // //                             );
// // // // //                             this.currentCallSession = outboundCallSession;
// // // // //                             this.startRecording(outboundCallSession.callId);
// // // // //                             this.emit(
// // // // //                                 "callStarted",
// // // // //                                 outboundCallSession.callId
// // // // //                             ); // Emit event when call starts
// // // // //                             return outboundCallSession;
// // // // //                         } else {
// // // // //                             throw new Error(
// // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // //                             );
// // // // //                         }
// // // // //                     } else {
// // // // //                         throw new Error(
// // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // //                         );
// // // // //                     }
// // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // //                     throw new Error(
// // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // //                     );
// // // // //                 } else {
// // // // //                     throw new Error(
// // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // //                     );
// // // // //                 }
// // // // //             } else {
// // // // //                 throw new Error(
// // // // //                     "[Softphone] No response received for initial INVITE"
// // // // //                 );
// // // // //             }
// // // // //         } catch (error) {
// // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // //             throw error;
// // // // //         }
// // // // //     }

// // // // //     public async hangup(): Promise<void> {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // //             await this.currentCallSession.hangup();
// // // // //             this.currentCallSession = undefined;
// // // // //             this.finalizeRecording();
// // // // //             this.emit("callEnded");
// // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // //         } else {
// // // // //             console.log("[Softphone] No active call to hang up");
// // // // //         }
// // // // //     }

// // // // //     private startRecording(callId: string) {
// // // // //         const audioLogPath = path.join(
// // // // //             this.audioLogFolder,
// // // // //             `audio_log_${callId}.raw`
// // // // //         );
// // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // //     }

// // // // //     private finalizeRecording() {
// // // // //         if (this.audioStream) {
// // // // //             this.audioStream.end(() => {
// // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // //                 this.saveAudioAsWav();
// // // // //             });
// // // // //         } else {
// // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // //         }
// // // // //     }

// // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log(
// // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // //             );
// // // // //             const buffer = Buffer.from(audioData);
// // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // //             if (this.audioStream) {
// // // // //                 this.audioStream.write(buffer);
// // // // //             } else {
// // // // //                 console.warn(
// // // // //                     "[Softphone] Audio stream not available for writing"
// // // // //                 );
// // // // //             }
// // // // //             this.emit("audioData", buffer); // Emit audio data event
// // // // //         } else {
// // // // //             console.warn(
// // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // //             );
// // // // //         }
// // // // //     }

// // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // //         const audioLogPath = path.join(
// // // // //             this.audioLogFolder,
// // // // //             `audio_log_${callId}.wav`
// // // // //         );
// // // // //         if (fs.existsSync(audioLogPath)) {
// // // // //             console.log(
// // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // //             );
// // // // //             return fs.readFileSync(audioLogPath);
// // // // //         }
// // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // //         return null;
// // // // //     }

// // // // //     public playAudioLog(callId: string): void {
// // // // //         const audioData = this.getAudioLog(callId);
// // // // //         if (audioData) {
// // // // //             console.log(
// // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // //             );
// // // // //         } else {
// // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // //         }
// // // // //     }

// // // // //     private handleRemoteHangup() {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log("[Softphone] Remote hangup detected");
// // // // //             this.currentCallSession.dispose();
// // // // //             this.currentCallSession = undefined;
// // // // //             this.finalizeRecording();
// // // // //             this.emit("callEnded");
// // // // //             console.log(
// // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // //             );
// // // // //         }
// // // // //     }

// // // // //     public saveAudioAsWav() {
// // // // //         if (!this.audioStream) {
// // // // //             console.error("[Softphone] No audio stream available");
// // // // //             return;
// // // // //         }

// // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // //             console.log(`[Softphone] Converting audio log to .wav format`);
// // // // //             const reader = new wav.Reader();
// // // // //             const writer = new wav.FileWriter(wavAudioPath, {
// // // // //                 channels: 1,
// // // // //                 sampleRate: 8000,
// // // // //                 bitDepth: 16,
// // // // //             });

// // // // //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// // // // //             writer.on("done", () => {
// // // // //                 console.log(
// // // // //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// // // // //                 );
// // // // //                 fs.unlinkSync(rawAudioPath);
// // // // //             });
// // // // //         } else {
// // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // //         }
// // // // //     }
// // // // // }

// // // // // export default Softphone;

// // // // // 25 ------------------------
// // // // // import EventEmitter from "events";
// // // // // import net from "net";
// // // // // import waitFor from "wait-for-async";
// // // // // import * as fs from "fs";
// // // // // import * as wav from "wav";
// // // // // import WebSocket from "ws";
// // // // // import dgram from "dgram";
// // // // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // // // import InboundCallSession from "./call-session/inbound";
// // // // // import OutboundCallSession from "./call-session/outbound";
// // // // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // // // import type { Server as HttpServer } from "http";
// // // // // import path from "path";
// // // // // import { spawn } from "child_process";

// // // // // class Softphone extends EventEmitter {
// // // // //     private webSocketServer: WebSocket.Server | null = null;
// // // // //     public sipInfo: SipInfoResponse;
// // // // //     public client: net.Socket;
// // // // //     public fakeDomain: string;
// // // // //     public fakeEmail: string;
// // // // //     public lastInviteMessage?: InboundMessage;
// // // // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // // // //     public socket!: dgram.Socket;
// // // // //     public packetsReceived: number = 0;
// // // // //     public bytesReceived: number = 0;
// // // // //     private intervalHandle: NodeJS.Timeout | null = null;
// // // // //     private connected = false;
// // // // //     private audioLogFolder: string = path.join(
// // // // //         process.cwd(),
// // // // //         "src/data/llpmg/calls"
// // // // //     );
// // // // //     private audioStream!: fs.WriteStream;

// // // // //     constructor(sipInfo: SipInfoResponse) {
// // // // //         super();
// // // // //         this.sipInfo = sipInfo;
// // // // //         this.fakeDomain = uuid() + ".invalid";
// // // // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // // // //         if (!this.sipInfo.domain) {
// // // // //             this.sipInfo.domain = "sip.ringcentral.com";
// // // // //         }
// // // // //         if (!this.sipInfo.outboundProxy) {
// // // // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // // // //         }

// // // // //         this.client = new net.Socket();
// // // // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // // // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // // // //             this.connected = true;
// // // // //             console.log("[Softphone] SIP client connected");
// // // // //         });

// // // // //         let cache = "";
// // // // //         this.client.on("data", (data) => {
// // // // //             cache += data.toString("utf-8");
// // // // //             if (!cache.endsWith("\r\n")) {
// // // // //                 return;
// // // // //             }

// // // // //             const tempMessages = cache
// // // // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // // // //                 .filter((message) => message.trim() !== "");
// // // // //             cache = "";
// // // // //             for (let i = 0; i < tempMessages.length; i++) {
// // // // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // // // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // // // //                 }
// // // // //             }
// // // // //             for (const message of tempMessages) {
// // // // //                 const inboundMsg = InboundMessage.fromString(message);
// // // // //                 if (inboundMsg) {
// // // // //                     console.log(
// // // // //                         "[Softphone] Received SIP message:",
// // // // //                         inboundMsg.subject
// // // // //                     );
// // // // //                     this.emit("message", inboundMsg);
// // // // //                 }
// // // // //             }
// // // // //         });
// // // // //         this.on("message", (inboundMessage: InboundMessage) => {
// // // // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // // // //                 console.log("[Softphone] Incoming call detected");
// // // // //                 this.lastInviteMessage = inboundMessage;
// // // // //                 this.emit("invite", inboundMessage);
// // // // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // // // //                 console.log("[Softphone] Received BYE message, ending call");
// // // // //                 this.handleRemoteHangup();
// // // // //             }
// // // // //         });
// // // // //     }

// // // // //     public initializeWebSocket(server: HttpServer) {
// // // // //         this.webSocketServer = new WebSocket.Server({ server });

// // // // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // // // //             console.log("[Softphone] WebSocket client connected");

// // // // //             ws.on("message", (message: WebSocket.RawData) => {
// // // // //                 const data = JSON.parse(message.toString());
// // // // //                 if (
// // // // //                     data.type === "join" &&
// // // // //                     data.callId &&
// // // // //                     this.currentCallSession
// // // // //                 ) {
// // // // //                     if (this.currentCallSession.callId === data.callId) {
// // // // //                         this.currentCallSession.setWebSocket(ws);
// // // // //                     }
// // // // //                 }
// // // // //             });

// // // // //             ws.on("close", () => {
// // // // //                 console.log("[Softphone] WebSocket client disconnected");
// // // // //             });
// // // // //         });
// // // // //     }

// // // // //     public async register() {
// // // // //         if (!this.connected) {
// // // // //             await waitFor({ interval: 100, condition: () => this.connected });
// // // // //         }
// // // // //         const sipRegister = async () => {
// // // // //             const requestMessage = new RequestMessage(
// // // // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // // // //                 {
// // // // //                     "Call-Id": uuid(),
// // // // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // // // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // //                 }
// // // // //             );
// // // // //             const inboundMessage = await this.send(requestMessage, true);
// // // // //             if (
// // // // //                 inboundMessage &&
// // // // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // // // //             ) {
// // // // //                 console.log("[Softphone] SIP Registration successful");
// // // // //                 return;
// // // // //             }
// // // // //             const wwwAuth =
// // // // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // // // //                 inboundMessage?.headers["WWW-Authenticate"];
// // // // //             if (wwwAuth) {
// // // // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // // // //                 if (nonce) {
// // // // //                     const newMessage = requestMessage.fork();
// // // // //                     newMessage.headers.Authorization = generateAuthorization(
// // // // //                         this.sipInfo,
// // // // //                         nonce,
// // // // //                         "REGISTER"
// // // // //                     );
// // // // //                     await this.send(newMessage);
// // // // //                     console.log(
// // // // //                         "[Softphone] SIP registration with authentication successful"
// // // // //                     );
// // // // //                 }
// // // // //             }
// // // // //         };
// // // // //         await sipRegister();
// // // // //         this.intervalHandle = setInterval(
// // // // //             () => {
// // // // //                 sipRegister();
// // // // //             },
// // // // //             3 * 60 * 1000
// // // // //         );
// // // // //     }

// // // // //     public enableDebugMode() {
// // // // //         this.on("message", (message: InboundMessage) =>
// // // // //             console.log(
// // // // //                 `[Softphone] Receiving...(${new Date()})\n${message.toString()}`
// // // // //             )
// // // // //         );
// // // // //         const tcpWrite = this.client.write.bind(this.client);
// // // // //         this.client.write = (message: string | Uint8Array) => {
// // // // //             console.log(`[Softphone] Sending...(${new Date()})\n${message}`);
// // // // //             return tcpWrite(message);
// // // // //         };
// // // // //     }

// // // // //     public revoke() {
// // // // //         if (this.intervalHandle) {
// // // // //             clearInterval(this.intervalHandle);
// // // // //         }
// // // // //         this.removeAllListeners();
// // // // //         this.client.removeAllListeners();
// // // // //         this.client.destroy();
// // // // //         console.log("[Softphone] SIP client revoked");
// // // // //     }

// // // // //     public send(
// // // // //         message: RequestMessage | ResponseMessage,
// // // // //         waitForReply = false
// // // // //     ): Promise<InboundMessage | undefined> {
// // // // //         this.client.write(message.toString());
// // // // //         if (!waitForReply) {
// // // // //             return Promise.resolve(undefined);
// // // // //         }
// // // // //         return new Promise<InboundMessage>((resolve, reject) => {
// // // // //             const messageListener = (inboundMessage: InboundMessage) => {
// // // // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // // // //                     return;
// // // // //                 }
// // // // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // // // //                     return;
// // // // //                 }
// // // // //                 this.off("message", messageListener);
// // // // //                 resolve(inboundMessage);
// // // // //             };
// // // // //             this.on("message", messageListener);
// // // // //             setTimeout(
// // // // //                 () =>
// // // // //                     reject(
// // // // //                         new Error("[Softphone] No response received in time")
// // // // //                     ),
// // // // //                 5000
// // // // //             );
// // // // //         });
// // // // //     }

// // // // //     public async answer(
// // // // //         inviteMessage: InboundMessage
// // // // //     ): Promise<InboundCallSession> {
// // // // //         console.log("[Softphone] Answering incoming call");
// // // // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // // // //         await inboundCallSession.answer();
// // // // //         this.currentCallSession = inboundCallSession;
// // // // //         this.emit("callStarted", inboundCallSession.callId);
// // // // //         this.startRecording(inboundCallSession.callId);
// // // // //         return inboundCallSession;
// // // // //     }

// // // // //     public async decline(inviteMessage: InboundMessage): Promise<void> {
// // // // //         console.log("[Softphone] Declining incoming call");
// // // // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // // // //         await this.send(newMessage);
// // // // //     }

// // // // //     public async call(
// // // // //         callee: number,
// // // // //         callerId?: number
// // // // //     ): Promise<OutboundCallSession> {
// // // // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // // // //         const offerSDP = `
// // // // // v=0
// // // // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // // // s=rc-softphone-ts
// // // // // c=IN IP4 127.0.0.1
// // // // // t=0 0
// // // // // m=audio ${randomInt()} RTP/AVP 0 101
// // // // // a=rtpmap:0 PCMU/8000
// // // // // a=rtpmap:101 telephone-event/8000
// // // // // a=fmtp:101 0-15
// // // // // a=sendrecv
// // // // //   `.trim();
// // // // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // // // //         const inviteMessage = new RequestMessage(
// // // // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // // // //             {
// // // // //                 "Call-Id": uuid(),
// // // // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // // // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // // // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // // // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // // // //                 "Content-Type": "application/sdp",
// // // // //             },
// // // // //             offerSDP
// // // // //         );
// // // // //         console.log(
// // // // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // // // //         );

// // // // //         if (callerId) {
// // // // //             inviteMessage.headers["P-Asserted-Identity"] =
// // // // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // // // //         }

// // // // //         try {
// // // // //             console.log(`[Softphone] Sending initial INVITE message`);
// // // // //             const inboundMessage = await this.send(inviteMessage, true);
// // // // //             console.log(
// // // // //                 `[Softphone] Received response to INVITE:`,
// // // // //                 inboundMessage
// // // // //             );

// // // // //             if (inboundMessage) {
// // // // //                 const proxyAuthenticate =
// // // // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // // // //                     inboundMessage.headers["proxy-authenticate"];
// // // // //                 if (proxyAuthenticate) {
// // // // //                     console.log(`[Softphone] Proxy authentication required`);
// // // // //                     console.log(
// // // // //                         `[Softphone] Proxy-Authenticate header:`,
// // // // //                         proxyAuthenticate
// // // // //                     );

// // // // //                     const nonceMatch =
// // // // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // // // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // // // //                     if (nonce) {
// // // // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // // // //                         const newMessage = inviteMessage.fork();
// // // // //                         newMessage.headers["Proxy-Authorization"] =
// // // // //                             generateAuthorization(
// // // // //                                 this.sipInfo,
// // // // //                                 nonce,
// // // // //                                 "INVITE"
// // // // //                             );
// // // // //                         console.log(
// // // // //                             `[Softphone] Sending authenticated INVITE:`,
// // // // //                             newMessage
// // // // //                         );
// // // // //                         const progressMessage = await this.send(
// // // // //                             newMessage,
// // // // //                             true
// // // // //                         );
// // // // //                         console.log(
// // // // //                             `[Softphone] Received response to authenticated INVITE:`,
// // // // //                             progressMessage
// // // // //                         );

// // // // //                         if (progressMessage) {
// // // // //                             const outboundCallSession = new OutboundCallSession(
// // // // //                                 this,
// // // // //                                 progressMessage
// // // // //                             );
// // // // //                             this.currentCallSession = outboundCallSession;
// // // // //                             this.emit(
// // // // //                                 "callStarted",
// // // // //                                 outboundCallSession.callId
// // // // //                             );
// // // // //                             this.startRecording(outboundCallSession.callId);
// // // // //                             return outboundCallSession;
// // // // //                         } else {
// // // // //                             throw new Error(
// // // // //                                 "[Softphone] No response received for authenticated INVITE"
// // // // //                             );
// // // // //                         }
// // // // //                     } else {
// // // // //                         throw new Error(
// // // // //                             "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
// // // // //                         );
// // // // //                     }
// // // // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // // // //                     throw new Error(
// // // // //                         `[Softphone] Call rejected: ${inboundMessage.subject}`
// // // // //                     );
// // // // //                 } else {
// // // // //                     throw new Error(
// // // // //                         `[Softphone] Unexpected response: ${inboundMessage.subject}`
// // // // //                     );
// // // // //                 }
// // // // //             } else {
// // // // //                 throw new Error(
// // // // //                     "[Softphone] No response received for initial INVITE"
// // // // //                 );
// // // // //             }
// // // // //         } catch (error) {
// // // // //             console.error(`[Softphone] Error during call setup:`, error);
// // // // //             throw error;
// // // // //         }
// // // // //     }

// // // // //     public async hangup(): Promise<void> {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log("[Softphone] Sending BYE message to hang up call");
// // // // //             await this.currentCallSession.hangup();
// // // // //             this.currentCallSession = undefined;
// // // // //             this.finalizeRecording();
// // // // //             this.emit("callEnded");
// // // // //             console.log("[Softphone] Call ended, emitted callEnded event");
// // // // //         } else {
// // // // //             console.log("[Softphone] No active call to hang up");
// // // // //         }
// // // // //     }

// // // // //     private startRecording(callId: string) {
// // // // //         const audioLogPath = path.join(
// // // // //             this.audioLogFolder,
// // // // //             `audio_log_${callId}.raw`
// // // // //         );
// // // // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // // // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // // // //     }

// // // // //     private finalizeRecording() {
// // // // //         if (this.audioStream) {
// // // // //             this.audioStream.end(() => {
// // // // //                 console.log(`[Softphone] Finished recording audio`);
// // // // //                 this.saveAudioAsWav();
// // // // //             });
// // // // //         } else {
// // // // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // // // //         }
// // // // //     }

// // // // //     public async sendAudio(audioData: ArrayBuffer) {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log(
// // // // //                 `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
// // // // //             );
// // // // //             const buffer = Buffer.from(audioData);
// // // // //             await this.currentCallSession.sendAudio(buffer);
// // // // //             if (this.audioStream) {
// // // // //                 this.audioStream.write(buffer);
// // // // //             } else {
// // // // //                 console.warn(
// // // // //                     "[Softphone] Audio stream not available for writing"
// // // // //                 );
// // // // //             }
// // // // //         } else {
// // // // //             console.warn(
// // // // //                 "[Softphone] Attempted to send audio without an active call session"
// // // // //             );
// // // // //         }
// // // // //     }

// // // // //     public getAudioLog(callId: string): Buffer | null {
// // // // //         const audioLogPath = path.join(
// // // // //             this.audioLogFolder,
// // // // //             `audio_log_${callId}.wav`
// // // // //         );
// // // // //         if (fs.existsSync(audioLogPath)) {
// // // // //             console.log(
// // // // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // // // //             );
// // // // //             return fs.readFileSync(audioLogPath);
// // // // //         }
// // // // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // //         return null;
// // // // //     }

// // // // //     public playAudioLog(callId: string): void {
// // // // //         const audioData = this.getAudioLog(callId);
// // // // //         if (audioData) {
// // // // //             console.log(
// // // // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // // // //             );
// // // // //         } else {
// // // // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // // // //         }
// // // // //     }

// // // // //     private handleRemoteHangup() {
// // // // //         if (this.currentCallSession) {
// // // // //             console.log("[Softphone] Remote hangup detected");
// // // // //             this.currentCallSession.dispose();
// // // // //             this.currentCallSession = undefined;
// // // // //             this.finalizeRecording();
// // // // //             this.emit("callEnded");
// // // // //             console.log(
// // // // //                 "[Softphone] Emitting callEnded event after remote hangup"
// // // // //             );
// // // // //         }
// // // // //     }

// // // // //     public saveAudioAsWav() {
// // // // //         if (!this.audioStream) {
// // // // //             console.error("[Softphone] No audio stream available");
// // // // //             return;
// // // // //         }

// // // // //         const rawAudioPath = this.audioStream.path.toString();
// // // // //         const wavAudioPath = rawAudioPath.replace(".raw", ".wav");

// // // // //         if (fs.existsSync(rawAudioPath)) {
// // // // //             console.log(`[Softphone] Converting audio log to .wav format`);
// // // // //             const reader = new wav.Reader();
// // // // //             const writer = new wav.FileWriter(wavAudioPath, {
// // // // //                 channels: 1,
// // // // //                 sampleRate: 8000,
// // // // //                 bitDepth: 16,
// // // // //             });

// // // // //             fs.createReadStream(rawAudioPath).pipe(reader).pipe(writer);

// // // // //             writer.on("done", () => {
// // // // //                 console.log(
// // // // //                     `[Softphone] Audio log successfully converted to ${wavAudioPath}`
// // // // //                 );
// // // // //                 fs.unlinkSync(rawAudioPath);
// // // // //             });
// // // // //         } else {
// // // // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // // // //         }
// // // // //     }
// // // // // }

// // // // // export default Softphone;
// // // // // --------------------------

// // // // 2.9
// // // import EventEmitter from "events";
// // // import net from "net";
// // // import waitFor from "wait-for-async";
// // // import * as fs from "fs";
// // // import WebSocket from "ws";
// // // import dgram from "dgram";
// // // import { RtpHeader, RtpPacket } from "werift-rtp";
// // // import type { OutboundMessage } from "./sip-message";
// // // import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
// // // import { branch, generateAuthorization, randomInt, uuid } from "./utils";
// // // import InboundCallSession from "./call-session/inbound";
// // // import OutboundCallSession from "./call-session/outbound";
// // // import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
// // // import type { Server as HttpServer } from "http";
// // // import path from "path";
// // // import { spawn } from "child_process";

// // // class Softphone extends EventEmitter {
// // //     private webSocketServer: WebSocket.Server | null = null;
// // //     public sipInfo: SipInfoResponse;
// // //     public client: net.Socket;
// // //     public fakeDomain: string;
// // //     public fakeEmail: string;
// // //     public lastInviteMessage?: InboundMessage;
// // //     public currentCallSession?: InboundCallSession | OutboundCallSession;
// // //     public socket!: dgram.Socket;
// // //     public packetsReceived: number = 0;
// // //     public bytesReceived: number = 0;
// // //     private intervalHandle: NodeJS.Timeout | null = null;
// // //     private connected = false;
// // //     private audioLogFolder: string = path.join(
// // //         process.cwd(),
// // //         "src/data/llpmg/calls"
// // //     );
// // //     private audioStream!: fs.WriteStream;

// // //     constructor(sipInfo: SipInfoResponse) {
// // //         super();
// // //         this.sipInfo = sipInfo;
// // //         this.fakeDomain = uuid() + ".invalid";
// // //         this.fakeEmail = uuid() + "@" + this.fakeDomain;

// // //         if (!this.sipInfo.domain) {
// // //             this.sipInfo.domain = "sip.ringcentral.com";
// // //         }
// // //         if (!this.sipInfo.outboundProxy) {
// // //             this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
// // //         }

// // //         this.client = new net.Socket();
// // //         const tokens = this.sipInfo.outboundProxy.split(":");
// // //         this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
// // //             this.connected = true;
// // //             console.log("SIP client connected");
// // //         });

// // //         let cache = "";
// // //         this.client.on("data", (data) => {
// // //             cache += data.toString("utf-8");
// // //             if (!cache.endsWith("\r\n")) {
// // //                 return;
// // //             }

// // //             const tempMessages = cache
// // //                 .split("\r\nContent-Length: 0\r\n\r\n")
// // //                 .filter((message) => message.trim() !== "");
// // //             cache = "";
// // //             for (let i = 0; i < tempMessages.length; i++) {
// // //                 if (!tempMessages[i].includes("Content-Length: ")) {
// // //                     tempMessages[i] += "\r\nContent-Length: 0";
// // //                 }
// // //             }
// // //             for (const message of tempMessages) {
// // //                 const inboundMsg = InboundMessage.fromString(message);
// // //                 if (inboundMsg) {
// // //                     console.log("Received SIP message:", inboundMsg.subject);
// // //                     this.emit("message", inboundMsg);
// // //                 }
// // //             }
// // //         });
// // //     }

// // //     public initializeWebSocket(server: HttpServer) {
// // //         this.webSocketServer = new WebSocket.Server({ server });

// // //         this.webSocketServer.on("connection", (ws: WebSocket) => {
// // //             console.log("WebSocket client connected");

// // //             ws.on("message", (message: WebSocket.RawData) => {
// // //                 const data = JSON.parse(message.toString());
// // //                 if (
// // //                     data.type === "join" &&
// // //                     data.callId &&
// // //                     this.currentCallSession
// // //                 ) {
// // //                     if (this.currentCallSession.callId === data.callId) {
// // //                         this.currentCallSession.setWebSocket(ws);
// // //                     }
// // //                 }
// // //             });

// // //             ws.on("close", () => {
// // //                 console.log("WebSocket client disconnected");
// // //             });
// // //         });
// // //     }

// // //     public async register() {
// // //         if (!this.connected) {
// // //             await waitFor({ interval: 100, condition: () => this.connected });
// // //         }
// // //         const sipRegister = async () => {
// // //             const requestMessage = new RequestMessage(
// // //                 `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
// // //                 {
// // //                     "Call-Id": uuid(),
// // //                     Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // //                     From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // //                     To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
// // //                     Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // //                 }
// // //             );
// // //             const inboundMessage = await this.send(requestMessage, true);
// // //             if (
// // //                 inboundMessage &&
// // //                 inboundMessage.subject.startsWith("SIP/2.0 200 ")
// // //             ) {
// // //                 console.log("SIP registration successful");
// // //                 return;
// // //             }
// // //             const wwwAuth =
// // //                 inboundMessage?.headers["Www-Authenticate"] ||
// // //                 inboundMessage?.headers["WWW-Authenticate"];
// // //             if (wwwAuth) {
// // //                 const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
// // //                 if (nonce) {
// // //                     const newMessage = requestMessage.fork();
// // //                     newMessage.headers.Authorization = generateAuthorization(
// // //                         this.sipInfo,
// // //                         nonce,
// // //                         "REGISTER"
// // //                     );
// // //                     await this.send(newMessage);
// // //                     console.log(
// // //                         "SIP registration with authentication successful"
// // //                     );
// // //                 }
// // //             }
// // //         };
// // //         await sipRegister();
// // //         this.intervalHandle = setInterval(
// // //             () => {
// // //                 sipRegister();
// // //             },
// // //             3 * 60 * 1000
// // //         );
// // //         this.on("message", (inboundMessage: InboundMessage) => {
// // //             if (inboundMessage.subject.startsWith("INVITE sip:")) {
// // //                 console.log("Incoming call detected");
// // //                 this.lastInviteMessage = inboundMessage;
// // //                 this.emit("invite", inboundMessage);
// // //             } else if (inboundMessage.subject.startsWith("BYE")) {
// // //                 console.log("Received BYE message, ending call");
// // //                 this.handleRemoteHangup();
// // //             }
// // //         });
// // //     }

// // //     public enableDebugMode() {
// // //         this.on("message", (message: InboundMessage) =>
// // //             console.log(`Receiving...(${new Date()})\n` + message.toString())
// // //         );
// // //         const tcpWrite = this.client.write.bind(this.client);
// // //         this.client.write = (message: string | Uint8Array) => {
// // //             console.log(`Sending...(${new Date()})\n` + message);
// // //             return tcpWrite(message);
// // //         };
// // //     }

// // //     public revoke() {
// // //         if (this.intervalHandle) {
// // //             clearInterval(this.intervalHandle);
// // //         }
// // //         this.removeAllListeners();
// // //         this.client.removeAllListeners();
// // //         this.client.destroy();
// // //         console.log("SIP client revoked");
// // //     }

// // //     public send(message: OutboundMessage, waitForReply = false) {
// // //         this.client.write(message.toString());
// // //         if (!waitForReply) {
// // //             return Promise.resolve(undefined);
// // //         }
// // //         return new Promise<InboundMessage>((resolve, reject) => {
// // //             const messageListener = (inboundMessage: InboundMessage) => {
// // //                 if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
// // //                     return;
// // //                 }
// // //                 if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
// // //                     return;
// // //                 }
// // //                 this.off("message", messageListener);
// // //                 resolve(inboundMessage);
// // //             };
// // //             this.on("message", messageListener);
// // //             setTimeout(
// // //                 () => reject(new Error("No response received in time")),
// // //                 5000
// // //             );
// // //         });
// // //     }

// // //     public async answer(inviteMessage: InboundMessage) {
// // //         console.log("Answering incoming call");
// // //         const inboundCallSession = new InboundCallSession(this, inviteMessage);
// // //         await inboundCallSession.answer();
// // //         this.currentCallSession = inboundCallSession;
// // //         this.startRecording(inboundCallSession.callId);
// // //         return inboundCallSession;
// // //     }

// // //     public async decline(inviteMessage: InboundMessage) {
// // //         console.log("Declining incoming call");
// // //         const newMessage = new ResponseMessage(inviteMessage, 603);
// // //         await this.send(newMessage);
// // //     }

// // //     public async call(callee: number, callerId?: number) {
// // //         console.log(`[Softphone] Initiating outgoing call to ${callee}`);
// // //         const offerSDP = `
// // // v=0
// // // o=- ${randomInt()} 0 IN IP4 127.0.0.1
// // // s=rc-softphone-ts
// // // c=IN IP4 127.0.0.1
// // // t=0 0
// // // m=audio ${randomInt()} RTP/AVP 0 101
// // // a=rtpmap:0 PCMU/8000
// // // a=rtpmap:101 telephone-event/8000
// // // a=fmtp:101 0-15
// // // a=sendrecv
// // //   `.trim();
// // //         console.log(`[Softphone] Generated SDP offer: ${offerSDP}`);

// // //         const inviteMessage = new RequestMessage(
// // //             `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
// // //             {
// // //                 "Call-Id": uuid(),
// // //                 Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
// // //                 From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
// // //                 To: `<sip:${callee}@${this.sipInfo.domain}>`,
// // //                 Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
// // //                 "Content-Type": "application/sdp",
// // //             },
// // //             offerSDP
// // //         );
// // //         console.log(
// // //             `[Softphone] Created INVITE message: ${JSON.stringify(inviteMessage, null, 2)}`
// // //         );

// // //         if (callerId) {
// // //             inviteMessage.headers["P-Asserted-Identity"] =
// // //                 `sip:${callerId}@${this.sipInfo.domain}`;
// // //         }

// // //         try {
// // //             console.log(`[Softphone] Sending initial INVITE message`);
// // //             const inboundMessage = await this.send(inviteMessage, true);
// // //             console.log(
// // //                 `[Softphone] Received response to INVITE:`,
// // //                 inboundMessage
// // //             );

// // //             if (inboundMessage) {
// // //                 const proxyAuthenticate =
// // //                     inboundMessage.headers["Proxy-Authenticate"] ||
// // //                     inboundMessage.headers["proxy-authenticate"];
// // //                 if (proxyAuthenticate) {
// // //                     console.log(`[Softphone] Proxy authentication required`);
// // //                     console.log(
// // //                         `[Softphone] Proxy-Authenticate header:`,
// // //                         proxyAuthenticate
// // //                     );

// // //                     const nonceMatch =
// // //                         proxyAuthenticate.match(/nonce="([^"]+)"/);
// // //                     const nonce = nonceMatch ? nonceMatch[1] : null;

// // //                     if (nonce) {
// // //                         console.log(`[Softphone] Extracted nonce:`, nonce);
// // //                         const newMessage = inviteMessage.fork();
// // //                         newMessage.headers["Proxy-Authorization"] =
// // //                             generateAuthorization(
// // //                                 this.sipInfo,
// // //                                 nonce,
// // //                                 "INVITE"
// // //                             );
// // //                         console.log(
// // //                             `[Softphone] Sending authenticated INVITE:`,
// // //                             newMessage
// // //                         );
// // //                         const progressMessage = await this.send(
// // //                             newMessage,
// // //                             true
// // //                         );
// // //                         console.log(
// // //                             `[Softphone] Received response to authenticated INVITE:`,
// // //                             progressMessage
// // //                         );

// // //                         if (progressMessage) {
// // //                             const outboundCallSession = new OutboundCallSession(
// // //                                 this,
// // //                                 progressMessage
// // //                             );
// // //                             this.currentCallSession = outboundCallSession;
// // //                             this.startRecording(outboundCallSession.callId);
// // //                             return outboundCallSession;
// // //                         } else {
// // //                             throw new Error(
// // //                                 "No response received for authenticated INVITE"
// // //                             );
// // //                         }
// // //                     } else {
// // //                         throw new Error(
// // //                             "Failed to extract nonce from Proxy-Authenticate header"
// // //                         );
// // //                     }
// // //                 } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
// // //                     throw new Error(`Call rejected: ${inboundMessage.subject}`);
// // //                 } else {
// // //                     throw new Error(
// // //                         `Unexpected response: ${inboundMessage.subject}`
// // //                     );
// // //                 }
// // //             } else {
// // //                 throw new Error("No response received for initial INVITE");
// // //             }
// // //         } catch (error) {
// // //             console.error(`[Softphone] Error during call setup:`, error);
// // //             throw error;
// // //         }
// // //     }

// // //     public async hangup(): Promise<void> {
// // //         if (this.currentCallSession) {
// // //             console.log("Sending BYE message to hang up call");
// // //             await this.currentCallSession.hangup();
// // //             this.currentCallSession = undefined;
// // //             this.finalizeRecording();
// // //             this.emit("callEnded");
// // //             console.log("Call ended, emitted callEnded event");
// // //         } else {
// // //             console.log("No active call to hang up");
// // //         }
// // //     }

// // //     private startRecording(callId: string) {
// // //         const audioLogPath = path.join(
// // //             this.audioLogFolder,
// // //             `audio_log_${callId}.raw`
// // //         );
// // //         this.audioStream = fs.createWriteStream(audioLogPath);
// // //         console.log(`[Softphone] Started recording audio to ${audioLogPath}`);
// // //     }

// // //     private finalizeRecording() {
// // //         if (this.audioStream) {
// // //             this.audioStream.end(() => {
// // //                 console.log(`[Softphone] Finished recording audio`);
// // //                 this.saveAudioAsOgg();
// // //             });
// // //         } else {
// // //             console.warn(`[Softphone] No active audio stream to finalize`);
// // //         }
// // //     }

// // //     public getAudioLog(callId: string): Buffer | null {
// // //         const audioLogPath = path.join(
// // //             this.audioLogFolder,
// // //             `audio_log_${callId}.ogg`
// // //         );
// // //         if (fs.existsSync(audioLogPath)) {
// // //             console.log(
// // //                 `[Softphone] Retrieved audio log for CallID: ${callId}`
// // //             );
// // //             return fs.readFileSync(audioLogPath);
// // //         }
// // //         console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
// // //         return null;
// // //     }

// // //     public playAudioLog(callId: string): void {
// // //         const audioData = this.getAudioLog(callId);
// // //         if (audioData) {
// // //             console.log(
// // //                 `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
// // //             );
// // //         } else {
// // //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// // //         }
// // //     }

// // //     private handleRemoteHangup() {
// // //         if (this.currentCallSession) {
// // //             console.log("Remote hangup detected");
// // //             this.currentCallSession.dispose();
// // //             this.currentCallSession = undefined;
// // //             this.finalizeRecording();
// // //             this.emit("callEnded");
// // //             console.log("Emitting callEnded event after remote hangup");
// // //         }
// // //     }

// // //     public async sendAudio(audioData: Buffer) {
// // //         if (this.currentCallSession) {
// // //             console.log(
// // //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// // //             );
// // //             await this.currentCallSession.sendAudio(audioData);
// // //             this.audioStream.write(audioData);
// // //         } else {
// // //             console.warn(
// // //                 "[Softphone] Attempted to send audio without an active call session"
// // //             );
// // //         }
// // //     }

// // //     private handleAudioPacket(packet: RtpPacket) {
// // //         console.log(
// // //             `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// // //         );
// // //         this.emit("audioData", packet.payload);
// // //         this.audioStream.write(packet.payload);
// // //     }

// // //     public saveAudioAsOgg() {
// // //         const rawAudioPath = this.audioStream.path.toString(); // Ensure it's a string
// // //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// // //         if (fs.existsSync(rawAudioPath)) {
// // //             console.log(`[Softphone] Converting audio log to .ogg format`);
// // //             const ffmpeg = spawn("ffmpeg", ["-i", rawAudioPath, oggAudioPath]);

// // //             ffmpeg.on("close", (code) => {
// // //                 if (code === 0) {
// // //                     console.log(
// // //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// // //                     );
// // //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// // //                 } else {
// // //                     console.error(
// // //                         `[Softphone] Failed to convert audio log to .ogg format`
// // //                     );
// // //                 }
// // //             });
// // //         } else {
// // //             console.error(`[Softphone] No raw audio log found for conversion`);
// // //         }
// // //     }

// // //     public getCallStats(callId: string): any {
// // //         if (
// // //             this.currentCallSession &&
// // //             this.currentCallSession.callId === callId
// // //         ) {
// // //             return {
// // //                 duration: Date.now() - this.currentCallSession.startTime,
// // //                 bytesReceived: this.currentCallSession.bytesReceived,
// // //                 bytesSent: this.currentCallSession.bytesSent,
// // //                 packetsReceived: this.currentCallSession.packetsReceived,
// // //                 packetsSent: this.currentCallSession.packetsSent,
// // //             };
// // //         }
// // //         return null;
// // //     }
// // // }

// // // export default Softphone;

// // // // 2.9

// // // 3.0
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
// //     private isCallActive: boolean = false;

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
// //         this.isCallActive = true;
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
// //                             this.isCallActive = true;
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
// //         if (this.currentCallSession && this.isCallActive) {
// //             console.log("Sending BYE message to hang up call");
// //             await this.currentCallSession.hangup();
// //             this.currentCallSession = undefined;
// //             this.isCallActive = false;
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
// //             // Here you would implement the actual audio playback
// //             // This could involve sending the audio data to a client-side player
// //             // or using a server-side audio player library
// //         } else {
// //             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
// //         }
// //     }

// //     private handleRemoteHangup() {
// //         if (this.currentCallSession && this.isCallActive) {
// //             console.log("[Softphone] Remote hangup detected");
// //             this.currentCallSession.dispose();
// //             this.currentCallSession = undefined;
// //             this.isCallActive = false;
// //             this.finalizeRecording();
// //             this.emit("callEnded");
// //             console.log(
// //                 "[Softphone] Emitting callEnded event after remote hangup"
// //             );
// //         }
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         if (this.currentCallSession && this.isCallActive) {
// //             console.log(
// //                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
// //             );
// //             await this.currentCallSession.sendAudio(audioData);
// //             if (this.audioStream && this.audioStream.writable) {
// //                 this.audioStream.write(audioData);
// //             }
// //         } else {
// //             console.warn(
// //                 "[Softphone] Attempted to send audio without an active call session"
// //             );
// //         }
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         if (this.isCallActive) {
// //             console.log(
// //                 `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
// //             );
// //             this.emit("audioData", packet.payload);
// //             if (this.audioStream && this.audioStream.writable) {
// //                 this.audioStream.write(packet.payload);
// //             }
// //         } else {
// //             console.warn("[Softphone] Received audio packet for inactive call");
// //         }
// //     }

// //     private saveAudioAsOgg() {
// //         const rawAudioPath = this.audioStream.path.toString();
// //         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

// //         if (fs.existsSync(rawAudioPath)) {
// //             console.log(`[Softphone] Converting audio log to .ogg format`);
// //             const ffmpeg = spawn("ffmpeg", [
// //                 "-f",
// //                 "s16le", // Input format: 16-bit signed little-endian PCM
// //                 "-ar",
// //                 "8000", // Sample rate: 8000 Hz (standard for PCMU)
// //                 "-ac",
// //                 "1", // Channels: 1 (mono)
// //                 "-i",
// //                 rawAudioPath,
// //                 "-acodec",
// //                 "libvorbis",
// //                 "-q:a",
// //                 "4", // Quality setting for Vorbis (0-10, 4 is a good balance)
// //                 oggAudioPath,
// //             ]);

// //             ffmpeg.on("close", (code) => {
// //                 if (code === 0) {
// //                     console.log(
// //                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
// //                     );
// //                     fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //                 } else {
// //                     console.error(
// //                         `[Softphone] Failed to convert audio log to .ogg format (Exit code: ${code})`
// //                     );
// //                 }
// //             });

// //             ffmpeg.stderr.on("data", (data) => {
// //                 console.error(`[Softphone] FFmpeg stderr: ${data}`);
// //             });
// //         } else {
// //             console.error(`[Softphone] No raw audio log found for conversion`);
// //         }
// //     }

// //     public getCallStats(callId: string): any {
// //         if (
// //             this.currentCallSession &&
// //             this.currentCallSession.callId === callId &&
// //             this.isCallActive
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

// //     private cleanupCall() {
// //         if (this.currentCallSession) {
// //             this.currentCallSession.dispose();
// //             this.currentCallSession = undefined;
// //         }
// //         this.isCallActive = false;
// //         this.finalizeRecording();
// //         this.lastInviteMessage = undefined;
// //     }

// //     public onError(error: Error) {
// //         console.error(`[Softphone] Error occurred: ${error.message}`);
// //         this.emit("error", error);
// //         this.cleanupCall();
// //     }
// // }

// // export default Softphone; // 3.0

// // 3.1
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
//     private activeWebSockets: Set<WebSocket> = new Set();
//     public sipInfo: SipInfoResponse;
//     public client: net.Socket;
//     public fakeDomain: string;
//     public fakeEmail: string;
//     public lastInviteMessage?: InboundMessage;
//     public currentCallSession?: InboundCallSession | OutboundCallSession;
//     public socket!: dgram.Socket;
//     private intervalHandle: NodeJS.Timeout | null = null;
//     private connected = false;
//     private audioLogFolder: string = path.join(
//         process.cwd(),
//         "src/data/llpmg/calls"
//     );
//     private audioStream: fs.WriteStream | null = null;
//     private isCallActive: boolean = false;

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
//             this.activeWebSockets.add(ws);

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
//                 this.activeWebSockets.delete(ws);
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
//         this.intervalHandle = setInterval(sipRegister, 3 * 60 * 1000);
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
//         this.cleanupCall();
//         this.closeAllWebSockets();
//         console.log("SIP client revoked");
//     }

//     private closeAllWebSockets() {
//         for (const ws of this.activeWebSockets) {
//             ws.close();
//         }
//         this.activeWebSockets.clear();
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
//         this.isCallActive = true;
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
//                             this.isCallActive = true;
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
//         if (this.currentCallSession && this.isCallActive) {
//             console.log("Sending BYE message to hang up call");
//             await this.currentCallSession.hangup();
//             this.cleanupCall();
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
//             this.audioStream = null;
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
//             // Send the audio data to connected WebSocket clients
//             for (const ws of this.activeWebSockets) {
//                 if (ws.readyState === WebSocket.OPEN) {
//                     ws.send(audioData);
//                 }
//             }
//         } else {
//             console.log(`[Softphone] No audio log found for CallID: ${callId}`);
//         }
//     }

//     private handleRemoteHangup() {
//         if (this.currentCallSession && this.isCallActive) {
//             console.log("[Softphone] Remote hangup detected");
//             this.cleanupCall();
//             this.emit("callEnded");
//             console.log(
//                 "[Softphone] Emitted callEnded event after remote hangup"
//             );
//         }
//     }

//     public async sendAudio(audioData: Buffer) {
//         if (this.currentCallSession && this.isCallActive) {
//             console.log(
//                 `[Softphone] Sending audio data, size: ${audioData.length} bytes`
//             );
//             await this.currentCallSession.sendAudio(audioData);
//             if (this.audioStream && !this.audioStream.destroyed) {
//                 this.audioStream.write(audioData);
//             }
//         } else {
//             console.warn(
//                 "[Softphone] Attempted to send audio without an active call session"
//             );
//         }
//     }

//     private handleAudioPacket(packet: RtpPacket) {
//         if (this.isCallActive) {
//             console.log(
//                 `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
//             );

//             // Convert payload to 16-bit PCM
//             const pcmData = this.convertMuLawToPCM(packet.payload);

//             this.emit("audioData", pcmData);
//             if (this.audioStream && !this.audioStream.destroyed) {
//                 this.audioStream.write(pcmData);
//             }

//             // Send audio data to connected WebSocket clients
//             for (const ws of this.activeWebSockets) {
//                 if (ws.readyState === WebSocket.OPEN) {
//                     ws.send(pcmData);
//                 }
//             }
//         } else {
//             console.warn("[Softphone] Received audio packet for inactive call");
//         }
//     }

//     private convertMuLawToPCM(muLawData: Buffer): Buffer {
//         const pcmData = Buffer.alloc(muLawData.length * 2);
//         for (let i = 0; i < muLawData.length; i++) {
//             const pcmSample = this.muLawToPCM(muLawData[i]);
//             pcmData.writeInt16LE(pcmSample, i * 2);
//         }
//         return pcmData;
//     }

//     private muLawToPCM(muLaw: number): number {
//         const MULAW_BIAS = 33;
//         const MULAW_MAX = 0x1fff;
//         let sign = 0;
//         let exponent = 0;
//         let mantissa = 0;
//         let sample = 0;

//         muLaw = ~muLaw;
//         sign = muLaw & 0x80 ? -1 : 1;
//         exponent = (muLaw >> 4) & 0x07;
//         mantissa = muLaw & 0x0f;
//         sample = mantissa << (exponent + 3);
//         sample += MULAW_BIAS;
//         sample *= sign;

//         return sample;
//     }

//     private saveAudioAsOgg() {
//         if (!this.audioStream || this.audioStream.path === undefined) {
//             console.error(
//                 "[Softphone] No audio stream available for conversion"
//             );
//             return;
//         }

//         const rawAudioPath = this.audioStream.path.toString();
//         const oggAudioPath = rawAudioPath.replace(".raw", ".ogg");

//         if (fs.existsSync(rawAudioPath)) {
//             console.log(`[Softphone] Converting audio log to .ogg format`);
//             const ffmpeg = spawn("ffmpeg", [
//                 "-f",
//                 "s16le",
//                 "-ar",
//                 "8000",
//                 "-ac",
//                 "1",
//                 "-i",
//                 rawAudioPath,
//                 "-c:a",
//                 "libvorbis",
//                 "-q:a",
//                 "4",
//                 oggAudioPath,
//             ]);

//             ffmpeg.on("close", (code) => {
//                 if (code === 0) {
//                     console.log(
//                         `[Softphone] Audio log successfully converted to ${oggAudioPath}`
//                     );
//                     fs.unlinkSync(rawAudioPath);
//                 } else {
//                     console.error(
//                         `[Softphone] Failed to convert audio log to .ogg format (Exit code: ${code})`
//                     );
//                 }
//             });

//             ffmpeg.stderr.on("data", (data) => {
//                 console.error(`[Softphone] FFmpeg stderr: ${data}`);
//             });
//         } else {
//             console.error(`[Softphone] No raw audio log found for conversion`);
//         }
//     }

//     public getCallStats(callId: string): any {
//         if (
//             this.currentCallSession &&
//             this.currentCallSession.callId === callId &&
//             this.isCallActive
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

//     private cleanupCall() {
//         if (this.currentCallSession) {
//             this.currentCallSession.dispose();
//             this.currentCallSession = undefined;
//         }
//         this.isCallActive = false;
//         this.finalizeRecording();
//         this.lastInviteMessage = undefined;
//     }

//     public onError(error: Error) {
//         console.error(`[Softphone] Error occurred: ${error.message}`);
//         this.emit("error", error);
//         this.cleanupCall();
//     }
// }

// export default Softphone;
// // 3.1

// 3.2
import EventEmitter from "events";
import net from "net";
import waitFor from "wait-for-async";
import * as fs from "fs";
import * as wav from "wav";
import WebSocket from "ws";
import dgram from "dgram";
import { RtpHeader, RtpPacket } from "werift-rtp";
import type { OutboundMessage } from "./sip-message";
import { InboundMessage, RequestMessage, ResponseMessage } from "./sip-message";
import { branch, generateAuthorization, randomInt, uuid } from "./utils";
import InboundCallSession from "./call-session/inbound";
import OutboundCallSession from "./call-session/outbound";
import SipInfoResponse from "@rc-ex/core/lib/definitions/SipInfoResponse";
import type { Server as HttpServer } from "http";
import path from "path";

class Softphone extends EventEmitter {
    private webSocketServer: WebSocket.Server | null = null;
    private activeWebSockets: Set<WebSocket> = new Set();
    public sipInfo: SipInfoResponse;
    public client: net.Socket;
    public fakeDomain: string;
    public fakeEmail: string;
    public lastInviteMessage?: InboundMessage;
    public currentCallSession?: InboundCallSession | OutboundCallSession;
    public socket!: dgram.Socket;
    private intervalHandle: NodeJS.Timeout | null = null;
    private audioProcessingInterval: NodeJS.Timeout | null = null;
    private connected = false;
    private audioLogFolder: string = path.join(
        process.cwd(),
        "src/data/llpmg/calls"
    );
    private wavWriter: wav.FileWriter | null = null;
    private isCallActive: boolean = false;

    constructor(sipInfo: SipInfoResponse) {
        super();
        this.sipInfo = sipInfo;
        this.fakeDomain = uuid() + ".invalid";
        this.fakeEmail = uuid() + "@" + this.fakeDomain;

        if (!this.sipInfo.domain) {
            this.sipInfo.domain = "sip.ringcentral.com";
        }
        if (!this.sipInfo.outboundProxy) {
            this.sipInfo.outboundProxy = "sip112-1241.ringcentral.com:5091";
        }

        this.client = new net.Socket();
        const tokens = this.sipInfo.outboundProxy.split(":");
        this.client.connect(parseInt(tokens[1], 10), tokens[0], () => {
            this.connected = true;
            console.log("[Softphone] SIP client connected");
        });

        let cache = "";
        this.client.on("data", (data) => {
            cache += data.toString("utf-8");
            if (!cache.endsWith("\r\n")) {
                return;
            }

            const tempMessages = cache
                .split("\r\nContent-Length: 0\r\n\r\n")
                .filter((message) => message.trim() !== "");
            cache = "";
            for (let i = 0; i < tempMessages.length; i++) {
                if (!tempMessages[i].includes("Content-Length: ")) {
                    tempMessages[i] += "\r\nContent-Length: 0";
                }
            }
            for (const message of tempMessages) {
                const inboundMsg = InboundMessage.fromString(message);
                if (inboundMsg) {
                    console.log(
                        "[Softphone] Received SIP message:",
                        inboundMsg.subject
                    );
                    this.emit("message", inboundMsg);
                }
            }
        });
    }

    public initializeWebSocket(server: HttpServer) {
        this.webSocketServer = new WebSocket.Server({ server });

        this.webSocketServer.on("connection", (ws: WebSocket) => {
            console.log("[Softphone] WebSocket client connected");
            this.activeWebSockets.add(ws);

            ws.on("message", (message: WebSocket.RawData) => {
                const data = JSON.parse(message.toString());
                if (
                    data.type === "join" &&
                    data.callId &&
                    this.currentCallSession
                ) {
                    if (this.currentCallSession.callId === data.callId) {
                        this.currentCallSession.setWebSocket(ws);
                    }
                }
            });

            ws.on("close", () => {
                console.log("[Softphone] WebSocket client disconnected");
                this.activeWebSockets.delete(ws);
            });
        });
    }

    public async register() {
        if (!this.connected) {
            await waitFor({ interval: 100, condition: () => this.connected });
        }
        const sipRegister = async () => {
            const requestMessage = new RequestMessage(
                `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
                {
                    "Call-Id": uuid(),
                    Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
                    From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
                    To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
                    Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
                }
            );
            const inboundMessage = await this.send(requestMessage, true);
            if (
                inboundMessage &&
                inboundMessage.subject.startsWith("SIP/2.0 200 ")
            ) {
                console.log("[Softphone] SIP registration successful");
                return;
            }
            const wwwAuth =
                inboundMessage?.headers["Www-Authenticate"] ||
                inboundMessage?.headers["WWW-Authenticate"];
            if (wwwAuth) {
                const nonce = wwwAuth.match(/, nonce="(.+?)"/)?.[1];
                if (nonce) {
                    const newMessage = requestMessage.fork();
                    newMessage.headers.Authorization = generateAuthorization(
                        this.sipInfo,
                        nonce,
                        "REGISTER"
                    );
                    await this.send(newMessage);
                    console.log(
                        "[Softphone] SIP registration with authentication successful"
                    );
                }
            }
        };
        await sipRegister();
        this.intervalHandle = setInterval(sipRegister, 3 * 60 * 1000);
        this.on("message", (inboundMessage: InboundMessage) => {
            if (inboundMessage.subject.startsWith("INVITE sip:")) {
                console.log("[Softphone] Incoming call detected");
                this.lastInviteMessage = inboundMessage;
                this.emit("invite", inboundMessage);
            } else if (inboundMessage.subject.startsWith("BYE")) {
                console.log("[Softphone] Received BYE message, ending call");
                this.handleRemoteHangup();
            } else {
                console.log(
                    "[Softphone] there currently is no inbound message"
                );
            }
        });
    }

    public enableDebugMode() {
        this.on("message", (message: InboundMessage) =>
            console.log(
                `[Softphone] Receiving...(${new Date()})\n` + message.toString()
            )
        );
        const tcpWrite = this.client.write.bind(this.client);
        this.client.write = (message: string | Uint8Array) => {
            console.log(`[Softphone] Sending...(${new Date()})\n` + message);
            return tcpWrite(message);
        };
    }

    public revoke() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
        }
        this.removeAllListeners();
        this.client.removeAllListeners();
        this.client.destroy();
        this.cleanupCall();
        this.closeAllWebSockets();
        console.log("[Softphone] SIP client revoked");
    }

    private closeAllWebSockets() {
        for (const ws of this.activeWebSockets) {
            ws.close();
        }
        this.activeWebSockets.clear();
    }

    public send(message: OutboundMessage, waitForReply = false) {
        this.client.write(message.toString());
        if (!waitForReply) {
            return Promise.resolve(undefined);
        }
        return new Promise<InboundMessage>((resolve, reject) => {
            const messageListener = (inboundMessage: InboundMessage) => {
                if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
                    return;
                }
                if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
                    return;
                }
                this.off("message", messageListener);
                resolve(inboundMessage);
            };
            this.on("message", messageListener);
            setTimeout(
                () =>
                    reject(
                        new Error("[Softphone] No response received in time")
                    ),
                5000
            );
        });
    }

    public async answer(inviteMessage: InboundMessage) {
        console.log("[Softphone] Answering incoming call");
        const inboundCallSession = new InboundCallSession(this, inviteMessage);
        await inboundCallSession.answer();
        this.currentCallSession = inboundCallSession;
        this.isCallActive = true;
        this.startRecording(inboundCallSession.callId);
        this.startAudioProcessing();
        return inboundCallSession;
    }

    public async decline(inviteMessage: InboundMessage) {
        console.log("[Softphone] Declining incoming call");
        const newMessage = new ResponseMessage(inviteMessage, 603);
        await this.send(newMessage);
    }

    public async call(callee: number, callerId?: number) {
        console.log(`[Softphone] Initiating outgoing call to ${callee}`);
        const offerSDP = `
v=0
o=- ${randomInt()} 0 IN IP4 127.0.0.1
s=rc-softphone-ts
c=IN IP4 127.0.0.1
t=0 0
m=audio ${randomInt()} RTP/AVP 0 101
a=rtpmap:0 PCMU/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-15
a=sendrecv
  `.trim();

        const inviteMessage = new RequestMessage(
            `INVITE sip:${callee}@${this.sipInfo.domain} SIP/2.0`,
            {
                "Call-Id": uuid(),
                Contact: `<sip:${this.fakeEmail};transport=tcp>;expires=600`,
                From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
                To: `<sip:${callee}@${this.sipInfo.domain}>`,
                Via: `SIP/2.0/TCP ${this.fakeDomain};branch=${branch()}`,
                "Content-Type": "application/sdp",
            },
            offerSDP
        );

        if (callerId) {
            inviteMessage.headers["P-Asserted-Identity"] =
                `sip:${callerId}@${this.sipInfo.domain}`;
        }

        try {
            console.log(`[Softphone] Sending initial INVITE message`);
            const inboundMessage = await this.send(inviteMessage, true);

            if (inboundMessage) {
                const proxyAuthenticate =
                    inboundMessage.headers["Proxy-Authenticate"] ||
                    inboundMessage.headers["proxy-authenticate"];
                if (proxyAuthenticate) {
                    const nonceMatch =
                        proxyAuthenticate.match(/nonce="([^"]+)"/);
                    const nonce = nonceMatch ? nonceMatch[1] : null;

                    if (nonce) {
                        const newMessage = inviteMessage.fork();
                        newMessage.headers["Proxy-Authorization"] =
                            generateAuthorization(
                                this.sipInfo,
                                nonce,
                                "INVITE"
                            );
                        const progressMessage = await this.send(
                            newMessage,
                            true
                        );

                        if (progressMessage) {
                            const outboundCallSession = new OutboundCallSession(
                                this,
                                progressMessage
                            );
                            this.currentCallSession = outboundCallSession;
                            this.isCallActive = true;
                            this.startRecording(outboundCallSession.callId);
                            this.startAudioProcessing();
                            return outboundCallSession;
                        } else {
                            throw new Error(
                                "[Softphone] No response received for authenticated INVITE"
                            );
                        }
                    } else {
                        throw new Error(
                            "[Softphone] Failed to extract nonce from Proxy-Authenticate header"
                        );
                    }
                } else if (inboundMessage.subject.startsWith("SIP/2.0 4")) {
                    throw new Error(
                        `[Softphone] Call rejected: ${inboundMessage.subject}`
                    );
                } else {
                    throw new Error(
                        `[Softphone] Unexpected response: ${inboundMessage.subject}`
                    );
                }
            } else {
                throw new Error(
                    "[Softphone] No response received for initial INVITE"
                );
            }
        } catch (error) {
            console.error(`[Softphone] Error during call setup:`, error);
            throw error;
        }
    }

    public async hangup(): Promise<void> {
        if (this.currentCallSession && this.isCallActive) {
            console.log("[Softphone] Sending BYE message to hang up call");
            await this.currentCallSession.hangup();
            this.cleanupCall();
        } else {
            console.log("[Softphone] No active call to hang up");
        }
    }

    private startRecording(callId: string) {
        const wavFilePath = path.join(
            this.audioLogFolder,
            `audio_log_${callId}.wav`
        );
        this.wavWriter = new wav.FileWriter(wavFilePath, {
            channels: 1,
            sampleRate: 8000,
            bitDepth: 16,
        });
        console.log(`[Softphone] Started recording audio to ${wavFilePath}`);
    }

    private finalizeRecording() {
        if (this.wavWriter) {
            this.wavWriter.end(() => {
                console.log(`[Softphone] Finished recording audio`);
                this.wavWriter = null;
            });
        } else {
            console.warn(`[Softphone] No active WAV writer to finalize`);
        }
    }

    public async sendAudio(audioData: ArrayBuffer) {
        if (this.currentCallSession && this.isCallActive) {
            console.log(
                `[Softphone] Sending audio data, size: ${audioData.byteLength} bytes`
            );
            const buffer = Buffer.from(audioData);
            await this.currentCallSession.sendAudio(buffer);
            if (this.wavWriter) {
                this.wavWriter.write(buffer);
            } else {
                console.warn(
                    "[Softphone] WAV writer not available for writing"
                );
            }
        } else {
            console.warn(
                "[Softphone] Attempted to send audio without an active call session"
            );
        }
    }

    public getAudioLog(callId: string): Buffer | null {
        const audioLogPath = path.join(
            this.audioLogFolder,
            `audio_log_${callId}.wav`
        );
        if (fs.existsSync(audioLogPath)) {
            console.log(
                `[Softphone] Retrieved audio log for CallID: ${callId}`
            );
            return fs.readFileSync(audioLogPath);
        }
        console.warn(`[Softphone] No audio log found for CallID: ${callId}`);
        return null;
    }

    public playAudioLog(callId: string): void {
        const audioData = this.getAudioLog(callId);
        if (audioData) {
            console.log(
                `[Softphone] Playing audio log for CallID: ${callId}, size: ${audioData.length} bytes`
            );
            for (const ws of this.activeWebSockets) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(audioData);
                }
            }
        } else {
            console.log(`[Softphone] No audio log found for CallID: ${callId}`);
        }
    }

    private handleRemoteHangup() {
        console.log("[Softphone] Remote hangup detected");
        this.cleanupCall();
    }

    private handleAudioPacket(packet: RtpPacket) {
        if (this.isCallActive) {
            console.log(
                `[Softphone] Handling audio packet - Payload size: ${packet.payload.length}`
            );

            const pcmData = this.muLawToPCM(packet.payload);

            if (this.wavWriter) {
                this.wavWriter.write(pcmData);
            }

            this.emit("audioData", pcmData);

            for (const ws of this.activeWebSockets) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(pcmData);
                }
            }
        } else {
            console.warn("[Softphone] Received audio packet for inactive call");
        }
    }

    private muLawToPCM(muLawData: Buffer): Buffer {
        const pcmData = Buffer.alloc(muLawData.length * 2);
        for (let i = 0; i < muLawData.length; i++) {
            const pcmSample = this.muLawToPCMSample(muLawData[i]);
            pcmData.writeInt16LE(pcmSample, i * 2);
        }
        return pcmData;
    }

    private muLawToPCMSample(muLaw: number): number {
        const MULAW_BIAS = 33;
        const MULAW_MAX = 0x1fff;
        let sign = 0;
        let exponent = 0;
        let mantissa = 0;
        let sample = 0;

        muLaw = ~muLaw;
        sign = muLaw & 0x80 ? -1 : 1;
        exponent = (muLaw >> 4) & 0x07;
        mantissa = muLaw & 0x0f;
        sample = mantissa << (exponent + 3);
        sample += MULAW_BIAS;
        sample *= sign;

        return sample;
    }

    private cleanupCall() {
        console.log("[Softphone] Cleaning up call resources");
        this.isCallActive = false;

        if (this.currentCallSession) {
            this.currentCallSession.dispose();
            this.currentCallSession = undefined;
        }

        this.finalizeRecording();
        this.lastInviteMessage = undefined;

        if (this.audioProcessingInterval) {
            clearInterval(this.audioProcessingInterval);
            this.audioProcessingInterval = null;
        }

        this.removeAllListeners("audioData");

        for (const ws of this.activeWebSockets) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "callEnded" }));
            }
        }

        this.emit("callEnded");
        console.log("[Softphone] Call ended, emitted callEnded event");
    }

    private startAudioProcessing() {
        if (this.audioProcessingInterval) {
            clearInterval(this.audioProcessingInterval);
        }

        this.audioProcessingInterval = setInterval(() => {
            if (!this.isCallActive) {
                clearInterval(this.audioProcessingInterval!);
                this.audioProcessingInterval = null;
                return;
            }

            if (this.currentCallSession) {
                this.currentCallSession.processAudio();
            }
        }, 20);
    }

    public onError(error: Error) {
        console.error(`[Softphone] Error occurred: ${error.message}`);
        this.emit("error", error);
        this.cleanupCall();
    }

    public setAudioHandler(handler: (packet: RtpPacket) => void) {
        this.on("audioPacket", handler);
    }
}

export default Softphone;
// 3.2
