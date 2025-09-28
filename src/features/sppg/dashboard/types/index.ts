// SPPG Dashboard Module Types
// Sesuai dengan Prisma schema dan DEVELOPMENT_AGREEMENT.md

export interface DashboardMetrics {
  todayProduction: {
    planned: number
    produced: number
    percentage: number
    status: 'on_track' | 'behind' | 'completed'
  }
  todayDistribution: {
    scheduled: number
    completed: number
    percentage: number
    status: 'on_track' | 'behind' | 'completed'
  }
  inventory: {
    lowStock: number
    expiringSoon: number
    totalItems: number
    status: 'good' | 'warning' | 'critical'
  }
  staff: {
    present: number
    total: number
    percentage: number
    status: 'good' | 'warning' | 'critical'
  }
}

export interface TodayOperation {
  id: string
  date: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
  plannedPortions: number
  producedPortions: number
  distributedPortions: number
  staffPresent: number
  menusServed: string[]
  weather?: string
  notes?: string
  productions: Production[]
  distributions: Distribution[]
}

export interface Production {
  id: string
  menuName: string
  batchCount: number
  totalServings: number
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'QUALITY_CHECK'
  startTime?: string
  endTime?: string
}

export interface Distribution {
  id: string
  distributionPointName: string
  scheduledTime: string
  actualTime?: string
  portionsDelivered: number
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED'
}

export interface Activity {
  id: string
  type: 'PRODUCTION' | 'DISTRIBUTION' | 'INVENTORY' | 'STAFF' | 'SYSTEM'
  title: string
  description: string
  user: string
  timestamp: string
  status?: 'SUCCESS' | 'WARNING' | 'ERROR'
  metadata?: Record<string, unknown>
}