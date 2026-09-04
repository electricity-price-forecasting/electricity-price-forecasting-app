import React, { useState, useEffect, useMemo } from 'react';
import { fetchPriceForecast } from './services/api';
import { PriceChart } from './components/PriceChart/PriceChart';
import { PriceDataPoint, ForecastHorizon, ModelType, ForecastSummary } from './types/forecast';
// import { TrendingUp, TrendingDown, Minus, RefreshCw, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [horizon, setHorizon] = useState<ForecastHorizon>('24h');
  const [model, setModel] = useState<ModelType>('xgboost');
  const [loading, setLoading] = useState<boolean>(true);

  const loadForecast = async () => {
    setLoading(true);
    const forecastData = await fetchPriceForecast(horizon, model);
    setData(forecastData);
    setLoading(false);
  };

  useEffect(() => {
    loadForecast();
  }, [horizon, model]);

  const summary: ForecastSummary | null = useMemo(() => {
    if (!data.length) return null;
    const prices = data.map((d) => d.predictedPrice);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    const diff = last - first;
    const trend = Math.abs(diff) < 0.1 ? 'stable' : diff > 0 ? 'up' : 'down';

    return {
      currentPrice: first,
      predictedAverage: Number(avg.toFixed(2)),
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      trend,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Electricity Price Forecasting</h1>
            <p className="text-sm text-gray-500">Система аналізу та прогнозування цін на електроенергію</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value as ForecastHorizon)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Горизонт: 24 години</option>
            <option value="48h">Горизонт: 48 годин</option>
            <option value="7d">Горизонт: 7 днів</option>
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ModelType)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="xgboost">Модель: XGBoost</option>
            <option value="lstm">Модель: LSTM</option>
            <option value="arima">Модель: ARIMA</option>
            <option value="ensemble">Модель: Ensemble</option>
          </select>

          <button
            onClick={loadForecast}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Оновити
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Поточна ціна</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.currentPrice} грн</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Середній прогноз</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{summary.predictedAverage} грн</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Пікова ціна (Max)</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{summary.maxPrice} грн</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Динаміка тренду</p>
              <div className="flex items-center gap-2 mt-1">
                {summary.trend === 'up' && <TrendingUp className="w-6 h-6 text-red-500" />}
                {summary.trend === 'down' && <TrendingDown className="w-6 h-6 text-green-500" />}
                {summary.trend === 'stable' && <Minus className="w-6 h-6 text-gray-400" />}
                <span className="text-lg font-bold text-gray-800 capitalize">{summary.trend}</span>
              </div>
            </div>
          </div>
        )}

        <PriceChart data={data} />
      </main>
    </div>
  );
};

export default App;