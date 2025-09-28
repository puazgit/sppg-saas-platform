import { PrismaClient, UserType } from '@prisma/client'

const prisma = new PrismaClient()

// Utility functions untuk Role-Based Access Control

/**
 * Assign role ke user
 */
export async function assignRoleToUser(userId: string, roleName: string, sppgId?: string) {
  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
      sppgId: sppgId || null
    }
  })

  if (!role) {
    throw new Error(`Role "${roleName}" tidak ditemukan${sppgId ? ` untuk SPPG ${sppgId}` : ''}`)
  }

  return await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id
      }
    },
    update: {
      isActive: true
    },
    create: {
      userId,
      roleId: role.id,
      isActive: true
    }
  })
}

/**
 * Remove role dari user
 */
export async function removeRoleFromUser(userId: string, roleName: string, sppgId?: string) {
  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
      sppgId: sppgId || null
    }
  })

  if (!role) {
    throw new Error(`Role "${roleName}" tidak ditemukan`)
  }

  return await prisma.userRole.deleteMany({
    where: {
      userId,
      roleId: role.id
    }
  })
}

/**
 * Check apakah user memiliki permission tertentu
 */
export async function userHasPermission(userId: string, permissionName: string): Promise<boolean> {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: { isActive: true },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!result) return false

  // Check if user has the permission through any of their active roles
  for (const userRole of result.userRoles) {
    const permissions = userRole.role.rolePermissions.map(rp => rp.permission.name)
    if (permissions.includes(permissionName)) {
      return true
    }
  }

  return false
}

/**
 * Check apakah user memiliki role tertentu
 */
export async function userHasRole(userId: string, roleName: string, sppgId?: string): Promise<boolean> {
  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
      sppgId: sppgId || null
    }
  })

  if (!role) return false

  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      roleId: role.id,
      isActive: true
    }
  })

  return !!userRole
}

/**
 * Get semua permissions user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: { isActive: true },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!result) return []

  const permissions = new Set<string>()
  
  for (const userRole of result.userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      permissions.add(rolePermission.permission.name)
    }
  }

  return Array.from(permissions)
}

/**
 * Get semua roles user
 */
export async function getUserRoles(userId: string) {
  return await prisma.userRole.findMany({
    where: {
      userId,
      isActive: true
    },
    include: {
      role: {
        include: {
          sppg: {
            select: {
              name: true,
              code: true
            }
          }
        }
      }
    }
  })
}

/**
 * Check apakah user adalah SuperAdmin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true }
  })

  return user?.userType === UserType.SUPERADMIN
}

/**
 * Get user details dengan roles dan permissions
 */
export async function getUserWithRolesAndPermissions(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sppg: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      userRoles: {
        where: { isActive: true },
        include: {
          role: {
            include: {
              sppg: {
                select: {
                  name: true,
                  code: true
                }
              },
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })
}

/**
 * Create new SPPG dengan default roles
 */
export async function createSppgWithDefaultRoles(sppgData: Parameters<typeof prisma.sPPG.create>[0]['data']) {
  // Create SPPG
  const sppg = await prisma.sPPG.create({
    data: sppgData
  })

  // SPPG roles akan dibuat secara manual atau melalui admin interface
  // Tidak perlu auto-create roles di sini karena roles sudah di-seed globally
  // Admin SPPG akan assign roles ke users sesuai kebutuhan
  
  return sppg
}

const rbacUtils = {
  assignRoleToUser,
  removeRoleFromUser,
  userHasPermission,
  userHasRole,
  getUserPermissions,
  getUserRoles,
  isSuperAdmin,
  getUserWithRolesAndPermissions,
  createSppgWithDefaultRoles
}

export default rbacUtils