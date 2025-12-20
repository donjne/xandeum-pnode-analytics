'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { useNetworkGrowth } from '@/hooks/use-network-growth';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPercentage } from '@/lib/utils';

export function NetworkGrowthChart() {
  const { data, loading, error } = useNetworkGrowth(30);

  /* -----------------------------
     Loading
  ------------------------------ */
  if (loading) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[260px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  /* -----------------------------
     Empty / Not Ready
  ------------------------------ */
  if (error || data.length < 2) {
    return (
      <Card className="flex h-[340px] items-center justify-center">
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Network growth will appear once daily snapshots have been collected.
        </p>
      </Card>
    );
  }

  /* -----------------------------
     Derived values
  ------------------------------ */
  const latest = data[data.length - 1];
  const previous = data[data.length - 8] ?? data[0];

  const growth =
    previous.total > 0
      ? ((latest.total - previous.total) / previous.total) * 100
      : 0;

  const chartData = data.map((d) => ({
    date: d.date,
    total: d.total,
    online: d.online,
  }));

  const isPositive = growth >= 0;

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Network Growth
          </div>
          <p className="text-xs text-muted-foreground">
            Daily pNode count · last 30 days
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold tracking-tight">
            {latest.total.toLocaleString()}
          </p>
          <p
            className={`text-xs font-medium ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '↑' : '↓'} {formatPercentage(Math.abs(growth), 1)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <AreaChart
          data={chartData}
          areas={[
            {
              dataKey: 'total',
              name: 'Total Nodes',
              color: 'hsl(var(--primary))',
            },
            {
              dataKey: 'online',
              name: 'Online',
              color: '#10b981',
            },
          ]}
          xAxisKey="date"
          height={260}
          showLegend={false}
          useGradient={false}
        />
      </CardContent>
    </Card>
  );
}
