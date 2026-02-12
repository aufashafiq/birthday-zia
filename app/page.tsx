"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import MemoryModal from "./MemoryModal";
import CinematicVlogSection from "./CinematicVlogSection";
import DumpTitleSection from "./DumpTitleSection";
import VlogDumpSection from "./VlogDumpSection";
import RekomSection from "./RekomSection";
import LetterSection from "./LetterSection";
import HugSection from "./components/HugSection";
import RainEffect from "./components/RainEffect";
import DestinationsSection from "./components/DestinationsSection";
import BTSSection from "./components/BTSSection";
import HoldButton from "./components/HoldButton";
import UnicornWishes from "./components/UnicornWishes";
import BirthdayCard24 from "./components/BirthdayCard24";
import FavoritesSection from "./components/FavoritesSection";

// Types
interface MemoryEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  images: string[];
}



const bannerLetters = ["H", "A", "P", "P", "Y", " ", "B", "D", "A", "Y", "!"];

const sections = [
  { id: "hero", label: "Home" },
  { id: "intro", label: "Note" },
  { id: "memories", label: "Memories" },
  { id: "cinematic-vlog", label: "Vlog" },
  { id: "vlog-dump-title", label: "Dump" },
  { id: "rekom", label: "Rekom" },
  { id: "destinations", label: "Destinations" },
  { id: "favorites", label: "Favorites" },
  { id: "finale", label: "Finale" },
];

// Random rotation for polaroids
const rotations = [-4, 2, -2, 3, -3, 1, -1, 4, -2, 3, -4, 2, -1, 3, -3, 1];

