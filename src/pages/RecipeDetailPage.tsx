// src/pages/RecipeDetailPage.tsx
// Loads a single recipe by slug and renders the full Recipe component.

import { useParams, Link } from "react-router-dom";
import { Recipe } from "../components/recipe/Recipe";
import { useRecipe } from "../hooks/useRecipes";
import { ZoneLayout } from "../components/ui/ZoneLayout";

export function RecipeDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { recipe, loading, error } = useRecipe(slug);

  if (loading) {
    return (
      <ZoneLayout zone="garden">
        <div className="page-loading">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading…</span>
          <style>{`
            .page-loading {
              display: flex; align-items: center; gap: 1rem;
              padding: 4rem 3.5rem;
              font-family: "JetBrains Mono", monospace;
              font-size: 0.65rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--text-ghost);
            }
            .loading-spinner {
              display: inline-block;
              width: 16px; height: 16px;
              border: 1.5px solid var(--border);
              border-top-color: var(--cinnabar);
              border-radius: 50%;
              animation: shurikenSpin 0.8s linear infinite;
            }
          `}</style>
        </div>
      </ZoneLayout>
    );
  }

  if (error || !recipe) {
    return (
      <ZoneLayout zone="mountain">
        <div className="page-error">
          <span className="eyebrow">404</span>
          <h1 className="section-heading">Recipe not found</h1>
          <p className="page-error__msg">
            {error ?? "That recipe doesn't exist or has been removed."}
          </p>
          <Link to="/recipes" className="btn-ghost">
            ← Back to recipes
          </Link>
          <style>{`
            .page-error {
              padding: 4rem 3.5rem;
              max-width: 600px;
            }
            .page-error__msg {
              font-family: "Shippori Mincho", serif;
              color: var(--text-muted);
              margin-bottom: 2rem;
              margin-top: 0.75rem;
            }
          `}</style>
        </div>
      </ZoneLayout>
    );
  }

  return (
    <Recipe
      recipe={recipe}
      slug={slug}
      buildTagHref={(tag) => `/recipes?tag=${encodeURIComponent(tag)}`}
    />
  );
}

// ─── AddRecipePage ────────────────────────────────────────────────────────────
// src/pages/AddRecipePage.tsx
// Two flows: scrape from URL or write markdown directly.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { scrapeUrl, saveRecipe } from "../hooks/useRecipes";

