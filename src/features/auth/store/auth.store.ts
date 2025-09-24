import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AuthUser } from '../types/auth.types'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) =>
        set(
          { 
            user, 
            isAuthenticated: !!user 
          },
          false,
          'setUser'
        ),

      setLoading: (loading) =>
        set(
          { isLoading: loading },
          false,
          'setLoading'
        ),

      clearAuth: () =>
        set(
          { 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          },
          false,
          'clearAuth'
        ),
    }),
    {
      name: 'auth-store',
    }
  )
)