/**
 * API Route: Get Subscription by SPPG ID
 * GET /api/billing/subscription/[sppgId]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { sppgId: string } }
) {
  try {
    const { sppgId } = params

    const subscription = await prisma.subscription.findUnique({
      where: {
        sppgId,
      },
      include: {
        package: true,
        sppg: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscription' 
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/billing/subscription/[sppgId]
 * Update subscription
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sppgId: string } }
) {
  try {
    const { sppgId } = params
    const body = await request.json()

    const subscription = await prisma.subscription.update({
      where: {
        sppgId,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        package: true,
      },
    })

    return NextResponse.json({
      success: true,
      subscription,
    })

  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update subscription' 
      },
      { status: 500 }
    )
  }
}