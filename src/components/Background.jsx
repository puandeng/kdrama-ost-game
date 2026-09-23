import { useMemo } from 'react';
import './Background.css';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

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
              <image href={`/actors/${face}.jpg`} x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
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

        {/* === Main couple - large, detailed K-drama style, walking right === */}
        <g opacity="0.8">
          <animateTransform attributeName="transform" type="translate" values="-100,0;440,0" dur="55s" repeatCount="indefinite" />

          {/* HIM - tall, long navy wool coat, styled hair, scarf */}
          {/* Head */}
          <ellipse cx="178" cy="232" rx="5" ry="5.5" fill="url(#face0)" stroke="rgba(167,139,250,0.3)" strokeWidth="0.4" />
          {/* Styled hair - textured top, swept side part */}
          <path d="M173 231 Q174 225 178 224 Q182 225 183 231" fill="#1a1528" />
          <path d="M174 230 Q176 226 179 226 Q175 228 174 231" fill="#12101e" />
          {/* Ear hint */}
          <ellipse cx="183" cy="233" rx="1" ry="1.5" fill="#2a2238" />
          {/* Neck */}
          <rect x="176" y="237" width="4" height="3" fill="#2a2238" />
          {/* Scarf - burgundy, draped */}
          <path d="M174 239 Q178 242 182 239 L183 244 Q178 246 173 244 Z" fill="#5a2030" />
          <path d="M175 243 L174 252" stroke="#5a2030" strokeWidth="2" strokeLinecap="round" />
          {/* Long coat body - navy/dark blue, structured shoulders */}
          <path d="M171 240 L170 274 L173 274 L174 255 L182 255 L183 274 L186 274 L185 240 Z" fill="#1e2540" />
          {/* Shoulder structure */}
          <path d="M170 240 L171 238 L178 239 L185 238 L186 240" fill="#1e2540" stroke="#161d32" strokeWidth="0.3" />
          {/* Coat lapels */}
          <path d="M174 240 L178 246 L182 240" fill="#222a45" />
          <line x1="178" y1="246" x2="178" y2="274" stroke="#161d32" strokeWidth="0.4" />
          {/* Coat buttons */}
          <circle cx="178" cy="252" r="0.6" fill="#384060" />
          <circle cx="178" cy="258" r="0.6" fill="#384060" />
          <circle cx="178" cy="264" r="0.6" fill="#384060" />
          {/* Coat pockets */}
          <line x1="173" y1="258" x2="176" y2="258" stroke="#161d32" strokeWidth="0.4" />
          <line x1="180" y1="258" x2="183" y2="258" stroke="#161d32" strokeWidth="0.4" />
          {/* Left arm (away) - slightly bent, hand in pocket */}
          <path d="M171 241 L168 252 L169 258" stroke="#1e2540" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Right arm - reaching toward her */}
          <path d="M185 241 L188 252 L190 256" stroke="#1e2540" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Hand */}
          <circle cx="190" cy="257" r="1.5" fill="#2a2238" />
          {/* Legs - dark trousers */}
          <line x1="173" y1="274" x2="172" y2="286" stroke="#18162a" strokeWidth="3" strokeLinecap="round" />
          <line x1="183" y1="274" x2="184" y2="286" stroke="#18162a" strokeWidth="3" strokeLinecap="round" />
          {/* Shoes - polished */}
          <ellipse cx="171.5" cy="287" rx="2.5" ry="1.2" fill="#12101e" />
          <ellipse cx="184.5" cy="287" rx="2.5" ry="1.2" fill="#12101e" />

          {/* HER - slightly shorter, long wavy hair, cream coat, holding his hand */}
          {/* Head */}
          <ellipse cx="198" cy="235" rx="4.8" ry="5.2" fill="url(#face1)" stroke="rgba(167,139,250,0.3)" strokeWidth="0.4" />
          {/* Long wavy hair - flowing down past shoulders */}
          <path d="M193 234 Q192 240 191 250 Q190.5 255 191 258" stroke="#1a1528" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M203 234 Q204 240 204.5 250 Q205 255 204.5 257" stroke="#1a1528" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M194 233 Q193 238 192.5 245" stroke="#12101e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Hair top - parted, voluminous */}
          <path d="M193 233 Q195 228 198 227 Q201 228 203 233" fill="#1a1528" />
          <path d="M194 232 Q196 229 199 229" stroke="#12101e" strokeWidth="0.5" fill="none" />
          {/* Ear with small earring */}
          <ellipse cx="203.5" cy="236" rx="0.8" ry="1.2" fill="#2a2238" />
          <circle cx="203.5" cy="237.5" r="0.4" fill="#8888aa" />
          {/* Neck */}
          <rect x="196" y="240" width="4" height="2.5" fill="#2a2238" />
          {/* Cream/beige long coat */}
          <path d="M191 242 L190 272 L193 272 L194 256 L202 256 L203 272 L206 272 L205 242 Z" fill="#4a4438" />
          {/* Shoulders */}
          <path d="M190 242 L192 240 L198 241 L204 240 L206 242" fill="#4a4438" stroke="#3d3830" strokeWidth="0.3" />
          {/* Coat collar - turned up */}
          <path d="M194 242 L198 246 L202 242" fill="#524c42" />
          {/* Belt/waist cinch */}
          <rect x="191" y="255" width="14" height="1.5" rx="0.5" fill="#3d3830" />
          <circle cx="198" cy="256" r="0.8" fill="#6a6050" />
          {/* Left arm - holding purse */}
          <path d="M191 243 L188 254 L189 260" stroke="#4a4438" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Small crossbody bag */}
          <line x1="203" y1="242" x2="189" y2="258" stroke="#3a2028" strokeWidth="0.6" />
          <rect x="187" y="258" width="4" height="5" rx="1" fill="#3a2028" />
          {/* Right arm - reaching to hold his hand */}
          <path d="M205 243 L207 253 L192" stroke="#4a4438" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Hand */}
          <circle cx="192" cy="257" r="1.3" fill="#2a2238" />
          {/* Held hands together */}
          <ellipse cx="191" cy="257" rx="2.5" ry="1.8" fill="#2a2238" opacity="0.7" />
          {/* Skirt below coat */}
          <path d="M192 272 L190 282 L206 282 L204 272 Z" fill="#2a2535" />
          {/* Legs */}
          <line x1="194" y1="282" x2="193.5" y2="288" stroke="#2a2238" strokeWidth="2" strokeLinecap="round" />
          <line x1="202" y1="282" x2="202.5" y2="288" stroke="#2a2238" strokeWidth="2" strokeLinecap="round" />
          {/* Ankle boots with slight heel */}
          <path d="M191.5 288 L191 289.5 L195 289.5 L195 288" fill="#1a1520" />
          <path d="M200.5 288 L200 289.5 L204 289.5 L204 288" fill="#1a1520" />
        </g>

        {/* === Solo figure - woman in beret, walking other way === */}
        <g opacity="0.55">
          <animateTransform attributeName="transform" type="translate" values="460,0;-100,0" dur="65s" repeatCount="indefinite" />
          {/* Head */}
          <ellipse cx="300" cy="240" rx="4" ry="4.5" fill="url(#face2)" stroke="rgba(167,139,250,0.3)" strokeWidth="0.4" />
          {/* Beret */}
          <ellipse cx="300" cy="237" rx="5.5" ry="2.5" fill="#4a2838" />
          <ellipse cx="300" cy="238" rx="4" ry="1.5" fill="#552d40" />
          {/* Hair - bob cut peeking out */}
          <path d="M296 240 Q295 245 295.5 248" stroke="#1a1528" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M304 240 Q305 244 304.5 247" stroke="#1a1528" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Neck */}
          <rect x="298" y="244" width="4" height="2" fill="#2a2238" />
          {/* Turtleneck + cardigan */}
          <rect x="297" y="244" width="6" height="3" rx="1" fill="#3a3548" />
          <path d="M294 246 L293 268 L296 268 L297 255 L303 255 L304 268 L307 268 L306 246 Z" fill="#2d3040" />
          {/* Cardigan open front */}
          <line x1="300" y1="248" x2="300" y2="268" stroke="#252838" strokeWidth="0.4" />
          {/* Arms */}
          <path d="M294 247 L291 258 L292 262" stroke="#2d3040" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M306 247 L309 256 L308 262" stroke="#2d3040" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Hands - holding coffee cup */}
          <circle cx="292" cy="263" r="1.2" fill="#2a2238" />
          <rect x="290.5" y="259" width="3" height="4" rx="1" fill="#e8ddd0" />
          {/* Wide-leg pants */}
          <path d="M294 268 L293 284 L298 284 L299 272 L301 272 L302 284 L307 284 L306 268 Z" fill="#1e1a2a" />
          {/* Shoes - loafers */}
          <ellipse cx="295.5" cy="285" rx="2.5" ry="1" fill="#1a1520" />
          <ellipse cx="304.5" cy="285" rx="2.5" ry="1" fill="#1a1520" />
        </g>

        {/* === Background couple - smaller, further away === */}
        <g opacity="0.4">
          <animateTransform attributeName="transform" type="translate" values="-50,0;440,0" dur="75s" repeatCount="indefinite" />
          {/* Him - shorter figure due to distance */}
          <ellipse cx="75" cy="252" rx="3" ry="3.3" fill="url(#face3)" />
          <path d="M72 255 L71.5 268 L74 268 L74.5 261 L75.5 261 L76 268 L78.5 268 L78 255 Z" fill="#1e2538" />
          <line x1="73" y1="268" x2="72.5" y2="276" stroke="#18162a" strokeWidth="2" strokeLinecap="round" />
          <line x1="77" y1="268" x2="77.5" y2="276" stroke="#18162a" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="72" cy="276.5" rx="2" ry="0.8" fill="#12101e" />
          <ellipse cx="78" cy="276.5" rx="2" ry="0.8" fill="#12101e" />
          {/* Her */}
          <ellipse cx="84" cy="253.5" rx="2.8" ry="3" fill="url(#face4)" />
          <path d="M81 253 Q80 258 80.5 262" stroke="#1a1528" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M87 253 Q88 257 87.5 261" stroke="#1a1528" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M81 256 L80.5 268 L83 268 L83.5 262 L84.5 262 L85 268 L87.5 268 L87 256 Z" fill="#3d3838" />
          <path d="M82 268 L80.5 278 L87.5 278 L86 268 Z" fill="#1e1a2a" />
          <line x1="83" y1="278" x2="82.5" y2="282" stroke="#1e1a2a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="86" y1="278" x2="86.5" y2="282" stroke="#1e1a2a" strokeWidth="1.5" strokeLinecap="round" />
          {/* Arms linked */}
          <line x1="78" y1="261" x2="81" y2="261" stroke="#1e1a2a" strokeWidth="1.2" strokeLinecap="round" />
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
