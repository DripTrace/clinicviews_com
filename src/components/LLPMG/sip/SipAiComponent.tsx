// // "use client";

// // import React, { useEffect, useState, useCallback, useRef } from "react";
// // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // import WebSocket from "ws";
// // import OpenAI from "openai";

// // // Initializing the OpenAI instance
// // const openai = new OpenAI({
// //     apiKey: `${process.env.PUBLIC_OPENAI_API_KEY}`,
// //     dangerouslyAllowBrowser: true,
// // });

// // interface SipAiComponentProps {
// //     onHangup: () => void;
// //     initiateAuth: () => void;
// //     tokenData: any;
// //     onLogout: () => void;
// //     setTokenData: (data: any) => void;
// // }

// // const SipAiComponent: React.FC<SipAiComponentProps> = ({
// //     onHangup,
// //     initiateAuth,
// //     tokenData,
// //     onLogout,
// //     setTokenData,
// // }) => {
// //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// //     const [muted, setMuted] = useState(false);
// //     const [held, setHeld] = useState(false);
// //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// //         null
// //     );
// //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// //     const [connectionError, setConnectionError] = useState<string | null>(null);
// //     const [callActive, setCallActive] = useState(false);
// //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

// //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// //     const recordedChunksRef = useRef<Blob[]>([]);

// //     useEffect(() => {
// //         if (tokenData) {
// //             const parsedTokenData =
// //                 typeof tokenData === "string"
// //                     ? JSON.parse(tokenData)
// //                     : tokenData;
// //             initializeWebPhone(parsedTokenData);
// //         }
// //     }, [tokenData]);

// //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// //         try {
// //             console.log("Starting WebPhone Initialization...");
// //             const sipProvisionResponse = await fetch(
// //                 "/api/llpmg/sip-provision",
// //                 {
// //                     method: "POST",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                     },
// //                     body: JSON.stringify({ tokenData }),
// //                 }
// //             );

// //             if (!sipProvisionResponse.ok) {
// //                 throw new Error(
// //                     `HTTP error! status: ${sipProvisionResponse.status}`
// //                 );
// //             }

// //             const { sipProvisionData } = await sipProvisionResponse.json();
// //             console.log("SIP Provision Data received:", sipProvisionData);

// //             if (!sipProvisionData) {
// //                 throw new Error("SIP Provision Data is undefined");
// //             }

// //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// //             if (
// //                 !parsedSipProvisionData.sipInfo ||
// //                 !parsedSipProvisionData.sipInfo.length
// //             ) {
// //                 throw new Error("Parsed SIP Info is missing or incomplete");
// //             }

// //             const options: WebPhoneOptions = {
// //                 logLevel: 1 as 0 | 1 | 2 | 3,
// //                 appName: "LLPMG WebPhone",
// //                 appVersion: "1.0.0",
// //                 media: {
// //                     remote: document.getElementById(
// //                         "remoteAudio"
// //                     ) as HTMLAudioElement,
// //                     local: document.getElementById(
// //                         "localAudio"
// //                     ) as HTMLAudioElement,
// //                 },
// //                 audioHelper: {
// //                     enabled: true,
// //                     incoming: "/audio/incoming.ogg",
// //                     outgoing: "/audio/outgoing.ogg",
// //                 },
// //             };

// //             console.log("Creating WebPhone instance with options:", options);
// //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// //             webPhone.userAgent.on("registered", () => {
// //                 console.log("User registered");
// //                 setIsAuthenticated(true);
// //             });

// //             webPhone.userAgent.on("unregistered", () => {
// //                 console.log("User unregistered");
// //                 setIsAuthenticated(false);
// //             });

// //             webPhone.userAgent.on(
// //                 "invite",
// //                 (incomingSession: WebPhoneInvitation) => {
// //                     console.log("Incoming call received");
// //                     setIncomingCall(incomingSession);
// //                     webPhone.userAgent.audioHelper.playIncoming(true);
// //                 }
// //             );

// //             webPhone.userAgent.start();
// //             setUserAgent(webPhone.userAgent);
// //         } catch (error) {
// //             console.error("Failed to initialize WebPhone:", error);
// //             setConnectionError(
// //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// //             );
// //         }
// //     }, []);

