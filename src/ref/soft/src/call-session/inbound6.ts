// import { ResponseMessage, type InboundMessage } from "../sip-message";
// import { randomInt } from "../utils";
// import type Softphone from "../softphone";
// import CallSession from ".";

// class InboundCallSession extends CallSession {
//     public constructor(softphone: Softphone, inviteMessage: InboundMessage) {
//         super(softphone, inviteMessage);
//         this.localPeer = inviteMessage.headers.To;
//         this.remotePeer = inviteMessage.headers.From;
//     }

//     public async answer() {
//         const answerSDP = `
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
// `.trim();
//         const newMessage = new ResponseMessage(
//             this.sipMessage,
//             200,
//             {
//                 "Content-Type": "application/sdp",
//             },
//             answerSDP
//         );
//         this.softphone.send(newMessage);

//         this.startLocalServices();
//     }
// }

// export default InboundCallSession;

// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // import { ResponseMessage, type InboundMessage } from "../sip-message";
// // import { randomInt } from "../utils";
// // import type Softphone from "../softphone";
// // import CallSession from ".";

// // class InboundCallSession extends CallSession {
// //     public constructor(softphone: Softphone, inviteMessage: InboundMessage) {
// //         super(softphone, inviteMessage);
// //         this.localPeer = inviteMessage.headers.To;
// //         this.remotePeer = inviteMessage.headers.From;
// //     }

// //     public async answer() {
// //         const answerSDP = `
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
// // `.trim();
// //         const newMessage = new ResponseMessage(
// //             this.sipMessage,
// //             200,
// //             {
// //                 "Content-Type": "application/sdp",
// //             },
// //             answerSDP
// //         );
// //         this.softphone.send(newMessage);

// //         this.startLocalServices();
// //     }
// // }

// // export default InboundCallSession;
// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions

// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite
// // call-session/inbound.ts

// // import {
// //     RequestMessage,
// //     ResponseMessage,
// //     type InboundMessage,
// // } from "../sip-message";
// // import { randomInt } from "../utils";
// // import type Softphone from "../softphone";
// // import CallSession from ".";
// // import dgram from "dgram";
// // import { RtpPacket } from "werift-rtp";

// // class InboundCallSession extends CallSession {
// //     constructor(softphone: Softphone, inviteMessage: InboundMessage) {
// //         super(softphone, inviteMessage);
// //         this.localPeer = inviteMessage.headers.To;
// //         this.remotePeer = inviteMessage.headers.From;
// //     }

// //     public async answer() {
// //         const answerSDP = `
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
// // `.trim();
// //         const newMessage = new ResponseMessage(
// //             this.sipMessage,
// //             200,
// //             {
// //                 "Content-Type": "application/sdp",
// //             },
// //             answerSDP
// //         );
// //         this.softphone.send(newMessage);

// //         await this.startLocalServices();
// //     }

// //     public send(data: Buffer) {
// //         // removed for sonnet-3.5 7th attempt
// //         // this.socket.send(data, this.remotePort, this.remoteIP, (error) => {
// //         //     if (error) {
// //         //         console.error(
// //         //             "[InboundCallSession] Error sending RTP packet:",
// //         //             error
// //         //         );
// //         //     } else {
// //         //         this.packetsSent++;
// //         //         this.bytesSent += data.length;
// //         //     }
// //         // });
// //         // removedfor sonnet-3.5 7th attempt
// //         // added for sonnet-3.5 7th attempt
// //         if (this.isActive && this.socket) {
// //             this.socket.send(data, this.remotePort, this.remoteIP, (error) => {
// //                 if (error) {
// //                     console.error(
// //                         `[${this.constructor.name}] Error sending RTP packet:`,
// //                         error
// //                     );
// //                 } else {
// //                     this.packetsSent++;
// //                     this.bytesSent += data.length;
// //                 }
// //             });
// //         } else {
// //             console.warn(
// //                 `[${this.constructor.name}] Attempted to send data without an active socket`
// //             );
// //         }
// //         // added for sonnet-3.5 7th attempt
// //     }

// //     public async sendAudio(audioData: Buffer): Promise<void> {
// //         const rtpPacket = this.createRtpPacket(audioData);
// //         this.send(rtpPacket.serialize());
// //     }

// //     protected async startLocalServices(): Promise<void> {
// //         // added for sonnet-3.5 7th attempt
// //         this.initSocket();
// //         if (!this.socket) {
// //             throw new Error("Failed to initialize UDP socket");
// //         }
// //         // added for sonnet-3.5 7th attempt
// //         // removefor sonnet-3.5 7th attempt
// //         // this.socket = dgram.createSocket("udp4");
// //         // removefor sonnet-3.5 7th attempt

// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             if (rtpPacket.header.payloadType === 0) {
// //                 // PCMU
// //                 this.emit("audioPacket", rtpPacket.payload);
// //             } else if (rtpPacket.header.payloadType === 101) {
// //                 // DTMF
// //                 this.emit("dtmfPacket", rtpPacket);
// //             }
// //         });

// //         return new Promise((resolve) => {
// //             // added for sonnet-3.5 7th attempt
// //             if (!this.socket) {
// //                 throw new Error("UDP socket is not initialized");
// //             }
// //             // added for sonnet-3.5 7th attempt
// //             this.socket.bind(() => {
// //                 // removed for sonnet-3.5 7th attempt
// //                 // console.log(
// //                 //     `[InboundCallSession] UDP socket bound to ${this.socket.address().port}`
// //                 // );
// //                 // removed for sonnet-3.5 7th attempt
// //                 // addedfor sonnet-3.5 7th attempt
// //                 if (this.socket) {
// //                     console.log(
// //                         `[InboundCallSession] UDP socket bound to ${this.socket.address().port}`
// //                     );
// //                 }
// //                 // addedfor sonnet-3.5 7th attempt
// //                 resolve();
// //             });
// //         });
// //     }

// //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// //     public async hangup(): Promise<void> {
// //         const byeMessage = new RequestMessage(
// //             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${randomInt()}`,
// //             }
// //         );
// //         await this.softphone.send(byeMessage);
// //         this.dispose();
// //     }
// //     // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)
// // }

// // export default InboundCallSession;
// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite

export default {};
