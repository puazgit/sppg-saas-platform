/**
 * ROLES SEED - RBAC System According to Documentation
 * Based on: docs/RBAC_SYSTEM.md
 * Structure: Permissions → Roles → RolePermissions
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define permissions according to documentation
const permissions = [
  // System Permissions (SuperAdmin)
  { name: 'platform.manage', description: 'Kelola platform', module: 'platform', action: 'manage' },
  { name: 'sppg.create', description: 'Membuat SPPG baru', module: 'sppg', action: 'create' },
  { name: 'sppg.approve', description: 'Menyetujui SPPG', module: 'sppg', action: 'approve' },
  { name: 'sppg.suspend', description: 'Menangguhkan SPPG', module: 'sppg', action: 'suspend' },
  { name: 'subscription.manage', description: 'Kelola langganan', module: 'subscription', action: 'manage' },
  { name: 'analytics.global', description: 'Analytics global', module: 'analytics', action: 'global' },
  
  // Menu Management
  { name: 'menu.create', description: 'Create menus', module: 'menu', action: 'create' },
  { name: 'menu.read', description: 'View menus', module: 'menu', action: 'read' },
  { name: 'menu.update', description: 'Update menus', module: 'menu', action: 'update' },
  { name: 'menu.delete', description: 'Delete menus', module: 'menu', action: 'delete' },
  { name: 'menu.approve', description: 'Approve menus', module: 'menu', action: 'approve' },
  
  // Menu Planning
  { name: 'menu_planning.create', description: 'Create menu planning', module: 'menu_planning', action: 'create' },
  { name: 'menu_planning.read', description: 'View menu planning', module: 'menu_planning', action: 'read' },
  { name: 'menu_planning.update', description: 'Update menu planning', module: 'menu_planning', action: 'update' },
  { name: 'menu_planning.delete', description: 'Delete menu planning', module: 'menu_planning', action: 'delete' },
  { name: 'menu_planning.approve', description: 'Approve menu planning', module: 'menu_planning', action: 'approve' },
  
  // Procurement
  { name: 'procurement.create', description: 'Create procurement', module: 'procurement', action: 'create' },
  { name: 'procurement.read', description: 'View procurement', module: 'procurement', action: 'read' },
  { name: 'procurement.update', description: 'Update procurement', module: 'procurement', action: 'update' },
  { name: 'procurement.delete', description: 'Delete procurement', module: 'procurement', action: 'delete' },
  { name: 'procurement.approve', description: 'Approve procurement', module: 'procurement', action: 'approve' },
  
  // Production
  { name: 'production.create', description: 'Create production', module: 'production', action: 'create' },
  { name: 'production.read', description: 'View production', module: 'production', action: 'read' },
  { name: 'production.update', description: 'Update production', module: 'production', action: 'update' },
  { name: 'production.approve', description: 'Approve production', module: 'production', action: 'approve' },
  
  // Distribution
  { name: 'distribution.create', description: 'Create distribution', module: 'distribution', action: 'create' },
  { name: 'distribution.read', description: 'View distribution', module: 'distribution', action: 'read' },
  { name: 'distribution.update', description: 'Update distribution', module: 'distribution', action: 'update' },
  { name: 'distribution.approve', description: 'Approve distribution', module: 'distribution', action: 'approve' },
  
  // Inventory & Stock
  { name: 'inventory.read', description: 'View inventory', module: 'inventory', action: 'read' },
  { name: 'inventory.update', description: 'Update inventory', module: 'inventory', action: 'update' },
  { name: 'inventory.audit', description: 'Audit inventory', module: 'inventory', action: 'audit' },
  
  // Staff Management
  { name: 'staff.create', description: 'Create staff', module: 'staff', action: 'create' },
  { name: 'staff.read', description: 'View staff', module: 'staff', action: 'read' },
  { name: 'staff.update', description: 'Update staff', module: 'staff', action: 'update' },
  { name: 'staff.delete', description: 'Delete staff', module: 'staff', action: 'delete' },
  
  // Reports
  { name: 'report.daily', description: 'View daily reports', module: 'report', action: 'daily' },
  { name: 'report.weekly', description: 'View weekly reports', module: 'report', action: 'weekly' },
  { name: 'report.monthly', description: 'View monthly reports', module: 'report', action: 'monthly' },
  { name: 'report.export', description: 'Export reports', module: 'report', action: 'export' },
  
  // Distribution Points
  { name: 'distribution_point.create', description: 'Create distribution points', module: 'distribution_point', action: 'create' },
  { name: 'distribution_point.read', description: 'View distribution points', module: 'distribution_point', action: 'read' },
  { name: 'distribution_point.update', description: 'Update distribution points', module: 'distribution_point', action: 'update' },
  { name: 'distribution_point.delete', description: 'Delete distribution points', module: 'distribution_point', action: 'delete' }
]

// Define roles according to documentation
const roles = [
  // System Role
  {
    id: 'superadmin',
    name: 'SuperAdmin Platform',
    description: 'Administrator platform dengan akses penuh',
    isSystemRole: true,
    permissions: [
      'platform.manage', 'sppg.create', 'sppg.approve', 'sppg.suspend', 
      'subscription.manage', 'analytics.global'
    ]
  },
  
  // SPPG Roles (8 roles as per documentation)
  {
    id: 'admin-sppg',
    name: 'Admin SPPG',
    description: 'Administrator SPPG dengan akses penuh',
    isSystemRole: false,
    permissions: [
      // All SPPG permissions
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
    id: 'manager-operasional',
    name: 'Manager Operasional',
    description: 'Manager dengan akses approve',
    isSystemRole: false,
    permissions: [
      // Read all modules + approve permissions
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
    id: 'koordinator-dapur',
    name: 'Koordinator Dapur',
    description: 'Koordinator produksi makanan',
    isSystemRole: false,
    permissions: [
      // Menu, planning, procurement (read), production (full), inventory
      'menu.read', 'menu.create', 'menu.update',
      'menu_planning.read', 'menu_planning.create', 'menu_planning.update',
      'procurement.read',
      'production.create', 'production.read', 'production.update', 'production.approve',
      'inventory.read', 'inventory.update',
      'staff.read'
    ]
  },
  
  {
    id: 'staff-dapur',
    name: 'Staff Dapur',
    description: 'Staff produksi makanan',
    isSystemRole: false,
    permissions: [
      // Menu (read), planning (read), production (create/read), inventory (read)
      'menu.read',
      'menu_planning.read',
      'production.create', 'production.read',
      'inventory.read'
    ]
  },
  
  {
    id: 'koordinator-distribusi',
    name: 'Koordinator Distribusi',
    description: 'Koordinator distribusi makanan',
    isSystemRole: false,
    permissions: [
      // Production (read), distribution (full), distribution points
      'production.read',
      'distribution.create', 'distribution.read', 'distribution.update', 'distribution.approve',
      'distribution_point.create', 'distribution_point.read', 'distribution_point.update', 'distribution_point.delete',
      'staff.read'
    ]
  },
  
  {
    id: 'staff-distribusi',
    name: 'Staff Distribusi',
    description: 'Staff distribusi makanan',
    isSystemRole: false,
    permissions: [
      // Distribution (create/read), distribution points (read)
      'distribution.create', 'distribution.read',
      'distribution_point.read'
    ]
  },
  
  {
    id: 'admin-keuangan',
    name: 'Admin Keuangan',
    description: 'Administrator keuangan',
    isSystemRole: false,
    permissions: [
      // Procurement (read/approve), inventory (read/audit), reports (full)
      'procurement.read', 'procurement.approve',
      'inventory.read', 'inventory.audit',
      'report.daily', 'report.weekly', 'report.monthly', 'report.export'
    ]
  },
  
  {
    id: 'staff-admin',
    name: 'Staff Admin',
    description: 'Staff administrasi',
    isSystemRole: false,
    permissions: [
      // Planning, procurement, reports, distribution points
      'menu_planning.read', 'menu_planning.create', 'menu_planning.update',
      'procurement.read', 'procurement.create', 'procurement.update',
      'report.daily', 'report.weekly', 'report.monthly',
      'distribution_point.read', 'distribution_point.create', 'distribution_point.update'
    ]
  }
]

async function seedRBAC() {
  console.log('🔐 SEEDING RBAC SYSTEM (Documentation Compliant)')
  console.log('📚 Based on: docs/RBAC_SYSTEM.md')
  console.log('📊 Structure: Permissions → Roles → RolePermissions')
  console.log()

  // Step 1: Seed permissions
  console.log('🔑 Seeding permissions...')
  for (const permData of permissions) {
    await prisma.permission.upsert({
      where: { name: permData.name },
      update: {
        description: permData.description,
        module: permData.module,
        action: permData.action
      },
      create: {
        name: permData.name,
        description: permData.description,
        module: permData.module,
        action: permData.action
      }
    })
  }
  console.log(`   ✅ Seeded ${permissions.length} permissions`)

  // Step 2: Seed roles
  console.log('👥 Seeding roles...')
  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { id: roleData.id },
      update: {
        name: roleData.name,
        description: roleData.description,
        isSystemRole: roleData.isSystemRole
      },
      create: {
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
        isSystemRole: roleData.isSystemRole
      }
    })
    console.log(`   ✅ ${roleData.name}`)
  }

  // Step 3: Seed role permissions
  console.log('🔗 Linking roles to permissions...')
  for (const roleData of roles) {
    // Clear existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: roleData.id }
    })
    
    // Add new permissions
    for (const permissionName of roleData.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })
      
      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: roleData.id,
            permissionId: permission.id
          }
        })
      }
    }
    console.log(`   ✅ ${roleData.name}: ${roleData.permissions.length} permissions`)
  }

  console.log()
  console.log('🎉 RBAC system seeding completed!')
  console.log()
  console.log('📋 FINAL SUMMARY:')
  console.log(`   🔑 Permissions: ${permissions.length}`)
  console.log(`   👥 Roles: ${roles.length}`)
  console.log(`   🔗 Role-Permission Links: ${roles.reduce((sum, role) => sum + role.permissions.length, 0)}`)
  console.log()
  console.log('🎯 ROLE STRUCTURE (Documentation Compliant):')
  console.log('   🔵 SYSTEM ROLES:')
  console.log('     ✅ SuperAdmin Platform: Full system access')
  console.log('   🟢 SPPG ROLES:')
  console.log('     ✅ Admin SPPG: Full SPPG management')
  console.log('     ✅ Manager Operasional: Approval management')
  console.log('     ✅ Koordinator Dapur: Kitchen coordination')
  console.log('     ✅ Staff Dapur: Kitchen operations')
  console.log('     ✅ Koordinator Distribusi: Distribution coordination')
  console.log('     ✅ Staff Distribusi: Distribution operations')
  console.log('     ✅ Admin Keuangan: Financial management')
  console.log('     ✅ Staff Admin: Administrative tasks')
}

if (require.main === module) {
  seedRBAC()
    .catch((e) => {
      console.error('❌ RBAC seeding failed:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default seedRBAC