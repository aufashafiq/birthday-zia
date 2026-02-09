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
        // Specific descriptions mapping
        const DESCRIPTIONS: Record<string, string> = {
            "Zia Sempro": "makan keinginan bebek rekomendasi zia",
            "Explore HKP Perfilman Alina": "Seru-seruan bareng di HKP! 🎬✨",
            // Add more as needed
        };

        const cleanMemories = memories.map(({ sortDate, ...rest }) => ({
            ...rest,
            description: DESCRIPTIONS[rest.title] || "Captured moments special buat kamu! ✨📸",
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
