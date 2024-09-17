// // o1 3 (BEST VERSION SO FAR)

// // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // import { WebPhoneInvitation, WebPhoneSession } from "@/ref/web/src/session";
// // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // import { useState, useEffect, useRef, useCallback } from "react";

// // interface SipSpeechComponentProps {
// //     onHangup: () => void;
// //     initiateAuth: () => void;
// //     tokenData: any;
// //     onLogout: () => void;
// //     setTokenData: (data: any) => void;
// // }

// // interface GreetingResponse {
// //     audioUrl: string;
// //     greetingText: string;
// // }

// // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// //     onHangup,
// //     initiateAuth,
// //     tokenData,
// //     onLogout,
// //     setTokenData,
// // }) => {
// //     // State variables
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

// //     // Refs for audio processing
// //     const audioContextRef = useRef<AudioContext | null>(null);
// //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// //     const analyserRef = useRef<AnalyserNode | null>(null);
// //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

// //     // Recording refs and states
// //     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
// //     const remoteRecordedChunksRef = useRef<Blob[]>([]);
// //     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
// //     const localRecordedChunksRef = useRef<Blob[]>([]);
// //     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
// //         string | null
// //     >(null);
// //     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
// //         string | null
// //     >(null);

// //     // Refs to control transcription and greeting playback
// //     const transcriptionEnabledRef = useRef<boolean>(false);
// //     const isPlayingGreetingRef = useRef<boolean>(false);
// //     const isTranscribingRef = useRef<boolean>(false);

// //     useEffect(() => {
// //         console.log("SipSpeechComponent mounted");
// //         remoteAudioRef.current = document.getElementById(
// //             "remoteAudio"
// //         ) as HTMLAudioElement;
// //         if (remoteAudioRef.current) {
// //             remoteAudioRef.current.onloadedmetadata = () => {
// //                 remoteAudioRef.current!.muted = false;
// //             };
// //         }
// //         if (tokenData) {
// //             console.log("TokenData available, initializing WebPhone");
// //             const parsedTokenData =
// //                 typeof tokenData === "string"
// //                     ? JSON.parse(tokenData)
// //                     : tokenData;
// //             initializeWebPhone(parsedTokenData);
// //         }
// //         return () => {
// //             console.log("SipSpeechComponent unmounting");
// //             stopAllAudioProcessing();
// //         };
// //     }, [tokenData]);

// //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// //         try {
// //             console.log("Starting WebPhone Initialization...");
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

// //     const generateGreeting = useCallback(async (callerNumber: string) => {
// //         try {
// //             console.log("Generating greeting for caller:", callerNumber);
// //             const response = await fetch("/api/llpmg/generate-greeting", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({
// //                     remoteCaller: { remoteNumber: callerNumber },
// //                 }),
// //             });

// //             if (response.ok) {
// //                 const data: GreetingResponse = await response.json();
// //                 console.log("Greeting data received:", data);
// //                 return { audioUrl: data.audioUrl, text: data.greetingText };
// //             } else {
// //                 const errorText = await response.text();
// //                 console.error(
// //                     "Failed to generate greeting:",
// //                     response.status,
// //                     errorText
// //                 );
// //                 return null;
// //             }
// //         } catch (error) {
// //             console.error("Error generating greeting:", error);
// //             return null;
// //         }
// //     }, []);

// //     const createMediaStreamFromAudio = async (
// //         audioUrl: string
// //     ): Promise<{ stream: MediaStream; ended: Promise<void> }> => {
// //         try {
// //             const audioContext = new AudioContext();

// //             // Resume AudioContext if suspended
// //             if (audioContext.state === "suspended") {
// //                 await audioContext.resume();
// //                 console.log("AudioContext resumed");
// //             }

// //             const response = await fetch(audioUrl);
// //             if (!response.ok) {
// //                 throw new Error(
// //                     `Failed to fetch audio file: ${response.statusText}`
// //                 );
// //             }

// //             const arrayBuffer = await response.arrayBuffer();
// //             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
// //             const source = audioContext.createBufferSource();
// //             source.buffer = audioBuffer;

// //             const destination = audioContext.createMediaStreamDestination();
// //             source.connect(destination);
// //             source.start();

// //             const ended = new Promise<void>((resolve) => {
// //                 source.onended = () => {
// //                     audioContext.close();
// //                     resolve();
// //                 };
// //             });

// //             return { stream: destination.stream, ended };
// //         } catch (error) {
// //             console.error("Error creating media stream from audio:", error);
// //             throw error;
// //         }
// //     };

// //     const waitForPeerConnection = async (session: WebPhoneSession) => {
// //         while (
// //             !session.sessionDescriptionHandler ||
// //             !(session.sessionDescriptionHandler as any).peerConnection
// //         ) {
// //             console.log("Waiting for peer connection...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //         }
// //         console.log("Peer connection is ready");
// //     };

// //     const replaceLocalAudioTrack = async (
// //         session: WebPhoneSession,
// //         newStream: MediaStream
// //     ) => {
// //         if (session.sessionDescriptionHandler) {
// //             const sdh = session.sessionDescriptionHandler as any;
// //             const peerConnection = sdh.peerConnection as RTCPeerConnection;

// //             if (!peerConnection) {
// //                 console.error("PeerConnection is not available.");
// //                 return;
// //             }

// //             console.log("PeerConnection:", peerConnection);

// //             const newAudioTrack = newStream.getAudioTracks()[0];
// //             if (!newAudioTrack) {
// //                 console.error("No audio track found in the new stream");
// //                 return;
// //             }

// //             const senders = peerConnection.getSenders();
// //             console.log("Senders:", senders);

// //             const audioSender = senders.find(
// //                 (sender: RTCRtpSender) =>
// //                     sender.track && sender.track.kind === "audio"
// //             );

// //             if (audioSender) {
// //                 try {
// //                     console.log(
// //                         "Replacing local audio track with greeting audio track."
// //                     );
// //                     await audioSender.replaceTrack(newAudioTrack);
// //                     console.log("Local audio track replaced successfully.");
// //                 } catch (error) {
// //                     console.error("Error replacing local audio track:", error);
// //                 }
// //             } else {
// //                 console.error("No audio sender found in peer connection.");
// //             }
// //         } else {
// //             console.error("SessionDescriptionHandler is not available.");
// //         }
// //     };

// //     const switchBackToMicrophone = async (session: WebPhoneSession) => {
// //         try {
// //             const stream = await navigator.mediaDevices.getUserMedia({
// //                 audio: true,
// //             });
// //             if (session.sessionDescriptionHandler) {
// //                 const sdh = session.sessionDescriptionHandler as any;
// //                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

// //                 const newAudioTrack = stream.getAudioTracks()[0];
// //                 if (!newAudioTrack) {
// //                     console.error(
// //                         "No audio track found in the microphone stream"
// //                     );
// //                     return;
// //                 }

// //                 const senders = peerConnection.getSenders();
// //                 const audioSender = senders.find(
// //                     (sender: RTCRtpSender) =>
// //                         sender.track && sender.track.kind === "audio"
// //                 );

// //                 if (audioSender) {
// //                     await audioSender.replaceTrack(newAudioTrack);
// //                     console.log("Switched back to microphone audio.");
// //                 } else {
// //                     console.error("No audio sender found in peer connection.");
// //                 }
// //             }
// //         } catch (error) {
// //             console.error("Error switching back to microphone audio:", error);
// //         }
// //     };

// //     const startRecording = useCallback(async (session: WebPhoneSession) => {
// //         console.log("startRecording function called");

// //         // Reset recorded chunks
// //         remoteRecordedChunksRef.current = [];
// //         localRecordedChunksRef.current = [];

// //         // Wait for remote audio stream to be available
// //         let remoteAudio = remoteAudioRef.current;
// //         while (!remoteAudio || !remoteAudio.srcObject) {
// //             console.log("Waiting for remote audio stream...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //             remoteAudio = remoteAudioRef.current;
// //         }
// //         console.log("Remote audio source found");

// //         const options = { mimeType: "audio/webm;codecs=opus" };
// //         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
// //             console.error("MIME type not supported:", options.mimeType);
// //             options.mimeType = "audio/webm";
// //         }

// //         // Record remote audio
// //         const remoteMediaRecorder = new MediaRecorder(
// //             remoteAudio.srcObject as MediaStream,
// //             options
// //         );

// //         remoteMediaRecorder.onstart = () => {
// //             console.log("Remote MediaRecorder started");
// //         };

// //         remoteMediaRecorder.ondataavailable = (event) => {
// //             console.log("Remote data available:", event.data.size);
// //             if (event.data.size > 0) {
// //                 remoteRecordedChunksRef.current.push(event.data);
// //             }
// //         };

// //         remoteMediaRecorder.onerror = (event) => {
// //             console.error("Remote recorder error:", event);
// //         };

// //         remoteMediaRecorder.onstop = () => {
// //             console.log("Remote MediaRecorder stopped");
// //         };

// //         remoteMediaRecorder.start();
// //         remoteMediaRecorderRef.current = remoteMediaRecorder;

