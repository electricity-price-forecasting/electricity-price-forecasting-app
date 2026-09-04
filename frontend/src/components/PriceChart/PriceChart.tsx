import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PriceDataPoint } from './frontend/src/types/forecast';

interface PriceChartProps {
  data: PriceDataPoint[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  return (
    <div className="w-full h-96 bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Прогноз цін на електроенергію (грн/кВт·год)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="timestamp" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          <Legend />
          
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="#e0f2fe"
            name="Верхня межа довіри"
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="#ffffff"
            name="Нижня межа довіри"
          />
          
          <Line
            type="monotone"
            dataKey="actualPrice"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Фактична ціна"
          />
          <Line
            type="monotone"
            dataKey="predictedPrice"
            stroke="#16a34a"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Прогнозована ціна"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};