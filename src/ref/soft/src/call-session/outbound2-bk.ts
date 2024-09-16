// import { RequestMessage, type InboundMessage } from "../sip-message";
// import type Softphone from "../softphone";
// import CallSession from ".";
// import { extractAddress, withoutTag } from "../utils";

// class OutboundCallSession extends CallSession {
//     public constructor(softphone: Softphone, answerMessage: InboundMessage) {
//         super(softphone, answerMessage);
//         this.localPeer = answerMessage.headers.From;
//         this.remotePeer = answerMessage.headers.To;
//         this.init();
//     }

//     public async init() {
//         // wait for user to answer the call
//         const answerHandler = (message: InboundMessage) => {
//             if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
//                 this.softphone.off("message", answerHandler);
//                 this.emit("answered");

//                 const ackMessage = new RequestMessage(
//                     `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
//                     {
//                         "Call-Id": this.callId,
//                         From: this.localPeer,
//                         To: this.remotePeer,
//                         Via: this.sipMessage.headers.Via,
//                         CSeq: this.sipMessage.headers.CSeq.replace(
//                             " INVITE",
//                             " ACK"
//                         ),
//                     }
//                 );
//                 this.softphone.send(ackMessage);
//             }
//         };
//         this.softphone.on("message", answerHandler);
//         this.once("answered", async () => this.startLocalServices());
//     }

//     public async cancel() {
//         const requestMessage = new RequestMessage(
//             `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
//             {
//                 "Call-Id": this.callId,
//                 From: this.localPeer,
//                 To: withoutTag(this.remotePeer),
//                 Via: this.sipMessage.headers.Via,
//                 CSeq: this.sipMessage.headers.CSeq.replace(
//                     " INVITE",
//                     " CANCEL"
//                 ),
//             }
//         );
//         this.softphone.send(requestMessage);
//     }
// }

// export default OutboundCallSession;

// // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // // // import { RequestMessage, type InboundMessage } from "../sip-message";
// // // // import type Softphone from "../softphone";
// // // // import CallSession from ".";
// // // // import { extractAddress, withoutTag } from "../utils";

// // // // class OutboundCallSession extends CallSession {
// // // //     public constructor(softphone: Softphone, answerMessage: InboundMessage) {
// // // //         super(softphone, answerMessage);
// // // //         this.localPeer = answerMessage.headers.From;
// // // //         this.remotePeer = answerMessage.headers.To;
// // // //         this.init();
// // // //     }

// // // //     public async init() {
// // // //         // wait for user to answer the call
// // // //         const answerHandler = (message: InboundMessage) => {
// // // //             if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
// // // //                 this.softphone.off("message", answerHandler);
// // // //                 this.emit("answered");

// // // //                 const ackMessage = new RequestMessage(
// // // //                     `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
// // // //                     {
// // // //                         "Call-Id": this.callId,
// // // //                         From: this.localPeer,
// // // //                         To: this.remotePeer,
// // // //                         Via: this.sipMessage.headers.Via,
// // // //                         CSeq: this.sipMessage.headers.CSeq.replace(
// // // //                             " INVITE",
// // // //                             " ACK"
// // // //                         ),
// // // //                     }
// // // //                 );
// // // //                 this.softphone.send(ackMessage);
// // // //             }
// // // //         };
// // // //         this.softphone.on("message", answerHandler);
// // // //         this.once("answered", async () => this.startLocalServices());
// // // //     }

// // // //     public async cancel() {
// // // //         const requestMessage = new RequestMessage(
// // // //             `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
// // // //             {
// // // //                 "Call-Id": this.callId,
// // // //                 From: this.localPeer,
// // // //                 To: withoutTag(this.remotePeer),
// // // //                 Via: this.sipMessage.headers.Via,
// // // //                 CSeq: this.sipMessage.headers.CSeq.replace(
// // // //                     " INVITE",
// // // //                     " CANCEL"
// // // //                 ),
// // // //             }
// // // //         );
// // // //         this.softphone.send(requestMessage);
// // // //     }
// // // // }

// // // // export default OutboundCallSession;
// // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions

// // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite
// // // // call-session/outbound.ts

