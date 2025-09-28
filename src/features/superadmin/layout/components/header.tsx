'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { 
  Search, Globe, Shield, LogOut, Menu, Bell, Zap, 
  Settings, User, Sun, Moon, Monitor, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface SuperAdminHeaderProps {
  onToggleSidebar: () => void
  onToggleNotifications: () => void
  onToggleQuickActions: () => void
  notificationCount?: number
}

export function SuperAdminHeader({ 
  onToggleSidebar, 
  onToggleNotifications, 
  onToggleQuickActions,
  notificationCount = 0
}: SuperAdminHeaderProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Implement search functionality
    console.log('Searching for:', searchQuery)
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    })
  }
  
  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />
      case 'dark': return <Moon className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }
  
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 z-40 flex-shrink-0 transition-colors">
      <div className="px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    SPPG Platform
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SuperAdmin Control Panel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                isSearching ? "text-blue-500 animate-spin" : "text-slate-400"
              )} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SPPG, users, reports, analytics..."
                className="pl-10 pr-12 w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-300 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                disabled={isSearching}
              />
              {searchQuery && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </Button>
              )}
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className={cn(
                    "cursor-pointer",
                    theme === 'light' && "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                  {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "cursor-pointer",
                    theme === 'dark' && "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                  {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className={cn(
                    "cursor-pointer",
                    theme === 'system' && "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                  {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <Button variant="ghost" size="sm" className="hidden lg:flex text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Globe className="h-4 w-4 mr-2" />
              ID
            </Button>
            
            {/* Quick Actions */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleQuickActions}
              className="relative text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Zap className="h-4 w-4" />
              <span className="sr-only">Quick Actions</span>
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleNotifications}
              className="relative text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications ({notificationCount})</span>
            </Button>

            {/* System Status */}
            <div className="hidden lg:flex items-center space-x-2 px-2">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Online</span>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'SuperAdmin'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {session?.user?.name?.slice(0, 2).toUpperCase() || 'SA'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                      {session?.user?.name || 'Super Administrator'}
                    </p>
                    <p className="text-xs leading-none text-slate-600 dark:text-slate-400">
                      {session?.user?.email || 'superadmin@sppg.go.id'}
                    </p>
                    <Badge variant="secondary" className="w-fit text-xs mt-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      SuperAdmin
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}