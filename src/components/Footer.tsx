"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AppItem } from "@/lib/mockData";

type CategoryGroup = {
  name: string;
  items: { name: string; href: string }[];
};

export default function Footer() {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then((apps: AppItem[]) => {
        const map = new Map<string, { name: string; href: string }[]>();
        for (const app of apps) {
          const cat = app.category || "General";
          if (!map.has(cat)) map.set(cat, []);
          map.get(cat)!.push({ name: app.name, href: app.accessLink || "#" });
        }
        setGroups(
          Array.from(map.entries()).map(([name, items]) => ({ name, items }))
        );
      });
  }, []);

  const colClass =
    groups.length <= 2
      ? "grid-cols-2"
      : groups.length === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-4";

  return (
    <footer className="relative z-[1] border-t border-foundry-border/40 bg-black">
      {/* Description */}
      <div className="relative mx-auto max-w-7xl px-10 pt-10 pb-0">
        <p className="text-xs leading-5 text-foundry-muted/80 max-w-xl">
          Portal terpusat untuk akses, monitoring, dan feedback seluruh aplikasi digital area Melting &amp; Pouring PT Toyota Manufacturing Indonesia. Dirancang untuk meningkatkan efisiensi operasional dan kualitas proses produksi casting.
        </p>
      </div>

      {/* Navigation grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-foundry-border/40 mb-8" />
        {groups.length > 0 && (
          <div className={`grid gap-8 ${colClass}`}>
            {groups.map((section) => (
              <div key={section.name}>
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
        )}
        <div className="mt-8 border-b border-dotted border-foundry-border/40" />
      </div>

      {/* Copyright */}
      <div className="mx-auto px-6 py-6 flex flex-col items-center text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center gap-1.5 text-foundry-muted">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span
            className="text-foundry-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Melting &amp; Pouring Line
          </span>
          <span>—</span>
          <span>Divisi Casting</span>
        </div>
      </div>
    </footer>
  );
}
