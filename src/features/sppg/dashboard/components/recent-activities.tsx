'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  Clock, 
  User, 
  Package, 
  Truck, 
  ChefHat,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRecentActivities } from '../hooks/use-dashboard-operations'
import { useDashboardStore } from '../store'

const activityIcons = {
  PRODUCTION: ChefHat,
  DISTRIBUTION: Truck,
  INVENTORY: Package,
  STAFF: User,
  SYSTEM: Activity
}

export function RecentActivities() {
  // Menggunakan feature hook sesuai kesepakatan
  const { recentActivities: activities, isActivitiesLoading: isLoading } = useRecentActivities()
  const { isActivitiesLoading } = useDashboardStore()

  if (isLoading || isActivitiesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Aktivitas Terkini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Aktivitas Terkini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {!activities || activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type]
                const timeAgo = formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                  locale: id
                })

                return (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        {activity.status && (
                          <div className="flex items-center gap-1">
                            {activity.status === 'SUCCESS' && (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            )}
                            {activity.status === 'WARNING' && (
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                            )}
                            {activity.status === 'ERROR' && (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            oleh {activity.user}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {timeAgo}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}