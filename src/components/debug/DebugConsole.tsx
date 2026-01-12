'use client';

import React from 'react';

interface DebugConsoleProps {
  error: any;
}

export default function DebugConsole({ error }: DebugConsoleProps) {
  if (!error) return null;

  return (
    <div className="mt-8 p-4 bg-black text-green-400 font-mono text-xs rounded-lg overflow-hidden break-all border-2 border-red-500 shadow-2xl">
      <h3 className="text-white font-bold mb-2 border-b border-gray-700 pb-1 flex justify-between">
        <span>🐞 DEBUG CONSOLE</span>
        <span className="text-red-500 animate-pulse">ERROR DETECTED</span>
      </h3>
      
      <div className="space-y-2">
        <p><strong className="text-yellow-400">Target URL:</strong> {error.targetUrl || "Undefined"}</p>
        <p><strong className="text-yellow-400">Error Name:</strong> {error.name}</p>
        <p><strong className="text-yellow-400">Message:</strong> {error.message}</p>
        
        {error.status && (
          <p className="bg-red-900/30 p-1 rounded inline-block">
            <strong className="text-yellow-400">HTTP Status:</strong> {error.status} {error.statusText}
          </p>
        )}

        {error.responseData && (
          <div className="mt-2 pt-2 border-t border-gray-800 opacity-90">
            <strong className="text-yellow-400 block mb-1">Server Response Body:</strong>
            <pre className="whitespace-pre-wrap bg-gray-900 p-2 rounded text-[10px] max-h-40 overflow-auto custom-scrollbar">
              {JSON.stringify(error.responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
