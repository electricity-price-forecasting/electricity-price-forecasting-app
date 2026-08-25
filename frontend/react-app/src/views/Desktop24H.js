import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generate24HData } from '../utils/dateGenerators';

export const Desktop24H = ({ onSwitchTo7D }) => {
  const data = generate24HData();

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2>Figma Frame: Desktop - 24H</h2>
        <button onClick={onSwitchTo7D} style={{ cursor: 'pointer' }}>Switch to 7D View ›</button>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="actual" stroke="#2563eb" fill="#eff6ff" />
          <Area type="monotone" dataKey="forecast" stroke="#60a5fa" strokeDasharray="3 3" fill="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};