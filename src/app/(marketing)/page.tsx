'use client'

import { 
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CaseStudiesSection,
  PricingSection,
  ROICalculatorSection,
  ContactSection
} from '@/features/marketing'

/**
 * SPPG SaaS Platform - Modern Marketing Landing Page
 * 
 * Enterprise-level marketing page dengan komponen modern dan data real:
 * - Hero section dengan animasi dan real-time stats
 * - Features showcase dengan interactive cards
 * - Testimonials dengan social proof
 * - Case studies dengan metrics dan ROI data
 * - Pricing plans dengan billing toggle
 * - Contact form dengan multiple channels
 * 
 * URL: / (karena route group tidak mempengaruhi URL)
 */
export default function MarketingHomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section with Animations */}
      <section id="home">
        <HeroSection />
      </section>
      
      {/* Enterprise Features Showcase */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Social Proof - Customer Testimonials */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Case Studies with Real ROI Data */}
      <section id="case-studies">
        <CaseStudiesSection />
      </section>
      
      {/* ROI Calculator */}
      <section id="roi-calculator">
        <ROICalculatorSection />
      </section>
      
      {/* Pricing Plans */}
      <section id="pricing">
        <PricingSection />
      </section>
      
      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  )
}