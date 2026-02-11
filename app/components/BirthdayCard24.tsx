"use client";

import { motion } from "framer-motion";

export default function BirthdayCard24() {
    return (
        <motion.div
            className="birthday-card-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '4px solid #F8BBD0', // Pink pastel outline
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center'
            }}>
                {/* ─── TEXT ─── */}
                <h2 style={{
                    fontFamily: 'var(--font-patrick)',
                    fontSize: '1.8rem',
                    color: '#C2185B',
                    marginBottom: '10px', // Reduced from 20px
                    fontWeight: 'bold'
                }}>
                    Selamat Ulang Tahun ke 24! Zia!
                </h2>

                {/* ─── IMAGE ─── */}
                <div style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    lineHeight: 0,
                    marginBottom: '-60px', // Aggressive negative margin for bottom
                    marginTop: '-50px',    // Aggressive negative margin for top
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Placeholder for the user's attached image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/unicorn-24-v2.png?v=8"
                        alt="Unicorns 24"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0px' }}>
                    Another year more wonderful! ✨
                </p>
            </div>
        </motion.div>
    );
}
