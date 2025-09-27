/**
 * Progressive Validation State Management
 * Manages multi-step validation state with progressive disclosure
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { RegistrationData } from '../schemas/subscription.schema'
import { SubscriptionPackage } from '../services/subscription-api'
import { 
  EnhancedRegistrationValidator, 
  EnhancedValidationResult,
  ORGANIZATION_VALIDATION_RULES 
} from './enhanced-registration-validation'

export interface ProgressiveValidationState {
  // Step validation states
  stepValidationResults: Record<number, StepValidationResult>
  overallValidationScore: number
  validationHistory: ValidationHistoryEntry[]
  
  // Current validation context
  currentStep: number
  organizationType: string | null
  selectedPackage: SubscriptionPackage | null
  
  // Progressive validation flags
  isValidationEnabled: boolean
  showDetailedValidation: boolean
  showComplianceChecks: boolean
  
  // Validation timing
  lastValidationTime: Date | null
  validationCooldown: boolean
}

export interface StepValidationResult {
  stepNumber: number
  stepName: string
  isValid: boolean
  score: number
  criticalIssues: number
  warnings: number
  fieldValidation: {
    validFields: string[]
    invalidFields: string[]
    pendingFields: string[]
  }
  organizationCompliance: {
    satisfiedRequirements: number
    totalRequirements: number
    criticalMissing: number
  }
  packageCompatibility: {
    isCompatible: boolean
    upgradeRequired: boolean
    recommendedTier: string | null
  }
  nextStepRecommendations: string[]
}

export interface ValidationHistoryEntry {
  timestamp: Date
  step: number
  score: number
  issues: string[]
  improvements: string[]
}

interface ProgressiveValidationActions {
  // Step validation
  validateStep: (
    stepNumber: number,
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ) => StepValidationResult
  
  // Overall validation
  validateOverall: (
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage | null
  ) => void
  
  // State management
  setCurrentStep: (step: number) => void
  setOrganizationType: (type: string) => void
  setSelectedPackage: (pkg: SubscriptionPackage | null) => void
  
  // Progressive disclosure
  enableDetailedValidation: () => void
  enableComplianceChecks: () => void
  toggleValidationDetails: () => void
  
  // History management
  addValidationHistory: (entry: ValidationHistoryEntry) => void
  clearValidationHistory: () => void
  
  // Reset
  resetValidationState: () => void
}

type ProgressiveValidationStore = ProgressiveValidationState & ProgressiveValidationActions

const initialState: ProgressiveValidationState = {
  stepValidationResults: {},
  overallValidationScore: 0,
  validationHistory: [],
  currentStep: 1,
  organizationType: null,
  selectedPackage: null,
  isValidationEnabled: true,
  showDetailedValidation: false,
  showComplianceChecks: false,
  lastValidationTime: null,
  validationCooldown: false
}

export const useProgressiveValidationStore = create<ProgressiveValidationStore>()(
  devtools((set, get) => ({
    ...initialState,

    validateStep: (stepNumber, registrationData, selectedPackage) => {
      const { organizationType } = get()
      
      // Get step-specific fields to validate
      const stepFields = getStepFields(stepNumber)
      const stepData = extractStepData(registrationData, stepFields)
      
      // Perform enhanced validation for this step
      const enhancedValidation = EnhancedRegistrationValidator.validateRegistration(
        { ...stepData, organizationType: (organizationType || 'LAINNYA') as 'PEMERINTAH' | 'SWASTA' | 'YAYASAN' | 'KOMUNITAS' | 'LAINNYA' },
        selectedPackage
      )
      
      const stepValidationResult: StepValidationResult = {
        stepNumber,
        stepName: getStepName(stepNumber),
        isValid: enhancedValidation.isValid && 
                 enhancedValidation.fieldValidation.errors
                   .filter(err => stepFields.includes(err.field)).length === 0,
        score: calculateStepScore(enhancedValidation, stepFields),
        criticalIssues: enhancedValidation.fieldValidation.errors
          .filter(err => stepFields.includes(err.field)).length,
        warnings: enhancedValidation.fieldValidation.warnings
          .filter(warn => stepFields.includes(warn.field)).length,
        fieldValidation: {
          validFields: stepFields.filter(field => {
            const value = stepData[field as keyof RegistrationData]
            return value !== undefined && value !== null && value !== ''
          }),
          invalidFields: enhancedValidation.fieldValidation.errors
            .filter(err => stepFields.includes(err.field))
            .map(err => err.field),
          pendingFields: stepFields.filter(field => {
            const value = stepData[field as keyof RegistrationData]
            return value === undefined || value === null || value === ''
          })
        },
        organizationCompliance: {
          satisfiedRequirements: enhancedValidation.organizationCompliance.satisfied.length,
          totalRequirements: enhancedValidation.organizationCompliance.required.length,
          criticalMissing: enhancedValidation.organizationCompliance.missing
            .filter(req => req.mandatory).length
        },
        packageCompatibility: {
          isCompatible: enhancedValidation.packageCompatibility.compatible,
          upgradeRequired: enhancedValidation.packageCompatibility.upgradeRequired,
          recommendedTier: enhancedValidation.packageCompatibility.minimumTier
        },
        nextStepRecommendations: generateNextStepRecommendations(
          stepNumber, 
          enhancedValidation, 
          organizationType
        )
      }
      
      // Update store state
      set((state) => ({
        stepValidationResults: {
          ...state.stepValidationResults,
          [stepNumber]: stepValidationResult
        },
        lastValidationTime: new Date(),
        validationCooldown: true
      }), false, 'validateStep')
      
      // Clear cooldown after 1 second
      setTimeout(() => {
        set({ validationCooldown: false }, false, 'clearValidationCooldown')
      }, 1000)
      
      return stepValidationResult
    },

    validateOverall: (registrationData, selectedPackage) => {
      const { organizationType } = get()
      const enhancedValidation = EnhancedRegistrationValidator.validateRegistration(
        { ...registrationData, organizationType: (organizationType || 'LAINNYA') as 'PEMERINTAH' | 'SWASTA' | 'YAYASAN' | 'KOMUNITAS' | 'LAINNYA' },
        selectedPackage
      )
      
      const summary = EnhancedRegistrationValidator.getValidationSummary(
        registrationData,
        selectedPackage
      )
      
      set({
        overallValidationScore: summary.overallScore,
        lastValidationTime: new Date()
      }, false, 'validateOverall')
      
      // Add to history
      get().addValidationHistory({
        timestamp: new Date(),
        step: get().currentStep,
        score: summary.overallScore,
        issues: enhancedValidation.fieldValidation.errors.map(err => err.message),
        improvements: enhancedValidation.fieldValidation.warnings.map(warn => warn.message)
      })
    },

    setCurrentStep: (step) => {
      set({ currentStep: step }, false, 'setCurrentStep')
    },

    setOrganizationType: (type) => {
      const previousType = get().organizationType
      set({ 
        organizationType: type,
        // Reset detailed validation if organization type changed
        showDetailedValidation: previousType !== type ? false : get().showDetailedValidation
      }, false, 'setOrganizationType')
    },

    setSelectedPackage: (pkg) => {
      set({ selectedPackage: pkg }, false, 'setSelectedPackage')
    },

    enableDetailedValidation: () => {
      set({ 
        showDetailedValidation: true,
        showComplianceChecks: true
      }, false, 'enableDetailedValidation')
    },

    enableComplianceChecks: () => {
      set({ showComplianceChecks: true }, false, 'enableComplianceChecks')
    },

    toggleValidationDetails: () => {
      set((state) => ({ 
        showDetailedValidation: !state.showDetailedValidation 
      }), false, 'toggleValidationDetails')
    },

    addValidationHistory: (entry) => {
      set((state) => ({
        validationHistory: [...state.validationHistory.slice(-9), entry] // Keep last 10 entries
      }), false, 'addValidationHistory')
    },

    clearValidationHistory: () => {
      set({ validationHistory: [] }, false, 'clearValidationHistory')
    },

    resetValidationState: () => {
      set(initialState, false, 'resetValidationState')
    }
  }), {
    name: 'progressive-validation-store'
  })
)

/**
 * Helper Functions
 */

