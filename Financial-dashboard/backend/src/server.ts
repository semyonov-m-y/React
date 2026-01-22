import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-jwt-secret-key';

// Используем абсолютный путь к файлу пользователей
const USERS_FILE_PATH = path.resolve(__dirname, 'data', 'users.json');
console.log('Users file will be created at:', USERS_FILE_PATH);

app.use(cors());
app.use(express.json());

/**
 * Интерфейс для аутентифицированного запроса
 * Расширяет стандартный Request добавлением свойства user
 */
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

/**
 * Middleware для проверки JWT токена
 * Добавляет данные пользователя в объект Request
 */
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    // Добавляем пользователя в объект запроса
    req.user = user;
    next();
  });
};

/**
 * Middleware для проверки прав администратора
 * Должен использоваться после authenticateToken
 */
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin rights required.'
    });
  }
  next();
};

/**
 * Функция для чтения пользователей из файла с улучшенной обработкой ошибок
 */
const readUsersFromFile = (): any[] => {
  try {
    console.log('Reading users from:', USERS_FILE_PATH);

    // Создаем директорию если она не существует
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Created directory:', dir);
    }

    if (!fs.existsSync(USERS_FILE_PATH)) {
      console.log('Users file does not exist, creating new one');
      const emptyArray: any[] = [];
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(emptyArray, null, 2));
      return emptyArray;
    }

    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    console.log('Raw file content length:', data.length);

    if (!data.trim()) {
      console.log('File is empty, returning empty array');
      return [];
    }

    const parsedData = JSON.parse(data);
    console.log('Parsed users count:', parsedData.length);

    if (!Array.isArray(parsedData)) {
      console.log('File does not contain array, resetting');
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    }

    return parsedData;
  } catch (error: any) {
    console.error('Error reading users file:', error.message);
    // Создаем новый файл при ошибке
    try {
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([], null, 2));
      console.log('Created new users file due to error');
    } catch (writeError) {
      console.error('Error creating new users file:', writeError);
    }
    return [];
  }
};

/**
 * Функция для записи пользователей в файл
 */
const writeUsersToFile = (users: any[]): void => {
  try {
    console.log('Writing', users.length, 'users to file');

    // Создаем директорию если она не существует
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    console.log('Successfully wrote users to file');

    // Проверяем что записалось
    const verifyData = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    console.log('File verification - content length:', verifyData.length);
  } catch (error: any) {
    console.error('Error writing users file:', error.message);
    throw error;
  }
};

/**
 * Инициализация admin пользователя при запуске
 */
