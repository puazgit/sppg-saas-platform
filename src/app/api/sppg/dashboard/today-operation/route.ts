import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
// TODO: Create proper today operation schema
// import { sppgTodayOperationSchema } from '@/features/superadmin'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SPPG_USER' || !session.user.sppgId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const sppgId = session.user.sppgId
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's operation data
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
            menu: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!todayOperation) {
      // Return empty operation if not found
      const emptyOperation = {
        id: '',
        date: today.toISOString(),
        status: 'PLANNED' as const,
        plannedPortions: 0,
        producedPortions: 0,
        distributedPortions: 0,
        staffPresent: 0,
        productions: [],
        distributions: []
      }

      return NextResponse.json(emptyOperation)
    }

    // Transform production data
    const productions = todayOperation.productions.map(production => ({
      id: production.id,
      menuName: production.menu.name,
      batchCount: production.batchCount,
      servingsPerBatch: production.servingsPerBatch,
      totalServings: production.totalServings,
      startTime: production.startTime?.toISOString() || '',
      endTime: production.endTime?.toISOString() || ''
    }))

    // Transform distribution data  
    const distributions = todayOperation.distributions.map(distribution => ({
      id: distribution.id,
      menuName: distribution.menu.name,
      plannedQuantity: distribution.plannedQuantity,
      deliveredQuantity: distribution.deliveredQuantity,
      status: distribution.status,
      departureTime: distribution.departureTime?.toISOString() || '',
      arrivalTime: distribution.arrivalTime?.toISOString() || ''
    }))

    // Format response
    const operationData = {
      id: todayOperation.id,
      date: todayOperation.date.toISOString(),
      status: todayOperation.status,
      plannedPortions: todayOperation.plannedPortions,
      producedPortions: todayOperation.producedPortions,
      distributedPortions: todayOperation.distributedPortions,
      staffPresent: todayOperation.staffPresent,
      productions,
      distributions
    }

    return NextResponse.json(operationData)

  } catch (error) {
    console.error('SPPG Today Operation API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}