export default function BirthdayScrapbook() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isPlaying, setIsPlaying] = useState(false);

  const [confetti, setConfetti] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    type?: 'fall' | 'firework';
    dx?: string;
    dy?: string;
  }>>([]);
  const [memories, setMemories] = useState<MemoryEvent[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryEvent | null>(null);
  const [wasPlayingBeforeVlog, setWasPlayingBeforeVlog] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [overlayStep, setOverlayStep] = useState<'intro' | 'hold'>('intro');
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(console.error);
    }
    setOverlayStep('hold');
  };

  const triggerExplosion = (x: number, y: number) => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
    const newParticles: typeof confetti = [];

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 300; // Distance to travel
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: x,
        y: y,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'firework',
        dx: `${tx}px`,
        dy: `${ty}px`
      });
    }

    setConfetti(prev => [...prev, ...newParticles]);
  };

  const handleReveal = () => {
    setIsFlashing(true);

    // Sync with flash phase
    setTimeout(() => {
      setIsPlaying(true);
      setShowOverlay(false);

      // Initial Center Explosion
      triggerExplosion(window.innerWidth / 2, window.innerHeight / 2);

      // Random explosions
      const count = 5;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const rx = Math.random() * window.innerWidth;
          const ry = Math.random() * (window.innerHeight * 0.8);
          triggerExplosion(rx, ry);
        }, i * 300);
      }

      // Also trigger falling confetti
      triggerConfetti();
      setTimeout(triggerConfetti, 1000);

      // Clear all after a while
      setTimeout(() => setConfetti([]), 4000);
    }, 150); // Small wait to let flash build up

    // Clear flash after animation finishes
    setTimeout(() => setIsFlashing(false), 1500);
  };

  // No more auto-play useEffect needed since we use the overlay


  const handleVlogPlay = () => {
    if (audioRef.current && !audioRef.current.paused) {
      setWasPlayingBeforeVlog(true);
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setWasPlayingBeforeVlog(false);
    }
  };

  const handleVlogStop = () => {
    if (wasPlayingBeforeVlog && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  // Fetch memories data
  useEffect(() => {
    fetch("/api/memories")
      .then((res) => res.json())
      .then((data) => {
        setMemories(data.memories || []);
        setProfilePicture(data.profilePicture || null);
      })
      .catch(console.error);
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Audio control
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Navigate to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Confetti explosion (falling)
  const triggerConfetti = () => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
    const newConfetti: typeof confetti = [];

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'fall'
      });
    }

    setConfetti(prev => [...prev, ...newConfetti]);
  };

  const handleNextMemory = () => {
    if (!selectedMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % memories.length;
    setSelectedMemory(memories[nextIndex]);
  };

  const handlePrevMemory = () => {
    if (!selectedMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
    setSelectedMemory(memories[prevIndex]);
  };

  return (
    <>
      {/* Grid Background */}
      <div className="scrapbook-bg" />

      {/* Flashbang transition */}
      {isFlashing && <div className="flash-overlay" />}

      {/* Cinematic Rain Effect */}
      <RainEffect isLetterOpen={letterOpen} />

      {/* Opening Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="opening-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="opening-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {overlayStep === 'intro' ? (
                <>
                  <h1 className="opening-title">For Zia ✨</h1>
                  <p className="opening-subtitle">A little surprise for you...</p>
                  <button className="opening-btn" onClick={handleStart}>
                    Open 💌
                  </button>
                </>
              ) : (
                <HoldButton onComplete={handleReveal} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (hidden until opened or behind overlay) */}
      <div style={{ opacity: showOverlay ? 0 : 1, transition: 'opacity 1s ease 0.5s' }}>


        {/* Audio */}
        <audio ref={audioRef} src="/birthday-music.mp3" loop />

        {/* Dot Navigation */}
        {!letterOpen && (
          <nav className="dot-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`dot ${activeSection === section.id ? "active" : ""}`}
                onClick={() => scrollToSection(section.id)}
                aria-label={section.label}
              >
                <span className="dot-label">{section.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Audio Player */}
        {!letterOpen && (
          <button className="audio-player" onClick={toggleAudio}>
            <span className="audio-icon">{isPlaying ? "🔊" : "🔇"}</span>
            <span className="audio-text">{isPlaying ? "Playing..." : "Play Music"}</span>
          </button>
        )}

        {/* ================== HERO SECTION ================== */}
        <section id="hero" className="section hero">
          <span className="deco-heart">❤️</span>
          <div className="deco-arrow" />
          <span className="deco-star">⭐</span>
          <div className="deco-pink-arrow" />

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Polaroid with real profile picture */}
            <motion.div
              className="polaroid"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{
                opacity: 1,
                rotate: [-3, -1, -3],
                y: [0, -10, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2 },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, rotate: 0 }}
            >
              <div className="polaroid-tape" />
              <div className="polaroid-image">
                {profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePicture}
                    alt="Nurul Fauzia Rusdi"
                    className="polaroid-photo"
                  />
                ) : (
                  <span style={{ fontSize: 80 }}>👩</span>
                )}
              </div>
              <span className="polaroid-caption">Nurul Fauzia Rusdi 🎀✨</span>
            </motion.div>

            {/* Text Content */}
            <div className="hero-text">
              <motion.div
                className="today-line"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="today-badge">Today</span>
                <span className="today-suffix">is your birthday</span>
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Happy<br />
                <span className="birthday">Birthday Zia</span>
              </motion.h1>

              <motion.div
                className="hero-name-line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <span className="hero-full-name">from your beloved best friend&lt;3</span>
              </motion.div>

              <motion.div
                className="quote-box"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="quote-text">
                  &quot;Another year of adventures, laughter, and making beautiful memories.&quot;
                </p>
              </motion.div>

              <motion.div
                className="hashtags"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="hashtag blue">#Celebration</span>
                <span className="hashtag pink">#Memories</span>
                <span className="hashtag yellow">#ziaultah</span>
                <span className="hashtag purple">#ngucapintelat</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="scroll-indicator">↓</div>
        </section>

        {/* ================== INTRO SECTION ================== */}
        <IntroSection />

        {/* ================== UNICORN WISHES SECTION ================== */}
        <UnicornWishes />

        {/* ================== MEMORIES SECTION ================== */}
        <MemoriesSection memories={memories} onSelectMemory={setSelectedMemory} />

        {/* ================== CUTE BEST VLOG SECTION ================== */}
        <CinematicVlogSection onPlay={handleVlogPlay} onStop={handleVlogStop} />

        {/* ================== VLOG DUMP TITLE SECTION ================== */}
        <DumpTitleSection />

        {/* ================== VLOG DUMP VIDEOS SECTION ================== */}
        <VlogDumpSection onPlay={handleVlogPlay} onStop={handleVlogStop} />

        {/* ================== REKOM NOTE SECTION ================== */}
        <RekomSection />

        {/* ================== DESTINATIONS SECTION ================== */}
        <DestinationsSection />

        {/* ================== FAVORITES SECTION ================== */}
        <FavoritesSection />

        {/* ================== FINALE SECTION ================== */}
        <section id="finale" className="section finale" onClick={triggerConfetti}>
          <motion.h2
            className="finale-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The End
          </motion.h2>

          <motion.p
            className="finale-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            OF THE PAGE, NOT THE FUN!
          </motion.p>

          <motion.div
            className="banner-container"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* String */}
            <div className="banner-string">
              <svg viewBox="0 0 500 40" preserveAspectRatio="none">
                <path
                  d="M 0 5 Q 125 35, 250 5 T 500 5"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Cards */}
            <div className="banner-cards">
              {bannerLetters.map((letter, i) => (
                letter === " " ? (
                  <div key={i} style={{ width: "20px" }} />
                ) : (
                  <motion.div
                    key={i}
                    className="banner-card"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  >
                    {letter}
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>

          <motion.p
            className="tap-hint"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            ✨( tap the lights )✨
          </motion.p>

          <p className="footer">HANDCRAFTED WITH ❤️</p>
        </section>

        {/* Confetti */}
        {confetti.length > 0 && (
          <div className="confetti-container">
            {confetti.map((piece) => (
              <div
                key={piece.id}
                className={piece.type === 'firework' ? "firework" : "confetti"}
                style={
                  piece.type === 'firework'
                    ? {
                      left: piece.x,
                      top: piece.y,
                      backgroundColor: piece.color,
                      ["--dx" as string]: piece.dx,
                      ["--dy" as string]: piece.dy,
                    }
                    : {
                      left: piece.x,
                      top: piece.y,
                      backgroundColor: piece.color,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }
                }
              />
            ))}
          </div>
        )}

        {/* ====== LETTER SECTION (FINAL ACT) ====== */}
        <LetterSection
          onLetterOpen={() => {
            // Pause birthday music when letter opens
            if (audioRef.current && !audioRef.current.paused) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
            setLetterOpen(true);
          }}
          onLetterClose={() => setLetterOpen(false)}
        />



        {/* ================== UNICORN WISHES SECTION ================== */}
        {!letterOpen && <HugSection />}

        {/* ================== BTS SECTION ================== */}
        {!letterOpen && <BTSSection />}



        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onNextMemory={handleNextMemory}
          onPrevMemory={handlePrevMemory}
        />
      </div>
    </>
  );
}

// Intro Section Component
function IntroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="intro" className="section" ref={ref}>
      <div className="intro">
        <motion.span
          className="note-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          NOTE TO: YOU
        </motion.span>

        <motion.p
          className="intro-text"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Today we celebrate the most <span className="highlight-pink">amazing</span> person
          — full of love, kindness, and <span className="highlight-blue">endless joy!</span>
        </motion.p>

        {/* Birthday Card with Image */}
        <BirthdayCard24 />
      </div>
    </section>
  );
}

