// src/components/ui/ZoneLayout.tsx
// Fixed parallax scene backdrop + scrolling content panel.

import type { ReactNode } from "react";
import type { ZoneName } from "../../lib/scenes";
import { ZONE_ACCENTS, ZONE_SKY_COLORS } from "../../lib/scenes";
import { SceneForZone } from "../scenes/Scenes";

interface Props {
  zone: ZoneName;
  children: ReactNode;
}

export function ZoneLayout({ zone, children }: Props) {
  const a = ZONE_ACCENTS[zone];
  const sky = ZONE_SKY_COLORS[zone];

  return (
    <div
      className="zone-shell"
      data-zone={zone}
      style={
        {
          "--zone-accent": a.accent,
          "--zone-accent-dim": a.dim,
          "--zone-glow": a.glow,
        } as React.CSSProperties
      }
    >
      {/* Sky backdrop — fixed, behind scene layers */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: "0 0 0 52px",
          zIndex: 0,
          background: sky,
          pointerEvents: "none",
        }}
      />

      {/* Scene SVG layers — ParallaxScene is itself fixed */}
      <SceneForZone zone={zone} />

      {/* Transparent spacer so scene is visible before content */}
      <div className="zone-spacer" aria-hidden="true" />

      {/* Solid content slides up over scene on scroll */}
      <div className="zone-content">{children}</div>
    </div>
  );
}
