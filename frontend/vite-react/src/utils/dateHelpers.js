export const formatDateShort = (date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const formatFullTimestamp = (date) => {
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `Forecast generated today, ${time}`;
};