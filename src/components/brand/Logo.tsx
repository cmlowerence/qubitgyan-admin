import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  // Brand Colors
  const quantumBlue = "#0F172A";
  const knowledgeGold = "#F59E0B"; 

  const textColor = variant === 'light' ? quantumBlue : "#F8FAFC";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* ICON */}
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <circle cx="40" cy="40" r="30" stroke={knowledgeGold} strokeWidth="6" strokeOpacity="0.2" />
        <path d="M40 10C56.5685 10 70 23.4315 70 40" stroke={knowledgeGold} strokeWidth="6" strokeLinecap="round" />
        <path d="M40 70C23.4315 70 10 56.5685 10 40" stroke={knowledgeGold} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="40" r="8" fill={knowledgeGold} />
      </svg>
      
      {/* TEXT */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-widest" style={{ color: textColor }}>
          QUBIT
        </span>
        <span className="text-sm font-serif font-bold tracking-wider" style={{ color: knowledgeGold }}>
          ज्ञान
        </span>
      </div>
    </div>
  );
}