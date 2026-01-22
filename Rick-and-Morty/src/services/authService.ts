import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/Auth';

// Проверяем, доступен ли бэкенд
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/health', {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const API_BASE_URL = 'http://localhost:3001/api/auth';

// Мок-данные для временного хранения пользователей
const getMockUsers = (): User[] => {
  const stored = localStorage.getItem('mockUsers');
  return stored ? JSON.parse(stored) : [];
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Пытаемся использовать бэкенд
      const backendAvailable = await isBackendAvailable();

      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          return response.json();
        }
      }

      // Если бэкенд недоступен, используем мок-данные
      const users = getMockUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('User not found');
      }

      // В мок-режиме проверяем любой пароль (для демонстрации)
      if (credentials.password.length < 1) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        // Используем мок-данные при ошибке сети
        const users = getMockUsers();
        const user = users.find(u => u.email === credentials.email);

        if (!user) {
          throw new Error('User not found');
        }

        const token = generateToken(user);

        return {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        };
      }
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Пытаемся использовать бэкенд
      const backendAvailable = await isBackendAvailable();

      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password
          }),
        });

        if (response.ok) {
          return response.json();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
      }

      // Если бэкенд недоступен, используем мок-данные
      const users = getMockUsers();

      // Проверяем, существует ли пользователь
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Создаем нового пользователя
      const newUser: User = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveMockUsers(users);

      const token = generateToken(newUser);

      return {
        token,
        user: newUser
      };
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        // Используем мок-данные при ошибке сети
        const users = getMockUsers();

        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          throw new Error('User already exists');
        }

        const newUser: User = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveMockUsers(users);

        const token = generateToken(newUser);

        return {
          token,
          user: newUser
        };
      }
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<any> {
    try {
      // Пытаемся использовать бэкенд
      const backendAvailable = await isBackendAvailable();

      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          return response.json();
        }
      }

      // Если бэкенд недоступен, используем мок-данные
      const users = getMockUsers();

      // Декодируем токен (очень упрощенно)
      try {
        const decoded = JSON.parse(atob(token));
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } catch (e) {
        throw new Error('Invalid token');
      }
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        // Используем мок-данные при ошибке сети
        const users = getMockUsers();

        try {
          const decoded = JSON.parse(atob(token));
          const user = users.find(u => u.id === decoded.userId);

          if (!user) {
            throw new Error('User not found');
          }

          return user;
        } catch (e) {
          throw new Error('Invalid token');
        }
      }
      throw error;
    }
  },
};