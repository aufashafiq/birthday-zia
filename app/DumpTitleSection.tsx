"use client";

import { motion } from "framer-motion";

export default function DumpTitleSection() {
    return (
        <section id="vlog-dump-title" className="section dump-title-section">
            <motion.div
                className="dump-title-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="dump-title-heading">
                    Vlog Dump 🎞️
                </h2>
                <p className="dump-title-tagline">
                    Random moments, big vibes ✌️
                </p>
                <motion.div
                    className="dump-title-deco"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    📹
                </motion.div>
            </motion.div>
        </section>
    );
}