// //     const handleOutgoingCall = useCallback(() => {
// //         if (!userAgent || !outgoingNumber) {
// //             console.error("UserAgent or outgoing number is missing");
// //             setConnectionError("Please enter a valid phone number");
// //             return;
// //         }

// //         console.log("Placing call to:", outgoingNumber);
// //         userAgent.audioHelper.playOutgoing(true);

// //         const session = userAgent.invite(outgoingNumber, {});

// //         session.on("accepted", async (message: any) => {
// //             console.log(
// //                 "Telephony Session Info:",
// //                 message.headers["P-Rc-Api-Ids"] ||
// //                     message.headers["p-rc-api-ids"]
// //             );
// //             userAgent.audioHelper.playOutgoing(false);
// //             userAgent.audioHelper.playIncoming(false);
// //             setCallActive(true);
// //             startTranscription(); // Start transcription and response flow when call is accepted
// //         });

// //         session.on("terminated", () => {
// //             stopTranscription(); // Ensure transcription stops when the call is terminated
// //             userAgent.audioHelper.playOutgoing(false);
// //             userAgent.audioHelper.playIncoming(false);
// //             setCallActive(false);
// //             handleHangup(); // Use the correct handleHangup function here
// //         });

// //         setSession(session);
// //     }, [userAgent, outgoingNumber]);

// //     const handleHangup = useCallback(() => {
// //         if (session) {
// //             session.dispose();
// //         }
// //         stopTranscription(); // Ensure transcription stops when call is manually ended
// //         setSession(null);
// //         setCallActive(false);
// //         onHangup();
// //     }, [session, onHangup]);

// //     const startTranscription = useCallback(() => {
// //         const remoteAudio = document.getElementById(
// //             "remoteAudio"
// //         ) as HTMLAudioElement;

// //         if (remoteAudio && remoteAudio.srcObject) {
// //             const mediaRecorder = new MediaRecorder(
// //                 remoteAudio.srcObject as MediaStream
// //             );

// //             mediaRecorder.ondataavailable = async (event) => {
// //                 if (event.data.size > 0) {
// //                     recordedChunksRef.current.push(event.data);
// //                 }
// //             };

// //             mediaRecorder.onstop = async () => {
// //                 const blob = new Blob(recordedChunksRef.current, {
// //                     type: "audio/ogg; codecs=opus",
// //                 });
// //                 recordedChunksRef.current = [];

// //                 // Send to Whisper for transcription
// //                 const transcription = await sendToWhisper(blob);
// //                 console.log("Transcription:", transcription);

// //                 // Send transcription to ElevenLabs for TTS response
// //                 const responseAudioUrl = await sendToElevenLabs(
// //                     transcription.text
// //                 );
// //                 setRecordedAudio(responseAudioUrl); // Playback the response
// //             };

// //             mediaRecorder.start();
// //             mediaRecorderRef.current = mediaRecorder;
// //         }
// //     }, []);

// //     const stopTranscription = useCallback(() => {
// //         if (mediaRecorderRef.current) {
// //             mediaRecorderRef.current.stop();
// //         }
// //     }, []);

// //     const sendToWhisper = useCallback(async (blob: Blob) => {
// //         const file = new File([blob], "speech.ogg", { type: "audio/ogg" });
// //         const transcription = await openai.audio.transcriptions.create({
// //             file,
// //             model: "whisper-1",
// //         });
// //         return transcription;
// //     }, []);

// //     const sendToElevenLabs = useCallback(async (text: string) => {
// //         const voiceId = process.env.ELEVENLABS_VOICE_ID; // Replace with your voice ID
// //         const model = "eleven_turbo_v2";
// //         const uri = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
// //         const websocket = new WebSocket(uri, {
// //             headers: { "xi-api-key": `${process.env.ELEVENLABS_API_KEY}` },
// //         });

// //         return new Promise<string>((resolve, reject) => {
// //             const audioChunks: Buffer[] = [];
// //             websocket.on("open", () => {
// //                 websocket.send(JSON.stringify({ text }));
// //             });

