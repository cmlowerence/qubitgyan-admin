// src/app/admin/tree/[nodeId]/_components/ErrorState.tsx
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export default function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="p-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 p-6 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">Folder Not Found</h2>
      <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs">{error}</p>
      <button onClick={onBack} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all">
        Go Back
      </button>
    </div>
  );
}
