export interface SubscriptionPackage {
  id: string
  name: string
  displayName: string
  description: string
  tier: 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE'
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
  responseTimeSLA?: string | null
  isActive: boolean
  isPopular: boolean
  isCustom: boolean
  highlightFeatures: string[]
  targetMarket?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface RegistrationData {
  organizationName: string
  address: string
  phone: string
  email: string
  pic: {
    name: string
    email: string
    phone: string
    position: string
  }
  legalDocuments: {
    npwp: string
    businessLicense: string
    operationalLicense: string
  }
  billingCycle: 'MONTHLY' | 'ANNUAL'
}

export interface PaymentResult {
  subscriptionId: string
  paymentUrl: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError extends Error {
  statusCode: number
  code: string
  details?: ValidationError[]
}

/**
 * Enterprise-grade Subscription API Service
 * Handles all subscription-related API calls with comprehensive error handling,
 * type safety, and proper logging for production environments.
 */
export class SubscriptionAPI {
  private static readonly baseUrl = '/api'
  private static readonly timeout = 30000 // 30 seconds for enterprise reliability
  
  /**
   * Creates a standardized API error with proper context
   */
  private static createApiError(
    message: string, 
    statusCode: number, 
    code: string, 
    details?: ValidationError[]
  ): ApiError {
    const error = new Error(message) as ApiError
    error.statusCode = statusCode
    error.code = code
    error.details = details
    error.name = 'ApiError'
    return error
  }

  /**
   * Makes HTTP requests with enterprise-grade error handling and timeout
   */
  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      const result = await response.json() as ApiResponse<T>

      if (!response.ok) {
        throw this.createApiError(
          result.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          result.error || 'HTTP_ERROR',
          result.data as ValidationError[]
        )
      }

      if (!result.success) {
        throw this.createApiError(
          result.error || 'API returned unsuccessful response',
          response.status,
          'API_ERROR'
        )
      }

      return result
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw this.createApiError('Request timeout', 408, 'TIMEOUT')
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw this.createApiError('Network error', 0, 'NETWORK_ERROR')
      }

