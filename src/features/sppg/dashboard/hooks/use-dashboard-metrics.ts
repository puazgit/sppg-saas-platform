import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { useDashboardStore } from '../store'
import { dashboardMetricsSchema, type DashboardMetrics } from '../schemas'

// Dashboard Metrics Hook - Simplified and focused
export function useDashboardMetrics() {
  const { user } = useAuth()
  const { setMetrics, dashboardRefreshInterval } = useDashboardStore()

  return useQuery({
    queryKey: ['sppg', 'dashboard', 'metrics', user?.sppgId],
    queryFn: async (): Promise<DashboardMetrics> => {
      const response = await fetch('/api/sppg/dashboard/metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard metrics')
      }
      const data = await response.json()
      
      // Validate with Zod schema
      const validatedData = dashboardMetricsSchema.parse(data)
      
      // Update Zustand store
      setMetrics(validatedData)
      
      return validatedData
    },
    enabled: !!user?.sppgId && user?.userType === 'SPPG_USER',
    refetchInterval: dashboardRefreshInterval || 60000,
    refetchOnWindowFocus: false
  })
}