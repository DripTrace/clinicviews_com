// // latest working
// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import path from "path";
// // import {
// //     RequestMessage,
// //     type InboundMessage,
// //     ResponseMessage,
// // } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { branch, extractAddress, randomInt } from "../utils";
// // import DTMF from "../dtmf";
// // import Streamer from "./streamer";

// // abstract class CallSession extends EventEmitter {
// //     private webSocket: WebSocket | null = null;
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     public socket!: dgram.Socket;
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     // private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogFolder: string = path.join(process.cwd(), "audio_logs");

// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;

// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;

// //     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         this.remotePort = parseInt(
// //             this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //             10
// //         );
// //         this.startTime = Date.now();
// //         this.ssrc = randomInt();
// //     }

// //     public setWebSocket(ws: WebSocket) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     public send(data: Buffer) {
// //         this.socket.send(data, this.remotePort, this.remoteIP);
// //         this.packetsSent++;
// //         this.bytesSent += data.length;
// //     }

// //     public async transfer(target: string) {
// //         const requestMessage = new RequestMessage(
// //             `REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //                 "Refer-To": `sip:${target}@sip.ringcentral.com`,
// //                 "Referred-By": `<${extractAddress(this.localPeer)}>`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //         const notifyHandler = (inboundMessage: InboundMessage) => {
// //             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
// //                 return;
// //             }
// //             const responseMessage = new ResponseMessage(inboundMessage, 200);
// //             this.softphone.send(responseMessage);
// //             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
// //                 this.softphone.off("message", notifyHandler);
// //             }
// //         };
// //         this.softphone.on("message", notifyHandler);
// //     }

// //     public async hangup() {
// //         const requestMessage = new RequestMessage(
// //             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //     }

// //     public async sendDTMF(
// //         char:
// //             | "0"
// //             | "1"
// //             | "2"
// //             | "3"
// //             | "4"
// //             | "5"
// //             | "6"
// //             | "7"
// //             | "8"
// //             | "9"
// //             | "*"
// //             | "#"
// //     ) {
// //         const timestamp = Math.floor(Date.now() / 1000);
// //         let sequenceNumber = timestamp % 65536;
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             paddingSize: 0,
// //             extension: false,
// //             marker: false,
// //             payloadOffset: 12,
// //             payloadType: 101,
// //             sequenceNumber,
// //             timestamp,
// //             ssrc: this.ssrc,
// //             csrcLength: 0,
// //             csrc: [],
// //             extensionProfile: 48862,
// //             extensionLength: undefined,
// //             extensions: [],
// //         });
// //         for (const payload of DTMF.charToPayloads(char)) {
// //             rtpHeader.sequenceNumber = sequenceNumber++;
// //             const rtpPacket = new RtpPacket(rtpHeader, payload);
// //             this.send(rtpPacket.serialize());
// //         }
// //     }

