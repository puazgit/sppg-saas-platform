import { useQuery } from '@tanstack/react-query'
import { useSuperadminDashboardStore } from '../store'
import type { SuperadminActivity } from '../types'

interface ActivityFilters {
  types?: string[]
  severityLevels?: string[]
  dateRange?: {
    start: Date | null
    end: Date | null
  }
  limit?: number
}

export function useActivityTimeline(options: { enabled?: boolean } & ActivityFilters = {}) {
  const { enabled = true, types, severityLevels, dateRange, limit = 50 } = options
  const { filters } = useSuperadminDashboardStore()

  // Merge store filters with component-level filters
  const mergedFilters = {
    types: types || filters.activityTypes,
    severityLevels: severityLevels || filters.severityLevels,
    dateRange: dateRange || filters.dateRange,
    limit,
  }

  return useQuery<SuperadminActivity[]>({
    queryKey: ['activity-timeline', mergedFilters],
    queryFn: async (): Promise<SuperadminActivity[]> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
      })

      if (mergedFilters.types.length > 0) {
        params.append('types', mergedFilters.types.join(','))
      }

      if (mergedFilters.severityLevels.length > 0) {
        params.append('severity', mergedFilters.severityLevels.join(','))
      }

      if (mergedFilters.dateRange.start) {
        params.append('startDate', mergedFilters.dateRange.start.toISOString())
      }

      if (mergedFilters.dateRange.end) {
        params.append('endDate', mergedFilters.dateRange.end.toISOString())
      }

      const response = await fetch(`/api/superadmin/activities?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.statusText}`)
      }
      
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  })
}