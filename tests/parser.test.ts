/**
 * parser.test.ts
 * Tests the parser and props builders against the real cookbook markdown files.
 */

import { describe, test, expect } from "vite-plus/test";
import { parseRecipeMarkdown } from "../recipe-parser/parser";
import {
  recipeToPageProps,
  recipeToCardProps,
  buildCookbookIndexProps,
  scaleRecipePageProps,
} from "../recipe-parser/props";

// ─── Real markdown from the Cookbook Google Drive folder ─────────────────────

const CELERIAC_MD = `# Celeriac with Kimchi Remoulade

> A French bistro classic reoriented toward Korea: raw celeriac and carrot cut into matchsticks, dressed in a kimchi-spiked mayonnaise with capers, dried shrimp, and horseradish. The texture is everything — do not grate.

**Serves:** 4–6 | **Time:** ~25 minutes

---

## Ingredients

| Qty | Ingredient |
|-----|------------|
| 1 medium | Celeriac (celery root), trimmed, peeled, cut into matchsticks (~1/8" square × 1.5" long) |
| 1 medium | Carrot, cut into matchsticks |
| 1 stalk | Celery, preferably with leaves, finely chopped |
| ½ cup | Choi's green cabbage kimchi, roughly chopped |
| ¼ cup | Dried shrimp, finely chopped |
| 2 tbsp | Capers in sea salt |
| ¼ cup | Duke's mayonnaise |
| 2 tbsp | Extra virgin olive oil |
| 1 tbsp | Whole grain mustard |
| 1 tbsp | Fresh horseradish, grated (or 1 tsp prepared) |
| 2 cloves | Garlic, crushed or grated |
| 1 tbsp | Ketchup |
| 1 tbsp | Apple cider vinegar |
| ½ tsp | Fine sea salt |
| ½ tsp | Sugar |

---

## Method

### 1. Soak the capers
Soak capers in cold water for 15 minutes to draw out excess salt. Drain and chop coarsely.

### 2. Build the dressing
Dissolve the salt and sugar in the vinegar in a large bowl. Add the mayonnaise, olive oil, kimchi, chopped capers, mustard, horseradish, garlic, and ketchup. Mix until combined.

### 3. Add the vegetables and serve
Add the celeriac, carrot, and celery to the bowl and toss to coat thoroughly. Taste and adjust salt. Serve at room temperature — cold dulls the flavors.

---

## Notes

**Cut, don't grate:** A box grater shreds celeriac too finely and turns the salad into mush. The matchstick cut — roughly 1/8" square and 1.5" long — preserves texture and gives the dressing something to cling to rather than drown. A food processor with a julienne disc is the acceptable shortcut; a box grater is not.

**Kimchi:** The recipe calls for green cabbage kimchi specifically (Choi's is the source). Napa cabbage kimchi works but is wetter and more intensely flavored — reduce slightly and drain before chopping.

**Dried shrimp:** Adds a layer of background umami rather than a detectable seafood note. Don't skip it. Found in most Asian grocery stores; finely chop so it integrates rather than punctuates.

**Make-ahead:** The salad holds at room temperature for 1–2 hours as the celeriac continues to soften slightly in the dressing. Beyond that, refrigerate — it keeps a day, though the texture will soften further.
`;

