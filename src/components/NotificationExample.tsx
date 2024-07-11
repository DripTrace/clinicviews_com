// components/NotificationExample.tsx

"use client";

import { useEffect } from "react";
import {
    requestNotificationPermission,
    sendNotification,
} from "@/utils/notifications";
import { DomainContextInitializer } from "@/app/DomainContextInitializer";
import { getFavicon } from "@/utils/getFavicon";
import { useSelect } from "@react-three/drei";
import { useDomainSelector } from "@/store/domainHooks";

const NotificationExample: React.FC = () => {
    const domainContext = useDomainSelector((state) => state.app.domainContext);
    const favicon = getFavicon(domainContext);
    const faviconPath = favicon.icon;

    useEffect(() => {
        const setup = async () => {
            const permissionGranted = await requestNotificationPermission();
            if (permissionGranted) {
                sendNotification("Welcome to our clinic!", {
                    body: "Thank you for enabling notifications.",
                    icon: `/${faviconPath}`,
                });
            }
        };

        setup();
    }, [faviconPath]);

    return null; // This component doesn't render anything
};

export default NotificationExample;
