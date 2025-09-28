import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { useSubscriptionManagementStore } from '../store'
import { 
  subscriptionSchema, 
  subscriptionPackageSchema,
  subscriptionAnalyticsSchema,
  type CreateSubscriptionForm,
  type UpdateSubscriptionForm
} from '../schemas'
import type { 
  SubscriptionListResponse, 
  SubscriptionDetailResponse,
  SubscriptionState,
  SubscriptionPackageState,
  SubscriptionAnalyticsState
} from '../types'

// ===== SUBSCRIPTION LIST HOOK =====
export function useSubscriptions() {
  const { user } = useAuth()
  const { filters, setSubscriptions } = useSubscriptionManagementStore()
  
  return useQuery({
    queryKey: ['superadmin', 'subscriptions', filters],
    queryFn: async (): Promise<SubscriptionListResponse> => {
      const searchParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(`/api/superadmin/subscriptions?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }
      
      const data = await response.json()
      
      // Validate and update store
      const validatedSubscriptions = data.data.map((sub: unknown) => subscriptionSchema.parse(sub))
      setSubscriptions(validatedSubscriptions)
      
      return {
        data: validatedSubscriptions,
        pagination: data.pagination
      }
    },
    enabled: !!user && user.userType === 'SUPERADMIN',
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000 // 30 seconds
  })
}

// ===== SUBSCRIPTION DETAIL HOOK =====
export function useSubscriptionDetail(id: string | undefined) {
  const { user } = useAuth()
  const { setSelectedSubscription } = useSubscriptionManagementStore()
  
  return useQuery({
    queryKey: ['superadmin', 'subscription', id],
    queryFn: async (): Promise<SubscriptionDetailResponse> => {
      const response = await fetch(`/api/superadmin/subscriptions/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch subscription detail')
      }
      
      const data = await response.json()
      const validatedSubscription = subscriptionSchema.parse(data)
      
      // Update store
      setSelectedSubscription(validatedSubscription as SubscriptionDetailResponse)
      
      return validatedSubscription as SubscriptionDetailResponse
    },
    enabled: !!user && user.userType === 'SUPERADMIN' && !!id,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })
}

// ===== SUBSCRIPTION PACKAGES HOOK =====
export function useSubscriptionPackages() {
  const { user } = useAuth()
  const { setPackages } = useSubscriptionManagementStore()
  
  return useQuery({
    queryKey: ['superadmin', 'subscription-packages'],
    queryFn: async (): Promise<SubscriptionPackageState[]> => {
      const response = await fetch('/api/superadmin/subscription-packages')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription packages')
      }
      
      const data = await response.json()
      const validatedPackages = data.map((pkg: unknown) => subscriptionPackageSchema.parse(pkg))
      
      // Update store
      setPackages(validatedPackages)
      
      return validatedPackages
    },
    enabled: !!user && user.userType === 'SUPERADMIN',
    staleTime: 10 * 60 * 1000 // 10 minutes
  })
}

// ===== SUBSCRIPTION ANALYTICS HOOK =====
export function useSubscriptionAnalytics() {
  const { user } = useAuth()
  const { setAnalytics } = useSubscriptionManagementStore()
  
  return useQuery({
    queryKey: ['superadmin', 'subscription-analytics'],
    queryFn: async (): Promise<SubscriptionAnalyticsState> => {
      const response = await fetch('/api/superadmin/subscription-analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription analytics')
      }
      
      const data = await response.json()
      const validatedAnalytics = subscriptionAnalyticsSchema.parse(data)
      
      // Update store
      setAnalytics(validatedAnalytics)
      
      return validatedAnalytics
    },
    enabled: !!user && user.userType === 'SUPERADMIN',
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000 // 1 minute
  })
}

// ===== CREATE SUBSCRIPTION MUTATION =====
export function useCreateSubscription() {
  const queryClient = useQueryClient()
  const { setCreating, addSubscription } = useSubscriptionManagementStore()
  
  return useMutation({
    mutationFn: async (data: CreateSubscriptionForm): Promise<SubscriptionState> => {
      setCreating(true)
      
      const response = await fetch('/api/superadmin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create subscription')
      }
      
      return response.json()
    },
    onSuccess: (newSubscription) => {
      // Update store
      addSubscription(newSubscription)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscription-analytics'] })
      
      setCreating(false)
    },
    onError: () => {
      setCreating(false)
    }
  })
}

// ===== UPDATE SUBSCRIPTION MUTATION =====
export function useUpdateSubscription() {
  const queryClient = useQueryClient()
  const { setUpdating, updateSubscription } = useSubscriptionManagementStore()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSubscriptionForm }): Promise<SubscriptionState> => {
      setUpdating(true)
      
      const response = await fetch(`/api/superadmin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subscription')
      }
      
      return response.json()
    },
    onSuccess: (updatedSubscription) => {
      // Update store
      updateSubscription(updatedSubscription.id, updatedSubscription)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscription', updatedSubscription.id] })
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscription-analytics'] })
      
      setUpdating(false)
    },
    onError: () => {
      setUpdating(false)
    }
  })
}

// ===== DELETE SUBSCRIPTION MUTATION =====
export function useDeleteSubscription() {
  const queryClient = useQueryClient()
  const { setDeleting, removeSubscription } = useSubscriptionManagementStore()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      setDeleting(true)
      
      const response = await fetch(`/api/superadmin/subscriptions/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete subscription')
      }
    },
    onSuccess: (_, deletedId) => {
      // Update store
      removeSubscription(deletedId)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'subscription-analytics'] })
      
      setDeleting(false)
    },
    onError: () => {
      setDeleting(false)
    }
  })
}