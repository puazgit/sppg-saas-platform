'use client'

import { useState, useEffect } from 'react'
import { Settings, Database, Shield, Server, RefreshCw, Download, Trash, AlertTriangle, Users, Lock, Eye, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SystemInfo {
  systemHealth: {
    database: string
    uptime: number
    memoryUsage: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
    }
    nodeVersion: string
    timestamp: string
  }
  statistics: {
    totalSPPGs: number
    totalUsers: number
    totalSubscriptions: number
    activeSubscriptions: number
    totalMenus: number
    totalDistributions: number
    recentErrors: number
  }
  systemSettings: Record<string, Array<{ key: string; value: string; description: string | null }>>
  recentActivity: Array<{
    id: number
    name: string
    email: string
    userType: string
    lastLogin: string | null
    sppg: { name: string } | null
  }>
  securityMetrics: {
    activeSessions: number
    failedLogins: number
    blockedIPs: string[]
    twoFactorEnabled: number
  }
  securityLogs: Array<{
    id: number
    timestamp: string
    type: string
    user: string
    ip: string
    userAgent: string
  }>
}

export default function SuperAdminSystem() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchSystemInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/superadmin/system')
      const result = await response.json()

      if (result.success) {
        setSystemInfo(result.data)
      }
    } catch (error) {
      console.error('Error fetching system info:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemInfo()
  }, [])

  const handleSystemAction = async (action: string) => {
    try {
      const response = await fetch('/api/superadmin/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      const result = await response.json()
      if (result.success) {
        console.log(`${action} completed successfully`)
        // Show success message to user
      }
    } catch (error) {
      console.error(`Error ${action}:`, error)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Connected</Badge>
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Disconnected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Unknown</Badge>
    }
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
        </div>
      </div>
    )
  }

  if (!systemInfo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Gagal memuat informasi sistem</p>
          <Button onClick={fetchSystemInfo} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sistem</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor dan kelola pengaturan platform</p>
        </div>
        
        <Button onClick={fetchSystemInfo}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Server },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
            { id: 'security', label: 'Keamanan', icon: Shield },
            { id: 'maintenance', label: 'Maintenance', icon: Database }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {getHealthStatus(systemInfo.systemHealth.database)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatUptime(systemInfo.systemHealth.uptime)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatMemory(systemInfo.systemHealth.memoryUsage.heapUsed)} / 
                  {formatMemory(systemInfo.systemHealth.memoryUsage.heapTotal)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Node Version</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {systemInfo.systemHealth.nodeVersion}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemInfo.statistics.totalSPPGs}
                  </div>
                  <div className="text-sm text-gray-500">Total SPPG</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemInfo.statistics.totalUsers}
                  </div>
                  <div className="text-sm text-gray-500">Total Users</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {systemInfo.statistics.activeSubscriptions}
                  </div>
                  <div className="text-sm text-gray-500">Active Subscriptions</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {systemInfo.statistics.totalMenus}
                  </div>
                  <div className="text-sm text-gray-500">Total Menus</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemInfo.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-sm text-gray-500">
                        {activity.email} • {activity.userType}
                        {activity.sppg && ` • ${activity.sppg.name}`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.lastLogin ? new Date(activity.lastLogin).toLocaleString('id-ID') : 'Never'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {Object.entries(systemInfo.systemSettings).map(([category, settings]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category} Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.key}</Label>
                        {setting.description && (
                          <p className="text-xs text-gray-500">{setting.description}</p>
                        )}
                      </div>
                      <div className="w-32">
                        {setting.value === 'true' || setting.value === 'false' ? (
                          <Switch 
                            checked={setting.value === 'true'}
                            onCheckedChange={(checked) => {
                              // Handle switch change
                              console.log(`Setting ${setting.key} to ${checked}`)
                            }}
                          />
                        ) : (
                          <Input 
                            defaultValue={setting.value}
                            className="text-sm"
                            onBlur={(e) => {
                              // Handle input change
                              console.log(`Setting ${setting.key} to ${e.target.value}`)
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                System Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline"
                  onClick={() => handleSystemAction('clear_cache')}
                  className="w-full justify-start"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Clear System Cache
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => handleSystemAction('backup_database')}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>

                <Button 
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Enable Maintenance Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {systemInfo.statistics.recentErrors > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800">
                    {systemInfo.statistics.recentErrors} error(s) detected in the last 24 hours. 
                    Please check the system logs for details.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {systemInfo.securityMetrics.activeSessions}
                </div>
                <p className="text-xs text-muted-foreground">Last 30 minutes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {systemInfo.securityMetrics.failedLogins}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">2FA Enabled</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {systemInfo.securityMetrics.twoFactorEnabled}
                </div>
                <p className="text-xs text-muted-foreground">Users with 2FA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {systemInfo.securityMetrics.blockedIPs.length}
                </div>
                <p className="text-xs text-muted-foreground">Currently blocked</p>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Session Timeout</Label>
                    <p className="text-xs text-gray-500">Auto logout after inactivity (minutes)</p>
                  </div>
                  <div className="w-20">
                    <Input defaultValue="30" className="text-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Password Policy</Label>
                    <p className="text-xs text-gray-500">Enforce strong password requirements</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Rate Limiting</Label>
                    <p className="text-xs text-gray-500">Limit API requests per IP</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemInfo.securityLogs.map((log) => {
                  const getLogIcon = (type: string) => {
                    switch (type) {
                      case 'LOGIN_SUCCESS':
                        return <div className="w-2 h-2 bg-green-500 rounded-full" />
                      case 'LOGIN_FAILED':
                        return <div className="w-2 h-2 bg-red-500 rounded-full" />
                      case 'PASSWORD_CHANGE':
                        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      case 'SUSPICIOUS_ACTIVITY':
                        return <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      default:
                        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    }
                  }

                  const getLogBg = (type: string) => {
                    switch (type) {
                      case 'SUSPICIOUS_ACTIVITY':
                        return 'bg-red-50 border-red-200'
                      case 'LOGIN_FAILED':
                        return 'bg-orange-50 border-orange-200'
                      default:
                        return 'bg-gray-50 border-gray-200'
                    }
                  }

                  return (
                    <div 
                      key={log.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border ${getLogBg(log.type)}`}
                    >
                      {getLogIcon(log.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.type.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{log.user}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.ip} • {log.userAgent.split(' ')[0]}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}