/**
 * API Route: Billing Dashboard Metrics
 * GET /api/billing/dashboard/metrics
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalRevenue,
      activeSubscriptions,
      pendingInvoices,
      monthlyRecurring
    ] = await Promise.all([
      // Total revenue from completed invoices
      prisma.invoice.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }).then(result => result._sum?.totalAmount || 0),

      // Active subscriptions count
      prisma.subscription.count({
        where: { 
          status: 'ACTIVE',
          endDate: { gt: new Date() }
        }
      }),

      // Pending invoices count
      prisma.invoice.count({
        where: { 
          status: 'PENDING',
          dueDate: { gte: new Date() }
        }
      }),

      // Monthly recurring revenue calculation from packages
      prisma.subscription.findMany({
        where: { 
          status: 'ACTIVE',
          endDate: { gt: new Date() }
        },
        include: {
          package: {
            select: { monthlyPrice: true }
          }
        }
      }).then(subscriptions => 
        subscriptions.reduce((total, sub) => 
          total + (sub.package?.monthlyPrice || 0), 0
        )
      )
    ])

    // Calculate churn rate (simplified calculation)
    const [totalSubscriptionsLastMonth, totalSubscriptionsThisMonth] = await Promise.all([
      prisma.subscription.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.subscription.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    const churnRate = totalSubscriptionsLastMonth > 0 
      ? ((totalSubscriptionsLastMonth - totalSubscriptionsThisMonth) / totalSubscriptionsLastMonth) * 100
      : 0

    // Calculate average revenue per user
    const avgRevenuePerUser = activeSubscriptions > 0 
      ? totalRevenue / activeSubscriptions 
      : 0

    const metrics = {
      totalRevenue,
      activeSubscriptions,
      pendingInvoices,
      monthlyRecurring,
      churnRate: Math.max(0, churnRate),
      avgRevenuePerUser
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}