"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Grid3X3, CheckCircle2, AlertTriangle,
  MessageSquare, Trophy,
} from "lucide-react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { cn } from "@/lib/utils";

interface KPIData {
  totalApps: number;
  activeApps: number;
  maintenanceApps: number;
  totalReportsThisMonth: number;
  mostPopularApp: { id: string; name: string; totalRatings: number } | null;
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
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

// ─── Numeric KPI card ─────────────────────────────────────────────────────────
interface NumCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentClass: string;
  pixelColors: string[];
  className?: string;
}

function NumCard({ icon, label, value, accentClass, pixelColors, className }: NumCardProps) {
  const count = useCountUp(value);

  return (
    <div
      className={cn(
        "relative flex-1 min-w-[130px] rounded-xl overflow-hidden p-[2px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black",
        className
      )}
    >
      {/* Inner Card */}
      <div className="relative flex flex-col gap-3 p-5 w-full h-full rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md overflow-hidden cursor-default">

        {/* Pixel canvas — unchanged from original */}
        <PixelCanvas colors={pixelColors} gap={6} speed={28} noFocus />

        {/* Top accent line */}
        <div className={cn("absolute top-0 left-0 right-0 h-0.5 z-10", accentClass)} />

        {/* Subtle horizontal lines from StatCard */}
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

        {/* Label row */}
        <div className="relative z-10 flex items-center gap-2 text-foundry-muted">
          {icon}
          <span
            className="uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
          >
            {label}
          </span>
        </div>

        {/* Value with glow animation */}
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

// ─── Most Popular card ────────────────────────────────────────────────────────
function PopularCard({ app }: { app: KPIData["mostPopularApp"] }) {
  const count = useCountUp(app?.totalRatings ?? 0);

  return (
    <div className="relative flex-1 min-w-[180px] rounded-xl overflow-hidden p-[2px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
      {/* Inner Card */}
      <div className="relative flex flex-col gap-3 p-5 w-full h-full rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md overflow-hidden cursor-default">

        <PixelCanvas
          colors={["#3b0764", "#6d28d9", "#a78bfa"]}
          gap={6}
          speed={28}
          noFocus
        />

        {/* Purple top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 z-10 bg-purple-500" />

        {/* Subtle lines */}
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

        {/* Label row */}
        <div className="relative z-10 flex items-center gap-2 text-foundry-muted">
          <Trophy className="w-3.5 h-3.5 text-purple-400" />
          <span
            className="uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
          >
            Terpopuler
          </span>
        </div>

        {/* App name + count */}
        <div className="relative z-10 flex-1">
          <div
            className="text-foundry-white leading-tight mb-1 line-clamp-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "0.02em" }}
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
            <span
              className="text-foundry-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
            >
              pengguna aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPIBar ──────────────────────────────────────────────────────────────────
export default function KPIBar() {
  const [kpi, setKpi] = useState<KPIData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setKpi);
  }, []);

  const data = kpi ?? { totalApps: 0, activeApps: 0, maintenanceApps: 0, totalReportsThisMonth: 0, mostPopularApp: null };

  return (
    <section className="relative z-[1] bg-foundry-dark border-y border-foundry-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4">
          <NumCard
            icon={<Grid3X3 className="w-3.5 h-3.5" />}
            label="Total Aplikasi"
            value={data.totalApps}
            accentClass="bg-foundry-border"
            pixelColors={["#2E3A55", "#3D4E6B", "#607089"]}
          />
          <NumCard
            icon={<CheckCircle2 className="w-3.5 h-3.5 text-active" />}
            label="Aktif"
            value={data.activeApps}
            accentClass="bg-active"
            pixelColors={["#14532d", "#166534", "#22c55e"]}
          />
          <NumCard
            icon={<AlertTriangle className="w-3.5 h-3.5 text-maintenance" />}
            label="Maintenance"
            value={data.maintenanceApps}
            accentClass="bg-maintenance"
            pixelColors={["#78350f", "#92400e", "#f59e0b"]}
          />
          <NumCard
            icon={<MessageSquare className="w-3.5 h-3.5 text-molten" />}
            label="Laporan Bulan Ini"
            value={data.totalReportsThisMonth}
            accentClass="bg-molten"
            pixelColors={["#7c2d12", "#c2410c", "#FF6B2B"]}
          />
          <PopularCard app={data.mostPopularApp} />
        </div>
      </div>
    </section>
  );
}
