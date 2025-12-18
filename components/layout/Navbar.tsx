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
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useNetworkStore } from '@/stores/networkStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
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

  const toolsRef = React.useRef<HTMLDivElement>(null);

  // Scroll behavior
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close tools dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Backdrop layer */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-xl bg-[#0A0E27]/70 dark:bg-[#0A0E27]/70 bg-white/70'
            : 'bg-[#0A0E27] dark:bg-[#0A0E27] bg-white'
        )}
      />

      {/* Content layer */}
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-7xl items-center justify-between px-8 transition-all duration-300',
          scrolled
            ? 'mt-3 rounded-2xl shadow-lg shadow-black/20'
            : 'mt-0 rounded-none'
        )}
      >
        {/* LEFT — Logo + Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Xandeum"
            width={36}
            height={36}
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-white dark:text-white text-slate-900">
            Xandeum
          </span>

          {totalCount > 0 && (
            <div className="hidden md:flex items-center gap-2 ml-4 rounded-lg bg-blue-500/10 px-3 py-1.5">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  onlineCount > 0
                    ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                    : 'bg-gray-400'
                )}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {onlineCount}/{totalCount} Online
              </span>
            </div>
          )}
        </div>

        {/* RIGHT — Nav */}
        <div className="flex items-center gap-4">
          {navigation.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
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

          {/* TOOLS — CLICKABLE DROPDOWN */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen((o) => !o)}
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

            {/* Dropdown */}
            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#111633]/95 dark:bg-[#111633]/95 bg-white/90 backdrop-blur-xl shadow-2xl p-1">
                {tools.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition"
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
      </div>
    </nav>
  );
}