export function AddRecipePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"url" | "manual">("url");

  // URL scrape state
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapePartial, setScrapePartial] = useState(false);

  // Markdown editor state
  const [markdown, setMarkdown] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setScraping(true);
    setScrapeError(null);
    setScrapePartial(false);
    setMarkdown("");

    try {
      const result = await scrapeUrl(url.trim());
      if (result.ok && result.markdown) {
        setMarkdown(result.markdown);
        setScrapePartial(result.partial ?? false);
        setTab("manual"); // move to editor so cook can review
      } else {
        setScrapeError(result.error ?? "Scrape failed for an unknown reason.");
      }
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : String(err));
    } finally {
      setScraping(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!markdown.trim()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const slug = await saveRecipe(markdown);
      await navigate(`/recipes/${slug}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
      setSaving(false);
    }
  }

  return (
    <ZoneLayout zone="village">
      <div className="add-shell">
        <span className="eyebrow">加 · Add Recipe</span>
        <h1 className="section-heading">Add a Recipe</h1>

        {/* Tab switcher */}
        <div className="add-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "url"}
            className={`add-tab${tab === "url" ? " add-tab--active" : ""}`}
            onClick={() => setTab("url")}
          >
            Scrape from URL
          </button>
          <button
            role="tab"
            aria-selected={tab === "manual"}
            className={`add-tab${tab === "manual" ? " add-tab--active" : ""}`}
            onClick={() => setTab("manual")}
          >
            Write Markdown
          </button>
        </div>

        {/* URL scraper */}
        {tab === "url" && (
          <div className="add-panel">
            <p className="add-panel__desc">
              Paste a recipe URL and we'll scrape it into the cookbook format. Works best with
              structured sites (NYT Cooking, Serious Eats, etc.). You'll be able to review and edit
              before saving.
            </p>
            <form onSubmit={handleScrape} className="add-url-form" noValidate>
              <label htmlFor="recipe-url" className="add-label">
                Recipe URL
              </label>
              <div className="add-url-form__row">
                <input
                  id="recipe-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.seriouseats.com/recipe-name"
                  className="add-input"
                  disabled={scraping}
                  required
                />
                <button
                  type="submit"
                  className="btn-primary add-url-form__btn"
                  disabled={scraping || !url.trim()}
                >
                  {scraping ? "Scraping…" : "Scrape →"}
                </button>
              </div>
              {scrapeError && (
                <p className="add-error" role="alert">
                  {scrapeError}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Markdown editor */}
        {tab === "manual" && (
          <div className="add-panel">
            {scrapePartial && (
              <div className="add-notice" role="status">
                Partial scrape — some fields may be missing. Review and fill in the blanks before
                saving.
              </div>
            )}
            {!markdown && (
              <p className="add-panel__desc">
                Write or paste your recipe in the markdown format used by the cookbook. Headers,
                ingredient tables, and method sections are parsed automatically.
              </p>
            )}
            <form onSubmit={handleSave} noValidate>
              <label htmlFor="recipe-md" className="add-label">
                Recipe markdown
              </label>
              <textarea
                id="recipe-md"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="add-textarea"
                rows={28}
                placeholder={MARKDOWN_PLACEHOLDER}
                disabled={saving}
                spellCheck={false}
              />
              {saveError && (
                <p className="add-error" role="alert">
                  {saveError}
                </p>
              )}
              <div className="add-actions">
                <button type="submit" className="btn-primary" disabled={saving || !markdown.trim()}>
                  {saving ? "Saving…" : "Save recipe"}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setMarkdown("")}
                  disabled={!markdown}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .add-shell {
          padding: 3rem 3.5rem 6rem;
          max-width: 800px;
        }
        .add-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 2rem;
        }
        .add-tab {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-ghost);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
          margin-bottom: -1px;
        }
        .add-tab:hover { color: var(--text-muted); }
        .add-tab--active {
          color: var(--cinnabar);
          border-bottom-color: var(--cinnabar);
        }
        .add-panel__desc {
          font-family: "Shippori Mincho", serif;
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 60ch;
          margin-bottom: 1.5rem;
        }
        .add-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-ghost);
          display: block;
          margin-bottom: 0.5rem;
        }
        .add-url-form__row {
          display: flex;
          gap: 0.75rem;
          align-items: stretch;
          flex-wrap: wrap;
        }
        .add-input {
          flex: 1;
          min-width: 240px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 0;
          color: var(--text-primary);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.8rem;
          padding: 0.65rem 1rem;
          transition: border-color 0.2s ease;
        }
        .add-input:focus {
          outline: none;
          border-color: var(--cinnabar);
        }
        .add-url-form__btn { white-space: nowrap; }
        .add-error {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--cinnabar);
          margin-top: 0.75rem;
        }
        .add-notice {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--cinnabar-warm);
          border: 1px solid var(--cinnabar-warm);
          padding: 0.6rem 1rem;
          margin-bottom: 1rem;
        }
        .add-textarea {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.78rem;
          line-height: 1.65;
          padding: 1rem;
          resize: vertical;
          transition: border-color 0.2s ease;
          tab-size: 2;
        }
        .add-textarea:focus {
          outline: none;
          border-color: var(--cinnabar);
        }
        .add-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .add-shell { padding: 1.5rem 1.5rem 4rem; }
          .add-url-form__row { flex-direction: column; }
        }
      `}</style>
    </ZoneLayout>
  );
}

const MARKDOWN_PLACEHOLDER = `# Recipe Title

> A one-sentence description — what makes this dish distinctive.

**Serves:** 4 | **Time:** ~30 minutes

---

## Ingredients

| Qty | Ingredient |
|-----|------------|
| 2 tbsp | Olive oil |
| 1 medium | Onion, finely diced |

---

## Method

### 1. Step title
Step description.

---

## Notes

**Tip label:** Any technique notes, substitutions, make-ahead advice.
`;
