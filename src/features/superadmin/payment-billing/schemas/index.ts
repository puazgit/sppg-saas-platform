import { z } from 'zod'

// Payment Method Enum
export const paymentMethodSchema = z.enum(['BANK_TRANSFER', 'CREDIT_CARD', 'DIGITAL_WALLET', 'VIRTUAL_ACCOUNT', 'CASH'])

// Payment Status Enum
export const paymentStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIAL_REFUND'])

// Invoice Status Enum
export const invoiceStatusSchema = z.enum(['DRAFT', 'SENT', 'VIEWED', 'OVERDUE', 'PAID', 'CANCELLED', 'REFUNDED'])

// Payment Gateway Enum
export const paymentGatewaySchema = z.enum(['MIDTRANS', 'XENDIT', 'DOKU', 'FASPAY', 'GOPAY', 'OVO', 'DANA'])

// Currency Enum
export const currencySchema = z.enum(['IDR', 'USD'])

// Payment Base Schema
export const paymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  sppgId: z.string(),
  amount: z.number().min(0),
  currency: currencySchema,
  method: paymentMethodSchema,
  gateway: paymentGatewaySchema.nullable(),
  gatewayTransactionId: z.string().nullable(),
  gatewayResponse: z.record(z.any()).nullable(),
  status: paymentStatusSchema,
  paidAt: z.string().nullable(),
  failureReason: z.string().nullable(),
  refundAmount: z.number().nullable(),
  refundedAt: z.string().nullable(),
  processingFee: z.number().nullable(),
  netAmount: z.number().nullable(),
  metadata: z.record(z.any()).default({}),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Relations
  invoice: z.object({
    id: z.string(),
    invoiceNumber: z.string(),
    totalAmount: z.number(),
    dueDate: z.string()
  }).optional(),
  subscription: z.object({
    id: z.string(),
    tier: z.string(),
    sppgId: z.string()
  }).optional()
})

// Invoice Schema
export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  subscriptionId: z.string(),
  sppgId: z.string(),
  billingPeriodStart: z.string(),
  billingPeriodEnd: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  subtotal: z.number().min(0),
  taxRate: z.number().min(0).max(1),
  taxAmount: z.number().min(0),
  discountRate: z.number().min(0).max(1).nullable(),
  discountAmount: z.number().min(0).nullable(),
  totalAmount: z.number().min(0),
  currency: currencySchema,
  status: invoiceStatusSchema,
  sentAt: z.string().nullable(),
  viewedAt: z.string().nullable(),
  paidAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  notes: z.string().nullable(),
  termsAndConditions: z.string().nullable(),
  metadata: z.record(z.any()).default({}),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Relations
  subscription: z.object({
    id: z.string(),
    tier: z.string(),
    sppgId: z.string()
  }).optional(),
  sppg: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable()
  }).optional(),
  items: z.array(z.object({
    id: z.string(),
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    totalPrice: z.number()
  })).default([]),
  payments: z.array(paymentSchema).default([])
})

// Billing Analytics Schema
export const billingAnalyticsSchema = z.object({
  totalRevenue: z.number(),
  monthlyRevenue: z.number(),
  yearlyRevenue: z.number(),
  averageRevenuePerUser: z.number(),
  monthlyRecurringRevenue: z.number(),
  annualRecurringRevenue: z.number(),
  churnRate: z.number(),
  totalInvoices: z.number(),
  paidInvoices: z.number(),
  overdueInvoices: z.number(),
  totalPayments: z.number(),
  successfulPayments: z.number(),
  failedPayments: z.number(),
  refundedPayments: z.number(),
  averagePaymentTime: z.number(), // in hours
  paymentMethodDistribution: z.object({
    BANK_TRANSFER: z.number(),
    CREDIT_CARD: z.number(),
    DIGITAL_WALLET: z.number(),
    VIRTUAL_ACCOUNT: z.number(),
    CASH: z.number()
  }),
  revenueByTier: z.object({
    BASIC: z.number(),
    STANDARD: z.number(),
    PRO: z.number(),
    ENTERPRISE: z.number()
  }),
  monthlyGrowth: z.number(),
  yearlyGrowth: z.number()
})

