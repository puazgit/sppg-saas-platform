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

    // Get today's operation with related data
    const todayOperation = await prisma.dailyOperation.findFirst({
      where: {
        sppgId,
        date: today
      },
      include: {
        productions: {
          include: {
            menu: {
              select: {
                name: true
              }
            }
          }
        },
        distributions: {
          include: {
            distributionPoint: {
              select: {
                name: true
              }
            }
          }
        },
        supervisor: {
          select: {
            name: true
          }
        }
      }
    })

    if (!todayOperation) {
      return NextResponse.json({ 
        success: true, 
        data: null 
      })
    }

    // Transform the data for frontend consumption
    const transformedOperation = {
      id: todayOperation.id,
      date: todayOperation.date.toISOString(),
      status: todayOperation.status,
      plannedPortions: todayOperation.plannedPortions,
      producedPortions: todayOperation.producedPortions,
      distributedPortions: todayOperation.distributedPortions,
      staffPresent: todayOperation.staffPresent,
      menusServed: todayOperation.menusServed,
      weather: todayOperation.weather,
      notes: todayOperation.notes,
      productions: todayOperation.productions.map(prod => ({
        id: prod.id,
        menuName: prod.menu.name,
        batchCount: prod.batchCount,
        totalServings: prod.totalServings,
        status: prod.status,
        startTime: prod.startTime?.toISOString(),
        endTime: prod.endTime?.toISOString()
      })),
      distributions: todayOperation.distributions.map(dist => ({
        id: dist.id,
        distributionPointName: dist.distributionPoint.name,
        scheduledTime: dist.scheduledTime.toISOString(),
        actualTime: dist.actualTime?.toISOString(),
        portionsDelivered: dist.portionsDelivered,
        status: dist.status
      }))
    }

    return NextResponse.json({ 
      success: true, 
      data: transformedOperation 
    })

  } catch (error) {
    console.error('Error fetching today operations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch today operations' },
      { status: 500 }
    )
  }
}