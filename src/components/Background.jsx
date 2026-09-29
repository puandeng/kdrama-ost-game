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
  const fireflies = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      cx: rng() * 400,
      cy: 40 + rng() * 160,
      dur: 3 + rng() * 5,
      delay: rng() * 6,
      dx: (rng() - 0.5) * 12,
      dy: (rng() - 0.5) * 8,
      size: 1.2 + rng() * 1.8,
    }));
  }, []);

  const stars = useMemo(() => {
    const rng = seededRandom(99);
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      cx: rng() * 400,
      cy: rng() * 100,
      r: 0.2 + rng() * 0.4,
      opacity: 0.2 + rng() * 0.5,
      dur: 2 + rng() * 4,
    }));
  }, []);

  const stones = useMemo(() => {
    const rng = seededRandom(77);
    const rows = [];
    for (let row = 0; row < 6; row++) {
      const y = 202 + row * 9;
      let x = row % 2 === 0 ? 0 : -15 + rng() * 10;
      const rowStones = [];
      while (x < 410) {
        const w = 18 + rng() * 25;
        const h = 7 + rng() * 2;
        const shade = 85 + rng() * 30;
        rowStones.push({ x, y, w, h, shade, rx: 1 + rng() * 2 });
        x += w + 1;
      }
      rows.push(rowStones);
    }
    return rows;
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
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#d4cce8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d4cce8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fireflyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0d2b" />
            <stop offset="40%" stopColor="#1a1a3e" />
            <stop offset="75%" stopColor="#2a2550" />
            <stop offset="100%" stopColor="#342d5a" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3348" />
            <stop offset="100%" stopColor="#2a2438" />
          </linearGradient>
          <radialGradient id="lanternGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#ffb84d" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lanternGlow2" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffb84d" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
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

        {/* Stars */}
        {stars.map(s => (
          <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="#e0daf0" opacity={s.opacity}>
            <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.2};${s.opacity}`} dur={`${s.dur}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Moon glow layers */}
        <circle cx="330" cy="50" r="70" fill="url(#moonGlow)" />
        <circle cx="330" cy="50" r="100" fill="url(#moonGlow)" opacity="0.3" />

        {/* Moon with craters */}
        <circle cx="330" cy="50" r="15" fill="#fef9c3" opacity="0.95" />
        <circle cx="325" cy="46" r="2.5" fill="#f5eebb" opacity="0.4" />
        <circle cx="334" cy="53" r="1.8" fill="#f5eebb" opacity="0.35" />
        <circle cx="328" cy="56" r="1.2" fill="#f5eebb" opacity="0.3" />
        <circle cx="336" cy="46" r="0.8" fill="#f5eebb" opacity="0.25" />

        {/* Ginkgo trees - detailed branching silhouettes */}
        {/* Tree 1 - large left */}
        <g opacity="0.85">
          <rect x="58" y="130" width="4" height="70" fill="#1a1528" rx="1" />
          <line x1="60" y1="155" x2="45" y2="135" stroke="#1a1528" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="145" x2="72" y2="128" stroke="#1a1528" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="165" x2="40" y2="150" stroke="#1a1528" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="45" y1="135" x2="35" y2="120" stroke="#1a1528" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="45" y1="135" x2="50" y2="118" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          <line x1="72" y1="128" x2="80" y2="112" stroke="#1a1528" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="72" y1="128" x2="65" y2="115" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          {/* Fan-shaped ginkgo leaf clusters */}
          <ellipse cx="38" cy="115" rx="12" ry="10" fill="#2a2540" />
          <ellipse cx="55" cy="110" rx="14" ry="12" fill="#252040" />
          <ellipse cx="72" cy="108" rx="13" ry="11" fill="#282345" />
          <ellipse cx="48" cy="125" rx="10" ry="8" fill="#2a2545" />
          <ellipse cx="80" cy="115" rx="8" ry="7" fill="#252040" />
          <ellipse cx="60" cy="100" rx="10" ry="8" fill="#232040" />
        </g>

        {/* Tree 2 - medium center-left */}
        <g opacity="0.7">
          <rect x="148" y="140" width="3.5" height="60" fill="#1a1528" rx="1" />
          <line x1="150" y1="160" x2="138" y2="142" stroke="#1a1528" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="150" y1="152" x2="162" y2="138" stroke="#1a1528" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="138" y1="142" x2="130" y2="128" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          <line x1="162" y1="138" x2="170" y2="125" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="132" cy="124" rx="10" ry="9" fill="#252040" />
          <ellipse cx="150" cy="118" rx="12" ry="10" fill="#222040" />
          <ellipse cx="168" cy="122" rx="10" ry="8" fill="#252040" />
          <ellipse cx="142" cy="135" rx="8" ry="6" fill="#2a2545" />
        </g>

        {/* Tree 3 - large right */}
        <g opacity="0.8">
          <rect x="328" y="125" width="4.5" height="75" fill="#1a1528" rx="1" />
          <line x1="330" y1="155" x2="315" y2="132" stroke="#1a1528" strokeWidth="2" strokeLinecap="round" />
          <line x1="330" y1="145" x2="348" y2="128" stroke="#1a1528" strokeWidth="2" strokeLinecap="round" />
          <line x1="330" y1="168" x2="342" y2="150" stroke="#1a1528" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="315" y1="132" x2="305" y2="118" stroke="#1a1528" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="315" y1="132" x2="322" y2="115" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          <line x1="348" y1="128" x2="358" y2="112" stroke="#1a1528" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="348" y1="128" x2="340" y2="115" stroke="#1a1528" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="308" cy="112" rx="11" ry="10" fill="#252040" />
          <ellipse cx="325" cy="108" rx="13" ry="11" fill="#222040" />
          <ellipse cx="342" cy="110" rx="12" ry="10" fill="#252545" />
          <ellipse cx="356" cy="115" rx="9" ry="8" fill="#252040" />
          <ellipse cx="335" cy="120" rx="8" ry="6" fill="#2a2540" />
        </g>

        {/* Tree 4 - small far right */}
        <g opacity="0.6">
          <rect x="388" y="145" width="3" height="55" fill="#1a1528" rx="1" />
          <line x1="390" y1="162" x2="380" y2="148" stroke="#1a1528" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="390" y1="155" x2="398" y2="142" stroke="#1a1528" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="382" cy="142" rx="9" ry="8" fill="#252040" />
          <ellipse cx="396" cy="138" rx="8" ry="7" fill="#222040" />
          <ellipse cx="390" cy="132" rx="7" ry="6" fill="#252040" />
        </g>

        {/* Lantern posts with warm glow */}
        {/* Lantern 1 */}
        <circle cx="120" cy="175" r="25" fill="url(#lanternGlow)" />
        <rect x="119" y="170" width="2" height="30" fill="#2a2538" rx="0.5" />
        <rect x="115" y="168" width="10" height="6" rx="2" fill="#3a3530" />
        <rect x="117" y="170" width="6" height="3" rx="1" fill="#ffd27a" opacity="0.9" />

        {/* Lantern 2 */}
        <circle cx="260" cy="175" r="25" fill="url(#lanternGlow2)" />
        <rect x="259" y="170" width="2" height="30" fill="#2a2538" rx="0.5" />
        <rect x="255" y="168" width="10" height="6" rx="2" fill="#3a3530" />
        <rect x="257" y="170" width="6" height="3" rx="1" fill="#ffd27a" opacity="0.8" />

        {/* Korean traditional stone wall - rough cut stones */}
        {stones.map((row, ri) =>
          row.map((s, si) => (
            <rect
              key={`${ri}-${si}`}
              x={s.x} y={s.y}
              width={s.w} height={s.h}
              rx={s.rx}
              fill={`rgb(${s.shade}, ${s.shade - 10}, ${s.shade - 20})`}
              stroke={`rgb(${s.shade - 25}, ${s.shade - 35}, ${s.shade - 40})`}
              strokeWidth="0.4"
            />
          ))
        )}

        {/* Moonlight wash on wall */}
        <rect x="260" y="200" width="90" height="55" fill="#fef9c3" opacity="0.03" rx="2" />

        {/* Traditional Korean tile roof cap (giwa) on wall */}
        {/* Base beam */}
        <rect x="0" y="195" width="400" height="7" fill="#3a3228" rx="1" />
        {/* Curved roof tiles */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = i * 16 - 4;
          return (
            <g key={`tile-${i}`}>
              <path
                d={`M${x} 196 Q${x + 4} 189 ${x + 8} 191 Q${x + 12} 189 ${x + 16} 196`}
                fill="#3d3530"
                stroke="#2d2520"
                strokeWidth="0.4"
              />
              {/* Round end cap */}
              <circle cx={x + 8} cy="196" r="2.5" fill="#3a3228" stroke="#2d2520" strokeWidth="0.3" />
            </g>
          );
        })}

        {/* Ground path - stone-paved walkway */}
        <rect x="0" y="255" width="400" height="45" fill="url(#ground)" />
        {/* Paving stones */}
        <rect x="5" y="258" width="22" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="30" y="258" width="18" height="12" rx="1" fill="#3b3350" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="52" y="258" width="25" height="12" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="80" y="258" width="20" height="12" rx="1" fill="#3c3450" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="15" y="272" width="24" height="11" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="42" y="272" width="20" height="11" rx="1" fill="#3b3350" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="65" y="272" width="26" height="11" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="120" y="258" width="23" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="146" y="258" width="19" height="12" rx="1" fill="#3c3450" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="168" y="258" width="24" height="12" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="130" y="272" width="22" height="11" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="155" y="272" width="25" height="11" rx="1" fill="#3b3350" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="200" y="258" width="21" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="224" y="258" width="26" height="12" rx="1" fill="#3c3450" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="253" y="258" width="18" height="12" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="275" y="258" width="23" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="210" y="272" width="24" height="11" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="238" y="272" width="20" height="11" rx="1" fill="#3c3450" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="262" y="272" width="26" height="11" rx="1" fill="#3b3350" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="305" y="258" width="22" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="330" y="258" width="25" height="12" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="358" y="258" width="20" height="12" rx="1" fill="#3c3450" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="382" y="258" width="18" height="12" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.4" />
        <rect x="298" y="272" width="24" height="11" rx="1" fill="#3d3550" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="326" y="272" width="22" height="11" rx="1" fill="#3b3350" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />
        <rect x="352" y="272" width="26" height="11" rx="1" fill="#3e3555" stroke="#342e45" strokeWidth="0.3" opacity="0.35" />

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

        {/* Fireflies */}
        {fireflies.map(f => (
          <g key={f.id}>
            <circle cx={f.cx} cy={f.cy} r={f.size * 3.5} fill="url(#fireflyGlow)">
              <animate attributeName="opacity" values="0;0.6;0.9;0.4;0" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
              <animateMotion dur={`${f.dur * 2}s`} begin={`${f.delay}s`} repeatCount="indefinite"
                path={`M0,0 Q${f.dx},${f.dy} ${f.dx * 0.5},${f.dy * 1.5} Q${-f.dx * 0.3},${f.dy * 0.3} 0,0`} />
            </circle>
            <circle cx={f.cx} cy={f.cy} r={f.size * 0.5} fill="#fef9c3">
              <animate attributeName="opacity" values="0;0.8;1;0.5;0" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
              <animateMotion dur={`${f.dur * 2}s`} begin={`${f.delay}s`} repeatCount="indefinite"
                path={`M0,0 Q${f.dx},${f.dy} ${f.dx * 0.5},${f.dy * 1.5} Q${-f.dx * 0.3},${f.dy * 0.3} 0,0`} />
            </circle>
          </g>
        ))}

        {/* Falling ginkgo leaves - slow drift */}
        {[0, 1, 2, 3, 4].map(i => {
          const x = 50 + i * 80;
          const delay = i * 3;
          return (
            <g key={`leaf-${i}`} opacity="0.25">
              <ellipse cx={x} cy="120" rx="2" ry="1.5" fill="#c4a64a">
                <animateMotion
                  dur="12s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path={`M0,0 Q15,40 -5,80 Q10,120 0,160`}
                />
                <animate attributeName="opacity" values="0.3;0.25;0.15;0" dur="12s" begin={`${delay}s`} repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="rotate" values="0;45;-30;60;0" dur="12s" begin={`${delay}s`} repeatCount="indefinite" additive="sum" />
              </ellipse>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
