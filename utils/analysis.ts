// Defines a Region of Interest as a rectangle { x, y, width, height } in percentage
interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Converts RGB color to HSV. Returns V (value/brightness) component
function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
}

export function calculateImageBrightness(image: HTMLImageElement, roi: ROI): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(image, 0, 0);

      const roiX = Math.floor(canvas.width * roi.x);
      const roiY = Math.floor(canvas.height * roi.y);
      const roiWidth = Math.floor(canvas.width * roi.width);
      const roiHeight = Math.floor(canvas.height * roi.height);
      
      const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
      const data = imageData.data;
      
      let totalBrightness = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = rgbToHsv_V(r, g, b);
        totalBrightness += brightness;
        pixelCount++;
      }
      
      const averageBrightness = totalBrightness / pixelCount;
      resolve(averageBrightness);

    } catch (error) {
      reject(error);
    }
  });
}
