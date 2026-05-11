import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';
import { parseLRC } from '../utils';

export default function RecordPlayer({ ink }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const howlRef = useRef(null);

  // ─── tick 定时器（替代 rAF，避免 seek 中断） ─────
  const tickRef = useRef(null);

  function startTick() {
    stopTick();
    tickRef.current = setInterval(() => {
      const howl = howlRef.current;
      if (!howl) return;
      try {
        if (!howl.playing()) return;
        const seek = howl.seek() || 0;
        const dur = howl.duration() || 1;
        setCurrentTime(seek);
        setProgress(Math.min(seek / dur, 1));
      } catch (e) { /* ignore */ }
    }, 200);
  }

  function stopTick() {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  // ─── 歌单 ────────────────────────────────
  const songs = window.CONFIG?.musicList?.length
    ? window.CONFIG.musicList
    : [];

  // ─── 拖拽 ────────────────────────────────
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(10, window.innerWidth - 320 - 20) : 0,
    y: 80,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 });

  // ─── Howler ──────────────────────────────
  function loadSong(index, autoPlay = false) {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
    stopTick();
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const song = songs[index];
    if (!song || !song.src) return;

    const howl = new Howl({
      src: [song.src],
      html5: true,
      onload() {
        setDuration(howl.duration());
        if (autoPlay) {
          setTimeout(() => { if (howlRef.current) howlRef.current.play(); }, 50);
        }
      },
      onplay() {
        setPlaying(true);
        startTick();
      },
      onpause() {
        setPlaying(false);
        stopTick();
      },
      onstop() {
        setPlaying(false);
        stopTick();
        setProgress(0);
        setCurrentTime(0);
      },
      onend() {
        stopTick();
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        const nextIdx = (index + 1) % songs.length;
        loadSong(nextIdx, true);
        setSongIdx(nextIdx);
      },
    });
    howlRef.current = howl;
  }

  // 首次用户交互 → 自动播放
  const firstClickRef = useRef(true);
  useEffect(() => {
    if (!songs[0]) return;
    const handler = () => {
      if (!firstClickRef.current) return;
      firstClickRef.current = false;
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
      if (!howlRef.current) {
        loadSong(songIdx, true);
      }
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // 首次加载或切歌
  useEffect(() => {
    if (howlRef.current === null) {
      loadSong(songIdx);
    }
  }, [songIdx]);

  // 清理
  useEffect(() => {
    return () => { if (howlRef.current) howlRef.current.unload(); stopTick(); };
  }, []);

  function switchSong(newIdx, autoPlay = false) {
    const song = songs[newIdx];
    if (!song || !song.src) return;
    setSongIdx(newIdx);
    loadSong(newIdx, autoPlay);
  }

  function togglePlay() {
    const howl = howlRef.current;
    if (!howl) { loadSong(songIdx); return; }
    if (howl.playing()) { howl.pause(); }
    else { howl.play(); }
  }

  function nextSong() {
    if (howlRef.current?.playing()) {
      switchSong((songIdx + 1) % songs.length, true);
    } else {
      switchSong((songIdx + 1) % songs.length, false);
    }
  }

  function prevSong() {
    const prev = (songIdx - 1 + songs.length) % songs.length;
    if (howlRef.current?.playing()) {
      switchSong(prev, true);
    } else {
      switchSong(prev, false);
    }
  }

  // ─── 拖拽 ────────────────────────────────
  const handleMD = useCallback((e) => {
    if (!e.target.closest('.rp-header')) return;
    setIsDragging(true);
    setDragOff({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [pos]);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => setPos({ x: e.clientX - dragOff.x, y: e.clientY - dragOff.y });
    const up = () => setIsDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging, dragOff]);

  // ─── LRC ──────────────────────────────────
  const [lrcLines, setLrcLines] = useState([]);
  const [lrcLoaded, setLrcLoaded] = useState(false);

  useEffect(() => {
    const song = songs[songIdx];
    if (!song || !song.lrc) {
      setLrcLines([]);
      setLrcLoaded(true);
      return;
    }
    setLrcLoaded(false);
    fetch(song.lrc)
      .then(r => r.text())
      .then(text => { setLrcLines(parseLRC(text)); setLrcLoaded(true); })
      .catch(() => { setLrcLines([]); setLrcLoaded(true); });
  }, [songIdx]);

  const currentLyricIndex = lrcLines.findLastIndex(l => l.time <= currentTime);

  function fmtTime(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // ─── 进度条寻轨 ──────────────────────────
  function seekToClientX(clientX, rect) {
    const dur = howlRef.current?.duration() || 1;
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (howlRef.current) {
      howlRef.current.seek(p * dur);
      setProgress(p);
      setCurrentTime(p * dur);
    }
  }

  // ─── 收起态 ─────────────────────────────
  if (!open) {
    return (
      <div className="fixed z-50 cursor-pointer"
        style={{ left: pos.x + 232, top: pos.y }}
        onClick={() => setOpen(true)}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <defs>
            <filter id="rpMini" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="n"/>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
          <circle cx="24" cy="24" r="22" fill="#3a3a3a" stroke={ink} strokeWidth="1.5" filter="url(#rpMini)" />
          <circle cx="24" cy="24" r="16" fill="none" stroke="#555" strokeWidth="0.6" opacity="0.5" />
          <circle cx="24" cy="24" r="14" fill="none" stroke="#555" strokeWidth="0.6" opacity="0.4" />
          <circle cx="24" cy="24" r="8" fill="#CC3333" />
          <circle cx="24" cy="24" r="4" fill={ink} />
          {playing && (
            <circle cx="24" cy="24" r="20" fill="none" stroke="#FF6666" strokeWidth="1" opacity="0.4"
              strokeDasharray="8 12"
              style={{ animation: 'spin 2s linear infinite', transformOrigin: '24px 24px' }} />
          )}
        </svg>
      </div>
    );
  }

  // ─── 无歌曲提示 ──────────────────────────
  if (!songs.length) {
    return (
      <motion.div className="fixed z-50 w-[280px]"
        style={{ left: pos.x, top: pos.y }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <svg viewBox="0 0 280 120" width="280" height="120" className="absolute inset-0">
          <rect x="2" y="2" width="276" height="116" rx="6"
            fill="rgba(245,240,232,0.92)" stroke={ink} strokeWidth="2" />
        </svg>
        <div className="relative h-[120px] flex items-center justify-center text-xs"
          style={{ color: ink, fontFamily: 'Xiaolai, serif' }}>
          暂无歌曲，请在 config.js 中添加
        </div>
      </motion.div>
    );
  }

  const currentSong = songs[songIdx];

  // ─── 展开态 ─────────────────────────────
  return (
    <motion.div
      className="fixed z-50 w-[280px] select-none"
      style={{ left: pos.x, top: pos.y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onMouseDown={handleMD}
    >
      <svg viewBox="0 0 280 380" width="280" height="380" className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <defs>
          <filter id="rpRoughF" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <rect x="2" y="2" width="276" height="376" rx="6"
          fill="rgba(245,240,232,0.92)" stroke={ink} strokeWidth="2" filter="url(#rpRoughF)" />
        <rect x="8" y="34" width="264" height="338" rx="3"
          fill="rgba(235,225,210,0.35)" stroke="none" />
      </svg>

      {/* 标题栏 */}
      <div className="rp-header absolute top-0 left-0 right-0 h-9 flex items-center px-3 cursor-grab active:cursor-grabbing z-10">
        <span className="text-xs" style={{ color: ink, fontFamily: 'Xiaolai, serif' }}>唱片机</span>
        <span className="ml-auto flex gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block"
            style={{ background: '#d4436b' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setOpen(false)} />
        </span>
      </div>

      {/* 内容 */}
      <div className="absolute top-9 left-2 right-2 bottom-2 flex flex-col items-center gap-2 p-3 pointer-events-none">
        <div className="pointer-events-auto w-full flex flex-col items-center gap-2">

          {/* 唱片 — 点击切换播放 */}
          <div className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}>
            <svg viewBox="0 0 128 128" width="128" height="128" className="absolute"
              style={{ animation: playing ? 'spin 3s linear infinite' : 'none' }}>
              {/* 唱片体 — 黑胶 + 红色内心（网易云风格） */}
              <circle cx="64" cy="64" r="62" fill="#1a1a1a" />
              <circle cx="64" cy="64" r="60" fill="none" stroke="#2C1810" strokeWidth="1.5" />
              {/* 同心圆沟槽 */}
              {[56, 51, 46, 41, 36, 31, 26].map((r, i) => (
                <circle key={i} cx="64" cy="64" r={r} fill="none" stroke="#2a2a2a" strokeWidth="0.7" opacity={0.4 + i * 0.06} />
              ))}
              {/* 红色内心 */}
              <circle cx="64" cy="64" r="22" fill="#CC3333" />
              <circle cx="64" cy="64" r="20" fill="none" stroke="#991111" strokeWidth="0.8" />
              <circle cx="64" cy="64" r="14" fill="none" stroke="#AA2222" strokeWidth="0.5" opacity="0.5" />
              {/* 中心孔 */}
              <circle cx="64" cy="64" r="5" fill="#0a0a0a" />
              <circle cx="64" cy="64" r="3" fill="#000" />
              {/* 旋转标记 */}
              <line x1="124" y1="64" x2="116" y2="64" stroke="#FF5555" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="124" cy="64" r="2.5" fill="#FF5555" />
            </svg>
            {/* 唱针 — 红色 */}
            <svg viewBox="0 0 128 128" width="128" height="128" className="absolute pointer-events-none"
              style={{ transformOrigin: '68px 34px', transform: playing ? 'rotate(-3deg)' : 'rotate(-22deg)', transition: 'transform 0.6s ease' }}>
              <path d="M68 34 L100 82 L98 85 L66 78 Z" fill="none" stroke="#CC3333" strokeWidth="2" />
              <circle cx="68" cy="34" r="4" fill="none" stroke="#CC3333" strokeWidth="1.5" />
            </svg>
          </div>

          {/* 歌曲名 */}
          <div className="text-xs text-center" style={{ color: ink, fontFamily: 'Xiaolai, serif' }}>
            {currentSong.title}
          </div>

          {/* 歌词 — 3行，当前行居中 */}
          <div className="w-full h-20 rounded-lg px-3 py-2 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            {lrcLines.length > 0 && lrcLoaded ? (
              (() => {
                const totalShow = 3, midPos = 1;
                let start = currentLyricIndex >= 0
                  ? Math.max(0, currentLyricIndex - midPos)
                  : 0;
                if (start + totalShow > lrcLines.length) {
                  start = Math.max(0, lrcLines.length - totalShow);
                }
                const visLines = lrcLines.slice(start, start + totalShow);
                const curPos = currentLyricIndex >= 0 ? currentLyricIndex - start : -1;
                return (
                  <div className="flex flex-col gap-1 text-center">
                    {visLines.map((line, i) => {
                      const isCur = i === curPos;
                      return (
                        <div key={start + i} className="transition-all duration-300"
                          style={{
                            fontSize: isCur ? '14px' : '11px',
                            color: isCur ? ink : `${ink}88`,
                            fontWeight: isCur ? 700 : 400,
                            opacity: isCur ? 1 : 0.5,
                            fontFamily: 'Xiaolai, serif',
                          }}>
                          {isCur ? `♫ ${line.text}` : line.text}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="text-xs text-center flex items-center justify-center h-full"
                style={{ color: `${ink}88`, fontFamily: 'Xiaolai, serif' }}>
                {lrcLoaded ? '暂无歌词' : '加载歌词中...'}
              </div>
            )}
          </div>

          {/* 进度条 */}
          <div className="w-full">
            <div className="w-full h-3 relative flex items-center cursor-pointer group"
              style={{ padding: '6px 0' }}
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seekToClientX(e.clientX, rect);
                const el = e.currentTarget;
                const onMove = (ev) => {
                  const r = el.getBoundingClientRect();
                  seekToClientX(ev.clientX, r);
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                  // 拖完后保证 tick 继续运行
                  if (howlRef.current?.playing()) startTick();
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}>
              <div className="absolute left-0 right-0 h-1.5 rounded-full"
                style={{ background: `${ink}22` }} />
              <div className="absolute left-0 h-1.5 rounded-full"
                style={{ width: `${progress * 100}%`, background: ink }} />
              <div className="absolute w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress * 100}% - 6px)`, background: ink }} />
            </div>
            <div className="flex justify-between text-[10px] mt-1 px-0.5"
              style={{ color: `${ink}88`, fontFamily: 'Xiaolai, serif' }}>
              <span>{fmtTime(currentTime)}</span>
              <span>{fmtTime(duration)}</span>
            </div>
          </div>

          {/* 控制 */}
          <div className="flex items-center gap-4 py-1">
            <button onClick={prevSong} className="p-1 hover:opacity-60 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M13 3 L5 9 L13 15" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all hover:scale-105"
              style={{ borderColor: '#CC3333', background: 'rgba(204,51,51,0.08)' }}>
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <rect x="3" y="2" width="3" height="10" rx="0.8" fill="#CC3333" />
                  <rect x="8" y="2" width="3" height="10" rx="0.8" fill="#CC3333" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <polygon points="4,2 12,7 4,12" fill="#CC3333" />
                </svg>
              )}
            </button>
            <button onClick={nextSong} className="p-1 hover:opacity-60 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M5 3 L13 9 L5 15" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