// //         // Wait until sessionDescriptionHandler and peerConnection are available
// //         let sdh: any;
// //         while (!session.sessionDescriptionHandler) {
// //             console.log("Waiting for sessionDescriptionHandler...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //         }
// //         sdh = session.sessionDescriptionHandler;

// //         let peerConnection: RTCPeerConnection;
// //         while (!sdh.peerConnection) {
// //             console.log("Waiting for peerConnection...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //         }
// //         peerConnection = sdh.peerConnection;

// //         console.log("PeerConnection is available");

// //         // Record local audio
// //         const localStream = new MediaStream();
// //         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
// //             if (sender.track) {
// //                 localStream.addTrack(sender.track);
// //             }
// //         });

// //         if (localStream.getTracks().length > 0) {
// //             const localMediaRecorder = new MediaRecorder(localStream, options);

// //             localMediaRecorder.onstart = () => {
// //                 console.log("Local MediaRecorder started");
// //             };

// //             localMediaRecorder.ondataavailable = (event) => {
// //                 console.log("Local data available:", event.data.size);
// //                 if (event.data.size > 0) {
// //                     localRecordedChunksRef.current.push(event.data);
// //                 }
// //             };

// //             localMediaRecorder.onerror = (event) => {
// //                 console.error("Local recorder error:", event);
// //             };

// //             localMediaRecorder.onstop = () => {
// //                 console.log("Local MediaRecorder stopped");
// //             };

// //             localMediaRecorder.start();
// //             localMediaRecorderRef.current = localMediaRecorder;
// //         } else {
// //             console.error("No local tracks available to record");
// //         }

// //         // Start audio processing
// //         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// //     }, []);

// //     const stopRecording = useCallback(() => {
// //         console.log("Stopping recording");
// //         return new Promise<void>((resolve) => {
// //             let remoteStopped = false;
// //             let localStopped = false;

// //             const checkIfBothStopped = () => {
// //                 if (remoteStopped && localStopped) {
// //                     resolve();
// //                 }
// //             };

// //             if (
// //                 remoteMediaRecorderRef.current &&
// //                 remoteMediaRecorderRef.current.state !== "inactive"
// //             ) {
// //                 remoteMediaRecorderRef.current.onstop = () => {
// //                     const remoteAudioBlob = new Blob(
// //                         remoteRecordedChunksRef.current,
// //                         {
// //                             type: "audio/webm",
// //                         }
// //                     );
// //                     const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
// //                     setRemoteRecordedAudioUrl(remoteAudioUrl);
// //                     console.log("Remote audio recording saved");
// //                     remoteStopped = true;
// //                     checkIfBothStopped();
// //                 };
// //                 remoteMediaRecorderRef.current.stop();
// //             } else {
// //                 remoteStopped = true;
// //                 checkIfBothStopped();
// //             }
// //             if (
// //                 localMediaRecorderRef.current &&
// //                 localMediaRecorderRef.current.state !== "inactive"
// //             ) {
// //                 localMediaRecorderRef.current.onstop = () => {
// //                     const localAudioBlob = new Blob(
// //                         localRecordedChunksRef.current,
// //                         {
// //                             type: "audio/webm",
// //                         }
// //                     );
// //                     const localAudioUrl = URL.createObjectURL(localAudioBlob);
// //                     setLocalRecordedAudioUrl(localAudioUrl);
// //                     console.log("Local audio recording saved");
// //                     localStopped = true;
// //                     checkIfBothStopped();
// //                 };
// //                 localMediaRecorderRef.current.stop();
// //             } else {
// //                 localStopped = true;
// //                 checkIfBothStopped();
// //             }
// //         });
// //     }, []);

// //     const setupAudioProcessing = useCallback((stream: MediaStream) => {
// //         console.log("Setting up audio processing");
// //         audioContextRef.current = new AudioContext();
// //         sourceNodeRef.current =
// //             audioContextRef.current.createMediaStreamSource(stream);
// //         analyserRef.current = audioContextRef.current.createAnalyser();
// //         scriptProcessorRef.current =
// //             audioContextRef.current.createScriptProcessor(4096, 1, 1);

// //         sourceNodeRef.current.connect(analyserRef.current);
// //         analyserRef.current.connect(scriptProcessorRef.current);
// //         scriptProcessorRef.current.connect(audioContextRef.current.destination);

// //         let silenceStart: number | null = null;
// //         const silenceThreshold = 0.0005;
// //         const silenceDuration = 300;

// //         scriptProcessorRef.current.onaudioprocess = (event) => {
// //             if (!transcriptionEnabledRef.current || isTranscribingRef.current) {
// //                 return;
// //             }

// //             const input = event.inputBuffer.getChannelData(0);
// //             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// //             const average = sum / input.length;

// //             if (average < silenceThreshold) {
// //                 if (silenceStart === null) {
// //                     silenceStart = Date.now();
// //                 } else if (Date.now() - silenceStart >= silenceDuration) {
// //                     console.log("Silence detected, calling transcribeAudio");
// //                     transcribeAudio();
// //                     silenceStart = null;
// //                 }
// //             } else {
// //                 silenceStart = null;
// //             }
// //         };
// //     }, []);

// //     const stopAllAudioProcessing = useCallback(() => {
// //         if (audioContextRef.current) {
// //             audioContextRef.current.close();
// //         }
// //         // Stop remote media recorder
// //         if (
// //             remoteMediaRecorderRef.current &&
// //             remoteMediaRecorderRef.current.state !== "inactive"
// //         ) {
// //             remoteMediaRecorderRef.current.stop();
// //         }
// //         // Stop local media recorder
// //         if (
// //             localMediaRecorderRef.current &&
// //             localMediaRecorderRef.current.state !== "inactive"
// //         ) {
// //             localMediaRecorderRef.current.stop();
// //         }
// //     }, []);

// //     const blobToBase64 = (blob: Blob): Promise<string> => {
// //         return new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onloadend = function () {
// //                 const dataUrl = reader.result as string;
// //                 const base64 = dataUrl.split(",")[1];
// //                 if (base64) {
// //                     resolve(base64);
// //                 } else {
// //                     reject("Failed to convert blob to base64");
// //                 }
// //             };
// //             reader.onerror = function (error) {
// //                 reject(error);
// //             };
// //             reader.readAsDataURL(blob);
// //         });
// //     };

// //     const transcribeAudio = useCallback(async () => {
// //         if (isTranscribingRef.current) {
// //             console.log("Transcription is already in progress");
// //             return;
// //         }
// //         isTranscribingRef.current = true;
// //         console.log("transcribeAudio called");
// //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// //             console.error(
// //                 "Remote audio source not available for transcription"
// //             );
// //             isTranscribingRef.current = false;
// //             return;
// //         }

// //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// //         const options = { mimeType: "audio/webm;codecs=opus" };

// //         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
// //             console.error("MIME type not supported:", options.mimeType);
// //             isTranscribingRef.current = false;
// //             return;
// //         }

// //         const recorder = new MediaRecorder(stream, options);
// //         const chunks: Blob[] = [];

// //         recorder.ondataavailable = (event) => {
// //             if (event.data.size > 0) {
// //                 chunks.push(event.data);
// //             }
// //         };

// //         recorder.onerror = (event) => {
// //             console.error("Recorder error:", event);
// //             isTranscribingRef.current = false;
// //         };

// //         recorder.onstop = async () => {
// //             const audioBlob = new Blob(chunks, { type: options.mimeType });

// //             try {
// //                 const base64data = await blobToBase64(audioBlob);

// //                 const response = await fetch("/api/llpmg/speech-to-text", {
// //                     method: "POST",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                     },
// //                     body: JSON.stringify({ audio: base64data }),
// //                 });

// //                 if (response.ok) {
// //                     const data = await response.json();
// //                     console.log("Transcription received:", data.result);
// //                     setTranscribedText(
// //                         (prevText) => prevText + "\nPatient: " + data.result
// //                     );
// //                 } else {
// //                     const errorText = await response.text();
// //                     console.error("Failed to transcribe audio:", errorText);
// //                 }
// //             } catch (error) {
// //                 console.error("Error transcribing audio:", error);
// //             }
// //             isTranscribingRef.current = false;
// //         };

// //         recorder.start();

// //         setTimeout(() => {
// //             recorder.stop();
// //         }, 5000);
// //     }, []);

// //     const handleCallTerminated = useCallback(
// //         async (session: WebPhoneSession) => {
// //             try {
// //                 console.log("Call terminated");
// //                 userAgent?.audioHelper.playOutgoing(false);
// //                 userAgent?.audioHelper.playIncoming(false);
// //                 setCallActive(false);
// //                 setCallEnded(true);
// //                 await stopRecording();
// //                 stopAllAudioProcessing();
// //                 onHangup();
// //             } catch (error) {
// //                 console.error("Error during call termination:", error);
// //             }
// //         },
// //         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
// //     );

// //     const handleCallAccepted = useCallback(
// //         async (session: WebPhoneSession) => {
// //             console.log("Call accepted");
// //             userAgent?.audioHelper.playOutgoing(false);
// //             userAgent?.audioHelper.playIncoming(false);
// //             setCallActive(true);
// //             setCallEnded(false);
// //             setSession(session);

