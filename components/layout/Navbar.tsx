'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Activity, Search, BarChart3, Bell, Calculator, GitCompare, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useNetworkStore } from '@/stores/networkStore';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Explore', href: '/explore', icon: Search },
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

  // Detect scroll for backdrop blur effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-sm' 
          : 'bg-background/95 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center transition-all duration-200 hover:opacity-80 hover:scale-105"
            >
              <Image 
                src="/logo.svg" 
                alt="Xandeum pNode Analytics"
                width={200} 
                height={48}
                className="h-9 w-auto"
                priority
              />
            </Link>
            
            <Badge 
              variant={onlineCount > 0 ? 'default' : 'secondary'} 
              className="hidden md:flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <span className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                onlineCount > 0 ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-400'
              )} />
              <span className="font-medium">{onlineCount}/{totalCount}</span>
              <span className="text-xs opacity-70">Online</span>
            </Badge>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Icon className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isActive && 'animate-pulse'
                  )} />
                  <span className="hidden lg:inline">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300" />
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
                  'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  toolsOpen || pathname.startsWith('/tools')
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Calculator className={cn(
                  'h-4 w-4 transition-all duration-200',
                  (toolsOpen || pathname.startsWith('/tools')) && 'animate-pulse'
                )} />
                <span className="hidden lg:inline">Tools</span>
                <ChevronDown className={cn(
                  'h-3 w-3 transition-transform duration-300',
                  toolsOpen && 'rotate-180'
                )} />
                
                {/* Active indicator */}
                {pathname.startsWith('/tools') && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300" />
                )}
              </button>
              
              {/* Dropdown Menu */}
              {toolsOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-popover/95 backdrop-blur-lg shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="p-1">
                    {toolsDropdown.map((tool, index) => {
                      const Icon = tool.icon;
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all duration-200',
                            'hover:scale-105 active:scale-95',
                            isActive 
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-muted'
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`
                          }}
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

            {/* Theme Toggle with animation */}
            <div className="ml-2 transition-all duration-200 hover:scale-110 active:scale-95">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}