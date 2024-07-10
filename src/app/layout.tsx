import React from "react";
import { Metadata } from "next";
import DomainProvider from "@/components/RootStoreProvider";
// import { headers } from "next/headers";
import "@/styles/globals.css";
import { DomainContextInitializer } from "./DomainContextInitializer";

export const metadata: Metadata = {
    title: "DOMAIN",
    description: "Root Domain",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <>
        <html lang="en">
            <body>
                <DomainContextInitializer />
                <DomainProvider>{children}</DomainProvider>
            </body>
        </html>
        // </>
    );
}
