"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Grid3X3, LayoutGrid, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  username: string;
  onLogout: () => void;
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Grid3X3, exact: true },
  { href: "/admin/apps", label: "Kelola Aplikasi", icon: LayoutGrid, exact: false },
  { href: "/admin/feedbacks", label: "Feedback Inbox", icon: MessageSquare, exact: false },
];

export default function AdminSidebar({ username, onLogout }: Props) {
  const path = usePathname();

  return (
    <aside className="w-60 bg-foundry-dark border-r border-foundry-border flex flex-col flex-shrink-0">
      {/* Brand header */}
      <div className="relative p-5 border-b border-foundry-border overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim" />
        <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-molten/30 pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-molten/20 rotate-45" />
            <Zap className="relative z-10 w-4 h-4 text-molten" strokeWidth={2.5} />
          </div>
          <div>
            <div>
              <span
                className="text-foundry-white uppercase leading-none"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.12em" }}
              >
                Casting
              </span>
              <span
                className="text-molten uppercase leading-none ml-1"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.12em" }}
              >
                Portal
              </span>
            </div>
            <div
              className="text-foundry-muted leading-none mt-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.18em" }}
            >
              ADMIN PANEL
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-active animate-pulse" />
          <span
            className="text-foundry-muted"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em" }}
          >
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 border-l-2",
                isActive
                  ? "text-molten bg-molten/10 border-molten"
                  : "text-foundry-muted hover:text-foundry-white hover:bg-foundry-steel/30 border-transparent"
              )}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-foundry-border">
        <div
          className="text-foundry-muted mb-3 truncate"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
        >
          {username || "—"}
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-foundry-muted hover:text-maintenance transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
