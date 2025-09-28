'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, Building2, TrendingUp, DollarSign, 
  Activity, MapPin, AlertCircle, CheckCircle,
  RefreshCw, BarChart3, PieChart, Globe
} from 'lucide-react'

interface DashboardMetrics {
  overview: {
    totalSppg: number
    activeSubscriptions: number
    pendingApprovals: number
    totalUsers: number
    conversionRate: number
  }
  revenue: {
    currentMonth: number
    estimatedYearly: number
    averagePerUser: number
    trialUsers: number
    paidUsers: number
    growth: string
  }
  subscriptions: {
    distribution: Array<{
      tier: string
      count: number
      percentage: number
    }>
    total: number
    activeRate: number
  }
  regions: {
    distribution: Array<{
      province: string
      count: number
    }>
    topRegion: {
      province: string
      count: number
    }
  }
  system: {
    uptime: number
    memoryUsage: number
    status: string
    lastUpdated: string
  }
  recentActivity: {
    newRegistrations: number
    recentLogins: number
    systemAlerts: number
  }
}

export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/superadmin/metrics')
      const result = await response.json()
      
      if (result.success) {
        setMetrics(result.data)
        setLastUpdate(new Date())
      } else {
        setError(result.error || 'Failed to fetch metrics')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Dashboard metrics error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg">Memuat dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Gagal memuat dashboard</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchMetrics} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard SuperAdmin</h1>
          <p className="text-gray-600 mt-2">
            Ringkasan sistem SPPG Platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}
          </div>
          <Button 
            onClick={fetchMetrics} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SPPG</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.totalSppg}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.overview.pendingApprovals} menunggu persetujuan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Langganan Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.activeSubscriptions}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.overview.conversionRate}% tingkat konversi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Semua jenis pengguna
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Bulanan</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.currentMonth)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.revenue.growth} dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Subscription Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analisis Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Pengguna Berbayar</div>
                <div className="text-2xl font-bold text-green-800">{metrics.revenue.paidUsers}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Pengguna Trial</div>
                <div className="text-2xl font-bold text-blue-800">{metrics.revenue.trialUsers}</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Rata-rata per pengguna</span>
                <span className="font-medium">{formatCurrency(metrics.revenue.averagePerUser)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimasi tahunan</span>
                <span className="font-medium">{formatCurrency(metrics.revenue.estimatedYearly)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribusi Paket Langganan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.subscriptions.distribution.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={tier.tier === 'ENTERPRISE' ? 'default' : 'secondary'}
                      className="min-w-[80px] justify-center"
                    >
                      {tier.tier}
                    </Badge>
                    <span className="text-sm">{tier.count} SPPG</span>
                  </div>
                  <div className="text-sm font-medium">{tier.percentage}%</div>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tingkat aktivasi</span>
                <span className="font-medium">{metrics.subscriptions.activeRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Distribusi Regional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.regions.distribution.slice(0, 5).map((region, index) => (
                <div key={region.province} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm">{region.province}</span>
                  </div>
                  <span className="font-medium">{region.count}</span>
                </div>
              ))}
            </div>
            
            {metrics.regions.topRegion.count > 0 && (
              <div className="border-t mt-4 pt-4">
                <div className="text-sm text-gray-600 mb-1">Wilayah Terdepan</div>
                <div className="font-medium">{metrics.regions.topRegion.province}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Kesehatan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge 
                variant={metrics.system.status === 'healthy' ? 'default' : 'destructive'}
                className="bg-green-100 text-green-800"
              >
                {metrics.system.status === 'healthy' ? 'Sehat' : 'Bermasalah'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="font-medium">{metrics.system.uptime} jam</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Penggunaan Memory</span>
              <span className="font-medium">{metrics.system.memoryUsage} MB</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {metrics.recentActivity.newRegistrations}
                  </div>
                  <div className="text-xs text-gray-500">Registrasi Baru</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {metrics.recentActivity.recentLogins}
                  </div>
                  <div className="text-xs text-gray-500">Login Hari Ini</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {metrics.recentActivity.systemAlerts}
                  </div>
                  <div className="text-xs text-gray-500">Alert Sistem</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Kelola SPPG
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Laporan Detail
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Pengaturan Sistem
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Log Aktivitas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}