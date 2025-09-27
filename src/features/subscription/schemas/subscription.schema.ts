/**
 * Subscription Feature - Zod Schemas
 * Validation schemas for all subscription-related data
 */

import { z } from 'zod'

// Enterprise Registration Data Schema - Full SPPG Model Compliance
export const registrationDataSchema = z.object({
  // Core SPPG Organization Data (Required)
  code: z.string()
    .min(3, 'Kode SPPG minimal 3 karakter')
    .max(20, 'Kode SPPG maksimal 20 karakter')
    .regex(/^[A-Z0-9-_]+$/, 'Kode hanya boleh huruf besar, angka, tanda hubung, dan underscore'),
  
  name: z.string()
    .min(5, 'Nama organisasi minimal 5 karakter')
    .max(255, 'Nama organisasi maksimal 255 karakter'),
  
  description: z.string()
    .min(20, 'Deskripsi minimal 20 karakter')
    .max(1000, 'Deskripsi maksimal 1000 karakter'),
  
  address: z.string()
    .min(15, 'Alamat lengkap minimal 15 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  
  phone: z.string()
    .regex(/^(\+62|62|0)[2-9][0-9]{7,11}$/, 'Format nomor telepon tidak valid (contoh: 021-12345678 atau 08123456789)'),
  
  email: z.string()
    .email('Format email tidak valid')
    .min(5, 'Email minimal 5 karakter')
    .max(100, 'Email maksimal 100 karakter'),

  // Person in Charge Information (Required for Enterprise)
  picName: z.string()
    .min(3, 'Nama PIC minimal 3 karakter')
    .max(100, 'Nama PIC maksimal 100 karakter'),
  
  picPosition: z.string()
    .min(3, 'Posisi PIC minimal 3 karakter')
    .max(100, 'Posisi PIC maksimal 100 karakter'),
  
  picEmail: z.string()
    .email('Format email PIC tidak valid')
    .max(100, 'Email PIC maksimal 100 karakter'),
  
  picPhone: z.string()
    .min(10, 'Nomor HP PIC minimal 10 digit')
    .max(15, 'Nomor HP PIC maksimal 15 digit')
    .regex(/^(\+?62|0)8[1-9][0-9]{7,11}$/, 'Format nomor HP tidak valid (contoh: 081234567890)'),
  
  picWhatsapp: z.string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Format nomor WhatsApp tidak valid')
    .optional(),

  // Organization Details (Enterprise Requirements)
  organizationType: z.enum(['PEMERINTAH', 'SWASTA', 'YAYASAN', 'KOMUNITAS', 'LAINNYA'], {
    message: 'Pilih jenis organisasi yang valid'
  }),
  
  establishedYear: z.number()
    .min(1945, 'Tahun berdiri minimal 1945')
    .max(new Date().getFullYear(), `Tahun berdiri maksimal ${new Date().getFullYear()}`)
    .optional(),

  // Operational Parameters (Enterprise-Grade)
  targetRecipients: z.number()
    .min(50, 'Target penerima minimal 50 orang')
    .max(100000, 'Target penerima maksimal 100,000 orang'),
  
  maxRadius: z.number()
    .min(0.5, 'Radius operasional minimal 0.5 km')
    .max(100, 'Radius operasional maksimal 100 km'),
  
  maxTravelTime: z.number()
    .min(5, 'Waktu tempuh maksimal minimal 5 menit')
    .max(300, 'Waktu tempuh maksimal 300 menit (5 jam)'),
  
  operationStartDate: z.string()
    .min(1, 'Tanggal mulai operasi wajib diisi')
    .refine((date) => {
      const parsedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      return !isNaN(parsedDate.getTime()) && parsedDate >= today
    }, 'Tanggal mulai operasi harus valid dan tidak boleh di masa lalu'),
  
  operationEndDate: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime())
    }, 'Format tanggal berakhir operasi tidak valid'),

  // Location Hierarchy (Indonesian Government Standard)
  provinceId: z.string().min(1, 'Provinsi wajib dipilih'),
  regencyId: z.string().min(1, 'Kabupaten/Kota wajib dipilih'),
  districtId: z.string().min(1, 'Kecamatan wajib dipilih'),
  villageId: z.string().min(1, 'Desa/Kelurahan wajib dipilih'),
  
  // Timezone & Business Hours (Enterprise Operations)
  timezone: z.string().default('Asia/Jakarta').optional(),
  businessHoursStart: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (HH:MM)')
    .default('06:00').optional(),
  businessHoursEnd: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (HH:MM)')
    .default('18:00').optional(),
  operationalDays: z.enum(['MONDAY_TO_FRIDAY', 'MONDAY_TO_SATURDAY', 'DAILY', 'CUSTOM'])
    .default('MONDAY_TO_FRIDAY').optional(),
  
  // Additional Enterprise Metadata
  city: z.string().min(2, 'Nama kota minimal 2 karakter').max(100, 'Nama kota maksimal 100 karakter'),
  postalCode: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit angka')
}).refine((data) => {
  // Cross-field validation
  if (data.operationEndDate) {
    const startDate = new Date(data.operationStartDate)
    const endDate = new Date(data.operationEndDate)
    return endDate > startDate
  }
  return true
}, {
  message: 'Tanggal berakhir operasi harus setelah tanggal mulai operasi',
  path: ['operationEndDate']
}).refine((data) => {
  // Business hours validation
  if (data.businessHoursStart && data.businessHoursEnd) {
    const [startHour, startMin] = data.businessHoursStart.split(':').map(Number)
    const [endHour, endMin] = data.businessHoursEnd.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  }
  return true
}, {
  message: 'Jam operasional berakhir harus setelah jam mulai',
  path: ['businessHoursEnd']
})

