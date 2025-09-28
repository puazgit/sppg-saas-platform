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

    // Get today's distribution data
    const [
      todayOperation,
      todayDistributions,
      availableVehicles,
      availableDrivers
    ] = await Promise.all([
      // Today's daily operation
      prisma.dailyOperation.findFirst({
        where: {
          sppgId,
          date: today
        }
      }),
      
      // Today's distributions
      prisma.distribution.findMany({
        where: {
          sppgId,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        include: {
          distributionPoint: {
            select: {
              name: true,
              address: true,
              contactPerson: true
            }
          }
        }
      }),
      
      // Available vehicles (mock data)
      3,
      
      // Available drivers (from staff with driver role)
      prisma.staff.count({
        where: {
          sppgId,
          role: 'DRIVER',
          isActive: true
        }
      })
    ])

    if (!todayOperation) {
      return NextResponse.json({ 
        success: true, 
        data: null 
      })
    }

    // Transform distribution data
    const transformedDistributions = todayDistributions.map(dist => ({
      id: dist.id,
      date: dist.createdAt.toISOString(),
      distributionPointName: dist.distributionPoint.name,
      address: dist.distributionPoint.address,
      contactPerson: dist.distributionPoint.contactPerson,
      scheduledTime: dist.scheduledTime.toISOString(),
      actualTime: dist.actualTime?.toISOString(),
      portionsDelivered: dist.portionsDelivered,
      portionsPlanned: dist.portionsPlanned,
      status: dist.status,
      driverName: dist.driverName,
      vehicleInfo: dist.vehicleInfo,
      notes: dist.notes,
      temperature: dist.temperature
    }))

    const result = {
      operation: {
        id: todayOperation.id,
        date: todayOperation.date.toISOString(),
        totalPlanned: todayOperation.plannedPortions,
        totalDelivered: todayOperation.distributedPortions,
        status: todayOperation.status
      },
      distributions: transformedDistributions,
      availableVehicles,
      availableDrivers
    }

    return NextResponse.json({ 
      success: true, 
      data: result 
    })

  } catch (error) {
    console.error('Error fetching today distribution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch today distribution' },
      { status: 500 }
    )
  }
}