import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  // Theme Constants
  const isDark = variant === 'dark';
  
  // Colors
  const c = {
    gold: "#F59E0B",
    goldLight: "#FCD34D",
    slate900: "#0F172A",
    slate800: "#1E293B",
    white: "#FFFFFF",
    accent: "#6366F1" // Indigo reference for the "Quantum" feel
  };

  const primaryFill = isDark ? "url(#gradLight)" : "url(#gradDark)";
  const subtextFill = "url(#gradGold)";

  return (
    <div className={cn("select-none", className)}>
      <svg 
        width="160" 
        height="48" 
        viewBox="0 0 160 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          {/* Gradient: Gold (Wisdom) */}
          <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.gold} />
            <stop offset="50%" stopColor={c.goldLight} />
            <stop offset="100%" stopColor={c.gold} />
          </linearGradient>

          {/* Gradient: Dark (Structure) */}
          <linearGradient id="gradDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.slate800} />
            <stop offset="100%" stopColor={c.slate900} />
          </linearGradient>

          {/* Gradient: Light (Structure for Dark Mode) */}
          <linearGradient id="gradLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.white} />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Glow Effect for the Core */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LEFT: THE QUBIT ICON --- */}
        <g transform="translate(4, 4)">
          {/* Outer Orbital Ring */}
          <path 
            d="M20 2 A18 18 0 1 1 6.5 32.5" 
            stroke={c.gold} 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner Quantum Circuit Line */}
          <path 
            d="M20 12 V28 M20 28 L28 36" 
            stroke={isDark ? c.white : c.slate900} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* The "Bit" Dot */}
          <circle cx="20" cy="20" r="4" fill={c.gold} filter="url(#glow)" />
          
          {/* Decorative Orbital Dot */}
          <circle cx="6.5" cy="32.5" r="2" fill={isDark ? c.white : c.slate900} />
        </g>

        {/* --- RIGHT: TYPOGRAPHY --- */}
        {/* Custom Constructed Geometric Text for "QUBIT" */}
        <g transform="translate(50, 14)">
          {/* Q */}
          <path 
            d="M8 0 H4 A4 4 0 0 0 0 4 V10 A4 4 0 0 0 4 14 H8 A4 4 0 0 0 12 10 V4 A4 4 0 0 0 8 0 Z M9 11 L13 15" 
            stroke={primaryFill} 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="square"
          />
          
          {/* U */}
          <path 
            d="M17 0 V10 A4 4 0 0 0 21 14 H24 A4 4 0 0 0 28 10 V0" 
            stroke={primaryFill} 
            strokeWidth="2.5" 
            fill="none"
          />

          {/* B */}
          <path 
            d="M33 0 V14 M33 0 H38 A3.5 3.5 0 0 1 38 7 H33 M33 14 H39 A3.5 3.5 0 0 0 39 7 H33" 
            stroke={primaryFill} 
            strokeWidth="2.5" 
            fill="none"
          />

          {/* I */}
          <path 
            d="M48 0 V14" 
            stroke={primaryFill} 
            strokeWidth="2.5" 
            strokeLinecap="square"
          />

          {/* T */}
          <path 
            d="M54 0 H64 M59 0 V14" 
            stroke={primaryFill} 
            strokeWidth="2.5" 
            strokeLinecap="square"
          />
        </g>

        {/* --- SUBTEXT: GYAN (Knowledge) --- */}
        {/* Using SVG Text for script complexity, but styled heavily */}
        <text
          x="50"
          y="36"
          fontFamily="serif"
          fontWeight="bold"
          fontSize="10"
          letterSpacing="0.2em"
          fill={subtextFill}
          style={{ textTransform: 'uppercase' }}
        >
          ज्ञान
        </text>
        
        {/* Decorative Line under text */}
        <path 
          d="M85 33 H105" 
          stroke={c.gold} 
          strokeWidth="1" 
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}
