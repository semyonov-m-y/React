import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CurrenciesPage from './pages/CurrenciesPage';
import MarketAnalyticsPage from './pages/MarketAnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CurrencyDetailPage from './pages/CurrencyDetailPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import Logout from './pages/Logout';

/**
 * Интерфейс для пользовательских данных
 */
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * @param children - дочерние компоненты для отображения
 * @param adminOnly - флаг, указывающий требует ли маршрут прав администратора
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  /**
   * Получаем данные пользователя из localStorage
   */
  const userJson = localStorage.getItem('currentUser');
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  /**
   * Если пользователь не аутентифицирован, перенаправляем на страницу логина
   */
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Если маршрут требует прав администратора, но пользователь не администратор
   */
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Компонент для публичных маршрутов (редирект если пользователь уже авторизован)
 * @param children - дочерние компоненты для отображения
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /**
   * Получаем данные пользователя из localStorage
   */
  const userJson = localStorage.getItem('currentUser');
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  /**
   * Если пользователь уже авторизован, перенаправляем на дашборд
   */
  if (user && user.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * Главный компонент приложения, определяющий маршрутизацию
 * Содержит все маршруты приложения и логику защиты маршрутов
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты - доступны без авторизации */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/logout" element={<Logout />} />

        {/* Защищенные маршруты - требуют авторизации */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/currencies" element={<ProtectedRoute><CurrenciesPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><MarketAnalyticsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/currency/:id" element={<ProtectedRoute><CurrencyDetailPage /></ProtectedRoute>} />

        {/* Маршрут только для администраторов - требует прав администратора */}
        <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />

        {/* Маршрут для несуществующих страниц - отображает 404 ошибку */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;