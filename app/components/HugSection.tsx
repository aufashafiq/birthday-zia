"use client";

import { motion } from "framer-motion";

const CapybaraUnicornSVG = () => (
    <svg width="280" height="250" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        {/* Soft Shadow Base */}
        <ellipse cx="150" cy="240" rx="100" ry="15" fill="#000" opacity="0.1" />

        {/* ─── UNICORN (Left, hugging) ─── */}
        <motion.g id="unicorn" initial={{ y: 0 }} animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            {/* Body: Fluffy Cloud Shape (Reverted to cute/chubby) */}
            <path d="M80 140 C80 100 110 80 140 80 C170 80 190 100 190 130 C190 180 170 230 130 230 C90 230 80 190 80 140 Z" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="3" />

            {/* Chubby Cheeks Blush */}
            <ellipse cx="110" cy="155" rx="8" ry="5" fill="#FF80AB" opacity="0.4" />
            <ellipse cx="160" cy="155" rx="8" ry="5" fill="#FF80AB" opacity="0.4" />

            {/* Happy Closed Eyes ^ ^ */}
            <path d="M100 145 Q110 135 120 145" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
            <path d="M150 145 Q160 135 170 145" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />

            {/* Tiny Smile */}
            <path d="M130 160 Q135 165 140 160" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />

            {/* Horn - Prominent Gold & Bigger */}
            <path d="M135 80 L125 35 L145 35 Z" fill="#FFD700" stroke="#FBC02D" strokeWidth="2" />
            <path d="M125 35 L145 35" stroke="#FBC02D" strokeWidth="2" />
            <path d="M135 75 L135 40" stroke="#FFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

            {/* Rainbow Mane - CUTE & PASTEL */}
            <path d="M100 85 Q80 100 75 130" stroke="#FF80AB" strokeWidth="12" strokeLinecap="round" />
            <path d="M115 80 Q95 95 90 125" stroke="#80D8FF" strokeWidth="12" strokeLinecap="round" />
            <path d="M130 78 Q115 90 110 120" stroke="#B388FF" strokeWidth="12" strokeLinecap="round" />
        </motion.g>

        {/* ─── CAPYBARA (Right, hugging back) ─── */}
        <motion.g id="capybara" initial={{ y: 0 }} animate={{ y: [0, -2, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}>
            {/* Body: Typical Capy Loaf Shape (Reverted to CHONKY/BEAN shape) */}
            <path d="M160 120 C160 90 190 90 220 90 C260 90 270 120 270 160 C270 210 250 230 210 230 C180 230 160 200 160 160 Z" fill="#C68E68" />

            {/* Ears */}
            <circle cx="180" cy="95" r="10" fill="#C68E68" />
            <circle cx="250" cy="95" r="10" fill="#C68E68" />
            <circle cx="180" cy="95" r="5" fill="#5D4037" />
            <circle cx="250" cy="95" r="5" fill="#5D4037" />

            {/* Chill Face -__- */}
            <circle cx="200" cy="135" r="3" fill="#3E2723" />
            <circle cx="240" cy="135" r="3" fill="#3E2723" />

            {/* CUTE SNOUT (Soft Rounded Rectangle) */}
            <rect x="205" y="145" width="28" height="16" rx="6" fill="#A1887F" />

            {/* Y-shaped Nose (Classic Capy) */}
            <path d="M211 148 L219 148" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" /> {/* Top bar */}
            <path d="M225 148 L233 148" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" /> {/* Top bar right */}
            <path d="M219 148 L219 153" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" /> {/* Nostril left */}
            <path d="M225 148 L225 153" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" /> {/* Nostril right */}

            {/* Citrus fruit (Yuzu) on head - BIGGER */}
            <g transform="rotate(10 220 85)">
                <circle cx="220" cy="85" r="14" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="1.5" />
                <path d="M220 71 L220 78" stroke="#558B2F" strokeWidth="3" />
                <path d="M220 75 L226 77" stroke="#558B2F" strokeWidth="3" />
            </g>
        </motion.g>

        {/* ─── HUGGING ARMS (Interactive Layer) ─── */}
        {/* Unicorn Arm around Capy */}
        <path
            d="M85 160 Q100 180 180 175"
            stroke="#FAFAFA" strokeWidth="18" strokeLinecap="round"
        />
        <path // Outline for arm
            d="M85 160 Q100 180 180 175"
            stroke="#E5E7EB" strokeWidth="20" strokeLinecap="round" style={{ zIndex: -1 }}
            strokeOpacity="0.5"
        />

        {/* Capy Arm around Unicorn */}
        <path
            d="M260 160 Q240 180 120 175"
            stroke="#C68E68" strokeWidth="18" strokeLinecap="round"
        />

        {/* Floating Hearts */}
        <motion.g
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -60, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        >
            <text x="140" y="110" fontSize="28">💖</text>
        </motion.g>
        <motion.text
            x="170" y="90" fontSize="20"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
        >
            ✨
        </motion.text>
    </svg>
);

export default function HugSection() {
    return (
        <section className="section hug-section">
            <motion.div
                className="hug-container"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.div
                    className="hug-frame"
                    initial={{ rotate: -2 }}
                    whileHover={{ scale: 1.02, rotate: 0 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                >
                    <div className="hug-image-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
                        {/* Sticker effect applied to the SVG container */}
                        <div className="sticker-effect">
                            <CapybaraUnicornSVG />
                        </div>
                    </div>
                    <div className="hug-tape" />
                </motion.div>

                <motion.div
                    className="hug-content"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h2 className="hug-title">Sending You a Big Hug! 🤗</h2>
                    <p className="hug-subtitle">Because you deserve all the love today and every day.</p>
                </motion.div>
            </motion.div>

            {/* Background elements */}
            <div className="hug-deco deco-heart-1">❤️</div>
            <div className="hug-deco deco-heart-2">🎀</div>
            <div className="hug-deco deco-star-1">✨</div>
        </section>
    );
}
