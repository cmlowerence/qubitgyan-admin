'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  // Variant is kept for interface compatibility but ignored for coloring
  variant?: 'light' | 'dark';
}

export function Logo({ className }: LogoProps) {
  // --- STATIC COLOR PALETTE (Universal visibility) ---
  const c = {
    // Deep Slate Blue: Looks good on white, provides base for glow on dark.
    primary: '#1E293B', 
    // Lighter, transparent version for background elements
    primaryTransparent: 'rgba(30, 41, 59, 0.08)',
    // Gold Gradients
    goldStart: '#FBBF24',
    goldEnd: '#B45309',
  };

  return (
    <div className={cn("select-none relative z-10 p-1", className)}>
      <svg
        width="170"
        height="48"
        viewBox="0 0 170 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block overflow-visible" // overflow-visible ensures glow isn't cut off
      >
        <defs>
          {/* The Quantum Gold Gradient */}
          <linearGradient id="goldGradStatic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.goldStart} />
            <stop offset="100%" stopColor={c.goldEnd} />
          </linearGradient>

          {/* THE UNIVERSAL VISIBILITY FILTER */}
          <filter id="universalGlow" x="-50%" y="-50%" width="200%" height="200%">
            {/* Layer 1: Tight Gold outline for definition */}
            <feDropShadow dx="0" dy="0" stdDeviation="0.5" floodColor={c.goldStart} floodOpacity="0.5" result="goldGlow"/>
            {/* Layer 2: Softer White halo to lift dark elements off dark backgrounds */}
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFFFFF" floodOpacity="0.8" in="goldGlow" result="finalGlow"/>
            <feMerge>
                <feMergeNode in="finalGlow" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Apply the universal glow to the entire logo group */}
        <g filter="url(#universalGlow)" transform="translate(2, 2)">
            
          {/* --- ICON: The Hex-Qubit Core --- */}
          <g>
            {/* Background Hexagon Structure */}
            <path
              d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0Z"
              fill={c.primaryTransparent}
              stroke={c.primary}
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            
            {/* The 'Q' Circuit Bracket - Bold and Solid */}
            <path
              d="M12 14C12 11.5 14.5 10 17 10H23C25.5 10 28 11.5 28 14V22H24V14H16V26H21V30H17C14.5 30 12 28.5 12 26V14Z"
              fill={c.primary}
            />

            {/* The Quantum Bit (Gold Core) */}
            <circle cx="28" cy="28" r="5" fill="url(#goldGradStatic)" />
            
            {/* The State Dot (Pure White for contrast against gold) */}
            <circle cx="28" cy="28" r="2" fill="#FFFFFF" />
          </g>

          {/* --- TYPOGRAPHY: Structural "QUBIT" --- */}
          {/* Pushed right to accommodate the wider glow */}
          <g transform="translate(52, 10)">
            {/* Q */}
            <path d="M10 0H6C2.7 0 0 2.7 0 6V14C0 17.3 2.7 20 6 20H10C13.3 20 16 17.3 16 14V13L18 15L21 12L17 8.8C17.6 8 18 7.1 18 6C18 2.7 15.3 0 12 0H10ZM10 6C10 8.2 8.2 10 6 10C3.8 10 2 8.2 2 6C2 3.8 3.8 2 6 2H10C12.2 2 14 3.8 14 6V8.8L11.2 11.6C10.8 11.2 10.4 10.8 10 10.4V6Z" fill={c.primary} />
            {/* U */}
            <path d="M26 0V13C26 16.9 29.1 20 33 20C36.9 20 40 16.9 40 13V0H34V13C34 13.6 33.6 14 33 14C32.4 14 32 13.6 32 13V0H26Z" fill={c.primary} />
            {/* B */}
            <path d="M46 0V20H53C56.9 20 60 16.9 60 13C60 10.6 58.8 8.6 56.9 7.3C58.2 6.3 59 4.8 59 3C59 1.3 57.7 0 56 0H46ZM52 5C53.1 5 54 5.9 54 7C54 8.1 53.1 9 52 9H50V5H52ZM52 14C53.1 14 54 14.9 54 16C54 17.1 53.1 18 52 18H50V14H52Z" fill={c.primary} />
            {/* I */}
            <path d="M66 0V20H72V0H66Z" fill={c.primary} />
            {/* T */}
            <path d="M78 0V5H82V20H88V5H92V0H78Z" fill={c.primary} />
          </g>

          {/* --- SUBTEXT: "GYAN" --- */}
          <g transform="translate(54, 37)">
            <text 
              fontSize="11" 
              fontWeight="900" 
              fontFamily="serif" 
              fill="url(#goldGradStatic)" 
              letterSpacing="0.3em"
              style={{ textTransform: 'uppercase' }}
            >
              ज्ञान
            </text>
            {/* Decorative gold underline bar */}
            <rect x="0" y="4" width="75" height="2" rx="1" fill="url(#goldGradStatic)" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
