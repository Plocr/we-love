import { useMemo } from 'react';
import { rand } from '../utils';
import { WASH } from '../theme';

// ─── 树 ──────────────────────────────────────
function Tree({ cx, cy, h, season, ink, wash }) {
  const tx = cx, ty = cy;
  const isWinter = season === 'winter';
  const leafR = h * 0.38;

  return (
    <g filter="url(#rough)" style={{ transformOrigin: `${tx}px ${ty}px`, animation: 'treeSway 6s ease-in-out infinite' }}>
      {/* 树干 */}
      <path d={`M${tx} ${ty} Q${tx + rand(-3, 3)} ${ty - h * 0.35} ${tx + rand(-2, 2)} ${ty - h * 0.55}`}
        fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      {!isWinter && (
        <>
          {/* 树冠 — 不规则椭圆形 */}
          <ellipse cx={tx + rand(-2, 2)} cy={ty - h * 0.5 + rand(-3, 0)}
            rx={leafR} ry={leafR * 0.85}
            fill="none" stroke={ink} strokeWidth="1.5" opacity="0.8" />
          <ellipse cx={tx - leafR * 0.3 + rand(-2, 2)} cy={ty - h * 0.45 + rand(-3, 0)}
            rx={leafR * 0.55} ry={leafR * 0.5}
            fill="none" stroke={ink} strokeWidth="1.2" opacity="0.6" />
          <ellipse cx={tx + leafR * 0.35 + rand(-2, 2)} cy={ty - h * 0.48 + rand(-3, 0)}
            rx={leafR * 0.5} ry={leafR * 0.45}
            fill="none" stroke={ink} strokeWidth="1.2" opacity="0.6" />
          {/* 淡彩晕染 */}
          <ellipse cx={tx} cy={ty - h * 0.5} rx={leafR * 0.7} ry={leafR * 0.55}
            fill={wash} opacity="0.25" />
        </>
      )}
      {isWinter && (
        /* 枯枝 */
        <path d={`M${tx - 5} ${ty - h * 0.4} Q${tx - 18} ${ty - h * 0.5} ${tx - 15} ${ty - h * 0.6}`}
          fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
      )}
    </g>
  );
}

