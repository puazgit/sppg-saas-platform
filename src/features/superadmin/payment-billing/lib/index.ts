// Payment & Billing Management Utilities
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

import { format, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns'
import { id } from 'date-fns/locale'
import type {
  PaymentStatus,
  InvoiceStatus,
  PaymentMethod,
  PaymentGateway,
  PaymentFilters,
  InvoiceFilters
} from '../schemas'

// Payment Status Labels and Colors
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Selesai',
  FAILED: 'Gagal',
  CANCELLED: 'Dibatalkan',
  REFUNDED: 'Dikembalikan',
  PARTIAL_REFUND: 'Sebagian Dikembalikan'
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
  REFUNDED: 'bg-orange-100 text-orange-800 border-orange-200',
  PARTIAL_REFUND: 'bg-orange-100 text-orange-800 border-orange-200'
}

// Invoice Status Labels and Colors
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Terkirim',
  VIEWED: 'Dilihat',
  OVERDUE: 'Terlambat',
  PAID: 'Lunas',
  CANCELLED: 'Dibatalkan',
  REFUNDED: 'Dikembalikan'
}

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  SENT: 'bg-blue-100 text-blue-800 border-blue-200',
  VIEWED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  OVERDUE: 'bg-red-100 text-red-800 border-red-200',
  PAID: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
  REFUNDED: 'bg-orange-100 text-orange-800 border-orange-200'
}

// Payment Method Labels
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Transfer Bank',
  CREDIT_CARD: 'Kartu Kredit',
  DIGITAL_WALLET: 'Dompet Digital',
  VIRTUAL_ACCOUNT: 'Virtual Account',
  CASH: 'Tunai'
}

// Payment Gateway Labels
export const PAYMENT_GATEWAY_LABELS: Record<PaymentGateway, string> = {
  MIDTRANS: 'Midtrans',
  XENDIT: 'Xendit',
  DOKU: 'DOKU',
  FASPAY: 'Faspay',
  GOPAY: 'GoPay',
  OVO: 'OVO',
  DANA: 'DANA'
}

// Currency Formatting
export function formatCurrency(amount: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

// Date Formatting
export function formatPaymentDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd MMM yyyy, HH:mm', { locale: id })
  } catch {
    return 'Invalid date'
  }
}

export function formatInvoiceDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd MMM yyyy', { locale: id })
  } catch {
    return 'Invalid date'
  }
}

// Invoice Utilities
export function isInvoiceOverdue(dueDate: string, paidAt: string | null): boolean {
  if (paidAt) return false // Already paid
  
  try {
    const due = parseISO(dueDate)
    return isAfter(new Date(), due)
  } catch {
    return false
  }
}

export function getDaysUntilDue(dueDate: string): number {
  try {
    const due = parseISO(dueDate)
    const today = new Date()
    
    if (isAfter(today, due)) {
      return -differenceInDays(today, due) // Negative for overdue
    }
    
    return differenceInDays(due, today)
  } catch {
    return 0
  }
}

export function getDueDateStatus(dueDate: string, paidAt: string | null): {
  status: 'paid' | 'overdue' | 'due-soon' | 'normal'
  daysUntilDue: number
  label: string
} {
  if (paidAt) {
    return {
      status: 'paid',
      daysUntilDue: 0,
      label: 'Sudah Lunas'
    }
  }
  
  const days = getDaysUntilDue(dueDate)
  
  if (days < 0) {
    return {
      status: 'overdue',
      daysUntilDue: days,
      label: `Terlambat ${Math.abs(days)} hari`
    }
  }
  
  if (days <= 3) {
    return {
      status: 'due-soon',
      daysUntilDue: days,
      label: days === 0 ? 'Jatuh tempo hari ini' : `${days} hari lagi`
    }
  }
  
  return {
    status: 'normal',
    daysUntilDue: days,
    label: `${days} hari lagi`
  }
}

// Payment Utilities
export function calculateProcessingFee(amount: number, feeRate: number, feeType: 'FIXED' | 'PERCENTAGE'): number {
  if (feeType === 'FIXED') {
    return feeRate
  }
  return Math.round(amount * (feeRate / 100))
}

