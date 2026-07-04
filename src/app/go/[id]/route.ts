import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { incrementOpenCount } from "@/lib/appStats";

type Params = { params: Promise<{ id: string }> };

// Link yang dibagikan (Copy Link) mengarah ke sini, bukan langsung ke accessLink,
// supaya akses lewat link share ikut tercatat di openCount sebelum redirect.
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const app = await prisma.application.findUnique({
    where: { id },
    select: { accessLink: true },
  });

  if (!app) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await incrementOpenCount(id);

  return NextResponse.redirect(new URL(app.accessLink, req.url));
}
