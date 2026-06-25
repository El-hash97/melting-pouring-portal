import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [apps, feedbacksThisMonth, openAgg] = await Promise.all([
    prisma.application.findMany({
      select: { id: true, name: true, status: true, feedbacks: { select: { rating: true } } },
    }),
    prisma.feedback.count({
      where: {
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.application.aggregate({ _sum: { openCount: true } }),
  ]);

  const activeApps = apps.filter((a) => a.status === "ACTIVE").length;
  const maintenanceApps = apps.filter((a) => a.status === "MAINTENANCE").length;

  const mostPopularApp = apps.length
    ? apps.reduce((best, app) =>
        app.feedbacks.length > best.feedbacks.length ? app : best
      )
    : null;

  return NextResponse.json({
    totalApps: apps.length,
    activeApps,
    maintenanceApps,
    totalReportsThisMonth: feedbacksThisMonth,
    totalOpens: openAgg._sum.openCount ?? 0,
    mostPopularApp: mostPopularApp
      ? { id: mostPopularApp.id, name: mostPopularApp.name, totalRatings: mostPopularApp.feedbacks.length }
      : null,
  });
}
