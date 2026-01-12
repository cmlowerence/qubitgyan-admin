import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="mb-8 scale-150">
          <Logo />
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Administrator
          </h1>
          <p className="text-muted-foreground">
            QubitGyan Knowledge Management System v1.0
          </p>
        </div>

        {/* Action Button */}
        <Link href="/admin" className="w-full">
          <button className="w-full group relative flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
            Enter God Mode
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-xs text-muted-foreground">
            Authorized Access Only. All actions are logged.
          </p>
        </div>
      </div>
    </main>
  );
}
