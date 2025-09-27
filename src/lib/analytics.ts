// Analytics and conversion tracking utilities
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export interface TrackingEvent {
  action: string
  category: string
  label?: string
  value?: number
  customParameters?: Record<string, unknown>
}

export class MarketingAnalytics {
  private static instance: MarketingAnalytics
  private isDebug: boolean = process.env.NODE_ENV === 'development'

  private constructor() {}

  static getInstance(): MarketingAnalytics {
    if (!MarketingAnalytics.instance) {
      MarketingAnalytics.instance = new MarketingAnalytics()
    }
    return MarketingAnalytics.instance
  }

  // Google Analytics 4 Event Tracking
  trackEvent(event: TrackingEvent): void {
    if (this.isDebug) {
      console.log('📊 Analytics Event:', event)
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters
      })
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.customParameters
      })
    }
  }

  // Marketing-specific tracking methods
  trackPricingView(packageTier: string): void {
    this.trackEvent({
      action: 'view_pricing',
      category: 'marketing',
      label: packageTier,
      customParameters: {
        content_type: 'subscription_package',
        package_tier: packageTier
      }
    })
  }

  trackCaseStudyView(organizationName: string): void {
    this.trackEvent({
      action: 'view_case_study',
      category: 'marketing',
      label: organizationName,
      customParameters: {
        content_type: 'case_study',
        organization: organizationName
      }
    })
  }

  trackContactFormStart(): void {
    this.trackEvent({
      action: 'begin_contact_form',
      category: 'lead_generation',
      customParameters: {
        form_type: 'contact_form'
      }
    })
  }

  trackContactFormSubmit(formData: {
    organizationSize: string
    inquiryType: string
  }): void {
    this.trackEvent({
      action: 'submit_contact_form',
      category: 'lead_generation',
      label: formData.organizationSize,
      customParameters: {
        form_type: 'contact_form',
        organization_size: formData.organizationSize,
        inquiry_type: formData.inquiryType
      }
    })
  }

  trackDemoRequest(packageTier: string): void {
    this.trackEvent({
      action: 'request_demo',
      category: 'lead_generation',
      label: packageTier,
      value: this.getPackageValue(packageTier),
      customParameters: {
        package_tier: packageTier,
        conversion_type: 'demo_request'
      }
    })
  }

  trackPriceInquiry(packageTier: string): void {
    this.trackEvent({
      action: 'inquire_price',
      category: 'lead_generation', 
      label: packageTier,
      value: this.getPackageValue(packageTier),
      customParameters: {
        package_tier: packageTier,
        conversion_type: 'price_inquiry'
      }
    })
  }

  trackNewsletterSignup(source: string): void {
    this.trackEvent({
      action: 'subscribe_newsletter',
      category: 'engagement',
      label: source,
      customParameters: {
        subscription_type: 'newsletter',
        source: source
      }
    })
  }

  trackWhatsAppClick(): void {
    this.trackEvent({
      action: 'click_whatsapp',
      category: 'contact',
      customParameters: {
        contact_method: 'whatsapp'
      }
    })
  }

  trackPhoneClick(): void {
    this.trackEvent({
      action: 'click_phone',
      category: 'contact',
      customParameters: {
        contact_method: 'phone'
      }
    })
  }

  // Conversion value mapping
  private getPackageValue(tier: string): number {
    const values = {
      'BASIC': 2500000,
      'STANDARD': 4500000,
      'PRO': 7500000,
      'ENTERPRISE': 10000000
    }
    return values[tier as keyof typeof values] || 0
  }

  // Enhanced ecommerce tracking for subscription selection
  trackPurchaseIntent(packageData: {
    tier: string
    price: number
    billingCycle: 'monthly' | 'yearly'
  }): void {
    this.trackEvent({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: packageData.tier,
      value: packageData.price,
      customParameters: {
        currency: 'IDR',
        item_name: `SPPG Platform ${packageData.tier}`,
        item_category: 'subscription',
        item_variant: packageData.billingCycle,
        price: packageData.price,
        quantity: 1
      }
    })
  }

  // A/B Testing support
  trackABTestView(testName: string, variant: string): void {
    this.trackEvent({
      action: 'view_ab_test',
      category: 'optimization',
      label: `${testName}_${variant}`,
      customParameters: {
        test_name: testName,
        variant: variant
      }
    })
  }

  // Page view tracking with enhanced data
  trackPageView(page: string, additionalData?: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: page,
        ...additionalData
      })
    }
  }

  // Error tracking
  trackError(error: string, context?: string): void {
    this.trackEvent({
      action: 'exception',
      category: 'error',
      label: error,
      customParameters: {
        description: error,
        fatal: false,
        context: context
      }
    })
  }
}

// Singleton instance
export const analytics = MarketingAnalytics.getInstance()

// Utility hooks for React components
export function useAnalytics() {
  return analytics
}