'use client'

import { useSession } from 'next-auth/react'
import { DistributionStats as DistributionStatsComponent, DistributionOverview } from '@/features/sppg/distribution'
import { useDistributionStats } from '@/features/sppg/distribution'

export default function DistributionPage() {
  const { data: session } = useSession()
  const sppgId = session?.user?.sppgId || ''

  // Fetch distribution stats
  useDistributionStats(sppgId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribusi</h1>
        <p className="text-muted-foreground">
          Kelola titik distribusi, penerima manfaat, dan riwayat distribusi makanan
        </p>
      </div>

      <DistributionStatsComponent />
      <DistributionOverview />
    </div>
  )
}