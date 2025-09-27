import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const testimonials = await prisma.marketingTestimonial.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 12
    })

    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id,
      organizationName: testimonial.organizationName,
      contactName: testimonial.contactName,
      position: testimonial.position,
      location: testimonial.location,
      organizationSize: testimonial.organizationSize,
      content: testimonial.content,
      rating: testimonial.rating,
      photoUrl: testimonial.photoUrl,
      isPublished: testimonial.isPublished,
      isFeatured: testimonial.isFeatured
    }))

    return NextResponse.json({ 
      testimonials: formattedTestimonials,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Marketing Testimonials API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials data' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}