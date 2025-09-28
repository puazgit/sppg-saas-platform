import { NextRequest, NextResponse } from 'next/server'
import { TokenService } from '@/features/auth/lib/token-service'
import { EmailService } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token verifikasi diperlukan'
      }, { status: 400 })
    }

    // Validate token
    const validation = await TokenService.validateEmailToken(token)
    
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: validation.error || 'Token tidak valid'
      }, { status: 400 })
    }

    const tokenData = validation.data!

    // Complete verification
    const completion = await TokenService.completeEmailVerification(tokenData.id)
    
    if (!completion.success) {
      return NextResponse.json({
        success: false,
        error: completion.error || 'Gagal menyelesaikan verifikasi'
      }, { status: 500 })
    }

    // Get user data for welcome email
    let user = null
    let redirectUrl = '/auth/signin'
    
    if (completion.userId) {
      user = await prisma.user.findUnique({
        where: { id: completion.userId },
        include: {
          sppg: true
        }
      })

      if (user?.sppg) {
        // Send welcome email
        await EmailService.sendWelcomeEmail(
          user.email,
          user.name,
          user.sppg.name
        )
        
        // Set redirect URL based on user type
        redirectUrl = user.userType === 'SUPERADMIN' ? '/superadmin' : '/sppg'
      }
    } else {
      // Handle case where verification is for a registration that hasn't created user yet
      // This might happen for pre-registration email verification
      console.log('Email verified for registration:', tokenData.email)
    }

    return NextResponse.json({
      success: true,
      message: user?.sppg 
        ? `Selamat! Email Anda telah berhasil diverifikasi. Akun ${user.sppg.name} siap digunakan.`
        : 'Email berhasil diverifikasi!',
      redirectUrl,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        sppgId: user.sppgId
      } : null
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server saat verifikasi email'
    }, { status: 500 })
  }
}