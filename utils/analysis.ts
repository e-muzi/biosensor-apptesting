import { PREDEFINED_PESTICIDES } from "../state/pesticideStore";

// Defines a Region of Interest as a rectangle { x, y, width, height } in percentage
export interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PesticideROI {
    name: string;
    roi: ROI;
}

// Hardcoded ROIs for the 4-pesticide kit layout (2x2 grid)
export const PESTICIDE_ROIS: PesticideROI[] = [
    { name: PREDEFINED_PESTICIDES[0].name, roi: { x: 0.1, y: 0.1, width: 0.35, height: 0.35 } }, // Top-left
    { name: PREDEFINED_PESTICIDES[1].name, roi: { x: 0.55, y: 0.1, width: 0.35, height: 0.35 } }, // Top-right
    { name: PREDEFINED_PESTICIDES[2].name, roi: { x: 0.1, y: 0.55, width: 0.35, height: 0.35 } }, // Bottom-left
    { name: PREDEFINED_PESTICIDES[3].name, roi: { x: 0.55, y: 0.55, width: 0.35, height: 0.35 } }, // Bottom-right
];

// Converts RGB color to HSV. Returns V (value/brightness) component.
function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
}

function calculateBrightnessForRoi(ctx: CanvasRenderingContext2D, roi: ROI): number {
    const canvas = ctx.canvas;
    const roiX = Math.floor(canvas.width * roi.x);
    const roiY = Math.floor(canvas.height * roi.y);
    const roiWidth = Math.floor(canvas.width * roi.width);
    const roiHeight = Math.floor(canvas.height * roi.height);
    
    if (roiWidth <= 0 || roiHeight <= 0) return 0;

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
    
    return totalBrightness / pixelCount;
}

export function calculateMultipleBrightness(image: HTMLImageElement, rois: PesticideROI[]): Promise<{ name: string; brightness: number; }[]> {
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

      const results = rois.map(pesticideROI => {
          const brightness = calculateBrightnessForRoi(ctx, pesticideROI.roi);
          return { name: pesticideROI.name, brightness };
      });
      
      resolve(results);

    } catch (error) {
      reject(error);
    }
  });
}