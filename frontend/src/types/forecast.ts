export interface PriceDataPoint {
  timestamp: string;
  actualPrice?: number;
  predictedPrice: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface ForecastSummary {
  currentPrice: number;
  predictedAverage: number;
  maxPrice: number;
  minPrice: number;
  trend: 'up' | 'down' | 'stable';
}

export type ForecastHorizon = '24h' | '48h' | '7d';
export type ModelType = 'xgboost' | 'lstm' | 'arima' | 'ensemble';