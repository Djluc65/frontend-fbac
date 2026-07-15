import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from './authTypes'

const initialState: AuthState = {
  user: null,
  accessToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser | null; accessToken?: string | null }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken ?? state.accessToken
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
    },
  },
})

export const { setCredentials, setAccessToken, clearCredentials } = authSlice.actions
export default authSlice.reducer
