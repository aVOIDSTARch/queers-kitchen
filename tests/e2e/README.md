# End-to-end test regime (Vitest browser mode)

Real-browser e2e tests run under **Vitest browser mode** with the **Playwright**
provider (Chromium, headless). They are a separate Vitest _project_ from the
node unit tests, configured in [`vite.config.ts`](../../vite.config.ts) under
`test.projects`:

- **`unit`** — node environment, `tests/**/*.test.ts` (measurements, recipe-parser).
- **`browser`** — Chromium, `tests/e2e/**/*.test.tsx`.

## Running

```bash
vp test                      # runs both projects
vp test --project browser    # browser e2e only
vp test --project unit       # node unit only
```

First-time setup needs the Chromium binary:

```bash
pnpm exec playwright install chromium
```

## Writing tests

Use [`vitest-browser-react`](https://github.com/vitest-dev/vitest-browser-react)
for rendering and the built-in `expect.element(...)` locators/matchers:

```tsx
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("…", async () => {
  const screen = render(<Component />);
  await expect.element(screen.getByRole("button", { name: "…" })).toBeVisible();
});
```

## Status

`harness.smoke.test.tsx` is an **engine self-test** only — it imports no app
code. Full flows (home → recipes → detail, add/scrape, cook-notes persistence)
are **deferred** until the page/component files settle, and until `apiPlugin`
is wired into the active `vite.config.ts` so `/api/*` works in `vp dev`.