// // // // import { RequestMessage, type InboundMessage } from "../sip-message";
// // // // import type Softphone from "../softphone";
// // // // import CallSession from ".";
// // // // import { extractAddress, randomInt, withoutTag } from "../utils";
// // // // import dgram from "dgram";
// // // // import { RtpPacket } from "werift-rtp";

// // // // class OutboundCallSession extends CallSession {
// // // //     // added for sonnet-3.5 5th attempt
// // // //     private udpSocket: dgram.Socket | null = null;
// // // //     // added for sonnet-3.5 5th attempt

// // // //     // removed for sonnet-3.5 6th attempt
// // // //     // constructor(softphone: Softphone, answerMessage: InboundMessage) {
// // // //     //     super(softphone, answerMessage);
// // // //     //     this.localPeer = answerMessage.headers.From;
// // // //     //     this.remotePeer = answerMessage.headers.To;
// // // //     // removed for sonnet-3.5 6th attempt
// // // //     // added for sonnet-3.5 6th attempt
// // // //     constructor(softphone: Softphone, sipMessage: InboundMessage) {
// // // //         super(softphone, sipMessage);
// // // //         // added for sonnet-3.5 6th attempt

// // // //         // added for sonnet-3.5 5th attempt
// // // //         this.initUdpSocket();
// // // //         // added for sonnet-3.5 5th attempt
// // // //     }

// // // //     // added for sonnet-3.5 5th attempt
// // // //     private initUdpSocket() {
// // // //         this.udpSocket = dgram.createSocket("udp4");
// // // //         this.udpSocket.on("error", (err) => {
// // // //             console.error(`[OutboundCallSession] UDP socket error:`, err);
// // // //         });
// // // //     }
// // // //     // added for sonnet-3.5 5th attempt

// // // //     public async init() {
// // // //         const answerHandler = (message: InboundMessage) => {
// // // //             if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
// // // //                 this.softphone.off("message", answerHandler);
// // // //                 this.emit("answered");

// // // //                 const ackMessage = new RequestMessage(
// // // //                     `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
// // // //                     {
// // // //                         "Call-Id": this.callId,
// // // //                         From: this.localPeer,
// // // //                         To: this.remotePeer,
// // // //                         Via: this.sipMessage.headers.Via,
// // // //                         CSeq: this.sipMessage.headers.CSeq.replace(
// // // //                             " INVITE",
// // // //                             " ACK"
// // // //                         ),
// // // //                     }
// // // //                 );
// // // //                 this.softphone.send(ackMessage);
// // // //             }
// // // //         };
// // // //         this.softphone.on("message", answerHandler);
// // // //         this.once("answered", async () => this.startLocalServices());
// // // //         // added for sonnet-3.5 5th attempt
// // // //         // removed for sonnet-3.5 6th attempt
// // // //         // await this.startLocalServices();
// // // //         // added for sonnet-3.5 5th attempt
// // // //     }

// // // //     public async cancel() {
// // // //         const requestMessage = new RequestMessage(
// // // //             `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
// // // //             {
// // // //                 "Call-Id": this.callId,
// // // //                 From: this.localPeer,
// // // //                 To: withoutTag(this.remotePeer),
// // // //                 Via: this.sipMessage.headers.Via,
// // // //                 CSeq: this.sipMessage.headers.CSeq.replace(
// // // //                     " INVITE",
// // // //                     " CANCEL"
// // // //                 ),
// // // //             }
// // // //         );
// // // //         this.softphone.send(requestMessage);
// // // //     }

// // // //     // removed for sonnet-3.5 5th attempt
// // // //     // public send(data: Buffer) {
// // // //     //     this.socket.send(data, this.remotePort, this.remoteIP, (error) => {
// // // //     //         if (error) {
// // // //     //             console.error(
// // // //     //                 "[OutboundCallSession] Error sending RTP packet:",
// // // //     //                 error
// // // //     //             );
// // // //     //         } else {
// // // //     //             this.packetsSent++;
// // // //     //             this.bytesSent += data.length;
// // // //     //         }
// // // //     //     });
// // // //     // }
// // // //     // added for sonnet-3.5 5th attempt
// // // //     public send(data: Buffer) {
// // // //         if (this.udpSocket && this.remoteIP && this.remotePort) {
// // // //             this.udpSocket.send(
// // // //                 data,
// // // //                 this.remotePort,
// // // //                 this.remoteIP,
// // // //                 (error) => {
// // // //                     if (error) {
// // // //                         console.error(
// // // //                             "[OutboundCallSession] Error sending RTP packet:",
// // // //                             error
// // // //                         );
// // // //                     } else {
// // // //                         this.packetsSent++;
// // // //                         this.bytesSent += data.length;
// // // //                     }
// // // //                 }
// // // //             );
// // // //         } else {
// // // //             console.error(
// // // //                 "[OutboundCallSession] Cannot send data: UDP socket or remote endpoint not initialized"
// // // //             );
// // // //         }
// // // //     }

