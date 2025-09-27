import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting minimal marketing seed...')

  // Clean existing data
  console.log('Cleaning existing marketing features...')
  await prisma.marketingFeature.deleteMany({})

  // Create marketing features
  console.log('Creating marketing features...')
  const features = [
    {
      title: 'AI Menu Planning',
      description: 'Sistem perencanaan menu berbasis AI yang mempertimbangkan nutrisi, budget, dan preferensi regional',
      icon: 'Brain',
      category: 'MENU',
      benefits: [
        'Otomatisasi perencanaan menu mingguan',
        'Optimalisasi nutrisi sesuai standar pemerintah',
        'Prediksi budget yang akurat',
        'Adaptasi preferensi regional'
      ],
      availableIn: ['PRO', 'ENTERPRISE'],
      isHighlight: true,
      sortOrder: 1,
      active: true
    },
    {
      title: 'Real-time Inventory',
      description: 'Tracking stok real-time dengan alert otomatis untuk reorder point dan integrasi supplier',
      icon: 'BarChart3',
      category: 'INVENTORY',
      benefits: [
        'Monitoring stok real-time',
        'Alert otomatis reorder point',
        'Integrasi dengan supplier',
        'Reduce waste hingga 35%'
      ],
      availableIn: ['STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: true,
      sortOrder: 2,
      active: true
    },
    {
      title: 'Government Reporting',
      description: 'Laporan otomatis untuk Kemendikbud, Kemenkes, dan instansi terkait dengan format standar pemerintah',
      icon: 'FileText',
      category: 'ANALYTICS',
      benefits: [
        'Laporan otomatis ke Kemendikbud',
        'Compliance Kemenkes 100%',
        'Format standar pemerintah',
        'Export Excel dan PDF'
      ],
      availableIn: ['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: true,
      sortOrder: 3,
      active: true
    },
    {
      title: 'Distribution Tracking',
      description: 'Real-time tracking distribusi makanan ke sekolah-sekolah dengan GPS dan konfirmasi digital',
      icon: 'MapPin',
      category: 'PRODUCTION',
      benefits: [
        'GPS tracking real-time',
        'Konfirmasi digital',
        'Notifikasi otomatis',
        'Transparansi penuh'
      ],
      availableIn: ['PRO', 'ENTERPRISE'],
      isHighlight: true,
      sortOrder: 4,
      active: true
    },
    {
      title: 'Cost per Serving',
      description: 'Kalkulasi biaya per porsi dengan breakdown detail ingredien dan analisis profitabilitas',
      icon: 'Calculator',
      category: 'FINANCE',
      benefits: [
        'Kalkulasi biaya per porsi',
        'Breakdown detail ingredien',
        'Analisis profitabilitas',
        'Budget forecasting'
      ],
      availableIn: ['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: true,
      sortOrder: 5,
      active: true
    },
    {
      title: 'HACCP Compliance',
      description: 'Sistem HACCP terintegrasi dengan checklist digital dan dokumentasi keamanan pangan',
      icon: 'Shield',
      category: 'QUALITY',
      benefits: [
        'Checklist HACCP digital',
        'Dokumentasi keamanan pangan',
        'Audit trail lengkap',
        'Sertifikasi otomatis'
      ],
      availableIn: ['PRO', 'ENTERPRISE'],
      isHighlight: false,
      sortOrder: 6,
      active: true
    },
    {
      title: 'Nutrition Analysis',
      description: 'Analisis kandungan gizi lengkap dengan database bahan makanan Indonesia',
      icon: 'Calculator',
      category: 'MENU',
      benefits: [
        'Database bahan makanan Indonesia',
        'Analisis gizi lengkap',
        'Compliance standar gizi',
        'Laporan nutrisi detail'
      ],
      availableIn: ['BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: false,
      sortOrder: 7,
      active: true
    },
    {
      title: 'Supplier Management',
      description: 'Portal supplier dengan sistem tender, evaluasi kinerja, dan manajemen kontrak',
      icon: 'Users',
      category: 'INVENTORY',
      benefits: [
        'Portal supplier terintegrasi',
        'Sistem tender digital',
        'Evaluasi kinerja supplier',
        'Manajemen kontrak otomatis'
      ],
      availableIn: ['PRO', 'ENTERPRISE'],
      isHighlight: false,
      sortOrder: 8,
      active: true
    },
    {
      title: 'Performance Dashboard',
      description: 'Dashboard kinerja operasional dengan KPI, metrics, dan insights untuk optimalisasi',
      icon: 'Monitor',
      category: 'ANALYTICS',
      benefits: [
        'KPI dashboard real-time',
        'Metrics operasional',
        'Insights optimalisasi',
        'Custom reporting'
      ],
      availableIn: ['STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: false,
      sortOrder: 9,
      active: true
    },
    {
      title: 'Mobile App',
      description: 'Aplikasi mobile untuk staff lapangan dengan fitur offline dan sinkronisasi otomatis',
      icon: 'Smartphone',
      category: 'AUTOMATION',
      benefits: [
        'Akses mobile staff lapangan',
        'Mode offline tersedia',
        'Sinkronisasi otomatis',
        'Push notifications'
      ],
      availableIn: ['STANDARD', 'PRO', 'ENTERPRISE'],
      isHighlight: false,
      sortOrder: 10,
      active: true
    }
  ]

  for (const feature of features) {
    await prisma.marketingFeature.create({
      data: feature,
    })
  }

  console.log('✅ Minimal marketing seed completed!')
  console.log(`Created ${features.length} marketing features`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })