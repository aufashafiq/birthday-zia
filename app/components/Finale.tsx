"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useConfetti } from "../hooks/useConfetti";

const bannerLetters = [
    { letter: "H", color: "#fce7f3" },
    { letter: "A", color: "#dbeafe" },
    { letter: "P", color: "#e9d5ff" },
    { letter: "P", color: "#d1fae5" },
    { letter: "Y", color: "#fef9c3" },
    { letter: " ", color: "transparent" },
    { letter: "B", color: "#fce7f3" },
    { letter: "D", color: "#dbeafe" },
    { letter: "A", color: "#e9d5ff" },
    { letter: "Y", color: "#d1fae5" },
    { letter: "!", color: "#fef9c3" },
];

export default function Finale() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isCelebrating, setIsCelebrating] = useState(false);
    const { canvasRef, triggerConfetti, triggerSparkles } = useConfetti();
    const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            delay: `${Math.random() * 2}s`,
        }));
        setStars(newStars);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const handleBannerClick = useCallback(() => {
        if (isCelebrating) return;

        setIsCelebrating(true);

        // Multiple confetti bursts
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        triggerConfetti(centerX, centerY - 50);
        setTimeout(() => triggerConfetti(centerX - 150, centerY), 100);
        setTimeout(() => triggerConfetti(centerX + 150, centerY), 200);

        triggerSparkles(4000);

        setTimeout(() => {
            setIsCelebrating(false);
        }, 5000);
    }, [isCelebrating, triggerConfetti, triggerSparkles]);

    return (
        <>
            <canvas ref={canvasRef} className="confetti-canvas" />
            <section
                ref={sectionRef}
                id="finale"
                className="section finale-section"
            >
                {/* Background stars */}
                {stars.map((star) => (
                    <span
                        key={star.id}
                        className="finale-star"
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.delay,
                        }}
                    >
                        ⭐
                    </span>
                ))}

                <div
                    className="finale-content"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s ease'
                    }}
                >
                    <h2 className="finale-title">The End</h2>
                    <p className="finale-subtitle">OF THE PAGE, NOT THE FUN!</p>

                    {/* Hanging banner */}
                    <div className="banner-container" onClick={handleBannerClick}>
                        <div className="banner-string">
                            <svg viewBox="0 0 800 80" preserveAspectRatio="none">
                                <path
                                    d="M 0 20 Q 200 60 400 40 Q 600 20 800 50"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </div>

                        <div className="banner-cards">
                            {bannerLetters.map((item, index) => (
                                item.letter === " " ? (
                                    <div key={index} style={{ width: "20px" }} />
                                ) : (
                                    <div
                                        key={index}
                                        className="banner-card"
                                        style={{
                                            "--card-color": item.color,
                                            animationDelay: `${index * 0.1}s`
                                        } as React.CSSProperties}
                                    >
                                        {item.letter}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <p className="finale-hint">( tap the lights )</p>
                </div>

                <p className="finale-footer">HANDCRAFTED WITH ❤️</p>
            </section>
        </>
    );
}