// //             websocket.on("message", (data) => {
// //                 const parsedData = JSON.parse(data.toString());
// //                 if (parsedData.audio) {
// //                     const audioBuffer = Buffer.from(parsedData.audio, "base64");
// //                     audioChunks.push(audioBuffer);
// //                 }
// //             });

// //             websocket.on("close", () => {
// //                 const audioBlob = new Blob(audioChunks, {
// //                     type: "audio/mp3",
// //                 });
// //                 const audioUrl = URL.createObjectURL(audioBlob);
// //                 resolve(audioUrl);
// //             });

// //             websocket.on("error", (error) => {
// //                 console.error("WebSocket error:", error);
// //                 reject(error);
// //             });
// //         });
// //     }, []);

// //     return (
// //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// //                 <audio id="remoteAudio" hidden />
// //                 <audio id="localAudio" hidden muted />
// //                 {connectionError && (
// //                     <div className="text-red-500 text-sm">
// //                         {connectionError}
// //                     </div>
// //                 )}
// //                 {!isAuthenticated ? (
// //                     <div className="auth flex flex-col items-center">
// //                         <button
// //                             onClick={initiateAuth}
// //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                         >
// //                             Authorize
// //                         </button>
// //                     </div>
// //                 ) : (
// //                     <>
// //                         <h3 className="text-white text-2xl mb-6">
// //                             LLPMG WebPhone Dashboard
// //                         </h3>
// //                         <button
// //                             onClick={onLogout}
// //                             className="text-sm text-gray-400 hover:text-white"
// //                         >
// //                             Logout
// //                         </button>
// //                         {!callActive && (
// //                             <div className="outgoing-call mt-4">
// //                                 <h4 className="text-white text-xl mb-3">
// //                                     Outgoing Call
// //                                 </h4>
// //                                 <input
// //                                     type="text"
// //                                     value={outgoingNumber}
// //                                     onChange={(e) =>
// //                                         setOutgoingNumber(e.target.value)
// //                                     }
// //                                     placeholder="+1 234 567-8900"
// //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                                 <button
// //                                     onClick={handleOutgoingCall}
// //                                     className="w-full mt-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     Call
// //                                 </button>
// //                             </div>
// //                         )}
// //                         {callActive && (
// //                             <div className="active-call mt-6">
// //                                 <h4 className="text-white text-xl mb-4">
// //                                     Call In Progress
// //                                 </h4>
// //                                 <button
// //                                     onClick={handleHangup}
// //                                     className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     Hang Up
// //                                 </button>
// //                             </div>
// //                         )}
// //                         {recordedAudio && (
// //                             <div className="recording-playback mt-6">
// //                                 <h3 className="text-white text-xl mb-3">
// //                                     Recorded Response
// //                                 </h3>
// //                                 <audio
// //                                     controls
// //                                     src={recordedAudio}
// //                                     className="w-full rounded-lg bg-gray-800 p-2"
// //                                 ></audio>
// //                             </div>
// //                         )}
// //                     </>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default SipAiComponent;

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipComponent: React.FC<SipComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [callLog, setCallLog] = useState<string[]>([]);

//     const audioContext = useRef<AudioContext | null>(null);
//     const audioQueue = useRef<AudioBuffer[]>([]);
//     const isPlaying = useRef(false);

//     useEffect(() => {
//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//     }, [tokenData]);

//     useEffect(() => {
//         const socketIo = io({ path: "/api/llpmg/nextsocket" });
//         setSocket(socketIo);

//         return () => {
//             socketIo.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         if (!socket) return;

//         socket.on("update-ui", (data) => {
//             setCallLog((prev) => [
//                 ...prev,
//                 `${data.status}: ${JSON.stringify(data.data)}`,
//             ]);
//         });

//         socket.on("answer-call", (callData) => {
//             if (
//                 session &&
//                 "__accept" in session &&
//                 typeof session.__accept === "function"
//             ) {
//                 session.__accept();
//             }
//         });

//         socket.on("tts-chunk", (audioData) => {
//             if (!audioContext.current) {
//                 audioContext.current = new (window.AudioContext ||
//                     (window as any).webkitAudioContext)();
//             }

