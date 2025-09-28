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
      // Count SPPG operasional (termasuk PENDING_APPROVAL)
      prisma.sPPG.count({ 
        where: { status: { in: ['ACTIVE', 'PENDING_APPROVAL'] } } 
      }),
      // Province coverage dari SPPG operasional  
      prisma.sPPG.groupBy({
        by: ['provinceId'],
        where: { status: { in: ['ACTIVE', 'PENDING_APPROVAL'] } }
      }).then(groups => groups.length),
      // Total dari Student table yang aktif
      prisma.student.count({ where: { isActive: true } }),
      // Total dari daily operations
      prisma.dailyOperation.aggregate({
        _sum: { distributedPortions: true }
      }).then(result => result._sum.distributedPortions || 0),
      // Rating dari school feedback
      prisma.schoolFeedback.aggregate({
        _avg: { rating: true }
      }).then(result => Math.round((result._avg.rating || 4.5) * 10) / 10),
      // Compliance dari quality checks
      prisma.qualityAssuranceCheck.aggregate({
        _avg: { score: true }
      }).then(result => Math.round(result._avg.score || 90)),
      // Sekolah operasional
      prisma.school.count({ 
        where: { status: { in: ['ACTIVE', 'PENDING_APPROVAL'] } } 
      }),
      // Fasilitas dapur yang aktif
      prisma.school.count({ 
        where: { 
          kitchenFacility: true,
          status: { in: ['ACTIVE', 'PENDING_APPROVAL'] }
        } 
      })
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