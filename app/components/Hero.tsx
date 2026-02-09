"use client";

import { useEffect, useState, useRef } from "react";

export default function Hero() {
    const [titleVisible, setTitleVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        setTimeout(() => setTitleVisible(true), 300);
        setTimeout(() => setContentVisible(true), 600);
    }, []);

    return (
        <section id="hero" className="section hero-section">
            {/* Decorations */}
            <div className="hero-decoration hero-heart">
                <span>❤️</span>
            </div>
            <div className="hero-decoration hero-star star-1">⭐</div>
            <div className="hero-decoration hero-star star-2">✨</div>
            <div className="hero-decoration hero-star star-3">⭐</div>
            <div className="hero-decoration hero-arrow">➜</div>

            <div className="hero-container">
                {/* Polaroid on left */}
                <div className="hero-polaroid">
                    <div className="hero-polaroid-image">
                        <span>👩</span>
                    </div>
                    <p className="hero-polaroid-caption">Special Day ✨</p>
                </div>

                {/* Content on right */}
                <div
                    className="hero-content"
                    style={{
                        opacity: contentVisible ? 1 : 0,
                        transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease'
                    }}
                >
                    <span className="hero-today-badge">T O D A Y</span>

                    <h1
                        className="hero-title"
                        style={{
                            opacity: titleVisible ? 1 : 0,
                            transform: titleVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s ease'
                        }}
                    >
                        <span className="hero-title-happy">Happy</span>
                        <span className="hero-title-birthday">Birthday</span>
                    </h1>

                    <div className="hero-quote-box">
                        <p className="hero-quote-text">
                            "Another year of adventures, laughter, and making beautiful memories."
                        </p>
                    </div>

                    <div className="hero-tags">
                        <span className="hero-tag pink">#Celebration</span>
                        <span className="hero-tag blue">#Memories</span>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator">↓</div>
        </section>
    );
}
