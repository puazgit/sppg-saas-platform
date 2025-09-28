import { z } from 'zod'

// System Health Monitoring Schema
export const systemHealthSchema = z.object({
  uptime: z.number(),
  memoryUsage: z.object({
    rss: z.number(),
    heapTotal: z.number(),
    heapUsed: z.number(),
    external: z.number(),
  }),
  cpuUsage: z.number(),
  nodeVersion: z.string(),
  environment: z.string(),
  timestamp: z.string(),
  databaseStatus: z.enum(['connected', 'disconnected', 'error']),
  redisStatus: z.enum(['connected', 'disconnected', 'error']).optional(),
})

// Platform Metrics Schema
export const platformMetricsSchema = z.object({
  totalSppg: z.number(),
  activeSppg: z.number(),
  totalUsers: z.number(),
  activeUsers: z.number(),
  totalSubscriptions: z.number(),
  activeSubscriptions: z.number(),
  monthlyRevenue: z.number(),
  yearlyRevenue: z.number(),
  revenueGrowth: z.number(),
  churnRate: z.number(),
})

// Regional Distribution Schema
export const regionalDistributionSchema = z.object({
  provinceId: z.string(),
  provinceName: z.string(),
  sppgCount: z.number(),
  activeCount: z.number(),
  totalBeneficiaries: z.number(),
  totalStaff: z.number(),
})

// Subscription Analytics Schema
export const subscriptionAnalyticsSchema = z.object({
  tier: z.enum(['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']),
  count: z.number(),
  revenue: z.number(),
  avgBeneficiaries: z.number(),
  retentionRate: z.number(),
})

// Recent Activities Schema
export const superadminActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['sppg_registration', 'subscription_change', 'system_alert', 'user_action']),
  title: z.string(),
  description: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  timestamp: z.string(),
  userId: z.string().optional(),
  sppgId: z.string().optional(),
})

// Dashboard Data Response Schema
export const superadminDashboardSchema = z.object({
  systemHealth: systemHealthSchema,
  platformMetrics: platformMetricsSchema,
  regionalDistribution: z.array(regionalDistributionSchema),
  subscriptionAnalytics: z.array(subscriptionAnalyticsSchema),
  recentActivities: z.array(superadminActivitySchema),
  timestamp: z.string(),
})

export type SystemHealth = z.infer<typeof systemHealthSchema>
export type PlatformMetrics = z.infer<typeof platformMetricsSchema>
export type RegionalDistribution = z.infer<typeof regionalDistributionSchema>
export type SubscriptionAnalytics = z.infer<typeof subscriptionAnalyticsSchema>
export type SuperadminActivity = z.infer<typeof superadminActivitySchema>
export type SuperadminDashboard = z.infer<typeof superadminDashboardSchema>