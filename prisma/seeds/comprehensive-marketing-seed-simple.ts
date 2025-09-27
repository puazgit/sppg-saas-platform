import { PrismaClient, SppgStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive marketing seed...')

  // 1. Create SPPG Organizations
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
      description: 'Satuan Pelayanan Gizi Gratis Bandung melayani 12,000 siswa dengan standar gizi terbaik',
      address: 'Jl. Asia Afrika No. 142, Bandung, Jawa Barat 40111',
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
      address: 'Jl. Raya Gubeng No. 56, Surabaya, Jawa Timur 60281',
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
      address: 'Jl. Sisingamangaraja No. 88, Medan, Sumatera Utara 20212',
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
      address: 'Jl. Perintis Kemerdekaan No. 45, Makassar, Sulawesi Selatan 90245',
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
    },
    {
      code: 'SPPG-DPS-001',
      name: 'SPPG Denpasar',
      description: 'SPPG Denpasar dengan menu sehat berbasis pangan lokal Bali',
      address: 'Jl. Gajah Mada No. 67, Denpasar, Bali 80113',
      phone: '0361-234567',
      email: 'admin@sppg-denpasar.go.id',
      targetRecipients: 8000,
      maxRadius: 7.0,
      maxTravelTime: 30,
      operationStartDate: new Date('2020-09-12'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '51',
      regencyId: '5171',
      districtId: '517101',
      villageId: '5171011001',
    },
    {
      code: 'SPPG-YGK-001',
      name: 'SPPG Yogyakarta',
      description: 'SPPG Yogyakarta sebagai pilot project inovasi gizi digital',
      address: 'Jl. Malioboro No. 123, Yogyakarta, DI Yogyakarta 55213',
      phone: '0274-556789',
      email: 'admin@sppg-yogya.go.id',
      targetRecipients: 9500,
      maxRadius: 6.0,
      maxTravelTime: 25,
      operationStartDate: new Date('2019-04-20'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '34',
      regencyId: '3471',
      districtId: '347101',
      villageId: '3471011001',
    },
    {
      code: 'SPPG-SMG-001',
      name: 'SPPG Semarang',
      description: 'SPPG Semarang dengan sistem distribusi terintegrasi multi-lokasi',
      address: 'Jl. Pandanaran No. 89, Semarang, Jawa Tengah 50241',
      phone: '024-845123',
      email: 'admin@sppg-semarang.go.id',
      targetRecipients: 11000,
      maxRadius: 11.0,
      maxTravelTime: 42,
      operationStartDate: new Date('2020-02-28'),
      status: 'ACTIVE' as SppgStatus,
      provinceId: '33',
      regencyId: '3374',
      districtId: '337401',
      villageId: '3374011001',
    },
  ]

  for (const sppg of sppgOrganizations) {
    await prisma.sPPG.upsert({
      where: { code: sppg.code },
      update: sppg,
      create: {
        ...sppg,
        picName: 'PIC Demo',
        picPosition: 'Koordinator',
        picEmail: 'pic@demo.com',
        picPhone: '081234567890',
        organizationType: 'YAYASAN'
      },
    })
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
      termsConditions: 'Berlaku untuk SPPG pemerintah daerah, minimum kontrak 2 tahun, pembayaran annual di muka, include free training dan implementasi',
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
      termsConditions: 'Terbatas untuk 50 SPPG pertama, berlaku untuk paket PRO dan ENTERPRISE, implementasi sebelum 31 Maret 2025, bonus 6 bulan gratis setelah kontrak 1 tahun',
      targetAudience: ['NEW_CUSTOMERS'],
      applicablePackages: ['PRO', 'ENTERPRISE']
    },
    {
      title: 'Digital Transformation Grant',
      description: 'Program bantuan digitalisasi dengan subsidi hingga 40% untuk SPPG yang berkomitmen pada transparansi dan akuntabilitas.',
      discountPercentage: 40,
      validFrom: new Date('2024-06-01'),
      validUntil: new Date('2025-05-31'),
      active: true,
      termsConditions: 'Berlaku untuk SPPG yang lulus assessment transparansi, wajib publikasi laporan berkala, komitmen 3 tahun minimum',
      targetAudience: ['GOVERNMENT', 'NEW_CUSTOMERS'],
      applicablePackages: ['STANDARD', 'PRO', 'ENTERPRISE']
    }
  ]

  for (const offer of offers) {
    await prisma.specialOffer.create({
      data: offer,
    })
  }

  console.log('✅ Comprehensive marketing seed completed!')
  console.log(`Created:`)
  console.log(`- ${sppgOrganizations.length} SPPG Organizations`)
  console.log(`- ${offers.length} Special Offers`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })