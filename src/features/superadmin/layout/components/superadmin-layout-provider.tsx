'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SuperAdminHeader } from './header'
import { SuperAdminSidebar } from './sidebar'
import { SuperAdminBreadcrumb } from './breadcrumb'
import { SuperAdminNotificationPanel } from './notification-panel'
import { SuperAdminQuickActions } from './quick-actions'
import { useSuperAdminLayoutStore } from '../store'
import { Skeleton } from '@/components/ui/skeleton'
// import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export default function SuperAdminLayoutProvider({ children }: SuperAdminLayoutProps) {
  const pathname = usePathname()
  const { 
    sidebarOpen, 
    sidebarCollapsed,
    notificationPanelOpen,
    quickActionsOpen,
    setSidebarOpen,
    setSidebarCollapsed,
    setNotificationPanelOpen,
    setQuickActionsOpen
  } = useSuperAdminLayoutStore()
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto-collapse sidebar on mobile when route changes
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [pathname, setSidebarOpen])

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCollapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleToggleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen)
    // Close quick actions if open
    if (quickActionsOpen) setQuickActionsOpen(false)
  }

  const handleToggleQuickActions = () => {
    setQuickActionsOpen(!quickActionsOpen)
    // Close notifications if open
    if (notificationPanelOpen) setNotificationPanelOpen(false)
  }

  if (!mounted) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex animate-pulse h-full">
          <div className="w-64 bg-white border-r border-slate-200 h-full">
            <div className="p-4 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          <div className="flex-1">
            <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900/30 dark:to-slate-800/20 overflow-hidden relative transition-colors">
      {/* Backdrop for mobile sidebar and panels */}
      {(sidebarOpen || notificationPanelOpen || quickActionsOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => {
            setSidebarOpen(false)
            setNotificationPanelOpen(false)
            setQuickActionsOpen(false)
          }}
        />
      )}

      {/* Layout Structure: Sidebar + Main Area */}
      <div className="flex h-full relative">
        {/* Enhanced Sidebar */}
        <SuperAdminSidebar 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={handleCloseSidebar}
          onToggleCollapse={handleCollapseSidebar}
        />

        {/* Main content area - Header + Content */}
        <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out",
          (notificationPanelOpen || quickActionsOpen) && "md:mr-80"
        )}>
        {/* Enhanced Header */}
        <SuperAdminHeader 
          onToggleSidebar={handleToggleSidebar}
          onToggleNotifications={handleToggleNotifications}
          onToggleQuickActions={handleToggleQuickActions}
          notificationCount={3} // This would come from a real API
        />
        
        {/* Breadcrumb Navigation */}
        <SuperAdminBreadcrumb />
        
        {/* Page Content with Loading State */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-64" />
            </div>
          }>
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
                <Skeleton className="h-64" />
              </div>
            ) : (
              <div className="animate-in fade-in-0 duration-500">
                {children}
              </div>
            )}
          </Suspense>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-3 md:px-6 lg:px-8 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span>© 2024 SPPG Platform - SuperAdmin Panel</span>
              <span className="hidden md:block">•</span>
              <span className="hidden md:block">Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span>System Status: </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 dark:text-green-400 font-medium">Operational</span>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </div>

      {/* Notification Panel */}
      <SuperAdminNotificationPanel 
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />

      {/* Quick Actions Panel */}
      <SuperAdminQuickActions 
        isOpen={quickActionsOpen}
        onClose={() => setQuickActionsOpen(false)}
      />

      {/* Toast Notifications */}
      {/* <Toaster /> */}
    </div>
  )
}