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
