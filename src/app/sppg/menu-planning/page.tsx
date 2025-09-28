'use client'

import { useSession } from 'next-auth/react'
import { MenuPlanningStatsComponent, MenuPlanningOverview } from '@/features/sppg/menu-planning'
import { 
  useMenuPlanningStats, 
  useRecipes, 
  useMenuPlans, 
  useMenuTemplates 
} from '@/features/sppg/menu-planning'

export default function MenuPlanningPage() {
  const { data: session } = useSession()
  const sppgId = session?.user?.sppgId || ''

  // Fetch all menu planning data
  useMenuPlanningStats(sppgId)
  useRecipes(sppgId)
  useMenuPlans(sppgId)
  useMenuTemplates(sppgId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perencanaan Menu</h1>
        <p className="text-muted-foreground">
          Kelola resep, rencana menu, dan template untuk distribusi makanan yang optimal
        </p>
      </div>

      <MenuPlanningStatsComponent />
      <MenuPlanningOverview />
    </div>
  )
}