'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  BarChart3,
  Bell,
  Calculator,
  GitCompare,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useNetworkStore } from '@/stores/networkStore';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Explore', href: '/explorer', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

const tools = [
  { name: 'Calculator', href: '/tools/calculator', icon: Calculator },
  { name: 'Compare', href: '/tools/compare', icon: GitCompare },
];

export function Navbar() {
  const pathname = usePathname();
  const { onlineCount, totalCount } = useNetworkStore();

  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="flex w-full justify-center">
        <div
          className={cn(
            'relative w-full transition-all duration-300 ease-out backdrop-blur-xl origin-center',
            scrolled
              ? 'mt-3 max-w-7xl rounded-2xl shadow-lg'
              : 'mt-0 max-w-full rounded-none',
            // LIGHT
            'bg-white text-black shadow-black/10',
            // DARK
            'dark:bg-[#0A0E27] dark:text-white dark:shadow-black/40'
          )}
        >
          <div
            className={cn(
              'flex h-16 items-center justify-between transition-all duration-300',
              scrolled ? 'px-6' : 'px-10 lg:px-16'
            )}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Xandeum" width={34} height={34} />
              <span className="text-lg font-semibold">Xandeum</span>

              {totalCount > 0 && (
                <div className="hidden md:flex items-center gap-2 ml-4 rounded-lg px-3 py-1.5 bg-black/5 dark:bg-white/10">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      onlineCount > 0 ? 'bg-emerald-500' : 'bg-gray-400'
                    )}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {onlineCount}/{totalCount} Online
                  </span>
                </div>
              )}
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors',
                    pathname === href
                      ? 'text-black dark:text-white'
                      : 'text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </Link>
              ))}

              {/* TOOLS */}
              <div className="relative">
                <button
                  onClick={() => setMobileToolsOpen((o) => !o)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors',
                    pathname.startsWith('/tools')
                      ? 'text-black dark:text-white'
                      : 'text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white'
                  )}
                >
                  <Calculator className="h-4 w-4" />
                  Tools
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform',
                      mobileToolsOpen && 'rotate-180'
                    )}
                  />
                </button>

                {mobileToolsOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl p-1 shadow-xl bg-white dark:bg-[#111633]">
                    {tools.map(({ name, href, icon: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        onClick={() => setMobileToolsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        <Icon className="h-4 w-4" />
                        {name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <ThemeToggle />
            </div>

            {/* MOBILE */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="relative h-8 w-8"
              >
                <span
                  className={cn(
                    'absolute left-1/2 top-2 h-0.5 w-6 -translate-x-1/2 transition-all bg-black dark:bg-white',
                    mobileOpen && 'top-4 rotate-45'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1/2 top-4 h-0.5 w-6 -translate-x-1/2 transition-all bg-black dark:bg-white',
                    mobileOpen && 'opacity-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1/2 top-6 h-0.5 w-6 -translate-x-1/2 transition-all bg-black dark:bg-white',
                    mobileOpen && 'top-4 -rotate-45'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cn(
          'absolute inset-x-0 top-full transition-all duration-300 lg:hidden',
          mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="mx-4 mt-3 rounded-2xl p-4 space-y-2 shadow-xl bg-white dark:bg-[#111633]">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}

          <div className="pt-2 border-t border-black/10 dark:border-white/10">
            {tools.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
