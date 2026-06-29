// src/components/scenes/Scenes.tsx
// All 8 parallax scene components, each porting the exact SVG from the Astro source.
// Import the one you need: SceneDojo, SceneForest, etc.

import { ParallaxScene } from "./ParallaxScene";

const SVG_PROPS = {
  viewBox: "0 0 1200 800",
  preserveAspectRatio: "xMidYMax meet",
  style: {
    display: "block",
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
  },
};

// ─── SceneDojo ────────────────────────────────────────────────────────────────
export function SceneDojo() {
  return (
    <ParallaxScene
      zone="dojo"
      far={
        <svg {...SVG_PROPS}>
          <rect x="0" y="300" width="1200" height="500" fill="var(--sil-far)" />
          <rect x="50" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.18" />
          <rect x="230" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.22" />
          <rect x="410" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.15" />
          <rect x="620" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.20" />
          <rect x="800" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.25" />
          <rect x="980" y="310" width="160" height="280" fill="var(--sil-window)" opacity="0.18" />
          <g fill="none" stroke="var(--sil-far)" strokeWidth="3" opacity="0.8">
            <rect x="50" y="310" width="160" height="280" />
            <rect x="230" y="310" width="160" height="280" />
            <rect x="410" y="310" width="160" height="280" />
            <rect x="620" y="310" width="160" height="280" />
            <rect x="800" y="310" width="160" height="280" />
            <rect x="980" y="310" width="160" height="280" />
            <line x1="130" y1="310" x2="130" y2="590" />
            <line x1="50" y1="450" x2="210" y2="450" />
            <line x1="310" y1="310" x2="310" y2="590" />
            <line x1="230" y1="450" x2="390" y2="450" />
            <line x1="490" y1="310" x2="490" y2="590" />
            <line x1="410" y1="450" x2="570" y2="450" />
            <line x1="700" y1="310" x2="700" y2="590" />
            <line x1="620" y1="450" x2="780" y2="450" />
            <line x1="880" y1="310" x2="880" y2="590" />
            <line x1="800" y1="450" x2="960" y2="450" />
            <line x1="1060" y1="310" x2="1060" y2="590" />
            <line x1="980" y1="450" x2="1140" y2="450" />
          </g>
          <rect x="0" y="588" width="1200" height="12" fill="var(--sil-far)" />
          <rect x="0" y="295" width="1200" height="18" fill="var(--sil-far)" />
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-mid)">
            <rect x="60" y="430" width="14" height="220" />
            <rect x="160" y="430" width="14" height="220" />
            <rect x="55" y="445" width="125" height="10" rx="2" />
            <rect x="55" y="530" width="125" height="10" rx="2" />
            <rect x="55" y="615" width="125" height="10" rx="2" />
            <rect x="78" y="420" width="6" height="200" rx="2" transform="rotate(-8,78,420)" />
            <rect x="95" y="418" width="6" height="198" rx="2" transform="rotate(-3,95,418)" />
            <rect x="112" y="420" width="6" height="200" rx="2" transform="rotate(4,112,420)" />
            <rect x="130" y="422" width="6" height="196" rx="2" transform="rotate(9,130,422)" />
            <rect x="148" y="415" width="5" height="240" rx="2" transform="rotate(3,148,415)" />
          </g>
          <g fill="var(--sil-mid)">
            <rect x="580" y="420" width="20" height="250" />
            <rect x="565" y="640" width="50" height="30" rx="2" />
            <circle cx="590" cy="470" r="28" fill="none" stroke="var(--sil-mid)" strokeWidth="3" />
            <circle cx="590" cy="470" r="18" fill="none" stroke="var(--sil-mid)" strokeWidth="3" />
            <circle cx="590" cy="470" r="8" />
          </g>
          <g fill="var(--sil-mid)">
            <line x1="300" y1="0" x2="300" y2="380" stroke="var(--sil-mid)" strokeWidth="2" />
            <ellipse cx="300" cy="398" rx="18" ry="25" fill="var(--sil-window)" opacity="0.5" />
            <rect x="290" y="373" width="20" height="6" rx="2" />
            <rect x="290" y="417" width="20" height="6" rx="2" />
            <line x1="900" y1="0" x2="900" y2="360" stroke="var(--sil-mid)" strokeWidth="2" />
            <ellipse cx="900" cy="378" rx="18" ry="25" fill="var(--sil-window)" opacity="0.45" />
            <rect x="890" y="353" width="20" height="6" rx="2" />
            <rect x="890" y="397" width="20" height="6" rx="2" />
          </g>
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <rect x="0" y="660" width="1200" height="140" fill="var(--sil-near)" opacity="0.6" />
          <g stroke="var(--sil-far)" strokeWidth="1.5" opacity="0.35" fill="none">
            <line x1="0" y1="668" x2="1200" y2="668" />
            <line x1="0" y1="700" x2="1200" y2="700" />
            <line x1="0" y1="732" x2="1200" y2="732" />
            <line x1="180" y1="660" x2="180" y2="700" />
            <line x1="360" y1="660" x2="360" y2="700" />
            <line x1="540" y1="660" x2="540" y2="700" />
            <line x1="720" y1="660" x2="720" y2="700" />
            <line x1="900" y1="660" x2="900" y2="700" />
            <line x1="1080" y1="660" x2="1080" y2="700" />
          </g>
          <rect x="0" y="400" width="40" height="400" fill="var(--sil-near)" opacity="0.9" />
          <rect x="1160" y="400" width="40" height="400" fill="var(--sil-near)" opacity="0.9" />
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(820, 420)">
            <circle cx="0" cy="0" r="28" />
            <rect
              x="-16"
              y="-5"
              width="32"
              height="8"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar))"
            />
            <ellipse cx="0" cy="55" rx="26" ry="36" transform="rotate(-8)" />
            <ellipse cx="28" cy="20" rx="10" ry="30" transform="rotate(-55,28,20)" />
            <ellipse cx="48" cy="-10" rx="8" ry="28" transform="rotate(-65,48,-10)" />
            <ellipse cx="-25" cy="35" rx="9" ry="28" transform="rotate(30,-25,35)" />
            <ellipse cx="-46" cy="55" rx="7" ry="22" transform="rotate(25,-46,55)" />
            <rect
              x="30"
              y="-65"
              width="8"
              height="90"
              rx="3"
              transform="rotate(-55,30,-65)"
              fill="var(--sil-mid)"
            />
            <ellipse cx="-22" cy="108" rx="14" ry="40" transform="rotate(12,-22,108)" />
            <ellipse cx="-28" cy="155" rx="12" ry="30" transform="rotate(8,-28,155)" />
            <ellipse cx="22" cy="105" rx="14" ry="38" transform="rotate(-15,22,105)" />
            <ellipse cx="18" cy="150" rx="12" ry="28" transform="rotate(-10,18,150)" />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneForest ──────────────────────────────────────────────────────────────
