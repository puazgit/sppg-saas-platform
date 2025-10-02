import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('🔍 CHECKING USERS IN SPPG SAAS PLATFORM DATABASE')
  console.log('='.repeat(60))
  
  try {
    // Get all users with basic info and roles
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    console.log(`\n📊 TOTAL USERS: ${users.length}`)
    console.log('='.repeat(60))

    users.forEach((user, index) => {
      console.log(`\n👤 USER ${index + 1}:`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   👤 Name: ${user.name}`)
      console.log(`   📱 Phone: ${user.phone || 'Not set'}`)
      console.log(`   🔐 User Type: ${user.userType}`)
      console.log(`   ✅ Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
      console.log(`   🟢 Active: ${user.isActive ? 'Yes' : 'No'}`)
      console.log(`   📅 Last Login: ${user.lastLogin || 'Never'}`)
      console.log(`   🏢 SPPG ID: ${user.sppgId || 'Not associated'}`)
      
      // Show roles
      if (user.userRoles.length > 0) {
        console.log(`   🎭 Roles:`)
        user.userRoles.forEach(userRole => {
          console.log(`      - ${userRole.role.name}`)
        })
      } else {
        console.log(`   🎭 Roles: No roles assigned`)
      }
      
      console.log('   ' + '-'.repeat(50))
    })

    // Summary by user type
    console.log(`\n📋 SUMMARY BY USER TYPE:`)
    const userTypes = await prisma.user.groupBy({
      by: ['userType'],
      _count: {
        id: true
      }
    })

    userTypes.forEach(type => {
      console.log(`   ${type.userType}: ${type._count.id} users`)
    })

    // Summary by role
    console.log(`\n📋 SUMMARY BY ROLE:`)
    const roles = await prisma.role.findMany()
    
    for (const role of roles) {
      const count = await prisma.userRole.count({
        where: { roleId: role.id }
      })
      console.log(`   ${role.name}: ${count} users`)
    }

    // SPPG Summary
    const sppgCount = await prisma.sPPG.count()
    const usersWithSppg = await prisma.user.count({
      where: { sppgId: { not: null } }
    })

    console.log(`\n🏢 SPPG ASSOCIATION SUMMARY:`)
    console.log(`   Total SPPGs: ${sppgCount}`)
    console.log(`   Users with SPPG: ${usersWithSppg}`)
    console.log(`   Users without SPPG: ${users.length - usersWithSppg}`)

    // Get SPPG names for associated users
    if (usersWithSppg > 0) {
      console.log(`\n🏢 SPPG DETAILS:`)
      const sppgs = await prisma.sPPG.findMany({
        include: {
          _count: {
            select: {
              users: true
            }
          }
        }
      })

      sppgs.forEach(sppg => {
        console.log(`   ${sppg.name}: ${sppg._count.users} users`)
      })
    }

  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()