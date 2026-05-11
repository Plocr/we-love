# ♥ We Love

一张会动的手绘明信片 —— 恋爱纪念日场景。

> 在线预览：https://plocr.github.io/we-love/

---

## 场景

手绘线条风格的公园场景，包含：

- ☁️ 云朵漂移（CSS 动画）
- 🌲 树木随季节变化（春/夏/秋/冬）
- 🌊 河流波纹流动
- 🌉 手绘拱桥
- 🪑 长椅上的情侣剪影
- 🏮 路灯、指示牌、远景城市轮廓
- 🪧 纪念日广告牌（实时计算天数）
- 🎵 唱片机浮窗（播放/暂停/切歌/歌词同步）
- ❄️ 粒子系统（春=花瓣、秋=落叶、冬=雪花、夜=星星）

## 时段与季节

时间与季节**跟随系统时钟**，页面自动切换：

| 时段 | 小时 | 天空特征 |
|------|------|---------|
| 🌅 日出 | 05:00–08:59 | 淡橙粉 |
| ☀️ 正午 | 09:00–16:59 | 淡蓝 |
| 🌇 日落 | 17:00–19:59 | 橙红粉 |
| 🌙 夜晚 | 20:00–04:59 | 深蓝灰 |

| 季节 | 月份 | 特征 |
|------|------|------|
| 🌸 春 | 3–5月 | 樱花、暖粉色 |
| 🌿 夏 | 6–8月 | 茂密绿树 |
| 🍂 秋 | 9–11月 | 橙黄落叶 |
| ❄️ 冬 | 12–2月 | 枯枝雪点 |

## 配置

编辑 `config.js`：

```js
const CONFIG = {
  startDate: '2021-10-18 0:0:0',   // 纪念日起始日期
  musicList: [                       // 播放列表
    {
      title: 'Luv Letter',
      artist: 'DJ OKAWARI',
      src: '/music/luv_letter.aac',
      lrc: '/music/luv_letter.lrc'  // 可选歌词文件
    },
  ],
  enableShootingStars: true,         // 是否启用流星
};
```

## 本地开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 构建到 docs/
```

## 技术栈

- React 18 + Vite
- Framer Motion
- Howler.js（音频播放）
- Tailwind CSS
- 小赖字体（Kose Font）
- SVG 手绘风格（feTurbulence 抖动滤镜）
- Canvas 粒子系统

## 部署

推送到 `main` 分支后，GitHub Pages 自动从 `/docs` 目录部署。

## 致谢

- 字体：[小赖字体](https://github.com/lxgw/kose-font) by 落霞孤鹜
- 灵感来源于手绘插画与明信片风格
