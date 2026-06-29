/**
 * parser.ts
 * Parses cookbook markdown files into typed ParsedRecipe objects.
 *
 * Handles the exact format used in the Cookbook Google Drive folder:
 *   - # Title
 *   - > Tagline blockquote
 *   - **Serves:** X | **Time:** Y
 *   - ## Ingredients (with optional ### subsections)
 *   - Markdown tables (| Qty | Ingredient |)
 *   - ## Method with ### N. Step Title sections
 *   - ## Notes with **Label:** body format
 */

import type {
  ParsedRecipe,
  RecipeMeta,
  IngredientGroup,
  IngredientRow,
  RecipeStep,
  RecipeNote,
} from "./types";

// ─── Section extraction ───────────────────────────────────────────────────────

type SectionMap = {
  title: string;
  tagline: string;
  metaLine: string;
  ingredientsBlock: string;
  methodBlock: string;
  notesBlock: string;
};

/**
 * Split a full markdown string into its major named sections.
 * Sections are delimited by ## headings; order is not assumed.
 */
function splitSections(md: string): SectionMap {
  const lines = md.split("\n");

  let title = "";
  let tagline = "";
  let metaLine = "";

  const sections: Record<string, string[]> = {
    ingredients: [],
    method: [],
    notes: [],
  };

  // Which section buffer are we currently writing into? null = preamble.
  let current: string | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();

    // ── Top-level H1 ─────────────────────────────────────────────────────────
    if (!title && /^#\s+/.test(line)) {
      title = line.replace(/^#\s+/, "").trim();
      continue;
    }

    // ── Blockquote tagline ────────────────────────────────────────────────────
    if (!tagline && /^>\s+/.test(line)) {
      tagline = line.replace(/^>\s+/, "").trim();
      continue;
    }

    // ── Meta line (Serves / Time) ─────────────────────────────────────────────
    if (!metaLine && /\*\*Serves:\*\*/.test(line)) {
      metaLine = line.trim();
      continue;
    }

    // ── H2 section headers ────────────────────────────────────────────────────
    if (/^##\s+/i.test(line)) {
      const heading = line
        .replace(/^##\s+/, "")
        .trim()
        .toLowerCase();
      if (heading === "ingredients") {
        current = "ingredients";
      } else if (heading === "method") {
        current = "method";
      } else if (heading === "notes") {
        current = "notes";
      } else {
        current = null;
      }
      continue;
    }

    // ── Horizontal rules — ignore ─────────────────────────────────────────────
    if (/^---+$/.test(line.trim())) {
      continue;
    }

    // ── Accumulate into active section ────────────────────────────────────────
    if (current && sections[current] !== undefined) {
      sections[current].push(line);
    }
  }

  return {
    title,
    tagline,
    metaLine,
    ingredientsBlock: sections.ingredients.join("\n"),
    methodBlock: sections.method.join("\n"),
    notesBlock: sections.notes.join("\n"),
  };
}

// ─── Meta parsing ─────────────────────────────────────────────────────────────

/**
 * Parse the "**Serves:** 4–6 | **Time:** ~25 minutes" line.
 * Handles both | and plain whitespace separators.
 */
function parseMeta(metaLine: string): RecipeMeta {
  const servesMatch = metaLine.match(/\*\*Serves:\*\*\s*([^|*\n]+)/);
  const timeMatch = metaLine.match(/\*\*Time:\*\*\s*([^|*\n]+)/);

  return {
    serves: servesMatch ? servesMatch[1].trim() : "",
    time: timeMatch ? timeMatch[1].trim() : "",
  };
}

// ─── Ingredient parsing ───────────────────────────────────────────────────────

const TABLE_SEPARATOR_RE = /^\|[-\s|:]+\|$/;
const TABLE_ROW_RE = /^\|(.+)\|$/;

/** Parse a markdown table into an array of { qty, name } rows. */
function parseTable(block: string): IngredientRow[] {
  const rows: IngredientRow[] = [];

  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || TABLE_SEPARATOR_RE.test(trimmed)) continue;

    const match = trimmed.match(TABLE_ROW_RE);
    if (!match) continue;

    const cells = match[1].split("|").map((c) => c.trim());

    // Expect at least two cells; first is qty, second is ingredient name.
    // Skip header rows ("Qty", "Ingredient", "Amount", etc.)
    if (cells.length < 2) continue;
    const [qty, name] = cells;
    if (/^(qty|amount|ingredient|item)$/i.test(qty)) continue;

    if (name) {
      rows.push({ qty, name });
    }
  }

  return rows;
}

/**
 * Parse the full ingredients block, handling optional ### subsection headings.
 * Produces one IngredientGroup per subsection (or one ungrouped group).
 */
