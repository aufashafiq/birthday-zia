"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface HoldButtonProps {
    onComplete: () => void;
}

export default function HoldButton({ onComplete }: HoldButtonProps) {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isOpening, setIsOpening] = useState(false);
    const progressRef = useRef<number>(0);
    const animationFrameRef = useRef<number | null>(null);
    const controls = useAnimation();

    // Settings
    const HOLD_DURATION = 2000; // 2 seconds to fill

    useEffect(() => {
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

            progressRef.current = newProgress;
            setProgress(newProgress);

            if (newProgress < 100 && isHolding) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else if (newProgress >= 100) {
                setIsOpening(true);
                // Delay the completion signal to allow animations to play
                setTimeout(() => {
                    onComplete();
                }, 600);
            }
        };

        if (isHolding && !isOpening) {
            // Intense Shake increases with progress
            controls.start({
                x: [-2, 2, -3, 3, -1, 1, 0],
                rotate: [-1, 1, -2, 2, 0],
                scale: [1, 1.05, 0.95, 1.02, 1],
                transition: { repeat: Infinity, duration: 0.2 }
            });
            animationFrameRef.current = requestAnimationFrame(animate);
        } else if (!isOpening) {
            // Reset if not opening
            controls.stop();
            controls.set({ x: 0, rotate: 0, scale: 1 });
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            setProgress(0);
            progressRef.current = 0;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isHolding, isOpening, onComplete, controls]);

    return (
        <div className="hold-button-container">
            <motion.div
                className={`gift-box-wrapper ${isHolding ? "holding" : ""} ${isOpening ? "opening" : ""}`}
                onPointerDown={() => !isOpening && setIsHolding(true)}
                onPointerUp={() => setIsHolding(false)}
                onPointerLeave={() => setIsHolding(false)}
                animate={controls}
                whileHover={!isOpening ? { scale: 1.05 } : {}}
                whileTap={!isOpening ? { scale: 0.95 } : {}}
            >
                <div className={`gift-lid ${isOpening ? "opening" : ""}`}>
                    <div className="gift-bow-left"></div>
                    <div className="gift-bow-right"></div>
                    <div className="gift-ribbon-horizontal"></div>
                </div>

                <div className={`gift-body ${isOpening ? "opening" : ""}`}>
                    <div className="gift-ribbon-vertical"></div>
                    {/* Progress moves UP from bottom */}
                    <div
                        className="gift-progress-fill"
                        style={{ height: `${progress}%` }}
                    ></div>
                </div>
            </motion.div>

            <p className="hold-hint">
                {isOpening ? "SURPRISE! ✨" : isHolding ? "Keep holding..." : "Hold the gift to open! 🎁"}
            </p>
        </div>
    );
}