// // // //     public async sendAudio(audioData: Buffer): Promise<void> {
// // // //         const rtpPacket = this.createRtpPacket(audioData);
// // // //         this.send(rtpPacket.serialize());
// // // //     }

// // // //     protected async startLocalServices(): Promise<void> {
// // // //         // added for sonnet-3.5 7th attempt
// // // //         this.initSocket();
// // // //         if (!this.socket) {
// // // //             throw new Error("Failed to initialize UDP socket");
// // // //         }
// // // //         // added for sonnet-3.5 7th attempt
// // // //         // removefor sonnet-3.5 7th attempt
// // // //         //  this.socket = dgram.createSocket("udp4");
// // // //         // removefor sonnet-3.5 7th attempt

// // // //         this.socket.on("message", (message) => {
// // // //             const rtpPacket = RtpPacket.deSerialize(message);
// // // //             this.packetsReceived++;
// // // //             this.bytesReceived += message.length;

// // // //             if (rtpPacket.header.payloadType === 0) {
// // // //                 // PCMU
// // // //                 this.emit("audioPacket", rtpPacket.payload);
// // // //             } else if (rtpPacket.header.payloadType === 101) {
// // // //                 // DTMF
// // // //                 this.emit("dtmfPacket", rtpPacket);
// // // //             }
// // // //         });

// // // //         return new Promise((resolve) => {
// // // //             // added for sonnet-3.5 7th attempt
// // // //             if (!this.socket) {
// // // //                 throw new Error("UDP socket is not initialized");
// // // //             }
// // // //             // added for sonnet-3.5 7th attempt
// // // //             this.socket.bind(() => {
// // // //                 // removed for sonnet-3.5 7th attempt
// // // //                 // console.log(
// // // //                 //     `[OutboundCallSession] UDP socket bound to ${this.socket.address().port}`
// // // //                 // );
// // // //                 // removed for sonnet-3.5 7th attempt
// // // //                 // added for sonnet-3.5 7th attempt
// // // //                 if (this.socket) {
// // // //                     console.log(
// // // //                         `[OutboundCallSession] UDP socket bound to ${this.socket.address().port}`
// // // //                     );
// // // //                 }
// // // //                 // added for sonnet-3.5 7th attempt
// // // //                 resolve();
// // // //             });
// // // //         });
// // // //     }
// // // //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // //     public async hangup(): Promise<void> {
// // // //         const byeMessage = new RequestMessage(
// // // //             `BYE sip:${extractAddress(this.remotePeer)} SIP/2.0`,
// // // //             {
// // // //                 "Call-Id": this.callId,
// // // //                 From: this.localPeer,
// // // //                 To: this.remotePeer,
// // // //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${randomInt()}`,
// // // //             }
// // // //         );
// // // //         await this.softphone.send(byeMessage);
// // // //         this.dispose();
// // // //     }
// // // //     // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)
// // // // }

// // // // export default OutboundCallSession;
// // // // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite
// // //---------- number 15
// // import { RequestMessage, type InboundMessage } from "../sip-message";
// // import type Softphone from "../softphone";
// // import CallSession from ".";
// // import { extractAddress, withoutTag } from "../utils";
// // import dgram from "dgram";
// // import { RtpPacket } from "werift-rtp";

// // class OutboundCallSession extends CallSession {
// //     constructor(softphone: Softphone, answerMessage: InboundMessage) {
// //         super(softphone, answerMessage);
// //         this.localPeer = answerMessage.headers.From;
// //         this.remotePeer = answerMessage.headers.To;
// //     }

