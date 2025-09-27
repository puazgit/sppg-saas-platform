/**
 * Payment Calculator with Package Context Integration
 * Comprehensive payment calculation with dynamic pricing, discounts, and organization-specific adjustments
 */

import { RegistrationData } from '../schemas/subscription.schema'
import { SubscriptionPackage } from '../services/subscription-api'

export interface PaymentCalculationInput {
  selectedPackage: SubscriptionPackage
  registrationData: Partial<RegistrationData>
  billingCycle: 'MONTHLY' | 'YEARLY'
  promotionCode?: string
  organizationType: string
  isUpgrade?: boolean
  previousPackage?: SubscriptionPackage
}

export interface PaymentBreakdown {
  // Base pricing
  basePrice: number
  setupFee: number
  
  // Adjustments
  organizationDiscount: number
  volumeDiscount: number
  yearlyDiscount: number
  promotionDiscount: number
  upgradeCredit: number
  
  // Calculated totals
  subtotal: number
  taxAmount: number
  totalAmount: number
  
  // Payment schedule
  initialPayment: number
  recurringPayment: number
  
  // Breakdown details
  priceBreakdown: PriceBreakdownItem[]
  discountBreakdown: DiscountBreakdownItem[]
  
  // Context information
  billingCycle: 'MONTHLY' | 'YEARLY'
  nextBillingDate: Date
  savingsFromYearly?: number
}

export interface PriceBreakdownItem {
  description: string
  unitPrice: number
  quantity: number
  totalPrice: number
  category: 'BASE' | 'SETUP' | 'ADDON' | 'TAX'
}

export interface DiscountBreakdownItem {
  description: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  appliedAmount: number
  category: 'ORGANIZATION' | 'VOLUME' | 'YEARLY' | 'PROMOTION' | 'UPGRADE'
  isActive: boolean
}

export interface PaymentSchedule {
  billingCycle: 'MONTHLY' | 'YEARLY'
  payments: PaymentScheduleItem[]
  totalProjectedAmount: number
  totalSavings: number
}

export interface PaymentScheduleItem {
  dueDate: Date
  description: string
  amount: number
  type: 'SETUP' | 'SUBSCRIPTION' | 'ADDON'
  status: 'PENDING' | 'PAID' | 'OVERDUE'
}

/**
 * Organization-specific discount rates
 */
const ORGANIZATION_DISCOUNTS: Record<string, number> = {
  'PEMERINTAH': 0.15,      // 15% discount for government
  'YAYASAN': 0.10,         // 10% discount for foundation
  'KOMUNITAS': 0.20,       // 20% discount for community (highest)
  'SWASTA': 0.00,          // No discount for private
  'LAINNYA': 0.05          // 5% discount for others
}

/**
 * Volume-based discount tiers
 */
const VOLUME_DISCOUNT_TIERS = [
  { minRecipients: 0, maxRecipients: 500, discount: 0 },
  { minRecipients: 501, maxRecipients: 1000, discount: 0.05 },
  { minRecipients: 1001, maxRecipients: 2500, discount: 0.10 },
  { minRecipients: 2501, maxRecipients: 5000, discount: 0.15 },
  { minRecipients: 5001, maxRecipients: Infinity, discount: 0.20 }
]

/**
 * Promotion codes with validity and conditions
 */
const PROMOTION_CODES: Record<string, {
  discount: number
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  validUntil: Date
  minAmount?: number
  maxDiscount?: number
  organizationTypes?: string[]
  description: string
}> = {
  'LAUNCH2024': {
    discount: 0.25,
    type: 'PERCENTAGE',
    validUntil: new Date('2024-12-31'),
    maxDiscount: 500000,
    description: 'Launch Special - 25% off first year'
  },
  'PEMERINTAH50': {
    discount: 50000,
    type: 'FIXED_AMOUNT',
    validUntil: new Date('2024-12-31'),
    organizationTypes: ['PEMERINTAH'],
    description: 'Special discount for government organizations'
  },
  'KOMUNITAS20': {
    discount: 0.20,
    type: 'PERCENTAGE',
    validUntil: new Date('2024-12-31'),
    organizationTypes: ['KOMUNITAS', 'YAYASAN'],
    maxDiscount: 200000,
    description: 'Community & foundation special discount'
  }
}

/**
 * Main Payment Calculator Class
 */
export class PaymentCalculator {
  
