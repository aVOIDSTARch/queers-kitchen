// src/lib/scraper.ts
// Recipe URL scraper.
// Strategy (in order, fails gracefully to next):
//   1. JSON-LD schema.org/Recipe  (most structured sites)
//   2. Microdata / ld+json arrays
//   3. Open Graph + heuristic HTML extraction
//   4. Returns a partial result with whatever it found — never throws to caller.

export interface ScrapeResult {
  ok: boolean;
  markdown?: string;
  slug?: string;
  error?: string;
  partial?: boolean; // true when some but not all fields were found
}

interface SchemaRecipe {
  name?: string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: Array<{ text?: string; name?: string } | string>;
  recipeYield?: string | number | string[];
  totalTime?: string;
  cookTime?: string;
  prepTime?: string;
  author?: { name?: string } | string;
  url?: string;
}

// ─── Public entry point ───────────────────────────────────────────────────────

export async function scrapeRecipeUrl(url: string): Promise<ScrapeResult> {
  try {
    new URL(url); // validate
  } catch {
    return { ok: false, error: "Invalid URL." };
  }

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; QKC-Cookbook-Bot/1.0)",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.9",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status} from ${url}` };
    html = await res.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Fetch failed: ${msg}` };
  }

  // 1. Try JSON-LD
  const jsonLd = extractJsonLd(html);
  if (jsonLd) {
    return buildResult(jsonLd, url);
  }

  // 2. Heuristic HTML fallback
  const heuristic = extractHeuristic(html, url);
  if (heuristic) {
    return { ...buildResult(heuristic, url), partial: true };
  }

  return {
    ok: false,
    error:
      "Could not find recipe data on that page. The site may block scraping or use a format we don't recognise.",
  };
}

// ─── JSON-LD extraction ───────────────────────────────────────────────────────

function extractJsonLd(html: string): SchemaRecipe | null {
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const recipe = findRecipeNode(data);
      if (recipe) return recipe;
    } catch {
      // malformed JSON — continue
    }
  }
  return null;
}

function findRecipeNode(data: unknown): SchemaRecipe | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  // Direct recipe
  if (typeof obj["@type"] === "string" && obj["@type"].toLowerCase().includes("recipe")) {
    return obj as SchemaRecipe;
  }

  // @type array
  if (
    Array.isArray(obj["@type"]) &&
    (obj["@type"] as string[]).some((t) => t.toLowerCase().includes("recipe"))
  ) {
    return obj as SchemaRecipe;
  }

  // @graph array
  if (Array.isArray(obj["@graph"])) {
    for (const node of obj["@graph"]) {
      const found = findRecipeNode(node);
      if (found) return found;
    }
  }

  // Nested @graph
  if (obj["@graph"] && typeof obj["@graph"] === "object") {
    return findRecipeNode(obj["@graph"]);
  }

  return null;
}

// ─── Heuristic HTML fallback ──────────────────────────────────────────────────

function extractHeuristic(html: string, url: string): SchemaRecipe | null {
  const title =
    firstMatch(html, /<h1[^>]*>([^<]{4,120})<\/h1>/i) ??
    firstMatch(html, /<title>([^<]{4,120})<\/title>/i);

  if (!title) return null;

  // Look for ingredient list items
  const ingredientRe = /<li[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  const ingredients: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = ingredientRe.exec(html)) !== null) {
    const text = stripTags(m[1]).trim();
    if (text) ingredients.push(text);
  }

  // Look for instruction steps
  const stepRe =
    /<(?:li|p)[^>]*class="[^"]*(?:instruction|step|direction)[^"]*"[^>]*>([\s\S]*?)<\/(?:li|p)>/gi;
  const steps: string[] = [];
  while ((m = stepRe.exec(html)) !== null) {
    const text = stripTags(m[1]).trim();
    if (text && text.length > 15) steps.push(text);
  }

  if (!ingredients.length && !steps.length) return null;

  return {
    name: stripTags(title).trim(),
    description:
      firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,300})["']/i) ??
      undefined,
    recipeIngredient: ingredients.length ? ingredients : undefined,
    recipeInstructions: steps.map((t) => ({ text: t })),
    url,
  };
}

