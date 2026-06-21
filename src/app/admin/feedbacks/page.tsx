"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Star, CheckCircle2, Circle, Trash2, Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";

interface Feedback {
  id: string;
  appId: string;
  rating: number;
  message: string;
  isResolved: boolean;
  createdAt: string;
  app: { name: string };
}

export default function AdminFeedbacksPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filterApp, setFilterApp] = useState("");
  const [filterResolved, setFilterResolved] = useState<"all" | "open" | "resolved">("all");
  const [appNames, setAppNames] = useState<string[]>([]);

  const fetchFeedbacks = useCallback(async () => {
    const r = await fetch("/api/feedbacks");
    if (r.ok) {
      const data: Feedback[] = await r.json();
      setFeedbacks(data);
      setAppNames([...new Set(data.map((f) => f.app.name))]);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/admin/login"); return null; }
      return r.json();
    }).then((d) => d && setUsername(d.username));
    fetchFeedbacks();
  }, [router, fetchFeedbacks]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleResolved = async (fb: Feedback) => {
    await fetch(`/api/feedbacks/${fb.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isResolved: !fb.isResolved }),
    });
    fetchFeedbacks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus feedback ini?")) return;
    await fetch(`/api/feedbacks/${id}`, { method: "DELETE" });
    fetchFeedbacks();
  };

  const filtered = feedbacks.filter((f) => {
    if (filterApp && f.app.name !== filterApp) return false;
    if (filterResolved === "open" && f.isResolved) return false;
    if (filterResolved === "resolved" && !f.isResolved) return false;
    return true;
  });

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
              Inbox
            </div>
            <h1
              className="text-foundry-white"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "28px" }}
            >
              FEEDBACK MASUK
            </h1>
          </div>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-foundry-muted" />
              <select
                value={filterApp}
                onChange={(e) => setFilterApp(e.target.value)}
                className="bg-foundry-dark border border-foundry-border text-foundry-text px-3 py-1.5 focus:outline-none focus:border-molten transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
              >
                <option value="">Semua Aplikasi</option>
                {appNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="flex gap-1">
              {(["all", "open", "resolved"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilterResolved(v)}
                  className={cn(
                    "px-3 py-1.5 border transition-colors",
                    filterResolved === v
                      ? "border-molten text-molten bg-molten/10"
                      : "border-foundry-border text-foundry-muted hover:border-foundry-muted"
                  )}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
                >
                  {v === "all" ? "SEMUA" : v === "open" ? "OPEN" : "RESOLVED"}
                </button>
              ))}
            </div>

            <span
              className="text-foundry-muted ml-auto"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
            >
              {filtered.length} item
            </span>
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="relative border border-foundry-border overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim" />
            <table className="w-full">
              <thead>
                <tr className="border-b border-foundry-border bg-foundry-dark">
                  {["Aplikasi", "Rating", "Pesan", "Tanggal", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-foundry-muted uppercase tracking-widest"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((fb, i) => (
                  <motion.tr
                    key={fb.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "border-b border-foundry-border/50 transition-colors",
                      fb.isResolved ? "opacity-40" : "hover:bg-foundry-steel/20"
                    )}
                  >
                    <td
                      className="px-4 py-3 text-foundry-white font-semibold whitespace-nowrap"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px" }}
                    >
                      {fb.app.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className="w-3 h-3" style={{ color: s <= fb.rating ? "#FF6B2B" : "#2E3A55", fill: s <= fb.rating ? "#FF6B2B" : "#2E3A55" }} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foundry-text max-w-xs">
                      <p className="line-clamp-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                        {fb.message}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-foundry-muted whitespace-nowrap"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
                    >
                      {new Date(fb.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 border",
                          fb.isResolved
                            ? "text-active border-active/40 bg-active/10"
                            : "text-foundry-muted border-foundry-border"
                        )}
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
                      >
                        {fb.isResolved ? "RESOLVED" : "OPEN"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleResolved(fb)}
                          className={cn("p-1.5 transition-colors", fb.isResolved ? "text-foundry-muted hover:text-foundry-white" : "text-foundry-muted hover:text-active")}
                          title={fb.isResolved ? "Tandai Open" : "Tandai Resolved"}
                        >
                          {fb.isResolved ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleDelete(fb.id)} className="p-1.5 text-foundry-muted hover:text-red-400 transition-colors" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                      Tidak ada feedback
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
