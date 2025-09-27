"use client"

import { useSession } from 'next-auth/react'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const { user, setUser, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    setLoading(status === 'loading')
    
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        userType: session.user.userType,
        sppgId: session.user.sppgId,
        roles: session.user.roles,
        permissions: session.user.permissions,
      })
    } else if (status === 'unauthenticated') {
      clearAuth()
    }
  }, [session, status, setUser, setLoading, clearAuth])

  return {
    user: session?.user || user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    session,
  }
}

export function usePermissions() {
  const { user } = useAuth()
  
  const hasPermission = (permission: string) => {
    return user?.permissions?.some(p => p.name === permission) || false
  }

  const hasRole = (roleName: string) => {
    return user?.roles?.some(r => r.role.name === roleName) || false
  }

  const isSuperAdmin = () => {
    return user?.userType === 'SUPERADMIN'
  }

  return {
    hasPermission,
    hasRole,
    isSuperAdmin,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
  }
}