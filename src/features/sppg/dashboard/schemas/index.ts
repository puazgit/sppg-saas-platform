import { z } from 'zod'

// Dashboard Metrics Schema
export const dashboardMetricsSchema = z.object({
  todayProduction: z.object({
    planned: z.number(),
    produced: z.number(),
    percentage: z.number(),
    status: z.enum(['on_track', 'behind', 'completed'])
  }),
  todayDistribution: z.object({
    scheduled: z.number(),
    completed: z.number(),
    percentage: z.number(),
    status: z.enum(['on_track', 'behind', 'completed'])
  }),
  inventory: z.object({
    lowStock: z.number(),
    expiringSoon: z.number(),
    totalItems: z.number(),
    status: z.enum(['good', 'warning', 'critical'])
  }),
  staff: z.object({
    present: z.number(),
    total: z.number(),
    percentage: z.number(),
    status: z.enum(['good', 'warning', 'critical'])
  })
})

// Today Operation Schema
export const todayOperationSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED']),
  plannedPortions: z.number(),
  producedPortions: z.number(),
  distributedPortions: z.number(),
  staffPresent: z.number(),
  menusServed: z.array(z.string()),
  weather: z.string().optional(),
  notes: z.string().optional(),
  productions: z.array(z.object({
    id: z.string(),
    menuName: z.string(),
    batchCount: z.number(),
    totalServings: z.number(),
    status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'QUALITY_CHECK']),
    startTime: z.string().optional(),
    endTime: z.string().optional()
  })),
  distributions: z.array(z.object({
    id: z.string(),
    distributionPointName: z.string(),
    scheduledTime: z.string(),
    actualTime: z.string().optional(),
    portionsDelivered: z.number(),
    status: z.enum(['SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'DELAYED'])
  }))
})

// Activity Schema
export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['PRODUCTION', 'DISTRIBUTION', 'INVENTORY', 'STAFF', 'SYSTEM']),
  title: z.string(),
  description: z.string(),
  user: z.string(),
  timestamp: z.string(),
  status: z.enum(['SUCCESS', 'WARNING', 'ERROR']).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

// Exported Types
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>
export type TodayOperation = z.infer<typeof todayOperationSchema>
export type Activity = z.infer<typeof activitySchema>