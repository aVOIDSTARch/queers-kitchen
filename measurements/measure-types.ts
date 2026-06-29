/**
 * measure-types.ts
 * All types, interfaces, constants, and metadata for the culinary
 * measurement system. No executable logic — pure declarations.
 */

// ─── Unit Enumerations ────────────────────────────────────────────────────────

export type EnglishVolumeUnit =
  | "tsp" // teaspoon
  | "tbsp" // tablespoon
  | "fl_oz" // fluid ounce
  | "cup"
  | "pint"
  | "quart"
  | "gallon";

export type MetricVolumeUnit =
  | "ml" // milliliter
  | "cl" // centiliter
  | "dl" // deciliter
  | "liter";

export type EnglishWeightUnit =
  | "oz" // ounce (avoirdupois)
  | "lb"; // pound

export type MetricWeightUnit =
  | "g" // gram
  | "kg"; // kilogram

export type VolumeUnit = EnglishVolumeUnit | MetricVolumeUnit;
export type WeightUnit = EnglishWeightUnit | MetricWeightUnit;
export type Unit = VolumeUnit | WeightUnit;

export type MeasurementKind = "volume" | "weight";
export type MeasurementSystem = "english" | "metric";

// ─── Measurement Value Types ──────────────────────────────────────────────────

export interface Measurement<U extends Unit = Unit> {
  value: number;
  unit: U;
  kind: MeasurementKind;
}

export interface EnglishVolumeMeasurement extends Measurement<EnglishVolumeUnit> {
  kind: "volume";
}

export interface MetricVolumeMeasurement extends Measurement<MetricVolumeUnit> {
  kind: "volume";
}

export interface EnglishWeightMeasurement extends Measurement<EnglishWeightUnit> {
  kind: "weight";
}

export interface MetricWeightMeasurement extends Measurement<MetricWeightUnit> {
  kind: "weight";
}

// ─── Conversion Tables ────────────────────────────────────────────────────────
//   Volume base: milliliters (ml)
//   Weight base: grams (g)

export const ML_PER_UNIT: Record<VolumeUnit, number> = {
  // English volume
  tsp: 4.92892,
  tbsp: 14.7868,
  fl_oz: 29.5735,
  cup: 236.588,
  pint: 473.176,
  quart: 946.353,
  gallon: 3785.41,
  // Metric volume
  ml: 1,
  cl: 10,
  dl: 100,
  liter: 1000,
};

export const G_PER_UNIT: Record<WeightUnit, number> = {
  // English weight
  oz: 28.3495,
  lb: 453.592,
  // Metric weight
  g: 1,
  kg: 1000,
};

// ─── Unit Metadata ────────────────────────────────────────────────────────────

export interface UnitMeta {
  label: string;
  labelPlural: string;
  abbreviation: string;
  kind: MeasurementKind;
  system: MeasurementSystem;
}

export const UNIT_META: Record<Unit, UnitMeta> = {
  // English volume
  tsp: {
    label: "teaspoon",
    labelPlural: "teaspoons",
    abbreviation: "tsp",
    kind: "volume",
    system: "english",
  },
  tbsp: {
    label: "tablespoon",
    labelPlural: "tablespoons",
    abbreviation: "tbsp",
    kind: "volume",
    system: "english",
  },
  fl_oz: {
    label: "fluid ounce",
    labelPlural: "fluid ounces",
    abbreviation: "fl oz",
    kind: "volume",
    system: "english",
  },
  cup: { label: "cup", labelPlural: "cups", abbreviation: "c", kind: "volume", system: "english" },
  pint: {
    label: "pint",
    labelPlural: "pints",
    abbreviation: "pt",
    kind: "volume",
    system: "english",
  },
  quart: {
    label: "quart",
    labelPlural: "quarts",
    abbreviation: "qt",
    kind: "volume",
    system: "english",
  },
  gallon: {
    label: "gallon",
    labelPlural: "gallons",
    abbreviation: "gal",
    kind: "volume",
    system: "english",
  },
  // Metric volume
  ml: {
    label: "milliliter",
    labelPlural: "milliliters",
    abbreviation: "ml",
    kind: "volume",
    system: "metric",
  },
  cl: {
    label: "centiliter",
    labelPlural: "centiliters",
    abbreviation: "cl",
    kind: "volume",
    system: "metric",
  },
  dl: {
    label: "deciliter",
    labelPlural: "deciliters",
    abbreviation: "dl",
    kind: "volume",
    system: "metric",
  },
  liter: {
    label: "liter",
    labelPlural: "liters",
    abbreviation: "L",
    kind: "volume",
    system: "metric",
  },
  // English weight
  oz: {
    label: "ounce",
    labelPlural: "ounces",
    abbreviation: "oz",
    kind: "weight",
    system: "english",
  },
  lb: {
    label: "pound",
    labelPlural: "pounds",
    abbreviation: "lb",
    kind: "weight",
    system: "english",
  },
  // Metric weight
  g: { label: "gram", labelPlural: "grams", abbreviation: "g", kind: "weight", system: "metric" },
  kg: {
    label: "kilogram",
    labelPlural: "kilograms",
    abbreviation: "kg",
    kind: "weight",
    system: "metric",
  },
};

