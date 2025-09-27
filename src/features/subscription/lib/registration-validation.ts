/**
 * Enhanced Registration Validation Rules
 * Organization type-specific validation and package feature requirements
 */

import { RegistrationData } from '../schemas/subscription.schema'
import { SubscriptionPackage } from '../services/subscription-api'

export interface OrganizationValidationRule {
  organizationType: string
  requiredFeatures: string[]
  recommendedFeatures: string[]
  minimumRecipients: number
  maximumRecipients?: number
  requiredFields: string[]
  validationRules: ValidationRule[]
  complianceRequirements: ComplianceRequirement[]
}

export interface ValidationRule {
  field: keyof RegistrationData
  rule: (value: unknown, data: Partial<RegistrationData>) => boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ComplianceRequirement {
  name: string
  description: string
  packageFeatureRequired: keyof SubscriptionPackage
  mandatory: boolean
  regulationType: 'GOVERNMENT' | 'HEALTH' | 'FINANCIAL' | 'DATA_PRIVACY'
}

export interface EnhancedValidationResult {
  isValid: boolean
  organizationCompliance: {
    required: ComplianceRequirement[]
    missing: ComplianceRequirement[]
    satisfied: ComplianceRequirement[]
  }
  featureRequirements: {
    required: string[]
    missing: string[]
    recommended: string[]
  }
  fieldValidation: {
    errors: Array<{ field: string; message: string; severity: string }>
    warnings: Array<{ field: string; message: string; suggestion: string }>
  }
  packageCompatibility: {
    compatible: boolean
    upgradeRequired: boolean
    minimumTier: string | null
    reasons: string[]
  }
}

/**
 * Organization Type Validation Rules Configuration
 */
export const ORGANIZATION_VALIDATION_RULES: Record<string, OrganizationValidationRule> = {
  PEMERINTAH: {
    organizationType: 'PEMERINTAH',
    requiredFeatures: ['hasAdvancedReporting', 'hasDataExport', 'hasAuditLog'],
    recommendedFeatures: ['hasAPIAccess', 'hasMultiLocation', 'hasCustomBranding'],
    minimumRecipients: 100,
    maximumRecipients: 50000,
    requiredFields: ['code', 'name', 'establishedYear', 'phone', 'email', 'picName', 'picPosition', 'picEmail'],
    validationRules: [
      {
        field: 'code',
        rule: (value) => typeof value === 'string' && /^[A-Z]{2,4}\d{4,8}$/.test(value),
        message: 'Kode organisasi pemerintah harus mengikuti format standar (contoh: PEMKOT2024)',
        severity: 'error'
      },
      {
        field: 'establishedYear',
        rule: (value) => typeof value === 'number' && value >= 1945 && value <= new Date().getFullYear(),
        message: 'Tahun berdiri organisasi pemerintah tidak valid',
        severity: 'error'
      },
      {
        field: 'targetRecipients',
        rule: (value) => typeof value === 'number' && value >= 100,
        message: 'Organisasi pemerintah minimal melayani 100 penerima per hari',
        severity: 'warning'
      }
    ],
    complianceRequirements: [
      {
        name: 'Transparansi Keuangan',
        description: 'Pelaporan keuangan transparan sesuai UU No. 14/2008',
        packageFeatureRequired: 'hasAdvancedReporting',
        mandatory: true,
        regulationType: 'GOVERNMENT'
      },
      {
        name: 'Audit Trail',
        description: 'Jejak audit untuk semua transaksi dan aktivitas',
        packageFeatureRequired: 'hasAdvancedReporting',
        mandatory: true,
        regulationType: 'GOVERNMENT'
      },
      {
        name: 'Data Export',
        description: 'Kemampuan export data untuk pelaporan ke instansi terkait',
        packageFeatureRequired: 'hasAPIAccess',
        mandatory: true,
        regulationType: 'GOVERNMENT'
      }
    ]
  },

  YAYASAN: {
    organizationType: 'YAYASAN',
    requiredFeatures: ['hasNutritionAnalysis', 'hasDonationTracking'],
    recommendedFeatures: ['hasAdvancedReporting', 'hasVolunteerManagement'],
    minimumRecipients: 50,
    maximumRecipients: 10000,
    requiredFields: ['code', 'name', 'establishedYear', 'phone', 'email', 'picName', 'picEmail'],
    validationRules: [
      {
        field: 'code',
        rule: (value) => typeof value === 'string' && /^YAY-[A-Z0-9]{4,8}$/.test(value),
        message: 'Kode yayasan harus menggunakan format YAY-XXXX (contoh: YAY-PEDULI123)',
        severity: 'error'
      },
      {
        field: 'targetRecipients',
        rule: (value) => typeof value === 'number' && value >= 50,
        message: 'Yayasan minimal melayani 50 penerima per hari',
        severity: 'warning'
      },
      {
        field: 'establishedYear',
        rule: (value) => typeof value === 'number' && value >= 1950 && value <= new Date().getFullYear(),
        message: 'Tahun berdiri yayasan tidak valid',
        severity: 'error'
      }
    ],
    complianceRequirements: [
      {
        name: 'Analisis Nutrisi',
        description: 'Wajib melakukan analisis nutrisi untuk program bantuan makanan',
        packageFeatureRequired: 'hasNutritionAnalysis',
        mandatory: true,
        regulationType: 'HEALTH'
      },
      {
        name: 'Pelacakan Donasi',
        description: 'Transparansi pengelolaan dana donasi',
        packageFeatureRequired: 'hasCostCalculation',
        mandatory: true,
        regulationType: 'FINANCIAL'
      }
    ]
  },

  KOMUNITAS: {
    organizationType: 'KOMUNITAS',
    requiredFeatures: ['hasVolunteerManagement'],
    recommendedFeatures: ['hasNutritionAnalysis', 'hasSocialMediaIntegration'],
    minimumRecipients: 25,
    maximumRecipients: 2000,
    requiredFields: ['name', 'phone', 'email', 'picName', 'picEmail'],
    validationRules: [
      {
        field: 'targetRecipients',
        rule: (value) => typeof value === 'number' && value >= 25 && value <= 2000,
        message: 'Komunitas sebaiknya melayani 25-2000 penerima per hari',
        severity: 'info'
      },
      {
        field: 'maxRadius',
        rule: (value) => typeof value === 'number' && value <= 15,
        message: 'Radius komunitas sebaiknya tidak melebihi 15 km untuk efisiensi',
        severity: 'warning'
      }
    ],
    complianceRequirements: [
      {
        name: 'Manajemen Relawan',
        description: 'Sistem pengelolaan relawan untuk operasional komunitas',
        packageFeatureRequired: 'hasCustomBranding',
        mandatory: false,
        regulationType: 'DATA_PRIVACY'
      }
    ]
  },

  SWASTA: {
    organizationType: 'SWASTA',
    requiredFeatures: ['hasAPIAccess', 'hasCustomBranding'],
    recommendedFeatures: ['hasAdvancedReporting', 'hasMultiLocation', 'hasQualityControl'],
    minimumRecipients: 100,
    maximumRecipients: 25000,
    requiredFields: ['code', 'name', 'establishedYear', 'phone', 'email', 'picName', 'picPosition', 'picEmail'],
    validationRules: [
      {
        field: 'code',
        rule: (value) => typeof value === 'string' && /^(PT|CV|UD)-[A-Z0-9]{4,8}$/.test(value),
        message: 'Kode perusahaan harus menggunakan format PT/CV/UD-XXXX',
        severity: 'error'
      },
      {
        field: 'targetRecipients',
        rule: (value) => typeof value === 'number' && value >= 100,
        message: 'Perusahaan minimal melayani 100 penerima per hari',
        severity: 'warning'
      },
      {
        field: 'establishedYear',
        rule: (value) => typeof value === 'number' && value >= 1960 && value <= new Date().getFullYear(),
        message: 'Tahun berdiri perusahaan tidak valid',
        severity: 'error'
      }
    ],
    complianceRequirements: [
      {
        name: 'API Integration',
        description: 'Integrasi dengan sistem internal perusahaan',
        packageFeatureRequired: 'hasAPIAccess',
        mandatory: true,
        regulationType: 'DATA_PRIVACY'
      },
      {
        name: 'Custom Branding',
        description: 'Branding sesuai identitas perusahaan untuk CSR program',
        packageFeatureRequired: 'hasCustomBranding',
        mandatory: true,
        regulationType: 'DATA_PRIVACY'
      }
    ]
  },

  LAINNYA: {
    organizationType: 'LAINNYA',
    requiredFeatures: [],
    recommendedFeatures: ['hasNutritionAnalysis', 'hasBasicReporting'],
    minimumRecipients: 10,
    maximumRecipients: 1000,
    requiredFields: ['name', 'phone', 'email', 'picName', 'picEmail'],
    validationRules: [
      {
        field: 'targetRecipients',
        rule: (value) => typeof value === 'number' && value >= 10 && value <= 1000,
        message: 'Organisasi lainnya sebaiknya melayani 10-1000 penerima per hari',
        severity: 'info'
      }
    ],
    complianceRequirements: []
  }
}

/**
 * Enhanced Validation Engine for Registration Process
 */
export class EnhancedRegistrationValidator {
  
