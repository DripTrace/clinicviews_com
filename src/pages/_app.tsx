import { AppProps } from "next/app";
// import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        // <SessionProvider session={pageProps.session}>

        <Component {...pageProps} />
        // <ToastContainer
        // position="bottom-right"
        // theme="dark"
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // />
        // </SessionProvider>
    );
}

export default MyApp;
