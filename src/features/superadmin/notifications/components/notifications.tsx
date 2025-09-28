'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2, Eye, EyeOff, Filter, Plus, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface Notification {
  id: number
  title: string
  message: string
  notificationType: string
  priority: string
  isRead: boolean
  createdAt: string
  readAt: string | null
  sppg: {
    id: number
    nama: string
  } | null
}

interface NotificationStats {
  totalUnread: number
  typeStats: Array<{
    type: string
    count: number
  }>
}

interface NotificationResponse {
  success: boolean
  data: {
    notifications: Notification[]
    stats: NotificationStats
    pagination: {
      page: number
      limit: number
      totalCount: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export default function SuperAdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({ totalUnread: 0, typeStats: [] })
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20',
          type: typeFilter,
          status: statusFilter
        })

        const response = await fetch(`/api/superadmin/notifications?${params}`)
        const result: NotificationResponse = await response.json()

        if (result.success) {
          setNotifications(result.data.notifications)
          setStats(result.data.stats)
          setPagination({
            totalCount: result.data.pagination.totalCount,
            totalPages: result.data.pagination.totalPages,
            hasNextPage: result.data.pagination.hasNextPage,
            hasPrevPage: result.data.pagination.hasPrevPage
          })
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [currentPage, typeFilter, statusFilter])

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return

    try {
      const response = await fetch('/api/superadmin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          notificationIds: selectedIds
        })
      })

      if (response.ok) {
        setSelectedIds([])
        // Refresh notifications after bulk action
        window.location.reload()
      }
    } catch (error) {
      console.error(`Error ${action}:`, error)
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map(n => n.id))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SYSTEM':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'PAYMENT':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'SUBSCRIPTION':
        return <Bell className="w-4 h-4 text-purple-500" />
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: string } = {
      HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
    
    return (
      <Badge className={variants[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
        {priority}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID')
  }

  const typeLabels: { [key: string]: string } = {
    SYSTEM: 'Sistem',
    PAYMENT: 'Pembayaran',
    SUBSCRIPTION: 'Langganan',
    ALERT: 'Peringatan',
    SUCCESS: 'Berhasil',
    ERROR: 'Error'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifikasi</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kelola semua notifikasi sistem dan alert platform
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Buat Notifikasi
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalUnread}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Dibaca</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pagination.totalCount - stats.totalUnread}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terpilih</CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{selectedIds.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipe notifikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  {stats.typeStats.map(stat => (
                    <SelectItem key={stat.type} value={stat.type}>
                      {typeLabels[stat.type] || stat.type} ({stat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark_read')}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Tandai Dibaca
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark_unread')}
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Tandai Belum Dibaca
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Notifikasi</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.length === notifications.length && notifications.length > 0}
                onCheckedChange={selectAll}
              />
              <span className="text-sm text-gray-500">Pilih Semua</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada notifikasi
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={() => toggleSelect(notification.id)}
                    />

                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.notificationType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </h3>
                            {getPriorityBadge(notification.priority)}
                          </div>

                          <p className={`text-sm ${
                            !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{formatDate(notification.createdAt)}</span>
                            {notification.sppg && (
                              <span>SPPG: {notification.sppg.nama}</span>
                            )}
                            <span>{typeLabels[notification.notificationType]}</span>
                            {notification.isRead && notification.readAt && (
                              <span>Dibaca: {formatDate(notification.readAt)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Menampilkan {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, pagination.totalCount)} dari {pagination.totalCount} notifikasi
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Sebelumnya
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}