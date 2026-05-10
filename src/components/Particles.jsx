import { useEffect, useRef } from 'react';
import { rand } from '../utils';

const COLORS = {
  spring: '#FADBD8',
  summer: '#D5F5E3',
  autumn: '#FAE5D3',
  winter: '#d0d0e0',
  star: '#d0d4e0',
  snow: '#e0e4e8',
};

export default function Particles({ season, isNight }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let animId;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const isFall = season === 'autumn';
    const isWinter = season === 'winter';
    const isSpring = season === 'spring';
    const count = isNight ? 50 : isFall || isWinter ? 25 : 15;

    function init() {
      particles = Array.from({ length: count }, () => ({
        x: rand(0, w), y: rand(-h, 0),
        size: rand(1.5, 3),
        speed: isWinter ? rand(0.8, 2.5) : rand(0.3, 1),
        drift: rand(-0.3, 0.3),
        opacity: rand(0.3, 0.8),
        phase: rand(0, Math.PI * 2),
      }));
    }
    init();

    function draw() {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.phase) * p.drift;
        p.phase += 0.02;
        if (p.y > h + 10) { p.y = -10; p.x = rand(0, w); }

        let color;
        if (isNight) {
          color = COLORS.star;
          const twinkle = 0.2 + Math.sin(p.phase * 3) * 0.8;
          ctx.globalAlpha = twinkle * 0.7;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (isWinter) {
          color = COLORS.snow;
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI * 2) / 6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + Math.cos(a) * p.size * 2, p.y + Math.sin(a) * p.size * 2);
            ctx.stroke();
          }
        } else {
          color = isFall ? COLORS.autumn : isSpring ? COLORS.spring : COLORS.summer;
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.2, p.size * 0.6, p.phase * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [season, isNight]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-10" />;
}
