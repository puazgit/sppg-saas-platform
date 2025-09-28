import { PrismaClient, OrganizationType, SppgStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedSampleSPPGs() {
  console.log('🏢 SEEDING SAMPLE SPPG ORGANIZATIONS')
  console.log('📊 Creating diverse SPPG data for SuperAdmin dashboard testing')
  console.log()

  try {
    // Get subscription packages
    const packages = await prisma.subscriptionPackage.findMany()
    
    // Get region data for SPPG creation
    const provinces = await prisma.province.findMany({ take: 1 })
    const regencies = await prisma.regency.findMany({ 
      where: { provinceId: provinces[0].id }, 
      take: 2 
    })
    const districts = await prisma.district.findMany({ 
      where: { regencyId: regencies[0].id }, 
      take: 3 
    })
    const villages = await prisma.village.findMany({ 
      where: { districtId: districts[0].id }, 
      take: 3 
    })

    if (regencies.length < 1 || packages.length < 3 || villages.length < 1) {
      throw new Error('Insufficient seed data. Please run regions-seed and subscriptions-seed first.')
    }

    // Sample SPPG organizations
    const sppgData = [
      {
        name: 'SPPG Purwakarta Utara',
        description: 'Satuan Pelayanan Pemenuhan Gizi wilayah Purwakarta Utara',
        organizationType: 'PEMERINTAH',
        status: 'ACTIVE',
        picName: 'Ibu Sari Wijayanti',
        picPhone: '+6281234567001',
        picEmail: 'sari.wijayanti@purwakartautara.org',
        packageTier: 'STANDARD'
      },
      {
        name: 'SPPG Bandung Selatan',
        description: 'Yayasan Gizi Sehat Bandung Selatan',
        organizationType: 'YAYASAN',
        status: 'ACTIVE',
        picName: 'Bapak Ahmad Fauzi',
        picPhone: '+6281234567002',
        picEmail: 'ahmad.fauzi@bandungselatan.org',
        packageTier: 'PRO'
      },
      {
        name: 'SPPG Cianjur Tengah',
        description: 'PT Gizi Mandiri Cianjur',
        organizationType: 'SWASTA',
        status: 'ACTIVE',
        picName: 'Ibu Maya Sari',
        picPhone: '+6281234567003',
        picEmail: 'maya.sari@cianjurtengah.com',
        packageTier: 'BASIC'
      },
      {
        name: 'SPPG Komunitas Sukabumi',
        description: 'Komunitas Peduli Gizi Sukabumi',
        organizationType: 'KOMUNITAS',
        status: 'PENDING_APPROVAL',
        picName: 'Bapak Dedi Setiawan',
        picPhone: '+6281234567004',
        picEmail: 'dedi.setiawan@sukabumi.org',
        packageTier: 'BASIC'
      }
    ]

    for (let i = 0; i < sppgData.length; i++) {
      const data = sppgData[i]
      const regency = regencies[i % regencies.length]
      const district = districts[i % districts.length]
      const village = villages[i % villages.length]
      const packageData = packages.find(p => p.tier === data.packageTier)

      if (!packageData) continue

      console.log(`   📋 Creating ${data.name}...`)

      // Create SPPG
      const targetRecipients = Math.floor(Math.random() * 1000) + 200
      const sppg = await prisma.sPPG.create({
        data: {
          code: `SPPG-${Date.now()}-${i + 1}`,
          name: data.name,
          description: data.description,
          organizationType: data.organizationType as OrganizationType,
          status: data.status as SppgStatus,
          address: `Jl. Contoh No. ${i + 1}, ${district.name}`,
          phone: `+6221555000${i + 1}`,
          email: `info@${data.name.toLowerCase().replace(/\s+/g, '')}.org`,
          picName: data.picName,
          picPosition: 'Koordinator Program',
          picPhone: data.picPhone,
          picEmail: data.picEmail,
          provinceId: provinces[0].id,
          regencyId: regency.id,
          districtId: district.id,
          villageId: village.id,
          operationalDays: 'Senin-Jumat',
          targetRecipients: targetRecipients,
          maxRadius: 15.0,
          maxTravelTime: 45,
          operationStartDate: new Date('2024-01-01'),
        }
      })

      // Create subscription for active SPPGs
      if (data.status === 'ACTIVE') {
        await prisma.subscription.create({
          data: {
            sppgId: sppg.id,
            packageId: packageData.id,
            tier: packageData.tier,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            billingDate: new Date(),
            maxRecipients: packageData.maxRecipients,
            maxStaff: packageData.maxStaff,
            maxDistributionPoints: packageData.maxDistributionPoints,
            storageGb: packageData.storageGb,
          }
        })

        console.log(`   💳 Subscription created: ${packageData.tier}`)
      }

      // Create SPPG Admin user
      const hashedPassword = await bcrypt.hash('password123', 12)
      
      const adminUser = await prisma.user.create({
        data: {
          email: `admin-${i + 1}-${Date.now()}@example.com`,
          password: hashedPassword,
          name: data.picName,
          phone: data.picPhone,
          userType: 'SPPG_USER',
          sppg: {
            connect: { id: sppg.id }
          },
          isActive: true,
          emailVerified: new Date(),
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      })

      // Create user role
      if (data.status === 'ACTIVE') {
        // Get SPPG Admin role
        const adminRole = await prisma.role.findFirst({
          where: { name: 'SPPG_ADMIN', sppgId: sppg.id }
        })

        if (adminRole) {
          await prisma.userRole.create({
            data: {
              userId: adminUser.id,
              roleId: adminRole.id,
              assignedBy: adminUser.id,
              isActive: true
            }
          })
        }
      }

      // Sample menus
      for (let j = 0; j < Math.floor(Math.random() * 10) + 5; j++) {
        await prisma.menu.create({
          data: {
            sppgId: sppg.id,
            code: `MENU-${i + 1}-${j + 1}`,
            name: `Menu Bergizi ${j + 1}`,
            description: 'Menu sehat dan bergizi seimbang',
            type: 'LUNCH',
            category: 'STAPLE_FOOD',
            caloriesPerServing: Math.floor(Math.random() * 300) + 400,
            proteinGrams: Math.floor(Math.random() * 20) + 15,
            fatGrams: Math.floor(Math.random() * 15) + 10,
            carbohydrateGrams: Math.floor(Math.random() * 50) + 50,
            fiberGrams: Math.floor(Math.random() * 5) + 3,
            costPerServing: Math.floor(Math.random() * 15000) + 10000,
            preparationTimeMinutes: Math.floor(Math.random() * 60) + 30,
            servingsPerBatch: Math.floor(Math.random() * 100) + 50,
          }
        })
      }

      // Sample distribution points
      for (let k = 0; k < Math.floor(Math.random() * 5) + 1; k++) {
        await prisma.distributionPoint.create({
          data: {
            sppgId: sppg.id,
            code: `DP-${i + 1}-${k + 1}`,
            name: `Titik Distribusi ${k + 1}`,
            address: `Alamat Distribusi ${k + 1}, ${district.name}`,
            type: 'ELEMENTARY_SCHOOL',
            latitude: -6.2 + (Math.random() - 0.5) * 0.1,
            longitude: 106.8 + (Math.random() - 0.5) * 0.1,
            contactPersonName: `Koordinator ${k + 1}`,
            contactPersonPhone: `+6281234560${k}${i}`,
            dailyPortions: Math.floor(Math.random() * 200) + 50,
            operatingDays: 'Senin-Jumat',
            deliveryTime: '11:00-12:00',
            isActive: true,
          }
        })
      }

      console.log(`   ✅ ${data.name} created successfully`)
    }

    console.log()
    console.log('🎉 Sample SPPG seeding completed!')
    
    // Show summary
    const [totalSPPGs, activeSubscriptions, totalUsers] = await Promise.all([
      prisma.sPPG.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { userType: { not: 'SUPERADMIN' } } })
    ])

    console.log()
    console.log('📊 DASHBOARD DATA SUMMARY:')
    console.log(`   🏢 Total SPPGs: ${totalSPPGs}`)
    console.log(`   💳 Active Subscriptions: ${activeSubscriptions}`)
    console.log(`   👥 SPPG Users: ${totalUsers}`)
    console.log()
    console.log('🚀 SuperAdmin Dashboard ready with sample data!')

  } catch (error) {
    console.error('❌ Sample SPPG seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedSampleSPPGs()
    .then(() => {
      console.log('✅ Sample SPPG seeding process completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Sample SPPG seeding process failed:', error)
      process.exit(1)
    })
}

export default seedSampleSPPGs