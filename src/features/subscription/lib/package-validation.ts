/**
 * Package Validation Utilities
 * Validates registration data against selected subscription package constraints
 */

import { SubscriptionPackage } from '../services/subscription-api'
import { RegistrationData } from '../schemas/subscription.schema'

export interface PackageValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
  shouldUpgrade?: {
    requiredTier: string
    reason: string
    benefits: string[]
  }
}

export interface PackageConstraint {
  field: keyof RegistrationData
  limit: number
  message: string
  upgradeMessage: string
}

/**
 * Package Validation Engine
 */
export class PackageValidator {
  
  /**
   * Validate registration data against package constraints
   */
  static validateRegistrationAgainstPackage(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ): PackageValidationResult {
    const result: PackageValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    }

    if (!selectedPackage) {
      result.isValid = false
      result.errors.push('Paket subscription belum dipilih')
      return result
    }

    // Validate target recipients against package limit
    if (registrationData.targetRecipients) {
      if (registrationData.targetRecipients > selectedPackage.maxRecipients) {
        result.isValid = false
        result.errors.push(
          `Target penerima (${registrationData.targetRecipients.toLocaleString()}) melebihi batas paket ${selectedPackage.name} (${selectedPackage.maxRecipients.toLocaleString()})`
        )
        result.shouldUpgrade = {
          requiredTier: this.getRequiredTierForRecipients(registrationData.targetRecipients),
          reason: 'Target penerima melebihi kapasitas paket',
          benefits: [
            `Kapasitas hingga ${this.getNextTierLimit(selectedPackage.tier).toLocaleString()} penerima`,
            'Fitur analytics dan reporting yang lebih lengkap',
            'Support prioritas dengan response time lebih cepat'
          ]
        }
      } else if (registrationData.targetRecipients > selectedPackage.maxRecipients * 0.8) {
        result.warnings.push(
          `Target penerima Anda mendekati batas paket (${Math.round((registrationData.targetRecipients / selectedPackage.maxRecipients) * 100)}%)`
        )
        result.suggestions.push('Pertimbangkan upgrade paket untuk antisipasi pertumbuhan')
      }
    }

    // Validate operational radius against package capabilities
    if (registrationData.maxRadius) {
      const radiusLimit = this.getRadiusLimitByPackage(selectedPackage.tier)
      if (registrationData.maxRadius > radiusLimit) {
        result.warnings.push(
          `Radius operasional ${registrationData.maxRadius} km cukup besar untuk paket ${selectedPackage.name}`
        )
        result.suggestions.push('Pastikan infrastruktur logistik mendukung cakupan area tersebut')
      }
    }

    // Validate business hours against package support level
    if (registrationData.businessHoursStart && registrationData.businessHoursEnd) {
      const operationHours = this.calculateOperationHours(
        registrationData.businessHoursStart,
        registrationData.businessHoursEnd
      )
      
      if (operationHours > 12 && selectedPackage.supportLevel === 'Community') {
        result.warnings.push('Jam operasional panjang memerlukan support yang lebih responsif')
        result.suggestions.push('Pertimbangkan paket dengan support email atau priority')
      }
    }

    // Check feature compatibility
    const featureValidation = this.validateRequiredFeatures(registrationData, selectedPackage)
    result.warnings.push(...featureValidation.warnings)
    result.suggestions.push(...featureValidation.suggestions)

