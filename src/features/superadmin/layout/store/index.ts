import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SuperAdminLayoutState {
  // Sidebar states
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Panel states
  notificationPanelOpen: boolean
  quickActionsOpen: boolean
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'system'
  compactMode: boolean
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setNotificationPanelOpen: (open: boolean) => void
  setQuickActionsOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setCompactMode: (compact: boolean) => void
  
  // Reset all panels
  closeAllPanels: () => void
}

export const useSuperAdminLayoutStore = create<SuperAdminLayoutState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: false,
        sidebarCollapsed: false,
        notificationPanelOpen: false,
        quickActionsOpen: false,
        theme: 'system',
        compactMode: false,
        
        // Actions
        setSidebarOpen: (open) => set(
          { sidebarOpen: open },
          false,
          'superadmin-layout/setSidebarOpen'
        ),
        
        setSidebarCollapsed: (collapsed) => set(
          { sidebarCollapsed: collapsed },
          false,
          'superadmin-layout/setSidebarCollapsed'
        ),
        
        setNotificationPanelOpen: (open) => set(
          { 
            notificationPanelOpen: open,
            // Close other panels when opening notifications
            ...(open && { quickActionsOpen: false })
          },
          false,
          'superadmin-layout/setNotificationPanelOpen'
        ),
        
        setQuickActionsOpen: (open) => set(
          { 
            quickActionsOpen: open,
            // Close other panels when opening quick actions
            ...(open && { notificationPanelOpen: false })
          },
          false,
          'superadmin-layout/setQuickActionsOpen'
        ),
        
        setTheme: (theme) => set(
          { theme },
          false,
          'superadmin-layout/setTheme'
        ),
        
        setCompactMode: (compact) => set(
          { compactMode: compact },
          false,
          'superadmin-layout/setCompactMode'
        ),
        
        closeAllPanels: () => set(
          {
            sidebarOpen: false,
            notificationPanelOpen: false,
            quickActionsOpen: false
          },
          false,
          'superadmin-layout/closeAllPanels'
        )
      }),
      {
        name: 'superadmin-layout-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          compactMode: state.compactMode
        })
      }
    ),
    { name: 'SuperAdminLayoutStore' }
  )
)