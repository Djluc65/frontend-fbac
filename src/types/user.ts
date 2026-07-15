export type BaseUserRole = 'user' | 'admin' | 'benefactor'

export type ExtendedUserRole =
  | 'manager'
  | 'donations_manager'
  | 'content_editor'
  | 'beneficiary_manager'
  | 'donor'
  | 'volunteer'
  | 'editor'
  | 'finance_manager'
  | 'super_admin'

export type UserRole = BaseUserRole | ExtendedUserRole

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isVerified: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  permissions?: string[]
  createdBy?: string | null
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
