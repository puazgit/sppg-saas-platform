/**
 * Package Validation Alert Component
 * Displays validation results and upgrade suggestions
 */

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  Users, 
  MapPin,
  Clock,
  Zap
} from 'lucide-react'

import { PackageValidationResult } from '../lib/package-validation'
import { SubscriptionPackage } from '../services/subscription-api'

interface PackageValidationAlertProps {
  validationResult: PackageValidationResult
  selectedPackage: SubscriptionPackage | null
  onUpgrade?: (targetTier: string) => void
  className?: string
}

export function PackageValidationAlert({
  validationResult,
  selectedPackage,
  onUpgrade,
  className
}: PackageValidationAlertProps) {
  const { isValid, errors, warnings, suggestions, shouldUpgrade } = validationResult

  if (!selectedPackage) {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>Pilih Paket Subscription</AlertTitle>
        <AlertDescription>
          Silakan pilih paket subscription terlebih dahulu untuk melanjutkan proses registrasi.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Package Compatibility Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Status Kompatibilitas Paket
            </CardTitle>
            <Badge 
              variant={isValid ? "default" : "destructive"}
              className="ml-2"
            >
              {isValid ? 'Compatible' : 'Requires Attention'}
            </Badge>
          </div>
          <CardDescription>
            Paket {selectedPackage?.name || 'Unknown'} - {selectedPackage?.description || 'No description'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Package Usage Overview */}
          <PackageUsageOverview selectedPackage={selectedPackage} />

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Batasan Paket Terlampaui</AlertTitle>
              <AlertDescription className="space-y-2">
                <ul className="list-disc pl-4 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Warnings */}
          {warnings.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription className="space-y-2">
                <ul className="list-disc pl-4 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">
                Saran Optimisasi
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <ul className="list-disc pl-4 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Recommendation */}
      {shouldUpgrade && onUpgrade && (
        <UpgradeRecommendationCard
          upgradeInfo={shouldUpgrade}
          currentPackage={selectedPackage}
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  )
}

interface PackageUsageOverviewProps {
  selectedPackage: SubscriptionPackage | null
}

function PackageUsageOverview({ selectedPackage }: PackageUsageOverviewProps) {
  // Safe access with fallback values
  const maxRecipients = selectedPackage?.maxRecipients || 0
  const maxStaff = selectedPackage?.maxStaff || 0
  const maxDistributionPoints = selectedPackage?.maxDistributionPoints || 0
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-blue-600" />
          Max Penerima
        </div>
        <div className="text-2xl font-bold">
          {maxRecipients.toLocaleString()}
        </div>
        <Progress value={75} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Dapat melayani hingga {maxRecipients.toLocaleString()} penerima per hari
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-green-600" />
          Max Staff
        </div>
        <div className="text-2xl font-bold">
          {maxStaff}
        </div>
        <Progress value={60} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Dukungan untuk {maxStaff} staff member
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-purple-600" />
          Titik Distribusi
        </div>
        <div className="text-2xl font-bold">
          {maxDistributionPoints}
        </div>
        <Progress value={40} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Hingga {maxDistributionPoints} lokasi distribusi
        </p>
      </div>
    </div>
  )
}

interface UpgradeRecommendationCardProps {
  upgradeInfo: {
    requiredTier: string
    reason: string
    benefits: string[]
  }
  currentPackage: SubscriptionPackage
  onUpgrade: (targetTier: string) => void
}

function UpgradeRecommendationCard({ 
  upgradeInfo, 
  currentPackage, 
  onUpgrade 
}: UpgradeRecommendationCardProps) {
  const getUpgradePrice = (targetTier: string) => {
    const tierPricing = {
      'BASIC': 125000,
      'STANDARD': 250000,
      'PRO': 500000,
      'ENTERPRISE': 1000000
    }
    return tierPricing[targetTier as keyof typeof tierPricing] || 250000
  }

  const targetPrice = getUpgradePrice(upgradeInfo.requiredTier)
  const priceDifference = targetPrice - currentPackage.monthlyPrice

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <TrendingUp className="h-5 w-5" />
          Rekomendasi Upgrade Paket
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          {upgradeInfo.reason}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Paket yang Direkomendasikan</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {upgradeInfo.requiredTier}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tambahan biaya</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(priceDifference)}/bulan
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Manfaat Upgrade:</p>
          <ul className="space-y-1">
            {upgradeInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onUpgrade(upgradeInfo.requiredTier)}
            className="flex-1"
            size="sm"
          >
            Upgrade Sekarang
          </Button>
          <Button variant="outline" size="sm">
            Bandingkan Paket
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Field-level validation feedback component
 */
interface FieldValidationFeedbackProps {
  fieldValidation: {
    isValid: boolean
    message?: string
    suggestion?: string
  }
  className?: string
}

export function FieldValidationFeedback({ 
  fieldValidation, 
  className 
}: FieldValidationFeedbackProps) {
  const { isValid, message, suggestion } = fieldValidation

  if (isValid && !suggestion) return null

  return (
    <div className={`space-y-1 ${className}`}>
      {!isValid && message && (
        <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-3 w-3" />
          {message}
        </div>
      )}
      {suggestion && (
        <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
          <Info className="h-3 w-3" />
          {suggestion}
        </div>
      )}
    </div>
  )
}

export default PackageValidationAlert