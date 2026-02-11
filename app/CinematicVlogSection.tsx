"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VlogVideo {
    id: string;
    url: string;
    filename: string;
}

interface CinematicVlogSectionProps {
    onPlay: () => void;
    onStop: () => void;
}

// Map specific filenames to custom thumbnails
const customThumbnails: Record<string, string> = {
    "DARI AKU BUAT KAMU ZI HEHE.MP4": "/images/dari_aku_cinematic_thumb.jpg"
};

export default function CinematicVlogSection({ onPlay, onStop }: CinematicVlogSectionProps) {
    const [videos, setVideos] = useState<VlogVideo[]>([]);
    const [playingVideo, setPlayingVideo] = useState<VlogVideo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch("/api/vlogs")
            .then((res) => res.json())
            .then((data) => setVideos(data.cinematic || []))
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
        <section id="cinematic-vlog" className="section vlog-section">
            <div className="vlog-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-header" style={{ position: 'relative', zIndex: 50 }}>
                        <h2 className="section-title">
                            Cute Best Vlog ✨
                        </h2>
                        <br />
                        <span className="section-subtitle">Our special cinematic moment 🎬</span>
                    </div>

                    <div className="vlog-content">
                        <div className="vlog-grid cinematic-grid">
                            {videos.length > 0 ? (
                                videos.map((video) => {
                                    const customThumbnail = customThumbnails[video.filename];
                                    return (
                                        <motion.div
                                            key={video.id}
                                            className="vlog-card cinematic"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePlay(video)}
                                        >
                                            <div className="video-thumbnail-wrapper">
                                                {customThumbnail ? (
                                                    <img
                                                        src={customThumbnail}
                                                        alt={video.filename}
                                                        className="video-thumbnail"
                                                        style={{ objectFit: 'contain', background: '#000' }}
                                                    />
                                                ) : (
                                                    <video
                                                        src={video.url + "#t=1"}
                                                        className="video-thumbnail"
                                                        preload="metadata"
                                                        muted
                                                    />
                                                )}
                                                <div className="play-overlay">▶</div>
                                            </div>
                                            <span className="vlog-title">{video.filename.replace(/\.mp4$/i, "")}</span>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="empty-msg">No cinematic videos yet!</p>
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