//             const arrayBuffer = atob(audioData);
//             const buffer = new ArrayBuffer(arrayBuffer.length);
//             const view = new Uint8Array(buffer);
//             for (let i = 0; i < arrayBuffer.length; i++) {
//                 view[i] = arrayBuffer.charCodeAt(i);
//             }
//             audioContext.current.decodeAudioData(buffer, (decodedBuffer) => {
//                 audioQueue.current.push(decodedBuffer);
//                 if (!isPlaying.current) {
//                     playNextInQueue();
//                 }
//             });
//         });

//         socket.on("end-call", () => {
//             if (session && "bye" in session) {
//                 session.bye();
//             }
//         });

//         return () => {
//             socket.off("update-ui");
//             socket.off("answer-call");
//             socket.off("tts-chunk");
//             socket.off("end-call");
//         };
//     }, [socket, session]);

//     const playNextInQueue = useCallback(() => {
//         if (audioQueue.current.length === 0) {
//             isPlaying.current = false;
//             return;
//         }

//         isPlaying.current = true;
//         const audioBuffer = audioQueue.current.shift();
//         if (audioBuffer && audioContext.current) {
//             const source = audioContext.current.createBufferSource();
//             source.buffer = audioBuffer;
//             source.connect(audioContext.current.destination);
//             source.onended = playNextInQueue;
//             source.start();
//         }
//     }, []);

//     const initializeWebPhone = useCallback(
//         async (tokenData: any) => {
//             try {
//                 const sipProvisionResponse = await fetch(
//                     "/api/llpmg/sip-provision",
//                     {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ tokenData }),
//                     }
//                 );

//                 if (!sipProvisionResponse.ok) {
//                     throw new Error(
//                         `HTTP error! status: ${sipProvisionResponse.status}`
//                     );
//                 }

//                 const { sipProvisionData } = await sipProvisionResponse.json();
//                 const parsedSipProvisionData = JSON.parse(sipProvisionData);

//                 const options: WebPhoneOptions = {
//                     logLevel: 1,
//                     appName: "LLPMG WebPhone",
//                     appVersion: "1.0.0",
//                     media: {
//                         remote: document.getElementById(
//                             "remoteAudio"
//                         ) as HTMLAudioElement,
//                         local: document.getElementById(
//                             "localAudio"
//                         ) as HTMLAudioElement,
//                     },
//                     audioHelper: {
//                         enabled: true,
//                         incoming: "/audio/incoming.ogg",
//                         outgoing: "/audio/outgoing.ogg",
//                     },
//                 };

//                 const webPhone = new WebPhone(parsedSipProvisionData, options);

//                 webPhone.userAgent.on("registered", () => {
//                     console.log("User registered");
//                     setIsAuthenticated(true);
//                 });

//                 webPhone.userAgent.on("unregistered", () => {
//                     console.log("User unregistered");
//                     setIsAuthenticated(false);
//                 });

//                 webPhone.userAgent.on(
//                     "invite",
//                     (incomingSession: WebPhoneInvitation) => {
//                         console.log("Incoming call received");
//                         setSession(incomingSession);
//                         setCallActive(true);
//                         socket?.emit("call-received", {
//                             from: incomingSession.remoteIdentity.uri.user,
//                         });
//                     }
//                 );

//                 webPhone.userAgent.start();
//                 setUserAgent(webPhone.userAgent);
//             } catch (error) {
//                 console.error("Failed to initialize WebPhone:", error);
//             }
//         },
//         [socket]
//     );

//     const handleHangup = useCallback(() => {
//         if (session && "bye" in session) {
//             session.bye();
//         }
//         setSession(null);
//         setCallActive(false);
//         onHangup();
//     }, [session, onHangup]);

//     const handleSpeechToText = useCallback(() => {
//         if (session && socket) {
//             const remoteStream = (
//                 session.sessionDescriptionHandler as any
//             ).peerConnection.getReceivers()[0].track;
//             const mediaRecorder = new MediaRecorder(
//                 new MediaStream([remoteStream])
//             );
//             const chunks: BlobPart[] = [];

