// src/lib/recipeFiles.ts
// Server-side (Vite/Node) helpers for reading and writing recipe markdown files.
// All recipes live in src/assets/recipes/*.md
// This module is imported only by Vite API routes / server-side code.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ParsedRecipe } from "../../recipe-parser/types";
import { parseRecipeMarkdown } from "../../recipe-parser/parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const RECIPES_DIR = path.resolve(__dirname, "../assets/recipes");

// ─── Ensure directory exists ──────────────────────────────────────────────────

async function ensureDir() {
  await fs.mkdir(RECIPES_DIR, { recursive: true });
}

// ─── List all recipes ─────────────────────────────────────────────────────────

export async function listRecipeSlugs(): Promise<string[]> {
  await ensureDir();
  const entries = await fs.readdir(RECIPES_DIR);
  return entries
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

// ─── Read one recipe ──────────────────────────────────────────────────────────

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

// ─── Read all recipes ─────────────────────────────────────────────────────────

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

// ─── Write a recipe ───────────────────────────────────────────────────────────

export async function writeRecipe(slug: string, markdown: string): Promise<void> {
  await ensureDir();
  const filePath = path.join(RECIPES_DIR, `${slug}.md`);
  await fs.writeFile(filePath, markdown, "utf-8");
}

// ─── Delete a recipe ──────────────────────────────────────────────────────────

export async function deleteRecipe(slug: string): Promise<boolean> {
  const filePath = path.join(RECIPES_DIR, `${slug}.md`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

// ─── Slug utilities ───────────────────────────────────────────────────────────

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
