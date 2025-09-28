import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDistributionStore } from '../store/use-distribution-store'
import type { 
  DistributionStats
} from '../types'

// Mock API functions - replace with real API calls
const distributionAPI = {
  getStats: async (): Promise<DistributionStats> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      todayDistributions: 15,
      completedDistributions: 12,
      pendingDistributions: 3,
      totalRecipients: 450,
      totalPortionsDistributed: 1250,
      averageDeliveryTime: 25,
      onTimeDeliveryRate: 92.5,
      beneficiarySatisfaction: 4.2
    }
  }
}

// Distribution Stats Hook
export function useDistributionStats(sppgId: string) {
  const query = useQuery({
    queryKey: ['distribution-stats', sppgId],
    queryFn: () => distributionAPI.getStats(),
    enabled: !!sppgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // 30 seconds
  })

  // Update store when data changes
  const { setStats, setStatsLoading } = useDistributionStore()
  
  React.useEffect(() => {
    if (query.data) {
      setStats(query.data)
    }
    setStatsLoading(query.isLoading)
  }, [query.data, query.isLoading, setStats, setStatsLoading])

  return query
}

// Simplified hooks for now - can be expanded later
export function useDistributionPoints(sppgId: string) {
  const query = useQuery({
    queryKey: ['distribution-points', sppgId],
    queryFn: () => Promise.resolve([]),
    enabled: !!sppgId
  })
  
  const { setPointsLoading } = useDistributionStore()
  
  React.useEffect(() => {
    setPointsLoading(query.isLoading)
  }, [query.isLoading, setPointsLoading])
  
  return query
}

export function useDistributionLogs(sppgId: string) {
  const query = useQuery({
    queryKey: ['distribution-logs', sppgId],
    queryFn: () => Promise.resolve([]),
    enabled: !!sppgId
  })
  
  const { setLogsLoading } = useDistributionStore()
  
  React.useEffect(() => {
    setLogsLoading(query.isLoading)
  }, [query.isLoading, setLogsLoading])
  
  return query
}

export function useBeneficiaries(sppgId: string) {
  const query = useQuery({
    queryKey: ['beneficiaries', sppgId],
    queryFn: () => Promise.resolve([]),
    enabled: !!sppgId
  })
  
  const { setBeneficiariesLoading } = useDistributionStore()
  
  React.useEffect(() => {
    setBeneficiariesLoading(query.isLoading)
  }, [query.isLoading, setBeneficiariesLoading])
  
  return query
}

// Mutation hooks can be added later when needed
export function useCreateDistributionPoint() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribution-points'] })
    }
  })
}

export function useCreateBeneficiary() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] })
    }
  })
}