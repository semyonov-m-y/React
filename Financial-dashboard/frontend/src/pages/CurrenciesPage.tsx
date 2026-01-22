import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiSearch, FiStar, FiDollarSign, FiCalendar } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import MiniBarChart from '../components/MiniBarChart';
import { subDays, subMonths, subQuarters, subYears, format } from 'date-fns';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--primary-color);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
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

const CurrencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const CurrencyCard = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CurrencyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CurrencyName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
`;

const FavoriteIcon = styled(FiStar)`
  font-size: 1.2rem;
  color: ${({ $active }) => $active ? 'var(--warning-color)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--warning-color);
  }
`;

const CurrencyDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CurrencyValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
`;

const CurrencyChange = styled.div`
  color: ${({ $trend }) => $trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'};
  font-weight: 600;
`;

const CurrencyChartMini = styled.div`
  height: 80px;
  background: var(--bg-secondary);
  border-radius: 6px;
  overflow: hidden;
`;

// Функция для генерации тестовых данных
const generateHistoricalData = (period: string, baseValue: number, trend: string) => {
  const data = [];
  const now = new Date();
  let days = 7; // По умолчанию неделя

  if (period === 'month') days = 30;
  else if (period === 'quarter') days = 90;
  else if (period === 'year') days = 365;

  const volatility = trend === 'up' ? 0.5 : -0.5;

  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    // Генерируем значения с небольшими случайными колебаниями
    const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
    const trendFactor = 1 + (volatility * (days - i) / days);
    const value = baseValue * randomFactor * trendFactor;

    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2))
    });
  }

  return data;
};

const CurrenciesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [timeInterval, setTimeInterval] = useState<string>('week');

  useEffect(() => {
    // Загрузка данных о валютах
    const mockData = [
      {
        id: 'USD/RUB',
        name: 'US Dollar / Russian Ruble',
        value: 91.45,
        change: 0.25,
        trend: 'up',
        baseValue: 91.45
      },
      {
        id: 'EUR/RUB',
        name: 'Euro / Russian Ruble',
        value: 99.23,
        change: -0.12,
        trend: 'down',
        baseValue: 99.23
      },
      {
        id: 'GBP/RUB',
        name: 'British Pound / Russian Ruble',
        value: 115.67,
        change: 0.37,
        trend: 'up',
        baseValue: 115.67
      },
      {
        id: 'JPY/RUB',
        name: 'Japanese Yen / Russian Ruble',
        value: 0.62,
        change: 0.01,
        trend: 'up',
        baseValue: 0.62
      },
      {
        id: 'CNY/RUB',
        name: 'Chinese Yuan / Russian Ruble',
        value: 12.56,
        change: -0.05,
        trend: 'down',
        baseValue: 12.56
      },
      {
        id: 'CHF/RUB',
        name: 'Swiss Franc / Russian Ruble',
        value: 102.34,
        change: 0.15,
        trend: 'up',
        baseValue: 102.34
      },
      {
        id: 'CAD/RUB',
        name: 'Canadian Dollar / Russian Ruble',
        value: 67.89,
        change: -0.08,
        trend: 'down',
        baseValue: 67.89
      },
      {
        id: 'AUD/RUB',
        name: 'Australian Dollar / Russian Ruble',
        value: 60.12,
        change: 0.22,
        trend: 'up',
        baseValue: 60.12
      },
    ];

    // Генерируем исторические данные для каждой валюты
    const currenciesWithData = mockData.map(currency => ({
      ...currency,
      chartData: generateHistoricalData(timeInterval, currency.baseValue, currency.trend)
    }));

    setCurrencies(currenciesWithData);

    // Загрузка избранного из localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('currencyFavorites') || '[]');
    setFavorites(savedFavorites);
  }, [timeInterval]);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem('currencyFavorites', JSON.stringify(newFavorites));
  };

  const handleTimeIntervalChange = (interval: string) => {
    setTimeInterval(interval);
  };

  const filteredCurrencies = currencies
    .filter(currency =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Сначала избранные, потом остальные
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // Если оба избранные или оба не избранные, сохраняем исходный порядок
      return 0;
    });

  const handleCurrencyClick = (id: string) => {
    navigate(`/currency/${id}`);
  };

  return (
    <MainLayout title="Currencies">
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/dashboard')}>
            <FiArrowLeft />
          </BackButton>
          <Title>Currencies</Title>
        </Header>

        <ControlsContainer>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

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
              <option value="quarter">3 Months</option>
              <option value="year">1 Year</option>
            </TimeFilter>
          </TimeFilterContainer>
        </ControlsContainer>

        <CurrencyGrid>
          {filteredCurrencies.map(currency => (
            <CurrencyCard key={currency.id} onClick={() => handleCurrencyClick(currency.id)}>
              <CurrencyHeader>
                <CurrencyName>
                  <FiDollarSign style={{ marginRight: '8px' }} />
                  {currency.id}
                </CurrencyName>
                <FavoriteIcon
                  $active={favorites.includes(currency.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currency.id);
                  }}
                />
              </CurrencyHeader>
              <CurrencyDetails>
                <CurrencyValue>{currency.value}</CurrencyValue>
                <CurrencyChange $trend={currency.trend}>
                  {currency.trend === 'up' ? '+' : ''}{currency.change}%
                </CurrencyChange>
              </CurrencyDetails>
              <CurrencyChartMini>
                <MiniBarChart data={currency.chartData} trend={currency.trend} />
              </CurrencyChartMini>
            </CurrencyCard>
          ))}
        </CurrencyGrid>
      </Container>
    </MainLayout>
  );
};

export default CurrenciesPage;