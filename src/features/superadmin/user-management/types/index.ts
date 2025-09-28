import type { UserType } from '@prisma/client'

// Core user types
export interface User {
  id: string
  name: string
  email: string
  userType: UserType
  isActive: boolean
  sppgId: string | null
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithRelations extends User {
  sppg: {
    id: string
    name: string
    province: {
      name: string
    } | null
  } | null
  userRoles: Array<{
    role: {
      id: string
      name: string
      description: string | null
    }
  }>
}

// Filter and query types
export interface UserFilters {
  search?: string
  userType?: UserType
  sppgId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface UserStats {
  total: number
  superAdmins: number
  sppgUsers: number
  activeUsers: number
  inactiveUsers: number
  recentLogins: number
}

// API response types
export interface UsersApiResponse {
  success: boolean
  data: {
    users: UserWithRelations[]
    stats: UserStats
    sppgList: Array<{
      id: string
      name: string
      _count: {
        users: number
      }
    }>
    pagination: {
      page: number
      limit: number
      totalCount: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

// Form types
export interface CreateUserForm {
  name: string
  email: string
  userType: UserType
  sppgId?: string
  roleIds?: string[]
  isActive: boolean
}

export interface UpdateUserForm extends Partial<CreateUserForm> {
  id: string
}

// Store types
export interface UserManagementState {
  users: UserWithRelations[]
  stats: UserStats | null
  sppgList: Array<{
    id: string
    name: string
    _count: { users: number }
  }>
  selectedUserIds: string[]
  filters: UserFilters
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  isLoading: boolean
  error: string | null
}

export interface UserManagementActions {
  setUsers: (users: UserWithRelations[]) => void
  setStats: (stats: UserStats) => void
  setSppgList: (sppgList: UserManagementState['sppgList']) => void
  setSelectedUserIds: (ids: string[]) => void
  toggleUserSelection: (id: string) => void
  selectAllUsers: () => void
  clearSelection: () => void
  setFilters: (filters: Partial<UserFilters>) => void
  setPagination: (pagination: Partial<UserManagementState['pagination']>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}