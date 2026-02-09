"use client";

import { useEffect, useState, useCallback } from "react";

interface NavSection {
    id: string;
    label: string;
    color: string;
}

const sections: NavSection[] = [
    { id: "hero", label: "Hero", color: "#3b82f6" },
    { id: "memories", label: "Memories", color: "#8b5cf6" },
    { id: "wishes", label: "Wishes", color: "#06b6d4" },
    { id: "finale", label: "Finale", color: "#22c55e" },
];

export default function DotNav() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                {
                    threshold: 0.4,
                    rootMargin: "-5% 0px -5% 0px",
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => observers.forEach((observer) => observer.disconnect());
    }, []);

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return (
        <nav className="dot-nav" aria-label="Section navigation">
            {sections.map(({ id, label, color }) => (
                <div key={id} className="dot-nav-wrapper">
                    <button
                        className={`dot-nav-item ${activeSection === id ? "active" : ""}`}
                        onClick={() => scrollToSection(id)}
                        aria-label={`Go to ${label} section`}
                        style={{ background: color }}
                    />
                    <span className="dot-nav-tooltip">{label}</span>
                </div>
            ))}
        </nav>
    );
}
