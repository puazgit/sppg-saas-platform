import { z } from 'zod'

// Analytics data schemas
export const analyticsDataSchema = z.object({
  revenue: z.object({
    current: z.number(),
    previous: z.number(),
    growth: z.number(),
    forecast: z.number()
  }),
  users: z.object({
    total: z.number(),
    active: z.number(),
    new: z.number(),
    churn: z.number()
  }),
  subscriptions: z.object({
    total: z.number(),
    active: z.number(),
    trials: z.number(),
    conversions: z.number()
  })
})

export const analyticsFilterSchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  metrics: z.array(z.string()).optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day')
})

export type AnalyticsData = z.infer<typeof analyticsDataSchema>
export type AnalyticsFilter = z.infer<typeof analyticsFilterSchema>