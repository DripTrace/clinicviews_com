import { FSClinicalsFooter, FSClinicalsHeader } from "@/components";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import FSClinicalsClientRoot from "@/components/FSClinicals/FSClinicalsClientRoot";
import { Metadata } from "next";
// import { getAppName } from "@/utils/appContext";
// import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FSClinicals",
    description: "Four Square Clinicals",
    // icons: [
    //     {
    //         rel: "apple-touch-icon",
    //         url: "manifest-icons/llpmg-logo-128.png",
    //     },
    //     { rel: "icon", url: "manifest-icons/llpmg-logo-128.png" },

    // ],
};

export default function FSClinicalsRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} bg-[#D1E0EB] text-[#494949] /*bg-fsc-pale-blue text-fsc-dark-gray*/ scrollbar-hide pointer-events-auto relative min-h-[100vh]`}
            >
                <FSClinicalsClientRoot>
                    <div className="flex flex-col h-full relative">
                        <FSClinicalsHeader />
                        <main className="size-full relative">{children}</main>
                        <FSClinicalsFooter />
                    </div>
                </FSClinicalsClientRoot>
            </body>
        </html>
    );
}

// import { GetServerSideProps } from 'next'
// import { getAppContext, getAppName } from '../../utils/appContext'

// interface PageProps {
//   appContext: string;
// }

// export default function FSClinicalsLanding({ appContext }: PageProps) {
//   const appName = getAppName();

//   return (
//     <div>
//       <h1>Welcome to FSClinicals</h1>
//       <p>Current context: {appContext}</p>
//       <p>App Name: {appName}</p>
//     </div>
//   )
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const appContext = context.req.headers['x-app-context'] as string || 'unknown';

//   // Set the app context in localStorage on the client-side
//   context.res.setHeader('Set-Cookie', `appContext=${appContext}; Path=/; HttpOnly; SameSite=Strict`);

//   return {
//     props: { appContext },
//   }
// }
