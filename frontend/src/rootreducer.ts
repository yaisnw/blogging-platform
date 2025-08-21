import { combineReducers } from '@reduxjs/toolkit'
import { authApi,  } from './services/authApi'
import uiSliceReducer from './slices/uiSlice'
import authSliceReducer from './slices/authSlice'
import { blogsApi } from './services/blogsApi'
import { picturesApi } from './services/picturesApi'

export const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [blogsApi.reducerPath]: blogsApi.reducer,
  [picturesApi.reducerPath]: picturesApi.reducer,
  ui: uiSliceReducer,
  auth: authSliceReducer
})

//set up redux persist for draft post id and image uploading