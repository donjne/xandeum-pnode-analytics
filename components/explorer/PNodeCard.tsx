import * as React from 'react';
import Link from 'next/link';
import { Server, HardDrive, Activity, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PNode } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { TimeAgo } from '@/components/shared/TimeAgo';
import { formatBytes, formatDuration, calculateHealthScore, getHealthCategory } from '@/lib/utils';

interface PNodeCardProps {
  node: PNode;
}

export function PNodeCard({ node }: PNodeCardProps) {
  const now = Math.floor(Date.now() / 1000);
  const isOnline = now - node.last_seen_timestamp < 120;
  const healthScore = calculateHealthScore(node);
  const healthCategory = getHealthCategory(healthScore);

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-3 pb-3">
        {/* Header: Status and Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <StatusBadge status={isOnline ? 'online' : 'offline'} />
          </div>
          <Link href={`/nodes/${node.pubkey}`}>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Pubkey */}
        <TruncatedText text={node.pubkey} maxLength={8} />

        {/* Health Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Health</span>
          <Badge
            variant={
              healthCategory === 'excellent'
                ? 'success'
                : healthCategory === 'good'
                  ? 'default'
                  : healthCategory === 'fair'
                    ? 'warning'
                    : 'destructive'
            }
          >
            {healthScore}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Storage</span>
            </div>
            <span className="font-medium">
              {formatBytes(node.storage_used)} / {formatBytes(node.storage_committed)}
            </span>
          </div>
          <Progress value={node.storage_usage_percent} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {node.storage_usage_percent.toFixed(1)}% used
          </p>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Uptime</span>
          </div>
          <span className="font-medium">{formatDuration(node.uptime)}</span>
        </div>

        {/* Version and Last Seen */}
        <div className="space-y-1 border-t pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Version</span>
            <Badge variant="outline">{node.version}</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last seen</span>
            <TimeAgo timestamp={node.last_seen_timestamp} showTooltip={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