  /**
   * Comprehensive validation based on organization type and package features
   */
  static validateRegistration(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ): EnhancedValidationResult {
    
    const result: EnhancedValidationResult = {
      isValid: true,
      organizationCompliance: {
        required: [],
        missing: [],
        satisfied: []
      },
      featureRequirements: {
        required: [],
        missing: [],
        recommended: []
      },
      fieldValidation: {
        errors: [],
        warnings: []
      },
      packageCompatibility: {
        compatible: true,
        upgradeRequired: false,
        minimumTier: null,
        reasons: []
      }
    }

    if (!selectedPackage) {
      result.isValid = false
      result.packageCompatibility.compatible = false
      result.packageCompatibility.reasons.push('Paket subscription belum dipilih')
      return result
    }

    const organizationType = registrationData.organizationType || 'LAINNYA'
    const validationRules = ORGANIZATION_VALIDATION_RULES[organizationType]

    if (!validationRules) {
      result.fieldValidation.warnings.push({
        field: 'organizationType',
        message: 'Jenis organisasi tidak dikenali',
        suggestion: 'Pilih jenis organisasi yang sesuai'
      })
      return result
    }

    // 1. Validate organization-specific field rules
    this.validateFieldRules(registrationData, validationRules, result)

    // 2. Validate compliance requirements
    this.validateComplianceRequirements(selectedPackage, validationRules, result)

    // 3. Validate package feature requirements
    this.validateFeatureRequirements(selectedPackage, validationRules, result)

    // 4. Validate package compatibility
    this.validatePackageCompatibility(registrationData, selectedPackage, validationRules, result)

    // 5. Determine overall validation result
    result.isValid = result.fieldValidation.errors.length === 0 && 
                     result.organizationCompliance.missing.length === 0 &&
                     result.packageCompatibility.compatible

    return result
  }

