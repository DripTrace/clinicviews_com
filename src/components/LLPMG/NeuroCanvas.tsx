"use client";

import { initShader, resizeCanvas, setupEvents } from "@/lib/llpmg/webGlUtils";
// components/NeuroCanvas.tsx
import { useEffect, useRef } from "react";
// import { initShader, setupEvents, resizeCanvas } from '../utils/webglUtils';

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

        const handleResize = () => resizeCanvas(canvas, gl);
        window.addEventListener("resize", handleResize);
        handleResize();

        const pointer = setupEvents(canvas);

        let animationFrame: number;
        const animate = (time: number) => {
            render(time, pointer);
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", handleResize);
            cleanup();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-95"
        />
    );
};

export default NeuroCanvas;
