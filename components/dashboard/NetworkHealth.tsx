'use client';

import * as React from 'react';
import { Activity, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

export function NetworkHealth() {
  const { nodes, onlineCount, totalCount, isLoading } = useNetworkStore();

  // Calculate health metrics from real data
  const healthMetrics = React.useMemo(() => {
    if (nodes.length === 0) {
      return {
        uptime: 0,
        avgStorage: 0,
        healthScore: 0,
        status: 'unknown' as const,
      };
    }

    // Calculate average uptime
    const totalUptime = nodes.reduce((sum, node) => sum + node.uptime, 0);
    const avgUptime = totalUptime / nodes.length;
    const uptimeHours = avgUptime / 3600;

    // Calculate storage health
    const avgStorageUsage = nodes.reduce((sum, node) => sum + node.storage_usage_percent, 0) / nodes.length;

    // Calculate overall health score
    const onlinePercentage = (onlineCount / totalCount) * 100;
    let healthScore = 0;
    
    // Score based on online percentage (0-40 points)
    healthScore += (onlinePercentage / 100) * 40;
    
    // Score based on uptime (0-30 points)
    const uptimeScore = Math.min((uptimeHours / 24) * 30, 30); // 24h uptime = full points
    healthScore += uptimeScore;
    
    // Score based on storage health (0-30 points)
    const storageScore = avgStorageUsage < 80 ? 30 : Math.max(0, 30 - (avgStorageUsage - 80) * 2);
    healthScore += storageScore;

    // Determine status
    let status: 'excellent' | 'good' | 'warning' | 'critical' | 'unknown';
    if (healthScore >= 85) status = 'excellent';
    else if (healthScore >= 70) status = 'good';
    else if (healthScore >= 50) status = 'warning';
    else status = 'critical';

    return {
      uptime: onlinePercentage,
      avgStorage: avgStorageUsage,
      healthScore: Math.round(healthScore),
      status,
    };
  }, [nodes, onlineCount, totalCount]);

  const statusConfig = {
    excellent: {
      label: 'Excellent',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 to-emerald-600/20',
    },
    good: {
      label: 'Good',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: Activity,
      gradient: 'from-blue-500/20 to-blue-600/20',
    },
    warning: {
      label: 'Warning',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      icon: AlertCircle,
      gradient: 'from-orange-500/20 to-orange-600/20',
    },
    critical: {
      label: 'Critical',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      icon: AlertCircle,
      gradient: 'from-red-500/20 to-red-600/20',
    },
    unknown: {
      label: 'Unknown',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30',
      icon: Activity,
      gradient: 'from-gray-500/20 to-gray-600/20',
    },
  };

  const config = statusConfig[healthMetrics.status];
  const StatusIcon = config.icon;

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <CardHeader>
          <CardTitle>Network Health</CardTitle>
          <CardDescription>Loading health metrics...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 animate-pulse bg-white/5 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        "bg-gradient-to-br backdrop-blur-sm",
        config.gradient
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Network Health
            </CardTitle>
            <CardDescription className="mt-1">Real-time network status</CardDescription>
          </div>
          <div className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5 font-medium text-sm transition-all duration-300",
            config.bgColor,
            config.borderColor,
            "border"
          )}>
            <StatusIcon className={cn("h-4 w-4", config.color)} />
            <span className={config.color}>{config.label}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Health Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl opacity-50",
              config.bgColor
            )} />
            
            {/* Score circle */}
            <div className={cn(
              "relative flex h-32 w-32 items-center justify-center rounded-full border-4 transition-all duration-500",
              config.borderColor,
              config.bgColor
            )}>
              <div className="text-center">
                <div className={cn(
                  "text-4xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                  "from-white to-white/60"
                )}>
                  {healthMetrics.healthScore}
                </div>
                <div className="text-xs text-white/60">Health Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {/* Network Uptime */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Network Uptime</span>
              <span className={cn("font-medium", config.color)}>
                {healthMetrics.uptime.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={healthMetrics.uptime} 
              className="h-2 bg-white/10"
            />
          </div>

          {/* Storage Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Avg Storage Usage</span>
              <span className={cn(
                "font-medium",
                healthMetrics.avgStorage < 70 ? 'text-emerald-400' :
                healthMetrics.avgStorage < 85 ? 'text-orange-400' :
                'text-red-400'
              )}>
                {healthMetrics.avgStorage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={healthMetrics.avgStorage} 
              className="h-2 bg-white/10"
            />
          </div>

          {/* Active Nodes */}
          <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 backdrop-blur-sm">
            <span className="text-sm text-white/80">Active Nodes</span>
            <span className="text-lg font-bold text-emerald-400">
              {onlineCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* Status message */}
        <div className={cn(
          "rounded-lg border p-3 text-sm backdrop-blur-sm",
          config.borderColor,
          config.bgColor
        )}>
          {healthMetrics.status === 'excellent' && (
            <p className="text-white/80">
              🎉 Network is operating at peak performance! All systems nominal.
            </p>
          )}
          {healthMetrics.status === 'good' && (
            <p className="text-white/80">
              ✅ Network is healthy and stable. Minor variations within normal range.
            </p>
          )}
          {healthMetrics.status === 'warning' && (
            <p className="text-white/80">
              ⚠️  Some nodes experiencing issues. Monitor network closely.
            </p>
          )}
          {healthMetrics.status === 'critical' && (
            <p className="text-white/80">
              🚨 Network health degraded. Immediate attention required.
            </p>
          )}
          {healthMetrics.status === 'unknown' && (
            <p className="text-white/80">
              ℹ️  No nodes detected. Waiting for network data...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}