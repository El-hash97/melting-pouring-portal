import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { isResolved } = await req.json();

  const feedback = await prisma.feedback.update({
    where: { id },
    data: { isResolved: Boolean(isResolved) },
  });

  return NextResponse.json(feedback);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.feedback.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
