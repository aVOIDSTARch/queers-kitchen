/**
 * Controls.tsx
 * A toolbar spanning the full width above the Ingredients / Instructions columns.
 * Contains:
 *   - English / Metric toggle
 *   - Serving size adjuster (− / display / +)
 *
 * No styling. Responsive: stacks vertically on narrow viewports via the
 * data-layout attribute so a parent CSS layer can target it without any
 * inline styles living here.
 */

import React, { useId } from "react";
import type { ControlsProps } from "../types/recipe-component-types";

export function Controls({
  measurementSystem,
  onMeasurementSystemChange,
  scaleFactor,
  baseServes,
  onScaleFactorChange,
  minScale = 0.25,
  maxScale = 8,
  scaleStep = 0.5,
}: ControlsProps): React.ReactElement {
  const toggleId = useId();

  // ── Derived display values ─────────────────────────────────────────────────

  const scaledServesLabel = formatScaledServes(baseServes, scaleFactor);
  const canDecrement = scaleFactor - scaleStep >= minScale;
  const canIncrement = scaleFactor + scaleStep <= maxScale;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleDecrement() {
    if (canDecrement) {
      onScaleFactorChange(parseFloat((scaleFactor - scaleStep).toFixed(2)));
    }
  }

  function handleIncrement() {
    if (canIncrement) {
      onScaleFactorChange(parseFloat((scaleFactor + scaleStep).toFixed(2)));
    }
  }

  function handleSystemToggle(system: "english" | "metric") {
    if (system !== measurementSystem) {
      onMeasurementSystemChange(system);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div role="toolbar" aria-label="Recipe controls" data-component="Controls" data-layout="row">
      {/* ── Measurement system toggle ─────────────────────────────────────── */}
      <fieldset data-section="measurement-toggle">
        <legend>Measurement system</legend>

        <label htmlFor={`${toggleId}-english`}>
          <input
            type="radio"
            id={`${toggleId}-english`}
            name={`${toggleId}-system`}
            value="english"
            checked={measurementSystem === "english"}
            onChange={() => handleSystemToggle("english")}
          />
          English
        </label>

        <label htmlFor={`${toggleId}-metric`}>
          <input
            type="radio"
            id={`${toggleId}-metric`}
            name={`${toggleId}-system`}
            value="metric"
            checked={measurementSystem === "metric"}
            onChange={() => handleSystemToggle("metric")}
          />
          Metric
        </label>
      </fieldset>

      {/* ── Serving size adjuster ─────────────────────────────────────────── */}
      <div role="group" aria-label="Serving size adjuster" data-section="serving-adjuster">
        <button
          type="button"
          aria-label="Decrease servings"
          onClick={handleDecrement}
          disabled={!canDecrement}
          data-action="decrement"
        >
          −
        </button>

        <output aria-live="polite" aria-label="Current servings" data-element="serves-display">
          {scaledServesLabel}
        </output>

        <button
          type="button"
          aria-label="Increase servings"
          onClick={handleIncrement}
          disabled={!canIncrement}
          data-action="increment"
        >
          +
        </button>

        {scaleFactor !== 1 && (
          <button
            type="button"
            aria-label="Reset servings to original"
            onClick={() => onScaleFactorChange(1)}
            data-action="reset"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// ── Utility ────────────────────────────────────────────────────────────────────

/**
 * Scale a serves string by the current factor for display.
 * "4–6" × 2 → "8–12 (2×)"
 * "4"   × 1.5 → "6 (1.5×)"
 */
function formatScaledServes(baseServes: string, factor: number): string {
  const rangeMatch = baseServes.match(/^(\d+)\s*[–-]\s*(\d+)(.*)/);
  if (rangeMatch) {
    const lo = Math.round(parseInt(rangeMatch[1], 10) * factor);
    const hi = Math.round(parseInt(rangeMatch[2], 10) * factor);
    const suffix = rangeMatch[3].trim();
    const scaled = `${lo}–${hi}${suffix ? ` ${suffix}` : ""}`;
    return factor === 1 ? scaled : `${scaled} (${formatFactor(factor)}×)`;
  }

  const singleMatch = baseServes.match(/^(\d+)(.*)/);
  if (singleMatch) {
    const n = Math.round(parseInt(singleMatch[1], 10) * factor);
    const suffix = singleMatch[2].trim();
    const scaled = `${n}${suffix ? ` ${suffix}` : ""}`;
    return factor === 1 ? scaled : `${scaled} (${formatFactor(factor)}×)`;
  }

  // Non-numeric — just append the multiplier
  return factor === 1 ? baseServes : `${baseServes} (${formatFactor(factor)}×)`;
}

/** Format a factor cleanly: 2 → "2", 1.5 → "1.5", 0.5 → "½" */
function formatFactor(factor: number): string {
  const common: Record<number, string> = {
    0.25: "¼",
    0.5: "½",
    0.75: "¾",
    1.25: "1¼",
    1.5: "1½",
    1.75: "1¾",
    2.5: "2½",
  };
  return common[factor] ?? String(factor);
}