    return result
  }

  /**
   * Get required tier based on target recipients
   */
  private static getRequiredTierForRecipients(recipients: number): string {
    if (recipients <= 500) return 'BASIC'
    if (recipients <= 2000) return 'STANDARD'
    if (recipients <= 10000) return 'PRO'
    return 'ENTERPRISE'
  }

  /**
   * Get next tier limit for upgrade suggestion
   */
  private static getNextTierLimit(currentTier: string): number {
    const tierLimits = {
      'BASIC': 2000,      // Upgrade to STANDARD
      'STANDARD': 10000,  // Upgrade to PRO
      'PRO': 50000,       // Upgrade to ENTERPRISE
      'ENTERPRISE': 100000 // Current maximum
    }
    return tierLimits[currentTier as keyof typeof tierLimits] || 100000
  }

  /**
   * Get radius limit by package tier
   */
  private static getRadiusLimitByPackage(tier: string): number {
    const radiusLimits = {
      'BASIC': 10,        // 10 km radius
      'STANDARD': 25,     // 25 km radius  
      'PRO': 50,          // 50 km radius
      'ENTERPRISE': 100   // 100 km radius
    }
    return radiusLimits[tier as keyof typeof radiusLimits] || 10
  }

  /**
   * Calculate operation hours from start and end time
   */
  private static calculateOperationHours(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return Math.max(0, (endMinutes - startMinutes) / 60)
  }

  /**
   * Validate required features against package capabilities
   */
  private static validateRequiredFeatures(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage
  ): { warnings: string[], suggestions: string[] } {
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check if organization type needs advanced features
    if (registrationData.organizationType === 'PEMERINTAH') {
      if (!selectedPackage.hasAdvancedReporting) {
        warnings.push('Organisasi pemerintah biasanya memerlukan advanced reporting')
        suggestions.push('Pertimbangkan paket dengan fitur advanced reporting untuk compliance')
      }
      
      if (!selectedPackage.hasAPIAccess) {
        suggestions.push('API access berguna untuk integrasi dengan sistem pemerintah')
      }
    }

    // Check for large scale operations
    if (registrationData.targetRecipients && registrationData.targetRecipients > 1000) {
      if (!selectedPackage.hasNutritionAnalysis) {
        suggestions.push('Nutrition analysis membantu monitoring kualitas gizi skala besar')
      }
      
      if (!selectedPackage.hasQualityControl) {
        suggestions.push('Quality control penting untuk operasi dengan volume tinggi')
      }
    }

    return { warnings, suggestions }
  }

  /**
   * Get package upgrade recommendations
   */
  static getUpgradeRecommendations(
    registrationData: Partial<RegistrationData>,
    currentPackage: SubscriptionPackage
  ): {
    recommended: boolean
    targetTier: string
    reasons: string[]
    benefits: string[]
    costImplication: string
  } {
    const validation = this.validateRegistrationAgainstPackage(registrationData, currentPackage)
    
    if (!validation.shouldUpgrade) {
      return {
        recommended: false,
        targetTier: currentPackage.tier,
        reasons: [],
        benefits: [],
        costImplication: 'Tidak ada perubahan biaya'
      }
    }

    const nextTierPricing = this.getNextTierPricing(currentPackage.tier)
    const costDifference = nextTierPricing - currentPackage.monthlyPrice

    return {
      recommended: true,
      targetTier: validation.shouldUpgrade.requiredTier,
      reasons: validation.shouldUpgrade ? [validation.shouldUpgrade.reason] : [],
      benefits: validation.shouldUpgrade?.benefits || [],
      costImplication: `Tambahan ${this.formatCurrency(costDifference)}/bulan`
    }
  }

  /**
   * Get next tier pricing
   */
  private static getNextTierPricing(currentTier: string): number {
    const tierPricing = {
      'BASIC': 250000,        // STANDARD pricing
      'STANDARD': 500000,     // PRO pricing
      'PRO': 1000000,         // ENTERPRISE pricing
      'ENTERPRISE': 1000000   // Stay at ENTERPRISE
    }
    return tierPricing[currentTier as keyof typeof tierPricing] || 250000
  }

  /**
   * Format currency in Indonesian Rupiah
   */
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  /**
   * Check if registration is compatible with package
   */
  static isCompatibleWithPackage(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ): boolean {
    const validation = this.validateRegistrationAgainstPackage(registrationData, selectedPackage)
    return validation.isValid
  }

  /**
   * Get real-time validation for specific field
   */
  static validateField(
    fieldName: keyof RegistrationData,
    value: unknown,
    selectedPackage: SubscriptionPackage | null
  ): { isValid: boolean, message?: string, suggestion?: string } {
    if (!selectedPackage) {
      return { isValid: true } // No package selected yet
    }

    switch (fieldName) {
      case 'targetRecipients':
        if (typeof value === 'number' && value > selectedPackage.maxRecipients) {
          return {
            isValid: false,
            message: `Melebihi batas paket ${selectedPackage.name} (${selectedPackage.maxRecipients.toLocaleString()})`,
            suggestion: `Pertimbangkan upgrade ke paket yang mendukung ${value.toLocaleString()} penerima`
          }
        }
        if (typeof value === 'number' && value > selectedPackage.maxRecipients * 0.8) {
          return {
            isValid: true,
            suggestion: `Mendekati batas paket (${Math.round((value / selectedPackage.maxRecipients) * 100)}%). Pertimbangkan upgrade untuk antisipasi pertumbuhan.`
          }
        }
        break

      case 'maxRadius':
        const radiusLimit = this.getRadiusLimitByPackage(selectedPackage.tier)
        if (typeof value === 'number' && value > radiusLimit) {
          return {
            isValid: true,
            suggestion: `Radius ${value} km cukup besar untuk paket ${selectedPackage.name}. Pastikan infrastruktur logistik mendukung.`
          }
        }
        break
    }

    return { isValid: true }
  }
}

/**
 * React Hook for Package Validation
 */
export const usePackageValidation = (
  registrationData: Partial<RegistrationData>,
  selectedPackage: SubscriptionPackage | null
) => {
  const validation = PackageValidator.validateRegistrationAgainstPackage(
    registrationData,
    selectedPackage
  )

  const validateField = (fieldName: keyof RegistrationData, value: unknown) => {
    return PackageValidator.validateField(fieldName, value, selectedPackage)
  }

  const getUpgradeRecommendations = () => {
    if (!selectedPackage) return null
    return PackageValidator.getUpgradeRecommendations(registrationData, selectedPackage)
  }

  return {
    validation,
    validateField,
    getUpgradeRecommendations,
    isCompatible: validation.isValid
  }
}