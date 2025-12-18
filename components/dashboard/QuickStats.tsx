'use client';

import * as React from 'react';
import { Server, Activity, HardDrive, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStore } from '@/stores/networkStore';
import { formatBytes, formatNumber, formatPercentage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PNode } from '@/lib/types/pnode';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  gradient: string;
  iconColor: string;
}

function StatCard({ title, value, icon: Icon, trend, loading, gradient, iconColor }: StatCardProps) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-2 h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border transition-all duration-300 hover:scale-105 hover:shadow-xl",
        "bg-gradient-to-br backdrop-blur-sm",
        gradient
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <div className={cn(
          "rounded-full p-2 transition-all duration-300",
          iconColor
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span className={cn(
              "flex items-center gap-1 font-medium",
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            )}>
              <span className="text-base">{trend.isPositive ? '↑' : '↓'}</span>
              {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="text-white/50">from last hour</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Shimmer animation keyframes
const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;

export function QuickStats() {
  const { nodes, isLoading: loading, onlineCount, totalCount, totalStorage, usedStorage } = useNetworkStore();

  // Calculate average utilization from real nodes
  const avgUtilization = React.useMemo(() => {
    if (nodes.length === 0) return 0;
    const total = nodes.reduce((sum: number, node: PNode) => sum + node.storage_usage_percent, 0);
    return total / nodes.length;
  }, [nodes]);

  const stats = [
    {
      title: 'Total pNodes',
      value: formatNumber(totalCount),
      icon: Server,
      gradient: 'from-blue-500/20 to-blue-600/20 hover:shadow-blue-500/30',
      iconColor: 'bg-blue-500/20 text-blue-400',
      trend: undefined, // Can add historical comparison later
    },
    {
      title: 'Online Nodes',
      value: `${onlineCount}/${totalCount}`,
      icon: Activity,
      gradient: 'from-emerald-500/20 to-emerald-600/20 hover:shadow-emerald-500/30',
      iconColor: 'bg-emerald-500/20 text-emerald-400',
      trend: {
        value: totalCount > 0 ? ((onlineCount / totalCount) * 100) : 0,
        isPositive: totalCount > 0 && (onlineCount / totalCount) >= 0.8,
      },
    },
    {
      title: 'Total Storage',
      value: formatBytes(totalStorage),
      icon: HardDrive,
      gradient: 'from-purple-500/20 to-purple-600/20 hover:shadow-purple-500/30',
      iconColor: 'bg-purple-500/20 text-purple-400',
      trend: undefined,
    },
    {
      title: 'Avg Utilization',
      value: formatPercentage(avgUtilization, 1),
      icon: TrendingUp,
      gradient: 'from-orange-500/20 to-orange-600/20 hover:shadow-orange-500/30',
      iconColor: 'bg-orange-500/20 text-orange-400',
      trend: {
        value: avgUtilization,
        isPositive: avgUtilization < 80, // Under 80% is good
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} loading={loading} />
      ))}
    </div>
  );
}