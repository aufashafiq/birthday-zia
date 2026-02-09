"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// SVG Icons as inline components for each food
const DuckIcon = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="48" rx="20" ry="10" fill="#F9A825" />
        <circle cx="32" cy="30" r="16" fill="#FFD54F" />
        <circle cx="26" cy="26" r="2.5" fill="#333" />
        <ellipse cx="32" cy="32" rx="6" ry="3" fill="#FF8F00" />
        <path d="M18 38 Q10 44, 14 50" stroke="#FFD54F" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M46 38 Q54 44, 50 50" stroke="#FFD54F" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

const SteakIcon = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="36" rx="24" ry="16" fill="#8D6E63" />
        <ellipse cx="32" cy="32" rx="24" ry="16" fill="#A1887F" />
        <ellipse cx="28" cy="30" rx="6" ry="4" fill="#FFCCBC" opacity="0.6" />
        <ellipse cx="38" cy="34" rx="4" ry="3" fill="#FFCCBC" opacity="0.4" />
        <path d="M12 28 Q8 20, 16 18" stroke="#795548" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);

const SquidIcon = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="24" rx="14" ry="16" fill="#FF8A65" />
        <circle cx="27" cy="20" r="2" fill="#333" />
        <circle cx="37" cy="20" r="2" fill="#333" />
        <path d="M20 38 Q16 52, 22 54" stroke="#FF7043" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M26 40 Q24 54, 28 56" stroke="#FF7043" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M32 40 Q32 56, 34 56" stroke="#FF7043" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M38 40 Q40 54, 36 56" stroke="#FF7043" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M44 38 Q48 52, 42 54" stroke="#FF7043" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

const NoodleIcon = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="42" rx="22" ry="10" fill="#E0E0E0" />
        <ellipse cx="32" cy="38" rx="22" ry="10" fill="#F5F5F5" />
        <path d="M16 34 Q20 28, 28 30 Q36 32, 40 26 Q44 20, 48 24" stroke="#FFD54F" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M18 38 Q24 30, 32 34 Q38 38, 46 32" stroke="#FFD54F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="28" r="3" fill="#4CAF50" />
        <circle cx="40" cy="30" r="2" fill="#F44336" />
    </svg>
);

const NoodleIcon2 = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="42" rx="22" ry="10" fill="#FFCCBC" />
        <ellipse cx="32" cy="38" rx="22" ry="10" fill="#FFE0B2" />
        <path d="M14 34 Q22 24, 34 30 Q42 34, 50 28" stroke="#FFB74D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M16 38 Q26 28, 38 34 Q44 38, 48 34" stroke="#FFB74D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="26" r="4" fill="#8D6E63" />
        <circle cx="28" cy="30" r="2.5" fill="#66BB6A" />
    </svg>
);

const PadangIcon = () => (
    <svg viewBox="0 0 64 64" width="60" height="60" fill="none">
        <ellipse cx="32" cy="44" rx="24" ry="12" fill="#E0E0E0" />
        <ellipse cx="32" cy="40" rx="24" ry="12" fill="#F5F5F5" />
        <ellipse cx="32" cy="36" rx="16" ry="8" fill="#FFFFFF" />
        <ellipse cx="26" cy="34" rx="6" ry="4" fill="#8D6E63" />
        <ellipse cx="38" cy="32" rx="5" ry="3.5" fill="#F44336" />
        <rect x="24" y="28" width="16" height="3" rx="1.5" fill="#4CAF50" />
        <circle cx="32" cy="38" r="4" fill="#FFD54F" />
    </svg>
);

const recommendations = [
    {
        icon: DuckIcon,
        title: "Bebek Samping Masjid Nurul Falah",
        location: "Cinere",
        note: "Maghrib yaa biar dapet yang fresh 🦆",
        emoji: "🦆",
    },
    {
        icon: SteakIcon,
        title: "Steak Kuy",
        location: "Cirendeu",
        note: "Steaknya juicy banget sumpah 🥩",
        emoji: "🥩",
    },
    {
        icon: SquidIcon,
        title: "Dadar Beredar",
        location: "",
        note: "Cobain yg cumi, nasi jeruk 🦑",
        emoji: "🦑",
    },
    {
        icon: NoodleIcon,
        title: "Mie Ayam UPN",
        location: "",
        note: "Gua lupa nama tokonya tapi itu dabestt 🍜",
        emoji: "🍜",
    },
    {
        icon: NoodleIcon2,
        title: "Mie Ayam Lockyy",
        location: "",
        note: "Trust the process, ini enak 🍜",
        emoji: "🍜",
    },
    {
        icon: PadangIcon,
        title: "Nasi Padang Sederhana",
        location: "Cirendeu",
        note: "Sumpah sebagai orang minang itu masuk kriteria gue shitt 🤤",
        emoji: "🍛",
    },
];

export default function RekomSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section id="rekom" className="section rekom-section" ref={ref}>
            <motion.div
                className="rekom-container"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <div className="section-header">
                    <h2 className="section-title">
                        List Rekom Note 📝
                        <span className="underline" />
                    </h2>
                    <p className="section-subtitle">Dari kamu buat aku sama Tawes 🍽️</p>
                </div>

                <motion.p
                    className="rekom-intro-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    &quot;Nih rekomen guaaa lu harus cobain&quot; 😤👇
                </motion.p>

                <div className="rekom-zigzag-list">
                    {recommendations.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                className={`rekom-card ${isLeft ? "rekom-left" : "rekom-right"}`}
                                initial={{ opacity: 0, x: isLeft ? -80 : 80, y: 20 }}
                                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                            >
                                {/* Animated Vector Icon */}
                                <motion.div
                                    className="rekom-icon"
                                    animate={{
                                        y: [0, -8, 0],
                                        rotate: [0, isLeft ? 5 : -5, 0],
                                    }}
                                    transition={{
                                        duration: 2 + i * 0.3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <item.icon />
                                </motion.div>

                                {/* Text Content */}
                                <div className="rekom-text">
                                    <div className="rekom-title-row">
                                        <span className="rekom-number">{i + 1}</span>
                                        <h3 className="rekom-title">{item.title}</h3>
                                    </div>
                                    {item.location && (
                                        <span className="rekom-location">📍 {item.location}</span>
                                    )}
                                    <p className="rekom-note">{item.note}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
