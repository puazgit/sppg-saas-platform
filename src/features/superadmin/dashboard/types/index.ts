// Dashboard Component Types
export interface DashboardStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  loading?: boolean
}

export interface SystemHealthIndicatorProps {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  memoryUsage: number
  cpuUsage: number
  lastChecked: string
}

export interface RegionalMapProps {
  data: Array<{
    provinceId: string
    provinceName: string
    sppgCount: number
    activeCount: number
    coordinates?: [number, number]
  }>
  onRegionClick?: (provinceId: string) => void
}

export interface RevenueChartProps {
  data: Array<{
    period: string
    revenue: number
    subscriptions: number
    growth: number
  }>
  timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly'
  onTimeRangeChange?: (range: string) => void
}

export interface ActivityTimelineProps {
  activities: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    user?: {
      name: string
      avatar?: string
    }
    metadata?: Record<string, unknown>
  }>
  showFilters?: boolean
  maxItems?: number
}

export interface SubscriptionBreakdownProps {
  data: Array<{
    tier: string
    count: number
    revenue: number
    percentage: number
    trend: number
  }>
  showDetails?: boolean
}

// Dashboard Hook Types
export interface UseDashboardMetricsOptions {
  refreshInterval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

export interface UseDashboardMetricsReturn {
  data: SuperadminDashboard | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  lastUpdated: Date | null
}

// Store Types
export interface DashboardState {
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

export interface DashboardActions {
  setTimeRange: (range: 'daily' | 'weekly' | 'monthly' | 'yearly') => void
  setSelectedRegion: (region: string | null) => void
  toggleSystemHealth: () => void
  toggleAutoRefresh: () => void
  setRefreshInterval: (interval: number) => void
  updateFilters: (filters: Partial<DashboardState['filters']>) => void
  resetFilters: () => void
}

export type DashboardStore = DashboardState & DashboardActions

// Re-export schema types
import type {
  SystemHealth,
  PlatformMetrics,
  RegionalDistribution,
  SubscriptionAnalytics,
  SuperadminActivity,
  SuperadminDashboard,
} from '../schemas'

export type {
  SystemHealth,
  PlatformMetrics,
  RegionalDistribution,
  SubscriptionAnalytics,
  SuperadminActivity,
  SuperadminDashboard,
}