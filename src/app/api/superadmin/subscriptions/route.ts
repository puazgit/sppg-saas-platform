import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { 
  subscriptionFiltersSchema,
  createSubscriptionFormSchema 
} from '@/features/superadmin/subscription-management'

// GET /api/superadmin/subscriptions - List subscriptions with filters
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filtersData = Object.fromEntries(searchParams.entries())
    
    // Parse and validate filters
    const filters = subscriptionFiltersSchema.parse({
      ...filtersData,
      page: filtersData.page ? parseInt(filtersData.page) : 1,
      limit: filtersData.limit ? parseInt(filtersData.limit) : 20,
      expiringWithin: filtersData.expiringWithin ? parseInt(filtersData.expiringWithin) : undefined
    })

    // Build where conditions
    const where: Record<string, unknown> = {}
    
    if (filters.status) {
      where.status = filters.status
    }
    
    if (filters.tier) {
      where.tier = filters.tier
    }
    
    if (filters.search) {
      where.sppg = {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ]
      }
    }
    
    if (filters.expiringWithin) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + filters.expiringWithin)
      
      where.endDate = {
        lte: futureDate,
        gte: new Date()
      }
    }

    // Execute queries
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
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
        },
        orderBy: {
          [filters.sortBy]: filters.sortOrder
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      
      prisma.subscription.count({ where })
    ])

    // Format response
    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      sppgId: sub.sppgId,
      tier: sub.tier,
      status: sub.status,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate?.toISOString() || null,
      billingDate: sub.billingDate.toISOString(),
      maxRecipients: sub.maxRecipients,
      maxStaff: sub.maxStaff,
      maxDistributionPoints: sub.maxDistributionPoints,
      storageGb: sub.storageGb,
      packageId: sub.packageId,
      createdAt: sub.createdAt.toISOString(),
      updatedAt: sub.updatedAt.toISOString(),
      sppg: sub.sppg,
      package: sub.package
    }))

    return NextResponse.json({
      success: true,
      data: formattedSubscriptions,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit)
      }
    })

  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST /api/superadmin/subscriptions - Create new subscription
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createSubscriptionFormSchema.parse(body)

    // Check if SPPG already has active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        sppgId: validatedData.sppgId,
        status: { in: ['ACTIVE', 'SUSPENDED'] }
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'SPPG already has an active subscription' },
        { status: 400 }
      )
    }

    // Get package details for limits
    const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
      where: { id: validatedData.packageId }
    })

    if (!subscriptionPackage) {
      return NextResponse.json(
        { success: false, error: 'Subscription package not found' },
        { status: 404 }
      )
    }

    // Create subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        sppgId: validatedData.sppgId,
        tier: validatedData.tier,
        status: 'ACTIVE',
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        billingDate: new Date(validatedData.billingDate),
        maxRecipients: subscriptionPackage.maxRecipients,
        maxStaff: subscriptionPackage.maxStaff,
        maxDistributionPoints: subscriptionPackage.maxDistributionPoints,
        storageGb: subscriptionPackage.storageGb,
        packageId: validatedData.packageId
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
      id: newSubscription.id,
      sppgId: newSubscription.sppgId,
      tier: newSubscription.tier,
      status: newSubscription.status,
      startDate: newSubscription.startDate.toISOString(),
      endDate: newSubscription.endDate?.toISOString() || null,
      billingDate: newSubscription.billingDate.toISOString(),
      maxRecipients: newSubscription.maxRecipients,
      maxStaff: newSubscription.maxStaff,
      maxDistributionPoints: newSubscription.maxDistributionPoints,
      storageGb: newSubscription.storageGb,
      packageId: newSubscription.packageId,
      createdAt: newSubscription.createdAt.toISOString(),
      updatedAt: newSubscription.updatedAt.toISOString(),
      sppg: newSubscription.sppg,
      package: newSubscription.package
    }

    return NextResponse.json({
      success: true,
      data: formattedSubscription
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}