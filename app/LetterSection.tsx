"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Lora } from "next/font/google";

const lora = Lora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

// All 25 images from Inside Letter folder
const sourceImages = [
    "/Inside Letter/IMG_4944.JPG",
    "/Inside Letter/IMG_0165.JPG",
    "/Inside Letter/IMG_3965.JPG",
    "/Inside Letter/IMG_8509.JPG",
    "/Inside Letter/IMG_7105.jpg",
    "/Inside Letter/IMG_5770.JPG",
    "/Inside Letter/IMG_8637.JPG",
    "/Inside Letter/IMG_4825.JPG",
    "/Inside Letter/IMG_9188.JPG",
    "/Inside Letter/IMG_3230.JPG",
    "/Inside Letter/EDDB0187-5199-4E83-9DEB-0121E1C1E6F6.JPG",
    "/Inside Letter/IMG_5021.JPG",
    "/Inside Letter/8673ca5e-6582-482e-9db7-86edcd158f6b.JPG",
    "/Inside Letter/IMG_7106.jpg",
    "/Inside Letter/IMG_8857.JPG",
    "/Inside Letter/IMG_8516.JPG",
    "/Inside Letter/IMG_5655.JPG",
    "/Inside Letter/IMG_0248.JPG",
    "/Inside Letter/IMG_3964.JPG",
    "/Inside Letter/IMG_7104.jpg",
    "/Inside Letter/bd59ed70-31c3-4576-b443-d31c76ba0e63.jpg",
    "/Inside Letter/IMG_8505.JPG",
    "/Inside Letter/7b7bf997-c308-4c3a-8f09-c89b9e506aee.jpg",
    "/Inside Letter/dd403002-d7f5-4520-b1e4-89205e8a2de1.jpg",
    "/Inside Letter/be225832-44da-4e01-87d8-4139b5c9bf8b.jpg"
];

// Constants for typing speed/pauses
const SPEED_CONFIGS = {
    slow: { typing: 0.08, line: 0.8, pulse: 0.4 },
    normal: { typing: 0.035, line: 0.35, pulse: 0.2 },
    fast: { typing: 0.015, line: 0.15, pulse: 0.1 },
    veryFast: { typing: 0.005, line: 0.05, pulse: 0.02 }
};

type SpeedMode = keyof typeof SPEED_CONFIGS;

interface LetterSectionProps {
    onLetterOpen?: () => void;
    onLetterClose?: () => void;
}

/* ──────────────────────────────────────────────
   DATA STRUCTURE FOR CONTENT
   ────────────────────────────────────────────── */
type ContentItem =
    | { type: 'text', text: string, bold?: boolean }
    | { type: 'spacer', h: number }
    | { type: 'polaroid', src: string, rotate: number }
    | { type: 'strip', images: string[], rotate: number }
    | { type: 'rounded', src: string }
    | { type: 'closing', title: string, heart: string };

