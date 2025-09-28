/**
 * API Route: Create Subscription
 * POST /api/billing/subscription/create
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateCreateSubscriptionRequest } from '@/features/billing/schemas'
import { addMonths } from 'date-fns'
import type { OrganizationType } from '@prisma/client'

// Extended interface for SPPG data with new fields
interface ExtendedSppgData {
  sppgName: string
  sppgType: string
  address: string
  
  // Location menggunakan ID sesuai Prisma schema
  provinceId: string
  regencyId: string
  districtId: string
  villageId: string
  
  postalCode: string
  phone: string
  email: string
  picName: string
  picPosition: string
  picEmail: string
  picPhone: string
  picWhatsapp?: string
  organizationType?: OrganizationType
  establishedYear?: number
  estimatedRecipients: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[API] Received subscription request:', JSON.stringify(body, null, 2))
    
    // Validate request data
    const validation = validateCreateSubscriptionRequest(body)
    console.log('[API] Validation result:', { 
      success: validation.success, 
      error: validation.success ? null : validation.error.issues 
    })
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { packageId, sppgData, paymentData } = validation.data

    // Get package details
    const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
    })

    if (!subscriptionPackage) {
      return NextResponse.json(
        { success: false, error: 'Subscription package not found' },
        { status: 404 }
      )
    }

    // Import dynamic config - NO HARDCODE!
    const { APP_CONFIG } = await import('@/lib/app-config')

    // Validate region IDs exist
    const province = await prisma.province.findUnique({
      where: { id: sppgData.provinceId }
    })

    if (!province) {
      return NextResponse.json(
        { success: false, error: 'Province tidak ditemukan' },
        { status: 400 }
      )
    }

    const regency = await prisma.regency.findUnique({
      where: { id: sppgData.regencyId }
    })

    if (!regency) {
      return NextResponse.json(
        { success: false, error: 'Kabupaten/Kota tidak ditemukan' },
        { status: 400 }
      )
    }

    const district = await prisma.district.findUnique({
      where: { id: sppgData.districtId }
    })

    if (!district) {
      return NextResponse.json(
        { success: false, error: 'Kecamatan tidak ditemukan' },
        { status: 400 }
      )
    }

    const village = await prisma.village.findUnique({
      where: { id: sppgData.villageId }
    })

    // If regency not found, use first regency in the province
    if (!village) {
      return NextResponse.json(
        { success: false, error: 'Desa/Kelurahan tidak ditemukan' },
        { status: 400 }
      )
    }
    
    // Create SPPG organization with dynamic values and valid regional IDs
    const sppg = await prisma.sPPG.create({
      data: {
        code: APP_CONFIG.generators.generateUniqueCode('SPPG'),
        name: sppgData.sppgName,
        description: `SPPG ${sppgData.sppgType} - ${sppgData.sppgName}`,
        address: sppgData.address,
        phone: sppgData.phone,
        email: sppgData.email,
        // PIC Fields (required by new schema) - NO DEFAULTS!
        picName: sppgData.picName,
        picPosition: sppgData.picPosition,
        picEmail: sppgData.picEmail,
        picPhone: sppgData.picPhone,
        picWhatsapp: (sppgData as ExtendedSppgData).picWhatsapp,
        organizationType: (sppgData as ExtendedSppgData).organizationType || 'YAYASAN',
        establishedYear: (sppgData as ExtendedSppgData).establishedYear || new Date().getFullYear(),
        targetRecipients: sppgData.estimatedRecipients,
        maxRadius: APP_CONFIG.calculations.calculateOptimalRadius(sppgData.estimatedRecipients),
        maxTravelTime: APP_CONFIG.calculations.calculateOptimalTravelTime(sppgData.estimatedRecipients),
        operationStartDate: new Date(),
        // Regional IDs - menggunakan ID yang sudah divalidasi
        provinceId: sppgData.provinceId,
        regencyId: sppgData.regencyId,
        districtId: sppgData.districtId,
        villageId: sppgData.villageId,
        status: 'PENDING_APPROVAL',
      },
    })

    // Calculate billing date based on cycle
    let billingDate = new Date()
    let endDate: Date | null = null

    switch (paymentData.billingCycle) {
      case 'MONTHLY':
        billingDate = addMonths(new Date(), 1)
        endDate = addMonths(new Date(), 1)
        break
      case 'QUARTERLY':
        billingDate = addMonths(new Date(), 3)
        endDate = addMonths(new Date(), 3)
        break
      case 'YEARLY':
        billingDate = addMonths(new Date(), 12)
        endDate = addMonths(new Date(), 12)
        break
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        sppgId: sppg.id,
        tier: subscriptionPackage.tier,
        status: 'TRIAL', // Start with trial until payment is confirmed
        billingDate,
        endDate,
        maxRecipients: subscriptionPackage.maxRecipients,
        maxStaff: subscriptionPackage.maxStaff,
        maxDistributionPoints: subscriptionPackage.maxDistributionPoints,
        storageGb: subscriptionPackage.storageGb,
        packageId: subscriptionPackage.id,
      },
    })

    // Calculate price
    const unitCount = Math.max(1, Math.ceil(sppgData.estimatedRecipients / 100))
    let baseAmount = subscriptionPackage.monthlyPrice * unitCount
    
    // Apply billing cycle discounts
    if (paymentData.billingCycle === 'QUARTERLY') {
      baseAmount = baseAmount * 3 * 0.95 // 5% discount
    } else if (paymentData.billingCycle === 'YEARLY') {
      baseAmount = baseAmount * 12 * 0.85 // 15% discount
    }

    const tax = baseAmount * 0.11 // 11% PPN
    const totalAmount = baseAmount + tax

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-6)}`

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        sppgId: sppg.id,
        invoiceNumber,
        period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        baseAmount,
        tax,
        discount: 0,
        totalAmount,
        status: 'PENDING',
        invoiceDate: new Date(),
        dueDate: addMonths(new Date(), 1),
        paymentMethod: paymentData.paymentMethod,
      },
    })

    // Generate payment instructions with APP_CONFIG
    const paymentInstructions = generatePaymentInstructions(
      paymentData.paymentMethod, 
      subscriptionPackage.monthlyPrice, 
      APP_CONFIG
    )

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      sppgId: sppg.id,
      invoiceId: invoice.id,
      paymentInstructions,
    })

  } catch (error) {
    console.error('Create subscription error:', error)
    
    // More detailed error handling
    if (error instanceof Error) {
      // Check if it's a Prisma error
      if ('code' in error) {
        const prismaError = error as Error & { 
          code?: string, 
          meta?: { target?: string[] } 
        }
        
        switch (prismaError.code) {
          case 'P2002':
            return NextResponse.json(
              { 
                success: false, 
                error: 'Data sudah ada (duplikasi)',
                details: [`Field ${prismaError.meta?.target?.join(', ') || 'unknown'} sudah digunakan`]
              },
              { status: 400 }
            )
          case 'P2003':
            return NextResponse.json(
              { 
                success: false, 
                error: 'Data terkait tidak ditemukan',
                details: ['Package ID atau regional data tidak valid']
              },
              { status: 400 }
            )
          case 'P2025':
            return NextResponse.json(
              { 
                success: false, 
                error: 'Record tidak ditemukan',
                details: ['Subscription package tidak ditemukan']
              },
              { status: 404 }
            )
          default:
            return NextResponse.json(
              { 
                success: false, 
                error: 'Database error',
                details: [prismaError.message || 'Unknown database error']
              },
              { status: 500 }
            )
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal membuat subscription',
          details: [error.message]
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unknown error occurred',
        details: ['Terjadi kesalahan yang tidak diketahui']
      },
      { status: 500 }
    )
  }
}

function generatePaymentInstructions(method: string, amount: number, appConfig: typeof import('@/lib/app-config').APP_CONFIG) {
  switch (method) {
    case 'BANK_TRANSFER':
      return {
        method,
        amount,
        instructions: 'Transfer ke rekening berikut dan kirim bukti pembayaran via WhatsApp',
        bankDetails: {
          bankName: 'Bank Central Asia (BCA)',
          accountNumber: appConfig.generators.generateAccountNumber(), // Generate unique account number
          accountName: 'PT SPPG Solutions Indonesia',
        },
      }
    case 'VIRTUAL_ACCOUNT':
      return {
        method,
        amount,
        instructions: 'Bayar melalui Virtual Account berikut',
        virtualAccount: {
          vaNumber: `88808${String(Date.now()).slice(-8)}`,
          bankCode: 'BCA',
        },
      }
    case 'CREDIT_CARD':
      return {
        method,
        amount,
        instructions: 'Pembayaran akan diproses melalui gateway pembayaran yang aman',
      }
    default:
      return {
        method,
        amount,
        instructions: 'Hubungi customer service untuk instruksi pembayaran',
      }
  }
}