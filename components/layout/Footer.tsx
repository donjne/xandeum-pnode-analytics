'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-blue-500/10 bg-[#0A0E27]/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-sm">
          <p className="text-gray-400">
            © 2025 Xandeum Network. Built for pNode Analytics.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="https://docs.xandeum.network" 
              target="_blank" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Documentation
            </Link>
            <Link 
              href="https://github.com/Xandeum" 
              target="_blank" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}