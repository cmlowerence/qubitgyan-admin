// src/app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AlertModal } from '@/components/ui/dialogs';

import SettingsHeader from './_components/SettingsHeader';
import AppearanceSection from './_components/AppearanceSection';
import PreferencesSection from './_components/PreferencesSection';
import AccessibilitySection from './_components/AccessibilitySection';
import DiagnosticsSection from './_components/DiagnosticsSection';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  useEffect(() => {
    setMounted(true);
    const motionPref = localStorage.getItem('admin_reduced_motion') === 'true';
    const notifPref = localStorage.getItem('admin_notifications') !== 'false'; 
    const compactPref = localStorage.getItem('admin_compact_mode') === 'true';
    
    setReducedMotion(motionPref);
    setNotifications(notifPref);
    setCompactMode(compactPref);
  }, []);

  if (!mounted) return null;

  const handleMotionToggle = () => {
    const newState = !reducedMotion;
    setReducedMotion(newState);
    localStorage.setItem('admin_reduced_motion', String(newState));
    
    if (newState) document.documentElement.classList.add('reduce-motion');
    else document.documentElement.classList.remove('reduce-motion');
  };

  const handleNotificationsToggle = () => {
    const newState = !notifications;
    setNotifications(newState);
    localStorage.setItem('admin_notifications', String(newState));
  };

  const handleCompactModeToggle = () => {
    const newState = !compactMode;
    setCompactMode(newState);
    localStorage.setItem('admin_compact_mode', String(newState));
    
    if (newState) document.documentElement.classList.add('compact-ui');
    else document.documentElement.classList.remove('compact-ui');
  };

  const handleClearCache = () => {
    localStorage.removeItem('admin_sidebar_open'); 
    window.location.reload();
  };

  const handleSimulateError = () => {
    setAlertState({
      open: true,
      title: "System Diagnostic Test",
      msg: "This is a verified test of the emergency alert module. Component mounting, styling, and z-indexing are functioning nominally.",
      type: 'success'
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto pb-24 space-y-8 sm:space-y-12 animate-in fade-in duration-500">
      
      <SettingsHeader />

      <div className="grid grid-cols-1 gap-8 sm:gap-12">
        <AppearanceSection 
          theme={theme} 
          onThemeChange={setTheme} 
        />

        <PreferencesSection
          notifications={notifications}
          compactMode={compactMode}
          onNotificationsToggle={handleNotificationsToggle}
          onCompactModeToggle={handleCompactModeToggle}
        />

        <AccessibilitySection 
          reducedMotion={reducedMotion}
          onMotionToggle={handleMotionToggle}
          onClearCache={handleClearCache}
        />

        <DiagnosticsSection 
          onTestAlert={handleSimulateError} 
        />
      </div>

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