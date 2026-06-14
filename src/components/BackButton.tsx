'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-xl hover:bg-black/40 dark:hover:bg-white/20 transition-all text-foreground shadow-xl border border-black/10 dark:border-white/10 group ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}
