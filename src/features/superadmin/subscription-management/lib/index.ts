// Subscription Management Utilities
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

import type { SubscriptionTier, SubscriptionStatus } from '../types'

// ===== SUBSCRIPTION UTILITIES =====

export const SUBSCRIPTION_TIER_LABELS: Record<SubscriptionTier, string> = {
  BASIC: 'Basic',
  STANDARD: 'Standard', 
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise'
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Nonaktif',
  SUSPENDED: 'Ditangguhkan',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa'
}

export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'green',
  INACTIVE: 'gray',
  SUSPENDED: 'yellow',
  CANCELLED: 'red',
  EXPIRED: 'orange'
}

export const SUBSCRIPTION_TIER_COLORS: Record<SubscriptionTier, string> = {
  BASIC: 'blue',
  STANDARD: 'purple',
  PRO: 'indigo',
  ENTERPRISE: 'gold'
}

// ===== DATE UTILITIES =====

export function formatSubscriptionDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function isSubscriptionExpiring(endDate: string | null, withinDays = 30): boolean {
  if (!endDate) return false
  
  const expiry = new Date(endDate)
  const now = new Date()
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= withinDays && diffDays > 0
}

export function isSubscriptionExpired(endDate: string | null): boolean {
  if (!endDate) return false
  
  const expiry = new Date(endDate)
  const now = new Date()
  
  return expiry < now
}

export function getDaysUntilExpiry(endDate: string | null): number | null {
  if (!endDate) return null
  
  const expiry = new Date(endDate)
  const now = new Date()
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// ===== PRICING UTILITIES =====

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function calculateYearlyDiscount(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyVsMonthly = monthlyPrice * 12
  const discount = ((yearlyVsMonthly - yearlyPrice) / yearlyVsMonthly) * 100
  return Math.round(discount)
}

// ===== SUBSCRIPTION VALIDATION UTILITIES =====

export function validateSubscriptionLimits(
  tier: SubscriptionTier,
  currentUsage: {
    recipients: number
    staff: number
    distributionPoints: number
    storageGb: number
  }
): {
  valid: boolean
  violations: string[]
} {
  const limits = getSubscriptionLimits(tier)
  const violations: string[] = []
  
  if (currentUsage.recipients > limits.maxRecipients) {
    violations.push(`Jumlah penerima (${currentUsage.recipients}) melebihi batas ${tier} (${limits.maxRecipients})`)
  }
  
  if (currentUsage.staff > limits.maxStaff) {
    violations.push(`Jumlah staff (${currentUsage.staff}) melebihi batas ${tier} (${limits.maxStaff})`)
  }
  
  if (currentUsage.distributionPoints > limits.maxDistributionPoints) {
    violations.push(`Jumlah titik distribusi (${currentUsage.distributionPoints}) melebihi batas ${tier} (${limits.maxDistributionPoints})`)
  }
  
  if (currentUsage.storageGb > limits.storageGb) {
    violations.push(`Penggunaan storage (${currentUsage.storageGb}GB) melebihi batas ${tier} (${limits.storageGb}GB)`)
  }
  
  return {
    valid: violations.length === 0,
    violations
  }
}

export function getSubscriptionLimits(tier: SubscriptionTier): {
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  storageGb: number
} {
  const limits = {
    BASIC: {
      maxRecipients: 500,
      maxStaff: 10,
      maxDistributionPoints: 3,
      storageGb: 5
    },
    STANDARD: {
      maxRecipients: 2000,
      maxStaff: 25,
      maxDistributionPoints: 8,
      storageGb: 20
    },
    PRO: {
      maxRecipients: 5000,
      maxStaff: 50,
      maxDistributionPoints: 15,
      storageGb: 50
    },
    ENTERPRISE: {
      maxRecipients: 20000,
      maxStaff: 200,
      maxDistributionPoints: 50,
      storageGb: 200
    }
  }
  
  return limits[tier]
}

// ===== SEARCH AND FILTER UTILITIES =====

export function buildSubscriptionSearchQuery(search: string): string {
  return search.trim().toLowerCase()
}

export function getSubscriptionFilterOptions() {
  return {
    status: Object.entries(SUBSCRIPTION_STATUS_LABELS).map(([value, label]) => ({
      value: value as SubscriptionStatus,
      label
    })),
    tier: Object.entries(SUBSCRIPTION_TIER_LABELS).map(([value, label]) => ({
      value: value as SubscriptionTier,
      label
    })),
    expiringWithin: [
      { value: 7, label: '7 hari' },
      { value: 14, label: '14 hari' },
      { value: 30, label: '30 hari' },
      { value: 60, label: '60 hari' },
      { value: 90, label: '90 hari' }
    ]
  }
}

// ===== ANALYTICS UTILITIES =====

export function calculateChurnRate(
  activeSubscriptionsStart: number, 
  cancelledSubscriptions: number
): number {
  if (activeSubscriptionsStart === 0) return 0
  return (cancelledSubscriptions / activeSubscriptionsStart) * 100
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function getSubscriptionTierDistribution(subscriptions: { tier: SubscriptionTier }[]): Record<SubscriptionTier, number> {
  return subscriptions.reduce(
    (acc, sub) => {
      acc[sub.tier] = (acc[sub.tier] || 0) + 1
      return acc
    },
    { BASIC: 0, STANDARD: 0, PRO: 0, ENTERPRISE: 0 } as Record<SubscriptionTier, number>
  )
}