// Payment Data Schema
export const paymentDataSchema = z.object({
  method: z.enum([
    'CREDIT_CARD', 
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'VIRTUAL_ACCOUNT',
    'E_WALLET',
    'QRIS',
    'COD',
    'INVOICE',
    'INSTALLMENT'
  ]),
  amount: z.number().min(1, 'Jumlah pembayaran harus lebih dari 0'),
  currency: z.string().default('IDR'),
  gateway: z.enum(['MIDTRANS', 'XENDIT', 'GOPAY', 'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY', 'MANUAL']).optional(),
  
  // Credit Card Details (conditional)
  creditCard: z.object({
    cardNumber: z.string().regex(/^\d{13,19}$/, 'Nomor kartu tidak valid'),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number().min(new Date().getFullYear()),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV tidak valid'),
    holderName: z.string().min(2, 'Nama pemegang kartu minimal 2 karakter')
  }).optional(),
  
  // Bank Transfer Details
  bankTransfer: z.object({
    bankCode: z.string(),
    bankName: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    branch: z.string().optional()
  }).optional(),
  
  // Virtual Account Details
  virtualAccount: z.object({
    provider: z.string(),
    accountNumber: z.string(),
    expiredAt: z.date()
  }).optional(),
  
  // E-Wallet Details
  eWallet: z.object({
    provider: z.enum(['GOPAY', 'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY']),
    phoneNumber: z.string().optional(),
    redirectUrl: z.string().optional()
  }).optional(),
  
  // Installment Details
  installmentPlan: z.object({
    months: z.number().refine((val) => [3, 6, 12].includes(val), 'Pilihan cicilan: 3, 6, atau 12 bulan'),
    interestRate: z.number().min(0).max(100),
    monthlyAmount: z.number().min(1)
  }).optional(),
  
  // Billing Address
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string().regex(/^\d{5}$/),
    country: z.string().default('Indonesia')
  }).optional(),
  
  // Invoice Details
  invoiceDetails: z.object({
    dueDate: z.date(),
    terms: z.string(),
    notes: z.string().optional()
  }).optional()
})

// Subscription Package Schema
export const subscriptionPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']),
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  setupFee: z.number().min(0).default(0),
  maxRecipients: z.number().min(1),
  maxStaff: z.number().min(1),
  maxDistributionPoints: z.number().min(1),
  maxMenusPerMonth: z.number().min(1).optional(),
  storageGb: z.number().min(1),
  maxReportsPerMonth: z.number().min(1).optional(),
  hasAdvancedReporting: z.boolean().default(false),
  hasNutritionAnalysis: z.boolean().default(false),
  hasCostCalculation: z.boolean().default(false),
  hasQualityControl: z.boolean().default(false),
  hasAPIAccess: z.boolean().default(false),
  hasCustomBranding: z.boolean().default(false),
  hasPrioritySupport: z.boolean().default(false),
  hasTrainingIncluded: z.boolean().default(false),
  supportLevel: z.string(),
  responseTimeSLA: z.string().optional(),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  isCustom: z.boolean().default(false),
  highlightFeatures: z.array(z.string()).default([]),
  targetMarket: z.string().optional(),
  features: z.array(z.string()).default([])
})

// API Request/Response Schemas
export const createSppgRequestSchema = z.object({
  registrationData: registrationDataSchema,
  packageId: z.string(),
  paymentData: paymentDataSchema
})

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export const validationResponseSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string()
  }))
})

// Type inference from schemas
// Enterprise Registration Data Type
export type RegistrationData = z.infer<typeof registrationDataSchema>

// Extended type for API compatibility
export interface EnterpriseRegistrationData extends RegistrationData {
  // Additional computed fields
  weekendDays?: number[]
  status?: 'PENDING_APPROVAL' | 'ACTIVE'
  
  // Metadata for processing
  submissionTimestamp?: Date
  validationLevel?: 'BASIC' | 'STANDARD' | 'ENTERPRISE'
  complianceScore?: number
}
export type PaymentData = z.infer<typeof paymentDataSchema>
export type SubscriptionPackage = z.infer<typeof subscriptionPackageSchema>
export type CreateSppgRequest = z.infer<typeof createSppgRequestSchema>
export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & { data?: T }
export type ValidationResponse = z.infer<typeof validationResponseSchema>