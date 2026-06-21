import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (status !== "ACTIVE" && status !== "MAINTENANCE") {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const app = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(app);
}