//             mediaRecorder.ondataavailable = (event) => {
//                 chunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(chunks, { type: "audio/webm" });
//                 const reader = new FileReader();
//                 reader.onload = () => {
//                     const arrayBuffer = reader.result as ArrayBuffer;
//                     socket.emit("speech-to-text", arrayBuffer);
//                 };
//                 reader.readAsArrayBuffer(audioBlob);
//             };

//             mediaRecorder.start();
//             setTimeout(() => mediaRecorder.stop(), 5000);
//         }
//     }, [session, socket]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" hidden />
//                 <audio id="localAudio" hidden muted />
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={initiateAuth}
//                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                         >
//                             Authorize
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         <h3 className="text-white text-2xl mb-6">
//                             LLPMG WebPhone Dashboard
//                         </h3>
//                         <button
//                             onClick={onLogout}
//                             className="text-sm text-gray-400 hover:text-white"
//                         >
//                             Logout
//                         </button>
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <button
//                                     onClick={handleHangup}
//                                     className="w-full py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Hang Up
//                                 </button>
//                                 <button
//                                     onClick={handleSpeechToText}
//                                     className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Transcribe Audio
//                                 </button>
//                             </div>
//                         )}
//                         <div className="call-log mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 Call Log
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto">
//                                 {callLog.map((log, index) => (
//                                     <p
//                                         key={index}
//                                         className="text-white text-sm mb-2"
//                                     >
//                                         {log}
//                                     </p>
//                                 ))}
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipComponent;
// didn't work

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { ElevenStreamingWeb } from "@/lib/llpmg/elevenlabs/ai-voice";
// // import { ElevenStreamingWeb } from "./ElevenStreamingWeb";

// interface SipComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipComponent: React.FC<SipComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [callLog, setCallLog] = useState<string[]>([]);
//     const [elevenStreaming] = useState(new ElevenStreamingWeb());

//     useEffect(() => {
//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//     }, [tokenData]);

//     useEffect(() => {
//         const socketIo = io({ path: "/api/llpmg/nextsocket" });
//         setSocket(socketIo);

//         return () => {
//             socketIo.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         if (!socket) return;

//         socket.on("update-ui", (data) => {
//             setCallLog((prev) => [
//                 ...prev,
//                 `${data.status}: ${JSON.stringify(data.data)}`,
//             ]);
//         });

//         socket.on("tts-chunk", async (audioData) => {
//             await elevenStreaming.playChunk({ buffer: audioData });
//         });

//         socket.on("tts-complete", () => {
//             // Handle TTS completion if needed
//         });

//         socket.on("end-call", () => {
//             if (
//                 session &&
//                 "bye" in session &&
//                 typeof session.bye === "function"
//             ) {
//                 session.bye();
//             }
//         });

//         return () => {
//             socket.off("update-ui");
//             socket.off("tts-chunk");
//             socket.off("tts-complete");
//             socket.off("end-call");
//         };
//     }, [socket, session, elevenStreaming]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             const sipProvisionResponse = await fetch(
//                 "/api/llpmg/sip-provision",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ tokenData }),
//                 }
//             );

//             if (!sipProvisionResponse.ok) {
//                 throw new Error(
//                     `HTTP error! status: ${sipProvisionResponse.status}`
//                 );
//             }

//             const { sipProvisionData } = await sipProvisionResponse.json();
//             const parsedSipProvisionData = JSON.parse(sipProvisionData);

//             const options: WebPhoneOptions = {
//                 logLevel: 1,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: document.getElementById(
//                         "remoteAudio"
//                     ) as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/audio/incoming.ogg",
//                     outgoing: "/audio/outgoing.ogg",
//                 },
//             };

//             const webPhone = new WebPhone(parsedSipProvisionData, options);

//             webPhone.userAgent.on("registered", () => {
//                 console.log("User registered");
//                 setIsAuthenticated(true);
//             });

//             webPhone.userAgent.on("unregistered", () => {
//                 console.log("User unregistered");
//                 setIsAuthenticated(false);
//             });

