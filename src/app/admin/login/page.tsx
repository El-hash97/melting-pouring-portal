"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, AlertCircle, Zap } from "lucide-react";
import { NeuralNoise } from "@/components/ui/neural-noise";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Login gagal");
    }
  };

  return (
    <>
      <NeuralNoise color={[1.0, 0.42, 0.17]} opacity={0.65} speed={0.0008} />

      <div className="relative z-[1] min-h-screen flex items-center justify-center p-4">
        <div className="scan-line" aria-hidden="true" />

        {/* Corner accents */}
        <div className="fixed top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-molten/40 pointer-events-none" aria-hidden="true" />
        <div className="fixed top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-molten/40 pointer-events-none" aria-hidden="true" />
        <div className="fixed bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-molten/20 pointer-events-none" aria-hidden="true" />
        <div className="fixed bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-molten/20 pointer-events-none" aria-hidden="true" />

        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="fade-up flex flex-col items-center mb-8">
            <div className="relative w-14 h-14 flex items-center justify-center mb-5">
              <div className="absolute inset-0 bg-molten/20 rotate-45" />
              <div className="absolute inset-0 border border-molten/30 rotate-45 scale-[1.3]" />
              <Zap className="relative z-10 w-7 h-7 text-molten" strokeWidth={2} />
            </div>
            <div
              className="text-molten uppercase tracking-widest mb-2"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}
            >
              PT Toyota Manufacturing Indonesia
            </div>
            <h1
              className="text-foundry-white text-center"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "30px", letterSpacing: "0.08em" }}
            >
              ADMIN <span className="text-molten">PORTAL</span>
            </h1>
          </div>

          {/* Login card */}
          <div className="fade-up delay-200 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-molten-dim via-molten to-molten-dim z-10" />
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-molten z-10 opacity-50" />

            <form
              onSubmit={handleSubmit}
              className="bg-foundry-dark/90 backdrop-blur-sm border border-foundry-border p-6 flex flex-col gap-4"
            >
              {error && (
                <div className="flex items-center gap-2 text-maintenance p-3 bg-maintenance/10 border border-maintenance/30">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-foundry-muted uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foundry-muted" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-foundry-steel border border-foundry-border text-foundry-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-molten transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-foundry-muted uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foundry-muted" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-foundry-steel border border-foundry-border text-foundry-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-molten transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-molten text-foundry-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-molten-bright transition-all duration-200 mt-2 card-clip glow-molten"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "14px", letterSpacing: "0.12em" }}
              >
                <LogIn className="w-4 h-4" />
                {loading ? "MEMPROSES..." : "MASUK"}
              </button>
            </form>
          </div>

          <div className="fade-up delay-400 text-center mt-6">
            <a
              href="/"
              className="text-foundry-muted hover:text-molten transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em" }}
            >
              ← Kembali ke Portal
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
