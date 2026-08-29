const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a simple 256x256 icon
function createIcon() {
  const size = 256;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - Amazon blue gradient-like
  ctx.fillStyle = '#0066CC';
  ctx.fillRect(0, 0, size, size);

  // Add a subtle gradient effect (darker at top)
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#0052A3');
  gradient.addColorStop(1, '#0066CC');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add a shield-like shape in the center
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.25);
  ctx.lineTo(size * 0.75, size * 0.35);
  ctx.lineTo(size * 0.75, size * 0.65);
  ctx.lineTo(size * 0.5, size * 0.85);
  ctx.lineTo(size * 0.25, size * 0.65);
  ctx.lineTo(size * 0.25, size * 0.35);
  ctx.closePath();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Add text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('IT', size * 0.5, size * 0.55);

  // Add subtitle
  ctx.font = '16px Arial';
  ctx.fillText('SUPPORT', size * 0.5, size * 0.75);

  // Save as PNG
  const pngBuffer = canvas.toBuffer('image/png');
  const pngPath = path.join(__dirname, '..', 'build', 'icon.png');
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`PNG icon created at ${pngPath}`);

  // Keep the PNG - electron-builder will auto-convert to ICO during build
  const icoPath = path.join(__dirname, '..', 'build', 'icon.ico');

  // Create a placeholder ICO by copying the PNG (electron-builder handles conversion)
  // For Windows, we need a valid PNG at minimum (electron-builder >= 24 will auto-convert)
  console.log(`PNG icon created at ${pngPath}`);
  console.log('electron-builder will convert PNG to ICO during the build process');

  // Create a simple ICO file header pointing to the PNG data
  // This is a fallback for systems that need an ICO file
  try {
    const pngData = fs.readFileSync(pngPath);

    // ICO file format: header + directory entry + PNG data
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);      // Reserved
    header.writeUInt16LE(1, 2);      // Type: 1 = ICO
    header.writeUInt16LE(1, 4);      // Number of images

    const directory = Buffer.alloc(16);
    directory.writeUInt8(0, 0);       // Width (0 = 256)
    directory.writeUInt8(0, 1);       // Height (0 = 256)
    directory.writeUInt8(0, 2);       // Color palette
    directory.writeUInt8(0, 3);       // Reserved
    directory.writeUInt16LE(1, 4);   // Color planes
    directory.writeUInt16LE(32, 6);   // Bits per pixel
    directory.writeUInt32LE(pngData.length, 8);  // Image size
    directory.writeUInt32LE(22, 12);  // Offset to image data (6 + 16 = 22)

    const icoData = Buffer.concat([header, directory, pngData]);
    fs.writeFileSync(icoPath, icoData);
    console.log(`ICO icon created at ${icoPath} (${icoData.length} bytes)`);
  } catch (error) {
    console.error('Error creating ICO:', error.message);
    console.log(`PNG file available at ${pngPath}`);
  }
}

module.exports = { createIcon };

// Run if called directly
if (require.main === module) {
  createIcon();
}