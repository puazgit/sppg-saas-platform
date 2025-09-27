import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      sppgCount, 
      provinceCount, 
      totalStudents, 
      totalMealsDistributed,
      avgSatisfactionRating,
      complianceScore,
      activeSchools,
      kitchenFacilities
    ] = await Promise.all([
      prisma.sPPG.count({ where: { status: 'ACTIVE' } }),
      prisma.sPPG.groupBy({
        by: ['provinceId'],
        where: { status: 'ACTIVE' }
      }).then(groups => groups.length),
      prisma.school.aggregate({
        _sum: { totalStudents: true }
      }).then(result => result._sum.totalStudents || 0),
      prisma.dailyOperation.aggregate({
        _sum: { distributedPortions: true }
      }).then(result => result._sum.distributedPortions || 0),
      prisma.schoolFeedback.aggregate({
        _avg: { rating: true }
      }).then(result => Math.round((result._avg.rating || 0) * 10) / 10),
      prisma.qualityAssuranceCheck.aggregate({
        _avg: { score: true }
      }).then(result => Math.round(result._avg.score || 0)),
      prisma.school.count({ where: { status: 'ACTIVE' } }),
      prisma.school.count({ where: { kitchenFacility: true } })
    ])

    const stats = {
      sppgActive: sppgCount,
      provinces: provinceCount,
      totalStudents: totalStudents,
      studentsServed: totalStudents,
      mealsDistributed: totalMealsDistributed,
      satisfactionRate: avgSatisfactionRating,
      complianceScore: complianceScore,
      activeSchools: activeSchools,
      kitchenFacilities: kitchenFacilities,
      // Calculated metrics
      avgMealsPerStudent: totalStudents > 0 ? Math.round(totalMealsDistributed / totalStudents) : 0,
      facilityCoverage: activeSchools > 0 ? Math.round((kitchenFacilities / activeSchools) * 100) : 0
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}