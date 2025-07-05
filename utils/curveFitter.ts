import type { CalibrationPoint } from '../types';

export function interpolateConcentration(brightness: number, points: CalibrationPoint[]): number {
  if (points.length < 2) {
    return 0;
  }
  
  const sortedPointsByBrightness = [...points].sort((a, b) => a.brightness - b.brightness);

  if (brightness <= sortedPointsByBrightness[0].brightness) {
    return sortedPointsByBrightness[0].concentration;
  }
  if (brightness >= sortedPointsByBrightness[sortedPointsByBrightness.length - 1].brightness) {
    return sortedPointsByBrightness[sortedPointsByBrightness.length - 1].concentration;
  }

  let p1: CalibrationPoint | null = null;
  let p2: CalibrationPoint | null = null;
  
  for (let i = 0; i < sortedPointsByBrightness.length - 1; i++) {
    if (brightness >= sortedPointsByBrightness[i].brightness && brightness <= sortedPointsByBrightness[i + 1].brightness) {
      p1 = sortedPointsByBrightness[i];
      p2 = sortedPointsByBrightness[i + 1];
      break;
    }
  }

  if (!p1 || !p2) {
     return 0; // Should not happen with the checks above
  }

  if (p2.brightness === p1.brightness) {
    return p1.concentration;
  }
  
  // Linear interpolation
  const concentration = p1.concentration + 
    ((brightness - p1.brightness) * (p2.concentration - p1.concentration)) / (p2.brightness - p1.brightness);
    
  return Math.max(0, concentration);
}
