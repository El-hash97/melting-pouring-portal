"use client";

import { useState } from "react";
import {
  Flame, Star, ExternalLink, Eye,
  MessageSquarePlus, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppItem } from "@/lib/mockData";
import { GridPattern, genSeededPattern } from "@/components/ui/grid-feature-cards";
import FeedbackModal from "@/components/FeedbackModal";
import { ICON_MAP } from "@/lib/iconMap";

interface Props {
  app: AppItem;
}

export default function AppCard({ app }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [opens, setOpens] = useState(app.openCount ?? 0);
  const Icon = ICON_MAP[app.logoIcon] ?? Flame;
  const isMaintenance = app.status === "MAINTENANCE";
  const pattern = genSeededPattern(parseInt(app.id, 10) * 31, 6);

  // Catat satu "open" (fire-and-forget) lalu naikkan angka seketika.
  function handleOpen() {
    navigator.sendBeacon?.(`/api/apps/${app.id}/open`);
    setOpens((c) => c + 1);
  }

  return (
    <>
      <div className={cn("relative overflow-hidden p-5 flex flex-col h-full min-h-[260px]", isMaintenance && "hazard-stripe")}>
        {/* Grid pattern background — molten orange for active, amber for maintenance */}
        <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100",
              isMaintenance ? "from-maintenance/8 to-maintenance/1" : "from-molten/8 to-molten/1"
            )}
          >
            <GridPattern
              width={20} height={20} x="-12" y="4" squares={pattern}
              className={cn(
                "absolute inset-0 h-full w-full mix-blend-overlay",
                isMaintenance
                  ? "fill-maintenance/8 stroke-maintenance/20"
                  : "fill-molten/8 stroke-molten/20"
              )}
            />
          </div>
        </div>

        {/* Icon + status row */}
        <div className="relative z-10 flex items-start justify-between mb-2">
          <Icon
            className={cn("size-6", isMaintenance ? "text-maintenance/80" : "text-molten/80")}
            strokeWidth={1.5}
            aria-hidden
          />
          <div className="flex items-center gap-1.5">
            {isMaintenance ? (
              <>
                <AlertTriangle className="w-3 h-3 text-maintenance" />
                <span
                  className="text-maintenance uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em" }}
                >
                  Maintenance
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-active" />
                <span
                  className="text-active uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em" }}
                >
                  Active
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 mt-6">
          <div
            className="text-foundry-muted uppercase tracking-widest mb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
          >
            {app.category}
          </div>
          <h3
            className="text-foundry-white leading-tight mb-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "17px" }}
          >
            {app.name}
          </h3>
          <p
            className="text-foundry-muted text-xs font-light leading-relaxed flex-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {app.description}
          </p>

          {/* Star rating */}
          <div className="flex items-center gap-1.5 mt-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3 h-3"
                  style={{
                    color: s <= Math.round(app.averageRating) ? "#FF6B2B" : "#2E3A55",
                    fill: s <= Math.round(app.averageRating) ? "#FF6B2B" : "#2E3A55",
                  }}
                />
              ))}
            </div>
            <span
              className="text-foundry-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
            >
              {app.averageRating.toFixed(1)} ({app.totalRatings})
            </span>
            <span className="text-foundry-border">·</span>
            <span
              className="flex items-center gap-1 text-foundry-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              title={`${opens.toLocaleString("id-ID")} kali dibuka`}
            >
              <Eye className="w-3 h-3" />
              {opens.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-foundry-border/40">
            <a
              href={isMaintenance ? undefined : app.accessLink}
              target={isMaintenance ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-disabled={isMaintenance}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 transition-all duration-200",
                isMaintenance
                  ? "bg-foundry-steel/40 text-foundry-muted cursor-not-allowed opacity-60"
                  : "bg-molten text-foundry-black hover:bg-molten-bright"
              )}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em" }}
              onClick={isMaintenance ? (e) => e.preventDefault() : handleOpen}
            >
              <ExternalLink className="w-3 h-3" />
              {isMaintenance ? "DALAM PERBAIKAN" : "BUKA APLIKASI"}
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="px-2.5 py-2 border border-foundry-border/40 text-foundry-muted hover:border-molten/50 hover:text-molten transition-all duration-200"
              aria-label={`Beri masukan untuk ${app.name}`}
              title="Beri Masukan"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showModal && <FeedbackModal app={app} onClose={() => setShowModal(false)} />}
    </>
  );
}
