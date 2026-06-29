// src/lib/apiPlugin.ts
// Vite dev-server middleware for /api/* routes.
// Handles recipe CRUD and URL scraping.

import type { Plugin, ViteDevServer } from "vite-plus";
import type { IncomingMessage, ServerResponse } from "node:http";

export function apiPlugin(): Plugin {
  return {
    name: "qkc-api",
    apply: "serve", // dev only
    async configureServer(server: ViteDevServer) {
      // Pre-import handlers so ESM resolution uses Vite's module graph
      const { readAllRecipes, readRecipe, writeRecipe, deleteRecipe, uniqueSlug } =
        await import("./recipeFiles.js");
      const { scrapeRecipeUrl } = await import("./scraper.js");

      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!req.url?.startsWith("/api/")) return next();

          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");

          try {
            const url = new URL(req.url, `http://localhost`);
            const pathname = url.pathname;
            const method = req.method ?? "GET";

            // GET /api/recipes
            if (pathname === "/api/recipes" && method === "GET") {
              const recipes = await readAllRecipes();
              res.end(JSON.stringify({ recipes }));
              return;
            }

            // Slug routes
            const slugMatch = pathname.match(/^\/api\/recipes\/([^/]+)$/);

            // GET /api/recipes/:slug
            if (slugMatch && method === "GET") {
              const recipe = await readRecipe(slugMatch[1]);
              if (!recipe) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Not found" }));
                return;
              }
              res.end(JSON.stringify({ recipe }));
              return;
            }

            // POST /api/recipes
            if (pathname === "/api/recipes" && method === "POST") {
              const body = (await readBody(req)) as { markdown?: string; slug?: string } | null;
              if (!body?.markdown) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "markdown required" }));
                return;
              }
              const title = body.markdown.split("\n")[0].replace(/^#\s*/, "").trim() || "recipe";
              const slug = body.slug ?? (await uniqueSlug(title));
              await writeRecipe(slug, body.markdown);
              res.statusCode = 201;
              res.end(JSON.stringify({ slug }));
              return;
            }

            // DELETE /api/recipes/:slug
            if (slugMatch && method === "DELETE") {
              const deleted = await deleteRecipe(slugMatch[1]);
              res.end(JSON.stringify({ deleted }));
              return;
            }

            // POST /api/scrape
            if (pathname === "/api/scrape" && method === "POST") {
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
          } catch (err: unknown) {
            console.error("[qkc-api]", err);
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : String(err),
              }),
            );
          }
        },
      );
    },
  };
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => {
      data += chunk.toString();
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
