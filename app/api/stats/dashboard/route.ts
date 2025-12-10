import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// GET /api/stats/dashboard
export async function GET() {
  try {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Start and end of current month
    const monthStart = new Date(thisYear, thisMonth, 1);
    const monthEnd = new Date(thisYear, thisMonth + 1, 0, 23, 59, 59);

    // Start and end of last month
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59);

    // Fetch all stats in parallel
    const [
      potentialTotal,
      potentialThisMonth,
      potentialLastMonth,
      closedTotal,
      closedThisMonth,
      closedLastMonth,
      regularTotal,
      regularThisMonth,
      regularLastMonth,
      promisingTotal,
      promisingThisMonth,
      promisingLastMonth,
    ] = await Promise.all([
      // Potential category
      prisma.customer.count({ where: { category: "potential" } }),
      prisma.customer.count({
        where: {
          category: "potential",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.customer.count({
        where: {
          category: "potential",
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      // Closed category
      prisma.customer.count({ where: { category: "closed" } }),
      prisma.customer.count({
        where: {
          category: "closed",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.customer.count({
        where: {
          category: "closed",
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      // Regular category
      prisma.customer.count({ where: { category: "regular" } }),
      prisma.customer.count({
        where: {
          category: "regular",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.customer.count({
        where: {
          category: "regular",
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      // Promising category
      prisma.customer.count({ where: { category: "promising" } }),
      prisma.customer.count({
        where: {
          category: "promising",
          createdAt: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.customer.count({
        where: {
          category: "promising",
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
    ]);

    // Calculate growth rates
    const calculateGrowthRate = (
      thisMonth: number,
      lastMonth: number
    ): string => {
      // No data in both months
      if (lastMonth === 0 && thisMonth === 0) {
        return "0%";
      }
      // New data this month (from zero)
      if (lastMonth === 0 && thisMonth > 0) {
        return "+100%";
      }
      // Normal calculation
      const rate = (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1);
      const numRate = parseFloat(rate);
      if (numRate > 0) {
        return "+" + rate + "%";
      } else if (numRate < 0) {
        return rate + "%";
      }
      return "0%";
    };

    return NextResponse.json({
      potential: {
        total: potentialTotal,
        thisMonth: potentialThisMonth,
        lastMonth: potentialLastMonth,
        growth: calculateGrowthRate(potentialThisMonth, potentialLastMonth),
      },
      closed: {
        total: closedTotal,
        thisMonth: closedThisMonth,
        lastMonth: closedLastMonth,
        growth: calculateGrowthRate(closedThisMonth, closedLastMonth),
      },
      regular: {
        total: regularTotal,
        thisMonth: regularThisMonth,
        lastMonth: regularLastMonth,
        growth: calculateGrowthRate(regularThisMonth, regularLastMonth),
      },
      promising: {
        total: promisingTotal,
        thisMonth: promisingThisMonth,
        lastMonth: promisingLastMonth,
        growth: calculateGrowthRate(promisingThisMonth, promisingLastMonth),
      },
      totalCustomers:
        potentialTotal + closedTotal + regularTotal + promisingTotal,
      totalPlaceholders: 0, // Will be calculated if needed
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
