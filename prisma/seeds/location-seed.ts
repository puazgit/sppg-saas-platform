import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample Regional Data Indonesia (subset untuk testing)
const SAMPLE_PROVINCES = [
  { id: '11', name: 'Aceh', code: 'AC' },
  { id: '12', name: 'Sumatera Utara', code: 'SU' },
  { id: '13', name: 'Sumatera Barat', code: 'SB' },
  { id: '31', name: 'DKI Jakarta', code: 'JK' },
  { id: '32', name: 'Jawa Barat', code: 'JB' },
  { id: '33', name: 'Jawa Tengah', code: 'JT' },
  { id: '34', name: 'DI Yogyakarta', code: 'YO' },
  { id: '35', name: 'Jawa Timur', code: 'JI' },
  { id: '61', name: 'Kalimantan Barat', code: 'KB' },
  { id: '73', name: 'Sulawesi Selatan', code: 'SN' }
]

const SAMPLE_REGENCIES = [
  // DKI Jakarta
  { id: '3171', provinceId: '31', name: 'Jakarta Selatan', code: 'JS', type: 'KOTA' },
  { id: '3172', provinceId: '31', name: 'Jakarta Timur', code: 'JT', type: 'KOTA' },
  { id: '3173', provinceId: '31', name: 'Jakarta Pusat', code: 'JP', type: 'KOTA' },
  { id: '3174', provinceId: '31', name: 'Jakarta Barat', code: 'JB', type: 'KOTA' },
  { id: '3175', provinceId: '31', name: 'Jakarta Utara', code: 'JU', type: 'KOTA' },
  
  // Jawa Barat
  { id: '3201', provinceId: '32', name: 'Bogor', code: 'BGR', type: 'KABUPATEN' },
  { id: '3204', provinceId: '32', name: 'Bandung', code: 'BDG', type: 'KABUPATEN' },
  { id: '3273', provinceId: '32', name: 'Kota Bandung', code: 'KBDG', type: 'KOTA' },
  { id: '3276', provinceId: '32', name: 'Kota Bogor', code: 'KBGR', type: 'KOTA' },
  
  // Jawa Tengah  
  { id: '3301', provinceId: '33', name: 'Cilacap', code: 'CLP', type: 'KABUPATEN' },
  { id: '3371', provinceId: '33', name: 'Kota Semarang', code: 'SMG', type: 'KOTA' },
  
  // Jawa Timur
  { id: '3501', provinceId: '35', name: 'Pacitan', code: 'PCT', type: 'KABUPATEN' },
  { id: '3578', provinceId: '35', name: 'Kota Surabaya', code: 'SBY', type: 'KOTA' }
]

const SAMPLE_DISTRICTS = [
  // Jakarta Selatan
  { id: '3171010', regencyId: '3171', name: 'Jagakarsa', code: 'JGK' },
  { id: '3171020', regencyId: '3171', name: 'Pasar Minggu', code: 'PSM' },
  { id: '3171030', regencyId: '3171', name: 'Cilandak', code: 'CLK' },
  
  // Kota Bandung
  { id: '3273010', regencyId: '3273', name: 'Bandung Kulon', code: 'BKL' },
  { id: '3273020', regencyId: '3273', name: 'Babakan Ciparay', code: 'BCP' },
  { id: '3273030', regencyId: '3273', name: 'Bojongloa Kaler', code: 'BJK' },
  
  // Kota Surabaya
  { id: '3578010', regencyId: '3578', name: 'Karang Pilang', code: 'KRP' },
  { id: '3578020', regencyId: '3578', name: 'Wonocolo', code: 'WNC' }
]

const SAMPLE_VILLAGES = [
  // Jagakarsa, Jakarta Selatan
  { id: '3171010001', districtId: '3171010', name: 'Lenteng Agung', code: 'LTA' },
  { id: '3171010002', districtId: '3171010', name: 'Jagakarsa', code: 'JGK' },
  { id: '3171010003', districtId: '3171010', name: 'Tanjung Barat', code: 'TJB' },
  { id: '3171010004', districtId: '3171010', name: 'Ciganjur', code: 'CGJ' },
  
  // Bandung Kulon, Kota Bandung
  { id: '3273010001', districtId: '3273010', name: 'Gempol Sari', code: 'GPS' },
  { id: '3273010002', districtId: '3273010', name: 'Cigondewah Kidul', code: 'CGK' },
  { id: '3273010003', districtId: '3273010', name: 'Cigondewah Kaler', code: 'CGL' },
  { id: '3273010004', districtId: '3273010', name: 'Warung Muncang', code: 'WMC' },
  
  // Karang Pilang, Surabaya
  { id: '3578010001', districtId: '3578010', name: 'Kedurus', code: 'KDR' },
  { id: '3578010002', districtId: '3578010', name: 'Karang Pilang', code: 'KRP' },
  { id: '3578010003', districtId: '3578010', name: 'Warugunung', code: 'WGN' }
]

export async function seedProvinces() {
  console.log('🗺️  Seeding Provinces...')
  
  for (const province of SAMPLE_PROVINCES) {
    await prisma.province.upsert({
      where: { id: province.id },
      update: {},
      create: province
    })
  }
  
  console.log('✅ Provinces seeded successfully!')
}

export async function seedRegencies() {
  console.log('🏘️  Seeding Regencies...')
  
  for (const regency of SAMPLE_REGENCIES) {
    await prisma.regency.upsert({
      where: { id: regency.id },
      update: {},
      create: regency
    })
  }
  
  console.log('✅ Regencies seeded successfully!')
}

export async function seedDistricts() {
  console.log('🏛️  Seeding Districts...')
  
  for (const district of SAMPLE_DISTRICTS) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: {},
      create: district
    })
  }
  
  console.log('✅ Districts seeded successfully!')
}

export async function seedVillages() {
  console.log('🏠 Seeding Villages...')
  
  for (const village of SAMPLE_VILLAGES) {
    await prisma.village.upsert({
      where: { id: village.id },
      update: {},
      create: village
    })
  }
  
  console.log('✅ Villages seeded successfully!')
}

export async function seedLocationData() {
  console.log('📍 Starting Location Data Seeding...')
  
  await seedProvinces()
  await seedRegencies()
  await seedDistricts()
  await seedVillages()
  
  console.log('✅ Location data seeded successfully!')
}