// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "@/styles/advancedpracticepsych/advpracpsy.css";
// import Script from "next/script";
// import Head from "next/head";

// const geistSans = localFont({
//     src: "../../fonts/GeistVF.woff",
//     variable: "--font-geist-sans",
//     weight: "100 900",
// });
// const geistMono = localFont({
//     src: "../../fonts/GeistMonoVF.woff",
//     variable: "--font-geist-mono",
//     weight: "100 900",
// });

// export const metadata: Metadata = {
//     title: "Advanced Practice Psych",
//     description: "Advanced Practice Psych Clinical Education",
// };

// export default function AdvPracPsyPRootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         // <AdvPracPsyProviderWrapper>
//         // <html lang="en">
//         //     <body
//         //         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         //     >
//         //         {children}
//         //     </body>
//         // </html>
//         // </AdvPracPsyProviderWrapper>
//         <html lang="en" className="no-js">
//             <Head>
//                 <meta charSet="UTF-8" />
//                 <meta
//                     name="viewport"
//                     content="width=device-width, initial-scale=1"
//                 />
//                 <title>Sliced Text Effect | Advanced Practice Psych</title>
//                 <meta
//                     name="description"
//                     content="A scroll-based sliced text animation for Advanced Practice Psych, focusing on education in psychiatric practice."
//                 />
//                 <meta
//                     name="keywords"
//                     content="text effect, psychiatry, psychiatric education, animation, typography"
//                 />
//                 <meta name="author" content="Advanced Practice Psych" />
//                 <link rel="shortcut icon" href="favicon.ico" />
//                 <Script strategy="beforeInteractive">
//                     document.documentElement.className = "js";
//                 </Script>
//             </Head>

//             <body className="loading">
//                 <Script
//                     src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
//                     strategy="beforeInteractive"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/lenis.min.js"
//                     strategy="beforeInteractive"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/gsap.min.js"
//                     strategy="beforeInteractive"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/ScrollTrigger.min.js"
//                     strategy="beforeInteractive"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/imagesloaded.pkgd.min.js"
//                     strategy="beforeInteractive"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/utils.js"
//                     strategy="afterInteractive"
//                     type="module"
//                 />
//                 <Script
//                     src="/advanced-practice-psych/js/index.js"
//                     strategy="afterInteractive"
//                     type="module"
//                 />
//                 {children}
//             </body>
//         </html>
//     );
// }

import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/advancedpracticepsych/advpracpsy.css";
import Head from "next/head";
import AdvancedPracticePsychLogo from "@/components/AdvancedPracticePsych/AdvancedPracticePsychLogo";
import Script from "next/script";
// import { AMHProviderWrapper } from "@/wrappers/access-mentalhealth/Access-MentalHealthProvider";

// const geistSans = localFont({
//     src: "../../fonts/GeistVF.woff",
//     variable: "--font-geist-sans",
//     weight: "100 900",
// });
// const geistMono = localFont({
//     src: "../../fonts/GeistMonoVF.woff",
//     variable: "--font-geist-mono",
//     weight: "100 900",
// });

export const metadata: Metadata = {
    title: "Access Mental Health",
    description: "Access Mental Health Care Non-Profit Organization",
};

export default function AdvPracPsyRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Sliced Text Effect | Advanced Practice Psych</title>
                <meta
                    name="description"
                    content="A scroll-based sliced text animation for Advanced Practice Psych, focusing on education in psychiatric practice."
                />
                <meta
                    name="keywords"
                    content="text effect, psychiatry, psychiatric education, animation, typography"
                />
                <meta name="author" content="Advanced Practice Psych" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <Script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></Script>
                {/* <Script src="/advanced-practice-psych/js/gsap.min.js"></Script>
                <Script src="/advanced-practice-psych/js/imagesloaded.pkgd.min.js"></Script>
                <Script src="/advanced-practice-psych/js/index.js"></Script>
                <Script src="/advanced-practice-psych/js/item.js"></Script>
                <Script src="/advanced-practice-psych/js/lenis.min.js"></Script>
                <Script src="/advanced-practice-psych/js/ScrollTrigger.min.js"></Script>
                <Script src="/advanced-practice-psych/js/utils.js"></Script> */}
            </Head>
            <body className={`antialiased`}>
                {children}
                <AdvancedPracticePsychLogo
                    id="advanced-practice-psych-logo"
                    className="text-white-100 absolute top-[1rem] right-[1rem] h-[9rem] w-[9rem] z-50"
                />
                {/* <div
                    id="advanced-practice-psych-logo"
                    className="text-white-100 absolute top-[1rem] right-[1rem] h-[9rem] w-[9rem] z-50 bg-blue-500"
                >
                    Placeholder
                </div> */}
            </body>
        </html>
    );
}
