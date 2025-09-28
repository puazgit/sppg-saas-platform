// Subscription Management Types
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

export interface SubscriptionState {
  id: string
  sppgId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  startDate: string
  endDate: string | null
  billingDate: string
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  storageGb: number
  packageId: string | null
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPackageState {
  id: string
  name: string
  tier: SubscriptionTier
  description: string | null
  monthlyPrice: number
  yearlyPrice: number
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  storageGb: number
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionAnalyticsState {
  totalSubscriptions: number
  activeSubscriptions: number
  expiredSubscriptions: number
  suspendedSubscriptions: number
  cancelledSubscriptions: number
  revenueThisMonth: number
  revenueLastMonth: number
  churnRate: number
  newSubscriptionsThisMonth: number
  distributionByTier: {
    BASIC: number
    STANDARD: number
    PRO: number
    ENTERPRISE: number
  }
  upcomingExpirations: number
}

export type SubscriptionTier = 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'

export interface CreateSubscriptionRequest {
  sppgId: string
  packageId: string
  tier: SubscriptionTier
  billingDate: string
  startDate: string
  endDate?: string
}

export interface UpdateSubscriptionRequest {
  tier?: SubscriptionTier
  status?: SubscriptionStatus
  packageId?: string
  billingDate?: string
  endDate?: string
  maxRecipients?: number
  maxStaff?: number
  maxDistributionPoints?: number
  storageGb?: number
}

export interface SubscriptionFiltersState {
  status?: SubscriptionStatus
  tier?: SubscriptionTier
  search?: string
  expiringWithin?: number // days
  page: number
  limit: number
  sortBy: 'createdAt' | 'endDate' | 'sppgName' | 'tier'
  sortOrder: 'asc' | 'desc'
}

// API Response Types
export interface SubscriptionListResponse {
  data: SubscriptionState[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SubscriptionDetailResponse extends SubscriptionState {
  sppg: {
    id: string
    name: string
    email: string | null
    status: string
    createdAt: string
  }
  package?: {
    id: string
    name: string
    tier: SubscriptionTier
    monthlyPrice: number
    yearlyPrice: number
  }
}

// Store State Interface
export interface SubscriptionManagementStore {
  // Data State
  subscriptions: SubscriptionState[]
  packages: SubscriptionPackageState[]
  analytics: SubscriptionAnalyticsState | null
  selectedSubscription: SubscriptionDetailResponse | null
  
  // UI State
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Filters & Pagination
  filters: SubscriptionFiltersState
  
  // Actions - Data Management
  setSubscriptions: (subscriptions: SubscriptionState[]) => void
  setPackages: (packages: SubscriptionPackageState[]) => void
  setAnalytics: (analytics: SubscriptionAnalyticsState) => void
  setSelectedSubscription: (subscription: SubscriptionDetailResponse | null) => void
  
  // Actions - UI State
  setLoading: (loading: boolean) => void
  setCreating: (creating: boolean) => void
  setUpdating: (updating: boolean) => void
  setDeleting: (deleting: boolean) => void
  
  // Actions - Filters
  setFilters: (filters: Partial<SubscriptionFiltersState>) => void
  resetFilters: () => void
  
  // Actions - Operations
  addSubscription: (subscription: SubscriptionState) => void
  updateSubscription: (id: string, data: Partial<SubscriptionState>) => void
  removeSubscription: (id: string) => void
}