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
    console.log(`[API] Getting subscription data for ID: ${subscriptionId}`)

    // If subscriptionId is demo or invalid, return mock data
    if (subscriptionId === 'demo-subscription' || !subscriptionId) {
      console.log('[API] Using mock data for demo subscription')
      return NextResponse.json({
        success: true,
        data: {
          subscriptionId: 'demo-subscription',
          sppgId: 'SPPG-DEMO-001',
          organizationName: 'SPPG Demo Organization',
          packageName: 'STANDARD Package',
          activationStatus: 'ACTIVE',
          invoice: {
            id: 'INV-DEMO-001',
            invoiceNumber: 'INV-DEMO-001',
            amount: 2500000,
            paidAt: new Date(),
            paymentMethod: 'Bank Transfer',
            status: 'COMPLETED'
          },
          account: {
            adminEmail: 'admin@demo-sppg.com',
            loginUrl: '/sppg/login',
            tempPassword: 'Welcome2024!',
            setupRequired: true
          },
          sppg: {
            id: 'sppg-demo-001',
            code: 'SPPG-DEMO-001',
            name: 'SPPG Demo Organization',
            email: 'admin@demo-sppg.com',
            phone: '021-12345678',
            address: 'Jl. Demo No. 123',
            status: 'ACTIVE'
          },
          package: {
            id: 'pkg-standard',
            name: 'STANDARD Package',
            tier: 'STANDARD',
            monthlyPrice: 250000,
            setupFee: 500000
          }
        }
      })
    }

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

      }
    })

    console.log(`[API] Found subscription:`, subscription ? 'YES' : 'NO')

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Get latest invoice for the SPPG
    const latestInvoice = await prisma.invoice.findFirst({
      where: { sppgId: subscription.sppgId },
      orderBy: { createdAt: 'desc' },
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
    })

    console.log(`[API] Found invoice:`, latestInvoice ? 'YES' : 'NO')

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