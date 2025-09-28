'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Mail, RefreshCw } from 'lucide-react'

interface VerificationResult {
  success: boolean
  message: string
  redirectUrl?: string
}

interface EmailVerificationPageProps {
  token: string
}

export default function EmailVerificationPage({ token }: EmailVerificationPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isResending, setIsResending] = useState(false)

  // Auto-verify when component mounts
  useEffect(() => {
    const performVerification = async (verificationToken: string) => {
      try {
        setVerificationState('loading')
        
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: verificationToken })
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setVerificationState('success')
          setResult({
            success: true,
            message: data.message || 'Email berhasil diverifikasi!',
            redirectUrl: data.redirectUrl
          })

          // Auto-redirect after 3 seconds
          if (data.redirectUrl) {
            setTimeout(() => {
              router.push(data.redirectUrl)
            }, 3000)
          }
        } else {
          // Handle specific error types
          if (data.error?.includes('expired')) {
            setVerificationState('expired')
          } else {
            setVerificationState('error')
          }
          
          setResult({
            success: false,
            message: data.error || 'Terjadi kesalahan saat verifikasi email.'
          })
        }
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationState('error')
        setResult({
          success: false,
          message: 'Tidak dapat menghubungi server. Silakan coba lagi.'
        })
      }
    }

    if (token) {
      performVerification(token)
    }
  }, [token, router])

  const verifyEmail = async (verificationToken: string) => {
    try {
      setVerificationState('loading')
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationToken })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setVerificationState('success')
        setResult({
          success: true,
          message: data.message || 'Email berhasil diverifikasi!',
          redirectUrl: data.redirectUrl
        })

        // Auto-redirect after 3 seconds
        if (data.redirectUrl) {
          setTimeout(() => {
            router.push(data.redirectUrl)
          }, 3000)
        }
      } else {
        // Handle specific error types
        if (data.error?.includes('expired')) {
          setVerificationState('expired')
        } else {
          setVerificationState('error')
        }
        
        setResult({
          success: false,
          message: data.error || 'Terjadi kesalahan saat verifikasi email.'
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationState('error')
      setResult({
        success: false,
        message: 'Tidak dapat menghubungi server. Silakan coba lagi.'
      })
    }
  }

  const resendVerification = async () => {
    try {
      setIsResending(true)
      
      // Get email from URL params or stored data
      const email = searchParams?.get('email')
      if (!email) {
        alert('Email tidak ditemukan. Silakan daftar ulang.')
        router.push('/subscription')
        return
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('Email verifikasi baru telah dikirim. Silakan periksa inbox Anda.')
      } else {
        alert(data.error || 'Gagal mengirim ulang email verifikasi.')
      }
    } catch (error) {
      console.error('Resend error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsResending(false)
    }
  }

  const handleReturnToLogin = () => {
    router.push('/auth/signin')
  }

  const handleGoToSubscription = () => {
    router.push('/subscription')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Loading State */}
          {verificationState === 'loading' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Memverifikasi Email...
              </h1>
              <p className="text-gray-600">
                Mohon tunggu sebentar, kami sedang memverifikasi alamat email Anda.
              </p>
            </div>
          )}

          {/* Success State */}
          {verificationState === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Email Berhasil Diverifikasi! ✨
              </h1>
              <p className="text-gray-600 mb-6">
                {result?.message || 'Selamat! Akun Anda telah aktif dan siap digunakan.'}
              </p>
              
              {result?.redirectUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Anda akan diarahkan ke dashboard dalam beberapa detik...
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {result?.redirectUrl ? (
                  <button
                    onClick={() => router.push(result.redirectUrl!)}
                    className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Lanjut ke Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleReturnToLogin}
                    className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Masuk ke Akun
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Expired State */}
          {verificationState === 'expired' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Link Verifikasi Kedaluwarsa
              </h1>
              <p className="text-gray-600 mb-6">
                {result?.message || 'Link verifikasi email telah kedaluwarsa. Silakan minta link baru.'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isResending ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                </button>
                
                <button
                  onClick={handleGoToSubscription}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Daftar Ulang
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {verificationState === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Verifikasi Gagal
              </h1>
              <p className="text-gray-600 mb-6">
                {result?.message || 'Terjadi kesalahan saat memverifikasi email Anda.'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isResending ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                </button>
                
                <button
                  onClick={() => verifyEmail(token)}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Coba Lagi
                </button>
                
                <button
                  onClick={handleGoToSubscription}
                  className="w-full text-gray-500 px-6 py-2 text-sm hover:text-gray-700 transition-colors"
                >
                  Daftar Ulang
                </button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Butuh bantuan?{' '}
              <a 
                href="mailto:support@sppg-platform.com" 
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Hubungi Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}