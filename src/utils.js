// 计算纪念日
export function calcAnniversary(startDate) {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - start);
  const totalDays = Math.floor(diffMs / 86400000);
  const years = Math.floor(totalDays / 365);
  const days = totalDays % 365;
  return { years, days, totalDays };
}

// 计算下一次周年倒计时
export function calcNextAnniversary(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  const next = thisYear > now ? thisYear : new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
  const diffMs = next - now;
  const daysLeft = Math.ceil(diffMs / 86400000);
  const yearsSince = next.getFullYear() - start.getFullYear();
  return { daysLeft, yearsSince, nextDate: next };
}

// 随机数
export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// 随机整数
export function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

// 随机挑选
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Lerp 颜色
export function lerpColor(a, b, t) {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr},${rg},${rb})`;
}

// 解析 LRC 歌词
export function parseLRC(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const result = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  lines.forEach(line => {
    const match = line.match(regex);
    if (!match) return;
    const min = parseInt(match[1]);
    const sec = parseInt(match[2]);
    const ms = match[3].length === 2 ? parseInt(match[3]) * 10 : parseInt(match[3]);
    const time = min * 60 + sec + ms / 1000;
    const lyric = line.replace(regex, '').trim();
    if (lyric) result.push({ time, text: lyric });
  });
  return result.sort((a, b) => a.time - b.time);
}
