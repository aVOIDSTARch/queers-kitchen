// src/lib/apiPlugin.ts
// Vite plugin that adds /api/* server-side routes during dev and build.
// Handles recipe CRUD and URL scraping without a separate backend.

import type { Plugin } from "vite-plus";
import { IncomingMessage, ServerResponse } from "node:http";

export function apiPlugin(): Plugin {
  return {
    name: "qkc-api",
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        res.setHeader("Content-Type", "application/json");

        try {
          await handleRequest(req, res);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: msg }));
        }
      });
    },
  };
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "null"));
      } catch {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  // Lazy-import so Vite doesn't try to bundle fs in client code
  const { readAllRecipes, readRecipe, writeRecipe, deleteRecipe, uniqueSlug } =
    await import("./recipeFiles.js");
  const { scrapeRecipeUrl } = await import("./scraper.js");

  const url = new URL(req.url!, `http://localhost`);
  const pathname = url.pathname; // e.g. /api/recipes or /api/recipes/my-slug

  // GET /api/recipes
  if (pathname === "/api/recipes" && req.method === "GET") {
    const recipes = await readAllRecipes();
    res.end(JSON.stringify({ recipes }));
    return;
  }

  // GET /api/recipes/:slug
  const slugMatch = pathname.match(/^\/api\/recipes\/([^/]+)$/);
  if (slugMatch && req.method === "GET") {
    const recipe = await readRecipe(slugMatch[1]);
    if (!recipe) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    res.end(JSON.stringify({ recipe }));
    return;
  }

  // POST /api/recipes  — save a recipe { slug?, markdown }
  if (pathname === "/api/recipes" && req.method === "POST") {
    const body = (await readBody(req)) as { markdown?: string; slug?: string } | null;
    if (!body?.markdown) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "markdown required" }));
      return;
    }
    const slug =
      body.slug ??
      (await uniqueSlug(body.markdown.split("\n")[0].replace(/^#\s*/, "") || "recipe"));
    await writeRecipe(slug, body.markdown);
    res.statusCode = 201;
    res.end(JSON.stringify({ slug }));
    return;
  }

  // DELETE /api/recipes/:slug
  if (slugMatch && req.method === "DELETE") {
    const deleted = await deleteRecipe(slugMatch[1]);
    res.end(JSON.stringify({ deleted }));
    return;
  }

  // POST /api/scrape  — { url: string }
  if (pathname === "/api/scrape" && req.method === "POST") {
    const body = (await readBody(req)) as { url?: string } | null;
    if (!body?.url) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "url required" }));
      return;
    }
    const result = await scrapeRecipeUrl(body.url);
    res.end(JSON.stringify(result));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
}