  /**
   * Calculate comprehensive payment breakdown
   */
  static calculatePayment(input: PaymentCalculationInput): PaymentBreakdown {
    const {
      selectedPackage,
      registrationData,
      billingCycle,
      promotionCode,
      organizationType,
      isUpgrade = false,
      previousPackage
    } = input

    // 1. Calculate base price
    const basePrice = billingCycle === 'YEARLY' 
      ? (selectedPackage.yearlyPrice || selectedPackage.monthlyPrice * 12)
      : selectedPackage.monthlyPrice

    // 2. Calculate discounts
    const organizationDiscount = this.calculateOrganizationDiscount(
      basePrice, 
      organizationType
    )
    
    const volumeDiscount = this.calculateVolumeDiscount(
      basePrice, 
      registrationData.targetRecipients || 0
    )
    
    const yearlyDiscount = billingCycle === 'YEARLY' 
      ? this.calculateYearlyDiscount(basePrice, selectedPackage)
      : 0
    
    const promotionDiscount = promotionCode 
      ? this.calculatePromotionDiscount(basePrice, promotionCode, organizationType)
      : 0
    
    const upgradeCredit = isUpgrade && previousPackage
      ? this.calculateUpgradeCredit(selectedPackage, previousPackage, billingCycle)
      : 0

    // 3. Calculate totals
    const totalDiscounts = organizationDiscount + volumeDiscount + 
                          yearlyDiscount + promotionDiscount + upgradeCredit
    
    const subtotal = Math.max(0, basePrice - totalDiscounts)
    const setupFee = isUpgrade ? 0 : selectedPackage.setupFee
    const taxAmount = this.calculateTax(subtotal + setupFee)
    const totalAmount = subtotal + setupFee + taxAmount

    // 4. Calculate payment schedule
    const initialPayment = setupFee + (billingCycle === 'YEARLY' ? totalAmount - setupFee : subtotal + taxAmount)
    const recurringPayment = billingCycle === 'YEARLY' ? 0 : subtotal + taxAmount

    // 5. Generate breakdown items
    const priceBreakdown = this.generatePriceBreakdown(
      selectedPackage, 
      billingCycle, 
      setupFee, 
      taxAmount
    )
    
    const discountBreakdown = this.generateDiscountBreakdown(
      organizationDiscount,
      volumeDiscount,
      yearlyDiscount,
      promotionDiscount,
      upgradeCredit,
      organizationType,
      promotionCode
    )

    // 6. Calculate next billing date
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(
      nextBillingDate.getMonth() + (billingCycle === 'YEARLY' ? 12 : 1)
    )

    // 7. Calculate yearly savings if monthly billing
    const savingsFromYearly = billingCycle === 'MONTHLY' 
      ? this.calculateYearlySavings(selectedPackage, organizationType)
      : undefined

    return {
      basePrice,
      setupFee,
      organizationDiscount,
      volumeDiscount,
      yearlyDiscount,
      promotionDiscount,
      upgradeCredit,
      subtotal,
      taxAmount,
      totalAmount,
      initialPayment,
      recurringPayment,
      priceBreakdown,
      discountBreakdown,
      billingCycle,
      nextBillingDate,
      savingsFromYearly
    }
  }

  /**
   * Calculate organization-specific discount
   */
  private static calculateOrganizationDiscount(
    basePrice: number, 
    organizationType: string
  ): number {
    const discountRate = ORGANIZATION_DISCOUNTS[organizationType] || 0
    return Math.floor(basePrice * discountRate)
  }

  /**
   * Calculate volume-based discount
   */
  private static calculateVolumeDiscount(
    basePrice: number, 
    targetRecipients: number
  ): number {
    const tier = VOLUME_DISCOUNT_TIERS.find(
      t => targetRecipients >= t.minRecipients && targetRecipients <= t.maxRecipients
    )
    
    if (!tier) return 0
    
    return Math.floor(basePrice * tier.discount)
  }

  /**
   * Calculate yearly billing discount
   */
  private static calculateYearlyDiscount(
    basePrice: number,
    selectedPackage: SubscriptionPackage
  ): number {
    // If yearly price is set and lower than 12x monthly, calculate the savings
    if (selectedPackage.yearlyPrice) {
      const monthlyTotal = selectedPackage.monthlyPrice * 12
      const savings = monthlyTotal - selectedPackage.yearlyPrice
      return Math.max(0, savings)
    }
    
    // Default yearly discount: 15% off
    return Math.floor(basePrice * 0.15)
  }

