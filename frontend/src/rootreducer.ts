import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from './services/authApi'
import authUiSliceReducer from './slices/authUiSlice'
import authSliceReducer from './slices/authSlice'

export const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  authUi: authUiSliceReducer,
  auth: authSliceReducer
})

