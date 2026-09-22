'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 flex items-center justify-center mx-auto text-2xl font-serif font-black shadow-lg">
            P
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Prosify Service Exception</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A root service error occurred. You can attempt to refresh the application state without losing session data.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 px-4 bg-[#D4A017] text-neutral-950 font-bold rounded-xl text-xs hover:bg-[#F4C430] transition-colors cursor-pointer"
            >
              Reload Platform
            </button>
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-neutral-800 text-neutral-300 font-medium rounded-xl text-xs hover:bg-neutral-700 transition-colors text-center"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
