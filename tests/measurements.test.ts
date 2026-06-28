/**
 * measurements.test.ts
 * Tests for the measurements module.
 */

import { describe, test, expect } from "vite-plus/test";
import {
  convert,
  convertVolume,
  convertWeight,
  multiplyEnglishVolume,
  multiplyEnglishWeight,
  promoteEnglishVolume,
  promoteEnglishWeight,
  englishVolumeToMetric,
  metricVolumeToEnglish,
  englishWeightToMetric,
  metricWeightToEnglish,
  scaleEnglishVolume,
  scaleMetricVolume,
  format,
  formatFraction,
  parseMeasurement,
  mlToNaturalEnglishVolume,
  gToNaturalEnglishWeight,
  isVolumeUnit,
  isWeightUnit,
  isEnglishVolumeUnit,
  type Measurement,
  type EnglishVolumeUnit,
} from "../src/utils/measurements";

// ─── Tolerance helper for floating-point comparisons ──────────────────────────

function approx(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Type guards", () => {
  test("cup is a volume unit", () => expect(isVolumeUnit("cup")).toBe(true));
  test("ml is a volume unit", () => expect(isVolumeUnit("ml")).toBe(true));
  test("oz is not a volume unit", () => expect(isVolumeUnit("oz")).toBe(false));
  test("oz is a weight unit", () => expect(isWeightUnit("oz")).toBe(true));
  test("kg is a weight unit", () => expect(isWeightUnit("kg")).toBe(true));
  test("cup is not a weight unit", () => expect(isWeightUnit("cup")).toBe(false));
  test("tbsp is English volume", () => expect(isEnglishVolumeUnit("tbsp")).toBe(true));
  test("liter is not English volume", () => expect(isEnglishVolumeUnit("liter")).toBe(false));
});

describe("English ↔ English volume", () => {
  test("2 tbsp → 1 fl oz", () => {
    const twoTbsp: Measurement<"tbsp"> = { value: 2, unit: "tbsp", kind: "volume" };
    expect(approx(convertVolume(twoTbsp, "fl_oz").value, 1)).toBe(true);
  });

  test("1 cup → 16 tbsp", () => {
    const oneCup: Measurement<"cup"> = { value: 1, unit: "cup", kind: "volume" };
    expect(approx(convertVolume(oneCup, "tbsp").value, 16)).toBe(true);
  });

  test("1 cup → 48 tsp", () => {
    const oneCup: Measurement<"cup"> = { value: 1, unit: "cup", kind: "volume" };
    expect(approx(convertVolume(oneCup, "tsp").value, 48)).toBe(true);
  });

  test("1 gallon → 4 quarts", () => {
    const oneGallon: Measurement<"gallon"> = { value: 1, unit: "gallon", kind: "volume" };
    expect(approx(convertVolume(oneGallon, "quart").value, 4)).toBe(true);
  });
});

describe("English ↔ Metric volume", () => {
  const oneCup: Measurement<"cup"> = { value: 1, unit: "cup", kind: "volume" };

  test("1 cup ≈ 236.59 ml", () => {
    expect(approx(englishVolumeToMetric(oneCup, "ml").value, 236.588, 0.01)).toBe(true);
  });

  test("236.588 ml → 1 cup (round-trip)", () => {
    const backToCup = metricVolumeToEnglish({ value: 236.588, unit: "ml", kind: "volume" }, "cup");
    expect(approx(backToCup.value, 1, 0.01)).toBe(true);
  });

  test("1 liter ≈ 1.0567 quarts", () => {
    const oneLiterToQuarts = metricVolumeToEnglish(
      { value: 1, unit: "liter", kind: "volume" },
      "quart",
    );
    expect(approx(oneLiterToQuarts.value, 1.0567, 0.01)).toBe(true);
  });
});

describe("English ↔ English weight", () => {
  test("1 lb → 16 oz", () => {
    const oneLb: Measurement<"lb"> = { value: 1, unit: "lb", kind: "weight" };
    expect(approx(convertWeight(oneLb, "oz").value, 16)).toBe(true);
  });
});

