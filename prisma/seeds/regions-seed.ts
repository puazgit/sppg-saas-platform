import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Data provinsi Indonesia sesuai Kemendagri
const provinces = [
  { id: '11', name: 'Aceh', code: '11' },
  { id: '12', name: 'Sumatera Utara', code: '12' },
  { id: '13', name: 'Sumatera Barat', code: '13' },
  { id: '14', name: 'Riau', code: '14' },
  { id: '15', name: 'Jambi', code: '15' },
  { id: '16', name: 'Sumatera Selatan', code: '16' },
  { id: '17', name: 'Bengkulu', code: '17' },
  { id: '18', name: 'Lampung', code: '18' },
  { id: '19', name: 'Kepulauan Bangka Belitung', code: '19' },
  { id: '21', name: 'Kepulauan Riau', code: '21' },
  { id: '31', name: 'DKI Jakarta', code: '31' },
  { id: '32', name: 'Jawa Barat', code: '32' },
  { id: '33', name: 'Jawa Tengah', code: '33' },
  { id: '34', name: 'DI Yogyakarta', code: '34' },
  { id: '35', name: 'Jawa Timur', code: '35' },
  { id: '36', name: 'Banten', code: '36' },
  { id: '51', name: 'Bali', code: '51' },
  { id: '52', name: 'Nusa Tenggara Barat', code: '52' },
  { id: '53', name: 'Nusa Tenggara Timur', code: '53' },
  { id: '61', name: 'Kalimantan Barat', code: '61' },
  { id: '62', name: 'Kalimantan Tengah', code: '62' },
  { id: '63', name: 'Kalimantan Selatan', code: '63' },
  { id: '64', name: 'Kalimantan Timur', code: '64' },
  { id: '65', name: 'Kalimantan Utara', code: '65' },
  { id: '71', name: 'Sulawesi Utara', code: '71' },
  { id: '72', name: 'Sulawesi Tengah', code: '72' },
  { id: '73', name: 'Sulawesi Selatan', code: '73' },
  { id: '74', name: 'Sulawesi Tenggara', code: '74' },
  { id: '75', name: 'Gorontalo', code: '75' },
  { id: '76', name: 'Sulawesi Barat', code: '76' },
  { id: '81', name: 'Maluku', code: '81' },
  { id: '82', name: 'Maluku Utara', code: '82' },
  { id: '91', name: 'Papua Barat', code: '91' },
  { id: '94', name: 'Papua', code: '94' },
  { id: '92', name: 'Papua Barat Daya', code: '92' },
  { id: '93', name: 'Papua Selatan', code: '93' },
  { id: '95', name: 'Papua Tengah', code: '95' },
  { id: '96', name: 'Papua Pegunungan', code: '96' }
]

// Data kabupaten/kota sample (Jakarta, Jabar, Jateng)
const regencies = [
  // DKI Jakarta (31)
  { id: '3171', provinceId: '31', name: 'Jakarta Selatan', code: '3171', type: 'KOTA' },
  { id: '3172', provinceId: '31', name: 'Jakarta Timur', code: '3172', type: 'KOTA' },
  { id: '3173', provinceId: '31', name: 'Jakarta Pusat', code: '3173', type: 'KOTA' },
  { id: '3174', provinceId: '31', name: 'Jakarta Barat', code: '3174', type: 'KOTA' },
  { id: '3175', provinceId: '31', name: 'Jakarta Utara', code: '3175', type: 'KOTA' },
  { id: '3176', provinceId: '31', name: 'Kepulauan Seribu', code: '3176', type: 'KABUPATEN' },

  // Jawa Barat (32) - Sample
  { id: '3201', provinceId: '32', name: 'Kabupaten Bogor', code: '3201', type: 'KABUPATEN' },
  { id: '3271', provinceId: '32', name: 'Kota Bogor', code: '3271', type: 'KOTA' },
  { id: '3204', provinceId: '32', name: 'Kabupaten Bandung', code: '3204', type: 'KABUPATEN' },
  { id: '3273', provinceId: '32', name: 'Kota Bandung', code: '3273', type: 'KOTA' },
  { id: '3216', provinceId: '32', name: 'Kabupaten Bekasi', code: '3216', type: 'KABUPATEN' },
  { id: '3275', provinceId: '32', name: 'Kota Bekasi', code: '3275', type: 'KOTA' },
  { id: '3276', provinceId: '32', name: 'Kota Depok', code: '3276', type: 'KOTA' },

  // Jawa Tengah (33) - Sample
  { id: '3374', provinceId: '33', name: 'Kota Semarang', code: '3374', type: 'KOTA' },
  { id: '3322', provinceId: '33', name: 'Kabupaten Semarang', code: '3322', type: 'KABUPATEN' },
  { id: '3372', provinceId: '33', name: 'Kota Surakarta', code: '3372', type: 'KOTA' }
]

