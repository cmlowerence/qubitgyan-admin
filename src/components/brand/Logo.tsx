'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // Kept for prop compatibility, but ignored for static colors
}

export function Logo({ className }: LogoProps) {
  // --- STATIC BRAND COLORS ---
  const colors = {
    navy: '#0F172A',         // High-contrast Navy for text
    goldLight: '#FCD34D',    // Bright Gold
    goldMid: '#F59E0B',      // Standard Gold
    goldDeep: '#B45309',     // Rich Bronze/Gold
    glowColor: '#FFFFFF',    // White halo for visibility on dark backgrounds
  };

  return (
    <div className={cn("select-none relative z-10 p-1", className)}>
      <svg
        width="220"
        height="60"
        viewBox="0 0 220 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block overflow-visible"
      >
        <defs>
          {/* 1. Liquid Gold Gradient for the Shield */}
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.goldLight} />
            <stop offset="50%" stopColor={colors.goldMid} />
            <stop offset="100%" stopColor={colors.goldDeep} />
          </linearGradient>

          {/* 2. Universal Visibility Filter (The Glow) */}
          {/* This creates a subtle white halo around the logo so it pops on dark sidebars */}
          <filter id="universalVisibility" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={colors.glowColor} floodOpacity="0.7"/>
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
          </filter>

          {/* 3. Gold Bevel Effect for the Shield */}
          <filter id="bevel">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="20" lightingColor="#FFFFFF" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
          </filter>
        </defs>

        {/* Apply the universal glow to the entire group */}
        <g filter="url(#universalVisibility)">
          
          {/* --- ICON: THE GOLDEN SHIELD --- */}
          <g transform="translate(5, 5)">
            {/* Outer Shield Border */}
            <path
              d="M25 2 L46 9 C46 9 49 38 25 53 C 1 38 4 9 4 9 L25 2 Z"
              fill="url(#shieldGradient)"
              stroke={colors.goldDeep}
              strokeWidth="1"
              filter="url(#bevel)"
            />
            
            {/* Inner Shield Detail */}
            <path
              d="M25 6 L41 12 C41 12 43 34 25 47 C 7 34 9 12 9 12 L25 6 Z"
              fill="none"
              stroke={colors.goldLight}
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />

            {/* Brain/Intellect Icon (Top) */}
            <path 
              d="M25 12 C23.5 12 22.5 13 22 14 C20.5 13.5 19 14 19 15.5 C19 17 20.5 18 22 17.5 C22.5 18.5 23.5 19 25 19 C26.5 19 27.5 18.5 28 17.5 C29.5 18 31 17 31 15.5 C31 14 29.5 13.5 28 14 C27.5 13 26.5 12 25 12 Z" 
              fill={colors.goldDeep} 
              opacity="0.9"
            />

            {/* Central Globe */}
            <circle cx="25" cy="29" r="7.5" stroke={colors.goldDeep} strokeWidth="1" fill="none" />
            <ellipse cx="25" cy="29" rx="7.5" ry="2.5" stroke={colors.goldDeep} strokeWidth="0.8" />
            <ellipse cx="25" cy="29" rx="2.5" ry="7.5" stroke={colors.goldDeep} strokeWidth="0.8" />

            {/* Circuit Line Connections */}
            <g stroke={colors.goldDeep} strokeWidth="1" strokeLinecap="round">
              <path d="M14 18 L18 22 M36 18 L32 22" />
              <path d="M14 40 L19 35 M36 40 L31 35" />
              {/* Nodes */}
              <circle cx="14" cy="18" r="1.5" fill={colors.goldDeep} stroke="none" />
              <circle cx="36" cy="18" r="1.5" fill={colors.goldDeep} stroke="none" />
              <circle cx="14" cy="40" r="1.5" fill={colors.goldDeep} stroke="none" />
              <circle cx="36" cy="40" r="1.5" fill={colors.goldDeep} stroke="none" />
            </g>
          </g>

          {/* --- TEXT: QUBIT GYAN --- */}
          <g transform="translate(62, 38)">
            {/* Qubit Text */}
            <text
              fontFamily="sans-serif"
              fontWeight="800"
              fontSize="32"
              fill={colors.navy}
              style={{ letterSpacing: '-0.02em' }}
            >
              Qubit
            </text>
            
            {/* ज्ञान Text (Hindi) */}
            <text
              x="92" 
              fontFamily="sans-serif"
              fontWeight="800"
              fontSize="32"
              fill={colors.navy}
            >
              ज्ञान
            </text>

            {/* Subtle Gold accent line under "Gyan" */}
            <rect x="92" y="5" width="65" height="3" rx="1.5" fill="url(#shieldGradient)" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}
