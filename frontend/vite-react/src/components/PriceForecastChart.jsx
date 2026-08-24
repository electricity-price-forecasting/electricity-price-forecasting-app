import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatFullTimestamp } from '../utils/dateHelpers';
import styles from './PriceForecastChart.module.css';

export const PriceForecastChart = ({ chartData, activePeriod, onPeriodChange }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Price Forecast</h3>
        <div className={styles.periodControls}>
          {['24H', '7D', '30D', '12M'].map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`${styles.tabBtn} ${activePeriod === p ? styles.activeTab : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip />
          <Area type="monotone" dataKey="rangeHigh" stroke="none" fill="var(--chart-area)" fillOpacity={0.8} />
          <Area type="monotone" dataKey="actual" stroke="var(--primary-blue)" strokeWidth={2} fill="none" connectNulls />
          <Area type="monotone" dataKey="forecast" stroke="var(--chart-stroke-forecast)" strokeDasharray="3 3" strokeWidth={2} fill="none" connectNulls />
        </AreaChart>
      </ResponsiveContainer>

      <div className={styles.footer}>
        {formatFullTimestamp(new Date())}
      </div>
    </div>
  );
};