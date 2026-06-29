// src/components/scenes/ParallaxScene.tsx
// Parallax scene container. Renders four depth layers as fixed SVG planes.
// Layer CSS vars driven by scroll: --px-far, --px-mid, --px-near, --px-fg.
// Mobile: parallax disabled, only near layer shown at low opacity.

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  zone: string;
  far?: ReactNode;
  mid?: ReactNode;
  near?: ReactNode;
  fg?: ReactNode;
}

const LAYER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
};

export function ParallaxScene({ zone, far, mid, near, fg }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const mq = window.matchMedia("(max-width: 768px)");

    function updateParallax() {
      if (!scene) return;
      const y = window.scrollY;
      scene.style.setProperty("--px-far", `${y * 0.1}px`);
      scene.style.setProperty("--px-mid", `${y * 0.25}px`);
      scene.style.setProperty("--px-near", `${y * 0.45}px`);
      scene.style.setProperty("--px-fg", `${y * 0.65}px`);
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }

    if (!mq.matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
      updateParallax();
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        ref={sceneRef}
        data-zone-scene={zone}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 52,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* FAR — sky, distant mountains */}
        <div
          style={{
            ...LAYER_STYLE,
            transform: "translateY(var(--px-far, 0px))",
            willChange: "transform",
          }}
        >
          {far}
        </div>

        {/* MID — trees, pagodas, mid-ground */}
        <div
          style={{
            ...LAYER_STYLE,
            transform: "translateY(var(--px-mid, 0px))",
            willChange: "transform",
          }}
        >
          {mid}
        </div>

        {/* NEAR — close foreground elements */}
        <div
          style={{
            ...LAYER_STYLE,
            transform: "translateY(var(--px-near, 0px))",
            willChange: "transform",
          }}
        >
          {near}
        </div>

        {/* FG — ninja figure */}
        <div
          style={{
            ...LAYER_STYLE,
            transform: "translateY(var(--px-fg, 0px))",
            willChange: "transform",
          }}
        >
          {fg}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-zone-scene] {
            left: 0 !important;
          }
          [data-zone-scene] > div {
            transform: none !important;
          }
          [data-zone-scene] > div:nth-child(1),
          [data-zone-scene] > div:nth-child(2),
          [data-zone-scene] > div:nth-child(4) {
            opacity: 0;
          }
          [data-zone-scene] > div:nth-child(3) {
            opacity: 0.18;
          }
        }
      `}</style>
    </>
  );
}
