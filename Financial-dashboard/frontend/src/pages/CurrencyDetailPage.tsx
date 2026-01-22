import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiStar, FiBarChart2, FiCalendar } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';

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
  color: #3498db;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrencySymbol = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
`;

const CurrencyName = styled.div`
  color: #7f8c8d;
`;

const FavoriteIcon = styled(FiStar)`
  font-size: 1.5rem;
  color: ${({ $active }) => $active ? '#f1c40f' : '#bdc3c7'};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f1c40f;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const InfoSection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

const ChartPlaceholder = styled.div`
  height: 400px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const TimeFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TimeFilter = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ $active }) => $active ? '#3498db' : '#f8f9fa'};
  color: ${({ $active }) => $active ? 'white' : '#2c3e50'};
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ $active }) => $active ? '#2980b9' : '#e9ecef'};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
`;

const PriceChange = styled(InfoValue)<{ $trend: string }>`
  color: ${({ $trend }) => $trend === 'up' ? '#2ecc71' : '#e74c3c'};
`;

const IconWrapper = styled.span`
  margin-right: 8px;
`;

const CurrencyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [timeFrame, setTimeFrame] = useState('1d');
  const [currencyData, setCurrencyData] = useState<any>(null);

  /**
   * Загрузка данных о валюте и избранных пар
   */
  useEffect(() => {
    const mockData = {
      id: id || 'USD/RUB',
      name: id === 'USD/RUB' ? 'US Dollar / Russian Ruble' :
            id === 'EUR/RUB' ? 'Euro / Russian Ruble' :
            `${id} Currency Pair`,
      currentValue: 91.45,
      change: 0.25,
      trend: 'up',
      high: 92.10,
      low: 90.85,
      open: 91.20,
      prevClose: 91.20,
      volume: '1.2B'
    };

    setCurrencyData(mockData);

    // Загрузка избранного из localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('currencyFavorites') || '[]');
    setFavorites(savedFavorites);
  }, [id]);

  /**
   * Переключение статуса избранного для валютной пары
   */
  const toggleFavorite = () => {
    if (!id) return;

    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem('currencyFavorites', JSON.stringify(newFavorites));
  };

  if (!currencyData) return <div>Loading...</div>;

  return (
    <MainLayout title="Dashboard Overview">
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/currencies')}>
            <FiArrowLeft />
          </BackButton>
          <TitleContainer>
            <CurrencySymbol>{currencyData.id}</CurrencySymbol>
            <CurrencyName>{currencyData.name}</CurrencyName>
          </TitleContainer>
          <FavoriteIcon
            $active={favorites.includes(currencyData.id)}
            onClick={toggleFavorite}
          />
        </Header>

        <MainContent>
          <ChartSection>
            <SectionTitle>
              <FiBarChart2 />
              Price Chart
            </SectionTitle>

            <TimeFilters>
              <TimeFilter $active={timeFrame === '1d'} onClick={() => setTimeFrame('1d')}>1D</TimeFilter>
              <TimeFilter $active={timeFrame === '1w'} onClick={() => setTimeFrame('1w')}>1W</TimeFilter>
              <TimeFilter $active={timeFrame === '1m'} onClick={() => setTimeFrame('1m')}>1M</TimeFilter>
              <TimeFilter $active={timeFrame === '3m'} onClick={() => setTimeFrame('3m')}>3M</TimeFilter>
              <TimeFilter $active={timeFrame === '1y'} onClick={() => setTimeFrame('1y')}>1Y</TimeFilter>
              <TimeFilter $active={timeFrame === 'all'} onClick={() => setTimeFrame('all')}>All</TimeFilter>
            </TimeFilters>

            <ChartPlaceholder>
              Detailed Chart for {currencyData.id} ({timeFrame})
            </ChartPlaceholder>
          </ChartSection>

          <InfoSection>
            <SectionTitle>
              <FiCalendar />
              Market Data
            </SectionTitle>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Current Price</InfoLabel>
                <InfoValue>{currencyData.currentValue}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>24h Change</InfoLabel>
                <PriceChange $trend={currencyData.trend}>
                  {currencyData.trend === 'up' ? '+' : ''}{currencyData.change}%
                </PriceChange>
              </InfoItem>

              <InfoItem>
                <InfoLabel>24h High</InfoLabel>
                <InfoValue>{currencyData.high}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>24h Low</InfoLabel>
                <InfoValue>{currencyData.low}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Open</InfoLabel>
                <InfoValue>{currencyData.open}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Previous Close</InfoLabel>
                <InfoValue>{currencyData.prevClose}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>24h Volume</InfoLabel>
                <InfoValue>{currencyData.volume}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </MainContent>
      </Container>
    </MainLayout>
  );
};

export default CurrencyDetailPage;