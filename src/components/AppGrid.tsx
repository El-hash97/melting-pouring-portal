"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AppCard from "@/components/AppCard";
import type { AppItem } from "@/lib/mockData";

export default function AppGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then(setApps)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="apps" className="relative z-[1] bg-foundry-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div
            className="text-molten uppercase tracking-widest mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
          >
            Direktori
          </div>
          <h2
            className="text-foundry-white leading-none"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)" }}
          >
            APLIKASI TERSEDIA
          </h2>
        </motion.div>

        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-dashed divide-x divide-y divide-dashed"
            style={{ borderColor: "rgba(46, 58, 85, 0.5)" }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-5 min-h-[260px] animate-pulse bg-foundry-steel/10" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)", y: -6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-dashed divide-x divide-y divide-dashed"
            style={{ borderColor: "rgba(46, 58, 85, 0.5)" }}
          >
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                style={{ borderColor: "rgba(46, 58, 85, 0.5)" }}
              >
                <AppCard app={app} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
