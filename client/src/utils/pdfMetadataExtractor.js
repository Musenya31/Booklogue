import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const extractPDFMetadata = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const metadata = await pdf.getMetadata();
    const info = metadata.info;

    let title = info.Title || file.name.replace('.pdf', '');
    let author = info.Author || '';
    const numPages = pdf.numPages;

    // Card/cover target size in your UI (e.g. 140x210 or 160x240 for 2:3)
    const CARD_W = 140;
    const CARD_H = 210;

    const page = await pdf.getPage(1);
    const pageViewport = page.getViewport({ scale: 1 }); // PDF's native size

    // Calculate cropping to preserve aspect ratio (same as your logic)
    const pdfRatio = pageViewport.width / pageViewport.height;
    const cardRatio = CARD_W / CARD_H;

    let renderWidth, renderHeight, offsetX, offsetY;
    if (pdfRatio > cardRatio) {
      // PDF is wider, crop the sides
      renderHeight = CARD_H;
      renderWidth = pdfRatio * renderHeight;
      offsetX = (CARD_W - renderWidth) / 2;
      offsetY = 0;
    } else {
      // PDF is taller, crop top/bottom
      renderWidth = CARD_W;
      renderHeight = renderWidth / pdfRatio;
      offsetX = 0;
      offsetY = (CARD_H - renderHeight) / 2;
    }

    // Set output canvas to card size
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const context = canvas.getContext('2d');

    // Render PDF page to a temporary canvas at correct scale
    const renderViewport = page.getViewport({ scale: renderWidth / pageViewport.width });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = renderWidth;
    tempCanvas.height = renderHeight;
    const tempContext = tempCanvas.getContext('2d');

    await page.render({ canvasContext: tempContext, viewport: renderViewport }).promise;

    // Draw rendered PDF into card canvas, cropping as needed
    context.drawImage(tempCanvas, offsetX, offsetY, renderWidth, renderHeight);

    // Output as base64 JPEG for UI
    const coverImage = canvas.toDataURL('image/jpeg', 0.7);

    return {
      title: title || 'Untitled Book',
      author: author || 'Unknown Author',
      pages: numPages,
      coverImage,
      publishedYear: info.CreationDate ? new Date(info.CreationDate).getFullYear() : new Date().getFullYear(),
    };
  } catch (error) {
    console.error('Error extracting PDF metadata:', error);
    return null;
  }
};
;
export const extractPDFMetadataLowQuality = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    // Convert to base64 with lower quality
    const coverImage = canvas.toDataURL('image/jpeg', 0.5); // Reduced quality
    
    return {
      title: title || 'Untitled Book',
      author: author || 'Unknown Author',
      pages: numPages,
      coverImage: coverImage,
      publishedYear: info.CreationDate ? new Date(info.CreationDate).getFullYear() : new Date().getFullYear()
    };
  } catch (error) {
    console.error('Error extracting PDF metadata:', error);
    return null;
  }
};

export const extractBasicPDFInfo = (file) => {
  return {
    title: file.name.replace('.pdf', '').replace(/_/g, ' '),
    author: '',
    pages: 0,
    coverImage: null,
    publishedYear: new Date().getFullYear()
  };
};
