/**
 * props.ts
 * Transforms a ParsedRecipe into the full set of React component props.
 *
 * This is the bridge between the parser output and the component layer.
 * It handles shape normalization, index injection, and the slug derivation
 * so components receive clean, predictable props with no parsing logic
 * leaking into the rendering tier.
 */

import type {
  ParsedRecipe,
  IngredientRow,
  RecipePageProps,
  RecipeHeroProps,
  IngredientsPanelProps,
  IngredientGroupProps,
  IngredientRowProps,
  MethodSectionProps,
  StepCardProps,
  NotesSectionProps,
  NoteItemProps,
  RecipeCardProps,
  CookbookIndexProps,
  ScaledRecipePageProps,
} from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildHeroProps(
  recipe: ParsedRecipe,
  overrides?: Pick<RecipeHeroProps, "imageUrl" | "imageAlt">,
): RecipeHeroProps {
  return {
    title: recipe.title,
    tagline: recipe.tagline,
    serves: recipe.meta.serves,
    time: recipe.meta.time,
    imageUrl: overrides?.imageUrl,
    imageAlt: overrides?.imageAlt ?? recipe.title,
  };
}

function buildIngredientRowProps(row: IngredientRow, index: number): IngredientRowProps {
  return {
    qty: row.qty,
    name: row.name,
    index,
  };
}

function buildIngredientsPanelProps(recipe: ParsedRecipe): IngredientsPanelProps {
  const groups: IngredientGroupProps[] = recipe.ingredientGroups.map((group, groupIndex) => ({
    groupName: group.groupName,
    ingredients: group.ingredients.map((row, rowIndex) => buildIngredientRowProps(row, rowIndex)),
    groupIndex,
  }));

  const totalCount = groups.reduce((sum, g) => sum + g.ingredients.length, 0);

  return { groups, totalCount };
}

function buildMethodSectionProps(recipe: ParsedRecipe): MethodSectionProps {
  const steps: StepCardProps[] = recipe.steps.map((step, index) => ({
    stepNumber: step.stepNumber,
    title: step.title,
    body: step.body,
    index,
    isLast: index === recipe.steps.length - 1,
  }));

  return {
    steps,
    totalSteps: steps.length,
  };
}

function buildNotesSectionProps(recipe: ParsedRecipe): NotesSectionProps {
  const notes: NoteItemProps[] = recipe.notes.map((note, index) => ({
    label: note.label,
    body: note.body,
    index,
  }));

  return { notes };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convert a fully parsed recipe into the complete set of React page props.
 *
 * @param recipe      Output of parseRecipeMarkdown()
 * @param imageUrl    Optional hero image URL (not in markdown; inject separately)
 * @param imageAlt    Optional image alt text (defaults to recipe title)
 * @param slugOverride Optional slug override (defaults to slugified title)
 *
 * @example
 * const md = fs.readFileSync("celeriac-kimchi-remoulade.md", "utf-8");
 * const recipe = parseRecipeMarkdown(md, "celeriac-kimchi-remoulade.md");
 * const props = recipeToPageProps(recipe);
 * // → RecipePageProps ready to pass to <RecipePage {...props} />
 */
export function recipeToPageProps(
  recipe: ParsedRecipe,
  options: {
    imageUrl?: string;
    imageAlt?: string;
    slugOverride?: string;
  } = {},
): RecipePageProps {
  return {
    hero: buildHeroProps(recipe, {
      imageUrl: options.imageUrl,
      imageAlt: options.imageAlt,
    }),
    ingredients: buildIngredientsPanelProps(recipe),
    method: buildMethodSectionProps(recipe),
    notes: buildNotesSectionProps(recipe),
    slug: options.slugOverride ?? slugify(recipe.title),
  };
}

/**
 * Build a lightweight summary card for a recipe listing/index page.
 *
 * @example
 * const cards = recipes.map(r => recipeToCardProps(r));
 * // → RecipeCardProps[] ready to pass to <CookbookIndex recipes={cards} />
 */
export function recipeToCardProps(
  recipe: ParsedRecipe,
  options: {
    imageUrl?: string;
    imageAlt?: string;
    slugOverride?: string;
  } = {},
): RecipeCardProps {
  return {
    title: recipe.title,
    tagline: recipe.tagline,
    serves: recipe.meta.serves,
    time: recipe.meta.time,
    slug: options.slugOverride ?? slugify(recipe.title),
    imageUrl: options.imageUrl,
    imageAlt: options.imageAlt ?? recipe.title,
  };
}

/**
 * Build the full cookbook index props from an array of parsed recipes.
 *
 * @example
 * const index = buildCookbookIndexProps(allRecipes);
 * // → CookbookIndexProps ready to pass to <CookbookIndex {...index} />
 */
export function buildCookbookIndexProps(
  recipes: ParsedRecipe[],
  imageMap: Record<string, string> = {},
): CookbookIndexProps {
  const cards = recipes.map((r) => {
    const slug = slugify(r.title);
    return recipeToCardProps(r, {
      imageUrl: imageMap[slug],
      slugOverride: slug,
    });
  });

  return {
    recipes: cards,
    totalCount: cards.length,
  };
}

/**
 * Produce a scaled version of RecipePageProps, adjusting the serves label
 * and attaching scaling metadata. Note: this adjusts the *display* of serves
 * only. Actual ingredient quantity scaling requires the measurements module.
 *
 * @param base      Base RecipePageProps to scale
 * @param factor    Multiplier (e.g. 2 for double, 0.5 for half)
 *
 * @example
 * const doubled = scaleRecipePageProps(props, 2);
 * // → ScaledRecipePageProps with scaleFactor: 2
 */
export function scaleRecipePageProps(base: RecipePageProps, factor: number): ScaledRecipePageProps {
  const originalServes = base.hero.serves;

  // Attempt to scale a numeric or range serves string.
  const scaledServes = scaleServesString(originalServes, factor);

  return {
    ...base,
    hero: {
      ...base.hero,
      serves: scaledServes,
    },
    originalServes,
    scaleFactor: factor,
  };
}

/**
 * Scale a serves string like "4–6" or "4 (yields ~0.8L jar)" by a factor.
 * Non-numeric trailing content is preserved.
 */
function scaleServesString(serves: string, factor: number): string {
  // Match a leading number or range: "4", "4–6", "4-6"
  const rangeMatch = serves.match(/^(\d+)\s*[–-]\s*(\d+)(.*)/);
  if (rangeMatch) {
    const lo = Math.round(parseInt(rangeMatch[1], 10) * factor);
    const hi = Math.round(parseInt(rangeMatch[2], 10) * factor);
    return `${lo}–${hi}${rangeMatch[3]}`;
  }

  const singleMatch = serves.match(/^(\d+)(.*)/);
  if (singleMatch) {
    const n = Math.round(parseInt(singleMatch[1], 10) * factor);
    return `${n}${singleMatch[2]}`;
  }

  // Non-numeric serves string — return unchanged
  return serves;
}
