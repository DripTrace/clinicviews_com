// // "use client";

// // import { useEffect, useRef } from "react";
// // import NeuroCanvas from "./NeuroCanvas";

// // const NeuralNoise: React.FC = () => {
// //     const contentRef = useRef<HTMLDivElement>(null);

// //     useEffect(() => {
// //         const handleScroll = () => {
// //             if (contentRef.current) {
// //                 const scrollY = window.scrollY;
// //                 const sections =
// //                     contentRef.current.querySelectorAll(".section");
// //                 sections.forEach((section, index) => {
// //                     const offset =
// //                         section.getBoundingClientRect().top + scrollY;
// //                     const opacity = Math.max(
// //                         0,
// //                         Math.min(
// //                             1,
// //                             (scrollY - offset + window.innerHeight) /
// //                                 window.innerHeight
// //                         )
// //                     );
// //                     (section as HTMLElement).style.opacity = opacity.toString();
// //                 });
// //             }
// //         };

// //         window.addEventListener("scroll", handleScroll);
// //         return () => window.removeEventListener("scroll", handleScroll);
// //     }, []);

// //     return (
// //         <div className="bg-[#151912] min-h-screen overflow-x-hidden">
// //             <div ref={contentRef} className="w-screen font-serif">
// //                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
// //                     <div className="w-[90%] text-[20vh] sm:text-[25vw] xs:text-[30px]">
// //                         Loma Linda Psychiatric Medical Group
// //                     </div>
// //                 </section>
// //                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
// //                     <div className="w-[90%] max-w-[800px] text-[10vh] md:text-[9vw]">
// //                         GLSL shader based on{" "}
// //                         <a
// //                             href="https://lomalindapsych.com"
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
// //                         >
// //                             testing
// //                         </a>{" "}
// //                         <a
// //                             href="https://lomalindapsych.com"
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
// //                         >
// //                             artwork
// //                         </a>
// //                     </div>
// //                 </section>
// //                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
// //                     <div className="w-[90%] max-w-[900px] text-[8vh] md:text-[9vw]">
// //                         <a
// //                             href="https://lomalindapsych.com"
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
// //                         >
// //                             linkedIn
// //                         </a>
// //                         <a
// //                             href="https://lomalindapsych.com"
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
// //                         >
// //                             codepen
// //                         </a>
// //                         <a
// //                             href="https://lomalindapsych.com"
// //                             target="_top"
// //                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
// //                         >
// //                             X (twitter)
// //                         </a>
// //                     </div>
// //                 </section>
// //             </div>
// //             <NeuroCanvas />
// //         </div>
// //     );
// // };

// // export default NeuralNoise;

// // NeuralNoise.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import NeuroCanvas from "./NeuroCanvas";

// const NeuralNoise: React.FC = () => {
//     const contentRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (contentRef.current) {
//                 const scrollY = window.scrollY;
//                 const sections =
//                     contentRef.current.querySelectorAll(".section");
//                 sections.forEach((section, index) => {
//                     const offset =
//                         section.getBoundingClientRect().top + scrollY;
//                     const opacity = Math.max(
//                         0,
//                         Math.min(
//                             1,
//                             (scrollY - offset + window.innerHeight) /
//                                 window.innerHeight
//                         )
//                     );
//                     (section as HTMLElement).style.opacity = opacity.toString();
//                 });
//             }
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     return (
//         <div className="bg-[#151912] min-h-screen overflow-x-hidden">
//             <div ref={contentRef} className="w-screen font-serif">
//                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
//                     <div className="w-[90%] text-[20vh] sm:text-[25vw] xs:text-[30px]">
//                         Loma Linda Psychiatric Medical Group
//                     </div>
//                 </section>
//                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
//                     <div className="w-[90%] max-w-[800px] text-[10vh] md:text-[9vw]">
//                         GLSL shader based on{" "}
//                         <a
//                             href="https://lomalindapsych.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
//                         >
//                             testing
//                         </a>{" "}
//                         <a
//                             href="https://lomalindapsych.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
//                         >
//                             artwork
//                         </a>
//                     </div>
//                 </section>
//                 <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
//                     <div className="w-[90%] max-w-[900px] text-[8vh] md:text-[9vw]">
//                         <a
//                             href="https://lomalindapsych.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
//                         >
//                             linkedIn
//                         </a>
//                         <a
//                             href="https://lomalindapsych.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
//                         >
//                             codepen
//                         </a>
//                         <a
//                             href="https://lomalindapsych.com"
//                             target="_top"
//                             className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
//                         >
//                             X (twitter)
//                         </a>
//                     </div>
//                 </section>
//             </div>
//             <NeuroCanvas />
//         </div>
//     );
// };

// export default NeuralNoise;

// NeuralNoise.tsx
"use client";

import { useEffect, useRef } from "react";
import NeuroCanvas from "./NeuroCanvas";

const NeuralNoise: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const scrollY = window.scrollY;
                const sections =
                    contentRef.current.querySelectorAll(".section");
                sections.forEach((section, index) => {
                    const offset =
                        section.getBoundingClientRect().top + scrollY;
                    const opacity = Math.max(
                        0,
                        Math.min(
                            1,
                            (scrollY - offset + window.innerHeight) /
                                window.innerHeight
                        )
                    );
                    (section as HTMLElement).style.opacity = opacity.toString();
                });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-[#151912] min-h-screen overflow-x-hidden">
            <div ref={contentRef} className="w-screen font-serif">
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] text-[20vh] sm:text-[25vw] xs:text-[30px]">
                        Loma Linda Psychiatric Medical Group
                    </div>
                </section>
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] max-w-[800px] text-[10vh] md:text-[9vw]">
                        GLSL shader based on{" "}
                        <a
                            href="https://lomalindapsych.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            testing
                        </a>{" "}
                        <a
                            href="https://lomalindapsych.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            artwork
                        </a>
                    </div>
                </section>
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] max-w-[900px] text-[8vh] md:text-[9vw]">
                        <a
                            href="https://lomalindapsych.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            linkedIn
                        </a>
                        <a
                            href="https://lomalindapsych.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            codepen
                        </a>
                        <a
                            href="https://lomalindapsych.com"
                            target="_top"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            X (twitter)
                        </a>
                    </div>
                </section>

                {/* Add more content here for scrolling */}
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] text-[15vh]">Extra Section 1</div>
                </section>
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] text-[15vh]">Extra Section 2</div>
                </section>
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] text-[15vh]">Extra Section 3</div>
                </section>
            </div>
            <NeuroCanvas />
        </div>
    );
};

export default NeuralNoise;
