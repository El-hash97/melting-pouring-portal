import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const appId = searchParams.get("appId");

  const feedbacks = await prisma.feedback.findMany({
    where: appId ? { appId } : undefined,
    include: { app: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(feedbacks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { appId, rating, message } = body;

  if (!appId || !rating || !message?.trim()) {
    return NextResponse.json({ error: "appId, rating, dan message wajib diisi" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating harus antara 1-5" }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: { appId, rating: Number(rating), message: message.trim() },
  });

  return NextResponse.json(feedback, { status: 201 });
}
