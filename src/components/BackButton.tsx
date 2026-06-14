'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors text-foreground text-sm font-medium shadow-lg w-fit ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
