'use client'

import { X, Bell, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface SuperAdminNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

// Mock notifications - would come from API
const notifications = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'SPPG Baru Menunggu Approval',
    message: 'SPPG Bandung Utara memerlukan persetujuan untuk aktivasi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '2', 
    type: 'success' as const,
    title: 'Pembayaran Berhasil',
    message: 'SPPG Jakarta Selatan telah menyelesaikan pembayaran bulanan.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Update Sistem',
    message: 'Maintenance terjadwal pada hari Minggu 02:00-04:00 WIB.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: '4',
    type: 'error' as const,
    title: 'Server Alert',
    message: 'CPU usage tinggi terdeteksi pada server utama.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true
  }
]

function getNotificationIcon(type: string) {
  switch (type) {
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

export function SuperAdminNotificationPanel({ isOpen, onClose }: SuperAdminNotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <div className={cn(
      "fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-slate-700" />
          <h2 className="font-semibold text-slate-900">Notifikasi</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/30">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm">Mark All Read</Button>
          <Button variant="ghost" size="sm">Settings</Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada notifikasi</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-3 m-2 rounded-lg border transition-colors cursor-pointer hover:bg-slate-50",
                  !notification.read 
                    ? "bg-blue-50/50 border-blue-200" 
                    : "bg-white border-slate-200"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        !notification.read ? "text-slate-900" : "text-slate-700"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                        locale: idLocale
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}