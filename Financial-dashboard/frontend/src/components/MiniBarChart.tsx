import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  background: white;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TooltipLabel = styled.p`
  margin: 0;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const TooltipValue = styled.p`
  margin: 0;
  font-weight: bold;
`;

const EmptyState = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
`;

/**
 * Кастомный тултип для мини-графика
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <TooltipLabel>{format(new Date(payload[0].payload.date), 'MMM dd')}</TooltipLabel>
        <TooltipValue>{payload[0].value.toFixed(2)}</TooltipValue>
      </TooltipContainer>
    );
  }
  return null;
};

interface MiniBarChartProps {
  data: { date: string; value: number }[];
  trend: string;
}

/**
 * Компонент мини-графика для отображения в виджетах
 */
const MiniBarChart: React.FC<MiniBarChartProps> = ({ data, trend }) => {
  if (!data || data.length === 0) {
    return <EmptyState>No data</EmptyState>;
  }

  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
          hide
          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill={trend === 'up' ? 'var(--success-color)' : 'var(--error-color)'}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MiniBarChart;