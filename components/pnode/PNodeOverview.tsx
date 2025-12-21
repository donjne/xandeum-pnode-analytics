'use client';

import {
  HardDrive,
  Server,
  Activity,
  Zap,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { PNode } from '@/lib/types/pnode';
import {
  formatBytes,
  formatDuration,
  formatPercentage,
  cn,
} from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface PNodeOverviewProps {
  node: PNode;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function PNodeOverview({ node }: PNodeOverviewProps) {
  const freeStorage =
    Math.max(node.storage_committed - node.storage_used, 0);

  return (
    <Card
      className={cn(
        'relative rounded-2xl border border-transparent',
        // light
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
        // dark
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Top metrics */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Metric
            icon={HardDrive}
            label="Storage Committed"
            value={formatBytes(node.storage_committed)}
          />
          <Metric
            icon={Server}
            label="Storage Used"
            value={formatBytes(node.storage_used)}
          />
          <Metric
            icon={Activity}
            label="Uptime"
            value={formatDuration(node.uptime)}
          />
          <Metric
            icon={Zap}
            label="Version"
            value={`v${node.version}`}
            mono
          />
        </div>

        {/* Storage utilization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Storage Utilization
            </h4>
            <span className="text-sm font-semibold">
              {formatPercentage(node.storage_usage_percent, 1)}
            </span>
          </div>

          <Progress
            value={node.storage_usage_percent}
            className="h-2"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatBytes(node.storage_used)} used</span>
            <span>{formatBytes(freeStorage)} free</span>
          </div>
        </div>

        {/* Technical details */}
        <div className="grid gap-3 border-t pt-6 text-sm">
          <Detail label="Address" mono>
            {node.address}
          </Detail>
          <Detail label="RPC Port" mono>
            {node.rpc_port}
          </Detail>
          <Detail label="Public">
            {node.is_public ? 'Yes' : 'No'}
          </Detail>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------
   Subcomponents
--------------------------------------------- */

function Metric({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div
        className={cn(
          'text-lg font-semibold',
          mono && 'font-mono'
        )}
      >
        {value}
      </div>
    </div>
  );
}

function Detail({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'text-right',
          mono && 'font-mono'
        )}
      >
        {children}
      </span>
    </div>
  );
}
