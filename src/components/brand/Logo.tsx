'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  const isDark = variant === 'dark';

  // Color Palettes for Theming
  const colors = {
    gold: {
      start: isDark ? '#FCD34D' : '#F59E0B', // Lighter gold in dark mode for glow
      end: isDark ? '#F59E0B' : '#D97706',   // Richer gold in dark mode
    },
    primary: {
      start: isDark ? '#FFFFFF' : '#0F172A', // White in dark mode, Navy in light
      end: isDark ? '#E2E8F0' : '#334155',   // Light gray in dark, Slate in light
    },
    accent: '#F59E0B', // Solid gold accent
  };

  return (
    <div className={cn("select-none", className)}>
      <svg
        width="180"
        height="50"
        viewBox="0 0 180 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          {/* Gold Gradient for "ज्ञान" and Icon Accents */}
          <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.gold.start} />
            <stop offset="100%" stopColor={colors.gold.end} />
          </linearGradient>

          {/* Primary Gradient for "QUBIT" and Icon Structure (Adapts to theme) */}
          <linearGradient id="gradPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary.start} />
            <stop offset="100%" stopColor={colors.primary.end} />
          </linearGradient>

          {/* Soft Glow Filter for the Quantum Core */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- ICON: THE QUANTUM CORE --- */}
        <g transform="translate(2, 2)">
          {/* Outer Magnetic Trap Rings */}
          <path
            d="M23 46C35.7025 46 46 35.7025 46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7025 10.2975 46 23 46Z"
            stroke="url(#gradPrimary)"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeDasharray="8 4"
            opacity="0.6"
          />
          <path
            d="M23 40C32.3888 40 40 32.3888 40 23C40 13.6112 32.3888 6 23 6C13.6112 6 6 13.6112 6 23C6 32.3888 13.6112 40 23 40Z"
            stroke="url(#gradGold)"
            strokeWidth="2.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />

          {/* Inner Circuitry & Qubit */}
          <path
            d="M23 14V32"
            stroke="url(#gradPrimary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 23H30"
            stroke="url(#gradPrimary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* The Glowing Qubit */}
          <circle cx="23" cy="23" r="5" fill={colors.accent} filter="url(#glow)" />
          <circle cx="23" cy="23" r="2.5" fill="#FFFFFF" />
        </g>

        {/* --- TYPOGRAPHY: STRUCTURAL "QUBIT" --- */}
        <g transform="translate(60, 12)" fill="url(#gradPrimary)">
          {/* Q */}
          <path d="M14.5 0C6.5 0 0 6.5 0 14.5C0 22.5 6.5 29 14.5 29C18.5 29 22.1 27.4 24.7 24.7L28.3 28.3L31.1 25.5L27.5 21.9C30.2 19.3 31.8 15.7 31.8 11.7C31.8 5.2 26.6 0 20.1 0H14.5ZM14.5 4H20.1C24.3 4 27.8 7.5 27.8 11.7C27.8 15.9 24.3 19.4 20.1 19.4H14.5C10.3 19.4 6.8 15.9 6.8 11.7C6.8 7.5 10.3 4 14.5 4Z" />
          {/* U */}
          <path d="M36 0V18.5C36 23.7 40.3 28 45.5 28C50.7 28 55 23.7 55 18.5V0H49V18.5C49 20.4 47.4 22 45.5 22C43.6 22 42 20.4 42 18.5V0H36Z" />
          {/* B */}
          <path d="M60 0V28H71.5C77.8 28 83 22.8 83 16.5C83 12.3 80.8 8.6 77.5 6.5C79.6 4.8 81 2.5 81 0H60ZM66 4H71.5C73.7 4 75.5 5.8 75.5 8C75.5 10.2 73.7 12 71.5 12H66V4ZM66 16H71.5C74.5 16 77 18.5 77 21.5C77 24.5 74.5 27 71.5 27H66V16Z" />
          {/* I */}
          <path d="M88 0V28H94V0H88Z" />
          {/* T */}
          <path d="M99 0V4H107V28H113V4H121V0H99Z" />
        </g>

        {/* --- SUBTEXT: "ज्ञान" --- */}
        <text
          x="62"
          y="45"
          fontFamily="serif"
          fontWeight="800"
          fontSize="12"
          letterSpacing="0.1em"
          fill="url(#gradGold)"
        >
          ज्ञान
        </text>
      </svg>
    </div>
  );
}
