
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const destinations = [
    {
        id: 'kotu',
        title: 'Kota Tua (Old Batavia)',
        desc: 'Kita ke kota tua karna nemenin kamu bikin vlog wkwkwk, bukan ke kota tua aja, kita lanjut ke musium juga, beli kacamata couple, nyobain kerak telor, seruuu bangeeettt',
        image: '/images/map_kota_tua_3d_1770810117070.png'
    },
    {
        id: 'ptiq',
        title: 'Universitas PTIQ Jakarta',
        desc: 'Kampus kitaa, pas waktu awal2 kita blm terlalu dekett sihh, kita deket pas mau akhir semester huhuu, udh keinget juga sama kosan lama kamuu, banyak bgtt kesimpen kenangan disitu, jadi iangen dehh🥲🤧',
        image: '/images/map_ptiq_3d_1770810132798.png'
    },
    {
        id: 'bandung',
        title: 'Bandung City',
        desc: 'Kulineran banyak, dapat Jukut juga pertama kali, dan langsung jadi fav si tawes tauuu wkwwk. Nyobain Nasi Ayam SPG dan masihh banyakk lagi. Tempa makan apatuh yaa yang terbyata zonk wkwwkk menang viral tiktok doang, taunya biasa aja, mana mahal lagii jirlahh🤧 Sempat ke Rumah Dilan Milea juga, cuma kamu nggak turun buat foto huhu karena lagi ngurus masalah rumah tangga ama si ituu. Jadinya aku sama Tawes saja deh yang turun.',
        image: '/images/map_bandung_3d_1770810149015.png'
    },
    {
        id: 'kawah_putih',
        title: 'Kawah Putih Bandung',
        desc: 'Ini kita telat banguunn😭😭🤣. Ngomongnya mah mau berangkat subuh wkwkwk, eh jadinya jam 9an baru nyampe hahaha, mana lagi berkabut😅 Kita jadi pernah hiking meskipun nge-cheat pake jalur cepat hahaaha',
        image: '/images/map_kawah_putih_3d_1770810186413.png'
    },
    {
        id: 'moi',
        title: 'Mall of Indonesia (MOI)',
        desc: 'Jauh-jauh ke MOI pakai Transjakarta (yang mana aku baru tahu kalau mall ini dekat rumah aku) buat nyobain salah satu wishlist makanan kita ya, chikuro (jadi pengen chikuro lagii). Ga lupa sebelum pulang kita beli eskrim hehee. Sekalian foto-foto estetik di mall dehh.',
        image: '/images/map_moi_3d_new.png'
    },
    {
        id: 'aeon',
        title: 'AEON Mall',
        desc: 'Sebenarnya ini salah satu tempat andalan kalau lagi bingung cari destinasi. Ujung2nya ke AEON aja, sialnya banyak kulineran yang bisa kita cobain hehe.',
        image: '/images/map_aeon_3d_1770810301520.png'
    },
    {
        id: 'gbk',
        title: 'Gelora Bung Karno (GBK)',
        desc: 'Ke GBK joging tanpa wacana2 kitaaa yaa, asliii ngerasa bangga bgt ini aku jadi morning person wkwkwk',
        image: '/images/map_gbk_3d_1770810245541.png'
    },
    {
        id: 'rumah',
        title: 'Rumah Aku',
        desc: 'Ini lucu banget sih. Pas kamu main ke rumah aku, ketemu sama keluarga aku, seneng bangeett bisa ajak kamu ke rumah dan ketemu keluarga akuu, anggap aja keluarga sendiri yaa ziii🫶',
        image: '/images/map_rumah_3d_1770810317905.png'
    },
    {
        id: 'rri',
        title: 'Radio Republik Indonesia',
        desc: 'Hehe, ini waktu magang bareng sama kamu. Dimana semua kedekatan kita berawal, dari magang ini. Aku ikut ngekos di kontrakan kamu. Kita sering naik TJ ke Jakarta Pusat PP tiap hari. Aku masih numpang di kosan kamu hihi. Tapi karena sekosan, kita jadi makin akrab deh di sini. Aaaaa seruu bangettt jadi pengen ulang, tapi kita berantem juga disinii, inget gasiii? Sampe diem2an berapa hari yaa? Tapi ujung2nya kita nangis2ann huhuuu🤧🥲😭🙏🏻',
        image: '/images/map_rri_3d_final_1770813505790.png'
    }
];

export default function DestinationsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [showModal, setShowModal] = useState(false);

    return (
        <section id="destinations" className="section destinations-section-apple" ref={ref}>
            <div className="apple-container">
                <motion.div
                    className="destinations-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="apple-title">
                        List Tempat<br />
                        <span className="apple-title-highlight">Yang Pernah Kita Kunjungi Bareng</span>
                    </h2>
                </motion.div>

                {/* Horizontal Scroll Container */}
                <div className="apple-scroll-wrapper">
                    <div className="apple-track">
                        {destinations.map((dest, i) => (
                            <motion.div
                                key={dest.id}
                                className="apple-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                {/* 1. Image Area (Top) */}
                                <div className="apple-card-image-container">
                                    <div className="apple-card-bg-circle" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={dest.image}
                                        alt={dest.title}
                                        className="apple-card-image"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${dest.id}`
                                        }}
                                    />
                                </div>

                                {/* 2. Content Area (Bottom) */}
                                <div className="apple-card-content">
                                    <h3 className="apple-card-title">{dest.title}</h3>
                                    <div
                                        className="apple-card-desc"
                                        dangerouslySetInnerHTML={{ __html: dest.desc }}
                                    />
                                    <div className="apple-learn-more">Lihat detail &gt;</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Floating / Sticky Button */}
                <motion.button
                    className="wishlist-btn"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                >
                    Tambahkan Wishlist Destinasi +
                </motion.button>

                {/* Wishlist Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="wishlist-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                className="wishlist-popup"
                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="wishlist-message">
                                    Yuk, kita agendain jalan-jalan lagi zii, kemana lagi yaa kitaa, hihii 🥹.
                                    <br /><br />
                                    Kangen jalan-jalan lagi sama kamu yang vibesnya ceria dan positive vibes inii 🤗.
                                    <br /><br />
                                    Kalo kamu ada ide mau jalan-jalan kemana lagi bisa rekom in aku langsung aja yaa ❤️ 🫂
                                </div>
                                <button
                                    className="wishlist-close-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Okeeyy 😆
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
