import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.2rem;
`;

/**
 * Компонент выхода из системы
 * Очищает данные пользователя и перенаправляет на страницу входа
 */
const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Очистка данных аутентификации и перенаправление
     */
    const performLogout = () => {
      // Очищаем ВСЕ данные пользователя
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedUser');

      // Перенаправляем на страницу входа
      navigate('/login');
    };

    performLogout();
  }, [navigate]);

  return (
    <LogoutContainer>
      Logging out...
    </LogoutContainer>
  );
};

export default Logout;