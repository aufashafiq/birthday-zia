const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const THRESHOLD = 220;

const TARGET = 'unicorn-24-v2.png';

async function processImage() {
    const filePath = path.join(publicDir, TARGET);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${TARGET}`);
        return;
    }

    console.log(`Processing ${TARGET}...`);

    try {
        const image = await Jimp.read(filePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        const isWhite = (idx) => {
            const r = image.bitmap.data[idx];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];
            return r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD;
        };

        let processed = 0;

        for (let idx = 0; idx < width * height * 4; idx += 4) {
            if (isWhite(idx)) {
                image.bitmap.data[idx + 3] = 0;
                processed++;
            }
        }

        console.log(`Removed background from ${TARGET} (${processed} pixels).`);

        await new Promise((resolve, reject) => {
            image.write(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    } catch (err) {
        console.error(`Error processing ${TARGET}:`, err);
    }
}

processImage();
