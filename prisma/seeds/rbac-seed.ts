import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// System Permissions untuk seluruh platform
const SYSTEM_PERMISSIONS = [
  // SuperAdmin Permissions
  { name: 'platform.manage', description: 'Kelola platform secara keseluruhan', module: 'platform', action: 'manage' },
  { name: 'sppg.create', description: 'Membuat SPPG baru', module: 'sppg', action: 'create' },
  { name: 'sppg.approve', description: 'Menyetujui pendaftaran SPPG', module: 'sppg', action: 'approve' },
  { name: 'sppg.suspend', description: 'Menangguhkan SPPG', module: 'sppg', action: 'suspend' },
  { name: 'subscription.manage', description: 'Kelola semua langganan', module: 'subscription', action: 'manage' },
  { name: 'analytics.global', description: 'Lihat analytics global', module: 'analytics', action: 'global' },
]

// SPPG Permissions untuk operasional SPPG
const SPPG_PERMISSIONS = [
  // Menu Management
  { name: 'menu.create', description: 'Membuat menu baru', module: 'menu', action: 'create' },
  { name: 'menu.read', description: 'Melihat menu', module: 'menu', action: 'read' },
  { name: 'menu.update', description: 'Mengubah menu', module: 'menu', action: 'update' },
  { name: 'menu.delete', description: 'Menghapus menu', module: 'menu', action: 'delete' },
  { name: 'menu.approve', description: 'Menyetujui menu', module: 'menu', action: 'approve' },

  // Menu Planning
  { name: 'menu_planning.create', description: 'Membuat perencanaan menu', module: 'menu_planning', action: 'create' },
  { name: 'menu_planning.read', description: 'Melihat perencanaan menu', module: 'menu_planning', action: 'read' },
  { name: 'menu_planning.update', description: 'Mengubah perencanaan menu', module: 'menu_planning', action: 'update' },
  { name: 'menu_planning.delete', description: 'Menghapus perencanaan menu', module: 'menu_planning', action: 'delete' },
  { name: 'menu_planning.approve', description: 'Menyetujui perencanaan menu', module: 'menu_planning', action: 'approve' },

  // Procurement
  { name: 'procurement.create', description: 'Membuat pengadaan', module: 'procurement', action: 'create' },
  { name: 'procurement.read', description: 'Melihat pengadaan', module: 'procurement', action: 'read' },
  { name: 'procurement.update', description: 'Mengubah pengadaan', module: 'procurement', action: 'update' },
  { name: 'procurement.delete', description: 'Menghapus pengadaan', module: 'procurement', action: 'delete' },
  { name: 'procurement.approve', description: 'Menyetujui pengadaan', module: 'procurement', action: 'approve' },

  // Production
  { name: 'production.create', description: 'Input data produksi', module: 'production', action: 'create' },
  { name: 'production.read', description: 'Melihat data produksi', module: 'production', action: 'read' },
  { name: 'production.update', description: 'Mengubah data produksi', module: 'production', action: 'update' },
  { name: 'production.approve', description: 'Menyetujui produksi', module: 'production', action: 'approve' },

  // Distribution
  { name: 'distribution.create', description: 'Input data distribusi', module: 'distribution', action: 'create' },
  { name: 'distribution.read', description: 'Melihat data distribusi', module: 'distribution', action: 'read' },
  { name: 'distribution.update', description: 'Mengubah data distribusi', module: 'distribution', action: 'update' },
  { name: 'distribution.approve', description: 'Menyetujui distribusi', module: 'distribution', action: 'approve' },

  // Inventory & Stock
  { name: 'inventory.read', description: 'Melihat stok', module: 'inventory', action: 'read' },
  { name: 'inventory.update', description: 'Update stok', module: 'inventory', action: 'update' },
  { name: 'inventory.audit', description: 'Audit stok', module: 'inventory', action: 'audit' },

  // Staff Management
  { name: 'staff.create', description: 'Menambah staf', module: 'staff', action: 'create' },
  { name: 'staff.read', description: 'Melihat data staf', module: 'staff', action: 'read' },
  { name: 'staff.update', description: 'Mengubah data staf', module: 'staff', action: 'update' },
  { name: 'staff.delete', description: 'Menghapus staf', module: 'staff', action: 'delete' },

  // Reports
  { name: 'report.daily', description: 'Melihat laporan harian', module: 'report', action: 'daily' },
  { name: 'report.weekly', description: 'Melihat laporan mingguan', module: 'report', action: 'weekly' },
  { name: 'report.monthly', description: 'Melihat laporan bulanan', module: 'report', action: 'monthly' },
  { name: 'report.export', description: 'Export laporan', module: 'report', action: 'export' },

  // Distribution Points
  { name: 'distribution_point.create', description: 'Membuat titik distribusi', module: 'distribution_point', action: 'create' },
  { name: 'distribution_point.read', description: 'Melihat titik distribusi', module: 'distribution_point', action: 'read' },
  { name: 'distribution_point.update', description: 'Mengubah titik distribusi', module: 'distribution_point', action: 'update' },
  { name: 'distribution_point.delete', description: 'Menghapus titik distribusi', module: 'distribution_point', action: 'delete' },
]

// Default System Roles
const SYSTEM_ROLES = [
  {
    name: 'SuperAdmin Platform',
    description: 'Administrator utama platform SPPG SaaS',
    isSystemRole: true,
    permissions: ['platform.manage', 'sppg.create', 'sppg.approve', 'sppg.suspend', 'subscription.manage', 'analytics.global']
  }
]