const BRUSSELS_MD = `# Brussels Sprouts Kimchi

> Dense, tightly layered sprouts that most kimchi recipes render dry and unevenly fermented — fixed here with quartered cuts, a light 3% brine, and a fluid fruit-based paste that flows between the leaves rather than sitting on the surface.

**Serves:** 4 (yields ~0.8L jar) | **Time:** ~30 minutes active + 1 hr brining + 1–2 days fermentation

---

## Ingredients

### Brine
| Qty | Ingredient |
|-----|------------|
| 500ml | Water |
| 15g (1¼ tbsp) | Coarse sea salt |

### Kimchi Paste
| Qty | Ingredient |
|-----|------------|
| 70g (¼ fruit) | Asian pear or crisp apple (Fuji or Gala), roughly chopped |
| 30g (¼ medium) | Onion, roughly chopped |
| 8g (~2 cloves) | Garlic, lightly crushed |
| 2g (1 thin slice) | Fresh ginger |
| 2 tbsp | Gochugaru (Korean red chili powder) |
| 1 tbsp | Anchovy sauce or fish sauce *(vegan: 1½ tbsp guk-ganjang)* |
| 15g (1 stalk) | Green onion, sliced diagonally |

### Main
| Qty | Ingredient |
|-----|------------|
| 500g | Brussels sprouts, cut into quarters through the stem |

### To Finish
| Qty | Ingredient |
|-----|------------|
| ½ cup | Water |
| ½ tsp | Coarse sea salt |

---

## Method

### 1. Prep the sprouts
Rinse briefly if needed. Cut each sprout through the stem into quarters — the stem holds the leaves together and prevents them from disintegrating.

### 2. Brine
Dissolve the salt completely in the water to make a 3% brine. Add the sprouts and keep them fully submerged. Brine for 1 hour, turning gently once halfway through.

### 3. Drain — do not rinse or squeeze
After brining, drain for about 10 minutes to shed surface liquid. Do not rinse and do not squeeze.

### 4. Blend the paste base
Blend the Asian pear (or apple) and onion until smooth. Add the garlic and ginger, then pulse until finely minced.

### 5. Finish the paste
Transfer the blended base to a bowl. Add gochugaru, fish sauce, and green onion. Mix until the paste is loose and fluid.

### 6. Combine
Add the drained sprouts to the paste. Mix very gently — no squeezing, no pressing. Stop once the sprouts are uniformly glossy.

### 7. Pack the jar
Transfer the kimchi to a clean 0.8-litre jar. Press just enough to eliminate air pockets without compacting the vegetables.

### 8. Ferment at room temperature
Ferment at 18–20°C (65–70°F) for 1–2 days. Readiness signals: a lightly tangy aroma and small bubbles visible in the brine.

### 9. Refrigerate
Move the jar to the refrigerator. Best within the first 1 to 1½ months when texture is lively and acidity is balanced.

---

## Notes

**Why not a standard cabbage kimchi method:** Brussels sprouts are dense and release very little natural water.

**No starch slurry:** Cabbage kimchi uses a porridge or slurry for binding because cabbage needs it. Brussels sprouts don't.

**Fermentation cues over timing:** The 1–2 day window is a starting point. Trust the tangy smell and bubble activity over the calendar.

**Vegan substitution:** Replace fish sauce with 1½ tbsp guk-ganjang (Korean light soy sauce).
`;

const SLAW_MD = `# Shaved Brussels Sprout Slaw with Citrus-Dijon Vinaigrette

> Raw Brussels sprouts shredded thin and macerated in a mustardy lime-champagne vinaigrette — bright, bitter, and punchy, with craisins and toasted nuts for contrast.

**Serves:** 4 | **Time:** ~25 minutes

---

## Ingredients

### Vinaigrette
| Qty | Ingredient |
|-----|------------|
| 3 tbsp | Citrus champagne vinegar |
| 1 tbsp | Lime juice (bottled 100% is fine) |
| 1½ tbsp | Grey Poupon Dijon mustard |
| 1 | Garlic clove, minced or grated |
| 1 | Shallot, finely minced |
| 1 tsp | Honey or maple syrup |
| ¼ cup | Olive oil, good quality |
| ¾ tsp | Kosher salt |
| ½ tsp | Black pepper, freshly cracked |

### Slaw
| Qty | Ingredient |
|-----|------------|
| 12 oz | Brussels sprouts, shredded |
| ⅓ cup | Craisins |
| ⅓ cup | Toasted nuts (pecans, almonds, or walnuts) |
| 2 oz | Parmesan or Pecorino, shaved or grated *(optional)* |

---

## Method

### 1. Make the vinaigrette
Whisk together the vinegar, lime juice, Dijon, garlic, shallot, honey, salt, and pepper until combined. Slowly drizzle in the olive oil while whisking constantly to emulsify.

### 2. Dress and macerate
Toss the shredded Brussels sprouts with about two-thirds of the dressing and a pinch of salt. Let sit for at least 10–15 minutes.

### 3. Toast the nuts
Toast the nuts in a dry skillet over medium heat, stirring frequently, until fragrant and lightly golden — about 3–4 minutes.

### 4. Finish and serve
Fold in the craisins, toasted nuts, and cheese if using. Add remaining dressing to taste. Adjust salt and acid.

---

## Notes

**Maceration is the work:** Don't shortcut the rest time. Ten minutes minimum; fifteen is better.

**Lime over lemon here:** Lime's sharper, more distinct acidity contrasts the champagne vinegar rather than doubling up on the same citrus note.

**Make-ahead:** Dressing keeps refrigerated up to one week. The dressed slaw holds a day in the fridge — add nuts and craisins just before serving so they don't go soft.
`;

// ─── Parsed fixtures ──────────────────────────────────────────────────────────

const celeriac = parseRecipeMarkdown(CELERIAC_MD, "celeriac-kimchi-remoulade.md");
const brussels = parseRecipeMarkdown(BRUSSELS_MD, "brussels-sprouts-kimchi.md");
const slaw = parseRecipeMarkdown(SLAW_MD, "shaved-brussels-sprout-slaw-citrus-dijon.md");

