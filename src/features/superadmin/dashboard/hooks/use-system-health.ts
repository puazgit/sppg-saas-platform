import { useQuery } from '@tanstack/react-query'
import type { SystemHealth } from '../types'

export function useSystemHealth(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options

  return useQuery<SystemHealth>({
    queryKey: ['system-health'],
    queryFn: async (): Promise<SystemHealth> => {
      const response = await fetch('/api/superadmin/system/health')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch system health: ${response.statusText}`)
      }
      
      return response.json()
    },
    refetchInterval: 10000, // Check every 10 seconds
    refetchIntervalInBackground: true,
    enabled,
    staleTime: 5000, // 5 seconds
    retry: (failureCount, error) => {
      // Don't retry if it's a client error (4xx)
      if (error instanceof Error && error.message.includes('4')) {
        return false
      }
      return failureCount < 3
    }
  })
}

export function useSystemStatus() {
  const { data: health, isLoading, isError } = useSystemHealth()
  
  const getOverallStatus = () => {
    if (isLoading) return 'checking'
    if (isError || !health) return 'critical'
    
    const memoryUsagePercent = (health.memoryUsage.heapUsed / health.memoryUsage.heapTotal) * 100
    const cpuUsagePercent = health.cpuUsage
    
    if (health.databaseStatus === 'error' || (health.redisStatus && health.redisStatus === 'error')) {
      return 'critical'
    }
    
    if (memoryUsagePercent > 90 || cpuUsagePercent > 80) {
      return 'warning'
    }
    
    return 'healthy'
  }
  
  return {
    status: getOverallStatus(),
    health,
    isLoading,
    isError
  }
}