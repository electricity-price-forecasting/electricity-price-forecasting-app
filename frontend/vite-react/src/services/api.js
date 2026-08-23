const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const fetchDashboardData = async (country = 'Poland', period = '24H') => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics?country=${country}&period=${period}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend unavailable, using fallback mock data:', error);
    return null;
  }
};