export function calculateNetAmount(amount: number, processingFee: number): number {
  return amount - processingFee
}

// Invoice Calculation
export function calculateInvoiceTotal(
  subtotal: number,
  taxRate: number = 0.11,
  discountRate: number = 0
): {
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
} {
  const discountAmount = Math.round(subtotal * discountRate)
  const discountedSubtotal = subtotal - discountAmount
  const taxAmount = Math.round(discountedSubtotal * taxRate)
  const totalAmount = discountedSubtotal + taxAmount
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount
  }
}

// Analytics Utilities
export function calculateRevenueTrend(current: number, previous: number): {
  percentage: number
  isPositive: boolean
} {
  if (previous === 0) {
    return { percentage: current > 0 ? 100 : 0, isPositive: current >= 0 }
  }
  
  const percentage = ((current - previous) / previous) * 100
  return {
    percentage: Math.abs(percentage),
    isPositive: percentage >= 0
  }
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatAverageRevenue(total: number, count: number): string {
  if (count === 0) return formatCurrency(0)
  return formatCurrency(total / count)
}

// Filter Utilities
export function getPaymentFilterOptions() {
  return {
    status: Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    method: Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label })),
    gateway: Object.entries(PAYMENT_GATEWAY_LABELS).map(([value, label]) => ({ value, label })),
    sortBy: [
      { value: 'createdAt', label: 'Tanggal Dibuat' },
      { value: 'paidAt', label: 'Tanggal Bayar' },
      { value: 'amount', label: 'Jumlah' },
      { value: 'status', label: 'Status' }
    ]
  }
}

export function getInvoiceFilterOptions() {
  return {
    status: Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    sortBy: [
      { value: 'createdAt', label: 'Tanggal Dibuat' },
      { value: 'issueDate', label: 'Tanggal Invoice' },
      { value: 'dueDate', label: 'Jatuh Tempo' },
      { value: 'totalAmount', label: 'Total Amount' },
      { value: 'status', label: 'Status' }
    ]
  }
}

// Query Building
export function buildPaymentSearchQuery(filters: PaymentFilters): Record<string, string> {
  const query: Record<string, string> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = String(value)
    }
  })
  
  return query
}

export function buildInvoiceSearchQuery(filters: InvoiceFilters): Record<string, string> {
  const query: Record<string, string> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = String(value)
    }
  })
  
  return query
}

// Validation Utilities
export function validatePaymentAmount(amount: number, minAmount?: number, maxAmount?: number): {
  isValid: boolean
  message?: string
} {
  if (amount <= 0) {
    return { isValid: false, message: 'Amount harus lebih dari 0' }
  }
  
  if (minAmount && amount < minAmount) {
    return { isValid: false, message: `Amount minimal ${formatCurrency(minAmount)}` }
  }
  
  if (maxAmount && amount > maxAmount) {
    return { isValid: false, message: `Amount maksimal ${formatCurrency(maxAmount)}` }
  }
  
  return { isValid: true }
}

export function validateInvoiceDates(
  issueDate: Date,
  dueDate: Date,
  billingPeriodStart: Date,
  billingPeriodEnd: Date
): {
  isValid: boolean
  message?: string
} {
  if (isBefore(dueDate, issueDate)) {
    return { isValid: false, message: 'Due date tidak boleh sebelum issue date' }
  }
  
  if (isBefore(billingPeriodEnd, billingPeriodStart)) {
    return { isValid: false, message: 'Billing period end tidak boleh sebelum start' }
  }
  
  return { isValid: true }
}

// Invoice Number Generation
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  
  return `${prefix}-${year}${month}${day}-${timestamp}`
}

// Payment Gateway Utilities
export function getGatewayProcessingFee(gateway: PaymentGateway, amount: number): number {
  const gatewayFees: Record<PaymentGateway, number> = {
    MIDTRANS: 2.9,
    XENDIT: 2.9,
    DOKU: 3.5,
    FASPAY: 3.0,
    GOPAY: 2.0,
    OVO: 2.0,
    DANA: 2.0
  }
  
  const feeRate = gatewayFees[gateway] || 2.9
  return calculateProcessingFee(amount, feeRate, 'PERCENTAGE')
}