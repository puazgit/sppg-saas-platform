// Payment & Billing Management Types
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

import type { PaymentMethod, PaymentStatus, InvoiceStatus, PaymentGateway, Currency } from '../schemas'

export interface PaymentState {
  id: string
  invoiceId: string
  subscriptionId: string
  sppgId: string
  amount: number
  currency: Currency
  method: PaymentMethod
  gateway: PaymentGateway | null
  gatewayTransactionId: string | null
  gatewayResponse: Record<string, unknown> | null
  status: PaymentStatus
  paidAt: string | null
  failureReason: string | null
  refundAmount: number | null
  refundedAt: string | null
  processingFee: number | null
  netAmount: number | null
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface InvoiceState {
  id: string
  invoiceNumber: string
  subscriptionId: string
  sppgId: string
  billingPeriodStart: string
  billingPeriodEnd: string
  issueDate: string
  dueDate: string
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number | null
  discountAmount: number | null
  totalAmount: number
  currency: Currency
  status: InvoiceStatus
  sentAt: string | null
  viewedAt: string | null
  paidAt: string | null
  cancelledAt: string | null
  notes: string | null
  termsAndConditions: string | null
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface InvoiceItemState {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface BillingAnalyticsState {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  averageRevenuePerUser: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  churnRate: number
  totalInvoices: number
  paidInvoices: number
  overdueInvoices: number
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  refundedPayments: number
  averagePaymentTime: number
  paymentMethodDistribution: {
    BANK_TRANSFER: number
    CREDIT_CARD: number
    DIGITAL_WALLET: number
    VIRTUAL_ACCOUNT: number
    CASH: number
  }
  revenueByTier: {
    BASIC: number
    STANDARD: number
    PRO: number
    ENTERPRISE: number
  }
  monthlyGrowth: number
  yearlyGrowth: number
}

export interface PaymentGatewayConfigState {
  id: string
  gateway: PaymentGateway
  name: string
  isActive: boolean
  configuration: Record<string, any>
  supportedMethods: PaymentMethod[]
  processingFee: number
  processingFeeType: 'FIXED' | 'PERCENTAGE'
  minAmount: number | null
  maxAmount: number | null
  settlementTime: number
  createdAt: string
  updatedAt: string
}

// Request/Response Types
export interface PaymentListResponse {
  payments: PaymentState[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface InvoiceListResponse {
  invoices: InvoiceState[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaymentDetailResponse {
  payment: PaymentState
  invoice: InvoiceState
  subscription: {
    id: string
    tier: string
    sppgId: string
    sppgName: string
  }
  timeline: {
    timestamp: string
    action: string
    description: string
    metadata: Record<string, any>
  }[]
}

export interface InvoiceDetailResponse {
  invoice: InvoiceState
  items: InvoiceItemState[]
  payments: PaymentState[]
  subscription: {
    id: string
    tier: string
    sppgId: string
    sppgName: string
  }
}

export interface CreatePaymentRequest {
  invoiceId: string
  amount: number
  method: PaymentMethod
  gateway?: PaymentGateway
  notes?: string
  metadata?: Record<string, any>
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus
  gatewayTransactionId?: string
  gatewayResponse?: Record<string, any>
  paidAt?: string
  failureReason?: string
  processingFee?: number
  metadata?: Record<string, any>
}

export interface CreateInvoiceRequest {
  subscriptionId: string
  billingPeriodStart: string
  billingPeriodEnd: string
  dueDate: string
  items: {
    description: string
    quantity: number
    unitPrice: number
  }[]
  taxRate?: number
  discountRate?: number
  notes?: string
  autoSend?: boolean
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus
  dueDate?: string
  notes?: string
  sentAt?: string
  viewedAt?: string
  paidAt?: string
  cancelledAt?: string
}

export interface RefundPaymentRequest {
  amount: number
  reason: string
  metadata?: Record<string, any>
}

// Filter States
export interface PaymentFiltersState {
  status?: PaymentStatus
  method?: PaymentMethod
  gateway?: PaymentGateway
  sppgId?: string
  invoiceId?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  search?: string
  page: number
  limit: number
  sortBy: 'createdAt' | 'paidAt' | 'amount' | 'status'
  sortOrder: 'asc' | 'desc'
}

export interface InvoiceFiltersState {
  status?: InvoiceStatus
  sppgId?: string
  subscriptionId?: string
  dateFrom?: string
  dateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
  amountMin?: number
  amountMax?: number
  search?: string
  page: number
  limit: number
  sortBy: 'createdAt' | 'issueDate' | 'dueDate' | 'totalAmount' | 'status'
  sortOrder: 'asc' | 'desc'
}

// Store Interfaces
export interface PaymentBillingManagementStore {
  // Payment State
  payments: PaymentState[]
  selectedPayment: PaymentState | null
  paymentFilters: PaymentFiltersState
  paymentAnalytics: BillingAnalyticsState | null
  
  // Invoice State
  invoices: InvoiceState[]
  selectedInvoice: InvoiceState | null
  invoiceFilters: InvoiceFiltersState
  
  // Gateway State
  paymentGateways: PaymentGatewayConfigState[]
  
  // Loading States
  isLoadingPayments: boolean
  isLoadingInvoices: boolean
  isLoadingAnalytics: boolean
  isLoadingGateways: boolean
  
  // Actions
  setPayments: (payments: PaymentState[]) => void
  setSelectedPayment: (payment: PaymentState | null) => void
  setPaymentFilters: (filters: Partial<PaymentFiltersState>) => void
  resetPaymentFilters: () => void
  
  setInvoices: (invoices: InvoiceState[]) => void
  setSelectedInvoice: (invoice: InvoiceState | null) => void
  setInvoiceFilters: (filters: Partial<InvoiceFiltersState>) => void
  resetInvoiceFilters: () => void
  
  setPaymentAnalytics: (analytics: BillingAnalyticsState) => void
  setPaymentGateways: (gateways: PaymentGatewayConfigState[]) => void
  
  setLoadingPayments: (loading: boolean) => void
  setLoadingInvoices: (loading: boolean) => void
  setLoadingAnalytics: (loading: boolean) => void
  setLoadingGateways: (loading: boolean) => void
}

