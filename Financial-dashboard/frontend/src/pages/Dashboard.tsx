import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiTrendingUp, FiBarChart2, FiBell, FiPieChart, FiSettings, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import CurrencyChart from '../components/CurrencyChart';
import MainLayout from '../layouts/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import Modal from '../components/Modal';

const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Widget = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 400px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WidgetTitleContainer = styled.div`
  display: flex;
  align-items: center;
  color: var(--primary-color);

  svg {
    margin-right: 10px;
  }
`;

const WidgetTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const SettingsIcon = styled(FiSettings)`
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 300px;
`;

const CurrencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CurrencyItem = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  background: ${({ $selected }) => $selected ? 'var(--hover-bg)' : 'transparent'};
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background: var(--hover-bg);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CurrencyName = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const CurrencyValue = styled.div<{ trend: string }>`
  font-weight: bold;
  color: ${({ trend }) => trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'};
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: var(--bg-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
`;

const MarketText = styled.p`
  color: var(--text-color);
  margin: 0.5rem 0;

  strong {
    color: var(--success-color);
  }
`;

const AlertText = styled.p`
  color: var(--text-color);
  margin: 0.5rem 0;
`;

// Стили для модального окна
const ModalTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1.5rem;
`;

const PortfolioForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PortfolioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    opacity: 0.7;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;

  &:hover {
    opacity: 0.7;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;

  &:hover {
    background: var(--button-hover);
  }
`;

const LiveIndicator = styled.span<{ $isLive: boolean }>`
  margin-right: 0.5rem;
  font-size: 0.8rem;
  color: ${({ $isLive }) => $isLive ? 'var(--success-color)' : 'var(--text-secondary)'};
  font-weight: 500;
`;

