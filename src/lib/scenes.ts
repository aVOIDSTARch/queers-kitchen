// src/lib/scenes.ts
// Zone accent map, sky colors, and scene metadata.

export type ZoneName =
  | "dojo"
  | "forest"
  | "garden"
  | "mountain"
  | "rooftop"
  | "scholars"
  | "town-square"
  | "village";

export type MeasurementSystem = "english" | "metric";

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

// Sky/backdrop gradient for each zone — what you see between SVG elements
// and filling the upper portion of the viewport behind the scene layers.
export const ZONE_SKY_COLORS: Record<ZoneName, string> = {
  dojo: "linear-gradient(to bottom, #1a0e06 0%, #2a1a0a 40%, #3d2510 100%)",
  forest: "linear-gradient(to bottom, #0a0f06 0%, #111a0a 50%, #1e2e10 100%)",
  garden: "linear-gradient(to bottom, #06080f 0%, #0e1220 50%, #1a1e2a 100%)",
  mountain: "linear-gradient(to bottom, #02020a 0%, #080518 50%, #100a28 100%)",
  rooftop: "linear-gradient(to bottom, #050408 0%, #100c18 40%, #1e1520 100%)",
  scholars: "linear-gradient(to bottom, #0f0804 0%, #1e1008 50%, #2a1a0a 100%)",
  "town-square": "linear-gradient(to bottom, #0a0604 0%, #1a0e06 40%, #2e1a08 100%)",
  village: "linear-gradient(to bottom, #06040a 0%, #120a14 40%, #1e1020 100%)",
};

export const ALL_ZONES: ZoneName[] = Object.keys(ZONE_ACCENTS) as ZoneName[];

export function zoneForSlug(slug: string): ZoneName {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ALL_ZONES[hash % ALL_ZONES.length];
}

export function randomZone(): ZoneName {
  return ALL_ZONES[Math.floor(Math.random() * ALL_ZONES.length)];
}
