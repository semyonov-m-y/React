import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiLogOut, FiUser, FiBell, FiSettings, FiPieChart, FiDollarSign, FiTrendingUp, FiBarChart2, FiX, FiMoon, FiSun, FiUsers } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Кастомный хук для обработки кликов вне элемента
 * @param ref - ссылка на DOM элемент
 * @param handler - обработчик события
 */
const useOnClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
`;

const Sidebar = styled.div`
  width: 250px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 1.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--header-border);
`;

const Title = styled.h1`
  color: var(--text-color);
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-color);
`;

const NotificationList = styled.div`
  padding: 0;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--text-color);

  &:hover {
    background-color: var(--hover-bg);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-color);
`;

const NotificationContent = styled.div`
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
`;

const NotificationTime = styled.div`
  color: var(--text-color);
  opacity: 0.5;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  padding: 0.25rem;

  &:hover {
    opacity: 0.7;
  }
`;

const EmptyNotifications = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationBadge = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  position: absolute;
  top: -5px;
  right: -5px;
`;

/**
 * Компонент навигационного элемента
 */
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ to, icon, text, isActive, onClick }) => {
  return (
    <NavItemContainer $active={isActive} onClick={onClick}>
      <StyledLink to={to}>
        {icon}
        <NavText>{text}</NavText>
      </StyledLink>
    </NavItemContainer>
  );
};

const NavItemContainer = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  background: ${({ $active }) => $active ? 'var(--hover-bg)' : 'transparent'};
  color: var(--sidebar-text);

  &:hover {
    background: var(--hover-bg);
  }

  svg {
    margin-right: 10px;
    color: var(--sidebar-text);
  }
`;

const NavText = styled.span`
  font-weight: 500;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  color: var(--text-color);
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: #e74c3c;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s;

  &:hover {
    background: rgba(231, 76, 60, 0.1);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 1000;
`;

const UserAvatarContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--hover-bg);
  }
`;

/**
 * Интерфейс для пропсов MainLayout компонента
 */
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Основной layout приложения, содержащий сайдбар и заголовок
 * Обеспечивает навигацию между страницами и общий UI для всех защищенных маршрутов
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Financial Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [userInitial, setUserInitial] = useState('U');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'USD/RUB Update',
      content: 'USD/RUB reached 92.00',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'EUR/USD Alert',
      content: 'EUR/USD dropped below 1.0800',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 3,
      title: 'BTC Price Alert',
      content: 'BTC/USD exceeded $70,000',
      time: '10 minutes ago',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  /**
   * Получаем данные текущего пользователя для отображения в хедере
   */
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Функция для обработки клика по навигационному элементу
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Загрузка данных пользователя
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.name) {
      setUserInitial(user.name.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    // Перенаправляем на страницу выхода
    navigate('/logout');
  };

  // Функция для перехода на страницу профиля
  const handleProfileClick = () => {
    navigate('/profile');
  };

  /**
   * Функция для проверки активного маршрута
   * @param route - путь для проверки
   * @returns boolean - является ли маршрут активным
   */
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  const handleNotificationClick = useCallback((id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  }, [notifications]);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
    setShowNotifications(false);
  }, []);

  const handleNotificationToggle = useCallback(() => {
    setShowNotifications(prev => !prev);

    // Помечаем все уведомления как прочитанные при открытии
    if (!showNotifications) {
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    }
  }, [showNotifications, notifications]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(notificationRef, () => {
    setShowNotifications(false);
  });

  return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ color: '#3498db', marginBottom: '2rem' }}>Financial Dashboard</h2>

        <NavItem
          to="/dashboard"
          icon={<FiPieChart />}
          text="Dashboard"
          isActive={isActiveRoute('/dashboard')}
          onClick={() => handleNavigation('/dashboard')}
        />

        <NavItem
          to="/currencies"
          icon={<FiDollarSign />}
          text="Currencies"
          isActive={isActiveRoute('/currencies')}
          onClick={() => handleNavigation('/currencies')}
        />

        <NavItem
          to="/analytics"
          icon={<FiTrendingUp />}
          text="Market Analytics"
          isActive={isActiveRoute('/analytics')}
          onClick={() => handleNavigation('/analytics')}
        />

        <NavItem
          to="/reports"
          icon={<FiBarChart2 />}
          text="Reports"
          isActive={isActiveRoute('/reports')}
          onClick={() => handleNavigation('/reports')}
        />

        {/* Секция администратора - показывается только администраторам */}
        {currentUser.role === 'admin' && (
          <NavItem
            to="/admin"
            icon={<FiUsers />}
            text="User Management"
            isActive={isActiveRoute('/admin')}
            onClick={() => handleNavigation('/admin')}
          />
        )}

        <div style={{ marginTop: '2rem' }}>
          <NavItem
            to="/profile"
            icon={<FiUser />}
            text="Profile"
            isActive={isActiveRoute('/profile')}
            onClick={() => handleNavigation('/profile')}
          />

          <NavItem
            to="/settings"
            icon={<FiSettings />}
            text="Settings"
            isActive={isActiveRoute('/settings')}
            onClick={() => handleNavigation('/settings')}
          />

          <NavItem onClick={handleLogout}>
            <FiLogOut />
            <NavText>Logout</NavText>
          </NavItem>
        </div>
      </Sidebar>

      {/* Основной контент */}
      <MainContent>
        <Header>
          <Title>{title}</Title>

          <UserInfo>
            <NotificationIconWrapper>
              <NotificationIcon onClick={handleNotificationToggle}>
                <FiBell size={24} />
                {unreadCount > 0 && (
                  <NotificationBadge>{unreadCount}</NotificationBadge>
                )}
              </NotificationIcon>

              {/* Выпадающий список уведомлений */}
              {showNotifications && (
                <NotificationDropdown ref={notificationRef}>
                  <NotificationHeader>
                    <span>Notifications</span>
                    <CloseButton onClick={() => setShowNotifications(false)}>
                      <FiX size={16} />
                    </CloseButton>
                  </NotificationHeader>

                  {notifications.length > 0 ? (
                    <NotificationList>
                      {notifications.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <NotificationTitle>{notification.title}</NotificationTitle>
                          <NotificationContent>{notification.content}</NotificationContent>
                          <NotificationTime>{notification.time}</NotificationTime>
                        </NotificationItem>
                      ))}
                    </NotificationList>
                  ) : (
                    <EmptyNotifications>No notifications</EmptyNotifications>
                  )}
                </NotificationDropdown>
              )}
            </NotificationIconWrapper>

            <ThemeToggle onClick={toggleTheme}>
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </ThemeToggle>

            <UserAvatarContainer>
              <UserAvatar onClick={handleProfileClick}>
                {userInitial}
              </UserAvatar>
              <Tooltip>View Profile</Tooltip>
            </UserAvatarContainer>

            <LogoutButton onClick={handleLogout}>
              <FiLogOut />
              Logout
            </LogoutButton>
          </UserInfo>
        </Header>

        {children}
      </MainContent>
    </DashboardContainer>
  );
};

export default MainLayout;