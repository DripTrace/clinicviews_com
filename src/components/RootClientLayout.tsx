// // app/ClientLayout.tsx

// "use client";

// import { useEffect } from "react";
// import DomainProvider from "@/components/RootStoreProvider";

// export default function RootClientLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     useEffect(() => {
//         if (typeof window !== "undefined" && "serviceWorker" in navigator) {
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
//         <html lang="en">
//             <body>
//                 <DomainProvider>{children}</DomainProvider>
//             </body>
//         </html>
//     );
// }

// app/ClientLayout.tsx

"use client";

import { useEffect } from "react";
import DomainProvider from "@/components/RootStoreProvider";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/sw.js").then(
                    function (registration) {
                        console.log(
                            "Service Worker registration successful with scope: ",
                            registration.scope
                        );
                    },
                    function (err) {
                        console.log(
                            "Service Worker registration failed: ",
                            err
                        );
                    }
                );
            });
        }
    }, []);

    return (
        <html lang="en">
            <body>
                <DomainProvider>{children}</DomainProvider>
            </body>
        </html>
    );
}
