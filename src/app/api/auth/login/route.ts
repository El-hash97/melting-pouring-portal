import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, username: user.username });
  await setSessionCookie(token);

  return NextResponse.json({ username: user.username });
}
