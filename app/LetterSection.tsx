"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Images mixed from multiple folders
const letterImages = [
    { src: "/memories/Letter/IMG_4674.jpg", align: "left" as const },
    { src: "/memories/Letter/4b649b2c-86bd-4746-bb06-97fc190a94a0.JPG", align: "right" as const },
    { src: "/memories/5 Jul 2025 - Kotu date with kamu/IMG_0166.JPG", align: "left" as const },
    { src: "/memories/Letter/IMG_6021.jpg", align: "right" as const },
    { src: "/memories/25 May 2025 - jogging di gbk/IMG_8633.JPG", align: "left" as const },
    { src: "/memories/Letter/150-Zia Kel Wisuda %26 Zaza %7C FWG08923.JPEG", align: "right" as const },
    { src: "/memories/5 Jun 2025 - aeon mall date bareng kamu/IMG_9192.JPG", align: "left" as const },
    { src: "/memories/Letter/IMG_7583.jpg", align: "right" as const },
    { src: "/memories/10 Oct 2025 - Bundaran HI/IMG_3219.JPG", align: "left" as const },
    { src: "/memories/16 Jan 2025 - Explore HKP Perfilman Alina/IMG_5774.JPG", align: "right" as const },
    { src: "/memories/Letter/IMG_9619.PNG", align: "left" as const },
    { src: "/memories/6 Feb 2025 - Birthday zia/IMG_4932.JPG", align: "right" as const },
    { src: "/memories/Letter/IMG_8864.PNG", align: "left" as const },
    { src: "/memories/Letter/Sidangtulation 30 Jan 2025 zi-1.JPG", align: "right" as const },
    { src: "/memories/Letter/IMG_4959.jpg", align: "center" as const },
];

interface LetterSectionProps {
    onLetterOpen?: () => void;
    onLetterClose?: () => void;
}

export default function LetterSection({ onLetterOpen, onLetterClose }: LetterSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showEndButton, setShowEndButton] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const letterEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const teaserRef = useRef(null);
    const teaserInView = useInView(teaserRef, { once: true, margin: "-100px" });

    // Audio fade-in
    const fadeInAudio = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0;
        audioRef.current.play().catch(console.error);

        let vol = 0;
        const target = 0.27;
        const step = target / 50; // 50 steps over 2.5s
        const interval = setInterval(() => {
            vol = Math.min(vol + step, target);
            if (audioRef.current) audioRef.current.volume = vol;
            if (vol >= target) clearInterval(interval);
        }, 50);
        fadeIntervalRef.current = interval;
    }, []);

    // Audio fade-out
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

    // Detect when user reaches the final line
    useEffect(() => {
        if (!isOpen || !letterEndRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Wait 2 seconds then show button and fade audio
                    setTimeout(() => {
                        setShowEndButton(true);
                        fadeOutAudio();
                    }, 2000);
                }
            },
            { threshold: 0.8 }
        );

        observer.observe(letterEndRef.current);
        return () => observer.disconnect();
    }, [isOpen, fadeOutAudio]);

    const handleOpen = () => {
        setIsOpen(true);
        setShowEndButton(false);
        onLetterOpen?.();
        // Small delay to let DOM render
        setTimeout(() => {
            fadeInAudio();
            // Scroll to top of letter
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }, 300);
    };

    const handleClose = () => {
        fadeOutAudio();
        setTimeout(() => {
            setIsOpen(false);
            setShowEndButton(false);
            onLetterClose?.();
        }, 800);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        };
    }, []);

    // Image counter for placing images between paragraphs
    let imgIndex = 0;
    const getNextImage = () => {
        if (imgIndex >= letterImages.length) return null;
        const img = letterImages[imgIndex];
        imgIndex++;
        return img;
    };

    const renderImage = (captionText?: string) => {
        const img = getNextImage();
        if (!img) return null;
        return (
            <div className={`letter-image letter-image-${img.align}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" loading="lazy" draggable={false} />
                {captionText && <span className="letter-image-caption">{captionText}</span>}
            </div>
        );
    };

    return (
        <>
            {/* Hidden audio element */}
            <audio ref={audioRef} src="/ruangbaru.mp3" loop preload="auto" />

            {/* ======== TEASER SECTION ======== */}
            {!isOpen && (
                <section className="letter-teaser" ref={teaserRef}>
                    <motion.p
                        className="letter-teaser-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={teaserInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.5 }}
                    >
                        ada satu hal kecil yang belum pernah aku bilang.
                    </motion.p>
                    <motion.button
                        className="letter-teaser-btn"
                        initial={{ opacity: 0 }}
                        animate={teaserInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        onClick={handleOpen}
                    >
                        Buka Surat
                    </motion.button>
                </section>
            )}

            {/* ======== FULL LETTER EXPERIENCE ======== */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="letter-fullscreen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                    >
                        <div className="letter-scroll" ref={scrollContainerRef}>
                            <div className="letter-content">

                                {/* ===== PARAGRAPH 1 ===== */}
                                <div className="letter-spacer-xl" />
                                <div className="letter-paragraph">
                                    <p>ziii…</p>
                                    <p>aku ngetik ini sambil mikir <strong>lamaaa</strong> 😭</p>
                                    <p>ini perlu ga ya sebenernya.</p>
                                    <br />
                                    <p>tapi kalo ga ditulis sekarang,</p>
                                    <p>aku tau aku bakal <strong>nyimpen ini terus</strong>,</p>
                                    <p>dan ujung-ujungnya malah ga pernah aku bilang.</p>
                                </div>

                                <div className="letter-spacer-lg" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 2 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-inline">
                                    <div className="letter-paragraph">
                                        <p>jujur yaa zi…</p>
                                        <p>sampe sekarang aku tuh masih suka mikir,</p>
                                        <p>kok bisa sih kita <strong>sedeket ini</strong>?</p>
                                        <br />
                                        <p>padahal kalo dipikir-pikir,</p>
                                        <p>kita tuh deketnya di <strong>akhir-akhir kuliah</strong>.</p>
                                        <p>pas semua orang lagi ribeeett,</p>
                                        <p>lagi sibuk sama hidupnya masing-masing.</p>
                                    </div>
                                    {renderImage()}
                                </div>
                                <div className="letter-spacer-sm" />
                                <div className="letter-paragraph">
                                    <p>tapi kamu dateng gitu aja.</p>
                                    <p><strong>ga ribet.</strong></p>
                                    <p><strong>ga maksa.</strong></p>
                                    <p>pelan-pelan…</p>
                                    <p>eh tau-tau <strong>nyantol</strong> 😭🤍</p>
                                </div>

                                {/* ===== PARAGRAPH 3 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-paragraph">
                                    <p>kamu tuh <strong>rameeee bangett</strong>.</p>
                                    <p>hyper aktif parahhh 😭</p>
                                    <p>kayak energinya tuh ga ada tombol off-nya.</p>
                                    <br />
                                    <p>tiap ketemu kamu,</p>
                                    <p>suasana tuh langsung <strong>beda</strong>.</p>
                                    <p>yang tadinya biasa aja,</p>
                                    <p>langsung rame sendiri.</p>
                                    <br />
                                    <p>kamu <strong>lucuu</strong>.</p>
                                    <p>kamu <strong>cantikkk banget</strong>.</p>
                                    <p>dan ihh entah kenapa yaa zi,</p>
                                    <p>kamu tuh selalu bawa <strong>positive vibes</strong> ke mana-mana ✨🥹</p>
                                </div>

                                <div className="letter-spacer-md" />
                                {renderImage()}
                                <div className="letter-spacer-sm" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 4 ===== */}
                                <div className="letter-spacer-xl" />
                                <div className="letter-paragraph">
                                    <p>tapi aku juga tau kok <strong>sisi kamu yang ini</strong>…</p>
                                    <br />
                                    <p>kamu tuh <strong>sensitiftt</strong>.</p>
                                    <p>gampang nangiss.</p>
                                    <p>kadang cengeng juga 😭</p>
                                    <br />
                                    <p>hatimu <strong>lembut bangett</strong>.</p>
                                    <p>terlalu lembut malah.</p>
                                    <br />
                                    <p>kadang pas kamu nangis,</p>
                                    <p>aku tuh pengen bilang,</p>
                                    <p><em>&lsquo;zii gapapa tau nangis…&rsquo;</em></p>
                                    <br />
                                    <p>dan serius yaa,</p>
                                    <p>itu <strong>ga bikin kamu lemah</strong>.</p>
                                    <p>sama sekali engga.</p>
                                    <br />
                                    <p>itu bikin kamu <strong>manusia</strong>.</p>
                                    <p>manusia yang <strong>punya hati banget</strong> 🤍</p>
                                </div>

                                <div className="letter-spacer-lg" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 5 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-inline letter-inline-reverse">
                                    <div className="letter-paragraph">
                                        <p><strong>OIYAAA</strong> 😭</p>
                                        <p>aku tuh paling ngeh kalo kamu tuhh</p>
                                        <p>sukaaa <strong>BANGEEETTT</strong> makanan maniss.</p>
                                        <br />
                                        <p>banget.</p>
                                        <p><strong>bangett</strong> 😭🍫</p>
                                        <br />
                                        <p>nyatanyaaa ajaa,</p>
                                        <p>kamu makan martabak manis</p>
                                        <p>sampe <strong>DUA KOTAK SENDIRIAN ITU ABISS</strong>,</p>
                                        <p><strong>gelokkk</strong> 😭🥹</p>
                                    </div>
                                    {renderImage()}
                                </div>
                                <div className="letter-spacer-sm" />
                                <div className="letter-paragraph">
                                    <p>sampe sekarang aku masih mikir,</p>
                                    <p>kok bisa sih…</p>
                                    <br />
                                    <p>tapi yaaa…</p>
                                    <p>itu kamu bangett wkwk.</p>
                                </div>

                                {/* ===== PARAGRAPH 6 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-paragraph">
                                    <p>kamu tuh <strong>so sweet</strong>,</p>
                                    <p>tapi bukan sweet yang dibuat-buat.</p>
                                    <br />
                                    <p>bukan dari kata-kata doang,</p>
                                    <p>tapi dari <strong>sikap kamu</strong> ke orang.</p>
                                    <br />
                                    <p>kamu inget hal-hal kecil tentang temen kamu.</p>
                                    <p>kamu dengerin cerita mereka.</p>
                                    <p>kamu <strong>peduli, beneran peduli</strong>.</p>
                                    <br />
                                    <p>makanya kamu tuh sering jadi <strong>tempat cerita</strong>.</p>
                                    <p>tempat curhat.</p>
                                    <p>tempat orang ngerasa <strong>aman</strong> 🫂🤍</p>
                                </div>

                                <div className="letter-spacer-md" />
                                {renderImage()}
                                <div className="letter-spacer-sm" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 7 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-inline">
                                    <div className="letter-paragraph">
                                        <p>aku sukaaaa <strong>BANGETTT</strong></p>
                                        <p><strong>ngabadiin momen</strong> sama kamu.</p>
                                        <br />
                                        <p>apalagi kalo kamu yang rekam duluan,</p>
                                        <p>aku tuh langsung mikir,</p>
                                        <p><em>&lsquo;oh iyaa… ini bakal jadi kenangan.&rsquo;</em></p>
                                        <br />
                                        <p>kita ngonten bareng.</p>
                                        <p>vlog bareng.</p>
                                        <p><strong>ketawa ga jelas</strong>.</p>
                                    </div>
                                    {renderImage()}
                                </div>
                                <div className="letter-spacer-sm" />
                                <div className="letter-paragraph">
                                    <p>dan pas kamu ngedit video-video lucu itu,</p>
                                    <p>momen yang udah lewat</p>
                                    <p>kayak <strong>hidup lagi</strong> 🥹🎥</p>
                                </div>

                                {/* ===== PARAGRAPH 8 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-paragraph">
                                    <p>jujur aja yaa zi,</p>
                                    <p>kita tuh <strong>ga barengan lama</strong>.</p>
                                    <br />
                                    <p>tapi rasanya <strong>cepett klopp banget</strong>.</p>
                                    <p>mungkin karena kita sering sepemikiran.</p>
                                    <br />
                                    <p>walaupun yaaa…</p>
                                    <p>kadang ada berantem dikitt 😅</p>
                                    <p>ngambek dikitt.</p>
                                    <p>ya namanya juga pertemanan kan,</p>
                                    <p>pasti ada <strong>bumbu-bumbunya</strong>.</p>
                                </div>

                                <div className="letter-spacer-md" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 9 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-inline letter-inline-reverse">
                                    <div className="letter-paragraph">
                                        <p>sekarang kamu udah <strong>24</strong> yaaa 🎂</p>
                                        <p>ihh udah gede aja.</p>
                                        <br />
                                        <p>di umur ini aku doain <strong>banyak hal</strong> buat kamu.</p>
                                        <br />
                                        <p>semoga kamu lebih <strong>hepi</strong>.</p>
                                        <p>lebih <strong>tenang</strong>.</p>
                                        <p>lebih <strong>sayang sama diri sendiri</strong>.</p>
                                        <br />
                                        <p>semoga hal-hal baik</p>
                                        <p>dateng ke kamu satu-satu.</p>
                                        <p>dan hal-hal berat</p>
                                        <p><strong>pelan-pelan pergi</strong> 🤍</p>
                                    </div>
                                    {renderImage()}
                                </div>

                                {/* ===== PARAGRAPH 10 ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-paragraph">
                                    <p>abis kuliah tuh hidup emang <strong>berubah banget</strong> yaa…</p>
                                    <br />
                                    <p>ketemu makin jarang.</p>
                                    <p>waktu makin susah.</p>
                                    <p>semuanya serba keburu-buru.</p>
                                    <br />
                                    <p>dan aku ngerti itu.</p>
                                    <p><strong>aku paham kok</strong>.</p>
                                </div>

                                <div className="letter-spacer-xl" />

                                {/* ===== PARAGRAPH 11 ===== */}
                                <div className="letter-paragraph">
                                    <p>aku doain kamu <strong>sehat</strong>.</p>
                                    <p><strong>bahagia</strong>.</p>
                                    <p>dikelilingi <strong>orang-orang baik</strong>.</p>
                                    <br />
                                    <p>dan semoga,</p>
                                    <p>di hidup kamu nanti,</p>
                                    <p>kamu selalu ngerasa <strong>dicintai</strong>…</p>
                                    <p>minimal, pernah.</p>
                                    <p><strong>sama aku</strong>.</p>
                                </div>

                                <div className="letter-spacer-xl" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 12 — EMOTIONAL PEAK ===== */}
                                <div className="letter-spacer-xl" />
                                <div className="letter-paragraph">
                                    <p>tapi kalo boleh <strong>jujur sepenuhnya</strong>…</p>
                                    <br />
                                    <p>aku tuh takut satu hal.</p>
                                    <p>kehilangan kamu? itumah pastii</p>
                                    <br />
                                    <p>tapi ini hampir sama dengan itu.</p>
                                    <p>bukan kehilangan kamu.</p>
                                    <p>bukan.</p>
                                    <br />
                                    <p>aku cuma takut,</p>
                                    <p>kita jadi <strong>strangers</strong>…</p>
                                    <br />
                                    <p><strong>padahal dulu sedeket ini</strong>.</p>
                                </div>

                                <div className="letter-spacer-xl" />

                                {/* ===== PARAGRAPH 13 ===== */}
                                <div className="letter-paragraph">
                                    <p>jadi kalo suatu hari nanti</p>
                                    <p>kita jarang ngobrol,</p>
                                    <p>atau jarang ketemu…</p>
                                    <br />
                                    <p>tolong yaa zi,</p>
                                    <p>kita <strong>tetep komunikasi</strong>.</p>
                                    <br />
                                    <p>walaupun ga sering.</p>
                                    <p>walaupun cuma sesekali.</p>
                                    <br />
                                    <p>dan kalo bisa,</p>
                                    <p>tetep nyempetin ketemu.</p>
                                    <p>biar pas ketemu nanti,</p>
                                    <p><strong>kita ga canggung</strong> 🥺🤍</p>
                                </div>

                                <div className="letter-spacer-xl" />
                                {renderImage()}
                                <div className="letter-spacer-sm" />
                                {renderImage()}

                                {/* ===== PARAGRAPH 14 — GRATITUDE ===== */}
                                <div className="letter-spacer-lg" />
                                <div className="letter-inline">
                                    <div className="letter-paragraph">
                                        <p><strong>makasih yaa zi…</strong></p>
                                        <p>beneran makasih.</p>
                                        <br />
                                        <p>makasih udah <strong>hadir di hidup aku</strong>.</p>
                                        <p>makasih udah jadi sahabat yang aku banggain.</p>
                                        <br />
                                        <p>maaf kalo kadonya kurang.</p>
                                        <p>maaf kalo aku bukan orang pertama</p>
                                        <p>yang ngucapin kamu tepat waktu.</p>
                                        <br />
                                        <p>tapi doaku selalu nyusul.</p>
                                        <p>dan rasanya pasti selalu <strong>tulus</strong> buat kamu 🤍</p>
                                    </div>
                                    {renderImage()}
                                </div>

                                {/* ===== FINAL LINE ===== */}
                                <div className="letter-spacer-final" />
                                <div className="letter-final-line" ref={letterEndRef}>
                                    <p>dan kalo suatu hari kita sibuk masing-masing</p>
                                    <p>atau aku ga pernah bilang apa-apa lagi,</p>
                                    <p><strong>tolong jangan lupa…</strong></p>
                                    <br />
                                    <p className="letter-final-emphasis">
                                        kamu pernah berarti banget buat aku.
                                    </p>
                                </div>

                                {/* ===== EXIT BUTTON ===== */}
                                <div className="letter-spacer-xl" />
                                <AnimatePresence>
                                    {showEndButton && (
                                        <motion.div
                                            className="letter-exit"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <button className="letter-exit-btn" onClick={handleClose}>
                                                Kembali ke Kenangan
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="letter-spacer-xl" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
