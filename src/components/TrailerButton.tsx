'use client';

import { useState } from 'react';
import TrailerModal from './TrailerModal';

export default function TrailerButton({ trailerKey }: { trailerKey: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-8 py-4 rounded-full glass-card hover:bg-black/10 dark:hover:bg-white/10 font-medium text-foreground transition-all"
      >
        Watch Trailer
      </button>
      
      <TrailerModal 
        trailerKey={trailerKey} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