function parseIngredients(block: string): IngredientGroup[] {
  const groups: IngredientGroup[] = [];

  // Split on ### headings to find named groups
  // Pattern: optional leading content before any heading, then sections
  const subsectionRe = /^###\s+(.+)$/im;

  if (!subsectionRe.test(block)) {
    // No subsections — one flat group
    const ingredients = parseTable(block);
    if (ingredients.length > 0) {
      groups.push({ ingredients });
    }
    return groups;
  }

  // Split block into segments by ### heading
  const segments = block.split(/^###\s+/m);

  for (const segment of segments) {
    if (!segment.trim()) continue;

    // First line is the group name (before the newline), rest is the table
    const newlineIdx = segment.indexOf("\n");
    if (newlineIdx === -1) continue;

    const groupName = segment.slice(0, newlineIdx).trim();
    const tableBlock = segment.slice(newlineIdx);
    const ingredients = parseTable(tableBlock);

    if (ingredients.length > 0 || groupName) {
      groups.push({
        groupName: groupName || undefined,
        ingredients,
      });
    }
  }

  // If the block starts with table content before any ###, capture that too
  // (handles recipes where the first group is implicitly ungrouped)
  const firstHeadingIdx = block.search(/^###\s+/m);
  if (firstHeadingIdx > 0) {
    const preGroupBlock = block.slice(0, firstHeadingIdx);
    const preGroupIngredients = parseTable(preGroupBlock);
    if (preGroupIngredients.length > 0) {
      groups.unshift({ ingredients: preGroupIngredients });
    }
  }

  return groups;
}

// ─── Method parsing ───────────────────────────────────────────────────────────

/**
 * Parse the method block into discrete steps.
 * Steps are delimited by ### headings of the form "### N. Title" or "### Title".
 */
function parseMethod(block: string): RecipeStep[] {
  const steps: RecipeStep[] = [];

  // Split on ### headings
  const segments = block.split(/^###\s+/m);

  for (const segment of segments) {
    if (!segment.trim()) continue;

    const newlineIdx = segment.indexOf("\n");
    if (newlineIdx === -1) continue;

    const headingRaw = segment.slice(0, newlineIdx).trim();
    const body = segment.slice(newlineIdx).trim();

    // Parse "1. Step Title" or just "Step Title"
    const numberedMatch = headingRaw.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      steps.push({
        stepNumber: parseInt(numberedMatch[1], 10),
        title: numberedMatch[2].trim(),
        body: normalizeWhitespace(body),
      });
    } else {
      steps.push({
        title: headingRaw,
        body: normalizeWhitespace(body),
      });
    }
  }

  // If no ### headings found, treat the whole block as one step
  if (steps.length === 0 && block.trim()) {
    steps.push({
      title: "Instructions",
      body: normalizeWhitespace(block.trim()),
    });
  }

  return steps;
}

// ─── Notes parsing ────────────────────────────────────────────────────────────

/**
 * Parse the notes section.
 * Format: **Label:** Body prose
 * Multi-line notes end at the next blank line or next **Label:** marker.
 */
function parseNotes(block: string): RecipeNote[] {
  const notes: RecipeNote[] = [];

  // Split on lines that start a new note: "**Label:**" or "- **Label:**"
  // Also handle plain bullet points without a bold label.
  const labelRe = /^[-*]?\s*\*\*(.+?):\*\*\s*(.*)/;
  const bulletRe = /^[-*]\s+(.+)/;

  const lines = block.split("\n");
  let currentNote: RecipeNote | null = null;

  const flush = () => {
    if (currentNote) {
      currentNote.body = currentNote.body.trim();
      if (currentNote.body || currentNote.label) {
        notes.push(currentNote);
      }
      currentNote = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      // Blank line ends the current note
      flush();
      continue;
    }

    const labelMatch = line.match(labelRe);
    if (labelMatch) {
      flush();
      currentNote = {
        label: labelMatch[1].trim(),
        body: labelMatch[2].trim(),
      };
      continue;
    }

    // Continuation of the current note body
    if (currentNote) {
      currentNote.body += " " + line;
      continue;
    }

    // Unlabeled bullet or orphan line — start a new unlabeled note
    const bulletMatch = line.match(bulletRe);
    if (bulletMatch) {
      flush();
      currentNote = { body: bulletMatch[1].trim() };
      continue;
    }

    // Plain text continuation
    flush();
    currentNote = { body: line };
  }

  flush();
  return notes;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function normalizeWhitespace(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Parse a cookbook markdown string into a fully typed ParsedRecipe.
 *
 * @param markdown   Raw markdown content of a recipe file
 * @param _filename  Optional filename (e.g. "celeriac-kimchi-remoulade.md"); reserved for slug derivation
 * @returns          ParsedRecipe with all sections populated
 *
 * @example
 * const recipe = parseRecipeMarkdown(markdownString, "celeriac-kimchi-remoulade.md");
 * const props = recipeToPageProps(recipe);
 */
export function parseRecipeMarkdown(markdown: string, _filename?: string): ParsedRecipe {
  const sections = splitSections(markdown);
  const meta = parseMeta(sections.metaLine);
  const ingredientGroups = parseIngredients(sections.ingredientsBlock);
  const steps = parseMethod(sections.methodBlock);
  const notes = parseNotes(sections.notesBlock);

  return {
    title: sections.title,
    tagline: sections.tagline,
    meta,
    ingredientGroups,
    steps,
    notes,
    rawMarkdown: markdown,
  };
}