describe("English ↔ Metric weight", () => {
  test("16 oz ≈ 453.59 g", () => {
    const sixteenOz: Measurement<"oz"> = { value: 16, unit: "oz", kind: "weight" };
    expect(approx(englishWeightToMetric(sixteenOz, "g").value, 453.592, 0.01)).toBe(true);
  });

  test("453.592 g → 1 lb (round-trip)", () => {
    const backToLb = metricWeightToEnglish({ value: 453.592, unit: "g", kind: "weight" }, "lb");
    expect(approx(backToLb.value, 1, 0.01)).toBe(true);
  });

  test("1 kg ≈ 2.2046 lb", () => {
    const oneKg: Measurement<"kg"> = { value: 1, unit: "kg", kind: "weight" };
    expect(approx(metricWeightToEnglish(oneKg, "lb").value, 2.2046, 0.001)).toBe(true);
  });
});

describe("English volume promotion", () => {
  test("6 tsp fully promotes to fl_oz (= 1 fl oz)", () => {
    const sixTsp: Measurement<"tsp"> = { value: 6, unit: "tsp", kind: "volume" };
    const promoted = promoteEnglishVolume(sixTsp);
    expect(promoted.unit).toBe("fl_oz");
    expect(approx(promoted.value, 1)).toBe(true);
  });

  test("3 tsp promotes to 1 tbsp", () => {
    const threeTsp: Measurement<"tsp"> = { value: 3, unit: "tsp", kind: "volume" };
    const promoted3 = promoteEnglishVolume(threeTsp);
    expect(promoted3.unit).toBe("tbsp");
    expect(approx(promoted3.value, 1)).toBe(true);
  });

  test("48 tsp promotes to 1 cup", () => {
    const thirtySixTsp: Measurement<"tsp"> = { value: 48, unit: "tsp", kind: "volume" };
    const bigPromoted = promoteEnglishVolume(thirtySixTsp);
    expect(bigPromoted.unit).toBe("cup");
    expect(approx(bigPromoted.value, 1)).toBe(true);
  });
});

describe("English weight promotion", () => {
  test("32 oz promotes to 2 lb", () => {
    const thirtyTwoOz: Measurement<"oz"> = { value: 32, unit: "oz", kind: "weight" };
    const promotedWeight = promoteEnglishWeight(thirtyTwoOz);
    expect(promotedWeight.unit).toBe("lb");
    expect(approx(promotedWeight.value, 2)).toBe(true);
  });
});

describe("English volume multiplication with promotion", () => {
  test("1.5 cups stays as cups", () => {
    const halfCup: Measurement<EnglishVolumeUnit> = { value: 0.5, unit: "cup", kind: "volume" };
    const tripled = multiplyEnglishVolume(halfCup, 3);
    expect(tripled.unit).toBe("cup");
    expect(approx(tripled.value, 1.5)).toBe(true);
  });

  test("2 tsp × 3 fully promotes to 1 fl oz", () => {
    const twoTsp: Measurement<"tsp"> = { value: 2, unit: "tsp", kind: "volume" };
    const sixthResult = multiplyEnglishVolume(twoTsp, 3);
    expect(sixthResult.unit).toBe("fl_oz");
    expect(approx(sixthResult.value, 1)).toBe(true);
  });

  test("promote:false keeps original unit (raw 6 tsp)", () => {
    const twoTsp: Measurement<"tsp"> = { value: 2, unit: "tsp", kind: "volume" };
    const noPromote = multiplyEnglishVolume(twoTsp, 3, { promote: false });
    expect(noPromote.unit).toBe("tsp");
    expect(approx(noPromote.value, 6)).toBe(true);
  });
});

describe("English weight multiplication", () => {
  test("8 oz × 2 promotes to 1 lb", () => {
    const eightOz: Measurement<"oz"> = { value: 8, unit: "oz", kind: "weight" };
    const doubledOz = multiplyEnglishWeight(eightOz, 2);
    expect(doubledOz.unit).toBe("lb");
    expect(approx(doubledOz.value, 1)).toBe(true);
  });
});

