/**
 * Billing Store - Zustand State Management
 * Advanced state management untuk subscription flow sesuai Development Agreement
 * Features: Persistence, DevTools, Type Safety, Error Handling
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { SubscriptionPackage } from '../types'

// ===== ENTERPRISE STATE TYPES =====
export type SubscriptionStep = 'packages' | 'registration' | 'confirmation' | 'payment' | 'success'

export interface OrganizationFormData {
  name: string
  email: string
  phone: string
  address: string
  picName: string
  picEmail: string
  picPhone: string
  studentsCount: number
  schoolsCount: number
  region: string
}

export interface BillingFormData {
  method: 'TRANSFER' | 'CREDIT_CARD' | 'EWALLET'
  billingCycle: 'MONTHLY' | 'YEARLY'
}

export interface AgreementFormData {
  terms: boolean
  privacy: boolean
  marketing: boolean
}

export interface SubscriptionFormData {
  organization: OrganizationFormData
  billing: BillingFormData
  agreement: AgreementFormData
}

export interface ValidationErrors {
  [key: string]: string
}

export interface BillingState {
  // Flow State
  currentStep: SubscriptionStep
  selectedPackage: SubscriptionPackage | null
  formData: SubscriptionFormData
  
  // UI State
  isProcessing: boolean
  error: string | null
  validationErrors: ValidationErrors
  
  // Progress Tracking
  completedSteps: SubscriptionStep[]
  canProceed: boolean
}

export interface BillingActions {
  // Package Management
  selectPackage: (pkg: SubscriptionPackage) => void
  
  // Form Data Management
  updateFormData: (data: Partial<SubscriptionFormData>) => void
  updateOrganizationData: (data: Partial<OrganizationFormData>) => void
  updateBillingData: (data: Partial<BillingFormData>) => void
  updateAgreementData: (data: Partial<AgreementFormData>) => void
  
  // Step Navigation
  setCurrentStep: (step: SubscriptionStep) => void
  proceedToNext: () => boolean
  goToPreviousStep: () => boolean
  
  // Validation
  validateCurrentStep: () => boolean
  canProceedToNext: () => boolean
  setValidationErrors: (errors: ValidationErrors) => void
  
  // State Management
  setProcessing: (processing: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
  
  // Enterprise Analytics
  getProgressPercentage: () => number
  getCompletedSteps: () => SubscriptionStep[]
  getCurrentStepIndex: () => number
  getTotalSteps: () => number
}

type BillingStore = BillingState & BillingActions

// ===== ENTERPRISE STORE IMPLEMENTATION =====
export const useBillingStore = create<BillingStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ===== INITIAL STATE =====
        currentStep: 'packages',
        selectedPackage: null,
        formData: {
          organization: {
            name: '',
            email: '',
            phone: '',
            address: '',
            picName: '',
            picEmail: '',
            picPhone: '',
            studentsCount: 0,
            schoolsCount: 0,
            region: ''
          },
          billing: {
            method: 'TRANSFER',
            billingCycle: 'MONTHLY'
          },
          agreement: {
            terms: false,
            privacy: false,
            marketing: false
          }
        },
        isProcessing: false,
        error: null,
        validationErrors: {},
        completedSteps: [],
        canProceed: false,

        // ===== PACKAGE MANAGEMENT =====
        selectPackage: (pkg: SubscriptionPackage) => {
          set((state) => {
            state.selectedPackage = pkg
            state.error = null
            state.validationErrors = {}
            
            // Auto-advance to next step if package is selected
            if (state.currentStep === 'packages') {
              state.currentStep = 'registration'
              if (!state.completedSteps.includes('packages')) {
                state.completedSteps.push('packages')
              }
            }
          })
        },

        // ===== FORM DATA MANAGEMENT =====
        updateFormData: (data: Partial<SubscriptionFormData>) => {
          set((state) => {
            if (data.organization) {
              Object.assign(state.formData.organization, data.organization)
            }
            if (data.billing) {
              Object.assign(state.formData.billing, data.billing)
            }
            if (data.agreement) {
              Object.assign(state.formData.agreement, data.agreement)
            }
            
            // Clear validation errors for updated fields
            state.validationErrors = {}
            state.error = null
            
            // Update proceed capability
            state.canProceed = get().validateCurrentStep()
          })
        },

        updateOrganizationData: (data: Partial<OrganizationFormData>) => {
          set((state) => {
            Object.assign(state.formData.organization, data)
            state.validationErrors = {}
            state.canProceed = get().validateCurrentStep()
          })
        },

        updateBillingData: (data: Partial<BillingFormData>) => {
          set((state) => {
            Object.assign(state.formData.billing, data)
            state.validationErrors = {}
            state.canProceed = get().validateCurrentStep()
          })
        },

        updateAgreementData: (data: Partial<AgreementFormData>) => {
          set((state) => {
            Object.assign(state.formData.agreement, data)
            state.validationErrors = {}
            state.canProceed = get().validateCurrentStep()
          })
        },

        // ===== STEP NAVIGATION =====
        setCurrentStep: (step: SubscriptionStep) => {
          set((state) => {
            const validSteps: SubscriptionStep[] = [
              'packages', 'registration', 'confirmation', 'payment', 'success'
            ]
            
            if (validSteps.includes(step)) {
              state.currentStep = step
              state.error = null
              state.canProceed = get().validateCurrentStep()
            } else {
              state.error = `Invalid step: ${step}`
            }
          })
        },

        proceedToNext: () => {
          const state = get()
          if (!state.validateCurrentStep()) return false

          const stepOrder: SubscriptionStep[] = [
            'packages', 'registration', 'confirmation', 'payment', 'success'
          ]
          
          const currentIndex = stepOrder.indexOf(state.currentStep)
          const nextStep = stepOrder[currentIndex + 1]
          
          if (nextStep) {
            set((draft) => {
              draft.currentStep = nextStep
              if (!draft.completedSteps.includes(stepOrder[currentIndex])) {
                draft.completedSteps.push(stepOrder[currentIndex])
              }
              draft.canProceed = get().validateCurrentStep()
            })
            return true
          }
          
          return false
        },

        goToPreviousStep: () => {
          const state = get()
          const stepOrder: SubscriptionStep[] = [
            'packages', 'registration', 'confirmation', 'payment', 'success'
          ]
          
          const currentIndex = stepOrder.indexOf(state.currentStep)
          const prevStep = stepOrder[currentIndex - 1]
          
          if (prevStep && currentIndex > 0) {
            set((draft) => {
              draft.currentStep = prevStep
              draft.canProceed = get().validateCurrentStep()
            })
            return true
          }
          
          return false
        },

        // ===== ENTERPRISE VALIDATION =====
        validateCurrentStep: () => {
          const state = get()
          const errors: ValidationErrors = {}

          switch (state.currentStep) {
            case 'packages':
              if (!state.selectedPackage) {
                errors.package = 'Pilih paket berlangganan terlebih dahulu'
              }
              break
            
            case 'registration':
              const org = state.formData.organization
              
              if (!org.name?.trim()) {
                errors.name = 'Nama organisasi SPPG wajib diisi'
              }
              
              if (!org.email?.trim()) {
                errors.email = 'Email organisasi wajib diisi'
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email)) {
                errors.email = 'Format email tidak valid'
              }
              
              if (!org.phone?.trim()) {
                errors.phone = 'Nomor telepon wajib diisi'
              }
              
              if (!org.picName?.trim()) {
                errors.picName = 'Nama PIC wajib diisi'
              }
              
              if (!org.picEmail?.trim()) {
                errors.picEmail = 'Email PIC wajib diisi'
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.picEmail)) {
                errors.picEmail = 'Format email PIC tidak valid'
              }
              
              if (org.studentsCount <= 0) {
                errors.studentsCount = 'Jumlah siswa harus lebih dari 0'
              }
              
              if (org.schoolsCount <= 0) {
                errors.schoolsCount = 'Jumlah sekolah harus lebih dari 0'
              }
              
              if (!org.region?.trim()) {
                errors.region = 'Wilayah operasi wajib diisi'
              }
              break
            
            case 'confirmation':
              if (!state.formData.agreement.terms) {
                errors.terms = 'Anda harus menyetujui syarat dan ketentuan'
              }
              
              if (!state.formData.agreement.privacy) {
                errors.privacy = 'Anda harus menyetujui kebijakan privasi'
              }
              break
              
            case 'payment':
              if (!state.formData.billing.method) {
                errors.paymentMethod = 'Pilih metode pembayaran'
              }
              break
          }

          set((draft) => {
            draft.validationErrors = errors
          })

          return Object.keys(errors).length === 0
        },

        canProceedToNext: () => {
          const state = get()
          return state.validateCurrentStep() && !state.isProcessing
        },

        setValidationErrors: (errors: ValidationErrors) => {
          set((state) => {
            state.validationErrors = errors
          })
        },

        // ===== STATE MANAGEMENT =====
        setProcessing: (processing: boolean) => {
          set((state) => {
            state.isProcessing = processing
            if (processing) {
              state.error = null
            }
          })
        },

        setError: (error: string | null) => {
          set((state) => {
            state.error = error
            if (error) {
              state.isProcessing = false
            }
          })
        },

        reset: () => {
          set((state) => {
            state.currentStep = 'packages'
            state.selectedPackage = null
            state.formData = {
              organization: {
                name: '',
                email: '',
                phone: '',
                address: '',
                picName: '',
                picEmail: '',
                picPhone: '',
                studentsCount: 0,
                schoolsCount: 0,
                region: ''
              },
              billing: {
                method: 'TRANSFER',
                billingCycle: 'MONTHLY'
              },
              agreement: {
                terms: false,
                privacy: false,
                marketing: false
              }
            }
            state.isProcessing = false
            state.error = null
            state.validationErrors = {}
            state.completedSteps = []
            state.canProceed = false
          })
        },

        // ===== ENTERPRISE ANALYTICS =====
        getProgressPercentage: () => {
          const state = get()
          const stepOrder: SubscriptionStep[] = [
            'packages', 'registration', 'confirmation', 'payment', 'success'
          ]
          
          const currentIndex = stepOrder.indexOf(state.currentStep)
          return Math.round(((currentIndex + 1) / stepOrder.length) * 100)
        },

        getCompletedSteps: () => {
          const state = get()
          return [...state.completedSteps]
        },

        getCurrentStepIndex: () => {
          const state = get()
          const stepOrder: SubscriptionStep[] = [
            'packages', 'registration', 'confirmation', 'payment', 'success'
          ]
          return stepOrder.indexOf(state.currentStep)
        },

        getTotalSteps: () => {
          return 5 // packages, registration, confirmation, payment, success
        }
      })),
      {
        name: 'sppg-billing-store',
        // Skip persist untuk SSR compatibility
        skipHydration: true,
        // Selective persistence - hanya data penting
        partialize: (state) => ({
          selectedPackage: state.selectedPackage,
          formData: state.formData,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          isProcessing: false,
          error: null,
          validationErrors: {},
          canProceed: false
        }),
        // Version untuk migration jika schema berubah
        version: 1,
        // Handle storage availability with safe access
        storage: createJSONStorage(() => {
          try {
            if (typeof window !== 'undefined') {
              return window.localStorage
            }
            // Fallback for SSR
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {}
            }
          } catch {
            // Fallback storage that does nothing
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {}
            }
          }
        }),
        // Migrate function untuk handle breaking changes
        migrate: (persistedState: unknown, version: number) => {
          if (version === 0) {
            // Migration from v0 to v1
            return {
              ...(persistedState as object),
              completedSteps: [],
              canProceed: false
            }
          }
          return persistedState as BillingState
        }
      }
    ),
    {
      name: 'SPPG Billing Store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)