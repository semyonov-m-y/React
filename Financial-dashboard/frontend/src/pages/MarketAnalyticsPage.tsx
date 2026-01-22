import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../contexts/ThemeContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { format, subDays, subMonths, subQuarters, subYears } from 'date-fns';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ $active }) => $active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${({ $active }) => $active ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const TimeFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeFilterLabel = styled.span`
  color: var(--text-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeFilter = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-color);
  cursor: pointer;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Content = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
`;

const IndicatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const IndicatorCard = styled.div`
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
`;

const IndicatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const IndicatorName = styled.div`
  font-weight: 600;
  color: var(--text-color);
`;

const IndicatorValue = styled.div<{ $trend: string }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ $trend }) => $trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'};
`;

// Генерация данных для графиков
const generateMarketData = (period: string) => {
  const data = [];
  const now = new Date();
  let days = 7;

  if (period === 'month') days = 30;
  else if (period === 'quarter') days = 90;
  else if (period === 'year') days = 365;

  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      rtsi: 1100 + Math.sin(i / 10) * 100 + Math.random() * 20,
      moex: 3200 + Math.sin(i / 8) * 200 + Math.random() * 50,
      dow: 34000 + Math.sin(i / 15) * 1000 + Math.random() * 200,
      snp: 4300 + Math.sin(i / 12) * 150 + Math.random() * 30,
      nasdaq: 14400 + Math.sin(i / 10) * 300 + Math.random() * 50,
      brent: 80 + Math.sin(i / 5) * 10 + Math.random() * 5,
    });
  }

  return data;
};

const generateTechnicalData = (period: string) => {
  const data = [];
  const now = new Date();
  let days = 7;

  if (period === 'month') days = 30;
  else if (period === 'quarter') days = 90;
  else if (period === 'year') days = 365;

  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      rsi: 50 + Math.sin(i / 7) * 20 + Math.random() * 5,
      macd: Math.sin(i / 5) * 0.5 + Math.random() * 0.1,
      stochastic: 50 + Math.sin(i / 6) * 30 + Math.random() * 5,
    });
  }

  return data;
};

const generateSectorData = () => {
  return [
    { name: 'Technology', value: 25 },
    { name: 'Financials', value: 20 },
    { name: 'Healthcare', value: 15 },
    { name: 'Energy', value: 12 },
    { name: 'Consumer', value: 10 },
    { name: 'Industrials', value: 8 },
    { name: 'Utilities', value: 5 },
    { name: 'Other', value: 5 },
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A4DE6C'];

// Компоненты для разных вкладок
const MarketOverview = ({ timeInterval }: { timeInterval: string }) => {
  const marketData = generateMarketData(timeInterval);
  const sectorData = generateSectorData();

  return (
    <>
      <SectionTitle>
        <FiBarChart2 />
        Key Market Indicators
      </SectionTitle>

      <IndicatorsGrid>
        {[
          { id: 'rtsi', name: 'RTS Index', value: 1200.45, change: 1.25, trend: 'up' },
          { id: 'moex', name: 'MOEX Index', value: 3250.67, change: -0.75, trend: 'down' },
          { id: 'dow', name: 'Dow Jones', value: 34250.12, change: 0.92, trend: 'up' },
          { id: 'snp', name: 'S&P 500', value: 4321.78, change: 1.15, trend: 'up' },
          { id: 'nasdaq', name: 'NASDAQ', value: 14520.34, change: 1.45, trend: 'up' },
          { id: 'brent', name: 'Brent Crude', value: 85.67, change: -1.25, trend: 'down' },
        ].map(indicator => (
          <IndicatorCard key={indicator.id}>
            <IndicatorHeader>
              <IndicatorName>{indicator.name}</IndicatorName>
              <IndicatorValue $trend={indicator.trend}>
                {indicator.value} ({indicator.trend === 'up' ? '+' : ''}{indicator.change}%)
              </IndicatorValue>
            </IndicatorHeader>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    stroke="var(--text-color)"
                  />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'PP')}
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={indicator.id}
                    stroke={indicator.trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>
        ))}
      </IndicatorsGrid>

      <SectionTitle>
        <FiTrendingUp />
        Market Trends
      </SectionTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              stroke="var(--text-color)"
            />
            <YAxis stroke="var(--text-color)" />
            <Tooltip
              labelFormatter={(value) => format(new Date(value), 'PP')}
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="rtsi" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="moex" stroke="#82ca9d" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="dow" stroke="#ffc658" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <SectionTitle>
        <FiPieChart />
        Sector Performance
      </SectionTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
};

const TechnicalAnalysis = ({ timeInterval }: { timeInterval: string }) => {
  const technicalData = generateTechnicalData(timeInterval);

  return (
    <>
      <SectionTitle>
        <FiBarChart2 />
        Technical Indicators
      </SectionTitle>

      <IndicatorsGrid>
        {[
          { id: 'rsi', name: 'Relative Strength Index', value: 58.2, trend: 'up' },
          { id: 'macd', name: 'MACD', value: 0.45, trend: 'up' },
          { id: 'stochastic', name: 'Stochastic Oscillator', value: 72.1, trend: 'up' },
        ].map(indicator => (
          <IndicatorCard key={indicator.id}>
            <IndicatorHeader>
              <IndicatorName>{indicator.name}</IndicatorName>
              <IndicatorValue $trend={indicator.trend}>
                {indicator.value}
              </IndicatorValue>
            </IndicatorHeader>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={technicalData.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    stroke="var(--text-color)"
                  />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'PP')}
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={indicator.id}
                    stroke={indicator.trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>
        ))}
      </IndicatorsGrid>

      <SectionTitle>
        <FiTrendingUp />
        Price Predictions
      </SectionTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={technicalData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              stroke="var(--text-color)"
            />
            <YAxis stroke="var(--text-color)" />
            <Tooltip
              labelFormatter={(value) => format(new Date(value), 'PP')}
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
              }}
            />
            <Legend />
            <Bar dataKey="rsi" fill="#8884d8" />
            <Bar dataKey="macd" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
};

const MarketSentiment = () => {
  const sentimentData = [
    { name: 'Bullish', value: 65 },
    { name: 'Bearish', value: 25 },
    { name: 'Neutral', value: 10 },
  ];

  const volatilityData = [
    { name: 'Low', value: 30 },
    { name: 'Medium', value: 45 },
    { name: 'High', value: 25 },
  ];

  return (
    <>
      <SectionTitle>
        <FiBarChart2 />
        Sentiment Indicators
      </SectionTitle>

      <IndicatorsGrid>
        {[
          {
            id: 'bullish',
            name: 'Bullish Sentiment',
            value: 65,
            trend: 'up',
            data: sentimentData,
            colors: ['#00C49F', '#FF8042', '#FFBB28']
          },
          {
            id: 'bearish',
            name: 'Bearish Sentiment',
            value: 25,
            trend: 'down',
            data: sentimentData,
            colors: ['#FF8042', '#00C49F', '#FFBB28']
          },
          {
            id: 'neutral',
            name: 'Neutral Sentiment',
            value: 10,
            trend: 'down',
            data: sentimentData,
            colors: ['#FFBB28', '#00C49F', '#FF8042']
          },
          {
            id: 'volatility',
            name: 'Market Volatility',
            value: 28.5,
            trend: 'up',
            data: volatilityData,
            colors: ['#0088FE', '#00C49F', '#FF8042']
          },
        ].map(indicator => (
          <IndicatorCard key={indicator.id}>
            <IndicatorHeader>
              <IndicatorName>{indicator.name}</IndicatorName>
              <IndicatorValue $trend={indicator.trend}>
                {indicator.value}%
              </IndicatorValue>
            </IndicatorHeader>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={indicator.data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {indicator.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={indicator.colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>
        ))}
      </IndicatorsGrid>

      <SectionTitle>
        <FiTrendingUp />
        Investor Behavior
      </SectionTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" />
            <Tooltip
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
};

const MarketAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeInterval, setTimeInterval] = useState('week');
  const { theme } = useTheme();

  /**
   * Обработчик изменения временного интервала
   */
  const handleTimeIntervalChange = (interval: string) => {
    setTimeInterval(interval);
  };

  /**
   * Рендер контента в зависимости от активной вкладки
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MarketOverview timeInterval={timeInterval} />;
      case 'technical':
        return <TechnicalAnalysis timeInterval={timeInterval} />;
      case 'sentiment':
        return <MarketSentiment />;
      default:
        return <MarketOverview timeInterval={timeInterval} />;
    }
  };

  return (
    <MainLayout title="Market Analytics">
      <Container>
        <Title>Market Analytics</Title>

        <ControlsContainer>
          <Tabs>
            <Tab
              $active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              Market Overview
            </Tab>
            <Tab
              $active={activeTab === 'technical'}
              onClick={() => setActiveTab('technical')}
            >
              Technical Analysis
            </Tab>
            <Tab
              $active={activeTab === 'sentiment'}
              onClick={() => setActiveTab('sentiment')}
            >
              Market Sentiment
            </Tab>
          </Tabs>

          <TimeFilterContainer>
            <TimeFilterLabel>
              <FiCalendar />
              Time Interval:
            </TimeFilterLabel>
            <TimeFilter
              value={timeInterval}
              onChange={(e) => handleTimeIntervalChange(e.target.value)}
            >
              <option value="week">1 Week</option>
              <option value="month">1 Month</option>
            </TimeFilter>
          </TimeFilterContainer>
        </ControlsContainer>

        <Content key={theme}>
          {renderTabContent()}
        </Content>
      </Container>
    </MainLayout>
  );
};

export default MarketAnalyticsPage;