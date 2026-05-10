// ============================================
// v3 色彩系统 — 手绘明信片风格
// ============================================

// 线条墨色
export const INK = '#2C1810';        // 白天线条色
export const INK_NIGHT = '#C8D6E5';  // 夜晚线条色

// 天空色
export const SKY = {
  dawn:    { top: '#FDEBD0', bottom: '#FEF9E7' },
  noon:    { top: '#D6EAF8', bottom: '#EBF5FB' },
  sunset:  { top: '#F9EBEA', bottom: '#FDEDEC' },
  night:   { top: '#1a2340', bottom: '#2a3360' },
};

// 淡彩晕染 (透明度 20-40%)
export const WASH = {
  spring: { sky: '#FFE4E1', ground: '#F0F7D4', leaf: '#EAF5D0', flower: '#FFDDE1' },
  summer: { sky: '#D6EAF8', ground: '#D4EDDA', leaf: '#C8E6C9', flower: '#F8BBD0' },
  autumn: { sky: '#FAE5D3', ground: '#F9E79F', leaf: '#FAE5D3', flower: '#FFE0B2' },
  winter: { sky: '#EBF5FB', ground: '#F2F3F4', leaf: '#E8ECEF', flower: '#E8ECEF' },
};

// 根据小时数判断时段
export function getTimeOfDay(hour) {
  if (hour >= 5 && hour <= 8) return 'dawn';
  if (hour >= 9 && hour <= 16) return 'noon';
  if (hour >= 17 && hour <= 19) return 'sunset';
  return 'night';
}

// 根据月份判断季节
export function getSeason(month) {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// 当前是否为夜晚
export function isNight(hour) {
  return hour < 5 || hour >= 20;
}

// 获取当前线条色
export function getInk(hour) {
  return isNight(hour) ? INK_NIGHT : INK;
}

// 获取当前天空色（含季节调暖）
export function getSky(hour, season) {
  const base = { ...(SKY[getTimeOfDay(hour)] || SKY.noon) };
  // 春天暖化天空底部
  if (season === 'spring' && getTimeOfDay(hour) === 'noon') {
    base.bottom = '#FEF9E7';
  }
  return base;
}

// 获取当前季节晕染色
export function getWash(month) {
  return WASH[getSeason(month)] || WASH.spring;
}
