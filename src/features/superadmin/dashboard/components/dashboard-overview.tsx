"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Building, Users, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react'
import { useDashboardMetrics } from '../hooks/use-dashboard-metrics'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'

export function DashboardOverview() {
  const { 
    data: metrics, 
    isLoading, 
    error, 
    isRefetching 
  } = useDashboardMetrics()

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <CardTitle className="text-sm font-medium ml-2 text-red-900 dark:text-red-100">Dashboard Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 dark:text-red-300">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <DashboardOverviewSkeleton />
  }

  const {
    platformMetrics,
    systemHealth,
    timestamp
  } = metrics!

  return (
    <div className="space-y-6">
      {/* System Status Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Platform status dan metrics real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={systemHealth.databaseStatus === 'connected' ? 'default' : 'destructive'}
            className={`flex items-center gap-1 ${
              systemHealth.databaseStatus === 'connected' 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            <Activity className="h-3 w-3" />
            {systemHealth.databaseStatus === 'connected' ? 'healthy' : 'error'}
          </Badge>
          {isRefetching && (
            <Badge variant="outline" className="animate-pulse border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
              <Activity className="h-3 w-3 mr-1" />
              Refreshing...
            </Badge>
          )}
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total SPPG</CardTitle>
            <Building className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(platformMetrics.totalSppg)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="text-green-600 dark:text-green-400 font-medium">
                {formatNumber(platformMetrics.activeSppg)}
              </span>
              {' '}aktif dari total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(platformMetrics.totalUsers)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="text-green-600 dark:text-green-400 font-medium">
                {formatNumber(platformMetrics.activeUsers)}
              </span>
              {' '}aktif bulan ini
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(platformMetrics.activeSubscriptions)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              dari {formatNumber(platformMetrics.totalSubscriptions)} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(platformMetrics.monthlyRevenue)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
              {platformMetrics.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 mr-1 rotate-180" />
              )}
              {formatPercentage(Math.abs(platformMetrics.revenueGrowth))}
              {platformMetrics.revenueGrowth >= 0 ? ' growth' : ' decline'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Details */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Uptime</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Math.floor(systemHealth.uptime / 3600)}h{' '}
                {Math.floor((systemHealth.uptime % 3600) / 60)}m
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Memory Usage</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round(systemHealth.memoryUsage.heapUsed / 1024 / 1024)}MB
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Node Version</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {systemHealth.nodeVersion}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            Last updated: {new Date(timestamp).toLocaleString('id-ID')}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Revenue</span>
              <span className="font-bold">
                {formatCurrency(platformMetrics.monthlyRevenue)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Yearly Projection</span>
              <span className="font-bold">
                {formatCurrency(platformMetrics.yearlyRevenue)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Churn Rate</span>
              <Badge variant={platformMetrics.churnRate > 10 ? 'destructive' : 'default'}>
                {formatPercentage(platformMetrics.churnRate)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Subscription Rate</span>
              <span className="font-bold">
                {formatPercentage(
                  platformMetrics.totalUsers > 0 
                    ? (platformMetrics.activeSubscriptions / platformMetrics.totalUsers) * 100 
                    : 0
                )}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">SPPG Activation Rate</span>
              <span className="font-bold">
                {formatPercentage(
                  platformMetrics.totalSppg > 0 
                    ? (platformMetrics.activeSppg / platformMetrics.totalSppg) * 100 
                    : 0
                )}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">User Engagement</span>
              <Badge variant={
                platformMetrics.totalUsers > 0 && 
                (platformMetrics.activeUsers / platformMetrics.totalUsers) > 0.7 
                  ? 'default' : 'secondary'
              }>
                {formatPercentage(
                  platformMetrics.totalUsers > 0 
                    ? (platformMetrics.activeUsers / platformMetrics.totalUsers) * 100 
                    : 0
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}