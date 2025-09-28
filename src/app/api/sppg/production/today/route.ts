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

    // Get today's production data
    const [
      todayOperation,
      totalStaff,
      staffPresent
    ] = await Promise.all([
      // Today's daily operation with productions
      prisma.dailyOperation.findFirst({
        where: {
          sppgId,
          date: today
        },
        include: {
          productions: {
            include: {
              menu: { select: { name: true } }
            }
          }
        }
      }),
      
      // Total staff
      prisma.staff.count({
        where: { 
          sppgId,
          isActive: true 
        }
      }),
      
      // Staff present (mock - would come from attendance system)
      prisma.staff.count({
        where: { 
          sppgId,
          isActive: true 
        }
      }).then(total => Math.floor(total * 0.85)) // 85% attendance
    ])

    if (!todayOperation) {
      return NextResponse.json({ 
        success: true, 
        data: null 
      })
    }

    // Transform production data
    const transformedProductions = todayOperation.productions.map(prod => ({
      id: prod.id,
      date: prod.createdAt.toISOString(),
      menuName: prod.menu.name,
      batchCount: prod.batchCount,
      servingsPerBatch: prod.servingsPerBatch,
      totalServings: prod.totalServings,
      status: prod.status,
      startTime: prod.startTime?.toISOString(),
      endTime: prod.endTime?.toISOString(),
      qualityCheck: prod.qualityCheck,
      notes: prod.notes,
      assignedStaff: [] // Would come from staff assignment table
    }))

    const result = {
      operation: {
        id: todayOperation.id,
        date: todayOperation.date.toISOString(),
        plannedPortions: todayOperation.plannedPortions,
        producedPortions: todayOperation.producedPortions,
        status: todayOperation.status,
        weather: todayOperation.weather
      },
      productions: transformedProductions,
      staffPresent,
      totalStaff
    }

    return NextResponse.json({ 
      success: true, 
      data: result 
    })

  } catch (error) {
    console.error('Error fetching today production:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch today production' },
      { status: 500 }
    )
  }
}