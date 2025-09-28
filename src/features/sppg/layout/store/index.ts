import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SPPGLayoutState, SPPGTheme } from '../types'

interface SPPGLayoutActions {
  // Sidebar actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapse: () => void
  
  // Theme actions
  setTheme: (theme: SPPGTheme) => void
  toggleTheme: () => void
  
  // Notifications
  setNotifications: (count: number) => void
  incrementNotifications: () => void
  clearNotifications: () => void
  
  // Reset
  reset: () => void
}

type SPPGLayoutStore = SPPGLayoutState & SPPGLayoutActions

export const useSPPGLayoutStore = create<SPPGLayoutStore>()(
  devtools(
    (set) => ({
      // Initial state
      sidebarOpen: false,
      sidebarCollapsed: false,
      theme: 'light',
      notifications: 0,
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ 
        sidebarCollapsed: collapsed 
      }),
      
      toggleSidebarCollapse: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setNotifications: (count) => set({ notifications: count }),
      
      incrementNotifications: () => set((state) => ({ 
        notifications: state.notifications + 1 
      })),
      
      clearNotifications: () => set({ notifications: 0 }),
      
      // Reset
      reset: () => set({
        sidebarOpen: false,
        sidebarCollapsed: false,
        theme: 'light',
        notifications: 0
      })
    }),
    {
      name: 'sppg-layout-store'
    }
  )
)