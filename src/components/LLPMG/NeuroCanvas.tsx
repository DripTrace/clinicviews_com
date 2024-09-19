// // "use client";

// // import { useEffect, useRef } from "react";
// // import { initShader, setupEvents, resizeCanvas } from "@/lib/llpmg/webGlUtils";

// // const NeuroCanvas: React.FC = () => {
// //     const canvasRef = useRef<HTMLCanvasElement>(null);

// //     useEffect(() => {
// //         const canvas = canvasRef.current;
// //         if (!canvas) return;

// //         const gl = canvas.getContext("webgl");
// //         if (!gl) {
// //             console.error("WebGL is not supported by your browser.");
// //             return;
// //         }

// //         const { render, cleanup } = initShader(gl);

// //         const handleResize = () => resizeCanvas(canvas, gl);
// //         window.addEventListener("resize", handleResize);
// //         handleResize();

// //         const pointer = setupEvents(window);

// //         let animationFrame: number;

// //         const animate = (time: number) => {
// //             render(time, pointer);
// //             animationFrame = requestAnimationFrame(animate);
// //         };

// //         animationFrame = requestAnimationFrame(animate);

// //         // Update the scroll progress in the shader on scroll
// //         const handleScroll = () => {
// //             const scrollProgress =
// //                 window.pageYOffset /
// //                 (document.body.scrollHeight - window.innerHeight);
// //             console.log("Scroll Progress:", scrollProgress); // Debugging
// //             render(performance.now(), pointer); // Make sure to call render with updated scroll position
// //         };

// //         window.addEventListener("scroll", handleScroll);

// //         return () => {
// //             cancelAnimationFrame(animationFrame);
// //             window.removeEventListener("resize", handleResize);
// //             window.removeEventListener("scroll", handleScroll);
// //             cleanup();
// //         };
// //     }, []);

// //     return (
// //         <canvas
// //             ref={canvasRef}
// //             className="fixed top-0 left-0 w-full h-full pointer-events-none"
// //         />
// //     );
// // };

// // export default NeuroCanvas;

// "use client";

// import { useEffect, useRef } from "react";
// import { initShader, resizeCanvas } from "@/lib/llpmg/webGlUtils";

// const NeuroCanvas: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const gl = canvas.getContext("webgl");
//         if (!gl) {
//             console.error("WebGL is not supported by your browser.");
//             return;
//         }

//         const { render, cleanup } = initShader(gl);

//         const handleResize = () => resizeCanvas(canvas, gl);
//         window.addEventListener("resize", handleResize);
//         handleResize();

//         // Track pointer events (e.g., mouse movement)
//         const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
//         window.addEventListener("mousemove", (e) => {
//             pointer.tX = e.clientX;
//             pointer.tY = e.clientY;
//         });

//         let animationFrame: number;

//         // Animation loop
//         const animate = (time: number) => {
//             render(time, pointer); // Calls render with pointer and scroll state
//             animationFrame = requestAnimationFrame(animate);
//         };

//         animationFrame = requestAnimationFrame(animate);

//         // Scroll event to trigger color changes in the shader
//         const handleScroll = () => {
//             const scrollProgress =
//                 window.pageYOffset /
//                 (document.body.scrollHeight - window.innerHeight);
//             console.log("Scroll Progress:", scrollProgress); // Debugging scroll progress
//             render(performance.now(), pointer, scrollProgress); // Re-render with scroll progress
//         };

//         window.addEventListener("scroll", handleScroll);

//         return () => {
//             cancelAnimationFrame(animationFrame);
//             window.removeEventListener("resize", handleResize);
//             window.removeEventListener("scroll", handleScroll);
//             cleanup();
//         };
//     }, []);

//     return (
//         <canvas
//             ref={canvasRef}
//             className="fixed top-0 left-0 w-full h-full pointer-events-none"
//         />
//     );
// };

// export default NeuroCanvas;

"use client";

import { useEffect, useRef } from "react";
import { initShader, resizeCanvas } from "@/lib/llpmg/webGlUtils";

const NeuroCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL is not supported by your browser.");
            return;
        }

        const { render, cleanup } = initShader(gl);

        const handleResize = () => {
            console.log("Canvas resized");
            resizeCanvas(canvas, gl);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial resize on mount

        // Track mouse movement
        const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
        window.addEventListener("mousemove", (e) => {
            pointer.tX = e.clientX;
            pointer.tY = e.clientY;
        });

        let animationFrame: number;

        const animate = (time: number) => {
            render(time, pointer);
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        // Scroll event with more detailed logging
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.body.scrollHeight;
            const maxScroll = docHeight - windowHeight;

            const scrollProgress = scrollY / maxScroll;

            // Logging detailed scroll values for debugging
            console.log("ScrollY:", scrollY); // Current scroll position
            console.log("Window Height:", windowHeight); // Viewport height
            console.log("Document Height:", docHeight); // Total document height
            console.log("Max Scroll:", maxScroll); // Max possible scroll
            console.log("Scroll Progress:", scrollProgress); // Scroll progress

            render(performance.now(), pointer, scrollProgress); // Re-render with scroll progress
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            cleanup();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default NeuroCanvas;
