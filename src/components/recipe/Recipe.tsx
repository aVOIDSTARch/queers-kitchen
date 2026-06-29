// src/components/recipe/Recipe.tsx
// Top-level recipe page. Picks a random parallax zone on mount.
// Owns all state: measurement system, scale factor, step completion, cook notes.

import { useState, useEffect, useCallback } from "react";
import { ZoneLayout } from "../ui/ZoneLayout";
import { RecipeHeader } from "./RecipeHeader";
import { Controls, Ingredients, Instructions, Notes, RecipeFooter } from "./RecipeBody";
import { randomZone, ZONE_ACCENTS, type ZoneName } from "../../lib/scenes";
import type { ParsedRecipe } from "../../../recipe-parser/types";
import { recipeToPageProps } from "../../../recipe-parser/props";

interface Props {
  recipe: ParsedRecipe;
  slug: string;
  tags?: string[];
  imageUrl?: string;
  addedAt?: string;
  source?: string;
  buildTagHref?: (tag: string) => string;
}

interface CookNote {
  id: string;
  recipeSlug: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

function storageKey(slug: string) {
  return `qkc:notes:${slug}`;
}

function loadNotes(slug: string): CookNote[] {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(slug: string, notes: CookNote[]) {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(notes));
  } catch {}
}

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function Recipe({
  recipe,
  slug,
  tags = [],
  imageUrl,
  addedAt,
  source,
  buildTagHref,
}: Props) {
  const props = recipeToPageProps(recipe, { imageUrl, slugOverride: slug });

  // Random zone chosen once on mount — changes each page load
  const [zone] = useState<ZoneName>(() => randomZone());
  const accent = ZONE_ACCENTS[zone].accent;

  const [measurementSystem, setMeasurementSystem] = useState<"english" | "metric">("english");
  const [scaleFactor, setScaleFactor] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => new Set());
  const [cookNotes, setCookNotes] = useState<CookNote[]>(() => loadNotes(slug));

  useEffect(() => {
    saveNotes(slug, cookNotes);
  }, [slug, cookNotes]);

  const handleStepToggle = useCallback((i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }, []);

  const handleAddNote = useCallback(
    (body: string) => {
      const now = new Date().toISOString();
      setCookNotes((prev) => [
        { id: genId(), recipeSlug: slug, body, createdAt: now, updatedAt: now },
        ...prev,
      ]);
    },
    [slug],
  );

  const handleUpdateNote = useCallback((id: string, body: string) => {
    setCookNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, body, updatedAt: new Date().toISOString() } : n)),
    );
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setCookNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <ZoneLayout zone={zone}>
      <article data-component="Recipe" data-slug={slug}>
        {/* ── Header: title, tagline, image, meta ─────────────────────── */}
        <RecipeHeader
          title={props.hero.title}
          tagline={props.hero.tagline}
          serves={props.hero.serves}
          time={props.hero.time}
          imageUrl={imageUrl}
          addedAt={addedAt}
          source={source}
          zone={zone}
        />

        {/* ── Notes: editorial + cook-authored ─────────────────────────── */}
        <Notes
          editorialNotes={props.notes}
          cookNotes={cookNotes}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          zoneAccent={accent}
        />

        {/* ── Controls ──────────────────────────────────────────────────── */}
        <Controls
          measurementSystem={measurementSystem}
          onMeasurementSystemChange={setMeasurementSystem}
          scaleFactor={scaleFactor}
          baseServes={props.hero.serves}
          onScaleFactorChange={setScaleFactor}
          zoneAccent={accent}
        />

        {/* ── Body: Ingredients (1/3) + Instructions (2/3) ─────────────── */}
        <div className="recipe-body">
          <Ingredients
            {...props.ingredients}
            measurementSystem={measurementSystem}
            scaleFactor={scaleFactor}
            zoneAccent={accent}
          />
          <Instructions
            {...props.method}
            completedSteps={completedSteps}
            onStepToggle={handleStepToggle}
            zoneAccent={accent}
          />
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <RecipeFooter tags={tags} buildTagHref={buildTagHref} zoneAccent={accent} />
      </article>

      <style>{`
        [data-component="Recipe"] {
          background: var(--bg-primary);
        }
        .recipe-body {
          display: grid;
          grid-template-columns: 1fr 2fr;
          border-top: 1px solid var(--border);
          min-height: 50vh;
        }
        .recipe-body > :first-child {
          border-right: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .recipe-body {
            grid-template-columns: 1fr;
          }
          .recipe-body > :first-child {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
    </ZoneLayout>
  );
}