// Dynamic Memories Section
function MemoriesSection({
  memories,
  onSelectMemory,
}: {
  memories: MemoryEvent[];
  onSelectMemory: (m: MemoryEvent) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="memories" className="section memories-section-dynamic" ref={ref}>
      <div className="memories">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Memories
            <span className="underline" />
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Captured moments in time 📸
          </motion.p>
        </div>

        <div className="memories-grid-dynamic">
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              className={`memory-card-dynamic ${memory.images.length > 2 ? "stack-3" : memory.images.length === 2 ? "stack-2" : ""
                }`}
              style={{ ["--rotation" as string]: `${rotations[i % rotations.length]}deg` }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              onClick={() => onSelectMemory(memory)}
            >
              <div className="memory-tape" />
              <div className="memory-image-dynamic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.images[0]}
                  alt={memory.title}
                  className="memory-photo"
                  loading={i < 6 ? "eager" : "lazy"}
                  fetchPriority={i < 6 ? "high" : "auto"}
                  decoding={i < 6 ? "sync" : "async"}
                />
              </div>
              <div className="memory-info">
                <span className="memory-title">{memory.title}</span>
                <span className="memory-date">{memory.date}</span>
              </div>
              {memory.images.length > 1 && (
                <span className="memory-count">{memory.images.length} 📷</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
