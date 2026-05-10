import { useState, useEffect } from 'react';
import { calcAnniversary } from '../utils';

export default function Billboard({ startDate, ink }) {
  const [info, setInfo] = useState(() => calcAnniversary(startDate));

  useEffect(() => {
    const id = setInterval(() => setInfo(calcAnniversary(startDate)), 10000);
    return () => clearInterval(id);
  }, [startDate]);

  return (
    <div className="absolute z-30"
      style={{
        left: '6%',
        top: '18%',
        filter: 'url(#billRough)',
        animation: 'billSway 6s ease-in-out infinite',
      }}>
      <svg viewBox="0 0 160 220" width="130" className="overflow-visible">
        <defs>
          <filter id="billRough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <style>{`
            @keyframes billSway {
              0%, 100% { transform: rotate(-1deg); }
              50% { transform: rotate(1deg); }
            }
          `}</style>
        </defs>

        {/* 立柱 */}
        <line x1="50" y1="220" x2="50" y2="35" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="220" x2="110" y2="35" stroke={ink} strokeWidth="3" strokeLinecap="round" />

        {/* 横梁 */}
        <line x1="38" y1="210" x2="122" y2="210" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="218" x2="122" y2="218" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />

        {/* 牌面 */}
        <rect x="20" y="5" width="120" height="110" rx="3"
          fill="rgba(245,240,232,0.85)" stroke={ink} strokeWidth="2" />
        <rect x="26" y="11" width="108" height="98" rx="2"
          fill="none" stroke={ink} strokeWidth="0.8" opacity="0.4" />

        {/* 内容 */}
        <text x="80" y="38" textAnchor="middle" fontFamily="Xiaolai, serif"
          fontSize="14" fill={ink}>已相恋</text>

        {info.years > 0 && (
          <text x="80" y="68" textAnchor="middle" fontFamily="Xiaolai, serif"
            fontSize="24" fill={ink}>{info.years} 周年</text>
        )}

        <text x="80" y={info.years > 0 ? 96 : 80} textAnchor="middle"
          fontFamily="Xiaolai, serif" fontSize="12" fill={ink}>
          共计 {info.totalDays} 天
        </text>

        <text x="80" y="108" textAnchor="middle" fontFamily="Xiaolai, serif"
          fontSize="10" fill={ink}>♥</text>
      </svg>
    </div>
  );
}
