import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  try {
    const category = await prisma.category.create({ data: { name: name.trim() } });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isDupe = msg.includes("Unique constraint");
    return NextResponse.json(
      { error: isDupe ? "Kategori sudah ada" : `DB error: ${msg}` },
      { status: isDupe ? 409 : 500 }
    );
  }
}
