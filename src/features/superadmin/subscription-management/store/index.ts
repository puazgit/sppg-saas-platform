import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  SubscriptionManagementStore,
  SubscriptionState,
  SubscriptionPackageState, 
  SubscriptionAnalyticsState,
  SubscriptionDetailResponse,
  SubscriptionFiltersState
} from '../types'

// Initial state
const initialFilters: SubscriptionFiltersState = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

export const useSubscriptionManagementStore = create<SubscriptionManagementStore>()(
  devtools(
    persist(
      (set) => ({
        // Data State
        subscriptions: [],
        packages: [],
        analytics: null,
        selectedSubscription: null,
        
        // UI State
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        
        // Filters & Pagination
        filters: initialFilters,
        
        // Actions - Data Management
        setSubscriptions: (subscriptions: SubscriptionState[]) =>
          set({ subscriptions }, false, 'subscription-management/setSubscriptions'),
          
        setPackages: (packages: SubscriptionPackageState[]) =>
          set({ packages }, false, 'subscription-management/setPackages'),
          
        setAnalytics: (analytics: SubscriptionAnalyticsState) =>
          set({ analytics }, false, 'subscription-management/setAnalytics'),
          
        setSelectedSubscription: (subscription: SubscriptionDetailResponse | null) =>
          set({ selectedSubscription: subscription }, false, 'subscription-management/setSelectedSubscription'),
        
        // Actions - UI State
        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, 'subscription-management/setLoading'),
          
        setCreating: (creating: boolean) =>
          set({ isCreating: creating }, false, 'subscription-management/setCreating'),
          
        setUpdating: (updating: boolean) =>
          set({ isUpdating: updating }, false, 'subscription-management/setUpdating'),
          
        setDeleting: (deleting: boolean) =>
          set({ isDeleting: deleting }, false, 'subscription-management/setDeleting'),
        
        // Actions - Filters
        setFilters: (newFilters: Partial<SubscriptionFiltersState>) =>
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters }
            }),
            false,
            'subscription-management/setFilters'
          ),
          
        resetFilters: () =>
          set({ filters: initialFilters }, false, 'subscription-management/resetFilters'),
        
        // Actions - Operations
        addSubscription: (subscription: SubscriptionState) =>
          set(
            (state) => ({
              subscriptions: [subscription, ...state.subscriptions]
            }),
            false,
            'subscription-management/addSubscription'
          ),
          
        updateSubscription: (id: string, data: Partial<SubscriptionState>) =>
          set(
            (state) => ({
              subscriptions: state.subscriptions.map((subscription) =>
                subscription.id === id ? { ...subscription, ...data } : subscription
              )
            }),
            false,
            'subscription-management/updateSubscription'
          ),
          
        removeSubscription: (id: string) =>
          set(
            (state) => ({
              subscriptions: state.subscriptions.filter((subscription) => subscription.id !== id),
              selectedSubscription: state.selectedSubscription?.id === id ? null : state.selectedSubscription
            }),
            false,
            'subscription-management/removeSubscription'
          ),
      }),
      {
        name: 'superadmin-subscription-management-store',
        partialize: (state: SubscriptionManagementStore) => ({
          filters: state.filters
        })
      }
    ),
    { name: 'SuperAdmin Subscription Management Store' }
  )
)