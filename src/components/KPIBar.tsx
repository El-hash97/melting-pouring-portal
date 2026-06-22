"use client";

import { useEffect, useRef, useState } from "react";
import {
  Grid3X3, CheckCircle2, AlertTriangle,
  MessageSquare, Trophy, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  valueClass: string;
  subtitle?: string;
  subtitleClass?: string;
}

function NumCard({ icon, label, value, valueClass, subtitle, subtitleClass }: NumCardProps) {
  const count = useCountUp(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold font-mono", valueClass)}>
          {count}
        </div>
        {subtitle && (
          <div className={cn("flex items-center pt-1 text-xs", subtitleClass)}>
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>{subtitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Most Popular card ────────────────────────────────────────────────────────
function PopularCard({ app }: { app: KPIData["mostPopularApp"] }) {
  const count = useCountUp(app?.totalRatings ?? 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Terpopuler</CardTitle>
        <Trophy className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-base font-bold text-foundry-white truncate mb-1">
          {app?.name ?? "—"}
        </div>
        <div className="flex items-center pt-1 text-xs text-purple-400">
          <ArrowUpRight className="mr-1 h-3 w-3" />
          <span className="font-mono font-bold">{count}</span>
          <span className="ml-1 text-foundry-muted">pengguna aktif</span>
        </div>
      </CardContent>
    </Card>
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

  const data = kpi ?? {
    totalApps: 0,
    activeApps: 0,
    maintenanceApps: 0,
    totalReportsThisMonth: 0,
    mostPopularApp: null,
  };

  return (
    <section className="relative z-[1] bg-foundry-dark border-y border-foundry-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <NumCard
            icon={<Grid3X3 className="h-4 w-4 text-foundry-muted" />}
            label="Total Aplikasi"
            value={data.totalApps}
            valueClass="text-foundry-white"
          />
          <NumCard
            icon={<CheckCircle2 className="h-4 w-4 text-active" />}
            label="Aktif"
            value={data.activeApps}
            valueClass="text-active"
            subtitle="sedang berjalan"
            subtitleClass="text-active/80"
          />
          <NumCard
            icon={<AlertTriangle className="h-4 w-4 text-maintenance" />}
            label="Maintenance"
            value={data.maintenanceApps}
            valueClass="text-maintenance"
            subtitle="dalam perbaikan"
            subtitleClass="text-maintenance/80"
          />
          <NumCard
            icon={<MessageSquare className="h-4 w-4 text-molten" />}
            label="Laporan Bulan Ini"
            value={data.totalReportsThisMonth}
            valueClass="text-molten"
            subtitle="laporan masuk"
            subtitleClass="text-molten/80"
          />
          <PopularCard app={data.mostPopularApp} />
        </div>
      </div>
    </section>
  );
}
