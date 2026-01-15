'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  // If the parent doesn't specify, we default to 'light' (Dark Text)
  // You can pass variant="dark" manually if you are on a black background.
  const isDark = variant === 'dark';

  const colors = {
    // Light Mode: Text is Slate-900 (Black-ish)
    // Dark Mode: Text is White
    text: isDark ? '#FFFFFF' : '#0F172A',
    
    // Icon: Slightly lighter than text to create depth
    iconMain: isDark ? '#F8FAFC' : '#1E293B',
    
    // The "Knowledge" Gold
    gold: '#F59E0B',
  };

  return (
    <div className={cn("select-none relative z-10", className)}>
      <svg
        width="160" // Increased width to prevent cutting off
        height="45"
        viewBox="0 0 160 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* --- ICON GROUP --- */}
        <g transform="translate(0, 2)">
          {/* Hexagon Background - Increased Opacity for visibility */}
          <path
            d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0Z"
            fill={colors.iconMain}
            opacity={isDark ? "0.2" : "0.1"} 
          />
          
          {/* Circuit Bracket */}
          <path
            d="M12 14C12 11.5 14.5 10 17 10H23C25.5 10 28 11.5 28 14V22H24V14H16V26H21V30H17C14.5 30 12 28.5 12 26V14Z"
            fill={colors.iconMain}
          />

          {/* Gold Core */}
          <circle cx="28" cy="28" r="5" fill="url(#goldGradient)" />
          <circle cx="28" cy="28" r="2" fill="#FFF" />
        </g>

        {/* --- TEXT GROUP --- */}
        {/* Pushed X to 55 to fix overlapping with icon */}
        <g transform="translate(55, 10)">
          {/* Q */}
          <path d="M8 0H4C1.8 0 0 1.8 0 4V16C0 18.2 1.8 20 4 20H8C10.2 20 12 18.2 12 16V13L15 16H19L15 12C15.6 11.2 16 10.1 16 9V4C16 1.8 14.2 0 12 0H8ZM12 9C12 10.1 11.1 11 10 11H6C4.9 11 4 10.1 4 9V4C4 2.9 4.9 2 6 2H10C11.1 2 12 2.9 12 4V9Z" fill={colors.text} />
          
          {/* U */}
          <path d="M21 0V14C21 17.3 23.7 20 27 20C30.3 20 33 17.3 33 14V0H29V14C29 15.1 28.1 16 27 16C25.9 16 25 15.1 25 14V0H21Z" fill={colors.text} />

          {/* B */}
          <path d="M38 0V20H46C49.3 20 52 17.3 52 14C52 11.8 50.8 9.9 49 8.9C50.2 8.2 51 6.9 51 5.5C51 2.5 48.5 0 45.5 0H38ZM42 4H45.5C46.3 4 47 4.7 47 5.5C47 6.3 46.3 7 45.5 7H42V4ZM42 11H46C47.7 11 49 12.3 49 14C49 15.7 47.7 17 46 17H42V11Z" fill={colors.text} />

          {/* I */}
          <path d="M57 0V20H61V0H57Z" fill={colors.text} />

          {/* T */}
          <path d="M66 0V4H70V20H74V4H78V0H66Z" fill={colors.text} />
        </g>

        {/* --- SUBTEXT "GYAN" --- */}
        {/* Aligned with new text position */}
        <g transform="translate(56, 36)">
          <text 
            fontSize="10" 
            fontWeight="bold" 
            fontFamily="serif" 
            fill={colors.gold} 
            letterSpacing="0.25em"
            style={{ textTransform: 'uppercase' }}
          >
            ज्ञान
          </text>
          <rect x="0" y="3" width="70" height="1.5" rx="0.75" fill={colors.gold} opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
