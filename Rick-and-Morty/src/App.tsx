import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import PostsPage from './pages/PostsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />
            } />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/character/:id" element={
              <ProtectedRoute>
                <CharacterPage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } />
            <Route path="/posts" element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              </ProtectedRoute>
            } />

            {/* Fallback routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;