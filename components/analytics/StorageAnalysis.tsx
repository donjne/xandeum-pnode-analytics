'use client';

import { HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';
import { Progress } from '@/components/ui/progress';
import { useStorageAnalytics } from '@/hooks/use-storage-analytics';
import { formatBytes, formatPercentage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function StorageAnalysis() {
  const { data, loading } = useStorageAnalytics();

  /* -----------------------------
     Loading
  ------------------------------ */
  if (loading) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  /* -----------------------------
     Empty
  ------------------------------ */
  if (data.length === 0) {
    return (
      <Card className="flex h-[320px] items-center justify-center">
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Storage analytics will appear once daily snapshots are available.
        </p>
      </Card>
    );
  }

  /* -----------------------------
     Derived
  ------------------------------ */
  const latest = data[data.length - 1];

  const chartData = data.map((d) => ({
    date: d.date,
    committed: d.total_committed,
    used: d.total_used,
  }));

  const available = latest.total_committed - latest.total_used;

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="h-4 w-4" />
            Storage Utilization
          </div>
          <p className="text-xs text-muted-foreground">
            Network-wide capacity usage · daily snapshots
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Utilization</p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatPercentage(latest.utilization, 1)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Utilization bar */}
        <Progress value={latest.utilization} className="h-2" />

        {/* Capacity breakdown */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Committed</p>
            <p className="font-medium">
              {formatBytes(latest.total_committed)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Used</p>
            <p className="font-medium">
              {formatBytes(latest.total_used)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="font-medium">
              {formatBytes(available)}
            </p>
          </div>
        </div>

        {/* Historical trend */}
        <LineChart
          data={chartData}
          lines={[
            {
              dataKey: 'committed',
              name: 'Committed',
              color: 'hsl(var(--primary))',
              strokeWidth: 2,
            },
            {
              dataKey: 'used',
              name: 'Used',
              color: '#10b981',
              strokeWidth: 2,
            },
          ]}
          xAxisKey="date"
          height={200}
          showLegend={false}
          showGrid
        />
      </CardContent>
    </Card>
  );
}
