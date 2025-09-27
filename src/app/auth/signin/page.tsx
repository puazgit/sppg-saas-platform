import { LoginForm } from '@/features/auth'
import { NavigationHeader } from '@/components/navigation-header'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Masuk - SPPG SaaS Platform',
  description: 'Masuk ke akun SPPG Anda untuk mengelola sistem pelayanan gizi.',
}

/**
 * Halaman Sign In - NextAuth v5 Custom Page
 * 
 * Sesuai kesepakatan DEVELOPMENT_AGREEMENT.md:
 * ✅ Menggunakan LoginForm dari src/features/auth
 * ✅ Real NextAuth integration (tidak mock)
 * ✅ Zod validation + React Hook Form
 * ✅ Shadcn/UI components
 * ✅ Role-based redirect handling
 */
export default function SignInPage() {
  return (
    <>
      <NavigationHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              SPPG SaaS Platform
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistem Manajemen SPPG Terdepan
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Belum punya akun SPPG?</p>
            <Link 
              href="/#contact" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline font-medium"
            >
              Hubungi tim kami untuk registrasi
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}