// ─── Markdown builder ─────────────────────────────────────────────────────────

function buildResult(recipe: SchemaRecipe, sourceUrl: string): ScrapeResult {
  const title = recipe.name?.trim() ?? "Untitled Recipe";

  const serves = normaliseYield(recipe.recipeYield);
  const time = normaliseTime(recipe.totalTime ?? recipe.cookTime ?? recipe.prepTime);
  const source = recipe.url ?? sourceUrl;

  const tagline = recipe.description?.replace(/\s+/g, " ").trim().slice(0, 280) ?? "";

  const ingredientLines = (recipe.recipeIngredient ?? []).map((i) => {
    const text = i.trim();
    // Try to split "1 cup flour" into qty | name
    const parts = text.match(/^([\d\s/½⅓¼¾⅛⅜⅝⅞.,-]+(?:\s+[a-z]+)?)\s+(.+)$/i);
    if (parts) return `| ${parts[1].trim()} | ${parts[2].trim()} |`;
    return `|  | ${text} |`;
  });

  const stepLines = flattenInstructions(recipe.recipeInstructions ?? []);

  const authorName = typeof recipe.author === "string" ? recipe.author : recipe.author?.name;

  const markdown = [
    `# ${title}`,
    "",
    tagline ? `> ${tagline}` : `> A recipe scraped from the web.`,
    "",
    `**Serves:** ${serves} | **Time:** ${time}`,
    "",
    "---",
    "",
    "## Ingredients",
    "",
    "| Qty | Ingredient |",
    "|-----|------------|",
    ...ingredientLines,
    "",
    "---",
    "",
    "## Method",
    "",
    ...stepLines.map((step, i) => [`### ${i + 1}. ${step.title}`, "", step.body, ""]).flat(),
    "---",
    "",
    "## Notes",
    "",
    `**Source:** ${source}`,
    authorName ? `\n**Author:** ${authorName}` : "",
  ]
    .filter((l) => l !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const slug = slugify(title);

  return { ok: true, markdown, slug };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseYield(y: SchemaRecipe["recipeYield"]): string {
  if (!y) return "N/A";
  if (Array.isArray(y)) return y[0] ?? "N/A";
  return String(y);
}

function normaliseTime(iso?: string): string {
  if (!iso) return "N/A";
  // ISO 8601 duration: PT1H30M → "1 hr 30 min"
  const h = iso.match(/(\d+)H/i);
  const m = iso.match(/(\d+)M/i);
  const parts = [];
  if (h) parts.push(`${h[1]} hr`);
  if (m) parts.push(`${m[1]} min`);
  return parts.length ? parts.join(" ") : iso;
}

interface StepItem {
  title: string;
  body: string;
}

function flattenInstructions(raw: SchemaRecipe["recipeInstructions"]): StepItem[] {
  if (!raw?.length) return [{ title: "Prepare", body: "Follow the original recipe." }];

  return raw
    .flatMap((item, i): StepItem[] => {
      if (typeof item === "string") {
        const text = item.trim();
        if (!text) return [];
        return [{ title: `Step ${i + 1}`, body: text }];
      }

      // HowToSection — may contain itemListElement
      const section = item as Record<string, unknown>;
      if (section["@type"] === "HowToSection" && Array.isArray(section.itemListElement)) {
        return (section.itemListElement as Array<Record<string, unknown>>).map((s, j) => ({
          title: typeof s.name === "string" ? s.name : `Step ${i + 1}.${j + 1}`,
          body: typeof s.text === "string" ? s.text : "",
        }));
      }

      return [
        {
          title: typeof section.name === "string" ? section.name : `Step ${i + 1}`,
          body: typeof section.text === "string" ? section.text : "",
        },
      ];
    })
    .filter((s) => s.body.trim().length > 0);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m?.[1] ?? null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
