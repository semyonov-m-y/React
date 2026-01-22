#Rick and Morty Universe App
Полнофункциональное веб-приложение для исследования вселенной Рика и Морти с системой аутентификации, управлением постами и персонажами.

## 🌟 Особенности
## 🎯 Основные функции
Просмотр персонажей из Rick and Morty API с карточками и табличным представлением

Аутентификация пользователей (регистрация и вход)

Создание и управление постами с изображениями и рейтингом

Панель администратора с переключением режима администратора

Темная/светлая тема с сохранением предпочтений

Поиск и фильтрация персонажей и контента

Пагинация для удобной навигации по персонажам

Адаптивный дизайн для всех устройств

## 🔧 Технические возможности
Валидация пароля с индикатором сложности

Защищенные маршруты для авторизованных пользователей

JWT-аутентификация с безопасным хранением токенов

Ленивая загрузка компонентов для оптимизации производительности

Управление состоянием через Redux Toolkit

Контексты для темы и административных прав

## 🏗️ Архитектура проекта
### Frontend (React + TypeScript)
text
src/
├── components/          # Переиспользуемые компоненты
├── contexts/           # React Contexts (Theme, Auth, Admin)
├── pages/              # Страницы приложения
├── store/              # Redux store и slices
├── services/           # API сервисы
├── types/              # TypeScript типы
└── styles/             # Стили и CSS модули
### Backend (Node.js + Express)
text
backend/
├── controllers/        # Контроллеры API
├── services/           # Бизнес-логика
├── data/               # JSON файлы базы данных
├── middlewares/        # Промежуточное ПО
└── routes/             # Маршруты API
## 📦 Установка и запуск
### Предварительные требования
Node.js 16+

npm или yarn

### Установка зависимостей
#### Frontend:
bash
cd rickandmorty-app
npm install
#### Backend:
bash
cd backend
npm install
### Конфигурация
Настройка переменных окружения (опционально):

Создайте .env файл в корне backend проекта

Добавьте JWT_SECRET=your-secret-key

Настройка API URL:

По умолчанию фронтенд использует http://localhost:3001/api

При необходимости измените в файлах сервисов

## Запуск приложения
Способ 1: Запуск отдельно
Backend сервер:

bash
cd backend
npm start
# или для разработки
npm run dev
Frontend приложение:

bash
cd rickandmorty-app
npm start
Способ 2: Использование скриптов
Создайте файл start-all.js в корне проекта:

javascript
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Запуск Rick and Morty Universe App...');

// Запуск backend
const backend = exec('npm start', { cwd: path.join(__dirname, 'backend') });
backend.stdout.on('data', (data) => console.log(`[Backend] ${data}`));
backend.stderr.on('data', (data) => console.error(`[Backend Error] ${data}`));

// Запуск frontend через 2 секунды
setTimeout(() => {
  const frontend = exec('npm start', { cwd: path.join(__dirname, 'rickandmorty-app') });
  frontend.stdout.on('data', (data) => console.log(`[Frontend] ${data}`));
  frontend.stderr.on('data', (data) => console.error(`[Frontend Error] ${data}`));
}, 2000);
Запустите командой:

bash
node start-all.js
## 🔐 API Endpoints
### Аутентификация
POST /api/auth/register - Регистрация пользователя

POST /api/auth/login - Вход в систему

GET /api/auth/me - Получение данных текущего пользователя

### Посты
GET /api/posts - Получение всех постов

POST /api/posts - Создание нового поста

GET /api/posts/:id - Получение поста по ID

DELETE /api/posts/:id - Удаление поста

### Здоровье системы
GET /api/auth/health - Проверка работы сервера

## 👥 Тестовые пользователи
Для тестирования доступны следующие пользователи:

Имя пользователя	Email	Пароль
vita	vita@mail.ru	V1t@Pass
lena	lena@gmail.com	L1n@Pass
anna	anna@mail.ru	A1n@Pass
Требования к паролю:

Минимум 8 символов

Одна заглавная буква

Одна строчная буква

Одна цифра

Один специальный символ (@$!%*?&)

## 🔧 Скрипты
### Frontend
npm start - Запуск в режиме разработки

npm build - Сборка для production

npm test - Запуск тестов

npm run lint - Проверка кода линтером

### Backend
npm start - Запуск сервера

npm run dev - Запуск в режиме разработки

npm run simple - Альтернативный запуск

## 🚀 Развертывание
### Heroku
bash
# Установите Heroku CLI
heroku create rickandmorty-universe

# Добавьте remote
git remote add heroku https://git.heroku.com/rickandmorty-universe.git

# Deploy
git push heroku main
## Vercel/Netlify
Импортируйте репозиторий

Установите build command: npm run build

Установите output directory: build

Добавьте переменные окружения при необходимости

## 📁 Структура данных
### Пользователи (db.users.json)
json
{
  "id": 1,
  "username": "vita",
  "email": "vita@mail.ru",
  "passwordHash": "$2a$10$...",
  "createdAt": "2025-09-24T18:12:47.417Z"
}
### Посты (db.posts.json)
json
{
  "id": 1,
  "title": "Заголовок",
  "body": "Содержание поста",
  "url": "https://example.com/image.jpg",
  "rate": 5,
  "createdAt": "2025-09-25T18:15:43.759Z",
  "userId": 1
}
## 🛠️ Технологии
### Frontend
React 18 - Библиотека для создания UI

TypeScript - Статическая типизация

Redux Toolkit - Управление состоянием

React Router 6 - Маршрутизация

Formik + Yup - Формы и валидация

Material-UI - Компоненты интерфейса

Axios - HTTP клиент

### Backend
Node.js - Серверная платформа

Express - Веб-фреймворк

bcryptjs - Хеширование паролей

jsonwebtoken - JWT аутентификация

CORS - Межсайтовые запросы

## 🔒 Безопасность
Пароли хешируются с помощью bcrypt

JWT токены с истечением через 24 часа

Валидация входящих данных

Защищенные маршруты

CORS политика

## 🐛 Устранение неполадок
### Проблемы с запуском
Порт занят: Измените порт в backend/index.js или rickandmorty-app/package.json

Ошибки зависимостей: Удалите node_modules и package-lock.json, затем npm install

CORS ошибки: Проверьте настройки CORS в backend

### Проблемы с аутентификацией
Неверные учетные данные: Используйте тестовых пользователей

Токен не сохраняется: Проверьте localStorage в DevTools

Ошибка 401: Перезайдите в систему

## 🤝 Вклад в проект
Форкните репозиторий

Создайте ветку для функции (git checkout -b feature/amazing-feature)

Зафиксируйте изменения (git commit -m 'Add amazing feature')

Запушьте ветку (git push origin feature/amazing-feature)

Откройте Pull Request

## 📄 Лицензия
Этот проект лицензирован под MIT License - смотрите файл LICENSE для деталей.

## 🙏 Благодарности
The Rick and Morty API за предоставление данных

Создателям Rick and Morty - Джастину Ройланду и Дэну Хармону