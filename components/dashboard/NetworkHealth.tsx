'use client';

import * as React from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

export function NetworkHealth() {
  const { nodes, onlineCount, totalCount, isLoading } = useNetworkStore();

  const healthMetrics = React.useMemo(() => {
    if (nodes.length === 0) {
      return {
        uptime: 0,
        avgStorage: 0,
        healthScore: 0,
        status: 'unknown' as const,
      };
    }

    const avgUptime =
      nodes.reduce((sum, n) => sum + n.uptime, 0) / nodes.length / 3600;

    const avgStorage =
      nodes.reduce((sum, n) => sum + n.storage_usage_percent, 0) /
      nodes.length;

    const onlinePct = (onlineCount / totalCount) * 100;

    let score = 0;
    score += (onlinePct / 100) * 40;
    score += Math.min((avgUptime / 24) * 30, 30);
    score += avgStorage < 80 ? 30 : Math.max(0, 30 - (avgStorage - 80) * 2);

    let status: 'excellent' | 'good' | 'warning' | 'critical' | 'unknown';
    if (score >= 85) status = 'excellent';
    else if (score >= 70) status = 'good';
    else if (score >= 50) status = 'warning';
    else status = 'critical';

    return {
      uptime: onlinePct,
      avgStorage,
      healthScore: Math.round(score),
      status,
    };
  }, [nodes, onlineCount, totalCount]);

  const statusConfig = {
    excellent: {
      label: 'Excellent',
      color: 'text-emerald-500',
      ring: 'stroke-emerald-500',
      icon: CheckCircle2,
      message: 'Network is functioning at peak performance range.',
    },
    good: {
      label: 'Good',
      color: 'text-blue-500',
      ring: 'stroke-blue-500',
      icon: Activity,
      message: 'Network is healthy and stable.',
    },
    warning: {
      label: 'Warning',
      color: 'text-orange-500',
      ring: 'stroke-orange-500',
      icon: AlertCircle,
      message: 'Some nodes need attention.',
    },
    critical: {
      label: 'Critical',
      color: 'text-red-500',
      ring: 'stroke-red-500',
      icon: AlertCircle,
      message: 'Network health is degraded.',
    },
    unknown: {
      label: 'Unknown',
      color: 'text-slate-400',
      ring: 'stroke-slate-400',
      icon: Activity,
      message: 'Waiting for network data.',
    },
  };

  const config = statusConfig[healthMetrics.status];
  const StatusIcon = config.icon;

  if (isLoading) {
    return (
      <Card className="rounded-2xl bg-white shadow dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Network Health</CardTitle>
        </CardHeader>
        <CardContent className="h-48 animate-pulse bg-slate-100 dark:bg-white/5 rounded-xl" />
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border border-transparent',
        // light mode
        'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
        // dark mode separation (no white border)
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Network Health
        </CardTitle>

        <div
          className={cn(
            'flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
            'bg-slate-100 text-slate-700',
            'dark:bg-white/10 dark:text-white'
          )}
        >
          <StatusIcon className={cn('h-4 w-4', config.color)} />
          {config.label}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* HERO SCORE */}
        <div className="flex items-center justify-center">
          <div className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                strokeWidth="8"
                className="fill-none stroke-slate-200 dark:stroke-white/10"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={
                  2 * Math.PI * 64 * (1 - healthMetrics.healthScore / 100)
                }
                className={cn(
                  'fill-none transition-all duration-700',
                  config.ring
                )}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-semibold text-slate-900 dark:text-white">
                {healthMetrics.healthScore}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Health Score
              </div>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="space-y-4">
          <Metric
            label="Network Uptime"
            value={`${healthMetrics.uptime.toFixed(1)}%`}
            percent={healthMetrics.uptime}
            color={config.color}
          />

          <Metric
            label="Avg Storage Usage"
            value={`${healthMetrics.avgStorage.toFixed(1)}%`}
            percent={healthMetrics.avgStorage}
            color={
              healthMetrics.avgStorage < 70
                ? 'text-emerald-500'
                : healthMetrics.avgStorage < 85
                ? 'text-orange-500'
                : 'text-red-500'
            }
          />

          <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-white/5">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Active Nodes
            </span>
            <span className="text-lg font-semibold text-emerald-500">
              {onlineCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* STATUS MESSAGE */}
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-white/5 dark:text-white/80">
          {config.message}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------
   Metric Row
--------------------------------------------- */
function Metric({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className={cn('font-medium', color)}>{value}</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