const LiveToggleButton = styled.button<{ $isLive: boolean }>`
  background: ${({ $isLive }) => $isLive ? 'var(--error-color)' : 'var(--success-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Dashboard: React.FC = () => {
  const [currencyData, setCurrencyData] = useState([]);
  const [isChartLive, setIsChartLive] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD/RUB');
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState([
    { name: 'USD', value: 40 },
    { name: 'EUR', value: 25 },
    { name: 'GBP', value: 15 },
    { name: 'JPY', value: 10 },
    { name: 'Other', value: 10 }
  ]);
  const [editablePortfolioData, setEditablePortfolioData] = useState([...portfolioData]);
  const { theme } = useTheme();

  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c', '#34495e', '#7f8c8d'];

  // Загрузка данных о валютах (заглушка)
  useEffect(() => {
    const mockData = [
      { id: 1, name: 'USD/RUB', value: 91.45, change: 0.25, trend: 'up' },
      { id: 2, name: 'EUR/RUB', value: 99.23, change: -0.12, trend: 'down' },
      { id: 3, name: 'GBP/RUB', value: 115.67, change: 0.37, trend: 'up' },
      { id: 4, name: 'CNY/RUB', value: 12.56, change: -0.05, trend: 'down' },
      { id: 5, name: 'JPY/RUB', value: 0.62, change: 0.01, trend: 'up' },
    ];
    setCurrencyData(mockData);
  }, []);

  /**
   * Обработчик клика по валюте
   */
  const handleCurrencyClick = (currencyName: string) => {
    setSelectedCurrency(currencyName);
  };

  const openPortfolioModal = () => {
    setEditablePortfolioData([...portfolioData]);
    setIsPortfolioModalOpen(true);
  };

  const closePortfolioModal = () => {
    setIsPortfolioModalOpen(false);
  };

  /**
   * Сохранение изменений портфеля
   */
  const savePortfolioChanges = () => {
    // Нормализуем значения, чтобы сумма была 100
    const total = editablePortfolioData.reduce((sum, item) => sum + item.value, 0);
    const normalizedData = editablePortfolioData.map(item => ({
      ...item,
      value: Math.round((item.value / total) * 100)
    }));

    setPortfolioData(normalizedData);
    setIsPortfolioModalOpen(false);
  };

  const updatePortfolioItem = (index: number, field: string, value: any) => {
    const newData = [...editablePortfolioData];
    newData[index] = { ...newData[index], [field]: value };
    setEditablePortfolioData(newData);
  };

  const addPortfolioItem = () => {
    setEditablePortfolioData([...editablePortfolioData, { name: 'New Asset', value: 0 }]);
  };

  const removePortfolioItem = (index: number) => {
    if (editablePortfolioData.length > 1) {
      const newData = [...editablePortfolioData];
      newData.splice(index, 1);
      setEditablePortfolioData(newData);
    }
  };

  return (
    <MainLayout title="Dashboard Overview">
      <WidgetsGrid>
        <Widget>
          <WidgetHeader>
            <WidgetTitleContainer>
              <FiDollarSign />
              <WidgetTitle>Major Currency Pairs</WidgetTitle>
            </WidgetTitleContainer>
          </WidgetHeader>

          <CurrencyList>
            {currencyData.map(currency => (
              <CurrencyItem
                key={currency.id}
                $selected={selectedCurrency === currency.name}
                onClick={() => handleCurrencyClick(currency.name)}
              >
                <CurrencyName>{currency.name}</CurrencyName>
                <CurrencyValue trend={currency.trend}>
                  {currency.value} ({currency.trend === 'up' ? '+' : ''}{currency.change}%)
                </CurrencyValue>
              </CurrencyItem>
            ))}
          </CurrencyList>
        </Widget>

        <Widget>
          <WidgetHeader>
            <WidgetTitleContainer>
              <FiTrendingUp />
              <WidgetTitle>{selectedCurrency} Trend</WidgetTitle>
            </WidgetTitleContainer>
            <div>
              <LiveIndicator $isLive={isChartLive}>
                {isChartLive ? 'LIVE' : 'PAUSED'}
              </LiveIndicator>
              <LiveToggleButton
                $isLive={isChartLive}
                onClick={() => setIsChartLive(!isChartLive)}
              >
                {isChartLive ? 'Pause' : 'Resume'}
              </LiveToggleButton>
            </div>
          </WidgetHeader>
          <ChartContainer>
            <CurrencyChart
              isLive={isChartLive}
              setIsLive={setIsChartLive}
              currencyPair={selectedCurrency}
            />
          </ChartContainer>
        </Widget>

        <Widget>
          <WidgetHeader>
            <WidgetTitleContainer>
              <FiBarChart2 />
              <WidgetTitle>Market Overview</WidgetTitle>
            </WidgetTitleContainer>
          </WidgetHeader>

          <div style={{ marginTop: '1rem' }}>
            <MarketText>Dow Jones: <strong>+0.75%</strong></MarketText>
            <MarketText>S&P 500: <strong>+0.92%</strong></MarketText>
            <MarketText>NASDAQ: <strong>+1.15%</strong></MarketText>
            <MarketText>RTSI: <strong style={{ color: 'var(--error-color)' }}>-0.45%</strong></MarketText>
            <MarketText>MOEX: <strong style={{ color: 'var(--error-color)' }}>-0.32%</strong></MarketText>
          </div>
        </Widget>

        <Widget>
          <WidgetHeader>
            <WidgetTitleContainer>
              <FiBell />
              <WidgetTitle>Recent Alerts</WidgetTitle>
            </WidgetTitleContainer>
          </WidgetHeader>

          <div style={{ marginTop: '1rem' }}>
            <AlertText>USD/RUB reached 92.00</AlertText>
            <AlertText>EUR/USD dropped below 1.0800</AlertText>
            <AlertText>BTC/USD exceeded $70,000</AlertText>
          </div>
        </Widget>
      </WidgetsGrid>

      <Widget>
        <WidgetHeader>
          <WidgetTitleContainer>
            <FiPieChart />
            <WidgetTitle>Your Portfolio Distribution</WidgetTitle>
          </WidgetTitleContainer>
          <SettingsIcon onClick={openPortfolioModal} />
        </WidgetHeader>

        <ResponsiveContainer width="100%" height={300} key={theme}>
          <PieChart>
            <Pie
              data={portfolioData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {portfolioData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Widget>

      {/* Модальное окно для редактирования портфеля */}
      <Modal isOpen={isPortfolioModalOpen} onClose={closePortfolioModal}>
        <ModalTitle>Edit Your Portfolio</ModalTitle>
        <PortfolioForm>
          {editablePortfolioData.map((item, index) => (
            <PortfolioItem key={index}>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => updatePortfolioItem(index, 'name', e.target.value)}
                placeholder="Asset name"
              />
              <Input
                type="number"
                value={item.value}
                onChange={(e) => updatePortfolioItem(index, 'value', Number(e.target.value))}
                placeholder="Percentage"
                min="0"
                max="100"
              />
              <DeleteButton onClick={() => removePortfolioItem(index)}>
                <FiTrash2 />
              </DeleteButton>
            </PortfolioItem>
          ))}

          <AddButton onClick={addPortfolioItem}>
            <FiPlus /> Add Asset
          </AddButton>

          <SaveButton onClick={savePortfolioChanges}>
            <FiSave /> Save Changes
          </SaveButton>
        </PortfolioForm>
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;