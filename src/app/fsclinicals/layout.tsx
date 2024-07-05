import { FSClinicalsFooter, FSClinicalsHeader } from "@/components";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import FSClinicalsClientRoot from "@/components/FSClinicals/FSClinicalsClientRoot";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} bg-[#D1E0EB] text-[#494949] /*bg-fsc-pale-blue text-fsc-dark-gray*/`}
			>
				<FSClinicalsClientRoot>
					<div className="flex flex-col min-h-screen">
						<FSClinicalsHeader />
						<main className="flex-grow">{children}</main>
						<FSClinicalsFooter />
					</div>
				</FSClinicalsClientRoot>
			</body>
		</html>
	);
}
