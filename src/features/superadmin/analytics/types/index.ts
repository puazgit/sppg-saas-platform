export interface AnalyticsComponentProps {
  className?: string
  timeRange?: string
}

export interface AnalyticsMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
    forecast: number
  }
  users: {
    total: number
    active: number
    new: number
    churn: number
  }
  subscriptions: {
    total: number
    active: number
    trials: number
    conversions: number
  }
}

export interface AnalyticsHookOptions {
  timeRange?: string
  enabled?: boolean
  refetchInterval?: number
}