import { brandConfig } from '@/src/config/brand';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Pulsing halo */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 animate-ping absolute inset-0" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] flex items-center justify-center text-neutral-950 font-serif font-black text-2xl shadow-xl">
          P
        </div>
      </div>
      <div className="space-y-2 text-center">
        <div className="h-4 w-32 bg-neutral-200 rounded-full mx-auto animate-pulse" />
        <div className="h-3 w-48 bg-neutral-100 rounded-full mx-auto animate-pulse" />
      </div>
      <span className="sr-only">Loading {brandConfig.name}...</span>
    </div>
  );
}
