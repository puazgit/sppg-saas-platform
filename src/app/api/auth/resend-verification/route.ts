import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Alamat email diperlukan'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Format email tidak valid'
      }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { sppg: true }
    })

    let recipientName = 'User'
    let organizationName = undefined

    if (user) {
      recipientName = user.name
      organizationName = user.sppg?.name
      
      // Check if already verified
      if (user.emailVerified) {
        return NextResponse.json({
          success: false,
          error: 'Email sudah terverifikasi'
        }, { status: 400 })
      }
    }

    // Check rate limiting - max 3 emails per hour per email address
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    const recentVerifications = await prisma.emailVerification.count({
      where: {
        email,
        createdAt: {
          gte: oneHourAgo
        }
      }
    })

    if (recentVerifications >= 3) {
      return NextResponse.json({
        success: false,
        error: 'Terlalu banyak permintaan verifikasi. Silakan coba lagi dalam 1 jam.'
      }, { status: 429 })
    }

    // Send verification email
    const emailResult = await EmailService.sendEmailVerification(
      email,
      recipientName,
      organizationName
    )

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        error: emailResult.error || 'Gagal mengirim email verifikasi'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email verifikasi baru telah dikirim. Silakan periksa inbox Anda.',
      messageId: emailResult.messageId
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server saat mengirim email verifikasi'
    }, { status: 500 })
  }
}