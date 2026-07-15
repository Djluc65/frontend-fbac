import type { User } from '../../types/user'

export interface AuthUser extends User {
  permissions?: string[]
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
}

export interface RefreshResponse {
  message?: string
  accessToken?: string
}

export interface NormalizedAuthResponse {
  user: AuthUser
  accessToken: string | null
}

export const ADMIN_PANEL_ROLES = ['admin', 'super_admin', 'manager'] as const

export const canAccessAdminPanel = (user: AuthUser | null | undefined) => {
  if (!user) {
    return false
  }

  const permissions = user.permissions ?? []

  return (
    ADMIN_PANEL_ROLES.includes(user.role as (typeof ADMIN_PANEL_ROLES)[number]) ||
    permissions.includes('*') ||
    permissions.includes('content.manage') ||
    permissions.includes('staff.manage') ||
    permissions.includes('dashboard.read')
  )
}
