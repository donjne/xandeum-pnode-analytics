'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Server,
  Activity,
  FileText,
  Settings,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  GitCompare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Nodes', href: '/nodes', icon: Server },
  { name: 'Analytics', href: '/analytics', icon: FileText },
];

const toolsNavigation = [
  { name: 'Alerts', href: '/alerts', icon: AlertCircle },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
  { name: 'Compare', href: '/compare', icon: GitCompare },
];

const bottomNavigation = [{ name: 'Settings', href: '/settings', icon: Settings }];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();

  const NavSection = ({
    items,
    title,
  }: {
    items: typeof mainNavigation;
    title?: string;
  }) => (
    <div className="space-y-1">
      {title && !collapsed && (
        <p className="px-3 text-xs font-medium text-muted-foreground">{title}</p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <NavSection items={mainNavigation} />
        <Separator />
        <NavSection items={toolsNavigation} title={collapsed ? undefined : 'Tools'} />
      </div>

      <div className="border-t p-4">
        <NavSection items={bottomNavigation} />
        <Separator className="my-4" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => onCollapsedChange?.(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}