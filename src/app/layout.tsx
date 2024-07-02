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

import React from "react";
import { Metadata } from "next";
import StoreProvider from "@/components/LLPMG/StoreProvider";
// import StoreProvider from './StoreProvider';
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "LLPMG",
	description: "Loma Linda Psychiatric Medical Group",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
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
			</head>
			<body>
				<StoreProvider>{children}</StoreProvider>
			</body>
		</html>
	);
}
