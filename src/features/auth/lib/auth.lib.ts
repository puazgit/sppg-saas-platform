import { getUserWithRolesAndPermissions, userHasPermission, isSuperAdmin } from '@/lib/rbac'
import type { AuthUser } from '../types/auth.types'

/**
 * Auth utility functions for the auth feature
 */

/**
 * Get user with complete auth information
 */
export async function getAuthUser(userId: string): Promise<AuthUser | null> {
  try {
    const userDetails = await getUserWithRolesAndPermissions(userId)
    
    if (!userDetails) {
      return null
    }

    return {
      id: userDetails.id,
      email: userDetails.email,
      name: userDetails.name,
      userType: userDetails.userType,
      sppgId: userDetails.sppgId || undefined,
      roles: userDetails.userRoles?.map(ur => ({
        id: ur.id,
        roleId: ur.roleId,
        role: {
          id: ur.role.id,
          name: ur.role.name,
          description: ur.role.description || undefined,
          sppgId: ur.role.sppgId || undefined,
        }
      })) || [],
      permissions: userDetails.userRoles?.flatMap(ur => 
        ur.role.rolePermissions?.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name,
          action: rp.permission.action,
          module: rp.permission.module,
          description: rp.permission.description || undefined,
        })) || []
      ) || []
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Check if user has specific permission
 */
export async function hasUserPermission(userId: string, permission: string): Promise<boolean> {
  return await userHasPermission(userId, permission)
}

/**
 * Check if user is SuperAdmin
 */
export async function isUserSuperAdmin(userId: string): Promise<boolean> {
  return await isSuperAdmin(userId)
}

/**
 * Validate user credentials for login
 */
export async function validateCredentials(email: string, password: string) {
  // This will be implemented when we create the API endpoints
  // For now, return a placeholder
  console.log('Validating credentials for:', email, password ? '[HIDDEN]' : '[NO_PASSWORD]')
  return null
}