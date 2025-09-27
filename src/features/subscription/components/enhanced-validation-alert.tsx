/**
 * Enhanced Registration Validation Alert Component
 * Displays comprehensive validation results for organization-specific requirements
 */

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info, 
  TrendingUp, 
  FileText,
  Zap,
  Award,
  Target,
  Clock
} from 'lucide-react'

import { EnhancedValidationResult } from '../lib/enhanced-registration-validation'
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
  validationResult,
  validationSummary,
  selectedPackage,
  organizationType,
  onUpgrade,
  className
}: EnhancedValidationAlertProps) {
  const { 
    organizationCompliance, 
    featureRequirements, 
    fieldValidation, 
    packageCompatibility 
  } = validationResult

  const {
    overallScore,
    readinessLevel,
    criticalIssues,
    recommendations
  } = validationSummary

  if (!selectedPackage) {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>Pilih Paket Subscription</AlertTitle>
        <AlertDescription>
          Silakan pilih paket subscription untuk melihat kesesuaian dengan jenis organisasi Anda.
        </AlertDescription>
      </Alert>
    )
  }

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-green-600 bg-green-50 border-green-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getReadinessIcon = (level: string) => {
    switch (level) {
      case 'HIGH': return <CheckCircle className="h-5 w-5" />
      case 'MEDIUM': return <Clock className="h-5 w-5" />
      case 'LOW': return <AlertTriangle className="h-5 w-5" />
      default: return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Readiness Status */}
      <Card className={`border-2 ${getReadinessColor(readinessLevel)}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getReadinessIcon(readinessLevel)}
              <div>
                <h3 className="text-lg font-semibold">
                  Status Kesiapan Registrasi
                </h3>
                <p className="text-sm opacity-75">
                  {organizationType} • Paket {selectedPackage.displayName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {overallScore}/100
              </div>
              <Badge 
                variant={readinessLevel === 'HIGH' ? 'default' : readinessLevel === 'MEDIUM' ? 'secondary' : 'destructive'}
                className="mt-1"
              >
                {readinessLevel === 'HIGH' ? 'Siap' : readinessLevel === 'MEDIUM' ? 'Hampir Siap' : 'Perlu Perbaikan'}
              </Badge>
            </div>
          </CardTitle>
          <Progress 
            value={overallScore} 
            className={`h-3 ${readinessLevel === 'HIGH' ? 'bg-green-100' : readinessLevel === 'MEDIUM' ? 'bg-yellow-100' : 'bg-red-100'}`}
          />
        </CardHeader>

        {(criticalIssues > 0 || recommendations.length > 0) && (
          <CardContent>
            {criticalIssues > 0 && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>
                  {criticalIssues} Masalah Kritis Ditemukan
                </AlertTitle>
                <AlertDescription>
                  Masalah ini harus diselesaikan sebelum melanjutkan registrasi.
                </AlertDescription>
              </Alert>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Rekomendasi Perbaikan
                </h4>
                <ul className="space-y-1 text-sm">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-3 w-3 mt-1 opacity-60 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
                {recommendations.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{recommendations.length - 3} rekomendasi lainnya
                  </p>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Field Validation Errors & Warnings */}
      {(fieldValidation.errors.length > 0 || fieldValidation.warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Validasi Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldValidation.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Error Yang Harus Diperbaiki ({fieldValidation.errors.length})
                </h4>
                <div className="space-y-2">
                  {fieldValidation.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription>
                        <strong>{error.field}:</strong> {error.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {fieldValidation.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Peringatan ({fieldValidation.warnings.length})
                </h4>
                <div className="space-y-2">
                  {fieldValidation.warnings.map((warning, index) => (
                    <Alert key={index}>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <div>
                          <strong>{warning.field}:</strong> {warning.message}
                        </div>
                        {warning.suggestion && (
                          <div className="mt-1 text-sm text-blue-600">
                            💡 {warning.suggestion}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Organization Compliance Requirements */}
      {organizationCompliance.required.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Persyaratan Compliance {organizationType}
            </CardTitle>
            <CardDescription>
              Fitur yang diperlukan berdasarkan jenis organisasi dan regulasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {organizationCompliance.required.map((requirement, index) => {
                const isSatisfied = organizationCompliance.satisfied.includes(requirement)
                const isMissing = organizationCompliance.missing.includes(requirement)

                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isSatisfied ? 'bg-green-50 border-green-200' : 
                      isMissing && requirement.mandatory ? 'bg-red-50 border-red-200' : 
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isSatisfied ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : requirement.mandatory ? (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      ) : (
                        <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium">{requirement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {requirement.description}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={requirement.mandatory ? 'destructive' : 'secondary'} className="text-xs">
                            {requirement.mandatory ? 'Wajib' : 'Opsional'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {requirement.regulationType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isSatisfied ? (
                        <Badge variant="default" className="bg-green-600">
                          Terpenuhi
                        </Badge>
                      ) : (
                        <Badge variant={requirement.mandatory ? 'destructive' : 'secondary'}>
                          {requirement.mandatory ? 'Tidak Terpenuhi' : 'Direkomendasikan'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Requirements */}
      {(featureRequirements.required.length > 0 || featureRequirements.recommended.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Fitur Yang Diperlukan
            </CardTitle>
            <CardDescription>
              Analisis kesesuaian fitur paket dengan kebutuhan {organizationType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureRequirements.required.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Fitur Wajib</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {featureRequirements.required.map((feature, index) => {
                    const isMissing = featureRequirements.missing.includes(feature)
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          isMissing ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                        }`}
                      >
                        {isMissing ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {featureRequirements.recommended.length > 0 && (
              <div>
                <Separator />
                <h4 className="font-medium mb-3">Fitur Direkomendasikan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {featureRequirements.recommended.map((feature, index) => {
                    const hasFeature = selectedPackage[feature as keyof SubscriptionPackage]
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          hasFeature ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        {hasFeature ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Info className="h-4 w-4" />
                        )}
                        <span className="text-sm">{feature}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Package Compatibility & Upgrade Suggestion */}
      {(!packageCompatibility.compatible || packageCompatibility.upgradeRequired) && onUpgrade && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Rekomendasi Upgrade Paket
            </CardTitle>
            <CardDescription className="text-orange-700">
              Paket saat ini tidak sepenuhnya kompatibel dengan kebutuhan {organizationType}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Alasan Upgrade:</h4>
              <ul className="space-y-1">
                {packageCompatibility.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {packageCompatibility.minimumTier && (
              <div className="flex justify-between items-center pt-4 border-t border-orange-200">
                <div>
                  <p className="font-medium">Paket Minimum yang Disarankan</p>
                  <p className="text-lg font-bold text-orange-600">
                    SPPG {packageCompatibility.minimumTier}
                  </p>
                </div>
                <Button
                  onClick={() => onUpgrade(packageCompatibility.minimumTier!)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Upgrade ke {packageCompatibility.minimumTier}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default EnhancedValidationAlert