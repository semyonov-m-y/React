import request from 'supertest';
import app from '../../../backend/src/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Тесты для аутентификации и регистрации пользователей
 */
describe('Authentication API', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword123',
    email: 'test@example.com'
  };

  /**
   * Тест успешной регистрации пользователя
   */
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe(testUser.username);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.token).toBeDefined();
  });

  /**
   * Тест регистрации с существующим username
   */
  it('should not register user with existing username', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('already exists');
  });

  /**
   * Тест успешного логина
   */
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: testUser.password
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe(testUser.username);
    expect(response.body.token).toBeDefined();
  });

  /**
   * Тест логина с неверными credentials
   */
  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid credentials');
  });
});

/**
 * Тесты для защищенных эндпоинтов
 */
describe('Protected API Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    // Получаем токен для тестов
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'testpassword123'
      });

    authToken = response.body.token;
  });

  /**
   * Тест доступа к защищенному эндпоинту с валидным токеном
   */
  it('should access protected endpoint with valid token', async () => {
    const response = await request(app)
      .get('/api/proxy/latest')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  /**
   * Тест отказа в доступе без токена
   */
  it('should not access protected endpoint without token', async () => {
    const response = await request(app)
      .get('/api/proxy/latest')
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});