"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        An error occurred while loading this page. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium transition-colors shadow-sm"
      >
        Try again
      </button>
    </div>
  );
}
