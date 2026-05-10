import { useState, useEffect } from 'react';
import { useSystemTime } from './hooks';
import ParkScene from './components/ParkScene';
import Billboard from './components/Billboard';
import RecordPlayer from './components/RecordPlayer';
import Particles from './components/Particles';
import { calcNextAnniversary } from './utils';

export default function App() {
  const sys = useSystemTime();
  const cfg = window.CONFIG;
  const startDate = cfg?.startDate || '2021-10-18 0:0:0';

  const [nextAnniv, setNextAnniv] = useState(() => calcNextAnniversary(startDate));
  useEffect(() => {
    const id = setInterval(() => setNextAnniv(calcNextAnniversary(startDate)), 60000);
    return () => clearInterval(id);
  }, [startDate]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#F5F0E8' }}>

      {/* 主场景 */}
      <div className="absolute inset-0 z-0">
        <ParkScene
          time={sys.time}
          season={sys.season}
          ink={sys.ink}
          sky={sys.sky}
          isNight={sys.isNight}
        />
      </div>

      {/* 粒子 */}
      <Particles season={sys.season} isNight={sys.isNight} />

      {/* 广告牌 */}
      <Billboard
        startDate={startDate}
        ink={sys.ink}
      />

      {/* 唱片机 */}
      <RecordPlayer ink={sys.ink} />

      {/* 底部指示器 */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-wrap gap-2 text-xs"
        style={{ fontFamily: 'Xiaolai, serif' }}>
        <span className="px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(245,240,232,0.85)',
            border: `1px solid ${sys.ink}33`,
            color: sys.ink,
          }}>
          {timeLabel(sys.time)}
        </span>
        <span className="px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(245,240,232,0.85)',
            border: `1px solid ${sys.ink}33`,
            color: sys.ink,
          }}>
          {seasonLabel(sys.season)}
        </span>
        <span className="px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(245,240,232,0.85)',
            border: `1px solid ${sys.ink}33`,
            color: '#CC3333',
          }}>
          ♥ {nextAnniv.yearsSince}周年倒计时 {nextAnniv.daysLeft}天
        </span>
      </div>
    </div>
  );
}

function timeLabel(t) {
  return `● ${ { dawn: '日出', noon: '正午', sunset: '日落', night: '夜晚' }[t] || t }`;
}
function seasonLabel(s) {
  return `✿ ${ { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[s] || s }`;
}
