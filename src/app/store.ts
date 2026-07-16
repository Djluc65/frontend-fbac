import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import paymentReducer from '../features/payments/paymentSlice'
import { baseApi } from '../services/baseApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    payment: paymentReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
