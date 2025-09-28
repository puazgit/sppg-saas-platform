import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AnalyticsMetrics } from '../types'

interface AnalyticsState {
  metrics: AnalyticsMetrics | null
  timeRange: string
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

interface AnalyticsActions {
  setMetrics: (metrics: AnalyticsMetrics) => void
  setTimeRange: (timeRange: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

type AnalyticsStore = AnalyticsState & AnalyticsActions

const initialState: AnalyticsState = {
  metrics: null,
  timeRange: '30d',
  isLoading: false,
  error: null,
  lastUpdated: null
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setMetrics: (metrics) => set(
          { metrics, lastUpdated: new Date().toISOString(), error: null },
          false,
          'analytics/setMetrics'
        ),
        
        setTimeRange: (timeRange) => set(
          { timeRange },
          false,
          'analytics/setTimeRange'
        ),
        
        setLoading: (isLoading) => set(
          { isLoading },
          false,
          'analytics/setLoading'
        ),
        
        setError: (error) => set(
          { error, isLoading: false },
          false,
          'analytics/setError'
        ),
        
        reset: () => set(
          initialState,
          false,
          'analytics/reset'
        )
      }),
      {
        name: 'superadmin-analytics-store',
        partialize: (state) => ({
          timeRange: state.timeRange,
          lastUpdated: state.lastUpdated
        })
      }
    ),
    { name: 'SuperAdminAnalyticsStore' }
  )
)