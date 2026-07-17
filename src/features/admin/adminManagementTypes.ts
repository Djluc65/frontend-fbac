import type { User } from '../../types/user'

export interface AdminSessionItem {
  _id: string
  device: string
  browser: string
  ipAddress: string
  createdAt?: string
  lastActivityAt?: string
  isCurrent?: boolean
}

export interface AdminProfileResponse {
  profile: User
}

export interface ActiveSessionsResponse {
  items: AdminSessionItem[]
}

export interface UpdateAdminProfilePayload {
  firstName: string
  lastName: string
  phone?: string
  preferredLanguage: string
  timezone: string
  notificationPreferences: {
    email: boolean
    security: boolean
    donations: boolean
    content: boolean
  }
}

export interface ChangeAdminEmailPayload {
  email: string
  currentPassword: string
}

export interface ChangeAdminPasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AdministratorListResponse {
  items: User[]
}

export interface AdministratorDetailsResponse {
  administrator: User
  sessions: AdminSessionItem[]
  recentAudit: Array<{
    _id: string
    action: string
    createdAt: string
    previousValues?: Record<string, unknown> | null
    newValues?: Record<string, unknown> | null
  }>
}

export interface AdministratorPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  permissions: string[]
  isActive: boolean
  isVerified: boolean
  preferredLanguage: string
  timezone: string
}

export interface CreateAdministratorPayload extends AdministratorPayload {
  passwordMode: 'temporary_password' | 'set_password_now' | 'invitation'
  password?: string
}

export interface RoleItem {
  _id: string
  name: string
  code: string
  description: string
  permissions: string[]
  isSystem: boolean
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface RolesResponse {
  items: RoleItem[]
}

export interface RoleResponse {
  role: RoleItem
}

export interface RolePayload {
  name: string
  code: string
  description: string
  permissions: string[]
  isActive: boolean
}

export interface PermissionsResponse {
  items: string[]
}

export interface InvitationItem {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  expiresAt: string
  acceptedAt?: string | null
  createdAt: string
  updatedAt: string
  activationLink?: string
}

export interface InvitationsResponse {
  items: InvitationItem[]
}

export interface CreateInvitationPayload {
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  preferredLanguage: string
  timezone: string
}
