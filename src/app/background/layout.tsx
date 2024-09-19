import { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "LLPMG",
    description: "Loma Linda Psychiatric Medical Group",
};

export default function BackgroundRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="background-interact">
            <body>{children}</body>
        </html>
    );
}
