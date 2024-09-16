// // // // // // "use client";

// // // // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // // // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // // // // // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // // // // // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// // // // // // interface SipSpeechComponentProps {
// // // // // //     onHangup: () => void;
// // // // // //     initiateAuth: () => void;
// // // // // //     tokenData: any;
// // // // // //     onLogout: () => void;
// // // // // //     setTokenData: (data: any) => void;
// // // // // // }

// // // // // // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// // // // // //     onHangup,
// // // // // //     initiateAuth,
// // // // // //     tokenData,
// // // // // //     onLogout,
// // // // // //     setTokenData,
// // // // // // }) => {
// // // // // //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// // // // // //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// // // // // //     const [muted, setMuted] = useState(false);
// // // // // //     const [held, setHeld] = useState(false);
// // // // // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // // // // //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// // // // // //         null
// // // // // //     );
// // // // // //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// // // // // //     const [connectionError, setConnectionError] = useState<string | null>(null);
// // // // // //     const [callActive, setCallActive] = useState(false);
// // // // // //     const [transcribedText, setTranscribedText] = useState<string>("");
// // // // // //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
// // // // // //     const [callEnded, setCallEnded] = useState(false);

// // // // // //     const audioContextRef = useRef<AudioContext | null>(null);
// // // // // //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// // // // // //     const analyserRef = useRef<AnalyserNode | null>(null);
// // // // // //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// // // // // //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
// // // // // //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // // // // //     const recordedChunksRef = useRef<Blob[]>([]);

// // // // // //     useEffect(() => {
// // // // // //         console.log("SipSpeechComponent mounted");
// // // // // //         remoteAudioRef.current = document.getElementById(
// // // // // //             "remoteAudio"
// // // // // //         ) as HTMLAudioElement;
// // // // // //         if (remoteAudioRef.current) {
// // // // // //             remoteAudioRef.current.onloadedmetadata = () => {
// // // // // //                 remoteAudioRef.current!.muted = false;
// // // // // //             };
// // // // // //         }
// // // // // //         if (tokenData) {
// // // // // //             console.log("TokenData available, initializing WebPhone");
// // // // // //             const parsedTokenData =
// // // // // //                 typeof tokenData === "string"
// // // // // //                     ? JSON.parse(tokenData)
// // // // // //                     : tokenData;
// // // // // //             initializeWebPhone(parsedTokenData);
// // // // // //         }
// // // // // //         return () => {
// // // // // //             console.log("SipSpeechComponent unmounting");
// // // // // //             if (audioContextRef.current) {
// // // // // //                 audioContextRef.current.close();
// // // // // //             }
// // // // // //         };
// // // // // //     }, [tokenData]);

// // // // // //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// // // // // //         try {
// // // // // //             console.log("Starting WebPhone Initialization...");
// // // // // //             const sipProvisionResponse = await fetch(
// // // // // //                 "/api/llpmg/sip-provision",
// // // // // //                 {
// // // // // //                     method: "POST",
// // // // // //                     headers: { "Content-Type": "application/json" },
// // // // // //                     body: JSON.stringify({ tokenData }),
// // // // // //                 }
// // // // // //             );

// // // // // //             if (!sipProvisionResponse.ok) {
// // // // // //                 throw new Error(
// // // // // //                     `HTTP error! status: ${sipProvisionResponse.status}`
// // // // // //                 );
// // // // // //             }

// // // // // //             const { sipProvisionData } = await sipProvisionResponse.json();
// // // // // //             console.log("SIP Provision Data received:", sipProvisionData);

// // // // // //             if (!sipProvisionData) {
// // // // // //                 throw new Error("SIP Provision Data is undefined");
// // // // // //             }

// // // // // //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// // // // // //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// // // // // //             if (
// // // // // //                 !parsedSipProvisionData.sipInfo ||
// // // // // //                 !parsedSipProvisionData.sipInfo.length
// // // // // //             ) {
// // // // // //                 throw new Error("Parsed SIP Info is missing or incomplete");
// // // // // //             }

// // // // // //             const options: WebPhoneOptions = {
// // // // // //                 logLevel: 1 as 0 | 1 | 2 | 3,
// // // // // //                 appName: "LLPMG WebPhone",
// // // // // //                 appVersion: "1.0.0",
// // // // // //                 media: {
// // // // // //                     remote: remoteAudioRef.current as HTMLAudioElement,
// // // // // //                     local: document.getElementById(
// // // // // //                         "localAudio"
// // // // // //                     ) as HTMLAudioElement,
// // // // // //                 },
// // // // // //                 audioHelper: {
// // // // // //                     enabled: true,
// // // // // //                     incoming: "/llpmg/audio/incoming.ogg",
// // // // // //                     outgoing: "/llpmg/audio/outgoing.ogg",
// // // // // //                 },
// // // // // //             };

// // // // // //             console.log("Creating WebPhone instance with options:", options);
// // // // // //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// // // // // //             webPhone.userAgent.on("registered", () => {
// // // // // //                 console.log("User registered");
// // // // // //                 setIsAuthenticated(true);
// // // // // //             });

// // // // // //             webPhone.userAgent.on("unregistered", () => {
// // // // // //                 console.log("User unregistered");
// // // // // //                 setIsAuthenticated(false);
// // // // // //             });

// // // // // //             webPhone.userAgent.on(
// // // // // //                 "invite",
// // // // // //                 (incomingSession: WebPhoneInvitation) => {
// // // // // //                     console.log("Incoming call received");
// // // // // //                     setIncomingCall(incomingSession);
// // // // // //                     webPhone.userAgent.audioHelper.playIncoming(true);
// // // // // //                 }
// // // // // //             );

// // // // // //             webPhone.userAgent.start();
// // // // // //             setUserAgent(webPhone.userAgent);
// // // // // //         } catch (error) {
// // // // // //             console.error("Failed to initialize WebPhone:", error);
// // // // // //             setConnectionError(
// // // // // //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// // // // // //             );
// // // // // //         }
// // // // // //     }, []);

// // // // // //     const setupAudioProcessing = useCallback(() => {
// // // // // //         console.log("Setting up audio processing");
// // // // // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // // // // //             console.error("Remote audio source not available");
// // // // // //             return;
// // // // // //         }

// // // // // //         audioContextRef.current = new AudioContext();
// // // // // //         sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(
// // // // // //             remoteAudioRef.current.srcObject as MediaStream
// // // // // //         );
// // // // // //         analyserRef.current = audioContextRef.current.createAnalyser();
// // // // // //         scriptProcessorRef.current =
// // // // // //             audioContextRef.current.createScriptProcessor(4096, 1, 1);

// // // // // //         sourceNodeRef.current.connect(analyserRef.current);
// // // // // //         analyserRef.current.connect(scriptProcessorRef.current);
// // // // // //         scriptProcessorRef.current.connect(audioContextRef.current.destination);

// // // // // //         let silenceStart: number | null = null;
// // // // // //         const silenceThreshold = 0.01;
// // // // // //         // const silenceDuration = 1000;
// // // // // //         const silenceDuration = 3000;

// // // // // //         scriptProcessorRef.current.onaudioprocess = (event) => {
// // // // // //             const input = event.inputBuffer.getChannelData(0);
// // // // // //             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// // // // // //             const average = sum / input.length;

// // // // // //             console.log("Current audio level:", average);

// // // // // //             if (average < silenceThreshold) {
// // // // // //                 if (silenceStart === null) {
// // // // // //                     silenceStart = Date.now();
// // // // // //                     console.log("Silence started at:", silenceStart);
// // // // // //                 } else if (Date.now() - silenceStart >= silenceDuration) {
// // // // // //                     console.log(
// // // // // //                         "Silence detected for 1 second, triggering transcription"
// // // // // //                     );
// // // // // //                     transcribeAudio();
// // // // // //                     silenceStart = null;
// // // // // //                 }
// // // // // //             } else {
// // // // // //                 silenceStart = null;
// // // // // //             }
// // // // // //         };
// // // // // //     }, []);

// // // // // //     const transcribeAudio = useCallback(async () => {
// // // // // //         console.log("Transcribing audio");
// // // // // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // // // // //             console.error(
// // // // // //                 "Remote audio source not available for transcription"
// // // // // //             );
// // // // // //             return;
// // // // // //         }

// // // // // //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// // // // // //         const recorder = new MediaRecorder(stream);
// // // // // //         const chunks: Blob[] = [];

// // // // // //         recorder.ondataavailable = (event) => {
// // // // // //             chunks.push(event.data);
// // // // // //         };

// // // // // //         recorder.onstop = async () => {
// // // // // //             const audioBlob = new Blob(chunks, { type: "audio/webm" });
// // // // // //             const reader = new FileReader();
// // // // // //             reader.readAsDataURL(audioBlob);
// // // // // //             reader.onloadend = async () => {
// // // // // //                 if (typeof reader.result === "string") {
// // // // // //                     const base64Audio = reader.result.split(",")[1];
// // // // // //                     try {
// // // // // //                         console.log("Sending audio to transcription API");
// // // // // //                         const response = await fetch(
// // // // // //                             "/api/llpmg/speech-to-text",
// // // // // //                             {
// // // // // //                                 method: "POST",
// // // // // //                                 headers: { "Content-Type": "application/json" },
// // // // // //                                 body: JSON.stringify({ audio: base64Audio }),
// // // // // //                             }
// // // // // //                         );
// // // // // //                         console.log(
// // // // // //                             "Transcription API response status:",
// // // // // //                             response.status
// // // // // //                         );
// // // // // //                         if (response.ok) {
// // // // // //                             const data = await response.json();
// // // // // //                             console.log("Transcription received:", data.result);
// // // // // //                             setTranscribedText(
// // // // // //                                 (prevText) => prevText + " " + data.result
// // // // // //                             );
// // // // // //                         } else {
// // // // // //                             console.error(
// // // // // //                                 "Failed to transcribe audio",
// // // // // //                                 await response.text()
// // // // // //                             );
// // // // // //                         }
// // // // // //                     } catch (error) {
// // // // // //                         console.error("Error transcribing audio:", error);
// // // // // //                     }
// // // // // //                 }
// // // // // //             };
// // // // // //         };

// // // // // //         recorder.start();
// // // // // //         setTimeout(() => recorder.stop(), 5000);
// // // // // //     }, []);

// // // // // //     const startRecording = useCallback(() => {
// // // // // //         console.log("Starting recording");
// // // // // //         recordedChunksRef.current = [];
// // // // // //         const remoteAudio = remoteAudioRef.current;

// // // // // //         if (remoteAudio && remoteAudio.srcObject) {
// // // // // //             console.log("Remote audio source found");
// // // // // //             const mediaRecorder = new MediaRecorder(
// // // // // //                 remoteAudio.srcObject as MediaStream
// // // // // //             );

// // // // // //             mediaRecorder.ondataavailable = (event) => {
// // // // // //                 if (event.data.size > 0) {
// // // // // //                     console.log(
// // // // // //                         "Received audio chunk of size:",
// // // // // //                         event.data.size
// // // // // //                     );
// // // // // //                     recordedChunksRef.current.push(event.data);
// // // // // //                 }
// // // // // //             };

// // // // // //             mediaRecorder.start();
// // // // // //             mediaRecorderRef.current = mediaRecorder;
// // // // // //             setupAudioProcessing();
// // // // // //         } else {
// // // // // //             console.error("Remote audio source not found");
// // // // // //         }
// // // // // //     }, [setupAudioProcessing]);

// // // // // //     const stopRecording = useCallback(() => {
// // // // // //         console.log("Stopping recording");
// // // // // //         if (
// // // // // //             mediaRecorderRef.current &&
// // // // // //             mediaRecorderRef.current.state !== "inactive"
// // // // // //         ) {
// // // // // //             mediaRecorderRef.current.stop();
// // // // // //             mediaRecorderRef.current.onstop = () => {
// // // // // //                 const audioBlob = new Blob(recordedChunksRef.current, {
// // // // // //                     type: "audio/webm",
// // // // // //                 });
// // // // // //                 const audioUrl = URL.createObjectURL(audioBlob);
// // // // // //                 setRecordedAudio(audioUrl);
// // // // // //                 console.log("Audio recording saved");
// // // // // //             };
// // // // // //         }
// // // // // //     }, []);

// // // // // //     const handleCallAccepted = useCallback(
// // // // // //         async (message: any) => {
// // // // // //             console.log("Call accepted - User has answered the call");
// // // // // //             console.log(
// // // // // //                 "Telephony Session Info:",
// // // // // //                 message.headers["P-Rc-Api-Ids"] ||
// // // // // //                     message.headers["p-rc-api-ids"]
// // // // // //             );
// // // // // //             userAgent?.audioHelper.playOutgoing(false);
// // // // // //             userAgent?.audioHelper.playIncoming(false);
// // // // // //             setCallActive(true);
// // // // // //             setCallEnded(false);
// // // // // //             startRecording();

// // // // // //             console.log("Attempting immediate test transcription");
// // // // // //             await transcribeAudio();
// // // // // //         },
// // // // // //         [userAgent, transcribeAudio, startRecording]
// // // // // //     );

// // // // // //     const handleOutgoingCall = useCallback(() => {
// // // // // //         if (!userAgent || !outgoingNumber) {
// // // // // //             console.error("UserAgent or outgoing number is missing");
// // // // // //             setConnectionError("Please enter a valid phone number");
// // // // // //             return;
// // // // // //         }

// // // // // //         console.log("Placing call to:", outgoingNumber);
// // // // // //         userAgent.audioHelper.playOutgoing(true);

// // // // // //         const session = userAgent.invite(outgoingNumber, {});

// // // // // //         session.on("accepted", handleCallAccepted);

// // // // // //         session.on("terminated", () => {
// // // // // //             console.log("Call terminated");
// // // // // //             userAgent.audioHelper.playOutgoing(false);
// // // // // //             userAgent.audioHelper.playIncoming(false);
// // // // // //             setCallActive(false);
// // // // // //             setCallEnded(true);
// // // // // //             stopRecording();
// // // // // //             if (audioContextRef.current) {
// // // // // //                 audioContextRef.current.close();
// // // // // //             }
// // // // // //             onHangup();
// // // // // //         });

// // // // // //         setSession(session);
// // // // // //     }, [
// // // // // //         userAgent,
// // // // // //         outgoingNumber,
// // // // // //         onHangup,
// // // // // //         handleCallAccepted,
// // // // // //         stopRecording,
// // // // // //     ]);

// // // // // //     const handleIncomingCall = useCallback(
// // // // // //         (action: "accept" | "decline" | "toVoicemail") => {
// // // // // //             if (!incomingCall) {
// // // // // //                 console.error("No incoming call to handle");
// // // // // //                 return;
// // // // // //             }

// // // // // //             console.log("Handling incoming call:", action);
// // // // // //             userAgent?.audioHelper.playIncoming(false);

// // // // // //             switch (action) {
// // // // // //                 case "accept":
// // // // // //                     console.log("Accepting incoming call");
// // // // // //                     incomingCall.accept();
// // // // // //                     setSession(incomingCall);
// // // // // //                     incomingCall.on("accepted", handleCallAccepted);
// // // // // //                     break;
// // // // // //                 case "decline":
// // // // // //                     incomingCall.reject();
// // // // // //                     break;
// // // // // //                 case "toVoicemail":
// // // // // //                     incomingCall.toVoicemail?.();
// // // // // //                     break;
// // // // // //             }

// // // // // //             setIncomingCall(null);
// // // // // //         },
// // // // // //         [incomingCall, userAgent, handleCallAccepted]
// // // // // //     );

// // // // // //     const handleHangup = useCallback(() => {
// // // // // //         console.log("Hanging up call");
// // // // // //         if (session) {
// // // // // //             session.dispose();
// // // // // //         }
// // // // // //         if (audioContextRef.current) {
// // // // // //             audioContextRef.current.close();
// // // // // //         }
// // // // // //         stopRecording();
// // // // // //         setSession(null);
// // // // // //         setCallActive(false);
// // // // // //         setCallEnded(true);
// // // // // //         onHangup();
// // // // // //     }, [session, onHangup, stopRecording]);

// // // // // //     const toggleMute = useCallback(() => {
// // // // // //         console.log("Toggling mute");
// // // // // //         if (session) {
// // // // // //             if (muted) {
// // // // // //                 session.unmute?.();
// // // // // //             } else {
// // // // // //                 session.mute?.();
// // // // // //             }
// // // // // //             setMuted(!muted);
// // // // // //         }
// // // // // //     }, [session, muted]);

// // // // // //     const toggleHold = useCallback(() => {
// // // // // //         console.log("Toggling hold");
// // // // // //         if (session) {
// // // // // //             if (held) {
// // // // // //                 session.unhold?.();
// // // // // //             } else {
// // // // // //                 session.hold?.();
// // // // // //             }
// // // // // //             setHeld(!held);
// // // // // //         }
// // // // // //     }, [session, held]);

// // // // // //     const handlePark = useCallback(() => {
// // // // // //         console.log("Parking call");
// // // // // //         if (session) {
// // // // // //             session.park?.();
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleTransfer = useCallback(() => {
// // // // // //         console.log("Initiating transfer");
// // // // // //         if (session) {
// // // // // //             const transferNumber = prompt("Enter the number to transfer to:");
// // // // // //             if (transferNumber) {
// // // // // //                 console.log("Transferring to:", transferNumber);
// // // // // //                 session.transfer?.(transferNumber);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleFlip = useCallback(() => {
// // // // // //         console.log("Initiating flip");
// // // // // //         if (session) {
// // // // // //             const flipNumber = prompt("Enter the number to flip to:");
// // // // // //             if (flipNumber) {
// // // // // //                 console.log("Flipping to:", flipNumber);
// // // // // //                 session.flip?.(flipNumber);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleDTMF = useCallback(() => {
// // // // // //         console.log("Sending DTMF");
// // // // // //         if (session) {
// // // // // //             const digit = prompt("Enter the DTMF digit:");
// // // // // //             if (digit) {
// // // // // //                 console.log("Sending DTMF digit:", digit);
// // // // // //                 session.dtmf?.(digit);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const adjustVolume = useCallback((direction: number) => {
// // // // // //         console.log("Adjusting volume:", direction);
// // // // // //         if (remoteAudioRef.current) {
// // // // // //             remoteAudioRef.current.volume = Math.min(
// // // // // //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// // // // // //                 1
// // // // // //             );
// // // // // //             console.log("New volume:", remoteAudioRef.current.volume);
// // // // // //         }
// // // // // //     }, []);

// // // // // //     return (
// // // // // //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// // // // // //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// // // // // //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// // // // // //                 <audio id="localAudio" hidden muted />
// // // // // //                 {connectionError && (
// // // // // //                     <div className="text-red-500 text-sm mb-4">
// // // // // //                         {connectionError}
// // // // // //                     </div>
// // // // // //                 )}
// // // // // //                 {!isAuthenticated ? (
// // // // // //                     <div className="auth flex flex-col items-center">
// // // // // //                         <button
// // // // // //                             onClick={() => {
// // // // // //                                 console.log("Initiating authentication");
// // // // // //                                 initiateAuth();
// // // // // //                             }}
// // // // // //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                         >
// // // // // //                             Authorize
// // // // // //                         </button>
// // // // // //                     </div>
// // // // // //                 ) : (
// // // // // //                     <>
// // // // // //                         <h3 className="text-white text-2xl mb-6">
// // // // // //                             LLPMG WebPhone Dashboard
// // // // // //                         </h3>
// // // // // //                         <button
// // // // // //                             onClick={() => {
// // // // // //                                 console.log("Logging out");
// // // // // //                                 onLogout();
// // // // // //                             }}
// // // // // //                             className="text-sm text-gray-400 hover:text-white mb-4"
// // // // // //                         >
// // // // // //                             Logout
// // // // // //                         </button>
// // // // // //                         {!callActive && !callEnded && (
// // // // // //                             <div className="outgoing-call mt-4">
// // // // // //                                 <h4 className="text-white text-xl mb-3">
// // // // // //                                     Outgoing Call
// // // // // //                                 </h4>
// // // // // //                                 <input
// // // // // //                                     type="text"
// // // // // //                                     value={outgoingNumber}
// // // // // //                                     onChange={(e) => {
// // // // // //                                         console.log(
// // // // // //                                             "Outgoing number changed:",
// // // // // //                                             e.target.value
// // // // // //                                         );
// // // // // //                                         setOutgoingNumber(e.target.value);
// // // // // //                                     }}
// // // // // //                                     placeholder="+1 234 567-8900"
// // // // // //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// // // // // //                                 />
// // // // // //                                 <button
// // // // // //                                     onClick={() => {
// // // // // //                                         console.log("Initiating outgoing call");
// // // // // //                                         handleOutgoingCall();
// // // // // //                                     }}
// // // // // //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                 >
// // // // // //                                     Call
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {callActive && (
// // // // // //                             <div className="active-call mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     Call In Progress
// // // // // //                                 </h4>
// // // // // //                                 <div className="grid grid-cols-2 gap-4">
// // // // // //                                     <button
// // // // // //                                         onClick={toggleMute}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         {muted ? "Unmute" : "Mute"}
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={toggleHold}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         {held ? "Unhold" : "Hold"}
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handlePark}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Park
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleTransfer}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Transfer
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleFlip}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Flip
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleDTMF}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Send DTMF
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => adjustVolume(0.1)}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         + Volume
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => adjustVolume(-0.1)}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         - Volume
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log("Hanging up call");
// // // // // //                                             handleHangup();
// // // // // //                                         }}
// // // // // //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Hang Up
// // // // // //                                     </button>
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {(callActive || callEnded) && (
// // // // // //                             <div className="transcription mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     {callEnded
// // // // // //                                         ? "Call Transcription"
// // // // // //                                         : "Live Transcription"}
// // // // // //                                 </h4>
// // // // // //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// // // // // //                                     {transcribedText ||
// // // // // //                                         "Transcription will appear here..."}
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {callEnded && recordedAudio && (
// // // // // //                             <div className="recorded-audio mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     Recorded Audio
// // // // // //                                 </h4>
// // // // // //                                 <audio
// // // // // //                                     controls
// // // // // //                                     src={recordedAudio}
// // // // // //                                     className="w-full"
// // // // // //                                 />
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {incomingCall && (
// // // // // //                             <div className="incoming-call mt-6">
// // // // // //                                 <h3 className="text-white text-xl mb-3">
// // // // // //                                     Incoming Call
// // // // // //                                 </h3>
// // // // // //                                 <div className="grid grid-cols-3 gap-2">
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Accepting incoming call"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("accept");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Answer
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Declining incoming call"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("decline");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Decline
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Sending incoming call to voicemail"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("toVoicemail");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         To Voicemail
// // // // // //                                     </button>
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </>
// // // // // //                 )}
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default SipSpeechComponent;

// // // // // // "use client";

// // // // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // // // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // // // // // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // // // // // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// // // // // // interface SipSpeechComponentProps {
// // // // // //     onHangup: () => void;
// // // // // //     initiateAuth: () => void;
// // // // // //     tokenData: any;
// // // // // //     onLogout: () => void;
// // // // // //     setTokenData: (data: any) => void;
// // // // // // }

// // // // // // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// // // // // //     onHangup,
// // // // // //     initiateAuth,
// // // // // //     tokenData,
// // // // // //     onLogout,
// // // // // //     setTokenData,
// // // // // // }) => {
// // // // // //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// // // // // //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// // // // // //     const [muted, setMuted] = useState(false);
// // // // // //     const [held, setHeld] = useState(false);
// // // // // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // // // // //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// // // // // //         null
// // // // // //     );
// // // // // //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// // // // // //     const [connectionError, setConnectionError] = useState<string | null>(null);
// // // // // //     const [callActive, setCallActive] = useState(false);
// // // // // //     const [transcribedText, setTranscribedText] = useState<string>("");
// // // // // //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
// // // // // //     const [callEnded, setCallEnded] = useState(false);

// // // // // //     const audioContextRef = useRef<AudioContext | null>(null);
// // // // // //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// // // // // //     const analyserRef = useRef<AnalyserNode | null>(null);
// // // // // //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// // // // // //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
// // // // // //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // // // // //     const recordedChunksRef = useRef<Blob[]>([]);
// // // // // //     const lastTranscriptionRef = useRef<string>("");
// // // // // //     const [greetingAudio, setGreetingAudio] = useState<string | null>(null);

// // // // // //     useEffect(() => {
// // // // // //         console.log("SipSpeechComponent mounted");
// // // // // //         remoteAudioRef.current = document.getElementById(
// // // // // //             "remoteAudio"
// // // // // //         ) as HTMLAudioElement;
// // // // // //         if (remoteAudioRef.current) {
// // // // // //             remoteAudioRef.current.onloadedmetadata = () => {
// // // // // //                 remoteAudioRef.current!.muted = false;
// // // // // //             };
// // // // // //         }
// // // // // //         if (tokenData) {
// // // // // //             console.log("TokenData available, initializing WebPhone");
// // // // // //             const parsedTokenData =
// // // // // //                 typeof tokenData === "string"
// // // // // //                     ? JSON.parse(tokenData)
// // // // // //                     : tokenData;
// // // // // //             initializeWebPhone(parsedTokenData);
// // // // // //         }
// // // // // //         return () => {
// // // // // //             console.log("SipSpeechComponent unmounting");
// // // // // //             if (audioContextRef.current) {
// // // // // //                 audioContextRef.current.close();
// // // // // //             }
// // // // // //         };
// // // // // //     }, [tokenData]);

// // // // // //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// // // // // //         try {
// // // // // //             console.log("Starting WebPhone Initialization...");
// // // // // //             const sipProvisionResponse = await fetch(
// // // // // //                 "/api/llpmg/sip-provision",
// // // // // //                 {
// // // // // //                     method: "POST",
// // // // // //                     headers: { "Content-Type": "application/json" },
// // // // // //                     body: JSON.stringify({ tokenData }),
// // // // // //                 }
// // // // // //             );

// // // // // //             if (!sipProvisionResponse.ok) {
// // // // // //                 throw new Error(
// // // // // //                     `HTTP error! status: ${sipProvisionResponse.status}`
// // // // // //                 );
// // // // // //             }

// // // // // //             const { sipProvisionData } = await sipProvisionResponse.json();
// // // // // //             console.log("SIP Provision Data received:", sipProvisionData);

// // // // // //             if (!sipProvisionData) {
// // // // // //                 throw new Error("SIP Provision Data is undefined");
// // // // // //             }

// // // // // //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// // // // // //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// // // // // //             if (
// // // // // //                 !parsedSipProvisionData.sipInfo ||
// // // // // //                 !parsedSipProvisionData.sipInfo.length
// // // // // //             ) {
// // // // // //                 throw new Error("Parsed SIP Info is missing or incomplete");
// // // // // //             }

// // // // // //             const options: WebPhoneOptions = {
// // // // // //                 logLevel: 1 as 0 | 1 | 2 | 3,
// // // // // //                 appName: "LLPMG WebPhone",
// // // // // //                 appVersion: "1.0.0",
// // // // // //                 media: {
// // // // // //                     remote: remoteAudioRef.current as HTMLAudioElement,
// // // // // //                     local: document.getElementById(
// // // // // //                         "localAudio"
// // // // // //                     ) as HTMLAudioElement,
// // // // // //                 },
// // // // // //                 audioHelper: {
// // // // // //                     enabled: true,
// // // // // //                     incoming: "/llpmg/audio/incoming.ogg",
// // // // // //                     outgoing: "/llpmg/audio/outgoing.ogg",
// // // // // //                 },
// // // // // //             };

// // // // // //             console.log("Creating WebPhone instance with options:", options);
// // // // // //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// // // // // //             webPhone.userAgent.on("registered", () => {
// // // // // //                 console.log("User registered");
// // // // // //                 setIsAuthenticated(true);
// // // // // //             });

// // // // // //             webPhone.userAgent.on("unregistered", () => {
// // // // // //                 console.log("User unregistered");
// // // // // //                 setIsAuthenticated(false);
// // // // // //             });

// // // // // //             webPhone.userAgent.on(
// // // // // //                 "invite",
// // // // // //                 (incomingSession: WebPhoneInvitation) => {
// // // // // //                     console.log("Incoming call received");
// // // // // //                     setIncomingCall(incomingSession);
// // // // // //                     webPhone.userAgent.audioHelper.playIncoming(true);
// // // // // //                 }
// // // // // //             );

// // // // // //             webPhone.userAgent.start();
// // // // // //             setUserAgent(webPhone.userAgent);
// // // // // //         } catch (error) {
// // // // // //             console.error("Failed to initialize WebPhone:", error);
// // // // // //             setConnectionError(
// // // // // //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// // // // // //             );
// // // // // //         }
// // // // // //     }, []);

// // // // // //     const setupAudioProcessing = useCallback(() => {
// // // // // //         console.log("Setting up audio processing");
// // // // // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // // // // //             console.error("Remote audio source not available");
// // // // // //             return;
// // // // // //         }

// // // // // //         audioContextRef.current = new AudioContext();
// // // // // //         sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(
// // // // // //             remoteAudioRef.current.srcObject as MediaStream
// // // // // //         );
// // // // // //         analyserRef.current = audioContextRef.current.createAnalyser();
// // // // // //         scriptProcessorRef.current =
// // // // // //             audioContextRef.current.createScriptProcessor(4096, 1, 1);

// // // // // //         sourceNodeRef.current.connect(analyserRef.current);
// // // // // //         analyserRef.current.connect(scriptProcessorRef.current);
// // // // // //         scriptProcessorRef.current.connect(audioContextRef.current.destination);

// // // // // //         let silenceStart: number | null = null;
// // // // // //         const silenceThreshold = 0.01;
// // // // // //         const silenceDuration = 1000;
// // // // // //         let isTranscribing = false;

// // // // // //         scriptProcessorRef.current.onaudioprocess = (event) => {
// // // // // //             const input = event.inputBuffer.getChannelData(0);
// // // // // //             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// // // // // //             const average = sum / input.length;

// // // // // //             console.log("Current audio level:", average);

// // // // // //             if (average < silenceThreshold) {
// // // // // //                 if (silenceStart === null) {
// // // // // //                     silenceStart = Date.now();
// // // // // //                     console.log("Silence started at:", silenceStart);
// // // // // //                 } else if (
// // // // // //                     Date.now() - silenceStart >= silenceDuration &&
// // // // // //                     !isTranscribing
// // // // // //                 ) {
// // // // // //                     console.log(
// // // // // //                         "Silence detected for 1 second, triggering transcription"
// // // // // //                     );
// // // // // //                     isTranscribing = true;
// // // // // //                     transcribeAudio().then(() => {
// // // // // //                         isTranscribing = false;
// // // // // //                         silenceStart = null;
// // // // // //                     });
// // // // // //                 }
// // // // // //             } else {
// // // // // //                 silenceStart = null;
// // // // // //             }
// // // // // //         };
// // // // // //     }, []);

// // // // // //     const transcribeAudio = useCallback(async () => {
// // // // // //         console.log("Transcribing audio");
// // // // // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // // // // //             console.error(
// // // // // //                 "Remote audio source not available for transcription"
// // // // // //             );
// // // // // //             return;
// // // // // //         }

// // // // // //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// // // // // //         const recorder = new MediaRecorder(stream);
// // // // // //         const chunks: Blob[] = [];

// // // // // //         recorder.ondataavailable = (event) => {
// // // // // //             chunks.push(event.data);
// // // // // //         };

// // // // // //         recorder.onstop = async () => {
// // // // // //             const audioBlob = new Blob(chunks, { type: "audio/webm" });
// // // // // //             const reader = new FileReader();
// // // // // //             reader.readAsDataURL(audioBlob);
// // // // // //             reader.onloadend = async () => {
// // // // // //                 if (typeof reader.result === "string") {
// // // // // //                     const base64Audio = reader.result.split(",")[1];
// // // // // //                     try {
// // // // // //                         console.log("Sending audio to transcription API");
// // // // // //                         const response = await fetch(
// // // // // //                             "/api/llpmg/speech-to-text",
// // // // // //                             {
// // // // // //                                 method: "POST",
// // // // // //                                 headers: { "Content-Type": "application/json" },
// // // // // //                                 body: JSON.stringify({ audio: base64Audio }),
// // // // // //                             }
// // // // // //                         );
// // // // // //                         console.log(
// // // // // //                             "Transcription API response status:",
// // // // // //                             response.status
// // // // // //                         );
// // // // // //                         if (response.ok) {
// // // // // //                             const data = await response.json();
// // // // // //                             console.log("Transcription received:", data.result);

// // // // // //                             if (
// // // // // //                                 data.result &&
// // // // // //                                 data.result !== lastTranscriptionRef.current
// // // // // //                             ) {
// // // // // //                                 setTranscribedText(
// // // // // //                                     (prevText) => prevText + " " + data.result
// // // // // //                                 );
// // // // // //                                 lastTranscriptionRef.current = data.result;
// // // // // //                             } else {
// // // // // //                                 console.log(
// // // // // //                                     "Duplicate transcription detected, skipping"
// // // // // //                                 );
// // // // // //                             }
// // // // // //                         } else {
// // // // // //                             console.error(
// // // // // //                                 "Failed to transcribe audio",
// // // // // //                                 await response.text()
// // // // // //                             );
// // // // // //                         }
// // // // // //                     } catch (error) {
// // // // // //                         console.error("Error transcribing audio:", error);
// // // // // //                     }
// // // // // //                 }
// // // // // //             };
// // // // // //         };

// // // // // //         recorder.start();
// // // // // //         setTimeout(() => recorder.stop(), 5000);
// // // // // //     }, []);

// // // // // //     const startRecording = useCallback(() => {
// // // // // //         console.log("Starting recording");
// // // // // //         recordedChunksRef.current = [];
// // // // // //         const remoteAudio = remoteAudioRef.current;

// // // // // //         if (remoteAudio && remoteAudio.srcObject) {
// // // // // //             console.log("Remote audio source found");
// // // // // //             const mediaRecorder = new MediaRecorder(
// // // // // //                 remoteAudio.srcObject as MediaStream
// // // // // //             );

// // // // // //             mediaRecorder.ondataavailable = (event) => {
// // // // // //                 if (event.data.size > 0) {
// // // // // //                     console.log(
// // // // // //                         "Received audio chunk of size:",
// // // // // //                         event.data.size
// // // // // //                     );
// // // // // //                     recordedChunksRef.current.push(event.data);
// // // // // //                 }
// // // // // //             };

// // // // // //             mediaRecorder.start();
// // // // // //             mediaRecorderRef.current = mediaRecorder;
// // // // // //             setupAudioProcessing();
// // // // // //         } else {
// // // // // //             console.error("Remote audio source not found");
// // // // // //         }
// // // // // //     }, [setupAudioProcessing]);

// // // // // //     const stopRecording = useCallback(() => {
// // // // // //         console.log("Stopping recording");
// // // // // //         if (
// // // // // //             mediaRecorderRef.current &&
// // // // // //             mediaRecorderRef.current.state !== "inactive"
// // // // // //         ) {
// // // // // //             mediaRecorderRef.current.stop();
// // // // // //             mediaRecorderRef.current.onstop = () => {
// // // // // //                 const audioBlob = new Blob(recordedChunksRef.current, {
// // // // // //                     type: "audio/webm",
// // // // // //                 });
// // // // // //                 const audioUrl = URL.createObjectURL(audioBlob);
// // // // // //                 setRecordedAudio(audioUrl);
// // // // // //                 console.log("Audio recording saved");
// // // // // //             };
// // // // // //         }
// // // // // //     }, []);

// // // // // //     // const handleCallAccepted = useCallback(
// // // // // //     //     async (message: any) => {
// // // // // //     //         console.log("Call accepted - User has answered the call");
// // // // // //     //         console.log(
// // // // // //     //             "Telephony Session Info:",
// // // // // //     //             message.headers["P-Rc-Api-Ids"] ||
// // // // // //     //                 message.headers["p-rc-api-ids"]
// // // // // //     //         );
// // // // // //     //         userAgent?.audioHelper.playOutgoing(false);
// // // // // //     //         userAgent?.audioHelper.playIncoming(false);
// // // // // //     //         setCallActive(true);
// // // // // //     //         setCallEnded(false);
// // // // // //     //         startRecording();

// // // // // //     //         console.log("Attempting immediate test transcription");
// // // // // //     //         await transcribeAudio();
// // // // // //     //     },
// // // // // //     //     [userAgent, transcribeAudio, startRecording]
// // // // // //     // );

// // // // // //     const playGreeting = useCallback(async () => {
// // // // // //         if (greetingAudio) {
// // // // // //             const audio = new Audio(greetingAudio);
// // // // // //             await audio.play();
// // // // // //         }
// // // // // //     }, [greetingAudio]);

// // // // // //     const generateGreeting = useCallback(async (phoneNumber: string) => {
// // // // // //         try {
// // // // // //             const response = await fetch("/api/llpmg/generate-greeting", {
// // // // // //                 method: "POST",
// // // // // //                 headers: {
// // // // // //                     "Content-Type": "application/json",
// // // // // //                 },
// // // // // //                 body: JSON.stringify({ phoneNumber }),
// // // // // //             });

// // // // // //             if (response.ok) {
// // // // // //                 const data = await response.json();
// // // // // //                 setGreetingAudio(data.audioUrl);
// // // // // //             } else {
// // // // // //                 console.error("Failed to generate greeting");
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             console.error("Error generating greeting:", error);
// // // // // //         }
// // // // // //     }, []);

// // // // // //     const handleCallAccepted = useCallback(
// // // // // //         async (message: any) => {
// // // // // //             console.log("Call accepted - User has answered the call");
// // // // // //             console.log(
// // // // // //                 "Telephony Session Info:",
// // // // // //                 message.headers["P-Rc-Api-Ids"] ||
// // // // // //                     message.headers["p-rc-api-ids"]
// // // // // //             );
// // // // // //             userAgent?.audioHelper.playOutgoing(false);
// // // // // //             userAgent?.audioHelper.playIncoming(false);
// // // // // //             setCallActive(true);
// // // // // //             setCallEnded(false);
// // // // // //             startRecording();

// // // // // //             // Generate and play greeting
// // // // // //             await generateGreeting(outgoingNumber);
// // // // // //             await playGreeting();

// // // // // //             console.log("Attempting immediate test transcription");
// // // // // //             await transcribeAudio();
// // // // // //         },
// // // // // //         [
// // // // // //             userAgent,
// // // // // //             transcribeAudio,
// // // // // //             startRecording,
// // // // // //             generateGreeting,
// // // // // //             playGreeting,
// // // // // //             outgoingNumber,
// // // // // //         ]
// // // // // //     );

// // // // // //     const handleOutgoingCall = useCallback(() => {
// // // // // //         if (!userAgent || !outgoingNumber) {
// // // // // //             console.error("UserAgent or outgoing number is missing");
// // // // // //             setConnectionError("Please enter a valid phone number");
// // // // // //             return;
// // // // // //         }

// // // // // //         console.log("Placing call to:", outgoingNumber);
// // // // // //         userAgent.audioHelper.playOutgoing(true);

// // // // // //         const session = userAgent.invite(outgoingNumber, {});

// // // // // //         session.on("accepted", handleCallAccepted);

// // // // // //         session.on("terminated", () => {
// // // // // //             console.log("Call terminated");
// // // // // //             userAgent.audioHelper.playOutgoing(false);
// // // // // //             userAgent.audioHelper.playIncoming(false);
// // // // // //             setCallActive(false);
// // // // // //             setCallEnded(true);
// // // // // //             stopRecording();
// // // // // //             if (audioContextRef.current) {
// // // // // //                 audioContextRef.current.close();
// // // // // //             }
// // // // // //             onHangup();
// // // // // //         });

// // // // // //         setSession(session);
// // // // // //     }, [
// // // // // //         userAgent,
// // // // // //         outgoingNumber,
// // // // // //         onHangup,
// // // // // //         handleCallAccepted,
// // // // // //         stopRecording,
// // // // // //     ]);

// // // // // //     const handleIncomingCall = useCallback(
// // // // // //         (action: "accept" | "decline" | "toVoicemail") => {
// // // // // //             if (!incomingCall) {
// // // // // //                 console.error("No incoming call to handle");
// // // // // //                 return;
// // // // // //             }

// // // // // //             console.log("Handling incoming call:", action);
// // // // // //             userAgent?.audioHelper.playIncoming(false);

// // // // // //             switch (action) {
// // // // // //                 case "accept":
// // // // // //                     console.log("Accepting incoming call");
// // // // // //                     incomingCall.accept();
// // // // // //                     setSession(incomingCall);
// // // // // //                     incomingCall.on("accepted", handleCallAccepted);
// // // // // //                     break;
// // // // // //                 case "decline":
// // // // // //                     incomingCall.reject();
// // // // // //                     break;
// // // // // //                 case "toVoicemail":
// // // // // //                     incomingCall.toVoicemail?.();
// // // // // //                     break;
// // // // // //             }

// // // // // //             setIncomingCall(null);
// // // // // //         },
// // // // // //         [incomingCall, userAgent, handleCallAccepted]
// // // // // //     );

// // // // // //     const handleHangup = useCallback(() => {
// // // // // //         console.log("Hanging up call");
// // // // // //         if (session) {
// // // // // //             session.dispose();
// // // // // //         }
// // // // // //         if (audioContextRef.current) {
// // // // // //             audioContextRef.current.close();
// // // // // //         }
// // // // // //         stopRecording();
// // // // // //         setSession(null);
// // // // // //         setCallActive(false);
// // // // // //         setCallEnded(true);
// // // // // //         onHangup();
// // // // // //     }, [session, onHangup, stopRecording]);

// // // // // //     const toggleMute = useCallback(() => {
// // // // // //         console.log("Toggling mute");
// // // // // //         if (session) {
// // // // // //             if (muted) {
// // // // // //                 session.unmute?.();
// // // // // //             } else {
// // // // // //                 session.mute?.();
// // // // // //             }
// // // // // //             setMuted(!muted);
// // // // // //         }
// // // // // //     }, [session, muted]);

// // // // // //     const toggleHold = useCallback(() => {
// // // // // //         console.log("Toggling hold");
// // // // // //         if (session) {
// // // // // //             if (held) {
// // // // // //                 session.unhold?.();
// // // // // //             } else {
// // // // // //                 session.hold?.();
// // // // // //             }
// // // // // //             setHeld(!held);
// // // // // //         }
// // // // // //     }, [session, held]);

// // // // // //     const handlePark = useCallback(() => {
// // // // // //         console.log("Parking call");
// // // // // //         if (session) {
// // // // // //             session.park?.();
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleTransfer = useCallback(() => {
// // // // // //         console.log("Initiating transfer");
// // // // // //         if (session) {
// // // // // //             const transferNumber = prompt("Enter the number to transfer to:");
// // // // // //             if (transferNumber) {
// // // // // //                 console.log("Transferring to:", transferNumber);
// // // // // //                 session.transfer?.(transferNumber);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleFlip = useCallback(() => {
// // // // // //         console.log("Initiating flip");
// // // // // //         if (session) {
// // // // // //             const flipNumber = prompt("Enter the number to flip to:");
// // // // // //             if (flipNumber) {
// // // // // //                 console.log("Flipping to:", flipNumber);
// // // // // //                 session.flip?.(flipNumber);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const handleDTMF = useCallback(() => {
// // // // // //         console.log("Sending DTMF");
// // // // // //         if (session) {
// // // // // //             const digit = prompt("Enter the DTMF digit:");
// // // // // //             if (digit) {
// // // // // //                 console.log("Sending DTMF digit:", digit);
// // // // // //                 session.dtmf?.(digit);
// // // // // //             }
// // // // // //         }
// // // // // //     }, [session]);

// // // // // //     const adjustVolume = useCallback((direction: number) => {
// // // // // //         console.log("Adjusting volume:", direction);
// // // // // //         if (remoteAudioRef.current) {
// // // // // //             remoteAudioRef.current.volume = Math.min(
// // // // // //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// // // // // //                 1
// // // // // //             );
// // // // // //             console.log("New volume:", remoteAudioRef.current.volume);
// // // // // //         }
// // // // // //     }, []);

// // // // // //     return (
// // // // // //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// // // // // //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// // // // // //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// // // // // //                 <audio id="localAudio" hidden muted />
// // // // // //                 {connectionError && (
// // // // // //                     <div className="text-red-500 text-sm mb-4">
// // // // // //                         {connectionError}
// // // // // //                     </div>
// // // // // //                 )}
// // // // // //                 {!isAuthenticated ? (
// // // // // //                     <div className="auth flex flex-col items-center">
// // // // // //                         <button
// // // // // //                             onClick={() => {
// // // // // //                                 console.log("Initiating authentication");
// // // // // //                                 initiateAuth();
// // // // // //                             }}
// // // // // //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                         >
// // // // // //                             Authorize
// // // // // //                         </button>
// // // // // //                     </div>
// // // // // //                 ) : (
// // // // // //                     <>
// // // // // //                         <h3 className="text-white text-2xl mb-6">
// // // // // //                             LLPMG WebPhone Dashboard
// // // // // //                         </h3>
// // // // // //                         <button
// // // // // //                             onClick={() => {
// // // // // //                                 console.log("Logging out");
// // // // // //                                 onLogout();
// // // // // //                             }}
// // // // // //                             className="text-sm text-gray-400 hover:text-white mb-4"
// // // // // //                         >
// // // // // //                             Logout
// // // // // //                         </button>
// // // // // //                         {!callActive && !callEnded && (
// // // // // //                             <div className="outgoing-call mt-4">
// // // // // //                                 <h4 className="text-white text-xl mb-3">
// // // // // //                                     Outgoing Call
// // // // // //                                 </h4>
// // // // // //                                 <input
// // // // // //                                     type="text"
// // // // // //                                     value={outgoingNumber}
// // // // // //                                     onChange={(e) => {
// // // // // //                                         console.log(
// // // // // //                                             "Outgoing number changed:",
// // // // // //                                             e.target.value
// // // // // //                                         );
// // // // // //                                         setOutgoingNumber(e.target.value);
// // // // // //                                     }}
// // // // // //                                     placeholder="+1 234 567-8900"
// // // // // //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// // // // // //                                 />
// // // // // //                                 <button
// // // // // //                                     onClick={() => {
// // // // // //                                         console.log("Initiating outgoing call");
// // // // // //                                         handleOutgoingCall();
// // // // // //                                     }}
// // // // // //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                 >
// // // // // //                                     Call
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {callActive && (
// // // // // //                             <div className="active-call mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     Call In Progress
// // // // // //                                 </h4>
// // // // // //                                 <div className="grid grid-cols-2 gap-4">
// // // // // //                                     <button
// // // // // //                                         onClick={toggleMute}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         {muted ? "Unmute" : "Mute"}
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={toggleHold}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         {held ? "Unhold" : "Hold"}
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handlePark}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Park
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleTransfer}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Transfer
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleFlip}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Flip
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={handleDTMF}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Send DTMF
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => adjustVolume(0.1)}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         + Volume
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => adjustVolume(-0.1)}
// // // // // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         - Volume
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log("Hanging up call");
// // // // // //                                             handleHangup();
// // // // // //                                         }}
// // // // // //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Hang Up
// // // // // //                                     </button>
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {(callActive || callEnded) && (
// // // // // //                             <div className="transcription mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     {callEnded
// // // // // //                                         ? "Call Transcription"
// // // // // //                                         : "Live Transcription"}
// // // // // //                                 </h4>
// // // // // //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// // // // // //                                     {transcribedText ||
// // // // // //                                         "Transcription will appear here..."}
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {callEnded && recordedAudio && (
// // // // // //                             <div className="recorded-audio mt-6">
// // // // // //                                 <h4 className="text-white text-xl mb-4">
// // // // // //                                     Recorded Audio
// // // // // //                                 </h4>
// // // // // //                                 <audio
// // // // // //                                     controls
// // // // // //                                     src={recordedAudio}
// // // // // //                                     className="w-full"
// // // // // //                                 />
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                         {incomingCall && (
// // // // // //                             <div className="incoming-call mt-6">
// // // // // //                                 <h3 className="text-white text-xl mb-3">
// // // // // //                                     Incoming Call
// // // // // //                                 </h3>
// // // // // //                                 <div className="grid grid-cols-3 gap-2">
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Accepting incoming call"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("accept");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Answer
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Declining incoming call"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("decline");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         Decline
// // // // // //                                     </button>
// // // // // //                                     <button
// // // // // //                                         onClick={() => {
// // // // // //                                             console.log(
// // // // // //                                                 "Sending incoming call to voicemail"
// // // // // //                                             );
// // // // // //                                             handleIncomingCall("toVoicemail");
// // // // // //                                         }}
// // // // // //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // // // // //                                     >
// // // // // //                                         To Voicemail
// // // // // //                                     </button>
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </>
// // // // // //                 )}
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default SipSpeechComponent;

// // // "use client";

// // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// // // interface SipSpeechComponentProps {
// // //     onHangup: () => void;
// // //     initiateAuth: () => void;
// // //     tokenData: any;
// // //     onLogout: () => void;
// // //     setTokenData: (data: any) => void;
// // // }

// // // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// // //     onHangup,
// // //     initiateAuth,
// // //     tokenData,
// // //     onLogout,
// // //     setTokenData,
// // // }) => {
// // //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// // //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// // //     const [muted, setMuted] = useState(false);
// // //     const [held, setHeld] = useState(false);
// // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// // //         null
// // //     );
// // //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// // //     const [connectionError, setConnectionError] = useState<string | null>(null);
// // //     const [callActive, setCallActive] = useState(false);
// // //     const [transcribedText, setTranscribedText] = useState<string>("");
// // //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
// // //     const [callEnded, setCallEnded] = useState(false);

// // //     const audioContextRef = useRef<AudioContext | null>(null);
// // //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// // //     const analyserRef = useRef<AnalyserNode | null>(null);
// // //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// // //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
// // //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // //     const recordedChunksRef = useRef<Blob[]>([]);

// // //     useEffect(() => {
// // //         console.log("SipSpeechComponent mounted");
// // //         remoteAudioRef.current = document.getElementById(
// // //             "remoteAudio"
// // //         ) as HTMLAudioElement;
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.onloadedmetadata = () => {
// // //                 remoteAudioRef.current!.muted = false;
// // //             };
// // //         }
// // //         if (tokenData) {
// // //             console.log("TokenData available, initializing WebPhone");
// // //             const parsedTokenData =
// // //                 typeof tokenData === "string"
// // //                     ? JSON.parse(tokenData)
// // //                     : tokenData;
// // //             initializeWebPhone(parsedTokenData);
// // //         }
// // //         return () => {
// // //             console.log("SipSpeechComponent unmounting");
// // //             stopAllAudioProcessing();
// // //         };
// // //     }, [tokenData]);

// // //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// // //         try {
// // //             console.log("Starting WebPhone Initialization...");
// // //             const sipProvisionResponse = await fetch(
// // //                 "/api/llpmg/sip-provision",
// // //                 {
// // //                     method: "POST",
// // //                     headers: { "Content-Type": "application/json" },
// // //                     body: JSON.stringify({ tokenData }),
// // //                 }
// // //             );

// // //             if (!sipProvisionResponse.ok) {
// // //                 throw new Error(
// // //                     `HTTP error! status: ${sipProvisionResponse.status}`
// // //                 );
// // //             }

// // //             const { sipProvisionData } = await sipProvisionResponse.json();
// // //             console.log("SIP Provision Data received:", sipProvisionData);

// // //             if (!sipProvisionData) {
// // //                 throw new Error("SIP Provision Data is undefined");
// // //             }

// // //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// // //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// // //             if (
// // //                 !parsedSipProvisionData.sipInfo ||
// // //                 !parsedSipProvisionData.sipInfo.length
// // //             ) {
// // //                 throw new Error("Parsed SIP Info is missing or incomplete");
// // //             }

// // //             const options: WebPhoneOptions = {
// // //                 logLevel: 1 as 0 | 1 | 2 | 3,
// // //                 appName: "LLPMG WebPhone",
// // //                 appVersion: "1.0.0",
// // //                 media: {
// // //                     remote: remoteAudioRef.current as HTMLAudioElement,
// // //                     local: document.getElementById(
// // //                         "localAudio"
// // //                     ) as HTMLAudioElement,
// // //                 },
// // //                 audioHelper: {
// // //                     enabled: true,
// // //                     incoming: "/llpmg/audio/incoming.ogg",
// // //                     outgoing: "/llpmg/audio/outgoing.ogg",
// // //                 },
// // //             };

// // //             console.log("Creating WebPhone instance with options:", options);
// // //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// // //             webPhone.userAgent.on("registered", () => {
// // //                 console.log("User registered");
// // //                 setIsAuthenticated(true);
// // //             });

// // //             webPhone.userAgent.on("unregistered", () => {
// // //                 console.log("User unregistered");
// // //                 setIsAuthenticated(false);
// // //             });

// // //             webPhone.userAgent.on(
// // //                 "invite",
// // //                 (incomingSession: WebPhoneInvitation) => {
// // //                     console.log("Incoming call received");
// // //                     setIncomingCall(incomingSession);
// // //                     webPhone.userAgent.audioHelper.playIncoming(true);
// // //                 }
// // //             );

// // //             webPhone.userAgent.on(
// // //                 "sendMessage",
// // //                 (incomingSession: WebPhoneInvitation) => {
// // //                     console.log("Incoming message");
// // //                     // setIncomingCall(incomingSession);
// // //                     // webPhone.userAgent.audioHelper.playIncoming(true);
// // //                 }
// // //             );

// // //             webPhone.userAgent.start();
// // //             setUserAgent(webPhone.userAgent);
// // //         } catch (error) {
// // //             console.error("Failed to initialize WebPhone:", error);
// // //             setConnectionError(
// // //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// // //             );
// // //         }
// // //     }, []);

// // //     const startRecording = useCallback(() => {
// // //         console.log("Starting recording");
// // //         recordedChunksRef.current = [];
// // //         const remoteAudio = remoteAudioRef.current;

// // //         if (remoteAudio && remoteAudio.srcObject) {
// // //             console.log("Remote audio source found");
// // //             const mediaRecorder = new MediaRecorder(
// // //                 remoteAudio.srcObject as MediaStream
// // //             );

// // //             mediaRecorder.ondataavailable = (event) => {
// // //                 if (event.data.size > 0) {
// // //                     recordedChunksRef.current.push(event.data);
// // //                 }
// // //             };

// // //             mediaRecorder.start();
// // //             mediaRecorderRef.current = mediaRecorder;
// // //             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// // //         } else {
// // //             console.error("Remote audio source not found");
// // //         }
// // //     }, []);

// // //     const stopRecording = useCallback(() => {
// // //         console.log("Stopping recording");
// // //         if (
// // //             mediaRecorderRef.current &&
// // //             mediaRecorderRef.current.state !== "inactive"
// // //         ) {
// // //             mediaRecorderRef.current.stop();
// // //             mediaRecorderRef.current.onstop = () => {
// // //                 const audioBlob = new Blob(recordedChunksRef.current, {
// // //                     type: "audio/webm",
// // //                 });
// // //                 const audioUrl = URL.createObjectURL(audioBlob);
// // //                 setRecordedAudio(audioUrl);
// // //                 console.log("Audio recording saved");
// // //             };
// // //         }
// // //     }, []);

// // //     const setupAudioProcessing = useCallback((stream: MediaStream) => {
// // //         console.log("Setting up audio processing");
// // //         audioContextRef.current = new AudioContext();
// // //         sourceNodeRef.current =
// // //             audioContextRef.current.createMediaStreamSource(stream);
// // //         analyserRef.current = audioContextRef.current.createAnalyser();
// // //         scriptProcessorRef.current =
// // //             audioContextRef.current.createScriptProcessor(4096, 1, 1);

// // //         sourceNodeRef.current.connect(analyserRef.current);
// // //         analyserRef.current.connect(scriptProcessorRef.current);
// // //         scriptProcessorRef.current.connect(audioContextRef.current.destination);

// // //         let silenceStart: number | null = null;
// // //         const silenceThreshold = 0.01;
// // //         const silenceDuration = 3000;
// // //         let isTranscribing = false;

// // //         scriptProcessorRef.current.onaudioprocess = (event) => {
// // //             const input = event.inputBuffer.getChannelData(0);
// // //             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// // //             const average = sum / input.length;

// // //             if (average < silenceThreshold) {
// // //                 if (silenceStart === null) {
// // //                     silenceStart = Date.now();
// // //                     console.log("Silence started at:", silenceStart);
// // //                 } else if (
// // //                     Date.now() - silenceStart >= silenceDuration &&
// // //                     !isTranscribing
// // //                 ) {
// // //                     console.log(
// // //                         "Silence detected for 1 second, triggering transcription"
// // //                     );
// // //                     isTranscribing = true;
// // //                     transcribeAudio().then(() => {
// // //                         isTranscribing = false;
// // //                         silenceStart = null;
// // //                     });
// // //                 }
// // //             } else {
// // //                 silenceStart = null;
// // //             }
// // //         };
// // //     }, []);

// // //     const stopAllAudioProcessing = useCallback(() => {
// // //         if (audioContextRef.current) {
// // //             audioContextRef.current.close();
// // //         }
// // //         if (mediaRecorderRef.current) {
// // //             mediaRecorderRef.current.stop();
// // //         }
// // //     }, []);

// // //     const transcribeAudio = useCallback(async () => {
// // //         console.log("Transcribing audio");
// // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // //             console.error(
// // //                 "Remote audio source not available for transcription"
// // //             );
// // //             return;
// // //         }

// // //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// // //         const recorder = new MediaRecorder(stream);
// // //         const chunks: Blob[] = [];

// // //         recorder.ondataavailable = (event) => {
// // //             chunks.push(event.data);
// // //         };

// // //         recorder.onstop = async () => {
// // //             const audioBlob = new Blob(chunks, { type: "audio/webm" });
// // //             const reader = new FileReader();
// // //             reader.readAsDataURL(audioBlob);
// // //             reader.onloadend = async () => {
// // //                 if (typeof reader.result === "string") {
// // //                     const base64Audio = reader.result.split(",")[1];
// // //                     try {
// // //                         console.log("Sending audio to transcription API");
// // //                         const response = await fetch(
// // //                             "/api/llpmg/speech-to-text",
// // //                             {
// // //                                 method: "POST",
// // //                                 headers: { "Content-Type": "application/json" },
// // //                                 body: JSON.stringify({ audio: base64Audio }),
// // //                             }
// // //                         );
// // //                         console.log(
// // //                             "Transcription API response status:",
// // //                             response.status
// // //                         );
// // //                         if (response.ok) {
// // //                             const data = await response.json();
// // //                             console.log("Transcription received:", data.result);
// // //                             setTranscribedText(
// // //                                 (prevText) => prevText + " " + data.result
// // //                             );
// // //                         } else {
// // //                             console.error(
// // //                                 "Failed to transcribe audio",
// // //                                 await response.text()
// // //                             );
// // //                         }
// // //                     } catch (error) {
// // //                         console.error("Error transcribing audio:", error);
// // //                     }
// // //                 }
// // //             };
// // //         };

// // //         recorder.start();
// // //         setTimeout(() => recorder.stop(), 5000);
// // //     }, []);

// // //     const handleCallAccepted = useCallback(
// // //         async (message: any) => {
// // //             console.log("Call accepted - User has answered the call");
// // //             console.log(
// // //                 "Telephony Session Info:",
// // //                 message.headers["P-Rc-Api-Ids"] ||
// // //                     message.headers["p-rc-api-ids"]
// // //             );
// // //             userAgent?.audioHelper.playOutgoing(false);
// // //             userAgent?.audioHelper.playIncoming(false);
// // //             setCallActive(true);
// // //             setCallEnded(false);

// // //             // Extract remote number from the session
// // //             let remoteNumber = "unknown number";
// // //             console.log("this is the session: >>>", session);
// // //             if (session) {
// // //                 console.log("current session data: >>>>\n", session);
// // //                 if ("request" in session && session.request) {
// // //                     const fromHeader = session.request.getHeader("From");
// // //                     if (fromHeader) {
// // //                         const match = fromHeader.match(/<sip:(.+)@/);
// // //                         if (match && match[1]) {
// // //                             remoteNumber = match[1];
// // //                         }
// // //                     }
// // //                 } else if (
// // //                     "remoteIdentity" in session &&
// // //                     session.remoteIdentity
// // //                 ) {
// // //                     remoteNumber =
// // //                         session.remoteIdentity.uri.user || "unknown number";
// // //                 }
// // //             }

// // //             remoteNumber = "9092895924";
// // //             console.log("Remote number (caller):", remoteNumber);

// // //             try {
// // //                 console.log("Generating greeting for caller:", remoteNumber);
// // //                 const response = await fetch("/api/llpmg/generate-greeting", {
// // //                     method: "POST",
// // //                     headers: {
// // //                         "Content-Type": "application/json",
// // //                     },
// // //                     body: JSON.stringify({ callerNumber: remoteNumber }),
// // //                 });

// // //                 if (response.ok) {
// // //                     const data = await response.json();
// // //                     console.log("Greeting generated successfully");

// // //                     // Play the greeting
// // //                     console.log("Playing greeting");
// // //                     const audio = new Audio(data.audioUrl);
// // //                     await audio.play();
// // //                     console.log("Greeting playback completed");
// // //                 } else {
// // //                     console.error("Failed to generate greeting");
// // //                 }
// // //             } catch (error) {
// // //                 console.error("Error generating or playing greeting:", error);
// // //             }

// // //             startRecording();
// // //             console.log("Starting audio recording and processing");

// // //             console.log("Attempting immediate test transcription");
// // //             await transcribeAudio();
// // //         },
// // //         [userAgent, session, startRecording, transcribeAudio]
// // //     );

// // //     const handleOutgoingCall = useCallback(() => {
// // //         if (!userAgent || !outgoingNumber) {
// // //             console.error("UserAgent or outgoing number is missing");
// // //             setConnectionError("Please enter a valid phone number");
// // //             return;
// // //         }

// // //         console.log("Placing call to:", outgoingNumber);
// // //         userAgent.audioHelper.playOutgoing(true);

// // //         const session = userAgent.invite(outgoingNumber, {});

// // //         session.on("accepted", handleCallAccepted);

// // //         session.on("terminated", () => {
// // //             console.log("Call terminated");
// // //             userAgent.audioHelper.playOutgoing(false);
// // //             userAgent.audioHelper.playIncoming(false);
// // //             setCallActive(false);
// // //             setCallEnded(true);
// // //             stopRecording();
// // //             stopAllAudioProcessing();
// // //             onHangup();
// // //         });

// // //         setSession(session);
// // //     }, [
// // //         userAgent,
// // //         outgoingNumber,
// // //         onHangup,
// // //         handleCallAccepted,
// // //         stopRecording,
// // //         stopAllAudioProcessing,
// // //     ]);

// // //     const handleIncomingCall = useCallback(
// // //         (action: "accept" | "decline" | "toVoicemail") => {
// // //             if (!incomingCall) {
// // //                 console.error("No incoming call to handle");
// // //                 return;
// // //             }

// // //             console.log("Handling incoming call:", action);
// // //             userAgent?.audioHelper.playIncoming(false);

// // //             switch (action) {
// // //                 case "accept":
// // //                     console.log("Accepting incoming call");
// // //                     incomingCall.accept();
// // //                     setSession(incomingCall);
// // //                     incomingCall.on("accepted", handleCallAccepted);
// // //                     break;
// // //                 case "decline":
// // //                     incomingCall.reject();
// // //                     break;
// // //                 case "toVoicemail":
// // //                     incomingCall.toVoicemail?.();
// // //                     break;
// // //             }

// // //             setIncomingCall(null);
// // //         },
// // //         [incomingCall, userAgent, handleCallAccepted]
// // //     );

// // //     const handleHangup = useCallback(() => {
// // //         console.log("Hanging up call");
// // //         if (session) {
// // //             session.dispose();
// // //         }
// // //         stopAllAudioProcessing();
// // //         setSession(null);
// // //         setCallActive(false);
// // //         setCallEnded(true);
// // //         onHangup();
// // //     }, [session, onHangup, stopAllAudioProcessing]);

// // //     const toggleMute = useCallback(() => {
// // //         console.log("Toggling mute");
// // //         if (session) {
// // //             if (muted) {
// // //                 session.unmute?.();
// // //             } else {
// // //                 session.mute?.();
// // //             }
// // //             setMuted(!muted);
// // //         }
// // //     }, [session, muted]);

// // //     const toggleHold = useCallback(() => {
// // //         console.log("Toggling hold");
// // //         if (session) {
// // //             if (held) {
// // //                 session.unhold?.();
// // //             } else {
// // //                 session.hold?.();
// // //             }
// // //             setHeld(!held);
// // //         }
// // //     }, [session, held]);

// // //     const handlePark = useCallback(() => {
// // //         console.log("Parking call");
// // //         if (session) {
// // //             session.park?.();
// // //         }
// // //     }, [session]);

// // //     const handleTransfer = useCallback(() => {
// // //         console.log("Initiating transfer");
// // //         if (session) {
// // //             const transferNumber = prompt("Enter the number to transfer to:");
// // //             if (transferNumber) {
// // //                 console.log("Transferring to:", transferNumber);
// // //                 session.transfer?.(transferNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleFlip = useCallback(() => {
// // //         console.log("Initiating flip");
// // //         if (session) {
// // //             const flipNumber = prompt("Enter the number to flip to:");
// // //             if (flipNumber) {
// // //                 console.log("Flipping to:", flipNumber);
// // //                 session.flip?.(flipNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleDTMF = useCallback(() => {
// // //         console.log("Sending DTMF");
// // //         if (session) {
// // //             const digit = prompt("Enter the DTMF digit:");
// // //             if (digit) {
// // //                 console.log("Sending DTMF digit:", digit);
// // //                 session.dtmf?.(digit);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const adjustVolume = useCallback((direction: number) => {
// // //         console.log("Adjusting volume:", direction);
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.volume = Math.min(
// // //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// // //                 1
// // //             );
// // //             console.log("New volume:", remoteAudioRef.current.volume);
// // //         }
// // //     }, []);

// // //     return (
// // //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// // //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// // //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// // //                 <audio id="localAudio" hidden muted />
// // //                 {connectionError && (
// // //                     <div className="text-red-500 text-sm mb-4">
// // //                         {connectionError}
// // //                     </div>
// // //                 )}
// // //                 {!isAuthenticated ? (
// // //                     <div className="auth flex flex-col items-center">
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Initiating authentication");
// // //                                 initiateAuth();
// // //                             }}
// // //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                         >
// // //                             Authorize
// // //                         </button>
// // //                     </div>
// // //                 ) : (
// // //                     <>
// // //                         <h3 className="text-white text-2xl mb-6">
// // //                             LLPMG WebPhone Dashboard
// // //                         </h3>
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Logging out");
// // //                                 onLogout();
// // //                             }}
// // //                             className="text-sm text-gray-400 hover:text-white mb-4"
// // //                         >
// // //                             Logout
// // //                         </button>
// // //                         {!callActive && !callEnded && (
// // //                             <div className="outgoing-call mt-4">
// // //                                 <h4 className="text-white text-xl mb-3">
// // //                                     Outgoing Call
// // //                                 </h4>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={outgoingNumber}
// // //                                     onChange={(e) => {
// // //                                         console.log(
// // //                                             "Outgoing number changed:",
// // //                                             e.target.value
// // //                                         );
// // //                                         setOutgoingNumber(e.target.value);
// // //                                     }}
// // //                                     placeholder="+1 234 567-8900"
// // //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// // //                                 />
// // //                                 <button
// // //                                     onClick={() => {
// // //                                         console.log("Initiating outgoing call");
// // //                                         handleOutgoingCall();
// // //                                     }}
// // //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                 >
// // //                                     Call
// // //                                 </button>
// // //                             </div>
// // //                         )}
// // //                         {callActive && (
// // //                             <div className="active-call mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Call In Progress
// // //                                 </h4>
// // //                                 <div className="grid grid-cols-2 gap-4">
// // //                                     <button
// // //                                         onClick={toggleMute}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {muted ? "Unmute" : "Mute"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={toggleHold}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {held ? "Unhold" : "Hold"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handlePark}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Park
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleTransfer}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Transfer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleFlip}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Flip
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleDTMF}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Send DTMF
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         + Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(-0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         - Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log("Hanging up call");
// // //                                             handleHangup();
// // //                                         }}
// // //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Hang Up
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {(callActive || callEnded) && (
// // //                             <div className="transcription mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     {callEnded
// // //                                         ? "Call Transcription"
// // //                                         : "Live Transcription"}
// // //                                 </h4>
// // //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// // //                                     {transcribedText ||
// // //                                         "Transcription will appear here..."}
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {callEnded && recordedAudio && (
// // //                             <div className="recorded-audio mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Recorded Audio
// // //                                 </h4>
// // //                                 <audio
// // //                                     controls
// // //                                     src={recordedAudio}
// // //                                     className="w-full"
// // //                                 />
// // //                             </div>
// // //                         )}
// // //                         {incomingCall && (
// // //                             <div className="incoming-call mt-6">
// // //                                 <h3 className="text-white text-xl mb-3">
// // //                                     Incoming Call
// // //                                 </h3>
// // //                                 <div className="grid grid-cols-3 gap-2">
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Accepting incoming call"
// // //                                             );
// // //                                             handleIncomingCall("accept");
// // //                                         }}
// // //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Answer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Declining incoming call"
// // //                                             );
// // //                                             handleIncomingCall("decline");
// // //                                         }}
// // //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Decline
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Sending incoming call to voicemail"
// // //                                             );
// // //                                             handleIncomingCall("toVoicemail");
// // //                                         }}
// // //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         To Voicemail
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default SipSpeechComponent;

// // // "use client";

// // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // // import { SessionState } from "sip.js/lib/api/session-state";
// // // // import { Events } from "./events";
// // // import { IncomingResponse, RequestOptions } from "sip.js/lib/core";
// // // import { fromBodyLegacy } from "sip.js/lib/core";

// // // interface SipSpeechComponentProps {
// // //     onHangup: () => void;
// // //     initiateAuth: () => void;
// // //     tokenData: any;
// // //     onLogout: () => void;
// // //     setTokenData: (data: any) => void;
// // // }

// // // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// // //     onHangup,
// // //     initiateAuth,
// // //     tokenData,
// // //     onLogout,
// // //     setTokenData,
// // // }) => {
// // //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// // //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// // //     const [muted, setMuted] = useState(false);
// // //     const [held, setHeld] = useState(false);
// // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// // //         null
// // //     );
// // //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// // //     const [connectionError, setConnectionError] = useState<string | null>(null);
// // //     const [callActive, setCallActive] = useState(false);
// // //     const [transcribedText, setTranscribedText] = useState<string>("");
// // //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
// // //     const [callEnded, setCallEnded] = useState(false);

// // //     const audioContextRef = useRef<AudioContext | null>(null);
// // //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// // //     const analyserRef = useRef<AnalyserNode | null>(null);
// // //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// // //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
// // //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // //     const recordedChunksRef = useRef<Blob[]>([]);

// // //     useEffect(() => {
// // //         console.log("SipSpeechComponent mounted");
// // //         remoteAudioRef.current = document.getElementById(
// // //             "remoteAudio"
// // //         ) as HTMLAudioElement;
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.onloadedmetadata = () => {
// // //                 remoteAudioRef.current!.muted = false;
// // //             };
// // //         }
// // //         if (tokenData) {
// // //             console.log("TokenData available, initializing WebPhone");
// // //             const parsedTokenData =
// // //                 typeof tokenData === "string"
// // //                     ? JSON.parse(tokenData)
// // //                     : tokenData;
// // //             initializeWebPhone(parsedTokenData);
// // //         }
// // //         return () => {
// // //             console.log("SipSpeechComponent unmounting");
// // //             if (audioContextRef.current) {
// // //                 audioContextRef.current.close();
// // //             }
// // //         };
// // //     }, [tokenData]);

// // //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// // //         try {
// // //             console.log("Starting WebPhone Initialization...");
// // //             const sipProvisionResponse = await fetch(
// // //                 "/api/llpmg/sip-provision",
// // //                 {
// // //                     method: "POST",
// // //                     headers: { "Content-Type": "application/json" },
// // //                     body: JSON.stringify({ tokenData }),
// // //                 }
// // //             );

// // //             if (!sipProvisionResponse.ok) {
// // //                 throw new Error(
// // //                     `HTTP error! status: ${sipProvisionResponse.status}`
// // //                 );
// // //             }

// // //             const { sipProvisionData } = await sipProvisionResponse.json();
// // //             console.log("SIP Provision Data received:", sipProvisionData);

// // //             if (!sipProvisionData) {
// // //                 throw new Error("SIP Provision Data is undefined");
// // //             }

// // //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// // //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// // //             if (
// // //                 !parsedSipProvisionData.sipInfo ||
// // //                 !parsedSipProvisionData.sipInfo.length
// // //             ) {
// // //                 throw new Error("Parsed SIP Info is missing or incomplete");
// // //             }

// // //             const options: WebPhoneOptions = {
// // //                 logLevel: 1 as 0 | 1 | 2 | 3,
// // //                 appName: "LLPMG WebPhone",
// // //                 appVersion: "1.0.0",
// // //                 media: {
// // //                     remote: remoteAudioRef.current as HTMLAudioElement,
// // //                     local: document.getElementById(
// // //                         "localAudio"
// // //                     ) as HTMLAudioElement,
// // //                 },
// // //                 audioHelper: {
// // //                     enabled: true,
// // //                     incoming: "/llpmg/audio/incoming.ogg",
// // //                     outgoing: "/llpmg/audio/outgoing.ogg",
// // //                 },
// // //             };

// // //             console.log("Creating WebPhone instance with options:", options);
// // //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// // //             webPhone.userAgent.on("registered", () => {
// // //                 console.log("User registered");
// // //                 setIsAuthenticated(true);
// // //             });

// // //             webPhone.userAgent.on("unregistered", () => {
// // //                 console.log("User unregistered");
// // //                 setIsAuthenticated(false);
// // //             });

// // //             webPhone.userAgent.on(
// // //                 "invite",
// // //                 (incomingSession: WebPhoneInvitation) => {
// // //                     console.log("Incoming call received");
// // //                     setIncomingCall(incomingSession);
// // //                     webPhone.userAgent.audioHelper.playIncoming(true);
// // //                 }
// // //             );

// // //             webPhone.userAgent.start();
// // //             setUserAgent(webPhone.userAgent);
// // //         } catch (error) {
// // //             console.error("Failed to initialize WebPhone:", error);
// // //             setConnectionError(
// // //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// // //             );
// // //         }
// // //     }, []);

// // //     const generateAndSendGreeting = useCallback(
// // //         async (callerNumber: string) => {
// // //             try {
// // //                 console.log("Generating greeting for caller:", callerNumber);
// // //                 const response = await fetch("/api/llpmg/generate-greeting", {
// // //                     method: "POST",
// // //                     headers: {
// // //                         "Content-Type": "application/json",
// // //                     },
// // //                     body: JSON.stringify({ callerNumber }),
// // //                 });

// // //                 if (response.ok) {
// // //                     const data = await response.json();
// // //                     console.log("Greeting generated successfully");

// // //                     // Send the greeting audio back to the phone
// // //                     if (session && session.info) {
// // //                         const requestOptions: RequestOptions = {
// // //                             body: fromBodyLegacy({
// // //                                 body: data.audioContent,
// // //                                 contentType: "audio/mpeg",
// // //                             }),
// // //                         };
// // //                         await session.info({ requestOptions });
// // //                         console.log("Greeting sent back to the phone");
// // //                     } else {
// // //                         console.error(
// // //                             "Session or session.info is not available"
// // //                         );
// // //                     }
// // //                 } else {
// // //                     console.error("Failed to generate greeting");
// // //                 }
// // //             } catch (error) {
// // //                 console.error("Error generating or sending greeting:", error);
// // //             }
// // //         },
// // //         [session]
// // //     );

// // //     const startRecording = useCallback(() => {
// // //         console.log("Starting recording");
// // //         recordedChunksRef.current = [];
// // //         const remoteAudio = remoteAudioRef.current;

// // //         if (remoteAudio && remoteAudio.srcObject) {
// // //             console.log("Remote audio source found");
// // //             const mediaRecorder = new MediaRecorder(
// // //                 remoteAudio.srcObject as MediaStream
// // //             );

// // //             mediaRecorder.ondataavailable = (event) => {
// // //                 if (event.data.size > 0) {
// // //                     console.log(
// // //                         "Received audio chunk of size:",
// // //                         event.data.size
// // //                     );
// // //                     recordedChunksRef.current.push(event.data);
// // //                 }
// // //             };

// // //             mediaRecorder.start();
// // //             mediaRecorderRef.current = mediaRecorder;
// // //             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// // //         } else {
// // //             console.error("Remote audio source not found");
// // //         }
// // //     }, []);

// // //     const transcribeAudio = useCallback(async () => {
// // //         console.log("Transcribing audio");
// // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // //             console.error(
// // //                 "Remote audio source not available for transcription"
// // //             );
// // //             return;
// // //         }

// // //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// // //         const recorder = new MediaRecorder(stream);
// // //         const chunks: Blob[] = [];

// // //         recorder.ondataavailable = (event) => {
// // //             chunks.push(event.data);
// // //         };

// // //         recorder.onstop = async () => {
// // //             const audioBlob = new Blob(chunks, { type: "audio/webm" });
// // //             const reader = new FileReader();
// // //             reader.readAsDataURL(audioBlob);
// // //             reader.onloadend = async () => {
// // //                 if (typeof reader.result === "string") {
// // //                     const base64Audio = reader.result.split(",")[1];
// // //                     try {
// // //                         console.log("Sending audio to transcription API");
// // //                         const response = await fetch(
// // //                             "/api/llpmg/speech-to-text",
// // //                             {
// // //                                 method: "POST",
// // //                                 headers: { "Content-Type": "application/json" },
// // //                                 body: JSON.stringify({ audio: base64Audio }),
// // //                             }
// // //                         );
// // //                         console.log(
// // //                             "Transcription API response status:",
// // //                             response.status
// // //                         );
// // //                         if (response.ok) {
// // //                             const data = await response.json();
// // //                             console.log("Transcription received:", data.result);
// // //                             setTranscribedText(
// // //                                 (prevText) => prevText + " " + data.result
// // //                             );
// // //                         } else {
// // //                             console.error(
// // //                                 "Failed to transcribe audio",
// // //                                 await response.text()
// // //                             );
// // //                         }
// // //                     } catch (error) {
// // //                         console.error("Error transcribing audio:", error);
// // //                     }
// // //                 }
// // //             };
// // //         };

// // //         recorder.start();
// // //         setTimeout(() => recorder.stop(), 5000);
// // //     }, []);

// // //     const handleCallAccepted = useCallback(
// // //         async (message: any) => {
// // //             console.log("Call accepted - User has answered the call");
// // //             console.log(
// // //                 "Telephony Session Info:",
// // //                 message.headers["P-Rc-Api-Ids"] ||
// // //                     message.headers["p-rc-api-ids"]
// // //             );
// // //             userAgent?.audioHelper.playOutgoing(false);
// // //             userAgent?.audioHelper.playIncoming(false);
// // //             setCallActive(true);
// // //             setCallEnded(false);

// // //             // Extract remote number from the session
// // //             let remoteNumber = "unknown number";
// // //             if (session) {
// // //                 if ("request" in session && session.request) {
// // //                     const fromHeader = session.request.getHeader("From");
// // //                     if (fromHeader) {
// // //                         const match = fromHeader.match(/<sip:(.+)@/);
// // //                         if (match && match[1]) {
// // //                             remoteNumber = match[1];
// // //                         }
// // //                     }
// // //                 } else if (
// // //                     "remoteIdentity" in session &&
// // //                     session.remoteIdentity
// // //                 ) {
// // //                     remoteNumber =
// // //                         session.remoteIdentity.uri.user || "unknown number";
// // //                 }
// // //             }
// // //             console.log("Remote number (caller):", remoteNumber);
// // //             remoteNumber = "9092895924";

// // //             await generateAndSendGreeting(remoteNumber);

// // //             startRecording();
// // //             console.log("Starting audio recording and processing");

// // //             console.log("Attempting immediate test transcription");
// // //             await transcribeAudio();
// // //         },
// // //         [
// // //             userAgent,
// // //             session,
// // //             generateAndSendGreeting,
// // //             startRecording,
// // //             transcribeAudio,
// // //         ]
// // //     );

// // //     const setupAudioProcessing = useCallback(
// // //         (stream: MediaStream) => {
// // //             console.log("Setting up audio processing");
// // //             audioContextRef.current = new AudioContext();
// // //             sourceNodeRef.current =
// // //                 audioContextRef.current.createMediaStreamSource(stream);
// // //             analyserRef.current = audioContextRef.current.createAnalyser();
// // //             scriptProcessorRef.current =
// // //                 audioContextRef.current.createScriptProcessor(4096, 1, 1);

// // //             sourceNodeRef.current.connect(analyserRef.current);
// // //             analyserRef.current.connect(scriptProcessorRef.current);
// // //             scriptProcessorRef.current.connect(
// // //                 audioContextRef.current.destination
// // //             );

// // //             let silenceStart: number | null = null;
// // //             const silenceThreshold = 0.01;
// // //             const silenceDuration = 1000;
// // //             let isTranscribing = false;

// // //             scriptProcessorRef.current.onaudioprocess = (event) => {
// // //                 const input = event.inputBuffer.getChannelData(0);
// // //                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// // //                 const average = sum / input.length;

// // //                 console.log("Current audio level:", average);

// // //                 if (average < silenceThreshold) {
// // //                     if (silenceStart === null) {
// // //                         silenceStart = Date.now();
// // //                         console.log("Silence started at:", silenceStart);
// // //                     } else if (
// // //                         Date.now() - silenceStart >= silenceDuration &&
// // //                         !isTranscribing
// // //                     ) {
// // //                         console.log(
// // //                             "Silence detected for 1 second, triggering transcription"
// // //                         );
// // //                         isTranscribing = true;
// // //                         transcribeAudio().then(() => {
// // //                             isTranscribing = false;
// // //                             silenceStart = null;
// // //                         });
// // //                     }
// // //                 } else {
// // //                     silenceStart = null;
// // //                 }
// // //             };
// // //         },
// // //         [transcribeAudio]
// // //     );

// // //     const handleOutgoingCall = useCallback(() => {
// // //         if (!userAgent || !outgoingNumber) {
// // //             console.error("UserAgent or outgoing number is missing");
// // //             setConnectionError("Please enter a valid phone number");
// // //             return;
// // //         }

// // //         console.log("Placing call to:", outgoingNumber);
// // //         userAgent.audioHelper.playOutgoing(true);

// // //         const session = userAgent.invite(outgoingNumber, {});

// // //         session.on("accepted", handleCallAccepted);

// // //         session.on("terminated", () => {
// // //             console.log("Call terminated");
// // //             userAgent.audioHelper.playOutgoing(false);
// // //             userAgent.audioHelper.playIncoming(false);
// // //             setCallActive(false);
// // //             setCallEnded(true);
// // //             if (mediaRecorderRef.current) {
// // //                 mediaRecorderRef.current.stop();
// // //             }
// // //             if (audioContextRef.current) {
// // //                 audioContextRef.current.close();
// // //             }
// // //             onHangup();
// // //         });

// // //         setSession(session);
// // //     }, [userAgent, outgoingNumber, handleCallAccepted, onHangup]);

// // //     const handleIncomingCall = useCallback(
// // //         (action: "accept" | "decline" | "toVoicemail") => {
// // //             if (!incomingCall) {
// // //                 console.error("No incoming call to handle");
// // //                 return;
// // //             }

// // //             console.log("Handling incoming call:", action);
// // //             userAgent?.audioHelper.playIncoming(false);

// // //             switch (action) {
// // //                 case "accept":
// // //                     console.log("Accepting incoming call");
// // //                     incomingCall.accept();
// // //                     setSession(incomingCall);
// // //                     incomingCall.on("accepted", handleCallAccepted);
// // //                     break;
// // //                 case "decline":
// // //                     incomingCall.reject();
// // //                     break;
// // //                 case "toVoicemail":
// // //                     incomingCall.toVoicemail?.();
// // //                     break;
// // //             }

// // //             setIncomingCall(null);
// // //         },
// // //         [incomingCall, userAgent, handleCallAccepted]
// // //     );

// // //     const handleHangup = useCallback(() => {
// // //         console.log("Hanging up call");
// // //         if (session) {
// // //             session.dispose();
// // //         }
// // //         if (mediaRecorderRef.current) {
// // //             mediaRecorderRef.current.stop();
// // //         }
// // //         if (audioContextRef.current) {
// // //             audioContextRef.current.close();
// // //         }
// // //         setSession(null);
// // //         setCallActive(false);
// // //         setCallEnded(true);
// // //         onHangup();
// // //     }, [session, onHangup]);

// // //     const toggleMute = useCallback(() => {
// // //         console.log("Toggling mute");
// // //         if (session) {
// // //             if (muted) {
// // //                 session.unmute?.();
// // //             } else {
// // //                 session.mute?.();
// // //             }
// // //             setMuted(!muted);
// // //         }
// // //     }, [session, muted]);

// // //     const toggleHold = useCallback(() => {
// // //         console.log("Toggling hold");
// // //         if (session) {
// // //             if (held) {
// // //                 session.unhold?.();
// // //             } else {
// // //                 session.hold?.();
// // //             }
// // //             setHeld(!held);
// // //         }
// // //     }, [session, held]);

// // //     const handlePark = useCallback(() => {
// // //         console.log("Parking call");
// // //         if (session) {
// // //             session.park?.();
// // //         }
// // //     }, [session]);

// // //     const handleTransfer = useCallback(() => {
// // //         console.log("Initiating transfer");
// // //         if (session) {
// // //             const transferNumber = prompt("Enter the number to transfer to:");
// // //             if (transferNumber) {
// // //                 console.log("Transferring to:", transferNumber);
// // //                 session.transfer?.(transferNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleFlip = useCallback(() => {
// // //         console.log("Initiating flip");
// // //         if (session) {
// // //             const flipNumber = prompt("Enter the number to flip to:");
// // //             if (flipNumber) {
// // //                 console.log("Flipping to:", flipNumber);
// // //                 session.flip?.(flipNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleDTMF = useCallback(() => {
// // //         console.log("Sending DTMF");
// // //         if (session) {
// // //             const digit = prompt("Enter the DTMF digit:");
// // //             if (digit) {
// // //                 console.log("Sending DTMF digit:", digit);
// // //                 session.dtmf?.(digit);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const adjustVolume = useCallback((direction: number) => {
// // //         console.log("Adjusting volume:", direction);
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.volume = Math.min(
// // //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// // //                 1
// // //             );
// // //             console.log("New volume:", remoteAudioRef.current.volume);
// // //         }
// // //     }, []);

// // //     return (
// // //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// // //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// // //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// // //                 <audio id="localAudio" hidden muted />
// // //                 {connectionError && (
// // //                     <div className="text-red-500 text-sm mb-4">
// // //                         {connectionError}
// // //                     </div>
// // //                 )}
// // //                 {!isAuthenticated ? (
// // //                     <div className="auth flex flex-col items-center">
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Initiating authentication");
// // //                                 initiateAuth();
// // //                             }}
// // //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                         >
// // //                             Authorize
// // //                         </button>
// // //                     </div>
// // //                 ) : (
// // //                     <>
// // //                         <h3 className="text-white text-2xl mb-6">
// // //                             LLPMG WebPhone Dashboard
// // //                         </h3>
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Logging out");
// // //                                 onLogout();
// // //                             }}
// // //                             className="text-sm text-gray-400 hover:text-white mb-4"
// // //                         >
// // //                             Logout
// // //                         </button>
// // //                         {!callActive && !callEnded && (
// // //                             <div className="outgoing-call mt-4">
// // //                                 <h4 className="text-white text-xl mb-3">
// // //                                     Outgoing Call
// // //                                 </h4>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={outgoingNumber}
// // //                                     onChange={(e) => {
// // //                                         console.log(
// // //                                             "Outgoing number changed:",
// // //                                             e.target.value
// // //                                         );
// // //                                         setOutgoingNumber(e.target.value);
// // //                                     }}
// // //                                     placeholder="+1 234 567-8900"
// // //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// // //                                 />
// // //                                 <button
// // //                                     onClick={() => {
// // //                                         console.log("Initiating outgoing call");
// // //                                         handleOutgoingCall();
// // //                                     }}
// // //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                 >
// // //                                     Call
// // //                                 </button>
// // //                             </div>
// // //                         )}
// // //                         {callActive && (
// // //                             <div className="active-call mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Call In Progress
// // //                                 </h4>
// // //                                 <div className="grid grid-cols-2 gap-4">
// // //                                     <button
// // //                                         onClick={toggleMute}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {muted ? "Unmute" : "Mute"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={toggleHold}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {held ? "Unhold" : "Hold"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handlePark}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Park
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleTransfer}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Transfer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleFlip}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Flip
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleDTMF}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Send DTMF
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         + Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(-0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         - Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log("Hanging up call");
// // //                                             handleHangup();
// // //                                         }}
// // //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Hang Up
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {(callActive || callEnded) && (
// // //                             <div className="transcription mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     {callEnded
// // //                                         ? "Call Transcription"
// // //                                         : "Live Transcription"}
// // //                                 </h4>
// // //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// // //                                     {transcribedText ||
// // //                                         "Transcription will appear here..."}
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {callEnded && recordedAudio && (
// // //                             <div className="recorded-audio mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Recorded Audio
// // //                                 </h4>
// // //                                 <audio
// // //                                     controls
// // //                                     src={recordedAudio}
// // //                                     className="w-full"
// // //                                 />
// // //                             </div>
// // //                         )}
// // //                         {incomingCall && (
// // //                             <div className="incoming-call mt-6">
// // //                                 <h3 className="text-white text-xl mb-3">
// // //                                     Incoming Call
// // //                                 </h3>
// // //                                 <div className="grid grid-cols-3 gap-2">
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Accepting incoming call"
// // //                                             );
// // //                                             handleIncomingCall("accept");
// // //                                         }}
// // //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Answer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Declining incoming call"
// // //                                             );
// // //                                             handleIncomingCall("decline");
// // //                                         }}
// // //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Decline
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Sending incoming call to voicemail"
// // //                                             );
// // //                                             handleIncomingCall("toVoicemail");
// // //                                         }}
// // //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         To Voicemail
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default SipSpeechComponent;

// // // "use client";

// // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // // import { SessionState } from "sip.js/lib/api/session-state";
// // // import {  RequestOptions, Session } from "sip.js/lib/core";
// // // import { fromBodyLegacy } from "sip.js/lib/core";

// // // interface SipSpeechComponentProps {
// // //     onHangup: () => void;
// // //     initiateAuth: () => void;
// // //     tokenData: any;
// // //     onLogout: () => void;
// // //     setTokenData: (data: any) => void;
// // // }

// // // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// // //     onHangup,
// // //     initiateAuth,
// // //     tokenData,
// // //     onLogout,
// // //     setTokenData,
// // // }) => {
// // //     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
// // //     const [session, setSession] = useState<WebPhoneSession | null>(null);
// // //     const [muted, setMuted] = useState(false);
// // //     const [held, setHeld] = useState(false);
// // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
// // //         null
// // //     );

// // //     const [callDialog, setCallDialog] = useState<Session | undefined>();
// // //     // const [remoteNumber, setRemoteNumber] = useState("");
// // //     const [getGreeting, setGetGreeting] = useState(false);

// // //     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
// // //     const [connectionError, setConnectionError] = useState<string | null>(null);
// // //     const [callActive, setCallActive] = useState(false);
// // //     const [transcribedText, setTranscribedText] = useState<string>("");
// // //     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
// // //     const [callEnded, setCallEnded] = useState(false);

// // //     const audioContextRef = useRef<AudioContext | null>(null);
// // //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// // //     const analyserRef = useRef<AnalyserNode | null>(null);
// // //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// // //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

// // //     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
// // //     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
// // //         null
// // //     );
// // //     const lastTranscriptionRef = useRef<string>("");
// // //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // //     const recordedChunksRef = useRef<Blob[]>([]);
// // //     const bufferRef = useRef<string[]>([]);
// // //     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// // //     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
// // //         null
// // //     );

// // //     useEffect(() => {
// // //         console.log("SipSpeechComponent mounted");
// // //         remoteAudioRef.current = document.getElementById(
// // //             "remoteAudio"
// // //         ) as HTMLAudioElement;
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.onloadedmetadata = () => {
// // //                 remoteAudioRef.current!.muted = false;
// // //             };
// // //         }
// // //         if (tokenData) {
// // //             console.log("TokenData available, initializing WebPhone");
// // //             const parsedTokenData =
// // //                 typeof tokenData === "string"
// // //                     ? JSON.parse(tokenData)
// // //                     : tokenData;
// // //             initializeWebPhone(parsedTokenData);
// // //         }
// // //         return () => {
// // //             console.log("SipSpeechComponent unmounting");
// // //             if (audioContextRef.current) {
// // //                 audioContextRef.current.close();
// // //             }
// // //         };
// // //     }, [tokenData]);

// // //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// // //         try {
// // //             console.log("Starting WebPhone Initialization...");
// // //             const sipProvisionResponse = await fetch(
// // //                 "/api/llpmg/sip-provision",
// // //                 {
// // //                     method: "POST",
// // //                     headers: { "Content-Type": "application/json" },
// // //                     body: JSON.stringify({ tokenData }),
// // //                 }
// // //             );

// // //             if (!sipProvisionResponse.ok) {
// // //                 throw new Error(
// // //                     `HTTP error! status: ${sipProvisionResponse.status}`
// // //                 );
// // //             }

// // //             const { sipProvisionData } = await sipProvisionResponse.json();
// // //             console.log("SIP Provision Data received:", sipProvisionData);

// // //             if (!sipProvisionData) {
// // //                 throw new Error("SIP Provision Data is undefined");
// // //             }

// // //             const parsedSipProvisionData = JSON.parse(sipProvisionData);
// // //             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

// // //             if (
// // //                 !parsedSipProvisionData.sipInfo ||
// // //                 !parsedSipProvisionData.sipInfo.length
// // //             ) {
// // //                 throw new Error("Parsed SIP Info is missing or incomplete");
// // //             }

// // //             const options: WebPhoneOptions = {
// // //                 logLevel: 1 as 0 | 1 | 2 | 3,
// // //                 appName: "LLPMG WebPhone",
// // //                 appVersion: "1.0.0",
// // //                 media: {
// // //                     remote: remoteAudioRef.current as HTMLAudioElement,
// // //                     local: document.getElementById(
// // //                         "localAudio"
// // //                     ) as HTMLAudioElement,
// // //                 },
// // //                 audioHelper: {
// // //                     enabled: true,
// // //                     incoming: "/llpmg/audio/incoming.ogg",
// // //                     outgoing: "/llpmg/audio/outgoing.ogg",
// // //                 },
// // //             };

// // //             console.log("Creating WebPhone instance with options:", options);
// // //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// // //             webPhone.userAgent.on("registered", () => {
// // //                 console.log("User registered");
// // //                 setIsAuthenticated(true);
// // //             });

// // //             webPhone.userAgent.on("unregistered", () => {
// // //                 console.log("User unregistered");
// // //                 setIsAuthenticated(false);
// // //             });

// // //             webPhone.userAgent.on(
// // //                 "invite",
// // //                 (incomingSession: WebPhoneInvitation) => {
// // //                     console.log("Incoming call received, setting session");
// // //                     setIncomingCall(incomingSession);
// // //                     // setCallDialog(incomingCall?.dialog);
// // //                     // console.log("CALL DIALOG SETTING: >>>>\n", callDialog);
// // //                     webPhone.userAgent.audioHelper.playIncoming(true);
// // //                 }
// // //             );

// // //             webPhone.userAgent.start();
// // //             setUserAgent(webPhone.userAgent);
// // //         } catch (error) {
// // //             console.error("Failed to initialize WebPhone:", error);
// // //             setConnectionError(
// // //                 `Failed to initialize WebPhone: ${(error as Error).message}`
// // //             );
// // //         }
// // //     }, []);

// // //     const generateGreeting = useCallback(
// // //         async (callerNumber: string): Promise<string | null> => {
// // //             try {
// // //                 console.log("Generating greeting for caller:", callerNumber);
// // //                 const payload = {
// // //                     callerNumber: { remoteNumber: callerNumber },
// // //                 };
// // //                 console.log(
// // //                     "Payload being sent to generate-greeting API:",
// // //                     payload
// // //                 );

// // //                 const response = await fetch("/api/llpmg/generate-greeting", {
// // //                     method: "POST",
// // //                     headers: {
// // //                         "Content-Type": "application/json",
// // //                     },
// // //                     body: JSON.stringify(payload),
// // //                 });

// // //                 if (!response.ok) {
// // //                     const errorText = await response.text();
// // //                     console.error(
// // //                         "Failed to generate greeting. Status:",
// // //                         response.status,
// // //                         "Error:",
// // //                         errorText
// // //                     );
// // //                     return null;
// // //                 }

// // //                 const data = await response.json();
// // //                 console.log("Greeting API response:", data);

// // //                 return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
// // //             } catch (error) {
// // //                 console.error("Error generating greeting:", error);
// // //                 return null;
// // //             }
// // //         },
// // //         []
// // //     );

// // //     const sendGreeting = useCallback(
// // //         async (audioUrl: string) => {
// // //             if (session && session.info) {
// // //                 console.log("Sending greeting audio URL to phone:", audioUrl);

// // //                 const requestOptions: RequestOptions = {
// // //                     body: fromBodyLegacy({
// // //                         body: JSON.stringify({
// // //                             url: audioUrl,
// // //                             type: "audio/ogg",
// // //                         }),
// // //                         contentType: "application/json",
// // //                     }),
// // //                 };

// // //                 try {
// // //                     console.log("Sending INFO request with greeting...");
// // //                     const response = await session.info({ requestOptions });
// // //                     console.log("INFO request response:", response);
// // //                     console.log("Greeting sent back to the phone");
// // //                     setIsGreetingPlaying(true);

// // //                     // Simulate greeting playback time (adjust as needed)
// // //                     await new Promise((resolve) => setTimeout(resolve, 10000)); // Increased to 10 seconds

// // //                     setIsGreetingPlaying(false);
// // //                     console.log("Greeting playback simulation ended");
// // //                 } catch (error) {
// // //                     console.error(
// // //                         "Error sending greeting to the phone:",
// // //                         error
// // //                     );
// // //                 }
// // //             } else {
// // //                 console.error("Session or session.info is not available");
// // //             }
// // //         },
// // //         [session]
// // //     );

// // //     const startRecording = useCallback(() => {
// // //         console.log("Starting recording");
// // //         recordedChunksRef.current = [];
// // //         const remoteAudio = remoteAudioRef.current;

// // //         if (remoteAudio && remoteAudio.srcObject) {
// // //             console.log("Remote audio source found");
// // //             const mediaRecorder = new MediaRecorder(
// // //                 remoteAudio.srcObject as MediaStream
// // //             );

// // //             mediaRecorder.ondataavailable = (event) => {
// // //                 if (event.data.size > 0) {
// // //                     console.log(
// // //                         "Received audio chunk of size:",
// // //                         event.data.size
// // //                     );
// // //                     recordedChunksRef.current.push(event.data);
// // //                 }
// // //             };

// // //             mediaRecorder.start();
// // //             mediaRecorderRef.current = mediaRecorder;
// // //             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// // //         } else {
// // //             console.error("Remote audio source not found");
// // //         }
// // //     }, []);

// // //     const stopRecording = useCallback(() => {
// // //         console.log("Stopping recording");
// // //         if (
// // //             mediaRecorderRef.current &&
// // //             mediaRecorderRef.current.state !== "inactive"
// // //         ) {
// // //             mediaRecorderRef.current.stop();
// // //             mediaRecorderRef.current.onstop = () => {
// // //                 const audioBlob = new Blob(recordedChunksRef.current, {
// // //                     type: "audio/webm",
// // //                 });
// // //                 const audioUrl = URL.createObjectURL(audioBlob);
// // //                 setRecordedAudioUrl(audioUrl);
// // //                 console.log("Audio recording saved");
// // //             };
// // //         }
// // //     }, []);

// // //     const filterTranscription = (text: string): string => {
// // //         const unwantedPhrases = [
// // //             "thank you",
// // //             "goodbye",
// // //             "bye bye",
// // //             "hello",
// // //             "you you",
// // //         ];
// // //         let filteredText = text.toLowerCase();
// // //         unwantedPhrases.forEach((phrase) => {
// // //             const regex = new RegExp(`\\b${phrase}\\b`, "gi");
// // //             filteredText = filteredText.replace(regex, "");
// // //         });
// // //         return filteredText.trim();
// // //     };

// // //     const transcribeAudio = useCallback(async () => {
// // //         console.log("Transcribing audio");
// // //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// // //             console.error(
// // //                 "Remote audio source not available for transcription"
// // //             );
// // //             return;
// // //         }

// // //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// // //         const recorder = new MediaRecorder(stream);
// // //         const chunks: Blob[] = [];

// // //         recorder.ondataavailable = (event) => {
// // //             chunks.push(event.data);
// // //         };

// // //         recorder.onstop = async () => {
// // //             const audioBlob = new Blob(chunks, { type: "audio/webm" });
// // //             const reader = new FileReader();
// // //             reader.readAsDataURL(audioBlob);
// // //             reader.onloadend = async () => {
// // //                 if (typeof reader.result === "string") {
// // //                     const base64Audio = reader.result.split(",")[1];
// // //                     try {
// // //                         console.log("Sending audio to transcription API");
// // //                         const response = await fetch(
// // //                             "/api/llpmg/speech-to-text",
// // //                             {
// // //                                 method: "POST",
// // //                                 headers: { "Content-Type": "application/json" },
// // //                                 body: JSON.stringify({ audio: base64Audio }),
// // //                             }
// // //                         );
// // //                         console.log(
// // //                             "Transcription API response status:",
// // //                             response.status
// // //                         );
// // //                         if (response.ok) {
// // //                             const data = await response.json();
// // //                             console.log(
// // //                                 "Raw transcription received:",
// // //                                 data.result
// // //                             );
// // //                             const filteredTranscription = filterTranscription(
// // //                                 data.result
// // //                             );
// // //                             console.log(
// // //                                 "Filtered transcription:",
// // //                                 filteredTranscription
// // //                             );

// // //                             if (filteredTranscription) {
// // //                                 bufferRef.current.push(filteredTranscription);
// // //                                 if (
// // //                                     bufferRef.current.join(" ").split(" ")
// // //                                         .length >= 10
// // //                                 ) {
// // //                                     const newTranscription =
// // //                                         bufferRef.current.join(" ");
// // //                                     if (
// // //                                         newTranscription !==
// // //                                         lastTranscriptionRef.current
// // //                                     ) {
// // //                                         setTranscribedText(
// // //                                             (prevText) =>
// // //                                                 prevText +
// // //                                                 " " +
// // //                                                 newTranscription
// // //                                         );
// // //                                         lastTranscriptionRef.current =
// // //                                             newTranscription;
// // //                                         bufferRef.current = [];
// // //                                     }
// // //                                 }
// // //                             }
// // //                         } else {
// // //                             console.error(
// // //                                 "Failed to transcribe audio",
// // //                                 await response.text()
// // //                             );
// // //                         }
// // //                     } catch (error) {
// // //                         console.error("Error transcribing audio:", error);
// // //                     }
// // //                 }
// // //             };
// // //         };

// // //         recorder.start();
// // //         setTimeout(() => recorder.stop(), 5000);
// // //     }, []);

// // //     const setupAudioProcessing = useCallback(
// // //         (stream: MediaStream) => {
// // //             console.log("Setting up audio processing");
// // //             const audioContext = new AudioContext();
// // //             const source = audioContext.createMediaStreamSource(stream);
// // //             const analyser = audioContext.createAnalyser();
// // //             const processor = audioContext.createScriptProcessor(1024, 1, 1);

// // //             source.connect(analyser);
// // //             analyser.connect(processor);
// // //             processor.connect(audioContext.destination);

// // //             let silenceStart: number | null = null;
// // //             const silenceThreshold = 0.01;
// // //             const silenceDuration = 2000;

// // //             processor.onaudioprocess = (event) => {
// // //                 const input = event.inputBuffer.getChannelData(0);
// // //                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// // //                 const average = sum / input.length;

// // //                 if (average < silenceThreshold) {
// // //                     if (silenceStart === null) {
// // //                         silenceStart = Date.now();
// // //                     } else if (Date.now() - silenceStart >= silenceDuration) {
// // //                         if (silenceTimeoutRef.current)
// // //                             clearTimeout(silenceTimeoutRef.current);
// // //                         silenceTimeoutRef.current = setTimeout(() => {
// // //                             console.log(
// // //                                 "Silence detected, triggering transcription"
// // //                             );
// // //                             transcribeAudio();
// // //                         }, 500);
// // //                     }
// // //                 } else {
// // //                     silenceStart = null;
// // //                     if (silenceTimeoutRef.current) {
// // //                         clearTimeout(silenceTimeoutRef.current);
// // //                         silenceTimeoutRef.current = null;
// // //                     }
// // //                 }
// // //             };

// // //             return () => {
// // //                 processor.disconnect();
// // //                 analyser.disconnect();
// // //                 source.disconnect();
// // //                 audioContext.close();
// // //             };
// // //         },
// // //         [transcribeAudio]
// // //     );

// // //     const handleCallAccepted = useCallback(
// // //         async (message: any) => {
// // //             console.log("Call accepted - User has answered the call");
// // //             console.log(
// // //                 "Telephony Session Info:",
// // //                 message.headers["P-Rc-Api-Ids"] ||
// // //                     message.headers["p-rc-api-ids"]
// // //             );
// // //             userAgent?.audioHelper.playOutgoing(false);
// // //             userAgent?.audioHelper.playIncoming(false);
// // //             setCallActive(true);
// // //             setCallEnded(false);

// // //             const callerNumber = message.from.uri.normal.user;
// // //             console.log("Caller number:", callerNumber);

// // //             // Add a slight delay before generating and sending the greeting
// // //             await new Promise((resolve) => setTimeout(resolve, 2000));

// // //             const audioUrl = await generateGreeting(callerNumber);
// // //             if (audioUrl) {
// // //                 console.log("Greeting audio URL generated:", audioUrl);
// // //                 setGreetingAudioUrl(audioUrl);
// // //             } else {
// // //                 console.error("Failed to generate greeting");
// // //             }

// // //             startRecording();
// // //         },
// // //         [userAgent, generateGreeting, startRecording]
// // //     );

// // //     const handleCallTerminated = useCallback(() => {
// // //         console.log("Call terminated");
// // //         userAgent?.audioHelper.playOutgoing(false);
// // //         userAgent?.audioHelper.playIncoming(false);
// // //         setCallActive(false);
// // //         setCallEnded(true);
// // //         stopRecording();
// // //         if (audioContextRef.current) {
// // //             audioContextRef.current.close();
// // //         }
// // //         onHangup();
// // //     }, [userAgent, onHangup, stopRecording]);

// // //     const handleOutgoingCall = useCallback(() => {
// // //         if (!userAgent || !outgoingNumber) {
// // //             console.error("UserAgent or outgoing number is missing");
// // //             setConnectionError("Please enter a valid phone number");
// // //             return;
// // //         }

// // //         console.log("Placing call to:", outgoingNumber);
// // //         userAgent.audioHelper.playOutgoing(true);

// // //         const session = userAgent.invite(outgoingNumber, {});

// // //         session.on("accepted", handleCallAccepted);
// // //         session.on("terminated", handleCallTerminated);

// // //         setSession(session);
// // //         setCallActive(true);
// // //         setCallEnded(false);
// // //     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

// // //     const handleIncomingCall = useCallback(
// // //         (action: "accept" | "decline" | "toVoicemail") => {
// // //             console.log("INCOMING CALL: >>>>\n", incomingCall);
// // //             if (!incomingCall) {
// // //                 console.error("No incoming call to handle");
// // //                 return;
// // //             }
// // //             setCallDialog(incomingCall.dialog);

// // //             console.log("Handling incoming call:", action);
// // //             userAgent?.audioHelper.playIncoming(false);

// // //             switch (action) {
// // //                 case "accept":
// // //                     console.log("Accepting incoming call");
// // //                     incomingCall.accept();
// // //                     setSession(incomingCall);
// // //                     incomingCall.on("accepted", handleCallAccepted);
// // //                     incomingCall.on("terminated", handleCallTerminated);
// // //                     break;
// // //                 case "decline":
// // //                     incomingCall.reject();
// // //                     break;
// // //                 case "toVoicemail":
// // //                     incomingCall.toVoicemail?.();
// // //                     break;
// // //             }

// // //             setIncomingCall(null);
// // //         },
// // //         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
// // //     );

// // //     const handleHangup = useCallback(() => {
// // //         console.log("Hanging up call");
// // //         if (session) {
// // //             session.dispose();
// // //         }
// // //         if (mediaRecorderRef.current) {
// // //             mediaRecorderRef.current.stop();
// // //         }
// // //         if (audioContextRef.current) {
// // //             audioContextRef.current.close();
// // //         }
// // //         setSession(null);
// // //         setCallActive(false);
// // //         setCallEnded(true);
// // //         onHangup();
// // //     }, [session, onHangup]);

// // //     const toggleMute = useCallback(() => {
// // //         console.log("Toggling mute");
// // //         if (session) {
// // //             if (muted) {
// // //                 session.unmute?.();
// // //             } else {
// // //                 session.mute?.();
// // //             }
// // //             setMuted(!muted);
// // //         }
// // //     }, [session, muted]);

// // //     const toggleHold = useCallback(() => {
// // //         console.log("Toggling hold");
// // //         if (session) {
// // //             if (held) {
// // //                 session.unhold?.();
// // //             } else {
// // //                 session.hold?.();
// // //             }
// // //             setHeld(!held);
// // //         }
// // //     }, [session, held]);

// // //     const handlePark = useCallback(() => {
// // //         console.log("Parking call");
// // //         if (session) {
// // //             session.park?.();
// // //         }
// // //     }, [session]);

// // //     const handleTransfer = useCallback(() => {
// // //         console.log("Initiating transfer");
// // //         if (session) {
// // //             const transferNumber = prompt("Enter the number to transfer to:");
// // //             if (transferNumber) {
// // //                 console.log("Transferring to:", transferNumber);
// // //                 session.transfer?.(transferNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleFlip = useCallback(() => {
// // //         console.log("Initiating flip");
// // //         if (session) {
// // //             const flipNumber = prompt("Enter the number to flip to:");
// // //             if (flipNumber) {
// // //                 console.log("Flipping to:", flipNumber);
// // //                 session.flip?.(flipNumber);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const handleDTMF = useCallback(() => {
// // //         console.log("Sending DTMF");
// // //         if (session) {
// // //             const digit = prompt("Enter the DTMF digit:");
// // //             if (digit) {
// // //                 console.log("Sending DTMF digit:", digit);
// // //                 session.dtmf?.(digit);
// // //             }
// // //         }
// // //     }, [session]);

// // //     const adjustVolume = useCallback((direction: number) => {
// // //         console.log("Adjusting volume:", direction);
// // //         if (remoteAudioRef.current) {
// // //             remoteAudioRef.current.volume = Math.min(
// // //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// // //                 1
// // //             );
// // //             console.log("New volume:", remoteAudioRef.current.volume);
// // //         }
// // //     }, []);

// // //     useEffect(() => {
// // //         if (callDialog) {
// // //             console.log("CURRENT CALL DIALOG: >>>>\n", callDialog);
// // //         } else {
// // //             console.log("currently no incoming calls");
// // //         }
// // //         console.log("CALL DIALOG: >>>>\n", callDialog);
// // //     }, [incomingCall]);

// // //     useEffect(() => {
// // //         if (greetingAudioUrl && session) {
// // //             sendGreeting(greetingAudioUrl);
// // //         }
// // //     }, [greetingAudioUrl, session, sendGreeting]);

// // //     return (
// // //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// // //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// // //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// // //                 <audio id="localAudio" hidden muted />
// // //                 {connectionError && (
// // //                     <div className="text-red-500 text-sm mb-4">
// // //                         {connectionError}
// // //                     </div>
// // //                 )}
// // //                 {!isAuthenticated ? (
// // //                     <div className="auth flex flex-col items-center">
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Initiating authentication");
// // //                                 initiateAuth();
// // //                             }}
// // //                             className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                         >
// // //                             Authorize
// // //                         </button>
// // //                     </div>
// // //                 ) : (
// // //                     <>
// // //                         <h3 className="text-white text-2xl mb-6">
// // //                             LLPMG WebPhone Dashboard
// // //                         </h3>
// // //                         <button
// // //                             onClick={() => {
// // //                                 console.log("Logging out");
// // //                                 onLogout();
// // //                             }}
// // //                             className="text-sm text-gray-400 hover:text-white mb-4"
// // //                         >
// // //                             Logout
// // //                         </button>
// // //                         {!callActive && !callEnded && (
// // //                             <div className="outgoing-call mt-4">
// // //                                 <h4 className="text-white text-xl mb-3">
// // //                                     Outgoing Call
// // //                                 </h4>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={outgoingNumber}
// // //                                     onChange={(e) => {
// // //                                         console.log(
// // //                                             "Outgoing number changed:",
// // //                                             e.target.value
// // //                                         );
// // //                                         setOutgoingNumber(e.target.value);
// // //                                     }}
// // //                                     placeholder="+1 234 567-8900"
// // //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// // //                                 />
// // //                                 <button
// // //                                     onClick={() => {
// // //                                         console.log("Initiating outgoing call");
// // //                                         handleOutgoingCall();
// // //                                     }}
// // //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                 >
// // //                                     Call
// // //                                 </button>
// // //                             </div>
// // //                         )}
// // //                         {callActive && (
// // //                             <div className="active-call mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Call In Progress
// // //                                 </h4>
// // //                                 <div className="grid grid-cols-2 gap-4">
// // //                                     <button
// // //                                         onClick={toggleMute}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {muted ? "Unmute" : "Mute"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={toggleHold}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         {held ? "Unhold" : "Hold"}
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handlePark}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Park
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleTransfer}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Transfer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleFlip}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Flip
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={handleDTMF}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         Send DTMF
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         + Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => adjustVolume(-0.1)}
// // //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// // //                                     >
// // //                                         - Volume
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log("Hanging up call");
// // //                                             handleHangup();
// // //                                         }}
// // //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Hang Up
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {(callActive || callEnded) && (
// // //                             <div className="transcription mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     {callEnded
// // //                                         ? "Call Transcription"
// // //                                         : "Live Transcription"}
// // //                                 </h4>
// // //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// // //                                     {transcribedText ||
// // //                                         "Transcription will appear here..."}
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                         {callEnded && recordedAudio && (
// // //                             <div className="recorded-audio mt-6">
// // //                                 <h4 className="text-white text-xl mb-4">
// // //                                     Recorded Audio
// // //                                 </h4>
// // //                                 <audio
// // //                                     controls
// // //                                     src={recordedAudio}
// // //                                     className="w-full"
// // //                                 />
// // //                             </div>
// // //                         )}
// // //                         {incomingCall && (
// // //                             <div className="incoming-call mt-6">
// // //                                 <h3 className="text-white text-xl mb-3">
// // //                                     Incoming Call
// // //                                 </h3>
// // //                                 <div className="grid grid-cols-3 gap-2">
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Accepting incoming call"
// // //                                             );
// // //                                             handleIncomingCall("accept");
// // //                                         }}
// // //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Answer
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Declining incoming call"
// // //                                             );
// // //                                             handleIncomingCall("decline");
// // //                                         }}
// // //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         Decline
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             console.log(
// // //                                                 "Sending incoming call to voicemail"
// // //                                             );
// // //                                             handleIncomingCall("toVoicemail");
// // //                                         }}
// // //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// // //                                     >
// // //                                         To Voicemail
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default SipSpeechComponent;

// // "use client";

// // import React, { useEffect, useState, useCallback, useRef } from "react";
// // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // import { RequestOptions, fromBodyLegacy } from "sip.js/lib/core";

// // interface SipSpeechComponentProps {
// //     onHangup: () => void;
// //     initiateAuth: () => void;
// //     tokenData: any;
// //     onLogout: () => void;
// //     setTokenData: (data: any) => void;
// // }

// // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
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
// //     const [transcribedText, setTranscribedText] = useState<string>("");
// //     const [callEnded, setCallEnded] = useState(false);
// //     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
// //         null
// //     );
// //     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
// //         null
// //     );

// //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
// //     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// //     const recordedChunksRef = useRef<Blob[]>([]);
// //     const bufferRef = useRef<string[]>([]);
// //     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //     const audioContextRef = useRef<AudioContext | null>(null);
// //     const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

// //     const [isSessionEstablished, setIsSessionEstablished] = useState(false);

// //     useEffect(() => {
// //         if (session) {
// //             const handleSessionEstablished = () => {
// //                 setIsSessionEstablished(true);
// //             };

// //             session.on("established", handleSessionEstablished);

// //             return () => {
// //                 session.off("established", handleSessionEstablished);
// //             };
// //         }
// //     }, [session]);

// //     useEffect(() => {
// //         remoteAudioRef.current = document.getElementById(
// //             "remoteAudio"
// //         ) as HTMLAudioElement;
// //         if (remoteAudioRef.current) {
// //             remoteAudioRef.current.onloadedmetadata = () => {
// //                 remoteAudioRef.current!.muted = false;
// //             };
// //         }
// //         if (tokenData) {
// //             const parsedTokenData =
// //                 typeof tokenData === "string"
// //                     ? JSON.parse(tokenData)
// //                     : tokenData;
// //             initializeWebPhone(parsedTokenData);
// //         }
// //         return () => {
// //             if (mediaRecorderRef.current) {
// //                 mediaRecorderRef.current.stop();
// //             }
// //         };
// //     }, [tokenData]);

// //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// //         try {
// //             const sipProvisionResponse = await fetch(
// //                 "/api/llpmg/sip-provision",
// //                 {
// //                     method: "POST",
// //                     headers: { "Content-Type": "application/json" },
// //                     body: JSON.stringify({ tokenData }),
// //                 }
// //             );

// //             if (!sipProvisionResponse.ok) {
// //                 throw new Error(
// //                     `HTTP error! status: ${sipProvisionResponse.status}`
// //                 );
// //             }

// //             const { sipProvisionData } = await sipProvisionResponse.json();
// //             const parsedSipProvisionData = JSON.parse(sipProvisionData);

// //             const options: WebPhoneOptions = {
// //                 logLevel: 1 as 0 | 1 | 2 | 3,
// //                 appName: "LLPMG WebPhone",
// //                 appVersion: "1.0.0",
// //                 media: {
// //                     remote: remoteAudioRef.current as HTMLAudioElement,
// //                     local: document.getElementById(
// //                         "localAudio"
// //                     ) as HTMLAudioElement,
// //                 },
// //                 audioHelper: {
// //                     enabled: true,
// //                     incoming: "/llpmg/audio/incoming.ogg",
// //                     outgoing: "/llpmg/audio/outgoing.ogg",
// //                 },
// //             };

// //             const webPhone = new WebPhone(parsedSipProvisionData, options);

// //             webPhone.userAgent.on("registered", () => {
// //                 setIsAuthenticated(true);
// //             });

// //             webPhone.userAgent.on("unregistered", () => {
// //                 setIsAuthenticated(false);
// //             });

// //             webPhone.userAgent.on(
// //                 "invite",
// //                 (incomingSession: WebPhoneInvitation) => {
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

// //     const generateGreeting = useCallback(
// //         async (callerNumber: string): Promise<string | null> => {
// //             console.log("Generating greeting for caller:", callerNumber);
// //             try {
// //                 const payload = {
// //                     callerNumber: { remoteNumber: callerNumber },
// //                 };
// //                 const response = await fetch("/api/llpmg/generate-greeting", {
// //                     method: "POST",
// //                     headers: { "Content-Type": "application/json" },
// //                     body: JSON.stringify(payload),
// //                 });

// //                 if (!response.ok) {
// //                     throw new Error(
// //                         `Failed to generate greeting. Status: ${response.status}`
// //                     );
// //                 }

// //                 const data = await response.json();
// //                 console.log("Greeting API response:", data);
// //                 return data.audioUrl;
// //             } catch (error) {
// //                 console.error("Error generating greeting:", error);
// //                 return null;
// //             }
// //         },
// //         []
// //     );

// //     const playGreetingIntoCall = useCallback(
// //         async (audioUrl: string) => {
// //             if (!session || !isSessionEstablished) {
// //                 console.error("No active session to play audio into");
// //                 return;
// //             }

// //             try {
// //                 const audioResponse = await fetch(audioUrl);
// //                 const audioData = await audioResponse.arrayBuffer();

// //                 const audioContext = new AudioContext();
// //                 const greetingBuffer =
// //                     await audioContext.decodeAudioData(audioData);

// //                 const sessionDescriptionHandler =
// //                     session.sessionDescriptionHandler as any;
// //                 const peerConnection =
// //                     sessionDescriptionHandler.peerConnection as RTCPeerConnection;

// //                 if (!peerConnection) {
// //                     throw new Error("No peer connection available");
// //                 }

// //                 const senders = peerConnection.getSenders();
// //                 const audioSender = senders.find(
// //                     (s: RTCRtpSender) => s.track && s.track.kind === "audio"
// //                 );

// //                 if (!audioSender || !audioSender.track) {
// //                     throw new Error("No audio sender found in peer connection");
// //                 }

// //                 const localStream = audioSender.track.clone();
// //                 const streamSource = audioContext.createMediaStreamSource(
// //                     new MediaStream([localStream])
// //                 );

// //                 const greetingSource = audioContext.createBufferSource();
// //                 greetingSource.buffer = greetingBuffer;

// //                 const merger = audioContext.createChannelMerger(2);
// //                 streamSource.connect(merger, 0, 0);
// //                 greetingSource.connect(merger, 0, 1);

// //                 const dest = audioContext.createMediaStreamDestination();
// //                 merger.connect(dest);

// //                 greetingSource.start(0);

// //                 // Replace the audio track in the peer connection
// //                 await audioSender.replaceTrack(dest.stream.getAudioTracks()[0]);

// //                 console.log("Greeting audio injected into call stream");

// //                 // Restore original track after greeting playback
// //                 greetingSource.onended = async () => {
// //                     await audioSender.replaceTrack(localStream);
// //                 };
// //             } catch (error) {
// //                 console.error("Error playing greeting into call:", error);
// //             }
// //         },
// //         [session, isSessionEstablished]
// //     );

// //     const sendGreeting = useCallback(
// //         async (audioUrl: string) => {
// //             if (session && session.info) {
// //                 const requestOptions: RequestOptions = {
// //                     body: fromBodyLegacy({
// //                         body: JSON.stringify({
// //                             url: audioUrl,
// //                             type: "audio/mpeg",
// //                         }),
// //                         contentType: "application/json",
// //                     }),
// //                 };

// //                 try {
// //                     await session.info({ requestOptions });
// //                     console.log("Greeting sent to the phone");
// //                     await new Promise((resolve) => setTimeout(resolve, 5000));
// //                 } catch (error) {
// //                     console.error(
// //                         "Error sending greeting to the phone:",
// //                         error
// //                     );
// //                 }
// //             }
// //         },
// //         [session]
// //     );

// //     const startRecording = useCallback(() => {
// //         recordedChunksRef.current = [];
// //         const remoteAudio = remoteAudioRef.current;

// //         if (remoteAudio && remoteAudio.srcObject) {
// //             const mediaRecorder = new MediaRecorder(
// //                 remoteAudio.srcObject as MediaStream
// //             );

// //             mediaRecorder.ondataavailable = (event) => {
// //                 if (event.data.size > 0) {
// //                     recordedChunksRef.current.push(event.data);
// //                 }
// //             };

// //             mediaRecorder.start();
// //             mediaRecorderRef.current = mediaRecorder;
// //             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// //         }
// //     }, []);

// //     const stopRecording = useCallback(() => {
// //         if (
// //             mediaRecorderRef.current &&
// //             mediaRecorderRef.current.state !== "inactive"
// //         ) {
// //             mediaRecorderRef.current.stop();
// //             mediaRecorderRef.current.onstop = () => {
// //                 const audioBlob = new Blob(recordedChunksRef.current, {
// //                     type: "audio/webm",
// //                 });
// //                 const audioUrl = URL.createObjectURL(audioBlob);
// //                 setRecordedAudioUrl(audioUrl);
// //             };
// //         }
// //     }, []);

// //     const transcribeAudio = useCallback(async (audioBlob: Blob) => {
// //         const reader = new FileReader();
// //         reader.readAsDataURL(audioBlob);
// //         reader.onloadend = async () => {
// //             if (typeof reader.result === "string") {
// //                 const base64Audio = reader.result.split(",")[1];
// //                 try {
// //                     const response = await fetch("/api/llpmg/speech-to-text", {
// //                         method: "POST",
// //                         headers: { "Content-Type": "application/json" },
// //                         body: JSON.stringify({ audio: base64Audio }),
// //                     });
// //                     if (response.ok) {
// //                         const data = await response.json();
// //                         setTranscribedText((prev) => prev + " " + data.result);
// //                     }
// //                 } catch (error) {
// //                     console.error("Error transcribing audio:", error);
// //                 }
// //             }
// //         };
// //     }, []);

// //     const setupAudioProcessing = useCallback(
// //         (stream: MediaStream) => {
// //             const audioContext = new AudioContext();
// //             const source = audioContext.createMediaStreamSource(stream);
// //             const processor = audioContext.createScriptProcessor(1024, 1, 1);

// //             source.connect(processor);
// //             processor.connect(audioContext.destination);

// //             let silenceStart: number | null = null;
// //             const silenceThreshold = 0.01;
// //             const silenceDuration = 2000;

// //             processor.onaudioprocess = (event) => {
// //                 const input = event.inputBuffer.getChannelData(0);
// //                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// //                 const average = sum / input.length;

// //                 if (average < silenceThreshold) {
// //                     if (silenceStart === null) {
// //                         silenceStart = Date.now();
// //                     } else if (Date.now() - silenceStart >= silenceDuration) {
// //                         if (silenceTimeoutRef.current)
// //                             clearTimeout(silenceTimeoutRef.current);
// //                         silenceTimeoutRef.current = setTimeout(() => {
// //                             const audioBlob = new Blob(
// //                                 recordedChunksRef.current,
// //                                 { type: "audio/webm" }
// //                             );
// //                             transcribeAudio(audioBlob);
// //                             recordedChunksRef.current = [];
// //                         }, 500);
// //                     }
// //                 } else {
// //                     silenceStart = null;
// //                     if (silenceTimeoutRef.current) {
// //                         clearTimeout(silenceTimeoutRef.current);
// //                         silenceTimeoutRef.current = null;
// //                     }
// //                 }
// //             };

// //             return () => {
// //                 processor.disconnect();
// //                 source.disconnect();
// //                 audioContext.close();
// //             };
// //         },
// //         [transcribeAudio]
// //     );

// //     const handleCallAccepted = useCallback(
// //         async (message: any) => {
// //             console.log("Call accepted - User has answered the call");
// //             console.log(
// //                 "Telephony Session Info:",
// //                 message.headers["P-Rc-Api-Ids"] ||
// //                     message.headers["p-rc-api-ids"]
// //             );
// //             userAgent?.audioHelper.playOutgoing(false);
// //             userAgent?.audioHelper.playIncoming(false);
// //             setCallActive(true);
// //             setCallEnded(false);

// //             const callerNumber = message.from.uri.normal.user;
// //             console.log("Caller number:", callerNumber);

// //             console.log("Waiting for session to be established...");
// //             await new Promise<void>((resolve) => {
// //                 if (isSessionEstablished) {
// //                     resolve();
// //                 } else {
// //                     const checkSession = setInterval(() => {
// //                         if (isSessionEstablished) {
// //                             clearInterval(checkSession);
// //                             resolve();
// //                         }
// //                     }, 100);
// //                 }
// //             });
// //             console.log("Session established, generating greeting...");

// //             const greetingAudioUrl = await generateGreeting(callerNumber);
// //             if (greetingAudioUrl) {
// //                 console.log("Greeting generated, playing into call...");
// //                 await playGreetingIntoCall(greetingAudioUrl);
// //             } else {
// //                 console.error("Failed to generate greeting");
// //             }

// //             startRecording();
// //         },
// //         [
// //             userAgent,
// //             generateGreeting,
// //             playGreetingIntoCall,
// //             startRecording,
// //             isSessionEstablished,
// //         ]
// //     );

// //     useEffect(() => {
// //         if (greetingAudioUrl && session) {
// //             sendGreeting(greetingAudioUrl);
// //         }
// //     }, [greetingAudioUrl, session, sendGreeting]);

// //     const handleCallTerminated = useCallback(() => {
// //         userAgent?.audioHelper.playOutgoing(false);
// //         userAgent?.audioHelper.playIncoming(false);
// //         setCallActive(false);
// //         setCallEnded(true);
// //         stopRecording();
// //         onHangup();
// //     }, [userAgent, onHangup, stopRecording]);

// //     const handleOutgoingCall = useCallback(() => {
// //         if (!userAgent || !outgoingNumber) {
// //             setConnectionError("Please enter a valid phone number");
// //             return;
// //         }

// //         userAgent.audioHelper.playOutgoing(true);
// //         const session = userAgent.invite(outgoingNumber, {});
// //         session.on("accepted", handleCallAccepted);
// //         session.on("terminated", handleCallTerminated);
// //         setSession(session);
// //         setCallActive(true);
// //         setCallEnded(false);
// //     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

// //     const handleIncomingCall = useCallback(
// //         (action: "accept" | "decline" | "toVoicemail") => {
// //             if (!incomingCall) return;
// //             userAgent?.audioHelper.playIncoming(false);

// //             switch (action) {
// //                 case "accept":
// //                     incomingCall.accept();
// //                     setSession(incomingCall);
// //                     incomingCall.on("accepted", handleCallAccepted);
// //                     incomingCall.on("terminated", handleCallTerminated);
// //                     break;
// //                 case "decline":
// //                     incomingCall.reject();
// //                     break;
// //                 case "toVoicemail":
// //                     incomingCall.toVoicemail?.();
// //                     break;
// //             }

// //             setIncomingCall(null);
// //         },
// //         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
// //     );

// //     const handleHangup = useCallback(() => {
// //         if (session) {
// //             session.dispose();
// //         }
// //         handleCallTerminated();
// //     }, [session, handleCallTerminated]);

// //     const toggleMute = useCallback(() => {
// //         if (session) {
// //             muted ? session.unmute?.() : session.mute?.();
// //             setMuted(!muted);
// //         }
// //     }, [session, muted]);

// //     const toggleHold = useCallback(() => {
// //         if (session) {
// //             held ? session.unhold?.() : session.hold?.();
// //             setHeld(!held);
// //         }
// //     }, [session, held]);

// //     useEffect(() => {
// //         if (session) {
// //             session.on("accepted", handleCallAccepted);
// //             return () => {
// //                 session.off("accepted", handleCallAccepted);
// //             };
// //         }
// //     }, [session, handleCallAccepted]);

// //     useEffect(() => {
// //         if (session) {
// //             const handleSessionEstablished = () => {
// //                 console.log("Session established");
// //                 setIsSessionEstablished(true);
// //             };

// //             session.on("established", handleSessionEstablished);

// //             return () => {
// //                 session.off("established", handleSessionEstablished);
// //             };
// //         }
// //     }, [session]);

// //     return (
// //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// //             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
// //                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// //                 <audio id="localAudio" hidden muted />
// //                 {connectionError && (
// //                     <div className="text-red-500 text-sm mb-4">
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
// //                             className="text-sm text-gray-400 hover:text-white mb-4"
// //                         >
// //                             Logout
// //                         </button>
// //                         {!callActive && !callEnded && (
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
// //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// //                                 />
// //                                 <button
// //                                     onClick={handleOutgoingCall}
// //                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
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
// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <button
// //                                         onClick={toggleMute}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         {muted ? "Unmute" : "Mute"}
// //                                     </button>
// //                                     <button
// //                                         onClick={toggleHold}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         {held ? "Unhold" : "Hold"}
// //                                     </button>
// //                                     <button
// //                                         onClick={handleHangup}
// //                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         Hang Up
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         )}
// //                         {(callActive || callEnded) && (
// //                             <div className="transcription mt-6">
// //                                 <h4 className="text-white text-xl mb-4">
// //                                     {callEnded
// //                                         ? "Call Transcription"
// //                                         : "Live Transcription"}
// //                                 </h4>
// //                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// //                                     {transcribedText ||
// //                                         "Transcription will appear here..."}
// //                                 </div>
// //                             </div>
// //                         )}
// //                         {callEnded && recordedAudioUrl && (
// //                             <div className="recorded-audio mt-6">
// //                                 <h4 className="text-white text-xl mb-4">
// //                                     Recorded Conversation
// //                                 </h4>
// //                                 <audio
// //                                     controls
// //                                     src={recordedAudioUrl}
// //                                     className="w-full"
// //                                 />
// //                             </div>
// //                         )}
// //                         {incomingCall && (
// //                             <div className="incoming-call mt-6">
// //                                 <h3 className="text-white text-xl mb-3">
// //                                     Incoming Call
// //                                 </h3>
// //                                 <div className="grid grid-cols-3 gap-2">
// //                                     <button
// //                                         onClick={() =>
// //                                             handleIncomingCall("accept")
// //                                         }
// //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         Answer
// //                                     </button>
// //                                     <button
// //                                         onClick={() =>
// //                                             handleIncomingCall("decline")
// //                                         }
// //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         Decline
// //                                     </button>
// //                                     <button
// //                                         onClick={() =>
// //                                             handleIncomingCall("toVoicemail")
// //                                         }
// //                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         To Voicemail
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default SipSpeechComponent;

// decent transcription filtering
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { RequestOptions, Session, fromBodyLegacy } from "sip.js/lib/core";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     // const [remoteNumber, setRemoteNumber] = useState("");
//     const [getGreeting, setGetGreeting] = useState(false);

//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             if (audioContextRef.current) {
//                 audioContextRef.current.close();
//             }
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
//             const sipProvisionResponse = await fetch(
//                 "/api/llpmg/sip-provision",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ tokenData }),
//                 }
//             );

//             if (!sipProvisionResponse.ok) {
//                 throw new Error(`
//                     HTTP error! status: ${sipProvisionResponse.status}`);
//             }

//             const { sipProvisionData } = await sipProvisionResponse.json();
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     console.log("Incoming call received, setting session");
//                     setIncomingCall(incomingSession);
//                     // setCallDialog(incomingCall?.dialog);
//                     // console.log("CALL DIALOG SETTING: >>>>\n", callDialog);
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(`
//                 Failed to initialize WebPhone: ${(error as Error).message}`);
//         }
//     }, []);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 console.log("Generating greeting for caller:", callerNumber);
//                 const payload = {
//                     callerNumber: { remoteNumber: callerNumber },
//                 };
//                 console.log(
//                     "Payload being sent to generate-greeting API:",
//                     payload
//                 );

//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     console.error(
//                         "Failed to generate greeting. Status:",
//                         response.status,
//                         "Error:",
//                         errorText
//                     );
//                     return null;
//                 }

//                 const data = await response.json();
//                 console.log("Greeting API response:", data);

//                 return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const sendGreeting = useCallback(
//         async (audioUrl: string) => {
//             if (session && session.info) {
//                 console.log("Sending greeting audio URL to phone:", audioUrl);

//                 const requestOptions: RequestOptions = {
//                     body: fromBodyLegacy({
//                         body: JSON.stringify({
//                             url: audioUrl,
//                             type: "audio/mpeg",
//                         }),
//                         contentType: "application/json",
//                     }),
//                 };

//                 try {
//                     console.log("Sending INFO request with greeting...");
//                     const response = await session.info({ requestOptions });
//                     console.log("INFO request response:", response);
//                     console.log("Greeting sent back to the phone");
//                     setIsGreetingPlaying(true);

//                     // Simulate greeting playback time (adjust as needed)
//                     await new Promise((resolve) => setTimeout(resolve, 10000)); // Increased to 10 seconds

//                     setIsGreetingPlaying(false);
//                     console.log("Greeting playback simulation ended");
//                 } catch (error) {
//                     console.error(
//                         "Error sending greeting to the phone:",
//                         error
//                     );
//                 }
//             } else {
//                 console.error("Session or session.info is not available");
//             }
//         },
//         [session]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     console.log(
//                         "Received audio chunk of size:",
//                         event.data.size
//                     );
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudioUrl(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log(
//                                 "Raw transcription received:",
//                                 data.result
//                             );
//                             const filteredTranscription = filterTranscription(
//                                 data.result
//                             );
//                             console.log(
//                                 "Filtered transcription:",
//                                 filteredTranscription
//                             );

//                             if (filteredTranscription) {
//                                 bufferRef.current.push(filteredTranscription);
//                                 if (
//                                     bufferRef.current.join(" ").split(" ")
//                                         .length >= 10
//                                 ) {
//                                     const newTranscription =
//                                         bufferRef.current.join(" ");
//                                     if (
//                                         newTranscription !==
//                                         lastTranscriptionRef.current
//                                     ) {
//                                         setTranscribedText(
//                                             (prevText) =>
//                                                 prevText +
//                                                 " " +
//                                                 newTranscription
//                                         );
//                                         lastTranscriptionRef.current =
//                                             newTranscription;
//                                         bufferRef.current = [];
//                                     }
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const handleCallAccepted = useCallback(
//         async (message: any) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);

//             const callerNumber = message.from.uri.normal.user;
//             console.log("Caller number:", callerNumber);

//             // Add a slight delay before generating and sending the greeting
//             await new Promise((resolve) => setTimeout(resolve, 2000));

//             const audioUrl = await generateGreeting(callerNumber);
//             if (audioUrl) {
//                 console.log("Greeting audio URL generated:", audioUrl);
//                 setGreetingAudioUrl(audioUrl);
//             } else {
//                 console.error("Failed to generate greeting");
//             }

//             startRecording();
//         },
//         [userAgent, generateGreeting, startRecording]
//     );

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const session = userAgent.invite(outgoingNumber, {});

//         session.on("accepted", handleCallAccepted);
//         session.on("terminated", handleCallTerminated);

//         setSession(session);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         console.log("Adjusting volume:", direction);
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     useEffect(() => {
//         if (callDialog) {
//             console.log("CURRENT CALL DIALOG: >>>>\n", callDialog);
//         } else {
//             console.log("currently no incoming calls");
//         }
//         console.log("CALL DIALOG: >>>>\n", callDialog);
//     }, [incomingCall]);

//     useEffect(() => {
//         if (greetingAudioUrl && session) {
//             sendGreeting(greetingAudioUrl);
//         }
//     }, [greetingAudioUrl, session, sendGreeting]);

//     //     useEffect(() => {
//     //         window.AudioContext = window.AudioContext || window.webkitAudioContext;

//     // var context = new AudioContext();
//     // var gainNode = context.createGain();
//     // gainNode.connect(context.destination);

//     // // don't play for self
//     // gainNode.gain.value = 0;

//     // document.querySelector('input[type=file]').onchange = function() {
//     //     this.disabled = true;

//     //     var reader = new FileReader();
//     //     reader.onload = (function(e) {
//     //         // Import callback function that provides PCM audio data decoded as an audio buffer
//     //         context.decodeAudioData(e.target.result, function(buffer) {
//     //             // Create the sound source
//     //             var soundSource = context.createBufferSource();

//     //             soundSource.buffer = buffer;
//     //             soundSource.start(0, 0 / 1000);
//     //             soundSource.connect(gainNode);

//     //             var destination = context.createMediaStreamDestination();
//     //             soundSource.connect(destination);

//     //             createPeerConnection(destination.stream);
//     //         });
//     //     });

//     //     reader.readAsArrayBuffer(this.files[0]);
//     // };

//     // function createPeerConnection(mp3Stream) {
//     //     // you need to place 3rd party WebRTC code here
//     // }
//     //     }, [])

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && !callEnded && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// incomplete
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(async (callerNumber: string) => {
//         try {
//             console.log("Generating greeting for caller:", callerNumber);
//             const response = await fetch("/api/llpmg/generate-greeting", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ callerNumber }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Greeting generated successfully");
//                 return data.audioUrl;
//             } else {
//                 console.error("Failed to generate greeting");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error generating greeting:", error);
//             return null;
//         }
//     }, []);

//     const playGreeting = useCallback(async (audioUrl: string) => {
//         console.log("Playing greeting");
//         const audio = new Audio(audioUrl);
//         await audio.play();
//         return new Promise((resolve) => {
//             audio.onended = resolve;
//         });
//     }, []);

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const setupAudioProcessing = useCallback((stream: MediaStream) => {
//         console.log("Setting up audio processing");
//         audioContextRef.current = new AudioContext();
//         sourceNodeRef.current =
//             audioContextRef.current.createMediaStreamSource(stream);
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         scriptProcessorRef.current =
//             audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         sourceNodeRef.current.connect(analyserRef.current);
//         analyserRef.current.connect(scriptProcessorRef.current);
//         scriptProcessorRef.current.connect(audioContextRef.current.destination);

//         let silenceStart: number | null = null;
//         const silenceThreshold = 0.01;
//         const silenceDuration = 1000;
//         let isTranscribing = false;

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                     console.log("Silence started at:", silenceStart);
//                 } else if (
//                     Date.now() - silenceStart >= silenceDuration &&
//                     !isTranscribing
//                 ) {
//                     console.log(
//                         "Silence detected for 1 second, triggering transcription"
//                     );
//                     isTranscribing = true;
//                     transcribeAudio().then(() => {
//                         isTranscribing = false;
//                         silenceStart = null;
//                     });
//                 }
//             } else {
//                 silenceStart = null;
//             }
//         };
//     }, []);

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log("Transcription received:", data.result);
//                             setTranscribedText(
//                                 (prevText) => prevText + " " + data.result
//                             );
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (message: any) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);

//             let remoteNumber = "unknown number";
//             if (session) {
//                 if ("request" in session && session.request) {
//                     const fromHeader = session.request.getHeader("From");
//                     if (fromHeader) {
//                         const match = fromHeader.match(/<sip:(.+)@/);
//                         if (match && match[1]) {
//                             remoteNumber = match[1];
//                         }
//                     }
//                 } else if (
//                     "remoteIdentity" in session &&
//                     session.remoteIdentity
//                 ) {
//                     remoteNumber =
//                         session.remoteIdentity.uri.user || "unknown number";
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ callerNumber: remoteNumber }),
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Greeting generated successfully");

//                     if (session && "sendDTMF" in session) {
//                         console.log("Sending greeting audio as DTMF");
//                         session.sendDTMF(data.audioUrl);
//                     } else {
//                         console.error("Unable to send greeting as DTMF");
//                     }
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error generating or sending greeting:", error);
//             }

//             startRecording();
//             console.log("Starting audio recording and processing");

//             console.log("Attempting immediate test transcription");
//             await transcribeAudio();
//         },
//         [userAgent, session, startRecording, transcribeAudio]
//     );

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:",outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);
//         const session = userAgent.invite(outgoingNumber, {});

//     session.on("accepted", handleCallAccepted);

//     session.on("terminated", () => {
//         console.log("Call terminated");
//         userAgent.audioHelper.playOutgoing(false);
//         userAgent.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         stopAllAudioProcessing();
//         onHangup();
//     });

//     setSession(session);
// }, [
//     userAgent,
//     outgoingNumber,
//     onHangup,
//     handleCallAccepted,
//     stopRecording,
//     stopAllAudioProcessing,
// ]);

// const handleIncomingCall = useCallback(
//     (action: "accept" | "decline" | "toVoicemail") => {
//         if (!incomingCall) {
//             console.error("No incoming call to handle");
//             return;
//         }

//         console.log("Handling incoming call:", action);
//         userAgent?.audioHelper.playIncoming(false);

//         switch (action) {
//             case "accept":
//                 console.log("Accepting incoming call");
//                 incomingCall.accept();
//                 setSession(incomingCall);
//                 incomingCall.on("accepted", handleCallAccepted);
//                 break;
//             case "decline":
//                 incomingCall.reject();
//                 break;
//             case "toVoicemail":
//                 incomingCall.toVoicemail?.();
//                 break;
//         }

//         setIncomingCall(null);
//     },
//     [incomingCall, userAgent, handleCallAccepted]
// );

// const handleHangup = useCallback(() => {
//     console.log("Hanging up call");
//     if (session) {
//         session.dispose();
//     }
//     stopAllAudioProcessing();
//     setSession(null);
//     setCallActive(false);
//     setCallEnded(true);
//     onHangup();
// }, [session, onHangup, stopAllAudioProcessing]);

// const toggleMute = useCallback(() => {
//     console.log("Toggling mute");
//     if (session) {
//         if (muted) {
//             session.unmute?.();
//         } else {
//             session.mute?.();
//         }
//         setMuted(!muted);
//     }
// }, [session, muted]);

// const toggleHold = useCallback(() => {
//     console.log("Toggling hold");
//     if (session) {
//         if (held) {
//             session.unhold?.();
//         } else {
//             session.hold?.();
//         }
//         setHeld(!held);
//     }
// }, [session, held]);

// const handlePark = useCallback(() => {
//     console.log("Parking call");
//     if (session) {
//         session.park?.();
//     }
// }, [session]);

// const handleTransfer = useCallback(() => {
//     console.log("Initiating transfer");
//     if (session) {
//         const transferNumber = prompt("Enter the number to transfer to:");
//         if (transferNumber) {
//             console.log("Transferring to:", transferNumber);
//             session.transfer?.(transferNumber);
//         }
//     }
// }, [session]);

// const handleFlip = useCallback(() => {
//     console.log("Initiating flip");
//     if (session) {
//         const flipNumber = prompt("Enter the number to flip to:");
//         if (flipNumber) {
//             console.log("Flipping to:", flipNumber);
//             session.flip?.(flipNumber);
//         }
//     }
// }, [session]);

// const handleDTMF = useCallback(() => {
//     console.log("Sending DTMF");
//     if (session) {
//         const digit = prompt("Enter the DTMF digit:");
//         if (digit) {
//             console.log("Sending DTMF digit:", digit);
//             session.dtmf?.(digit);
//         }
//     }
// }, [session]);

// const adjustVolume = useCallback((direction: number) => {
//     console.log("Adjusting volume:", direction);
//     if (remoteAudioRef.current) {
//         remoteAudioRef.current.volume = Math.min(
//             Math.max(remoteAudioRef.current.volume + direction, 0),
//             1
//         );
//         console.log("New volume:", remoteAudioRef.current.volume);
//     }
// }, []);

// return (
//     <div className="bg-black min-h-screen flex items-center justify-center p-6">
//         <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//             <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//             <audio id="localAudio" hidden muted />
//             {connectionError && (
//                 <div className="text-red-500 text-sm mb-4">
//                     {connectionError}
//                 </div>
//             )}
//             {!isAuthenticated ? (
//                 <div className="auth flex flex-col items-center">
//                     <button
//                         onClick={() => {
//                             console.log("Initiating authentication");
//                             initiateAuth();
//                         }}
//                         className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                     >
//                         Authorize
//                     </button>
//                 </div>
//             ) : (
//                 <>
//                     <h3 className="text-white text-2xl mb-6">
//                         LLPMG WebPhone Dashboard
//                     </h3>
//                     <button
//                         onClick={() => {
//                             console.log("Logging out");
//                             onLogout();
//                         }}
//                         className="text-sm text-gray-400 hover:text-white mb-4"
//                     >
//                         Logout
//                     </button>
//                     {!callActive && (
//                         <div className="outgoing-call mt-4">
//                             <h4 className="text-white text-xl mb-3">
//                                 Outgoing Call
//                             </h4>
//                             <input
//                                 type="text"
//                                 value={outgoingNumber}
//                                 onChange={(e) => {
//                                     console.log(
//                                         "Outgoing number changed:",
//                                         e.target.value
//                                     );
//                                     setOutgoingNumber(e.target.value);
//                                 }}
//                                 placeholder="+1 234 567-8900"
//                                 className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                             />
//                             <button
//                                 onClick={() => {
//                                     console.log("Initiating outgoing call");
//                                     handleOutgoingCall();
//                                 }}
//                                 className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                             >
//                                 Call
//                             </button>
//                         </div>
//                     )}
//                     {callActive && (
//                         <div className="active-call mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 Call In Progress
//                             </h4>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <button
//                                     onClick={toggleMute}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     {muted ? "Unmute" : "Mute"}
//                                 </button>
//                                 <button
//                                     onClick={toggleHold}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     {held ? "Unhold" : "Hold"}
//                                 </button>
//                                 <button
//                                     onClick={handlePark}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     Park
//                                 </button>
//                                 <button
//                                     onClick={handleTransfer}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     Transfer
//                                 </button>
//                                 <button
//                                     onClick={handleFlip}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     Flip
//                                 </button>
//                                 <button
//                                     onClick={handleDTMF}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     Send DTMF
//                                 </button>
//                                 <button
//                                     onClick={() => adjustVolume(0.1)}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     + Volume
//                                 </button>
//                                 <button
//                                     onClick={() => adjustVolume(-0.1)}
//                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                 >
//                                     - Volume
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         console.log("Hanging up call");
//                                         handleHangup();
//                                     }}
//                                     className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Hang Up
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                     {(callActive || callEnded) && (
//                         <div className="transcription mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 {callEnded
//                                     ? "Call Transcription"
//                                     : "Live Transcription"}
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                 {transcribedText ||
//                                     "Transcription will appear here..."}
//                             </div>
//                         </div>
//                     )}
//                     {callEnded && recordedAudio && (
//                         <div className="recorded-audio mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 Recorded Audio
//                             </h4>
//                             <audio
//                                 controls
//                                 src={recordedAudio}
//                                 className="w-full"
//                             />
//                         </div>
//                     )}
//                     {incomingCall && (
//                         <div className="incoming-call mt-6">
//                             <h3 className="text-white text-xl mb-3">
//                                 Incoming Call
//                             </h3>
//                             <div className="grid grid-cols-3 gap-2">
//                                 <button
//                                     onClick={() => {
//                                         console.log(
//                                             "Accepting incoming call"
//                                         );
//                                         handleIncomingCall("accept");
//                                     }}
//                                     className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Answer
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         console.log(
//                                             "Declining incoming call"
//                                         );
//                                         handleIncomingCall("decline");
//                                     }}
//                                     className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Decline
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         console.log(
//                                             "Sending incoming call to voicemail"
//                                         );
//                                         handleIncomingCall("toVoicemail");
//                                     }}
//                                     className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     To Voicemail
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     </div>
// );};
// export default SipSpeechComponent;

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // import { Session } from "sip.js";
// import { RequestOptions, Session, fromBodyLegacy } from "sip.js/lib/core";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const gainNodeRef = useRef<GainNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     const [getGreeting, setGetGreeting] = useState(false);

//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 console.log("Generating greeting for caller:", callerNumber);
//                 const payload = {
//                     callerNumber: { remoteNumber: callerNumber },
//                 };
//                 console.log(
//                     "Payload being sent to generate-greeting API:",
//                     payload
//                 );

//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     console.error(
//                         "Failed to generate greeting. Status:",
//                         response.status,
//                         "Error:",
//                         errorText
//                     );
//                     return null;
//                 }

//                 const data = await response.json();
//                 console.log("Greeting API response:", data);

//                 return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     // const sendGreeting = useCallback(
//     //     async (audioUrl: string) => {
//     //         if (session && session.info) {
//     //             console.log("Sending greeting audio URL to phone:", audioUrl);

//     //             const requestOptions: RequestOptions = {
//     //                 body: fromBodyLegacy({
//     //                     body: JSON.stringify({
//     //                         url: audioUrl,
//     //                         type: "audio/mpeg",
//     //                     }),
//     //                     contentType: "application/json",
//     //                 }),
//     //             };

//     //             try {
//     //                 console.log("Sending INFO request with greeting...");
//     //                 const response = await session.info({ requestOptions });
//     //                 console.log("INFO request response:", response);
//     //                 console.log("Greeting sent back to the phone");
//     //                 setIsGreetingPlaying(true);

//     //                 // Simulate greeting playback time (adjust as needed)
//     //                 await new Promise((resolve) => setTimeout(resolve, 10000)); // Increased to 10 seconds

//     //                 setIsGreetingPlaying(false);
//     //                 console.log("Greeting playback simulation ended");
//     //             } catch (error) {
//     //                 console.error(
//     //                     "Error sending greeting to the phone:",
//     //                     error
//     //                 );
//     //             }
//     //         } else {
//     //             console.error("Session or session.info is not available");
//     //         }
//     //     },
//     //     [session]
//     // );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         if (!audioContextRef.current) {
//             audioContextRef.current = new (window.AudioContext ||
//                 (window as any).webkitAudioContext)();
//         }

//         const context = audioContextRef.current;

//         if (!gainNodeRef.current) {
//             gainNodeRef.current = context.createGain();
//             gainNodeRef.current.connect(context.destination);
//             gainNodeRef.current.gain.value = 0;
//         }

//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const audioBuffer = await context.decodeAudioData(arrayBuffer);

//         const soundSource = context.createBufferSource();
//         soundSource.buffer = audioBuffer;
//         soundSource.start(0);
//         soundSource.connect(gainNodeRef.current);

//         const destination = context.createMediaStreamDestination();
//         soundSource.connect(destination);

//         return destination.stream;
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (message: any) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);

//             // let remoteNumber = "unknown number";
//             // if (session) {
//             //     if ("request" in session && session.request) {
//             //         const fromHeader = session.request.getHeader("From");
//             //         if (fromHeader) {
//             //             const match = fromHeader.match(/<sip:(.+)@/);
//             //             if (match && match[1]) {
//             //                 remoteNumber = match[1];
//             //             }
//             //         }
//             //     } else if (
//             //         "remoteIdentity" in session &&
//             //         session.remoteIdentity
//             //     ) {
//             //         remoteNumber =
//             //             session.remoteIdentity.uri.user || "unknown number";
//             //     }
//             // }
//             const callerNumber = message.from.uri.normal.user;
//             console.log("Caller number:", callerNumber);

//             const remoteNumber = callerNumber;
//             console.log("Remote number (caller):", remoteNumber);

//             try {
//                 // const initialGreetingStream = await playAudioFile(
//                 //     "/llpmg/audio/incoming.ogg"
//                 // );
//                 // await sendAudioStream(initialGreetingStream);

//                 // const greetingResponse = await fetch(
//                 //     "/api/llpmg/generate-greeting",
//                 //     {
//                 //         method: "POST",
//                 //         headers: { "Content-Type": "application/json" },
//                 //         body: JSON.stringify({ callerNumber: remoteNumber }),
//                 //     }
//                 // );

//                 // if (greetingResponse.ok) {
//                 //     const { audioUrl } = await greetingResponse.json();
//                 //     const greetingStream = await playAudioFile(audioUrl);
//                 //     await sendAudioStream(greetingStream);
//                 // } else {
//                 //     console.error("Failed to generate greeting");
//                 // }

//                 const audioUrl = await generateGreeting(callerNumber);
//                 if (audioUrl) {
//                     console.log("Greeting audio URL generated:", audioUrl);
//                     setGreetingAudioUrl(audioUrl);
//                     startRecording();
//                     console.log("Starting audio recording and processing");

//                     console.log("Attempting immediate test transcription");
//                     await transcribeAudio();
//                     // Play the greeting
//                     console.log("Playing greeting");
//                     const audio = new Audio(audioUrl);
//                     await audio.play();
//                     console.log("Greeting browser playback completed");
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error in call acceptance process:", error);
//             }
//         },
//         [userAgent, session, playAudioFile]
//     );

//     const sendAudioStream = useCallback(
//         (stream: MediaStream) => {
//             return new Promise<void>((resolve) => {
//                 if (session && "sessionDescriptionHandler" in session) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );
//                     if (sender) {
//                         sender.replaceTrack(stream.getAudioTracks()[0]);
//                         stream.getAudioTracks()[0].onended = () => {
//                             resolve();
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                         resolve();
//                     }
//                 } else {
//                     console.error(
//                         "Session or sessionDescriptionHandler not available"
//                     );
//                     resolve();
//                 }
//             });
//         },
//         [session]
//     );

//     // const startRecording = useCallback(() => {
//     //     console.log("Starting recording");
//     //     recordedChunksRef.current = [];
//     //     const remoteAudio = remoteAudioRef.current;

//     //     if (remoteAudio && remoteAudio.srcObject) {
//     //         console.log("Remote audio source found");
//     //         const mediaRecorder = new MediaRecorder(remoteAudio.srcObject as MediaStream);

//     //         mediaRecorder.ondataavailable = (event) => {
//     //             if (event.data.size > 0) {
//     //                 recordedChunksRef.current.push(event.data);
//     //             }
//     //         };

//     //         mediaRecorder.start();
//     //         mediaRecorderRef.current = mediaRecorder;
//     //     } else {
//     //         console.error("Remote audio source not found");
//     //     }
//     // }, []);

//     // const stopRecording = useCallback(() => {
//     //     console.log("Stopping recording");
//     //     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//     //         mediaRecorderRef.current.stop();
//     //         mediaRecorderRef.current.onstop = () => {
//     //             const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
//     //             const audioUrl = URL.createObjectURL(audioBlob);
//     //             setRecordedAudio(audioUrl);
//     //             console.log("Audio recording saved");
//     //         };
//     //     }
//     // }, []);

//     // const transcribeAudio = useCallback(async () => {
//     //     console.log("Transcribing audio");
//     //     if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//     //         console.error("Remote audio source not available for transcription");
//     //         return;
//     //     }

//     //     const stream = remoteAudioRef.current.srcObject as MediaStream;
//     //     const recorder = new MediaRecorder(stream);
//     //     const chunks: Blob[] = [];

//     //     recorder.ondataavailable = (event) => {
//     //         chunks.push(event.data);
//     //     };

//     //     recorder.onstop = async () => {
//     //         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//     //         const reader = new FileReader();
//     //         reader.readAsDataURL(audioBlob);
//     //         reader.onloadend = async () => {
//     //             if (typeof reader.result === "string") {
//     //                 const base64Audio = reader.result.split(",")[1];
//     //                 try {
//     //                     console.log("Sending audio to transcription API");
//     //                     const response = await fetch("/api/llpmg/speech-to-text", {
//     //                         method: "POST",
//     //                         headers: { "Content-Type": "application/json" },
//     //                         body: JSON.stringify({ audio: base64Audio }),
//     //                     });
//     //                     console.log("Transcription API response status:", response.status);
//     //                     if (response.ok) {
//     //                         const data = await response.json();
//     //                         console.log("Transcription received:", data.result);
//     //                         setTranscribedText((prevText) => {
//     //                             const newText = prevText + " " + data.result;
//     //                             return newText.trim();
//     //                         });
//     //                     } else {
//     //                         console.error("Failed to transcribe audio", await response.text());
//     //                     }
//     //                 } catch (error) {
//     //                     console.error("Error transcribing audio:", error);
//     //                 }
//     //             }
//     //         };
//     //     };

//     //     recorder.start();
//     //     setTimeout(() => recorder.stop(), 5000);
//     // }, []);

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log(
//                                 "Raw transcription received:",
//                                 data.result
//                             );
//                             const filteredTranscription = filterTranscription(
//                                 data.result
//                             );
//                             console.log(
//                                 "Filtered transcription:",
//                                 filteredTranscription
//                             );

//                             if (filteredTranscription) {
//                                 bufferRef.current.push(filteredTranscription);
//                                 if (
//                                     bufferRef.current.join(" ").split(" ")
//                                         .length >= 10
//                                 ) {
//                                     const newTranscription =
//                                         bufferRef.current.join(" ");
//                                     if (
//                                         newTranscription !==
//                                         lastTranscriptionRef.current
//                                     ) {
//                                         setTranscribedText(
//                                             (prevText) =>
//                                                 prevText +
//                                                 " " +
//                                                 newTranscription
//                                         );
//                                         lastTranscriptionRef.current =
//                                             newTranscription;
//                                         bufferRef.current = [];
//                                     }
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }

//         //     console.log("Recording started");
//         //     try {
//         //       const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         //       const speakerStream = await (navigator as any).mediaDevices.getDisplayMedia({
//         //         audio: true,
//         //         video: false,
//         //       });

//         //       const audioContext = new (window as any).AudioContext();
//         //       const micSource = audioContext.createMediaStreamSource(audioStream);
//         //       const speakerSource = audioContext.createMediaStreamSource(speakerStream);

//         //       const destination = audioContext.createMediaStreamDestination();
//         //       micSource.connect(destination);
//         //       speakerSource.connect(destination);

//         //       setIsRecording(true);
//         //       setStream(destination.stream);

//         //       const mimeTypes = ["audio/mp4", "audio/webm"].filter((type) =>
//         //         MediaRecorder.isTypeSupported(type)
//         //       );

//         //       if (mimeTypes.length === 0) {
//         //         return alert("Browser not supported");
//         //       }

//         //       setTimerInterval(
//         //         setInterval(() => {
//         //           setTranscriptLength((t) => t + 1);
//         //         }, 1000)
//         //       );

//         //       let recorder = new MediaRecorder(destination.stream, { mimeType: mimeTypes[0] });

//         //       recorder.addEventListener("dataavailable", async (event) => {
//         //         if (event.data.size > 0 && socket.current?.connected) {
//         //           socket.current?.emit("audio", { roomId: props.roomId, data: event.data });
//         //         }
//         //       });

//         //       recorder.start(1000);
//         //     } catch (error) {
//         //       console.error("Error accessing media devices:", error);
//         //     }
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     //     const startRecording = useCallback(() => {
//     //     console.log("Starting recording");
//     //     recordedChunksRef.current = [];
//     //     const remoteAudio = remoteAudioRef.current;

//     //     if (remoteAudio && remoteAudio.srcObject) {
//     //         console.log("Remote audio source found");
//     //         const mediaRecorder = new MediaRecorder(
//     //             remoteAudio.srcObject as MediaStream
//     //         );

//     //         mediaRecorder.ondataavailable = (event) => {
//     //             if (event.data.size > 0) {
//     //                 recordedChunksRef.current.push(event.data);
//     //             }
//     //         };

//     //         mediaRecorder.start();
//     //         mediaRecorderRef.current = mediaRecorder;
//     //         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     //     } else {
//     //         console.error("Remote audio source not found");
//     //     }
//     // }, []);

//     // const stopRecording = useCallback(() => {
//     //     console.log("Stopping recording");
//     //     if (
//     //         mediaRecorderRef.current &&
//     //         mediaRecorderRef.current.state !== "inactive"
//     //     ) {
//     //         mediaRecorderRef.current.stop();
//     //         mediaRecorderRef.current.onstop = () => {
//     //             const audioBlob = new Blob(recordedChunksRef.current, {
//     //                 type: "audio/webm",
//     //             });
//     //             const audioUrl = URL.createObjectURL(audioBlob);
//     //             setRecordedAudio(audioUrl);
//     //             console.log("Audio recording saved");
//     //         };
//     //     }
//     // }, []);

//     //     const startRecording = useCallback(() => {
//     //     console.log("Starting recording");
//     //     recordedChunksRef.current = [];
//     //     const remoteAudio = remoteAudioRef.current;

//     //     if (remoteAudio && remoteAudio.srcObject) {
//     //         console.log("Remote audio source found");
//     //         const mediaRecorder = new MediaRecorder(
//     //             remoteAudio.srcObject as MediaStream
//     //         );

//     //         mediaRecorder.ondataavailable = (event) => {
//     //             if (event.data.size > 0) {
//     //                 recordedChunksRef.current.push(event.data);
//     //             }
//     //         };

//     //         mediaRecorder.start();
//     //         mediaRecorderRef.current = mediaRecorder;
//     //         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     //     } else {
//     //         console.error("Remote audio source not found");
//     //     }
//     // }, []);

//     // const stopRecording = useCallback(() => {
//     //     console.log("Stopping recording");
//     //     if (
//     //         mediaRecorderRef.current &&
//     //         mediaRecorderRef.current.state !== "inactive"
//     //     ) {
//     //         mediaRecorderRef.current.stop();
//     //         mediaRecorderRef.current.onstop = () => {
//     //             const audioBlob = new Blob(recordedChunksRef.current, {
//     //                 type: "audio/webm",
//     //             });
//     //             const audioUrl = URL.createObjectURL(audioBlob);
//     //             setRecordedAudio(audioUrl);
//     //             console.log("Audio recording saved");
//     //         };
//     //     }
//     // }, []);

//     // const handleCallAccepted = useCallback(
//     //     async (message: any) => {
//     //         console.log("Call accepted - User has answered the call");
//     //         console.log(
//     //             "Telephony Session Info:",
//     //             message.headers["P-Rc-Api-Ids"] ||
//     //                 message.headers["p-rc-api-ids"]
//     //         );
//     //         userAgent?.audioHelper.playOutgoing(false);
//     //         userAgent?.audioHelper.playIncoming(false);
//     //         setCallActive(true);
//     //         setCallEnded(false);

//     //         const callerNumber = message.from.uri.normal.user;
//     //         console.log("Caller number:", callerNumber);

//     //         const remoteNumber = callerNumber

//     //         try {

//     //             const initialGreetingStream = await playAudioFile(
//     //                 "/llpmg/audio/incoming.ogg"
//     //             );
//     //             await sendAudioStream(initialGreetingStream);

//     //         //     const audioUrl = await generateGreeting(callerNumber);
//     //         // if (audioUrl) {
//     //         //     console.log("Greeting audio URL generated:", audioUrl);
//     //         //     setGreetingAudioUrl(audioUrl);
//     //         // } else {
//     //         //     console.error("Failed to generate greeting");
//     //         // }

//     //             const greetingResponse = await fetch(
//     //                 "/api/llpmg/generate-greeting",
//     //                 {
//     //                     method: "POST",
//     //                     headers: { "Content-Type": "application/json" },
//     //                     body: JSON.stringify({ callerNumber: remoteNumber }),
//     //                 }
//     //             );

//     //             if (greetingResponse.ok) {
//     //                 const { audioUrl } = await greetingResponse.json();
//     //                 const greetingStream = await playAudioFile(audioUrl);
//     //                 await sendAudioStream(greetingStream);
//     //             } else {
//     //                 console.error("Failed to generate greeting");
//     //             }

//     //             startRecording();
//     //             console.log("Starting audio recording and processing");

//     //             console.log("Attempting immediate test transcription");
//     //             await transcribeAudio();
//     //         } catch (error) {
//     //             console.error("Error in call acceptance process:", error);
//     //         }
//     //         // Add a slight delay before generating and sending the greeting
//     //         // await new Promise((resolve) => setTimeout(resolve, 2000));

//     //         // const audioUrl = await generateGreeting(callerNumber);
//     //         // if (audioUrl) {
//     //         //     console.log("Greeting audio URL generated:", audioUrl);
//     //         //     setGreetingAudioUrl(audioUrl);
//     //         // } else {
//     //         //     console.error("Failed to generate greeting");
//     //         // }

//     //         // startRecording();
//     //     },
//     //     [userAgent, generateGreeting, startRecording]
//     // );

//     // const handleCallTerminated = useCallback(() => {
//     //     console.log("Call terminated");
//     //     userAgent?.audioHelper.playOutgoing(false);
//     //     userAgent?.audioHelper.playIncoming(false);
//     //     setCallActive(false);
//     //     setCallEnded(true);
//     //     stopRecording();
//     //     if (audioContextRef.current) {
//     //         audioContextRef.current.close();
//     //     }
//     //     onHangup();
//     // }, [userAgent, onHangup, stopRecording]);

//     // const handleOutgoingCall = useCallback(() => {
//     //     if (!userAgent || !outgoingNumber) {
//     //         console.error("UserAgent or outgoing number is missing");
//     //         setConnectionError("Please enter a valid phone number");
//     //         return;
//     //     }

//     //     console.log("Placing call to:", outgoingNumber);
//     //     userAgent.audioHelper.playOutgoing(true);

//     //     const session = userAgent.invite(outgoingNumber, {});

//     //     session.on("accepted", handleCallAccepted);
//     //     session.on("terminated", handleCallTerminated);

//     //     setSession(session);
//     //     setCallActive(true);
//     //     setCallEnded(false);
//     // }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     // const handleOutgoingCall = useCallback(() => {
//     //     if (!userAgent || !outgoingNumber) {
//     //         console.error("UserAgent or outgoing number is missing");
//     //         setConnectionError("Please enter a valid phone number");
//     //         return;
//     //     }

//     //     console.log("Placing call to:", outgoingNumber);
//     //     userAgent.audioHelper.playOutgoing(true);

//     //     const newSession = userAgent.invite(outgoingNumber, {});

//     //     newSession.on("accepted", handleCallAccepted);

//     //     newSession.on("terminated", () => {
//     //         console.log("Call terminated");
//     //         userAgent.audioHelper.playOutgoing(false);
//     //         userAgent.audioHelper.playIncoming(false);
//     //         setCallActive(false);
//     //         setCallEnded(true);
//     //         stopRecording();
//     //         stopAudioProcessing();
//     //         onHangup();
//     //     });

//     //     setSession(newSession);
//     // }, [
//     //     userAgent,
//     //     outgoingNumber,
//     //     handleCallAccepted,
//     //     onHangup,
//     //     stopRecording,
//     // ]);

//     // const handleIncomingCall = useCallback((action: "accept" | "decline" | "toVoicemail") => {
//     //     if (!incomingCall) {
//     //         console.error("No incoming call to handle");
//     //         return;
//     //     }

//     //     console.log("Handling incoming call:", action);
//     //     userAgent?.audioHelper.playIncoming(false);

//     //     switch (action) {
//     //         case "accept":
//     //             console.log("Accepting incoming call");
//     //             incomingCall.accept();
//     //             setSession(incomingCall);
//     //             incomingCall.on("accepted", handleCallAccepted);
//     //             break;
//     //         case "decline":
//     //             incomingCall.reject();
//     //             break;
//     //         case "toVoicemail":
//     //             if ('toVoicemail' in incomingCall) {
//     //                 incomingCall.toVoicemail();
//     //             } else {
//     //                 console.error("toVoicemail method not available on incomingCall");
//     //             }
//     //             break;
//     //     }

//     //     setIncomingCall(null);
//     // }, [incomingCall, userAgent, handleCallAccepted]);

//     // const handleIncomingCall = useCallback(
//     //     (action: "accept" | "decline" | "toVoicemail") => {
//     //         if (!incomingCall) {
//     //             console.error("No incoming call to handle");
//     //             return;
//     //         }

//     //         console.log("Handling incoming call:", action);
//     //         userAgent?.audioHelper.playIncoming(false);

//     //         switch (action) {
//     //             case "accept":
//     //                 console.log("Accepting incoming call");
//     //                 incomingCall.accept();
//     //                 setSession(incomingCall);
//     //                 incomingCall.on("accepted", handleCallAccepted);
//     //                 break;
//     //             case "decline":
//     //                 incomingCall.reject();
//     //                 break;
//     //             case "toVoicemail":
//     //                 incomingCall.toVoicemail?.();
//     //                 break;
//     //         }

//     //         setIncomingCall(null);
//     //     },
//     //     [incomingCall, userAgent, handleCallAccepted]
//     // );

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const session = userAgent.invite(outgoingNumber, {});

//         session.on("accepted", handleCallAccepted);
//         session.on("terminated", handleCallTerminated);

//         setSession(session);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     // const adjustVolume = useCallback((direction: number) => {
//     //     console.log("Adjusting volume:", direction);
//     //     if (remoteAudioRef.current) {
//     //         remoteAudioRef.current.volume = Math.min(
//     //             Math.max(remoteAudioRef.current.volume + direction, 0),
//     //             1
//     //         );
//     //         console.log("New volume:", remoteAudioRef.current.volume);
//     //     }
//     // }, []);

//     const adjustVolume = useCallback((direction: number) => {
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     const stopAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//             audioContextRef.current = null;
//         }
//         if (gainNodeRef.current) {
//             gainNodeRef.current.disconnect();
//             gainNodeRef.current = null;
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     // const startRecording = async (id: string) => {
//     //     console.log("Recording started");
//     //     try {
//     //       const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     //       const speakerStream = await (navigator as any).mediaDevices.getDisplayMedia({
//     //         audio: true,
//     //         video: false,
//     //       });

//     //       const audioContext = new (window as any).AudioContext();
//     //       const micSource = audioContext.createMediaStreamSource(audioStream);
//     //       const speakerSource = audioContext.createMediaStreamSource(speakerStream);

//     //       const destination = audioContext.createMediaStreamDestination();
//     //       micSource.connect(destination);
//     //       speakerSource.connect(destination);

//     //       setIsRecording(true);
//     //       setStream(destination.stream);

//     //       const mimeTypes = ["audio/mp4", "audio/webm"].filter((type) =>
//     //         MediaRecorder.isTypeSupported(type)
//     //       );

//     //       if (mimeTypes.length === 0) {
//     //         return alert("Browser not supported");
//     //       }

//     //       setTimerInterval(
//     //         setInterval(() => {
//     //           setTranscriptLength((t) => t + 1);
//     //         }, 1000)
//     //       );

//     //       let recorder = new MediaRecorder(destination.stream, { mimeType: mimeTypes[0] });

//     //       recorder.addEventListener("dataavailable", async (event) => {
//     //         if (event.data.size > 0 && socket.current?.connected) {
//     //           socket.current?.emit("audio", { roomId: props.roomId, data: event.data });
//     //         }
//     //       });

//     //       recorder.start(1000);
//     //     } catch (error) {
//     //       console.error("Error accessing media devices:", error);
//     //     }
//     //   };

//     //   const stopRecording = () => {
//     //     if (stream) {
//     //       stream.getTracks().forEach((track) => track.stop());
//     //     }
//     //     setIsRecording(false);
//     //     clearInterval(timerInterval!);
//     //     socket.current?.emit("stop-transcript", { roomId: props.roomId });
//     //     console.log("Recording stopped");
//     //   };

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default SipSpeechComponent;

// not done
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import {
//     WebPhoneSession,
//     WebPhoneInvitation,
//     patchWebphoneSession,
// } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { NameAddrHeader, Session } from "sip.js/lib/core";
// import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const [loadedSession, setLoadedSession] = useState<WebPhoneSession | null>(
//         null
//     );

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const gainNodeRef = useRef<GainNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     const [getGreeting, setGetGreeting] = useState(false);

//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     const sessionRef = useRef<WebPhoneSession | null>(null);

//     useEffect(() => {
//         sessionRef.current = session;
//     }, [session]);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     // const generateGreeting = useCallback(
//     //     async (callerNumber: string): Promise<string | null> => {
//     //         try {
//     //             console.log("Generating greeting for caller:", callerNumber);
//     //             const payload = {
//     //                 callerNumber: { remoteNumber: callerNumber },
//     //             };
//     //             console.log(
//     //                 "Payload being sent to generate-greeting API:",
//     //                 payload
//     //             );

//     //             const response = await fetch("/api/llpmg/generate-greeting", {
//     //                 method: "POST",
//     //                 headers: {
//     //                     "Content-Type": "application/json",
//     //                 },
//     //                 body: JSON.stringify(payload),
//     //             });

//     //             if (!response.ok) {
//     //                 const errorText = await response.text();
//     //                 console.error(
//     //                     "Failed to generate greeting. Status:",
//     //                     response.status,
//     //                     "Error:",
//     //                     errorText
//     //                 );
//     //                 return null;
//     //             }

//     //             const data = await response.json();
//     //             console.log("Greeting API response:", data);

//     //             return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//     //         } catch (error) {
//     //             console.error("Error generating greeting:", error);
//     //             return null;
//     //         }
//     //     },
//     //     []
//     // );

//     const playAudioToRemote = useCallback(
//         async (audioUrl: string, currentSession: WebPhoneSession) => {
//             let session = currentSession;

//             console.log("SESSION IN AUDIO TO REMOTE: >>>>\n", loadedSession);

//             if (!session) {
//                 console.error("No active session to play audio to");
//                 return;
//             }

//             try {
//                 const response = await fetch(audioUrl);
//                 const arrayBuffer = await response.arrayBuffer();

//                 const audioContext = new AudioContext();
//                 const audioBuffer =
//                     await audioContext.decodeAudioData(arrayBuffer);

//                 const source = audioContext.createBufferSource();
//                 source.buffer = audioBuffer;

//                 const destination = audioContext.createMediaStreamDestination();
//                 source.connect(destination);

//                 console.dir(session);

//                 // patchWebphoneSession(session).addTrack()

//                 if (
//                     "sessionDescriptionHandler" in session &&
//                     session.sessionDescriptionHandler
//                 ) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as SessionDescriptionHandler
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );

//                     if (sender) {
//                         const newTrack = destination.stream.getAudioTracks()[0];
//                         await sender.replaceTrack(newTrack);

//                         source.start(0);
//                         source.onended = () => {
//                             // Restore the original track after playing
//                             const originalTrack =
//                                 remoteAudioRef.current?.srcObject instanceof
//                                 MediaStream
//                                     ? remoteAudioRef.current.srcObject.getAudioTracks()[0]
//                                     : null;
//                             if (originalTrack) {
//                                 sender.replaceTrack(originalTrack);
//                             }
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                     }
//                 } else {
//                     console.error("Session description handler not available");
//                 }
//             } catch (error) {
//                 console.error("Error playing audio to remote:", error);
//             }
//         },
//         [session]
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         if (!audioContextRef.current) {
//             audioContextRef.current = new (window.AudioContext ||
//                 (window as any).webkitAudioContext)();
//         }

//         const context = audioContextRef.current;

//         if (!gainNodeRef.current) {
//             gainNodeRef.current = context.createGain();
//             gainNodeRef.current.connect(context.destination);
//             gainNodeRef.current.gain.value = 0;
//         }

//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const audioBuffer = await context.decodeAudioData(arrayBuffer);

//         const soundSource = context.createBufferSource();
//         soundSource.buffer = audioBuffer;
//         soundSource.start(0);
//         soundSource.connect(gainNodeRef.current);

//         const destination = context.createMediaStreamDestination();
//         soundSource.connect(destination);

//         return destination.stream;
//     }, []);

//     // const handleCallAccepted = useCallback(
//     //     async (message: any) => {
//     //         console.log("Call accepted - User has answered the call");
//     //         console.log(
//     //             "Telephony Session Info:",
//     //             message.headers["P-Rc-Api-Ids"] ||
//     //                 message.headers["p-rc-api-ids"]
//     //         );
//     //         userAgent?.audioHelper.playOutgoing(false);
//     //         userAgent?.audioHelper.playIncoming(false);
//     //         setCallActive(true);
//     //         setCallEnded(false);

//     //         const callerNumber = message.from.uri.normal.user;
//     //         console.log("Caller number:", callerNumber);

//     //         const remoteNumber = callerNumber;
//     //         console.log("Remote number (caller):", remoteNumber);

//     //         try {
//     //             const audioUrl = await generateGreeting(callerNumber);
//     //             if (audioUrl) {
//     //                 console.log("Greeting audio URL generated:", audioUrl);
//     //                 setGreetingAudioUrl(audioUrl);
//     //                 startRecording();
//     //                 console.log("Starting audio recording and processing");

//     //                 console.log("Attempting immediate test transcription");
//     //                 await transcribeAudio();
//     //                 // Play the greeting
//     //                 console.log("Playing greeting");
//     //                 const audio = new Audio(audioUrl);
//     //                 await audio.play();
//     //                 console.log("Greeting browser playback completed");
//     //             } else {
//     //                 console.error("Failed to generate greeting");
//     //             }
//     //         } catch (error) {
//     //             console.error("Error in call acceptance process:", error);
//     //         }
//     //     },
//     //     [userAgent, session, playAudioFile]
//     // );

//     const sendAudioStream = useCallback(
//         (stream: MediaStream) => {
//             return new Promise<void>((resolve) => {
//                 if (session && "sessionDescriptionHandler" in session) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );
//                     if (sender) {
//                         sender.replaceTrack(stream.getAudioTracks()[0]);
//                         stream.getAudioTracks()[0].onended = () => {
//                             resolve();
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                         resolve();
//                     }
//                 } else {
//                     console.error(
//                         "Session or sessionDescriptionHandler not available"
//                     );
//                     resolve();
//                 }
//             });
//         },
//         [session]
//     );

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         // if (response.ok) {
//                         //     const data = await response.json();
//                         //     console.log(
//                         //         "Raw transcription received:",
//                         //         data.result
//                         //     );
//                         //     const filteredTranscription = filterTranscription(
//                         //         data.result
//                         //     );
//                         //     console.log(
//                         //         "Filtered transcription:",
//                         //         filteredTranscription
//                         //     );

//                         //     if (filteredTranscription) {
//                         //         setTranscribedText(
//                         //             (prevText) =>
//                         //                 prevText + " " + filteredTranscription
//                         //         );
//                         //     }
//                         // }

//                         if (response.ok) {
//                             const data = await response.json();
//                             if (data.confidence && data.confidence > 0.7) {
//                                 // Adjust threshold as needed
//                                 const filteredTranscription =
//                                     filterTranscription(data.result);
//                                 if (filteredTranscription) {
//                                     setTranscribedText(
//                                         (prevText) =>
//                                             prevText +
//                                             " " +
//                                             filteredTranscription
//                                     );
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);

//         // Continue transcribing
//         setTimeout(transcribeAudio, 6000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }
//     }, []);

//     // const handleCallAccepted = useCallback(
//     //     async (message: any) => {
//     //         console.log("Call accepted - User has answered the call");
//     //         userAgent?.audioHelper.playOutgoing(false);
//     //         userAgent?.audioHelper.playIncoming(false);
//     //         setCallActive(true);
//     //         setCallEnded(false);

//     //         const callerNumber = message.from.uri.normal.user;
//     //         console.log("Caller number:", callerNumber);

//     //         try {
//     //             // const greetingUrl = await generateGreeting(callerNumber);
//     //             const greetingUrl = "/llpmg/audio/incoming.ogg";
//     //             if (greetingUrl) {
//     //                 console.log("Greeting audio URL generated:", greetingUrl);
//     //                 setGreetingAudioUrl(greetingUrl);

//     //                 // Play the greeting to the remote party
//     //                 await playAudioToRemote(greetingUrl);

//     //                 startRecording();
//     //                 console.log("Starting audio recording and processing");

//     //                 // Start transcription after a short delay to allow the greeting to finish
//     //                 setTimeout(() => {
//     //                     transcribeAudio();
//     //                 }, 5000); // Adjust this delay based on your greeting length
//     //             }
//     //             // else {
//     //             //     console.error("Failed to generate greeting");
//     //             // }
//     //         } catch (error) {
//     //             console.error("Error in call acceptance process:", error);
//     //         }
//     //     },
//     //     [
//     //         userAgent,
//     //         // generateGreeting,
//     //         playAudioToRemote,
//     //         startRecording,
//     //         transcribeAudio,
//     //     ]
//     // );

//     const handleCallAccepted = useCallback(
//         async (newSession: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(newSession);
//             // if (!session) {
//             //     throw Error("no session yet");
//             //     // setSession(newSession); // Set the session here
//             // }
//             // const theNewSession = await newSession;
//             // setSession(theNewSession); // Set the session here
//             // console.log("SESSION IN ACCEPTED CALL: >>>>\n", session);

//             // const callerNumber = newSession.remoteIdentity.uri.user;
//             // const theNewSession = await newSession
//             //                 setSession(theNewSession); // Set the session here
//             // const callerNumber = session.remoteIdentity.uri.user as string;

//             console.log("NEW SESSION DATA: >>>>\n", newSession);

//             // const callerNumber = newSession.remoteIdentity.uri.user as string;
//             // const callerNumber = newSession.from.uri.normal.user as string;

//             // const { from }: NameAddrHeader = newSession
//             const fromDetails = newSession.message;

//             console.log("FROM DETAILS: >>>>\n", fromDetails);
//             // @ts-ignore
//             const callerNumber = newSession.from.uri.normal.user as string;

//             console.log("Caller number:", callerNumber);

//             try {
//                 const greetingUrl = "/llpmg/audio/incoming.ogg";
//                 console.log("Greeting audio URL:", greetingUrl);
//                 setGreetingAudioUrl(greetingUrl);

//                 // Wait for the session to be set before playing audio
//                 setTimeout(
//                     () => playAudioToRemote(greetingUrl, newSession),
//                     100
//                 );

//                 startRecording();
//                 console.log("Starting audio recording and processing");

//                 setTimeout(() => {
//                     transcribeAudio();
//                 }, 5000);
//             } catch (error) {
//                 console.error("Error in call acceptance process:", error);
//             }
//         },
//         [userAgent, playAudioToRemote, startRecording, transcribeAudio]
//     );

//     useEffect(() => {
//         if (!session) {
//             console.log("SESSION DATA NOT LOADED: >>>> \n", session);
//         }
//         console.log("LOADED SESSION DATA: >>>>\n", session);
//         setLoadedSession(session);
//     }, [session, playAudioToRemote, handleCallAccepted]);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     // const handleOutgoingCall = useCallback(() => {
//     //     if (!userAgent || !outgoingNumber) {
//     //         console.error("UserAgent or outgoing number is missing");
//     //         setConnectionError("Please enter a valid phone number");
//     //         return;
//     //     }

//     //     console.log("Placing call to:", outgoingNumber);
//     //     userAgent.audioHelper.playOutgoing(true);

//     //     const session = userAgent.invite(outgoingNumber, {});

//     //     session.on("accepted", handleCallAccepted);
//     //     session.on("terminated", handleCallTerminated);

//     //     setSession(session);
//     //     setCallActive(true);
//     //     setCallEnded(false);
//     // }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.stateChange.addListener((newState) => {
//             console.log(`Session state changed to ${newState}`);
//             switch (newState as string) {
//                 case "Initial":
//                 case "Early":
//                 case "Establishing":
//                     // Session is establishing
//                     break;
//                 case "AckWait":
//                 case "Confirmed":
//                 case "Established":
//                     handleCallAccepted(newSession);
//                     break;
//                 case "Terminated":
//                 case "Terminating":
//                     handleCallTerminated();
//                     break;
//                 default:
//                     break;
//             }
//         });

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     console.log("CURRENT SESSION DATA: >>>>\n", session);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     const stopAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//             audioContextRef.current = null;
//         }
//         if (gainNodeRef.current) {
//             gainNodeRef.current.disconnect();
//             gainNodeRef.current = null;
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default SipSpeechComponent;

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { IncomingMessageRequest, IncomingRequestMessage, Session } from "sip.js/lib/core";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const gainNodeRef = useRef<GainNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     const [getGreeting, setGetGreeting] = useState(false);

//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     // const generateGreeting = useCallback(
//     //     async (callerNumber: string): Promise<string | null> => {
//     //         try {
//     //             console.log("Generating greeting for caller:", callerNumber);
//     //             const payload = {
//     //                 callerNumber: { remoteNumber: callerNumber },
//     //             };
//     //             console.log(
//     //                 "Payload being sent to generate-greeting API:",
//     //                 payload
//     //             );

//     //             const response = await fetch("/api/llpmg/generate-greeting", {
//     //                 method: "POST",
//     //                 headers: {
//     //                     "Content-Type": "application/json",
//     //                 },
//     //                 body: JSON.stringify(payload),
//     //             });

//     //             if (!response.ok) {
//     //                 const errorText = await response.text();
//     //                 console.error(
//     //                     "Failed to generate greeting. Status:",
//     //                     response.status,
//     //                     "Error:",
//     //                     errorText
//     //                 );
//     //                 return null;
//     //             }

//     //             const data = await response.json();
//     //             console.log("Greeting API response:", data);

//     //             return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//     //         } catch (error) {
//     //             console.error("Error generating greeting:", error);
//     //             return null;
//     //         }
//     //     },
//     //     []
//     // );

//     const playAudioToRemote = useCallback(
//         async (audioUrl: string) => {
//             if (!session) {
//                 console.error("No active session to play audio to");
//                 return;
//             }

//             try {
//                 const response = await fetch(audioUrl);
//                 const arrayBuffer = await response.arrayBuffer();

//                 const audioContext = new AudioContext();
//                 const audioBuffer =
//                     await audioContext.decodeAudioData(arrayBuffer);

//                 const source = audioContext.createBufferSource();
//                 source.buffer = audioBuffer;

//                 const destination = audioContext.createMediaStreamDestination();
//                 source.connect(destination);

//                 if (
//                     "sessionDescriptionHandler" in session &&
//                     session.sessionDescriptionHandler
//                 ) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );

//                     if (sender) {
//                         const newTrack = destination.stream.getAudioTracks()[0];
//                         await sender.replaceTrack(newTrack);

//                         source.start(0);
//                         source.onended = () => {
//                             // Restore the original track after playing
//                             const originalTrack =
//                                 remoteAudioRef.current?.srcObject instanceof
//                                 MediaStream
//                                     ? remoteAudioRef.current.srcObject.getAudioTracks()[0]
//                                     : null;
//                             if (originalTrack) {
//                                 sender.replaceTrack(originalTrack);
//                             }
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                     }
//                 } else {
//                     console.error("Session description handler not available");
//                 }
//             } catch (error) {
//                 console.error("Error playing audio to remote:", error);
//             }
//         },
//         [session]
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         if (!audioContextRef.current) {
//             audioContextRef.current = new (window.AudioContext ||
//                 (window as any).webkitAudioContext)();
//         }

//         const context = audioContextRef.current;

//         if (!gainNodeRef.current) {
//             gainNodeRef.current = context.createGain();
//             gainNodeRef.current.connect(context.destination);
//             gainNodeRef.current.gain.value = 0;
//         }

//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const audioBuffer = await context.decodeAudioData(arrayBuffer);

//         const soundSource = context.createBufferSource();
//         soundSource.buffer = audioBuffer;
//         soundSource.start(0);
//         soundSource.connect(gainNodeRef.current);

//         const destination = context.createMediaStreamDestination();
//         soundSource.connect(destination);

//         return destination.stream;
//     }, []);

//     // const handleCallAccepted = useCallback(
//     //     async (message: any) => {
//     //         console.log("Call accepted - User has answered the call");
//     //         console.log(
//     //             "Telephony Session Info:",
//     //             message.headers["P-Rc-Api-Ids"] ||
//     //                 message.headers["p-rc-api-ids"]
//     //         );
//     //         userAgent?.audioHelper.playOutgoing(false);
//     //         userAgent?.audioHelper.playIncoming(false);
//     //         setCallActive(true);
//     //         setCallEnded(false);

//     //         const callerNumber = message.from.uri.normal.user;
//     //         console.log("Caller number:", callerNumber);

//     //         const remoteNumber = callerNumber;
//     //         console.log("Remote number (caller):", remoteNumber);

//     //         try {
//     //             const audioUrl = await generateGreeting(callerNumber);
//     //             if (audioUrl) {
//     //                 console.log("Greeting audio URL generated:", audioUrl);
//     //                 setGreetingAudioUrl(audioUrl);
//     //                 startRecording();
//     //                 console.log("Starting audio recording and processing");

//     //                 console.log("Attempting immediate test transcription");
//     //                 await transcribeAudio();
//     //                 // Play the greeting
//     //                 console.log("Playing greeting");
//     //                 const audio = new Audio(audioUrl);
//     //                 await audio.play();
//     //                 console.log("Greeting browser playback completed");
//     //             } else {
//     //                 console.error("Failed to generate greeting");
//     //             }
//     //         } catch (error) {
//     //             console.error("Error in call acceptance process:", error);
//     //         }
//     //     },
//     //     [userAgent, session, playAudioFile]
//     // );

//     const sendAudioStream = useCallback(
//         (stream: MediaStream) => {
//             return new Promise<void>((resolve) => {
//                 if (session && "sessionDescriptionHandler" in session) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );
//                     if (sender) {
//                         sender.replaceTrack(stream.getAudioTracks()[0]);
//                         stream.getAudioTracks()[0].onended = () => {
//                             resolve();
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                         resolve();
//                     }
//                 } else {
//                     console.error(
//                         "Session or sessionDescriptionHandler not available"
//                     );
//                     resolve();
//                 }
//             });
//         },
//         [session]
//     );

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log(
//                                 "Raw transcription received:",
//                                 data.result
//                             );
//                             const filteredTranscription = filterTranscription(
//                                 data.result
//                             );
//                             console.log(
//                                 "Filtered transcription:",
//                                 filteredTranscription
//                             );

//                             if (filteredTranscription) {
//                                 bufferRef.current.push(filteredTranscription);
//                                 if (
//                                     bufferRef.current.join(" ").split(" ")
//                                         .length >= 10
//                                 ) {
//                                     const newTranscription =
//                                         bufferRef.current.join(" ");
//                                     if (
//                                         newTranscription !==
//                                         lastTranscriptionRef.current
//                                     ) {
//                                         setTranscribedText(
//                                             (prevText) =>
//                                                 prevText +
//                                                 " " +
//                                                 newTranscription
//                                         );
//                                         lastTranscriptionRef.current =
//                                             newTranscription;
//                                         bufferRef.current = [];
//                                     }
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (message: IncomingRequestMessage) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             console.log("MESSAGE DETAILS: >>>> \n", message);

//             const callerNumber = message.from.uri.normal.user;
//             // const callerNumber = message.from.uri.normal.user;
//             console.log("Caller number:", callerNumber);

//             try {
//                 // const greetingUrl = await generateGreeting(callerNumber);
//                 const greetingUrl = "/llpmg/audio/incoming.ogg";
//                 if (greetingUrl) {
//                     console.log("Greeting audio URL generated:", greetingUrl);
//                     setGreetingAudioUrl(greetingUrl);

//                     // Play the greeting to the remote party
//                     await playAudioToRemote(greetingUrl);

//                     startRecording();
//                     console.log("Starting audio recording and processing");

//                     console.log("Attempting immediate test transcription");
//                     await transcribeAudio();
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error in call acceptance process:", error);
//             }
//         },
//         [
//             userAgent,
//             session,
//             // generateGreeting,
//             playAudioToRemote,
//             startRecording,
//             transcribeAudio,
//         ]
//     );

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     // const handleOutgoingCall = useCallback(() => {
//     //     if (!userAgent || !outgoingNumber) {
//     //         console.error("UserAgent or outgoing number is missing");
//     //         setConnectionError("Please enter a valid phone number");
//     //         return;
//     //     }

//     //     console.log("Placing call to:", outgoingNumber);
//     //     userAgent.audioHelper.playOutgoing(true);

//     //     const session = userAgent.invite(outgoingNumber, {});

//     //     session.on("accepted", handleCallAccepted);
//     //     session.on("terminated", handleCallTerminated);

//     //     setSession(session);
//     //     setCallActive(true);
//     //     setCallEnded(false);
//     // }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.stateChange.addListener((newState) => {
//             console.log(`Session state changed to ${newState}`);
//             switch (newState as string) {
//                 case "Initial":
//                 case "Early":
//                 case "Establishing":
//                     // Session is establishing
//                     break;
//                 case "AckWait":
//                 case "Confirmed":
//                 case "Established":
//                     handleCallAccepted(newSession);
//                     break;
//                 case "Terminated":
//                 case "Terminating":
//                     handleCallTerminated();
//                     break;
//                 default:
//                     break;
//             }
//         });

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     const stopAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//             audioContextRef.current = null;
//         }
//         if (gainNodeRef.current) {
//             gainNodeRef.current.disconnect();
//             gainNodeRef.current = null;
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default SipSpeechComponent;

// incorrect
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";
// import { AudioHelper } from "@/ref/web/src/audioHelper";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// interface ExtendedAudioHelper extends AudioHelper {
//     incoming: string;
//     outgoing: string;
//     stop: () => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const localAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

//     useEffect(() => {
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         localAudioRef.current = document.getElementById(
//             "localAudio"
//         ) as HTMLAudioElement;
//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

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

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: localAudioRef.current as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 } as unknown as ExtendedAudioHelper,
//             };

//             const webPhone = new WebPhone(parsedSipProvisionData, options);

//             webPhone.userAgent.on("registered", () => {
//                 setIsAuthenticated(true);
//             });

//             webPhone.userAgent.on("unregistered", () => {
//                 setIsAuthenticated(false);
//             });

//             webPhone.userAgent.on(
//                 "invite",
//                 (incomingSession: WebPhoneInvitation) => {
//                     setIncomingCall(incomingSession);
//                     playAudio(
//                         (options.audioHelper as ExtendedAudioHelper).incoming
//                     );
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const playAudio = useCallback((audioUrl: string) => {
//         const audio = new Audio(audioUrl);
//         audio
//             .play()
//             .catch((error) => console.error("Error playing audio:", error));
//     }, []);

//     // const setupAudioStream = useCallback(async (session: WebPhoneSession) => {
//     //     if (
//     //         session.sessionDescriptionHandler &&
//     //         "peerConnection" in session.sessionDescriptionHandler
//     //     ) {
//     //         const peerConnection = (
//     //             session.sessionDescriptionHandler as SessionDescriptionHandler
//     //         ).peerConnection;

//     //         if (peerConnection) {
//     //             try {
//     //                 const stream = await navigator.mediaDevices.getUserMedia({
//     //                     audio: true,
//     //                 });
//     //                 stream.getTracks().forEach((track) => {
//     //                     peerConnection.addTrack(track, stream);
//     //                 });

//     //                 if (localAudioRef.current) {
//     //                     localAudioRef.current.srcObject = stream;
//     //                 }

//     //                 peerConnection.ontrack = (event) => {
//     //                     if (remoteAudioRef.current) {
//     //                         remoteAudioRef.current.srcObject = event.streams[0];
//     //                     }
//     //                 };
//     //             } catch (error) {
//     //                 console.error("Error setting up audio stream:", error);
//     //             }
//     //         } else {
//     //             console.error("PeerConnection is undefined");
//     //         }
//     //     }
//     // }, []);

//     const setupAudioStream = useCallback(async (session: WebPhoneSession) => {
//         if (
//             session.sessionDescriptionHandler &&
//             "peerConnection" in session.sessionDescriptionHandler
//         ) {
//             const peerConnection = (
//                 session.sessionDescriptionHandler as SessionDescriptionHandler
//             ).peerConnection;

//             if (peerConnection) {
//                 try {
//                     const stream = await navigator.mediaDevices.getUserMedia({
//                         audio: true,
//                     });
//                     stream.getTracks().forEach((track) => {
//                         peerConnection.addTrack(track, stream);
//                     });

//                     if (localAudioRef.current) {
//                         localAudioRef.current.srcObject = stream;
//                     }

//                     peerConnection.ontrack = (event) => {
//                         if (remoteAudioRef.current) {
//                             remoteAudioRef.current.srcObject = event.streams[0];
//                             remoteAudioRef.current.play().catch(() => {
//                                 console.error("Remote play was rejected");
//                             });
//                         }
//                     };
//                 } catch (error) {
//                     console.error("Error setting up audio stream:", error);
//                 }
//             } else {
//                 console.error("PeerConnection is undefined");
//             }
//         }
//     }, []);

//     // const handleCallAccepted = useCallback(
//     //     (newSession: WebPhoneSession) => {
//     //         (userAgent?.audioHelper as ExtendedAudioHelper).stop();
//     //         setCallActive(true);
//     //         setCallEnded(false);
//     //         setSession(newSession);

//     //         setupAudioStream(newSession);

//     //         newSession.on("terminated", handleCallTerminated);

//     //         startRecording();
//     //         setTimeout(() => {
//     //             transcribeAudio();
//     //         }, 5000);
//     //     },
//     //     [userAgent, setupAudioStream]
//     // );

//     const handleCallAccepted = useCallback(
//         async (newSession: WebPhoneSession) => {
//             (userAgent?.audioHelper as ExtendedAudioHelper).stop();
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(newSession);

//             setupAudioStream(newSession);

//             newSession.on("terminated", handleCallTerminated);

//             // Generate audio using ElevenLabs API
//             try {
//                 const response = await fetch(
//                     "/api/llpmg/audio/generate-audio",
//                     {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({
//                             text: "Hello, this is an automated message. How can I assist you today?",
//                         }),
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to generate audio");
//                 }

//                 const audioBlob = await response.blob();
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setGeneratedAudio(audioUrl);

//                 // Play the generated audio
//                 const audio = new Audio(audioUrl);
//                 audio
//                     .play()
//                     .catch((error) =>
//                         console.error("Error playing audio:", error)
//                     );
//             } catch (error) {
//                 console.error("Error generating audio:", error);
//             }

//             startRecording();
//             setTimeout(() => {
//                 transcribeAudio();
//             }, 5000);
//         },
//         [userAgent, setupAudioStream]
//     );

//     const handleCallTerminated = useCallback(() => {
//         (userAgent?.audioHelper as ExtendedAudioHelper).stop();
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         setSession(null);
//         onHangup();
//     }, [userAgent, onHangup]);

//     const startRecording = useCallback(() => {
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject instanceof MediaStream) {
//             try {
//                 const mediaRecorder = new MediaRecorder(remoteAudio.srcObject);

//                 mediaRecorder.ondataavailable = (event) => {
//                     if (event.data.size > 0) {
//                         recordedChunksRef.current.push(event.data);
//                     }
//                 };

//                 mediaRecorder.start();
//                 mediaRecorderRef.current = mediaRecorder;
//             } catch (error) {
//                 console.error("Error starting MediaRecorder:", error);
//             }
//         } else {
//             console.error("Remote audio source not found or not a MediaStream");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//             };
//         }
//     }, []);

//     const transcribeAudio = useCallback(async () => {
//         if (
//             !remoteAudioRef.current ||
//             !(remoteAudioRef.current.srcObject instanceof MediaStream)
//         ) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );

//                         if (response.ok) {
//                             const data = await response.json();
//                             if (data.confidence && data.confidence > 0.7) {
//                                 setTranscribedText(
//                                     (prevText) => prevText + " " + data.result
//                                 );
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 response.statusText
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         playAudio((userAgent.audioHelper as ExtendedAudioHelper).outgoing);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.on("accepted", () => handleCallAccepted(newSession));
//         newSession.on("terminated", handleCallTerminated);

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [
//         userAgent,
//         outgoingNumber,
//         handleCallAccepted,
//         handleCallTerminated,
//         playAudio,
//     ]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             (userAgent?.audioHelper as ExtendedAudioHelper).stop();

//             switch (action) {
//                 case "accept":
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     handleCallAccepted(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted]
//     );

//     const handleHangup = useCallback(() => {
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const stopAudioProcessing = useCallback(() => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//         if (localAudioRef.current) {
//             const stream = localAudioRef.current
//                 .srcObject as MediaStream | null;
//             if (stream) {
//                 stream.getTracks().forEach((track) => track.stop());
//             }
//             localAudioRef.current.srcObject = null;
//         }
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.srcObject = null;
//         }
//     }, []);

//     const toggleMute = useCallback(() => {
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" ref={localAudioRef} hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
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
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) =>
//                                         setOutgoingNumber(e.target.value)
//                                     }
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={handleOutgoingCall}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handleHangup}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("accept")
//                                         }
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("decline")
//                                         }
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("toVoicemail")
//                                         }
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// temporary - transcription errors
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { Session,  } from "sip.js/lib/core";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const gainNodeRef = useRef<GainNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     const [getGreeting, setGetGreeting] = useState(false);

//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 console.log("Generating greeting for caller:", callerNumber);
//                 const payload = {
//                     callerNumber: { remoteNumber: callerNumber },
//                 };
//                 console.log(
//                     "Payload being sent to generate-greeting API:",
//                     payload
//                 );

//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     console.error(
//                         "Failed to generate greeting. Status:",
//                         response.status,
//                         "Error:",
//                         errorText
//                     );
//                     return null;
//                 }

//                 const data = await response.json();
//                 console.log("Greeting API response:", data);

//                 return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         if (!audioContextRef.current) {
//             audioContextRef.current = new (window.AudioContext ||
//                 (window as any).webkitAudioContext)();
//         }

//         const context = audioContextRef.current;

//         if (!gainNodeRef.current) {
//             gainNodeRef.current = context.createGain();
//             gainNodeRef.current.connect(context.destination);
//             gainNodeRef.current.gain.value = 0;
//         }

//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const audioBuffer = await context.decodeAudioData(arrayBuffer);

//         const soundSource = context.createBufferSource();
//         soundSource.buffer = audioBuffer;
//         soundSource.start(0);
//         soundSource.connect(gainNodeRef.current);

//         const destination = context.createMediaStreamDestination();
//         soundSource.connect(destination);

//         return destination.stream;
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (message: any) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);

//             const callerNumber = message.from.uri.normal.user;
//             console.log("Caller number:", callerNumber);

//             const remoteNumber = callerNumber;
//             console.log("Remote number (caller):", remoteNumber);

//             try {

//                 const audioUrl = await generateGreeting(callerNumber);
//                 if (audioUrl) {
//                     console.log("Greeting audio URL generated:", audioUrl);
//                     setGreetingAudioUrl(audioUrl);
//                     startRecording();
//                     console.log("Starting audio recording and processing");

//                     console.log("Attempting immediate test transcription");
//                     await transcribeAudio();
//                     // Play the greeting
//                     console.log("Playing greeting");
//                     const audio = new Audio(audioUrl);
//                     await audio.play();
//                     console.log("Greeting browser playback completed");
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error in call acceptance process:", error);
//             }
//         },
//         [userAgent, session, playAudioFile]
//     );

//     const sendAudioStream = useCallback(
//         (stream: MediaStream) => {
//             return new Promise<void>((resolve) => {
//                 if (session && "sessionDescriptionHandler" in session) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );
//                     if (sender) {
//                         sender.replaceTrack(stream.getAudioTracks()[0]);
//                         stream.getAudioTracks()[0].onended = () => {
//                             resolve();
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                         resolve();
//                     }
//                 } else {
//                     console.error(
//                         "Session or sessionDescriptionHandler not available"
//                     );
//                     resolve();
//                 }
//             });
//         },
//         [session]
//     );

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log(
//                                 "Raw transcription received:",
//                                 data.result
//                             );
//                             const filteredTranscription = filterTranscription(
//                                 data.result
//                             );
//                             console.log(
//                                 "Filtered transcription:",
//                                 filteredTranscription
//                             );

//                             if (filteredTranscription) {
//                                 bufferRef.current.push(filteredTranscription);
//                                 if (
//                                     bufferRef.current.join(" ").split(" ")
//                                         .length >= 10
//                                 ) {
//                                     const newTranscription =
//                                         bufferRef.current.join(" ");
//                                     if (
//                                         newTranscription !==
//                                         lastTranscriptionRef.current
//                                     ) {
//                                         setTranscribedText(
//                                             (prevText) =>
//                                                 prevText +
//                                                 " " +
//                                                 newTranscription
//                                         );
//                                         lastTranscriptionRef.current =
//                                             newTranscription;
//                                         bufferRef.current = [];
//                                     }
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }

//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const session = userAgent.invite(outgoingNumber, {});

//         session.on("accepted", handleCallAccepted);
//         session.on("terminated", handleCallTerminated);

//         setSession(session);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     const stopAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//             audioContextRef.current = null;
//         }
//         if (gainNodeRef.current) {
//             gainNodeRef.current.disconnect();
//             gainNodeRef.current = null;
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default SipSpeechComponent;

// same
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { Session } from "sip.js/lib/core";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const gainNodeRef = useRef<GainNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const [callDialog, setCallDialog] = useState<Session | undefined>();
//     const [getGreeting, setGetGreeting] = useState(false);

//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
//     const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
//         null
//     );
//     const lastTranscriptionRef = useRef<string>("");
//     const bufferRef = useRef<string[]>([]);
//     const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const [greetingAudioUrl, setGreetingAudioUrl] = useState<string | null>(
//         null
//     );

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 console.log("Generating greeting for caller:", callerNumber);
//                 const payload = {
//                     remoteCaller: { remoteNumber: callerNumber },
//                 };
//                 console.log(
//                     "Payload being sent to generate-greeting API:",
//                     payload
//                 );

//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     console.error(
//                         "Failed to generate greeting. Status:",
//                         response.status,
//                         "Error:",
//                         errorText
//                     );
//                     return null;
//                 }

//                 const data = await response.json();
//                 console.log("Greeting API response:", data);

//                 return `http://localhost:65535${data.audioUrl}`; // Adjust the base URL as needed
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         if (!audioContextRef.current) {
//             audioContextRef.current = new (window.AudioContext ||
//                 (window as any).webkitAudioContext)();
//         }

//         const context = audioContextRef.current;

//         if (!gainNodeRef.current) {
//             gainNodeRef.current = context.createGain();
//             gainNodeRef.current.connect(context.destination);
//             gainNodeRef.current.gain.value = 0;
//         }

//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         const audioBuffer = await context.decodeAudioData(arrayBuffer);

//         const soundSource = context.createBufferSource();
//         soundSource.buffer = audioBuffer;
//         soundSource.start(0);
//         soundSource.connect(gainNodeRef.current);

//         const destination = context.createMediaStreamDestination();
//         soundSource.connect(destination);

//         return destination.stream;
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (message: any) => {
//             console.log("Call accepted - User has answered the call");
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);

//             const callerNumber = message.from.uri.normal.user;
//             console.log("Caller number:", callerNumber);

//             const remoteNumber = callerNumber;
//             console.log("Remote number (caller):", remoteNumber);

//             try {
//                 const audioUrl = await generateGreeting(callerNumber);
//                 if (audioUrl) {
//                     console.log("Greeting audio URL generated:", audioUrl);
//                     setGreetingAudioUrl(audioUrl);
//                     startRecording();
//                     console.log("Starting audio recording and processing");

//                     console.log("Attempting immediate test transcription");
//                     await transcribeAudio();
//                     // Play the greeting
//                     console.log("Playing greeting");
//                     const audio = new Audio(audioUrl);
//                     await audio.play();
//                     console.log("Greeting browser playback completed");
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error in call acceptance process:", error);
//             }
//         },
//         [userAgent, session, playAudioFile]
//     );

//     const sendAudioStream = useCallback(
//         (stream: MediaStream) => {
//             return new Promise<void>((resolve) => {
//                 if (session && "sessionDescriptionHandler" in session) {
//                     const peerConnection = (
//                         session.sessionDescriptionHandler as any
//                     ).peerConnection;
//                     const sender = peerConnection
//                         .getSenders()
//                         .find(
//                             (s: RTCRtpSender) =>
//                                 s.track && s.track.kind === "audio"
//                         );
//                     if (sender) {
//                         sender.replaceTrack(stream.getAudioTracks()[0]);
//                         stream.getAudioTracks()[0].onended = () => {
//                             resolve();
//                         };
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection"
//                         );
//                         resolve();
//                     }
//                 } else {
//                     console.error(
//                         "Session or sessionDescriptionHandler not available"
//                     );
//                     resolve();
//                 }
//             });
//         },
//         [session]
//     );

//     const filterTranscription = (text: string): string => {
//         const unwantedPhrases = [
//             "thank you",
//             "goodbye",
//             "bye bye",
//             "hello",
//             "you you",
//         ];
//         let filteredText = text.toLowerCase();
//         unwantedPhrases.forEach((phrase) => {
//             const regex = new RegExp(`\\b${phrase}\\b, "gi"`);
//             filteredText = filteredText.replace(regex, "");
//         });
//         return filteredText.trim();
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log(
//                                 "Raw transcription received:",
//                                 data.result
//                             );
//                             const filteredTranscription = filterTranscription(
//                                 data.result
//                             );
//                             console.log(
//                                 "Filtered transcription:",
//                                 filteredTranscription
//                             );

//                             if (filteredTranscription) {
//                                 bufferRef.current.push(filteredTranscription);
//                                 if (
//                                     bufferRef.current.join(" ").split(" ")
//                                         .length >= 10
//                                 ) {
//                                     const newTranscription =
//                                         bufferRef.current.join(" ");
//                                     if (
//                                         newTranscription !==
//                                         lastTranscriptionRef.current
//                                     ) {
//                                         setTranscribedText(
//                                             (prevText) =>
//                                                 prevText +
//                                                 " " +
//                                                 newTranscription
//                                         );
//                                         lastTranscriptionRef.current =
//                                             newTranscription;
//                                         bufferRef.current = [];
//                                     }
//                                 }
//                             }
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             const audioContext = new AudioContext();
//             const source = audioContext.createMediaStreamSource(stream);
//             const analyser = audioContext.createAnalyser();
//             const processor = audioContext.createScriptProcessor(1024, 1, 1);

//             source.connect(analyser);
//             analyser.connect(processor);
//             processor.connect(audioContext.destination);

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 2000;

//             processor.onaudioprocess = (event) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                     } else if (Date.now() - silenceStart >= silenceDuration) {
//                         if (silenceTimeoutRef.current)
//                             clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = setTimeout(() => {
//                             console.log(
//                                 "Silence detected, triggering transcription"
//                             );
//                             transcribeAudio();
//                         }, 500);
//                     }
//                 } else {
//                     silenceStart = null;
//                     if (silenceTimeoutRef.current) {
//                         clearTimeout(silenceTimeoutRef.current);
//                         silenceTimeoutRef.current = null;
//                     }
//                 }
//             };

//             return () => {
//                 processor.disconnect();
//                 analyser.disconnect();
//                 source.disconnect();
//                 audioContext.close();
//             };
//         },
//         [transcribeAudio]
//     );

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//             setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//         } else {
//             console.error("Remote audio source not found");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.onstop = () => {
//                 const audioBlob = new Blob(recordedChunksRef.current, {
//                     type: "audio/webm",
//                 });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setRecordedAudio(audioUrl);
//                 console.log("Audio recording saved");
//             };
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         console.log("Call terminated");
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         onHangup();
//     }, [userAgent, onHangup, stopRecording]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const session = userAgent.invite(outgoingNumber, {});

//         session.on("accepted", handleCallAccepted);
//         session.on("terminated", handleCallTerminated);

//         setSession(session);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             console.log("INCOMING CALL: >>>>\n", incomingCall);
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }
//             setCallDialog(incomingCall.dialog);

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     incomingCall.on("accepted", handleCallAccepted);
//                     incomingCall.on("terminated", handleCallTerminated);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     const stopAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//             audioContextRef.current = null;
//         }
//         if (gainNodeRef.current) {
//             gainNodeRef.current.disconnect();
//             gainNodeRef.current = null;
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default SipSpeechComponent;

// plays audio to phone
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { SessionState } from "sip.js";
// // import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";
// import { SessionDescriptionHandler } from "sip.js";
// import { SessionDescriptionHandler as WebSessionDescriptionHandler } from "sip.js/lib/platform/web/session-description-handler/session-description-handler";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const localAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     useEffect(() => {
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         localAudioRef.current = document.getElementById(
//             "localAudio"
//         ) as HTMLAudioElement;

//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }

//         return () => {
//             if (session) {
//                 session.dispose();
//             }
//             if (userAgent) {
//                 userAgent.stop();
//             }
//             stopAudioProcessing();
//         };
//         // Only include tokenData in the dependency array
//     }, [tokenData]);

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

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: localAudioRef.current as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             const webPhone = new WebPhone(parsedSipProvisionData, options);

//             webPhone.userAgent.on("registered", () => {
//                 setIsAuthenticated(true);
//             });

//             webPhone.userAgent.on("unregistered", () => {
//                 setIsAuthenticated(false);
//             });

//             webPhone.userAgent.on(
//                 "invite",
//                 (incomingSession: WebPhoneInvitation) => {
//                     setIncomingCall(incomingSession);
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const requestMediaPermissions = useCallback(async () => {
//         try {
//             await navigator.mediaDevices.getUserMedia({ audio: true });
//         } catch (error) {
//             console.error("Media permission denied:", error);
//         }
//     }, []);

//     useEffect(() => {
//         requestMediaPermissions();
//     }, [requestMediaPermissions]);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         callerNumber: { remoteNumber: callerNumber },
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to generate greeting");
//                 }

//                 const data = await response.json();
//                 return `http://localhost:65535${data.audioUrl}`;
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         const audio = new Audio(audioUrl);
//         await audio.play();
//     }, []);

//     const setupAudioStream = useCallback((session: WebPhoneSession) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 // Remote Stream
//                 const remoteStream = new MediaStream();
//                 peerConnection
//                     .getReceivers()
//                     .forEach((receiver: RTCRtpReceiver) => {
//                         if (receiver.track) {
//                             remoteStream.addTrack(receiver.track);
//                         }
//                     });
//                 if (remoteAudioRef.current) {
//                     remoteAudioRef.current.srcObject = remoteStream;
//                     console.log("Remote audio stream set on audio element");
//                 } else {
//                     console.error("Remote audio element is not available");
//                 }

//                 // Local Stream
//                 const localStream = new MediaStream();
//                 peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//                     if (sender.track) {
//                         localStream.addTrack(sender.track);
//                     }
//                 });
//                 if (localAudioRef.current) {
//                     localAudioRef.current.srcObject = localStream;
//                     console.log("Local audio stream set on audio element");
//                 } else {
//                     console.error("Local audio element is not available");
//                 }
//             } else {
//                 console.error("PeerConnection is not available");
//             }
//         } else {
//             console.error("Session Description Handler is not available");
//         }
//     }, []);

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             // Cast sessionDescriptionHandler to the implementation that includes peerConnection
//             const sdh = session.sessionDescriptionHandler as any; // Use 'any' or the correct type if available
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 const newAudioTrack = newStream.getAudioTracks()[0];
//                 if (newAudioTrack) {
//                     // Get the sender responsible for audio
//                     const audioSender = peerConnection
//                         .getSenders()
//                         .find((sender) => sender.track?.kind === "audio");
//                     if (audioSender) {
//                         // Replace the track being sent
//                         await audioSender.replaceTrack(newAudioTrack);
//                         console.log(
//                             "Local audio track replaced with greeting audio."
//                         );
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection."
//                         );
//                     }
//                 } else {
//                     console.error(
//                         "No audio track found in the greeting stream."
//                     );
//                 }
//             } else {
//                 console.error("PeerConnection is not available.");
//             }
//         } else {
//             console.error("Session Description Handler is not available.");
//         }
//     };

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<{
//         stream: MediaStream;
//         sourceNode: AudioBufferSourceNode;
//         audioContext: AudioContext;
//     }> => {
//         const audioContext = new AudioContext();
//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();
//         const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//         const sourceNode = audioContext.createBufferSource();
//         sourceNode.buffer = audioBuffer;

//         const destinationNode = audioContext.createMediaStreamDestination();
//         sourceNode.connect(destinationNode);
//         sourceNode.start();

//         return { stream: destinationNode.stream, sourceNode, audioContext };
//     };

//     const getUserMediaAndReplaceTrack = async (session: WebPhoneSession) => {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//         });
//         const audioTrack = mediaStream.getAudioTracks()[0];

//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 const audioSender = peerConnection
//                     .getSenders()
//                     .find((sender) => sender.track?.kind === "audio");
//                 if (audioSender) {
//                     await audioSender.replaceTrack(audioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found to replace track.");
//                 }
//             } else {
//                 console.error("PeerConnection is not available.");
//             }
//         } else {
//             console.error("Session Description Handler is not available.");
//         }
//     };

//     const handleCallAccepted = useCallback(
//         async (newSession: WebPhoneSession) => {
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(newSession);

//             // Proceed with your greeting logic
//             const callerNumber = newSession.remoteIdentity.uri.user as string;
//             const greetingUrl = await generateGreeting(callerNumber);

//             if (greetingUrl) {
//                 const {
//                     stream: greetingStream,
//                     sourceNode,
//                     audioContext,
//                 } = await createMediaStreamFromAudio(greetingUrl);
//                 await replaceLocalAudioTrack(newSession, greetingStream);

//                 // Wait for the greeting to finish playing
//                 sourceNode.onended = async () => {
//                     console.log("Greeting audio finished playing.");
//                     audioContext.close();

//                     // Switch back to microphone audio
//                     await getUserMediaAndReplaceTrack(newSession);
//                 };
//             }

//             setupAudioStream(newSession);

//             // Handle session termination
//             newSession.stateChange.addListener((state: SessionState) => {
//                 if (state === SessionState.Terminated) {
//                     handleCallTerminated();
//                 }
//             });

//             // Start recording if necessary
//             startRecording();
//             setTimeout(() => {
//                 transcribeAudio();
//             }, 5000);
//         },
//         [userAgent, setupAudioStream, generateGreeting]
//     );

//     const transcribeAudioBlob = async (audioBlob: Blob, speaker: string) => {
//         console.log(`Transcribing audio blob for speaker: ${speaker}`);
//         return new Promise<
//             Array<{ timestamp: number; speaker: string; text: string }>
//         >((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );

//                         if (response.ok) {
//                             const data = await response.json();
//                             const transcriptionResult = data.result; // Adjust based on your API response

//                             console.log(
//                                 `Transcription result for ${speaker}:`,
//                                 transcriptionResult
//                             );

//                             // Assuming the API returns an array of transcription segments with timestamps
//                             const transcriptions = transcriptionResult.map(
//                                 (segment: any) => ({
//                                     timestamp: segment.timestamp,
//                                     speaker,
//                                     text: segment.text,
//                                 })
//                             );

//                             resolve(transcriptions);
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 response.statusText
//                             );
//                             reject(new Error("Transcription failed"));
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio", error);
//                         reject(error);
//                     }
//                 } else {
//                     console.error("Reader result is not a string");
//                     reject(new Error("Failed to read audio blob"));
//                 }
//             };
//         });
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribe audio function called");
//         const transcriptions: Array<{
//             timestamp: number;
//             speaker: string;
//             text: string;
//         }> = [];

//         // Transcribe remote audio (patient)
//         if (remoteRecordedChunksRef.current.length > 0) {
//             console.log("Transcribing remote audio");
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const remoteTranscription = await transcribeAudioBlob(
//                 remoteAudioBlob,
//                 "Patient"
//             );
//             transcriptions.push(...remoteTranscription);
//         } else {
//             console.log("No remote audio chunks to transcribe");
//         }

//         // Transcribe local audio (system)
//         if (localRecordedChunksRef.current.length > 0) {
//             console.log("Transcribing local audio");
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const localTranscription = await transcribeAudioBlob(
//                 localAudioBlob,
//                 "System"
//             );
//             transcriptions.push(...localTranscription);
//         } else {
//             console.log("No local audio chunks to transcribe");
//         }

//         // Sort transcriptions by timestamp
//         transcriptions.sort((a, b) => a.timestamp - b.timestamp);

//         // Update state with transcriptions
//         const formattedTranscription = transcriptions
//             .map((entry) => `${entry.speaker}: ${entry.text}`)
//             .join("\n");

//         setTranscribedText(formattedTranscription);
//         console.log("Updated transcribed text:", formattedTranscription);
//     }, []);

//     useEffect(() => {
//         let transcriptionInterval: NodeJS.Timeout;

//         if (callActive) {
//             transcriptionInterval = setInterval(() => {
//                 console.log("Transcription interval triggered");
//                 transcribeAudio();
//             }, 5000); // Transcribe every 5 seconds
//         }

//         return () => {
//             if (transcriptionInterval) {
//                 clearInterval(transcriptionInterval);
//             }
//         };
//     }, [callActive, transcribeAudio]);

//     const startRecording = useCallback(() => {
//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Record remote audio
//         const remoteAudio = remoteAudioRef.current;
//         if (remoteAudio && remoteAudio.srcObject instanceof MediaStream) {
//             console.log("Starting remote audio recording");
//             const remoteMediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject
//             );

//             remoteMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     remoteRecordedChunksRef.current.push(event.data);
//                     console.log("Remote audio data available:", event.data);
//                 }
//             };

//             remoteMediaRecorder.start();
//             remoteMediaRecorderRef.current = remoteMediaRecorder;
//         } else {
//             console.error("Remote audio source not found or not a MediaStream");
//         }

//         // Record local audio
//         const localAudio = localAudioRef.current;
//         if (localAudio && localAudio.srcObject instanceof MediaStream) {
//             console.log("Starting local audio recording");
//             const localMediaRecorder = new MediaRecorder(localAudio.srcObject);

//             localMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                     console.log("Local audio data available:", event.data);
//                 }
//             };

//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("Local audio source not found or not a MediaStream");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }

//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const handleHangup = useCallback(() => {
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const stopAudioProcessing = useCallback(() => {
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//         }
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.srcObject = null;
//             remoteAudioRef.current.pause();
//         }
//         if (localAudioRef.current) {
//             localAudioRef.current.srcObject = null;
//             localAudioRef.current.pause();
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         stopAudioProcessing();
//         setSession(null);
//         onHangup();
//     }, [userAgent, onHangup, stopAudioProcessing]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.stateChange.addListener((state: SessionState) => {
//             switch (state) {
//                 case SessionState.Established:
//                     handleCallAccepted(newSession);
//                     break;
//                 case SessionState.Terminated:
//                     handleCallTerminated();
//                     break;
//             }
//         });

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     incomingCall.stateChange.addListener(
//                         (state: SessionState) => {
//                             switch (state) {
//                                 case SessionState.Established:
//                                     handleCallAccepted(incomingCall);
//                                     break;
//                                 case SessionState.Terminated:
//                                     handleCallTerminated();
//                                     break;
//                             }
//                         }
//                     );
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const toggleMute = useCallback(() => {
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} autoPlay muted />
//                 <audio id="localAudio" ref={localAudioRef} autoPlay muted />

//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
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
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) =>
//                                         setOutgoingNumber(e.target.value)
//                                     }
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={handleOutgoingCall}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handleHangup}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="transcription mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 {callEnded
//                                     ? "Call Transcription"
//                                     : "Live Transcription"}
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                 {transcribedText
//                                     ? transcribedText
//                                           .split("\n")
//                                           .map((line, index) => (
//                                               <p
//                                                   key={index}
//                                                   className={
//                                                       line.startsWith(
//                                                           "Patient:"
//                                                       )
//                                                           ? "text-blue-300"
//                                                           : "text-green-300"
//                                                   }
//                                               >
//                                                   {line}
//                                               </p>
//                                           ))
//                                     : "Transcription will appear here..."}
//                             </div>
//                         </div>

//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("accept")
//                                         }
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("decline")
//                                         }
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("toVoicemail")
//                                         }
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// fails to generate greeting
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { SessionState } from "sip.js";
// // import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";
// import { SessionDescriptionHandler } from "sip.js";
// import { SessionDescriptionHandler as WebSessionDescriptionHandler } from "sip.js/lib/platform/web/session-description-handler/session-description-handler";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const localAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (recordedChunksRef.current.length === 0) {
//             console.log("No recorded audio chunks to transcribe");
//             return;
//         }

//         const audioBlob = new Blob(recordedChunksRef.current, {
//             type: "audio/webm",
//         });
//         recordedChunksRef.current = []; // Clear after creating the blob

//         const reader = new FileReader();
//         reader.readAsDataURL(audioBlob);
//         reader.onloadend = async () => {
//             if (typeof reader.result === "string") {
//                 const base64Audio = reader.result.split(",")[1];
//                 try {
//                     console.log("Sending audio to transcription API");
//                     const response = await fetch("/api/llpmg/speech-to-text", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ audio: base64Audio }),
//                     });
//                     console.log(
//                         "Transcription API response status:",
//                         response.status
//                     );
//                     if (response.ok) {
//                         const data = await response.json();
//                         console.log("Transcription received:", data.result);
//                         setTranscribedText(
//                             (prevText) => prevText + "\nPatient: " + data.result
//                         );
//                     } else {
//                         console.error(
//                             "Failed to transcribe audio",
//                             await response.text()
//                         );
//                     }
//                 } catch (error) {
//                     console.error("Error transcribing audio:", error);
//                 }
//             }
//         };
//     }, []);

//     const setupAudioProcessing = useCallback(
//         (stream: MediaStream) => {
//             console.log("Setting up audio processing");
//             audioContextRef.current = new AudioContext();
//             sourceNodeRef.current =
//                 audioContextRef.current.createMediaStreamSource(stream);
//             analyserRef.current = audioContextRef.current.createAnalyser();
//             scriptProcessorRef.current =
//                 audioContextRef.current.createScriptProcessor(4096, 1, 1);

//             sourceNodeRef.current.connect(analyserRef.current);
//             analyserRef.current.connect(scriptProcessorRef.current);
//             scriptProcessorRef.current.connect(
//                 audioContextRef.current.destination
//             );

//             let silenceStart: number | null = null;
//             const silenceThreshold = 0.01;
//             const silenceDuration = 1000;
//             let isTranscribing = false;

//             scriptProcessorRef.current.onaudioprocess = (
//                 event: AudioProcessingEvent
//             ) => {
//                 const input = event.inputBuffer.getChannelData(0);
//                 const sum = input.reduce(
//                     (acc: number, val: number) => acc + Math.abs(val),
//                     0
//                 );
//                 const average = sum / input.length;

//                 if (average < silenceThreshold) {
//                     if (silenceStart === null) {
//                         silenceStart = Date.now();
//                         console.log("Silence started at:", silenceStart);
//                     } else if (
//                         Date.now() - silenceStart >= silenceDuration &&
//                         !isTranscribing
//                     ) {
//                         console.log(
//                             "Silence detected for 1 second, triggering transcription"
//                         );
//                         isTranscribing = true;
//                         transcribeAudio().then(() => {
//                             isTranscribing = false;
//                             silenceStart = null;
//                         });
//                     }
//                 } else {
//                     silenceStart = null;
//                 }
//             };
//         },
//         [transcribeAudio]
//     );

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

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

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: localAudioRef.current as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             const webPhone = new WebPhone(parsedSipProvisionData, options);

//             webPhone.userAgent.on("registered", () => {
//                 setIsAuthenticated(true);
//             });

//             webPhone.userAgent.on("unregistered", () => {
//                 setIsAuthenticated(false);
//             });

//             webPhone.userAgent.on(
//                 "invite",
//                 (incomingSession: WebPhoneInvitation) => {
//                     setIncomingCall(incomingSession);
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         localAudioRef.current = document.getElementById(
//             "localAudio"
//         ) as HTMLAudioElement;

//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }

//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData, initializeWebPhone, stopAllAudioProcessing]);

//     const requestMediaPermissions = useCallback(async () => {
//         try {
//             await navigator.mediaDevices.getUserMedia({ audio: true });
//         } catch (error) {
//             console.error("Media permission denied:", error);
//         }
//     }, []);

//     useEffect(() => {
//         requestMediaPermissions();
//     }, [requestMediaPermissions]);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         remoteCaller: { remoteNumber: callerNumber },
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to generate greeting");
//                 }

//                 const data = await response.json();
//                 return `http://localhost:65535${data.audioUrl}`;
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const switchBackToMicrophone = async (session: WebPhoneSession) => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (session.sessionDescriptionHandler) {
//                 const sdh = session.sessionDescriptionHandler as any;
//                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

//                 const newAudioTrack = stream.getAudioTracks()[0];
//                 if (!newAudioTrack) {
//                     console.error(
//                         "No audio track found in the microphone stream"
//                     );
//                     return;
//                 }

//                 const senders = peerConnection.getSenders();
//                 const audioSender = senders.find(
//                     (sender) => sender.track && sender.track.kind === "audio"
//                 );

//                 if (audioSender) {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found in peer connection.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error switching back to microphone audio:", error);
//         }
//     };

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         const audio = new Audio(audioUrl);
//         await audio.play();
//     }, []);

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             const audioSender = senders.find(
//                 (sender) => sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log(
//                         "Local audio track replaced with greeting audio."
//                     );
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         }
//     };

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<MediaStream> => {
//         const audioContext = new AudioContext();
//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();
//         const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//         const source = audioContext.createBufferSource();
//         source.buffer = audioBuffer;

//         const destination = audioContext.createMediaStreamDestination();
//         source.connect(destination);
//         source.start();

//         // Return the MediaStream containing the greeting audio
//         return destination.stream;
//     };

//     const getUserMediaAndReplaceTrack = async (session: WebPhoneSession) => {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//         });
//         const audioTrack = mediaStream.getAudioTracks()[0];

//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 const audioSender = peerConnection
//                     .getSenders()
//                     .find((sender) => sender.track?.kind === "audio");
//                 if (audioSender) {
//                     await audioSender.replaceTrack(audioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found to replace track.");
//                 }
//             } else {
//                 console.error("PeerConnection is not available.");
//             }
//         } else {
//             console.error("Session Description Handler is not available.");
//         }
//     };

//     const setupAudioStream = useCallback((session: WebPhoneSession) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 // Remote Stream
//                 const remoteStream = new MediaStream();
//                 peerConnection
//                     .getReceivers()
//                     .forEach((receiver: RTCRtpReceiver) => {
//                         if (receiver.track) {
//                             remoteStream.addTrack(receiver.track);
//                         }
//                     });
//                 if (remoteAudioRef.current) {
//                     remoteAudioRef.current.srcObject = remoteStream;
//                     remoteAudioRef.current.play().catch((error) => {
//                         console.error("Error playing remote audio:", error);
//                     });
//                     console.log("Remote audio stream set on audio element");
//                 } else {
//                     console.error("Remote audio element is not available");
//                 }

//                 // Local Stream
//                 const localStream = new MediaStream();
//                 peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//                     if (sender.track) {
//                         localStream.addTrack(sender.track);
//                     }
//                 });
//                 if (localAudioRef.current) {
//                     localAudioRef.current.srcObject = localStream;
//                     localAudioRef.current.play().catch((error) => {
//                         console.error("Error playing local audio:", error);
//                     });
//                     console.log("Local audio stream set on audio element");
//                 } else {
//                     console.error("Local audio element is not available");
//                 }
//             } else {
//                 console.error("PeerConnection is not available");
//             }
//         } else {
//             console.error("Session Description Handler is not available");
//         }
//     }, []);

//     const transcribeAudioBlob = async (audioBlob: Blob, speaker: string) => {
//         console.log(`Transcribing audio blob for speaker: ${speaker}`);
//         return new Promise<
//             Array<{ timestamp: number; speaker: string; text: string }>
//         >((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );

//                         if (response.ok) {
//                             const data = await response.json();
//                             const transcriptionResult = data.result; // Adjust based on your API response

//                             console.log(
//                                 `Transcription result for ${speaker}:`,
//                                 transcriptionResult
//                             );

//                             // Assuming the API returns an array of transcription segments with timestamps
//                             const transcriptions = transcriptionResult.map(
//                                 (segment: any) => ({
//                                     timestamp: segment.timestamp,
//                                     speaker,
//                                     text: segment.text,
//                                 })
//                             );

//                             resolve(transcriptions);
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 response.statusText
//                             );
//                             reject(new Error("Transcription failed"));
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio", error);
//                         reject(error);
//                     }
//                 } else {
//                     console.error("Reader result is not a string");
//                     reject(new Error("Failed to read audio blob"));
//                 }
//             };
//         });
//     };

//     useEffect(() => {
//         let transcriptionInterval: NodeJS.Timeout;

//         if (callActive) {
//             transcriptionInterval = setInterval(() => {
//                 console.log("Transcription interval triggered");
//                 transcribeAudio();
//             }, 5000); // Transcribe every 5 seconds
//         }

//         return () => {
//             if (transcriptionInterval) {
//                 clearInterval(transcriptionInterval);
//             }
//         };
//     }, [callActive, transcribeAudio]);

//     const startRecording = useCallback(() => {
//         console.log("Starting recording");
//         recordedChunksRef.current = [];
//         const remoteAudio = remoteAudioRef.current;

//         if (remoteAudio && remoteAudio.srcObject instanceof MediaStream) {
//             console.log("Remote audio source found");
//             const mediaRecorder = new MediaRecorder(remoteAudio.srcObject);

//             mediaRecorder.ondataavailable = (event: BlobEvent) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                     console.log("Remote audio data available:", event.data);
//                 }
//             };

//             mediaRecorder.start(1000); // Collect data every 1 second
//             mediaRecorderRef.current = mediaRecorder;
//         } else {
//             console.error("Remote audio source not found or not a MediaStream");
//         }
//     }, []);

//     const recordStream = (
//         stream: MediaStream,
//         chunksRef: React.MutableRefObject<Blob[]>,
//         label: string
//     ) => {
//         console.log(`Starting ${label} audio recording`);
//         const mediaRecorder = new MediaRecorder(stream);

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 chunksRef.current.push(event.data);
//                 console.log(`${label} audio data available:`, event.data);
//             }
//         };

//         mediaRecorder.start(1000); // Collect data every 1 second

//         if (label === "Remote") {
//             remoteMediaRecorderRef.current = mediaRecorder;
//         } else {
//             localMediaRecorderRef.current = mediaRecorder;
//         }
//     };

//     const stopRecording = useCallback(() => {
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }

//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (newSession: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(newSession);

//             // Set up audio streams
//             setupAudioStream(newSession);

//             // Extract remote number from the session
//             let remoteNumber = "unknown number";
//             if (newSession) {
//                 const fromURI = newSession.remoteIdentity.uri;
//                 if (fromURI && fromURI.user) {
//                     remoteNumber = fromURI.user;
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ callerNumber: remoteNumber }),
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Greeting generated successfully");

//                     // Create MediaStream from greeting audio
//                     const greetingStream = await createMediaStreamFromAudio(
//                         data.audioUrl
//                     );

//                     // Replace local audio track with greeting audio
//                     await replaceLocalAudioTrack(newSession, greetingStream);

//                     // Start recording after replacing the track
//                     startRecording();

//                     // After the greeting finishes, switch back to the microphone audio
//                     greetingStream
//                         .getTracks()[0]
//                         .addEventListener("ended", async () => {
//                             console.log(
//                                 "Greeting audio ended, switching back to microphone"
//                             );
//                             await switchBackToMicrophone(newSession);
//                         });
//                 } else {
//                     console.error("Failed to generate greeting");
//                 }
//             } catch (error) {
//                 console.error("Error generating or playing greeting:", error);
//             }

//             // Handle session termination
//             newSession.stateChange.addListener((state: any) => {
//                 if (state === "Terminated") {
//                     console.log("Call terminated");
//                     stopAllAudioProcessing();
//                     setCallActive(false);
//                     setCallEnded(true);
//                     onHangup();
//                 }
//             });
//         },
//         [
//             userAgent,
//             setupAudioStream,
//             startRecording,
//             stopAllAudioProcessing,
//             onHangup,
//         ]
//     );

//     const handleHangup = useCallback(() => {
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const stopAudioProcessing = useCallback(() => {
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//         }
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.srcObject = null;
//             remoteAudioRef.current.pause();
//         }
//         if (localAudioRef.current) {
//             localAudioRef.current.srcObject = null;
//             localAudioRef.current.pause();
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         stopAudioProcessing();
//         setSession(null);
//         onHangup();
//     }, [userAgent, onHangup, stopAudioProcessing]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.stateChange.addListener((state: SessionState) => {
//             switch (state) {
//                 case SessionState.Established:
//                     handleCallAccepted(newSession);
//                     break;
//                 case SessionState.Terminated:
//                     handleCallTerminated();
//                     break;
//             }
//         });

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     incomingCall.stateChange.addListener(
//                         (state: SessionState) => {
//                             switch (state) {
//                                 case SessionState.Established:
//                                     handleCallAccepted(incomingCall);
//                                     break;
//                                 case SessionState.Terminated:
//                                     handleCallTerminated();
//                                     break;
//                             }
//                         }
//                     );
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const toggleMute = useCallback(() => {
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} />
//                 <audio id="localAudio" ref={localAudioRef} />

//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
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
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) =>
//                                         setOutgoingNumber(e.target.value)
//                                     }
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={handleOutgoingCall}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handleHangup}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="transcription mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 {callEnded
//                                     ? "Call Transcription"
//                                     : "Live Transcription"}
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                 {transcribedText
//                                     ? transcribedText
//                                           .split("\n")
//                                           .map((line, index) => (
//                                               <p
//                                                   key={index}
//                                                   className={
//                                                       line.startsWith(
//                                                           "Patient:"
//                                                       )
//                                                           ? "text-blue-300"
//                                                           : "text-green-300"
//                                                   }
//                                               >
//                                                   {line}
//                                               </p>
//                                           ))
//                                     : "Transcription will appear here..."}
//                             </div>
//                         </div>

//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("accept")
//                                         }
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("decline")
//                                         }
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("toVoicemail")
//                                         }
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// similar problem, greeting works when transcription doesn't and vise verse
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     // State variables
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [callEnded, setCallEnded] = useState(false);

//     // Refs for audio processing
//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

//     // Refs for recording
//     const isPlayingGreetingRef = useRef(false);
//     const greetingTextRef = useRef<string>("");

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);

//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     // State for recorded audio playback
//     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
//         string | null
//     >(null);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(async (callerNumber: string) => {
//         try {
//             console.log("Generating greeting for caller:", callerNumber);
//             const response = await fetch("/api/llpmg/generate-greeting", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     remoteCaller: { remoteNumber: callerNumber },
//                 }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Greeting generated successfully");
//                 console.log("Greeting Data:", data);
//                 return { audioUrl: data.audioUrl, text: data.greetingText };
//             } else {
//                 const errorText = await response.text();
//                 console.error(
//                     "Failed to generate greeting:",
//                     response.status,
//                     errorText
//                 );
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error generating greeting:", error);
//             return null;
//         }
//     }, []);

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<MediaStream> => {
//         try {
//             const audioContext = new AudioContext();
//             const response = await fetch(audioUrl);
//             if (!response.ok) {
//                 throw new Error(
//                     `Failed to fetch audio file: ${response.statusText}`
//                 );
//             }
//             const arrayBuffer = await response.arrayBuffer();
//             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//             const source = audioContext.createBufferSource();
//             source.buffer = audioBuffer;

//             const destination = audioContext.createMediaStreamDestination();
//             source.connect(destination);
//             source.start();

//             // Close the audio context after the source has finished playing
//             source.onended = () => {
//                 audioContext.close();
//             };

//             return destination.stream;
//         } catch (error) {
//             console.error("Error creating media stream from audio:", error);
//             throw error;
//         }
//     };

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             const audioSender = senders.find(
//                 (sender) => sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log(
//                         "Local audio track replaced with greeting audio."
//                     );
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         }
//     };

//     const switchBackToMicrophone = async (session: WebPhoneSession) => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (session.sessionDescriptionHandler) {
//                 const sdh = session.sessionDescriptionHandler as any;
//                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

//                 const newAudioTrack = stream.getAudioTracks()[0];
//                 if (!newAudioTrack) {
//                     console.error(
//                         "No audio track found in the microphone stream"
//                     );
//                     return;
//                 }

//                 const senders = peerConnection.getSenders();
//                 const audioSender = senders.find(
//                     (sender) => sender.track && sender.track.kind === "audio"
//                 );

//                 if (audioSender) {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found in peer connection.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error switching back to microphone audio:", error);
//         }
//     };

//     const startRecording = useCallback(async (session: WebPhoneSession) => {
//         console.log("Starting recording");
//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Wait for remote audio stream to be available
//         const remoteAudio = remoteAudioRef.current;
//         while (!remoteAudio || !remoteAudio.srcObject) {
//             console.log("Waiting for remote audio stream...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         console.log("Remote audio source found");

//         // Record remote audio
//         const remoteMediaRecorder = new MediaRecorder(
//             remoteAudio.srcObject as MediaStream
//         );

//         remoteMediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 remoteRecordedChunksRef.current.push(event.data);
//             }
//         };

//         remoteMediaRecorder.start();
//         remoteMediaRecorderRef.current = remoteMediaRecorder;

//         // Wait until sessionDescriptionHandler and peerConnection are available
//         let sdh: any;
//         while (!session.sessionDescriptionHandler) {
//             console.log("Waiting for sessionDescriptionHandler...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         sdh = session.sessionDescriptionHandler;

//         let peerConnection: RTCPeerConnection;
//         while (!sdh.peerConnection) {
//             console.log("Waiting for peerConnection...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         peerConnection = sdh.peerConnection;

//         console.log("PeerConnection is available");

//         // Record local audio
//         const localStream = new MediaStream();
//         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//             if (sender.track) {
//                 localStream.addTrack(sender.track);
//             }
//         });

//         if (localStream.getTracks().length > 0) {
//             const localMediaRecorder = new MediaRecorder(localStream);
//             localMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                 }
//             };
//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("No local tracks available to record");
//         }

//         // Start audio processing
//         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const setupAudioProcessing = useCallback((stream: MediaStream) => {
//         console.log("Setting up audio processing");
//         audioContextRef.current = new AudioContext();
//         sourceNodeRef.current =
//             audioContextRef.current.createMediaStreamSource(stream);
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         scriptProcessorRef.current =
//             audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         sourceNodeRef.current.connect(analyserRef.current);
//         analyserRef.current.connect(scriptProcessorRef.current);
//         scriptProcessorRef.current.connect(audioContextRef.current.destination);

//         let silenceStart: number | null = null;
//         const silenceThreshold = 0.01;
//         const silenceDuration = 1000;
//         let isTranscribing = false;

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             if (isPlayingGreetingRef.current) {
//                 // Do not process audio during the greeting
//                 return;
//             }

//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                     console.log("Silence started at:", silenceStart);
//                 } else if (
//                     Date.now() - silenceStart >= silenceDuration &&
//                     !isTranscribing
//                 ) {
//                     console.log(
//                         "Silence detected for 1 second, triggering transcription"
//                     );
//                     isTranscribing = true;
//                     transcribeAudio().then(() => {
//                         isTranscribing = false;
//                         silenceStart = null;
//                     });
//                 }
//             } else {
//                 silenceStart = null;
//             }
//         };
//     }, []);

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribing audio");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const recorder = new MediaRecorder(stream);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: "audio/webm" });
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         console.log("Sending audio to transcription API");
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );
//                         console.log(
//                             "Transcription API response status:",
//                             response.status
//                         );
//                         if (response.ok) {
//                             const data = await response.json();
//                             console.log("Transcription received:", data.result);
//                             setTranscribedText(
//                                 (prevText) =>
//                                     prevText + "\nPatient: " + data.result
//                             );
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 await response.text()
//                             );
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio:", error);
//                     }
//                 }
//             };
//         };

//         recorder.start();
//         setTimeout(() => recorder.stop(), 5000);
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (session: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(session);

//             let remoteNumber = "unknown number";
//             if (session) {
//                 const remoteIdentity = session.remoteIdentity;
//                 if (
//                     remoteIdentity &&
//                     remoteIdentity.uri &&
//                     remoteIdentity.uri.user
//                 ) {
//                     remoteNumber = remoteIdentity.uri.user;
//                 } else if (session.request) {
//                     const fromHeader = session.request.getHeader("From");
//                     if (fromHeader) {
//                         const match = fromHeader.match(/<sip:(.+?)@/);
//                         if (match && match[1]) {
//                             remoteNumber = match[1];
//                         }
//                     }
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             // Proceed only if remoteNumber is valid
//             if (remoteNumber === "unknown number") {
//                 console.error("Could not extract remote number");
//                 // Handle accordingly
//             }

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const greetingData = await generateGreeting(remoteNumber);

//                 if (greetingData) {
//                     const { audioUrl, text } = greetingData;
//                     greetingTextRef.current = text;

//                     // Create media stream from greeting audio
//                     const greetingStream =
//                         await createMediaStreamFromAudio(audioUrl);

//                     // Replace local audio track with greeting audio
//                     await replaceLocalAudioTrack(session, greetingStream);

//                     // Set the flag indicating the greeting is playing
//                     isPlayingGreetingRef.current = true;

//                     // When the greeting finishes, switch back to microphone
//                     greetingStream
//                         .getTracks()[0]
//                         .addEventListener("ended", async () => {
//                             console.log(
//                                 "Greeting audio finished playing, switching back to microphone"
//                             );
//                             await switchBackToMicrophone(session);
//                             isPlayingGreetingRef.current = false;

//                             // Append the greeting text to the transcription
//                             setTranscribedText(
//                                 (prevText) =>
//                                     prevText +
//                                     "\nSystem: " +
//                                     greetingTextRef.current
//                             );
//                         });

//                     // Start recording and audio processing
//                     await startRecording(session);
//                 } else {
//                     console.error("Failed to generate greeting");
//                     // Start recording and audio processing anyway
//                     await startRecording(session);
//                 }
//             } catch (error) {
//                 console.error("Error generating or playing greeting:", error);
//                 // Start recording and audio processing
//                 await startRecording(session);
//             }
//         },
//         [userAgent, startRecording, generateGreeting]
//     );

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.on("accepted", () => handleCallAccepted(newSession));

//         newSession.on("terminated", () => {
//             console.log("Call terminated");
//             userAgent.audioHelper.playOutgoing(false);
//             userAgent.audioHelper.playIncoming(false);
//             setCallActive(false);
//             setCallEnded(true);
//             stopRecording();
//             stopAllAudioProcessing();
//             onHangup();

//             // Create recorded audio URLs
//             if (remoteRecordedChunksRef.current.length > 0) {
//                 const remoteAudioBlob = new Blob(
//                     remoteRecordedChunksRef.current,
//                     {
//                         type: "audio/webm",
//                     }
//                 );
//                 const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                 setRemoteRecordedAudioUrl(remoteAudioUrl);
//             }

//             if (localRecordedChunksRef.current.length > 0) {
//                 const localAudioBlob = new Blob(
//                     localRecordedChunksRef.current,
//                     {
//                         type: "audio/webm",
//                     }
//                 );
//                 const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                 setLocalRecordedAudioUrl(localAudioUrl);
//             }
//         });

//         setSession(newSession);
//     }, [
//         userAgent,
//         outgoingNumber,
//         onHangup,
//         handleCallAccepted,
//         stopRecording,
//         stopAllAudioProcessing,
//     ]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     incomingCall.on("accepted", () =>
//                         handleCallAccepted(incomingCall)
//                     );
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopRecording();
//         stopAllAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();

//         // Create recorded audio URLs
//         if (remoteRecordedChunksRef.current.length > 0) {
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//             setRemoteRecordedAudioUrl(remoteAudioUrl);
//         }

//         if (localRecordedChunksRef.current.length > 0) {
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const localAudioUrl = URL.createObjectURL(localAudioBlob);
//             setLocalRecordedAudioUrl(localAudioUrl);
//         }
//     }, [session, onHangup, stopRecording, stopAllAudioProcessing]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         console.log("Adjusting volume:", direction);
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && !callEnded && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 {remoteRecordedAudioUrl && (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Remote Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={remoteRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 )}
//                                 {localRecordedAudioUrl && (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Local Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={localRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     // State variables
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [callEnded, setCallEnded] = useState(false);

//     // Refs for audio processing
//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

//     // Refs for recording
//     const isPlayingGreetingRef = useRef(false);
//     const greetingTextRef = useRef<string>("");

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);

//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     // State for recorded audio playback
//     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
//         string | null
//     >(null);

//     // Ref to control transcription during greeting playback
//     const transcriptionEnabledRef = useRef<boolean>(false);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(async (callerNumber: string) => {
//         try {
//             console.log("Generating greeting for caller:", callerNumber);
//             const response = await fetch("/api/llpmg/generate-greeting", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     remoteCaller: { remoteNumber: callerNumber },
//                 }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Greeting generated successfully");
//                 console.log("Greeting Data:", data);
//                 return { audioUrl: data.audioUrl, text: data.greetingText };
//             } else {
//                 const errorText = await response.text();
//                 console.error(
//                     "Failed to generate greeting:",
//                     response.status,
//                     errorText
//                 );
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error generating greeting:", error);
//             return null;
//         }
//     }, []);

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<MediaStream> => {
//         try {
//             const audioContext = new AudioContext();
//             const response = await fetch(audioUrl);
//             if (!response.ok) {
//                 throw new Error(
//                     `Failed to fetch audio file: ${response.statusText}`
//                 );
//             }
//             const arrayBuffer = await response.arrayBuffer();
//             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//             const source = audioContext.createBufferSource();
//             source.buffer = audioBuffer;

//             const destination = audioContext.createMediaStreamDestination();
//             source.connect(destination);
//             source.start();

//             // Close the audio context after the source has finished playing
//             source.onended = () => {
//                 audioContext.close();
//             };

//             return destination.stream;
//         } catch (error) {
//             console.error("Error creating media stream from audio:", error);
//             throw error;
//         }
//     };

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             const audioSender = senders.find(
//                 (sender) => sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log(
//                         "Local audio track replaced with greeting audio."
//                     );
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         }
//     };

//     const switchBackToMicrophone = async (session: WebPhoneSession) => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (session.sessionDescriptionHandler) {
//                 const sdh = session.sessionDescriptionHandler as any;
//                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

//                 const newAudioTrack = stream.getAudioTracks()[0];
//                 if (!newAudioTrack) {
//                     console.error(
//                         "No audio track found in the microphone stream"
//                     );
//                     return;
//                 }

//                 const senders = peerConnection.getSenders();
//                 const audioSender = senders.find(
//                     (sender) => sender.track && sender.track.kind === "audio"
//                 );

//                 if (audioSender) {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found in peer connection.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error switching back to microphone audio:", error);
//         }
//     };

//     const startRecording = useCallback(async (session: WebPhoneSession) => {
//         console.log("Starting recording");
//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Wait for remote audio stream to be available
//         let remoteAudio = remoteAudioRef.current;
//         while (!remoteAudio || !remoteAudio.srcObject) {
//             console.log("Waiting for remote audio stream...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//             remoteAudio = remoteAudioRef.current;
//         }
//         console.log("Remote audio source found");

//         // Record remote audio
//         const remoteMediaRecorder = new MediaRecorder(
//             remoteAudio.srcObject as MediaStream
//         );

//         remoteMediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 remoteRecordedChunksRef.current.push(event.data);
//             }
//         };

//         remoteMediaRecorder.start();
//         remoteMediaRecorderRef.current = remoteMediaRecorder;

//         // Wait until sessionDescriptionHandler and peerConnection are available
//         let sdh: any;
//         while (!session.sessionDescriptionHandler) {
//             console.log("Waiting for sessionDescriptionHandler...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         sdh = session.sessionDescriptionHandler;

//         let peerConnection: RTCPeerConnection;
//         while (!sdh.peerConnection) {
//             console.log("Waiting for peerConnection...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         peerConnection = sdh.peerConnection;

//         console.log("PeerConnection is available");

//         // Record local audio
//         const localStream = new MediaStream();
//         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//             if (sender.track) {
//                 localStream.addTrack(sender.track);
//             }
//         });

//         if (localStream.getTracks().length > 0) {
//             const localMediaRecorder = new MediaRecorder(localStream);
//             localMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                 }
//             };
//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("No local tracks available to record");
//         }

//         // Start audio processing
//         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const setupAudioProcessing = useCallback((stream: MediaStream) => {
//         console.log("Setting up audio processing");
//         audioContextRef.current = new AudioContext();
//         sourceNodeRef.current =
//             audioContextRef.current.createMediaStreamSource(stream);
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         scriptProcessorRef.current =
//             audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         sourceNodeRef.current.connect(analyserRef.current);
//         analyserRef.current.connect(scriptProcessorRef.current);
//         scriptProcessorRef.current.connect(audioContextRef.current.destination);

//         let silenceStart: number | null = null;
//         const silenceThreshold = 0.01;
//         const silenceDuration = 1000;
//         let isTranscribing = false;

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             if (!transcriptionEnabledRef.current) {
//                 return; // Skip processing until transcription is enabled
//             }

//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                     console.log("Silence started at:", silenceStart);
//                 } else if (
//                     Date.now() - silenceStart >= silenceDuration &&
//                     !isTranscribing
//                 ) {
//                     console.log(
//                         "Silence detected for 1 second, triggering transcription"
//                     );
//                     isTranscribing = true;
//                     transcribeAudio().then(() => {
//                         isTranscribing = false;
//                         silenceStart = null;
//                     });
//                 }
//             } else {
//                 silenceStart = null;
//             }
//         };
//     }, []);

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const transcribeAudio = useCallback(async () => {
//         console.log("transcribeAudio function called");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const options = { mimeType: "audio/webm;codecs=opus" };

//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             return;
//         }

//         const recorder = new MediaRecorder(stream, options);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             console.log("Data available from recorder:", event.data.size);
//             if (event.data.size > 0) {
//                 chunks.push(event.data);
//             }
//         };

//         recorder.onerror = (event) => {
//             console.error("Recorder error:", event);
//         };

//         recorder.onstop = async () => {
//             console.log("Recorder stopped");
//             const audioBlob = new Blob(chunks, { type: options.mimeType });
//             const formData = new FormData();
//             formData.append("audio", audioBlob, "audio.webm");

//             try {
//                 console.log("Sending audio to transcription API");
//                 const response = await fetch("/api/llpmg/speech-to-text", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 console.log(
//                     "Transcription API response status:",
//                     response.status
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Transcription received:", data.result);
//                     setTranscribedText(
//                         (prevText) => prevText + "\nPatient: " + data.result
//                     );
//                 } else {
//                     const errorText = await response.text();
//                     console.error("Failed to transcribe audio:", errorText);
//                 }
//             } catch (error) {
//                 console.error("Error transcribing audio:", error);
//             }
//         };

//         recorder.start();

//         setTimeout(() => {
//             console.log("Stopping recorder after 5 seconds");
//             recorder.stop();
//         }, 5000);
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (session: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(session);

//             // Extract remote number from the session
//             let remoteNumber = "unknown number";
//             if (session) {
//                 const remoteIdentity = session.remoteIdentity;
//                 if (
//                     remoteIdentity &&
//                     remoteIdentity.uri &&
//                     remoteIdentity.uri.user
//                 ) {
//                     remoteNumber = remoteIdentity.uri.user;
//                 } else if (session.request) {
//                     const fromHeader = session.request.getHeader("From");
//                     if (fromHeader) {
//                         const match = fromHeader.match(/<sip:(.+?)@/);
//                         if (match && match[1]) {
//                             remoteNumber = match[1];
//                         }
//                     }
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             // Start recording immediately
//             await startRecording(session);

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const greetingData = await generateGreeting(remoteNumber);

//                 if (greetingData) {
//                     const { audioUrl, text } = greetingData;
//                     greetingTextRef.current = text;
//                     console.log("Greeting audio URL:", audioUrl);

//                     // Create media stream from greeting audio
//                     const greetingStream =
//                         await createMediaStreamFromAudio(audioUrl);

//                     // Replace local audio track with greeting audio
//                     await replaceLocalAudioTrack(session, greetingStream);

//                     // Set flags
//                     console.log("Setting isPlayingGreetingRef to true");
//                     isPlayingGreetingRef.current = true;
//                     transcriptionEnabledRef.current = false;

//                     greetingStream
//                         .getTracks()[0]
//                         .addEventListener("ended", async () => {
//                             console.log("Greeting audio ended");
//                             await switchBackToMicrophone(session);
//                             isPlayingGreetingRef.current = false;
//                             console.log(
//                                 "Setting isPlayingGreetingRef to false"
//                             );
//                             transcriptionEnabledRef.current = true;

//                             // Append the greeting text to the transcription
//                             setTranscribedText(
//                                 (prevText) =>
//                                     prevText +
//                                     "\nSystem: " +
//                                     greetingTextRef.current
//                             );
//                         });
//                 } else {
//                     console.error("Failed to generate greeting");
//                     transcriptionEnabledRef.current = true;
//                 }
//             } catch (error) {
//                 console.error("Error generating or playing greeting:", error);
//                 transcriptionEnabledRef.current = true;
//             }
//         },
//         [userAgent, startRecording, generateGreeting]
//     );

//     const handleCallTerminated = useCallback(
//         (session: WebPhoneSession) => {
//             try {
//                 console.log("Call terminated");
//                 userAgent?.audioHelper.playOutgoing(false);
//                 userAgent?.audioHelper.playIncoming(false);
//                 setCallActive(false);
//                 setCallEnded(true);
//                 stopRecording();
//                 stopAllAudioProcessing();
//                 onHangup();

//                 // Create recorded audio URLs
//                 if (remoteRecordedChunksRef.current.length > 0) {
//                     const remoteAudioBlob = new Blob(
//                         remoteRecordedChunksRef.current,
//                         {
//                             type: "audio/webm",
//                         }
//                     );
//                     const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                     setRemoteRecordedAudioUrl(remoteAudioUrl);
//                 }

//                 if (localRecordedChunksRef.current.length > 0) {
//                     const localAudioBlob = new Blob(
//                         localRecordedChunksRef.current,
//                         {
//                             type: "audio/webm",
//                         }
//                     );
//                     const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                     setLocalRecordedAudioUrl(localAudioUrl);
//                 }
//             } catch (error) {
//                 console.error("Error during call termination:", error);
//             }
//         },
//         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
//     );

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.on("accepted", () => handleCallAccepted(newSession));
//         newSession.on("terminated", () => handleCallTerminated(newSession));

//         setSession(newSession);
//     }, [
//         userAgent,
//         outgoingNumber,
//         handleCallAccepted,
//         handleCallTerminated,
//         setSession,
//     ]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     incomingCall.on("accepted", () =>
//                         handleCallAccepted(incomingCall)
//                     );
//                     incomingCall.on("terminated", () =>
//                         handleCallTerminated(incomingCall)
//                     );
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopRecording();
//         stopAllAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();

//         // Create recorded audio URLs
//         if (remoteRecordedChunksRef.current.length > 0) {
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//             setRemoteRecordedAudioUrl(remoteAudioUrl);
//         }

//         if (localRecordedChunksRef.current.length > 0) {
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             const localAudioUrl = URL.createObjectURL(localAudioBlob);
//             setLocalRecordedAudioUrl(localAudioUrl);
//         }
//     }, [session, stopRecording, stopAllAudioProcessing, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         console.log("Adjusting volume:", direction);
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && !callEnded && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 {remoteRecordedAudioUrl && (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Remote Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={remoteRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 )}
//                                 {localRecordedAudioUrl && (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Local Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={localRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     // State variables
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [callEnded, setCallEnded] = useState(false);

//     // Refs for audio processing
//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

//     // Refs for recording
//     const isPlayingGreetingRef = useRef(false);
//     const greetingTextRef = useRef<string>("");

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);

//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     // State for recorded audio playback
//     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
//         string | null
//     >(null);

//     // Ref to control transcription during greeting playback
//     const transcriptionEnabledRef = useRef<boolean>(false);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(async (callerNumber: string) => {
//         try {
//             console.log("Generating greeting for caller:", callerNumber);
//             const response = await fetch("/api/llpmg/generate-greeting", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     callerNumber: { remoteNumber: callerNumber },
//                 }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Greeting generated successfully");
//                 console.log("Greeting Data:", data);
//                 return { audioUrl: data.audioUrl, text: data.greetingText };
//             } else {
//                 const errorText = await response.text();
//                 console.error(
//                     "Failed to generate greeting:",
//                     response.status,
//                     errorText
//                 );
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error generating greeting:", error);
//             return null;
//         }
//     }, []);

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<MediaStream> => {
//         try {
//             const audioContext = new AudioContext();
//             const response = await fetch(audioUrl);
//             if (!response.ok) {
//                 throw new Error(
//                     `Failed to fetch audio file: ${response.statusText}`
//                 );
//             }
//             const arrayBuffer = await response.arrayBuffer();
//             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//             const source = audioContext.createBufferSource();
//             source.buffer = audioBuffer;

//             const destination = audioContext.createMediaStreamDestination();
//             source.connect(destination);
//             source.start();

//             // Close the audio context after the source has finished playing
//             source.onended = () => {
//                 audioContext.close();
//             };

//             return destination.stream;
//         } catch (error) {
//             console.error("Error creating media stream from audio:", error);
//             throw error;
//         }
//     };

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             const audioSender = senders.find(
//                 (sender) => sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log(
//                         "Local audio track replaced with greeting audio."
//                     );
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         }
//     };

//     const switchBackToMicrophone = async (session: WebPhoneSession) => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (session.sessionDescriptionHandler) {
//                 const sdh = session.sessionDescriptionHandler as any;
//                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

//                 const newAudioTrack = stream.getAudioTracks()[0];
//                 if (!newAudioTrack) {
//                     console.error(
//                         "No audio track found in the microphone stream"
//                     );
//                     return;
//                 }

//                 const senders = peerConnection.getSenders();
//                 const audioSender = senders.find(
//                     (sender) => sender.track && sender.track.kind === "audio"
//                 );

//                 if (audioSender) {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found in peer connection.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error switching back to microphone audio:", error);
//         }
//     };

//     const startRecording = useCallback(async (session: WebPhoneSession) => {
//         console.log("startRecording function called");
//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Wait for remote audio stream to be available
//         let remoteAudio = remoteAudioRef.current;
//         while (!remoteAudio || !remoteAudio.srcObject) {
//             console.log("Waiting for remote audio stream...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//             remoteAudio = remoteAudioRef.current;
//         }
//         console.log("Remote audio source found");

//         const options = { mimeType: "audio/webm;codecs=opus" };

//         // Record remote audio
//         const remoteMediaRecorder = new MediaRecorder(
//             remoteAudio.srcObject as MediaStream,
//             options
//         );
//         remoteMediaRecorder.ondataavailable = (event) => {
//             console.log("Remote data available:", event.data.size);
//             if (event.data.size > 0) {
//                 remoteRecordedChunksRef.current.push(event.data);
//             }
//         };
//         remoteMediaRecorder.onerror = (event) => {
//             console.error("Remote recorder error:", event);
//         };
//         remoteMediaRecorder.start();
//         remoteMediaRecorderRef.current = remoteMediaRecorder;

//         // Wait until sessionDescriptionHandler and peerConnection are available
//         let sdh: any;
//         while (!session.sessionDescriptionHandler) {
//             console.log("Waiting for sessionDescriptionHandler...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         sdh = session.sessionDescriptionHandler;

//         let peerConnection: RTCPeerConnection;
//         while (!sdh.peerConnection) {
//             console.log("Waiting for peerConnection...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         peerConnection = sdh.peerConnection;

//         console.log("PeerConnection is available");

//         // Record local audio
//         const localStream = new MediaStream();
//         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//             if (sender.track) {
//                 localStream.addTrack(sender.track);
//             }
//         });

//         if (localStream.getTracks().length > 0) {
//             const localMediaRecorder = new MediaRecorder(localStream, options);
//             localMediaRecorder.ondataavailable = (event) => {
//                 console.log("Local data available:", event.data.size);
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                 }
//             };
//             localMediaRecorder.onerror = (event) => {
//                 console.error("Local recorder error:", event);
//             };
//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("No local tracks available to record");
//         }

//         // Start audio processing
//         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const setupAudioProcessing = useCallback((stream: MediaStream) => {
//         console.log("Setting up audio processing");
//         audioContextRef.current = new AudioContext();
//         sourceNodeRef.current =
//             audioContextRef.current.createMediaStreamSource(stream);
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         scriptProcessorRef.current =
//             audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         sourceNodeRef.current.connect(analyserRef.current);
//         analyserRef.current.connect(scriptProcessorRef.current);
//         scriptProcessorRef.current.connect(audioContextRef.current.destination);

//         let silenceStart: number | null = null;
//         const silenceThreshold = 0.001; // Lower threshold to detect quieter speech
//         const silenceDuration = 500; // Shorter duration to make transcription more responsive
//         let isTranscribing = false;

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             if (!transcriptionEnabledRef.current) {
//                 return; // Skip processing until transcription is enabled
//             }

//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;
//             console.log("Audio average level:", average);

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                     console.log("Silence started at:", silenceStart);
//                 } else if (
//                     Date.now() - silenceStart >= silenceDuration &&
//                     !isTranscribing
//                 ) {
//                     console.log("Silence detected, triggering transcription");
//                     isTranscribing = true;
//                     transcribeAudio().then(() => {
//                         isTranscribing = false;
//                         silenceStart = null;
//                     });
//                 }
//             } else {
//                 silenceStart = null;
//             }
//         };
//     }, []);

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const transcribeAudio = useCallback(async () => {
//         console.log("transcribeAudio function called");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const options = { mimeType: "audio/webm;codecs=opus" };

//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             return;
//         }

//         const recorder = new MediaRecorder(stream, options);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             console.log("Data available from recorder:", event.data.size);
//             if (event.data.size > 0) {
//                 chunks.push(event.data);
//             }
//         };

//         recorder.onerror = (event) => {
//             console.error("Recorder error:", event);
//         };

//         recorder.onstop = async () => {
//             console.log("Recorder stopped");
//             const audioBlob = new Blob(chunks, { type: options.mimeType });
//             const formData = new FormData();
//             formData.append("audio", audioBlob, "audio.webm");

//             try {
//                 console.log("Sending audio to transcription API");
//                 const response = await fetch("/api/llpmg/speech-to-text", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 console.log(
//                     "Transcription API response status:",
//                     response.status
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Transcription received:", data.result);
//                     setTranscribedText(
//                         (prevText) => prevText + "\nPatient: " + data.result
//                     );
//                 } else {
//                     const errorText = await response.text();
//                     console.error("Failed to transcribe audio:", errorText);
//                 }
//             } catch (error) {
//                 console.error("Error transcribing audio:", error);
//             }
//         };

//         recorder.start();

//         setTimeout(() => {
//             console.log("Stopping recorder after 5 seconds");
//             recorder.stop();
//         }, 5000);
//     }, []);

//     const handleCallAccepted = useCallback(
//         async (session: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(session);

//             // Extract remote number from the session
//             let remoteNumber = "unknown number";
//             if (session) {
//                 const remoteIdentity = session.remoteIdentity;
//                 if (
//                     remoteIdentity &&
//                     remoteIdentity.uri &&
//                     remoteIdentity.uri.user
//                 ) {
//                     remoteNumber = remoteIdentity.uri.user;
//                 } else if (session.request) {
//                     const fromHeader = session.request.getHeader("From");
//                     if (fromHeader) {
//                         const match = fromHeader.match(/<sip:(.+?)@/);
//                         if (match && match[1]) {
//                             remoteNumber = match[1];
//                         }
//                     }
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             // Start recording immediately
//             await startRecording(session);

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const greetingData = await generateGreeting(remoteNumber);

//                 if (greetingData) {
//                     const { audioUrl, text } = greetingData;
//                     greetingTextRef.current = text;
//                     console.log("Greeting audio URL:", audioUrl);

//                     // Create media stream from greeting audio
//                     const greetingStream =
//                         await createMediaStreamFromAudio(audioUrl);

//                     // Replace local audio track with greeting audio
//                     await replaceLocalAudioTrack(session, greetingStream);

//                     // Set flags
//                     console.log("Setting isPlayingGreetingRef to true");
//                     isPlayingGreetingRef.current = true;
//                     transcriptionEnabledRef.current = false;

//                     greetingStream
//                         .getTracks()[0]
//                         .addEventListener("ended", async () => {
//                             console.log("Greeting audio ended");
//                             await switchBackToMicrophone(session);
//                             isPlayingGreetingRef.current = false;
//                             console.log(
//                                 "Setting isPlayingGreetingRef to false"
//                             );
//                             transcriptionEnabledRef.current = true;

//                             // Append the greeting text to the transcription
//                             setTranscribedText(
//                                 (prevText) =>
//                                     prevText +
//                                     "\nSystem: " +
//                                     greetingTextRef.current
//                             );
//                         });
//                 } else {
//                     console.error("Failed to generate greeting");
//                     transcriptionEnabledRef.current = true;
//                 }
//             } catch (error) {
//                 console.error("Error generating or playing greeting:", error);
//                 transcriptionEnabledRef.current = true;
//             }
//         },
//         [userAgent, startRecording, generateGreeting]
//     );

//     const handleCallTerminated = useCallback(
//         (session: WebPhoneSession) => {
//             try {
//                 console.log("Call terminated");
//                 userAgent?.audioHelper.playOutgoing(false);
//                 userAgent?.audioHelper.playIncoming(false);
//                 setCallActive(false);
//                 setCallEnded(true);
//                 stopRecording();
//                 stopAllAudioProcessing();
//                 onHangup();

//                 // Create recorded audio URLs
//                 if (remoteRecordedChunksRef.current.length > 0) {
//                     console.log("Creating remote audio blob");
//                     const remoteAudioBlob = new Blob(
//                         remoteRecordedChunksRef.current,
//                         {
//                             type: "audio/webm;codecs=opus",
//                         }
//                     );
//                     const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                     setRemoteRecordedAudioUrl(remoteAudioUrl);
//                     console.log("Remote audio URL set:", remoteAudioUrl);
//                 } else {
//                     console.log("No remote audio recorded");
//                 }

//                 if (localRecordedChunksRef.current.length > 0) {
//                     console.log("Creating local audio blob");
//                     const localAudioBlob = new Blob(
//                         localRecordedChunksRef.current,
//                         {
//                             type: "audio/webm;codecs=opus",
//                         }
//                     );
//                     const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                     setLocalRecordedAudioUrl(localAudioUrl);
//                     console.log("Local audio URL set:", localAudioUrl);
//                 } else {
//                     console.log("No local audio recorded");
//                 }
//             } catch (error) {
//                 console.error("Error during call termination:", error);
//             }
//         },
//         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
//     );

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.on("accepted", () => handleCallAccepted(newSession));
//         newSession.on("terminated", () => handleCallTerminated(newSession));

//         setSession(newSession);
//     }, [
//         userAgent,
//         outgoingNumber,
//         handleCallAccepted,
//         handleCallTerminated,
//         setSession,
//     ]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     incomingCall.on("accepted", () =>
//                         handleCallAccepted(incomingCall)
//                     );
//                     incomingCall.on("terminated", () =>
//                         handleCallTerminated(incomingCall)
//                     );
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("Hanging up call");
//         if (session) {
//             session.dispose();
//         }
//         stopRecording();
//         stopAllAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();

//         // Create recorded audio URLs
//         if (remoteRecordedChunksRef.current.length > 0) {
//             console.log("Creating remote audio blob");
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm;codecs=opus",
//             });
//             const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//             setRemoteRecordedAudioUrl(remoteAudioUrl);
//             console.log("Remote audio URL set:", remoteAudioUrl);
//         } else {
//             console.log("No remote audio recorded");
//         }

//         if (localRecordedChunksRef.current.length > 0) {
//             console.log("Creating local audio blob");
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm;codecs=opus",
//             });
//             const localAudioUrl = URL.createObjectURL(localAudioBlob);
//             setLocalRecordedAudioUrl(localAudioUrl);
//             console.log("Local audio URL set:", localAudioUrl);
//         } else {
//             console.log("No local audio recorded");
//         }
//     }, [session, stopRecording, stopAllAudioProcessing, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         console.log("Adjusting volume:", direction);
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && !callEnded && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 {remoteRecordedAudioUrl ? (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Remote Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={remoteRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-400">
//                                         No remote audio recorded.
//                                     </p>
//                                 )}
//                                 {localRecordedAudioUrl ? (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Local Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={localRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-400">
//                                         No local audio recorded.
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// working transcription, not working audio to phone
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

interface SipSpeechComponentProps {
    onHangup: () => void;
    initiateAuth: () => void;
    tokenData: any;
    onLogout: () => void;
    setTokenData: (data: any) => void;
}

const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
    onHangup,
    initiateAuth,
    tokenData,
    onLogout,
    setTokenData,
}) => {
    const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
    const [session, setSession] = useState<WebPhoneSession | null>(null);
    const [muted, setMuted] = useState(false);
    const [held, setHeld] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
        null
    );
    const [outgoingNumber, setOutgoingNumber] = useState<string>("");
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [transcribedText, setTranscribedText] = useState<string>("");
    const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
    const [callEnded, setCallEnded] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        console.log("SipSpeechComponent mounted");
        remoteAudioRef.current = document.getElementById(
            "remoteAudio"
        ) as HTMLAudioElement;
        if (remoteAudioRef.current) {
            remoteAudioRef.current.onloadedmetadata = () => {
                remoteAudioRef.current!.muted = false;
            };
        }
        if (tokenData) {
            console.log("TokenData available, initializing WebPhone");
            const parsedTokenData =
                typeof tokenData === "string"
                    ? JSON.parse(tokenData)
                    : tokenData;
            initializeWebPhone(parsedTokenData);
        }
        return () => {
            console.log("SipSpeechComponent unmounting");
            stopAllAudioProcessing();
        };
    }, [tokenData]);

    const initializeWebPhone = useCallback(async (tokenData: any) => {
        try {
            console.log("Starting WebPhone Initialization...");
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
            console.log("SIP Provision Data received:", sipProvisionData);

            if (!sipProvisionData) {
                throw new Error("SIP Provision Data is undefined");
            }

            const parsedSipProvisionData = JSON.parse(sipProvisionData);
            console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

            if (
                !parsedSipProvisionData.sipInfo ||
                !parsedSipProvisionData.sipInfo.length
            ) {
                throw new Error("Parsed SIP Info is missing or incomplete");
            }

            const options: WebPhoneOptions = {
                logLevel: 1 as 0 | 1 | 2 | 3,
                appName: "LLPMG WebPhone",
                appVersion: "1.0.0",
                media: {
                    remote: remoteAudioRef.current as HTMLAudioElement,
                    local: document.getElementById(
                        "localAudio"
                    ) as HTMLAudioElement,
                },
                audioHelper: {
                    enabled: true,
                    incoming: "/llpmg/audio/incoming.ogg",
                    outgoing: "/llpmg/audio/outgoing.ogg",
                },
            };

            console.log("Creating WebPhone instance with options:", options);
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
                    webPhone.userAgent.audioHelper.playIncoming(true);
                }
            );

            webPhone.userAgent.start();
            setUserAgent(webPhone.userAgent);
        } catch (error) {
            console.error("Failed to initialize WebPhone:", error);
            setConnectionError(
                `Failed to initialize WebPhone: ${(error as Error).message}`
            );
        }
    }, []);

    const generateGreeting = useCallback(async (callerNumber: string) => {
        try {
            console.log("Generating greeting for caller:", callerNumber);
            const response = await fetch("/api/llpmg/generate-greeting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ callerNumber }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Greeting generated successfully");
                return data.audioUrl;
            } else {
                console.error("Failed to generate greeting");
                return null;
            }
        } catch (error) {
            console.error("Error generating greeting:", error);
            return null;
        }
    }, []);

    const playGreeting = useCallback(async (audioUrl: string) => {
        console.log("Playing greeting");
        const audio = new Audio(audioUrl);
        await audio.play();
        return new Promise((resolve) => {
            audio.onended = resolve;
        });
    }, []);

    const startRecording = useCallback(() => {
        console.log("Starting recording");
        recordedChunksRef.current = [];
        const remoteAudio = remoteAudioRef.current;

        if (remoteAudio && remoteAudio.srcObject) {
            console.log("Remote audio source found");
            const mediaRecorder = new MediaRecorder(
                remoteAudio.srcObject as MediaStream
            );

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setupAudioProcessing(remoteAudio.srcObject as MediaStream);
        } else {
            console.error("Remote audio source not found");
        }
    }, []);

    const stopRecording = useCallback(() => {
        console.log("Stopping recording");
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(recordedChunksRef.current, {
                    type: "audio/webm",
                });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudio(audioUrl);
                console.log("Audio recording saved");
            };
        }
    }, []);

    const setupAudioProcessing = useCallback((stream: MediaStream) => {
        console.log("Setting up audio processing");
        audioContextRef.current = new AudioContext();
        sourceNodeRef.current =
            audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        scriptProcessorRef.current =
            audioContextRef.current.createScriptProcessor(4096, 1, 1);

        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(audioContextRef.current.destination);

        let silenceStart: number | null = null;
        const silenceThreshold = 0.01;
        const silenceDuration = 1000;
        let isTranscribing = false;

        scriptProcessorRef.current.onaudioprocess = (event) => {
            const input = event.inputBuffer.getChannelData(0);
            const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
            const average = sum / input.length;

            if (average < silenceThreshold) {
                if (silenceStart === null) {
                    silenceStart = Date.now();
                    console.log("Silence started at:", silenceStart);
                } else if (
                    Date.now() - silenceStart >= silenceDuration &&
                    !isTranscribing
                ) {
                    console.log(
                        "Silence detected for 1 second, triggering transcription"
                    );
                    isTranscribing = true;
                    transcribeAudio().then(() => {
                        isTranscribing = false;
                        silenceStart = null;
                    });
                }
            } else {
                silenceStart = null;
            }
        };
    }, []);

    const stopAllAudioProcessing = useCallback(() => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const transcribeAudio = useCallback(async () => {
        console.log("Transcribing audio");
        if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
            console.error(
                "Remote audio source not available for transcription"
            );
            return;
        }

        const stream = remoteAudioRef.current.srcObject as MediaStream;
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                if (typeof reader.result === "string") {
                    const base64Audio = reader.result.split(",")[1];
                    try {
                        console.log("Sending audio to transcription API");
                        const response = await fetch(
                            "/api/llpmg/speech-to-text",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ audio: base64Audio }),
                            }
                        );
                        console.log(
                            "Transcription API response status:",
                            response.status
                        );
                        if (response.ok) {
                            const data = await response.json();
                            console.log("Transcription received:", data.result);
                            setTranscribedText(
                                (prevText) => prevText + " " + data.result
                            );
                        } else {
                            console.error(
                                "Failed to transcribe audio",
                                await response.text()
                            );
                        }
                    } catch (error) {
                        console.error("Error transcribing audio:", error);
                    }
                }
            };
        };

        recorder.start();
        setTimeout(() => recorder.stop(), 5000);
    }, []);

    const handleCallAccepted = useCallback(
        async (message: any) => {
            console.log("Call accepted - User has answered the call");
            console.log(
                "Telephony Session Info:",
                message.headers["P-Rc-Api-Ids"] ||
                    message.headers["p-rc-api-ids"]
            );
            userAgent?.audioHelper.playOutgoing(false);
            userAgent?.audioHelper.playIncoming(false);
            setCallActive(true);
            setCallEnded(false);

            // Extract remote number from the session
            let remoteNumber = "unknown number";
            if (session) {
                if ("request" in session && session.request) {
                    const fromHeader = session.request.getHeader("From");
                    if (fromHeader) {
                        const match = fromHeader.match(/<sip:(.+)@/);
                        if (match && match[1]) {
                            remoteNumber = match[1];
                        }
                    }
                } else if (
                    "remoteIdentity" in session &&
                    session.remoteIdentity
                ) {
                    remoteNumber =
                        session.remoteIdentity.uri.user || "unknown number";
                }
            }
            console.log("Remote number (caller):", remoteNumber);

            try {
                console.log("Generating greeting for caller:", remoteNumber);
                const response = await fetch("/api/llpmg/generate-greeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        remoteCaller: { callerNumber: remoteNumber },
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Greeting generated successfully");

                    // Play the greeting
                    console.log("Playing greeting");
                    const audio = new Audio(data.audioUrl);
                    await audio.play();
                    console.log("Greeting playback completed");
                } else {
                    console.error("Failed to generate greeting");
                }
            } catch (error) {
                console.error("Error generating or playing greeting:", error);
            }

            startRecording();
            console.log("Starting audio recording and processing");

            console.log("Attempting immediate test transcription");
            await transcribeAudio();
        },
        [userAgent, session, startRecording, transcribeAudio]
    );

    const handleOutgoingCall = useCallback(() => {
        if (!userAgent || !outgoingNumber) {
            console.error("UserAgent or outgoing number is missing");
            setConnectionError("Please enter a valid phone number");
            return;
        }

        console.log("Placing call to:", outgoingNumber);
        userAgent.audioHelper.playOutgoing(true);

        const session = userAgent.invite(outgoingNumber, {});

        session.on("accepted", handleCallAccepted);

        session.on("terminated", () => {
            console.log("Call terminated");
            userAgent.audioHelper.playOutgoing(false);
            userAgent.audioHelper.playIncoming(false);
            setCallActive(false);
            setCallEnded(true);
            stopRecording();
            stopAllAudioProcessing();
            onHangup();
        });

        setSession(session);
    }, [
        userAgent,
        outgoingNumber,
        onHangup,
        handleCallAccepted,
        stopRecording,
        stopAllAudioProcessing,
    ]);

    const handleIncomingCall = useCallback(
        (action: "accept" | "decline" | "toVoicemail") => {
            if (!incomingCall) {
                console.error("No incoming call to handle");
                return;
            }

            console.log("Handling incoming call:", action);
            userAgent?.audioHelper.playIncoming(false);

            switch (action) {
                case "accept":
                    console.log("Accepting incoming call");
                    incomingCall.accept();
                    setSession(incomingCall);
                    incomingCall.on("accepted", handleCallAccepted);
                    break;
                case "decline":
                    incomingCall.reject();
                    break;
                case "toVoicemail":
                    incomingCall.toVoicemail?.();
                    break;
            }

            setIncomingCall(null);
        },
        [incomingCall, userAgent, handleCallAccepted]
    );

    const handleHangup = useCallback(() => {
        console.log("Hanging up call");
        if (session) {
            session.dispose();
        }
        stopAllAudioProcessing();
        setSession(null);
        setCallActive(false);
        setCallEnded(true);
        onHangup();
    }, [session, onHangup, stopAllAudioProcessing]);

    const toggleMute = useCallback(() => {
        console.log("Toggling mute");
        if (session) {
            if (muted) {
                session.unmute?.();
            } else {
                session.mute?.();
            }
            setMuted(!muted);
        }
    }, [session, muted]);

    const toggleHold = useCallback(() => {
        console.log("Toggling hold");
        if (session) {
            if (held) {
                session.unhold?.();
            } else {
                session.hold?.();
            }
            setHeld(!held);
        }
    }, [session, held]);

    const handlePark = useCallback(() => {
        console.log("Parking call");
        if (session) {
            session.park?.();
        }
    }, [session]);

    const handleTransfer = useCallback(() => {
        console.log("Initiating transfer");
        if (session) {
            const transferNumber = prompt("Enter the number to transfer to:");
            if (transferNumber) {
                console.log("Transferring to:", transferNumber);
                session.transfer?.(transferNumber);
            }
        }
    }, [session]);

    const handleFlip = useCallback(() => {
        console.log("Initiating flip");
        if (session) {
            const flipNumber = prompt("Enter the number to flip to:");
            if (flipNumber) {
                console.log("Flipping to:", flipNumber);
                session.flip?.(flipNumber);
            }
        }
    }, [session]);

    const handleDTMF = useCallback(() => {
        console.log("Sending DTMF");
        if (session) {
            const digit = prompt("Enter the DTMF digit:");
            if (digit) {
                console.log("Sending DTMF digit:", digit);
                session.dtmf?.(digit);
            }
        }
    }, [session]);

    const adjustVolume = useCallback((direction: number) => {
        console.log("Adjusting volume:", direction);
        if (remoteAudioRef.current) {
            remoteAudioRef.current.volume = Math.min(
                Math.max(remoteAudioRef.current.volume + direction, 0),
                1
            );
            console.log("New volume:", remoteAudioRef.current.volume);
        }
    }, []);

    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-6">
            <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
                <audio id="remoteAudio" ref={remoteAudioRef} hidden />
                <audio id="localAudio" hidden muted />
                {connectionError && (
                    <div className="text-red-500 text-sm mb-4">
                        {connectionError}
                    </div>
                )}
                {!isAuthenticated ? (
                    <div className="auth flex flex-col items-center">
                        <button
                            onClick={() => {
                                console.log("Initiating authentication");
                                initiateAuth();
                            }}
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
                            onClick={() => {
                                console.log("Logging out");
                                onLogout();
                            }}
                            className="text-sm text-gray-400 hover:text-white mb-4"
                        >
                            Logout
                        </button>
                        {!callActive && !callEnded && (
                            <div className="outgoing-call mt-4">
                                <h4 className="text-white text-xl mb-3">
                                    Outgoing Call
                                </h4>
                                <input
                                    type="text"
                                    value={outgoingNumber}
                                    onChange={(e) => {
                                        console.log(
                                            "Outgoing number changed:",
                                            e.target.value
                                        );
                                        setOutgoingNumber(e.target.value);
                                    }}
                                    placeholder="+1 234 567-8900"
                                    className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                <button
                                    onClick={() => {
                                        console.log("Initiating outgoing call");
                                        handleOutgoingCall();
                                    }}
                                    className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    Call
                                </button>
                            </div>
                        )}
                        {callActive && (
                            <div className="active-call mt-6">
                                <h4 className="text-white text-xl mb-4">
                                    Call In Progress
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={toggleMute}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        {muted ? "Unmute" : "Mute"}
                                    </button>
                                    <button
                                        onClick={toggleHold}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        {held ? "Unhold" : "Hold"}
                                    </button>
                                    <button
                                        onClick={handlePark}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Park
                                    </button>
                                    <button
                                        onClick={handleTransfer}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Transfer
                                    </button>
                                    <button
                                        onClick={handleFlip}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Flip
                                    </button>
                                    <button
                                        onClick={handleDTMF}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Send DTMF
                                    </button>
                                    <button
                                        onClick={() => adjustVolume(0.1)}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        + Volume
                                    </button>
                                    <button
                                        onClick={() => adjustVolume(-0.1)}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        - Volume
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log("Hanging up call");
                                            handleHangup();
                                        }}
                                        className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Hang Up
                                    </button>
                                </div>
                            </div>
                        )}
                        {(callActive || callEnded) && (
                            <div className="transcription mt-6">
                                <h4 className="text-white text-xl mb-4">
                                    {callEnded
                                        ? "Call Transcription"
                                        : "Live Transcription"}
                                </h4>
                                <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
                                    {transcribedText ||
                                        "Transcription will appear here..."}
                                </div>
                            </div>
                        )}
                        {callEnded && recordedAudio && (
                            <div className="recorded-audio mt-6">
                                <h4 className="text-white text-xl mb-4">
                                    Recorded Audio
                                </h4>
                                <audio
                                    controls
                                    src={recordedAudio}
                                    className="w-full"
                                />
                            </div>
                        )}
                        {incomingCall && (
                            <div className="incoming-call mt-6">
                                <h3 className="text-white text-xl mb-3">
                                    Incoming Call
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "Accepting incoming call"
                                            );
                                            handleIncomingCall("accept");
                                        }}
                                        className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Answer
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "Declining incoming call"
                                            );
                                            handleIncomingCall("decline");
                                        }}
                                        className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "Sending incoming call to voicemail"
                                            );
                                            handleIncomingCall("toVoicemail");
                                        }}
                                        className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        To Voicemail
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SipSpeechComponent;

// working audio to phone (and switches back to mic), not working transcription
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { SessionState } from "sip.js";
// // import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";
// import { SessionDescriptionHandler } from "sip.js";
// import { SessionDescriptionHandler as WebSessionDescriptionHandler } from "sip.js/lib/platform/web/session-description-handler/session-description-handler";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [callEnded, setCallEnded] = useState(false);

//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const localAudioRef = useRef<HTMLAudioElement | null>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     useEffect(() => {
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         localAudioRef.current = document.getElementById(
//             "localAudio"
//         ) as HTMLAudioElement;

//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }

//         return () => {
//             if (session) {
//                 session.dispose();
//             }
//             if (userAgent) {
//                 userAgent.stop();
//             }
//             stopAudioProcessing();
//         };
//         // Only include tokenData in the dependency array
//     }, [tokenData]);

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

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLMediaElement,
//                     local: localAudioRef.current as HTMLMediaElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             const webPhone = new WebPhone(parsedSipProvisionData, options);

//             webPhone.userAgent.on("registered", () => {
//                 setIsAuthenticated(true);
//             });

//             webPhone.userAgent.on("unregistered", () => {
//                 setIsAuthenticated(false);
//             });

//             webPhone.userAgent.on(
//                 "invite",
//                 (incomingSession: WebPhoneInvitation) => {
//                     setIncomingCall(incomingSession);
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const requestMediaPermissions = useCallback(async () => {
//         try {
//             await navigator.mediaDevices.getUserMedia({ audio: true });
//         } catch (error) {
//             console.error("Media permission denied:", error);
//         }
//     }, []);

//     useEffect(() => {
//         requestMediaPermissions();
//     }, [requestMediaPermissions]);

//     const generateGreeting = useCallback(
//         async (callerNumber: string): Promise<string | null> => {
//             try {
//                 const response = await fetch("/api/llpmg/generate-greeting", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         remoteCaller: { remoteNumber: callerNumber },
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to generate greeting");
//                 }

//                 const data = await response.json();
//                 return `http://localhost:65535${data.audioUrl}`;
//             } catch (error) {
//                 console.error("Error generating greeting:", error);
//                 return null;
//             }
//         },
//         []
//     );

//     const playAudioFile = useCallback(async (audioUrl: string) => {
//         const audio = new Audio(audioUrl);
//         await audio.play();
//     }, []);

//     const setupAudioStream = useCallback((session: WebPhoneSession) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 // Remote Stream
//                 const remoteStream = new MediaStream();
//                 peerConnection
//                     .getReceivers()
//                     .forEach((receiver: RTCRtpReceiver) => {
//                         if (receiver.track) {
//                             remoteStream.addTrack(receiver.track);
//                         }
//                     });
//                 if (remoteAudioRef.current) {
//                     remoteAudioRef.current.srcObject = remoteStream;
//                     console.log("Remote audio stream set on audio element");
//                 } else {
//                     console.error("Remote audio element is not available");
//                 }

//                 // Local Stream
//                 const localStream = new MediaStream();
//                 peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//                     if (sender.track) {
//                         localStream.addTrack(sender.track);
//                     }
//                 });
//                 if (localAudioRef.current) {
//                     localAudioRef.current.srcObject = localStream;
//                     console.log("Local audio stream set on audio element");
//                 } else {
//                     console.error("Local audio element is not available");
//                 }
//             } else {
//                 console.error("PeerConnection is not available");
//             }
//         } else {
//             console.error("Session Description Handler is not available");
//         }
//     }, []);

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             // Cast sessionDescriptionHandler to the implementation that includes peerConnection
//             const sdh = session.sessionDescriptionHandler as any; // Use 'any' or the correct type if available
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 const newAudioTrack = newStream.getAudioTracks()[0];
//                 if (newAudioTrack) {
//                     // Get the sender responsible for audio
//                     const audioSender = peerConnection
//                         .getSenders()
//                         .find((sender) => sender.track?.kind === "audio");
//                     if (audioSender) {
//                         // Replace the track being sent
//                         await audioSender.replaceTrack(newAudioTrack);
//                         console.log(
//                             "Local audio track replaced with greeting audio."
//                         );
//                     } else {
//                         console.error(
//                             "No audio sender found in peer connection."
//                         );
//                     }
//                 } else {
//                     console.error(
//                         "No audio track found in the greeting stream."
//                     );
//                 }
//             } else {
//                 console.error("PeerConnection is not available.");
//             }
//         } else {
//             console.error("Session Description Handler is not available.");
//         }
//     };

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<{
//         stream: MediaStream;
//         sourceNode: AudioBufferSourceNode;
//         audioContext: AudioContext;
//     }> => {
//         const audioContext = new AudioContext();
//         const response = await fetch(audioUrl);
//         const arrayBuffer = await response.arrayBuffer();
//         const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//         const sourceNode = audioContext.createBufferSource();
//         sourceNode.buffer = audioBuffer;

//         const destinationNode = audioContext.createMediaStreamDestination();
//         sourceNode.connect(destinationNode);
//         sourceNode.start();

//         return { stream: destinationNode.stream, sourceNode, audioContext };
//     };

//     const getUserMediaAndReplaceTrack = async (session: WebPhoneSession) => {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//         });
//         const audioTrack = mediaStream.getAudioTracks()[0];

//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (peerConnection) {
//                 const audioSender = peerConnection
//                     .getSenders()
//                     .find((sender) => sender.track?.kind === "audio");
//                 if (audioSender) {
//                     await audioSender.replaceTrack(audioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found to replace track.");
//                 }
//             } else {
//                 console.error("PeerConnection is not available.");
//             }
//         } else {
//             console.error("Session Description Handler is not available.");
//         }
//     };

//     const handleCallAccepted = useCallback(
//         async (newSession: WebPhoneSession) => {
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(newSession);

//             // Proceed with your greeting logic
//             const callerNumber = newSession.remoteIdentity.uri.user as string;
//             const greetingUrl = await generateGreeting(callerNumber);

//             if (greetingUrl) {
//                 const {
//                     stream: greetingStream,
//                     sourceNode,
//                     audioContext,
//                 } = await createMediaStreamFromAudio(greetingUrl);
//                 await replaceLocalAudioTrack(newSession, greetingStream);

//                 // Wait for the greeting to finish playing
//                 sourceNode.onended = async () => {
//                     console.log("Greeting audio finished playing.");
//                     audioContext.close();

//                     // Switch back to microphone audio
//                     await getUserMediaAndReplaceTrack(newSession);
//                 };
//             }

//             setupAudioStream(newSession);

//             // Handle session termination
//             newSession.stateChange.addListener((state: SessionState) => {
//                 if (state === SessionState.Terminated) {
//                     handleCallTerminated();
//                 }
//             });

//             // Start recording if necessary
//             startRecording();
//             setTimeout(() => {
//                 transcribeAudio();
//             }, 5000);
//         },
//         [userAgent, setupAudioStream, generateGreeting]
//     );

//     const transcribeAudioBlob = async (audioBlob: Blob, speaker: string) => {
//         console.log(`Transcribing audio blob for speaker: ${speaker}`);
//         return new Promise<
//             Array<{ timestamp: number; speaker: string; text: string }>
//         >((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(audioBlob);
//             reader.onloadend = async () => {
//                 if (typeof reader.result === "string") {
//                     const base64Audio = reader.result.split(",")[1];
//                     try {
//                         const response = await fetch(
//                             "/api/llpmg/speech-to-text",
//                             {
//                                 method: "POST",
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ audio: base64Audio }),
//                             }
//                         );

//                         if (response.ok) {
//                             const data = await response.json();
//                             const transcriptionResult = data.result; // This is a string

//                             console.log(
//                                 `Transcription result for ${speaker}:`,
//                                 transcriptionResult
//                             );

//                             // Since we have a string, create a transcription object
//                             const transcription = {
//                                 timestamp: Date.now(), // You can adjust this as needed
//                                 speaker,
//                                 text: transcriptionResult,
//                             };

//                             resolve([transcription]); // Return an array with one transcription object
//                         } else {
//                             console.error(
//                                 "Failed to transcribe audio",
//                                 response.statusText
//                             );
//                             reject(new Error("Transcription failed"));
//                         }
//                     } catch (error) {
//                         console.error("Error transcribing audio", error);
//                         reject(error);
//                     }
//                 } else {
//                     console.error("Reader result is not a string");
//                     reject(new Error("Failed to read audio blob"));
//                 }
//             };
//         });
//     };

//     const transcribeAudio = useCallback(async () => {
//         console.log("Transcribe audio function called");
//         const transcriptions: Array<{
//             timestamp: number;
//             speaker: string;
//             text: string;
//         }> = [];

//         // Transcribe remote audio (patient)
//         if (remoteRecordedChunksRef.current.length > 0) {
//             console.log("Transcribing remote audio");
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             try {
//                 const remoteTranscription = await transcribeAudioBlob(
//                     remoteAudioBlob,
//                     "Patient"
//                 );
//                 transcriptions.push(...remoteTranscription);
//             } catch (error) {
//                 console.error("Error transcribing remote audio:", error);
//             }
//             // Clear recorded chunks after transcription
//             remoteRecordedChunksRef.current = [];
//         } else {
//             console.log("No remote audio chunks to transcribe");
//         }

//         // Transcribe local audio (system)
//         if (localRecordedChunksRef.current.length > 0) {
//             console.log("Transcribing local audio");
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm",
//             });
//             try {
//                 const localTranscription = await transcribeAudioBlob(
//                     localAudioBlob,
//                     "System"
//                 );
//                 transcriptions.push(...localTranscription);
//             } catch (error) {
//                 console.error("Error transcribing local audio:", error);
//             }
//             // Clear recorded chunks after transcription
//             localRecordedChunksRef.current = [];
//         } else {
//             console.log("No local audio chunks to transcribe");
//         }

//         if (transcriptions.length === 0) {
//             console.log("No transcriptions available");
//             return;
//         }

//         // Sort transcriptions by timestamp
//         transcriptions.sort((a, b) => a.timestamp - b.timestamp);

//         // Update state with transcriptions
//         const formattedTranscription = transcriptions
//             .map((entry) => `${entry.speaker}: ${entry.text}`)
//             .join("\n");

//         setTranscribedText(
//             (prevText) => prevText + "\n" + formattedTranscription
//         );
//         console.log("Updated transcribed text:", formattedTranscription);
//     }, []);

//     useEffect(() => {
//         let transcriptionInterval: NodeJS.Timeout;

//         if (callActive) {
//             transcriptionInterval = setInterval(() => {
//                 console.log("Transcription interval triggered");
//                 transcribeAudio();
//             }, 5000); // Transcribe every 5 seconds
//         }

//         return () => {
//             if (transcriptionInterval) {
//                 clearInterval(transcriptionInterval);
//             }
//         };
//     }, [callActive, transcribeAudio]);

//     const startRecording = useCallback(() => {
//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Record remote audio
//         const remoteAudio = remoteAudioRef.current;
//         if (remoteAudio && remoteAudio.srcObject instanceof MediaStream) {
//             console.log("Starting remote audio recording");
//             const remoteMediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject
//             );

//             remoteMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     remoteRecordedChunksRef.current.push(event.data);
//                     console.log("Remote audio data available:", event.data);
//                 }
//             };

//             remoteMediaRecorder.start();
//             remoteMediaRecorderRef.current = remoteMediaRecorder;
//         } else {
//             console.error("Remote audio source not found or not a MediaStream");
//         }

//         // Record local audio
//         const localAudio = localAudioRef.current;
//         if (localAudio && localAudio.srcObject instanceof MediaStream) {
//             console.log("Starting local audio recording");
//             const localMediaRecorder = new MediaRecorder(localAudio.srcObject);

//             localMediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                     console.log("Local audio data available:", event.data);
//                 }
//             };

//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("Local audio source not found or not a MediaStream");
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }

//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     const handleHangup = useCallback(() => {
//         if (session) {
//             session.dispose();
//         }
//         stopAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
//     }, [session, onHangup]);

//     const stopAudioProcessing = useCallback(() => {
//         if (
//             mediaRecorderRef.current &&
//             mediaRecorderRef.current.state !== "inactive"
//         ) {
//             mediaRecorderRef.current.stop();
//         }
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.srcObject = null;
//             remoteAudioRef.current.pause();
//         }
//         if (localAudioRef.current) {
//             localAudioRef.current.srcObject = null;
//             localAudioRef.current.pause();
//         }
//     }, []);

//     const handleCallTerminated = useCallback(() => {
//         userAgent?.audioHelper.playOutgoing(false);
//         userAgent?.audioHelper.playIncoming(false);
//         setCallActive(false);
//         setCallEnded(true);
//         stopRecording();
//         stopAudioProcessing();
//         setSession(null);
//         onHangup();
//     }, [userAgent, onHangup, stopAudioProcessing]);

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.stateChange.addListener((state: SessionState) => {
//             switch (state) {
//                 case SessionState.Established:
//                     handleCallAccepted(newSession);
//                     break;
//                 case SessionState.Terminated:
//                     handleCallTerminated();
//                     break;
//             }
//         });

//         setSession(newSession);
//         setCallActive(true);
//         setCallEnded(false);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     incomingCall.stateChange.addListener(
//                         (state: SessionState) => {
//                             switch (state) {
//                                 case SessionState.Established:
//                                     handleCallAccepted(incomingCall);
//                                     break;
//                                 case SessionState.Terminated:
//                                     handleCallTerminated();
//                                     break;
//                             }
//                         }
//                     );
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const toggleMute = useCallback(() => {
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} autoPlay muted />
//                 <audio id="localAudio" ref={localAudioRef} autoPlay muted />

//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
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
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) =>
//                                         setOutgoingNumber(e.target.value)
//                                     }
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={handleOutgoingCall}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handleHangup}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="transcription mt-6">
//                             <h4 className="text-white text-xl mb-4">
//                                 {callEnded
//                                     ? "Call Transcription"
//                                     : "Live Transcription"}
//                             </h4>
//                             <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                 {transcribedText
//                                     ? transcribedText
//                                           .split("\n")
//                                           .map((line, index) => (
//                                               <p
//                                                   key={index}
//                                                   className={
//                                                       line.startsWith(
//                                                           "Patient:"
//                                                       )
//                                                           ? "text-blue-300"
//                                                           : "text-green-300"
//                                                   }
//                                               >
//                                                   {line}
//                                               </p>
//                                           ))
//                                     : "Transcription will appear here..."}
//                             </div>
//                         </div>

//                         {callEnded && recordedAudio && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full"
//                                 />
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("accept")
//                                         }
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("decline")
//                                         }
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleIncomingCall("toVoicemail")
//                                         }
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;

// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { SessionDescriptionHandler } from "@/ref/web/src/sessionDescriptionHandler";

// interface SipSpeechComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

// interface GreetingResponse {
//     audioUrl: string;
//     greetingText: string;
// }

// const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
//     onHangup,
//     initiateAuth,
//     tokenData,
//     onLogout,
//     setTokenData,
// }) => {
//     // State variables
//     const [userAgent, setUserAgent] = useState<WebPhoneUserAgent | null>(null);
//     const [session, setSession] = useState<WebPhoneSession | null>(null);
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [transcribedText, setTranscribedText] = useState<string>("");
//     const [callEnded, setCallEnded] = useState(false);

//     // Refs for audio processing
//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
//     const [remoteRecordedAudio, setRemoteRecordedAudio] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudio, setLocalRecordedAudio] = useState<string | null>(
//         null
//     );

//     // Refs for recording
//     const isPlayingGreetingRef = useRef(false);
//     const greetingTextRef = useRef<string>("");

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);

//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localRecordedChunksRef = useRef<Blob[]>([]);

//     // State for recorded audio playback
//     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
//         string | null
//     >(null);

//     // Ref to control transcription during greeting playback
//     const transcriptionEnabledRef = useRef<boolean>(false);

//     useEffect(() => {
//         console.log("SipSpeechComponent mounted");
//         remoteAudioRef.current = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.onloadedmetadata = () => {
//                 remoteAudioRef.current!.muted = false;
//             };
//         }
//         if (tokenData) {
//             console.log("TokenData available, initializing WebPhone");
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//         return () => {
//             console.log("SipSpeechComponent unmounting");
//             stopAllAudioProcessing();
//         };
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
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
//             console.log("SIP Provision Data received:", sipProvisionData);

//             if (!sipProvisionData) {
//                 throw new Error("SIP Provision Data is undefined");
//             }

//             const parsedSipProvisionData = JSON.parse(sipProvisionData);
//             console.log("Parsed SIP Provision Data: ", parsedSipProvisionData);

//             if (
//                 !parsedSipProvisionData.sipInfo ||
//                 !parsedSipProvisionData.sipInfo.length
//             ) {
//                 throw new Error("Parsed SIP Info is missing or incomplete");
//             }

//             const options: WebPhoneOptions = {
//                 logLevel: 1 as 0 | 1 | 2 | 3,
//                 appName: "LLPMG WebPhone",
//                 appVersion: "1.0.0",
//                 media: {
//                     remote: remoteAudioRef.current as HTMLAudioElement,
//                     local: document.getElementById(
//                         "localAudio"
//                     ) as HTMLAudioElement,
//                 },
//                 audioHelper: {
//                     enabled: true,
//                     incoming: "/llpmg/audio/incoming.ogg",
//                     outgoing: "/llpmg/audio/outgoing.ogg",
//                 },
//             };

//             console.log("Creating WebPhone instance with options:", options);
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
//                     webPhone.userAgent.audioHelper.playIncoming(true);
//                 }
//             );

//             webPhone.userAgent.start();
//             setUserAgent(webPhone.userAgent);
//         } catch (error) {
//             console.error("Failed to initialize WebPhone:", error);
//             setConnectionError(
//                 `Failed to initialize WebPhone: ${(error as Error).message}`
//             );
//         }
//     }, []);

//     const generateGreeting = useCallback(async (callerNumber: string) => {
//         try {
//             console.log("Generating greeting for caller:", callerNumber);
//             const response = await fetch("/api/llpmg/generate-greeting", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     remoteCaller: { remoteNumber: callerNumber },
//                 }),
//             });

//             if (response.ok) {
//                 const data: GreetingResponse = await response.json();
//                 console.log("Greeting generated successfully");
//                 console.log("Greeting Data:", data);
//                 return { audioUrl: data.audioUrl, text: data.greetingText };
//             } else {
//                 const errorText = await response.text();
//                 console.error(
//                     "Failed to generate greeting:",
//                     response.status,
//                     errorText
//                 );
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error generating greeting:", error);
//             return null;
//         }
//     }, []);

//     const playGreeting = useCallback(async (audioUrl: string) => {
//         console.log("Playing greeting on desktop");
//         const audio = new Audio(audioUrl);
//         await audio.play();
//         return new Promise((resolve) => {
//             audio.onended = resolve;
//         });
//     }, []);

//     const createMediaStreamFromAudio = async (
//         audioUrl: string
//     ): Promise<MediaStream> => {
//         try {
//             const audioContext = new AudioContext();
//             const response = await fetch(audioUrl);
//             if (!response.ok) {
//                 throw new Error(
//                     `Failed to fetch audio file: ${response.statusText}`
//                 );
//             }
//             const arrayBuffer = await response.arrayBuffer();
//             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//             const source = audioContext.createBufferSource();
//             source.buffer = audioBuffer;

//             const destination = audioContext.createMediaStreamDestination();
//             source.connect(destination);
//             source.start();

//             // Close the audio context after the source has finished playing
//             source.onended = () => {
//                 audioContext.close();
//             };

//             return destination.stream;
//         } catch (error) {
//             console.error("Error creating media stream from audio:", error);
//             throw error;
//         }
//     };

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh =
//                 session.sessionDescriptionHandler as SessionDescriptionHandler;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             const audioSender = senders.find(
//                 (sender) => sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log(
//                         "Local audio track replaced with greeting audio."
//                     );
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         }
//     };

//     // const switchBackToMicrophone = async (session: WebPhoneSession) => {
//     //     try {
//     //         const stream = await navigator.mediaDevices.getUserMedia({
//     //             audio: true,
//     //         });
//     //         if (session.sessionDescriptionHandler) {
//     //             const sdh =
//     //                 session.sessionDescriptionHandler as SessionDescriptionHandler;
//     //             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//     //             const newAudioTrack = stream.getAudioTracks()[0];
//     //             if (!newAudioTrack) {
//     //                 console.error(
//     //                     "No audio track found in the microphone stream"
//     //                 );
//     //                 return;
//     //             }

//     //             const senders = peerConnection.getSenders();
//     //             const audioSender = senders.find(
//     //                 (sender) => sender.track && sender.track.kind === "audio"
//     //             );

//     //             if (audioSender) {
//     //                 await audioSender.replaceTrack(newAudioTrack);
//     //                 console.log("Switched back to microphone audio.");
//     //             } else {
//     //                 console.error("No audio sender found in peer connection.");
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error("Error switching back to microphone audio:", error);
//     //     }
//     // };

//     const startRecording = useCallback(async (session: WebPhoneSession) => {
//         console.log("startRecording function called");

//         // Reset recorded chunks
//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         // Wait for remote audio stream to be available
//         let remoteAudio = remoteAudioRef.current;
//         while (!remoteAudio || !remoteAudio.srcObject) {
//             console.log("Waiting for remote audio stream...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//             remoteAudio = remoteAudioRef.current;
//         }
//         console.log("Remote audio source found");

//         const options = { mimeType: "audio/webm;codecs=opus" };
//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             options.mimeType = "audio/webm";
//         }

//         // Record remote audio
//         const remoteMediaRecorder = new MediaRecorder(
//             remoteAudio.srcObject as MediaStream,
//             options
//         );

//         remoteMediaRecorder.onstart = () => {
//             console.log("Remote MediaRecorder started");
//         };

//         remoteMediaRecorder.ondataavailable = (event) => {
//             console.log("Remote data available:", event.data.size);
//             if (event.data.size > 0) {
//                 remoteRecordedChunksRef.current.push(event.data);
//             }
//         };

//         remoteMediaRecorder.onerror = (event) => {
//             console.error("Remote recorder error:", event);
//         };

//         remoteMediaRecorder.onstop = () => {
//             console.log("Remote MediaRecorder stopped");
//         };

//         remoteMediaRecorder.start();
//         remoteMediaRecorderRef.current = remoteMediaRecorder;

//         // Wait until sessionDescriptionHandler and peerConnection are available
//         let sdh: any;
//         while (!session.sessionDescriptionHandler) {
//             console.log("Waiting for sessionDescriptionHandler...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         sdh = session.sessionDescriptionHandler;

//         let peerConnection: RTCPeerConnection;
//         while (!sdh.peerConnection) {
//             console.log("Waiting for peerConnection...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         peerConnection = sdh.peerConnection;

//         console.log("PeerConnection is available");

//         // Record local audio
//         const localStream = new MediaStream();
//         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
//             if (sender.track) {
//                 localStream.addTrack(sender.track);
//             }
//         });

//         if (localStream.getTracks().length > 0) {
//             const localMediaRecorder = new MediaRecorder(localStream, options);

//             localMediaRecorder.onstart = () => {
//                 console.log("Local MediaRecorder started");
//             };

//             localMediaRecorder.ondataavailable = (event) => {
//                 console.log("Local data available:", event.data.size);
//                 if (event.data.size > 0) {
//                     localRecordedChunksRef.current.push(event.data);
//                 }
//             };

//             localMediaRecorder.onerror = (event) => {
//                 console.error("Local recorder error:", event);
//             };

//             localMediaRecorder.onstop = () => {
//                 console.log("Local MediaRecorder stopped");
//             };

//             localMediaRecorder.start();
//             localMediaRecorderRef.current = localMediaRecorder;
//         } else {
//             console.error("No local tracks available to record");
//         }

//         // Start audio processing
//         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//             remoteMediaRecorderRef.current.onstop = () => {
//                 const remoteAudioBlob = new Blob(
//                     remoteRecordedChunksRef.current,
//                     {
//                         type: "audio/webm",
//                     }
//                 );
//                 const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                 setRemoteRecordedAudio(remoteAudioUrl);
//                 console.log("Local audio recording saved");
//             };
//         }
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//             localMediaRecorderRef.current.onstop = () => {
//                 const localAudioBlob = new Blob(
//                     localRecordedChunksRef.current,
//                     {
//                         type: "audio/webm",
//                     }
//                 );
//                 const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                 setLocalRecordedAudio(localAudioUrl);
//                 console.log("Local audio recording saved");
//             };
//         }
//     }, []);

//     const setupAudioProcessing = useCallback((stream: MediaStream) => {
//         console.log("Setting up audio processing");
//         audioContextRef.current = new AudioContext();
//         sourceNodeRef.current =
//             audioContextRef.current.createMediaStreamSource(stream);
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         scriptProcessorRef.current =
//             audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         sourceNodeRef.current.connect(analyserRef.current);
//         analyserRef.current.connect(scriptProcessorRef.current);
//         scriptProcessorRef.current.connect(audioContextRef.current.destination);

//         let silenceStart: number | null = null;
//         const silenceThreshold = 0.0005;
//         const silenceDuration = 300;
//         let isTranscribing = false;

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             if (!transcriptionEnabledRef.current) {
//                 return;
//             }

//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;
//             console.log("Average audio level:", average);

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                 } else if (
//                     Date.now() - silenceStart >= silenceDuration &&
//                     !isTranscribing
//                 ) {
//                     console.log("Silence detected, calling transcribeAudio");
//                     isTranscribing = true;
//                     transcribeAudio().then(() => {
//                         isTranscribing = false;
//                         silenceStart = null;
//                     });
//                 }
//             } else {
//                 silenceStart = null;
//             }
//         };
//     }, []);

//     const stopAllAudioProcessing = useCallback(() => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close();
//         }
//         // Stop remote media recorder
//         if (
//             remoteMediaRecorderRef.current &&
//             remoteMediaRecorderRef.current.state !== "inactive"
//         ) {
//             remoteMediaRecorderRef.current.stop();
//         }
//         // Stop local media recorder
//         if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current.state !== "inactive"
//         ) {
//             localMediaRecorderRef.current.stop();
//         }
//     }, []);

//     //     const stopAudioProcessing = useCallback(() => {
//     //         if (
//     //             mediaRecorderRef.current &&
//     //             mediaRecorderRef.current.state !== "inactive"
//     //         ) {
//     //             mediaRecorderRef.current.stop();
//     //         }
//     //         if (remoteAudioRef.current) {
//     //             remoteAudioRef.current.srcObject = null;
//     //             remoteAudioRef.current.pause();
//     //         }
//     //         if (localAudioRef.current) {
//     //             localAudioRef.current.srcObject = null;
//     //             localAudioRef.current.pause();
//     //         }
//     //     }, []);

//     const transcribeAudio = useCallback(async () => {
//         console.log("transcribeAudio called");
//         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
//             console.error(
//                 "Remote audio source not available for transcription"
//             );
//             return;
//         }

//         const stream = remoteAudioRef.current.srcObject as MediaStream;
//         const options = { mimeType: "audio/webm;codecs=opus" };

//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             return;
//         }

//         const recorder = new MediaRecorder(stream, options);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             console.log("Data available from recorder:", event.data.size);
//             if (event.data.size > 0) {
//                 chunks.push(event.data);
//             }
//         };

//         recorder.onerror = (event) => {
//             console.error("Recorder error:", event);
//         };

//         recorder.onstop = async () => {
//             console.log("Recorder stopped");
//             const audioBlob = new Blob(chunks, { type: options.mimeType });
//             const formData = new FormData();
//             formData.append("audio", audioBlob, "audio.webm");

//             try {
//                 console.log("Sending audio to transcription API");
//                 const response = await fetch("/api/llpmg/speech-to-text", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 console.log(
//                     "Transcription API response status:",
//                     response.status
//                 );
//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Transcription received:", data.result);
//                     setTranscribedText(
//                         (prevText) => prevText + "\nPatient: " + data.result
//                     );
//                 } else {
//                     const errorText = await response.text();
//                     console.error("Failed to transcribe audio:", errorText);
//                 }
//             } catch (error) {
//                 console.error("Error transcribing audio:", error);
//             }
//         };

//         //     const reader = new FileReader();
//         //     reader.readAsDataURL(audioBlob);
//         //     reader.onloadend = async () => {
//         //         if (typeof reader.result === "string") {
//         //             const base64Audio = reader.result.split(",")[1];
//         //             try {
//         //                 console.log("Sending audio to transcription API");
//         //                 const response = await fetch(
//         //                     "/api/llpmg/speech-to-text",
//         //                     {
//         //                         method: "POST",
//         //                         headers: { "Content-Type": "application/json" },
//         //                         body: JSON.stringify({ audio: base64Audio }),
//         //                     }
//         //                 );
//         //                 console.log(
//         //                     "Transcription API response status:",
//         //                     response.status
//         //                 );
//         //                 if (response.ok) {
//         //                     const data = await response.json();
//         //                     console.log("Transcription received:", data.result);
//         //                     setTranscribedText(
//         //                         (prevText) => prevText + " " + data.result
//         //                     );
//         //                 } else {
//         //                     console.error(
//         //                         "Failed to transcribe audio",
//         //                         await response.text()
//         //                     );
//         //                 }
//         //             } catch (error) {
//         //                 console.error("Error transcribing audio:", error);
//         //             }
//         //         }
//         //     };
//         // };

//         recorder.start();

//         setTimeout(() => {
//             console.log("Stopping recorder after 5 seconds");
//             recorder.stop();
//         }, 5000);
//     }, []);

//     const switchBackToMicrophone = async (session: WebPhoneSession) => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (session.sessionDescriptionHandler) {
//                 const sdh = session.sessionDescriptionHandler as any;
//                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

//                 const newAudioTrack = stream.getAudioTracks()[0];
//                 if (!newAudioTrack) {
//                     console.error(
//                         "No audio track found in the microphone stream"
//                     );
//                     return;
//                 }

//                 const senders = peerConnection.getSenders();
//                 const audioSender = senders.find(
//                     (sender) => sender.track && sender.track.kind === "audio"
//                 );

//                 if (audioSender) {
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Switched back to microphone audio.");
//                 } else {
//                     console.error("No audio sender found in peer connection.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error switching back to microphone audio:", error);
//         }
//     };

//     const handleCallAccepted = useCallback(
//         async (session: WebPhoneSession) => {
//             console.log("Call accepted - User has answered the call");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(session);

//             // Extract remote number from the session
//             let remoteNumber = "unknown number";
//             if (session) {
//                 const remoteIdentity = session.remoteIdentity;
//                 if (
//                     remoteIdentity &&
//                     remoteIdentity.uri &&
//                     remoteIdentity.uri.user
//                 ) {
//                     remoteNumber = remoteIdentity.uri.user;
//                 } else if (session.request) {
//                     const fromHeader = session.request.getHeader("From");
//                     if (fromHeader) {
//                         const match = fromHeader.match(/<sip:(.+?)@/);
//                         if (match && match[1]) {
//                             remoteNumber = match[1];
//                         }
//                     }
//                 }
//             }
//             console.log("Remote number (caller):", remoteNumber);

//             // Start recording immediately
//             await startRecording(session);

//             try {
//                 console.log("Generating greeting for caller:", remoteNumber);
//                 const greetingData = await generateGreeting(remoteNumber);

//                 if (greetingData) {
//                     const { audioUrl, text } = greetingData;
//                     greetingTextRef.current = text;
//                     console.log("Greeting audio URL:", audioUrl);

//                     // Create media stream from greeting audio
//                     const greetingStream =
//                         await createMediaStreamFromAudio(audioUrl);

//                     // Replace local audio track with greeting audio
//                     await replaceLocalAudioTrack(session, greetingStream);

//                     // playGreeting(audioUrl);

//                     // Set flags
//                     console.log("Setting isPlayingGreetingRef to true");
//                     isPlayingGreetingRef.current = true;
//                     transcriptionEnabledRef.current = false;

//                     // const greetingStreamLog = greetingStream
//                     //     .getTracks()[0]
//                     //     .addEventListener("ended", async () => {
//                     //         console.log("Greeting audio ended");
//                     //         await switchBackToMicrophone(session);
//                     //         isPlayingGreetingRef.current = false;
//                     //         console.log(
//                     //             "Setting isPlayingGreetingRef to false"
//                     //         );
//                     //         transcriptionEnabledRef.current = true;

//                     //         // Append the greeting text to the transcription
//                     //         setTranscribedText(
//                     //             (prevText) =>
//                     //                 prevText +
//                     //                 "\nSystem: " +
//                     //                 greetingTextRef.current
//                     //         );
//                     //     });

//                     // console.log("GREETING STREAM: >>>>\n", greetingStreamLog);

//                     greetingStream
//                         .getTracks()[0]
//                         .addEventListener("ended", async () => {
//                             console.log(
//                                 "Greeting audio ended, switching back to microphone"
//                             );
//                             isPlayingGreetingRef.current = false;
//                             console.log(
//                                 "Setting isPlayingGreetingRef to false"
//                             );
//                             transcriptionEnabledRef.current = true;
//                             await switchBackToMicrophone(session);
//                             setTranscribedText(
//                                 (prevText) =>
//                                     prevText +
//                                     "\nSystem: " +
//                                     greetingTextRef.current
//                             );
//                         });
//                 } else {
//                     console.error("Failed to generate greeting");
//                     transcriptionEnabledRef.current = true;
//                 }
//             } catch (error) {
//                 console.error("Error generating or playing greeting:", error);
//                 transcriptionEnabledRef.current = true;
//             }
//         },
//         [userAgent, startRecording, generateGreeting]
//     );

//     const handleCallTerminated = useCallback(
//         (session: WebPhoneSession) => {
//             try {
//                 console.log("Call terminated");
//                 userAgent?.audioHelper.playOutgoing(false);
//                 userAgent?.audioHelper.playIncoming(false);
//                 setCallActive(false);
//                 setCallEnded(true);
//                 stopRecording();
//                 stopAllAudioProcessing();
//                 onHangup();

//                 // Create recorded audio URLs
//                 if (remoteRecordedChunksRef.current.length > 0) {
//                     console.log("Creating remote audio blob");
//                     const remoteAudioBlob = new Blob(
//                         remoteRecordedChunksRef.current,
//                         {
//                             type: "audio/webm;codecs=opus",
//                         }
//                     );
//                     const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                     setRemoteRecordedAudioUrl(remoteAudioUrl);
//                     console.log("Remote audio URL set:", remoteAudioUrl);
//                 } else {
//                     console.log("No remote audio recorded");
//                 }

//                 if (localRecordedChunksRef.current.length > 0) {
//                     console.log("Creating local audio blob");
//                     const localAudioBlob = new Blob(
//                         localRecordedChunksRef.current,
//                         {
//                             type: "audio/webm;codecs=opus",
//                         }
//                     );
//                     const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                     setLocalRecordedAudioUrl(localAudioUrl);
//                     console.log("Local audio URL set:", localAudioUrl);
//                 } else {
//                     console.log("No local audio recorded");
//                 }
//             } catch (error) {
//                 console.error("Error during call termination:", error);
//             }
//         },
//         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
//     );

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const newSession = userAgent.invite(outgoingNumber, {});

//         newSession.on("accepted", () => handleCallAccepted(newSession));
//         newSession.on("terminated", () => handleCallTerminated(newSession));

//         setSession(newSession);
//     }, [
//         userAgent,
//         outgoingNumber,
//         handleCallAccepted,
//         handleCallTerminated,
//         setSession,
//     ]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) {
//                 console.error("No incoming call to handle");
//                 return;
//             }

//             console.log("Handling incoming call:", action);
//             userAgent?.audioHelper.playIncoming(false);

//             switch (action) {
//                 case "accept":
//                     console.log("Accepting incoming call");
//                     incomingCall.accept();
//                     incomingCall.on("accepted", () =>
//                         handleCallAccepted(incomingCall)
//                     );
//                     incomingCall.on("terminated", () =>
//                         handleCallTerminated(incomingCall)
//                     );
//                     setSession(incomingCall);
//                     break;
//                 case "decline":
//                     incomingCall.reject();
//                     break;
//                 case "toVoicemail":
//                     incomingCall.toVoicemail?.();
//                     break;
//             }

//             setIncomingCall(null);
//         },
//         [incomingCall, userAgent, handleCallAccepted, handleCallTerminated]
//     );

//     const handleHangup = useCallback(() => {
//         console.log("handleHangup called");
//         if (session) {
//             session.dispose();
//         }
//         stopRecording();
//         stopAllAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();

//         // Create recorded audio URLs
//         if (remoteRecordedChunksRef.current.length > 0) {
//             console.log("Creating remote audio blob");
//             const remoteAudioBlob = new Blob(remoteRecordedChunksRef.current, {
//                 type: "audio/webm;codecs=opus",
//             });
//             const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//             setRemoteRecordedAudioUrl(remoteAudioUrl);
//             console.log("Remote audio URL set:", remoteAudioUrl);
//         } else {
//             console.log("No remote audio recorded");
//         }

//         if (localRecordedChunksRef.current.length > 0) {
//             console.log("Creating local audio blob");
//             const localAudioBlob = new Blob(localRecordedChunksRef.current, {
//                 type: "audio/webm;codecs=opus",
//             });
//             const localAudioUrl = URL.createObjectURL(localAudioBlob);
//             setLocalRecordedAudioUrl(localAudioUrl);
//             console.log("Local audio URL set:", localAudioUrl);
//         } else {
//             console.log("No local audio recorded");
//         }
//     }, [session, stopRecording, stopAllAudioProcessing, onHangup]);

//     const toggleMute = useCallback(() => {
//         console.log("Toggling mute");
//         if (session) {
//             if (muted) {
//                 session.unmute?.();
//             } else {
//                 session.mute?.();
//             }
//             setMuted(!muted);
//         }
//     }, [session, muted]);

//     const toggleHold = useCallback(() => {
//         console.log("Toggling hold");
//         if (session) {
//             if (held) {
//                 session.unhold?.();
//             } else {
//                 session.hold?.();
//             }
//             setHeld(!held);
//         }
//     }, [session, held]);

//     const handlePark = useCallback(() => {
//         console.log("Parking call");
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         console.log("Initiating transfer");
//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 console.log("Transferring to:", transferNumber);
//                 session.transfer?.(transferNumber);
//             }
//         }
//     }, [session]);

//     const handleFlip = useCallback(() => {
//         console.log("Initiating flip");
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 console.log("Flipping to:", flipNumber);
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         console.log("Sending DTMF");
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 console.log("Sending DTMF digit:", digit);
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const adjustVolume = useCallback((direction: number) => {
//         console.log("Adjusting volume:", direction);
//         if (remoteAudioRef.current) {
//             remoteAudioRef.current.volume = Math.min(
//                 Math.max(remoteAudioRef.current.volume + direction, 0),
//                 1
//             );
//             console.log("New volume:", remoteAudioRef.current.volume);
//         }
//     }, []);

//     //     useEffect(() => {
//     //         let transcriptionInterval: NodeJS.Timeout;

//     //         if (callActive) {
//     //             transcriptionInterval = setInterval(() => {
//     //                 console.log("Transcription interval triggered");
//     //                 transcribeAudio();
//     //             }, 5000); // Transcribe every 5 seconds
//     //         }

//     //         return () => {
//     //             if (transcriptionInterval) {
//     //                 clearInterval(transcriptionInterval);
//     //             }
//     //         };
//     //     }, [callActive, transcribeAudio]);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" ref={remoteAudioRef} hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm mb-4">
//                         {connectionError}
//                     </div>
//                 )}
//                 {!isAuthenticated ? (
//                     <div className="auth flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 console.log("Initiating authentication");
//                                 initiateAuth();
//                             }}
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
//                             onClick={() => {
//                                 console.log("Logging out");
//                                 onLogout();
//                             }}
//                             className="text-sm text-gray-400 hover:text-white mb-4"
//                         >
//                             Logout
//                         </button>
//                         {!callActive && !callEnded && (
//                             <div className="outgoing-call mt-4">
//                                 <h4 className="text-white text-xl mb-3">
//                                     Outgoing Call
//                                 </h4>
//                                 <input
//                                     type="text"
//                                     value={outgoingNumber}
//                                     onChange={(e) => {
//                                         console.log(
//                                             "Outgoing number changed:",
//                                             e.target.value
//                                         );
//                                         setOutgoingNumber(e.target.value);
//                                     }}
//                                     placeholder="+1 234 567-8900"
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         console.log("Initiating outgoing call");
//                                         handleOutgoingCall();
//                                     }}
//                                     className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                 >
//                                     Call
//                                 </button>
//                             </div>
//                         )}
//                         {callActive && (
//                             <div className="active-call mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Call In Progress
//                                 </h4>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={toggleMute}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {muted ? "Unmute" : "Mute"}
//                                     </button>
//                                     <button
//                                         onClick={toggleHold}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         {held ? "Unhold" : "Hold"}
//                                     </button>
//                                     <button
//                                         onClick={handlePark}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Park
//                                     </button>
//                                     <button
//                                         onClick={handleTransfer}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Transfer
//                                     </button>
//                                     <button
//                                         onClick={handleFlip}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Flip
//                                     </button>
//                                     <button
//                                         onClick={handleDTMF}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Send DTMF
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Volume
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log("Hanging up call");
//                                             handleHangup();
//                                         }}
//                                         className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Hang Up
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {(callActive || callEnded) && (
//                             <div className="transcription mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     {callEnded
//                                         ? "Call Transcription"
//                                         : "Live Transcription"}
//                                 </h4>
//                                 <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
//                                     {transcribedText ||
//                                         "Transcription will appear here..."}
//                                 </div>
//                             </div>
//                         )}
//                         {callEnded && (
//                             <div className="recorded-audio mt-6">
//                                 <h4 className="text-white text-xl mb-4">
//                                     Recorded Audio
//                                 </h4>
//                                 {remoteRecordedAudioUrl ? (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Remote Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={remoteRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-400">
//                                         No remote audio recorded.
//                                     </p>
//                                 )}
//                                 {localRecordedAudioUrl ? (
//                                     <>
//                                         <h5 className="text-white text-lg mb-2">
//                                             Local Audio
//                                         </h5>
//                                         <audio
//                                             controls
//                                             src={localRecordedAudioUrl}
//                                             className="w-full"
//                                         />
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-400">
//                                         No local audio recorded.
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                         {incomingCall && (
//                             <div className="incoming-call mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Incoming Call
//                                 </h3>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Accepting incoming call"
//                                             );
//                                             handleIncomingCall("accept");
//                                         }}
//                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Answer
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Declining incoming call"
//                                             );
//                                             handleIncomingCall("decline");
//                                         }}
//                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Decline
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             console.log(
//                                                 "Sending incoming call to voicemail"
//                                             );
//                                             handleIncomingCall("toVoicemail");
//                                         }}
//                                         className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         To Voicemail
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipSpeechComponent;
