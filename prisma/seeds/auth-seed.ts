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
  
  // Recipe Management
  { name: 'recipe.create', description: 'Membuat resep baru', module: 'recipe', action: 'create' },
  { name: 'recipe.read', description: 'Melihat resep', module: 'recipe', action: 'read' },
  { name: 'recipe.update', description: 'Mengubah resep', module: 'recipe', action: 'update' },
  { name: 'recipe.delete', description: 'Menghapus resep', module: 'recipe', action: 'delete' },
  
  // Production Management
  { name: 'production.create', description: 'Membuat jadwal produksi', module: 'production', action: 'create' },
  { name: 'production.read', description: 'Melihat jadwal produksi', module: 'production', action: 'read' },
  { name: 'production.update', description: 'Mengubah jadwal produksi', module: 'production', action: 'update' },
  { name: 'production.start', description: 'Memulai produksi', module: 'production', action: 'start' },
  { name: 'production.complete', description: 'Menyelesaikan produksi', module: 'production', action: 'complete' },
  
  // Inventory Management
  { name: 'inventory.create', description: 'Menambah item inventory', module: 'inventory', action: 'create' },
  { name: 'inventory.read', description: 'Melihat inventory', module: 'inventory', action: 'read' },
  { name: 'inventory.update', description: 'Mengubah inventory', module: 'inventory', action: 'update' },
  { name: 'inventory.adjust', description: 'Penyesuaian stok inventory', module: 'inventory', action: 'adjust' },
  
  // Distribution Management
  { name: 'distribution.create', description: 'Membuat jadwal distribusi', module: 'distribution', action: 'create' },
  { name: 'distribution.read', description: 'Melihat distribusi', module: 'distribution', action: 'read' },
  { name: 'distribution.update', description: 'Mengubah distribusi', module: 'distribution', action: 'update' },
  { name: 'distribution.deliver', description: 'Melakukan pengiriman', module: 'distribution', action: 'deliver' },
  { name: 'distribution.confirm', description: 'Konfirmasi penerimaan', module: 'distribution', action: 'confirm' },
  
  // Recipient Management
  { name: 'recipient.create', description: 'Menambah penerima bantuan', module: 'recipient', action: 'create' },
  { name: 'recipient.read', description: 'Melihat data penerima', module: 'recipient', action: 'read' },
  { name: 'recipient.update', description: 'Mengubah data penerima', module: 'recipient', action: 'update' },
  { name: 'recipient.verify', description: 'Verifikasi penerima bantuan', module: 'recipient', action: 'verify' },
  
  // Reporting
  { name: 'report.production', description: 'Lihat laporan produksi', module: 'report', action: 'production' },
  { name: 'report.distribution', description: 'Lihat laporan distribusi', module: 'report', action: 'distribution' },
  { name: 'report.financial', description: 'Lihat laporan keuangan', module: 'report', action: 'financial' },
  { name: 'report.nutrition', description: 'Lihat laporan gizi', module: 'report', action: 'nutrition' },
  
  // Staff Management
  { name: 'staff.create', description: 'Menambah staff', module: 'staff', action: 'create' },
  { name: 'staff.read', description: 'Melihat data staff', module: 'staff', action: 'read' },
  { name: 'staff.update', description: 'Mengubah data staff', module: 'staff', action: 'update' },
  { name: 'staff.deactivate', description: 'Menonaktifkan staff', module: 'staff', action: 'deactivate' }
]

// System Roles
const SYSTEM_ROLES = [
  {
    name: 'SuperAdmin',
    description: 'Administrator platform dengan akses penuh',
    isSystemRole: true,
    sppgId: null,
    permissions: SYSTEM_PERMISSIONS.map(p => p.name)
  }
]

// SPPG Roles Template (akan dibuat untuk setiap SPPG)
const SPPG_ROLE_TEMPLATES = [
  {
    name: 'SPPG Admin',
    description: 'Administrator SPPG dengan akses penuh',
    isSystemRole: false,
    permissions: SPPG_PERMISSIONS.map(p => p.name)
  },
  {
    name: 'Kitchen Manager',
    description: 'Manajer dapur yang mengatur produksi dan menu',
    isSystemRole: false,
    permissions: [
      'menu.create', 'menu.read', 'menu.update',
      'recipe.create', 'recipe.read', 'recipe.update',
      'production.create', 'production.read', 'production.update', 'production.start', 'production.complete',
      'inventory.read', 'inventory.adjust',
      'report.production', 'report.nutrition'
    ]
  },
  {
    name: 'Inventory Manager',
    description: 'Manajer inventory yang mengatur persediaan',
    isSystemRole: false,
    permissions: [
      'inventory.create', 'inventory.read', 'inventory.update', 'inventory.adjust',
      'recipe.read',
      'report.production'
    ]
  },
  {
    name: 'Distribution Manager',
    description: 'Manajer distribusi yang mengatur pengiriman',
    isSystemRole: false,
    permissions: [
      'distribution.create', 'distribution.read', 'distribution.update', 'distribution.deliver',
      'recipient.read', 'recipient.verify',
      'report.distribution'
    ]
  },
  {
    name: 'Staff',
    description: 'Staff operasional dengan akses terbatas',
    isSystemRole: false,
    permissions: [
      'menu.read',
      'recipe.read',
      'production.read',
      'inventory.read',
      'distribution.read'
    ]
  }
]

export async function seedPermissions() {
  console.log('🔐 Seeding System Permissions...')
  
  const allPermissions = [...SYSTEM_PERMISSIONS, ...SPPG_PERMISSIONS]
  
  for (const permission of allPermissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    })
  }
  
  console.log('✅ Permissions seeded successfully!')
}

export async function seedRoles() {
  console.log('👥 Seeding System Roles...')
  
  // Create system roles
  for (const roleData of SYSTEM_ROLES) {
    const { permissions, ...role } = roleData
    
    // Check if role already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        name: role.name,
        isSystemRole: role.isSystemRole
      }
    })
    
    let createdRole = existingRole
    if (!existingRole) {
      createdRole = await prisma.role.create({
        data: role
      })
    }
    
    // Assign permissions to role
    if (createdRole) {
      for (const permissionName of permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName }
        })
        
        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: createdRole.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: createdRole.id,
              permissionId: permission.id
            }
          })
        }
      }
    }
  }
  
  console.log('✅ System roles seeded successfully!')
}

export async function seedSPPGRoleTemplates(sppgId: string) {
  console.log(`👥 Seeding SPPG Role Templates for SPPG: ${sppgId}...`)
  
  // Create SPPG-specific roles
  for (const templateData of SPPG_ROLE_TEMPLATES) {
    const { permissions, ...template } = templateData
    
    const roleData = {
      ...template,
      sppgId: sppgId
    }
    
    // Check if role already exists for this SPPG
    const existingRole = await prisma.role.findFirst({
      where: {
        name: roleData.name,
        sppgId: roleData.sppgId
      }
    })
    
    let createdRole = existingRole
    if (!existingRole) {
      createdRole = await prisma.role.create({
        data: roleData
      })
    }
    
    // Assign permissions to role
    if (createdRole) {
      for (const permissionName of permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName }
        })
        
        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: createdRole.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: createdRole.id,
              permissionId: permission.id
            }
          })
        }
      }
    }
  }
  
  console.log(`✅ SPPG role templates seeded for SPPG: ${sppgId}!`)
}

export async function seedAuthData() {
  console.log('🔒 Starting Authentication Data Seeding...')
  
  await seedPermissions()
  await seedRoles()
  
  console.log('✅ Authentication data seeded successfully!')
}