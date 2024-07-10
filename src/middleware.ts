// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//     const domainHostname = request.headers.get("host") || "";
//     const domainPathname = request.nextUrl.pathname;
//     console.log(`Hostname: ${domainHostname}, Pathname: ${domainPathname}`);

//     // Extract domainPort from domainHostname
//     const domainPort = domainHostname.split(":")[1];

//     let domainContext = "unknown";
//     let domainRedirectPath: string | null = null;

//     if (domainPort === "4" || domainHostname === "site.fsclinicals.com") {
//         domainContext = "fsclinicals";
//         if (domainPathname === "/") {
//             domainRedirectPath = "/fsclinicals/fsclinicals-landing";
//         }
//     } else if (
//         domainPort === "65535" ||
//         domainHostname === "site.lomalindapsych.com"
//     ) {
//         domainContext = "llpmg";
//         if (domainPathname === "/") {
//             domainRedirectPath = "/llpmg/landing";
//         }
//     } else if (
//         domainPort === "42069" ||
//         domainHostname === "medical.driptrace.com"
//     ) {
//         domainContext = "driptrace";
//         // No redirect for Driptrace, it stays at the root
//     }

//     const domainResponse = domainRedirectPath
//         ? NextResponse.redirect(new URL(domainRedirectPath, request.url))
//         : NextResponse.next();

//     // Set the domain context in a cookie
//     domainResponse.cookies.set("domainContext", domainContext, {
//         path: "/",
//         httpOnly: false,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//     });

//     console.log(`Set domain context to: ${domainContext}`);
//     if (domainRedirectPath) {
//         console.log(`Redirecting to: ${domainRedirectPath}`);
//     }

//     return domainResponse;
// }

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const domainHostname = request.headers.get("host") || "";
    const domainPathname = request.nextUrl.pathname;
    console.log(
        `Middleware - Hostname: ${domainHostname}, Pathname: ${domainPathname}`
    );

    // Extract domainPort from domainHostname
    const domainPort = domainHostname.split(":")[1];

    let domainContext = "unknown";
    let domainRedirectPath: string | null = null;
    let fullUrl = "";

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    if (domainPort === "4" || domainHostname === "site.fsclinicals.com") {
        domainContext = "fsclinicals";
        fullUrl = `${protocol}://${domainHostname}`;
        if (domainPathname === "/") {
            domainRedirectPath = "/fsclinicals/fsclinicals-landing";
        }
    } else if (
        domainPort === "65535" ||
        domainHostname === "site.lomalindapsych.com"
    ) {
        domainContext = "llpmg";
        fullUrl = `${protocol}://${domainHostname}`;
        if (domainPathname === "/") {
            domainRedirectPath = "/llpmg/landing";
        }
    } else if (
        domainPort === "42069" ||
        domainHostname === "medical.driptrace.com"
    ) {
        domainContext = "driptrace";
        fullUrl = `${protocol}://${domainHostname}`;
        // No redirect for Driptrace, it stays at the root
    }

    const domainResponse = domainRedirectPath
        ? NextResponse.redirect(new URL(domainRedirectPath, request.url))
        : NextResponse.next();

    // Set the domain context in a cookie
    domainResponse.cookies.set("domainContext", domainContext, {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    // Set the full URL in a header
    domainResponse.headers.set("x-full-url", fullUrl);

    console.log(`Middleware - Set domain context to: ${domainContext}`);
    console.log(`Middleware - Set full URL to: ${fullUrl}`);
    if (domainRedirectPath) {
        console.log(`Middleware - Redirecting to: ${domainRedirectPath}`);
    }

    return domainResponse;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
