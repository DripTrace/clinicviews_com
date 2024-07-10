import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en" className="">
                <Head>
                    {/* <link rel="manifest" href="/manifest.webmanifest" /> */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <Main />
                <NextScript />
            </Html>
        );
    }
}

export default MyDocument;
