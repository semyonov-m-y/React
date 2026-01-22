import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, isAfter, isSameDay } from 'date-fns';
import styled, { keyframes } from 'styled-components';

// Анимация загрузки
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 3px solid rgba(52, 152, 219, 0.2);
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  margin-top: 10px;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.05);
  z-index: 10;
  padding: 1rem;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 300px;
`;

const ChartContent = styled.div`
  flex: 1;
  position: relative;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #7f8c8d;
`;

interface HistoricalData {
  date: string;
  value: number;
}

interface CurrencyChartProps {
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
  currencyPair: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        padding: '0.75rem',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <p style={{ margin: 0, fontWeight: 500, marginBottom: '0.5rem' }}>
          {format(new Date(label), 'PPp')}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: '#3498db',
            borderRadius: '50%',
            marginRight: '8px'
          }}></span>
          {payload[0].payload.currencyPair}: <strong style={{ color: '#3498db' }}>{payload[0].value.toFixed(4)} RUB</strong>
        </p>
      </div>
    );
  }
  return null;
};

const CurrencyChart: React.FC<CurrencyChartProps> = ({ isLive, setIsLive, currencyPair }) => {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения исторических данных через прокси
  const fetchHistoricalDataThroughProxy = async (date: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/proxy/historical?date=${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch historical data through proxy');
    }
    return await response.json();
  };

  // Функция для получения текущих данных через прокси
  const fetchCurrentRateThroughProxy = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/proxy/latest`);
    if (!response.ok) {
      throw new Error('Failed to fetch current rate through proxy');
    }
    return await response.json();
  };

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем данные за последние 30 дней
      const historicalData: HistoricalData[] = [];
      const today = new Date();

      for (let i = 30; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy/MM/dd');

        // Пропускаем будущие даты
        if (isAfter(date, today)) {
          continue;
        }

        try {
          const result = await fetchHistoricalDataThroughProxy(dateStr);
          // Определяем курс в зависимости от выбранной валютной пары
          let rate;
          if (currencyPair === 'USD/RUB') {
            rate = result.Valute.USD.Value;
          } else if (currencyPair === 'EUR/RUB') {
            rate = result.Valute.EUR.Value;
          } else {
            // Для других валют используем моковые данные
            rate = 90 + Math.random() * 10;
          }

          historicalData.push({
            date: date.toISOString(),
            value: rate
          });
        } catch (err) {
          console.warn(`No data available for ${dateStr}`);
          // Используем моковые данные, если реальные недоступны
          historicalData.push({
            date: date.toISOString(),
            value: 90 + Math.random() * 10
          });
        }
      }

      if (historicalData.length === 0) {
        throw new Error('No historical data available');
      }

      setData(historicalData);
    } catch (err) {
      console.error('Error fetching currency data:', err);
      setError('Failed to load currency data from Central Bank API.');

      // Генерация тестовых данных
      const mockData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        value: 90 + Math.random() * 3
      }));
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, [currencyPair]); // Добавляем currencyPair в зависимости

  const fetchCurrentRate = useCallback(async () => {
    try {
      const result = await fetchCurrentRateThroughProxy();
      // Определяем курс в зависимости от выбранной валютной пары
      let rate;
      if (currencyPair === 'USD/RUB') {
        rate = 1 / result.rates.USD;
      } else if (currencyPair === 'EUR/RUB') {
        rate = 1 / result.rates.EUR;
      } else {
        // Для других валют используем моковые данные
        rate = 90 + Math.random() * 10;
      }

      return {
        date: new Date().toISOString(),
        value: rate,
        currencyPair: currencyPair
      };
    } catch (err) {
      console.error('Error fetching current rate:', err);
      throw err;
    }
  }, [currencyPair]); // Добавляем currencyPair в зависимости

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData, currencyPair]); // Добавляем currencyPair в зависимости

  /**
   * Обновление данных в реальном времени
   */
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      try {
        const newDataPoint = await fetchCurrentRate();
        setData(prev => {
          // Проверяем, есть ли уже данные для текущей даты
          const today = new Date().toISOString().split('T')[0];
          const existingIndex = prev.findIndex(item =>
            item.date.startsWith(today)
          );

          let newData;
          if (existingIndex !== -1) {
            // Обновляем существующую запись для сегодняшнего дня
            newData = [...prev];
            newData[existingIndex] = newDataPoint;
          } else {
            // Добавляем новую запись
            newData = [...prev, newDataPoint];
          }

          // Ограничиваем количество точек на графике
          return newData.length > 100 ? newData.slice(-100) : newData;
        });
      } catch (err) {
        console.error('Error updating currency data:', err);
        setError('Failed to update currency data. Real-time updates disabled.');
        setIsLive(false);
      }
    }, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, [isLive, setIsLive, fetchCurrentRate, currencyPair]); // Добавляем currencyPair в зависимости

  const formatXAxis = (date: string) => {
    return format(new Date(date), 'MMM dd');
  };

  return (
    <ChartContainer>
      <ChartContent>
        {loading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading {currencyPair} data...</LoadingText>
          </LoadingOverlay>
        )}

        {error && !loading && (
          <ErrorOverlay>
            {error}
          </ErrorOverlay>
        )}

        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(2)} RUB`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                name={currencyPair}
                type="monotone"
                dataKey="value"
                stroke="#3498db"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: '#2980b9', strokeWidth: 2, fill: '#fff' }}
                isAnimationActive={!loading}
              />
            </LineChart>
          ) : (
            <EmptyState>
              No data available for {currencyPair}
            </EmptyState>
          )}
        </ResponsiveContainer>
      </ChartContent>
    </ChartContainer>
  );
};

export default CurrencyChart;