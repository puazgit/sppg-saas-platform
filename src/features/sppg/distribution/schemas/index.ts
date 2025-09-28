import { z } from 'zod'

// Distribution Point Schema
export const distributionPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'SCHOOL',
    'POSYANDU', 
    'COMMUNITY_CENTER',
    'MOSQUE',
    'CHURCH',
    'GOVERNMENT_OFFICE',
    'OTHERS'
  ]),
  address: z.string(),
  location: z.string(),
  capacity: z.number(),
  currentRecipients: z.number(),
  isActive: z.boolean(),
  contactPerson: z.string(),
  contactPhone: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  createdAt: z.string()
})

// Distribution Log Schema
export const distributionLogSchema = z.object({
  id: z.string(),
  distributionPointId: z.string(),
  distributionPointName: z.string(),
  date: z.string(),
  status: z.enum(['SCHEDULED', 'IN_TRANSIT', 'DISTRIBUTING', 'COMPLETED', 'DELAYED', 'CANCELLED']),
  scheduledTime: z.string(),
  actualStartTime: z.string().optional(),
  actualEndTime: z.string().optional(),
  plannedRecipients: z.number(),
  actualRecipients: z.number(),
  vehicleUsed: z.string().optional(),
  fuelCost: z.number().optional(),
  notes: z.string().optional(),
  weatherCondition: z.enum(['SUNNY', 'CLOUDY', 'RAINY', 'STORMY']).optional(),
  createdAt: z.string()
})

// Beneficiary Schema
export const beneficiarySchema = z.object({
  id: z.string(),
  name: z.string(),
  idNumber: z.string(),
  category: z.enum([
    'STUDENT',
    'ELDERLY',
    'PREGNANT_MOTHER',
    'TODDLER',
    'DISABLED',
    'POOR_FAMILY',
    'OTHERS'
  ]),
  age: z.number().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  address: z.string(),
  phone: z.string().optional(),
  distributionPointId: z.string(),
  registrationDate: z.string(),
  isActive: z.boolean(),
  specialNeeds: z.array(z.enum([
    'DIABETIC',
    'HYPERTENSION', 
    'FOOD_ALLERGY',
    'VEGETARIAN',
    'SOFT_FOOD',
    'LOW_SALT',
    'LOW_SUGAR'
  ])).optional(),
  lastDistribution: z.string().optional(),
  totalReceived: z.number()
})

// Distribution Stats Schema
export const distributionStatsSchema = z.object({
  todayDistributions: z.number(),
  completedDistributions: z.number(),
  pendingDistributions: z.number(),
  totalRecipients: z.number(),
  totalPortionsDistributed: z.number(),
  averageDeliveryTime: z.number(),
  onTimeDeliveryRate: z.number(),
  beneficiarySatisfaction: z.number()
})

// Form Schemas
export const createDistributionPointSchema = z.object({
  name: z.string().min(1, 'Nama titik distribusi harus diisi'),
  type: z.enum([
    'SCHOOL',
    'POSYANDU', 
    'COMMUNITY_CENTER',
    'MOSQUE',
    'CHURCH',
    'GOVERNMENT_OFFICE',
    'OTHERS'
  ]),
  address: z.string().min(1, 'Alamat harus diisi'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  capacity: z.number().min(1, 'Kapasitas harus lebih dari 0'),
  contactPerson: z.string().min(1, 'Nama PIC harus diisi'),
  contactPhone: z.string().min(1, 'Nomor telepon harus diisi'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

export const createBeneficiarySchema = z.object({
  name: z.string().min(1, 'Nama penerima manfaat harus diisi'),
  idNumber: z.string().min(1, 'Nomor identitas harus diisi'),
  category: z.enum([
    'STUDENT',
    'ELDERLY',
    'PREGNANT_MOTHER',
    'TODDLER',
    'DISABLED',
    'POOR_FAMILY',
    'OTHERS'
  ]),
  age: z.number().min(0).max(150).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  address: z.string().min(1, 'Alamat harus diisi'),
  phone: z.string().optional(),
  distributionPointId: z.string().min(1, 'Titik distribusi harus dipilih'),
  specialNeeds: z.array(z.enum([
    'DIABETIC',
    'HYPERTENSION', 
    'FOOD_ALLERGY',
    'VEGETARIAN',
    'SOFT_FOOD',
    'LOW_SALT',
    'LOW_SUGAR'
  ])).optional()
})

export const startDistributionSchema = z.object({
  distributionPointId: z.string(),
  vehicleUsed: z.string().optional(),
  staffIds: z.array(z.string()),
  notes: z.string().optional()
})

export const completeDistributionSchema = z.object({
  distributionLogId: z.string(),
  actualRecipients: z.number().min(0),
  fuelCost: z.number().min(0).optional(),
  weatherCondition: z.enum(['SUNNY', 'CLOUDY', 'RAINY', 'STORMY']).optional(),
  notes: z.string().optional()
})

// Exported Types
export type DistributionPoint = z.infer<typeof distributionPointSchema>
export type DistributionLog = z.infer<typeof distributionLogSchema>
export type Beneficiary = z.infer<typeof beneficiarySchema>
export type DistributionStats = z.infer<typeof distributionStatsSchema>

export type CreateDistributionPointForm = z.infer<typeof createDistributionPointSchema>
export type CreateBeneficiaryForm = z.infer<typeof createBeneficiarySchema>
export type StartDistributionForm = z.infer<typeof startDistributionSchema>
export type CompleteDistributionForm = z.infer<typeof completeDistributionSchema>