const letterContent: ContentItem[] = [
    { type: 'text', text: "ziii…", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "aku ngetik ini sambil mikir lamaaa 😭" },
    { type: 'text', text: "ini perlu ga ya sebenernya." },
    { type: 'text', text: "tapi kalo ga ditulis sekarang, aku tau aku bakal nyimpen ini terus," },
    { type: 'text', text: "dan ujung-ujungnya malah **ga pernah aku bilang**." },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[0], rotate: -2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "Jujur yaa zi…", bold: true },
    { type: 'text', text: "sampe sekarang aku tuh masih suka mikir," },
    { type: 'text', text: "**kok bisa sih kita sedeket ini?** padahal kalo dipikir-pikir, kita tuh deketnya di akhir-akhir kuliah." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "Pas semua orang lagi ribeeett," },
    { type: 'text', text: "lagi sibuk sama hidupnya masing-masing." },
    { type: 'spacer', h: 24 },
    { type: 'strip', images: [sourceImages[1], sourceImages[2], sourceImages[3]], rotate: -2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "kamu tuh **rameeee** bangett." },
    { type: 'text', text: "hyper aktif parahhh 😭 kayak energinya tuh **ga ada tombol off-nya**." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "kamu jugaa **lucuu**." },
    { type: 'text', text: "kamu **cantikkk** banget." },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[4], rotate: 2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "dan ihh entah kenapa yaa zi," },
    { type: 'text', text: "kamu tuh selalu bawa **positive vibes** ke mana-mana hehe✨🥹" },
    { type: 'spacer', h: 24 },
    { type: 'rounded', src: sourceImages[5] },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "tapi aku juga tau bangeett sisi kamu yang ini…" },
    { type: 'text', text: "kamu tuh **sensitiftt**." },
    { type: 'text', text: "**gampang nangiss**." },
    { type: 'text', text: "kadang cengeng juga" },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "kadang pas kamu nangis," },
    { type: 'text', text: "aku tuh pengen bilang," },
    { type: 'text', text: "'zii gapapa tau nangis…'", bold: true },
    { type: 'text', text: "tenang, ada akuu kok disini...", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "dan serius yaa, **nangis tuh ga bikin kamu lemah**." },
    { type: 'text', text: "sama sekali engga.", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'strip', images: [sourceImages[6], sourceImages[7], sourceImages[8]], rotate: 1 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "OIYAAA 😭", bold: true },
    { type: 'text', text: "aku tuh paling ngeh kalo kamu tuhh" },
    { type: 'text', text: "sukaaa BANGEEETTT makanan maniss.", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "banget.", bold: true },
    { type: 'text', text: "bangett 😭", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "nyatanyaaa ajaa," },
    { type: 'text', text: "kamu makan martabak manis" },
    { type: 'text', text: "sampe **DUA KOTAK SENDIRIAN ITU ABISS**," },
    { type: 'text', text: "gelokkk 😭🥹" },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[9], rotate: -1 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "sampe sekarang aku masih mikir," },
    { type: 'text', text: "kok bisa sih…", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "tapi yaaa…" },
    { type: 'text', text: "**itu kamu bangett** wkwk." },
    { type: 'spacer', h: 24 },
    { type: 'rounded', src: sourceImages[10] },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "kamu tuh **so sweet**," },
    { type: 'text', text: "tapi bukan sweet yang dibuat-buat." },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "bukan dari kata-kata doang," },
    { type: 'text', text: "tapi dari **sikap kamu** ke orang." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "kamu inget hal-hal kecil tentang temen kamu." },
    { type: 'text', text: "kamu dengerin cerita mereka." },
    { type: 'text', text: "kamu peduli, **beneran peduli**." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "makanya kamu tuh sering jadi tempat cerita." },
    { type: 'text', text: "tempat curhat." },
    { type: 'text', text: "tempat orang ngerasa **aman** 🫂🤍" },
    { type: 'spacer', h: 24 },
    { type: 'strip', images: [sourceImages[11], sourceImages[12], sourceImages[13]], rotate: -1 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "aku **sukaaaa BANGETTT**", bold: true },
    { type: 'text', text: "ngabadiin momen sama kamu." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "apalagi kalo kamu bikin vlog ala-ala gituu," },
    { type: 'text', text: "aku tuh langsung mikir," },
    { type: 'text', text: "'oh iyaa… ini bakal jadi kenangan.'", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "kita ngonten bareng." },
    { type: 'text', text: "vlog bareng." },
    { type: 'text', text: "ketawa ga jelas." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "dan pas kamu ngedit video-video lucu itu," },
    { type: 'text', text: "momen yang udah lewat" },
    { type: 'text', text: "kayak hidup lagi 🥹", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[14], rotate: 2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "jujur aja yaa zi," },
    { type: 'text', text: "kita tuh ga barengan lama, tapi rasanya **cepett klopp banget**, mungkin karena kita sering sepemikiran." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "walaupun yaaa…" },
    { type: 'text', text: "kadang ada berantem dikitt 😅" },
    { type: 'text', text: "ngambek dikitt." },
    { type: 'text', text: "ya namanya juga pertemanan kan," },
    { type: 'text', text: "pasti ada bumbu-bumbunya." },
    { type: 'spacer', h: 24 },
    { type: 'rounded', src: sourceImages[15] },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "sekarang kamu udah **24** yaaa 🎂" },
    { type: 'text', text: "ihh udah gede aja." },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "di umur ini aku doain banyak hal buat kamu.", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "semoga kamu **lebih hepi**." },
    { type: 'text', text: "lebih tenang." },
    { type: 'text', text: "lebih sayang sama diri sendiri.", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "semoga hal-hal baik" },
    { type: 'text', text: "dateng ke kamu satu-satu." },
    { type: 'text', text: "dan hal-hal berat" },
    { type: 'text', text: "pelan-pelan pergi 🤍", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'strip', images: [sourceImages[16], sourceImages[17], sourceImages[18]], rotate: -2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "abis kuliah tuh hidup emang **berubah banget** yaa…" },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "ketemu makin jarang." },
    { type: 'text', text: "waktu makin susah." },
    { type: 'text', text: "semuanya serba keburu-buru." },
    { type: 'text', text: "Makin sulit buat bagi waktu, karena kita udah cape sama kesulitan dan **struggle masing-masing**😢🤧" },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[19], rotate: -1 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "tapi kalo boleh jujur sepenuhnya…", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "aku tuh takut satu hal.", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "bukan kehilangan kamu." },
    { type: 'text', text: "bukan." },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "aku cuma takut," },
    { type: 'text', text: "kita jadi strangers…", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "padahal dulu sedeket ini.", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'rounded', src: sourceImages[20] },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "jadi kalo suatu hari nanti" },
    { type: 'text', text: "kita jarang ngobrol," },
    { type: 'text', text: "atau jarang ketemu…" },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "tolong yaa zi,", bold: true },
    { type: 'text', text: "kita tetep komunikasi.", bold: true },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "walaupun ga sering." },
    { type: 'text', text: "walaupun cuma sesekali." },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "dan kalo bisa," },
    { type: 'text', text: "tetep nyempetin ketemu.", bold: true },
    { type: 'text', text: "biar pas ketemu nanti," },
    { type: 'text', text: "kita ga canggung 🥺🤍", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'polaroid', src: sourceImages[21], rotate: 2 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "makasih yaa zi…", bold: true },
    { type: 'text', text: "beneran makasih.", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "makasih udah hadir di hidup aku." },
    { type: 'text', text: "makasih udah jadi sahabat yang aku banggain." },
    { type: 'text', text: "makasih udah selalu ada buat aku zii...", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "maaf kalo kadonya kurang." },
    { type: 'text', text: "maaf kalo aku bukan orang pertama" },
    { type: 'text', text: "yang ngucapin kamu tepat waktu." },
    { type: 'spacer', h: 12 },
    { type: 'text', text: "tapi doaku selalu nyusul.", bold: true },
    { type: 'text', text: "Setulus dari hatii akuuu hehee", bold: true },
    { type: 'spacer', h: 24 },
    { type: 'strip', images: [sourceImages[22], sourceImages[23], sourceImages[24]], rotate: 1 },
    { type: 'spacer', h: 24 },
    { type: 'text', text: "aku doain kamu sehat." },
    { type: 'text', text: "bahagia." },
    { type: 'text', text: "dikelilingi orang-orang baik.", bold: true },
    { type: 'spacer', h: 16 },
    { type: 'text', text: "dan semoga," },
    { type: 'text', text: "di hidup kamu nanti," },
    { type: 'text', text: "kamu selalu ngerasa dicintai…" },
    { type: 'text', text: "minimal, pernah." },
    { type: 'text', text: "dan aku adalah salah satunya🫶", bold: true },
    { type: 'spacer', h: 48 },
    { type: 'closing', title: "Happiest Birthday! 🎂", heart: "I Love You! ❤️" }
];

