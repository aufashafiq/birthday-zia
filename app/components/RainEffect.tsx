import { useEffect, useState } from "react";

const RAIN_IMAGES = [
    "/rain/1.png",
    "/rain/2.png",
    "/rain/3.png",
    "/rain/4.png",
    "/rain/5.png",
    "/rain/6.png",
    "/rain/7.png",
];

const PARTICLE_COUNT = 35;

export default function RainEffect({ isLetterOpen = false }: { isLetterOpen?: boolean }) {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const finaleSection = document.getElementById('finale');
        if (!finaleSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Check if finale is at or past the top of the viewport
                const atOrPast = entry.isIntersecting || entry.boundingClientRect.top < 0;
                setIsAtBottom(atOrPast);
            },
            {
                threshold: 0, // Trigger as soon as the top edge touches
            }
        );

        observer.observe(finaleSection);
        return () => observer.disconnect();
    }, []);

    const isVisible = !isAtBottom && !isLetterOpen;

    // Generate particles with deterministic random-ish values
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const imageIndex = i % RAIN_IMAGES.length;
        const left = ((i * 37 + 13) % 100); // pseudo-random spread
        const size = 18 + (i % 5) * 6; // 18–42px
        const duration = 6 + (i % 4) * 1.5; // 6–10.5s
        const delay = (i * 0.3) % 4; // staggered 0–4s
        const opacity = 0.3 + (i % 4) * 0.15; // 0.3–0.75
        const swayAmount = -15 + (i % 7) * 5; // slight horizontal drift

        return (
            <img
                key={i}
                src={RAIN_IMAGES[imageIndex]}
                alt=""
                className="rain-particle"
                draggable={false}
                style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: "auto",
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    opacity: opacity,
                    ["--sway" as string]: `${swayAmount}px`,
                }}
            />
        );
    });

    return (
        <div className={`rain-container ${isVisible ? 'active' : 'hidden'}`}>
            {particles}
        </div>
    );
}
