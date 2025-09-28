// SPPG Dashboard Module Exports
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture

// Types and Schemas
export type { DashboardMetrics, TodayOperation, Activity } from './types'
export { dashboardMetricsSchema, todayOperationSchema, activitySchema } from './schemas'

// Store
export * from './store'

// Hooks
export * from './hooks'

// Components
export * from './components'