import type { OrganizationType, SppgStatus } from '@prisma/client'

// Core SPPG types
export interface SPPG {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  organizationType: OrganizationType
  status: SppgStatus
  provinceId: number
  targetRecipients: number | null
  picName: string | null
  picPhone: string | null
  picEmail: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SPPGWithRelations extends SPPG {
  province: {
    id: number
    name: string
  } | null
  users: Array<{
    id: string
    name: string
    email: string
    userType: string
    isActive: boolean
  }>
  _count: {
    users: number
    menuPlans: number
    distributions: number
  }
}

// Stats and analytics
export interface SPPGStats {
  total: number
  active: number
  inactive: number
  pending: number
  totalBeneficiaries: number
  totalMonthlyBudget: number
}

// Filters
export interface SPPGFilters {
  search?: string
  status?: SppgStatus
  organizationType?: OrganizationType
  provinceId?: number
  isActive?: boolean
}

// Pagination
export interface SPPGPagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// API Response types
export interface SPPGListResponse {
  success: boolean
  data: SPPGWithRelations[]
  stats: SPPGStats
  pagination: SPPGPagination
}

export interface SPPGDetailResponse {
  success: boolean
  data: SPPGWithRelations | null
}

// Form data types
export interface CreateSPPGData {
  name: string
  email?: string
  phone?: string
  address?: string
  organizationType: OrganizationType
  provinceId: number
  targetRecipients?: number
  picName?: string
  picPhone?: string
  picEmail?: string
}

export interface UpdateSPPGData extends Partial<CreateSPPGData> {
  status?: SppgStatus
}

// Store state types
export interface SPPGManagementState {
  sppgs: SPPGWithRelations[]
  stats: SPPGStats | null
  filters: SPPGFilters
  pagination: SPPGPagination
  selectedSppgIds: string[]
  isLoading: boolean
  error: string | null
}

export interface SPPGManagementActions {
  setSppgs: (sppgs: SPPGWithRelations[]) => void
  setStats: (stats: SPPGStats) => void
  setFilters: (filters: Partial<SPPGFilters>) => void
  setPagination: (pagination: Partial<SPPGPagination>) => void
  toggleSppgSelection: (sppgId: string) => void
  selectAllSppgs: () => void
  clearSelection: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type SPPGManagementStore = SPPGManagementState & SPPGManagementActions