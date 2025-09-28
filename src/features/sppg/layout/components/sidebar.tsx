'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  ChefHat, 
  Package, 
  Truck, 
  Calendar,
  Users,
  Settings,
  LogOut,
  X,
  Shield,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SPPGSidebarProps, SPPGNavigationItem } from '../types'

const defaultNavigation: SPPGNavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/sppg',
    icon: LayoutDashboard,
  },
  {
    name: 'Menu Planning',
    href: '/sppg/menu-planning',
    icon: Calendar,
  },
  {
    name: 'Production',
    href: '/sppg/production',
    icon: ChefHat,
  },
  {
    name: 'Inventory',
    href: '/sppg/inventory',
    icon: Package,
  },
  {
    name: 'Distribution',
    href: '/sppg/distribution',
    icon: Truck,
  },
  {
    name: 'Staff',
    href: '/sppg/staff',
    icon: Users,
  },
]

export function Sidebar({ 
  user, 
  isOpen = false, 
  onClose = () => {}, 
  navigationItems = defaultNavigation 
}: SPPGSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">SPPG Platform</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* SPPG Info */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            SPPG Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {user.name || user.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    onClose()
                  }
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats Section */}
        <div className="px-4 pb-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Hari Ini
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-foreground">Menu Selesai</span>
                </div>
                <span className="text-xs font-medium">24/30</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-foreground">Distribusi</span>
                </div>
                <span className="text-xs font-medium">18/20</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-foreground">Stok Rendah</span>
                </div>
                <span className="text-xs font-medium text-orange-600">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/sppg/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Pengaturan</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Keluar
          </Button>
        </div>
      </div>
    </>
  )
}