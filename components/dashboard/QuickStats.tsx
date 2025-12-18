'use client';

import * as React from 'react';
import {
  Server,
  Activity,
  HardDrive,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Wifi,
} from 'lucide-react';
import { useNetworkStore } from '@/stores/networkStore';
import { formatBytes, formatNumber, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Small stat block (left-aligned content)
--------------------------------------------- */
function Stat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          color
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="mt-0.5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Glass / Card surface with right-side glow
--------------------------------------------- */
function StatSurface({
  glow,
  children,
}: {
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        // LIGHT MODE
        'bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]',
        // DARK MODE
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl dark:shadow-black/30',
        'transition-transform duration-300 ease-out',
        'hover:-translate-y-0.5'
      )}
    >
      {/* Right-side glow */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 w-1/2',
          glow
        )}
      />

      <div className="relative space-y-6">{children}</div>
    </div>
  );
}

/* ---------------------------------------------
   Desktop layout
--------------------------------------------- */
function DesktopStats() {
  const { nodes, totalCount, onlineCount, totalStorage } =
    useNetworkStore();

  const avgUtilization = React.useMemo(() => {
    if (!nodes.length) return 0;
    return (
      nodes.reduce((sum, n) => sum + n.storage_usage_percent, 0) /
      nodes.length
    );
  }, [nodes]);

  return (
    <div className="hidden lg:grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <StatSurface glow="bg-gradient-to-l from-blue-600/15 via-transparent to-transparent">
        <Stat
          label="Total pNodes"
          value={formatNumber(totalCount)}
          icon={Server}
          color="bg-blue-600"
        />
        <Stat
          label="Online Nodes"
          value={`${onlineCount}/${totalCount}`}
          icon={Wifi}
          color="bg-emerald-600"
        />
      </StatSurface>

      <StatSurface glow="bg-gradient-to-l from-purple-600/15 via-transparent to-transparent">
        <Stat
          label="Total Storage"
          value={formatBytes(totalStorage)}
          icon={HardDrive}
          color="bg-purple-600"
        />
        <Stat
          label="Avg Utilization"
          value={formatPercentage(avgUtilization, 1)}
          icon={TrendingUp}
          color="bg-orange-600"
        />
      </StatSurface>
    </div>
  );
}

/* ---------------------------------------------
   Mobile carousel
--------------------------------------------- */
function MobileCarousel() {
  const { nodes, totalCount, onlineCount, totalStorage } =
    useNetworkStore();

  const avgUtilization = React.useMemo(() => {
    if (!nodes.length) return 0;
    return (
      nodes.reduce((sum, n) => sum + n.storage_usage_percent, 0) /
      nodes.length
    );
  }, [nodes]);

  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const slides = [
    <StatSurface
      key="network"
      glow="bg-gradient-to-l from-blue-600/20 via-transparent to-transparent"
    >
      <Stat
        label="Total pNodes"
        value={formatNumber(totalCount)}
        icon={Server}
        color="bg-blue-600"
      />
      <Stat
        label="Online Nodes"
        value={`${onlineCount}/${totalCount}`}
        icon={Activity}
        color="bg-emerald-600"
      />
    </StatSurface>,

    <StatSurface
      key="storage"
      glow="bg-gradient-to-l from-purple-600/20 via-transparent to-transparent"
    >
      <Stat
        label="Total Storage"
        value={formatBytes(totalStorage)}
        icon={HardDrive}
        color="bg-purple-600"
      />
      <Stat
        label="Avg Utilization"
        value={formatPercentage(avgUtilization, 1)}
        icon={TrendingUp}
        color="bg-orange-600"
      />
    </StatSurface>,
  ];

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
  };

  React.useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  return (
    <div className="relative lg:hidden">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full px-1">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {/* <button
        onClick={() =>
          setIndex((i) => (i - 1 + slides.length) % slides.length)
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      <button
        onClick={() =>
          setIndex((i) => (i + 1) % slides.length)
        }
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button> */}
    </div>
  );
}

/* ---------------------------------------------
   QuickStats (export)
--------------------------------------------- */
export function QuickStats() {
  return (
    <section className="relative">
      <DesktopStats />
      <MobileCarousel />
    </section>
  );
}
