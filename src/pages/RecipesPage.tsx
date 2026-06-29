// src/pages/RecipesPage.tsx
// Browsable recipe index: grid of cards, tag filter, search.

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ZoneLayout } from "../components/ui/ZoneLayout";
import { useRecipeList } from "../hooks/useRecipes";
import { zoneForSlug, ZONE_ACCENTS } from "../lib/scenes";
import type { ParsedRecipe } from "../../recipe-parser/types";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RecipesPage() {
  const { recipes, loading, error } = useRecipeList();
  const [search, setSearch] = useState("");
  const [activeTag, _setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = recipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.tagline.toLowerCase().includes(q),
      );
    }
    return list;
  }, [recipes, search, activeTag]);

  return (
    <ZoneLayout zone="scholars">
      <div className="recipes-shell">
        <div className="recipes-header">
          <span className="eyebrow">食 · Recipes</span>
          <h1 className="section-heading">The Collection</h1>
          <p className="recipes-count">
            {loading ? "Loading…" : `${filtered.length} recipe${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search */}
        <div className="recipes-search">
          <label htmlFor="recipe-search" className="sr-only">
            Search recipes
          </label>
          <input
            id="recipe-search"
            type="search"
            placeholder="Search by title or ingredient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="recipes-search__input"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="recipes-error card card-accent-cinnabar" role="alert">
            <p>Could not load recipes: {error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="recipes-empty card">
            {recipes.length === 0 ? (
              <p>
                No recipes yet.{" "}
                <Link to="/add" className="recipes-empty__link">
                  Add the first one →
                </Link>
              </p>
            ) : (
              <p>No recipes match "{search}".</p>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="recipes-grid">
            {filtered.map((r) => (
              <RecipeCard key={r.title} recipe={r} />
            ))}
          </div>
        )}

        <footer className="recipes-footer">
          <Link to="/add" className="btn-primary">
            Add a recipe
          </Link>
        </footer>
      </div>

      <style>{`
        .recipes-shell {
          padding: 3rem 3.5rem 6rem;
          max-width: 960px;
        }
        .recipes-header { margin-bottom: 2rem; }
        .recipes-count {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-ghost);
          margin-top: 0.5rem;
        }
        .recipes-search { margin-bottom: 2rem; }
        .recipes-search__input {
          width: 100%;
          max-width: 480px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 0;
          color: var(--text-primary);
          font-family: "Shippori Mincho", serif;
          font-size: 0.95rem;
          padding: 0.65rem 1rem;
          transition: border-color 0.2s ease;
        }
        .recipes-search__input:focus {
          outline: none;
          border-color: var(--cinnabar);
        }
        .recipes-search__input::placeholder { color: var(--text-ghost); }
        .recipes-error, .recipes-empty {
          margin-bottom: 2rem;
          font-family: "Shippori Mincho", serif;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .recipes-empty__link { color: var(--cinnabar); text-decoration: none; }
        .recipes-empty__link:hover { text-decoration: underline; }
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: var(--border);
          margin-bottom: 3rem;
        }
        .recipes-footer { padding-top: 1.5rem; border-top: 1px solid var(--border); }
        @media (max-width: 768px) {
          .recipes-shell { padding: 1.5rem 1.5rem 4rem; }
          .recipes-grid { grid-template-columns: 1fr; }
        }
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </ZoneLayout>
  );
}

function RecipeCard({ recipe }: { recipe: ParsedRecipe }) {
  const slug = slugify(recipe.title);
  const zone = zoneForSlug(slug);
  const accent = ZONE_ACCENTS[zone].accent;
  const kanji = ZONE_ACCENTS[zone].kanji;

  return (
    <Link
      to={`/recipes/${slug}`}
      className="recipe-card card"
      style={{ "--zone-accent": accent } as React.CSSProperties}
    >
      <span className="recipe-card__zone">
        {kanji} {ZONE_ACCENTS[zone].name}
      </span>
      <h2 className="recipe-card__title">{recipe.title}</h2>
      {recipe.tagline && (
        <p className="recipe-card__tagline">
          {recipe.tagline.slice(0, 140)}
          {recipe.tagline.length > 140 ? "…" : ""}
        </p>
      )}
      <div className="recipe-card__meta">
        <span>{recipe.meta.serves}</span>
        <span className="recipe-card__sep">·</span>
        <span>{recipe.meta.time}</span>
      </div>
      <span className="recipe-card__cta">Cook it →</span>

      <style>{`
        .recipe-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          border-top: 2px solid var(--zone-accent, var(--cinnabar));
          transition: background 0.2s ease;
        }
        .recipe-card:hover { background: var(--card-hover); }
        .recipe-card__zone {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--zone-accent, var(--cinnabar));
          display: block;
          margin-bottom: 0.6rem;
        }
        .recipe-card__title {
          font-family: "Kaisei Decol", serif;
          font-weight: 400;
          font-size: 1.25rem;
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 0.75rem;
        }
        .recipe-card__tagline {
          font-family: "Shippori Mincho", serif;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.65;
          flex: 1;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .recipe-card__meta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-ghost);
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .recipe-card__sep { color: var(--border-hi); }
        .recipe-card__cta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--zone-accent, var(--cinnabar));
          align-self: flex-start;
        }
      `}</style>
    </Link>
  );
}
