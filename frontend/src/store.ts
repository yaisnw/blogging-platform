import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootreducer';
import { authApi } from './services/authApi';
import { blogsApi } from './services/blogsApi';
import { picturesApi } from './services/picturesApi';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { setupListeners } from '@reduxjs/toolkit/query';
import { commentsApi } from './services/commentsApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(authApi.middleware, blogsApi.middleware, picturesApi.middleware, commentsApi.middleware),
});

export const persistor = persistStore(store)

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


