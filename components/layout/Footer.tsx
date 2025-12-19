'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="dark:bg-[#0A0E27]/85 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          © 2025 Xandeum Network
        </p>
        <div className="flex gap-6">
          <Link href="https://docs.xandeum.network" className="hover:text-black dark:hover:text-white">
            Docs
          </Link>
          <Link href="https://github.com/Xandeum" className="hover:text-black dark:hover:text-white">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
