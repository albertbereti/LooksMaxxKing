
// Utility to compress images before sending to API to reduce payload size and latency
// Upgraded for high-precision forensic analysis
export const compressImage = (base64Str: string, maxWidth = 2048, quality = 0.95): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio while resizing
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          // Use high quality interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
          resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => {
        resolve(base64Str); // Fallback
    }
  });
};

export const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) resolve(ev.target.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
