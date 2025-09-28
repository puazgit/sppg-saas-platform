'use client'

import React, { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import type { SPPGUser } from '../types'

interface SppgLayoutProviderProps {
  children: React.ReactNode
  user: SPPGUser
}

export function SppgLayoutProvider({ children, user }: SppgLayoutProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Header */}
        <Header 
          user={user} 
          onToggleSidebar={handleToggleSidebar}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}