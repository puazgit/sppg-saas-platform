/**
 * Subscription Feature - Zustand Store
 * Global state management for subscription flow using Zustand
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { PaymentData } from '../types/payment'
import { RegistrationData } from '../schemas/subscription.schema'
import { SubscriptionPackage } from '../services/subscription-api'

// Helper functions for package upgrade
const getMaxRecipientsByTier = (tier: string): number => {
  const limits = { 'BASIC': 500, 'STANDARD': 2000, 'PRO': 10000, 'ENTERPRISE': 50000 }
  return limits[tier as keyof typeof limits] || 500
}

const getMaxStaffByTier = (tier: string): number => {
  const limits = { 'BASIC': 5, 'STANDARD': 15, 'PRO': 50, 'ENTERPRISE': 200 }
  return limits[tier as keyof typeof limits] || 5
}

const getMaxDistributionPointsByTier = (tier: string): number => {
  const limits = { 'BASIC': 3, 'STANDARD': 10, 'PRO': 25, 'ENTERPRISE': 100 }
  return limits[tier as keyof typeof limits] || 3
}

const getPricingByTier = (tier: string): number => {
  const pricing = { 'BASIC': 125000, 'STANDARD': 250000, 'PRO': 500000, 'ENTERPRISE': 1000000 }
  return pricing[tier as keyof typeof pricing] || 125000
}

// Subscription State Interface
interface SubscriptionState {
  // Current state
  currentStep: number
  selectedPackage: SubscriptionPackage | null
  registrationData: Partial<RegistrationData>
  paymentData: PaymentData | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Form validation
  validationErrors: Record<string, string[]>
  
  // Progress tracking
  completedSteps: number[]
  
  // Session data
  sessionId: string | null
  subscriptionId: string | null
  
  // Draft saving
  isDraft: boolean
  lastSaved: Date | null
}

// Subscription Actions Interface
interface SubscriptionActions {
  // Step navigation
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  markStepCompleted: (step: number) => void
  
  // Data management
  setPackage: (pkg: SubscriptionPackage | null) => void
  upgradePackage: (targetTier: string) => void
  setRegistrationData: (data: Partial<RegistrationData>) => void
  updateRegistrationField: (field: keyof RegistrationData, value: unknown) => void
  setPaymentData: (data: PaymentData) => void
  setSubscriptionId: (id: string | null) => void
  
  // UI state
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Validation
  setValidationErrors: (errors: Record<string, string[]>) => void
  clearValidationErrors: () => void
  addValidationError: (field: string, errors: string[]) => void
  
  // Session management
  startSession: () => void
  endSession: () => void
  
  // Draft management
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
  
  // Reset
  resetState: () => void
  resetToStep: (step: number) => void
}

// Combined interface
type SubscriptionStore = SubscriptionState & SubscriptionActions

// Initial state
const initialState: SubscriptionState = {
  currentStep: 1,
  selectedPackage: null,
  registrationData: {},
  paymentData: null,
  isLoading: false,
  error: null,
  validationErrors: {},
  completedSteps: [],
  sessionId: null,
  subscriptionId: null,
  isDraft: false,
  lastSaved: null
}

// Create store with Zustand
export const useSubscriptionStore = create<SubscriptionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Step navigation
        setStep: (step: number) => {
          set({ currentStep: step }, false, 'setStep')
        },

        nextStep: () => {
          const { currentStep } = get()
          const nextStep = Math.min(currentStep + 1, 6) // Max 6 steps (including success step)
          set({ currentStep: nextStep }, false, 'nextStep')
        },

        prevStep: () => {
          const { currentStep } = get()
          const prevStep = Math.max(currentStep - 1, 1) // Min step 1
          set({ currentStep: prevStep }, false, 'prevStep')
        },

        markStepCompleted: (step: number) => {
          const { completedSteps } = get()
          if (!completedSteps.includes(step)) {
            set({ 
              completedSteps: [...completedSteps, step].sort() 
            }, false, 'markStepCompleted')
          }
        },

        // Data management
        setPackage: (pkg: SubscriptionPackage | null) => {
          set({ 
            selectedPackage: pkg,
            lastSaved: new Date()
          }, false, 'setPackage')
        },

        // Package upgrade handler
        upgradePackage: (targetTier: string) => {
          const { selectedPackage } = get()
          
          // Find the target package by tier
          // This should integrate with your package API service
          const mockUpgradePackage = {
            ...selectedPackage,
            tier: targetTier,
            name: `SPPG ${targetTier}`,
            displayName: targetTier,
            maxRecipients: getMaxRecipientsByTier(targetTier),
            maxStaff: getMaxStaffByTier(targetTier),
            maxDistributionPoints: getMaxDistributionPointsByTier(targetTier),
            monthlyPrice: getPricingByTier(targetTier),
            hasAdvancedReporting: ['PRO', 'ENTERPRISE'].includes(targetTier),
            hasAPIAccess: ['PRO', 'ENTERPRISE'].includes(targetTier),
            hasNutritionAnalysis: ['STANDARD', 'PRO', 'ENTERPRISE'].includes(targetTier),
            hasQualityControl: ['PRO', 'ENTERPRISE'].includes(targetTier),
          } as SubscriptionPackage

          set({ 
            selectedPackage: mockUpgradePackage,
            lastSaved: new Date()
          }, false, 'upgradePackage')
        },

        setRegistrationData: (data: Partial<RegistrationData>) => {
          const { registrationData } = get()
          set({ 
            registrationData: { ...registrationData, ...data },
            lastSaved: new Date(),
            isDraft: true
          }, false, 'setRegistrationData')
        },

        updateRegistrationField: (field: keyof RegistrationData, value: unknown) => {
          const { registrationData } = get()
          set({
            registrationData: { 
              ...registrationData, 
              [field]: value 
            },
            lastSaved: new Date(),
            isDraft: true
          }, false, 'updateRegistrationField')
        },

        setPaymentData: (data: PaymentData) => {
          set({ 
            paymentData: data,
            lastSaved: new Date()
          }, false, 'setPaymentData')
        },

        setSubscriptionId: (id: string | null) => {
          set({ 
            subscriptionId: id,
            lastSaved: new Date()
          }, false, 'setSubscriptionId')
        },

        // UI state
        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'setLoading')
        },

        setError: (error: string | null) => {
          set({ error }, false, 'setError')
        },

        clearError: () => {
          set({ error: null }, false, 'clearError')
        },

        // Validation
        setValidationErrors: (errors: Record<string, string[]>) => {
          set({ validationErrors: errors }, false, 'setValidationErrors')
        },

        clearValidationErrors: () => {
          set({ validationErrors: {} }, false, 'clearValidationErrors')
        },

        addValidationError: (field: string, errors: string[]) => {
          const { validationErrors } = get()
          set({
            validationErrors: { 
              ...validationErrors, 
              [field]: errors 
            }
          }, false, 'addValidationError')
        },

        // Session management
        startSession: () => {
          const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          set({ sessionId }, false, 'startSession')
        },

        endSession: () => {
          set({ sessionId: null }, false, 'endSession')
        },

        // Draft management
        saveDraft: () => {
          set({ 
            isDraft: true, 
            lastSaved: new Date() 
          }, false, 'saveDraft')
        },

        loadDraft: () => {
          // Logic to load from localStorage or API
          // This will be handled by persist middleware
          console.log('Loading draft from storage...')
        },

        clearDraft: () => {
          set({ 
            isDraft: false, 
            lastSaved: null 
          }, false, 'clearDraft')
        },

        // Reset
        resetState: () => {
          set(initialState, false, 'resetState')
        },

        resetToStep: (step: number) => {
          const { completedSteps } = get()
          const filteredSteps = completedSteps.filter(s => s < step)
          set({
            currentStep: step,
            completedSteps: filteredSteps,
            paymentData: step < 4 ? null : get().paymentData,
            error: null,
            validationErrors: {}
          }, false, 'resetToStep')
        }
      }),
      {
        name: 'sppg-subscription-storage', // localStorage key
        partialize: (state) => ({
          // Only persist important data, not UI state
          selectedPackage: state.selectedPackage,
          registrationData: state.registrationData,
          paymentData: state.paymentData,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          isDraft: state.isDraft,
          lastSaved: state.lastSaved,
          sessionId: state.sessionId
        })
      }
    ),
    {
      name: 'subscription-store', // Redux DevTools name
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

// Custom hooks for optimized re-renders
export const useCurrentStep = () => useSubscriptionStore(state => state.currentStep)
export const useSelectedPackage = () => useSubscriptionStore(state => state.selectedPackage)
export const useRegistrationData = () => useSubscriptionStore(state => state.registrationData)
export const usePaymentData = () => useSubscriptionStore(state => state.paymentData)
export const useSubscriptionLoading = () => useSubscriptionStore(state => state.isLoading)
export const useSubscriptionError = () => useSubscriptionStore(state => state.error)
export const useValidationErrors = () => useSubscriptionStore(state => state.validationErrors)
export const useCompletedSteps = () => useSubscriptionStore(state => state.completedSteps)
export const useIsDraft = () => useSubscriptionStore(state => state.isDraft)
export const useLastSaved = () => useSubscriptionStore(state => state.lastSaved)

// Computed selectors
export const useIsStepCompleted = (step: number) => 
  useSubscriptionStore(state => state.completedSteps.includes(step))

export const useHasErrors = () => 
  useSubscriptionStore(state => Object.keys(state.validationErrors).length > 0)

export const useFieldErrors = (field: string) =>
  useSubscriptionStore(state => state.validationErrors[field] || [])

export const useProgressPercentage = () => 
  useSubscriptionStore(state => {
    const totalSteps = 5
    const completedCount = state.completedSteps.length
    return Math.round((completedCount / totalSteps) * 100)
  })

export const useIsPackageSelected = () => 
  useSubscriptionStore(state => !!state.selectedPackage)

export const useIsRegistrationComplete = () => 
  useSubscriptionStore(state => {
    const required = ['code', 'name', 'email', 'phone', 'address', 'provinceId', 'regencyId']
    return required.every(field => !!state.registrationData[field as keyof RegistrationData])
  })

export const useIsPaymentSelected = () => 
  useSubscriptionStore(state => !!state.paymentData?.method)

// Actions for external use
export const useSubscriptionActions = () => {
  const store = useSubscriptionStore()
  return {
    setStep: store.setStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    markStepCompleted: store.markStepCompleted,
    setPackage: store.setPackage,
    setRegistrationData: store.setRegistrationData,
    updateRegistrationField: store.updateRegistrationField,
    setPaymentData: store.setPaymentData,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    setValidationErrors: store.setValidationErrors,
    clearValidationErrors: store.clearValidationErrors,
    addValidationError: store.addValidationError,
    startSession: store.startSession,
    endSession: store.endSession,
    saveDraft: store.saveDraft,
    loadDraft: store.loadDraft,
    clearDraft: store.clearDraft,
    resetState: store.resetState,
    resetToStep: store.resetToStep
  }
}

// Export store type for external use
export type { SubscriptionStore, SubscriptionState, SubscriptionActions }