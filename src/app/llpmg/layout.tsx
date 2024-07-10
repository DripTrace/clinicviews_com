// import type { AppProps } from "next/app";
// // import Layout from '../components/Layout';
// // import '../styles/globals.css';
// import { Layout } from "@/components/LLPMG";

// function LLPMG({ Component, pageProps }: AppProps) {
// 	return (
// 		<Layout>
// 			<Component {...pageProps} />
// 		</Layout>
// 	);
// }

// export default LLPMG;

// import { Cursor, Layout } from "@/components/LLPMG";
// import { ThemeProvider } from "@/context/LLPMGTheme";
// import { wrapper } from "@/store/store";
// import "@/styles/globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { Provider } from "react-redux";
// // import { AnimatePresence } from 'framer-motion'

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: "LLPMG",
// 	description: "Loma Linda Psychiatric Medical Group",
// };

// export default function LLPMGRootLayout({
// 	children,
// 	...rest
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	const { store, props } = wrapper.useWrappedStore(rest);

// 	return (
// 		<html lang="en">
// 			<body className={inter.className}>
// 				<Provider store={store}>
// 					{/* <ThemeProvider> */}
// 					{/* <Cursor /> */}
// 					<Layout>{children}</Layout>
// 					{/* </ThemeProvider> */}
// 				</Provider>
// 			</body>
// 		</html>
// 	);
// }

// import ClientLayout from "@/components/LLPMG/ClientLayout";
// import React from "react";
// // import ClientLayout from "../../components/LLPMG/ClientLayout";

// export default function LLPMGRootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	return <ClientLayout>{children}</ClientLayout>;
// }

// import "@/styles/globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: "LLPMG",
// 	description: "Loma Linda Psychiatric Medical Group",
// };

// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html lang="en">
// 			<title>Loma Linda Psychiatric Medical Group</title>
// 			{/* <head itemProp="apple-touch-icon"></head> */}
// 			<body className={inter.className}>
// 				{/* <Header /> */}
// 				<main>{children}</main>
// 			</body>
// 		</html>
// 	);
// }

// import "@/styles/globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: "LLPMG",
// 	description: "Loma Linda Psychiatric Medical Group",
// };

// export const metadata: Metadata = {
// 	title: "LLPMG",
// 	description: "Loma Linda Psychiatric Medical Group",
// 	generator: "Next.js",
// 	// manifest: "llpmg-manifest.json",
// 	manifest: "/manifest.json",
// 	keywords: ["nextjs", "next14", "pwa", "next-pwa"],
// 	// themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#88B0BD" }],
// 	authors: [
// 		{
// 			name: "russpalms",
// 			url: "https://russellpalma.com",
// 		},
// 	],
// 	// viewport:
// 	// 	"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
// 	icons: [
// 		{
// 			rel: "apple-touch-icon",
// 			url: "manifest-icons/llpmg-logo-128.png",
// 		},
// 		{ rel: "icon", url: "manifest-icons/llpmg-logo-128.png" },
// 	],
// };

// "use client";
import React from "react";
import { Metadata } from "next";
import StoreProvider from "@/components/LLPMG/StoreProvider";
// import StoreProvider from './StoreProvider';
import "@/styles/globals.css";
import ClientLayout from "@/components/LLPMG/ClientLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export const metadata: Metadata = {
    title: "LLPMG",
    description: "Loma Linda Psychiatric Medical Group",
    // icons: [
    //     {
    //         rel: "apple-touch-icon",
    //         url: "manifest-icons/llpmg-logo-128.png",
    //     },
    //     { rel: "icon", url: "manifest-icons/llpmg-logo-128.png" },

    // ],
};

export default function LLPMGRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/* <head>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                />
            </head> */}
            <body>
                {/* <Provider store={store}> */}
                {/* <StoreProvider> */}
                <ClientLayout>{children}</ClientLayout>
                {/* </StoreProvider> */}
                {/* </Provider> */}
            </body>
        </html>
    );
}
