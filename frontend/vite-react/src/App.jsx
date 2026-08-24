import React, { useState, useMemo } from 'react';
import { getDynamicDashboardData } from './constants/dashboardData';
import { PriceForecastChart } from './components/PriceForecastChart';
import styles from './App.module.css';

export default function App() {
  const [period, setPeriod] = useState('24H');
  const dashboardData = useMemo(() => getDynamicDashboardData(), []);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>✦ Voltio Dashboard</header>
      <PriceForecastChart 
        chartData={dashboardData.charts[period] || dashboardData.charts['24H']} 
        activePeriod={period}
        onPeriodChange={setPeriod}
      />
    </div>
  );
}