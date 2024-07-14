// "use client";

// import React, { useEffect } from "react";
// import { Metadata } from "next";
// import DomainProvider from "@/components/RootStoreProvider";
// import { cookies } from "next/headers";
// import "@/styles/globals.css";
// import { DomainContextInitializer } from "./DomainContextInitializer";
// import { getFavicon } from "@/utils/getFavicon";

// export async function generateMetadata(): Promise<Metadata> {
//     const cookieStore = cookies();
//     const domainContext =
//         cookieStore.get("domainContext")?.value || "driptrace";

//     const favicon = getFavicon(domainContext);

//     return {
//         icons: {
//             icon: favicon.icon,
//             apple: favicon.apple,
//             shortcut: favicon.shortcut,
//         },
//     };
// }

// export const metadata: Metadata = {
//     manifest: "/manifest.webmanifest",
//     // other metadata...
// };

// // export const metadata: Metadata = {
// //     title: "DOMAIN",
// //     description: "Root Domain",
// // };

// export default function RootLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     useEffect(() => {
//         if ("serviceWorker" in navigator) {
//             window.addEventListener("load", function () {
//                 navigator.serviceWorker.register("/sw.js").then(
//                     function (registration) {
//                         console.log(
//                             "Service Worker registration successful with scope: ",
//                             registration.scope
//                         );
//                     },
//                     function (err) {
//                         console.log(
//                             "Service Worker registration failed: ",
//                             err
//                         );
//                     }
//                 );
//             });
//         }
//     }, []);

//     return (
//         // <>
//         <html lang="en">
//             <body>
//                 <DomainContextInitializer />
//                 <DomainProvider>{children}</DomainProvider>
//             </body>
//         </html>
//         // </>
//     );
// }

// app/layout.tsx

import { Metadata } from "next";
import { cookies } from "next/headers";
import "@/styles/globals.css";
import { getFavicon } from "@/utils/getFavicon";
import RootClientLayout from "@/components/RootClientLayout";
import { DomainContextInitializer } from "./DomainContextInitializer";
import FaviconLinks from "@/components/FaviconLinks";
import InstallPrompt from "@/components/SafeInstallPrompt";
import NotificationExample from "@/components/NotificationExample";
// import ClientLayout from "./ClientLayout";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = cookies();
    const domainContext =
        cookieStore.get("domainContext")?.value || "driptrace";
    const favicon = getFavicon(domainContext);

    return {
        manifest: `/manifest_${domainContext}.webmanifest`,
        icons: {
            icon: [
                { url: favicon.icon, sizes: "any" },
                { url: favicon.apple, sizes: "180x180", type: "image/png" },
            ],
            apple: [
                { url: favicon.apple, sizes: "180x180", type: "image/png" },
            ],
            shortcut: [{ url: favicon.shortcut }],
        },
        // other metadata...
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* <DomainContextInitializer /> */}
            <NotificationExample />
            <InstallPrompt />
            <RootClientLayout>{children}</RootClientLayout>
        </>
    );
}
