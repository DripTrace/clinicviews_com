// "use client"; // Required for client-side code

// import { useEffect, useRef, useState } from "react";
// import NeuroCanvas from "./NeuroCanvas"; // Ensure the import path is correct

// const NeuralNoise: React.FC = () => {
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [scrollProgress, setScrollProgress] = useState(0);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (contentRef.current) {
//                 const scrollY = contentRef.current.scrollTop; // Scroll within this section
//                 const windowHeight = contentRef.current.clientHeight;
//                 const docHeight = contentRef.current.scrollHeight;
//                 const maxScroll = docHeight - windowHeight;

//                 const progress = scrollY / maxScroll;
//                 setScrollProgress(progress); // Update scroll progress state
//             }
//         };

//         const section = contentRef.current;
//         if (section) {
//             section.addEventListener("scroll", handleScroll);
//         }

//         return () => {
//             if (section) {
//                 section.removeEventListener("scroll", handleScroll);
//             }
//         };
//     }, []);

//     return (
//         <div
//             ref={contentRef}
//             className="relative overflow-auto h-screen"
//             style={{ height: "100vh" }}
//         >
//             {/* Content */}
//             <div className="min-h-[200vh] flex flex-col justify-center items-center text-[30vh] text-center">
//                 Scroll Inside This Area
//             </div>
//             <div className="h-[100vh] flex justify-center items-center text-[30vh] text-center">
//                 More Content to Scroll
//             </div>

//             {/* NeuroCanvas now receives scrollProgress as a prop */}
//             <NeuroCanvas scrollProgress={scrollProgress} />
//         </div>
//     );
// };

// export default NeuralNoise;

"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Header from "./Header";
import Footer from "./Footer";
import ClientLayoutContent from "./ClientLayoutContent";

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <ClientLayoutContent>
                <Header />
                <main className="bg-blue-100 dark:bg-gray-900 flex-grow">
                    {children}
                </main>
                <Footer />
            </ClientLayoutContent>
        </Provider>
    );
};

export default ClientLayout;

// "use client"; // Required for client-side code

// import { useEffect, useRef, useState } from "react";
// import NeuroCanvas from "./NeuroCanvas"; // Ensure the import path is correct
// import { Provider } from "react-redux";
// import { store } from "../../store/store";
// import Header from "./Header";
// import Footer from "./Footer";
// import ClientLayoutContent from "./ClientLayoutContent";

// interface ClientLayoutProps {
//     children: React.ReactNode;
// }

// const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [scrollProgress, setScrollProgress] = useState(0);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (contentRef.current) {
//                 const scrollY = contentRef.current.scrollTop; // Scroll within this section
//                 const windowHeight = contentRef.current.clientHeight;
//                 const docHeight = contentRef.current.scrollHeight;
//                 const maxScroll = docHeight - windowHeight;

//                 const progress = scrollY / maxScroll;
//                 setScrollProgress(progress); // Update scroll progress state
//             }
//         };

//         const section = contentRef.current;
//         if (section) {
//             section.addEventListener("scroll", handleScroll);
//         }

//         return () => {
//             if (section) {
//                 section.removeEventListener("scroll", handleScroll);
//             }
//         };
//     }, []);
//     return (
//         <Provider store={store}>
//             <ClientLayoutContent>
//                 <Header />
//                 <main
//                     ref={contentRef}
//                     className="relative overflow-auto h-screen"
//                     style={{ height: "100vh" }}
//                 >
//                     {/* <div
//                         ref={contentRef}
//                         className="relative overflow-auto h-screen"
//                         style={{ height: "100vh" }}
//                     > */}
//                     {children}
//                     <NeuroCanvas scrollProgress={scrollProgress} />
//                     {/* </div> */}
//                 </main>
//                 <Footer />
//             </ClientLayoutContent>
//         </Provider>
//     );
// };

// export default ClientLayout;
