import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate the Learning Point high-definition SVG matching the user's reference image
function buildLearningPointSVG(isMaskable = false) {
  // If maskable, scale content down slightly to fit comfortably within Android's 80% safe zone
  const scale = isMaskable ? 0.78 : 0.94;
  const translateOffset = 512 * (1 - scale) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Dark Mahogany Wood Radial & Linear Gradients -->
    <radialGradient id="woodCenterGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#3d1e11" />
      <stop offset="45%" stop-color="#2c140a" />
      <stop offset="85%" stop-color="#180904" />
      <stop offset="100%" stop-color="#0e0402" />
    </radialGradient>

    <!-- Wood Grain Linear Pattern -->
    <linearGradient id="grainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="25%" stop-color="#000000" stop-opacity="0.12" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.06" />
      <stop offset="75%" stop-color="#000000" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
    </linearGradient>

    <!-- Antique Gold Metallic Gradients -->
    <linearGradient id="antiqueGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff4d0" />
      <stop offset="20%" stop-color="#e8ca6b" />
      <stop offset="45%" stop-color="#fdf3cd" />
      <stop offset="70%" stop-color="#be9336" />
      <stop offset="88%" stop-color="#d8b248" />
      <stop offset="100%" stop-color="#7a5513" />
    </linearGradient>

    <linearGradient id="goldHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a87f28" />
      <stop offset="15%" stop-color="#eac869" />
      <stop offset="50%" stop-color="#fff6d6" />
      <stop offset="85%" stop-color="#eac869" />
      <stop offset="100%" stop-color="#a87f28" />
    </linearGradient>

    <linearGradient id="torchFlame" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#e65100" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="75%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- Drop Shadows for Embossed 3D Plaque Effect -->
    <filter id="goldDropShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#050201" flood-opacity="0.8" />
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.9" />
    </filter>

    <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Mahogany Wooden Plaque -->
  <rect width="512" height="512" rx="${isMaskable ? '0' : '48'}" fill="url(#woodCenterGlow)" />

  <!-- Wood Grain Layer -->
  <g opacity="0.6">
    <rect y="32" width="512" height="6" fill="#422012" opacity="0.4" />
    <rect y="74" width="512" height="4" fill="#140703" opacity="0.5" />
    <rect y="128" width="512" height="8" fill="#3f1c10" opacity="0.3" />
    <rect y="186" width="512" height="5" fill="#190804" opacity="0.6" />
    <rect y="240" width="512" height="7" fill="#401e11" opacity="0.35" />
    <rect y="304" width="512" height="4" fill="#170703" opacity="0.55" />
    <rect y="368" width="512" height="9" fill="#442113" opacity="0.4" />
    <rect y="424" width="512" height="5" fill="#150603" opacity="0.6" />
    <rect y="476" width="512" height="6" fill="#3a1b0f" opacity="0.4" />
    <!-- Fine grain overlay -->
    <rect width="512" height="512" fill="url(#grainGrad)" />
  </g>

  <!-- Wooden Plaque Border / Bevel Rim -->
  <rect x="14" y="14" width="484" height="484" rx="${isMaskable ? '0' : '36'}" fill="none" stroke="#5a2c18" stroke-width="3" opacity="0.5" />
  <rect x="20" y="20" width="472" height="472" rx="${isMaskable ? '0' : '32'}" fill="none" stroke="#120603" stroke-width="2" opacity="0.8" />

  <!-- Inner Delicate Golden Filigree Frame -->
  <rect x="28" y="28" width="456" height="456" rx="${isMaskable ? '0' : '24'}" fill="none" stroke="url(#antiqueGold)" stroke-width="1.2" opacity="0.5" />

  <!-- Main Scaled Content Container -->
  <g transform="translate(${translateOffset}, ${translateOffset}) scale(${scale})" filter="url(#goldDropShadow)">
    
    <!-- Corner Filigree Ornaments -->
    <g stroke="url(#antiqueGold)" stroke-width="1.5" fill="none" opacity="0.85">
      <!-- Top Left -->
      <path d="M 38 52 C 38 42, 42 38, 52 38" />
      <circle cx="38" cy="56" r="1.5" fill="url(#antiqueGold)" />
      <circle cx="56" cy="38" r="1.5" fill="url(#antiqueGold)" />
      <!-- Top Right -->
      <path d="M 474 52 C 474 42, 470 38, 460 38" />
      <circle cx="474" cy="56" r="1.5" fill="url(#antiqueGold)" />
      <circle cx="456" cy="38" r="1.5" fill="url(#antiqueGold)" />
      <!-- Bottom Left -->
      <path d="M 38 460 C 38 470, 42 474, 52 474" />
      <circle cx="38" cy="456" r="1.5" fill="url(#antiqueGold)" />
      <circle cx="56" cy="474" r="1.5" fill="url(#antiqueGold)" />
      <!-- Bottom Right -->
      <path d="M 474 460 C 474 470, 470 474, 460 474" />
      <circle cx="474" cy="456" r="1.5" fill="url(#antiqueGold)" />
      <circle cx="456" cy="474" r="1.5" fill="url(#antiqueGold)" />
    </g>

    <!-- Radiance Sparkle Stars above Torch -->
    <!-- Center Sparkle Star -->
    <g transform="translate(256, 82) scale(0.9)" fill="url(#antiqueGold)" filter="url(#softGlow)">
      <polygon points="0,-18 3.5,-5 18,0 3.5,5 0,18 -3.5,5 -18,0 -3.5,-5" />
      <circle cx="0" cy="0" r="2" fill="#ffffff" />
    </g>
    <!-- Left Small Star -->
    <g transform="translate(236, 92) scale(0.45)" fill="url(#antiqueGold)">
      <polygon points="0,-14 3,-4 14,0 3,4 0,14 -3,4 -14,0 -3,-4" />
    </g>
    <!-- Right Small Star -->
    <g transform="translate(276, 92) scale(0.45)" fill="url(#antiqueGold)">
      <polygon points="0,-14 3,-4 14,0 3,4 0,14 -3,4 -14,0 -3,-4" />
    </g>
    <!-- Tiny Radiance Dots -->
    <circle cx="222" cy="106" r="1.8" fill="url(#antiqueGold)" />
    <circle cx="290" cy="106" r="1.8" fill="url(#antiqueGold)" />

    <!-- Radiant Rays behind Torch -->
    <g stroke="url(#antiqueGold)" stroke-width="1" opacity="0.65">
      <line x1="256" y1="94" x2="256" y2="76" />
      <line x1="247" y1="96" x2="238" y2="82" />
      <line x1="265" y1="96" x2="274" y2="82" />
      <line x1="240" y1="102" x2="228" y2="92" />
      <line x1="272" y1="102" x2="284" y2="92" />
    </g>

    <!-- Torch Flame -->
    <g filter="url(#flameGlow)">
      <!-- Outer Flame -->
      <path d="M 256 96 C 248 106, 244 116, 248 126 C 251 131, 256 133, 256 133 C 256 133, 261 131, 264 126 C 268 116, 264 106, 256 96 Z" fill="url(#torchFlame)" />
      <!-- Inner Bright Flame Core -->
      <path d="M 256 104 C 251 112, 249 119, 252 125 C 254 128, 256 129, 256 129 C 256 129, 258 128, 260 125 C 263 119, 261 112, 256 104 Z" fill="#ffffff" opacity="0.9" />
    </g>

    <!-- Torch Cup & Handle -->
    <g fill="url(#antiqueGold)" stroke="#6b4c16" stroke-width="0.8">
      <path d="M 248 132 L 264 132 L 261 142 L 251 142 Z" />
      <path d="M 250 142 L 262 142 L 257 154 L 255 154 Z" />
      <ellipse cx="256" cy="132" rx="8" ry="2" fill="#fff4d0" />
    </g>

    <!-- Laurel Wreath Embracing the Open Book -->
    <g fill="url(#antiqueGold)" stroke="#6b4c16" stroke-width="0.6">
      <!-- Left Laurel Branch -->
      <g>
        <path d="M 216 142 C 210 144, 206 148, 208 155 C 212 153, 218 148, 216 142 Z" />
        <path d="M 207 152 C 200 156, 197 162, 201 168 C 205 165, 210 158, 207 152 Z" />
        <path d="M 200 166 C 192 171, 190 178, 195 184 C 199 180, 203 172, 200 166 Z" />
        <path d="M 197 182 C 189 188, 188 196, 194 201 C 198 196, 201 187, 197 182 Z" />
        <path d="M 198 198 C 191 206, 191 214, 198 218 C 201 211, 202 203, 198 198 Z" />
        <!-- Vine Stem Left -->
        <path d="M 224 140 Q 192 178 202 222" fill="none" stroke="url(#antiqueGold)" stroke-width="2.5" stroke-linecap="round" />
      </g>

      <!-- Right Laurel Branch -->
      <g>
        <path d="M 296 142 C 302 144, 306 148, 304 155 C 300 153, 294 148, 296 142 Z" />
        <path d="M 305 152 C 312 156, 315 162, 311 168 C 307 165, 302 158, 305 152 Z" />
        <path d="M 312 166 C 320 171, 322 178, 317 184 C 313 180, 309 172, 312 166 Z" />
        <path d="M 315 182 C 323 188, 324 196, 318 201 C 314 196, 311 187, 315 182 Z" />
        <path d="M 314 198 C 321 206, 321 214, 314 218 C 311 211, 310 203, 314 198 Z" />
        <!-- Vine Stem Right -->
        <path d="M 288 140 Q 320 178 310 222" fill="none" stroke="url(#antiqueGold)" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </g>

    <!-- The Open Book with Embossed 'L' and 'P' -->
    <g>
      <!-- Book Outer Cover & Pages Silhouette (Gold 3D) -->
      <path d="M 256 160 Q 228 152 196 156 L 194 220 Q 228 214 256 226 Q 284 214 318 220 L 316 156 Q 284 152 256 160 Z" 
            fill="url(#antiqueGold)" stroke="#6b4c16" stroke-width="1.5" />
      
      <!-- Inside Pages Detail (Left Page & Right Page) -->
      <!-- Left Page Surface -->
      <path d="M 254 163 Q 229 155 200 159 L 198 216 Q 229 211 254 222 Z" 
            fill="#fff8e1" opacity="0.95" stroke="#947124" stroke-width="1" />
      
      <!-- Right Page Surface -->
      <path d="M 258 163 Q 283 155 312 159 L 314 216 Q 283 211 258 222 Z" 
            fill="#fff8e1" opacity="0.95" stroke="#947124" stroke-width="1" />

      <!-- Center Spine Crease & Shadow -->
      <line x1="256" y1="160" x2="256" y2="225" stroke="#684711" stroke-width="2" />
      <polygon points="256,160 254,222 258,222" fill="#54370a" opacity="0.4" />

      <!-- Subtle Page Lines on Left Page -->
      <line x1="206" y1="172" x2="218" y2="171" stroke="#aa8232" stroke-width="1" opacity="0.6" />
      <line x1="206" y1="204" x2="228" y2="202" stroke="#aa8232" stroke-width="1" opacity="0.6" />

      <!-- Subtle Page Lines on Right Page -->
      <line x1="294" y1="172" x2="306" y2="171" stroke="#aa8232" stroke-width="1" opacity="0.6" />
      <line x1="284" y1="204" x2="306" y2="202" stroke="#aa8232" stroke-width="1" opacity="0.6" />

      <!-- Embossed Letter 'L' on Left Page -->
      <text x="227" y="196" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="29" 
            font-weight="bold" 
            fill="url(#antiqueGold)" 
            stroke="#5c3e0e" 
            stroke-width="1" 
            text-anchor="middle">L</text>

      <!-- Embossed Letter 'P' on Right Page -->
      <text x="285" y="196" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="29" 
            font-weight="bold" 
            fill="url(#antiqueGold)" 
            stroke="#5c3e0e" 
            stroke-width="1" 
            text-anchor="middle">P</text>
    </g>

    <!-- Baroque Filigree Flourish Below Book -->
    <g stroke="url(#antiqueGold)" stroke-width="2" fill="none" stroke-linecap="round">
      <path d="M 210 232 C 224 240, 242 242, 256 237 C 270 242, 288 240, 302 232" />
      <path d="M 235 238 C 245 245, 256 248, 256 248 C 256 248, 267 245, 277 238" stroke-width="1.4" />
      <!-- Scroll Curls -->
      <path d="M 204 233 C 198 231, 196 225, 201 222 C 206 220, 210 226, 206 230" stroke-width="1.5" />
      <path d="M 308 233 C 314 231, 316 225, 311 222 C 306 220, 302 226, 306 230" stroke-width="1.5" />
      <!-- Center Diamond Drop -->
      <polygon points="256,242 259,246 256,250 253,246" fill="url(#antiqueGold)" stroke="none" />
    </g>

    <!-- Upper Ornamental Divider Bar -->
    <g transform="translate(0, 10)">
      <line x1="84" y1="264" x2="428" y2="264" stroke="url(#goldHorizontal)" stroke-width="1.8" />
      <!-- Left decorative curls -->
      <path d="M 84 264 C 70 264, 62 258, 68 252 C 73 247, 81 254, 76 260" fill="none" stroke="url(#antiqueGold)" stroke-width="1.5" />
      <!-- Right decorative curls -->
      <path d="M 428 264 C 442 264, 450 258, 444 252 C 439 247, 431 254, 436 260" fill="none" stroke="url(#antiqueGold)" stroke-width="1.5" />
      <!-- Center Star Sparkle -->
      <g transform="translate(256, 264) scale(0.65)" fill="url(#antiqueGold)">
        <polygon points="0,-12 2.5,-3 12,0 2.5,3 0,12 -2.5,3 -12,0 -2.5,-3" />
      </g>
    </g>

    <!-- Main Stately Title: LEARNING POINT -->
    <g transform="translate(256, 322)">
      <!-- Deep 3D Shadow for Embossed Look -->
      <text x="0" y="2" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="44" 
            font-weight="800" 
            letter-spacing="5.5" 
            fill="#0a0402" 
            text-anchor="middle">LEARNING POINT</text>
      
      <text x="0" y="0" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="44" 
            font-weight="800" 
            letter-spacing="5.5" 
            fill="url(#antiqueGold)" 
            stroke="#5c3f10" 
            stroke-width="1.2" 
            text-anchor="middle">LEARNING POINT</text>
    </g>

    <!-- Delicate Sub-Divider Bar -->
    <g transform="translate(0, 18)">
      <line x1="120" y1="334" x2="392" y2="334" stroke="url(#goldHorizontal)" stroke-width="1.2" />
      <circle cx="116" cy="334" r="2" fill="url(#antiqueGold)" />
      <circle cx="396" cy="334" r="2" fill="url(#antiqueGold)" />
      <!-- Tiny Center Diamond -->
      <polygon points="256,331 259,334 256,337 253,334" fill="url(#antiqueGold)" />
    </g>

    <!-- Subtitle: Aesthetic and Classic Education | Knowledge is Light -->
    <g transform="translate(256, 376)">
      <!-- Subtle shadow for readability -->
      <text x="0" y="1" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="14.5" 
            font-weight="500" 
            letter-spacing="1.8" 
            fill="#0d0503" 
            text-anchor="middle">Aesthetic and Classic Education | Knowledge is Light</text>
      
      <text x="0" y="0" 
            font-family="'Cinzel', 'Liberation Serif', 'FreeSerif', 'Times New Roman', Georgia, serif" 
            font-size="14.5" 
            font-weight="500" 
            letter-spacing="1.8" 
            fill="#eedaa0" 
            stroke="#4e330a" 
            stroke-width="0.3" 
            text-anchor="middle">Aesthetic and Classic Education | Knowledge is Light</text>
    </g>

    <!-- Bottom Baroque Scroll Flourish -->
    <g stroke="url(#antiqueGold)" stroke-width="1.4" fill="none" stroke-linecap="round" transform="translate(0, 12)">
      <path d="M 184 396 C 210 404, 236 405, 256 401 C 276 405, 302 404, 328 396" />
      <path d="M 230 403 C 242 411, 256 414, 256 414 C 256 414, 270 411, 282 403" stroke-width="1.1" />
      <!-- Left Curl -->
      <path d="M 182 396 C 174 394, 172 388, 178 384 C 183 381, 188 387, 184 392" />
      <!-- Right Curl -->
      <path d="M 330 396 C 338 394, 340 388, 334 384 C 329 381, 324 387, 328 392" />
      <!-- Hanging Drop -->
      <polygon points="256,415 258,419 256,423 254,419" fill="url(#antiqueGold)" stroke="none" />
    </g>

  </g>
</svg>`;
}

async function run() {
  console.log('Generating Learning Point icons...');

  const standardSVG = buildLearningPointSVG(false);
  const maskableSVG = buildLearningPointSVG(true);

  // Write base SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSVG, 'utf-8');

  // Convert to PNG buffers using sharp
  const buffer512 = await sharp(Buffer.from(standardSVG))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const buffer192 = await sharp(Buffer.from(standardSVG))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const bufferMaskable512 = await sharp(Buffer.from(maskableSVG))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const bufferAppleTouch = await sharp(Buffer.from(standardSVG))
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const bufferFavicon = await sharp(Buffer.from(standardSVG))
    .resize(64, 64)
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();

  // Save to public directory
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), buffer512);
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), buffer192);
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), bufferMaskable512);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), bufferAppleTouch);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), bufferFavicon);

  // Also check if dist exists, sync to dist so current preview has immediate assets
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'icon.svg'), standardSVG);
    fs.writeFileSync(path.join(distDir, 'pwa-512x512.png'), buffer512);
    fs.writeFileSync(path.join(distDir, 'pwa-192x192.png'), buffer192);
    fs.writeFileSync(path.join(distDir, 'pwa-maskable-512x512.png'), bufferMaskable512);
    fs.writeFileSync(path.join(distDir, 'apple-touch-icon.png'), bufferAppleTouch);
    fs.writeFileSync(path.join(distDir, 'favicon.ico'), bufferFavicon);
  }

  console.log('All Learning Point icons generated successfully!');
}

run().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
