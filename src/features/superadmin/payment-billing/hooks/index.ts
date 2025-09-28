// Payment & Billing Management Hooks
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  PaymentListResponse,
  InvoiceListResponse,
  PaymentDetailResponse,
  InvoiceDetailResponse,
  BillingAnalyticsState,
  PaymentGatewayConfigState,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  RefundPaymentRequest,
  PaymentFiltersState,
  InvoiceFiltersState
} from '../types'
import { usePaymentBillingStore } from '../store'

// API Base URL
const API_BASE = '/api/superadmin'

// Query Keys
export const QUERY_KEYS = {
  PAYMENTS: 'payments',
  PAYMENT_DETAIL: 'payment-detail',
  INVOICES: 'invoices', 
  INVOICE_DETAIL: 'invoice-detail',
  BILLING_ANALYTICS: 'billing-analytics',
  PAYMENT_GATEWAYS: 'payment-gateways'
} as const

// Payment Queries
export function usePayments(filters?: PaymentFiltersState) {
  const { setLoadingPayments } = usePaymentBillingStore()
  
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, filters],
    queryFn: async (): Promise<PaymentListResponse> => {
      setLoadingPayments(true)
      try {
        const searchParams = new URLSearchParams()
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value))
            }
          })
        }
        
        const response = await fetch(`${API_BASE}/payments?${searchParams.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch payments')
        }
        
        return response.json()
      } finally {
        setLoadingPayments(false)
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  })
}

export function usePaymentDetail(paymentId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_DETAIL, paymentId],
    queryFn: async (): Promise<PaymentDetailResponse> => {
      const response = await fetch(`${API_BASE}/payments/${paymentId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch payment detail')
      }
      return response.json()
    },
    enabled: !!paymentId,
    staleTime: 60000 // 1 minute
  })
}

// Invoice Queries
export function useInvoices(filters?: InvoiceFiltersState) {
  const { setLoadingInvoices } = usePaymentBillingStore()
  
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICES, filters],
    queryFn: async (): Promise<InvoiceListResponse> => {
      setLoadingInvoices(true)
      try {
        const searchParams = new URLSearchParams()
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value))
            }
          })
        }
        
        const response = await fetch(`${API_BASE}/invoices?${searchParams.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch invoices')
        }
        
        return response.json()
      } finally {
        setLoadingInvoices(false)
      }
    },
    staleTime: 30000,
    gcTime: 300000
  })
}

export function useInvoiceDetail(invoiceId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICE_DETAIL, invoiceId],
    queryFn: async (): Promise<InvoiceDetailResponse> => {
      const response = await fetch(`${API_BASE}/invoices/${invoiceId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch invoice detail')
      }
      return response.json()
    },
    enabled: !!invoiceId,
    staleTime: 60000
  })
}

// Analytics Query
export function useBillingAnalytics() {
  const { setLoadingAnalytics } = usePaymentBillingStore()
  
  return useQuery({
    queryKey: [QUERY_KEYS.BILLING_ANALYTICS],
    queryFn: async (): Promise<BillingAnalyticsState> => {
      setLoadingAnalytics(true)
      try {
        const response = await fetch(`${API_BASE}/billing-analytics`)
        if (!response.ok) {
          throw new Error('Failed to fetch billing analytics')
        }
        return response.json()
      } finally {
        setLoadingAnalytics(false)
      }
    },
    staleTime: 300000, // 5 minutes
    gcTime: 600000 // 10 minutes
  })
}

// Payment Gateways Query
export function usePaymentGateways() {
  const { setLoadingGateways } = usePaymentBillingStore()
  
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_GATEWAYS],
    queryFn: async (): Promise<PaymentGatewayConfigState[]> => {
      setLoadingGateways(true)
      try {
        const response = await fetch(`${API_BASE}/payment-gateways`)
        if (!response.ok) {
          throw new Error('Failed to fetch payment gateways')
        }
        return response.json()
      } finally {
        setLoadingGateways(false)
      }
    },
    staleTime: 600000, // 10 minutes
    gcTime: 1800000 // 30 minutes
  })
}

// Payment Mutations
export function useCreatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreatePaymentRequest) => {
      const response = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create payment')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Payment berhasil dibuat')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat payment')
    }
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePaymentRequest }) => {
      const response = await fetch(`${API_BASE}/payments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update payment')
      }
      
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_DETAIL, id] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Payment berhasil diupdate')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate payment')
    }
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RefundPaymentRequest }) => {
      const response = await fetch(`${API_BASE}/payments/${id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to refund payment')
      }
      
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_DETAIL, id] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Refund berhasil diproses')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memproses refund')
    }
  })
}

// Invoice Mutations
export function useCreateInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateInvoiceRequest) => {
      const response = await fetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create invoice')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Invoice berhasil dibuat')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat invoice')
    }
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceRequest }) => {
      const response = await fetch(`${API_BASE}/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update invoice')
      }
      
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICE_DETAIL, id] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Invoice berhasil diupdate')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate invoice')
    }
  })
}

export function useSendInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await fetch(`${API_BASE}/invoices/${invoiceId}/send`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send invoice')
      }
      
      return response.json()
    },
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICE_DETAIL, invoiceId] })
      toast.success('Invoice berhasil dikirim')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengirim invoice')
    }
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete invoice')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING_ANALYTICS] })
      toast.success('Invoice berhasil dihapus')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus invoice')
    }
  })
}