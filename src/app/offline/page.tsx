// import Image from "next/image";
// import Link from "next/link";

// export default function Page() {
// 	return (
// 		<div>
// 			<h1>This page is now available offline!</h1>
// 			<Image
// 				src="images/llpmg_logo.png"
// 				alt="llpmg-logo"
// 				height={100}
// 				width={100}
// 			/>
// 			<Link href="/" prefetch={false}>
// 				back home
// 			</Link>
// 		</div>
// 	);
// }

import Link from "next/link";

export default function Page() {
	return (
		<>
			<h1>You are offline!</h1>
			<Link href="/" prefetch={false}>
				back home
			</Link>
		</>
	);
}
