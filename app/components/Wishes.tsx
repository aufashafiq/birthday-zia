"use client";

import { useEffect, useRef, useState } from "react";

export default function Wishes() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="wishes"
            className="section wishes-section"
        >
            <div
                className="wishes-content"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.8s ease'
                }}
            >
                <h2 className="wishes-title">Birthday Wishes</h2>

                <div className="wishes-text">
                    <p>
                        <span className="wishes-emoji">🎂</span> Selamat ulang tahun, Zia!{" "}
                        <span className="wishes-emoji">🎂</span>
                    </p>

                    <p>
                        Semoga di hari spesial ini, semua{" "}
                        <span className="highlight">mimpi dan harapanmu</span> menjadi kenyataan.
                    </p>

                    <p>
                        May this year bring you endless{" "}
                        <span className="highlight">happiness</span>,{" "}
                        <span className="highlight">success</span>, and all the{" "}
                        <span className="highlight">love</span> you deserve.
                    </p>

                    <p>
                        Terima kasih sudah menjadi orang yang luar biasa. Kamu adalah
                        berkat bagi semua orang di sekitarmu.{" "}
                        <span className="wishes-emoji">💕</span>
                    </p>

                    <p>
                        Keep shining bright like the star you are!{" "}
                        <span className="wishes-emoji">⭐</span>
                    </p>

                    <p style={{ marginTop: "1.5rem", fontSize: "1.5em" }}>
                        <span className="wishes-emoji">🎉</span> Happy Birthday!{" "}
                        <span className="wishes-emoji">🎉</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
