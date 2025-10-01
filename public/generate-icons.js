// Simple script to generate PWA icons
const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Steering wheel icon
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size / 16;
  ctx.lineCap = 'round';
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.3;
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Center dot
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Save file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
}

// Generate icons
generateIcon(192, 'pwa-192x192.png');
generateIcon(512, 'pwa-512x512.png');
