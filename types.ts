export interface CalibrationPoint {
  concentration: number;
  brightness: number;
}

export interface AnalysisResult {
  pesticide: string;
  brightness: number;
  concentration: number;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  imageSrc: string;
  results: AnalysisResult[];
}

export type Screen = 'capture' | 'history' | 'settings' | 'analysis';