// ─── English Unit Promotion Rules ─────────────────────────────────────────────
// Thresholds at which a value in the "from" unit cleanly promotes to "to".

export interface VolumePromotionRule {
  from: EnglishVolumeUnit;
  to: EnglishVolumeUnit;
  threshold: number;
}

export interface WeightPromotionRule {
  from: EnglishWeightUnit;
  to: EnglishWeightUnit;
  threshold: number;
}

export const ENGLISH_VOLUME_PROMOTION_CHAIN: VolumePromotionRule[] = [
  { from: "tsp", to: "tbsp", threshold: 3 }, // 3 tsp   → 1 tbsp
  { from: "tbsp", to: "fl_oz", threshold: 2 }, // 2 tbsp  → 1 fl oz
  { from: "fl_oz", to: "cup", threshold: 8 }, // 8 fl oz → 1 cup
  { from: "cup", to: "pint", threshold: 2 }, // 2 cups  → 1 pint
  { from: "pint", to: "quart", threshold: 2 }, // 2 pints → 1 quart
  { from: "quart", to: "gallon", threshold: 4 }, // 4 quarts → 1 gallon
];

export const ENGLISH_WEIGHT_PROMOTION_CHAIN: WeightPromotionRule[] = [
  { from: "oz", to: "lb", threshold: 16 }, // 16 oz → 1 lb
];

// ─── Operation Option Types ───────────────────────────────────────────────────

export interface MultiplyOptions {
  /** Whether to auto-promote to the next sensible English unit. Default: true */
  promote?: boolean;
}

export interface FormatOptions {
  /** Decimal places. Default: 2 */
  precision?: number;
  /** Use abbreviation instead of full unit name. Default: true */
  abbreviated?: boolean;
  /** Include unit label. Default: true */
  showUnit?: boolean;
}

// ─── Compound Result Types ────────────────────────────────────────────────────

export interface ScaledMeasurement<U extends Unit = Unit> {
  original: Measurement<U>;
  scaled: Measurement<U>;
  factor: number;
}

// ─── Alias lookup table (used by parseMeasurement) ────────────────────────────

export const UNIT_ALIASES: Record<string, Unit> = {
  // English volume
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  t: "tsp",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  T: "tbsp",
  tbs: "tbsp",
  "fl oz": "fl_oz",
  fl_oz: "fl_oz",
  floz: "fl_oz",
  "fluid ounce": "fl_oz",
  "fluid ounces": "fl_oz",
  c: "cup",
  cup: "cup",
  cups: "cup",
  pt: "pint",
  pint: "pint",
  pints: "pint",
  qt: "quart",
  quart: "quart",
  quarts: "quart",
  gal: "gallon",
  gallon: "gallon",
  gallons: "gallon",
  // Metric volume
  ml: "ml",
  milliliter: "ml",
  milliliters: "ml",
  millilitre: "ml",
  millilitres: "ml",
  cl: "cl",
  centiliter: "cl",
  centiliters: "cl",
  dl: "dl",
  deciliter: "dl",
  deciliters: "dl",
  l: "liter",
  L: "liter",
  liter: "liter",
  liters: "liter",
  litre: "liter",
  litres: "liter",
  // English weight
  oz: "oz",
  ounce: "oz",
  ounces: "oz",
  lb: "lb",
  lbs: "lb",
  pound: "lb",
  pounds: "lb",
  // Metric weight
  g: "g",
  gram: "g",
  grams: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
};

// ─── Unicode fraction lookup (used by formatFraction) ─────────────────────────

export const FRACTIONS: Array<{ decimal: number; display: string }> = [
  { decimal: 1 / 8, display: "⅛" },
  { decimal: 1 / 4, display: "¼" },
  { decimal: 1 / 3, display: "⅓" },
  { decimal: 3 / 8, display: "⅜" },
  { decimal: 1 / 2, display: "½" },
  { decimal: 5 / 8, display: "⅝" },
  { decimal: 2 / 3, display: "⅔" },
  { decimal: 3 / 4, display: "¾" },
  { decimal: 7 / 8, display: "⅞" },
];
