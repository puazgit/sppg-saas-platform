'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, Mail, Clock, RefreshCw, ArrowLeft, 
  Calendar, Building2, Users, Shield
} from 'lucide-react'
import { useSubscriptionStore } from '../store/subscription.store'

interface RegistrationSuccessProps {
  registrationData?: {
    sppgId: string
    subscriptionId: string
    organizationName: string
    email: string
    verificationSent: boolean
    trialEndDate: string
  }
}

export default function RegistrationSuccessPage({ registrationData }: RegistrationSuccessProps) {
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [countdown, setCountdown] = useState(60)
  const { selectedPackage, resetState } = useSubscriptionStore()

  // Parse trial end date
  const trialEndDate = registrationData?.trialEndDate 
    ? new Date(registrationData.trialEndDate)
    : null

  // Countdown for resend button
  useEffect(() => {
    if (resendCount > 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, resendCount])

  const handleResendVerification = async () => {
    if (!registrationData?.email || countdown > 0) return
    
    try {
      setIsResending(true)
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: registrationData.email })
      })

      const result = await response.json()

      if (result.success) {
        setResendCount(prev => prev + 1)
        setCountdown(60) // Reset countdown
        alert('Email verifikasi berhasil dikirim ulang!')
      } else {
        alert(result.error || 'Gagal mengirim ulang email verifikasi')
      }
    } catch (error) {
      console.error('Resend error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToHome = () => {
    resetState() // Clear subscription store
    router.push('/')
  }

  const handleGoToLogin = () => {
    router.push('/auth/signin')
  }

  const formatTrialDays = () => {
    if (!trialEndDate) return '14 hari'
    
    const now = new Date()
    const diffTime = trialEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return `${Math.max(0, diffDays)} hari`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Success Header */}
        <Card className="border-emerald-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Registrasi Berhasil!
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Selamat! Akun organisasi <strong>{registrationData?.organizationName}</strong> berhasil didaftarkan
            </p>
          </CardHeader>
        </Card>

        {/* Email Verification Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Verifikasi Email Diperlukan</CardTitle>
                <p className="text-sm text-gray-500">
                  Langkah terakhir untuk mengaktifkan akun Anda
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {registrationData?.verificationSent ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-3">
                  ✅ Email verifikasi telah dikirim ke <strong>{registrationData.email}</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Silakan periksa inbox email Anda dan klik link verifikasi untuk mengaktifkan akun.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  ⚠️ Terjadi masalah saat mengirim email verifikasi ke {registrationData?.email}
                </p>
              </div>
            )}
            
            {/* Resend Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {countdown > 0 
                  ? `Kirim Ulang (${countdown}s)` 
                  : resendCount > 0 
                    ? 'Kirim Ulang Lagi' 
                    : 'Kirim Ulang Email'
                }
              </Button>
              
              {resendCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Email dikirim {resendCount} kali
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Detail Langganan Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium">{selectedPackage?.name || 'Paket Standard'}</p>
                  <p className="text-sm text-gray-500">Paket berlangganan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Uji Coba {formatTrialDays()}</p>
                  <p className="text-sm text-gray-500">Periode trial gratis</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">{registrationData?.organizationName}</p>
                  <p className="text-sm text-gray-500">Nama organisasi</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">{selectedPackage?.maxRecipients || 'Unlimited'}</p>
                  <p className="text-sm text-gray-500">Maksimal penerima</p>
                </div>
              </div>
            </div>

            {trialEndDate && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <p className="font-medium text-emerald-800">Periode Uji Coba</p>
                </div>
                <p className="text-sm text-emerald-700">
                  Trial berakhir pada: {trialEndDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Nikmati semua fitur secara gratis selama periode trial
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Langkah Selanjutnya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Verifikasi Email</p>
                  <p className="text-sm text-gray-600">Klik link verifikasi di email Anda</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Login ke Dashboard</p>
                  <p className="text-sm text-gray-600">Masuk ke akun dan mulai setup organisasi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Mulai Uji Coba</p>
                  <p className="text-sm text-gray-600">Jelajahi fitur dan setup operasional SPPG</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={handleGoToLogin}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Masuk ke Akun
          </Button>
          
          <Button 
            onClick={handleBackToHome}
            variant="outline" 
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>

        {/* Support */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Butuh bantuan?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a 
              href="mailto:support@sppg-platform.com" 
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Hubungi Support
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="/help" 
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Pusat Bantuan
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}