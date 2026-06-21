"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    : "--:--:--";
  const dateStr = now
    ? now.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    : "-- --- ----";

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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-21 h-21 flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={88}
              height={88}
              className="object-contain"
              priority
            />
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
              MELTING - POURING LINE
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Real-time clock */}
          <div className="hidden sm:flex flex-col items-end">
            <span
              className="text-foundry-white tabular-nums leading-none"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", letterSpacing: "0.06em" }}
            >
              {timeStr}
            </span>
            <span
              className="text-foundry-muted leading-none mt-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.08em" }}
            >
              {dateStr}
            </span>
          </div>

          {/* Admin — icon only, no box */}
          <a
            href="/admin/login"
            className="text-foundry-muted hover:text-molten transition-colors p-1.5"
            title="Admin Panel"
            aria-label="Admin Panel"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