// //             transcriptionEnabledRef.current = false;
// //             isPlayingGreetingRef.current = true;

// //             try {
// //                 const remoteNumber =
// //                     session.remoteIdentity?.uri?.user || "unknown";
// //                 const greetingData = await generateGreeting(remoteNumber);

// //                 if (greetingData) {
// //                     const { audioUrl, text } = greetingData;
// //                     console.log("Audio URL:", audioUrl);

// //                     if (!audioUrl) {
// //                         throw new Error("Invalid audio URL");
// //                     }

// //                     const { stream: greetingStream, ended } =
// //                         await createMediaStreamFromAudio(audioUrl);

// //                     // Wait for the session's peer connection to be established
// //                     await waitForPeerConnection(session);

// //                     await replaceLocalAudioTrack(session, greetingStream);

// //                     // Start recording if desired
// //                     await startRecording(session);

// //                     ended.then(async () => {
// //                         console.log("Greeting playback ended");
// //                         isPlayingGreetingRef.current = false;
// //                         transcriptionEnabledRef.current = true;
// //                         await switchBackToMicrophone(session);
// //                         setTranscribedText(
// //                             (prevText) => prevText + "\nSystem: " + text
// //                         );
// //                     });
// //                 } else {
// //                     console.error("No greeting data received");
// //                     transcriptionEnabledRef.current = true;
// //                     await startRecording(session);
// //                 }
// //             } catch (error) {
// //                 console.error("Error during greeting playback:", error);
// //                 transcriptionEnabledRef.current = true;
// //                 await startRecording(session);
// //             }

// //             session.on("terminated", () => handleCallTerminated(session));
// //         },
// //         [
// //             userAgent,
// //             generateGreeting,
// //             replaceLocalAudioTrack,
// //             switchBackToMicrophone,
// //             startRecording,
// //             handleCallTerminated,
// //         ]
// //     );

// //     const handleOutgoingCall = useCallback(() => {
// //         if (!userAgent || !outgoingNumber) {
// //             console.error("UserAgent or outgoing number is missing");
// //             setConnectionError("Please enter a valid phone number");
// //             return;
// //         }

// //         console.log("Placing call to:", outgoingNumber);
// //         userAgent.audioHelper.playOutgoing(true);

// //         const newSession = userAgent.invite(outgoingNumber, {});

// //         newSession.on("accepted", () => handleCallAccepted(newSession));
// //         newSession.on("terminated", () => handleCallTerminated(newSession));

// //         setSession(newSession);
// //     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

// //     const handleIncomingCall = useCallback(
// //         (action: "accept" | "decline" | "toVoicemail") => {
// //             if (!incomingCall) {
// //                 console.error("No incoming call to handle");
// //                 return;
// //             }

// //             console.log("Handling incoming call:", action);
// //             userAgent?.audioHelper.playIncoming(false);

// //             switch (action) {
// //                 case "accept":
// //                     console.log("Accepting incoming call");
// //                     incomingCall.accept();
// //                     incomingCall.on("accepted", () =>
// //                         handleCallAccepted(incomingCall)
// //                     );
// //                     incomingCall.on("terminated", () =>
// //                         handleCallTerminated(incomingCall)
// //                     );
// //                     setSession(incomingCall);
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

// //     const handleHangup = useCallback(async () => {
// //         console.log("handleHangup called");
// //         if (session) {
// //             try {
// //                 await session.dispose();
// //                 console.log("Call terminated successfully");
// //             } catch (error) {
// //                 console.error("Error terminating the call:", error);
// //             }
// //         }
// //         await stopRecording();
// //         stopAllAudioProcessing();
// //         setSession(null);
// //         setCallActive(false);
// //         setCallEnded(true);
// //         onHangup();
// //     }, [session, stopRecording, stopAllAudioProcessing, onHangup]);

// //     const toggleMute = useCallback(() => {
// //         console.log("Toggling mute");
// //         if (session) {
// //             if (muted) {
// //                 session.unmute?.();
// //             } else {
// //                 session.mute?.();
// //             }
// //             setMuted(!muted);
// //         }
// //     }, [session, muted]);

// //     const toggleHold = useCallback(() => {
// //         console.log("Toggling hold");
// //         if (session) {
// //             if (held) {
// //                 session.unhold?.();
// //             } else {
// //                 session.hold?.();
// //             }
// //             setHeld(!held);
// //         }
// //     }, [session, held]);

// //     const handlePark = useCallback(() => {
// //         console.log("Parking call");
// //         if (session) {
// //             session.park?.();
// //         }
// //     }, [session]);

// //     const handleTransfer = useCallback(() => {
// //         console.log("Initiating transfer");
// //         if (session) {
// //             const transferNumber = prompt("Enter the number to transfer to:");
// //             if (transferNumber) {
// //                 console.log("Transferring to:", transferNumber);
// //                 session.transfer?.(transferNumber);
// //             }
// //         }
// //     }, [session]);

// //     const handleFlip = useCallback(() => {
// //         console.log("Initiating flip");
// //         if (session) {
// //             const flipNumber = prompt("Enter the number to flip to:");
// //             if (flipNumber) {
// //                 console.log("Flipping to:", flipNumber);
// //                 session.flip?.(flipNumber);
// //             }
// //         }
// //     }, [session]);

// //     const handleDTMF = useCallback(() => {
// //         console.log("Sending DTMF");
// //         if (session) {
// //             const digit = prompt("Enter the DTMF digit:");
// //             if (digit) {
// //                 console.log("Sending DTMF digit:", digit);
// //                 session.dtmf?.(digit);
// //             }
// //         }
// //     }, [session]);

// //     const adjustVolume = useCallback((direction: number) => {
// //         console.log("Adjusting volume:", direction);
// //         if (remoteAudioRef.current) {
// //             remoteAudioRef.current.volume = Math.min(
// //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// //                 1
// //             );
// //             console.log("New volume:", remoteAudioRef.current.volume);
// //         }
// //     }, []);

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
// //                             onClick={() => {
// //                                 console.log("Initiating authentication");
// //                                 initiateAuth();
// //                             }}
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
// //                             onClick={() => {
// //                                 console.log("Logging out");
// //                                 onLogout();
// //                             }}
// //                             className="text-sm text-gray-400 hover:text-white mb-4"
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
// //                                     onChange={(e) => {
// //                                         console.log(
// //                                             "Outgoing number changed:",
// //                                             e.target.value
// //                                         );
// //                                         setOutgoingNumber(e.target.value);
// //                                     }}
// //                                     placeholder="+1 234 567-8900"
// //                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// //                                 />
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log("Initiating outgoing call");
// //                                         handleOutgoingCall();
// //                                     }}
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
// //                                         onClick={handlePark}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         Park
// //                                     </button>
// //                                     <button
// //                                         onClick={handleTransfer}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         Transfer
// //                                     </button>
// //                                     <button
// //                                         onClick={handleFlip}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         Flip
// //                                     </button>
// //                                     <button
// //                                         onClick={handleDTMF}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         Send DTMF
// //                                     </button>
// //                                     <button
// //                                         onClick={() => adjustVolume(0.1)}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         + Volume
// //                                     </button>
// //                                     <button
// //                                         onClick={() => adjustVolume(-0.1)}
// //                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                     >
// //                                         - Volume
// //                                     </button>
// //                                     <button
// //                                         onClick={() => {
// //                                             console.log("Hanging up call");
// //                                             handleHangup();
// //                                         }}
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
// //                         {callEnded && (
// //                             <div className="recorded-audio mt-6">
// //                                 <h4 className="text-white text-xl mb-4">
// //                                     Recorded Audio
// //                                 </h4>
// //                                 {remoteRecordedAudioUrl ? (
// //                                     <>
// //                                         <h5 className="text-white text-lg mb-2">
// //                                             Remote Audio
// //                                         </h5>
// //                                         <audio
// //                                             controls
// //                                             src={remoteRecordedAudioUrl}
// //                                             className="w-full"
// //                                         />
// //                                     </>
// //                                 ) : (
// //                                     <p className="text-gray-400">
// //                                         No remote audio recorded.
// //                                     </p>
// //                                 )}
// //                                 {localRecordedAudioUrl ? (
// //                                     <>
// //                                         <h5 className="text-white text-lg mb-2">
// //                                             Local Audio
// //                                         </h5>
// //                                         <audio
// //                                             controls
// //                                             src={localRecordedAudioUrl}
// //                                             className="w-full"
// //                                         />
// //                                     </>
// //                                 ) : (
// //                                     <p className="text-gray-400">
// //                                         No local audio recorded.
// //                                     </p>
// //                                 )}
// //                             </div>
// //                         )}
// //                         {incomingCall && (
// //                             <div className="incoming-call mt-6">
// //                                 <h3 className="text-white text-xl mb-3">
// //                                     Incoming Call
// //                                 </h3>
// //                                 <div className="grid grid-cols-3 gap-2">
// //                                     <button
// //                                         onClick={() => {
// //                                             console.log(
// //                                                 "Accepting incoming call"
// //                                             );
// //                                             handleIncomingCall("accept");
// //                                         }}
// //                                         className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         Answer
// //                                     </button>
// //                                     <button
// //                                         onClick={() => {
// //                                             console.log(
// //                                                 "Declining incoming call"
// //                                             );
// //                                             handleIncomingCall("decline");
// //                                         }}
// //                                         className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                     >
// //                                         Decline
// //                                     </button>
// //                                     <button
// //                                         onClick={() => {
// //                                             console.log(
// //                                                 "Sending incoming call to voicemail"
// //                                             );
// //                                             handleIncomingCall("toVoicemail");
// //                                         }}
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

