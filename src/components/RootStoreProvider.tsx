"use client";

// import { DomainContextInitializer } from "@/app/DomainContextInitializer";
import { domainStore } from "@/store/domainStore";
import { useEffect } from "react";
import { Provider as DomainProvider } from "react-redux";

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
            {children}
        </DomainProvider>
    );
}