// ─── 云朵 ────────────────────────────────────
function Cloud({ cx, cy, sc, ink, delay }) {
  return (
    <g filter="url(#roughSm)" opacity="0.6"
      style={{ animation: `cloudDrift 25s ${delay}s ease-in-out infinite` }}>
      <ellipse cx={cx} cy={cy} rx={55 * sc} ry={20 * sc}
        fill="none" stroke={ink} strokeWidth="1.5" />
      <ellipse cx={cx - 30 * sc} cy={cy + 4 * sc} rx={35 * sc} ry={16 * sc}
        fill="none" stroke={ink} strokeWidth="1.2" />
      <ellipse cx={cx + 28 * sc} cy={cy + 2 * sc} rx={30 * sc} ry={13 * sc}
        fill="none" stroke={ink} strokeWidth="1.2" />
      <path d={`M${cx - 40 * sc} ${cy + 4 * sc} Q${cx - 10 * sc} ${cy - 22 * sc} ${cx + 35 * sc} ${cy + 2 * sc}`}
        fill="none" stroke={ink} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

// ─── 太阳/月亮 ───────────────────────────────
function SunMoon({ x, y, time, ink }) {
  if (time === 'night') {
    return (
      <g filter="url(#rough)">
        <circle cx={x} cy={y} r="26" fill="none" stroke={ink} strokeWidth="1.5" />
        <path d={`M${x - 4} ${y - 4} Q${x + 7} ${y - 2} ${x + 4} ${y + 7}`}
          fill="none" stroke={ink} strokeWidth="1.2" />
      </g>
    );
  }
  const isEdge = time === 'dawn' || time === 'sunset';
  return (
    <g filter="url(#roughSm)">
      <circle cx={x} cy={y} r="28" fill="none" stroke={ink} strokeWidth="2" />
      {/* 不规则放射线 */}
      <line x1={x + 34} y1={y - 5} x2={x + 44} y2={y - 10}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1={x + 33} y1={y + 8} x2={x + 42} y2={y + 14}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1={x - 34} y1={y - 3} x2={x - 44} y2={y - 8}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1={x - 32} y1={y + 10} x2={x - 42} y2={y + 16}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {!isEdge && (
        <>
          <line x1={x - 6} y1={y - 36} x2={x - 8} y2={y - 48}
            stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1={x + 10} y1={y - 35} x2={x + 14} y2={y - 47}
            stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </>
      )}
    </g>
  );
}

// ─── 星星 ────────────────────────────────────
function Stars({ ink, enableShooting }) {
  const stars = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      x: rand(0, 1200), y: rand(0, 250), r: rand(1, 2.5),
      delay: rand(0, 5), dur: rand(2, 5),
    })), []);
  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r}
          fill="none" stroke={ink} strokeWidth="1"
          style={{ animation: `twinkle ${s.dur}s ${s.delay}s infinite` }} />
      ))}
      {enableShooting && [0, 1, 2].map(i => (
        <g key={'s' + i} style={{ animation: `shooting-star 4.5s ${i * 12 + rand(0, 6)}s infinite` }}>
          <line x1={950 + i * 80} y1={60} x2={900 + i * 80} y2={110}
            stroke={ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

// ─── 河流 ────────────────────────────────────
function River({ ink }) {
  return (
    <g filter="url(#roughSm)">
      {/* 河岸 */}
      <path d="M0 310 Q300 320 600 310 Q900 300 1200 310 L1200 370 Q900 380 600 370 Q300 360 0 370 Z"
        fill="rgba(214,234,248,0.2)" stroke={ink} strokeWidth="1.5" opacity="0.6" />
      {/* 波纹动画 */}
      <path d="M100 330 Q200 328 300 332 Q400 336 500 330 Q600 324 700 330 Q800 336 900 330 Q1000 324 1100 330"
        fill="none" stroke={ink} strokeWidth="1" opacity="0.4">
        <animate attributeName="d"
          values="M100 330 Q200 328 300 332 Q400 336 500 330 Q600 324 700 330 Q800 336 900 330 Q1000 324 1100 330;
                  M100 332 Q200 336 300 330 Q400 324 500 332 Q600 336 700 330 Q800 324 900 332 Q1000 336 1100 332;
                  M100 330 Q200 328 300 332 Q400 336 500 330 Q600 324 700 330 Q800 336 900 330 Q1000 324 1100 330"
          dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M120 350 Q220 346 320 350 Q420 354 520 348 Q620 342 720 348 Q820 354 920 348 Q1020 342 1120 348"
        fill="none" stroke={ink} strokeWidth="0.8" opacity="0.3">
        <animate attributeName="d"
          values="M120 350 Q220 346 320 350 Q420 354 520 348 Q620 342 720 348 Q820 354 920 348 Q1020 342 1120 348;
                  M120 348 Q220 354 320 348 Q420 342 520 350 Q620 354 720 348 Q820 342 920 350 Q1020 354 1120 350;
                  M120 350 Q220 346 320 350 Q420 354 520 348 Q620 342 720 348 Q820 354 920 348 Q1020 342 1120 348"
          dur="5s" repeatCount="indefinite" />
      </path>
      {/* 桥下涟漪 */}
      <ellipse cx="540" cy="375" rx="20" ry="4" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="660" cy="375" rx="20" ry="4" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.3" />
    </g>
  );
}

// ─── 桥 ──────────────────────────────────────
function Bridge({ ink }) {
  return (
    <g filter="url(#rough)">
      {/* 拱形主梁 */}
      <path d="M420 370 Q540 290 660 370" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {/* 桥面 */}
      <path d="M430 370 Q540 298 650 370" fill="none" stroke={ink} strokeWidth="1.5" opacity="0.5" />
      {/* 栏杆 */}
      {[445, 475, 505, 535, 565, 595, 625].map((x, i) => {
        const yOff = Math.sin((x - 420) / 240 * Math.PI) * 38;
        return (
          <line key={i} x1={x} y1={370} y2={360 - yOff}
            stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        );
      })}
      {/* 栏杆横梁 */}
      <path d="M430 370 Q540 300 650 370" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.4" />
    </g>
  );
}

// ─── 远景城市轮廓 ────────────────────────────
function CitySilhouette({ ink }) {
  return (
    <g filter="url(#roughSm)" opacity="0.12">
      <rect x="30" y="275" width="18" height="35" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="50" y="260" width="14" height="50" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="66" y="280" width="22" height="30" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="90" y="265" width="16" height="45" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="108" y="278" width="12" height="32" fill="none" stroke={ink} strokeWidth="1.5" />

      <rect x="900" y="270" width="20" height="40" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="925" y="255" width="15" height="55" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="945" y="275" width="25" height="35" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="975" y="262" width="18" height="48" fill="none" stroke={ink} strokeWidth="1.5" />
      <rect x="998" y="280" width="14" height="30" fill="none" stroke={ink} strokeWidth="1.5" />
    </g>
  );
}

// ─── 亭子 ────────────────────────────────────
function Pavilion({ ink }) {
  return (
    <g filter="url(#roughSm)" opacity="0.35">
      {/* 亭顶 */}
      <path d="M250 280 L235 295 L265 295 Z" fill="none" stroke={ink} strokeWidth="1.2" />
      <path d="M242 280 L250 268 L258 280" fill="none" stroke={ink} strokeWidth="1.2" />
      {/* 柱子 */}
      <line x1="240" y1="295" x2="240" y2="310" stroke={ink} strokeWidth="1" />
      <line x1="260" y1="295" x2="260" y2="310" stroke={ink} strokeWidth="1" />
      {/* 台基 */}
      <line x1="235" y1="310" x2="265" y2="310" stroke={ink} strokeWidth="1" />
    </g>
  );
}

// ─── 路灯 ────────────────────────────────────
function StreetLamp({ x, y, ink }) {
  return (
    <g filter="url(#roughSm)">
      <line x1={x} y1={y} x2={x} y2={y - 70} stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${x} ${y - 70} Q${x + 20} ${y - 70} ${x + 25} ${y - 65}`}
        fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx={x + 25} cy={y - 60} rx="6" ry="10" fill="none" stroke={ink} strokeWidth="1.2" />
    </g>
  );
}

// ─── 公园指示牌 ──────────────────────────────
function ParkSign({ x, y, ink }) {
  return (
    <g filter="url(#roughSm)">
      <line x1={x} y1={y} x2={x} y2={y + 35} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <rect x={x - 20} y={y - 28} width="40" height="28" rx="3"
        fill="none" stroke={ink} strokeWidth="1.8" />
      <line x1={x - 15} y1={y - 18} x2={x + 15} y2={y - 18} stroke={ink} strokeWidth="1" strokeLinecap="round" />
      <line x1={x - 12} y1={y - 11} x2={x + 12} y2={y - 11} stroke={ink} strokeWidth="1" strokeLinecap="round" />
      <circle cx={x} cy={y + 42} r="4" fill="none" stroke={ink} strokeWidth="1.2" />
    </g>
  );
}

// ─── 长椅 + 情侣 ─────────────────────────────
function BenchCouple({ x, y, ink, time }) {
  const isNight = time === 'night';
  return (
    <g filter="url(#rough)">
      {/* 长椅 */}
      <path d={`M${x - 32} ${y} L${x + 32} ${y}`} stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${x - 30} ${y - 10} L${x + 30} ${y - 10}`} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${x - 30} ${y - 10} Q${x} ${y - 34} ${x + 30} ${y - 10}`}
        fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={x - 28} y1={y} x2={x - 26} y2={y + 12} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <line x1={x + 28} y1={y} x2={x + 26} y2={y + 12} stroke={ink} strokeWidth="2" strokeLinecap="round" />

      {/* 情侣 — 火柴人风格 */}
      <CoupleFigure cx={x} cy={y} ink={ink} isNight={isNight} />
    </g>
  );
}

function CoupleFigure({ cx, cy, ink, isNight }) {
  const dist = isNight ? 10 : 14;
  return (
    <g>
      <g>
        <circle cx={cx - dist} cy={cy - 36} r="7" fill="none" stroke={ink} strokeWidth="1.8" />
        <path d={`M${cx - dist} ${cy - 29} L${cx - dist + 1} ${cy - 6}`}
          fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <path d={`M${cx - dist - 8} ${cy - 20} L${cx - dist - 2} ${cy - 19}`}
          fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <path d={`M${cx - dist} ${cy - 6} L${cx - dist - 5} ${cy + 6}`}
          fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <path d={`M${cx - dist + 1} ${cy - 6} L${cx - dist + 6} ${cy + 6}`}
          fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g>
        <circle cx={cx + dist} cy={cy - 35} r="7" fill="none" stroke={ink} strokeWidth="1.8" />
        <path d={`M${cx + dist} ${cy - 28} L${cx + dist - 1} ${cy - 5}`}
          fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <path d={`M${cx + dist + 8} ${cy - 19} L${cx + dist + 1} ${cy - 18}`}
          fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        {isNight ? (
          <path d={`M${cx + dist} ${cy - 5} Q${cx} ${cy - 8} ${cx - dist} ${cy - 5}`}
            fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <>
            <path d={`M${cx + dist} ${cy - 5} L${cx + dist + 5} ${cy + 6}`}
              fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
            <path d={`M${cx + dist - 1} ${cy - 5} L${cx + dist - 6} ${cy + 6}`}
              fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </g>
    </g>
  );
}function PetAnimal({ cx, cy, angle, radiusX, radiusY, ink, type }) {
  const rad = angle * Math.PI / 180;
  const x = cx + Math.cos(rad) * radiusX;
  const y = cy + Math.sin(rad) * radiusY + 15;
  const isCat = type === 'cat';
  const size = isCat ? 1 : 1.3;
const stopPhase = (t % 10) / 10;
  const catStop = isCat && stopPhase > 0.05 && stopPhase < 0.15;
  const dogJump = !isCat && ((t * 2) % 6) < 0.15;
  const jumpY = dogJump ? -8 : 0;
  if (catStop) return null;

  return (
    <g transform={`translate(${x}, ${y + jumpY}) scale(${size})`}>
      <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke={ink} strokeWidth="1.5" />
      {isCat ? (
        <>
          <circle cx="9" cy="-3" r="5" fill="none" stroke={ink} strokeWidth="1.5" />
          <polygon points="7,-7 8,-12 10,-6" fill="none" stroke={ink} strokeWidth="1" />
          <polygon points="11,-7 10,-12 8,-6" fill="none" stroke={ink} strokeWidth="1" />
        </>
      ) : (
        <>
          <ellipse cx="10" cy="-3" rx="6" ry="5" fill="none" stroke={ink} strokeWidth="1.5" />
          <ellipse cx="7" cy="-7" rx="3" ry="4" fill="none" stroke={ink} strokeWidth="1" />
          <ellipse cx="13" cy="-7" rx="3" ry="4" fill="none" stroke={ink} strokeWidth="1" />
        </>
      )}
      {isCat ? (
        <path d="M-8 0 Q-14 -8 -10 -12" fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
      ) : (
        <path d="M-8 0 Q-14 6 -10 2" fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
      )}
      <line x1="-3" y1="5" x2="-4" y2="9" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="5" x2="4" y2="9" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

// ─── 草地 ────────────────────────────────────
function Grass({ ink, season }) {
  const tufts = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      x: rand(20, 1180), y: rand(400, 650),
      h: rand(6, 14), tilt: rand(-3, 3),
    })), []);
  return (
    <g filter="url(#roughSm)" opacity="0.4">
      {tufts.map((t, i) => (
        <line key={i} x1={t.x} y1={t.y} x2={t.x + t.tilt} y2={t.y - t.h}
          stroke={ink} strokeWidth="1" strokeLinecap="round" />
      ))}
    </g>
  );
}

// ─── 季节地面装饰 ────────────────────────────
function SeasonDecor({ season, ink, wash }) {
  if (season === 'winter') return <Snow patches={30} ink={ink} />;
  if (season === 'autumn') return <Leaves ink={ink} />;
  if (season === 'spring') return <SpringFlowers ink={ink} wash={wash} />;
  return null; // summer = just grass
}

function SpringFlowers({ ink, wash }) {
  const spots = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      x: rand(60, 1140), y: rand(420, 600),
      r: rand(3.5, 5),
    })), []);
  return (
    <g filter="url(#roughSm)">
      {spots.map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={s.y + 4} x2={s.x} y2={s.y + 14}
            stroke={ink} strokeWidth="1" strokeLinecap="round" />
          <circle cx={s.x} cy={s.y} r={s.r}
            fill="none" stroke={ink} strokeWidth="1" />
          <circle cx={s.x} cy={s.y} r={s.r * 0.5}
            fill={wash} opacity="0.25" />
        </g>
      ))}
    </g>
  );
}

function Leaves({ ink }) {
  const leaves = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: rand(50, 1150), y: rand(420, 600),
      r: rand(3, 5), phase: rand(0, Math.PI * 2),
    })), []);
  return (
    <g filter="url(#roughSm)" opacity="0.5">
      {leaves.map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx={l.r} ry={l.r * 0.5}
          fill="none" stroke={ink} strokeWidth="0.8"
          style={{ transform: `rotate(${l.phase}rad)`, transformOrigin: `${l.x}px ${l.y}px` }} />
      ))}
    </g>
  );
}

function Snow({ patches, ink }) {
  const spots = useMemo(() =>
    Array.from({ length: patches }, (_, i) => ({
      x: rand(10, 1190), y: rand(400, 650), r: rand(2, 4),
    })), []);
  return (
    <g filter="url(#roughSm)" opacity="0.35">
      {spots.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r}
          fill="none" stroke={ink} strokeWidth="0.8" />
      ))}
    </g>
  );
}

// =============================================
//  主组件
// =============================================
export default function ParkScene({ time, season, ink, sky, isNight }) {
  const hour = new Date().getHours();
  const leafWash = WASH[season]?.leaf || '#EAF5D0';
  const flowerWash = WASH[season]?.flower || '#FFDDE1';
  const groundWash = WASH[season]?.ground || '#F0F7D4';

  const sunX = time === 'dawn' ? 180 : time === 'noon' ? 600 : time === 'sunset' ? 1020 : 920;
  const sunY = time === 'dawn' || time === 'sunset' ? 170 : 110;

  return (
    <svg
      viewBox="0 0 1200 700"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      style={{ background: `linear-gradient(to bottom, ${sky.top}, ${sky.bottom})` }}
    >
      <defs>
        <style>{`
          @keyframes cloudDrift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(25px); }
          }
          @keyframes treeSway {
            0%, 100% { transform: rotate(-1.2deg); }
            50% { transform: rotate(1.2deg); }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="roughSm" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      {/* 季节色调覆盖层 — 给场景整体加温/冷 */}
      {season === 'spring' && (
        <rect x="0" y="0" width="1200" height="700" fill="#FFF8E8" opacity="0.12" />
      )}
      {season === 'autumn' && (
        <rect x="0" y="0" width="1200" height="700" fill="#FFF3E0" opacity="0.08" />
      )}

      {/* 太阳/月亮 */}
      <SunMoon x={sunX} y={sunY} time={time} ink={ink} />

      {/* 星星（夜晚） */}
      {isNight && <Stars ink={ink} enableShooting={window.CONFIG?.enableShootingStars ?? true} />}

      {/* 云朵（白天） */}
      {!isNight && (
        <>
          <Cloud cx={200} cy={90} sc={1.1} ink={ink} delay={0} />
          <Cloud cx={650} cy={130} sc={0.9} ink={ink} delay={3} />
          <Cloud cx={980} cy={100} sc={1} ink={ink} delay={6} />
          <Cloud cx={420} cy={170} sc={0.7} ink={ink} delay={2} />
        </>
      )}

      {/* 远景城市 */}
      <CitySilhouette ink={ink} />

      {/* 亭子 */}
      <Pavilion ink={ink} />

      {/* 地面 */}
      <path d="M0 310 Q300 320 600 310 Q900 300 1200 310 L1200 700 L0 700 Z"
        fill={isNight ? 'none' : `${groundWash}33`}
        stroke={ink} strokeWidth="1.5" opacity="0.3" />

      {/* 草地 */}
      <Grass ink={ink} season={season} />

      {/* 季节装饰（花/落叶/雪） */}
      <SeasonDecor season={season} ink={ink} wash={flowerWash} />

      {/* 河流 */}
      <River ink={ink} />

      {/* 桥 */}
      <Bridge ink={ink} />

      {/* 后方树木 */}
      <Tree cx={70} cy={450} h={80} season={season} ink={ink} wash={leafWash} />
      <Tree cx={160} cy={460} h={70} season={season} ink={ink} wash={leafWash} />
      <Tree cx={1040} cy={440} h={85} season={season} ink={ink} wash={leafWash} />
      <Tree cx={1130} cy={455} h={75} season={season} ink={ink} wash={leafWash} />

      {/* 路灯 */}
      <StreetLamp x={250} y={400} ink={ink} />
      <StreetLamp x={850} y={410} ink={ink} />
      <StreetLamp x={500} y={490} ink={ink} />

      {/* 指示牌 */}
      <ParkSign x={180} y={460} ink={ink} />

      {/* 前方树木 */}
      <Tree cx={300} cy={550} h={90} season={season} ink={ink} wash={leafWash} />
      <Tree cx={880} cy={540} h={95} season={season} ink={ink} wash={leafWash} />
      <Tree cx={700} cy={560} h={70} season={season} ink={ink} wash={leafWash} />

      {/* 长椅 + 情侣 */}
      <BenchCouple x={560} y={500} ink={ink} time={time} />

    </svg>
  );
}
