'use client'


import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  Users,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  useBillingAnalytics,
  usePaymentBillingStore,
  formatCurrency,
  calculateRevenueTrend,
  formatPercentage
} from '@/features/superadmin/payment-billing'

interface BillingOverviewProps {
  className?: string
}

export function BillingOverview({ className }: BillingOverviewProps) {
  const { data: analytics, isLoading } = useBillingAnalytics()
  const { isLoadingAnalytics } = usePaymentBillingStore()
  
  const loading = isLoading || isLoadingAnalytics

  if (loading) {
    return (
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Data analytics tidak tersedia</p>
        </div>
      </div>
    )
  }

  const revenueGrowth = calculateRevenueTrend(analytics.monthlyRevenue, analytics.monthlyRevenue * (1 - analytics.monthlyGrowth / 100))
  const yearlyGrowth = calculateRevenueTrend(analytics.yearlyRevenue, analytics.yearlyRevenue * (1 - analytics.yearlyGrowth / 100))

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            Akumulasi keseluruhan
          </p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyRevenue)}</div>
          <div className="flex items-center space-x-2">
            <Badge variant={revenueGrowth.isPositive ? 'default' : 'destructive'} className="text-xs">
              {revenueGrowth.formattedGrowth}
            </Badge>
            <p className="text-xs text-muted-foreground">bulan ini</p>
          </div>
        </CardContent>
      </Card>

      {/* MRR (Monthly Recurring Revenue) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MRR</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyRecurringRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            Monthly Recurring Revenue
          </p>
        </CardContent>
      </Card>

      {/* ARR (Annual Recurring Revenue) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ARR</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.annualRecurringRevenue)}</div>
          <div className="flex items-center space-x-2">
            <Badge variant={yearlyGrowth.isPositive ? 'default' : 'destructive'} className="text-xs">
              {yearlyGrowth.formattedGrowth}
            </Badge>
            <p className="text-xs text-muted-foreground">yearly</p>
          </div>
        </CardContent>
      </Card>

      {/* Average Revenue Per User */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ARPU</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.averageRevenuePerUser)}</div>
          <p className="text-xs text-muted-foreground">
            Average Revenue Per User
          </p>
        </CardContent>
      </Card>

      {/* Total Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalInvoices.toLocaleString('id-ID')}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600">{analytics.paidInvoices} lunas</span>
            <span className="text-red-600">{analytics.overdueInvoices} terlambat</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage((analytics.successfulPayments / analytics.totalPayments) * 100)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600">{analytics.successfulPayments} sukses</span>
            <span className="text-red-600">{analytics.failedPayments} gagal</span>
          </div>
        </CardContent>
      </Card>

      {/* Churn Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(analytics.churnRate)}
          </div>
          <p className="text-xs text-muted-foreground">
            Customer churn bulan ini
          </p>
        </CardContent>
      </Card>
    </div>
  )
}