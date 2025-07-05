
export interface CalibrationPoint {
  concentration: number;
  brightness: number;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  brightness: number;
  concentration: number;
  imageSrc: string;
  pesticide: string;
}

export type Screen = 'capture' | 'history' | 'settings' | 'analysis';