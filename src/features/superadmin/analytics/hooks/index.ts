import { useQuery } from '@tanstack/react-query'
import type { AnalyticsMetrics, AnalyticsHookOptions } from '../types'
import { useAnalyticsStore } from '../store'

export function useAnalyticsMetrics(options: AnalyticsHookOptions = {}) {
  const { timeRange = '30d', enabled = true, refetchInterval = 30000 } = options
  const { setMetrics, setLoading, setError } = useAnalyticsStore()
  
  return useQuery({
    queryKey: ['analytics-metrics', timeRange],
    queryFn: async (): Promise<AnalyticsMetrics> => {
      setLoading(true)
      
      try {
        const response = await fetch(`/api/superadmin/analytics?timeRange=${timeRange}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setMetrics(data)
        setError(null)
        
        return data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics'
        setError(errorMessage)
        throw error
      } finally {
        setLoading(false)
      }
    },
    enabled,
    refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes,
  })
}

export function useAnalyticsData() {
  return useAnalyticsStore()
}