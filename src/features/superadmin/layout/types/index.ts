import type { LucideIcon } from 'lucide-react'

// Navigation Item Type
export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string | number
  children?: NavigationItem[]
}

// Layout Theme
export type Theme = 'light' | 'dark'

// Layout State
export interface LayoutState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: Theme
}

// User Profile
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

// Layout Props
export interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export interface SuperAdminHeaderProps {
  onToggleSidebar: () => void
  user?: UserProfile
}

export interface SuperAdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  navigationItems?: NavigationItem[]
}