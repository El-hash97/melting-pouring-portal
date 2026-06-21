"use client";

import { Sun, Moon, ArrowUp } from "lucide-react";
import { useTheme } from "next-themes";

function handleScrollTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-dotted border-foundry-border/60">
        <button
          onClick={() => setTheme("light")}
          className="bg-foundry-steel mr-3 rounded-full p-2 text-foundry-muted hover:text-molten transition-colors"
        >
          <Sun className="h-5 w-5" strokeWidth={1} />
          <span className="sr-only">Light mode</span>
        </button>

        <button
          type="button"
          onClick={handleScrollTop}
          className="text-foundry-muted hover:text-molten transition-colors"
        >
          <ArrowUp className="h-3 w-3" />
          <span className="sr-only">Scroll to top</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className="bg-foundry-steel ml-3 rounded-full p-2 text-foundry-muted hover:text-molten transition-colors"
        >
          <Moon className="h-5 w-5" strokeWidth={1} />
          <span className="sr-only">Dark mode</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
