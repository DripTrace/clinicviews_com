import Image from "next/image";
import Link from "next/link";

export default function FSclinicalsHeader() {
	return (
		<header className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
			<h1 className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
				<Link
					href="/fsclinicals-views/fsclinicals-base"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					<Image
						className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert size-12"
						src="/fsclinicals-views/fsclinicals-logo.svg"
						alt="FSClinicals Logo"
						width={256}
						height={256}
						priority
					/>
				</Link>
			</h1>
			<nav className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={2}
					href={{ pathname: "/fsclinicals-views/fsclinicals-form" }}
					prefetch={false}
				>
					{"FSclinicals Form Library"}
				</Link>
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={3}
					href={{
						pathname: "/fsclinicals-views/fsclinicals-creator",
					}}
					prefetch={false}
				>
					{"FSClinicals Form Creator"}
				</Link>
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={4}
					href={{
						pathname: "/fsclinicals-views/fsclinicals-dashboard",
					}}
					prefetch={false}
				>
					{"FSClinicals Dashboard"}
				</Link>
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={6}
					href={{
						pathname: "/fsclinicals-views/fsclinicals-tabulator",
					}}
					prefetch={false}
				>
					{"FSClinicals Results Table"}
				</Link>
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={5}
					href={{
						pathname: "/fsclinicals-views/fsclinicals-datatables",
					}}
					prefetch={false}
				>
					{"FSClinicals Results Table (IE Support)"}
				</Link>
				<Link
					className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
					key={7}
					href={{
						pathname: "/fsclinicals-views/fsclinicals-pdf-export",
					}}
					prefetch={false}
				>
					{"FSClinicals PDF Generator"}
				</Link>
			</nav>
		</header>
	);
}
