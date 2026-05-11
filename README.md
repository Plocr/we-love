# ♥ We Love

一张会动的手绘明信片 —— 专属于你们的恋爱纪念日。

> 在线预览：https://plocr.github.io/we-love/

---

## 场景

手绘线条风格的公园场景，时间和季节**跟随系统时钟自动变化**：

| 时段 | 小时 | 天空特征 |
|------|------|---------|
| 🌅 日出 05:00–08:59 | 淡橙粉 |
| ☀️ 正午 09:00–16:59 | 淡蓝 |
| 🌇 日落 17:00–19:59 | 橙红粉 |
| 🌙 夜晚 20:00–04:59 | 深蓝灰，线条变色 |

| 季节 | 月份 | 特征 |
|------|------|------|
| 🌸 春 3–5月 | 樱花暖粉 |
| 🌿 夏 6–8月 | 茂密绿树 |
| 🍂 秋 9–11月 | 橙黄落叶 |
| ❄️ 冬 12–2月 | 枯枝雪点 |

### 场景包含
- ☁️ 云朵漂移 · 🌲 四季树木 · 🌊 流动河流 · 🌉 手绘拱桥
- 🪑 长椅情侣 · 🏮 路灯 · 🪧 纪念日广告牌 · 🏙️ 远景城市
- 🎵 唱片机浮窗（4 首歌循环播放 + LRC 歌词同步）
- ❄️ 粒子系统（花瓣 / 落叶 / 雪花 / 星星）

---

## 🚀 快速上手给 TA 一个惊喜

### 方式一：Fork + 改配置（推荐，5 分钟）

```bash
# 1. Fork 这个仓库
#    GitHub 上点右上角 Fork → 创建你的副本

# 2. 克隆到本地
git clone https://github.com/你的用户名/we-love.git
cd we-love

# 3. 改配置
```

编辑根目录的 **`config.js`**：

```js
const CONFIG = {
  startDate: '2021-10-18 0:0:0',   // ← 改成你们的纪念日
  musicList: [
    { title: '你们的歌', artist: '歌手', src: 'music/song.mp3', lrc: 'music/song.lrc' },
    // 想加多少首加多少首
  ],
  enableShootingStars: true,         // 流星开关
};
```

然后替换 `public/music/` 里的歌曲文件（支持 mp3、aac、flac、ogg、wav）。

### 方式二：直接用 GitHub Pages

```bash
# 1. Fork 后进入 Settings → Pages
# 2. Source 选 "Deploy from a branch"
# 3. Branch: main, folder: /docs
# 4. 等 2 分钟，你的页面就上线了
```

**地址：** `https://你的用户名.github.io/we-love/`

### 方式三：本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:5173
npm run build    # 构建到 docs/ 目录
```

### 修改网站图标

替换 `public/favicon.svg` 为你的 SVG 文件即可。

---

## ⚙️ 自定义指南

### 纪念日

```js
// config.js
startDate: '2021-10-18 0:0:0'
```
左下角会显示 **♥ 5周年倒计时 161天**，广告牌显示 "已相恋 × 周年，共计 ××× 天"。

### 歌曲

支持 `mp3` / `aac` / `flac` / `ogg` / `wav` 格式。

```js
musicList: [
  { title: '歌名', artist: '歌手', src: 'music/file.mp3' },
  { title: '有歌词的歌', artist: '歌手', src: 'music/file.mp3', lrc: 'music/file.lrc' },
]
```

歌词文件为 `.lrc` 格式，放在 `public/music/` 文件夹。播放时会同步高亮，当前行居中显示。

### 配色

编辑 `src/theme.js` 中的 `WASH` 对象可调整四季的晕染色调：

```js
export const WASH = {
  spring: { sky: '#FFE4E1', ground: '#F0F7D4', leaf: '#EAF5D0', flower: '#FFDDE1' },
  //                           ↑ 地面色        ↑ 树叶晕染      ↑ 花色
  ...
};
```

线条颜色在 `INK`（白天 `#2C1810`）和 `INK_NIGHT`（夜晚 `#C8D6E5`）调整。

### 天空色

编辑 `src/theme.js` 中的 `SKY` 对象：

```js
export const SKY = {
  noon: { top: '#D6EAF8', bottom: '#EBF5FB' },
  //        ↑ 天空顶部    ↑ 天空底部
  ...
};
```

---

## 🧱 项目结构

```
├── config.js                       # 你的配置（纪念日、歌单）
├── public/
│   ├── favicon.svg                 # 网站图标
│   └── music/                      # 歌曲 + 歌词文件
├── src/
│   ├── App.jsx                     # 根组件
│   ├── index.css                   # 全局样式 + 字体
│   ├── theme.js                    # 色彩系统配置
│   ├── hooks.js                    # 系统时钟 / LRC 歌词
│   ├── utils.js                    # 纪念日计算 / LRC 解析
│   └── components/
│       ├── ParkScene.jsx           # SVG 手绘公园场景
│       ├── Billboard.jsx           # 纪念日广告牌
│       ├── RecordPlayer.jsx        # 唱片机浮窗
│       └── Particles.jsx           # Canvas 粒子系统
└── docs/                           # 构建输出（给 GitHub Pages）
```

## 致谢

- 字体：[小赖字体](https://github.com/lxgw/kose-font) by 落霞孤鹜
- 手绘风格灵感来源于针管笔插画与明信片

---

**用代码说爱，是最浪漫的 bug。** 💕
