import request from 'supertest';
import app from '../../backend/src/server';

/**
 * Интеграционные тесты полного flow пользователя
 */
describe('User Flow Integration Tests', () => {
  let authToken: string;
  let userId: number;

  /**
   * Тест полного цикла: регистрация → логин → доступ к защищенным ресурсам
   */
  it('should complete full user flow: register → login → access protected resources', async () => {
    // Шаг 1: Регистрация
    const registerResponse = await request(app)
      .post('/api/register')
      .send({
        username: 'integrationuser',
        password: 'integrationpass123',
        email: 'integration@example.com'
      })
      .expect(200);

    expect(registerResponse.body.success).toBe(true);
    userId = registerResponse.body.user.id;

    // Шаг 2: Логин
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        username: 'integrationuser',
        password: 'integrationpass123'
      })
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
    authToken = loginResponse.body.token;

    // Шаг 3: Доступ к защищенным эндпоинтам
    const protectedResponse = await request(app)
      .get('/api/proxy/latest')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(protectedResponse.body).toBeDefined();
  });

  /**
   * Тест проверки токена
   */
  it('should verify token validity', async () => {
    const verifyResponse = await request(app)
      .get('/api/verify-token')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(verifyResponse.body.success).toBe(true);
    expect(verifyResponse.body.user.username).toBe('integrationuser');
  });
});