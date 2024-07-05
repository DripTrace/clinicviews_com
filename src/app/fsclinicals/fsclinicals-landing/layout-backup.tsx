// // // src/app/layout.tsx
// // import FSClinicalsClientRoot from "@/components/FSClinicals/FSClinicalsClientRoot";

// // export default function RootLayout({
// // 	children,
// // }: {
// // 	children: React.ReactNode;
// // }) {
// // 	return (
// // 		<html lang="en">
// // 			<body>
// // 				<FSClinicalsClientRoot>{children}</FSClinicalsClientRoot>
// // 			</body>
// // 		</html>
// // 	);
// // }

// // src/app/layout.tsx
// import { FSClinicalsFooter, FSClinicalsHeader } from "@/components";
// import { Inter } from "next/font/google";
// // import ClientRoot from '@/components/ClientRoot';
// // import FSClinicalsHeader from '@/components/FSClinicals/FSClinicalsHeader';
// // import FSClinicalsFooter from '@/components/FSClinicals/FSClinicalsFooter';
// import FSClinicalsClientRoot from "@/components/FSClinicals/FSClinicalsClientRoot";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<html lang="en">
// 			<body
// 				className={`${inter.className} bg-fsc-pale-blue text-fsc-dark-gray`}
// 			>
// 				<FSClinicalsClientRoot>
// 					<div className="flex flex-col min-h-screen">
// 						<FSClinicalsHeader />
// 						<main className="flex-grow">{children}</main>
// 						<FSClinicalsFooter />
// 					</div>
// 				</FSClinicalsClientRoot>
// 			</body>
// 		</html>
// 	);
// }

// export default function FSClinicalsRootLayout({})