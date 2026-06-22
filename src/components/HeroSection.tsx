"use client";

import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToApps = () =>
    document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-texture">
      {/* Dark vignette overlay — lets NeuralNoise glow through the center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,12,16,0.25) 0%, rgba(10,12,16,0.75) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="scan-line" aria-hidden="true" />

      {/* Corner accents */}
      <div className="absolute top-20 left-6 w-16 h-16 border-l-2 border-t-2 border-molten/30 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-20 right-6 w-16 h-16 border-r-2 border-t-2 border-molten/30 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 left-6 w-16 h-16 border-l-2 border-b-2 border-molten/20 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-6 w-16 h-16 border-r-2 border-b-2 border-molten/20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="fade-up inline-flex items-center gap-3 mb-8">
          <div className="h-px w-10 bg-molten/50" />
          <span
            className="text-molten uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
          >
            PT Toyota Manufacturing Indonesia
          </span>
          <div className="h-px w-10 bg-molten/50" />
        </div>

        <h1
          className="fade-up delay-200 text-foundry-white leading-none mb-4"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(48px, 9vw, 108px)",
            letterSpacing: "-0.01em",
          }}
        >
          MELTING
          <br />
          <span className="text-molten">&amp; POURING</span>
          <br />
          <span
            className="text-foundry-text"
            style={{ fontSize: "clamp(28px, 5vw, 60px)", fontWeight: 500 }}
          >
            APP PORTAL
          </span>
        </h1>

        <p
          className="fade-up delay-400 text-foundry-muted max-w-lg mx-auto mb-6 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}
        >
          Satu pintu akses ke seluruh aplikasi produksi. Pantau status sistem,
          buka tools yang kamu butuhkan, dan laporkan kendala langsung dari sini.
        </p>

        <div className="fade-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToApps}
            className="px-8 py-3 bg-molten text-foundry-black font-bold hover:bg-molten-bright transition-all duration-200 glow-molten card-clip"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.1em" }}
          >
            BUKA DIREKTORI APLIKASI
          </button>
        </div>
      </div>

      <button
        onClick={scrollToApps}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foundry-muted hover:text-molten transition-colors animate-bounce"
        aria-label="Scroll ke daftar aplikasi"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
