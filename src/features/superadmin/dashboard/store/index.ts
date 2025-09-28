import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface DashboardState {
  selectedTimeRange: 'daily' | 'weekly' | 'monthly' | 'yearly'
  selectedRegion: string | null
  showSystemHealth: boolean
  autoRefresh: boolean
  refreshInterval: number
  filters: {
    activityTypes: string[]
    severityLevels: string[]
    dateRange: {
      start: Date | null
      end: Date | null
    }
  }
}

interface DashboardActions {
  setTimeRange: (range: 'daily' | 'weekly' | 'monthly' | 'yearly') => void
  setSelectedRegion: (region: string | null) => void
  toggleSystemHealth: () => void
  toggleAutoRefresh: () => void
  setRefreshInterval: (interval: number) => void
  updateFilters: (filters: Partial<DashboardState['filters']>) => void
  resetFilters: () => void
}

type SuperadminDashboardStore = DashboardState & DashboardActions

const defaultFilters: DashboardState['filters'] = {
  activityTypes: [],
  severityLevels: [],
  dateRange: {
    start: null,
    end: null,
  },
}

export const useSuperadminDashboardStore = create<SuperadminDashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        selectedTimeRange: 'monthly',
        selectedRegion: null,
        showSystemHealth: true,
        autoRefresh: true,
        refreshInterval: 30000, // 30 seconds
        filters: defaultFilters,

        // Actions
        setTimeRange: (range) => {
          set({ selectedTimeRange: range }, false, 'setTimeRange')
        },

        setSelectedRegion: (region) => {
          set({ selectedRegion: region }, false, 'setSelectedRegion')
        },

        toggleSystemHealth: () => {
          set(
            (state) => ({ showSystemHealth: !state.showSystemHealth }),
            false,
            'toggleSystemHealth'
          )
        },

        toggleAutoRefresh: () => {
          set(
            (state) => ({ autoRefresh: !state.autoRefresh }),
            false,
            'toggleAutoRefresh'
          )
        },

        setRefreshInterval: (interval) => {
          set({ refreshInterval: interval }, false, 'setRefreshInterval')
        },

        updateFilters: (newFilters) => {
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters },
            }),
            false,
            'updateFilters'
          )
        },

        resetFilters: () => {
          set({ filters: defaultFilters }, false, 'resetFilters')
        },
      }),
      {
        name: 'superadmin-dashboard-store',
        partialize: (state) => ({
          selectedTimeRange: state.selectedTimeRange,
          showSystemHealth: state.showSystemHealth,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
        }),
      }
    ),
    {
      name: 'superadmin-dashboard',
    }
  )
)

// Selector hooks for better performance
export const useTimeRange = () =>
  useSuperadminDashboardStore((state) => state.selectedTimeRange)

export const useSelectedRegion = () =>
  useSuperadminDashboardStore((state) => state.selectedRegion)

export const useSystemHealthVisibility = () =>
  useSuperadminDashboardStore((state) => state.showSystemHealth)

export const useAutoRefresh = () =>
  useSuperadminDashboardStore((state) => ({
    enabled: state.autoRefresh,
    interval: state.refreshInterval,
  }))

export const useDashboardFilters = () =>
  useSuperadminDashboardStore((state) => state.filters)