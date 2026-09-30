import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Simple uncompressed or deflate PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      
      // Calculate distance from center for subtle circular icon branding
      const cx = width / 2;
      const cy = height / 2;
      const dx = (x - cx) / (width * 0.4);
      const dy = (y - cy) / (height * 0.4);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.6) {
        // Center mark: Teal/Green & White
        if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) {
          rawData[pixelOffset] = 11;     // R
          rawData[pixelOffset + 1] = 143; // G
          rawData[pixelOffset + 2] = 115; // B
          rawData[pixelOffset + 3] = 255; // A
        } else {
          rawData[pixelOffset] = 11;
          rawData[pixelOffset + 1] = 95;
          rawData[pixelOffset + 2] = 165;
          rawData[pixelOffset + 3] = 255;
        }
      } else {
        // Deep Navy background (#063B73)
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = crc32(typeAndData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([len, typeAndData, crcBuf]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PWA Icons: Deep Navy background (#063B73)
const png192 = createSolidPng(192, 192, 6, 59, 115);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

const png512 = createSolidPng(512, 512, 6, 59, 115);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

const pngMaskable512 = createSolidPng(512, 512, 6, 59, 115);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);

const appleIcon = createSolidPng(180, 180, 6, 59, 115);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPng(32, 32, 6, 59, 115));

console.log('PWA icons successfully generated in /public directory!');
