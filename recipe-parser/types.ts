/**
 * types.ts
 * All TypeScript types for the cookbook recipe system.
 * Derived from the actual markdown structure used in the Cookbook folder.
 *
 * Markdown schema observed:
 *   # Title
 *   > Tagline (blockquote)
 *   **Serves:** X | **Time:** ~Y minutes
 *   ---
 *   ## Ingredients
 *   ### Optional Section Name
 *   | Qty | Ingredient |
 *   |-----|------------|
 *   | ... | ...        |
 *   ---
 *   ## Method
 *   ### 1. Step Title
 *   Step body prose
 *   ---
 *   ## Notes
 *   **Bold label:** prose...
 */

// ─── Primitive building blocks ────────────────────────────────────────────────

/** A raw quantity + ingredient name pair from a markdown table row. */
export interface IngredientRow {
  qty: string; // "2 tbsp", "1 medium", "½ cup", "300g", ""
  name: string; // Full ingredient description as written
}

/** A named group of ingredients (e.g. "Vinaigrette", "Brine", "To Finish"). */
export interface IngredientGroup {
  /** Undefined when there is only one ungrouped ingredient list. */
  groupName?: string;
  ingredients: IngredientRow[];
}

/** A single numbered or unnumbered method step. */
export interface RecipeStep {
  /** e.g. "1. Soak the capers" → number: 1, title: "Soak the capers" */
  stepNumber?: number;
  title: string;
  body: string; // Full prose for this step, normalized whitespace
}

/**
 * A note from the Notes section.
 * Notes are keyed by their bold label when present, or left labelless.
 * e.g. "**Cut, don't grate:** A box grater..." → label: "Cut, don't grate", body: "A box grater..."
 */
export interface RecipeNote {
  label?: string;
  body: string;
}

// ─── Top-level recipe document ────────────────────────────────────────────────

export interface RecipeMeta {
  serves: string; // e.g. "4–6", "4 (yields ~0.8L jar)", "2"
  time: string; // e.g. "~25 minutes", "~30 minutes active + 1 hr brining + 1–2 days fermentation"
  /** Optional source attribution if present in the markdown */
  source?: string;
}

/**
 * The fully parsed representation of a recipe markdown file.
 * Every field maps directly to a section of the markdown format.
 */
export interface ParsedRecipe {
  /** From the # H1 heading */
  title: string;
  /** From the > blockquote immediately after the title */
  tagline: string;
  meta: RecipeMeta;
  /** One or more ingredient groups. Ungrouped recipes have a single group with no groupName. */
  ingredientGroups: IngredientGroup[];
  steps: RecipeStep[];
  notes: RecipeNote[];
  /** Raw markdown source, preserved for debugging or re-rendering */
  rawMarkdown: string;
}

// ─── React component prop types ───────────────────────────────────────────────
// Each interface is the exact props shape for a distinct recipe site component.

/** Props for the top hero/header section of a recipe page. */
export interface RecipeHeroProps {
  title: string;
  tagline: string;
  serves: string;
  time: string;
  /** Optional: path or URL to a hero image. Not parsed from markdown — injected separately. */
  imageUrl?: string;
  imageAlt?: string;
}

/** Props for a single ingredient row within a table. */
export interface IngredientRowProps {
  qty: string;
  name: string;
  /** Index within its group — useful for zebra striping. */
  index: number;
}

/** Props for one ingredient group (optionally titled). */
export interface IngredientGroupProps {
  groupName?: string;
  ingredients: IngredientRowProps[];
  /** Index of this group within the full list — useful for layout decisions. */
  groupIndex: number;
}

/** Props for the full ingredients panel, containing one or more groups. */
export interface IngredientsPanelProps {
  groups: IngredientGroupProps[];
  /** Total ingredient count across all groups — convenient for display. */
  totalCount: number;
}

/** Props for a single method step card. */
export interface StepCardProps {
  stepNumber?: number;
  title: string;
  body: string;
  /** Index within steps array — used for progress indicators. */
  index: number;
  /** Whether this is the last step — lets the component suppress a trailing divider. */
  isLast: boolean;
}

/** Props for the full method section. */
export interface MethodSectionProps {
  steps: StepCardProps[];
  totalSteps: number;
}

/** Props for one note entry. */
export interface NoteItemProps {
  label?: string;
  body: string;
  index: number;
}

/** Props for the full notes section. */
export interface NotesSectionProps {
  notes: NoteItemProps[];
}

/**
 * The aggregate props object used to hydrate an entire recipe page.
 * Pass this to a top-level <RecipePage /> component, or destructure
 * and pass individual sections to their respective components.
 */
export interface RecipePageProps {
  hero: RecipeHeroProps;
  ingredients: IngredientsPanelProps;
  method: MethodSectionProps;
  notes: NotesSectionProps;
  /** Slug derived from the markdown filename or title — useful for routing. */
  slug: string;
}

// ─── Scaling overlay ──────────────────────────────────────────────────────────

/**
 * When the user adjusts the serving multiplier, the site can request
 * a rescaled version. This type carries the multiplier for display
 * alongside the original props.
 */
export interface ScaledRecipePageProps extends RecipePageProps {
  originalServes: string;
  scaleFactor: number;
}

// ─── Cookbook index ───────────────────────────────────────────────────────────

/** Summary card props for a recipe listing page. */
export interface RecipeCardProps {
  title: string;
  tagline: string;
  serves: string;
  time: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
}

/** Props for the full cookbook index/listing page. */
export interface CookbookIndexProps {
  recipes: RecipeCardProps[];
  totalCount: number;
}
