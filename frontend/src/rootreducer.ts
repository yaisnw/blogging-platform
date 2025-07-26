import { combineReducers } from '@reduxjs/toolkit'
import { authApi,  } from './services/authApi'
import authUiSliceReducer from './slices/authUiSlice'
import authSliceReducer from './slices/authSlice'
import { blogsApi } from './services/blogsApi'

export const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [blogsApi.reducerPath]: blogsApi.reducer,
  authUi: authUiSliceReducer,
  auth: authSliceReducer
})

