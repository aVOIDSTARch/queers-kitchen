/**
 * recipe-component-types.ts
 * UI-layer types for the Recipe component tree.
 * Extends the parser prop types with control state, cook notes persistence,
 * tag taxonomy, and footer branding — none of which belong in the parser tier.
 */

import type {
  RecipeHeroProps,
  IngredientsPanelProps,
  MethodSectionProps,
  NotesSectionProps,
} from "./types";

import type { MeasurementSystem } from "./measure-types";

export type { MeasurementSystem };

// ─── Controls ─────────────────────────────────────────────────────────────────

export interface ControlsProps {
  /** Current measurement display system. */
  measurementSystem: MeasurementSystem;
  onMeasurementSystemChange: (system: MeasurementSystem) => void;

  /** Current serving multiplier relative to the recipe's base serves. */
  scaleFactor: number;
  /** The recipe's base serves string, shown alongside the adjuster. */
  baseServes: string;
  onScaleFactorChange: (factor: number) => void;

  /** Minimum allowed scale factor. Default: 0.25 */
  minScale?: number;
  /** Maximum allowed scale factor. Default: 8 */
  maxScale?: number;
  /** Step increment for plus/minus buttons. Default: 0.5 */
  scaleStep?: number;
}

// ─── Cook Notes ───────────────────────────────────────────────────────────────

/** A single note entry written by the cook. */
export interface CookNote {
  id: string; // UUID, generated client-side
  recipeSlug: string; // ties the note to this recipe
  body: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CookNotesProps {
  recipeSlug: string;
  /** Parsed recipe notes from the markdown (read-only, editorial). */
  editorialNotes: NotesSectionProps;
  /** Cook-authored notes loaded from storage. */
  cookNotes: CookNote[];
  onAddNote: (body: string) => void;
  onUpdateNote: (id: string, body: string) => void;
  onDeleteNote: (id: string) => void;
}

// ─── Recipe Hero ──────────────────────────────────────────────────────────────

/** Fallback image used when no imageUrl is supplied. */
export const DEFAULT_HERO_IMAGE = "/images/recipe-placeholder.jpg";

export interface RecipeHeaderProps extends RecipeHeroProps {
  /** ISO 8601 date string for when this recipe was added to the site. */
  addedAt?: string;
  /** Free-form source attribution: URL, book name, person, etc. */
  source?: string;
  /** Slug is needed so the header can construct shareable links. */
  slug: string;
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

export interface IngredientsProps extends IngredientsPanelProps {
  measurementSystem: MeasurementSystem;
  scaleFactor: number;
}

// ─── Instructions ─────────────────────────────────────────────────────────────

export interface InstructionsProps extends MethodSectionProps {
  /** Tracks which step the cook has ticked off. */
  completedSteps: Set<number>;
  onStepToggle: (stepIndex: number) => void;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface FooterProps {
  tags: string[];
  /** Override the copyright year. Defaults to current year. */
  copyrightYear?: number;
}

// ─── Top-level Recipe props ───────────────────────────────────────────────────

export interface RecipeProps {
  // ── Identity ────────────────────────────────────────────────────────────────
  slug: string;
  title: string;
  tagline: string;
  imageUrl?: string;
  imageAlt?: string;
  addedAt?: string;
  source?: string;
  tags?: string[];

  // ── Content ─────────────────────────────────────────────────────────────────
  ingredients: IngredientsPanelProps;
  method: MethodSectionProps;
  /** Editorial notes parsed from the markdown. */
  editorialNotes: NotesSectionProps;

  // ── Serving metadata ─────────────────────────────────────────────────────────
  serves: string;
  time: string;

  // ── Optional overrides ───────────────────────────────────────────────────────
  /** Initial measurement system. Default: "english" */
  defaultMeasurementSystem?: MeasurementSystem;
  /** Initial scale factor. Default: 1 */
  defaultScaleFactor?: number;
}
