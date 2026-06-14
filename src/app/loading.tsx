export default function Loading() {
  return (
    <main className="min-h-screen bg-zivox-bg pb-20 pt-32">
      {/* Hero Skeleton */}
      <div className="absolute inset-0 w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-black/20 animate-pulse z-0" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-20">
        <div className="flex flex-col md:flex-row gap-8 mt-[15vh] md:mt-[25vh]">
          {/* Poster Skeleton */}
          <div className="w-40 md:w-56 lg:w-64 aspect-[2/3] rounded-2xl bg-white/5 animate-pulse hidden sm:block flex-shrink-0" />
          
          {/* Text Skeleton */}
          <div className="flex-1 space-y-4 pt-8">
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-12 w-3/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
            
            <div className="space-y-2 mt-8">
              <div className="h-4 w-full max-w-2xl bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-full max-w-xl bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-full max-w-lg bg-white/5 rounded animate-pulse" />
            </div>

            <div className="flex gap-4 mt-8">
              <div className="h-12 w-48 rounded-full bg-white/5 animate-pulse" />
              <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Cast Skeleton */}
        <div className="mt-20 space-y-6">
          <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-none w-32 md:w-40 space-y-3">
                <div className="w-full aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
