'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types for subscription state
export interface SubscriptionPackage {
  id: string
  name: string
  displayName: string
  tier: 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE'
  monthlyPrice: number
  yearlyPrice: number
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  features: string[]
}

export interface RegistrationData {
  // SPPG Organization Data
  code: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  
  // Operational Data
  targetRecipients: number
  maxRadius: number
  maxTravelTime: number
  operationStartDate: string
  operationEndDate?: string
  
  // Location Data
  provinceId: string
  regencyId: string
  districtId: string
  villageId: string
  
  // PIC Data
  picName: string
  picPosition: string
  picEmail: string
  picPhone: string
  picWhatsapp?: string
  
  // Additional Data
  organizationType: string
  establishedYear: string
  city: string
  postalCode: string
  website?: string
  
  // Documentation
  hasLegalDocument: boolean
  hasNutritionLicense: boolean
  hasHalalCertification: boolean
  
  // System Configuration
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
  operationalDays: string
}

export interface PaymentData {
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'VIRTUAL_ACCOUNT' | 'E_WALLET'
  billingCycle: 'MONTHLY' | 'YEARLY'
  promoCode?: string
  discount?: number
  setupFee: number
  totalAmount: number
}

export interface SubscriptionState {
  // Current step in subscription flow
  currentStep: number
  
  // Selected package
  selectedPackage: SubscriptionPackage | null
  
  // Registration form data
  registrationData: Partial<RegistrationData>
  
  // Payment data
  paymentData: Partial<PaymentData>
  
  // Validation states
  registrationValid: boolean
  paymentValid: boolean
  
  // Loading states
  isSubmitting: boolean
  isValidating: boolean
  
  // Error states
  errors: Record<string, string>
  
  // Success states
  isCompleted: boolean
  subscriptionId?: string
}

// Action types
type SubscriptionAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SELECT_PACKAGE'; payload: SubscriptionPackage }
  | { type: 'UPDATE_REGISTRATION'; payload: Partial<RegistrationData> }
  | { type: 'UPDATE_PAYMENT'; payload: Partial<PaymentData> }
  | { type: 'SET_REGISTRATION_VALID'; payload: boolean }
  | { type: 'SET_PAYMENT_VALID'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_VALIDATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'SET_COMPLETED'; payload: { subscriptionId: string } }
  | { type: 'RESET_STATE' }

// Initial state
const initialState: SubscriptionState = {
  currentStep: 1,
  selectedPackage: null,
  registrationData: {},
  paymentData: {},
  registrationValid: false,
  paymentValid: false,
  isSubmitting: false,
  isValidating: false,
  errors: {},
  isCompleted: false
}

// Reducer function
function subscriptionReducer(
  state: SubscriptionState, 
  action: SubscriptionAction
): SubscriptionState {
  switch (action.type) {
    case 'SET_STEP':
      return { 
        ...state, 
        currentStep: action.payload 
      }
      
    case 'SELECT_PACKAGE':
      return { 
        ...state, 
        selectedPackage: action.payload,
        paymentData: {
          ...state.paymentData,
          setupFee: action.payload.monthlyPrice * 0.1, // 10% setup fee
        }
      }
      
    case 'UPDATE_REGISTRATION':
      return { 
        ...state, 
        registrationData: { 
          ...state.registrationData, 
          ...action.payload 
        }
      }
      
    case 'UPDATE_PAYMENT':
      return { 
        ...state, 
        paymentData: { 
          ...state.paymentData, 
          ...action.payload 
        }
      }
      
    case 'SET_REGISTRATION_VALID':
      return { 
        ...state, 
        registrationValid: action.payload 
      }
      
    case 'SET_PAYMENT_VALID':
      return { 
        ...state, 
        paymentValid: action.payload 
      }
      
    case 'SET_SUBMITTING':
      return { 
        ...state, 
        isSubmitting: action.payload 
      }
      
    case 'SET_VALIDATING':
      return { 
        ...state, 
        isValidating: action.payload 
      }
      
    case 'SET_ERROR':
      return { 
        ...state, 
        errors: { 
          ...state.errors, 
          [action.payload.field]: action.payload.message 
        }
      }
      
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors }
      delete newErrors[action.payload]
      return { 
        ...state, 
        errors: newErrors 
      }
      
    case 'CLEAR_ALL_ERRORS':
      return { 
        ...state, 
        errors: {} 
      }
      
    case 'SET_COMPLETED':
      return { 
        ...state, 
        isCompleted: true, 
        subscriptionId: action.payload.subscriptionId,
        currentStep: 4 // Success step
      }
      
    case 'RESET_STATE':
      return initialState
      
    default:
      return state
  }
}

// Context
const SubscriptionContext = createContext<{
  state: SubscriptionState
  dispatch: React.Dispatch<SubscriptionAction>
} | null>(null)

// Provider component
interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState)
  
  return (
    <SubscriptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// Hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

// Convenience hooks for specific actions
export function useSubscriptionActions() {
  const { dispatch } = useSubscription()
  
  return {
    setStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    
    selectPackage: (pkg: SubscriptionPackage) => 
      dispatch({ type: 'SELECT_PACKAGE', payload: pkg }),
    
    updateRegistration: (data: Partial<RegistrationData>) => 
      dispatch({ type: 'UPDATE_REGISTRATION', payload: data }),
    
    updatePayment: (data: Partial<PaymentData>) => 
      dispatch({ type: 'UPDATE_PAYMENT', payload: data }),
    
    setRegistrationValid: (valid: boolean) => 
      dispatch({ type: 'SET_REGISTRATION_VALID', payload: valid }),
    
    setPaymentValid: (valid: boolean) => 
      dispatch({ type: 'SET_PAYMENT_VALID', payload: valid }),
    
    setSubmitting: (loading: boolean) => 
      dispatch({ type: 'SET_SUBMITTING', payload: loading }),
    
    setValidating: (loading: boolean) => 
      dispatch({ type: 'SET_VALIDATING', payload: loading }),
    
    setError: (field: string, message: string) => 
      dispatch({ type: 'SET_ERROR', payload: { field, message } }),
    
    clearError: (field: string) => 
      dispatch({ type: 'CLEAR_ERROR', payload: field }),
    
    clearAllErrors: () => 
      dispatch({ type: 'CLEAR_ALL_ERRORS' }),
    
    setCompleted: (subscriptionId: string) => 
      dispatch({ type: 'SET_COMPLETED', payload: { subscriptionId } }),
    
    resetState: () => 
      dispatch({ type: 'RESET_STATE' })
  }
}