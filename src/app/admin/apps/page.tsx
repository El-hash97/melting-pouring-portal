"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, CheckCircle2, AlertTriangle, X, Save, Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { ICON_MAP, DEFAULT_ICONS } from "@/lib/iconMap";

interface App {
  id: string;
  name: string;
  description: string;
  logoIcon: string;
  accessLink: string;
  status: "ACTIVE" | "MAINTENANCE";
  category: string;
  averageRating?: number;
}

interface AppForm {
  name: string;
  description: string;
  logoIcon: string;
  accessLink: string;
  status: "ACTIVE" | "MAINTENANCE";
  category: string;
}

const EMPTY_FORM: AppForm = {
  name: "", description: "", logoIcon: "flame",
  accessLink: "", status: "ACTIVE", category: "",
};

export default function AdminAppsPage() {
  const router = useRouter();
  const [username, setUsername]   = useState("");
  const [apps, setApps]           = useState<App[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customIconNames, setCustomIconNames] = useState<string[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [form, setForm]           = useState<AppForm>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  const fetchApps = useCallback(async () => {
    const r = await fetch("/api/apps");
    if (r.ok) setApps(await r.json());
  }, []);

  const fetchMeta = useCallback(async () => {
    const [cRes, iRes] = await Promise.all([fetch("/api/categories"), fetch("/api/icons")]);
    if (cRes.ok) {
      const cats: { name: string }[] = await cRes.json();
      setCategories(cats.map((c) => c.name));
    }
    if (iRes.ok) {
      const icons: { name: string }[] = await iRes.json();
      setCustomIconNames(icons.map((i) => i.name));
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/admin/login"); return null; }
      return r.json();
    }).then((d) => d && setUsername(d.username));
    fetchApps();
    fetchMeta();
  }, [router, fetchApps, fetchMeta]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const openCreate = () => {
    setEditingApp(null);
    setForm({ ...EMPTY_FORM, category: categories[0] ?? "" });
    setShowForm(true);
  };
  const openEdit = (app: App) => {
    setEditingApp(app);
    setForm({ name: app.name, description: app.description, logoIcon: app.logoIcon, accessLink: app.accessLink, status: app.status, category: app.category });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingApp) {
      await fetch(`/api/apps/${editingApp.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/apps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setShowForm(false);
    fetchApps();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus aplikasi ini? Semua feedback terkait akan ikut terhapus.")) return;
    await fetch(`/api/apps/${id}`, { method: "DELETE" });
    fetchApps();
  };

  const toggleStatus = async (app: App) => {
    const next = app.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE";
    await fetch(`/api/apps/${app.id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    fetchApps();
  };

  const allIconNames = Array.from(new Set([...DEFAULT_ICONS, ...customIconNames]));
  const SelectedIcon = ICON_MAP[form.logoIcon] ?? Flame;

  return (
    <div className="min-h-screen bg-foundry-black flex">
      <AdminSidebar username={username} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto grid-texture">
        {/* Page header */}
        <div className="relative border-b border-foundry-border px-8 py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-molten/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-8 w-16 h-16 border-r-2 border-t-2 border-molten/15 pointer-events-none" />
          <div className="relative flex items-end justify-between">
            <div>
              <div className="text-molten uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
                Manajemen
              </div>
              <h1 className="text-foundry-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "28px" }}>
                KELOLA APLIKASI
              </h1>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-molten text-foundry-black hover:bg-molten-bright transition-colors card-clip glow-molten"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em" }}
            >
              <Plus className="w-4 h-4" /> TAMBAH APLIKASI
            </button>
          </div>
        </div>

        <div className="p-8">
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
                  {["Nama", "Kategori", "Status", "Rating", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-foundry-muted uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apps.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-foundry-border/50 hover:bg-foundry-steel/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-foundry-white font-medium" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "15px" }}>{app.name}</div>
                      <div className="text-foundry-muted truncate max-w-[240px]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>{app.accessLink}</div>
                    </td>
                    <td className="px-4 py-3 text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>{app.category}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(app)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 border transition-all",
                          app.status === "ACTIVE"
                            ? "text-active border-active/40 hover:bg-active/10"
                            : "text-maintenance border-maintenance/40 hover:bg-maintenance/10"
                        )}
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
                        title="Klik untuk toggle status"
                      >
                        {app.status === "ACTIVE"
                          ? <><CheckCircle2 className="w-3 h-3" /> ACTIVE</>
                          : <><AlertTriangle className="w-3 h-3" /> MAINTENANCE</>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                      {app.averageRating ? app.averageRating.toFixed(1) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(app)} className="p-1.5 text-foundry-muted hover:text-molten transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="p-1.5 text-foundry-muted hover:text-red-400 transition-colors" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                      Belum ada aplikasi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-foundry-slate border border-foundry-border relative overflow-y-auto max-h-[90vh]"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim" />
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-molten opacity-50" />

            <div className="flex items-center justify-between p-5 border-b border-foundry-border">
              <div>
                <div className="text-molten uppercase tracking-widest mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
                  {editingApp ? "Edit" : "Tambah"}
                </div>
                <h2 className="text-foundry-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "18px" }}>
                  {editingApp ? "EDIT APLIKASI" : "TAMBAH APLIKASI"}
                </h2>
              </div>
              <button onClick={() => setShowForm(false)} className="text-foundry-muted hover:text-foundry-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
              {([
                { id: "name" as const, label: "Nama Aplikasi" },
                { id: "accessLink" as const, label: "URL Aplikasi" },
              ]).map(({ id, label }) => (
                <div key={id}>
                  <label className="block text-foundry-muted uppercase tracking-widest mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>{label}</label>
                  <input
                    type="text"
                    value={form[id]}
                    onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                    className="w-full bg-foundry-steel border border-foundry-border text-foundry-white px-3 py-2 focus:outline-none focus:border-molten transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-foundry-muted uppercase tracking-widest mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>Deskripsi</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-foundry-steel border border-foundry-border text-foundry-white px-3 py-2 focus:outline-none focus:border-molten transition-colors resize-none"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                  required
                />
              </div>

              {/* Category dropdown */}
              <div>
                <label className="block text-foundry-muted uppercase tracking-widest mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>Kategori</label>
                {categories.length > 0 ? (
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-foundry-steel border border-foundry-border text-foundry-white px-3 py-2 focus:outline-none focus:border-molten transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-foundry-steel border border-foundry-border text-foundry-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>
                    Belum ada kategori — tambahkan di halaman{" "}
                    <a href="/admin/categories" className="text-molten underline">Kategori & Icon</a>
                  </div>
                )}
              </div>

              {/* Icon visual picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-foundry-muted uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>Icon</label>
                  <div className="flex items-center gap-1.5">
                    <SelectedIcon className="w-4 h-4 text-molten" />
                    <span className="text-molten" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>{form.logoIcon}</span>
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-1.5 bg-foundry-steel border border-foundry-border p-2 max-h-36 overflow-y-auto">
                  {allIconNames.map((name) => {
                    const Icon = ICON_MAP[name] ?? Flame;
                    const isSelected = form.logoIcon === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, logoIcon: name }))}
                        title={name}
                        className={cn(
                          "flex items-center justify-center p-2 border transition-all",
                          isSelected
                            ? "border-molten bg-molten/20 text-molten"
                            : "border-transparent hover:border-foundry-border text-foundry-muted hover:text-foundry-white"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-foundry-muted uppercase tracking-widest mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>Status</label>
                <div className="flex gap-3">
                  {(["ACTIVE", "MAINTENANCE"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={cn(
                        "flex-1 py-2 border transition-colors flex items-center justify-center gap-1.5",
                        form.status === s
                          ? s === "ACTIVE" ? "border-active text-active bg-active/10" : "border-maintenance text-maintenance bg-maintenance/10"
                          : "border-foundry-border text-foundry-muted hover:border-foundry-steel"
                      )}
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
                    >
                      {s === "ACTIVE" ? <><CheckCircle2 className="w-3 h-3" /> ACTIVE</> : <><AlertTriangle className="w-3 h-3" /> MAINTENANCE</>}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 py-2.5 bg-molten text-foundry-black disabled:opacity-50 hover:bg-molten-bright transition-colors mt-2 card-clip"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em" }}
              >
                <Save className="w-4 h-4" />
                {saving ? "MENYIMPAN..." : "SIMPAN"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
