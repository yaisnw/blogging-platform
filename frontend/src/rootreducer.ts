import { combineReducers } from '@reduxjs/toolkit'
import uiSliceReducer from './slices/uiSlice'
import authSliceReducer from './slices/authSlice'
import postSliceReducer from './slices/draftPostSlice'

import { baseApi } from './services/baseApi'

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  ui: uiSliceReducer,
  auth: authSliceReducer,
  post: postSliceReducer
})

