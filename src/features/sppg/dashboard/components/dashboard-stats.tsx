'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChefHat, 
  Package, 
  Truck, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardMetrics } from '../hooks/use-dashboard-metrics'

export function DashboardStats() {
  // Menggunakan feature hook sesuai kesepakatan
  const { data: metrics, isLoading } = useDashboardMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Gagal memuat metrics dashboard
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      name: 'Produksi Hari Ini',
      value: `${metrics.todayProduction.produced}/${metrics.todayProduction.planned}`,
      subValue: `${metrics.todayProduction.percentage}%`,
      icon: ChefHat,
      status: metrics.todayProduction.status,
      description: 'Porsi diproduksi'
    },
    {
      name: 'Distribusi Hari Ini',
      value: `${metrics.todayDistribution.completed}/${metrics.todayDistribution.scheduled}`,
      subValue: `${metrics.todayDistribution.percentage}%`,
      icon: Truck,
      status: metrics.todayDistribution.status,
      description: 'Rute distribusi'
    },
    {
      name: 'Status Inventori',
      value: metrics.inventory.totalItems,
      subValue: `${metrics.inventory.lowStock} low stock`,
      icon: Package,
      status: metrics.inventory.status,
      description: 'Item total'
    },
    {
      name: 'Staff Hadir',
      value: `${metrics.staff.present}/${metrics.staff.total}`,
      subValue: `${metrics.staff.percentage}%`,
      icon: Users,
      status: metrics.staff.status,
      description: 'Kehadiran staff'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'behind':
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'good':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'behind':
      case 'critical':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.name}
            </CardTitle>
            <div className={cn(
              'rounded-full p-2',
              getStatusColor(stat.status)
            )}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                {getStatusIcon(stat.status)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{stat.description}</span>
                <Badge variant="secondary" className="text-xs">
                  {stat.subValue}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}