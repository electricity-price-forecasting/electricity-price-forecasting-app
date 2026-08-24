import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generate24HData } from '../utils/dateGenerators';
import styles from './DesktopView.module.css';

export const Desktop24H = ({ onSwitchTo7D }) => {
  const data = generate24HData();

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Figma Frame: Desktop - 24H</h2>
        <button className={styles.switchBtn} onClick={onSwitchTo7D}>Switch to 7D View ›</button>
      </div>
      <ResponsiveContainer width="100%" height={220}>
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