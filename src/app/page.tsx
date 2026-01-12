import { Logo } from "@/components/brand/Logo";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="text-slate-500 mb-8">System Status: <span className="text-green-500 font-bold">ONLINE</span></p>
      </div>

      <div className="relative flex flex-col place-items-center">
        <Logo className="scale-150 mb-10" />
        <h1 className="text-2xl font-bold text-slate-800 mt-4">Welcome Administrator</h1>
        <p className="text-slate-500 mt-2">The Knowledge Tree is ready for planting.</p>
        
        <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          Enter God Mode
        </button>
      </div>

      <div className="mt-20 p-8 border border-slate-200 rounded-lg bg-slate-50 text-center max-w-md">
        <h3 className="font-bold text-slate-900 mb-2">Check the Loader</h3>
        <p className="text-xs text-slate-500 mb-4">Refresh the page to see the custom animation.</p>
      </div>
    </main>
  );
}