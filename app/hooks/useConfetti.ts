"use client";

import { useRef, useCallback, useEffect } from "react";
import { createConfettiBurst, createSparkleEffect } from "../utils/confetti";

export function useConfetti() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    const resizeCanvas = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, [resizeCanvas]);

    const triggerConfetti = useCallback((x?: number, y?: number) => {
        if (!canvasRef.current) return;

        const centerX = x ?? window.innerWidth / 2;
        const centerY = y ?? window.innerHeight / 2;

        if (cleanupRef.current) {
            cleanupRef.current();
        }

        cleanupRef.current = createConfettiBurst(canvasRef.current, centerX, centerY) ?? null;
    }, []);

    const triggerSparkles = useCallback((duration?: number) => {
        if (!canvasRef.current) return;

        if (cleanupRef.current) {
            cleanupRef.current();
        }

        cleanupRef.current = createSparkleEffect(canvasRef.current, duration) ?? null;
    }, []);

    return {
        canvasRef,
        triggerConfetti,
        triggerSparkles,
    };
}
