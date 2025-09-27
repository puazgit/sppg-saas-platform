/**
 * Payment Types and Interfaces
 * Comprehensive payment system with multiple payment methods
 */

export type PaymentMethod = 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'VIRTUAL_ACCOUNT'
  | 'E_WALLET'
  | 'QRIS'
  | 'COD'
  | 'INVOICE'
  | 'INSTALLMENT';

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export type PaymentGateway = 
  | 'MIDTRANS'
  | 'XENDIT'
  | 'GOPAY'
  | 'OVO'
  | 'DANA'
  | 'LINKAJA'
  | 'SHOPEEPAY'
  | 'MANUAL';

export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  processingTime: string;
  fees: {
    fixed?: number;
    percentage?: number;
    min?: number;
    max?: number;
  };
  supportedCurrencies: string[];
  gateway?: PaymentGateway;
}

export interface BankAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
}

export interface VirtualAccountDetails {
  provider: string;
  accountNumber: string;
  expiredAt: Date;
}

export interface CreditCardDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
}

export interface EWalletDetails {
  provider: PaymentGateway;
  phoneNumber?: string;
  redirectUrl?: string;
}

export interface PaymentData {
  method: PaymentMethod;
  gateway?: PaymentGateway;
  amount: number;
  currency: string;
  
  // Method specific data
  creditCard?: CreditCardDetails;
  bankTransfer?: BankAccount;
  virtualAccount?: VirtualAccountDetails;
  eWallet?: EWalletDetails;
  
  // Additional options
  installmentPlan?: {
    months: number;
    interestRate: number;
    monthlyAmount: number;
  };
  
  // Billing information
  billingAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  
  // Invoice details (for manual/invoice payments)
  invoiceDetails?: {
    dueDate: Date;
    terms: string;
    notes?: string;
  };
}

export interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  gateway?: PaymentGateway;
  status: PaymentStatus;
  
  // Transaction details
  transactionId?: string;
  gatewayTransactionId?: string;
  paymentUrl?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  expiredAt?: Date;
  
  // Additional data
  paymentData: PaymentData;
  metadata?: Record<string, unknown>;
  
  // Error handling
  failureReason?: string;
  retryCount?: number;
}

export interface PaymentCalculation {
  subtotal: number;
  tax: number;
  fees: number;
  discount: number;
  total: number;
  currency: string;
  
  // Breakdown
  breakdown: {
    packagePrice: number;
    setupFee?: number;
    paymentFee: number;
    taxAmount: number;
    discountAmount: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  paymentUrl?: string;
  
  // For different payment methods
  virtualAccount?: VirtualAccountDetails;
  qrCode?: string;
  instructions?: string[];
  
  // Error handling
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaymentValidation {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}