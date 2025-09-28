import type { LucideIcon } from 'lucide-react'

// SPPG User Interface
export interface SPPGUser {
  id: string
  name?: string | null
  email?: string | null
  userType: string
  sppgId?: string | null
  avatar?: string
  role?: string
}

// Navigation Item for SPPG
export interface SPPGNavigationItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string | number
  children?: SPPGNavigationItem[]
  isActive?: boolean
}

// Layout Theme
export type SPPGTheme = 'light' | 'dark'

// Layout State for SPPG
export interface SPPGLayoutState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: SPPGTheme
  notifications: number
}

// Component Props
export interface SPPGLayoutProviderProps {
  children: React.ReactNode
  user: SPPGUser
}

export interface SPPGHeaderProps {
  user: SPPGUser
  onToggleSidebar: () => void
  onToggleNotifications?: () => void
}

export interface SPPGSidebarProps {
  user: SPPGUser
  isOpen: boolean
  onClose: () => void
  navigationItems?: SPPGNavigationItem[]
}

// SPPG Stats for Sidebar
export interface SPPGStats {
  totalMenusToday: number
  completedDistributions: number
  lowStockItems: number
  staffOnDuty: number
}