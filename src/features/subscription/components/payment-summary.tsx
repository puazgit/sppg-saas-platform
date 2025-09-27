/**
 * Payment Summary Component with Package Context Integration
 * Displays comprehensive payment breakdown and pricing information
 */

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calculator, 
  CreditCard, 
  Calendar, 
  TrendingDown, 
  Gift, 
  CheckCircle,
  AlertTriangle,
  Info,
  Percent
} from 'lucide-react'

import { PaymentCalculator, PaymentBreakdown, PaymentSchedule } from '../lib/payment-calculator'
import { SubscriptionPackage } from '../services/subscription-api'
import { RegistrationData } from '../schemas/subscription.schema'

interface PaymentSummaryProps {
  selectedPackage: SubscriptionPackage | null
  registrationData: Partial<RegistrationData>
  organizationType: string
  isUpgrade?: boolean
  previousPackage?: SubscriptionPackage
  onProceedToPayment?: (paymentBreakdown: PaymentBreakdown) => void
  className?: string
}

export function PaymentSummary({
  selectedPackage,
  registrationData,
  organizationType,
  isUpgrade = false,
  previousPackage,
  onProceedToPayment,
  className
}: PaymentSummaryProps) {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [promotionCode, setPromotionCode] = useState('')
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [promoValidation, setPromoValidation] = useState<{
    isValid: boolean
    reason?: string
    discount?: number
    description?: string
  } | null>(null)

  // Calculate payment breakdown
  const paymentBreakdown = useMemo(() => {
    if (!selectedPackage) return null

    return PaymentCalculator.calculatePayment({
      selectedPackage,
      registrationData,
      billingCycle,
      promotionCode: promoValidation?.isValid ? promotionCode : undefined,
      organizationType,
      isUpgrade,
      previousPackage
    })
  }, [selectedPackage, registrationData, billingCycle, promotionCode, promoValidation, organizationType, isUpgrade, previousPackage])

  // Generate payment schedule
  const paymentSchedule = useMemo(() => {
    if (!paymentBreakdown) return null
    
    return PaymentCalculator.generatePaymentSchedule(
      paymentBreakdown,
      new Date(),
      billingCycle === 'YEARLY' ? 3 : 12 // Show 3 years for yearly, 12 months for monthly
    )
  }, [paymentBreakdown, billingCycle])

  const handlePromotionCodeValidation = async () => {
    if (!promotionCode.trim() || !selectedPackage) return

    setIsValidatingPromo(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const validation = PaymentCalculator.validatePromotionCode(
      promotionCode,
      organizationType,
      selectedPackage.monthlyPrice
    )
    
    setPromoValidation(validation)
    setIsValidatingPromo(false)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (!selectedPackage || !paymentBreakdown) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Ringkasan Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Pilih paket subscription untuk melihat ringkasan pembayaran
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Ringkasan Pembayaran
            </div>
            <Badge variant={isUpgrade ? 'secondary' : 'default'}>
              {isUpgrade ? 'Upgrade' : 'New Subscription'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {selectedPackage.displayName} • {organizationType}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Billing Cycle Selection */}
          <div className="space-y-3">
            <Label>Siklus Pembayaran</Label>
            <Select value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'MONTHLY' | 'YEARLY')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">
                  <div className="flex items-center justify-between w-full">
                    <span>Bulanan</span>
                    <span className="ml-4 text-sm text-muted-foreground">
                      {formatCurrency(selectedPackage.monthlyPrice)}/bulan
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="YEARLY">
                  <div className="flex items-center justify-between w-full">
                    <span>Tahunan</span>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(selectedPackage.yearlyPrice || selectedPackage.monthlyPrice * 12)}/tahun
                      </span>
                      {paymentBreakdown.savingsFromYearly && paymentBreakdown.savingsFromYearly > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Hemat {formatCurrency(paymentBreakdown.savingsFromYearly)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Promotion Code */}
          <div className="space-y-3">
            <Label>Kode Promosi (Opsional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan kode promosi"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
              />
              <Button
                variant="outline"
                onClick={handlePromotionCodeValidation}
                disabled={!promotionCode.trim() || isValidatingPromo}
              >
                {isValidatingPromo ? 'Validating...' : 'Apply'}
              </Button>
            </div>
            
            {promoValidation && (
              <Alert variant={promoValidation.isValid ? 'default' : 'destructive'}>
                {promoValidation.isValid ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {promoValidation.isValid ? (
                    <div>
                      <strong>{promoValidation.description}</strong>
                      <br />
                      Discount: {formatCurrency(promoValidation.discount || 0)}
                    </div>
                  ) : (
                    promoValidation.reason
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium">Rincian Harga</h4>
            <div className="space-y-3">
              {paymentBreakdown.priceBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{item.description}</span>
                  <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts */}
          {paymentBreakdown.discountBreakdown.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                Discount & Penghematan
              </h4>
              <div className="space-y-3">
                {paymentBreakdown.discountBreakdown.map((discount, index) => (
                  <div key={index} className="flex justify-between items-center text-green-600">
                    <div className="flex items-center gap-2">
                      <Percent className="h-3 w-3" />
                      <span className="text-sm">{discount.description}</span>
                    </div>
                    <span className="font-medium">-{formatCurrency(discount.appliedAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Total Summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(paymentBreakdown.subtotal)}</span>
            </div>
            
            {paymentBreakdown.setupFee > 0 && (
              <div className="flex justify-between items-center">
                <span>Setup Fee (Satu Kali)</span>
                <span className="font-medium">{formatCurrency(paymentBreakdown.setupFee)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span>PPN 11%</span>
              <span className="font-medium">{formatCurrency(paymentBreakdown.taxAmount)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pembayaran</span>
              <span>{formatCurrency(paymentBreakdown.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Schedule Info */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Jadwal Pembayaran</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Pembayaran Awal:</span>
                <span className="font-medium">{formatCurrency(paymentBreakdown.initialPayment)}</span>
              </div>
              {paymentBreakdown.recurringPayment > 0 && (
                <div className="flex justify-between">
                  <span>Pembayaran {billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'}:</span>
                  <span className="font-medium">{formatCurrency(paymentBreakdown.recurringPayment)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span>Tanggal Tagih Berikutnya:</span>
                <span className="font-medium">
                  {paymentBreakdown.nextBillingDate.toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          {onProceedToPayment && (
            <Button
              onClick={() => onProceedToPayment(paymentBreakdown)}
              className="w-full"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Lanjutkan ke Pembayaran
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment Schedule Details */}
      {paymentSchedule && (
        <PaymentScheduleCard 
          paymentSchedule={paymentSchedule}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Savings Highlight */}
      {billingCycle === 'MONTHLY' && paymentBreakdown.savingsFromYearly && paymentBreakdown.savingsFromYearly > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-green-800">
                  Hemat dengan Pembayaran Tahunan!
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Anda bisa menghemat <strong>{formatCurrency(paymentBreakdown.savingsFromYearly)}</strong> per tahun 
                  dengan memilih pembayaran tahunan.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setBillingCycle('YEARLY')}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Pilih Tahunan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface PaymentScheduleCardProps {
  paymentSchedule: PaymentSchedule
  formatCurrency: (amount: number) => string
}

function PaymentScheduleCard({ paymentSchedule, formatCurrency }: PaymentScheduleCardProps) {
  const [showAll, setShowAll] = useState(false)
  const displayPayments = showAll ? paymentSchedule.payments : paymentSchedule.payments.slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Jadwal Pembayaran
        </CardTitle>
        <CardDescription>
          Proyeksi pembayaran untuk {paymentSchedule.billingCycle === 'YEARLY' ? '3 tahun' : '12 bulan'} ke depan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {displayPayments.map((payment, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded border">
              <div>
                <div className="font-medium">{payment.description}</div>
                <div className="text-sm text-muted-foreground">
                  {payment.dueDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                <Badge variant={payment.type === 'SETUP' ? 'secondary' : 'default'} className="text-xs">
                  {payment.type === 'SETUP' ? 'Setup' : 'Subscription'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {paymentSchedule.payments.length > 6 && (
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? 'Sembunyikan' : `Lihat Semua (${paymentSchedule.payments.length - 6} lainnya)`}
          </Button>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(paymentSchedule.totalProjectedAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Proyeksi
            </div>
          </div>
          {paymentSchedule.totalSavings > 0 && (
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentSchedule.totalSavings)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Penghematan
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentSummary