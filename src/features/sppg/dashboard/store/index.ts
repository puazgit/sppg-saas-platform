import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DashboardMetrics, TodayOperation, Activity } from '../types'

interface DashboardState {
  // Dashboard State
  metrics: DashboardMetrics | null
  todayOperation: TodayOperation | null
  recentActivities: Activity[]
  
  // UI State
  isMetricsLoading: boolean
  isOperationLoading: boolean
  isActivitiesLoading: boolean
  
  // Filters & Preferences
  dashboardRefreshInterval: number
  selectedOperationView: 'overview' | 'production' | 'distribution'
}

interface DashboardActions {
  // Metrics Actions
  setMetrics: (metrics: DashboardMetrics) => void
  setMetricsLoading: (loading: boolean) => void
  
  // Operation Actions  
  setTodayOperation: (operation: TodayOperation | null) => void
  setOperationLoading: (loading: boolean) => void
  
  // Activities Actions
  setRecentActivities: (activities: Activity[]) => void
  setActivitiesLoading: (loading: boolean) => void
  addActivity: (activity: Activity) => void
  
  // UI Actions
  setRefreshInterval: (interval: number) => void
  setSelectedOperationView: (view: 'overview' | 'production' | 'distribution') => void
  
  // Reset Actions
  resetDashboardState: () => void
}

const initialState: DashboardState = {
  metrics: null,
  todayOperation: null,
  recentActivities: [],
  isMetricsLoading: false,
  isOperationLoading: false,
  isActivitiesLoading: false,
  dashboardRefreshInterval: 60000, // 1 minute default
  selectedOperationView: 'overview'
}

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  devtools(
    (set) => ({
      ...initialState,
      
      // Metrics Actions
      setMetrics: (metrics) => set({ metrics }, false, 'setMetrics'),
      setMetricsLoading: (isMetricsLoading) => set({ isMetricsLoading }, false, 'setMetricsLoading'),
      
      // Operation Actions
      setTodayOperation: (todayOperation) => set({ todayOperation }, false, 'setTodayOperation'),
      setOperationLoading: (isOperationLoading) => set({ isOperationLoading }, false, 'setOperationLoading'),
      
      // Activities Actions
      setRecentActivities: (recentActivities) => set({ recentActivities }, false, 'setRecentActivities'),
      setActivitiesLoading: (isActivitiesLoading) => set({ isActivitiesLoading }, false, 'setActivitiesLoading'),
      addActivity: (activity) => set((state) => ({ 
        recentActivities: [activity, ...state.recentActivities].slice(0, 20) // Keep only 20 recent
      }), false, 'addActivity'),
      
      // UI Actions
      setRefreshInterval: (dashboardRefreshInterval) => set({ dashboardRefreshInterval }, false, 'setRefreshInterval'),
      setSelectedOperationView: (selectedOperationView) => set({ selectedOperationView }, false, 'setSelectedOperationView'),
      
      // Reset Actions
      resetDashboardState: () => set(initialState, false, 'resetDashboardState')
    }),
    {
      name: 'dashboard-store',
      // Only enable in development
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)