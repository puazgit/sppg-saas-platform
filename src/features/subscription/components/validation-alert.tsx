/**
 * Simplified Validation Alert Component
 * Displays simple guidance message for subscription flow
 */

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

import { EnhancedValidationResult } from '../lib/registration-validation'
import { SubscriptionPackage } from '../services/subscription-api'

interface EnhancedValidationAlertProps {
  validationResult: EnhancedValidationResult
  validationSummary: {
    overallScore: number
    readinessLevel: 'HIGH' | 'MEDIUM' | 'LOW'
    criticalIssues: number
    recommendations: string[]
  }
  selectedPackage: SubscriptionPackage | null
  organizationType: string
  onUpgrade?: (targetTier: string) => void
  className?: string
}

export function EnhancedValidationAlert({
  selectedPackage,
  className
}: EnhancedValidationAlertProps) {
  if (!selectedPackage) {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>Pilih Paket Subscription</AlertTitle>
        <AlertDescription>
          Silakan pilih paket subscription yang sesuai dengan kebutuhan SPPG Anda.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className={className}>
      <Info className="h-4 w-4" />
      <AlertTitle>Paket Terpilih: {selectedPackage.displayName}</AlertTitle>
      <AlertDescription>
        Lanjutkan untuk mengisi data registrasi SPPG Anda.
      </AlertDescription>
    </Alert>
  )
}

export default EnhancedValidationAlert