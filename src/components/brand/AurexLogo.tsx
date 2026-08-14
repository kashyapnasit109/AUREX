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
        AUREX Apex Neural Monolith:
        A mathematically balanced isometric Möbius convergence prism representing:
        - Quantitative Alpha Stream (Electric Lime)
        - DataMart Ingestion Vector (Arctic Cyan)
        - Retail Intelligence Horizon (Emerald Core)
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_16px_rgba(212,249,56,0.3)]"
      >
        <defs>
          {/* Vector 1: Kinetic Ascent (Electric Lime to Mint) */}
          <linearGradient id="apexAscent" x1="16" y1="84" x2="50" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="40%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#D4F938" />
          </linearGradient>

          {/* Vector 2: Dimensional Facet (Hyper-Lime to Deep Jade) */}
          <linearGradient id="apexFacet" x1="50" y1="12" x2="84" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4F938" />
            <stop offset="35%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>

          {/* Vector 3: Quantum Horizon Crossbeam */}
          <linearGradient id="apexHorizon" x1="26" y1="58" x2="74" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#D4F938" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Central Singularity Prism */}
          <linearGradient id="apexCorePrism" x1="50" y1="28" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#D4F938" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.15" />
          </linearGradient>

          {/* Specular Vertex Light */}
          <linearGradient id="apexGlint" x1="50" y1="12" x2="50" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Precision Hexagonal Shield */}
        <polygon
          points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill="#080A0E"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1.5"
        />

        {/* Outer Continuous 'A' Monogram Ribbons */}
        {/* Left Ascent Blade */}
        <path
          d="M50 14L18 80H34L50 44L66 80H82L50 14Z"
          fill="url(#apexAscent)"
        />

        {/* Right Volumetric Bevel */}
        <path
          d="M50 14L82 80H66L50 44V14Z"
          fill="url(#apexFacet)"
        />

        {/* Floating Quantum Crossbar */}
        <polygon
          points="26,56 74,56 66,64 34,64"
          fill="url(#apexHorizon)"
        />

        {/* Illuminated Central Neural Core */}
        <polygon
          points="50,28 58,48 42,48"
          fill="url(#apexCorePrism)"
        />

        {/* Center Specular Glint Ridge */}
        <line
          x1="50"
          y1="14"
          x2="50"
          y2="44"
          stroke="url(#apexGlint)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Precision Geometric Telemetry Nodes */}
        <circle cx="50" cy="14" r="2.5" fill="#FFFFFF" />
        <circle cx="18" cy="80" r="2" fill="#00E5FF" />
        <circle cx="82" cy="80" r="2" fill="#10B981" />
        <circle cx="50" cy="60" r="1.8" fill="#D4F938" />
      </svg>

      {/* Corporate Typography Wordmark */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-sans font-extrabold tracking-tight text-white leading-none ${textClassName || 'text-base'}`}>
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
