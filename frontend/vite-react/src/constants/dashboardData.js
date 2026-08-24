import { formatDateShort } from '../utils/dateHelpers';

export const getDynamicDashboardData = () => {
  const now = new Date();
  const todayStr = formatDateShort(now);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = formatDateShort(tomorrow);

  const chart24H = [
    { time: `00:00 ${todayStr}`, actual: 48, forecast: null, rangeHigh: 54 },
    { time: `04:00 ${todayStr}`, actual: 62, forecast: null, rangeHigh: 70 },
    { time: `08:00 ${todayStr}`, actual: 42, forecast: null, rangeHigh: 50 },
    { time: `12:00 ${todayStr}`, actual: 68, forecast: null, rangeHigh: 76 },
    { time: `16:00 ${todayStr}`, actual: 95, forecast: 95, rangeHigh: 110 },
    { time: `18:00 ${todayStr}`, actual: null, forecast: 90, rangeHigh: 105 },
    { time: `00:00 ${tomorrowStr}`, actual: null, forecast: 72, rangeHigh: 88 }
  ];

  const chart7D = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 3 + i);
    const label = formatDateShort(d);
    return {
      time: label,
      actual: i <= 3 ? 50 + (i * 8) : null,
      forecast: i >= 3 ? 55 + (i * 6) : null,
      rangeHigh: 70 + (i * 7)
    };
  });

  return {
    highlights: {
      currentPrice: "82.40",
      currency: "€",
      unit: "/MWh",
      averagePrice: "74.20",
      averageChange: "+2.4%",
      peakPrice: "120.50",
      peakChange: "-1.1%",
      lowPrice: "31.20",
      lowChange: "-2.1%",
      confidence: "81%"
    },
    drivers: [
      { title: "Wind Generation", desc: "Strong downward pressure", val: "12 GW → 21 GW", tag: "-2.1%", type: "green", icon: "💨" },
      { title: "Solar Generation", desc: "Downward pressure", val: "12 GW → 21 GW", tag: "-2.1%", type: "green", icon: "☀️" },
      { title: "Electricity Demand", desc: "Moderate demand", val: "38 GW → 42 GW", tag: "+3€", type: "red", icon: "👥" },
      { title: "Gas Prices", desc: "High cost pressure", val: "+8%", tag: "+5€", type: "red", icon: "🔥" }
    ],
    charts: {
      '24H': chart24H,
      '7D': chart7D
    }
  };
};