const initializeAdminUser = async (): Promise<void> => {
  try {
    console.log('=== INITIALIZING ADMIN USER ===');
    let users = readUsersFromFile();
    console.log('Current users count:', users.length);

    let adminUser = users.find((user: any) => user.username === 'admin');

    if (!adminUser) {
      console.log('Admin user not found, creating new one...');

      // Хешируем пароль с bcryptjs
      const saltRounds = 12;
      const hashedPassword = bcrypt.hashSync('admin', saltRounds);
      console.log('Generated admin password hash:', hashedPassword);

      adminUser = {
        id: 1,
        username: 'admin',
        password: hashedPassword,
        email: 'admin@financial-dashboard.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      users.push(adminUser);
      writeUsersToFile(users);

      console.log('✅ Admin user created successfully');

      // Проверяем что пользователь сохранился
      const verifyUsers = readUsersFromFile();
      console.log('Users after admin creation:', verifyUsers.length);
    } else {
      console.log('Admin user already exists');
      console.log('Admin user details:', {
        username: adminUser.username,
        passwordLength: adminUser.password?.length,
        role: adminUser.role
      });

      // Проверяем пароль
      const isValid = bcrypt.compareSync('admin', adminUser.password);
      console.log('Admin password check result:', isValid);

      if (!isValid) {
        console.log('Admin password is invalid, resetting...');
        const newHash = bcrypt.hashSync('admin', 12);
        adminUser.password = newHash;
        writeUsersToFile(users);
        console.log('Admin password reset successfully');
      }
    }
  } catch (error: any) {
    console.error('❌ Error initializing admin user:', error.message);
  }
};

// Инициализируем admin пользователя при запуске сервера
initializeAdminUser();

/**
 * Эндпоинт регистрации нового пользователя
 */
app.post('/api/register', (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    console.log('Registration attempt:', { username, email });

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password and email are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const users = readUsersFromFile();
    console.log('Current users before registration:', users.length);

    const existingUser = users.find((u: any) => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    const saltRounds = 12;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log('Password hashed successfully');

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
      username,
      password: hashedPassword,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Проверяем что пользователь сохранился
    const verifyUsers = readUsersFromFile();
    const savedUser = verifyUsers.find((u: any) => u.username === username);
    console.log('User saved verification:', !!savedUser);

    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User registered successfully:', username);

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

/**
 * Эндпоинт логина пользователя
 */
app.post('/api/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for user:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const users = readUsersFromFile();
    console.log('Total users in system:', users.length);
    console.log('Available usernames:', users.map((u: any) => u.username));

    const user = users.find((u: any) => u.username === username);
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', user.username);
    console.log('Stored password hash length:', user.password?.length);

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for user:', username);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

/**
 * Эндпоинт для получения всех пользователей (только для администраторов)
 */
app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = readUsersFromFile();

    // Возвращаем пользователей без паролей
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.json({
      success: true,
      users: usersWithoutPasswords
    });
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Эндпоинт для создания нового пользователя (только для администраторов)
 */
app.post('/api/admin/users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Валидация входных данных
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required'
      });
    }

    const users = readUsersFromFile();

    // Проверяем, существует ли пользователь
    const existingUser = users.find((u: any) => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Хешируем пароль
    const hashedPassword = bcrypt.hashSync(password, 12);

    // Создаем нового пользователя
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = newUser;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Эндпоинт для обновления пользователя (только для администраторов)
 */
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, password, role } = req.body;

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Проверяем уникальность username и email
    const existingUser = users.find((u: any) =>
      (u.username === username || u.email === email) && u.id !== userId
    );
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Обновляем пользователя
    const updatedUser = {
      ...users[userIndex],
      username,
      email,
      role
    };

    // Обновляем пароль только если он предоставлен
    if (password) {
      updatedUser.password = bcrypt.hashSync(password, 12);
    }

    users[userIndex] = updatedUser;
    writeUsersToFile(users);

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Эндпоинт для удаления пользователя (только для администраторов)
 */
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Не позволяем удалить самого себя
    if (req.user && req.user.userId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Удаляем пользователя
    users.splice(userIndex, 1);
    writeUsersToFile(users);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Эндпоинт для обновления профиля текущего пользователя
 */
app.put('/api/user/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, phone, position, department, location, bio } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user.userId;

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Проверяем уникальность username и email
    const existingUser = users.find((u: any) =>
      (u.username === username || u.email === email) && u.id !== userId
    );
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Обновляем пользователя
    users[userIndex] = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      email: email || users[userIndex].email,
      phone: phone || users[userIndex].phone,
      position: position || users[userIndex].position,
      department: department || users[userIndex].department,
      location: location || users[userIndex].location,
      bio: bio || users[userIndex].bio
    };

    writeUsersToFile(users);

    // Возвращаем обновленного пользователя без пароля
    const { password, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Эндпоинт для смены пароля текущего пользователя
 */
app.put('/api/user/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const users = readUsersFromFile();
    const user = users.find((u: any) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Хешируем новый пароль
    user.password = bcrypt.hashSync(newPassword, 12);
    writeUsersToFile(users);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Error changing password:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Защищенные эндпоинты (требуют аутентификации)
app.get('/api/proxy/historical', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date } = req.query;
    const response = await axios.get(`https://www.cbr-xml-daily.ru/archive/${date}/daily_json.js`, {
      validateStatus: (status) => status < 500
    });

    if (response.status === 404) {
      return res.status(404).json({ error: 'Data not found for this date' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

app.get('/api/proxy/latest', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const response = await axios.get('https://www.cbr-xml-daily.ru/latest.js');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current rate' });
  }
});

/**
 * Эндпоинт для проверки токена
 */
app.get('/api/verify-token', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * Эндпоинт для проверки здоровья сервера
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    usersFile: USERS_FILE_PATH
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Users file: ${USERS_FILE_PATH}`);
});