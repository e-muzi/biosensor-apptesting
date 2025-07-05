
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CalibrationPoint } from '../types';

interface StandardCurveChartProps {
  data: CalibrationPoint[];
}

export const StandardCurveChart: React.FC<StandardCurveChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.concentration - b.concentration);

  return (
    <div className="w-full h-64 bg-gray-800 p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sortedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis 
            dataKey="concentration" 
            name="Concentration" 
            unit="µM" 
            stroke="#cbd5e0"
            tick={{ fill: '#cbd5e0', fontSize: 12 }} 
          />
          <YAxis 
            stroke="#cbd5e0" 
            label={{ value: 'Brightness', angle: -90, position: 'insideLeft', fill: '#cbd5e0', dx: 10 }}
            tick={{ fill: '#cbd5e0', fontSize: 12 }} 
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          <Line type="monotone" dataKey="brightness" stroke="#2dd4bf" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 5}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