/* ──────────────────────────────────────────────
   SEQUENTIAL TYPING TEXT COMPONENT
   ────────────────────────────────────────────── */
const TypingText = ({
    text,
    className = "",
    bold = false,
    visibleCount = 0
}: {
    text: string;
    className?: string;
    bold?: boolean;
    visibleCount: number;
}) => {
    // Process markdown-like bold within segment
    const rawParts = text.split(/(\*\*.*?\*\*)/g);
    const segments: { text: string; isBold: boolean }[] = [];
    rawParts.forEach(part => {
        const isBoldPart = part.startsWith('**') && part.endsWith('**');
        const content = isBoldPart ? part.slice(2, -2) : part;
        if (content) segments.push({ text: content, isBold: isBoldPart || bold });
    });

    // Helper: Determine if a character at global index i should be rendered
    let globalCharIndex = 0;

    return (
        <span className={className} style={{ fontWeight: bold ? '700' : 'inherit' }}>
            {segments.map((seg, segIdx) => {
                return (
                    <span key={segIdx} className={seg.isBold ? "letter-bold" : ""}>
                        {Array.from(seg.text).map((char, charIdx) => {
                            const shouldShow = globalCharIndex < visibleCount;
                            globalCharIndex++; // Increment for next char

                            if (!shouldShow) return null;

                            return (
                                <span key={charIdx}>
                                    {char}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </span>
    );
};

/* ──────────────────────────────────────────────
   PHOTO / FRAME COMPONENTS (Now with delays)
   ────────────────────────────────────────────── */
const Polaroid = ({ src, rotate = 0, delay = 0 }: { src: string; rotate?: number; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
    >
        <motion.div
            className="letter-polaroid"
            animate={{
                y: [0, -12, 0],
                rotate: [rotate, rotate + 1.5, rotate - 1.5, rotate]
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ originX: 0.5, originY: 0.5 }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
        </motion.div>
    </motion.div>
);

const PhotoboothStrip = ({ images, rotate = 0, delay = 0 }: { images: string[]; rotate?: number; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
    >
        <motion.div
            className="letter-photobooth"
            animate={{
                y: [0, -10, 0],
                rotate: [rotate, rotate - 2, rotate + 2, rotate]
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ originX: 0.5, originY: 0.5 }}
        >
            <div className="letter-photobooth-images">
                {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="" loading="lazy" />
                ))}
            </div>
            <p className="letter-photobooth-label">memories</p>
        </motion.div>
    </motion.div>
);

const RoundedPhoto = ({ src, delay = 0 }: { src: string; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
    >
        <motion.div
            className="letter-rounded-photo"
            animate={{
                y: [0, -15, 0],
                rotate: [0, 1.2, -1.2, 0]
            }}
            transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ originX: 0.5, originY: 0.5 }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
        </motion.div>
    </motion.div>
);

/* ══════════════════════════════════════════════
   MAIN LETTER SECTION
   ══════════════════════════════════════════════ */
export default function LetterSection({ onLetterOpen, onLetterClose }: LetterSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const teaserRef = useRef(null);
    const teaserInView = useInView(teaserRef, { once: true, margin: "-100px" });

    // State for speed control
    const [speedMode, setSpeedMode] = useState<SpeedMode>("normal");

    // State for the typing engine
    const [progress, setProgress] = useState({ itemIndex: 0, charIndex: 0 });
    const progressRef = useRef({ itemIndex: 0, charIndex: 0 });

    // Cycle speeds: Slow -> Normal -> Fast -> Very Fast -> Slow
    const toggleSpeed = useCallback(() => {
        setSpeedMode(prev => {
            if (prev === "slow") return "normal";
            if (prev === "normal") return "fast";
            if (prev === "fast") return "veryFast";
            return "slow";
        });
    }, []);

    // ──────────────────────────────────────────────
    // THE TYPING ENGINE (Tick-based)
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;

        // DO NOT reset progress here, or it resets when speedMode changes.
        // Initialization is handled in handleOpen.

        let timer: NodeJS.Timeout;

        const processNext = () => {
            const { itemIndex, charIndex } = progressRef.current;
            const item = letterContent[itemIndex];

            // End of letter
            if (!item) return;

            // Get current speed config
            const config = SPEED_CONFIGS[speedMode];

            let delay = 0;
            let nextItemIdx = itemIndex;
            let nextCharIdx = charIndex;

            if (item.type === 'text') {
                // If we still have characters to type
                if (charIndex < item.text.length) {
                    const char = item.text[charIndex];
                    const isPunctuation = /[.,!?]/.test(char);
                    // Calculate delay for THIS character
                    delay = (config.typing * 1000) + (isPunctuation ? config.pulse * 1000 : 0);
                    nextCharIdx++;
                } else {
                    // Finished this line, pause before next line
                    delay = config.line * 1000;
                    nextItemIdx++;
                    nextCharIdx = 0;
                }
            } else {
                // Non-text items (Spacers, Photos, etc)
                // They act as a single "step" with a fixed delay
                if (item.type === 'spacer') delay = 100; // fast spacer
                else if (item.type === 'closing') delay = 2000;
                else delay = 1000; // photos wait 1s

                nextItemIdx++;
                nextCharIdx = 0;
            }

            // Update ref for next cycle
            progressRef.current = { itemIndex: nextItemIdx, charIndex: nextCharIdx };

            // Update state to trigger render
            setProgress({ itemIndex: nextItemIdx, charIndex: nextCharIdx });

            // Auto-scroll removed as per user request

            timer = setTimeout(processNext, delay);
        };

        // Start the loop
        processNext();

        return () => clearTimeout(timer);
    }, [isOpen, speedMode]); // Restart loop when speed changes
    // Audio Fade Logic
    const fadeInAudio = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0;
        audioRef.current.play().catch(console.error);
        let vol = 0;
        const target = 0.27;
        const step = target / 50;
        const interval = setInterval(() => {
            vol = Math.min(vol + step, target);
            if (audioRef.current) audioRef.current.volume = vol;
            if (vol >= target) clearInterval(interval);
        }, 50);
        fadeIntervalRef.current = interval;
    }, []);

    const fadeOutAudio = useCallback(() => {
        if (!audioRef.current) return;
        const startVol = audioRef.current.volume;
        let vol = startVol;
        const step = startVol / 40;
        const interval = setInterval(() => {
            vol = Math.max(vol - step, 0);
            if (audioRef.current) audioRef.current.volume = vol;
            if (vol <= 0) {
                clearInterval(interval);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }
        }, 50);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        onLetterOpen?.();
        // Reset progress on open
        progressRef.current = { itemIndex: 0, charIndex: 0 };
        setProgress({ itemIndex: 0, charIndex: 0 });

        setTimeout(() => {
            fadeInAudio();
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
        }, 300);
    };

    const handleClose = () => {
        fadeOutAudio();
        setTimeout(() => {
            setIsOpen(false);
            onLetterClose?.();
        }, 800);
    };

    useEffect(() => {
        return () => { if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current); };
    }, []);

    return (
        <>
            <audio ref={audioRef} src="/ruangbaru.mp3" loop preload="auto" />

            {/* ═══ TEASER ═══ */}
            {!isOpen && (
                <section className="letter-teaser" ref={teaserRef}>
                    <div className="letter-collage-bg">
                        <div className="letter-collage-grid">
                            {sourceImages.map((src, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className="letter-collage-item"
                                    style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ))}
                        </div>
                        <div className="letter-collage-overlay" />
                    </div>
                    <motion.p className="letter-teaser-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={teaserInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        style={{ position: 'relative', zIndex: 20 }}>
                        ada satu hal kecil yang belum pernah aku bilang.
                    </motion.p>
                    <motion.button className="letter-teaser-btn"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={teaserInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1.5, type: 'spring' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpen}
                        style={{ position: 'relative', zIndex: 20 }}>
                        <span className="letter-btn-icon">💌</span>
                        Buka Surat
                    </motion.button>
                </section>
            )}

            {/* ═══ FULL LETTER ═══ */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="letter-fullscreen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                    >
                        {/* Fixed Back Button */}
                        <motion.button
                            className="letter-back-btn"
                            onClick={handleClose}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <span>←</span> Back
                        </motion.button>

                        {/* Speed Toggle Bubble */}
                        <motion.button
                            className="letter-speed-btn"
                            onClick={toggleSpeed}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <span className="speed-label">Speed:</span>
                            <span className="speed-value">{speedMode.charAt(0).toUpperCase() + speedMode.slice(1)}</span>
                        </motion.button>

                        <div className="letter-scroll" ref={scrollContainerRef}>
                            <div className={`letter-body ${lora.className}`}>

                                {letterContent.map((item, index) => {
                                    // Should we render this item?
                                    // If index < progress.itemIndex: Render FULLY
                                    // If index == progress.itemIndex: Render PARTIALLY (if text) or HIDDEN (if others waiting)
                                    // If index > progress.itemIndex: HIDE

                                    const isPast = index < progress.itemIndex;
                                    const isCurrent = index === progress.itemIndex;

                                    if (!isPast && !isCurrent) return null;

                                    if (item.type === 'text') {
                                        return (
                                            <p key={index} className="letter-line">
                                                <TypingText
                                                    text={item.text}
                                                    bold={item.bold}
                                                    visibleCount={isPast ? item.text.length : progress.charIndex}
                                                />
                                            </p>
                                        );
                                    }

                                    // For non-text items, we simply show them if they are past or current
                                    // We can add a simple fade-in when they first appear
                                    if (item.type === 'spacer') {
                                        return <div key={index} style={{ height: item.h }} />;
                                    }
                                    if (item.type === 'polaroid') {
                                        return <Polaroid key={index} src={item.src} rotate={item.rotate} delay={0} />;
                                    }
                                    if (item.type === 'strip') {
                                        return <PhotoboothStrip key={index} images={item.images} rotate={item.rotate} delay={0} />;
                                    }
                                    if (item.type === 'rounded') {
                                        return <RoundedPhoto key={index} src={item.src} delay={0} />;
                                    }
                                    if (item.type === 'closing') {
                                        return (
                                            <div key={index} className="letter-closing">
                                                <motion.p
                                                    className="letter-closing-title"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1 }}
                                                >
                                                    {item.title}
                                                </motion.p>
                                                <motion.p
                                                    className="letter-closing-heart"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1, delay: 1 }}
                                                >
                                                    {item.heart}
                                                </motion.p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {progress.itemIndex >= letterContent.length && (
                                    <motion.div
                                        className="letter-close-btn-wrap"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <button onClick={handleClose} className="letter-close-btn">
                                            Close Letter
                                        </button>
                                    </motion.div>
                                )}

                                <div style={{ height: '30vh' }} />

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
