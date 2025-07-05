import React from 'react';
import { usePesticideStore } from '../state/pesticideStore';
import { useHistoryStore } from '../state/historyStore';
import { interpolateConcentration } from '../utils/curveFitter';
import { AppButton } from './AppButton';

interface AnalysisResultScreenProps {
  brightness: number;
  imageSrc: string;
  pesticide: string;
  onDiscard: () => void;
  onSave: () => void;
}

export const AnalysisResultScreen: React.FC<AnalysisResultScreenProps> = ({ brightness, imageSrc, pesticide, onDiscard, onSave }) => {
  const { getCurveForPesticide } = usePesticideStore();
  const { addRecord } = useHistoryStore();

  const points = getCurveForPesticide(pesticide);
  const concentration = interpolateConcentration(brightness, points);

  const handleSave = () => {
    const newRecord = {
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      brightness,
      concentration,
      imageSrc,
      pesticide,
    };
    addRecord(newRecord);
    onSave();
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Analysis Result</h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Sample Image</h3>
            <img src={imageSrc} alt="Analyzed sample" className="rounded-lg max-h-64 w-auto" />
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Calculated Brightness</p>
              <p className="text-3xl font-bold text-gray-100">{brightness.toFixed(2)}</p>
            </div>
            <div className="w-full h-px bg-gray-700"></div>
            <div>
              <p className="text-sm font-medium text-gray-400">For: <span className="font-semibold text-gray-300">{pesticide}</span></p>
              <p className="text-lg font-medium text-cyan-400">Estimated Concentration</p>
              <p className="text-5xl font-extrabold text-cyan-300">
                {concentration.toFixed(2)}
                <span className="text-2xl font-semibold ml-2">µM</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <AppButton onClick={onDiscard} variant="secondary">Discard & Recapture</AppButton>
        <AppButton onClick={handleSave}>Save Result</AppButton>
      </div>
    </div>
  );
};