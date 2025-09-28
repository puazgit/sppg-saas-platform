/**
 * Payment Configuration and Method Definitions
 * Comprehensive payment method configuration for Indonesian market
 */

import { PaymentMethodOption, PaymentMethod } from '../types/payment';

export const PAYMENT_METHODS: Record<PaymentMethod, PaymentMethodOption> = {
  CREDIT_CARD: {
    id: 'CREDIT_CARD',
    name: 'Kartu Kredit',
    description: 'Visa, Mastercard, JCB, American Express',
    icon: '💳',
    enabled: true,
    processingTime: 'Instan',
    fees: {
      percentage: 2.9,
      fixed: 2000
    },
    supportedCurrencies: ['IDR', 'USD'],
    gateway: 'MIDTRANS'
  },
  
  DEBIT_CARD: {
    id: 'DEBIT_CARD',
    name: 'Kartu Debit',
    description: 'Kartu debit online dari bank Indonesia',
    icon: '💳',
    enabled: true,
    processingTime: 'Instan',
    fees: {
      percentage: 1.5,
      fixed: 1000
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MIDTRANS'
  },

  BANK_TRANSFER: {
    id: 'BANK_TRANSFER',
    name: 'Transfer Bank',
    description: 'Transfer manual ke rekening perusahaan',
    icon: '🏦',
    enabled: true,
    processingTime: '1-3 hari kerja',
    fees: {
      fixed: 0
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MANUAL'
  },

  VIRTUAL_ACCOUNT: {
    id: 'VIRTUAL_ACCOUNT',
    name: 'Virtual Account',
    description: 'BCA, BNI, BRI, Mandiri, Permata, CIMB',
    icon: '🏧',
    enabled: true,
    processingTime: 'Instan setelah transfer',
    fees: {
      fixed: 4000
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MIDTRANS'
  },

  E_WALLET: {
    id: 'E_WALLET',
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, LinkAja, ShopeePay',
    icon: '📱',
    enabled: true,
    processingTime: 'Instan',
    fees: {
      percentage: 1.5,
      max: 10000
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MIDTRANS'
  },

  QRIS: {
    id: 'QRIS',
    name: 'QRIS',
    description: 'Scan QR code dengan aplikasi bank atau e-wallet',
    icon: '📲',
    enabled: true,
    processingTime: 'Instan',
    fees: {
      percentage: 0.7,
      max: 5000
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MIDTRANS'
  },

  COD: {
    id: 'COD',
    name: 'Bayar di Tempat',
    description: 'Pembayaran saat kunjungan setup atau training',
    icon: '💵',
    enabled: true,
    processingTime: 'Saat kunjungan',
    fees: {
      fixed: 0
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MANUAL'
  },

  INVOICE: {
    id: 'INVOICE',
    name: 'Invoice/Tagihan',
    description: 'Pembayaran dengan invoice untuk institusi',
    icon: '📄',
    enabled: true,
    processingTime: 'Sesuai terms pembayaran',
    fees: {
      fixed: 0
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MANUAL'
  },

  INSTALLMENT: {
    id: 'INSTALLMENT',
    name: 'Cicilan',
    description: 'Pembayaran cicilan 3, 6, 12 bulan',
    icon: '📅',
    enabled: true,
    processingTime: 'Instan (per bulan)',
    fees: {
      percentage: 3.5,
      fixed: 5000
    },
    supportedCurrencies: ['IDR'],
    gateway: 'MIDTRANS'
  }
};

// DEPRECATED: Use /api/billing/payment/bank-accounts endpoint instead
// This hardcode data has been replaced by API-driven configuration
export const BANK_ACCOUNTS = {} as const // Empty - use API instead

// OLD HARDCODE DATA REMOVED - Now available via API endpoint
// /api/billing/payment/bank-accounts provides real account information

export const VIRTUAL_ACCOUNT_BANKS = [
  { code: 'BCA', name: 'BCA Virtual Account' },
  { code: 'BNI', name: 'BNI Virtual Account' },
  { code: 'BRI', name: 'BRI Virtual Account' },
  { code: 'MANDIRI', name: 'Mandiri Virtual Account' },
  { code: 'PERMATA', name: 'Permata Virtual Account' },
  { code: 'CIMB', name: 'CIMB Niaga Virtual Account' }
];

export const E_WALLET_PROVIDERS = [
  { code: 'GOPAY', name: 'GoPay', icon: '🟢' },
  { code: 'OVO', name: 'OVO', icon: '🟣' },
  { code: 'DANA', name: 'DANA', icon: '🔵' },
  { code: 'LINKAJA', name: 'LinkAja', icon: '🔴' },
  { code: 'SHOPEEPAY', name: 'ShopeePay', icon: '🟠' }
];

export const INSTALLMENT_OPTIONS = [
  { months: 3, interestRate: 0, description: 'Cicilan 3 bulan (tanpa bunga)' },
  { months: 6, interestRate: 2.5, description: 'Cicilan 6 bulan (2.5% per bulan)' },
  { months: 12, interestRate: 2.0, description: 'Cicilan 12 bulan (2.0% per bulan)' }
];

export const PAYMENT_GATEWAYS = {
  MIDTRANS: {
    name: 'Midtrans',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    apiUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true' 
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
  },
  XENDIT: {
    name: 'Xendit',
    secretKey: process.env.XENDIT_SECRET_KEY,
    publicKey: process.env.XENDIT_PUBLIC_KEY,
    callbackToken: process.env.XENDIT_CALLBACK_TOKEN,
    apiUrl: 'https://api.xendit.co'
  }
};

// Payment method grouping for UI
export const PAYMENT_METHOD_GROUPS = {
  INSTANT: {
    title: 'Pembayaran Instan',
    description: 'Langsung aktif setelah pembayaran berhasil',
    methods: ['CREDIT_CARD', 'DEBIT_CARD', 'E_WALLET', 'QRIS'] as PaymentMethod[]
  },
  BANK: {
    title: 'Transfer Bank',
    description: 'Transfer ke rekening bank atau virtual account',
    methods: ['VIRTUAL_ACCOUNT', 'BANK_TRANSFER'] as PaymentMethod[]
  },
  FLEXIBLE: {
    title: 'Pembayaran Fleksibel',
    description: 'Opsi pembayaran dengan terms khusus',
    methods: ['INSTALLMENT', 'INVOICE', 'COD'] as PaymentMethod[]
  }
};

// Calculate payment fees
export function calculatePaymentFee(method: PaymentMethod, amount: number): number {
  const paymentMethod = PAYMENT_METHODS[method];
  let fee = 0;

  if (paymentMethod.fees.fixed) {
    fee += paymentMethod.fees.fixed;
  }

  if (paymentMethod.fees.percentage) {
    fee += Math.round(amount * (paymentMethod.fees.percentage / 100));
  }

  if (paymentMethod.fees.min && fee < paymentMethod.fees.min) {
    fee = paymentMethod.fees.min;
  }

  if (paymentMethod.fees.max && fee > paymentMethod.fees.max) {
    fee = paymentMethod.fees.max;
  }

  return fee;
}

// Get enabled payment methods
export function getEnabledPaymentMethods(): PaymentMethodOption[] {
  return Object.values(PAYMENT_METHODS).filter(method => method.enabled);
}

// Get payment methods by group
export function getPaymentMethodsByGroup(groupKey: keyof typeof PAYMENT_METHOD_GROUPS): PaymentMethodOption[] {
  const group = PAYMENT_METHOD_GROUPS[groupKey];
  return group.methods
    .map(methodId => PAYMENT_METHODS[methodId])
    .filter(method => method.enabled);
}