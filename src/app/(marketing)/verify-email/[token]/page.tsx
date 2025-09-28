import { Suspense } from 'react'
import EmailVerificationPage from '@/features/auth/components/email-verification-page'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ token: string }>
}

export const metadata: Metadata = {
  title: 'Verifikasi Email - SPPG Platform',
  description: 'Verifikasi alamat email Anda untuk mengaktifkan akun SPPG Platform'
}

function EmailVerificationContent({ token }: { token: string }) {
  return <EmailVerificationPage token={token} />
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { token } = await params

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <EmailVerificationContent token={token} />
    </Suspense>
  )
}