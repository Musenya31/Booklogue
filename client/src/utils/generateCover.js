export const generateBookCover = (title = 'Untitled', author = '') => {
  if (!title) title = 'Untitled';

  // Canvas size matching your card for better fit
  const width = 160;
  const height = 240;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#21808D');
  gradient.addColorStop(1, '#1A6873');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Initial letter (centered)
  const initial = title.charAt(0).toUpperCase();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 100px Arial';  // Adjust size proportionally
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, width / 2, height / 2 - 20);

  // Title text, wrapping within width
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#ffffff';

  const words = title.split(' ');
  let line = '';
  let y = height * 0.65;  // position below initial letter
  const maxWidth = width * 0.8; // 80% of width

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), width / 2, y);
      line = words[i] + ' ';
      y += 14;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), width / 2, y);

  // Author
  if (author) {
    ctx.font = '10px Arial';
    ctx.fillStyle = '#E0E0E0';
    ctx.fillText(author, width / 2, height - 20);
  }

  return canvas.toDataURL('image/jpeg', 0.6);  // Reduced quality
};
