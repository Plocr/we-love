const CONFIG = {
  startDate: '2021-10-18 0:0:0',
  musicList: [
    { title: 'Luv Letter', artist: 'DJ OKAWARI', src: '/music/luv_letter.aac' },
    { title: '卡农钢琴曲', artist: 'dylanf', src: '/music/canon.aac' },
    { title: '姑娘 (Live)', artist: '王源', src: '/music/girl.aac', lrc: '/music/girl.lrc' },
    { title: '骄傲', artist: '王源', src: '/music/proud.aac', lrc: '/music/proud.lrc' },
  ],
  enableShootingStars: true,
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

export default CONFIG;
