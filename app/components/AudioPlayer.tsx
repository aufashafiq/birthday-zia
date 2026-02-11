"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.25;
        }
    }, []);

    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                setHasInteracted(true);
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Autoplay blocked
                });
            }
        };

        document.addEventListener("click", handleFirstInteraction, { once: true });
        document.addEventListener("touchstart", handleFirstInteraction, { once: true });

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
        };
    }, [hasInteracted]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(console.error);
        }
    }, [isPlaying]);

    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="audio-control-corner">
            <audio
                ref={audioRef}
                src="/birthday-music.mp3"
                onEnded={handleEnded}
                preload="auto"
                loop
            />
            <button
                className={`audio-btn-corner ${isPlaying ? "playing" : ""}`}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {isPlaying ? "🔊" : "🔈"}
            </button>
        </div>
    );
}
