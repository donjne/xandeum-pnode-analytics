'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
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
      {/* BACKDROP */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-xl bg-[#0A0E27]/70 dark:bg-[#0A0E27]/70 bg-white/70'
            : 'bg-[#0A0E27] dark:bg-[#0A0E27] bg-white'
        )}
      />

      {/* BAR */}
      <div
        className={cn(
          'relative mx-auto flex h-16 items-center justify-between px-6 transition-all duration-300',
          scrolled
            ? 'mt-3 max-w-7xl rounded-2xl shadow-lg shadow-black/20'
            : 'mt-0 max-w-full rounded-none'
        )}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Xandeum" width={34} height={34} />
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            Xandeum
          </span>

          {totalCount > 0 && (
            <div className="hidden md:flex items-center gap-2 ml-4 rounded-lg bg-blue-500/10 px-3 py-1.5">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  onlineCount > 0 ? 'bg-emerald-400' : 'bg-gray-400'
                )}
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {onlineCount}/{totalCount} Online
              </span>
            </div>
          )}
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-6">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition',
                pathname === href
                  ? 'text-white'
                  : 'text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="relative h-8 w-8"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                'absolute left-1/2 top-2 h-0.5 w-6 -translate-x-1/2 bg-current transition-all',
                mobileOpen && 'top-4 rotate-45'
              )}
            />
            <span
              className={cn(
                'absolute left-1/2 top-4 h-0.5 w-6 -translate-x-1/2 bg-current transition-all',
                mobileOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'absolute left-1/2 top-6 h-0.5 w-6 -translate-x-1/2 bg-current transition-all',
                mobileOpen && 'top-4 -rotate-45'
              )}
            />
          </button>
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
        <div className="mx-4 mt-3 rounded-2xl bg-[#111633]/95 dark:bg-[#111633]/95 bg-white/95 backdrop-blur-xl shadow-2xl p-4 space-y-2">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}

          {/* TOOLS */}
          <button
            onClick={() => setMobileToolsOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="flex items-center gap-3">
              <Calculator className="h-4 w-4" />
              Tools
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition',
                mobileToolsOpen && 'rotate-180'
              )}
            />
          </button>

          {mobileToolsOpen && (
            <div className="ml-6 space-y-1">
              {tools.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
