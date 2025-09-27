import { PrismaClient, SppgStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function createProvinceIfNotExists(id: string, name: string, code: string) {
  return await prisma.province.upsert({
    where: { id },
    update: {},
    create: { id, name, code }
  });
}

async function createRegencyIfNotExists(id: string, name: string, provinceId: string, code: string, type: string) {
  return await prisma.regency.upsert({
    where: { id },
    update: {},
    create: { id, name, provinceId, code, type }
  });
}

async function createDistrictIfNotExists(id: string, name: string, regencyId: string, code: string) {
  return await prisma.district.upsert({
    where: { id },
    update: {},
    create: { id, name, regencyId, code }
  });
}

async function createVillageIfNotExists(id: string, name: string, districtId: string, code: string) {
  return await prisma.village.upsert({
    where: { id },
    update: {},
    create: { id, name, districtId, code }
  });
}

async function main() {
  console.log('🌱 Starting quick demo data seed...')

  // Create location data first
  console.log('Creating location data...')
  await createProvinceIfNotExists('31', 'DKI Jakarta', '31')
  await createProvinceIfNotExists('32', 'Jawa Barat', '32')
  await createProvinceIfNotExists('35', 'Jawa Timur', '35')
  await createProvinceIfNotExists('12', 'Sumatera Utara', '12')
  await createProvinceIfNotExists('73', 'Sulawesi Selatan', '73')

  await createRegencyIfNotExists('3171', 'Jakarta Pusat', '31', '3171', 'KOTA')
  await createRegencyIfNotExists('3273', 'Kota Bandung', '32', '3273', 'KOTA')
  await createRegencyIfNotExists('3578', 'Kota Surabaya', '35', '3578', 'KOTA')
  await createRegencyIfNotExists('1271', 'Kota Medan', '12', '1271', 'KOTA')
  await createRegencyIfNotExists('7371', 'Kota Makassar', '73', '7371', 'KOTA')

  await createDistrictIfNotExists('317101', 'Gambir', '3171', '317101')
  await createDistrictIfNotExists('327301', 'Bandung Wetan', '3273', '327301')
  await createDistrictIfNotExists('357801', 'Gubeng', '3578', '357801')
  await createDistrictIfNotExists('127101', 'Medan Kota', '1271', '127101')
  await createDistrictIfNotExists('737101', 'Mariso', '7371', '737101')

  await createVillageIfNotExists('3171011001', 'Gambir', '317101', '3171011001')
  await createVillageIfNotExists('3273011001', 'Cihapit', '327301', '3273011001')
  await createVillageIfNotExists('3578011001', 'Gubeng', '357801', '3578011001')
  await createVillageIfNotExists('1271011001', 'Sei Rengas I', '127101', '1271011001')
  await createVillageIfNotExists('7371011001', 'Mariso', '737101', '7371011001')

  // Create SPPG organizations
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
    },
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
      provinceId: '32',
      regencyId: '3273',
      districtId: '327301',
      villageId: '3273011001',
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
      provinceId: '35',
      regencyId: '3578',
      districtId: '357801',
      villageId: '3578011001',
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
      provinceId: '12',
      regencyId: '1271',
      districtId: '127101',
      villageId: '1271011001',
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
      provinceId: '73',
      regencyId: '7371',
      districtId: '737101',
      villageId: '7371011001',
    }
  ]

  for (const sppg of sppgOrganizations) {
    try {
      await prisma.sPPG.create({
        data: {
          ...sppg,
          picName: 'Demo PIC',
          picPosition: 'Koordinator',
          picEmail: 'pic@demo.com',
          picPhone: '081234567890',
          organizationType: 'YAYASAN'
        },
      })
      console.log(`✅ Created SPPG: ${sppg.name}`)
    } catch {
      console.log(`⚠️ SPPG ${sppg.name} may already exist`)
    }
  }

  // Get final counts
  const sppgCount = await prisma.sPPG.count()
  const activeSppgCount = await prisma.sPPG.count({
    where: { status: 'ACTIVE' }
  })

  console.log('✅ Quick demo data seed completed!')
  console.log(`Final counts:`)
  console.log(`- ${sppgCount} SPPG Organizations`)
  console.log(`- ${activeSppgCount} Active SPPG Organizations`)
}

main()
  .catch((e) => {
    console.error('Main error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })