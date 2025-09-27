/**
 * SPPG Billing Types
 * TypeScript definitions untuk billing feature
 */

import { SubscriptionTier, SubscriptionStatus as PrismaSubscriptionStatus, PaymentStatus } from '@prisma/client'

// ===== SUBSCRIPTION TYPES =====
export interface SubscriptionPackage {
  id: string
  name: string
  displayName: string
  description: string
  tier: SubscriptionTier
  monthlyPrice: number
  yearlyPrice: number | null
  setupFee: number
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  maxMenusPerMonth: number
  storageGb: number
  maxReportsPerMonth: number
  hasAdvancedReporting: boolean
  hasNutritionAnalysis: boolean
  hasCostCalculation: boolean
  hasQualityControl: boolean
  hasAPIAccess: boolean
  hasCustomBranding: boolean
  hasPrioritySupport: boolean
  hasTrainingIncluded: boolean
  supportLevel: string
  responseTimeSLA: string | null
  isActive: boolean
  isPopular: boolean
  highlightFeatures: string[]
  targetMarket: string | null
}

export interface Subscription {
  id: string
  sppgId: string
  tier: SubscriptionTier
  status: PrismaSubscriptionStatus
  startDate: Date
  endDate: Date | null
  billingDate: Date
  maxRecipients: number
  maxStaff: number
  maxDistributionPoints: number
  storageGb: number
  packageId: string | null
  package?: SubscriptionPackage
}

export interface Invoice {
  id: string
  sppgId: string
  invoiceNumber: string
  period: string
  baseAmount: number
  tax: number
  discount: number
  totalAmount: number
  status: PaymentStatus
  invoiceDate: Date
  dueDate: Date
  paidDate: Date | null
  paymentMethod: string | null
  paymentReference: string | null
  paymentNotes: string | null
}

// ===== BILLING FLOW TYPES =====
export interface SppgRegistrationData {
  // Data SPPG
  sppgName: string
  sppgType: 'SEKOLAH' | 'PUSKESMAS' | 'POSYANDU' | 'NGO'
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
  email: string
  
  // Data PIC
  picName: string
  picPosition: string
  picPhone: string
  picEmail: string
  
  // Data Operasional
  estimatedRecipients: number
  currentStaff: number
  hasExistingSystem: boolean
  needsTraining: boolean
}

export interface PaymentData {
  paymentMethod: PaymentMethodType
  billingCycle: BillingCycle
}

export interface SubscriptionFlowData {
  selectedPackage: SubscriptionPackage
  sppgData: SppgRegistrationData
  paymentData: PaymentData
}

// ===== ENUMS =====
export type PaymentMethodType = 'BANK_TRANSFER' | 'CREDIT_CARD' | 'VIRTUAL_ACCOUNT'
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
export type SubscriptionStatus = PrismaSubscriptionStatus

// ===== API TYPES =====
export interface CreateSubscriptionRequest {
  packageId: string
  sppgData: SppgRegistrationData
  paymentData: PaymentData
}

export interface CreateSubscriptionResponse {
  subscriptionId: string
  sppgId: string
  invoiceId: string
  paymentInstructions: PaymentInstructions
}

export interface PaymentInstructions {
  method: PaymentMethodType
  amount: number
  instructions: string
  reference?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  virtualAccount?: {
    vaNumber: string
    bankCode: string
  }
}

// ===== STORE TYPES =====
export interface BillingState {
  // Current subscription
  currentSubscription: Subscription | null
  isLoadingSubscription: boolean
  
  // Packages
  packages: SubscriptionPackage[]
  isLoadingPackages: boolean
  
  // Invoices
  invoices: Invoice[]
  isLoadingInvoices: boolean
  
  // Flow state
  selectedPackage: SubscriptionPackage | null
  flowStep: 'package' | 'registration' | 'confirmation' | 'payment' | 'success'
  registrationData: SppgRegistrationData | null
  paymentData: PaymentData | null
}

export interface BillingActions {
  // Subscription actions
  setCurrentSubscription: (subscription: Subscription | null) => void
  setLoadingSubscription: (loading: boolean) => void
  
  // Package actions
  setPackages: (packages: SubscriptionPackage[]) => void
  setLoadingPackages: (loading: boolean) => void
  
  // Invoice actions
  setInvoices: (invoices: Invoice[]) => void
  setLoadingInvoices: (loading: boolean) => void
  
  // Flow actions
  setSelectedPackage: (pkg: SubscriptionPackage | null) => void
  setFlowStep: (step: BillingState['flowStep']) => void
  setRegistrationData: (data: SppgRegistrationData | null) => void
  setPaymentData: (data: PaymentData | null) => void
  resetFlow: () => void
}

// ===== UTILITY TYPES =====
export interface PricingCalculation {
  basePrice: number
  quantity: number
  subtotal: number
  discount: number
  tax: number
  total: number
  billingCycle: BillingCycle
  discountPercentage: number
}