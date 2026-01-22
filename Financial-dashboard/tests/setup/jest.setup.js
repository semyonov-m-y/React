// Настройка Jest для тестов
require('@testing-library/jest-dom');

// Моки для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Моки для fetch API
global.fetch = jest.fn();