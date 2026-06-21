"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MOCK_APPS } from "@/lib/mockData";
import AppCard from "@/components/AppCard";

export default function AppGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="apps" className="relative z-[1] bg-foundry-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
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

        {/* App grid */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)", y: -6 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-dashed divide-x divide-y divide-dashed"
          style={{ borderColor: "rgba(46, 58, 85, 0.5)" }}
        >
          {MOCK_APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
              style={{ borderColor: "rgba(46, 58, 85, 0.5)" }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
