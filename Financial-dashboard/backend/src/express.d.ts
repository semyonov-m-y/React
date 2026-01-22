import { JwtPayload } from 'jsonwebtoken';

/**
 * Расширение стандартного интерфейса Request из Express
 * Добавляем свойство user для хранения данных аутентифицированного пользователя
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Данные аутентифицированного пользователя
       * Добавляется middleware authenticateToken после проверки JWT токена
       */
      user?: JwtPayload & {
        userId: number;
        username: string;
        role: string;
      };
    }
  }
}

// Экспорт пустого объекта для удовлетворения требований модуля
export {};