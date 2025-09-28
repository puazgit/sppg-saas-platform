import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { SppgLayoutProvider } from '@/features/sppg/layout'

// SPPG Layout - Route Protection + Layout Provider
export default async function SppgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side session verification
  const session = await auth()
  
  // Protect SPPG routes - hanya user SPPG yang boleh akses
  if (!session?.user || session.user.userType !== 'SPPG_USER') {
    notFound()
  }

  return (
    <SppgLayoutProvider user={session.user}>
      {children}
    </SppgLayoutProvider>
  )
}