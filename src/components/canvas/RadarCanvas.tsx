import React, { useEffect, useRef } from 'react';

export const RadarCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 300;
    };
    resize();
    window.addEventListener('resize', resize);

    // Simulated radar blips (signal anomalies)
    const blips = [
      { r: 0.35, a: 0.8, size: 4, color: '#00E5FF', label: 'APAC (1.7σ)' },
      { r: 0.65, a: 2.4, size: 5, color: '#D4F938', label: 'NA Renewals (+24%)' },
      { r: 0.50, a: 4.2, size: 4, color: '#F43F5E', label: 'LATAM Churn' },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(cx, cy) - 20;

      // Draw concentric radar rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxRadius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshair axes
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Rotating sweep line
      angle += 0.015;
      const sweepX = cx + Math.cos(angle) * maxRadius;
      const sweepY = cy + Math.sin(angle) * maxRadius;

      const gradient = ctx.createConicGradient(angle, cx, cy);
      gradient.addColorStop(0, 'rgba(212, 249, 56, 0.25)');
      gradient.addColorStop(0.1, 'rgba(212, 249, 56, 0.05)');
      gradient.addColorStop(0.25, 'transparent');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw radar sweep line
      ctx.strokeStyle = '#D4F938';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Draw blips
      blips.forEach((blip) => {
        const bx = cx + Math.cos(blip.a) * (maxRadius * blip.r);
        const by = cy + Math.sin(blip.a) * (maxRadius * blip.r);

        ctx.fillStyle = blip.color;
        ctx.beginPath();
        ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing outer halo
        ctx.strokeStyle = blip.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, blip.size + (Math.sin(Date.now() / 200) * 3 + 3), 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(blip.label, bx + 8, by + 3);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};