  /**
   * Calculate promotion code discount
   */
  private static calculatePromotionDiscount(
    basePrice: number,
    promotionCode: string,
    organizationType: string
  ): number {
    const promo = PROMOTION_CODES[promotionCode.toUpperCase()]
    
    if (!promo) return 0
    if (promo.validUntil < new Date()) return 0
    if (promo.organizationTypes && !promo.organizationTypes.includes(organizationType)) return 0
    if (promo.minAmount && basePrice < promo.minAmount) return 0

    let discount = 0
    if (promo.type === 'PERCENTAGE') {
      discount = Math.floor(basePrice * promo.discount)
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount)
      }
    } else {
      discount = promo.discount
    }

    return discount
  }

  /**
   * Calculate upgrade credit from previous package
   */
  private static calculateUpgradeCredit(
    newPackage: SubscriptionPackage,
    previousPackage: SubscriptionPackage,
    billingCycle: 'MONTHLY' | 'YEARLY'
  ): number {
    // Calculate prorated credit based on remaining billing cycle
    // This is a simplified calculation - in real implementation, 
    // you'd need actual billing cycle start date
    const remainingDays = 15 // Example: 15 days remaining in cycle
    const totalDays = billingCycle === 'YEARLY' ? 365 : 30
    
    const previousPrice = billingCycle === 'YEARLY' 
      ? (previousPackage.yearlyPrice || previousPackage.monthlyPrice * 12)
      : previousPackage.monthlyPrice
    
    const proratedCredit = (previousPrice * remainingDays) / totalDays
    return Math.floor(proratedCredit)
  }

  /**
   * Calculate tax (PPN 11% in Indonesia)
   */
  private static calculateTax(amount: number): number {
    return Math.floor(amount * 0.11) // 11% PPN
  }

  /**
   * Generate detailed price breakdown
   */
  private static generatePriceBreakdown(
    selectedPackage: SubscriptionPackage,
    billingCycle: 'MONTHLY' | 'YEARLY',
    setupFee: number,
    taxAmount: number
  ): PriceBreakdownItem[] {
    const breakdown: PriceBreakdownItem[] = []

    // Base subscription
    const basePrice = billingCycle === 'YEARLY' 
      ? (selectedPackage.yearlyPrice || selectedPackage.monthlyPrice * 12)
      : selectedPackage.monthlyPrice
    
    breakdown.push({
      description: `${selectedPackage.displayName} - ${billingCycle === 'YEARLY' ? 'Annual' : 'Monthly'} Subscription`,
      unitPrice: basePrice,
      quantity: 1,
      totalPrice: basePrice,
      category: 'BASE'
    })

    // Setup fee
    if (setupFee > 0) {
      breakdown.push({
        description: 'Setup Fee (One-time)',
        unitPrice: setupFee,
        quantity: 1,
        totalPrice: setupFee,
        category: 'SETUP'
      })
    }

    // Tax
    if (taxAmount > 0) {
      breakdown.push({
        description: 'PPN 11%',
        unitPrice: taxAmount,
        quantity: 1,
        totalPrice: taxAmount,
        category: 'TAX'
      })
    }

    return breakdown
  }

  /**
   * Generate detailed discount breakdown
   */
  private static generateDiscountBreakdown(
    organizationDiscount: number,
    volumeDiscount: number,
    yearlyDiscount: number,
    promotionDiscount: number,
    upgradeCredit: number,
    organizationType: string,
    promotionCode?: string
  ): DiscountBreakdownItem[] {
    const breakdown: DiscountBreakdownItem[] = []

    if (organizationDiscount > 0) {
      const rate = ORGANIZATION_DISCOUNTS[organizationType] || 0
      breakdown.push({
        description: `${organizationType} Organization Discount`,
        type: 'PERCENTAGE',
        value: rate * 100,
        appliedAmount: organizationDiscount,
        category: 'ORGANIZATION',
        isActive: true
      })
    }

    if (volumeDiscount > 0) {
      breakdown.push({
        description: 'Volume Discount (High Recipients)',
        type: 'PERCENTAGE',
        value: 0, // Would calculate from tier
        appliedAmount: volumeDiscount,
        category: 'VOLUME',
        isActive: true
      })
    }

    if (yearlyDiscount > 0) {
      breakdown.push({
        description: 'Annual Billing Discount',
        type: 'PERCENTAGE',
        value: 15,
        appliedAmount: yearlyDiscount,
        category: 'YEARLY',
        isActive: true
      })
    }

    if (promotionDiscount > 0 && promotionCode) {
      const promo = PROMOTION_CODES[promotionCode.toUpperCase()]
      breakdown.push({
        description: promo?.description || 'Promotion Discount',
        type: promo?.type || 'PERCENTAGE',
        value: promo?.type === 'PERCENTAGE' ? (promo.discount * 100) : promo?.discount || 0,
        appliedAmount: promotionDiscount,
        category: 'PROMOTION',
        isActive: true
      })
    }

    if (upgradeCredit > 0) {
      breakdown.push({
        description: 'Upgrade Credit (Prorated)',
        type: 'FIXED_AMOUNT',
        value: upgradeCredit,
        appliedAmount: upgradeCredit,
        category: 'UPGRADE',
        isActive: true
      })
    }

    return breakdown
  }

  /**
   * Calculate potential savings from yearly billing
   */
  private static calculateYearlySavings(
    selectedPackage: SubscriptionPackage,
    organizationType: string
  ): number {
    const monthlyTotal = selectedPackage.monthlyPrice * 12
    const yearlyPrice = selectedPackage.yearlyPrice || (monthlyTotal * 0.85) // 15% discount
    
    // Include organization discount in calculation
    const orgDiscount = ORGANIZATION_DISCOUNTS[organizationType] || 0
    const monthlyWithDiscount = monthlyTotal * (1 - orgDiscount)
    const yearlyWithDiscount = yearlyPrice * (1 - orgDiscount)
    
    return Math.max(0, monthlyWithDiscount - yearlyWithDiscount)
  }

  /**
   * Generate payment schedule for subscription
   */
  static generatePaymentSchedule(
    paymentBreakdown: PaymentBreakdown,
    startDate: Date = new Date(),
    periods: number = 12
  ): PaymentSchedule {
    const payments: PaymentScheduleItem[] = []
    const currentDate = new Date(startDate)
    
    // Initial payment (setup + first period)
    payments.push({
      dueDate: new Date(currentDate),
      description: 'Initial Payment (Setup + First Period)',
      amount: paymentBreakdown.initialPayment,
      type: 'SETUP',
      status: 'PENDING'
    })

    // Recurring payments
    if (paymentBreakdown.recurringPayment > 0) {
      for (let i = 1; i < periods; i++) {
        if (paymentBreakdown.billingCycle === 'YEARLY') {
          currentDate.setFullYear(currentDate.getFullYear() + 1)
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1)
        }
        
        payments.push({
          dueDate: new Date(currentDate),
          description: `${paymentBreakdown.billingCycle === 'YEARLY' ? 'Annual' : 'Monthly'} Subscription`,
          amount: paymentBreakdown.recurringPayment,
          type: 'SUBSCRIPTION',
          status: 'PENDING'
        })
      }
    }

    const totalProjectedAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalSavings = paymentBreakdown.savingsFromYearly 
      ? paymentBreakdown.savingsFromYearly * (paymentBreakdown.billingCycle === 'YEARLY' ? 1 : periods)
      : 0

    return {
      billingCycle: paymentBreakdown.billingCycle,
      payments,
      totalProjectedAmount,
      totalSavings
    }
  }

  /**
   * Validate promotion code
   */
  static validatePromotionCode(
    code: string,
    organizationType: string,
    baseAmount: number
  ): {
    isValid: boolean
    reason?: string
    discount?: number
    description?: string
  } {
    const promo = PROMOTION_CODES[code.toUpperCase()]
    
    if (!promo) {
      return { isValid: false, reason: 'Kode promosi tidak valid' }
    }
    
    if (promo.validUntil < new Date()) {
      return { isValid: false, reason: 'Kode promosi sudah expired' }
    }
    
    if (promo.organizationTypes && !promo.organizationTypes.includes(organizationType)) {
      return { 
        isValid: false, 
        reason: `Kode promosi hanya berlaku untuk ${promo.organizationTypes.join(', ')}` 
      }
    }
    
    if (promo.minAmount && baseAmount < promo.minAmount) {
      return { 
        isValid: false, 
        reason: `Minimum pembelian ${promo.minAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}` 
      }
    }

    let discount = 0
    if (promo.type === 'PERCENTAGE') {
      discount = baseAmount * promo.discount
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount)
      }
    } else {
      discount = promo.discount
    }

    return {
      isValid: true,
      discount: Math.floor(discount),
      description: promo.description
    }
  }

  /**
   * Compare pricing between different packages
   */
  static comparePricing(
    packages: SubscriptionPackage[],
    registrationData: Partial<RegistrationData>,
    organizationType: string,
    billingCycle: 'MONTHLY' | 'YEARLY'
  ): Array<PaymentBreakdown & { packageId: string }> {
    return packages.map(pkg => ({
      packageId: pkg.id,
      ...this.calculatePayment({
        selectedPackage: pkg,
        registrationData,
        billingCycle,
        organizationType
      })
    }))
  }
}