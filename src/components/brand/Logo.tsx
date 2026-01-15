'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // Variant is kept for interface compatibility but ignored for this specific design
}

export function Logo({ className }: LogoProps) {
  // Static Color Palette
  const c = {
    text: '#0F172A', // Dark navy blue for text
    goldStart: '#FBBF24', // Brighter gold
    goldEnd: '#B45309',   // Darker gold for gradient
    goldStroke: '#D97706', // Stroke color for definition
  };

  return (
    <div className={cn("select-none relative z-10 inline-flex items-center", className)}>
      <svg
        width="200" // Adjusted width for icon + text
        height="60" // Adjusted height
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block overflow-visible"
      >
        <defs>
          {/* Golden Gradient for the shield icon */}
          <linearGradient id="goldGradIcon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.goldStart} />
            <stop offset="30%" stopColor={c.goldStart} />
            <stop offset="100%" stopColor={c.goldEnd} />
          </linearGradient>
          
          {/* Inner glow for the shield */}
          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
            <feFlood floodColor={c.goldStart} floodOpacity="0.8" result="flood" />
            <feComposite in="flood" in2="offsetBlur" operator="in" result="composite" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="composite" />
            </feMerge>
          </filter>
        </defs>

        {/* --- ICON: The Golden Shield --- */}
        <g transform="translate(5, 5) scale(0.9)">
          {/* Main Shield Body */}
          <path
            d="M25 1 L45 8 C45 8 48 35 25 48 C 2 35 5 8 5 8 L25 1 Z"
            fill="url(#goldGradIcon)"
            stroke={c.goldStroke}
            strokeWidth="1.5"
            filter="url(#innerGlow)"
          />
          
          {/* Inner Border & Circuitry */}
          <g fill="none" stroke={c.goldStroke} strokeWidth="1">
            {/* Inner Shield outline */}
            <path d="M25 5 L41 11 C41 11 43 32 25 43 C 7 32 9 11 9 11 L25 5 Z" />
            
            {/* Brain/Cloud Icon */}
            <path d="M25 13 C23 13 22 14 21 15 C19 14 17 15 17 17 C17 19 19 20 21 19 C22 20 23 19 25 19 C27 19 28 20 29 19 C31 20 33 19 33 17 C33 15 31 14 29 15 C28 14 27 13 25 13 Z" fill="url(#goldGradIcon)" stroke="none" />
            
            {/* Globe */}
            <circle cx="25" cy="28" r="7" />
            <ellipse cx="25" cy="28" rx="7" ry="3" />
            <line x1="25" y1="21" x2="25" y2="35" />
            <line x1="18" y1="28" x2="32" y2="28" />
            
            {/* Circuit Lines and Nodes */}
            <circle cx="14" cy="20" r="1.5" fill="url(#goldGradIcon)" stroke="none" />
            <circle cx="36" cy="20" r="1.5" fill="url(#goldGradIcon)" stroke="none" />
            <circle cx="16" cy="36" r="1.5" fill="url(#goldGradIcon)" stroke="none" />
            <circle cx="34" cy="36" r="1.5" fill="url(#goldGradIcon)" stroke="none" />
            <line x1="21" y1="17" x2="14" y2="20" />
            <line x1="29" y1="17" x2="36" y2="20" />
            <path d="M14 20 L14 28 L18 28" />
            <path d="M36 20 L36 28 L32 28" />
            <path d="M25 35 L25 38" />
            <line x1="16" y1="36" x2="22" y2="33" />
            <line x1="34" y1="36" x2="28" y2="33" />
          </g>
        </g>

        {/* --- TEXT: "Qubit ज्ञान" --- */}
        <g transform="translate(60, 40)">
          <text
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="34"
            fill={c.text}
            style={{ letterSpacing: '0.02em' }}
          >
            Qubit
          </text>
          <text
            x="95" // Position for the Hindi text
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="34"
            fill={c.text}
            style={{ letterSpacing: '0.02em' }}
          >
            ज्ञान
          </text>
        </g>
      </svg>
    </div>
  );
}
