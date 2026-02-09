"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VlogVideo {
    id: string;
    url: string;
    filename: string;
}

interface VlogDumpSectionProps {
    onPlay: () => void;
    onStop: () => void;
}

export default function VlogDumpSection({ onPlay, onStop }: VlogDumpSectionProps) {
    const [videos, setVideos] = useState<VlogVideo[]>([]);
    const [playingVideo, setPlayingVideo] = useState<VlogVideo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch("/api/vlogs")
            .then((res) => res.json())
            .then((data) => setVideos(data.dump || []))
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
                        <div className="vlog-sroll-container">
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
                                            <span className="vlog-info">Click to play</span>
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
