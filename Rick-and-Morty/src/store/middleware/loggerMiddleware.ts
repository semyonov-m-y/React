import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.groupCollapsed('Dispatching action:', action.type);
  console.log('Previous state:', store.getState());
  console.log('Action payload:', action.payload);

  const result = next(action);

  console.log('Next state:', store.getState());
  console.groupEnd();

  return result;
};