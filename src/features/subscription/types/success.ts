/**
 * Success Flow Types
 * Types for success page and onboarding flow
 */

export interface SuccessData {
  subscriptionId: string
  sppgId: string
  organizationName: string
  packageName: string
  activationStatus: 'PENDING' | 'ACTIVE' | 'FAILED'
  
  // Invoice details
  invoice?: {
    id: string
    amount: number
    paidAt?: Date
    paymentMethod: string
  }
  
  // Account details
  account?: {
    adminEmail: string
    loginUrl: string
    tempPassword?: string
    setupRequired: boolean
  }
  
  // Next steps
  nextSteps?: {
    title: string
    description: string
    actionRequired: boolean
    dueDate?: Date
  }[]
  
  // Contact information
  support?: {
    email: string
    phone: string
    whatsapp: string
  }
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
  estimatedTime: number // in minutes
  category: 'SETUP' | 'CONFIGURATION' | 'TRAINING' | 'VERIFICATION'
  isOptional: boolean
  dependencies?: string[] // Other step IDs that must be completed first
}

export interface WelcomeNotification {
  type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP'
  title: string
  message: string
  scheduledAt: Date
  status: 'SCHEDULED' | 'SENT' | 'DELIVERED' | 'FAILED'
  templateId?: string
}

export interface SuccessMetrics {
  registrationCompletedAt: Date
  paymentCompletedAt?: Date
  accountActivatedAt?: Date
  firstLoginAt?: Date
  onboardingCompletedAt?: Date
  timeToActivation?: number // in minutes
}

export type SuccessPageSection = 
  | 'CONFIRMATION'
  | 'ACCOUNT_INFO' 
  | 'NEXT_STEPS'
  | 'SUPPORT'
  | 'RESOURCES'