/**
 * measurements.ts
 * Culinary measurement conversion, promotion, scaling, formatting, and parsing.
 * All types and constants live in measure-types.ts.
 */

import {
  ML_PER_UNIT,
  G_PER_UNIT,
  UNIT_META,
  UNIT_ALIASES,
  FRACTIONS,
  ENGLISH_VOLUME_PROMOTION_CHAIN,
  ENGLISH_WEIGHT_PROMOTION_CHAIN,
} from "../types/measure-types";

export type {
  EnglishVolumeUnit,
  MetricVolumeUnit,
  EnglishWeightUnit,
  MetricWeightUnit,
  VolumeUnit,
  WeightUnit,
  Unit,
  MeasurementKind,
  MeasurementSystem,
  Measurement,
  EnglishVolumeMeasurement,
  MetricVolumeMeasurement,
  EnglishWeightMeasurement,
  MetricWeightMeasurement,
  UnitMeta,
  VolumePromotionRule,
  WeightPromotionRule,
  MultiplyOptions,
  FormatOptions,
  ScaledMeasurement,
} from "../types/measure-types";

export {
  UNIT_META,
  ML_PER_UNIT,
  G_PER_UNIT,
  UNIT_ALIASES,
  FRACTIONS,
  ENGLISH_VOLUME_PROMOTION_CHAIN,
  ENGLISH_WEIGHT_PROMOTION_CHAIN,
} from "../types/measure-types";

import type {
  EnglishVolumeUnit,
  MetricVolumeUnit,
  EnglishWeightUnit,
  MetricWeightUnit,
  VolumeUnit,
  WeightUnit,
  Unit,
  Measurement,
  MultiplyOptions,
  FormatOptions,
  ScaledMeasurement,
} from "../types/measure-types";

// ─── Core Conversion Primitives ───────────────────────────────────────────────

/** Convert a volume measurement to milliliters. */
function toMl(m: Measurement<VolumeUnit>): number {
  return m.value * ML_PER_UNIT[m.unit];
}

/** Convert a weight measurement to grams. */
function toG(m: Measurement<WeightUnit>): number {
  return m.value * G_PER_UNIT[m.unit];
}

/** Convert milliliters to a target volume unit. */
function fromMl(ml: number, targetUnit: VolumeUnit): Measurement<VolumeUnit> {
  return { value: ml / ML_PER_UNIT[targetUnit], unit: targetUnit, kind: "volume" };
}

/** Convert grams to a target weight unit. */
function fromG(g: number, targetUnit: WeightUnit): Measurement<WeightUnit> {
  return { value: g / G_PER_UNIT[targetUnit], unit: targetUnit, kind: "weight" };
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isVolumeUnit(unit: Unit): unit is VolumeUnit {
  return unit in ML_PER_UNIT;
}

export function isWeightUnit(unit: Unit): unit is WeightUnit {
  return unit in G_PER_UNIT;
}

export function isEnglishVolumeUnit(unit: Unit): unit is EnglishVolumeUnit {
  return isVolumeUnit(unit) && UNIT_META[unit].system === "english";
}

export function isMetricVolumeUnit(unit: Unit): unit is MetricVolumeUnit {
  return isVolumeUnit(unit) && UNIT_META[unit].system === "metric";
}

export function isEnglishWeightUnit(unit: Unit): unit is EnglishWeightUnit {
  return isWeightUnit(unit) && UNIT_META[unit].system === "english";
}

export function isMetricWeightUnit(unit: Unit): unit is MetricWeightUnit {
  return isWeightUnit(unit) && UNIT_META[unit].system === "metric";
}

// ─── English Unit Promotion ───────────────────────────────────────────────────

/**
 * Given an English volume measurement (potentially from multiplication),
 * promote it to the most readable unit — e.g., 6 tsp → 1 fl oz.
 * Walks the full chain until stable.
 */
export function promoteEnglishVolume(
  m: Measurement<EnglishVolumeUnit>,
): Measurement<EnglishVolumeUnit> {
  let unit = m.unit;
  let value = m.value;

  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of ENGLISH_VOLUME_PROMOTION_CHAIN) {
      if (rule.from !== unit) continue;
      if (value < rule.threshold) break;

      const whole = Math.floor(value / rule.threshold);
      const remainder = value % rule.threshold;
      if (remainder === 0 || remainder / rule.threshold < 0.01) {
        value = whole + (remainder > 0 ? remainder / rule.threshold : 0);
        unit = rule.to;
        changed = true;
      }
      break;
    }
  }

  return { value, unit, kind: "volume" };
}

/**
 * Promote English weight measurements (oz → lb).
 */
export function promoteEnglishWeight(
  m: Measurement<EnglishWeightUnit>,
): Measurement<EnglishWeightUnit> {
  let unit = m.unit;
  let value = m.value;

  for (const rule of ENGLISH_WEIGHT_PROMOTION_CHAIN) {
    if (rule.from !== unit) continue;
    while (value >= rule.threshold) {
      const remainder = value % rule.threshold;
      const promoted = Math.floor(value / rule.threshold);
      if (remainder === 0 || remainder / rule.threshold < 0.01) {
        value = promoted + remainder / rule.threshold;
        unit = rule.to;
      } else {
        break;
      }
    }
  }

  return { value, unit, kind: "weight" };
}

// ─── Multiplication (English side with auto-promotion) ────────────────────────

/**
 * Multiply an English volume measurement by a scalar factor.
 * e.g., multiply({ value: 2, unit: "tbsp", kind: "volume" }, 4)
 *   → { value: 0.5, unit: "cup", kind: "volume" }  (8 tbsp → ½ cup)
 */
export function multiplyEnglishVolume(
  m: Measurement<EnglishVolumeUnit>,
  factor: number,
  options: MultiplyOptions = {},
): Measurement<EnglishVolumeUnit> {
  const promote = options.promote !== false;
  const result: Measurement<EnglishVolumeUnit> = {
    value: m.value * factor,
    unit: m.unit,
    kind: "volume",
  };
  return promote ? promoteEnglishVolume(result) : result;
}

/**
 * Multiply an English weight measurement by a scalar factor.
 * e.g., multiply({ value: 8, unit: "oz", kind: "weight" }, 3)
 *   → { value: 1.5, unit: "lb", kind: "weight" }
 */
export function multiplyEnglishWeight(
  m: Measurement<EnglishWeightUnit>,
  factor: number,
  options: MultiplyOptions = {},
): Measurement<EnglishWeightUnit> {
  const promote = options.promote !== false;
  const result: Measurement<EnglishWeightUnit> = {
    value: m.value * factor,
    unit: m.unit,
    kind: "weight",
  };
  return promote ? promoteEnglishWeight(result) : result;
}

// ─── Cross-System Conversion ──────────────────────────────────────────────────

/** Convert any volume unit to any other volume unit. */
export function convertVolume(
  m: Measurement<VolumeUnit>,
  targetUnit: VolumeUnit,
): Measurement<VolumeUnit> {
  if (m.unit === targetUnit) return { ...m };
  return fromMl(toMl(m), targetUnit);
}

/** Convert any weight unit to any other weight unit. */
export function convertWeight(
  m: Measurement<WeightUnit>,
  targetUnit: WeightUnit,
): Measurement<WeightUnit> {
  if (m.unit === targetUnit) return { ...m };
  return fromG(toG(m), targetUnit);
}

/**
 * General-purpose convert function. Accepts any measurement and target unit
 * of the same kind (volume→volume or weight→weight).
 */
export function convert(
  m: Measurement<VolumeUnit>,
  targetUnit: VolumeUnit,
): Measurement<VolumeUnit>;
export function convert(
  m: Measurement<WeightUnit>,
  targetUnit: WeightUnit,
): Measurement<WeightUnit>;
export function convert(m: Measurement<Unit>, targetUnit: Unit): Measurement<Unit> {
  if (isVolumeUnit(m.unit) && isVolumeUnit(targetUnit)) {
    return convertVolume(m as Measurement<VolumeUnit>, targetUnit);
  }
  if (isWeightUnit(m.unit) && isWeightUnit(targetUnit)) {
    return convertWeight(m as Measurement<WeightUnit>, targetUnit);
  }
  throw new Error(
    `Cannot convert between incompatible kinds: ${UNIT_META[m.unit].kind} → ${UNIT_META[targetUnit as Unit].kind}`,
  );
}

// ─── Convenience: English ↔ Metric Bridges ───────────────────────────────────

/** Convert an English volume to the idiomatic metric equivalent. */
export function englishVolumeToMetric(
  m: Measurement<EnglishVolumeUnit>,
  targetUnit: MetricVolumeUnit = "ml",
): Measurement<MetricVolumeUnit> {
  return convertVolume(m, targetUnit) as Measurement<MetricVolumeUnit>;
}

/** Convert a metric volume to an English unit. */
export function metricVolumeToEnglish(
  m: Measurement<MetricVolumeUnit>,
  targetUnit: EnglishVolumeUnit = "cup",
): Measurement<EnglishVolumeUnit> {
  return convertVolume(m, targetUnit) as Measurement<EnglishVolumeUnit>;
}

/** Convert an English weight to a metric weight. */
export function englishWeightToMetric(
  m: Measurement<EnglishWeightUnit>,
  targetUnit: MetricWeightUnit = "g",
): Measurement<MetricWeightUnit> {
  return convertWeight(m, targetUnit) as Measurement<MetricWeightUnit>;
}

/** Convert a metric weight to an English weight. */
export function metricWeightToEnglish(
  m: Measurement<MetricWeightUnit>,
  targetUnit: EnglishWeightUnit = "oz",
): Measurement<EnglishWeightUnit> {
  return convertWeight(m, targetUnit) as Measurement<EnglishWeightUnit>;
}

// ─── Recipe Scaling ───────────────────────────────────────────────────────────

/**
 * Scale an English volume measurement for a recipe multiplier,
 * with automatic unit promotion on the result.
 */
export function scaleEnglishVolume(
  m: Measurement<EnglishVolumeUnit>,
  factor: number,
): ScaledMeasurement<EnglishVolumeUnit> {
  return { original: m, scaled: multiplyEnglishVolume(m, factor), factor };
}

/**
 * Scale an English weight measurement for a recipe multiplier.
 */
export function scaleEnglishWeight(
  m: Measurement<EnglishWeightUnit>,
  factor: number,
): ScaledMeasurement<EnglishWeightUnit> {
  return { original: m, scaled: multiplyEnglishWeight(m, factor), factor };
}

/**
 * Scale a metric volume measurement — no promotion needed, just multiply.
 */
export function scaleMetricVolume(
  m: Measurement<MetricVolumeUnit>,
  factor: number,
): ScaledMeasurement<MetricVolumeUnit> {
  return { original: m, scaled: { value: m.value * factor, unit: m.unit, kind: "volume" }, factor };
}

/**
 * Scale a metric weight measurement.
 */
export function scaleMetricWeight(
  m: Measurement<MetricWeightUnit>,
  factor: number,
): ScaledMeasurement<MetricWeightUnit> {
  return { original: m, scaled: { value: m.value * factor, unit: m.unit, kind: "weight" }, factor };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Format a measurement as a human-readable string.
 * e.g., format({ value: 1.5, unit: "cup", kind: "volume" }) → "1.5 c"
 */
export function format(m: Measurement<Unit>, options: FormatOptions = {}): string {
  const precision = options.precision ?? 2;
  const abbreviated = options.abbreviated !== false;
  const showUnit = options.showUnit !== false;

  const meta = UNIT_META[m.unit];
  const rounded = parseFloat(m.value.toFixed(precision));

  if (!showUnit) return String(rounded);

  const unitLabel = abbreviated ? meta.abbreviation : rounded === 1 ? meta.label : meta.labelPlural;

  return `${rounded} ${unitLabel}`;
}

/**
 * Format a fraction-friendly string for English volume values
 * (e.g., 0.333... → "⅓ cup").
 */
export function formatFraction(
  m: Measurement<EnglishVolumeUnit | EnglishWeightUnit>,
  options: Omit<FormatOptions, "precision"> = {},
): string {
  const meta = UNIT_META[m.unit];
  const abbreviated = options.abbreviated !== false;
  const showUnit = options.showUnit !== false;

  const whole = Math.floor(m.value);
  const decimal = m.value - whole;

  let fractionalPart = "";
  if (decimal > 0.01) {
    const match = FRACTIONS.find((f) => Math.abs(f.decimal - decimal) < 0.02);
    fractionalPart = match ? match.display : decimal.toFixed(2).replace("0.", ".");
  }

  const valuePart =
    [whole > 0 ? String(whole) : "", fractionalPart].filter(Boolean).join(" ") || "0";

  if (!showUnit) return valuePart;

  const displayValue = m.value === 1 ? 1 : m.value;
  const unitLabel = abbreviated
    ? meta.abbreviation
    : displayValue === 1
      ? meta.label
      : meta.labelPlural;

  return `${valuePart} ${unitLabel}`;
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

/**
 * Parse a measurement string into a typed Measurement object.
 * e.g., parseMeasurement("2.5 cups") → { value: 2.5, unit: "cup", kind: "volume" }
 */
export function parseMeasurement(input: string): Measurement<Unit> {
  const trimmed = input.trim();
  const match = trimmed.match(/^([\d./]+)\s*(.+)$/);
  if (!match) throw new Error(`Cannot parse measurement: "${input}"`);

  const [, rawValue, rawUnit] = match;

  let value: number;
  if (rawValue.includes("/")) {
    const [num, den] = rawValue.split("/").map(Number);
    if (!den) throw new Error(`Invalid fraction in: "${input}"`);
    value = num / den;
  } else {
    value = parseFloat(rawValue);
  }

  if (isNaN(value)) throw new Error(`Invalid numeric value in: "${input}"`);

  const unitKey = rawUnit.trim().toLowerCase();
  const unit = UNIT_ALIASES[rawUnit.trim()] ?? UNIT_ALIASES[unitKey];
  if (!unit) throw new Error(`Unknown unit: "${rawUnit.trim()}"`);

  const meta = UNIT_META[unit];
  return { value, unit, kind: meta.kind };
}

// ─── Utility: Nearest "nice" English unit ─────────────────────────────────────

/**
 * Given a raw milliliter amount, return the most readable English volume unit.
 */
export function bestEnglishVolumeUnit(ml: number): EnglishVolumeUnit {
  if (ml < ML_PER_UNIT["tbsp"]) return "tsp";
  if (ml < ML_PER_UNIT["fl_oz"]) return "tbsp";
  if (ml < ML_PER_UNIT["cup"]) return "fl_oz";
  if (ml < ML_PER_UNIT["pint"]) return "cup";
  if (ml < ML_PER_UNIT["quart"]) return "pint";
  if (ml < ML_PER_UNIT["gallon"]) return "quart";
  return "gallon";
}

/**
 * Given a raw gram amount, return the most readable English weight unit.
 */
export function bestEnglishWeightUnit(g: number): EnglishWeightUnit {
  return g >= G_PER_UNIT["lb"] ? "lb" : "oz";
}

/**
 * Auto-convert milliliters to the most idiomatic English volume measurement.
 */
export function mlToNaturalEnglishVolume(ml: number): Measurement<EnglishVolumeUnit> {
  const unit = bestEnglishVolumeUnit(ml);
  return { value: ml / ML_PER_UNIT[unit], unit, kind: "volume" };
}

/**
 * Auto-convert grams to the most idiomatic English weight measurement.
 */
export function gToNaturalEnglishWeight(g: number): Measurement<EnglishWeightUnit> {
  const unit = bestEnglishWeightUnit(g);
  return { value: g / G_PER_UNIT[unit], unit, kind: "weight" };
}
