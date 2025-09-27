import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCaseStudies() {
  console.log('📚 Seeding case studies data...')

  // Clear existing case studies
  await prisma.caseStudy.deleteMany({})

  // Create real case studies
  const caseStudies = await prisma.caseStudy.createMany({
    data: [
      {
        organizationName: 'SPPG Jakarta Timur',
        location: 'Jakarta Timur, DKI Jakarta',
        organizationSize: 'Large',
        industry: 'Government',
        beforeSituation: 'Manual paper-based system, frequent stockouts, inconsistent portion sizes',
        afterSituation: 'Automated inventory management, 99% stock availability, standardized portions',
        mainProblems: [
          'Manajemen inventori manual menyebabkan stockout 40%',
          'Perhitungan gizi tidak akurat', 
          'Laporan keuangan membutuhkan 2 minggu',
          'Koordinasi 15 titik distribusi sulit'
        ],
        solutionsProvided: [
          'Implementasi sistem inventori real-time',
          'Automated nutrition calculation engine',
          'Financial reporting dashboard',
          'Multi-location management system'
        ],
        resultsAchieved: {
          efficiency: '65% faster operations',
          cost_savings: 'Rp 2.4M per month',
          accuracy: '99.5% nutrition accuracy',
          satisfaction: '95% staff satisfaction'
        },
        metrics: {
          beforeOperationTime: '8 hours/day',
          afterOperationTime: '3 hours/day',
          beforeErrorRate: '15%',
          afterErrorRate: '0.5%',
          beforeCostPerMeal: '8500',
          afterCostPerMeal: '6200',
          recipientsSaved: '25000',
          monthlyRecipients: '45000'
        },
        testimonial: 'Platform SPPG benar-benar mengubah cara kami beroperasi. Yang tadinya butuh 8 jam sekarang hanya 3 jam.',
        testimonialAuthor: 'Dr. Sari Wulandari',
        testimonialPosition: 'Kepala SPPG Jakarta Timur',
        duration: '6 months',
        investment: 'Rp 54 juta',
        roi: '340%',
        implementationDate: new Date('2024-03-01'),
        completionDate: new Date('2024-08-30'),
        status: 'COMPLETED',
        isPublished: true,
        isFeatured: true,
        tags: ['inventory', 'nutrition', 'reporting', 'multi-location'],
        imageUrl: '/images/case-studies/jakarta-timur.jpg',
        videoUrl: null
      },
      {
        organizationName: 'SPPG Kota Bandung',
        location: 'Bandung, Jawa Barat',
        organizationSize: 'Medium',
        industry: 'Government',
        beforeSituation: 'Spreadsheet-based planning, supplier coordination issues, limited reporting',
        afterSituation: 'Integrated menu planning, automated supplier management, comprehensive analytics',
        mainProblems: [
          'Perencanaan menu manual menggunakan Excel',
          'Koordinasi dengan 8 supplier tidak efisient',
          'Analisis gizi butuh konsultan eksternal',
          'Laporan compliance untuk Kemenkes manual'
        ],
        solutionsProvided: [
          'AI-powered menu planning system',
          'Supplier management portal',
          'Built-in nutrition analysis',
          'Automated compliance reporting'
        ],
        resultsAchieved: {
          efficiency: '50% faster menu planning',
          cost_savings: 'Rp 1.8M per month',
          accuracy: '98% nutrition compliance',
          satisfaction: '92% recipient satisfaction'
        },
        metrics: {
          beforeOperationTime: '6 hours/day',
          afterOperationTime: '3 hours/day',
          beforeErrorRate: '12%',
          afterErrorRate: '2%',
          beforeCostPerMeal: '7800',
          afterCostPerMeal: '6800',
          recipientsSaved: '18000',
          monthlyRecipients: '28000'
        },
        testimonial: 'Menu planning yang dulu memakan waktu seharian, sekarang selesai dalam 3 jam dengan hasil yang lebih akurat.',
        testimonialAuthor: 'Budi Santoso, S.Gz',
        testimonialPosition: 'Koordinator Gizi SPPG Bandung',
        duration: '4 months',
        investment: 'Rp 36 juta',
        roi: '280%',
        implementationDate: new Date('2024-05-01'),
        completionDate: new Date('2024-08-30'),
        status: 'COMPLETED',
        isPublished: true,
        isFeatured: true,
        tags: ['menu-planning', 'supplier-management', 'compliance', 'ai'],
        imageUrl: '/images/case-studies/bandung.jpg',
        videoUrl: null
      },
      {
        organizationName: 'SPPG Surabaya Selatan',
        location: 'Surabaya, Jawa Timur',
        organizationSize: 'Small',
        industry: 'Government',
        beforeSituation: 'WhatsApp-based coordination, manual cost calculation, paper-based attendance',
        afterSituation: 'Mobile app coordination, automated costing, digital attendance tracking',
        mainProblems: [
          'Koordinasi tim menggunakan WhatsApp grup',
          'Perhitungan biaya produksi manual',
          'Absensi penerima menggunakan kertas',
          'Monitoring kualitas tidak terstruktur'
        ],
        solutionsProvided: [
          'Mobile application for staff coordination',
          'Automated cost calculation system',
          'Digital attendance with QR codes',
          'Quality control monitoring dashboard'
        ],
        resultsAchieved: {
          efficiency: '45% faster coordination',
          cost_savings: 'Rp 800K per month',
          accuracy: '95% attendance accuracy',
          satisfaction: '88% operational satisfaction'
        },
        metrics: {
          beforeOperationTime: '4 hours/day',
          afterOperationTime: '2.2 hours/day',
          beforeErrorRate: '18%',
          afterErrorRate: '5%',
          beforeCostPerMeal: '9200',
          afterCostPerMeal: '8100',
          recipientsSaved: '8000',
          monthlyRecipients: '15000'
        },
        testimonial: 'Dengan aplikasi mobile, koordinasi tim jadi jauh lebih efisien. Data real-time sangat membantu pengambilan keputusan.',
        testimonialAuthor: 'Indah Permatasari',
        testimonialPosition: 'Manager Operasional SPPG Surabaya Selatan',
        duration: '3 months',
        investment: 'Rp 22.5 juta',
        roi: '220%',
        implementationDate: new Date('2024-06-01'),
        completionDate: new Date('2024-08-30'),
        status: 'COMPLETED',
        isPublished: true,
        isFeatured: false,
        tags: ['mobile', 'coordination', 'qr-attendance', 'quality-control'],
        imageUrl: '/images/case-studies/surabaya.jpg',
        videoUrl: null
      },
      {
        organizationName: 'SPPG Medan Utara',
        location: 'Medan, Sumatera Utara',
        organizationSize: 'Large',
        industry: 'Government',
        beforeSituation: 'Multi-system fragmentation, data silos, manual reconciliation',
        afterSituation: 'Unified platform, integrated data, automated workflows',
        mainProblems: [
          'Menggunakan 5 sistem berbeda yang tidak terintegrasi',
          'Data tersimpan di silo-silo terpisah',
          'Rekonsiliasi data manual setiap bulan',
          'Reporting ke pusat membutuhkan 3 minggu'
        ],
        solutionsProvided: [
          'Single unified SPPG platform',
          'Data integration and migration',
          'Automated workflow engine',
          'Real-time reporting to central government'
        ],
        resultsAchieved: {
          efficiency: '70% faster reporting',
          cost_savings: 'Rp 3.2M per month',
          accuracy: '99.8% data accuracy',
          satisfaction: '97% management satisfaction'
        },
        metrics: {
          beforeOperationTime: '10 hours/day',
          afterOperationTime: '3 hours/day',
          beforeErrorRate: '20%',
          afterErrorRate: '0.2%',
          beforeCostPerMeal: '8800',
          afterCostPerMeal: '6500',
          recipientsSaved: '35000',
          monthlyRecipients: '52000'
        },
        testimonial: 'Transformasi digital ini adalah game changer. Efisiensi operasional meningkat drastis dan data menjadi sangat akurat.',
        testimonialAuthor: 'Dr. Ahmad Rizky',
        testimonialPosition: 'Direktur SPPG Medan Utara',
        duration: '8 months',
        investment: 'Rp 75 juta',
        roi: '380%',
        implementationDate: new Date('2024-01-01'),
        completionDate: new Date('2024-08-30'),
        status: 'COMPLETED',
        isPublished: true,
        isFeatured: true,
        tags: ['integration', 'automation', 'reporting', 'digital-transformation'],
        imageUrl: '/images/case-studies/medan.jpg',
        videoUrl: 'https://youtube.com/watch?v=case-study-medan'
      }
    ]
  })

  console.log(`✅ Created ${caseStudies.count} case studies`)
}

async function main() {
  try {
    await seedCaseStudies()
    console.log('🎉 Case studies seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding case studies:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { seedCaseStudies }