/**
 * Enterprise Package Selection Step - Professional Implementation
 * Subscription flow with proper Switch toggle like marketing section
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Check, Star, Crown, Zap, Shield, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useSubscriptionStore } from '@/features/subscription/store/subscription.store'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import type { SubscriptionPackage } from '@/features/subscription/services/subscription-api'

interface PackageSelectionStepProps {
  onNext: () => void
}

const tierIcons = {
  BASIC: Star,
  STANDARD: Zap,
  PRO: Crown,
  ENTERPRISE: Shield
}

const getTierColor = (tier: string) => {
  const colors = {
    BASIC: 'border-blue-200 hover:border-blue-300 bg-blue-50/50',
    STANDARD: 'border-green-200 hover:border-green-300 bg-green-50/50',
    PRO: 'border-purple-200 hover:border-purple-300 bg-purple-50/50',
    ENTERPRISE: 'border-orange-200 hover:border-orange-300 bg-orange-50/50'
  }
  return colors[tier as keyof typeof colors] || 'border-gray-200 hover:border-gray-300'
}

const getSelectedTierColor = (tier: string) => {
  const colors = {
    BASIC: 'border-blue-500 bg-blue-100/80 shadow-blue-200/50',
    STANDARD: 'border-green-500 bg-green-100/80 shadow-green-200/50', 
    PRO: 'border-purple-500 bg-purple-100/80 shadow-purple-200/50',
    ENTERPRISE: 'border-orange-500 bg-orange-100/80 shadow-orange-200/50'
  }
  return colors[tier as keyof typeof colors] || 'border-gray-500 bg-gray-100/80'
}

export function PackageSelectionStep({ onNext }: PackageSelectionStepProps) {
  const { selectedPackage, setPackage } = useSubscriptionStore()
  const searchParams = useSearchParams()
  
  // Professional billing cycle state - matching marketing section exactly
  const [isYearly, setIsYearly] = useState(false)
  
  // Enterprise state management for UI feedback
  const [, setUiState] = useState<{
    isSelecting: boolean;
    lastSelectedId?: string;
    selectionTimestamp?: Date;
  }>({ isSelecting: false })

  // Currency formatting utility
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Fetch packages
  const { data: packagesData, isLoading, error } = useQuery<{ packages: SubscriptionPackage[] }>({
    queryKey: ['subscription-packages'],
    queryFn: async () => {
      const response = await fetch('/api/billing/packages')
      if (!response.ok) throw new Error('Failed to fetch packages')
      return response.json()
    }
  })

  const packages = useMemo(() => packagesData?.packages || [], [packagesData])

  // Enterprise URL parameter handling with billing cycle sync  
  useEffect(() => {
    const packageParam = searchParams.get('package')
    const billingParam = searchParams.get('billing')
    
    console.log('[Enterprise] Processing URL parameters:', { packageParam, billingParam })
    
    // Sync billing cycle from URL - matching marketing section logic
    if (billingParam) {
      const shouldBeYearly = billingParam.toLowerCase() === 'yearly'
      if (shouldBeYearly !== isYearly) {
        setIsYearly(shouldBeYearly)
        console.log('[Enterprise] Billing cycle updated from URL:', shouldBeYearly ? 'YEARLY' : 'MONTHLY')
      }
    }
    
    // Only proceed if we have URL parameter and packages data
    if (!packageParam || !packages || packages.length === 0) return
    
    // Find exact tier match (enterprise-grade matching)
    const matchingPackage = packages.find(pkg => {
      const tierMatch = pkg.tier.toLowerCase() === packageParam.toLowerCase()
      const nameMatch = pkg.name.toLowerCase() === packageParam.toLowerCase()
      return tierMatch || nameMatch
    })
    
    // Set package only if found and different from current
    if (matchingPackage && matchingPackage.id !== selectedPackage?.id) {
      console.log('[Enterprise] Auto-selecting package from URL:', {
        package: matchingPackage.displayName || matchingPackage.name,
        tier: matchingPackage.tier,
        billing: billingParam || 'monthly',
        source: 'URL parameters'
      })
      
      // Enterprise state update with immediate response
      setUiState(prev => ({
        ...prev,
        lastSelectedId: matchingPackage.id,
        selectionTimestamp: new Date(),
        isSelecting: false
      }))
      
      setPackage(matchingPackage)
    }
  }, [searchParams, packages, selectedPackage?.id, isYearly, setPackage])

  // Enterprise package selection with immediate response
  const handleSelectPackage = (pkg: SubscriptionPackage) => {
    console.log('[Enterprise] Package selection initiated:', {
      package: pkg.displayName || pkg.name,
      tier: pkg.tier,
      billing: isYearly ? 'YEARLY' : 'MONTHLY',
      timestamp: new Date().toISOString()
    })
    
    // Immediate UI feedback and state update
    setUiState(prev => ({
      ...prev,
      lastSelectedId: pkg.id,
      selectionTimestamp: new Date(),
      isSelecting: false // Keep this false for immediate response
    }))
    
    // Update store immediately (no delays for enterprise UX)
    console.log('[Enterprise] Updating package in store...')
    setPackage(pkg)
    console.log('[Enterprise] Package updated in store, selectedPackage should now be:', pkg.displayName || pkg.name)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-xl p-6 h-96">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="space-y-2 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-3 bg-gray-300 rounded w-full"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Packages</h2>
          <p className="text-gray-600">Failed to load subscription packages. Please try again later.</p>
        </div>
      </div>
    )
  }

  // Debug log for selectedPackage
  console.log('[Enterprise] PackageSelectionStep render - selectedPackage:', selectedPackage?.displayName || selectedPackage?.name || 'none')

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Enterprise Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pilih Paket Berlangganan SPPG
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Pilih paket yang sesuai dengan kebutuhan SPPG Anda. Semua paket dapat di-upgrade kapan saja.
        </p>
        
        {/* Professional Billing Toggle - Same as Marketing Section */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${
            !isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}>
            Bulanan
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-indigo-600"
          />
          <span className={`text-sm font-medium ${
            isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}>
            Tahunan
          </span>
          {isYearly && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              Hemat 20%
            </Badge>
          )}
        </div>
        
        {selectedPackage && (
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-300 rounded-lg mb-4 shadow-sm">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                {selectedPackage.displayName || selectedPackage.name} • {isYearly ? 'Tahunan' : 'Bulanan'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Package Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {packages.map((pkg) => {
          const TierIcon = tierIcons[pkg.tier as keyof typeof tierIcons] || Star
          const isSelected = selectedPackage?.id === pkg.id
          const isPreselectedFromUrl = searchParams.get('package')?.toLowerCase() === pkg.tier.toLowerCase()
          
          return (
            <motion.div
              key={pkg.id}
              layout
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`h-full cursor-pointer transition-all duration-300 relative ${
                isSelected 
                  ? `${getSelectedTierColor(pkg.tier)} ring-4 ring-green-400 shadow-2xl transform scale-105 border-2 border-green-500`
                  : `${getTierColor(pkg.tier)} hover:shadow-lg hover:scale-102 hover:ring-2 hover:ring-gray-300`
              } ${isPreselectedFromUrl && !isSelected ? 'ring-2 ring-blue-300 shadow-lg' : ''} ${
                isYearly ? 'relative overflow-hidden' : ''
              }`}
                onClick={() => handleSelectPackage(pkg)}
              >
              
              <CardHeader className="text-center pb-2">
                {isYearly && (
                  <div className="absolute -top-1 -left-1 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-lg">
                      HEMAT 20%
                    </div>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    isSelected ? 'bg-white/90' : 'bg-gray-100'
                  }`}>
                    <TierIcon className={`h-6 w-6 ${
                      isSelected ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pkg.displayName || pkg.name}
                </h3>
                
                {pkg.isPopular && (
                  <Badge className="mb-2 bg-blue-100 text-blue-800">
                    ⭐ Terpopuler
                  </Badge>
                )}
                
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(
                      isYearly
                        ? Math.round(((pkg.yearlyPrice || pkg.monthlyPrice * 10) || 0) / 12) // Monthly equivalent of yearly
                        : (pkg.monthlyPrice || 0)
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    /bulan
                  </div>
                  {!isYearly && (
                    <div className="text-xs text-blue-600 mt-1">
                      Atau {formatCurrency(Math.round(((pkg.yearlyPrice || pkg.monthlyPrice * 10) || 0) / 12))}/bulan (tahunan)
                    </div>
                  )}
                  {isYearly && (
                    <div className="text-xs text-green-600 mt-1">
                      💰 Hemat {formatCurrency((pkg.monthlyPrice || 0) * 12 - ((pkg.yearlyPrice || pkg.monthlyPrice * 10) || 0))}/tahun
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-6 min-h-[3rem]">
                  {pkg.description || 'Paket berlangganan SPPG'}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Max Penerima:</span>
                    <span className="font-medium">{(pkg.maxRecipients || 0).toLocaleString()} orang</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Max Staff:</span>
                    <span className="font-medium">{pkg.maxStaff || 0} orang</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">{pkg.storageGb || 0} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Support:</span>
                    <span className="font-medium">{pkg.supportLevel || 'Email'}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {(pkg.highlightFeatures || []).slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className={`w-full transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectPackage(pkg)
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Terpilih
                    </>
                  ) : (
                    'Pilih Paket'
                  )}
                </Button>
              </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Selected Package Confirmation */}
      {selectedPackage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Paket yang Dipilih: {selectedPackage.displayName || selectedPackage.name}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(
                      isYearly
                        ? ((selectedPackage.yearlyPrice || selectedPackage.monthlyPrice * 10) || 0)
                        : (selectedPackage.monthlyPrice || 0)
                    )}
                  </div>
                  <div className="text-gray-500">
                    {isYearly ? 'per tahun' : 'per bulan'}
                  </div>
                  {isYearly && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      💰 Hemat {formatCurrency((selectedPackage.monthlyPrice || 0) * 12 - ((selectedPackage.yearlyPrice || selectedPackage.monthlyPrice * 10) || 0))} per tahun
                    </div>
                  )}
                  {!isYearly && (
                    <div className="text-sm text-blue-600 font-medium mt-1">
                      💡 Pilih tahunan dan hemat 20%
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                console.log('[Enterprise] Next button clicked, calling onNext function')
                onNext()
              }}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              Lanjut ke Registrasi
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Silakan pilih paket terlebih dahulu
        </div>
      )}
    </div>
  )
}