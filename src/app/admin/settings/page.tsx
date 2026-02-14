// src/app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AlertModal } from '@/components/ui/dialogs';

// Import Dumb Components
import SettingsHeader from './_components/SettingsHeader';
import AppearanceSection from './_components/AppearanceSection';
import AccessibilitySection from './_components/AccessibilitySection';
import DiagnosticsSection from './_components/DiagnosticsSection';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  useEffect(() => {
    setMounted(true);
    const motionPref = localStorage.getItem('admin_reduced_motion') === 'true';
    setReducedMotion(motionPref);
  }, []);

  if (!mounted) return null;

  const handleMotionToggle = () => {
    const newState = !reducedMotion;
    setReducedMotion(newState);
    localStorage.setItem('admin_reduced_motion', String(newState));
    
    if (newState) document.documentElement.classList.add('reduce-motion');
    else document.documentElement.classList.remove('reduce-motion');
  };

  const handleClearCache = () => {
    localStorage.removeItem('admin_sidebar_open'); 
    window.location.reload();
  };

  const handleSimulateError = () => {
    setAlertState({
      open: true,
      title: "System Test",
      msg: "This is a test of the emergency alert system. If this were a real error, you would be panicking.",
      type: 'success'
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 space-y-8 animate-in fade-in duration-500">
      
      <SettingsHeader />

      <AppearanceSection 
        theme={theme} 
        onThemeChange={setTheme} 
      />

      <AccessibilitySection 
        reducedMotion={reducedMotion}
        onMotionToggle={handleMotionToggle}
        onClearCache={handleClearCache}
      />

      <DiagnosticsSection 
        onTestAlert={handleSimulateError} 
      />

      <AlertModal 
        isOpen={alertState.open}
        onClose={() => setAlertState(prev => ({ ...prev, open: false }))}
        title={alertState.title}
        message={alertState.msg}
        type={alertState.type}
      />
    </div>
  );
}
