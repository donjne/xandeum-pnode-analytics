'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Activity, Search, BarChart3, Bell, Calculator, GitCompare, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useNetworkStore } from '@/stores/networkStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Explore', href: '/explorer', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

const toolsDropdown = [
  { name: 'Calculator', href: '/tools/calculator', icon: Calculator },
  { name: 'Compare', href: '/tools/compare', icon: GitCompare },
];

export function Navbar() {
  const pathname = usePathname();
  const { onlineCount, totalCount } = useNetworkStore();
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        scrolled ? 'py-4' : 'py-2'
      )}
    >
      <div className={cn(
        'mx-auto transition-all duration-500 ease-in-out',
        scrolled ? 'max-w-6xl px-4' : 'max-w-full'
      )}>
        <div className={cn(
          'backdrop-blur-xl transition-all duration-500 ease-in-out',
          // Dark navy background from reference
          'bg-[#0A0E27]/90 dark:bg-[#0A0E27]/90',
          // NO BORDERS - removed completely
          'shadow-lg shadow-black/20',
          scrolled ? 'rounded-2xl' : 'rounded-none',
          'px-6 lg:px-8'
        )}>
          {/* Subtle gradient overlay like reference */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none rounded-inherit" />

          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center transition-all duration-200 hover:opacity-80 hover:scale-105"
              >
                <div className="relative h-10 w-32">
                  <Image 
                    src="https://static.wixstatic.com/media/ea731d_af14a4247e7f4b2c9ec3aaaccf5c6827~mv2.png"
                    alt="Xandeum"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              
              {/* Network Status - styled like reference */}
              {totalCount > 0 && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className={cn(
                    'h-2 w-2 rounded-full',
                    onlineCount > 0 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'
                  )} />
                  <span className="text-xs font-medium text-gray-300">
                    {onlineCount}/{totalCount} Online
                  </span>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                    
                    {/* Underline indicator instead of pulse */}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
              
              {/* Tools Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    toolsOpen || pathname.startsWith('/tools')
                      ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Calculator className="h-4 w-4" />
                  <span className="hidden lg:inline">Tools</span>
                  <ChevronDown className={cn(
                    'h-3 w-3 transition-transform duration-300',
                    toolsOpen && 'rotate-180'
                  )} />
                  
                  {pathname.startsWith('/tools') && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {toolsOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1A1F3A]/95 backdrop-blur-xl border border-blue-500/10 shadow-2xl overflow-hidden">
                    <div className="p-1">
                      {toolsDropdown.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                              isActive 
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
