'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { formatPercentage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function NetworkHealth() {
  const { nodes, isLoading: loading, onlineCount, totalCount } = useNetworkStore();

  // Compute metrics from nodes
  const metrics = React.useMemo(() => {
    if (nodes.length === 0) return {
      avgResponseTime: 0,
      networkUptime: 99.5,
      failedRequests: 0,
    };
    
    return {
      avgResponseTime: Math.floor(Math.random() * 100) + 50, // Mock value
      networkUptime: (onlineCount / totalCount) * 100,
      failedRequests: totalCount - onlineCount,
    };
  }, [nodes, onlineCount, totalCount]);

  const healthScore = React.useMemo(() => {
    if (nodes.length === 0) return 0;

    // Calculate based on:
    // - Online percentage (40%)
    // - Average storage utilization (30%)
    // - Version consistency (30%)

    const onlinePercent = (onlineCount / totalCount) * 100;
    const avgUtilization =
      nodes.reduce((sum, node) => sum + node.storage_usage_percent, 0) / nodes.length;

    // Version consistency - percentage running latest version
    const versions = nodes.map((n) => n.version);
    const latestVersion = versions.sort().reverse()[0];
    const latestCount = versions.filter((v) => v === latestVersion).length;
    const versionConsistency = (latestCount / totalCount) * 100;

    const score = onlinePercent * 0.4 + avgUtilization * 0.3 + versionConsistency * 0.3;
    return Math.round(score);
  }, [nodes, onlineCount, totalCount]);

  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-500', icon: CheckCircle2 };
    if (score >= 75) return { label: 'Good', color: 'text-blue-500', icon: Activity };
    if (score >= 60) return { label: 'Fair', color: 'text-yellow-500', icon: AlertTriangle };
    return { label: 'Poor', color: 'text-red-500', icon: XCircle };
  };

  const status = getHealthStatus(healthScore);
  const StatusIcon = status.icon;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Network Health</CardTitle>
          <CardDescription>Overall network status and performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Health</CardTitle>
        <CardDescription>Overall network status and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Health Score</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{healthScore}</p>
              <Badge variant="outline" className={status.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
          </div>
          <StatusIcon className={`h-12 w-12 ${status.color}`} />
        </div>

        <Progress value={healthScore} className="h-2" />

        {/* Metrics */}
        <div className="grid gap-4 pt-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">Online Nodes</span>
            <span className="font-medium">
              {formatPercentage((onlineCount / totalCount) * 100, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="font-medium">{metrics.avgResponseTime || 0}ms</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">Network Uptime</span>
            <span className="font-medium">
              {formatPercentage(metrics.networkUptime || 99.5, 2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Failed Requests</span>
            <span className="font-medium">{metrics.failedRequests || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}