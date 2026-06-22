"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Tag, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { ICON_MAP, DEFAULT_ICONS } from "@/lib/iconMap";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string }
interface IconOpt   { id: string; name: string }

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [username, setUsername]     = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [icons, setIcons]           = useState<IconOpt[]>([]);
  const [catInput, setCatInput]     = useState("");
  const [iconInput, setIconInput]   = useState("");
  const [catError, setCatError]     = useState("");
  const [iconError, setIconError]   = useState("");

  const fetchAll = useCallback(async () => {
    const [cRes, iRes] = await Promise.all([fetch("/api/categories"), fetch("/api/icons")]);
    if (cRes.ok) setCategories(await cRes.json());
    if (iRes.ok) setIcons(await iRes.json());
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/admin/login"); return null; }
      return r.json();
    }).then((d) => d && setUsername(d.username));
    fetchAll();
  }, [router, fetchAll]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError("");
    const r = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catInput }),
    });
    if (!r.ok) { const d = await r.json(); setCatError(d.error); return; }
    setCatInput("");
    fetchAll();
  };

  const deleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const addIcon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIconError("");
    const r = await fetch("/api/icons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: iconInput }),
    });
    if (!r.ok) { const d = await r.json(); setIconError(d.error); return; }
    setIconInput("");
    fetchAll();
  };

  const deleteIcon = async (id: string) => {
    await fetch(`/api/icons/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const allIconNames = Array.from(new Set([...DEFAULT_ICONS, ...icons.map((i) => i.name)]));

  return (
    <div className="min-h-screen bg-foundry-black flex">
      <AdminSidebar username={username} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto grid-texture">
        {/* Page header */}
        <div className="relative border-b border-foundry-border px-8 py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-molten/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-8 w-16 h-16 border-r-2 border-t-2 border-molten/15 pointer-events-none" />
          <div className="relative">
            <div className="text-molten uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
              Konfigurasi
            </div>
            <h1 className="text-foundry-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "28px" }}>
              KELOLA KATEGORI & ICON
            </h1>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Categories ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative border border-foundry-border overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim" />

            <div className="px-5 py-4 border-b border-foundry-border flex items-center gap-2">
              <Tag className="w-4 h-4 text-molten" />
              <span className="text-foundry-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "16px" }}>
                KATEGORI
              </span>
              <span className="ml-auto text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
                {categories.length} kategori
              </span>
            </div>

            {/* Add form */}
            <form onSubmit={addCategory} className="flex gap-2 p-4 border-b border-foundry-border/50">
              <input
                type="text"
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                placeholder="Nama kategori baru..."
                className="flex-1 bg-foundry-steel border border-foundry-border text-foundry-white px-3 py-2 text-sm focus:outline-none focus:border-molten transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-molten text-foundry-black hover:bg-molten-bright transition-colors"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "12px" }}
              >
                <Plus className="w-3.5 h-3.5" /> TAMBAH
              </button>
            </form>
            {catError && (
              <p className="px-4 pb-2 text-red-400" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>{catError}</p>
            )}

            {/* List */}
            <div className="divide-y divide-foundry-border/40">
              {categories.length === 0 && (
                <p className="px-5 py-8 text-center text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                  Belum ada kategori
                </p>
              )}
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-foundry-steel/20 transition-colors">
                  <span className="text-foundry-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 text-foundry-muted hover:text-red-400 transition-colors"
                    title="Hapus kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Icons ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative border border-foundry-border overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim" />

            <div className="px-5 py-4 border-b border-foundry-border flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-molten" />
              <span className="text-foundry-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "16px" }}>
                ICON KUSTOM
              </span>
              <span className="ml-auto text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
                {icons.length} kustom · {DEFAULT_ICONS.length} bawaan
              </span>
            </div>

            {/* Add form */}
            <form onSubmit={addIcon} className="flex gap-2 p-4 border-b border-foundry-border/50">
              <input
                type="text"
                value={iconInput}
                onChange={(e) => setIconInput(e.target.value)}
                placeholder="Nama lucide icon (mis: cpu, wrench)..."
                className="flex-1 bg-foundry-steel border border-foundry-border text-foundry-white px-3 py-2 text-sm focus:outline-none focus:border-molten transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-molten text-foundry-black hover:bg-molten-bright transition-colors"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "12px" }}
              >
                <Plus className="w-3.5 h-3.5" /> TAMBAH
              </button>
            </form>
            {iconError && (
              <p className="px-4 pb-2 text-red-400" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>{iconError}</p>
            )}

            {/* All icons grid */}
            <div className="p-4">
              <p className="text-foundry-muted mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
                SEMUA ICON TERSEDIA
              </p>
              <div className="grid grid-cols-6 gap-2">
                {allIconNames.map((name) => {
                  const Icon = ICON_MAP[name];
                  const isCustom = icons.some((i) => i.name === name);
                  const customEntry = icons.find((i) => i.name === name);
                  return (
                    <div
                      key={name}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-1 p-2 border transition-colors",
                        isCustom
                          ? "border-molten/40 bg-molten/5"
                          : "border-foundry-border bg-foundry-steel/20"
                      )}
                      title={name}
                    >
                      {Icon
                        ? <Icon className="w-4 h-4 text-foundry-text" />
                        : <span className="text-foundry-muted text-[8px]">?</span>
                      }
                      <span className="text-foundry-muted truncate w-full text-center" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7px" }}>
                        {name}
                      </span>
                      {isCustom && customEntry && (
                        <button
                          onClick={() => deleteIcon(customEntry.id)}
                          className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 bg-red-500 items-center justify-center"
                          title="Hapus icon kustom"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
