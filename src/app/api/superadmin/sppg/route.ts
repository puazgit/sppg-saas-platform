import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const includeStats = searchParams.get('includeStats') === 'true'
    const statsOnly = searchParams.get('statsOnly') === 'true'
    
    const skip = (page - 1) * limit
    
    // Build enterprise-grade where clause with proper typing
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        address?: { contains: string; mode: 'insensitive' }
        picName?: { contains: string; mode: 'insensitive' }
        picEmail?: { contains: string; mode: 'insensitive' }
      }>
      status?: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'TERMINATED' | 'INACTIVE'
    } = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { picName: { contains: search, mode: 'insensitive' } },
        { picEmail: { contains: search, mode: 'insensitive' } }
      ]
    }

    // If only stats requested, return lightweight stats
    if (statsOnly) {
      const [totalCount, statusCounts, typeCounts, totalBeneficiaries] = await Promise.all([
        prisma.sPPG.count({ where }),
        prisma.sPPG.groupBy({
          by: ['status'],
          _count: { status: true },
          where
        }),
        prisma.sPPG.groupBy({
          by: ['organizationType'],
          _count: { organizationType: true },
          where
        }),
        prisma.sPPG.aggregate({
          _sum: { targetRecipients: true },
          where
        })
      ])

      const stats = {
        total: totalCount,
        active: statusCounts.find(s => s.status === 'ACTIVE')?._count.status || 0,
        inactive: statusCounts.find(s => s.status === 'INACTIVE')?._count.status || 0,
        pending: statusCounts.find(s => s.status === 'PENDING_APPROVAL')?._count.status || 0,
        suspended: statusCounts.find(s => s.status === 'SUSPENDED')?._count.status || 0,
        totalBeneficiaries: totalBeneficiaries._sum.targetRecipients || 0,
        totalMonthlyBudget: 0, // Can be calculated if needed
        byType: {
          government: typeCounts.find(t => t.organizationType === 'PEMERINTAH')?._count.organizationType || 0,
          ngo: typeCounts.find(t => t.organizationType === 'YAYASAN')?._count.organizationType || 0,
          private: typeCounts.find(t => t.organizationType === 'SWASTA')?._count.organizationType || 0
        },
        byProvince: [] // Can be populated if needed
      }

      return NextResponse.json({
        success: true,
        data: { stats }
      })
    }
    
    // Get SPPGs with comprehensive enterprise data
    const [sppgs, totalCount] = await Promise.all([
      prisma.sPPG.findMany({
        where,
        skip,
        take: limit,
        include: {
          province: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          regency: {
            select: {
              id: true,
              name: true
            }
          },
          district: {
            select: {
              id: true,
              name: true
            }
          },
          subscription: {
            include: {
              package: {
                select: {
                  tier: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              users: true,
              distributionPoints: true,
              menus: true,
              ingredients: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ]
      }),
      
      prisma.sPPG.count({ where })
    ])
    
    // Calculate enterprise-grade performance metrics for each SPPG
    const sppgsWithMetrics = await Promise.all(
      sppgs.map(async (sppg) => {
        // Get current month's operational metrics
        const currentMonth = new Date()
        currentMonth.setDate(1)
        currentMonth.setHours(0, 0, 0, 0)
        
        const nextMonth = new Date(currentMonth)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        
        const [
          monthlyMenus,
          monthlyDistributions,
          lastActivity,
          nutritionalCompliance,
          inventoryTurnover
        ] = await Promise.all([
          // Menu planning efficiency
          prisma.menu.count({
            where: {
              sppgId: sppg.id,
              createdAt: {
                gte: currentMonth,
                lt: nextMonth
              }
            }
          }),
          
          // Distribution performance
          prisma.distributionPoint.count({
            where: {
              sppgId: sppg.id,
              isActive: true,
              createdAt: {
                gte: currentMonth,
                lt: nextMonth
              }
            }
          }),
          
          // User engagement tracking
          prisma.user.findFirst({
            where: {
              sppgId: sppg.id
            },
            select: {
              lastLogin: true
            },
            orderBy: {
              lastLogin: 'desc'
            }
          }),
          
          // Nutritional compliance rate
          prisma.menu.count({
            where: {
              sppgId: sppg.id,
              isActive: true,
              createdAt: {
                gte: currentMonth,
                lt: nextMonth
              }
            }
          }),
          
          // Inventory management efficiency
          prisma.ingredient.count({
            where: {
              sppgId: sppg.id,
              updatedAt: {
                gte: currentMonth,
                lt: nextMonth
              }
            }
          })
        ])
        
        // Calculate performance score (enterprise KPI)
        const performanceScore = Math.round(
          (monthlyMenus * 0.3) + 
          (monthlyDistributions * 0.4) + 
          (nutritionalCompliance * 0.2) + 
          (inventoryTurnover * 0.1)
        )
        
        return {
          ...sppg,
          metrics: {
            monthlyMenus,
            monthlyDistributions,
            nutritionalCompliance,
            inventoryTurnover,
            performanceScore,
            lastActivity: lastActivity?.lastLogin || null
          }
        }
      })
    )
    
    const totalPages = Math.ceil(totalCount / limit)
    
    // Prepare response data
    const responseData: Record<string, unknown> = {
      sppgs: sppgsWithMetrics,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }

    // Include stats if requested
    if (includeStats) {
      const [statusCounts, typeCounts, totalBeneficiaries] = await Promise.all([
        prisma.sPPG.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.sPPG.groupBy({
          by: ['organizationType'],
          _count: { organizationType: true }
        }),
        prisma.sPPG.aggregate({
          _sum: { targetRecipients: true }
        })
      ])

      responseData.stats = {
        total: totalCount,
        active: statusCounts.find(s => s.status === 'ACTIVE')?._count.status || 0,
        inactive: statusCounts.find(s => s.status === 'INACTIVE')?._count.status || 0,
        pending: statusCounts.find(s => s.status === 'PENDING_APPROVAL')?._count.status || 0,
        suspended: statusCounts.find(s => s.status === 'SUSPENDED')?._count.status || 0,
        totalBeneficiaries: totalBeneficiaries._sum.targetRecipients || 0,
        totalMonthlyBudget: 0,
        byType: {
          government: typeCounts.find(t => t.organizationType === 'PEMERINTAH')?._count.organizationType || 0,
          ngo: typeCounts.find(t => t.organizationType === 'YAYASAN')?._count.organizationType || 0,
          private: typeCounts.find(t => t.organizationType === 'SWASTA')?._count.organizationType || 0
        },
        byProvince: []
      }
    }
    
    return NextResponse.json({
      success: true,
      data: responseData
    })
    
  } catch (error) {
    console.error('Error fetching SPPGs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch SPPGs data' 
      },
      { status: 500 }
    )
  }
}