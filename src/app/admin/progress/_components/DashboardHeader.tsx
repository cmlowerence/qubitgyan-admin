import { BarChart3 } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 bg-green-50 rounded-2xl">
        <BarChart3 className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-800">Student Progress</h1>
        <p className="text-sm text-slate-500 font-medium">Real-time content completion tracking.</p>
      </div>
    </div>
  );
}
