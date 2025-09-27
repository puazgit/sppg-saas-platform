/**
 * Subscription Feature - Barrel Exports
 * Clean exports for external consumption
 */

// Primary Types (from schemas - preferred source)
export type { 
  RegistrationData, 
  PaymentData as SchemaPaymentData,
  SubscriptionPackage,
  ApiResponse,
  ValidationResponse,
  CreateSppgRequest
} from './schemas/subscription.schema'

// Payment Types
export type {
  PaymentMethod,
  PaymentStatus,
  PaymentGateway,
  PaymentTransaction,
  PaymentResponse,
  PaymentCalculation,
  PaymentValidation,
  CreditCardDetails,
  VirtualAccountDetails,
  EWalletDetails,
  BankAccount
} from './types/payment'

// Success Types  
export type {
  SuccessData,
  OnboardingStep,
  WelcomeNotification,
  SuccessMetrics,
  SuccessPageSection
} from './types/success'

// Store and State Management
export {
  useSubscriptionStore,
  useCurrentStep,
  useSelectedPackage,
  useRegistrationData,
  usePaymentData,
  useSubscriptionLoading,
  useSubscriptionError,
  useValidationErrors,
  useCompletedSteps,
  useIsDraft,
  useLastSaved,
  useIsStepCompleted,
  useHasErrors,
  useFieldErrors,
  useProgressPercentage,
  useIsPackageSelected,
  useIsRegistrationComplete,
  useIsPaymentSelected,
  useSubscriptionActions
} from './store/subscription.store'

// Hooks
export {
  useSubscriptionPackages,
  usePackagePricing,
  useRegistrationValidation,
  useCreateSppgSubscription,
  useFormValidation,
  useSubscriptionNavigation,
  useAutoSave,
  useSubscriptionProgress,
  useSubscriptionErrorHandling
} from './hooks/use-subscription'

// Services
export { PaymentService } from './services/payment-service'
export { SubscriptionAPI } from './services/subscription-api'
export { SuccessService } from './services/success-service'

// Configuration
export {
  PAYMENT_METHODS,
  PAYMENT_METHOD_GROUPS,
  BANK_ACCOUNTS,
  VIRTUAL_ACCOUNT_BANKS,
  E_WALLET_PROVIDERS,
  INSTALLMENT_OPTIONS,
  calculatePaymentFee,
  getEnabledPaymentMethods,
  getPaymentMethodsByGroup
} from './config/payment-methods'

// Components
// Core flow components  
export { PackageSelectionStep } from './components/package-selection-step'
export { RegistrationFormStep } from './components/registration-form-step'
export { ConfirmationStep } from './components/confirmation-step'
export { default as PaymentMethodStep } from './components/payment-method-step'
export { default as PaymentProcessingStep } from './components/payment-processing-step'
export { default as SuccessStep } from './components/success-step'

// Standalone components
export { PackageSelector } from './components/package-selector'

// Schemas for validation
export {
  registrationDataSchema,
  paymentDataSchema,
  subscriptionPackageSchema,
  createSppgRequestSchema,
  apiResponseSchema,
  validationResponseSchema
} from './schemas/subscription.schema'

// Utility Functions
export {
  calculateTotalCost,
  validateSppgCode,
  formatPhoneNumber,
  validateEmail,
  calculateRegistrationCompleteness,
  generateSppgReference,
  formatCurrency,
  formatDate,
  comparePlan,
  validateOperationalDates,
  calculateServiceCoverage
} from './lib/utils'