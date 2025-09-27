/**
 * SPPG Marketing Validation Schemas
 * Zod schemas for type-safe validation and API contracts
 * Enterprise-grade validation with comprehensive error handling
 */

import { z } from 'zod'

// ===== BASE VALIDATION SCHEMAS =====

/**
 * Hero Feature Schema (dari MarketingHeroFeature - full database schema)
 */
const HeroFeatureSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.enum(['SECURITY', 'AUTOMATION', 'ANALYTICS', 'IMPLEMENTATION', 'GENERAL']),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Processed Hero Feature Schema (untuk API response)
 */
const ProcessedHeroFeatureSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.enum(['SECURITY', 'AUTOMATION', 'ANALYTICS', 'IMPLEMENTATION', 'GENERAL']),
})

/**
 * Trust Indicator Schema (dari MarketingTrustIndicator)
 */
const TrustIndicatorSchema = z.object({
  id: z.string().cuid(),
  label: z.string().min(1, 'Label is required').max(100, 'Label too long'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  icon: z.string().min(1, 'Icon is required'),
  metricType: z.enum(['COUNT', 'PERCENTAGE', 'RATING', 'CURRENCY']),
  staticValue: z.string().optional().nullable(),
  querySource: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Processed Trust Indicator Schema (untuk API response)
 */
const ProcessedTrustIndicatorSchema = z.object({
  id: z.string().cuid(),
  label: z.string(),
  value: z.string(),
  description: z.string(),
  trend: z.object({
    direction: z.enum(['up', 'down', 'stable']),
    percentage: z.number(),
  }).optional(),
})

/**
 * Hero Data Schema (untuk API response)
 */
const HeroDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  keyBenefits: z.array(z.string()).min(1, 'At least one benefit required'),
  features: z.array(ProcessedHeroFeatureSchema),
  trustIndicators: z.array(ProcessedTrustIndicatorSchema),
  stats: z.object({
    sppgCount: z.number().int().min(0),
    provinceCount: z.number().int().min(0),
    totalStudents: z.number().int().min(0),
    activeSchools: z.number().int().min(0),
    totalMealsDistributed: z.number().int().min(0),
    avgSatisfactionRating: z.number().min(0).max(5),
    complianceScore: z.number().int().min(0).max(100),
  }),
  complianceBadges: z.array(z.string()).optional(),
  trustedBy: z.array(z.string()).optional(),
})

/**
 * Case Study Schema (dari MarketingCaseStudy)
 */
const CaseStudySchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  clientName: z.string().min(1, 'Client name is required').max(100, 'Client name too long'),
  industry: z.string().min(1, 'Industry is required').max(50, 'Industry too long'),
  challenge: z.string().min(1, 'Challenge is required'),
  solution: z.string().min(1, 'Solution is required'),
  results: z.array(z.string()).min(1, 'At least one result required'),
  metrics: z.record(z.string(), z.unknown()),
  testimonialQuote: z.string().min(1, 'Testimonial quote is required'),
  imageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional().nullable(),
})

/**
 * Marketing Feature Schema (dari MarketingFeature)
 */
const MarketingFeatureSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.string().min(1, 'Category is required'),
  benefits: z.array(z.string()),
  availableIn: z.array(z.string()),
  isHighlight: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Testimonial Schema (dari MarketingTestimonial)
 */
const TestimonialSchema = z.object({
  id: z.string().cuid(),
  organizationName: z.string().min(1, 'Organization name is required').max(100, 'Organization name too long'),
  contactName: z.string().min(1, 'Contact name is required').max(100, 'Contact name too long'),
  position: z.string().min(1, 'Position is required').max(100, 'Position too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  organizationSize: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
  content: z.string().min(1, 'Content is required').max(1000, 'Content too long'),
  rating: z.number().int().min(1).max(5).default(5),
  photoUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// ===== FORM VALIDATION SCHEMAS =====

/**
 * Demo Request Form Schema
 */
const DemoRequestSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required').max(100, 'Organization name too long'),
  contactName: z.string().min(1, 'Contact name is required').max(100, 'Contact name too long'),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long'),
  organizationType: z.enum(['SPPG', 'SCHOOL', 'GOVERNMENT', 'OTHER']),
  expectedStudents: z.number().int().min(1, 'Expected students must be at least 1').max(50000, 'Expected students too high'),
  message: z.string().max(1000, 'Message too long').optional(),
})

/**
 * Newsletter Subscription Schema
 */
const NewsletterSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  interests: z.array(z.string()).min(1, 'At least one interest required'),
  organizationType: z.string().optional(),
})

/**
 * Contact Form Schema
 */
const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  organizationType: z.string().optional(),
})

// ===== API VALIDATION SCHEMAS =====

/**
 * API Response Schema
 */
const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  })

/**
 * Pagination Schema
 */
const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  total: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

/**
 * Content Filters Schema
 */
const ContentFiltersSchema = z.object({
  category: z.string().optional(),
  industry: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortBy: z.enum(['date', 'title', 'popularity']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ===== UTILITY VALIDATION FUNCTIONS =====

/**
 * Validate hero data with comprehensive error handling
 */
export const validateHeroData = (data: unknown) => {
  try {
    return {
      success: true,
      data: HeroDataSchema.parse(data),
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      }
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

/**
 * Validate demo request with sanitization
 */
export const validateDemoRequest = (data: unknown) => {
  try {
    const sanitized = DemoRequestSchema.parse(data)
    return {
      success: true,
      data: {
        ...sanitized,
        // Sanitize phone number
        phone: sanitized.phone.replace(/\D/g, ''),
        // Trim whitespace
        organizationName: sanitized.organizationName.trim(),
        contactName: sanitized.contactName.trim(),
        email: sanitized.email.toLowerCase().trim(),
        message: sanitized.message?.trim(),
      },
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      }
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

// ===== EXPORT SCHEMAS =====
export {
  HeroFeatureSchema,
  TrustIndicatorSchema,
  ProcessedTrustIndicatorSchema,
  HeroDataSchema,
  CaseStudySchema,
  MarketingFeatureSchema,
  TestimonialSchema,
  DemoRequestSchema,
  NewsletterSubscriptionSchema,
  ContactFormSchema,
  ApiResponseSchema,
  PaginationSchema,
  ContentFiltersSchema,
}