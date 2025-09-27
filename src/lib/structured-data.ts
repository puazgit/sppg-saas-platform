/* eslint-disable @typescript-eslint/no-explicit-any */
// Import types from global definitions
type SubscriptionPackage = any
type CaseStudy = any

export function generatePricingStructuredData(packages: SubscriptionPackage[]) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SPPG Platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "description": "Platform manajemen SPPG (Satuan Pelayanan Gizi Gratis) untuk digitalisasi operasional layanan gizi",
    "url": "https://sppg-platform.id",
    "offers": packages.map(pkg => ({
      "@type": "Offer",
      "name": pkg.displayName,
      "description": pkg.description,
      "price": pkg.monthlyPrice,
      "priceCurrency": "IDR",
      "billingIncrement": "P1M",
      "category": pkg.tier,
      "seller": {
        "@type": "Organization",
        "name": "SPPG Platform Indonesia"
      },
      "itemOffered": {
        "@type": "SoftwareApplication",
        "name": `SPPG Platform ${pkg.displayName}`,
        "applicationCategory": "BusinessApplication",
        "featureList": pkg.highlightFeatures
      }
    })),
    "provider": {
      "@type": "Organization",
      "name": "SPPG Platform Indonesia",
      "description": "Penyedia platform digitalisasi SPPG terdepan di Indonesia",
      "url": "https://sppg-platform.id",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-21-2965-4000",
        "contactType": "customer service",
        "availableLanguage": "Indonesian"
      }
    }
  }

  return structuredData
}

export function generateCaseStudyStructuredData(caseStudy: CaseStudy) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    "name": `Transformasi Digital ${caseStudy.organizationName}`,
    "description": `Studi kasus implementasi SPPG Platform di ${caseStudy.organizationName}`,
    "about": {
      "@type": "Organization", 
      "name": caseStudy.organizationName,
      "location": caseStudy.location,
      "industry": "Government"
    },
    "result": caseStudy.resultsAchieved.map((result: any) => ({
      "@type": "QuantitativeValue",
      "name": result.metric,
      "value": result.improvement,
      "description": result.afterValue
    })),
    "provider": {
      "@type": "Organization",
      "name": "SPPG Platform Indonesia"
    },
    "testimonial": {
      "@type": "Review",
      "reviewBody": caseStudy.testimonial.quote,
      "author": {
        "@type": "Person",
        "name": caseStudy.testimonial.name,
        "jobTitle": caseStudy.testimonial.position
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5
      }
    }
  }

  return structuredData
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SPPG Platform Indonesia",
    "alternateName": "SPPG Platform",
    "description": "Platform digitalisasi SPPG (Satuan Pelayanan Gizi Gratis) terdepan di Indonesia untuk manajemen operasional layanan gizi",
    "url": "https://sppg-platform.id",
    "logo": "https://sppg-platform.id/logo.png",
    "foundingDate": "2024",
    "industry": "Software Development",
    "numberOfEmployees": "50-100",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gedung Cyber 2 Lt. 11, Jl. HR. Rasuna Said",
      "addressLocality": "Jakarta Selatan",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12950",
      "addressCountry": "ID"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+62-21-2965-4000",
        "contactType": "customer service",
        "availableLanguage": "Indonesian",
        "hoursAvailable": "Mo-Fr 09:00-18:00"
      },
      {
        "@type": "ContactPoint", 
        "telephone": "+62-811-9000-7000",
        "contactType": "customer service",
        "availableLanguage": "Indonesian",
        "description": "WhatsApp Support"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/sppg-platform",
      "https://instagram.com/sppgplatform",
      "https://facebook.com/sppgplatform"
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "Indonesia"
    },
    "knowsAbout": [
      "Manajemen SPPG",
      "Digitalisasi Layanan Gizi",
      "Sistem Manajemen Inventori",
      "Pelaporan Compliance Pemerintah",
      "Analisis Gizi Otomatis"
    ]
  }
}

export function generateFAQStructuredData() {
  const faqs = [
    {
      question: "Apa itu SPPG Platform?",
      answer: "SPPG Platform adalah solusi digitalisasi lengkap untuk Satuan Pelayanan Gizi Gratis yang membantu mengelola operasional, inventori, pelaporan, dan compliance dengan pemerintah."
    },
    {
      question: "Berapa biaya implementasi SPPG Platform?",
      answer: "Biaya mulai dari Rp 2.5 juta per bulan untuk paket Basic. Tersedia juga paket Standard (Rp 4.5 juta), Pro (Rp 7.5 juta), dan Enterprise dengan harga custom."
    },
    {
      question: "Berapa lama waktu implementasi?",
      answer: "Implementasi umumnya membutuhkan waktu 2-8 bulan tergantung ukuran organisasi dan kompleksitas kebutuhan. Tim kami akan membantu seluruh proses."
    },
    {
      question: "Apakah ada training untuk staff?",
      answer: "Ya, semua paket termasuk training lengkap untuk staff. Paket Enterprise mendapat training khusus dan dedicated support."
    },
    {
      question: "Bagaimana dengan keamanan data?",
      answer: "Kami menggunakan enkripsi tingkat enterprise dan compliance dengan standar keamanan Indonesia. Data disimpan di server lokal dengan backup otomatis."
    }
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}