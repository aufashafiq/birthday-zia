"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";


const favorites = [
    {
        id: 'sweet',
        title: 'Makanan manis',
        icon: '🍰',
        image: '/images/favorites/unicorn_sweet.png',
        desc: 'Kamu suka banget sama makanan manis, kayak coklat, pisang, pastry, dll, sampe ngilu aku liatnyaa😭'
    },
    {
        id: 'spicy',
        title: 'Makanan pedas',
        icon: '🌶️',
        image: '/images/favorites/unicorn_chili.png',
        desc: 'Selain makanan manis kamu juga suka banget sama makanan pedes, iyalaahh orang minang pasti suka bgt yg pedes2 wkwkwk'
    },
    {
        id: 'bread',
        title: 'Roti2an',
        icon: '🥐',
        image: '/images/favorites/unicorn_bread.png',
        desc: 'Aku kadang bingung kenapa kamu suka bangett sama roti wkwkwk😭🙏🏻'
    },
    {
        id: 'fruit',
        title: 'Buah',
        icon: '🍎',
        image: '/images/favorites/unicorn_fruit.png',
        desc: 'Kayaknya gaada buah yang kamu gasuka gasii? Apalagi durenn beuhhh'
    },
    {
        id: 'singing',
        title: 'Nyanyi',
        icon: '🎤',
        image: '/images/favorites/unicorn_singing.png',
        desc: 'Aku baru ngeh akhir2 ini kamu suka nyanyi yaa, yuk bisa yuk cover lagu'
    },
    {
        id: 'vlog',
        title: 'Ngonten Vlog',
        icon: '🤳',
        image: '/images/favorites/unicorn_vlog.png',
        desc: 'Suka banget bikin mini vlog aesthetic ala-ala selebgram.'
    },
    {
        id: 'reading',
        title: 'Baca Buku',
        icon: '📚',
        image: '/images/favorites/unicorn_reading.png',
        desc: 'Banyak banget buku yang udah kamu baca pasti yaa, recommend buku yang seru ga bosenin dong!'
    },
    {
        id: 'editing',
        title: 'Ngedit Video',
        icon: '🎬',
        image: '/images/favorites/unicorn_editing.png',
        desc: 'Ngutak-ngatik clip jadi karya lucu yang memorable.'
    },
    {
        id: 'unicorn',
        title: 'Unicorn',
        icon: '🦄',
        image: '/images/favorites/unicorn_gemoy.png',
        desc: 'Karakter kesukaan kamuu, kalau sekarang masih suka atau udh ganti yg lain ziii?'
    },
    {
        id: 'writing',
        title: 'Nulis',
        icon: '✍️',
        image: '/images/favorites/unicorn_writing.png',
        desc: 'Nuangin isi hati dan pikiran ke dalam tulisan dan jadi bacaan yang indah tuh keren bangett sihh, langsung daftarin zii buat dicetak!'
    },
    {
        id: 'travel',
        title: 'Jalan-jalan',
        icon: '✈️',
        image: '/images/favorites/unicorn_travel.png',
        desc: 'Explore tempat baru dan nyari pengalaman seru. Pengen jalan2 bareng lagii, tapi susah banget atur waktunya😢'
    },
    {
        id: 'photo',
        title: 'Foto-foto',
        icon: '📸',
        image: '/images/favorites/unicorn_photo.png',
        desc: 'Mengabadikan setiap momen indah biar nggak lupa. Apalagi kamu orangnya estetik bgtt hahaahaa, tiap kita jalan pasti aku minta fotonya dari yang kamu take soalnya hasilnya lebih bagus hehehee'
    }
];

export default function FavoritesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <section id="favorites" className="section favorites-section" ref={ref}>
            <div className="favorites-container">
                <motion.div
                    className="favorites-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        Things You Love
                        <span className="underline"></span>
                    </h2>
                    <p className="section-subtitle">Kumpulan hal-hal favorit Zia ✨</p>
                </motion.div>

                <div className="favorites-grid">
                    {favorites.map((fav, i) => (
                        <motion.div
                            key={fav.id}
                            className="favorite-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(236, 72, 153, 0.15)" }}
                        >
                            <div className="favorite-icon-wrapper">
                                {fav.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={fav.image}
                                        alt={fav.title}
                                        className="favorite-image-3d"
                                    />
                                ) : (
                                    <span className="favorite-icon">{fav.icon}</span>
                                )}
                            </div>
                            <div className="favorite-content">
                                <h3 className="favorite-title">{fav.title}</h3>
                                <div
                                    className="favorite-desc"
                                    dangerouslySetInnerHTML={{ __html: fav.desc }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="favorites-closing"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <p>
                        itu ajasihh yang aku tau, selebihnya gatau lagii hehe,, itu juga kayaknya masih sepengetahuan akuu, gatau bener apa enggaa, hihiiiy
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
