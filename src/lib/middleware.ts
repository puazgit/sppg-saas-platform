import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { userHasPermission, isSuperAdmin, getUserWithRolesAndPermissions } from './rbac'

/**
 * Middleware untuk memeriksa apakah user memiliki permission tertentu
 */
export function requirePermission(permission: string) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token || !token.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const hasPermission = await userHasPermission(token.sub, permission)
      
      if (!hasPermission) {
        return NextResponse.json({ 
          error: 'Forbidden', 
          message: `Anda tidak memiliki permission: ${permission}` 
        }, { status: 403 })
      }

      // Add user info to request headers for use in API handlers
      const userInfo = await getUserWithRolesAndPermissions(token.sub)
      const response = NextResponse.next()
      
      if (userInfo) {
        response.headers.set('x-user-id', userInfo.id)
        response.headers.set('x-user-email', userInfo.email)
        response.headers.set('x-user-type', userInfo.userType)
        if (userInfo.sppgId) {
          response.headers.set('x-user-sppg-id', userInfo.sppgId)
        }
      }

      return response
    } catch (error) {
      console.error('Authorization error:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

/**
 * Middleware untuk memeriksa apakah user adalah SuperAdmin
 */
export function requireSuperAdmin() {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token || !token.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const isSuper = await isSuperAdmin(token.sub)
      
      if (!isSuper) {
        return NextResponse.json({ 
          error: 'Forbidden', 
          message: 'Hanya SuperAdmin yang bisa mengakses resource ini' 
        }, { status: 403 })
      }

      // Add user info to request headers
      const userInfo = await getUserWithRolesAndPermissions(token.sub)
      const response = NextResponse.next()
      
      if (userInfo) {
        response.headers.set('x-user-id', userInfo.id)
        response.headers.set('x-user-email', userInfo.email)
        response.headers.set('x-user-type', userInfo.userType)
      }

      return response
    } catch (error) {
      console.error('SuperAdmin authorization error:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

/**
 * Utility untuk mendapatkan user dari request headers (setelah middleware)
 */
export function getUserFromHeaders(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const userEmail = req.headers.get('x-user-email') 
  const userType = req.headers.get('x-user-type') as 'SUPERADMIN' | 'SPPG_USER'
  const userName = req.headers.get('x-user-name')
  const sppgId = req.headers.get('x-user-sppg-id')

  if (!userId || !userEmail || !userType) {
    return null
  }

  return {
    id: userId,
    email: userEmail,
    name: userName || 'Unknown',
    userType,
    sppgId: sppgId || undefined
  }
}

/**
 * Utility untuk check permission di dalam API handlers
 */
export async function checkPermission(userId: string, permission: string): Promise<boolean> {
  return await userHasPermission(userId, permission)
}

/**
 * Utility untuk check apakah user adalah SuperAdmin di dalam API handlers
 */
export async function checkSuperAdmin(userId: string): Promise<boolean> {
  return await isSuperAdmin(userId)
}