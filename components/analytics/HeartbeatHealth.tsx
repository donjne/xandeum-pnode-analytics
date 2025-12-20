'use client';

import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { Progress } from '@/components/ui/progress';
import { useHeartbeatAnalytics } from '@/hooks/use-heartbeat-analytics';
import { formatPercentage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function getHealthMeta(rate: number) {
  if (rate >= 98) return { label: 'Excellent', color: 'text-green-500' };
  if (rate >= 95) return { label: 'Good', color: 'text-blue-500' };
  if (rate >= 90) return { label: 'Fair', color: 'text-yellow-500' };
  return { label: 'Poor', color: 'text-red-500' };
}

export function HeartbeatHealth() {
  const { data, loading } = useHeartbeatAnalytics();

  /* -----------------------------
     Loading
  ------------------------------ */
  if (loading) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[220px] w-full rounded-md" />
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
          Heartbeat health will appear once daily snapshots are available.
        </p>
      </Card>
    );
  }

  /* -----------------------------
     Derived
  ------------------------------ */
  const latest = data[data.length - 1];
  const health = getHealthMeta(latest.success_rate);

  const chartData = data.map((d) => ({
    date: d.date,
    success: d.success,
    failed: d.failed,
    missed: d.missed,
  }));

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Heartbeat Health
          </div>
          <p className="text-xs text-muted-foreground">
            Network reliability · daily snapshots
          </p>
        </div>

        <div className="text-right">
          <p className={`text-sm font-medium ${health.color}`}>
            {health.label}
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatPercentage(latest.success_rate, 1)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Health bar */}
        <Progress value={latest.success_rate} className="h-2" />

        {/* Compact stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Successful</p>
            <p className="font-medium">{latest.success.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Failed</p>
            <p className="font-medium">{latest.failed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Missed</p>
            <p className="font-medium">{latest.missed.toLocaleString()}</p>
          </div>
        </div>

        {/* Historical context */}
        <AreaChart
          data={chartData}
          areas={[
            {
              dataKey: 'success',
              name: 'Success',
              color: '#10b981',
              stackId: '1',
            },
            {
              dataKey: 'failed',
              name: 'Failed',
              color: '#ef4444',
              stackId: '1',
            },
            {
              dataKey: 'missed',
              name: 'Missed',
              color: '#f59e0b',
              stackId: '1',
            },
          ]}
          xAxisKey="date"
          height={200}
          showLegend={false}
          useGradient={false}
        />
      </CardContent>
    </Card>
  );
}