// // o1 4 (broken audio, outgoing greeting, and ui)
// // SipSpeech.tsx

// // import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// // import { WebPhoneInvitation, WebPhoneSession } from "@/ref/web/src/session";
// // import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// // import React, { useState, useEffect, useRef, useCallback } from "react";
// // import { SessionState } from "sip.js";

// // interface SipSpeechComponentProps {
// //     onHangup: () => void;
// //     initiateAuth: () => void;
// //     tokenData: any;
// //     onLogout: () => void;
// //     setTokenData: (data: any) => void;
// // }

// // interface GreetingResponse {
// //     audioUrl: string;
// //     greetingText: string;
// // }

// // const SipSpeechComponent: React.FC<SipSpeechComponentProps> = ({
// //     onHangup,
// //     initiateAuth,
// //     tokenData,
// //     onLogout,
// //     setTokenData,
// // }) => {
// //     // State variables
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
// //     const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null);
// //     const [isOutgoingCall, setIsOutgoingCall] = useState<boolean>(false);

// //     // Refs for audio processing
// //     const audioContextRef = useRef<AudioContext | null>(null);
// //     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
// //     const analyserRef = useRef<AnalyserNode | null>(null);
// //     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
// //     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

// //     // Recording refs and states
// //     const mixedMediaRecorderRef = useRef<MediaRecorder | null>(null);
// //     const recordedChunksRef = useRef<Blob[]>([]);

// //     // Refs to control transcription and greeting playback
// //     const transcriptionEnabledRef = useRef<boolean>(false);
// //     const isPlayingGreetingRef = useRef<boolean>(false);
// //     const isTranscribingRef = useRef<boolean>(false);

// //     useEffect(() => {
// //         console.log("SipSpeechComponent mounted");
// //         remoteAudioRef.current = document.getElementById(
// //             "remoteAudio"
// //         ) as HTMLAudioElement;
// //         if (remoteAudioRef.current) {
// //             remoteAudioRef.current.onloadedmetadata = () => {
// //                 remoteAudioRef.current!.muted = false;
// //             };
// //         }
// //         if (tokenData) {
// //             console.log("TokenData available, initializing WebPhone");
// //             const parsedTokenData =
// //                 typeof tokenData === "string"
// //                     ? JSON.parse(tokenData)
// //                     : tokenData;
// //             initializeWebPhone(parsedTokenData);
// //         }
// //         return () => {
// //             console.log("SipSpeechComponent unmounting");
// //             stopAllAudioProcessing();
// //         };
// //     }, [tokenData]);

// //     const initializeWebPhone = useCallback(async (tokenData: any) => {
// //         try {
// //             console.log("Starting WebPhone Initialization...");
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
// //                     // Removed auto playback of incoming sound due to autoplay policies
// //                     // webPhone.userAgent.audioHelper.playIncoming(true);
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

// //     const generateGreeting = useCallback(async (callerNumber: string) => {
// //         try {
// //             console.log("Generating greeting for caller:", callerNumber);
// //             const response = await fetch("/api/llpmg/generate-greeting", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({
// //                     remoteCaller: { remoteNumber: callerNumber },
// //                 }),
// //             });

// //             if (response.ok) {
// //                 const data: GreetingResponse = await response.json();
// //                 console.log("Greeting data received:", data);
// //                 return { audioUrl: data.audioUrl, text: data.greetingText };
// //             } else {
// //                 const errorText = await response.text();
// //                 console.error(
// //                     "Failed to generate greeting:",
// //                     response.status,
// //                     errorText
// //                 );
// //                 return null;
// //             }
// //         } catch (error) {
// //             console.error("Error generating greeting:", error);
// //             return null;
// //         }
// //     }, []);

// //     const createMediaStreamFromAudio = async (
// //         audioUrl: string
// //     ): Promise<{ stream: MediaStream; ended: Promise<void> }> => {
// //         try {
// //             const audioContext = new AudioContext();

// //             // Resume AudioContext if suspended
// //             if (audioContext.state === "suspended") {
// //                 await audioContext.resume();
// //                 console.log("AudioContext resumed");
// //             }

// //             const response = await fetch(audioUrl);
// //             if (!response.ok) {
// //                 throw new Error(
// //                     `Failed to fetch audio file: ${response.statusText}`
// //                 );
// //             }

// //             const arrayBuffer = await response.arrayBuffer();
// //             const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
// //             const source = audioContext.createBufferSource();
// //             source.buffer = audioBuffer;

// //             const destination = audioContext.createMediaStreamDestination();
// //             source.connect(destination);
// //             source.start();

// //             const ended = new Promise<void>((resolve) => {
// //                 source.onended = () => {
// //                     // Close AudioContext safely
// //                     if (audioContext.state !== "closed") {
// //                         audioContext.close();
// //                     }
// //                     resolve();
// //                 };
// //             });

// //             return { stream: destination.stream, ended };
// //         } catch (error) {
// //             console.error("Error creating media stream from audio:", error);
// //             throw error;
// //         }
// //     };

// //     const waitForPeerConnection = async (session: WebPhoneSession) => {
// //         while (
// //             !session.sessionDescriptionHandler ||
// //             !(session.sessionDescriptionHandler as any).peerConnection
// //         ) {
// //             console.log("Waiting for peer connection...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //         }
// //         console.log("Peer connection is ready");
// //     };

// //     const replaceLocalAudioTrack = async (
// //         session: WebPhoneSession,
// //         newStream: MediaStream
// //     ) => {
// //         if (session.sessionDescriptionHandler) {
// //             const sdh = session.sessionDescriptionHandler as any;
// //             const peerConnection = sdh.peerConnection as RTCPeerConnection;

// //             if (!peerConnection) {
// //                 console.error("PeerConnection is not available.");
// //                 return;
// //             }

// //             console.log("PeerConnection:", peerConnection);

// //             const newAudioTrack = newStream.getAudioTracks()[0];
// //             if (!newAudioTrack) {
// //                 console.error("No audio track found in the new stream");
// //                 return;
// //             }

// //             const senders = peerConnection.getSenders();
// //             console.log("Senders:", senders);

// //             const audioSender = senders.find(
// //                 (sender: RTCRtpSender) =>
// //                     sender.track && sender.track.kind === "audio"
// //             );

// //             if (audioSender) {
// //                 try {
// //                     console.log(
// //                         "Replacing local audio track with greeting audio track."
// //                     );
// //                     await audioSender.replaceTrack(newAudioTrack);
// //                     console.log("Local audio track replaced successfully.");
// //                 } catch (error) {
// //                     console.error("Error replacing local audio track:", error);
// //                 }
// //             } else {
// //                 console.error("No audio sender found in peer connection.");
// //             }
// //         } else {
// //             console.error("SessionDescriptionHandler is not available.");
// //         }
// //     };

// //     const switchBackToMicrophone = async (session: WebPhoneSession) => {
// //         try {
// //             const stream = await navigator.mediaDevices.getUserMedia({
// //                 audio: true,
// //             });
// //             if (session.sessionDescriptionHandler) {
// //                 const sdh = session.sessionDescriptionHandler as any;
// //                 const peerConnection = sdh.peerConnection as RTCPeerConnection;

// //                 const newAudioTrack = stream.getAudioTracks()[0];
// //                 if (!newAudioTrack) {
// //                     console.error(
// //                         "No audio track found in the microphone stream"
// //                     );
// //                     return;
// //                 }

// //                 const senders = peerConnection.getSenders();
// //                 const audioSender = senders.find(
// //                     (sender: RTCRtpSender) =>
// //                         sender.track && sender.track.kind === "audio"
// //                 );

// //                 if (audioSender) {
// //                     await audioSender.replaceTrack(newAudioTrack);
// //                     console.log("Switched back to microphone audio.");
// //                 } else {
// //                     console.error("No audio sender found in peer connection.");
// //                 }
// //             }
// //         } catch (error) {
// //             console.error("Error switching back to microphone audio:", error);
// //         }
// //     };

// //     const startRecording = useCallback(async (session: WebPhoneSession) => {
// //         console.log("startRecording function called");

// //         // Wait for remote audio stream to be available
// //         let remoteAudio = remoteAudioRef.current;
// //         while (!remoteAudio || !remoteAudio.srcObject) {
// //             console.log("Waiting for remote audio stream...");
// //             await new Promise((resolve) => setTimeout(resolve, 100));
// //             remoteAudio = remoteAudioRef.current;
// //         }
// //         console.log("Remote audio source found");

