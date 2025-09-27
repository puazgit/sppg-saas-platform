import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message, source } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save contact inquiry to MarketingLead
    const inquiry = await prisma.marketingLead.create({
      data: {
        name,
        email,
        phone: phone || null,
        organization: company || null,
        source: source || 'WEBSITE',
        status: 'NEW',
        metadata: {
          message,
          inquiryType: 'GENERAL_INQUIRY',
          submittedAt: new Date()
        }
      }
    })

    // Here you would typically send notification email to sales team
    // await sendNotificationEmail(inquiry)

    return NextResponse.json({
      success: true,
      message: 'Terima kasih atas ketertarikan Anda. Tim kami akan menghubungi Anda dalam 24 jam.',
      inquiryId: inquiry.id
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process your inquiry' },
      { status: 500 }
    )
  }
}