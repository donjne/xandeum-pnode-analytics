'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-sm text-muted-foreground">
          <p>© 2025 Xandeum Network. Built for pNode Analytics.</p>
          <div className="flex items-center gap-6">
            <Link href="https://docs.xandeum.network" target="_blank" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="https://github.com/Xandeum" target="_blank" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}