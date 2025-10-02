import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('🔍 CHECKING USERS IN SPPG SAAS PLATFORM DATABASE')
  console.log('='.repeat(60))
  
  try {
    // Get all users with their roles and SPPG info
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        sppg: {
          include: {
            subscription: {
              include: {
                package: true
              }
            }
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
      console.log(`   ✅ Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
      console.log(`   🔐 Password Set: ${user.password ? 'Yes' : 'No'}`)
      
      // Show roles
      if (user.userRoles.length > 0) {
        console.log(`   🎭 Roles:`)
        user.userRoles.forEach(userRole => {
          console.log(`      - ${userRole.role.name}`)
        })
      } else {
        console.log(`   🎭 Roles: No roles assigned`)
      }

      // Show SPPG association
      if (user.sppg) {
        console.log(`   🏢 SPPG: ${user.sppg.name}`)
        console.log(`   📍 Location: ${user.sppg.address}`)
        console.log(`   📊 Status: ${user.sppg.status}`)
        if (user.sppg.subscription) {
          console.log(`   💳 Subscription: ${user.sppg.subscription.package?.name || 'No package'}`)
          console.log(`   💰 Status: ${user.sppg.subscription.status}`)
          console.log(`   🎯 Tier: ${user.sppg.subscription.tier}`)
        }
      } else {
        console.log(`   🏢 SPPG: Not associated with any SPPG`)
      }
      console.log('   ' + '-'.repeat(50))
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
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    })

    console.log(`\n🏢 SPPG SUMMARY:`)
    console.log(`   Total SPPGs: ${sppgCount}`)
    console.log(`   Active Subscriptions: ${activeSubscriptions}`)

  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()