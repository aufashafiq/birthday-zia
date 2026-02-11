
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const destinations = [
    {
        id: 'kotu',
        title: 'Kota Tua (Old Batavia)',
        desc: 'Agak <strong>random sih</strong>, tapi rasanya <strong>tidak afdol</strong> kalau kita belum pernah jalan-jalan ke <strong>Kota Tua</strong> selama di Jakarta. Apalagi menjelang semester akhir. Suka banget di sini karena <strong>vibes Batavia-nya</strong>. Next, kita ke Ikonik Minang yah!',
        image: '/images/map_kota_tua_3d_1770810117070.png'
    },
    {
        id: 'ptiq',
        title: 'Universitas PTIQ Jakarta',
        desc: '<strong>Kampus tercinta!</strong> Ini mah sudah jadi <strong>langganan</strong>. Kalau ke kampus mau ke mana-mana, atau <strong>lagi lelah</strong>, bisa numpang sama kamu hehe. Maafin aku ya kalau lagi ada kegiatan kampus suka numpang ke <strong>kosan kamu</strong>, Zi. Hihi.',
        image: '/images/map_ptiq_3d_1770810132798.png'
    },
    {
        id: 'bandung',
        title: 'Bandung City',
        desc: '<strong>Kulineran banyak</strong>, dapat Jukut juga rekomendasi dari kamu. Nyobain <strong>Nasi Ayam SPG</strong> dan sebagainya. Sempat ke Rumah Dilan Milea juga, cuma kamu nggak turun buat foto huhu. Jadinya aku sama <strong>Tawes saja deh</strong> yang turun.',
        image: '/images/map_bandung_3d_1770810149015.png'
    },
    {
        id: 'kawah_putih',
        title: 'Kawah Putih Bandung',
        desc: 'Pas lagi jalan-jalan bareng <strong>double date</strong> sama Fawas. Ini <strong>seru banget!</strong> Explore Bandung ditambah <strong>vibes kamu yang ceria</strong>. Kita jadi pernah hiking meskipun nge-cheat pakai <strong>mobil start zone-nya</strong> wkwk.',
        image: '/images/map_kawah_putih_3d_1770810186413.png'
    },
    {
        id: 'moi',
        title: 'Mall of Indonesia (MOI)',
        desc: 'Jauh-jauh ke <strong>MOI pakai Transjakarta</strong> (yang mana aku baru tahu kalau mall ini <strong>dekat rumah aku</strong>) buat nyobain salah satu <strong>wishlist makanan</strong> kita ya, Zi. Sekalian foto-foto estetik di <strong>mall abu-abu ini</strong> hihi.',
        image: '/images/map_moi_3d_new.png'
    },
    {
        id: 'aeon',
        title: 'AEON Mall',
        desc: 'Sebenarnya ini salah satu tempat yang <strong>membingungkan sih</strong> kalau dicari destinasi. Kalau mau ke mall ya <strong>ke AEON saja</strong>, karena banyak <strong>kulineran</strong> yang bisa kita cobain hehe.',
        image: '/images/map_aeon_3d_1770810301520.png'
    },
    {
        id: 'gbk',
        title: 'Gelora Bung Karno (GBK)',
        desc: 'Waktu itu iseng mau <strong>olahraga dan jogging bareng</strong>, sekalian explore <strong>vibes hidup sehat</strong> aktivitas gedung perkantoran di pagi hari.',
        image: '/images/map_gbk_3d_1770810245541.png'
    },
    {
        id: 'rumah',
        title: 'Rumah Aku',
        desc: 'Ini <strong>lucu banget sih</strong>. Waktu itu kamu <strong>singgah ke rumah aku</strong> karena kebetulan ada acara di daerah Cakung dan sempat mampir. Maaf ya kalau hidangan dan pelayanan dari aku <strong>kurang memuaskan</strong> buat kamu, Zi.',
        image: '/images/map_rumah_3d_1770810317905.png'
    },
    {
        id: 'rri',
        title: 'Radio Republik Indonesia',
        desc: 'Hehe, ini waktu <strong>magang bareng</strong> sama kamu. Kita sering naik <strong>TJ ke Jakarta Pusat PP</strong> tiap hari. Aku masih numpang di <strong>kosan kamu</strong> hihi. Tapi karena sekosan, kita jadi makin akrab deh di sini.',
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