      throw error
    }
  }

  /**
   * Get all active subscription packages from the database
   * Returns enterprise-ready packages with all metadata
   */
  static async getPackages(): Promise<SubscriptionPackage[]> {
    try {
      const result = await this.makeRequest<SubscriptionPackage[]>('/api/billing/packages')
      
      if (!result.data || !Array.isArray(result.data)) {
        throw this.createApiError('Invalid packages data format', 500, 'INVALID_DATA')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Failed to fetch packages:', error)
      throw error
    }
  }

  /**
   * Register new organization subscription with comprehensive validation
   */
  static async registerSubscription(
    packageId: string,
    registrationData: RegistrationData
  ): Promise<PaymentResult> {
    try {
      // Validate required fields
      if (!packageId || !registrationData.organizationName || !registrationData.email) {
        throw this.createApiError(
          'Missing required registration data',
          400,
          'VALIDATION_ERROR'
        )
      }

      const result = await this.makeRequest<PaymentResult>(`${this.baseUrl}/subscription/register`, {
        method: 'POST',
        body: JSON.stringify({
          packageId,
          ...registrationData,
        }),
      })

      if (!result.data) {
        throw this.createApiError('Invalid registration response', 500, 'INVALID_RESPONSE')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Registration failed:', error)
      throw error
    }
  }

  /**
   * Confirm subscription after successful payment
   */
  static async confirmSubscription(subscriptionId: string): Promise<{
    success: boolean
    organizationSlug: string
    redirectUrl: string
  }> {
    try {
      if (!subscriptionId) {
        throw this.createApiError('Subscription ID is required', 400, 'MISSING_ID')
      }

      const result = await this.makeRequest<{
        success: boolean
        organizationSlug: string
        redirectUrl: string
      }>(`${this.baseUrl}/subscription/confirm`, {
        method: 'POST',
        body: JSON.stringify({ subscriptionId }),
      })

      if (!result.data) {
        throw this.createApiError('Invalid confirmation response', 500, 'INVALID_RESPONSE')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Confirmation failed:', error)
      throw error
    }
  }

  /**
   * Check payment status with retry logic for enterprise reliability
   */
  static async checkPaymentStatus(
    subscriptionId: string,
    retries = 3
  ): Promise<{
    status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
    paymentUrl?: string
    paidAt?: string
  }> {
    try {
      if (!subscriptionId) {
        throw this.createApiError('Subscription ID is required', 400, 'MISSING_ID')
      }

      const result = await this.makeRequest<{
        status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
        paymentUrl?: string
        paidAt?: string
      }>(`${this.baseUrl}/billing/payment/status?subscriptionId=${subscriptionId}`)

      return result.data || { status: 'PENDING' }
    } catch (error) {
      console.error('[SubscriptionAPI] Payment status check failed:', error)
      
      // Retry logic for enterprise reliability
      if (retries > 0 && (error as ApiError).statusCode >= 500) {
        console.warn(`[SubscriptionAPI] Retrying payment status check. Retries left: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))
        return this.checkPaymentStatus(subscriptionId, retries - 1)
      }

      return { status: 'FAILED' }
    }
  }

  /**
   * Get package pricing with billing cycle calculations
   */
  static async getPackagePricing(
    packageId: string, 
    billingCycle: 'MONTHLY' | 'ANNUAL'
  ): Promise<{
    basePrice: number
    discount: number
    finalPrice: number
    currency: string
  }> {
    try {
      if (!packageId || !billingCycle) {
        throw this.createApiError('Package ID and billing cycle are required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<{
        basePrice: number
        discount: number
        finalPrice: number
        currency: string
      }>(`${this.baseUrl}/billing/pricing?packageId=${packageId}&cycle=${billingCycle}`)

      if (!result.data) {
        throw this.createApiError('Invalid pricing response', 500, 'INVALID_RESPONSE')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Failed to get package pricing:', error)
      throw error
    }
  }

  /**
   * Validate organization data for duplicate check with enterprise validation
   */
  static async validateOrganization(
    organizationName: string, 
    email: string
  ): Promise<{
    isValid: boolean
    errors: ValidationError[]
  }> {
    try {
      if (!organizationName || !email) {
        return {
          isValid: false,
          errors: [
            { field: 'organizationName', message: 'Organization name is required', code: 'REQUIRED' },
            { field: 'email', message: 'Email is required', code: 'REQUIRED' }
          ].filter(error => 
            (!organizationName && error.field === 'organizationName') ||
            (!email && error.field === 'email')
          )
        }
      }

      const result = await this.makeRequest<{
        isValid: boolean
        errors: ValidationError[]
      }>(`${this.baseUrl}/subscription/validate-organization`, {
        method: 'POST',
        body: JSON.stringify({ organizationName, email }),
      })

      return result.data || { isValid: false, errors: [] }
    } catch (error) {
      console.error('[SubscriptionAPI] Organization validation failed:', error)
      return {
        isValid: false,
        errors: [{ field: 'general', message: 'Validation service temporarily unavailable', code: 'SERVICE_ERROR' }]
      }
    }
  }

  /**
   * Upload legal documents with enterprise file handling
   */
  static async uploadLegalDocument(
    subscriptionId: string,
    documentType: 'npwp' | 'businessLicense' | 'operationalLicense',
    file: File
  ): Promise<{
    success: boolean
    documentUrl: string
  }> {
    try {
      if (!subscriptionId || !documentType || !file) {
        throw this.createApiError('All document upload parameters are required', 400, 'MISSING_PARAMS')
      }

      // Enterprise file validation
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      
      if (file.size > maxSize) {
        throw this.createApiError('File size exceeds 10MB limit', 400, 'FILE_TOO_LARGE')
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw this.createApiError('Invalid file type. Only PDF, JPEG, and PNG are allowed', 400, 'INVALID_FILE_TYPE')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)
      formData.append('subscriptionId', subscriptionId)

      const result = await this.makeRequest<{
        success: boolean
        documentUrl: string
      }>(`${this.baseUrl}/subscription/upload-document`, {
        method: 'POST',
        body: formData,
        headers: {
          // Remove Content-Type to let browser set it with boundary for FormData
        },
      })

      if (!result.data) {
        throw this.createApiError('Invalid document upload response', 500, 'INVALID_RESPONSE')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Document upload failed:', error)
      throw error
    }
  }

  /**
   * Get comprehensive subscription details for enterprise dashboard
   */
  static async getSubscriptionDetails(subscriptionId: string): Promise<{
    organization: {
      name: string
      email: string
      phone: string
    }
    package: {
      name: string
      tier: string
      features: string[]
    }
    billing: {
      cycle: 'MONTHLY' | 'ANNUAL'
      amount: number
      currency: string
      nextBilling: string
    }
    status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  }> {
    try {
      if (!subscriptionId) {
        throw this.createApiError('Subscription ID is required', 400, 'MISSING_ID')
      }

      const result = await this.makeRequest<{
        organization: {
          name: string
          email: string
          phone: string
        }
        package: {
          name: string
          tier: string
          features: string[]
        }
        billing: {
          cycle: 'MONTHLY' | 'ANNUAL'
          amount: number
          currency: string
          nextBilling: string
        }
        status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
      }>(`${this.baseUrl}/subscription/details/${subscriptionId}`)

      if (!result.data) {
        throw this.createApiError('Invalid subscription details response', 500, 'INVALID_RESPONSE')
      }

      return result.data
    } catch (error) {
      console.error('[SubscriptionAPI] Failed to get subscription details:', error)
      throw error
    }
  }
}

export default SubscriptionAPI