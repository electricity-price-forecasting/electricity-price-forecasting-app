export const generate24HData = () => {
  const now = new Date();
  const format = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  
  const today = format(now);
  const tomorrow = format(new Date(now.setDate(now.getDate() + 1)));

  return [
    { time: `00:00 ${today}`, actual: 50, forecast: null },
    { time: `08:00 ${today}`, actual: 75, forecast: null },
    { time: `16:00 ${today}`, actual: 90, forecast: 90 },
    { time: `00:00 ${tomorrow}`, actual: null, forecast: 65 }
  ];
};

export const generate7DData = () => {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - 3 + i);
    return {
      time: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      actual: i <= 3 ? 45 + i * 10 : null,
      forecast: i >= 3 ? 50 + i * 8 : null
    };
  });
};