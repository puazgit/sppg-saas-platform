// Payment & Billing Management Store
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  PaymentBillingManagementStore,
  PaymentFiltersState,
  InvoiceFiltersState
} from '../types'

// Initial States
const initialPaymentFilters: PaymentFiltersState = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

const initialInvoiceFilters: InvoiceFiltersState = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

export const usePaymentBillingStore = create<PaymentBillingManagementStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Payment State
        payments: [],
        selectedPayment: null,
        paymentFilters: initialPaymentFilters,
        paymentAnalytics: null,
        
        // Invoice State
        invoices: [],
        selectedInvoice: null,
        invoiceFilters: initialInvoiceFilters,
        
        // Gateway State
        paymentGateways: [],
        
        // Loading States
        isLoadingPayments: false,
        isLoadingInvoices: false,
        isLoadingAnalytics: false,
        isLoadingGateways: false,
        
        // Payment Actions
        setPayments: (payments) => set({ payments }, false, 'setPayments'),
        
        setSelectedPayment: (payment) => 
          set({ selectedPayment: payment }, false, 'setSelectedPayment'),
        
        setPaymentFilters: (newFilters) => 
          set(
            { 
              paymentFilters: { 
                ...get().paymentFilters, 
                ...newFilters 
              } 
            },
            false,
            'setPaymentFilters'
          ),
        
        resetPaymentFilters: () => 
          set({ paymentFilters: initialPaymentFilters }, false, 'resetPaymentFilters'),
        
        // Invoice Actions
        setInvoices: (invoices) => set({ invoices }, false, 'setInvoices'),
        
        setSelectedInvoice: (invoice) => 
          set({ selectedInvoice: invoice }, false, 'setSelectedInvoice'),
        
        setInvoiceFilters: (newFilters) => 
          set(
            { 
              invoiceFilters: { 
                ...get().invoiceFilters, 
                ...newFilters 
              } 
            },
            false,
            'setInvoiceFilters'
          ),
        
        resetInvoiceFilters: () => 
          set({ invoiceFilters: initialInvoiceFilters }, false, 'resetInvoiceFilters'),
        
        // Analytics & Gateway Actions
        setPaymentAnalytics: (analytics) => 
          set({ paymentAnalytics: analytics }, false, 'setPaymentAnalytics'),
        
        setPaymentGateways: (gateways) => 
          set({ paymentGateways: gateways }, false, 'setPaymentGateways'),
        
        // Loading Actions
        setLoadingPayments: (loading) => 
          set({ isLoadingPayments: loading }, false, 'setLoadingPayments'),
        
        setLoadingInvoices: (loading) => 
          set({ isLoadingInvoices: loading }, false, 'setLoadingInvoices'),
        
        setLoadingAnalytics: (loading) => 
          set({ isLoadingAnalytics: loading }, false, 'setLoadingAnalytics'),
        
        setLoadingGateways: (loading) => 
          set({ isLoadingGateways: loading }, false, 'setLoadingGateways')
      }),
      {
        name: 'payment-billing-management-store',
        partialize: (state) => ({
          paymentFilters: state.paymentFilters,
          invoiceFilters: state.invoiceFilters,
          selectedPayment: state.selectedPayment,
          selectedInvoice: state.selectedInvoice
        })
      }
    ),
    {
      name: 'PaymentBillingManagementStore'
    }
  )
)

// Selector hooks for better performance
export const usePaymentFilters = () => usePaymentBillingStore((state) => state.paymentFilters)
export const useInvoiceFilters = () => usePaymentBillingStore((state) => state.invoiceFilters)
export const usePaymentAnalytics = () => usePaymentBillingStore((state) => state.paymentAnalytics)
export const useSelectedPayment = () => usePaymentBillingStore((state) => state.selectedPayment)
export const useSelectedInvoice = () => usePaymentBillingStore((state) => state.selectedInvoice)
export const usePaymentGateways = () => usePaymentBillingStore((state) => state.paymentGateways)