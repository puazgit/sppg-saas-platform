import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTimezoneSettings() {
  console.log('🌏 Creating timezone system settings...')

  // System timezone settings
  const timezoneSettings = [
    {
      key: 'DEFAULT_TIMEZONE',
      value: 'Asia/Jakarta',
      dataType: 'string',
      category: 'TIMEZONE',
      name: 'Default System Timezone',
      description: 'Default timezone untuk sistem jika tidak ada konfigurasi SPPG',
      isPublic: true,
      isEditable: true,
      defaultValue: 'Asia/Jakarta'
    },
    {
      key: 'SUPPORTED_TIMEZONES',
      value: JSON.stringify([
        'Asia/Jakarta',   // WIB - UTC+7
        'Asia/Makassar',  // WITA - UTC+8  
        'Asia/Jayapura'   // WIT - UTC+9
      ]),
      dataType: 'json',
      category: 'TIMEZONE',
      name: 'Supported Indonesia Timezones',
      description: 'Daftar timezone yang didukung untuk SPPG di Indonesia',
      isPublic: true,
      isEditable: false,
      defaultValue: JSON.stringify(['Asia/Jakarta'])
    },
    {
      key: 'CENTRAL_REPORTING_TIMEZONE',
      value: 'Asia/Jakarta',
      dataType: 'string',
      category: 'TIMEZONE',
      name: 'Central Reporting Timezone',
      description: 'Timezone untuk laporan central dan koordinasi lintas SPPG',
      isPublic: false,
      isEditable: true,
      defaultValue: 'Asia/Jakarta'
    },
    {
      key: 'TIMEZONE_AUTO_DETECTION',
      value: 'true',
      dataType: 'boolean',  
      category: 'TIMEZONE',
      name: 'Auto Timezone Detection',
      description: 'Aktifkan deteksi otomatis timezone dari browser/device user',
      isPublic: true,
      isEditable: true,
      defaultValue: 'true'
    },
    {
      key: 'BUSINESS_HOURS_FORMAT',
      value: 'HH:mm',
      dataType: 'string',
      category: 'TIMEZONE',
      name: 'Business Hours Format',
      description: 'Format waktu untuk jam operasional bisnis',
      isPublic: true,
      isEditable: false,
      defaultValue: 'HH:mm'
    },
    {
      key: 'OFFLINE_SYNC_TIMEZONE_PRIORITY',
      value: 'SPPG_TIMEZONE',
      dataType: 'string',
      category: 'TIMEZONE',
      name: 'Offline Sync Timezone Priority',
      description: 'Prioritas timezone untuk sync offline: SPPG_TIMEZONE, USER_TIMEZONE, DEVICE_TIMEZONE',
      isPublic: false,
      isEditable: true,
      defaultValue: 'SPPG_TIMEZONE',
      validationRules: JSON.stringify({
        allowedValues: ['SPPG_TIMEZONE', 'USER_TIMEZONE', 'DEVICE_TIMEZONE']
      })
    }
  ]

  for (const setting of timezoneSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    })
  }

  console.log(`✅ Created ${timezoneSettings.length} timezone system settings`)
}

