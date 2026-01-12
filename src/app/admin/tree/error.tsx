'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Also log to console for remote debugging if connected
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 bg-red-50 min-h-screen text-red-900 font-mono text-sm overflow-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">💥 Mobile Crash Report</h2>
      
      {/* 1. The Main Error Message */}
      <div className="mb-4 p-4 bg-white border border-red-200 rounded">
        <strong className="block text-xs uppercase tracking-wide text-red-400 mb-1">Error Message:</strong>
        {error.message || "Unknown Error"}
      </div>

      {/* 2. The Stack Trace (Line numbers!) */}
      {error.stack && (
        <div className="mb-4 p-4 bg-white border border-red-200 rounded whitespace-pre-wrap break-all text-xs">
            <strong className="block text-xs uppercase tracking-wide text-red-400 mb-1">Stack Trace:</strong>
            {error.stack}
        </div>
      )}

      {/* 3. Reset Button */}
      <button
        onClick={() => reset()}
        className="w-full py-3 bg-red-600 text-white font-bold rounded shadow active:scale-95 transition-transform"
      >
        Try Again
      </button>
    </div>
  );
}
