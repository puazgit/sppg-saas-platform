'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Users, Calendar, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsData {
  timeRange: number
  revenue: {
    data: Array<{ date: string; revenue: number }>
    total: number
  }
  sppgGrowth: {
    data: Array<{ date: string; count: number }>
    total: number
  }
  subscriptionTiers: Array<{ tier: string; count: number }>
  regional: Array<{ provinceId: number; provinceName: string; sppgCount: number }>
  userActivity: Array<{ userType: string; count: number }>
  menuPlanning: {
    data: Array<{ date: string; count: number }>
    total: number
  }
  distribution: {
    data: Array<{ date: string; count: number; totalServed: number; totalCost: number }>
    totalRecords: number
    totalServed: number
    totalCost: number
  }
  topSPPGs: Array<{
    id: number
    nama: string
    province: number | null
    menuCount: number
    distributionPoints: number
    totalDistributions: number
    performanceScore: number
  }>
}

export default function SuperAdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/superadmin/analytics?range=${timeRange}`)
      const result = await response.json()

      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/superadmin/analytics?range=${timeRange}`)
        const result = await response.json()

        if (result.success) {
          setAnalytics(result.data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const calculateGrowthPercentage = (data: Array<{ date: string; count?: number; revenue?: number }>) => {
    if (data.length < 2) return 0
    
    const latest = data[data.length - 1]
    const previous = data[data.length - 2]
    
    const latestValue = latest.count || latest.revenue || 0
    const previousValue = previous.count || previous.revenue || 0
    
    if (previousValue === 0) return 100
    
    return ((latestValue - previousValue) / previousValue) * 100
  }

  const getGrowthIcon = (percentage: number) => {
    return percentage >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getGrowthColor = (percentage: number) => {
    return percentage >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Gagal memuat data analytics</p>
          <Button onClick={handleRefresh} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  const revenueGrowth = calculateGrowthPercentage(analytics.revenue.data)
  const sppgGrowth = calculateGrowthPercentage(analytics.sppgGrowth.data)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive analytics dan business insights</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Hari Terakhir</SelectItem>
              <SelectItem value="30">30 Hari Terakhir</SelectItem>
              <SelectItem value="90">90 Hari Terakhir</SelectItem>
              <SelectItem value="365">1 Tahun Terakhir</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(revenueGrowth)}`}>
              {getGrowthIcon(revenueGrowth)}
              {Math.abs(revenueGrowth).toFixed(1)}% dari periode sebelumnya
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SPPG Terdaftar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.sppgGrowth.total}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(sppgGrowth)}`}>
              {getGrowthIcon(sppgGrowth)}
              {Math.abs(sppgGrowth).toFixed(1)}% pertumbuhan
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Planning</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.menuPlanning.total)}</div>
            <div className="text-xs text-muted-foreground">
              Total menu dalam {analytics.timeRange} hari
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribusi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.distribution.totalServed)}</div>
            <div className="text-xs text-muted-foreground">
              Total porsi terdistribusi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscription Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribusi Tier Langganan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.subscriptionTiers.map((tier, index) => {
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500']
                const percentage = (tier.count / analytics.sppgGrowth.total) * 100
                
                return (
                  <div key={tier.tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className="text-sm font-medium">{tier.tier}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold dark:text-white">{tier.count}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribusi Regional (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.regional.slice(0, 5).map((region) => {
                const maxCount = Math.max(...analytics.regional.map(r => r.sppgCount))
                const barWidth = (region.sppgCount / maxCount) * 100
                
                return (
                  <div key={region.provinceId} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate dark:text-white">{region.provinceName}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{region.sppgCount} SPPG</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing SPPGs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Performing SPPGs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSPPGs.slice(0, 5).map((sppg, index) => (
                <div key={`top-sppg-${sppg.id || index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium dark:text-white">{sppg.nama}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {sppg.menuCount} menu • {sppg.distributionPoints} titik distribusi
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">
                      Score: {sppg.performanceScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {sppg.totalDistributions} distribusi
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aktivitas Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.userActivity.map((activity) => {
                const typeLabels: { [key: string]: string } = {
                  SUPERADMIN: 'Super Admin',
                  SPPG_ADMIN: 'Admin SPPG',
                  SPPG_STAFF: 'Staff SPPG',
                  SPPG_VIEWER: 'Viewer SPPG'
                }
                
                return (
                  <div key={activity.userType} className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">
                      {typeLabels[activity.userType] || activity.userType}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.count} pengguna aktif
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Cost Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Summary Distribusi & Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(analytics.distribution.totalRecords)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Records</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(analytics.distribution.totalServed)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Porsi Terdistribusi</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(analytics.distribution.totalCost)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Biaya Distribusi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}