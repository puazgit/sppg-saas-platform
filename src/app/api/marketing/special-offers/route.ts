import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const now = new Date()
    const offers = await prisma.specialOffer.findMany({
      where: {
        active: true,
        validFrom: { lte: now },
        validUntil: { gte: now }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedOffers = offers.map(offer => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountAmount ? 'AMOUNT' : 'PERCENTAGE',
      discountValue: offer.discountPercentage,
      discountAmount: offer.discountAmount ? Number(offer.discountAmount) : null,
      validFrom: offer.validFrom,
      validUntil: offer.validUntil,
      termsConditions: offer.termsConditions ? offer.termsConditions.split('\n') : [],
      targetAudience: offer.targetAudience,
      applicablePackages: offer.applicablePackages,
      maxUsage: offer.maxUsage,
      currentUsage: offer.currentUsage,
      badge: offer.maxUsage ? 'LIMITED' : 'STANDARD',
      urgency: offer.validUntil < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'HIGH' : 'MEDIUM'
    }))

    return NextResponse.json(formattedOffers)

  } catch (error) {
    console.error('Error fetching special offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special offers' },
      { status: 500 }
    )
  }
}