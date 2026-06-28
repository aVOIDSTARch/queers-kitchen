/**
 * index.ts
 * Public API of the recipe-parser module.
 *
 * Usage:
 *   import { parseRecipeMarkdown, recipeToPageProps } from "./recipe-parser";
 *   import type { RecipePageProps, RecipeCardProps } from "./recipe-parser";
 */

// ── Types (re-exported for consumers) ─────────────────────────────────────────
export type {
  // Core document types
  IngredientRow,
  IngredientGroup,
  RecipeStep,
  RecipeNote,
  RecipeMeta,
  ParsedRecipe,

  // React component prop types — top-level pages
  RecipePageProps,
  ScaledRecipePageProps,
  CookbookIndexProps,

  // React component prop types — section-level
  RecipeHeroProps,
  IngredientsPanelProps,
  IngredientGroupProps,
  IngredientRowProps,
  MethodSectionProps,
  StepCardProps,
  NotesSectionProps,
  NoteItemProps,

  // Recipe card (listing pages)
  RecipeCardProps,
} from "../../types/types";

// ── Parser ────────────────────────────────────────────────────────────────────
export { parseRecipeMarkdown } from "./parser";

// ── Props builders ────────────────────────────────────────────────────────────
export {
  recipeToPageProps,
  recipeToCardProps,
  buildCookbookIndexProps,
  scaleRecipePageProps,
} from "./props";
