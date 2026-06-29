/**
 * harness.smoke.test.tsx
 * Engine self-test for the browser e2e regime.
 *
 * This deliberately renders a trivial inline component and imports NO app code.
 * Its only job is to prove the Vitest browser-mode engine (Playwright + Chromium
 * + vitest-browser-react) is wired up and runs. Real end-to-end flows against
 * App/pages/components are intentionally deferred until those files settle.
 */

import { expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";

function Ping() {
  return (
    <button type="button" data-testid="ping">
      ping
    </button>
  );
}

test("browser engine renders and queries a React component", async () => {
  const screen = await render(<Ping />);
  await expect.element(screen.getByTestId("ping")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "ping" })).toBeInTheDocument();
});
