import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { TodaysHighlights } from './components/TodaysHighlights';
import { PriceDrivers } from './components/PriceDrivers';
import { PriceForecastChart } from './components/PriceForecastChart';
import { fetchDashboardData } from './services/api';
import { 
  INITIAL_HIGHLIGHTS, 
  INITIAL_DRIVERS, 
  MOCK_CHART_DATA, 
  MOCK_PERIOD_SUMMARY 
} from './constants/dashboardData';
import styles from './App.module.css';

export default function App() {
  const [country, setCountry] = useState('Poland');
  const [activeTab, setActiveTab] = useState('p-drivers');
  const [period, setPeriod] = useState('24H');
  const [highlights, setHighlights] = useState(INITIAL_HIGHLIGHTS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [chartData, setChartData] = useState(MOCK_CHART_DATA['24H']);

  useEffect(() => {
    async function loadData() {
      const apiResult = await fetchDashboardData(country, period);
      if (apiResult) {
        if (apiResult.highlights) setHighlights(apiResult.highlights);
        if (apiResult.drivers) setDrivers(apiResult.drivers);
        if (apiResult.chartData) setChartData(apiResult.chartData);
      } else {
        setChartData(MOCK_CHART_DATA[period] || MOCK_CHART_DATA['24H']);
      }
    }
    loadData();
  }, [country, period]);

  return (
    <div className={styles.layoutContainer}>
      <TopNavbar country={country} currency="EUR/MWh" onCountryChange={setCountry} />
      <div className={styles.workspace}>
        <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />
        <main className={styles.mainGrid}>
          <div className={styles.topSection}>
            <TodaysHighlights highlights={highlights} />
            <PriceDrivers drivers={drivers} />
          </div>
          <div className={styles.bottomSection}>
            <PriceForecastChart 
              chartData={chartData} 
              activePeriod={period}
              onPeriodChange={setPeriod}
              periodSummaries={MOCK_PERIOD_SUMMARY}
            />
          </div>
        </main>
      </div>
    </div>
  );
}