// //         // Wait for peerConnection
// //         await waitForPeerConnection(session);
// //         const sdh = session.sessionDescriptionHandler as any;
// //         const peerConnection = sdh.peerConnection as RTCPeerConnection;

// //         // Get local audio stream
// //         const localStream = new MediaStream();
// //         peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
// //             if (sender.track && sender.track.kind === "audio") {
// //                 localStream.addTrack(sender.track);
// //             }
// //         });

// //         // Mix local and remote streams
// //         const mixedStream = new MediaStream();
// //         const audioContext = new AudioContext();
// //         audioContextRef.current = audioContext; // Store reference

// //         const destination = audioContext.createMediaStreamDestination();

// //         // Resume AudioContext if suspended
// //         if (audioContext.state === "suspended") {
// //             await audioContext.resume();
// //             console.log("AudioContext resumed for recording");
// //         }

// //         // Create source nodes
// //         const remoteSource = audioContext.createMediaStreamSource(
// //             remoteAudio.srcObject as MediaStream
// //         );
// //         const localSource = audioContext.createMediaStreamSource(localStream);

// //         // Adjust volumes if necessary
// //         const remoteGain = audioContext.createGain();
// //         remoteGain.gain.value = 1.0; // Adjust as needed
// //         const localGain = audioContext.createGain();
// //         localGain.gain.value = 1.0; // Adjust as needed

// //         // Connect sources to destination
// //         remoteSource.connect(remoteGain).connect(destination);
// //         localSource.connect(localGain).connect(destination);

// //         // Create the mixed stream
// //         mixedStream.addTrack(destination.stream.getAudioTracks()[0]);

// //         // Record the mixed stream
// //         const options = { mimeType: "audio/webm;codecs=opus" };
// //         const mediaRecorder = new MediaRecorder(mixedStream, options);
// //         recordedChunksRef.current = []; // Reset recorded chunks

// //         mediaRecorder.ondataavailable = (event) => {
// //             if (event.data.size > 0) {
// //                 recordedChunksRef.current.push(event.data);
// //             }
// //         };

// //         mediaRecorder.onstop = () => {
// //             console.log("Mixed audio recording stopped");
// //             const audioBlob = new Blob(recordedChunksRef.current, {
// //                 type: "audio/webm",
// //             });
// //             const audioUrl = URL.createObjectURL(audioBlob);
// //             setMixedAudioUrl(audioUrl);
// //         };

// //         mediaRecorder.start();
// //         mixedMediaRecorderRef.current = mediaRecorder;

// //         // Start transcription
// //         setupAudioProcessing(remoteAudio.srcObject as MediaStream);
// //     }, []);

// //     const stopRecording = useCallback(() => {
// //         console.log("Stopping recording");
// //         return new Promise<void>((resolve) => {
// //             if (
// //                 mixedMediaRecorderRef.current &&
// //                 mixedMediaRecorderRef.current.state !== "inactive"
// //             ) {
// //                 mixedMediaRecorderRef.current.onstop = () => {
// //                     console.log("Mixed audio recording saved");
// //                     resolve();
// //                 };
// //                 mixedMediaRecorderRef.current.stop();
// //             } else {
// //                 resolve();
// //             }
// //         });
// //     }, []);

// //     const setupAudioProcessing = useCallback((stream: MediaStream) => {
// //         console.log("Setting up audio processing");

// //         const audioContext = new AudioContext();
// //         audioContextRef.current = audioContext;

// //         const sourceNode = audioContext.createMediaStreamSource(stream);
// //         sourceNodeRef.current = sourceNode;

// //         // Create a biquad filter for noise reduction
// //         const biquadFilter = audioContext.createBiquadFilter();
// //         biquadFilter.type = "lowpass";
// //         biquadFilter.frequency.value = 3000; // Adjust frequency as needed

// //         // Connect nodes
// //         sourceNode.connect(biquadFilter);

// //         const analyser = audioContext.createAnalyser();
// //         analyserRef.current = analyser;
// //         biquadFilter.connect(analyser);

// //         const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
// //         scriptProcessorRef.current = scriptProcessor;
// //         analyser.connect(scriptProcessor);
// //         scriptProcessor.connect(audioContext.destination);

// //         let silenceStart: number | null = null;
// //         const silenceThreshold = 0.001; // Adjusted from 0.0005
// //         const silenceDuration = 500; // Adjusted from 300ms

// //         scriptProcessorRef.current.onaudioprocess = (event) => {
// //             if (!transcriptionEnabledRef.current || isTranscribingRef.current) {
// //                 return;
// //             }

// //             const input = event.inputBuffer.getChannelData(0);
// //             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
// //             const average = sum / input.length;

// //             if (average < silenceThreshold) {
// //                 if (silenceStart === null) {
// //                     silenceStart = Date.now();
// //                 } else if (Date.now() - silenceStart >= silenceDuration) {
// //                     console.log("Silence detected, calling transcribeAudio");
// //                     transcribeAudio();
// //                     silenceStart = null;
// //                 }
// //             } else {
// //                 silenceStart = null;
// //             }
// //         };
// //     }, []);

// //     const stopAllAudioProcessing = useCallback(() => {
// //         if (
// //             audioContextRef.current &&
// //             audioContextRef.current.state !== "closed"
// //         ) {
// //             audioContextRef.current.close();
// //         }
// //         // Stop mixed media recorder
// //         if (
// //             mixedMediaRecorderRef.current &&
// //             mixedMediaRecorderRef.current.state !== "inactive"
// //         ) {
// //             mixedMediaRecorderRef.current.stop();
// //         }
// //     }, []);

// //     const blobToBase64 = (blob: Blob): Promise<string> => {
// //         return new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onloadend = function () {
// //                 const dataUrl = reader.result as string;
// //                 const base64 = dataUrl.split(",")[1];
// //                 if (base64) {
// //                     resolve(base64);
// //                 } else {
// //                     reject("Failed to convert blob to base64");
// //                 }
// //             };
// //             reader.onerror = function (error) {
// //                 reject(error);
// //             };
// //             reader.readAsDataURL(blob);
// //         });
// //     };

// //     const transcribeAudio = useCallback(async () => {
// //         if (isTranscribingRef.current) {
// //             console.log("Transcription is already in progress");
// //             return;
// //         }
// //         isTranscribingRef.current = true;
// //         console.log("transcribeAudio called");
// //         if (!remoteAudioRef.current || !remoteAudioRef.current.srcObject) {
// //             console.error(
// //                 "Remote audio source not available for transcription"
// //             );
// //             isTranscribingRef.current = false;
// //             return;
// //         }

// //         const stream = remoteAudioRef.current.srcObject as MediaStream;
// //         const options = { mimeType: "audio/webm;codecs=opus" };

// //         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
// //             console.error("MIME type not supported:", options.mimeType);
// //             isTranscribingRef.current = false;
// //             return;
// //         }

// //         const recorder = new MediaRecorder(stream, options);
// //         const chunks: Blob[] = [];

// //         recorder.ondataavailable = (event) => {
// //             if (event.data.size > 0) {
// //                 chunks.push(event.data);
// //             }
// //         };

// //         recorder.onerror = (event) => {
// //             console.error("Recorder error:", event);
// //             isTranscribingRef.current = false;
// //         };

// //         recorder.onstop = async () => {
// //             const audioBlob = new Blob(chunks, { type: options.mimeType });

// //             try {
// //                 const base64data = await blobToBase64(audioBlob);

// //                 const response = await fetch("/api/llpmg/speech-to-text", {
// //                     method: "POST",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                     },
// //                     body: JSON.stringify({ audio: base64data }),
// //                 });

// //                 if (response.ok) {
// //                     const data = await response.json();
// //                     let transcribedTextResult = data.result;

// //                     // Filter out unwanted phrases
// //                     const unwantedPhrases = ["Thank you", "bye-bye", "you"]; // Add any other unwanted phrases
// //                     unwantedPhrases.forEach((phrase) => {
// //                         const regex = new RegExp(`\\b${phrase}\\b`, "gi");
// //                         transcribedTextResult = transcribedTextResult.replace(
// //                             regex,
// //                             ""
// //                         );
// //                     });

// //                     // Trim and check if the text is not empty
// //                     transcribedTextResult = transcribedTextResult.trim();
// //                     if (transcribedTextResult) {
// //                         console.log(
// //                             "Transcription received:",
// //                             transcribedTextResult
// //                         );
// //                         setTranscribedText(
// //                             (prevText) =>
// //                                 prevText + "\nPatient: " + transcribedTextResult
// //                         );
// //                     } else {
// //                         console.log(
// //                             "Transcription contained only unwanted phrases and was ignored."
// //                         );
// //                     }
// //                 } else {
// //                     const errorText = await response.text();
// //                     console.error("Failed to transcribe audio:", errorText);
// //                 }
// //             } catch (error) {
// //                 console.error("Error transcribing audio:", error);
// //             }
// //             isTranscribingRef.current = false;
// //         };

// //         recorder.start();

