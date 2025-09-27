import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMarketingModels() {
  console.log('🌱 Seeding marketing models...')

  // Seed MarketingHeroFeature
  const heroFeatures = [
    {
      title: "Enterprise Security",
      description: "Keamanan tingkat enterprise dengan enkripsi end-to-end dan compliance SOC 2",
      icon: "Shield",
      category: "SECURITY",
      sortOrder: 1
    },
    {
      title: "Smart Automation",
      description: "Otomatisasi cerdas dengan AI untuk optimasi workflow dan efisiensi operasional",
      icon: "Zap", 
      category: "AUTOMATION",
      sortOrder: 2
    },
    {
      title: "Advanced Analytics",
      description: "Analytics mendalam dengan real-time insights dan predictive analytics",
      icon: "BarChart3",
      category: "ANALYTICS",
      sortOrder: 3
    },
    {
      title: "Quick Implementation",
      description: "Setup dalam 24 jam dengan onboarding dan training lengkap",
      icon: "Clock",
      category: "IMPLEMENTATION",
      sortOrder: 4
    }
  ]

  for (const feature of heroFeatures) {
    await prisma.marketingHeroFeature.upsert({
      where: { title: feature.title },
      update: feature,
      create: feature
    })
  }

  // Seed MarketingTrustIndicator
  const trustIndicators = [
    {
      label: "Compliance Score",
      description: "Quality assurance rating",
      icon: "Shield",
      metricType: "PERCENTAGE",
      querySource: "COMPLIANCE_SCORE",
      sortOrder: 1
    },
    {
      label: "SPPG Active",
      description: "Organizations nationwide",
      icon: "Users",
      metricType: "COUNT",
      querySource: "SPPG_COUNT",
      sortOrder: 2
    },
    {
      label: "Provinces",
      description: "Coverage across Indonesia",
      icon: "Globe2",
      metricType: "COUNT",
      querySource: "PROVINCES_COUNT",
      sortOrder: 3
    },
    {
      label: "Students Served",
      description: "Across all programs",
      icon: "GraduationCap",
      metricType: "COUNT",
      querySource: "STUDENTS_COUNT",
      sortOrder: 4
    },
    {
      label: "Kitchen Facilities",
      description: "Professional cooking facilities",
      icon: "ChefHat",
      metricType: "COUNT",
      querySource: "KITCHEN_COUNT",
      sortOrder: 5
    },
    {
      label: "Meals Distributed",
      description: "Total meals served to date",
      icon: "Target",
      metricType: "COUNT",
      querySource: "MEALS_DISTRIBUTED",
      sortOrder: 6
    },
    {
      label: "Satisfaction Rating",
      description: "Average feedback score (1-5)",
      icon: "Star",
      metricType: "RATING",
      querySource: "SATISFACTION_RATING",
      sortOrder: 7
    },
    {
      label: "Active Schools",
      description: "Partner educational institutions",
      icon: "Building2",
      metricType: "COUNT",
      querySource: "SCHOOLS_COUNT",
      sortOrder: 8
    }
  ]

  for (const indicator of trustIndicators) {
    await prisma.marketingTrustIndicator.upsert({
      where: { label: indicator.label },
      update: indicator,
      create: indicator
    })
  }

  // Seed MarketingCaseStudy
  const caseStudies = [
    {
      title: "Transformasi Digital SPPG Jakarta Selatan",
      clientName: "SPPG Jakarta Selatan",
      industry: "Nutrition Services",
      challenge: "Mengelola program gizi untuk 15,000 penerima dengan sistem manual yang tidak efisien dan prone to error",
      solution: "Implementasi platform SPPG SaaS dengan automation, real-time monitoring, dan predictive analytics untuk optimasi operasional",
      results: [
        "Efisiensi operasional meningkat 68%",
        "Pengurangan food waste hingga 23%", 
        "Akurasi pelaporan mencapai 99.2%",
        "Kepuasan beneficiary naik ke 94%"
      ],
      metrics: {
        efficiency: "+68%",
        wasteReduction: "-23%",
        accuracy: "99.2%",
        satisfaction: "94%"
      },
      testimonialQuote: "Platform ini benar-benar mengubah cara kami bekerja. Semua proses menjadi lebih efisien dan terukur. ROI yang luar biasa!",
      tags: ["Digital Transformation", "Efficiency", "Food Safety"],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: "Optimasi Inventory SPPG Bandung Raya", 
      clientName: "SPPG Bandung Raya",
      industry: "Nutrition Services",
      challenge: "Food waste tinggi dan inventory management yang tidak akurat menyebabkan kerugian operasional",
      solution: "Smart inventory management dengan AI prediction dan automated reordering system",
      results: [
        "Food waste turun dari 25% menjadi 8%",
        "Inventory accuracy meningkat ke 97%",
        "Cost savings 35% per bulan",
        "Staff productivity naik 45%"
      ],
      metrics: {
        wasteReduction: "-17%",
        accuracy: "97%", 
        costSavings: "-35%",
        productivity: "+45%"
      },
      testimonialQuote: "Sistem inventory dengan AI prediction benar-benar game changer. Menghemat 120 jam kerja per bulan!",
      tags: ["AI", "Inventory Management", "Cost Optimization"],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-02-10')
    },
    {
      title: "Menu Planning Innovation SPPG Surabaya",
      clientName: "SPPG Surabaya", 
      industry: "Nutrition Services",
      challenge: "Menu planning manual tidak mempertimbangkan preferensi dan kebutuhan nutrisi yang optimal",
      solution: "AI-powered menu planning dengan analisis nutrisi otomatis dan preference learning",
      results: [
        "Menu satisfaction score naik ke 92%",
        "Nutrisi compliance 98.5%", 
        "Planning time reduced 60%",
        "Variety index meningkat 40%"
      ],
      metrics: {
        satisfaction: "92%",
        compliance: "98.5%",
        timeReduction: "-60%", 
        variety: "+40%"
      },
      testimonialQuote: "Menu planning dengan AI mempertimbangkan preferensi lokal dan ketersediaan bahan. Luar biasa!",
      tags: ["AI", "Menu Planning", "Nutrition"],
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2024-02-28')
    }
  ]

  for (const study of caseStudies) {
    await prisma.marketingCaseStudy.upsert({
      where: { title: study.title },
      update: study,
      create: study
    })
  }

  console.log('✅ Marketing models seeded successfully!')
}

export { seedMarketingModels }