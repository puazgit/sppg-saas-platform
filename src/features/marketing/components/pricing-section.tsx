'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  Check, Star, Crown, Zap, Shield, 
  Phone, Mail, ArrowRight, Sparkles
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface SubscriptionPackage {
  id: string
  name: string
  tier: string
  displayName?: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features?: string[]
  highlightFeatures?: string[]
  limitations?: string[]
  maxRecipients?: number
  maxStaff?: number
  maxDistributionPoints?: number
  maxMenusPerMonth?: number
  storageGb?: number
  maxReportsPerMonth?: number
  maxSppg?: number
  maxUsers?: number
  maxSchools?: number
  supportLevel: string
  isPopular: boolean
  isEnterprise?: boolean
  isActive?: boolean
  hasAdvancedReporting?: boolean
  hasNutritionAnalysis?: boolean
  hasCostCalculation?: boolean
  hasQualityControl?: boolean
  hasAPIAccess?: boolean
  hasCustomBranding?: boolean
  hasPrioritySupport?: boolean
  hasTrainingIncluded?: boolean
  responseTimeSLA?: string
  targetMarket?: string
}

// Fallback packages for enterprise reliability
const FALLBACK_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'basic-fallback',
    name: 'Basic',
    tier: 'BASIC',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Starter package for small SPPG organizations',
    supportLevel: 'Community',
    isPopular: false,
    isActive: true
  },
  {
    id: 'standard-fallback',
    name: 'Standard',
    tier: 'STANDARD',
    monthlyPrice: 250000,
    yearlyPrice: 2500000,
    description: 'Most popular choice for growing organizations',
    supportLevel: 'Email',
    isPopular: true,
    isActive: true
  },
  {
    id: 'pro-fallback',
    name: 'Pro',
    tier: 'PRO',
    monthlyPrice: 500000,
    yearlyPrice: 5000000,
    description: 'Advanced features for established SPPG operations',
    supportLevel: 'Priority',
    isPopular: false,
    isActive: true
  },
  {
    id: 'enterprise-fallback',
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    monthlyPrice: 1000000,
    yearlyPrice: 10000000,
    description: 'Full-scale solution for large organizations',
    supportLevel: '24/7',
    isPopular: false,
    isEnterprise: true,
    isActive: true
  }
]

const tierIcons = {
  BASIC: Star,
  STANDARD: Zap,
  PRO: Crown,
  ENTERPRISE: Shield
}