// //         setTimeout(() => {
// //             recorder.stop();
// //         }, 5000);
// //     }, []);

// //     const handleCallTerminated = useCallback(
// //         async (session: WebPhoneSession) => {
// //             try {
// //                 console.log("Call terminated");
// //                 userAgent?.audioHelper.playOutgoing(false);
// //                 userAgent?.audioHelper.playIncoming(false);
// //                 setCallActive(false);
// //                 setCallEnded(true);
// //                 await stopRecording();
// //                 stopAllAudioProcessing();
// //                 onHangup();
// //             } catch (error) {
// //                 console.error("Error during call termination:", error);
// //             }
// //         },
// //         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
// //     );

// //     const handleCallAccepted = useCallback(
// //         async (session: WebPhoneSession) => {
// //             console.log("Call accepted");
// //             userAgent?.audioHelper.playOutgoing(false);
// //             userAgent?.audioHelper.playIncoming(false);
// //             setCallActive(true);
// //             setCallEnded(false);
// //             setSession(session);

// //             transcriptionEnabledRef.current = false;
// //             isPlayingGreetingRef.current = true;

// //             try {
// //                 const remoteNumber =
// //                     session.remoteIdentity?.uri?.user || "unknown";
// //                 const greetingData = await generateGreeting(remoteNumber);

// //                 if (greetingData) {
// //                     const { audioUrl, text } = greetingData;
// //                     console.log("Audio URL:", audioUrl);

// //                     if (!audioUrl) {
// //                         throw new Error("Invalid audio URL");
// //                     }

// //                     await waitForPeerConnection(session);

// //                     const { stream: greetingStream, ended } =
// //                         await createMediaStreamFromAudio(audioUrl);
// //                     await replaceLocalAudioTrack(session, greetingStream);

// //                     // Start recording
// //                     await startRecording(session);

// //                     ended.then(async () => {
// //                         console.log("Greeting playback ended");
// //                         isPlayingGreetingRef.current = false;
// //                         transcriptionEnabledRef.current = true;
// //                         await switchBackToMicrophone(session);
// //                         setTranscribedText(
// //                             (prevText) => prevText + "\nSystem: " + text
// //                         );
// //                     });
// //                 } else {
// //                     console.error("No greeting data received");
// //                     transcriptionEnabledRef.current = true;
// //                     await startRecording(session);
// //                 }
// //             } catch (error) {
// //                 console.error("Error during greeting playback:", error);
// //                 transcriptionEnabledRef.current = true;
// //                 await startRecording(session);
// //             }

// //             session.on("terminated", () => handleCallTerminated(session));
// //         },
// //         [
// //             userAgent,
// //             generateGreeting,
// //             replaceLocalAudioTrack,
// //             switchBackToMicrophone,
// //             startRecording,
// //             handleCallTerminated,
// //         ]
// //     );

// //     const handleOutgoingCall = useCallback(() => {
// //         if (!userAgent || !outgoingNumber) {
// //             console.error("UserAgent or outgoing number is missing");
// //             setConnectionError("Please enter a valid phone number");
// //             return;
// //         }

// //         console.log("Placing call to:", outgoingNumber);
// //         // Removed auto playback of outgoing sound due to autoplay policies
// //         // userAgent.audioHelper.playOutgoing(true);

// //         // Require user interaction to start the call
// //         userInteraction(() => {
// //             const newSession = userAgent.invite(outgoingNumber, {});

// //             // Set flag to indicate outgoing call
// //             setIsOutgoingCall(true);

// //             newSession.on("accepted", () => handleCallAccepted(newSession));
// //             newSession.on("terminated", () => handleCallTerminated(newSession));

// //             setSession(newSession);
// //         });
// //     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

// //     const handleIncomingCall = useCallback(
// //         (action: "accept" | "decline" | "toVoicemail") => {
// //             if (!incomingCall) {
// //                 console.error("No incoming call to handle");
// //                 return;
// //             }

// //             console.log("Handling incoming call:", action);
// //             // Removed auto playback of incoming sound due to autoplay policies
// //             // userAgent?.audioHelper.playIncoming(false);

// //             // Set flag to indicate incoming call
// //             setIsOutgoingCall(false);

// //             switch (action) {
// //                 case "accept":
// //                     console.log("Accepting incoming call");
// //                     incomingCall.accept();
// //                     incomingCall.on("accepted", () =>
// //                         handleCallAccepted(incomingCall)
// //                     );
// //                     incomingCall.on("terminated", () =>
// //                         handleCallTerminated(incomingCall)
// //                     );
// //                     setSession(incomingCall);
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

// //     const handleHangup = useCallback(async () => {
// //         console.log("handleHangup called");
// //         if (session) {
// //             try {
// //                 // Use the appropriate method to terminate the call
// //                 if (session.state === SessionState.Established) {
// //                     await session.dispose();
// //                 } else if (
// //                     session.state === SessionState.Initial ||
// //                     session.state === SessionState.Establishing
// //                 ) {
// //                     await session.dispose();
// //                 } else {
// //                     await session.dispose();
// //                 }
// //                 console.log("Call terminated successfully");
// //             } catch (error) {
// //                 console.error("Error terminating the call:", error);
// //             }
// //         }
// //         await stopRecording();
// //         stopAllAudioProcessing();
// //         setSession(null);
// //         setCallActive(false);
// //         setCallEnded(true);
// //         onHangup();
// //     }, [session, stopRecording, stopAllAudioProcessing, onHangup]);

// //     const toggleMute = useCallback(() => {
// //         console.log("Toggling mute");
// //         if (session) {
// //             if (muted) {
// //                 session.unmute?.();
// //             } else {
// //                 session.mute?.();
// //             }
// //             setMuted(!muted);
// //         }
// //     }, [session, muted]);

// //     const toggleHold = useCallback(() => {
// //         console.log("Toggling hold");
// //         if (session) {
// //             if (held) {
// //                 session.unhold?.();
// //             } else {
// //                 session.hold?.();
// //             }
// //             setHeld(!held);
// //         }
// //     }, [session, held]);

// //     const handlePark = useCallback(() => {
// //         console.log("Parking call");
// //         if (session) {
// //             session.park?.();
// //         }
// //     }, [session]);

// //     const handleTransfer = useCallback(() => {
// //         console.log("Initiating transfer");
// //         if (session) {
// //             const transferNumber = prompt("Enter the number to transfer to:");
// //             if (transferNumber) {
// //                 console.log("Transferring to:", transferNumber);
// //                 session.transfer?.(transferNumber);
// //             }
// //         }
// //     }, [session]);

// //     const handleFlip = useCallback(() => {
// //         console.log("Initiating flip");
// //         if (session) {
// //             const flipNumber = prompt("Enter the number to flip to:");
// //             if (flipNumber) {
// //                 console.log("Flipping to:", flipNumber);
// //                 session.flip?.(flipNumber);
// //             }
// //         }
// //     }, [session]);

// //     const handleDTMF = useCallback(() => {
// //         console.log("Sending DTMF");
// //         if (session) {
// //             const digit = prompt("Enter the DTMF digit:");
// //             if (digit) {
// //                 console.log("Sending DTMF digit:", digit);
// //                 session.dtmf?.(digit);
// //             }
// //         }
// //     }, [session]);

// //     const adjustVolume = useCallback((direction: number) => {
// //         console.log("Adjusting volume:", direction);
// //         if (remoteAudioRef.current) {
// //             remoteAudioRef.current.volume = Math.min(
// //                 Math.max(remoteAudioRef.current.volume + direction, 0),
// //                 1
// //             );
// //             console.log("New volume:", remoteAudioRef.current.volume);
// //         }
// //     }, []);

// //     // Utility function to ensure user interaction
// //     const userInteraction = (callback: () => void) => {
// //         const handleClick = () => {
// //             document.removeEventListener("click", handleClick);
// //             callback();
// //         };
// //         document.addEventListener("click", handleClick);
// //     };

