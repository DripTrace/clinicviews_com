// "use client";

// import React, { useEffect } from "react";
import { Metadata } from "next";
import DomainProvider from "@/components/RootStoreProvider";
import { cookies } from "next/headers";
import "@/styles/globals.css";
import { DomainContextInitializer } from "./DomainContextInitializer";
import { getFavicon } from "@/utils/getFavicon";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = cookies();
    const domainContext =
        cookieStore.get("domainContext")?.value || "driptrace";

    const favicon = getFavicon(domainContext);

    return {
        icons: {
            icon: favicon.icon,
            apple: favicon.apple,
            shortcut: favicon.shortcut,
        },
    };
}

// export const metadata: Metadata = {
//     title: "DOMAIN",
//     description: "Root Domain",
// };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // useEffect(() => {
    //     if ("serviceWorker" in navigator) {
    //         window.addEventListener("load", function () {
    //             navigator.serviceWorker.register("/sw.js").then(
    //                 function (registration) {
    //                     console.log(
    //                         "Service Worker registration successful with scope: ",
    //                         registration.scope
    //                     );
    //                 },
    //                 function (err) {
    //                     console.log(
    //                         "Service Worker registration failed: ",
    //                         err
    //                     );
    //                 }
    //             );
    //         });
    //     }
    // }, []);

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
