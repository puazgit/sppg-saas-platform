/**
 * Subscription Feature - Utility Functions
 * Helper functions for subscription-related operations
 */

import { RegistrationData, SubscriptionPackage } from '../schemas/subscription.schema'
import { PaymentMethod } from '../types/payment'
import { calculatePaymentFee } from '../config/payment-methods'

/**
 * Calculate total subscription cost including fees and taxes
 */
export function calculateTotalCost(
  packageObj: SubscriptionPackage,
  paymentMethod: PaymentMethod,
  isYearly: boolean = false
): {
  basePrice: number
  paymentFee: number
  tax: number
  total: number
  savings?: number
} {
  const basePrice = isYearly ? packageObj.yearlyPrice : packageObj.monthlyPrice
  const paymentFee = calculatePaymentFee(paymentMethod, basePrice)
  const tax = Math.round(basePrice * 0.11) // 11% PPN
  const total = basePrice + paymentFee + tax

  let savings = 0
  if (isYearly) {
    const monthlyTotal = packageObj.monthlyPrice * 12
    savings = monthlyTotal - packageObj.yearlyPrice
  }

  return {
    basePrice,
    paymentFee,
    tax,
    total,
    ...(isYearly && { savings })
  }
}

/**
 * Validate SPPG code format
 */
export function validateSppgCode(code: string): {
  isValid: boolean
  message?: string
} {
  if (!code) {
    return { isValid: false, message: 'Kode SPPG wajib diisi' }
  }

  if (code.length < 3) {
    return { isValid: false, message: 'Kode SPPG minimal 3 karakter' }
  }

  if (code.length > 20) {
    return { isValid: false, message: 'Kode SPPG maksimal 20 karakter' }
  }

  // Check format: only alphanumeric and hyphens
  const validFormat = /^[A-Za-z0-9-]+$/.test(code)
  if (!validFormat) {
    return { isValid: false, message: 'Kode SPPG hanya boleh berisi huruf, angka, dan tanda hubung' }
  }

  return { isValid: true }
}

/**
 * Format phone number to Indonesian standard
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Convert to Indonesian format
  if (digits.startsWith('8')) {
    return `+62${digits}`
  } else if (digits.startsWith('08')) {
    return `+62${digits.substring(1)}`
  } else if (digits.startsWith('628')) {
    return `+${digits}`
  } else if (digits.startsWith('62')) {
    return `+${digits}`
  }
  
  return phone // Return original if no pattern matches
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Calculate completion percentage of registration data
 */
export function calculateRegistrationCompleteness(data: Partial<RegistrationData>): {
  percentage: number
  completedFields: string[]
  missingFields: string[]
} {
  const requiredFields = [
    'code', 'name', 'description', 'address', 'phone', 'email',
    'targetRecipients', 'maxRadius', 'maxTravelTime', 'operationStartDate',
    'provinceId', 'regencyId', 'districtId', 'villageId',
    'picName', 'picPosition', 'picEmail', 'picPhone',
    'organizationType', 'establishedYear', 'city', 'postalCode'
  ]

  const completedFields = requiredFields.filter(field => {
    const value = data[field as keyof RegistrationData]
    return value !== undefined && value !== null && value !== ''
  })

  const missingFields = requiredFields.filter(field => {
    const value = data[field as keyof RegistrationData]
    return value === undefined || value === null || value === ''
  })

  const percentage = Math.round((completedFields.length / requiredFields.length) * 100)

  return {
    percentage,
    completedFields,
    missingFields
  }
}

/**
 * Generate SPPG reference number
 */
export function generateSppgReference(
  provinceCode: string,
  regencyCode: string,
  timestamp?: Date
): string {
  const date = timestamp || new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()

  return `SPPG-${provinceCode}-${regencyCode}-${year}${month}${day}-${random}`
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Calculate package tier benefits comparison
 */
export function comparePlan(plan: SubscriptionPackage, referencePlan?: SubscriptionPackage): {
  recipientIncrease?: number
  staffIncrease?: number
  distributionPointIncrease?: number
  additionalFeatures?: string[]
} {
  if (!referencePlan) return {}

  return {
    recipientIncrease: plan.maxRecipients - referencePlan.maxRecipients,
    staffIncrease: plan.maxStaff - referencePlan.maxStaff,
    distributionPointIncrease: plan.maxDistributionPoints - referencePlan.maxDistributionPoints,
    additionalFeatures: plan.features.filter(feature => !referencePlan.features.includes(feature))
  }
}

/**
 * Validate operational dates
 */
export function validateOperationalDates(startDate: string, endDate?: string): {
  isValid: boolean
  message?: string
} {
  const start = new Date(startDate)
  const today = new Date()
  
  // Start date should not be in the past (with some tolerance)
  const minDate = new Date()
  minDate.setDate(today.getDate() - 30) // Allow up to 30 days in the past
  
  if (start < minDate) {
    return {
      isValid: false,
      message: 'Tanggal mulai operasi tidak boleh lebih dari 30 hari yang lalu'
    }
  }

  if (endDate) {
    const end = new Date(endDate)
    if (end <= start) {
      return {
        isValid: false,
        message: 'Tanggal berakhir harus setelah tanggal mulai'
      }
    }

    // End date should be at least 3 months after start
    const minEndDate = new Date(start)
    minEndDate.setMonth(start.getMonth() + 3)
    
    if (end < minEndDate) {
      return {
        isValid: false,
        message: 'Durasi operasi minimal 3 bulan'
      }
    }
  }

  return { isValid: true }
}

/**
 * Calculate estimated service coverage
 */
export function calculateServiceCoverage(
  targetRecipients: number,
  maxRadius: number,
  maxDistributionPoints: number
): {
  estimatedCoverage: string
  recommendedDistributionPoints: number
  avgRecipientsPerPoint: number
} {
  const avgRecipientsPerPoint = Math.ceil(targetRecipients / maxDistributionPoints)
  const recommendedDistributionPoints = Math.min(
    Math.ceil(targetRecipients / 100), // Max 100 recipients per point
    maxDistributionPoints
  )

  let estimatedCoverage = 'Terbatas'
  if (maxRadius >= 25) estimatedCoverage = 'Luas'
  else if (maxRadius >= 15) estimatedCoverage = 'Sedang'
  else if (maxRadius >= 5) estimatedCoverage = 'Kecil'

  return {
    estimatedCoverage,
    recommendedDistributionPoints,
    avgRecipientsPerPoint
  }
}