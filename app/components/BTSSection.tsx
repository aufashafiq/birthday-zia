"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BTSSection() {
    return (
        <section id="bts-section" className="section bts-section">
            <div className="bts-container">
                <motion.div
                    className="bts-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="section-title bts-title">Behind The Scenes 🎬</h2>

                    <div className="bts-gallery">
                        <motion.div
                            className="bts-polaroid"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="bts-image-wrapper">
                                <Image
                                    src="/BTS/IMG_6355.jpg"
                                    alt="Behind the scenes thinking"
                                    width={400}
                                    height={500}
                                    className="bts-image"
                                />
                            </div>
                            <div className="bts-tape"></div>
                        </motion.div>
                    </div>

                    <div className="bts-text-container">
                        <p className="bts-text-main">
                            Percaya gaa zii?? ini kita bikinnya semingguan lohh aku sama tawes, hehee.
                            Semoga kamu suka yaa 🫂
                        </p>
                        <p className="bts-text-sub">
                            (Just a little peek at the chaos behind the crafting! 💻✨)
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
