import React from 'react';
import type { AnalysisResult } from '../../types';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-gray-700 p-3 rounded-lg text-center shadow">
      <p className="font-bold text-cyan-400 text-md">{result.pesticide}</p>
      <p className="text-3xl font-extrabold text-white my-1">
        {result.concentration.toFixed(2)}
        <span className="text-lg font-semibold ml-1">µM</span>
      </p>
      <p className="text-xs text-gray-400">Brightness: {result.brightness.toFixed(2)}</p>
    </div>
  );
}; 