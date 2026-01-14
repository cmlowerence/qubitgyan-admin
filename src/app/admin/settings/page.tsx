'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  Monitor, 
  Moon, 
  Sun, 
  Smartphone, 
  Zap, 
  RefreshCcw, 
  Trash2,
  CheckCircle2,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { AlertModal } from '@/components/ui/dialogs';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Alert State
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; msg: string; type: 'success'|'danger' }>({
    open: false, title: '', msg: '', type: 'success'
  });

  // Hydration fix
  useEffect(() => {
    setMounted(true);
    // Check local storage for preferences
    const motionPref = localStorage.getItem('admin_reduced_motion') === 'true';
    setReducedMotion(motionPref);
  }, []);

  if (!mounted) return null;

  // --- Handlers ---

  const handleMotionToggle = () => {
    const newState = !reducedMotion;
    setReducedMotion(newState);
    localStorage.setItem('admin_reduced_motion', String(newState));
    
    // Apply class to document for global CSS usage
    if (newState) document.documentElement.classList.add('reduce-motion');
    else document.documentElement.classList.remove('reduce-motion');
  };

  const handleClearCache = () => {
    // Clear Local Storage (except critical auth/theme tokens if specific keys exist)
    // For now, we simulate a deep refresh
    localStorage.removeItem('admin_sidebar_open'); // Example
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
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Settings className="w-8 h-8 text-slate-600 dark:text-slate-300" />
          </div>
          System Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 ml-14">
          Customize the look and feel of your Admin Panel.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Monitor className="w-5 h-5" /> Appearance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Mode */}
          <button 
            onClick={() => setTheme('light')}
            className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-slate-400'}`} />
              {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Light Mode</h3>
            <p className="text-xs text-slate-500 mt-1">Clean, high contrast.</p>
          </button>

          {/* Dark Mode */}
          <button 
            onClick={() => setTheme('dark')}
            className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
              theme === 'dark' 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-500' : 'text-slate-400'}`} />
              {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Dark Mode</h3>
            <p className="text-xs text-slate-500 mt-1">Easy on the eyes.</p>
          </button>

          {/* System Mode */}
          <button 
            onClick={() => setTheme('system')}
            className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
              theme === 'system' 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Smartphone className={`w-6 h-6 ${theme === 'system' ? 'text-emerald-500' : 'text-slate-400'}`} />
              {theme === 'system' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">System</h3>
            <p className="text-xs text-slate-500 mt-1">Matches your device.</p>
          </button>
        </div>
      </section>

      {/* 2. Accessibility / Utilities */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Zap className="w-5 h-5" /> Accessibility & Performance
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* Reduced Motion Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Reduced Motion</h4>
              <p className="text-sm text-slate-500">Disable complex animations for a faster feel.</p>
            </div>
            <button 
              onClick={handleMotionToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                reducedMotion ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out mt-1 ml-1 ${
                reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Hard Refresh */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Clear Cache & Reload</h4>
              <p className="text-sm text-slate-500">Fixes UI glitches by clearing local state.</p>
            </div>
            <button 
              onClick={handleClearCache}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Reload App
            </button>
          </div>
        </div>
      </section>

      {/* 3. Debug Zone */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Diagnostics
        </h2>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Alert System Test</h4>
            <p className="text-sm text-slate-500">Verify that popups and modals are working correctly.</p>
          </div>
          <button 
            onClick={handleSimulateError}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Test Alert
          </button>
        </div>
        
        <div className="flex justify-center pt-8">
           <p className="text-xs font-mono text-slate-400">Admin Panel v0.1.0 • Build 2026.01.14</p>
        </div>
      </section>

      {/* Reused Alert Modal */}
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
