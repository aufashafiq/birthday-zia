import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VLOGS_DIR = path.join(process.cwd(), "public", "memories", "Our Vlog");
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".mkv"];

export async function GET() {
    try {
        const cinematicDir = path.join(VLOGS_DIR, "Our Cinematic Videos");
        const dumpDir = path.join(VLOGS_DIR, "Our Dump Videos");

        const getVideos = (dir: string) => {
            if (!fs.existsSync(dir)) return [];
            return fs.readdirSync(dir)
                .filter(f => VIDEO_EXTENSIONS.includes(path.extname(f).toLowerCase()) && !f.startsWith("."))
                .map(f => ({
                    id: f,
                    url: `/memories/Our Vlog/${path.basename(dir)}/${encodeURIComponent(f)}`,
                    filename: f
                }))
                .sort((a, b) => a.filename.localeCompare(b.filename));
        };

        const cinematic = getVideos(cinematicDir);
        const dump = getVideos(dumpDir);

        return NextResponse.json({ cinematic, dump });
    } catch (error) {
        console.error("Error reading vlogs:", error);
        return NextResponse.json({ cinematic: [], dump: [] }, { status: 500 });
    }
}
