import { NextRequest, NextResponse } from "next/server";
import { incrementOpenCount } from "@/lib/appStats";

type Params = { params: Promise<{ id: string }> };

// Publik: dipanggil saat operator membuka aplikasi dari portal.
// Fire-and-forget — mencatat satu "open" lalu balas 204.
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await incrementOpenCount(id);
  if (!ok) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