//             webPhone.userAgent.on(
//                 "invite",
//                 (incomingSession: WebPhoneInvitation) => {
//                     console.log("Incoming call received");
//                     setIncomingCall(incomingSession);
//                     setCallLog((prev) => [
//                         ...prev,
//                         `Incoming call from: ${incomingSession.remoteIdentity.uri.user}`,
//                     ]);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//         }
//     }, []);

//     const handleAnswerCall = useCallback(() => {
//         if (
//             incomingCall &&
//             "accept" in incomingCall &&
//             typeof incomingCall.accept === "function"
//         ) {
//             incomingCall.accept();
//             setSession(incomingCall);
//             setCallActive(true);
//             setIncomingCall(null);

//             socket?.emit("call-received", {
//                 from: incomingCall.remoteIdentity.uri.user,
//             });

//             incomingCall.on("dtmf", (event) => {
//                 socket?.emit("dtmf-received", event.dtmf);
//             });
//         }
//     }, [incomingCall, socket]);

//     const handleHangup = useCallback(() => {
//         if (session && "bye" in session && typeof session.bye === "function") {
//             session.bye();
//         }
//         setSession(null);
//         setCallActive(false);
//         setIncomingCall(null);
//         onHangup();
//     }, [session, onHangup]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" hidden />
//                 <audio id="localAudio" hidden muted />
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={initiateAuth}
//                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                         >
//                             Authorize
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         <h3 className="text-white text-2xl mb-6">
//                             LLPMG WebPhone Dashboard
//                         </h3>
//                         <button
//                             onClick={onLogout}
//                             className="text-sm text-gray-400 hover:text-white"
//                         >
//                             Logout
//                         </button>
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Incoming Call
//                                 </h4>
//                                 <button
//                                     onClick={handleAnswerCall}
//                                     className="w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Answer
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <button
//                                     onClick={handleHangup}
//                                     className="w-full py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Hang Up
//                                 </button>
//                             </div>
//                         )}
//                         <div className="call-log mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 Call Log
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto">
//                                 {callLog.map((log, index) => (
//                                     <p
//                                         key={index}
//                                         className="text-white text-sm mb-2"
//                                     >
//                                         {log}
//                                     </p>
//                                 ))}
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipComponent;

