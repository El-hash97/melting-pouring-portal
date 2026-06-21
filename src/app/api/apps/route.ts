import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      feedbacks: { select: { rating: true } },
    },
  });

  const result = apps.map((app) => {
    const ratings = app.feedbacks.map((f) => f.rating);
    const averageRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
    return {
      id: app.id,
      name: app.name,
      description: app.description,
      logoIcon: app.logoIcon,
      accessLink: app.accessLink,
      status: app.status,
      category: app.category,
      averageRating,
      totalRatings: ratings.length,
      createdAt: app.createdAt,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, logoIcon, accessLink, status, category } = body;

  if (!name || !description || !accessLink) {
    return NextResponse.json({ error: "name, description, accessLink wajib diisi" }, { status: 400 });
  }

  const app = await prisma.application.create({
    data: { name, description, logoIcon: logoIcon ?? "flame", accessLink, status: status ?? "ACTIVE", category: category ?? "General" },
  });

  return NextResponse.json(app, { status: 201 });
}
