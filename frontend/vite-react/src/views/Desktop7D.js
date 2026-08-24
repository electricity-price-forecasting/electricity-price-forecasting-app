import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generate7DData } from '../utils/dateGenerators';
import styles from './DesktopView.module.css';

export const Desktop7D = ({ onSwitchTo24H }) => {
  const data = generate7DData();

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Figma Frame: Desktop - 7D</h2>
        <button className={styles.switchBtn} onClick={onSwitchTo24H}>Switch to 24H View ›</button>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="actual" stroke="#16a34a" fill="#f0fdf4" />
          <Area type="monotone" dataKey="forecast" stroke="#4ade80" strokeDasharray="3 3" fill="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};