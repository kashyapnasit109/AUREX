import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  theta: number;
  phi: number;
  radius: number;
  ring: number;
}

export const ParticleCore: React.FC<{
  className?: string;
  customRadius?: number;
  particleCount?: number;
}> = ({ className = '', customRadius, particleCount = 750 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasSize = () => {
      if (!canvas || !canvas.parentElement) return 500;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = Math.max(340, rect.width);
      const h = Math.max(340, rect.height || rect.width);
      canvas.width = w;
      canvas.height = h;
      return Math.min(w, h);
    };

    let dim = setCanvasSize();

    const handleResize = () => {
      dim = setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvas.width / 2) / (canvas.width / 2);
      const y = (e.clientY - rect.top - canvas.height / 2) / (canvas.height / 2);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Multi-Ring Volumetric Orbital Core
    const particles: Particle[] = [];
    const colors = ['#D4F938', '#00E5FF', '#F8FAFC', '#94A3B8', '#34D399'];
    const baseRadius = customRadius || Math.max(160, Math.min(260, dim * 0.42));

    for (let i = 0; i < particleCount; i++) {
      const ring = Math.floor(Math.random() * 3); // 3 complementary orbital inclination planes
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r = baseRadius * (0.75 + Math.random() * 0.5);

      particles.push({
        x: 0,
        y: 0,
        z: 0,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.003 + Math.random() * 0.004,
        theta,
        phi,
        radius: r,
        ring,
      });
    }

    let rotX = 0.35;
    let rotY = 0;
    let rotZ = 0.15;

    const render = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Smooth inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotX += 0.003 + mouseRef.current.y * 0.008;
      rotY += 0.005 + mouseRef.current.x * 0.008;
      rotZ += 0.001;

      const fov = 420;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project & Transform 3D Points
      const projected = particles.map((p) => {
        p.theta += p.speed;

        // Base multi-ring orientation
        let x0 = 0, y0 = 0, z0 = 0;

        if (p.ring === 0) {
          // Equator Torus
          x0 = p.radius * Math.cos(p.theta);
          y0 = (p.radius * 0.35) * Math.sin(p.theta) + Math.sin(p.theta * 3 + rotY) * 15;
          z0 = p.radius * Math.sin(p.theta);
        } else if (p.ring === 1) {
          // Inclined Helix Ring (45 deg)
          const angle = p.theta;
          x0 = p.radius * Math.cos(angle);
          y0 = p.radius * Math.sin(angle) * 0.85;
          z0 = (p.radius * 0.45) * Math.sin(angle);
        } else {
          // Cross-Polar Ring
          const angle = p.theta;
          x0 = (p.radius * 0.4) * Math.cos(angle);
          y0 = p.radius * Math.sin(angle);
          z0 = p.radius * Math.cos(angle);
        }

        // Apply Rotation Matrix
        // Rot Y
        let x1 = x0 * Math.cos(rotY) + z0 * Math.sin(rotY);
        let z1 = -x0 * Math.sin(rotY) + z0 * Math.cos(rotY);
        let y1 = y0;

        // Rot X
        let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
        let x2 = x1;

        // Rot Z
        let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
        let z3 = z2;

        const scale = fov / (fov + z3 + 300);
        const projX = centerX + x3 * scale;
        const projY = centerY + y3 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z3 + 260) / 520));

        return {
          projX,
          projY,
          scale,
          alpha,
          size: p.size * scale,
          color: p.color,
          z: z3,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      // Micro Constellation Links
      for (let i = 0; i < projected.length; i += 3) {
        const p1 = projected[i];
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.projX - p2.projX, p1.projY - p2.projY);
          if (dist < 42) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - dist / 42) * p1.alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Render Particles with Soft Halos
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        if (p.size > 1.4) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, p.size * 2.6, 0, Math.PI * 2);
          ctx.fillStyle =
            p.color === '#D4F938'
              ? 'rgba(212, 249, 56, 0.25)'
              : 'rgba(0, 229, 255, 0.25)';
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [customRadius, particleCount]);

  return (
    <div className={`relative flex items-center justify-center w-full h-full min-h-[460px] ${className}`}>
      {/* Volumetric Radial Ambient Halos */}
      <div className="absolute w-[80%] h-[80%] max-w-[480px] max-h-[480px] rounded-full bg-lime-500/15 blur-[120px] pointer-events-none -translate-x-8 -translate-y-8" />
      <div className="absolute w-[85%] h-[85%] max-w-[500px] max-h-[500px] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none translate-x-8 translate-y-8" />
      <canvas ref={canvasRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
