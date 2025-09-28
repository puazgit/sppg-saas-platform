'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Target 
} from 'lucide-react'
import { 
  useSubscriptionAnalytics,
  formatCurrency,
  formatPercentage,
  SUBSCRIPTION_TIER_COLORS
} from '@/features/superadmin/subscription-management'

export function SubscriptionOverview() {
  const { data: analytics, isLoading } = useSubscriptionAnalytics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const revenueGrowth = analytics.revenueLastMonth > 0 
    ? ((analytics.revenueThisMonth - analytics.revenueLastMonth) / analytics.revenueLastMonth) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeSubscriptions} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Bulan Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenueThisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {revenueGrowth >= 0 ? '+' : ''}{formatPercentage(revenueGrowth)} dari bulan lalu
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics.churnRate)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.cancelledSubscriptions} dibatalkan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.upcomingExpirations}</div>
            <p className="text-xs text-muted-foreground">
              dalam 30 hari ke depan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution & New Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribusi Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.distributionByTier).map(([tier, count]) => {
                const percentage = analytics.activeSubscriptions > 0 
                  ? (count / analytics.activeSubscriptions) * 100 
                  : 0

                return (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`border-${SUBSCRIPTION_TIER_COLORS[tier as keyof typeof SUBSCRIPTION_TIER_COLORS]}-500`}
                      >
                        {tier}
                      </Badge>
                      <span className="text-sm">{count} subscriptions</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(percentage)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aktivitas Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subscription Baru</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{analytics.newSubscriptionsThisMonth}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Aktif</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {analytics.activeSubscriptions}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Suspended</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {analytics.suspendedSubscriptions}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expired</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {analytics.expiredSubscriptions}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}