export function SceneForest() {
  return (
    <ParallaxScene
      zone="forest"
      far={
        <svg {...SVG_PROPS}>
          <rect x="0" y="0" width="1200" height="800" fill="var(--sil-far)" opacity="0.4" />
          <circle cx="900" cy="80" r="52" fill="var(--sil-far)" />
          <circle cx="900" cy="80" r="44" fill="var(--sil-window)" opacity="0.2" />
          <rect x="80" y="200" width="6" height="600" fill="var(--sil-far)" />
          <rect x="200" y="180" width="7" height="620" fill="var(--sil-far)" />
          <rect x="340" y="160" width="6" height="640" fill="var(--sil-far)" />
          <rect x="480" y="190" width="7" height="610" fill="var(--sil-far)" />
          <rect x="620" y="170" width="6" height="630" fill="var(--sil-far)" />
          <rect x="760" y="185" width="7" height="615" fill="var(--sil-far)" />
          <rect x="950" y="175" width="6" height="625" fill="var(--sil-far)" />
          <rect x="1100" y="200" width="7" height="600" fill="var(--sil-far)" />
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-mid)">
            <rect x="50" y="100" width="12" height="700" />
            <rect x="47" y="108" width="18" height="7" rx="3" />
            <rect x="47" y="218" width="18" height="7" rx="3" />
            <rect x="47" y="328" width="18" height="7" rx="3" />
            <ellipse cx="38" cy="102" rx="22" ry="8" transform="rotate(-25,38,102)" />
            <ellipse cx="68" cy="105" rx="20" ry="7" transform="rotate(20,68,105)" />
            <rect x="180" y="80" width="14" height="720" />
            <rect x="177" y="90" width="20" height="7" rx="3" />
            <rect x="177" y="210" width="20" height="7" rx="3" />
            <ellipse cx="168" cy="82" rx="24" ry="9" transform="rotate(-20,168,82)" />
            <ellipse cx="200" cy="84" rx="22" ry="8" transform="rotate(18,200,84)" />
            <rect x="700" y="70" width="14" height="730" />
            <rect x="697" y="80" width="20" height="7" rx="3" />
            <rect x="697" y="200" width="20" height="7" rx="3" />
            <ellipse cx="690" cy="72" rx="24" ry="9" transform="rotate(-18,690,72)" />
            <ellipse cx="718" cy="74" rx="22" ry="8" transform="rotate(20,718,74)" />
          </g>
          <line
            x1="56"
            y1="320"
            x2="186"
            y2="340"
            stroke="var(--sil-mid)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <line
            x1="186"
            y1="340"
            x2="426"
            y2="320"
            stroke="var(--sil-mid)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <line
            x1="706"
            y1="310"
            x2="986"
            y2="325"
            stroke="var(--sil-mid)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <ellipse cx="120" cy="332" rx="12" ry="16" fill="var(--sil-window)" opacity="0.5" />
          <rect x="112" y="316" width="16" height="5" rx="2" fill="var(--sil-mid)" />
          <ellipse cx="305" cy="330" rx="12" ry="16" fill="var(--sil-window)" opacity="0.45" />
          <rect x="297" y="314" width="16" height="5" rx="2" fill="var(--sil-mid)" />
          <ellipse cx="845" cy="318" rx="12" ry="16" fill="var(--sil-window)" opacity="0.45" />
          <rect x="837" y="302" width="16" height="5" rx="2" fill="var(--sil-mid)" />
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-near)" opacity="0.8">
            <rect x="0" y="0" width="18" height="800" />
            <rect x="0" y="0" width="28" height="12" rx="4" />
            <rect x="0" y="120" width="28" height="12" rx="4" />
            <rect x="0" y="240" width="28" height="12" rx="4" />
            <rect x="1182" y="0" width="18" height="800" />
            <rect x="1172" y="0" width="28" height="12" rx="4" />
            <rect x="1172" y="130" width="28" height="12" rx="4" />
          </g>
          <rect x="0" y="720" width="1200" height="80" fill="var(--sil-near)" opacity="0.5" />
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(680, 180)">
            <rect
              x="-80"
              y="60"
              width="200"
              height="10"
              rx="4"
              fill="var(--sil-mid)"
              opacity="0.9"
            />
            <ellipse cx="20" cy="40" rx="22" ry="18" transform="rotate(-15,20,40)" />
            <circle cx="10" cy="12" r="18" />
            <rect
              x="-2"
              y="8"
              width="24"
              height="7"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar-warm))"
            />
            <ellipse cx="-18" cy="52" rx="8" ry="20" transform="rotate(70,-18,52)" />
            <ellipse cx="10" cy="62" rx="10" ry="22" transform="rotate(-25,10,62)" />
            <ellipse cx="30" cy="58" rx="10" ry="20" transform="rotate(10,30,58)" />
            <path d="M 30 30 Q 60 50 70 80 Q 50 70 25 55 Z" opacity="0.7" />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneGarden ──────────────────────────────────────────────────────────────
