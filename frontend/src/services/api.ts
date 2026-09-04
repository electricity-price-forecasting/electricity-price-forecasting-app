// import axios from 'axios';
import { PriceDataPoint, ForecastHorizon, ModelType } from '../types/forecast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const generateMockForecast = (horizon: ForecastHorizon): PriceDataPoint[] => {
  const pointsCount = horizon === '24h' ? 24 : horizon === '48h' ? 48 : 168;
  const now = new Date();
  const data: PriceDataPoint[] = [];

  const basePrice = 3.80; // грн / кВт·год

  for (let i = 0; i < pointsCount; i++) {
    const time = new Date(now.getTime() + i * 3600 * 1000);
    const hour = time.getHours();
    
    const peakFactor = (hour >= 8 && hour <= 11) || (hour >= 18 && hour <= 22) ? 1.35 : 0.85;
    const randomNoise = (Math.random() - 0.5) * 0.4;
    
    const predictedPrice = Number((basePrice * peakFactor + randomNoise).toFixed(2));
    const actualPrice = i < 6 ? Number((predictedPrice + (Math.random() - 0.5) * 0.2).toFixed(2)) : undefined;

    data.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      actualPrice,
      predictedPrice,
      lowerBound: Number((predictedPrice * 0.92).toFixed(2)),
      upperBound: Number((predictedPrice * 1.08).toFixed(2)),
    });
  }

  return data;
};

export const fetchPriceForecast = async (
  horizon: ForecastHorizon = '24h',
  model: ModelType = 'xgboost'
): Promise<PriceDataPoint[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: { horizon, model },
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend API недоступний. Використовуються тестові дані для візуалізації.', error);
    return generateMockForecast(horizon);
  }
};