// src/app/login/_components/LoginForm.tsx
import { Lock, Mail, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-100 dark:border-slate-800">
        
        <div className="bg-slate-900 dark:bg-black p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">QubitGyan Admin</h1>
            <p className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase">Secure Gateway</p>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
          {error && (
            <div className={`p-4 rounded-xl text-sm flex items-start gap-3 border animate-in slide-in-from-top-2 fade-in duration-300 ${
              error.includes("Restricted") 
                ? "bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
                : "bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
            }`}>
              {error.includes("Restricted") ? (
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <span className="font-bold leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 dark:text-slate-100 placeholder:font-medium placeholder:text-slate-400"
                required
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 dark:text-slate-100 placeholder:font-medium placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full group relative flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 text-sm sm:text-base overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}