export function SceneGarden() {
  return (
    <ParallaxScene
      zone="garden"
      far={
        <svg {...SVG_PROPS}>
          <rect x="0" y="400" width="1200" height="400" fill="var(--sil-far)" />
          <rect x="0" y="560" width="1200" height="60" fill="var(--sil-window)" opacity="0.07" />
          <ellipse cx="350" cy="600" rx="400" ry="160" fill="var(--sil-far)" />
          <ellipse cx="900" cy="580" rx="380" ry="140" fill="var(--sil-far)" />
          <g fill="var(--sil-far)">
            <polygon points="80,560 120,430 160,560" />
            <polygon points="90,450 120,370 150,450" />
            <polygon points="900,550 940,440 980,550" />
            <polygon points="910,445 940,365 970,445" />
            <polygon points="1050,560 1090,450 1130,560" />
          </g>
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <ellipse cx="600" cy="680" rx="380" ry="100" fill="var(--sil-mid)" opacity="0.7" />
          <g fill="none" stroke="var(--sil-far)" strokeWidth="1" opacity="0.25">
            <ellipse cx="600" cy="680" rx="350" ry="88" />
            <ellipse cx="600" cy="680" rx="300" ry="75" />
            <ellipse cx="600" cy="680" rx="240" ry="60" />
            <ellipse cx="600" cy="680" rx="175" ry="44" />
          </g>
          <g fill="var(--sil-window)" opacity="0.2">
            <ellipse cx="540" cy="672" rx="28" ry="9" transform="rotate(20,540,672)" />
            <ellipse cx="650" cy="688" rx="24" ry="8" transform="rotate(-15,650,688)" />
          </g>
          <g fill="var(--sil-mid)">
            <rect x="220" y="540" width="18" height="140" />
            <polygon points="200,540 256,540 228,516" />
            <rect x="208" y="556" width="40" height="35" />
            <rect x="212" y="560" width="32" height="27" fill="var(--sil-window)" opacity="0.5" />
            <rect x="204" y="590" width="48" height="10" rx="2" />
            <ellipse cx="229" cy="635" rx="32" ry="10" />
            <ellipse cx="229" cy="680" rx="26" ry="8" />
          </g>
          <g fill="var(--sil-mid)">
            <ellipse cx="390" cy="680" rx="28" ry="12" />
            <ellipse cx="470" cy="675" rx="24" ry="10" />
            <ellipse cx="545" cy="672" rx="22" ry="9" />
            <ellipse cx="660" cy="673" rx="24" ry="10" />
            <ellipse cx="745" cy="677" rx="26" ry="11" />
          </g>
          <ellipse cx="600" cy="720" rx="580" ry="55" fill="var(--sil-far)" opacity="0.35" />
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-near)">
            <rect x="1060" y="300" width="16" height="500" />
            <polygon points="1020,460 1068,300 1116,460" />
            <polygon points="1025,400 1068,260 1111,400" />
          </g>
          <rect x="0" y="740" width="1200" height="60" fill="var(--sil-near)" opacity="0.7" />
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(360, 570)">
            <circle cx="0" cy="0" r="21" transform="rotate(8)" />
            <ellipse cx="0" cy="40" rx="22" ry="28" />
            <ellipse cx="-10" cy="62" rx="16" ry="8" transform="rotate(-5,-10,62)" />
            <ellipse cx="-28" cy="72" rx="26" ry="12" transform="rotate(10,-28,72)" />
            <ellipse cx="28" cy="72" rx="26" ry="12" transform="rotate(-10,28,72)" />
            <path
              d="M -30 30 Q -55 50 -60 85 Q -20 90 0 75 Q 20 90 60 85 Q 55 50 30 30 Z"
              opacity="0.6"
            />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneMountain ────────────────────────────────────────────────────────────
export function SceneMountain() {
  return (
    <ParallaxScene
      zone="mountain"
      far={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-window)" opacity="0.35">
            <circle cx="80" cy="50" r="1.5" />
            <circle cx="180" cy="30" r="1" />
            <circle cx="260" cy="80" r="1.5" />
            <circle cx="350" cy="20" r="1" />
            <circle cx="600" cy="15" r="2" />
            <circle cx="680" cy="55" r="1.5" />
            <circle cx="950" cy="40" r="1" />
            <circle cx="1050" cy="20" r="1.5" />
            <circle cx="290" cy="150" r="1.5" />
            <circle cx="640" cy="105" r="1.5" />
          </g>
          <circle cx="950" cy="120" r="55" fill="var(--sil-far)" />
          <circle cx="950" cy="120" r="46" fill="var(--sil-window)" opacity="0.15" />
          <ellipse cx="250" cy="800" rx="500" ry="300" fill="var(--sil-far)" />
          <ellipse cx="950" cy="800" rx="480" ry="280" fill="var(--sil-far)" />
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-mid)" opacity="0.7">
            <ellipse cx="100" cy="650" rx="180" ry="60" />
            <ellipse cx="280" cy="620" rx="200" ry="65" />
            <ellipse cx="600" cy="640" rx="190" ry="60" />
            <ellipse cx="940" cy="630" rx="200" ry="62" />
            <ellipse cx="1100" cy="650" rx="185" ry="56" />
          </g>
          <rect x="0" y="660" width="1200" height="140" fill="var(--sil-mid)" opacity="0.5" />
          <g fill="var(--sil-mid)">
            <rect x="546" y="380" width="108" height="280" />
            <polygon points="500,380 700,380 600,325" />
            <polygon points="510,328 690,328 600,280" />
            <polygon points="520,283 680,283 600,240" />
            <polygon points="530,243 670,243 600,206" />
            <polygon points="540,209 660,209 600,178" />
            <rect x="596" y="138" width="8" height="44" />
            <rect
              x="564"
              y="400"
              width="22"
              height="28"
              rx="2"
              fill="var(--sil-window)"
              opacity="0.4"
            />
            <rect
              x="614"
              y="400"
              width="22"
              height="28"
              rx="2"
              fill="var(--sil-window)"
              opacity="0.4"
            />
          </g>
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <ellipse cx="600" cy="800" rx="700" ry="200" fill="var(--sil-near)" opacity="0.9" />
          <ellipse cx="600" cy="720" rx="400" ry="100" fill="var(--sil-near)" opacity="0.8" />
          <g fill="var(--sil-near)">
            <ellipse cx="200" cy="730" rx="60" ry="25" />
            <ellipse cx="950" cy="728" rx="55" ry="22" />
          </g>
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(260, 560)">
            <ellipse cx="0" cy="88" rx="48" ry="18" fill="var(--sil-near)" opacity="0.8" />
            <circle cx="0" cy="0" r="22" />
            <rect
              x="-8"
              y="-2"
              width="18"
              height="7"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar))"
              opacity="0.6"
            />
            <ellipse cx="2" cy="40" rx="20" ry="30" />
            <ellipse cx="-18" cy="55" rx="14" ry="7" transform="rotate(-8,-18,55)" />
            <ellipse cx="18" cy="55" rx="14" ry="7" transform="rotate(8,18,55)" />
            <ellipse cx="-24" cy="74" rx="24" ry="12" transform="rotate(5,-24,74)" />
            <ellipse cx="24" cy="74" rx="24" ry="12" transform="rotate(-5,24,74)" />
            <path d="M -24 20 Q -35 55 -32 88 Q 0 82 32 88 Q 35 55 24 20 Z" opacity="0.55" />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneRooftop ─────────────────────────────────────────────────────────────
export function SceneRooftop() {
  return (
    <ParallaxScene
      zone="rooftop"
      far={
        <svg {...SVG_PROPS}>
          <ellipse cx="600" cy="800" rx="800" ry="200" fill="var(--sil-window)" opacity="0.08" />
          <circle cx="820" cy="100" r="70" fill="var(--sil-far)" />
          <circle cx="820" cy="100" r="60" fill="var(--sil-window)" opacity="0.3" />
          <ellipse cx="780" cy="95" rx="60" ry="15" fill="var(--sil-far)" opacity="0.6" />
          <g fill="var(--sil-far)">
            <rect x="0" y="500" width="80" height="300" />
            <rect x="180" y="480" width="100" height="320" />
            <polygon points="180,480 280,480 230,430" />
            <rect x="550" y="490" width="90" height="310" />
            <rect x="810" y="510" width="80" height="290" />
            <polygon points="810,510 890,510 850,465" />
            <rect x="990" y="500" width="85" height="300" />
          </g>
          <g fill="var(--sil-window)" opacity="0.3">
            <rect x="200" y="500" width="10" height="8" />
            <rect x="560" y="510" width="10" height="8" />
            <rect x="820" y="530" width="10" height="8" />
            <rect x="1010" y="520" width="10" height="8" />
          </g>
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-mid)">
            <rect x="0" y="560" width="320" height="240" />
            <polygon points="-20,560 340,560 160,510" />
            <rect x="850" y="620" width="350" height="180" />
            <polygon points="830,620 1220,620 1025,570" />
          </g>
          <g fill="var(--sil-mid)">
            <rect x="280" y="400" width="10" height="165" transform="rotate(8,280,400)" />
            <ellipse cx="310" cy="375" rx="45" ry="30" transform="rotate(-25,310,375)" />
            <rect x="890" y="450" width="10" height="175" transform="rotate(-6,890,450)" />
            <ellipse cx="860" cy="425" rx="42" ry="28" transform="rotate(20,860,425)" />
          </g>
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <rect x="0" y="740" width="1200" height="60" fill="var(--sil-near)" opacity="0.9" />
          <polygon points="-10,740 1210,740 600,700" fill="var(--sil-near)" opacity="0.7" />
          <g fill="var(--sil-near)">
            {[100, 200, 300, 400, 500, 700, 800, 900, 1000, 1100].map((x) => (
              <ellipse key={x} cx={x} cy="740" rx="18" ry="8" />
            ))}
            <ellipse cx="600" cy="700" rx="18" ry="8" />
          </g>
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(520, 360)">
            <circle cx="0" cy="0" r="22" />
            <rect
              x="-13"
              y="-4"
              width="26"
              height="8"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar-warm))"
            />
            <ellipse cx="8" cy="38" rx="22" ry="26" transform="rotate(-20,8,38)" />
            <ellipse cx="40" cy="20" rx="9" ry="28" transform="rotate(-40,40,20)" />
            <ellipse cx="62" cy="0" rx="7" ry="22" transform="rotate(-45,62,0)" />
            <ellipse cx="-32" cy="25" rx="9" ry="24" transform="rotate(30,-32,25)" />
            <ellipse cx="38" cy="68" rx="11" ry="30" transform="rotate(-30,38,68)" />
            <ellipse cx="-20" cy="70" rx="11" ry="28" transform="rotate(40,-20,70)" />
            <path d="M -10 10 Q -80 0 -140 40 Q -120 80 -80 100 Q -40 90 -5 60 Z" opacity="0.75" />
            <path d="M -8 20 Q -100 30 -160 90 Q -130 110 -90 105 Q -50 85 -6 50 Z" opacity="0.5" />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneScholars ────────────────────────────────────────────────────────────
export function SceneScholars() {
  return (
    <ParallaxScene
      zone="scholars"
      far={
        <svg {...SVG_PROPS}>
          <rect x="0" y="280" width="1200" height="520" fill="var(--sil-far)" />
          <rect x="40" y="310" width="200" height="300" fill="var(--sil-window)" opacity="0.20" />
          <rect x="260" y="310" width="200" height="300" fill="var(--sil-window)" opacity="0.16" />
          <rect x="500" y="310" width="200" height="300" fill="var(--sil-window)" opacity="0.22" />
          <rect x="720" y="310" width="200" height="300" fill="var(--sil-window)" opacity="0.14" />
          <rect x="940" y="310" width="220" height="300" fill="var(--sil-window)" opacity="0.19" />
          <g fill="none" stroke="var(--sil-far)" strokeWidth="3" opacity="0.7">
            <rect x="40" y="310" width="200" height="300" />
            <line x1="140" y1="310" x2="140" y2="610" />
            <line x1="40" y1="460" x2="240" y2="460" />
            <rect x="260" y="310" width="200" height="300" />
            <line x1="360" y1="310" x2="360" y2="610" />
            <line x1="260" y1="460" x2="460" y2="460" />
            <rect x="500" y="310" width="200" height="300" />
            <line x1="600" y1="310" x2="600" y2="610" />
            <line x1="500" y1="460" x2="700" y2="460" />
          </g>
          <rect x="0" y="275" width="1200" height="18" fill="var(--sil-far)" />
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-mid)">
            <rect x="30" y="350" width="12" height="320" />
            <rect x="110" y="350" width="12" height="320" />
            <rect x="24" y="365" width="105" height="8" rx="2" />
            <rect x="38" y="340" width="18" height="100" rx="6" />
            <rect x="62" y="345" width="16" height="95" rx="6" />
            <rect x="84" y="338" width="18" height="105" rx="6" />
            <rect x="540" y="295" width="22" height="180" rx="3" />
            <rect x="535" y="292" width="32" height="10" rx="3" />
            <rect x="380" y="600" width="440" height="20" rx="4" />
            <rect x="390" y="618" width="16" height="80" />
            <rect x="796" y="618" width="16" height="80" />
            <ellipse cx="500" cy="598" rx="35" ry="12" />
            <rect x="580" y="565" width="12" height="36" rx="4" />
            <rect x="620" y="578" width="120" height="24" rx="2" />
          </g>
          <rect x="748" y="570" width="8" height="30" fill="var(--sil-mid)" />
          <ellipse cx="756" cy="568" rx="6" ry="10" fill="var(--sil-window)" opacity="0.7" />
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <rect x="0" y="680" width="1200" height="120" fill="var(--sil-near)" opacity="0.6" />
          <rect x="0" y="350" width="36" height="450" fill="var(--sil-near)" opacity="0.9" />
          <rect x="1164" y="350" width="36" height="450" fill="var(--sil-near)" opacity="0.9" />
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(750, 480)">
            <circle cx="0" cy="0" r="22" transform="rotate(12)" />
            <rect
              x="-13"
              y="-3"
              width="26"
              height="8"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar))"
              opacity="0.8"
            />
            <ellipse cx="2" cy="42" rx="24" ry="28" transform="rotate(10,2,42)" />
            <ellipse cx="-28" cy="28" rx="9" ry="22" transform="rotate(50,-28,28)" />
            <ellipse cx="30" cy="26" rx="9" ry="22" transform="rotate(-48,30,26)" />
            <rect
              x="-48"
              y="14"
              width="96"
              height="18"
              rx="6"
              fill="var(--sil-mid)"
              opacity="0.9"
            />
            <ellipse cx="-24" cy="70" rx="22" ry="14" transform="rotate(15,-24,70)" />
            <ellipse cx="24" cy="70" rx="22" ry="14" transform="rotate(-15,24,70)" />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneTownSquare ──────────────────────────────────────────────────────────
export function SceneTownSquare() {
  return (
    <ParallaxScene
      zone="town-square"
      far={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-far)">
            <rect x="0" y="300" width="200" height="500" />
            <polygon points="-10,300 210,300 100,240" />
            <rect x="520" y="280" width="160" height="520" />
            <polygon points="510,280 690,280 600,220" />
            <rect x="550" y="420" width="100" height="180" fill="var(--bg-primary)" opacity="0.4" />
            <rect x="990" y="315" width="140" height="485" />
            <polygon points="980,315 1140,315 1060,258" />
          </g>
          <g fill="var(--sil-window)" opacity="0.2">
            <rect x="20" y="320" width="40" height="35" />
            <rect x="70" y="320" width="40" height="35" />
            <rect x="640" y="295" width="42" height="36" />
            <rect x="1005" y="335" width="40" height="34" />
            <rect x="1095" y="358" width="38" height="32" />
          </g>
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <ellipse cx="600" cy="660" rx="70" ry="28" fill="var(--sil-mid)" />
          <ellipse cx="600" cy="655" rx="58" ry="22" fill="var(--sil-far)" opacity="0.8" />
          <ellipse cx="600" cy="650" rx="30" ry="16" fill="var(--sil-window)" opacity="0.6" />
          <path
            d="M 580 650 Q 585 620 600 610 Q 615 620 620 650 Q 610 640 600 635 Q 590 640 580 650 Z"
            fill="var(--sil-window)"
            opacity="0.5"
          />
          <g fill="var(--sil-mid)" opacity="0.75">
            <circle cx="350" cy="580" r="20" />
            <ellipse cx="350" cy="618" rx="20" ry="24" />
            <circle cx="860" cy="540" r="22" />
            <ellipse cx="860" cy="584" rx="20" ry="32" />
            <ellipse cx="836" cy="572" rx="8" ry="22" transform="rotate(12,836,572)" />
            <ellipse cx="884" cy="572" rx="8" ry="22" transform="rotate(-12,884,572)" />
          </g>
          <g fill="var(--sil-mid)">
            <circle cx="540" cy="580" r="18" />
            <ellipse cx="540" cy="614" rx="18" ry="22" transform="rotate(-10,540,614)" />
            <ellipse cx="560" cy="600" rx="7" ry="20" transform="rotate(-40,560,600)" />
            <rect x="572" y="600" width="4" height="55" rx="2" transform="rotate(-38,572,600)" />
          </g>
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <rect x="0" y="680" width="1200" height="120" fill="var(--sil-near)" opacity="0.7" />
          <g stroke="var(--sil-far)" strokeWidth="1.5" fill="none" opacity="0.18">
            <line x1="0" y1="695" x2="1200" y2="695" />
            <line x1="0" y1="720" x2="1200" y2="720" />
            {[80, 180, 280, 380, 480, 580, 680, 780, 880, 980, 1080, 1160].map((x) => (
              <line key={x} x1={x} y1="680" x2={x} y2="800" />
            ))}
          </g>
          <g fill="var(--sil-fg)" opacity="0.7">
            <circle cx="100" cy="630" r="19" />
            <ellipse cx="100" cy="664" rx="18" ry="26" />
            <circle cx="1100" cy="635" r="17" />
            <ellipse cx="1100" cy="667" rx="16" ry="23" />
          </g>
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(590, 550)">
            <circle cx="0" cy="0" r="24" />
            <ellipse cx="0" cy="44" rx="26" ry="30" />
            <ellipse cx="-28" cy="52" rx="10" ry="18" transform="rotate(25,-28,52)" />
            <ellipse cx="28" cy="52" rx="10" ry="18" transform="rotate(-25,28,52)" />
            <ellipse cx="-30" cy="78" rx="28" ry="14" transform="rotate(-5,-30,78)" />
            <ellipse cx="30" cy="78" rx="28" ry="14" transform="rotate(5,30,78)" />
            <path
              d="M -30 15 Q -50 45 -48 82 Q -10 88 0 80 Q 10 88 48 82 Q 50 45 30 15 Z"
              opacity="0.6"
            />
          </g>
        </svg>
      }
    />
  );
}

