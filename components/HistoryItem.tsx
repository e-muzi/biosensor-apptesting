import React from 'react';
import type { HistoryRecord } from '../types';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ record, onDelete }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
      <img src={record.imageSrc} alt="History sample" className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
      <div className="flex-grow space-y-1">
        <p className="font-semibold text-lg text-cyan-400">{record.concentration.toFixed(2)} µM</p>
        <p className="text-sm text-gray-300">Pesticide: {record.pesticide}</p>
        <p className="text-sm text-gray-400">Brightness: {record.brightness.toFixed(2)}</p>
        <p className="text-xs text-gray-500">{record.timestamp}</p>
      </div>
      <button onClick={() => onDelete(record.id)} className="text-red-500 hover:text-red-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};