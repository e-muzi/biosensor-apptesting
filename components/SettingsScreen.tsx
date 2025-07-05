import React, { useState } from 'react';
import { useHistoryStore } from '../state/historyStore';
import { AppButton } from './AppButton';

export const SettingsScreen: React.FC = () => {
  const { clearHistory } = useHistoryStore();
  const [feedback, setFeedback] = useState('');

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all measurement history? This cannot be undone.')) {
      clearHistory();
      setFeedback('Measurement history cleared.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Settings</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Data Management</h3>
          <p className="text-sm text-gray-400 mt-1">Permanently delete stored application data.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <p className="font-medium text-gray-200">Clear Measurement History</p>
            <p className="text-sm text-gray-400">Deletes all saved analysis records.</p>
          </div>
          <AppButton onClick={handleClearHistory} variant="danger" className="mt-2 sm:mt-0">
            Clear History
          </AppButton>
        </div>

        {feedback && (
          <div className="text-center p-2 bg-green-800 text-green-200 rounded-md">
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-500">
        <p className="font-bold">Aptasense v1.1.0</p>
        <p>Biosensor Analysis Platform</p>
      </div>
    </div>
  );
};