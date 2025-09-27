import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedTestimonials() {
  console.log('🌱 Creating testimonials data...')

  const testimonials = [
    {
      organizationName: 'SPPG Jakarta Pusat',
      contactName: 'Dr. Sari Wijayanti, M.Gz',
      position: 'Koordinator SPPG Jakarta Pusat',
      location: 'Jakarta',
      organizationSize: 'LARGE',
      content: 'Platform ini revolusioner! Sebelumnya kami membutuhkan waktu 3 hari untuk laporan bulanan, sekarang hanya 30 menit. Fitur AI menu planning sangat membantu memastikan kebutuhan gizi seimbang untuk anak-anak.',
      rating: 5,
      photoUrl: '/testimonials/dr-sari.jpg',
      isPublished: true,
      isFeatured: true
    },
    {
      organizationName: 'SPPG Bandung Raya',
      contactName: 'Ahmad Rizki Pratama, S.Gz',
      position: 'Manager Operasional',
      location: 'Bandung',
      organizationSize: 'MEDIUM',
      content: 'Manajemen inventori otomatis mengurangi food waste hingga 35%. Real-time tracking membantu kami menghindari shortage dan overstock. ROI tercapai dalam 4 bulan pertama implementasi.',
      rating: 5,
      photoUrl: '/testimonials/ahmad-rizki.jpg',
      isPublished: true,
      isFeatured: true
    },
    {
      organizationName: 'SPPG Surabaya Timur',
      contactName: 'Ibu Dewi Lestari, M.M',
      position: 'Direktur Operasional',
      location: 'Surabaya',
      organizationSize: 'LARGE',
      content: 'Dashboard analytics memberikan insights mendalam untuk pengambilan keputusan strategis. Compliance reporting otomatis memastikan kami selalu siap audit pemerintah. Sangat professional!',
      rating: 5,
      photoUrl: '/testimonials/dewi-lestari.jpg',
      isPublished: true,
      isFeatured: true
    },
    {
      organizationName: 'SPPG Medan Kota',
      contactName: 'Bapak Hendro Sutanto',
      position: 'Kepala Divisi Nutrisi',
      location: 'Medan',
      organizationSize: 'MEDIUM',
      content: 'Implementasi 24 jam tanpa downtime. Tim support sangat responsif. Fitur mobile app memudahkan koordinasi staff di lapangan. Tingkat kepuasan beneficiaries meningkat 40%.',
      rating: 5,
      photoUrl: '/testimonials/hendro-sutanto.jpg',
      isPublished: true,
      isFeatured: false
    },
    {
      organizationName: 'SPPG Makassar Selatan',
      contactName: 'Dr. Maya Sari Indrawati',
      position: 'Quality Assurance Manager',
      location: 'Makassar',
      organizationSize: 'ENTERPRISE',
      content: 'Quality control system terintegrasi memastikan standar nutrisi terjaga. Traceability ingredient dari supplier hingga penyajaan sangat detail. Platform ini setara dengan standard internasional.',
      rating: 5,
      photoUrl: '/testimonials/maya-sari.jpg',
      isPublished: true,
      isFeatured: false
    },
    {
      organizationName: 'SPPG Jakarta Pusat',
      contactName: 'Rina Kartika, S.T',
      position: 'IT Manager',
      location: 'Jakarta',
      organizationSize: 'LARGE',
      content: 'Security infrastructure enterprise-grade dengan SOC 2 compliance. API integration mudah dengan sistem existing. Backup & disaster recovery sangat reliable.',
      rating: 5,
      photoUrl: '/testimonials/rina-kartika.jpg',
      isPublished: true,
      isFeatured: false
    }
  ]

  for (const testimonial of testimonials) {
    try {
      await prisma.marketingTestimonial.create({
        data: testimonial
      })
      console.log(`✅ Created testimonial: ${testimonial.contactName}`)
    } catch (error) {
      console.error(`❌ Error creating testimonial ${testimonial.contactName}:`, error)
    }
  }

  const count = await prisma.marketingTestimonial.count()
  console.log(`✅ Testimonials seed completed! Created ${count} testimonials`)
}

export default seedTestimonials

// Run directly if this file is executed
if (require.main === module) {
  seedTestimonials()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}