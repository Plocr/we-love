import { useState, useEffect, useCallback } from 'react';
import { getTimeOfDay, getSeason, getInk, getSky, getWash } from './theme';
import { parseLRC } from './utils';

// ─── 跟随系统时钟 ─────────────────────────
export function useSystemTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      // 每分钟检查一次是否跨越时段边界
      setNow(prev => {
        const pHour = prev.getHours();
        const nHour = d.getHours();
        if (getTimeOfDay(pHour) !== getTimeOfDay(nHour) || Math.abs(d - prev) > 60000) {
          return d;
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const month = now.getMonth() + 1;

  const season = getSeason(month);
  return {
    hour,
    month,
    time: getTimeOfDay(hour),
    season,
    ink: getInk(hour),
    sky: getSky(hour, season),
    wash: getWash(month),
    isNight: hour < 5 || hour >= 20,
  };
}

// ─── LRC 歌词 ───────────────────────────────
export function useLRC(audioTime = 0) {
  const [lyrics, setLyrics] = useState(() => {
    // 尝试从 window.CONFIG 获取歌词
    try {
      const cfg = window.CONFIG;
      return parseLRC(cfg?.lyrics || cfg?.lyric || '');
    } catch { return []; }
  });

  const currentIndex = useCallback(() => {
    if (!lyrics.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= audioTime) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, audioTime]);

  return {
    lyrics,
    currentIndex: currentIndex(),
    currentLine: lyrics[currentIndex()]?.text || '',
  };
}