// Payment Gateway Configuration Schema
export const paymentGatewayConfigSchema = z.object({
  id: z.string(),
  gateway: paymentGatewaySchema,
  name: z.string(),
  isActive: z.boolean(),
  configuration: z.record(z.any()),
  supportedMethods: z.array(paymentMethodSchema),
  processingFee: z.number(),
  processingFeeType: z.enum(['FIXED', 'PERCENTAGE']),
  minAmount: z.number().nullable(),
  maxAmount: z.number().nullable(),
  settlementTime: z.number(), // in hours
  createdAt: z.string(),
  updatedAt: z.string()
})

// Form Schemas
export const createPaymentFormSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice wajib dipilih'),
  amount: z.number().min(1, 'Amount harus lebih dari 0'),
  method: paymentMethodSchema,
  gateway: paymentGatewaySchema.optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).default({})
})

export const createInvoiceFormSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription wajib dipilih'),
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
  dueDate: z.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    quantity: z.number().min(1, 'Quantity harus lebih dari 0'),
    unitPrice: z.number().min(0, 'Unit price tidak boleh negatif')
  })).min(1, 'Minimal satu item wajib ada'),
  taxRate: z.number().min(0).max(1).default(0.11), // PPN 11%
  discountRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
  autoSend: z.boolean().default(false)
})

export const paymentFiltersSchema = z.object({
  status: paymentStatusSchema.optional(),
  method: paymentMethodSchema.optional(),
  gateway: paymentGatewaySchema.optional(),
  sppgId: z.string().optional(),
  invoiceId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
  sortBy: z.enum(['createdAt', 'paidAt', 'amount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const invoiceFiltersSchema = z.object({
  status: invoiceStatusSchema.optional(),
  sppgId: z.string().optional(),
  subscriptionId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
  sortBy: z.enum(['createdAt', 'issueDate', 'dueDate', 'totalAmount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Payment Method Options
export const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Transfer Bank', icon: 'Banknote' },
  { value: 'CREDIT_CARD', label: 'Kartu Kredit', icon: 'CreditCard' },
  { value: 'DIGITAL_WALLET', label: 'Dompet Digital', icon: 'Wallet' },
  { value: 'VIRTUAL_ACCOUNT', label: 'Virtual Account', icon: 'Building' },
  { value: 'CASH', label: 'Tunai', icon: 'Coins' }
] as const

// Payment Status Options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'PROCESSING', label: 'Processing', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
  { value: 'FAILED', label: 'Failed', color: 'red' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'gray' },
  { value: 'REFUNDED', label: 'Refunded', color: 'orange' },
  { value: 'PARTIAL_REFUND', label: 'Partial Refund', color: 'orange' }
] as const

// Invoice Status Options
export const INVOICE_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', color: 'gray' },
  { value: 'SENT', label: 'Sent', color: 'blue' },
  { value: 'VIEWED', label: 'Viewed', color: 'cyan' },
  { value: 'OVERDUE', label: 'Overdue', color: 'red' },
  { value: 'PAID', label: 'Paid', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'gray' },
  { value: 'REFUNDED', label: 'Refunded', color: 'orange' }
] as const

// Payment Gateway Options
export const PAYMENT_GATEWAYS = [
  { value: 'MIDTRANS', label: 'Midtrans', processingFee: 2.9 },
  { value: 'XENDIT', label: 'Xendit', processingFee: 2.9 },
  { value: 'DOKU', label: 'DOKU', processingFee: 3.5 },
  { value: 'FASPAY', label: 'Faspay', processingFee: 3.0 },
  { value: 'GOPAY', label: 'GoPay', processingFee: 2.0 },
  { value: 'OVO', label: 'OVO', processingFee: 2.0 },
  { value: 'DANA', label: 'DANA', processingFee: 2.0 }
] as const

// Types
export type Payment = z.infer<typeof paymentSchema>
export type Invoice = z.infer<typeof invoiceSchema>
export type BillingAnalytics = z.infer<typeof billingAnalyticsSchema>
export type PaymentGatewayConfig = z.infer<typeof paymentGatewayConfigSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>
export type PaymentGateway = z.infer<typeof paymentGatewaySchema>
export type Currency = z.infer<typeof currencySchema>
export type CreatePaymentForm = z.infer<typeof createPaymentFormSchema>
export type CreateInvoiceForm = z.infer<typeof createInvoiceFormSchema>
export type PaymentFilters = z.infer<typeof paymentFiltersSchema>
export type InvoiceFilters = z.infer<typeof invoiceFiltersSchema>