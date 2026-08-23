import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import styles from './PriceForecastChart.module.css';

export const PriceForecastChart = ({ 
  chartData, 
  activePeriod = '24H', 
  onPeriodChange,
  periodSummaries = [] 
}) => {
  const periods = ['24H', '7D', '30D', '12M'];

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Price Forecast ⓘ</h3>
          <div className={styles.periodTabs}>
            {periods.map((p) => (
              <button
                key={p}
                className={`${styles.tabBtn} ${activePeriod === p ? styles.activeTab : ''}`}
                onClick={() => onPeriodChange && onPeriodChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <select className={styles.select}>
          <option>Each 15 min</option>
          <option>Hourly</option>
          <option>Daily</option>
        </select>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 160]} ticks={[0, 40, 80, 120, 160]} />
            <Tooltip />
            <Area type="monotone" dataKey="rangeHigh" stroke="none" fill="#eff6ff" fillOpacity={0.7} />
            <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} fill="url(#actualFill)" connectNulls />
            <Area type="monotone" dataKey="forecast" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth={2} fill="none" connectNulls />
            <ReferenceLine x="16:00 28 Jul" stroke="#2563eb" strokeDasharray="2 2" />
          </AreaChart>
        </ResponsiveContainer>

        <div className={styles.legend}>
          <span><span className={styles.actualLine}></span> Actual price</span>
          <span><span className={styles.forecastLine}></span> Forecast</span>
          <span><span className={styles.rangeBox}></span> Prices range</span>
        </div>
      </div>

      {periodSummaries.length > 0 && (
        <div className={styles.summariesGrid}>
          {periodSummaries.map((item, idx) => (
            <div key={idx} className={styles.summaryCard}>
              <span className={styles.summaryLabel}>{item.label}</span>
              <strong className={styles.summaryRange}>{item.range}</strong>
              <Badge type={item.type}>{item.confidence}</Badge>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span>Forecast generated today, 10:15 AM</span>
        <span>Data sources: ENTSO-E</span>
      </div>
    </Card>
  );
};