describe("Recipe scaling", () => {
  test("1 cup flour × 2.5 = 2.5 cups, factor stored", () => {
    const oneCupFlour: Measurement<EnglishVolumeUnit> = { value: 1, unit: "cup", kind: "volume" };
    const scaled = scaleEnglishVolume(oneCupFlour, 2.5);
    expect(approx(scaled.scaled.value, 2.5)).toBe(true);
    expect(scaled.factor).toBe(2.5);
  });

  test("¼ cup × 4 = 1 cup", () => {
    const quarterCupMilk: Measurement<EnglishVolumeUnit> = {
      value: 0.25,
      unit: "cup",
      kind: "volume",
    };
    const scaledMilk = scaleEnglishVolume(quarterCupMilk, 4);
    expect(approx(scaledMilk.scaled.value, 1)).toBe(true);
  });

  test("250 ml × 3 = 750 ml", () => {
    const metricMilk = scaleMetricVolume({ value: 250, unit: "ml", kind: "volume" }, 3);
    expect(approx(metricMilk.scaled.value, 750)).toBe(true);
  });
});

describe("parseMeasurement", () => {
  test('parse "2.5 cups"', () => {
    const p1 = parseMeasurement("2.5 cups");
    expect(p1.unit === "cup" && approx(p1.value, 2.5)).toBe(true);
  });

  test('parse "1/3 cup"', () => {
    const p2 = parseMeasurement("1/3 cup");
    expect(p2.unit === "cup" && approx(p2.value, 0.333, 0.01)).toBe(true);
  });

  test('parse "500 ml"', () => {
    const p3 = parseMeasurement("500 ml");
    expect(p3.unit === "ml" && approx(p3.value, 500)).toBe(true);
  });

  test('parse "1 tablespoon"', () => {
    const p4 = parseMeasurement("1 tablespoon");
    expect(p4.unit === "tbsp" && approx(p4.value, 1)).toBe(true);
  });

  test('parse "8 oz" as weight', () => {
    const p5 = parseMeasurement("8 oz");
    expect(p5.unit === "oz" && p5.kind === "weight").toBe(true);
  });

  test("parse unknown unit throws", () => {
    expect(() => parseMeasurement("3 fortnights")).toThrow();
  });
});

describe("format", () => {
  test("format 1.5 cups → 1.5 c", () => {
    expect(format({ value: 1.5, unit: "cup", kind: "volume" })).toBe("1.5 c");
  });

  test("format 2 cups long → 2 cups", () => {
    expect(format({ value: 2, unit: "cup", kind: "volume" }, { abbreviated: false })).toBe(
      "2 cups",
    );
  });
});

describe("formatFraction", () => {
  test("formatFraction ½ cup → ½ c", () => {
    expect(formatFraction({ value: 0.5, unit: "cup", kind: "volume" })).toBe("½ c");
  });

  test("formatFraction 1¼ cup → 1 ¼ c", () => {
    expect(formatFraction({ value: 1.25, unit: "cup", kind: "volume" })).toBe("1 ¼ c");
  });

  test("formatFraction ⅓ cup → ⅓ c", () => {
    expect(formatFraction({ value: 1 / 3, unit: "cup", kind: "volume" })).toBe("⅓ c");
  });
});

describe("mlToNaturalEnglishVolume / gToNaturalEnglishWeight", () => {
  test("14.79 ml → tbsp", () => expect(mlToNaturalEnglishVolume(14.7868).unit).toBe("tbsp"));
  test("236.6 ml → cup", () => expect(mlToNaturalEnglishVolume(236.588).unit).toBe("cup"));
  test("30 g → oz", () => expect(gToNaturalEnglishWeight(30).unit).toBe("oz"));
  test("500 g → lb", () => expect(gToNaturalEnglishWeight(500).unit).toBe("lb"));
});

describe("Generic convert() overload", () => {
  test("convert liter → ml generic", () => {
    const genericVol = convert({ value: 1, unit: "liter", kind: "volume" }, "ml");
    expect(approx(genericVol.value, 1000)).toBe(true);
  });

  test("convert kg → g generic", () => {
    const genericWt = convert({ value: 1, unit: "kg", kind: "weight" }, "g");
    expect(approx(genericWt.value, 1000)).toBe(true);
  });

  test("convert volume → weight throws at runtime", () => {
    expect(() =>
      // @ts-expect-error intentional cross-kind call to test runtime guard
      convert({ value: 1, unit: "cup", kind: "volume" }, "oz"),
    ).toThrow();
  });
});
