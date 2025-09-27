import { PrismaClient, SppgStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple marketing seed...')

  // First, let's clean up existing data
  console.log('Cleaning existing data...')
  await prisma.specialOffer.deleteMany({})
  await prisma.sPPG.deleteMany({})

  // 1. Create SPPG Organizations with minimal data
  console.log('Creating SPPG organizations...')
  const sppgOrganizations = [
    {
      code: 'SPPG-JKT-001',
      name: 'SPPG Jakarta Pusat',
      description: 'Satuan Pelayanan Gizi Gratis Jakarta Pusat melayani 15,000 siswa setiap hari',
      address: 'Jl. MH Thamrin No. 10, Jakarta Pusat, DKI Jakarta 10110',
      phone: '021-39831234',
      email: 'admin@sppg-jakpus.go.id',
      targetRecipients: 15000,
      maxRadius: 10.0,
      maxTravelTime: 45,
      operationStartDate: new Date('2020-03-15'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '31',
      regencyId: '3171',
      districtId: '317101',
      villageId: '3171011001',
    }
  ]

  // Create each SPPG individually with error handling
  for (const sppg of sppgOrganizations) {
    try {
      await prisma.sPPG.create({
        data: sppg,
      })
      console.log(`✅ Created SPPG: ${sppg.name}`)
    } catch (error) {
      console.log(`⚠️ Error creating SPPG ${sppg.name}:`, error)
      // Try with minimal required fields only
      try {
        await prisma.sPPG.create({
          data: {
            code: sppg.code,
            name: sppg.name,
            description: sppg.description,
            address: sppg.address,
            phone: sppg.phone,
            email: sppg.email,
            targetRecipients: sppg.targetRecipients,
            maxRadius: sppg.maxRadius,
            maxTravelTime: sppg.maxTravelTime,
            operationStartDate: sppg.operationStartDate,
            status: sppg.status,
            // Use generic IDs that should exist
            provinceId: '1',
            regencyId: '1',
            districtId: '1',
            villageId: '1',
          },
        })
        console.log(`✅ Created SPPG with minimal data: ${sppg.name}`)
      } catch (minimalError) {
        console.log(`❌ Failed to create SPPG even with minimal data: ${sppg.name}`, minimalError)
      }
    }
  }

  // Add more SPPG organizations
  const additionalSppgs = [
    {
      code: 'SPPG-BDG-001',
      name: 'SPPG Bandung Raya',
      description: 'Satuan Pelayanan Gizi Gratis Bandung melayani 12,000 siswa',
      address: 'Jl. Asia Afrika No. 142, Bandung, Jawa Barat',
      phone: '022-4237890',
      email: 'admin@sppg-bandung.go.id',
      targetRecipients: 12000,
      maxRadius: 8.0,
      maxTravelTime: 40,
      operationStartDate: new Date('2019-08-22'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '1',
      regencyId: '1',
      districtId: '1',
      villageId: '1',
    },
    {
      code: 'SPPG-SBY-001',
      name: 'SPPG Surabaya Timur',
      description: 'Satuan Pelayanan Gizi Gratis Surabaya dengan teknologi smart kitchen',
      address: 'Jl. Raya Gubeng No. 56, Surabaya, Jawa Timur',
      phone: '031-5678901',
      email: 'admin@sppg-surabaya.go.id',
      targetRecipients: 18000,
      maxRadius: 12.0,
      maxTravelTime: 50,
      operationStartDate: new Date('2018-11-10'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '1',
      regencyId: '1',
      districtId: '1',
      villageId: '1',
    },
    {
      code: 'SPPG-MDN-001',
      name: 'SPPG Medan Kota',
      description: 'Pusat gizi gratis Medan dengan jangkauan terluas di Sumatera Utara',
      address: 'Jl. Sisingamangaraja No. 88, Medan, Sumatera Utara',
      phone: '061-7654321',
      email: 'admin@sppg-medan.go.id',
      targetRecipients: 14000,
      maxRadius: 15.0,
      maxTravelTime: 60,
      operationStartDate: new Date('2021-01-18'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '1',
      regencyId: '1',
      districtId: '1',
      villageId: '1',
    },
    {
      code: 'SPPG-MKS-001',
      name: 'SPPG Makassar Selatan',
      description: 'SPPG Makassar dengan program gizi berbasis kearifan lokal Sulawesi',
      address: 'Jl. Perintis Kemerdekaan No. 45, Makassar, Sulawesi Selatan',
      phone: '0411-859876',
      email: 'admin@sppg-makassar.go.id',
      targetRecipients: 10000,
      maxRadius: 9.0,
      maxTravelTime: 35,
      operationStartDate: new Date('2020-07-05'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '1',
      regencyId: '1',
      districtId: '1',
      villageId: '1',
    }
  ]

  for (const sppg of additionalSppgs) {
    try {
      await prisma.sPPG.create({
        data: sppg,
      })
      console.log(`✅ Created SPPG: ${sppg.name}`)
    } catch (error) {
      console.log(`⚠️ Error creating SPPG ${sppg.name}:`, error)
    }
  }

  // 2. Create Special Offers
  console.log('Creating special offers...')
  const offers = [
    {
      title: 'Government Partnership Program',
      description: 'Diskon khusus 25% untuk SPPG pemerintah daerah dengan komitmen kontrak 2 tahun. Termasuk training dan implementasi gratis.',
      discountPercentage: 25,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      active: true,
      termsConditions: 'Berlaku untuk SPPG pemerintah daerah, minimum kontrak 2 tahun, pembayaran annual di muka',
      targetAudience: ['GOVERNMENT'],
      applicablePackages: ['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE']
    },
    {
      title: 'Early Adopter Bonus', 
      description: 'Bonus 6 bulan gratis untuk 50 SPPG pertama yang bergabung dengan paket PRO atau ENTERPRISE.',
      discountPercentage: 33,
      validFrom: new Date('2024-09-01'),
      validUntil: new Date('2025-03-31'),
      active: true,
      termsConditions: 'Terbatas untuk 50 SPPG pertama, berlaku untuk paket PRO dan ENTERPRISE',
      targetAudience: ['NEW_CUSTOMERS'],
      applicablePackages: ['PRO', 'ENTERPRISE']
    }
  ]

  for (const offer of offers) {
    try {
      await prisma.specialOffer.create({
        data: offer,
      })
      console.log(`✅ Created Special Offer: ${offer.title}`)
    } catch (error) {
      console.log(`⚠️ Error creating offer ${offer.title}:`, error)
    }
  }

  // Get final count
  const sppgCount = await prisma.sPPG.count()
  const offerCount = await prisma.specialOffer.count()

  console.log('✅ Simple marketing seed completed!')
  console.log(`Final counts:`)
  console.log(`- ${sppgCount} SPPG Organizations`)
  console.log(`- ${offerCount} Special Offers`)
}

main()
  .catch((e) => {
    console.error('Main error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })