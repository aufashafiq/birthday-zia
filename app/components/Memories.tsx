"use client";

import { useEffect, useRef, useState } from "react";

interface MemoryCard {
    id: number;
    emoji: string;
    caption: string;
    gradient: string;
}

const memories: MemoryCard[] = [
    {
        id: 1,
        emoji: "🎂",
        caption: "Sweet moments together",
        gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    },
    {
        id: 2,
        emoji: "🌸",
        caption: "Beautiful like spring",
        gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    },
    {
        id: 3,
        emoji: "✨",
        caption: "Sparkling personality",
        gradient: "linear-gradient(135deg, #fef9c3 0%, #fde047 100%)",
    },
    {
        id: 4,
        emoji: "💝",
        caption: "Full of love",
        gradient: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
    },
    {
        id: 5,
        emoji: "🎀",
        caption: "Always elegant",
        gradient: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)",
    },
    {
        id: 6,
        emoji: "🌈",
        caption: "Bringing colors to life",
        gradient: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
    },
];

export default function Memories() {
    const sectionRef = useRef<HTMLElement>(null);
    const [sectionVisible, setSectionVisible] = useState(false);
    const [visibleCards, setVisibleCards] = useState<boolean[]>(
        new Array(memories.length).fill(false)
    );
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const sectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSectionVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        sectionObserver.observe(section);
        return () => sectionObserver.disconnect();
    }, []);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        cardRefs.current.forEach((card, index) => {
            if (!card) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setVisibleCards((prev) => {
                                const newState = [...prev];
                                newState[index] = true;
                                return newState;
                            });
                        }, index * 100);
                    }
                },
                { threshold: 0.2 }
            );

            observer.observe(card);
            observers.push(observer);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, []);

    return (
        <section
            ref={sectionRef}
            id="memories"
            className="section memories-section"
        >
            <h2
                className="memories-title"
                style={{
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease'
                }}
            >
                Sweet Memories
            </h2>

            <div className="memories-grid">
                {memories.map((memory, index) => (
                    <div
                        key={memory.id}
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className="polaroid"
                        style={{
                            opacity: visibleCards[index] ? 1 : 0,
                            transform: visibleCards[index]
                                ? `translateY(0) rotate(var(--rotation))`
                                : `translateY(40px) rotate(var(--rotation))`,
                            transition: `all 0.6s ease ${index * 0.1}s`,
                        }}
                    >
                        <div
                            className="polaroid-image"
                            style={{ background: memory.gradient }}
                        >
                            <span className="polaroid-emoji">{memory.emoji}</span>
                        </div>
                        <p className="polaroid-caption">{memory.caption}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