// ─── SceneVillage ─────────────────────────────────────────────────────────────
export function SceneVillage() {
  return (
    <ParallaxScene
      zone="village"
      far={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-far)">
            <rect x="0" y="320" width="160" height="480" />
            <polygon points="-10,320 170,320 80,270" />
            <rect x="310" y="300" width="180" height="500" />
            <polygon points="300,300 500,300 400,240" />
            <polygon points="310,245 490,245 400,200" />
            <rect x="660" y="310" width="170" height="490" />
            <polygon points="650,310 840,310 745,255" />
            <rect x="990" y="320" width="160" height="480" />
            <polygon points="980,320 1160,320 1070,268" />
          </g>
          <g fill="var(--sil-window)" opacity="0.25">
            <rect x="20" y="350" width="50" height="40" />
            <rect x="80" y="350" width="50" height="40" />
            <rect x="330" y="325" width="55" height="45" />
            <rect x="400" y="325" width="55" height="45" />
            <rect x="670" y="335" width="55" height="45" />
            <rect x="1005" y="345" width="52" height="42" />
          </g>
          <g fill="var(--sil-far)">
            <rect x="60" y="268" width="40" height="28" rx="2" />
            <line x1="80" y1="240" x2="80" y2="270" stroke="var(--sil-far)" strokeWidth="2" />
            <rect x="360" y="238" width="40" height="28" rx="2" />
            <line x1="380" y1="210" x2="380" y2="240" stroke="var(--sil-far)" strokeWidth="2" />
            <rect x="700" y="253" width="40" height="28" rx="2" />
            <line x1="720" y1="225" x2="720" y2="255" stroke="var(--sil-far)" strokeWidth="2" />
          </g>
        </svg>
      }
      mid={
        <svg {...SVG_PROPS}>
          <line
            x1="0"
            y1="360"
            x2="400"
            y2="340"
            stroke="var(--sil-mid)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="400"
            y1="340"
            x2="800"
            y2="355"
            stroke="var(--sil-mid)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="800"
            y1="355"
            x2="1200"
            y2="338"
            stroke="var(--sil-mid)"
            strokeWidth="2"
            opacity="0.6"
          />
          <g fill="var(--sil-mid)">
            {[50, 120, 190, 260, 330, 430, 510, 590, 670, 750, 840, 920, 1000, 1080, 1150].map(
              (x) => (
                <rect key={x} x={x} y="340" width="20" height="40" rx="2" />
              ),
            )}
          </g>
          <g fill="var(--sil-mid)">
            <rect x="148" y="480" width="8" height="250" />
            <ellipse cx="152" cy="478" rx="14" ry="20" fill="var(--sil-window)" opacity="0.55" />
            <rect x="498" y="475" width="8" height="255" />
            <ellipse cx="502" cy="473" rx="14" ry="20" fill="var(--sil-window)" opacity="0.5" />
            <rect x="898" y="480" width="8" height="250" />
            <ellipse cx="902" cy="478" rx="14" ry="20" fill="var(--sil-window)" opacity="0.52" />
          </g>
          <g fill="var(--sil-mid)" opacity="0.6">
            <circle cx="250" cy="570" r="18" />
            <rect x="235" y="585" width="30" height="80" rx="4" />
            <circle cx="680" cy="565" r="20" />
            <rect x="663" y="582" width="34" height="88" rx="4" />
            <circle cx="810" cy="568" r="19" />
            <rect x="794" y="584" width="32" height="82" rx="4" />
          </g>
        </svg>
      }
      near={
        <svg {...SVG_PROPS}>
          <rect x="0" y="680" width="1200" height="120" fill="var(--sil-near)" opacity="0.7" />
          <g stroke="var(--sil-far)" strokeWidth="1" fill="none" opacity="0.15">
            <line x1="0" y1="700" x2="1200" y2="700" />
            <line x1="0" y1="725" x2="1200" y2="725" />
            {[60, 130, 200, 280, 360, 440, 520, 600, 680, 760, 840, 920, 1000, 1080, 1150].map(
              (x) => (
                <line key={x} x1={x} y1="680" x2={x} y2="800" />
              ),
            )}
          </g>
        </svg>
      }
      fg={
        <svg {...SVG_PROPS}>
          <g fill="var(--sil-fg)" transform="translate(470, 490)">
            <circle cx="0" cy="0" r="22" />
            <ellipse cx="0" cy="-8" rx="28" ry="20" opacity="0.7" />
            <rect
              x="-10"
              y="-2"
              width="20"
              height="6"
              rx="3"
              fill="var(--zone-accent, var(--cinnabar))"
            />
            <ellipse cx="4" cy="42" rx="22" ry="30" transform="rotate(5,4,42)" />
            <ellipse cx="-18" cy="35" rx="8" ry="24" transform="rotate(15,-18,35)" />
            <ellipse cx="24" cy="38" rx="8" ry="22" transform="rotate(-12,24,38)" />
            <ellipse cx="-12" cy="84" rx="10" ry="30" transform="rotate(12,-12,84)" />
            <ellipse cx="16" cy="80" rx="10" ry="28" transform="rotate(-15,16,80)" />
            <path d="M -24 65 Q -30 100 -28 140 Q 0 145 28 140 Q 30 100 24 65 Z" opacity="0.5" />
          </g>
        </svg>
      }
    />
  );
}

// ─── Scene picker ─────────────────────────────────────────────────────────────
import type { ZoneName } from "../../lib/scenes";

export function SceneForZone({ zone }: { zone: ZoneName }) {
  switch (zone) {
    case "dojo":
      return <SceneDojo />;
    case "forest":
      return <SceneForest />;
    case "garden":
      return <SceneGarden />;
    case "mountain":
      return <SceneMountain />;
    case "rooftop":
      return <SceneRooftop />;
    case "scholars":
      return <SceneScholars />;
    case "town-square":
      return <SceneTownSquare />;
    case "village":
      return <SceneVillage />;
    default:
      return <SceneDojo />;
  }
}