// //     public streamAudio(input: Buffer) {
// //         const streamer = new Streamer(this, input);
// //         streamer.start();
// //         return streamer;
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         console.log(
// //             `[CallSession] Sending audio data, size: ${audioData.length} bytes`
// //         );
// //         const rtpPacket = this.createRtpPacketFromAudio(audioData);
// //         console.log(
// //             `[CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`
// //         );
// //         this.send(rtpPacket.serialize());

// //         // Log outgoing audio as well
// //         this.logAudioPacket(rtpPacket);
// //     }

// //     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0,
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2;

// //         console.log(
// //             `[CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`
// //         );

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     protected async startLocalServices() {
// //         this.socket = dgram.createSocket("udp4");
// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             console.log(
// //                 `[CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`
// //             );

// //             if (rtpPacket.header.payloadType === 101) {
// //                 this.emit("dtmfPacket", rtpPacket);
// //                 const char = DTMF.payloadToChar(rtpPacket.payload);
// //                 if (char) {
// //                     this.emit("dtmf", char);
// //                     console.log(`[CallSession] Received DTMF: ${char}`);
// //                 }
// //             } else {
// //                 this.emit("audioPacket", rtpPacket);
// //                 this.handleAudioPacket(rtpPacket);
// //             }
// //         });
// //         this.socket.bind();

// //         const byeHandler = (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.headers["Call-Id"] !== this.callId) {
// //                 return;
// //             }
// //             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
// //                 this.softphone.off("message", byeHandler);
// //                 this.dispose();
// //             }
// //         };
// //         this.softphone.on("message", byeHandler);

// //         // Ensure the audio logs folder exists
// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }

// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${this.callId}.raw`
// //         );
// //         this.audioLogStream = fs.createWriteStream(audioLogPath, {
// //             flags: "a",
// //         });
// //         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(
// //             `[CallSession] Handling audio packet - Payload size: ${packet.payload.length}`
// //         );
// //         this.logAudioPacket(packet);
// //         this.sendAudioToClient(packet.payload);
// //     }

// //     private sendAudioToClient(audioData: Buffer) {
// //         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
// //             console.log(
// //                 `[CallSession] Sending audio to client - Size: ${audioData.length}`
// //             );
// //             this.webSocket.send(audioData);
// //         } else {
// //             console.log(
// //                 `[CallSession] WebSocket not ready, audio not sent to client`
// //             );
// //         }
// //     }

// //     private logAudioPacket(packet: RtpPacket) {
// //         if (this.audioLogStream) {
// //             this.audioLogStream.write(packet.payload);
// //             console.log(
// //                 `[CallSession] Audio packet logged: Timestamp=${packet.header.timestamp}, SequenceNumber=${packet.header.sequenceNumber}, PayloadSize=${packet.payload.length}`
// //             );
// //         } else {
// //             console.warn(
// //                 `[CallSession] Audio log stream not available for CallID: ${this.callId}`
// //             );
// //         }
// //     }

// //     protected dispose() {
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         this.socket.removeAllListeners();
// //         this.socket.close();
// //         if (this.audioLogStream) {
// //             this.audioLogStream.end(() => {
// //                 console.log(
// //                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
// //                 );
// //             });
// //         }
// //         if (this.webSocket) {
// //             this.webSocket.close();
// //         }
// //     }
// // }

// // export default CallSession;

// // attempt 2
// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import path from "path";

// // import {
// //     RequestMessage,
// //     type InboundMessage,
// //     ResponseMessage,
// // } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { branch, extractAddress, randomInt } from "../utils";
// // import DTMF from "../dtmf";
// // import Streamer from "./streamer";

// // abstract class CallSession extends EventEmitter {
// //     private webSocket: WebSocket | null = null;
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     public socket!: dgram.Socket;
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "../../../../src/data/llpmg/calls/"
// //     );
// //     private getRootPath(): string {
// //         return path.resolve(__dirname, "../../../../"); // Adjust to ensure it points to your project root
// //     }

// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;

// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;

// //     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         this.remotePort = parseInt(
// //             this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //             10
// //         );
// //         this.startTime = Date.now();
// //         this.ssrc = randomInt();
// //     }

// //     public setWebSocket(ws: WebSocket) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     public send(data: Buffer) {
// //         this.socket.send(data, this.remotePort, this.remoteIP);
// //         this.packetsSent++;
// //         this.bytesSent += data.length;
// //     }

// //     public async transfer(target: string) {
// //         const requestMessage = new RequestMessage(
// //             `REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //                 "Refer-To": `sip:${target}@sip.ringcentral.com`,
// //                 "Referred-By": `<${extractAddress(this.localPeer)}>`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //         const notifyHandler = (inboundMessage: InboundMessage) => {
// //             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
// //                 return;
// //             }
// //             const responseMessage = new ResponseMessage(inboundMessage, 200);
// //             this.softphone.send(responseMessage);
// //             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
// //                 this.softphone.off("message", notifyHandler);
// //             }
// //         };
// //         this.softphone.on("message", notifyHandler);
// //     }

// //     public async hangup() {
// //         const requestMessage = new RequestMessage(
// //             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //     }

// //     public async sendDTMF(
// //         char:
// //             | "0"
// //             | "1"
// //             | "2"
// //             | "3"
// //             | "4"
// //             | "5"
// //             | "6"
// //             | "7"
// //             | "8"
// //             | "9"
// //             | "*"
// //             | "#"
// //     ) {
// //         const timestamp = Math.floor(Date.now() / 1000);
// //         let sequenceNumber = timestamp % 65536;
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             paddingSize: 0,
// //             extension: false,
// //             marker: false,
// //             payloadOffset: 12,
// //             payloadType: 101,
// //             sequenceNumber,
// //             timestamp,
// //             ssrc: this.ssrc,
// //             csrcLength: 0,
// //             csrc: [],
// //             extensionProfile: 48862,
// //             extensionLength: undefined,
// //             extensions: [],
// //         });
// //         for (const payload of DTMF.charToPayloads(char)) {
// //             rtpHeader.sequenceNumber = sequenceNumber++;
// //             const rtpPacket = new RtpPacket(rtpHeader, payload);
// //             this.send(rtpPacket.serialize());
// //         }
// //     }

// //     public streamAudio(input: Buffer) {
// //         const streamer = new Streamer(this, input);
// //         streamer.start();
// //         return streamer;
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         console.log(
// //             `[CallSession] Sending audio data, size: ${audioData.length} bytes`
// //         );
// //         const rtpPacket = this.createRtpPacketFromAudio(audioData);
// //         console.log(
// //             `[CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`
// //         );
// //         this.send(rtpPacket.serialize());
// //         this.logAudioPacket(rtpPacket);
// //     }

// //     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0,
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2;

// //         console.log(
// //             `[CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`
// //         );

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     protected async startLocalServices() {
// //         this.socket = dgram.createSocket("udp4");
// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             console.log(
// //                 `[CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`
// //             );

// //             if (rtpPacket.header.payloadType === 101) {
// //                 this.emit("dtmfPacket", rtpPacket);
// //                 const char = DTMF.payloadToChar(rtpPacket.payload);
// //                 if (char) {
// //                     this.emit("dtmf", char);
// //                     console.log(`[CallSession] Received DTMF: ${char}`);
// //                 }
// //             } else {
// //                 this.emit("audioPacket", rtpPacket);
// //                 this.handleAudioPacket(rtpPacket);
// //             }
// //         });
// //         this.socket.bind();

// //         const byeHandler = (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.headers["Call-Id"] !== this.callId) {
// //                 return;
// //             }
// //             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
// //                 this.softphone.off("message", byeHandler);
// //                 this.dispose();
// //             }
// //         };
// //         this.softphone.on("message", byeHandler);

// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }

// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${this.callId}.raw`
// //         );
// //         // const audioLogPath = path.join(
// //         //     __dirname,
// //         //     "../../../../src/data/llpmg/calls/",
// //         //     `audio_log_${this.callId}.raw`
// //         // );
// //         // const rootPath = this.getRootPath();
// //         // const audioLogPath = path.join(
// //         //     rootPath,
// //         //     `src/data/llpmg/calls/audio_log_${this.callId}.raw`
// //         // );
// //         this.audioLogStream = fs.createWriteStream(audioLogPath, {
// //             flags: "a",
// //         });
// //         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(
// //             `[CallSession] Handling audio packet - Payload size: ${packet.payload.length}`
// //         );
// //         this.logAudioPacket(packet);
// //         this.sendAudioToClient(packet.payload);
// //     }

// //     private sendAudioToClient(audioData: Buffer) {
// //         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
// //             console.log(
// //                 `[CallSession] Sending audio to client - Size: ${audioData.length}`
// //             );
// //             this.webSocket.send(audioData);
// //         } else {
// //             console.log(
// //                 `[CallSession] WebSocket not ready, audio not sent to client`
// //             );
// //         }
// //     }

// //     private logAudioPacket(packet: RtpPacket) {
// //         if (this.audioLogStream) {
// //             this.audioLogStream.write(packet.payload);
// //             console.log(
// //                 `[CallSession] Audio packet logged: Timestamp=${packet.header.timestamp}, SequenceNumber=${packet.header.sequenceNumber}, PayloadSize=${packet.payload.length}`
// //             );
// //         } else {
// //             console.warn(
// //                 `[CallSession] Audio log stream not available for CallID: ${this.callId}`
// //             );
// //         }
// //     }

// //     protected dispose() {
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         this.socket.removeAllListeners();
// //         this.socket.close();
// //         if (this.audioLogStream) {
// //             this.audioLogStream.end(() => {
// //                 console.log(
// //                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
// //                 );
// //             });
// //         }
// //         if (this.webSocket) {
// //             this.webSocket.close();
// //         }
// //     }
// // }

// // export default CallSession;

// // ------------ latest claude
// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import path from "path";

// // import {
// //     RequestMessage,
// //     type InboundMessage,
// //     ResponseMessage,
// // } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { branch, extractAddress, randomInt } from "../utils";
// // import DTMF from "../dtmf";
// // import Streamer from "./streamer";
// // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // abstract class CallSession extends EventEmitter {
// //     private webSocket: WebSocket | null = null;
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     public socket!: dgram.Socket;
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         // "../../../../../src/data/llpmg/calls/"
// //         "/src/data/llpmg/calls/"
// //     );
// //     private packetCounter: number = 0;

// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;

// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;

// //     private audioPackets: Buffer[] = [];

// //     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         this.remotePort = parseInt(
// //             this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //             10
// //         );
// //         this.startTime = Date.now();
// //         this.ssrc = randomInt();
// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }
// //     }

// //     public setWebSocket(ws: WebSocket) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     public send(data: Buffer) {
// //         this.socket.send(data, this.remotePort, this.remoteIP);
// //         this.packetsSent++;
// //         this.bytesSent += data.length;
// //     }

// //     public async transfer(target: string) {
// //         const requestMessage = new RequestMessage(
// //             `REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //                 "Refer-To": `sip:${target}@sip.ringcentral.com`,
// //                 "Referred-By": `<${extractAddress(this.localPeer)}>`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //         const notifyHandler = (inboundMessage: InboundMessage) => {
// //             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
// //                 return;
// //             }
// //             const responseMessage = new ResponseMessage(inboundMessage, 200);
// //             this.softphone.send(responseMessage);
// //             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
// //                 this.softphone.off("message", notifyHandler);
// //             }
// //         };
// //         this.softphone.on("message", notifyHandler);
// //     }

// //     public async hangup() {
// //         const requestMessage = new RequestMessage(
// //             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //     }

// //     public async sendDTMF(
// //         char:
// //             | "0"
// //             | "1"
// //             | "2"
// //             | "3"
// //             | "4"
// //             | "5"
// //             | "6"
// //             | "7"
// //             | "8"
// //             | "9"
// //             | "*"
// //             | "#"
// //     ) {
// //         const timestamp = Math.floor(Date.now() / 1000);
// //         let sequenceNumber = timestamp % 65536;
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             paddingSize: 0,
// //             extension: false,
// //             marker: false,
// //             payloadOffset: 12,
// //             payloadType: 101,
// //             sequenceNumber,
// //             timestamp,
// //             ssrc: this.ssrc,
// //             csrcLength: 0,
// //             csrc: [],
// //             extensionProfile: 48862,
// //             extensionLength: undefined,
// //             extensions: [],
// //         });
// //         for (const payload of DTMF.charToPayloads(char)) {
// //             rtpHeader.sequenceNumber = sequenceNumber++;
// //             const rtpPacket = new RtpPacket(rtpHeader, payload);
// //             this.send(rtpPacket.serialize());
// //         }
// //     }

// //     public streamAudio(input: Buffer) {
// //         const streamer = new Streamer(this, input);
// //         streamer.start();
// //         return streamer;
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         console.log(
// //             `[CallSession] Sending audio data, size: ${audioData.length} bytes`
// //         );
// //         const rtpPacket = this.createRtpPacketFromAudio(audioData);
// //         console.log(
// //             `[CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`
// //         );
// //         this.send(rtpPacket.serialize());
// //         this.logAudioPacket(rtpPacket);
// //     }

// //     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0,
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2;

// //         console.log(
// //             `[CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`
// //         );

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     protected async startLocalServices() {
// //         this.socket = dgram.createSocket("udp4");
// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             console.log(
// //                 `[CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`
// //             );

// //             if (rtpPacket.header.payloadType === 101) {
// //                 this.emit("dtmfPacket", rtpPacket);
// //                 const char = DTMF.payloadToChar(rtpPacket.payload);
// //                 if (char) {
// //                     this.emit("dtmf", char);
// //                     console.log(`[CallSession] Received DTMF: ${char}`);
// //                 }
// //             } else {
// //                 this.emit("audioPacket", rtpPacket);
// //                 this.handleAudioPacket(rtpPacket);
// //             }
// //         });
// //         this.socket.bind();

// //         const byeHandler = (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.headers["Call-Id"] !== this.callId) {
// //                 return;
// //             }
// //             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
// //                 this.softphone.off("message", byeHandler);
// //                 this.dispose();
// //             }
// //         };
// //         this.softphone.on("message", byeHandler);

// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }

// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${this.callId}.raw`
// //         );
// //         this.audioLogStream = fs.createWriteStream(audioLogPath, {
// //             flags: "a",
// //         });
// //         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(
// //             `[CallSession] Handling audio packet - Payload size: ${packet.payload.length}`
// //         );
// //         this.audioPackets.push(packet.payload);
// //         this.sendAudioToClient(packet.payload);
// //     }

// //     private sendAudioToClient(audioData: Buffer) {
// //         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
// //             console.log(
// //                 `[CallSession] Sending audio to client - Size: ${audioData.length}`
// //             );
// //             this.webSocket.send(audioData);
// //         } else {
// //             console.log(
// //                 `[CallSession] WebSocket not ready, audio not sent to client`
// //             );
// //         }
// //     }

// //     public async endCall() {
// //         console.log(
// //             `[CallSession] Ending call, total audio packets: ${this.audioPackets.length}`
// //         );
// //         if (this.audioPackets.length > 0) {
// //             const rawAudioBuffer = Buffer.concat(this.audioPackets);
// //             const rawAudioPath = path.join(
// //                 this.audioLogFolder,
// //                 `audio_log_${this.callId}.raw`
// //             );
// //             fs.writeFileSync(rawAudioPath, rawAudioBuffer);
// //             console.log(
// //                 `[CallSession] Raw audio saved to ${rawAudioPath}, size: ${rawAudioBuffer.length} bytes`
// //             );

// //             // Trigger conversion to Ogg
// //             await this.softphone.convertToOgg(rawAudioPath, this.callId);
// //         } else {
// //             console.log(
// //                 `[CallSession] No audio packets captured during the call`
// //             );
// //         }

// //         this.dispose();
// //     }

// //     private logAudioPacket(packet: RtpPacket) {
// //         if (this.audioLogStream) {
// //             this.audioLogStream.write(packet.payload);
// //         }
// //     }

// //     protected dispose() {
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         this.socket.removeAllListeners();
// //         this.socket.close();
// //         if (this.audioLogStream) {
// //             this.audioLogStream.end(() => {
// //                 console.log(
// //                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
// //                 );
// //                 // The conversion is now handled in the Softphone class
// //             });
// //         }
// //         if (this.webSocket) {
// //             this.webSocket.close();
// //         }
// //         this.audioPackets = []; // Clear the audio packets
// //     }

// //     private convertRawAudioToOgg(rawAudioPath: string) {
// //         const date = new Date().toISOString().replace(/[:.]/g, "-");
// //         const callId = path.basename(rawAudioPath, ".raw");
// //         const oggAudioPath = path.join(
// //             path.dirname(rawAudioPath),
// //             `audio_log_${callId}_${date}.ogg`
// //         );

// //         console.log(
// //             `[CallSession] Converting raw audio to Ogg Vorbis format: ${rawAudioPath} -> ${oggAudioPath}`
// //         );

// //         if (fs.existsSync(rawAudioPath)) {
// //             const rawAudioData = fs.readFileSync(rawAudioPath);

// //             try {
// //                 // Perform the conversion from raw PCM to Ogg Vorbis
// //                 const encoder = new OggVorbisEncoder(rawAudioData, 44100, 2);
// //                 encoder.saveToFile(oggAudioPath);

// //                 console.log(
// //                     `[CallSession] Audio log successfully converted to ${oggAudioPath}`
// //                 );
// //                 fs.unlinkSync(rawAudioPath); // Remove the raw file after conversion
// //             } catch (error) {
// //                 console.error(
// //                     `[CallSession] Failed to convert raw audio to Ogg Vorbis format: ${error}`
// //                 );
// //             }
// //         } else {
// //             console.error(
// //                 `[CallSession] No raw audio log found for conversion`
// //             );
// //         }
// //     }
// // }

// // export default CallSession;
// // --------------------- latest claude

// // looking for audio log (logs exist but error)
// import EventEmitter from "events";
// import dgram from "dgram";
// import { RtpHeader, RtpPacket } from "werift-rtp";
// import * as fs from "fs";
// import WebSocket from "ws";
// import path from "path";

// import {
//     RequestMessage,
//     type InboundMessage,
//     ResponseMessage,
// } from "../sip-message";
// import type Softphone from "../softphone";
// import { branch, extractAddress, randomInt } from "../utils";
// import DTMF from "../dtmf";
// import Streamer from "./streamer";

// abstract class CallSession extends EventEmitter {
//     private webSocket: WebSocket | null = null;
//     public softphone: Softphone;
//     public sipMessage: InboundMessage;
//     public socket!: dgram.Socket;
//     public localPeer!: string;
//     public remotePeer!: string;
//     public remoteIP: string;
//     public remotePort: number;
//     public disposed = false;
//     private audioLogStream: fs.WriteStream | null = null;
//     private audioLogFolder: string = path.join(process.cwd(), "audio_logs");

//     public startTime: number;
//     public bytesReceived: number = 0;
//     public bytesSent: number = 0;
//     public packetsReceived: number = 0;
//     public packetsSent: number = 0;

//     private sequenceNumber: number = 0;
//     private timestamp: number = 0;
//     private ssrc: number;

//     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
//         super();
//         this.softphone = softphone;
//         this.sipMessage = sipMessage;
//         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
//         this.remotePort = parseInt(
//             this.sipMessage.body.match(/m=audio (\d+) /)![1],
//             10
//         );
//         this.startTime = Date.now();
//         this.ssrc = randomInt();
//     }

//     public setWebSocket(ws: WebSocket) {
//         this.webSocket = ws;
//         console.log("[CallSession] WebSocket connection established");
//     }

//     public get callId() {
//         return this.sipMessage.headers["Call-Id"];
//     }

//     public send(data: Buffer) {
//         this.socket.send(data, this.remotePort, this.remoteIP);
//         this.packetsSent++;
//         this.bytesSent += data.length;
//     }

//     public async transfer(target: string) {
//         const requestMessage = new RequestMessage(
//             `REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`,
//             {
//                 "Call-Id": this.callId,
//                 From: this.localPeer,
//                 To: this.remotePeer,
//                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
//                 "Refer-To": `sip:${target}@sip.ringcentral.com`,
//                 "Referred-By": `<${extractAddress(this.localPeer)}>`,
//             }
//         );
//         this.softphone.send(requestMessage);
//         const notifyHandler = (inboundMessage: InboundMessage) => {
//             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
//                 return;
//             }
//             const responseMessage = new ResponseMessage(inboundMessage, 200);
//             this.softphone.send(responseMessage);
//             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
//                 this.softphone.off("message", notifyHandler);
//             }
//         };
//         this.softphone.on("message", notifyHandler);
//     }

//     public async hangup() {
//         const requestMessage = new RequestMessage(
//             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
//             {
//                 "Call-Id": this.callId,
//                 From: this.localPeer,
//                 To: this.remotePeer,
//                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
//             }
//         );
//         this.softphone.send(requestMessage);
//     }

//     public async sendDTMF(
//         char:
//             | "0"
//             | "1"
//             | "2"
//             | "3"
//             | "4"
//             | "5"
//             | "6"
//             | "7"
//             | "8"
//             | "9"
//             | "*"
//             | "#"
//     ) {
//         const timestamp = Math.floor(Date.now() / 1000);
//         let sequenceNumber = timestamp % 65536;
//         const rtpHeader = new RtpHeader({
//             version: 2,
//             padding: false,
//             paddingSize: 0,
//             extension: false,
//             marker: false,
//             payloadOffset: 12,
//             payloadType: 101,
//             sequenceNumber,
//             timestamp,
//             ssrc: this.ssrc,
//             csrcLength: 0,
//             csrc: [],
//             extensionProfile: 48862,
//             extensionLength: undefined,
//             extensions: [],
//         });
//         for (const payload of DTMF.charToPayloads(char)) {
//             rtpHeader.sequenceNumber = sequenceNumber++;
//             const rtpPacket = new RtpPacket(rtpHeader, payload);
//             this.send(rtpPacket.serialize());
//         }
//     }

//     public streamAudio(input: Buffer) {
//         const streamer = new Streamer(this, input);
//         streamer.start();
//         return streamer;
//     }

//     public async sendAudio(audioData: Buffer) {
//         console.log(
//             `[CallSession] Sending audio data, size: ${audioData.length} bytes`
//         );
//         const rtpPacket = this.createRtpPacketFromAudio(audioData);
//         console.log(
//             `[CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`
//         );
//         this.send(rtpPacket.serialize());
//         this.logAudioPacket(rtpPacket);
//     }

//     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
//         const rtpHeader = new RtpHeader({
//             version: 2,
//             padding: false,
//             extension: false,
//             marker: false,
//             payloadType: 0,
//             sequenceNumber: this.sequenceNumber++,
//             timestamp: this.timestamp,
//             ssrc: this.ssrc,
//         });

//         this.timestamp += audioData.length / 2;

//         console.log(
//             `[CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`
//         );

//         return new RtpPacket(rtpHeader, audioData);
//     }

//     protected async startLocalServices() {
//         this.socket = dgram.createSocket("udp4");
//         this.socket.on("message", (message) => {
//             const rtpPacket = RtpPacket.deSerialize(message);
//             this.packetsReceived++;
//             this.bytesReceived += message.length;

//             console.log(
//                 `[CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`
//             );

//             if (rtpPacket.header.payloadType === 101) {
//                 this.emit("dtmfPacket", rtpPacket);
//                 const char = DTMF.payloadToChar(rtpPacket.payload);
//                 if (char) {
//                     this.emit("dtmf", char);
//                     console.log(`[CallSession] Received DTMF: ${char}`);
//                 }
//             } else {
//                 this.emit("audioPacket", rtpPacket);
//                 this.handleAudioPacket(rtpPacket);
//             }
//         });
//         this.socket.bind();

//         const byeHandler = (inboundMessage: InboundMessage) => {
//             if (inboundMessage.headers["Call-Id"] !== this.callId) {
//                 return;
//             }
//             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
//                 this.softphone.off("message", byeHandler);
//                 this.dispose();
//             }
//         };
//         this.softphone.on("message", byeHandler);

//         if (!fs.existsSync(this.audioLogFolder)) {
//             fs.mkdirSync(this.audioLogFolder, { recursive: true });
//         }

//         const audioLogPath = path.join(
//             this.audioLogFolder,
//             `audio_log_${this.callId}.raw`
//         );
//         this.audioLogStream = fs.createWriteStream(audioLogPath, {
//             flags: "a",
//         });
//         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
//     }

//     private handleAudioPacket(packet: RtpPacket) {
//         console.log(
//             `[CallSession] Handling audio packet - Payload size: ${packet.payload.length}`
//         );
//         this.logAudioPacket(packet);
//         this.sendAudioToClient(packet.payload);
//     }

//     private sendAudioToClient(audioData: Buffer) {
//         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
//             console.log(
//                 `[CallSession] Sending audio to client - Size: ${audioData.length}`
//             );
//             this.webSocket.send(audioData);
//         } else {
//             console.log(
//                 `[CallSession] WebSocket not ready, audio not sent to client`
//             );
//         }
//     }

//     private logAudioPacket(packet: RtpPacket) {
//         if (this.audioLogStream) {
//             this.audioLogStream.write(packet.payload);
//             console.log(
//                 `[CallSession] Audio packet logged: Timestamp=${packet.header.timestamp}, SequenceNumber=${packet.header.sequenceNumber}, PayloadSize=${packet.payload.length}`
//             );
//         } else {
//             console.warn(
//                 `[CallSession] Audio log stream not available for CallID: ${this.callId}`
//             );
//         }
//     }

//     protected dispose() {
//         this.disposed = true;
//         this.emit("disposed");
//         this.removeAllListeners();
//         this.socket.removeAllListeners();
//         this.socket.close();
//         if (this.audioLogStream) {
//             this.audioLogStream.end(() => {
//                 console.log(
//                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
//                 );
//             });
//         }
//         if (this.webSocket) {
//             this.webSocket.close();
//         }
//     }
// }

// export default CallSession;
// // looking for audio log (logs exist but error)

// // cleaning logs
// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import path from "path";

// // import {
// //     RequestMessage,
// //     type InboundMessage,
// //     ResponseMessage,
// // } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { branch, extractAddress, randomInt } from "../utils";
// // import DTMF from "../dtmf";
// // import Streamer from "./streamer";
// // import { OggVorbisEncoder } from "@/lib/llpmg/OggVorbisEncoder";

// // abstract class CallSession extends EventEmitter {
// //     private webSocket: WebSocket | null = null;
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     public socket!: dgram.Socket;
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogFolder: string = path.join(
// //         process.cwd(),
// //         "../../../../src/data/llpmg/calls/"
// //     );

// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;

// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;

// //     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         this.remotePort = parseInt(
// //             this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //             10
// //         );
// //         this.startTime = Date.now();
// //         this.ssrc = randomInt();
// //     }

// //     public setWebSocket(ws: WebSocket) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     public send(data: Buffer) {
// //         this.socket.send(data, this.remotePort, this.remoteIP);
// //         this.packetsSent++;
// //         this.bytesSent += data.length;
// //     }

// //     public async transfer(target: string) {
// //         const requestMessage = new RequestMessage(`
// //             REFER sip:${extractAddress(this.remotePeer)} SIP/2.0,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()},
// //                 "Refer-To": sip:${target}@sip.ringcentral.com,
// //                 "Referred-By": <${extractAddress(this.localPeer)}>,
// //             }`);
// //         this.softphone.send(requestMessage);
// //         const notifyHandler = (inboundMessage: InboundMessage) => {
// //             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
// //                 return;
// //             }
// //             const responseMessage = new ResponseMessage(inboundMessage, 200);
// //             this.softphone.send(responseMessage);
// //             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
// //                 this.softphone.off("message", notifyHandler);
// //             }
// //         };
// //         this.softphone.on("message", notifyHandler);
// //     }

// //     public async hangup() {
// //         const requestMessage = new RequestMessage(`
// //             BYE sip:${this.softphone.sipInfo.domain} SIP/2.0,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()},
// //             }`);
// //         this.softphone.send(requestMessage);
// //     }

// //     public async sendDTMF(
// //         char:
// //             | "0"
// //             | "1"
// //             | "2"
// //             | "3"
// //             | "4"
// //             | "5"
// //             | "6"
// //             | "7"
// //             | "8"
// //             | "9"
// //             | "*"
// //             | "#"
// //     ) {
// //         const timestamp = Math.floor(Date.now() / 1000);
// //         let sequenceNumber = timestamp % 65536;
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             paddingSize: 0,
// //             extension: false,
// //             marker: false,
// //             payloadOffset: 12,
// //             payloadType: 101,
// //             sequenceNumber,
// //             timestamp,
// //             ssrc: this.ssrc,
// //             csrcLength: 0,
// //             csrc: [],
// //             extensionProfile: 48862,
// //             extensionLength: undefined,
// //             extensions: [],
// //         });
// //         for (const payload of DTMF.charToPayloads(char)) {
// //             rtpHeader.sequenceNumber = sequenceNumber++;
// //             const rtpPacket = new RtpPacket(rtpHeader, payload);
// //             this.send(rtpPacket.serialize());
// //         }
// //     }

// //     public streamAudio(input: Buffer) {
// //         const streamer = new Streamer(this, input);
// //         streamer.start();
// //         return streamer;
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         console.log(`
// //             [CallSession] Sending audio data, size: ${audioData.length} bytes`);
// //         const rtpPacket = this.createRtpPacketFromAudio(audioData);
// //         console.log(`
// //             [CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`);
// //         this.send(rtpPacket.serialize());
// //         this.logAudioPacket(rtpPacket);
// //     }

// //     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0,
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2;

// //         console.log(`
// //             [CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`);

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     protected async startLocalServices() {
// //         this.socket = dgram.createSocket("udp4");
// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             console.log(`
// //                 [CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`);

// //             if (rtpPacket.header.payloadType === 101) {
// //                 this.emit("dtmfPacket", rtpPacket);
// //                 const char = DTMF.payloadToChar(rtpPacket.payload);
// //                 if (char) {
// //                     this.emit("dtmf", char);
// //                     console.log(`[CallSession] Received DTMF: ${char}`);
// //                 }
// //             } else {
// //                 this.emit("audioPacket", rtpPacket);
// //                 this.handleAudioPacket(rtpPacket);
// //             }
// //         });
// //         this.socket.bind();

// //         const byeHandler = (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.headers["Call-Id"] !== this.callId) {
// //                 return;
// //             }
// //             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
// //                 this.softphone.off("message", byeHandler);
// //                 this.dispose();
// //             }
// //         };
// //         this.softphone.on("message", byeHandler);

// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }

// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `
// //             audio_log_${this.callId}.raw`
// //         );

// //         this.audioLogStream = fs.createWriteStream(audioLogPath, {
// //             flags: "a",
// //         });
// //         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(`
// //             [CallSession] Handling audio packet - Payload size: ${packet.payload.length}`);
// //         this.logAudioPacket(packet);
// //         this.sendAudioToClient(packet.payload);
// //     }

// //     private sendAudioToClient(audioData: Buffer) {
// //         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
// //             console.log(`
// //                 [CallSession] Sending audio to client - Size: ${audioData.length}`);
// //             this.webSocket.send(audioData);
// //         } else {
// //             console.log(`
// //                 [CallSession] WebSocket not ready, audio not sent to client`);
// //         }
// //     }

// //     private logAudioPacket(packet: RtpPacket) {
// //         if (this.audioLogStream) {
// //             this.audioLogStream.write(packet.payload);
// //             console.log(`
// //                 [CallSession] Audio packet logged: Timestamp=${packet.header.timestamp}, SequenceNumber=${packet.header.sequenceNumber}, PayloadSize=${packet.payload.length}`);
// //         } else {
// //             console.warn(`
// //                 [CallSession] Audio log stream not available for CallID: ${this.callId}`);
// //         }
// //     }

// //     protected dispose() {
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         this.socket.removeAllListeners();
// //         this.socket.close();
// //         if (this.audioLogStream) {
// //             this.audioLogStream.end(() => {
// //                 console.log(
// //                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
// //                 );
// //                 // The conversion is now handled in the Softphone class
// //             });
// //         }
// //         if (this.webSocket) {
// //             this.webSocket.close();
// //         }
// //     }
// // }

// // export default CallSession;
// // cleaning logs

// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions
// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import * as fs from "fs";
// // import WebSocket from "ws";
// // import path from "path";

// // import {
// //     RequestMessage,
// //     type InboundMessage,
// //     ResponseMessage,
// // } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { branch, extractAddress, randomInt } from "../utils";
// // import DTMF from "../dtmf";
// // import Streamer from "./streamer";

// // abstract class CallSession extends EventEmitter {
// //     private webSocket: WebSocket | null = null;
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     public socket!: dgram.Socket;
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     private audioLogStream: fs.WriteStream | null = null;
// //     private audioLogFolder: string = path.join(process.cwd(), "audio_logs");
// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;
// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;

// //     public constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         this.socket = dgram.createSocket('udp4');
// //         this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         this.remotePort = parseInt(
// //             this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //             10
// //         );
// //         this.startTime = Date.now();
// //         // removed for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt
// //         // this.ssrc = randomInt();
// //         // added for [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt
// //         this.ssrc = Math.floor(Math.random() * 0xFFFFFFFF);
// //         this.initializeSocket();
// //     }

// //     private initializeSocket() {
// //         this.socket.on('message', (message) => {
// //             // Handle incoming RTP packets
// //         });

// //         this.socket.bind(() => {
// //             const address = this.socket.address();
// //             console.log(`Socket bound to ${address.address}:${address.port}`);
// //         });
// //     }

// //     public send(data: Buffer) {
// //         if (this.socket) {
// //             this.socket.send(data, this.remotePort, this.remoteIP, (error) => {
// //                 if (error) {
// //                     console.error('Error sending RTP packet:', error);
// //                 }
// //             });
// //         } else {
// //             console.error('Socket not initialized');
// //         }
// //     }

// //     public setWebSocket(ws: WebSocket) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     public async transfer(target: string) {
// //         const requestMessage = new RequestMessage(
// //             `REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //                 "Refer-To": `sip:${target}@sip.ringcentral.com`,
// //                 "Referred-By": `<${extractAddress(this.localPeer)}>`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //         const notifyHandler = (inboundMessage: InboundMessage) => {
// //             if (!inboundMessage.subject.startsWith("NOTIFY ")) {
// //                 return;
// //             }
// //             const responseMessage = new ResponseMessage(inboundMessage, 200);
// //             this.softphone.send(responseMessage);
// //             if (inboundMessage.body.trim() === "SIP/2.0 200 OK") {
// //                 this.softphone.off("message", notifyHandler);
// //             }
// //         };
// //         this.softphone.on("message", notifyHandler);
// //     }

// //     public async hangup() {
// //         const requestMessage = new RequestMessage(
// //             `BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`,
// //             {
// //                 "Call-Id": this.callId,
// //                 From: this.localPeer,
// //                 To: this.remotePeer,
// //                 Via: `SIP/2.0/TCP ${this.softphone.fakeDomain};branch=${branch()}`,
// //             }
// //         );
// //         this.softphone.send(requestMessage);
// //     }

// //     public async sendDTMF(
// //         char:
// //             | "0"
// //             | "1"
// //             | "2"
// //             | "3"
// //             | "4"
// //             | "5"
// //             | "6"
// //             | "7"
// //             | "8"
// //             | "9"
// //             | "*"
// //             | "#"
// //     ) {
// //         const timestamp = Math.floor(Date.now() / 1000);
// //         let sequenceNumber = timestamp % 65536;
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             paddingSize: 0,
// //             extension: false,
// //             marker: false,
// //             payloadOffset: 12,
// //             payloadType: 101,
// //             sequenceNumber,
// //             timestamp,
// //             ssrc: this.ssrc,
// //             csrcLength: 0,
// //             csrc: [],
// //             extensionProfile: 48862,
// //             extensionLength: undefined,
// //             extensions: [],
// //         });
// //         for (const payload of DTMF.charToPayloads(char)) {
// //             rtpHeader.sequenceNumber = sequenceNumber++;
// //             const rtpPacket = new RtpPacket(rtpHeader, payload);
// //             this.send(rtpPacket.serialize());
// //         }
// //     }

// //     public streamAudio(input: Buffer) {
// //         const streamer = new Streamer(this, input);
// //         streamer.start();
// //         return streamer;
// //     }

// //     public async sendAudio(audioData: Buffer) {
// //         console.log(
// //             `[CallSession] Sending audio data, size: ${audioData.length} bytes`
// //         );
// //         const rtpPacket = this.createRtpPacketFromAudio(audioData);
// //         console.log(
// //             `[CallSession] Created RTP packet, payload size: ${rtpPacket.payload.length} bytes`
// //         );
// //         this.send(rtpPacket.serialize());
// //         this.logAudioPacket(rtpPacket);
// //     }

// //     private createRtpPacketFromAudio(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0,
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2;

// //         console.log(
// //             `[CallSession] RTP Header - Sequence: ${rtpHeader.sequenceNumber}, Timestamp: ${rtpHeader.timestamp}`
// //         );

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     protected async startLocalServices() {
// //         this.socket = dgram.createSocket("udp4");
// //         this.socket.on("message", (message) => {
// //             const rtpPacket = RtpPacket.deSerialize(message);
// //             this.packetsReceived++;
// //             this.bytesReceived += message.length;

// //             console.log(
// //                 `[CallSession] Received RTP packet - Size: ${message.length}, PayloadType: ${rtpPacket.header.payloadType}`
// //             );

// //             if (rtpPacket.header.payloadType === 101) {
// //                 this.emit("dtmfPacket", rtpPacket);
// //                 const char = DTMF.payloadToChar(rtpPacket.payload);
// //                 if (char) {
// //                     this.emit("dtmf", char);
// //                     console.log(`[CallSession] Received DTMF: ${char}`);
// //                 }
// //             } else {
// //                 this.emit("audioPacket", rtpPacket);
// //                 this.handleAudioPacket(rtpPacket);
// //             }
// //         });
// //         this.socket.bind();

// //         const byeHandler = (inboundMessage: InboundMessage) => {
// //             if (inboundMessage.headers["Call-Id"] !== this.callId) {
// //                 return;
// //             }
// //             if (inboundMessage.headers.CSeq.endsWith(" BYE")) {
// //                 this.softphone.off("message", byeHandler);
// //                 this.dispose();
// //             }
// //         };
// //         this.softphone.on("message", byeHandler);

// //         if (!fs.existsSync(this.audioLogFolder)) {
// //             fs.mkdirSync(this.audioLogFolder, { recursive: true });
// //         }

// //         const audioLogPath = path.join(
// //             this.audioLogFolder,
// //             `audio_log_${this.callId}.raw`
// //         );
// //         this.audioLogStream = fs.createWriteStream(audioLogPath, {
// //             flags: "a",
// //         });
// //         console.log(`[CallSession] Audio log file created: ${audioLogPath}`);
// //     }

// //     private handleAudioPacket(packet: RtpPacket) {
// //         console.log(
// //             `[CallSession] Handling audio packet - Payload size: ${packet.payload.length}`
// //         );
// //         this.logAudioPacket(packet);
// //         this.sendAudioToClient(packet.payload);
// //     }

// //     private sendAudioToClient(audioData: Buffer) {
// //         if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
// //             console.log(
// //                 `[CallSession] Sending audio to client - Size: ${audioData.length}`
// //             );
// //             this.webSocket.send(audioData);
// //         } else {
// //             console.log(
// //                 `[CallSession] WebSocket not ready, audio not sent to client`
// //             );
// //         }
// //     }

// //     private logAudioPacket(packet: RtpPacket) {
// //         if (this.audioLogStream) {
// //             this.audioLogStream.write(packet.payload);
// //             console.log(
// //                 `[CallSession] Audio packet logged: Timestamp=${packet.header.timestamp}, SequenceNumber=${packet.header.sequenceNumber}, PayloadSize=${packet.payload.length}`
// //             );
// //         } else {
// //             console.warn(
// //                 `[CallSession] Audio log stream not available for CallID: ${this.callId}`
// //             );
// //         }
// //     }

// //     protected dispose() {
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         this.socket.removeAllListeners();
// //         this.socket.close();
// //         if (this.audioLogStream) {
// //             this.audioLogStream.end(() => {
// //                 console.log(
// //                     `[CallSession] Audio log file closed for CallID: ${this.callId}`
// //                 );
// //             });
// //         }
// //         if (this.webSocket) {
// //             this.webSocket.close();
// //         }
// //     }
// // }

// // export default CallSession;
// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after log suggestions

// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite
// // call-session/index.ts

// // import EventEmitter from "events";
// // import dgram from "dgram";
// // import { RtpHeader, RtpPacket } from "werift-rtp";
// // import type { InboundMessage } from "../sip-message";
// // import type Softphone from "../softphone";
// // import { ServerWebSocketWrapper } from "@/lib/llpmg/sip/ServerWebSocketWrapper";
// // // removed for 3rd attempt still
// // // import { WebSocketWrapper } from "@/lib/llpmg/sip/WebSocketWrapper";

// // // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// // // Define a generic WebSocket interface
// // export interface IWebSocket {
// //     send(data: string | Buffer): void;
// //     close(): void;
// //     on(event: string, listener: (...args: any[]) => void): void;
// //     removeListener(event: string, listener: (...args: any[]) => void): void;
// // }

// // export type CompatibleWebSocket = WebSocket | globalThis.WebSocket;
// // // more 3rd
// // export type AnyWebSocket = WebSocket | globalThis.WebSocket;
// // // more 3rd
// // // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite

// // abstract class CallSession extends EventEmitter {
// //     public softphone: Softphone;
// //     public sipMessage: InboundMessage;
// //     // removed for sonnet-3.5 7th attempt
// //     // public socket!: dgram.Socket;
// //     // removed for sonnet-3.5 7th attempt
// //     // addedfor sonnet-3.5 7th attempt
// //     protected socket?: dgram.Socket;
// //     // addedfor sonnet-3.5 7th attempt
// //     public localPeer!: string;
// //     public remotePeer!: string;
// //     public remoteIP: string;
// //     public remotePort: number;
// //     public disposed = false;
// //     public startTime: number;
// //     public bytesReceived: number = 0;
// //     public bytesSent: number = 0;
// //     public packetsReceived: number = 0;
// //     public packetsSent: number = 0;
// //     private sequenceNumber: number = 0;
// //     private timestamp: number = 0;
// //     private ssrc: number;
// //     // added for 3rd attempt still
// //     protected webSocket: ServerWebSocketWrapper | null = null;
// //     public setWebSocket(ws: ServerWebSocketWrapper) {
// //         this.webSocket = ws;
// //         console.log("[CallSession] WebSocket connection established");
// //     }
// //     // added for 3rd attempt still
// //     // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)

// //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt rewrite
// //     // brought back
// //     // protected webSocket: WebSocket | null = null;
// //     // still 3rd
// //     // protected webSocket: WebSocketWrapper | null = null;
// //     // more 3rd
// //     // protected webSocket: AnyWebSocket | null = null;
// //     // more 3rd
// //     // still 3rd

// //     // public setWebSocket(ws: WebSocket) {
// //     //     this.webSocket = ws;
// //     //     console.log("[CallSession] WebSocket connection established");
// //     // }
// //     // public setWebSocket(ws: WebSocketWrapper) {
// //     //     this.webSocket = ws;
// //     //     console.log("[CallSession] WebSocket connection established");
// //     // }
// //     // still 3rd
// //     // public setWebSocket(ws: WebSocket | globalThis.WebSocket) {
// //     //     this.webSocket = new WebSocketWrapper(ws);
// //     //     console.log("[CallSession] WebSocket connection established");
// //     // }
// //     // more 3rd
// //     // public setWebSocket(ws: AnyWebSocket) {
// //     // brought back
// //     // removed for 3rd attempt still
// //     //     public setWebSocket(ws: WebSocket) {
// //     //     this.webSocket = ws;
// //     //     console.log("[CallSession] WebSocket connection established");
// //     // }
// //     // removed for 3rd attempt still
// //     // more 3rd
// //     // still 3rd
// //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt rewrite

// //     public abstract hangup(): Promise<void>;
// //     // added after [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt rewrite

// //     // added for sonnet-3.5 7th attempt
// //     // 7th mod
// //     // private isActive: boolean = false;
// //     protected isActive: boolean = false;
// //     // 7th mod
// //     public async init() {
// //         this.isActive = true;
// //         await this.startLocalServices();
// //     }
// //     // added for sonnet-3.5 7th attempt

// //     constructor(softphone: Softphone, sipMessage: InboundMessage) {
// //         super();
// //         this.softphone = softphone;
// //         this.sipMessage = sipMessage;
// //         // removing for sonnet-3.5 4th attempt
// //         // this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
// //         // this.remotePort = parseInt(
// //         //     this.sipMessage.body.match(/m=audio (\d+) /)![1],
// //         //     10
// //         // );
// //         // adding for sonnet-3.5 4th attempt
// //         if (sipMessage.body) {
// //             const ipMatch = sipMessage.body.match(/c=IN IP4 ([\d.]+)/);
// //             const portMatch = sipMessage.body.match(/m=audio (\d+) /);
// //             this.remoteIP = ipMatch ? ipMatch[1] : "";
// //             this.remotePort = portMatch ? parseInt(portMatch[1], 10) : 0;
// //         } else {
// //             this.remoteIP = "";
// //             this.remotePort = 0;
// //         }
// //         // sonnet-3.5 4th attempt final no lint
// //         this.startTime = Date.now();
// //         this.ssrc = Math.floor(Math.random() * 0xffffffff);
// //     }

// //     public get callId() {
// //         return this.sipMessage.headers["Call-Id"];
// //     }

// //     // removed for sonnet-3.5 7th attempt
// //     // public abstract send(data: Buffer): void;
// //     // removed for sonnet-3.5 7th attempt

// //     // added for sonnet-3.5 7th attempt
// //     public send(data: Buffer) {
// //         if (this.isActive && this.socket) {
// //             // 7th mod
// //             // this.socket.send(data, this.remotePort, this.remoteIP);
// //             // this.packetsSent++;
// //             // this.bytesSent += data.length;
// //             this.socket.send(data, this.remotePort, this.remoteIP, (error) => {
// //                 if (error) {
// //                     console.error("Error sending data:", error);
// //                 } else {
// //                     this.packetsSent++;
// //                     this.bytesSent += data.length;
// //                 }
// //             });
// //             // 7th mod
// //         }
// //         // added for sonnet-3.5 7th attempt
// //         else {
// //             console.warn("Attempted to send data without an active socket");
// //         }
// //         // added for sonnet-3.5 7th attempt
// //     }
// //     // added for sonnet-3.5 7th attempt

// //     public abstract sendAudio(audioData: Buffer): Promise<void>;

// //     // removed for sonnet-3.5 7th attempt
// //     // protected abstract startLocalServices(): Promise<void>;
// //     // removed for sonnet-3.5 7th attempt

// //     // added for sonnet-3.5 7th attempt
// //     protected async startLocalServices(): Promise<void> {
// //         this.socket = dgram.createSocket("udp4");
// //         // ... rest of the method
// //     }
// //     // added for sonnet-3.5 7th attempt

// //     protected createRtpPacket(audioData: Buffer): RtpPacket {
// //         const rtpHeader = new RtpHeader({
// //             version: 2,
// //             padding: false,
// //             extension: false,
// //             marker: false,
// //             payloadType: 0, // PCMU
// //             sequenceNumber: this.sequenceNumber++,
// //             timestamp: this.timestamp,
// //             ssrc: this.ssrc,
// //         });

// //         this.timestamp += audioData.length / 2; // Assuming 8kHz sample rate

// //         return new RtpPacket(rtpHeader, audioData);
// //     }

// //     // removed for sonnet-3.5 7th attempt
// //     // protected dispose() {
// //     // removed for sonnet-3.5 7th attempt
// //     // added for sonnet-3.5 7th attempt
// //     public dispose() {
// //         // added for sonnet-3.5 7th attempt
// //         // added for sonnet-3.5 7th attempt
// //         this.isActive = false;
// //         if (this.socket) {
// //             // 7th mod
// //             // this.socket.close();
// //             // this.socket = null;
// //             this.socket.removeAllListeners();
// //             this.socket.close(() => {
// //                 this.socket = undefined;
// //             });
// //             // 7th mod
// //         }
// //         // added for sonnet-3.5 7th attempt
// //         this.disposed = true;
// //         this.emit("disposed");
// //         this.removeAllListeners();
// //         // removed for sonnet-3.5 7th attempt
// //         // if (this.socket) {
// //         //     this.socket.removeAllListeners();
// //         //     this.socket.close();
// //         // }
// //         // removed for sonnet-3.5 7th attempt
// //     }

// //     protected initSocket() {
// //         if (!this.socket) {
// //             this.socket = dgram.createSocket("udp4");
// //             this.socket.on("error", (err) => {
// //                 console.error("Socket error:", err);
// //                 this.dispose();
// //             });
// //         }
// //     }
// // }

// // export default CallSession;
// // [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt after rewrite

export default {};
