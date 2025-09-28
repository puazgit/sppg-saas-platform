import { useQuery } from '@tanstack/react-query'
import { useSuperadminDashboardStore } from '../store'
import type { RegionalDistribution } from '../types'

export function useRegionalData(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options
  const { selectedTimeRange } = useSuperadminDashboardStore()

  return useQuery<RegionalDistribution[]>({
    queryKey: ['regional-distribution', selectedTimeRange],
    queryFn: async (): Promise<RegionalDistribution[]> => {
      const response = await fetch(`/api/superadmin/regional?timeRange=${selectedTimeRange}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch regional data: ${response.statusText}`)
      }
      
      return response.json()
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

export function useRegionalSummary() {
  const { data: regions, isLoading, isError } = useRegionalData()
  
  const summary = {
    totalProvinces: regions?.length || 0,
    totalSppg: regions?.reduce((sum, region) => sum + region.sppgCount, 0) || 0,
    totalActiveSppg: regions?.reduce((sum, region) => sum + region.activeCount, 0) || 0,
    totalBeneficiaries: regions?.reduce((sum, region) => sum + region.totalBeneficiaries, 0) || 0,
    totalStaff: regions?.reduce((sum, region) => sum + region.totalStaff, 0) || 0,
    averageSppgPerProvince: regions?.length ? 
      Math.round((regions.reduce((sum, region) => sum + region.sppgCount, 0) / regions.length)) : 0,
  }
  
  const topRegions = regions
    ?.sort((a, b) => b.sppgCount - a.sppgCount)
    .slice(0, 5) || []
  
  return {
    summary,
    topRegions,
    allRegions: regions,
    isLoading,
    isError
  }
}