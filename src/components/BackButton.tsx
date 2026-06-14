'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-24 left-6 md:left-12 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors text-white text-sm font-medium shadow-lg"
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