// Data kecamatan sample
const districts = [
  // Jakarta Pusat (3173)
  { id: '317301', regencyId: '3173', name: 'Gambir', code: '317301' },
  { id: '317302', regencyId: '3173', name: 'Sawah Besar', code: '317302' },
  { id: '317306', regencyId: '3173', name: 'Menteng', code: '317306' },
  { id: '317307', regencyId: '3173', name: 'Tanah Abang', code: '317307' },

  // Kota Bogor (3271)
  { id: '327101', regencyId: '3271', name: 'Bogor Selatan', code: '327101' },
  { id: '327102', regencyId: '3271', name: 'Bogor Timur', code: '327102' },
  { id: '327103', regencyId: '3271', name: 'Bogor Utara', code: '327103' },
  { id: '327104', regencyId: '3271', name: 'Bogor Tengah', code: '327104' },

  // Kota Bandung (3273)
  { id: '327301', regencyId: '3273', name: 'Sukasari', code: '327301' },
  { id: '327302', regencyId: '3273', name: 'Coblong', code: '327302' },
  { id: '327323', regencyId: '3273', name: 'Cidadap', code: '327323' },
  { id: '327324', regencyId: '3273', name: 'Sukajadi', code: '327324' }
]

// Data desa/kelurahan sample
const villages = [
  // Gambir (317301)
  { id: '3173011001', districtId: '317301', name: 'Gambir', code: '3173011001' },
  { id: '3173011002', districtId: '317301', name: 'Cideng', code: '3173011002' },
  { id: '3173011003', districtId: '317301', name: 'Petojo Utara', code: '3173011003' },

  // Menteng (317306)
  { id: '3173061001', districtId: '317306', name: 'Menteng', code: '3173061001' },
  { id: '3173061002', districtId: '317306', name: 'Pegangsaan', code: '3173061002' },
  { id: '3173061003', districtId: '317306', name: 'Cikini', code: '3173061003' },

  // Bogor Selatan (327101)
  { id: '3271011001', districtId: '327101', name: 'Mulyaharja', code: '3271011001' },
  { id: '3271011002', districtId: '327101', name: 'Bantarjati', code: '3271011002' },
  { id: '3271011003', districtId: '327101', name: 'Batutulis', code: '3271011003' },

  // Sukasari Bandung (327301)
  { id: '3273011001', districtId: '327301', name: 'Geger Kalong', code: '3273011001' },
  { id: '3273011002', districtId: '327301', name: 'Isola', code: '3273011002' },
  { id: '3273011003', districtId: '327301', name: 'Sarijadi', code: '3273011003' }
]

async function main() {
  console.log('🌏 Seeding Indonesian regions data...')

  try {
    // Seed provinces
    console.log('📍 Seeding provinces...')
    for (const province of provinces) {
      await prisma.province.upsert({
        where: { id: province.id },
        update: {},
        create: province
      })
    }
    console.log(`✅ Seeded ${provinces.length} provinces`)

    // Seed regencies
    console.log('🏢 Seeding regencies...')
    for (const regency of regencies) {
      await prisma.regency.upsert({
        where: { id: regency.id },
        update: {},
        create: regency
      })
    }
    console.log(`✅ Seeded ${regencies.length} regencies`)

    // Seed districts
    console.log('🏘️ Seeding districts...')
    for (const district of districts) {
      await prisma.district.upsert({
        where: { id: district.id },
        update: {},
        create: district
      })
    }
    console.log(`✅ Seeded ${districts.length} districts`)

    // Seed villages
    console.log('🏠 Seeding villages...')
    for (const village of villages) {
      await prisma.village.upsert({
        where: { id: village.id },
        update: {},
        create: village
      })
    }
    console.log(`✅ Seeded ${villages.length} villages`)

    console.log('🎉 Indonesian regions data seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding regions data:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })