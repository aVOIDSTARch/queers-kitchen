// src/lib/ingredientQty.ts
// Transforms a recipe ingredient quantity string for the active serving
// multiplier and measurement system, using the measurements module.
//
//  • Real measurements ("½ cup", "500ml", "2 tbsp") are scaled by the factor.
//      - Same system as the target: the original unit is kept (½ cup → 1 cup).
//      - Cross system: converted to the target system's natural unit
//        (1 cup → 237 ml; 500 g → 1.1 lb).
//  • Non-measurements ("2 cloves", "1 medium") just have their leading number
//    scaled; the system toggle has no effect on counts.

import {
  parseMeasurement,
  convertVolume,
  convertWeight,
  mlToNaturalEnglishVolume,
  gToNaturalEnglishWeight,
  format,
  formatFraction,
  isVolumeUnit,
  UNIT_META,
  type Measurement,
  type Unit,
  type VolumeUnit,
  type WeightUnit,
  type EnglishVolumeUnit,
  type EnglishWeightUnit,
} from "../../measurements/measurements";

export type MeasurementSystem = "english" | "metric";

const GLYPHS: Record<string, number> = {
  "½": 1 / 2,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "¼": 1 / 4,
  "¾": 3 / 4,
  "⅕": 1 / 5,
  "⅖": 2 / 5,
  "⅗": 3 / 5,
  "⅘": 4 / 5,
  "⅙": 1 / 6,
  "⅚": 5 / 6,
  "⅛": 1 / 8,
  "⅜": 3 / 8,
  "⅝": 5 / 8,
  "⅞": 7 / 8,
};
const GLYPH_CLASS = `[${Object.keys(GLYPHS).join("")}]`;

// "1½" / "1 ½" / "½" → a decimal string the parser understands.
function normalizeFractions(s: string): string {
  return s
    .replace(new RegExp(`(\\d)\\s*(${GLYPH_CLASS})`, "g"), (_m, d: string, g: string) =>
      String(parseInt(d, 10) + GLYPHS[g]),
    )
    .replace(new RegExp(GLYPH_CLASS, "g"), (g) => String(GLYPHS[g]));
}

function trimNum(n: number): string {
  return parseFloat(n.toFixed(2)).toString();
}

// Fallback for non-measurements: scale only the leading numeric token.
function scaleCountable(qty: string, factor: number): string {
  if (factor === 1) return qty;
  const m = normalizeFractions(qty).match(/^\s*(\d*\.?\d+)(.*)$/s);
  if (!m) return qty;
  return `${trimNum(parseFloat(m[1]) * factor)}${m[2]}`;
}

// Decimal rendering (used for metric and for cross-system conversions, whose
// values rarely land on tidy fractions): "237 ml", "1.1 lb".
function decimal(m: Measurement<Unit>): string {
  return format(m, { precision: m.value >= 10 ? 0 : 1 });
}

export function displayQty(qty: string, scaleFactor: number, system: MeasurementSystem): string {
  if (!qty.trim()) return qty;

  // Drop a trailing parenthetical alternate, e.g. "15g (1¼ tbsp)" → "15g";
  // it restates the same amount and would be stale after scaling/conversion.
  const primary = qty.replace(/\s*\([^)]*\)\s*$/, "").trim();

  let parsed: Measurement<Unit>;
  try {
    parsed = parseMeasurement(normalizeFractions(primary));
  } catch {
    return scaleCountable(qty, scaleFactor);
  }

  const scaled: Measurement<Unit> = {
    value: parsed.value * scaleFactor,
    unit: parsed.unit,
    kind: parsed.kind,
  };

  // Same system as the target — keep the original unit, just scaled.
  if (UNIT_META[parsed.unit].system === system) {
    return system === "english"
      ? formatFraction(scaled as Measurement<EnglishVolumeUnit | EnglishWeightUnit>)
      : decimal(scaled);
  }

  // Cross system — convert through the canonical base unit (ml / g).
  if (isVolumeUnit(scaled.unit)) {
    const ml = convertVolume(scaled as Measurement<VolumeUnit>, "ml").value;
    if (system === "metric") {
      return decimal(
        ml >= 1000
          ? convertVolume({ value: ml, unit: "ml", kind: "volume" }, "liter")
          : { value: ml, unit: "ml", kind: "volume" },
      );
    }
    return decimal(mlToNaturalEnglishVolume(ml));
  }

  const g = convertWeight(scaled as Measurement<WeightUnit>, "g").value;
  if (system === "metric") {
    return decimal(
      g >= 1000
        ? convertWeight({ value: g, unit: "g", kind: "weight" }, "kg")
        : { value: g, unit: "g", kind: "weight" },
    );
  }
  return decimal(gToNaturalEnglishWeight(g));
}
