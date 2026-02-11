import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEMORIES_DIR = path.join(process.cwd(), "public", "memories");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"];

function parseDate(dateStr: string): Date {
    // "5 Jul 2025" -> Date
    const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Des: 11, Dec: 11,
    };
    const parts = dateStr.trim().split(" ");
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0]);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
}

// EYD Formatting Helper
function formatTitle(title: string): string {
    const abbreviations: Record<string, string> = {
        "yg": "yang", "blm": "belum", "ga": "tidak", "gak": "tidak", "ngga": "tidak",
        "sy": "saya", "km": "kamu", "aq": "aku", "dg": "dengan", "dgn": "dengan",
        "dr": "dari", "kalo": "kalau", "kl": "kalau", "krn": "karena", "utk": "untuk",
        "jg": "juga", "tdk": "tidak", "tak": "tidak", "smua": "semua", "sdh": "sudah",
        "tbtb": "tiba-tiba", "thn": "tahun", "sbg": "sebagai", "bgt": "banget", "udh": "sudah",
        "rekom": "rekomendasi", "anter": "antar", "ade": "adik", "wishlist": "keinginan" // maybe? kept wishlist as is usually or "Daftar Keinginan"
    };

    const conjunctions = ["di", "ke", "dari", "dan", "atau", "pada", "untuk", "dengan", "yang"];

    const words = title.split(" ");
    return words.map((word, index) => {
        let cleanWord = word;
        const lower = word.toLowerCase();

        // Expand abbreviation
        if (abbreviations[lower]) {
            cleanWord = abbreviations[lower];
        }

        // Handle capitalization
        // Always capitalize first word
        if (index === 0) {
            return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        }

        // Lowercase conjunctions
        if (conjunctions.includes(cleanWord.toLowerCase())) {
            return cleanWord.toLowerCase();
        }

        // Title case others (preserve uppercase if likely acronym like GBK, but "gbk" -> "Gbk")
        // If the word is all lowercase in source, title case it. 
        // If it has mixed case or all caps, likely intentional.
        if (word === lower) {
            return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        }
        return cleanWord; // Keep original casing (e.g. PTIQfest)
    }).join(" ");
}

