import AccessMentalHealth from "@/components/Access-MentalHealth/AccessMentalHealth";
import type { Metadata } from "next";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Access Mental Health",
    description: "Access Mental Health Care Non-Profit Organization",
};

export default function ScrollRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="no-js overflow-x-hidden">
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>
                    Exploring Future Health Solutions | Access Mental Healthcare
                </title>
                <meta
                    name="description"
                    content="An expanding view, highlighting accessible mental healthcare through technology."
                />
                <meta
                    name="keywords"
                    content="mental health, accessibility, technology, animation, gsap, typography"
                />
                <meta name="author" content="Access Mental Healthcare" />
                <Link
                    rel="shortcut icon"
                    href="/access-mentalhealth/favicon.ico"
                />
                <Link rel="preconnect" href="https://fonts.googleapis.com" />
                <Link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap"
                    rel="stylesheet"
                />
                <Script>document.documentElement.className = "js";</Script>
            </Head>
            <body className="demo-1 loading">
                <main>
                    <header className="frame relative">
                        <h1 className="frame__title">
                            Empowering Minds
                            <a href="https://access-mentalhealth.org/DripTrace/demos/?tag=typography">
                                through
                            </a>
                        </h1>
                        <a
                            className="frame__back"
                            href="https://access-mentalhealth.org/DripTrace/?p=76821"
                        >
                            Accessible Technology
                        </a>
                        <a
                            className="frame__archive"
                            href="https://access-mentalhealth.org/about"
                        >
                            About Us
                        </a>
                        <a
                            className="frame__github"
                            href="https://access-mentalhealth.org/contact"
                        >
                            Contact Us
                        </a>
                        <AccessMentalHealth
                            id="access-mental-health"
                            className="h-[9rem] w-[14rem] absolute right-[1rem] top-0"
                        />
                    </header>
                    {children}
                </main>
                <Script src="access-mentalhealth/js/gsap.min.js"></Script>
                <Script src="access-mentalhealth/js/ScrollTrigger.min.js"></Script>
                <Script src="access-mentalhealth/js/Flip.min.js"></Script>
                <Script src="access-mentalhealth/js/imagesloaded.pkgd.min.js"></Script>
                <Script src="access-mentalhealth/js/lenis.js"></Script>
                <Script src="access-mentalhealth/js/smoothscroll.js"></Script>
                <Script
                    type="module"
                    src="access-mentalhealth/js/index.js"
                ></Script>
            </body>
        </html>
    );
}
