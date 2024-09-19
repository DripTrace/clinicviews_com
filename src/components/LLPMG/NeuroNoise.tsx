"use client";

// components/NeuralNoise.tsx
import React, { useEffect, useRef } from "react";
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
                        Neural Noise
                    </div>
                </section>
                <section className="section w-full h-screen flex justify-center items-center text-[#FFF6F7] text-center">
                    <div className="w-[90%] max-w-[800px] text-[10vh] md:text-[9vw]">
                        GLSL shader based on{" "}
                        <a
                            href="https://x.com/zozuar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            testing
                        </a>{" "}
                        <a
                            href="https://x.com/zozuar/status/1625182758745128981/"
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
                            href="https://linkedin.com/in/ksenia-kondrashova/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            linkedIn
                        </a>
                        <a
                            href="https://codepen.io/ksenia-k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            codepen
                        </a>
                        <a
                            href="https://x.com/uuuuuulala"
                            target="_top"
                            className="px-[0.3em] hover:text-[#a0a0ff] active:text-[#a0ffff]"
                        >
                            X (twitter)
                        </a>
                    </div>
                </section>
            </div>
            <NeuroCanvas />
        </div>
    );
};

export default NeuralNoise;
