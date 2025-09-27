import { NavigationHeader } from '@/components/navigation-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kesalahan Autentikasi - SPPG SaaS Platform',
  description: 'Terjadi kesalahan saat proses autentikasi.',
}

interface AuthErrorPageProps {
  searchParams: {
    error?: string
  }
}

const errorMessages: Record<string, string> = {
  'Configuration': 'Terjadi kesalahan konfigurasi sistem. Silakan hubungi administrator.',
  'AccessDenied': 'Akses ditolak. Anda tidak memiliki izin untuk mengakses sistem ini.',
  'Verification': 'Token verifikasi tidak valid atau telah kedaluwarsa.',
  'Default': 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi atau hubungi administrator.',
}

/**
 * Halaman Error NextAuth v5 - Sesuai kesepakatan DEVELOPMENT_AGREEMENT.md
 * 
 * ✅ Custom error handling untuk NextAuth
 * ✅ User-friendly error messages dalam Bahasa Indonesia
 * ✅ Consistent design dengan platform
 * ✅ Clear navigation back to signin/home
 */
export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <>
      <NavigationHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SPPG SaaS Platform
            </h1>
            <p className="text-gray-600">
              Kesalahan Autentikasi
            </p>
          </div>

          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Kesalahan Autentikasi
              </CardTitle>
              <CardDescription>
                Terjadi masalah saat proses masuk ke sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  {errorMessage}
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Coba Masuk Lagi
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
                  </Link>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Masih mengalami masalah?</p>
                <Link 
                  href="/#contact" 
                  className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
                >
                  Hubungi tim support kami
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}