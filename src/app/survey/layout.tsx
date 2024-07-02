import { Cursor, Layout } from "@/components/LLPMG";
import { ThemeProvider } from "@/context/LLPMGTheme";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LLPMG",
	description: "Loma Linda Psychiatric Medical Group",
};

export default function LLPMGFormLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider>
					<Cursor />
					<Layout>{children}</Layout>
				</ThemeProvider>
			</body>
		</html>
	);
}
