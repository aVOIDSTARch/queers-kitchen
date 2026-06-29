// src/lib/scenes.ts
// Zone accent map and scene metadata — ported from ZoneLayout.astro

export type ZoneName =
  | "dojo"
  | "forest"
  | "garden"
  | "mountain"
  | "rooftop"
  | "scholars"
  | "town-square"
  | "village";

export interface ZoneAccent {
  accent: string;
  dim: string;
  glow: string;
  name: string;
  kanji: string;
}

export const ZONE_ACCENTS: Record<ZoneName, ZoneAccent> = {
  dojo: {
    accent: "#E34234",
    dim: "rgba(227,66,52,0.15)",
    glow: "rgba(227,66,52,0.08)",
    name: "Dojo",
    kanji: "道",
  },
  forest: {
    accent: "#E8A020",
    dim: "rgba(232,160,32,0.15)",
    glow: "rgba(232,160,32,0.08)",
    name: "Forest",
    kanji: "林",
  },
  garden: {
    accent: "#c8b490",
    dim: "rgba(200,180,144,0.15)",
    glow: "rgba(200,180,144,0.06)",
    name: "Garden",
    kanji: "庭",
  },
  mountain: {
    accent: "#6b3fa0",
    dim: "rgba(107,63,160,0.15)",
    glow: "rgba(107,63,160,0.08)",
    name: "Mountain",
    kanji: "山",
  },
  rooftop: {
    accent: "#c87840",
    dim: "rgba(200,120,64,0.15)",
    glow: "rgba(200,120,64,0.08)",
    name: "Rooftop",
    kanji: "屋",
  },
  scholars: {
    accent: "#E8A020",
    dim: "rgba(232,160,32,0.15)",
    glow: "rgba(232,160,20,0.06)",
    name: "Scholars",
    kanji: "学",
  },
  "town-square": {
    accent: "#b87333",
    dim: "rgba(184,115,51,0.15)",
    glow: "rgba(184,115,51,0.08)",
    name: "Town Square",
    kanji: "広",
  },
  village: {
    accent: "#E34234",
    dim: "rgba(227,66,52,0.12)",
    glow: "rgba(227,66,52,0.06)",
    name: "Village",
    kanji: "村",
  },
};

export type MeasurementSystem = "english" | "metric";

export const ALL_ZONES: ZoneName[] = Object.keys(ZONE_ACCENTS) as ZoneName[];

/** Pick a deterministic zone for a recipe based on its slug */
export function zoneForSlug(slug: string): ZoneName {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ALL_ZONES[hash % ALL_ZONES.length];
}

/** Pick a random zone (called once on component mount) */
export function randomZone(): ZoneName {
  return ALL_ZONES[Math.floor(Math.random() * ALL_ZONES.length)];
}
