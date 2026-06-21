"use client";

import { useState, useEffect } from "react";
import { Settings, Zap } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-foundry-black/90 backdrop-blur-md border-b border-foundry-border/40"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-molten/20 rounded-sm rotate-45" />
            <Zap className="relative z-10 w-4 h-4 text-molten" strokeWidth={2.5} />
          </div>
          <div>
            <div>
              <span
                className="text-lg text-foundry-white uppercase leading-none"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Casting
              </span>
              <span
                className="text-lg text-molten uppercase leading-none ml-1"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Portal
              </span>
            </div>
            <div
              className="text-foundry-muted leading-none mt-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.12em" }}
            >
              TMI MELTING & POURING
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-active animate-pulse" />
            <span
              className="text-foundry-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              SYSTEM ONLINE
            </span>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-1.5 border border-foundry-border text-foundry-muted hover:border-molten hover:text-molten transition-all duration-200"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.08em" }}
          >
            <Settings className="w-3.5 h-3.5" />
            ADMIN
          </a>
        </div>
      </div>
    </nav>
  );
}
