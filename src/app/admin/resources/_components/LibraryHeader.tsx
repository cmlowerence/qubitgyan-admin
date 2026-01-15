import { LibraryBig } from 'lucide-react';

interface LibraryHeaderProps {
  totalCount: number;
}

export default function LibraryHeader({ totalCount }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <LibraryBig className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          Global Library
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 max-w-xl leading-relaxed">
          Search and manage your entire content database from one command center.
        </p>
      </div>
      
      <div className="flex items-center md:block gap-3 md:text-right bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
        <span className="text-2xl md:text-3xl font-black text-slate-800">{totalCount}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-0 md:block">
          Visible Files
        </span>
      </div>
    </div>
  );
}
