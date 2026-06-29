// src/components/ui/ThemeToggle.tsx
// Floating lantern toggle — Woodblock (dark) / Red Lacquer (light).
// Reads/writes data-theme on <html> and persists to localStorage.

import { useState, useEffect } from "react";

const STORAGE_KEY = "qkc-theme";
const DEFAULT_THEME = "dark";

function getTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);

  useEffect(() => {
    const t = getTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      className="lantern-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title="Toggle light / dark theme"
    >
      <svg
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="var(--text-secondary)"
      >
        <line
          x1="18"
          y1="0"
          x2="18"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="10" y="5" width="16" height="3" rx="1.5" fill="currentColor" />
        <ellipse cx="18" cy="22" rx="12" ry="14" fill="currentColor" />
        <ellipse cx="18" cy="22" rx="8" ry="10" fill="var(--sil-window)" opacity="0.55" />
        <line
          x1="8"
          y1="16"
          x2="28"
          y2="16"
          stroke="var(--bg-secondary)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <line
          x1="7"
          y1="22"
          x2="29"
          y2="22"
          stroke="var(--bg-secondary)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <line
          x1="8"
          y1="28"
          x2="28"
          y2="28"
          stroke="var(--bg-secondary)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <rect x="10" y="34" width="16" height="3" rx="1.5" fill="currentColor" />
        <line
          x1="16"
          y1="37"
          x2="16"
          y2="43"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="18"
          y1="37"
          x2="18"
          y2="44"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="20"
          y1="37"
          x2="20"
          y2="43"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </button>
  );
}
