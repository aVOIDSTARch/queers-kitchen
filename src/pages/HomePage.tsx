// src/pages/HomePage.tsx
// Landing page: random recipe of the day hero + navigation cards.
// Uses SceneTownSquare as fixed background — community gathering feel.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ZoneLayout } from "../components/ui/ZoneLayout";
import { useRecipeList } from "../hooks/useRecipes";
import { zoneForSlug } from "../lib/scenes";

const NAV_CARDS = [
  {
    num: "01",
    href: "/recipes",
    label: "Recipes",
    kanji: "食",
    title: "The Collection",
    body: "Every recipe we've cooked, tested, and annotated. Browse by tag, search by ingredient, or let the kitchen decide.",
    accent: "cinnabar",
  },
  {
    num: "02",
    href: "/add",
    label: "Add Recipe",
    kanji: "加",
    title: "Add a Recipe",
    body: "Paste a URL and we'll scrape it into our format, or write one from scratch in the markdown editor.",
    accent: "warm",
  },
  {
    num: "03",
    href: "/about",
    label: "About",
    kanji: "者",
    title: "About QKC",
    body: "The Queers Kitchen Cooperative — who we are, how the collection works, and why every recipe has a story.",
    accent: "ghost",
  },
];

export function HomePage() {
  const { recipes, loading } = useRecipeList();

  // Pick a stable random recipe of the day using today's date as seed
  const rotd = useMemo(() => {
    if (!recipes.length) return null;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return recipes[seed % recipes.length];
  }, [recipes]);

  const rotdSlug = rotd
    ? rotd.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";
  const rotdZone = rotdSlug ? zoneForSlug(rotdSlug) : "town-square";

  return (
    <ZoneLayout zone="town-square">
      <div className="home-shell">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="home-hero">
          <p className="eyebrow">Queer Council Collective</p>
          <h1 className="hero-heading home-title">
            the <span style={{ color: "var(--cinnabar)" }}>queer kitchen</span>
            <br />
            cooperative
          </h1>
          <p className="home-sub">
            A living cookbook, built in public. Recipes tested, annotated, and argued over — from
            ferments that take weeks to dishes done in twenty minutes.
          </p>
        </div>

        {/* ── Recipe of the Day ─────────────────────────────────────────── */}
        <div className="home-rotd">
          <p className="eyebrow">Recipe of the Day</p>
          {loading && (
            <div className="home-rotd__loading">
              <span className="home-rotd__spinner" aria-hidden="true" />
              <span>Finding today's recipe…</span>
            </div>
          )}
          {!loading && !rotd && (
            <div className="home-rotd__empty card">
              <p>
                No recipes yet.{" "}
                <Link to="/add" className="home-rotd__add-link">
                  Add the first one →
                </Link>
              </p>
            </div>
          )}
          {rotd && (
            <Link to={`/recipes/${rotdSlug}`} className="home-rotd__card card card-accent-cinnabar">
              <div className="home-rotd__card-inner">
                <div className="home-rotd__text">
                  <span
                    className="home-rotd__zone-pill"
                    style={
                      {
                        "--zone-accent": `var(--cinnabar)`,
                      } as React.CSSProperties
                    }
                  >
                    {rotdZone}
                  </span>
                  <h2 className="home-rotd__title">{rotd.title}</h2>
                  {rotd.tagline && <p className="home-rotd__tagline">{rotd.tagline}</p>}
                  <div className="home-rotd__meta">
                    <span>{rotd.meta.serves} serves</span>
                    <span className="home-rotd__sep">·</span>
                    <span>{rotd.meta.time}</span>
                  </div>
                  <span className="home-rotd__cta">Cook this today →</span>
                </div>
                <div className="home-rotd__shuriken" aria-hidden="true">
                  <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, opacity: 0.12 }}>
                    <polygon
                      points="40,4 46,34 76,40 46,46 40,76 34,46 4,40 34,34"
                      fill="var(--cinnabar)"
                    />
                    <circle cx="40" cy="40" r="8" fill="var(--bg-primary)" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* ── Nav cards ─────────────────────────────────────────────────── */}
        <div className="home-paths">
          {NAV_CARDS.map((c) => (
            <Link key={c.href} to={c.href} className={`path-card path-card--${c.accent}`}>
              <span className="path-card__num">{c.num}</span>
              <span className="path-card__label">
                {c.kanji} {c.label}
              </span>
              <h2 className="path-card__title">{c.title}</h2>
              <p className="path-card__body">{c.body}</p>
              <span className="path-card__cta">Go →</span>
            </Link>
          ))}
        </div>

        {/* ── Footer brand ─────────────────────────────────────────────── */}
        <footer className="home-footer">
          <p className="home-footer__brand">
            © {new Date().getFullYear()} Queers Kitchen Cooperative
            <abbr
              title="Trademark"
              style={{ textDecoration: "none", fontSize: "0.65em", verticalAlign: "super" }}
            >
              ™
            </abbr>
          </p>
        </footer>
      </div>

      <style>{`
        .home-shell {
          padding: 0 3.5rem 6rem;
          max-width: 960px;
        }

        /* ── Hero ── */
        .home-hero { padding-top: 8vh; margin-bottom: 4rem; }
        .home-title { margin-bottom: 1.5rem; }
        .home-sub {
          font-family: "Shippori Mincho", serif;
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 55ch;
          line-height: 1.85;
        }

        /* ── ROTD ── */
        .home-rotd { margin-bottom: 4rem; }
        .home-rotd__loading {
          display: flex; align-items: center; gap: 0.75rem;
          color: var(--text-ghost);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .home-rotd__spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 1.5px solid var(--border);
          border-top-color: var(--cinnabar);
          border-radius: 50%;
          animation: shurikenSpin 0.8s linear infinite;
        }
        .home-rotd__empty { color: var(--text-muted); font-family: "Shippori Mincho", serif; }
        .home-rotd__add-link { color: var(--cinnabar); text-decoration: none; }
        .home-rotd__add-link:hover { text-decoration: underline; }

        .home-rotd__card {
          display: block;
          text-decoration: none;
          transition: background 0.2s ease;
          border-left: 3px solid var(--cinnabar);
        }
        .home-rotd__card:hover { background: var(--card-hover); }
        .home-rotd__card-inner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
        }
        .home-rotd__zone-pill {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--cinnabar);
          display: block;
          margin-bottom: 0.6rem;
        }
        .home-rotd__title {
          font-family: "Kaisei Decol", serif;
          font-weight: 400;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 0.75rem;
        }
        .home-rotd__tagline {
          font-family: "Shippori Mincho", serif;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 55ch;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .home-rotd__meta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-ghost);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .home-rotd__sep { color: var(--border-hi); }
        .home-rotd__cta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cinnabar);
        }
        .home-rotd__shuriken { flex-shrink: 0; align-self: center; }

        /* ── Nav paths ── */
        .home-paths {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: var(--border);
          margin-bottom: 4rem;
        }
        .path-card {
          display: flex;
          flex-direction: column;
          padding: 2rem 1.8rem;
          background: var(--bg-card);
          text-decoration: none;
          border-top: 3px solid transparent;
          transition: background 0.2s ease;
        }
        .path-card:hover { background: var(--bg-raised); }
        .path-card--cinnabar { border-top-color: var(--cinnabar); }
        .path-card--warm     { border-top-color: var(--cinnabar-warm); }
        .path-card--ghost    { border-top-color: var(--text-ghost); }
        .path-card__num {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          color: var(--text-ghost);
          margin-bottom: 0.3rem;
        }
        .path-card__label {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cinnabar);
          margin-bottom: 0.8rem;
        }
        .path-card--warm .path-card__label  { color: var(--cinnabar-warm); }
        .path-card--ghost .path-card__label { color: var(--text-muted); }
        .path-card__title {
          font-family: "Kaisei Decol", serif;
          font-weight: 400;
          font-size: 1.5rem;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 1rem;
        }
        .path-card__body {
          font-family: "Shippori Mincho", serif;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.75;
          flex: 1;
          margin-bottom: 1.5rem;
        }
        .path-card__cta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cinnabar);
          align-self: flex-start;
        }
        .path-card--warm .path-card__cta  { color: var(--cinnabar-warm); }
        .path-card--ghost .path-card__cta { color: var(--text-muted); }

        /* ── Home footer ── */
        .home-footer { border-top: 1px solid var(--border); padding-top: 1.5rem; }
        .home-footer__brand {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-ghost);
        }

        @media (max-width: 768px) {
          .home-shell { padding: 0 1.5rem 4rem; }
          .home-paths { grid-template-columns: 1fr; }
          .home-hero { padding-top: 3vh; }
          .home-rotd__card-inner { flex-direction: column; }
          .home-rotd__shuriken { display: none; }
        }
      `}</style>
    </ZoneLayout>
  );
}
