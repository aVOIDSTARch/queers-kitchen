// src/components/scenes/ParallaxScene.tsx
// Port of ParallaxScene.astro — drives CSS custom properties from scroll.
// Each layer reads its var and translates vertically:
//   --px-far  10% of scrollY  (sky, mountains)
//   --px-mid  25% of scrollY  (trees, pagodas)
//   --px-near 45% of scrollY  (buildings, close trees)
//   --px-fg   65% of scrollY  (foreground ninja)
// Mobile (≤768px): parallax disabled entirely.

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  zone: string;
  far?: ReactNode;
  mid?: ReactNode;
  near?: ReactNode;
  fg?: ReactNode;
}

export function ParallaxScene({ zone, far, mid, near, fg }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) return;

    let ticking = false;

    function updateParallax() {
      if (!scene) return;
      const y = window.scrollY;
      scene.style.setProperty("--px-far", `${y * 0.1}px`);
      scene.style.setProperty("--px-mid", `${y * 0.25}px`);
      scene.style.setProperty("--px-near", `${y * 0.45}px`);
      scene.style.setProperty("--px-fg", `${y * 0.65}px`);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={sceneRef}
      className="px-scene"
      data-zone-scene={zone}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: "0 0 0 52px",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        className="px-layer px-layer--far"
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transform: "translateY(var(--px-far, 0px))",
        }}
      >
        {far}
      </div>
      <div
        className="px-layer px-layer--mid"
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transform: "translateY(var(--px-mid, 0px))",
        }}
      >
        {mid}
      </div>
      <div
        className="px-layer px-layer--near"
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transform: "translateY(var(--px-near, 0px))",
        }}
      >
        {near}
      </div>
      <div
        className="px-layer px-layer--fg"
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transform: "translateY(var(--px-fg, 0px))",
        }}
      >
        {fg}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .px-scene { inset: 0 !important; }
          .px-layer { transform: none !important; }
          .px-layer--far, .px-layer--mid, .px-layer--fg { opacity: 0; }
          .px-layer--near { opacity: 0.18; }
        }
      `}</style>
    </div>
  );
}
