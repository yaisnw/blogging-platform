import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootreducer';
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { setupListeners } from '@reduxjs/toolkit/query';
import type { UiState } from './slices/uiSlice';
import { baseApi } from './services/baseApi';

const uiTransform = createTransform<UiState, Partial<UiState>>(
  (inboundState) => ({
    postId: inboundState.postId,
    alertIgnored: inboundState.alertIgnored
  }),
  (outboundState) => ({
    postId: outboundState.postId ?? 0,
    deletingPostIds: [],
    searchTab: "posts",
    profileTab: "posts",
    searchQuery: "",
    imageUploading: false,
    alertIgnored: outboundState.alertIgnored ?? false
  }),
  { whitelist: ["ui"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui", "post"],
  blacklist: [baseApi.reducerPath],
  transforms: [uiTransform],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
});

export const persistor = persistStore(store)

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


