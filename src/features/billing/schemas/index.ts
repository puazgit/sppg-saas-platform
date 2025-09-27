/**
 * SPPG Billing Zod Schemas
 * Validation schemas untuk billing feature
 */

import { z } from 'zod'

// ===== SPPG REGISTRATION SCHEMAS =====
export const SppgRegistrationSchema = z.object({
  // Data SPPG
  sppgName: z.string().min(3, 'Nama SPPG minimal 3 karakter').max(100, 'Nama SPPG maksimal 100 karakter'),
  sppgType: z.enum(['SEKOLAH', 'PUSKESMAS', 'POSYANDU', 'NGO'], {
    message: 'Jenis organisasi harus dipilih'
  }),
  address: z.string().min(10, 'Alamat minimal 10 karakter').max(200, 'Alamat maksimal 200 karakter'),
  city: z.string().min(2, 'Nama kota minimal 2 karakter').max(50, 'Nama kota maksimal 50 karakter'),
  province: z.string().min(2, 'Nama provinsi minimal 2 karakter').max(50, 'Nama provinsi maksimal 50 karakter'),
  postalCode: z.string().min(5, 'Kode pos minimal 5 digit').max(10, 'Kode pos maksimal 10 digit'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').max(15, 'Nomor telepon maksimal 15 digit'),
  email: z.string().email('Format email tidak valid'),
  
  // Data PIC
  picName: z.string().min(3, 'Nama PIC minimal 3 karakter').max(50, 'Nama PIC maksimal 50 karakter'),
  picPosition: z.string().min(3, 'Jabatan PIC minimal 3 karakter').max(50, 'Jabatan PIC maksimal 50 karakter'),
  picPhone: z.string().min(10, 'Nomor telepon PIC minimal 10 digit').max(15, 'Nomor telepon PIC maksimal 15 digit'),
  picEmail: z.string().email('Format email PIC tidak valid'),
  
  // Data Operasional
  estimatedRecipients: z.number().int().min(1, 'Jumlah penerima minimal 1').max(10000, 'Jumlah penerima maksimal 10.000'),
  currentStaff: z.number().int().min(1, 'Jumlah staff minimal 1').max(100, 'Jumlah staff maksimal 100'),
  hasExistingSystem: z.boolean(),
  needsTraining: z.boolean(),
})

export const PaymentDataSchema = z.object({
  paymentMethod: z.enum(['BANK_TRANSFER', 'CREDIT_CARD', 'VIRTUAL_ACCOUNT'], {
    message: 'Metode pembayaran harus dipilih'
  }),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY'], {
    message: 'Siklus pembayaran harus dipilih'
  }),
})

export const SubscriptionFlowSchema = z.object({
  selectedPackage: z.object({
    id: z.string().cuid('Package ID tidak valid'),
    name: z.string(),
    displayName: z.string(),
    tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']),
    monthlyPrice: z.number().min(0),
  }),
  sppgData: SppgRegistrationSchema,
  paymentData: PaymentDataSchema,
})

// ===== API REQUEST SCHEMAS =====
export const CreateSubscriptionRequestSchema = z.object({
  packageId: z.string().cuid('Package ID tidak valid'),
  sppgData: SppgRegistrationSchema,
  paymentData: PaymentDataSchema,
})

export const UpdateSubscriptionSchema = z.object({
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']).optional(),
  maxRecipients: z.number().int().min(1).optional(),
  maxStaff: z.number().int().min(1).optional(),
  maxDistributionPoints: z.number().int().min(1).optional(),
  storageGb: z.number().int().min(1).optional(),
})

// ===== INVOICE SCHEMAS =====
export const CreateInvoiceSchema = z.object({
  sppgId: z.string().cuid('SPPG ID tidak valid'),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Format period harus YYYY-MM'),
  baseAmount: z.number().min(0, 'Base amount harus positif'),
  tax: z.number().min(0, 'Tax harus positif').default(0),
  discount: z.number().min(0, 'Discount harus positif').default(0),
  dueDate: z.date(),
})

export const PayInvoiceSchema = z.object({
  invoiceId: z.string().cuid('Invoice ID tidak valid'),
  paymentMethod: z.string().min(1, 'Metode pembayaran harus diisi'),
  paymentReference: z.string().min(1, 'Referensi pembayaran harus diisi'),
  paymentNotes: z.string().optional(),
})

// ===== RESPONSE SCHEMAS =====
export const SubscriptionPackageSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']),
  monthlyPrice: z.number(),
  yearlyPrice: z.number().nullable(),
  setupFee: z.number(),
  maxRecipients: z.number().int(),
  maxStaff: z.number().int(),
  maxDistributionPoints: z.number().int(),
  maxMenusPerMonth: z.number().int(),
  storageGb: z.number().int(),
  maxReportsPerMonth: z.number().int(),
  hasAdvancedReporting: z.boolean(),
  hasNutritionAnalysis: z.boolean(),
  hasCostCalculation: z.boolean(),
  hasQualityControl: z.boolean(),
  hasAPIAccess: z.boolean(),
  hasCustomBranding: z.boolean(),
  hasPrioritySupport: z.boolean(),
  hasTrainingIncluded: z.boolean(),
  supportLevel: z.string(),
  responseTimeSLA: z.string().nullable(),
  isActive: z.boolean(),
  isPopular: z.boolean(),
  highlightFeatures: z.array(z.string()),
  targetMarket: z.string().nullable(),
})

export const SubscriptionSchema = z.object({
  id: z.string().cuid(),
  sppgId: z.string().cuid(),
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']),
  status: z.enum(['TRIAL', 'ACTIVE', 'OVERDUE', 'CANCELLED', 'PAUSED', 'UPGRADE_PENDING']),
  startDate: z.date(),
  endDate: z.date().nullable(),
  billingDate: z.date(),
  maxRecipients: z.number().int(),
  maxStaff: z.number().int(),
  maxDistributionPoints: z.number().int(),
  storageGb: z.number().int(),
  packageId: z.string().cuid().nullable(),
  package: SubscriptionPackageSchema.optional(),
})

export const InvoiceSchema = z.object({
  id: z.string().cuid(),
  sppgId: z.string().cuid(),
  invoiceNumber: z.string(),
  period: z.string(),
  baseAmount: z.number(),
  tax: z.number(),
  discount: z.number(),
  totalAmount: z.number(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']),
  invoiceDate: z.date(),
  dueDate: z.date(),
  paidDate: z.date().nullable(),
  paymentMethod: z.string().nullable(),
  paymentReference: z.string().nullable(),
  paymentNotes: z.string().nullable(),
})

// ===== VALIDATION FUNCTIONS =====
export const validateSppgRegistration = (data: unknown) => {
  return SppgRegistrationSchema.safeParse(data)
}

export const validatePaymentData = (data: unknown) => {
  return PaymentDataSchema.safeParse(data)
}

export const validateSubscriptionFlow = (data: unknown) => {
  return SubscriptionFlowSchema.safeParse(data)
}

export const validateCreateSubscriptionRequest = (data: unknown) => {
  return CreateSubscriptionRequestSchema.safeParse(data)
}

// ===== TYPE EXPORTS =====
export type SppgRegistrationInput = z.infer<typeof SppgRegistrationSchema>
export type PaymentDataInput = z.infer<typeof PaymentDataSchema>
export type SubscriptionFlowInput = z.infer<typeof SubscriptionFlowSchema>
export type CreateSubscriptionRequestInput = z.infer<typeof CreateSubscriptionRequestSchema>
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>
export type PayInvoiceInput = z.infer<typeof PayInvoiceSchema>