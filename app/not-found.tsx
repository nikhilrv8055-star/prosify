import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 flex items-center justify-center mx-auto text-2xl font-serif font-black shadow-lg">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Page Not Found</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block w-full py-2.5 px-4 bg-[#D4A017] text-neutral-950 font-bold rounded-xl text-xs hover:bg-[#F4C430] transition-colors text-center"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
