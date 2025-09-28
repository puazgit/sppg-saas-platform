import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SPPG_USER') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const sppgId = session.user.sppgId
    if (!sppgId) {
      return NextResponse.json(
        { success: false, error: 'SPPG ID not found' }, 
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's operation data
    const [
      todayOperation,
      staffCount,
      staffPresent,
      inventoryStats,
      distributionStats
    ] = await Promise.all([
      // Today's daily operation
      prisma.dailyOperation.findFirst({
        where: {
          sppgId,
          date: today
        }
      }),
      
      // Total staff count
      prisma.staff.count({
        where: { 
          sppgId,
          status: 'ACTIVE'
        }
      }),
      
      // Staff present today (mock - would be from attendance system)
      prisma.staff.count({
        where: { 
          sppgId,
          status: 'ACTIVE'
        }
      }).then(total => Math.floor(total * 0.85)), // 85% attendance rate
      
      // Inventory statistics
      prisma.ingredient.aggregate({
        where: { sppgId },
        _count: { id: true },
        _sum: { currentStock: true }
      }).then(async (result) => {
        const lowStock = await prisma.ingredient.count({
          where: {
            sppgId,
            currentStock: { lte: 10 } // Low stock threshold
          }
        })
        
        // Note: expiringSoon would need expiry tracking in schema
        const expiringSoon = 0 // Placeholder until expiry date field is added
        
        return {
          totalItems: result._count.id || 0,
          lowStock,
          expiringSoon,
          status: lowStock > 5 ? 'critical' : lowStock > 2 ? 'warning' : 'good'
        }
      }),
      
      // Distribution statistics for today
      prisma.distribution.count({
        where: {
          operation: {
            sppgId,
            date: today
          }
        }
      })
    ])

    // Calculate metrics
    const plannedPortions = todayOperation?.plannedPortions || 0
    const producedPortions = todayOperation?.producedPortions || 0
    const distributedPortions = todayOperation?.distributedPortions || 0

    const productionPercentage = plannedPortions > 0 ? 
      Math.round((producedPortions / plannedPortions) * 100) : 0
      
    const distributionPercentage = producedPortions > 0 ? 
      Math.round((distributedPortions / producedPortions) * 100) : 0

    const staffPercentage = staffCount > 0 ? 
      Math.round((staffPresent / staffCount) * 100) : 0

    // Determine statuses
    const getProductionStatus = () => {
      if (productionPercentage >= 100) return 'completed'
      if (productionPercentage >= 80) return 'on_track'
      return 'behind'
    }

    const getDistributionStatus = () => {
      if (distributionPercentage >= 100) return 'completed'
      if (distributionPercentage >= 80) return 'on_track'
      return 'behind'
    }

    const getStaffStatus = () => {
      if (staffPercentage >= 90) return 'good'
      if (staffPercentage >= 70) return 'warning'
      return 'critical'
    }

    const metrics = {
      todayProduction: {
        planned: plannedPortions,
        produced: producedPortions,
        percentage: productionPercentage,
        status: getProductionStatus()
      },
      todayDistribution: {
        scheduled: Math.max(producedPortions, distributionStats),
        completed: distributedPortions,
        percentage: distributionPercentage,
        status: getDistributionStatus()
      },
      inventory: inventoryStats,
      staff: {
        present: staffPresent,
        total: staffCount,
        percentage: staffPercentage,
        status: getStaffStatus()
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: metrics 
    })

  } catch (error) {
    console.error('Error fetching SPPG dashboard metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}