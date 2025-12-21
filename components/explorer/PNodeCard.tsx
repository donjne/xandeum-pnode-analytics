'use client';

import Link from 'next/link';
import {
  Server,
  HardDrive,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PNode } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { TimeAgo } from '@/components/shared/TimeAgo';
import {
  formatBytes,
  formatDuration,
  calculateHealthScore,
  getHealthCategory,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PNodeCardProps {
  node: PNode;
}

export function PNodeCard({ node }: PNodeCardProps) {
  const now = Math.floor(Date.now() / 1000);
  const isOnline = now - node.last_seen_timestamp < 120;

  const healthScore = calculateHealthScore(node);
  const healthCategory = getHealthCategory(healthScore);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-transparent',
        // light mode
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]',
        // dark mode
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
        'transition-all duration-300 hover:-translate-y-0.5'
      )}
    >
      {/* subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* HEADER */}
      <CardHeader className="relative pb-3 space-y-3">
        {/* Status + Action */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <StatusBadge status={isOnline ? 'online' : 'offline'} />
          </div>

          <Link href={`/explorer/${node.pubkey}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-70 hover:opacity-100"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Pubkey */}
        <div className="space-y-1">
          <TruncatedText
            text={node.pubkey}
            maxLength={10}
            className="font-mono text-sm"
          />
        </div>

        {/* Health */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Health score
          </span>
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
            className="px-2"
          >
            {healthScore}
          </Badge>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="relative space-y-4">
        {/* Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Storage</span>
            </div>
            <span className="font-medium">
              {formatBytes(node.storage_used)} /{' '}
              {formatBytes(node.storage_committed)}
            </span>
          </div>

          <Progress
            value={node.storage_usage_percent}
            className="h-2"
          />

          <div className="text-xs text-muted-foreground text-right">
            {node.storage_usage_percent.toFixed(1)}% used
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Uptime</span>
          </div>
          <span className="font-medium">
            {formatDuration(node.uptime)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-black/5 dark:border-white/10 pt-3 space-y-2">
          {/* Version */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Version</span>
            <Badge variant="outline" className="text-xs">
              v{node.version}
            </Badge>
          </div>

          {/* Last Seen */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last seen</span>
            <TimeAgo
              timestamp={node.last_seen_timestamp}
              showTooltip={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
