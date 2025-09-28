"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { MapPin, TrendingUp, Users, Building2 } from 'lucide-react'
import { useDashboardMetrics } from '../hooks/use-dashboard-metrics'
import { formatNumber, formatPercentage } from '@/lib/utils'

export function RegionalDistribution() {
  const { data: metrics, isLoading, error } = useDashboardMetrics()

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-900 dark:text-red-100">Regional Distribution Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 dark:text-red-300">
            Failed to load regional data
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <RegionalDistributionSkeleton />
  }

  const { regionalDistribution } = metrics!
  const totalRegionalSppg = regionalDistribution.reduce((sum, region) => sum + region.sppgCount, 0)

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          Distribusi Regional
        </CardTitle>
        <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          {regionalDistribution.length} Region
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionalDistribution.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data regional tersedia</p>
          </div>
        ) : (
          regionalDistribution
            .sort((a, b) => b.sppgCount - a.sppgCount)
            .slice(0, 8) // Show top 8 regions
            .map((region) => {
              const percentage = totalRegionalSppg > 0 
                ? (region.sppgCount / totalRegionalSppg) * 100 
                : 0

              return (
                <div key={region.provinceId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {region.provinceName}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {formatNumber(region.sppgCount)} SPPG
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(region.totalBeneficiaries)} Penerima
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={percentage > 15 ? 'default' : 'secondary'}
                        className={percentage > 15 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }
                      >
                        {formatPercentage(percentage)}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2 bg-slate-200 dark:bg-slate-700" 
                  />
                </div>
              )
            })
        )}

        {regionalDistribution.length > 8 && (
          <div className="text-center pt-2">
            <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              +{regionalDistribution.length - 8} region lainnya
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SubscriptionAnalytics() {
  const { data: metrics, isLoading, error } = useDashboardMetrics()

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Subscription Analytics Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load subscription data
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SubscriptionAnalyticsSkeleton />
  }

  const { subscriptionAnalytics } = metrics!
  const totalSubscriptions = subscriptionAnalytics.reduce((sum, tier) => sum + tier.count, 0)

  // Tier display names
  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'BASIC':
        return 'Dasar'
      case 'STANDARD':
        return 'Standar'
      case 'PRO':
        return 'Professional'
      case 'ENTERPRISE':
        return 'Enterprise'
      default:
        return tier
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC':
        return 'bg-blue-500'
      case 'STANDARD':
        return 'bg-green-500'
      case 'PRO':
        return 'bg-purple-500'
      case 'ENTERPRISE':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analytics Subscription
        </CardTitle>
        <Badge variant="outline">
          {formatNumber(totalSubscriptions)} Total
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionAnalytics.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data subscription tersedia</p>
          </div>
        ) : (
          subscriptionAnalytics
            .sort((a, b) => b.count - a.count)
            .map((tier) => {
              const percentage = totalSubscriptions > 0 
                ? (tier.count / totalSubscriptions) * 100 
                : 0

              return (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getTierColor(tier.tier)}`} />
                      <div>
                        <p className="font-medium text-sm">
                          {getTierDisplayName(tier.tier)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Retention: {formatPercentage(tier.retentionRate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        {formatNumber(tier.count)}
                      </p>
                      <Badge variant={percentage > 25 ? 'default' : 'secondary'} className="text-xs">
                        {formatPercentage(percentage)}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })
        )}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">
                {subscriptionAnalytics.length > 0 
                  ? formatPercentage(
                      subscriptionAnalytics.reduce((sum, tier) => sum + tier.retentionRate, 0) / 
                      subscriptionAnalytics.length
                    )
                  : '0%'
                }
              </p>
              <p className="text-xs text-muted-foreground">Avg. Retention</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {subscriptionAnalytics.length > 0 
                  ? formatNumber(
                      Math.round(
                        subscriptionAnalytics.reduce((sum, tier) => sum + tier.avgBeneficiaries, 0) / 
                        subscriptionAnalytics.length
                      )
                    )
                  : '0'
                }
              </p>
              <p className="text-xs text-muted-foreground">Avg. Beneficiaries</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RegionalDistributionSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SubscriptionAnalyticsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}