async function createProvinceTimezoneMapping() {
  console.log('🗺️ Creating province timezone mapping...')

  // Province to timezone mapping for Indonesia
  const provinceTimezoneMap = [
    // WIB - UTC+7 (Western Indonesian Time)
    { provinceCode: '11', provinceName: 'Aceh', timezone: 'Asia/Jakarta' },
    { provinceCode: '12', provinceName: 'Sumatera Utara', timezone: 'Asia/Jakarta' },
    { provinceCode: '13', provinceName: 'Sumatera Barat', timezone: 'Asia/Jakarta' },
    { provinceCode: '14', provinceName: 'Riau', timezone: 'Asia/Jakarta' },
    { provinceCode: '15', provinceName: 'Jambi', timezone: 'Asia/Jakarta' },
    { provinceCode: '16', provinceName: 'Sumatera Selatan', timezone: 'Asia/Jakarta' },
    { provinceCode: '17', provinceName: 'Bengkulu', timezone: 'Asia/Jakarta' },
    { provinceCode: '18', provinceName: 'Lampung', timezone: 'Asia/Jakarta' },
    { provinceCode: '19', provinceName: 'Kepulauan Bangka Belitung', timezone: 'Asia/Jakarta' },
    { provinceCode: '21', provinceName: 'Kepulauan Riau', timezone: 'Asia/Jakarta' },
    { provinceCode: '31', provinceName: 'DKI Jakarta', timezone: 'Asia/Jakarta' },
    { provinceCode: '32', provinceName: 'Jawa Barat', timezone: 'Asia/Jakarta' },
    { provinceCode: '33', provinceName: 'Jawa Tengah', timezone: 'Asia/Jakarta' },
    { provinceCode: '34', provinceName: 'DI Yogyakarta', timezone: 'Asia/Jakarta' },
    { provinceCode: '35', provinceName: 'Jawa Timur', timezone: 'Asia/Jakarta' },
    { provinceCode: '36', provinceName: 'Banten', timezone: 'Asia/Jakarta' },
    { provinceCode: '61', provinceName: 'Kalimantan Barat', timezone: 'Asia/Jakarta' },
    { provinceCode: '62', provinceName: 'Kalimantan Tengah', timezone: 'Asia/Jakarta' },
    
    // WITA - UTC+8 (Central Indonesian Time)
    { provinceCode: '63', provinceName: 'Kalimantan Selatan', timezone: 'Asia/Makassar' },
    { provinceCode: '64', provinceName: 'Kalimantan Timur', timezone: 'Asia/Makassar' },
    { provinceCode: '65', provinceName: 'Kalimantan Utara', timezone: 'Asia/Makassar' },
    { provinceCode: '51', provinceName: 'Bali', timezone: 'Asia/Makassar' },
    { provinceCode: '52', provinceName: 'Nusa Tenggara Barat', timezone: 'Asia/Makassar' },
    { provinceCode: '53', provinceName: 'Nusa Tenggara Timur', timezone: 'Asia/Makassar' },
    { provinceCode: '71', provinceName: 'Sulawesi Utara', timezone: 'Asia/Makassar' },
    { provinceCode: '72', provinceName: 'Sulawesi Tengah', timezone: 'Asia/Makassar' },
    { provinceCode: '73', provinceName: 'Sulawesi Selatan', timezone: 'Asia/Makassar' },
    { provinceCode: '74', provinceName: 'Sulawesi Tenggara', timezone: 'Asia/Makassar' },
    { provinceCode: '75', provinceName: 'Gorontalo', timezone: 'Asia/Makassar' },
    { provinceCode: '76', provinceName: 'Sulawesi Barat', timezone: 'Asia/Makassar' },
    
    // WIT - UTC+9 (Eastern Indonesian Time)
    { provinceCode: '81', provinceName: 'Maluku', timezone: 'Asia/Jayapura' },
    { provinceCode: '82', provinceName: 'Maluku Utara', timezone: 'Asia/Jayapura' },
    { provinceCode: '91', provinceName: 'Papua Barat', timezone: 'Asia/Jayapura' },
    { provinceCode: '92', provinceName: 'Papua', timezone: 'Asia/Jayapura' },
    { provinceCode: '93', provinceName: 'Papua Selatan', timezone: 'Asia/Jayapura' },
    { provinceCode: '94', provinceName: 'Papua Tengah', timezone: 'Asia/Jayapura' },
    { provinceCode: '95', provinceName: 'Papua Pegunungan', timezone: 'Asia/Jayapura' },
    { provinceCode: '96', provinceName: 'Papua Barat Daya', timezone: 'Asia/Jayapura' }
  ]

  // Create system setting for province timezone mapping
  await prisma.systemSetting.upsert({
    where: { key: 'PROVINCE_TIMEZONE_MAPPING' },
    update: {
      value: JSON.stringify(provinceTimezoneMap),
      dataType: 'json',
      category: 'TIMEZONE',
      name: 'Province Timezone Mapping',
      description: 'Mapping provinsi Indonesia ke timezone yang sesuai',
      isPublic: false,
      isEditable: false
    },
    create: {
      key: 'PROVINCE_TIMEZONE_MAPPING',
      value: JSON.stringify(provinceTimezoneMap),
      dataType: 'json',
      category: 'TIMEZONE',
      name: 'Province Timezone Mapping',
      description: 'Mapping provinsi Indonesia ke timezone yang sesuai',
      isPublic: false,
      isEditable: false
    }
  })

  console.log(`✅ Created timezone mapping for ${provinceTimezoneMap.length} provinces`)
}

async function main() {
  try {
    await createTimezoneSettings()
    await createProvinceTimezoneMapping()
    
    console.log('🎉 Timezone seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding timezone data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}

export { main as seedTimezone }