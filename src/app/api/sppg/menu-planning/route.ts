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

    // Get menu planning data for this SPPG
    const menuPlannings = await prisma.menuPlanning.findMany({
      where: { sppgId },
      include: {
        details: {
          include: {
            menu: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { weekNumber: 'desc' }
      ]
    })

    // Transform the data
    const transformedPlannings = menuPlannings.map(planning => ({
      id: planning.id,
      weekNumber: planning.weekNumber,
      month: planning.month,
      year: planning.year,
      status: planning.status,
      targetCalories: planning.targetCalories,
      targetProtein: planning.targetProtein,
      budgetPerServing: planning.budgetPerServing,
      specialNotes: planning.specialNotes,
      approvedBy: planning.approvedBy,
      approvalDate: planning.approvalDate?.toISOString(),
      details: planning.details.map(detail => ({
        id: detail.id,
        dayOfWeek: detail.dayOfWeek,
        mealType: detail.mealType,
        menuName: detail.menu.name,
        servingCount: detail.servingCount
      }))
    }))

    return NextResponse.json({ 
      success: true, 
      data: transformedPlannings 
    })

  } catch (error) {
    console.error('Error fetching menu planning:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu planning' },
      { status: 500 }
    )
  }
}