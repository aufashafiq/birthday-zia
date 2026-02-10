"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import MemoryModal from "./MemoryModal";
import CinematicVlogSection from "./CinematicVlogSection";
import DumpTitleSection from "./DumpTitleSection";
import VlogDumpSection from "./VlogDumpSection";
import RekomSection from "./RekomSection";
import LetterSection from "./LetterSection";

// Types
interface MemoryEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  images: string[];
}

// Pencil data with names and colors
const pencils = [
  { name: "Alex", color: "#ef4444", message: "Happy birthday! Wishing you all the happiness in the world. May your day be filled with love and laughter! 🎂" },
  { name: "James", color: "#f97316", message: "To an amazing person - may this year bring you everything you've dreamed of! Have a wonderful day! 🎉" },
  { name: "Sarah", color: "#eab308", message: "Sending you the warmest birthday wishes! You deserve all the good things life has to offer! ✨" },
  { name: "Mike", color: "#22c55e", message: "Another year wiser! Hope your birthday is as incredible as you are. Cheers to you! 🥳" },
  { name: "Emma", color: "#14b8a6", message: "Happy Birthday! May your day be sprinkled with joy and your year be filled with blessings! 💕" },
  { name: "David", color: "#3b82f6", message: "Wishing you a day filled with sweet moments and beautiful memories. Happy Birthday! 🌟" },
  { name: "Lisa", color: "#6366f1", message: "To someone who makes the world brighter - Happy Birthday! Keep shining! ✨" },
  { name: "Ryan", color: "#8b5cf6", message: "May all your birthday wishes come true! Have an amazing celebration! 🎁" },
  { name: "Sophie", color: "#a855f7", message: "Happy Birthday! Here's to another year of adventures and happiness! 💫" },
  { name: "Chris", color: "#ec4899", message: "Wishing you the happiest of birthdays! May this year be your best one yet! 🎈" },
  { name: "Anna", color: "#f43f5e", message: "Happy Birthday to a truly wonderful person! Enjoy your special day! 💖" },
  { name: "Tom", color: "#06b6d4", message: "Another trip around the sun! Wishing you joy, love, and lots of cake! 🍰" },
  { name: "Nina", color: "#84cc16", message: "Happy Birthday! May your day be as special as you are to all of us! 🌈" },
  { name: "Ben", color: "#f59e0b", message: "To endless possibilities and beautiful moments - Happy Birthday! 🎊" },
];

const bannerLetters = ["H", "A", "P", "P", "Y", " ", "B", "D", "A", "Y", "!"];

const sections = [
  { id: "hero", label: "Home" },
  { id: "intro", label: "Note" },
  { id: "memories", label: "Memories" },
  { id: "cinematic-vlog", label: "Vlog" },
  { id: "vlog-dump-title", label: "Dump" },
  { id: "rekom", label: "Rekom" },
  { id: "wishes", label: "Wishes" },
  { id: "finale", label: "Finale" },
];

// Random rotation for polaroids
const rotations = [-4, 2, -2, 3, -3, 1, -1, 4, -2, 3, -4, 2, -1, 3, -3, 1];

export default function BirthdayScrapbook() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWish, setSelectedWish] = useState<typeof pencils[0] | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [memories, setMemories] = useState<MemoryEvent[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryEvent | null>(null);
  const [wasPlayingBeforeVlog, setWasPlayingBeforeVlog] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowOverlay(false);
          triggerConfetti();
        })
        .catch(console.error);
    } else {
      setShowOverlay(false);
    }
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

  // Confetti explosion
  const triggerConfetti = () => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
    const newConfetti = [];

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3000);
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
              <h1 className="opening-title">For Zia ✨</h1>
              <p className="opening-subtitle">A little surprise for you...</p>
              <button className="opening-btn" onClick={handleStart}>
                Open 💌
              </button>
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
              animate={{ opacity: 1, rotate: -3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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

        {/* ================== WISHES SECTION ================== */}
        <section id="wishes" className="section wishes">
          <motion.h2
            className="wishes-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ✏️ The Writing Desk
          </motion.h2>
          <motion.p
            className="wishes-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Click a pencil to read a birthday wish
          </motion.p>

          <motion.div
            className="pencil-desk"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {pencils.map((pencil, i) => (
              <motion.div
                key={pencil.name}
                className="pencil"
                onClick={() => setSelectedWish(pencil)}
                style={{ transform: `rotate(${(i - 7) * 3}deg)` }}
                whileHover={{ scale: 1.1, y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div
                  className="pencil-tip"
                  style={{ borderBottomColor: pencil.color }}
                />
                <div
                  className="pencil-body"
                  style={{ backgroundColor: pencil.color }}
                >
                  <span className="pencil-label">{pencil.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Wish Modal */}
          <AnimatePresence>
            {selectedWish && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWish(null)}
              >
                <motion.div
                  className="wish-modal"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="modal-close" onClick={() => setSelectedWish(null)}>×</button>
                  <h3 className="wish-modal-title">Message from {selectedWish.name}</h3>
                  <p className="wish-modal-text">{selectedWish.message}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

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
                className="confetti"
                style={{
                  left: piece.x,
                  top: piece.y,
                  backgroundColor: piece.color,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
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
              whileHover={{ rotate: 0, scale: 1.04, y: -8 }}
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
