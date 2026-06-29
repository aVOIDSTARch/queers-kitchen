// src/components/nav/Nav.tsx
// Rail nav (desktop) + topbar + drawer (mobile).
// Direct React port of Nav.astro — same structure, same CSS tokens.

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { href: "/", label: "Home", kanji: "家" },
  { href: "/recipes", label: "Recipes", kanji: "食" },
  { href: "/add", label: "Add", kanji: "加" },
  { href: "/about", label: "About", kanji: "者" },
];

export function Nav() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ── Rail (desktop) ─────────────────────────────────────────────── */}
      <nav className="rail" aria-label="Main navigation">
        <Link to="/" className="rail-logo" aria-label="Queers Kitchen Cooperative home">
          <svg
            viewBox="0 0 24 24"
            className="shuriken"
            aria-hidden="true"
            style={{ width: 26, height: 26, animation: "shurikenSpin 12s linear infinite" }}
          >
            <polygon
              points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10"
              fill="var(--cinnabar)"
            />
            <circle cx="12" cy="12" r="2.5" fill="var(--bg-primary)" />
          </svg>
        </Link>

        <div className="rail-links">
          {NAV_LINKS.map(({ href, label, kanji }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                to={href}
                className={`rail-link${active ? " rail-link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="rail-link__kanji" aria-hidden="true">
                  {kanji}
                </span>
                <span className="rail-link__label">{label}</span>
                {active && (
                  <svg
                    className="rail-link__stroke"
                    viewBox="0 0 4 40"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 4,
                      height: 40,
                      opacity: 0.7,
                    }}
                  >
                    <line
                      x1="2"
                      y1="2"
                      x2="2"
                      y2="38"
                      stroke="var(--cinnabar)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      pathLength="1"
                      style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>

        <div className="rail-bottom">
          <span className="rail-bottom__text">忍</span>
        </div>
      </nav>

      {/* ── Topbar (mobile) ────────────────────────────────────────────── */}
      <header className="topbar" aria-label="Mobile navigation">
        <Link to="/" className="topbar__logo">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ width: 20, height: 20, animation: "shurikenSpin 12s linear infinite" }}
          >
            <polygon
              points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10"
              fill="var(--cinnabar)"
            />
            <circle cx="12" cy="12" r="2.5" fill="var(--bg-primary)" />
          </svg>
          QKC
        </Link>
        <button
          className="topbar__burger"
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((o) => !o)}
        >
          <span style={{ transform: drawerOpen ? "translateY(6.5px) rotate(45deg)" : undefined }} />
          <span style={{ opacity: drawerOpen ? 0 : 1 }} />
          <span
            style={{ transform: drawerOpen ? "translateY(-6.5px) rotate(-45deg)" : undefined }}
          />
        </button>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      <div
        className="topbar__drawer"
        aria-hidden={!drawerOpen}
        style={{ maxHeight: drawerOpen ? 600 : 0 }}
      >
        {NAV_LINKS.map(({ href, label, kanji }) => (
          <Link
            key={href}
            to={href}
            className={`topbar__drawer-link${isActive(href) ? " topbar__drawer-link--active" : ""}`}
            onClick={() => setDrawerOpen(false)}
          >
            <span className="topbar__kanji">{kanji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <style>{`
        .rail {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 52px; z-index: 100;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          align-items: center; padding: 1.2rem 0;
        }
        .rail-logo {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; margin-bottom: 1.5rem;
          flex-shrink: 0; text-decoration: none;
        }
        .rail-logo:hover .shuriken { animation-duration: 2s; }
        .rail-links {
          display: flex; flex-direction: column; align-items: center;
          flex: 1; width: 100%; overflow-y: auto; scrollbar-width: none;
        }
        .rail-link {
          position: relative; width: 100%;
          display: flex; flex-direction: column; align-items: center;
          padding: 0.9rem 0 0.7rem; text-decoration: none;
          border-left: 2px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .rail-link:hover { background: var(--border); border-left-color: var(--cinnabar-warm); }
        .rail-link--active { border-left-color: var(--cinnabar); background: var(--bg-tertiary); }
        .rail-link__kanji {
          font-family: "Kaisei Decol", serif; font-size: 1.1rem;
          color: var(--text-muted); line-height: 1; margin-bottom: 0.3rem;
          transition: color 0.2s ease;
        }
        .rail-link:hover .rail-link__kanji,
        .rail-link--active .rail-link__kanji { color: var(--cinnabar); }
        .rail-link__label {
          font-family: "JetBrains Mono", monospace; font-size: 0.55rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-ghost);
          writing-mode: vertical-rl; text-orientation: mixed;
          transform: rotate(180deg); line-height: 1;
          transition: color 0.2s ease; white-space: nowrap;
        }
        .rail-link:hover .rail-link__label { color: var(--text-muted); }
        .rail-link--active .rail-link__label { color: var(--cinnabar); }
        .rail-bottom { padding-top: 1rem; flex-shrink: 0; }
        .rail-bottom__text {
          font-family: "Kaisei Decol", serif; font-size: 0.9rem;
          color: var(--text-ghost); opacity: 0.4; display: block; text-align: center;
        }
        .topbar {
          display: none; position: fixed; top: 0; left: 0; right: 0;
          z-index: 100; height: 52px; background: var(--nav-bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(8px);
          align-items: center; justify-content: space-between; padding: 0 1.2rem;
        }
        .topbar__logo {
          font-family: "Kaisei Decol", serif; font-weight: 700; font-size: 1rem;
          color: var(--cinnabar); text-decoration: none;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .topbar__burger {
          background: transparent; border: none; cursor: pointer; padding: 0;
          display: flex; flex-direction: column; gap: 5px; width: 28px;
        }
        .topbar__burger span {
          display: block; height: 1.5px; background: var(--text-primary);
          transition: transform 0.25s ease, opacity 0.25s ease; transform-origin: center;
        }
        .topbar__drawer {
          display: none; position: fixed; top: 52px; left: 0; right: 0;
          z-index: 99; background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          flex-direction: column; overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .topbar__drawer-link {
          display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem;
          font-family: "JetBrains Mono", monospace; font-size: 0.7rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted); text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .topbar__drawer-link:hover { color: var(--text-primary); background: var(--border); }
        .topbar__drawer-link--active { color: var(--cinnabar); }
        .topbar__kanji {
          font-family: "Kaisei Decol", serif; font-size: 1rem;
          width: 1.5rem; text-align: center;
        }
        @media (max-width: 768px) {
          .rail { display: none; }
          .topbar { display: flex; }
          .topbar__drawer { display: flex; }
        }
      `}</style>
    </>
  );
}
