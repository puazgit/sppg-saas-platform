/**
 * Enterprise Billing API Service
 * Comprehensive billing operations with enterprise-grade error handling,
 * type safety, and proper logging for production environments.
 */

export interface BillingMetrics {
  totalRevenue: number
  activeSubscriptions: number
  pendingInvoices: number
  monthlyRecurring: number
  churnRate: number
  avgRevenuePerUser: number
  revenueGrowth: number
  subscriptionGrowth: number
}

export interface PaymentDetails {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'EWALLET' | 'VIRTUAL_ACCOUNT'
  reference: string
  description: string
  createdAt: string
  completedAt?: string
  failureReason?: string
  sppgName: string
  invoiceNumber?: string
  timeline: PaymentTimelineItem[]
}

export interface PaymentTimelineItem {
  id: string
  status: string
  description: string
  timestamp: string
  isCompleted: boolean
}

export interface Invoice {
  id: string
  invoiceNumber: string
  sppgId: string
  sppgName: string
  amount: number
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  issueDate: string
  dueDate: string
  paidDate?: string
  description: string
  items: InvoiceItem[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface BillingError extends Error {
  statusCode: number
  code: string
  details?: Record<string, unknown>
}

/**
 * Enterprise-grade Billing API Service
 * Handles all billing-related API calls with comprehensive error handling,
 * type safety, and proper logging for production environments.
 */
export class BillingAPI {
  private static readonly baseUrl = '/api/billing'
  private static readonly timeout = 30000 // 30 seconds for enterprise reliability
  
  /**
   * Creates a standardized billing API error with proper context
   */
  private static createBillingError(
    message: string, 
    statusCode: number, 
    code: string, 
    details?: Record<string, unknown>
  ): BillingError {
    const error = new Error(message) as BillingError
    error.statusCode = statusCode
    error.code = code
    error.details = details
    error.name = 'BillingError'
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
        throw this.createBillingError(
          result.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          result.error || 'HTTP_ERROR',
          result.data as Record<string, unknown>
        )
      }

      if (!result.success) {
        throw this.createBillingError(
          result.error || 'API returned unsuccessful response',
          response.status,
          'API_ERROR'
        )
      }

      return result
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw this.createBillingError('Request timeout', 408, 'TIMEOUT')
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw this.createBillingError('Network error', 0, 'NETWORK_ERROR')
      }

      throw error
    }
  }

  /**
   * Get comprehensive billing dashboard metrics
   */
  static async getDashboardMetrics(): Promise<BillingMetrics> {
    try {
      const result = await this.makeRequest<BillingMetrics>(`${this.baseUrl}/dashboard/metrics`)
      
      if (!result.data) {
        throw this.createBillingError('Invalid metrics data format', 500, 'INVALID_DATA')
      }

      return result.data
    } catch (error) {
      console.error('[BillingAPI] Failed to fetch dashboard metrics:', error)
      throw error
    }
  }

  /**
   * Get payment status with comprehensive details
   */
  static async getPaymentStatus(
    paymentId?: string,
    subscriptionId?: string,
    invoiceId?: string
  ): Promise<PaymentDetails> {
    try {
      const params = new URLSearchParams()
      if (paymentId) params.append('paymentId', paymentId)
      if (subscriptionId) params.append('subscriptionId', subscriptionId)
      if (invoiceId) params.append('invoiceId', invoiceId)

      if (params.toString().length === 0) {
        throw this.createBillingError('At least one ID parameter is required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<PaymentDetails>(
        `${this.baseUrl}/payment/status?${params.toString()}`
      )

      if (!result.data) {
        throw this.createBillingError('Invalid payment data format', 500, 'INVALID_DATA')
      }

      return result.data
    } catch (error) {
      console.error('[BillingAPI] Failed to fetch payment status:', error)
      throw error
    }
  }

  /**
   * Get invoices with filtering and pagination
   */
  static async getInvoices(params: {
    page?: number
    limit?: number
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{
    invoices: Invoice[]
    total: number
    totalPages: number
    currentPage: number
  }> {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })

      const result = await this.makeRequest<{
        invoices: Invoice[]
        total: number
        totalPages: number
        currentPage: number
      }>(`${this.baseUrl}/invoices?${queryParams.toString()}`)

      if (!result.data) {
        throw this.createBillingError('Invalid invoices data format', 500, 'INVALID_DATA')
      }

      return result.data
    } catch (error) {
      console.error('[BillingAPI] Failed to fetch invoices:', error)
      throw error
    }
  }

  /**
   * Generate invoice for subscription
   */
  static async generateInvoice(subscriptionId: string): Promise<Invoice> {
    try {
      if (!subscriptionId) {
        throw this.createBillingError('Subscription ID is required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<Invoice>(`${this.baseUrl}/invoices/generate`, {
        method: 'POST',
        body: JSON.stringify({ subscriptionId }),
      })

      if (!result.data) {
        throw this.createBillingError('Failed to generate invoice', 500, 'GENERATION_FAILED')
      }

      return result.data
    } catch (error) {
      console.error('[BillingAPI] Failed to generate invoice:', error)
      throw error
    }
  }

  /**
   * Process payment with retry logic for enterprise reliability
   */
  static async processPayment(
    invoiceId: string,
    paymentMethod: string,
    retries = 3
  ): Promise<PaymentDetails> {
    try {
      if (!invoiceId || !paymentMethod) {
        throw this.createBillingError('Invoice ID and payment method are required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<PaymentDetails>(`${this.baseUrl}/payment/process`, {
        method: 'POST',
        body: JSON.stringify({ invoiceId, paymentMethod }),
      })

      if (!result.data) {
        throw this.createBillingError('Payment processing failed', 500, 'PROCESSING_FAILED')
      }

      return result.data
    } catch (error) {
      console.error('[BillingAPI] Payment processing failed:', error)
      
      // Retry logic for enterprise reliability
      if (retries > 0 && (error as BillingError).statusCode >= 500) {
        console.warn(`[BillingAPI] Retrying payment processing. Retries left: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))
        return this.processPayment(invoiceId, paymentMethod, retries - 1)
      }

      throw error
    }
  }

  /**
   * Download invoice as PDF
   */
  static async downloadInvoice(invoiceId: string): Promise<Blob> {
    try {
      if (!invoiceId) {
        throw this.createBillingError('Invoice ID is required', 400, 'MISSING_PARAMS')
      }

      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/download`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      })

      if (!response.ok) {
        throw this.createBillingError('Failed to download invoice', response.status, 'DOWNLOAD_FAILED')
      }

      return await response.blob()
    } catch (error) {
      console.error('[BillingAPI] Failed to download invoice:', error)
      throw error
    }
  }

  /**
   * Send invoice via email
   */
  static async sendInvoice(invoiceId: string, email?: string): Promise<boolean> {
    try {
      if (!invoiceId) {
        throw this.createBillingError('Invoice ID is required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<{ sent: boolean }>(`${this.baseUrl}/invoices/${invoiceId}/send`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      return result.data?.sent || false
    } catch (error) {
      console.error('[BillingAPI] Failed to send invoice:', error)
      return false
    }
  }

  /**
   * Bulk operations for invoices
   */
  static async bulkInvoiceOperation(
    operation: 'send' | 'download' | 'mark_paid' | 'cancel',
    invoiceIds: string[]
  ): Promise<{
    success: string[]
    failed: string[]
    errors: Record<string, string>
  }> {
    try {
      if (!invoiceIds.length) {
        throw this.createBillingError('Invoice IDs are required', 400, 'MISSING_PARAMS')
      }

      const result = await this.makeRequest<{
        success: string[]
        failed: string[]
        errors: Record<string, string>
      }>(`${this.baseUrl}/invoices/bulk`, {
        method: 'POST',
        body: JSON.stringify({ operation, invoiceIds }),
      })

      return result.data || { success: [], failed: invoiceIds, errors: {} }
    } catch (error) {
      console.error('[BillingAPI] Bulk operation failed:', error)
      throw error
    }
  }
}

export default BillingAPI