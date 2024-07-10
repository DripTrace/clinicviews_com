// components/InstallPrompt.tsx
// "use client";

import { useState, useEffect } from "react";

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the alert to the user
            alert("Do you want to install this app?");
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
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
    }, [deferredPrompt]);

    return null; // This component doesn't render anything
};

export default InstallPrompt;
