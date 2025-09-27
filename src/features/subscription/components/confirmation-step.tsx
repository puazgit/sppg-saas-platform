/**
 * Enhanced Confirmation Step - Complete Review Before Payment
 * Professional confirmation interface with comprehensive data review
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, User, MapPin, Package, Check, ArrowRight, ArrowLeft,
  Mail, Phone, Target, Clock, Users, Calendar, Settings,
  CheckCircle, AlertCircle, Info, Shield, FileText, CreditCard, Loader2
} from 'lucide-react'

import { useSubscriptionStore } from '../store/subscription.store'
import { formatCurrency } from '../lib/utils'

interface ConfirmationStepProps {
  onNext: () => void
  onBack: () => void
}

export function ConfirmationStep({ onNext, onBack }: ConfirmationStepProps) {
  const { selectedPackage, registrationData, isLoading, setLoading, setError, setSubscriptionId } = useSubscriptionStore()
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    dataProcessing: false,
    governmentCompliance: false
  })
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false)

  const handleConfirm = async () => {
    if (!allAgreementsChecked()) {
      return
    }

    if (!selectedPackage || !registrationData) {
      setError('Data paket atau registrasi tidak lengkap')
      return
    }

    setIsCreatingSubscription(true)
    setLoading(true)

    try {
      console.log('[Confirmation] Creating subscription...')
      
      // Prepare subscription data
      const subscriptionData = {
        packageId: selectedPackage.id,
        sppgData: {
          sppgName: registrationData.name || '',
          sppgType: registrationData.organizationType || '',
          address: registrationData.address || '',
          city: registrationData.city || '',
          province: registrationData.provinceId || '',
          phone: registrationData.phone || '',
          email: registrationData.email || '',
          picName: registrationData.picName || '',
          picPosition: registrationData.picPosition || '',
          picEmail: registrationData.picEmail || registrationData.email || '',
          picPhone: registrationData.picPhone || registrationData.phone || '',
          picWhatsapp: registrationData.picWhatsapp,
          organizationType: registrationData.organizationType,
          establishedYear: registrationData.establishedYear,
          estimatedRecipients: registrationData.targetRecipients || 0,
        },
        paymentData: {
          paymentMethod: 'BANK_TRANSFER',
          billingCycle: 'MONTHLY', // Default to monthly
        }
      }

      // Create subscription via API
      const response = await fetch('/api/billing/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create subscription')
      }

      console.log('[Confirmation] Subscription created successfully:', result)
      
      // Save subscription ID to store
      setSubscriptionId(result.subscriptionId)
      
      // Proceed to payment step
      onNext()
      
    } catch (error) {
      console.error('[Confirmation] Error creating subscription:', error)
      setError(`Gagal membuat subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreatingSubscription(false)
      setLoading(false)
    }
  }

  const allAgreementsChecked = () => {
    return Object.values(agreements).every(Boolean)
  }

  const calculateSubtotal = () => {
    if (!selectedPackage) return 0
    return selectedPackage.monthlyPrice
  }

  const calculateSetupFee = () => {
    return selectedPackage?.setupFee || 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return Math.round(subtotal * 0.11) // PPN 11%
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateSetupFee() + calculateTax()
  }

  if (!selectedPackage || !registrationData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Data tidak lengkap. Silakan kembali ke step sebelumnya untuk melengkapi informasi.
          </AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-20"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Konfirmasi Subscription SPPG</h1>
        <p className="text-base sm:text-lg text-gray-600 px-4">
          Review dan konfirmasi semua informasi sebelum melanjutkan ke pembayaran
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 xl:gap-8">
        {/* Left Column - Data Review */}
        <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          
          {/* Package Summary */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Package className="h-5 w-5" />
                Paket Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPackage.displayName}</h3>
                  <p className="text-gray-600">{selectedPackage.description}</p>
                </div>
                <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                  {selectedPackage.tier}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Maksimal {selectedPackage.maxRecipients?.toLocaleString() || 'Unlimited'} Penerima</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>Maksimal {selectedPackage.maxStaff} Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span>Storage {selectedPackage.storageGb} GB</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Support {selectedPackage.supportLevel}</span>
                </div>
              </div>

              {selectedPackage.highlightFeatures && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Fitur Unggulan:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedPackage.highlightFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Informasi Organisasi SPPG
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Organisasi</label>
                  <p className="font-semibold">{registrationData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kode SPPG</label>
                  <p className="font-semibold font-mono">{registrationData.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Organisasi</label>
                  <p className="font-semibold">{registrationData.organizationType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tahun Berdiri</label>
                  <p className="font-semibold">{registrationData.establishedYear}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                <p className="text-gray-800 leading-relaxed">{registrationData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* PIC Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Person in Charge (PIC)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="font-semibold">{registrationData.picName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Posisi/Jabatan</label>
                  <p className="font-semibold">{registrationData.picPosition}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="font-semibold text-blue-600">{registrationData.picEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Nomor HP
                  </label>
                  <p className="font-semibold">{registrationData.picPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                Lokasi & Alamat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Alamat Lengkap</label>
                <p className="font-semibold">{registrationData.address}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Kota</label>
                  <p className="font-semibold">{registrationData.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kode Pos</label>
                  <p className="font-semibold">{registrationData.postalCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Timezone</label>
                  <p className="font-semibold">{registrationData.timezone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Parameter Operasional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Target Penerima</label>
                      <p className="font-semibold">{registrationData.targetRecipients?.toLocaleString()} orang/hari</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Radius Operasional</label>
                      <p className="font-semibold">{registrationData.maxRadius} KM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Jam Operasional</label>
                      <p className="font-semibold">
                        {registrationData.businessHoursStart} - {registrationData.businessHoursEnd}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hari Operasional</label>
                      <p className="font-semibold">{registrationData.operationalDays}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Summary & Agreements */}
        <div className="space-y-6 order-1 xl:order-2 xl:sticky xl:top-6 xl:h-fit xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:overflow-x-visible">
          
          {/* Payment Summary */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
                <CreditCard className="h-5 w-5" />
                Ringkasan Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base">Subscription Bulanan</span>
                  <span className="font-semibold text-sm sm:text-base">{formatCurrency(calculateSubtotal())}</span>
                </div>
                
                {calculateSetupFee() > 0 && (
                  <div className="flex justify-between">
                    <span>Setup Fee</span>
                    <span className="font-semibold">{formatCurrency(calculateSetupFee())}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600">
                  <span>PPN (11%)</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Pembayaran Pertama</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Termasuk biaya setup dan subscription bulan pertama
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Agreements */}
          <Card className="border-2 border-yellow-200 shadow-lg">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="flex items-center gap-2 text-yellow-800 text-base sm:text-lg">
                <FileText className="h-5 w-5" />
                Persetujuan & Ketentuan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreements.termsOfService}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, termsOfService: !!checked }))
                  }
                />
                <div className="text-sm">
                  <label htmlFor="terms" className="font-medium cursor-pointer">
                    Syarat & Ketentuan Layanan
                  </label>
                  <p className="text-gray-600 mt-1">
                    Saya telah membaca dan menyetujui{' '}
                    <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                      Syarat & Ketentuan Layanan
                    </a>{' '}
                    SPPG SaaS Platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={agreements.privacyPolicy}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, privacyPolicy: !!checked }))
                  }
                />
                <div className="text-sm">
                  <label htmlFor="privacy" className="font-medium cursor-pointer">
                    Kebijakan Privasi
                  </label>
                  <p className="text-gray-600 mt-1">
                    Saya menyetujui{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                      Kebijakan Privasi
                    </a>{' '}
                    dan penggunaan data organisasi
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="data"
                  checked={agreements.dataProcessing}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, dataProcessing: !!checked }))
                  }
                />
                <div className="text-sm">
                  <label htmlFor="data" className="font-medium cursor-pointer">
                    Pemrosesan Data
                  </label>
                  <p className="text-gray-600 mt-1">
                    Saya mengizinkan pemrosesan data SPPG untuk keperluan operasional platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="compliance"
                  checked={agreements.governmentCompliance}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, governmentCompliance: !!checked }))
                  }
                />
                <div className="text-sm">
                  <label htmlFor="compliance" className="font-medium cursor-pointer">
                    Kepatuhan Pemerintah
                  </label>
                  <p className="text-gray-600 mt-1">
                    Saya memahami kewajiban pelaporan dan compliance terhadap regulasi pemerintah
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {!allAgreementsChecked() && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Harap centang semua persetujuan untuk melanjutkan ke pembayaran
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-8 border-t bg-white sticky bottom-0 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center justify-center gap-2 min-w-[160px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Registrasi
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={isLoading || !allAgreementsChecked()}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 min-w-[180px] sm:min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Membuat Subscription...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Konfirmasi & Bayar</span>
              <span className="sm:hidden">Konfirmasi</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}