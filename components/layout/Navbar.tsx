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
  Menu,
  X,
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
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = React.useState(false);

  const toolsRef = React.useRef<HTMLDivElement>(null);

  // Scroll behavior
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close desktop tools on outside click
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
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-xl bg-[#0A0E27]/70 dark:bg-[#0A0E27]/70 bg-white/70'
            : 'bg-[#0A0E27] dark:bg-[#0A0E27] bg-white'
        )}
      />

      {/* Content */}
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 transition-all duration-300',
          scrolled ? 'mt-3 rounded-2xl shadow-lg shadow-black/20' : ''
        )}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Xandeum" width={36} height={36} />
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            Xandeum
          </span>

          {totalCount > 0 && (
            <div className="hidden md:flex items-center gap-2 ml-3 rounded-lg bg-blue-500/10 px-3 py-1.5">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  onlineCount > 0 ? 'bg-emerald-400' : 'bg-gray-400'
                )}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {onlineCount}/{totalCount} Online
              </span>
            </div>
          )}
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-4">
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
                {name}
              </Link>
            );
          })}

          {/* Desktop Tools */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setToolsOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white"
            >
              <Calculator className="h-4 w-4" />
              Tools
              <ChevronDown
                className={cn('h-3 w-3 transition', toolsOpen && 'rotate-180')}
              />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#111633]/95 dark:bg-[#111633]/95 bg-white/90 backdrop-blur-xl shadow-2xl p-1">
                {tools.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5"
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

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="absolute right-4 top-4 w-[90%] max-w-sm rounded-2xl bg-[#111633]/95 dark:bg-[#111633]/95 bg-white/95 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-2">
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

              {/* Mobile Tools */}
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
        </div>
      )}
    </nav>
  );
}
