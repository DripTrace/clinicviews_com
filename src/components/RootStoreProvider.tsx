"use client";

// import { DomainContextInitializer } from "@/app/DomainContextInitializer";
import { domainStore } from "@/store/domainStore";
import { useEffect } from "react";
import { Provider as DomainProvider } from "react-redux";
import NotificationExample from "./NotificationExample";
import InstallPrompt from "./InstallPrompt";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        console.log("store provider");
    }, []);

    return (
        <DomainProvider store={domainStore}>
            {/* <DomainContextInitializer /> */}
            <NotificationExample />
            {/* <InstallPrompt /> */}
            {children}
        </DomainProvider>
    );
}
