import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// Publik: dipanggil saat operator membuka aplikasi dari portal.
// Fire-and-forget — mencatat satu "open" lalu balas 204.
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.application.update({
      where: { id },
      data: { openCount: { increment: 1 } },
    });
  } catch {
    // id tidak ada / sudah dihapus — abaikan, jangan ganggu navigasi user.
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
