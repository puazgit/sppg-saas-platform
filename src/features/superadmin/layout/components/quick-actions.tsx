'use client'

import { 
  X, Plus, UserPlus, BarChart3, Settings, 
  FileText, Download, Upload, Zap 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SuperAdminQuickActionsProps {
  isOpen: boolean
  onClose: () => void
}

const quickActions = [
  {
    category: 'SPPG Management',
    actions: [
      {
        name: 'Tambah SPPG Baru',
        description: 'Registrasi organisasi SPPG baru',
        icon: Plus,
        href: '/superadmin/sppg/new',
        color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
      },
      {
        name: 'Review Approval',
        description: 'Tinjau SPPG menunggu persetujuan', 
        icon: UserPlus,
        href: '/superadmin/sppg?status=pending',
        color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
      }
    ]
  },
  {
    category: 'Analytics & Reports',
    actions: [
      {
        name: 'Generate Report',
        description: 'Buat laporan komprehensif',
        icon: BarChart3,
        href: '/superadmin/reports/generate',
        color: 'text-green-600 bg-green-50 hover:bg-green-100'
      },
      {
        name: 'Export Data',
        description: 'Download data platform',
        icon: Download,
        href: '/superadmin/export',
        color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
      }
    ]
  },
  {
    category: 'System Administration',
    actions: [
      {
        name: 'System Settings',
        description: 'Konfigurasi platform',
        icon: Settings,
        href: '/superadmin/system/settings',
        color: 'text-slate-600 bg-slate-50 hover:bg-slate-100'
      },
      {
        name: 'Data Import',
        description: 'Upload data bulk',
        icon: Upload,
        href: '/superadmin/import',
        color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
      },
      {
        name: 'Audit Logs',
        description: 'Review system activities',
        icon: FileText,
        href: '/superadmin/audit',
        color: 'text-red-600 bg-red-50 hover:bg-red-100'
      }
    ]
  }
]

export function SuperAdminQuickActions({ isOpen, onClose }: SuperAdminQuickActionsProps) {
  return (
    <div className={cn(
      "fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-slate-700" />
          <h2 className="font-semibold text-slate-900">Quick Actions</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions List */}
      <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
        <div className="p-4">
          {quickActions.map((category, categoryIndex) => (
            <div key={category.category} className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {category.category}
              </h3>
              
              <div className="space-y-2">
                {category.actions.map((action) => {
                  const Icon = action.icon
                  
                  return (
                    <button
                      key={action.name}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm",
                        action.color
                      )}
                      onClick={() => {
                        // Handle navigation here
                        console.log('Navigate to:', action.href)
                        onClose()
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900">
                            {action.name}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {categoryIndex < quickActions.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}