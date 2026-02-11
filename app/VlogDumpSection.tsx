"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VlogVideo {
    id: string;
    url: string;
    filename: string;
    caption?: string; // Added caption per video
}

interface VlogDumpSectionProps {
    onPlay: () => void;
    onStop: () => void;
}

// Map specific filenames to captions for pinpoint accuracy
const filenameToCaption: Record<string, string> = {
    "video baru 3.mov": "nah kalo ini pas waktu aku sempro, pas disini kita ga sempro bareng, karena kamu udah duluan, hehe.",
    "video baru 1.MP4": "nah kalo yang ini, pas waktu aku lagi bikinin hadiah buat sidang kamuu bareng sama tawes jugaa, kayaknya si tawes ini selalu ada dehh setiap aku ngerencanain sesuatu, pasti dia ngintil mulu, hahahaaa",
    "video baru 2.MP4": "ini momen wah banget sih karena aku seneng banget ternyata surprise aku berhasil yeeyy 🎺 ganyangka bgtt taugasihh kamu sampe nangis kek gituu, semoga surprise kamu di ultah ke 24 ini berhasil juga yaa",
};

// Fallback captions for the rest of the videos
const defaultCaptions = [
    "ini kita lagi bikin trend tiktok ala-ala, mana pas itu kamu lagi ada kelas juga, huhu. jadi kita pakpikpuk bangett, tapi seru kokkk.",
    "ini kita lagi gabut nunggu di kelas, lagi nunggu shooting HKP",
    "ini kita masih di aeon, lanjut bikin trend tiktok lagi",
    "trend tiktok (lagi), kita banyak ya ternyata bikin trend tiktok, wkwk.",
    "inget ga sii zii yang inii? ini pas kita lagi di bandung,, bareng si itu jugalohh, (gaada maksud apa-apa yaa, hehe)",
    "ini kita lagi di perpus buat shooting HKP, btw ini suaranya kecil bgtt gaboleh berisik soalnya",
    "nemenin kamu sidang",
    "Eh, ini ternyata masuk juga ya ke dalem video kenangan?? Sorry-sorry zii kepencet, hehee 😅",
    "Farewell kamu mau pulkam :’)",
    "ini aku lagi bikin video buat laporan ke keluarga, wkwk.",
    "jogging di GBK lagi yukk…",
    "Seru banget tauu kalo kita lagi ngevlog kayak ginii"
];

export default function VlogDumpSection({ onPlay, onStop }: VlogDumpSectionProps) {
    const [videos, setVideos] = useState<VlogVideo[]>([]);
    const [playingVideo, setPlayingVideo] = useState<VlogVideo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch("/api/vlogs")
            .then((res) => res.json())
            .then((data) => {
                let dump: VlogVideo[] = data.dump || [];

                // 1. Identify "baru" videos
                const v3 = dump.find(v => v.filename === "video baru 3.mov");
                const v1 = dump.find(v => v.filename === "video baru 1.MP4");
                const v2 = dump.find(v => v.filename === "video baru 2.MP4");

                // 2. Identify and SORT "others" alphabetically to keep original caption mapping
                let others = dump.filter(v =>
                    v.filename !== "video baru 3.mov" &&
                    v.filename !== "video baru 1.MP4" &&
                    v.filename !== "video baru 2.MP4"
                ).sort((a, b) => a.filename.localeCompare(b.filename));

                // 3. Map original captions to 'others'
                const othersWithCaptions = others.map((v, i) => ({
                    ...v,
                    caption: defaultCaptions[i] || "Captured moment... ✨"
                }));

                // 4. Map new captions to 'baru' videos
                const v3WithCaption = v3 ? { ...v3, caption: filenameToCaption[v3.filename] } : null;
                const v1WithCaption = v1 ? { ...v1, caption: filenameToCaption[v1.filename] } : null;
                const v2WithCaption = v2 ? { ...v2, caption: filenameToCaption[v2.filename] } : null;

                // 5. Build final order
                const finalOrder: VlogVideo[] = [];
                if (v3WithCaption) finalOrder.push(v3WithCaption);
                finalOrder.push(...othersWithCaptions);
                if (v1WithCaption) finalOrder.push(v1WithCaption);
                if (v2WithCaption) finalOrder.push(v2WithCaption);

                setVideos(finalOrder);
            })
            .catch(console.error);
    }, []);

    const handlePlay = (video: VlogVideo) => {
        setPlayingVideo(video);
        setIsPlaying(true);
        onPlay();
    };

    const handleClose = () => {
        setPlayingVideo(null);
        setIsPlaying(false);
        onStop();
    };

    const handleNext = (e: any) => {
        e && e.stopPropagation && e.stopPropagation();
        if (!playingVideo) return;
        const idx = videos.findIndex((v) => v.id === playingVideo.id);
        const next = videos[(idx + 1) % videos.length];
        setPlayingVideo(next);
        setIsPlaying(true);
    };

    const handlePrev = (e: any) => {
        e && e.stopPropagation && e.stopPropagation();
        if (!playingVideo) return;
        const idx = videos.findIndex((v) => v.id === playingVideo.id);
        const prev = videos[(idx - 1 + videos.length) % videos.length];
        setPlayingVideo(prev);
        setIsPlaying(true);
    };

    return (
        <section id="vlog-dump" className="section vlog-section">
            <div className="vlog-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >

                    <div className="vlog-content">
                        <div className="vlog-scroll-container">
                            {videos.length > 0 ? (
                                <div className="vlog-dump-track">
                                    {videos.map((video) => (
                                        <motion.div
                                            key={video.id}
                                            className="vlog-card dump"
                                            whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handlePlay(video)}
                                        >
                                            <div className="video-thumbnail-wrapper-vertical">
                                                <video
                                                    src={video.url + "#t=0.5"}
                                                    className="video-thumbnail-vertical"
                                                    preload="metadata"
                                                    muted
                                                />
                                                <div className="play-overlay-small">▶</div>
                                            </div>
                                            <span className="vlog-info">{video.caption}</span>

                                            {/* Aesthetic Tap Badges moved below text */}
                                            <div className="vlog-tap-badges">
                                                <span className="tap-badge-white">Tap to Play</span>
                                                <span className="tap-badge-pink">✨</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-msg">No vlog dumps yet!</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {playingVideo && (
                    <motion.div
                        className="video-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    >
                        <motion.div
                            className="custom-player-wrapper"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                ref={videoRef}
                                src={playingVideo.url}
                                className="custom-video-element"
                                playsInline
                                autoPlay
                                loop
                                onClick={() => setIsPlaying(!isPlaying)}
                            />

                            {/* Modal Caption */}
                            <div className="modal-caption-overlay">
                                {playingVideo.caption}
                            </div>

                            <div
                                className={`player-controls ${isPlaying ? 'faded' : ''}`}
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                <button className="control-btn" onClick={handlePrev}>⏮</button>
                                <div className="center-controls">
                                    {!isPlaying && <div className="play-center-indicator">▶</div>}
                                    <button className="control-btn close-btn-main" onClick={handleClose}>Close ✖</button>
                                </div>
                                <button className="control-btn" onClick={handleNext}>⏭</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