// //     return (
// //         <div className="bg-black min-h-screen flex items-center justify-center p-6">
// //             {/* UI components */}
// //             {/* Include your UI code here */}
// //             <audio id="remoteAudio" ref={remoteAudioRef} hidden />
// //             <audio id="localAudio" hidden muted />
// //             {connectionError && (
// //                 <div className="text-red-500 text-sm mb-4">
// //                     {connectionError}
// //                 </div>
// //             )}
// //             {!isAuthenticated ? (
// //                 <div className="auth flex flex-col items-center">
// //                     <button
// //                         onClick={() => {
// //                             console.log("Initiating authentication");
// //                             initiateAuth();
// //                         }}
// //                         className="auth-button text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                     >
// //                         Authorize
// //                     </button>
// //                 </div>
// //             ) : (
// //                 <>
// //                     <h3 className="text-white text-2xl mb-6">
// //                         LLPMG WebPhone Dashboard
// //                     </h3>
// //                     <button
// //                         onClick={() => {
// //                             console.log("Logging out");
// //                             onLogout();
// //                         }}
// //                         className="text-sm text-gray-400 hover:text-white mb-4"
// //                     >
// //                         Logout
// //                     </button>
// //                     {!callActive && (
// //                         <div className="outgoing-call mt-4">
// //                             <h4 className="text-white text-xl mb-3">
// //                                 Outgoing Call
// //                             </h4>
// //                             <input
// //                                 type="text"
// //                                 value={outgoingNumber}
// //                                 onChange={(e) => {
// //                                     console.log(
// //                                         "Outgoing number changed:",
// //                                         e.target.value
// //                                     );
// //                                     setOutgoingNumber(e.target.value);
// //                                 }}
// //                                 placeholder="+1 234 567-8900"
// //                                 className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// //                             />
// //                             <button
// //                                 onClick={() => {
// //                                     console.log("Initiating outgoing call");
// //                                     handleOutgoingCall();
// //                                 }}
// //                                 className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                             >
// //                                 Call
// //                             </button>
// //                         </div>
// //                     )}
// //                     {callActive && (
// //                         <div className="active-call mt-6">
// //                             <h4 className="text-white text-xl mb-4">
// //                                 Call In Progress
// //                             </h4>
// //                             <div className="grid grid-cols-2 gap-4">
// //                                 <button
// //                                     onClick={toggleMute}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     {muted ? "Unmute" : "Mute"}
// //                                 </button>
// //                                 <button
// //                                     onClick={toggleHold}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     {held ? "Unhold" : "Hold"}
// //                                 </button>
// //                                 <button
// //                                     onClick={handlePark}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     Park
// //                                 </button>
// //                                 <button
// //                                     onClick={handleTransfer}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     Transfer
// //                                 </button>
// //                                 <button
// //                                     onClick={handleFlip}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     Flip
// //                                 </button>
// //                                 <button
// //                                     onClick={handleDTMF}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     Send DTMF
// //                                 </button>
// //                                 <button
// //                                     onClick={() => adjustVolume(0.1)}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     + Volume
// //                                 </button>
// //                                 <button
// //                                     onClick={() => adjustVolume(-0.1)}
// //                                     className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
// //                                 >
// //                                     - Volume
// //                                 </button>
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log("Hanging up call");
// //                                         handleHangup();
// //                                     }}
// //                                     className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     Hang Up
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     )}
// //                     {(callActive || callEnded) && (
// //                         <div className="transcription mt-6">
// //                             <h4 className="text-white text-xl mb-4">
// //                                 {callEnded
// //                                     ? "Call Transcription"
// //                                     : "Live Transcription"}
// //                             </h4>
// //                             <div className="bg-gray-700 p-4 rounded-lg text-white max-h-40 overflow-y-auto">
// //                                 {transcribedText ||
// //                                     "Transcription will appear here..."}
// //                             </div>
// //                         </div>
// //                     )}
// //                     {callEnded && (
// //                         <div className="recorded-audio mt-6">
// //                             <h4 className="text-white text-xl mb-4">
// //                                 Recorded Conversation
// //                             </h4>
// //                             {mixedAudioUrl ? (
// //                                 <>
// //                                     <audio
// //                                         controls
// //                                         src={mixedAudioUrl}
// //                                         className="w-full"
// //                                     />
// //                                 </>
// //                             ) : (
// //                                 <p className="text-gray-400">
// //                                     No audio recorded.
// //                                 </p>
// //                             )}
// //                         </div>
// //                     )}
// //                     {incomingCall && (
// //                         <div className="incoming-call mt-6">
// //                             <h3 className="text-white text-xl mb-3">
// //                                 Incoming Call
// //                             </h3>
// //                             <div className="grid grid-cols-3 gap-2">
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log("Accepting incoming call");
// //                                         handleIncomingCall("accept");
// //                                     }}
// //                                     className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     Answer
// //                                 </button>
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log("Declining incoming call");
// //                                         handleIncomingCall("decline");
// //                                     }}
// //                                     className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     Decline
// //                                 </button>
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log(
// //                                             "Sending incoming call to voicemail"
// //                                         );
// //                                         handleIncomingCall("toVoicemail");
// //                                     }}
// //                                     className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
// //                                 >
// //                                     To Voicemail
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </>
// //             )}
// //         </div>
// //     );
// // };

// // export default SipSpeechComponent;

// // 3.5-sonnet 0
// "use client";

// import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
// import { WebPhoneInvitation, WebPhoneSession } from "@/ref/web/src/session";
// import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";
// import { useState, useEffect, useRef, useCallback } from "react";

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

//     const audioContextRef = useRef<AudioContext | null>(null);
//     const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//     const analyserRef = useRef<AnalyserNode | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

//     const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const remoteRecordedChunksRef = useRef<Blob[]>([]);
//     const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const localRecordedChunksRef = useRef<Blob[]>([]);
//     const [remoteRecordedAudioUrl, setRemoteRecordedAudioUrl] = useState<
//         string | null
//     >(null);
//     const [localRecordedAudioUrl, setLocalRecordedAudioUrl] = useState<
//         string | null
//     >(null);

//     const transcriptionEnabledRef = useRef<boolean>(false);
//     const isPlayingGreetingRef = useRef<boolean>(false);
//     const isTranscribingRef = useRef<boolean>(false);
//     const combinedStreamRef = useRef<MediaStream | null>(null);

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
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     remoteCaller: { remoteNumber: callerNumber },
//                 }),
//             });

//             if (response.ok) {
//                 const data: GreetingResponse = await response.json();
//                 console.log("Greeting data received:", data);
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
//     ): Promise<{ stream: MediaStream; ended: Promise<void> }> => {
//         try {
//             const audioContext = new AudioContext();

//             if (audioContext.state === "suspended") {
//                 await audioContext.resume();
//                 console.log("AudioContext resumed");
//             }

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

//             const ended = new Promise<void>((resolve) => {
//                 source.onended = () => {
//                     audioContext.close();
//                     resolve();
//                 };
//             });

//             return { stream: destination.stream, ended };
//         } catch (error) {
//             console.error("Error creating media stream from audio:", error);
//             throw error;
//         }
//     };

//     const waitForPeerConnection = async (session: WebPhoneSession) => {
//         while (
//             !session.sessionDescriptionHandler ||
//             !(session.sessionDescriptionHandler as any).peerConnection
//         ) {
//             console.log("Waiting for peer connection...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         console.log("Peer connection is ready");
//     };

//     const replaceLocalAudioTrack = async (
//         session: WebPhoneSession,
//         newStream: MediaStream
//     ) => {
//         if (session.sessionDescriptionHandler) {
//             const sdh = session.sessionDescriptionHandler as any;
//             const peerConnection = sdh.peerConnection as RTCPeerConnection;

//             if (!peerConnection) {
//                 console.error("PeerConnection is not available.");
//                 return;
//             }

//             console.log("PeerConnection:", peerConnection);

//             const newAudioTrack = newStream.getAudioTracks()[0];
//             if (!newAudioTrack) {
//                 console.error("No audio track found in the new stream");
//                 return;
//             }

//             const senders = peerConnection.getSenders();
//             console.log("Senders:", senders);

//             const audioSender = senders.find(
//                 (sender: RTCRtpSender) =>
//                     sender.track && sender.track.kind === "audio"
//             );

//             if (audioSender) {
//                 try {
//                     console.log(
//                         "Replacing local audio track with greeting audio track."
//                     );
//                     await audioSender.replaceTrack(newAudioTrack);
//                     console.log("Local audio track replaced successfully.");
//                 } catch (error) {
//                     console.error("Error replacing local audio track:", error);
//                 }
//             } else {
//                 console.error("No audio sender found in peer connection.");
//             }
//         } else {
//             console.error("SessionDescriptionHandler is not available.");
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
//                     (sender: RTCRtpSender) =>
//                         sender.track && sender.track.kind === "audio"
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

//     const combinedAudioStreams = useCallback(
//         (localStream: MediaStream, remoteStream: MediaStream) => {
//             const audioContext = new AudioContext();
//             const destination = audioContext.createMediaStreamDestination();

//             const localSource =
//                 audioContext.createMediaStreamSource(localStream);
//             const remoteSource =
//                 audioContext.createMediaStreamSource(remoteStream);

//             localSource.connect(destination);
//             remoteSource.connect(destination);

//             combinedStreamRef.current = destination.stream;
//         },
//         []
//     );

//     const startRecording = useCallback(async (session: WebPhoneSession) => {
//         console.log("startRecording function called");

//         remoteRecordedChunksRef.current = [];
//         localRecordedChunksRef.current = [];

//         while (!combinedStreamRef.current) {
//             console.log("Waiting for combined audio stream...");
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//         console.log("Combined audio stream found");

//         const options = { mimeType: "audio/webm;codecs=opus" };
//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             options.mimeType = "audio/webm";
//         }

//         const combinedMediaRecorder = new MediaRecorder(
//             combinedStreamRef.current,
//             options
//         );

//         combinedMediaRecorder.onstart = () => {
//             console.log("Combined MediaRecorder started");
//         };

//         combinedMediaRecorder.ondataavailable = (event) => {
//             console.log("Combined data available:", event.data.size);
//             if (event.data.size > 0) {
//                 remoteRecordedChunksRef.current.push(event.data);
//             }
//         };

//         combinedMediaRecorder.onerror = (event) => {
//             console.error("Combined recorder error:", event);
//         };

//         combinedMediaRecorder.onstop = () => {
//             console.log("Combined MediaRecorder stopped");
//         };

//         combinedMediaRecorder.start();
//         remoteMediaRecorderRef.current = combinedMediaRecorder;

//         setupAudioProcessing(combinedStreamRef.current);
//     }, []);

//     const stopRecording = useCallback(() => {
//         console.log("Stopping recording");
//         return new Promise<void>((resolve) => {
//             let remoteStopped = false;
//             let localStopped = false;

//             const checkIfBothStopped = () => {
//                 if (remoteStopped && localStopped) {
//                     resolve();
//                 }
//             };

//             if (
//                 remoteMediaRecorderRef.current &&
//                 remoteMediaRecorderRef.current.state !== "inactive"
//             ) {
//                 remoteMediaRecorderRef.current.onstop = () => {
//                     const remoteAudioBlob = new Blob(
//                         remoteRecordedChunksRef.current,
//                         { type: "audio/webm" }
//                     );
//                     const remoteAudioUrl = URL.createObjectURL(remoteAudioBlob);
//                     setRemoteRecordedAudioUrl(remoteAudioUrl);
//                     console.log("Remote audio recording saved");
//                     remoteStopped = true;
//                     checkIfBothStopped();
//                 };
//                 remoteMediaRecorderRef.current.stop();
//             } else {
//                 remoteStopped = true;
//                 checkIfBothStopped();
//             }
//             if (
//                 localMediaRecorderRef.current &&
//                 localMediaRecorderRef.current.state !== "inactive"
//             ) {
//                 localMediaRecorderRef.current.onstop = () => {
//                     const localAudioBlob = new Blob(
//                         localRecordedChunksRef.current,
//                         { type: "audio/webm" }
//                     );
//                     const localAudioUrl = URL.createObjectURL(localAudioBlob);
//                     setLocalRecordedAudioUrl(localAudioUrl);
//                     console.log("Local audio recording saved");
//                     localStopped = true;
//                     checkIfBothStopped();
//                 };
//                 localMediaRecorderRef.current.stop();
//             } else {
//                 localStopped = true;
//                 checkIfBothStopped();
//             }
//         });
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

//         scriptProcessorRef.current.onaudioprocess = (event) => {
//             if (!transcriptionEnabledRef.current || isTranscribingRef.current) {
//                 return;
//             }

//             const input = event.inputBuffer.getChannelData(0);
//             const sum = input.reduce((acc, val) => acc + Math.abs(val), 0);
//             const average = sum / input.length;

//             if (average < silenceThreshold) {
//                 if (silenceStart === null) {
//                     silenceStart = Date.now();
//                 } else if (Date.now() - silenceStart >= silenceDuration) {
//                     console.log("Silence detected, calling transcribeAudio");
//                     transcribeAudio();
//                     silenceStart = null;
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

//     const blobToBase64 = (blob: Blob): Promise<string> => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = function () {
//                 const dataUrl = reader.result as string;
//                 const base64 = dataUrl.split(",")[1];
//                 if (base64) {
//                     resolve(base64);
//                 } else {
//                     reject("Failed to convert blob to base64");
//                 }
//             };
//             reader.onerror = function (error) {
//                 reject(error);
//             };
//             reader.readAsDataURL(blob);
//         });
//     };

//     const filterTranscription = (text: string): string => {
//         const wordsToFilter = ["thank you", "bye-bye"];
//         const words = text.toLowerCase().split(" ");
//         const filteredWords = words.filter(
//             (word) => !wordsToFilter.includes(word)
//         );
//         return filteredWords.join(" ");
//     };

//     const transcribeAudio = useCallback(async () => {
//         if (isTranscribingRef.current) {
//             console.log("Transcription is already in progress");
//             return;
//         }
//         isTranscribingRef.current = true;
//         console.log("transcribeAudio called");
//         if (!combinedStreamRef.current) {
//             console.error(
//                 "Combined audio stream not available for transcription"
//             );
//             isTranscribingRef.current = false;
//             return;
//         }

//         const stream = combinedStreamRef.current;
//         const options = { mimeType: "audio/webm;codecs=opus" };

//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//             console.error("MIME type not supported:", options.mimeType);
//             isTranscribingRef.current = false;
//             return;
//         }

//         const recorder = new MediaRecorder(stream, options);
//         const chunks: Blob[] = [];

//         recorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 chunks.push(event.data);
//             }
//         };

//         recorder.onerror = (event) => {
//             console.error("Recorder error:", event);
//             isTranscribingRef.current = false;
//         };

//         recorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: options.mimeType });

//             try {
//                 const base64data = await blobToBase64(audioBlob);

//                 const response = await fetch("/api/llpmg/speech-to-text", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ audio: base64data }),
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Transcription received:", data.result);
//                     const filteredTranscription = filterTranscription(
//                         data.result
//                     );
//                     if (filteredTranscription) {
//                         setTranscribedText(
//                             (prevText) =>
//                                 prevText + "\nPatient: " + filteredTranscription
//                         );
//                     }
//                 } else {
//                     const errorText = await response.text();
//                     console.error("Failed to transcribe audio:", errorText);
//                 }
//             } catch (error) {
//                 console.error("Error transcribing audio:", error);
//             }
//             isTranscribingRef.current = false;
//         };

//         recorder.start();

//         setTimeout(() => {
//             recorder.stop();
//         }, 5000);
//     }, []);

//     const handleCallTerminated = useCallback(
//         async (session: WebPhoneSession) => {
//             try {
//                 console.log("Call terminated");
//                 userAgent?.audioHelper.playOutgoing(false);
//                 userAgent?.audioHelper.playIncoming(false);
//                 setCallActive(false);
//                 setCallEnded(true);
//                 await stopRecording();
//                 stopAllAudioProcessing();
//                 onHangup();
//             } catch (error) {
//                 console.error("Error during call termination:", error);
//             }
//         },
//         [userAgent, stopRecording, stopAllAudioProcessing, onHangup]
//     );

//     const handleCallAccepted = useCallback(
//         async (session: WebPhoneSession) => {
//             console.log("Call accepted");
//             userAgent?.audioHelper.playOutgoing(false);
//             userAgent?.audioHelper.playIncoming(false);
//             setCallActive(true);
//             setCallEnded(false);
//             setSession(session);

//             transcriptionEnabledRef.current = false;
//             isPlayingGreetingRef.current = true;

//             try {
//                 const remoteNumber =
//                     session.remoteIdentity?.uri?.user || "unknown";
//                 const greetingData = await generateGreeting(remoteNumber);

//                 if (greetingData) {
//                     const { audioUrl, text } = greetingData;
//                     console.log("Audio URL:", audioUrl);

//                     if (!audioUrl) {
//                         throw new Error("Invalid audio URL");
//                     }

//                     const { stream: greetingStream, ended } =
//                         await createMediaStreamFromAudio(audioUrl);

//                     await waitForPeerConnection(session);

//                     const remoteStream =
//                         (remoteAudioRef.current?.srcObject as MediaStream) ||
//                         new MediaStream();

//                     combinedAudioStreams(greetingStream, remoteStream);

//                     await replaceLocalAudioTrack(session, greetingStream);

//                     await startRecording(session);

//                     ended.then(async () => {
//                         console.log("Greeting playback ended");
//                         isPlayingGreetingRef.current = false;
//                         transcriptionEnabledRef.current = true;
//                         await switchBackToMicrophone(session);
//                         setTranscribedText(
//                             (prevText) => prevText + "\nSystem: " + text
//                         );
//                     });
//                 } else {
//                     console.error("No greeting data received");
//                     transcriptionEnabledRef.current = true;
//                     await startRecording(session);
//                 }
//             } catch (error) {
//                 console.error("Error during greeting playback:", error);
//                 transcriptionEnabledRef.current = true;
//                 await startRecording(session);
//             }

//             session.on("terminated", () => handleCallTerminated(session));
//         },
//         [
//             userAgent,
//             generateGreeting,
//             replaceLocalAudioTrack,
//             switchBackToMicrophone,
//             startRecording,
//             handleCallTerminated,
//             combinedAudioStreams,
//         ]
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

//         newSession.on("accepted", () => {
//             userAgent.audioHelper.playOutgoing(false);
//             handleCallAccepted(newSession);
//         });
//         newSession.on("terminated", () => handleCallTerminated(newSession));

//         setSession(newSession);
//     }, [userAgent, outgoingNumber, handleCallAccepted, handleCallTerminated]);

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

//     const handleHangup = useCallback(async () => {
//         console.log("handleHangup called");
//         if (session) {
//             try {
//                 await session.dispose();
//                 console.log("Call terminated successfully");
//             } catch (error) {
//                 console.error("Error terminating the call:", error);
//             }
//         }
//         await stopRecording();
//         stopAllAudioProcessing();
//         setSession(null);
//         setCallActive(false);
//         setCallEnded(true);
//         onHangup();
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

export default {};
