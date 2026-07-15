import type { RootState } from '../../app/store'
import { canAccessAdminPanel } from './authTypes'

export const selectAuthState = (state: RootState) => state.auth
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state: RootState) => state.auth.accessToken
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user)
export const selectCanAccessAdminPanel = (state: RootState) =>
  canAccessAdminPanel(state.auth.user)
