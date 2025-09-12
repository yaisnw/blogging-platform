import { combineReducers } from '@reduxjs/toolkit'
import { authApi,  } from './services/authApi'
import uiSliceReducer from './slices/uiSlice'
import authSliceReducer from './slices/authSlice'
import { postsApi } from './services/postsApi'
import { picturesApi } from './services/picturesApi'
import { commentsApi } from './services/commentsApi'
import { likesApi } from './services/likesApi'

export const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [picturesApi.reducerPath]: picturesApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [likesApi.reducerPath]: likesApi.reducer,
  ui: uiSliceReducer,
  auth: authSliceReducer
})

