import { useState } from "react";
import { motion } from "framer-motion";

export default function BirthdayCard24() {
    const [isFlipped, setIsFlipped] = useState(false);

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
            <div style={{ perspective: "1000px", width: "100%", maxWidth: "500px" }}>
                <motion.div
                    onClick={() => setIsFlipped(!isFlipped)}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                        transformStyle: "preserve-3d",
                        position: "relative",
                        cursor: "pointer",
                        width: "100%"
                    }}
                >
                    {/* ─── FRONT FACE ─── */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '25px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        border: '4px solid #F8BBD0', // Pink pastel outline
                        width: '100%',
                        textAlign: 'center',
                        backfaceVisibility: "hidden",
                        position: "relative", // For Tap Me positioning if needed
                        zIndex: 2,
                        minHeight: "400px" // Ensure height consistency if content varies
                    }}>
                        {/* ─── TEXT ─── */}
                        <h2 style={{
                            fontFamily: 'var(--font-patrick)',
                            fontSize: '1.8rem',
                            color: '#C2185B',
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}>
                            Selamat Ulang Tahun ke 24! Zia!
                        </h2>

                        {/* ─── IMAGE ─── */}
                        <div style={{
                            borderRadius: '15px',
                            overflow: 'hidden',
                            lineHeight: 0,
                            marginBottom: '-60px',
                            marginTop: '-50px',
                            position: 'relative',
                            zIndex: 1,
                        }}>
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

                        {/* Tap Me Hint - Moved to bottom of card */}
                        <motion.div
                            initial={{ opacity: 0.5, y: 0 }}
                            animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{
                                display: 'inline-block',
                                marginTop: '15px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                padding: '4px 12px',
                                borderRadius: '15px',
                                fontSize: '0.75rem',
                                color: '#C2185B',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                pointerEvents: 'none',
                                border: '1px solid #F8BBD0',
                                zIndex: 10
                            }}
                        >
                            Tap me ✨
                        </motion.div>
                    </div>

                    {/* ─── BACK FACE ─── */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: '25px',
                        border: '4px solid #F8BBD0',
                        overflow: 'hidden',
                        background: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/mee/mee.png"
                            alt="Zia full card"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
