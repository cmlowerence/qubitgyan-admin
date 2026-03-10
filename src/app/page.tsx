import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-amber-500/20 mix-blend-multiply blur-[80px] sm:blur-[120px] dark:bg-amber-500/10 dark:mix-blend-screen animate-in fade-in duration-1000" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-indigo-600/20 mix-blend-multiply blur-[80px] sm:blur-[120px] dark:bg-indigo-600/10 dark:mix-blend-screen animate-in fade-in duration-1000 delay-300" />
      </div>

      <div className="z-10 flex w-full max-w-[95%] sm:max-w-md md:max-w-lg flex-col items-center text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 p-8 sm:p-12 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 animate-in zoom-in-95 duration-700">
        
        <div className="mb-8 sm:mb-10 scale-[1.2] sm:scale-150 transition-transform duration-500 hover:scale-[1.3] sm:hover:scale-[1.6]">
          <Logo />
        </div>

        <div className="space-y-3 sm:space-y-4 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Welcome Administrator
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 max-w-[250px] sm:max-w-none mx-auto leading-relaxed tracking-wide">
            QubitGyan Knowledge Management System v1.0
          </p>
        </div>

        <Link href="/admin" className="w-full mt-8 sm:mt-12 block focus:outline-none rounded-2xl">
          <button className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-white px-6 py-4 sm:py-5 text-sm sm:text-base font-black text-white dark:text-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/10 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-900/30 dark:focus:ring-white/30 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2.5 tracking-wide">
              Enter God Mode
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </button>
        </Link>

        <div className="mt-8 sm:mt-10 w-full border-t border-slate-200/70 dark:border-slate-800/70 pt-6">
          <p className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Authorized Access Only. All actions are logged.
          </p>
        </div>
      </div>
    </main>
  );
}