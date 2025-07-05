import React from 'react';
import { useHistoryStore } from '../state/historyStore';
import { HistoryItem } from './HistoryItem';

export const HistoryScreen: React.FC = () => {
  const { records, removeRecord } = useHistoryStore();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Measurement History</h2>
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map(record => (
            <HistoryItem key={record.id} record={record} onDelete={removeRecord} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No saved records</h3>
          <p className="mt-1 text-sm text-gray-500">Perform an analysis to see results here.</p>
        </div>
      )}
    </div>
  );
};
