import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Ambil marketing features dari database dengan ordering yang benar
    const features = await prisma.marketingFeature.findMany({
      where: { active: true },
      orderBy: [
        { isHighlight: 'desc' },
        { sortOrder: 'asc' }
      ]
    })

    const formattedFeatures = features.map(feature => ({
      id: feature.id,
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      category: feature.category,
      benefits: feature.benefits,
      availableIn: feature.availableIn,
      isHighlight: feature.isHighlight
    }))

    return NextResponse.json({ 
      features: formattedFeatures,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Marketing Features API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features data' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}