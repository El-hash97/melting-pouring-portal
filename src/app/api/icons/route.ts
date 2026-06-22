import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const icons = await prisma.iconOption.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(icons);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  try {
    const icon = await prisma.iconOption.create({ data: { name: name.trim().toLowerCase() } });
    return NextResponse.json(icon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Icon sudah ada" }, { status: 409 });
  }
}
