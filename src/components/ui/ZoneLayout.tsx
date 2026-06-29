// src/components/ui/ZoneLayout.tsx
// Wraps a page with a fixed parallax scene behind and solid content panel
// that slides up over the scene on scroll. Port of ZoneLayout.astro.

import type { ReactNode } from "react";
import type { ZoneName } from "../../lib/scenes";
import { ZONE_ACCENTS } from "../../lib/scenes";
import { SceneForZone } from "../scenes/Scenes";

interface Props {
  zone: ZoneName;
  children: ReactNode;
}

export function ZoneLayout({ zone, children }: Props) {
  const a = ZONE_ACCENTS[zone];

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
      {/* Fixed parallax scene */}
      <div className="zone-scene">
        <SceneForZone zone={zone} />
      </div>

      {/* Transparent spacer — scene visible through here */}
      <div className="zone-spacer" aria-hidden="true" />

      {/* Solid content panel slides up over scene */}
      <div className="zone-content">{children}</div>
    </div>
  );
}
