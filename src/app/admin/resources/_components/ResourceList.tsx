// src/app/admin/resources/_components/ResourceList.tsx
import { Loader2, Search } from 'lucide-react';
import { Resource } from '@/types/resource';
import { ResourceCard } from '@/components/resources/ResourceCard';

interface ResourceListProps {
  resources: Resource[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit: (resource: Resource) => void;
  onClearFilters: () => void;
}

export default function ResourceList({
  resources,
  isLoading,
  onDelete,
  onEdit,
  onClearFilters
}: ResourceListProps) {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Scanning database...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 mx-4 md:mx-0">
        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-bold">No resources found</h3>
        <p className="text-slate-500 text-sm mt-1 px-4">Try adjusting your filters or search terms.</p>
        <button 
          onClick={onClearFilters}
          className="mt-4 text-blue-600 text-sm font-bold hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((res) => (
        <ResourceCard 
          key={res.id} 
          resource={res} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
