'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

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
    <main className="min-h-screen bg-zivox-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="font-display font-bold text-2xl text-foreground mb-3">
          Connection Lost
        </h1>
        
        <p className="text-foreground/60 text-sm mb-8">
          We encountered an issue fetching the cinematic data. The cosmic connection might be unstable right now.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white/5 hover:bg-white/10 text-foreground font-medium transition-colors border border-white/5"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