// Default SPPG Roles Template (akan dibuat untuk setiap SPPG)
const SPPG_ROLE_TEMPLATES = [
  {
    name: 'Admin SPPG',
    description: 'Administrator SPPG dengan akses penuh',
    permissions: [
      // Full access to all modules
      'menu.create', 'menu.read', 'menu.update', 'menu.delete', 'menu.approve',
      'menu_planning.create', 'menu_planning.read', 'menu_planning.update', 'menu_planning.delete', 'menu_planning.approve',
      'procurement.create', 'procurement.read', 'procurement.update', 'procurement.delete', 'procurement.approve',
      'production.create', 'production.read', 'production.update', 'production.approve',
      'distribution.create', 'distribution.read', 'distribution.update', 'distribution.approve',
      'inventory.read', 'inventory.update', 'inventory.audit',
      'staff.create', 'staff.read', 'staff.update', 'staff.delete',
      'report.daily', 'report.weekly', 'report.monthly', 'report.export',
      'distribution_point.create', 'distribution_point.read', 'distribution_point.update', 'distribution_point.delete'
    ]
  },
  {
    name: 'Manager Operasional',
    description: 'Manager operasional dengan akses approve',
    permissions: [
      'menu.read', 'menu.approve',
      'menu_planning.read', 'menu_planning.approve',
      'procurement.read', 'procurement.approve',
      'production.read', 'production.approve',
      'distribution.read', 'distribution.approve',
      'inventory.read', 'inventory.audit',
      'staff.read',
      'report.daily', 'report.weekly', 'report.monthly', 'report.export',
      'distribution_point.read'
    ]
  },
  {
    name: 'Koordinator Dapur',
    description: 'Koordinator produksi makanan',
    permissions: [
      'menu.read',
      'menu_planning.read',
      'procurement.read',
      'production.create', 'production.read', 'production.update',
      'inventory.read', 'inventory.update',
      'report.daily',
      'distribution_point.read'
    ]
  },
  {
    name: 'Staff Dapur',
    description: 'Staff produksi makanan',
    permissions: [
      'menu.read',
      'menu_planning.read',
      'production.create', 'production.read',
      'inventory.read',
      'report.daily'
    ]
  },
  {
    name: 'Koordinator Distribusi',
    description: 'Koordinator distribusi makanan',
    permissions: [
      'menu.read',
      'menu_planning.read',
      'production.read',
      'distribution.create', 'distribution.read', 'distribution.update',
      'inventory.read',
      'report.daily',
      'distribution_point.read', 'distribution_point.update'
    ]
  },
  {
    name: 'Staff Distribusi',
    description: 'Staff distribusi makanan',
    permissions: [
      'menu.read',
      'distribution.create', 'distribution.read',
      'report.daily',
      'distribution_point.read'
    ]
  },
  {
    name: 'Admin Keuangan',
    description: 'Administrator keuangan',
    permissions: [
      'procurement.read', 'procurement.approve',
      'inventory.read', 'inventory.audit',
      'report.daily', 'report.weekly', 'report.monthly', 'report.export'
    ]
  },
  {
    name: 'Staff Admin',
    description: 'Staff administrasi',
    permissions: [
      'menu_planning.create', 'menu_planning.read', 'menu_planning.update',
      'procurement.create', 'procurement.read', 'procurement.update',
      'staff.read',
      'report.daily', 'report.weekly', 'report.monthly',
      'distribution_point.create', 'distribution_point.read', 'distribution_point.update'
    ]
  }
]

export async function seedRBAC() {
  console.log('🔐 Seeding RBAC System...')

  // 1. Create System Permissions
  console.log('  Creating system permissions...')
  for (const perm of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    })
  }

  // 2. Create SPPG Permissions
  console.log('  Creating SPPG permissions...')
  for (const perm of SPPG_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    })
  }

  // 3. Create System Roles
  console.log('  Creating system roles...')
  for (const roleTemplate of SYSTEM_ROLES) {
    // Check if system role already exists
    let role = await prisma.role.findFirst({
      where: { 
        name: roleTemplate.name,
        isSystemRole: true,
        sppgId: null
      }
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleTemplate.name,
          description: roleTemplate.description,
          isSystemRole: roleTemplate.isSystemRole,
          sppgId: null
        }
      })
    }

    // Assign permissions to system role
    for (const permissionName of roleTemplate.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })
      
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id
          }
        })
      }
    }
  }

  console.log('✅ RBAC System seeded successfully!')
  return { SPPG_ROLE_TEMPLATES }
}

export async function createSppgRoles(sppgId: string) {
  console.log(`🏢 Creating default roles for SPPG: ${sppgId}`)

  for (const roleTemplate of SPPG_ROLE_TEMPLATES) {
    // Check if SPPG role already exists
    let role = await prisma.role.findFirst({
      where: { 
        name: roleTemplate.name,
        sppgId: sppgId
      }
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleTemplate.name,
          description: roleTemplate.description,
          isSystemRole: false,
          sppgId: sppgId
        }
      })
    }

    // Assign permissions to SPPG role
    for (const permissionName of roleTemplate.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })
      
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id
          }
        })
      }
    }
  }

  console.log(`✅ Default roles created for SPPG: ${sppgId}`)
}

export { SPPG_ROLE_TEMPLATES }