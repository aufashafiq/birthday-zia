"use client";

import { motion } from "framer-motion";

interface WishData {
    text: string;
    image: string;
}

const WISHES: WishData[] = [
    { text: "Makin disayang semua orang! 💖", image: "final-sticker-1.png?v=1" },
    { text: "Wish you all the best! 🌟", image: "final-sticker-2.png?v=1" },
    { text: "Sehat selalu yaa! 🍎", image: "final-sticker-3.png?v=1" },
    { text: "Rezekinya lancar terus! 💸", image: "final-sticker-4.png?v=1" },
    { text: "Tetep jadi Zia yang seru! 🤪", image: "final-sticker-5.png?v=1" },
    { text: "Happy Level Up! 🎂", image: "final-sticker-6.png?v=1" },
    { text: "Semoga makin bahagia! ✨", image: "final-sticker-7.png?v=1" }
];

export default function UnicornWishes() {
    return (
        <section className="section unicorn-wishes-section">
            <div className="wishes-container">
                <motion.h2
                    className="wishes-title"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ marginBottom: '40px' }}
                >
                    The Squad Wishes You! 🦄✨
                </motion.h2>

                {/* ZigZag Layout */}
                <div className="wishes-zigzag-container">
                    {WISHES.map((wish, i) => (
                        <motion.div
                            key={i}
                            className={`wish-card-zigzag ${i % 2 === 0 ? 'left' : 'right'}`}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            {/* Speech Bubble */}
                            <div
                                className={`speech-bubble-readable ${i % 2 === 0 ? 'tail-bottom-right' : 'tail-bottom-left'}`}
                                style={{ zIndex: 10, position: 'relative' }} // Ensure text is above sticker
                            >
                                {wish.text}
                            </div>

                            {/* Unicorn Sticker Image with Animation */}
                            <motion.div
                                className="unicorn-sticker-wrapper"
                                animate={{
                                    y: [0, -8, 0],
                                    rotate: [0, i % 2 === 0 ? 2 : -2, 0]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`/${wish.image}`}
                                    alt="Unicorn Wish"
                                    className="unicorn-sticker-img"
                                    style={{
                                        transform: i % 2 !== 0 ? 'scaleX(-1)' : 'none'
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorations */}
            <div className="wishes-bg-deco cloud-1">☁️</div>
            <div className="wishes-bg-deco cloud-2">☁️</div>
            <div className="wishes-bg-deco star-1">✨</div>
            <div className="wishes-bg-deco star-2">✨</div>
        </section>
    );
}
