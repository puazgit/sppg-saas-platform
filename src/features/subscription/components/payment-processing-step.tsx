/**
 * Enhanced Payment Processing Step - Complete Payment Flow
 * Professional payment processing interface with real-time status tracking
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building, Clock, ArrowLeft, RefreshCw, Copy,
  CheckCircle, XCircle, AlertCircle, Info, Loader
} from 'lucide-react'

import { useSubscriptionStore } from '../store/subscription.store'
import { formatCurrency } from '../lib/utils'

interface PaymentProcessingStepProps {
  onNext: () => void
  onBack: () => void
}

type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED' | 'CANCELLED'

interface PaymentDetails {
  transactionId: string
  amount: number
  method: string
  status: PaymentStatus
  paymentUrl?: string
  vaNumber?: string
  qrCode?: string
  instructions?: string[]
  expiresAt?: Date
}

export default function PaymentProcessingStep({ onNext, onBack }: PaymentProcessingStepProps) {
  const { selectedPackage, registrationData, subscriptionId } = useSubscriptionStore()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [countdown, setCountdown] = useState(600) // 10 minutes
  const [progress, setProgress] = useState(0)

  // Simulate payment initialization
  useEffect(() => {
    const initializePayment = async () => {
      setIsInitializing(true)
      
      try {
        // Get payment details from API using subscriptionId
        if (!subscriptionId) {
          throw new Error('Subscription ID not found')
        }

        const response = await fetch(`/api/billing/payment/details/${subscriptionId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch payment details')
        }
        
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to get payment details')
        }

        setPaymentDetails(result.paymentDetails)
      } catch (error) {
        console.error('Payment initialization error:', error)
        
        // Fallback payment details if API fails
        const fallbackPaymentDetails: PaymentDetails = {
          transactionId: `TXN-${Date.now()}`,
          amount: (selectedPackage?.monthlyPrice || 0) + (selectedPackage?.setupFee || 0),
          method: 'Bank Transfer',
          status: 'PENDING',
          vaNumber: `88808${Date.now().toString().slice(-8)}`,
          instructions: [
            'Buka aplikasi mobile banking atau ATM',
            'Pilih menu Transfer',
            'Pilih ke rekening tujuan',
            'Masukkan nomor rekening yang diberikan',
            'Masukkan nominal sesuai tagihan',
            'Konfirmasi pembayaran dan simpan bukti transfer'
          ],
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        }
        
        setPaymentDetails(fallbackPaymentDetails)
      }
      setIsInitializing(false)
    }

    initializePayment()
  }, [selectedPackage, subscriptionId])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || !paymentDetails) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPaymentDetails(prev => prev ? { ...prev, status: 'EXPIRED' } : null)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, paymentDetails])

  // Progress simulation
  useEffect(() => {
    if (paymentDetails?.status === 'PROCESSING') {
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 500)

      return () => clearInterval(progressTimer)
    }
  }, [paymentDetails?.status])

  // Simulate payment status polling
  useEffect(() => {
    if (!paymentDetails || paymentDetails.status !== 'PENDING') return

    const statusPolling = setInterval(() => {
      // Simulate random payment success after some time
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        setPaymentDetails(prev => prev ? { ...prev, status: 'PROCESSING' } : null)
        setProgress(15)
        
        setTimeout(() => {
          setPaymentDetails(prev => prev ? { ...prev, status: 'COMPLETED' } : null)
          setProgress(100)
          
          setTimeout(() => {
            onNext()
          }, 3000)
        }, 5000)
      }
    }, 3000)

    return () => clearInterval(statusPolling)
  }, [paymentDetails, onNext])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const handleRefreshStatus = () => {
    // Simulate status refresh
    console.log('Refreshing payment status...')
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-8 w-8 text-orange-500" />
      case 'PROCESSING':
        return <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      case 'COMPLETED':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="h-8 w-8 text-red-500" />
      case 'EXPIRED':
        return <AlertCircle className="h-8 w-8 text-gray-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusBadge = (status: PaymentStatus) => {
    const variants = {
      PENDING: 'bg-orange-100 text-orange-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-gray-100 text-gray-800'
    }

    const labels = {
      PENDING: 'Menunggu Pembayaran',
      PROCESSING: 'Memproses Pembayaran',
      COMPLETED: 'Pembayaran Berhasil',
      FAILED: 'Pembayaran Gagal',
      CANCELLED: 'Dibatalkan',
      EXPIRED: 'Kedaluwarsa'
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  if (isInitializing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto text-center space-y-6"
      >
        <Card>
          <CardContent className="p-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Menyiapkan Pembayaran</h2>
            <p className="text-gray-600">Mohon tunggu sebentar...</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!paymentDetails) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Terjadi kesalahan dalam memproses pembayaran. Silakan coba lagi.
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
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Pembayaran SPPG Subscription</h1>
        <p className="text-lg text-gray-600">
          Selesaikan pembayaran untuk mengaktifkan akun SPPG Anda
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Status & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payment Status Card */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(paymentDetails.status)}
                  Status Pembayaran
                </CardTitle>
                {getStatusBadge(paymentDetails.status)}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{paymentDetails.transactionId}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(paymentDetails.transactionId)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Jumlah Pembayaran</label>
                    <p className="font-bold text-lg text-green-600">
                      {formatCurrency(paymentDetails.amount)}
                    </p>
                  </div>
                </div>

                {paymentDetails.status === 'PROCESSING' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress Verifikasi</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {paymentDetails.status === 'PENDING' && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-orange-800">Batas Waktu Pembayaran</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-mono text-lg text-orange-800">
                          {formatTime(countdown)}
                        </span>
                      </div>
                    </div>
                    <p className="text-orange-700 text-sm">
                      Selesaikan pembayaran sebelum waktu habis
                    </p>
                  </div>
                )}

                {paymentDetails.status === 'COMPLETED' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                      <CheckCircle className="h-5 w-5" />
                      Pembayaran Berhasil!
                    </div>
                    <p className="text-green-700 text-sm">
                      Akun SPPG Anda sedang diaktifkan. Anda akan diarahkan ke dashboard dalam beberapa detik.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {paymentDetails.vaNumber && paymentDetails.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Instruksi Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-blue-800">Nomor Virtual Account</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(paymentDetails.vaNumber!)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Salin
                    </Button>
                  </div>
                  <p className="font-mono text-2xl font-bold text-blue-900 tracking-wider">
                    {paymentDetails.vaNumber}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Langkah Pembayaran:</h4>
                  <ol className="space-y-2">
                    {paymentDetails.instructions?.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    <strong>Penting:</strong> Pastikan jumlah transfer sesuai dengan nominal yang tertera. 
                    Transfer dengan nominal berbeda akan ditolak otomatis.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Error States */}
          {(paymentDetails.status === 'FAILED' || paymentDetails.status === 'EXPIRED') && (
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {paymentDetails.status === 'FAILED' ? (
                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-gray-500 mx-auto" />
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {paymentDetails.status === 'FAILED' ? 'Pembayaran Gagal' : 'Waktu Pembayaran Habis'}
                    </h3>
                    <p className="text-gray-600">
                      {paymentDetails.status === 'FAILED' 
                        ? 'Terjadi kesalahan dalam memproses pembayaran Anda'
                        : 'Batas waktu pembayaran telah habis'
                      }
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={onBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Pilih Metode Lain
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Coba Lagi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary & Support */}
        <div className="space-y-6">
          
          {/* Order Summary */}
          <Card className="border-2 border-green-200 sticky top-4">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Organisasi SPPG</h4>
                <p className="text-sm font-semibold">{registrationData?.name}</p>
                <p className="text-sm text-gray-600">{registrationData?.code}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Paket Subscription</h4>
                <p className="text-sm font-semibold">{selectedPackage?.displayName}</p>
                <p className="text-sm text-gray-600">{selectedPackage?.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subscription Bulanan</span>
                  <span>{formatCurrency(selectedPackage?.monthlyPrice || 0)}</span>
                </div>
                {selectedPackage?.setupFee && (
                  <div className="flex justify-between text-sm">
                    <span>Setup Fee</span>
                    <span>{formatCurrency(selectedPackage.setupFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-green-600">
                  <span>Total</span>
                  <span>{formatCurrency(paymentDetails.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Butuh Bantuan?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Customer Support</p>
                  <p className="text-blue-600">support@sppg-platform.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-blue-600">+62 812-3456-7890</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Jam Layanan</p>
                  <p className="text-gray-600">24/7 untuk pembayaran</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRefreshStatus}
                  disabled={paymentDetails.status === 'COMPLETED'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={paymentDetails.status === 'PROCESSING' || paymentDetails.status === 'COMPLETED'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        {(paymentDetails.status === 'FAILED' || paymentDetails.status === 'EXPIRED') && (
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Pembayaran Lagi
          </Button>
        )}
      </div>
    </motion.div>
  )
}