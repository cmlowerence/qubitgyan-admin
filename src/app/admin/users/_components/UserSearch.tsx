// src/app/admin/users/_components/UserSearch.tsx
import { Search } from 'lucide-react';

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      </div>
      <input 
        placeholder="Search directory by name, email, or role..." 
        className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}