function getStepFields(stepNumber: number): string[] {
  const stepFieldsMap: Record<number, string[]> = {
    1: ['code', 'name', 'organizationType', 'description', 'establishedYear', 'phone', 'email'],
    2: ['picName', 'picPosition', 'picEmail', 'picPhone'],
    3: ['provinceId', 'regencyId', 'districtId', 'villageId', 'address', 'postalCode'],
    4: ['targetRecipients', 'maxRadius', 'maxTravelTime'],
    5: ['operationStartDate', 'businessHoursStart', 'businessHoursEnd']
  }
  return stepFieldsMap[stepNumber] || []
}

function getStepName(stepNumber: number): string {
  const stepNames: Record<number, string> = {
    1: 'Data Organisasi SPPG',
    2: 'Person in Charge (PIC)',
    3: 'Lokasi & Alamat SPPG',
    4: 'Parameter Operasional',
    5: 'Jadwal & Konfirmasi'
  }
  return stepNames[stepNumber] || 'Unknown Step'
}

function extractStepData(
  registrationData: Partial<RegistrationData>,
  stepFields: string[]
): Partial<RegistrationData> {
  const stepData: Partial<RegistrationData> = {}
  stepFields.forEach(field => {
    if (field in registrationData) {
      const value = registrationData[field as keyof RegistrationData]
      if (value !== undefined) {
        ;(stepData as Record<string, unknown>)[field] = value
      }
    }
  })
  return stepData
}

