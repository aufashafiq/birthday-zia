"use client";

import { motion } from "framer-motion";

export type UnicornPose = "stand" | "sit" | "jump" | "dance" | "sleep";
export type UnicornExpression = "happy" | "sparkle" | "wink" | "sleepy";

interface GemoyUnicornProps {
    delay?: number;
    scale?: number;
    flip?: boolean;
    pose?: UnicornPose;
    expression?: UnicornExpression;
}

export default function GemoyUnicorn({
    delay = 0,
    scale = 1,
    flip = false,
    pose = "stand",
    expression = "happy"
}: GemoyUnicornProps) {

    // Animation Variants
    const animations = {
        stand: { y: [0, -5, 0] },
        sit: { y: [5, 0, 5], scaleY: [0.95, 1, 0.95] },
        jump: { y: [0, -30, 0], rotate: [-5, 5, -5] },
        dance: { rotate: [-10, 10, -10], y: [0, -5, 0] },
        sleep: { scale: [1, 1.05, 1], rotate: [0, 2, 0] }
    };

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={animations[pose] || animations.stand}
            transition={{
                duration: pose === 'jump' || pose === 'dance' ? 0.6 : 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            style={{
                transform: `scale(${scale}) ${flip ? 'scaleX(-1)' : ''}`,
                display: 'inline-block',
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
            }}
        >
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>

                {/* ─── BODY (White Mochi Blob) ─── */}
                <path d="M50 120 C50 70 80 50 120 50 C160 50 180 80 180 120 C180 170 160 190 120 190 C80 190 50 170 50 120 Z"
                    fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="3" />

                {/* ─── LEGS (Tiny Nubs) ─── */}
                <path d="M70 180 L70 195" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
                <path d="M110 180 L110 195" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
                <path d="M150 180 L150 195" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

                {/* Leg Outlines */}
                <path d="M70 195 L70 195" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
                <path d="M110 195 L110 195" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
                <path d="M150 195 L150 195" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />


                {/* ─── RAINBOW MANE (Pastel Gradient Strands) ─── */}
                {/* Back Hair */}
                <path d="M140 130 Q160 120 160 160" stroke="#F8BBD0" strokeWidth="10" strokeLinecap="round" /> {/* Pink Tail */}

                {/* Bangs */}
                <path d="M80 55 Q60 70 55 100" stroke="#FF80AB" strokeWidth="10" strokeLinecap="round" /> {/* Pink */}
                <path d="M100 50 Q80 65 75 95" stroke="#80D8FF" strokeWidth="10" strokeLinecap="round" /> {/* Blue */}
                <path d="M120 48 Q100 60 95 90" stroke="#B388FF" strokeWidth="10" strokeLinecap="round" /> {/* Purple */}


                {/* ─── HORN (Golden) ─── */}
                <path d="M115 50 L125 10 L135 50 Z" fill="#FFD700" stroke="#FBC02D" strokeWidth="2" />
                <path d="M115 50 L135 50" stroke="#FBC02D" strokeWidth="2" />
                <path d="M125 45 L125 15" stroke="#FFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />


                {/* ─── FACE ─── */}
                {/* Blush */}
                <ellipse cx="80" cy="120" rx="8" ry="5" fill="#FF80AB" opacity="0.4" />
                <ellipse cx="140" cy="120" rx="8" ry="5" fill="#FF80AB" opacity="0.4" />

                {/* Expressions */}
                {expression === "happy" && (
                    <>
                        <path d="M70 110 Q80 100 90 110" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <path d="M130 110 Q140 100 150 110" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
                {expression === "wink" && (
                    <>
                        <path d="M70 110 Q80 100 90 110" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="140" cy="110" r="4" fill="#4a4a4a" />
                    </>
                )}
                {expression === "sparkle" && (
                    <>
                        <path d="M70 105 L80 115 L90 105" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <path d="M130 105 L140 115 L150 105" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <text x="100" y="90" fontSize="20">✨</text>
                    </>
                )}
                {expression === "sleepy" && (
                    <>
                        <path d="M70 115 Q80 120 90 115" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <path d="M130 115 Q140 120 150 115" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
                        <text x="150" y="90" fontSize="18" fill="#4a4a4a">zZ</text>
                    </>
                )}


                {/* Snout */}
                <path d="M105 125 Q110 130 115 125" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />

                {/* ─── ARMS (Interactive) ─── */}
                {pose === "stand" || pose === "jump" ? (
                    <>
                        <path d="M60 140 Q50 160 70 160" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                        <path d="M60 140 Q50 160 70 160" stroke="#E5E7EB" strokeWidth="2" fill="none" />

                        <path d="M160 140 Q170 160 150 160" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                        <path d="M160 140 Q170 160 150 160" stroke="#E5E7EB" strokeWidth="2" fill="none" />
                    </>
                ) : pose === "dance" ? (
                    <>
                        <path d="M60 140 L40 120" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" /> {/* Up */}
                        <path d="M160 140 L180 160" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" /> {/* Down */}
                    </>
                ) : null}

            </svg>
        </motion.div>
    );
}
