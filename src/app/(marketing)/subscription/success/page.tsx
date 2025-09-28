import { Suspense } from 'react'
import { Metadata } from 'next'
import RegistrationSuccessPage from '@/features/subscription/components/registration-success-page'

interface PageProps {
  searchParams: Promise<{
    sppgId?: string
    subscriptionId?: string
    organizationName?: string
    email?: string
    verificationSent?: string
    trialEndDate?: string
  }>
}

export const metadata: Metadata = {
  title: 'Registrasi Berhasil - SPPG Platform',
  description: 'Registrasi SPPG berhasil. Silakan verifikasi email untuk mengaktifkan akun.'
}

export default async function RegistrationSuccessRoute({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Parse registration data from URL parameters
  const registrationData = params.sppgId ? {
    sppgId: params.sppgId,
    subscriptionId: params.subscriptionId || '',
    organizationName: params.organizationName || 'Organisasi Anda',
    email: params.email || '',
    verificationSent: params.verificationSent === 'true',
    trialEndDate: params.trialEndDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  } : undefined

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <RegistrationSuccessPage registrationData={registrationData} />
    </Suspense>
  )
}