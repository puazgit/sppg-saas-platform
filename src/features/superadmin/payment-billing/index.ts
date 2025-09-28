// Payment & Billing Management Main Index
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

// Types
export type { 
  PaymentState,
  InvoiceState,
  InvoiceItemState,
  BillingAnalyticsState,
  PaymentGatewayConfigState,
  PaymentListResponse,
  InvoiceListResponse,
  PaymentDetailResponse,
  InvoiceDetailResponse,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  RefundPaymentRequest,
  PaymentFiltersState,
  InvoiceFiltersState,
  PaymentBillingManagementStore
} from './types'

// Schemas
export { 
  paymentSchema,
  invoiceSchema,
  billingAnalyticsSchema,
  paymentGatewayConfigSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  invoiceStatusSchema,
  paymentGatewaySchema,
  currencySchema,
  createPaymentFormSchema,
  createInvoiceFormSchema,
  paymentFiltersSchema,
  invoiceFiltersSchema,
  PAYMENT_METHODS,
  PAYMENT_STATUS_OPTIONS,
  INVOICE_STATUS_OPTIONS,
  PAYMENT_GATEWAYS,
  type Payment,
  type Invoice,
  type BillingAnalytics,
  type PaymentGatewayConfig,
  type PaymentMethod,
  type PaymentStatus,
  type InvoiceStatus,
  type PaymentGateway,
  type Currency,
  type CreatePaymentForm,
  type CreateInvoiceForm,
  type PaymentFilters,
  type InvoiceFilters
} from './schemas'

// Store
export { 
  usePaymentBillingStore,
  usePaymentFilters,
  useInvoiceFilters,
  usePaymentAnalytics,
  useSelectedPayment,
  useSelectedInvoice,
  usePaymentGateways
} from './store'

// Hooks (will be exported after creation)
export { 
  usePayments,
  usePaymentDetail,
  useInvoices,
  useInvoiceDetail,
  useBillingAnalytics,
  usePaymentGateways as usePaymentGatewayConfigs,
  useCreatePayment,
  useUpdatePayment,
  useRefundPayment,
  useCreateInvoice,
  useUpdateInvoice,
  useSendInvoice,
  useDeleteInvoice,
  QUERY_KEYS
} from './hooks'

// Utilities
export { 
  formatCurrency,
  formatPaymentDate,
  formatInvoiceDate,
  calculateInvoiceTotal,
  calculateProcessingFee,
  calculateRevenueTrend,
  formatPercentage,
  formatAverageRevenue,
  isInvoiceOverdue,
  getDaysUntilDue,
  getDueDateStatus,
  validatePaymentAmount,
  validateInvoiceDates,
  generateInvoiceNumber,
  getGatewayProcessingFee,
  getPaymentFilterOptions,
  getInvoiceFilterOptions,
  buildPaymentSearchQuery,
  buildInvoiceSearchQuery,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_GATEWAY_LABELS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS
} from './lib'

// Components
export { BillingOverview } from './components/billing-overview'
export { PaymentList } from './components/payment-list'
export { InvoiceList } from './components/invoice-list'
export { PaymentDetail } from './components/payment-detail'
export { InvoiceDetail } from './components/invoice-detail'