'use client';

import * as React from 'react';
import { Server, Activity, HardDrive, TrendingUp } from 'lucide-react';
import { useNetworkStore } from '@/stores/networkStore';
import { formatBytes, formatNumber, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* -----------------------------
   Low-level stat item
-------------------------------- */

function StatItem({
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
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'mt-1 flex h-7 w-7 items-center justify-center rounded-md',
          color
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tracking-tight">
          {value}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Glass surface group
-------------------------------- */

function StatGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6',
        'bg-[#0A0E27]/80',
        'backdrop-blur-xl',
        'shadow-lg shadow-black/20',
        'ring-1 ring-white/10'
      )}
    >
      {/* subtle top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="space-y-6">{children}</div>
    </div>
  );
}

/* -----------------------------
   QuickStats
-------------------------------- */

export function QuickStats() {
  const {
    nodes,
    isLoading,
    totalCount,
    onlineCount,
    totalStorage,
  } = useNetworkStore();

  const avgUtilization = React.useMemo(() => {
    if (nodes.length === 0) return 0;
    const total = nodes.reduce(
      (sum, n) => sum + n.storage_usage_percent,
      0
    );
    return total / nodes.length;
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        <StatGroup>
          <StatItem
            label="Total pNodes"
            value={formatNumber(totalCount)}
            icon={Server}
            color="bg-blue-600 text-white"
          />
          <StatItem
            label="Online Nodes"
            value={`${onlineCount}/${totalCount}`}
            icon={Activity}
            color="bg-emerald-600 text-white"
          />
        </StatGroup>

        <StatGroup>
          <StatItem
            label="Total Storage"
            value={formatBytes(totalStorage)}
            icon={HardDrive}
            color="bg-purple-600 text-white"
          />
          <StatItem
            label="Avg Utilization"
            value={formatPercentage(avgUtilization, 1)}
            icon={TrendingUp}
            color="bg-orange-600 text-white"
          />
        </StatGroup>
      </div>

      {/* Mobile carousel */}
      <div className="lg:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          <div className="min-w-[85%] snap-center">
            <StatGroup>
              <StatItem
                label="Total pNodes"
                value={formatNumber(totalCount)}
                icon={Server}
                color="bg-blue-600 text-white"
              />
              <StatItem
                label="Online Nodes"
                value={`${onlineCount}/${totalCount}`}
                icon={Activity}
                color="bg-emerald-600 text-white"
              />
            </StatGroup>
          </div>

          <div className="min-w-[85%] snap-center">
            <StatGroup>
              <StatItem
                label="Total Storage"
                value={formatBytes(totalStorage)}
                icon={HardDrive}
                color="bg-purple-600 text-white"
              />
              <StatItem
                label="Avg Utilization"
                value={formatPercentage(avgUtilization, 1)}
                icon={TrendingUp}
                color="bg-orange-600 text-white"
              />
            </StatGroup>
          </div>
        </div>
      </div>
    </>
  );
}