const tierColors = {
  BASIC: 'from-blue-500 to-blue-600',
  STANDARD: 'from-green-500 to-green-600', 
  PRO: 'from-purple-500 to-purple-600',
  ENTERPRISE: 'from-indigo-500 to-indigo-600'
}

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  const handleSubscription = (packageTier: string) => {
    const billingType = isYearly ? 'yearly' : 'monthly'
    router.push(`/subscription?package=${packageTier.toLowerCase()}&billing=${billingType}`)
  }

  const { data: packagesData, isLoading, error, refetch } = useQuery<{ packages: SubscriptionPackage[]; success: boolean }>({
    queryKey: ['marketing-packages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/marketing/packages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Validate response structure for marketing API format
        if (!data || !Array.isArray(data.packages)) {
          console.warn('[PricingSection] Invalid API response structure:', data)
          throw new Error('Invalid response structure')
        }
        
        return data
      } catch (error) {
        console.error('[PricingSection] API fetch failed:', error)
        throw error
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes (cacheTime renamed to gcTime in v5)
  })



  // Error state with retry option
  if (error && !isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Unable to load pricing data</h3>
              <p className="text-red-600 text-sm mb-4">Please check your connection and try again.</p>
              <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
                Retry Loading
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 h-96">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={`skeleton-feature-${j}`} className="h-3 bg-gray-300 rounded w-full"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Use fetched data or fallback to ensure cards never disappear
  const packages = (packagesData?.packages && packagesData.packages.length > 0) 
    ? packagesData.packages 
    : FALLBACK_PACKAGES

  // Always render with available packages

  const formatPrice = (monthlyPrice: number, yearlyPrice: number) => {
    if (isYearly) {
      return {
        price: Math.round(yearlyPrice / 12),
        period: '/bulan',
        savings: Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100),
        annual: yearlyPrice
      }
    }
    return {
      price: monthlyPrice,
      period: '/bulan',
      savings: 0,
      annual: monthlyPrice * 12
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 px-4 py-2">
            💰 Paket Berlangganan
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Pilih Paket yang Tepat untuk SPPG Anda
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Dapatkan akses penuh ke platform dengan fitur-fitur enterprise yang akan 
            meningkatkan efisiensi operasional SPPG Anda.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Bulanan
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-indigo-600"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Tahunan
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                Hemat 20%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {packages.map((pkg, index) => {
            const IconComponent = tierIcons[pkg.tier as keyof typeof tierIcons] || Star
            const gradientColor = tierColors[pkg.tier as keyof typeof tierColors] || 'from-gray-500 to-gray-600'
            const pricing = formatPrice(pkg.monthlyPrice || 0, pkg.yearlyPrice || 0)
            
            return (
              <motion.div
                key={`${pkg.tier}-${pkg.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: pkg.isPopular ? 1.02 : 1.05 }}
              >
                <Card className={`
                  relative p-8 h-full border-2 transition-all duration-300 group
                  ${pkg.isPopular 
                    ? 'border-indigo-500 shadow-2xl bg-white scale-105' 
                    : 'border-gray-200 shadow-lg bg-white hover:border-indigo-300 hover:shadow-xl'
                  }
                  ${pkg.isEnterprise ? 'bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-indigo-400' : ''}
                `}>
                  
                  {/* Popular Badge */}
                  {pkg.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white px-4 py-1 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Paling Populer
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`
                      w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradientColor} 
                      flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform
                    `}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-2 ${pkg.isEnterprise ? 'text-white' : 'text-gray-900'}`}>
                      {pkg.name}
                    </h3>
                    
                    <p className={`text-sm ${pkg.isEnterprise ? 'text-indigo-200' : 'text-gray-600'} mb-6`}>
                      {pkg.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center space-x-1">
                        <span className={`text-4xl font-bold ${pkg.isEnterprise ? 'text-white' : 'text-gray-900'}`}>
                          {pkg.tier === 'ENTERPRISE' ? 'Custom' :
                           pkg.monthlyPrice === 0 ? 'Gratis' :
                           `Rp ${pricing.price.toLocaleString('id-ID')}`}
                        </span>
                        {pkg.monthlyPrice > 0 && pkg.tier !== 'ENTERPRISE' && (
                          <span className={`text-sm ${pkg.isEnterprise ? 'text-indigo-300' : 'text-gray-500'}`}>
                            {pricing.period}
                          </span>
                        )}
                      </div>
                      
                      {isYearly && pricing.savings > 0 && pkg.tier !== 'ENTERPRISE' && (
                        <div className="text-sm text-green-600 font-medium">
                          Hemat {pricing.savings}% dari paket bulanan
                        </div>
                      )}
                      
                      {pkg.tier === 'ENTERPRISE' && (
                        <div className="text-sm text-indigo-300">
                          Harga disesuaikan dengan kebutuhan
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Benefits - Non-redundant */}
                  <div className="space-y-4 mb-8">
                    <div className="space-y-3">
                      {/* Filter out redundant capacity info and show only unique features */}
                      {(pkg.highlightFeatures || pkg.features || [])
                        .filter(feature => 
                          !feature.toLowerCase().includes('maksimal') && 
                          !feature.toLowerCase().includes('terbatas') &&
                          feature.toLowerCase() !== 'basic reporting' &&
                          feature.toLowerCase() !== 'advanced reporting'
                        )
                        .slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            pkg.isEnterprise ? 'text-green-400' : 'text-green-500'
                          }`} />
                          <span className={`text-sm ${pkg.isEnterprise ? 'text-indigo-100' : 'text-gray-700'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      
                      {/* Show capacity in a single clean line */}
                      <div className={`text-sm ${pkg.isEnterprise ? 'text-indigo-100' : 'text-gray-700'} bg-gray-50 ${pkg.isEnterprise ? 'bg-indigo-800/30' : ''} rounded-lg p-3 mt-4`}>
                        <div className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 flex-shrink-0 ${
                            pkg.isEnterprise ? 'text-green-400' : 'text-green-500'
                          }`} />
                          <span>
                            {(pkg.maxUsers || 0) > 100000 ? 'Unlimited' : `${(pkg.maxUsers || 0).toLocaleString()} users`} • 
                            {(pkg.maxSchools || 0) > 100 ? 'Unlimited' : `${pkg.maxSchools || 0} lokasi`} • 
                            {pkg.supportLevel} support
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                                    {pkg.tier === 'ENTERPRISE' ? (
                    <Button 
                      asChild
                      className="w-full py-3 px-6 text-base font-semibold transition-all duration-200 group/btn bg-white text-indigo-900 hover:bg-indigo-50"
                    >
                      <a href="mailto:sales@sppg.id">
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi Sales
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubscription(pkg.tier)}
                      className={`w-full py-3 px-6 text-base font-semibold transition-all duration-200 group/btn ${
                        pkg.isPopular 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {pkg.monthlyPrice === 0 ? (
                        <>
                          Mulai Gratis
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          Mulai Berlangganan
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}

                  {pkg.tier === 'ENTERPRISE' && (
                    <div className="mt-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs border-indigo-300 text-indigo-300 hover:bg-indigo-800"
                      >
                        <Mail className="w-3 h-3 mr-2" />
                        Demo Khusus
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Features Comparison */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-left">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                  <h3 className="text-2xl font-bold">
                    Jaminan 30 Hari Uang Kembali
                  </h3>
                </div>
                <p className="text-blue-100 max-w-2xl">
                  Tidak puas dengan platform kami? Dapatkan refund 100% dalam 30 hari pertama. 
                  Tanpa pertanyaan, tanpa ribet.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                >
                  Coba Gratis 14 Hari
                </Button>
                <div className="text-xs text-blue-200 text-center">
                  Tidak perlu kartu kredit
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}