import React, { useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiPrinter, FiFilter, FiCalendar } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--button-hover);
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $active }) => $active ? 'var(--primary-color)' : 'var(--bg-secondary)'};
  color: ${({ $active }) => $active ? 'white' : 'var(--text-color)'};
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ $active }) => $active ? 'var(--button-hover)' : 'var(--hover-bg)'};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ReportCard = styled.div`
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

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReportTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
`;

const ReportDate = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ReportContent = styled.div`
  color: var(--text-color);
  line-height: 1.6;
`;

const ReportsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { theme } = useTheme();

  const reports = [
    {
      id: 1,
      title: 'Weekly Market Report',
      date: 'May 12, 2024',
      content: 'Comprehensive analysis of market trends and performance for the past week.',
      type: 'weekly'
    },
    {
      id: 2,
      title: 'Monthly Investment Review',
      date: 'May 1, 2025',
      content: 'Detailed review of investment portfolio performance and recommendations.',
      type: 'monthly'
    },
    {
      id: 3,
      title: 'Quarterly Economic Outlook',
      date: 'Apr 10, 2025',
      content: 'Analysis of global economic trends and forecasts for the upcoming quarter.',
      type: 'quarterly'
    },
    {
      id: 4,
      title: 'Currency Volatility Report',
      date: 'May 8, 2025',
      content: 'Assessment of currency pair volatilities and risk factors.',
      type: 'special'
    },
    {
      id: 5,
      title: 'Year-End Financial Summary',
      date: 'Dec 31, 2024',
      content: 'Comprehensive summary of financial performance for the fiscal year.',
      type: 'annual'
    },
    {
      id: 6,
      title: 'Emerging Markets Analysis',
      date: 'Apr 25, 2025',
      content: 'In-depth analysis of opportunities and risks in emerging markets.',
      type: 'special'
    },
  ];

  const filteredReports = activeFilter === 'all'
    ? reports
    : reports.filter(report => report.type === activeFilter);

  const handleExportAll = () => {
    // Создаем CSV содержимое
    const csvContent = [
      ['Title', 'Date', 'Content', 'Type'],
      ...filteredReports.map(report => [
        report.title,
        report.date,
        report.content,
        report.type
      ])
    ].map(e => e.join(',')).join('\n');

    // Создаем blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reports_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout title="Financial Reports">
      <Container>
        <Header>
          <Title>Financial Reports</Title>
          <Actions>
            <ActionButton onClick={handleExportAll}>
              <FiDownload />
              Export All
            </ActionButton>
            <ActionButton onClick={handlePrint}>
              <FiPrinter />
              Print
            </ActionButton>
          </Actions>
        </Header>

        <Filters>
          <FilterButton
            $active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All Reports
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'weekly'}
            onClick={() => setActiveFilter('weekly')}
          >
            Weekly
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'monthly'}
            onClick={() => setActiveFilter('monthly')}
          >
            Monthly
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'quarterly'}
            onClick={() => setActiveFilter('quarterly')}
          >
            Quarterly
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'annual'}
            onClick={() => setActiveFilter('annual')}
          >
            Annual
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'special'}
            onClick={() => setActiveFilter('special')}
          >
            Special Reports
          </FilterButton>
        </Filters>

        <ReportsGrid>
          {filteredReports.map(report => (
            <ReportCard key={report.id}>
              <ReportHeader>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportDate>{report.date}</ReportDate>
              </ReportHeader>
              <ReportContent>{report.content}</ReportContent>
            </ReportCard>
          ))}
        </ReportsGrid>
      </Container>
    </MainLayout>
  );
};

export default ReportsPage;