  /**
   * Validate organization-specific field rules
   */
  private static validateFieldRules(
    registrationData: Partial<RegistrationData>,
    validationRules: OrganizationValidationRule,
    result: EnhancedValidationResult
  ): void {
    validationRules.validationRules.forEach(rule => {
      const fieldValue = registrationData[rule.field]
      
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        const isValid = rule.rule(fieldValue, registrationData)
        
        if (!isValid) {
          if (rule.severity === 'error') {
            result.fieldValidation.errors.push({
              field: rule.field as string,
              message: rule.message,
              severity: rule.severity
            })
          } else {
            result.fieldValidation.warnings.push({
              field: rule.field as string,
              message: rule.message,
              suggestion: 'Pastikan mengikuti format yang benar'
            })
          }
        }
      }
    })
  }

  /**
   * Validate compliance requirements against package features
   */
  private static validateComplianceRequirements(
    selectedPackage: SubscriptionPackage,
    validationRules: OrganizationValidationRule,
    result: EnhancedValidationResult
  ): void {
    validationRules.complianceRequirements.forEach(requirement => {
      result.organizationCompliance.required.push(requirement)
      
      const featureAvailable = selectedPackage[requirement.packageFeatureRequired]
      
      if (featureAvailable) {
        result.organizationCompliance.satisfied.push(requirement)
      } else {
        result.organizationCompliance.missing.push(requirement)
        
        if (requirement.mandatory) {
          result.fieldValidation.errors.push({
            field: 'package',
            message: `Paket ${selectedPackage.name} tidak memiliki fitur ${requirement.name} yang diwajibkan untuk ${validationRules.organizationType}`,
            severity: 'error'
          })
        }
      }
    })
  }

  /**
   * Validate feature requirements
   */
  private static validateFeatureRequirements(
    selectedPackage: SubscriptionPackage,
    validationRules: OrganizationValidationRule,
    result: EnhancedValidationResult
  ): void {
    // Check required features
    validationRules.requiredFeatures.forEach(feature => {
      result.featureRequirements.required.push(feature)
      
      if (!selectedPackage[feature as keyof SubscriptionPackage]) {
        result.featureRequirements.missing.push(feature)
      }
    })

    // Check recommended features
    validationRules.recommendedFeatures.forEach(feature => {
      result.featureRequirements.recommended.push(feature)
      
      if (!selectedPackage[feature as keyof SubscriptionPackage]) {
        result.fieldValidation.warnings.push({
          field: 'package',
          message: `Fitur ${feature} direkomendasikan untuk ${validationRules.organizationType}`,
          suggestion: 'Pertimbangkan upgrade paket untuk mendapatkan fitur ini'
        })
      }
    })
  }

