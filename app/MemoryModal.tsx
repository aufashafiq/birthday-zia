"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryModalProps {
    memory: {
        id: string;
        date: string;
        title: string;
        description?: string;
        images: string[];
    } | null;
    onClose: () => void;
    onNextMemory?: () => void;
    onPrevMemory?: () => void;
}

export default function MemoryModal({ memory, onClose, onNextMemory, onPrevMemory }: MemoryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Reset index when memory changes
    useEffect(() => {
        if (memory) {
            setCurrentIndex(0);
            // Generate sparkles on open
            const newSparkles = Array.from({ length: 20 }, (_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 6 + 2,
            }));
            setSparkles(newSparkles);
            setTimeout(() => setSparkles([]), 1500);
        }
    }, [memory]);

    const goNext = useCallback(() => {
        if (!memory) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % memory.images.length);
    }, [memory]);

    const goPrev = useCallback(() => {
        if (!memory) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + memory.images.length) % memory.images.length);
    }, [memory]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!memory) return;
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [memory, goNext, goPrev, onClose]);

    // Touch/swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goNext();
            else goPrev();
        }
    };

    if (!memory) return null;

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <AnimatePresence>
            {memory && (
                <motion.div
                    className="memory-modal-overlay backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                >
                    {/* Sparkles */}
                    {sparkles.map((s) => (
                        <motion.div
                            key={s.id}
                            className="sparkle"
                            style={{
                                left: `${s.x}%`,
                                top: `${s.y}%`,
                                width: s.size,
                                height: s.size,
                            }}
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{ opacity: 0, scale: 2 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                    ))}

                    <div className="memory-modal-content-transparent" onClick={(e) => e.stopPropagation()}>

                        {/* Bottom Navigation Control Bar */}
                        <div className="memory-nav-bar" style={{
                            position: 'absolute',
                            bottom: '50px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            zIndex: 100,
                            width: '90%',
                            justifyContent: 'center'
                        }}>
                            {onPrevMemory && (
                                <button className="memory-nav-btn" onClick={(e) => { e.stopPropagation(); onPrevMemory(); }}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid white',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        color: 'white',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ⏮
                                </button>
                            )}

                            {/* Close button - Back Pill */}
                            <button className="memory-close-pill" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none' }} onClick={onClose}>
                                <span className="back-icon">✕</span> CLOSE
                            </button>

                            {onNextMemory && (
                                <button className="memory-nav-btn" onClick={(e) => { e.stopPropagation(); onNextMemory(); }}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid white',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        color: 'white',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ⏭
                                </button>
                            )}
                        </div>

                        <div
                            className="memory-display-container"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Navigation Arrows (Desktop) */}
                            {memory.images.length > 1 && (
                                <>
                                    <button className="nav-arrow left" onClick={goPrev}>‹</button>
                                    <button className="nav-arrow right" onClick={goNext}>›</button>
                                </>
                            )}

                            <AnimatePresence custom={direction} mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    className="memory-image-wrapper"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <img
                                        src={memory.images[currentIndex]}
                                        alt={`${memory.title} - Photo ${currentIndex + 1}`}
                                        className="memory-main-image"
                                        draggable={false}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Text Overlay */}
                        <div className="memory-text-overlay">
                            <h3 className="memory-title-neon">{memory.title}</h3>
                            <p className="memory-desc-white">
                                {memory.description || "Captured moments special buat kamu! ✨📸"}
                            </p>
                            <div className="slide-indicator">
                                Slide {currentIndex + 1} / {memory.images.length}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
