import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  // Static Colors (Optimized for both light and dark backgrounds)
  const c = {
    gold: "#F59E0B",      // Amber/Gold
    goldLight: "#FCD34D", // Highlight Gold
    slate900: "#0F172A",  // Deep Navy/Slate (Visible on light)
    slate50: "#F8FAFC",   // Off-white (Reference)
    textPrimary: "#1E293B", // Deep Slate for "QUBIT"
    accent: "#6366F1"     // Indigo
  };

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
          {/* Static Gold Gradient */}
          <linearGradient id="staticGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.gold} />
            <stop offset="50%" stopColor={c.goldLight} />
            <stop offset="100%" stopColor={c.gold} />
          </linearGradient>

          {/* Static Text Gradient (Darker to ensure visibility) */}
          <linearGradient id="staticText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LEFT: THE QUBIT ICON --- */}
        <g transform="translate(4, 4)">
          <path 
            d="M20 2 A18 18 0 1 1 6.5 32.5" 
            stroke={c.gold} 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
          />
          <path 
            d="M20 12 V28 M20 28 L28 36" 
            stroke={c.textPrimary} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="4" fill={c.gold} filter="url(#glow)" />
          <circle cx="6.5" cy="32.5" r="2" fill={c.textPrimary} />
        </g>

        {/* --- RIGHT: TYPOGRAPHY (QUBIT) --- */}
        <g transform="translate(50, 14)">
          {/* Q */}
          <path 
            d="M8 0 H4 A4 4 0 0 0 0 4 V10 A4 4 0 0 0 4 14 H8 A4 4 0 0 0 12 10 V4 A4 4 0 0 0 8 0 Z M9 11 L13 15" 
            stroke={c.textPrimary} 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* U */}
          <path 
            d="M17 0 V10 A4 4 0 0 0 21 14 H24 A4 4 0 0 0 28 10 V0" 
            stroke={c.textPrimary} 
            strokeWidth="2.5" 
            fill="none"
          />

          {/* B */}
          <path 
            d="M33 0 V14 M33 0 H38 A3.5 3.5 0 0 1 38 7 H33 M33 14 H39 A3.5 3.5 0 0 0 39 7 H33" 
            stroke={c.textPrimary} 
            strokeWidth="2.5" 
            fill="none"
          />

          {/* I - Increased stroke width slightly for better visibility */}
          <path 
            d="M48 0 V14" 
            stroke={c.textPrimary} 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* T */}
          <path 
            d="M54 0 H64 M59 0 V14" 
            stroke={c.textPrimary} 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </g>

        {/* --- SUBTEXT: GYAN --- */}
        <text
          x="50"
          y="36"
          fontFamily="serif"
          fontWeight="bold"
          fontSize="11"
          letterSpacing="0.2em"
          fill="url(#staticGold)"
          style={{ textTransform: 'uppercase' }}
        >
          ज्ञान
        </text>
        
        <path 
          d="M85 33 H110" 
          stroke={c.gold} 
          strokeWidth="1.5" 
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
