/**
 * Billing Hooks - TanStack Query Integration
 * TanStack Query hooks untuk billing system sesuai Development Agreement
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import type { 
  SubscriptionPackage, 
  Subscription, 
  Invoice,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse 
} from '../types'

// ===== SUBSCRIPTION PACKAGES =====
export function useSubscriptionPackages() {
  return useQuery({
    queryKey: ['subscription-packages'],
    queryFn: async (): Promise<SubscriptionPackage[]> => {
      const response = await fetch('/api/billing/packages')
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      const data = await response.json()
      return data.packages || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ===== CURRENT SUBSCRIPTION =====
export function useCurrentSubscription(sppgId?: string) {
  const { user } = useAuth()
  const targetSppgId = sppgId || user?.sppgId

  return useQuery({
    queryKey: ['current-subscription', targetSppgId],
    queryFn: async (): Promise<Subscription | null> => {
      if (!targetSppgId) return null
      
      const response = await fetch(`/api/billing/subscription/${targetSppgId}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch subscription')
      }
      return response.json()
    },
    enabled: !!targetSppgId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// ===== INVOICES =====
export function useInvoices(sppgId?: string) {
  const { user } = useAuth()
  const targetSppgId = sppgId || user?.sppgId

  return useQuery({
    queryKey: ['invoices', targetSppgId],
    queryFn: async (): Promise<Invoice[]> => {
      if (!targetSppgId) return []
      
      const response = await fetch(`/api/billing/invoices/${targetSppgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      return response.json()
    },
    enabled: !!targetSppgId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// ===== CREATE SUBSCRIPTION =====
export function useCreateSubscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
      const response = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create subscription')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      
      // Optionally redirect or show success message
      console.log('Subscription created successfully:', data)
    },
    onError: (error) => {
      console.error('Subscription creation failed:', error)
    }
  })
}

// ===== UPDATE SUBSCRIPTION =====
export function useUpdateSubscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ sppgId, data }: { 
      sppgId: string
      data: Partial<CreateSubscriptionRequest> 
    }): Promise<Subscription> => {
      const response = await fetch(`/api/billing/subscription/${sppgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subscription')
      }
      
      return response.json()
    },
    onSuccess: (data, { sppgId }) => {
      // Update cache
      queryClient.setQueryData(['current-subscription', sppgId], data)
      queryClient.invalidateQueries({ queryKey: ['invoices', sppgId] })
    }
  })
}

// ===== CANCEL SUBSCRIPTION =====
export function useCancelSubscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (sppgId: string): Promise<Subscription> => {
      const response = await fetch(`/api/billing/subscription/${sppgId}/cancel`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to cancel subscription')
      }
      
      return response.json()
    },
    onSuccess: (data, sppgId) => {
      // Update cache
      queryClient.setQueryData(['current-subscription', sppgId], data)
    }
  })
}

// ===== ENTERPRISE ANALYTICS =====
export function useSubscriptionAnalytics(sppgId?: string) {
  const { user } = useAuth()
  const targetSppgId = sppgId || user?.sppgId

  return useQuery({
    queryKey: ['subscription-analytics', targetSppgId],
    queryFn: async () => {
      if (!targetSppgId) return null
      
      const response = await fetch(`/api/billing/analytics/${targetSppgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    },
    enabled: !!targetSppgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ===== BILLING NOTIFICATIONS =====
export function useBillingNotifications(sppgId?: string) {
  const { user } = useAuth()
  const targetSppgId = sppgId || user?.sppgId

  return useQuery({
    queryKey: ['billing-notifications', targetSppgId],
    queryFn: async () => {
      if (!targetSppgId) return []
      
      const response = await fetch(`/api/billing/notifications/${targetSppgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      return response.json()
    },
    enabled: !!targetSppgId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// ===== PAYMENT METHODS =====
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      // ENTERPRISE: Real payment methods from database only
      const response = await fetch('/api/billing/payment-methods')
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods')
      }
      const data = await response.json()
      return data.paymentMethods || []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}