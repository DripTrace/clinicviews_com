"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import WebPhone, { WebPhoneOptions } from "@/ref/web/src";
import { WebPhoneSession, WebPhoneInvitation } from "@/ref/web/src/session";
import { WebPhoneUserAgent } from "@/ref/web/src/userAgent";

// interface SipComponentProps {
//     onHangup: () => void;
//     initiateAuth: () => void;
//     tokenData: any;
//     onLogout: () => void;
//     setTokenData: (data: any) => void;
// }

interface SipComponentProps {
    onHangup: () => void;
    initiateAuth: () => void;
    tokenData: any;
    onLogout: () => void;
    setTokenData: React.Dispatch<React.SetStateAction<any>>;
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
    const [muted, setMuted] = useState(false);
    const [held, setHeld] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
        null
    );
    const [outgoingNumber, setOutgoingNumber] = useState<string>("");
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [callActive, setCallActive] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<string | null>(null); // State to hold the recorded audio

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (tokenData) {
            const parsedTokenData =
                typeof tokenData === "string"
                    ? JSON.parse(tokenData)
                    : tokenData;
            initializeWebPhone(parsedTokenData);
        }
    }, [tokenData]);

    const initializeWebPhone = useCallback(async (tokenData: any) => {
        try {
            console.log("Starting WebPhone Initialization...");
            const sipProvisionResponse = await fetch(
                "/api/llpmg/sip-provision",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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
                    remote: document.getElementById(
                        "remoteAudio"
                    ) as HTMLAudioElement,
                    local: document.getElementById(
                        "localAudio"
                    ) as HTMLAudioElement,
                },
                audioHelper: {
                    enabled: true,
                    incoming: "/audio/incoming.ogg",
                    outgoing: "/audio/outgoing.ogg",
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

    const handleOutgoingCall = useCallback(() => {
        if (!userAgent || !outgoingNumber) {
            console.error("UserAgent or outgoing number is missing");
            setConnectionError("Please enter a valid phone number");
            return;
        }

        console.log("Placing call to:", outgoingNumber);
        userAgent.audioHelper.playOutgoing(true);

        const session = userAgent.invite(outgoingNumber, {});

        session.on("accepted", (message: any) => {
            console.log(
                "Telephony Session Info:",
                message.headers["P-Rc-Api-Ids"] ||
                    message.headers["p-rc-api-ids"]
            );
            userAgent.audioHelper.playOutgoing(false);
            userAgent.audioHelper.playIncoming(false);
            setCallActive(true);
            startRecording(); // Start recording when the call is accepted
        });

        session.on("terminated", () => {
            stopRecording(); // Ensure recording stops when call is terminated
            userAgent.audioHelper.playOutgoing(false);
            userAgent.audioHelper.playIncoming(false);
            setCallActive(false);
            onHangup();
        });

        setSession(session);
    }, [userAgent, outgoingNumber, onHangup]);

    const handleIncomingCall = useCallback(
        (action: "accept" | "decline" | "toVoicemail") => {
            if (!incomingCall) return;

            userAgent?.audioHelper.playIncoming(false);

            switch (action) {
                case "accept":
                    incomingCall.accept();
                    setSession(incomingCall);
                    setCallActive(true);
                    startRecording(); // Start recording when call is accepted
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
        [incomingCall, userAgent]
    );

    const handleHangup = useCallback(() => {
        if (session) {
            session.dispose();
        }
        stopRecording(); // Ensure recording stops when call is manually ended
        setSession(null);
        setCallActive(false);
        onHangup();
    }, [session, onHangup]);

    const toggleMute = useCallback(() => {
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
        if (session) {
            if (held) {
                session.unhold?.();
            } else {
                session.hold?.();
            }
            setHeld(!held);
        }
    }, [session, held]);

    const startRecording = useCallback(() => {
        const remoteAudio = document.getElementById(
            "remoteAudio"
        ) as HTMLAudioElement;

        if (remoteAudio && remoteAudio.srcObject) {
            const mediaRecorder = new MediaRecorder(
                remoteAudio.srcObject as MediaStream
            );

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: "audio/ogg; codecs=opus",
                });
                recordedChunksRef.current = [];
                const recordedURL = URL.createObjectURL(blob);
                setRecordedAudio(recordedURL);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const handlePark = useCallback(() => {
        if (session) {
            session.park?.();
        }
    }, [session]);

    const handleTransfer = useCallback(() => {
        if (session) {
            const transferNumber = prompt("Enter the number to transfer to:");
            if (transferNumber) {
                session.transfer?.(transferNumber);
            }
        }
    }, [session]);

    const handleFlip = useCallback(() => {
        if (session) {
            const flipNumber = prompt("Enter the number to flip to:");
            if (flipNumber) {
                session.flip?.(flipNumber);
            }
        }
    }, [session]);

    const handleDTMF = useCallback(() => {
        if (session) {
            const digit = prompt("Enter the DTMF digit:");
            if (digit) {
                session.dtmf?.(digit);
            }
        }
    }, [session]);

    const adjustVolume = useCallback((direction: number) => {
        const audioElement = document.getElementById(
            "remoteAudio"
        ) as HTMLAudioElement;
        if (audioElement) {
            audioElement.volume = Math.min(
                Math.max(audioElement.volume + direction, 0),
                1
            );
        }
    }, []);

    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-6">
            <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
                <audio id="remoteAudio" hidden />
                <audio id="localAudio" hidden muted />
                {connectionError && (
                    <div className="text-red-500 text-sm">
                        {connectionError}
                    </div>
                )}
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
                        {!callActive && (
                            <div className="outgoing-call mt-4">
                                <h4 className="text-white text-xl mb-3">
                                    Outgoing Call
                                </h4>
                                <input
                                    type="text"
                                    value={outgoingNumber}
                                    onChange={(e) =>
                                        setOutgoingNumber(e.target.value)
                                    }
                                    placeholder="+1 234 567-8900"
                                    className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleOutgoingCall}
                                    className="w-full mt-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
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
                                        + Ring Volume
                                    </button>
                                    <button
                                        onClick={() => adjustVolume(-0.1)}
                                        className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    >
                                        - Ring Volume
                                    </button>
                                    <button
                                        onClick={handleHangup}
                                        className="col-span-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Hang Up
                                    </button>
                                </div>
                            </div>
                        )}
                        {incomingCall && (
                            <div className="incoming-call mt-6">
                                <h3 className="text-white text-xl mb-3">
                                    Incoming Call
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() =>
                                            handleIncomingCall("accept")
                                        }
                                        className="py-2 text-white bg-green-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Answer
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleIncomingCall("decline")
                                        }
                                        className="py-2 text-white bg-red-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleIncomingCall("toVoicemail")
                                        }
                                        className="py-2 text-white bg-yellow-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        To Voicemail
                                    </button>
                                </div>
                            </div>
                        )}
                        {recordedAudio && (
                            <div className="recording-playback mt-6 hidden">
                                <h3 className="text-white text-xl mb-3">
                                    Recorded Audio
                                </h3>
                                <audio
                                    controls
                                    src={recordedAudio}
                                    className="w-full rounded-lg bg-gray-800 p-2"
                                ></audio>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SipComponent;

// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
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
//     const [muted, setMuted] = useState(false);
//     const [held, setHeld] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [incomingCall, setIncomingCall] = useState<WebPhoneInvitation | null>(
//         null
//     );
//     const [outgoingNumber, setOutgoingNumber] = useState<string>("");
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [callActive, setCallActive] = useState(false);
//     const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
//     const [activeCalls, setActiveCalls] = useState<WebPhoneSession[]>([]);

//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);

//     useEffect(() => {
//         if (tokenData) {
//             const parsedTokenData =
//                 typeof tokenData === "string"
//                     ? JSON.parse(tokenData)
//                     : tokenData;
//             initializeWebPhone(parsedTokenData);
//         }
//     }, [tokenData]);

//     const initializeWebPhone = useCallback(async (tokenData: any) => {
//         try {
//             console.log("Starting WebPhone Initialization...");
//             const sipProvisionResponse = await fetch(
//                 "/api/llpmg/sip-provision",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ tokenData }),
//                 }
//             );

//             if (!sipProvisionResponse.ok) {
//                 throw new Error(
//                     ` HTTP error! status: ${sipProvisionResponse.status}`
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

//     const handleOutgoingCall = useCallback(() => {
//         if (!userAgent || !outgoingNumber) {
//             console.error("UserAgent or outgoing number is missing");
//             setConnectionError("Please enter a valid phone number");
//             return;
//         }

//         console.log("Placing call to:", outgoingNumber);
//         userAgent.audioHelper.playOutgoing(true);

//         const session = userAgent.invite(outgoingNumber, {});

//         session.on("accepted", (message: any) => {
//             console.log(
//                 "Telephony Session Info:",
//                 message.headers["P-Rc-Api-Ids"] ||
//                     message.headers["p-rc-api-ids"]
//             );
//             userAgent.audioHelper.playOutgoing(false);
//             userAgent.audioHelper.playIncoming(false);
//             setCallActive(true);
//             startRecording(); // Start recording when the call is accepted
//             setActiveCalls((prev) => [...prev, session]); // Add to active calls
//         });

//         session.on("terminated", () => {
//             stopRecording(); // Ensure recording stops when call is terminated
//             userAgent.audioHelper.playOutgoing(false);
//             userAgent.audioHelper.playIncoming(false);
//             setCallActive(false);
//             setActiveCalls((prev) => prev.filter((s) => s !== session)); // Remove from active calls
//             onHangup();
//         });

//         setSession(session);
//     }, [userAgent, outgoingNumber, onHangup]);

//     const handleIncomingCall = useCallback(
//         (action: "accept" | "decline" | "toVoicemail") => {
//             if (!incomingCall) return;

//             userAgent?.audioHelper.playIncoming(true);

//             switch (action) {
//                 case "accept":
//                     incomingCall.accept();
//                     setSession(incomingCall);
//                     setCallActive(true);
//                     startRecording(); // Start recording when call is accepted
//                     setActiveCalls((prev) => [...prev, incomingCall]); // Add to active calls
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
//         [incomingCall, userAgent]
//     );

//     const handleHangup = useCallback(() => {
//         if (session) {
//             session.dispose();
//         }
//         stopRecording(); // Ensure recording stops when call is manually ended
//         setSession(null);
//         setCallActive(false);
//         setActiveCalls((prev) => prev.filter((s) => s !== session)); // Remove from active calls
//         onHangup();
//     }, [session, onHangup]);

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

//     const startRecording = useCallback(() => {
//         const remoteAudio = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;

//         if (remoteAudio && remoteAudio.srcObject) {
//             const mediaRecorder = new MediaRecorder(
//                 remoteAudio.srcObject as MediaStream
//             );

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     recordedChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.onstop = () => {
//                 const blob = new Blob(recordedChunksRef.current, {
//                     type: "audio/ogg; codecs=opus",
//                 });
//                 recordedChunksRef.current = [];
//                 const recordedURL = URL.createObjectURL(blob);
//                 setRecordedAudio(recordedURL);
//             };

//             mediaRecorder.start();
//             mediaRecorderRef.current = mediaRecorder;
//         }
//     }, []);

//     const stopRecording = useCallback(() => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     }, []);

//     const handlePark = useCallback(() => {
//         if (session) {
//             session.park?.();
//         }
//     }, [session]);

//     const handleTransfer = useCallback(() => {
//         if (!userAgent?.isConnected()) {
//             console.error("WebSocket is not connected. Cannot transfer call.");
//             return;
//         }

//         if (session) {
//             const transferNumber = prompt("Enter the number to transfer to:");
//             if (transferNumber) {
//                 session
//                     .transfer?.(transferNumber)
//                     .then(() => {
//                         console.log(`Call transferred to ${transferNumber}`);
//                     })
//                     .catch((error) => {
//                         console.error("Failed to transfer call:", error);
//                     });
//             }
//         }
//     }, [session, userAgent]);

//     const handleFlip = useCallback(() => {
//         if (session) {
//             const flipNumber = prompt("Enter the number to flip to:");
//             if (flipNumber) {
//                 session.flip?.(flipNumber);
//             }
//         }
//     }, [session]);

//     const handleDTMF = useCallback(() => {
//         if (session) {
//             const digit = prompt("Enter the DTMF digit:");
//             if (digit) {
//                 session.dtmf?.(digit);
//             }
//         }
//     }, [session]);

//     const switchActiveCall = useCallback(() => {
//         if (activeCalls.length > 1) {
//             const currentIndex = activeCalls.indexOf(session!);
//             const nextSession =
//                 activeCalls[(currentIndex + 1) % activeCalls.length];
//             setSession(nextSession);
//         }
//     }, [activeCalls, session]);

//     const adjustVolume = useCallback((direction: number) => {
//         const audioElement = document.getElementById(
//             "remoteAudio"
//         ) as HTMLAudioElement;
//         if (audioElement) {
//             audioElement.volume = Math.min(
//                 Math.max(audioElement.volume + direction, 0),
//                 1
//             );
//         }
//     }, []);

//     return (
//         <div className="bg-black min-h-screen flex items-center justify-center p-6">
//             <div className="bg-opacity-70 bg-gray-800 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
//                 <audio id="remoteAudio" hidden />
//                 <audio id="localAudio" hidden muted />
//                 {connectionError && (
//                     <div className="text-red-500 text-sm">
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
//                             className="text-sm text-gray-400 hover:text-white"
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
//                                     className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                     <button
//                                         onClick={handleOutgoingCall}
//                                         className="py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Call
//                                     </button>
//                                     <button
//                                         onClick={switchActiveCall}
//                                         className="py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                                     >
//                                         Switch Active Call
//                                     </button>
//                                 </div>
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
//                                         onClick={switchActiveCall}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Switch Active Call
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         + Ring Volume
//                                     </button>
//                                     <button
//                                         onClick={() => adjustVolume(-0.1)}
//                                         className="py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         - Ring Volume
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
//                         {recordedAudio && (
//                             <div className="recording-playback mt-6">
//                                 <h3 className="text-white text-xl mb-3">
//                                     Recorded Audio
//                                 </h3>
//                                 <audio
//                                     controls
//                                     src={recordedAudio}
//                                     className="w-full rounded-lg bg-gray-800 p-2"
//                                 ></audio>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SipComponent;
