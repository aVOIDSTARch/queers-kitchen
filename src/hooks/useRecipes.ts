// src/hooks/useRecipes.ts
// Client-side data fetching hooks for the /api/recipes endpoints.

import { useState, useEffect, useCallback } from "react";
import type { ParsedRecipe } from "../../recipe-parser/types";

// ─── useRecipeList ────────────────────────────────────────────────────────────

interface RecipeListState {
  recipes: ParsedRecipe[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useRecipeList(): RecipeListState {
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/recipes")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ recipes: ParsedRecipe[] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setRecipes(data.recipes);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { recipes, loading, error, reload };
}

// ─── useRecipe ────────────────────────────────────────────────────────────────

interface RecipeState {
  recipe: ParsedRecipe | null;
  loading: boolean;
  error: string | null;
}

export function useRecipe(slug: string): RecipeState {
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/recipes/${slug}`)
      .then((r) => {
        if (r.status === 404) throw new Error("Recipe not found.");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ recipe: ParsedRecipe }>;
      })
      .then((data) => {
        if (!cancelled) {
          setRecipe(data.recipe);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { recipe, loading, error };
}

// ─── saveRecipe ───────────────────────────────────────────────────────────────

export async function saveRecipe(markdown: string, slug?: string): Promise<string> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, slug }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Save failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as { slug: string };
  return data.slug;
}

// ─── deleteRecipe ─────────────────────────────────────────────────────────────

export async function deleteRecipe(slug: string): Promise<void> {
  const res = await fetch(`/api/recipes/${slug}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: HTTP ${res.status}`);
}

// ─── scrapeUrl ────────────────────────────────────────────────────────────────

export interface ScrapeResult {
  ok: boolean;
  markdown?: string;
  slug?: string;
  error?: string;
  partial?: boolean;
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const res = await fetch("/api/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json() as Promise<ScrapeResult>;
}
