'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Activity,
  LayoutDashboard,
  Search,
  BarChart3,
  Bell,
  Calculator,
  GitCompare,
  ChevronDown,
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
  const [toolsOpen, setToolsOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* FULL-WIDTH BACKGROUND */}
      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'backdrop-blur-xl shadow-lg'
            : 'backdrop-blur-0',
          // Dark mode
          'dark:bg-[#0A0E27]/85',
          // Light mode
          'bg-white/80'
        )}
      >
        {/* CONSTRAINED CONTENT */}
        <div
          className={cn(
            'mx-auto flex h-16 max-w-7xl items-center justify-between px-6 transition-all duration-300',
            scrolled && 'mt-2 rounded-2xl'
          )}
        >
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <Link href="/" className="relative h-9 w-28">
              <Image
                src="https://static.wixstatic.com/media/ea731d_af14a4247e7f4b2c9ec3aaaccf5c6827~mv2.png"
                alt="Xandeum"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {totalCount > 0 && (
              <div className="hidden md:flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    onlineCount > 0
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                      : 'bg-gray-400'
                  )}
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {onlineCount}/{totalCount} Online
                </span>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            {navigation.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
                    active
                      ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                      : 'text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{name}</span>
                </Link>
              );
            })}

            {/* TOOLS */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
                  toolsOpen || pathname.startsWith('/tools')
                    ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                    : 'text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden lg:inline">Tools</span>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    toolsOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={cn(
                  'absolute right-0 mt-2 w-48 rounded-xl p-1 shadow-2xl backdrop-blur-xl transition-all',
                  toolsOpen
                    ? 'opacity-100 scale-100'
                    : 'pointer-events-none opacity-0 scale-95',
                  'bg-[#111633]/95 dark:bg-[#111633]/95 bg-white/90'
                )}
              >
                {tools.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition"
                  >
                    <Icon className="h-4 w-4" />
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
