import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootreducer';
import { authApi } from './services/authApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


