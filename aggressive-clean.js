const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const THRESHOLD = 200; // Very aggressive. Anything lighter than light-grey becomes transparent.

const TARGETS = [
    'sticker-v2-balloon.png',
    'sticker-v2-star.png',
    'sticker-v2-cupcake.png',
    'sticker-v2-heart.png',
    'sticker-v2-music.png',
    'sticker-v2-wave.png',
    'sticker-v2-sleep.png'
];

async function processImage(filename) {
    const filePath = path.join(publicDir, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filename}`);
        return;
    }

    console.log(`Processing ${filename}...`);

    try {
        const image = await Jimp.read(filePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Helper to get RGBA manually
        const intToRGBA = (i) => ({
            r: (i >>> 24) & 0xFF,
            g: (i >>> 16) & 0xFF,
            b: (i >>> 8) & 0xFF,
            a: i & 0xFF
        });

        const isWhite = (x, y) => {
            const idx = (width * y + x) << 2;
            const r = image.bitmap.data[idx];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];
            // Check if pixel is light enough
            return r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD;
        };

        const setTransparent = (x, y) => {
            const idx = (width * y + x) << 2;
            image.bitmap.data[idx + 3] = 0;
        };

        let processed = 0;

        // GLOBAL REPLACE - No flood fill. Just nuke all white pixels.
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (isWhite(x, y)) {
                    setTransparent(x, y);
                    processed++;
                }
            }
        }

        console.log(`Removed background from ${filename} (${processed} pixels).`);

        await new Promise((resolve, reject) => {
            image.write(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function main() {
    for (const file of TARGETS) {
        await processImage(file);
    }
    console.log('All stickers processed (Global Replace).');
}

main();
