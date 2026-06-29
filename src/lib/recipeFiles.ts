// src/lib/recipeFiles.ts
// Read/write recipe markdown files from src/assets/recipes/.
// Runs only in the Vite dev-server / Node context (never in the browser).

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseRecipeMarkdown } from "../../recipe-parser/parser.js";
import type { ParsedRecipe } from "../../recipe-parser/types.js";

// Resolve recipes dir relative to the project root (cwd when vite runs)
const RECIPES_DIR = path.resolve(process.cwd(), "src/assets/recipes");

async function ensureDir() {
  await fs.mkdir(RECIPES_DIR, { recursive: true });
}

export async function listRecipeSlugs(): Promise<string[]> {
  await ensureDir();
  const entries = await fs.readdir(RECIPES_DIR);
  return entries
    .filter((f: string) => f.endsWith(".md"))
    .map((f: string) => f.replace(/\.md$/, ""))
    .sort();
}

export async function readRecipe(slug: string): Promise<ParsedRecipe | null> {
  const filePath = path.join(RECIPES_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseRecipeMarkdown(raw, `${slug}.md`);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function readAllRecipes(): Promise<ParsedRecipe[]> {
  const slugs = await listRecipeSlugs();
  const results = await Promise.allSettled(slugs.map(readRecipe));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<ParsedRecipe> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value);
}

export async function writeRecipe(slug: string, markdown: string): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(RECIPES_DIR, `${slug}.md`), markdown, "utf-8");
}

export async function deleteRecipe(slug: string): Promise<boolean> {
  try {
    await fs.unlink(path.join(RECIPES_DIR, `${slug}.md`));
    return true;
  } catch {
    return false;
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const existing = await listRecipeSlugs();
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