// ─── Parser tests ─────────────────────────────────────────────────────────────

describe("Celeriac recipe — flat (ungrouped) ingredients", () => {
  test("title parsed", () => expect(celeriac.title).toBe("Celeriac with Kimchi Remoulade"));
  test("tagline parsed", () => expect(celeriac.tagline.includes("French bistro")).toBe(true));
  test("serves parsed", () => expect(celeriac.meta.serves).toBe("4–6"));
  test("time parsed", () => expect(celeriac.meta.time).toBe("~25 minutes"));
  test("one ingredient group (flat)", () => expect(celeriac.ingredientGroups.length).toBe(1));
  test("no group name on flat list", () =>
    expect(celeriac.ingredientGroups[0].groupName).toBeUndefined());
  test("15 ingredients", () => expect(celeriac.ingredientGroups[0].ingredients.length).toBe(15));
  test("first qty", () => expect(celeriac.ingredientGroups[0].ingredients[0].qty).toBe("1 medium"));
  test("first name", () =>
    expect(celeriac.ingredientGroups[0].ingredients[0].name.startsWith("Celeriac")).toBe(true));
  test("3 method steps", () => expect(celeriac.steps.length).toBe(3));
  test("step 1 number", () => expect(celeriac.steps[0].stepNumber).toBe(1));
  test("step 1 title", () => expect(celeriac.steps[0].title).toBe("Soak the capers"));
  test("step 1 body", () => expect(celeriac.steps[0].body.includes("Soak capers")).toBe(true));
  test("4 notes", () => expect(celeriac.notes.length).toBe(4));
  test("note 1 label", () => expect(celeriac.notes[0].label).toBe("Cut, don't grate"));
  test("note 1 body", () => expect(celeriac.notes[0].body.includes("box grater")).toBe(true));
  test("note 4 label", () => expect(celeriac.notes[3].label).toBe("Make-ahead"));
});

describe("Brussels Sprouts Kimchi — grouped ingredients", () => {
  test("title parsed", () => expect(brussels.title).toBe("Brussels Sprouts Kimchi"));
  test("complex serves string parsed", () =>
    expect(brussels.meta.serves).toBe("4 (yields ~0.8L jar)"));
  test("multi-part time parsed", () => expect(brussels.meta.time.includes("brining")).toBe(true));
  test("4 ingredient groups", () => expect(brussels.ingredientGroups.length).toBe(4));
  test("group 0: Brine", () => expect(brussels.ingredientGroups[0].groupName).toBe("Brine"));
  test("group 1: Kimchi Paste", () =>
    expect(brussels.ingredientGroups[1].groupName).toBe("Kimchi Paste"));
  test("group 2: Main", () => expect(brussels.ingredientGroups[2].groupName).toBe("Main"));
  test("group 3: To Finish", () =>
    expect(brussels.ingredientGroups[3].groupName).toBe("To Finish"));
  test("Brine has 2 ingredients", () =>
    expect(brussels.ingredientGroups[0].ingredients.length).toBe(2));
  test("Paste has 7 ingredients", () =>
    expect(brussels.ingredientGroups[1].ingredients.length).toBe(7));
  test("9 method steps", () => expect(brussels.steps.length).toBe(9));
  test("last step is #9", () => expect(brussels.steps[8].stepNumber).toBe(9));
  test("isLast absent from ParsedRecipe step", () =>
    expect("isLast" in brussels.steps[8]).toBe(false));
  test("4 notes", () => expect(brussels.notes.length).toBe(4));
  test("first note label", () =>
    expect(brussels.notes[0].label).toBe("Why not a standard cabbage kimchi method"));
});

describe("Slaw — also grouped ingredients", () => {
  test("2 ingredient groups", () => expect(slaw.ingredientGroups.length).toBe(2));
  test("group 0: Vinaigrette", () =>
    expect(slaw.ingredientGroups[0].groupName).toBe("Vinaigrette"));
  test("group 1: Slaw", () => expect(slaw.ingredientGroups[1].groupName).toBe("Slaw"));
  test("9 vinaigrette ingredients", () =>
    expect(slaw.ingredientGroups[0].ingredients.length).toBe(9));
  test("4 slaw ingredients", () => expect(slaw.ingredientGroups[1].ingredients.length).toBe(4));
  test("4 method steps", () => expect(slaw.steps.length).toBe(4));
  test("3 notes", () => expect(slaw.notes.length).toBe(3));
});

