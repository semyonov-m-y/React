# Financial Dashboard 💹

A comprehensive financial dashboard application built with React TypeScript frontend and Node.js Express backend for real-time currency tracking, market analytics, and user management.

![Dashboard Preview](https://via.placeholder.com/800x400/3498db/ffffff?text=Financial+Dashboard)

## 🌟 Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT tokens
- **Role-based Access Control** (Admin/User)
- **Secure Password Management** with bcrypt
- **Profile Management** with password change functionality

### 📊 Financial Features
- **Real-time Currency Rates** from Central Bank of Russia API
- **Interactive Charts** with historical data
- **Multiple Currency Pairs** (USD/RUB, EUR/RUB, GBP/RUB, etc.)
- **Live Market Updates** with 30-second intervals
- **Portfolio Management** with visual distribution

### 📈 Market Analytics
- **Technical Indicators** (RSI, MACD, Stochastic)
- **Market Sentiment Analysis**
- **Sector Performance** breakdown
- **Customizable Time Frames** (1D, 1W, 1M, 3M, 1Y)

### 👥 User Management (Admin Only)
- **Complete CRUD Operations** for users
- **Role Management** (Admin/User)
- **Real-time User List Updates**
- **Secure User Deletion** with confirmation

### 🎨 User Experience
- **Dark/Light Theme** support
- **Responsive Design** for all devices
- **Real-time Notifications**
- **Interactive Navigation** with active states

## 🛠 Technology Stack

### Frontend
- **React 19** with TypeScript
- **Styled Components** for styling
- **React Router DOM** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **File-based Storage** for user data

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd financial-dashboard