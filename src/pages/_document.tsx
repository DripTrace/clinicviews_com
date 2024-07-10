// import Document, { Head, Html, Main, NextScript } from "next/document";

// class MyDocument extends Document {
// 	render() {
// 		return (
// 			<Html lang="en" className="">
// 				<Head>
// 					{/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
// 					<link
// 						rel="shortcut icon"
// 						// href="/llpmg-favicons_io/llpmg_favicon.ico"
// 						href="/llpmg_-logo.ico"
// 					/>
// 					<meta charSet="utf-8" />
// 					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
// 					<meta
// 						name="viewport"
// 						content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
// 					/>
// 					<meta
// 						name="LLPMG"
// 						content="Loma Linda Psychiatric Medical Group"
// 					/>
// 					<meta name="theme-color" content="#88B0BD" />
// 					{/* <title>Loma Linda Psychiatric Medical Group</title> */}
// 					{/* <link rel="manifest" href="/llpmg-manifest.json" /> */}

// 					{/* <link
// 						rel="apple-touch-icon"
// 						href="/llpmg-favicons/llpmg_apple-touch-icon.png"
// 						as="apple-touch-icon"
// 					/> */}
// 				</Head>
// 				<Main />
// 				<NextScript />
// 			</Html>
// 		);
// 	}
// }

// export default MyDocument;

import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en" className="">
                <Head>
                    {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />

                    {/* <meta
						name="viewport"
						content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
					/>

					<meta name="LLPMG" content="llpmg-revamp" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta
						name="apple-mobile-web-app-title"
						content="llpmg-revamp-mobile"
					/>
					<meta name="description" content="pwa-demo" />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-TileColor" content="#88B0BD" />
					<meta name="msapplication-tap-highlight" content="no" /> */}
                    {/* <meta name="theme-color" content="#79A5B4" /> */}
                    {/* <meta name="theme-color" content="#6BA3C5" /> */}
                    {/* <meta name="theme-color" content="#5590B6" /> */}
                    {/* <meta name="theme-color" content="#0967AA" /> */}
                    {/* <meta name="theme-color" content="#165394" />

					<link
						rel="apple-touch-icon"
						href="/llpmg_apple-touch-icon.png"
					/>
					<link rel="manifest" href="/manifest.json" />
					<link rel="shortcut icon" href="/llpmg_-logo.ico" /> */}
                </Head>
                <Main />
                <NextScript />
            </Html>
        );
    }
}

export default MyDocument;
