"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VlogVideo {
    id: string;
    url: string;
    filename: string;
}

interface VlogSectionProps {
    onPlay: () => void;
    onStop: () => void;
}

export default function VlogSection({ onPlay, onStop }: VlogSectionProps) {
    const [videos, setVideos] = useState<{ cinematic: VlogVideo[]; dump: VlogVideo[] }>({
        cinematic: [],
        dump: [],
    });
    const [activeTab, setActiveTab] = useState<"cinematic" | "dump">("cinematic");
    const [playingVideo, setPlayingVideo] = useState<VlogVideo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetch("/api/vlogs")
            .then((res) => res.json())
            .then((data) => setVideos(data))
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
        const list = activeTab === "cinematic" ? videos.cinematic : videos.dump;
        const idx = list.findIndex((v) => v.id === playingVideo.id);
        const next = list[(idx + 1) % list.length];
        setPlayingVideo(next);
        setIsPlaying(true);
    };

    const handlePrev = (e: any) => {
        e && e.stopPropagation && e.stopPropagation();
        if (!playingVideo) return;
        const list = activeTab === "cinematic" ? videos.cinematic : videos.dump;
        const idx = list.findIndex((v) => v.id === playingVideo.id);
        const prev = list[(idx - 1 + list.length) % list.length];
        setPlayingVideo(prev);
        setIsPlaying(true);
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <section id="vlog" className="section vlog-section">
            <div className="vlog-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header Area */}
                    <div className="section-header" style={{ position: 'relative', zIndex: 50 }}>
                        <h2 className="section-title">
                            Our Vlog
                        </h2>
                        <br />
                        <span className="section-subtitle">Watch our favorite moments 🎥</span>

                        {/* Tab Switcher */}
                        <div className="vlog-tabs">
                            <button
                                className={`vlog-tab ${activeTab === "cinematic" ? "active" : ""}`}
                                onClick={() => setActiveTab("cinematic")}
                            >
                                ✨ Cinematic
                            </button>
                            <button
                                className={`vlog-tab ${activeTab === "dump" ? "active" : ""}`}
                                onClick={() => setActiveTab("dump")}
                            >
                                🎞️ Vlog Dump
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="vlog-content">
                        <AnimatePresence mode="wait">
                            {activeTab === "cinematic" ? (
                                <motion.div
                                    key="cinematic"
                                    className="vlog-grid cinematic-grid"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {videos.cinematic.length > 0 ? (
                                        videos.cinematic.map((video) => (
                                            <motion.div
                                                key={video.id}
                                                className="vlog-card cinematic"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handlePlay(video)}
                                            >
                                                <div className="video-thumbnail-wrapper">
                                                    <video
                                                        src={video.url + "#t=1"}
                                                        className="video-thumbnail"
                                                        preload="metadata"
                                                        muted
                                                    />
                                                    <div className="play-overlay">▶</div>
                                                </div>
                                                <span className="vlog-title">{video.filename.replace(/\.mp4$/i, "")}</span>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="empty-msg">No cinematic videos yet!</p>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="dump"
                                    className="vlog-sroll-container"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {videos.dump.length > 0 ? (
                                        <div className="vlog-dump-track">
                                            {videos.dump.map((video) => (
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Custom Video Player Modal - moved outside vlog-container and motion.div to ensure fixed positioning works */}
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

                            {/* Custom Controls Overlay */}
                            <div
                                className={`player-controls ${isPlaying ? 'faded' : ''}`}
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                <button className="control-btn" onClick={handlePrev}>
                                    ⏮
                                </button>

                                <div className="center-controls">
                                    {!isPlaying && <div className="play-center-indicator">▶</div>}
                                    <button className="control-btn close-btn-main" onClick={handleClose}>
                                        Close ✖
                                    </button>
                                </div>

                                <button className="control-btn" onClick={handleNext}>
                                    ⏭
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
