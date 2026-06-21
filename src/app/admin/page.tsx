"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Grid3X3, MessageSquare, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

interface Stats {
  totalApps: number;
  activeApps: number;
  maintenanceApps: number;
  totalReportsThisMonth: number;
  mostPopularApp: { name: string; totalRatings: number } | null;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return value;
}

function KPICard({
  icon,
  label,
  value,
  accentClass,
  pixelColors,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentClass: string;
  pixelColors: string[];
}) {
  const count = useCountUp(value);
  return (
    <div className="relative flex-1 min-w-[130px] overflow-hidden p-[2px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
      <div className="relative flex flex-col gap-3 p-5 w-full h-full border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md overflow-hidden cursor-default">
        <PixelCanvas colors={pixelColors} gap={6} speed={28} noFocus />
        <div className={`absolute top-0 left-0 right-0 h-0.5 z-10 ${accentClass}`} />
        <motion.div
          className="absolute top-[12%] w-[80%] h-[1px] bg-gradient-to-r from-white/20 to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[12%] w-[80%] h-[1px] bg-gradient-to-r from-transparent to-white/20"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 flex items-center gap-2 text-foundry-muted">
          {icon}
          <span className="uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
            {label}
          </span>
        </div>
        <motion.div
          className="relative z-10 font-extrabold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent leading-none"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "38px" }}
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.6)",
              "0 0 2px rgba(255,255,255,0.2)",
              "0 0 10px rgba(255,255,255,0.6)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {count}
        </motion.div>
      </div>
    </div>
  );
}

function PopularCard({ app }: { app: Stats["mostPopularApp"] }) {
  const count = useCountUp(app?.totalRatings ?? 0);
  return (
    <div className="relative flex-1 min-w-[180px] overflow-hidden p-[2px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
      <div className="relative flex flex-col gap-3 p-5 w-full h-full border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md overflow-hidden cursor-default">
        <PixelCanvas colors={["#3b0764", "#6d28d9", "#a78bfa"]} gap={6} speed={28} noFocus />
        <div className="absolute top-0 left-0 right-0 h-0.5 z-10 bg-purple-500" />
        <motion.div
          className="absolute top-[12%] w-[80%] h-[1px] bg-gradient-to-r from-white/20 to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[12%] w-[80%] h-[1px] bg-gradient-to-r from-transparent to-white/20"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 flex items-center gap-2 text-foundry-muted">
          <Trophy className="w-3.5 h-3.5 text-purple-400" />
          <span className="uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
            Terpopuler
          </span>
        </div>
        <div className="relative z-10 flex-1">
          <div
            className="text-foundry-white leading-tight mb-1 line-clamp-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "17px" }}
          >
            {app?.name ?? "—"}
          </div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              className="text-purple-400 font-extrabold"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "22px" }}
              animate={{
                textShadow: [
                  "0 0 8px rgba(167,139,250,0.7)",
                  "0 0 2px rgba(167,139,250,0.2)",
                  "0 0 8px rgba(167,139,250,0.7)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {count}
            </motion.span>
            <span className="text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
              pengguna aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((d) => d && setUsername(d.username));
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const data = stats ?? {
    totalApps: 0,
    activeApps: 0,
    maintenanceApps: 0,
    totalReportsThisMonth: 0,
    mostPopularApp: null,
  };

  return (
    <div className="min-h-screen bg-foundry-black flex">
      <AdminSidebar username={username} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto grid-texture">
        {/* Page header */}
        <div className="relative border-b border-foundry-border px-8 py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-molten/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-8 w-16 h-16 border-r-2 border-t-2 border-molten/15 pointer-events-none" />
          <div className="relative">
            <div
              className="text-molten uppercase tracking-widest mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
            >
              Overview
            </div>
            <h1
              className="text-foundry-white"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "28px" }}
            >
              DASHBOARD
            </h1>
          </div>
        </div>

        <div className="p-8">
          {/* KPI row — same component as portal KPIBar */}
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <KPICard
              icon={<Grid3X3 className="w-3.5 h-3.5" />}
              label="Total Aplikasi"
              value={data.totalApps}
              accentClass="bg-foundry-border"
              pixelColors={["#2E3A55", "#3D4E6B", "#607089"]}
            />
            <KPICard
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-active" />}
              label="Aktif"
              value={data.activeApps}
              accentClass="bg-active"
              pixelColors={["#14532d", "#166534", "#22c55e"]}
            />
            <KPICard
              icon={<AlertTriangle className="w-3.5 h-3.5 text-maintenance" />}
              label="Maintenance"
              value={data.maintenanceApps}
              accentClass="bg-maintenance"
              pixelColors={["#78350f", "#92400e", "#f59e0b"]}
            />
            <KPICard
              icon={<MessageSquare className="w-3.5 h-3.5 text-molten" />}
              label="Laporan Bulan Ini"
              value={data.totalReportsThisMonth}
              accentClass="bg-molten"
              pixelColors={["#7c2d12", "#c2410c", "#FF6B2B"]}
            />
            <PopularCard app={data.mostPopularApp} />
          </motion.div>

          {/* Quick nav */}
          <div
            className="text-foundry-muted uppercase tracking-widest mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
          >
            Menu Cepat
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
          >
            {[
              {
                href: "/admin/apps",
                sublabel: "CRUD",
                label: "Kelola Aplikasi",
                desc: "Tambah, edit, hapus aplikasi dan toggle status aktif/maintenance.",
              },
              {
                href: "/admin/feedbacks",
                sublabel: "REVIEW",
                label: "Feedback Inbox",
                desc: "Review dan resolve laporan masuk dari pengguna portal.",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative block p-5 bg-foundry-slate border border-foundry-border hover:border-molten/40 transition-all duration-200 group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-foundry-border to-transparent group-hover:via-molten/60 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[14px] border-l-transparent border-t-[14px] border-t-foundry-border group-hover:border-t-molten/50 transition-all" />
                <div
                  className="text-foundry-muted uppercase tracking-widest mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px" }}
                >
                  {item.sublabel}
                </div>
                <div
                  className="text-foundry-white group-hover:text-molten transition-colors mb-2"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "16px" }}
                >
                  {item.label}
                </div>
                <p className="text-foundry-muted" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                  {item.desc}
                </p>
              </a>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
