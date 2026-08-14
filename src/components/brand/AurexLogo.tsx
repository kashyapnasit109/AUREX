import React from 'react';

interface AurexLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  textClassName?: string;
}

export const AurexLogo: React.FC<AurexLogoProps> = ({
  className = '',
  size = 32,
  withText = false,
  textClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* 
        AUREX Architectural Monogram:
        A bespoke, precision-crafted isometric ribbon forming the continuous 'A' prism.
        Clean, authoritative, minimal — free of stock clipart or AI cliches.
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Main Primary Ascent: Electric Lime */}
          <linearGradient id="aurexPrimaryGrad" x1="8" y1="36" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#D4F938" />
          </linearGradient>

          {/* Secondary Facet: Deep Obsidian Slate */}
          <linearGradient id="aurexFacetGrad" x1="20" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4F938" />
            <stop offset="40%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Precision Cross-Bridge: Arctic Cyan Horizon */}
          <linearGradient id="aurexBridgeGrad" x1="12" y1="25" x2="28" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#D4F938" />
          </linearGradient>
        </defs>

        {/* Left Ascent Beam */}
        <path
          d="M20 4L7 34H14L20 18L26 34H33L20 4Z"
          fill="url(#aurexPrimaryGrad)"
        />

        {/* Right Architectural Facet with Specular Edge */}
        <path
          d="M20 4L33 34H26L20 18V4Z"
          fill="url(#aurexFacetGrad)"
        />

        {/* Floating Internal Horizon Crossbar */}
        <path
          d="M12 25H28V28.5H12V25Z"
          fill="url(#aurexBridgeGrad)"
        />

        {/* Apex Telemetry Coordinate */}
        <circle cx="20" cy="4" r="1.5" fill="#FFFFFF" />
      </svg>

      {/* Corporate Typography Wordmark */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-sans font-extrabold tracking-tight text-white leading-none ${textClassName || 'text-base'}`}>
              AUREX
            </span>
          </div>
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-0.5">
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
