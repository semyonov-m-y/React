import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrencyChart from '../../../../frontend/src/components/CurrencyChart';

/**
 * Тесты для компонента CurrencyChart
 */
describe('CurrencyChart Component', () => {
  const mockProps = {
    isLive: true,
    setIsLive: jest.fn(),
    currencyPair: 'USD/RUB'
  };

  /**
   * Тест рендеринга компонента
   */
  it('should render currency chart component', () => {
    render(<CurrencyChart {...mockProps} />);

    expect(screen.getByText(/USD\/RUB Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
  });

  /**
   * Тест отображения кнопки паузы/возобновления
   */
  it('should display pause/resume button', () => {
    render(<CurrencyChart {...mockProps} />);

    const button = screen.getByRole('button', { name: /pause|resume/i });
    expect(button).toBeInTheDocument();
  });

  /**
   * Тест переключения режима live/pause
   */
  it('should toggle live mode when button is clicked', () => {
    render(<CurrencyChart {...mockProps} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockProps.setIsLive).toHaveBeenCalledWith(false);
  });
});