import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email-service'
import { registrationDataSchema } from '@/features/subscription/schemas/subscription.schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate registration data
    const validationResult = registrationDataSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Data registrasi tidak valid',
        details: validationResult.error.format()
      }, { status: 400 })
    }

    const data = validationResult.data

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun yang sudah ada.'
      }, { status: 409 })
    }

    // Check if organization code already exists
    const existingSppg = await prisma.sPPG.findUnique({
      where: { code: data.code }
    })

    if (existingSppg) {
      return NextResponse.json({
        success: false,
        error: 'Kode organisasi sudah digunakan. Silakan gunakan kode lain.'
      }, { status: 409 })
    }

    // Get subscription package
    const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
      where: { id: data.selectedPackageId }
    })

    if (!subscriptionPackage) {
      return NextResponse.json({
        success: false,
        error: 'Paket berlangganan tidak ditemukan'
      }, { status: 404 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create SPPG organization
      const sppg = await tx.sPPG.create({
        data: {
          code: data.code,
          name: data.name,
          organizationType: data.organizationType,
          address: data.address,
          establishedYear: data.establishedYear,
          provinceId: data.provinceId,
          regencyId: data.regencyId,
          districtId: data.districtId,
          villageId: data.villageId,
          phone: data.phone,
          email: data.email,
          picName: data.picName,
          picPosition: data.picPosition,
          picEmail: data.picEmail || data.email,
          picPhone: data.picPhone || data.phone,
          picWhatsapp: data.picWhatsapp,
          targetRecipients: data.targetRecipients,
          maxRadius: data.maxRadius,
          maxTravelTime: data.maxTravelTime,
          timezone: data.timezone,
          businessHoursStart: data.businessHoursStart,
          businessHoursEnd: data.businessHoursEnd,
          operationalDays: data.operationalDays,
          operationStartDate: data.operationStartDate,
          status: 'PENDING_APPROVAL', // Will be activated after email verification
          description: data.description
        }
      })

      // 2. Create subscription
      const subscription = await tx.subscription.create({
        data: {
          sppgId: sppg.id,
          packageId: subscriptionPackage.id,
          tier: subscriptionPackage.tier,
          status: 'TRIAL', // Start with trial until payment
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
          billingDate: new Date(),
          maxRecipients: subscriptionPackage.maxRecipients,
          maxStaff: subscriptionPackage.maxStaff,
          maxDistributionPoints: subscriptionPackage.maxDistributionPoints,
          storageGb: subscriptionPackage.storageGb
        }
      })

      // 3. Create primary user (SPPG Manager)
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.picName,
          phone: data.picPhone,
          userType: 'SPPG_USER',
          sppgId: sppg.id,
          emailVerified: null, // Will be set after email verification
          isActive: false, // Activated after email verification
          preferredTimezone: data.timezone
        }
      })

      // 4. Assign SPPG Manager role to user
      const managerRole = await tx.role.findFirst({
        where: { name: 'SPPG_MANAGER' }
      })

      if (managerRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: managerRole.id
          }
        })
      }

      return { sppg, subscription, user }
    })

    // Send email verification
    const emailResult = await EmailService.sendEmailVerification(
      data.email,
      data.picName,
      data.name
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Note: We don't fail the registration if email fails, just log it
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan periksa email Anda untuk verifikasi akun.',
      data: {
        sppgId: result.sppg.id,
        subscriptionId: result.subscription.id,
        userId: result.user.id,
        organizationName: result.sppg.name,
        email: result.user.email,
        verificationSent: emailResult.success,
        trialEndDate: result.subscription.endDate
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({
          success: false,
          error: 'Data duplikat ditemukan. Mungkin email atau kode organisasi sudah digunakan.'
        }, { status: 409 })
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server saat memproses registrasi. Silakan coba lagi.'
    }, { status: 500 })
  }
}