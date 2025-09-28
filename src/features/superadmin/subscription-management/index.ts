// Subscription Management Module Exports
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

// Types
export type { 
  SubscriptionState,
  SubscriptionPackageState,
  SubscriptionAnalyticsState,
  SubscriptionTier,
  SubscriptionStatus,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionFiltersState,
  SubscriptionListResponse,
  SubscriptionDetailResponse,
  SubscriptionManagementStore
} from './types'

// Schemas
export { 
  subscriptionSchema,
  subscriptionPackageSchema,
  subscriptionAnalyticsSchema,
  subscriptionTierSchema,
  subscriptionStatusSchema,
  createSubscriptionFormSchema,
  updateSubscriptionFormSchema,
  subscriptionFiltersSchema,
  SUBSCRIPTION_TIERS,
  type Subscription,
  type SubscriptionPackage,
  type SubscriptionAnalytics,
  type CreateSubscriptionForm,
  type UpdateSubscriptionForm,
  type SubscriptionFilters
} from './schemas'

// Store
export { useSubscriptionManagementStore } from './store'

// Hooks
export { 
  useSubscriptions,
  useSubscriptionDetail,
  useSubscriptionPackages,
  useSubscriptionAnalytics,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription
} from './hooks'

// Utilities
export { 
  SUBSCRIPTION_TIER_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_COLORS,
  SUBSCRIPTION_TIER_COLORS,
  formatSubscriptionDate,
  isSubscriptionExpiring,
  isSubscriptionExpired,
  getDaysUntilExpiry,
  formatCurrency,
  calculateYearlyDiscount,
  validateSubscriptionLimits,
  getSubscriptionLimits,
  buildSubscriptionSearchQuery,
  getSubscriptionFilterOptions,
  calculateChurnRate,
  formatPercentage,
  getSubscriptionTierDistribution
} from './lib'

// Components
export { SubscriptionManagementPage } from './components/subscription-management-page'
export { SubscriptionOverview } from './components/subscription-overview'
export { SubscriptionList } from './components/subscription-list'
export { SubscriptionFilters as SubscriptionFiltersComponent } from './components/subscription-filters'
export { CreateSubscriptionDialog } from './components/create-subscription-dialog'