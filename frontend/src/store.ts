import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootreducer';
import { authApi } from './services/authApi';
import { postsApi } from './services/postsApi';
import { picturesApi } from './services/picturesApi';
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { setupListeners } from '@reduxjs/toolkit/query';
import { commentsApi } from './services/commentsApi';
import { likesApi } from './services/likesApi';
import { userApi } from './services/userApi';
import type { UiState } from './slices/uiSlice';

const uiTransform = createTransform<UiState, Partial<UiState>>(
  (inboundState) => ({
    postId: inboundState.postId,
  }),
  (outboundState) => ({
    postId: outboundState.postId ?? 0,
    deletingPostIds: [],
    tabState: "posts",
    searchQuery: "",
    imageUploading: false,
  }),
  { whitelist: ["ui"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui", "post"],
  transforms: [uiTransform],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(authApi.middleware,
      postsApi.middleware,
      picturesApi.middleware,
      commentsApi.middleware,
      likesApi.middleware,
      userApi.middleware),
});

export const persistor = persistStore(store)

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


