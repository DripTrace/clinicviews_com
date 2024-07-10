// // components/InstallPrompt.tsx
// "use client";

// import { useState, useEffect } from "react";

// const InstallPrompt: React.FC = () => {
//     const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

//     useEffect(() => {
//         const handler = (e: Event) => {
//             // Prevent Chrome 67 and earlier from automatically showing the prompt
//             e.preventDefault();
//             // Stash the event so it can be triggered later
//             setDeferredPrompt(e);
//             // Show the alert to the user
//             alert("Do you want to install this app?");
//         };

//         window.addEventListener("beforeinstallprompt", handler);

//         return () => window.removeEventListener("beforeinstallprompt", handler);
//     }, []);

//     useEffect(() => {
//         if (deferredPrompt) {
//             deferredPrompt.prompt();
//             deferredPrompt.userChoice.then(
//                 (choiceResult: { outcome: string }) => {
//                     if (choiceResult.outcome === "accepted") {
//                         console.log("User accepted the install prompt");
//                     } else {
//                         console.log("User dismissed the install prompt");
//                     }
//                     setDeferredPrompt(null);
//                 }
//             );
//         }
//     }, [deferredPrompt]);

//     return null; // This component doesn't render anything
// };

// export default InstallPrompt;

// components/InstallPrompt.tsx

// "use client";
// import React, { useState, useEffect } from "react";

// const InstallPrompt: React.FC = () => {
//     const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//     const [showCustomPrompt, setShowCustomPrompt] = useState(false);

//     useEffect(() => {
//         const handler = (e: Event) => {
//             e.preventDefault();
//             setDeferredPrompt(e);
//             setShowCustomPrompt(true);
//         };

//         window.addEventListener("beforeinstallprompt", handler);

//         return () => window.removeEventListener("beforeinstallprompt", handler);
//     }, []);

//     const handleInstallClick = () => {
//         setShowCustomPrompt(false);
//         if (deferredPrompt) {
//             deferredPrompt.prompt();
//             deferredPrompt.userChoice.then(
//                 (choiceResult: { outcome: string }) => {
//                     if (choiceResult.outcome === "accepted") {
//                         console.log("User accepted the install prompt");
//                     } else {
//                         console.log("User dismissed the install prompt");
//                     }
//                     setDeferredPrompt(null);
//                 }
//             );
//         }
//     };

//     if (!showCustomPrompt) return null;

//     return (
//         <div className="fixed bottom-5 left-5 bg-white p-4 rounded-lg shadow-md z-50">
//             <p className="text-gray-800 mb-3">
//                 Would you like to install this app?
//             </p>
//             <div className="flex space-x-2">
//                 <button
//                     onClick={handleInstallClick}
//                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                 >
//                     Install
//                 </button>
//                 <button
//                     onClick={() => setShowCustomPrompt(false)}
//                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//                 >
//                     Not now
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstallPrompt;

//delay
// components/InstallPrompt.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showCustomPrompt, setShowCustomPrompt] = useState(false);
    const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const handleBeforeInstallPrompt = useCallback((e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
    }, []);

    useEffect(() => {
        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        const handleLoad = () => {
            setIsAssetsLoaded(true);
        };

        window.addEventListener("load", handleLoad);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window.removeEventListener("load", handleLoad);
        };
    }, [handleBeforeInstallPrompt]);

    useEffect(() => {
        const handleInteraction = () => {
            if (isAssetsLoaded) {
                setHasUserInteracted(true);
            }
        };

        if (typeof window !== "undefined" && isAssetsLoaded) {
            if ("ontouchstart" in window) {
                // Mobile devices
                window.addEventListener("touchstart", handleInteraction, {
                    once: true,
                });
            } else {
                // Desktop devices
                window.addEventListener("mousemove", handleInteraction, {
                    once: true,
                });
            }
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("touchstart", handleInteraction);
                window.removeEventListener("mousemove", handleInteraction);
            }
        };
    }, [isAssetsLoaded]);

    useEffect(() => {
        if (
            isAssetsLoaded &&
            hasUserInteracted &&
            deferredPrompt &&
            !showCustomPrompt
        ) {
            setShowCustomPrompt(true);
        }
    }, [isAssetsLoaded, hasUserInteracted, deferredPrompt, showCustomPrompt]);

    const handleInstallClick = () => {
        setShowCustomPrompt(false);
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(
                (choiceResult: { outcome: string }) => {
                    if (choiceResult.outcome === "accepted") {
                        console.log("User accepted the install prompt");
                    } else {
                        console.log("User dismissed the install prompt");
                    }
                    setDeferredPrompt(null);
                }
            );
        }
    };

    if (!showCustomPrompt) return null;

    return (
        <div className="fixed bottom-5 left-5 bg-white p-4 rounded-lg shadow-md z-50">
            <p className="text-gray-800 mb-3">
                Would you like to install this app?
            </p>
            <div className="flex space-x-2">
                <button
                    onClick={handleInstallClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Install
                </button>
                <button
                    onClick={() => setShowCustomPrompt(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Not now
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
