'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, Users, BarChart3, Settings, Bell, 
  X, Shield, CreditCard, DollarSign, Receipt, Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SuperAdminSidebarProps {
  isOpen: boolean
  isCollapsed?: boolean
  onClose: () => void
  onToggleCollapse?: () => void
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/superadmin',
    icon: Home,
    badge: null
  },
  {
    name: 'Kelola SPPG',
    href: '/superadmin/sppg',
    icon: Users,
    badge: 'NEW'
  },
  {
    name: 'Manajemen Users',
    href: '/superadmin/users',
    icon: Users,
    badge: null
  },
  {
    name: 'Subscription',
    href: '/superadmin/subscriptions',
    icon: CreditCard,
    badge: 'NEW'
  },
  {
    name: 'Payment & Billing',
    href: '/superadmin/billing',
    icon: DollarSign,
    badge: 'NEW'
  },
  {
    name: 'Payments',
    href: '/superadmin/payments',
    icon: Wallet,
    badge: null
  },
  {
    name: 'Invoices',
    href: '/superadmin/invoices',
    icon: Receipt,
    badge: null
  },
  {
    name: 'Analytics',
    href: '/superadmin/analytics',
    icon: BarChart3,
    badge: null
  },
  {
    name: 'Sistem & Monitoring',
    href: '/superadmin/system',
    icon: Settings,
    badge: null
  },
  {
    name: 'Notifikasi',
    href: '/superadmin/notifications',
    icon: Bell,
    badge: '3'
  }
]

export function SuperAdminSidebar({ 
  isOpen, 
  isCollapsed = false, 
  onClose, 
  onToggleCollapse 
}: SuperAdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl transition-transform duration-300 ease-in-out md:hidden",
        "w-64 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Sidebar Content - Same as desktop */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-2 text-white">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold">SPPG Platform</h1>
              <p className="text-xs opacity-90">SuperAdmin</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    isActive 
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-300 ease-in-out h-full",
        // Desktop: normal flex item
        "hidden md:flex flex-col flex-shrink-0",
        // Width based on collapsed state  
        isCollapsed ? "md:w-16" : "md:w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div 
            className={cn(
              "flex items-center space-x-2 text-white transition-all duration-300",
              isCollapsed && "md:justify-center cursor-pointer"
            )}
            onClick={isCollapsed ? onToggleCollapse : undefined}
            title={isCollapsed ? "Click to expand sidebar" : undefined}
          >
            <div className={cn(
              "p-1.5 bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200",
              isCollapsed && "hover:bg-white/30"
            )}>
              <Shield className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="md:block">
                <h1 className="text-sm font-bold">SPPG Platform</h1>
                <p className="text-xs opacity-90">SuperAdmin</p>
              </div>
            )}
          </div>
          
          {/* Mobile close / Desktop collapse/expand */}
          <div className="flex items-center space-x-1">
            {onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleCollapse}
                className="hidden md:flex h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? (
                  // Expand icon (right arrow)
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m13 7 5 5-5 5M6 12h12" />
                  </svg>
                ) : (
                  // Collapse icon (left arrows)
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="md:hidden h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-800"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                  title={isCollapsed ? item.name : undefined}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 768) {
                      onClose()
                    }
                  }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                    isCollapsed ? "mx-auto" : "mr-3"
                  )} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full font-medium",
                          item.badge === 'NEW' 
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Quick Stats Section */}
          {!isCollapsed && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Platform Stats
              </h3>
              <div className="mt-4 space-y-3">
                <div className="px-3 py-2 bg-green-50 dark:bg-green-950 rounded-md">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Total SPPG</div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">24</div>
                </div>
                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Active Users</div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">1,247</div>
                </div>
                <div className="px-3 py-2 bg-purple-50 dark:bg-purple-950 rounded-md">
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Monthly Revenue</div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100">$12.4K</div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}