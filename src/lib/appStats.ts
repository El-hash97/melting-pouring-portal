import { prisma } from "@/lib/prisma";

export async function incrementOpenCount(id: string): Promise<boolean> {
  try {
    await prisma.application.update({
      where: { id },
      data: { openCount: { increment: 1 } },
    });
    return true;
  } catch {
    return false;
  }
}
