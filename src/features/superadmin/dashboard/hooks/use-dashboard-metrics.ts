import { useQuery } from '@tanstack/react-query'
import { useSuperadminDashboardStore } from '../store'
import type { SuperadminDashboard } from '../types'

interface UseDashboardMetricsOptions {
  refreshInterval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

export function useDashboardMetrics(options: UseDashboardMetricsOptions = {}) {
  const { refreshInterval = 30000, enabled = true, onError } = options
  const { autoRefresh, selectedTimeRange } = useSuperadminDashboardStore()

  return useQuery<SuperadminDashboard>({
    queryKey: ['superadmin-dashboard', selectedTimeRange],
    queryFn: async (): Promise<SuperadminDashboard> => {
      const response = await fetch(`/api/superadmin/metrics?timeRange=${selectedTimeRange}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard metrics: ${response.statusText}`)
      }
      
      return response.json()
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: false,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: onError || ((error: Error) => {
        console.error('Dashboard metrics fetch error:', error)
      })
    }
  })
}

export function useDashboardMetricsPolling() {
  const { autoRefresh, refreshInterval } = useSuperadminDashboardStore()
  
  return useDashboardMetrics({
    refreshInterval,
    enabled: autoRefresh,
  })
}