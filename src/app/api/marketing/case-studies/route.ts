import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get published case studies from database
    const caseStudies = await prisma.marketingCaseStudy.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: 8
    })

    const formattedCaseStudies = caseStudies.map(study => ({
      id: study.id,
      title: study.title,
      clientName: study.clientName,
      industry: study.industry,
      challenge: study.challenge,
      solution: study.solution,
      results: study.results,
      metrics: study.metrics,
      testimonialQuote: study.testimonialQuote,
      imageUrl: study.imageUrl,
      tags: study.tags,
      isPublished: study.isPublished,
      isFeatured: study.isFeatured
    }))

    return NextResponse.json({ 
      caseStudies: formattedCaseStudies,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Marketing Case Studies API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch case studies data' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}