function calculateStepScore(
  validation: EnhancedValidationResult,
  stepFields: string[]
): number {
  const stepErrors = validation.fieldValidation.errors
    .filter(err => stepFields.includes(err.field))
  const stepWarnings = validation.fieldValidation.warnings
    .filter(warn => stepFields.includes(warn.field))
  
  let score = 100
  score -= stepErrors.length * 25  // -25 per error
  score -= stepWarnings.length * 5 // -5 per warning
  
  return Math.max(0, score)
}

function generateNextStepRecommendations(
  currentStep: number,
  validation: EnhancedValidationResult,
  organizationType: string | null
): string[] {
  const recommendations: string[] = []
  
  if (currentStep === 1 && organizationType) {
    const orgRules = ORGANIZATION_VALIDATION_RULES[organizationType]
    if (orgRules) {
      recommendations.push(`Siapkan data PIC dengan posisi ${
        organizationType === 'PEMERINTAH' ? 'struktural yang berwenang' :
        organizationType === 'YAYASAN' ? 'pengurus yayasan' :
        'koordinator program'
      }`)
    }
  }
  
  if (currentStep === 2) {
    recommendations.push('Pastikan alamat lengkap sesuai dengan domisili organisasi')
    if (organizationType === 'PEMERINTAH') {
      recommendations.push('Gunakan alamat kantor resmi untuk verifikasi')
    }
  }
  
  if (currentStep === 3) {
    recommendations.push('Pertimbangkan kapasitas operasional yang realistis')
    if (validation.packageCompatibility.upgradeRequired) {
      recommendations.push('Evaluasi paket subscription untuk mencocokkan target operasional')
    }
  }
  
  if (currentStep === 4) {
    recommendations.push('Review kembali jadwal operasional dan konfirmasi data lengkap')
  }
  
  return recommendations
}

/**
 * React Hook for Progressive Validation
 */
export const useProgressiveValidation = () => {
  const {
    stepValidationResults,
    overallValidationScore,
    validationHistory,
    currentStep,
    showDetailedValidation,
    showComplianceChecks,
    validateStep,
    validateOverall,
    setCurrentStep,
    setOrganizationType,
    setSelectedPackage,
    enableDetailedValidation,
    toggleValidationDetails
  } = useProgressiveValidationStore()

  const getCurrentStepValidation = () => {
    return stepValidationResults[currentStep] || null
  }

  const getValidationTrend = () => {
    if (validationHistory.length < 2) return 'stable'
    
    const recent = validationHistory.slice(-2)
    const improvement = recent[1].score - recent[0].score
    
    if (improvement > 5) return 'improving'
    if (improvement < -5) return 'declining'
    return 'stable'
  }

  const shouldShowUpgradeRecommendation = () => {
    const currentValidation = getCurrentStepValidation()
    return currentValidation?.packageCompatibility.upgradeRequired || false
  }

  return {
    // State
    stepValidationResults,
    overallValidationScore,
    validationHistory,
    currentStep,
    showDetailedValidation,
    showComplianceChecks,
    
    // Actions
    validateStep,
    validateOverall,
    setCurrentStep,
    setOrganizationType,
    setSelectedPackage,
    enableDetailedValidation,
    toggleValidationDetails,
    
    // Computed values
    getCurrentStepValidation,
    getValidationTrend,
    shouldShowUpgradeRecommendation,
    
    // Helper flags
    hasValidationData: Object.keys(stepValidationResults).length > 0,
    isValidationComplete: overallValidationScore >= 80
  }
}