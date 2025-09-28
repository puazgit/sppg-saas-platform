import { z } from 'zod'

// Subscription Tier Enum
export const subscriptionTierSchema = z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'])

// Subscription Tier Options
export const SUBSCRIPTION_TIERS = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PRO', label: 'Pro' },
  { value: 'ENTERPRISE', label: 'Enterprise' }
] as const

// Subscription Status Enum  
export const subscriptionStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED'])

// Subscription Base Schema
export const subscriptionSchema = z.object({
  id: z.string(),
  sppgId: z.string(),
  tier: subscriptionTierSchema,
  status: subscriptionStatusSchema,
  startDate: z.string(),
  endDate: z.string().nullable(),
  billingDate: z.string(),
  maxRecipients: z.number(),
  maxStaff: z.number(),
  maxDistributionPoints: z.number(),
  storageGb: z.number(),
  packageId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Relations
  sppg: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    status: z.string()
  }).optional(),
  package: z.object({
    id: z.string(),
    name: z.string(),
    tier: subscriptionTierSchema,
    monthlyPrice: z.number(),
    yearlyPrice: z.number()
  }).optional()
})

// Subscription Package Schema
export const subscriptionPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: subscriptionTierSchema,
  description: z.string().nullable(),
  monthlyPrice: z.number(),
  yearlyPrice: z.number(),
  maxRecipients: z.number(),
  maxStaff: z.number(),
  maxDistributionPoints: z.number(),
  storageGb: z.number(),
  features: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Subscription Analytics Schema
export const subscriptionAnalyticsSchema = z.object({
  totalSubscriptions: z.number(),
  activeSubscriptions: z.number(),
  expiredSubscriptions: z.number(),
  suspendedSubscriptions: z.number(),
  cancelledSubscriptions: z.number(),
  revenueThisMonth: z.number(),
  revenueLastMonth: z.number(),
  churnRate: z.number(),
  newSubscriptionsThisMonth: z.number(),
  distributionByTier: z.object({
    BASIC: z.number(),
    STANDARD: z.number(), 
    PRO: z.number(),
    ENTERPRISE: z.number()
  }),
  upcomingExpirations: z.number()
})

// Form Schemas
export const createSubscriptionFormSchema = z.object({
  sppgId: z.string().min(1, 'SPPG wajib dipilih'),
  packageId: z.string().optional(),
  tier: subscriptionTierSchema,
  startDate: z.date(),
  endDate: z.date(),
  autoRenew: z.boolean().default(false),
  status: subscriptionStatusSchema.default('ACTIVE'),
  maxUsers: z.number().optional(),
  maxSPPGs: z.number().optional(), 
  maxBeneficiaries: z.number().optional(),
  storageLimit: z.number().optional(),
  features: z.array(z.string()).default([]),
  customFeatures: z.record(z.any()).default({}),
  metadata: z.record(z.any()).default({})
})

export const updateSubscriptionFormSchema = z.object({
  tier: subscriptionTierSchema.optional(),
  status: subscriptionStatusSchema.optional(),
  packageId: z.string().optional(),
  billingDate: z.string().optional(),
  endDate: z.string().optional(),
  maxRecipients: z.number().optional(),
  maxStaff: z.number().optional(),
  maxDistributionPoints: z.number().optional(),
  storageGb: z.number().optional()
})

export const subscriptionFiltersSchema = z.object({
  status: subscriptionStatusSchema.optional(),
  tier: subscriptionTierSchema.optional(),
  search: z.string().optional(),
  expiringWithin: z.number().optional(), // days
  page: z.number().default(1),
  limit: z.number().default(20),
  sortBy: z.enum(['createdAt', 'endDate', 'sppgName', 'tier']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Types
export type Subscription = z.infer<typeof subscriptionSchema>
export type SubscriptionPackage = z.infer<typeof subscriptionPackageSchema>
export type SubscriptionAnalytics = z.infer<typeof subscriptionAnalyticsSchema>
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>
export type CreateSubscriptionForm = z.infer<typeof createSubscriptionFormSchema>
export type UpdateSubscriptionForm = z.infer<typeof updateSubscriptionFormSchema>
export type SubscriptionFilters = z.infer<typeof subscriptionFiltersSchema>