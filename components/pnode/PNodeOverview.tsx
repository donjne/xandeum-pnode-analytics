'use client';

import { Server, HardDrive, Activity, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PNode } from '@/lib/types';
import { formatBytes, formatDuration, formatPercentage, formatNumber } from '@/lib/utils';

interface PNodeOverviewProps {
  node: PNode;
}

export function PNodeOverview({ node }: PNodeOverviewProps) {
  const stats = [
    {
      label: 'Storage Committed',
      value: formatBytes(node.storage_committed),
      icon: HardDrive,
      description: 'Total storage capacity',
    },
    {
      label: 'Storage Used',
      value: formatBytes(node.storage_used),
      icon: Server,
      description: 'Currently utilized',
    },
    {
      label: 'Uptime',
      value: formatDuration(node.uptime),
      icon: Activity,
      description: 'Time since last restart',
    },
    {
      label: 'Version',
      value: `v${node.version}`,
      icon: Zap,
      description: 'Software version',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Key metrics and statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick stats grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-start gap-3 rounded-lg border p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Storage utilization */}
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Storage Utilization</h4>
            <span className="text-sm font-medium">
              {formatPercentage(node.storage_usage_percent, 1)}
            </span>
          </div>
          <Progress value={node.storage_usage_percent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatBytes(node.storage_used)} used</span>
            <span>{formatBytes(node.storage_committed - node.storage_used)} free</span>
          </div>
        </div>

        {/* Additional details */}
        <div className="grid gap-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Public Address</span>
            <span className="font-mono text-sm">{node.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">RPC Port</span>
            <span className="font-mono text-sm">{node.rpc_port}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Public</span>
            <span className="text-sm">{node.is_public ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}