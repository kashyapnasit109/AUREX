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
        AUREX Bespoke Tri-Prism Quantum Glyph:
        An interlocking architectural isometric monolith formed by three converging kinetic vectors,
        featuring internal refractive gradients, specular highlights, and an illuminated quantum core.
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_14px_rgba(212,249,56,0.35)]"
      >
        <defs>
          {/* Primary Ascent Ribbon: Electric Hyper-Lime to Mint */}
          <linearGradient id="aurexAscent" x1="12" y1="56" x2="32" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#D4F938" />
          </linearGradient>

          {/* Deep Obsidian-Faceted Right Wing */}
          <linearGradient id="aurexDescent" x1="32" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4F938" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>

          {/* Floating Quantum Core Beam */}
          <linearGradient id="aurexQuantumBeam" x1="18" y1="40" x2="46" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#D4F938" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>

          {/* Inner Light Refraction Prism */}
          <linearGradient id="aurexInnerGlow" x1="32" y1="20" x2="32" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4F938" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.1" />
          </linearGradient>

          {/* Specular Edge Highlight */}
          <linearGradient id="specularGlint" x1="32" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Darkened Geometric Shield */}
        <polygon
          points="32,4 58,18 58,46 32,60 6,46 6,18"
          fill="#080A0E"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.2"
        />

        {/* Left Kinetic Ascent Blade */}
        <path
          d="M32 10L12 50H23L32 30L41 50H52L32 10Z"
          fill="url(#aurexAscent)"
        />

        {/* Right Faceted Volumetric Wing */}
        <path
          d="M32 10L52 50H41L32 30V10Z"
          fill="url(#aurexDescent)"
        />

        {/* Floating Refractive Quantum Horizon Crossbeam */}
        <polygon
          points="20,38 44,38 39,44 25,44"
          fill="url(#aurexQuantumBeam)"
        />

        {/* Central Quantum Singularity Core */}
        <polygon
          points="32,22 38,36 26,36"
          fill="url(#aurexInnerGlow)"
        />

        {/* Specular Vertex Edge Line */}
        <line
          x1="32"
          y1="10"
          x2="32"
          y2="30"
          stroke="url(#specularGlint)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Precision Coordinate Nodes */}
        <circle cx="32" cy="10" r="2" fill="#FFFFFF" />
        <circle cx="12" cy="50" r="1.8" fill="#00E5FF" />
        <circle cx="52" cy="50" r="1.8" fill="#10B981" />
        <circle cx="32" cy="41" r="1.5" fill="#D4F938" />
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
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
