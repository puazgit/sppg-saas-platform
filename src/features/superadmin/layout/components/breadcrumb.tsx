'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapping of paths to readable names
const pathMapping: Record<string, string> = {
  '/superadmin': 'Dashboard',
  '/superadmin/sppg': 'Kelola SPPG',
  '/superadmin/analytics': 'Analytics',
  '/superadmin/system': 'Sistem',
  '/superadmin/notifications': 'Notifikasi',
  '/superadmin/settings': 'Pengaturan',
  '/superadmin/users': 'Kelola User',
  '/superadmin/reports': 'Laporan'
}

export function SuperAdminBreadcrumb() {
  const pathname = usePathname()
  
  // Generate breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []
  
  // Always start with SuperAdmin root
  breadcrumbItems.push({
    name: 'SuperAdmin',
    href: '/superadmin',
    icon: Home
  })
  
  // Build path progressively
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i]
    
    // Skip the first 'superadmin' segment as it's already included
    if (i === 0 && pathSegments[i] === 'superadmin') {
      continue
    }
    
    const fullPath = currentPath.startsWith('/superadmin') 
      ? currentPath 
      : '/superadmin' + currentPath
    
    breadcrumbItems.push({
      name: pathMapping[fullPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1),
      href: fullPath,
      icon: null
    })
  }
  
  // Don't show breadcrumb if only on root
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  return (
    <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 px-4 py-3 md:px-6 lg:px-8 transition-colors">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const Icon = item.icon
          
          return (
            <div key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 mx-2" />
              )}
              
              {isLast ? (
                <span className={cn(
                  "flex items-center font-medium text-slate-900 dark:text-slate-100",
                  Icon && "gap-2"
                )}>
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors",
                    Icon && "gap-2"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}