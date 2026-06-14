'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [users, setUsers] = useState(14204);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCounter = () => {
      const now = Date.now();
      const timeWindow = Math.floor(now / 2500) * 2500;
      const dailyWave = Math.cos((timeWindow - 20 * 3600000) / 86400000 * Math.PI * 2) * 1000 + 1750;
      const macroNoise = Math.sin(timeWindow / 300000) * 150 + Math.cos(timeWindow / 900000) * 200;
      const microNoise = Math.sin(timeWindow / 10000) * 30 + Math.cos(timeWindow / 25000) * 45;
      const jitter = Math.sin(timeWindow) * 15;
      
      let currentCount = Math.floor(dailyWave + macroNoise + microNoise + jitter);
      currentCount = Math.max(500, Math.min(3000, currentCount));
      
      setUsers(currentCount);
    };
    
    updateCounter();
    const interval = setInterval(updateCounter, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zivox-bg/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1 font-display font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
          <span className="text-foreground">ZIV</span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-foreground border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="text-foreground">X</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-medium text-foreground">{users.toLocaleString()}</span>
            <span className="text-foreground/60 hidden sm:inline">streaming now</span>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full glass-card hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-black" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
