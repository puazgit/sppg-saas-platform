import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params

    // Find subscription with related data
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        package: true,
        sppg: true
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (!subscription.package) {
      return NextResponse.json(
        { success: false, error: 'Subscription package not found' },
        { status: 404 }
      )
    }

    // Calculate expiration time (48 hours from now)
    const expirationTime = new Date()
    expirationTime.setHours(expirationTime.getHours() + 48)

    // Generate payment account number based on method
    function generatePaymentAccount(method: string): string | null {
      switch (method) {
        case 'VIRTUAL_ACCOUNT_BCA':
          return `77888${subscriptionId.slice(-8)}`
        case 'VIRTUAL_ACCOUNT_BNI':
          return `88808${subscriptionId.slice(-8)}`
        case 'BANK_TRANSFER':
          return '1234567890' // BCA Account
        default:
          return null
      }
    }

    // Generate payment instructions
    function generateInstructions(method: string): string {
      switch (method) {
        case 'VIRTUAL_ACCOUNT_BCA':
          return 'Transfer ke Virtual Account BCA'
        case 'VIRTUAL_ACCOUNT_BNI':
          return 'Transfer ke Virtual Account BNI'
        case 'BANK_TRANSFER':
          return 'Transfer ke rekening BCA: 1234567890'
        default:
          return 'Ikuti petunjuk pembayaran'
      }
    }

    const paymentDetails = {
      transactionId: `INV-${subscriptionId}`,
      amount: subscription.package.monthlyPrice,
      method: 'BANK_TRANSFER', // Default payment method
      status: 'PENDING' as const,
      vaNumber: generatePaymentAccount('BANK_TRANSFER'),
      instructions: generateInstructions('BANK_TRANSFER'),
      expiresAt: expirationTime,
      subscriptionDetails: {
        packageName: subscription.package.displayName || subscription.package.name,
        sppgName: subscription.sppg.name,
        period: 'Monthly'
      }
    }

    return NextResponse.json({
      success: true,
      paymentDetails
    })

  } catch (error) {
    console.error('[API] Error fetching payment details:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}