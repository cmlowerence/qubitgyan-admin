// 'use client';

// import { useEffect, useState } from 'react';
// import { getKnowledgeTree } from '@/services/tree'; // The service we just made
// import { KnowledgeNode } from '@/types/tree';       // The types we just made
// import { FolderTree, Loader2, AlertCircle } from 'lucide-react';

// export default function TreeManagementPage() {
//   const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 1. Fetch Data on Load
//   useEffect(() => {
//     loadTreeData();
//   }, []);

//   const loadTreeData = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getKnowledgeTree();
//       setNodes(data);
//       setError(null);
//     } catch (err: any) {
//       console.error("Failed to fetch tree:", err);
//       setError(err.message || 'Failed to load knowledge tree');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <FolderTree className="w-6 h-6 text-blue-600" />
//             Knowledge Tree
//           </h1>
//           <p className="text-gray-500">Manage your domains, subjects, and topics.</p>
//         </div>
//         <button 
//             onClick={loadTreeData}
//             className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
//         >
//             Refresh Data
//         </button>
//       </div>

//       {/* ERROR STATE */}
//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
//           <AlertCircle className="w-5 h-5" />
//           {error}
//         </div>
//       )}

//       {/* LOADING STATE */}
//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//         </div>
//       ) : (
//         /* SUCCESS STATE */
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* Left: Visualization (We will put your Dumb Tree here later) */}
//           <div className="border rounded-lg p-4 bg-white shadow-sm min-h-[400px]">
//             <h2 className="font-semibold mb-4">Tree Visualization</h2>
//             {nodes.length === 0 ? (
//               <p className="text-gray-400 text-center mt-10">No nodes found. Database is empty.</p>
//             ) : (
//               <div className="space-y-2">
//                 {/* Temporary List to prove it works */}
//                 {nodes.map((node) => (
//                   <div key={node.id} className="p-2 border rounded hover:bg-gray-50">
//                     <span className="font-medium">{node.name}</span>
//                     <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                       {node.node_type}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right: Debug View (Raw JSON) - REMOVE LATER */}
//           <div className="border rounded-lg p-4 bg-slate-900 text-slate-50 font-mono text-xs overflow-auto max-h-[500px]">
//             <h2 className="font-semibold mb-2 text-slate-400">Backend Response (Debug)</h2>
//             <pre>{JSON.stringify(nodes, null, 2)}</pre>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { getKnowledgeTree } from '@/services/tree';
import { KnowledgeNode } from '@/types/tree';
import { FolderTree, Loader2, AlertCircle } from 'lucide-react';

export default function TreeManagementPage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      const data = await getKnowledgeTree();
      
      // CRASH FIX: Ensure data is actually an Array before saving
      if (Array.isArray(data)) {
        setNodes(data);
        setError(null);
      } else {
        console.error("Invalid data format received:", data);
        setNodes([]); // Fallback to empty list so app doesn't crash
        setError('Server returned invalid data. Check console for details.');
      }
    } catch (err: any) {
      console.error("Failed to fetch tree:", err);
      setError(err.message || 'Failed to load knowledge tree');
      setNodes([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-blue-600" />
            Knowledge Tree
          </h1>
          <p className="text-gray-500">Manage your domains, subjects, and topics.</p>
        </div>
        <button 
            onClick={loadTreeData}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
            Refresh Data
        </button>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* SUCCESS STATE - Only render if NO error */
        !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border rounded-lg p-4 bg-white shadow-sm min-h-[400px]">
              <h2 className="font-semibold mb-4">Tree Visualization</h2>
              {nodes.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  No nodes found. Database is empty.
                </p>
              ) : (
                <div className="space-y-2">
                  {nodes.map((node) => (
                    <div key={node.id} className="p-2 border rounded hover:bg-gray-50 flex justify-between">
                      <span className="font-medium">{node.name}</span>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {node.node_type}
                        </span>
                        {node.thumbnail_url && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Img
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Debug View */}
            <div className="border rounded-lg p-4 bg-slate-900 text-slate-50 font-mono text-xs overflow-auto max-h-[500px]">
              <h2 className="font-semibold mb-2 text-slate-400">Backend Response</h2>
              <pre>{JSON.stringify(nodes, null, 2)}</pre>
            </div>
          </div>
        )
      )}
    </div>
  );
}