export async function GET() {
    try {
        if (!fs.existsSync(MEMORIES_DIR)) {
            return NextResponse.json({ memories: [], profilePicture: null });
        }

        const folders = fs.readdirSync(MEMORIES_DIR, { withFileTypes: true })
            .filter((d) => d.isDirectory() && !d.name.startsWith("."));

        let profilePicture: string | null = null;
        const memories: Array<{
            id: string;
            date: string;
            title: string;
            images: string[];
            sortDate: number;
        }> = [];

        for (const folder of folders) {
            // Exclude "Our Vlog" and "Profile Picture" from main memories
            if (folder.name === "Our Vlog") continue;

            const folderPath = path.join(MEMORIES_DIR, folder.name);

            // Get image files
            const files = fs.readdirSync(folderPath)
                .filter((f) => {
                    const ext = path.extname(f).toLowerCase();
                    return IMAGE_EXTENSIONS.includes(ext) && !f.startsWith(".");
                })
                .sort();

            if (files.length === 0) continue;

            // Handle Profile Picture folder
            if (folder.name === "Profile Picture") {
                profilePicture = `/memories/${encodeURIComponent(folder.name)}/${encodeURIComponent(files[0])}`;
                continue;
            }

            // Parse folder name: "5 Jul 2025 - Kotu date with kamu"
            const match = folder.name.match(/^(.+?)\s*-\s*(.+)$/);
            let date = "";
            let title = folder.name;

            if (match) {
                date = match[1].trim();
                title = formatTitle(match[2].trim());
            } else {
                title = formatTitle(folder.name);
            }

            const images = files.map(
                (f) => `/memories/${encodeURIComponent(folder.name)}/${encodeURIComponent(f)}`
            );

            const sortDate = match ? parseDate(date).getTime() : 0;

            memories.push({
                id: folder.name,
                date,
                title,
                images,
                sortDate,
            });
        }

        // Sort by date, Oldest first (Ascending)
        memories.sort((a, b) => a.sortDate - b.sortDate);

        // Remove sortDate from response
        // Specific descriptions mapping — keyed by folder name (id)
        const DESCRIPTIONS: Record<string, string> = {
            "10 Oct 2024 - Momen di Sempro Aku":
                "secuil foto pas di sempro aku, kita ga sempro bareng soalnya kamu sudah selesai duluann, hehe, proudd",

            "3 Oct 2024 - Zia sempro":
                "Ziaaa kamu inget gaa pas inii?\nPas ini aku buatin kamu surprise kecil-kecilan tapi penuh perjuangaann tauu hahaha. Aku bikin ager-ageran lucuuu yang aku tancepin stiker \"selamat semprotulation\" sama foto kamuu yang aku tempelin kayak orang-orangan gituuu hihiii.\nada unicorn 🦄 pokoknya yang kamu sukaa aku masukinn.\nIni semua handmade dari aku buat kamuu tauuu\nAku seneng bangett bisa bikin kamu senyum🤍",

            "16 Jan 2025 - Explore HKP Perfilman Alina":
                "Ihh ini momen penting bangett tauu 😭\nDi sini kamu mulai explore dunia perfilmann lewat film Alina. Kita sama-sama nyobain hal baruuu, masuk ke dunia film, belajar hal-hal baruu yang sebelumnya belum pernah kepikiran.\nDan kamuu langsung jadi talenttt, perannya ibu 😭\nGituu tauuukkk, aku tuh liat kamu langsung powerfull banget ngeranin peran ituu.\nKereennn pokonyaaa aaakkhhh hihiii 😭🤍",

            "19 Jan 2025 - Makeupin kamu jadi Talent":
                "Di sini aku nge-makeup-in kamuu buat jadi talent ibu di film Alina.\nAku seneng bangett karena bisa ikut ambil bagian, bukan cuma nemenin doang tapi juga ikut bantu proses kamu langsungg.\nKayak \"ih aku bisa sejauh ini nemenin kamu yaa\" 😭\nBangga, terharu, seneng, campur aduk pokoknyaaa 🤍",

            "30 Jan 2025 - Zia Sidang":
                "YA ALLAH INI 😭😭\nDi sini kamu sidang skripsii, dan kamu termasuk salah satu yang sidangnya paling cepett.\nAku liat kamu tuh bener-bener niat, fokus, dan kuattt.\nCape kamu akhirnya kebayarr.\nAku proud of you bangett, bangett, bangett.\nKamu kereennn, aku bangga samaa kamuu kamu 🥹🫶",

            "6 Feb 2025 - Birthday zia":
                "Ini pas birthday kamu yg ke-23 🎂\nDi sini aku ngusurpresin kamuu pake kue kecil-kecilan, balon, dan hal-hal sederhana lainnya.\nBukan soal besarnyaa, tapi soal niattt aku buat bikin hari kamu spesial.\nAku seneng banget bisa nemenin kamu di umur baruu kamu iniii 😭🤍",

            "13 Feb 2025 - Divisi acara di acara dema PTIQfest":
                "Di sini kita nyobain hal baruuu lagiii 😭\nMasuk ke dunia divisi acara, dunia festival, nambah pengalaman, relasi, dan kenalan baruu.\nSeruu bangett sumpahhh.🤩 mana ada kejadiann yg diluarr prediksi bgtt lagii😭 yang pintu kamuu rusaakkk awokawok😭🙏🏻 maapkeunnn yaaa🙏🏻🙏🏻🙏🏻",

            "12 Mar 2025 - Anter ke bandara":
                "Ini tuh momen yang campur aduk bangett 😭\nDi sini aku nganterin kamuu ke bandara buat pergi ke Sumatra.\nDari sore sampe menjelang malem, aku tuh kayak bgerasa kosong bgttt, anehh… sedih iya, ikhlas iya...\nNgeliat kamu jalan bawaa tas, siap berangkat, aku ngerasa \"serius kamu beneran pergi??\" 🥲\nAku berusaha buat ga nangiss karna ngeliat kamu udah nangiss, padahal mahhh pengen nangis jugaaa😭😭😭",

            "17 May 2025 - Jemput zia di bandara":
                "TERUS INI\nDi sesi ini aku jemput kamuu lagi dari bandara buat balik ke kosan.\nRasanya beda bangett, kayak lega, happyyy bangeeett.\nAku ngerasa \"akhirnyaa bisaa ketemu lagii, bisa jalan bareng lagii hehee\" 😭🤍\nAda aku, kamuu, sama Fawas, bertigaaa, ngobrol di jalan, capek tapi bahagiaaa.",

            "17 May 2025 - makan wishlist bebek rekom zia":
                "Abis jemput kamu, TANPA BANYAK MIKIR langsung eksekusiii 😎\nMakan bebek rekomendasi kamuu di daerah Cinere.\nSebagai orang Minang, selera kamu tuh nggak pernah gagall 😭🔥\nBebeknya enakkk bangett, pas di lidah.\nBertiga sama kamu dan Fawas, momen kecil tapi berkesan bangett 🤍",

            "17 May 2025 - Selfie dulu dah lama ga ketemu kamu":
                "Abis jemput kamu, TANPA BANYAK MIKIR langsung eksekusiii 😎\nMakan bebek rekomendasi kamuu di daerah Cinere.\nSebagai orang Minang, selera kamu tuh nggak pernah gagall 😭🔥\nBebeknya enakkk bangett, pas di lidah.\nBertiga sama kamu dan Fawas, momen kecil tapi berkesan bangett 🤍",

            "25 May 2025 - jogging di gbk":
                "Ih ini random tapi seruu 😭\nKita jogging bareng di GBK, nyobain hidup sehat ala orang Jakarta elit pagi-pagi workout 😭\nGaada wacana kita mahh langsung eksekusiii hahahaa🤣\nAku suka bangett explore hal baruuu sama kamuu, bangun kebiasaan baruu barengg 🥳",

            "4 Jun 2025 - main ke kampus":
                "Di sini aku main ke kampus dan ketemu kamuu.\nDisinii kita ngehadirin sempro fawaz, zahra, dan temen-temen lainn, aku juga pas disini numpang bikin buket buat mereka berduaa wkwkwk, inget gaaa?",

            "5 Jun 2025 - aeon mall date bareng kamu":
                "Date tipis-tipiss, anjaayyy😏\nDisini kita outfitnya ga prepare bgttt wkwkwk, kek outfit mau tidurr, disini kalo ga salah kamu bareng arapah yaa tapi dia ga ikut kitaa.\nKita kulineran, beli sushi-sushian, keliling Aeon Mall.",

            "14 Jun 2025 - photobooth sama ade aku":
                "Photobooth rame-ramee 😭\nAda aku, adik aku, kamuu, sama Zahara.\nKita berempat foto bareng, ketawa-ketawa, lucuuu.\nMomen kecil tapi tapii membekas bgttt ihhh mau lagiiii 🤍",

            "5 Jul 2025 - Kotu date with kamu":
                "Nahhh disini aku nemenin kamuu ke kotu, karena katanya kamu mau bikin vlog buat YouTube kamu disiniii, seruu bgtt kita nyobain kerak telor jugaaa karna kamu belum pernah nyobaa hihii🤭 next kita vlog apalagiii yaaa?🤔",

            "10 Oct 2025 - Bundaran HI":
                "Sebenernya kita capekkk 😭\nNyari kebaya buat persiapan wisuda sampe malem.\nKarena deket Bundaran HI, sekalian foto-foto dehh. Ga lupaa makan di belakang GI, enakkk bangeettt, jadi pengen lagii🤤",

            "18 Des 2025 - Birthday zaza":
                "Ini aku nggak expect sama sekali 😭😭\nKamu ngasih surprise, ada kue, bolu, tulisan \"Happy Birthday Zaza\".\nKamu bikinin video, kamu taruh di atas kulkas, terus aku play langsung di situ.\nHuhuu terharu bangett aku tuhh, walaupun sederhana tapi membekas🥹🥹🥹",
        };

        const cleanMemories = memories.map(({ sortDate, ...rest }) => ({
            ...rest,
            description: DESCRIPTIONS[rest.id] || "Captured moments special buat kamu! ✨📸",
        }));

        return NextResponse.json({
            memories: cleanMemories,
            profilePicture,
        });
    } catch (error) {
        console.error("Error reading memories:", error);
        return NextResponse.json({ memories: [], profilePicture: null }, { status: 500 });
    }
}
