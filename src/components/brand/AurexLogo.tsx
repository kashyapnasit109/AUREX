import React from 'react';

interface AurexLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  textClassName?: string;
}

export const AurexLogo: React.FC<AurexLogoProps> = ({
  className = '',
  size = 36,
  withText = false,
  textClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* 
        AUREX Publication-Grade Architectural Emblem:
        An isometric continuous quantum prism forming the iconic 'A' nexus.
        Engineered with multi-stage specular lighting, faceted dimensional planes,
        and an internal illuminated core.
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_18px_rgba(212,249,56,0.35)]"
      >
        <defs>
          {/* Chromatic Vector Gradient - Ascent */}
          <linearGradient id="aurexAscentGrad" x1="18" y1="86" x2="50" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="35%" stopColor="#38EDFF" />
            <stop offset="70%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#D4F938" />
          </linearGradient>

          {/* Deep Isometric Facet - Descent */}
          <linearGradient id="aurexDescentGrad" x1="50" y1="12" x2="82" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4F938" />
            <stop offset="30%" stopColor="#059669" />
            <stop offset="75%" stopColor="#024D3E" />
            <stop offset="100%" stopColor="#012720" />
          </linearGradient>

          {/* Quantum Horizon Bridge */}
          <linearGradient id="aurexHorizonGrad" x1="28" y1="62" x2="72" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#D4F938" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Inner Light Core Diamond */}
          <linearGradient id="aurexCoreGrad" x1="50" y1="32" x2="50" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D4F938" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.1" />
          </linearGradient>

          {/* Specular Vertex Sheen */}
          <linearGradient id="aurexVertexSheen" x1="50" y1="12" x2="50" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Precision Housing Shield */}
        <polygon
          points="50,6 90,28 90,72 50,94 10,72 10,28"
          fill="#080A0E"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1.5"
        />

        {/* Ambient Darkened Under-Glow */}
        <polygon
          points="50,14 82,32 82,68 50,86 18,68 18,32"
          fill="#0C0F17"
        />

        {/* Left Kinetic Ascent Blade */}
        <path
          d="M50 14L18 80H34L50 46L66 80H82L50 14Z"
          fill="url(#aurexAscentGrad)"
        />

        {/* Right Dimensional Bevel Wing */}
        <path
          d="M50 14L82 80H66L50 46V14Z"
          fill="url(#aurexDescentGrad)"
        />

        {/* Floating Quantum Horizon Crossbar */}
        <polygon
          points="28,58 72,58 64,66 36,66"
          fill="url(#aurexHorizonGrad)"
        />

        {/* Central Quantum Singularity Light Core */}
        <polygon
          points="50,32 58,52 42,52"
          fill="url(#aurexCoreGrad)"
        />

        {/* Center Specular Ridge Line */}
        <line
          x1="50"
          y1="14"
          x2="50"
          y2="46"
          stroke="url(#aurexVertexSheen)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Precision Geometric Anchor Coordinates */}
        <circle cx="50" cy="14" r="2.5" fill="#FFFFFF" />
        <circle cx="18" cy="80" r="2" fill="#00E5FF" />
        <circle cx="82" cy="80" r="2" fill="#10B981" />
        <circle cx="50" cy="62" r="1.8" fill="#D4F938" />
      </svg>

      {/* Corporate Typography Wordmark */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-sans font-bold tracking-tight text-white leading-none ${textClassName || 'text-base'}`}>
              AUREX
            </span>
          </div>
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-0.5">
            Enterprise Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
