import { describe, test, expect } from "vite-plus/test";
import { displayQty } from "../src/lib/ingredientQty";

describe("displayQty — scaling (same system)", () => {
  test("doubles a fractional cup", () => expect(displayQty("½ cup", 2, "english")).toBe("1 c"));
  test("halves a cup", () => expect(displayQty("1 cup", 0.5, "english")).toBe("½ c"));
  test("scales tablespoons", () => expect(displayQty("2 tbsp", 3, "english")).toBe("6 tbsp"));
  test("factor 1 keeps the value", () => expect(displayQty("½ tsp", 1, "english")).toBe("½ tsp"));
  test("scales metric grams", () => expect(displayQty("500g", 2, "metric")).toBe("1000 g"));
  test("scales metric ml", () => expect(displayQty("500ml", 0.5, "metric")).toBe("250 ml"));
});

describe("displayQty — system conversion", () => {
  test("cup → metric ml", () => expect(displayQty("1 cup", 1, "metric")).toBe("237 ml"));
  test("metric g → english", () => expect(displayQty("500g", 1, "english")).toBe("1.1 lb"));
  test("tbsp → metric ml", () => expect(displayQty("2 tbsp", 1, "metric")).toBe("30 ml"));
});

describe("displayQty — non-measurements (counts)", () => {
  test("scales a leading count", () =>
    expect(displayQty("2 cloves", 2, "english")).toBe("4 cloves"));
  test("count unaffected by system toggle", () =>
    expect(displayQty("1 medium", 1, "metric")).toBe("1 medium"));
  test("strips a parenthetical alternate", () =>
    expect(displayQty("15g (1¼ tbsp)", 1, "metric")).toBe("15 g"));
});
