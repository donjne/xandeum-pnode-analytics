'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PNode } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { TimeAgo } from '@/components/shared/TimeAgo';
import {
  formatBytes,
  formatDuration,
  calculateHealthScore,
  getHealthCategory,
  formatPercentage,
} from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PNodeTableProps {
  nodes: PNode[];
  loading?: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export function PNodeTable({
  nodes,
  loading = false,
  onSort,
  sortField,
}: PNodeTableProps) {
  const now = Math.floor(Date.now() / 1000);

  if (loading) {
    return <LoadingSpinner text="Loading pNodes..." />;
  }

  if (!nodes || nodes.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No pNodes found"
        description="Try adjusting your search or filters"
      />
    );
  }

  const SortButton = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort?.(field)}
      className={cn(
        'h-8 gap-1 px-2 text-muted-foreground',
        sortField === field && 'text-foreground'
      )}
    >
      {children}
      <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
    </Button>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        // light mode
        'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
        // dark mode (NO white border)
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted/40">
            <TableHead className="w-[56px]">Status</TableHead>
            <TableHead>
              {onSort ? <SortButton field="pubkey">Pubkey</SortButton> : 'Pubkey'}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton field="health">Health</SortButton> : 'Health'}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton field="storage">Storage</SortButton> : 'Storage'}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton field="uptime">Uptime</SortButton> : 'Uptime'}
            </TableHead>
            <TableHead>
              {onSort ? <SortButton field="version">Version</SortButton> : 'Version'}
            </TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead className="w-[56px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {nodes.map((node) => {
            const isOnline = now - node.last_seen_timestamp < 120;
            const healthScore = calculateHealthScore(node);
            const healthCategory = getHealthCategory(healthScore);

            return (
              <TableRow
                key={node.pubkey}
                className={cn(
                  'group transition-colors',
                  'hover:bg-muted/40 dark:hover:bg-white/5'
                )}
              >
                <TableCell>
                  <StatusBadge status={isOnline ? 'online' : 'offline'} showIcon={false} />
                </TableCell>

                <TableCell className="font-mono">
                  <TruncatedText text={node.pubkey} maxLength={6} showCopy />
                </TableCell>

                <TableCell>
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
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm">
                      {formatBytes(node.storage_used)} /{' '}
                      {formatBytes(node.storage_committed)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(node.storage_usage_percent, 1)} used
                    </div>
                  </div>
                </TableCell>

                <TableCell>{formatDuration(node.uptime)}</TableCell>

                <TableCell>
                  <Badge variant="outline">{node.version}</Badge>
                </TableCell>

                <TableCell>
                  <TimeAgo timestamp={node.last_seen_timestamp} />
                </TableCell>

                <TableCell>
                  <Link href={`/explorer/${node.pubkey}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
