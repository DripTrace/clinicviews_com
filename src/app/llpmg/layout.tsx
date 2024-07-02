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

import ClientLayout from "@/components/LLPMG/ClientLayout";
import React from "react";
// import ClientLayout from "../../components/LLPMG/ClientLayout";

export default function LLPMGRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ClientLayout>{children}</ClientLayout>;
}
