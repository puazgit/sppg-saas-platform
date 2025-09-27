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
  city: string
  province: string
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
    
    // Validate request data
    const validation = validateCreateSubscriptionRequest(body)
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

    // Create SPPG organization
    const sppg = await prisma.sPPG.create({
      data: {
        code: `SPPG-${Date.now()}`, // Generate unique code
        name: sppgData.sppgName,
        description: `SPPG ${sppgData.sppgType} - ${sppgData.sppgName}`,
        address: sppgData.address,
        phone: sppgData.phone,
        email: sppgData.email,
        // PIC Fields (required by new schema)
        picName: sppgData.picName || 'Admin',
        picPosition: sppgData.picPosition || 'Manager',
        picEmail: sppgData.picEmail || sppgData.email,
        picPhone: sppgData.picPhone || sppgData.phone,
        picWhatsapp: (sppgData as ExtendedSppgData).picWhatsapp,
        organizationType: (sppgData as ExtendedSppgData).organizationType || 'YAYASAN',
        establishedYear: (sppgData as ExtendedSppgData).establishedYear || new Date().getFullYear(),
        targetRecipients: sppgData.estimatedRecipients,
        maxRadius: 10.0, // Default 10km radius
        maxTravelTime: 60, // Default 60 minutes
        operationStartDate: new Date(),
        provinceId: sppgData.province,
        regencyId: sppgData.city, // Assuming city is regencyId
        districtId: "default-district", // Default value
        villageId: "default-village", // Default value
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

    // Generate payment instructions
    const paymentInstructions = generatePaymentInstructions(
      paymentData.paymentMethod,
      totalAmount
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create subscription' 
      },
      { status: 500 }
    )
  }
}

function generatePaymentInstructions(method: string, amount: number) {
  switch (method) {
    case 'BANK_TRANSFER':
      return {
        method,
        amount,
        instructions: 'Transfer ke rekening berikut dan kirim bukti pembayaran via WhatsApp',
        bankDetails: {
          bankName: 'Bank Central Asia (BCA)',
          accountNumber: '1234567890',
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