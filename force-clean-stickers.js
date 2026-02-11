const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const THRESHOLD = 240; // High threshold for white

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
            return r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD;
        };

        const setTransparent = (x, y) => {
            const idx = (width * y + x) << 2;
            image.bitmap.data[idx + 3] = 0;
        };

        // BFS Flood Fill from corners
        const queue = [];
        const visited = new Uint8Array(width * height);

        // Add all border pixels that are white to queue to ensure we catch everything
        for (let x = 0; x < width; x++) {
            if (isWhite(x, 0)) { queue.push({ x, y: 0 }); visited[0 * width + x] = 1; }
            if (isWhite(x, height - 1)) { queue.push({ x, y: height - 1 }); visited[(height - 1) * width + x] = 1; }
        }
        for (let y = 0; y < height; y++) {
            if (isWhite(0, y)) { queue.push({ x: 0, y }); visited[y * width + 0] = 1; }
            if (isWhite(width - 1, y)) { queue.push({ x: width - 1, y }); visited[y * width + (width - 1)] = 1; }
        }

        let processed = 0;

        while (queue.length > 0) {
            const { x, y } = queue.shift();

            setTransparent(x, y);
            processed++;

            const neighbors = [
                { x: x + 1, y: y },
                { x: x - 1, y: y },
                { x: x, y: y + 1 },
                { x: x, y: y - 1 }
            ];

            for (const n of neighbors) {
                if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                    const idx = n.y * width + n.x;
                    if (visited[idx] === 0) {
                        visited[idx] = 1;
                        if (isWhite(n.x, n.y)) {
                            queue.push(n);
                        }
                    }
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
    console.log('All stickers processed.');
}

main();
