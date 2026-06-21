import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash: hash },
    create: { username, passwordHash: hash },
  });

  const apps = [
    { name: "Smart Pouring Log System", description: "Pencatatan digital parameter penuangan logam cair — temperatur, waktu, dan lot number — secara real-time untuk setiap heat.", logoIcon: "flame", accessLink: "#", status: "ACTIVE" as const, category: "Pouring" },
    { name: "Trial Flow Monitor", description: "Monitoring aliran proses trial produksi baru dari melting hingga quality check, dengan notifikasi deviasi otomatis.", logoIcon: "activity", accessLink: "#", status: "ACTIVE" as const, category: "Monitoring" },
    { name: "IdeaVault", description: "Platform pengumpulan dan tracking ide perbaikan (Kaizen) dari operator floor. Dilengkapi sistem voting dan status implementasi.", logoIcon: "lightbulb", accessLink: "#", status: "MAINTENANCE" as const, category: "Improvement" },
    { name: "Mold Temp Tracker", description: "Pencatatan dan visualisasi grafis temperatur cetakan (mold) secara berkala untuk menjaga konsistensi kualitas casting.", logoIcon: "thermometer", accessLink: "#", status: "ACTIVE" as const, category: "Quality" },
    { name: "Production Counter", description: "Pencacah produksi harian per shift dan per line, dengan target vs actual dan laporan otomatis ke supervisor.", logoIcon: "bar-chart-2", accessLink: "#", status: "ACTIVE" as const, category: "Production" },
    { name: "Defect Reporter", description: "Pelaporan cacat casting (shrinkage, cold shut, misrun) dengan foto dan klasifikasi untuk analisis root cause.", logoIcon: "shield-alert", accessLink: "#", status: "ACTIVE" as const, category: "Quality" },
  ];

  for (const app of apps) {
    await prisma.application.create({ data: app }).catch(() => {});
  }

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