// //     public async init() {
// //         console.log("[OutboundCallSession] Initializing outbound call session");
// //         const answerHandler = (message: InboundMessage) => {
// //             if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
// //                 console.log(
// //                     `[OutboundCallSession] Emitting message: ${message}`
// //                 );
// //                 this.softphone.off("message", answerHandler);
// //                 this.emit("answered");

// //                 const ackMessage = new RequestMessage(
// //                     `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
// //                     {
// //                         "Call-Id": this.callId,
// //                         From: this.localPeer,
// //                         To: this.remotePeer,
// //                         Via: this.sipMessage.headers.Via,
// //                         CSeq: this.sipMessage.headers.CSeq.replace(
// //                             " INVITE",
// //                             " ACK"
// //                         ),
// //                     }
// //                 );
// //                 this.softphone.send(ackMessage);
// //             }
// //         };
// //         this.softphone.on("message", answerHandler);
// //         this.once("answered", async () => this.startLocalServices());
// //     }

// //     public async cancel() {
// //         console.log("[OutboundCallSession] Canceling call");
// //         const requestMessage = new RequestMessage(
// //             `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: withoutTag(this.remotePeer),
// //                 Via: this.sipMessage.headers.Via,
// //                 CSeq: this.sipMessage.headers.CSeq.replace(
// //                     " INVITE",
// //                     " CANCEL"
// //                 ),
// //             }
// //         );
// //         await this.softphone.send(requestMessage);
// //     }

// //     protected async startLocalServices(): Promise<void> {
// //         console.log("[OutboundCallSession] Starting local services");
// //         this.socket = dgram.createSocket("udp4");

