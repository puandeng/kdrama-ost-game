import { useMemo } from 'react';
import './Background.css';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Head outline: wide rounded cranium tapering through the cheeks to a soft chin.
 * Reads as a face at small scale where a plain ellipse reads as a blob.
 */
function headPath(cx, cy, rx, ry) {
  return [
    `M${cx - rx},${cy - ry * 0.2}`,
    `C${cx - rx},${cy - ry * 0.88} ${cx - rx * 0.6},${cy - ry} ${cx},${cy - ry}`,
    `C${cx + rx * 0.6},${cy - ry} ${cx + rx},${cy - ry * 0.88} ${cx + rx},${cy - ry * 0.2}`,
    `C${cx + rx},${cy + ry * 0.42} ${cx + rx * 0.5},${cy + ry} ${cx},${cy + ry}`,
    `C${cx - rx * 0.5},${cy + ry} ${cx - rx},${cy + ry * 0.42} ${cx - rx},${cy - ry * 0.2}`,
    'Z',
  ].join(' ');
}

/** Tapered limb: a quad that narrows from w1 at the base to w2 at the tip. */
function taper(x1, y1, x2, y2, w1, w2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const f = (n) => n.toFixed(2);
  return `M${f(x1 + nx * w1 / 2)},${f(y1 + ny * w1 / 2)} `
    + `L${f(x2 + nx * w2 / 2)},${f(y2 + ny * w2 / 2)} `
    + `L${f(x2 - nx * w2 / 2)},${f(y2 - ny * w2 / 2)} `
    + `L${f(x1 - nx * w1 / 2)},${f(y1 - ny * w1 / 2)} Z`;
}

