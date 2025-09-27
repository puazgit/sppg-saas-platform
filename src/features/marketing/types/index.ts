/**
 * SPPG Marketing Types - Strictly Based on Prisma Schema
 * All types derived from actual database models
 * No mock data, no hardcoded values - Real data only
 */

// ===== BASE TYPES FROM SCHEMA =====

/**
 * MarketingHeroFeature dari schema
 */
export interface HeroFeature {
  id: string
  title: string
  description: string
  icon: string
  category: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

/**
 * MarketingTrustIndicator dari schema
 */
export interface TrustIndicator {
  id: string
  label: string
  description: string
  icon: string
  metricType: 'COUNT' | 'PERCENTAGE' | 'RATING' | 'CURRENCY'
  staticValue?: string | null
  querySource?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

/**
 * MarketingCaseStudy dari schema
 */
export interface CaseStudy {
  id: string
  title: string
  clientName: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  metrics: Record<string, unknown> // JSON field
  testimonialQuote: string
  imageUrl?: string | null
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

/**
 * MarketingFeature dari schema
 */
export interface MarketingFeature {
  id: string
  title: string
  description: string
  icon: string
  category: string
  benefits: string[]
  availableIn: string[] // Package tiers
  isHighlight: boolean
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * MarketingTestimonial dari schema
 */
export interface Testimonial {
  id: string
  organizationName: string
  contactName: string
  position: string
  location: string
  organizationSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'
  content: string
  rating: number
  photoUrl?: string | null
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

// ===== COMPUTED/DERIVED TYPES =====

/**
 * Processed trust indicator dengan dynamic values
 */
export interface ProcessedTrustIndicator {
  id: string
  label: string
  value: string
  description: string
  icon: string
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

/**
 * Hero section data - aggregated dari multiple sources
 */
export interface HeroData {
  title: string
  subtitle: string
  description: string
  keyBenefits: string[]
  features: HeroFeature[]
  trustIndicators: ProcessedTrustIndicator[]
  stats: {
    sppgCount: number
    provinceCount: number
    totalStudents: number
    activeSchools: number
    totalMealsDistributed: number
    avgSatisfactionRating: number
    complianceScore: number
  }
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

/**
 * Loading states untuk UI
 */
export interface LoadingState {
  isLoading: boolean
  error: Error | null
  lastFetched?: Date
}

/**
 * Marketing metrics untuk analytics
 */
export interface MarketingMetrics {
  conversionRate: number
  leadCount: number
  demoRequests: number
  signupRate: number
  churnRate: number
  customerLifetimeValue: number
}

/**
 * Subscription Package dari schema (referensi)
 */
export interface SubscriptionPackage {
  id: string
  name: string
  displayName: string
  tier: 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE'
  monthlyPrice: number
  yearlyPrice: number
  setupFee: number
  description: string
  features: string[]
  limits: Record<string, unknown>
  isActive: boolean
  isPopular: boolean
  sortOrder: number
}

// ===== FORM & INTERACTION TYPES =====

/**
 * Demo request form
 */
export interface DemoRequest {
  organizationName: string
  contactName: string
  email: string
  phone: string
  organizationType: 'SPPG' | 'SCHOOL' | 'GOVERNMENT' | 'OTHER'
  expectedStudents: number
  message?: string
}

/**
 * Newsletter subscription
 */
export interface NewsletterSubscription {
  email: string
  interests: string[]
  organizationType?: string
}

/**
 * Contact form
 */
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  organizationType?: string
}

// ===== UTILITY TYPES =====

/**
 * Pagination untuk list views
 */
export interface Pagination {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Filter options untuk content
 */
export interface ContentFilters {
  category?: string
  industry?: string
  featured?: boolean
  published?: boolean
  sortBy?: 'date' | 'title' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

/**
 * SEO metadata
 */
export interface SEOData {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogImage?: string
  schema?: Record<string, unknown>
}

// ===== EXPORT ALL TYPES =====
// All types are already exported above with their declarations