// ─── Props builder tests ──────────────────────────────────────────────────────

describe("recipeToPageProps — celeriac", () => {
  const celeriacProps = recipeToPageProps(celeriac, {
    imageUrl: "/images/celeriac-kimchi-remoulade.jpg",
  });

  test("slug derived from title", () =>
    expect(celeriacProps.slug).toBe("celeriac-with-kimchi-remoulade"));
  test("hero title", () => expect(celeriacProps.hero.title).toBe("Celeriac with Kimchi Remoulade"));
  test("hero serves", () => expect(celeriacProps.hero.serves).toBe("4–6"));
  test("hero imageUrl", () =>
    expect(celeriacProps.hero.imageUrl).toBe("/images/celeriac-kimchi-remoulade.jpg"));
  test("totalCount", () => expect(celeriacProps.ingredients.totalCount).toBe(15));
  test("groupIndex populated", () =>
    expect(celeriacProps.ingredients.groups[0].groupIndex).toBe(0));
  test("row index populated", () =>
    expect(celeriacProps.ingredients.groups[0].ingredients[0].index).toBe(0));
  test("totalSteps", () => expect(celeriacProps.method.totalSteps).toBe(3));
  test("step index populated", () => expect(celeriacProps.method.steps[0].index).toBe(0));
  test("isLast false on first step", () =>
    expect(celeriacProps.method.steps[0].isLast).toBe(false));
  test("isLast true on last step", () => expect(celeriacProps.method.steps[2].isLast).toBe(true));
  test("note index populated", () => expect(celeriacProps.notes.notes[0].index).toBe(0));
  test("note label in props", () =>
    expect(celeriacProps.notes.notes[0].label).toBe("Cut, don't grate"));
});

describe("recipeToPageProps — brussels (grouped)", () => {
  const brusselsProps = recipeToPageProps(brussels);

  test("4 groups in props", () => expect(brusselsProps.ingredients.groups.length).toBe(4));
  test("group name preserved", () =>
    expect(brusselsProps.ingredients.groups[1].groupName).toBe("Kimchi Paste"));
  test("groupIndex = 1", () => expect(brusselsProps.ingredients.groups[1].groupIndex).toBe(1));
  test("12 total ingredients across all groups", () =>
    expect(brusselsProps.ingredients.totalCount).toBe(12));
  test("step 9 isLast = true", () => expect(brusselsProps.method.steps[8].isLast).toBe(true));
});

describe("recipeToCardProps", () => {
  const card = recipeToCardProps(celeriac, { imageUrl: "/img/celeriac.jpg" });

  test("card title", () => expect(card.title).toBe("Celeriac with Kimchi Remoulade"));
  test("card tagline", () => expect(card.tagline.includes("French bistro")).toBe(true));
  test("card serves", () => expect(card.serves).toBe("4–6"));
  test("card slug", () => expect(card.slug).toBe("celeriac-with-kimchi-remoulade"));
  test("card imageUrl", () => expect(card.imageUrl).toBe("/img/celeriac.jpg"));
});

describe("buildCookbookIndexProps", () => {
  const index = buildCookbookIndexProps([celeriac, brussels, slaw]);

  test("index totalCount", () => expect(index.totalCount).toBe(3));
  test("first card slug", () =>
    expect(index.recipes[0].slug).toBe("celeriac-with-kimchi-remoulade"));
  test("second card slug", () => expect(index.recipes[1].slug).toBe("brussels-sprouts-kimchi"));
  test("third card slug", () =>
    expect(index.recipes[2].slug).toBe(
      "shaved-brussels-sprout-slaw-with-citrus-dijon-vinaigrette",
    ));
});

describe("scaleRecipePageProps", () => {
  test("scaleFactor stored, originalServes preserved, serves range scaled", () => {
    const celeriacPageProps = recipeToPageProps(celeriac);
    const doubled = scaleRecipePageProps(celeriacPageProps, 2);
    expect(doubled.scaleFactor).toBe(2);
    expect(doubled.originalServes).toBe("4–6");
    expect(doubled.hero.serves).toBe("8–12");
  });

  test("complex serves string scaled (numeric only)", () => {
    const brusselsPageProps = recipeToPageProps(brussels);
    const halfBatch = scaleRecipePageProps(brusselsPageProps, 0.5);
    expect(halfBatch.hero.serves).toBe("2 (yields ~0.8L jar)");
  });
});

describe("slugOverride", () => {
  test("slugOverride respected", () => {
    const custom = recipeToPageProps(celeriac, { slugOverride: "my-custom-slug" });
    expect(custom.slug).toBe("my-custom-slug");
  });
});