// //         this.socket.on("message", (message) => {
// //             console.log(`[OutboundCallSession] Receiving message: ${message}`);
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             if (rtpPacket.header.payloadType === 0) {
// //                 // PCMU
// //                 console.log(`[OutboundCallSession] Emitting PCMU Packet`);
// //                 this.emit("audioPacket", rtpPacket.payload);
// //             } else if (rtpPacket.header.payloadType === 101) {
// //                 // DTMF
// //                 console.log(`[OutboundCallSession] Emitting DTMF Packet`);
// //                 this.emit("dtmfPacket", rtpPacket);
// //             }
// //         });

// //         return new Promise<void>((resolve) => {
// //             console.log("[OutboundCallSession] Initializing UDP socket");
// //             if (!this.socket) {
// //                 throw new Error("UDP socket is not initialized");
// //             }
// //             this.socket.bind(() => {
// //                 console.log(
// //                     `[OutboundCallSession] UDP socket bound to ${this.socket?.address().port}`
// //                 );
// //                 resolve();
// //             });
// //         });
// //     }
// // }

// // export default OutboundCallSession;

// //27 ----------------------
// // import { RequestMessage, type InboundMessage } from "../sip-message";
// // import type Softphone from "../softphone";
// // import CallSession from ".";
// // import { extractAddress, withoutTag } from "../utils";
// // import dgram from "dgram";
// // import { RtpPacket } from "werift-rtp";

// // class OutboundCallSession extends CallSession {
// //     constructor(softphone: Softphone, answerMessage: InboundMessage) {
// //         super(softphone, answerMessage);
// //         this.localPeer = answerMessage.headers.From;
// //         this.remotePeer = answerMessage.headers.To;
// //         console.log(
// //             `[OutboundCallSession] Created for call ID: ${this.callId}`
// //         );
// //     }

// //     public async init() {
// //         console.log("[OutboundCallSession] Initializing outbound call session");

// //         const answerHandler = (message: InboundMessage) => {
// //             console.log(
// //                 `[OutboundCallSession] Received SIP message: ${message.subject}`
// //             );
// //             if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
// //                 console.log(
// //                     "[OutboundCallSession] Matching CSeq found, call is answered"
// //                 );
// //                 this.softphone.off("message", answerHandler);
// //                 this.emit("answered");

// //                 const ackMessage = new RequestMessage(
// //                     `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
// //                     {
// //                         "Call-Id": this.callId,
// //                         From: this.localPeer,
// //                         To: this.remotePeer,
// //                         Via: this.sipMessage.headers.Via,
// //                         CSeq: this.sipMessage.headers.CSeq.replace(
// //                             " INVITE",
// //                             " ACK"
// //                         ),
// //                     }
// //                 );
// //                 console.log(
// //                     `[OutboundCallSession] Sending ACK for call ID: ${this.callId}`
// //                 );
// //                 this.softphone.send(ackMessage);
// //             }
// //         };

// //         this.softphone.on("message", answerHandler);
// //         this.once("answered", async () => {
// //             console.log(
// //                 "[OutboundCallSession] Call answered, starting local services"
// //             );
// //             await this.startLocalServices();
// //         });

// //         // Additional safeguard to ensure logging
// //         this.on("audioPacket", (packet) => {
// //             console.log(
// //                 `[OutboundCallSession] Received audio packet, size: ${packet.length}`
// //             );
// //         });

// //         this.on("dtmfPacket", (packet) => {
// //             console.log(`[OutboundCallSession] Received DTMF packet`);
// //         });
// //     }

// //     public async cancel() {
// //         console.log("[OutboundCallSession] Canceling call");
// //         const requestMessage = new RequestMessage(
// //             `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: withoutTag(this.remotePeer),
// //                 Via: this.sipMessage.headers.Via,
// //                 CSeq: this.sipMessage.headers.CSeq.replace(
// //                     " INVITE",
// //                     " CANCEL"
// //                 ),
// //             }
// //         );
// //         await this.softphone.send(requestMessage);
// //         console.log(
// //             `[OutboundCallSession] CANCEL message sent for call ID: ${this.callId}`
// //         );
// //     }

// //     protected async startLocalServices(): Promise<void> {
// //         console.log("[OutboundCallSession] Starting local services");
// //         this.socket = dgram.createSocket("udp4");

// //         this.socket.on("message", (message) => {
// //             console.log(
// //                 `[OutboundCallSession] Received RTP message of size: ${message.length}`
// //             );
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             if (rtpPacket.header.payloadType === 0) {
// //                 // PCMU
// //                 console.log(`[OutboundCallSession] Received PCMU audio packet`);
// //                 this.emit("audioPacket", rtpPacket.payload);
// //             } else if (rtpPacket.header.payloadType === 101) {
// //                 // DTMF
// //                 console.log(`[OutboundCallSession] Received DTMF packet`);
// //                 this.emit("dtmfPacket", rtpPacket);
// //             }
// //         });

// //         return new Promise<void>((resolve) => {
// //             if (!this.socket) {
// //                 throw new Error("UDP socket is not initialized");
// //             }
// //             this.socket.bind(() => {
// //                 console.log(
// //                     `[OutboundCallSession] UDP socket bound to port ${this.socket?.address().port}`
// //                 );
// //                 resolve();
// //             });
// //         });
// //     }
// // }

// // export default OutboundCallSession;
// // ------------------------

// 3.1
import { InboundMessage, RequestMessage } from "../sip-message";
import type Softphone from "../softphone";
import CallSession from ".";
import { extractAddress, withoutTag } from "../utils";

class OutboundCallSession extends CallSession {
    constructor(softphone: Softphone, answerMessage: InboundMessage) {
        super(softphone, answerMessage);
        this.localPeer = answerMessage.headers.From;
        this.remotePeer = answerMessage.headers.To;
        this.init();
    }

    public async init() {
        const answerHandler = (message: InboundMessage) => {
            if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
                this.softphone.off("message", answerHandler);
                this.emit("answered");

                const ackMessage = new RequestMessage(
                    `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
                    {
                        "Call-Id": this.callId,
                        From: this.localPeer,
                        To: this.remotePeer,
                        Via: this.sipMessage.headers.Via,
                        CSeq: this.sipMessage.headers.CSeq.replace(
                            " INVITE",
                            " ACK"
                        ),
                    }
                );
                this.softphone.send(ackMessage);
            }
        };
        this.softphone.on("message", answerHandler);
        this.once("answered", async () => this.startLocalServices());
    }

    public async cancel() {
        const requestMessage = new RequestMessage(
            `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
            {
                "Call-Id": this.callId,
                From: this.localPeer,
                To: withoutTag(this.remotePeer),
                Via: this.sipMessage.headers.Via,
                CSeq: this.sipMessage.headers.CSeq.replace(
                    " INVITE",
                    " CANCEL"
                ),
            }
        );
        this.softphone.send(requestMessage);
    }
}

export default OutboundCallSession;
// 3.1