  /**
   * Validate package compatibility with organization requirements
   */
  private static validatePackageCompatibility(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage,
    validationRules: OrganizationValidationRule,
    result: EnhancedValidationResult
  ): void {
    const targetRecipients = registrationData.targetRecipients || 0

    // Check minimum recipients for organization type
    if (targetRecipients < validationRules.minimumRecipients) {
      result.fieldValidation.warnings.push({
        field: 'targetRecipients',
        message: `${validationRules.organizationType} sebaiknya melayani minimal ${validationRules.minimumRecipients} penerima`,
        suggestion: 'Pertimbangkan untuk menaikkan target penerima sesuai rekomendasi'
      })
    }

    // Check maximum recipients for organization type
    if (validationRules.maximumRecipients && targetRecipients > validationRules.maximumRecipients) {
      result.fieldValidation.warnings.push({
        field: 'targetRecipients',
        message: `Target ${targetRecipients.toLocaleString()} melebihi rekomendasi untuk ${validationRules.organizationType} (max: ${validationRules.maximumRecipients.toLocaleString()})`,
        suggestion: 'Pertimbangkan organisasi dengan jenis yang lebih sesuai atau bagi target ke beberapa lokasi'
      })
    }

    // Check package capacity
    if (targetRecipients > selectedPackage.maxRecipients) {
      result.packageCompatibility.compatible = false
      result.packageCompatibility.upgradeRequired = true
      result.packageCompatibility.minimumTier = this.getMinimumTierForRecipients(targetRecipients)
      result.packageCompatibility.reasons.push(
        `Target penerima (${targetRecipients.toLocaleString()}) melebihi kapasitas paket ${selectedPackage.name} (${selectedPackage.maxRecipients.toLocaleString()})`
      )
    }

    // Check required features availability
    if (result.featureRequirements.missing.length > 0) {
      result.packageCompatibility.upgradeRequired = true
      result.packageCompatibility.reasons.push(
        `Paket ${selectedPackage.name} tidak memiliki fitur yang diperlukan: ${result.featureRequirements.missing.join(', ')}`
      )
    }
  }

  /**
   * Get minimum tier required for target recipients
   */
  private static getMinimumTierForRecipients(recipients: number): string {
    if (recipients <= 500) return 'BASIC'
    if (recipients <= 2000) return 'STANDARD'
    if (recipients <= 10000) return 'PRO'
    return 'ENTERPRISE'
  }

  /**
   * Get organization validation summary
   */
  static getValidationSummary(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ): {
    overallScore: number
    readinessLevel: 'HIGH' | 'MEDIUM' | 'LOW'
    criticalIssues: number
    recommendations: string[]
  } {
    const validation = this.validateRegistration(registrationData, selectedPackage)
    
    const criticalIssues = validation.fieldValidation.errors.length + 
                          validation.organizationCompliance.missing.filter(req => req.mandatory).length

    const warnings = validation.fieldValidation.warnings.length
    const satisfiedCompliance = validation.organizationCompliance.satisfied.length
    const totalCompliance = validation.organizationCompliance.required.length

    // Calculate score (0-100)
    let score = 100
    score -= criticalIssues * 25  // Critical issues: -25 each
    score -= warnings * 5         // Warnings: -5 each
    
    if (totalCompliance > 0) {
      score += (satisfiedCompliance / totalCompliance) * 20  // Compliance bonus: up to +20
    }

    const overallScore = Math.max(0, Math.min(100, score))

    let readinessLevel: 'HIGH' | 'MEDIUM' | 'LOW'
    if (overallScore >= 80 && criticalIssues === 0) readinessLevel = 'HIGH'
    else if (overallScore >= 60 && criticalIssues <= 1) readinessLevel = 'MEDIUM'
    else readinessLevel = 'LOW'

    const recommendations = [
      ...validation.fieldValidation.warnings.map(w => w.message),
      ...validation.packageCompatibility.reasons
    ]

    return {
      overallScore,
      readinessLevel,
      criticalIssues,
      recommendations
    }
  }
}

/**
 * React Hook for Enhanced Registration Validation
 */
export const useEnhancedRegistrationValidation = (
  registrationData: Partial<RegistrationData>,
  selectedPackage: SubscriptionPackage | null
) => {
  const validation = EnhancedRegistrationValidator.validateRegistration(
    registrationData,
    selectedPackage
  )

  const summary = EnhancedRegistrationValidator.getValidationSummary(
    registrationData,
    selectedPackage
  )

  return {
    validation,
    summary,
    isReady: validation.isValid && summary.criticalIssues === 0,
    hasWarnings: validation.fieldValidation.warnings.length > 0,
    hasCriticalIssues: summary.criticalIssues > 0
  }
}