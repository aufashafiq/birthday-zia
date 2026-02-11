const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const THRESHOLD = 230; // Slightly more aggressive (lowered from 240 to catch light greys)

async function processImage(file) {
    // Target specific files
    if (!file.startsWith('unicorn-sticker-') && file !== 'unicorn-24.png') return;

    const filePath = path.join(publicDir, file);
    console.log(`Processing ${file}...`);

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
            // Check if pixel is light enough to be considered background
            return r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD;
        };

        const setTransparent = (x, y) => {
            const idx = (width * y + x) << 2;
            image.bitmap.data[idx + 3] = 0;
        };

        // BFS Flood Fill from corners to remove surrounding white box
        // We start from all 4 corners to ensure we get the box even if the unicorn touches a side
        const queue = [];
        const visited = new Uint8Array(width * height);

        const seeds = [
            { x: 0, y: 0 },
            { x: width - 1, y: 0 },
            { x: 0, y: height - 1 },
            { x: width - 1, y: height - 1 }
        ];

        for (const seed of seeds) {
            if (isWhite(seed.x, seed.y)) {
                queue.push(seed);
                visited[seed.y * width + seed.x] = 1;
            }
        }

        let processed = 0;

        while (queue.length > 0) {
            const { x, y } = queue.shift();

            // Double check it's white (it should be if it was added)
            if (isWhite(x, y)) {
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
        }

        console.log(`Removed background from ${file} (${processed} pixels).`);

        await new Promise((resolve, reject) => {
            image.write(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

async function main() {
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
        await processImage(file);
    }
    console.log('Done.');
}

main();
