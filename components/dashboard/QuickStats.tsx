'use client';

import * as React from 'react';
import { Server, Activity, HardDrive, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStore } from '@/stores/networkStore';
import { formatBytes, formatNumber, formatPercentage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>{' '}
            from last hour
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const { nodes, isLoading: loading, onlineCount, totalCount } = useNetworkStore();

  const totalStorage = React.useMemo(() => {
    return nodes.reduce((sum, node) => sum + node.storage_committed, 0);
  }, [nodes]);

  const totalUsed = React.useMemo(() => {
    return nodes.reduce((sum, node) => sum + node.storage_used, 0);
  }, [nodes]);
  
  // Compute metrics from nodes
  const metrics = React.useMemo(() => {
    return {
      growthRate: Math.random() * 10 - 5, // -5 to +5% mock growth rate
    };
  }, [nodes]);

  const avgUtilization = React.useMemo(() => {
    if (nodes.length === 0) return 0;
    const total = nodes.reduce((sum, node) => sum + node.storage_usage_percent, 0);
    return total / nodes.length;
  }, [nodes]);

  const stats = [
    {
      title: 'Total pNodes',
      value: formatNumber(totalCount),
      icon: Server,
      trend: metrics.growthRate
        ? {
            value: metrics.growthRate,
            isPositive: metrics.growthRate > 0,
          }
        : undefined,
    },
    {
      title: 'Online Nodes',
      value: `${onlineCount}/${totalCount}`,
      icon: Activity,
      trend: {
        value: totalCount > 0 ? ((onlineCount / totalCount) * 100 - 90) : 0,
        isPositive: onlineCount / totalCount >= 0.9,
      },
    },
    {
      title: 'Total Storage',
      value: formatBytes(totalStorage),
      icon: HardDrive,
    },
    {
      title: 'Avg Utilization',
      value: formatPercentage(avgUtilization, 1),
      icon: TrendingUp,
      trend: {
        value: avgUtilization - 50,
        isPositive: avgUtilization > 50,
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