import { useQuery } from '@tanstack/react-query'
import { useDashboardStore } from '../store'
import { todayOperationSchema, activitySchema } from '../schemas'

// Hook for today's operation data
export const useDashboardOperations = () => {
  const { 
    todayOperation,
    isOperationLoading
  } = useDashboardStore()

  const todayOperationQuery = useQuery({
    queryKey: ['sppg', 'dashboard', 'today-operation'],
    queryFn: async () => {
      const response = await fetch('/api/sppg/dashboard/today-operation')
      if (!response.ok) {
        throw new Error('Failed to fetch today operation')
      }
      const data = await response.json()
      return todayOperationSchema.parse(data)
    },
    refetchInterval: 60000 // Refetch every minute
  })

  return {
    todayOperation,
    isOperationLoading: todayOperationQuery.isLoading || isOperationLoading,
    error: todayOperationQuery.error,
    refetch: todayOperationQuery.refetch
  }
}

// Hook for recent activities
export const useRecentActivities = () => {
  const { 
    recentActivities,
    isActivitiesLoading
  } = useDashboardStore()

  const recentActivitiesQuery = useQuery({
    queryKey: ['sppg', 'dashboard', 'recent-activities'],
    queryFn: async () => {
      const response = await fetch('/api/sppg/dashboard/recent-activities')
      if (!response.ok) {
        throw new Error('Failed to fetch recent activities')
      }
      const data = await response.json()
      
      // Validate each activity with schema
      const validatedActivities = data.map((activity: unknown) => 
        activitySchema.parse(activity)
      )
      
      return validatedActivities
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  return {
    recentActivities,
    isActivitiesLoading: recentActivitiesQuery.isLoading || isActivitiesLoading,
    error: recentActivitiesQuery.error,
    refetch: recentActivitiesQuery.refetch
  }
}