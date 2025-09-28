/**
 * SUPERADMIN USER SEED
 * Create initial SuperAdmin user for SPPG SaaS Platform access
 * This user will have full system access to manage the platform
 */

import { PrismaClient, UserType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Default SuperAdmin configuration
const SUPERADMIN_CONFIG = {
  email: 'superadmin@sppg-platform.com',
  password: 'SuperAdmin123!',
  name: 'Super Administrator',
  phone: '+62812345678900'
}

async function seedSuperAdmin() {
  console.log('👤 SEEDING SUPERADMIN USER')
  console.log('🔑 Creating initial platform administrator')
  console.log()

  try {
    // Check if superadmin role exists
    const superAdminRole = await prisma.role.findFirst({
      where: { 
        name: 'SuperAdmin Platform',
        isSystemRole: true 
      }
    })

    if (!superAdminRole) {
      throw new Error('SuperAdmin role not found. Please run RBAC seed first.')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(SUPERADMIN_CONFIG.password, 12)

    // Create or update SuperAdmin user
    const superAdminUser = await prisma.user.upsert({
      where: { email: SUPERADMIN_CONFIG.email },
      update: {
        name: SUPERADMIN_CONFIG.name,
        phone: SUPERADMIN_CONFIG.phone,
        userType: UserType.SUPERADMIN,
        emailVerified: new Date(), // Auto-verify superadmin
        isActive: true
      },
      create: {
        email: SUPERADMIN_CONFIG.email,
        password: hashedPassword,
        name: SUPERADMIN_CONFIG.name,
        phone: SUPERADMIN_CONFIG.phone,
        userType: UserType.SUPERADMIN,
        sppgId: null, // SuperAdmin is not bound to any SPPG
        emailVerified: new Date(), // Auto-verify superadmin
        isActive: true
      }
    })

    console.log(`   ✅ SuperAdmin user: ${superAdminUser.email}`)

    // Assign SuperAdmin role to user
    const existingUserRole = await prisma.userRole.findFirst({
      where: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id
      }
    })

    if (!existingUserRole) {
      await prisma.userRole.create({
        data: {
          userId: superAdminUser.id,
          roleId: superAdminRole.id,
          assignedBy: superAdminUser.id, // Self-assigned
          isActive: true
        }
      })
      console.log(`   ✅ SuperAdmin role assigned`)
    } else {
      console.log(`   ℹ️  SuperAdmin role already assigned`)
    }

    console.log()
    console.log('🎉 SuperAdmin user seeding completed!')
    console.log()
    console.log('📋 SUPERADMIN CREDENTIALS:')
    console.log(`   📧 Email: ${SUPERADMIN_CONFIG.email}`)
    console.log(`   🔐 Password: ${SUPERADMIN_CONFIG.password}`)
    console.log(`   👤 Name: ${SUPERADMIN_CONFIG.name}`)
    console.log(`   📱 Phone: ${SUPERADMIN_CONFIG.phone}`)
    console.log()
    console.log('🚀 PLATFORM ACCESS:')
    console.log('   ✅ Full system administration')
    console.log('   ✅ SPPG creation and management')
    console.log('   ✅ Subscription management')
    console.log('   ✅ Global analytics access')
    console.log('   ✅ Platform configuration')
    console.log()
    console.log('⚠️  SECURITY NOTE:')
    console.log('   🔒 Change default password after first login')
    console.log('   🔒 Enable 2FA for enhanced security')
    console.log('   🔒 Use strong password policy')

  } catch (error) {
    console.error('❌ SuperAdmin seeding failed:', error)
    throw error
  }
}

if (require.main === module) {
  seedSuperAdmin()
    .catch((e) => {
      console.error('❌ SuperAdmin seeding failed:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default seedSuperAdmin