/** Closed organic blob - jittered ring smoothed with quadratics through midpoints. */
function blob(cx, cy, rx, ry, rng, n = 9, jitter = 0.22) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const j = 1 - jitter + rng() * jitter * 2;
    p.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  const mid = (i) => {
    const q = p[(i + 1) % n];
    return [(p[i][0] + q[0]) / 2, (p[i][1] + q[1]) / 2];
  };
  const f = (v) => v.toFixed(2);
  const m0 = mid(n - 1);
  let d = `M${f(m0[0])},${f(m0[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(i);
    d += ` Q${f(p[i][0])},${f(p[i][1])} ${f(m[0])},${f(m[1])}`;
  }
  return d + ' Z';
}

// Ease-in-out so limb swings read as a pendulum rather than a triangle wave.
const SWING = {
  calcMode: 'spline',
  keyTimes: '0;0.5;1',
  keySplines: '0.45 0 0.55 1; 0.45 0 0.55 1',
  repeatCount: 'indefinite',
};

const ACTOR_IMAGES = [
  'gong-yoo', 'kim-soo-hyun', 'iu', 'lee-min-ho', 'song-joong-ki',
  'park-seo-joon', 'son-ye-jin', 'hyun-bin', 'song-hye-kyo', 'lee-jong-suk',
  'park-bo-gum', 'kim-ji-won', 'wi-ha-joon', 'lee-do-hyun', 'jung-hae-in',
  'cha-eun-woo', 'kim-se-jeong', 'park-min-young', 'bae-suzy',
  'lee-sung-kyung', 'nam-joo-hyuk', 'kim-go-eun', 'park-shin-hye', 'shin-min-a',
];

export default function Background() {
  // Fireflies drift low among the foliage and along the wall, not up in the sky.
  const fireflies = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      cx: rng() * 400,
      cy: 120 + rng() * 115,
      dur: 4 + rng() * 5,
      delay: rng() * 9,
      dx: (rng() - 0.5) * 14,
      dy: (rng() - 0.5) * 9,
      r: 0.32 + rng() * 0.38,
    }));
  }, []);

  const stars = useMemo(() => {
    const rng = seededRandom(99);
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      cx: rng() * 400,
      // Thin out toward the horizon so the sky reads as having depth.
      cy: Math.pow(rng(), 0.7) * 185,
      r: 0.18 + rng() * 0.42,
      opacity: 0.18 + rng() * 0.52,
      dur: 2.5 + rng() * 5,
      delay: rng() * 5,
    }));
  }, []);

  // Stones sit on a dark mortar slab, so the seams read as mortar - previously
  // the gaps let the night sky through and the wall looked like floating tiles.
  const stones = useMemo(() => {
    const rng = seededRandom(77);
    const rows = [];
    const top = 199;
    let y = top;
    for (let row = 0; row < 7; row++) {
      const h = 7.2 + rng() * 2.2;
      let x = row % 2 === 0 ? -6 - rng() * 8 : -18 + rng() * 10;
      const rowStones = [];
      while (x < 408) {
        const w = 16 + rng() * 26;
        // Cool, dim granite - bright warm stone fought the night palette and
        // pulled attention off the figures.
        const s = 54 + rng() * 30;
        rowStones.push({
          x, y, w: w - 0.7, h: h - 0.7,
          fill: `rgb(${Math.round(s)},${Math.round(s * 0.97)},${Math.round(s * 0.96)})`,
          hi: `rgb(${Math.round(s * 1.3)},${Math.round(s * 1.28)},${Math.round(s * 1.3)})`,
          rx: 0.8 + rng() * 1.6,
        });
        x += w;
      }
      rows.push(rowStones);
      y += h;
    }
    return rows;
  }, []);

  // Walkway paving: rows grow taller toward the viewer for a hint of perspective.
  const paving = useMemo(() => {
    const rng = seededRandom(31);
    const rows = [];
    let y = 258;
    let h = 7;
    while (y < 302) {
      let x = -10 - rng() * 14;
      const rowSlabs = [];
      while (x < 406) {
        const w = 18 + rng() * 22;
        rowSlabs.push({
          x, y, w: w - 1.2, h: h - 1.2,
          o: 0.16 + rng() * 0.22,
          rx: 0.8 + rng() * 1.2,
        });
        x += w;
      }
      rows.push(rowSlabs);
      y += h;
      h *= 1.32;
    }
    return rows;
  }, []);

  // Ginkgo silhouettes: tapered trunk + branches, organic canopy blobs.
  const trees = useMemo(() => {
    const specs = [
      { seed: 11, x: 60, baseY: 201, h: 74, spread: 30, canopy: 8, op: 0.9 },
      { seed: 23, x: 150, baseY: 201, h: 60, spread: 23, canopy: 6, op: 0.74 },
      { seed: 37, x: 330, baseY: 201, h: 80, spread: 32, canopy: 8, op: 0.84 },
      { seed: 53, x: 391, baseY: 201, h: 56, spread: 20, canopy: 5, op: 0.62 },
    ];
    return specs.map(sp => {
      const rng = seededRandom(sp.seed);
      const topY = sp.baseY - sp.h;
      const trunkW = sp.h * 0.055;
      const crownY = topY + sp.h * 0.22;
      const trunkTopY = topY + sp.h * 0.34;
      const lean = (rng() - 0.5) * 4;
      const trunk = taper(sp.x, sp.baseY, sp.x + lean, trunkTopY, trunkW, trunkW * 0.3);

      // Limbs leave the trunk at staggered heights, alternating sides, rather
      // than all forking from one point (which read as a lollipop).
      const branches = [];
      const limbs = 6;
      for (let i = 0; i < limbs; i++) {
        const t = i / (limbs - 1);
        const dir = i % 2 === 0 ? -1 : 1;
        const y1 = sp.baseY - sp.h * (0.42 + t * 0.30);
        const x1 = sp.x + lean * ((sp.baseY - y1) / (sp.baseY - trunkTopY));
        const reach = sp.spread * (0.85 - t * 0.35) * (0.72 + rng() * 0.5);
        const x2 = x1 + dir * reach;
        const y2 = y1 - sp.h * (0.16 + rng() * 0.16);
        const w = trunkW * (0.46 - i * 0.045);
        branches.push(taper(x1, y1, x2, y2, w, w * 0.32));
        const mx = x1 + (x2 - x1) * 0.6, my = y1 + (y2 - y1) * 0.6;
        branches.push(taper(mx, my, mx + dir * reach * 0.42 * rng(), my - sp.h * 0.14 * rng(), w * 0.42, w * 0.16));
      }

      // Canopy clustered over a disc so the mass fills in, with one large
      // anchor blob at the centre.
      const canopy = [{
        d: blob(sp.x, crownY, sp.spread * 0.62, sp.spread * 0.42, rng, 11, 0.18),
        fill: `rgb(${Math.round(19 + rng() * 8)},${Math.round(17 + rng() * 7)},${Math.round(37 + rng() * 10)})`,
      }];
      for (let i = 0; i < sp.canopy; i++) {
        const a = rng() * Math.PI * 2;
        const rr = Math.sqrt(rng());
        const cx = sp.x + Math.cos(a) * sp.spread * 0.86 * rr;
        const cy = crownY + Math.sin(a) * sp.h * 0.15 * rr;
        const rx = sp.spread * (0.26 + rng() * 0.3);
        canopy.push({
          // Must stay clearly darker than the sky behind it or the silhouette
          // disappears - the sky sits near #1a1a3c at canopy height.
          d: blob(cx, cy, rx, rx * (0.6 + rng() * 0.22), rng, 9, 0.26),
          fill: `rgb(${Math.round(19 + rng() * 10)},${Math.round(17 + rng() * 9)},${Math.round(37 + rng() * 13)})`,
        });
      }

      // A few fine twigs over the canopy so the crown isn't a solid cutout.
      const twigs = [];
      for (let i = 0; i < 4; i++) {
        const a = -Math.PI * (0.15 + rng() * 0.7);
        const r0 = sp.spread * (0.3 + rng() * 0.3);
        const x1 = sp.x + Math.cos(a) * r0;
        const y1 = crownY + Math.sin(a) * sp.h * 0.1;
        const len = sp.spread * (0.16 + rng() * 0.2);
        twigs.push(taper(x1, y1, x1 + Math.cos(a) * len, y1 + Math.sin(a) * len * 0.8, trunkW * 0.18, trunkW * 0.06));
      }
      return { ...sp, trunk, branches, canopy, twigs };
    });
  }, []);

  const actorFaces = useMemo(() => {
    const shuffled = [...ACTOR_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <svg
        className="bg__svg"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080a21" />
            <stop offset="32%" stopColor="#131634" />
            <stop offset="62%" stopColor="#222046" />
            <stop offset="86%" stopColor="#332c56" />
            <stop offset="100%" stopColor="#443a63" />
          </linearGradient>
          {/* Warm city light bleeding up from behind the wall */}
          <linearGradient id="horizonGlow" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#c98a5e" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#a5708a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8a6ba0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.34" />
            <stop offset="38%" stopColor="#d9d0ee" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#d9d0ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fireflyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fdf6b0" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e8d97a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e8d97a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b3450" />
            <stop offset="45%" stopColor="#2f2941" />
            <stop offset="100%" stopColor="#201b2e" />
          </linearGradient>
          <linearGradient id="mortar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b2732" />
            <stop offset="100%" stopColor="#1d1a24" />
          </linearGradient>
          <radialGradient id="lanternGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffdb96" stopOpacity="0.5" />
            <stop offset="28%" stopColor="#ffc266" stopOpacity="0.2" />
            <stop offset="62%" stopColor="#ff9f47" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff9f47" stopOpacity="0" />
          </radialGradient>
          {/* Light pooling on a surface - flattened, fades fast at the rim */}
          <radialGradient id="lightPool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffc97a" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#ffb85c" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffb85c" stopOpacity="0" />
          </radialGradient>
          {/* Ground haze at the wall base, so the wall doesn't sit on a hard seam */}
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b5f8f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6b5f8f" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vignette" cx="0.5" cy="0.52" r="0.72">
            <stop offset="0%" stopColor="#000010" stopOpacity="0" />
            <stop offset="62%" stopColor="#000010" stopOpacity="0" />
            <stop offset="100%" stopColor="#000010" stopOpacity="0.42" />
          </radialGradient>
          {actorFaces.map((face, i) => (
            <pattern key={`face-${i}`} id={`face${i}`} patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox" width="1" height="1">
              {/* yMin bias + slight overscan frames the head, not the torso */}
              <image href={`/actors/${face}.jpg`} x="-0.1" y="-0.06" width="1.2" height="1.2" preserveAspectRatio="xMidYMin slice" />
            </pattern>
          ))}
        </defs>

        {/* Night sky */}
        <rect width="400" height="300" fill="url(#sky)" />

        {/* Warm haze rising from behind the wall - gives the sky a horizon */}
        <rect x="0" y="120" width="400" height="82" fill="url(#horizonGlow)" />

        {/* Stars */}
        {stars.map(s => (
          <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="#e6e0f5" opacity={s.opacity}>
            <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.25};${s.opacity}`} dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Moon glow layers */}
        <circle cx="330" cy="50" r="70" fill="url(#moonGlow)" />
        <circle cx="330" cy="50" r="104" fill="url(#moonGlow)" opacity="0.28" />

        {/* Moon with craters */}
        <circle cx="330" cy="50" r="15" fill="#fef9c3" opacity="0.95" />
        <circle cx="325" cy="46" r="2.5" fill="#f5eebb" opacity="0.4" />
        <circle cx="334" cy="53" r="1.8" fill="#f5eebb" opacity="0.35" />
        <circle cx="328" cy="56" r="1.2" fill="#f5eebb" opacity="0.3" />
        <circle cx="336" cy="46" r="0.8" fill="#f5eebb" opacity="0.25" />

        {/* Ginkgo silhouettes - tapered limbs with organic canopy masses */}
        {trees.map((t, ti) => (
          <g key={`tree-${ti}`} opacity={t.op}>
            <path d={t.trunk} fill="#17122340" />
            <path d={t.trunk} fill="#161226" />
            {t.branches.map((d, bi) => (
              <path key={bi} d={d} fill="#161226" />
            ))}
            {t.canopy.map((c, ci) => (
              <path key={ci} d={c.d} fill={c.fill} />
            ))}
            {t.twigs.map((d, wi) => (
              <path key={`w${wi}`} d={d} fill="#120f20" opacity="0.8" />
            ))}
          </g>
        ))}

        {/* Garden lanterns behind the wall */}
        {[{ x: 120, o: 1 }, { x: 260, o: 0.82 }].map(l => (
          <g key={`lantern-${l.x}`} opacity={l.o}>
            <circle cx={l.x} cy={176} r={34} fill="url(#lanternGlow)" />
            <rect x={l.x - 0.9} y={178} width="1.8" height="24" fill="#241f30" rx="0.6" />
            {/* Housing: flared cap, lit panel, base */}
            <path d={`M${l.x - 6.4} 174 L${l.x - 4.4} 170.4 L${l.x + 4.4} 170.4 L${l.x + 6.4} 174 Z`} fill="#3a3430" />
            <rect x={l.x - 4} y={174} width="8" height="5.4" rx="1" fill="#2e2a2a" />
            <rect x={l.x - 2.9} y={175} width="5.8" height="3.6" rx="0.8" fill="#ffd894" opacity="0.92">
              <animate attributeName="opacity" values="0.92;0.82;0.95;0.86;0.92" dur="7s" repeatCount="indefinite" />
            </rect>
            <rect x={l.x - 5} y={179.2} width="10" height="1.6" rx="0.6" fill="#332e2c" />
          </g>
        ))}

        {/* === Korean stone wall (y 199-250) === */}
        {/* Mortar slab behind the stones so no sky shows through the seams */}
        <rect x="0" y="198" width="400" height="54" fill="url(#mortar)" />
        {stones.map((row, ri) =>
          row.map((s, si) => (
            <g key={`${ri}-${si}`}>
              <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={s.fill} />
              {/* Top-lit edge - moonlight catches the upper face of each stone */}
              <rect x={s.x + 0.5} y={s.y + 0.35} width={s.w - 1} height={0.7} rx={0.35} fill={s.hi} opacity="0.34" />
            </g>
          ))
        )}
        {/* Warm spill from each lantern washing down the wall */}
        <ellipse cx="120" cy="212" rx="52" ry="26" fill="url(#lightPool)" />
        <ellipse cx="260" cy="212" rx="48" ry="24" fill="url(#lightPool)" opacity="0.8" />
        {/* The wall falls into shadow toward its base */}
        <rect x="0" y="234" width="400" height="18" fill="#100d18" opacity="0.3" />

        {/* Tiled roof cap (giwa) */}
        <rect x="0" y="193.4" width="400" height="5.2" fill="#3b332b" />
        <rect x="0" y="193.4" width="400" height="1" fill="#574c3e" opacity="0.5" />
        {Array.from({ length: 41 }, (_, i) => {
          const x = i * 10 - 5;
          return (
            <g key={`tile-${i}`}>
              {/* Convex barrel tile */}
              <path d={`M${x} 194.6 Q${x + 5} 186.6 ${x + 10} 194.6 Z`} fill="#453b33" />
              <path d={`M${x + 1.6} 194.6 Q${x + 5} 189.4 ${x + 6.2} 190.6 Q${x + 4} 191.4 ${x + 3} 194.6 Z`} fill="#5b4f43" opacity="0.45" />
              {/* Round eave-end cap */}
              <circle cx={x + 5} cy="195.4" r="2.1" fill="#3f372f" />
              <circle cx={x + 5} cy="194.9" r="1.1" fill="#564a3f" opacity="0.55" />
            </g>
          );
        })}
        {/* Shadow the eaves cast on the stones below */}
        <rect x="0" y="198" width="400" height="3.2" fill="#0d0b14" opacity="0.4" />

        {/* === Walkway === */}
        <rect x="0" y="250" width="400" height="50" fill="url(#ground)" />
        {paving.map((row, ri) =>
          row.map((s, si) => (
            <rect
              key={`p-${ri}-${si}`}
              x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx}
              fill="#4a4266" opacity={s.o}
            />
          ))
        )}
        {/* Light pooling on the path below each lantern */}
        <ellipse cx="120" cy="266" rx="62" ry="15" fill="url(#lightPool)" opacity="0.7" />
        <ellipse cx="260" cy="266" rx="56" ry="13" fill="url(#lightPool)" opacity="0.55" />
        {/* Haze softens the joint where wall meets path */}
        <rect x="0" y="248" width="400" height="16" fill="url(#haze)" />

        {/* === Main couple - walking right, hands joined between them ===
             Proportions: head 8u, total 60u => 7.5 heads. Hip at 265 puts
             legs at ~38% of height. Gait cycle 4.8s matches the 9.8u/s
             travel speed so feet plant instead of sliding. */}
        <g opacity="0.8">
          <animateTransform attributeName="transform" type="translate" values="-100,0;440,0" dur="55s" repeatCount="indefinite" />

          {/* ---------- HIM: navy wool coat, scarf ---------- */}
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,-0.6; 0,0" dur="2.4s" {...SWING} />

            {/* Far leg (behind coat) */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="13 174.5 264; -13 174.5 264; 13 174.5 264" dur="4.8s" {...SWING} />
              <path d="M174.5 263 L174 275 L173.6 286" stroke="#141225" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <ellipse cx="172.8" cy="287.2" rx="2.5" ry="1.1" fill="#0f0d1a" />
            </g>
            {/* Near leg */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-13 181.5 264; 13 181.5 264; -13 181.5 264" dur="4.8s" {...SWING} />
              <path d="M181.5 263 L182 275 L182.4 286" stroke="#18162a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <ellipse cx="183.2" cy="287.2" rx="2.6" ry="1.2" fill="#12101e" />
            </g>

            {/* Hip-length wool coat - shoulders 14u wide, hem at 266 */}
            <path d="M171.4 241 L170.2 266 L185.8 266 L184.6 241 Z" fill="#1e2540" />
            <path d="M170.6 242 Q171.6 238.6 174.4 238 L178 239.2 L181.6 238 Q184.4 238.6 185.4 242 Z" fill="#232b4a" stroke="#161d32" strokeWidth="0.3" />
            {/* Lapels + centre seam */}
            <path d="M175 239.4 L178 245 L181 239.4 L178 238.4 Z" fill="#263050" />
            <line x1="178" y1="245" x2="178" y2="266" stroke="#161d32" strokeWidth="0.4" />
            <circle cx="178" cy="250" r="0.55" fill="#384060" />
            <circle cx="178" cy="255.5" r="0.55" fill="#384060" />
            <circle cx="178" cy="261" r="0.55" fill="#384060" />
            <line x1="173.2" y1="256" x2="175.8" y2="256" stroke="#161d32" strokeWidth="0.4" />
            <line x1="180.2" y1="256" x2="182.8" y2="256" stroke="#161d32" strokeWidth="0.4" />

            {/* Far arm swings opposite the far leg */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-11 172.4 241.5; 11 172.4 241.5; -11 172.4 241.5" dur="4.8s" {...SWING} />
              <path d="M172.4 241.5 L170.6 251 L171.2 258.5" stroke="#1b2138" strokeWidth="2.7" strokeLinecap="round" fill="none" />
              <circle cx="171.3" cy="259.4" r="1.2" fill="#2a2238" />
            </g>
            {/* Near arm stays still - hand is held */}
            <path d="M184.6 241.5 L187 250.5 L189.4 258.8" stroke="#1e2540" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Scarf - sits at the collar, single tail tucked into the coat */}
            <path d="M175.2 238.2 Q178 240.4 180.8 238.2 L181.4 241.2 Q178 243 174.6 241.2 Z" fill="#5a2030" />
            <path d="M176 241.6 Q175.2 245 175.4 248.6" stroke="#5a2030" strokeWidth="1.1" strokeLinecap="round" fill="none" />

            {/* Neck + head */}
            <rect x="176.7" y="235.4" width="2.6" height="3.4" fill="#241d30" />
            <path d={headPath(178, 232, 3.6, 4.2)} fill="url(#face0)" stroke="rgba(167,139,250,0.28)" strokeWidth="0.35" />
            {/* Swept side-part hair sitting on the cranium */}
            <path d="M174.3 231 Q174.7 227.2 178 226.9 Q181.5 227.2 181.9 231.3 Q180.3 228.7 176.9 229.3 Q175.2 229.7 174.3 231 Z" fill="#1a1528" />
            <path d="M175 229.8 Q177 227.6 179.4 227.8 Q176.6 228.8 175 230.4 Z" fill="#12101e" />
            <ellipse cx="181.7" cy="232.6" rx="0.7" ry="1.1" fill="#2a2238" />
          </g>

          {/* ---------- HER: cream coat, long waves ---------- */}
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0,-0.6; 0,0; 0,-0.6" dur="2.4s" {...SWING} />

            {/* Far leg */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-11 197 265; 11 197 265; -11 197 265" dur="4.8s" {...SWING} />
              <path d="M197 264 L196.6 277 L196.4 287.4" stroke="#241d30" strokeWidth="2.1" strokeLinecap="round" fill="none" />
              <path d="M194.6 287.4 L194.4 289.2 L198.4 289.2 L198.4 287.4 Z" fill="#171320" />
            </g>
            {/* Near leg */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="11 201.5 265; -11 201.5 265; 11 201.5 265" dur="4.8s" {...SWING} />
              <path d="M201.5 264 L201.9 277 L202.1 287.4" stroke="#2a2238" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M200.2 287.4 L200 289.2 L204 289.2 L204 287.4 Z" fill="#1a1520" />
            </g>

            {/* Belted coat - 12u shoulders, hem 266 */}
            <path d="M193.2 243 L192.2 266 L205.8 266 L204.8 243 Z" fill="#4a4438" />
            <path d="M192.6 244 Q193.5 241 196 240.4 L199 241.4 L202 240.4 Q204.5 241 205.4 244 Z" fill="#514a3d" stroke="#3d3830" strokeWidth="0.3" />
            <path d="M196.4 241.6 L199 246.4 L201.6 241.6 L199 240.8 Z" fill="#574f42" />
            <rect x="192.7" y="254" width="12.6" height="1.4" rx="0.5" fill="#3d3830" />
            <circle cx="199" cy="254.7" r="0.7" fill="#6a6050" />
            {/* Skirt peeking below the hem */}
            <path d="M193.6 266 L192.6 273 L205.4 273 L204.4 266 Z" fill="#2a2535" />

            {/* Far arm stays still - hand is held */}
            <path d="M193.4 243.5 L191.4 251 L190.6 258.8" stroke="#453f34" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            {/* Near arm swings, crossbody bag rides on it */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="11 204.6 243.5; -11 204.6 243.5; 11 204.6 243.5" dur="4.8s" {...SWING} />
              <path d="M204.6 243.5 L206.6 251.5 L206.2 259" stroke="#4a4438" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <circle cx="206.2" cy="259.8" r="1.1" fill="#2a2238" />
            </g>
            <line x1="203.4" y1="242.4" x2="194.6" y2="258" stroke="#3a2028" strokeWidth="0.55" />
            <rect x="192.9" y="257.6" width="3.4" height="4.4" rx="1" fill="#3a2028" />

            {/* Hair mass sits BEHIND the face - the face path covers the middle,
                leaving a rim at the crown and two locks hanging past the jaw. */}
            <path d="M199 230.6
                     C201.9 230.6 202.8 232.8 202.8 236.2
                     C202.8 239.8 203.1 242.8 202.6 245
                     C202.4 246.1 201.4 246.1 201.2 245
                     C200.9 242.8 201 240.2 201 238
                     L197 238
                     C197 240.2 197.1 242.8 196.8 245
                     C196.6 246.1 195.6 246.1 195.4 245
                     C194.9 242.8 195.2 239.8 195.2 236.2
                     C195.2 232.8 196.1 230.6 199 230.6 Z" fill="#1a1528" />
            {/* Neck + head */}
            <rect x="197.8" y="238.8" width="2.5" height="3" fill="#241d30" />
            <path d={headPath(199, 235.5, 3.4, 4)} fill="url(#face1)" stroke="rgba(167,139,250,0.28)" strokeWidth="0.35" />
            {/* Centre-parted fringe over the forehead */}
            <path d="M195.7 234.4 Q196.3 231 199 230.6 Q201.8 231 202.3 234.5 Q201.1 232 199 232.2 Q196.9 232 195.7 234.4 Z" fill="#1a1528" />
            <circle cx="202.6" cy="237.6" r="0.35" fill="#8888aa" />
          </g>

          {/* Joined hands between the two */}
          <ellipse cx="190.1" cy="259.6" rx="1.9" ry="1.5" fill="#2a2238" opacity="0.85" />
        </g>

        {/* === Solo figure - beret, coffee, walking left (6.9 heads) === */}
        <g opacity="0.55">
          <animateTransform attributeName="transform" type="translate" values="460,0;-100,0" dur="65s" repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,-0.5; 0,0" dur="2.2s" {...SWING} />

            {/* Legs */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="12 298 265; -12 298 265; 12 298 265" dur="4.4s" {...SWING} />
              <path d="M298 264 L297.4 275 L297 284.6" stroke="#1e1a2a" strokeWidth="2.9" strokeLinecap="round" fill="none" />
              <ellipse cx="296.2" cy="285.4" rx="2.4" ry="1" fill="#1a1520" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-12 302 265; 12 302 265; -12 302 265" dur="4.4s" {...SWING} />
              <path d="M302 264 L302.6 275 L303 284.6" stroke="#221e30" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="303.8" cy="285.4" rx="2.4" ry="1" fill="#1a1520" />
            </g>

            {/* Cardigan over turtleneck - 11u shoulders, hem 266 */}
            <path d="M294.8 247 L294 266 L306 266 L305.2 247 Z" fill="#2d3040" />
            <path d="M294.4 248 Q295.2 245.2 297.4 244.6 L300 245.6 L302.6 244.6 Q304.8 245.2 305.6 248 Z" fill="#333648" stroke="#252838" strokeWidth="0.3" />
            <rect x="297.6" y="243.8" width="4.8" height="2.6" rx="1" fill="#3a3548" />
            <line x1="300" y1="246.4" x2="300" y2="266" stroke="#252838" strokeWidth="0.4" />

            {/* Free arm swings; cup arm is held steady at the chest */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-10 305.4 247.5; 10 305.4 247.5; -10 305.4 247.5" dur="4.4s" {...SWING} />
              <path d="M305.4 247.5 L307.2 255 L306.8 261.4" stroke="#2d3040" strokeWidth="2.1" strokeLinecap="round" fill="none" />
              <circle cx="306.8" cy="262.2" r="1.1" fill="#2a2238" />
            </g>
            <path d="M294.6 247.5 L292.6 254 L294.4 258.4" stroke="#2d3040" strokeWidth="2.1" strokeLinecap="round" fill="none" />
            <rect x="293.2" y="254.6" width="2.8" height="3.8" rx="0.9" fill="#e8ddd0" />
            <circle cx="294.8" cy="258.8" r="1.1" fill="#2a2238" />

            {/* Jaw-length bob, drawn behind the face */}
            <path d="M300 237.2
                     C302.4 237.2 303.3 239 303.3 241.4
                     C303.3 243.4 303.4 244.8 303 245.8
                     C302.8 246.4 302 246.4 301.8 245.8
                     C301.6 244.8 301.7 243.2 301.7 241.8
                     L298.3 241.8
                     C298.3 243.2 298.4 244.8 298.2 245.8
                     C298 246.4 297.2 246.4 297 245.8
                     C296.6 244.8 296.7 243.4 296.7 241.4
                     C296.7 239 297.6 237.2 300 237.2 Z" fill="#1a1528" />
            {/* Neck + head */}
            <rect x="298.9" y="243.4" width="2.2" height="2.6" fill="#241d30" />
            <path d={headPath(300, 241, 3, 3.5)} fill="url(#face2)" stroke="rgba(167,139,250,0.28)" strokeWidth="0.35" />
            {/* Beret - seated on the crown, tilted, brim just past the hairline */}
            <g transform="rotate(-9 300 238)">
              <path d="M297.5 238 Q298.1 236 300.1 235.9 Q302.1 236.1 302.5 238 Z" fill="#552d40" />
              <ellipse cx="300" cy="237.9" rx="3.3" ry="1.05" fill="#4a2838" />
            </g>
          </g>
        </g>

        {/* === Background couple - distant, arms linked (7.1 heads) === */}
        <g opacity="0.4">
          <animateTransform attributeName="transform" type="translate" values="-50,0;440,0" dur="75s" repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,-0.35; 0,0" dur="1.6s" {...SWING} />

            {/* Him */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="10 73.6 267; -10 73.6 267; 10 73.6 267" dur="3.2s" {...SWING} />
              <line x1="73.6" y1="266.4" x2="73.1" y2="276.8" stroke="#18162a" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse cx="72.6" cy="277.4" rx="1.8" ry="0.7" fill="#12101e" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-10 76.4 267; 10 76.4 267; -10 76.4 267" dur="3.2s" {...SWING} />
              <line x1="76.4" y1="266.4" x2="76.9" y2="276.8" stroke="#18162a" strokeWidth="1.9" strokeLinecap="round" />
              <ellipse cx="77.4" cy="277.4" rx="1.8" ry="0.7" fill="#12101e" />
            </g>
            <path d="M72.4 254.4 L71.9 267 L78.1 267 L77.6 254.4 Z" fill="#1e2538" />
            <path d="M72.1 255 Q72.7 253.4 74 253 L75 253.6 L76 253 Q77.3 253.4 77.9 255 Z" fill="#232b45" />
            <rect x="74.3" y="252.4" width="1.4" height="1.6" fill="#241d30" />
            <path d={headPath(75, 251, 1.8, 2)} fill="url(#face3)" />
            <path d="M73.3 250.6 Q73.6 248.8 75 248.6 Q76.5 248.8 76.7 250.7 Z" fill="#1a1528" />

            {/* Her */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-9 82.8 268; 9 82.8 268; -9 82.8 268" dur="3.2s" {...SWING} />
              <line x1="82.8" y1="267.4" x2="82.5" y2="277.4" stroke="#1e1a2a" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="9 85.4 268; -9 85.4 268; 9 85.4 268" dur="3.2s" {...SWING} />
              <line x1="85.4" y1="267.4" x2="85.7" y2="277.4" stroke="#1e1a2a" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <path d="M81.6 255.4 L81.2 268 L86.8 268 L86.4 255.4 Z" fill="#3d3838" />
            <path d="M82 268 L81.2 274 L86.8 274 L86 268 Z" fill="#1e1a2a" />
            <path d="M81.4 256 Q81.9 254.4 83 254 L84 254.6 L85 254 Q86.1 254.4 86.6 256 Z" fill="#454040" />
            <rect x="83.4" y="253.4" width="1.3" height="1.6" fill="#241d30" />
            <path d={headPath(84, 252, 1.7, 1.9)} fill="url(#face4)" />
            <path d="M82.4 251.8 Q82.7 250 84 249.8 Q85.4 250 85.6 251.9 Z" fill="#1a1528" />
            <path d="M82.4 252.4 Q81.9 256 82.2 258.6" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M85.6 252.4 Q86.1 255.6 85.8 258.2" stroke="#1a1528" strokeWidth="0.9" strokeLinecap="round" fill="none" />

            {/* Linked arms - static, since they're holding on */}
            <path d="M77.6 257 L80 259.4 L81.6 258.6" stroke="#1e2538" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* Fireflies - small warm sparks with a soft halo, drifting near the foliage */}
        {fireflies.map(f => {
          const path = `M0,0 Q${f.dx},${f.dy} ${f.dx * 0.5},${f.dy * 1.5} Q${-f.dx * 0.3},${f.dy * 0.3} 0,0`;
          return (
            <g key={f.id}>
              <circle cx={f.cx} cy={f.cy} r={f.r * 6} fill="url(#fireflyGlow)" opacity="0">
                <animate attributeName="opacity" values="0;0.45;0.75;0.3;0" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
                <animateMotion dur={`${f.dur * 2.4}s`} begin={`${f.delay}s`} repeatCount="indefinite" path={path} />
              </circle>
              <circle cx={f.cx} cy={f.cy} r={f.r} fill="#fdf4a8" opacity="0">
                <animate attributeName="opacity" values="0;0.75;1;0.45;0" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
                <animateMotion dur={`${f.dur * 2.4}s`} begin={`${f.delay}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          );
        })}

        {/* Falling ginkgo leaves - fan-shaped, tumbling as they drift */}
        {Array.from({ length: 11 }, (_, i) => {
          const rng = seededRandom(400 + i * 17);
          const x = 12 + rng() * 376;
          const startY = 96 + rng() * 40;
          const dur = 13 + rng() * 9;
          const delay = rng() * 18;
          const drift = (rng() - 0.5) * 46;
          const spin = 220 + rng() * 300;
          const sc = 0.72 + rng() * 0.7;
          return (
            <g key={`leaf-${i}`}>
              <g>
                <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"
                  path={`M0,0 Q${drift},${(300 - startY) * 0.3} ${drift * 0.3},${(300 - startY) * 0.6} Q${-drift * 0.6},${(300 - startY) * 0.85} ${drift * 0.15},${300 - startY}`} />
                <animate attributeName="opacity" values="0;0.5;0.42;0.12;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <g transform={`translate(${x} ${startY})`}>
                  <g>
                    <animateTransform attributeName="transform" type="rotate"
                      values={`0;${spin}`} dur={`${dur * 0.5}s`} begin={`${delay}s`} repeatCount="indefinite" />
                    {/* Ginkgo fan: notched semicircle on a short stalk */}
                    <path
                      transform={`scale(${sc.toFixed(2)})`}
                      d="M0,0 L-0.3,1.5 Q-2.6,2.4 -2.4,4.1 Q-1.2,3.3 -0.2,3.5 Q0.9,3.3 2.1,4.2 Q2.5,2.5 0.3,1.5 Z"
                      fill="#c9ab52"
                    />
                  </g>
                </g>
              </g>
            </g>
          );
        })}

        {/* Vignette - pulls focus to the centre of the scene */}
        <rect x="0" y="0" width="400" height="300" fill="url(#vignette)" />
      </svg>
    </div>
  );
}
