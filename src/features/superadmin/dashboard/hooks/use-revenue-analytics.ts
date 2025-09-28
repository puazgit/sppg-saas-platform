import { useQuery } from '@tanstack/react-query'
import { useSuperadminDashboardStore } from '../store'

interface RevenueData {
  period: string
  revenue: number
  subscriptions: number
  growth: number
  churnRate: number
}

interface RevenueAnalytics {
  timeline: RevenueData[]
  summary: {
    totalRevenue: number
    monthlyRecurring: number
    averageGrowth: number
    churnRate: number
    lifetimeValue: number
  }
  projections: {
    nextMonth: number
    nextQuarter: number
    nextYear: number
  }
}

export function useRevenueAnalytics(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options
  const { selectedTimeRange } = useSuperadminDashboardStore()

  return useQuery<RevenueAnalytics>({
    queryKey: ['revenue-analytics', selectedTimeRange],
    queryFn: async (): Promise<RevenueAnalytics> => {
      const response = await fetch(`/api/superadmin/revenue?timeRange=${selectedTimeRange}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch revenue analytics: ${response.statusText}`)
      }
      
      return response.json()
    },
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  })
}

export function useRevenueMetrics() {
  const { data, isLoading, isError } = useRevenueAnalytics()
  
  const getRevenueGrowthTrend = () => {
    if (!data?.timeline || data.timeline.length < 2) return 'stable'
    
    const recentGrowth = data.timeline.slice(-3).map(item => item.growth)
    const avgGrowth = recentGrowth.reduce((sum, growth) => sum + growth, 0) / recentGrowth.length
    
    if (avgGrowth > 10) return 'strong-growth'
    if (avgGrowth > 5) return 'moderate-growth'
    if (avgGrowth > 0) return 'slow-growth'
    if (avgGrowth > -5) return 'declining'
    return 'concerning'
  }
  
  const getHealthScore = () => {
    if (!data) return 0
    
    const growthScore = Math.max(0, Math.min(100, data.summary.averageGrowth * 10))
    const churnScore = Math.max(0, 100 - (data.summary.churnRate * 20))
    const revenueScore = data.summary.totalRevenue > 0 ? 
      Math.min(100, Math.log10(data.summary.totalRevenue) * 20) : 0
    
    return Math.round((growthScore + churnScore + revenueScore) / 3)
  }
  
  return {
    data,
    trend: getRevenueGrowthTrend(),
    healthScore: getHealthScore(),
    isLoading,
    isError,
  }
}