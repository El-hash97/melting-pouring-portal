"use client";

import Link from "next/link";
import { Zap, Heart } from "lucide-react";

const navigation = [
  {
    id: "pouring",
    name: "Pouring",
    items: [
      { name: "Smart Pouring Log", href: "#" },
      { name: "Mold Temp Tracker", href: "#" },
      { name: "Trial Flow Monitor", href: "#" },
    ],
  },
  {
    id: "production",
    name: "Production",
    items: [
      { name: "Production Counter", href: "#" },
      { name: "Dashboard KPI", href: "#" },
      { name: "Laporan Shift", href: "#" },
    ],
  },
  {
    id: "quality",
    name: "Quality",
    items: [
      { name: "Defect Reporter", href: "#" },
      { name: "Inspection Log", href: "#" },
      { name: "Root Cause Analysis", href: "#" },
    ],
  },
  {
    id: "improvement",
    name: "Improvement",
    items: [
      { name: "IdeaVault Kaizen", href: "#" },
      { name: "5S Tracker", href: "#" },
      { name: "Training Record", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-foundry-border/40 bg-black">
      {/* Logo + description */}
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-molten/15 rounded-sm rotate-45" />
            <Zap className="relative z-10 w-4 h-4 text-molten" strokeWidth={2.5} />
          </div>
          <div>
            <div
              className="text-foundry-white"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "14px", letterSpacing: "0.1em" }}
            >
              CASTING APP PORTAL
            </div>
            <div
              className="text-foundry-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.08em" }}
            >
              PT TOYOTA MANUFACTURING INDONESIA
            </div>
          </div>
        </div>
        <p className="text-center text-xs leading-5 text-foundry-muted/80 md:text-left max-w-xl">
          Portal terpusat untuk akses, monitoring, dan feedback seluruh aplikasi digital area Melting &amp; Pouring PT Toyota Manufacturing Indonesia. Dirancang untuk meningkatkan efisiensi operasional dan kualitas proses produksi casting.
        </p>
      </div>

      {/* Navigation grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-foundry-border/40 mb-8" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {navigation.map((section) => (
            <div key={section.id}>
              <p
                className="mb-3 text-molten uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em" }}
              >
                {section.name}
              </p>
              <ul className="flex flex-col space-y-2">
                {section.items.map((item) => (
                  <li key={item.name} className="flow-root">
                    <Link
                      href={item.href}
                      className="text-xs text-foundry-muted hover:text-foundry-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-b border-dotted border-foundry-border/40" />
      </div>

      {/* Copyright */}
      <div className="mx-auto mb-10 mt-2 flex flex-col items-center text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center gap-1.5 text-foundry-muted">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>Dibuat dengan</span>
          <Heart className="text-molten h-3.5 w-3.5 animate-pulse fill-current" />
          <span>oleh</span>
          <span
            className="text-foundry-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Tim Digital TMI
          </span>
          <span>—</span>
          <span>Internal Use Only</span>
        </div>
      </div>
    </footer>
  );
}
