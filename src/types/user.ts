export type BaseUserRole = 'user' | 'admin' | 'benefactor'

export type ExtendedUserRole =
  | 'manager'
  | 'donations_manager'
  | 'content_editor'
  | 'beneficiary_manager'
  | 'content_manager'
  | 'campaign_manager'
  | 'donor'
  | 'volunteer'
  | 'editor'
  | 'reviewer'
  | 'support_manager'
  | 'finance_manager'
  | 'super_admin'

export type UserRole = BaseUserRole | ExtendedUserRole

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string | null
  role: UserRole
  isVerified: boolean
  isActive?: boolean
  mustChangePassword?: boolean
  preferredLanguage?: string
  timezone?: string
  notificationPreferences?: {
    email: boolean
    security: boolean
    donations: boolean
    content: boolean
  }
  lastLoginAt?: string | null
  passwordChangedAt?: string | null
  createdAt?: string
  updatedAt?: string
  permissions?: string[]
  createdBy?: string | null
  updatedBy?: string | null
  deletedAt?: string | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedUsersResponse {
  users: User[]
  pagination: PaginationMeta
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  isVerified?: boolean
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  email?: string
  role?: UserRole
  isVerified?: boolean
  isActive?: boolean
}