import React, { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
import { ElevenStreamingWeb } from "@/lib/llpmg/elevenlabs/ai-voice";
// import { ElevenStreamingWeb } from "./ElevenStreamingWeb";

interface SipComponentProps {
    onHangup: () => void;
    initiateAuth: () => void;
    tokenData: any;
    onLogout: () => void;
    setTokenData: (data: any) => void;
}

const SipComponent: React.FC<SipComponentProps> = ({
    onHangup,
    initiateAuth,
    tokenData,
    onLogout,
    setTokenData,
}) => {
    const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
    const [session, setSession] = useState<WebPhoneSession | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
        null
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [callLog, setCallLog] = useState<string[]>([]);
    const elevenStreamingRef = useRef<ElevenStreamingWeb>(
        new ElevenStreamingWeb()
    );

    useEffect(() => {
        if (tokenData) {
            const parsedTokenData =
                typeof tokenData === "string"
                    ? JSON.parse(tokenData)
                    : tokenData;
            initializeWebPhone(parsedTokenData);
        }
    }, [tokenData]);

    useEffect(() => {
        const socketIo = io({ path: "/api/llpmg/nextsocket" });
        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("update-ui", (data) => {
            console.log("UI Update:", data);
            setCallLog((prev) => [
                ...prev,
                `${data.status}: ${JSON.stringify(data.data)}`,
            ]);
        });

        socket.on("tts-chunk", async (audioData) => {
            console.log("Received TTS chunk");
            if (session && "sessionDescriptionHandler" in session) {
                try {
                    const audioBuffer =
                        await elevenStreamingRef.current.createAudioBuffer(
                            audioData
                        );
                    await elevenStreamingRef.current.playAudioBuffer(
                        audioBuffer,
                        session
                    );
                } catch (error) {
                    console.error("Error playing TTS chunk:", error);
                }
            }
        });

        socket.on("tts-complete", () => {
            console.log("TTS playback complete");
        });

        return () => {
            socket.off("update-ui");
            socket.off("tts-chunk");
            socket.off("tts-complete");
        };
    }, [socket, session]);

    const initializeWebPhone = useCallback(async (tokenData: any) => {
        try {
            const sipProvisionResponse = await fetch(
                "/api/llpmg/sip-provision",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tokenData }),
                }
            );

            if (!sipProvisionResponse.ok) {
                throw new Error(
                    `HTTP error! status: ${sipProvisionResponse.status}`
                );
            }

            const { sipProvisionData } = await sipProvisionResponse.json();
            const parsedSipProvisionData = JSON.parse(sipProvisionData);

            const options: WebPhoneOptions = {
                logLevel: 3,
                appName: "LLPMG WebPhone",
                appVersion: "1.0.0",
                media: {
                    remote: document.getElementById(
                        "remoteAudio"
                    ) as HTMLAudioElement,
                    local: document.getElementById(
                        "localAudio"
                    ) as HTMLAudioElement,
                },
                audioHelper: {
                    enabled: false,
                },
                sessionDescriptionHandlerFactoryOptions: {
                    iceGatheringTimeout: 3000,
                    peerConnectionConfiguration: {
                        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                        iceTransportPolicy: "all",
                    },
                },
                mediaConstraints: {
                    audio: true,
                    video: false,
                },
            };

            const webPhone = new WebPhone(parsedSipProvisionData, options);

            webPhone.userAgent.on("registered", () => {
                console.log("User registered");
                setIsAuthenticated(true);
            });

            webPhone.userAgent.on("unregistered", () => {
                console.log("User unregistered");
                setIsAuthenticated(false);
            });

            webPhone.userAgent.on(
                "invite",
                (incomingSession: WebPhoneInvitation) => {
                    console.log("Incoming call received");
                    setIncomingCall(incomingSession);
                    setCallLog((prev) => [
                        ...prev,
                        `Incoming call from: ${incomingSession.remoteIdentity.uri.user}`,
                    ]);
                }
            );

            webPhone.userAgent.start();
            setUserAgent(webPhone.userAgent);
        } catch (error) {
            console.error("Failed to initialize WebPhone:", error);
        }
    }, []);

    const handleAnswerCall = useCallback(() => {
        if (incomingCall && "accept" in incomingCall) {
            incomingCall.accept();
            setSession(incomingCall);
            setCallActive(true);
            setIncomingCall(null);

            socket?.emit("call-received", {
                from: incomingCall.remoteIdentity.uri.user,
            });

            incomingCall.on("dtmf", (event) => {
                console.log("DTMF received:", event.dtmf);
                socket?.emit("dtmf-received", event.dtmf);
            });
        }
    }, [incomingCall, socket]);

    const handleHangup = useCallback(() => {
        if (session && "bye" in session) {
            session.bye();
        }
        setSession(null);
        setCallActive(false);
        setIncomingCall(null);
        onHangup();
    }, [session, onHangup]);

    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-6">
            <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
                <audio id="remoteAudio" hidden />
                <audio id="localAudio" hidden muted />
                {!isAuthenticated ? (
                    <div className="auth flex flex-col items-center">
                        <button
                            onClick={initiateAuth}
                            className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            Authorize
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-white text-2xl mb-6">
                            LLPMG WebPhone Dashboard
                        </h3>
                        <button
                            onClick={onLogout}
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            Logout
                        </button>
                        {incomingCall && (
                            <div className="incoming-call mt-6">
                                <h4 className="text-white text-xl mb-4">
                                    Incoming Call
                                </h4>
                                <button
                                    onClick={handleAnswerCall}
                                    className="w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    Answer
                                </button>
                            </div>
                        )}
                        {callActive && (
                            <div className="active-call mt-6">
                                <h4 className="text-white text-xl mb-4">
                                    Call In Progress
                                </h4>
                                <button
                                    onClick={handleHangup}
                                    className="w-full py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    Hang Up
                                </button>
                            </div>
                        )}
                        <div className="call-log mt-6">
                            <h4 className="text-white text-xl mb-4">
                                Call Log
                            </h4>
                            <div className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto">
                                {callLog.map((log, index) => (
                                    <p
                                        key={index}
                                        className="text-white text-sm mb-2"
                                    >
                                        {log}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SipComponent;
