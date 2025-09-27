/**
 * API Route: Get Subscription Details
 * GET /api/subscription/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id

    // Get subscription with related data
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        sppg: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            status: true,
            picName: true,
            picEmail: true,
            picPosition: true,
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            tier: true,
            monthlyPrice: true,
            setupFee: true,
            features: true,
          }
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            paymentMethod: true,
            paymentReference: true,
            paidDate: true,
            createdAt: true,
          }
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const latestInvoice = subscription.invoices[0]

    // Format response data for SuccessStep
    const successData = {
      subscriptionId: subscription.id,
      sppgId: subscription.sppg.code,
      organizationName: subscription.sppg.name,
      packageName: subscription.package.name,
      activationStatus: subscription.status,
      invoice: latestInvoice ? {
        id: latestInvoice.id,
        invoiceNumber: latestInvoice.invoiceNumber,
        amount: latestInvoice.totalAmount,
        paidAt: latestInvoice.paidDate,
        paymentMethod: latestInvoice.paymentMethod,
        status: latestInvoice.status,
      } : null,
      account: {
        adminEmail: subscription.sppg.picEmail,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sppg/login`,
        tempPassword: 'Welcome2024!', // TODO: Generate secure temp password
        setupRequired: subscription.status === 'TRIAL' || subscription.status === 'ACTIVE',
      },
      sppg: subscription.sppg,
      package: subscription.package,
    }

    return NextResponse.json({
      success: true,
      data: successData,
    })

  } catch (error) {
    console.error('[API] Error fetching subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}