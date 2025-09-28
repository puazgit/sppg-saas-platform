import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { updateSubscriptionFormSchema } from '@/features/superadmin/subscription-management'

// GET /api/superadmin/subscriptions/[id] - Get subscription detail
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        sppg: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            // Include current usage stats
            _count: {
              select: {
                users: true,
                staff: true,
                distributionPoints: true
              }
            }
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            tier: true,
            monthlyPrice: true,
            yearlyPrice: true,
            features: true
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

    // Format response with current usage
    const formattedSubscription = {
      id: subscription.id,
      sppgId: subscription.sppgId,
      tier: subscription.tier,
      status: subscription.status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate?.toISOString() || null,
      billingDate: subscription.billingDate.toISOString(),
      maxRecipients: subscription.maxRecipients,
      maxStaff: subscription.maxStaff,
      maxDistributionPoints: subscription.maxDistributionPoints,
      storageGb: subscription.storageGb,
      packageId: subscription.packageId,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
      sppg: {
        ...subscription.sppg,
        createdAt: subscription.sppg.createdAt.toISOString(),
        currentUsage: {
          users: subscription.sppg._count.users,
          staff: subscription.sppg._count.staff,
          distributionPoints: subscription.sppg._count.distributionPoints,
          // Storage usage would need to be calculated separately
          storageGb: 0 // Placeholder
        }
      },
      package: subscription.package
    }

    return NextResponse.json({
      success: true,
      data: formattedSubscription
    })

  } catch (error) {
    console.error('Error fetching subscription detail:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription detail' },
      { status: 500 }
    )
  }
}

// PATCH /api/superadmin/subscriptions/[id] - Update subscription
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateSubscriptionFormSchema.parse(body)

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: params.id }
    })

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // If package is being changed, update limits
    let packageLimits = {}
    if (validatedData.packageId && validatedData.packageId !== existingSubscription.packageId) {
      const newPackage = await prisma.subscriptionPackage.findUnique({
        where: { id: validatedData.packageId }
      })

      if (!newPackage) {
        return NextResponse.json(
          { success: false, error: 'New package not found' },
          { status: 404 }
        )
      }

      packageLimits = {
        maxRecipients: newPackage.maxRecipients,
        maxStaff: newPackage.maxStaff,
        maxDistributionPoints: newPackage.maxDistributionPoints,
        storageGb: newPackage.storageGb,
        tier: newPackage.tier
      }
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...packageLimits,
        billingDate: validatedData.billingDate ? new Date(validatedData.billingDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        sppg: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            tier: true,
            monthlyPrice: true,
            yearlyPrice: true
          }
        }
      }
    })

    // Format response
    const formattedSubscription = {
      id: updatedSubscription.id,
      sppgId: updatedSubscription.sppgId,
      tier: updatedSubscription.tier,
      status: updatedSubscription.status,
      startDate: updatedSubscription.startDate.toISOString(),
      endDate: updatedSubscription.endDate?.toISOString() || null,
      billingDate: updatedSubscription.billingDate.toISOString(),
      maxRecipients: updatedSubscription.maxRecipients,
      maxStaff: updatedSubscription.maxStaff,
      maxDistributionPoints: updatedSubscription.maxDistributionPoints,
      storageGb: updatedSubscription.storageGb,
      packageId: updatedSubscription.packageId,
      createdAt: updatedSubscription.createdAt.toISOString(),
      updatedAt: updatedSubscription.updatedAt.toISOString(),
      sppg: updatedSubscription.sppg,
      package: updatedSubscription.package
    }

    return NextResponse.json({
      success: true,
      data: formattedSubscription
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE /api/superadmin/subscriptions/[id] - Delete subscription
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: params.id }
    })

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting status to CANCELLED
    await prisma.subscription.update({
      where: { id: params.id },
      data: { 
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}