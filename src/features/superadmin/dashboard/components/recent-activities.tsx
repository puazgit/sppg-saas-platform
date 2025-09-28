"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  User, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react'
import { useDashboardMetrics } from '../hooks/use-dashboard-metrics'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function RecentActivities() {
  const { data: metrics, isLoading, error } = useDashboardMetrics()

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Recent Activities Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load activity data
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <RecentActivitiesSkeleton />
  }

  const { recentActivities } = metrics!

  const getActivityIcon = (type: string, severity: string) => {
    switch (type) {
      case 'user_action':
        return <User className="h-4 w-4" />
      case 'system_event':
        return <Activity className="h-4 w-4" />
      case 'sppg_update':
        return <Building className="h-4 w-4" />
      default:
        switch (severity) {
          case 'high':
            return <AlertTriangle className="h-4 w-4" />
          case 'medium':
            return <AlertCircle className="h-4 w-4" />
          case 'low':
            return <Info className="h-4 w-4" />
          default:
            return <CheckCircle className="h-4 w-4" />
        }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-blue-600'
      default:
        return 'text-green-600'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>
      default:
        return <Badge variant="default" className="text-xs">Info</Badge>
    }
  }

  const getUserInitials = (email: string, name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
        <Badge variant="outline">
          {recentActivities.length} Activities
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada aktivitas terkini</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(
                          String(activity.metadata.email || ''), 
                          String(activity.metadata.email || '')
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={getSeverityColor(activity.severity)}>
                          {getActivityIcon(activity.type, activity.severity)}
                        </div>
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                      </div>
                      {getSeverityBadge(activity.severity)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {String(activity.metadata.userType || 'USER')}
                        </Badge>
                        <span>{String(activity.metadata.email || 'Unknown')}</span>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(activity.timestamp), 
                          { 
                            addSuffix: true,
                            locale: idLocale 
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {recentActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Showing {recentActivities.length} recent activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecentActivitiesSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}